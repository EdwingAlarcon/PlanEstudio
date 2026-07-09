import type { Metadata } from "next";
import { getAllLabs, getAllModules } from "@/lib/content";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";
import { PortfolioClient, type PortfolioRouteData } from "./portfolio-client";

export const metadata: Metadata = {
  title: "Portafolio profesional",
  description: "Qué reunir de cada ruta para convertir tus capstones en portafolio.",
};

export default function PortfolioPage() {
  const labsBySlug = new Map(getAllLabs().map((lab) => [lab.slug, lab]));
  const modulesById = new Map(getAllModules().map((module) => [module.moduleId, module]));

  const routes: PortfolioRouteData[] = getAllProfessionalRoutes().map((route) => {
    const capstoneLab = route.capstoneLabSlug ? labsBySlug.get(route.capstoneLabSlug) : undefined;
    const capstoneModule = route.capstoneModuleId ? modulesById.get(route.capstoneModuleId) : undefined;

    return {
      slug: route.slug,
      title: route.title,
      accent: route.accent,
      capstoneTitle: capstoneLab?.title ?? capstoneModule?.title ?? "Capstone pendiente",
      capstoneDisplayId: capstoneLab?.displayId,
      capstoneHref: capstoneLab
        ? `/labs/${capstoneLab.slug}`
        : capstoneModule
        ? `/nivel/${capstoneModule.levelId}/modulo/${capstoneModule.slug}`
        : `/rutas/${route.slug}`,
      capstoneLabSlug: route.capstoneLabSlug,
      capstoneModuleFullId: capstoneModule ? `${capstoneModule.levelId}-${capstoneModule.moduleId}` : undefined,
      portfolioEvidence: route.portfolioEvidence,
    };
  });

  return <PortfolioClient routes={routes} />;
}
