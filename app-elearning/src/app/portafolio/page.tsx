import type { Metadata } from "next";
import { getAllLabs, getAllModules } from "@/lib/content";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";
import { getLaborProfiles } from "@/lib/labor-profiles";
import { PortfolioClient, type PortfolioProfileData, type PortfolioRouteData } from "./portfolio-client";

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
      capstoneTitle: capstoneLab?.title ?? capstoneModule?.title ?? "Capstone no configurado",
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

  const profiles: PortfolioProfileData[] = getLaborProfiles().map((profile) => ({
    slug: profile.slug,
    title: profile.title,
    accent: profile.accent,
    summary: profile.summary,
    routeLinks: profile.routeSlugs
      .map((routeSlug) => getAllProfessionalRoutes().find((r) => r.slug === routeSlug))
      .filter((r): r is NonNullable<typeof r> => Boolean(r))
      .map((route) => ({ title: route.title, href: `/rutas/${route.slug}` })),
    jobReadyLabs: profile.jobReadyLabSlugs
      .map((slug) => labsBySlug.get(slug))
      .filter((lab): lab is NonNullable<typeof lab> => Boolean(lab))
      .map((lab) => ({ slug: lab.slug, displayId: lab.displayId, title: lab.title, href: `/labs/${lab.slug}` })),
    minimumEvidence: profile.minimumEvidence,
    jobReadyGuideHref: profile.jobReadyGuideHref,
    interviewHref: profile.interviewHref,
  }));

  return <PortfolioClient routes={routes} profiles={profiles} />;
}
