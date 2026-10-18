"use client";

import { useState } from "react";
import { CarGallery } from "@/components/car-gallery";
import { cn } from "@/lib/utils";
import type { CarPhoto } from "@/lib/site";

/**
 * A car page's photos. When the client has the car in more than one colour (`colour` on its photos), a colour
 * picker above the carousel switches between them; photos without a colour show under every colour.
 */
export function CarPhotos({ photos, label, sizes }: { photos: CarPhoto[]; label: string; sizes: string }) {
  // The colour with the most photos first (and selected): that's the one the client has most of.
  const tagged = photos.map((p) => p.colour).filter((c): c is string => !!c);
  const count = (c: string) => tagged.filter((t) => t === c).length;
  const colours = [...new Set(tagged)].sort((a, b) => count(b) - count(a));
  const [colour, setColour] = useState(colours[0]);
  if (colours.length < 2) return <CarGallery photos={photos} label={label} priority sizes={sizes} />;

  const shown = photos.filter((p) => !p.colour || p.colour === colour);
  return (
    <>
      <div role="radiogroup" aria-label="Colour" className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-[15px] text-muted">Colour</span>
        {colours.map((c) => {
          const active = c === colour;
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setColour(c)}
              className={cn(
                "h-11 border px-5 text-[15px] font-medium transition-colors duration-300",
                active ? "border-ink bg-ink text-cream" : "border-ink/25 text-ink hover:bg-ink/5",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>
      {/* Keyed by colour so the carousel starts again at the first photo. */}
      <CarGallery key={colour} photos={shown} label={`${label}, ${colour?.toLowerCase()}`} priority sizes={sizes} />
    </>
  );
}
