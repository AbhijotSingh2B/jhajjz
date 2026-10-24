// The studio: paper cyclorama, sand floor, soft key from the left, rim behind, and the three cars.
// Everything is posed from film time only (render(t)); no clocks, no randomness.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const W = 1080, H = 1920;

// ---- curves -------------------------------------------------------------------------------------------------------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smoother = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const lerp = (a, b, t) => a + (b - a) * t;

/** Monotone cubic (Fritsch–Carlson) through [time, value] keys, zero slope at both ends. Values may be arrays. */
export function track(keys) {
  const n = keys.length, ts = keys.map(k => k[0]);
  const dims = Array.isArray(keys[0][1]) ? keys[0][1].length : 0;
  const comp = d => keys.map(k => (dims ? k[1][d] : k[1]));
  const make = ys => {
    const h = [], s = [];
    for (let i = 0; i < n - 1; i++) { h[i] = ts[i + 1] - ts[i]; s[i] = (ys[i + 1] - ys[i]) / h[i]; }
    const m = new Array(n).fill(0);
    for (let i = 1; i < n - 1; i++) {
      if (s[i - 1] * s[i] <= 0) m[i] = 0;
      else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / s[i - 1] + w2 / s[i]); }
    }
    return t => {
      if (t <= ts[0]) return ys[0];
      if (t >= ts[n - 1]) return ys[n - 1];
      let i = 0; while (t > ts[i + 1]) i++;
      const u = (t - ts[i]) / h[i], u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * ys[i] + (u3 - 2 * u2 + u) * h[i] * m[i] + (-2 * u3 + 3 * u2) * ys[i + 1] + (u3 - u2) * h[i] * m[i + 1];
    };
  };
  if (!dims) return make(comp());
  const fs = [...Array(dims)].map((_, d) => make(comp(d)));
  return t => fs.map(f => f(t));
}

// ---- colours ------------------------------------------------------------------------------------------------------
export const BRAND = { ink: '#151514', paper: '#F4F2EE', sand: '#EAE6DE', gold: '#C5A47E', deepGold: '#7A5E3A' };

// ---- car loading --------------------------------------------------------------------------------------------------
const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader(); draco.setDecoderPath('./vendor/addons/libs/draco/gltf/');
gltfLoader.setDRACOLoader(draco); gltfLoader.setMeshoptDecoder(MeshoptDecoder);

/**
 * cfg: { url, length (m), yaw (rad, turns the model so its nose points +z), paint: hex, paintMatch: RegExp,
 *        pos: [x, z], heading (rad) }
 */
async function loadCar(cfg, envMap) {
  const gltf = await gltfLoader.loadAsync(cfg.url);
  const model = gltf.scene;
  model.rotation.y = cfg.yaw || 0;
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3());
  const s = cfg.length / Math.max(size.x, size.z);
  model.scale.setScalar(s);
  model.updateMatrixWorld(true);
  box.setFromObject(model);
  const c = box.getCenter(new THREE.Vector3());
  model.position.x -= c.x; model.position.z -= c.z; model.position.y -= box.min.y;
  const paint = cfg.paint ? new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cfg.paint), metalness: cfg.paintMetal ?? 0.35, roughness: cfg.paintRough ?? 0.32,
    clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.0,
  }) : null;
  model.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m, i) => {
      if (paint && cfg.paintMatch && cfg.paintMatch.test(m.name || '')) {
        if (Array.isArray(o.material)) o.material[i] = paint; else o.material = paint;
      } else if (m.envMapIntensity !== undefined) {
        m.envMapIntensity = cfg.envIntensity ?? 1.0;
      }
    });
  });
  if (cfg.fix) cfg.fix(model, THREE);
  const root = new THREE.Group();
  root.add(model);
  root.position.set(cfg.pos[0], 0, cfg.pos[1]);
  root.rotation.y = cfg.heading || 0;
  root.updateMatrixWorld(true);
  return { root, model, paint, cfg, size: new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()) };
}

