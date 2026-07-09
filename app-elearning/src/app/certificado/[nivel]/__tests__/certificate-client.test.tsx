import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
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
import { CertificateClient } from "../certificate-client";

const BASICO_MODULES = Array.from({ length: 8 }, (_, i) => ({
  moduleId: i + 1,
  title: `Módulo ${i + 1}`,
}));
const BASICO_LABS = [{ slug: "lab-02-dataverse-modelo-datos", title: "Dataverse — Modelo de Datos" }];

function completeBasicoModulesAndQuizzes() {
  for (let i = 1; i <= 8; i++) {
    useProgressStore.getState().markModuleComplete(`basico-${i}`);
    useProgressStore.getState().saveQuizScore(String(i), 90);
  }
}

describe("CertificateClient", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    useProgressStore.setState({
      completedModules: [],
      quizScores: {},
      completedLabs: [],
      lastVisited: null,
      userName: null,
    });
    localStorageMock.clear();
  });

  it("redirects to the level page when the level is not 100% complete", () => {
    render(<CertificateClient levelId="basico" />);
    expect(replaceMock).toHaveBeenCalledWith("/nivel/basico");
  });

  it("redirects to the level page when there is no userName, even at 100%", () => {
    completeBasicoModulesAndQuizzes();
    render(<CertificateClient levelId="basico" />);
    expect(replaceMock).toHaveBeenCalledWith("/nivel/basico");
  });

  it("shows a not-ready panel (no redirect) when modules are done but quizzes/labs are pending", () => {
    for (let i = 1; i <= 8; i++) {
      useProgressStore.getState().markModuleComplete(`basico-${i}`);
    }
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText } = render(
      <CertificateClient levelId="basico" modules={BASICO_MODULES} labs={BASICO_LABS} />
    );
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText(/Aún no puedes generar el certificado/i)).toBeInTheDocument();
    expect(getByText(/Quizzes pendientes de aprobar \(8\/8\)/i)).toBeInTheDocument();
    expect(getByText(/Laboratorios pendientes \(1\/1\)/i)).toBeInTheDocument();
  });

  it("renders the certificate when modules, quizzes and labs are all complete", () => {
    completeBasicoModulesAndQuizzes();
    useProgressStore.getState().markLabComplete("lab-02-dataverse-modelo-datos");
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText } = render(
      <CertificateClient levelId="basico" modules={BASICO_MODULES} labs={BASICO_LABS} />
    );
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("renders the certificate when there are no labs/modules props to gate on (backward compatible)", () => {
    completeBasicoModulesAndQuizzes();
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText } = render(<CertificateClient levelId="basico" />);
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("shows IA-specific phrasing (no PL-xxx exam language) when the level is 'ia'", () => {
    for (let i = 42; i <= 55; i++) {
      useProgressStore.getState().markModuleComplete(`ia-${i}`);
      useProgressStore.getState().saveQuizScore(String(i), 90);
    }
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText, queryByText } = render(<CertificateClient levelId="ia" />);
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText(/buenas prácticas de desarrollo asistido por IA/i)).toBeInTheDocument();
    expect(queryByText(/rendir la certificación/i)).not.toBeInTheDocument();
  });
});
