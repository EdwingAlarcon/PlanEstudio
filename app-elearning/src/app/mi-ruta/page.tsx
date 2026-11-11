import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";
import { getAllInteractivePractices } from "@/lib/interactive-practices";
import { MyRouteClient } from "./my-route-client";

export const metadata: Metadata = buildPageMetadata({
  title: "Mi ruta",
  description: "Ruta guiada, siguiente acción, diagnóstico ligero y selección posterior de rol.",
  path: "/mi-ruta",
});

export default function MyRoutePage() {
  const routes = getAllProfessionalRoutes().map((route) => ({
    slug: route.slug,
    title: route.title,
    role: route.role,
    summary: route.summary,
    accent: route.accent,
    competencies: route.competencies,
  }));

  return <MyRouteClient routes={routes} interactivePractices={getAllInteractivePractices().map(({ id }) => ({ id }))} />;
}
