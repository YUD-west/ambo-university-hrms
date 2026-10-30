import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from '../locales/en/common.json';
import amCommon from '../locales/am/common.json';
import omCommon from '../locales/om/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enCommon,
      },
      am: {
        translation: amCommon,
      },
      om: {
        translation: omCommon,
      },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'am', 'om'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
