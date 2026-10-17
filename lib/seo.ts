import type { Metadata } from "next";
import { absoluteUrl, siteName } from "@/lib/site";

const alt = "Jhajj'z: luxury car and coach rental since 1998. Chandigarh, serving pan-India";

/**
 * The link-preview banner in public/og, drawn by scripts/make-previews.mjs (`npm run previews`): 1200x630 first
 * (Facebook, WhatsApp, LinkedIn, X use it), then a 1080x1080 square for apps that prefer one (Instagram).
 * Every page uses it for now; a page can pass its own `images` later for a custom banner.
 */
const previewImages = [
  { url: absoluteUrl("/og/jhajjz.jpg"), width: 1200, height: 630, alt, type: "image/jpeg" },
  { url: absoluteUrl("/og/jhajjz-square.jpg"), width: 1080, height: 1080, alt, type: "image/jpeg" },
];

// A page's own `openGraph` replaces the layout's entirely (no deep merge), so every page spreads these in
// to keep the share image, site name and locale on WhatsApp / Facebook / LinkedIn previews.
export const openGraphBase = {
  siteName,
  type: "website",
  locale: "en_IN",
  images: previewImages,
} satisfies Metadata["openGraph"];
