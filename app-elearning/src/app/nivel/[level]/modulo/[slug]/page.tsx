import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllLevels, getModuleBySlug } from "@/lib/content";
import { getQuestionsForModule, getCaseDiagnosisForModule } from "@/lib/questions-parser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModuleCompletionClient } from "@/components/modules/module-completion-client";
import { QuizPanel } from "@/components/quiz/quiz-panel";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import { UI, type LevelId } from "@/lib/i18n";
import { FOUNDATION_ACTIVITIES } from "@/lib/guided-journey";

interface PageProps {
  params: Promise<{ level: string; slug: string }>;
}

export async function generateStaticParams() {
  const levels = getAllLevels();
  return levels.flatMap((level) =>
    level.modules.map((mod) => ({
      level: level.id,
      slug: mod.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { level, slug } = await params;
  const mod = getModuleBySlug(level as LevelId, slug);
  if (!mod) return {};
  return {
    title: mod.title,
    description: `Módulo ${mod.moduleId} — ${mod.levelId}`,
  };
}

const LEVEL_BADGE: Record<LevelId, "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "d365" | "rpa"> = {
  basico: "basico", intermedio: "intermedio", avanzado: "avanzado", arquitecto: "arquitecto", ia: "ia", d365: "d365", rpa: "rpa",
};

export default async function ModulePage({ params }: PageProps) {
  const { level, slug } = await params;
  const levelId = level as LevelId;
  const mod = getModuleBySlug(levelId, slug);
  if (!mod) notFound();

  const levelData = getAllLevels().find((l) => l.id === levelId);
  const modules = levelData?.modules ?? [];
  const currentIdx = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIdx > 0 ? modules[currentIdx - 1] : null;
  const nextModule = currentIdx < modules.length - 1 ? modules[currentIdx + 1] : null;

  const questions = getQuestionsForModule(mod.moduleId);
  const caseQuestions = getCaseDiagnosisForModule(mod.moduleId);
  const foundationActivity = FOUNDATION_ACTIVITIES.find((activity) => activity.moduleId === mod.moduleId);
  const recommendedLab = foundationActivity
    ? FOUNDATION_ACTIVITIES.find((activity) => activity.type === "lab" && activity.step === foundationActivity.step + 1)
    : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back link */}
      <Button asChild variant="ghost" size="sm" className="px-0 -ml-1 text-muted-foreground hover:text-foreground">
        <Link href={`/nivel/${levelId}`}>
          <ArrowLeft className="h-4 w-4 mr-1" aria-hidden />
          {UI.module.backToLevel}
        </Link>
      </Button>

      {/* ── Module header card ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-5 shadow-fluent-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            {/* Breadcrumb chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={LEVEL_BADGE[levelId]}>{UI.levels.badge[levelId]}</Badge>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Módulo {mod.moduleId}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden />
                {UI.module.estimatedTime(mod.estimatedMinutes)}
              </span>
              {questions.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" aria-hidden />
                  {questions.length} preguntas
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {mod.title}
            </h1>
          </div>
          <div className="shrink-0">
            <ModuleCompletionClient moduleId={mod.id} />
          </div>
        </div>
      </div>

      {/* ── Markdown content ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-8 md:px-8 shadow-fluent-1">
        <MarkdownRenderer content={mod.rawContent} />
      </div>

      {/* ── Diagnóstico de caso aplicado (piloto) ───────────────────────────── */}
      {caseQuestions.length > 0 && (
        <section aria-labelledby="case-diagnosis-heading" className="rounded-xl border border-border bg-card px-6 py-6 shadow-fluent-1">
          <h2 id="case-diagnosis-heading" className="text-lg font-semibold mb-1 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0078D4]" aria-hidden />
            Diagnóstico de caso aplicado
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Preguntas de decisión basadas en el &ldquo;Caso Real de Negocio&rdquo; de este módulo. No afectan tu puntaje de quiz ni del simulador.
          </p>
          <QuizPanel questions={caseQuestions} moduleId={`caso-${mod.moduleId}`} saveScore={false} />
        </section>
      )}

      {/* ── Quiz panel ───────────────────────────────────────────────────── */}
      {recommendedLab && (
        <section aria-labelledby="recommended-lab-heading" className="rounded-xl border border-[#107C10]/25 bg-card px-6 py-5 shadow-fluent-1">
          <h2 id="recommended-lab-heading" className="text-lg font-semibold text-foreground">
            Practica recomendada
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Despues de este modulo, realiza &ldquo;{recommendedLab.title}&rdquo; para convertir la teoria en evidencia.
            Requisitos: {recommendedLab.prerequisites.join(", ")}. Tiempo estimado: {recommendedLab.minutes} min.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Si no tienes tenant, usa esta variante: {recommendedLab.tenantAlternative}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 border-[#107C10]/30 text-[#107C10] hover:bg-[#EFF8EE]">
            <Link href={recommendedLab.href}>
              Realizar practica recomendada
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </section>
      )}

      {questions.length > 0 && (
        <section aria-labelledby="quiz-heading" className="rounded-xl border border-border bg-card px-6 py-6 shadow-fluent-1">
          <h2 id="quiz-heading" className="text-lg font-semibold mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0078D4]" aria-hidden />
            {UI.quiz.title}
          </h2>
          <QuizPanel questions={questions} moduleId={mod.moduleId} />
        </section>
      )}

      {/* ── Prev / Next navigation ───────────────────────────────────────── */}
      <Separator />
      <nav
        className="flex justify-between gap-4 pb-6"
        aria-label="Navegación entre módulos"
      >
        {prevModule ? (
          <Button asChild variant="outline" size="sm" className="gap-1 max-w-[48%]">
            <Link href={`/nivel/${levelId}/modulo/${prevModule.slug}`}>
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate hidden sm:inline">{UI.module.previous}</span>
              <span className="sm:hidden truncate">Anterior</span>
            </Link>
          </Button>
        ) : <div />}

        {nextModule ? (
          <Button asChild variant="outline" size="sm"
            className="gap-1 max-w-[48%] ml-auto text-[#0078D4] dark:text-[#4DB8FF] border-[#0078D4]/30 hover:bg-[#EFF6FC] dark:hover:bg-[rgba(0,120,212,0.12)]">
            <Link href={`/nivel/${levelId}/modulo/${nextModule.slug}`}>
              <span className="truncate hidden sm:inline">{UI.module.next}</span>
              <span className="sm:hidden truncate">Siguiente</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </Button>
        ) : <div />}
      </nav>
    </div>
  );
}
