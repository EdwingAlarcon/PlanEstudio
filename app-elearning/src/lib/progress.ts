"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LevelId } from "./i18n";
import { LEVEL_MODULE_RANGE } from "./i18n";
import type { ChecklistItemProgress, ChecklistProgressMap } from "./checklist";
import { getEmptyChecklistItemProgress } from "./checklist";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressState {
  completedModules: string[];          // module ids like "basico-1"
  quizScores: Record<string, number>;  // moduleId string → percentage (0-100)
  completedLabs: string[];             // lab slugs like "lab-02-dataverse-modelo-datos"
  checklistItems: ChecklistProgressMap; // checklist criterion id → state
  lastVisited: string | null;          // last module id visited
  userName: string | null;             // user name for certificate
}

export interface ProgressActions {
  markModuleComplete: (moduleId: string) => void;
  markModuleIncomplete: (moduleId: string) => void;
  toggleModuleComplete: (moduleId: string) => void;
  isModuleComplete: (moduleId: string) => boolean;
  saveQuizScore: (moduleId: string, percentage: number) => void;
  getQuizScore: (moduleId: string) => number | null;
  setLastVisited: (moduleId: string) => void;
  setUserName: (name: string) => void;
  getLevelProgress: (levelId: LevelId) => { completed: number; total: number; percentage: number };
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  // Labs
  markLabComplete: (slug: string) => void;
  markLabIncomplete: (slug: string) => void;
  toggleLabComplete: (slug: string) => void;
  isLabComplete: (slug: string) => boolean;
  setChecklistItem: (itemId: string, patch: Partial<ChecklistItemProgress>) => void;
  getChecklistItem: (itemId: string) => ChecklistItemProgress;
  resetChecklistProgress: () => void;
  resetProgress: () => void;
}

const INITIAL_STATE: ProgressState = {
  completedModules: [],
  quizScores: {},
  completedLabs: [],
  checklistItems: {},
  lastVisited: null,
  userName: null,
};

// ─── Module counts per level ──────────────────────────────────────────────────

function getTotalModulesForLevel(levelId: LevelId): number {
  const [start, end] = LEVEL_MODULE_RANGE[levelId];
  return end - start + 1;
}

// ─── Pure progress calculations ───────────────────────────────────────────────
// Exported so components can derive progress directly from a selected
// `completedModules` array (which changes reference on every mutation).
// Selecting a store *method* instead (e.g. `s.getLevelProgress`) would not
// trigger a re-render on its own, since that function reference never changes.

export function calculateLevelProgress(
  levelId: LevelId,
  completedModules: string[]
): { completed: number; total: number; percentage: number } {
  const [start, end] = LEVEL_MODULE_RANGE[levelId];
  const total = getTotalModulesForLevel(levelId);
  const prefix = `${levelId}-`;
  const completed = completedModules.filter((id) => {
    if (!id.startsWith(prefix)) return false;
    const moduleNum = parseInt(id.slice(prefix.length), 10);
    return moduleNum >= start && moduleNum <= end;
  }).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function calculateOverallProgress(
  completedModules: string[]
): { completed: number; total: number; percentage: number } {
  const total = (Object.keys(LEVEL_MODULE_RANGE) as LevelId[]).reduce(
    (sum, levelId) => sum + getTotalModulesForLevel(levelId),
    0
  );
  const completed = completedModules.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
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

      setUserName: (name) => set({ userName: name }),

      getLevelProgress: (levelId) => calculateLevelProgress(levelId, get().completedModules),

      getOverallProgress: () => calculateOverallProgress(get().completedModules),

      // ── Labs ────────────────────────────────────────────────────────────────

      markLabComplete: (slug) =>
        set((state) => ({
          completedLabs: state.completedLabs.includes(slug)
            ? state.completedLabs
            : [...state.completedLabs, slug],
        })),

      markLabIncomplete: (slug) =>
        set((state) => ({
          completedLabs: state.completedLabs.filter((s) => s !== slug),
        })),

      toggleLabComplete: (slug) => {
        const { completedLabs } = get();
        if (completedLabs.includes(slug)) {
          get().markLabIncomplete(slug);
        } else {
          get().markLabComplete(slug);
        }
      },

      isLabComplete: (slug) => get().completedLabs.includes(slug),

      // ── Checklist ───────────────────────────────────────────────────────────

      setChecklistItem: (itemId, patch) =>
        set((state) => {
          const previous = state.checklistItems[itemId] ?? getEmptyChecklistItemProgress();
          return {
            checklistItems: {
              ...state.checklistItems,
              [itemId]: {
                ...previous,
                ...patch,
              },
            },
          };
        }),

      getChecklistItem: (itemId) => get().checklistItems[itemId] ?? getEmptyChecklistItemProgress(),

      resetChecklistProgress: () => set({ checklistItems: {} }),

      resetProgress: () => set(INITIAL_STATE),
    }),
    {
      name: "plan-estudio-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
