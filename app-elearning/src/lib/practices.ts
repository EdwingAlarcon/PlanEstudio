import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllLabs, getAllModules, ContentValidationError } from "./content";

export const PRACTICE_TYPES = ["guided", "semi-guided", "challenge", "incident", "simulation"] as const;
export const PRACTICE_DIFFICULTIES = ["foundation", "practitioner", "advanced", "expert"] as const;
export const PRACTICE_DOMAINS = [
  "configuration-implementation",
  "support-troubleshooting",
  "development-extensibility",
  "alm-deployment-operations",
  "consulting-functional-analysis",
  "architecture-governance",
] as const;
export const PRACTICE_ROLES = [
  "maker",
  "functional-consultant",
  "power-platform-developer",
  "dynamics-365-consultant",
  "administrator",
  "support-analyst",
  "solution-architect",
] as const;
export const EVIDENCE_TYPES = [
  "screenshot",
  "solution-export",
  "solution-checker",
  "source-code",
  "commit",
  "pull-request",
  "diagram",
  "data-model",
  "security-matrix",
  "user-story",
  "acceptance-criteria",
  "backlog",
  "test-plan",
  "test-results",
  "uat-signoff",
  "incident-report",
  "root-cause-analysis",
  "adr",
  "runbook",
  "deployment-plan",
  "rollback-plan",
  "reconciliation-report",
  "execution-log",
  "demo-video",
  "presentation",
  "retrospective",
] as const;
export const SOLUTION_AVAILABILITY = ["inline-collapsed", "after-attempt", "separate-file", "facilitator-only"] as const;
export const COVERAGE_STATES = ["covered", "partial", "guided-only", "not-evaluated", "not-covered"] as const;

export type PracticeType = typeof PRACTICE_TYPES[number];
export type PracticeDifficulty = typeof PRACTICE_DIFFICULTIES[number];
export type PracticeDomain = typeof PRACTICE_DOMAINS[number];
export type PracticeRole = typeof PRACTICE_ROLES[number];
export type EvidenceType = typeof EVIDENCE_TYPES[number];
export type SolutionAvailability = typeof SOLUTION_AVAILABILITY[number];
export type CoverageState = typeof COVERAGE_STATES[number];

export interface PracticeRubricItem {
  criterion: string;
  weight: number;
}

export interface PracticeEvidence {
  required: EvidenceType[];
  optional: EvidenceType[];
  format: string;
  qualityCriteria: string[];
  sensitiveDataWarning: string;
}

export interface PracticeEnvironment {
  tenantRequired: "none" | "optional" | "recommended" | "required";
  codeRequired: boolean;
  tools: string[];
}

export interface PracticeInfo {
  id: string;
  slug: string;
  title: string;
  practiceType: PracticeType;
  domain: PracticeDomain;
  roles: PracticeRole[];
  difficulty: PracticeDifficulty;
  estimatedEffort: "short" | "medium" | "long";
  prerequisites: {
    modules: number[];
    labs: string[];
  };
  environment: PracticeEnvironment;
  skills: string[];
  evidence: PracticeEvidence;
  solutionAvailability: SolutionAvailability;
  rubric: PracticeRubricItem[];
  coverageState: CoverageState;
  rawContent: string;
}

export interface PracticeCompetency {
  competency: string;
  domain: PracticeDomain;
  roles: PracticeRole[];
  difficulty: PracticeDifficulty;
  prerequisiteModule: number;
  relatedLab: string;
  practiceType: PracticeType;
  evidence: EvidenceType[];
  tools: string[];
  coverageState: CoverageState;
  gap: string;
  priority: "low" | "medium" | "high";
}

const APP_CONTENT_DIR = path.resolve(process.cwd(), "content");
const PRACTICES_DIR = path.join(APP_CONTENT_DIR, "practices");

const TYPE_PREFIX: Record<PracticeType, string> = {
  guided: "GL",
  "semi-guided": "SGL",
  challenge: "CH",
  incident: "INC",
  simulation: "SIM",
};

export const PRACTICE_TYPE_LABELS: Record<PracticeType, string> = {
  guided: "Guided Lab",
  "semi-guided": "Semi-Guided Lab",
  challenge: "Challenge Lab",
  incident: "Incident Lab",
  simulation: "Work Simulation",
};

export const PRACTICE_DIFFICULTY_LABELS: Record<PracticeDifficulty, string> = {
  foundation: "Foundation",
  practitioner: "Practitioner",
  advanced: "Advanced",
  expert: "Expert",
};

export const PRACTICE_DOMAIN_LABELS: Record<PracticeDomain, string> = {
  "configuration-implementation": "Configuración e implementación",
  "support-troubleshooting": "Soporte y troubleshooting",
  "development-extensibility": "Desarrollo y extensibilidad",
  "alm-deployment-operations": "ALM, despliegue y operación",
  "consulting-functional-analysis": "Consultoría y análisis funcional",
  "architecture-governance": "Arquitectura y gobierno",
};

