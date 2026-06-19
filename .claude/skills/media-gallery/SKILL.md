---
name: Our Work media gallery
description: >-
  How to build the beautiful, lightweight "Our Work" image + video gallery. Use when
  implementing the gallery/portfolio, before/after comparison sliders, a lightbox, or
  embedding photos/video with good performance.
---

# Our Work gallery (images + video)

A premium, scannable portfolio of real results — and **light** (lazy everything). Anchor `#work`.

## Build

- Layout: responsive grid/masonry, rounded-2xl tiles, hover zoom on `transform` only,
  consistent aspect ratios (no CLS).
- Images: `astro:assets` → AVIF/WebP, `srcset`, explicit dimensions, lazy. Descriptive
  filenames + alt; captions "vehicle · city · package" (doubles as SEO).
- Before/after: `img-comparison-slider` (MIT) as an island hydrated `client:visible`;
  keyboard-operable.
- Lightbox: **GLightbox** (MIT — image + HTML5/YouTube/Vimeo); lazy-load on first click.
  Avoid lightGallery (GPL / paid for commercial use).
- Video: self-host compressed MP4/WebM with `preload="none"` + poster + click-to-play, OR a
  lazy YouTube/Vimeo facade (`lite-youtube-embed`, MIT). At most ONE muted autoplay loop
  site-wide (the hero). Respect `prefers-reduced-motion` + Save-Data.

All libs MIT. Ref: `INITIAL_IDEA.md` §4.6, §6b. Pairs with `web-performance-accessibility`.
