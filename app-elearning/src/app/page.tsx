import Link from "next/link";
import { getAllLabs, getAllLevels } from "@/lib/content";
import { getAllQuestions } from "@/lib/questions-parser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRingClient } from "@/components/modules/progress-ring-client";
import { ArrowRight, BookOpen, Trophy, FlaskConical, Route, Zap, HelpCircle, Layers3 } from "lucide-react";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";

// Level display config
const LEVEL_CONFIG: Record<LevelId, {
  ring: string;
  accent: string;
  accentDark: string;
  border: string;
  badge: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia";
}> = {
  basico:     { ring: "stroke-[#107C10]", accent: "#107C10", accentDark: "#2DB52D", border: "border-[#107C10]/20 dark:border-[#2DB52D]/20", badge: "basico"     },
  intermedio: { ring: "stroke-[#0078D4]", accent: "#0078D4", accentDark: "#4DB8FF", border: "border-[#0078D4]/20 dark:border-[#4DB8FF]/20",  badge: "intermedio" },
  avanzado:   { ring: "stroke-orange-500", accent: "#EA580C", accentDark: "#F97316", border: "border-orange-500/20",                           badge: "avanzado"   },
  arquitecto: { ring: "stroke-[#D13438]", accent: "#D13438", accentDark: "#E85555", border: "border-[#D13438]/20 dark:border-[#E85555]/20",   badge: "arquitecto" },
  ia:         { ring: "stroke-purple-600", accent: "#9333EA", accentDark: "#C084FC", border: "border-purple-600/20 dark:border-purple-400/20", badge: "ia"         },
};

