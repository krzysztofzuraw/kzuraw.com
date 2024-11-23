import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kzuraw.com",
  integrations: [tailwind(), sitemap()],
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
