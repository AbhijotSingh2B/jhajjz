import type { Metadata } from "next";
import { absoluteUrl, siteName } from "@/lib/site";

/**
 * A page's link-preview card in public/og (1200x630 JPEG: its photo, the JJ monogram and its name), drawn by
 * scripts/make-previews.mjs. Run `npm run previews` after adding a car or changing a photo.
 */
export function previewImage(name: string, alt: string) {
  return { url: absoluteUrl(`/og/${name}.jpg`), width: 1200, height: 630, alt, type: "image/jpeg" };
}

// A page's own `openGraph` replaces the layout's entirely (no deep merge), so every page spreads these in
// to keep the share image, site name and locale on WhatsApp / Facebook / LinkedIn previews.
export const openGraphBase = {
  siteName,
  type: "website",
  locale: "en_IN",
  images: [previewImage("home", "Jhajj'z: luxury car and coach rental since 1998")],
} satisfies Metadata["openGraph"];
