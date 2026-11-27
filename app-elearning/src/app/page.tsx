import { buildLessonSteps, stepProgressId } from "@/lib/lesson-steps";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { getAllLevels, getLabsForLevel } from "@/lib/content";
import { UI, CERTIFICATION_LEVEL_ORDER, TRANSVERSAL_LEVEL_ORDER } from "@/lib/i18n";
import { GuidedHomeClient } from "@/components/guided/guided-home-client";
import { RetentionTodayCard } from "@/components/review/retention-today-card";
import { TodayCard, WeeklyGoalCard } from "@/components/guided/habit-cards";
import { LearningPathMap, type PathWorld } from "@/components/guided/learning-path-map";
import { getAllInteractivePractices } from "@/lib/interactive-practices";

// Datos mínimos del camino (F1 de "El camino jugable"): solo los campos que pinta el cliente.
// Cada práctica se atribuye a su primer módulo relacionado para no contarla dos veces en el camino.
// "Jefe" del mundo (F5): el reto de transferencia del último módulo del nivel (su proyecto integrador), abierto en
// el modo por pasos directamente en ese paso.
function buildBoss(levelId: string, mod: ReturnType<typeof getAllLevels>[number]["modules"][number] | undefined) {
  if (!mod) return undefined;
  const steps = buildLessonSteps(mod.rawContent);
  const index = steps.findIndex((step) => step.kind === "reto");
  if (index === -1) return undefined;
  return {
    stepProgressId: stepProgressId(mod.id, steps[index]!.id),
    moduleTitle: `Módulo ${mod.moduleId} · ${mod.title}`,
    href: `/nivel/${levelId}/modulo/${mod.slug}/pasos#paso-${index + 1}`,
  };
}

function buildPathWorlds(levels: ReturnType<typeof getAllLevels>): PathWorld[] {
  const practicesByModule = new Map<number, string[]>();
  for (const practice of getAllInteractivePractices()) {
    const moduleId = practice.relatedModuleIds[0];
    if (moduleId === undefined) continue;
    practicesByModule.set(moduleId, [...(practicesByModule.get(moduleId) ?? []), practice.id]);
  }
  return CERTIFICATION_LEVEL_ORDER.flatMap((id, index) => {
    const level = levels.find((l) => l.id === id);
    if (!level) return [];
    return [{
      levelId: level.id,
      step: index + 1,
      title: level.title,
      description: level.description,
      certification: UI.levels.cert[level.id],
      modules: level.modules.map((mod) => ({
        key: mod.id,
        moduleId: mod.moduleId,
        title: mod.title,
        href: `/nivel/${level.id}/modulo/${mod.slug}`,
        minutes: mod.estimatedMinutes,
        practiceIds: practicesByModule.get(mod.moduleId) ?? [],
      })),
      boss: buildBoss(level.id, level.modules.at(-1)),
      labs: getLabsForLevel(level.id).map((lab) => ({
        slug: lab.slug,
        displayId: lab.displayId,
        title: lab.title,
        href: `/labs/${lab.slug}`,
        duration: lab.duration,
      })),
    }];
  });
}

// Home: título por defecto del sitio, con canonical y og:url propios.
export const metadata: Metadata = buildPageMetadata({ path: "/" });

// Inicio rediseñado el 2026-11-11 con tres bloques, en el orden de las preguntas del alumno:
// 1) ¿qué hago ahora? (siguiente paso), 2) ¿qué repaso hoy?, 3) ¿dónde estoy en el recorrido?
// Desde el 2026-11-27 el recorrido es un camino de nodos por mundo (LearningPathMap), con XP.
// Se retiraron las 8 tarjetas de "Acceso rápido" y las 4 de dominio: duplicaban la barra lateral.
export default function DashboardPage() {
  const levels = getAllLevels();
  const worlds = buildPathWorlds(levels);
  const transversal = TRANSVERSAL_LEVEL_ORDER.map((id) => levels.find((level) => level.id === id)!).filter(Boolean);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 animate-fade-in lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-10">
      <GuidedHomeClient />

      <RetentionTodayCard />

      <LearningPathMap worlds={worlds} />

      <section aria-label="Especializaciones">
        <div className="rounded-lg border border-dashed border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">Especializaciones (cuando quieras, sin requisitos)</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {transversal.map((level) => (
              <li key={level.id}>
                <Link href={`/nivel/${level.id}`} className="text-[#0078D4] underline-offset-2 hover:underline dark:text-[#4DB8FF]">
                  {UI.levels[level.id]}
                </Link>
                <span className="text-muted-foreground"> · {level.modules.length} módulos</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>

      {/* Columna del hábito (F4): meta semanal con racha por semanas y lo de hoy. En móvil va al final. */}
      <aside aria-label="Tu semana" className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <WeeklyGoalCard />
        <TodayCard />
      </aside>
    </div>
  );
}
