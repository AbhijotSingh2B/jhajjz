"use client";

import { useEffect, useRef } from "react";
import { J1, J2, lastJ, letters } from "@/components/logo";

/** Set on the first entry of a visit (this tab), so reloads and later pages go straight to the site. */
export const splashKey = "jhajjz-intro";

/**
 * Runs in <head> before the first paint: decides whether the entry screen plays, so a reload never flashes
 * it. Only on the home page: a visitor arriving on a car or contact page (e.g. from Google) goes straight to
 * it. Reduced motion skips it (nothing to watch, only a wait).
 */
export const splashScript = `try{var d=document.documentElement;if(location.pathname!=="/"||sessionStorage.getItem("${splashKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("no-splash");else{d.classList.add("splash");sessionStorage.setItem("${splashKey}","1")}}catch(e){}`;

/*
 * The opening, in seconds on its own clock (from when the script starts it, not from the tap: on a real
 * connection the page can arrive a second after the tap, and counting from the tap cut it short, Nirmal on his
 * phone). "Jhajj'z" rises letter by letter from behind a line; "hajj'z" then slides left into the first J's stem
 * while the last j turns gold and reshapes into the second J, covering the letters on its way in; light passes
 * once over the monogram, which then flies to the header logo as the ink lifts away. The monogram leaves at
 * FLY once the page has loaded, by LATEST at the latest. Approved as a rendered preview (Oct 2026).
 */
const RISE = 0.15;
const FOLD = 1.3;
const SHEEN = 2.3;
const FLY = 2.95;
const LATEST = 3.3;
const LEAVE = 600;

const CREAM = [244, 242, 238];
const GOLD = [197, 164, 126];

// Closed-form critically damped springs (no overshoot: type and the logo never bounce).
function spring(t: number, k: number) {
  if (t <= 0) return 0;
  const w = Math.sqrt(k);
  return 1 - Math.exp(-w * t) * (1 + w * t);
}
const firm = (t: number) => spring(t, 110); // the letters rising, ~0.5s
const glide = (t: number) => spring(t, 48); // "hajj'z" sliding into the J, ~0.8s
const slow = (t: number) => spring(t, 34); // the word closing into the monogram, ~1s
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const clamp = (x: number) => Math.min(1, Math.max(0, x));

/*
 * Layout in font units, in a 2400×1300 box: the word at size 1, the monogram at 1.1 in the middle. The letters
 * rise from behind y = 945 (just under the j's tail) and vanish left of x = 265 (the first J's stem).
 */
const WORD = { x: 110, y: 70, s: 1 };
const MONO = { x: 1200 - (497 * 1.1) / 2, y: 650 - (1011 * 1.1) / 2, s: 1.1 };
const LINE = 945;
const STEM = 265;
const DROP = 1150;
const TRAIN = 2700; // further than the z needs (1916), so it is gone while still moving fast

const [dotD, bodyD] = letters[lastJ].d.split(/(?=M)/);
/** The strip that slides into the J: h a j, the last j's dot, ' z, each with its place in the rising order. */
const strip = [
  { d: letters[0].d, rise: 1 },
  { d: letters[1].d, rise: 2 },
  { d: letters[2].d, rise: 3 },
  { d: dotD, rise: lastJ + 1 },
  { d: letters[4].d, rise: 5 },
  { d: letters[5].d, rise: 6 },
];

/**
 * The last j's body and the second J as polygons of the same number of points, with the same winding, paired
 * so each j point meets its nearest J point. Sampled from the real outlines, so the morph needs the DOM.
 */
