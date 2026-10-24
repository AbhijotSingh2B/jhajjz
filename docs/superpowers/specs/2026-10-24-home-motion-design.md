# Home page motion: pre-rendered S-Class hero + scroll effects

Agreed with Nirmal, 2026-10-24. Not pushed to `main` until he says so (commits stay local).

## Goal

Give the home page more depth and movement without changing its sections or their order (hero, booking bar,
fleet preview, weddings band, "Who we drive for", "Chandigarh, since 1998"). It has to stay subtle and specific to
Jhajj'z, never templated (CLAUDE.md "avoid" list), and fast on an iPhone.

## Decisions

- Keep the current sections and order; add motion only. The hero's background changes (below); its copy doesn't.
- Both kinds of 3D: depth effects across the page, plus one 3D car moment.
- The car is the **Mercedes-Benz S-Class W223** model already in `video/models/src/sclass/` (black, like the
  client's S-Class 2021 onwards).
- The car is **pre-rendered at full quality** (no optimising the model) and played back frame by frame on scroll,
  instead of running three.js on the site.
- **Placement: the hero** (Nirmal). The hero becomes a dark studio; the client's hero photo leaves the hero but stays
  the link-preview image (`heroImage`, Open Graph / JSON-LD unchanged).

## 1. S-Class hero

**Look**
- Ink background (`bg-ink-deep`, as now) lit like a studio: the black S-Class with soft overhead light, a faint
  floor reflection and contact shadow, champagne-gold highlight on the paint edges only. No gradient blobs or glow.
- Headline, line ("Head office in Chandigarh, serving pan-India"), buttons and booking bar stay as they are. On wide
  screens the car sits to the right of the text column; on phones the car sits above the text, text below. Shading
  stays placed from the text column (`.hero-shade`) where the car and text overlap.

**Rendering (offline, in `video/`)**
- A new render script reuses the Reel's studio (`video/shared/studio.js`, with an ink background variant) and the
  `sclass` entry in `video/shared/cars.js` (unpose prep, `Paint` material, paint `#0b0c0e`).
- Camera fixed at roughly bonnet height; the car turns ~180° on its axis (front three-quarter → side → rear
  three-quarter), eased at both ends. Background exactly the hero's ink so frames sit on the page with no box.
- 120 frames, WebP, two framings because phone and desktop place the car differently:
  `public/sclass-turn/wide/1920/0001.webp…` and `public/sclass-turn/tall/960/…`. Targets: phone set ~3–5 MB,
  desktop ~8–12 MB; tune quality to hit them.
- Frames are committed (site assets); the render script lives in `video/` and is documented in `video/README.md`.
- Window glass currently renders fully clear (Reel handoff note): fix before the final render.

**Playback (site)**
- `components/scroll-sequence.tsx` (client): the hero becomes ~200svh tall with a sticky full-screen stage;
  `useScroll` progress → frame index → `drawImage` on a `<canvas>`. Picks the set from viewport shape and width ×
  devicePixelRatio.
- Frame 1 is the hero's LCP image: a normal `<img>` (via `Photo`, `priority`/preloaded) so it shows before
  JavaScript and the first screen stays as fast as now. The other frames load in order after the page is idle,
  drawing the nearest loaded frame meanwhile.
- While the car turns, the headline block drifts up and fades a little; the booking bar arrives after the turn as now.
- Splash: the monogram still flies to the header logo; the hero's first frame is what appears behind it.
- Reduced motion or no JavaScript: hero is normal height with the still frame, no pinning or turning.
- Layout checked from 344px to 3440px; the canvas keeps the car's aspect and never widens its column.

**Open**
- The S-Class model's author and licence aren't recorded yet (`video/CREDITS.md` doesn't exist). Find them before
  launch; if CC-BY, add a credit line (footer or privacy policy).
- The model isn't the client's actual car; treat the frames like the studio shots (replace or keep with the client's
  OK at sign-up). Add to the launch checklist.

## 2. Scroll effects (existing `motion` library)

- **Weddings band:** starts inset with a paper border and rounded corners (`clip-path: inset(… round …)`), and the
  inset shrinks to 0 as the band reaches mid-screen, so the photo becomes full-bleed. Text fades up once it's full.
- **Fleet cards:** on `(hover: hover)` devices only, a slight tilt toward the pointer (≤4°, eased); touch keeps the
  existing press-in.
- **"Who we drive for":** rows slide in one after another, each slightly behind the one above it.
- **About map:** the 14 city dots appear in sequence when the map scrolls into view.
- Scroll-linked motion follows the scroll position (no timed playback); UI motion stays ≤300ms.
  `prefers-reduced-motion` disables all of it (static layout, weddings band full-bleed).

## Taste review (design-taste-frontend, 2026-10-24) — proposals, not yet agreed

Before: `.taste-skill/before/` (production build, 1440/768/390). Inspector: 4 FAIL, 5 WARN.
- **Real:** hero headline wraps to 3 lines at 1440px and 4 at 390px (rule: 2 at most). 13 font sizes in use (rule: ~5).
- **False or project-mandated:** "covered text" is the splash over the hero; the "eyebrow" is the required
  "For illustrative purposes only" tag; the cream warning is the agreed brand palette. Left as they are.

Direction dealt: **The dark room** (seed 630977729, brand colours and fonts kept). Only its hero is used; the other
sections stay (agreed). Adapted for the S-Class hero:
- One ink field; the S-Class is the only lit thing on the first screen, about 45–50% of the width, right of centre
  on desktop and above the text on phones. Nothing else glows; gold only on the primary button.
- Headline modest and short, two lines bottom-left at the existing serif; one supporting sentence in the dimmer ink
  beside it (desktop) or under it (phone). Header unchanged.
- Headline copy proposal (fits two lines, facts only): **"Chauffeur-driven since 1998."** with "From a Rolls-Royce to
  a Volvo coach" moving into the supporting sentence. Needs Nirmal's OK (wording he set elsewhere stays).

## Skills used

- `apple-design`: review the motion (springs, scroll-linked feel, reduced motion).
- `high-end-motion-video`: the S-Class render and its quality checks (light, reflections, smooth turn).
- `design-taste-frontend` + built-in browser: review the finished page at phone / desktop / ultrawide widths
  against the "avoid" list.

## Verification

- Production build (`npm run build && npx next start -p 3001`), checked in the browser at 344, 390, 768, 1440 and
  3440px; scroll through each effect, then again with reduced motion.
- Network: phone width downloads only the phone frames; first screen weight about the same as today's hero photo.
- Nirmal checks on his iPhone after he approves a push (Safari can't be tested here).

## Not in scope

- Section order or copy changes, a live three.js scene, other pages.