export const PRACTICE_ROLE_LABELS: Record<PracticeRole, string> = {
  maker: "Maker",
  "functional-consultant": "Functional Consultant",
  "power-platform-developer": "Power Platform Developer",
  "dynamics-365-consultant": "Dynamics 365 Consultant",
  administrator: "Administrator",
  "support-analyst": "Support Analyst",
  "solution-architect": "Solution Architect",
};

let _practicesCache: PracticeInfo[] | null = null;

function failPractice(filePath: string, message: string): never {
  throw new ContentValidationError(`${filePath}: ${message}`);
}

function requireString(data: Record<string, unknown>, key: string, filePath: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    failPractice(filePath, `frontmatter '${key}' debe ser texto no vacío`);
  }
  return value.trim();
}

function requireStringArray(data: Record<string, unknown>, key: string, filePath: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
    failPractice(filePath, `frontmatter '${key}' debe ser lista de textos no vacíos`);
  }
  return value.map((item) => String(item).trim());
}

function requireEnum<T extends readonly string[]>(value: string, allowed: T, key: string, filePath: string): T[number] {
  if (!allowed.includes(value)) {
    failPractice(filePath, `frontmatter '${key}' inválido '${value}'`);
  }
  return value as T[number];
}

function requireEnumArray<T extends readonly string[]>(values: string[], allowed: T, key: string, filePath: string): T[number][] {
  return values.map((value) => requireEnum(value, allowed, key, filePath));
}

function parseNumberArray(value: unknown, key: string, filePath: string): number[] {
  if (!Array.isArray(value) || value.some((item) => !Number.isInteger(Number(item)))) {
    failPractice(filePath, `frontmatter '${key}' debe ser lista de enteros`);
  }
  return value.map(Number);
}

function parseRubric(value: unknown, filePath: string): PracticeRubricItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    failPractice(filePath, "frontmatter 'rubric' debe contener criterios");
  }
  const rubric = value.map((item) => {
    if (!item || typeof item !== "object") failPractice(filePath, "cada item de rubric debe ser objeto");
    const record = item as Record<string, unknown>;
    const criterion = String(record["criterion"] ?? "").trim();
    const weight = Number(record["weight"]);
    if (!criterion || !Number.isFinite(weight) || weight <= 0) {
      failPractice(filePath, "cada item de rubric requiere criterion y weight positivo");
    }
    return { criterion, weight };
  });
  const total = rubric.reduce((sum, item) => sum + item.weight, 0);
  if (total !== 100) failPractice(filePath, `rubric debe sumar 100%, suma ${total}%`);
  return rubric;
}

function validatePracticeFrontmatter(data: Record<string, unknown>, filePath: string, slug: string): Omit<PracticeInfo, "rawContent"> {
  const id = requireString(data, "id", filePath);
  const title = requireString(data, "title", filePath);
  const practiceType = requireEnum(requireString(data, "practiceType", filePath), PRACTICE_TYPES, "practiceType", filePath);
  const expectedPrefix = TYPE_PREFIX[practiceType];
  if (!id.startsWith(`${expectedPrefix}-`)) {
    failPractice(filePath, `id '${id}' no coincide con el prefijo esperado '${expectedPrefix}-'`);
  }

  const domain = requireEnum(requireString(data, "domain", filePath), PRACTICE_DOMAINS, "domain", filePath);
  const roles = requireEnumArray(requireStringArray(data, "roles", filePath), PRACTICE_ROLES, "roles", filePath);
  const difficulty = requireEnum(requireString(data, "difficulty", filePath), PRACTICE_DIFFICULTIES, "difficulty", filePath);
  const estimatedEffort = requireEnum(requireString(data, "estimatedEffort", filePath), ["short", "medium", "long"] as const, "estimatedEffort", filePath);
  const solutionAvailability = requireEnum(requireString(data, "solutionAvailability", filePath), SOLUTION_AVAILABILITY, "solutionAvailability", filePath);
  const coverageState = requireEnum(requireString(data, "coverageState", filePath), COVERAGE_STATES, "coverageState", filePath);
  const skills = requireStringArray(data, "skills", filePath);

  const prerequisites = data["prerequisites"] as Record<string, unknown> | undefined;
  if (!prerequisites || typeof prerequisites !== "object") failPractice(filePath, "frontmatter 'prerequisites' requerido");
  const modules = parseNumberArray(prerequisites["modules"], "prerequisites.modules", filePath);
  const labs = requireStringArray(prerequisites, "labs", filePath);

  const environment = data["environment"] as Record<string, unknown> | undefined;
  if (!environment || typeof environment !== "object") failPractice(filePath, "frontmatter 'environment' requerido");
  const tenantRequired = requireEnum(String(environment["tenantRequired"] ?? ""), ["none", "optional", "recommended", "required"] as const, "environment.tenantRequired", filePath);
  const codeRequired = environment["codeRequired"];
  if (typeof codeRequired !== "boolean") failPractice(filePath, "environment.codeRequired debe ser boolean");
  const tools = requireStringArray(environment, "tools", filePath);

  const evidenceData = data["evidence"] as Record<string, unknown> | undefined;
  if (!evidenceData || typeof evidenceData !== "object") failPractice(filePath, "frontmatter 'evidence' requerido");
  const required = requireEnumArray(requireStringArray(evidenceData, "required", filePath), EVIDENCE_TYPES, "evidence.required", filePath);
  if (required.length === 0) failPractice(filePath, "evidence.required no puede estar vacío");
  const optional = requireEnumArray(requireStringArray(evidenceData, "optional", filePath), EVIDENCE_TYPES, "evidence.optional", filePath);
  const format = requireString(evidenceData, "format", filePath);
  const qualityCriteria = requireStringArray(evidenceData, "qualityCriteria", filePath);
  const sensitiveDataWarning = requireString(evidenceData, "sensitiveDataWarning", filePath);

  return {
    id,
    slug,
    title,
    practiceType,
    domain,
    roles,
    difficulty,
    estimatedEffort,
    prerequisites: { modules, labs },
    environment: { tenantRequired, codeRequired, tools },
    skills,
    evidence: { required, optional, format, qualityCriteria, sensitiveDataWarning },
    solutionAvailability,
    rubric: parseRubric(data["rubric"], filePath),
    coverageState,
  };
}

