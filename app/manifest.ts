import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jhajj'z | Luxury car & coach rental",
    short_name: "Jhajj'z",
    description: "Chauffeur-driven luxury cars, wedding cars and coaches since 1998.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2ee",
    theme_color: "#151514",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
