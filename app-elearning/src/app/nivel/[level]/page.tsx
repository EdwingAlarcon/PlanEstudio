import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getLevelById, getAllLevels } from "@/lib/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleCompletionClient } from "@/components/modules/module-completion-client";
import { ArrowRight, Clock } from "lucide-react";
import { UI, type LevelId } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ level: string }>;
}

export async function generateStaticParams() {
  const levels = getAllLevels();
  return levels.map((l) => ({ level: l.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { level } = await params;
  const levelData = getLevelById(level as LevelId);
  if (!levelData) return {};
  return {
    title: levelData.title,
    description: levelData.description,
  };
}

export default async function LevelPage({ params }: PageProps) {
  const { level } = await params;
  const levelData = getLevelById(level as LevelId);
  if (!levelData) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Level header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={levelData.id as "basico" | "intermedio" | "avanzado" | "arquitecto"}>
            {UI.levels.badge[levelData.id]}
          </Badge>
          <Badge variant="outline">{levelData.certification}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{levelData.title}</h1>
        <p className="text-muted-foreground">{levelData.description}</p>
      </div>

      {/* Level progress client component */}
      <LevelProgressBanner levelId={levelData.id} totalModules={levelData.modules.length} />

      {/* Module list */}
      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-semibold mb-4">
          Módulos ({levelData.modules.length})
        </h2>

        {levelData.modules.length === 0 ? (
          <p className="text-muted-foreground">Contenido en desarrollo.</p>
        ) : (
          <div className="space-y-3">
            {levelData.modules.map((mod) => (
              <Card key={mod.id} className="transition-shadow hover:shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          Módulo {mod.moduleId}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" aria-hidden />
                          <span>{UI.module.estimatedTime(mod.estimatedMinutes)}</span>
                        </div>
                      </div>
                      <CardTitle className="text-base">{mod.title}</CardTitle>
                    </div>
                    <ModuleCompletionClient moduleId={mod.id} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild size="sm" variant="ghost" className="px-0 h-auto">
                    <Link href={`/nivel/${levelData.id}/modulo/${mod.slug}`}>
                      Estudiar módulo <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Client banner for level progress (reads from Zustand) ───────────────────

import { LevelProgressBannerClient } from "@/components/modules/level-progress-banner";

function LevelProgressBanner({ levelId, totalModules }: { levelId: LevelId; totalModules: number }) {
  return <LevelProgressBannerClient levelId={levelId} totalModules={totalModules} />;
}
