import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// All four locales are bundled eagerly. The total cost is ~30 KB gzipped,
// which we accept in exchange for a simpler init: i18next can resolve any
// supported language synchronously, so `resolvedLanguage` and the
// `useTranslation` hooks are always consistent with the URL on first paint —
// no flash of untranslated content and no resolved/language mismatch.
import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import { SUPPORTED_LANGS } from './routes';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
      fr: { translation: fr },
    },
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGS],
    // Treat region codes like `en-US` as a match for the base language `en`,
    // so first-time visitors from the US/UK/BR/CA land on the right locale.
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',

    detection: {
      // The URL is the source of truth: we read the first path segment
      // (`/en/...`) first, then fall back to user preference and browser.
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
      lookupLocalStorage: 'rp_locale',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language;
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18n;
