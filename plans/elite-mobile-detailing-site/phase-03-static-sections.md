# Phase 3 — Static Sections (low/no JS)

**Goal:** Every static `.astro` section built with real copy + placeholders, top to bottom,
responsive. Interactivity is wired in Phase 4.
**Depends on:** Phase 2.5 (design approved)
**Status:** ✅ Done (2026-06-20)

> Assemble the **components + variants approved in Phase 2.5** (`/preview`) — reuse/refine them,
> don't rebuild from scratch. Page order follows spec §4 (also see below).
**Spec refs:** `INITIAL_IDEA.md` §3, §4.1–§4.12.

> **Convention:** build **mobile-first** — base styles target mobile, scale up with `md:`/
> `lg:`; no fixed pixel widths on wrappers; verify at small viewports first. (See `00-OVERVIEW.md`.)
> **Page order follows spec §4** (Header → Hero → Value → Pricing → How It Works → Our Work →
> Social proof → Service Area → Booking → FAQ → Footer) so trust peaks before the ask.
> (Membership/Fleet is deferred to the post-launch roadmap — not in launch order, and not
> build Phase 2 which is the design system.)

## Tasks

- [x] **P3-T1 — Header / nav shell**
  - Sticky GLASS nav: solid `rgba(13,16,25,.85)` baseline + `@supports` blur (`-webkit-` first,
    8–14px, NO nested blur — §2.5); logo + tagline wordmark (back-to-top); desktop links
    (Services · Pricing · Our Work · Service Area · How It Works · FAQ); primary `.btn-metal` "Book Now".
  - Leave a mount point for the mobile slide-over island (P4-T1).
- [x] **P3-T2 — Hero (§4.2)**
  - `min-height:100svh` (not bare `100vh` — §2.5); headline + subheadline; COLD-START (no reviews
    yet) → in place of a star rating show the trust strip "100% self-contained · Same-day slots ·
    Insured & vetted" + the satisfaction-guarantee badge (NOT a fabricated rating); CTAs Book /
    Quote / tap-to-call; 2-col on desktop. Media = ONE optimized image via `<Picture
    formats={['avif','webp']}>`, preloaded + `fetchpriority="high"` as the LCP element (NOT a video,
    NOT the before/after slider — that stays in the gallery). One STATIC radial sapphire glow behind
    it (a background gradient, NOT a backdrop-filter). Verify AVIF doesn't regress LCP on a real
    iPhone, else WebP-only for the hero (§2.5). Reserve the "★ 5.0 · NN reviews" row for when real
    GBP reviews exist.
- [x] **P3-T3 — Value props (§4.3)** — 4 badge cards, grid 1→2→4; subtle hover micro-motion on each
  Lucide icon via `.icon-hover` (desktop pointer only, §2.3/§2.4).
- [x] **P3-T4 — Pricing matrix shell (§4.4)**
  - 3 `.surface-raised` tier cards (Standard / Elite Signature [Most Popular — metallic badge] /
    Ceramic = Request Quote). Ceramic is TIERED (e.g. "3-yr from $650 · 9-yr from ~$1,500" — owner
    confirms exact). Inclusions, add-ons note, guarantee line. Per-card CTA = `.btn-metal`.
    Size-selector → instant-estimator behavior in P4-T2.
- [x] **P3-T5 — How It Works (§4.5)** — 3 steps; payment = card/contactless/Apple Pay (cash welcome).
- [x] **P3-T6 — Social proof (§4.7)** — COLD-START: guarantee callout, insured/certified +
  founder-experience credibility, brand-logo row (real brands used). NO fabricated review cards;
  add real review cards (name · city · vehicle) only once genuine Google reviews exist.
- [x] **P3-T7 — Service area static (§4.8)** — coverage list + copy; container for the zip island (P4-T3).
- [x] **P3-T8 — Footer (§4.12)** — columns (areas/contact/links/social/legal), NAP, click-to-call,
  mailto, brand wordmark + tagline "No hookups. No hassle. Just shine." Include a short
  cookieless/privacy note ("This site uses no tracking cookies") + optional Privacy Policy link
  (owner-supplied) — true with Umami; keeps the no-consent-banner property.
- [x] **P3-T9 — Sticky mobile action bar (§3.2)** — fixed `[Book] [Call]`, mobile only; safe-area
  insets (`viewport-fit=cover` + `padding-bottom: max(12px, env(safe-area-inset-bottom))`) and
  reserve body bottom padding so content isn't hidden behind it (§2.5).
- [ ] ~~**P3-T10 — Membership/Fleet band (§4.11)**~~ — DEFERRED to the post-launch roadmap (not launch scope; not build Phase 2).

## Done when
The full single page scrolls end-to-end with all static content, is responsive, and every
nav anchor scrolls to its section.

## Completed 2026-06-20
All 9 tasks shipped. Post-build fixes applied (Bug 1–7 in the UI/UX review):
- Bug 1: `initReveal()` moved to single global call in `index.astro`
- Bug 2: `tel:` links guarded against `{{PHONE_E164}}` placeholder in Hero + StickyBar
- Bug 3: `.icon-hover` class added to all value prop SVG strings
- Bug 4: `scroll-padding-top` corrected to `4rem` (nav is `h-16` = 64px)
- Bug 5: `text-base` removed from value prop `<h3>` — proper h3 size restored
- Bug 6: Esc key handler added to Nav mobile panel
- Bug 7: `aria-hidden="true"` removed from `#mobile-nav-mount` div
Logo SVG assets: `public/logo.svg`, `public/logo-compact.svg`, `public/favicon.svg` created.
Design system additions: `--text-h4`, `.badge-featured`, `.surface-featured`, disabled btn, input focus border, menu-icon timing.
