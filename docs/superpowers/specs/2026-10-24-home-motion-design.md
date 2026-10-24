# Home page motion: pre-rendered S-Class + scroll effects

Agreed with Nirmal, 2026-10-24. Not pushed to `main` until he says so (commits stay local).

## Goal

Give the home page more depth and movement without changing its sections or their order (hero, booking bar,
fleet preview, weddings band, "Who we drive for", "Chandigarh, since 1998"). It has to stay subtle and specific to
Jhajj'z, never templated (CLAUDE.md "avoid" list), and fast on an iPhone.

## Decisions

- Keep the current sections and order; add motion only.
- Both kinds of 3D: depth effects across the page, plus one 3D car moment.
- The car is the **Mercedes-Benz S-Class W223** model already in `video/models/src/sclass/` (black, like the
  client's S-Class 2021 onwards).
- The car is **pre-rendered at full quality** (no optimising the model) and played back frame by frame on scroll,
  instead of running three.js on the site.
- Placement: the fleet intro (my recommendation; Nirmal hasn't objected — confirm when reviewing this spec).

## 1. S-Class turn (fleet intro)

**Rendering (offline, in `video/`)**
- A new render script reuses the Reel's studio (`video/shared/studio.js`) and the `sclass` entry in
  `video/shared/cars.js` (unpose prep, `Paint` material, paint `#0b0c0e`).
- Camera fixed, three-quarter front view at roughly bonnet height; the car turns ~180° on its axis
  (front three-quarter → side → rear three-quarter). Background is paper `#F4F2EE` with a soft contact shadow,
  so frames sit on the page with no visible box.
- 120 frames, eased so the turn starts and ends gently. Output WebP:
  `public/sclass-turn/1920/0001.webp…` (desktop) and `public/sclass-turn/960/…` (phones). Target a total of
  ~3–5 MB for the phone set, ~8–12 MB for desktop; tune quality to hit it.
- Frames are committed (they are site assets); the render script lives in `video/` and is documented in
  `video/README.md`.
- Window glass currently renders fully clear (Reel handoff note): fix before the final render.

**Playback (site)**
- `components/scroll-sequence.tsx` (client): a sticky `<canvas>` inside a section ~200svh tall; `useScroll`
  progress → frame index → `drawImage`. Picks the 960 or 1920 set from viewport width × devicePixelRatio.
- Frame 1 is a normal `<img>` (via `Photo`) so it shows before JavaScript; remaining frames load in order once the
  section is within ~1 screen (IntersectionObserver), drawing the nearest loaded frame meanwhile.
- After the turn, the existing heading and fleet cards follow as they do now.
- Reduced motion or no JavaScript: just the still (frame 1, or a chosen hero frame), no pinning.
- Layout checked from 344px to 3440px; the canvas keeps the car's aspect and never widens its column.

**Open**
- The S-Class model's author and licence aren't recorded yet (`video/CREDITS.md` doesn't exist). Find them before
  launch; if CC-BY, add a credit line (footer or privacy policy).
- The model isn't the client's actual car; treat the frames like the studio shots (replace or keep with the client's
  OK at sign-up). Add to the launch checklist.

## 2. Scroll effects (existing `motion` library)

- **Hero:** photo pushes in slowly with scroll; headline block drifts up slightly faster than the page (parallax).
  Booking bar unchanged.
- **Weddings band:** starts inset with a paper border and rounded corners (`clip-path: inset(… round …)`), and the
  inset shrinks to 0 as the band reaches mid-screen, so the photo becomes full-bleed. Text fades up once it's full.
- **Fleet cards:** on `(hover: hover)` devices only, a slight tilt toward the pointer (≤4°, eased); touch keeps the
  existing press-in.
- **"Who we drive for":** rows slide in one after another, each slightly behind the one above it.
- **About map:** the 14 city dots appear in sequence when the map scrolls into view.
- Scroll-linked motion follows the scroll position (no timed playback); UI motion stays ≤300ms.
  `prefers-reduced-motion` disables all of it (static layout, weddings band full-bleed).

## Skills used

- `apple-design`: review the motion (springs, scroll-linked feel, reduced motion).
- `high-end-motion-video`: the S-Class render and its quality checks (light, reflections, smooth turn).
- `design-taste-frontend` + built-in browser: review the finished page at phone / desktop / ultrawide widths
  against the "avoid" list.

## Verification

- Production build (`npm run build && npx next start -p 3001`), checked in the browser at 344, 390, 768, 1440 and
  3440px; scroll through each effect, then again with reduced motion.
- Network: phone width downloads only the 960 frames; first screen weight unchanged.
- Nirmal checks on his iPhone after he approves a push (Safari can't be tested here).

## Not in scope

- Layout or section changes, new copy, a live three.js scene, other pages.
