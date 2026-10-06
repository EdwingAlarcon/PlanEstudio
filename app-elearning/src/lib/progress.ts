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
  moduleNotes: Record<string, string>; // module id ("basico-1") → personal note
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
  setModuleNote: (moduleId: string, note: string) => void;
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
  moduleNotes: {},
};

// ─── Persisted-state sanitization ─────────────────────────────────────────────
// Guards against corrupted or future-shaped localStorage payloads the same way
// the other 5 persisted stores in this app already do (see onboarding-store.ts).

function sanitizeProgressState(persisted: unknown): ProgressState {
  const raw = persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};

  const completedModules = Array.isArray(raw.completedModules)
    ? raw.completedModules.filter((id): id is string => typeof id === "string")
    : INITIAL_STATE.completedModules;

  const quizScores =
    raw.quizScores && typeof raw.quizScores === "object" && !Array.isArray(raw.quizScores)
      ? Object.fromEntries(
          Object.entries(raw.quizScores as Record<string, unknown>).filter(
            (entry): entry is [string, number] => typeof entry[1] === "number"
          )
        )
      : INITIAL_STATE.quizScores;

  const completedLabs = Array.isArray(raw.completedLabs)
    ? raw.completedLabs.filter((slug): slug is string => typeof slug === "string")
    : INITIAL_STATE.completedLabs;

  const checklistItems =
    raw.checklistItems && typeof raw.checklistItems === "object" && !Array.isArray(raw.checklistItems)
      ? (raw.checklistItems as ChecklistProgressMap)
      : INITIAL_STATE.checklistItems;

  const lastVisited = typeof raw.lastVisited === "string" ? raw.lastVisited : INITIAL_STATE.lastVisited;

  const userName = typeof raw.userName === "string" ? raw.userName : INITIAL_STATE.userName;

  const moduleNotes =
    raw.moduleNotes && typeof raw.moduleNotes === "object" && !Array.isArray(raw.moduleNotes)
      ? Object.fromEntries(
          Object.entries(raw.moduleNotes as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string"
          )
        )
      : INITIAL_STATE.moduleNotes;

  return {
    completedModules,
    quizScores,
    completedLabs,
    checklistItems,
    lastVisited,
    userName,
    moduleNotes,
  };
}

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

export interface LevelQuizReadiness {
  attempted: number;
  total: number;
  average: number; // 0-100, average over attempted modules only
  ready: boolean;  // every module in the level has a quiz score >= 70%
}

const QUIZ_PASS_THRESHOLD = 70;

export function calculateLevelQuizReadiness(
  levelId: LevelId,
  quizScores: Record<string, number>
): LevelQuizReadiness {
  const [start, end] = LEVEL_MODULE_RANGE[levelId];
  const total = end - start + 1;
  const scores: number[] = [];
  for (let moduleId = start; moduleId <= end; moduleId++) {
    const score = quizScores[String(moduleId)];
    if (typeof score === "number") scores.push(score);
  }
  const attempted = scores.length;
  const average = attempted > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / attempted) : 0;
  const ready = attempted === total && scores.every((score) => score >= QUIZ_PASS_THRESHOLD);
  return { attempted, total, average, ready };
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

      setModuleNote: (moduleId, note) =>
        set((state) => {
          const { [moduleId]: _removed, ...rest } = state.moduleNotes ?? {};
          void _removed;
          return { moduleNotes: note.trim() ? { ...rest, [moduleId]: note } : rest };
        }),

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
      version: 1,
      migrate: (persisted) => sanitizeProgressState(persisted),
    }
  )
);
