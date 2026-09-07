import { describe, expect, it } from "vitest";
import {
  DEFAULT_ONBOARDING_STATE,
  FOUNDATION_ACTIVITIES,
  buildWeeklyPlan,
  classifySearchDocument,
  getFoundationProgress,
  getLabPrerequisiteWarning,
  getModulePrerequisiteWarning,
  getNextBestAction,
  getRecommendationReason,
  normalizeOnboardingState,
  recommendRouteSlug,
  validateGuidedJourneyReferences,
  type OnboardingAnswers,
} from "../guided-journey";

const baseAnswers: OnboardingAnswers = {
  experience: "unknown",
  tenant: "unknown",
  preference: "unknown",
  purpose: "unknown",
  availability: "5h",
};

describe("guided journey recommendations", () => {
  it("recommends foundations for a new user without experience", () => {
    expect(recommendRouteSlug({ ...baseAnswers, experience: "none" })).toBe("foundations");
  });

  it("keeps users without tenant on foundations-compatible guidance", () => {
    const action = getNextBestAction([], [], {
      ...DEFAULT_ONBOARDING_STATE,
      answers: { ...baseAnswers, tenant: "no" },
    });
    expect(action.activity.tenantAlternative).toMatch(/conceptual|Dibuja|Describe|Usa/i);
  });

  it("recommends functional, technical, RPA and administrative directions deterministically", () => {
    expect(recommendRouteSlug({ ...baseAnswers, preference: "configure" })).toBe("consultor-funcional");
    expect(recommendRouteSlug({ ...baseAnswers, preference: "analyze" })).toBe("consultor-funcional");
    expect(recommendRouteSlug({ ...baseAnswers, preference: "code" })).toBe("developer");
    expect(recommendRouteSlug({ ...baseAnswers, preference: "rpa" })).toBe("developer");
    expect(recommendRouteSlug({ ...baseAnswers, preference: "admin" })).toBe("maker");
    expect(recommendRouteSlug({ ...baseAnswers, preference: "build" })).toBe("maker");
    expect(recommendRouteSlug({ ...baseAnswers, purpose: "interview" })).toBe("maker");
  });

  it("returns the first pending foundation activity for a new user", () => {
    const action = getNextBestAction([], [], DEFAULT_ONBOARDING_STATE);
    expect(action.activity.id).toBe("eco-1");
    expect(action.cta).toBe("Continuar actividad");
  });

  it("prioritizes the current unfinished activity and lab CTAs", () => {
    const action = getNextBestAction(["basico-1", "basico-2", "basico-3"], [], {
      ...DEFAULT_ONBOARDING_STATE,
      currentActivityId: "lab-canvas-4",
    });
    expect(action.activity.id).toBe("lab-canvas-4");
    expect(action.cta).toBe("Abrir practica recomendada");
  });

  it("builds weekly plans from declared availability", () => {
    const next = getNextBestAction([], [], DEFAULT_ONBOARDING_STATE);
    expect(buildWeeklyPlan("2h", next)).toHaveLength(3);
    expect(buildWeeklyPlan("5h", next)).toHaveLength(4);
    expect(buildWeeklyPlan("8h", next)).toContain("Ajuste de ruta");
  });

  it("explains deterministic recommendation reasons transparently", () => {
    expect(getRecommendationReason({ ...baseAnswers, experience: "none" })).toMatch(/sin experiencia/);
    expect(getRecommendationReason({ ...baseAnswers, tenant: "no" })).toMatch(/variantes simuladas/);
    expect(getRecommendationReason({ ...baseAnswers, preference: "code" })).toMatch(/programar/);
    expect(getRecommendationReason({ ...baseAnswers, preference: "configure" })).toMatch(/procesos/);
    expect(getRecommendationReason({ ...baseAnswers, preference: "analyze" })).toMatch(/procesos/);
    expect(getRecommendationReason({ ...baseAnswers, preference: "build" })).toMatch(/apps/);
    expect(getRecommendationReason(baseAnswers)).toMatch(/no necesitas/);
  });

  it("preserves academic progress when route selection changes", () => {
    const completedModules = ["basico-1", "basico-2"];
    const progressBefore = getFoundationProgress(completedModules, [], DEFAULT_ONBOARDING_STATE);
    const changed = { ...DEFAULT_ONBOARDING_STATE, selectedRouteSlug: "developer" as const, stage: "route_selected" as const };
    const progressAfter = getFoundationProgress(completedModules, [], changed);
    expect(progressAfter.completed).toBeGreaterThanOrEqual(progressBefore.completed);
  });

  it("detects foundations progress separately from the global catalog", () => {
    const completed = ["basico-1", "basico-2", "basico-3", "basico-5"];
    const progress = getFoundationProgress(completed, ["lab-03-canvas-primera-app"], {
      ...DEFAULT_ONBOARDING_STATE,
      stage: "foundations_completed",
    });
    expect(progress.total).toBe(FOUNDATION_ACTIVITIES.length);
    expect(progress.completed).toBe(FOUNDATION_ACTIVITIES.length - 1);
  });
});

