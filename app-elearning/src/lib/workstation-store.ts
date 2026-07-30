"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ESSENTIAL_SETUP_STEPS, type OperatingSystem, type ToolStatus, type WorkstationProfile } from "./workstation";
import type { WorkstationReportEntry } from "./workstation-report";

export const WORKSTATION_STORAGE_KEY = "planestudio.workstation.v1";
export const WORKSTATION_SCHEMA_VERSION = 1;

const VALID_STATUSES: ToolStatus[] = ["unknown", "not_required", "not_installed", "installed", "verified", "outdated", "blocked"];
const VALID_PROFILES: WorkstationProfile[] = ["maker", "functional", "developer", "admin", "architect", "rpa"];
const VALID_OS: OperatingSystem[] = ["windows", "macos", "linux"];

export interface WorkstationToolState {
  status: ToolStatus;
  detectedVersion?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface WorkstationProgressState {
  schemaVersion: number;
  profileOverride: WorkstationProfile | null;
  os: OperatingSystem | null;
  hasTenant: boolean | null;
  toolStates: Record<string, WorkstationToolState>;
  essentialSteps: Record<string, boolean>;
}

interface WorkstationActions {
  setProfileOverride: (profile: WorkstationProfile | null) => void;
  setOs: (os: OperatingSystem | null) => void;
  setTenant: (hasTenant: boolean | null) => void;
  markTool: (toolId: string, status: ToolStatus) => void;
  setToolNotes: (toolId: string, notes: string) => void;
  toggleEssentialStep: (stepId: string, done: boolean) => void;
  applyWorkstationReport: (entries: WorkstationReportEntry[]) => void;
  resetWorkstation: () => void;
}

const INITIAL_STATE: WorkstationProgressState = {
  schemaVersion: WORKSTATION_SCHEMA_VERSION,
  profileOverride: null,
  os: null,
  hasTenant: null,
  toolStates: {},
  essentialSteps: {},
};

function nowIso(): string {
  return new Date().toISOString();
}

function sanitizeToolState(value: unknown): WorkstationToolState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const status = typeof raw.status === "string" && (VALID_STATUSES as string[]).includes(raw.status) ? raw.status as ToolStatus : "unknown";
  return {
    status,
    detectedVersion: typeof raw.detectedVersion === "string" ? raw.detectedVersion.slice(0, 60) : undefined,
    verifiedAt: typeof raw.verifiedAt === "string" ? raw.verifiedAt : undefined,
    notes: typeof raw.notes === "string" ? raw.notes.slice(0, 500) : undefined,
  };
}

export function sanitizeWorkstationState(value: unknown): WorkstationProgressState {
  if (!value || typeof value !== "object") return INITIAL_STATE;
  const raw = value as Record<string, unknown>;

  const profileOverride = typeof raw.profileOverride === "string" && (VALID_PROFILES as string[]).includes(raw.profileOverride)
    ? raw.profileOverride as WorkstationProfile
    : null;
  const os = typeof raw.os === "string" && (VALID_OS as string[]).includes(raw.os) ? raw.os as OperatingSystem : null;
  const hasTenant = typeof raw.hasTenant === "boolean" ? raw.hasTenant : null;

  const toolStates: Record<string, WorkstationToolState> = {};
  if (raw.toolStates && typeof raw.toolStates === "object") {
    for (const [toolId, stateValue] of Object.entries(raw.toolStates as Record<string, unknown>)) {
      const sanitized = sanitizeToolState(stateValue);
      if (sanitized) toolStates[toolId] = sanitized;
    }
  }

  const essentialSteps: Record<string, boolean> = {};
  if (raw.essentialSteps && typeof raw.essentialSteps === "object") {
    const validStepIds = new Set(ESSENTIAL_SETUP_STEPS.map((step) => step.id));
    for (const [stepId, done] of Object.entries(raw.essentialSteps as Record<string, unknown>)) {
      if (validStepIds.has(stepId) && typeof done === "boolean") essentialSteps[stepId] = done;
    }
  }

  return {
    schemaVersion: WORKSTATION_SCHEMA_VERSION,
    profileOverride,
    os,
    hasTenant,
    toolStates,
    essentialSteps,
  };
}

export const useWorkstationStore = create<WorkstationProgressState & WorkstationActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setProfileOverride: (profile) => set({ profileOverride: profile }),
      setOs: (os) => set({ os }),
      setTenant: (hasTenant) => set({ hasTenant }),
      markTool: (toolId, status) => set((state) => ({
        toolStates: {
          ...state.toolStates,
          [toolId]: {
            ...state.toolStates[toolId],
            status,
            verifiedAt: status === "verified" || status === "installed" ? nowIso() : state.toolStates[toolId]?.verifiedAt,
          },
        },
      })),
      setToolNotes: (toolId, notes) => set((state) => ({
        toolStates: {
          ...state.toolStates,
          [toolId]: {
            status: state.toolStates[toolId]?.status ?? "unknown",
            ...state.toolStates[toolId],
            notes: notes.slice(0, 500),
          },
        },
      })),
      toggleEssentialStep: (stepId, done) => set((state) => ({
        essentialSteps: { ...state.essentialSteps, [stepId]: done },
      })),
      applyWorkstationReport: (entries) => set((state) => {
        const toolStates = { ...state.toolStates };
        for (const entry of entries) {
          toolStates[entry.toolId] = {
            ...toolStates[entry.toolId],
            status: entry.status,
            detectedVersion: entry.detectedVersion,
            verifiedAt: nowIso(),
          };
        }
        return { toolStates };
      }),
      resetWorkstation: () => set(INITIAL_STATE),
    }),
    {
      name: WORKSTATION_STORAGE_KEY,
      version: WORKSTATION_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => sanitizeWorkstationState(persisted),
      merge: (persisted, current) => ({ ...current, ...sanitizeWorkstationState(persisted) }),
    }
  )
);
