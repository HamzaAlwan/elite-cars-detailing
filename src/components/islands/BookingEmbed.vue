<script setup lang="ts">
/**
 * P6-T2 — Cal.com lazy embed island (client:visible).
 * Load-on-click facade: shows a "Schedule online" button; only loads Cal.com's heavy
 * embed.js when the user clicks — avoids LCP penalty and iOS auto-scroll-on-load (§2.5).
 *
 * OWNER ACTION: Replace CAL_LINK with your real Cal.com booking link once the account
 * is created and the "Mobile Detail" event type is configured (P6-T1).
 * Example: "elitemobiledetailing/mobile-detail"
 */
import { ref } from 'vue';

// Replace with real Cal.com username/event-type slug after P6-T1 setup
const CAL_LINK = '{{CAL_LINK}}'; // e.g. 'elitemobiledetailing/mobile-detail'
const isReady = CAL_LINK !== '{{CAL_LINK}}';

const loaded = ref(false);

async function loadCal() {
  if (loaded.value) return;
  loaded.value = true;

  // Dynamically load Cal.com embed snippet
  const { getCalApi } = await import('@calcom/embed-snippet');
  const cal = await getCalApi({
    namespace: 'mobile-detail',
  });
  cal('ui', {
    theme: 'dark',
    styles: { branding: { brandColor: '#1E5FFF' } },
    hideEventTypeDetails: false,
  });
  cal('preload', { calLink: CAL_LINK });
}
</script>

<template>
  <div>
    <!-- Shown when Cal.com is configured (post P6-T1) -->
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

      <!-- Cal.com embed renders here after click -->
      <div
        v-if="loaded"
        :data-cal-link="CAL_LINK"
        data-cal-namespace="mobile-detail"
        data-cal-config='{"layout":"month_view"}'
        class="mt-4 overflow-hidden rounded-2xl border border-border"
        style="min-height: 600px;"
      ></div>
    </div>

    <!-- Placeholder shown until owner configures Cal.com (P6-T1) -->
    <div v-else class="rounded-2xl border border-dashed border-border bg-bg-elevated p-10 text-center">
      <p class="font-medium text-text">Online booking coming soon</p>
      <p class="mt-2 text-sm text-text-muted">
        Cal.com scheduler will appear here once configured. In the meantime, use the quote form below or give us a call.
      </p>
    </div>
  </div>
</template>
