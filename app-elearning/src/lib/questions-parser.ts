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

// ─── String-aware brace extractor ────────────────────────────────────────────
// Tracks single/double/template-literal quotes so that `{` and `}` inside
// strings are not counted toward brace depth.

function extractObjectLiteral(source: string, startMarker: string): string | null {
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) return null;

  // startMarker ends with `{`, so this index points at the opening brace.
  const openBraceIdx = startIdx + startMarker.length - 1;
  let depth = 0;
  let inString: '"' | "'" | "`" | null = null;

  for (let i = openBraceIdx; i < source.length; i++) {
    const ch = source[i];

    if (inString !== null) {
      if (ch === "\\") {
        i++; // skip escaped character
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return source.slice(openBraceIdx, i + 1);
      }
    }
  }

  return null; // unbalanced braces — never reached with valid JS
}

// ─── Parse MODULE_QUESTIONS from the IIFE JS at build time ───────────────────

let _cache: Question[] | null = null;

export function getAllQuestions(): Question[] {
  if (_cache) return _cache;

  const jsPath = path.resolve(
    process.cwd(),
    "../docs/javascripts/evaluaciones-simulador.js"
  );

  let source: string;
  try {
    source = fs.readFileSync(jsPath, "utf-8");
  } catch {
    console.warn("[questions-parser] evaluaciones-simulador.js not found — quiz questions unavailable");
    _cache = [];
    return _cache;
  }

  const startMarker = "const MODULE_QUESTIONS = {";
  const objectLiteral = extractObjectLiteral(source, startMarker);
  if (!objectLiteral) {
    console.warn("[questions-parser] MODULE_QUESTIONS not found in evaluaciones-simulador.js");
    _cache = [];
    return _cache;
  }

  let moduleQuestions: Record<number, RawQuestion[]>;
  try {
    moduleQuestions = new Function(`"use strict"; return (${objectLiteral});`)() as Record<number, RawQuestion[]>; // nosemgrep: javascript.lang.security.dangerous-use-of-new-function
  } catch (err) {
    console.warn("[questions-parser] Failed to evaluate MODULE_QUESTIONS:", err);
    _cache = [];
    return _cache;
  }

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
