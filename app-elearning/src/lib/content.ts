import fs from "fs";
import path from "path";
import type { LevelId } from "./i18n";
import { LEVEL_MODULE_RANGE } from "./i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModuleInfo {
  id: string;           // "basico-1", "intermedio-9", etc.
  moduleId: number;     // 1–41
  levelId: LevelId;
  title: string;
  slug: string;         // URL-safe identifier
  estimatedMinutes: number;
  rawContent: string;   // full markdown of the module section
}

export interface LevelInfo {
  id: LevelId;
  title: string;
  description: string;
  certification: string;
  modules: ModuleInfo[];
  rawContent: string;   // full level file content
}

export interface ResourcePage {
  id: string;
  slug: string;
  title: string;
  rawContent: string;
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const DOCS_DIR = path.resolve(process.cwd(), "../docs");

const LEVEL_FILES: Record<LevelId, string> = {
  basico: "Niveles/NIVEL_1_BASICO.md",
  intermedio: "Niveles/NIVEL_2_INTERMEDIO.md",
  avanzado: "Niveles/NIVEL_3_AVANZADO.md",
  arquitecto: "Niveles/NIVEL_4_ARQUITECTO.md",
};

const RESOURCE_FILES: Record<string, string> = {
  checklist: "Recursos/CHECKLIST_PROGRESO.md",
  glosario: "Recursos/GLOSARIO_TERMINOS.md",
  certificaciones: "Recursos/CERTIFICACIONES.md",
  "banco-preguntas": "Recursos/EVALUACIONES_MODULOS_CERTIFICACION.md",
  simulador: "Recursos/SIMULADOR_EVALUACIONES.md",
};

const LEVEL_META: Record<LevelId, { title: string; description: string; certification: string }> = {
  basico: {
    title: "Nivel 1 — Básico",
    description: "Fundamentos de Power Platform y Dataverse",
    certification: "PL-900",
  },
  intermedio: {
    title: "Nivel 2 — Intermedio",
    description: "Canvas Apps, Model-Driven, Power Automate y Power BI avanzados",
    certification: "PL-200",
  },
  avanzado: {
    title: "Nivel 3 — Avanzado",
    description: "Arquitectura, ALM, D365, Copilot Studio y extensibilidad",
    certification: "PL-400",
  },
  arquitecto: {
    title: "Nivel 4 — Arquitecto",
    description: "Gobernanza enterprise, multi-tenant, Azure integrations y liderazgo",
    certification: "PL-600",
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function estimateReadingMinutes(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(5, Math.ceil(wordCount / wordsPerMinute));
}

function toSlug(title: string): string {
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

// ─── Module extraction ────────────────────────────────────────────────────────

function extractModulesFromContent(
  content: string,
  levelId: LevelId
): ModuleInfo[] {
  const [moduleStart, moduleEnd] = LEVEL_MODULE_RANGE[levelId];
  const modules: ModuleInfo[] = [];

  // Match Nivel 1 format: `### **Módulo N: Title**`
  // Match Niveles 2-4 format: `## MÓDULO N: Title`
  const modulePattern = /^#{2,3}\s+\*?\*?módulo\s+(\d+)[:\s]+(.+?)\*?\*?$/gim;
  // Filter to in-range matches BEFORE computing boundaries so that out-of-range
  // headings (e.g. Módulo 18 appearing inside a basico file) don't truncate the
  // preceding valid module's content.
  const validMatches = [...content.matchAll(modulePattern)].filter((m) => {
    const id = parseInt(m[1] ?? "0", 10);
    return id >= moduleStart && id <= moduleEnd;
  });

  validMatches.forEach((match, idx) => {
    const moduleId = parseInt(match[1] ?? "0", 10);

    const rawTitle = (match[2] ?? "").replace(/\*+/g, "").trim();
    const startPos = match.index ?? 0;
    const endPos = idx + 1 < validMatches.length ? (validMatches[idx + 1]!.index ?? content.length) : content.length;
    const sectionContent = content.slice(startPos, endPos).trim();

    modules.push({
      id: `${levelId}-${moduleId}`,
      moduleId,
      levelId,
      title: rawTitle,
      slug: toSlug(rawTitle),
      estimatedMinutes: estimateReadingMinutes(sectionContent),
      rawContent: sectionContent,
    });
  });

  return modules;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

let _levelsCache: LevelInfo[] | null = null;
let _resourcesCache: ResourcePage[] | null = null;

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllLevels(): LevelInfo[] {
  if (_levelsCache) return _levelsCache;

  const levels: LevelInfo[] = (Object.keys(LEVEL_FILES) as LevelId[]).map((levelId) => {
    const filePath = path.join(DOCS_DIR, LEVEL_FILES[levelId]);
    let rawContent = "";

    try {
      rawContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      // File may not exist yet (Niveles 2-4 placeholders)
      rawContent = `# ${LEVEL_META[levelId].title}\n\nContenido en desarrollo.`;
    }

    const meta = LEVEL_META[levelId];
    const modules = extractModulesFromContent(rawContent, levelId);

    return {
      id: levelId,
      ...meta,
      modules,
      rawContent,
    };
  });

  _levelsCache = levels;
  return levels;
}

export function getLevelById(levelId: LevelId): LevelInfo | undefined {
  return getAllLevels().find((l) => l.id === levelId);
}

export function getModuleById(levelId: LevelId, moduleId: number): ModuleInfo | undefined {
  const level = getLevelById(levelId);
  return level?.modules.find((m) => m.moduleId === moduleId);
}

export function getModuleBySlug(levelId: LevelId, slug: string): ModuleInfo | undefined {
  const level = getLevelById(levelId);
  return level?.modules.find((m) => m.slug === slug);
}

export function getAllModules(): ModuleInfo[] {
  return getAllLevels().flatMap((l) => l.modules);
}

export function getAllResourcePages(): ResourcePage[] {
  if (_resourcesCache) return _resourcesCache;

  const pages: ResourcePage[] = Object.entries(RESOURCE_FILES).map(([slug, filePath]) => {
    const fullPath = path.join(DOCS_DIR, filePath);
    let rawContent = "";
    let title = slug;

    try {
      rawContent = fs.readFileSync(fullPath, "utf-8");
      const titleMatch = rawContent.match(/^#\s+(.+)$/m);
      if (titleMatch?.[1]) title = titleMatch[1].replace(/[🎯📝✅📖🏆]/gu, "").trim();
    } catch {
      rawContent = "# Contenido no disponible";
    }

    return { id: slug, slug, title, rawContent };
  });

  _resourcesCache = pages;
  return pages;
}

export function getResourceBySlug(slug: string): ResourcePage | undefined {
  return getAllResourcePages().find((r) => r.slug === slug);
}

// ─── Search index ─────────────────────────────────────────────────────────────

export interface SearchDocument {
  id: string;
  title: string;
  levelId: string;
  moduleId: number;
  content: string;
}

export function getSearchDocuments(): SearchDocument[] {
  return getAllModules().map((m) => ({
    id: m.id,
    title: m.title,
    levelId: m.levelId,
    moduleId: m.moduleId,
    content: m.rawContent.replace(/^#{1,6}\s+/gm, "").slice(0, 2000),
  }));
}
