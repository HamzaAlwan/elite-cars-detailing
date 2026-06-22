<script setup lang="ts">
/**
 * P4-T1 — Mobile nav slide-over island (client:idle).
 * Reka UI DialogRoot → DialogContent gives focus trap + Esc-to-close + scroll-lock for free.
 * Styled as a full-height sheet sliding from the right.
 * On mount: hides the static hamburger fallback (#nav-hamburger-static, #mobile-nav).
 * The hamburger trigger is rendered by this island; it replaces the static button.
 */
import { ref, onMounted } from 'vue';
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
} from 'reka-ui';

const isOpen = ref(false);

const links = [
  { href: '#value', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#work', label: 'Our Work' },
  { href: '#service-area', label: 'Service Area' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
];

function close() {
  isOpen.value = false;
}

onMounted(() => {
  // Hide the static fallback hamburger and panel — this island takes over
  document.getElementById('nav-hamburger-static')?.remove();
  document.getElementById('mobile-nav')?.remove();
});
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <!-- Hamburger trigger -->
    <DialogTrigger as-child>
      <button
        :aria-expanded="isOpen"
        aria-controls="mobile-nav-dialog"
        aria-label="Navigation menu"
        class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-border-bright"
      >
        <svg
          class="menu-icon"
          :data-open="isOpen"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <line data-bar="top" x1="4" y1="7" x2="20" y2="7" />
          <line data-bar="middle" x1="4" y1="12" x2="20" y2="12" />
          <line data-bar="bottom" x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
    </DialogTrigger>

    <DialogPortal>
      <!-- Scrim overlay -->
      <DialogOverlay
        class="fixed inset-0 z-40 bg-black/50"
        style="-webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);"
        @click="close"
      />

      <!-- Slide-over panel -->
      <DialogContent
        id="mobile-nav-dialog"
        class="fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-bg-elevated shadow-2xl outline-none"
        :style="{
          animation: isOpen
            ? 'slideInRight var(--dur-slow) var(--ease-out) forwards'
            : 'slideOutRight var(--dur-base) var(--ease-in) forwards',
        }"
      >
        <!-- Visually hidden title for screen readers -->
        <DialogTitle class="sr-only">Navigation menu</DialogTitle>

        <!-- Header row -->
        <div class="flex h-16 items-center justify-between border-b border-border px-5">
          <span class="text-sm font-semibold text-text">Menu</span>
          <DialogClose as-child>
            <button
              aria-label="Close navigation"
              class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg hover:text-text"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </DialogClose>
        </div>

        <!-- Nav links -->
        <nav aria-label="Mobile navigation" class="flex flex-col gap-1 p-4">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="rounded-lg px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text"
            @click="close"
          >
            {{ link.label }}
          </a>
        </nav>

        <!-- Book CTA at the bottom -->
        <div class="mt-auto border-t border-border p-4">
          <a
            href="#book"
            class="btn-metal flex h-11 cursor-pointer items-center justify-center rounded-full text-sm font-medium"
            @click="close"
          >
            Book Your Detail
          </a>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
@keyframes slideOutRight {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}
</style>
