import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Relative URLs resolve against the manifest location, so they work both at the
// site root (Vercel) and under the /PlanEstudio basePath (GitHub Pages mirror).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PlanEstudio — Power Platform & Dynamics 365",
    short_name: "PlanEstudio",
    description: "Plan de estudio de Power Platform y Dynamics 365, instalable y con lectura sin conexión.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0078D4",
    lang: "es",
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
