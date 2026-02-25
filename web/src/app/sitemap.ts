import { MetadataRoute } from "next";
import { getAllSlugs, getAllCategorySlugs, getAllPaperIds } from "@/lib/data";

const BASE_URL = "https://aitoolradar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolSlugs = getAllSlugs();
  const categorySlugs = getAllCategorySlugs();
  const paperIds = getAllPaperIds();

  const toolPages = toolSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const paperPages = paperIds.map((id) => ({
    url: `${BASE_URL}/papers/${id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/papers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...toolPages,
    ...categoryPages,
    ...paperPages,
  ];
}
