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
import { ref, reactive, nextTick, computed } from 'vue';
import { WEB3FORMS_ACCESS_KEY, CONTACT, CTA } from '@/data/site';
import { hasConfiguredPhone } from '@/lib/contact';
import {
  validateName as checkName,
  validatePhone as checkPhone,
  validateEmail as checkEmail,
  formatUsPhone,
  quoteSchema,
} from '@/lib/validation';

const hasPhone = hasConfiguredPhone(CONTACT.phoneE164);

type Status = 'idle' | 'loading' | 'success' | 'error';

const status = ref<Status>('idle');
const errorMessage = ref('');
const isAdditionalDetailsOpen = ref(false);

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
  email: '',
});

function onNameBlur() {
  errors.name = checkName(fields.name);
}

function onPhoneBlur() {
  // Auto-format on blur so the field reads (XXX) XXX-XXXX, then validate.
  if (fields.phone.trim()) fields.phone = formatUsPhone(fields.phone);
  errors.phone = checkPhone(fields.phone);
}

function onEmailBlur() {
  errors.email = checkEmail(fields.email);
}

async function focusFirstError() {
  await nextTick();
  const order: Array<keyof typeof errors> = ['name', 'phone', 'email'];
  const first = order.find((k) => errors[k]);
  if (first) document.getElementById(`q-${first}`)?.focus();
}

const liveStatusMessage = computed((): string => {
  if (status.value === 'loading') return 'Sending your quote request.';
  if (status.value === 'success') return 'Quote request sent successfully.';
  if (status.value === 'error') return `Quote request failed. ${errorMessage.value}`;
  return '';
});

async function submit() {
  const result = quoteSchema.safeParse({ ...fields });
  if (!result.success) {
    errors.name = '';
    errors.phone = '';
    errors.email = '';
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (key === 'name' || key === 'phone' || key === 'email') errors[key] = issue.message;
    }
    focusFirstError();
    return;
  }

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
    errorMessage.value =
      err instanceof Error ? err.message : 'Something went wrong. Please try again.';
  }
}
</script>

<template>
  <Transition name="quote-form" mode="out-in">
    <!-- Success state -->
    <div
      v-if="status === 'success'"
      key="success"
      class="surface-raised p-6 text-center md:p-8"
    >
      <svg
        class="icon-draw is-drawn mx-auto text-success"
        width="36"
        height="36"
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
      <p class="mt-3 text-lg font-semibold text-text">Thanks, we'll be in touch soon!</p>
      <p class="mt-1 text-sm text-text-muted">
        We'll call or text you back within a few hours to discuss your vehicle and book a time.
      </p>
      <a
        href="#book"
        class="btn-metal mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-6 text-sm font-medium"
      >
        {{ CTA.book }}
      </a>
    </div>

    <!-- Form -->
    <form
      v-else
      key="form"
      novalidate
      class="space-y-4"
      aria-label="Quote request form"
      @submit.prevent="submit"
    >
      <p class="sr-only" aria-live="polite">
        {{ liveStatusMessage }}
      </p>

      <!-- Honeypot — spam protection -->
      <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" aria-hidden="true" />

      <div class="grid gap-4 md:grid-cols-2">
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
            class="form-input"
            @blur="onNameBlur"
          />
          <p v-if="errors.name" id="q-name-err" role="alert" class="mt-1.5 text-xs text-warning">
            {{ errors.name }}
          </p>
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
            class="form-input"
            @blur="onPhoneBlur"
          />
          <p v-if="errors.phone" id="q-phone-err" role="alert" class="mt-1.5 text-xs text-warning">
            {{ errors.phone }}
          </p>
        </div>
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
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'q-email-err' : undefined"
          placeholder="you@example.com"
          class="form-input"
          @blur="onEmailBlur"
        />
        <p v-if="errors.email" id="q-email-err" role="alert" class="mt-1.5 text-xs text-warning">
          {{ errors.email }}
        </p>
      </div>

      <!-- Vehicle -->
      <div class="rounded-xl border border-border bg-bg-elevated px-4 py-3">
        <button
          type="button"
          class="flex min-h-11 w-full cursor-pointer items-center justify-between text-left text-sm font-medium text-text"
          :aria-expanded="isAdditionalDetailsOpen"
          aria-controls="q-optional-details"
          @click="isAdditionalDetailsOpen = !isAdditionalDetailsOpen"
        >
          <span>Add more details for a faster quote (optional)</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="transition-transform duration-150"
            :class="{ 'rotate-180': isAdditionalDetailsOpen }"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <Transition name="quote-form">
        <div v-if="isAdditionalDetailsOpen" id="q-optional-details" class="space-y-4">
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
              class="form-input"
            />
          </div>

          <!-- Service interest -->
          <div>
            <label for="q-service" class="mb-1.5 block text-sm font-medium text-text">
              Service interested in
            </label>
            <select id="q-service" v-model="fields.service" class="form-input">
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
              class="form-input"
            ></textarea>
          </div>
        </div>
      </Transition>

      <!-- Error feedback -->
      <div
        v-if="status === 'error'"
        role="alert"
        class="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning"
      >
        {{ errorMessage }} —
        <a v-if="hasPhone" :href="`tel:${CONTACT.phoneE164}`" class="underline">call us instead</a>
        <span v-else>please try again or refresh the page</span>.
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="status === 'loading'"
        class="btn-metal inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full font-medium"
        :class="{ 'cursor-wait opacity-60': status === 'loading' }"
      >
        <svg
          v-if="status === 'loading'"
          class="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.22-8.56" />
        </svg>
        {{ status === 'loading' ? 'Sending…' : CTA.quote }}
      </button>

      <p class="text-center text-xs text-text-muted">
        We'll call or text you back within a few hours. No card required upfront.
      </p>
    </form>
  </Transition>
</template>
