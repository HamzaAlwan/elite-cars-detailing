# Project Skills

Claude Code Agent Skills for building the **Elite Mobile Car Detailing** site. Each folder
has a `SKILL.md` that Claude auto-loads when its `description` matches the work at hand
(you can also invoke any of them manually with `/skill-name`). They encode this project's
stack, design system, SEO, and conventions so guidance stays consistent across sessions.

| Skill (`/command`) | Use it for |
|---|---|
| `project-planning` | Phases, task tracking, global conventions, where the specs live |
| `astro-islands` | Astro 6 SSG, hydration directives, `ClientRouter`, `astro:assets` |
| `vue-shadcn-islands` | shadcn-vue / Reka UI Vue islands, setup, typed SFCs |
| `tailwind-v4-design-system` | Tailwind v4 `@theme` tokens, modern-simple look, mobile-first |
| `landing-ux-cro` | Section/CTA/trust decisions, conversion, marketing copy |
| `media-gallery` | "Our Work" gallery, before/after slider, lightbox, video |
| `local-seo` | Titles/meta, JSON-LD, sitemap, Map Pack, AI-search visibility |
| `web-performance-accessibility` | Core Web Vitals / Lighthouse budget + WCAG AA |
| `cal-booking` | Cal.com embed (free tier), booking questions, quote form, tap-to-call |

**Source specs:** `../../INITIAL_IDEA.md`, `../../SEO_STRATEGY.md`,
`../../plans/elite-mobile-detailing-site/`.

> Format note: skills live at `.claude/skills/<name>/SKILL.md`; the folder name is the
> `/command`. Keep each `SKILL.md` concise (high-signal); move deep reference material into
> supporting files and link them, so it only loads when needed.
