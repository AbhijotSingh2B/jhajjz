// Root timeline for the Jhajj'z film. Every value is a function of film time t.
import * as THREE from 'three';
import { createStudio, track, clamp, smoother, lerp } from './studio.js';
import { CARS, CUT } from './cars.js';
import { indiaOutline, cityPoints } from './india-map.js';

const J1 = "M117 849Q83 849 83 814L84 785Q84 764 73 752Q62 740 42 740Q23 740 11.5 752Q0 764 0 784Q0 817 31 839Q62 861 109 861Q146 861 179 844.5Q212 828 232 799Q250 773 257.5 735.5Q265 698 265 633V16L347 8V0H106V8L188 16V710Q188 773 168.5 811Q149 849 117 849Z";
const J2 = "M267 999Q233 999 233 964L234 935Q234 914 223 902Q212 890 192 890Q173 890 161.5 902Q150 914 150 934Q150 967 181 989Q212 1011 259 1011Q296 1011 329 994.5Q362 978 382 949Q400 923 407.5 885.5Q415 848 415 783V166L497 158V150H256V158L338 166V860Q338 923 318.5 961Q299 999 267 999Z";
const $ = id => document.getElementById(id);
const DUR = 15;

// ---- map ------------------------------------------------------------------------------------------------------------
const NS = 'http://www.w3.org/2000/svg';
const map = $('map');
const outline = document.createElementNS(NS, 'path'); outline.setAttribute('d', indiaOutline); outline.setAttribute('class', 'outline'); map.appendChild(outline);
const dots = Object.entries(cityPoints).map(([name, [x, y]]) => {
  const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', name === 'Chandigarh' ? 5.2 : 4.2);
  c.setAttribute('class', name === 'Chandigarh' ? 'dot hq' : 'dot'); map.appendChild(c); return c;
});
$('j1').setAttribute('d', J1); $('j2').setAttribute('d', J2);

// Map geometry: Chandigarh dot → the monogram's centre on the end card.
const MAP = { left: 90, top: 560, scale: 900 / 400 };
const CHD = cityPoints['Chandigarh'];
const MONO = { x: 540, y: 470 + 277 / 2 };

