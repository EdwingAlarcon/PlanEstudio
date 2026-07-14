// Hubs de dominio: agrupan y enlazan contenido existente (módulos, labs, rutas, recursos)
// sin crear módulos ni labs nuevos. Ver docs/CLAUDE.md — arquitectura de información v1.2.

export interface DomainHubLink {
  title: string;
  description: string;
  href: string;
}

export interface DomainHubSection {
  title: string;
  description: string;
  links: DomainHubLink[];
}

export interface DomainHubStep {
  label: string;
  description: string;
}

export interface DomainHub {
  title: string;
  promise: string;
  accent: string;
  primarySteps: DomainHubStep[];
  sections: DomainHubSection[];
  roadmap: DomainHubLink;
}

export function getPowerPlatformHub(): DomainHub {
  return {
    title: "Power Platform",
    accent: "#0078D4",
    promise:
      "Todo el contenido de Power Platform del plan — fundamentos, Dataverse, Power Apps, Power Automate, Power Pages, ALM, gobernanza, developer y arquitectura — reunido en un solo mapa, sin duplicar módulos.",
    primarySteps: [
      { label: "Fundamentos", description: "Ecosistema, Dataverse básico y Power Fx antes de construir." },
      { label: "Construir", description: "Canvas, Model-Driven, Power Automate y Power Pages." },
      { label: "Administrar y extender", description: "ALM, gobernanza, CoE, JavaScript, PCF y plugins." },
      { label: "Arquitectura", description: "Diseño de soluciones enterprise y preparación PL-600." },
    ],
    sections: [
      {
        title: "Fundamentos",
        description: "Base común antes de especializarse en un producto.",
        links: [
          { title: "Introducción al ecosistema Power Platform", description: "Módulo 1 — panorama de productos y licenciamiento.", href: "/nivel/basico/modulo/introduccion-al-ecosistema-power-platform" },
          { title: "Fundamentos de Power Fx y expresiones", description: "Módulo 7 — sintaxis y funciones base.", href: "/nivel/basico/modulo/fundamentos-de-power-fx-y-expresiones" },
          { title: "Nivel Básico completo (PL-900)", description: "8 módulos + primer proyecto integrado.", href: "/nivel/basico" },
        ],
      },
      {
        title: "Dataverse",
        description: "Modelo de datos común a Power Apps, Power Automate y Dynamics 365.",
        links: [
          { title: "Dataverse — Fundamentos y modelado básico", description: "Módulo 2 — tablas, columnas y relaciones.", href: "/nivel/basico/modulo/dataverse-fundamentos-y-modelado-basico" },
          { title: "Dataverse Avanzado", description: "Módulo 9 — seguridad, plugins declarativos y rendimiento.", href: "/nivel/intermedio/modulo/dataverse-avanzado" },
          { title: "Lab 02 — Modelado de datos", description: "Práctica de modelado para un sistema de solicitudes.", href: "/labs/lab-02-dataverse-modelo-datos" },
          { title: "Lab 09 — Dataverse avanzado", description: "BPF, seguridad de columnas y auditoría.", href: "/labs/lab-09-dataverse-avanzado" },
        ],
      },
      {
        title: "Power Apps",
        description: "Canvas Apps y Model-Driven Apps.",
        links: [
          { title: "Power Apps Canvas — Primeras aplicaciones", description: "Módulo 3.", href: "/nivel/basico/modulo/power-apps-canvas-primeras-aplicaciones" },
          { title: "Power Apps Model-Driven", description: "Módulo 4 — apps basadas en datos.", href: "/nivel/basico/modulo/power-apps-model-driven-apps-basadas-en-datos" },
          { title: "Canvas Apps — Componentes y reutilización", description: "Módulo 10.", href: "/nivel/intermedio/modulo/canvas-apps-componentes-y-reutilizacion" },
          { title: "Lab 03 — Primera Canvas App", description: "App de gestión de solicitudes.", href: "/labs/lab-03-canvas-primera-app" },
          { title: "Lab 04 — Model-Driven App", description: "Sistema completo de gestión de solicitudes.", href: "/labs/lab-04-model-driven-app" },
        ],
      },
      {
        title: "Power Automate",
        description: "Automatización de procesos y flujos avanzados.",
        links: [
          { title: "Power Automate — Automatización básica", description: "Módulo 5.", href: "/nivel/basico/modulo/power-automate-automatizacion-basica" },
          { title: "Power Automate Avanzado", description: "Módulo 11.", href: "/nivel/intermedio/modulo/power-automate-avanzado" },
          { title: "Lab 05 — Flujo de aprobación", description: "Automatización de aprobación end-to-end.", href: "/labs/lab-05-automate-aprobacion" },
        ],
      },
      {
        title: "Power Pages",
        description: "Portales externos y extensibilidad con Azure AD B2C.",
        links: [
          { title: "Power Pages — Portales externos", description: "Módulo 21.", href: "/nivel/avanzado/modulo/power-pages-portales-externos" },
          { title: "Power Pages Avanzado y Azure AD B2C", description: "Módulo 29.", href: "/nivel/avanzado/modulo/power-pages-avanzado-y-azure-ad-b2c" },
        ],
      },
      {
        title: "ALM",
        description: "Ciclo de vida de soluciones y CI/CD.",
        links: [
          { title: "ALM y CI/CD con Azure DevOps", description: "Módulo 19.", href: "/nivel/avanzado/modulo/alm-y-ci-cd-con-azure-devops" },
          { title: "ALM de soluciones con apoyo de IA", description: "Módulo 54.", href: "/nivel/ia/modulo/alm-de-soluciones-con-ia" },
          { title: "Lab 19 — CI/CD con Azure DevOps", description: "Pipeline de exportación e importación de soluciones.", href: "/labs/lab-19-cicd-azure-devops" },
        ],
      },
      {
        title: "Administración y gobernanza",
        description: "Seguridad, CoE y operación a escala.",
        links: [
          { title: "Seguridad y administración de soluciones", description: "Módulo 16.", href: "/nivel/intermedio/modulo/seguridad-y-administracion-de-soluciones" },
          { title: "CoE Starter Kit y administración a escala", description: "Módulo 32.", href: "/nivel/arquitecto/modulo/coe-starter-kit-y-administracion-a-escala" },
          { title: "Seguridad y cumplimiento enterprise", description: "Módulo 36.", href: "/nivel/arquitecto/modulo/seguridad-y-cumplimiento-enterprise" },
          { title: "Lab 32 — CoE Starter Kit", description: "Instalación y componentes clave.", href: "/labs/lab-32-coe-starter-kit" },
          { title: "Admin / Governance Job-Ready", description: "PPAC, ambientes, DLP y auditoría.", href: "/recursos/job-ready-admin-governance" },
        ],
      },
      {
        title: "Developer",
        description: "Extensibilidad con código: JavaScript, PCF, plugins y conectores.",
        links: [
          { title: "JavaScript y PCF básico", description: "Módulo 13.", href: "/nivel/intermedio/modulo/javascript-y-pcf-basico" },
          { title: "Conectores personalizados", description: "Módulo 14.", href: "/nivel/intermedio/modulo/conectores-personalizados" },
          { title: "C# Plugins para Dataverse", description: "Módulo 23.", href: "/nivel/avanzado/modulo/c-plugins-para-dataverse" },
          { title: "PCF Avanzado con TypeScript y React", description: "Módulo 27.", href: "/nivel/avanzado/modulo/pcf-avanzado-con-typescript-y-react" },
          { title: "Lab 23 — Plugin en C#", description: "Plugin síncrono con manejo de errores.", href: "/labs/lab-23-plugin-csharp" },
          { title: "Lab 91 — Custom API & Workflow Extensibility Job Test", description: "Custom API, Custom Workflow Activity legacy y criterio de elección de mecanismo.", href: "/labs/lab-91-jr-011-custom-api-workflow-extensibility" },
          { title: "Lab 92 — Production Incident Simulation", description: "Diagnóstico de un incidente de producción con Plugin Trace Log.", href: "/labs/lab-92-jr-012-production-incident-simulation" },
        ],
      },
      {
        title: "Architect",
        description: "Diseño de soluciones enterprise y preparación PL-600.",
        links: [
          { title: "Arquitectura de soluciones Power Platform", description: "Módulo 18.", href: "/nivel/avanzado/modulo/arquitectura-de-soluciones-power-platform" },
          { title: "Enterprise Architecture y Gobernanza", description: "Módulo 31.", href: "/nivel/arquitecto/modulo/enterprise-architecture-y-gobernanza" },
          { title: "Multi-tenant, multi-geo y ambientes", description: "Módulo 33.", href: "/nivel/arquitecto/modulo/multi-tenant-multi-geo-y-estrategia-de-ambientes" },
          { title: "Arquitectura Power Platform — Casos de estudio", description: "Módulo 40, preparación PL-600.", href: "/nivel/arquitecto/modulo/preparacion-pl-600" },
          { title: "Proyecto Capstone — Arquitectura Enterprise", description: "Módulo 41.", href: "/nivel/arquitecto/modulo/proyecto-capstone-arquitectura-enterprise" },
        ],
      },
      {
        title: "Rutas relacionadas",
        description: "Recorridos por rol que reutilizan estos mismos módulos y labs.",
        links: [
          { title: "Ruta Maker", description: "Usuario de negocio que construye soluciones low-code.", href: "/rutas/maker" },
          { title: "Ruta Developer", description: "Extensibilidad, ALM e integración con código.", href: "/rutas/developer" },
          { title: "Ruta Solution Architect", description: "Gobernanza, seguridad y arquitectura enterprise.", href: "/rutas/solution-architect" },
        ],
      },
    ],
    roadmap: {
      title: "Roadmap de especialización avanzada",
      description: "Temas de Power Platform que requieren tenant, licencia o ambiente real.",
      href: "/recursos/roadmap-especializacion-avanzada",
    },
  };
}

