---
name: Project planning & tracking
description: >-
  How to plan and track work on the Elite Mobile Car Detailing project. Use when
  starting or continuing build work, updating progress, deciding what to do next,
  or referencing the phase plan, task checkboxes, global conventions, or the
  product/SEO specs.
---

# Planning & tracking

## Source docs (read before building)

- Product / design spec: `INITIAL_IDEA.md`
- SEO strategy: `SEO_STRATEGY.md`
- Build plan: `plans/elite-mobile-detailing-site/` — master tracker `00-OVERVIEW.md`
  plus `phase-00..10-*.md`, each with its own task checkboxes and "Done when".

## Workflow

- **Phase 0 — Dependencies & Configuration is the gate: install & configure ALL deps (at
  `@latest`) before writing any feature code.** Then work in order: 0 → 1 Scaffolding →
  2 Design → **2.5 Design showcase `/preview` (GATE: owner picks variants & approves)** →
  3 Sections → … → 9 Deploy; 10 is owner/post-launch.
- Tasks have stable IDs (`P{phase}-T{n}`) shared between the master and phase files.
- On completing a task: tick `- [x]` in BOTH the phase file and `00-OVERVIEW.md`, and
  update the phase-status table (⬜ → 🟦 → ✅). Keep them in sync — never let one drift.
- If scope changes, update the plan files first, then build.

## Global conventions (always)

1. **Latest packages** — install with `@latest`; run `npx npm-check-updates -u` then
   reinstall to refresh; re-test the build after upgrades.
2. **TypeScript `strict`** everywhere — typed Vue SFCs (`<script setup lang="ts">`) and
   typed Astro frontmatter; avoid `any`.
3. **Mobile-first**, **all-OSS**, **single page only**.

## Related skills

`astro-islands`, `vue-shadcn-islands`, `tailwind-v4-design-system`, `landing-ux-cro`,
`media-gallery`, `local-seo`, `web-performance-accessibility`, `cal-booking`.
