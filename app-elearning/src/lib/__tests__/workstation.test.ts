import { describe, expect, it } from "vitest";
import {
  ESSENTIAL_SETUP_STEPS,
  WORKSTATION_TOOLS,
  getEssentialSetupProgress,
  getNextWorkstationRequirement,
  getToolRequirement,
  getToolsForProfile,
  recommendWorkstationProfile,
  validateWorkstationReferences,
  type WorkstationToolStateMap,
} from "../workstation";
import { DEFAULT_ONBOARDING_ANSWERS, type OnboardingAnswers } from "../guided-journey";

const baseAnswers: OnboardingAnswers = { ...DEFAULT_ONBOARDING_ANSWERS };

describe("workstation matrix", () => {
  it("has no duplicate tools and no reference errors", () => {
    expect(validateWorkstationReferences()).toEqual([]);
  });

  it("declares a requirement for every profile on every tool", () => {
    const profiles = ["maker", "functional", "developer", "admin", "architect", "rpa"] as const;
    for (const tool of WORKSTATION_TOOLS) {
      for (const profile of profiles) {
        expect(tool.requiredBy[profile]).toBeDefined();
      }
    }
  });

  it("every essential setup step has a no-tenant alternative", () => {
    for (const step of ESSENTIAL_SETUP_STEPS) {
      expect(step.tenantAlternative.length).toBeGreaterThan(0);
    }
  });
});

describe("getToolsForProfile", () => {
  it("excludes not_required tools", () => {
    const tools = getToolsForProfile("functional", "windows");
    expect(tools.some((tool) => tool.id === "node")).toBe(false);
    expect(tools.some((tool) => tool.id === "visual-studio")).toBe(false);
  });

  it("filters tools by platform (Visual Studio and PAD are Windows-only)", () => {
    const macTools = getToolsForProfile("developer", "macos");
    expect(macTools.some((tool) => tool.id === "visual-studio")).toBe(false);
    expect(macTools.some((tool) => tool.id === "power-automate-desktop")).toBe(false);
  });

  it("orders required tools before recommended and optional", () => {
    const tools = getToolsForProfile("developer", "windows");
    const requirementIndex = tools.map((tool) => tool.requiredBy.developer);
    const firstOptionalIndex = requirementIndex.indexOf("optional");
    const firstRequiredIndex = requirementIndex.indexOf("required");
    if (firstOptionalIndex !== -1 && firstRequiredIndex !== -1) {
      expect(firstRequiredIndex).toBeLessThan(firstOptionalIndex);
    }
  });

  it("does not recommend Visual Studio to a functional profile", () => {
    expect(getToolRequirement("visual-studio", "functional")).toBe("not_required");
  });

  it("gives PAD only to the rpa profile as required", () => {
    expect(getToolRequirement("power-automate-desktop", "rpa")).toBe("required");
    expect(getToolRequirement("power-automate-desktop", "developer")).toBe("optional");
    expect(getToolRequirement("power-automate-desktop", "functional")).toBe("not_required");
  });
});

describe("getNextWorkstationRequirement", () => {
  it("returns the first required tool not yet installed", () => {
    const states: WorkstationToolStateMap = {};
    const next = getNextWorkstationRequirement("developer", "windows", states);
    expect(next?.id).toBe("browser");
  });

  it("advances to the next required tool once the current one is marked installed", () => {
    const states: WorkstationToolStateMap = { browser: { status: "installed" } };
    const next = getNextWorkstationRequirement("developer", "windows", states);
    expect(next?.id).not.toBe("browser");
  });

  it("returns null when all required tools are verified", () => {
    const requiredIds = getToolsForProfile("maker", "windows")
      .filter((tool) => tool.requiredBy.maker === "required")
      .map((tool) => tool.id);
    const states: WorkstationToolStateMap = Object.fromEntries(
      requiredIds.map((id) => [id, { status: "verified" as const }])
    );
    expect(getNextWorkstationRequirement("maker", "windows", states)).toBeNull();
  });
});

describe("recommendWorkstationProfile", () => {
  it("maps onboarding preferences to a workstation profile", () => {
    expect(recommendWorkstationProfile({ ...baseAnswers, preference: "code" })).toBe("developer");
    expect(recommendWorkstationProfile({ ...baseAnswers, preference: "rpa" })).toBe("rpa");
    expect(recommendWorkstationProfile({ ...baseAnswers, preference: "admin" })).toBe("admin");
    expect(recommendWorkstationProfile({ ...baseAnswers, preference: "configure" })).toBe("functional");
    expect(recommendWorkstationProfile({ ...baseAnswers, preference: "analyze" })).toBe("functional");
    expect(recommendWorkstationProfile({ ...baseAnswers, preference: "build" })).toBe("maker");
  });
});

describe("getEssentialSetupProgress", () => {
  it("computes completed/total/percentage", () => {
    const progress = getEssentialSetupProgress({});
    expect(progress.completed).toBe(0);
    expect(progress.total).toBe(ESSENTIAL_SETUP_STEPS.length);
    expect(progress.percentage).toBe(0);
  });

  it("counts only known step ids", () => {
    const firstStepId = ESSENTIAL_SETUP_STEPS[0]!.id;
    const progress = getEssentialSetupProgress({ [firstStepId]: true, unknown_step: true });
    expect(progress.completed).toBe(1);
  });
});
