"use client";

import { CarGallery } from "@/components/car-gallery";
import { useCarColour } from "@/components/car-colour";
import type { CarPhoto } from "@/lib/site";

/**
 * A car page's photos. When a colour is chosen (picker above the quote buttons, components/car-colour.tsx), only
 * that colour's photos show; photos without a colour show under every colour. "All" shows everything.
 */
export function CarPhotos({ photos, label, sizes }: { photos: CarPhoto[]; label: string; sizes: string }) {
  const colour = useCarColour();
  const shown = colour ? photos.filter((p) => !p.colour || p.colour === colour) : photos;
  return (
    // Keyed by colour so the carousel starts again at the first photo.
    <CarGallery
      key={colour}
      photos={shown}
      label={colour ? `${label}, ${colour.toLowerCase()}` : label}
      priority
      sizes={sizes}
    />
  );
}
