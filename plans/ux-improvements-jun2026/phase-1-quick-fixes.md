# Phase 1 — Quick Fixes

Issues: 5 (font), 8 (mobile nav), 12 (modal flash)
Estimated time: ~1–2 hours
Files: `src/styles/global.css`, `src/components/islands/MobileNav.vue`

---

## Task 1.1 — Modal Top-Left Flash (Issue 12)

**Status:** [ ]

### Modal Flash — Root Cause

Reka UI mounts `DialogContent` into the DOM portal 1 paint frame before setting `data-state="open"`. During that frame the element is visible at its natural position with `opacity: 1`. The `dialog-pop-in` animation starts with `opacity: 0` but only triggers once `data-state="open"` is applied — so there is a brief flash before the animation hides it.

### Modal Flash — Fix

**File:** `src/styles/global.css` (around the `.dialog-content` block, lines 260–275)

```css
/* Before */
.dialog-content[data-state="open"] {
  animation: dialog-pop-in var(--dur-base) var(--ease-emphasized);
}

/* After */
.dialog-content {
  /* Hide element before data-state is set — prevents top-left flash */
  opacity: 0;
}

.dialog-content[data-state="open"] {
  /*
   * fill-mode "both":
   *   backwards — applies from-frame (opacity:0, scaled) before animation starts
   *   forwards  — keeps to-frame (opacity:1, full size) after animation ends
   */
  animation: dialog-pop-in var(--dur-base) var(--ease-emphasized) both;
}
```

No template changes needed. No impact on the booking event system or Cal.com embed.

---

## Task 1.2 — Body Font Bump (Issue 5)

**Status:** [ ]

### Font — Root Cause

`body` has no explicit `font-size`. Browser default is 16 px, which feels tight on the high-contrast dark design.

### Font — Fix

**File:** `src/styles/global.css` — add one line inside the existing `body` rule (~line 89):

```css
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 1.0625rem; /* 17 px — bump from browser default 16 px */
  line-height: 1.6;
  /* … rest unchanged */
}
```

Impact check:

- Headings use explicit `font-size` vars (clamp) — unaffected
- `text-sm` (0.875rem) grows 14 px → ~14.9 px — acceptable
- `text-xs` (0.75rem) grows 12 px → ~12.75 px — acceptable
- Inputs locked at `font-size: 16px` (iOS zoom prevention) — unaffected

---

## Task 1.3 — Mobile Nav Close Button (Issue 8)

**Status:** [ ]

### Close Button — Root Cause

`DialogClose as-child` does not reliably forward the click-to-close handler on iOS touch in Reka UI v2. The plain `<button>` inside `as-child` receives the close logic through Reka's render-as-child slot composition, but on mobile that touch event can fail to propagate.

### Close Button — Fix

**File:** `src/components/islands/MobileNav.vue` (lines 95–106)

Add `@click="close"` directly to the `DialogClose` element (belt-and-suspenders alongside `as-child`):

```html
<!-- Before -->
<DialogClose as-child>
  <button
    aria-label="Close navigation"
    class="inline-flex h-9 w-9 ..."
  >
    <!-- SVG -->
  </button>
</DialogClose>

<!-- After -->
<DialogClose as-child @click="close">
  <button
    aria-label="Close navigation"
    class="inline-flex h-9 w-9 ..."
  >
    <!-- SVG unchanged -->
  </button>
</DialogClose>
```

If the above still fails on device, fall back to removing `as-child` entirely and rendering `DialogClose` as the interactive element itself:

```html
<DialogClose
  aria-label="Close navigation"
  class="inline-flex h-9 w-9 cursor-pointer items-center justify-center
         rounded-lg text-text-muted transition-colors hover:bg-bg hover:text-text"
  @click="close"
>
  <!-- SVG unchanged -->
</DialogClose>
```

---

## Task 1.4 — Mobile Nav Link Close (Issue 8)

**Status:** [ ]

### Nav Links — Root Cause

Nav links have `@click="close"` which sets `isOpen.value = false`. On iOS, Reka's scroll-lock teardown races with the browser's anchor-scroll after a hash link fires, leaving the dialog visually stuck.

### Nav Links — Fix

**File:** `src/components/islands/MobileNav.vue` — add function in `<script setup>`:

```typescript
function closeAndNavigate(href: string) {
  isOpen.value = false;
  // One frame lets Reka remove scroll-lock and restore pointer-events
  // before the browser scrolls to the section.
  requestAnimationFrame(() => {
    window.location.href = href;
  });
}
```

Update the nav link template:

```html
<!-- Before -->
<a
  v-for="link in links"
  :key="link.href"
  :href="link.href"
  class="..."
  @click="close"
>

<!-- After -->
<a
  v-for="link in links"
  :key="link.href"
  :href="link.href"
  class="..."
  @click.prevent="closeAndNavigate(link.href)"
>
```

**IMPORTANT — Book CTA exception:** The "Book Your Detail" button at the bottom (`href="#book"`) must keep its existing `@click="close"` **without** `.prevent`. The `#book` link relies on `Layout.astro`'s global click interceptor (listens for `click` events on `a[href^="#book"]`) to dispatch `booking:open`. Calling `window.location.href = "#book"` directly skips that interceptor — the booking modal would not open. Apply `closeAndNavigate` only to the six section nav links.

---

## Verification

1. Open site in Chrome DevTools → iPhone SE (375 px) or on a real iOS device
2. Tap hamburger → panel slides in
3. Tap "Services" → panel closes → page scrolls to `#value`
4. Re-open → tap X button → panel closes immediately
5. Re-open → tap "Book Your Detail" → panel closes AND booking modal opens
6. Desktop: click "Book Your Detail" CTA → modal appears **centered** immediately, no top-left flash
7. Body paragraphs feel slightly larger at 100 % zoom
