"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Filter,
  ListChecks,
  RotateCcw,
  Target,
} from "lucide-react";
import type {
  ChecklistData,
  ChecklistItem,
  ChecklistItemProgress,
  ChecklistLevel,
  ChecklistModule,
} from "@/lib/checklist";
import { getEmptyChecklistItemProgress, summarizeChecklistProgress } from "@/lib/checklist";
import { LEVEL_ORDER, UI, type LevelId } from "@/lib/i18n";
import { useProgressStore } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const LEVEL_STYLE: Record<LevelId, {
  badge: "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia";
  progress: string;
  accent: string;
}> = {
  basico: { badge: "basico", progress: "[&>div]:bg-[#107C10]", accent: "text-[#107C10] dark:text-green-400" },
  intermedio: { badge: "intermedio", progress: "[&>div]:bg-[#0078D4]", accent: "text-[#0078D4] dark:text-[#4DB8FF]" },
  avanzado: { badge: "avanzado", progress: "[&>div]:bg-orange-500", accent: "text-orange-600 dark:text-orange-400" },
  arquitecto: { badge: "arquitecto", progress: "[&>div]:bg-[#D13438]", accent: "text-[#D13438] dark:text-red-400" },
  ia: { badge: "ia", progress: "[&>div]:bg-purple-600", accent: "text-purple-600 dark:text-purple-400" },
};

const CATEGORY_STYLE: Record<string, string> = {
  Conocimiento: "border-[#0078D4]/30 bg-[#EFF6FC] text-[#005A9E] dark:bg-[rgba(0,120,212,0.14)] dark:text-[#74CAFF]",
  Práctica: "border-[#107C10]/30 bg-[#F1F8F1] text-[#0B5C0B] dark:bg-[rgba(16,124,16,0.14)] dark:text-green-300",
  Entrega: "border-orange-500/30 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
};

type ChecklistFilter = "all" | "pending" | "completed";

