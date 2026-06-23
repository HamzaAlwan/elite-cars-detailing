<script setup lang="ts">
/**
 * Phase 3 — Animated FAQ accordion (replaces the instant-toggle native <details>).
 * Reka UI Accordion: single-open + collapsible, smooth height animation via
 * `--reka-accordion-content-height` (see `.faq-content` keyframes in global.css).
 * Accessible by default (Reka manages roles / aria-expanded / keyboard).
 * Content + ids come from the shared FAQ source so UI and JSON-LD stay in sync.
 * Reduced-motion: handled globally — the panel still opens, just without the height tween.
 */
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from 'reka-ui';
import { FAQ_ITEMS } from '@/data/faq';
</script>

<template>
  <AccordionRoot type="single" :collapsible="true" class="space-y-3">
    <AccordionItem
      v-for="item in FAQ_ITEMS"
      :id="item.id"
      :key="item.id"
      :value="item.id"
      class="overflow-hidden rounded-xl border border-border bg-bg-elevated"
    >
      <AccordionHeader>
        <AccordionTrigger
          class="group flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left font-medium text-text"
        >
          {{ item.q }}
          <svg
            class="shrink-0 text-text-muted transition-transform duration-[--dur-fast] group-data-[state=open]:rotate-180"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="faq-content">
        <p class="px-5 pb-4 pt-1 text-sm leading-relaxed text-text-muted">{{ item.a }}</p>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
