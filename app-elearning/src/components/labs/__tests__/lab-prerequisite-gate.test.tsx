import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

import { useProgressStore } from "@/lib/progress";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { LabPrerequisiteGate } from "../lab-prerequisite-gate";

describe("LabPrerequisiteGate", () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
    useOnboardingStore.getState().resetOnboarding();
    localStorageMock.clear();
  });

  it("no renderiza nada en modo explore", () => {
    useOnboardingStore.getState().setNavigationMode("explore");
    const { container } = render(
      <LabPrerequisiteGate prerequisites={["Módulo 9 estudiado: Dataverse Avanzado"]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada cuando el módulo referenciado ya está completado", () => {
    useProgressStore.getState().markModuleComplete("intermedio-9");
    const { container } = render(
      <LabPrerequisiteGate prerequisites={["Módulo 9 estudiado: Dataverse Avanzado"]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra advertencia con el texto original del prerrequisito no cumplido", () => {
    render(<LabPrerequisiteGate prerequisites={["Módulo 9 estudiado: Dataverse Avanzado"]} />);
    expect(screen.getByText("Antes de este lab puede convenirte revisar")).toBeInTheDocument();
    expect(screen.getByText("Módulo 9 estudiado: Dataverse Avanzado")).toBeInTheDocument();
  });
});
