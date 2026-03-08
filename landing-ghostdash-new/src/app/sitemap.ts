import { siteUrl } from "@/lib/constants";
import { pagesConfig } from "@/config/pages";
import type { MetadataRoute } from "next";

export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let index = 1;
  const formattedPages = Object.keys(pagesConfig).map(
    (pathname) =>
      ({
        url: `${siteUrl}${pathname}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: index++,
      }) satisfies MetadataRoute.Sitemap[number],
  );

  return formattedPages;
}
