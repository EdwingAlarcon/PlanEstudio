import type { OnboardingAnswers } from "./guided-journey";

export const WORKSTATION_PROFILES = ["maker", "functional", "developer", "admin", "architect", "rpa"] as const;
export type WorkstationProfile = typeof WORKSTATION_PROFILES[number];

export const OPERATING_SYSTEMS = ["windows", "macos", "linux"] as const;
export type OperatingSystem = typeof OPERATING_SYSTEMS[number];

export type ToolRequirement = "required" | "recommended" | "optional" | "not_required" | "required_later";

export type ToolStatus =
  | "unknown"
  | "not_required"
  | "not_installed"
  | "installed"
  | "verified"
  | "outdated"
  | "blocked";

export interface WorkstationToolVerification {
  command: string;
}

export interface WorkstationTool {
  id: string;
  name: string;
  category: string;
  platforms: OperatingSystem[];
  officialUrl: string;
  verification?: WorkstationToolVerification;
  requiredBy: Record<WorkstationProfile, ToolRequirement>;
}

export interface EssentialSetupStep {
  id: string;
  title: string;
  outcome: string;
  tenantAlternative: string;
}

const ALL_OS: OperatingSystem[] = ["windows", "macos", "linux"];

export const WORKSTATION_TOOLS: WorkstationTool[] = [
  {
    id: "browser",
    name: "Navegador moderno",
    category: "acceso",
    platforms: ALL_OS,
    officialUrl: "https://www.microsoft.com/edge",
    requiredBy: { maker: "required", functional: "required", developer: "required", admin: "required", architect: "required", rpa: "required" },
  },
  {
    id: "maker-portal",
    name: "Power Apps Maker Portal",
    category: "power-platform",
    platforms: ALL_OS,
    officialUrl: "https://make.powerapps.com",
    requiredBy: { maker: "required", functional: "required", developer: "required", admin: "recommended", architect: "recommended", rpa: "optional" },
  },
  {
    id: "ppac",
    name: "Power Platform Admin Center",
    category: "power-platform",
    platforms: ALL_OS,
    officialUrl: "https://admin.powerplatform.microsoft.com",
    requiredBy: { maker: "optional", functional: "optional", developer: "recommended", admin: "required", architect: "required", rpa: "recommended" },
  },
  {
    id: "git",
    name: "Git",
    category: "control-de-versiones",
    platforms: ALL_OS,
    officialUrl: "https://git-scm.com/downloads",
    verification: { command: "git --version" },
    requiredBy: { maker: "recommended", functional: "recommended", developer: "required", admin: "recommended", architect: "required", rpa: "recommended" },
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    category: "editor",
    platforms: ALL_OS,
    officialUrl: "https://code.visualstudio.com",
    requiredBy: { maker: "optional", functional: "optional", developer: "required", admin: "recommended", architect: "recommended", rpa: "optional" },
  },
  {
    id: "pac-cli",
    name: "Power Platform CLI",
    category: "power-platform",
    platforms: ALL_OS,
    officialUrl: "https://learn.microsoft.com/power-platform/developer/cli/introduction",
    verification: { command: "pac --version" },
    requiredBy: { maker: "optional", functional: "optional", developer: "required", admin: "recommended", architect: "recommended", rpa: "optional" },
  },
  {
    id: "node",
    name: "Node.js LTS",
    category: "desarrollo-web",
    platforms: ALL_OS,
    officialUrl: "https://nodejs.org",
    verification: { command: "node --version" },
    requiredBy: { maker: "not_required", functional: "not_required", developer: "required_later", admin: "not_required", architect: "optional", rpa: "not_required" },
  },
  {
    id: "dotnet-sdk",
    name: ".NET SDK",
    category: "desarrollo-net",
    platforms: ALL_OS,
    officialUrl: "https://dotnet.microsoft.com/download",
    verification: { command: "dotnet --info" },
    requiredBy: { maker: "not_required", functional: "not_required", developer: "required_later", admin: "optional", architect: "optional", rpa: "not_required" },
  },
  {
    id: "visual-studio",
    name: "Visual Studio Community",
    category: "desarrollo-net",
    platforms: ["windows"],
    officialUrl: "https://visualstudio.microsoft.com/vs/community/",
    requiredBy: { maker: "not_required", functional: "not_required", developer: "required_later", admin: "not_required", architect: "optional", rpa: "not_required" },
  },
  {
    id: "powershell",
    name: "PowerShell",
    category: "administracion",
    platforms: ALL_OS,
    officialUrl: "https://learn.microsoft.com/powershell/scripting/install/installing-powershell",
    verification: { command: "$PSVersionTable" },
    requiredBy: { maker: "optional", functional: "optional", developer: "recommended", admin: "required", architect: "recommended", rpa: "optional" },
  },
  {
    id: "power-automate-desktop",
    name: "Power Automate Desktop",
    category: "rpa",
    platforms: ["windows"],
    officialUrl: "https://learn.microsoft.com/power-automate/desktop-flows/install",
    requiredBy: { maker: "not_required", functional: "not_required", developer: "optional", admin: "not_required", architect: "not_required", rpa: "required" },
  },
];

