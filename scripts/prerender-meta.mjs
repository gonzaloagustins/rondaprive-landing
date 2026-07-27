#!/usr/bin/env node
/**
 * Per-route + per-language prerender.
 *
 * The site is a Vite SPA (createRoot().render(), not hydrateRoot()). Modern
 * Googlebot executes JS so it picks up runtime meta from <SEO> components,
 * but two other audiences only see the static HTML:
 *
 *   1. Link-preview scrapers (Twitter, Slack, WhatsApp, email).
 *   2. AI crawlers that don't execute JS (GPTBot, ClaudeBot,
 *      PerplexityBot, OAI-SearchBot, etc.) — the audience that decides
 *      whether ChatGPT/Claude/Perplexity can cite you.
 *
 * For each (page, language) pair we emit a tailored HTML file containing:
 *   - The right <title>, <meta description>, canonical, og:* and twitter:*
 *   - hreflang alternates for all supported languages
 *   - A semantic <main> block with the actual page content (h1/h2/p/ul)
 *     extracted from the i18n locale JSON, placed INSIDE <div id="root">.
 *     It renders as real first-paint content: bots read it as first-class
 *     page content (not <noscript>, which Google discounts and Readability
 *     -style extractors drop), users on slow connections see readable text
 *     instead of a blank screen, and createRoot().render() replaces it the
 *     moment React mounts.
 *   - A FAQPage JSON-LD on the FAQ pages.
 *
 * The same fallback body is also injected into the shell index.html, so
 * that even when the host falls back to "/" for unknown routes, AI bots
 * still receive content instead of an empty <div id="root"></div>.
 *
 * Pulls everything from the i18n source: locale JSONs and the ROUTE_SLUGS
 * mirror are the single source of truth.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { INSIGHT_POSTS } from "./insights-data.mjs";

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
  glossary:   { es: "glosario",      en: "glossary",     fr: "lexique",           pt: "glossario" },
  contact:    { es: "contacto",      en: "contact",      fr: "contact",           pt: "contato" },
};

// Mirror of src/data/glossary.ts — display order + category per term id.
// IDs are stable across languages so anchor links work in any locale.
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
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const titleLine = (t, key) => {
  const node = t[key];
  if (!node) return "";
  const parts = [node.title, node.titleHighlight].filter(Boolean);
  if (parts.length) return parts.join(" ");
  return node.heroTitle && node.heroHighlight
    ? `${node.heroTitle} ${node.heroHighlight}`
    : node.heroTitle || "";
};

// ---------------------------------------------------------------------------
// Per-page semantic body blocks. Each builder returns the inner HTML of the
// <main data-prerender> block that wrapBodyBlock() places inside
// <div id="root">. Kept verbose on purpose — AI crawlers reward concrete,
// factual content with clear hierarchy.
// ---------------------------------------------------------------------------

// StatsBar renders bare figures with no heading in the UI, but an unlabelled
// list of numbers reads as noise to a crawler. This heading exists only in the
// prerendered markup, so it lives here instead of polluting the locale JSONs
// with a key no component consumes.
const STATS_HEADING = {
  es: "Resultados",
  en: "Results",
  pt: "Resultados",
  fr: "Résultats",
};

// Section order and copy keys mirror src/pages/Home.tsx. When a section is
// added, removed or reordered there, mirror it here — otherwise the static
// HTML describes a page that no longer exists.
const homeBlock = (t, lang) => {
  const hero = t.hero || {};
  const formats = t.eventosActivos || {};
  const platform = t.plataforma || {};
  const products = platform.products || {};
  const dashboard = t.dashboardPreview || {};
  const summary = t.benefitsSummary || {};
  const stats = (t.statsBar && t.statsBar.items) || [];
  const preview = t.industriesPreview || {};
  const industries = t.industries || {};
  const cta = t.cta || {};

  const heroTitle = [hero.headlineLine1, hero.headlineLine2].filter(Boolean).join(" ");
  const joined = (node, ...fields) => fields.map((f) => node[f]).filter(Boolean).join(" ");
  const para = (s) => (s ? `<p>${escapeHtml(s)}</p>` : "");
  const list = (items, tag = "ul") =>
    items.length ? `<${tag}>${items.join("")}</${tag}>` : "";
  // Drops the whole section when the locale has neither heading nor body, so a
  // missing translation degrades to silence instead of an empty <h2>.
  const section = (heading, ...parts) => {
    const body = parts.filter(Boolean).join("");
    if (!heading && !body) return "";
    return `<section>${heading ? `<h2>${escapeHtml(heading)}</h2>` : ""}${body}</section>`;
  };

  // Product order mirrors productsMeta in PlataformaSection.tsx.
  const renderProduct = (key) => {
    const p = products[key];
    if (!p) return "";
    return `<article><h3>${escapeHtml(p.title || p.label || key)}</h3>${para(p.label)}${list(
      (p.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`),
    )}${list((p.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`), "ol")}</article>`;
  };

  const renderIndustry = (key) => {
    const i = industries[key];
    if (!i) return "";
    const labels = preview.labels || {};
    const useCases = (preview.useCases || {})[key] || [];
    return `<article><h3>${escapeHtml(i.title)}</h3>${para(i.description)}${
      i.problem
        ? `<p><strong>${escapeHtml(labels.problem || "Problema")}:</strong> ${escapeHtml(i.problem)}</p>`
        : ""
    }${
      i.solution
        ? `<p><strong>${escapeHtml(labels.solution || "Solución")}:</strong> ${escapeHtml(i.solution)}</p>`
        : ""
    }${list(useCases.map((c) => `<li>${escapeHtml(c)}</li>`))}</article>`;
  };

  const summaryCard = (key) => {
    const c = (summary.cards || {})[key];
    return c
      ? `<li><strong>${escapeHtml(c.title)}:</strong> ${escapeHtml(c.description)}</li>`
      : "";
  };

  return `
  <header>
    <h1>${escapeHtml(heroTitle || "Ronda Privé")}</h1>
    ${para(hero.badge)}
  </header>
  ${section(formats.title, para(formats.subtitle))}
  ${section(
    platform.heading,
    para(platform.subtitle),
    renderProduct("preorder"),
    renderProduct("seat"),
    renderProduct("pickup"),
  )}
  ${section(
    joined(dashboard, "headline", "headlineHighlight"),
    para(dashboard.description),
    list(
      (dashboard.modules || []).map(
        (m) => `<li><strong>${escapeHtml(m.title)}:</strong> ${escapeHtml(m.subtitle)}</li>`,
      ),
    ),
  )}
  ${section(
    joined(summary, "titleStart", "titleHighlight"),
    para(summary.subtitle),
    list(["sales", "experience", "control", "scale"].map(summaryCard).filter(Boolean)),
  )}
  ${section(
    stats.length ? STATS_HEADING[lang] || STATS_HEADING[DEFAULT_LANG] : "",
    list(stats.map((s) => `<li><strong>${escapeHtml(s.value)}:</strong> ${escapeHtml(s.label)}</li>`)),
  )}
  ${section(
    preview.title || titleLine(t, "industries"),
    para(preview.subtitle),
    renderIndustry("nightclubs"),
    renderIndustry("festivals"),
    renderIndustry("stadiums"),
    renderIndustry("bars"),
  )}
  ${section(
    joined(cta, "titleStart", "titleHighlight"),
    para(cta.subtitle),
    list((cta.benefits || []).map((b) => `<li>${escapeHtml(b)}</li>`)),
  )}
  `;
};

const eventsBlock = (t) => {
  const e = t.events || {};
  return `
  <header>
    <h1>${escapeHtml(`${e.heroTitle || ""} ${e.heroHighlight || ""}`.trim() || "Eventos")}</h1>
    ${e.heroSubtitle ? `<p>${escapeHtml(e.heroSubtitle)}</p>` : ""}
  </header>
  <section>
    <h2>${escapeHtml(e.active || "Eventos activos")}</h2>
    <p>${escapeHtml(e.heroSubtitle || "")}</p>
  </section>
  `;
};

const solutionsBlock = (t) => {
  const s = t.solutions || {};
  const renderMode = (key) => {
    const m = s[key];
    if (!m) return "";
    const steps = (m.steps || [])
      .map((step) => `<li><strong>${escapeHtml(step.title)}:</strong> ${escapeHtml(step.description)}</li>`)
      .join("");
    return `
      <article>
        <h3>${escapeHtml(m.title)}</h3>
        ${m.subtitle ? `<p>${escapeHtml(m.subtitle)}</p>` : ""}
        <ol>${steps}</ol>
      </article>
    `;
  };
  return `
  <header>
    <h1>${escapeHtml(`${s.heroTitle || ""} ${s.heroHighlight || ""}`.trim() || "Soluciones")}</h1>
    ${s.heroSubtitle ? `<p>${escapeHtml(s.heroSubtitle)}</p>` : ""}
  </header>
  ${renderMode("preorder")}
  ${renderMode("pickup")}
  ${renderMode("seat")}
  ${
    s.kitchen
      ? `<article><h3>${escapeHtml(s.kitchen.title)}</h3>${s.kitchen.subtitle ? `<p>${escapeHtml(s.kitchen.subtitle)}</p>` : ""}${s.kitchen.description ? `<p>${escapeHtml(s.kitchen.description)}</p>` : ""}</article>`
      : ""
  }
  `;
};

const industriesBlock = (t) => {
  const i = t.industries || {};
  const renderInd = (key) => {
    const node = i[key];
    if (!node) return "";
    return `
      <article>
        <h3>${escapeHtml(node.title)}</h3>
        <p>${escapeHtml(node.description)}</p>
        ${node.problem ? `<p><strong>Problema:</strong> ${escapeHtml(node.problem)}</p>` : ""}
        ${node.solution ? `<p><strong>Solución:</strong> ${escapeHtml(node.solution)}</p>` : ""}
      </article>
    `;
  };
  return `
  <header>
    <h1>${escapeHtml(titleLine(t, "industries"))}</h1>
    ${i.subtitle ? `<p>${escapeHtml(i.subtitle)}</p>` : ""}
  </header>
  ${renderInd("nightclubs")}
  ${renderInd("festivals")}
  ${renderInd("stadiums")}
  ${renderInd("bars")}
  `;
};

const howItWorksBlock = (t) => {
  const h = t.howItWorks || {};
  const renderFlow = (key, label) => {
    const node = h[key];
    if (!node) return "";
    const steps = (node.steps || [])
      .map((s) => `<li><strong>${escapeHtml(s.title)}:</strong> ${escapeHtml(s.description)}</li>`)
      .join("");
    return `<section><h3>${escapeHtml(label)}</h3><ol>${steps}</ol></section>`;
  };
  const tabs = h.tabs || {};
  return `
  <header>
    <h1>${escapeHtml(titleLine(t, "howItWorks"))}</h1>
    ${h.subtitle ? `<p>${escapeHtml(h.subtitle)}</p>` : ""}
  </header>
  ${renderFlow("attendee", tabs.attendee || "Para asistentes")}
  ${renderFlow("kitchen", tabs.kitchen || "Para barra y cocina")}
  ${renderFlow("organizer", tabs.organizer || "Para organizadores")}
  `;
};

const benefitsBlock = (t) => {
  const b = t.benefits || {};
  const group = (key) => {
    const g = b[key];
    if (!g) return "";
    const items = (g.items || [])
      .map((i) => `<li><strong>${escapeHtml(i.title)}:</strong> ${escapeHtml(i.description)}</li>`)
      .join("");
    return `<section><h3>${escapeHtml(g.title)}</h3><ul>${items}</ul></section>`;
  };
  return `
  <header>
    <h1>${escapeHtml(titleLine(t, "benefits"))}</h1>
  </header>
  ${group("commercial")}
  ${group("experience")}
  ${group("operational")}
  ${group("technical")}
  `;
};

const insightsBlock = (t, lang) => {
  const i = t.insights || {};
  const posts = INSIGHT_POSTS.map((post) => {
    const p = i[post.postKey];
    if (!p) return "";
    const href = `/${lang}/${ROUTE_SLUGS.insights[lang]}/${post.slug}`;
    return `<article><h3><a href="${href}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(p.excerpt)}</p></article>`;
  }).join("");
  return `
  <header>
    <h1>${escapeHtml(`${i.heroTitle || ""} ${i.heroHighlight || ""}`.trim() || "Insights")}</h1>
    ${i.heroSubtitle ? `<p>${escapeHtml(i.heroSubtitle)}</p>` : ""}
  </header>
  ${posts}
  `;
};

// Body block for a single insight article: title, publication date, intro and
// every section — the citable long-form content AI crawlers are after.
const insightArticleBlock = (t, post, lang) => {
  const p = (t.insights || {})[post.postKey];
  if (!p) return "";
  const sections = (p.sections || [])
    .map((s) => {
      const paragraphs = String(s.body)
        .split("\n\n")
        .map((par) => `<p>${escapeHtml(par)}</p>`)
        .join("");
      return `<section><h2>${escapeHtml(s.heading)}</h2>${paragraphs}</section>`;
    })
    .join("");
  const backHref = `/${lang}/${ROUTE_SLUGS.insights[lang]}`;
  return `
  <article>
    <header>
      <h1>${escapeHtml(p.title)}</h1>
      <p><time datetime="${post.date}">${post.date}</time></p>
    </header>
    ${p.intro ? `<p>${escapeHtml(p.intro)}</p>` : ""}
    ${sections}
    <footer><a href="${backHref}">${escapeHtml((t.insights || {}).backToInsights || "Insights")}</a></footer>
  </article>
  `;
};

const buildArticleJsonLd = (t, post, lang, url) => {
  const p = (t.insights || {})[post.postKey];
  if (!p) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: p.title,
        description: p.excerpt,
        image: post.image,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: lang,
        mainEntityOfPage: url,
        author: { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Insights",
            item: `${SITE}/${lang}/${ROUTE_SLUGS.insights[lang]}`,
          },
          { "@type": "ListItem", position: 2, name: p.title, item: url },
        ],
      },
    ],
  };
};

const faqBlock = (t) => {
  const f = t.faq || {};
  const pairs = collectFaqPairs(f);
  const items = pairs
    .map(
      ({ q, a }) =>
        `<article><h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p></article>`,
    )
    .join("");
  return `
  <header>
    <h1>${escapeHtml(`${f.heroTitle || ""} ${f.heroHighlight || ""}`.trim() || "FAQ")}</h1>
    ${f.heroSubtitle ? `<p>${escapeHtml(f.heroSubtitle)}</p>` : ""}
  </header>
  ${items}
  `;
};

const contactBlock = (t) => {
  const c = t.contact || {};
  return `
  <header>
    <h1>${escapeHtml(`${c.heroTitle || ""} ${c.heroHighlight || ""}`.trim() || "Contacto")}</h1>
    ${c.heroSubtitle ? `<p>${escapeHtml(c.heroSubtitle)}</p>` : ""}
  </header>
  ${c.formTitle ? `<section><h2>${escapeHtml(c.formTitle)}</h2>${c.formSubtitle ? `<p>${escapeHtml(c.formSubtitle)}</p>` : ""}</section>` : ""}
  `;
};

const glossaryBlock = (t) => {
  const g = t.glossary || {};
  const terms = (g.terms || {});
  const cats = g.categories || {};
  const renderCat = (catKey) => {
    const ids = GLOSSARY_TERMS.filter((e) => e.category === catKey).map((e) => e.id);
    if (!ids.length) return "";
    const entries = ids
      .map((id) => {
        const node = terms[id];
        if (!node) return "";
        return `<article id="${id}"><dt><strong>${escapeHtml(node.term)}</strong></dt><dd>${escapeHtml(node.definition)}</dd></article>`;
      })
      .join("");
    return `<section><h2>${escapeHtml(cats[catKey] || catKey)}</h2><dl>${entries}</dl></section>`;
  };
  return `
  <header>
    <h1>${escapeHtml(`${g.heroTitle || ""} ${g.heroHighlight || ""}`.trim() || "Glosario")}</h1>
    ${g.heroSubtitle ? `<p>${escapeHtml(g.heroSubtitle)}</p>` : ""}
  </header>
  ${GLOSSARY_CATEGORIES.map(renderCat).join("")}
  `;
};

const BLOCK_BUILDERS = {
  home: homeBlock,
  events: eventsBlock,
  solutions: solutionsBlock,
  industries: industriesBlock,
  howItWorks: howItWorksBlock,
  benefits: benefitsBlock,
  insights: insightsBlock,
  faq: faqBlock,
  glossary: glossaryBlock,
  contact: contactBlock,
};

// Walk q1/a1, q2/a2, ... pairs out of the FAQ locale node.
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

const buildFaqJsonLd = (t) => {
  const pairs = collectFaqPairs(t.faq);
  if (!pairs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
};

// One Service node per modality. Each one references the existing
// #organization in the shell's @graph so AI agents can resolve "who provides
// this" without us repeating company fields. AreaServed lists the LATAM
// countries we currently focus on — keep this in sync with reality.
const SERVICE_DEFS = [
  {
    id: "preorder",
    label: "Compra anticipada",
    serviceType: "Mobile food and beverage pre-order",
    locale: "solutionsOverview.preorder",
  },
  {
    id: "pickup",
    label: "Compra y Retiro",
    serviceType: "Mobile food and beverage pickup",
    locale: "solutionsOverview.pickup",
  },
  {
    id: "seat",
    label: "Compra desde el asiento",
    serviceType: "In-seat food and beverage delivery",
    locale: "solutionsOverview.seat",
  },
];

const AREA_SERVED = ["CL", "AR", "CO", "MX", "BR", "PE", "EC", "UY", "ES"];

const getByPath = (obj, path) => path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

// Builds a schema.org/DefinedTermSet — one DefinedTerm per glossary entry.
// Emitted on the glossary page and re-emitted on the shell so AI crawlers
// pick it up wherever they land first.
const buildDefinedTermSetJsonLd = (t) => {
  const terms = (t.glossary && t.glossary.terms) || {};
  const nodes = GLOSSARY_TERMS.map((entry) => {
    const node = terms[entry.id];
    if (!node) return null;
    return {
      "@type": "DefinedTerm",
      "@id": `${SITE}/#term-${entry.id}`,
      name: node.term,
      description: node.definition,
      termCode: entry.id,
      inDefinedTermSet: `${SITE}/#glossary`,
    };
  }).filter(Boolean);
  if (!nodes.length) return null;
  const g = t.glossary || {};
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE}/#glossary`,
    name: `${g.heroTitle || "Glosario"} ${g.heroHighlight || ""}`.trim(),
    description: g.heroSubtitle || "",
    hasDefinedTerm: nodes,
  };
};

const buildServicesJsonLd = (t) => {
  const nodes = SERVICE_DEFS.map((def) => {
    const node = getByPath(t, def.locale);
    if (!node) return null;
    return {
      "@type": "Service",
      "@id": `${SITE}/#service-${def.id}`,
      name: node.title || def.label,
      serviceType: def.serviceType,
      description: node.description || "",
      provider: { "@id": `${SITE}/#organization` },
      areaServed: AREA_SERVED.map((c) => ({ "@type": "Country", identifier: c })),
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Event organizers, festivals, stadiums, venues, nightclubs, bars",
      },
    };
  }).filter(Boolean);
  if (!nodes.length) return null;
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
};

// Inline styles keep the pre-React flash readable and on-brand; they ride on
// the element itself because the CSS bundle may not have loaded yet.
const PRERENDER_MAIN_STYLE =
  "font-family:Inter,system-ui,sans-serif;background:#F5F0EB;color:#1A1814;" +
  "max-width:72ch;margin:0 auto;padding:2rem 1.5rem;line-height:1.6";

const wrapBodyBlock = (inner) =>
  inner ? `<main data-prerender style="${PRERENDER_MAIN_STYLE}">${inner}</main>` : "";

const buildBodyBlock = (pageKey, t, lang) => {
  const builder = BLOCK_BUILDERS[pageKey];
  if (!builder) return "";
  return wrapBodyBlock(builder(t, lang));
};

const replaceTag = (html, regex, replacement) => html.replace(regex, replacement);

const rewrite = (shell, { lang, title, description, url, alternates, bodyBlock, faqJsonLd, servicesJsonLd, definedTermSetJsonLd, articleJsonLd, ogImage }) => {
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
  if (ogImage) {
    out = replaceTag(
      out,
      /(<meta property="og:image" content=")[^"]*(")/,
      `$1${escapeAttr(ogImage)}$2`,
    );
    out = replaceTag(
      out,
      /(<meta name="twitter:image" content=")[^"]*(")/,
      `$1${escapeAttr(ogImage)}$2`,
    );
  }

  // Strip any prior hreflang alternates and any prior generated blocks so
  // re-runs stay clean.
  out = out.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/?>/g, "");
  out = out.replace(
    /[ \t]*<!-- ai-prerender:start -->[\s\S]*?<!-- ai-prerender:end -->\n?/g,
    "",
  );
  out = out.replace(
    /[ \t]*<!-- faq-jsonld:start -->[\s\S]*?<!-- faq-jsonld:end -->\n?/g,
    "",
  );
  out = out.replace(
    /[ \t]*<!-- services-jsonld:start -->[\s\S]*?<!-- services-jsonld:end -->\n?/g,
    "",
  );
  out = out.replace(
    /[ \t]*<!-- glossary-jsonld:start -->[\s\S]*?<!-- glossary-jsonld:end -->\n?/g,
    "",
  );
  out = out.replace(
    /[ \t]*<!-- article-jsonld:start -->[\s\S]*?<!-- article-jsonld:end -->\n?/g,
    "",
  );

  // Inject hreflang alternates + (optionally) FAQPage JSON-LD into <head>.
  const altTags = alternates
    .map(
      ({ lang: l, href }) =>
        `    <link rel="alternate" hreflang="${l}" href="${escapeAttr(href)}" />`,
    )
    .join("\n");
  const xDefault = alternates.find((a) => a.lang === DEFAULT_LANG);
  const wrapJsonLd = (label, json) =>
    `    <!-- ${label}:start -->\n    <script type="application/ld+json">\n${JSON.stringify(json, null, 2)
      .split("\n")
      .map((l) => "    " + l)
      .join("\n")}\n    </script>\n    <!-- ${label}:end -->\n`;
  const faqHeadBlock = faqJsonLd ? wrapJsonLd("faq-jsonld", faqJsonLd) : "";
  const servicesHeadBlock = servicesJsonLd ? wrapJsonLd("services-jsonld", servicesJsonLd) : "";
  const glossaryHeadBlock = definedTermSetJsonLd ? wrapJsonLd("glossary-jsonld", definedTermSetJsonLd) : "";
  const articleHeadBlock = articleJsonLd ? wrapJsonLd("article-jsonld", articleJsonLd) : "";
  out = out.replace(
    /<\/head>/,
    `${altTags}\n    <link rel="alternate" hreflang="x-default" href="${escapeAttr(xDefault ? xDefault.href : url)}" />\n${faqHeadBlock}${servicesHeadBlock}${glossaryHeadBlock}${articleHeadBlock}  </head>`,
  );

  // Inject the per-route AI-readable body INSIDE <div id="root">, so it is
  // visible first-paint content. createRoot().render() clears the container
  // when React mounts, so JS users only see it while the bundle loads.
  if (bodyBlock) {
    const marker = `\n    <!-- ai-prerender:start -->\n    ${bodyBlock}\n    <!-- ai-prerender:end -->\n    `;
    out = out.replace(
      /<div id="root">(?:[\s\S]*?)<\/div>/,
      `<div id="root">${marker}</div>`,
    );
  }

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

    const bodyBlock = buildBodyBlock(pageKey, translations[lang], lang);
    const faqJsonLd = pageKey === "faq" ? buildFaqJsonLd(translations[lang]) : null;
    // Services schema goes on every page — the modalities define what
    // the company offers regardless of which page the bot landed on.
    const servicesJsonLd = buildServicesJsonLd(translations[lang]);
    // DefinedTermSet ships only on the glossary page (where it's primary
    // content) to avoid bloating every other HTML with 25 nodes.
    const definedTermSetJsonLd =
      pageKey === "glossary" ? buildDefinedTermSetJsonLd(translations[lang]) : null;

    const html = rewrite(shell, {
      lang,
      title,
      description,
      url,
      alternates,
      bodyBlock,
      faqJsonLd,
      servicesJsonLd,
      definedTermSetJsonLd,
    });

    const outDir = join(DIST, relPath.replace(/^\//, ""));
    const outFile = join(outDir, "index.html");
    await mkdir(outDir, { recursive: true });
    await writeFile(outFile, html);
    // GitHub Pages resolves /es/eventos from es/eventos.html directly (200),
    // while the directory form alone would 301 to /es/eventos/. Emitting both
    // keeps the extensionless sitemap URLs redirect-free.
    await writeFile(join(DIST, `${relPath.replace(/^\//, "")}.html`), html);
    console.log(`✓ ${relPath} → ${outFile} (+ ${relPath}.html)`);
    count++;
  }
}

// Insight article pages — one long-form HTML per (post, language). These are
// the citable URLs: full body content, Article + BreadcrumbList JSON-LD and
// the post image as og:image.
for (const post of INSIGHT_POSTS) {
  const alternates = SUPPORTED_LANGS.map((lang) => ({
    lang,
    href: `${SITE}/${lang}/${ROUTE_SLUGS.insights[lang]}/${post.slug}`,
  }));

  for (const lang of SUPPORTED_LANGS) {
    const t = translations[lang];
    const p = t?.insights?.[post.postKey];
    if (!p) continue;
    const title = `${p.title}${TITLE_SUFFIX}`;
    const relPath = `/${lang}/${ROUTE_SLUGS.insights[lang]}/${post.slug}`;
    const url = `${SITE}${relPath}`;

    const html = rewrite(shell, {
      lang,
      title,
      description: p.excerpt || "",
      url,
      alternates,
      bodyBlock: wrapBodyBlock(insightArticleBlock(t, post, lang)),
      servicesJsonLd: buildServicesJsonLd(t),
      articleJsonLd: buildArticleJsonLd(t, post, lang, url),
      ogImage: post.image,
    });

    const outDir = join(DIST, relPath.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html);
    await writeFile(join(DIST, `${relPath.replace(/^\//, "")}.html`), html);
    console.log(`✓ ${relPath} (article)`);
    count++;
  }
}

// Finally, rewrite the shell index.html itself so the host's SPA fallback
// still serves AI-readable content + FAQPage schema + the default-lang
// home block. This is the safety net while the host isn't serving the
// per-route files above.
const defaultT = translations[DEFAULT_LANG];
const shellAlternates = SUPPORTED_LANGS.map((lang) => ({
  lang,
  href: `${SITE}${pathFor("home", lang)}`,
}));
const shellSeo = defaultT?.seo?.home ?? defaultT?.seo?.default;
const shellRawTitle = shellSeo?.title || "Ronda Privé";
const shellTitle = shellRawTitle.includes("Ronda Privé")
  ? shellRawTitle
  : `${shellRawTitle}${TITLE_SUFFIX}`;
const shellDescription = shellSeo?.description || "";
const shellHtml = rewrite(shell, {
  lang: DEFAULT_LANG,
  title: shellTitle,
  description: shellDescription,
  // "/" client-side-redirects to /es, so the shell's canonical must point at
  // the redirect target — a self-canonical on a redirecting URL sends Google
  // contradictory signals.
  url: `${SITE}/${DEFAULT_LANG}`,
  alternates: shellAlternates,
  bodyBlock: buildBodyBlock("home", defaultT, DEFAULT_LANG),
  faqJsonLd: buildFaqJsonLd(defaultT),
  servicesJsonLd: buildServicesJsonLd(defaultT),
  // The shell is the de-facto entry point right now (host falls back to it
  // for unknown routes). Carrying the DefinedTermSet here means any URL
  // a crawler hits exposes the full glossary as structured data, matching
  // how we already treat FAQPage.
  definedTermSetJsonLd: buildDefinedTermSetJsonLd(defaultT),
});
await writeFile(SHELL, shellHtml);
console.log(`✓ / (shell) → ${SHELL}`);
count++;

console.log(
  `\nGenerated ${count} HTML files (${PAGE_KEYS.length} pages + ${INSIGHT_POSTS.length} articles × ${SUPPORTED_LANGS.length} languages + shell).`,
);
