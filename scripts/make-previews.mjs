// Draws the link-preview images (what WhatsApp, Facebook, LinkedIn and X show when someone shares a page) into
// public/og/: one 1200x630 JPEG per page, the page's photo with the JJ monogram and the page's name, in the site's
// own fonts. Pages point at them through lib/seo.ts `previewImage()`.
// Photos come from public/photos, so run `npm run save-photos` first after changing a photo. Stand-in studio
// photos (`placeholder`, `cutout`) aren't the client's cars, so those pages get the hero photo with their name.
// Run: npm run previews (needs Playwright; in the Claude sandbox it is found at /opt/node22).
import { createJiti } from "jiti";
import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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

const site = await createJiti(import.meta.url).import(join(root, "lib/site.ts"));
const { cars, fleet, carName, carsInClass, heroImage } = site;

// The monogram's two Js, straight from components/logo.tsx so the cards always match the site.
const logo = readFileSync(join(root, "components/logo.tsx"), "utf8");
const [j1, j2] = [...logo.matchAll(/const J[12] =\s*"([^"]+)"/g)].map((m) => m[1]);

const file = (src) => pathToFileURL(join(root, "public", src)).href;
const font = (path) => pathToFileURL(join(root, "node_modules", path)).href;

const tagline = "Chauffeur-driven, from Jhajj'z. Head office in Chandigarh, serving pan-India.";
/** name → { photo, position, title, line } */
const cards = {
  home: {
    photo: heroImage,
    title: "Jhajj'z",
    line: "Luxury car and coach rental since 1998. Head office in Chandigarh, serving pan-India.",
  },
  fleet: { photo: heroImage, title: "Our fleet", line: tagline },
  contact: { photo: heroImage, title: "Get a quote", line: "Talk to us on WhatsApp, call, or send the quote form." },
};
/** The car's first photo of the client's own (not a stand-in, not portrait). */
const ownPhoto = (c) => c.photos.find((p) => !p.placeholder && !p.cutout && !p.portrait);
for (const v of fleet) {
  const inClass = carsInClass(v.slug);
  if (inClass.length === 0) continue;
  // The class photo if it's the client's, else the first of its cars that has one (SUVs: a real SUV, not the hero).
  const own = !v.imagePlaceholder && !v.imageCutout && v.image ? { src: v.image } : inClass.map(ownPhoto).find(Boolean);
  cards[v.slug] = { photo: own?.src ?? heroImage, position: own?.position, title: v.name, line: tagline };
}
for (const c of cars) {
  const own = ownPhoto(c);
  cards[c.slug] = { photo: own?.src ?? heroImage, position: own?.position, title: carName(c), line: tagline };
}

const html = ({ photo, position = "center", title, line }) => `<!doctype html><html><head><style>
@font-face { font-family: Caslon; src: url(${font("@fontsource/libre-caslon-display/files/libre-caslon-display-latin-400-normal.woff2")}); }
@font-face { font-family: DM Sans; font-weight: 100 1000; src: url(${font("@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2")}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #151514; }
/* Photo on the right 64%, fading into the ink panel that holds the text, so the car is never under the words. */
img.photo { position: absolute; top: 0; right: 0; width: 770px; height: 100%; object-fit: cover; object-position: ${position}; }
.shade { position: absolute; top: 0; bottom: 0; left: 430px; width: 260px; background: linear-gradient(90deg, #151514, rgb(21 21 20 / 0)); }
.text { position: absolute; left: 64px; top: 60px; bottom: 60px; width: 420px; display: flex; flex-direction: column; justify-content: space-between; }
svg { height: 84px; width: auto; align-self: flex-start; fill: #c5a47e; }
h1 { font: 400 64px/1.05 Caslon; color: #fbfaf7; letter-spacing: -0.01em; text-wrap: balance; }
.nb { white-space: nowrap; }
p { margin-top: 20px; font: 400 23px/1.45 "DM Sans"; color: #cfcac0; text-wrap: pretty; }
</style></head><body>
<img class="photo" src="${file(photo)}">
<div class="shade"></div>
<div class="text">
  <svg viewBox="0 0 497 1011"><path d="${j1}"/><path d="${j2}"/></svg>
  <div><h1>${title.replace(/'/g, "&rsquo;").replace(/(\S+-\S+)/g, '<span class="nb">$1</span>')}</h1><p>${line.replace(/'/g, "&rsquo;")}</p></div>
</div>
</body></html>`;

const out = join(root, "public/og");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Loaded from a file (not setContent) so the page may read the local photos and fonts.
const temp = mkdtempSync(join(tmpdir(), "previews-"));
const card = join(temp, "card.html");
for (const [name, spec] of Object.entries(cards)) {
  if (!spec.photo.startsWith("/")) throw new Error(`${name}: photo not saved locally, run npm run save-photos`);
  writeFileSync(card, html(spec));
  await page.goto(pathToFileURL(card).href, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    if (!document.querySelector("img").naturalWidth) throw new Error("photo did not load");
  });
  await page.screenshot({ path: join(out, `${name}.jpg`), type: "jpeg", quality: 82 });
}
await browser.close();
rmSync(temp, { recursive: true });
console.log(`${readdirSync(out).length} previews in public/og`);
