import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  isLang,
  swapLangInPath,
  type Lang,
} from "@/i18n/routes";

/**
 * Display metadata for each supported locale. Labels are endonyms — every
 * language is written in itself, so a French speaker sees "Français" even
 * when the rest of the UI is rendered in Spanish.
 */
export const LOCALES: ReadonlyArray<{ code: Lang; label: string }> = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
];

const resolveLang = (raw: string | undefined): Lang | undefined => {
  if (!raw) return undefined;
  const base = raw.split("-")[0].toLowerCase();
  return isLang(base) ? base : undefined;
};

/**
 * Centralized locale state. The URL is the source of truth (LangGuard in
 * App.tsx mirrors the `:lang` segment into i18next); `setLocale` swaps the
 * URL to the equivalent slug and the rest of the app follows.
 */
export const useLocale = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const locale: Lang = resolveLang(i18n.language) ?? DEFAULT_LANG;

  const setLocale = useCallback(
    (next: Lang) => {
      if (next === locale) return;
      const target = swapLangInPath(location.pathname, next);
      navigate(`${target}${location.search}${location.hash}`);
    },
    [locale, location.hash, location.pathname, location.search, navigate],
  );

  return {
    locale,
    setLocale,
    availableLocales: LOCALES,
  };
};

export type { Lang };
export { SUPPORTED_LANGS };
