import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://karambatechnologies.com',

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline imported assets as data URIs: the hero logo pieces
      // must be emitted as separate files and served byte-identical.
      // (Vite's default 4KB limit would base64 next.webp and
      // automation.webp straight into the HTML.)
      assetsInlineLimit: 0,
    },
  },

  integrations: [sitemap()],
});