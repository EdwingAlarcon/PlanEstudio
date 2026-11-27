import { addDays, startOfLocalDay, toLocalDayKey } from "./review-date";

// Meta semanal y racha por semanas (F4 de "El camino jugable", 2026-11-27).
// Decisión del rediseño: hábito semanal elegido por el alumno (2, 3 o 4 días), no racha diaria; una semana
// marcada "de descanso" no rompe la racha ni suma. Funciones puras: el store solo guarda la meta, los días con
// actividad registrados y las semanas de descanso.

export const WEEKLY_GOAL_OPTIONS = [2, 3, 4] as const;
export type WeeklyGoal = (typeof WEEKLY_GOAL_OPTIONS)[number];
export const DEFAULT_WEEKLY_GOAL: WeeklyGoal = 3;
const MAX_STREAK_WEEKS = 104;

/** Lunes (00:00 local) de la semana de `date`. */
export function startOfWeek(date: Date): Date {
  const day = startOfLocalDay(date);
  const offset = (day.getDay() + 6) % 7; // lunes = 0
  return addDays(day, -offset);
}

/** Clave de la semana: el día del lunes, "AAAA-MM-DD". Más simple y estable que la semana ISO. */
export function weekKey(date: Date): string {
  return toLocalDayKey(startOfWeek(date));
}

export interface WeekDay {
  key: string;
  label: string;
  active: boolean;
  today: boolean;
  future: boolean;
}

const LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export function getWeekDays(activeDays: ReadonlySet<string>, today: Date): WeekDay[] {
  const monday = startOfWeek(today);
  const todayKey = toLocalDayKey(today);
  return LABELS.map((label, i) => {
    const key = toLocalDayKey(addDays(monday, i));
    return { key, label, active: activeDays.has(key), today: key === todayKey, future: key > todayKey };
  });
}

export function countDaysInWeek(activeDays: ReadonlySet<string>, monday: Date): number {
  let count = 0;
  for (let i = 0; i < 7; i++) if (activeDays.has(toLocalDayKey(addDays(monday, i)))) count++;
  return count;
}

/**
 * Semanas seguidas que cumplieron la meta. La semana en curso cuenta solo si ya la cumplió (si no, todavía
 * está a tiempo y no rompe nada). Una semana de descanso se salta sin romper ni sumar.
 */
export function getWeeklyStreak(activeDays: ReadonlySet<string>, goal: number, restWeeks: ReadonlySet<string>, today: Date): number {
  let monday = startOfWeek(today);
  let streak = 0;
  if (countDaysInWeek(activeDays, monday) >= goal) streak++;
  for (let i = 0; i < MAX_STREAK_WEEKS; i++) {
    monday = addDays(monday, -7);
    const key = toLocalDayKey(monday);
    if (restWeeks.has(key)) continue;
    if (countDaysInWeek(activeDays, monday) >= goal) streak++;
    else break;
  }
  return streak;
}

/** Días con actividad de las últimas `weeks` semanas (incluida la actual), columna por semana, de lunes a domingo. */
export function getActivityGrid(activeDays: ReadonlySet<string>, today: Date, weeks = 12): { weekKey: string; days: WeekDay[] }[] {
  const current = startOfWeek(today);
  const todayKey = toLocalDayKey(today);
  const grid: { weekKey: string; days: WeekDay[] }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const monday = addDays(current, -7 * w);
    grid.push({
      weekKey: toLocalDayKey(monday),
      days: LABELS.map((label, i) => {
        const key = toLocalDayKey(addDays(monday, i));
        return { key, label, active: activeDays.has(key), today: key === todayKey, future: key > todayKey };
      }),
    });
  }
  return grid;
}

/** Une los días registrados con la actividad que ya guardan otros stores (repaso y prácticas). */
export function mergeActivityDays(
  tracked: readonly string[],
  reviewDays: readonly string[],
  practiceEventDates: readonly string[],
): Set<string> {
  const days = new Set<string>(tracked);
  for (const day of reviewDays) days.add(day);
  for (const iso of practiceEventDates) {
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) days.add(toLocalDayKey(date));
  }
  return days;
}