function validatePracticeRelations(practices: PracticeInfo[]): void {
  const moduleIds = new Set(getAllModules().map((module) => module.moduleId));
  const labIds = new Set(getAllLabs().map((lab) => lab.displayId));
  const labSlugs = new Set(getAllLabs().map((lab) => lab.slug));

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const practice of practices) {
    if (seenIds.has(practice.id)) failPractice(practice.slug, `id duplicado '${practice.id}'`);
    if (seenSlugs.has(practice.slug)) failPractice(practice.slug, `slug duplicado '${practice.slug}'`);
    seenIds.add(practice.id);
    seenSlugs.add(practice.slug);

    for (const moduleId of practice.prerequisites.modules) {
      if (!moduleIds.has(moduleId)) failPractice(practice.slug, `módulo prerrequisito inexistente ${moduleId}`);
    }
    for (const lab of practice.prerequisites.labs) {
      if (!labIds.has(lab) && !labSlugs.has(lab)) failPractice(practice.slug, `lab relacionado inexistente ${lab}`);
    }

    if (practice.practiceType === "incident") {
      if (!practice.rawContent.includes("## Solución de referencia")) {
        failPractice(practice.slug, "incident debe incluir '## Solución de referencia'");
      }
      if (!/causa raíz/i.test(practice.rawContent)) {
        failPractice(practice.slug, "incident debe documentar causa raíz");
      }
    }
    if (practice.practiceType === "challenge" && /paso 1|paso 2|paso a paso/i.test(practice.rawContent)) {
      failPractice(practice.slug, "challenge no debe incluir instrucciones paso a paso");
    }
    if (!/criterios de aceptación/i.test(practice.rawContent)) {
      failPractice(practice.slug, "debe incluir criterios de aceptación");
    }
  }
}

