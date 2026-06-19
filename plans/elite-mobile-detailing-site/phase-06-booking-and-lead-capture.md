# Phase 6 — Booking & Lead Capture

**Goal:** All three conversion paths working — Book (Cal.com), Quote (form), Call (tel:).
**Depends on:** Phase 3 (section), Phase 2 (primitives)
**Status:** ⬜ Not started
**Spec refs:** `INITIAL_IDEA.md` §3.1, §4.9.

> The Cal.com embed package (`@calcom/embed-snippet`) is installed in **Phase 0**. The Cal.com
> *account / event type / booking questions* setup is operational and lives in this phase.
> We use the **FREE tier** — routing forms + SMS workflows are paid (~$15/mo) and are an
> optional later upgrade, not used at launch.

## Tasks

- [ ] **P6-T1 — Cal.com setup (free tier)**
  - Create account + ONE event type ("Mobile Detail"); configure Booking Questions: package,
    vehicle size, name, phone, vehicle (year/make/model), service address, notes. (On-page instant
    estimator does the package/size "routing" before Cal.com — no paid Routing Form needed.)
    Free email confirmations on; SMS reminders = paid upgrade, OFF. Document config in repo README.
- [ ] **P6-T2 — Lazy embed island**
  - Cal.com inline embed via a **load-on-click facade** (iOS-safe: defers heavy embed.js, avoids the
    auto-scroll-on-load jump + double-scroll); Cal mobile/column layout, `width:100%`, no nested
    scroll container, `overscroll-behavior:contain` (§2.5); reassurance copy above ("no card up
    front…"); fallback "Call/text {{PHONE}}" + next-availability cue.
- [ ] **P6-T3 — Quote form (Web3Forms)**
  - Setup: sign up at web3forms.com → create a form → copy the **public access key** (it's an email
    alias, **safe to commit** — no secret/env-var storage needed); put it in a hidden `access_key`
    input (or pull from `src/data/site.ts`). The form `POST`s straight to Web3Forms — no backend.
  - Fields: name, phone, vehicle, service (inputs `font-size:16px` — no iOS auto-zoom, §2.5). Spam
    protection: built-in **honeypot** (`botcheck`) ON + optional **hCaptcha**. Inline validation.
  - States: success = inline confirmation ("Thanks! We'll call/text you back within [X] hrs") or a
    thank-you view; error = field-level messages; **fallback** if the POST fails = show the
    tap-to-call number so the lead isn't lost.
  - Honest follow-up copy: text-back is **manual at launch** (no auto-SMS). Watch-item: Web3Forms
    free tier = **250 submissions/mo** — upgrade or switch if exceeded.
- [ ] **P6-T4 — Tap-to-call wiring**
  - `tel:{{PHONE_E164}}` from hero, sticky mobile bar, and footer; single phone constant from `site.ts`.
- [ ] **P6-T5 — Stripe deposit (optional, default OFF)**
  - Document how to enable a Cal.com+Stripe deposit later; keep disabled to preserve the
    "no card up front" promise.

## Done when
Book / Quote / Call all function; the quote form submits via Web3Forms (owner receives the email);
the Cal.com embed lazy-loads without layout breakage on mobile.
