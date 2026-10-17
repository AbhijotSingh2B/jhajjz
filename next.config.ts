import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Car photos are still hosted on the client's Wix site. Move them into
    // /public (or a CDN) once the client sends originals, then drop this.
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" },
      // PLACEHOLDER: CarWale/CarDekho stand-in car photos (lib/site.ts, `placeholder: true`). Remove before public launch.
      { protocol: "https", hostname: "imgd.aeplcdn.com", pathname: "/1280x720/n/cw/ec/**", search: "?isig=0&q=80" },
      { protocol: "https", hostname: "stimg.cardekho.com", pathname: "/images/carexteriorimages/930x620/**", search: "" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
