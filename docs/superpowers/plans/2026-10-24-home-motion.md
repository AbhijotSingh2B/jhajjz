# Home page motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A dark-studio hero where a pre-rendered black S-Class turns ~180° as you scroll, plus scroll effects on the
weddings band, fleet cards, "Who we drive for" rows and the About map.

**Architecture:** The S-Class is rendered offline in `video/` (three.js studio reused from the Reel, driven by
puppeteer-core, encoded with sharp) into two WebP frame sets in `public/sclass-turn/`. On the site a client component
draws the frame matching the scroll position onto a sticky canvas; frame 1 is a plain `<picture>` so it shows before
JavaScript. The other effects use the existing `motion` library. All scroll maths lives in one pure module with tests.

**Tech Stack:** Next.js 16 / React 19 / Tailwind v4, `motion` 14, three.js 0.186 + puppeteer-core + sharp (all
already installed in `video/` or the root), Node 24's built-in test runner (`node --test`, no new dependency).

**Spec:** `docs/superpowers/specs/2026-10-24-home-motion-design.md`

## Global Constraints

- **Never push.** Commit locally after each task; Nirmal says when to push.
- Read `node_modules/next/dist/docs/` for any Next API you touch (AGENTS.md: this Next differs from training data).
- Don't optimise the S-Class model; load `video/models/src/sclass/Mercedes_S_Class.gltf` as downloaded.
- Hero background `#0e0e0d` (`--color-ink-deep`); frames must land on exactly that colour (±3 per channel).
- Frame budget: 120 frames per set; `tall` set ≤ 5 MB total, `wide` set ≤ 12 MB total.
- Headline exactly `Chauffeur-driven since 1998.`; supporting sentence keeps "Head office in Chandigarh, serving
  pan-India." word for word. Buttons unchanged ("Get a quote", "or talk to us on WhatsApp").
- Gold (`#C5A47E`) only on the primary button in the hero. No gradients/blobs/glow, no new eyebrow labels (CLAUDE.md
  "avoid" list).
- Everything respects `prefers-reduced-motion` (static, full-bleed, no pin). UI motion ≤ 300ms; scroll-linked
  motion follows scroll position.
- Layout works from 344px to 3440px; phones need `grid-cols-[minmax(0,1fr)]`-style guards so nothing widens a column.
- Verify on a production build (`npm run build && npx next start -p 3001`); if CSS looks stale, `rm -rf .next`.
- Update `CLAUDE.md` (Structure, Photos, Launch checklist), `PROJECT-OVERVIEW.md`, `ISSUES.md`, `FUTURE-UPDATES.md`
  where a task changes what they describe, in that task's commit.

## Review Focus

1. **Jumping into the middle of the hero** (reload while scrolled, back button, fast fling) before most frames have
   loaded → the canvas shows the nearest loaded frame, never blank. Test: `nearestLoaded` (Task 1).
2. **Rotating a phone / resizing across 768px** → the frame set switches and the canvas redraws at the new size
   without stretching. Test: `frameSet` (Task 1) + manual resize check (Task 3).
3. **Reduced motion, Save-Data, or JavaScript off** → normal-height hero with the still, no pin, and the 119 other
   frames never download. Test: `shouldLoadSequence` (Task 1) + network check (Task 3).
4. **iPhone address bar showing/hiding** changes the viewport height mid-scroll → the sticky stage uses `svh` and
   doesn't jump. Manual check on Nirmal's iPhone after a push (Safari not testable here); note in ISSUES.md.
5. **The header over a 200svh hero** → it still turns solid once scrolled and hides/shows as before; check how
   `site-header.tsx` decides "over the hero" and adjust if it measures the hero's height (Task 3).

---

### Task 1: Scroll maths module

