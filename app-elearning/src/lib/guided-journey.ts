import type { ModuleInfo, LabInfo, SearchDocument } from "./content";
import type { ProfessionalRouteSlug } from "./professional-routes";

export type OnboardingStage =
  | "new"
  | "foundations_started"
  | "first_practice_completed"
  | "foundations_completed"
  | "role_exploration"
  | "route_selected";

export type ExperienceGoal = "desde-cero" | "basico" | "rol" | "practica";
export type NavigationMode = "guided" | "explore";
export type ExperienceLevel = "none" | "basic" | "experienced" | "unknown";
export type TenantAccess = "yes" | "no" | "unknown";
export type WorkPreference = "build" | "configure" | "code" | "admin" | "rpa" | "analyze" | "unknown";
export type StudyPurpose = "job" | "work" | "explore" | "interview" | "unknown";
export type WeeklyAvailability = "2h" | "5h" | "8h";

export interface OnboardingAnswers {
  experience: ExperienceLevel;
  tenant: TenantAccess;
  preference: WorkPreference;
  purpose: StudyPurpose;
  availability: WeeklyAvailability;
}

export interface OnboardingState {
  schemaVersion: 1;
  stage: OnboardingStage;
  goal: ExperienceGoal;
  selectedRouteSlug: ProfessionalRouteSlug | "foundations" | null;
  currentActivityId: string | null;
  startedAt: string | null;
  lastActivityAt: string | null;
  completed: boolean;
  currentRecommendationId: string | null;
  navigationMode: NavigationMode;
  answers: OnboardingAnswers;
  skippedPreferences: string[];
}

export type FoundationActivityType = "module" | "lab" | "quiz" | "reflection" | "decision";
export type RequirementLevel = "required" | "recommended" | "optional" | "advanced";

export interface FoundationActivity {
  id: string;
  step: number;
  title: string;
  type: FoundationActivityType;
  requirement: RequirementLevel;
  minutes: number;
  href: string;
  moduleId?: number;
  labSlug?: string;
  prerequisites: string[];
  access: string;
  evidence: string;
  tenantAlternative: string;
  outcome: string;
}

export interface NextBestAction {
  activity: FoundationActivity;
  reason: string;
  time: string;
  route: string;
  prerequisites: string[];
  cta: string;
}

export const DEFAULT_ONBOARDING_ANSWERS: OnboardingAnswers = {
  experience: "unknown",
  tenant: "unknown",
  preference: "unknown",
  purpose: "unknown",
  availability: "5h",
};

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  schemaVersion: 1,
  stage: "new",
  goal: "desde-cero",
  selectedRouteSlug: null,
  currentActivityId: "eco-1",
  startedAt: null,
  lastActivityAt: null,
  completed: false,
  currentRecommendationId: "foundations",
  navigationMode: "guided",
  answers: DEFAULT_ONBOARDING_ANSWERS,
  skippedPreferences: [],
};

export const FOUNDATION_ROUTE = {
  id: "foundations",
  title: "Fundamentos para empezar",
  duration: "3 a 7 dias",
  sessionLength: "30 a 60 min por sesion",
  summary:
    "Una ruta comun para entender el ecosistema, crear una primera evidencia y elegir ruta despues con mas contexto.",
  exitCriteria: [
    "Explicas que problema resuelve cada producto principal.",
    "Reconoces tablas, columnas, relaciones y registros.",
    "Completas una primera practica guiada o su variante simulada.",
    "Tienes una evidencia guardada para tu portafolio inicial.",
    "Puedes escoger una familia de rol o decidir seguir explorando.",
  ],
} as const;

