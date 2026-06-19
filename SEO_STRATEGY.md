# SEO STRATEGY — Elite Mobile Car Detailing (US / DFW)

Companion to `INITIAL_IDEA.md`. This is the best-practice, US-targeted SEO plan,
researched against 2026 local-search ranking data. It has two halves:

- **PART A — ON-SITE (build):** everything baked into the Astro site.
- **PART B — OFF-SITE (owner playbook):** the work that actually moves local rankings
  but happens outside the codebase (Google Business Profile, reviews, citations).

> **Reality check up front.** For a mobile detailer, the **Google Business Profile (GBP)
> + the Map Pack** are the #1 driver — the local 3-pack renders *above* organic results
> for "car detailing near me / [city]." A perfect website is necessary but **not
> sufficient**; Part B is where most of the ranking lives. Approximate local-pack weight:
> **GBP 32% · on-page 19% · reviews 16% · links 15% · behavioral 8% · citations 7% ·
> personalization 3%.**

Scope (per decision): **lean single-page build**. City pages + blog are documented in
§A8 (Roadmap) but **not built initially** — mass near-duplicate city pages risk a
doorway-page penalty until there's genuine per-city content/reviews.

Owner data needed before launch (placeholders used throughout): `{{DOMAIN}}`,
`{{PHONE_E164}}` (e.g. +19725551234), `{{LOCAL_PHONE_DISPLAY}}`, `{{GBP_URL}}`,
`{{LAT}}`/`{{LNG}}` (Richardson base), real review count/rating, hours, social URLs.

================================================================================
# PART A — ON-SITE SEO (built into the Astro site)
================================================================================

## A1. Keyword & intent map (US)

Local-intent dominates this niche. Demand signal: "car detailing service" ~135k US
searches/mo; "mobile detailers near me" ~60k/mo. Don't keyword-stuff "near me" — target
intent with natural **service + city** phrasing.

- **Primary (homepage H1/title):** mobile car detailing Richardson TX; mobile car
  detailing DFW.
- **Core service + geo:** mobile detailing Dallas/Plano/Frisco/McKinney/Allen/Garland/
  Carrollton/Irving; interior car detailing [DFW]; exterior detailing [DFW].
- **Problem / high-intent (buyers who know what they need):** ceramic coating [city];
  paint correction near me; clay bar treatment; pet hair removal car; odor removal car.
- **Near-me / discovery:** mobile car detailing near me; mobile detailers near me;
  car detailing that comes to you.
- **Differentiator long-tail:** mobile detailing for apartments; detailing at office
  no water hookup; self-contained mobile detailing.

Map keywords to existing page sections (no stuffing): H1 + hero (primary), value props
(self-contained/apartment angle), pricing (package + service terms), service-area
section (city terms), FAQ (problem-intent + voice/AI queries).

## A2. On-page SEO (the single landing page)

- **Title tag (~50–60 chars):** `Mobile Car Detailing in Richardson & DFW | Elite Mobile Car Detailing`
- **Meta description (~150–160 chars):** benefit + geo + CTA, e.g. *"Premium mobile car
  detailing that comes to you across Richardson & the DFW metro. Self-contained units —
  no water or power needed. Book online today."*
