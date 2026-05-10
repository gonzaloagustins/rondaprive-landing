import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANG,
  isLang,
  localizedPath,
  type Lang,
  type PageKey,
} from "@/i18n/routes";

/**
 * Resolves the current i18n language (with fallback) and returns a helper
 * that builds locale-prefixed paths for the given page key. Use this in any
 * component that emits <Link to=...> so links stay within the active locale.
 */
export const useLocalizedPath = () => {
  const { i18n } = useTranslation();
  const base = i18n.language.split("-")[0];
  const lang: Lang = isLang(base) ? base : DEFAULT_LANG;

  const path = (pageKey: PageKey, suffix = "") =>
    localizedPath(pageKey, lang, suffix);

  return { lang, path };
};
