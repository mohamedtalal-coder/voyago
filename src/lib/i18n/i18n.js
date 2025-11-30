import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'navbar', 'footer', 'home'],
    defaultNS: 'common',
    partialBundledLanguages: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    load: 'currentOnly',
    preload: [],
  })
  .then(() => {
    document.dir = i18n.dir();
    i18n.on('languageChanged', () => {
      document.dir = i18n.dir();
    });
  });

export default i18n;