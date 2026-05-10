import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  allPathsForPage,
  isLang,
  type Lang,
  type PageKey,
} from "@/i18n/routes";

const SITE_URL = "https://rondaprive.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const OG_LOCALE: Record<Lang, string> = {
  es: "es_LA",
  en: "en_US",
  pt: "pt_BR",
  fr: "fr_FR",
};

interface SEOProps {
  /**
   * Logical page identifier. When provided, title/description are read from
   * the i18n catalog under `seo.<pageKey>.title` / `.description` and
   * hreflang alternates are emitted for every supported language.
   */
  pageKey?: PageKey;
  /** Override for dynamic pages (e.g. event detail). */
  title?: string;
  /** Override for dynamic pages. */
  description?: string;
  /** Suffix appended after the localized base path (e.g. event id). */
  pathSuffix?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const upsertMeta = (
  selector: string,
  attr: "name" | "property",
  key: string,
  content: string,
) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const removeMeta = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const removeAllAlternates = () => {
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((el) => el.remove());
};

const SEO = ({
  pageKey,
  title,
  description,
  pathSuffix = "",
  ogImage,
  noIndex,
}: SEOProps) => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const langBase = i18n.language.split("-")[0];
  const lang: Lang = isLang(langBase) ? langBase : DEFAULT_LANG;

  useEffect(() => {
    const siteName = "Ronda Privé";
    const defaultTitle = t("seo.default.title", "Ronda Privé | Premium Event Technology");
    const defaultDescription = t(
      "seo.default.description",
      "Mobile platform for events and venues. Cut the wait, lift sales.",
    );

    const pageTitle = pageKey
      ? t(`seo.${pageKey}.title`, { defaultValue: title ?? "" })
      : title ?? "";
    const pageDescription = pageKey
      ? t(`seo.${pageKey}.description`, { defaultValue: description ?? "" })
      : description ?? "";

    const finalTitle = pageTitle
      ? `${pageTitle} | ${siteName}`
      : defaultTitle;
    const finalDescription = pageDescription || defaultDescription;
    const finalImage = ogImage ?? DEFAULT_OG_IMAGE;

    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

    document.documentElement.lang = lang;
    document.title = finalTitle;
    upsertMeta('meta[name="description"]', "name", "description", finalDescription);
    upsertLink("canonical", url);

    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:title"]', "property", "og:title", finalTitle);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      finalDescription,
    );
    upsertMeta('meta[property="og:image"]', "property", "og:image", finalImage);
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", OG_LOCALE[lang]);

    upsertMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      finalTitle,
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      finalDescription,
    );
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", finalImage);

    // hreflang alternates — only when we know which logical page this is.
    removeAllAlternates();
    if (pageKey) {
      const alternates = allPathsForPage(pageKey, pathSuffix);
      for (const altLang of SUPPORTED_LANGS) {
        upsertLink("alternate", `${SITE_URL}${alternates[altLang]}`, altLang);
      }
      upsertLink("alternate", `${SITE_URL}${alternates[DEFAULT_LANG]}`, "x-default");
    }

    if (noIndex) {
      upsertMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    } else {
      removeMeta('meta[name="robots"]');
    }
  }, [pathname, pageKey, title, description, ogImage, noIndex, pathSuffix, lang, t]);

  return null;
};

export default SEO;
