import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tanstackRouter(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/server/api': {
        target: 'https://tubox.de',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/server\/api/, '/mg_woodscare/server/api'),
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
