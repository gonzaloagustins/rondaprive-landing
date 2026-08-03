import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Navbar from "@/components/layout/Navbar";
import i18n from "@/i18n";

const renderAt = async (pathname: string) => {
  await i18n.changeLanguage("es");
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[pathname]}>
        <Navbar />
      </MemoryRouter>
    </I18nextProvider>,
  );
};

/** The nav entries, read back as {label, active, ariaCurrent}. */
const navState = () => {
  const nav = document.querySelector("header nav");
  return [...(nav?.children ?? [])].map((el) => {
    const target = el.tagName === "DIV" ? el.querySelector("button")! : el;
    return {
      label: target.textContent?.trim().split("\n")[0] ?? "",
      // The active style is the only difference between the two class sets.
      active: target.className.includes("text-foreground/70") === false,
      ariaCurrent: target.getAttribute("aria-current"),
    };
  });
};

const activeLabels = () =>
  navState()
    .filter((i) => i.active)
    .map((i) => i.label);

describe("Navbar active state", () => {
  // The reported bug: opening a capability page from the footer left the whole
  // menu dark, because matching was by URL equality instead of by ownership.
  it("lights Producto — and only Producto — on a capability page", async () => {
    await renderAt("/es/producto/compra-anticipada");
    expect(activeLabels()).toEqual(["Producto"]);
  });

  it("lights Producto on the hub too", async () => {
    await renderAt("/es/producto");
    expect(activeLabels()).toEqual(["Producto"]);
  });

  // Not listed in the dropdown, but still product territory — owning a page and
  // listing it are separate things, and the alternative is a dark menu.
  it("lights Producto on Cómo funciona, which it owns without listing", async () => {
    await renderAt("/es/como-funciona");
    expect(activeLabels()).toEqual(["Producto"]);
    const hrefs = [...document.querySelectorAll("#product-menu a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).not.toContain("/es/como-funciona");
  });

  it("lights Soluciones on the industries page it owns", async () => {
    await renderAt("/es/industrias");
    const soluciones = navState().find((i) => i.label === "Soluciones");
    expect(activeLabels()).toEqual(["Soluciones"]);
    // The link points at exactly this page, so it is "page", not "true".
    expect(soluciones?.ariaCurrent).toBe("page");
  });

  it("marks a child page as inside the zone rather than as the page itself", async () => {
    await renderAt("/es/beneficios");
    const beneficios = navState().find((i) => i.label === "Beneficios");
    expect(beneficios?.active).toBe(true);
    expect(beneficios?.ariaCurrent).toBe("page");
  });

  it("leaves the menu dark on an unrelated page", async () => {
    await renderAt("/es/glosario");
    expect(activeLabels()).toEqual([]);
  });
});

describe("Navbar product menu", () => {
  // The capabilities and nothing else: an overview row duplicated the footer
  // and the breadcrumb, and a how-it-works row duplicated these pages.
  it("lists the four capabilities and nothing else", async () => {
    await renderAt("/es/producto");
    const hrefs = [...document.querySelectorAll("#product-menu a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual([
      "/es/producto/compra-anticipada",
      "/es/producto/entrega-en-asiento",
      "/es/producto/compra-y-retiro",
      "/es/producto/operacion-de-cocina",
    ]);
  });

  it("is a collapsed disclosure until it is opened", async () => {
    await renderAt("/es/producto");
    const trigger = screen.getByRole("button", { name: /Producto/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await act(async () => {
      trigger.click();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("marks the open capability inside the menu", async () => {
    await renderAt("/es/producto/compra-y-retiro");
    const current = [...document.querySelectorAll("#product-menu a")].filter(
      (a) => a.getAttribute("aria-current") === "page",
    );
    expect(current.map((a) => a.getAttribute("href"))).toEqual([
      "/es/producto/compra-y-retiro",
    ]);
  });
});

describe("Navbar scroll spy on the home", () => {
  const original = Element.prototype.getBoundingClientRect;

  // Place #producto just above the 120px activation line and the others below.
  const stubSectionPositions = (tops: Record<string, number>) => {
    Element.prototype.getBoundingClientRect = function () {
      const top = tops[this.id] ?? 9999;
      return { top, bottom: top + 100, left: 0, right: 0, width: 0, height: 100, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
    };
  };

  beforeEach(() => {
    for (const id of ["soluciones", "producto", "beneficios", "contacto"]) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = original;
    document.querySelectorAll("body > div[id]").forEach((el) => el.remove());
    vi.restoreAllMocks();
  });

  it("lights the section the visitor has scrolled to", async () => {
    stubSectionPositions({ soluciones: -700, producto: 10, beneficios: 900, contacto: 1400 });
    // The spy defers to rAF; run it synchronously so the state lands.
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    await renderAt("/es");
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(activeLabels()).toEqual(["Producto"]);
    // The trigger is a button, so it marks itself as the current menu item
    // rather than borrowing the link-only "page"/"location" values.
    const producto = navState().find((i) => i.label === "Producto");
    expect(producto?.ariaCurrent).toBe("true");
  });

  it("moves the highlight as the visitor scrolls further", async () => {
    stubSectionPositions({ soluciones: -1600, producto: -900, beneficios: 20, contacto: 800 });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    await renderAt("/es");
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    const beneficios = navState().find((i) => i.label === "Beneficios");
    expect(activeLabels()).toEqual(["Beneficios"]);
    expect(beneficios?.ariaCurrent).toBe("location");
  });
});
