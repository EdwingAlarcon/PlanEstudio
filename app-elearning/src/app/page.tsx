import Link from "next/link";
import { getAllLabs, getAllLevels } from "@/lib/content";
import { getAllQuestions } from "@/lib/questions-parser";
import { getAllPractices } from "@/lib/practices";
import { getAllInteractivePractices } from "@/lib/interactive-practices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRingClient } from "@/components/modules/progress-ring-client";
import { ArrowRight, BookOpen, Trophy, FlaskConical, Route, HelpCircle, Layers3, Briefcase, Building2, Workflow, Activity, Bot } from "lucide-react";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { PracticeProgressSummary } from "@/components/practices/practice-progress-summary";
import { GuidedHomeClient } from "@/components/guided/guided-home-client";
import { InteractivePracticeSummary } from "@/components/interactive-practices/interactive-practice-summary";
import { RetentionTodayCard } from "@/components/review/retention-today-card";

// Level display config
const LEVEL_CONFIG: Record<LevelId, {
  ring: string;
  accent: string;
  accentDark: string;
  border: string;
  badge: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "d365" | "rpa";
}> = {
  basico:     { ring: "stroke-[#107C10]", accent: "#107C10", accentDark: "#2DB52D", border: "border-[#107C10]/20 dark:border-[#2DB52D]/20", badge: "basico"     },
  intermedio: { ring: "stroke-[#0078D4]", accent: "#0078D4", accentDark: "#4DB8FF", border: "border-[#0078D4]/20 dark:border-[#4DB8FF]/20",  badge: "intermedio" },
  avanzado:   { ring: "stroke-orange-500", accent: "#EA580C", accentDark: "#F97316", border: "border-orange-500/20",                           badge: "avanzado"   },
  arquitecto: { ring: "stroke-[#D13438]", accent: "#D13438", accentDark: "#E85555", border: "border-[#D13438]/20 dark:border-[#E85555]/20",   badge: "arquitecto" },
  ia:         { ring: "stroke-purple-600", accent: "#9333EA", accentDark: "#C084FC", border: "border-purple-600/20 dark:border-purple-400/20", badge: "ia"         },
  d365:       { ring: "stroke-teal-600",   accent: "#0D9488", accentDark: "#2DD4BF", border: "border-teal-600/20 dark:border-teal-400/20",     badge: "d365"       },
  rpa:        { ring: "stroke-[#6B4EFF]",  accent: "#6B4EFF", accentDark: "#A99BFF", border: "border-[#6B4EFF]/20 dark:border-[#A99BFF]/20",   badge: "rpa"        },
};

export default async function DashboardPage() {
  const levels = getAllLevels();
  const moduleCount = levels.reduce((total, level) => total + level.modules.length, 0);
  const labCount = getAllLabs().length;
  const questionCount = getAllQuestions().length;
  const practices = getAllPractices().map(({ id, slug, title, practiceType, domain, roles, difficulty, prerequisites }) => ({
    id, slug, title, practiceType, domain, roles, difficulty, prerequisites,
  }));
  const interactivePractices = getAllInteractivePractices();

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      <GuidedHomeClient />

      <section aria-labelledby="catalog-heading" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="catalog-heading" className="text-lg font-semibold text-foreground">
              Explorar todo el contenido
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Todo sigue disponible: {moduleCount} módulos, {labCount} laboratorios y {questionCount} preguntas.
              Esta vista es consultiva; si empiezas desde cero, tu ruta actual solo cuenta 7 actividades.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
            <Link href="/como-usar">
              Ver guia completa
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Domains ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="domains-heading" className="space-y-4">
        <div>
          <h2 id="domains-heading" className="text-lg font-semibold text-foreground">
            Especialízate por dominio
          </h2>
          <p className="text-sm text-muted-foreground">
            Mismo contenido de niveles y labs, agrupado por área para que no se mezcle Power Platform con Dynamics 365.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StartCard
            href="/power-platform"
            eyebrow="Dominio"
            title="Power Platform"
            description="Dataverse, Power Apps, Power Automate, Power Pages, ALM y gobernanza."
            icon={<Layers3 className="h-5 w-5 text-[#0078D4]" />}
            accent="#0078D4"
          />
          <StartCard
            href="/dynamics-365"
            eyebrow="Dominio"
            title="Dynamics 365"
            description="Sales, Customer Service, Customer Insights, Field Service y F&O awareness."
            icon={<Building2 className="h-5 w-5 text-[#0D9488]" />}
            accent="#0D9488"
          />
          <StartCard
            href="/integracion"
            eyebrow="Capa puente"
            title="Integración PP + D365"
            description="Dataverse común, ALM, APIs/Azure y CE + F&O (dual-write, virtual tables)."
            icon={<Workflow className="h-5 w-5 text-[#8661C5]" />}
            accent="#8661C5"
          />
          <StartCard
            href="/nivel/rpa"
            eyebrow="Especialización"
            title="Power Automate Desktop & RPA"
            description="Desktop flows, attended/unattended, selectores, Excel, web, legacy y operación."
            icon={<Bot className="h-5 w-5 text-[#6B4EFF]" />}
            accent="#6B4EFF"
          />
        </div>
      </section>

      {/* ── Overall progress ──────────────────────────────────────────────── */}
      <OverallProgressBanner />

      <PracticeProgressSummary practices={practices} />
      <InteractivePracticeSummary practices={interactivePractices} />
      <RetentionTodayCard />

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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
            description="10 rutas por rol profesional"
            accent="#0078D4"
          />
          <QuickActionCard
            href="/empleabilidad"
            icon={<Briefcase className="h-5 w-5 text-[#0F6CBD]" />}
            title={UI.nav.employability}
            description="Skills, perfiles y entrevistas"
            accent="#0F6CBD"
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
            href="/experiencia-practica"
            icon={<Activity className="h-5 w-5 text-[#D13438]" />}
            title="Experiencia práctica"
            description="Incidentes, challenges y simulación"
            accent="#D13438"
          />
          <QuickActionCard
            href="/practica"
            icon={<Activity className="h-5 w-5 text-[#107C10]" />}
            title="Práctica interactiva"
            description={`${interactivePractices.length} ejercicios con feedback inmediato`}
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
