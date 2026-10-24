import { cn } from "@/lib/utils";

/**
 * Small corner note on CarWale/CarDekho stand-in photos (`placeholder` / `imagePlaceholder` in lib/site.ts), so
 * nobody takes them for the client's own car. Goes away with the placeholders before launch.
 * Place it inside the photo frame (which must be `relative`), outside the multiply wrapper so it isn't blended.
 * `tone="dark"` on ink (the 3D S-Class box on the home page, which isn't the client's car either).
 */
export function IllustrativeTag({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-2.5 bottom-2 text-[13px] leading-none",
        // Full `muted` (5:1 on sand and stone) and cream/70 (8.9:1 on ink): fainter failed 4.5:1 at this size.
        tone === "dark" ? "text-cream/70" : "text-muted",
      )}
    >
      For illustrative purposes only
    </span>
  );
}
