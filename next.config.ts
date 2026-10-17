import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Nirmal: nothing goes through Vercel's image optimization or its cache. Every <Image> is served as-is from its
    // URL: car photos straight from the client's Wix site (sized and WebP'd by Wix's URL, see lib/site.ts) and the
    // PLACEHOLDER CarWale photos straight from CarWale.
    unoptimized: true,
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