export const FOUNDATION_ACTIVITIES: FoundationActivity[] = [
  {
    id: "eco-1",
    step: 1,
    title: "Conoce el ecosistema Power Platform",
    type: "module",
    requirement: "required",
    minutes: 30,
    href: "/nivel/basico/modulo/introduccion-al-ecosistema-power-platform",
    moduleId: 1,
    prerequisites: ["Ninguno"],
    access: "Puede hacerse con lectura guiada; tenant recomendado, no obligatorio.",
    evidence: "Mapa personal de productos y un caso de negocio simple.",
    tenantAlternative: "Usa la comparacion conceptual del modulo y documenta un caso propio.",
    outcome: "Entiendes Power Apps, Power Automate, Dataverse, Power BI, Dynamics 365 y Copilot sin profundizar todavia.",
  },
  {
    id: "data-2",
    step: 2,
    title: "Comprende los datos y Dataverse",
    type: "module",
    requirement: "required",
    minutes: 45,
    href: "/nivel/basico/modulo/dataverse-fundamentos-y-modelado-basico",
    moduleId: 2,
    prerequisites: ["Ecosistema Power Platform"],
    access: "Tenant recomendado para crear tablas; alternativa simulada disponible.",
    evidence: "Borrador de tabla, columnas y relaciones para un proceso sencillo.",
    tenantAlternative: "Modela la tabla en una hoja local o en papel antes de configurar entorno.",
    outcome: "Distingues tablas, columnas, relaciones, registros y seguridad basica.",
  },
  {
    id: "canvas-3",
    step: 3,
    title: "Crea una primera app visible",
    type: "module",
    requirement: "required",
    minutes: 45,
    href: "/nivel/basico/modulo/power-apps-canvas-primeras-aplicaciones",
    moduleId: 3,
    prerequisites: ["Conceptos basicos de datos"],
    access: "Power Apps con entorno de practica. Si no tienes tenant, usa el esquema de pantallas como variante.",
    evidence: "Captura de una pantalla funcional o wireframe con datos de ejemplo.",
    tenantAlternative: "Dibuja las pantallas, campos y reglas; conserva la evidencia como diseno inicial.",
    outcome: "Logras una primera victoria visible en menos de 45 minutos.",
  },
  {
    id: "lab-canvas-4",
    step: 4,
    title: "Realiza el lab guiado de primera app",
    type: "lab",
    requirement: "recommended",
    minutes: 60,
    href: "/labs/lab-03-canvas-primera-app",
    labSlug: "lab-03-canvas-primera-app",
    prerequisites: ["Primeras aplicaciones Canvas"],
    access: "Tenant recomendado; sin tenant, completa la variante de evidencia conceptual.",
    evidence: "Captura de app, datos de prueba y lista de validacion.",
    tenantAlternative: "Entrega wireframe, tabla de datos y criterios de validacion sin configurar conectores.",
    outcome: "Conviertes lectura en evidencia practica verificable.",
  },
  {
    id: "automate-5",
    step: 5,
    title: "Automatiza una tarea sencilla",
    type: "module",
    requirement: "required",
    minutes: 40,
    href: "/nivel/basico/modulo/power-automate-automatizacion-basica",
    moduleId: 5,
    prerequisites: ["Ecosistema y datos basicos"],
    access: "Power Automate recomendado; sin integraciones externas.",
    evidence: "Diagrama o captura de un flujo simple con disparador y accion.",
    tenantAlternative: "Describe el trigger, condiciones y salida esperada usando datos locales.",
    outcome: "Comprendes como convertir una tarea repetitiva en flujo verificable.",
  },
  {
    id: "quiz-6",
    step: 6,
    title: "Comprueba lo aprendido",
    type: "quiz",
    requirement: "required",
    minutes: 20,
    href: "/nivel/basico/modulo/introduccion-al-ecosistema-power-platform",
    moduleId: 1,
    prerequisites: ["Actividades 1 a 5 recomendadas"],
    access: "Sin requisitos de tenant.",
    evidence: "Resultado del quiz y nota de tres conceptos que debes reforzar.",
    tenantAlternative: "Igual que la actividad principal.",
    outcome: "Valida comprension inicial sin tratarlo como evaluacion profesional.",
  },
  {
    id: "role-7",
    step: 7,
    title: "Descubre tu ruta",
    type: "decision",
    requirement: "required",
    minutes: 20,
    href: "/mi-ruta",
    prerequisites: ["Fundamentos esenciales y primera evidencia"],
    access: "Sin requisitos de tenant.",
    evidence: "Seleccion de familia de rol o decision de seguir explorando.",
    tenantAlternative: "Igual que la actividad principal.",
    outcome: "Eliges el siguiente camino cuando ya tienes contexto suficiente.",
  },
];

