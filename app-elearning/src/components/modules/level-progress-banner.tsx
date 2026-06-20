"use client";

import { useProgressStore } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import type { LevelId } from "@/lib/i18n";

export function LevelProgressBannerClient({
  levelId,
  totalModules,
}: {
  levelId: LevelId;
  totalModules: number;
}) {
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);
  const { completed, percentage } = getLevelProgress(levelId);

  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tu progreso en este nivel</span>
        <span className="font-medium">{completed} / {totalModules} módulos</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">{percentage}% completado</p>
    </div>
  );
}
