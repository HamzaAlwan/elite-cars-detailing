# Build Plan — Elite Mobile Car Detailing (Astro site)

Master tracker. **Low-detail by design** — this file is the single surface for tracking
progress. Full detail + acceptance criteria live in each `phase-XX-*.md` file.

## Source of truth

- Product/design spec: `../../INITIAL_IDEA.md` (see its "DECISIONS LOCKED" block — it
  overrides older inline text).
- SEO strategy: `../../SEO_STRATEGY.md`
- Stack (locked): **Astro 6 (SSG, latest; Node ≥ 22.12) + Tailwind v4 + Vue islands
  (shadcn-vue / Reka UI) + Cal.com (free tier) on Cloudflare Pages.** All-OSS. Font: Outfit
  (self-hosted variable). Motion: Motion One. Quote form: Web3Forms. Analytics: Umami
  (cookieless, custom events). Scope: **single page only** (Membership/Fleet = post-launch roadmap).
- Design (locked 2026-06-19): brand = "Elite…" + tagline **"No hookups. No hassle. Just shine."**
  (Option B). Premium DARK theme — deep blue-black + sapphire accent + restrained metallic/gloss
  depth (anodized, never chrome). **Mobile/iOS-first** (most users are iPhone). See
  `../../INITIAL_IDEA.md` §2.1–§2.5.

## Conventions (apply to EVERY phase)

Global rules for the whole build — follow them in every task:

1. **Latest packages.** Always install with `@latest`. Periodically run
   `npx npm-check-updates -u` then reinstall to keep deps current, and re-test the build
   after upgrades. Don't pin to an older major without a documented reason.
2. **TypeScript everywhere.** The project is TypeScript with `strict` mode on — `.ts` for
   logic, typed Vue SFCs (`<script setup lang="ts">`), typed Astro frontmatter. Avoid `any`
   unless justified.
3. **Mobile-first.** Author base styles for mobile, then scale up with Tailwind `md:`/`lg:`
   prefixes. No fixed pixel widths on structural wrappers; design and verify at small
   viewports first, expand to desktop second.

## How to use

- Tick `- [ ]` → `- [x]` here as tasks complete; keep the matching phase file in sync.
- Task IDs (e.g. `P3-T2`) are stable references shared between this file and phase files.
- Status per phase: ⬜ Not started · 🟦 In progress · ✅ Done.

## Phase status

| # | Phase | File | Status |
|---|-------|------|--------|
| 0 | Dependencies & configuration (gate) | `phase-00-dependencies.md` | ⬜ |
| 1 | Project scaffolding & structure | `phase-01-setup.md` | ⬜ |
| 2 | Design system & layout | `phase-02-design-system.md` | ⬜ |
| 2.5 | Design showcase & approval gate | `phase-02b-design-showcase.md` | ⬜ |
| 3 | Static sections | `phase-03-static-sections.md` | ⬜ |
| 4 | Interactive islands | `phase-04-interactive-islands.md` | ⬜ |
| 5 | Our Work gallery | `phase-05-our-work-gallery.md` | ⬜ |
| 6 | Booking & lead capture | `phase-06-booking-and-lead-capture.md` | ⬜ |
| 7 | SEO & structured data | `phase-07-seo-and-schema.md` | ⬜ |
| 8 | Performance & accessibility | `phase-08-performance-accessibility.md` | ⬜ |
| 9 | QA, analytics & deploy | `phase-09-qa-and-deploy.md` | ⬜ |
| 10 | Off-site SEO playbook (owner) | `phase-10-offsite-playbook.md` | ⬜ |

**Two gates.** Phase 0 = install & configure ALL dependencies (at `@latest`) + the full toolchain
before any feature code. Phase 2.5 = the owner reviews the `/preview` design showcase, picks
variants, and approves the look before the section build. Order: 0 → 1 → 2 → **2.5 (design gate)**
→ 3 → … → 9. Phase 10 is owner-driven/post-launch (ranking work outside the codebase), tracked here
for completeness.

## All tasks (low detail)

### Phase 0 — Dependencies & configuration (gate)
- [ ] P0-T1 Initialize Astro (latest, TS strict, Node LTS)
- [ ] P0-T2 Install all runtime/integration deps (@latest, single pass)
- [ ] P0-T3 Configure astro.config (vue, sitemap, site, @tailwindcss/vite, static)
- [ ] P0-T4 Configure Tailwind v4 (global.css @import + @theme tokens scaffold)
- [ ] P0-T5 Configure shadcn-vue (init, `@/*` alias, `cn` util, components.json)
- [ ] P0-T6 Configure fonts & icons (Outfit variable, @lucide/vue)
- [ ] P0-T7 Pre-wire later-phase libs import-ready (gallery, Cal embed)
- [ ] P0-T8 Dev tooling (Prettier, editorconfig, gitignore, scripts, `astro check`)
- [ ] P0-T9 Cloudflare Pages config (build/publish; host 301 via Bulk Redirect) + Web3Forms key
- [ ] P0-T10 ncu refresh + verify clean install + build green (no feature code yet)

### Phase 1 — Project scaffolding & structure
- [ ] P1-T1 Folder structure (components/{ui,sections,islands}, layouts, styles, lib, data, public)
- [ ] P1-T2 Site constants file (`src/data/site.ts`)
- [ ] P1-T3 Base files (Layout.astro + `<ClientRouter />`, index.astro, 404.astro)
- [ ] P1-T4 Smoke test (renders with tokens+font, island hydrates, deploy preview)

