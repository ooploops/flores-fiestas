# Flores Fiestas

An editorial single-page site for a boutique event styling and celebration business. Portfolio panels in this preview are CSS concept artwork, not photographs of completed Flores Fiestas events.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Content and assets

- Hero and gallery images are Pexels stock placeholders in `public/images/` (Pexels license, free for commercial use, attribution optional). Photographers: jonathanborba, bertellifotografia, zeynep, moralestorres98, caio-mantovani. Replace each file, keep the paths or edit `image`, `focus` and `alt` in `src/data/siteContent.js`, and remove the visible "Stock photo placeholder" labels.

- Edit business copy, services, gallery labels, event options, and contact placeholders in `src/data/siteContent.js`.
- Replace the CSS concept scenes in `src/components/EditorialSections.jsx` with approved brand photography. Preserve the image proportions and add descriptive alt text to real images.
- Update the contact and social placeholders in `src/data/siteContent.js` when verified business details are available.
- Replace `public/favicon.svg` and `public/og-preview.svg` with approved logo and social-share assets when supplied. The current wordmark is a temporary typographic treatment, not a recreation of the business-card logo.
- The inquiry form is intentionally local-only. Connect a vetted form service or backend before accepting live inquiries.

## Motion and accessibility

GSAP and ScrollTrigger provide restrained entrances and the process-line reveal. Animations are skipped when the visitor requests reduced motion. The mobile menu supports Escape and keyboard focus containment; the gallery viewer supports Escape, arrow-key navigation, and focus containment.