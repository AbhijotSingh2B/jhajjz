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
More than one Claude session has pushed to `main` at the same time: always `git pull` before starting and
before pushing, and merge (never force-push) if someone else's commit arrives.

## Working in the Claude cloud sandbox

- Network: `static.wixstatic.com`, `jhajjz.in` and `vercel.app` are blocked (proxy 403), so fleet photos don't
  load locally and the live preview can't be opened. To judge layouts, Playwright can stand in a local image:
  `page.route(/_next\/image\?url=https/, r => r.fulfill({ path: 'public/rolls-royce-hero.webp' }))`.
- Playwright: `require('/opt/node22/lib/node_modules/playwright')`; Chromium only (no WebKit, so iPhone Safari
  behaviour can't be reproduced — ask Nirmal to check on his phone). Don't run `playwright install`.
- Verify against a production build (`npm run build && npx next start -p 3001`), not a long-running `next dev`:
  the dev server served stale CSS once (footer lost its background) and made a working change look broken.
- Python helpers (fontTools, Pillow) go in a venv in the scratchpad; the favicon was made that way from the
  "J" glyph of Libre Caslon Display.
- Nirmal reviews on his iPhone at jhajjz.vercel.app; it lags a few pushes behind while Vercel redeploys.

## How Nirmal likes to work

- Wants changes done and pushed, then a short summary of what changed and anything that still needs the client.
- Only verified facts: nothing invented, even "safe" defaults (e.g. languages spoken were removed from JSON-LD).
- Very sensitive to anything that looks AI-made or templated — check new UI against the "avoid" list below.
- Wording he set: "Talk to us on WhatsApp" (never "WhatsApp us"); hero line "Head office in Chandigarh,
  serving pan-India"; "stations" isn't used in the About city list heading ("Pan-India, including").

## Structure

```
app/
  page.tsx                 Home: hero, booking bar, fleet preview, weddings photo band, "Who we drive for"
                           (rate-card rows), "Chandigarh, since 1998" about + city list
  fleet/page.tsx           Full fleet with search + filter tabs (components/fleet-browser.tsx)
  contact/page.tsx         Quote form (components/quote-form.tsx) + contact details
  privacy-policy/page.tsx  Drafted policy; 3 highlighted [CONFIRM] items for the client
  not-found.tsx            Branded 404
components/
  site-header.tsx          Fixed header (Home, Fleet, Weddings, Services, About, Contact); transparent over the home hero until scroll; Fleet mega-menu; mobile sheet
  site-footer.tsx          Also renders the phone-only sticky Call / WhatsApp bar
  booking-bar.tsx          "Start a quote": occasion / city / date (all start empty) → pushes to /contact?… as query params
  quote-form.tsx           Pre-fills from those query params; "Other" opens a text box; submit opens the
                           WhatsApp popup with the details written out (nothing stored server-side)
  contact-dialog.tsx       <ContactDialog channel="call|whatsapp|email|all"> wraps any button → animated popup
                           ("all" opens on the "Get in touch" list; used by the "Contact us" buttons)
                           (both numbers / WhatsApp / email, copy buttons, "Other ways to reach us" list)
  page-transition.tsx      Fade-and-lift between pages (React <ViewTransition>); wraps each page's <main>
  india-map.tsx            India outline (lib/india-map.ts, Survey of India boundary) + city dots, beside "Pan-India, including"
  motion.tsx               Reveal, Enter, Stagger, StaggerItem, MotionProvider (respects reduced motion)
  icons.tsx                WhatsApp glyph (Simple Icons) + social icons (Tabler, MIT); lucide has no brand icons
  ui/                      button, select, navigation-menu, sheet, dialog (bottom sheet on phones)
proxy.ts                   Adds `X-Robots-Tag: noindex` on every host except www.jhajjz.in / jhajjz.in (previews)
app/sitemap.ts, robots.ts, manifest.ts   SEO files; all URLs use `siteUrl` from lib/site.ts
app/icon.svg, favicon.ico, apple-icon.png, public/icon-192/512.png   Placeholder "Jhajj'z" wordmark favicon
components/structured-data.tsx   Schema.org JSON-LD (AutoRental business, WebSite, breadcrumbs) from lib/site.ts
lib/seo.ts                 `openGraphBase`: spread into every page's openGraph (Next doesn't deep-merge it)
lib/india-map.ts           Map path + city positions (generated with mapshaper; source and method in the file header)
lib/site.ts                ALL client facts: contact, cities, services, fleet, photos. Edit here, not in pages.
```

## Client facts (from jhajjz.in — do not change without the client)

- Founded **1998** in Chandigarh. Office: SSS-106, 107, PCA Stadium Road, Sector 63, Mohali (SAS Nagar), Punjab
- Phones +91 98036 00001 (the Mohali office's number, per Nirmal), +91 98144 00019 · info.jhajjz@gmail.com · WhatsApp on the first number
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
  Also avoid (caught in a 2026-10-17 audit): icons inside coloured squares (feature cards, popup headers, option
  lists), three-equal-cards feature grids, boxes with a gold left stripe, a → after every link (one per screen at
  most), browser-default UI that clashes with the palette (e.g. the blue search clear ×).
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
- [ ] Favicon / logo — placeholder favicon is the word "Jhajj'z" in gold Caslon on ink (made from the heading font
      with fontTools, see app/icon.svg; PNGs use a narrower word to fit the maskable safe zone). Swap for the client's real logo when we have the file; regenerate all 5 icon files.
- [ ] **SEO at launch** (code is ready; these are outside the repo):
      1. Point www.jhajjz.in at Vercel — the noindex on previews switches off automatically for that host.
      2. 301-redirect every old Wix URL to its new page (`redirects()` in next.config.ts) so rankings carry over.
         Needs the list of Wix URLs (Search Console → Pages, or a crawl of jhajjz.in).
      3. Google Search Console: verify the domain, submit https://www.jhajjz.in/sitemap.xml.
      4. Google Business Profile for the Mohali office (same name, address, phone as the site) — the single
         biggest factor for "luxury car rental Chandigarh"-type local searches. Ask the client for reviews there.
- [ ] Deploy preview: Nirmal views the site at **https://jhajjz.vercel.app**. Claude's cloud sandbox can't load it
      (network policy blocks vercel.app; the Vercel connector has no access to that project). Netlify site
      `jhajjz-preview` also exists (empty). **Never touch the existing Vercel project "aethal".**

## Ideas to replace icon-in-box design (agreed direction, not built yet)

Icons were standing in for "this is a real business". Use real, specific material instead — things only
Jhajj'z has. In order of impact:

1. **Real photos** (needs client): one real photo per "Who we drive for" group — decorated car at an actual
   wedding, coach outside a hotel for a delegation, chauffeur at the door. Their Instagram has this material;
   get originals or network access to the Wix photos.
2. **Their real logo** (needs the file) in header, favicon and popup headers, replacing the placeholder "J".
3. **Map of the 14 cities** (can build now, verified data): fine-line outline of India, small gold dots for the
   14 cities, a heavier dot for the Chandigarh/Mohali head office, beside the "Pan-India, including" list.
   The outline **must follow official Survey of India boundaries** (many free world maps draw Kashmir
   differently). If no compliant outline is available, skip the map rather than use a wrong one.
4. **Small real-world details** (can build now): in the contact popups a quiet line like
   "Office: SSS-106, PCA Stadium Road, Mohali" under the numbers; a small static map of the office on /contact.
5. **Names and proof** (needs client permission): hotels, airlines or events they've driven for as a plain line
   of text (not a logo wall); one or two real client quotes with names. Never invented.

Avoid as replacements (next-generation AI tells): stat strips ("25+ years · 14 cities · 9 classes"), gradient
blobs / glassmorphism, stock photos, paper-grain or texture overlays, emoji-style or animated icons.

Status: #3 built (DataMeet india-composite, CC0, official SoI boundary). #4 partly built: office line in the popups;
the static office map on /contact is NOT built: no map tiles/geocoder reachable from the sandbox and no verified
pin for the office. Needs the office's exact coordinates (client, or Google Maps pin) plus a map image or an embed
(an embed loads Google cookies, so the privacy policy would need a line). Still ask the client for photos and logo.

## Changelog

- 2026-10-17 — Header: the "Jhajj'z" logo and Home (desktop nav and phone menu) scroll back to the top when you're
  already on the home page (e.g. after Weddings/Services/About). Before, Next skipped the same-page click and nothing happened.

- 2026-10-17 — Map check: every dot re-projected from the DataMeet source and real city coordinates; all within
  0.6 px (≈4 km) of where they should be. City dots gained a thin paper-coloured outline so close neighbours
  (Delhi/Gurgaon, the four Uttarakhand towns) stay distinct instead of merging into a smudge. Chandigarh and
  Ropar sit under the head-office marker at this scale; that's expected.

- 2026-10-17 — Favicon: full "Jhajj'z" word (gold Libre Caslon on ink) replaces the "J" monogram in all 5 icon
  files. Legible at 32px and up; at 16px (old browser tabs) it is too small to read.

- 2026-10-17 — Map: head-office dot placed at Mohali (Sector 63), not Chandigarh; caption "Head office, Mohali"
  with its number +91 98036 00001 as a call link.

- 2026-10-17 — About section: fine-line map of India (official Survey of India outline) beside the "Pan-India,
  including" list, gold dots for the 14 cities, ink ringed dot for the Mohali head office. Call / WhatsApp / Email
  popups gain a quiet "Office: SSS-106, 107, PCA Stadium Road, Mohali" line (links to Google Maps).

- 2026-10-17 — "Contact us" buttons on the privacy page (Contact section) and in the footer (under Contact) open
  the popup on its "Get in touch" list (`channel="all"`, no Back button there). Privacy page email and phone
  numbers open their popups too.

- 2026-10-17 — AI-look audit of every page: contact popup header lost its icon square; "Other ways" list icons no
  longer sit in squares; privacy "In short" is a plain lead paragraph (no gold-striped box); arrows removed from
  the rate-card links; fleet search uses its own muted × instead of the browser's blue one; booking-bar
  placeholders shortened to "Choose" so they don't truncate on phones.

- 2026-10-17 — "Who we drive for" laid out like a printed rate card: one row per group (name + "Ask about…" link
  left, services in two columns right), ink rules between rows. Replaced a three-card version with icons in
  squares, which Nirmal rightly flagged as AI/template-looking — avoid icon-in-square feature cards.

- 2026-10-17 — SEO: keyword titles/descriptions per page, canonicals to www.jhajjz.in, Open Graph/Twitter cards,
  JSON-LD (AutoRental + WebSite + breadcrumbs), sitemap, robots, web manifest, theme colour, noindex on previews
  via proxy.ts. Favicon set (placeholder "J" monogram). iPhone sideways drag: clip moved to a wrapper div in
  layout.tsx (Safari ignores overflow on html/body for touch panning).

- 2026-10-17 — iPhone: page could be dragged sideways (Safari horizontal bounce). `html, body { overflow-x: clip;
  overscroll-behavior-x: none }` in globals.css. Chromium shows no overflowing element on any page at 375/390px;
  no WebKit here to reproduce, so re-check on a real iPhone.

- 2026-10-17 — Footer: icons on every item (gold, outline). Office links to Google Maps; Contact gains a WhatsApp
  entry; social icons are Tabler brand icons copied into `components/icons.tsx` (MIT). Socials in 2 columns on phones.

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
