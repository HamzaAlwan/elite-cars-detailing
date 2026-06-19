================================================================================
MASTER BUILD SPEC v2 — ELITE MOBILE CAR DETAILING (DFW)
================================================================================

This is v2 — the v1 draft was replaced in place (this file IS the current spec).

This rewrite is informed by a competitor + CRO study of the DFW mobile-detailing
market (see "Research Basis" at the end). Changes from v1 are flagged inline as
[CHANGED], [NEW], or [KEEP]. Build-ready for: Astro 6 (SSG, latest) + Tailwind v4 + Vue
islands (shadcn-vue / Reka UI) + Cal.com (free tier), deployed on Cloudflare Pages.

>> BUILD PLAN & CONVENTIONS: the phased, trackable build lives in
   `plans/elite-mobile-detailing-site/` (start at `00-OVERVIEW.md`; Phase 0 installs &
   configures ALL dependencies before any code). Global conventions: latest packages
   (`@latest` + `npm-check-updates`), TypeScript `strict`, mobile-first, all-OSS.
   Reusable build guidance is encoded as skills in `.claude/skills/`.

>> DECISIONS LOCKED (2026-06-19, owner interview) — these resolve the Open Decisions in
   §9 and OVERRIDE older inline text where they conflict:
   • Stack: Astro 6 (latest; requires Node ≥ 22.12). Cloudflare acquired Astro (Jan 2026).
   • Host + forms: Cloudflare Pages + Web3Forms (replaces Netlify + Netlify Forms).
   • Analytics: Umami (free cloud tier or self-host; cookieless → no consent banner; tracks
     custom conversion events). Cloudflare Web Analytics was dropped — it can't track custom events.
   • Cal.com: FREE tier — ONE event type + booking questions (routing forms + SMS workflows
     are PAID ~$15/mo; skip for now). Email confirmations only at launch; SMS reminders are
     a documented future upgrade, disabled now.
   • Social proof: credibility stack, NO fabricated reviews. The numeric hero rating row +
     AggregateRating schema are DEFERRED until real Google (GBP) reviews exist.
   • Pricing: ceramic is TIERED (e.g. "3-yr from $650 · 9-yr from ~$1,500"; owner confirms exact).
   • Add an instant price estimator (pricing selector → exact price + "Book this detail").
   • Hero media: ONE optimized AVIF/WebP image (the LCP element); before/after slider lives
     in the gallery, not the hero.
   • Motion: include Motion One (~5KB) for in-island reveals (transform/opacity; reduced-motion).
   • Launch scope: NO Membership, NO Fleet at launch (both → post-launch roadmap, not build Phase 2).
   • Brand: keep "Elite Mobile Car Detailing" + tagline "No hookups. No hassle. Just shine."
     (BRANDING_OPTIONS.md Option B). Tagline = brand wordmark line (header + footer), OG/meta, and
     JSON-LD slogan (§8, SEO_STRATEGY §A4). Distinctive-rebrand names stay parked in BRANDING_OPTIONS.md.
   • Design direction (2026-06-19): premium DARK theme — deep cool blue-black surfaces + a premium
     SAPPHIRE accent (NOT the generic blue-600) + restrained metallic/gloss "3D" depth (anodized,
     never chrome). Audience is mostly mobile/iPhone → every effect is iOS-Safari-first. See §2.1–§2.5.

--------------------------------------------------------------------------------

1. WHY THIS V2 EXISTS (the short version)

--------------------------------------------------------------------------------
v1 had real strengths: mobile-first, transparent pricing, a strong "self-
contained units" USP, a zip validator, and online booking. It also had gaps that
cost conversions and credibility:

- Only ONE way to convert (commit to a Cal.com time slot). No low-friction
    quote path and no tap-to-call. → biggest leak.
- Thin, bottom-of-page social proof. No rating in the hero, no real reviews,
    no guarantee, no brand logos.
- Before/after photos (the #1 trust driver in detailing) used only in
    testimonials, never as a hero element or gallery.
- Nav linked to "FAQs" but no FAQ section existed.
- "Pay Cash" framing + a literal "high-margin add-ons" copy leak undercut the
    premium positioning.
- No production performance, accessibility, or analytics guidance.

v2 keeps every strength and closes every gap below.

================================================================================

1. PROJECT OVERVIEW
================================================================================

- Business: Elite Mobile Car Detailing (premium mobile detailing). [KEEP + tagline locked]
    Note: "Elite" is generic in this space. DECISION (locked): keep the name for launch and pair
    it with the tagline "No hookups. No hassle. Just shine." (BRANDING_OPTIONS.md Option B). More
    ownable rebrand names stay parked in `BRANDING_OPTIONS.md` for later.
- Location / service area: Based in Richardson, TX; serves a 50-mile DFW radius
    incl. Dallas, Plano, Frisco, McKinney, Allen, Garland, Carrollton, Irving. [KEEP]
- Core USP: 100% mobile & self-contained — onboard water tanks + power
    generators, so we can detail anywhere, including apartments and corporate
    offices that ban utility hookups. [KEEP — make it visual, not just text]
- Target audience: Busy North Texas professionals, luxury-vehicle owners, and
    everyday Texas car owners who value convenience + high-end quality. [KEEP]
- Primary goal / success metric: maximize *qualified conversions* across THREE
    actions — Book (Cal.com), Quote (form), Call (tel:). Target 5%→8–10%
    landing-page conversion (local-service avg is ~2%). [NEW: explicit metric]
- Tech stack [CHANGED — locked to Astro + shadcn-vue islands]:
  - Astro (latest — currently Astro 6; requires Node ≥ 22.12), statically generated
      via `astro build` — ships ZERO JS by default; only interactive "islands" hydrate.
      Best fit for "as light as possible." (Cloudflare acquired Astro in Jan 2026 — the
      framework stays MIT/OSS; Cloudflare Pages is now the first-class host.)
  - Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first `@theme`; content auto-detected —
      never the CDN script). NOTE: `@astrojs/tailwind` is the older v3 integration — do not use.
  - Vue islands via `@astrojs/vue`, using shadcn-vue (Reka UI v2) components for
      the interactive parts. Static sections are plain `.astro` components (no JS).
  - Cal.com inline embed for scheduling (FREE tier, lazy island — see 4.9).
  - Cloudflare Pages hosting + Web3Forms for the quote/lead form (no backend).
      (Netlify + Netlify Forms is an equivalent alternative; a Cloudflare Pages
      Function + Resend keeps the form fully in-house if a third-party form service
      is unwanted.)
