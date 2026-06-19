---
name: Tailwind v4 & design system
description: >-
  The project's design system and Tailwind v4 conventions. Use when styling any
  component, defining or using color/type/spacing tokens, writing CSS, applying the
  "modern & simple" look, doing mobile-first responsive work, or setting up Tailwind
  in Astro.
---

# Tailwind v4 + design system

Tailwind **v4** — CSS-first config (no JS config file needed). In Astro, wire via the
`@tailwindcss/vite` plugin and import Tailwind in your global CSS. Content is
auto-detected (no `content` array).

## Tokens (CSS-first `@theme`)

Define in `src/styles/global.css` with `@theme { … }`. v4 requires the `--color-` prefix.
Palette (from `INITIAL_IDEA.md` §2.1 — premium blue/black, contrast computed):

- Surfaces: `--color-bg: #06080F` (deep cool blue-black — never pure #000),
  `--color-bg-elevated: #0D1019`, `--color-bg-elevated-2: #151926`,
  `--color-border: #222838`, `--color-border-bright: #39445C` (decorative bevel highlight).
- Text: `--color-text: #F4F7FF` (18.7:1), `--color-text-muted: #A4AEC4` (9.0:1).
- Sapphire ramp: `--color-brand: #2B6BFF` (display/accent, ≥24px only), `--color-brand-strong: #1E55E6`
  (CTA fill where white text sits — 6.0:1), `--color-brand-deep: #13328F` (gradient floor/pressed),
  `--color-brand-bright: #5E97FF` (sheen/edges ONLY, never behind text), `--color-brand-hover: #1A4ED1`,
  `--color-brand-tint: rgba(43,107,255,0.12)`. Status: `--color-success: #22C55E`, `--color-warning: #F59E0B`.
- Font: Outfit variable (Fontsource) → `--font-sans: "Outfit Variable", system-ui, …`.

## Modern & simple (enforce)

- ONE accent (sapphire blue); everything else neutral blue-grays. **No blue body text** — blue
  only on ≥24px elements / CTAs. White CTA text sits on `--color-brand-strong` (6.0:1) or darker,
  NEVER on `--color-brand` (4.52:1, too thin) or `--color-brand-bright`.
- Whitespace + large type carry the layout; avoid decorative borders (use spacing + LAYERED
  elevation + the metallic-depth treatment below). Rounded-2xl, soft shadows.
- Real photography as the visual; no gradient-on-gradient, no neon, no clip-art.

## Metallic / gloss depth (restrained — see `INITIAL_IDEA.md` §2.3/§2.4)

- Anodized, NOT chrome: metallic gradients tint toward the brand blue. ~95% of surfaces stay
  matte; "shine budget" = primary CTA, "Most Popular" badge + active selector segment, a STATIC
  hero glow, the glass nav, one gradient-hairline divider. Everything else flat.
- `.surface-raised` = inset top highlight + inset bottom shade + ONE modest outer shadow (bevel).
  `.btn-metal` = sapphire gradient (brand → strong → deep) + inset highlight + a specular sweep on
  a `::after` (transform/opacity only, `overflow:hidden`). Gradient borders via padding-box/border-box.
- Specular sweep is touch-first: gate hover behind `@media (hover:hover) and (pointer:fine)`; on
  touch play it once on scroll-into-view; `:active` = press feedback. `prefers-reduced-motion`
  REDUCES (keep final visible state), never deletes. Never animate box-shadow/gradients on scroll.

## Motion (premium system — see `INITIAL_IDEA.md` §2.4)

- Tokens (CSS vars): easing `--ease-standard/out/in/emphasized/snappy`; duration
  `--dur-instant 100 / fast 150 / base 250 / slow 350 / slower 500` (500ms = max). Entrances
  ease-OUT, no bounce. Use the tokens everywhere — consistency = "premium".
- Animated icons: **NO library** — animate inline Lucide SVGs with CSS (transform/opacity +
  `stroke-dashoffset`) + Motion One. Utilities `.menu-icon` (hamburger↔X), `.icon-draw` (checkmark),
  `.icon-hover` (gated `@media (hover:hover) and (pointer:fine)`). 0 KB new JS.
- Restrained: scroll reveal (stagger 60–80ms, cap ~8–12), one signature move (the CTA sweep),
  transform/opacity only, reduced-motion REDUCES (final state, `0.01ms` not `0`).

## Mobile / iOS (audience is mostly iPhone — see `INITIAL_IDEA.md` §2.5)

- Glass nav: `-webkit-backdrop-filter` BEFORE `backdrop-filter` (verify it survives the build);
  NEVER nest blur; ship a solid `rgba(13,16,25,.85)` baseline + `@supports` blur (8–14px).
- `viewport-fit=cover` + `env(safe-area-inset-bottom)` for the sticky bar; `100svh` (not `100vh`)
  for the hero; inputs at `font-size:16px` (no iOS zoom); tap targets ≥44px; font preload needs
  `crossorigin`; AVIF for the hero only after measuring LCP on a real iPhone (else WebP).
- Animated SVGs: `transform-box: fill-box; transform-origin: center` (iOS pivot); stroke draws use
  `pathLength="1"` + ≥2 dash values (Safari); explicit SVG dimensions (no CLS). Scroll-driven
  animations (`animation-timeline: view()`) are Safari-26-only → IntersectionObserver baseline + `@supports`.

## Mobile-first

- Base utilities target mobile; scale up with `md:`/`lg:`. No fixed px widths on wrappers;
  verify small viewports first. Touch targets ≥ 44×44px.

Type scale, spacing, motion: `INITIAL_IDEA.md` §2.2–§2.4. Pairs with `astro-islands`,
`web-performance-accessibility`.
