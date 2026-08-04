import { render, screen, act } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import PickupFlow from "@/components/sections/PickupFlow";
import i18n from "@/i18n";

/**
 * The phone follows live geometry on each scroll frame, so the tests drive it
 * the same way: stub each step's position, fire a scroll, read what shows.
 * jsdom reports every rect as zeroes, hence the prototype stub.
 */

/** Four, matching the four screens — the component asserts they line up. */
const STEPS = Array.from({ length: 4 }, (_, i) => ({
  title: `Paso ${i + 1}`,
  description: `Descripción del paso ${i + 1}`,
}));

const VIEWPORT = 1000;
/** Must mirror ACTIVATION_LINE in the component. */
const LINE = VIEWPORT * 0.45;

const realRect = Element.prototype.getBoundingClientRect;

/** Position every step: `tops[i]` is step i's distance from the viewport top. */
const positionSteps = (tops: number[]) => {
  Element.prototype.getBoundingClientRect = function () {
    const step = (this as HTMLElement).dataset?.step;
    const top = step == null ? 9999 : tops[Number(step)];
    return {
      top, bottom: top + 200, left: 0, right: 0, width: 0, height: 200,
      x: 0, y: top, toJSON: () => ({}),
    } as DOMRect;
  };
};

/**
 * Positions the list as if the visitor had scrolled `offset` pixels into the
 * section: step 0 starts just below the line and each one sits 300px lower.
 */
const SPACING = 300;
const scrollTo = async (offset: number) => {
  positionSteps(STEPS.map((_, i) => LINE - 10 + i * SPACING - offset));
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
  });
};

const renderFlow = async () => {
  await i18n.changeLanguage("es");
  return render(
    <I18nextProvider i18n={i18n}>
      <PickupFlow steps={STEPS} heading="Cómo funciona, paso a paso" />
    </I18nextProvider>,
  );
};

const activeScreen = () =>
  Number(
    document
      .querySelector('[data-screen][data-active="true"]')
      ?.getAttribute("data-screen"),
  );

const activeStepIndex = () =>
  [...document.querySelectorAll("li[data-step]")].findIndex((li) =>
    li.className.includes("border-primary"),
  );

