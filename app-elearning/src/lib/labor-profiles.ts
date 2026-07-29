import type { ProfessionalRouteSlug } from "@/lib/professional-routes";
import { getProfessionalRouteBySlug } from "@/lib/professional-routes";

export interface LaborProfile {
  slug: string;
  title: string;
  accent: string;
  summary: string;
  routeSlugs: ProfessionalRouteSlug[];
  jobReadyLabSlugs: string[];
  minimumEvidence: string[];
  jobReadyGuideHref: string;
  interviewHref: string;
}

const INTERVIEW_HREF = "/recursos/job-ready-interview-readiness";

const LABOR_PROFILES: LaborProfile[] = [
  {
    slug: "crm-functional-specialist",
    title: "CRM Functional Specialist",
    accent: "#0078D4",
    summary: "Discovery, fit-gap, configuración funcional, UAT, soporte y evidencia consultiva sobre Dynamics 365 CE.",
    routeSlugs: ["consultor-funcional", "dynamics-365-customer-engagement"],
    jobReadyLabSlugs: [
      "lab-71-jr-001-model-driven-app-job-test",
      "lab-77-jr-007-customer-service-specialist-simulation",
      "lab-101-jr-013-crm-functional-analyst-caso-integrado",
      "lab-102-jr-014-sales-lead-to-cash-job-test",
      "lab-103-jr-015-functional-post-go-live-incident-simulation",
      "lab-79-jr-009-technical-interview-simulation",
    ],
    minimumEvidence: getProfessionalRouteBySlug("consultor-funcional")?.portfolioEvidence ?? [],
    jobReadyGuideHref: "/recursos/job-ready-crm-functional",
    interviewHref: INTERVIEW_HREF,
  },
  {
    slug: "crm-developer",
    title: "CRM Developer",
    accent: "#EA580C",
    summary: "JavaScript, C#, plugins, integraciones, migración y troubleshooting técnico sobre Dataverse y Dynamics 365.",
    routeSlugs: ["developer"],
    jobReadyLabSlugs: [
      "lab-72-jr-002-crm-javascript-customization",
      "lab-73-jr-003-dataverse-plugin-csharp",
      "lab-91-jr-011-custom-api-workflow-extensibility",
      "lab-92-jr-012-production-incident-simulation",
      "lab-80-jr-010-ai-assisted-crm-development",
      "lab-79-jr-009-technical-interview-simulation",
    ],
    minimumEvidence: getProfessionalRouteBySlug("developer")?.portfolioEvidence ?? [],
    jobReadyGuideHref: "/recursos/job-ready-crm-developer",
    interviewHref: INTERVIEW_HREF,
  },
  {
    slug: "admin-governance",
    title: "Admin / Governance Specialist",
    accent: "#D13438",
    summary: "PPAC, ambientes, DLP, seguridad, auditoría y operación administrada a escala.",
    routeSlugs: ["solution-architect"],
    jobReadyLabSlugs: ["lab-76-jr-006-ppac-governance-assessment", "lab-79-jr-009-technical-interview-simulation"],
    minimumEvidence: getProfessionalRouteBySlug("solution-architect")?.portfolioEvidence ?? [],
    jobReadyGuideHref: "/recursos/job-ready-admin-governance",
    interviewHref: INTERVIEW_HREF,
  },
  {
    slug: "data-migration-crm-legacy",
    title: "Data Migration + CRM Legacy",
    accent: "#8661C5",
    summary: "Migración, limpieza, mapeo, CRM on-premises y modernización controlada hacia Dynamics 365.",
    routeSlugs: ["finance-operations"],
    jobReadyLabSlugs: [
      "lab-74-jr-004-crm-integration-challenge",
      "lab-75-jr-005-data-migration-dynamics",
      "lab-78-jr-008-crm-legacy-health-assessment",
    ],
    minimumEvidence: getProfessionalRouteBySlug("finance-operations")?.portfolioEvidence ?? [],
    jobReadyGuideHref: "/recursos/job-ready-data-migration-legacy",
    interviewHref: INTERVIEW_HREF,
  },
  {
    slug: "rpa-developer-automation-engineer",
    title: "RPA Developer / Automation Engineer",
    accent: "#6B4EFF",
    summary: "Power Automate Desktop, procesos atendidos/no atendidos, selectores, integración cloud, operación y soporte.",
    routeSlugs: ["rpa"],
    jobReadyLabSlugs: [
      "lab-104-rpa-primer-desktop-flow-mantenible",
      "lab-105-rpa-excel-consolidacion-ventas",
      "lab-106-rpa-automatizacion-web-portal",
      "lab-109-rpa-errores-idempotencia",
      "lab-111-rpa-despliegue-operacion-unattended",
      "lab-112-rpa-capstone-proceso-administrativo",
    ],
    minimumEvidence: getProfessionalRouteBySlug("rpa")?.portfolioEvidence ?? [],
    jobReadyGuideHref: "/recursos/rpa-portafolio-empleabilidad",
    interviewHref: INTERVIEW_HREF,
  },
];

export function getLaborProfiles(): LaborProfile[] {
  return LABOR_PROFILES;
}

export function getLaborProfileBySlug(slug: string): LaborProfile | undefined {
  return LABOR_PROFILES.find((profile) => profile.slug === slug);
}
