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
  // The old Wix site's URLs (from jhajjz.in/sitemap.xml, Oct 2026), sent permanently to their new pages so search
  // rankings and old links carry over. /fleet and /privacy-policy keep the same path. Anchors point at home sections
  // and fleet cards (ids in app/page.tsx and lib/site.ts `fleet`).
  async redirects() {
    return [
      { source: "/about-4", destination: "/#about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/vip-delegations", destination: "/#services", permanent: true },
      { source: "/wedding-cars", destination: "/#weddings", permanent: true },
      { source: "/luxury-cars", destination: "/fleet#luxury-cars", permanent: true },
      { source: "/suv", destination: "/fleet#suvs", permanent: true },
      { source: "/luxury-coach", destination: "/fleet#luxury-coaches", permanent: true },
      { source: "/copy-of-luxury-coach", destination: "/fleet#luxury-coaches", permanent: true }, // the "Mini Coach" page
      { source: "/search", destination: "/fleet", permanent: true },
      { source: "/items/:slug", destination: "/", permanent: true }, // unused Wix template pages ("I am a title 01")
    ];
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
