---
name: claude-animation-base
description: Animate a hand-drawn character (Clawd, or one you design) in p5.js + p5.brush with brush strokes, boiling linework and watercolour fills, rendered headless to MP4, using John Heibel's Claude Animation Base starter kit (github.com/JohnHeibel/ClaudeAnimationBase, MIT). Use for short character-animation videos, music-video shots, or handmade 2D storytelling.
---

# Claude Animation Base (JohnHeibel/ClaudeAnimationBase)

Starter kit from the "I'm Upping My P(doom)" music video: a rigged 2D character with views, emotions,
eyes, mouths, hats, emotes and dances, a shot timeline with brush-wipe transitions, and a headless
renderer that makes contact sheets, frame strips, stills and the MP4. MIT licence.

## Get it

```bash
git clone --depth 1 https://github.com/JohnHeibel/ClaudeAnimationBase ~/.cache/skill-repos/claude-animation-base
cd ~/.cache/skill-repos/claude-animation-base && npm install
```

For a real project copy the kit into its own folder (not a client repo) and work there.

## Use it

1. **Read `ANIMATION_GUIDE.md` first** — the rules (handmade, alive, one piece, no text, transitions always,
   something happens in every scene), timing for the viewer, character-animation principles and the full API.
2. Storyboard before coding; build shot by shot in `src/scenes/` (`src/scenes/demo.js` is the example).
   Length and tempo in `src/config.js`; character in `src/clawd.js`; helpers in `src/core.js`.
3. Check your own work with contact sheets and strips from `render.mjs`, then render:
   `node render.mjs --clip --out=out/video.mp4`. Scrub in `studio.html` (`?loop=emotions`, `?loop=views`).
4. Linux/headless: Playwright's Chromium is found automatically (or `--chrome=<path>` / `CHROME_PATH`).
   With no GPU add `--soft-gl`; watercolour fills are slow without one, so swap them for flat fills or
   brush hatching when rendering in a cloud sandbox.
