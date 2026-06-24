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
  if (!isZipFormat(v)) {
    zipState.value = 'invalid';
    return;
  }
  zipState.value = isCoveredZip(v) ? 'in' : 'out';
}
function onZipKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') checkZip();
}

const bookHref = computed((): string => `#book?size=${selected.value}`);

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
    <p class="mb-3 text-sm font-medium text-text-muted">
      Select your vehicle size for exact pricing:
    </p>

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
        class="vehicle-option group relative flex min-h-[112px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-bg-elevated p-4 transition-[transform,border-color,background-color,box-shadow] duration-200 ease-[--ease-standard] hover:border-border-bright data-[state=on]:-translate-y-0.5 data-[state=on]:border-brand data-[state=on]:bg-[linear-gradient(180deg,rgba(30,95,255,0.16),rgba(30,95,255,0.08))] data-[state=on]:shadow-[0_0_0_1px_var(--color-brand),0_0_28px_rgb(30_95_255/0.24)]"
      >
        <div
          class="vehicle-icon-wrap inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-bg text-text-muted transition-[border-color,background-color,color,box-shadow] duration-200 ease-[--ease-standard] group-data-[state=on]:border-brand/60 group-data-[state=on]:bg-brand-tint group-data-[state=on]:text-brand group-data-[state=on]:shadow-[0_0_0_1px_rgb(30_95_255/0.35)]"
        >
        <!-- Vehicle icon — Tabler Icons (MIT), stroke-based, color tracks selection via group -->
        <!-- SEDAN -->
        <svg
          v-if="size.value === 'sedan'"
          class="vehicle-icon h-[2.625rem] w-[2.625rem] transition-colors duration-150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 16.5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M16 16.5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M4 16.5h-1.25v-5.25l1.75 -4.5h9l3.8 4.5h1.2a1.8 1.8 0 0 1 1.8 1.8v3.45h-1.7m-3.6 0h-6.5m-4.45 -5.25h13.5" />
        </svg>
        <!-- SUV -->
        <svg
          v-else-if="size.value === 'suv'"
          class="vehicle-icon h-[2.625rem] w-[2.625rem] transition-colors duration-150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 16.5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M16 16.5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M3 16.5v-4.8a2 2 0 0 1 2 -2h1.2l1.6 -3h6.6a2.3 2.3 0 0 1 2.15 1.5l.7 1.9h2.15a2 2 0 0 1 2 2v4.4" />
          <path d="M9.5 9.7v-3" />
          <path d="M5.5 12h12.2" />
        </svg>
        <!-- TRUCK -->
        <svg
          v-else
          class="vehicle-icon h-[2.625rem] w-[2.625rem] transition-colors duration-150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 16.5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M15.5 16.5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M3 16.5v-9.8a1 1 0 0 1 1 -1h8.5v10.8m-4 0h7.2m3.3 0h2v-5.8h-8v-5h4.3l3.7 5.1" />
        </svg>
        </div>

        <span class="text-sm leading-none font-semibold text-text">{{ size.short }}</span>
        <span class="hidden text-center text-[11px] leading-tight text-text-muted sm:block">{{
          size.label
        }}</span>
      </ToggleGroupItem>
    </ToggleGroupRoot>

    <!-- Instant estimate — 3-column grid -->
    <p class="mt-5 text-xs font-medium tracking-widest text-text-muted uppercase">
      Your estimate · {{ sizeShort }}
    </p>
    <div
      class="mt-2 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-bg-elevated"
    >
      <div
        v-for="line in estimate"
        :key="line.name"
        class="flex flex-col items-center gap-1 px-3 py-4 sm:px-4"
      >
        <span class="text-[11px] tracking-widest text-text-muted uppercase">{{ line.name }}</span>
        <span class="text-xl leading-none font-bold text-text tabular-nums">{{ line.label }}</span>
      </div>
    </div>
    <p class="mt-2 text-xs text-text-muted">
      Add-ons:
      <span v-for="(a, i) in ADDONS" :key="a.name">
        <span class="text-text">{{ a.name }} (${{ a.price }})</span
        ><span v-if="i < ADDONS.length - 1"> · </span>
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
        <button
          type="button"
          class="btn-metal min-h-11 cursor-pointer rounded-xl px-5 font-medium"
          @click="checkZip"
        >
          Check
        </button>
      </div>

      <p
        v-if="zipState === 'invalid'"
        id="est-zip-err"
        role="alert"
        class="mt-2 text-sm text-warning"
      >
        Please enter a valid 5-digit ZIP code.
      </p>

      <output v-else-if="zipState === 'in'" class="mt-3 flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-1.5 text-sm font-medium text-success">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          You're in our service zone!
        </span>
        <a
          :href="bookHref"
          class="btn-metal inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-medium"
        >
          Book this detail
        </a>
      </output>

      <output v-else-if="zipState === 'out'" class="mt-3 block text-sm text-text-muted">
        We're not in <strong class="text-text">{{ zip }}</strong> yet, but we're expanding fast
        across DFW —
        <a href="#quote" class="text-brand underline-offset-4 hover:underline">request a quote</a>
        and we'll reach out.
      </output>
    </div>

  </div>
</template>

<style scoped>
.vehicle-option[data-state='on'] .vehicle-icon {
  animation: vehicle-icon-pop 300ms cubic-bezier(0.18, 0.75, 0.28, 1);
}

.vehicle-option[data-state='on'] .vehicle-icon-wrap {
  animation: vehicle-glow-pop 320ms cubic-bezier(0.18, 0.75, 0.28, 1);
}

@keyframes vehicle-icon-pop {
  0% {
    transform: scale(0.82) translateY(1px);
    opacity: 0.8;
  }
  60% {
    transform: scale(1.1) translateY(-1px);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes vehicle-glow-pop {
  0% {
    box-shadow: 0 0 0 0 rgb(30 95 255 / 0);
  }
  70% {
    box-shadow: 0 0 0 6px rgb(30 95 255 / 0.16);
  }
  100% {
    box-shadow: 0 0 0 1px rgb(30 95 255 / 0.35);
  }
}
</style>
