// Renders the home hero's S-Class turn (hero-turn.html) to public/sclass-turn/<layout>/0001–0120.webp in the site.
//   node tools/render-hero-turn.mjs [--quality wide=92,tall=90] [--frames 1,60,120] [--layout wide|tall] [--out <dir>]
// Uses the system Chrome (CHROME_PATH to override). --frames renders only those frames (for checking the look).
// Speed: each layout renders in its own tab at the same time, and frames are WebP-encoded (CPU) while the next one
// renders (GPU). The GPU Chrome actually got is printed first: "SwiftShader" means it fell back to the CPU.
// WebP is only for delivery (uncompressed frames are several MB each); quality is set so each set lands near its budget
// (lib/sclass-frames.test.mjs: wide ≤ 12 MB, tall ≤ 5 MB).
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i === -1 ? def : args[i + 1]; };
const quality = { wide: 92, tall: 90, ...Object.fromEntries(opt('quality', '').split(',').filter(Boolean).map(kv => {
  const [k, v] = kv.split('='); return [k, Number(v)];
})) };
const only = opt('frames', '').split(',').filter(Boolean).map(Number);
const layouts = opt('layout', 'wide,tall').split(',');
const out = resolve(opt('out', join(root, '..', 'public', 'sclass-turn')));
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.wasm': 'application/wasm', '.css': 'text/css' };
const server = createServer(async (req, res) => {
  try {
    const path = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!path.startsWith(root)) throw new Error('outside');
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const port = server.address().port;

const browser = await puppeteer.launch({ executablePath: chrome, headless: true,
  args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-webgl', '--enable-gpu-rasterization'] });

async function renderLayout(layout) {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error(`${layout} page:`, e.message));
  await page.goto(`http://127.0.0.1:${port}/hero-turn.html`);
  await page.waitForFunction('window.heroTurnReady', { timeout: 120000 });
  if (layout === layouts[0]) console.log('GPU:', await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'unknown';
  }));
  await mkdir(join(out, layout), { recursive: true });
  const frames = only.length ? only : Array.from({ length: 120 }, (_, i) => i + 1);
  const encoding = [];
  let bytes = 0;
  for (const n of frames) {
    const url = await page.evaluate((l, i) => window.renderTurn(l, i), layout, n - 1);
    // Encode in the background while the next frame renders.
    encoding.push(sharp(Buffer.from(url.split(',')[1], 'base64')).webp({ quality: quality[layout], effort: 6 }).toBuffer()
      .then(webp => { bytes += webp.length; return writeFile(join(out, layout, `${String(n).padStart(4, '0')}.webp`), webp); }));
  }
  await Promise.all(encoding);
  await page.close();
  console.log(`${layout}: ${frames.length} frames at quality ${quality[layout]}, ${(bytes / 1e6).toFixed(2)} MB`);
}

const started = Date.now();
try {
  await Promise.all(layouts.map(renderLayout));
  console.log(`done in ${((Date.now() - started) / 1000).toFixed(0)} s`);
} finally {
  await browser.close();
  server.close();
}
