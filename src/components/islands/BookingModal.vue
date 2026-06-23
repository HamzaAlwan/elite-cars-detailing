<script setup lang="ts">
/**
 * Phase 4 — Cal.com booking modal (+ loading-flash fix).
 * Mounted once (client:idle in Layout). Opens from ANY `a[href^="#book"]` CTA via a global click
 * interceptor that dispatches a `booking:open` event with {package, size} parsed from the href.
 *
 * Chrome = Reka Dialog (brand-matched dark panel, scrim, focus-trap, Esc/overlay close).
 * Calendar = Cal.com OFFICIAL embed (embed.js via the CDN snippet, see src/lib/cal.ts), rendered
 * INLINE into a container in the dialog. embed.js sizes the iframe and reveals it only on its
 * `linkReady` event, so the calendar fades in already-centered (no load-then-recenter flash).
 *
 * Lazy: embed.js loads on first open; Reka unmounts content on close so each open renders fresh.
 * Back-button: pushes a history entry on open so mobile/desktop back closes the modal.
 */
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from 'reka-ui';
import { CAL_LINK } from '@/data/site';
import { SIZES, TIERS } from '@/data/pricing';
import { getCalApi } from '@/lib/cal';

const open = ref(false);
const loaded = ref(false);
const prefill = ref<{ package?: string; size?: string }>({});
const containerRef = ref<HTMLElement | null>(null);

let handlersBound = false;
let fallbackTimer: number | undefined;

function labelForSize(v?: string) {
  return v ? (SIZES.find((s) => s.value === v)?.label ?? v) : '';
}
function labelForPackage(id?: string) {
  return id ? (TIERS.find((t) => t.id === id)?.name ?? id) : '';
}
function buildNotes(): string {
  const parts: string[] = [];
  if (prefill.value.package) parts.push(`Package: ${labelForPackage(prefill.value.package)}`);
  if (prefill.value.size) parts.push(`Vehicle: ${labelForSize(prefill.value.size)}`);
  return parts.join(' · ');
}

/* ---- Cal embed ---- */
function setupCal() {
  const Cal = getCalApi();
  if (!handlersBound) {
    Cal('init', { origin: 'https://cal.com' });
    Cal('ui', {
      theme: 'dark',
      layout: 'month_view',
      hideEventTypeDetails: false,
      // Best-effort brand match for the calendar interior (site sapphire). The main accent may also
      // need to be set in the Cal dashboard (Event Type → Advanced → Brand color) — calcom #16732.
      cssVarsPerTheme: {
        dark: { 'cal-brand': '#1e5fff' },
        light: { 'cal-brand': '#1e5fff' },
      },
    });
    // Reveal the calendar only once Cal has laid it out (fixes the load-then-recenter flash).
    Cal('on', { action: 'linkReady', callback: () => (loaded.value = true) });
    Cal('on', { action: 'bookingSuccessful', callback: () => (open.value = false) });
    Cal('on', { action: 'bookingSuccessfulV2', callback: () => (open.value = false) });
    handlersBound = true;
  }
  return Cal;
}

function renderCal() {
  const Cal = setupCal();
  const el = containerRef.value;
  if (!el) return;
  el.innerHTML = '';
  const config: Record<string, string> = { layout: 'month_view', theme: 'dark' };
  const notes = buildNotes();
  if (notes) config.notes = notes;
  Cal('inline', { elementOrSelector: el, calLink: CAL_LINK, config });
  // Safety: never strand the user on the skeleton if linkReady never fires (CDN blocked, etc.).
  window.clearTimeout(fallbackTimer);
  fallbackTimer = window.setTimeout(() => (loaded.value = true), 6000);
}

/* ---- open / close plumbing ---- */
function openModal(detail: { package?: string; size?: string }) {
  prefill.value = { package: detail.package, size: detail.size };
  loaded.value = false;
  open.value = true;
}

function onBookingOpen(e: Event) {
  openModal((e as CustomEvent).detail ?? {});
}

/* Render the calendar once the dialog (and its container) is in the DOM; tidy up on close. */
watch(open, async (now) => {
  if (now) {
    await nextTick();
    renderCal();
  } else {
    window.clearTimeout(fallbackTimer);
  }
});

/* ---- history (back button closes modal) ---- */
let suppressPop = false;
watch(
  open,
  (now, prev) => {
    if (now && !prev) {
      history.pushState({ calModal: true }, '');
    } else if (!now && prev && !suppressPop) {
      if (history.state?.calModal) history.back();
    }
  },
  { flush: 'sync' },
);

function onPopState() {
  if (open.value) {
    suppressPop = true;
    open.value = false;
    suppressPop = false;
  }
}

onMounted(() => {
  window.addEventListener('booking:open', onBookingOpen);
  window.addEventListener('popstate', onPopState);
  // Pending handoff: a Book CTA may have been clicked (by the global interceptor in Layout) before
  // this island hydrated. Consume it once so that click still opens the modal.
  const pending = (window as unknown as { __pendingBooking?: { package?: string; size?: string } })
    .__pendingBooking;
  if (pending) {
    (window as unknown as { __pendingBooking?: unknown }).__pendingBooking = undefined;
    openModal(pending);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('booking:open', onBookingOpen);
  window.removeEventListener('popstate', onPopState);
  window.clearTimeout(fallbackTimer);
});
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm" />
      <DialogContent
        class="dialog-content surface-raised fixed left-1/2 top-1/2 z-[1000] flex max-h-[90dvh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl focus:outline-none"
        aria-describedby="booking-modal-desc"
      >
        <header class="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <DialogTitle class="text-base font-semibold text-text">Book your detail</DialogTitle>
            <DialogDescription id="booking-modal-desc" class="mt-0.5 text-xs text-text-muted">
              Pick a day &amp; time — no card required up front.
            </DialogDescription>
          </div>
          <DialogClose
            class="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-border-bright hover:text-text"
            aria-label="Close booking dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </DialogClose>
        </header>

        <div class="relative flex-1 overflow-y-auto bg-bg">
          <!-- Brand skeleton — stays until Cal fires linkReady, then crossfades out. -->
          <div
            v-if="!loaded"
            class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bg text-text-muted"
            aria-hidden="true"
          >
            <svg class="animate-spin text-brand" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
            </svg>
            <p class="text-sm">Loading the scheduler…</p>
          </div>

          <!-- Cal renders its iframe here; fades in once laid out (no recenter flash). -->
          <div
            ref="containerRef"
            class="min-h-[60dvh] w-full transition-opacity duration-[--dur-base] ease-[--ease-standard]"
            :class="loaded ? 'opacity-100' : 'opacity-0'"
          ></div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