### Phase 2 — Design system & layout
- [ ] P2-T1 Color tokens → Tailwind theme (near-black, single accent)
- [ ] P2-T2 Typography (Outfit variable, scale, fallback, preload)
- [ ] P2-T3 Base `Layout.astro` (lang, landmarks, skip-link, `<ClientRouter />`)
- [ ] P2-T4 `Seo.astro` head component (title/meta/OG + JSON-LD slot)
- [ ] P2-T5 Motion utilities (IntersectionObserver reveal, reduced-motion)
- [ ] P2-T6 UI primitives (Button, Card, Badge, Section, Container)
- [ ] P2-T7 Encode design principles (spacing, container, one-accent rule)

### Phase 2.5 — Design showcase & approval gate (GATE)
- [ ] P2B-T1 Preview route `/preview` (noindex, sitemap-excluded) + sticky TOC, grouped layout
- [ ] P2B-T2 Foundations group (tokens, type, spacing, elevation, icons)
- [ ] P2B-T3 Components group by category (Actions/Containers/Forms/Disclosure/Feedback)
- [ ] P2B-T4 Sections group (assembled mockups, placeholder data, real order)
- [ ] P2B-T5 Variations group (A/B/C per piece: hero, button/card, accent)
- [ ] P2B-T6 States & motion group (hover/focus/disabled, scroll-reveal, reduced-motion)
- [ ] P2B-T7 Responsive proof (mobile + desktop)
- [ ] P2B-T8 Deploy preview + record chosen variants (gate to approve)

### Phase 3 — Static sections
- [ ] P3-T1 Header/nav shell (sticky blur, links, Book CTA)
- [ ] P3-T2 Hero (rating row, 3 CTAs, trust strip, media slot)
- [ ] P3-T3 Value props (4 badges)
- [ ] P3-T4 Pricing matrix shell (3 tiers, badges, add-ons, guarantee)
- [ ] P3-T5 How It Works (3 steps)
- [ ] P3-T6 Social proof (reviews, guarantee, brand logos)
- [ ] P3-T7 Service area static (coverage list + copy)
- [ ] P3-T8 Footer (columns, NAP, click-to-call, legal)
- [ ] P3-T9 Sticky mobile action bar ([Book][Call])
- [ ] ~~P3-T10 Membership/Fleet band~~ → DEFERRED to post-launch roadmap (not launch scope; not build Phase 2)

### Phase 4 — Interactive islands
- [ ] P4-T1 Mobile nav slide-over (client:idle, a11y)
- [ ] P4-T2 Pricing size-selector → instant estimator (client:visible; size→exact price + "Book this")
- [ ] P4-T3 Zip validator (client:visible, graceful out-of-area)
- [ ] P4-T4 FAQ accordion (accessible disclosure)
- [ ] P4-T5 Scroll-reveal wiring (reduced-motion)

### Phase 5 — Our Work gallery
- [ ] P5-T1 Grid/masonry layout + hover (transform)
- [ ] P5-T2 Images via astro:assets (AVIF/WebP, alt, captions)
- [ ] P5-T3 Before/after slider island (img-comparison-slider)
- [ ] P5-T4 Lightbox (GLightbox, lazy)
- [ ] P5-T5 Video (poster + click-to-play / lazy facade)
- [ ] P5-T6 Optional filter chips

### Phase 6 — Booking & lead capture
- [ ] P6-T1 Cal.com setup (free tier): one event type + booking questions (no routing form)
- [ ] P6-T2 Lazy Cal.com embed island + fallback
- [ ] P6-T3 Quote form (Web3Forms) + success state
- [ ] P6-T4 Tap-to-call wiring (hero/sticky/footer)
- [ ] P6-T5 (Optional, default off) Stripe deposit

### Phase 7 — SEO & structured data
- [ ] P7-T1 Title/meta/OG per page
- [ ] P7-T2 JSON-LD AutoWash LocalBusiness (SAB form)
- [ ] P7-T3 JSON-LD Service + FAQPage + Organization/WebSite
- [ ] P7-T4 Sitemap + robots.txt + canonical + locale
- [ ] P7-T5 Custom 404
- [ ] P7-T6 H1/headings/alt/NAP audit
- [ ] P7-T7 AggregateRating (only if genuine; note caveat)

### Phase 8 — Performance & accessibility
- [ ] P8-T1 Hydration-directive audit
- [ ] P8-T2 Image strategy verified
- [ ] P8-T3 Third-party lazy + analytics deferred
- [ ] P8-T4 Font preload/swap/subset (no CLS)
- [ ] P8-T5 Lighthouse mobile ≥90 (LCP/CLS/TBT)
- [ ] P8-T6 WCAG AA pass (focus/aria/contrast/keyboard/reduced-motion)
- [ ] P8-T7 Cross-browser/responsive checks

### Phase 9 — QA, analytics & deploy
- [ ] P9-T1 Analytics + conversion events
- [ ] P9-T2 Owner-data & assets pass (placeholders, OG image, favicons)
- [ ] P9-T3 Copy proofread (US, consistent CTAs, no internal notes)
- [ ] P9-T4 Final QA matrix (devices/forms/links/embed/404)
- [ ] P9-T5 Production deploy (domain, HTTPS, one host, submit sitemap)
- [ ] P9-T6 Search Console + GBP linkage

### Phase 10 — Off-site SEO playbook (owner / post-launch)
- [ ] P10-T1 GBP create/optimize (SAB, category, NAP, services, photos)
- [ ] P10-T2 Reviews engine (3–5/mo, respond ≤24–48h)
- [ ] P10-T3 Citations (consistent NAP across directories)
- [ ] P10-T4 Local links + E-E-A-T
- [ ] P10-T5 Measurement cadence (SC, GBP, geo-grid)
- [ ] P10-T6 Roadmap triggers (city pages + blog)