export function getDynamics365Hub(): DomainHub {
  return {
    title: "Dynamics 365",
    accent: "#0D9488",
    promise:
      "Especialización práctica en Dynamics 365 Customer Engagement (Sales, Customer Service, Customer Insights, Field Service, Contact Center) más awareness avanzado de Finance & Operations. No es una certificación de experto D365 completo: cada sección indica qué está listo con módulos y labs, y qué requiere tenant o licencia real.",
    primarySteps: [
      { label: "Base CE", description: "Sales y Customer Service como fundación de Customer Engagement." },
      { label: "Especializar", description: "Customer Insights, Field Service y Contact Center." },
      { label: "Awareness ERP", description: "F&O — procesos, vocabulario y frontera con CE." },
      { label: "Capstone", description: "Integrar todo en un caso enterprise evaluable." },
    ],
    sections: [
      {
        title: "Customer Engagement — Foundation",
        description: "Base de Sales y Customer Service antes de especializar.",
        links: [
          { title: "Dynamics 365 CE — Sales y Customer Service", description: "Módulo 20.", href: "/nivel/avanzado/modulo/dynamics-365-ce-sales-y-customer-service" },
          { title: "Dynamics 365 CE Avanzado — Customer Engagement como ecosistema", description: "Módulo 56.", href: "/nivel/d365/modulo/introduccion-dynamics-365-avanzado" },
        ],
      },
      {
        title: "Sales",
        description: "Forecasting, pipeline y sales operations.",
        links: [
          { title: "Dynamics 365 Sales Avanzado", description: "Módulo 60 — forecasting, pipeline y sales operations.", href: "/nivel/d365/modulo/dynamics-365-sales-avanzado" },
          { title: "Lab 57 — Diseño de solución D365 Sales con IA", description: "Diseño funcional asistido por IA.", href: "/labs/lab-57-diseno-solucion-d365-sales-con-ia" },
          { title: "Lab 66 — Sales lead-to-cash", description: "Ciclo completo de oportunidad a cierre.", href: "/labs/lab-66-sales-lead-to-cash" },
          { title: "Lab 81 — Sales forecasting y pipeline review", description: "Revisión de forecast y pipeline.", href: "/labs/lab-81-d365-sales-forecasting-pipeline-review" },
        ],
      },
      {
        title: "Customer Service",
        description: "SLA, entitlements, routing y resolución de casos.",
        links: [
          { title: "Dynamics 365 Customer Service Avanzado", description: "Módulo 61 — SLA, entitlements y routing.", href: "/nivel/d365/modulo/dynamics-365-customer-service-avanzado" },
          { title: "Lab 68 — Customer Service case-to-resolution", description: "Ciclo completo de un caso.", href: "/labs/lab-68-customer-service-case-to-resolution" },
          { title: "Lab 82 — SLA, entitlements y routing", description: "Configuración de colas y SLA con pausa/reanudación.", href: "/labs/lab-82-customer-service-sla-entitlements-routing" },
        ],
      },
      {
        title: "Customer Insights",
        description: "Data (Customer 360) y Journeys (real-time, consentimiento).",
        links: [
          { title: "Customer Insights - Data — Unificación de perfiles", description: "Módulo 57.", href: "/nivel/d365/modulo/customer-insights-data-unificacion-perfiles" },
          { title: "Customer Insights - Journeys — Real-time y consentimiento", description: "Módulo 63.", href: "/nivel/d365/modulo/customer-insights-journeys-real-time" },
          { title: "Lab 58 — Segmento y journey", description: "Segmentación y journey básico.", href: "/labs/lab-58-customer-insights-segmento-journey" },
          { title: "Lab 67 — Customer 360 / Insights Data", description: "Unificación de perfiles.", href: "/labs/lab-67-customer-360-insights-data" },
          { title: "Lab 84 — Real-time journey", description: "Trigger, consentimiento y canal.", href: "/labs/lab-84-customer-insights-real-time-journey" },
          { title: "Lab 85 — Unificación de datos", description: "Reglas de unificación de Insights - Data.", href: "/labs/lab-85-customer-insights-data-unification" },
        ],
      },
      {
        title: "Field Service",
        description: "Work orders, agreements, mobile offline y scheduling/RSO.",
        links: [
          { title: "Field Service end-to-end", description: "Módulo 58 — work orders, agreements, mobile offline y RSO.", href: "/nivel/d365/modulo/field-service-scheduling-avanzado" },
          { title: "Lab 59 — Work order UAT", description: "Ciclo de vida de una orden de trabajo.", href: "/labs/lab-59-field-service-work-order-uat" },
          { title: "Lab 86 — Agreement y mantenimiento preventivo", description: "Recurrencia y evidencia esperada.", href: "/labs/lab-86-field-service-agreement-preventive-maintenance" },
          { title: "Lab 87 — Mobile offline work order", description: "Diseño de sincronización y conflictos.", href: "/labs/lab-87-field-service-mobile-offline-work-order" },
        ],
      },
      {
        title: "Contact Center / Omnichannel",
        description: "Canales, routing y operación (simulación — requiere tenant real para práctica productiva).",
        links: [
          { title: "Contact Center / Omnichannel — Canales, routing y operación", description: "Módulo 62.", href: "/nivel/d365/modulo/dynamics-365-contact-center-omnichannel" },
          { title: "Lab 83 — Simulación de Contact Center", description: "Diseño de canales y routing.", href: "/labs/lab-83-contact-center-simulation" },
        ],
      },
      {
        title: "F&O (Finance & Operations)",
        description: "Vocabulario y mapas de proceso, más configuración hands-on (LAB-093 a LAB-097) en trial tenant — requiere ambiente Dynamics 365 Finance/SCM propio.",
        links: [
          { title: "F&O Awareness — Procesos ERP, seguridad e integración con CE", description: "Módulo 59.", href: "/nivel/d365/modulo/finance-operations-procesos-erp" },
          { title: "Lab 69 — Process mapping ERP end-to-end", description: "Mapeo O2C/P2P/R2R/I2D.", href: "/labs/lab-69-fo-process-mapping-erp-end-to-end" },
          { title: "Lab 89 — Process mapping avanzado", description: "Profundización de mapeo de procesos.", href: "/labs/lab-89-fo-process-mapping-advanced" },
          { title: "Lab 93 — Finance Setup Walkthrough", description: "Legal entity, calendario fiscal, catálogo de cuentas y dimensiones en trial tenant.", href: "/labs/lab-93-fo-finance-setup-walkthrough" },
          { title: "Lab 94 — Procure-to-Pay Hands-On", description: "Orden de compra, recepción, factura y pago end-to-end.", href: "/labs/lab-94-fo-procure-to-pay-hands-on" },
          { title: "Lab 95 — Order-to-Cash Hands-On", description: "Pedido, envío, factura y cobro end-to-end.", href: "/labs/lab-95-fo-order-to-cash-hands-on" },
          { title: "Lab 96 — Inventory & Products Setup", description: "Variantes de producto, dimensiones y jerarquía de reservas.", href: "/labs/lab-96-fo-inventory-products-setup" },
          { title: "Lab 97 — Project Operations Setup", description: "WBS y facturación por hito + tiempo.", href: "/labs/lab-97-fo-project-operations-setup" },
          { title: "Lab 64 — Capstone F&O Awareness", description: "Arquitectura ERP + CRM.", href: "/labs/lab-64-capstone-fo-awareness-arquitectura-erp-crm" },
        ],
      },
      {
        title: "CRM Legacy y migración",
        description: "Modernización desde CRM on-premises y migración de datos.",
        links: [
          { title: "Data Migration + CRM Legacy Job-Ready", description: "Migración, limpieza, mapeo y modernización.", href: "/recursos/job-ready-data-migration-legacy" },
          { title: "Lab 75 — Data migration Dynamics", description: "Reto de migración de datos.", href: "/labs/lab-75-jr-005-data-migration-dynamics" },
          { title: "Lab 78 — CRM Legacy health assessment", description: "Diagnóstico de un CRM legacy.", href: "/labs/lab-78-jr-008-crm-legacy-health-assessment" },
        ],
      },
      {
        title: "Capstone enterprise",
        description: "Integra CE, Contact Center, Field Service e integración F&O en un caso evaluable.",
        links: [
          { title: "Capstone Enterprise D365", description: "Módulo 65.", href: "/nivel/d365/modulo/capstone-enterprise-d365" },
          { title: "Lab 90 — Capstone Enterprise D365", description: "Proyecto integrador final del nivel.", href: "/labs/lab-90-capstone-enterprise-d365" },
          { title: "Nivel D365 completo", description: "10 módulos de especialización.", href: "/nivel/d365" },
        ],
      },
      {
        title: "Academia D365 Expert Tracks",
        description: "Los 4 tracks de especialización avanzada del roadmap, con estado de madurez honesto — ninguno se presenta como 'experto' hasta tener configuración real verificable.",
        links: [
          { title: "🔵 Expert Customer Service / Contact Center", description: "Case management, SLA y routing avanzados; canales de voz/SMS reales quedan en awareness sin tenant con licencia.", href: "/recursos/roadmap-especializacion-avanzada" },
          { title: "🔵 Expert Sales Operations", description: "Forecasting y pipeline review con datos de prueba; Sales Insights predictivo requiere licencia Premium y datos históricos reales.", href: "/recursos/roadmap-especializacion-avanzada" },
          { title: "🔵 F&O Practitioner / Architect Track", description: "Vocabulario, mapas de proceso, integración CE+F&O y —desde LAB-093 a LAB-097— configuración hands-on de Finance/P2P/O2C/Inventory/Project Operations en trial tenant; Commerce, seguridad y reporting siguen en expansión.", href: "/recursos/roadmap-especializacion-avanzada" },
          { title: "🔵 Business Applications Architect Enterprise", description: "Capstone CE + F&O con ownership de datos, roadmap por fases y Fit-Gap enterprise.", href: "/recursos/roadmap-especializacion-avanzada" },
        ],
      },
      {
        title: "Rutas y recursos relacionados",
        description: "Recorridos por especialidad D365 y readiness de tenant.",
        links: [
          { title: "Ruta Dynamics 365 Customer Engagement", description: "Sales, Customer Service, Contact Center, Field Service.", href: "/rutas/dynamics-365-customer-engagement" },
          { title: "Ruta Dynamics 365 Customer Insights", description: "Data y Journeys sin mezclar CDP con ejecución de marketing.", href: "/rutas/dynamics-365-customer-insights" },
          { title: "Ruta Dynamics 365 Field Service", description: "Ciclo completo de operación de campo.", href: "/rutas/dynamics-365-field-service" },
          { title: "D365 Tenant Readiness", description: "Qué necesitas de tenant/licencia para practicar en real.", href: "/recursos/d365-tenant-readiness" },
        ],
      },
    ],
    roadmap: {
      title: "Roadmap de especialización avanzada",
      description: "Contact Center productivo, F&O configurado y expert tracks aún no cubiertos.",
      href: "/recursos/roadmap-especializacion-avanzada",
    },
  };
}

