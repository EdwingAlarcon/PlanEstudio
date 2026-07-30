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

import { useWorkstationStore } from "@/lib/workstation-store";
import { LabWorkstationGate } from "../lab-workstation-gate";

describe("LabWorkstationGate", () => {
  beforeEach(() => {
    useWorkstationStore.getState().resetWorkstation();
    localStorageMock.clear();
  });

  it("no renderiza nada cuando ningún producto matchea una herramienta conocida", () => {
    const { container } = render(<LabWorkstationGate products={["Dataverse", "Power Apps"]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada cuando la herramienta recomendada ya está instalada", () => {
    useWorkstationStore.getState().markTool("pac-cli", "installed");
    const { container } = render(<LabWorkstationGate products={["Power Platform CLI", "Dataverse"]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el banner cuando falta una herramienta recomendada", () => {
    render(<LabWorkstationGate products={["Power Platform CLI", "Dataverse"]} />);
    expect(screen.getByText("Antes de este lab puede convenirte verificar")).toBeInTheDocument();
    expect(screen.getByText("Power Platform CLI")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Preparar mi entorno" })).toHaveAttribute("href", "/preparar-entorno");
  });
});
