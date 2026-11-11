"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap, Home, PlayCircle, FlaskConical, Route, HelpCircle, Briefcase, ClipboardList, Activity,
  Compass, GitBranch, Wrench, BrainCircuit, Brain, Library, ChevronRight, ArrowRight,
} from "lucide-react";
import { useProgressStore, calculateLevelProgress } from "@/lib/progress";
import { useNextBestAction } from "@/components/guided/use-next-best-action";
import { CERTIFICATION_LEVEL_ORDER, TRANSVERSAL_LEVEL_ORDER, UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Barra lateral reorganizada el 2026-11-11 (antes: 50 enlaces en 6 secciones).
// Principio: arriba lo que el alumno hace hoy (siguiente paso, su plan y su progreso); en medio el
// temario como un recorrido; abajo, plegado, lo que se consulta de vez en cuando. Los recursos y las
// guías de empleabilidad viven en /recursos, agrupados, en lugar de listarse aquí uno por uno.

const LEVEL_DOT: Record<LevelId, string> = {
  basico: "bg-[#107C10]",
  intermedio: "bg-[#0078D4]",
  avanzado: "bg-orange-500",
  arquitecto: "bg-[#D13438]",
  ia: "bg-purple-600",
  d365: "bg-teal-600",
  rpa: "bg-[#6B4EFF]",
};

// Nombres cortos para que quepan en la barra; el nombre completo va en el title del enlace.
const SHORT_LEVEL_LABEL: Partial<Record<LevelId, string>> = {
  ia: "Desarrollo con IA",
  d365: "Dynamics 365",
  rpa: "RPA · Power Automate Desktop",
};

const PRACTICE_LINKS = [
  { href: "/labs", label: "Laboratorios", icon: FlaskConical, match: "/labs" },
  { href: "/practica", label: UI.nav.interactivePractice, icon: BrainCircuit, match: "/practica" },
  { href: "/repaso", label: UI.nav.review, icon: Brain, match: "/repaso" },
  { href: "/experiencia-practica", label: UI.nav.practicalExperience, icon: Activity, match: "/experiencia-practica" },
  { href: "/simulador", label: UI.nav.simulator, icon: PlayCircle, match: "/simulador" },
];

const EXPLORE_LINKS = [
  { href: "/preparar-entorno", label: UI.nav.prepareEnvironment, icon: Wrench, match: "/preparar-entorno" },
  { href: "/rutas", label: UI.nav.routes, icon: Route, match: "/rutas" },
  { href: "/mapa", label: "Mapa curricular", icon: GitBranch, match: "/mapa" },
  { href: "/recursos", label: UI.nav.resources, icon: Library, match: "/recursos" },
  { href: "/empleabilidad", label: UI.nav.employability, icon: Briefcase, match: "/empleabilidad" },
  { href: "/portafolio", label: UI.nav.portfolio, icon: Briefcase, match: "/portafolio" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const completedModules = useProgressStore((s) => s.completedModules);
  const nextAction = useNextBestAction();
  const isActive = (match: string) => pathname === match || pathname.startsWith(`${match}/`);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "flex flex-col w-64 border-r bg-background h-screen overflow-hidden",
          "lg:static lg:translate-x-0 lg:z-auto",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Navegación principal"
      >
        <Link href="/" prefetch={false} className="flex items-center gap-2.5 px-4 py-4 border-b shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0078D4]">
            <GraduationCap className="h-4.5 w-4.5 text-white" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm">Plan de Estudio</p>
            <p className="text-[10px] text-muted-foreground">Power Platform · D365</p>
          </div>
        </Link>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4">
          {/* Siguiente paso: la única acción destacada de la barra */}
          <Link
            href={nextAction.activity.href}
            className="mx-1 flex items-center gap-2 rounded-lg bg-[#0078D4] px-3 py-2.5 text-sm text-white transition-colors hover:bg-[#106EBE]"
            data-testid="sidebar-next-step"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase tracking-wider text-white/80">Siguiente paso</span>
              <span className="block truncate font-medium">{nextAction.activity.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>

          <nav aria-label="Principal" className="space-y-0.5">
            <NavLink href="/" icon={Home} label={UI.nav.home} active={pathname === "/"} prefetch={false} />
            <NavLink href="/mi-ruta" icon={Compass} label="Mi ruta" active={pathname === "/mi-ruta"} />
            <NavLink href="/progreso" icon={ClipboardList} label={UI.nav.myProgress} active={pathname === "/progreso"} />
          </nav>

          <section aria-labelledby="nav-temario">
            <SectionLabel id="nav-temario">Temario</SectionLabel>
            {CERTIFICATION_LEVEL_ORDER.map((levelId, index) => (
              <LevelNavItem
                key={levelId}
                levelId={levelId}
                step={index + 1}
                active={pathname.startsWith(`/nivel/${levelId}`)}
                completedModules={completedModules}
              />
            ))}
            <p className="px-3 pb-1 pt-3 text-[10px] text-muted-foreground">
              Especializaciones · en cualquier momento
            </p>
            {TRANSVERSAL_LEVEL_ORDER.map((levelId) => (
              <LevelNavItem
                key={levelId}
                levelId={levelId}
                active={pathname.startsWith(`/nivel/${levelId}`)}
                completedModules={completedModules}
              />
            ))}
          </section>

          <NavGroup id="practicar" label="Practicar" defaultOpen={PRACTICE_LINKS.some((l) => isActive(l.match))}>
            {PRACTICE_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} icon={link.icon} label={link.label} active={isActive(link.match)} />
            ))}
          </NavGroup>

          <NavGroup id="explorar" label="Explorar" defaultOpen={EXPLORE_LINKS.some((l) => isActive(l.match))}>
            {EXPLORE_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} icon={link.icon} label={link.label} active={isActive(link.match)} />
            ))}
          </NavGroup>
        </div>

        <div className="px-2 py-2 border-t shrink-0">
          <NavLink href="/como-usar" icon={HelpCircle} label="Ayuda" active={pathname === "/como-usar"} />
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="px-3 mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
      {children}
    </p>
  );
}