export function getIntegrationHub(): DomainHub {
  return {
    title: "Integración Power Platform + Dynamics 365",
    accent: "#8661C5",
    promise:
      "La capa puente: cómo Dataverse, ALM, Power Automate, Power Pages y las integraciones API conectan Power Platform con Dynamics 365 CE y con Finance & Operations. Reúne el contenido de integración que hoy vive disperso en niveles avanzado, arquitecto y D365.",
    primarySteps: [
      { label: "Base común", description: "Dataverse como plataforma de datos compartida entre Power Apps y D365." },
      { label: "Construir sobre D365", description: "Model-Driven, Power Automate y Power Pages usando entidades D365." },
      { label: "Integrar con Azure", description: "APIs, Logic Apps y conectores personalizados." },
      { label: "CE + F&O", description: "Dual-write, DMF, virtual tables y ownership de datos." },
    ],
    sections: [
      {
        title: "Dataverse como base común",
        description: "El modelo de datos que comparten Power Apps, Power Automate y Dynamics 365 CE.",
        links: [
          { title: "Dataverse Avanzado", description: "Módulo 9 — seguridad y rendimiento del modelo compartido.", href: "/nivel/intermedio/modulo/dataverse-avanzado" },
          { title: "Lab 09 — Dataverse avanzado", description: "BPF y seguridad de columnas.", href: "/labs/lab-09-dataverse-avanzado" },
        ],
      },
      {
        title: "Model-Driven Apps sobre Dynamics 365",
        description: "Construir experiencias propias sobre entidades D365 CE.",
        links: [
          { title: "Power Apps Model-Driven", description: "Módulo 4 — apps basadas en datos.", href: "/nivel/basico/modulo/power-apps-model-driven-apps-basadas-en-datos" },
          { title: "Dynamics 365 CE — Sales y Customer Service", description: "Módulo 20 — entidades estándar sobre las que se extiende.", href: "/nivel/avanzado/modulo/dynamics-365-ce-sales-y-customer-service" },
        ],
      },
      {
        title: "Power Automate y Power Pages con D365",
        description: "Automatización y portales que leen/escriben en entidades D365.",
        links: [
          { title: "Power Automate Avanzado", description: "Módulo 11 — flujos sobre eventos de Dataverse/D365.", href: "/nivel/intermedio/modulo/power-automate-avanzado" },
          { title: "Power Pages — Portales externos", description: "Módulo 21 — exposición controlada de datos D365 a usuarios externos.", href: "/nivel/avanzado/modulo/power-pages-portales-externos" },
        ],
      },
      {
        title: "ALM de soluciones CE",
        description: "Ciclo de vida de soluciones que incluyen componentes Dynamics 365.",
        links: [
          { title: "ALM y CI/CD con Azure DevOps", description: "Módulo 19.", href: "/nivel/avanzado/modulo/alm-y-ci-cd-con-azure-devops" },
          { title: "Lab 19 — CI/CD con Azure DevOps", description: "Pipeline de exportación/importación de soluciones.", href: "/labs/lab-19-cicd-azure-devops" },
        ],
      },
      {
        title: "Integraciones API y Azure Logic Apps",
        description: "Conectores personalizados y servicios Azure alrededor de Dataverse/D365.",
        links: [
          { title: "Integraciones con Azure Services", description: "Módulo 24.", href: "/nivel/avanzado/modulo/integraciones-con-azure-services" },
          { title: "Azure Integration Services Avanzado", description: "Módulo 34 — Logic Apps, Service Bus y patrones enterprise.", href: "/nivel/arquitecto/modulo/azure-integration-services-avanzado" },
          { title: "Lab 54 — Conectar app externa a Dataverse", description: "Custom connector hacia una app externa.", href: "/labs/lab-54-conectar-app-externa-dataverse" },
        ],
      },
      {
        title: "CE + F&O — dual-write, DMF y virtual tables",
        description: "Frontera técnica entre Dataverse/CE y Finance & Operations.",
        links: [
          { title: "F&O Awareness — Procesos ERP, seguridad e integración con CE", description: "Módulo 59.", href: "/nivel/d365/modulo/finance-operations-procesos-erp" },
          { title: "Integración CE + F&O — Dual-write, DMF y Ownership", description: "Módulo 64.", href: "/nivel/d365/modulo/integracion-ce-fo-dual-write-dmf" },
          { title: "Lab 70 — CE + F&O integration architecture", description: "Ownership de datos y dual-write técnico.", href: "/labs/lab-70-ce-fo-integration-architecture" },
          { title: "Lab 88 — Dual-write ownership matrix", description: "Matriz de ownership por entidad.", href: "/labs/lab-88-ce-fo-dual-write-ownership-matrix" },
          { title: "Lab 69 — Process mapping ERP end-to-end", description: "Mapeo O2C/P2P/R2R/I2D.", href: "/labs/lab-69-fo-process-mapping-erp-end-to-end" },
        ],
      },
      {
        title: "Capstones enterprise",
        description: "Proyectos que integran Power Platform y Dynamics 365 de punta a punta.",
        links: [
          { title: "Lab 60 — Proyecto integrador de servicio postventa", description: "Capstone D365 con Power Automate.", href: "/labs/lab-60-proyecto-integrador-servicio-postventa" },
          { title: "Capstone Enterprise D365", description: "Módulo 65 — arquitectura CE, Contact Center, Field Service e integración F&O.", href: "/nivel/d365/modulo/capstone-enterprise-d365" },
          { title: "Lab 90 — Capstone Enterprise D365", description: "Proyecto integrador final.", href: "/labs/lab-90-capstone-enterprise-d365" },
        ],
      },
      {
        title: "Rutas relacionadas",
        description: "Recorridos que combinan Power Platform y Dynamics 365.",
        links: [
          { title: "Ruta Finance & Operations", description: "ERP, ownership de datos e integración CE + F&O.", href: "/rutas/finance-operations" },
          { title: "Ruta Dynamics 365 Customer Engagement", description: "Diseño CE end-to-end con frontera ERP clara.", href: "/rutas/dynamics-365-customer-engagement" },
        ],
      },
    ],
    roadmap: {
      title: "Roadmap de especialización avanzada",
      description: "Integración productiva con F&O real y escenarios multi-sistema adicionales.",
      href: "/recursos/roadmap-especializacion-avanzada",
    },
  };
}
