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
  integrations: [
    vue(),
    // Exclude the internal /preview design showcase from the sitemap (P2B-T1).
    sitemap({ filter: (page) => !page.includes('/preview') }),
  ],
  vite: {
    // Tailwind v4 is wired via the Vite plugin (NOT @astrojs/tailwind, which is v3).
    plugins: [tailwindcss()],
    // Pre-bundle heavy islands deps at server start so Vite doesn't lazily discover
    // them on first page load and trigger a mid-session browser reload.
    optimizeDeps: {
      include: [
        'motion',
        'reka-ui',
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-swap-functions.js',
        'astro/virtual-modules/transitions-types.js',
      ],
    },
  },
});
