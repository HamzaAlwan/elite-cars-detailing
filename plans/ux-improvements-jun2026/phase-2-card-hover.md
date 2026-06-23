# Phase 2 — Card Hover Enhancement

Issue: 1 (card hover animation not visible)
Estimated time: ~20 minutes
Files: `src/styles/global.css`

---

## Background

Current `.card-hover:hover` uses `filter: drop-shadow(0 10px 22px rgb(0 0 0 / 0.45))`.

**Root cause:** The shadow color is **black on a nearly-black background** — invisible. The original comment in `global.css` (line 277) correctly explains why `filter: drop-shadow` was chosen over `box-shadow`: it avoids clobbering the inset bevel shadows on `.surface-raised` and `.surface-featured`. The approach is right — only the color and lift need to change.

**Fix:** Change drop-shadow color to sapphire brand blue + increase lift from 3px → 6px. Add a second drop-shadow for depth. No structural changes needed.

---

## Task 2.1 — Update `.card-hover:hover`

**Status:** [ ]

**File:** `src/styles/global.css` (lines 280–290)

```css
/* Before */
@media (hover: hover) and (pointer: fine) {
  .card-hover {
    transition:
      transform var(--dur-base) var(--ease-standard),
      filter var(--dur-base) var(--ease-standard);
  }
  .card-hover:hover {
    transform: translateY(-3px);
    filter: drop-shadow(0 10px 22px rgb(0 0 0 / 0.45));
  }
}

/* After */
@media (hover: hover) and (pointer: fine) {
  .card-hover {
    transition:
      transform var(--dur-base) var(--ease-standard),
      filter var(--dur-base) var(--ease-standard);
  }
  .card-hover:hover {
    transform: translateY(-6px);
    filter:
      drop-shadow(0 0 16px rgb(30 95 255 / 0.50))   /* brand glow ring */
      drop-shadow(0 10px 24px rgb(30 95 255 / 0.20)) /* ambient sapphire */
      drop-shadow(0 8px 20px rgb(0 0 0 / 0.45));     /* depth */
  }
}
```

**Why this works:**

- `drop-shadow` renders around the card's visual shape (respects border-radius) without touching `box-shadow`
- `rgb(30 95 255 / 0.50)` (sapphire at 50%) is clearly visible on `#06080f` (the bg color)
- Chained drop-shadows compose additively — the glow + depth shadows layer together
- Existing `surface-raised` and `surface-featured` box-shadows are completely untouched
- The `transition: filter` was already there — no changes to the transition needed

**No other tasks needed for this phase.** The `.surface-featured.card-hover` automatically benefits from the same filter rule since it also has `.card-hover` in its class list.

---

## Verification

1. `npm run dev` → open site on desktop (Chrome)
2. Hover over the **Standard Reset** card (`.surface-raised`): should see 6px lift + sapphire glow halo
3. Hover over the **Elite Signature** card (`.surface-featured`): same glow on top of the existing brand border
4. Hover over the **Ceramic Upgrade** card: same effect
5. Hover over value-prop cards (`.card-hover` is also used in ValueProps section): same effect
6. On mobile/touch: NO hover effect fires (media query `(hover: hover) and (pointer: fine)` correctly excludes touch)
7. Transition should feel smooth ~250ms — not jarring
8. Confirm the inset bevel still looks correct in the resting (non-hover) state
