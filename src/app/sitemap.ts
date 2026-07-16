import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleUrls = articles.map((article) => ({
    url: `https://blog.piccreativespace.id/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://blog.piccreativespace.id",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...articleUrls,
  ];
}