- Islands = the ONLY JavaScript shipped. Map each to a hydration directive:
  - Mobile nav / slide-over .............. `client:idle`
  - Pricing size-selector (segmented) .... `client:visible`
  - Zip-code validator ................... `client:visible`
  - Before/after slider(s) ............... `client:visible`
  - FAQ accordion ........................ `client:visible` (or static <details>)
  - Cal.com embed ........................ `client:visible` / load-on-click
  Everything else (hero copy, value props, how-it-works, footer, etc.) is static HTML.
- shadcn-vue in Astro is slightly manual vs the Nuxt CLI: add components under
  `src/components/ui/`, set up `components.json` + the `@/*` path alias, and import
  them inside `.vue` island files. You own the component source (AI-friendly).
- SINGLE PAGE ONLY (anchored sections) — confirmed scope. No multi-page routing.
    Per-city SEO landing pages are ROADMAP only (SEO_STRATEGY.md §A8), not built now.
    (A custom 404 is the only other route.)

================================================================================
2. BRAND & DESIGN SYSTEM
================================================================================

Theme: premium, sleek, modern, dark, high-performance. Explicitly avoid the
"cheap car wash" look (no neon gradients, no clip-art, no stocky suds imagery).

2.0 Design principles — modern & simple [NEW]
  "Simple" is a discipline, not a style. Enforce restraint:

- ONE accent color (premium sapphire blue). Everything else is the neutral blue-gray scale.
- Let whitespace + large type carry the layout; avoid decorative borders/dividers
    (use spacing + subtle elevation + the metallic-depth treatment instead).
