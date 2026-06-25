#!/usr/bin/env node
/**
 * migrate-modules.mjs
 *
 * Extracts individual module files from the monolithic NIVEL_X.md files and
 * writes them to app-elearning/content/modules/[level]/ with YAML frontmatter.
 *
 * Usage (from repo root):
 *   node scripts/migrate-modules.mjs              # migrate all 41 modules
 *   node scripts/migrate-modules.mjs basico 1 2   # migrate only modules 1 and 2 of basico
 *
 * After running, the content/modules/ tree is the authoritative source for
 * any migrated modules. Non-migrated modules still fall back to the NIVEL file.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const docsNiveles = resolve(repoRoot, "docs/Niveles");
const outputBase = resolve(repoRoot, "app-elearning/content/modules");

// ─── Config ───────────────────────────────────────────────────────────────────

const LEVELS = {
  basico: {
    file: "NIVEL_1_BASICO.md",
    range: [1, 8],
    certification: "PL-900",
  },
  intermedio: {
    file: "NIVEL_2_INTERMEDIO.md",
    range: [9, 17],
    certification: "PL-200",
  },
  avanzado: {
    file: "NIVEL_3_AVANZADO.md",
    range: [18, 30],
    certification: "PL-400",
  },
  arquitecto: {
    file: "NIVEL_4_ARQUITECTO.md",
    range: [31, 41],
    certification: "PL-600",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function estimateMinutes(text) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(5, Math.ceil(wordCount / wordsPerMinute));
}

function zeroPad(n) {
  return String(n).padStart(2, "0");
}

// ─── Module extractor ─────────────────────────────────────────────────────────

function extractModules(content, levelId, range) {
  const [moduleStart, moduleEnd] = range;
  const modulePattern = /^#{2,3}\s+\*?\*?módulo\s+(\d+)[:\s]+(.+?)\*?\*?$/gim;

  const allMatches = [...content.matchAll(modulePattern)];
  const validMatches = allMatches.filter((m) => {
    const id = parseInt(m[1] ?? "0", 10);
    return id >= moduleStart && id <= moduleEnd;
  });

  return validMatches.map((match, idx) => {
    const moduleId = parseInt(match[1] ?? "0", 10);
    const rawTitle = (match[2] ?? "").replace(/\*+/g, "").trim();
    const startPos = match.index ?? 0;
    const endPos =
      idx + 1 < validMatches.length
        ? validMatches[idx + 1].index ?? content.length
        : content.length;

    // Body is everything after the heading line, trimmed
    const headingEnd = startPos + match[0].length;
    const body = content.slice(headingEnd, endPos).trim();

    return { moduleId, rawTitle, body };
  });
}

// ─── Write module file ────────────────────────────────────────────────────────

function writeModu(levelId, mod, certification) {
  const { moduleId, rawTitle, body } = mod;
  const slug = toSlug(rawTitle);
  const estimatedMinutes = estimateMinutes(body);

  const frontmatter = [
    "---",
    `moduleId: ${moduleId}`,
    `title: "${rawTitle.replace(/"/g, '\\"')}"`,
    `level: "${levelId}"`,
    `certification: "${certification}"`,
    `estimatedMinutes: ${estimatedMinutes}`,
    `slug: "${slug}"`,
    "---",
    "",
  ].join("\n");

  const fileContent = frontmatter + body + "\n";
  const fileName = `${zeroPad(moduleId)}-${slug}.md`;
  const outDir = resolve(outputBase, levelId);

  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, fileName);
  writeFileSync(outPath, fileContent, "utf-8");

  return { fileName, slug, estimatedMinutes };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const filterLevel = args[0]; // optional: "basico"
const filterIds = args.slice(1).map(Number); // optional: [1, 2]

let totalWritten = 0;

for (const [levelId, cfg] of Object.entries(LEVELS)) {
  if (filterLevel && filterLevel !== levelId) continue;

  const sourceFile = resolve(docsNiveles, cfg.file);
  if (!existsSync(sourceFile)) {
    console.warn(`  SKIP (not found): ${sourceFile}`);
    continue;
  }

  const content = readFileSync(sourceFile, "utf-8");
  const modules = extractModules(content, levelId, cfg.range);

  console.log(`\n[${levelId}] Found ${modules.length} modules in ${cfg.file}`);

  for (const mod of modules) {
    if (filterIds.length > 0 && !filterIds.includes(mod.moduleId)) continue;

    const result = writeModu(levelId, mod, cfg.certification);
    console.log(
      `  ✓ ${result.fileName}  (${result.estimatedMinutes} min, slug: ${result.slug})`
    );
    totalWritten++;
  }
}

console.log(`\n✓ Done — ${totalWritten} module file(s) written to app-elearning/content/modules/`);
