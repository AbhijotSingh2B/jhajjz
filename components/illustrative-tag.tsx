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
        tone === "dark" ? "text-cream/45" : "text-muted/60",
      )}
    >
      For illustrative purposes only
    </span>
  );
}
