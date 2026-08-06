/**
 * Validación standalone de contenido — corre fuera del ciclo de `next build`
 * para poder fallar rápido en CI antes de lint/test/build.
 *
 * Reutiliza las validaciones estrictas ya existentes en content.ts y
 * questions-parser.ts (ambas lanzan ContentValidationError ante datos
 * inválidos) y agrega el chequeo que faltaba: que los 41 módulos tengan
 * al menos una pregunta.
 */
import { ContentValidationError, getAllLevels, getAllLabs, getResourceBySlug } from "../src/lib/content";
import { getPracticeCounts } from "../src/lib/practices";
import { getAllQuestions } from "../src/lib/questions-parser";
import { parseChecklistMarkdown, validateChecklistData } from "../src/lib/checklist";
import { LEVEL_MODULE_RANGE } from "../src/lib/i18n";
import { validateGuidedJourneyReferences } from "../src/lib/guided-journey";

function main(): void {
  const levels = getAllLevels();
  const labs = getAllLabs();
  const questions = getAllQuestions();
  const checklistPage = getResourceBySlug("checklist");
  if (!checklistPage) {
    throw new ContentValidationError("No se encontró el recurso checklist");
  }
  const checklist = parseChecklistMarkdown(checklistPage.rawContent);
  validateChecklistData(checklist);
  const practiceCounts = getPracticeCounts();
  const guidedErrors = validateGuidedJourneyReferences(
    levels.flatMap((level) => level.modules),
    labs,
  );
  if (guidedErrors.length > 0) {
    throw new ContentValidationError(`Ruta guiada invalida: ${guidedErrors.join("; ")}`);
  }

  const allModuleIds = levels.flatMap((level) => level.modules.map((mod) => mod.moduleId));
  const expectedModuleIds = Object.values(LEVEL_MODULE_RANGE).flatMap(([min, max]) => {
    const ids: number[] = [];
    for (let id = min; id <= max; id += 1) ids.push(id);
    return ids;
  });

  const missingModules = expectedModuleIds.filter((id) => !allModuleIds.includes(id));
  if (missingModules.length > 0) {
    throw new ContentValidationError(`Faltan módulos para moduleId: ${missingModules.join(", ")}`);
  }

  // Guardarraíl de continuidad para principiantes: módulos que exigen conocimiento externo
  // (programación, Azure) deben declarar sus prerrequisitos explícitamente, y el primer lab
  // que "Mi ruta" promete con variante sin tenant debe seguir ofreciéndola.
  const modulesRequiringExternalPrereqBanner = [13, 23, 27, 34];
  for (const level of levels) {
    for (const mod of level.modules) {
      if (modulesRequiringExternalPrereqBanner.includes(mod.moduleId) && !mod.rawContent.includes("Antes de comenzar")) {
        throw new ContentValidationError(
          `Módulo ${mod.moduleId} requiere conocimiento externo (programación/Azure) pero no declara un aviso "Antes de comenzar"`
        );
      }
    }
  }

  const lab03 = labs.find((lab) => lab.id === "lab-03");
  if (lab03 && !lab03.rawContent.includes("Variante sin tenant")) {
    throw new ContentValidationError('Lab 03 no ofrece "Variante sin tenant" pese a que "Mi ruta" la promete');
  }

  // El renderer de la app (remark-gfm) no interpreta admonitions estilo MkDocs (`!!! tip`);
  // ese contenido queda invisible/roto para el estudiante. Ver módulos 13/23/27/34 corregidos.
  for (const level of levels) {
    for (const mod of level.modules) {
      if (mod.rawContent.includes("!!!")) {
        throw new ContentValidationError(
          `Módulo ${mod.moduleId} usa sintaxis de admonition estilo MkDocs ("!!!") que no se renderiza en la app Next.js`
        );
      }
    }
  }

  const questionsByModule = new Map<number, number>();
  for (const question of questions) {
    questionsByModule.set(question.moduleId, (questionsByModule.get(question.moduleId) ?? 0) + 1);
  }

  const modulesWithoutQuestions = expectedModuleIds.filter((id) => !questionsByModule.has(id));
  if (modulesWithoutQuestions.length > 0) {
    throw new ContentValidationError(
      `Módulos sin preguntas: ${modulesWithoutQuestions.join(", ")}`
    );
  }

  console.log(`✓ ${allModuleIds.length} módulos válidos (moduleId único, slug único, rango por nivel)`);
  console.log(`✓ ${labs.length} labs válidos (id único, slug único)`);
  console.log(`✓ ${questions.length} preguntas válidas cubriendo los ${expectedModuleIds.length} módulos`);
  console.log(`✓ Checklist válido (${checklist.totalModules} módulos, ${checklist.totalItems} criterios)`);
  console.log(`✓ Experiencia práctica válida (${practiceCounts.incidents} incidentes, ${practiceCounts.challenges} challenges, ${practiceCounts.simulations} simulaciones, ${practiceCounts.guided} guiadas)`);
  console.log("✓ Ruta guiada de fundamentos válida (referencias, orden, práctica temprana y decisión posterior)");
  console.log("✓ Prerrequisitos externos declarados en módulos 23 y 34; variante sin tenant presente en Lab 03");
}

try {
  main();
} catch (error) {
  if (error instanceof ContentValidationError || error instanceof Error) {
    console.error(`✗ Validación de contenido falló: ${error.message}`);
  } else {
    console.error("✗ Validación de contenido falló con error inesperado:", error);
  }
  process.exit(1);
}
