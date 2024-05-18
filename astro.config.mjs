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
    }
  },
  adapter: cloudflare(),
  integrations: [tailwind(), icon()]
});