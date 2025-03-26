import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import translationEN from './translations/en.json';
import translationVn from './translations/vn.json';

const lang = 'vn';
const resources = {
  en: {
    translation: translationEN,
  },
  vn: {
    translation: translationVn,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    lng: lang,
    debug: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: '.',
    },
  });

export default i18n;
