---
name: hyperframes
description: Make, edit, preview or render a video with HeyGen's HyperFrames framework (github.com/heygen-com/hyperframes, Apache-2.0), which turns HTML, CSS, media and seekable animations into deterministic MP4s. Use for promos, explainers, motion graphics, captioned clips, title cards, slideshows/decks, product-launch or PR-to-video films, or porting a Remotion project.
---

# HyperFrames (heygen-com/hyperframes)

This file only installs HyperFrames' own skills and hands over to them. **The repo's skills are
authoritative; where this file and them disagree, follow them.** Apache-2.0, fine for client work.
Requirements (README): Node.js 22+, FFmpeg; rendering uses headless Chrome.

## 1. Install its skills

```bash
npx hyperframes skills update      # non-interactive: installs the core set from main (README's advice for agents)
```

Or as a Claude Code plugin: `claude plugin marketplace add heygen-com/hyperframes` then
`claude plugin install hyperframes@hyperframes`. If `skills update` fails, surface the error; do not
reconstruct a workflow from memory (the router says so). For the no-CLI fallback, see the router's
`references/skill-lifecycle.md`:

```bash
git clone --depth 1 https://github.com/heygen-com/hyperframes ~/.cache/skill-repos/hyperframes
```

## 2. Read the router first: `/hyperframes` (`skills/hyperframes/SKILL.md`)

What it does, briefly (read it in full; this is not a substitute):
- Runs `npx hyperframes usage --json` at the start and at milestones; never guess usage.
- Starts from project state (existing `BRIEF.md`, `hyperframes.json`, `STORYBOARD.md`, a specific edit…).
  For fresh creation it runs the intent interview (`references/intent-interview.md`), which ends by
  writing `BRIEF.md`, then routes once to a workflow: `/remotion-to-hyperframes`, `/slideshow`,
  `/embedded-captions`, `/talking-head-recut`, `/music-to-video`, `/motion-graphics`, `/pr-to-video`,
  `/product-launch-video`, `/faceless-explainer`, or `/general-video`.
- Installs the chosen workflow with `npx hyperframes skills update <workflow-name>`.
- Loads domain skills on demand: `/hyperframes-core` (read before writing composition HTML),
  `-animation`, `-keyframes`, `-creative`, `-audio`, `-cli`, `-registry` (check it before hand-building a
  named effect or transition), `/media-use`, `/figma`, `/hyperframes-studio`.

## 3. CLI loop (from `/hyperframes-cli`)

`npx hyperframes lint` while editing → `npx hyperframes check` (required final gate; runs lint itself) →
`npx hyperframes preview --background` and hand the user the preview → **wait for approval; never render
just because checks pass** → `npx hyperframes render --quality looks --output out.mp4` (`--quality delivery`
for final) → ffprobe the output and look at decoded frames.

Keep projects outside client repos unless the user says otherwise.
