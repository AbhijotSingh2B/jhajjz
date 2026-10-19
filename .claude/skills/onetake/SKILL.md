---
name: onetake
description: Make short product or skill motion films (10–30 s; narrated feature demos up to ~60 s) with feitangyuan's onetake pipeline (github.com/feitangyuan/onetake) — one HTML composition that is a pure function of time, a library of measured moves, real shutter motion blur, a synthesised/recorded sound palette and an oracle that fails slideshow-like cuts. NON-COMMERCIAL licence. Use for launch clips, teasers, feature demos with the UI rebuilt from screenshots, multi-language narrated cuts, or auditing why a motion video reads like a slideshow.
---

# onetake (feitangyuan/onetake)

**Licence: PolyForm Noncommercial 1.0.0** — free for non-commercial use only. Before starting, tell the
user if the film is for paid or client work (e.g. Jhajj'z) and don't use onetake for it without a
commercial licence from the author.

**The repo's `SKILL.md` is authoritative; this file is a pointer and a short summary. Read the original
in full and follow it.**

```bash
git clone --depth 1 https://github.com/feitangyuan/onetake ~/.cache/skill-repos/onetake
```

Requires (per the original): python3 with `playwright` (chromium), `numpy`, `scipy`, `Pillow`,
`matplotlib`, `fonttools` + `brotli`, `opencv-python`; `ffmpeg`/`ffprobe`; `node`. Narration also needs
`faster-whisper` and Kokoro.

## The protocol (in order, no skipping)

1. **Deconstruct the reference**: `python3 scripts/analyze_ref.py ref.mp4 --out ana/` (energy map, cuts,
   stillness, contact sheets, motion line); write down the numbers the film must match.
2. **Concept**: three central picture ideas that differ in kind (one element transforms through
   everything, one camera move through scale, before/after split, chain reaction…), each with its hook
   frame, what carries every boundary, what it rules out, and a look (`python3 scripts/look.py sheet`,
   a preset from `looks/`, `look.py from-shot`, or a new one). The user picks. Never default to the
   template's story.
3. **Storyboard as rhythm and carry**: beat sheet `t · beat · what moves · what is still · what carries`;
   shot lengths varying ≥ 4×, at least one near-silent stretch; at every boundary name what survives.
4. **Footage** from the real thing (`scripts/record_footage.py footage.json --out footage/`) or the UI
   rebuilt from screenshots (`references/product-demo.md`, `lib/ui_kit.js`; narration via
   `scripts/vo_tools.py`; other languages via `?lang=` + time warp, checked with `scripts/frame_diff.py`).
5. **Compose**: copy `templates/comp.html` and `lib/motion.js` into `cases/<film>/`; pick moves from
   `gallery/sheets/`; `python3 scripts/probe.py` once it plays; `look.py apply` writes `look.js`.
6. **Render**: `scripts/stills.py` first; `scripts/render.py comp.html --out draft.mp4 --sfx sfx.wav`
   (1920×1080, 30 fps, shutter blur); `--final` (3840×2160, 60 fps) only after the cut is accepted.
7. **Sound**: `scripts/sfx_palette.py` palette for drafts, or a `score.py` from `window.__events()`;
   one room, fewer events than beats, master to −16 LUFS; music royalty-free unless the user supplies it.
8. **Verify before showing**: `python3 scripts/verify_promo.py draft.mp4 --comp comp.html [--ref ref.mp4]`.

The original's **Hard rules** section (no metronome cuts, carry every beat, rests, small elements on big
ground, visible cause, no particle bursts, determinism…) applies in full — read it.