function morphPoints(n = 360) {
  const sample = (d: string) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttribute("d", d);
    svg.appendChild(el);
    svg.style.position = "absolute";
    document.body.appendChild(svg);
    const length = el.getTotalLength();
    const pts = Array.from({ length: n }, (_, i) => {
      const p = el.getPointAtLength((i / n) * length);
      return [p.x, p.y];
    });
    svg.remove();
    return pts;
  };
  const area = (pts: number[][]) => pts.reduce((a, p, i) => a + p[0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * p[1], 0);
  const centre = (pts: number[][]) => pts.reduce((c, p) => [c[0] + p[0] / n, c[1] + p[1] / n], [0, 0]);
  const from = sample(bodyD);
  let to = sample(J2);
  if (Math.sign(area(from)) !== Math.sign(area(to))) to.reverse();
  const [fx, fy] = centre(from);
  const [tx, ty] = centre(to);
  let best = 0;
  let bestError = Infinity;
  for (let k = 0; k < n; k++) {
    let error = 0;
    for (let i = 0; i < n; i += 4) {
      const b = to[(i + k) % n];
      error += (from[i][0] - fx + tx - b[0]) ** 2 + (from[i][1] - fy + ty - b[1]) ** 2;
    }
    if (error < bestError) [bestError, best] = [error, k];
  }
  to = to.map((_, i) => to[(i + best) % n]);
  return { from, to };
}

const colour = (p: number) => `rgb(${CREAM.map((c, i) => Math.round(lerp(c, GOLD[i], p))).join(",")})`;

