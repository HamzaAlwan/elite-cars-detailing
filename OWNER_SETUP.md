# Owner Setup Checklist — Before Launch

Everything you need to fill in before the site goes live. All edits are in **one file** unless noted.

---

## Step 1 — Fill in your contact details

**File:** `src/data/site.ts`

Find and replace these lines:

```ts
phoneE164: '{{PHONE_E164}}',        // → e.g. '+19725551234'
phoneDisplay: '{{LOCAL_PHONE_DISPLAY}}', // → e.g. '(972) 555-1234'
email: '{{EMAIL}}',                 // → e.g. 'hello@elitemobiledetailing.com'
```

Also update your business coordinates (5+ decimal places):
```ts
lat: 0,   // → e.g. 32.94830
lng: 0,   // → e.g. -96.72990
```

And your production domain (must match everywhere):
```ts
url: 'https://www.example.com',     // → e.g. 'https://www.elitemobiledetailing.com'
```

---

## Step 2 — Set your production domain (3 places)

| File | Line to change |
|------|---------------|
| `src/data/site.ts` | `url: 'https://www.example.com'` |
| `astro.config.mjs` | `site: 'https://www.example.com'` |
| `public/robots.txt` | `Sitemap: https://www.example.com/sitemap-index.xml` |

---

## Step 3 — Add the hero photo

**File:** `src/components/sections/Hero.astro` — top of the file:

```ts
const HERO_IMAGE_SRC = ''; // → change to e.g. '/images/hero-car-detail.jpg'
```

**Photo specs:**
- Minimum: 1200 × 900 px (wider is fine)
- Format: JPG or WebP (Astro will optimize it automatically)
- Content: a freshly detailed luxury car or the self-contained rig at a home/office
- Place the file at: `public/images/hero-car-detail.jpg`

---

## Step 4 — Set up Cal.com booking (free)

1. Create an account at [cal.com](https://cal.com)
2. Create a new event type named **"Mobile Detail"**
3. In the event's **Booking Questions**, add:
   - Package (dropdown: Standard Reset / Elite Signature / Ceramic)
   - Vehicle size (dropdown: Sedan / Med SUV / Large Truck)
   - Vehicle — year, make, model (text)
   - Service address (text)
   - Notes (textarea, optional)
4. Copy your booking link slug (e.g. `elitemobiledetailing/mobile-detail`)
5. Open `src/components/islands/BookingEmbed.vue` and replace:
   ```ts
   const CAL_LINK = '{{CAL_LINK}}';
   // → e.g. const CAL_LINK = 'elitemobiledetailing/mobile-detail';
   ```

---

## Step 5 — Set up Web3Forms (free quote form)

1. Go to [web3forms.com](https://web3forms.com) → create a form → copy your **Access Key**
2. Open `src/data/site.ts` and replace:
   ```ts
   export const WEB3FORMS_ACCESS_KEY = '{{WEB3FORMS_ACCESS_KEY}}';
   // → e.g. export const WEB3FORMS_ACCESS_KEY = 'abc123-your-key-here';
   ```
3. Free tier: 250 form submissions/month. Upgrade at web3forms.com if you exceed this.

---

## Step 6 — Add the OG (social share) image

**File:** `public/og/default.jpg`

- Size: exactly **1200 × 630 px**
- Suggested content: brand logo + tagline on the dark blue background
- Replace the placeholder at `public/og/default.jpg`

---

## Step 7 — Add your before/after photos (gallery)

Place before/after photo pairs in `public/images/work/`:
```
before-sedan-exterior.jpg
after-sedan-exterior.jpg
before-suv-interior.jpg
after-suv-interior.jpg
...
```

Then open `src/components/sections/OurWork.astro` and follow the commented example to add `<BeforeAfterSlider>` components.

Caption format: `Vehicle · City · Package` (e.g. `BMW X5 · Plano · Elite Signature`)

---

## Step 8 — Confirm ceramic prices

Open `src/data/schema.ts` and verify these match your actual pricing:
```ts
// In the SERVICES array:
priceRange: '$650–$1,995',
```
Update if different.

---

## Step 9 — Connect Cloudflare Pages

1. Push this repo to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → Create a project → Connect GitHub
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `22`
4. Add your custom domain in the Cloudflare Pages dashboard
5. Set environment variable `NODE_VERSION = 22` in Pages settings

---

## Step 10 — Submit to Google Search Console

After deploying:
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://yourdomain.com`
3. Verify via the HTML tag method (Cloudflare Pages supports meta tag verification)
4. Submit sitemap: `https://yourdomain.com/sitemap-index.xml`

---

## Optional — Add Google Analytics / Umami

If you want Umami analytics (free, cookieless, no consent banner needed):

1. Create account at [umami.is](https://umami.is) or self-host
2. Add your website → copy the **Script URL** and **Website ID**
3. Add to `src/layouts/Layout.astro` inside `<head>`:
   ```html
   <script defer src="https://analytics.umami.is/script.js" data-website-id="YOUR-ID"></script>
   ```

---

## Quick checklist before hitting "Deploy"

- [ ] Phone number set in `site.ts`
- [ ] Email set in `site.ts`
- [ ] Domain set in `site.ts` + `astro.config.mjs` + `robots.txt`
- [ ] Hero photo added + `HERO_IMAGE_SRC` set in `Hero.astro`
- [ ] Cal.com event type created + `CAL_LINK` set in `BookingEmbed.vue`
- [ ] Web3Forms key set in `site.ts`
- [ ] OG image at `public/og/default.jpg`
- [ ] At least 2–3 before/after photos in `public/images/work/`
- [ ] Ceramic prices verified in `schema.ts`
- [ ] `npm run build` passes with no errors
- [ ] Site tested on real iPhone (glass nav, sticky bar, booking form)
