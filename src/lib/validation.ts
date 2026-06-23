/**
 * Centralized client-side validation (Phase 1).
 * Shared by QuoteForm.vue and ZipValidator.vue (and the PricingEstimator ZIP gate) so phone/email/
 * ZIP rules live in ONE place. zod backs email + the holistic quote schema; phone uses a small
 * US-specific helper (single-market site — no need for libphonenumber's weight).
 *
 * Field validators return '' when valid and a user-facing message when not, matching the existing
 * inline-error UX in the forms.
 */
import { z } from 'zod';

/* ---------------------------------------------------------------------------
 * US phone
 * ------------------------------------------------------------------------- */

/** Digits only; drops a leading US country code (11 digits starting with 1). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits;
}

/** Valid US number = exactly 10 significant digits. */
export function isValidUsPhone(raw: string): boolean {
  return normalizePhone(raw).length === 10;
}

/** Progressive format → `(XXX) XXX-XXXX`. Safe to call on partial input (used on blur). */
export function formatUsPhone(raw: string): string {
  const d = normalizePhone(raw).slice(0, 10);
  if (d.length === 0) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/* ---------------------------------------------------------------------------
 * ZIP — DFW coverage (single source of truth; moved out of ZipValidator.vue)
 * ~50-mile radius of Richardson, TX 75080.
 * ------------------------------------------------------------------------- */
export const COVERED_ZIPS = new Set<string>([
  // Richardson
  '75080', '75081', '75082', '75083',
  // Plano
  '75023', '75024', '75025', '75026', '75074', '75075', '75093', '75094',
  // Allen
  '75002', '75013',
  // McKinney
  '75069', '75070', '75071', '75072',
  // Frisco
  '75033', '75034', '75035', '75036',
  // Garland
  '75040', '75041', '75042', '75043', '75044', '75045', '75046', '75047', '75048',
  // Carrollton
  '75006', '75007', '75010', '75011',
  // Irving
  '75014', '75015', '75016', '75017', '75018', '75019', '75038', '75039', '75060', '75061', '75062', '75063',
  // Dallas (core + north)
  '75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210',
  '75211', '75212', '75214', '75215', '75216', '75217', '75218', '75219', '75220', '75221',
  '75222', '75223', '75224', '75225', '75226', '75227', '75228', '75229', '75230', '75231',
  '75232', '75233', '75234', '75235', '75236', '75237', '75238', '75240', '75241', '75242',
  '75243', '75244', '75246', '75247', '75248', '75249', '75251', '75252', '75253', '75254',
  // Lewisville / Flower Mound
  '75022', '75028', '75056', '75057', '75067', '75068',
  // Addison / Farmers Branch
  '75001',
  // Rowlett / Sachse / Wylie
  '75088', '75089', '75098',
  // Prosper / Celina
  '75078', '76227',
  // Grand Prairie
  '75050', '75051', '75052', '75053', '75054',
  // Mesquite
  '75149', '75150',
  // Duncanville / DeSoto / Cedar Hill
  '75116', '75115', '75104',
]);

/** 5-digit format only (no coverage check). */
export function isZipFormat(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim());
}

/** True only when the ZIP is a valid 5-digit code AND inside the service area. */
export function isCoveredZip(zip: string): boolean {
  const v = zip.trim();
  return /^\d{5}$/.test(v) && COVERED_ZIPS.has(v);
}

/* ---------------------------------------------------------------------------
 * Field validators ('' = valid) — match existing inline-error copy
 * ------------------------------------------------------------------------- */
export function validateName(name: string): string {
  return name.trim().length < 2 ? 'Please enter your name.' : '';
}

export function validatePhone(phone: string): string {
  return isValidUsPhone(phone) ? '' : 'Please enter a valid phone number.';
}

/** Email is optional: empty is valid; non-empty must be a real address. */
export function validateEmail(email: string): string {
  const v = email.trim();
  if (!v) return '';
  return z.email().safeParse(v).success ? '' : 'Please enter a valid email address.';
}

/* ---------------------------------------------------------------------------
 * Holistic quote schema (used on submit)
 * ------------------------------------------------------------------------- */
export const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  phone: z.string().refine(isValidUsPhone, 'Please enter a valid phone number.'),
  email: z
    .string()
    .refine((v) => v.trim() === '' || z.email().safeParse(v.trim()).success, 'Please enter a valid email address.'),
  vehicle: z.string().optional(),
  service: z.string().optional(),
  notes: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