const FILTER_LABEL: Record<ChecklistFilter, string> = {
  all: "Todos",
  pending: "Pendientes",
  completed: "Completados",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function getLevelById(checklist: ChecklistData, levelId: LevelId): ChecklistLevel {
  return checklist.levels.find((level) => level.levelId === levelId) ?? checklist.levels[0]!;
}

function getModuleById(level: ChecklistLevel, moduleId: number): ChecklistModule {
  return level.modules.find((mod) => mod.moduleId === moduleId) ?? level.modules[0]!;
}

function summarizeItems(items: ChecklistItem[], progress: Record<string, ChecklistItemProgress>) {
  const completed = items.filter((item) => progress[item.id]?.completed).length;
  return {
    completed,
    total: items.length,
    percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
  };
}

function summarizeLevel(level: ChecklistLevel, progress: Record<string, ChecklistItemProgress>) {
  const items = level.modules.flatMap((mod) => mod.items);
  return summarizeItems(items, progress);
}

function findInitialModule(level: ChecklistLevel, progress: Record<string, ChecklistItemProgress>): number {
  const incomplete = level.modules.find((mod) => summarizeItems(mod.items, progress).percentage < 100);
  return (incomplete ?? level.modules[0])?.moduleId ?? 1;
}

interface ChecklistClientProps {
  checklist: ChecklistData;
}

export function ChecklistClient({ checklist }: ChecklistClientProps) {
  const checklistItems = useProgressStore((state) => state.checklistItems);
  const setChecklistItem = useProgressStore((state) => state.setChecklistItem);
  const resetChecklistProgress = useProgressStore((state) => state.resetChecklistProgress);
  const completedModules = useProgressStore((state) => state.completedModules);
  const completedLabs = useProgressStore((state) => state.completedLabs);

  const [activeLevelId, setActiveLevelId] = useState<LevelId>("basico");
  const [filter, setFilter] = useState<ChecklistFilter>("all");
  const activeLevel = getLevelById(checklist, activeLevelId);
  const [activeModuleId, setActiveModuleId] = useState(() => findInitialModule(activeLevel, checklistItems));

  const activeModule = getModuleById(activeLevel, activeModuleId);
  const overall = useMemo(
    () => summarizeChecklistProgress(checklist, checklistItems),
    [checklist, checklistItems],
  );
  const moduleSummary = summarizeItems(activeModule.items, checklistItems);
  const levelSummary = summarizeLevel(activeLevel, checklistItems);
  const visibleItems = activeModule.items.filter((item) => {
    const completed = checklistItems[item.id]?.completed ?? false;
    if (filter === "pending") return !completed;
    if (filter === "completed") return completed;
    return true;
  });

  const updateItem = (itemId: string, patch: Partial<ChecklistItemProgress>) => {
    setChecklistItem(itemId, patch);
  };

  const toggleItem = (item: ChecklistItem) => {
    const current = checklistItems[item.id] ?? getEmptyChecklistItemProgress();
    const completed = !current.completed;
    updateItem(item.id, {
      completed,
      completedAt: completed ? current.completedAt ?? today() : null,
    });
  };

  const changeLevel = (levelId: LevelId) => {
    const nextLevel = getLevelById(checklist, levelId);
    setActiveLevelId(levelId);
    setActiveModuleId(findInitialModule(nextLevel, checklistItems));
  };

  const goToNextPending = () => {
    const nextModule = activeLevel.modules.find((mod) =>
      mod.items.some((item) => !checklistItems[item.id]?.completed),
    );
    if (nextModule) {
      setActiveModuleId(nextModule.moduleId);
      setFilter("pending");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <header className="border-b border-border pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit gap-1.5">
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden />
              Seguimiento personal
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Checklist de Progreso
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Convierte los criterios del plan en una bitácora práctica: marca evidencias,
              registra dominio y conserva fechas en este navegador.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[360px]">
            <Metric label="Criterios" value={`${overall.completed}/${overall.total}`} />
            <Metric label="Avance" value={`${overall.percentage}%`} />
            <Metric label="Dominio" value={overall.averageMastery ? `${overall.averageMastery}/5` : "—"} />
          </div>
        </div>
        <Progress value={overall.percentage} className="mt-5 h-2 [&>div]:bg-[#0078D4]" />
        <p className="mt-2 text-xs text-muted-foreground">
          El dominio promedio considera solo criterios completados.
        </p>
      </header>

      <section aria-label="Resumen del aprendizaje" className="grid gap-3 md:grid-cols-3">
        <SummaryCard
          icon={<Target className="h-4 w-4" />}
          label="Objetivo operativo"
          value="80% por nivel"
          detail="Úsalo como puerta de avance antes de pasar al siguiente bloque."
        />
        <SummaryCard
          icon={<ListChecks className="h-4 w-4" />}
          label="Módulos completados"
          value={`${completedModules.length}/41`}
          detail="El checklist complementa el progreso general de módulos."
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Labs completados"
          value={`${completedLabs.length}/9`}
          detail="Las prácticas formales siguen su propio seguimiento."
        />
      </section>

      <section aria-label="Selector de nivel" className="flex flex-wrap gap-2">
        {LEVEL_ORDER.map((levelId) => {
          const level = getLevelById(checklist, levelId);
          const summary = summarizeLevel(level, checklistItems);
          const active = activeLevelId === levelId;
          const style = LEVEL_STYLE[levelId];

          return (
            <Button
              key={levelId}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => changeLevel(levelId)}
              className={cn(active ? "bg-[#0078D4] text-white hover:bg-[#106EBE]" : "bg-background")}
            >
              {UI.levels[levelId]}
              <span className={cn("text-xs", active ? "text-white/80" : style.accent)}>
                {summary.percentage}%
              </span>
            </Button>
          );
        })}
      </section>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-3" aria-label="Módulos del checklist">
          <div className="rounded-lg border border-border bg-card p-4 shadow-fluent-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Badge variant={LEVEL_STYLE[activeLevel.levelId].badge}>{activeLevel.title}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  {levelSummary.completed}/{levelSummary.total} criterios
                </p>
              </div>
              <span className={cn("text-2xl font-bold", LEVEL_STYLE[activeLevel.levelId].accent)}>
                {levelSummary.percentage}%
              </span>
            </div>
            <Progress value={levelSummary.percentage} className={cn("mt-4 h-2", LEVEL_STYLE[activeLevel.levelId].progress)} />
          </div>

          <div className="space-y-2">
            {activeLevel.modules.map((mod) => {
              const summary = summarizeItems(mod.items, checklistItems);
              const active = mod.moduleId === activeModule.moduleId;

              return (
                <button
                  key={mod.moduleId}
                  type="button"
                  onClick={() => setActiveModuleId(mod.moduleId)}
                  className={cn(
                    "w-full rounded-lg border bg-card px-3 py-3 text-left shadow-fluent-1 transition-colors",
                    active
                      ? "border-[#0078D4] bg-[#EFF6FC] dark:bg-[rgba(0,120,212,0.12)]"
                      : "border-border hover:border-[#0078D4]/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">
                        Módulo {mod.moduleId}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">{mod.title}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">{summary.percentage}%</span>
                  </div>
                  <Progress value={summary.percentage} className="mt-2 h-1.5 [&>div]:bg-[#0078D4]" />
                </button>
              );
            })}
          </div>
        </aside>

        <main className="rounded-lg border border-border bg-card shadow-fluent-1">
          <div className="border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground">
                  Módulo {activeModule.moduleId}
                </p>
                <h2 className="text-lg font-semibold text-foreground">{activeModule.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Marca criterios cuando tengas evidencia real. El dominio mide qué tan autónomo eres.
                </p>
              </div>
              <div className="min-w-[180px]">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{moduleSummary.completed}/{moduleSummary.total}</span>
                  <span>{moduleSummary.percentage}%</span>
                </div>
                <Progress value={moduleSummary.percentage} className="mt-1.5 h-2 [&>div]:bg-[#0078D4]" />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2" aria-label="Filtrar criterios">
                <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
                {(Object.keys(FILTER_LABEL) as ChecklistFilter[]).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    size="sm"
                    variant={filter === option ? "default" : "outline"}
                    onClick={() => setFilter(option)}
                    className={cn(
                      filter === option ? "bg-[#0078D4] text-white hover:bg-[#106EBE]" : "bg-background",
                    )}
                  >
                    {FILTER_LABEL[option]}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={goToNextPending}>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                  Siguiente pendiente
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={resetChecklistProgress}>
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Limpiar checklist
                </Button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {visibleItems.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">
                No hay criterios para este filtro.
              </div>
            ) : visibleItems.map((item) => {
              const state = checklistItems[item.id] ?? getEmptyChecklistItemProgress();
              return (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  state={state}
                  onToggle={() => toggleItem(item)}
                  onMasteryChange={(mastery) => updateItem(item.id, { mastery })}
                  onDateChange={(completedAt) => updateItem(item.id, { completedAt })}
                />
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-fluent-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-fluent-1">
      <div className="flex items-center gap-2 text-[#0078D4] dark:text-[#4DB8FF]">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function ChecklistRow({
  item,
  state,
  onToggle,
  onMasteryChange,
  onDateChange,
}: {
  item: ChecklistItem;
  state: ChecklistItemProgress;
  onToggle: () => void;
  onMasteryChange: (mastery: number | null) => void;
  onDateChange: (completedAt: string | null) => void;
}) {
  const categoryClass = CATEGORY_STYLE[item.category] ?? "border-border bg-muted text-muted-foreground";

  return (
    <div className={cn("grid gap-3 px-5 py-4 md:grid-cols-[1fr_112px_150px]", state.completed && "bg-muted/30")}>
      <label className="flex min-w-0 items-start gap-3">
        <input
          type="checkbox"
          checked={state.completed}
          onChange={onToggle}
          className="mt-1 h-4 w-4 rounded border-muted-foreground/40 text-[#0078D4] focus:ring-[#0078D4]"
        />
        <span className="min-w-0">
          <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold", categoryClass)}>
            {item.category}
          </span>
          <span className={cn("mt-1.5 block text-sm leading-relaxed", state.completed ? "text-foreground" : "text-foreground/85")}>
            {item.text}
          </span>
        </span>
      </label>

      <label className="space-y-1">
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <BarChart3 className="h-3 w-3" aria-hidden />
          Dominio
        </span>
        <select
          value={state.mastery ?? ""}
          onChange={(event) => onMasteryChange(event.target.value ? Number(event.target.value) : null)}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Dominio para ${item.text}`}
        >
          <option value="">—</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}/5</option>
          ))}
        </select>
      </label>

      <label className="space-y-1">
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <CalendarDays className="h-3 w-3" aria-hidden />
          Fecha
        </span>
        <Input
          type="date"
          value={state.completedAt ?? ""}
          onChange={(event) => onDateChange(event.target.value || null)}
          aria-label={`Fecha para ${item.text}`}
        />
      </label>
    </div>
  );
}
