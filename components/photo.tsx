"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Marks each photo loaded the moment it arrives, before React has hydrated (in layout.tsx <head>). Load events don't
 * bubble, so it listens in the capture phase. Without it, a photo that loads before hydration would stay hidden
 * until React's onLoad runs, which on a slow phone holds back the hero.
 */
export const photoScript = `document.addEventListener("load",function(e){var t=e.target;if(t.tagName==="IMG"&&t.dataset.photo)t.dataset.photo="loaded"},true);document.addEventListener("error",function(e){var t=e.target;if(t.tagName==="IMG"&&t.dataset.photo)t.dataset.photo="loaded"},true);`;

/**
 * next/image (`fill`) with a loading skeleton and a blur fade-in. Until the photo has loaded (or failed), the frame
 * shows a slow pulse over its own background (bg-stone, bg-sand, bg-ink); the photo then fades in from blurred
 * (`img[data-photo]` in globals.css). The pulse darkens rather than lightens, so it still shows inside the
 * multiply-blend wrappers of studio shots. `dark` for photos on ink (hero, wedding band, menu); `skeletonClassName`
 * when the image sits on a negative z-index, so the skeleton stays behind the text with it.
 */
export function Photo({
  alt,
  dark,
  skeletonClassName,
  onLoad,
  onError,
  ...props
}: ImageProps & { dark?: boolean; skeletonClassName?: string }) {
  const [done, setDone] = useState(false);
  return (
    <>
      {!done && <span aria-hidden="true" className={cn("photo-skeleton absolute inset-0", dark && "photo-skeleton-dark", skeletonClassName)} />}
      <Image
        {...props}
        alt={alt}
        data-photo={done ? "loaded" : "loading"}
        onLoad={(e) => {
          setDone(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setDone(true);
          onError?.(e);
        }}
      />
    </>
  );
}

/**
 * Fills the side bars of a portrait photo shown whole in a landscape frame with a blurred, darkened copy of the same
 * photo, so a portrait slide fills the frame like the landscape ones around it instead of sitting between grey bars.
 * Put it first inside the frame (which clips it); it uses the smallest saved copy, as the blur hides the detail.
 */
export function PortraitBackdrop({ src }: { src: string }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 scale-125 blur-2xl brightness-90">
      <Image src={src} alt="" fill sizes="320px" className="object-cover" />
    </span>
  );
}
