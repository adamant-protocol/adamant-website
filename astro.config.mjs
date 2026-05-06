import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://adamantprotocol.com',
  integrations: [
    tailwind({
      applyBaseStyles: false, // we use our own base styles in src/styles/global.css
    }),
    mdx(),
    sitemap(),
  ],
  build: {
    assets: 'assets',
  },
});
