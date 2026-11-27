"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, FlaskConical, Swords, Trophy } from "lucide-react";
import { useProgressStore } from "@/lib/progress";
import { useInteractivePracticeProgressStore } from "@/lib/interactive-practice-progress";
import { formatXp, isPracticeEarned, isQuizEarned, XP_RULES } from "@/lib/xp";
import type { LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Camino del inicio (F1 de "El camino jugable", 2026-11-27): sustituye a la lista "Tu recorrido".
// Cada nivel de certificación es un "mundo": sus módulos en orden como nodos, los labs del nivel
// agrupados y un trofeo al final. Los nodos posteriores al actual se ven atenuados, pero se pueden
// abrir igual: el gating sigue siendo el de cada página (aviso de prerrequisitos), no el camino.

export interface PathModuleNode {
  key: string;
  moduleId: number;
  title: string;
  href: string;
  minutes: number;
  practiceIds: string[];
}

export interface PathLabNode {
  slug: string;
  displayId: string;
  title: string;
  href: string;
  duration: number;
}

export interface PathWorld {
  levelId: LevelId;
  step: number;
  title: string;
  description: string;
  certification: string;
  modules: PathModuleNode[];
  labs: PathLabNode[];
  /** "Jefe" del mundo (F5): el reto sin pasos del proyecto integrador del nivel, y después el simulador. */
  boss?: PathBoss;
}

export interface PathBoss {
  /** Id de progreso del paso del reto (`completedSteps`), p. ej. "basico-8#reto". */
  stepProgressId: string;
  moduleTitle: string;
  href: string;
}

const WORLD_COLOR: Partial<Record<LevelId, { text: string; ring: string; soft: string }>> = {
  basico: { text: "text-[#107C10] dark:text-[#6CCB5F]", ring: "border-[#107C10] dark:border-[#6CCB5F]", soft: "bg-[#107C10]/10" },
  intermedio: { text: "text-[#0078D4] dark:text-[#4DB8FF]", ring: "border-[#0078D4] dark:border-[#4DB8FF]", soft: "bg-[#0078D4]/10" },
  avanzado: { text: "text-orange-600 dark:text-orange-400", ring: "border-orange-500", soft: "bg-orange-500/10" },
  arquitecto: { text: "text-[#D13438] dark:text-[#F08A9C]", ring: "border-[#D13438] dark:border-[#F08A9C]", soft: "bg-[#D13438]/10" },
};

export function LearningPathMap({ worlds }: { worlds: PathWorld[] }) {
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const quizScores = useProgressStore((s) => s.quizScores);
  const completedSteps = useProgressStore((s) => s.completedSteps);
  const records = useInteractivePracticeProgressStore((s) => s.records);
  const [chosen, setChosen] = useState<LevelId | null>(null);

  const done = new Set(completedModules);
  // Sin elección del alumno, se abre el primer mundo con módulos pendientes.
  const defaultWorld = worlds.find((world) => world.modules.some((mod) => !done.has(mod.key))) ?? worlds[worlds.length - 1];
  const world = worlds.find((w) => w.levelId === chosen) ?? defaultWorld;
  if (!world) return null;

  const color = WORLD_COLOR[world.levelId] ?? WORLD_COLOR.intermedio!;
  const currentIndex = world.modules.findIndex((mod) => !done.has(mod.key));
  const modulesDone = world.modules.filter((mod) => done.has(mod.key)).length;
  const labsDone = world.labs.filter((lab) => completedLabs.includes(lab.slug)).length;
  const bossDone = world.boss ? (completedSteps ?? []).includes(world.boss.stepProgressId) : false;
  const worldComplete = modulesDone === world.modules.length && labsDone === world.labs.length && (!world.boss || bossDone);

  return (
    <section aria-labelledby="journey-heading" className="space-y-4" data-testid="learning-path">
      <div>
        <h2 id="journey-heading" className="text-lg font-semibold text-foreground">Tu recorrido</h2>
        <p className="text-sm text-muted-foreground">
          Cuatro mundos en orden; cada uno prepara una certificación. La XP se gana con evidencia: prácticas, quizzes y labs.
        </p>
      </div>

      <div role="tablist" aria-label="Mundos del recorrido" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {worlds.map((w) => {
          const wDone = w.modules.filter((mod) => done.has(mod.key)).length;
          const selected = w.levelId === world.levelId;
          return (
            <button
              key={w.levelId}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setChosen(w.levelId)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left transition-colors",
                selected ? "border-[#0078D4] bg-[#0078D4]/5 dark:border-[#4DB8FF]" : "border-border bg-card hover:border-[#0078D4]/40",
              )}
            >
              <span className="block text-xs text-muted-foreground">Mundo {w.step}</span>
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-foreground">{w.title.replace(/^Nivel \d+\s*[—-]\s*/, "")}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{wDone}/{w.modules.length}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" aria-label={world.title} className="rounded-xl border border-border bg-card p-4 md:p-5">
        <div className={cn("mb-4 flex items-center gap-3 rounded-lg px-3 py-2.5", color.soft)}>
          <span className={cn("w-8 text-center text-2xl font-bold tabular-nums", color.text)}>{world.step}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{world.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {world.certification} · {world.modules.length} módulos · {world.labs.length} labs
            </p>
          </div>
          <Link href={`/nivel/${world.levelId}`} className="ml-auto shrink-0 text-xs font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
            Ver nivel
          </Link>
        </div>

        <ol className="relative space-y-2 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-0.5 before:bg-border">
          {world.modules.map((mod, index) => {
            const isDone = done.has(mod.key);
            const isNow = index === currentIndex;
            const isAhead = currentIndex >= 0 && index > currentIndex && !isDone;
            const possible = XP_RULES.quiz + mod.practiceIds.length * XP_RULES.practice;
            const earned =
              (isQuizEarned(quizScores[String(mod.moduleId)]) ? XP_RULES.quiz : 0) +
              mod.practiceIds.filter((id) => isPracticeEarned(records[id])).length * XP_RULES.practice;
            return (
              <li key={mod.key} className="relative">
                <Link
                  href={mod.href}
                  aria-current={isNow ? "step" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg py-1.5 pr-2 transition-colors hover:bg-muted/60",
                    isAhead && "opacity-60 hover:opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-card text-sm font-semibold tabular-nums",
                      isDone && "border-[#107C10] bg-[#107C10] text-white",
                      isNow && "border-[#0078D4] bg-[#0078D4] text-white ring-4 ring-[#0078D4]/15",
                      !isDone && !isNow && "border-border text-muted-foreground",
                    )}
                  >
                    {isDone ? <Check className="h-4 w-4" aria-label="Completado" /> : mod.moduleId}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">M{mod.moduleId} · </span>{mod.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {mod.minutes} min · {mod.practiceIds.length} prácticas · quiz
                    </span>
                  </span>
                  {isNow ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#0078D4] px-2.5 py-1 text-xs font-semibold text-white">
                      {modulesDone === 0 && index === 0 ? "Empezar" : "Continuar"}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                  ) : null}
                  <span
                    className="w-20 shrink-0 text-right text-xs font-semibold tabular-nums text-amber-700 dark:text-amber-400"
                    title="XP ganada / XP posible en este módulo"
                  >
                    {earned > 0 ? `${formatXp(earned)}/${formatXp(possible)}` : formatXp(possible)} XP
                  </span>
                </Link>
              </li>
            );
          })}

          {world.labs.length > 0 && (
            <li className="relative">
              <details className="group rounded-lg py-1.5 pr-2">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg hover:bg-muted/60">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-card text-orange-600 dark:text-orange-400">
                    <FlaskConical className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">Misiones en tu ambiente · {labsDone}/{world.labs.length} labs</span>
                    <span className="block text-xs text-muted-foreground">Lo que demuestra que sabes hacerlo en un tenant real</span>
                  </span>
                  <span className="w-20 shrink-0 text-right text-xs font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                    hasta {formatXp(XP_RULES.labVerified)} XP c/u
                  </span>
                </summary>
                <ul className="ml-[52px] mt-2 space-y-1 border-l border-border pl-3">
                  {world.labs.map((lab) => {
                    const labDone = completedLabs.includes(lab.slug);
                    return (
                      <li key={lab.slug}>
                        <Link href={lab.href} className="flex items-center gap-2 rounded px-1 py-1 text-sm hover:bg-muted/60">
                          {labDone ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#107C10]" aria-label="Completado" />
                          ) : (
                            <span className="h-3.5 w-3.5 shrink-0 rounded-sm border border-border" aria-hidden />
                          )}
                          <span className="min-w-0 flex-1 truncate">
                            <span className="text-muted-foreground">{lab.displayId} · </span>{lab.title}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">{lab.duration} min</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          )}

          {world.boss && (
            <li className="relative" data-testid="world-boss">
              <Link href={world.boss.href} className="flex items-center gap-3 rounded-lg py-1.5 pr-2 hover:bg-muted/60">
                <span
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                    bossDone ? "border-[#5C2D91] bg-[#5C2D91] text-white" : "border-[#5C2D91]/60 bg-card text-[#5C2D91] dark:text-[#B4A0FF]",
                  )}
                >
                  {bossDone ? <Check className="h-4 w-4" aria-label="Superado" /> : <Swords className="h-4 w-4" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    {bossDone ? `Jefe del Mundo ${world.step} superado` : `Jefe del Mundo ${world.step}: el reto sin pasos`}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {world.boss.moduleTitle} · el mismo proyecto en otro negocio, sin instrucciones
                  </span>
                </span>
              </Link>
            </li>
          )}

          <li className="relative">
            <Link href="/simulador" className="flex items-center gap-3 rounded-lg py-1.5 pr-2 hover:bg-muted/60">
              <span
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                  worldComplete ? "border-amber-500 bg-amber-500 text-white" : "border-amber-500/60 bg-card text-amber-600 dark:text-amber-400",
                )}
              >
                <Trophy className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">
                  {worldComplete ? `Trofeo del Mundo ${world.step} conseguido` : `Trofeo del Mundo ${world.step}`}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {worldComplete
                    ? "Mide tu preparación para la certificación en el simulador"
                    : "Completa los módulos, los labs y el jefe del mundo; luego, el simulador"}
                </span>
              </span>
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
