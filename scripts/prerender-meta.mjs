#!/usr/bin/env node
/**
 * Per-route + per-language meta prerender.
 *
 * The site is a Vite SPA. Modern Googlebot executes JS so it picks up the
 * runtime meta tags from <SEO> components, but link-preview scrapers
 * (Twitter, Slack, WhatsApp, email clients) only read the static HTML. We
 * generate one index.html per supported language and per logical page so
 * those scrapers see the right meta no matter which URL they hit.
 *
 * Pulls translations and slug data straight from the i18n source: the
 * locale JSONs and src/i18n/routes.ts are the single source of truth.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://rondaprive.com";
const DIST = join(ROOT, "dist");
const SHELL = join(DIST, "index.html");
const TITLE_SUFFIX = " | Ronda Privé";

const SUPPORTED_LANGS = ["es", "en", "pt", "fr"];
const DEFAULT_LANG = "es";

const OG_LOCALE = {
  es: "es_LA",
  en: "en_US",
  pt: "pt_BR",
  fr: "fr_FR",
};

// Mirror of src/i18n/routes.ts ROUTE_SLUGS. Pure JSON for easy reading from
// Node without a TS transform; keep in sync if you add a page.
const ROUTE_SLUGS = {
  events:     { es: "eventos",       en: "events",       fr: "evenements",        pt: "eventos" },
  solutions:  { es: "soluciones",    en: "solutions",    fr: "solutions",         pt: "solucoes" },
  industries: { es: "industrias",    en: "industries",   fr: "industries",        pt: "industrias" },
  howItWorks: { es: "como-funciona", en: "how-it-works", fr: "comment-ca-marche", pt: "como-funciona" },
  benefits:   { es: "beneficios",    en: "benefits",     fr: "avantages",         pt: "beneficios" },
  insights:   { es: "insights",      en: "insights",     fr: "insights",          pt: "insights" },
  faq:        { es: "faq",           en: "faq",          fr: "faq",               pt: "faq" },
  contact:    { es: "contacto",      en: "contact",      fr: "contact",           pt: "contato" },
};

const PAGE_KEYS = ["home", ...Object.keys(ROUTE_SLUGS)];

const loadTranslations = async () => {
  const t = {};
  for (const lang of SUPPORTED_LANGS) {
    const raw = await readFile(
      join(ROOT, "src", "i18n", "locales", `${lang}.json`),
      "utf8",
    );
    t[lang] = JSON.parse(raw);
  }
  return t;
};

const pathFor = (pageKey, lang) => {
  if (pageKey === "home") return `/${lang}`;
  return `/${lang}/${ROUTE_SLUGS[pageKey][lang]}`;
};

const escapeAttr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const replaceTag = (html, regex, replacement) => html.replace(regex, replacement);

const rewrite = (shell, { lang, title, description, url, alternates }) => {
  const ogLocale = OG_LOCALE[lang];
  let out = shell;

  out = replaceTag(out, /<html\s+lang="[^"]*"/, `<html lang="${lang}"`);
  out = replaceTag(
    out,
    /<title>[^<]*<\/title>/,
    `<title>${escapeAttr(title)}</title>`,
  );
  out = replaceTag(
    out,
    /(<meta name="description" content=")[^"]*(")/,
    `$1${escapeAttr(description)}$2`,
  );
  out = replaceTag(
    out,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${escapeAttr(url)}$2`,
  );
  out = replaceTag(
    out,
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${escapeAttr(url)}$2`,
  );
  out = replaceTag(
    out,
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${escapeAttr(title)}$2`,
  );
  out = replaceTag(
    out,
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${escapeAttr(description)}$2`,
  );
  out = replaceTag(
    out,
    /(<meta property="og:locale" content=")[^"]*(")/,
    `$1${ogLocale}$2`,
  );
  out = replaceTag(
    out,
    /(<meta name="twitter:title" content=")[^"]*(")/,
    `$1${escapeAttr(title)}$2`,
  );
  out = replaceTag(
    out,
    /(<meta name="twitter:description" content=")[^"]*(")/,
    `$1${escapeAttr(description)}$2`,
  );

  // Inject hreflang alternates right before </head>. Strip any existing
  // alternates from the shell first so re-runs stay clean.
  out = out.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/?>/g, "");
  const altTags = alternates
    .map(
      ({ lang: l, href }) =>
        `    <link rel="alternate" hreflang="${l}" href="${escapeAttr(href)}" />`,
    )
    .join("\n");
  out = out.replace(
    /<\/head>/,
    `${altTags}\n    <link rel="alternate" hreflang="x-default" href="${escapeAttr(alternates.find((a) => a.lang === DEFAULT_LANG).href)}" />\n  </head>`,
  );

  return out;
};

if (!existsSync(SHELL)) {
  console.error(`✗ Shell not found at ${SHELL}. Run \`vite build\` first.`);
  process.exit(1);
}

const shell = await readFile(SHELL, "utf8");
const translations = await loadTranslations();
let count = 0;

for (const pageKey of PAGE_KEYS) {
  const alternates = SUPPORTED_LANGS.map((lang) => ({
    lang,
    href: `${SITE}${pathFor(pageKey, lang)}`,
  }));

  for (const lang of SUPPORTED_LANGS) {
    const seo = translations[lang]?.seo?.[pageKey] ?? translations[lang]?.seo?.default;
    if (!seo) continue;
    const rawTitle = seo.title || translations[lang].seo.default.title;
    const title = rawTitle.includes("Ronda Privé") ? rawTitle : `${rawTitle}${TITLE_SUFFIX}`;
    const description = seo.description || translations[lang].seo.default.description;
    const relPath = pathFor(pageKey, lang);
    const url = `${SITE}${relPath}`;

    const html = rewrite(shell, { lang, title, description, url, alternates });

    const outDir = join(DIST, relPath.replace(/^\//, ""));
    const outFile = join(outDir, "index.html");
    await mkdir(outDir, { recursive: true });
    await writeFile(outFile, html);
    console.log(`✓ ${relPath} → ${outFile}`);
    count++;
  }
}

console.log(
  `\nGenerated ${count} per-route HTML files (${PAGE_KEYS.length} pages × ${SUPPORTED_LANGS.length} languages).`,
);
