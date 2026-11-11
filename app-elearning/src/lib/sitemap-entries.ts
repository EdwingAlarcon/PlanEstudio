import { getAllLabs, getAllLevels, getAllResourcePages } from "./content";
import { getAllInteractivePractices } from "./interactive-practices";
import { getAllPractices } from "./practices";
import { getAllProfessionalRoutes } from "./professional-routes";
import { absoluteUrl, PATHS } from "./seo";

// Páginas estáticas (sin parámetros) que se publican en el sitemap.
// Las rutas dinámicas salen de las mismas funciones que usan sus `generateStaticParams`.
export const STATIC_SITEMAP_PATHS = [
  "/",
  "/como-usar",
  "/power-platform",
  "/dynamics-365",
  "/integracion",
  "/empleabilidad",
  "/rutas",
  "/mapa",
  "/mi-ruta",
  "/labs",
  "/simulador",
  "/practica",
  "/experiencia-practica",
  "/repaso",
  "/progreso",
  "/portafolio",
  "/preparar-entorno",
  "/recursos",
] as const;

// Patrones de rutas dinámicas incluidas en el sitemap (forma de carpeta de `src/app`).
export const DYNAMIC_SITEMAP_PATTERNS = [
  "/nivel/[level]",
  "/nivel/[level]/modulo/[slug]",
  "/labs/[slug]",
  "/recursos/[slug]",
  "/rutas/[slug]",
  "/experiencia-practica/[slug]",
  "/practica/[slug]",
] as const;

// Páginas que existen pero se excluyen del sitemap y llevan `noindex`:
// el certificado depende del progreso local del alumno y el sandbox RPA es un banco de pruebas para PAD.
export const NOINDEX_PATTERNS = [
  "/certificado/[nivel]",
  "/rpa-sandbox/legacy-app",
  "/rpa-sandbox/portal",
] as const;

/** Rutas internas publicadas en el sitemap, sin duplicados y en orden estable. */
export function getSitemapPaths(): string[] {
  const levels = getAllLevels();
  const paths: string[] = [
    ...STATIC_SITEMAP_PATHS,
    ...levels.map((level) => PATHS.level(level.id)),
    ...levels.flatMap((level) => level.modules.map((mod) => PATHS.module(level.id, mod.slug))),
    ...getAllLabs().map((lab) => PATHS.lab(lab.slug)),
    ...getAllResourcePages().map((page) => PATHS.resource(page.slug)),
    ...getAllProfessionalRoutes().map((route) => PATHS.route(route.slug)),
    ...getAllPractices().map((practice) => PATHS.professionalPractice(practice.slug)),
    ...getAllInteractivePractices().map((practice) => PATHS.interactivePractice(practice.slug)),
  ];
  return [...new Set(paths)];
}

/** URLs absolutas de producción para `app/sitemap.ts`. */
export function getSitemapUrls(): string[] {
  return getSitemapPaths().map(absoluteUrl);
}
