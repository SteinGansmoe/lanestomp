import { MetadataRoute } from "next";
import { getMatchupsForSitemap } from "@/src/data/sitemap-matchups";

const baseUrl = "https://lanestomp.com";

// Generate the release artifact at build time. Dependency errors must prevent
// deployment rather than producing a cached, incomplete sitemap.
export const dynamic = "force-static";
// Recheck database dependencies on every release build, even when the build
// cache is restored from a previous successful release.
export const fetchCache = "force-no-store";

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
  ];

  return [...staticRoutes, ...matchupRoutes];
}