- **Exactly one `<h1>`** = primary keyword phrased naturally (e.g. "Mobile Car Detailing,
  Delivered to Your DFW Driveway"). Logical `h2`/`h3` order matching sections; never skip
  levels. Section ids = clean anchors (`#pricing`, `#service-area`, `#faq`, `#book`).
- **Content depth for AI + relevance:** each section carries real, specific copy (cities
  served by name, what each package includes, how the self-contained rig works). FAQ
  answers written as concise, directly-quotable 1–3 sentence answers (feeds AI Overviews
  + featured snippets).
- **Image SEO:** descriptive filenames (`mobile-detailing-plano-bmw-after.webp`), real
  `alt` text (vehicle + service + city where honest), `astro:assets` for WebP/AVIF +
  dimensions (no CLS).
- **NAP block in footer** (Name / service-area / `{{LOCAL_PHONE_DISPLAY}}` / email /
  hours) with **click-to-call** (`tel:{{PHONE_E164}}`) — must match GBP byte-for-byte.
- **Internal links:** footer + service-area links to the (future) city pages and to the
  GBP listing; CTAs anchor to `#book`/`#quote`.

## A3. Technical SEO (Astro)

- **Sitemap:** `@astrojs/sitemap` → `/sitemap-index.xml`; only canonical 200 URLs;
  accurate `lastmod`. Submit in Search Console.
- **robots.txt:** allow crawling, reference the sitemap, no accidental `Disallow: /`.
- **Canonical:** self-referencing `<link rel="canonical">` on every page (absolute URL).
- **Locale:** single `en-US`; set `<html lang="en">` + `og:locale=en_US`. No hreflang
  needed (US-only).
- **HTTPS + redirects:** Cloudflare Pages TLS; force HTTPS; one host (www **or** apex,
  301 the other via a zone-level Cloudflare **Bulk Redirect / Redirect Rule** — Pages
  `_redirects` can't do host-level redirects); trailing-slash consistency via build config.
- **Custom 404** page with links back to home/booking.
- **Mobile-first:** Google indexes the mobile rendering — the mobile layout must contain
  all content/links (no desktop-only text). Already mobile-first per spec.
- **Core Web Vitals:** see `INITIAL_IDEA.md` §6 (Astro zero-JS baseline, lazy Cal.com,
  `astro:assets`, self-hosted Outfit). Fast pages help both ranking and AI retrieval.
- **Reusable SEO head component:** one Astro component renders `<title>`, meta
  description, canonical, OG/Twitter tags, and injects JSON-LD (A4) — set per page via
  props so future pages stay consistent.

## A4. Structured data (JSON-LD) — the full set

Inject in `<head>`. Validate with Google's **Rich Results Test** + Schema Markup
Validator. Keep every value identical to GBP + the on-page NAP.

**(1) LocalBusiness as a service-area business** — use the most specific type `AutoWash`
(subtype of `AutomotiveBusiness` < `LocalBusiness`). SAB form: provide city/region/
country, **omit `streetAddress`** (no public storefront), express coverage via
`areaServed` (named cities) **and** a `GeoCircle` for the 50-mi radius.

```json
{
  "@context": "https://schema.org",
  "@type": "AutoWash",
  "@id": "https://{{DOMAIN}}/#business",
  "name": "Elite Mobile Car Detailing",
  "slogan": "No hookups. No hassle. Just shine.",
  "url": "https://{{DOMAIN}}/",
  "image": "https://{{DOMAIN}}/og/elite-mobile-detailing.jpg",
  "logo": "https://{{DOMAIN}}/logo.png",
  "telephone": "{{PHONE_E164}}",
  "priceRange": "$125–$1,995",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card, Apple Pay, Contactless",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Richardson",
    "addressRegion": "TX",
    "postalCode": "75080",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": {{LAT}}, "longitude": {{LNG}} },
  "areaServed": [
    { "@type": "City", "name": "Richardson" },
    { "@type": "City", "name": "Dallas" },
    { "@type": "City", "name": "Plano" },
    { "@type": "City", "name": "Frisco" },
    { "@type": "City", "name": "McKinney" },
    { "@type": "City", "name": "Allen" },
    { "@type": "City", "name": "Garland" },
    { "@type": "City", "name": "Carrollton" },
    { "@type": "City", "name": "Irving" }
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": {{LAT}}, "longitude": {{LNG}} },
    "geoRadius": "80467"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "08:00", "closes": "19:00"
  }],
  "sameAs": [
    "{{GBP_URL}}",
    "https://www.instagram.com/...",
    "https://www.facebook.com/...",
    "https://www.yelp.com/biz/..."
  ]
}
```
Notes: `geoRadius` is in meters (80467 ≈ 50 mi). `latitude`/`longitude` need ≥5 decimal
places. `telephone` must include the country code (`+1…`).

**(2) Service** (one per package; link to the business `@id`).
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Mobile car detailing",
  "provider": { "@id": "https://{{DOMAIN}}/#business" },
  "areaServed": { "@type": "GeoCircle",
    "geoMidpoint": {"@type":"GeoCoordinates","latitude":{{LAT}},"longitude":{{LNG}}},
    "geoRadius": "80467" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Detailing Packages",
    "itemListElement": [
      { "@type": "Offer", "name": "The Standard Reset",
        "priceSpecification": {"@type":"PriceSpecification","minPrice":125,"priceCurrency":"USD"} },
      { "@type": "Offer", "name": "The Elite Signature",
        "priceSpecification": {"@type":"PriceSpecification","minPrice":225,"priceCurrency":"USD"} },
      { "@type": "Offer", "name": "Ceramic Showroom — 3-Year Coating",
        "priceSpecification": {"@type":"PriceSpecification","minPrice":650,"priceCurrency":"USD"} },
      { "@type": "Offer", "name": "Ceramic Showroom — 9-Year Coating",
        "priceSpecification": {"@type":"PriceSpecification","minPrice":1500,"priceCurrency":"USD"} }
    ]
  }
}
```

**(3) FAQPage** — mark up the on-page FAQ (§4.10). One `Question` per visible FAQ with a
concise `acceptedAnswer`. Only mark up FAQs actually shown on the page.

**(4) Organization + WebSite** — brand entity + site identity.
```json
[
 { "@context":"https://schema.org","@type":"Organization","@id":"https://{{DOMAIN}}/#org",
   "name":"Elite Mobile Car Detailing","slogan":"No hookups. No hassle. Just shine.",
   "url":"https://{{DOMAIN}}/",
   "logo":"https://{{DOMAIN}}/logo.png","telephone":"{{PHONE_E164}}",
   "sameAs":["{{GBP_URL}}"] },
 { "@context":"https://schema.org","@type":"WebSite","@id":"https://{{DOMAIN}}/#website",
   "url":"https://{{DOMAIN}}/","name":"Elite Mobile Car Detailing",
   "publisher":{"@id":"https://{{DOMAIN}}/#org"} }
]
```
(No `SearchAction`/sitelinks-searchbox — there's no on-site search on a single page.)

**(5) BreadcrumbList** — not needed for the single page; add it when city pages ship.

**⚠️ Reviews / AggregateRating caveat (important).** Google does **not** show review-star
rich results for *self-serving* reviews (a business reviewing itself on its own site).
Stars in the Map Pack come from **GBP reviews**, not your markup. So:
- It's fine to include `aggregateRating`/`review` JSON-LD **only if** those reviews are
  genuinely shown on the page and the numbers are true — it aids entity/AI understanding.
- Do **not** fabricate ratings or expect star snippets from it. Treat GBP as the real
  review surface (Part B).
- **LAUNCH DECISION (cold-start):** this business has no Google reviews yet → emit **NO**
  `aggregateRating`/`review` markup and show **NO** hero rating row at launch. Add both only
  once genuine GBP reviews exist (see `INITIAL_IDEA.md` §3.3/§4.2/§4.7).

## A5. AI search / Answer-Engine Optimization (AEO)

2026 shift: AI Overviews, ChatGPT, Perplexity, Gemini weight **on-page content depth even
higher (~24%)** and lean on schema + the traditional index (unindexed = uncitable).
- Write FAQ + section copy as **clear, self-contained, quotable answers** ("Do you need
  my water or power? No — our units are fully self-contained…").
- Keep the FAQPage + LocalBusiness schema accurate (AI pulls structured facts).
- Ensure everything is indexable and fast (Astro already helps).

================================================================================
# PART B — OFF-SITE OWNER PLAYBOOK (drives most of the ranking)
================================================================================

## B1. Google Business Profile (the #1 lever) — set up as a service-area business
- **Service-area business:** hide the street address; add the cities served (Richardson,
  Dallas, Plano, Frisco, McKinney, Allen, Garland, Carrollton, Irving) — list real
  regions, stay within ~a 2-hour drive; don't over-claim.
- **Primary category:** `Car detailing service` (the primary category is a top-3 ranking
  factor). Add relevant secondaries (e.g. `Car wash`, `Auto restoration service`).
- **NAP + local number:** exact match to the site footer + all citations; use a **local
  DFW number**, not toll-free (local numbers signal geographic relevance).
- **Complete every field:** 200–500-char description (keywords used naturally), services
  with descriptions + prices, attributes (mobile, appointment-only, payment types),
  opening hours, opening date.
- **Photos:** real, professional before/after + the rig (profiles with pro photos get
  ~35% more clicks); add new photos regularly.
- **Google Posts:** post offers/updates regularly (freshness + engagement).
- **Q&A:** seed common questions (self-contained, areas, pricing) and answer them.
- **Keep the business title clean** (real name; keyword-stuffing the GBP title violates
  guidelines and can get the profile suspended).

## B2. Reviews engine (16% of local pack; velocity > volume)
- **Cadence:** aim for **3–5 genuine new reviews/month**, steady — beats a one-time pile.
- **Ask flow:** after each completed detail, text/email a short GBP review link
  (deep-link to the review form). Make it one tap.
- **Encourage specifics:** invite customers to mention the **service + city + vehicle**
  ("interior detail in Plano on my BMW") — those words become indexed content on GBP and
  help rank for those terms.
- **Respond to every review within 24–48h** (Google confirms responding helps; each reply
  adds indexed text). Naturally include business name/service/city in replies.
- **Seed other surfaces too:** Yelp, Facebook (don't incentivize/gate reviews — against
  policy).

## B3. Citations & NAP consistency (baseline)
Direct ranking weight has declined, but consistent citations remain a foundation and
support every other effort. Build in priority order, **identical NAP** everywhere:
1. **Core:** GBP → Apple Business Connect → Bing Places → Yelp → Foursquare.
2. **General directories:** BBB, YellowPages, Manta, Chamber of Commerce, Citysearch, EZlocal.
3. **Industry/local:** auto-detailing directories, local DFW business listings, Nextdoor.
Audit periodically for NAP drift (old numbers/addresses are the usual culprits).

## B4. Local links & E-E-A-T
- **Local backlinks:** sponsor a local team/event, partner with DFW dealerships/apartment
  complexes/offices (ties to the self-contained USP), get listed by local blogs/news.
- **E-E-A-T signals:** show real team/credentials, insured/certified, genuine photos,
  consistent brand identity — feeds both classic rankings and AI-citation trust.

================================================================================
# MEASUREMENT
================================================================================
- **Google Search Console:** submit sitemap; track impressions/CTR/position by query +
  page; watch Core Web Vitals + Rich Results reports.
- **GBP insights:** calls, direction requests, website clicks, search queries.
- **Analytics (Umami — cookieless, custom events; GA4/Plausible optional):** conversion
  events `book_click`, `quote_submit`, `call_click`, `zip_checked`, `pricing_tab_changed`
  via `umami.track()`. (Cloudflare Web Analytics can't track custom events, so it's not used.)
- **Local rank tracking:** a geo-grid tool (e.g. Local Falcon) to see Map-Pack rank
  across the DFW grid, not just one point.
- **Validation:** Rich Results Test + Schema Markup Validator after any schema change.

================================================================================
# A8. ROADMAP (documented — NOT in the initial lean build)
================================================================================
Add these once there's real per-area content/reviews to justify them:

- **Priority city pages** (e.g. Plano, Frisco, McKinney): one page per high-value city,
  URL `/{{service}}-{{city}}-tx` (e.g. `/mobile-car-detailing-plano-tx`). Each must be
  **genuinely unique** — local testimonials, city-specific copy/landmarks, area FAQs,
  real photos from that city. **Do not** mass-generate template pages with the city name
  swapped (doorway-page penalty). Add `BreadcrumbList` + per-page LocalBusiness/Service
  schema; internal-link from footer/service-area.
- **Blog / content engine** (Astro content collection) for topical authority + AI-citation
  surface: cost guides ("how much does mobile detailing cost in DFW?"), comparisons
  (ceramic vs wax, ceramic coating worth it?), seasonal (Texas heat/pollen care),
  how-tos. Each post targets a real query, internally links to services/booking.
- Revisit `AggregateRating` markup once a substantial, genuine on-page review set exists.

================================================================================
# SOURCES (research basis)
================================================================================
- Whitespark 2026 Local Search Ranking Factors; BrightLocal local algorithm guide.
- Google Search Central — LocalBusiness structured data; schema.org `AutoWash`/`AutomotiveBusiness`.
- BrightLocal & Search Engine Land — service-area/city pages (doorway avoidance).
- 2026 GBP optimization guides (service-area setup, categories, photos, attributes).
- Review-velocity & response-impact studies (Local Falcon, ReviewScout).
- 2026 technical-SEO + AI-search (AI Overviews) checklists; auto-detailing keyword studies.
