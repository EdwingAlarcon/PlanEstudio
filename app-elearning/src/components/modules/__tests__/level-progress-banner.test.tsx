import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

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
import { LevelProgressBannerClient } from "../level-progress-banner";

describe("LevelProgressBannerClient — reactividad ante cambios externos del store", () => {
  beforeEach(() => {
    useProgressStore.setState({
      completedModules: [],
      quizScores: {},
      completedLabs: [],
      checklistItems: {},
      lastVisited: null,
      userName: null,
    });
    localStorageMock.clear();
  });

  it("actualiza el conteo de módulos sin necesidad de un remount cuando se completa un módulo", () => {
    render(<LevelProgressBannerClient levelId="basico" />);

    expect(screen.getByText("0 / 8 módulos")).toBeInTheDocument();

    // Mutación del store fuera de React (equivalente a hacer clic en
    // "Marcar como completado" en otro componente de la misma página).
    act(() => {
      useProgressStore.getState().markModuleComplete("basico-1");
    });

    expect(screen.getByText("1 / 8 módulos")).toBeInTheDocument();
    expect(screen.getByText("13% completado")).toBeInTheDocument();
  });

  it("muestra el banner de nivel completado en cuanto el último módulo se marca, sin remount", () => {
    for (let i = 1; i <= 7; i++) {
      useProgressStore.getState().markModuleComplete(`basico-${i}`);
    }
    render(<LevelProgressBannerClient levelId="basico" />);
    expect(screen.getByText("7 / 8 módulos")).toBeInTheDocument();

    act(() => {
      useProgressStore.getState().markModuleComplete("basico-8");
    });

    expect(screen.getByText(/Completado!/)).toBeInTheDocument();
  });
});
