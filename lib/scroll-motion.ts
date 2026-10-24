// Scroll maths for the home page motion (hero S-Class turn, weddings inset, card tilt). Pure functions, tested in
// scroll-motion.test.mjs; Node runs that test on this file directly, so keep to type syntax it can strip.

/** Frames in each rendered set of the S-Class turn (public/sclass-turn/<set>/0001–0120.webp). */
export const FRAME_COUNT = 120;

/** "wide" = 1920×1080 frames with the car right of the headline (lg and up), "tall" = 960×720 frames with the car above it. */
export type FrameSet = "wide" | "tall";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Scroll progress (0–1, clamped) → frame index 0…count-1. */
export function frameIndex(progress: number, count: number = FRAME_COUNT): number {
  return Math.round(clamp01(progress) * (count - 1));
}

/** Below Tailwind's lg (1024px) the headline would cover the car in the wide framing, so phones and tablets get the tall one. */
export function frameSet(viewportWidth: number): FrameSet {
  return viewportWidth < 1024 ? "tall" : "wide";
}

export function frameUrl(set: FrameSet, index: number): string {
  return `/sclass-turn/${set}/${String(index + 1).padStart(4, "0")}.webp`;
}

/** The loaded frame closest to `target` (ties go to the earlier one), or -1 when none has loaded. */
export function nearestLoaded(loaded: readonly boolean[], target: number): number {
  for (let d = 0; d < loaded.length; d++) {
    if (loaded[target - d]) return target - d;
    if (loaded[target + d]) return target + d;
  }
  return -1;
}

/** The other 119 frames are only worth downloading when the turn will actually play. */
export function shouldLoadSequence({ reducedMotion, saveData }: { reducedMotion: boolean; saveData: boolean }): boolean {
  return !reducedMotion && !saveData;
}

/** Inset (px) of the weddings band: `max` at the start, easing out to 0 by progress 1. */
export function insetAt(progress: number, max: number): number {
  const eased = 1 - (1 - clamp01(progress)) ** 2;
  return max * (1 - eased);
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Inset (px) of the S-Class box over its section's scroll progress: a card with the full `max` border until
 * `openStart` (so it doesn't open before it is properly in view; Nirmal), opening to 0 by `openEnd`, open while the car
 * turns, closing from `closeStart` back to `max` by `closeEnd`. Both changes ease in and out.
 */
export function boxInset(
  progress: number,
  max: number,
  [openStart, openEnd, closeStart, closeEnd]: readonly [number, number, number, number],
): number {
  const p = clamp01(progress);
  if (p <= openStart || p >= closeEnd) return max;
  if (p < openEnd) return max * (1 - smoothstep((p - openStart) / (openEnd - openStart)));
  if (p <= closeStart) return 0;
  return max * smoothstep((p - closeStart) / (closeEnd - closeStart));
}

/** Card tilt toward the pointer: 0 at the centre, ±max degrees at the edges (top edge tips toward the viewer). */
export function tiltFromPointer(x: number, y: number, w: number, h: number, max: number = 4): { rotateX: number; rotateY: number } {
  const nx = clamp01(x / w) * 2 - 1;
  const ny = clamp01(y / h) * 2 - 1;
  return { rotateX: -ny * max + 0, rotateY: nx * max + 0 }; // + 0 turns -0 into 0
}
