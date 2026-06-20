/**
 * Scroll-reveal: adds `.is-visible` to `[data-reveal]` elements as they enter the viewport,
 * with a small stagger among siblings (60–80ms, capped). transform/opacity only → CLS-safe.
 * Honors prefers-reduced-motion (shows everything immediately). Pairs with the `[data-reveal]`
 * rules in global.css. CSS scroll-driven timelines are Safari-26-only, so IO is the baseline.
 */
export function initReveal(root: ParentNode = document): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (els.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const index = Number(el.dataset.revealIndex ?? '0');
        el.style.transitionDelay = `${Math.min(index, 11) * 70}ms`;
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  els.forEach((el) => observer.observe(el));
}
