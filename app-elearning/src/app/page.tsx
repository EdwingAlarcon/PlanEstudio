import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { getAllLevels, getLabsForLevel } from "@/lib/content";
import { ArrowRight } from "lucide-react";
import { UI, CERTIFICATION_LEVEL_ORDER, TRANSVERSAL_LEVEL_ORDER } from "@/lib/i18n";
import { GuidedHomeClient } from "@/components/guided/guided-home-client";
import { RetentionTodayCard } from "@/components/review/retention-today-card";
import { LevelStepProgress } from "@/components/modules/level-step-progress";

// Home: título por defecto del sitio, con canonical y og:url propios.
export const metadata: Metadata = buildPageMetadata({ path: "/" });

// Inicio rediseñado el 2026-11-11 con tres bloques, en el orden de las preguntas del alumno:
// 1) ¿qué hago ahora? (siguiente paso), 2) ¿qué repaso hoy?, 3) ¿dónde estoy en el recorrido?
// Se retiraron las 8 tarjetas de "Acceso rápido" y las 4 de dominio: duplicaban la barra lateral.
export default function DashboardPage() {
  const levels = getAllLevels();
  const certification = CERTIFICATION_LEVEL_ORDER.map((id) => levels.find((level) => level.id === id)!).filter(Boolean);
  const transversal = TRANSVERSAL_LEVEL_ORDER.map((id) => levels.find((level) => level.id === id)!).filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl space-y-10 animate-fade-in">
      <GuidedHomeClient />

      <RetentionTodayCard />

      <section aria-labelledby="journey-heading" className="space-y-4">
        <div>
          <h2 id="journey-heading" className="text-lg font-semibold text-foreground">Tu recorrido</h2>
          <p className="text-sm text-muted-foreground">
            Cuatro niveles en orden; cada uno prepara una certificación y exige el anterior.
          </p>
        </div>

        <ol className="space-y-2">
          {certification.map((level, index) => (
            <li key={level.id}>
              <Link
                href={`/nivel/${level.id}`}
                className="group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-[#0078D4]/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{level.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {level.description} · {UI.levels.cert[level.id]} · {level.modules.length} módulos, {getLabsForLevel(level.id).length} labs
                  </span>
                </span>
                <LevelStepProgress levelId={level.id} />
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>

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
  );
}
