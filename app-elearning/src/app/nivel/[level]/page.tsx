import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getLevelById, getAllLevels } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleCompletionClient } from "@/components/modules/module-completion-client";
import { ArrowRight, Clock, BookOpen, ClipboardCheck, FlaskConical, ShieldCheck } from "lucide-react";
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

const LEVEL_ACCENT: Record<LevelId, { badge: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "d365"; bar: string }> = {
  basico:     { badge: "basico",     bar: "bg-[#107C10]" },
  intermedio: { badge: "intermedio", bar: "bg-[#0078D4]" },
  avanzado:   { badge: "avanzado",   bar: "bg-orange-500" },
  arquitecto: { badge: "arquitecto", bar: "bg-[#D13438]" },
  ia:         { badge: "ia",         bar: "bg-purple-600" },
  d365:       { badge: "d365",       bar: "bg-teal-600" },
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
              <Badge variant="outline" title={levelData.certification}>
                {UI.levels.navCert[levelData.id]}
              </Badge>
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

      {levelData.id === "d365" && <D365EnterprisePracticePanel />}

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

function D365EnterprisePracticePanel() {
  const practiceTracks = [
    {
      title: "Preparación del tenant",
      description: "Confirma ambientes, licencias, roles, DLP y apps instaladas antes de ejecutar labs que cambian configuración real.",
      icon: ShieldCheck,
      href: "/recursos/d365-tenant-readiness",
      label: "Ver readiness",
    },
    {
      title: "Labs avanzados",
      description: "Trabaja Sales, SLA/routing, Contact Center, Customer Insights, Field Service y CE + F&O con evidencias de portafolio.",
      icon: FlaskConical,
      href: "/labs",
      label: "Ver labs",
    },
    {
      title: "Capstone enterprise",
      description: "Cierra con Fit-Gap, matriz de ownership, roadmap, UAT y resumen ejecutivo para defender una solución D365 completa.",
      icon: ClipboardCheck,
      href: "/labs/lab-90-capstone-enterprise-d365",
      label: "Abrir capstone",
    },
  ];

  return (
    <section
      aria-labelledby="d365-practice-heading"
      className="rounded-xl border border-teal-200/70 bg-teal-50/70 px-5 py-5 shadow-fluent-1 dark:border-teal-900/70 dark:bg-teal-950/30"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="d365">Práctica enterprise</Badge>
            <Badge variant="outline">Dev → QA → Prod</Badge>
          </div>
          <h2 id="d365-practice-heading" className="text-base font-semibold text-foreground">
            Ruta práctica recomendada para Dynamics 365
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Primero diseña y documenta; después configura en Dev; al final valida instalación de módulos y promoción a QA. Prod queda fuera de prácticas de prueba.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0">
          <Link href="/recursos/d365-tenant-readiness">
            Checklist tenant
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {practiceTracks.map((track) => {
          const Icon = track.icon;
          return (
            <Link
              key={track.href}
              href={track.href}
              className="group rounded-lg border border-border bg-card p-4 shadow-fluent-1 transition-all duration-150 hover:border-teal-500/40 hover:shadow-fluent-2"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300">
                {track.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {track.description}
              </p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-teal-700 dark:text-teal-300">
                {track.label}
                <ArrowRight className="ml-1 h-3 w-3" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Client banner for level progress ────────────────────────────────────────
import { LevelProgressBannerClient } from "@/components/modules/level-progress-banner";
function LevelProgressBanner({ levelId }: { levelId: LevelId }) {
  return <LevelProgressBannerClient levelId={levelId} />;
}
