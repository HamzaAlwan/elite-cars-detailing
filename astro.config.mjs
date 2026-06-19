// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO (Phase 9, P9-T5): replace with the real production domain before launch.
  // `site` is required by @astrojs/sitemap to emit absolute URLs.
  site: 'https://www.example.com',
  output: 'static',
  integrations: [vue(), sitemap()],
  vite: {
    // Tailwind v4 is wired via the Vite plugin (NOT @astrojs/tailwind, which is v3).
    plugins: [tailwindcss()],
  },
});
