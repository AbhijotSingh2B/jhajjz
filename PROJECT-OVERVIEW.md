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
- **Fleet**: all classes with search and filters; a page per class and per car (29 cars).
- **Contact**: quote form and contact details.
- **Privacy policy**, branded 404.

## How enquiries work

No backend. The quote form writes the details into a WhatsApp message (or email) that the visitor sends
themselves; nothing is stored. Name is required, phone is optional. Call / WhatsApp / email popups everywhere,
plus a sticky Call / WhatsApp bar on phones.

## Content

All client facts (contact, cities, fleet, cars, photos) live in `lib/site.ts`. Photos are saved copies in
`public/photos/`: the client's from their Wix site, plus studio placeholder shots to be replaced at launch.

## See also

- `ISSUES.md`: known problems
- `FUTURE-UPDATES.md`: planned work and suggestions
