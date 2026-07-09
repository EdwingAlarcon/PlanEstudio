"use client";

import Link from "next/link";
import { ArrowRight, Award, Briefcase, CheckCircle2, ClipboardList, FlaskConical } from "lucide-react";
import {
  useProgressStore,
  calculateLevelProgress,
  calculateLevelQuizReadiness,
} from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import { UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface LevelReadinessData {
  levelId: LevelId;
  modules: { moduleId: number; title: string }[];
  labs: { slug: string; title: string }[];
}

const LEVEL_ACCENT: Record<LevelId, string> = {
  basico: "#107C10",
  intermedio: "#0078D4",
  avanzado: "#EA580C",
  arquitecto: "#D13438",
  ia: "#9333EA",
  d365: "#0D9488",
};

type ReadinessStatus = "en-progreso" | "falta-evidencia" | "listo";

const STATUS_CONFIG: Record<ReadinessStatus, { label: string; className: string }> = {
  "en-progreso": {
    label: "En progreso",
    className: "bg-muted text-muted-foreground",
  },
  "falta-evidencia": {
    label: "Falta evidencia",
    className: "bg-[#FFFBE6] text-[#B37800] dark:bg-[rgba(255,185,0,0.12)] dark:text-[#FFB900]",
  },
  listo: {
    label: "Listo para certificado",
    className: "bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)] dark:text-[#2DB52D]",
  },
};

export function ProgressDashboardClient({ levels }: { levels: LevelReadinessData[] }) {
  const completedModules = useProgressStore((s) => s.completedModules);
  const quizScores = useProgressStore((s) => s.quizScores);
  const completedLabs = useProgressStore((s) => s.completedLabs);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="h-5 w-5 text-[#0078D4]" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mi progreso</h1>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Módulos, quizzes y laboratorios de cada nivel en un solo lugar, con el mismo criterio
          que exige el certificado: no basta con marcar módulos como leídos.
        </p>
      </div>

      <div className="space-y-4">
        {levels.map(({ levelId, labs }) => {
          const moduleProgress = calculateLevelProgress(levelId, completedModules);
          const quizReadiness = calculateLevelQuizReadiness(levelId, quizScores);
          const labsDone = labs.filter((lab) => completedLabs.includes(lab.slug)).length;
          const labsReady = labs.length === 0 || labsDone === labs.length;

          let status: ReadinessStatus = "en-progreso";
          if (moduleProgress.percentage === 100) {
            status = quizReadiness.ready && labsReady ? "listo" : "falta-evidencia";
          }
          const statusCfg = STATUS_CONFIG[status];
          const ctaHref = status === "en-progreso" ? `/nivel/${levelId}` : `/certificado/${levelId}`;
          const ctaLabel =
            status === "en-progreso"
              ? "Continuar nivel"
              : status === "falta-evidencia"
              ? "Ver qué falta"
              : "Generar certificado";

          return (
            <section
              key={levelId}
              className="rounded-xl border border-border bg-card p-5 shadow-fluent-1"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: LEVEL_ACCENT[levelId] }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-foreground">
                      {UI.levels.badge[levelId]} · {UI.levels.navCert[levelId]}
                    </h2>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusCfg.className)}>
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Módulos</span>
                        <span>{moduleProgress.completed}/{moduleProgress.total}</span>
                      </div>
                      <Progress value={moduleProgress.percentage} className="h-1.5" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Quiz aprobado (≥70%)</span>
                        <span>{quizReadiness.attempted}/{quizReadiness.total}</span>
                      </div>
                      <Progress
                        value={quizReadiness.total > 0 ? (quizReadiness.attempted / quizReadiness.total) * 100 : 0}
                        className="h-1.5"
                      />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Laboratorios</span>
                        <span>{labsDone}/{labs.length}</span>
                      </div>
                      <Progress value={labs.length > 0 ? (labsDone / labs.length) * 100 : 100} className="h-1.5" />
                    </div>
                  </div>

                  <Link
                    href={ctaHref}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
                  >
                    {status === "listo" ? (
                      <Award className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <FlaskConical className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Link
        href="/portafolio"
        className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-fluent-1 transition-all duration-150 hover:border-[#0078D4]/30 hover:shadow-fluent-2 dark:hover:border-[#4DB8FF]/30"
      >
        <Briefcase className="h-6 w-6 shrink-0 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Ver capstones y evidencia de portafolio</p>
          <p className="text-xs text-muted-foreground">Qué reunir de cada ruta profesional, más allá del progreso por nivel</p>
        </div>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </div>
  );
}
