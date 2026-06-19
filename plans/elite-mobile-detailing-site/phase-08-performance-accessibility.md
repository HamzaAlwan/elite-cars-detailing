# Phase 8 — Performance & Accessibility

**Goal:** Mobile Lighthouse ≥ 90 across categories and WCAG 2.1 AA compliance. JS budget:
total shipped JS ≤ ~50KB gzipped (islands only) — "as light as possible."
**Depends on:** Phases 3–7
**Status:** ⬜ Not started
**Spec refs:** `INITIAL_IDEA.md` §6, §7.

## Tasks

- [ ] **P8-T1 — Hydration audit** — every island uses the lightest viable directive
  (`client:idle`/`client:visible`/load-on-click); nothing static is hydrated. Confirm total
  shipped JS stays within the ~50KB-gz budget — Motion One (~5KB) counts toward it. Confirm NO
  animated-icon library was added (icons = CSS + Motion One only → 0 extra KB).
- [ ] **P8-T2 — Image strategy** — AVIF/WebP, dimensions set, lazy below fold. The hero is a single
  optimized image — preload + `fetchpriority="high"` ONLY it as the LCP element; no hero video
  (spec §4.2). Verify the AVIF hero doesn't regress LCP on a real mid-tier iPhone (AVIF decodes
  slower) — if it does, serve WebP-only for the hero, keep AVIF for the gallery (§2.5).
- [ ] **P8-T3 — Third-party lazy** — Cal.com + video facades load on demand; analytics deferred.
- [ ] **P8-T4 — Fonts** — Outfit variable preloaded with `crossorigin` (mandatory on Safari even
  same-origin; preload URL must match the `@font-face src`; woff2-only), `swap`, latin subset; verify no CLS.
- [ ] **P8-T5 — Lighthouse (mobile)** — run; fix to LCP < 2.5s, CLS < 0.1, low TBT; perf ≥ 90.
- [ ] **P8-T6 — Accessibility (AA)**
  - Visible `:focus-visible` rings; ARIA on hamburger / zip input / size selector + estimator /
    slider / lightbox; contrast against the computed token baseline (text 18.7:1, muted 9.0:1,
    white-on-CTA-fill 6.0:1, blue-on-bg 4.4:1 for ≥24px — white NEVER on `--color-brand`); control
    borders ≥3:1; tap targets ≥44px (`-webkit-tap-highlight-color` replaced by a custom `:active`);
    inputs 16px; keyboard nav full path; `prefers-reduced-motion` REDUCES (content stays visible,
    final state); semantic landmarks; meaningful alt text. Animated SVGs use `transform-box:fill-box`
    + `pathLength="1"` with explicit dimensions (no CLS); scroll-driven reveals fall back to
    IntersectionObserver on iOS < 26. Run axe / Lighthouse a11y.
- [ ] **P8-T7 — Cross-browser / responsive** — Chrome/Safari/Firefox; mobile-first breakpoints.
  **Real-iPhone pass (audience is mostly iOS):** the glass-nav `-webkit-` prefix survives the build
  with no nested blur, sticky-bar safe-area, `100svh` hero, no input auto-zoom, Cal facade opens cleanly,
  `<ClientRouter />` degrades on iOS 17- (§2.5). Spot-check one older iPhone + Android Chrome.

## Done when
Lighthouse mobile ≥ 90 in Performance/Accessibility/Best-Practices/SEO; automated a11y checks clean;
verified on real mobile viewport.