- Deep cool blue-black surface (#06080F), never pure #000; layered elevation creates depth.
- Restrained metallic/gloss "3D" depth — anodized (tinted toward the brand blue), NEVER literal
    chrome. ~95% of surfaces stay matte; spend the "shine budget" on a few moments only (see §2.3).
- Real car photography is the primary visual; no gradient-on-gradient, no neon, no clip-art.
- Few elements per screen; one clear primary action per section.
- Motion is subtle and purposeful (see §2.4); touch-first — most users are iPhone (see §2.5).

2.1 Color tokens [CHANGED 2026-06-19 — premium blue/black ramp; contrast computed; Tailwind v4 `@theme`]
  Define in `src/styles/global.css` inside `@theme { … }`. Tailwind v4 requires the
  `--color-` prefix; these auto-generate utilities (`bg-bg`, `bg-bg-elevated`,
  `text-text`, `text-text-muted`, `border-border`, `text-brand`, …):
    --color-bg            #06080F   (deep cool blue-black surface, NOT pure #000 — makes the
                                      metallic sheen/highlights pop; text 18.7:1)
    --color-bg-elevated   #0D1019   (cards, nav, elevated surfaces)
    --color-bg-elevated-2 #151926   (2nd elevation step — nested/raised surfaces, layered depth)
    --color-border        #222838   (decorative hairline)
    --color-border-bright #39445C   (decorative top-bevel highlight on metallic elements)
    --color-text          #F4F7FF   (primary body text — 18.7:1 on --color-bg)
    --color-text-muted    #A4AEC4   (secondary text — 9.0:1 on --color-bg)
    --color-brand         #1E5FFF   ("Deep electric" — owner pick; accent: icons, borders, focus,
                                      headings ≥24px + CTA fill; white 5.08:1 ✓, 3.94:1 on bg)
    --color-brand-strong  #1E5FFF   (CTA FILL = brand; the picked blue is vivid yet white-text-safe)
    --color-brand-deep    #1340A8   (deep floor / pressed state — white 9:1)
    --color-brand-bright  #5B8CFF   (highlight / bevel sheen — edges ONLY, never behind text)
    --color-brand-hover   #1A52E6
    --color-brand-tint    rgba(30,95,255,0.12)  (subtle fills, badges, focus rings)
    --color-success       #22C55E   (in-area validation)
    --color-warning       #F59E0B
  RULES (WCAG AA — verified by computation):
  • White button/label text sits on --color-brand / --color-brand-strong (#1E5FFF, 5.08:1) or
    darker — NEVER on --color-brand-bright (too light).
  • Brand blue is for LARGE elements only — icons, borders, CTA surfaces, headings ≥24px
    (≥3:1 bar). Never brand blue for body text. Body copy = --color-text / --color-text-muted.
  • --color-border* are DECORATIVE. A border that is the sole boundary of an interactive control
    needs its own ≥3:1 treatment + a visible :focus-visible ring (--color-brand).
  • sRGB hex is safe on Display-P3 iPhones; an optional color(display-p3 …) override behind
    @media (color-gamut:p3) is later polish, not required. Pure #000 reserved for nothing.

2.2 Typography [CHANGED — locked to Outfit, site-wide]

- One typeface everywhere: Outfit (geometric sans — modern + clean). OSS (OFL).
- Self-host the VARIABLE font via Fontsource: `@fontsource-variable/outfit`
    (no Google CDN — faster, privacy-friendly, fully OSS). One variable file covers
    all weights; `preload` it, `font-display: swap`, subset to latin.
- Fallback stack to prevent layout shift:
    `"Outfit Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Scale (mobile → desktop): h1 32→56, h2 26→40, h3 20→24, body 16, small 14.
    Body 1.6 line-height; keep paragraphs ≤3–4 lines (scannable).
- Weights: headings 600–700, body 400, UI/labels 500. Headings tight tracking;
    generous section padding (py-16 mobile / py-24+ desktop).

2.3 Component aesthetic [CHANGED 2026-06-19 — metallic/gloss depth, restrained]

- Soft large-radius cards (rounded-2xl); depth from LAYERED ELEVATION + a subtle bevel, not
    decorative borders. `.surface-raised` = inset top highlight + inset bottom shade + ONE modest
    outer shadow (e.g. `inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.6),
    0 8px 24px rgba(0,0,0,.45)`). Avoid large negative spreads; don't stack 3–4 shadows per card.
- "Shine budget" [CHANGED 2026-06-19 — owner prefers a MATTE UI] — gloss is RARE: a STATIC radial
    sapphire glow behind the hero image, the glass nav (§2.5), and one chrome-like hairline divider.
    The CTA and the "Most Popular" badge are MATTE. The real "shine" is the glossy CAR PHOTOGRAPHY
    itself — the UI stays matte so the cars pop.
- Primary CTA = `.btn-metal` [CHANGED — matte]: MATTE solid sapphire (`--color-brand-strong`) + a
    faint top sheen + a subtle bevel (inset top highlight + bottom shade) for depth + a restrained
    drop shadow; `rounded-2xl`. NO gloss / specular sweep. Hover (pointer only) = a subtle lift;
    `:active` = scale .98. White label on --color-brand-strong or darker. Secondary = ghost/outline.
    All ≥44×44px. [KEEP sizing]
- Metallic gradients tint toward the brand blue (anodized), NEVER white→gray chrome — chrome-
    everything is the "cheap car wash" tell. Gradient BORDERS use the padding-box/border-box
    double-background trick (no extra DOM). Avoid gradient TEXT (`background-clip:text`) — it needs
    `-webkit-` guards or it goes invisible on older iOS.
- Consistent iconography — ONE set (Lucide), inline SVG for speed. Animated icons = **NO LIBRARY**:
    animate the inline Lucide SVGs with CSS (transform/opacity + `stroke-dashoffset`) + the
    already-budgeted Motion One for the one choreographed checkmark (0 KB new JS; Lucide ISC +
    Motion One MIT). Restrained set: hamburger↔X morph (nav), checkmark draw-on (zip-in-area), subtle
    hover micro-motion on the 4 value-prop icons (desktop pointer only). Utilities `.menu-icon` /
    `.icon-draw` / `.icon-hover`; SVG-on-iOS rules in §2.5. No Lottie/dotLottie/Rive/Lordicon
    (weight/licensing) — `@lottiefiles/dotlottie-wc` is only a future below-the-fold fallback.

2.4 Motion / animation strategy [CHANGED 2026-06-19 — premium motion system; minimal JS; touch-first]

  Motion tokens (define as CSS custom properties in `@theme`/`global.css`; M3/NN-g-derived) — use
  these everywhere so motion reads consistent ("premium"), not ad-hoc:
    Easing: `--ease-standard cubic-bezier(.2,0,0,1)` (default in-view UI), `--ease-out
      cubic-bezier(0,0,0,1)` (entrances), `--ease-in cubic-bezier(.3,0,1,1)` (exits),
      `--ease-emphasized cubic-bezier(.05,.7,.1,1)` (signature settle: hero glow / large reveals),
      `--ease-snappy cubic-bezier(.3,0,.2,1)` (tap/press). Entrances DECELERATE; no bounce/overshoot.
    Duration: `--dur-instant 100ms`, `--dur-fast 150ms` (hover/focus/underline), `--dur-base 250ms`
      (card lift/accordion), `--dur-slow 350ms` (section reveal/drawer/zoom), `--dur-slower 500ms`
      (MAX — hero, large reveals). Entrances slightly longer than exits.

- Baseline (zero/near-zero JS): CSS transitions + keyframes on `transform` and
    `opacity` only (GPU-composited); `IntersectionObserver` to trigger scroll-reveal
    fades/slides; smooth anchor scroll (gate behind `prefers-reduced-motion: no-preference`, with
    `scroll-padding-top` for the sticky header); subtle button hover-lift (matte — no gloss sweep).
- CTA feedback (most users are iPhone, which has NO hover): gate the hover-lift behind
    `@media (hover:hover) and (pointer:fine)` so it never "sticks" on touch; `:active` gives a quick
    press (scale .98) for tap feedback. The CTA is matte — no specular sweep.
- Section/page transitions: Astro `<ClientRouter />` (free, no library; on Astro 6 the
    old `<ViewTransitions />` is removed — `<ClientRouter />` is the only option). Native on iOS 18;
    older iOS degrades gracefully (`fallback="animate"`); `transition:persist` the sticky bar/nav.
    (For a truly single-page site, evaluate whether ClientRouter earns its JS vs. anchor scrolling.)
- Richer in-island reveals: INCLUDE Motion One (~5KB, Web Animations API) for choreographed
    `whileInView` reveals inside Vue islands (decision locked). `@vueuse/motion` (<20KB,
    Vue-native) is the alternative. Keep it to transform/opacity, honor reduced-motion, and
    count its weight against the JS budget. Do not pull in heavy animation libs.
- HARD RULE: honor `prefers-reduced-motion: reduce` → REDUCE, never DELETE (keep the final visible
    state — `opacity:1` / identity transform; a blanket `animation:none` can leave fade-in elements
    invisible). Never animate `box-shadow`/gradients on scroll (large shadow blur ≈ heavy paint).
- Never animate layout-affecting props (width/height/top/left) — only
    transform/opacity — to protect CLS and frame rate.
- Where motion applies (restrained — NOT everything moves): scroll/section reveal (fade + rise
    ≤16px, stagger 60–80ms, cap ~8–12 items), sticky header show/hide, mobile drawer in/out, button
    hover-lift + `:active` press, link underline, card lift (≤ scale 1.05), gallery image hover zoom,
    accordion, form-field focus, zip-success checkmark, sticky action-bar entrance, the CTA
    hover-lift + press, and ClientRouter page transitions.
- Premium principles: one restrained signature (the hero glow + staggered reveals — UI stays
    matte); consistency via the tokens above; subtle distances;
    disable hover effects on touch (`@media (hover:hover) and (pointer:fine)`) while keeping
    tap/press feedback; motion serves meaning. CSS scroll-driven animations
    (`animation-timeline: view()`) are Safari-26-only → IntersectionObserver stays the baseline;
    layer scroll-timeline only behind `@supports` (see §2.5).

2.5 Mobile & iOS rendering rules [NEW 2026-06-19 — audience is mostly iPhone]
  Every effect above is iOS-Safari-first. Encode these as DEFAULTS so they aren't "found" in QA:

- Glass nav (#1 iOS risk): emit `-webkit-backdrop-filter` BEFORE `backdrop-filter` (Tailwind has
    historically dropped the prefix — verify it's in the BUILT CSS). NEVER nest blur — a blurred nav
    over a blurred hero/card hits the iOS 18 "renders solid / no blur" regression (and historically
    crashed iPhones); the hero glow is a background gradient, not a backdrop-filter, so it's safe.
    Ship a SOLID translucent baseline (`rgba(13,16,25,.85)`) as default + fallback; treat blur as a
    progressive `@supports` enhancement at radius 8–14px; add `transform: translate3d(0,0,0)` to
    stabilize stale-blur-on-scroll; keep the nav top-anchored (nothing blurred at `bottom:0`).
- Sticky [Book][Call] bar vs the home indicator: `viewport-fit=cover` in the viewport meta AND
    `padding-bottom: max(12px, env(safe-area-inset-bottom))` on the bar; reserve body bottom padding
    so content isn't hidden; apply the inset to inner content (not a translateY-animated wrapper).
- Hero height: `min-height:100vh` then `min-height:100svh` (svh fits under the iOS URL bar; iOS
    15.4+). Never size the hero with bare `100vh`.
- iOS input auto-zoom: form/zip inputs use `font-size:16px` (Tailwind `text-base`); NEVER
    `maximum-scale=1` / `user-scalable=no` (breaks pinch-zoom / WCAG 1.4.4).
- Tap targets ≥44×44 CSS px; `-webkit-tap-highlight-color: transparent` PLUS a custom `:active`
    + `:focus-visible` (replace the default flash, don't just remove feedback).
- Hero image: `<Picture formats={['avif','webp']}>` → iOS 16+ gets AVIF, 14–15 gets WebP. AVIF
    DECODES slower (LCP risk on older iPhones) → cap AVIF quality and MEASURE LCP on a real
    mid-tier iPhone; if it regresses, serve WebP-only for the hero (keep AVIF for the gallery).
- Font preload: `<link rel="preload" as="font" type="font/woff2" crossorigin>` — `crossorigin` is
    mandatory even same-origin on Safari (else ignored / double-downloaded); preload URL must
    exactly match the `@font-face src`; woff2-only; `font-display:swap` + metric-similar fallback.
- Cal.com embed: load-on-click facade (§4.9) is the iOS-safe path (defers heavy embed.js, avoids
    auto-scroll-on-load + double-scroll); use Cal's mobile/column layout, `width:100%`, no nested
    scroll container; `overscroll-behavior:contain` on any scroll wrapper.
- Animated SVG icons (no library — §2.3): set `transform-box: fill-box; transform-origin: center`
    (iOS pivots SVG transforms around the wrong origin without it); stroke "draw-on" uses
    `pathLength="1"` + `stroke-dasharray` with ≥2 values (Safari rescales dash math on zoom / can
    draw backwards); explicit `width`/`height` on every animated SVG (no CLS); `will-change:transform`
    applied just before animating, removed after. Reduced-motion jumps to the final state (use
    `0.01ms`, not `0`, so reveal/`transitionend` callbacks still fire).
- CSS scroll-driven animations (`animation-timeline: view()`) shipped only in Safari 26 (2025) →
    keep IntersectionObserver as the baseline; layer scroll-timeline behind `@supports` (progressive).
- Consolidated viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1,
    viewport-fit=cover">`.