export default async function DashboardPage() {
  const levels = getAllLevels();
  const moduleCount = levels.reduce((total, level) => total + level.modules.length, 0);
  const labCount = getAllLabs().length;
  const questionCount = getAllQuestions().length;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white dark:from-[rgba(0,120,212,0.08)] dark:to-background px-6 py-8 md:px-10 shadow-fluent-1">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0078D4] shadow-fluent-4">
            <Zap className="h-7 w-7 text-white" aria-hidden />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[#0078D4] text-white border-0 text-xs px-2 py-0.5">Power Platform</Badge>
              <Badge className="bg-[#107C10] text-white border-0 text-xs px-2 py-0.5">Dynamics 365</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Plan de Estudio Progresivo
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
              De cero a Solution Architect. {moduleCount} módulos, {labCount} laboratorios
              y {questionCount} preguntas de evaluación — con certificaciones vigentes,
              competencias profesionales y una capa transversal de Desarrollo Asistido por IA.
            </p>
          </div>
        </div>
      </div>

      {/* ── Where to start ────────────────────────────────────────────────── */}
      <section aria-labelledby="start-heading" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="start-heading" className="text-lg font-semibold text-foreground">
              Por dónde empezar
            </h2>
            <p className="text-sm text-muted-foreground">
              Elige el punto de entrada según tu experiencia actual. No necesitas recorrer todo en una sola sesión.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="self-start text-[#0078D4] dark:text-[#4DB8FF] sm:self-auto">
            <Link href="/como-usar">
              Ver guía completa
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <StartCard
            href="/nivel/basico"
            eyebrow="Soy nuevo"
            title="Empieza por fundamentos"
            description="Avanza por módulos y laboratorios en orden para construir base sólida."
            icon={<Layers3 className="h-5 w-5 text-[#107C10]" />}
            accent="#107C10"
          />
          <StartCard
            href="/rutas"
            eyebrow="Tengo un rol objetivo"
            title="Elige una ruta profesional"
            description="Maker, consultor, developer, architect, D365 o IA: estudia con foco."
            icon={<Route className="h-5 w-5 text-[#0078D4]" />}
            accent="#0078D4"
          />
          <StartCard
            href="/simulador"
            eyebrow="Quiero practicar examen"
            title="Mide preparación"
            description="Usa el simulador cuando ya hayas cubierto varios módulos y quieras detectar temas débiles."
            icon={<Trophy className="h-5 w-5 text-orange-500" />}
            accent="#EA580C"
          />
        </div>
      </section>

      {/* ── Overall progress ──────────────────────────────────────────────── */}
      <OverallProgressBanner />

      {/* ── Level cards ───────────────────────────────────────────────────── */}
      <section aria-labelledby="levels-heading">
        <div className="flex items-center justify-between mb-5">
          <h2 id="levels-heading" className="text-lg font-semibold text-foreground">
            {UI.nav.levels}
          </h2>
          <span className="text-sm text-muted-foreground">{levels.length} niveles</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LEVEL_ORDER.map((levelId) => {
            const level = levels.find((l) => l.id === levelId);
            if (!level) return null;
            const cfg = LEVEL_CONFIG[levelId];

            return (
              <div
                key={levelId}
                className={`group relative rounded-xl border-2 ${cfg.border} bg-card shadow-fluent-1 hover:shadow-fluent-4 transition-all duration-200`}
              >
                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={cfg.badge}>{UI.levels.badge[levelId]}</Badge>
                        <Badge variant="outline" className="text-[10px]" title={UI.levels.cert[levelId]}>
                          {UI.levels.navCert[levelId]}
                        </Badge>
                      </div>
                      <h3 className="text-base font-semibold text-foreground leading-snug">{level.title}</h3>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    <ProgressRingClient levelId={levelId} colorClass={cfg.ring} />
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden />
                      {level.modules.length} módulos
                    </span>
                    <Button asChild size="sm" variant="ghost"
                      className="h-8 px-3 text-xs text-[#0078D4] dark:text-[#4DB8FF] hover:bg-[#EFF6FC] dark:hover:bg-[rgba(0,120,212,0.12)]">
                      <Link href={`/nivel/${levelId}`} aria-label={`Ver ${level.title}`}>
                        Ver nivel <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <section aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-lg font-semibold text-foreground mb-4">
          Acceso rápido
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <QuickActionCard
            href="/como-usar"
            icon={<HelpCircle className="h-5 w-5 text-[#0078D4]" />}
            title={UI.nav.howToUse}
            description="Orden recomendado para estudiar"
            accent="#0078D4"
          />
          <QuickActionCard
            href="/rutas"
            icon={<Route className="h-5 w-5 text-[#0078D4]" />}
            title={UI.nav.routes}
            description="7 rutas por rol profesional"
            accent="#0078D4"
          />
          <QuickActionCard
            href="/simulador"
            icon={<Trophy className="h-5 w-5 text-[#0078D4]" />}
            title={UI.nav.simulator}
            description="40 preguntas cronometradas"
            accent="#0078D4"
          />
          <QuickActionCard
            href="/labs"
            icon={<FlaskConical className="h-5 w-5 text-[#107C10]" />}
            title="Laboratorios"
            description={`${labCount} guías prácticas con escenario SIT`}
            accent="#107C10"
          />
          <QuickActionCard
            href="/recursos/checklist"
            icon={<BookOpen className="h-5 w-5 text-orange-500" />}
            title={UI.nav.checklist}
            description="Progreso por módulo con criterios"
            accent="#EA580C"
          />
        </div>
      </section>
    </div>
  );
}

// ─── Start card ──────────────────────────────────────────────────────────────

function StartCard({
  href, eyebrow, title, description, icon, accent,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-5 shadow-fluent-1 transition-all duration-200 hover:border-[var(--a)] hover:shadow-fluent-4"
      style={{ "--a": accent + "40" } as React.CSSProperties}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: accent + "18" }}
        >
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center text-xs font-medium text-[#0078D4] dark:text-[#4DB8FF]">
        Ir ahora
        <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
      </span>
    </Link>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────────

function QuickActionCard({
  href, icon, title, description, accent,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-fluent-1 hover:shadow-fluent-4 hover:border-[var(--a)] transition-all duration-200"
      style={{ "--a": accent + "40" } as React.CSSProperties}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: accent + "18" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF] transition-colors">
          {title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

// ─── Overall progress banner ─────────────────────────────────────────────────

function OverallProgressBanner() {
  return <OverallProgressBannerClient />;
}

import { OverallProgressBannerClient } from "@/components/modules/overall-progress-banner";
