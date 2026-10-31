import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.js";

const resources = Object.fromEntries(
  Object.entries(translations).map(([language, translation]) => [
    language,
    { translation }
  ])
);

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;