- Confirmed safe on current iOS (no action): conic/linear/radial gradients + the gradient-border
    trick (12.2+), inset+outer box-shadows (the 13.4 black-bar bug is fixed), Outfit variable font
    (11+), `prefers-reduced-motion` reflecting the iOS Reduce-Motion toggle (10.3+), sRGB on P3.

================================================================================
3. CONVERSION STRATEGY (applies across all sections)
================================================================================

3.1 Three CTA paths, always available [NEW — fixes v1's single-path leak]

  1) BOOK  → anchors to Cal.com scheduler (high intent).
  2) QUOTE → short form / instant-estimate (low friction; for the not-ready-yet
     majority). Captures name + phone + vehicle; submitted via Web3Forms (emails the
     owner — no backend). Follow-up is MANUAL at launch (no automated SMS yet), so set
     honest expectations in copy: "we'll call or text you back within [X] hours."
  3) CALL  → tel: link with a (call-tracking) number; many local buyers prefer phone.
  Optionally a "Text us" sms: link.

3.2 Sticky mobile action bar [NEW]
  Fixed bottom bar on mobile only: [ Book ]  [ Call ]  — always within thumb's
  reach (CRO best practice). Hidden on desktop (header CTA suffices).

3.3 Trust-signal placement [CHANGED — move proof UP]

- COLD-START (launch): no Google reviews yet → do NOT show a numeric rating row or
    fabricate reviews. Lead the hero with credibility instead: the trust strip
    "100% self-contained · Same-day slots · Insured & vetted", the satisfaction guarantee,
    certifications / founder experience, real before/after work, and brand-product logos.
    Swap the "5.0 ★ · NN Google reviews" rating row INTO the hero once genuine GBP reviews exist.
- "100% self-contained · Same-day slots · Insured & vetted" trust strip under hero CTAs.
- Satisfaction guarantee badge near pricing AND near booking.
- Before/after gallery (and real testimonials, once collected) before the booking section
    so trust peaks right before the ask.

