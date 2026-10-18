"use client";

import photoSizes from "./photo-sizes.json";

const sizes: Record<string, number[]> = photoSizes;

/**
 * next/image loader (next.config.ts). Nothing goes through Vercel's image optimization: for a saved photo it
 * picks the smallest saved copy at least as wide as the browser asks for (made by `npm run save-photos`), and
 * the full photo when none is wide enough. Anything else is served as-is.
 */
export default function photoLoader({ src, width }: { src: string; width: number }) {
  const w = sizes[src]?.find((x) => x >= width);
  return w ? src.replace(/(\.\w+)$/, `-${w}w$1`) : src;
}
