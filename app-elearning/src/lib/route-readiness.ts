import { getAllModules } from "./content";
import type { ProfessionalRoute } from "./professional-routes";
import type { RouteReadinessTargets } from "./route-readiness-types";

export type { RouteReadinessTargets, RouteReadinessResult } from "./route-readiness-types";
export { computeRouteReadiness } from "./route-readiness-types";

/**
 * Traduce los moduleId numéricos de una ruta a las claves "levelId-moduleId" que usa
 * el store de progreso existente (progress.ts), sin tocar ni migrar ese store.
 *
 * SOLO para uso en Server Components: importa `content.ts` (lee archivos con `fs`). El resultado
 * es plano/serializable y se pasa como prop a componentes cliente, que deben importar
 * `computeRouteReadiness` desde `./route-readiness-types` directamente (no desde este archivo) para
 * no arrastrar `content.ts` al bundle de cliente.
 */
export function getRouteReadinessTargets(route: ProfessionalRoute): RouteReadinessTargets {
  const allModules = getAllModules();
  const moduleIds = route.modules
    .map((moduleId) => allModules.find((m) => m.moduleId === moduleId)?.id)
    .filter((id): id is string => Boolean(id));

  const capstoneModuleKey = route.capstoneModuleId != null
    ? allModules.find((m) => m.moduleId === route.capstoneModuleId)?.id ?? null
    : null;

  return {
    moduleIds,
    labSlugs: route.labs,
    totalModules: route.modules.length,
    totalLabs: route.labs.length,
    capstoneModuleKey,
    capstoneLabSlug: route.capstoneLabSlug ?? null,
  };
}
