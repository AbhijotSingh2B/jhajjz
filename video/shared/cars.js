// The three cars, where they are parked, and the camera for every shot.
// Positions in metres on the studio floor; heading turns each car (nose along +z at 0).
// MODELS: dev stand-in until the Sketchfab files arrive (see CREDITS.md).
const DEV = './dev/ferrari.glb';
export const CARS = [
  { id: 'rr', url: DEV, length: 5.05, paint: '#f1f0ec', paintMatch: /^Body_Color$/, pos: [-0.9, 3.2], heading: 0.55 },
  { id: 'sclass', url: DEV, length: 5.18, paint: '#0b0c0e', paintMatch: /^Body_Color$/, paintMetal: 0.5, paintRough: 0.25, pos: [1.7, -3.8], heading: 0.55 },
  { id: 'ghost', url: DEV, length: 5.4, paint: '#f3f2ee', paintMatch: /^Body_Color$/, pos: [-1.3, -10.8], heading: 0.55 },
];

// Cuts on the music's beat grid (placeholder 123 BPM: beat = 60/123 s).
const B = 60 / 123;
const t = [3, 7, 11, 15, 20, 24].map(n => n * B); // 1.46, 3.41, 5.37, 7.32, 9.76, 11.71

export const CUT = {
  t,
  /** Returns shot(t) → { pos, tgt, fov, strip, stripOn } in world space. */
  camera(studio, THREE, track) {
    const W = (id, p) => studio.toWorld(id, p).toArray();
    // Shots 1–2: the Ghost. Low close on the front, creep in, then pull back and rise to the whole car.
    const ghostPos = track([[0, W('ghost', [1.55, 0.62, 3.95])], [t[0] - 0.25, W('ghost', [1.47, 0.63, 3.8])],
      [t[1] - 0.45, W('ghost', [4.3, 2.7, 7.7])], [t[1], W('ghost', [4.55, 2.85, 8.05])]]);
    const ghostTgt = track([[0, W('ghost', [0.25, 0.55, 1.95])], [t[0] - 0.25, W('ghost', [0.25, 0.55, 1.95])],
      [t[1] - 0.45, W('ghost', [0, 0.75, 0.1])], [t[1], W('ghost', [0, 0.75, 0])]]);
    const ghostFov = track([[0, 30], [t[0] - 0.25, 30], [t[1] - 0.45, 34], [t[1], 34]]);
    // Shot 3: the S-Class. Close along the flank from the rear door, swinging round to the front 3/4.
    const sPos = track([[t[1], W('sclass', [2.5, 0.95, -2.1])], [t[1] + 1.1, W('sclass', [3.3, 1.35, 1.4])], [t[2], W('sclass', [4.4, 2.0, 4.4])]]);
    const sTgt = track([[t[1], W('sclass', [0.6, 0.8, -0.7])], [t[1] + 1.1, W('sclass', [0.3, 0.72, 0.5])], [t[2], W('sclass', [0, 0.62, 0.3])]]);
    // Shots 4–5: the Range Rover from high on its other side, then the lift back to all three cars.
    const g = { pos: [9.5, 9.6, 14.5], tgt: [0.2, 0.2, -3.4] };
    const rPos = track([[t[2], W('rr', [-3.7, 3.3, 4.3])], [t[2] + 1.4, W('rr', [-4.1, 3.6, 3.7])],
      [t[4] - 0.75, g.pos], [t[4] - 0.42, [g.pos[0] - 0.15, g.pos[1] + 0.05, g.pos[2] + 0.1]], [t[4], [g.pos[0] - 0.25, g.pos[1] + 0.1, g.pos[2] + 0.2]]]);
    const rTgt = track([[t[2], W('rr', [0, 0.85, 0.2])], [t[2] + 1.4, W('rr', [0, 0.85, 0])],
      [t[4] - 0.75, g.tgt], [t[4] - 0.42, [g.tgt[0], g.tgt[1] + 0.2, g.tgt[2]]], [t[4], [g.tgt[0], 10, g.tgt[2] - 30]]]);
    const rFov = track([[t[2], 32], [t[4] - 0.75, 34], [t[4], 34]]);
    return tt => {
      // the light band runs down the Ghost's bonnet over the first two seconds
      const strip = { strip: lerp(-7, 7, smootherLocal(tt / 2.3)), stripOn: tt < 2.3 ? 1 : Math.max(0, 1 - (tt - 2.3) / 0.3) };
      if (tt < t[1]) return { pos: ghostPos(tt), tgt: ghostTgt(tt), fov: ghostFov(tt), ...strip };
      if (tt < t[2]) return { pos: sPos(tt), tgt: sTgt(tt), fov: 30, strip: 0, stripOn: 0 };
      return { pos: rPos(Math.min(tt, t[4])), tgt: rTgt(Math.min(tt, t[4])), fov: rFov(Math.min(tt, t[4])), strip: 0, stripOn: 0 };
    };
  },
};
function smootherLocal(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }
function lerp(a, b, u) { return a + (b - a) * u; }
