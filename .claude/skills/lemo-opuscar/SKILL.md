---
name: lemo-opuscar
description: Direct and produce a short film made entirely in code in one of the Lemo-Opuscar library's 51 styles (e.g. Impasto Oil Painting, Watercolor Brush, Ukiyo-e, Satellite Briefing, Exploded Teardown, Microscope Story), from github.com/lemomo-ai/lemo-opuscar (MIT). Use when the user asks for a video, film, short, promo, explainer or animation in a named style, wants a film on their topic without having chosen a style, or asks which styles exist. Not for editing or converting existing video files.
---

# Lemo-Opuscar (lemomo-ai/lemo-opuscar)

This mirrors the repo's own plugin skill (`plugin/skills/lemo-opuscar/SKILL.md`): fetch the library and
hand over to it. **The library's `AGENTS.md` is authoritative.** MIT licence.

1. **Get the library** with the repo's own setup script (clones on first run, updates later, prints
   `LIB=<path>` last; default `~/lemo-opuscar`):
   ```bash
   mkdir -p ~/.cache/skill-repos/lemo-opuscar-setup
   curl -fsSL https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/plugin/skills/lemo-opuscar/scripts/setup.sh \
     -o ~/.cache/skill-repos/lemo-opuscar-setup/setup.sh
   sh ~/.cache/skill-repos/lemo-opuscar-setup/setup.sh
   ```
   Read the script before running it the first time.
2. **Install core tools early**: `sh <setup.sh> deps` (minutes the first time; in the background if
   possible). Add `deps voice` / `deps music` later only if the film needs them. Report missing system
   tools (Node 20+, ffmpeg, Python 3.11+) in your one round of questions; don't install system software.
3. **Follow `$LIB/AGENTS.md`**: find the style (`$LIB/styles/README.md`; if none chosen, suggest 2–3 and
   show the full list in the user's language, plus the gallery https://lemomo-ai.github.io/lemo-opuscar/),
   one round of questions, `TREATMENT.md` (three candidate structures) **before** opening the demo, look
   frames, storyboard only if asked, produce, self-check and deliver (`$LIB/DIRECTOR.md` §11).
   `STYLE.md` is fixed; story and structure come from the user's topic, never the demo's.

Skill-mode rules (from the original):
- Project folder `<name>/` in the folder the user started from (lowercase, digits, hyphens; no `#`/`?`);
  wherever the guides say `films/<name>/`, read this folder.
- Run tools from `$LIB` with the project's absolute path: `cd "$LIB" && node core/render/still.mjs "<project>" 1.5 3`.
- In pages, library files by absolute URL (`/core/lib.js`, `/node_modules/three/…`; project served at
  `/@film/`). In scripts and `build.sh`, `$LIB/…` with `LIB=<path>` at the top; never `../..`.
- Demo source only after `TREATMENT.md`: `sh <setup.sh> demo <slug>`, to read techniques, not to render.
- Films outside `styles/` are the user's: no LemoLab credit or watermark.
