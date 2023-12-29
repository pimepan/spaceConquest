import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
const path = require("path");

export default defineConfig({
  esbuild: {
    drop: ["console", "debugger"],
  },
  
  plugins: [
   
    vue(),
    AutoImport({
      dirs: ["./src/js/http/**", "./src/js/utils/**"],
      vueTemplate: true,
    }),
    Components({
      dirs: ["./src/components"],
      dts: false,
    }),
   
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: "5052",
    // expose to network
  },
});