describe("guided journey persistence and validation", () => {
  it("handles corrupt onboarding data with defaults", () => {
    expect(normalizeOnboardingState("broken")).toEqual(DEFAULT_ONBOARDING_STATE);
    expect(normalizeOnboardingState({ schemaVersion: 99 })).toEqual(DEFAULT_ONBOARDING_STATE);
  });

  it("migrates partial versioned data conservatively", () => {
    const state = normalizeOnboardingState({ schemaVersion: 1, stage: "foundations_started", answers: { tenant: "no" } });
    expect(state.stage).toBe("foundations_started");
    expect(state.answers.tenant).toBe("no");
    expect(state.answers.availability).toBe("5h");
  });

  it("validates guided route references", () => {
    const modules = FOUNDATION_ACTIVITIES.filter((activity) => activity.moduleId).map((activity) => ({
      moduleId: activity.moduleId!,
    })) as never;
    const labs = [{ slug: "lab-03-canvas-primera-app" }] as never;
    expect(validateGuidedJourneyReferences(modules, labs)).toEqual([]);
  });

  it("fails a route without valid activities", () => {
    const modules = [] as never;
    const labs = [] as never;
    expect(validateGuidedJourneyReferences(modules, labs).length).toBeGreaterThan(0);
  });

  it("reports invalid activity references with useful messages", () => {
    const modules = [{ moduleId: 999 }] as never;
    const labs = [{ slug: "missing" }] as never;
    const errors = validateGuidedJourneyReferences(modules, labs);
    expect(errors.some((error) => error.includes("modulo inexistente"))).toBe(true);
    expect(errors.some((error) => error.includes("lab inexistente"))).toBe(true);
  });
});

describe("contextual search", () => {
  it("prioritizes current route documents", () => {
    expect(
      classifySearchDocument(
        { id: "module-basico-1", title: "Intro", type: "module", levelId: "basico", moduleId: 1, slug: "intro", href: "/x", content: "" },
        DEFAULT_ONBOARDING_STATE,
      )
    ).toBe("en-tu-ruta");
  });

  it("labels advanced content without hiding it", () => {
    expect(
      classifySearchDocument(
        { id: "module-avanzado-23", title: "Plugins", type: "module", levelId: "avanzado", moduleId: 23, slug: "plugins", href: "/x", content: "" },
        DEFAULT_ONBOARDING_STATE,
      )
    ).toBe("avanzado");
  });

  it.each([["ia", 42], ["d365", 57], ["rpa", 67]] as const)("classifies %s modules as a specialization", (levelId, moduleId) => {
    expect(classifySearchDocument(
      { id: `module-${levelId}`, title: levelId, type: "module", levelId, moduleId, slug: levelId, href: "/x", content: "" },
      DEFAULT_ONBOARDING_STATE,
    )).toBe("otra-especializacion");
  });

  it("labels transversal and free-explore content separately", () => {
    expect(
      classifySearchDocument(
        { id: "resource-ia", title: "IA", type: "module", levelId: "ia", moduleId: 42, slug: "ia", href: "/x", content: "" },
        DEFAULT_ONBOARDING_STATE,
      )
    ).toBe("otra-especializacion");
    expect(
      classifySearchDocument(
        { id: "resource-d365", title: "D365", type: "resource", levelId: "d365", moduleId: 0, slug: "d365", href: "/x", content: "" },
        DEFAULT_ONBOARDING_STATE,
      )
    ).toBe("otra-especializacion");
    expect(
      classifySearchDocument(
        { id: "module-basico-8", title: "Proyecto", type: "module", levelId: "basico", moduleId: 8, slug: "proyecto", href: "/x", content: "" },
        { ...DEFAULT_ONBOARDING_STATE, navigationMode: "explore" },
      )
    ).toBe("en-tu-ruta");
  });
});

