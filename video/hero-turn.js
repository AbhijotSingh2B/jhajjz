// The website's home hero (app/page.tsx, components/hero-turn.tsx): the black S-Class turning ~180° on the hero's ink.
// window.renderTurn(layout, i) poses frame i of 120 and renders it; tools/render-hero-turn.mjs saves the canvas.
import * as THREE from 'three';
import { createStudio, smoother } from './shared/studio.js';
import { CARS } from './shared/cars.js';

const INK = '#0e0e0d'; // --color-ink-deep, the hero's background on the site
const FRAMES = 120;
const START = -Math.PI / 4; // front three-quarter, nose toward the text on the left
// Ends on the other front three-quarter (side a little more open), never showing the back (Nirmal: stop around here).
const TURN = 0.95 + Math.PI / 4;

// Both centred, the car about half the box width. wide: the full-screen box at lg and up. tall: the shorter box on
// phones and tablets (60% of the screen), car across most of its width.
export const LAYOUTS = {
  wide: { width: 1920, height: 1080, dist: 7.6, shift: 0 },
  tall: { width: 960, height: 720, dist: 8.6, shift: 0 },
};

const sclass = { ...CARS.find(c => c.id === 'sclass'), pos: [0, 0], heading: 0 };
const studios = {};

async function studioFor(layout) {
  if (studios[layout]) return studios[layout];
  const L = LAYOUTS[layout];
  document.querySelectorAll('canvas').forEach(c => c.remove());
  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  const s = await createStudio(canvas, { cars: [sclass], width: L.width, height: L.height, background: INK });
  // A dark room: the car is lit from above like a showroom, a cool fill and a warm rim pick out its edges.
  s.hemi.intensity = 0.25;
  s.key.position.set(-4, 26, 6); s.key.intensity = 1.6;
  s.fill.intensity = 0.25;
  s.rim.intensity = 2.2; s.rim.position.set(-10, 8, -22);
  s.setStrip(0, 0); // no strip band: on black paint it reads as a grey roof
  s.cars.sclass.paint.envMapIntensity = 0.6;
  s.camera.position.set(0, 1.35, L.dist);
  s.camera.lookAt(0, 0.62, 0);
  s.camera.fov = 30;
  // Slide the framing sideways without moving the camera, so the car's perspective stays the same in both layouts.
  s.camera.setViewOffset(L.width, L.height, L.shift * L.width, 0, L.width, L.height);
  s.camera.updateProjectionMatrix();
  studios[layout] = s;
  return s;
}

// The floor reflection is the car rendered upside down, laid over the frame faded out below the wheels. Both renders
// share the same ink background, so blending them leaves the background exactly the hero's colour.
const REFLECT = 0.14, REFLECT_DEPTH = 0.16; // strength at the wheels; fade length as a share of the frame height

window.renderTurn = async (layout, i) => {
  const s = await studioFor(layout), L = LAYOUTS[layout], root = s.cars.sclass.root;
  const out = document.createElement('canvas'); out.width = L.width; out.height = L.height;
  const g = out.getContext('2d');
  root.rotation.y = START + smoother(i / (FRAMES - 1)) * TURN;

  root.scale.y = -1; root.updateMatrixWorld(true); s.render();
  const mirror = document.createElement('canvas'); mirror.width = L.width; mirror.height = L.height;
  const m = mirror.getContext('2d');
  m.drawImage(s.renderer.domElement, 0, 0);
  const floorY = s.project(new THREE.Vector3(0, 0, 0)).y;
  const fade = m.createLinearGradient(0, floorY - L.height * 0.02, 0, floorY + L.height * REFLECT_DEPTH);
  fade.addColorStop(0, `rgba(0,0,0,${REFLECT})`); fade.addColorStop(1, 'rgba(0,0,0,0)');
  m.globalCompositeOperation = 'destination-in'; m.fillStyle = fade; m.fillRect(0, 0, L.width, L.height);

  root.scale.y = 1; root.updateMatrixWorld(true); s.render();
  g.drawImage(s.renderer.domElement, 0, 0);
  g.drawImage(mirror, 0, 0);
  return out.toDataURL('image/png');
};
window.heroTurnReady = true;
