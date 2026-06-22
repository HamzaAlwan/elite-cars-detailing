# Phase 7 — SEO & Structured Data (on-site)

**Goal:** Complete on-site SEO for the single page — meta, full JSON-LD set, sitemap/robots/
canonical, 404.
**Depends on:** Phases 3–6 (sections/FAQ/content exist)
**Status:** ✅ Done (2026-06-21)
**Spec refs:** `INITIAL_IDEA.md` §5; `SEO_STRATEGY.md` Part A (§A2–§A4).

## Tasks

- [x] **P7-T1 — Title / meta / OG**
  - Title ~50–60 chars; meta description ~150–160 (benefit + DFW + CTA); OG/Twitter with a real
    branded image — via `Seo.astro` props.
- [x] **P7-T2 — JSON-LD: LocalBusiness (SAB)**
  - `AutoWash` form: omit `streetAddress`; `slogan` ("No hookups. No hassle. Just shine.");
    `areaServed` cities + `GeoCircle` (80467 m); `geo` ≥5 decimals; `+1` telephone; ISO
    `openingHoursSpecification`; `priceRange`; `sameAs`. (SEO_STRATEGY §A4.)
- [x] **P7-T3 — JSON-LD: Service / FAQPage / Organization+WebSite**
  - `Service` per package (OfferCatalog); ceramic is split into tiered offers (3-yr from $650,
    9-yr from ~$1,500) and `priceRange` is `$125–$1,995` (SEO_STRATEGY §A4); `FAQPage` from the
    on-page FAQ; `Organization` + `WebSite` (no SearchAction).
- [x] **P7-T4 — Sitemap / robots / canonical / locale**
  - `@astrojs/sitemap`; `robots.txt` referencing the sitemap; self-referencing canonical; `lang="en"`
    + `og:locale=en_US`; force HTTPS + one host.
- [x] **P7-T5 — Custom 404** with links back to home/booking.
- [x] **P7-T6 — Audit** — exactly one `<h1>`; logical heading order; descriptive image alt/filenames;
  footer NAP byte-matches GBP; confirm the footer cookieless/privacy note + optional Privacy Policy
  link are present (Umami is cookieless → no consent banner needed).
- [x] **P7-T7 — AggregateRating** — SKIP at launch (cold-start: no reviews yet → emit none, and
  no hero rating row). Add only once genuine on-page Google reviews exist; note: self-hosted
  self-reviews do NOT earn star rich results (stars come from GBP).

## Done when
Google Rich Results Test + Schema Validator pass (with sample data), sitemap + robots present,
canonical correct, 404 works.
