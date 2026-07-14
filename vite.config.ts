import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import checker from "vite-plugin-checker";

// https://stackoverflow.com/a/68123263/6305204
// ensure cache is busted correctly on redeploy
const dateHash = new Date().toISOString().split("T")[0];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({ typescript: true }),
    vue(),
    VueI18nPlugin({
      include: path.resolve(__dirname, "./src/locales/**"),
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]-${dateHash}.js`,
        chunkFileNames: `[name]-${dateHash}.js`,
        assetFileNames: `[name]-${dateHash}.[ext]`,
      },
    },
  },
});
