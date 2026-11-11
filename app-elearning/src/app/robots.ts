import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Con `output: "export"` se genera una vez en build y se exporta como `out/robots.txt`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Sin `disallow`: las páginas que no deben indexarse llevan `noindex` en su metadata,
    // y un rastreador solo puede leer esa etiqueta si se le permite entrar.
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
