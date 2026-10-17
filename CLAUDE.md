@AGENTS.md

# Jhajj'z website redesign

Redesign of **jhajjz.in** (currently on Wix) for the client **Jhajj'z**, a luxury car and coach
rental company in Mohali/Chandigarh. Built by Nirmal for the client.
Repo: github.com/abhijotsingh2b/jhajjz (branch `main`). Design was approved on a
Claude design canvas first, then ported here.

## Stack

- Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` on), React 19, TypeScript
- Tailwind CSS v4 (tokens in `app/globals.css` under `@theme`), `tw-animate-css` for enter/exit animations
- shadcn/ui-style components in `components/ui/` — written by hand on Radix primitives because the
  shadcn registry was unreachable when they were made. They follow shadcn conventions, so
  `npx shadcn add …` works alongside them.
- `motion` (Framer Motion) for scroll reveals, staggered lists, fleet filter transitions
- Fonts self-hosted via Fontsource: **Libre Caslon Display** (headings; replaced Playfair, which read as template-luxury) + **DM Sans Variable** (body)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Git workflow

Push straight to `main` (no feature branches or PRs) until the site launches to the client's customers.

## Structure

```
app/
  page.tsx                 Home: hero, booking bar, fleet preview, weddings, services (grouped), about + CTA
  fleet/page.tsx           Full fleet with filter tabs (components/fleet-browser.tsx)
  contact/page.tsx         Quote form (components/quote-form.tsx) + contact details
  privacy-policy/page.tsx  Placeholder — text still needed
  not-found.tsx            Branded 404
components/
  site-header.tsx          Fixed header (Home, Fleet, Weddings, Services, About, Contact); transparent over the home hero until scroll; Fleet mega-menu; mobile sheet
  site-footer.tsx          Also renders the phone-only sticky Call / WhatsApp bar
  booking-bar.tsx          "Start a quote": occasion / city / date (all start empty) → pushes to /contact?… as query params
  quote-form.tsx           Pre-fills from those query params
  contact-dialog.tsx       <ContactDialog channel="call|whatsapp|email"> wraps any button → animated popup
                           (both numbers / WhatsApp / email, copy buttons, "Other ways to reach us" list)
  page-transition.tsx      Fade-and-lift between pages (React <ViewTransition>); wraps each page's <main>
  motion.tsx               Reveal, Enter, Stagger, StaggerItem, MotionProvider (respects reduced motion)
  ui/                      button, select, navigation-menu, sheet, dialog (bottom sheet on phones)
lib/site.ts                ALL client facts: contact, cities, services, fleet, photos. Edit here, not in pages.
```

## Client facts (from jhajjz.in — do not change without the client)

- Founded **1998** in Chandigarh. Office: SSS-106, 107, PCA Stadium Road, Sector 63, Mohali (SAS Nagar), Punjab
- Phones +91 98036 00001, +91 98144 00019 · info.jhajjz@gmail.com · WhatsApp on the first number
- **Pan-India service** (confirmed by Nirmal); stations in **14 cities**: Chandigarh, New Delhi, Gurgaon, Jaipur, Udaipur, Mumbai, Chennai, Kolkata, Bhubaneswar,
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
      **Photo pass (brief):** look at each real photo, identify the car, write the fleet entries and copy in
      `lib/site.ts`, fix the photo→category mapping, write proper alt text. Anything that can't be told from the
      photo is marked `[CONFIRM]` — never guess a model, year or spec. If jhajjz.in is reachable, do the privacy
      policy text, logo file and real office list in the same pass.
      **Prerequisite:** photos committed to `/public/fleet/`, OR the cloud environment allows
      `static.wixstatic.com` + `jhajjz.in` + `www.jhajjz.in`. As of 2026-10-17 all three are blocked (proxy 403),
      including for WebFetch.
- [ ] **Hero**: currently the client's Wix sharing image. `/public/rolls-royce-hero.webp` (from the v0
      reference, probably AI-generated) is the alternative — swap `heroImage` in `lib/site.ts`.
- [ ] **Quote form** opens the WhatsApp popup (`ContactDialog`) with the details prefilled; nothing is stored
      server-side. Confirm +91 98144 00019 is also on WhatsApp (only the first number is confirmed).
- [ ] Privacy policy: drafted from what the site actually does (no cookies/tracking; form only opens WhatsApp or
      email). Client must confirm the 3 highlighted `[CONFIRM]` items (who details are shared with, how long they're
      kept, no selling/marketing), or swap in the text from jhajjz.in/privacy-policy.
- [ ] Favicon / logo — client has a logo on Wix; get the file
- [ ] Deploy preview: Nirmal views the site at **https://jhajjz.vercel.app**. Claude's cloud sandbox can't load it
      (network policy blocks vercel.app; the Vercel connector has no access to that project). Netlify site
      `jhajjz-preview` also exists (empty). **Never touch the existing Vercel project "aethal".**

## Changelog

- 2026-10-17 — Contact page rows (Call ×2, WhatsApp, Email) and footer phone/email now open `ContactDialog`
  instead of being plain tel:/mailto: links. Only the office address still links straight out (Google Maps).

- 2026-10-17 — Privacy policy page written (plain language, "In short" summary, contact block); unknown business
  practices shown as highlighted `[CONFIRM]` marks.

- 2026-10-17 — WhatsApp logo (`components/icons.tsx`, Simple Icons glyph) replaces the chat-bubble icon; buttons
  stay ink, not WhatsApp green, to keep the palette. Popup rows: on phones the number sits on its own line with
  the buttons full-width under it, so rows never wrap unevenly.

- 2026-10-17 — "Who we drive for" rebuilt as three equal columns split by hairlines; stations list removed
  from the About section, then restored as "Pan-India, including" (no "stations" wording in that section).

- 2026-10-17 — Quote form: choosing "Other" (occasion / vehicle / city) slides open a text box for details
  (`occasionOther`, `vehicleOther`, `cityOther`) and moves focus into it.

- 2026-10-17 — Dropdowns start empty with placeholders ("Choose a city" etc.); "Other" added to occasion and
  vehicle (city already has "Other city in India"). Booking bar only passes on fields the visitor filled.

- 2026-10-17 — Contact popup (`ContactDialog`) on every "Call us" / "WhatsApp us" / "Email us" button, header phone
  and mobile sticky bar. Pan-India copy + "Other city in India" option in both forms. Light Fleet header, whole
  fleet card clickable, cities as a list, socials in one row, contact form first on phones, branded 404,
  page transitions, balanced headings, en-IN metadata. Home link in header.

- 2026-10-17 — De-templated the design using only verified content: Libre Caslon headings, smaller hero with
  WhatsApp as a text link, "Start a quote" bar (no fake availability check), featured fleet tile + swipe row on
  mobile, services grouped by customer type, CTA band folded into About, phone-only sticky Call/WhatsApp bar,
  no ↗ arrows on Contact.

- 2026-10-17 — Pushed to github.com/abhijotsingh2b/jhajjz.
- 2026-10-17 — Initial build: Home, Fleet, Contact, Privacy placeholder; animated selects, Fleet
  mega-menu, mobile sheet menu, scroll reveals, fleet filter animations. Production build passes.
