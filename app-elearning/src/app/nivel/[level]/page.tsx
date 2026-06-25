import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getLevelById, getAllLevels } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleCompletionClient } from "@/components/modules/module-completion-client";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
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

const LEVEL_ACCENT: Record<LevelId, { badge: "basico" | "intermedio" | "avanzado" | "arquitecto"; bar: string }> = {
  basico:     { badge: "basico",     bar: "bg-[#107C10]" },
  intermedio: { badge: "intermedio", bar: "bg-[#0078D4]" },
  avanzado:   { badge: "avanzado",   bar: "bg-orange-500" },
  arquitecto: { badge: "arquitecto", bar: "bg-[#D13438]" },
};

export default async function LevelPage({ params }: PageProps) {
  const { level } = await params;
  const levelData = getLevelById(level as LevelId);
  if (!levelData) notFound();

  const acc = LEVEL_ACCENT[levelData.id];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* ── Level header ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-6 shadow-fluent-1">
        <div className="flex items-start gap-4">
          <div className={`mt-1 h-10 w-1 rounded-full shrink-0 ${acc.bar}`} aria-hidden />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={acc.badge}>{UI.levels.badge[levelData.id]}</Badge>
              <Badge variant="outline">{levelData.certification}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {levelData.modules.length} módulos
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{levelData.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{levelData.description}</p>
          </div>
        </div>
      </div>

      {/* ── Level progress ────────────────────────────────────────────────── */}
      <LevelProgressBanner levelId={levelData.id} />

      {/* ── Module list ──────────────────────────────────────────────────── */}
      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-base font-semibold text-foreground mb-4">
          Módulos del nivel
        </h2>

        {levelData.modules.length === 0 ? (
          <p className="text-muted-foreground text-sm">Contenido en desarrollo.</p>
        ) : (
          <div className="space-y-2">
            {levelData.modules.map((mod) => (
              <div
                key={mod.id}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 shadow-fluent-1 hover:shadow-fluent-2 hover:border-[#0078D4]/30 dark:hover:border-[#4DB8FF]/30 transition-all duration-150"
              >
                {/* Module number bubble */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground font-mono">
                  {String(mod.moduleId).padStart(2, "0")}
                </div>

                {/* Module info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF] transition-colors">
                    {mod.title}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" aria-hidden />
                    {UI.module.estimatedTime(mod.estimatedMinutes)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <ModuleCompletionClient moduleId={mod.id} />
                  <Button
                    asChild size="sm" variant="ghost"
                    className="h-8 px-3 text-xs text-[#0078D4] dark:text-[#4DB8FF] hover:bg-[#EFF6FC] dark:hover:bg-[rgba(0,120,212,0.12)]"
                  >
                    <Link href={`/nivel/${levelData.id}/modulo/${mod.slug}`}>
                      Estudiar <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Client banner for level progress ────────────────────────────────────────
import { LevelProgressBannerClient } from "@/components/modules/level-progress-banner";
function LevelProgressBanner({ levelId }: { levelId: LevelId }) {
  return <LevelProgressBannerClient levelId={levelId} />;
}
