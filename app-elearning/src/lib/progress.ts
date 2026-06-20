"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LevelId } from "./i18n";
import { LEVEL_MODULE_RANGE } from "./i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressState {
  completedModules: string[];          // module ids like "basico-1"
  quizScores: Record<string, number>;  // moduleId string → percentage (0-100)
  lastVisited: string | null;          // last module id visited
}

export interface ProgressActions {
  markModuleComplete: (moduleId: string) => void;
  markModuleIncomplete: (moduleId: string) => void;
  toggleModuleComplete: (moduleId: string) => void;
  isModuleComplete: (moduleId: string) => boolean;
  saveQuizScore: (moduleId: string, percentage: number) => void;
  getQuizScore: (moduleId: string) => number | null;
  setLastVisited: (moduleId: string) => void;
  getLevelProgress: (levelId: LevelId) => { completed: number; total: number; percentage: number };
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  resetProgress: () => void;
}

const INITIAL_STATE: ProgressState = {
  completedModules: [],
  quizScores: {},
  lastVisited: null,
};

// ─── Module counts per level ──────────────────────────────────────────────────

function getTotalModulesForLevel(levelId: LevelId): number {
  const [start, end] = LEVEL_MODULE_RANGE[levelId];
  return end - start + 1;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      markModuleComplete: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        })),

      markModuleIncomplete: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.filter((id) => id !== moduleId),
        })),

      toggleModuleComplete: (moduleId) => {
        const { completedModules } = get();
        if (completedModules.includes(moduleId)) {
          get().markModuleIncomplete(moduleId);
        } else {
          get().markModuleComplete(moduleId);
        }
      },

      isModuleComplete: (moduleId) => get().completedModules.includes(moduleId),

      saveQuizScore: (moduleId, percentage) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [moduleId]: percentage },
        })),

      getQuizScore: (moduleId) => get().quizScores[moduleId] ?? null,

      setLastVisited: (moduleId) => set({ lastVisited: moduleId }),

      getLevelProgress: (levelId) => {
        const [start, end] = LEVEL_MODULE_RANGE[levelId];
        const total = getTotalModulesForLevel(levelId);
        const completed = get().completedModules.filter((id) => {
          // id format: "basico-1", "intermedio-9", etc.
          const moduleNum = parseInt(id.split("-").pop() ?? "0", 10);
          return moduleNum >= start && moduleNum <= end;
        }).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
      },

      getOverallProgress: () => {
        const total = 41;
        const completed = get().completedModules.length;
        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
      },

      resetProgress: () => set(INITIAL_STATE),
    }),
    {
      name: "plan-estudio-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
