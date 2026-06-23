<script setup lang="ts">
/**
 * P4-T2 + Phase 2 — Pricing size-selector → instant estimator.
 * Reka UI ToggleGroup for Sedan / Med SUV / Large Truck.
 * On selection:
 *   - rewrites price text + vehicle label + CTA href on the static pricing cards
 *     (via data-price / data-vehicle / data-cta DOM attributes), AND
 *   - updates an inline "your estimate" block showing all tiers for the chosen size.
 * Optional ZIP gate (reuses shared coverage check) confirms service area and surfaces a
 * prefilled Book CTA. Pricing is always visible — the gate only gates the convenience CTA.
 * Persists size selection in sessionStorage so the booking modal can read it.
 */
import { ref, computed, onMounted } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';
import { SIZES, PRICING, TIERS, ADDONS, type Size } from '@/data/pricing';
import { isCoveredZip, isZipFormat } from '@/lib/validation';

const SESSION_KEY = 'elite-detail-size';
const selected = ref<Size>('sedan');

const sizeShort = computed(() => SIZES.find((s) => s.value === selected.value)?.short ?? '');

/** One line per tier for the estimate block, resolved for the selected size. */
const estimate = computed(() =>
  TIERS.map((t) => {
    const price = PRICING[t.id]?.[selected.value];
    if (price != null) return { name: t.name, label: `$${price}` };
    if (t.from != null) return { name: t.name, label: `from $${t.from}` };
    return { name: t.name, label: '—' };
  }),
);

/* ---- ZIP gate ---- */
type ZipState = 'idle' | 'in' | 'out' | 'invalid';
const zip = ref('');
const zipState = ref<ZipState>('idle');

function checkZip() {
  const v = zip.value.trim();
  if (!isZipFormat(v)) {
    zipState.value = 'invalid';
    return;
  }
  zipState.value = isCoveredZip(v) ? 'in' : 'out';
}

function onZipKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') checkZip();
}

/** Book CTA href carries the size; Phase 4's global interceptor upgrades it to open the modal. */
const bookHref = computed(() => `#book?size=${selected.value}`);

onMounted(() => {
  const saved = sessionStorage.getItem(SESSION_KEY) as Size | null;
  if (saved && SIZES.some((s) => s.value === saved)) {
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
  const sizeInfo = SIZES.find((s) => s.value === size);
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
      class="inline-flex gap-1 rounded-full border border-border bg-bg-elevated p-1"
      aria-label="Vehicle size"
      @update:model-value="onValueChange"
    >
      <ToggleGroupItem
        v-for="size in SIZES"
        :key="size.value"
        :value="size.value"
        :aria-label="size.label"
        class="min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text data-[state=on]:bg-brand data-[state=on]:text-white"
      >
        {{ size.short }}
      </ToggleGroupItem>
    </ToggleGroupRoot>

    <!-- Instant estimate output -->
    <div class="surface-raised mt-4 p-4">
      <p class="text-xs font-medium uppercase tracking-widest text-text-muted">
        Your estimate · {{ sizeShort }}
      </p>
      <dl class="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <div v-for="line in estimate" :key="line.name" class="flex items-baseline gap-1.5">
          <dt class="text-sm text-text-muted">{{ line.name }}</dt>
          <dd class="text-base font-semibold tabular-nums text-text">{{ line.label }}</dd>
        </div>
      </dl>
      <p class="mt-3 text-xs text-text-muted">
        Add-ons:
        <span v-for="(a, i) in ADDONS" :key="a.name">
          <span class="text-text">{{ a.name }} (${{ a.price }})</span><span v-if="i < ADDONS.length - 1"> · </span>
        </span>
      </p>
    </div>

    <!-- Optional ZIP gate -->
    <div class="mt-4">
      <label for="est-zip" class="mb-1.5 block text-sm font-medium text-text">
        Confirm we serve your area
        <span class="ml-1 text-xs font-normal text-text-muted">(optional)</span>
      </label>
      <div class="flex max-w-xs gap-2">
        <input
          id="est-zip"
          v-model="zip"
          type="text"
          inputmode="numeric"
          pattern="[0-9]{5}"
          maxlength="5"
          autocomplete="postal-code"
          placeholder="ZIP code"
          :aria-invalid="zipState === 'invalid'"
          :aria-describedby="zipState === 'invalid' ? 'est-zip-err' : undefined"
          class="min-h-11 flex-1 rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
          @keydown="onZipKeydown"
        />
        <button type="button" class="btn-metal min-h-11 cursor-pointer rounded-xl px-5 font-medium" @click="checkZip">
          Check
        </button>
      </div>

      <p v-if="zipState === 'invalid'" id="est-zip-err" role="alert" class="mt-2 text-sm text-warning">
        Please enter a valid 5-digit ZIP code.
      </p>

      <div v-else-if="zipState === 'in'" role="status" class="mt-3 flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-1.5 text-sm font-medium text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          You're in our service zone!
        </span>
        <a :href="bookHref" class="btn-metal inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-medium">
          Book this detail
        </a>
      </div>

      <p v-else-if="zipState === 'out'" role="status" class="mt-3 text-sm text-text-muted">
        We're not in <strong class="text-text">{{ zip }}</strong> yet, but we're expanding fast across DFW —
        <a href="#quote" class="text-brand underline-offset-4 hover:underline">request a quote</a> and we'll reach out.
      </p>
    </div>
  </div>
</template>