describe("PickupFlow", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: VIEWPORT,
    });
    // The hook defers to rAF; run it synchronously so state lands in the act().
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    positionSteps(STEPS.map((_, i) => LINE - 10 + i * SPACING));
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = realRect;
    vi.restoreAllMocks();
  });

  it("renders every step as real text, not just as artwork", async () => {
    await renderFlow();
    for (const step of STEPS) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    }
  });

  it("starts on the first step and its screen", async () => {
    await renderFlow();
    expect(activeStepIndex()).toBe(0);
    expect(activeScreen()).toBe(0);
  });

  it("keeps the phone in step with the list", async () => {
    await renderFlow();
    for (const i of [0, 1, 2, 3]) {
      await scrollTo(i * SPACING);
      expect(activeStepIndex()).toBe(i);
      expect(activeScreen()).toBe(i);
    }
  });

  // The reported bug: the phone went from step 1 to step 4 and skipped the two
  // in between. A thin IntersectionObserver band reports threshold crossings,
  // and one scroll can carry several at once, so the middle steps were never
  // seen. Scrolling in fine increments must visit every step, in order.
  it("visits every step in order, skipping none", async () => {
    await renderFlow();
    const seen: number[] = [];
    for (let offset = 0; offset <= SPACING * 3; offset += 25) {
      await scrollTo(offset);
      const current = activeScreen();
      if (seen[seen.length - 1] !== current) seen.push(current);
    }
    expect(seen).toEqual([0, 1, 2, 3]);
  });

  // Even a jump bigger than a step's spacing must land on the right step
  // rather than on whichever one happened to be reported.
  it("lands on the right step after a jump past several", async () => {
    await renderFlow();
    await scrollTo(SPACING * 3);
    expect(activeScreen()).toBe(3);
    await scrollTo(SPACING);
    expect(activeScreen()).toBe(1);
  });

  it("shows exactly one screen at a time", async () => {
    await renderFlow();
    await scrollTo(SPACING * 2);
    const shown = [...document.querySelectorAll("[data-screen]")].filter(
      (el) => el.getAttribute("data-active") === "true",
    );
    expect(shown).toHaveLength(1);
  });

  it("holds the first step while the section is still below the line", async () => {
    await renderFlow();
    positionSteps(STEPS.map((_, i) => LINE + 200 + i * SPACING));
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(activeScreen()).toBe(0);
  });

  it("shows a distinct, correctly ordered screen for every step", async () => {
    await renderFlow();
    const sc = (k: string) => i18n.t(`product.pickup.screens.${k}`) as string;

    const expected = [
      sc("scanHint"), //         1 · escanea el QR de la barra
      sc("cartLabel"), //        2 · explora la carta y elige
      sc("processingLabel"), //  3 · paga
      sc("readyBanner"), //      4 · sigue tu pedido y retira
    ];

    // Every marker must be unique, or the assertion below proves nothing.
    expect(new Set(expected).size).toBe(expected.length);

    for (let i = 0; i < expected.length; i++) {
      await scrollTo(i * SPACING);
      const shown = document.querySelector('[data-screen][data-active="true"]');
      expect(shown?.textContent).toContain(expected[i]);
    }
  });

  it("never shows a later step's screen text on an earlier step", async () => {
    await renderFlow();
    const ready = i18n.t("product.pickup.screens.readyBanner") as string;
    // Step 3 is paying; the order cannot already be ready for pickup.
    await scrollTo(SPACING * 2);
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

  // A step's `note` is an optional caveat. It has to reach the page — it is
  // the only place the 4-digit code is mentioned — without being mistaken for
  // part of the step itself.
  // The last step used to show only the end state, so the change of state was
  // not visible at all. It now shows the order in preparation beside it. The
  // pair only means something if the two frames differ in the right ways.
  describe("the last step's pair of phones", () => {
    const goToLastStep = async () => {
      await renderFlow();
      await scrollTo(SPACING * (STEPS.length - 1));
      expect(activeScreen()).toBe(STEPS.length - 1);
    };

    it("shows one phone before the last step and two on it", async () => {
      await renderFlow();
      for (const i of [0, 1, 2]) {
        await scrollTo(i * SPACING);
        expect(document.querySelectorAll("[data-phone]")).toHaveLength(1);
        expect(document.querySelector('[data-phone="preparing"]')).toBeNull();
      }
      await scrollTo(SPACING * 3);
      expect(document.querySelectorAll("[data-phone]")).toHaveLength(2);
    });

    it("shows the order number on the preparing phone, without the code", async () => {
      await goToLastStep();
      const sc = (k: string) => i18n.t(`product.pickup.screens.${k}`) as string;
      const prep = document.querySelector('[data-phone="preparing"]');
      const text = prep?.textContent ?? "";

      expect(text).toContain(sc("preparingBanner"));
      expect(text).toContain(sc("orderNumber").replace(/^[A-Za-z]/, ""));
      // The code and the confirmation are what arriving adds — not before.
      expect(text).not.toContain(sc("codeLabel"));
      expect(text).not.toContain(sc("codeValue").split("").join(" "));
      expect(text).not.toContain(sc("readyBanner"));
      expect(prep?.querySelector("svg")).toBeNull();
    });

    it("keeps green off the preparing phone", async () => {
      await goToLastStep();
      const prep = document.querySelector('[data-phone="preparing"]');
      // The ready screen's green is a literal hex in the markup; the preparing
      // one must not carry it, nor an amber stand-in.
      expect(prep?.innerHTML).not.toContain("4F7A4A");
      expect(prep?.innerHTML ?? "").not.toMatch(/amber|bg-primary(?![-\w])/);
    });

    it("leaves the ready phone as it was", async () => {
      await goToLastStep();
      const sc = (k: string) => i18n.t(`product.pickup.screens.${k}`) as string;
      const ready = document.querySelector('[data-phone="order"]');
      const shown = ready?.querySelector('[data-screen][data-active="true"]');
      const text = shown?.textContent ?? "";

      expect(text).toContain(sc("readyBanner"));
      expect(text).toContain(sc("codeLabel"));
      expect(text).toContain(sc("readyHint"));
      expect(shown?.innerHTML).toContain("4F7A4A");
      expect(shown?.querySelector("svg")).not.toBeNull();
    });

    // The sticky phone needs 620px from the top of the viewport (112px offset
    // plus 508px of phone) and cannot extend past the bottom of its column,
    // whose height is the step list's. Halving the step height left the list
    // ending 613px down when step 04 activates — 7px short, so the phone was
    // pushed up behind the navbar exactly when this pair matters most. Two
    // things keep it on screen, and jsdom cannot measure either, so assert the
    // classes that encode them.
    it("keeps the room the sticky phone needs to stay on screen", async () => {
      await goToLastStep();
      // A margin here would make the row 548px tall and cost 40px of the
      // headroom; a transform offsets the frame without growing the row.
      const prep = document.querySelector('[data-phone="preparing"]');
      expect(prep?.className).toMatch(/translate-y-/);
      expect(prep?.className).not.toMatch(/\bm[ty]-/);

      // And the list carries a step's worth of padding, which is what gives
      // back the slack the taller steps used to provide.
      const list = document.querySelector("li[data-step]")?.closest("ol");
      expect(list?.className).toContain("lg:pb-52");
    });

    // Two 248px phones do not fit in this column below xl, and nothing may
    // animate between the two states.
    it("hides the preparing phone below xl and never transitions the pair", async () => {
      await goToLastStep();
      const prep = document.querySelector('[data-phone="preparing"]');
      expect(prep?.className).toContain("hidden");
      expect(prep?.className).toContain("xl:block");
      expect(prep?.className).not.toMatch(/transition|animate|duration/);
    });
  });

  // The payment screen showed only a total, so most of it was empty. It now
  // carries the order summary — the same order the menu screen shows, read from
  // one list so the two cannot drift apart and stop looking like one app.
  it("summarizes the same items and prices on the payment screen as on the menu", async () => {
    await renderFlow();
    const sc = (k: string) => i18n.t(`product.pickup.screens.${k}`) as string;
    const screens = [...document.querySelectorAll("[data-screen]")];
    const menu = screens[1]?.textContent ?? "";
    const pay = screens[2]?.textContent ?? "";

    for (const key of ["item1Name", "item1Price", "item2Name", "item2Price"]) {
      expect(menu).toContain(sc(key));
      expect(pay).toContain(sc(key));
    }
    // The total and the spinner still close the screen.
    expect(pay).toContain(sc("total"));
    expect(pay).toContain(sc("processingLabel"));
  });

  // The steps' desktop height is what spaces them out, so it decides how much
  // scroll each one owns. It was halved (46vh → min-h-52, 13rem), and the
  // failure mode of packing them tighter is a step that no visitor can ever
  // stop on: scroll past it and the phone jumps straight to the next. Every
  // step must still be reachable at the real spacing, not just at a roomy one.
  const LG_STEP_HEIGHT = 208; // min-h-52, mirrored from the component

  it("gives every step its own screen at the real desktop spacing", async () => {
    await renderFlow();
    for (let i = 0; i < STEPS.length; i++) {
      // Position the list as if step i's top had just crossed the line.
      positionSteps(STEPS.map((_, j) => LINE - 5 + (j - i) * LG_STEP_HEIGHT));
      await act(async () => {
        window.dispatchEvent(new Event("scroll"));
      });
      expect(activeStepIndex()).toBe(i);
      expect(activeScreen()).toBe(i);
    }
  });

  it("visits every step in order at the real desktop spacing too", async () => {
    await renderFlow();
    const seen: number[] = [];
    // 8px divides the total travel exactly, so the sweep lands on the last
    // step's threshold rather than stopping just short of it.
    for (let offset = 0; offset <= LG_STEP_HEIGHT * 3; offset += 8) {
      positionSteps(STEPS.map((_, i) => LINE - 5 + i * LG_STEP_HEIGHT - offset));
      await act(async () => {
        window.dispatchEvent(new Event("scroll"));
      });
      const cur = activeScreen();
      if (seen[seen.length - 1] !== cur) seen.push(cur);
    }
    expect(seen).toEqual([0, 1, 2, 3]);
  });

  it("renders a step's note under its description, quieter than it", async () => {
    await i18n.changeLanguage("es");
    render(
      <I18nextProvider i18n={i18n}>
        <PickupFlow
          steps={STEPS.map((s, i) => (i === 3 ? { ...s, note: "Nota del paso 4" } : s))}
          heading="Cómo funciona, paso a paso"
        />
      </I18nextProvider>,
    );

    const note = screen.getByText("Nota del paso 4");
    expect(note.className).toContain("text-xs");
    expect(note.previousElementSibling).toHaveTextContent("Descripción del paso 4");
  });
});
