# Phase 2 — Design System & Global Layout

**Goal:** Design tokens, Outfit typography, base layout, SEO head shell, motion utilities,
and reusable UI primitives — all enforcing "modern & simple."
**Depends on:** Phase 1
**Status:** ✅ Done — tokens/type/motion/primitives built; `astro check`/`eslint`/`build` green.
(Font preload is optimized in P8-T4; the full visual showcase + variant selection is Phase 2.5.)
**Spec refs:** `INITIAL_IDEA.md` §2.0–§2.4.

## Tasks

- [x] **P2-T1 — Color tokens (Tailwind v4 `@theme`)**
  - Define in `src/styles/global.css` inside `@theme { … }` with the `--color-` prefix — the
    premium blue/black ramp from `INITIAL_IDEA.md` §2.1: `--color-bg #06080F`, `--color-bg-elevated`,
    `--color-bg-elevated-2`, `--color-border`, `--color-border-bright`, `--color-text`,
    `--color-text-muted`, `--color-brand #2B6BFF`, `--color-brand-strong`, `--color-brand-deep`,
    `--color-brand-bright`, `--color-brand-hover`, `--color-brand-tint`, `--color-success`,
    `--color-warning`. No JS config / `theme.extend` (that's v3).
  - Rules (verified): white CTA text on `--color-brand-strong` (6.0:1) or darker, never on
    `--color-brand` (4.52:1) / `--color-brand-bright`; brand blue only on ≥24px elements; borders
    are decorative (controls need their own ≥3:1 + focus ring). See `INITIAL_IDEA.md` §2.1.
- [x] **P2-T2 — Typography (Outfit)**
  - Import `@fontsource-variable/outfit`; set base family + fallback stack; `preload`; `swap`.
  - Type scale: h1 32→56, h2 26→40, h3 20→24, body 16/1.6, small 14. Weights 400/500/600–700.
- [x] **P2-T3 — `Layout.astro`**
  - `<html lang="en">`, semantic landmarks, skip-to-content link, `<head>` slot, global CSS,
    favicon / apple-touch-icon / `site.webmanifest` links (assets from P1-T1),
    Astro 6 `<ClientRouter />` (the removed `<ViewTransitions />` is gone — `<ClientRouter />` only).
- [x] **P2-T4 — `Seo.astro` head component**
  - Props-driven `<title>`, meta description, canonical, OG/Twitter; a `<slot>` for JSON-LD
    (schema authored in Phase 7).
- [x] **P2-T5 — Motion utilities + tokens**
  - Define the motion tokens in `@theme`/`global.css`: easing `--ease-standard/out/in/emphasized/snappy`
    + duration `--dur-instant/fast/base/slow/slower` (≤500ms) — §2.4. Use them site-wide.
  - `src/lib/reveal.ts`: IntersectionObserver scroll-reveal (transform/opacity only; 60–80ms stagger,
    cap ~8–12). Keep IO as the baseline; layer `animation-timeline: view()` only behind `@supports` (Safari 26+).
  - Scaffold `src/lib/motion.ts` for Motion One (`motion`) — verify it imports; richer
    `whileInView` reveals are wired into islands in Phase 4 (P4-T5). Counts toward the JS budget.
  - Global `@media (prefers-reduced-motion: reduce)` REDUCES non-essential motion — keep the final
    visible state (never a blanket `animation:none`, which can hide fade-ins). See `INITIAL_IDEA.md` §2.4.
- [x] **P2-T6 — UI primitives + metallic utilities**
  - `Button` (primary `.btn-metal` = sapphire gradient + inset highlight + specular sweep / ghost;
    ≥44×44px), `Card` (`.surface-raised` bevel), `Badge`, `Section` (py rhythm), `Container`
    (max-width). Add reusable CSS utilities: `.surface-raised`, `.btn-metal`/`.sheen`,
    `.divider-chrome`, and the glass-nav `@supports` pattern (`-webkit-` first, no nested blur).
    See `INITIAL_IDEA.md` §2.3/§2.5. Prefer shadcn-vue where interactive, else `.astro`.
  - Animated-icon utilities (NO library — inline Lucide SVGs): `.menu-icon` (hamburger↔X morph),
    `.icon-draw` (stroke checkmark via `stroke-dashoffset`, `pathLength="1"`), `.icon-hover` (gated
    `@media (hover:hover) and (pointer:fine)`); SVG `transform-box: fill-box` per §2.3/§2.5.
- [x] **P2-T7 — Encode design principles**
  - Spacing scale, container widths, rounded-2xl, one-accent rule, the "shine budget" (metallic
    only on CTA / Most-Popular badge / hero glow / glass nav / one divider), and the mobile/iOS
    guardrails (§2.5) documented in code comments so later sections stay consistent.

## Done when
A blank page demonstrates tokens + Outfit type; primitives render; reduced-motion verified.
