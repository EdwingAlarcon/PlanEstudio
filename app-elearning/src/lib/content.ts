import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { LevelId } from "./i18n";
import { LEVEL_MODULE_RANGE, LEVEL_ORDER } from "./i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModuleInfo {
  id: string;           // "basico-1"
  moduleId: number;     // 1-65
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
  displayId: string; // "LAB-002"
  slug: string;      // filename without .md
  title: string;
  level: string;     // "N1" | "N2" | "N3" | "N4" | "N5"
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
  ia: "Niveles/NIVEL_5_IA.md",
  d365: "Niveles/NIVEL_6_D365.md",
};

const RESOURCE_FILES: Record<string, string> = {
  checklist:               "Recursos/CHECKLIST_PROGRESO.md",
  glosario:                "Recursos/GLOSARIO_TERMINOS.md",
  certificaciones:         "Recursos/CERTIFICACIONES.md",
  "banco-preguntas":       "Recursos/EVALUACIONES_MODULOS_CERTIFICACION.md",
  "lenguajes-programacion":"Anexos/LENGUAJES_PROGRAMACION.md",
  "prompts-ia":             "Recursos/PROMPTS_REUTILIZABLES_IA.md",
  "rubricas-plantillas":    "Recursos/RUBRICAS_PLANTILLAS_EVALUACION.md",
  "matriz-competencias":    "Recursos/MATRIZ_COMPETENCIAS.md",
  "matriz-skills-laborales": "Recursos/MATRIZ_SKILLS_LABORALES.md",
  "job-ready-crm-developer": "Recursos/JOB_READY_CRM_DEVELOPER.md",
  "job-ready-crm-functional": "Recursos/JOB_READY_CRM_FUNCTIONAL.md",
  "job-ready-data-migration-legacy": "Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md",
  "job-ready-interview-readiness": "Recursos/JOB_READY_INTERVIEW_READINESS.md",
  "job-ready-admin-governance": "Recursos/JOB_READY_ADMIN_GOVERNANCE.md",
  "portafolio-profesional": "Recursos/PORTAFOLIO_PROFESIONAL.md",
  "roadmap-especializacion-avanzada": "Recursos/ROADMAP_ESPECIALIZACION_AVANZADA.md",
  "d365-tenant-readiness": "Recursos/D365_TENANT_READINESS.md",
  "marco-practicas-profesionales": "Recursos/MARCO_PRACTICAS_PROFESIONALES.md",
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
    certification: "PL-200 (retira 31 ago 2026)",
  },
  avanzado: {
    title: "Nivel 3 — Avanzado",
    description: "Arquitectura, ALM, D365, Copilot Studio y extensibilidad",
    certification: "PL-400",
  },
  arquitecto: {
    title: "Nivel 4 — Arquitecto",
    description: "Gobernanza enterprise, multi-tenant, Azure integrations y liderazgo",
    certification: "Arquitectura Power Platform",
  },
  ia: {
    title: "Desarrollo Asistido por IA",
    description: "Copilot, GitHub Copilot, Claude Code y Codex aplicados de forma segura y auditable al desarrollo en Power Platform y D365",
    certification: "Buenas Prácticas",
  },
  d365: {
    title: "Dynamics 365 Especialización — CE avanzado + F&O Awareness",
    description: "Especialización práctica en Dynamics 365: Customer Engagement avanzado, Customer Insights, Field Service, integración CE + F&O y awareness avanzado de Finance & Operations",
    certification: "CE avanzado + F&O Awareness",
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

function failContent(filePath: string, message: string): never {
  throw new ContentValidationError(`${filePath}: ${message}`);
}

function estimateReadingMinutes(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(5, Math.ceil(wordCount / wordsPerMinute));
}

function readRequiredFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    failContent(filePath, "archivo requerido no encontrado");
  }

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failContent(filePath, `no se pudo leer el archivo: ${message}`);
  }
}

function requireString(data: Record<string, unknown>, key: string, filePath: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    failContent(filePath, `frontmatter '${key}' debe ser un texto no vacío`);
  }
  return value.trim();
}

function requireStringArray(data: Record<string, unknown>, key: string, filePath: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
    failContent(filePath, `frontmatter '${key}' debe ser una lista de textos no vacíos`);
  }
  return value.map((item) => String(item).trim());
}

