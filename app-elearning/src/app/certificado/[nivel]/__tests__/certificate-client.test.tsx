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
    for (let i = 1; i <= 8; i++) {
      useProgressStore.getState().markModuleComplete(`basico-${i}`);
    }
    render(<CertificateClient levelId="basico" />);
    expect(replaceMock).toHaveBeenCalledWith("/nivel/basico");
  });

  it("renders the certificate when the level is complete and userName is set", () => {
    for (let i = 1; i <= 8; i++) {
      useProgressStore.getState().markModuleComplete(`basico-${i}`);
    }
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText } = render(<CertificateClient levelId="basico" />);
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("shows IA-specific phrasing (no PL-xxx exam language) when the level is 'ia'", () => {
    for (let i = 42; i <= 55; i++) {
      useProgressStore.getState().markModuleComplete(`ia-${i}`);
    }
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText, queryByText } = render(<CertificateClient levelId="ia" />);
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText(/buenas prácticas de desarrollo asistido por IA/i)).toBeInTheDocument();
    expect(queryByText(/rendir la certificación/i)).not.toBeInTheDocument();
  });
});
