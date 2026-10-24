// The rendered S-Class turn (video/tools/render-hero-turn.mjs): every frame present, within budget, on the hero's ink.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { FRAME_COUNT, frameUrl } from "./scroll-motion.ts";

const sets = {
  wide: { width: 1920, height: 1080, budget: 12e6 },
  tall: { width: 960, height: 720, budget: 5e6 },
};
const ink = [0x0e, 0x0e, 0x0d]; // --color-ink-deep
const file = (set, i) => fileURLToPath(new URL(`../public${frameUrl(set, i)}`, import.meta.url));

for (const [set, spec] of Object.entries(sets)) {
  test(`${set} frames exist and fit the budget`, () => {
    let bytes = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      assert.ok(existsSync(file(set, i)), `missing ${frameUrl(set, i)}`);
      bytes += statSync(file(set, i)).size;
    }
    assert.ok(bytes <= spec.budget, `${set} is ${(bytes / 1e6).toFixed(2)} MB`);
  });

  test(`${set} frames are the right size with ink corners`, async () => {
    for (const i of [0, 59, 119]) {
      const { data, info } = await sharp(file(set, i)).raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.width, spec.width);
      assert.equal(info.height, spec.height);
      for (const [x, y] of [[1, 1], [info.width - 2, 1], [1, info.height - 2], [info.width - 2, info.height - 2]]) {
        const p = (y * info.width + x) * info.channels;
        ink.forEach((c, k) => assert.ok(Math.abs(data[p + k] - c) <= 3, `${frameUrl(set, i)} corner ${x},${y}`));
      }
    }
  });
}
