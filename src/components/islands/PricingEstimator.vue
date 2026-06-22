<script setup lang="ts">
/**
 * P4-T2 — Pricing size-selector → instant estimator.
 * Reka UI ToggleGroup for Sedan / Med SUV / Large Truck segmented control.
 * On selection: updates price text + vehicle label + CTA href on static pricing cards
 * via data-price / data-vehicle / data-cta DOM attributes.
 * Persists selection in sessionStorage across page navigation.
 */
import { ref, onMounted } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';

type Size = 'sedan' | 'suv' | 'truck';

const SIZES: { value: Size; label: string; short: string }[] = [
  { value: 'sedan', label: 'Sedan / Coupe', short: 'Sedan' },
  { value: 'suv', label: 'Med SUV / Crossover', short: 'Med SUV' },
  { value: 'truck', label: 'Large Truck / 3-Row', short: 'Truck' },
];

const PRICING: Record<string, Record<Size, number | null>> = {
  'standard-reset': { sedan: 125, suv: 150, truck: 175 },
  'elite-signature': { sedan: 225, suv: 260, truck: 300 },
  'ceramic-upgrade': { sedan: null, suv: null, truck: null },
};

const SESSION_KEY = 'elite-detail-size';
const selected = ref<Size>('sedan');

onMounted(() => {
  const saved = sessionStorage.getItem(SESSION_KEY) as Size | null;
  if (saved && SIZES.some(s => s.value === saved)) {
    selected.value = saved;
  }
  applyPrices(selected.value);
  // Remove the static fallback text now that the island is live
  document.getElementById('pricing-selector-fallback')?.remove();
});

function onValueChange(val: string | string[]) {
  if (!val || typeof val !== 'string') return;
  const size = val as Size;
  selected.value = size;
  sessionStorage.setItem(SESSION_KEY, size);
  applyPrices(size);
}

function applyPrices(size: Size) {
  const sizeInfo = SIZES.find(s => s.value === size);
  if (!sizeInfo) return;

  Object.entries(PRICING).forEach(([tierId, prices]) => {
    const price = prices[size];

    // Price number
    const priceEl = document.querySelector<HTMLElement>(`[data-price="${tierId}"]`);
    if (priceEl && price !== null) {
      priceEl.textContent = `$${price}`;
    }

    // Vehicle label (e.g. "· Sedan")
    const vehicleEl = document.querySelector<HTMLElement>(`[data-vehicle="${tierId}"]`);
    if (vehicleEl) {
      vehicleEl.textContent = `· ${sizeInfo.short}`;
    }

    // CTA href (only on bookable tiers)
    const ctaEl = document.querySelector<HTMLAnchorElement>(`[data-cta="${tierId}"]`);
    if (ctaEl && price !== null) {
      ctaEl.href = `#book?package=${tierId}&size=${size}`;
    }
  });
}
</script>

<template>
  <div>
    <p class="mb-3 text-sm font-medium text-text">Select your vehicle size for exact pricing:</p>
    <ToggleGroupRoot
      type="single"
      :model-value="selected"
      @update:model-value="onValueChange"
      class="inline-flex gap-1 rounded-full border border-border bg-bg-elevated p-1"
      aria-label="Vehicle size"
    >
      <ToggleGroupItem
        v-for="size in SIZES"
        :key="size.value"
        :value="size.value"
        :aria-label="size.label"
        class="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-text-muted transition-colors data-[state=on]:bg-brand data-[state=on]:text-white hover:text-text"
      >
        {{ size.short }}
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
</template>
