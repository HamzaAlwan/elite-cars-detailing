<script setup lang="ts">
import { ref, watch } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';

const SIZES = [
  { value: 'sedan', short: 'Sedan',   label: 'Sedan / Coupe' },
  { value: 'suv',   short: 'Med SUV', label: 'Med SUV / Crossover' },
  { value: 'truck', short: 'Truck',   label: 'Large Truck / 3-Row' },
];

const selectedA = ref('sedan');
const selectedB = ref('sedan');
const selectedC = ref('sedan');
const driveDirection = ref<'right' | 'left'>('right');

watch(selectedB, (newVal, oldVal) => {
  const order = SIZES.map(s => s.value);
  driveDirection.value = order.indexOf(newVal) > order.indexOf(oldVal) ? 'right' : 'left';
});
</script>

<template>
  <div class="space-y-14">

    <!-- ============================================================ -->
    <!-- VARIANT A — Spring Bounce                                     -->
    <!-- ============================================================ -->
    <div id="car-variant-a">
      <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">Variant A</p>
      <h3 class="text-lg font-semibold text-text">Spring Bounce</h3>
      <p class="mb-5 mt-1 text-sm text-text-muted">
        Selecting a vehicle triggers a spring-scale bounce. Pure CSS — no extra JS.
      </p>
      <ToggleGroupRoot
        type="single"
        :model-value="selectedA"
        class="flex gap-3"
        aria-label="Vehicle size – Variant A"
        @update:model-value="(v) => { if (v) selectedA = v; }"
      >
        <ToggleGroupItem
          v-for="size in SIZES"
          :key="size.value"
          :value="size.value"
          :aria-label="size.label"
          class="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border
                 bg-bg-elevated px-2 py-3 cursor-pointer select-none
                 transition-colors hover:border-border-bright
                 data-[state=on]:border-brand data-[state=on]:bg-brand-tint data-[state=on]:text-brand
                 text-text-muted"
        >
          <div class="flex h-10 w-full items-end justify-center">
            <svg class="spring-car h-full w-auto" viewBox="0 0 120 60" aria-hidden="true">
              <g v-if="size.value === 'sedan'">
                <path d="M 8 46 L 8 40 C 8 35 11 31 17 29 L 26 21 C 32 14 37 11 43 11
                         L 75 11 C 81 11 85 14 88 21 L 94 29 L 101 29
                         C 105 29 109 32 109 38 L 109 46
                         L 97 46 A 8 8 0 0 0 87 46
                         L 33 46 A 8 8 0 0 0 23 46 Z" fill="currentColor"/>
                <path d="M 37 46 L 43 13 L 74 13 L 80 21 L 87 29 Z" fill="currentColor" class="car-window"/>
                <circle cx="28" cy="52" r="8"   fill="currentColor" class="car-wheel"/>
                <circle cx="28" cy="52" r="3"   fill="currentColor" class="car-hub"/>
                <circle cx="92" cy="52" r="8"   fill="currentColor" class="car-wheel"/>
                <circle cx="92" cy="52" r="3"   fill="currentColor" class="car-hub"/>
              </g>
              <g v-else-if="size.value === 'suv'">
                <path d="M 6 48 L 6 41 C 6 36 9 31 15 29 L 22 21 C 26 16 30 12 36 11
                         L 78 11 C 84 11 88 14 91 19 L 96 29 L 105 29
                         C 108 29 112 33 112 40 L 112 48
                         L 99 48 A 9 9 0 0 0 85 48
                         L 33 48 A 9 9 0 0 0 19 48 Z" fill="currentColor"/>
                <path d="M 30 48 L 36 13 L 77 13 L 83 21 L 90 29 Z" fill="currentColor" class="car-window"/>
                <circle cx="26" cy="54" r="9"   fill="currentColor" class="car-wheel"/>
                <circle cx="26" cy="54" r="3.5" fill="currentColor" class="car-hub"/>
                <circle cx="92" cy="54" r="9"   fill="currentColor" class="car-wheel"/>
                <circle cx="92" cy="54" r="3.5" fill="currentColor" class="car-hub"/>
              </g>
              <g v-else>
                <path d="M 6 48 L 6 41 C 6 36 9 31 14 28 L 18 20 C 22 14 26 11 32 11
                         L 50 11 C 52 11 54 14 54 20 L 54 28 L 54 48
                         L 31 48 A 9 9 0 0 0 17 48 Z" fill="currentColor"/>
                <path d="M 16 28 C 20 20 24 15 32 13 L 48 13 L 50 20 L 50 28 Z" fill="currentColor" class="car-window"/>
                <path d="M 58 30 L 114 30 C 116 30 117 32 117 36 L 117 48
                         L 97 48 A 9 9 0 0 0 83 48 L 58 48 Z" fill="currentColor"/>
                <circle cx="24" cy="54" r="9"   fill="currentColor" class="car-wheel"/>
                <circle cx="24" cy="54" r="3.5" fill="currentColor" class="car-hub"/>
                <circle cx="90" cy="54" r="9"   fill="currentColor" class="car-wheel"/>
                <circle cx="90" cy="54" r="3.5" fill="currentColor" class="car-hub"/>
              </g>
            </svg>
          </div>
          <span class="text-xs font-semibold">{{ size.short }}</span>
        </ToggleGroupItem>
      </ToggleGroupRoot>
    </div>

    <!-- ============================================================ -->
    <!-- VARIANT B — Drive-In                                         -->
    <!-- ============================================================ -->
    <div id="car-variant-b">
      <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">Variant B ✓ Chosen</p>
      <h3 class="text-lg font-semibold text-text">Drive In</h3>
      <p class="mb-5 mt-1 text-sm text-text-muted">
        The new car slides in from the appropriate side. Vue &lt;Transition&gt; + direction-aware CSS.
      </p>
      <div class="relative mb-4 h-28 overflow-hidden rounded-xl border border-brand/30 bg-bg-elevated">
        <Transition :name="driveDirection === 'right' ? 'drive-right' : 'drive-left'" mode="out-in">
          <div :key="selectedB" class="absolute inset-0 flex items-end justify-center pb-2 text-brand">
            <svg class="h-20 w-auto" viewBox="0 0 120 60" aria-hidden="true">
              <g v-if="selectedB === 'sedan'">
                <path d="M 8 46 L 8 40 C 8 35 11 31 17 29 L 26 21 C 32 14 37 11 43 11
                         L 75 11 C 81 11 85 14 88 21 L 94 29 L 101 29
                         C 105 29 109 32 109 38 L 109 46
                         L 97 46 A 8 8 0 0 0 87 46
                         L 33 46 A 8 8 0 0 0 23 46 Z" fill="currentColor"/>
                <path d="M 37 46 L 43 13 L 74 13 L 80 21 L 87 29 Z" fill="currentColor" opacity="0.18"/>
                <circle cx="28" cy="52" r="8"   fill="currentColor" opacity="0.85"/>
                <circle cx="28" cy="52" r="3"   fill="currentColor" opacity="0.25"/>
                <circle cx="92" cy="52" r="8"   fill="currentColor" opacity="0.85"/>
                <circle cx="92" cy="52" r="3"   fill="currentColor" opacity="0.25"/>
              </g>
              <g v-else-if="selectedB === 'suv'">
                <path d="M 6 48 L 6 41 C 6 36 9 31 15 29 L 22 21 C 26 16 30 12 36 11
                         L 78 11 C 84 11 88 14 91 19 L 96 29 L 105 29
                         C 108 29 112 33 112 40 L 112 48
                         L 99 48 A 9 9 0 0 0 85 48
                         L 33 48 A 9 9 0 0 0 19 48 Z" fill="currentColor"/>
                <path d="M 30 48 L 36 13 L 77 13 L 83 21 L 90 29 Z" fill="currentColor" opacity="0.18"/>
                <circle cx="26" cy="54" r="9"   fill="currentColor" opacity="0.85"/>
                <circle cx="26" cy="54" r="3.5" fill="currentColor" opacity="0.25"/>
                <circle cx="92" cy="54" r="9"   fill="currentColor" opacity="0.85"/>
                <circle cx="92" cy="54" r="3.5" fill="currentColor" opacity="0.25"/>
              </g>
              <g v-else>
                <path d="M 6 48 L 6 41 C 6 36 9 31 14 28 L 18 20 C 22 14 26 11 32 11
                         L 50 11 C 52 11 54 14 54 20 L 54 28 L 54 48
                         L 31 48 A 9 9 0 0 0 17 48 Z" fill="currentColor"/>
                <path d="M 16 28 C 20 20 24 15 32 13 L 48 13 L 50 20 L 50 28 Z" fill="currentColor" opacity="0.18"/>
                <path d="M 58 30 L 114 30 C 116 30 117 32 117 36 L 117 48
                         L 97 48 A 9 9 0 0 0 83 48 L 58 48 Z" fill="currentColor"/>
                <circle cx="24" cy="54" r="9"   fill="currentColor" opacity="0.85"/>
                <circle cx="24" cy="54" r="3.5" fill="currentColor" opacity="0.25"/>
                <circle cx="90" cy="54" r="9"   fill="currentColor" opacity="0.85"/>
                <circle cx="90" cy="54" r="3.5" fill="currentColor" opacity="0.25"/>
              </g>
            </svg>
          </div>
        </Transition>
      </div>
      <ToggleGroupRoot
        type="single"
        :model-value="selectedB"
        class="flex gap-3"
        aria-label="Vehicle size – Variant B"
        @update:model-value="(v) => { if (v) selectedB = v; }"
      >
        <ToggleGroupItem
          v-for="size in SIZES"
          :key="size.value"
          :value="size.value"
          :aria-label="size.label"
          class="flex-1 rounded-xl border border-border bg-bg-elevated py-2.5 text-sm font-semibold
                 text-text-muted transition-colors cursor-pointer select-none
                 data-[state=on]:border-brand data-[state=on]:bg-brand-tint data-[state=on]:text-brand"
        >
          {{ size.short }}
        </ToggleGroupItem>
      </ToggleGroupRoot>
    </div>

    <!-- ============================================================ -->
    <!-- VARIANT C — Ground Glow                                      -->
    <!-- ============================================================ -->
    <div id="car-variant-c">
      <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">Variant C</p>
      <h3 class="text-lg font-semibold text-text">Ground Glow</h3>
      <p class="mb-5 mt-1 text-sm text-text-muted">
        A sapphire glow puddle fades in beneath the selected car. Pure CSS transition on SVG fill.
      </p>
      <ToggleGroupRoot
        type="single"
        :model-value="selectedC"
        class="flex gap-3"
        aria-label="Vehicle size – Variant C"
        @update:model-value="(v) => { if (v) selectedC = v; }"
      >
        <ToggleGroupItem
          v-for="size in SIZES"
          :key="size.value"
          :value="size.value"
          :aria-label="size.label"
          class="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border
                 bg-bg-elevated px-2 py-3 cursor-pointer select-none
                 transition-colors hover:border-border-bright
                 data-[state=on]:border-brand data-[state=on]:bg-brand-tint data-[state=on]:text-brand
                 text-text-muted"
        >
          <div class="flex h-12 w-full items-end justify-center overflow-visible">
            <svg class="glow-svg h-10 w-auto overflow-visible" viewBox="0 0 120 62" aria-hidden="true">
              <g v-if="size.value === 'sedan'">
                <ellipse class="glow-shadow" cx="60" cy="60" rx="46" ry="4"/>
                <path d="M 8 46 L 8 40 C 8 35 11 31 17 29 L 26 21 C 32 14 37 11 43 11
                         L 75 11 C 81 11 85 14 88 21 L 94 29 L 101 29
                         C 105 29 109 32 109 38 L 109 46
                         L 97 46 A 8 8 0 0 0 87 46
                         L 33 46 A 8 8 0 0 0 23 46 Z" fill="currentColor"/>
                <path d="M 37 46 L 43 13 L 74 13 L 80 21 L 87 29 Z" fill="currentColor" opacity="0.18"/>
                <circle cx="28" cy="52" r="8" fill="currentColor" opacity="0.85"/>
                <circle cx="92" cy="52" r="8" fill="currentColor" opacity="0.85"/>
              </g>
              <g v-else-if="size.value === 'suv'">
                <ellipse class="glow-shadow" cx="60" cy="60" rx="48" ry="4"/>
                <path d="M 6 48 L 6 41 C 6 36 9 31 15 29 L 22 21 C 26 16 30 12 36 11
                         L 78 11 C 84 11 88 14 91 19 L 96 29 L 105 29
                         C 108 29 112 33 112 40 L 112 48
                         L 99 48 A 9 9 0 0 0 85 48
                         L 33 48 A 9 9 0 0 0 19 48 Z" fill="currentColor"/>
                <path d="M 30 48 L 36 13 L 77 13 L 83 21 L 90 29 Z" fill="currentColor" opacity="0.18"/>
                <circle cx="26" cy="54" r="9" fill="currentColor" opacity="0.85"/>
                <circle cx="92" cy="54" r="9" fill="currentColor" opacity="0.85"/>
              </g>
              <g v-else>
                <ellipse class="glow-shadow" cx="60" cy="60" rx="50" ry="4"/>
                <path d="M 6 48 L 6 41 C 6 36 9 31 14 28 L 18 20 C 22 14 26 11 32 11
                         L 50 11 C 52 11 54 14 54 20 L 54 28 L 54 48
                         L 31 48 A 9 9 0 0 0 17 48 Z" fill="currentColor"/>
                <path d="M 16 28 C 20 20 24 15 32 13 L 48 13 L 50 20 L 50 28 Z" fill="currentColor" opacity="0.18"/>
                <path d="M 58 30 L 114 30 C 116 30 117 32 117 36 L 117 48
                         L 97 48 A 9 9 0 0 0 83 48 L 58 48 Z" fill="currentColor"/>
                <circle cx="24" cy="54" r="9" fill="currentColor" opacity="0.85"/>
                <circle cx="90" cy="54" r="9" fill="currentColor" opacity="0.85"/>
              </g>
            </svg>
          </div>
          <span class="text-xs font-semibold">{{ size.short }}</span>
        </ToggleGroupItem>
      </ToggleGroupRoot>
    </div>

  </div>