export function getAllPractices(): PracticeInfo[] {
  if (_practicesCache) return _practicesCache;

  if (!fs.existsSync(PRACTICES_DIR)) {
    failPractice(PRACTICES_DIR, "directorio requerido de prácticas no encontrado");
  }

  const files = fs.readdirSync(PRACTICES_DIR).filter((file) => file.endsWith(".md")).sort();
  const practices = files.map((file) => {
    const filePath = path.join(PRACTICES_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const meta = validatePracticeFrontmatter(data, filePath, slug);
    return { ...meta, rawContent: content };
  });

  validatePracticeRelations(practices);
  _practicesCache = practices;
  return practices;
}

export function getPracticeBySlug(slug: string): PracticeInfo | undefined {
  return getAllPractices().find((practice) => practice.slug === slug);
}

export function getPracticeCounts() {
  const practices = getAllPractices();
  return {
    total: practices.length,
    incidents: practices.filter((practice) => practice.practiceType === "incident").length,
    challenges: practices.filter((practice) => practice.practiceType === "challenge").length,
    simulations: practices.filter((practice) => practice.practiceType === "simulation").length,
  };
}

export function getPracticeCompetencyMatrix(): PracticeCompetency[] {
  const practices = getAllPractices();
  const byId = new Map(practices.map((practice) => [practice.id, practice]));
  const rows: Array<Omit<PracticeCompetency, "tools" | "evidence" | "practiceType" | "difficulty" | "domain" | "roles" | "coverageState"> & { practiceId?: string }> = [
    { competency: "análisis de requerimientos", prerequisiteModule: 17, relatedLab: "LAB-062", gap: "Requiere entrevista real para validar comunicación", priority: "high", practiceId: "SIM-001" },
    { competency: "modelado de datos", prerequisiteModule: 2, relatedLab: "LAB-002", gap: "Cubierto con guía; challenge valida autonomía", priority: "high", practiceId: "CH-001" },
    { competency: "configuración", prerequisiteModule: 4, relatedLab: "LAB-004", gap: "Falta ampliar biblioteca por producto", priority: "medium", practiceId: "CH-001" },
    { competency: "seguridad", prerequisiteModule: 16, relatedLab: "LAB-076", gap: "Piloto cubre diagnóstico Dataverse; falta Power BI/Power Pages", priority: "high", practiceId: "INC-001" },
    { competency: "automatización", prerequisiteModule: 11, relatedLab: "LAB-005", gap: "Piloto cubre idempotencia y throttling", priority: "high", practiceId: "INC-002" },
    { competency: "integraciones", prerequisiteModule: 24, relatedLab: "LAB-074", gap: "Cubierto parcialmente sin endpoint real", priority: "medium", practiceId: "CH-002" },
    { competency: "desarrollo", prerequisiteModule: 23, relatedLab: "LAB-091", gap: "Piloto cubre plugin/Custom API sin solución rota real", priority: "high", practiceId: "CH-002" },
    { competency: "debugging", prerequisiteModule: 23, relatedLab: "LAB-092", gap: "Piloto cubre trace conceptual; falta tenant con carga real", priority: "high", practiceId: "INC-005" },
    { competency: "ALM", prerequisiteModule: 19, relatedLab: "LAB-019", gap: "Piloto cubre import managed y rollback", priority: "high", practiceId: "INC-003" },
    { competency: "despliegue", prerequisiteModule: 19, relatedLab: "LAB-055", gap: "Validación postdeploy simulada", priority: "high", practiceId: "INC-003" },
    { competency: "rollback", prerequisiteModule: 19, relatedLab: "LAB-055", gap: "No ejecuta rollback en producción real", priority: "medium", practiceId: "INC-003" },
    { competency: "testing", prerequisiteModule: 50, relatedLab: "LAB-055", gap: "Falta suite automatizada para soluciones reales", priority: "medium", practiceId: "SIM-001" },
    { competency: "soporte", prerequisiteModule: 61, relatedLab: "LAB-103", gap: "Piloto cubre triage; falta rotación operativa real", priority: "high", practiceId: "INC-004" },
    { competency: "administración", prerequisiteModule: 32, relatedLab: "LAB-076", gap: "Roadmap enterprise real para Managed Environments", priority: "medium" },
    { competency: "gobierno", prerequisiteModule: 31, relatedLab: "LAB-032", gap: "Cubierto documentalmente; falta revisión de tenant", priority: "medium" },
    { competency: "documentación", prerequisiteModule: 38, relatedLab: "LAB-079", gap: "Piloto exige RCA, ADR y runbook", priority: "high", practiceId: "SIM-001" },
    { competency: "comunicación", prerequisiteModule: 38, relatedLab: "LAB-079", gap: "Requiere feedback humano para fluidez real", priority: "medium", practiceId: "SIM-001" },
    { competency: "arquitectura", prerequisiteModule: 41, relatedLab: "LAB-090", gap: "Falta revisión externa de decisiones", priority: "medium" },
    { competency: "migración", prerequisiteModule: 64, relatedLab: "LAB-075", gap: "Cubierto como awareness/simulación; no ETL enterprise real", priority: "medium" },
    { competency: "observabilidad", prerequisiteModule: 26, relatedLab: "LAB-092", gap: "Piloto usa trazas simuladas; falta Application Insights real", priority: "high", practiceId: "INC-005" },
  ];

  return rows.map((row) => {
    const practice = row.practiceId ? byId.get(row.practiceId) : undefined;
    return {
      competency: row.competency,
      domain: practice?.domain ?? "architecture-governance",
      roles: practice?.roles ?? ["administrator", "solution-architect"],
      difficulty: practice?.difficulty ?? "advanced",
      prerequisiteModule: row.prerequisiteModule,
      relatedLab: row.relatedLab,
      practiceType: practice?.practiceType ?? "semi-guided",
      evidence: practice?.evidence.required ?? ["adr", "runbook"],
      tools: practice?.environment.tools ?? ["Power Platform Admin Center"],
      coverageState: practice?.coverageState ?? "partial",
      gap: row.gap,
      priority: row.priority,
    };
  });
}
