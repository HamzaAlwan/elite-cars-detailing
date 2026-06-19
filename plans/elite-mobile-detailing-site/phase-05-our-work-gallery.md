# Phase 5 — Our Work Gallery (images + video)

**Goal:** A premium, beautiful portfolio of real results that stays light (lazy everything,
optimized media).
**Depends on:** Phase 2 (primitives), Phase 3 (section slot)
**Status:** ⬜ Not started
**Spec refs:** `INITIAL_IDEA.md` §4.6, §6 (perf), §6b (gallery libs).

> Libraries (`img-comparison-slider`, `glightbox`, `lite-youtube-embed`) are installed in
> **Phase 0** — import and wire them here, don't reinstall.

## Tasks

- [ ] **P5-T1 — Layout**
  - Responsive grid/masonry; rounded-2xl tiles; subtle hover zoom (`transform` only);
    consistent aspect ratios (no CLS). Anchor id `#work`.
- [ ] **P5-T2 — Images**
  - `astro:assets` (`<Image>`/`<Picture>`): AVIF/WebP, responsive `srcset`, explicit dimensions,
    `loading="lazy"`. Descriptive filenames + alt; captions (vehicle · city · package).
- [ ] **P5-T3 — Before/after slider**
  - `img-comparison-slider` web component (MIT) as an island hydrated on scroll-into-view.
    A11y: `role="slider"` + `aria-label="Before and after comparison"` (+ value attrs) on the
    handle, arrow-key control, visible focus ring; test with axe + a screen reader.
- [ ] **P5-T4 — Lightbox**
  - GLightbox (MIT) — image + HTML5/YouTube/Vimeo; lazy-load on first interaction; keyboard +
    Esc to close.
- [ ] **P5-T5 — Video**
  - Self-host compressed MP4/WebM with `preload="none"` + poster + click-to-play, OR
    lite-youtube/lite-vimeo facade (MIT). NOTE: the hero is a static image (no autoplay), so all
    gallery video is **click-to-play** — no muted autoplay loops. Respect `prefers-reduced-motion`
    + Save-Data.
- [ ] **P5-T6 — Filter chips (optional)** — All · Interior · Exterior · Ceramic; keep simple.

## Done when
The gallery looks premium, all media lazy-loads, lightbox + before/after slider work and are
accessible, and Lighthouse is not regressed.
