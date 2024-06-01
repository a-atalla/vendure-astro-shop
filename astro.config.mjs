import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    ssr: {
      noExternal: "graphql"
    }, define: {
      // to make env variables work on cloudflare pages we need to redefine them here
      "process.env.VENDURE_SHOP_API": JSON.stringify(process.env.VENDURE_SHOP_API),
      "process.env.VENDURE_CHANNEL_TOKEN": JSON.stringify(process.env.VENDURE_CHANNEL_TOKEN),
    }
  },
  adapter: cloudflare(),
  integrations: [tailwind(), icon()]
});