import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ga from "./locales/ga.json";

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "ga",
  messages: {
    en,
    ga,
  },
});