3.4 Analytics & events [NEW]

- Umami (free cloud tier or self-host; cookieless → no consent banner; ~2KB script) — tracks
    pageviews AND custom events via `umami.track(...)`: book_click, quote_submit, call_click,
    zip_checked, pricing_tab_changed. (Chosen over Cloudflare Web Analytics, which tracks only
    pageviews/Web Vitals and CANNOT fire custom events; Plausible/GA4 remain alternatives.)
- Call-tracking number for offline-attribution.
- Retargeting pixel (Meta/Google) is OPT-IN only — non-OSS + extra third-party JS;
    skip unless running paid ads.

================================================================================
4. SECTION-BY-SECTION COMPONENT PLAN
================================================================================

4.1 HEADER / NAV  [KEEP + small adds]

- Sticky, `backdrop-blur`, --color-bg/80 translucent.
- Left: logo ("ELITE MOBILE CAR DETAILING" placeholder).
- Center (desktop only): Services, Pricing, Our Work, Service Area, How It Works,
    FAQ.  [CHANGED: smooth-scroll anchors to on-page sections; logo = back to top.
    Every link maps to a real section — see consistency rule]
- Right: primary blue CTA "Book Now" (all devices).
- Mobile: accessible hamburger (`aria-expanded`, `aria-controls`, focus trap
    in the open panel, Esc to close) → slide-over panel. [CHANGED: a11y specifics]

4.2 HERO (above the fold)  [CHANGED — proof + media + call]

- Headline: "Showroom Shine. Delivered to Your Driveway." (premium, benefit-led)
    (v1's "Premium Mobile Detailing. Brought Right to Your Texas Doorstep." is a
    fine alternative — Open Decision.)
- Subheadline: "Elite mobile detailing across Richardson & the DFW metro. Our
    fully self-contained rigs bring their own water and power — so we can detail
    your car at home or the office, no hookups needed."
- Credibility [CHANGED — cold-start]: at launch (no reviews yet) the slot where the star
    rating would go shows the trust strip (below) + the satisfaction-guarantee badge — NOT a
    star rating. Reserve the "★★★★★ 5.0 · NN Google reviews" rating row to swap in once genuine
    GBP reviews exist — never fabricate it.
- CTAs: Primary "Book Your Detail" (→ booking). Secondary "Get a Free Quote"
    (→ quote). Tertiary tap-to-call on mobile. [CHANGED: quote + call added]
- Trust strip (under CTAs; canonical wording site-wide): "100% self-contained · Same-day
    slots · Insured & vetted".
- Media [CHANGED — single image for LCP]: ONE stunning, optimized AVIF/WebP shot of a
    finished car or the self-contained rig — preloaded as the LCP element (fastest, safest).
    NOT a video and NOT the before/after slider (those live in the gallery, §4.6, to keep the
    hero light). Authentic photo, not stock. Preload only this hero image; everything else lazy.
- Layout: stacked on mobile; 2-col (copy | media) on desktop. [KEEP]

4.3 VALUE PROPOSITION — "Why Choose Elite?"  [KEEP, copy tightened]
  Four badge cards (1-col → 2-col → 4-col):

   1) "100% Self-Contained Units" — Onboard water + power. Perfect for apartments
      and office parking. (Pair with a small photo of the rig.)
   2) "DFW Detailing Experts" — 50-mile Richardson radius. Certified, vetted,
      fully insured.
   3) "Advanced Paint Protection" — Decontamination, clay bar, multi-year ceramic
      coatings.
   4) "Weather-Flexible Booking" — Texas weather shifts fast; reschedule in a tap.

4.4 PRICING MATRIX  [CHANGED — less tapping, ceramic = quote]

- KEEP transparent pricing (a real edge — a major DFW competitor hides prices
    and it reads as friction).
- Vehicle-size selector → INSTANT ESTIMATOR [NEW decision]: touch-friendly segmented
    control (Coupe/Sedan · Medium SUV/Crossover · Large Truck/3rd-row SUV). Persist the
    choice across all cards; default to Sedan. For tiers A & B, selecting a size shows the
    EXACT price prominently with a "Book this detail" CTA that scrolls to `#book` — a
    transparent instant estimate (reduces quote-form friction). Tier C (Ceramic) is the
    exception: it shows its tiered "from" ranges (3-yr / 9-yr) and a "Request a Custom Quote"
    CTA — NO instant exact price (needs an inspection). Still list all three sizes in small
    text per card. (One small Vue island — see §1; add `aria`.)
- Three tiers (Good / Better / Best — tiering lifts avg ticket 15–25%):
      A) "The Standard Reset" — Sedan $125 · Med SUV $150 · Truck $175.
         Hand wash, gloss protection, tire dressing, interior deep vacuum,
         dashboard wipe-down.
      B) "The Elite Signature"  [MOST POPULAR badge] —
         Sedan $225 · Med SUV $260 · Truck $300.
         Full exterior wash, clay bar, iron decontamination, interior steam
         sanitization, leather clean & condition, protective wax.
      C) "The Ceramic Showroom Upgrade" — TIERED so customers self-select before the
         quote [CHANGED — was a single "from $650"; that anchored below the DFW market]:
         e.g. "3-year coating from $650 · 9-year coating from ~$1,500" (owner confirms
         exact products/prices; DFW 9-yr coatings run ~$1,500–$2,000). CTA = "Request a
         Custom Quote" (NOT instant-book) — this tier needs an inspection to price correctly.
- Per-card CTA: A & B → "Book This Package"; C → "Request Quote".
- Add-ons note [CHANGED — fixes the "high-margin" copy leak]:
      "Add extras at checkout: Pet Hair Removal ($50) · Odor Elimination ($60)."
- Satisfaction-guarantee line beneath the grid.

4.5 HOW IT WORKS — 3 steps  [CHANGED — payment reframed]

   1) Pick your package & vehicle size online.
   2) We come to you — our self-sufficient rig arrives at your DFW home or
      office. No water or power needed from you.
   3) Inspect & pay on completion — secure card / contactless / Apple Pay
      (cash also welcome). [CHANGED: was "Pay Cash"; premium audience pays card]

