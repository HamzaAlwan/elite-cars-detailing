<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';
import { SIZES, PRICING, TIERS, ADDONS, type Size } from '@/data/pricing';
import { isCoveredZip, isZipFormat } from '@/lib/validation';

const SESSION_KEY = 'elite-detail-size';
const selected = ref<Size>('sedan');

const sizeShort = computed(() => SIZES.find((s) => s.value === selected.value)?.short ?? '');

const estimate = computed(() =>
  TIERS.map((t) => {
    const price = PRICING[t.id]?.[selected.value];
    if (price != null) return { name: t.name, label: `$${price}` };
    if (t.from != null) return { name: t.name, label: `from $${t.from}` };
    return { name: t.name, label: '—' };
  }),
);

/* ── ZIP gate ────────────────────────────────────────────── */
type ZipState = 'idle' | 'in' | 'out' | 'invalid';
const zip = ref('');
const zipState = ref<ZipState>('idle');

function checkZip() {
  const v = zip.value.trim();
  if (!isZipFormat(v)) { zipState.value = 'invalid'; return; }
  zipState.value = isCoveredZip(v) ? 'in' : 'out';
}
function onZipKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') checkZip();
}

const bookHref = computed(() => `#book?size=${selected.value}`);

onMounted(() => {
  const saved = sessionStorage.getItem(SESSION_KEY) as Size | null;
  if (saved && SIZES.some((s) => s.value === saved)) selected.value = saved;
  applyPrices(selected.value);
  document.getElementById('pricing-selector-fallback')?.remove();
});

function onValueChange(val: string | string[]) {
  if (!val || typeof val !== 'string') return;
  selected.value = val as Size;
  sessionStorage.setItem(SESSION_KEY, val);
  applyPrices(val as Size);
}

function applyPrices(size: Size) {
  const sizeInfo = SIZES.find((s) => s.value === size);
  if (!sizeInfo) return;
  Object.entries(PRICING).forEach(([tierId, prices]) => {
    const price = prices[size];
    const priceEl = document.querySelector<HTMLElement>(`[data-price="${tierId}"]`);
    if (priceEl && price !== null) priceEl.textContent = `$${price}`;
    const vehicleEl = document.querySelector<HTMLElement>(`[data-vehicle="${tierId}"]`);
    if (vehicleEl) vehicleEl.textContent = `· ${sizeInfo.short}`;
    const ctaEl = document.querySelector<HTMLAnchorElement>(`[data-cta="${tierId}"]`);
    if (ctaEl && price !== null) ctaEl.href = `#book?package=${tierId}&size=${size}`;
  });
}
</script>

<template>
  <div>
    <p class="mb-3 text-sm font-medium text-text-muted">Select your vehicle size for exact pricing:</p>

    <!-- Vehicle selector cards -->
    <ToggleGroupRoot
      type="single"
      :model-value="selected"
      class="flex gap-2 sm:gap-3"
      aria-label="Vehicle size"
      @update:model-value="onValueChange"
    >
      <ToggleGroupItem
        v-for="size in SIZES"
        :key="size.value"
        :value="size.value"
        :aria-label="size.label"
        class="group flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-border
               bg-bg-elevated cursor-pointer min-h-[108px] transition-all duration-150
               hover:border-border-bright
               data-[state=on]:border-brand data-[state=on]:bg-brand-tint
               data-[state=on]:scale-[1.01]
               data-[state=on]:shadow-[0_0_0_1px_var(--color-brand),0_0_24px_rgb(30_95_255/0.15)]"
      >
        <!-- Vehicle icon — Tabler Icons (MIT), stroke-based, color tracks selection via group -->
        <!-- SEDAN -->
        <svg
          v-if="size.value === 'sedan'"
          class="h-11 w-11 text-text-muted transition-colors duration-150 group-data-[state=on]:text-brand"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
        </svg>
        <!-- SUV -->
        <svg
          v-else-if="size.value === 'suv'"
          class="h-11 w-11 text-text-muted transition-colors duration-150 group-data-[state=on]:text-brand"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M16 17a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M5 9l2 -4h7.438a2 2 0 0 1 1.94 1.515l.622 2.485h3a2 2 0 0 1 2 2v3" />
          <path d="M10 9v-4" />
          <path d="M2 7v4" />
          <path d="M22.001 14.001a4.992 4.992 0 0 0 -4.001 -2.001a4.992 4.992 0 0 0 -4 2h-3a4.998 4.998 0 0 0 -8.003 .003" />
          <path d="M5 12v-3h13" />
        </svg>
        <!-- TRUCK -->
        <svg
          v-else
          class="h-11 w-11 text-text-muted transition-colors duration-150 group-data-[state=on]:text-brand"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
        </svg>

        <span class="text-sm font-semibold text-text leading-none">{{ size.short }}</span>
        <span class="hidden sm:block text-[11px] text-text-muted leading-tight text-center">{{ size.label }}</span>
      </ToggleGroupItem>
    </ToggleGroupRoot>

    <!-- Instant estimate — 3-column grid -->
    <p class="mt-5 text-xs font-medium uppercase tracking-widest text-text-muted">
      Your estimate · {{ sizeShort }}
    </p>
    <div class="mt-2 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-bg-elevated">
      <div
        v-for="line in estimate"
        :key="line.name"
        class="flex flex-col items-center gap-1 px-3 py-4 sm:px-4"
      >
        <span class="text-[11px] uppercase tracking-widest text-text-muted">{{ line.name }}</span>
        <span class="text-xl font-bold tabular-nums text-text leading-none">{{ line.label }}</span>
      </div>
    </div>
    <p class="mt-2 text-xs text-text-muted">
      Add-ons:
      <span v-for="(a, i) in ADDONS" :key="a.name">
        <span class="text-text">{{ a.name }} (${{ a.price }})</span><span v-if="i < ADDONS.length - 1"> · </span>
      </span>
    </p>

    <!-- ZIP gate -->
    <div class="mt-5">
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

      <output v-else-if="zipState === 'in'" class="mt-3 flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-1.5 text-sm font-medium text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          You're in our service zone!
        </span>
        <a :href="bookHref" class="btn-metal inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-medium">
          Book this detail
        </a>
      </output>

      <output v-else-if="zipState === 'out'" class="mt-3 block text-sm text-text-muted">
        We're not in <strong class="text-text">{{ zip }}</strong> yet, but we're expanding fast across DFW —
        <a href="#quote" class="text-brand underline-offset-4 hover:underline">request a quote</a> and we'll reach out.
      </output>
    </div>
  </div>
</template>
