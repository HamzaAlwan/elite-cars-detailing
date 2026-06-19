---
name: Local SEO & schema
description: >-
  US local-SEO and structured-data practices for this mobile-detailer site. Use when
  writing titles/meta/OG, JSON-LD (LocalBusiness/Service/FAQPage), headings, alt text,
  sitemap/robots/canonical, NAP, or anything affecting Google ranking, the Map Pack, or
  AI-search visibility.
---

# Local SEO & schema

Full playbook: `SEO_STRATEGY.md` (Part A on-site, Part B owner). Essentials:

## Mindset

- For a mobile detailer the **Map Pack + Google Business Profile** is the #1 driver
  (local-pack weight ≈ GBP 32% · on-page 19% · reviews 16% · links 15% · citations 7%).
  The site is necessary but not sufficient — surface off-site work to the owner.

## On-site (what we build)

- Exactly one `<h1>`; logical heading order; title ~50–60 chars; meta description ~150–160;
  OG/Twitter with a real branded image.
- Target service+city and near-me intent naturally — no keyword stuffing.
- JSON-LD (full examples in `SEO_STRATEGY.md` §A4): `AutoWash` LocalBusiness in
  **service-area form** (omit `streetAddress`; `areaServed` cities + `GeoCircle`; `geo`
  ≥5 decimals; `+1` phone; ISO `openingHoursSpecification`; `priceRange`; `sameAs`);
  `Service` per package; `FAQPage`; `Organization` + `WebSite`.
- `@astrojs/sitemap`, robots.txt, self-referencing canonical, `lang="en"` +
  `og:locale=en_US`, custom 404. Footer NAP must byte-match GBP.
- ⚠ Self-hosted reviews of yourself do NOT earn star rich-results (those come from GBP).
  Mark up only genuine on-page reviews; never fabricate ratings. COLD-START launch (no
  reviews yet): emit NO `aggregateRating`/`review` markup and NO hero rating row until real
  GBP reviews exist. `priceRange` reflects tiered ceramic → `$125–$1,995`.
- Do NOT mass-generate city pages (doorway-page penalty) — roadmap only until unique
  per-area content/reviews exist.

Pairs with `landing-ux-cro`, `web-performance-accessibility`.
