export type ProfessionalRouteSlug =
  | "maker"
  | "consultor-funcional"
  | "developer"
  | "solution-architect"
  | "dynamics-365-customer-engagement"
  | "dynamics-365-customer-insights"
  | "dynamics-365-field-service"
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
  status:
    | "Disponible"
    | "Parcial"
    | "Especialización en construcción"
    | "Avanzado — especializaciones en expansión"
    | "Awareness avanzado — práctica en roadmap";
  gapNote?: string;
  nextRouteSlug?: ProfessionalRouteSlug;
  /** Slug del lab que funciona como proyecto final evaluable de la ruta. */
  capstoneLabSlug?: string;
  /** moduleId del módulo que funciona como proyecto final cuando el capstone no es un lab (p. ej. el módulo 41 de arquitectura). */
  capstoneModuleId?: number;
  /** Entregables concretos del capstone que deberían reunirse como evidencia de portafolio. */
  portfolioEvidence: string[];
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
      "lab-61-capstone-maker-sistema-solicitudes",
    ],
    competencies: ["Canvas Apps", "Model-Driven Apps", "Dataverse básico", "Power Automate", "Power Fx"],
    status: "Disponible",
    capstoneLabSlug: "lab-61-capstone-maker-sistema-solicitudes",
    portfolioEvidence: [
      "Captura de la Canvas App funcionando (pantallas principales)",
      "Captura o log de una ejecución exitosa del flujo de aprobación",
      "Captura de acceso restringido probado con un segundo usuario",
      "Manual de usuario de 1-2 páginas",
    ],
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
      "lab-62-capstone-consultor-funcional-proyecto-completo",
    ],
    competencies: ["Discovery", "Requerimientos", "Fit-Gap", "Seguridad funcional", "UAT", "Capacitación"],
    status: "Parcial",
    gapNote: "Cubre bien Power Platform genérico (requerimientos, fit-gap, seguridad, UAT), pero todavía no tiene módulos dedicados de consultoría funcional específicos de Dynamics 365 CE/F&O (procesos estándar por industria, catálogos de producto, configuración de áreas funcionales). Complementa esta ruta con Dynamics 365 Customer Engagement o Finance & Operations según el dominio del cliente.",
    capstoneLabSlug: "lab-62-capstone-consultor-funcional-proyecto-completo",
    portfolioEvidence: [
      "Acta de discovery con preguntas reales, no genéricas",
      "Backlog de historias de usuario con criterios de aceptación",
      "Matriz Fit-Gap y matriz de trazabilidad",
      "8 casos UAT con resultado",
      "Presentación funcional de 6-8 láminas",
    ],
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
      "lab-63-capstone-developer-solucion-tecnica-avanzada",
    ],
    competencies: ["Plugins C#", "PCF", "Dataverse Web API", "Custom Connectors", "ALM", "CI/CD"],
    status: "Disponible",
    capstoneLabSlug: "lab-63-capstone-developer-solucion-tecnica-avanzada",
    portfolioEvidence: [
      "Repositorio con el código del plugin/PCF/connector",
      "Resultado de la ejecución de los unit tests",
      "Solución exportada (.zip) o captura del pipeline ejecutado",
      "Documento técnico con decisiones no obvias",
    ],
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
    capstoneModuleId: 41,
    portfolioEvidence: [
      "Architecture Blueprint con ADRs y diagrama aprobado por mentor",
      "Solución desplegada en ambientes DEV/TEST",
      "Well-Architected Review con plan de remediación",
      "Presentación ejecutiva de 10 láminas",
    ],
    nextRouteSlug: "ai-copilot",
  },
  {
    slug: "dynamics-365-customer-engagement",
    title: "Ruta Dynamics 365 Customer Engagement",
    role: "Consultor funcional D365 CE para ventas y servicio",
    summary: "Profundiza en Sales, Customer Service, Contact Center, Customer Insights, Field Service y el diseño funcional CE enterprise.",
    outcome: "Diseñar procesos D365 CE end-to-end con pipeline, SLA, routing, journeys, Customer 360, Field Service y frontera ERP clara.",
    level: "Especialización",
    accent: "#4F6BED",
    modules: [1, 4, 9, 15, 20, 22, 30, 39, 53, 55, 56, 57, 58, 60, 61, 62, 63, 65],
    labs: [
      "lab-22-copilot-studio",
      "lab-55-uat-gonolive-y-auditoria-prompts",
      "lab-57-diseno-solucion-d365-sales-con-ia",
      "lab-58-customer-insights-segmento-journey",
      "lab-59-field-service-work-order-uat",
      "lab-60-proyecto-integrador-servicio-postventa",
      "lab-66-sales-lead-to-cash",
      "lab-67-customer-360-insights-data",
      "lab-68-customer-service-case-to-resolution",
      "lab-81-d365-sales-forecasting-pipeline-review",
      "lab-82-customer-service-sla-entitlements-routing",
      "lab-83-contact-center-simulation",
      "lab-84-customer-insights-real-time-journey",
      "lab-85-customer-insights-data-unification",
      "lab-86-field-service-agreement-preventive-maintenance",
      "lab-87-field-service-mobile-offline-work-order",
      "lab-90-capstone-enterprise-d365",
    ],
    competencies: ["Sales Forecasting", "Customer Service SLA", "Contact Center", "Customer Insights Data/Journeys", "Field Service", "Fit-Gap D365"],
    status: "Disponible",
    gapNote: "La ruta ya cubre Sales avanzado, Customer Service avanzado, Contact Center/Omnichannel (incluye canal de chat hands-on en trial, LAB-083), Customer Insights - Data, Customer Insights - Journeys, Field Service end-to-end y capstone enterprise. La práctica real de forecasting, journeys, mobile offline, RSO y canales de Voz/SMS de Contact Center requiere tenant/licencias/proveedor de telefonía correspondientes.",
    capstoneLabSlug: "lab-90-capstone-enterprise-d365",
    portfolioEvidence: [
      "Documento de diseño de 3-5 páginas (TO-BE, Fit-Gap)",
      "Matriz de trazabilidad y 8 casos UAT",
      "Diseño de Customer Insights Data/Journeys y de Field Service",
      "Matriz de configuración de colas, diseño de SLA con pausa/reanudación y dashboard de servicio (LAB-068)",
      "Matriz de forecast/pipeline, workstream Contact Center y diseño de mobile offline",
      "Flujo de Power Automate con trigger, acciones y manejo de error",
      "Decisión de integración F&O (proceso ERP + dual-write/DMF/virtual tables) y 2 ADRs con roadmap",
      "Capstone Enterprise D365 con Fit-Gap, ownership, roadmap, UAT y resumen ejecutivo",
    ],
    nextRouteSlug: "solution-architect",
  },
  {
    slug: "dynamics-365-customer-insights",
    title: "Ruta Dynamics 365 Customer Insights",
    role: "Consultor que diseña Customer 360, segmentación y journeys gobernados",
    summary: "Separa Customer Insights - Data y Customer Insights - Journeys para construir perfiles unificados, consentimiento, triggers y activación de audiencias sin mezclar CDP con ejecución de marketing.",
    outcome: "Diseñar un flujo Customer 360 + real-time journey con datos unificados, consentimiento, canal, métricas y límites claros de tenant/licencia.",
    level: "Especialización",
    accent: "#0D9488",
    modules: [20, 56, 57, 63, 65],
    labs: [
      "lab-58-customer-insights-segmento-journey",
      "lab-67-customer-360-insights-data",
      "lab-84-customer-insights-real-time-journey",
      "lab-85-customer-insights-data-unification",
      "lab-90-capstone-enterprise-d365",
    ],
    competencies: ["Customer Insights - Data", "Customer Insights - Journeys", "Consentimiento", "Segmentos", "Triggers", "Analytics"],
    status: "Disponible",
    gapNote: "La ejecución real requiere Customer Insights habilitado, canales/dominios configurados, datos de prueba y permisos. Sin tenant, la ruta se evalúa con diseño documentado, matriz de consentimiento y simulación de journey.",
    capstoneLabSlug: "lab-90-capstone-enterprise-d365",
    portfolioEvidence: [
      "Mapa de fuentes y reglas de unificación de Customer Insights - Data",
      "Segmentos y medidas con fórmula o criterio de negocio documentado",
      "Diseño de real-time journey con trigger, consentimiento, canal, salida y métricas",
      "Prueba negativa de consentimiento o exclusión de audiencia",
    ],
    nextRouteSlug: "dynamics-365-customer-engagement",
  },
  {
    slug: "dynamics-365-field-service",
    title: "Ruta Dynamics 365 Field Service",
    role: "Consultor CE especializado en operación de campo y ciclo de work orders",
    summary: "Profundiza en work orders, agreements, activos, inspecciones, inventario, mobile offline, scheduling y RSO desde una perspectiva end-to-end.",
    outcome: "Diseñar y validar un proceso Field Service completo con mantenimiento preventivo, ciclo de orden de trabajo, movilidad y criterios operativos.",
    level: "Especialización",
    accent: "#107C10",
    modules: [20, 56, 58, 65],
    labs: [
      "lab-59-field-service-work-order-uat",
      "lab-86-field-service-agreement-preventive-maintenance",
      "lab-87-field-service-mobile-offline-work-order",
      "lab-90-capstone-enterprise-d365",
    ],
    competencies: ["Work Orders", "Agreements", "Assets", "Inspections", "Mobile Offline", "Scheduling", "RSO"],
    status: "Disponible",
    gapNote: "La ejecución real requiere Dynamics 365 Field Service instalado, roles adecuados, recursos configurados y, para RSO/mobile offline, licenciamiento y configuración adicional. Sin tenant, se evalúa con matriz de diseño y simulación del ciclo.",
    capstoneLabSlug: "lab-90-capstone-enterprise-d365",
    portfolioEvidence: [
      "Diseño end-to-end de work order lifecycle",
      "Agreement de mantenimiento preventivo con recurrencia y evidencia esperada",
      "Matriz de mobile offline por perfil, tabla y conflicto",
      "Criterios de scheduling/RSO y restricciones operativas",
    ],
    nextRouteSlug: "dynamics-365-customer-engagement",
  },
  {
    slug: "finance-operations",
    title: "Ruta Finance & Operations",
    role: "Consultor que entiende ERP, CRM e integración empresarial",
    summary: "Agrupa arquitectura, procesos ERP, ownership de datos e integración CE + F&O para participar con criterio en proyectos enterprise.",
    outcome: "Explicar cuándo aplica F&O, cómo se integra con Dataverse y qué límites tiene Power Platform alrededor de ERP.",
    level: "Especialización",
    accent: "#8661C5",
    modules: [1, 18, 24, 31, 34, 35, 36, 38, 39, 41, 53, 59, 64, 65],
    labs: [
      "lab-19-cicd-azure-devops",
      "lab-54-conectar-app-externa-dataverse",
      "lab-56-cambiar-entornos-dev-test-prod",
      "lab-69-fo-process-mapping-erp-end-to-end",
      "lab-70-ce-fo-integration-architecture",
      "lab-64-capstone-fo-awareness-arquitectura-erp-crm",
      "lab-88-ce-fo-dual-write-ownership-matrix",
      "lab-89-fo-process-mapping-advanced",
      "lab-93-fo-finance-setup-walkthrough",
      "lab-94-fo-procure-to-pay-hands-on",
      "lab-95-fo-order-to-cash-hands-on",
      "lab-96-fo-inventory-products-setup",
      "lab-97-fo-project-operations-setup",
      "lab-98-fo-commerce-overview-hands-on",
      "lab-99-fo-security-duty-privilege-hands-on",
      "lab-100-fo-reporting-hands-on",
      "lab-90-capstone-enterprise-d365",
    ],
    competencies: ["ERP vs CRM", "Procesos ERP estándar", "Mapeo de procesos O2C/P2P/R2R/I2D", "Dual-write técnico", "Virtual tables", "Data Management", "Gobernanza", "Configuración Finance/SCM/Project Operations/Commerce/Seguridad/Reporting (trial tenant)"],
    status: "Avanzado — especializaciones en expansión",
    gapNote: "La ruta cubre F&O awareness avanzado, process mapping, matriz de ownership, diseño CE + F&O y —desde LAB-093 a LAB-100— configuración hands-on completa de Finance, Procure-to-Pay, Order-to-Cash, inventario/producto, Project Operations, Commerce, seguridad (duty/privilege) y reporting en un trial tenant. Esos 8 labs no fueron verificados contra un tenant en vivo al momento de escribirse (ver nota de verificación en cada uno) — esa verificación, no la falta de contenido, es lo único que falta para que la ruta se presente como F&O Practitioner disponible. Sigue faltando LCS awareness con la misma profundidad práctica.",
    capstoneLabSlug: "lab-90-capstone-enterprise-d365",
    portfolioEvidence: [
      "5 mapas de proceso ERP (O2C/P2P/R2R/I2D/Project-to-Profit) con pasos, actores y sistema responsable (LAB-069)",
      "Diagrama Mermaid de integración y matriz de ownership de datos por entidad (LAB-070)",
      "Tabla de clasificación de procesos ERP vs. CRM con el proceso ERP estándar nombrado (O2C/P2P/R2R/I2D)",
      "Mapa de integración con dirección del dual-write",
      "Decisión justificada de dual-write vs. DMF vs. virtual tables para un caso concreto",
      "Setup financiero ejecutado en trial tenant: legal entity, calendario fiscal, catálogo de cuentas y dimensiones (LAB-093)",
      "Ciclo Procure-to-Pay y Order-to-Cash ejecutados end-to-end con manejo de discrepancia/parcialidad (LAB-094, LAB-095)",
      "Diseño de roles de seguridad F&O sin conflicto de segregación de funciones (LAB-099)",
      "Balance de comprobación y workspace con Power BI embebido documentados (LAB-100)",
      "Matriz de riesgos de la integración",
      "Documento ejecutivo de 1-2 páginas",
    ],
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
      "lab-65-capstone-ai-copilot-agente-gobernado",
    ],
    competencies: ["Copilot Studio", "AI Builder", "Prompting técnico", "Revisión de diffs", "Seguridad IA", "Guardrails"],
    status: "Disponible",
    capstoneLabSlug: "lab-65-capstone-ai-copilot-agente-gobernado",
    portfolioEvidence: [
      "Documento de diseño del agente (alcance, temas, fuentes)",
      "Matriz de riesgos de IA y política de escalamiento humano",
      "Transcripts de 3 conversaciones de prueba",
      "Plan de monitoreo con métrica y frecuencia",
    ],
    nextRouteSlug: "developer",
  },
];

export function getAllProfessionalRoutes(): ProfessionalRoute[] {
  return PROFESSIONAL_ROUTES;
}

export function getProfessionalRouteBySlug(slug: string): ProfessionalRoute | undefined {
  return PROFESSIONAL_ROUTES.find((route) => route.slug === slug);
}
