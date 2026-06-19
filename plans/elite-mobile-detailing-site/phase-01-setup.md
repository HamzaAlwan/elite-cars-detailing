# Phase 1 — Project Scaffolding & Structure

**Goal:** Lay out the project structure, shared constants, and base layout so feature work can
begin. **All dependencies are already installed & configured in Phase 0** — do not install here.
**Depends on:** Phase 0
**Status:** ✅ Done — `astro check`/`eslint`/`build` green. (CF preview deploy pending repo-connect.)
**Spec refs:** `INITIAL_IDEA.md` §1, §2.

> **Conventions (see `00-OVERVIEW.md`):** TypeScript `strict`; **mobile-first**; single page only.
> Dependencies/tooling come from **Phase 0** — this phase only scaffolds + verifies.

## Tasks

- [x] **P1-T1 — Folder structure**
  - `src/components/{ui,sections,islands}`, `src/layouts`, `src/styles`, `src/lib`, `src/data`,
    `public/{images,videos,og}`.
  - Add favicon/manifest asset placeholders in `public/`: `favicon.ico`, `apple-touch-icon.png`,
    `android-chrome-192x192.png`, `site.webmanifest` (real branded versions land in Phase 9 P9-T2).
- [x] **P1-T2 — Site constants**
  - `src/data/site.ts`: business name, **TAGLINE ("No hookups. No hassle. Just shine.")**, NAP
    placeholders, `{{PHONE_E164}}`, `{{DOMAIN}}`, hours, social URLs — the single import source for
    the whole site (TAGLINE feeds the header wordmark, footer, `Seo.astro` OG, and JSON-LD slogan).
- [x] **P1-T3 — Base files**
  - `src/layouts/Layout.astro` (`lang="en"`, semantic landmarks, skip-to-content link,
    `<ClientRouter />`, imports `global.css`, the consolidated viewport meta
    `width=device-width, initial-scale=1, viewport-fit=cover`, and the Outfit preload
    `<link rel="preload" as="font" type="font/woff2" crossorigin>` — `crossorigin` is mandatory on
    Safari even same-origin, §2.5); minimal `src/pages/index.astro`; `src/pages/404.astro` stub.
- [x] **P1-T4 — Smoke test**
  - Dev server renders with design tokens + Outfit applied; a sample shadcn-vue island hydrates
    (this is a throwaway placeholder just to verify Vue + hydration wiring — real islands are
    Phase 4); `astro build` clean; deploy a Cloudflare Pages preview.

## Done when
The structure exists, the base layout renders with the design tokens + font, an island hydrates,
and a starter deploys to a Cloudflare Pages preview.
