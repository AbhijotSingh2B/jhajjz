# Jhajj'z 3D Reel (15 s, 1080×1920, 60 fps)

A separate project from the website: HTML + GSAP + three.js, rendered frame by frame with HyperFrames.
Brief, facts, storyboard and review rounds: BRIEF.md, FACTS.md, STORYBOARD.md, review/.

```bash
cd video && npm install
export HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx hyperframes snapshot . --at 0,3,6 -o review/shots   # stills
npx hyperframes render . --fps 60 -o renders/film.mp4     # full film
```

Car models: free CC-BY Sketchfab models (CREDITS.md), kept out of git in models/src/; optimised copies in models/.
