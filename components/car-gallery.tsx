"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Photo, PortraitBackdrop } from "@/components/photo";
import { IllustrativeTag } from "@/components/illustrative-tag";
import { useEffect, useRef, useState } from "react";
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
  const thumbs = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const many = photos.length > 1;

  // Keep the current photo's thumbnail in view when the row is wider than the screen (phones). Scrolls only the row.
  useEffect(() => {
    const list = thumbs.current;
    const active = list?.children[index] as HTMLElement | undefined;
    if (!list || !active) return;
    const left = active.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft || left + active.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: left - 8, behavior: "smooth" });
    }
  }, [index]);

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
              {photo.portrait && <PortraitBackdrop src={photo.src} />}
              {/* The multiply sits on this wrapper: a scaled (zoomed) element is its own stacking context. */}
              <div
                className={cn("absolute inset-0", photo.cutout && "mix-blend-multiply")}
                style={{ transform: photo.zoom ? `scale(${photo.zoom})` : undefined }}
              >
                <Photo
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={priority && i === 0}
                  sizes={sizes}
                  className={cn(photo.cutout ? "object-contain p-4 md:p-8" : photo.portrait ? "object-contain" : "object-cover")}
                  style={{ objectPosition: photo.position }}
                />
              </div>
              {photo.placeholder && <IllustrativeTag />}
            </div>
            {photo.credit && <figcaption className="mt-2 text-[13px] text-muted">Representative photo · {photo.credit}</figcaption>}
          </figure>
        ))}
      </div>

      {many && (
        <div className="mt-3 flex items-start justify-between gap-4">
          <p className="sr-only" aria-live="polite">
            Photo {index + 1} of {photos.length}
          </p>
          {/* Thumbnails: a preview of every photo in the carousel; tap one to jump to it. */}
          <ul ref={thumbs} className="-m-1 flex min-w-0 gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((photo, i) => (
              <li key={photo.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show photo ${i + 1}: ${photo.alt}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative block h-11 w-16 overflow-hidden transition-[opacity,box-shadow] duration-200",
                    photo.cutout ? "bg-sand" : "bg-stone",
                    i === index ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-paper" : "opacity-60 hover:opacity-100",
                  )}
                >
                  <span className={cn("absolute inset-0", photo.cutout && "mix-blend-multiply")}>
                    <Photo
                      src={photo.src}
                      alt=""
                      fill
                      sizes="64px"
                      className={cn(photo.cutout ? "object-contain p-1" : "object-cover")}
                      style={{ objectPosition: photo.position }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 gap-2">
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
