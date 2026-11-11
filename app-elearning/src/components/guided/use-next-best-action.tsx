"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useProgressStore } from "@/lib/progress";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { getNextBestAction, type NextBestAction } from "@/lib/guided-journey";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";
import type { CurriculumModule } from "@/lib/learning-path";

// El layout calcula el índice del temario en el servidor y lo comparte una sola vez,
// para que la barra lateral y el inicio recomienden exactamente el mismo siguiente paso.
const CurriculumContext = createContext<CurriculumModule[]>([]);

export function CurriculumProvider({ curriculum, children }: { curriculum: CurriculumModule[]; children: ReactNode }) {
  return <CurriculumContext.Provider value={curriculum}>{children}</CurriculumContext.Provider>;
}

export function useCurriculum(): CurriculumModule[] {
  return useContext(CurriculumContext);
}

export function useNextBestAction(): NextBestAction {
  const curriculum = useCurriculum();
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const onboarding = useOnboardingStore();
  const route = onboarding.selectedRouteSlug && onboarding.selectedRouteSlug !== "foundations"
    ? getAllProfessionalRoutes().find((r) => r.slug === onboarding.selectedRouteSlug)
    : undefined;

  return getNextBestAction(completedModules, completedLabs, onboarding, {
    curriculum,
    routeModuleIds: route?.modules,
    routeTitle: route?.title,
  });
}
