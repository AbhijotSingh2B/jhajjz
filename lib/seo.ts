import type { Metadata } from "next";
import { absoluteUrl, heroImage, siteName } from "@/lib/site";

// A page's own `openGraph` replaces the layout's entirely (no deep merge), so every page spreads these in
// to keep the share image, site name and locale on WhatsApp / Facebook / LinkedIn previews.
export const openGraphBase = {
  siteName,
  type: "website",
  locale: "en_IN",
  images: [{ url: absoluteUrl(heroImage), width: 2400, height: 1600, alt: "A chauffeur-driven car from the Jhajj'z fleet" }],
} satisfies Metadata["openGraph"];
