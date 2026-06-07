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

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://rondaprive.com";

const SUPPORTED_LANGS = ["es", "en", "pt", "fr"];
const DEFAULT_LANG = "es";

const ROUTE_SLUGS = {
  events:     { es: "eventos",       en: "events",       fr: "evenements",        pt: "eventos" },
  solutions:  { es: "soluciones",    en: "solutions",    fr: "solutions",         pt: "solucoes" },
  industries: { es: "industrias",    en: "industries",   fr: "industries",        pt: "industrias" },
  howItWorks: { es: "como-funciona", en: "how-it-works", fr: "comment-ca-marche", pt: "como-funciona" },
  benefits:   { es: "beneficios",    en: "benefits",     fr: "avantages",         pt: "beneficios" },
  insights:   { es: "insights",      en: "insights",     fr: "insights",          pt: "insights" },
  faq:        { es: "faq",           en: "faq",          fr: "faq",               pt: "faq" },
  glossary:   { es: "glosario",      en: "glossary",     fr: "lexique",           pt: "glossario" },
  contact:    { es: "contacto",      en: "contact",      fr: "contact",           pt: "contato" },
};

const PAGE_KEYS = ["home", ...Object.keys(ROUTE_SLUGS)];

const pathFor = (pageKey, lang) =>
  pageKey === "home" ? `/${lang}` : `/${lang}/${ROUTE_SLUGS[pageKey][lang]}`;

const today = new Date().toISOString().slice(0, 10);

const buildUrlEntry = (pageKey, lang) => {
  const loc = `${SITE}${pathFor(pageKey, lang)}`;
  const alternates = SUPPORTED_LANGS.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(pageKey, l)}" />`,
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pathFor(pageKey, DEFAULT_LANG)}" />`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
${alternates}
${xDefault}
  </url>`;
};

const urls = [];
for (const pageKey of PAGE_KEYS) {
  for (const lang of SUPPORTED_LANGS) {
    urls.push(buildUrlEntry(pageKey, lang));
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