/** Entry screen: "Jhajj'z" turns into the JJ monogram, which flies to the header logo as the ink lifts. */
export function Splash() {
  const screen = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const group = useRef<SVGGElement>(null);
  const mark = useRef<SVGGElement>(null);
  const j1 = useRef<SVGPathElement>(null);
  const j = useRef<SVGPathElement>(null);
  const pieces = useRef<(SVGPathElement | null)[]>([]);
  const lineClip = useRef<SVGRectElement>(null);
  const stripClip = useRef<SVGRectElement>(null);
  const sheen = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    // Hidden, not unmounted: it is never shown again on this visit (no-splash hides it on later loads).
    const done = () => {
      html.classList.remove("splash");
      if (screen.current) screen.current.hidden = true;
    };
    if (!html.classList.contains("splash") || !screen.current) return done();
    // The script has started, so the CSS fallback (a fade at 3.4s for a script that never runs) stands down.
    // Its clock says how long the screen has been up; the opening starts at most 0.15s into its own time.
    const fallback = screen.current
      .getAnimations()
      .find((a) => a instanceof CSSAnimation && a.animationName === "splash-fallback");
    const shown = typeof fallback?.currentTime === "number" ? fallback.currentTime : 0;
    screen.current.style.animation = "none";

    const { from, to } = morphPoints();
    const start = performance.now() - Math.min(shown, 150);
    let frame = 0;
    let leaving = false;
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad, { once: true });

    const draw = (t: number) => {
      const up = (i: number) => DROP * (1 - firm(t - RISE - 0.055 * i));
      const pm = slow(t - FOLD);
      const s = lerp(WORD.s, MONO.s, pm);
      group.current?.setAttribute(
        "transform",
        `translate(${lerp(WORD.x, MONO.x, pm)} ${lerp(WORD.y, MONO.y, pm)}) scale(${s})`,
      );
      // Rising from behind the line; after that only the first J's stem hides the strip.
      lineClip.current?.setAttribute("height", String(t < FOLD ? 4000 + LINE : 12000));
      stripClip.current?.setAttribute("height", String(t < FOLD ? 4000 + LINE : 12000));
      j1.current?.setAttribute("transform", `translate(0 ${up(0)})`);
      const dx = -TRAIN * glide(t - FOLD);
      strip.forEach((piece, i) => pieces.current[i]?.setAttribute("transform", `translate(${dx} ${up(piece.rise)})`));

      // The last j: cream, turning gold as the strip sets off, then reshaped into the second J on the same
      // spring as the word, so it lands as the monogram settles.
      const el = j.current;
      if (el) {
        const gild = clamp((t - FOLD + 0.2) / 0.4);
        el.setAttribute("fill", gild < 1 ? colour(gild) : "url(#splash-sheen)");
        if (pm <= 0.001) {
          el.setAttribute("d", bodyD);
          el.setAttribute("transform", `translate(0 ${up(lastJ + 1)})`);
        } else if (pm >= 0.999) {
          el.setAttribute("d", J2);
          el.removeAttribute("transform");
        } else {
          const pts = from.map((a, i) => `${lerp(a[0], to[i][0], pm).toFixed(1)} ${lerp(a[1], to[i][1], pm).toFixed(1)}`);
          el.setAttribute("d", `M${pts.join("L")}Z`);
          el.removeAttribute("transform");
        }
      }

      // A soft band of light crosses the gold once, along the monogram's diagonal; otherwise it is off-shape.
      const p = clamp((t - SHEEN) / 0.6);
      const c = p > 0 && p < 1 ? lerp(-500, 1100, p) : -5000;
      sheen.current?.setAttribute("x1", String(c - 260));
      sheen.current?.setAttribute("y1", String(c - 520));
      sheen.current?.setAttribute("x2", String(c + 260));
      sheen.current?.setAttribute("y2", String(c + 520));
    };

    const exit = () => {
      leaving = true;
      const target = document.querySelector(".header-logo svg");
      const wrapper = box.current;
      const monogram = mark.current;
      if (!target || !wrapper || !monogram) return done();
      // The wrapper scales from its top-left corner; move it so the monogram lands exactly on the header logo.
      const w = wrapper.getBoundingClientRect();
      const from = monogram.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const s = to.height / from.height;
      const dx = to.left - (w.left + s * (from.left - w.left));
      const dy = to.top - (w.top + s * (from.top - w.top));
      const easing = "cubic-bezier(0.65, 0, 0.25, 1)";
      curtain.current?.animate([{ transform: "none" }, { transform: "translateY(-100%)" }], {
        duration: LEAVE,
        delay: 80,
        easing,
        fill: "forwards",
      });
      wrapper
        .animate([{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }], {
          duration: LEAVE,
          easing,
          fill: "forwards",
        })
        .finished.then(done, done);
    };

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      draw(Math.min(t, FLY));
      if (!leaving && t >= FLY && (loaded || t >= LATEST)) exit();
      if (!leaving) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // Rendered at the opening's first frame (every letter below its line), so nothing shows before the script runs.
  return (
    <div ref={screen} aria-hidden="true" className="splash-screen fixed inset-0 z-[100] grid place-items-center">
      <div ref={curtain} className="absolute inset-0 bg-ink" />
      <div ref={box} className="relative w-[min(90vw,560px)] origin-top-left">
        <svg viewBox="0 0 2400 1300" className="block h-auto w-full overflow-visible">
          <defs>
            <clipPath id="splash-line" clipPathUnits="userSpaceOnUse">
              <rect ref={lineClip} x="-4000" y="-4000" width="12000" height={4000 + LINE} />
            </clipPath>
            <clipPath id="splash-strip" clipPathUnits="userSpaceOnUse">
              <rect ref={stripClip} x={STEM} y="-4000" width="12000" height={4000 + LINE} />
            </clipPath>
            <linearGradient ref={sheen} id="splash-sheen" gradientUnits="userSpaceOnUse" x1="-5260" y1="-5520" x2="-4740" y2="-4480">
              <stop offset="0" stopColor="#C5A47E" />
              <stop offset="0.5" stopColor="#EBD9B9" />
              <stop offset="1" stopColor="#C5A47E" />
            </linearGradient>
          </defs>
          <g ref={group} transform={`translate(${WORD.x} ${WORD.y})`}>
            <g clipPath="url(#splash-strip)" className="fill-cream">
              {strip.map((piece, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    pieces.current[i] = el;
                  }}
                  d={piece.d}
                  transform={`translate(0 ${DROP})`}
                />
              ))}
            </g>
            {/* The clips sit on groups: a clip on a moved element would move with it. */}
            <g ref={mark} clipPath="url(#splash-line)">
              <path ref={j1} d={J1} fill="url(#splash-sheen)" transform={`translate(0 ${DROP})`} />
              <path ref={j} d={bodyD} fill="rgb(244,242,238)" transform={`translate(0 ${DROP})`} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
