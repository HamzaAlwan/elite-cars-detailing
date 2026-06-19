---
name: Astro islands & SSG
description: >-
  Best practices for building this static Astro 6 site and deciding what hydrates.
  Use when creating .astro pages/components, choosing client:* hydration
  directives, adding Vue islands, using astro:assets for images, the ClientRouter
  (view transitions), sitemap, routing, or anything about shipping minimal JS.
---

# Astro islands & SSG (this project)

Stack: **Astro 6, SSG** (`output: 'static'`, latest; Node ≥ 22.12), on Cloudflare Pages.
Goal: ship as little JS as possible — static HTML by default, hydrate only interactive
islands. **Single page** (+ a custom 404). TypeScript; mobile-first.

## Core rules

- Author sections as `.astro` components (zero JS). Reach for a framework island ONLY
  where real interactivity is needed.
- Keep islands **small and self-contained** — never one big monolithic island.
- Pick the lightest hydration directive:
  - `client:visible` — below-the-fold interactivity (pricing selector, zip validator,
    FAQ, gallery slider/lightbox, Cal.com embed). **Default.**
  - `client:idle` — non-critical, can wait (e.g., mobile nav).
  - `client:load` — avoid unless interactive immediately above the fold.
  - `client:media` / `client:only` — niche; justify.
- The islands list IS the JS budget. Audit that nothing static is hydrated.

## Astro 6 specifics

- View transitions = `<ClientRouter />` (the old `<ViewTransitions />` is REMOVED in Astro 6 —
  `<ClientRouter />` is the only option). Use `transition:animate`; respect `prefers-reduced-motion`.
- Images: `astro:assets` `<Image>`/`<Picture>` → AVIF/WebP, responsive `srcset`, explicit
  width/height (no CLS), lazy below the fold; preload only the hero.
- `@astrojs/sitemap`; set `site` in `astro.config.mjs`.

## Project map

- Static sections → `src/components/sections/*.astro`
- Vue islands → `src/components/islands/*.vue`
- Layout/head → `src/layouts/Layout.astro`, `src/components/Seo.astro`

Ref: `INITIAL_IDEA.md` §1 (islands→directive map), §6. Pairs with
`vue-shadcn-islands`, `tailwind-v4-design-system`, `web-performance-accessibility`.
