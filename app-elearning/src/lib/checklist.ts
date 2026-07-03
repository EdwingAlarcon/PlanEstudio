import { LEVEL_MODULE_RANGE, LEVEL_ORDER, type LevelId } from "./i18n";

export interface ChecklistItem {
  id: string;
  category: string;
  text: string;
}

export interface ChecklistModule {
  moduleId: number;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistLevel {
  levelId: LevelId;
  title: string;
  modules: ChecklistModule[];
}

export interface ChecklistData {
  levels: ChecklistLevel[];
  totalModules: number;
  totalItems: number;
}

export interface ChecklistItemProgress {
  completed: boolean;
  mastery: number | null;
  completedAt: string | null;
}

export type ChecklistProgressMap = Record<string, ChecklistItemProgress>;

export interface ChecklistSummary {
  total: number;
  completed: number;
  percentage: number;
  averageMastery: number | null;
}

const LEVEL_BY_NUMBER: Record<number, LevelId> = {
  1: "basico",
  2: "intermedio",
  3: "avanzado",
  4: "arquitecto",
};

const LEVEL_HEADING = /^##\s+.*?NIVEL\s+(\d+)[:\s]+(.+)$/i;
const MODULE_HEADING = /^###\s+Módulo\s+(\d+)[:\s]+(.+)$/i;
const CHECKLIST_ITEM = /^-\s+\[[ xX]\]\s+\*\*(.+?)\*\*:\s+(.+?)(?:\s+\|\s+Dominio:.*)?$/;
const ALLOWED_CATEGORIES = new Set(["Conocimiento", "Práctica", "Entrega"]);

function cleanTitle(value: string): string {
  return value.replace(/\*+/g, "").trim();
}

export function parseChecklistMarkdown(markdown: string): ChecklistData {
  const levels: ChecklistLevel[] = [];
  let currentLevel: ChecklistLevel | null = null;
  let currentModule: ChecklistModule | null = null;
  let itemIndex = 0;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const levelMatch = line.match(LEVEL_HEADING);
    if (levelMatch) {
      const levelNumber = Number(levelMatch[1]);
      const levelId = LEVEL_BY_NUMBER[levelNumber];
      if (!levelId) {
        currentLevel = null;
        currentModule = null;
        continue;
      }

      currentLevel = {
        levelId,
        title: `Nivel ${levelNumber}: ${cleanTitle(levelMatch[2] ?? "")}`,
        modules: [],
      };
      levels.push(currentLevel);
      currentModule = null;
      continue;
    }

    const moduleMatch = line.match(MODULE_HEADING);
    if (moduleMatch && currentLevel) {
      const moduleId = Number(moduleMatch[1]);
      currentModule = {
        moduleId,
        title: cleanTitle(moduleMatch[2] ?? ""),
        items: [],
      };
      currentLevel.modules.push(currentModule);
      itemIndex = 0;
      continue;
    }

    const itemMatch = line.match(CHECKLIST_ITEM);
    if (itemMatch && currentModule) {
      itemIndex += 1;
      currentModule.items.push({
        id: `module-${currentModule.moduleId}-${itemIndex}`,
        category: cleanTitle(itemMatch[1] ?? ""),
        text: cleanTitle(itemMatch[2] ?? ""),
      });
    }
  }

  const totalModules = levels.reduce((sum, level) => sum + level.modules.length, 0);
  const totalItems = levels.reduce(
    (sum, level) => sum + level.modules.reduce((moduleSum, mod) => moduleSum + mod.items.length, 0),
    0,
  );

  return { levels, totalModules, totalItems };
}

export function getEmptyChecklistItemProgress(): ChecklistItemProgress {
  return { completed: false, mastery: null, completedAt: null };
}

export function summarizeChecklistProgress(
  checklist: ChecklistData,
  progress: ChecklistProgressMap,
): ChecklistSummary {
  const itemIds = checklist.levels.flatMap((level) =>
    level.modules.flatMap((mod) => mod.items.map((item) => item.id)),
  );
  const completedItems = itemIds
    .map((id) => progress[id] ?? getEmptyChecklistItemProgress())
    .filter((item) => item.completed);
  const masteryValues = completedItems
    .map((item) => item.mastery)
    .filter((mastery): mastery is number => typeof mastery === "number");

  return {
    total: itemIds.length,
    completed: completedItems.length,
    percentage: itemIds.length > 0 ? Math.round((completedItems.length / itemIds.length) * 100) : 0,
    averageMastery:
      masteryValues.length > 0
        ? Math.round((masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length) * 10) / 10
        : null,
  };
}

export function validateChecklistData(checklist: ChecklistData): void {
  const levelIds = checklist.levels.map((level) => level.levelId);
  const missingLevels = LEVEL_ORDER.filter((levelId) => !levelIds.includes(levelId));
  if (missingLevels.length > 0) {
    throw new Error(`Faltan niveles del checklist: ${missingLevels.join(", ")}`);
  }

  const expectedModuleIds = Object.values(LEVEL_MODULE_RANGE).flatMap(([min, max]) => {
    const ids: number[] = [];
    for (let id = min; id <= max; id += 1) ids.push(id);
    return ids;
  });
  const modules = checklist.levels.flatMap((level) =>
    level.modules.map((mod) => ({ ...mod, levelId: level.levelId })),
  );
  const moduleIds = modules.map((mod) => mod.moduleId);
  const missingModules = expectedModuleIds.filter((moduleId) => !moduleIds.includes(moduleId));
  if (missingModules.length > 0) {
    throw new Error(`Faltan módulos del checklist: ${missingModules.join(", ")}`);
  }

  const duplicateModuleIds = moduleIds.filter((moduleId, index) => moduleIds.indexOf(moduleId) !== index);
  if (duplicateModuleIds.length > 0) {
    throw new Error(`Módulos duplicados en checklist: ${Array.from(new Set(duplicateModuleIds)).join(", ")}`);
  }

  for (const mod of modules) {
    const [min, max] = LEVEL_MODULE_RANGE[mod.levelId];
    if (mod.moduleId < min || mod.moduleId > max) {
      throw new Error(`Módulo ${mod.moduleId} fuera del rango esperado para ${mod.levelId}`);
    }
    if (mod.items.length === 0) {
      throw new Error(`Módulo ${mod.moduleId} del checklist no tiene criterios`);
    }
  }

  const itemIds = modules.flatMap((mod) => mod.items.map((item) => item.id));
  const duplicateItemIds = itemIds.filter((itemId, index) => itemIds.indexOf(itemId) !== index);
  if (duplicateItemIds.length > 0) {
    throw new Error(`Criterios duplicados en checklist: ${Array.from(new Set(duplicateItemIds)).join(", ")}`);
  }

  for (const mod of modules) {
    for (const item of mod.items) {
      if (!ALLOWED_CATEGORIES.has(item.category)) {
        throw new Error(
          `Categoría de checklist inválida en módulo ${mod.moduleId}: ${item.category}`,
        );
      }
    }
  }
}
