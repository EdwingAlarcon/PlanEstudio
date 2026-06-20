import fs from "fs";
import path from "path";
import type { Question, QuestionType } from "./quiz-engine";

// ─── Raw shape from the JS file ───────────────────────────────────────────────

interface RawQuestion {
  type: string;
  prompt: string;
  options: string[];
  answer: number[];
  explanation: string;
}

// ─── Parse MODULE_QUESTIONS from the IIFE JS at build time ───────────────────

let _cache: Question[] | null = null;

export function getAllQuestions(): Question[] {
  if (_cache) return _cache;

  const jsPath = path.resolve(
    process.cwd(),
    "../docs/javascripts/evaluaciones-simulador.js"
  );

  const source = fs.readFileSync(jsPath, "utf-8");

  // Extract the MODULE_QUESTIONS literal by isolating it from the IIFE
  // Pattern: `const MODULE_QUESTIONS = {` ... closing `};` before the simulator UI logic
  const startMarker = "const MODULE_QUESTIONS = {";
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) throw new Error("MODULE_QUESTIONS not found in evaluaciones-simulador.js");

  // Find the closing brace at depth 0 after the opening
  let depth = 0;
  let endIdx = startIdx + startMarker.length - 1; // position of the first `{`
  for (let i = endIdx; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  // Wrap in parentheses so we can JSON.parse-compatible evaluation via Function
  const objectLiteral = source.slice(startIdx + "const MODULE_QUESTIONS = ".length, endIdx + 1);

  // Use Function constructor to safely evaluate the JS object literal (no DOM access, no side effects)
  const moduleQuestions: Record<number, RawQuestion[]> = new Function(
    `"use strict"; return (${objectLiteral});`
  )() as Record<number, RawQuestion[]>;

  const questions: Question[] = [];

  for (const [moduleIdStr, rawQuestions] of Object.entries(moduleQuestions)) {
    const moduleId = Number(moduleIdStr);
    rawQuestions.forEach((raw, idx) => {
      questions.push({
        id: `module-${moduleId}-${idx}`,
        moduleId,
        type: raw.type as QuestionType,
        prompt: raw.prompt,
        options: raw.options,
        answer: raw.answer,
        explanation: raw.explanation,
      });
    });
  }

  _cache = questions;
  return questions;
}

export function getQuestionsForModule(moduleId: number): Question[] {
  return getAllQuestions().filter((q) => q.moduleId === moduleId);
}

export function getQuestionsForLevel(levelId: string): Question[] {
  const ranges: Record<string, [number, number]> = {
    basico: [1, 8],
    intermedio: [9, 17],
    avanzado: [18, 30],
    arquitecto: [31, 41],
  };
  const range = ranges[levelId];
  if (!range) return [];
  const [min, max] = range;
  return getAllQuestions().filter((q) => q.moduleId >= min && q.moduleId <= max);
}
