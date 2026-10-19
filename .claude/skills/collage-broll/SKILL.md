---
name: collage-broll
description: Turn a ~5-second voice-over line, opinion or abstract idea into an editorial halftone paper-collage B-roll clip with pyang5166's gbro-collage-broll workflow (github.com/pyang5166/gbro-collage-broll, MIT). Three mandatory approval gates — visual metaphor, then the colour collage still, then a Gemini Omni Flash first/last-frame assembly animation. Use for "collage b-roll", "paper collage", "halftone collage", 纸拼贴 / 半调拼贴 requests.
---

# Collage B-roll (pyang5166/gbro-collage-broll)

**The repo's `SKILL.md` (Chinese) is authoritative; this is an English summary of it. Read the original
in full — it holds the visual-spec JSON, the image prompt template, the Omni prompt template, the colour
rules and the QA lists.** MIT licence.

```bash
git clone --depth 1 https://github.com/pyang5166/gbro-collage-broll ~/.cache/skill-repos/collage-broll
bash ~/.cache/skill-repos/collage-broll/scripts/check_setup.sh   # every time, before Gate 1
```

If the check fails, give only the setup steps for what's missing and wait. Needs: `GEMINI_API_KEY`
(generation is billed to that Google account; never print or log it), Python ≥ 3.10, `google-genai>=2.10.0`
in the shared venv `~/hyperframes-projects/.omni-venv` (create only with the user's OK, never
`--break-system-packages`), ffmpeg/ffprobe. Gate 2 uses Codex's built-in `image_gen`; in another agent
the original says to tell the user they need an equivalent image generator, or to supply the still
themselves and continue from the Gate 2 confirmation.

## Gates (stop and wait at each)

1. **Metaphor only.** Per line: core meaning, mood, one-sentence visual proposition, 3–6 key objects,
   base colour + spot colour, assembly order. No images, no video. Only approved items go on.
2. **The still.** Write `visual-spec.json` and the image prompt, make the final still, save it to the
   project, show a numbered contact sheet, write `gate2-qa.md`. No video yet.
3. **Video.** Don't ask about the model again: `scripts/generate_video.py` with
   `gemini-omni-flash-preview` (only switch if the user names another model; never Veo by default).
   First frame = flat empty field in the background colour, last frame = the approved still; jobs in
   `omni-jobs.json`; QA into `gate3-qa.md`.

Defaults: 9:16, 5 s, 720×1280, 24 fps, silent MP4. Halftone black-and-white cut-outs plus coloured
cardstock on a flat colour field; assemble-from-empty motion; no text, logos, watermark or UI.
Project folder: `~/hyperframes-projects/YYYY-MM-DD-collage-broll-<title>/` (Beijing date in the original).
Not for: precise layer/camera control (use an HTML video tool such as HyperFrames), prompt-only
requests, real-person ads, or editable transparent layers.
