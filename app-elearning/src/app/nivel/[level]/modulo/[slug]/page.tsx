import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata, PATHS } from "@/lib/seo";
import { getAllLevels, getLevelById, getModuleBySlug } from "@/lib/content";
import { getQuestionsForModule, getCaseDiagnosisForModule } from "@/lib/questions-parser";
import { getInteractivePracticesForModule, INTERACTIVE_TYPE_LABELS } from "@/lib/interactive-practices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModuleCompletionClient } from "@/components/modules/module-completion-client";
import { ModuleVisitTracker } from "@/components/modules/module-visit-tracker";
import { ModuleNotes } from "@/components/modules/module-notes";
import { ModulePrerequisiteGate } from "@/components/modules/module-prerequisite-gate";
import { QuizPanel } from "@/components/quiz/quiz-panel";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { ArrowLeft, ArrowRight, Clock, BookOpen, BrainCircuit } from "lucide-react";
import { UI, type LevelId } from "@/lib/i18n";
import { FOUNDATION_ACTIVITIES } from "@/lib/guided-journey";
import { getModuleOutline, splitModuleSections } from "@/lib/module-sections";

function ModuleStep({ n, href, title, detail }: { n: number; href: string; title: string; detail: string }) {
  return (
    <li>
      <a href={href} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0078D4] text-xs font-semibold text-white">{n}</span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          <span className="block text-xs text-muted-foreground">{detail}</span>
        </span>
      </a>
    </li>
  );
}

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
  const levelTitle = getLevelById(mod.levelId)?.title;
  return buildPageMetadata({
    title: mod.title,
    description: levelTitle
      ? `Módulo ${mod.moduleId} · ${levelTitle}: ${mod.title}.`
      : `Módulo ${mod.moduleId}: ${mod.title}.`,
    path: PATHS.module(mod.levelId, mod.slug),
  });
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
  const interactivePractices = getInteractivePracticesForModule(mod.moduleId).slice(0, 3);
  const foundationActivity = FOUNDATION_ACTIVITIES.find((activity) => activity.moduleId === mod.moduleId);
  const recommendedLab = foundationActivity
    ? FOUNDATION_ACTIVITIES.find((activity) => activity.type === "lab" && activity.step === foundationActivity.step + 1)
    : undefined;

  const segments = splitModuleSections(mod.rawContent);
  const outline = getModuleOutline(mod.rawContent);

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
                {UI.module.estimatedTime(mod.estimatedMinutes, mod.practiceMinutes)}
              </span>
              {mod.lastVerified && (
                <span className="text-xs text-muted-foreground" title="Última verificación del contenido contra Microsoft Learn">
                  Verificado {mod.lastVerified}
                </span>
              )}
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

      <ModuleVisitTracker moduleId={mod.id} />

      <ModulePrerequisiteGate
        moduleId={mod.moduleId}
        levelId={levelId}
        previousModuleHref={prevModule ? `/nivel/${levelId}/modulo/${prevModule.slug}` : undefined}
      />

      {/* ── Ruta del módulo: tres pasos y su índice ─────────────────────── */}
      <nav aria-label="Pasos del módulo" className="rounded-xl border border-border bg-card px-5 py-4 shadow-fluent-1">
        <ol className="grid gap-3 sm:grid-cols-3">
          <ModuleStep n={1} href="#aprende" title="Aprende y haz" detail={`${outline.length} partes con práctica en tu ambiente`} />
          <ModuleStep n={2} href="#practica" title="Practica" detail={recommendedLab || interactivePractices.length > 0 ? "Lab y ejercicios con feedback" : "Criterios de validación del módulo"} />
          <ModuleStep n={3} href="#comprueba" title="Comprueba" detail={questions.length > 0 ? `Evaluación de ${questions.length} preguntas` : "Marca el módulo como completado"} />
        </ol>
        {outline.length > 0 && (
          <details className="mt-4 border-t border-border pt-3 text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Índice del módulo</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {outline.map((item) => (
                <li key={item.slug}>
                  <a href={`#${item.slug}`} className="text-[#0078D4] underline-offset-2 hover:underline dark:text-[#4DB8FF]">{item.title}</a>
                </li>
              ))}
            </ol>
          </details>
        )}
      </nav>

      {/* ── Markdown content ─────────────────────────────────────────────── */}
      <div id="aprende" className="scroll-mt-20 rounded-xl border border-border bg-card px-6 py-8 md:px-8 shadow-fluent-1">
        {segments.map((segment, index) =>
          segment.optional ? (
            <details key={index} className="not-prose my-6 rounded-lg border border-border bg-muted/30 px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {segment.title} <span className="font-normal text-muted-foreground">· opcional</span>
              </summary>
              <MarkdownRenderer content={segment.markdown} />
            </details>
          ) : (
            <MarkdownRenderer key={index} content={segment.markdown} />
          ),
        )}
      </div>

      <div id="practica" className="scroll-mt-20 space-y-6">
      {recommendedLab && (
        <section aria-labelledby="recommended-lab-heading" className="rounded-xl border border-[#107C10]/25 bg-card px-6 py-5 shadow-fluent-1">
          <h2 id="recommended-lab-heading" className="text-lg font-semibold text-foreground">
            Práctica recomendada
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Después de este módulo, realiza &ldquo;{recommendedLab.title}&rdquo; para convertir la teoría en evidencia.
            Requisitos: {recommendedLab.prerequisites.join(", ")}. Tiempo estimado: {recommendedLab.minutes} min.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Si no tienes tenant, usa esta variante: {recommendedLab.tenantAlternative}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 border-[#107C10]/30 text-[#107C10] hover:bg-[#EFF8EE]">
            <Link href={recommendedLab.href}>
              Realizar práctica recomendada
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </section>
      )}

      {interactivePractices.length > 0 && (
        <section aria-labelledby="interactive-practice-heading" className="rounded-xl border border-[#107C10]/25 bg-card px-6 py-5 shadow-fluent-1">
          <h2 id="interactive-practice-heading" className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[#107C10]" aria-hidden />
            Prueba lo aprendido
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Practica decisiones y validaciones cortas con feedback inmediato. Este avance usa un progreso independiente del módulo.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {interactivePractices.map((practice) => (
              <Link
                key={practice.id}
                href={`/practica/${practice.slug}`}
                className="rounded-lg border border-border bg-background p-3 transition-colors hover:border-[#107C10]/45"
              >
                <Badge variant="outline" className="mb-2 text-[10px]">{INTERACTIVE_TYPE_LABELS[practice.type]}</Badge>
                <h3 className="text-sm font-semibold text-foreground">{practice.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{practice.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      </div>

      <div id="comprueba" className="scroll-mt-20 space-y-6">
      {questions.length > 0 && (
        <section aria-labelledby="quiz-heading" className="rounded-xl border border-border bg-card px-6 py-6 shadow-fluent-1">
          <h2 id="quiz-heading" className="text-lg font-semibold mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0078D4]" aria-hidden />
            {UI.quiz.title}
          </h2>
          <QuizPanel questions={questions} moduleId={mod.moduleId} />
        </section>
      )}

      {/* ── Diagnóstico de caso aplicado: plegado, no puntúa ─────────────── */}
      {caseQuestions.length > 0 && (
        <details className="rounded-xl border border-border bg-card px-6 py-4 shadow-fluent-1">
          <summary className="cursor-pointer text-base font-semibold">
            Diagnóstico de caso aplicado <span className="text-sm font-normal text-muted-foreground">· opcional, {caseQuestions.length} preguntas</span>
          </summary>
          <section aria-labelledby="case-diagnosis-heading" className="mt-4">
            <h2 id="case-diagnosis-heading" className="sr-only">Diagnóstico de caso aplicado</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Preguntas de decisión basadas en el &ldquo;Caso Real de Negocio&rdquo; de este módulo. No afectan tu puntaje de quiz ni del simulador.
            </p>
            <QuizPanel questions={caseQuestions} moduleId={`caso-${mod.moduleId}`} saveScore={false} />
          </section>
        </details>
      )}
      </div>

      <ModuleNotes moduleId={mod.id} />

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
