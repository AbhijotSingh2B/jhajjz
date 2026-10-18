"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/logo";

/** Set on the first entry of a visit (this tab), so reloads and later pages go straight to the site. */
export const splashKey = "jhajjz-intro";

/**
 * Runs in <head> before the first paint: decides whether the entry screen plays, so a reload never flashes
 * it. Only on the home page: a visitor arriving on a car or contact page (e.g. from Google) goes straight to
 * it. Reduced motion skips it (nothing to watch, only a wait).
 */
export const splashScript = `try{var d=document.documentElement;if(location.pathname!=="/"||sessionStorage.getItem("${splashKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("no-splash");else{d.classList.add("splash");sessionStorage.setItem("${splashKey}","1")}}catch(e){}`;

/**
 * Times are on the animation's own clock (from when the screen first paints), not from the tap: on a real
 * connection the page can arrive a second or more after the tap, and counting from the tap cut the opening
 * short (Nirmal, on his phone). The opening ends at 2.1s; the monogram then holds so it is seen, and the
 * screen leaves once the page has loaded too, by 3.4s at the latest (the CSS fallback's time), then 0.6s out.
 */
const earliest = 2700;
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
    // The fallback fade starts with the opening, so its currentTime is the opening's clock.
    const clock = screen.current
      ?.getAnimations()
      .find((a) => a instanceof CSSAnimation && a.animationName === "splash-fallback");
    const now = () => (typeof clock?.currentTime === "number" ? clock.currentTime : latest);
    const schedule = () => {
      clearTimeout(timer);
      const at = Math.min(Math.max(now(), earliest), latest);
      timer = window.setTimeout(exit, at - now());
    };
    if (now() > latest + leave) done();
    else if (document.readyState === "complete") schedule();
    else {
      window.addEventListener("load", schedule, { once: true });
      // Never past 3.4s, loaded or not.
      timer = window.setTimeout(exit, latest - now());
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
