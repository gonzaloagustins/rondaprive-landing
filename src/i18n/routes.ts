export const SUPPORTED_LANGS = ['es', 'en', 'pt', 'fr'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: Lang = 'es';

export type PageKey =
  | 'home'
  | 'events'
  | 'eventDetail'
  | 'solutions'
  | 'industries'
  | 'howItWorks'
  | 'benefits'
  | 'insights'
  | 'faq'
  | 'contact';

type SlugMap = Record<Exclude<PageKey, 'home' | 'eventDetail'>, Record<Lang, string>>;

export const ROUTE_SLUGS: SlugMap = {
  events:     { es: 'eventos',       en: 'events',       fr: 'evenements',       pt: 'eventos' },
  solutions:  { es: 'soluciones',    en: 'solutions',    fr: 'solutions',        pt: 'solucoes' },
  industries: { es: 'industrias',    en: 'industries',   fr: 'industries',       pt: 'industrias' },
  howItWorks: { es: 'como-funciona', en: 'how-it-works', fr: 'comment-ca-marche', pt: 'como-funciona' },
  benefits:   { es: 'beneficios',    en: 'benefits',     fr: 'avantages',        pt: 'beneficios' },
  insights:   { es: 'insights',      en: 'insights',     fr: 'insights',         pt: 'insights' },
  faq:        { es: 'faq',           en: 'faq',          fr: 'faq',              pt: 'faq' },
  contact:    { es: 'contacto',      en: 'contact',      fr: 'contact',          pt: 'contato' },
};

export const isLang = (v: string | undefined): v is Lang =>
  !!v && (SUPPORTED_LANGS as readonly string[]).includes(v);

/** Build a path like /en/events for a known page key. */
export const localizedPath = (pageKey: PageKey, lang: Lang, suffix = ''): string => {
  if (pageKey === 'home') return `/${lang}${suffix}`;
  if (pageKey === 'eventDetail') {
    // suffix already starts with "/<id>"
    return `/${lang}/${ROUTE_SLUGS.events[lang]}${suffix}`;
  }
  return `/${lang}/${ROUTE_SLUGS[pageKey][lang]}${suffix}`;
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

  const newSlug = pageKey === 'eventDetail'
    ? ROUTE_SLUGS.events[newLang]
    : ROUTE_SLUGS[pageKey as Exclude<PageKey, 'home' | 'eventDetail'>][newLang];

  const tailPath = tail.length ? `/${tail.join('/')}` : '';
  return `/${newLang}/${newSlug}${tailPath}`;
};

/** All paths for a given PageKey across every supported language (used by sitemap + hreflang). */
export const allPathsForPage = (pageKey: PageKey, suffix = ''): Record<Lang, string> => {
  const result = {} as Record<Lang, string>;
  for (const lang of SUPPORTED_LANGS) result[lang] = localizedPath(pageKey, lang, suffix);
  return result;
};
