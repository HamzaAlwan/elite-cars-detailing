export const NAV_ACTIVE_CHANGE_EVENT = 'nav-active-change';

export interface NavLink {
  readonly href: string;
  readonly label: string;
  readonly description: string;
}

interface NavActiveChangeDetail {
  readonly activeHash: string;
}

interface NavScrollSpyGlobal {
  __navScrollSpyCleanup?: () => void;
  __navScrollSpyActiveHash?: string;
}

interface NavTarget {
  readonly hash: string;
  top: number;
}

const NAV_HEIGHT_PX = 64;
const VIEWPORT_LOOKAHEAD_RATIO = 0.25;
const DEFAULT_ACTIVE_HASH = '#value';

export const NAV_LINKS: readonly NavLink[] = [
  { href: '#value', label: 'Services', description: 'What is included in each detail' },
  { href: '#pricing', label: 'Pricing', description: 'Select size and compare packages' },
  { href: '#how-it-works', label: 'How It Works', description: 'From booking to handoff in 3 steps' },
  { href: '#work', label: 'Our Work', description: 'Transformation gallery and results' },
  { href: '#service-area', label: 'Service Area', description: 'Cities and ZIP availability' },
  { href: '#faq', label: 'FAQ', description: 'Common questions before booking' },
];

function getNavGlobal(): typeof globalThis & NavScrollSpyGlobal {
  return globalThis;
}

function dispatchActiveChange(activeHash: string): void {
  globalThis.dispatchEvent(
    new CustomEvent<NavActiveChangeDetail>(NAV_ACTIVE_CHANGE_EVENT, {
      detail: { activeHash },
    }),
  );
}

function measureTargets(): NavTarget[] {
  return NAV_LINKS.map((link) => {
    const element = document.querySelector<HTMLElement>(link.href);
    if (!(element instanceof HTMLElement)) return null;

    return {
      hash: link.href,
      top: element.getBoundingClientRect().top + globalThis.scrollY,
    };
  }).filter((target): target is NavTarget => target !== null);
}

function getActivationLine(): number {
  return globalThis.scrollY + NAV_HEIGHT_PX + globalThis.innerHeight * VIEWPORT_LOOKAHEAD_RATIO;
}

function resolveActiveHash(targets: readonly NavTarget[]): string {
  let activeHash = DEFAULT_ACTIVE_HASH;
  const activationLine = getActivationLine();

  for (const target of targets) {
    if (target.top <= activationLine) {
      activeHash = target.hash;
    }
  }

  return activeHash;
}

function setCurrentNavHash(activeHash: string, shouldForceDispatch = false): void {
  const navGlobal = getNavGlobal();
  if (!shouldForceDispatch && navGlobal.__navScrollSpyActiveHash === activeHash) return;

  navGlobal.__navScrollSpyActiveHash = activeHash;
  dispatchActiveChange(activeHash);
}

export function getCurrentNavHash(): string {
  return getNavGlobal().__navScrollSpyActiveHash ?? DEFAULT_ACTIVE_HASH;
}

export function startNavScrollSpy(): void {
  const navGlobal = getNavGlobal();
  navGlobal.__navScrollSpyCleanup?.();

  let targets = measureTargets();
  let isFrameQueued = false;

  const syncActiveHash = (): void => {
    isFrameQueued = false;
    if (targets.length === 0) {
      targets = measureTargets();
    }
    setCurrentNavHash(resolveActiveHash(targets));
  };

  const queueSyncActiveHash = (): void => {
    if (isFrameQueued) return;
    isFrameQueued = true;
    globalThis.requestAnimationFrame(syncActiveHash);
  };

  const remeasureAndQueue = (): void => {
    targets = measureTargets();
    queueSyncActiveHash();
  };

  globalThis.addEventListener('scroll', queueSyncActiveHash, { passive: true });
  globalThis.addEventListener('resize', remeasureAndQueue);
  globalThis.addEventListener('load', remeasureAndQueue);
  globalThis.addEventListener('pageshow', remeasureAndQueue);
  document.addEventListener('astro:page-load', remeasureAndQueue);

  navGlobal.__navScrollSpyCleanup = () => {
    globalThis.removeEventListener('scroll', queueSyncActiveHash);
    globalThis.removeEventListener('resize', remeasureAndQueue);
    globalThis.removeEventListener('load', remeasureAndQueue);
    globalThis.removeEventListener('pageshow', remeasureAndQueue);
    document.removeEventListener('astro:page-load', remeasureAndQueue);
  };

  setCurrentNavHash(resolveActiveHash(targets), true);
  globalThis.setTimeout(remeasureAndQueue, 0);
}
