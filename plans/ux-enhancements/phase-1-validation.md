# Phase 1 — Centralized validation (`zod` + US phone)

**Goal:** one validation module shared by the quote form and the estimator's ZIP gate.
**Why:** validation logic is currently inline/duplicated; email isn't validated; `COVERED_ZIPS`
lives inside `ZipValidator.vue` and the estimator needs it too.

## Tasks
- [ ] Add `zod` `^4.4.3` to `package.json` dependencies (already transitively in node_modules), install.
- [ ] Create `src/lib/validation.ts`:
  - [ ] `normalizePhone(raw)` → digits only; `formatUsPhone(raw)` → `(XXX) XXX-XXXX`.
  - [ ] `usPhoneRegex` / `isValidUsPhone(raw)` → exactly 10 digits (strip leading `1` if 11).
  - [ ] `COVERED_ZIPS` set (moved verbatim from `ZipValidator.vue`) + `isCoveredZip(zip)` (`/^\d{5}$/` + set membership).
  - [ ] `quoteSchema` (zod): `name` min 2; `phone` required + valid US; `email` optional but `.email()` when non-empty; `vehicle`/`service`/`notes` optional.
  - [ ] Export a helper returning per-field messages matching current copy ("Please enter your name." / "Please enter a valid phone number." / "Please enter a valid email.").
- [ ] Refactor `src/components/islands/QuoteForm.vue`:
  - [ ] Validate via schema on blur + submit; add the missing email check.
  - [ ] Auto-format phone on blur with `formatUsPhone`.
  - [ ] Preserve `aria-invalid`, `role="alert"`, `aria-describedby`, focus-first-error behavior.
- [ ] Refactor `src/components/islands/ZipValidator.vue`:
  - [ ] Import `isCoveredZip` / `COVERED_ZIPS` from the module; delete the local set.
  - [ ] Keep all existing in/out-of-area UI + `.icon-draw` behavior unchanged.

## Acceptance
- Invalid email blocks submit with an inline, screen-reader-announced message.
- Phone auto-formats to `(XXX) XXX-XXXX` on blur; submit rejects < 10 digits.
- ZIP behavior identical for users; the covered-zip list exists in exactly one place.
- `npm run check` + `npm run lint` clean.

## Notes / decisions
- Email stays **optional** (phone is the required contact).
- zod only imported inside islands (tree-shaken; counts toward island JS budget — keep schema small).
