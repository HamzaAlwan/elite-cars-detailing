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
  // Astro 7 default. Explicit so the intent is documented and survives any future
  // change to the framework default.
  compressHTML: 'jsx',
  security: {
    // Astro auto-hashes all bundled scripts/styles and emits a <meta CSP> per page.
    //
    // VERIFY BEFORE DEPLOYING: run `astro preview` and open the booking modal to
    // confirm Cal.com loads without CSP violations in the browser console.
    // Cal.com injects embed.js dynamically (src/lib/cal.ts), which is trusted via
    // scriptDirective.resources. 'strict-dynamic' lets embed.js load its own children.
    // If Cal injects inline styles into the parent page, add 'unsafe-hashes' or
    // specific sha256 hashes to styleDirective to unblock those without unsafe-inline.
    //
    // Build warning "Shiki uses inline styles" is a false positive — this project has
    // no Markdown content and no <Code> component, so Shiki never runs.
    csp: {
      directives: [
        "default-src 'self'",
        // Woff2 font is self-hosted (/public/fonts/).
        "font-src 'self'",
        // data: for any SVG data-URIs; https: for OG / social images linked from <meta>.
        "img-src 'self' data: https:",
        // Cal.com booking iframe.
        'frame-src https://cal.com https://app.cal.com',
        // web3forms quote submissions + Cal.com API calls.
        "connect-src 'self' https://api.web3forms.com https://cal.com https://app.cal.com",
      ],
      scriptDirective: {
        // 'self' must be explicit when overriding resources (Astro does not add it).
        // app.cal.com provides embed.js (loaded via DOM injection in src/lib/cal.ts).
        // NOTE: do NOT add 'strict-dynamic' here — it disables host allowlisting, which
        // breaks all Astro island hydration ('self' stops working for /_astro/*.js).
        resources: ["'self'", 'https://app.cal.com'],
      },
      styleDirective: {
        // 'self' for our own styles. app.cal.com in case the embed injects a stylesheet.
        // 'unsafe-hashes' enables hash-matching for inline style="" attributes (not blocks).
        // The six hashes below are the exact sha256 values of Cal.com's overlay inline
        // styles (template is static, so hashes are stable). If Cal.com's embed changes
        // and new violations appear, add the hashes from the browser console error here.
        resources: ["'self'", 'https://app.cal.com', "'unsafe-hashes'"],
        hashes: [
          'sha256-fTD9kmjQ3jI14aCHnSGEWLLEzeG+R5PKbJ7gOHqGnxU=',
          'sha256-oaK6we1Vq8KxDTkxo5kSyj/h4nhMaEOYVnZzjPVG/yM=',
          'sha256-eoXY6JQfqY/foPA402SRqsajCPS1DRalNn+v69CIWWE=',
          'sha256-vU5mF8hYKxMXWb8TB8FLtjlIQ3TcJN7OikYIzvVc6lI=',
          'sha256-FvIYyO2Bd3KAXsBL0Cks4yPia48yssOgxqmY/ersUUU=',
          'sha256-BgUF1LuFZVD1niRj+0E77ej6GtqgSRx+zB3bXlj8CuE=',
        ],
      },
    },
  },
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
