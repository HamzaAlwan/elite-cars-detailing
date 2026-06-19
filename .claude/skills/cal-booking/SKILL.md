---
name: Cal.com booking
description: >-
  How to integrate Cal.com booking on this site. Use when embedding the scheduler,
  configuring routing forms / booking questions, wiring the quote form or tap-to-call,
  or deciding on deposits.
---

# Cal.com booking

Recommended scheduler (open-source, usable free tier, best UI). Three conversion paths:
**Book** (Cal.com), **Quote** (Web3Forms), **Call** (`tel:`).

## Rules

- FREE-TIER capture (routing forms are PAID, so don't rely on them): use ONE event type
  ("Mobile Detail") with **Booking Questions** collecting package, vehicle size, name,
  phone, vehicle (year/make/model), service address, notes. The on-page instant estimator
  (pricing selector → exact price + "Book this") does the package/size routing before Cal.com.
  (Caveat: *basic* booking questions are free; *advanced conditional* question logic is paid —
  our simple questions stay on the free plan. Cal.com branding is also retained on free.)
- Embed: Cal.com inline HTML embed in a responsive wrapper (no double-scroll on mobile);
  keep framework-light. **Lazy-load** on click / scroll-into-view (heavy third party —
  protect LCP).
- Reassurance copy above the widget: "no card up front — pay on-site." Fallback below:
  "Call/text {{PHONE}}" + a next-availability cue.
- No-shows: default no deposit (keeps the no-card promise); free EMAIL confirmation at launch.
  SMS reminders + Routing Forms are a PAID (~$15/mo) upgrade — DISABLED for now, adopt later
  if no-shows hurt. A Stripe deposit contradicts the no-card promise → keep OFF.
- Quote form: Web3Forms (name, phone, vehicle, service) + honeypot + success state; emails the
  owner (no backend). Follow-up is manual at launch — set honest "we'll text/call within [X] hrs".
- Single phone constant from `src/data/site.ts`; tap-to-call in hero, sticky bar, footer.

Ref: `INITIAL_IDEA.md` §3.1, §4.9. Pairs with `landing-ux-cro`.