window.__hf.buildReady.root = (async () => {
  await Promise.all([document.fonts.load('168px Caslon'), document.fonts.load('500 50px DMSans'), document.fonts.load('600 92px DMSans')]);
  const studio = await createStudio($('gl'), { cars: CARS });
  const shots = CUT.camera(studio, THREE, track);

  const draw = t => {
    const s = shots(t);
    studio.setStrip(s.strip ?? 0, s.stripOn ?? 0);
    studio.setCamera(new THREE.Vector3(...s.pos), new THREE.Vector3(...s.tgt), s.fov);
    studio.render();
  };

  const tl = gsap.timeline({ paused: true });
  const st = { t: 0 };
  tl.to(st, { t: DUR, duration: DUR, ease: 'none', onUpdate: () => draw(st.t) }, 0);

  const C = CUT.t; // cut times

  // shot 1: hook is set at frame 0, creeps, then parts left/right
  tl.fromTo('.hook', { y: 0 }, { y: -18, duration: C[0], ease: 'none' }, 0);
  tl.to('#hookName', { x: -980, duration: 0.42, ease: 'power3.in' }, C[0] - 0.3);
  tl.to('#hw1', { x: -980, duration: 0.42, ease: 'power3.in' }, C[0] - 0.26);
  tl.to('#hw2', { x: 980, duration: 0.42, ease: 'power3.in' }, C[0] - 0.26);

  // car titles: name from the left, years from the right; land slowly, leave fast
  const enter = (id, at) => {
    tl.fromTo(`#${id} h2 .in`, { xPercent: -24, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.62, ease: 'expo.out' }, at);
    tl.fromTo(`#${id} p .in`, { xPercent: 30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.62, ease: 'expo.out' }, at + 0.1);
  };
  tl.set('.title', { opacity: 1 }, 0);
  tl.set('#tGhost h2 .in, #tS .in, #tRR .in', { opacity: 0 }, 0);
  enter('tGhost', C[0] + 0.05);
  // the Ghost's name grows toward the camera and past it; the S-Class is already underneath at the cut
  tl.to('#tGhost', { scale: 9, opacity: 0, filter: 'blur(18px)', duration: 0.58, ease: 'power3.in' }, C[1] - 0.4);
  enter('tS', C[1] + 0.12);
  tl.to('#tS h2 .in', { xPercent: -60, opacity: 0, duration: 0.3, ease: 'power3.in' }, C[2] - 0.3);
  tl.to('#tS p .in', { xPercent: 60, opacity: 0, duration: 0.3, ease: 'power3.in' }, C[2] - 0.3);
  enter('tRR', C[2] + 0.12);
  tl.to('#tRR h2 .in', { xPercent: -60, opacity: 0, duration: 0.34, ease: 'power3.in' }, C[3] - 0.36);
  tl.to('#tRR p .in', { xPercent: 60, opacity: 0, duration: 0.34, ease: 'power3.in' }, C[3] - 0.36);

  // shot 5: services line, alternate sides
  tl.set('.sl', { opacity: 0 }, 0);
  [['#s1', -1], ['#s2', 1], ['#s3', -1]].forEach(([id, side], i) =>
    tl.fromTo(id, { x: side * 260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, C[3] + 0.18 + i * 0.2));
  tl.to('#services', { y: 260, opacity: 0, duration: 0.36, ease: 'power2.in' }, C[4] - 0.36);
  tl.to('#tag', { opacity: 0, duration: 0.25, ease: 'power1.in' }, C[4] - 0.3);

  // shot 6: the paper wall becomes the map's field
  tl.to('#mapfield', { opacity: 1, duration: 0.22, ease: 'power1.inOut' }, C[4] - 0.22);
  const L = outline.getTotalLength();
  tl.fromTo(outline, { strokeDasharray: L, strokeDashoffset: L, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' }, C[4] - 0.1);
  tl.to(outline, { fillOpacity: 1, duration: 0.4, ease: 'power1.out' }, C[4] + 0.35);
  tl.fromTo(dots, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, C[4] + 0.55);
  tl.fromTo('#mapLine', { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, C[4] + 0.05);
  tl.fromTo('#mapwrap', { scale: 1.0 }, { scale: 1.04, duration: C[5] - C[4] - 0.55, ease: 'none' }, C[4]);
  // push in on Chandigarh so its dot lands on the monogram's centre
  const s1 = 1.04, s2 = 2.4;
  const chdAt = s => ({ x: MAP.left + CHD[0] * MAP.scale * s, y: MAP.top + CHD[1] * MAP.scale * s });
  const end = chdAt(s2);
  tl.to('#mapwrap', { scale: s2, x: MONO.x - end.x, y: MONO.y - end.y, duration: 0.6, ease: 'power3.in' }, C[5] - 0.55);
  tl.to('#mapLine', { y: -140, opacity: 0, duration: 0.4, ease: 'power3.in' }, C[5] - 0.5);

  // shot 7: ink opens from the dot; the monogram lands where the dot was
  const R = Math.hypot(1080, 1920);
  tl.fromTo('#endcard', { clipPath: `circle(0px at ${MONO.x}px ${MONO.y}px)` }, { clipPath: `circle(${R}px at ${MONO.x}px ${MONO.y}px)`, duration: 0.55, ease: 'power2.in' }, C[5] - 0.12);
  tl.fromTo('#mono', { scale: 0.06, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'expo.out' }, C[5] + 0.05);
  tl.fromTo('#j2', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, C[5] + 0.2);
  ['.end-name', '.end-cta', '.end-phone', '.end-url'].forEach((sel, i) =>
    tl.fromTo(sel, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, C[5] + 0.3 + i * 0.1));
  tl.fromTo('#endinner', { scale: 1 }, { scale: 1.03, duration: DUR - C[5], ease: 'none' }, C[5]);

  window.__timelines = window.__timelines || {};
  window.__timelines.root = tl;
  window.__seek = t => { tl.seek(t, false); draw(t); };
  draw(0);
  window.addEventListener('hf-seek', e => draw(e.detail.time));
})();
