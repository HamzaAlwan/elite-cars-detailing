<script setup lang="ts">
/**
 * Mobile nav — custom slide-over drawer (no Reka).
 * Mobile-first: touch-safe scroll lock, focus trap, animated open/close, single source of truth.
 */
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { CTA } from '@/data/site';
import { NAV_LINKS } from '@/lib/nav-scroll-spy';

const DRAWER_ID = 'mobile-nav-drawer';
const DESKTOP_MQ = '(min-width: 1024px)';
const SCROLL_INDICATOR_THRESHOLD_PX = 8;

const links = NAV_LINKS;

const isOpen = ref(false);
/** Gate Teleport until client mount — avoids SSR/hydration mismatch with Astro islands. */
const isMounted = ref(false);
const isNavScrollIndicatorVisible = ref(false);
const triggerRef = ref<HTMLButtonElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);
const navScrollRef = ref<HTMLElement | null>(null);
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

function updateNavScrollIndicator(): void {
  const nav = navScrollRef.value;
  if (!nav) {
    isNavScrollIndicatorVisible.value = false;
    return;
  }

  const remainingScroll = nav.scrollHeight - nav.clientHeight - nav.scrollTop;
  isNavScrollIndicatorVisible.value = remainingScroll > SCROLL_INDICATOR_THRESHOLD_PX;
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
    updateNavScrollIndicator();
    closeRef.value?.focus();
  } else {
    isNavScrollIndicatorVisible.value = false;
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
  globalThis.addEventListener('resize', updateNavScrollIndicator);
  desktopMq = globalThis.matchMedia(DESKTOP_MQ);
  desktopMq.addEventListener('change', onBreakpointChange);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener('booking:open', onBookingOpen);
  globalThis.removeEventListener('resize', updateNavScrollIndicator);
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
      class="mobile-nav-trigger inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-bg-elevated/80 text-text transition-[transform,box-shadow,border-color] duration-[--dur-fast] ease-[--ease-standard] hover:border-border-bright active:scale-95"
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
          class="mobile-nav-drawer surface-raised fixed inset-y-0 right-0 z-[90] m-0 flex h-svh w-[min(22rem,calc(100vw-1rem))] flex-col border-l border-border p-0 shadow-2xl outline-none"
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

          <div class="relative min-h-0 flex-1">
            <nav
              ref="navScrollRef"
              aria-label="Mobile navigation"
              class="flex h-full flex-col gap-2 overflow-y-auto overscroll-contain p-4 pb-12"
              style="-webkit-overflow-scrolling: touch"
              @scroll="updateNavScrollIndicator"
            >
              <a
                v-for="(link, index) in links"
                :key="link.href"
                :href="link.href"
                class="group flex min-h-[4.5rem] items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3.5 text-sm font-medium text-text-muted transition-[background-color,color,transform,border-color] duration-[--dur-fast] ease-[--ease-standard] hover:bg-bg hover:text-text active:scale-[0.99]"
                :style="{ transitionDelay: `${index * 30}ms` }"
                @click.prevent="closeAndNavigate(link.href)"
              >
                <span class="flex min-w-0 flex-col items-start gap-1">
                  <span class="leading-tight">{{ link.label }}</span>
                  <span class="text-xs leading-snug font-normal text-text-muted">{{
                    link.description
                  }}</span>
                </span>
                <svg
                  class="mt-0.5 size-4 text-text-muted opacity-70 transition-opacity duration-[--dur-fast] group-hover:opacity-100"
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

            <Transition name="mobile-nav-scroll-indicator">
              <div
                v-if="isNavScrollIndicatorVisible"
                class="mobile-nav-scroll-indicator pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3"
                aria-hidden="true"
              >
                <span
                  class="inline-flex size-8 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-text-muted shadow-lg backdrop-blur-sm"
                >
                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </Transition>
          </div>

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
/* Flush to viewport right edge — override .surface-raised uniform radius. */
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

.mobile-nav-scroll-indicator {
  background-image: linear-gradient(180deg, transparent, var(--color-bg-elevated) 68%);
}

.mobile-nav-scroll-indicator-enter-active,
.mobile-nav-scroll-indicator-leave-active {
  transition: opacity var(--dur-fast) var(--ease-out);
}

.mobile-nav-scroll-indicator-enter-from,
.mobile-nav-scroll-indicator-leave-to {
  opacity: 0;
}

.mobile-nav-scroll-indicator svg {
  animation: mobile-nav-scroll-cue 1.6s var(--ease-standard) infinite;
}

@keyframes mobile-nav-scroll-cue {
  0%,
  100% {
    transform: translateY(-1px);
    opacity: 0.55;
  }
  50% {
    transform: translateY(2px);
    opacity: 1;
  }
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
