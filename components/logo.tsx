import { cn } from "@/lib/utils";

/**
 * The Jhajj'z monogram: two Js from Libre Caslon Display (the heading font, SIL OFL) side by side,
 * joined by one top bar. Outlines exported with fontTools; same drawing as app/icon.svg.
 */
const J1 =
  "M117 849Q83 849 83 814L84 785Q84 764 73 752Q62 740 42 740Q23 740 11.5 752Q0 764 0 784Q0 817 31 839Q62 861 109 861Q146 861 179 844.5Q212 828 232 799Q250 773 257.5 735.5Q265 698 265 633V16L347 8V0H106V8L188 16V710Q188 773 168.5 811Q149 849 117 849Z";
const J2 =
  "M317 849Q283 849 283 814L284 785Q284 764 273 752Q262 740 242 740Q223 740 211.5 752Q200 764 200 784Q200 817 231 839Q262 861 309 861Q346 861 379 844.5Q412 828 432 799Q450 773 457.5 735.5Q465 698 465 633V16L547 8V0H306V8L388 16V710Q388 773 368.5 811Q349 849 317 849Z";

/**
 * `animated`: the opening in the header. The top bar draws left to right, the two Js run down from it one
 * after the other, then the name fades in (keyframes in globals.css, off for reduced motion). Plain CSS so
 * it starts with the first paint, before the page's JavaScript loads.
 */
export function Logo({
  animated = false,
  className,
  markClassName = "h-10",
}: {
  animated?: boolean;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", animated && "logo-intro", className)}>
      <svg viewBox="0 0 547 861" aria-hidden="true" className={cn("w-auto shrink-0 fill-gold", markClassName)}>
        {animated && (
          // Only the header animates, so these ids appear once per page.
          <defs>
            <clipPath id="logo-j1">
              <rect className="logo-wipe" width="347" height="861" />
            </clipPath>
            <clipPath id="logo-j2">
              <rect className="logo-wipe logo-wipe-2" x="200" width="347" height="861" />
            </clipPath>
          </defs>
        )}
        <rect className="logo-bar" x="106" width="441" height="8" />
        <path clipPath={animated ? "url(#logo-j1)" : undefined} d={J1} />
        <path clipPath={animated ? "url(#logo-j2)" : undefined} d={J2} />
      </svg>
      <span className="logo-name">Jhajj&apos;z</span>
    </span>
  );
}