export const ROLE_EXPERIENCES = [
  { id: "maker", title: "Crear apps y automatizaciones", route: "maker" as const, minutes: 15, activity: "Modificar una app o formulario simple." },
  { id: "functional", title: "Configurar procesos de negocio", route: "consultor-funcional" as const, minutes: 15, activity: "Modelar un proceso y convertirlo en requerimientos." },
  { id: "developer", title: "Programar e integrar sistemas", route: "developer" as const, minutes: 20, activity: "Leer una pequena logica y explicar donde se ejecuta." },
  { id: "admin", title: "Administrar y gobernar", route: "maker" as const, minutes: 15, activity: "Detectar un riesgo de entorno, datos o permisos." },
  { id: "rpa", title: "Automatizar escritorio", route: "developer" as const, minutes: 15, activity: "Evaluar si un proceso debe automatizarse con RPA o flujo cloud." },
  { id: "architect", title: "Disenar soluciones", route: "solution-architect" as const, minutes: 20, activity: "Comparar dos opciones de solucion y justificar tradeoffs." },
] as const;

export function normalizeOnboardingState(value: unknown): OnboardingState {
  if (!value || typeof value !== "object") return DEFAULT_ONBOARDING_STATE;
  const raw = value as Partial<OnboardingState>;
  if (raw.schemaVersion !== 1) return DEFAULT_ONBOARDING_STATE;
  return {
    ...DEFAULT_ONBOARDING_STATE,
    ...raw,
    answers: { ...DEFAULT_ONBOARDING_ANSWERS, ...(raw.answers ?? {}) },
    skippedPreferences: Array.isArray(raw.skippedPreferences) ? raw.skippedPreferences : [],
  };
}

export function isFoundationActivityComplete(
  activity: FoundationActivity,
  completedModules: string[],
  completedLabs: string[],
  onboarding: OnboardingState,
): boolean {
  if (activity.type === "decision") {
    return onboarding.stage === "route_selected" || Boolean(onboarding.selectedRouteSlug && onboarding.selectedRouteSlug !== "foundations");
  }
  if (activity.type === "quiz") {
    return onboarding.stage === "foundations_completed" || onboarding.stage === "role_exploration";
  }
  if (activity.moduleId) {
    return completedModules.includes(`basico-${activity.moduleId}`);
  }
  if (activity.labSlug) {
    return completedLabs.includes(activity.labSlug);
  }
  return false;
}

export function getFoundationProgress(
  completedModules: string[],
  completedLabs: string[],
  onboarding: OnboardingState,
) {
  const completed = FOUNDATION_ACTIVITIES.filter((activity) =>
    isFoundationActivityComplete(activity, completedModules, completedLabs, onboarding)
  ).length;
  const total = FOUNDATION_ACTIVITIES.length;
  return { completed, total, percentage: Math.round((completed / total) * 100) };
}

export function recommendRouteSlug(answers: OnboardingAnswers): ProfessionalRouteSlug | "foundations" {
  if (answers.experience === "none") return "foundations";
  if (answers.preference === "configure" || answers.preference === "analyze") return "consultor-funcional";
  if (answers.preference === "code") return "developer";
  if (answers.preference === "admin") return "maker";
  if (answers.preference === "rpa") return "developer";
  if (answers.preference === "build") return "maker";
  if (answers.purpose === "interview") return "maker";
  return "foundations";
}

export function getRecommendationReason(answers: OnboardingAnswers): string {
  if (answers.experience === "none") {
    return "porque indicaste que empiezas sin experiencia y conviene formar una base comun antes de elegir especializacion.";
  }
  if (answers.tenant === "no") {
    return "porque puedes avanzar con contenido conceptual y variantes simuladas mientras preparas tu entorno.";
  }
  if (answers.preference === "code") return "porque prefieres programar o integrar sistemas.";
  if (answers.preference === "configure" || answers.preference === "analyze") return "porque prefieres configurar procesos y traducir necesidades de negocio.";
  if (answers.preference === "build") return "porque te interesa construir apps y automatizaciones.";
  return "porque aun no necesitas decidir una carrera definitiva.";
}

