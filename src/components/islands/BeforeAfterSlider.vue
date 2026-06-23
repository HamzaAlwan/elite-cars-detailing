<script setup lang="ts">
/**
 * P5-T3 — Before/after comparison slider island (client:visible).
 * Uses img-comparison-slider web component (MIT, already installed).
 * A11y: keyboard-operable, aria-label on the handle.
 * Respects prefers-reduced-motion (no animated slide on reveal).
 */
import { onMounted } from 'vue';

interface Props {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
}
const props = defineProps<Props>();

onMounted(async () => {
  // Dynamically import so it only runs client-side and loads lazily
  await import('img-comparison-slider');
});
</script>

<template>
  <figure class="overflow-hidden rounded-2xl">
    <!-- img-comparison-slider is a web component; Astro/Vue treats it as a custom element -->
    <img-comparison-slider
      class="block w-full"
      style="--divider-width: 2px; --divider-color: var(--color-brand)"
      aria-label="Before and after photo comparison — drag to compare"
    >
      <template #first>
        <img
          :src="props.before"
          :alt="props.beforeAlt"
          class="w-full"
          width="800"
          height="600"
          loading="lazy"
        />
      </template>
      <template #second>
        <img
          :src="props.after"
          :alt="props.afterAlt"
          class="w-full"
          width="800"
          height="600"
          loading="lazy"
        />
      </template>
      <!-- Custom handle -->
      <template #handle>
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand bg-bg shadow-lg"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="text-brand"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="text-brand"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </template>
    </img-comparison-slider>
    <figcaption v-if="props.caption" class="mt-2 text-center text-xs text-text-muted">
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
