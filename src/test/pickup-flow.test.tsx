import { render, screen, act } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import PickupFlow from "@/components/sections/PickupFlow";
import i18n from "@/i18n";

/**
 * The phone is driven by an IntersectionObserver, which jsdom doesn't
 * implement. We stub it, keep the callback, and fire it by hand — that is what
 * lets us assert the actual contract: step N on screen means screen N on the
 * phone.
 */
type Cb = (entries: { target: Element; isIntersecting: boolean }[]) => void;

let observerCb: Cb | null = null;
let observed: Element[] = [];

class StubObserver {
  constructor(cb: Cb) {
    observerCb = cb;
  }
  observe(el: Element) {
    observed.push(el);
  }
  disconnect() {
    observed = [];
  }
  unobserve() {}
}

/** Four, matching the four screens — the component asserts they line up. */
const STEPS = Array.from({ length: 4 }, (_, i) => ({
  title: `Paso ${i + 1}`,
  description: `Descripción del paso ${i + 1}`,
}));

const renderFlow = async () => {
  await i18n.changeLanguage("es");
  return render(
    <I18nextProvider i18n={i18n}>
      <PickupFlow steps={STEPS} heading="Cómo funciona, paso a paso" />
    </I18nextProvider>,
  );
};

/** Fire the observer as if `index`'s step had scrolled into the middle band. */
const scrollStepIntoBand = (index: number) =>
  act(() => {
    observerCb?.([{ target: observed[index], isIntersecting: true }]);
  });

const activeScreen = () =>
  Number(document.querySelector('[data-screen][data-active="true"]')?.getAttribute("data-screen"));

const activeStepIndex = () =>
  [...document.querySelectorAll("ol > li")].findIndex((li) =>
    li.className.includes("border-primary"),
  );

describe("PickupFlow", () => {
  beforeEach(() => {
    observerCb = null;
    observed = [];
    vi.stubGlobal("IntersectionObserver", StubObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders every step as real text, not just as artwork", async () => {
    await renderFlow();
    for (const step of STEPS) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    }
  });

  it("observes one element per step", async () => {
    await renderFlow();
    expect(observed).toHaveLength(STEPS.length);
  });

  it("starts on the first step and its screen", async () => {
    await renderFlow();
    expect(activeStepIndex()).toBe(0);
    expect(activeScreen()).toBe(0);
  });

  it("keeps the phone in step with the list", async () => {
    await renderFlow();
    for (const i of [3, 1, 2, 0]) {
      await scrollStepIntoBand(i);
      expect(activeStepIndex()).toBe(i);
      expect(activeScreen()).toBe(i);
    }
  });

  it("shows exactly one screen at a time", async () => {
    await renderFlow();
    await scrollStepIntoBand(2);
    const shown = [...document.querySelectorAll("[data-screen]")].filter(
      (el) => el.getAttribute("data-active") === "true",
    );
    expect(shown).toHaveLength(1);
  });

  // A scroll jump can leave the thin band empty. Resetting to step 1 there
  // would flash the first screen in the middle of the page.
  it("holds the last step when nothing is in the band", async () => {
    await renderFlow();
    await scrollStepIntoBand(3);
    await act(async () => {
      observerCb?.([{ target: observed[3], isIntersecting: false }]);
    });
    expect(activeScreen()).toBe(3);
  });

  // Steps 3 and 4 once shared a title, so step 3 showed step 4's wording and
  // the two screens looked identical — the flow read as out of order. This pins
  // each step to text only its own screen has, in order.
  it("shows a distinct, correctly ordered screen for every step", async () => {
    await renderFlow();
    const sc = (k: string) => i18n.t(`product.pickup.screens.${k}`) as string;

    const expected = [
      sc("scanHint"), //         1 · escanea el QR de la barra
      sc("cartLabel"), //        2 · explora la carta y elige
      sc("processingLabel"), //  3 · paga
      sc("readyBanner"), //      4 · retira, y listo
    ];

    // Every marker must be unique, or the assertion below proves nothing.
    expect(new Set(expected).size).toBe(expected.length);

    for (let i = 0; i < expected.length; i++) {
      await scrollStepIntoBand(i);
      const shown = document.querySelector('[data-screen][data-active="true"]');
      expect(shown?.textContent).toContain(expected[i]);
    }
  });

  it("never shows a later step's screen text on an earlier step", async () => {
    await renderFlow();
    const ready = i18n.t("product.pickup.screens.readyBanner") as string;
    // Step 3 is paying; the order cannot already be ready for pickup.
    await scrollStepIntoBand(2);
    const stepThree = document.querySelector('[data-screen][data-active="true"]');
    expect(stepThree?.textContent).not.toContain(ready);
  });

  // The screens are hardcoded while the steps come from the catalog, so a copy
  // edit that adds or drops a step would silently desync the two.
  it("has exactly one screen per step in the catalog", async () => {
    await i18n.changeLanguage("es");
    const catalogSteps = i18n.t("product.pickup.steps", {
      returnObjects: true,
    }) as unknown[];
    await renderFlow();
    expect(document.querySelectorAll("[data-screen]")).toHaveLength(
      catalogSteps.length,
    );
  });

  it("hides the phone from assistive tech, since the list carries the content", async () => {
    await renderFlow();
    const phone = document.querySelector("[data-screen]")?.closest("[aria-hidden]");
    expect(phone).not.toBeNull();
  });
});
