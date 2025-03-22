import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kzuraw.com",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    skewProtection: true,
  }),
});
