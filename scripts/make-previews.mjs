// Draws the link-preview banner (what WhatsApp, Instagram, Facebook, LinkedIn and X show when someone shares a page)
// into public/og/, in the site's own fonts and logo:
//   jhajjz.jpg         1200x630, the standard size (Facebook, WhatsApp, LinkedIn, X)
//   jhajjz-square.jpg  1080x1080, for apps that show a square preview (Instagram)
// Every page uses it for now (lib/seo.ts `openGraphBase`); custom per-page banners can come later.
// The composition is centred, because apps often crop the preview to a square from the middle.
// Photo: the client's Rolls-Royce Ghost, head-on with its JHAJJZ plate (public/photos, via lib/site.ts).
// Run: npm run previews (needs Playwright; in the Claude sandbox it is found at /opt/node22).
import { createJiti } from "jiti";
import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require("/opt/node22/lib/node_modules/playwright");
}

const { photos, founded } = await createJiti(import.meta.url).import(join(root, "lib/site.ts"));
if (!photos.ghostFront.startsWith("/")) throw new Error("Ghost photo not saved locally, run npm run save-photos");

// The monogram's two Js, straight from components/logo.tsx so the banner always matches the site.
const logo = readFileSync(join(root, "components/logo.tsx"), "utf8");
const [j1, j2] = [...logo.matchAll(/const J[12] =\s*"([^"]+)"/g)].map((m) => m[1]);

const file = (src) => pathToFileURL(join(root, "public", src)).href;
const font = (path) => pathToFileURL(join(root, "node_modules", path)).href;

/**
 * w x h banner. `photo` places the 3:4 Ghost photo (its height and top, px); the car comes out of the dark in the
 * middle, the monogram and name sit above it, one line below.
 */
const html = ({ w, h, photo, mark, name, line, top, bottom }) => {
  // Each side fill reaches from the banner's edge to well under the photo's faded edge.
  const side = (w - photo.height * 0.75) / 2 + photo.height * 0.75 * 0.3 + 20;
  return `<!doctype html><html><head><style>
@font-face { font-family: Caslon; src: url(${font("@fontsource/libre-caslon-display/files/libre-caslon-display-latin-400-normal.woff2")}); }
@font-face { font-family: DM Sans; font-weight: 100 1000; src: url(${font("@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2")}); }
* { margin: 0; box-sizing: border-box; }
body { width: ${w}px; height: ${h}px; position: relative; overflow: hidden; background: #151514; }
/* No bars at the sides: the photo's own car-free edges (road, verge, trees, all out of focus already) are stretched
   out to the banner's edges and softened, and the sharp photo fades into them. */
.side { position: absolute; top: ${photo.top}px; height: ${photo.height}px; width: ${Math.round(side)}px;
  background-image: url(${file(photos.ghostFront)}); background-repeat: no-repeat; filter: blur(10px) brightness(0.8) saturate(0.85); }
.side.l { left: -20px; background-size: ${Math.round(side / 0.18)}px 100%; background-position: 0 0; }
.side.r { right: -20px; background-size: ${Math.round(side / 0.09)}px 100%; background-position: 100% 0; }
.photo { position: absolute; left: 50%; top: ${photo.top}px; height: ${photo.height}px; aspect-ratio: 3 / 4; translate: -50% 0;
  background: url(${file(photos.ghostFront)}) center / cover;
  mask-image: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent); filter: saturate(0.9); }
/* Darker at the top and bottom for the words, and towards the corners, so the white car is what you see first. */
.shade { position: absolute; inset: 0;
  background: linear-gradient(180deg, rgb(21 21 20 / 0.78), rgb(21 21 20 / 0) ${photo.fadeTop}%, rgb(21 21 20 / 0) ${photo.fadeBottom}%, rgb(21 21 20 / 0.85)),
    radial-gradient(ellipse 75% 90% at 50% 60%, rgb(21 21 20 / 0) 55%, rgb(21 21 20 / 0.55)); }
.brand { position: absolute; top: ${top}px; inset-inline: 0; display: flex; flex-direction: column; align-items: center; }
svg { height: ${mark}px; fill: #c5a47e; }
h1 { margin-top: ${Math.round(mark * 0.22)}px; font: 400 ${name}px/1 Caslon; color: #fbfaf7; letter-spacing: -0.005em; }
p { position: absolute; bottom: ${bottom}px; inset-inline: 0; text-align: center; font: 400 ${line}px/1.4 "DM Sans"; color: #dad5cb; }
p span { color: #c5a47e; padding: 0 0.5em; }
</style></head><body>
<div class="side l"></div>
<div class="side r"></div>
<div class="photo"></div>
<div class="shade"></div>
<div class="brand">
  <svg viewBox="0 0 497 1011"><path d="${j1}"/><path d="${j2}"/></svg>
  <h1>Jhajj&#39;z</h1>
</div>
<p>Luxury car and coach rental since ${founded}<span>&middot;</span>Chandigarh, serving pan-India</p>
</body></html>`;
};

const banners = {
  jhajjz: { w: 1200, h: 630, photo: { height: 840, top: -96, fadeTop: 38, fadeBottom: 66 }, mark: 64, name: 60, line: 22, top: 38, bottom: 34 },
  "jhajjz-square": { w: 1080, h: 1080, photo: { height: 1240, top: -60, fadeTop: 32, fadeBottom: 78 }, mark: 96, name: 88, line: 27, top: 88, bottom: 72 },
};

const out = join(root, "public/og");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
// Loaded from a file (not setContent) so the page may read the local photo and fonts.
const temp = mkdtempSync(join(tmpdir(), "previews-"));
const browser = await playwright.chromium.launch();
for (const [name, spec] of Object.entries(banners)) {
  const page = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
  const card = join(temp, `${name}.html`);
  writeFileSync(card, html(spec));
  await page.goto(pathToFileURL(card).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(out, `${name}.jpg`), type: "jpeg", quality: 85 });
  await page.close();
}
await browser.close();
rmSync(temp, { recursive: true });
console.log(`Banners in public/og: ${Object.keys(banners).join(", ")}`);