4.6 OUR WORK — gallery (images + video)  [EXPANDED — must look beautiful]
  Purpose: the strongest trust driver in detailing — a premium, scannable portfolio
  of real results. Anchor id `#work`; linked in nav.
  Content:

- Before/after PAIRS via an interactive comparison slider (drag handle); diverse
    vehicles (sedan, luxury, SUV, truck) and services (interior, exterior, ceramic).
- A few short VIDEO clips (10–20s reveal / process), muted, with a poster image.
- Optional light filter chips (All · Interior · Exterior · Ceramic) — keep it simple.
- Captions: vehicle + city + package ("BMW X5 · Plano · Elite Signature") — doubles
    as SEO/alt content.
  Layout & feel (modern & simple):
- Responsive grid/masonry, generous gaps, rounded-2xl tiles, subtle hover zoom on
    `transform` only; consistent aspect ratios to avoid CLS.
- Click a tile → lightbox (images + video) for a larger view.
  Performance (light is mandatory):
- Images via `astro:assets` → AVIF/WebP, responsive `srcset`, explicit dimensions,
    `loading="lazy"` (gallery is below the fold).
- Before/after slider: `img-comparison-slider` web component (MIT) or a tiny vanilla
    component — hydrate as an island only when the section scrolls into view.
- Lightbox: GLightbox (MIT — image + HTML5/YouTube/Vimeo video) or SimpleLightbox
    (<3KB) — lazy-load on first interaction.
- Video: self-host compressed MP4/WebM with `preload="none"` + poster + click-to-play
    (no autoplay of heavy files); OR a lazy YouTube/Vimeo FACADE (lite-youtube-embed, MIT)
    so the heavy player loads only on click. (NOTE: the hero is now a single still image,
    so there is NO autoplay video on the page — all gallery video is click-to-play. If a
    muted autoplay loop is ever reintroduced, allow at most one site-wide and respect
    `prefers-reduced-motion` + Save-Data.)
  Accessibility: alt text on every image; lightbox keyboard-navigable + Esc to close;
  slider operable by keyboard; captions as real text, never baked into images.

4.7 SOCIAL PROOF  [CHANGED — real, richer; cold-start aware]

- COLD-START (launch, no reviews yet): build this section from credibility that's true
    today — "100% Satisfaction Guarantee" callout, insured/certified badges, founder/
    experience story, real before/after work (§4.6), and product/brand trust logos
    (only ones actually used). Do NOT fabricate review cards or a star count.
- Once genuine Google reviews exist: add 5-star review cards with name + city + vehicle
    (e.g., "Sarah K., Plano · BMW X5"), emphasizing punctuality, convenience, results;
    embed/screenshot real Google reviews and link to the Google Business Profile; only
    then add the hero rating row + AggregateRating schema (SEO_STRATEGY §A4 caveat).
