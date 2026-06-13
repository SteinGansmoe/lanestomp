import { MetadataRoute } from "next";
import { getMatchupsForSitemap } from "@/src/data/sitemap-matchups";

const baseUrl = "https://lanestomp.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matchupRoutes = await getMatchupsForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/league`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/league/matchups`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/league/counters`,
      lastModified: new Date(),
    },
  ];

  return [...staticRoutes, ...matchupRoutes];
}
