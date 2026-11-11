import { CERTIFICATION_LEVEL_ORDER, type LevelId } from "./i18n";

// Índice mínimo del temario para decidir "qué sigue" en el cliente después de los Fundamentos.
// Antes de 2026-11-11 el siguiente paso solo conocía las 7 actividades de Fundamentos: al terminarlas
// la plataforma recomendaba "Descubre tu ruta" para siempre. Ahora continúa por la ruta elegida o,
// sin ruta, por la cadena de certificación (Básico → Intermedio → Avanzado → Arquitecto).

export interface CurriculumModule {
  key: string;        // id de progreso, p. ej. "basico-1"
  moduleId: number;
  levelId: LevelId;
  title: string;
  href: string;
  minutes: number;
}

/** Siguiente módulo sin completar: primero los de la ruta elegida (en su orden), luego la cadena de certificación. */
export function getNextCurriculumModule(
  curriculum: CurriculumModule[],
  completedModules: string[],
  routeModuleIds?: number[],
): CurriculumModule | null {
  const done = new Set(completedModules);
  const byId = new Map(curriculum.map((mod) => [mod.moduleId, mod]));

  if (routeModuleIds?.length) {
    for (const id of routeModuleIds) {
      const mod = byId.get(id);
      if (mod && !done.has(mod.key)) return mod;
    }
  }

  const certification = curriculum
    .filter((mod) => CERTIFICATION_LEVEL_ORDER.includes(mod.levelId))
    .sort((a, b) => a.moduleId - b.moduleId);
  return certification.find((mod) => !done.has(mod.key)) ?? null;
}
