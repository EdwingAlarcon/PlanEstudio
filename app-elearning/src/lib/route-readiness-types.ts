export interface RouteReadinessTargets {
  /** ids en formato "basico-1" (LevelId-moduleId), para consultar el store de progreso existente. */
  moduleIds: string[];
  labSlugs: string[];
  totalModules: number;
  totalLabs: number;
  capstoneModuleKey: string | null;
  capstoneLabSlug: string | null;
}

export interface RouteReadinessResult {
  completedModules: number;
  totalModules: number;
  completedLabs: number;
  totalLabs: number;
  capstoneDone: boolean;
  hasCapstone: boolean;
}

/**
 * Pura, sin ninguna dependencia de `content.ts` (que usa `fs`) — segura para Client Components.
 * Evaluación por ruta, no por calificación global — ver principio 7 de la reorganización.
 */
export function computeRouteReadiness(
  targets: RouteReadinessTargets,
  isModuleComplete: (moduleId: string) => boolean,
  isLabComplete: (slug: string) => boolean
): RouteReadinessResult {
  const completedModules = targets.moduleIds.filter((id) => isModuleComplete(id)).length;
  const completedLabs = targets.labSlugs.filter((slug) => isLabComplete(slug)).length;
  const hasCapstone = Boolean(targets.capstoneModuleKey || targets.capstoneLabSlug);
  const capstoneDone = targets.capstoneModuleKey
    ? isModuleComplete(targets.capstoneModuleKey)
    : targets.capstoneLabSlug
      ? isLabComplete(targets.capstoneLabSlug)
      : false;

  return {
    completedModules,
    totalModules: targets.totalModules,
    completedLabs,
    totalLabs: targets.totalLabs,
    capstoneDone,
    hasCapstone,
  };
}
