/**
 * Scroll-reveal: adds `.is-visible` to `[data-reveal]` elements as they enter the viewport,
 * with a small stagger among siblings (60–80ms, capped). transform/opacity only → CLS-safe.
 * Honors prefers-reduced-motion (shows everything immediately). Pairs with the `[data-reveal]`
 * rules in global.css. CSS scroll-driven timelines are Safari-26-only, so IO is the baseline.
 */
interface RevealPreset {
  delayStepMs: number;
  maxIndex: number;
}

const DEFAULT_PRESET: RevealPreset = {
  delayStepMs: 70,
  maxIndex: 11,
};

const SECTION_PRESETS: Record<string, RevealPreset> = {
  hero: { delayStepMs: 90, maxIndex: 5 },
  pricing: { delayStepMs: 55, maxIndex: 10 },
  faq: { delayStepMs: 50, maxIndex: 8 },
  work: { delayStepMs: 45, maxIndex: 8 },
};

function getSectionId(el: HTMLElement): string | null {
  const section = el.closest('section[id]');
  if (!section) return null;
  return section.id || null;
}

function getRevealPreset(el: HTMLElement): RevealPreset {
  const sectionId = getSectionId(el);
  if (!sectionId) return DEFAULT_PRESET;
  return SECTION_PRESETS[sectionId] ?? DEFAULT_PRESET;
}

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
        const preset = getRevealPreset(el);
        const delay = Math.min(index, preset.maxIndex) * preset.delayStepMs;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  els.forEach((el) => observer.observe(el));
}
