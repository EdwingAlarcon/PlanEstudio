import type { LabInfo } from "@/lib/content";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";

export type DomainTag = "Power Platform" | "Dynamics 365" | "Integración" | "IA" | "RPA" | "Empleabilidad";

export const DOMAIN_TAGS: DomainTag[] = ["Power Platform", "Dynamics 365", "Integración", "IA", "RPA", "Empleabilidad"];

export interface LabPresentationMeta {
  kind: string;
  kindLabel: string;
  routes: string[];
  recommendedLevel: string;
  difficulty: string;
  evidenceSummary: string;
  competencies: string[];
  certificationBadges: string[];
  historicalCertifications: string[];
  domains: DomainTag[];
}

const LEVEL_LABELS: Record<string, string> = {
  N1: "Nivel 1 - Básico",
  N2: "Nivel 2 - Intermedio",
  N3: "Nivel 3 - Avanzado",
  N4: "Nivel 4 - Arquitecto",
  N5: "Nivel IA",
  N6: "Nivel D365",
  RPA: "Especialización RPA",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  N1: "Fundacional",
  N2: "Intermedia",
  N3: "Avanzada",
  N4: "Enterprise",
  N5: "Especializada",
  N6: "Especializada D365",
  RPA: "Especializada RPA",
};

const ROUTE_LABEL_FALLBACKS: Record<string, string> = {
  "lab-58-customer-insights-segmento-journey": "Ruta Dynamics 365 Customer Insights",
  "lab-59-field-service-work-order-uat": "Ruta Dynamics 365 Customer Engagement",
  "lab-66-sales-lead-to-cash": "Ruta Dynamics 365 Customer Engagement",
  "lab-67-customer-360-insights-data": "Ruta Dynamics 365 Customer Insights",
  "lab-81-d365-sales-forecasting-pipeline-review": "Ruta Dynamics 365 Customer Engagement",
  "lab-82-customer-service-sla-entitlements-routing": "Ruta Dynamics 365 Customer Engagement",
  "lab-83-contact-center-simulation": "Ruta Dynamics 365 Customer Engagement",
  "lab-84-customer-insights-real-time-journey": "Ruta Dynamics 365 Customer Insights",
  "lab-85-customer-insights-data-unification": "Ruta Dynamics 365 Customer Insights",
  "lab-86-field-service-agreement-preventive-maintenance": "Ruta Dynamics 365 Field Service",
  "lab-87-field-service-mobile-offline-work-order": "Ruta Dynamics 365 Field Service",
  "lab-88-ce-fo-dual-write-ownership-matrix": "Ruta Finance & Operations",
  "lab-89-fo-process-mapping-advanced": "Ruta Finance & Operations",
  "lab-90-capstone-enterprise-d365": "Ruta Dynamics 365 Customer Engagement",
};

function getLabKind(lab: LabInfo): string {
  const haystack = `${lab.title} ${lab.slug}`.toLowerCase();
  if (haystack.includes("capstone")) return "Capstone";
  if (haystack.includes("proyecto integrador")) return "Proyecto integrador";
  if (haystack.includes("uat") || haystack.includes("go-live")) return "UAT";
  if (haystack.includes("simulador") || haystack.includes("simulacion")) return "Simulacion";
  return "Laboratorio";
}

function getLabKindLabel(lab: LabInfo, kind: string): string {
  if (kind !== "Capstone") {
    return kind === "Laboratorio" ? "Laboratorio práctico" : kind;
  }

  if (lab.slug.includes("maker")) return "Capstone Maker";
  if (lab.slug.includes("consultor-funcional")) return "Capstone Consultor Funcional";
  if (lab.slug.includes("developer")) return "Capstone Developer";
  if (lab.slug.includes("fo-awareness")) return "Capstone F&O Awareness";
  if (lab.slug.includes("ai-copilot")) return "Capstone AI & Copilot";
  return "Capstone";
}

function getCertificationBadges(lab: LabInfo): Pick<LabPresentationMeta, "certificationBadges" | "historicalCertifications"> {
  const historical = new Set([
    "PL-600",
    "MB-210",
    "MB-220",
    "MB-240",
    "MB-240 (retirado 30 jun 2026)",
    "MB-260",
    "MB-300",
  ]);
  const historicalCertifications = lab.certifications.filter((cert) => historical.has(cert));
  const activeCertifications = lab.certifications.filter((cert) => !historical.has(cert));

  const competencyBadges = historicalCertifications.map((cert) => {
    if (cert === "PL-600") return "Solution Architect";
    if (cert === "MB-210") return "Competencia Sales";
    if (cert === "MB-220") return "Customer Insights Skill Path";
    if (cert === "MB-240" || cert === "MB-240 (retirado 30 jun 2026)") return "Competencia Field Service";
    if (cert === "MB-260") return "Customer Insights Skill Path";
    if (cert === "MB-300") return "F&O Awareness";
    return "Competencia Dynamics 365";
  });

  return {
    certificationBadges: [...activeCertifications, ...competencyBadges],
    historicalCertifications,
  };
}

