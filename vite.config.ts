import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// https://stackoverflow.com/a/68123263/6305204
// ensure cache is busted correctly on redeploy
const dateHash = new Date().toISOString().split("T")[0];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
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
