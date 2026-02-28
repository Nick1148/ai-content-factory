import { MetadataRoute } from "next";
import { getAllPaperIds } from "@/lib/data";

const BASE_URL = "https://논문읽어주는ai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paperIds = getAllPaperIds();

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
    ...paperPages,
  ];
}
