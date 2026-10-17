@AGENTS.md

# Jhajj'z website redesign

Redesign of **jhajjz.in** (currently on Wix) for the client **Jhajj'z**, a luxury car and coach
rental company in Mohali/Chandigarh. Built by Nirmal for the client. Design was approved on a
Claude design canvas first, then ported here.

## Stack

- Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` on), React 19, TypeScript
- Tailwind CSS v4 (tokens in `app/globals.css` under `@theme`), `tw-animate-css` for enter/exit animations
- shadcn/ui-style components in `components/ui/` — written by hand on Radix primitives because the
  shadcn registry was unreachable when they were made. They follow shadcn conventions, so
  `npx shadcn add …` works alongside them.
- `motion` (Framer Motion) for scroll reveals, staggered lists, fleet filter transitions
- Fonts self-hosted via Fontsource: **Playfair Display** (headings) + **DM Sans Variable** (body)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Structure

```
app/
  page.tsx                 Home: hero, booking bar, fleet preview, weddings, services, about, CTA
  fleet/page.tsx           Full fleet with filter tabs (components/fleet-browser.tsx)
  contact/page.tsx         Quote form (components/quote-form.tsx) + contact details
  privacy-policy/page.tsx  Placeholder — text still needed
components/
  site-header.tsx          Fixed header; transparent over the home hero until scroll; Fleet mega-menu; mobile sheet
  site-footer.tsx
  booking-bar.tsx          Occasion / city / date / vehicle → pushes to /contact?… as query params
  quote-form.tsx           Pre-fills from those query params
  motion.tsx               Reveal, Enter, Stagger, StaggerItem, MotionProvider (respects reduced motion)
  ui/                      button, select, navigation-menu, sheet
lib/site.ts                ALL client facts: contact, cities, services, fleet, photos. Edit here, not in pages.
```

## Client facts (from jhajjz.in — do not change without the client)

- Founded **1998** in Chandigarh. Office: SSS-106, 107, PCA Stadium Road, Sector 63, Mohali (SAS Nagar), Punjab
- Phones +91 98036 00001, +91 98144 00019 · info.jhajjz@gmail.com · WhatsApp on the first number
- **14 cities**: Chandigarh, New Delhi, Gurgaon, Jaipur, Udaipur, Mumbai, Chennai, Kolkata, Bhubaneswar,
  Dehradun, Mussoorie, Rishikesh, Haridwar, Ropar
- Brands: Rolls-Royce, Mercedes-Benz, BMW, Audi, Range Rover; coaches by Volvo and Mercedes-Benz
- 9 vehicle classes and 9 services — see `lib/site.ts`

The v0 reference design (`redesign-jhajjz-in.zip`) got several facts wrong — never copy these from it:
"Est. 2014", phone +91 98765 43210, hello@jhajjz.in, "a small fleet", Chandigarh-only.

## Design rules (agreed with Nirmal)

- Palette: ink `#151514`, paper `#F4F2EE`, sand `#EAE6DE`, champagne gold `#C5A47E` (accent only),
  deep gold `#7A5E3A` for gold text on light backgrounds (contrast)
- Spacing: one scale. Sections `py-[72px] md:py-28`, content `max-w-[1200px] px-6`,
  heading→body 20–24px, body→button 32px, card grids `gap-x-6 gap-y-8`
- **Keep it from looking AI-made.** Nirmal explicitly rejected: gold eyebrow labels with lines above
  every heading, italic-gold second line in every headline, vertical "J / 1998" text, gold edge strips,
  ↗ arrows everywhere, 01–09 numbering, ALL-CAPS tracked buttons, slogan copy ("Quiet confidence",
  "The art of arrival"). Write plain, specific copy in the client's voice. Sentence-case buttons.
- Body text ≥15px (the reference used 9–11px). Touch targets ≥44px.
- Animations: subtle and purposeful — fade/lift on scroll, staggered lists, animated dropdowns,
  hero slow zoom. Everything must respect `prefers-reduced-motion` (already wired).
- Never invent stats, car models, testimonials or contact details. Use `[BRACKETS]` for unknowns.

## Open items

- [ ] **Photos**: all fleet photos are hot-linked from Wix (`static.wixstatic.com`, allowed in
      `next.config.ts`). The image→category mapping in `lib/site.ts` was inferred from page order and
      **has not been visually checked**. Get originals from the client, put them in `/public`, fix the mapping.
- [ ] **Hero**: currently the client's Wix sharing image. `/public/rolls-royce-hero.webp` (from the v0
      reference, probably AI-generated) is the alternative — swap `heroImage` in `lib/site.ts`.
- [ ] **Quote form doesn't send anything yet** — only shows a thank-you state. Wire to email / WhatsApp /
      a form service (e.g. Netlify Forms, Resend, Formspree).
- [ ] Seat counts for limousines, coaches and mini vans (`[SEATS]` in `lib/site.ts`)
- [ ] Privacy policy text (copy from jhajjz.in/privacy-policy)
- [ ] Favicon / logo — client has a logo on Wix; get the file
- [ ] Deploy preview: Netlify site `jhajjz-preview` exists (empty). Vercel project creation was refused
      for Nirmal's connected team (permissions). **Never touch the existing Vercel project "aethal".**

## Changelog

- 2026-10-17 — Initial build: Home, Fleet, Contact, Privacy placeholder; animated selects, Fleet
  mega-menu, mobile sheet menu, scroll reveals, fleet filter animations. Production build passes.