function validateModuleFrontmatter(
  data: Record<string, unknown>,
  levelId: LevelId,
  filePath: string,
): Omit<ModuleInfo, "id" | "rawContent"> {
  const moduleId = Number(data["moduleId"]);
  const [minModuleId, maxModuleId] = LEVEL_MODULE_RANGE[levelId];
  if (!Number.isInteger(moduleId) || moduleId < minModuleId || moduleId > maxModuleId) {
    failContent(filePath, `frontmatter 'moduleId' debe ser un entero entre ${minModuleId} y ${maxModuleId}`);
  }

  const declaredLevel = requireString(data, "level", filePath);
  if (declaredLevel !== levelId) {
    failContent(filePath, `frontmatter 'level' debe ser '${levelId}', recibido '${declaredLevel}'`);
  }

  const title = requireString(data, "title", filePath);
  const slug = requireString(data, "slug", filePath);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    failContent(filePath, `frontmatter 'slug' debe usar kebab-case ASCII, recibido '${slug}'`);
  }

  const estimatedMinutes = Number(data["estimatedMinutes"]);
  if (!Number.isFinite(estimatedMinutes) || estimatedMinutes <= 0) {
    failContent(filePath, "frontmatter 'estimatedMinutes' debe ser un número positivo");
  }

  return { moduleId, levelId, title, slug, estimatedMinutes };
}

export function formatLabDisplayId(idOrSlug: string): string {
  const match = idOrSlug.match(/^lab-(\d{2,3})(?:-|$)/);
  if (!match?.[1]) return idOrSlug.toUpperCase();
  return `LAB-${match[1].padStart(3, "0")}`;
}

export function formatLabReadableId(idOrSlug: string): string {
  const match = idOrSlug.match(/^lab-(\d{2,3})(?:-|$)/);
  if (!match?.[1]) return idOrSlug;
  return `Lab ${Number(match[1])}`;
}

function deriveLabIdFromSlug(slug: string, filePath: string): string {
  const match = slug.match(/^lab-(\d{2,3})(?:-|$)/);
  if (!match?.[1]) {
    failContent(filePath, `slug de lab debe iniciar con lab-NN, recibido '${slug}'`);
  }
  return `lab-${match[1].padStart(2, "0")}`;
}

function validateLabFrontmatter(
  data: Record<string, unknown>,
  filePath: string,
  slug: string,
): Omit<LabInfo, "slug" | "rawContent"> {
  const rawId = data["id"];
  const id = typeof rawId === "string" && rawId.trim().length > 0
    ? rawId.trim()
    : deriveLabIdFromSlug(slug, filePath);

  if (!/^lab-\d{2,3}$/.test(id)) {
    failContent(filePath, `frontmatter 'id' debe usar el formato lab-NN, recibido '${id}'`);
  }

  const slugId = deriveLabIdFromSlug(slug, filePath);
  if (id !== slugId) {
    failContent(filePath, `frontmatter 'id' (${id}) debe coincidir con el identificador del archivo (${slugId})`);
  }

  const title = requireString(data, "title", filePath);
  const level = requireString(data, "level", filePath);
  if (!["N1", "N2", "N3", "N4", "N5", "N6"].includes(level)) {
    failContent(filePath, `frontmatter 'level' debe ser N1, N2, N3, N4, N5 o N6, recibido '${level}'`);
  }

  const duration = parseDuration(data["duration"]);
  if (duration <= 0) {
    failContent(filePath, "frontmatter 'duration' debe ser un número positivo o texto con minutos");
  }

  return {
    id,
    displayId: formatLabDisplayId(id),
    title,
    level,
    duration,
    products: requireStringArray(data, "product", filePath),
    certifications: requireStringArray(data, "certifications", filePath),
    role: requireStringArray(data, "role", filePath),
    prerequisites: requireStringArray(data, "prerequisites", filePath),
  };
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
    const filePath = path.join(dir, file);
    const raw = readRequiredFile(filePath);
    const { data, content } = matter(raw);
    const meta = validateModuleFrontmatter(data, levelId, filePath);

    if (result.has(meta.moduleId)) {
      failContent(filePath, `moduleId duplicado en el nivel '${levelId}': ${meta.moduleId}`);
    }

    result.set(meta.moduleId, {
      id: `${levelId}-${meta.moduleId}`,
      ...meta,
      rawContent: content,
    });
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

  const modules = [...merged.values()].sort((a, b) => a.moduleId - b.moduleId);
  validateUniqueModules(modules, levelId);
  return modules;
}

function validateUniqueModules(modules: ModuleInfo[], levelId: LevelId): void {
  const seenIds = new Set<number>();
  const seenSlugs = new Set<string>();

  for (const mod of modules) {
    if (seenIds.has(mod.moduleId)) {
      failContent(`modules/${levelId}`, `moduleId duplicado: ${mod.moduleId}`);
    }
    if (seenSlugs.has(mod.slug)) {
      failContent(`modules/${levelId}`, `slug duplicado: ${mod.slug}`);
    }
    seenIds.add(mod.moduleId);
    seenSlugs.add(mod.slug);
  }
}

