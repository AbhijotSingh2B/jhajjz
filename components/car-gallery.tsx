"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CarPhoto } from "@/lib/site";

/**
 * Swipeable photo carousel for a car page: native scroll-snap (so touch swiping and trackpads just work), with
 * previous/next buttons and a "2 / 5" counter underneath. One photo renders as a plain frame with no controls.
 */
export function CarGallery({
  photos,
  label,
  priority = false,
  sizes,
}: {
  photos: CarPhoto[];
  label: string;
  priority?: boolean;
  sizes: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const many = photos.length > 1;

  const go = (to: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(photos.length - 1, to));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div role={many ? "region" : undefined} aria-roledescription={many ? "carousel" : undefined} aria-label={many ? label : undefined}>
      <div
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            className="w-full shrink-0 snap-center"
            role={many ? "group" : undefined}
            aria-roledescription={many ? "slide" : undefined}
            aria-label={many ? `${i + 1} of ${photos.length}` : undefined}
          >
            <div className={cn("relative aspect-[3/2] overflow-hidden", photo.cutout ? "bg-sand" : "bg-stone")}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={priority && i === 0}
                sizes={sizes}
                className={cn(
                  photo.cutout ? "object-contain p-4 mix-blend-multiply md:p-8" : photo.portrait ? "object-contain" : "object-cover",
                )}
                style={{ objectPosition: photo.position }}
              />
            </div>
            {photo.credit && <figcaption className="mt-2 text-[13px] text-muted">Representative photo · {photo.credit}</figcaption>}
          </figure>
        ))}
      </div>

      {many && (
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-[15px] text-muted tabular-nums" aria-live="polite">
            {index + 1} / {photos.length}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous photo">
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => go(index + 1)}
              disabled={index === photos.length - 1}
              aria-label="Next photo"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
