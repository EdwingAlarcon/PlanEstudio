"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, CheckSquare, GraduationCap, FileText, Trophy,
  Home, PlayCircle, FlaskConical,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/progress";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEVEL_CONFIG: Record<LevelId, {
  dot: string;
  label: string;
  badgeVariant: "basico" | "intermedio" | "avanzado" | "arquitecto";
  progressColor: string;
}> = {
  basico:     { dot: "bg-[#107C10]", label: "text-[#107C10] dark:text-green-400",    badgeVariant: "basico",     progressColor: "[&>div]:bg-[#107C10]" },
  intermedio: { dot: "bg-[#0078D4]", label: "text-[#0078D4] dark:text-[#4DB8FF]",   badgeVariant: "intermedio", progressColor: "[&>div]:bg-[#0078D4]" },
  avanzado:   { dot: "bg-orange-500", label: "text-orange-600 dark:text-orange-400", badgeVariant: "avanzado",   progressColor: "[&>div]:bg-orange-500" },
  arquitecto: { dot: "bg-[#D13438]", label: "text-[#D13438] dark:text-red-400",      badgeVariant: "arquitecto", progressColor: "[&>div]:bg-[#D13438]"  },
};

const RESOURCE_LINKS = [
  { href: "/recursos/checklist",    label: UI.nav.checklist,     icon: CheckSquare },
  { href: "/recursos/glosario",     label: UI.nav.glossary,      icon: BookOpen    },
  { href: "/recursos/certificaciones", label: UI.nav.certifications, icon: Trophy  },
  { href: "/recursos/banco-preguntas", label: UI.nav.questionBank,   icon: FileText },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);

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
          "flex flex-col w-64 border-r bg-background h-screen",
          "lg:static lg:translate-x-0 lg:z-auto",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Navegación principal"
      >
        {/* Logo / brand */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0078D4]">
            <GraduationCap className="h-4.5 w-4.5 text-white" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm">Plan de Estudio</p>
            <p className="text-[10px] text-muted-foreground">Power Platform · D365</p>
          </div>
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          {/* Primary actions */}
          <NavLink href="/"          icon={Home}        label={UI.nav.home}      active={pathname === "/"} />
          <NavLink href="/simulador" icon={PlayCircle}  label={UI.nav.simulator} active={pathname === "/simulador"} />
          <NavLink href="/labs"      icon={FlaskConical} label="Laboratorios"    active={pathname.startsWith("/labs")} />

          <Separator className="my-3" />

          {/* Levels */}
          <p className="px-3 text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
            {UI.nav.levels}
          </p>

          {LEVEL_ORDER.map((levelId) => {
            const cfg = LEVEL_CONFIG[levelId];
            const { completed, total, percentage } = getLevelProgress(levelId);
            const isActive = pathname.startsWith(`/nivel/${levelId}`);

            return (
              <div key={levelId} className="mb-0.5">
                <Link
                  href={`/nivel/${levelId}`}
                  className={cn(
                    "relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-[#EFF6FC] dark:bg-[rgba(33,150,243,0.12)] font-medium"
                      : ""
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-0.5 rounded-r bg-[#0078D4]" aria-hidden />
                  )}
                  <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} aria-hidden />
                  <span className={cn("flex-1 truncate", isActive ? cfg.label : "")}>
                    {UI.levels[levelId]}
                  </span>
                  <Badge variant={cfg.badgeVariant} className="text-[9px] px-1.5 py-0 h-4">
                    {UI.levels.cert[levelId]}
                  </Badge>
                </Link>

                {/* Mini progress bar */}
                <div className="px-3 pb-1.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                    <span>{completed}/{total}</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} className={cn("h-1", cfg.progressColor)} />
                </div>
              </div>
            );
          })}

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
        </ScrollArea>

        {/* Footer version tag */}
        <div className="px-4 py-3 border-t">
          <p className="text-[10px] text-muted-foreground">PL-900 → PL-600 · 41 módulos</p>
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
