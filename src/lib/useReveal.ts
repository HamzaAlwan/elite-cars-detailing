/**
 * P4-T5 — Motion One `inView` composable for Vue islands.
 * Thin wrapper so islands import from one place and always honor reduced-motion.
 * Usage: const { reveal } = useReveal(); reveal(el, { opacity: [0, 1] })
 */
import { onBeforeUnmount } from 'vue';
import { animate, inView } from 'motion';
import { prefersReducedMotion } from '@/lib/motion';

export function useReveal() {
  const cleanups: (() => void)[] = [];

  onBeforeUnmount(() => cleanups.forEach(fn => fn()));

  /**
   * Animate `el` into view once (fade + rise by default).
   * Respects prefers-reduced-motion — shows final state immediately if reduced.
   */
  function reveal(
    el: HTMLElement | null,
    keyframes: Parameters<typeof animate>[1] = { opacity: [0, 1], y: [16, 0] },
    options: { delay?: number; duration?: number } = {},
  ) {
    if (!el) return;
    if (prefersReducedMotion()) {
      // Skip animation — set final state immediately
      Object.assign(el.style, { opacity: '1', transform: 'none' });
      return;
    }
    const stop = inView(el, () => {
      animate(el, keyframes, {
        duration: options.duration ?? 0.35,
        delay: options.delay ?? 0,
      });
    });
    cleanups.push(stop);
  }

  return { reveal };
}
