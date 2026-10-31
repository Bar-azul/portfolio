import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/** Every page in both languages, with each page's other-language version linked. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projects.map((p) => `/projects/${p.slug}`)];
  const now = new Date();
  return paths.flatMap((path) =>
    (["en", "he"] as const).map((l) => ({
      url: SITE_URL + localePath(l, path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: { en: SITE_URL + localePath("en", path), he: SITE_URL + localePath("he", path) },
      },
    })),
  );
}
