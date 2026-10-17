"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/logo";

/** Set on the first entry of a visit (this tab), so reloads and later pages go straight to the site. */
export const splashKey = "jhajjz-intro";

/**
 * Runs in <head> before the first paint: decides whether the entry screen plays, so a reload never flashes
 * it. Reduced motion skips it (nothing to watch, only a wait).
 */
export const splashScript = `try{var d=document.documentElement;if(sessionStorage.getItem("${splashKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("no-splash");else{d.classList.add("splash");sessionStorage.setItem("${splashKey}","1")}}catch(e){}`;

/** On screen for 3–4s: it leaves once the page has loaded, but not before 2.4s or after 3.4s, then 0.6s out. */
const earliest = 2400;
const latest = 3400;
const leave = 600;

/**
 * Entry screen: "Jhajj'z" on ink turns into the JJ monogram (the header's opening, larger), then the
 * monogram flies to the header logo while the screen fades.
 */
export function Splash() {
  const screen = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    // Hidden, not unmounted: it is never shown again on this visit (no-splash hides it on later loads).
    const done = () => {
      html.classList.remove("splash");
      if (screen.current) screen.current.hidden = true;
    };
    if (!html.classList.contains("splash")) return done();

    let timer = 0;
    let leaving = false;
    const exit = () => {
      if (leaving) return;
      leaving = true;
      const el = screen.current;
      const box = mark.current;
      const target = document.querySelector(".header-logo svg");
      if (!el || !box || !target) return done();
      // The monogram is units 481–978 of the entry screen's 1460-wide svg, and sits at the left of the header's.
      const from = box.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const scale = to.height / from.height;
      const markLeft = from.left + (from.width * 481) / 1460;
      const dx = to.left - from.left - scale * (markLeft - from.left);
      const dy = to.top - from.top;
      el.style.animation = "none";
      el.animate([{ backgroundColor: "#151514" }, { backgroundColor: "rgb(21 21 20 / 0)" }], {
        duration: leave,
        easing: "ease",
        fill: "forwards",
      });
      box
        .animate([{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }], {
          duration: leave,
          easing: "cubic-bezier(0.65, 0, 0.25, 1)",
          fill: "forwards",
        })
        .finished.then(done, done);
    };
    const schedule = () => {
      clearTimeout(timer);
      const at = Math.min(Math.max(performance.now(), earliest), latest);
      timer = window.setTimeout(exit, at - performance.now());
    };
    if (performance.now() > latest + leave) done();
    else if (document.readyState === "complete") schedule();
    else {
      window.addEventListener("load", schedule, { once: true });
      // Never past 3.4s, loaded or not.
      timer = window.setTimeout(exit, latest - performance.now());
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return (
    <div ref={screen} aria-hidden="true" className="splash-screen fixed inset-0 z-[100] grid place-items-center bg-ink">
      <div ref={mark} className="origin-top-left">
        <LogoMark intro centred clipId="splash-tuck" className="block h-[88px] md:h-[120px]" />
      </div>
    </div>
  );
}
