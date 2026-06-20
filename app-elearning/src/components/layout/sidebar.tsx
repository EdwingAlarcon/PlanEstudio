"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CheckSquare, GraduationCap, FileText, Trophy, Home, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/progress";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEVEL_CONFIG: Record<LevelId, { emoji: string; color: string; badgeVariant: "basico" | "intermedio" | "avanzado" | "arquitecto" }> = {
  basico: { emoji: "🟢", color: "text-green-600 dark:text-green-400", badgeVariant: "basico" },
  intermedio: { emoji: "🔵", color: "text-blue-600 dark:text-blue-400", badgeVariant: "intermedio" },
  avanzado: { emoji: "🟠", color: "text-orange-600 dark:text-orange-400", badgeVariant: "avanzado" },
  arquitecto: { emoji: "🔴", color: "text-red-600 dark:text-red-400", badgeVariant: "arquitecto" },
};

const RESOURCE_LINKS = [
  { href: "/recursos/checklist", label: UI.nav.checklist, icon: CheckSquare },
  { href: "/recursos/glosario", label: UI.nav.glossary, icon: BookOpen },
  { href: "/recursos/certificaciones", label: UI.nav.certifications, icon: Trophy },
  { href: "/recursos/banco-preguntas", label: UI.nav.questionBank, icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);

  return (
    <aside
      className="hidden lg:flex flex-col w-64 border-r bg-background h-screen sticky top-0"
      aria-label="Navegación principal"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <GraduationCap className="h-6 w-6 text-primary" aria-hidden />
        <span className="font-semibold text-sm leading-tight">Power Platform<br />Plan de Estudio</span>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        {/* Home */}
        <NavLink href="/" icon={Home} label={UI.nav.home} active={pathname === "/"} />

        {/* Simulator */}
        <NavLink
          href="/simulador"
          icon={PlayCircle}
          label={UI.nav.simulator}
          active={pathname === "/simulador"}
        />

        <Separator className="my-3" />

        {/* Levels */}
        <p className="px-2 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          {UI.nav.levels}
        </p>

        {LEVEL_ORDER.map((levelId) => {
          const cfg = LEVEL_CONFIG[levelId];
          const { completed, total, percentage } = getLevelProgress(levelId);
          const isActive = pathname.startsWith(`/nivel/${levelId}`);

          return (
            <div key={levelId} className="mb-1">
              <Link
                href={`/nivel/${levelId}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )}
              >
                <span aria-hidden>{cfg.emoji}</span>
                <span className={cn("flex-1 truncate", cfg.color)}>
                  {UI.levels[levelId]}
                </span>
                <Badge variant={cfg.badgeVariant} className="text-[10px] px-1.5 py-0">
                  {UI.levels.cert[levelId]}
                </Badge>
              </Link>

              {/* Mini progress bar under each level */}
              <div className="px-2 pb-1">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                  <span>{completed}/{total}</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-1" />
              </div>
            </div>
          );
        })}

        <Separator className="my-3" />

        {/* Resources */}
        <p className="px-2 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
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
    </aside>
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
        "flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground font-medium"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}
