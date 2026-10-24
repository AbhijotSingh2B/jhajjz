# Jhajj'z 3D Reel (15 s, 1080×1920, 60 fps)

A separate project from the website: HTML + GSAP + three.js, rendered frame by frame with HyperFrames.
Brief, facts, storyboard and review rounds: BRIEF.md, FACTS.md, STORYBOARD.md, review/.

```bash
cd video && npm install
export HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx hyperframes snapshot . --at 0,3,6 -o review/shots   # stills
npx hyperframes render . --fps 60 -o renders/film.mp4     # full film
```

Car models: free CC-BY Sketchfab models (CREDITS.md), kept out of git in models/src/; optimised copies in models/.

## Website S-Class frames

The home page's S-Class box (components/sclass-box.tsx; first planned as the hero, hence the file names) plays the
S-Class turning ~100° (front three-quarter to front three-quarter, never the back) from 120 pre-rendered frames:
`hero-turn.html` / `hero-turn.js` (the studio on the box's ink `#0e0e0d`, overhead light, floor reflection), saved by

```bash
node tools/render-hero-turn.mjs                       # all frames → ../public/sclass-turn/{wide,tall}/0001–0120.webp
node tools/render-hero-turn.mjs --frames 1,60,120 --out <dir>   # stills to check the look first
```

It uses the system Chrome (`CHROME_PATH` to override). `wide` is 1920×1080 for the full-screen box (lg and up), `tall`
is 960×720 for the phone/tablet card; the car is centred in both, about half the box width. `npm test` in the site checks every frame exists, the size budget and the ink corners.

## Where this stopped (handoff, 2026-10-24)

Done: brief, facts, storyboard v2 (after a critic round), renderer test (5 s, 1080×1920, 60 fps, deterministic), shared
studio (`shared/studio.js`), timeline (`shared/film.js`), car layout and camera per shot (`shared/cars.js`), map and end
card. The draft runs with a stand-in car (`dev/ferrari.glb`, not committed): to preview before the real cars are in,
download it into `video/dev/` from
`https://raw.githubusercontent.com/mrdoob/three.js/r180/examples/models/gltf/ferrari.glb`.

Next:
1. **Models** (CC-BY, download as glTF .glb into `video/models/src/`, credit the authors in `CREDITS.md`):
   - S-Class W223: https://sketchfab.com/3d-models/mercedes-benz-s-class-w223-v223-z223-9afe145e08a44a278d9efbfd2297579a
   - Ghost (first generation, like the client's): https://sketchfab.com/3d-models/rolls-royce-ghost-1f614e803fc24946b83bdc2dd9926d62
   - Range Rover L460: https://sketchfab.com/3d-models/land-rover-range-rover-l460-74dfbfd36dd3419cb935ce832e67957d
     (backup: https://sketchfab.com/3d-models/2022-land-rover-range-rover-fa4d79a5875e4733a71101e28a30e2e3)
   **Don't optimise the models** (Nirmal: it lowers quality); load them as downloaded. In `shared/cars.js` set each
   `url`, `yaw` (so the nose points +z), `paintMatch` (the body paint material's name) and colour: Ghost white,
   S-Class black, Range Rover white. Sketchfab exports carry a viewer tilt: `prep: unpose` clears it. Re-tune the
   camera keys per shot from stills.
   - S-Class: in (`models/src/sclass/`, glTF + bin + textures, ~50 MB, from Nirmal's Mercedes_S_Class.zip; not in git).
     Upright, nose +z, paint material `Paint`. Glass fixed (`tintGlass` in shared/cars.js: tinted
     windows, clear headlamp lenses). Still to do: the shot 3 camera (tuned on the Ferrari, now far too close; title
     overlaps the roof), and the model's author and licence in CREDITS.md.
2. Check the Ghost model is the first generation (2009–2020); the S-Class close-ups must not show a toy-like grille.
3. Component critic per shot, then a full render and the critic rounds in the kit
   (https://github.com/echris6/motion-video-kit, `business-motion-film/`): frozen time, contrast, brand colour on the
   rendered paper background (#F4F2EE; tune `window.__BG_GAIN`), text collisions.
4. **Music** (Mixkit free licence, `https://assets.mixkit.co/music/<id>/<id>.mp3`). Measured shortlist, about
   120–129 BPM with a clean ending hit (source time of the hit in brackets): 132 "Hazy After Hours" (118.44 s),
   130 "Tech House vibes" (94.49 s), 473 "Talent in the Air" (109.92 s), also 134, 744, 371. Back-time each so its
   ending hit lands on the end-card cut (11.71 s), cut on its beat grid (currently a 123 BPM placeholder in
   `shared/cars.js`), and deliver 3–4 mixes for Nirmal to pick by ear, plus a music-only version.
5. Final: 1080×1920, 60 fps MP4, `-q delivery`.
