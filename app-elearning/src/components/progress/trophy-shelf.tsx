"use client";

import { Trophy } from "lucide-react";
import { useProgressStore } from "@/lib/progress";
import { CERTIFICATION_LEVEL_ORDER, UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Trofeo por mundo (F4): se gana con todos los módulos, todos los labs obligatorios del nivel y el jefe (F5): el reto
// de transferencia del último módulo, marcado en el modo por pasos (paso "reto").
interface TrophyLevel {
  levelId: LevelId;
  modules: { moduleId: number }[];
  labs: { slug: string }[];
}

const COLOR: Partial<Record<LevelId, string>> = {
  basico: "text-[#107C10] dark:text-[#6CCB5F]",
  intermedio: "text-[#0078D4] dark:text-[#4DB8FF]",
  avanzado: "text-orange-600 dark:text-orange-400",
  arquitecto: "text-[#D13438] dark:text-[#F08A9C]",
};

export function TrophyShelf({ levels }: { levels: TrophyLevel[] }) {
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const completedSteps = useProgressStore((s) => s.completedSteps);
  const worlds = CERTIFICATION_LEVEL_ORDER.map((id) => levels.find((l) => l.levelId === id)).filter((l): l is TrophyLevel => Boolean(l));

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Trofeos de los mundos</h3>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4" data-testid="trophy-shelf">
        {worlds.map((w, i) => {
          const modulesDone = w.modules.filter((m) => completedModules.includes(`${w.levelId}-${m.moduleId}`)).length;
          const labsDone = w.labs.filter((l) => completedLabs.includes(l.slug)).length;
          const last = w.modules.at(-1);
          const bossDone = last ? (completedSteps ?? []).includes(`${w.levelId}-${last.moduleId}#reto`) : false;
          const earned = modulesDone === w.modules.length && labsDone === w.labs.length && bossDone && w.modules.length > 0;
          return (
            <li key={w.levelId} className={cn("rounded-lg border border-border p-3 text-xs", !earned && "opacity-70")}>
              <Trophy className={cn("mb-1 h-5 w-5", earned ? "text-amber-500" : COLOR[w.levelId])} aria-hidden />
              <span className="block font-semibold text-foreground">Mundo {i + 1} · {UI.levels[w.levelId]}</span>
              <span className="block text-muted-foreground">
                {earned
                  ? "Conseguido"
                  : `${modulesDone}/${w.modules.length} módulos · ${labsDone}/${w.labs.length} labs · jefe ${bossDone ? "superado" : "pendiente"}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