function extractSectionItems(markdown: string, heading: string, maxItems: number): string[] {
  const lines = markdown.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (headingIndex < 0) return [];

  const sectionLines: string[] = [];
  for (const line of lines.slice(headingIndex + 1)) {
    if (/^##\s+/.test(line)) break;
    sectionLines.push(line);
  }

  return sectionLines
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function summarizeEvidence(lab: LabInfo): string {
  const evidence = extractSectionItems(lab.rawContent, "Evidencia esperada", 2);
  if (evidence.length > 0) return evidence.join("; ");

  const deliverables = extractSectionItems(lab.rawContent, "Entregables", 2);
  if (deliverables.length > 0) return deliverables.join("; ");

  return "Evidencia definida en el laboratorio.";
}

function getCompetencies(lab: LabInfo): string[] {
  const explicit = extractSectionItems(lab.rawContent, "Competencias desarrolladas", 4);
  if (explicit.length > 0) return explicit;

  return [...lab.role, ...lab.products].slice(0, 4);
}

function getRoutesForLab(lab: LabInfo): string[] {
  const routes = getAllProfessionalRoutes()
    .filter((route) => route.labs.includes(lab.slug) || route.capstoneLabSlug === lab.slug)
    .map((route) => route.title);

  if (routes.length > 0) return [...new Set(routes)].slice(0, 3);
  const fallbackRoute = ROUTE_LABEL_FALLBACKS[lab.slug];
  if (fallbackRoute) return [fallbackRoute];
  return ["Ruta general"];
}

const INTEGRATION_SLUG_PATTERN = /ce-fo|dual-write|integration|integrador|process-mapping|conectar/;
const IA_SLUG_PATTERN = /copilot|claude-code|ai-assisted/;
const JOB_READY_SLUG_PATTERN = /-jr-\d{3}-/;
const D365_PRODUCT_PATTERN = /dynamics 365|customer insights|field service|dynamics crm/;
const POWER_PLATFORM_PRODUCT_PATTERN = /power|dataverse|plugin|coe starter kit/;
const RPA_PRODUCT_PATTERN = /power automate desktop|desktop flow|machine runtime|rpa|ui elements|selector/i;

/**
 * Clasificación heurística por dominio (level + slug + products del frontmatter),
 * no requiere un campo nuevo en el contenido. Un lab puede tener varios dominios.
 */
export function getLabDomains(lab: LabInfo): DomainTag[] {
  const domains = new Set<DomainTag>();
  const productsLower = lab.products.map((p) => p.toLowerCase());
  const hasD365Product = productsLower.some((p) => D365_PRODUCT_PATTERN.test(p));
  const hasPPProduct = productsLower.some((p) => POWER_PLATFORM_PRODUCT_PATTERN.test(p));
  const hasRpaProduct = productsLower.some((p) => RPA_PRODUCT_PATTERN.test(p)) || lab.level === "RPA";

  if (hasRpaProduct) domains.add("RPA");
  if (JOB_READY_SLUG_PATTERN.test(lab.slug)) domains.add("Empleabilidad");
  if (lab.level === "N5" || IA_SLUG_PATTERN.test(lab.slug)) domains.add("IA");
  if (INTEGRATION_SLUG_PATTERN.test(lab.slug)) domains.add("Integración");
  if (hasD365Product || lab.level === "N6") domains.add("Dynamics 365");
  if (hasPPProduct || domains.size === 0) domains.add("Power Platform");

  return DOMAIN_TAGS.filter((tag) => domains.has(tag));
}

export function getLabPresentationMeta(lab: LabInfo): LabPresentationMeta {
  const kind = getLabKind(lab);
  const certifications = getCertificationBadges(lab);

  return {
    kind,
    kindLabel: getLabKindLabel(lab, kind),
    routes: getRoutesForLab(lab),
    recommendedLevel: LEVEL_LABELS[lab.level] ?? lab.level,
    difficulty: DIFFICULTY_LABELS[lab.level] ?? "Intermedia",
    evidenceSummary: summarizeEvidence(lab),
    competencies: getCompetencies(lab),
    domains: getLabDomains(lab),
    ...certifications,
  };
}
