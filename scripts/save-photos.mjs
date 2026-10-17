// Downloads every photo URL in lib/site.ts into public/photos/ and records original URL → local path in
// lib/saved-photos.json, which `saved()` in lib/site.ts reads. Already-saved photos are skipped; entries whose URL
// is no longer in lib/site.ts are dropped from the JSON (their files are left for you to delete).
// Run: npm run save-photos (in the Claude sandbox: NODE_USE_ENV_PROXY=1 npm run save-photos, so fetch uses the proxy)
import { createJiti } from "jiti";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "lib/saved-photos.json");
const old = JSON.parse(readFileSync(manifestPath, "utf8"));

const { photoSources } = await createJiti(import.meta.url).import(join(root, "lib/site.ts"));

// The extension follows what the host actually sends: CarWale answers its .jpg URLs with WebP.
const extensions = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/avif": "avif" };

/** Readable local path from a photo URL, e.g. /photos/wix/171684_d0d4…-fill-1600x1067.webp */
function localPath(url, ext) {
  const u = new URL(url);
  if (u.hostname === "static.wixstatic.com") {
    // /media/<id>~mv2.jpg/v1/<fill|fit>/w_1600,h_1067,.../<name>.webp
    const [, id, mode, opts, name] = u.pathname.match(/^\/media\/([^~/]+)[^/]*\/v1\/(\w+)\/([^/]+)\/(.+)$/);
    const size = `${opts.match(/w_(\d+)/)[1]}x${opts.match(/h_(\d+)/)[1]}`;
    const prefix = name.startsWith("hero") ? "hero-" : "";
    return `/photos/wix/${prefix}${id}-${mode}-${size}.${ext}`;
  }
  const dir = u.hostname.includes("cardekho") ? "cardekho" : "carwale";
  const base = u.pathname
    .replace(/^\/(1280x720\/n\/(cw\/ec\/)?|images\/car-images\/930x620\/)/, "")
    .replace(/\.(webp|jpe?g|png)$/i, "")
    .replace(/[^\w-]+/g, "-");
  return `/photos/${dir}/${base}.${ext}`;
}

const manifest = {};
let downloaded = 0;
for (const url of [...photoSources].sort()) {
  let local = old[url];
  if (!local || !existsSync(join(root, "public", local))) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} for ${url}`);
    const ext = extensions[res.headers.get("content-type")?.split(";")[0]];
    if (!ext) throw new Error(`Not an image (${res.headers.get("content-type")}): ${url}`);
    local = localPath(url, ext);
    if (Object.values(manifest).includes(local)) throw new Error(`Two URLs map to ${local}`);
    const file = join(root, "public", local);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    downloaded++;
    console.log(`saved ${local}`);
  }
  manifest[url] = local;
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`${photoSources.size} photos, ${downloaded} downloaded.`);
