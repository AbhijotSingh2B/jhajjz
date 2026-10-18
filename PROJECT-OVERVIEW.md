# Jhajj'z website: project overview

Current state of the site in one page. Keep it short: replace lines when things change, don't append history
(`git log` has that). Details belong in CLAUDE.md or the code.

## What it is

The new website for Jhajj'z, a chauffeur-driven luxury car and coach rental company (since 1998, head office in
Mohali/Chandigarh, serving pan-India). Replaces jhajjz.in on Wix. Built by Nirmal for the client.

## Status

- Pre-launch. Preview at https://jhajjz.vercel.app (noindex); www.jhajjz.in still points at Wix.
- The client hasn't signed up or reviewed it yet: many car details, the logo and some copy are unconfirmed
  (CLAUDE.md, "Open items").

## Pages

- **Home**: hero, short quote starter, fleet classes, weddings, "Who we drive for", about + India map.
  The entry screen (logo animation) plays here only, once per tab.
- **Fleet**: 10 classes with search and filters (each card lists 3 cars, then "Show N more"); a page per class and
  per car (34 cars). Cars in more than one colour have a colour picker (with All) that carries into the quote.
- **Contact**: quote form and contact details.
- **Privacy policy**, branded 404.

## How enquiries work

No backend. The quote form writes the details into a WhatsApp message (or email) that the visitor sends
themselves; nothing is stored. Name is required, phone is optional. Dates always show as dd/mm/yyyy (Day/Month/Year dropdowns on TVs). Call / WhatsApp / email popups everywhere,
plus a sticky Call / WhatsApp bar on phones.

## Analytics

Vercel Web Analytics (cookieless page-view counts, Hobby plan), described in the privacy policy. Enabled and
collecting on jhajjz.vercel.app (checked 2026-10-18).

## Content

All client facts (contact, cities, fleet, cars, photos) live in `lib/site.ts`. Photos are saved copies in
`public/photos/`: the client's from their Wix site, plus studio placeholder shots to be replaced at launch.
Smaller saved copies go to phones and cards; no Vercel image optimization. Photos show a soft pulse while
loading, then fade in from a blur.

## See also

- `ISSUES.md`: known problems
- `FUTURE-UPDATES.md`: planned work and suggestions
