import type { MetadataRoute } from "next";
import { getSitemapUrls } from "@/lib/sitemap-entries";

// Con `output: "export"` se genera una vez en build y se exporta como `out/sitemap.xml`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapUrls().map((url) => ({ url }));
}
