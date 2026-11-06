import { describe, expect, it } from "vitest";
import {
  evaluateDebug,
  evaluateDecision,
  getAllInteractivePractices,
  type DebugScenarioPractice,
  type MultipleDecisionPractice,
} from "../interactive-practices";

/**
 * Contrato de cada práctica del banco: el motor debe aceptar la solución de referencia y no regalar puntos por atajos.
 * Una práctica que los agentes o los autores añadan después tiene que cumplirlo igual que las demás.
 *
 * No se exige (a propósito): que pegar el enunciado completo (síntoma + código del escenario) no puntúe. Los términos de
 * una respuesta correcta suelen reutilizar palabras del código, y excluirlos penalizaría a quien responde bien.
 * Sí se exige que repetir solo el síntoma no puntúe, porque el síntoma describe el efecto, no la causa.
 */

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim();

const practices = getAllInteractivePractices();
const decisions = practices.filter((practice): practice is MultipleDecisionPractice => practice.type === "multiple-decision");
const debugs = practices.filter((practice): practice is DebugScenarioPractice => practice.type === "debug-scenario");

describe("contrato de las prácticas de decisión", () => {
  it("la respuesta de referencia puntúa correct y todas las opciones correctas existen", () => {
    const problems: string[] = [];
    for (const practice of decisions) {
      const optionIds = new Set(practice.options.map((option) => option.id));
      for (const id of practice.correctOptionIds) if (!optionIds.has(id)) problems.push(`${practice.id}: correctOptionIds referencia una opción inexistente (${id})`);
      const result = evaluateDecision(practice, practice.correctOptionIds);
      if (result.status !== "correct") problems.push(`${practice.id}: la respuesta de referencia puntúa ${result.status} (${result.score})`);
    }
    expect(problems).toEqual([]);
  });

  it("no se aprueba marcando todo, no marcando nada ni sumando una opción incorrecta", () => {
    const problems: string[] = [];
    for (const practice of decisions) {
      const hasWrongOptions = practice.options.length > practice.correctOptionIds.length;
      if (hasWrongOptions && evaluateDecision(practice, practice.options.map((option) => option.id)).status === "correct") {
        problems.push(`${practice.id}: marcar todas las opciones cuenta como correcto`);
      }
      if (evaluateDecision(practice, []).status === "correct") problems.push(`${practice.id}: no marcar nada cuenta como correcto`);
      for (const option of practice.options) {
        if (practice.correctOptionIds.includes(option.id)) continue;
        if (evaluateDecision(practice, [...practice.correctOptionIds, option.id]).status === "correct") {
          problems.push(`${practice.id}: sumar la opción incorrecta ${option.id} sigue contando como correcto`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("cada opción explica su consecuencia", () => {
    const problems: string[] = [];
    for (const practice of decisions) {
      for (const option of practice.options) {
        if (option.consequence.trim().length < 20) problems.push(`${practice.id}: la opción ${option.id} no tiene una consecuencia explicativa`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("contrato de las prácticas de diagnóstico", () => {
  it("tienen al menos 3 términos aceptados que no aparecen en el síntoma", () => {
    const problems: string[] = [];
    for (const practice of debugs) {
      const symptom = normalize(practice.symptom);
      const own = practice.acceptableFixes.filter((term) => !symptom.includes(normalize(term)));
      if (own.length < 3) problems.push(`${practice.id}: solo ${own.length} términos aceptados propios (los demás ya están en el síntoma)`);
    }
    expect(problems).toEqual([]);
  });

  it("la pista 3 lleva a la respuesta correcta", () => {
    const problems: string[] = [];
    for (const practice of debugs) {
      const hint = practice.hints[2]?.content ?? "";
      const result = evaluateDebug(practice, hint);
      if (result.status !== "correct") problems.push(`${practice.id}: la pista 3 puntúa ${result.status} (${result.score})`);
    }
    expect(problems).toEqual([]);
  });

  it("repetir el síntoma o dar una respuesta genérica no puntúa como correcta", () => {
    const problems: string[] = [];
    for (const practice of debugs) {
      if (evaluateDebug(practice, practice.symptom).status === "correct") problems.push(`${practice.id}: repetir el síntoma puntúa correct`);
      const generic = evaluateDebug(practice, "revisar la configuración, volver a ejecutar y reiniciar todo, no sé");
      if (generic.status !== "incorrect") problems.push(`${practice.id}: una respuesta genérica puntúa ${generic.status}`);
    }
    expect(problems).toEqual([]);
  });
});
