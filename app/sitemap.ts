import type { MetadataRoute } from "next";
import { cars, carsInClass, fleet, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/fleet", priority: 0.9, changeFrequency: "weekly" },
    ...fleet
      .filter((v) => carsInClass(v.slug).length > 0)
      .map((v) => ({ path: `/fleet/${v.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    ...cars.map((c) => ({ path: `/fleet/${c.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({
    url: `${siteUrl}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