export const ESSENTIAL_SETUP_STEPS: EssentialSetupStep[] = [
  {
    id: "login",
    title: "Puedo iniciar sesión con mi cuenta",
    outcome: "Confirmas que tienes credenciales validas para acceder al ecosistema Microsoft.",
    tenantAlternative: "Si aun no tienes cuenta, solicita acceso a tu organizacion o crea un tenant de prueba antes de continuar.",
  },
  {
    id: "identify-tenant",
    title: "Se que tenant estoy usando",
    outcome: "Identificas el Microsoft Entra tenant al que pertenece tu cuenta.",
    tenantAlternative: "Sin tenant propio, documenta que necesitarias uno y continua con contenido conceptual.",
  },
  {
    id: "identify-environment",
    title: "Se que entorno estoy usando",
    outcome: "Reconoces el Power Platform environment (Developer, Trial, Sandbox o Production) y su proposito.",
    tenantAlternative: "Describe conceptualmente la diferencia entre entornos sin necesitar acceso real todavia.",
  },
  {
    id: "confirm-dataverse",
    title: "Se si mi entorno tiene Dataverse",
    outcome: "Verificas si el entorno incluye Dataverse antes de iniciar labs que lo requieran.",
    tenantAlternative: "Usa la variante simulada de los labs que dependen de Dataverse.",
  },
  {
    id: "know-role",
    title: "Conozco mi rol y mis permisos",
    outcome: "Identificas tu rol de seguridad (Environment Maker, Basic User, System Customizer, etc.) aplicando minimo privilegio.",
    tenantAlternative: "Sin acceso a un entorno, revisa la teoria de roles y permisos en el modulo correspondiente.",
  },
  {
    id: "confirm-non-production",
    title: "Confirmo que no estoy trabajando en produccion",
    outcome: "Verificas explicitamente que el entorno usado para practicar no es un entorno de produccion.",
    tenantAlternative: "Si solo tienes acceso a produccion, no practiques alli: solicita un entorno Developer o Trial.",
  },
  {
    id: "open-maker-portal",
    title: "Puedo abrir el Maker Portal",
    outcome: "Accedes a make.powerapps.com y ubicas tu entorno activo en el selector superior.",
    tenantAlternative: "Explora capturas de referencia del Maker Portal mientras consigues acceso.",
  },
];

const REQUIREMENT_ORDER: ToolRequirement[] = ["required", "required_later", "recommended", "optional"];

export function getToolRequirement(toolId: string, profile: WorkstationProfile): ToolRequirement {
  const tool = WORKSTATION_TOOLS.find((item) => item.id === toolId);
  return tool ? tool.requiredBy[profile] : "not_required";
}

export function getToolsForProfile(profile: WorkstationProfile, os: OperatingSystem): WorkstationTool[] {
  return WORKSTATION_TOOLS
    .filter((tool) => tool.platforms.includes(os))
    .filter((tool) => tool.requiredBy[profile] !== "not_required")
    .sort((a, b) => REQUIREMENT_ORDER.indexOf(a.requiredBy[profile]) - REQUIREMENT_ORDER.indexOf(b.requiredBy[profile]));
}

export interface WorkstationToolStateMap {
  [toolId: string]: { status: ToolStatus };
}

export function getNextWorkstationRequirement(
  profile: WorkstationProfile,
  os: OperatingSystem,
  toolStates: WorkstationToolStateMap
): WorkstationTool | null {
  const requiredTools = getToolsForProfile(profile, os).filter((tool) => tool.requiredBy[profile] === "required");
  return requiredTools.find((tool) => {
    const status = toolStates[tool.id]?.status ?? "unknown";
    return status !== "installed" && status !== "verified";
  }) ?? null;
}

export function recommendWorkstationProfile(answers: OnboardingAnswers): WorkstationProfile {
  if (answers.preference === "code") return "developer";
  if (answers.preference === "rpa") return "rpa";
  if (answers.preference === "admin") return "admin";
  if (answers.preference === "configure" || answers.preference === "analyze") return "functional";
  if (answers.preference === "build") return "maker";
  return "maker";
}

export function getEssentialSetupProgress(essentialSteps: Record<string, boolean>): { completed: number; total: number; percentage: number } {
  const total = ESSENTIAL_SETUP_STEPS.length;
  const completed = ESSENTIAL_SETUP_STEPS.filter((step) => essentialSteps[step.id]).length;
  return { completed, total, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export function validateWorkstationReferences(): string[] {
  const errors: string[] = [];
  const seenTools = new Set<string>();
  for (const tool of WORKSTATION_TOOLS) {
    if (seenTools.has(tool.id)) errors.push(`Herramienta duplicada: ${tool.id}`);
    seenTools.add(tool.id);
    if (tool.platforms.length === 0) errors.push(`Herramienta ${tool.id} no declara plataformas`);
    if (!tool.officialUrl) errors.push(`Herramienta ${tool.id} no tiene URL oficial`);
    const requirements = Object.values(tool.requiredBy);
    if (!requirements.some((req) => req === "required" || req === "recommended" || req === "required_later")) {
      errors.push(`Herramienta ${tool.id} no es required/recommended/required_later para ningun perfil`);
    }
    for (const profile of WORKSTATION_PROFILES) {
      if (!(profile in tool.requiredBy)) errors.push(`Herramienta ${tool.id} no declara requisito para el perfil ${profile}`);
    }
  }

  const seenSteps = new Set<string>();
  for (const step of ESSENTIAL_SETUP_STEPS) {
    if (seenSteps.has(step.id)) errors.push(`Paso de setup esencial duplicado: ${step.id}`);
    seenSteps.add(step.id);
    if (!step.tenantAlternative) errors.push(`Paso ${step.id} no tiene alternativa sin tenant`);
  }

  return errors;
}
