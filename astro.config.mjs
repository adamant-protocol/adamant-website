import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://adamantprotocol.com',
  integrations: [sitemap()],
  build: {
    assets: 'assets',
  },
});
