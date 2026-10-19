---
name: hyperframes
description: Turn HTML, CSS, media and seekable (GSAP-style) animations into deterministic MP4 videos with HeyGen's HyperFrames framework (github.com/heygen-com/hyperframes, Apache-2.0). Use when asked for a video, promo, explainer, captioned clip, title card, slideshow, product-launch or PR-to-video film made with HyperFrames, or when porting a Remotion project to HTML video.
---

# HyperFrames (heygen-com/hyperframes)

HTML-to-video framework built for agents. A composition is an HTML file whose DOM declares timing with
`data-*` attributes and whose animation runtime is seekable; the CLI previews, lints and renders it to MP4.
Apache-2.0, so fine for client and commercial work. Needs Node ≥ 22, ffmpeg and Chromium.

## Get it

The repo ships its own 21 skills (router `hyperframes` plus `hyperframes-core`, `-animation`, `-audio`,
`-cli`, `-creative`, `-keyframes`, `motion-graphics`, `product-launch-video`, `pr-to-video`, `slideshow`,
`embedded-captions`, `faceless-explainer`, `remotion-to-hyperframes`, `figma`, `media-use`, …). Install the
core set and let its router pull workflows on demand:

```bash
npx hyperframes skills update          # non-interactive: installs the core skill set from main
# or, as a Claude Code plugin:
claude plugin marketplace add heygen-com/hyperframes && claude plugin install hyperframes@hyperframes
```

If installing isn't possible, read the skills straight from a clone:

```bash
git clone --depth 1 https://github.com/heygen-com/hyperframes ~/.cache/skill-repos/hyperframes
# then read ~/.cache/skill-repos/hyperframes/skills/hyperframes/SKILL.md (the router) and follow it
```

## Use it

1. Read the router skill (`skills/hyperframes/SKILL.md`) first; it picks the workflow for the request.
2. Read `hyperframes-core` before writing any composition HTML (the authoring contract).
3. Typical loop: `npx hyperframes init` → write the composition → lint → preview (Studio) → render.
4. `npx hyperframes usage --json` reports remaining hosted usage; never guess it.

Keep work outside client repos (scratchpad or its own folder) unless the user says otherwise.
