"use client";

import { useProgressStore, calculateOverallProgress } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import { UI } from "@/lib/i18n";

export function OverallProgressBannerClient() {
  const completedModules = useProgressStore((s) => s.completedModules);
  const { completed, total, percentage } = calculateOverallProgress(completedModules);

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{UI.progress.overall}</span>
        <span className="text-muted-foreground">
          {completed} {UI.progress.completedModules} / {total} {UI.progress.totalModules}
        </span>
      </div>
      <Progress
        value={percentage}
        className="h-2"
        aria-label={`${percentage}% del plan completado`}
      />
      <p className="text-xs text-muted-foreground">{percentage}% completado</p>
    </div>
  );
}
