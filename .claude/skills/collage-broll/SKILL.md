---
name: collage-broll
description: Turn a ~5-second voice-over line, opinion or abstract idea into an editorial halftone paper-collage B-roll clip with the gbro-collage-broll workflow (github.com/pyang5166/gbro-collage-broll, MIT). Three approval gates — visual metaphor, then a colour collage still, then a Gemini-generated assembly animation. Use for "collage b-roll", "paper collage", "halftone collage" or 纸拼贴 / 半调拼贴 requests.
---

# Collage B-roll (pyang5166/gbro-collage-broll)

Compresses one spoken line into a single sharp visual idea and makes it a premium editorial
halftone paper-collage animation. MIT licence. The repo's own SKILL.md is in Chinese; the steps are below.

## Needs (check before Gate 1)

- `GEMINI_API_KEY` (video generation is billed to that Google account) — keep it in `.env` or the
  environment, never in a prompt or commit.
- Python ≥ 3.10 with `google-genai>=2.10.0`, ffmpeg + ffprobe.
- An image generator for the still (the original targets Codex's `image_gen`). In Claude Code, ask the
  user to supply the still, or build it in code (canvas/Pillow halftone + cut-paper shapes).

```bash
git clone --depth 1 https://github.com/pyang5166/gbro-collage-broll ~/.cache/skill-repos/collage-broll
bash ~/.cache/skill-repos/collage-broll/scripts/check_setup.sh
```

## Workflow (gates are mandatory — stop and wait at each)

1. **Gate 1 – metaphor only.** For each line give: core meaning, mood, one-sentence visual proposition,
   3–6 key objects, base colour + one spot colour, planned assembly order. No images, no video. Wait for OK.
2. **Gate 2 – the still.** Make only the final colour collage frame. Wait for OK.
3. **Gate 3 – animation.** `scripts/generate_video.py` with the default model `gemini-omni-flash-preview`
   (first/last-frame assembly animation; only switch model if the user names one), then QA with ffprobe.

Read the full `SKILL.md`, `agents/` and `assets/` in the clone for prompt templates and style references.
