export type ProfessionalRouteSlug =
  | "maker"
  | "consultor-funcional"
  | "developer"
  | "solution-architect"
  | "dynamics-365-customer-engagement"
  | "finance-operations"
  | "ai-copilot";

export interface ProfessionalRoute {
  slug: ProfessionalRouteSlug;
  title: string;
  role: string;
  summary: string;
  outcome: string;
  level: "Inicial" | "Intermedio" | "Avanzado" | "Especialización";
  accent: string;
  modules: number[];
  labs: string[];
  competencies: string[];
  status: "Disponible" | "Parcial" | "Cobertura en expansión";
  gapNote?: string;
  nextRouteSlug?: ProfessionalRouteSlug;
}

const PROFESSIONAL_ROUTES: ProfessionalRoute[] = [
  {
    slug: "maker",
    title: "Ruta Maker",
    role: "Usuario de negocio que construye soluciones low-code",
    summary: "Aprende a modelar datos simples, crear apps, automatizar procesos y validar soluciones internas sin entrar todavía en desarrollo avanzado.",
    outcome: "Construir una solución departamental con Canvas App, Model-Driven App, Dataverse básico y Power Automate.",
    level: "Inicial",
    accent: "#107C10",
    modules: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
    labs: [
      "lab-02-dataverse-modelo-datos",
      "lab-03-canvas-primera-app",
      "lab-04-model-driven-app",
      "lab-05-automate-aprobacion",
    ],
    competencies: ["Canvas Apps", "Model-Driven Apps", "Dataverse básico", "Power Automate", "Power Fx"],
    status: "Disponible",
    nextRouteSlug: "consultor-funcional",
  },
  {
    slug: "consultor-funcional",
    title: "Ruta Consultor Funcional",
    role: "Consultor que traduce necesidades de negocio en solución configurable",
    summary: "Conecta discovery, requerimientos, seguridad, procesos, UAT y documentación funcional con configuración real en Power Platform.",
    outcome: "Diseñar y entregar una solución funcional con requerimientos, backlog, seguridad, pruebas UAT y capacitación.",
    level: "Intermedio",
    accent: "#0078D4",
    modules: [1, 2, 4, 5, 9, 11, 15, 16, 17, 38, 39, 55],
    labs: [
      "lab-04-model-driven-app",
      "lab-09-dataverse-avanzado",
      "lab-55-uat-gonolive-y-auditoria-prompts",
      "lab-57-diseno-solucion-d365-sales-con-ia",
    ],
    competencies: ["Discovery", "Requerimientos", "Fit-Gap", "Seguridad funcional", "UAT", "Capacitación"],
    status: "Parcial",
    gapNote: "Cubre bien Power Platform genérico (requerimientos, fit-gap, seguridad, UAT), pero todavía no tiene módulos dedicados de consultoría funcional específicos de Dynamics 365 CE/F&O (procesos estándar por industria, catálogos de producto, configuración de áreas funcionales). Complementa esta ruta con Dynamics 365 Customer Engagement o Finance & Operations según el dominio del cliente.",
    nextRouteSlug: "dynamics-365-customer-engagement",
  },
  {
    slug: "developer",
    title: "Ruta Developer",
    role: "Desarrollador Power Platform y consultor técnico",
    summary: "Profundiza en extensibilidad, integración, ALM, plugins, PCF, Web API, TypeScript, C# y revisión técnica asistida por IA.",
    outcome: "Extender Dataverse e integrar soluciones con código, APIs, componentes y pipelines controlados.",
    level: "Avanzado",
    accent: "#EA580C",
    modules: [13, 14, 18, 19, 21, 23, 24, 26, 27, 28, 50, 52, 53, 54],
    labs: [
      "lab-19-cicd-azure-devops",
      "lab-23-plugin-csharp",
      "lab-52-cli-conexion-tenant",
      "lab-53-exportar-revisar-solucion-con-ia",
      "lab-54-conectar-app-externa-dataverse",
    ],
    competencies: ["Plugins C#", "PCF", "Dataverse Web API", "Custom Connectors", "ALM", "CI/CD"],
    status: "Disponible",
    nextRouteSlug: "solution-architect",
  },
  {
    slug: "solution-architect",
    title: "Ruta Solution Architect",
    role: "Arquitecto de soluciones Microsoft Business Applications",
    summary: "Organiza estrategia de ambientes, gobernanza, seguridad, integración, datos, riesgos, costos y decisiones ejecutivas.",
    outcome: "Defender una arquitectura enterprise con ADRs, roadmap, modelo de gobierno, integración y plan operativo.",
    level: "Avanzado",
    accent: "#D13438",
    modules: [18, 19, 25, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41],
    labs: [
      "lab-19-cicd-azure-devops",
      "lab-32-coe-starter-kit",
      "lab-51-flujo-completo-humano-ia-ci",
      "lab-56-cambiar-entornos-dev-test-prod",
      "lab-60-proyecto-integrador-servicio-postventa",
    ],
    competencies: ["Gobernanza", "Seguridad", "ALM enterprise", "Integraciones", "Arquitectura de datos", "ADRs"],
    status: "Disponible",
    nextRouteSlug: "ai-copilot",
  },
  {
    slug: "dynamics-365-customer-engagement",
    title: "Ruta Dynamics 365 Customer Engagement",
    role: "Consultor funcional D365 CE para ventas y servicio",
    summary: "Aprovecha la cobertura existente de Sales, Customer Service, Dataverse, Copilot Studio y diseño funcional D365.",
    outcome: "Diseñar procesos de ventas y servicio sobre Dynamics 365 CE con entidades estándar antes de personalizar.",
    level: "Especialización",
    accent: "#4F6BED",
    modules: [1, 4, 9, 15, 20, 22, 30, 39, 53, 55],
    labs: [
      "lab-22-copilot-studio",
      "lab-55-uat-gonolive-y-auditoria-prompts",
      "lab-57-diseno-solucion-d365-sales-con-ia",
      "lab-58-customer-insights-segmento-journey",
      "lab-59-field-service-work-order-uat",
      "lab-60-proyecto-integrador-servicio-postventa",
    ],
    competencies: ["Sales", "Customer Service", "Dataverse estándar", "Omnichannel", "Copilot para servicio", "Fit-Gap D365"],
    status: "Parcial",
    gapNote: "Se apoya en el Módulo 20 (compartido) y en los labs 58/59 para Customer Insights y Field Service, pero aún no existen módulos dedicados a esas dos áreas ni a Omnichannel avanzado. Es una base sólida para Sales y Customer Service estándar; para Customer Insights o Field Service profundo, complementa con documentación oficial de Microsoft Learn.",
    nextRouteSlug: "solution-architect",
  },
  {
    slug: "finance-operations",
    title: "Ruta Finance & Operations",
    role: "Consultor que entiende ERP, CRM e integración empresarial",
    summary: "Agrupa los fundamentos disponibles de arquitectura, datos, integración y gobierno mientras se construyen módulos F&O dedicados.",
    outcome: "Explicar cuándo aplica F&O, cómo se integra con Dataverse y qué límites tiene Power Platform alrededor de ERP.",
    level: "Especialización",
    accent: "#8661C5",
    modules: [1, 18, 24, 31, 34, 35, 36, 38, 39, 41, 53],
    labs: [
      "lab-19-cicd-azure-devops",
      "lab-54-conectar-app-externa-dataverse",
      "lab-56-cambiar-entornos-dev-test-prod",
    ],
    competencies: ["ERP vs CRM", "Dual-write conceptual", "Data Management", "Integración", "Gobernanza", "Seguridad"],
    status: "Cobertura en expansión",
    gapNote: "Todavía no hay módulos dedicados a Finance & Operations (procesos financieros, cadena de suministro, Data Management Framework, dual-write real). Esta ruta agrupa los fundamentos transferibles de arquitectura, integración y gobierno que aplican también a F&O, mientras se desarrollan módulos específicos del producto.",
    nextRouteSlug: "solution-architect",
  },
  {
    slug: "ai-copilot",
    title: "Ruta AI & Copilot",
    role: "Profesional que usa IA con control, seguridad y trazabilidad",
    summary: "Integra Copilot Studio, AI Builder, copilots de desarrollo, revisión de diffs, seguridad de prompts y flujos humano-IA-CI.",
    outcome: "Aplicar IA como acelerador responsable en desarrollo, consultoría, arquitectura y operación Power Platform/D365.",
    level: "Especialización",
    accent: "#9333EA",
    modules: [15, 22, 37, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 54, 55],
    labs: [
      "lab-22-copilot-studio",
      "lab-45-copilot-implementacion-guiada",
      "lab-51-flujo-completo-humano-ia-ci",
      "lab-55-uat-gonolive-y-auditoria-prompts",
    ],
    competencies: ["Copilot Studio", "AI Builder", "Prompting técnico", "Revisión de diffs", "Seguridad IA", "Guardrails"],
    status: "Disponible",
    nextRouteSlug: "developer",
  },
];

export function getAllProfessionalRoutes(): ProfessionalRoute[] {
  return PROFESSIONAL_ROUTES;
}

export function getProfessionalRouteBySlug(slug: string): ProfessionalRoute | undefined {
  return PROFESSIONAL_ROUTES.find((route) => route.slug === slug);
}
