import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { LevelId } from "./i18n";
import { LEVEL_MODULE_RANGE } from "./i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModuleInfo {
  id: string;           // "basico-1"
  moduleId: number;     // 1–41
  levelId: LevelId;
  title: string;
  slug: string;
  estimatedMinutes: number;
  rawContent: string;
}

export interface LevelInfo {
  id: LevelId;
  title: string;
  description: string;
  certification: string;
  modules: ModuleInfo[];
  rawContent: string;
}

export interface ResourcePage {
  id: string;
  slug: string;
  title: string;
  rawContent: string;
}

export interface LabInfo {
  id: string;        // "lab-02"
  slug: string;      // filename without .md
  title: string;
  level: string;     // "N1" | "N2" | "N3" | "N4"
  duration: number;  // minutes
  products: string[];
  certifications: string[];
  role: string[];
  prerequisites: string[];
  rawContent: string;
}

// ─── Paths ────────────────────────────────────────────────────────────────────

// app-elearning/content/ is the new authoritative content directory.
// Falls back to ../docs for modules not yet migrated to individual files.
const APP_CONTENT_DIR = path.resolve(process.cwd(), "content");
const MODULES_DIR = path.join(APP_CONTENT_DIR, "modules");
const LABS_DIR = path.join(APP_CONTENT_DIR, "labs");

// Legacy docs dir (fallback for non-migrated modules and resources)
const DOCS_DIR = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.resolve(process.cwd(), "../docs");

const LEVEL_FILES: Record<LevelId, string> = {
  basico: "Niveles/NIVEL_1_BASICO.md",
  intermedio: "Niveles/NIVEL_2_INTERMEDIO.md",
  avanzado: "Niveles/NIVEL_3_AVANZADO.md",
  arquitecto: "Niveles/NIVEL_4_ARQUITECTO.md",
};

const RESOURCE_FILES: Record<string, string> = {
  checklist:               "Recursos/CHECKLIST_PROGRESO.md",
  glosario:                "Recursos/GLOSARIO_TERMINOS.md",
  certificaciones:         "Recursos/CERTIFICACIONES.md",
  "banco-preguntas":       "Recursos/EVALUACIONES_MODULOS_CERTIFICACION.md",
  simulador:               "Recursos/SIMULADOR_EVALUACIONES.md",
  "lenguajes-programacion":"Anexos/LENGUAJES_PROGRAMACION.md",
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

// Parses duration from frontmatter — handles both `90` (number) and `"90 min"` (string)
export function parseDuration(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }
  return 0;
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

// ─── New: individual module files with frontmatter ────────────────────────────

function loadModulesFromDir(levelId: LevelId): Map<number, ModuleInfo> {
  const dir = path.join(MODULES_DIR, levelId);
  const result = new Map<number, ModuleInfo>();

  if (!fs.existsSync(dir)) return result;

  const files = fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const moduleId = Number(data["moduleId"]);
      if (!moduleId) continue;

      result.set(moduleId, {
        id: `${levelId}-${moduleId}`,
        moduleId,
        levelId,
        title: String(data["title"] ?? ""),
        slug: String(data["slug"] ?? toSlug(String(data["title"] ?? ""))),
        estimatedMinutes: Number(data["estimatedMinutes"]) || estimateReadingMinutes(content),
        rawContent: content,
      });
    } catch {
      // Skip malformed files silently
    }
  }

  return result;
}

// ─── Legacy: regex extraction from monolithic NIVEL files ────────────────────

