<script setup lang="ts">
/**
 * Mobile nav — custom slide-over drawer (no Reka).
 * Mobile-first: touch-safe scroll lock, focus trap, animated open/close, single source of truth.
 */
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { CTA } from '@/data/site';

interface NavLink {
  href: string;
  label: string;
}

const DRAWER_ID = 'mobile-nav-drawer';
const DESKTOP_MQ = '(min-width: 1024px)';

const links: NavLink[] = [
  { href: '#value', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#work', label: 'Our Work' },
  { href: '#service-area', label: 'Service Area' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
];

const isOpen = ref(false);
/** Gate Teleport until client mount — avoids SSR/hydration mismatch with Astro islands. */
const isMounted = ref(false);
const triggerRef = ref<HTMLButtonElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);
const closeRef = ref<HTMLButtonElement | null>(null);

let savedScrollY = 0;
let previousFocus: HTMLElement | null = null;
let desktopMq: MediaQueryList | null = null;
let htmlOverflow = '';

function lockBodyScroll(): void {
  const body = document.body;
  const html = document.documentElement;
  savedScrollY = globalThis.scrollY || html.scrollTop;
  htmlOverflow = html.style.overflow;
  html.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
}

function unlockBodyScroll(): void {
  const body = document.body;
  const html = document.documentElement;
  // Read from body's negative top — exact value used when locking (avoids drift).
  const y = Math.abs(Number.parseInt(body.style.top, 10)) || savedScrollY;

  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  body.style.overflow = '';
  html.style.overflow = htmlOverflow;
  htmlOverflow = '';

  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  html.scrollTop = y;
  globalThis.scrollTo(0, y);
  html.style.scrollBehavior = previousScrollBehavior;
}

function focusWithoutScroll(el: HTMLElement | null | undefined): void {
  if (!el || !document.contains(el)) return;
  try {
    el.focus({ preventScroll: true });
  } catch {
    el.focus();
  }
}

const menuLabel = computed(() => (isOpen.value ? 'Close navigation menu' : 'Open navigation menu'));

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function getFocusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
  );
}

function openMenu(): void {
  if (isOpen.value) return;
  previousFocus = document.activeElement as HTMLElement | null;
  isOpen.value = true;
}

function closeMenu(): void {
  if (!isOpen.value) return;
  isOpen.value = false;
}

function toggleMenu(): void {
  if (isOpen.value) closeMenu();
  else openMenu();
}

async function closeAndNavigate(href: string): Promise<void> {
  closeMenu();
  await nextTick();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      globalThis.location.href = href;
    });
  });
}

function onBookingOpen(): void {
  closeMenu();
}

function trapFocus(event: KeyboardEvent): void {
  if (event.key !== 'Tab' || !drawerRef.value) return;
  const focusables = getFocusables(drawerRef.value);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (!isOpen.value) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
  }
}

function onBreakpointChange(event: MediaQueryListEvent): void {
  if (event.matches) closeMenu();
}

watch(isOpen, async (open) => {
  if (open) {
    lockBodyScroll();
    document.addEventListener('keydown', onKeydown);
    await nextTick();
    closeRef.value?.focus();
  } else {
    unlockBodyScroll();
    document.removeEventListener('keydown', onKeydown);
    await nextTick();
    const target =
      previousFocus && document.contains(previousFocus) ? previousFocus : triggerRef.value;
    focusWithoutScroll(target);
    previousFocus = null;
  }
});

onMounted(() => {
  isMounted.value = true;
  globalThis.addEventListener('booking:open', onBookingOpen);
  desktopMq = globalThis.matchMedia(DESKTOP_MQ);
  desktopMq.addEventListener('change', onBreakpointChange);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener('booking:open', onBookingOpen);
  desktopMq?.removeEventListener('change', onBreakpointChange);
  document.removeEventListener('keydown', onKeydown);
  if (isOpen.value) unlockBodyScroll();
});
</script>

