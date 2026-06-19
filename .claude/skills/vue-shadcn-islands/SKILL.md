---
name: shadcn-vue islands
description: >-
  How to build and wire Vue interactive islands using shadcn-vue (Reka UI) in this
  Astro project. Use when adding/creating .vue island components, running the
  shadcn-vue CLI, configuring components.json or the @/* path alias, fixing Tailwind
  double-base-styles, or writing typed SFCs for the nav, pricing selector, zip
  validator, FAQ, or gallery.
---

# shadcn-vue (Reka UI) islands

shadcn-vue = copy-in components built on **Reka UI v2 + Tailwind v4**. You own the
component source under `src/components/ui/`. Requires `@astrojs/vue`. TypeScript SFCs.

## Setup (once)

- `tsconfig.json`: `"baseUrl": "."`, `"paths": { "@/*": ["src/*"] }` (include `src`).
- `components.json`: aliases → `@/components`, `@/lib/utils` (the `cn()` helper).
- Tailwind v4 in Astro is wired via **`@tailwindcss/vite`** (NOT the legacy
  `@astrojs/tailwind`, which targets v3). If the legacy integration is ever used, set
  `applyBaseStyles: false` so base styles aren't injected twice.
- Add components with `npx shadcn-vue@latest add <comp>` → they land in
  `src/components/ui/`. In Astro this is slightly more manual than Nuxt — verify output.

## Usage rules

- Island files: `src/components/islands/*.vue`, `<script setup lang="ts">`.
- Mount in `.astro` with the lightest directive (usually `client:visible`; nav `client:idle`).
- Lean on Reka UI's built-in accessibility (focus, aria, keyboard) — don't reinvent it.
- Keep islands tiny; pass data via props from Astro frontmatter, not a global store.
- One accent color; style via the design tokens (see `tailwind-v4-design-system`).

Islands in this project: mobile nav, pricing size-selector (doubles as an INSTANT ESTIMATOR
— size → exact price + "Book this"), zip validator, FAQ accordion, before/after slider,
Cal.com embed. Motion One (`motion`) powers in-island reveals. Ref: `INITIAL_IDEA.md` §1, §4.
