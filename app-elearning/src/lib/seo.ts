import type { Metadata } from "next";

// ─── Constantes del sitio ─────────────────────────────────────────────────────

// Producción oficial (Vercel, con `cleanUrls`: sin `.html` ni barra final).
export const SITE_URL = "https://planestudio.vercel.app";
export const SITE_NAME = "PlanEstudio";
export const SITE_LOCALE = "es_ES";
export const DEFAULT_TITLE = "Power Platform & D365 — Plan de Estudio";
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;
export const SITE_DESCRIPTION =
  "Plan de aprendizaje progresivo: de cero a base laboral guiada en Power Platform y Dynamics 365 Customer Engagement.";

// Imagen de vista previa: la genera app/og.png/route.tsx y se exporta como /og.png.
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "PlanEstudio — Power Platform y Dynamics 365, aprendiendo haciendo",
};

// ─── Rutas ────────────────────────────────────────────────────────────────────

/**
 * Normaliza una ruta interna al formato público con `cleanUrls`:
 * empieza por "/", sin barra final (salvo la raíz), sin `.html`, sin query ni hash
 * y sin barras duplicadas.
 */
export function normalizePath(pathname: string): string {
  let p = pathname.trim().split(/[?#]/)[0] ?? "";
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = `/${p}`;
  p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

/** URL absoluta de producción para una ruta interna. La raíz no lleva barra final. */
export function absoluteUrl(pathname: string): string {
  const p = normalizePath(pathname);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

// ─── Metadatos ────────────────────────────────────────────────────────────────

/** Título que verán las redes sociales: el mismo que `<title>` (aplica la plantilla del layout). */
export function socialTitle(title?: string): string {
  return title ? TITLE_TEMPLATE.replace("%s", title) : DEFAULT_TITLE;
}

export interface PageMetadataInput {
  /** Título de la página sin el sufijo del sitio; se omite en la home. */
  title?: string;
  description?: string;
  /** Ruta pública de la página, p. ej. "/labs/lab-02-solicitudes". */
  path: string;
  /** Excluye la página de los buscadores (páginas personales o de sandbox). */
  noIndex?: boolean;
}

/**
 * Metadatos completos de una página. En Next, `openGraph`, `twitter` y `alternates` de una
 * página reemplazan enteros a los del layout (no se fusionan), así que se rellenan aquí
 * completos, con la imagen compartida.
 */
export function buildPageMetadata({ title, description, path, noIndex }: PageMetadataInput): Metadata {
  const canonical = normalizePath(path);
  const fullTitle = socialTitle(title);
  const desc = description?.trim() || SITE_DESCRIPTION;

  return {
    // En la home el título es el `default` del layout: se fija como absoluto para no aplicar la plantilla.
    title: title ?? { absolute: DEFAULT_TITLE },
    description: desc,
    alternates: { canonical },
    openGraph: { ...sharedOpenGraph(fullTitle, desc), url: canonical },
    twitter: sharedTwitter(fullTitle, desc),
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * Metadatos por defecto del layout raíz. No llevan `canonical` ni `og:url` porque se heredan
 * en páginas que no definan los suyos (p. ej. la 404), y apuntarían a otra URL.
 */
export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: DEFAULT_TITLE, template: TITLE_TEMPLATE },
    description: SITE_DESCRIPTION,
    keywords: ["Power Platform", "Dynamics 365", "PL-900", "PL-400", "arquitectura", "consultor funcional", "e-learning"],
    openGraph: sharedOpenGraph(DEFAULT_TITLE, SITE_DESCRIPTION),
    twitter: sharedTwitter(DEFAULT_TITLE, SITE_DESCRIPTION),
  };
}

function sharedOpenGraph(title: string, description: string) {
  return {
    type: "website" as const,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title,
    description,
    images: [OG_IMAGE],
  };
}

function sharedTwitter(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [OG_IMAGE],
  };
}

// ─── Rutas públicas (una sola fuente para canonical y sitemap) ───────────────

export const PATHS = {
  level: (levelId: string) => `/nivel/${levelId}`,
  module: (levelId: string, slug: string) => `/nivel/${levelId}/modulo/${slug}`,
  lab: (slug: string) => `/labs/${slug}`,
  resource: (slug: string) => `/recursos/${slug}`,
  route: (slug: string) => `/rutas/${slug}`,
  professionalPractice: (slug: string) => `/experiencia-practica/${slug}`,
  interactivePractice: (slug: string) => `/practica/${slug}`,
  certificate: (levelId: string) => `/certificado/${levelId}`,
} as const;
