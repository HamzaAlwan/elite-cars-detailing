const PHONE_PLACEHOLDER = '{{PHONE_E164}}';
const EMAIL_PLACEHOLDER = '{{EMAIL}}';

export function hasConfiguredPhone(phoneE164: string): boolean {
  const normalized = phoneE164.trim();
  return normalized.length > 0 && normalized !== PHONE_PLACEHOLDER;
}

export function hasConfiguredEmail(email: string): boolean {
  const normalized = email.trim();
  return normalized.length > 0 && normalized !== EMAIL_PLACEHOLDER;
}
