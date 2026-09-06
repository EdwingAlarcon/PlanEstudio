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
import { ModulePrerequisiteGate } from "../module-prerequisite-gate";

describe("ModulePrerequisiteGate", () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
    useOnboardingStore.getState().resetOnboarding();
    localStorageMock.clear();
  });

  it("no renderiza nada en modo explore aunque haya prerrequisitos pendientes", () => {
    useOnboardingStore.getState().setNavigationMode("explore");
    const { container } = render(<ModulePrerequisiteGate moduleId={9} levelId="intermedio" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada cuando no hay ninguna advertencia de prerrequisito", () => {
    const { container } = render(<ModulePrerequisiteGate moduleId={1} levelId="basico" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada para niveles transversales", () => {
    const { container } = render(<ModulePrerequisiteGate moduleId={42} levelId="ia" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra advertencia de nivel incompleto al saltar de nivel", () => {
    render(<ModulePrerequisiteGate moduleId={9} levelId="intermedio" />);
    expect(screen.getByText("Antes de este módulo puede convenirte revisar")).toBeInTheDocument();
    expect(screen.getByText(/Básico \(0\/8 módulos\)/)).toBeInTheDocument();
  });

  it("muestra advertencia de módulo salteado con link al módulo anterior", () => {
    useProgressStore.getState().markModuleComplete("basico-1");
    render(
      <ModulePrerequisiteGate moduleId={3} levelId="basico" previousModuleHref="/nivel/basico/modulo/anterior" />
    );
    expect(screen.getByText(/Módulo 2/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al módulo anterior" })).toHaveAttribute(
      "href",
      "/nivel/basico/modulo/anterior"
    );
  });
});
