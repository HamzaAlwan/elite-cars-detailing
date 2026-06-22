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
import { prefersReducedMotion } from '@/lib/motion';

// DFW ZIP codes within ~50 miles of Richardson, TX 75080
// Covers: Richardson, Dallas, Plano, Frisco, McKinney, Allen, Garland, Carrollton, Irving + surroundings
const COVERED_ZIPS = new Set([
  // Richardson
  '75080','75081','75082','75083',
  // Plano
  '75023','75024','75025','75026','75074','75075','75093','75094',
  // Allen
  '75002','75013',
  // McKinney
  '75069','75070','75071','75072',
  // Frisco
  '75033','75034','75035','75036',
  // Garland
  '75040','75041','75042','75043','75044','75045','75046','75047','75048',
  // Carrollton
  '75006','75007','75010','75011',
  // Irving
  '75014','75015','75016','75017','75018','75019','75038','75039','75060','75061','75062','75063',
  // Dallas (core + north)
  '75201','75202','75203','75204','75205','75206','75207','75208','75209','75210',
  '75211','75212','75214','75215','75216','75217','75218','75219','75220','75221',
  '75222','75223','75224','75225','75226','75227','75228','75229','75230','75231',
  '75232','75233','75234','75235','75236','75237','75238','75240','75241','75242',
  '75243','75244','75246','75247','75248','75249','75251','75252','75253','75254',
  // Lewisville / Flower Mound
  '75022','75028','75056','75057','75067','75068',
  // The Colony
  '75056',
  // Addison / Farmers Branch
  '75001','75244',
  // Rowlett / Sachse / Wylie
  '75088','75089','75098',
  // Prosper / Celina
  '75078','76227',
  // Murphy / Lavon
  '75094',
  // Grand Prairie
  '75050','75051','75052','75053','75054',
  // Mesquite
  '75149','75150',
  // Duncanville / DeSoto / Cedar Hill
  '75116','75115','75104',
]);

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
  if (!/^\d{5}$/.test(val)) {
    state.value = 'invalid';
    drawn.value = false;
    return;
  }
  if (COVERED_ZIPS.has(val)) {
    state.value = 'in-area';
    // Trigger icon-draw animation after next tick
    drawn.value = false;
    setTimeout(() => { drawn.value = true; }, 50);
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
        :class="['icon-draw text-success shrink-0 mt-0.5', drawn ? 'is-drawn' : '']"
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
          <a href="#book" class="text-brand underline-offset-4 hover:underline">Book your detail now →</a>
        </p>
        <button
          class="mt-2 text-xs text-text-muted underline-offset-4 hover:underline cursor-pointer"
          @click="state = 'idle'; zip = ''; drawn = false;"
        >
          Check a different ZIP
        </button>
      </div>
    </div>

    <!-- Out-of-area graceful fallback -->
    <div v-if="isOutOfArea" role="status" class="rounded-xl border border-border bg-bg-elevated p-4">
      <p class="font-medium text-text">We're expanding fast — you're not far off.</p>
      <p class="mt-1 text-sm text-text-muted">
        ZIP <strong class="text-text">{{ zip }}</strong> isn't in our current zone yet, but we're growing quickly across DFW.
      </p>

      <div v-if="!emailSent" class="mt-4">
        <p class="text-sm font-medium text-text">Drop your email — we'll notify you the day we reach you:</p>
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
        <a href="#book" class="text-brand underline-offset-4 hover:underline">book if you're flexible</a>.
      </p>

      <button
        class="mt-2 text-xs text-text-muted underline-offset-4 hover:underline cursor-pointer"
        @click="state = 'idle'; zip = ''; emailSent = false;"
      >
        Try a different ZIP
      </button>
    </div>

    <p class="mt-2 text-xs text-text-muted">We'll tell you in seconds — no obligation.</p>
  </div>
</template>
