import { LEVEL_MODULE_RANGE, type LevelId } from "./i18n";

// Ruta principal (2026-11-27): el curso forma consultores funcionales de Power Platform. En los cuatro niveles, los
// módulos de desarrollo y de Dynamics 365 siguen disponibles como opcionales, pero no cuentan para el progreso, el
// certificado, el siguiente paso, el simulador del nivel ni los trofeos. No se borra ni se renumera nada: para volver
// a contar un módulo basta con quitarlo de aquí. Los labs equivalentes llevan `optional: true` en su frontmatter.
// Los niveles transversales (IA, D365, RPA) ya eran opcionales enteros.
const DEVELOPMENT_MODULE_IDS = [13, 19, 23, 24, 25, 27, 28, 30, 34];
const DYNAMICS_MODULE_IDS = [20];

export const OPTIONAL_MODULE_IDS: ReadonlySet<number> = new Set([...DEVELOPMENT_MODULE_IDS, ...DYNAMICS_MODULE_IDS]);

export function isOptionalModule(moduleId: number): boolean {
  return OPTIONAL_MODULE_IDS.has(moduleId);
}

/** Los módulos de una lista que forman la ruta principal. */
export function mainModules<T extends { moduleId: number }>(modules: T[]): T[] {
  return modules.filter((mod) => !isOptionalModule(mod.moduleId));
}

/** Ids de la ruta principal de un nivel, en orden. */
export function getMainModuleIds(levelId: LevelId): number[] {
  const [start, end] = LEVEL_MODULE_RANGE[levelId];
  const ids: number[] = [];
  for (let id = start; id <= end; id++) if (!isOptionalModule(id)) ids.push(id);
  return ids;
}
