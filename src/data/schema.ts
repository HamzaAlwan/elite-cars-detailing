/**
 * P7-T2 / P7-T3 — JSON-LD structured data for the homepage.
 * AutoWash (AutomotiveBusiness < LocalBusiness) in service-area form.
 * Service per package. FAQPage. Organization + WebSite.
 * Owner-supplied data (phone, lat/lng, GBP URL) filled in Phase 9 (P9-T2).
 * ⚠ AggregateRating: SKIPPED at launch (cold-start; no genuine reviews yet).
 *   Add only once real Google reviews exist — self-hosted self-reviews don't earn stars.
 */
import { SITE, CONTACT, LOCATION, SERVICE_AREA_CITIES } from './site';
import { FAQ_ITEMS } from './faq';
import { hasConfiguredEmail, hasConfiguredPhone } from '@/lib/contact';

const SERVICES = [
  {
    name: 'The Standard Reset',
    description:
      'Hand wash, gloss protection, tire dressing, interior deep vacuum, dashboard wipe-down.',
    priceRange: '$125–$175',
    url: `${SITE.url}/#pricing`,
  },
  {
    name: 'The Elite Signature',
    description:
      'Full exterior wash, clay bar, iron decontamination, interior steam sanitization, leather clean & condition, protective wax.',
    priceRange: '$225–$300',
    url: `${SITE.url}/#pricing`,
  },
  {
    name: 'The Ceramic Showroom Upgrade',
    description:
      'Multi-year ceramic coating (3-year and 9-year options). Full decontamination prep included.',
    priceRange: '$650–$1,995',
    url: `${SITE.url}/#pricing`,
  },
];

export function buildLocalBusinessSchema() {
  const hasPhone = hasConfiguredPhone(CONTACT.phoneE164);
  const hasEmail = hasConfiguredEmail(CONTACT.email);
  const hasGeo = LOCATION.lat !== 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    name: SITE.name,
    description: SITE.description,
    slogan: SITE.tagline,
    url: SITE.url,
    ...(hasPhone && { telephone: CONTACT.phoneE164 }),
    ...(hasEmail && { email: CONTACT.email }),
    priceRange: '$125–$1,995',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, Cash, Apple Pay, Contactless',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '19:00',
      },
    ],
    areaServed: [
      ...SERVICE_AREA_CITIES.map((city) => ({
        '@type': 'City',
        name: city,
        containedInPlace: { '@type': 'State', name: 'Texas' },
      })),
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: hasGeo ? LOCATION.lat : 32.9483,
          longitude: hasGeo ? LOCATION.lng : -96.7299,
        },
        geoRadius: LOCATION.serviceRadiusMeters,
      },
    ],
    ...(hasGeo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: LOCATION.lat,
        longitude: LOCATION.lng,
      },
    }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: LOCATION.locality,
      addressRegion: LOCATION.region,
      postalCode: LOCATION.postalCode,
      addressCountry: LOCATION.country,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mobile Car Detailing Services',
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'Offer',
        position: i + 1,
        name: s.name,
        description: s.description,
        priceRange: s.priceRange,
        priceCurrency: 'USD',
        url: s.url,
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Dallas–Fort Worth Metropolitan Area',
        },
        seller: { '@type': 'AutoWash', name: SITE.name },
      })),
    },
  };
}

export function buildFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: `${SITE.url}/logo.svg`,
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  };
}
