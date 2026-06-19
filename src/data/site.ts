/**
 * Single source of truth for site-wide constants. Import via `@/data/site`.
 * Placeholders ({{...}} / empty strings) are replaced with real owner data in Phase 9 (P9-T2).
 */

export const SITE = {
  name: 'Elite Mobile Car Detailing',
  tagline: 'No hookups. No hassle. Just shine.',
  // Production domain — set before launch (P9-T5); keep in sync with `site` in astro.config.mjs.
  url: 'https://www.example.com',
  description:
    'Premium mobile car detailing across Richardson & the DFW metro. Fully self-contained — we bring our own water and power, so we detail at your home or office with zero hookups needed.',
} as const;

export const CONTACT = {
  phoneE164: '{{PHONE_E164}}', // e.g. +19725551234 — a local DFW call-tracking number (P9-T2)
  phoneDisplay: '{{LOCAL_PHONE_DISPLAY}}', // e.g. (972) 555-1234
  email: '{{EMAIL}}',
  hours: 'Mon–Sat · 8:00 AM – 7:00 PM',
} as const;

/** Service-area business (SAB) — Richardson base, no public street address. */
export const LOCATION = {
  locality: 'Richardson',
  region: 'TX',
  postalCode: '75080',
  country: 'US',
  lat: 0, // {{LAT}} — ≥5 decimal places (P9-T2)
  lng: 0, // {{LNG}}
  serviceRadiusMeters: 80467, // ~50 miles
} as const;

export const SERVICE_AREA_CITIES = [
  'Richardson',
  'Dallas',
  'Plano',
  'Frisco',
  'McKinney',
  'Allen',
  'Garland',
  'Carrollton',
  'Irving',
] as const;

export const SOCIAL = {
  googleBusinessProfile: '{{GBP_URL}}',
  instagram: '',
  facebook: '',
  yelp: '',
} as const;

/** Canonical CTA wording — keep identical site-wide (INITIAL_IDEA.md §4 consistency rule). */
export const CTA = {
  book: 'Book Your Detail',
  quote: 'Get a Free Quote',
  call: 'Call',
} as const;

/** Web3Forms public access key — an email alias, safe to commit (P0-T9 / P6-T3). */
export const WEB3FORMS_ACCESS_KEY = '{{WEB3FORMS_ACCESS_KEY}}';
