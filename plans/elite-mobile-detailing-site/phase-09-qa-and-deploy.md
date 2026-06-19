# Phase 9 — QA, Analytics & Deploy

**Goal:** Replace placeholders with real data, final QA, and ship to production.
**Depends on:** Phases 1–8
**Status:** ⬜ Not started
**Spec refs:** `INITIAL_IDEA.md` §3.4, §9; `SEO_STRATEGY.md` (Measurement).

> Tooling/deps are already in place from **Phase 0** — here you connect real analytics keys and
> turn on event tracking, not install.

## Tasks

- [ ] **P9-T1 — Analytics + events**
  - Umami (free, cookieless, no cookie banner); wire `umami.track()` on `book_click`,
    `quote_submit`, `call_click`, `zip_checked`, `pricing_tab_changed`. (Plausible/GA4 optional later.
    Cloudflare Web Analytics can't track custom events, so it's not used.)
- [ ] **P9-T2 — Owner-data & assets pass**
  - Replace placeholders: NAP, `{{PHONE_E164}}`, `{{DOMAIN}}`, lat/lng, hours, real photos/video,
    GBP + social URLs. (See spec §9.) `{{PHONE_E164}}` should be a **local DFW call-tracking
    number** (e.g. CallRail), not toll-free, for offline attribution. Reviews/rating are NOT
    required at launch (cold-start) — add the hero rating row + AggregateRating later once genuine
    GBP reviews exist.
  - Brand assets: a real **OG/Twitter share image** (branded, 1200×630) and a **favicon /
    apple-touch-icon set** (+ `site.webmanifest`).
- [ ] **P9-T3 — Copy proofread** — US English, consistent CTA wording, remove any internal notes/placeholders.
- [ ] **P9-T4 — Final QA matrix** — devices + browsers incl. **iOS Safari (current + one older) +
  Android Chrome**; verify input no-zoom, sticky-bar safe-area, glass nav, Cal facade, ≥44px tap
  targets; forms; all links/anchors; lightbox; Cal.com embed; sticky bar; 404; zip in/out cases.
- [ ] **P9-T5 — Production deploy**
  - Cloudflare Pages prod; custom domain + HTTPS; force one host (www↔apex 301 via a zone-level
    Cloudflare **Bulk Redirect / Redirect Rule** — not Pages `_redirects`, which can't do host
    redirects); submit `sitemap.xml` in Search Console; validate schema on the live URL.
- [ ] **P9-T6 — Search Console + GBP linkage** — verify property; confirm NAP matches GBP exactly.

## Done when
Site is live on the domain, Book/Quote/Call verified in production, and Search Console + analytics
are receiving data.
