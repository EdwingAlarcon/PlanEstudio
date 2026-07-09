import type { LabInfo } from "@/lib/content";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";

export interface LabPresentationMeta {
  kind: string;
  routes: string[];
  recommendedLevel: string;
  difficulty: string;
  evidenceSummary: string;
  competencies: string[];
}

const LEVEL_LABELS: Record<string, string> = {
  N1: "Nivel 1 - Básico",
  N2: "Nivel 2 - Intermedio",
  N3: "Nivel 3 - Avanzado",
  N4: "Nivel 4 - Arquitecto",
  N5: "Nivel IA",
  N6: "Nivel D365",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  N1: "Fundacional",
  N2: "Intermedia",
  N3: "Avanzada",
  N4: "Enterprise",
  N5: "Especializada",
  N6: "Especializada D365",
};

const ROUTE_LABEL_FALLBACKS: Record<string, string> = {
  "lab-58-customer-insights-segmento-journey": "Ruta Dynamics 365 Customer Engagement",
  "lab-59-field-service-work-order-uat": "Ruta Dynamics 365 Customer Engagement",
  "lab-66-sales-lead-to-cash": "Ruta Dynamics 365 Customer Engagement",
  "lab-67-customer-360-insights-data": "Ruta Dynamics 365 Customer Engagement",
};

function getLabKind(lab: LabInfo): string {
  const haystack = `${lab.title} ${lab.slug}`.toLowerCase();
  if (haystack.includes("capstone")) return "Capstone";
  if (haystack.includes("proyecto integrador")) return "Proyecto integrador";
  if (haystack.includes("uat") || haystack.includes("go-live")) return "UAT";
  if (haystack.includes("simulador") || haystack.includes("simulacion")) return "Simulacion";
  return "Laboratorio";
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

  if (routes.length > 0) return routes;
  const fallbackRoute = ROUTE_LABEL_FALLBACKS[lab.slug];
  if (fallbackRoute) return [fallbackRoute];
  return ["Ruta general"];
}

export function getLabPresentationMeta(lab: LabInfo): LabPresentationMeta {
  return {
    kind: getLabKind(lab),
    routes: getRoutesForLab(lab),
    recommendedLevel: LEVEL_LABELS[lab.level] ?? lab.level,
    difficulty: DIFFICULTY_LABELS[lab.level] ?? "Intermedia",
    evidenceSummary: summarizeEvidence(lab),
    competencies: getCompetencies(lab),
  };
}