export function getNextBestAction(
  completedModules: string[],
  completedLabs: string[],
  onboarding: OnboardingState,
): NextBestAction {
  const inProgress = FOUNDATION_ACTIVITIES.find((activity) => activity.id === onboarding.currentActivityId);
  if (inProgress && !isFoundationActivityComplete(inProgress, completedModules, completedLabs, onboarding)) {
    return {
      activity: inProgress,
      reason: `Continua con "${inProgress.title}" porque ya es tu actividad activa de Fundamentos.`,
      time: `${inProgress.minutes} min`,
      route: FOUNDATION_ROUTE.title,
      prerequisites: inProgress.prerequisites,
      cta: inProgress.type === "lab" ? "Abrir practica recomendada" : "Continuar actividad",
    };
  }

  const next = FOUNDATION_ACTIVITIES.find((activity) =>
    !isFoundationActivityComplete(activity, completedModules, completedLabs, onboarding)
  ) ?? FOUNDATION_ACTIVITIES[FOUNDATION_ACTIVITIES.length - 1]!;

  return {
    activity: next,
    reason: `Sigue con "${next.title}" porque es el siguiente paso corto de Fundamentos para empezar.`,
    time: `${next.minutes} min`,
    route: FOUNDATION_ROUTE.title,
    prerequisites: next.prerequisites,
    cta: next.type === "decision" ? "Elegir siguiente ruta" : next.type === "lab" ? "Realizar practica recomendada" : "Continuar",
  };
}

export function buildWeeklyPlan(availability: WeeklyAvailability, nextAction: NextBestAction): string[] {
  if (availability === "2h") {
    return [nextAction.activity.title, "Una practica corta o variante simulada", "Revision de evidencia y notas"];
  }
  if (availability === "8h") {
    return [nextAction.activity.title, "Siguiente modulo de fundamentos", "Lab recomendado", "Quiz o reflexion", "Ajuste de ruta"];
  }
  return [nextAction.activity.title, "Siguiente actividad corta", "Lab guiado si tienes tenant", "Quiz breve"];
}

export function classifySearchDocument(doc: SearchDocument, onboarding: OnboardingState): "en-tu-ruta" | "opcional" | "avanzado" | "otra-especializacion" {
  if (doc.type === "lab" && FOUNDATION_ACTIVITIES.some((activity) => activity.labSlug === doc.slug)) return "en-tu-ruta";
  if (doc.type === "module" && FOUNDATION_ACTIVITIES.some((activity) => activity.moduleId === doc.moduleId)) return "en-tu-ruta";
  if (doc.type === "module" && doc.moduleId >= 18) return "avanzado";
  if (doc.levelId === "ia" || doc.levelId === "d365" || doc.levelId === "N5" || doc.levelId === "N6") return "otra-especializacion";
  return onboarding.navigationMode === "guided" ? "opcional" : "en-tu-ruta";
}

export function validateGuidedJourneyReferences(modules: ModuleInfo[], labs: LabInfo[]): string[] {
  const errors: string[] = [];
  const moduleIds = new Set(modules.map((module) => module.moduleId));
  const labSlugs = new Set(labs.map((lab) => lab.slug));
  const seen = new Set<string>();

  for (const activity of FOUNDATION_ACTIVITIES) {
    if (seen.has(activity.id)) errors.push(`Actividad duplicada: ${activity.id}`);
    seen.add(activity.id);
    if (activity.moduleId && !moduleIds.has(activity.moduleId)) {
      errors.push(`Actividad ${activity.id} referencia modulo inexistente ${activity.moduleId}`);
    }
    if (activity.labSlug && !labSlugs.has(activity.labSlug)) {
      errors.push(`Actividad ${activity.id} referencia lab inexistente ${activity.labSlug}`);
    }
    if (activity.step <= 0) errors.push(`Actividad ${activity.id} tiene orden invalido`);
  }

  const firstPractice = FOUNDATION_ACTIVITIES.find((activity) => activity.type === "lab" || activity.id.includes("canvas"));
  if (!firstPractice || firstPractice.step > 4) {
    errors.push("La ruta de fundamentos no tiene una primera practica temprana");
  }
  if (FOUNDATION_ACTIVITIES.at(-1)?.type !== "decision") {
    errors.push("La ruta de fundamentos debe terminar con una decision posterior");
  }
  if (FOUNDATION_ACTIVITIES.length < 5 || FOUNDATION_ACTIVITIES.length > 7) {
    errors.push("La ruta de fundamentos debe tener entre 5 y 7 actividades");
  }

  return errors;
}
