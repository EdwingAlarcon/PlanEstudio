import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllLevels, getModuleBySlug } from "@/lib/content";
import { getQuestionsForModule } from "@/lib/questions-parser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModuleCompletionClient } from "@/components/modules/module-completion-client";
import { QuizPanel } from "@/components/quiz/quiz-panel";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { UI, type LevelId } from "@/lib/i18n";

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
    description: `Módulo ${mod.moduleId} del nivel ${mod.levelId}`,
  };
}

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

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Button asChild variant="ghost" size="sm" className="px-0 -ml-1">
        <Link href={`/nivel/${levelId}`}>
          <ArrowLeft className="h-4 w-4 mr-1" aria-hidden />
          {UI.module.backToLevel}
        </Link>
      </Button>

      {/* Module header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={levelId as "basico" | "intermedio" | "avanzado" | "arquitecto"}>
            {UI.levels.badge[levelId]}
          </Badge>
          <span className="text-sm text-muted-foreground font-mono">Módulo {mod.moduleId}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {UI.module.estimatedTime(mod.estimatedMinutes)}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{mod.title}</h1>
          <ModuleCompletionClient moduleId={mod.id} />
        </div>
      </div>

      {/* Markdown Content */}
      <MarkdownRenderer
        content={mod.rawContent}
        className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-mt-16
          prose-code:font-mono
          prose-pre:bg-muted
          prose-a:text-primary hover:prose-a:underline"
      />

      {/* Quiz panel */}
      {questions.length > 0 && (
        <section aria-labelledby="quiz-heading">
          <h2 id="quiz-heading" className="text-xl font-semibold mb-4">
            {UI.quiz.title}
          </h2>
          <QuizPanel
            questions={questions}
            moduleId={mod.moduleId}
          />
        </section>
      )}

      {/* Prev / Next navigation */}
      <nav
        className="flex justify-between gap-4 pt-4 border-t"
        aria-label="Navegación entre módulos"
      >
        {prevModule ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/nivel/${levelId}/modulo/${prevModule.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-1" aria-hidden />
              <span className="hidden sm:inline">{UI.module.previous}</span>
              <span className="sm:hidden">Anterior</span>
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/nivel/${levelId}/modulo/${nextModule.slug}`}>
              <span className="hidden sm:inline">{UI.module.next}</span>
              <span className="sm:hidden">Siguiente</span>
              <ArrowRight className="h-4 w-4 ml-1" aria-hidden />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
