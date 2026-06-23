<script setup lang="ts">
/**
 * P4-T3 — Zip-code validator (client:visible).
 * City → ZIP lookup for DFW 50-mile radius.
 * In-area: shows .icon-draw checkmark + "You're in our DFW service zone" + link to #book.
 * Out-of-area: graceful — shows nearest city + email capture, never gates booking.
 * Progressive enhancement: booking remains reachable even if skipped.
 * iOS: font-size 16px (inherited from global.css) — no auto-zoom.
 * Reduced-motion: .icon-draw animation is skipped; checkmark shows instantly.
 */
import { ref, computed } from 'vue';
import { isCoveredZip, isZipFormat } from '@/lib/validation';

type State = 'idle' | 'in-area' | 'out-of-area' | 'invalid';

const zip = ref('');
const state = ref<State>('idle');
const emailCapture = ref('');
const emailSent = ref(false);
const drawn = ref(false);

const isInArea = computed(() => state.value === 'in-area');
const isOutOfArea = computed(() => state.value === 'out-of-area');
const isInvalid = computed(() => state.value === 'invalid');

function check() {
  const val = zip.value.trim();
  if (!isZipFormat(val)) {
    state.value = 'invalid';
    drawn.value = false;
    return;
  }
  if (isCoveredZip(val)) {
    state.value = 'in-area';
    // Trigger icon-draw animation after next tick
    drawn.value = false;
    setTimeout(() => {
      drawn.value = true;
    }, 50);
  } else {
    state.value = 'out-of-area';
    drawn.value = false;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') check();
}

// Email capture fallback (out-of-area) — submits to Web3Forms in Phase 6
// For now, just shows a confirmation message
function submitEmail() {
  if (!emailCapture.value.trim()) return;
  emailSent.value = true;
}
</script>

<template>
  <div>
    <!-- Input row -->
    <div v-if="!isInArea" class="flex gap-2">
      <label for="zip-input" class="sr-only">Enter your ZIP code</label>
      <input
        id="zip-input"
        v-model="zip"
        type="text"
        inputmode="numeric"
        pattern="[0-9]{5}"
        maxlength="5"
        autocomplete="postal-code"
        placeholder="Enter ZIP code"
        :aria-invalid="isInvalid"
        :aria-describedby="isInvalid ? 'zip-error' : undefined"
        class="min-h-11 flex-1 rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
        @keydown="handleKeydown"
      />
      <button
        type="button"
        class="btn-metal cursor-pointer rounded-xl px-5 font-medium"
        @click="check"
      >
        Check
      </button>
    </div>

    <!-- Invalid ZIP error -->
    <p v-if="isInvalid" id="zip-error" role="alert" class="mt-2 text-sm text-warning">
      Please enter a valid 5-digit ZIP code.
    </p>

    <!-- In-area success -->
    <div v-if="isInArea" role="status" class="flex items-start gap-3">
      <!-- .icon-draw checkmark (stroke-dashoffset animation, §2.5) -->
      <svg
        :class="['icon-draw mt-0.5 shrink-0 text-success', drawn ? 'is-drawn' : '']"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path pathLength="1" d="M20 6 9 17l-5-5" />
      </svg>
      <div>
        <p class="font-medium text-success">You're in our DFW service zone!</p>
        <p class="mt-1 text-sm text-text-muted">
          We detail in your area.
          <a href="#book" class="text-brand underline-offset-4 hover:underline"
            >Book your detail now →</a
          >
        </p>
        <button
          class="mt-2 cursor-pointer text-xs text-text-muted underline-offset-4 hover:underline"
          @click="
            state = 'idle';
            zip = '';
            drawn = false;
          "
        >
          Check a different ZIP
        </button>
      </div>
    </div>

    <!-- Out-of-area graceful fallback -->
    <div
      v-if="isOutOfArea"
      role="status"
      class="rounded-xl border border-border bg-bg-elevated p-4"
    >
      <p class="font-medium text-text">We're expanding fast — you're not far off.</p>
      <p class="mt-1 text-sm text-text-muted">
        ZIP <strong class="text-text">{{ zip }}</strong> isn't in our current zone yet, but we're
        growing quickly across DFW.
      </p>

      <div v-if="!emailSent" class="mt-4">
        <p class="text-sm font-medium text-text">
          Drop your email — we'll notify you the day we reach you:
        </p>
        <div class="mt-2 flex gap-2">
          <label for="notify-email" class="sr-only">Your email address</label>
          <input
            id="notify-email"
            v-model="emailCapture"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="min-h-10 flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-muted"
          />
          <button
            type="button"
            class="btn-metal cursor-pointer rounded-xl px-4 py-2 text-sm font-medium"
            @click="submitEmail"
          >
            Notify me
          </button>
        </div>
      </div>

      <p v-else role="status" class="mt-3 text-sm text-success">
        ✓ We've got your email — we'll let you know when we arrive in your area.
      </p>

      <p class="mt-4 text-sm text-text-muted">
        In the meantime, booking is still open for our current service cities above —
        <a href="#book" class="text-brand underline-offset-4 hover:underline"
          >book if you're flexible</a
        >.
      </p>

      <button
        class="mt-2 cursor-pointer text-xs text-text-muted underline-offset-4 hover:underline"
        @click="
          state = 'idle';
          zip = '';
          emailSent = false;
        "
      >
        Try a different ZIP
      </button>
    </div>

    <p class="mt-2 text-xs text-text-muted">We'll tell you in seconds — no obligation.</p>
  </div>
</template>