describe("getModulePrerequisiteWarning", () => {
  it("returns null for the very first module of a level with nothing completed", () => {
    expect(getModulePrerequisiteWarning(1, "basico", [])).toBeNull();
  });

  it("warns when a module is opened but the immediate previous module in the same level is not complete", () => {
    const warning = getModulePrerequisiteWarning(3, "basico", ["basico-1"]);
    expect(warning).toEqual({ kind: "module_skipped", previousModuleId: 2 });
  });

  it("returns null when the immediate previous module in the same level is complete", () => {
    expect(getModulePrerequisiteWarning(3, "basico", ["basico-1", "basico-2"])).toBeNull();
  });

  it("warns with level_incomplete when entering a level whose previous level is not fully done", () => {
    const warning = getModulePrerequisiteWarning(9, "intermedio", []);
    expect(warning).toEqual({ kind: "level_incomplete", previousLevel: "basico", completed: 0, total: 8 });
  });

  it("prioritizes level_incomplete over module_skipped when both apply", () => {
    const warning = getModulePrerequisiteWarning(11, "intermedio", ["intermedio-9", "intermedio-10"]);
    expect(warning).toEqual({ kind: "level_incomplete", previousLevel: "basico", completed: 0, total: 8 });
  });

  it("returns null when the previous level is fully completed and the module sequence is respected", () => {
    const allBasico = Array.from({ length: 8 }, (_, i) => `basico-${i + 1}`);
    expect(getModulePrerequisiteWarning(9, "intermedio", allBasico)).toBeNull();
  });

  it("never warns for transversal levels (ia, d365, rpa)", () => {
    expect(getModulePrerequisiteWarning(42, "ia", [])).toBeNull();
    expect(getModulePrerequisiteWarning(57, "d365", [])).toBeNull();
    expect(getModulePrerequisiteWarning(67, "rpa", [])).toBeNull();
  });
});

describe("getLabPrerequisiteWarning", () => {
  it.each([
    ["Módulos 68 y 75 completados", [68, 75]],
    ["Módulo 44 y 45 estudiados", [44, 45]],
    ["Módulos RPA 67-76 completados", [67, 68, 69, 70, 71, 72, 73, 74, 75, 76]],
    ["Módulos 42–45 estudiados", [42, 43, 44, 45]],
    ["Modulos 42, 44 y 45 estudiados", [42, 44, 45]],
    ["Módulo 42 y Módulo 45 estudiados", [42, 45]],
  ])("checks every module in %s", (prerequisite, ids) => {
    const completed = ids.map((id) => `${id >= 67 ? "rpa" : "ia"}-${id}`);
    expect(getLabPrerequisiteWarning([prerequisite], [])).toEqual({ unmet: [prerequisite] });
    expect(getLabPrerequisiteWarning([prerequisite], completed.slice(0, -1))).toEqual({ unmet: [prerequisite] });
    expect(getLabPrerequisiteWarning([prerequisite], completed)).toBeNull();
  });

  it("does not treat unrelated numbers as module references", () => {
    expect(getLabPrerequisiteWarning(["Módulo 9 estudiado y Visual Studio 2022 instalado; Lab 23 completado"], ["intermedio-9"])).toBeNull();
    expect(getLabPrerequisiteWarning(["Módulo 999 completado"], [])).toBeNull();
  });
  it("returns null when there are no prerequisites referencing a module", () => {
    expect(getLabPrerequisiteWarning(["Visual Studio 2022 instalado"], [])).toBeNull();
  });

  it("returns null when the referenced module is already completed", () => {
    const warning = getLabPrerequisiteWarning(
      ["Módulo 9 estudiado: Dataverse Avanzado"],
      ["intermedio-9"],
    );
    expect(warning).toBeNull();
  });

  it("warns with the original prerequisite text when the referenced module is not completed", () => {
    const warning = getLabPrerequisiteWarning(
      ["Módulo 9 estudiado: Dataverse Avanzado", "Lab 02 completado"],
      [],
    );
    expect(warning).toEqual({ unmet: ["Módulo 9 estudiado: Dataverse Avanzado"] });
  });

  it("ignores prerequisite text referencing a lab, not a module (unresolvable without a slug)", () => {
    expect(getLabPrerequisiteWarning(["Lab 02 completado"], [])).toBeNull();
  });

  it("collects every unmet module reference across multiple prerequisites", () => {
    const warning = getLabPrerequisiteWarning(
      ["Módulo 1 completado", "Módulo 5 estudiado"],
      [],
    );
    expect(warning?.unmet).toHaveLength(2);
  });
});
