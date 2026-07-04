"use client";

import { useProgressStore, calculateLevelProgress } from "@/lib/progress";
import { ProgressRing } from "./progress-ring";
import type { LevelId } from "@/lib/i18n";

export function ProgressRingClient({
  levelId,
  colorClass,
}: {
  levelId: LevelId;
  colorClass?: string;
}) {
  const completedModules = useProgressStore((s) => s.completedModules);
  const { percentage } = calculateLevelProgress(levelId, completedModules);

  return <ProgressRing percentage={percentage} colorClass={colorClass} />;
}
