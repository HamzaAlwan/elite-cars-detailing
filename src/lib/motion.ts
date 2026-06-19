/**
 * Motion One helpers for in-island reveals (wired into Vue islands in Phase 4, P4-T5).
 * Thin re-export so islands import from one place and always honor reduced-motion.
 * transform/opacity only; counts toward the JS budget (~5KB).
 */
import { animate, inView } from 'motion';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { animate, inView };
