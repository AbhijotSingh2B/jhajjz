---
name: lemo-opuscar
description: Direct and produce a short film made entirely in code in one of the Lemo-Opuscar library's styles (impasto oil, watercolour, ukiyo-e, satellite briefing, exploded teardown, microscope story, risograph, blueprint, pixel RPG, hologram HUD, papercut and ~40 more), from github.com/lemomo-ai/lemo-opuscar (MIT). Use when the user asks for a video, short, promo or explainer in a named style, wants help choosing a style, or asks which film styles exist. Not for editing existing video files.
---

# Lemo-Opuscar (lemomo-ai/lemo-opuscar)

A library of film styles (`styles/<slug>/STYLE.md`, each with a demo), shared render/voice/music tools
(`core/`) and a director's guide. MIT licence.

## Get it

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/lemomo-ai/lemo-opuscar ~/lemo-opuscar
git -C ~/lemo-opuscar sparse-checkout set --no-cone '/*' '!/styles/*/demo/' '!/styleboard/' '!/docs/frames/'
LIB=~/lemo-opuscar
```

(The repo's own plugin skill does the same with `plugin/skills/lemo-opuscar/scripts/setup.sh`, which also
installs dependencies: `sh setup.sh deps [voice] [music]`; run `deps` early, it takes minutes.)

## Use it

1. Read `$LIB/AGENTS.md` and follow it: find the style (`$LIB/styles/README.md`), one round of questions,
   a `TREATMENT.md`, production, delivery (`$LIB/DIRECTOR.md` §11 lists the deliverables).
2. Put the film in its own folder `<name>/` where the user started (not inside a client repo unless asked).
   Wherever the guides say `films/<name>/`, read that folder.
3. Run tools from `$LIB` with the project's absolute path, e.g.
   `cd "$LIB" && node core/render/still.mjs "<project>" 1.5 3`. In pages use absolute URLs
   (`/core/lib.js`, `/node_modules/three/…`; the project is served at `/@film/`); in scripts use `$LIB/…`.
4. Techniques: `$LIB/TECHNIQUE.md`. A style's demo source only after `TREATMENT.md` is written
   (`sh $LIB/plugin/skills/lemo-opuscar/scripts/setup.sh demo <slug>`), to read, not to render.
