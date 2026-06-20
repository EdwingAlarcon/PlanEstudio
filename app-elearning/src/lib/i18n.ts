export const UI = {
  // Navegación
  nav: {
    home: "Inicio",
    levels: "Niveles",
    resources: "Recursos",
    simulator: "Simulador",
    glossary: "Glosario",
    certifications: "Certificaciones",
    checklist: "Checklist de Progreso",
    questionBank: "Banco de Preguntas",
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
    badge: {
      basico: "🟢 Nivel 1",
      intermedio: "🔵 Nivel 2",
      avanzado: "🟠 Nivel 3",
      arquitecto: "🔴 Nivel 4",
    },
    cert: {
      basico: "PL-900",
      intermedio: "PL-200",
      avanzado: "PL-400",
      arquitecto: "PL-600",
    },
    description: {
      basico: "Fundamentos de Power Platform y Dataverse",
      intermedio: "Canvas Apps, Model-Driven, Power Automate y Power BI avanzados",
      avanzado: "Arquitectura, ALM, D365, Copilot Studio y extensibilidad",
      arquitecto: "Gobernanza enterprise, multi-tenant, Azure integrations y liderazgo",
    },
    modules: {
      basico: 8,
      intermedio: 9,
      avanzado: 13,
      arquitecto: 11,
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
export type LevelId = "basico" | "intermedio" | "avanzado" | "arquitecto";

export const LEVEL_ORDER: LevelId[] = ["basico", "intermedio", "avanzado", "arquitecto"];

export const LEVEL_MODULE_RANGE: Record<LevelId, [number, number]> = {
  basico: [1, 8],
  intermedio: [9, 17],
  avanzado: [18, 30],
  arquitecto: [31, 41],
};
