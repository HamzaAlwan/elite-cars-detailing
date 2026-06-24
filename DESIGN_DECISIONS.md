# Design decisions — Phase 2.5 gate

Record the owner's picks from `/preview` here **before** Phase 3 begins. The `/preview` page is
internal (noindex, sitemap-excluded) and is removed before launch.

## How to review

- `npm run dev` → open `http://localhost:4321/preview` (ideally on a real iPhone via the
  Cloudflare Pages preview URL once the repo is connected — P0-T9).
- Check the five groups: Foundations · Components · Sections · Variations · States & motion.

## Pending owner review

- [x] **Metallic intensity** → **MATTE** (refined 2026-06-19): solid sapphire `--color-brand-strong`
  with a subtle bevel for depth, lighter shadow, no gloss specular sweep. Applied to `.btn-metal`.
- [x] **Primary blue** → **B "Deep electric" `#1E5FFF`** (2026-06-19). Ramp rebuilt in global.css;
  white-on-CTA 5.08:1 ✓ AA, 3.94:1 on bg for ≥24px.
- [x] **Button corners** → **pill (`rounded-full`)** — 100% rounded (owner pref).
- [x] **Overall direction approved** — Phase 3 built on these decisions (2026-06-20). `/preview` retained for Phase 4+ reference.

## After the pick (apply, then start Phase 3)

- If the blue changes: update `--color-brand` / `--color-brand-strong` / `--color-brand-deep` /
  `--color-brand-bright` in `src/styles/global.css` (re-verify WCAG contrast).
- If metallic intensity changes: adjust the `.btn-metal` gradient/sheen in `src/styles/global.css`.
- Record the final choices below.

**Recorded:** Matte · Deep electric `#1E5FFF` · Pill buttons. Phase 3 built and shipped 2026-06-20.

---

## Phase 3 — Static sections (2026-06-20)

### Logo files created

- `public/logo.svg` — full logo, transparent background SVG. Car silhouette in `#1E5FFF` with `pathLength="1"` for `.icon-draw` stroke animation; "ELITE" in `--color-text`, "MOBILE CAR DETAILING" in `--color-text-muted`.
- `public/logo-compact.svg` — wordmark-only nav variant (no car illustration). Used in sticky nav + footer at `h-9 w-auto`.
- `public/favicon.svg` — sports car silhouette glyph in `#1E5FFF`. Replaces the Astro default placeholder.

### Design system additions (`src/styles/global.css`)

- `--text-h4: 1.0625rem` (17px) added to `@theme`; `h4` base rule added to `@layer base` with `font-weight: 600; line-height: 1.3; letter-spacing: -0.01em`.
- `.badge-featured` — matte sapphire badge class, replaces `.btn-metal` on non-interactive "Most Popular" badges.
- `.surface-featured` — featured card variant (`.surface-raised` + brand ring). Used on the "Most Popular" pricing tier.
- `.btn-metal:disabled / [aria-disabled]` — `opacity: 0.45; cursor: not-allowed; pointer-events: none`.
- `input/select/textarea:focus-visible` — shifts `border-color` to `--color-brand` on focus (outline alone was disconnected from the field edge).
- `.menu-icon [data-bar]` transition: `--dur-base` (250ms) → `--dur-fast` (150ms) for snappier tap response.
- `scroll-padding-top: 5rem` → `4rem` (nav is `h-16` = 64px).

### Primitives improved

- `src/components/ui/Button.astro` — added `cursor-pointer` to base; added `transition-colors` to ghost hover variant.
- `src/lib/reveal.ts` — threshold `0.12` → `0.15`; rootMargin `-10%` → `-8%`.

### Section components created (`src/components/sections/`)

| File | Notes |
|------|-------|
| `Nav.astro` | Sticky glass nav, `logo-compact.svg`, `aria-expanded` hamburger + Esc-to-close, mobile panel, `transition:persist` |
| `Hero.astro` | Single `<h1>`, `min-h-[100svh]`, icon trust strip, cold-start guarantee badge, car silhouette glow, tel link guarded against placeholder |
| `ValueProps.astro` | 4 cards, inline SVG icons with `.icon-hover` (zero Vue weight), `data-reveal` stagger, h3 at correct size |
| `Pricing.astro` | 3 tiers using `.surface-featured` + `.badge-featured`, `#book?package=…` CTA hrefs, guarantee line |
| `HowItWorks.astro` | `<ol>/<li>` semantic list, trailing CTA |
| `SocialProof.astro` | Guarantee callout, credential chips, product brand list, review placeholder for real GBP reviews |
| `ServiceArea.astro` | City pill chips, zip validator mount point (`#zip-validator-mount`) |
| `Footer.astro` | `<address>` NAP, conditional tel/email links, dynamic year, cookieless note |
| `StickyBar.astro` | `env(safe-area-inset-bottom)`, `transition:persist`, `md:hidden`, falls back to `#quote` if no phone set |

### Global reveal wired in `index.astro`

Single `initReveal()` call in `index.astro` covers all `[data-reveal]` elements across every section. Per-section calls removed.

---

## Astro v6/v7 Upgrade (2026-06-24)

### Applied

- **`compressHTML: 'jsx'`** — explicitly pinned in `astro.config.mjs`. This is Astro 7's default; pinning documents the intent and guards against future default changes. Whitespace audit confirmed no regressions: all adjacent inline elements use CSS flex `gap` for spacing, not HTML whitespace.
- **CSP (`security.csp`)** — enabled in `astro.config.mjs`. Astro auto-hashes all bundled scripts/styles and emits a `<meta http-equiv="content-security-policy">` on every page. Directives cover all known external origins (`api.web3forms.com`, `cal.com`, `app.cal.com`). **Must verify booking flow in `astro preview` before first deployment.**

### Skipped

- **Astro Fonts API** — current setup (single self-hosted variable woff2, manual `@font-face` + preload) is already optimal. The Fonts API would replicate what is already hand-tuned. Revisit only if additional font families are added.

### Deferred — gated on moving to `output: 'server'` or `'hybrid'`

- **Route caching** (`cache` + `routeRules`) — stable in v7. No-op on a fully static site. Enable when dynamic routes or on-demand APIs are introduced.
- **Advanced routing** (`src/fetch.ts` entrypoint) — stable in v7. Enables full control over the request pipeline (middleware ordering, Hono integration). Enable when SSR/edge is needed. Note: `src/fetch.ts` is now a reserved filename — do not create it for unrelated purposes.
- **Custom logger** (`logger: logHandlers.json()`) — stable in v7. Useful for log aggregation (Loki, CloudWatch) in SSR deployments. No value in static mode.
- **Background dev server** (`astro dev --background`) — available now, minor QoL for AI-assisted dev workflows.
