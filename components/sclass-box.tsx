"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { IllustrativeTag } from "@/components/illustrative-tag";
import { Button } from "@/components/ui/button";
import {
  FRAME_COUNT,
  type FrameSet,
  boxInset,
  frameIndex,
  frameSet,
  frameUrl,
  nearestLoaded,
  shouldLoadSequence,
} from "@/lib/scroll-motion";

const frameSize: Record<FrameSet, [number, number]> = { wide: [1920, 1080], tall: [960, 720] };

// When the border goes and comes back. lg (pinned, 0 = top enters, 0.435 = top reaches the screen top and sticks,
// 1 = it scrolls away): opens once the top is 40% down the screen, open until the car has nearly turned. Below lg
// (0 = top enters, 1 = bottom leaves, 0.5 = centred): opens around the middle of the screen, closes as it leaves.
const pinnedStops = [0.26, 0.435, 0.85, 1] as const;
const passingStops = [0.3, 0.45, 0.6, 0.75] as const;

/** Fully open: between the end of opening and the start of closing. */
const isOpen = (p: number, stops: readonly number[]) => p >= stops[1] && p <= stops[2];

/**
 * Home page, above the fleet: a black box with a paper border round it that opens to full width as it scrolls in,
 * stays while the black S-Class turns ~100° (one front three-quarter to the other, never the back; frames rendered by
 * video/tools/render-hero-turn.mjs), then closes back to a card and scrolls away (Nirmal approved it from stills,
 * 2026-10-24). lg and up: the section is 230svh with a sticky one-screen stage (`.sclass-box` in globals.css) when script
 * runs and motion is allowed. Below lg it isn't pinned (Nirmal: pinned with paper bands above and below looked odd on
 * phones): a 4:5 card that opens as it passes the middle of the screen and closes as it leaves, the car turning on the
 * way through. Without script or with reduced motion it is just the card with the first frame as a still.
 * The title and quote button blur-fade in once the box is fully open and out as it starts to close (Nirmal; he asked
 * for "Buy now", but Jhajj'z rents with a chauffeur, so it reads "Get a quote" like the rest of the site).
 * Frame 1 is a plain <picture> (two framings, which next/image can't art-direct) so it shows before JavaScript; the
 * canvas covers it once it has drawn. The other frames load after the page is idle, never under reduced motion or
 * Save-Data.
 */