<template>
  <div class="contents">
    <button
      ref="triggerRef"
      type="button"
      class="mobile-nav-trigger inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-bg-elevated/80 text-text transition-[transform,box-shadow,border-color] duration-[--dur-fast] ease-[--ease-standard] hover:border-border-bright active:scale-95"
      :aria-expanded="isOpen"
      :aria-controls="DRAWER_ID"
      :aria-label="menuLabel"
      @click="toggleMenu"
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

    <Teleport v-if="isMounted" to="body">
      <Transition name="mobile-nav-backdrop">
        <div
          v-if="isOpen"
          class="mobile-nav-backdrop fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
          @pointerdown.self="closeMenu"
          @click.self="closeMenu"
        />
      </Transition>

      <Transition name="mobile-nav-drawer">
        <aside
          v-if="isOpen"
          :id="DRAWER_ID"
          ref="drawerRef"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          class="mobile-nav-drawer surface-raised fixed inset-y-0 right-0 z-[90] flex h-svh w-[min(22rem,calc(100vw-1rem))] flex-col border-l border-border shadow-2xl outline-none"
          style="padding-bottom: max(1rem, env(safe-area-inset-bottom))"
          @keydown="trapFocus"
        >
          <header
            class="flex shrink-0 items-center justify-between border-b border-border px-5 py-4"
          >
            <p class="text-sm font-semibold tracking-tight text-text">Menu</p>
            <button
              ref="closeRef"
              type="button"
              class="mobile-nav-close inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-bg text-text-muted transition-[transform,color,border-color] duration-[--dur-fast] ease-[--ease-standard] hover:border-border-bright hover:text-text active:scale-95"
              aria-label="Close navigation menu"
              @click="closeMenu"
            >
              <svg
                class="mobile-nav-close-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <nav
            aria-label="Mobile navigation"
            class="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-4"
            style="-webkit-overflow-scrolling: touch"
          >
            <a
              v-for="(link, index) in links"
              :key="link.href"
              :href="link.href"
              class="group flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-[background-color,color,transform] duration-[--dur-fast] ease-[--ease-standard] hover:bg-bg hover:text-text active:scale-[0.99]"
              :style="{ transitionDelay: `${index * 30}ms` }"
              @click.prevent="closeAndNavigate(link.href)"
            >
              <span>{{ link.label }}</span>
              <svg
                class="size-4 text-text-muted opacity-0 transition-opacity duration-[--dur-fast] group-hover:opacity-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </nav>

          <footer class="shrink-0 border-t border-border p-4">
            <a
              href="#book"
              class="btn-metal flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium"
            >
              {{ CTA.book }}
            </a>
            <p class="mt-3 text-center text-xs text-text-muted">No card required upfront.</p>
          </footer>
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Flush to viewport right edge — override .surface-raised uniform radius */
.mobile-nav-drawer {
  border-radius: 1rem 0 0 1rem;
}

.mobile-nav-backdrop-enter-active,
.mobile-nav-backdrop-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}
.mobile-nav-backdrop-enter-from,
.mobile-nav-backdrop-leave-to {
  opacity: 0;
}

.mobile-nav-drawer-enter-active,
.mobile-nav-drawer-leave-active {
  transition:
    transform var(--dur-slow) var(--ease-emphasized),
    opacity var(--dur-base) var(--ease-out);
}
.mobile-nav-drawer-enter-from,
.mobile-nav-drawer-leave-to {
  transform: translateX(100%);
  opacity: 0.6;
}

@media (hover: hover) and (pointer: fine) {
  .mobile-nav-trigger:hover {
    box-shadow: 0 0 0 1px rgb(30 95 255 / 0.25);
  }
  .mobile-nav-close:hover .mobile-nav-close-icon {
    transform: rotate(90deg);
  }
}

.mobile-nav-close-icon {
  transition: transform var(--dur-fast) var(--ease-standard);
  transform-box: fill-box;
  transform-origin: center;
}
</style>
