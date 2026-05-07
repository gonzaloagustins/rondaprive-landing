#!/usr/bin/env node
/**
 * Per-route meta prerender.
 *
 * The site is a Vite SPA. Modern Googlebot executes JS so it picks up the
 * runtime meta tags from <SEO> components, but scrapers without a JS engine
 * (Twitter, Slack, WhatsApp link previews, most email clients) only read the
 * static HTML. Without prerendering they all see the home page's meta
 * regardless of which URL they're scraping.
 *
 * This script runs after `vite build`. It reads the built shell at
 * dist/index.html and produces one per-route index.html with the title,
 * description, canonical, og:* and twitter:* tags rewritten for that route.
 * GitHub Pages then serves dist/eventos/index.html when something requests
 * /eventos, and the scraper sees the right meta.
 *
 * No Puppeteer, no SSR runtime — just a regex rewrite of the static shell.
 *
 * Note: keep ROUTES below in sync with the <SEO> components in src/pages/.
 * Single source of truth would be a JSON file imported by both, but the
 * duplication is small (~10 routes × 2 fields) and the cost of drift is mild.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://rondaprive.com";
const DIST = "dist";
const SHELL = join(DIST, "index.html");
const TITLE_SUFFIX = " | Ronda Privé";

const ROUTES = [
  // Home — already has correct meta in the shell, skipped.
  {
    path: "/eventos",
    title: "Eventos activos",
    description:
      "Eventos en vivo donde Ronda Privé está operando. Compra anticipada, entrega al asiento y retiro express.",
  },
  {
    path: "/soluciones",
    title: "Soluciones",
    description:
      "Compra anticipada, entrega al asiento y pickup express. Las tres formas de Ronda Privé para eliminar las filas en eventos y venues.",
  },
  {
    path: "/industrias",
    title: "Soluciones por industria",
    description:
      "Cómo Ronda Privé se adapta a festivales, estadios, nightclubs, bares y venues. Casos por tipo de recinto.",
  },
  {
    path: "/beneficios",
    title: "Beneficios",
    description:
      "Más ventas, mejor experiencia y control total. Beneficios comerciales, operativos, técnicos y de experiencia con Ronda Privé.",
  },
  {
    path: "/como-funciona",
    title: "Cómo funciona",
    description:
      "Cómo funciona Ronda Privé para asistentes, equipo de cocina y organizadores. Flujo end-to-end de compra, preparación y control de pedidos.",
  },
  {
    path: "/insights",
    title: "Insights",
    description:
      "Tendencias, casos de uso y novedades sobre comercio móvil en eventos y venues. Lecturas para organizadores y operadores.",
  },
  {
    path: "/faq",
    title: "Preguntas frecuentes",
    description:
      "Resolvemos las preguntas más comunes sobre Ronda Privé: cómo se implementa, qué necesita el venue, cómo se cobra, integraciones y más.",
  },
  {
    path: "/contacto",
    title: "Contacto",
    description:
      "Hablemos de tu evento o venue. Solicita una demo personalizada de Ronda Privé y armamos juntos el setup que necesitas.",
  },
];

const escapeAttr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const rewrite = (shell, { title, description, url }) =>
  shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${escapeAttr(description)}$2`
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      `$1${escapeAttr(url)}$2`
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      `$1${escapeAttr(url)}$2`
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${escapeAttr(title)}$2`
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${escapeAttr(description)}$2`
    )
    .replace(
      /(<meta name="twitter:title" content=")[^"]*(")/,
      `$1${escapeAttr(title)}$2`
    )
    .replace(
      /(<meta name="twitter:description" content=")[^"]*(")/,
      `$1${escapeAttr(description)}$2`
    );

if (!existsSync(SHELL)) {
  console.error(`✗ Shell not found at ${SHELL}. Run \`vite build\` first.`);
  process.exit(1);
}

const shell = await readFile(SHELL, "utf8");
let count = 0;

for (const route of ROUTES) {
  const url = `${SITE}${route.path}`;
  const fullTitle = route.title + TITLE_SUFFIX;
  const html = rewrite(shell, {
    title: fullTitle,
    description: route.description,
    url,
  });

  const outDir = join(DIST, route.path.slice(1));
  const outFile = join(outDir, "index.html");

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, html);
  console.log(`✓ ${outFile}`);
  count++;
}

console.log(
  `\nGenerated ${count} per-route HTML files with route-specific meta tags.`
);
