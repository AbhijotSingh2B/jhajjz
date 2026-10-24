// Run with `npm test` (Node's built-in test runner; Node strips the types from scroll-motion.ts itself).
import test from "node:test";
import assert from "node:assert/strict";
import {
  boxInset,
  frameIndex,
  frameSet,
  frameUrl,
  insetAt,
  nearestLoaded,
  shouldLoadSequence,
  tiltFromPointer,
} from "./scroll-motion.ts";

test("frameIndex", () => {
  assert.equal(frameIndex(0), 0);
  assert.equal(frameIndex(1), 119);
  assert.equal(frameIndex(0.5), 60);
  assert.equal(frameIndex(-2), 0);
  assert.equal(frameIndex(3), 119);
});

test("frameSet", () => {
  assert.equal(frameSet(344), "tall");
  assert.equal(frameSet(1023), "tall");
  assert.equal(frameSet(1024), "wide");
});

test("frameUrl", () => {
  assert.equal(frameUrl("wide", 0), "/sclass-turn/wide/0001.webp");
  assert.equal(frameUrl("tall", 119), "/sclass-turn/tall/0120.webp");
});

test("nearestLoaded", () => {
  assert.equal(nearestLoaded([true, false, false, true], 2), 3);
  assert.equal(nearestLoaded([true, false, true], 1), 0);
  assert.equal(nearestLoaded([false, false], 1), -1);
  assert.equal(nearestLoaded([false, true], 1), 1);
});

test("shouldLoadSequence", () => {
  assert.equal(shouldLoadSequence({ reducedMotion: false, saveData: false }), true);
  assert.equal(shouldLoadSequence({ reducedMotion: true, saveData: false }), false);
  assert.equal(shouldLoadSequence({ reducedMotion: false, saveData: true }), false);
});

test("insetAt", () => {
  assert.equal(insetAt(0, 48), 48);
  assert.equal(insetAt(1, 48), 0);
  assert.equal(insetAt(1.5, 48), 0);
  assert.equal(insetAt(0.5, 48), 12);
});

test("tiltFromPointer", () => {
  assert.deepEqual(tiltFromPointer(50, 50, 100, 100), { rotateX: 0, rotateY: 0 });
  assert.deepEqual(tiltFromPointer(100, 0, 100, 100), { rotateX: 4, rotateY: 4 });
  assert.deepEqual(tiltFromPointer(500, 50, 100, 100), { rotateX: 0, rotateY: 4 });
});

test("boxInset", () => {
  const stops = /** @type {const} */ ([0.25, 0.5, 0.75, 1]);
  assert.equal(boxInset(0.1, 48, stops), 48); // still a card while it comes into view
  assert.equal(boxInset(0.25, 48, stops), 48);
  assert.equal(boxInset(0.375, 48, stops), 24); // halfway open (smoothstep)
  assert.equal(boxInset(0.5, 48, stops), 0);
  assert.equal(boxInset(0.6, 48, stops), 0); // stays open while the car turns
  assert.equal(boxInset(0.875, 48, stops), 24);
  assert.equal(boxInset(1, 48, stops), 48); // a card again as it leaves
  assert.equal(boxInset(-1, 48, stops), 48);
  assert.equal(boxInset(2, 48, stops), 48);
});
