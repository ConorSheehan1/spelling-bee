import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import App from "./App.vue";
import { i18n } from "./i18n.js";

createApp(App).use(createPinia()).use(ElementPlus).use(i18n).mount("#app");
