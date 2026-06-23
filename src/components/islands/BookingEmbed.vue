<script setup lang="ts">
/**
 * P6-T2 — Cal.com lazy embed island (client:visible).
 * Load-on-click facade: iframe src is blank until the user clicks, so Cal.com's
 * heavy page only loads on demand. Uses the iframe embed URL (simpler and more
 * reliable than the JS embed API in Vite/Astro environments).
 */
import { ref } from 'vue';

const CAL_LINK = 'hamza-yffrki/mobile-detail';
const isReady = CAL_LINK !== '{{CAL_LINK}}';

const CAL_URL = `https://cal.com/${CAL_LINK}?embed=true&layout=month_view&theme=dark`;

const loaded = ref(false);

function loadCal() {
  loaded.value = true;
}
</script>

<template>
  <div>
    <!-- Shown when Cal.com is configured -->
    <div v-if="isReady">
      <button
        v-if="!loaded"
        class="btn-metal inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-3 text-base font-medium"
        @click="loadCal"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Schedule online — pick a day &amp; time
      </button>

      <!-- Cal.com iframe — only loads when user clicks the button above -->
      <iframe
        v-if="loaded"
        :src="CAL_URL"
        class="mt-4 w-full overflow-hidden rounded-2xl border border-border"
        style="min-height: 700px; border: 0; overscroll-behavior: contain;"
        loading="lazy"
        title="Book your mobile car detail"
      ></iframe>
    </div>

    <!-- Placeholder shown until CAL_LINK is configured -->
    <div v-else class="rounded-2xl border border-dashed border-border bg-bg-elevated p-10 text-center">
      <p class="font-medium text-text">Online booking coming soon</p>
      <p class="mt-2 text-sm text-text-muted">
        Cal.com scheduler will appear here once configured. In the meantime, use the quote form below or give us a call.
      </p>
    </div>
  </div>
</template>
