import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Car photos are still hosted on the client's Wix site. Move them into
    // /public (or a CDN) once the client sends originals, then drop this.
    remotePatterns: [{ protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" }],
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
