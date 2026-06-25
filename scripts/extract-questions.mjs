#!/usr/bin/env node
/**
 * extract-questions.mjs
 *
 * Reads MODULE_QUESTIONS from docs/javascripts/evaluaciones-simulador.js
 * and writes app-elearning/src/data/questions.ts — eliminating the runtime
 * dependency on new Function() in the production build.
 *
 * Usage (from repo root):
 *   node scripts/extract-questions.mjs
 *
 * Also invoked automatically as a prebuild step:
 *   cd app-elearning && npm run build   (runs prebuild first)
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createContext, runInContext } from "vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const INPUT = resolve(repoRoot, "docs/javascripts/evaluaciones-simulador.js");
const OUTPUT = resolve(repoRoot, "app-elearning/src/data/questions.ts");

// ─── Extract object literal via brace-counting (mirrors questions-parser.ts) ──

function extractObjectLiteral(source, startMarker) {
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) return null;
  const openBraceIdx = startIdx + startMarker.length - 1;
  let depth = 0;
  let inString = null;

  for (let i = openBraceIdx; i < source.length; i++) {
    const ch = source[i];
    if (inString !== null) {
      if (ch === "\\") { i++; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(openBraceIdx, i + 1);
    }
  }
  return null;
}

// ─── Read and parse ────────────────────────────────────────────────────────────

console.log(`Reading: ${INPUT}`);
const source = readFileSync(INPUT, "utf-8");

const literal = extractObjectLiteral(source, "const MODULE_QUESTIONS = {");
if (!literal) {
  console.error("ERROR: Could not find MODULE_QUESTIONS in the source file.");
  process.exit(1);
}

// Evaluate in an isolated VM context (safe: we control the source file)
const ctx = createContext({});
runInContext(`globalThis.MODULE_QUESTIONS = ${literal}`, ctx);
const mq = ctx.MODULE_QUESTIONS;

const moduleIds = Object.keys(mq).map(Number).sort((a, b) => a - b);
let totalQuestions = 0;
moduleIds.forEach((id) => { totalQuestions += mq[id].length; });
console.log(`Found ${moduleIds.length} modules, ${totalQuestions} questions total.`);

// ─── Validate before writing ───────────────────────────────────────────────────

const errors = [];
const seenIds = new Set();

moduleIds.forEach((moduleId) => {
  mq[moduleId].forEach((q, idx) => {
    const qid = `module-${moduleId}-${idx}`;

    if (seenIds.has(qid)) errors.push(`Duplicate ID: ${qid}`);
    seenIds.add(qid);

    if (!q.prompt || typeof q.prompt !== "string")
      errors.push(`${qid}: missing prompt`);

    if (!Array.isArray(q.options) || q.options.length < 2)
      errors.push(`${qid}: options must have at least 2 entries`);

    if (!Array.isArray(q.answer) || q.answer.length === 0)
      errors.push(`${qid}: answer array is empty`);

    q.answer.forEach((a) => {
      if (typeof a !== "number" || a < 0 || a >= (q.options?.length ?? 0))
        errors.push(`${qid}: answer index ${a} out of range (${q.options?.length} options)`);
    });

    if (!["single", "multi"].includes(q.type))
      errors.push(`${qid}: invalid type "${q.type}"`);
  });
});

if (errors.length > 0) {
  console.error(`\nValidation errors (${errors.length}):`);
  errors.forEach((e) => console.error("  ✗", e));
  process.exit(1);
}

console.log("✓ All questions validated.");

// ─── Serialize to TypeScript ───────────────────────────────────────────────────

function escapeStr(s) {
  return JSON.stringify(s); // produces valid TS string literal with proper escaping
}

function serializeQuestion(q, indent) {
  const pad = " ".repeat(indent);
  const optionsStr = q.options.map((o) => `${pad}    ${escapeStr(o)}`).join(",\n");
  const answerStr = q.answer.join(", ");
  return [
    `${pad}  {`,
    `${pad}    type: "${q.type}",`,
    `${pad}    prompt: ${escapeStr(q.prompt)},`,
    `${pad}    options: [`,
    optionsStr,
    `${pad}    ],`,
    `${pad}    answer: [${answerStr}],`,
    `${pad}    explanation: ${escapeStr(q.explanation ?? "")},`,
    `${pad}  }`,
  ].join("\n");
}

const moduleBlocks = moduleIds.map((moduleId) => {
  const qs = mq[moduleId].map((q) => serializeQuestion(q, 2)).join(",\n");
  return `  ${moduleId}: [\n${qs},\n  ]`;
}).join(",\n");

const output = `// AUTO-GENERATED — do not edit manually.
// Source: docs/javascripts/evaluaciones-simulador.js
// Regenerate: node scripts/extract-questions.mjs  (or: cd app-elearning && npm run build)
//
// ${moduleIds.length} modules, ${totalQuestions} questions total.

export type QuestionType = "single" | "multi";

export interface RawQuestion {
  type: QuestionType;
  prompt: string;
  options: string[];
  answer: number[];   // 0-based indices of correct options
  explanation: string;
}

const MODULE_QUESTIONS: Record<number, RawQuestion[]> = {
${moduleBlocks},
};

export default MODULE_QUESTIONS;
`;

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, output, "utf-8");
console.log(`✓ Written: ${OUTPUT}`);
console.log(`  ${output.split("\n").length} lines`);
