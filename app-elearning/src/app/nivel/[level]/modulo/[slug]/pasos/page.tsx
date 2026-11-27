import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata, PATHS } from "@/lib/seo";
import { getAllLevels, getModuleBySlug } from "@/lib/content";
import { getQuestionsForModule } from "@/lib/questions-parser";
import { getInteractivePracticeBySlug, type InteractivePractice } from "@/lib/interactive-practices";
import { buildLessonSteps, hasStepMode } from "@/lib/lesson-steps";
import { LessonStepsClient } from "@/components/modules/lesson-steps-client";
import type { LevelId } from "@/lib/i18n";

// Lección por pasos (F2 de "El camino jugable"). Solo existe para los módulos de STEP_MODE_MODULE_KEYS.
// Es otra forma de recorrer el mismo contenido del módulo: noindex para no duplicarlo en buscadores.

interface PageProps {
  params: Promise<{ level: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllLevels().flatMap((level) =>
    level.modules.filter((mod) => hasStepMode(mod.id)).map((mod) => ({ level: level.id, slug: mod.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { level, slug } = await params;
  const mod = getModuleBySlug(level as LevelId, slug);
  if (!mod) return {};
  return buildPageMetadata({
    title: `${mod.title} · paso a paso`,
    description: `Módulo ${mod.moduleId} paso a paso: una idea por pantalla, con la práctica dentro de cada paso.`,
    path: `${PATHS.module(mod.levelId, mod.slug)}/pasos`,
    noIndex: true,
  });
}

export default async function ModuleStepsPage({ params }: PageProps) {
  const { level, slug } = await params;
  const mod = getModuleBySlug(level as LevelId, slug);
  if (!mod || !hasStepMode(mod.id)) notFound();

  const steps = buildLessonSteps(mod.rawContent);
  if (steps.length === 0) notFound();

  // Solo las prácticas que enlazan los pasos, no el catálogo completo.
  const practices: Record<string, InteractivePractice> = {};
  for (const step of steps) {
    if (!step.practiceSlug) continue;
    const practice = getInteractivePracticeBySlug(step.practiceSlug);
    if (practice) practices[step.practiceSlug] = practice;
  }

  return (
    <LessonStepsClient
      moduleKey={mod.id}
      moduleTitle={`Módulo ${mod.moduleId} · ${mod.title}`}
      moduleHref={PATHS.module(mod.levelId, mod.slug)}
      steps={steps}
      practices={practices}
      questionCount={getQuestionsForModule(mod.moduleId).length}
    />
  );
}