function validateAllModules(levels: LevelInfo[]): void {
  const seenIds = new Map<number, string>();
  const seenSlugs = new Map<string, string>();

  for (const level of levels) {
    const [minModuleId, maxModuleId] = LEVEL_MODULE_RANGE[level.id];
    for (const mod of level.modules) {
      if (mod.moduleId < minModuleId || mod.moduleId > maxModuleId) {
        failContent(`modules/${level.id}`, `moduleId ${mod.moduleId} fuera del rango ${minModuleId}-${maxModuleId}`);
      }

      const previousId = seenIds.get(mod.moduleId);
      if (previousId) {
        failContent(`modules/${level.id}`, `moduleId global duplicado ${mod.moduleId}; ya existe en ${previousId}`);
      }
      seenIds.set(mod.moduleId, mod.id);

      const previousSlug = seenSlugs.get(mod.slug);
      if (previousSlug) {
        failContent(`modules/${level.id}`, `slug global duplicado '${mod.slug}'; ya existe en ${previousSlug}`);
      }
      seenSlugs.set(mod.slug, mod.id);
    }
  }
}

function validateLabs(labs: LabInfo[]): void {
  const seenIds = new Map<string, string>();
  const seenSlugs = new Set<string>();

  for (const lab of labs) {
    if (seenIds.has(lab.id)) {
      failContent(`labs/${lab.slug}`, `id duplicado '${lab.id}'; ya existe en ${seenIds.get(lab.id)}`);
    }
    if (seenSlugs.has(lab.slug)) {
      failContent(`labs/${lab.slug}`, `slug duplicado '${lab.slug}'`);
    }
    seenIds.set(lab.id, lab.slug);
    seenSlugs.add(lab.slug);
  }
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
    const rawContent = readRequiredFile(filePath);

    const meta = LEVEL_META[levelId];
    const modules = loadModulesForLevel(levelId, rawContent);

    return {
      id: levelId,
      ...meta,
      modules,
      rawContent,
    };
  });

  validateAllModules(levels);
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

    rawContent = readRequiredFile(fullPath);
    const titleMatch = rawContent.match(/^#\s+(.+)$/m);
    if (titleMatch?.[1]) title = titleMatch[1].replace(/[🎯📝✅📖🏆]/gu, "").trim();

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
    failContent(LABS_DIR, "directorio requerido de laboratorios no encontrado");
  }

  const files = fs.readdirSync(LABS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const labs: LabInfo[] = [];

  for (const file of files) {
    const filePath = path.join(LABS_DIR, file);
    const raw = readRequiredFile(filePath);
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const meta = validateLabFrontmatter(data, filePath, slug);

    labs.push({
      ...meta,
      slug,
      rawContent: content,
    });
  }

  validateLabs(labs);
  _labsCache = labs;
  return labs;
}

export function getLabBySlug(slug: string): LabInfo | undefined {
  return getAllLabs().find((l) => l.slug === slug);
}

// "N1".."N5" (lab frontmatter) map 1:1 to LEVEL_ORDER's position ("basico".."ia").
export function getLabsForLevel(levelId: LevelId): LabInfo[] {
  const levelTag = `N${LEVEL_ORDER.indexOf(levelId) + 1}`;
  return getAllLabs().filter((lab) => lab.level === levelTag);
}

// ─── Search index ─────────────────────────────────────────────────────────────

export type SearchDocumentType = "module" | "lab" | "resource" | "incident" | "challenge" | "simulation" | "guided" | "semi-guided";

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
  practiceId?: string;
  practiceType?: SearchDocumentType;
  practiceDomain?: string;
  practiceDifficulty?: string;
  practiceRoles?: string[];
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
    title: `${lab.displayId} · ${formatLabReadableId(lab.id)} · ${lab.title}`,
    levelId: lab.level,
    moduleId: 0,
    slug: lab.slug,
    type: "lab" as const,
    href: `/labs/${lab.slug}`,
    content: `${lab.displayId} ${formatLabReadableId(lab.id)} ${lab.id} ${lab.slug} ${lab.title}\n${lab.rawContent.replace(/^#{1,6}\s+/gm, "")}`.slice(0, 2000),
  }));
  const resourceDocs: SearchDocument[] = getAllResourcePages().map((resource) => ({
    id: `resource-${resource.slug}`,
    title: resource.title,
    levelId: "",
    moduleId: 0,
    slug: resource.slug,
    type: "resource" as const,
    href: `/recursos/${resource.slug}`,
    content: `${resource.title}\n${resource.rawContent.replace(/^#{1,6}\s+/gm, "")}`.slice(0, 2000),
  }));

  return [...moduleDocs, ...labDocs, ...resourceDocs];
}
