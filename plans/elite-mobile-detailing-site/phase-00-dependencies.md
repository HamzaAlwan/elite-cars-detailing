# Phase 0 — Dependencies & Configuration

**Goal:** Install EVERY dependency the whole plan needs (at `@latest`) and configure each one
completely and correctly — **before any feature code is written**. This phase gates all
others: do not start Phase 1+ until the build is green here.
**Depends on:** —
**Status:** ✅ Done — toolchain installed/configured + `astro check`/`eslint`/`build` green. (CF
repo-connect + Web3Forms key are owner deploy-time steps, tracked in Phase 9.)
**Spec refs:** `INITIAL_IDEA.md` §1, §6, §6b; `SEO_STRATEGY.md` Part A; project skills.

> **Conventions:** install with `@latest`; run `npx npm-check-updates -u` to refresh; TypeScript
> `strict`; all-OSS. Tailwind is **v4** → wire via `@tailwindcss/vite` (NOT `@astrojs/tailwind`,
> which is v3). Astro is **v6 (latest, Node ≥ 22.12)**; view transitions = `<ClientRouter />`
> (the old `<ViewTransitions />` is removed in v6). Host = **Cloudflare Pages**; quote form =
> **Web3Forms**; analytics = **Umami** (cookieless, custom events); motion = **Motion One**.

## Dependency inventory (install all, `@latest`)

- **Framework/runtime:** `astro`, `vue`, `@astrojs/vue`, `@astrojs/sitemap`
- **Styling:** `tailwindcss` (v4), `@tailwindcss/vite`
- **UI (shadcn-vue / Reka):** `reka-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Fonts & icons:** `@fontsource-variable/outfit`, `@lucide/vue` (NOT `lucide-vue-next` — deprecated)
- **Motion (Phase 4):** `motion` (Motion One — ~5KB, for in-island `whileInView` reveals)
- **Animated icons:** NONE — animate inline Lucide SVGs with CSS + the Motion One above (0 KB
  extra). Do **NOT** add Lottie/dotLottie/Rive/Lordicon (weight/licensing — see `INITIAL_IDEA.md` §2.3).
- **Gallery (Phase 5):** `img-comparison-slider`, `glightbox`, `lite-youtube-embed`
- **Booking (Phase 6):** `@calcom/embed-snippet` (vanilla Cal.com embed — free tier)
- **Dev tooling:** `@astrojs/check`, `typescript`, `prettier`, `prettier-plugin-astro`,
  `prettier-plugin-tailwindcss`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`,
  `eslint-plugin-vue`, `eslint-config-prettier`, `globals` (ESLint 10 flat config = code quality;
  Prettier owns formatting)
- **CLI only (no install — run via npx):** `shadcn-vue@latest`, `npm-check-updates`
- **Script-based (no npm dep):** Web3Forms (quote form — HTML `action` + public access key);
  Umami analytics `<script>` (cookieless; deferred; custom events via `umami.track()`) (Phase 9)

## Tasks

- [x] **P0-T1 — Init Astro** — `npm create astro@latest` (minimal template, TypeScript `strict`;
  Astro 6 requires **Node ≥ 22.12** — use a current Node LTS that satisfies it).
- [x] **P0-T2 — Install all deps** — every package in the inventory above, `@latest`, in one pass.
- [x] **P0-T3 — Configure `astro.config.mjs`** — add `vue()`, `sitemap()`, `site`, the
  `@tailwindcss/vite` plugin; `output: 'static'`. (Use `<ClientRouter />` in the layout, Phase 1.)
- [x] **P0-T4 — Configure Tailwind v4** — `src/styles/global.css` with `@import "tailwindcss";`
  + a `@theme { … }` block scaffolding the design tokens (values filled in Phase 2).
- [x] **P0-T5 — Configure shadcn-vue** — `npx shadcn-vue@latest init`; set `@/*` → `src/*` in
  `tsconfig.json`; create `src/lib/utils.ts` (`cn`); verify `components.json` aliases.
- [x] **P0-T6 — Fonts & icons** — import `@fontsource-variable/outfit`; confirm `@lucide/vue` resolves.
- [x] **P0-T7 — Pre-wire later-phase libs** — confirm `img-comparison-slider`, `glightbox`,
  `lite-youtube-embed`, `@calcom/embed-snippet` import without error (scratch file), then remove it.
- [x] **P0-T8 — Dev tooling** — Prettier (+ astro & tailwind plugins; `.prettierignore` excludes the
  hand-aligned docs); ESLint 10 flat config (`eslint.config.mjs`: js/ts/vue/astro + `eslint-config-prettier`
  last); `.editorconfig`; `.gitignore`; npm scripts (`dev`, `build`, `preview`, `check`, `format`,
  `lint`/`lint:fix`); `astro check` + `eslint .` pass clean.
- [x] **P0-T9 — Cloudflare Pages config** — connect repo; build command `astro build`, output
  dir `dist`. (No adapter needed for a pure static SSG build.) Host canonicalization (www↔apex
  301) is a **zone-level Cloudflare Bulk Redirect / Redirect Rule**, NOT `_redirects` (Pages
  `_redirects` does not support domain-level redirects); use `_redirects`/`_headers` only for
  path/trailing-slash + security headers. Get a **Web3Forms access key** for the quote form —
  it's a **public key (an email alias, safe to commit; no secret/env-var storage needed)**, keep
  it in `src/data/site.ts`. (Netlify + `netlify.toml` + Netlify Forms is the documented alternative.)
- [x] **P0-T10 — Verify & lock** — `npx npm-check-updates -u` (ncu = npm-check-updates; refresh)
  → clean install → `astro check` + `astro build` both green; dev server boots. Commit the baseline.

## Done when
Every dependency is installed at latest and fully configured; `astro check` + `astro build` pass
with **zero feature code** written. Later phases only import & use these — never install.
