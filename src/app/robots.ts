import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/content-studio/api/"],
      },
    ],
    sitemap: "https://realang.store/sitemap.xml",
    host: "https://realang.store",
  };
}
