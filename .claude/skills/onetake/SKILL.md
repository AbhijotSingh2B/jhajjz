---
name: onetake
description: Make short product or skill motion films (10–30 s, narrated demos up to ~60 s) with kinetic type, real UI as material, beats that carry into each other, real shutter motion blur and synthesised sound, using the onetake pipeline (github.com/feitangyuan/onetake). NON-COMMERCIAL licence. Use for launch clips, teasers, product feature demos rebuilt from screenshots, and for auditing why a motion video reads like a slideshow.
---

# onetake (feitangyuan/onetake)

One HTML composition (`window.__seek(t)`), a measured move library (`lib/motion.js`: springs, entrances,
carries, contact, camera), footage recorded from the real product, a shared-room SFX palette and an
"oracle" (`scripts/verify_promo.py`) that fails a slideshow-like cut before a human watches it.
Drafts render 1080p30, finals 4K60.

**Licence: PolyForm Noncommercial 1.0.0.** Free for personal/non-commercial use only. Do not use it for
paid client work (e.g. the Jhajj'z site or its marketing) without a commercial licence from the author;
say so to the user before starting if the film is commercial.

## Get it

```bash
git clone --depth 1 https://github.com/feitangyuan/onetake ~/.cache/skill-repos/onetake
```

Then read `~/.cache/skill-repos/onetake/SKILL.md` in full and follow its protocol in order:

1. Deconstruct a reference: `python3 scripts/analyze_ref.py ref.mp4 --out ana/` (energy map, cuts, stillness).
2. Three concepts that differ in their central picture idea (one element transforms, one camera move
   through scale, before/after split, chain reaction…), each with a look from `looks/`
   (`python3 scripts/look.py sheet`). Let the user pick.
3. Beat sheet as rhythm *and* carry: shot lengths varying ≥ 4×, and at every boundary name what survives.
4. Footage from the real thing (`scripts/record_footage.py`) or UI rebuilt from screenshots
   (`references/product-demo.md`, `lib/ui_kit.js`).
5. Render with `scripts/render.py`, sound with `scripts/sfx_palette.py`, check with `scripts/verify_promo.py`.

Worked examples live in `cases/` (e.g. `knockon-15s`, `clearing-15s`).
