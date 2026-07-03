<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';
import { SIZES, PRICING, type Size } from '@/data/pricing';

/**
 * Vehicle-size segmented control. The pricing tier cards (static Astro) are the single
 * price display — this island syncs them in place via [data-price] / [data-vehicle] /
 * [data-cta] hooks, so prices are never rendered twice.
 */
const SESSION_KEY = 'elite-detail-size';
const selected = ref<Size>('sedan');

const selectedLabel = computed(() => SIZES.find((s) => s.value === selected.value)?.label ?? '');

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
    if (vehicleEl) vehicleEl.textContent = `/ ${sizeInfo.short}`;
    const ctaEl = document.querySelector<HTMLAnchorElement>(`[data-cta="${tierId}"]`);
    if (ctaEl && price !== null) ctaEl.href = `#book?package=${tierId}&size=${size}`;
  });
}
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <p id="size-label" class="text-sm font-medium text-text-muted">Your vehicle size:</p>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <ToggleGroupRoot
        type="single"
        :model-value="selected"
        class="inline-flex w-full max-w-md rounded-full border border-border bg-bg-elevated p-1 sm:w-auto"
        aria-labelledby="size-label"
        @update:model-value="onValueChange"
      >
        <ToggleGroupItem
          v-for="size in SIZES"
          :key="size.value"
          :value="size.value"
          :aria-label="size.label"
          class="seg-option group flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-sm font-medium whitespace-nowrap text-text-muted transition-[color,background-color,box-shadow] duration-200 ease-[--ease-standard] hover:text-text data-[state=on]:text-white sm:flex-none sm:gap-2 sm:px-5"
        >
          <!-- Vehicle icons — Tabler Icons (MIT), stroke-based -->
          <!-- SEDAN -->
          <svg
            v-if="size.value === 'sedan'"
            class="vehicle-icon h-5 w-5 shrink-0"
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
            <path
              d="M4 16.5h-1.25v-5.25l1.75 -4.5h9l3.8 4.5h1.2a1.8 1.8 0 0 1 1.8 1.8v3.45h-1.7m-3.6 0h-6.5m-4.45 -5.25h13.5"
            />
          </svg>
          <!-- SUV -->
          <svg
            v-else-if="size.value === 'suv'"
            class="vehicle-icon h-5 w-5 shrink-0"
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
            <path
              d="M3 16.5v-4.8a2 2 0 0 1 2 -2h1.2l1.6 -3h6.6a2.3 2.3 0 0 1 2.15 1.5l.7 1.9h2.15a2 2 0 0 1 2 2v4.4"
            />
            <path d="M9.5 9.7v-3" />
            <path d="M5.5 12h12.2" />
          </svg>
          <!-- TRUCK -->
          <svg
            v-else
            class="vehicle-icon h-5 w-5 shrink-0"
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
          <span>{{ size.short }}</span>
        </ToggleGroupItem>
      </ToggleGroupRoot>

      <!-- Announces the selection for screen readers; doubles as a subtle confirmation -->
      <p class="text-xs text-text-muted" aria-live="polite">
        {{ selectedLabel }} — card prices update instantly
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Selected segment — brand gradient + soft glow (design tokens, no arbitrary utilities). */
.seg-option[data-state='on'] {
  background-color: var(--color-brand-strong);
  background-image: linear-gradient(180deg, rgb(255 255 255 / 0.08), transparent 55%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.12),
    var(--shadow-glow-sm);
}

.seg-option[data-state='on'] .vehicle-icon {
  animation: vehicle-icon-pop 300ms cubic-bezier(0.18, 0.75, 0.28, 1);
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

@media (prefers-reduced-motion: reduce) {
  .seg-option[data-state='on'] .vehicle-icon {
    animation: none;
  }
}
</style>
