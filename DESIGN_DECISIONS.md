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
- [ ] **Overall direction approved?** — yes / changes: _____ (pending re-review of the updated `/preview`)

## After the pick (apply, then start Phase 3)

- If the blue changes: update `--color-brand` / `--color-brand-strong` / `--color-brand-deep` /
  `--color-brand-bright` in `src/styles/global.css` (re-verify WCAG contrast).
- If metallic intensity changes: adjust the `.btn-metal` gradient/sheen in `src/styles/global.css`.
- Record the final choices below.

**Recorded:** _(pending review)_