- Product/brand trust logos (e.g., Ceramic Pro, Chemical Guys, Meguiar's) —
    only ones actually used. [NEW]

4.8 SERVICE AREA + ZIP VALIDATOR  [CHANGED — graceful, not a wall]

- Internal JS array maps DFW cities → zip codes (50-mi Richardson radius).
- Input + check: in-area → success ("✓ You're in our DFW service zone —
    booking's open below"). Use icon + text + color, not emoji-only (a11y). [CHANGED]
- OUT of area → don't dead-end: "We're expanding — leave your email and we'll
    notify you," or show the nearest covered city. [NEW]
- Progressive enhancement: booking + quote remain reachable even if JS/zip
    check is skipped (never gate conversion behind the validator). [CHANGED]
- Plain-text coverage list alongside (Dallas, Plano, Frisco, McKinney, Allen,
    Garland, Carrollton, Irving). [KEEP]
- Inject Schema.org LocalBusiness JSON-LD with service-area geo bounds. [KEEP]

4.9 BOOKING SECTION — Cal.com  [CHANGED — lazy + fallback + qualifying flow]
  Tool decision: Cal.com is the recommended scheduler (see "Why Cal.com" below).

- Reassurance copy above the widget: "Book free online. No card required up
    front — pay securely on-site after your detail, only when you're 100% happy." [KEEP]
- Capture the right info in Cal.com (no custom backend needed) — FREE-TIER approach
    [CHANGED: routing forms are a PAID Cal.com feature, so we don't rely on them]:
  - Use ONE event type ("Mobile Detail") with BOOKING QUESTIONS that collect: package,
      vehicle size, name, phone, vehicle (year/make/model), service address, notes. This
      gives the detailer everything to arrive prepared, on the free plan, no routing form.
  - The instant estimator (§4.4) already does the package + size "routing" on-page before
      the customer reaches Cal.com.
  - UPGRADE PATH (later, ~$15/mo): paid Cal unlocks Routing Forms (auto-route to per-package
      event types) + SMS confirmation/reminder workflows. Adopt if no-shows become a problem.
- Embed: Cal.com inline embed (HTML snippet) inside a responsive wrapper with explicit
    height handling (no double-scroll on mobile). (Cal "Atoms"/React is an option, but the
    HTML embed keeps us framework-light.) [KEEP]
- LAZY-LOAD the Cal.com script/iframe (on click or scroll-into-view) — heavy third-party;
    eager load hurts LCP. `<!-- EMBED CAL.COM INLINE SCHEDULER HERE (lazy) -->` [NEW]
- No-shows [DECISION]: DEFAULT = no deposit (keep the "no card up front" promise). At
    launch, rely on Cal.com's free EMAIL confirmation. SMS reminders (the better no-show
    cut) need paid Cal — documented as a future upgrade, DISABLED for now. A Stripe deposit
    via Cal+Stripe is the heavier option but contradicts the no-card promise; keep off.
- Fallback under the widget: "Prefer to talk? Call/text {{PHONE}}." + show
    "next available: same-day" urgency if feasible. [NEW]

  Why Cal.com (free / open-source / best UI — answers "is Cal the best?"):

- Open-source (AGPLv3), self-hostable for fully-OSS, OR a genuinely usable FREE cloud
    tier: unlimited event types, embeddable, and booking questions on free. NOTE: routing
    forms and SMS workflows are PAID (~$15/mo) — we use the free event-type + booking-
    questions approach above and treat routing/SMS as an optional upgrade. Best-looking of
    the open-source schedulers → ✔ best fit for this site's constraints.
- Alternatives if priorities change (documented, NOT chosen):
  - Square Appointments — free + integrated on-site card payments (Square reader); not OSS.
  - Easy!Appointments — 100% free + open-source, self-host; UI more basic than Cal.com.
  - Detailing ops platforms (Zenbooker, Urable, StartMyDetail, Jobber) — purpose-built
      (vehicle pricing, route optimization, CRM, invoicing) but PAID SaaS, not free/OSS;
      overkill for a single marketing page. Consider only if you want full back-office software.

4.10 FAQ  [NEW SECTION — fixes nav inconsistency]
  Accordion (semantic <details>/<summary> or accessible disclosure). Seed Qs:

- Do you need access to my water/electricity? (No — self-contained.)
- How long does a detail take?
- What if it rains / Texas weather? (Reschedule policy.)
- Where do you detail — driveway, apartment, office garage?
- How do I pay? (Card/contactless/Apple Pay/cash on completion.)
- Cancellation/reschedule window.
- How long does ceramic coating last?
  Add FAQPage JSON-LD for rich-result eligibility. [NEW]

4.11 MEMBERSHIP & FLEET  [DECISION: POST-LAUNCH ROADMAP — not at launch]

Both deferred to keep the launch laser-focused on the single-detail 3-CTA flow. "Post-launch
roadmap" = a future product iteration AFTER the build phases 0–10 ship — NOT build Phase 2
(which is the design system). Documented here for that later iteration:

- Membership: monthly maintenance plan (recurring wash + protect) → recurring
    revenue, common in detailing.
- Fleet / corporate accounts: leans into the office/apartment self-contained
    angle and the busy-professional target. Simple "Contact for fleet pricing" CTA.
- Light hooks for gift cards / referral / seasonal promo (footer or banner).

4.12 FOOTER  [KEEP + adds]

- Columns (stack on mobile): Service areas · Contact (phone, email, hours) ·
    Quick links · Social icons · Legal.
- NAP (Name/Address/Phone) consistent with Google Business Profile (local SEO).
- Click-to-call phone, mailto email. Copyright + privacy/terms links.

CONSISTENCY RULE: every nav link resolves to a real on-page section (or page),
and CTA wording is consistent site-wide: "Book Your Detail" / "Get a Free Quote"
/ "Call". No orphan links, no synonyms drift.

================================================================================
5. SEO & STRUCTURED DATA  [CHANGED — full strategy in SEO_STRATEGY.md]
================================================================================

Scope = LEAN: one landing page optimized to the max + complete on-site technical/
schema SEO. City pages + blog are documented as a ROADMAP in SEO_STRATEGY.md §A8 —
NOT built initially (mass near-duplicate city pages risk a doorway-page penalty).

>> The complete, research-backed plan (US local SEO) lives in `SEO_STRATEGY.md`:
   Part A = on-site (build), Part B = off-site owner playbook (GBP/reviews/citations).
   For a mobile detailer, GBP + the Map Pack is the #1 driver — the site is necessary
   but not sufficient. This section is the build-relevant summary.

On-page (single page):

- ONE <h1> (primary keyword, natural); logical h2/h3 order; clean anchor ids.
- Title ~50–60 chars + meta description ~150–160 chars (benefit + DFW + CTA).
- Open Graph + Twitter cards with a real branded image.
- Descriptive image filenames + alt; concise, quotable FAQ answers (AI Overviews).
- Footer NAP + click-to-call; identical to GBP byte-for-byte.

Technical:

- `@astrojs/sitemap`, robots.txt (reference sitemap), self-referencing canonical,
  single en-US (no hreflang), force HTTPS + one host, custom 404, mobile-first.
- Core Web Vitals per §6 (Astro zero-JS baseline). One reusable SEO/JSON-LD head
  component, set via props.

Structured data (JSON-LD — full examples in SEO_STRATEGY.md §A4):

- `AutoWash` (AutomotiveBusiness < LocalBusiness) in SERVICE-AREA form: omit
  streetAddress; `areaServed` cities + `GeoCircle` (50 mi); `geo` (≥5 decimals);
  `+1` telephone; ISO `openingHoursSpecification`; `priceRange`; `sameAs` (GBP/social).
- `Service` per package; `FAQPage` (§4.10); `Organization` + `WebSite`.
- ⚠ AggregateRating/Review: self-hosted self-reviews do NOT earn star rich results
  (stars come from GBP). Mark up only genuine on-page reviews; never fabricate.

================================================================================
6. PERFORMANCE  (Astro SSG on Cloudflare Pages)
================================================================================

- Zero-JS baseline: Astro renders static HTML; the only JS shipped is the islands
  listed in §1, each with the lightest viable hydration directive
  (`client:idle` / `client:visible` / load-on-click). Audit that nothing static is
  accidentally hydrated.
- Tailwind v4 via `@tailwindcss/vite` → minimal CSS (content auto-detected, no purge step). NO CDN Tailwind.
- Images via `astro:assets` (`<Image>`/`<Picture>`): WebP/AVIF, responsive `srcset`/
  `sizes`, explicit width/height (no CLS), lazy below the fold. Preload only the hero.
- Cal.com embed lazy-loaded (island, on scroll-into-view or click) — §4.9.
- Self-host Outfit variable font (Fontsource), `preload` + `font-display: swap`.
- Astro inlines critical CSS automatically; keep third-party scripts (analytics) deferred.
- Targets: LCP < 2.5s, CLS < 0.1, mobile Lighthouse ≥ 90.

================================================================================
6b. OPEN-SOURCE TOOLCHAIN & LICENSES
================================================================================

- All-OSS by requirement. Core: Astro (MIT), Vue + `@astrojs/vue` (MIT),
  Tailwind CSS (MIT), shadcn-vue + Reka UI v2 (MIT).
- Font: Outfit (SIL OFL), delivered via Fontsource (MIT tooling).
- Animation (included): Motion One (MIT) for in-island reveals; `@vueuse/motion` (MIT) alt.
- Icons: Lucide (ISC).
- Gallery (§4.6): GLightbox (MIT) or SimpleLightbox (MIT) for the lightbox;
  `img-comparison-slider` (MIT) for before/after; lite-youtube-embed / lite-vimeo
  (MIT) video facades. (Avoid lightGallery — GPLv3/paid-commercial license.)
- Booking: Cal.com is OPEN SOURCE but AGPLv3 (copyleft). Embedding the widget is
  fine; AGPL only matters if you fork/modify Cal.com's own code. We use the FREE cloud
  tier (event type + booking questions); for a fully-OSS stack you may self-host Cal.com.
- Hosting: Cloudflare Pages (free static hosting). Quote form via Web3Forms (free; a
  third-party service) OR a Cloudflare Pages Function + Resend (fully in-house). Netlify +
  Netlify Forms is an equivalent alternative. Analytics: Umami (free, cookieless, custom
  events; cloud tier or self-host — self-hosting is fully OSS); Plausible / GA4 remain alternatives.

================================================================================
7. ACCESSIBILITY  (WCAG 2.1 AA)
================================================================================

- Color contrast ≥ 4.5:1 body / 3:1 large text (palette in 2.1 is built for this).
- Semantic landmarks: <header><nav><main><section><footer>; one <h1>.
- Keyboard: visible focus rings (brand-tint), logical tab order, hamburger focus
  trap + Esc, accessible accordion for FAQ.
- ARIA: label the hamburger, the zip input, the size selector (role/aria-pressed),
  and the before/after slider.
- Don't rely on emoji/color alone to convey state (pair with text + icon).
- Respect `prefers-reduced-motion`.
- All images have meaningful alt text (decorative = alt="").

================================================================================
8. COPY (rewritten — drop-in)
================================================================================

- Tagline / brand wordmark (header + footer, OG/meta, JSON-LD slogan): "No hookups. No hassle. Just shine."
- Hero H1: "Showroom Shine. Delivered to Your Driveway."
- Hero sub: "Elite mobile detailing across Richardson & the DFW metro. Our fully
  self-contained rigs carry their own water and power — so we detail your car at
  home or the office, with zero hookups needed."
- Hero trust strip: "100% self-contained · Same-day slots · Insured & vetted"
- Primary CTA: "Book Your Detail"   Secondary CTA: "Get a Free Quote"   Mobile: "Call"
- Booking notice: "Book free online. No card required up front — pay securely on
  site after your detail, only when you're 100% satisfied."
- Quote-form note (honest — follow-up is manual at launch): "Tell us about your vehicle
  and we'll call or text you back with a quote within [X] hours." (Set [X] to a window the
  owner can actually hit; no automated SMS yet.)
- Add-ons (FIXED leak): "Add extras at checkout: Pet Hair Removal ($50) · Odor
  Elimination ($60)."  (v1 said "high-margin add-ons" — never ship internal language.)
- Step 3 (FIXED): "Inspect & pay on completion — card, contactless, or Apple Pay
  (cash welcome too)."
- Zip success: "✓ You're in our DFW service zone — booking's open below."
- Zip out-of-area: "We're expanding fast — drop your email and we'll let you know
  the day we reach you."
- Guarantee: "100% Satisfaction Guarantee — if it's not right, we make it right."

================================================================================
9. OPEN DECISIONS FOR THE OWNER (supply before build)
================================================================================

Settled (see DECISIONS LOCKED at top): stack (Astro 6 + shadcn-vue islands), host
(Cloudflare Pages + Web3Forms), analytics (Umami), Cal.com (free
tier), font (Outfit), animation (Motion One), hero media (single image), social-proof
cold-start, instant estimator, ceramic = tiered, Membership/Fleet = post-launch roadmap, brand =
"Elite…" + tagline "No hookups. No hassle. Just shine." (Option B; `BRANDING_OPTIONS.md`),
design direction = premium blue/black + restrained metallic depth, mobile/iOS-first (§2.1–§2.5).

Still needed FROM THE OWNER (data/assets — supply before launch):

- Real phone number (ideally a call-tracking number) + email + exact hours.
- Real before/after photos + ONE hero image (authentic, not stock) + short clips for the gallery.
- Exact ceramic products + tiered prices (e.g. 3-yr / 9-yr) to confirm the §4.4 range.
- Which product brands to display (only ones actually used).
- Quote-form follow-up window [X] hours the owner can reliably hit.
- LATER (not blocking launch): real Google rating + review count — to enable the hero
  rating row + AggregateRating schema once genuine GBP reviews exist.

================================================================================
RESEARCH BASIS (why these changes)
================================================================================

- DFW competitors studied: Xceptional Details (hides pricing, near-zero social
  proof — what NOT to do), Auto Detailing Aura (transparent "from" pricing,
  "5.0 · 198+ reviews" in hero, 100+ before/afters, satisfaction guarantee,
  brand logos, per-city pages — the benchmark), Panda Hub, CarDetailing2Go.
- 2025 detailing web trends: before/after sliders as a hero element (~2×
  conversion; authentic photos ~+30% bookings), 2–3 color minimalist dark
  themes, mobile-first (one shop tripled mobile bookings post-redesign),
  real-time scheduling + SMS reminders.
- Local-service CRO: target 5%→8–10% conversion (avg ~2%); sticky thumb-reach
  CTA; minimal form fields; Good/Better/Best tiering +15–25% avg ticket; 88% of
  local mobile searches act within 24h; dedicated landing pages > homepages for
  paid traffic.
================================================================================