// A soft blurred shadow decal under each car (contact darkening), drawn once on a canvas.
function contactShadowTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 256, 10, 128, 256, 250);
  grd.addColorStop(0, 'rgba(0,0,0,0.55)'); grd.addColorStop(0.45, 'rgba(0,0,0,0.32)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.save(); g.scale(1, 1); g.fillRect(0, 0, 256, 512); g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---- the studio ---------------------------------------------------------------------------------------------------
export async function createStudio(canvas, { cars, pixelRatio = 1 }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(pixelRatio); renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  // Background and fog: authored brighter than paper so that, after ACES, the rendered pixel lands on #F4F2EE.
  // BG_GAIN is tuned by measuring the render (see tools/measure-bg.mjs).
  const bg = new THREE.Color(BRAND.paper).multiplyScalar(window.__BG_GAIN ?? 1.0);
  scene.background = bg;
  scene.fog = new THREE.Fog(bg, 40, 90);

  // Environment for reflections: a room with soft boxes, plus one long strip light we can move (the light band).
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const strip = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(18) }));
  strip.position.set(0, 12, 0); envScene.add(strip);
  let envRT = pmrem.fromScene(envScene, 0.02);
  scene.environment = envRT.texture;
  let lastStrip = null;
  /** Move the reflected strip light (z in env-room units, -8..8). Regenerates the reflections only when it moves. */
  function setStrip(z, on = 1) {
    const key = `${z.toFixed(3)}|${on.toFixed(3)}`;
    if (key === lastStrip) return; lastStrip = key;
    strip.position.z = z; strip.material.color.setScalar(18 * on); strip.visible = on > 0.001;
    const next = pmrem.fromScene(envScene, 0.02);
    envRT.dispose(); envRT = next; scene.environment = envRT.texture;
  }

  // Floor + cove + back wall as one smooth cyclorama surface (profile swept along x).
  const R = 9, depth = 60, wallH = 30, z0 = -24;
  const prof = [];
  for (let i = 0; i <= 12; i++) prof.push(new THREE.Vector2(z0 + depth - (depth * i) / 12, 0));
  for (let i = 1; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; prof.push(new THREE.Vector2(z0 - Math.sin(a) * R, R - Math.cos(a) * R)); }
  prof.push(new THREE.Vector2(z0 - R, R + wallH));
  const cycGeo = new THREE.BufferGeometry();
  const pos = [], idx = [], X0 = -60, X1 = 60, NX = 2;
  prof.forEach(p => { for (let k = 0; k <= NX; k++) pos.push(lerp(X0, X1, k / NX), p.y, p.x); });
  for (let i = 0; i < prof.length - 1; i++) for (let k = 0; k < NX; k++) {
    const a = i * (NX + 1) + k, b = a + 1, c2 = a + NX + 1, d = c2 + 1; idx.push(a, c2, b, b, c2, d);
  }
  cycGeo.setIndex(idx); cycGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); cycGeo.computeVertexNormals();
  const cycMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(BRAND.paper), roughness: 0.55, metalness: 0, envMapIntensity: 0.35 });
  const cyc = new THREE.Mesh(cycGeo, cycMat); cyc.receiveShadow = true; scene.add(cyc);

  // Lights: soft key from the left, fill from the right, warm rim behind; one shadow-casting sun from high left.
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd9d2c6, 0.9); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6ea, 2.4);
  key.position.set(-14, 22, 10); key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096); key.shadow.radius = 6; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -14, right: 14, top: 16, bottom: -16, near: 1, far: 80 });
  scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight(0xf2f4ff, 0.6); fill.position.set(16, 8, 12); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffe2bd, 1.6); rim.position.set(4, 10, -26); scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, W / H, 0.05, 200);

  const loaded = [];
  const shadowTex = contactShadowTexture();
  for (const cfg of cars) {
    const car = await loadCar(cfg, envRT.texture);
    scene.add(car.root);
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(car.size.x * 1.25, car.size.z * 1.12),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: cfg.shadowOpacity ?? 0.8 }));
    decal.rotation.x = -Math.PI / 2; decal.position.y = 0.004; car.root.add(decal);
    loaded.push(car);
  }
  const byId = Object.fromEntries(loaded.map((c, i) => [cars[i].id, c]));

  /** Point in a car's local frame (x right of the car, y up, z forward, metres) → world. */
  const toWorld = (id, p) => new THREE.Vector3(...p).applyMatrix4(byId[id].root.matrixWorld);

  function setCamera(pos, target, fov = 32, roll = 0) {
    camera.position.copy(pos); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(target);
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }
  function project(v) { const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H }; }

  await renderer.compileAsync(scene, camera);
  return { renderer, scene, camera, cars: byId, toWorld, setCamera, setStrip, project, render: () => renderer.render(scene, camera), key };
}
