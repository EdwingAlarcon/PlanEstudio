export const UI = {
  // Navegación
  nav: {
    home: "Inicio",
    levels: "Niveles",
    routes: "Rutas profesionales",
    resources: "Recursos",
    howToUse: "Cómo usar",
    simulator: "Simulador",
    glossary: "Glosario",
    certifications: "Certificaciones",
    checklist: "Checklist de Progreso",
    questionBank: "Banco de Preguntas",
    promptsIA: "Prompts Reutilizables IA",
    rubricsTemplates: "Rúbricas y Plantillas",
    competencyMatrix: "Matriz de Competencias",
    laborSkillsMatrix: "Skills Laborales",
    crmDeveloperJobReady: "CRM Developer Job-Ready",
    crmFunctionalJobReady: "CRM Functional Job-Ready",
    dataMigrationJobReady: "Data Migration Job-Ready",
    interviewJobReady: "Interview Job-Ready",
    adminGovernanceJobReady: "Admin/Governance Job-Ready",
    portfolio: "Portafolio",
    portfolioGuide: "Guía de Portafolio",
    advancedRoadmap: "Roadmap Especialización Avanzada",
    myProgress: "Mi Progreso",
    skipToContent: "Saltar al contenido",
    toggleTheme: "Cambiar tema",
    search: "Buscar...",
    searchPlaceholder: "Buscar en el contenido...",
  },

  // Niveles
  levels: {
    basico: "Básico",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    arquitecto: "Arquitecto",
    ia: "Desarrollo Asistido por IA",
    d365: "Dynamics 365 Avanzado",
    badge: {
      basico: "🟢 Nivel 1",
      intermedio: "🔵 Nivel 2",
      avanzado: "🟠 Nivel 3",
      arquitecto: "🔴 Nivel 4",
      ia: "🟣 IA",
      d365: "🔷 D365",
    },
    cert: {
      basico: "PL-900",
      intermedio: "PL-200 (retira 31 ago 2026)",
      avanzado: "PL-400",
      arquitecto: "Arquitectura Power Platform",
      ia: "Buenas Prácticas",
      d365: "Especialista Dynamics 365 CE",
    },
    navCert: {
      basico: "PL-900",
      intermedio: "PL-200",
      avanzado: "PL-400",
      arquitecto: "Arquitectura",
      ia: "IA",
      d365: "D365",
    },
    description: {
      basico: "Fundamentos de Power Platform y Dataverse",
      intermedio: "Canvas Apps, Model-Driven, Power Automate y Power BI avanzados",
      avanzado: "Arquitectura, ALM, D365, Copilot Studio y extensibilidad",
      arquitecto: "Gobernanza enterprise, multi-tenant, Azure integrations y liderazgo",
      ia: "Copilot, GitHub Copilot, Claude Code y Codex aplicados de forma segura y auditable al desarrollo, conexión al tenant, Dataverse, ALM y consultoría funcional en Power Platform y D365",
      d365: "Profundidad funcional en Dynamics 365 Sales, Customer Service, Customer Insights y Field Service, con arquitectura Customer Engagement end-to-end e integración con Finance & Operations",
    },
    modules: {
      basico: 8,
      intermedio: 9,
      avanzado: 13,
      arquitecto: 11,
      ia: 14,
      d365: 4,
    },
  },

  // Módulos
  module: {
    estimatedTime: (min: number) => `${min} min de lectura`,
    markComplete: "Marcar como completado",
    markIncomplete: "Marcar como incompleto",
    completed: "Completado",
    previous: "Módulo anterior",
    next: "Módulo siguiente",
    backToLevel: "Volver al nivel",
    tableOfContents: "En esta página",
    progress: (current: number, total: number) => `${current} de ${total} módulos completados`,
  },

  // Quiz
  quiz: {
    title: "Evaluación del módulo",
    simulatorTitle: "Simulador de Examen",
    start: "Iniciar evaluación",
    startSimulator: "Iniciar simulador",
    submit: "Enviar respuesta",
    next: "Siguiente pregunta",
    finish: "Ver resultados",
    correct: "¡Correcto!",
    incorrect: "Incorrecto",
    explanation: "Explicación:",
    score: (correct: number, total: number) => `${correct} de ${total} correctas`,
    percentage: (pct: number) => `${pct}%`,
    passed: "¡Aprobado!",
    failed: "No aprobado",
    passingScore: "Umbral de aprobación: 70%",
    retry: "Intentar de nuevo",
    backToModule: "Volver al módulo",
    timeRemaining: "Tiempo restante",
    questionOf: (current: number, total: number) => `Pregunta ${current} de ${total}`,
    selectOne: "Selección única",
    selectMultiple: "Selección múltiple",
    selectMultipleHint: "Selecciona todas las respuestas correctas",
    noQuestions: "No hay preguntas disponibles para este módulo.",
    reviewErrors: (n: number) => `Revisar ${n} pregunta${n !== 1 ? "s" : ""} incorrecta${n !== 1 ? "s" : ""}`,
  },

  // Progreso
  progress: {
    title: "Tu progreso",
    overall: "Progreso general",
    levelProgress: (level: string) => `Progreso en ${level}`,
    completedModules: "módulos completados",
    totalModules: "módulos en total",
    resetConfirm: "¿Seguro que quieres reiniciar tu progreso? Esta acción no se puede deshacer.",
    reset: "Reiniciar progreso",
  },

  // Búsqueda
  search: {
    noResults: "Sin resultados para",
    results: (count: number) => `${count} resultado${count !== 1 ? "s" : ""}`,
    searching: "Buscando...",
  },

  // General
  general: {
    loading: "Cargando...",
    error: "Error al cargar el contenido",
    notFound: "Página no encontrada",
    backHome: "Volver al inicio",
  },
} as const;

// Tipos de nivel para narrowing
export type LevelId = "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "d365";

export const LEVEL_ORDER: LevelId[] = ["basico", "intermedio", "avanzado", "arquitecto", "ia", "d365"];

export const LEVEL_MODULE_RANGE: Record<LevelId, [number, number]> = {
  basico: [1, 8],
  intermedio: [9, 17],
  avanzado: [18, 30],
  arquitecto: [31, 41],
  ia: [42, 55],
  d365: [56, 59],
};
