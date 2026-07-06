#!/usr/bin/env node
/**
 * llms-full.txt generator (https://llmstxt.org).
 *
 * While llms.txt is a table of contents, llms-full.txt carries the actual
 * site content as plain markdown so LLMs and AI crawlers can quote it
 * without fetching and parsing every route. Built from the same i18n locale
 * JSONs the prerender uses, so it never drifts from the rendered site.
 *
 * Emits the full content in Spanish (primary) and English, plus pointers to
 * the Portuguese and French routes — duplicating four languages would bloat
 * the file without adding citable substance.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INSIGHT_POSTS } from "./insights-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://rondaprive.com";

const FULL_LANGS = ["es", "en"];

// Mirror of src/i18n/routes.ts ROUTE_SLUGS — keep in sync if you add a page.
const ROUTE_SLUGS = {
  events:     { es: "eventos",       en: "events" },
  solutions:  { es: "soluciones",    en: "solutions" },
  industries: { es: "industrias",    en: "industries" },
  howItWorks: { es: "como-funciona", en: "how-it-works" },
  benefits:   { es: "beneficios",    en: "benefits" },
  insights:   { es: "insights",      en: "insights" },
  faq:        { es: "faq",           en: "faq" },
  glossary:   { es: "glosario",      en: "glossary" },
  contact:    { es: "contacto",      en: "contact" },
};

// Mirror of src/data/glossary.ts — display order + category per term id.
const GLOSSARY_TERMS = [
  { id: "compra-anticipada",     category: "sales" },
  { id: "compra-y-retiro",       category: "sales" },
  { id: "entrega-en-asiento",    category: "sales" },
  { id: "fila-digital",          category: "sales" },
  { id: "numero-de-orden",       category: "sales" },
  { id: "punto-de-venta",        category: "venue" },
  { id: "totem-de-autoservicio", category: "venue" },
  { id: "carta-digital",         category: "venue" },
  { id: "inventario-tiempo-real",category: "venue" },
  { id: "dashboard",             category: "venue" },
  { id: "pwa",                   category: "tech" },
  { id: "qr",                    category: "tech" },
  { id: "modo-cache",            category: "tech" },
  { id: "trazabilidad",          category: "tech" },
  { id: "cloud",                 category: "tech" },
  { id: "venue",                 category: "spaces" },
  { id: "suite",                 category: "spaces" },
  { id: "palco",                 category: "spaces" },
  { id: "hospitality",           category: "spaces" },
  { id: "festival",              category: "spaces" },
  { id: "coffee-shop",           category: "spaces" },
  { id: "ticket-promedio",       category: "metrics" },
  { id: "tiempo-de-espera",      category: "metrics" },
  { id: "rotacion-de-barra",     category: "metrics" },
  { id: "tasa-de-conversion",    category: "metrics" },
];
const GLOSSARY_CATEGORIES = ["sales", "venue", "tech", "spaces", "metrics"];

const pathFor = (pageKey, lang) =>
  pageKey === "home" ? `/${lang}` : `/${lang}/${ROUTE_SLUGS[pageKey][lang]}`;

const urlFor = (pageKey, lang) => `${SITE}${pathFor(pageKey, lang)}`;

const loadLocale = async (lang) =>
  JSON.parse(
    await readFile(join(ROOT, "src", "i18n", "locales", `${lang}.json`), "utf8"),
  );

const collectFaqPairs = (faqNode) => {
  if (!faqNode) return [];
  const pairs = [];
  for (let i = 1; i <= 30; i++) {
    const q = faqNode[`q${i}`];
    const a = faqNode[`a${i}`];
    if (q && a) pairs.push({ q, a });
  }
  return pairs;
};

const itemList = (items) =>
  (items || []).map((i) => `- **${i.title}:** ${i.description}`).join("\n");

const stepList = (steps) =>
  (steps || []).map((s, n) => `${n + 1}. **${s.title}:** ${s.description}`).join("\n");

const heroLine = (node) =>
  `${node?.heroTitle || ""} ${node?.heroHighlight || ""}`.trim();

const langSection = (lang, t) => {
  const out = [];
  const push = (s) => s && out.push(s.trim());

  // --- Home ---
  const hero = t.hero || {};
  const heroTitle = [hero.headlineLine1, hero.headlineLine2].filter(Boolean).join(" ");
  push(`## ${heroTitle || "Ronda Privé"}\nURL: ${urlFor("home", lang)}\n\n${hero.badge || ""}`);

  const problem = t.problem || {};
  push(`### ${[problem.title, problem.titleHighlight].filter(Boolean).join(" ")}\n\n${itemList(problem.items)}`);

  const sol = t.solutionsOverview || {};
  const solCards = ["preorder", "pickup", "seat"]
    .map((k) => (sol[k] ? `- **${sol[k].title}:** ${sol[k].description}` : ""))
    .filter(Boolean)
    .join("\n");
  push(`### ${[sol.title, sol.titleHighlight].filter(Boolean).join(" ")}\n\n${sol.subtitle || ""}\n\n${solCards}`);

  const stats = (t.statsBar && t.statsBar.items) || [];
  if (stats.length) {
    push(`### ${(t.statsBar && t.statsBar.title) || "Stats"}\n\n${stats.map((s) => `- **${s.value}:** ${s.label}`).join("\n")}`);
  }

  // --- Solutions detail ---
  const s = t.solutions || {};
  const modes = ["preorder", "pickup", "seat"]
    .map((k) => {
      const m = s[k];
      if (!m) return "";
      return `#### ${m.title}\n\n${m.subtitle || ""}\n\n${stepList(m.steps)}`;
    })
    .filter(Boolean)
    .join("\n\n");
  const kitchen = s.kitchen
    ? `#### ${s.kitchen.title}\n\n${[s.kitchen.subtitle, s.kitchen.description].filter(Boolean).join("\n\n")}`
    : "";
  push(`### ${heroLine(s) || "Soluciones"}\nURL: ${urlFor("solutions", lang)}\n\n${s.heroSubtitle || ""}\n\n${modes}\n\n${kitchen}`);

  // --- Industries ---
  const ind = t.industries || {};
  const inds = ["nightclubs", "festivals", "stadiums", "bars"]
    .map((k) => {
      const node = ind[k];
      if (!node) return "";
      const extra = [
        node.problem ? `  - Problema: ${node.problem}` : "",
        node.solution ? `  - Solución: ${node.solution}` : "",
      ].filter(Boolean).join("\n");
      return `- **${node.title}:** ${node.description}${extra ? `\n${extra}` : ""}`;
    })
    .filter(Boolean)
    .join("\n");
  push(`### ${[ind.title, ind.titleHighlight].filter(Boolean).join(" ")}\nURL: ${urlFor("industries", lang)}\n\n${ind.subtitle || ""}\n\n${inds}`);

  // --- How it works ---
  const h = t.howItWorks || {};
  const tabs = h.tabs || {};
  const flows = [
    ["attendee", tabs.attendee],
    ["kitchen", tabs.kitchen],
    ["organizer", tabs.organizer],
  ]
    .map(([k, label]) => (h[k] ? `#### ${label || k}\n\n${stepList(h[k].steps)}` : ""))
    .filter(Boolean)
    .join("\n\n");
  push(`### ${[h.title, h.titleHighlight].filter(Boolean).join(" ")}\nURL: ${urlFor("howItWorks", lang)}\n\n${h.subtitle || ""}\n\n${flows}`);

  // --- Benefits ---
  const b = t.benefits || {};
  const groups = ["commercial", "experience", "operational", "technical"]
    .map((k) => (b[k] ? `#### ${b[k].title}\n\n${itemList(b[k].items)}` : ""))
    .filter(Boolean)
    .join("\n\n");
  push(`### ${[b.title, b.titleHighlight].filter(Boolean).join(" ")}\nURL: ${urlFor("benefits", lang)}\n\n${groups}`);

  // --- FAQ ---
  const faq = t.faq || {};
  const pairs = collectFaqPairs(faq);
  if (pairs.length) {
    const qa = pairs.map(({ q, a }) => `#### ${q}\n\n${a}`).join("\n\n");
    push(`### ${heroLine(faq) || "FAQ"}\nURL: ${urlFor("faq", lang)}\n\n${qa}`);
  }

  // --- Glossary ---
  const g = t.glossary || {};
  const terms = g.terms || {};
  const cats = g.categories || {};
  const glossaryMd = GLOSSARY_CATEGORIES.map((catKey) => {
    const entries = GLOSSARY_TERMS.filter((e) => e.category === catKey)
      .map((e) => {
        const node = terms[e.id];
        return node ? `- **${node.term}:** ${node.definition}` : "";
      })
      .filter(Boolean)
      .join("\n");
    return entries ? `#### ${cats[catKey] || catKey}\n\n${entries}` : "";
  })
    .filter(Boolean)
    .join("\n\n");
  if (glossaryMd) {
    push(`### ${heroLine(g) || "Glosario"}\nURL: ${urlFor("glossary", lang)}\n\n${g.heroSubtitle || ""}\n\n${glossaryMd}`);
  }

  // --- Insight articles (full body) ---
  const insightsNode = t.insights || {};
  for (const post of INSIGHT_POSTS) {
    const p = insightsNode[post.postKey];
    if (!p || !p.sections) continue;
    const sections = p.sections
      .map((s) => `#### ${s.heading}\n\n${s.body}`)
      .join("\n\n");
    const dateLabel = lang === "es" ? "Fecha" : "Published";
    push(
      `### ${p.title}\nURL: ${urlFor("insights", lang)}/${post.slug}\n${dateLabel}: ${post.date}\n\n${p.intro || p.excerpt || ""}\n\n${sections}`,
    );
  }

  // --- Contact ---
  const c = t.contact || {};
  push(`### ${heroLine(c) || "Contacto"}\nURL: ${urlFor("contact", lang)}\n\n${[c.heroSubtitle, c.formSubtitle].filter(Boolean).join("\n\n")}`);

  return out.join("\n\n");
};

const translations = {};
for (const lang of FULL_LANGS) translations[lang] = await loadLocale(lang);

const esSeo = translations.es?.seo?.home ?? translations.es?.seo?.default ?? {};

const doc = `# Ronda Privé — contenido completo del sitio

> ${esSeo.description || "Plataforma tecnológica premium para eventos, festivales y venues."}

Contacto: info@rondaprive.com — ${SITE}
Índice del sitio para LLMs: ${SITE}/llms.txt

# Español

${langSection("es", translations.es)}

# English

${langSection("en", translations.en)}

# Outros idiomas / Autres langues

- Português: ${SITE}/pt
- Français: ${SITE}/fr
`;

// Write to both dist (for serving) and public (so dev server has it too).
const distDir = join(ROOT, "dist");
const publicDir = join(ROOT, "public");
if (existsSync(distDir)) {
  await writeFile(join(distDir, "llms-full.txt"), doc);
  console.log(`✓ dist/llms-full.txt (${(doc.length / 1024).toFixed(1)} KB)`);
}
await mkdir(publicDir, { recursive: true });
await writeFile(join(publicDir, "llms-full.txt"), doc);
console.log(`✓ public/llms-full.txt (${(doc.length / 1024).toFixed(1)} KB)`);
