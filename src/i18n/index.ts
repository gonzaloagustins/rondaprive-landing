import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Eagerly bundle only the default/fallback locale. Other locales are fetched
// on-demand via dynamic imports when the user switches languages, keeping the
// initial JS payload ~70KB lighter.
import es from './locales/es.json';
import { SUPPORTED_LANGS, isLang, type Lang } from './routes';

const localeLoaders: Record<Exclude<Lang, 'es'>, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('./locales/en.json'),
  pt: () => import('./locales/pt.json'),
  fr: () => import('./locales/fr.json'),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
    },
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGS],

    detection: {
      // The URL is the source of truth: we read the first path segment
      // (`/en/...`) first, then fall back to user preference and browser.
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

// Lazily load the resolved language (if not already bundled) before i18next
// first reads its bundle, preventing a flash of untranslated content.
export const loadLocale = async (lng: string): Promise<void> => {
  const base = lng.split('-')[0];
  if (!isLang(base) || base === 'es') return;
  if (i18n.hasResourceBundle(base, 'translation')) return;
  const mod = await localeLoaders[base as Exclude<Lang, 'es'>]();
  i18n.addResourceBundle(base, 'translation', mod.default, true, true);
};

void loadLocale(i18n.language);
i18n.on('languageChanged', (lng) => {
  void loadLocale(lng);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
