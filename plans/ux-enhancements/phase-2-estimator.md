# Phase 2 — Price estimator enhancement (size + ZIP gate → estimate)

**Goal:** turn the existing size selector into a clear instant-estimate widget with an optional
service-area check.
**Why:** owner wants customers to enter car details + (optionally) confirm location and see a price.
Decision: keep size-only inputs (prices are flat by size; no make/model, no travel pricing).

## Tasks
- [ ] Create `src/data/pricing.ts`: export `SIZES` and `PRICING` (moved from `PricingEstimator.vue`)
      so cards + estimator share one source. Type `Size = 'sedan' | 'suv' | 'truck'`.
- [ ] `PricingEstimator.vue`:
  - [ ] Import `SIZES`/`PRICING` from `@/data/pricing`.
  - [ ] Keep the Reka `ToggleGroup` + the card-rewrite (`data-price`/`data-vehicle`/`data-cta`) behavior.
  - [ ] Add an **estimate output block** under the selector: for the selected size, render exact
        prices for all tiers — `Standard $X · Elite $Y · Ceramic from $650` — plus the add-ons line
        (Pet Hair $50 · Odor $60). Use tabular figures so it doesn't shift.
  - [ ] Add an **inline ZIP gate** (reuse `isCoveredZip` from Phase 1): small input + "Check".
        - In-area → show ✓ + a "Book this detail" button that dispatches `booking:open` with the
          selected size (Phase 4 modal). 
        - Out-of-area → reuse the graceful "expanding fast" + email-capture copy from `ZipValidator`.
        - Invalid → inline 5-digit error.
  - [ ] Keep writing `sessionStorage['elite-detail-size']`.
- [ ] Keep the ZIP gate **optional**: pricing is always visible; the gate only gates the convenience CTA.

## Acceptance
- Selecting a size updates the pricing cards (existing) AND the new estimate block.
- ZIP check confirms area and reveals a prefilled Book CTA; never hides prices.
- Reduced-motion safe; 16px inputs; ≥44px targets.

## Notes / decisions
- Estimate shows **exact per-size prices**, not a "from" range (Ceramic stays "from $650" — needs inspection).
- Don't duplicate the zip list or the pricing map — import both.
