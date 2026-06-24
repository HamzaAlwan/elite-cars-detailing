// @ts-check
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const HTML_FILE_EXTENSION = '.html';
const CAL_STYLE_SRC_DIRECTIVE = "style-src 'self' https://app.cal.com 'unsafe-inline'";
const STYLE_SRC_DIRECTIVE_PATTERN = /style-src [^;"]+/g;

const rewriteHtmlCspStyleDirectives = async (directoryPath) => {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });

  await Promise.all(
    directoryEntries.map(async (directoryEntry) => {
      const entryPath = join(directoryPath, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        await rewriteHtmlCspStyleDirectives(entryPath);
        return;
      }

      if (!directoryEntry.isFile() || !directoryEntry.name.endsWith(HTML_FILE_EXTENSION)) {
        return;
      }

      const html = await readFile(entryPath, 'utf8');
      const updatedHtml = html.replace(STYLE_SRC_DIRECTIVE_PATTERN, CAL_STYLE_SRC_DIRECTIVE);

      if (updatedHtml === html) {
        return;
      }

      await writeFile(entryPath, updatedHtml);
    }),
  );
};

const calCspStyleInlineIntegration = () => ({
  name: 'cal-csp-style-inline',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      // Astro always appends style hashes, which disables 'unsafe-inline' in modern browsers.
      await rewriteHtmlCspStyleDirectives(fileURLToPath(dir));
    },
  },
});

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
    // scriptDirective.resources. Generated HTML is post-processed below so Cal's
    // dynamic inline style attributes work without weakening script-src.
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
        // 'unsafe-inline' is required because Cal.com's embed.js dynamically generates
        // inline styles (iframe sizing, modal positioning, animations) with unique content
        // on every interaction — hashes are not viable for dynamic style values.
        resources: ["'self'", 'https://app.cal.com', "'unsafe-inline'"],
      },
    },
  },
  integrations: [
    calCspStyleInlineIntegration(),
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
