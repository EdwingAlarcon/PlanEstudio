import Link from "next/link";
import { getAllLevels } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRingClient } from "@/components/modules/progress-ring-client";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";

const LEVEL_COLORS: Record<LevelId, { ring: string; border: string; badge: "basico" | "intermedio" | "avanzado" | "arquitecto" }> = {
  basico: { ring: "stroke-green-500", border: "border-green-200 dark:border-green-900", badge: "basico" },
  intermedio: { ring: "stroke-blue-500", border: "border-blue-200 dark:border-blue-900", badge: "intermedio" },
  avanzado: { ring: "stroke-orange-500", border: "border-orange-200 dark:border-orange-900", badge: "avanzado" },
  arquitecto: { ring: "stroke-red-500", border: "border-red-200 dark:border-red-900", badge: "arquitecto" },
};

export default async function DashboardPage() {
  const levels = getAllLevels();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Power Platform & D365
        </h1>
        <p className="text-muted-foreground text-lg">
          Plan de estudio progresivo — de cero a Solution Architect.
        </p>
      </div>

      {/* Overall progress */}
      <OverallProgressBanner />

      {/* Level cards */}
      <section aria-labelledby="levels-heading">
        <h2 id="levels-heading" className="text-xl font-semibold mb-4">
          {UI.nav.levels}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {LEVEL_ORDER.map((levelId) => {
            const level = levels.find((l) => l.id === levelId);
            if (!level) return null;
            const cfg = LEVEL_COLORS[levelId];

            return (
              <Card key={levelId} className={`border-2 ${cfg.border} transition-shadow hover:shadow-md`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={cfg.badge}>{UI.levels.badge[levelId]}</Badge>
                        <Badge variant="outline">{UI.levels.cert[levelId]}</Badge>
                      </div>
                      <CardTitle className="text-lg">{level.title}</CardTitle>
                      <CardDescription>{level.description}</CardDescription>
                    </div>
                    <ProgressRingClient levelId={levelId} colorClass={cfg.ring} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden />
                      <span>{level.modules.length} módulos</span>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/nivel/${levelId}`} aria-label={`Ver ${level.title}`}>
                        Ver nivel <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-heading" className="grid gap-3 sm:grid-cols-2">
        <h2 id="quick-heading" className="sr-only">Acceso rápido</h2>
        <Button asChild variant="outline" className="justify-start h-auto py-3">
          <Link href="/simulador">
            <Trophy className="h-4 w-4 shrink-0" aria-hidden />
            <div className="text-left">
              <div className="font-medium">{UI.nav.simulator}</div>
              <div className="text-xs text-muted-foreground">Examen cronometrado con 40 preguntas</div>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start h-auto py-3">
          <Link href="/recursos/checklist">
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
            <div className="text-left">
              <div className="font-medium">{UI.nav.checklist}</div>
              <div className="text-xs text-muted-foreground">41 módulos con criterios de validación</div>
            </div>
          </Link>
        </Button>
      </section>
    </div>
  );
}

// Client wrapper for overall progress — avoids RSC hydration mismatch
function OverallProgressBanner() {
  return <OverallProgressBannerClient />;
}

import { OverallProgressBannerClient } from "@/components/modules/overall-progress-banner";
