<script setup lang="ts">
/**
 * P6-T3 — Quote form island (client:visible).
 * Submits to Web3Forms (free tier, 250/mo). No backend needed.
 * Fields: name, phone, email (opt), vehicle, service interest.
 * Inline validation on blur. Success/error states.
 * Reduced to 4 core fields for maximum conversion (spec §4.9).
 *
 * OWNER ACTION: Replace WEB3FORMS_ACCESS_KEY in src/data/site.ts with your real key
 * from web3forms.com before launch (P9-T2).
 */
import { ref, reactive } from 'vue';
import { WEB3FORMS_ACCESS_KEY, CONTACT } from '@/data/site';

const hasPhone = CONTACT.phoneE164 !== '{{PHONE_E164}}';

type Status = 'idle' | 'loading' | 'success' | 'error';

const status = ref<Status>('idle');
const errorMessage = ref('');

const fields = reactive({
  name: '',
  phone: '',
  email: '',
  vehicle: '',
  service: '',
  notes: '',
});

const errors = reactive({
  name: '',
  phone: '',
});

function validateName() {
  errors.name = fields.name.trim().length < 2 ? 'Please enter your name.' : '';
}

function validatePhone() {
  const digits = fields.phone.replace(/\D/g, '');
  errors.phone = digits.length < 10 ? 'Please enter a valid phone number.' : '';
}

const isValid = () => !errors.name && !errors.phone && fields.name.trim() && fields.phone.trim();

async function submit() {
  validateName();
  validatePhone();
  if (!isValid()) return;

  status.value = 'loading';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        vehicle: fields.vehicle,
        service: fields.service,
        notes: fields.notes,
        subject: `New quote request — ${fields.name} (${fields.service || 'General'})`,
        botcheck: '',
      }),
    });
    const data = await res.json();
    if (data.success) {
      status.value = 'success';
    } else {
      throw new Error(data.message ?? 'Submission failed');
    }
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
  }
}
</script>

<template>
  <!-- Success state -->
  <div v-if="status === 'success'" role="status" class="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
    <svg class="mx-auto text-success icon-draw is-drawn" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path pathLength="1" d="M20 6 9 17l-5-5" />
    </svg>
    <p class="mt-3 text-lg font-semibold text-text">Thanks, we'll be in touch soon!</p>
    <p class="mt-1 text-sm text-text-muted">
      We'll call or text you back within a few hours to discuss your vehicle and book a time.
    </p>
  </div>

  <!-- Form -->
  <form
    v-else
    @submit.prevent="submit"
    novalidate
    class="space-y-4"
    aria-label="Quote request form"
  >
    <!-- Honeypot — spam protection -->
    <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" aria-hidden="true" />

    <!-- Name -->
    <div>
      <label for="q-name" class="mb-1.5 block text-sm font-medium text-text">
        Your name <span aria-hidden="true" class="text-text-muted">*</span>
      </label>
      <input
        id="q-name"
        v-model="fields.name"
        type="text"
        autocomplete="name"
        required
        :aria-invalid="!!errors.name"
        :aria-describedby="errors.name ? 'q-name-err' : undefined"
        placeholder="e.g. Alex Johnson"
        class="min-h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
        @blur="validateName"
      />
      <p v-if="errors.name" id="q-name-err" role="alert" class="mt-1.5 text-xs text-warning">{{ errors.name }}</p>
    </div>

    <!-- Phone -->
    <div>
      <label for="q-phone" class="mb-1.5 block text-sm font-medium text-text">
        Phone number <span aria-hidden="true" class="text-text-muted">*</span>
      </label>
      <input
        id="q-phone"
        v-model="fields.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        required
        :aria-invalid="!!errors.phone"
        :aria-describedby="errors.phone ? 'q-phone-err' : undefined"
        placeholder="(972) 555-1234"
        class="min-h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
        @blur="validatePhone"
      />
      <p v-if="errors.phone" id="q-phone-err" role="alert" class="mt-1.5 text-xs text-warning">{{ errors.phone }}</p>
    </div>

    <!-- Email (optional) -->
    <div>
      <label for="q-email" class="mb-1.5 block text-sm font-medium text-text">
        Email <span class="ml-1 text-xs font-normal text-text-muted">(optional)</span>
      </label>
      <input
        id="q-email"
        v-model="fields.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="you@example.com"
        class="min-h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
      />
    </div>

    <!-- Vehicle -->
    <div>
      <label for="q-vehicle" class="mb-1.5 block text-sm font-medium text-text">
        Vehicle <span class="ml-1 text-xs font-normal text-text-muted">(year, make, model)</span>
      </label>
      <input
        id="q-vehicle"
        v-model="fields.vehicle"
        type="text"
        autocomplete="off"
        placeholder="e.g. 2022 BMW X5"
        class="min-h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
      />
    </div>

    <!-- Service interest -->
    <div>
      <label for="q-service" class="mb-1.5 block text-sm font-medium text-text">
        Service interested in
      </label>
      <select
        id="q-service"
        v-model="fields.service"
        class="min-h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text focus:border-brand focus:outline-none"
      >
        <option value="" disabled>Select a package…</option>
        <option value="standard-reset">The Standard Reset</option>
        <option value="elite-signature">The Elite Signature</option>
        <option value="ceramic-upgrade">Ceramic Showroom Upgrade</option>
        <option value="not-sure">Not sure — need a recommendation</option>
      </select>
    </div>

    <!-- Notes -->
    <div>
      <label for="q-notes" class="mb-1.5 block text-sm font-medium text-text">
        Anything else we should know?
        <span class="ml-1 text-xs font-normal text-text-muted">(optional)</span>
      </label>
      <textarea
        id="q-notes"
        v-model="fields.notes"
        rows="3"
        placeholder="Pet hair, specific concerns, preferred timing, address…"
        class="w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-text placeholder:text-text-muted focus:border-brand focus:outline-none"
      ></textarea>
    </div>

    <!-- Error feedback -->
    <div v-if="status === 'error'" role="alert" class="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
      {{ errorMessage }} —
      <a v-if="hasPhone" :href="`tel:${CONTACT.phoneE164}`" class="underline">call us instead</a>
      <span v-else>please try again or refresh the page</span>.
    </div>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="status === 'loading'"
      class="btn-metal inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full font-medium"
      :class="{ 'opacity-60 cursor-wait': status === 'loading' }"
    >
      <svg v-if="status === 'loading'" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
      </svg>
      {{ status === 'loading' ? 'Sending…' : 'Send My Quote Request' }}
    </button>

    <p class="text-center text-xs text-text-muted">
      We'll call or text you back within a few hours. No card required upfront.
    </p>
  </form>
</template>
