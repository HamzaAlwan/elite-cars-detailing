---
name: Web performance & accessibility
description: >-
  Performance budget and WCAG AA accessibility for this Astro build. Use when
  optimizing images/fonts/JS, lazy-loading third parties, checking Core Web Vitals or
  Lighthouse, or implementing focus/aria/keyboard/contrast/reduced-motion behavior.
---

# Performance & accessibility

Targets: **mobile Lighthouse ≥ 90** (all categories), LCP < 2.5s, CLS < 0.1, **WCAG 2.1 AA**.

## Performance

- Zero-JS baseline (Astro). The islands list is the JS budget — audit nothing static is
  hydrated; prefer `client:idle` / `client:visible`.
- Images: `astro:assets` AVIF/WebP, `srcset`, set dimensions, lazy below the fold. The hero is a
  single optimized image — preload ONLY it as the LCP element (no hero video).
- Third-party lazy: Cal.com embed + video facades load on click/scroll; analytics = Umami
  (cookieless, ~2KB, deferred; custom events via `umami.track()`).
- Fonts: Outfit variable, `preload` + `font-display: swap`, latin subset (no CLS).
- Animate only `transform` / `opacity` (GPU); never layout-affecting props. Use the motion tokens
  (`--ease-*`, `--dur-*`, ≤500ms; `INITIAL_IDEA.md` §2.4). Motion One (~5KB) for in-island reveals
  counts toward the JS budget; honor `prefers-reduced-motion` (REDUCE to final state, `0.01ms` not `0`).
- Animated icons: NO library — inline Lucide SVGs animated with CSS + Motion One (0 KB extra). On
  iOS set `transform-box: fill-box`; stroke draws use `pathLength="1"` + ≥2 dash values; explicit SVG
  dimensions (no CLS). `animation-timeline: view()` is Safari-26-only → keep IntersectionObserver baseline.

## Accessibility (AA)

- Contrast ≥ 4.5:1 body / 3:1 large text (use the design tokens; no blue body text).
- Semantic landmarks; exactly one `<h1>`; logical heading order.
- Visible focus rings; complete keyboard path; aria on the hamburger, zip input, size
  selector / estimator, before/after slider, and lightbox; focus trap + Esc in the mobile nav.
- Honor `prefers-reduced-motion` (REDUCE, don't delete — keep final state); never convey state by
  color/emoji alone (add text + icon).
- Meaningful alt text; decorative images `alt=""`.

Ref: `INITIAL_IDEA.md` §6, §7. Verify with Lighthouse (mobile) + axe.
