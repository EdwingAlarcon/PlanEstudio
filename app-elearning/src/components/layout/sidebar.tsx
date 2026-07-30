"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, CheckSquare, GraduationCap, FileText, Trophy,
  Home, PlayCircle, FlaskConical, Route, HelpCircle, Briefcase, ClipboardList, Activity,
  Layers3, Building2, Workflow, Bot, Compass, GitBranch,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProgressStore, calculateLevelProgress } from "@/lib/progress";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { getNextBestAction } from "@/lib/guided-journey";
import { CERTIFICATION_LEVEL_ORDER, LEVEL_ORDER, TRANSVERSAL_LEVEL_ORDER, UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEVEL_CONFIG: Record<LevelId, {
  dot: string;
  label: string;
  badgeVariant: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "d365" | "rpa";
  progressColor: string;
}> = {
  basico:     { dot: "bg-[#107C10]", label: "text-[#107C10] dark:text-green-400",    badgeVariant: "basico",     progressColor: "[&>div]:bg-[#107C10]" },
  intermedio: { dot: "bg-[#0078D4]", label: "text-[#0078D4] dark:text-[#4DB8FF]",   badgeVariant: "intermedio", progressColor: "[&>div]:bg-[#0078D4]" },
  avanzado:   { dot: "bg-orange-500", label: "text-orange-600 dark:text-orange-400", badgeVariant: "avanzado",   progressColor: "[&>div]:bg-orange-500" },
  arquitecto: { dot: "bg-[#D13438]", label: "text-[#D13438] dark:text-red-400",      badgeVariant: "arquitecto", progressColor: "[&>div]:bg-[#D13438]"  },
  ia:         { dot: "bg-purple-600", label: "text-purple-600 dark:text-purple-400", badgeVariant: "ia",         progressColor: "[&>div]:bg-purple-600" },
  d365:       { dot: "bg-teal-600",   label: "text-teal-600 dark:text-teal-400",     badgeVariant: "d365",       progressColor: "[&>div]:bg-teal-600"  },
  rpa:        { dot: "bg-[#6B4EFF]",  label: "text-[#6B4EFF] dark:text-[#A99BFF]",   badgeVariant: "rpa",        progressColor: "[&>div]:bg-[#6B4EFF]" },
};

const SIDEBAR_FOOTER_LABEL = LEVEL_ORDER.map((levelId) => UI.levels.navCert[levelId]).join(" · ");

const RESOURCE_LINKS = [
  { href: "/recursos/checklist",    label: UI.nav.checklist,     icon: CheckSquare },
  { href: "/recursos/glosario",     label: UI.nav.glossary,      icon: BookOpen    },
  { href: "/recursos/certificaciones", label: UI.nav.certifications, icon: Trophy  },
  { href: "/recursos/banco-preguntas", label: UI.nav.questionBank,   icon: FileText },
  { href: "/recursos/prompts-ia",    label: UI.nav.promptsIA,     icon: FileText },
  { href: "/recursos/rubricas-plantillas", label: UI.nav.rubricsTemplates, icon: CheckSquare },
  { href: "/recursos/matriz-competencias", label: UI.nav.competencyMatrix, icon: FileText },
  { href: "/recursos/portafolio-profesional", label: UI.nav.portfolioGuide, icon: FileText },
  { href: "/recursos/roadmap-especializacion-avanzada", label: UI.nav.advancedRoadmap, icon: Route },
  { href: "/recursos/d365-tenant-readiness", label: UI.nav.d365TenantReadiness, icon: CheckSquare },
  { href: "/recursos/marco-practicas-profesionales", label: UI.nav.professionalPracticeFramework, icon: ClipboardList },
  { href: "/recursos/rpa-artefactos-profesionales", label: UI.nav.rpaArtifacts, icon: ClipboardList },
  { href: "/recursos/rpa-recursos-practica", label: UI.nav.rpaPracticeResources, icon: Bot },
  { href: "/recursos/rpa-portafolio-empleabilidad", label: UI.nav.rpaPortfolio, icon: Briefcase },
  { href: "/recursos/rpa-validacion-tenant", label: UI.nav.rpaTenantValidation, icon: CheckSquare },
];

const DOMAIN_LINKS = [
  { href: "/power-platform", label: UI.nav.powerPlatform, icon: Layers3 },
  { href: "/dynamics-365",   label: UI.nav.dynamics365,   icon: Building2 },
  { href: "/integracion",    label: UI.nav.integration,   icon: Workflow },
  { href: "/nivel/rpa",      label: "RPA",                 icon: Bot },
  { href: "/empleabilidad",  label: UI.nav.employability, icon: Briefcase },
];

const EMPLOYABILITY_LINKS = [
  { href: "/recursos/matriz-skills-laborales", label: UI.nav.laborSkillsMatrix, icon: Briefcase },
  { href: "/recursos/job-ready-crm-functional", label: UI.nav.crmFunctionalJobReady, icon: FileText },
  { href: "/recursos/job-ready-crm-developer", label: UI.nav.crmDeveloperJobReady, icon: FileText },
  { href: "/recursos/job-ready-admin-governance", label: UI.nav.adminGovernanceJobReady, icon: FileText },
  { href: "/recursos/job-ready-data-migration-legacy", label: UI.nav.dataMigrationJobReady, icon: FileText },
  { href: "/recursos/job-ready-interview-readiness", label: UI.nav.interviewJobReady, icon: FileText },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const onboarding = useOnboardingStore();
  const nextAction = getNextBestAction(completedModules, completedLabs, onboarding);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "flex flex-col w-72 border-r bg-background h-screen overflow-hidden",
          "lg:static lg:translate-x-0 lg:z-auto",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Navegación principal"
      >
        {/* Logo / brand */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0078D4]">
            <GraduationCap className="h-4.5 w-4.5 text-white" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm">Plan de Estudio</p>
            <p className="text-[10px] text-muted-foreground">Power Platform · D365</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-3">
          {/* Primary actions */}
          <NavLink href="/"          icon={Home}        label={UI.nav.home}      active={pathname === "/"} />
          <NavLink href="/mi-ruta"   icon={Compass}     label="Mi ruta"          active={pathname === "/mi-ruta"} />
          <NavLink href={nextAction.activity.href} icon={PlayCircle} label="Continuar" active={pathname === nextAction.activity.href} />
          <NavLink href="/progreso"  icon={ClipboardList} label={UI.nav.myProgress} active={pathname === "/progreso"} />
          <NavLink href="/como-usar" icon={HelpCircle}  label="Ayuda" active={pathname === "/como-usar"} />

          <Separator className="my-3" />

          <p className="px-3 text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
            Explorar
          </p>

          <NavLink href="/rutas"     icon={Route}       label={UI.nav.routes}    active={pathname.startsWith("/rutas")} />
          <NavLink href="/experiencia-practica" icon={Activity} label={UI.nav.practicalExperience} active={pathname.startsWith("/experiencia-practica")} />
          <NavLink href="/mapa"      icon={GitBranch} label="Mapa curricular" active={pathname === "/mapa"} />
          <NavLink href="/simulador" icon={PlayCircle}  label={UI.nav.simulator} active={pathname === "/simulador"} />
          <NavLink href="/labs"      icon={FlaskConical} label="Laboratorios"    active={pathname.startsWith("/labs")} />
          <NavLink href="/portafolio" icon={Briefcase}   label={UI.nav.portfolio} active={pathname === "/portafolio"} />

          <Separator className="my-3" />

          {/* Domains */}
          <p className="px-3 text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
            {UI.nav.domains}
          </p>

          {DOMAIN_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}

          <Separator className="my-3" />

          {/* Levels */}
          <p className="px-3 text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
            {UI.nav.levels}
          </p>

          <LevelGroupLabel>{UI.nav.certificationLevels}</LevelGroupLabel>
          {CERTIFICATION_LEVEL_ORDER.map((levelId) => (
            <LevelNavItem
              key={levelId}
              levelId={levelId}
              active={pathname.startsWith(`/nivel/${levelId}`)}
              completedModules={completedModules}
            />
          ))}

          <LevelGroupLabel>{UI.nav.transversalLevels}</LevelGroupLabel>
          <div className="rounded-lg border border-border/70 bg-muted/25 px-1.5 py-1">
            {TRANSVERSAL_LEVEL_ORDER.map((levelId) => (
              <LevelNavItem
                key={levelId}
                levelId={levelId}
                active={pathname.startsWith(`/nivel/${levelId}`)}
                completedModules={completedModules}
              />
            ))}
          </div>

          <Separator className="my-3" />

          <p className="px-3 text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
            {UI.nav.employability}
          </p>

          {EMPLOYABILITY_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}

          <Separator className="my-3" />

          {/* Resources */}
          <p className="px-3 text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
            {UI.nav.resources}
          </p>

          {RESOURCE_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </div>

        {/* Footer version tag */}
        <div className="px-4 py-3 border-t shrink-0">
          <p className="text-[10px] text-muted-foreground">{SIDEBAR_FOOTER_LABEL}</p>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active
          ? "bg-[#EFF6FC] dark:bg-[rgba(33,150,243,0.12)] font-medium text-[#0078D4] dark:text-[#4DB8FF]"
          : "text-foreground/80"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-0.5 rounded-r bg-[#0078D4]" aria-hidden />
      )}
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#0078D4] dark:text-[#4DB8FF]" : "text-muted-foreground")} aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function LevelGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
      {children}
    </p>
  );
}

