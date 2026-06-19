# Phase 4 — Interactive Islands (Vue)

**Goal:** All interactivity shipped as lazy Vue islands with the lightest viable hydration
directive — these are the ONLY JavaScript on the page (besides Phase 5/6 islands).
**Depends on:** Phase 3
**Status:** ⬜ Not started
**Spec refs:** `INITIAL_IDEA.md` §1 (islands map), §2.4, §4.1, §4.4, §4.8, §4.10.

> **Use Reka UI primitives** (via shadcn-vue) to inherit accessibility instead of hand-rolling it:
> **Dialog/Drawer** for the nav, **Accordion** for the FAQ, **Tabs/ToggleGroup** for the size-selector.
> (skill: vue-shadcn-islands)

## Tasks

- [ ] **P4-T1 — Mobile nav slide-over** (`client:idle`)
  - Build on Reka UI **Dialog/Drawer** → inherits focus trap, Esc-to-close, scroll-lock, and
    `aria-*` for free. Hamburger as trigger (`aria-expanded`/`aria-controls`); close on link click.
  - Hamburger trigger uses the `.menu-icon` hamburger↔X CSS morph (transform/opacity;
    `transform-box: fill-box`, §2.5); drawer in/out uses `--ease-out`/`--ease-in` + `--dur-slow`.
- [ ] **P4-T2 — Pricing size-selector → instant estimator** (`client:visible`)
  - Build on Reka UI **Tabs** (or ToggleGroup) for the segmented control (Sedan · Med SUV ·
    Truck) → keyboard + `aria` handled. Default Sedan; persist selection across all tier cards
    (sessionStorage); also list all 3 sizes small. ESTIMATOR: for tiers A & B, selecting a size
    surfaces the EXACT price with a "Book this detail" CTA that scrolls to `#book`. Tier C
    (Ceramic) is the exception — it shows tiered "from" ranges + "Request a Custom Quote"
    (no instant exact price). Likely one island, e.g. `PricingEstimator.vue`.
- [ ] **P4-T3 — Zip-code validator** (`client:visible`)
  - City→ZIP JS array (align with SEO `areaServed`); in-area success animates the `.icon-draw`
    checkmark (Motion One or CSS `stroke-dashoffset`, `pathLength="1"`; reduced-motion → final state)
    alongside text + color (not emoji-only); out-of-area → email capture (Web3Forms) / nearest city;
    never gates booking; works as progressive enhancement. Inputs `font-size:16px` (no iOS auto-zoom — §2.5).
- [ ] **P4-T4 — FAQ accordion**
  - DEFAULT to native `<details>/<summary>` (zero-JS, accessible by default, Tailwind-styled) —
    use Reka UI **Accordion** (`client:visible`) only if the Phase 2.5 showcase prefers it. Seed
    questions (§4.10). Content also feeds FAQPage schema (Phase 7).
- [ ] **P4-T5 — Scroll-reveal + specular-sweep wiring**
  - Apply the Phase 2 IntersectionObserver util to sections; honor `prefers-reduced-motion`
    (REDUCE — keep final state). Fire the CTA specular sweep on scroll-into-view for TOUCH (hover
    sweep gated behind `@media (hover:hover) and (pointer:fine)` — §2.4). Use Motion One (`motion`)
    for richer `whileInView` reveals where warranted (transform/opacity only; ~5KB against the budget).
    Reveals use the motion tokens (`--ease-out` / `--dur-slow`) with a 60–80ms stagger (cap ~8–12 items).

## Done when
Each island hydrates with the correct directive, is fully keyboard-accessible, has no console
errors, and the total JS payload stays minimal.
