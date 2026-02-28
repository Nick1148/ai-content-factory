import { MetadataRoute } from "next";
import { getAllTools, getAllPapers, getAllCategories } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-content-factory.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, papers] = await Promise.all([
    getAllTools(),
    getAllPapers(),
  ]);
  const categories = getAllCategories();

  const toolPages = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const paperPages = papers.map((paper) => ({
    url: `${BASE_URL}/papers/${paper.id}`,
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
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
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
