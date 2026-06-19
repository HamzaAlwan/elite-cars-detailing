# Phase 2.5 — Design Showcase & Approval Gate

**Goal:** A comprehensive, well-grouped `/preview` page that shows the design — component library
+ assembled section mockups + a few variations to choose from — so the owner can **review and
approve the look (and pick variants) BEFORE the full section build**. Components built here are
**reused** by Phase 3 (not throwaway).
**Depends on:** Phase 0 (deps), Phase 1 (scaffold), Phase 2 (tokens + primitives)
**Status:** ⬜ Not started
**Spec refs:** `INITIAL_IDEA.md` §2 (design system), §4 (sections); build skills.

> **GATE:** do not start Phase 3 until the owner reviews `/preview`, selects variants, and
> approves the direction. Use Reka UI primitives (skill: vue-shadcn-islands); Astro 6 / Tailwind v4
> / all-OSS conventions apply.

## Page organization (grouped well)

`/preview` is split into clear, labelled groups — each a section with a heading + sticky-TOC
anchor, visually separated and consistently spaced, in this order:

1. **Foundations** — color tokens/swatches, typography scale, spacing, radius, elevation, icons, motion tokens.
2. **Components** — grouped by category: *Actions* (buttons, links) · *Containers* (cards, section
   shells) · *Forms* (inputs, select, segmented control, validation states) · *Disclosure*
   (accordion, tabs) · *Feedback* (badges, alerts, loading/empty/error).
3. **Sections** — assembled mockups in real page order (hero → value → pricing → how-it-works →
   Our Work → social proof → service area/zip → booking → FAQ → footer + sticky bar).
4. **Variations** — A/B/C options grouped *per piece*, shown side-by-side for comparison.
5. **States & motion** — hover/focus/disabled, scroll-reveal, reduced-motion.

Related items sit together; nothing floats ungrouped.

## Tasks

- [ ] **P2B-T1 — Preview route + organization**
  - `/preview` page using `Layout.astro`; `noindex` (robots meta) + excluded from sitemap;
    internal/removable before launch. Sticky in-page TOC linking the 5 groups above; one heading
    per group, consistent spacing + dividers.
- [ ] **P2B-T2 — Foundations group**
  - Color-token swatches (with hex + token name), typography scale specimen, spacing/radius/
    elevation samples, icon set (Lucide). The design system made visible.
- [ ] **P2B-T3 — Components group (by category)**
  - Actions / Containers / Forms / Disclosure / Feedback — each component shown in states
    (default/hover/focus/disabled). Built on Reka primitives where interactive.
- [ ] **P2B-T4 — Sections group (assembled mockups, placeholder data)**
  - Hero, value props, pricing matrix (+ size selector), how-it-works, Our Work gallery
    (before/after slider + lightbox sample), social proof, service area + zip, booking placeholder,
    FAQ, footer, sticky mobile bar — in real page order.
- [ ] **P2B-T5 — Variations group (pick a direction)**
  - 2–3 labelled variants (A/B/C) per piece: hero layout, button + card style, **metallic intensity
    (flat · subtle · glossier)**, and **2–3 premium-blue candidates** — shown side-by-side for easy
    selection. Anodized, never chrome (§2.3).
- [ ] **P2B-T6 — States & motion group**
  - Scroll-reveal, hover, the specular sweep (hover on desktop, **scroll-into-view on touch**),
    `prefers-reduced-motion` demo (REDUCES — content stays visible); loading/empty/error states for
    the quote form + zip validator.
  - Also demo the motion tokens (easing/duration) and the animated icons — hamburger↔X morph, the
    zip-success checkmark draw, and value-icon hover — and verify the sweep/hover are absent on touch
    and the SVG draws render correctly on a real iPhone (§2.3/§2.4/§2.5).
- [ ] **P2B-T7 — Responsive proof (real iPhone — audience is mostly iOS)**
  - Verify key components at mobile + desktop (mobile-first); ≥44px touch targets. On a REAL iPhone
    in daylight: glass nav (no white-blur bug / jank), sticky bar clears the home indicator, the
    `100svh` hero doesn't clip, the sheen plays on scroll (not stuck on tap), inputs don't auto-zoom.
- [ ] **P2B-T8 — Deploy preview + record decisions**
  - Cloudflare Pages preview URL for review on real devices; **record the owner's chosen variants**
    in `src/data/site.ts` (or a short `DESIGN_DECISIONS.md`) before Phase 3.

## Done when (GATE)
The owner has reviewed `/preview`, selected the variants they like, and approved the design
direction; chosen variants are recorded. Only then does Phase 3 begin (reusing these components).