**Files:**
- Create: `lib/scroll-motion.ts`
- Test: `lib/scroll-motion.test.mjs` (plain JS so Next's type check skips it; imports `./scroll-motion.ts`)
- Modify: `package.json` (add `"test": "node --test lib/"`)

**Interfaces:**
- Produces:
  - `FRAME_COUNT = 120`
  - `type FrameSet = "wide" | "tall"`
  - `frameIndex(progress: number, count = FRAME_COUNT): number` — clamps progress to 0..1, returns 0..count-1 (rounded)
  - `frameSet(viewportWidth: number): FrameSet` — `"tall"` below 768, else `"wide"`
  - `frameUrl(set: FrameSet, index: number): string` — `/sclass-turn/${set}/${4-digit index+1}.webp`
  - `nearestLoaded(loaded: readonly boolean[], target: number): number` — closest index with `true`, ties to the lower; -1 if none
  - `shouldLoadSequence(o: { reducedMotion: boolean; saveData: boolean }): boolean`
  - `insetAt(progress: number, max: number): number` — `max` at 0, 0 at ≥1, eased with `1 - (1-p)^2`
  - `tiltFromPointer(x: number, y: number, w: number, h: number, max = 4): { rotateX: number; rotateY: number }` — centre → 0,0; right edge → rotateY +max; top edge → rotateX +max; clamped

- [ ] **Step 1: Write the failing tests** (`node:test` + `node:assert/strict`)

```js
test("frameIndex", () => { assert.equal(frameIndex(0), 0); assert.equal(frameIndex(1), 119); assert.equal(frameIndex(0.5), 60); assert.equal(frameIndex(-2), 0); assert.equal(frameIndex(3), 119); });
test("frameSet", () => { assert.equal(frameSet(344), "tall"); assert.equal(frameSet(767), "tall"); assert.equal(frameSet(768), "wide"); });
test("frameUrl", () => { assert.equal(frameUrl("wide", 0), "/sclass-turn/wide/0001.webp"); assert.equal(frameUrl("tall", 119), "/sclass-turn/tall/0120.webp"); });
test("nearestLoaded", () => { assert.equal(nearestLoaded([true, false, false, true], 2), 3); assert.equal(nearestLoaded([true, false, true], 1), 0); assert.equal(nearestLoaded([false, false], 1), -1); assert.equal(nearestLoaded([false, true], 1), 1); });
test("shouldLoadSequence", () => { assert.equal(shouldLoadSequence({ reducedMotion: false, saveData: false }), true); assert.equal(shouldLoadSequence({ reducedMotion: true, saveData: false }), false); assert.equal(shouldLoadSequence({ reducedMotion: false, saveData: true }), false); });
test("insetAt", () => { assert.equal(insetAt(0, 48), 48); assert.equal(insetAt(1, 48), 0); assert.equal(insetAt(1.5, 48), 0); assert.equal(insetAt(0.5, 48), 12); });
test("tiltFromPointer", () => { assert.deepEqual(tiltFromPointer(50, 50, 100, 100), { rotateX: 0, rotateY: 0 }); assert.deepEqual(tiltFromPointer(100, 0, 100, 100), { rotateX: 4, rotateY: 4 }); assert.deepEqual(tiltFromPointer(500, 50, 100, 100), { rotateX: 0, rotateY: 4 }); });
```

- [ ] **Step 2: Run `npm test`** — Expected: FAIL (module not found).
- [ ] **Step 3: Implement `lib/scroll-motion.ts`** with the signatures above (erasable TypeScript only, so Node can strip the types).
- [ ] **Step 4: Run `npm test`** — Expected: all 7 pass. Run `npx tsc --noEmit` — no errors.
- [ ] **Step 5: Commit** — `git add lib/scroll-motion.ts lib/scroll-motion.test.mjs package.json && git commit -m "Scroll maths for the home page motion, with tests"`

---

### Task 2: Render the S-Class turn frames

**Files:**
- Modify: `video/shared/studio.js` — `createStudio(canvas, { cars, pixelRatio = 1, width = W, height = H, background = BRAND.paper })`; defaults keep the Reel unchanged. Background colour and fog use `background`.
- Create: `video/hero-turn.html` + `video/hero-turn.js` — loads the studio with only the `sclass` entry from `CARS` (same prep, paint `#0b0c0e`), background `#0e0e0d` × `window.__BG_GAIN`, and exposes `window.renderTurn(layout: "wide" | "tall", i: number): Promise<void>` that poses the car at yaw `start + smoother(i / 119) * Math.PI` and renders one frame. Camera fixed at about bonnet height; `wide` (1920×1080) puts the car right of centre with the left ~45% empty; `tall` (960×720) centres it. Start yaw: front three-quarter facing the viewer's left.
- Create: `video/tools/render-hero-turn.mjs` — puppeteer-core with the system Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`, overridable by `CHROME_PATH`), serves `video/` over a throwaway local server, calls `renderTurn` for both layouts × 120 frames, takes `canvas.toDataURL("image/png")`, encodes with sharp to `public/sclass-turn/<layout>/NNNN.webp`. Flag `--quality <n>` (default 78).
- Modify: `video/README.md` (how to render the hero frames; window glass fix), `video/CREDITS.md` (create: S-Class model, author/licence still to find — say so).
- Test: `lib/sclass-frames.test.mjs`

**Interfaces:**
- Consumes: `frameUrl`, `FRAME_COUNT` from Task 1 (the test checks the files those URLs name exist).
- Produces: `public/sclass-turn/wide/0001–0120.webp` (1920×1080), `public/sclass-turn/tall/0001–0120.webp` (960×720).

- [ ] **Step 1: Write the failing test** `lib/sclass-frames.test.mjs`: for each set, all 120 `public${frameUrl(set, i)}` exist; summed bytes ≤ 5 MB (`tall`) and ≤ 12 MB (`wide`); with sharp, frames 1, 60, 120 have the expected width/height and the 4 corner pixels within ±3 of `#0e0e0d`.
- [ ] **Step 2: Run `npm test`** — Expected: the frame test fails (files missing).
- [ ] **Step 3: Fix the window glass** (renders fully clear: give the glass material tint/opacity) and add the `createStudio` options; snapshot the Reel at `--at 3` to confirm it still renders as before.
- [ ] **Step 4: Tune** — render frames 1/60/120 of each layout only, view them, adjust camera, light and `__BG_GAIN` until the corners measure `#0e0e0d` and the car is the brightest thing with soft overhead light and a faint floor reflection (high-end-motion-video skill's checks: light, reflections, no toy-like grille). Show Nirmal frames 1/60/120 before the full render.
- [ ] **Step 5: Full render** — `node video/tools/render-hero-turn.mjs`; lower `--quality` until the budget holds.
- [ ] **Step 6: Run `npm test`** — Expected: all pass.
- [ ] **Step 7: Commit** — studio change, hero-turn files, tool, frames, README, CREDITS, test: `"Render the S-Class turn for the home hero"`

---

### Task 3: Dark-studio hero with the scroll-driven turn

**Files:**
- Create: `components/hero-turn.tsx` (client)
- Modify: `app/page.tsx` hero section (lines ~45–90), `app/globals.css` (hero stage rules; drop `.hero-shade` and `animate-hero-zoom` if nothing else uses them), `components/site-header.tsx` only if Review Focus 5 needs it, `lib/site.ts` only to drop `heroPhoto`/`heroThumb` if now unused (`heroImage` stays for Open Graph/JSON-LD)

**Interfaces:**
- Consumes: `FRAME_COUNT`, `frameIndex`, `frameSet`, `frameUrl`, `nearestLoaded`, `shouldLoadSequence` (Task 1); frames (Task 2).
- Produces: `<HeroTurn>{children}</HeroTurn>` — renders the section; `children` is the text block.

- [ ] **Step 1: Build `HeroTurn`.** Section class `hero-turn`; CSS gives it `height: 200svh` only under `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`, otherwise `min-h-[min(100svh,max(880px,46vw))]` as now. Inside, a `sticky top-0 h-svh` stage holding: a `<picture>` (`<source media="(max-width: 767px)" srcset={frameUrl("tall",0)}>`, `<img src={frameUrl("wide",0)} fetchPriority="high" alt="Black Mercedes-Benz S-Class">`; `<picture>` because next/image can't art-direct two framings) and a `<canvas aria-hidden>` over it. Layout: desktop car fills the stage (`object-contain`, right-weighted by the frames themselves); phone the car frame sits in the top part, text below.
- [ ] **Step 2: Wire playback.** `useScroll({ target, offset: ["start start", "end end"] })`; on `scrollYProgress` change draw `nearestLoaded(loaded, frameIndex(p))` with `drawImage`, sized to the canvas's CSS box × `devicePixelRatio`. Preload frames 2–120 in order with `new Image()` after `requestIdleCallback` (fallback `setTimeout`), only if `shouldLoadSequence({ reducedMotion: useReducedMotion(), saveData: navigator.connection?.saveData ?? false })`. Recompute `frameSet(innerWidth)` on resize; switching sets resets `loaded` and reloads. Hide the canvas until frame 1 of the current set is drawn.
- [ ] **Step 3: Text and drift.** In `page.tsx` replace the hero with `<HeroTurn>`: h1 `Chauffeur-driven since 1998.` (keep the serif classes, `max-w` so it's two lines at every width), `<p>` `From a Rolls-Royce to a Volvo coach. Weddings, VIP visits, corporate travel and airport transfers. Head office in Chandigarh, serving pan-India.` in `text-on-dark-hero`, buttons unchanged. Text block bottom-left on desktop over the empty left of the frame; under the car on phones. Text drifts `y: 0 → -40px` and `opacity: 1 → 0.6` across progress 0–0.6 (`useTransform`); static under reduced motion. Remove the old hero photo, shade and zoom.
- [ ] **Step 4: Verify.** `npm run build && npx next start -p 3001`; in the built-in browser (splash skipped by setting `sessionStorage["jhajjz-intro"]="1"`) at 344, 390, 768, 1440, 3440: first screen shows car + two-line headline; scroll through the hero and see the turn; resize across 768 mid-hero (Review Focus 2); emulate reduced motion and check normal height + still; network panel at 390 shows only `tall` frames and nothing beyond frame 1 under reduced motion; header behaviour (Review Focus 5). `npm test`, `npm run lint` pass.
- [ ] **Step 5: Commit** — plus CLAUDE.md (Structure: `hero-turn.tsx`; Photos: hero is now the S-Class render; Launch checklist: frames are a model, not the client's car), PROJECT-OVERVIEW.md, ISSUES.md (iPhone check pending): `"Home hero: dark studio with the S-Class turning on scroll"`

---

### Task 4: Weddings band opens to full-bleed

**Files:**
- Create: `components/inset-reveal.tsx` (client)
- Modify: `app/page.tsx` weddings section (~line 145)

**Interfaces:**
- Consumes: `insetAt` (Task 1).
- Produces: `<InsetReveal className? children>` — a wrapper whose `clip-path: inset(Npx round Rpx)` shrinks to 0 as it scrolls in.

- [ ] **Step 1: Build `InsetReveal`.** `useScroll({ target, offset: ["start end", "center center"] })`; inset = `insetAt(p, max)` with max 16px below 768px and 48px above; radius = inset / 3 (so 16px → ~5px, 48 → 16px). The paper page ground shows in the inset. Reduced motion: no clip. No-JS: server render without the clip.
- [ ] **Step 2: Wrap the weddings `<section>`'s content** (photo + gradient + text) in it; keep the existing `Reveal` on the text so it fades up as the band fills.
- [ ] **Step 3: Verify** at 390 and 1440 on the production build: inset visible when the band's top enters, gone by mid-screen; no horizontal overflow; reduced motion shows it full-bleed. `npm test`, `npm run lint`.
- [ ] **Step 4: Commit** — `"Weddings band opens from an inset card to full-bleed on scroll"`

---

### Task 5: Fleet card tilt, staggered service rows, map dots

**Files:**
- Create: `components/tilt.tsx` (client), `components/map-dots.tsx` (client)
- Modify: `app/page.tsx` (fleet preview image box ~line 117; "Who we drive for" ~line 175), `components/india-map.tsx` (city `<circle>`s → `<MapDots>`)

**Interfaces:**
- Consumes: `tiltFromPointer` (Task 1).
- Produces: `<Tilt className? children>`; `<MapDots points={{ key: string; cx: number; cy: number; r: number; className: string }[]} />`.

- [ ] **Step 1: `Tilt`.** Active only when `matchMedia("(hover: hover) and (pointer: fine)")` and not reduced motion; on pointermove set `rotateX/rotateY` from `tiltFromPointer` (max 4°) with `perspective: 900px`, eased with a spring (stiffness 300, damping 30); reset on pointerleave. Wrap each fleet card's image box (the `div.relative.aspect-[3/2]`), not the text. Touch keeps the existing press-in (`@media (hover: none)` rules untouched).
- [ ] **Step 2: Service rows.** Replace the group `Stagger`/`StaggerItem` around `serviceGroups` with one `Reveal` per row (y 32) so each row triggers when it reaches the screen; inside a row, heading → item list → photo appear 80ms apart (`Stagger gap={0.08}`).
- [ ] **Step 3: `MapDots`.** `india-map.tsx` stays a server component and passes the computed city points; `MapDots` renders `motion.circle`s that scale/fade in 60ms apart when the map enters view (`whileInView`, once). Head-office marker stays static. Reduced motion: all shown.
- [ ] **Step 4: Verify** on the production build at 390/1440 (hover tilt on desktop only, rows and dots animate once, nothing hidden with reduced motion). `npm test`, `npm run lint`.
- [ ] **Step 5: Commit** — `"Home: card tilt on hover, rows reveal one by one, map dots appear in turn"`

---

### Task 6: Review pass

**Files:** whatever the review changes; `.taste-skill/after/` (ignored by git)

- [ ] **Step 1:** apple-design skill review of the hero turn, inset reveal and tilt (feel, springs, reduced motion); fix what it finds.
- [ ] **Step 2:** `inspect.mjs http://localhost:3001/ --out .taste-skill/after` and `scenes.mjs`; compare with `.taste-skill/before`. Expected: the headline-lines FAILs gone; remaining items are only the ones the spec marks as false or project-mandated. Open every screenshot.
- [ ] **Step 3:** Check every home-page link, the booking bar, contact dialogs and the splash → header handoff still work.
- [ ] **Step 4: Commit** fixes; update the spec's Taste review with the after numbers: `"Home motion: review fixes"`. Do not push; report to Nirmal.
