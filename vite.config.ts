import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
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
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: true,
        concurrency: 4,
        crawlLinks: true,
        failOnError: true,
      },
    }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
});