export function SClassBox({ car }: { car: { slug: string; model: string; years?: string } }) {
  const section = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  // null until mounted: the CSS card clip below holds until then. Read through a ref in the scroll callbacks, which
  // motion may keep from an earlier render.
  const [lg, setLg] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const lgRef = useRef(false);
  // lg: from entering the screen until the end of the pinned stretch. Below lg: from entering to leaving the screen.
  const pinned = useScroll({ target: section, offset: ["start end", "end end"] }).scrollYProgress;
  const passing = useScroll({ target: section, offset: ["start end", "end start"] }).scrollYProgress;
  const clipPath = useTransform([pinned, passing] as MotionValue<number>[], ([a, b]: number[]) => {
    const inset = lgRef.current ? boxInset(a, 48, pinnedStops) : boxInset(b, 24, passingStops);
    return `inset(${inset.toFixed(1)}px round ${(inset / 3).toFixed(1)}px)`;
  });
  // The car turns from just before the box is fully open until just after it starts to close (lg: over ~1.4 screens).
  const turn = () => (lgRef.current ? (pinned.get() - 0.3) / 0.6 : (passing.get() - 0.1) / 0.8);

  useEffect(() => {
    const q = window.matchMedia("(width >= 64rem)");
    const update = () => {
      lgRef.current = q.matches;
      setLg(q.matches);
    };
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const check = () => setOpen(lgRef.current ? isOpen(pinned.get(), pinnedStops) : isOpen(passing.get(), passingStops));
    check();
    const offPinned = pinned.on("change", check);
    const offPassing = passing.on("change", check);
    return () => {
      offPinned();
      offPassing();
    };
  }, [lg, pinned, passing]);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
    if (!shouldLoadSequence({ reducedMotion: reduce, saveData })) return;
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    let set: FrameSet, images: HTMLImageElement[], loaded: boolean[], shown = -1;
    // Bumped on each (re)start, so frames still loading for a previous framing or after unmount are dropped.
    let gen = 0;

    const draw = (force = false) => {
      const i = nearestLoaded(loaded, frameIndex(turn()));
      if (i < 0 || (i === shown && !force)) return;
      const { clientWidth: w, clientHeight: h } = box.current!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      // Contain the frame in the box; the frame's own background is the box's ink, so the margins don't show.
      const [fw, fh] = frameSize[set];
      const s = Math.min(c.width / fw, c.height / fh);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(images[i], (c.width - fw * s) / 2, (c.height - fh * s) / 2, fw * s, fh * s);
      c.style.opacity = "1";
      shown = i;
    };

    const load = (i: number, g: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (g !== gen) return done();
          images[i] = img;
          loaded[i] = true;
          draw();
          done();
        };
        img.onerror = () => done();
        img.src = frameUrl(set, i);
      });

    const start = () => {
      const g = ++gen;
      set = frameSet(window.innerWidth);
      images = [];
      loaded = new Array(FRAME_COUNT).fill(false);
      shown = -1;
      c.style.opacity = "0";
      // Frame 1 (already in the <picture>) first, then the rest in order, four at a time, once the page is idle.
      load(0, g).then(() => {
        const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200));
        idle(() => {
          let next = 1;
          const chain = async (): Promise<void> => {
            while (g === gen && next < FRAME_COUNT) await load(next++, g);
          };
          for (let k = 0; k < 4; k++) chain();
        });
      });
    };

    start();
    const offPinned = pinned.on("change", () => draw());
    const offPassing = passing.on("change", () => draw());
    const onResize = () => {
      if (frameSet(window.innerWidth) !== set) start();
      else draw(true);
    };
    window.addEventListener("resize", onResize);
    return () => {
      gen++;
      offPinned();
      offPassing();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `turn` only reads the progress values and lgRef
  }, [reduce, pinned, passing]);

  return (
    <section ref={section} className="sclass-box relative">
      <div className="sclass-box-stage flex items-center lg:sticky lg:top-0">
        {/* Phones and tablets: a 4:5 card, 24px border like the page gutter (tall frames); lg and up: the whole screen,
            48px border (wide frames). */}
        <motion.div
          ref={box}
          style={reduce || lg === null ? undefined : { clipPath }}
          className="relative aspect-[4/5] max-h-[80svh] w-full bg-ink-deep [clip-path:inset(24px_round_8px)] lg:aspect-auto lg:h-svh lg:max-h-none lg:[clip-path:inset(48px_round_16px)]"
        >
          <picture>
            <source media="(max-width: 1023px)" srcSet={frameUrl("tall", 0)} />
            <img
              src={frameUrl("wide", 0)}
              alt="Black Mercedes-Benz S-Class"
              loading="lazy"
              className="absolute inset-0 size-full object-contain"
            />
          </picture>
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full opacity-0" />
          {/* A 3D model, not the client's own car. Top right, clear of the title; kept inside the card's clip. */}
          <div className="absolute inset-x-6 top-6 h-9 lg:inset-x-12 lg:top-12">
            <IllustrativeTag tone="dark" />
          </div>
          {/* Always shown under reduced motion (the card doesn't open) and without script (globals.css). Hidden, it is
              inert so the button can't be tabbed to while invisible. */}
          <motion.div
            className="sclass-box-title absolute bottom-6 left-6 text-cream lg:bottom-12 lg:left-12 lg:p-10"
            initial={false}
            animate={open || reduce ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(12px)", y: 12 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            inert={!(open || reduce)}
          >
            <h2 className="font-serif text-[clamp(32px,3.6vw,48px)] leading-[1.1] tracking-[-0.01em]">
              {car.model}
              <span className="ml-3 align-middle font-sans text-[15px] tracking-normal text-cream/60">{car.years}</span>
            </h2>
            <Button asChild className="mt-6">
              <Link href={`/contact?car=${car.slug}`}>Get a quote</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
