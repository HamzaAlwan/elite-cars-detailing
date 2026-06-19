# Design decisions — Phase 2.5 gate

Record the owner's picks from `/preview` here **before** Phase 3 begins. The `/preview` page is
internal (noindex, sitemap-excluded) and is removed before launch.

## How to review

- `npm run dev` → open `http://localhost:4321/preview` (ideally on a real iPhone via the
  Cloudflare Pages preview URL once the repo is connected — P0-T9).
- Check the five groups: Foundations · Components · Sections · Variations · States & motion.

## Pending owner review

- [x] **Metallic intensity** → **MATTE** (refined 2026-06-19): solid sapphire `--color-brand-strong`
  with a subtle bevel for depth, lighter shadow, `rounded-2xl`, no gloss specular sweep. Applied to `.btn-metal`.
- [ ] **Primary blue** — A `#2B6BFF` (current) · B `#1E5FFF` · C `#3B82F6` → _____
- [ ] **Overall direction approved?** — yes / changes: _____

## After the pick (apply, then start Phase 3)

- If the blue changes: update `--color-brand` / `--color-brand-strong` / `--color-brand-deep` /
  `--color-brand-bright` in `src/styles/global.css` (re-verify WCAG contrast).
- If metallic intensity changes: adjust the `.btn-metal` gradient/sheen in `src/styles/global.css`.
- Record the final choices below.

**Recorded:** _(pending review)_
