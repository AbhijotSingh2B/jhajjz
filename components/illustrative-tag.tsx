/**
 * Small corner note on CarWale/CarDekho stand-in photos (`placeholder` / `imagePlaceholder` in lib/site.ts), so
 * nobody takes them for the client's own car. Goes away with the placeholders before launch.
 * Place it inside the photo frame (which must be `relative`), outside the multiply wrapper so it isn't blended.
 */
export function IllustrativeTag() {
  return (
    <span className="pointer-events-none absolute right-2.5 bottom-2 text-[13px] leading-none text-muted/60">
      For illustrative purposes only
    </span>
  );
}
