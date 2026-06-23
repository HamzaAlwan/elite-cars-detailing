# Phase 4 — Cal.com booking modal (brand-matched, prefilled)

**Goal:** every "Book" CTA opens a clean, on-brand modal with the Cal.com scheduler inside,
prefilled with the chosen package/size.
**Why:** owner wants booking in a modal that matches the site, not a full inline embed.

## Tasks
- [ ] Add `@calcom/embed-core` to `package.json`, install.
- [ ] Create `src/components/islands/BookingModal.vue`:
  - [ ] Reka `DialogRoot`/`Trigger?`/`Overlay`/`Content` chrome: dark `surface-raised` panel, our
        radius, scrim 40–60% black, accessible close (X) button, `Esc` + overlay dismiss, focus trap.
  - [ ] Lazily init Cal **inline** into a container div via embed-core on first open; configure
        `theme:'dark'`, brand color `#1E5FFF` via `cssVarsPerTheme`, `layout:'month_view'`.
  - [ ] Prefill package/size into Cal (notes or a custom field) from the open event detail.
  - [ ] **Loading state**: skeleton/spinner inside the dialog until the embed is ready (no blank panel).
  - [ ] Listen for Cal `bookingSuccessful` → close modal + leave an analytics hook (comment/no-op).
  - [ ] **History state**: `history.pushState` on open; `popstate` closes → mobile/desktop back button closes modal.
- [ ] Global open mechanism (small script in `Layout.astro` or a tiny module):
  - [ ] Intercept clicks on `a[href^="#book"]`, `preventDefault`, parse `package`/`size` from the
        href query (fallback to `sessionStorage['elite-detail-size']`), dispatch
        `window.dispatchEvent(new CustomEvent('booking:open', { detail }))`.
  - [ ] `BookingModal` listens for `booking:open` and opens prefilled. No CTA markup changes needed.
- [ ] Mount `<BookingModal client:idle />` once in `src/layouts/Layout.astro` (footer slot).
- [ ] Convert the `#book` `<Section>` in `index.astro` to a no-JS fallback: short blurb + a button
      (also dispatches `booking:open`) + `tel:` link. Keep it as the `#book` scroll target.
- [ ] Retire `src/components/islands/BookingEmbed.vue` (delete, or reduce to the fallback button).

## Acceptance
- Book CTAs in Nav, Hero, Pricing cards, HowItWorks, StickyBar, MobileNav, Footer, ZipValidator,
  and the estimator all open the modal.
- Selecting Elite + Truck then Book → modal opens with that package/size prefilled.
- Modal traps focus; closes on `Esc`, overlay click, X, hardware/browser back, and booking success.
- With JS disabled, `#book` still scrolls into view and offers a phone number.
- Loading skeleton shows before the calendar renders.

## Notes / decisions
- No deposit/card upfront — keep current "pay after satisfied" copy.
- Modal-only (inline embed retired) + no-JS fallback, per owner.
- Chrome must match the site (Reka dialog); the calendar interior is Cal's, themed dark + brand color.

## ⚠ Deviation from plan (implementation finding)
`@calcom/embed-core` (npm) is **not usable** in this Vite/Astro bundle: its `embed.js` throws
`"Cal is not defined"` unless the global `window.Cal` CDN snippet stub pre-exists (it's meant to be
served by Cal's CDN, not bundled). `getCalApi` only ships in `@calcom/embed-react`.
**Resolution:** dropped `@calcom/embed-core`; the modal uses the Cal **iframe embed URL** (theme=dark,
prefilled `notes`) inside the Reka Dialog, plus a `message` listener for `bookingSuccessful` to
auto-close. Same UX (branded modal, prefill, opens from every CTA), more robust. The original
`BookingEmbed.vue` author had independently chosen the iframe for the same reason.
- Brand color of the *calendar interior* is a Cal dashboard setting (per event type), not a URL param.
  The modal **chrome** is fully brand-matched here; owner can set the in-calendar brand color in Cal.

## Follow-up fix — loading flash + color/UX polish (post-launch)
**Bug:** the iframe approach dismissed the skeleton on `@load`, which fires before Cal's JS centers
the widget → brief "not in the middle" flash. **Fix:** switched to Cal's **official embed snippet**
(`src/lib/cal.ts` loads `embed.js` from the CDN lazily on first open) and render the calendar
**inline** into a container inside the Reka dialog. The reveal is now gated on Cal's `linkReady`
event, and the calendar **crossfades in** (`opacity` + `--dur-base`) already-centered. Added:
`bookingSuccessfulV2` listener (current Cal event), a 6s safety fallback so the skeleton never
strands, and `<link rel="preconnect" href="https://app.cal.com">` in Layout for faster load.
**Colors:** chrome + calendar container use site tokens (`surface-raised`, `bg-bg`); `theme:'dark'` +
best-effort `cssVarsPerTheme` brand vars passed to Cal. **Owner:** for the in-calendar accent, set
Brand color `#1E5FFF` in Cal dashboard (Event Type → Advanced) — not settable via embed (calcom #16732).
