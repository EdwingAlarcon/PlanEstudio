"use client";

import { calculateLevelProgress, useProgressStore } from "@/lib/progress";
import type { LevelId } from "@/lib/i18n";

// Avance compacto de un nivel ("3/8") para la lista del recorrido en el inicio.
export function LevelStepProgress({ levelId }: { levelId: LevelId }) {
  const completedModules = useProgressStore((s) => s.completedModules);
  const { completed, total } = calculateLevelProgress(levelId, completedModules);
  const done = total > 0 && completed === total;
  return (
    <span className={done ? "shrink-0 text-xs font-medium text-[#107C10]" : "shrink-0 text-xs tabular-nums text-muted-foreground"}>
      {done ? "Completado" : `${completed}/${total}`}
    </span>
  );
}