function extractModulesFromContent(content: string, levelId: LevelId): ModuleInfo[] {
  const [moduleStart, moduleEnd] = LEVEL_MODULE_RANGE[levelId];
  const modules: ModuleInfo[] = [];
  const modulePattern = /^#{2,3}\s+\*?\*?módulo\s+(\d+)[:\s]+(.+?)\*?\*?$/gim;

  const validMatches = [...content.matchAll(modulePattern)].filter((m) => {
    const id = parseInt(m[1] ?? "0", 10);
    return id >= moduleStart && id <= moduleEnd;
  });

  validMatches.forEach((match, idx) => {
    const moduleId = parseInt(match[1] ?? "0", 10);
    const rawTitle = (match[2] ?? "").replace(/\*+/g, "").trim();
    const startPos = match.index ?? 0;
    const endPos =
      idx + 1 < validMatches.length
        ? (validMatches[idx + 1]!.index ?? content.length)
        : content.length;
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

// ─── Merged module loading (new files take precedence) ───────────────────────

function loadModulesForLevel(levelId: LevelId, rawLevelContent: string): ModuleInfo[] {
  // 1. Load migrated individual files
  const fromFiles = loadModulesFromDir(levelId);

  // 2. Load legacy modules from monolithic file
  const fromLegacy = extractModulesFromContent(rawLevelContent, levelId);

  // 3. Merge: individual file wins over legacy for same moduleId
  const merged = new Map<number, ModuleInfo>();
  for (const mod of fromLegacy) {
    merged.set(mod.moduleId, mod);
  }
  for (const [moduleId, mod] of fromFiles) {
    merged.set(moduleId, mod); // override legacy
  }

  return [...merged.values()].sort((a, b) => a.moduleId - b.moduleId);
}

// ─── Cache ────────────────────────────────────────────────────────────────────

let _levelsCache: LevelInfo[] | null = null;
let _resourcesCache: ResourcePage[] | null = null;
let _labsCache: LabInfo[] | null = null;

// ─── Public API — Levels & Modules ───────────────────────────────────────────

export function getAllLevels(): LevelInfo[] {
  if (_levelsCache) return _levelsCache;

  const levels: LevelInfo[] = (Object.keys(LEVEL_FILES) as LevelId[]).map((levelId) => {
    const filePath = path.join(DOCS_DIR, LEVEL_FILES[levelId]);
    let rawContent = "";

    try {
      rawContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      rawContent = `# ${LEVEL_META[levelId].title}\n\nContenido en desarrollo.`;
    }

    const meta = LEVEL_META[levelId];
    const modules = loadModulesForLevel(levelId, rawContent);

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

// ─── Public API — Resources ───────────────────────────────────────────────────

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

// ─── Public API — Labs ────────────────────────────────────────────────────────

export function getAllLabs(): LabInfo[] {
  if (_labsCache) return _labsCache;

  if (!fs.existsSync(LABS_DIR)) {
    _labsCache = [];
    return _labsCache;
  }

  const files = fs.readdirSync(LABS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const labs: LabInfo[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(LABS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");

      labs.push({
        id: String(data["id"] ?? slug),
        slug,
        title: String(data["title"] ?? slug),
        level: String(data["level"] ?? ""),
        duration: parseDuration(data["duration"]),
        products: Array.isArray(data["product"]) ? (data["product"] as string[]) : [],
        certifications: Array.isArray(data["certifications"]) ? (data["certifications"] as string[]) : [],
        role: Array.isArray(data["role"]) ? (data["role"] as string[]) : [],
        prerequisites: Array.isArray(data["prerequisites"]) ? (data["prerequisites"] as string[]) : [],
        rawContent: content,
      });
    } catch {
      // Skip malformed lab files
    }
  }

  _labsCache = labs;
  return labs;
}

export function getLabBySlug(slug: string): LabInfo | undefined {
  return getAllLabs().find((l) => l.slug === slug);
}

// ─── Search index ─────────────────────────────────────────────────────────────

export type SearchDocumentType = "module" | "lab";

export interface SearchDocument {
  id: string;
  title: string;
  // Module-specific
  levelId: string;
  moduleId: number;
  slug: string;
  // Discriminator
  type: SearchDocumentType;
  // Used to build href
  href: string;
  content: string;
}

export function getSearchDocuments(): SearchDocument[] {
  const moduleDocs: SearchDocument[] = getAllModules().map((m) => ({
    id: `module-${m.id}`,
    title: m.title,
    levelId: m.levelId,
    moduleId: m.moduleId,
    slug: m.slug,
    type: "module" as const,
    href: `/nivel/${m.levelId}/modulo/${m.slug}`,
    content: m.rawContent.replace(/^#{1,6}\s+/gm, "").slice(0, 2000),
  }));

  const labDocs: SearchDocument[] = getAllLabs().map((lab) => ({
    id: lab.slug,
    title: lab.title,
    levelId: lab.level,
    moduleId: 0,
    slug: lab.slug,
    type: "lab" as const,
    href: `/labs/${lab.slug}`,
    content: lab.rawContent.replace(/^#{1,6}\s+/gm, "").slice(0, 2000),
  }));

  return [...moduleDocs, ...labDocs];
}
