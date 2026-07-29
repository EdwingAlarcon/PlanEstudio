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
export const PRACTICE_HINT_LEVELS = ["light", "tool", "hypothesis", "near-solution"] as const;

export type PracticeType = typeof PRACTICE_TYPES[number];
export type PracticeDifficulty = typeof PRACTICE_DIFFICULTIES[number];
export type PracticeDomain = typeof PRACTICE_DOMAINS[number];
export type PracticeRole = typeof PRACTICE_ROLES[number];
export type EvidenceType = typeof EVIDENCE_TYPES[number];
export type SolutionAvailability = typeof SOLUTION_AVAILABILITY[number];
export type CoverageState = typeof COVERAGE_STATES[number];
export type PracticeHintLevel = typeof PRACTICE_HINT_LEVELS[number];

export interface PracticeHint {
  id: string;
  level: PracticeHintLevel;
  title: string;
  content: string;
}

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

export const PRACTICE_HINT_LEVEL_LABELS: Record<PracticeHintLevel, string> = {
  light: "Orientación ligera",
  tool: "Área o herramienta",
  hypothesis: "Hipótesis concreta",
  "near-solution": "Cerca de la resolución",
};
