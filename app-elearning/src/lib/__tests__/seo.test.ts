import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildPageMetadata,
  buildRootMetadata,
  DEFAULT_TITLE,
  normalizePath,
  OG_IMAGE,
  PATHS,
  SITE_DESCRIPTION,
  SITE_URL,
  socialTitle,
} from "../seo";
import {
  DYNAMIC_SITEMAP_PATTERNS,
  getSitemapPaths,
  getSitemapUrls,
  NOINDEX_PATTERNS,
  STATIC_SITEMAP_PATHS,
} from "../sitemap-entries";
import { getAllLabs, getAllModules, getAllResourcePages } from "../content";
import { getAllInteractivePractices } from "../interactive-practices";
import { getAllPractices } from "../practices";
import { getAllProfessionalRoutes } from "../professional-routes";

describe("normalizePath", () => {
  it.each([
    ["/", "/"],
    ["", "/"],
    ["labs", "/labs"],
    ["/labs/", "/labs"],
    ["/labs//lab-02", "/labs/lab-02"],
    ["/labs/lab-02.html", "/labs/lab-02"],
    ["/index.html", "/"],
    ["/rutas?x=1#a", "/rutas"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePath(input)).toBe(expected);
  });
});

describe("absoluteUrl", () => {
  it("no añade barra final a la raíz ni a las rutas", () => {
    expect(absoluteUrl("/")).toBe(SITE_URL);
    expect(absoluteUrl("/labs/")).toBe(`${SITE_URL}/labs`);
    expect(absoluteUrl("/sitemap.xml")).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("socialTitle", () => {
  it("aplica la misma plantilla que <title> y usa el título por defecto en la home", () => {
    expect(socialTitle("Laboratorios")).toBe("Laboratorios | PlanEstudio");
    expect(socialTitle()).toBe(DEFAULT_TITLE);
  });
});

describe("buildPageMetadata", () => {
  it("emite título, descripción, canonical, og y twitter propios con la imagen compartida", () => {
    const meta = buildPageMetadata({ title: "Laboratorios", description: "Labs prácticos.", path: "/labs/" });
    expect(meta.title).toBe("Laboratorios");
    expect(meta.description).toBe("Labs prácticos.");
    expect(meta.alternates).toEqual({ canonical: "/labs" });
    expect(meta.openGraph).toMatchObject({
      title: "Laboratorios | PlanEstudio",
      description: "Labs prácticos.",
      url: "/labs",
      siteName: "PlanEstudio",
      locale: "es_ES",
      type: "website",
      images: [OG_IMAGE],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Laboratorios | PlanEstudio",
      description: "Labs prácticos.",
      images: [OG_IMAGE],
    });
    expect(meta.robots).toBeUndefined();
  });

  it("en la home usa el título por defecto como absoluto", () => {
    const meta = buildPageMetadata({ path: "/" });
    expect(meta.title).toEqual({ absolute: DEFAULT_TITLE });
    expect(meta.description).toBe(SITE_DESCRIPTION);
    expect(meta.alternates).toEqual({ canonical: "/" });
    expect(meta.openGraph).toMatchObject({ title: DEFAULT_TITLE, url: "/" });
  });

  it("recurre a la descripción del sitio si la de la página está vacía", () => {
    expect(buildPageMetadata({ title: "X", description: "   ", path: "/x" }).description).toBe(SITE_DESCRIPTION);
  });

  it("marca noindex cuando se pide", () => {
    expect(buildPageMetadata({ title: "X", path: "/x", noIndex: true }).robots).toEqual({ index: false, follow: true });
  });
});

describe("buildRootMetadata", () => {
  it("fija metadataBase y la plantilla, sin canonical ni og:url heredables", () => {
    const meta = buildRootMetadata();
    expect(meta.metadataBase?.toString()).toBe(`${SITE_URL}/`);
    expect(meta.title).toEqual({ default: DEFAULT_TITLE, template: "%s | PlanEstudio" });
    expect(meta.alternates).toBeUndefined();
    expect(meta.openGraph).not.toHaveProperty("url");
    expect(meta.openGraph).toMatchObject({ images: [OG_IMAGE] });
    expect(meta.twitter).toMatchObject({ images: [OG_IMAGE] });
  });
});

describe("sitemap", () => {
  const paths = getSitemapPaths();

  it("incluye cada página generada desde las fuentes de contenido", () => {
    const expected = [
      ...getAllModules().map((m) => PATHS.module(m.levelId, m.slug)),
      ...getAllLabs().map((l) => PATHS.lab(l.slug)),
      ...getAllResourcePages().map((r) => PATHS.resource(r.slug)),
      ...getAllProfessionalRoutes().map((r) => PATHS.route(r.slug)),
      ...getAllPractices().map((p) => PATHS.professionalPractice(p.slug)),
      ...getAllInteractivePractices().map((p) => PATHS.interactivePractice(p.slug)),
      ...STATIC_SITEMAP_PATHS,
    ];
    for (const p of expected) expect(paths).toContain(p);
  });

  it("no tiene duplicados ni páginas noindex, y las URLs son absolutas y limpias", () => {
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.some((p) => p.startsWith("/certificado") || p.startsWith("/rpa-sandbox"))).toBe(false);
    for (const url of getSitemapUrls()) {
      expect(url.startsWith(SITE_URL)).toBe(true);
      expect(url).not.toMatch(/\.html$|\/$/);
      expect(url).toMatch(/^https:\/\/[a-z0-9./-]+$/);
    }
  });

  it("cubre todas las páginas de src/app: o están en el sitemap o son noindex", () => {
    const appDir = path.resolve(__dirname, "../../app");
    const found: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name === "page.tsx") {
          const rel = path.relative(appDir, path.dirname(full)).split(path.sep).filter(Boolean);
          found.push(`/${rel.join("/")}`);
        }
      }
    };
    walk(appDir);
    const known = new Set<string>([...STATIC_SITEMAP_PATHS, ...DYNAMIC_SITEMAP_PATTERNS, ...NOINDEX_PATTERNS]);
    const missing = found.filter((route) => !known.has(route));
    expect(missing).toEqual([]);
  });
});
