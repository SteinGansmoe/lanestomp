import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://lanestomp.com",
      lastModified: new Date(),
    },
  ];
}