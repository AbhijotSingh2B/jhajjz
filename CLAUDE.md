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

- Network: since 2026-10-17 jhajjz.in, static.wixstatic.com, carwale/aeplcdn and cardekho load (Nirmal opened the
  environment's network). `vercel.app` untested. Images are `unoptimized` (no `/_next/image`), so photos load
  straight from their hosts in Playwright too; no stand-in needed.
- **Images: no Vercel image optimization (Nirmal).** `images.unoptimized: true` in next.config.ts, so every
  photo is served as-is. **All photos are saved in `public/photos/`** (Nirmal, so the site doesn't depend on Wix or
  CarWale); lib/site.ts keeps the original URLs as the backup and `saved()` maps each to its copy via
  `lib/saved-photos.json`. After adding/changing a photo URL run `NODE_USE_ENV_PROXY=1 npm run save-photos` (Node's
  fetch ignores the sandbox proxy without it). Size and format still come from the original URL: Wix photos use
  `.../photo.webp` at 1600px, the hero is WebP on the page (`heroPhoto`, `heroThumb`) and JPEG only as the sharing
  image (`heroImage`). Don't turn optimization back on. The privacy policy says fonts and photos come from our server.
- Playwright: `require('/opt/node22/lib/node_modules/playwright')`; Chromium only (no WebKit, so iPhone Safari
  behaviour can't be reproduced — ask Nirmal to check on his phone). Don't run `playwright install`.
- Verify against a production build (`npm run build && npx next start -p 3001`), not a long-running `next dev`:
  the dev server served stale CSS once (footer lost its background) and made a working change look broken.
- Python helpers (fontTools, Pillow) go in a venv in the scratchpad; the favicon was made that way from Libre
  Caslon Display. To judge photos, download them and view contact sheets (Pillow) before using any.
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
  fleet/[car]/page.tsx     Also serves class pages (/fleet/suvs, components/fleet-class-page.tsx) for classes that
                           have cars; class cards, home preview and Fleet menu link there (`classHref`).
                           One page per car in `cars` (lib/site.ts), e.g. /fleet/rolls-royce-ghost. Unknown
                           details/photos show a highlighted [CONFIRM] (components/confirm.tsx). The car is linked
                           from its class card on /fleet and found by the fleet search. Add a car = add an entry.
  contact/page.tsx         Quote form (components/quote-form.tsx) + contact details
  privacy-policy/page.tsx  Drafted policy; 3 highlighted [CONFIRM] items for the client
  not-found.tsx            Branded 404
components/
  site-header.tsx          Fixed header (Home, Fleet, Weddings, Services, About, Contact); transparent over the home hero until scroll; Fleet mega-menu; mobile sheet
  site-footer.tsx          Also renders the phone-only sticky Call / WhatsApp bar
  booking-bar.tsx          "Start a quote": occasion / city / date (all start empty) → pushes to /contact?… as query params
  quote-form.tsx           Pre-fills from those query params (car pages add ?car=<slug> for the optional
                           "Exact vehicle" dropdown); "Other" opens a text box; submit opens the
                           WhatsApp popup with the details written out (nothing stored server-side)
  contact-dialog.tsx       <ContactDialog channel="call|whatsapp|email|all"> wraps any button → animated popup
                           ("all" opens on the "Get in touch" list; used by the "Contact us" buttons)
                           (both numbers / WhatsApp / email, copy buttons, "Other ways to reach us" list)
  page-transition.tsx      Fade-and-lift between pages (React <ViewTransition>); wraps each page's <main>
  car-gallery.tsx          Car-page photo carousel (scroll-snap swipe, prev/next, thumbnail row); one per model generation
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
- Phone +91 98036 00001 (the Mohali office's number, per Nirmal) · info.jhajjz@gmail.com · WhatsApp on that number.
  The second number on the old site, +91 98144 00019, is hidden (commented out in `lib/site.ts`) because it doesn't
  seem to be Jhajj'z's — restore only if the client confirms
- **Pan-India service** (confirmed by Nirmal); stations in **14 cities**: Chandigarh, New Delhi, Gurgaon, Jaipur, Udaipur, Mumbai, Chennai, Kolkata, Bhubaneswar,
  Dehradun, Mussoorie, Rishikesh, Haridwar, Ropar
- Brands: Rolls-Royce, Bentley, Mercedes-Benz (and Maybach), BMW, Audi, Jaguar, Land Rover / Range Rover, Toyota; coaches
  by Volvo and Mercedes-Benz (Bentley, Jaguar and the newer cars below come from the car photos on jhajjz.in)
- 9 vehicle classes and 9 services — see `lib/site.ts`. jhajjz.in's "Wedding cars" class was dropped (Nirmal:
  every car can be booked for any event); "Luxury MPVs" was added by Nirmal. Class order (fleet page, menu, home):
  luxury cars, executive cabs, SUVs, luxury MPVs, then vintage, convertibles, limousines, mini vans, coaches.
- The fleet intro says every vehicle comes with a trained chauffeur; car texts don't repeat it (Nirmal).

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

## Photos (all in lib/site.ts)

- **Client photos**: from jhajjz.in's Wix, saved in public/photos (`photos`; helpers `wix`/`wixJpeg` = 3:2 crop,
  `wixFit` = uncropped for portrait shots). Identified by eye from jhajjz.in; no captions there. These are Wix's 1600px
  copies; the client's full-size originals would be better.
- **Studio shots** (`studio`): CarWale *colours* pages (`imgd.aeplcdn.com/1280x720/n/<id>.jpg?q=80`, no `wm=1` = no
  watermark) or CarDekho colours pages; car on white. Always matched to the **generation and colour the client
  has** (older generations live at slugs like `7-series-2019-2023`, `old-generation-s-class-2021`). Nirmal prefers
  these no-background shots. All are `placeholder: true` (kept out of Open Graph / JSON-LD) and get replaced when
  the client signs up and sends their own.
- `CarPhoto` flags: `cutout` (shown whole on sand, multiply blend on a wrapper), `zoom` (studio shot with wide
  margins), `portrait` (letterboxed), `position`, `generation` ("Newer model"/"Older model" → separate carousels,
  newer on top). Fleet cards: `imageCutout`, `imagePlaceholder`, `imageZoom`.
- `images.unoptimized: true` — **no Vercel image optimization (Nirmal)**. Photos are saved copies (see above); size/format
  come from the original URL: Wix as `.webp` at 1600px; hero WebP on the page, JPEG (`heroImage`) only for link previews.

## Open items (need the client)

- **29 car pages**: 12 from Nirmal, the rest added from jhajjz.in photos on his go-ahead ("we'll import each car
  properly when the client signs up"). All identified by eye: confirm each is in the fleet, passengers for every car,
  the limousine is a Chrysler 300C, the Audi is an A3 Cabriolet, which Range Rover is the Autobiography, whether the
  black GLE and the bulletproof GLE are the same car, the make of the vintage open tourers (`brand: ""`).
- **Logo file** (favicon is a placeholder "Jhajj'z" wordmark in gold Caslon; regenerate all 5 icon files).
- **Privacy policy**: 3 highlighted `[CONFIRM]` items. jhajjz.in's own policy is only Wix template text.
- Second number +91 98144 00019 is hidden until the client confirms it is theirs.
- Office map on /contact: needs the office's exact pin; an embed would need a privacy-policy line (Google cookies).
- Names/proof (hotels, airlines, events they've driven for; real client quotes) only with client permission.
- Hero: client's Wix sharing image. `/public/rolls-royce-hero.webp` (v0 reference, probably AI-made) is the alternative.

## Launch checklist

- [ ] Remove placeholder photos: search `PLACEHOLDER` in lib/site.ts (and the `carwale`, `carwaleColour`,
      `cardekhoColour` helpers); replace with the client's photos. Delete public/photos/carwale and /cardekho too
      and re-run `npm run save-photos`.
- [ ] Point www.jhajjz.in at Vercel (noindex on other hosts switches off automatically, proxy.ts).
- [ ] Old Wix URLs already redirect (`redirects()` in next.config.ts). After launch check Search Console → Pages.
- [ ] Search Console: verify domain, submit /sitemap.xml. Google Business Profile for the Mohali office (same
      name/address/phone); ask the client for reviews there.

Preview: Nirmal reviews at https://jhajjz.vercel.app. **Never touch the existing Vercel project "aethal".** Netlify site
`jhajjz-preview` exists (empty).

## Lessons (don't relearn these)

- Avoid as "real business" signals (next-gen AI tells): stat strips, gradient blobs/glassmorphism, stock photos,
  texture overlays, emoji/animated icons. Use real material instead: client photos, the Survey-of-India map
  (DataMeet, CC0) with the 14 cities, the office line in contact popups.
- iPhone: sideways drag fixed by clipping overflow on a wrapper div in layout.tsx (Safari ignores it on html/body);
  overscroll shows ink because `html` *and* `body` are ink and the paper background is on that wrapper.
- Overflow is clipped, so a too-wide element doesn't scroll — it silently widens its column. Grids on phones need
  `grid-cols-[minmax(0,1fr)]` (the carousel thumbnail row once pushed car photos past the screen edge).
- A `transform`ed element is its own stacking context: put `mix-blend-multiply` on the scaled wrapper, not the img.
- Next skips same-page link clicks: the logo/Home scroll to top explicitly when already on the home page.
- `lib/seo.ts` `openGraphBase` must be spread into every page's openGraph (Next doesn't deep-merge it).
- History of every change: `git log`.
