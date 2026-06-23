# Phase 3 — Vehicle Selector Redesign

Issue: 13 (add car icons / animations to sedan/SUV/truck selector)
Estimated time: ~3–4 hours (includes 3 preview variants + owner review checkpoint)
Files: `src/components/islands/PricingEstimator.vue`, `src/pages/preview.astro`

---

## Background

Current selector is a text-only pill row: `[Sedan] [Med SUV] [Truck]`. Owner wants it replaced with 3 horizontal card-style buttons, each showing an SVG car silhouette above the label. Three animation variants will be built on `/preview` for owner to pick before implementing in production.

**Constraints:**
- Performance: SVG-only, zero new JS dependencies, Lighthouse ≥ 90
- Accessibility: Keep Reka UI `ToggleGroupRoot` for keyboard arrow-key navigation
- Mobile: 3 cards fit 375px width (min ~80px each, gap-2)
- Booking: Existing `onValueChange` / `applyPrices` / `sessionStorage` logic untouched

---

## Task 3.1 — Create SVG Car Silhouettes

**Status:** [ ]

Create side-profile SVG silhouettes for Sedan, SUV, Truck. Each SVG:
- `viewBox="0 0 120 60"` — landscape orientation, consistent bounding box
- Named layers for animation: `car-body`, `wheel-front`, `wheel-rear`, `car-shadow`
- Fill: `currentColor` so it inherits text color (works on both unselected/selected states)

**Structure template:**
```svg
<svg viewBox="0 0 120 60" fill="none" aria-hidden="true">
  <!-- Ground shadow/glow ellipse -->
  <ellipse class="car-shadow" cx="60" cy="56" rx="46" ry="4"
    fill="rgb(30 95 255 / 0)" />

  <!-- Car body -->
  <path class="car-body" d="... side profile path ..." fill="currentColor" />

  <!-- Wheels -->
  <circle class="wheel rear" cx="28" cy="48" r="10" fill="var(--color-bg)"
    stroke="currentColor" stroke-width="3" />
  <circle class="wheel front" cx="90" cy="48" r="10" fill="var(--color-bg)"
    stroke="currentColor" stroke-width="3" />
</svg>
```

**Profile descriptions:**
- **Sedan:** Classic 3-box silhouette — trunk, cabin with slightly raked roofline, hood
- **SUV:** Taller boxier cabin, higher ground clearance, slightly blunt roofline
- **Truck:** Cab section + flat bed section, higher ride height, larger wheels

Tip: Use a simple bezier-curve approach, not a photo trace. Recognizable profile > realistic detail.

---

## Task 3.2 — Variant A: Spring Bounce (Preview)

**Status:** [ ]

**File:** `src/pages/preview.astro` — add a new section `<section id="car-selector-a">`

The car bounces (spring scale) when its card is selected.

**CSS keyframes:**
```css
@keyframes car-spring {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.14) translateY(-4px); }
  60%  { transform: scale(0.96) translateY(1px); }
  80%  { transform: scale(1.04) translateY(-1px); }
  100% { transform: scale(1); }
}
.car-spring-active .car-body,
.car-spring-active .wheel-front,
.car-spring-active .wheel-rear {
  animation: car-spring 400ms var(--ease-emphasized) forwards;
}
```

The Vue `onValueChange` handler adds/removes `.car-spring-active` class on the selected card's SVG.

**Card selected state (Tailwind):**
```
data-[state=on]:border-brand data-[state=on]:bg-brand-tint data-[state=on]:text-brand
```

---

## Task 3.3 — Variant B: Drive-In (Preview)

**Status:** [ ]

**File:** `src/pages/preview.astro` — add section `<section id="car-selector-b">`

When switching between vehicles, the new car "drives in" from the appropriate side and the old car "drives out" to the other side.

**Direction logic:**
- SIZES array index: `sedan=0, suv=1, truck=2`
- If new index > old index: new car enters from right, old exits to left
- If new index < old index: new car enters from left, old exits to right

