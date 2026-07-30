import { describe, expect, it } from "vitest";
import { WORKSTATION_SCHEMA_VERSION, sanitizeWorkstationState } from "../workstation-store";

describe("sanitizeWorkstationState", () => {
  it("returns a clean initial state for garbage input", () => {
    const state = sanitizeWorkstationState("not-an-object");
    expect(state.schemaVersion).toBe(WORKSTATION_SCHEMA_VERSION);
    expect(state.profileOverride).toBeNull();
    expect(state.os).toBeNull();
    expect(state.hasTenant).toBeNull();
    expect(state.toolStates).toEqual({});
    expect(state.essentialSteps).toEqual({});
  });

  it("rejects an invalid profileOverride and os", () => {
    const state = sanitizeWorkstationState({ profileOverride: "hacker", os: "amiga" });
    expect(state.profileOverride).toBeNull();
    expect(state.os).toBeNull();
  });

  it("keeps a valid profileOverride and os", () => {
    const state = sanitizeWorkstationState({ profileOverride: "developer", os: "windows", hasTenant: false });
    expect(state.profileOverride).toBe("developer");
    expect(state.os).toBe("windows");
    expect(state.hasTenant).toBe(false);
  });

  it("drops tool states with an invalid status", () => {
    const state = sanitizeWorkstationState({
      toolStates: {
        git: { status: "installed" },
        fake: { status: "not-a-real-status" },
      },
    });
    expect(state.toolStates.git?.status).toBe("installed");
    expect(state.toolStates.fake?.status).toBe("unknown");
  });

  it("drops essential steps that are not part of the known catalog", () => {
    const state = sanitizeWorkstationState({
      essentialSteps: { login: true, "made-up-step": true },
    });
    expect(state.essentialSteps.login).toBe(true);
    expect(state.essentialSteps["made-up-step"]).toBeUndefined();
  });

  it("truncates overly long tool notes", () => {
    const longNotes = "a".repeat(1000);
    const state = sanitizeWorkstationState({ toolStates: { git: { status: "installed", notes: longNotes } } });
    expect(state.toolStates.git?.notes?.length).toBeLessThanOrEqual(500);
  });

  it("does not read or leak keys belonging to other stores", () => {
    const state = sanitizeWorkstationState({
      os: "windows",
      records: { "some-practice": { status: "completed" } },
      completedModules: ["basico-1"],
    });
    expect(state).not.toHaveProperty("records");
    expect(state).not.toHaveProperty("completedModules");
  });
});
