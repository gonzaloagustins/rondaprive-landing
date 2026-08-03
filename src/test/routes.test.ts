import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import {
  PRODUCT_MODES,
  PRODUCT_MODE_SLUGS,
  ROUTE_SLUGS,
  SUPPORTED_LANGS,
  localizedPath,
  pageKeyFromSlug,
  productModeFromSlug,
  swapLangInPath,
  type Lang,
} from "@/i18n/routes";

describe("product routes", () => {
  it("localizes the capability slug, not just the parent", () => {
    expect(localizedPath("productDetail", "es", "/preorder")).toBe(
      "/es/producto/compra-anticipada",
    );
    expect(localizedPath("productDetail", "en", "/preorder")).toBe(
      "/en/product/pre-order",
    );
    expect(localizedPath("productDetail", "fr", "/kitchen")).toBe(
      "/fr/produit/operations-cuisine",
    );
  });

  it("resolves every slug in every language back to its mode", () => {
    for (const mode of PRODUCT_MODES) {
      for (const lang of SUPPORTED_LANGS) {
        expect(productModeFromSlug(PRODUCT_MODE_SLUGS[mode][lang])).toBe(mode);
      }
    }
  });

  it("never reuses a slug across capabilities", () => {
    const slugs = PRODUCT_MODES.flatMap((m) =>
      SUPPORTED_LANGS.map((l) => PRODUCT_MODE_SLUGS[m][l]),
    );
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("swapLangInPath", () => {
  // The language switcher used to carry the current language's child slug into
  // the new path, which 404s: /es/producto/compra-anticipada -> /en/product/…
  it("translates both segments of a capability page", () => {
    expect(swapLangInPath("/es/producto/compra-anticipada", "en")).toBe(
      "/en/product/pre-order",
    );
    expect(swapLangInPath("/en/product/seat-delivery", "pt")).toBe(
      "/pt/produto/entrega-no-assento",
    );
  });

  it("round-trips every capability through every language pair", () => {
    for (const mode of PRODUCT_MODES) {
      for (const from of SUPPORTED_LANGS) {
        for (const to of SUPPORTED_LANGS) {
          expect(swapLangInPath(localizedPath("productDetail", from, `/${mode}`), to)).toBe(
            localizedPath("productDetail", to, `/${mode}`),
          );
        }
      }
    }
  });

  it("still handles the hub and unrelated pages", () => {
    expect(swapLangInPath("/es/producto", "fr")).toBe("/fr/produit");
    expect(swapLangInPath("/es/industrias", "en")).toBe("/en/industries");
  });

  it("keeps the retired solutions slug resolvable so old links can redirect", () => {
    expect(pageKeyFromSlug("soluciones")).toBe("solutions");
  });
});

// The slug tables are mirrored by hand into three build scripts, because those
// run in plain Node without a TS transform. Nothing at runtime catches a
// mismatch — a stale mirror silently emits sitemap and prerender URLs that
// don't exist. These tests are that safety net.
describe("build script slug mirrors", () => {
  const readScript = (name: string) =>
    readFileSync(join(process.cwd(), "scripts", name), "utf8");

  /** Pull an object literal like `const NAME = { ... };` out of a script. */
  const extractTable = (source: string, name: string) => {
    const start = source.indexOf(`const ${name} = {`);
    if (start === -1) throw new Error(`${name} not found`);
    const open = source.indexOf("{", start);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}") {
        depth--;
        if (depth === 0) {
          return eval(`(${source.slice(open, i + 1)})`) as Record<
            string,
            Partial<Record<Lang, string>>
          >;
        }
      }
    }
    throw new Error(`${name} is unbalanced`);
  };

  const scripts = [
    "generate-sitemap.mjs",
    "prerender-meta.mjs",
    "generate-llms-full.mjs",
  ];

  for (const script of scripts) {
    it(`${script} mirrors PRODUCT_MODE_SLUGS`, () => {
      const mirror = extractTable(readScript(script), "PRODUCT_MODE_SLUGS");
      expect(Object.keys(mirror).sort()).toEqual([...PRODUCT_MODES].sort());
      for (const mode of PRODUCT_MODES) {
        // llms-full only covers es/en, so compare the languages it declares.
        for (const lang of Object.keys(mirror[mode]) as Lang[]) {
          expect(mirror[mode][lang]).toBe(PRODUCT_MODE_SLUGS[mode][lang]);
        }
      }
    });

    it(`${script} mirrors the product page slug and drops the retired one`, () => {
      const mirror = extractTable(readScript(script), "ROUTE_SLUGS");
      expect(mirror.product).toBeDefined();
      for (const lang of Object.keys(mirror.product) as Lang[]) {
        expect(mirror.product[lang]).toBe(ROUTE_SLUGS.product[lang]);
      }
      // /soluciones only serves a redirect now, so it must not be advertised.
      expect(mirror.solutions).toBeUndefined();
    });
  }
});
