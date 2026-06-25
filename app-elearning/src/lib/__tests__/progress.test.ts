import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage before importing the store
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

import { useProgressStore } from "../progress";

describe("useProgressStore", () => {
  beforeEach(() => {
    useProgressStore.setState({
      completedModules: [],
      quizScores: {},
      completedLabs: [],
      lastVisited: null,
    });
    localStorageMock.clear();
  });

  it("starts with no completed modules", () => {
    expect(useProgressStore.getState().completedModules).toHaveLength(0);
  });

  describe("markModuleComplete", () => {
    it("adds a module to completedModules", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      expect(useProgressStore.getState().completedModules).toContain("basico-1");
    });

    it("does not add duplicates", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      useProgressStore.getState().markModuleComplete("basico-1");
      expect(useProgressStore.getState().completedModules).toHaveLength(1);
    });
  });

  describe("markModuleIncomplete", () => {
    it("removes the module from completedModules", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      useProgressStore.getState().markModuleIncomplete("basico-1");
      expect(useProgressStore.getState().completedModules).not.toContain("basico-1");
    });

    it("is safe when module was not completed", () => {
      expect(() => useProgressStore.getState().markModuleIncomplete("basico-99")).not.toThrow();
    });
  });

  describe("toggleModuleComplete", () => {
    it("marks as complete when not complete", () => {
      useProgressStore.getState().toggleModuleComplete("basico-1");
      expect(useProgressStore.getState().isModuleComplete("basico-1")).toBe(true);
    });

    it("marks as incomplete when already complete", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      useProgressStore.getState().toggleModuleComplete("basico-1");
      expect(useProgressStore.getState().isModuleComplete("basico-1")).toBe(false);
    });
  });

  describe("isModuleComplete", () => {
    it("returns false initially", () => {
      expect(useProgressStore.getState().isModuleComplete("basico-1")).toBe(false);
    });

    it("returns true after marking complete", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      expect(useProgressStore.getState().isModuleComplete("basico-1")).toBe(true);
    });
  });

  describe("saveQuizScore and getQuizScore", () => {
    it("saves and retrieves a quiz score", () => {
      useProgressStore.getState().saveQuizScore("1", 85);
      expect(useProgressStore.getState().getQuizScore("1")).toBe(85);
    });

    it("returns null for unsaved module", () => {
      expect(useProgressStore.getState().getQuizScore("999")).toBeNull();
    });

    it("overwrites previous score", () => {
      useProgressStore.getState().saveQuizScore("1", 70);
      useProgressStore.getState().saveQuizScore("1", 90);
      expect(useProgressStore.getState().getQuizScore("1")).toBe(90);
    });
  });

  describe("setLastVisited", () => {
    it("updates lastVisited", () => {
      useProgressStore.getState().setLastVisited("basico-3");
      expect(useProgressStore.getState().lastVisited).toBe("basico-3");
    });
  });

  describe("getLevelProgress", () => {
    it("returns 0/8 for basico with nothing completed", () => {
      const prog = useProgressStore.getState().getLevelProgress("basico");
      expect(prog.total).toBe(8);
      expect(prog.completed).toBe(0);
      expect(prog.percentage).toBe(0);
    });

    it("counts only modules in the correct range for basico", () => {
      // basico: modules 1-8
      useProgressStore.getState().markModuleComplete("basico-1");
      useProgressStore.getState().markModuleComplete("basico-5");
      useProgressStore.getState().markModuleComplete("intermedio-9"); // should NOT count

      const prog = useProgressStore.getState().getLevelProgress("basico");
      expect(prog.completed).toBe(2);
    });

    it("calculates percentage correctly", () => {
      // 4 of 8 = 50%
      for (let i = 1; i <= 4; i++) {
        useProgressStore.getState().markModuleComplete(`basico-${i}`);
      }
      const prog = useProgressStore.getState().getLevelProgress("basico");
      expect(prog.percentage).toBe(50);
    });
  });

  describe("getOverallProgress", () => {
    it("counts total as 41", () => {
      const prog = useProgressStore.getState().getOverallProgress();
      expect(prog.total).toBe(41);
    });

    it("reflects completed modules", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      useProgressStore.getState().markModuleComplete("intermedio-9");
      const prog = useProgressStore.getState().getOverallProgress();
      expect(prog.completed).toBe(2);
    });
  });

  describe("resetProgress", () => {
    it("clears all progress including labs", () => {
      useProgressStore.getState().markModuleComplete("basico-1");
      useProgressStore.getState().saveQuizScore("1", 80);
      useProgressStore.getState().markLabComplete("lab-02-dataverse-modelo-datos");
      useProgressStore.getState().resetProgress();

      const state = useProgressStore.getState();
      expect(state.completedModules).toHaveLength(0);
      expect(Object.keys(state.quizScores)).toHaveLength(0);
      expect(state.completedLabs).toHaveLength(0);
      expect(state.lastVisited).toBeNull();
    });
  });

  describe("lab progress", () => {
    it("marks a lab as complete", () => {
      useProgressStore.getState().markLabComplete("lab-02-dataverse-modelo-datos");
      expect(useProgressStore.getState().isLabComplete("lab-02-dataverse-modelo-datos")).toBe(true);
    });

    it("does not duplicate completed labs", () => {
      useProgressStore.getState().markLabComplete("lab-02-dataverse-modelo-datos");
      useProgressStore.getState().markLabComplete("lab-02-dataverse-modelo-datos");
      expect(useProgressStore.getState().completedLabs).toHaveLength(1);
    });

    it("marks a lab as incomplete", () => {
      useProgressStore.getState().markLabComplete("lab-02-dataverse-modelo-datos");
      useProgressStore.getState().markLabIncomplete("lab-02-dataverse-modelo-datos");
      expect(useProgressStore.getState().isLabComplete("lab-02-dataverse-modelo-datos")).toBe(false);
    });

    it("toggles lab completion state", () => {
      useProgressStore.getState().toggleLabComplete("lab-03-canvas-primera-app");
      expect(useProgressStore.getState().isLabComplete("lab-03-canvas-primera-app")).toBe(true);
      useProgressStore.getState().toggleLabComplete("lab-03-canvas-primera-app");
      expect(useProgressStore.getState().isLabComplete("lab-03-canvas-primera-app")).toBe(false);
    });

    it("returns false for a lab never completed", () => {
      expect(useProgressStore.getState().isLabComplete("lab-99-inexistente")).toBe(false);
    });
  });
});
