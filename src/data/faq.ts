/**
 * Single source of truth for FAQ content (Phase 3).
 * Consumed by both the FaqAccordion island (UI) and buildFAQSchema() (JSON-LD FAQPage),
 * so the on-page questions and the structured data can never drift apart.
 */
import { SERVICE_AREA_CITIES } from './site';

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-hookups',
    q: 'Do you need access to my water or power?',
    a: 'No — our rigs are fully self-contained with onboard water tanks and a generator. We can detail anywhere, including apartment complexes and office lots with no utility access.',
  },
  {
    id: 'faq-time',
    q: 'How long does a detail take?',
    a: 'The Standard Reset takes 2–3 hours. The Elite Signature runs 4–5 hours. Ceramic coatings require a full day (8+ hours) including prep, coating, and cure time.',
  },
  {
    id: 'faq-weather',
    q: 'What if the weather is bad?',
    a: "Texas weather shifts fast. If conditions aren't right on your scheduled day, we'll contact you to reschedule at no fee — your booking stays secure.",
  },
  {
    id: 'faq-payment',
    q: 'How do I pay?',
    a: "We accept card, contactless, and Apple Pay on completion. Cash is also welcome. No payment is required until you've inspected the result and are satisfied.",
  },
  {
    id: 'faq-area',
    q: 'Do you serve my area?',
    a: `We cover a 50-mile radius from Richardson, TX — including ${SERVICE_AREA_CITIES.join(', ')}. Use the ZIP checker above to confirm.`,
  },
];