</template>

<style scoped>
/* ── Shared ────────────────────────────────────────────── */
.car-window { opacity: 0.18; }
.car-wheel  { opacity: 0.85; }
.car-hub    { opacity: 0.3; }

/* ── Variant A: Spring Bounce ─────────────────────────── */
@keyframes car-spring {
  0%   { transform: scale(1, 1)       translateY(0);    }
  20%  { transform: scale(1.07, 0.94) translateY(-5px); }
  50%  { transform: scale(0.97, 1.05) translateY(1px);  }
  70%  { transform: scale(1.03, 0.98) translateY(-2px); }
  100% { transform: scale(1, 1)       translateY(0);    }
}

.spring-car {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

[data-state='on'] .spring-car {
  animation: car-spring 0.55s cubic-bezier(0.05, 0.7, 0.1, 1) both;
}

/* ── Variant B: Drive-In ──────────────────────────────── */
.drive-right-leave-active,
.drive-right-enter-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}
.drive-right-leave-to   { transform: translateX(-64px); opacity: 0; }
.drive-right-enter-from { transform: translateX(64px);  opacity: 0; }

.drive-left-leave-active,
.drive-left-enter-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}
.drive-left-leave-to   { transform: translateX(64px);  opacity: 0; }
.drive-left-enter-from { transform: translateX(-64px); opacity: 0; }

/* ── Variant C: Ground Glow ───────────────────────────── */
.glow-shadow {
  fill: rgb(30 95 255 / 0);
  filter: blur(4px);
  transition: fill 0.45s ease, filter 0.45s ease;
}

[data-state='on'] .glow-shadow {
  fill: rgb(30 95 255 / 0.38);
  filter: blur(6px);
}
</style>
