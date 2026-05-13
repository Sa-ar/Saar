import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const site =
  process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://saardavidson.com';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [react(), sitemap()],
});