function LevelNavItem({
  levelId,
  active,
  completedModules,
}: {
  levelId: LevelId;
  active: boolean;
  completedModules: string[];
}) {
  const cfg = LEVEL_CONFIG[levelId];
  const { completed, total, percentage } = calculateLevelProgress(levelId, completedModules);

  return (
    <div className="mb-0.5">
      <Link
        href={`/nivel/${levelId}`}
        className={cn(
          "relative flex items-center gap-2.5 overflow-hidden rounded-md px-3 py-2 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          active
            ? "bg-[#EFF6FC] font-medium dark:bg-[rgba(33,150,243,0.12)]"
            : ""
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-[60%] w-0.5 -translate-y-1/2 rounded-r bg-[#0078D4]" aria-hidden />
        )}
        <span className={cn("h-2 w-2 shrink-0 rounded-full", cfg.dot)} aria-hidden />
        <span className={cn("min-w-0 flex-1 truncate", active ? cfg.label : "")}>
          {UI.levels[levelId]}
        </span>
        <Badge
          variant={cfg.badgeVariant}
          className="h-4 max-w-[100px] shrink-0 truncate px-1.5 py-0 text-[9px]"
          title={UI.levels.cert[levelId]}
        >
          {UI.levels.navCert[levelId]}
        </Badge>
      </Link>

      <div className="px-3 pb-1.5">
        <div className="mb-0.5 flex justify-between text-[10px] text-muted-foreground">
          <span>{completed}/{total}</span>
          <span>{percentage}%</span>
        </div>
        <Progress value={percentage} className={cn("h-1", cfg.progressColor)} />
      </div>
    </div>
  );
}
