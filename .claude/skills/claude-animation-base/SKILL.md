---
name: claude-animation-base
description: Make a short hand-painted cartoon starring Clawd (or a character you design) in p5.js + p5.brush — brush strokes, boiling ink lines, flat 2D, watercolour fills — rendered headless to MP4, with John Heibel's Claude Animation Base starter kit (github.com/JohnHeibel/ClaudeAnimationBase, MIT). Use for short character-animation videos and handmade 2D storytelling.
---

# Claude Animation Base (JohnHeibel/ClaudeAnimationBase)

Starter kit based on the music video "I'm Upping My P(doom)". MIT licence. **The repo's
`ANIMATION_GUIDE.md` is authoritative: read the whole file before drawing anything.**

```bash
git clone --depth 1 https://github.com/JohnHeibel/ClaudeAnimationBase ~/.cache/skill-repos/claude-animation-base
cd ~/.cache/skill-repos/claude-animation-base && npm install
```

Needs Node.js, Google Chrome (or Playwright's Chromium, found automatically on Linux) and ffmpeg.

## What the guide asks (summary only)

Three goals: **handmade** (paint with p5.brush via `paint()`/`inkLine()`, never plain p5 shapes; linework
boils; flat 2D, never projected 3D; turns via drawn key views), **alive** (something always moving and
happening; faces act), **one piece** (plan first, link every scene). No text (reactions are painted
emotes). An event in every shot. Timing modelled on the viewer: one read at a time, fast actions, held
meanings. The prompter decides *what*; the guide decides *how* — if they ask for something it forbids,
do what they ask. Model sheets: `docs/emotions.jpg`, `docs/views.jpg`.

## Files and commands

`src/scenes/` (your video; `demo.js` is the example), `src/clawd.js`, `src/core.js`, `src/timeline.js`,
`src/config.js` (length, tempo). Scrub in `studio.html` (`?loop=emotions`, `?loop=views`).

```bash
node render.mjs --sheet=0.5,1,1.5,2 --out=out/check/a.jpg      # contact sheet of chosen times
node render.mjs --strip=2.0:2.5 --out=out/check/strip.jpg      # every frame in a stretch
node render.mjs --stills=1.2,3.4 --out=out/stills
node render.mjs --clip --out=out/video.mp4                     # MP4 (--audio=… to mux music)
```

No GPU: add `--soft-gl` (slow on watercolour fills; the README suggests asking the model to avoid those
fills and use something else appropriate). NVIDIA headless: `--gpu-angle=gl-egl` or `vulkan`.
Work in a copy of the kit, not inside a client repo.
