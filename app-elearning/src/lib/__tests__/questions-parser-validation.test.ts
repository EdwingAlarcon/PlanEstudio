import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RawQuestion } from "../../data/questions";

let mockQuestions: Record<number, RawQuestion[]> = {};

vi.mock("../../data/questions", () => ({
  default: new Proxy(
    {},
    {
      get(_target, prop) {
        return mockQuestions[prop as unknown as number];
      },
      ownKeys() {
        return Object.keys(mockQuestions);
      },
      getOwnPropertyDescriptor() {
        return { enumerable: true, configurable: true };
      },
    },
  ),
}));

beforeEach(() => {
  vi.resetModules();
  mockQuestions = {};
});

const VALID_QUESTION: RawQuestion = {
  type: "single",
  prompt: "¿Cuál es la respuesta correcta?",
  options: ["A", "B", "C"],
  answer: [0],
  explanation: "Porque sí.",
};

describe("getAllQuestions — validación de datos", () => {
  it("rechaza un moduleId que no existe en el contenido de módulos", async () => {
    mockQuestions = { 9999: [VALID_QUESTION] };
    const { getAllQuestions } = await import("../questions-parser");

    expect(() => getAllQuestions()).toThrow(/moduleId 9999 no existe/i);
  });

  it("rechaza un tipo de pregunta inválido", async () => {
    mockQuestions = {
      1: [{ ...VALID_QUESTION, type: "boolean" as unknown as "single" }],
    };
    const { getAllQuestions } = await import("../questions-parser");

    expect(() => getAllQuestions()).toThrow(/tipo de pregunta inválido/i);
  });

  it("rechaza un prompt vacío", async () => {
    mockQuestions = { 1: [{ ...VALID_QUESTION, prompt: "   " }] };
    const { getAllQuestions } = await import("../questions-parser");

    expect(() => getAllQuestions()).toThrow(/prompt vacío/i);
  });

  it("rechaza una respuesta fuera del rango de opciones", async () => {
    mockQuestions = { 1: [{ ...VALID_QUESTION, answer: [5] }] };
    const { getAllQuestions } = await import("../questions-parser");

    expect(() => getAllQuestions()).toThrow(/respuesta fuera del rango de opciones/i);
  });

  it("acepta una pregunta válida para un módulo existente", async () => {
    mockQuestions = { 1: [VALID_QUESTION] };
    const { getAllQuestions } = await import("../questions-parser");

    const questions = getAllQuestions();
    expect(questions).toHaveLength(1);
    expect(questions[0]?.moduleId).toBe(1);
  });
});
