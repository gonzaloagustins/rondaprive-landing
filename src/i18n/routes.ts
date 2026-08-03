export const SUPPORTED_LANGS = ['es', 'en', 'pt', 'fr'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: Lang = 'es';

export type PageKey =
  | 'home'
  | 'events'
  | 'eventDetail'
  | 'product'
  | 'productDetail'
  | 'solutions'
  | 'industries'
  | 'howItWorks'
  | 'benefits'
  | 'insights'
  | 'insightDetail'
  | 'faq'
  | 'glossary'
  | 'contact';

type SlugMap = Record<
  Exclude<PageKey, 'home' | 'eventDetail' | 'insightDetail' | 'productDetail'>,
  Record<Lang, string>
>;

export const ROUTE_SLUGS: SlugMap = {
  events:     { es: 'eventos',       en: 'events',       fr: 'evenements',       pt: 'eventos' },
  product:    { es: 'producto',      en: 'product',      fr: 'produit',          pt: 'produto' },
  // Retired page: `product` replaced it. Kept registered so old inbound links
  // still resolve to a redirect (see App.tsx) and the language switcher can
  // still map the slug. Not emitted in the sitemap.
  solutions:  { es: 'soluciones',    en: 'solutions',    fr: 'solutions',        pt: 'solucoes' },
  industries: { es: 'industrias',    en: 'industries',   fr: 'industries',       pt: 'industrias' },
  howItWorks: { es: 'como-funciona', en: 'how-it-works', fr: 'comment-ca-marche', pt: 'como-funciona' },
  benefits:   { es: 'beneficios',    en: 'benefits',     fr: 'avantages',        pt: 'beneficios' },
  insights:   { es: 'insights',      en: 'insights',     fr: 'insights',         pt: 'insights' },
  faq:        { es: 'faq',           en: 'faq',          fr: 'faq',              pt: 'faq' },
  glossary:   { es: 'glosario',      en: 'glossary',     fr: 'lexique',          pt: 'glossario' },
  contact:    { es: 'contacto',      en: 'contact',      fr: 'contact',          pt: 'contato' },
};

/**
 * The capabilities that live under /producto. Ids are language-agnostic and
 * double as the i18n keys under the `product` namespace; only the URL slug is
 * localized. Order is the order they appear in the menu, footer and hub.
 */
export const PRODUCT_MODES = ['preorder', 'seat', 'pickup', 'kitchen'] as const;
export type ProductMode = typeof PRODUCT_MODES[number];

export const PRODUCT_MODE_SLUGS: Record<ProductMode, Record<Lang, string>> = {
  preorder: { es: 'compra-anticipada',    en: 'pre-order',           fr: 'precommande',          pt: 'compra-antecipada' },
  seat:     { es: 'entrega-en-asiento',   en: 'seat-delivery',       fr: 'livraison-au-siege',   pt: 'entrega-no-assento' },
  pickup:   { es: 'compra-y-retiro',      en: 'order-and-pickup',    fr: 'commande-et-retrait',  pt: 'compra-e-retirada' },
  kitchen:  { es: 'operacion-de-cocina',  en: 'kitchen-operations',  fr: 'operations-cuisine',   pt: 'operacao-de-cozinha' },
};

export const isProductMode = (v: string | undefined): v is ProductMode =>
  !!v && (PRODUCT_MODES as readonly string[]).includes(v);

/** Resolve a URL slug in any language back to its mode id. */
export const productModeFromSlug = (slug: string | undefined): ProductMode | undefined => {
  if (!slug) return undefined;
  for (const mode of PRODUCT_MODES) {
    if (Object.values(PRODUCT_MODE_SLUGS[mode]).includes(slug)) return mode;
  }
  return undefined;
};

export const isLang = (v: string | undefined): v is Lang =>
  !!v && (SUPPORTED_LANGS as readonly string[]).includes(v);

/**
 * Build a path like /en/events for a known page key.
 *
 * For `productDetail` the suffix carries the language-agnostic mode id
 * ("/preorder"), not a URL slug — this function localizes it. That keeps
 * callers (and hreflang alternates) from having to know slug tables.
 */
export const localizedPath = (pageKey: PageKey, lang: Lang, suffix = ''): string => {
  if (pageKey === 'home') return `/${lang}${suffix}`;
  if (pageKey === 'productDetail') {
    const mode = suffix.replace(/^\//, '');
    const slug = isProductMode(mode) ? PRODUCT_MODE_SLUGS[mode][lang] : mode;
    return `/${lang}/${ROUTE_SLUGS.product[lang]}/${slug}`;
  }
  if (pageKey === 'eventDetail') {
    // suffix already starts with "/<id>"
    return `/${lang}/${ROUTE_SLUGS.events[lang]}${suffix}`;
  }
  if (pageKey === 'insightDetail') {
    // suffix already starts with "/<slug>"
    return `/${lang}/${ROUTE_SLUGS.insights[lang]}${suffix}`;
  }
  return `/${lang}/${ROUTE_SLUGS[pageKey as keyof SlugMap][lang]}${suffix}`;
};

/** Extract the lang prefix from a pathname; returns undefined if absent or invalid. */
export const parseLangFromPath = (pathname: string): Lang | undefined => {
  const seg = pathname.split('/').filter(Boolean)[0];
  return isLang(seg) ? seg : undefined;
};

/** Strip the lang prefix from a pathname ("/en/events" -> "/events"). */
export const stripLangFromPath = (pathname: string): string => {
  const lang = parseLangFromPath(pathname);
  if (!lang) return pathname;
  const rest = pathname.replace(/^\/[a-z]{2}/, '');
  return rest || '/';
};

/** Find which PageKey matches a path slug in any language (for switcher). */
export const pageKeyFromSlug = (slug: string | undefined): PageKey | undefined => {
  if (!slug) return 'home';
  for (const key of Object.keys(ROUTE_SLUGS) as Array<keyof SlugMap>) {
    const langs = ROUTE_SLUGS[key];
    if (Object.values(langs).includes(slug)) return key as PageKey;
  }
  return undefined;
};

/** Swap the lang prefix of any current path to a different language, preserving sub-paths. */
export const swapLangInPath = (pathname: string, newLang: Lang): string => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${newLang}`;

  const [maybeLang, slug, ...rest] = segments;
  const isLangPrefixed = isLang(maybeLang);
  const currentSlug = isLangPrefixed ? slug : maybeLang;
  const tail = isLangPrefixed ? rest : segments.slice(1);

  if (!currentSlug) return `/${newLang}`;

  const pageKey = pageKeyFromSlug(currentSlug);
  if (!pageKey || pageKey === 'home') return `/${newLang}`;

  // /producto/<modo> — the child slug is localized too. Without this the
  // switcher would carry the old language's slug into the new path and 404.
  if (pageKey === 'product' && tail.length) {
    const mode = productModeFromSlug(tail[0]);
    if (mode) return localizedPath('productDetail', newLang, `/${mode}`);
  }

  const newSlug = pageKey === 'eventDetail'
    ? ROUTE_SLUGS.events[newLang]
    : pageKey === 'insightDetail'
      ? ROUTE_SLUGS.insights[newLang]
      : ROUTE_SLUGS[pageKey as keyof SlugMap][newLang];

  const tailPath = tail.length ? `/${tail.join('/')}` : '';
  return `/${newLang}/${newSlug}${tailPath}`;
};

/** All paths for a given PageKey across every supported language (used by sitemap + hreflang). */
export const allPathsForPage = (pageKey: PageKey, suffix = ''): Record<Lang, string> => {
  const result = {} as Record<Lang, string>;
  for (const lang of SUPPORTED_LANGS) result[lang] = localizedPath(pageKey, lang, suffix);
  return result;
};
