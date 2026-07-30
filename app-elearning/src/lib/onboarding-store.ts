"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_ONBOARDING_STATE,
  normalizeOnboardingState,
  recommendRouteSlug,
  type ExperienceGoal,
  type NavigationMode,
  type OnboardingAnswers,
  type OnboardingStage,
  type OnboardingState,
} from "./guided-journey";
import type { ProfessionalRouteSlug } from "./professional-routes";

export type JourneyEventName =
  | "onboarding_started"
  | "onboarding_completed"
  | "foundations_started"
  | "first_practice_completed"
  | "route_chosen"
  | "route_changed"
  | "advanced_content_opened"
  | "recommendation_followed"
  | "recommendation_skipped";

export interface JourneyEvent {
  name: JourneyEventName;
  at: string;
  metadata?: Record<string, string>;
}

interface OnboardingActions {
  startOnboarding: (goal?: ExperienceGoal) => void;
  completeDiagnostic: (answers: Partial<OnboardingAnswers>) => void;
  setStage: (stage: OnboardingStage) => void;
  setCurrentActivity: (activityId: string) => void;
  chooseRoute: (routeSlug: ProfessionalRouteSlug) => void;
  changeRoute: (routeSlug: ProfessionalRouteSlug) => void;
  setNavigationMode: (mode: NavigationMode) => void;
  resetOnboarding: () => void;
  trackEvent: (name: JourneyEventName, metadata?: Record<string, string>) => void;
}

export interface OnboardingStoreState extends OnboardingState {
  events: JourneyEvent[];
}

const now = () => new Date().toISOString();

export const useOnboardingStore = create<OnboardingStoreState & OnboardingActions>()(
  persist(
    (set) => ({
      ...DEFAULT_ONBOARDING_STATE,
      events: [],

      startOnboarding: (goal = "desde-cero") =>
        set((state) => ({
          goal,
          stage: "foundations_started",
          selectedRouteSlug: "foundations",
          currentActivityId: state.currentActivityId ?? "eco-1",
          startedAt: state.startedAt ?? now(),
          lastActivityAt: now(),
          currentRecommendationId: "foundations",
          navigationMode: "guided",
          events: appendEvent(state.events, "onboarding_started", { goal }),
        })),

      completeDiagnostic: (answers) =>
        set((state) => {
          const nextAnswers = { ...state.answers, ...answers };
          const recommendation = recommendRouteSlug(nextAnswers);
          return {
            answers: nextAnswers,
            stage: recommendation === "foundations" ? "foundations_started" : "foundations_started",
            selectedRouteSlug: "foundations",
            currentRecommendationId: recommendation,
            startedAt: state.startedAt ?? now(),
            lastActivityAt: now(),
            completed: true,
            events: appendEvent(state.events, "onboarding_completed", { recommendation }),
          };
        }),

      setStage: (stage) => set({ stage, lastActivityAt: now() }),

      setCurrentActivity: (activityId) => set({ currentActivityId: activityId, lastActivityAt: now() }),

      chooseRoute: (routeSlug) =>
        set((state) => ({
          selectedRouteSlug: routeSlug,
          currentRecommendationId: routeSlug,
          stage: "route_selected",
          completed: true,
          lastActivityAt: now(),
          events: appendEvent(state.events, "route_chosen", { routeSlug }),
        })),

      changeRoute: (routeSlug) =>
        set((state) => ({
          selectedRouteSlug: routeSlug,
          currentRecommendationId: routeSlug,
          stage: "route_selected",
          lastActivityAt: now(),
          events: appendEvent(state.events, "route_changed", { routeSlug }),
        })),

      setNavigationMode: (navigationMode) => set({ navigationMode, lastActivityAt: now() }),

      resetOnboarding: () =>
        set((state) => ({
          ...DEFAULT_ONBOARDING_STATE,
          events: appendEvent(state.events, "recommendation_skipped", { action: "reset_onboarding" }),
        })),

      trackEvent: (name, metadata) =>
        set((state) => ({
          events: appendEvent(state.events, name, metadata),
          lastActivityAt: now(),
        })),
    }),
    {
      name: "plan-estudio-onboarding",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted) => {
        const raw = persisted && typeof persisted === "object" ? persisted : {};
        const normalized = normalizeOnboardingState(raw);
        const events = Array.isArray((raw as { events?: unknown }).events)
          ? ((raw as { events: JourneyEvent[] }).events).slice(-50)
          : [];
        return { ...normalized, events };
      },
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        stage: state.stage,
        goal: state.goal,
        selectedRouteSlug: state.selectedRouteSlug,
        currentActivityId: state.currentActivityId,
        startedAt: state.startedAt,
        lastActivityAt: state.lastActivityAt,
        completed: state.completed,
        currentRecommendationId: state.currentRecommendationId,
        navigationMode: state.navigationMode,
        answers: state.answers,
        skippedPreferences: state.skippedPreferences,
        events: state.events.slice(-50),
      }),
    }
  )
);

function appendEvent(
  events: JourneyEvent[],
  name: JourneyEventName,
  metadata?: Record<string, string>,
): JourneyEvent[] {
  return [...events, { name, at: now(), metadata }].slice(-50);
}

export function inferOnboardingForExistingUser(completedModules: string[]): OnboardingStage {
  if (completedModules.length === 0) return "new";
  const foundationModuleIds = ["basico-1", "basico-2", "basico-3", "basico-5"];
  const done = foundationModuleIds.filter((id) => completedModules.includes(id)).length;
  if (done >= foundationModuleIds.length) return "foundations_completed";
  return "foundations_started";
}
