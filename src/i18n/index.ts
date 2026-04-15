import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Eagerly bundle only the default/fallback locale. Other locales are fetched
// on-demand via dynamic imports when the user switches languages, keeping the
// initial JS payload ~70KB lighter.
import es from './locales/es.json';

const supportedLngs = ['es', 'en', 'pt', 'fr'] as const;
type SupportedLng = typeof supportedLngs[number];

const localeLoaders: Record<Exclude<SupportedLng, 'es'>, () => Promise<{ default: Record<string, unknown> }>> = {
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
    supportedLngs: [...supportedLngs],

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
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
const loadLocale = async (lng: string) => {
  const base = lng.split('-')[0] as SupportedLng;
  if (base === 'es' || !localeLoaders[base as Exclude<SupportedLng, 'es'>]) return;
  if (i18n.hasResourceBundle(base, 'translation')) return;
  const mod = await localeLoaders[base as Exclude<SupportedLng, 'es'>]();
  i18n.addResourceBundle(base, 'translation', mod.default, true, true);
};

// Kick off the initial locale load, and swap in new locales on change.
void loadLocale(i18n.language);
i18n.on('languageChanged', (lng) => {
  void loadLocale(lng);
});

export default i18n;
