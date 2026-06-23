# Brand logos

Drop **official** brand SVG logos here, then point each product at its file in
`src/components/sections/SocialProof.astro` (set the `logo` field), e.g.:

```ts
{ name: "Meguiar's", note: 'Wash & clay', logo: '/logos/meguiars.svg' },
{ name: 'CarPro',    note: 'Decon & ceramic', logo: '/logos/carpro.svg' },
{ name: 'Gyeon',     note: 'Ceramic coatings', logo: '/logos/gyeon.svg' },
```

Guidelines:
- Use **official** vector assets only; keep correct proportions (don't distort).
- Single-color/monochrome SVGs render best — the strip greyscales them at rest and reveals
  full color + a lift on hover (pointer devices only; touch shows them full & legible).
- Until a `logo` is set, a styled text wordmark ships as the fallback.

Suggested filenames: `meguiars.svg`, `carpro.svg`, `gyeon.svg`.
