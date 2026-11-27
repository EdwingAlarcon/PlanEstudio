"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Coffee, Flame } from "lucide-react";
import { useHabitStore } from "@/lib/habit-store";
import { useReviewStore } from "@/lib/review-store";
import { useInteractivePracticeProgressStore } from "@/lib/interactive-practice-progress";
import { getActivityGrid, getWeekDays, getWeeklyStreak, mergeActivityDays, weekKey, WEEKLY_GOAL_OPTIONS, type WeeklyGoal } from "@/lib/habit";
import { getRetentionSummary } from "@/lib/review-queue";
import { getReviewNow } from "@/lib/review-date";
import { useNextBestAction } from "@/components/guided/use-next-best-action";
import { cn } from "@/lib/utils";

/** Días con actividad: los registrados más los que ya guardan el repaso y las prácticas interactivas. */
export function useActivityDays(): Set<string> {
  const tracked = useHabitStore((s) => s.activeDays);
  const dayLogs = useReviewStore((s) => s.dayLogs);
  const records = useInteractivePracticeProgressStore((s) => s.records);
  return useMemo(() => {
    const practiceDates = Object.values(records).flatMap((r) =>
      (r.events ?? []).filter((e) => e.type === "attempted" || e.type === "completed").map((e) => e.at),
    );
    return mergeActivityDays(tracked, (dayLogs ?? []).filter((d) => d.reviewed > 0).map((d) => d.day), practiceDates);
  }, [tracked, dayLogs, records]);
}

/** "Hoy" solo en el cliente: el HTML estático no sabe en qué día lo abres. */
function useToday(): Date | null {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return today;
}

export function WeeklyGoalCard() {
  const goal = useHabitStore((s) => s.weeklyGoal);
  const restWeeks = useHabitStore((s) => s.restWeeks);
  const setWeeklyGoal = useHabitStore((s) => s.setWeeklyGoal);
  const toggleRestWeek = useHabitStore((s) => s.toggleRestWeek);
  const activeDays = useActivityDays();
  const today = useToday();

  if (!today) return <section className="h-48 rounded-xl border border-border bg-card" aria-hidden />;

  const days = getWeekDays(activeDays, today);
  const thisWeek = weekKey(today);
  const done = days.filter((d) => d.active).length;
  const isRest = restWeeks.includes(thisWeek);
  const streak = getWeeklyStreak(activeDays, goal, new Set(restWeeks), today);

  return (
    <section aria-labelledby="weekly-goal-heading" className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-fluent-1" data-testid="weekly-goal">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="weekly-goal-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta de la semana</h2>
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="sr-only">Días por semana</span>
          <select
            id="weekly-goal-select"
            value={goal}
            onChange={(e) => setWeeklyGoal(Number(e.target.value) as WeeklyGoal)}
            className="rounded border border-border bg-background px-1 py-0.5 text-xs"
          >
            {WEEKLY_GOAL_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} días</option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-2xl font-bold tabular-nums text-foreground" data-testid="weekly-goal-count">
        {isRest ? "Semana de descanso" : `${Math.min(done, 7)} / ${goal} días`}
      </p>
      <ol className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted-foreground" aria-label="Días de esta semana">
        {days.map((d) => (
          <li key={d.key}>
            <span
              className={cn(
                "mb-1 block h-6 rounded-md",
                d.active ? "bg-[#107C10]" : "bg-muted",
                d.today && "ring-2 ring-[#0078D4] ring-offset-1 ring-offset-card dark:ring-[#4DB8FF]",
              )}
              aria-label={`${d.label}${d.active ? ": con actividad" : ""}`}
            />
            {d.label}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1 text-muted-foreground" data-testid="weekly-streak">
          <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden />
          Racha: {streak} {streak === 1 ? "semana" : "semanas"}
        </span>
        <button type="button" onClick={() => toggleRestWeek(thisWeek)} className="inline-flex items-center gap-1 text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
          <Coffee className="h-3.5 w-3.5" aria-hidden />
          {isRest ? "Quitar descanso" : "Semana de descanso"}
        </button>
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Cuenta un día cuando haces algo: una práctica, un quiz, un lab, un paso o el repaso. Una semana de descanso no rompe la racha.
      </p>
    </section>
  );
}

export function TodayCard() {
  const next = useNextBestAction();
  const cards = useReviewStore((s) => s.cards);
  const [due, setDue] = useState(0);
  useEffect(() => setDue(getRetentionSummary(cards, getReviewNow()).dueToday), [cards]);
  const reviewMinutes = Math.max(1, Math.round(due * 0.4));

  return (
    <section aria-labelledby="today-heading" className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-fluent-1" data-testid="today-card">
      <h2 id="today-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hoy, en 15 minutos</h2>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href={next.activity.href} className="group flex items-start justify-between gap-2 hover:text-[#0078D4] dark:hover:text-[#4DB8FF]">
            <span className="min-w-0">
              <span className="block truncate font-medium text-foreground group-hover:text-inherit">{next.activity.title}</span>
              <span className="block text-xs text-muted-foreground">Tu siguiente paso</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{next.time}</span>
          </Link>
        </li>
        {due > 0 && (
          <li>
            <Link href="/repaso" className="group flex items-start justify-between gap-2 hover:text-[#0078D4] dark:hover:text-[#4DB8FF]">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 shrink-0 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
                <span className="truncate font-medium text-foreground group-hover:text-inherit">Repaso: {due} pregunta{due === 1 ? "" : "s"}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">~{reviewMinutes} min</span>
            </Link>
          </li>
        )}
        <li className="flex items-start justify-between gap-2 text-muted-foreground">
          <span className="min-w-0 text-xs">Al terminar en tu ambiente, exporta tu solución (copia de seguridad del Trial).</span>
          <Link href="/recursos/entornos-y-trials" className="inline-flex shrink-0 items-center text-xs text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
            Cómo <ArrowRight className="ml-0.5 h-3 w-3" aria-hidden />
          </Link>
        </li>
      </ul>
    </section>
  );
}

/** Cuadrícula de actividad de las últimas 12 semanas, para "Mi progreso". */
export function ActivityGrid() {
  const activeDays = useActivityDays();
  const today = useToday();
  if (!today) return <div className="h-28" aria-hidden />;
  const grid = getActivityGrid(activeDays, today, 12);
  const total = grid.reduce((n, w) => n + w.days.filter((d) => d.active).length, 0);
  return (
    <div className="space-y-2" data-testid="activity-grid">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold tabular-nums text-foreground">{total}</span> días con actividad en las últimas 12 semanas
      </p>
      <div className="flex gap-1 overflow-x-auto" role="img" aria-label={`${total} días con actividad en las últimas 12 semanas`}>
        {grid.map((w) => (
          <div key={w.weekKey} className="grid grid-rows-7 gap-1">
            {w.days.map((d) => (
              <span
                key={d.key}
                title={d.key}
                className={cn("h-3 w-3 rounded-sm", d.future ? "bg-transparent" : d.active ? "bg-[#107C10]" : "bg-muted", d.today && "ring-1 ring-[#0078D4]")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
