/**
 * Single source of truth for package pricing (Phase 2).
 * Shared by the static Pricing.astro cards and the PricingEstimator island so prices live in ONE
 * place. Prices are flat by vehicle size (no make/model, no location-based pricing).
 */

export type Size = 'sedan' | 'suv' | 'truck';

export const SIZES: { value: Size; label: string; short: string }[] = [
  { value: 'sedan', label: 'Sedan / Coupe', short: 'Sedan' },
  { value: 'suv', label: 'Med SUV / Crossover', short: 'Med SUV' },
  { value: 'truck', label: 'Large Truck / 3-Row', short: 'Truck' },
];

/** Per-tier price by size. `null` = priced after inspection (ceramic). */
export const PRICING: Record<string, Record<Size, number | null>> = {
  'standard-reset': { sedan: 125, suv: 150, truck: 175 },
  'elite-signature': { sedan: 225, suv: 260, truck: 300 },
  'ceramic-upgrade': { sedan: null, suv: null, truck: null },
};

/** Display metadata for the estimate output. `from` = headline price for inspection-only tiers. */
export const TIERS: { id: string; name: string; from?: number }[] = [
  { id: 'standard-reset', name: 'Standard' },
  { id: 'elite-signature', name: 'Elite' },
  { id: 'ceramic-upgrade', name: 'Ceramic', from: 650 },
];

export const ADDONS: { name: string; price: number }[] = [
  { name: 'Pet Hair Removal', price: 50 },
  { name: 'Odor Elimination', price: 60 },
];
