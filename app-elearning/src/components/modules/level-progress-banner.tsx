"use client";

import Link from "next/link";
import { useProgressStore } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy } from "lucide-react";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEVEL_COLORS: Record<LevelId, string> = {
  basico:     "from-green-50  to-emerald-50  border-green-200  dark:from-green-950  dark:to-emerald-950  dark:border-green-800",
  intermedio: "from-blue-50   to-sky-50      border-blue-200   dark:from-blue-950   dark:to-sky-950      dark:border-blue-800",
  avanzado:   "from-orange-50 to-amber-50    border-orange-200 dark:from-orange-950 dark:to-amber-950    dark:border-orange-800",
  arquitecto: "from-red-50    to-rose-50     border-red-200    dark:from-red-950    dark:to-rose-950     dark:border-red-800",
};

const TROPHY_COLORS: Record<LevelId, string> = {
  basico:     "text-emerald-600 dark:text-emerald-400",
  intermedio: "text-blue-600   dark:text-blue-400",
  avanzado:   "text-orange-600 dark:text-orange-400",
  arquitecto: "text-red-600    dark:text-red-400",
};

export function LevelProgressBannerClient({ levelId }: { levelId: LevelId }) {
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);
  const { completed, total, percentage } = getLevelProgress(levelId);

  if (percentage === 100) {
    return <LevelCompleteBanner levelId={levelId} total={total} />;
  }

  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tu progreso en este nivel</span>
        <span className="font-medium">{completed} / {total} módulos</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">{percentage}% completado</p>
    </div>
  );
}

// ─── Completion banner ────────────────────────────────────────────────────────

function LevelCompleteBanner({ levelId, total }: { levelId: LevelId; total: number }) {
  const currentIdx = LEVEL_ORDER.indexOf(levelId);
  const nextLevelId = currentIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIdx + 1] : null;
  const isFinal = nextLevelId === null;

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-5 space-y-4",
        LEVEL_COLORS[levelId]
      )}
      role="status"
      aria-live="polite"
    >
      {/* Trophy + title */}
      <div className="flex items-center gap-3">
        <div className={cn("shrink-0", TROPHY_COLORS[levelId])}>
          <Trophy className="h-8 w-8" aria-hidden />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">
            {isFinal ? "¡Plan de Estudio Completado!" : `¡${UI.levels.badge[levelId]} Completado!`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {total} módulos · Certificación objetivo:{" "}
            <span className="font-medium text-foreground">{UI.levels.cert[levelId]}</span>
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed">
        {isFinal
          ? "Has completado los cuatro niveles del plan. Estás preparado para rendir el examen PL-600 y ejercer como Power Platform Solution Architect."
          : `Has dominado los contenidos de este nivel. El siguiente paso es el ${UI.levels.badge[nextLevelId!]}, donde profundizarás hacia la certificación ${UI.levels.cert[nextLevelId!]}: ${UI.levels.description[nextLevelId!]}.`
        }
      </p>

      {/* Action */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={levelId} className="text-xs">
          {UI.levels.cert[levelId]} — Listo para el examen
        </Badge>

        {nextLevelId && (
          <Button asChild size="sm">
            <Link href={`/nivel/${nextLevelId}`}>
              Comenzar {UI.levels.badge[nextLevelId]}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" aria-hidden />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
