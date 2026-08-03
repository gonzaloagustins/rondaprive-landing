#!/usr/bin/env node
/**
 * Multi-language sitemap generator.
 *
 * Emits `dist/sitemap.xml` with one <url> per language per logical page, each
 * carrying <xhtml:link rel="alternate" hreflang="..."> entries pointing to
 * every other language version. Search engines need the alternates on every
 * URL (not just the canonical) to understand the language graph.
 */
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INSIGHT_POSTS } from "./insights-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://rondaprive.com";

const SUPPORTED_LANGS = ["es", "en", "pt", "fr"];
const DEFAULT_LANG = "es";

// `solutions` is intentionally absent: /producto replaced it and the old slug
// only serves a redirect now, so it must not be advertised to crawlers.
const ROUTE_SLUGS = {
  events:     { es: "eventos",       en: "events",       fr: "evenements",        pt: "eventos" },
  product:    { es: "producto",      en: "product",      fr: "produit",           pt: "produto" },
  industries: { es: "industrias",    en: "industries",   fr: "industries",        pt: "industrias" },
  howItWorks: { es: "como-funciona", en: "how-it-works", fr: "comment-ca-marche", pt: "como-funciona" },
  benefits:   { es: "beneficios",    en: "benefits",     fr: "avantages",         pt: "beneficios" },
  insights:   { es: "insights",      en: "insights",     fr: "insights",          pt: "insights" },
  faq:        { es: "faq",           en: "faq",          fr: "faq",               pt: "faq" },
  glossary:   { es: "glosario",      en: "glossary",     fr: "lexique",           pt: "glossario" },
  contact:    { es: "contacto",      en: "contact",      fr: "contact",           pt: "contato" },
};

// Mirror of PRODUCT_MODE_SLUGS in src/i18n/routes.ts.
const PRODUCT_MODE_SLUGS = {
  preorder: { es: "compra-anticipada",   en: "pre-order",          fr: "precommande",         pt: "compra-antecipada" },
  seat:     { es: "entrega-en-asiento",  en: "seat-delivery",      fr: "livraison-au-siege",  pt: "entrega-no-assento" },
  pickup:   { es: "compra-y-retiro",     en: "order-and-pickup",   fr: "commande-et-retrait", pt: "compra-e-retirada" },
  kitchen:  { es: "operacion-de-cocina", en: "kitchen-operations", fr: "operations-cuisine",  pt: "operacao-de-cozinha" },
};

const PAGE_KEYS = ["home", ...Object.keys(ROUTE_SLUGS)];

const pathFor = (pageKey, lang) =>
  pageKey === "home" ? `/${lang}` : `/${lang}/${ROUTE_SLUGS[pageKey][lang]}`;

const today = new Date().toISOString().slice(0, 10);

const buildUrlEntry = (pathForLang, lang, lastmod) => {
  const loc = `${SITE}${pathForLang(lang)}`;
  const alternates = SUPPORTED_LANGS.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${pathForLang(l)}" />`,
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pathForLang(DEFAULT_LANG)}" />`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
${alternates}
${xDefault}
  </url>`;
};

const urls = [];
for (const pageKey of PAGE_KEYS) {
  for (const lang of SUPPORTED_LANGS) {
    urls.push(buildUrlEntry((l) => pathFor(pageKey, l), lang, today));
  }
}
// One URL per capability under /producto. These are the pages meant to rank
// for intent-level searches, so they belong in the sitemap individually.
for (const mode of Object.keys(PRODUCT_MODE_SLUGS)) {
  for (const lang of SUPPORTED_LANGS) {
    urls.push(
      buildUrlEntry(
        (l) => `${pathFor("product", l)}/${PRODUCT_MODE_SLUGS[mode][l]}`,
        lang,
        today,
      ),
    );
  }
}
// Insight articles carry their real publication date as lastmod so crawlers
// get an honest freshness signal instead of the build date.
for (const post of INSIGHT_POSTS) {
  for (const lang of SUPPORTED_LANGS) {
    urls.push(
      buildUrlEntry(
        (l) => `${pathFor("insights", l)}/${post.slug}`,
        lang,
        post.date,
      ),
    );
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

// Write to both dist (for serving) and public (so dev server has it too).
const distDir = join(ROOT, "dist");
const publicDir = join(ROOT, "public");
if (existsSync(distDir)) {
  await writeFile(join(distDir, "sitemap.xml"), xml);
  console.log(`✓ dist/sitemap.xml (${urls.length} urls)`);
}
await mkdir(publicDir, { recursive: true });
await writeFile(join(publicDir, "sitemap.xml"), xml);
console.log(`✓ public/sitemap.xml (${urls.length} urls)`);
