# Elite Mobile Car Detailing — website

Premium single-page marketing site for a mobile car-detailing business (Richardson / DFW).

- **Spec / design:** [`INITIAL_IDEA.md`](./INITIAL_IDEA.md) (see the "DECISIONS LOCKED" block).
- **SEO strategy:** [`SEO_STRATEGY.md`](./SEO_STRATEGY.md)
- **Build plan (phased):** [`plans/elite-mobile-detailing-site/00-OVERVIEW.md`](./plans/elite-mobile-detailing-site/00-OVERVIEW.md)

## Stack

Astro 6 (SSG) · Tailwind v4 (`@tailwindcss/vite`) · Vue islands (shadcn-vue / Reka UI) ·
Outfit variable font (Fontsource) · Motion One · Lucide (`@lucide/vue`) · Cal.com (free tier) ·
Web3Forms (quote form) · Umami (analytics) · deployed on Cloudflare Pages. All-OSS.

> **Note:** `vite` is pinned to `^7.3.2` via `overrides` — Astro 6.4.x supports vite 7, and
> vite 8 / Rolldown 1.x currently breaks `@tailwindcss/vite` (`tsconfigPaths` resolver error).

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build |
| `npm run check` | `astro check` (typecheck) |
| `npm run format` | Format with Prettier |

## Deploy — Cloudflare Pages (P0-T9 / Phase 9)

These steps need the Cloudflare/Web3Forms dashboards and are done at deploy time:

1. **Cloudflare Pages:** connect the repo; **build command** `npm run build`, **output dir** `dist`.
   No adapter needed (pure static SSG).
2. **One host (www ↔ apex):** 301 the non-canonical host with a **zone-level Cloudflare Bulk
   Redirect / Redirect Rule** — Pages `_redirects` cannot do host-level redirects. Use
   `_redirects` / `_headers` only for path/trailing-slash + security headers.
3. **Domain:** set the real production domain in `astro.config.mjs` (`site`) before launch.
4. **Web3Forms:** create a form at web3forms.com, copy the **public access key** (an email alias —
   safe to commit, no env var needed), and store it in `src/data/site.ts` (Phase 1/6).