function NavGroup({ id, label, defaultOpen, children }: { id: string; label: string; defaultOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={`nav-group-${id}`}
        className="flex w-full items-center gap-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} aria-hidden />
        {label}
      </button>
      {open && (
        <div id={`nav-group-${id}`} className="mt-0.5 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  prefetch,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  prefetch?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active
          ? "bg-[#EFF6FC] dark:bg-[rgba(33,150,243,0.12)] font-medium text-[#0078D4] dark:text-[#4DB8FF]"
          : "text-foreground/80"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#0078D4] dark:text-[#4DB8FF]" : "text-muted-foreground")} aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function LevelNavItem({
  levelId,
  step,
  active,
  completedModules,
}: {
  levelId: LevelId;
  step?: number;
  active: boolean;
  completedModules: string[];
}) {
  const { completed, total, percentage } = calculateLevelProgress(levelId, completedModules);
  const done = total > 0 && completed === total;

  return (
    <Link
      href={`/nivel/${levelId}`}
      aria-current={active ? "page" : undefined}
      title={`${UI.levels[levelId]} · ${UI.levels.cert[levelId]} · ${completed} de ${total} módulos (${percentage}%)`}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
        active ? "bg-[#EFF6FC] font-medium dark:bg-[rgba(33,150,243,0.12)]" : "text-foreground/80"
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", LEVEL_DOT[levelId])} aria-hidden />
      <span className="min-w-0 flex-1 truncate">
        {step ? `${step}. ` : ""}{SHORT_LEVEL_LABEL[levelId] ?? UI.levels[levelId]}
      </span>
      <span className={cn("shrink-0 text-[11px] tabular-nums", done ? "text-[#107C10] font-medium" : "text-muted-foreground")}>
        {completed}/{total}
      </span>
    </Link>
  );
}