**CSS:**
```css
@keyframes drive-in-right  { from { transform: translateX(60px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes drive-in-left   { from { transform: translateX(-60px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes drive-out-right { from { transform: none; opacity: 1; } to { transform: translateX(60px); opacity: 0; } }
@keyframes drive-out-left  { from { transform: none; opacity: 1; } to { transform: translateX(-60px); opacity: 0; } }
```

Vue tracks `prevSelected` to determine direction. Add `overflow: hidden` to each card SVG container.

---

## Task 3.4 — Variant C: Ground Glow (Preview)

**Status:** [ ]

**File:** `src/pages/preview.astro` — add section `<section id="car-selector-c">`

On select, a brand-colored "glow puddle" fades in under the car. Uses the `<ellipse class="car-shadow">` element built in Task 3.1.

**CSS:**
```css
@keyframes glow-in {
  from { fill: rgb(30 95 255 / 0); filter: blur(2px); }
  to   { fill: rgb(30 95 255 / 0.28); filter: blur(4px); }
}
[data-state=on] .car-shadow {
  animation: glow-in 300ms var(--ease-out) forwards;
}
[data-state=off] .car-shadow {
  animation: glow-out 200ms var(--ease-in) forwards;  /* reverse */
}
```

No JavaScript needed — pure CSS targeting Reka's `data-state` attribute.

---

## Task 3.5 — [CHECKPOINT] Owner Picks Variant

**Status:** [ ]

1. Run `npm run dev`
2. Open `localhost:4321/preview#car-selector-a` (or -b, -c)
3. Test on real mobile device if possible
4. Owner selects preferred variant
5. Update this file with choice and proceed to Task 3.6

**Chosen variant:** _______

---

## Task 3.6 — Implement in PricingEstimator.vue

**Status:** [ ]

**File:** `src/components/islands/PricingEstimator.vue`

Replace the `ToggleGroupRoot` pill with the card-style layout:

```html
<!-- Replace the existing pill ToggleGroupRoot block -->
<ToggleGroupRoot
  type="single"
  :model-value="selected"
  class="flex gap-3"
  aria-label="Vehicle size"
  @update:model-value="onValueChange"
>
  <ToggleGroupItem
    v-for="size in SIZES"
    :key="size.value"
    :value="size.value"
    :aria-label="size.label"
    class="flex flex-1 min-w-0 flex-col items-center gap-2 rounded-xl border border-border
           bg-bg-elevated p-3 cursor-pointer transition-colors
           hover:border-border-bright
           data-[state=on]:border-brand data-[state=on]:bg-brand-tint"
  >
    <!-- SVG car component or inline SVG -->
    <component :is="carSvgFor(size.value)" class="h-10 w-auto text-text-muted
      data-[state=on]:text-brand" />
    <span class="text-xs font-medium text-text-muted
      data-[state=on]:text-brand select-none">
      {{ size.short }}
    </span>
  </ToggleGroupItem>
</ToggleGroupRoot>
```

Implement the chosen animation variant inside this template.

**Note:** The `onValueChange`, `applyPrices`, `bookHref`, and ZIP gate logic remain completely untouched. Only the template above the estimate block changes.

---

## Task 3.7 — Mobile QA at 375px

**Status:** [ ]

- Open Chrome DevTools → iPhone SE (375px)
- Three cards must sit side-by-side without overflow
- Labels must be readable at `text-xs` (12px-ish)
- Car SVGs must be recognizable at 40px height
- Selected state glow visible on small screen
- If cards overflow: reduce `gap` from `gap-3` to `gap-2` or reduce padding

---

## Task 3.8 — Keyboard Navigation QA

**Status:** [ ]

- Tab to the vehicle selector (ToggleGroupRoot is a single focusable group)
- Arrow Left/Right: moves selection between Sedan/SUV/Truck
- Enter/Space: selects focused item
- Confirm `data-[state=on]` styles apply correctly on keyboard selection
- Screen reader: `aria-label` on each ToggleGroupItem announces vehicle type
