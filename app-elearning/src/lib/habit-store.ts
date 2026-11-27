"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_WEEKLY_GOAL, WEEKLY_GOAL_OPTIONS, type WeeklyGoal } from "./habit";

// Store del hábito (F4 de "El camino jugable"). Independiente de los demás, como manda CLAUDE.md:
// no se fusiona con ninguno y el backup completo lo guarda como un payload más.
export const HABIT_STORAGE_KEY = "planestudio.habit.v1";
const MAX_DAYS = 400;

export interface HabitState {
  schemaVersion: 1;
  weeklyGoal: WeeklyGoal;
  /** Días con actividad registrados en este navegador, "AAAA-MM-DD" local. */
  activeDays: string[];
  /** Lunes ("AAAA-MM-DD") de las semanas marcadas como de descanso. */
  restWeeks: string[];
}

interface HabitActions {
  recordActivity: (dayKey: string) => void;
  setWeeklyGoal: (goal: WeeklyGoal) => void;
  toggleRestWeek: (weekKey: string) => void;
  resetHabit: () => void;
}

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;
export const INITIAL_HABIT_STATE: HabitState = { schemaVersion: 1, weeklyGoal: DEFAULT_WEEKLY_GOAL, activeDays: [], restWeeks: [] };

export function sanitizeHabitState(value: unknown): HabitState {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const days = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((d): d is string => typeof d === "string" && DAY_KEY.test(d)))].sort() : []);
  const goal = (WEEKLY_GOAL_OPTIONS as readonly number[]).includes(raw.weeklyGoal as number) ? (raw.weeklyGoal as WeeklyGoal) : DEFAULT_WEEKLY_GOAL;
  return { schemaVersion: 1, weeklyGoal: goal, activeDays: days(raw.activeDays).slice(-MAX_DAYS), restWeeks: days(raw.restWeeks) };
}

export const useHabitStore = create<HabitState & HabitActions>()(
  persist(
    (set) => ({
      ...INITIAL_HABIT_STATE,
      recordActivity: (dayKey) =>
        set((state) => (!DAY_KEY.test(dayKey) || state.activeDays.includes(dayKey) ? {} : { activeDays: [...state.activeDays, dayKey].sort().slice(-MAX_DAYS) })),
      setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),
      toggleRestWeek: (weekKey) =>
        set((state) => ({
          restWeeks: state.restWeeks.includes(weekKey) ? state.restWeeks.filter((w) => w !== weekKey) : [...state.restWeeks, weekKey].sort(),
        })),
      resetHabit: () => set(INITIAL_HABIT_STATE),
    }),
    {
      name: HABIT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted) => sanitizeHabitState(persisted),
      merge: (persisted, current) => ({ ...current, ...sanitizeHabitState(persisted) }),
    },
  ),
);
