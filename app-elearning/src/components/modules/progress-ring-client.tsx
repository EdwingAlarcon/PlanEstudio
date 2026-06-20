"use client";

import { useProgressStore } from "@/lib/progress";
import { ProgressRing } from "./progress-ring";
import type { LevelId } from "@/lib/i18n";

export function ProgressRingClient({
  levelId,
  colorClass,
}: {
  levelId: LevelId;
  colorClass?: string;
}) {
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);
  const { percentage } = getLevelProgress(levelId);

  return <ProgressRing percentage={percentage} colorClass={colorClass} />;
}
