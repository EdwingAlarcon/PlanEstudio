import { ContentValidationError, getAllLabs, getAllModules } from "../src/lib/content";
import {
  INTERACTIVE_PRACTICE_TYPES,
  evaluateInteractivePractice,
  getAllInteractivePractices,
  getFixtureSummary,
  validateInteractivePractices,
} from "../src/lib/interactive-practices";

function main(): void {
  const practices = getAllInteractivePractices();
  const errors = validateInteractivePractices();
  const moduleIds = new Set(getAllModules().map((module) => module.moduleId));
  const labIds = new Set(getAllLabs().map((lab) => lab.displayId));
  const typeCoverage = new Set(practices.map((practice) => practice.type));

  if (practices.length < 12 || practices.length > 15) {
    errors.push(`El piloto debe tener 12-15 prácticas, pero tiene ${practices.length}`);
  }

  for (const type of INTERACTIVE_PRACTICE_TYPES) {
    if (!typeCoverage.has(type)) errors.push(`Falta cobertura del engine ${type}`);
  }

  for (const practice of practices) {
    for (const moduleId of practice.relatedModuleIds) {
      if (!moduleIds.has(moduleId)) errors.push(`${practice.id}: referencia módulo inexistente ${moduleId}`);
    }
    for (const labId of practice.relatedLabIds) {
      if (!labIds.has(labId)) errors.push(`${practice.id}: referencia lab inexistente ${labId}`);
    }
    if (practice.type === "query-playground") {
      const malicious = evaluateInteractivePractice(practice, "fetch('https://example.com'); while(true) {}", 1);
      if (malicious.status !== "incorrect") {
        errors.push(`${practice.id}: el parser de consultas acepta una entrada no declarativa`);
      }
    }
  }

  const fixtures = getFixtureSummary();
  if (fixtures.accounts < 3 || fixtures.requests < 3 || fixtures.products < 3) {
    errors.push("Los fixtures locales no cubren cuentas, solicitudes y productos suficientes");
  }

  if (errors.length > 0) {
    throw new ContentValidationError(errors.join("; "));
  }

  console.log(`✓ ${practices.length} prácticas interactivas válidas`);
  console.log(`✓ Engines cubiertos: ${INTERACTIVE_PRACTICE_TYPES.join(", ")}`);
  console.log(`✓ Fixtures locales: ${fixtures.accounts} cuentas, ${fixtures.requests} solicitudes, ${fixtures.products} productos`);
  console.log("✓ Referencias a módulos/labs y parser de consultas validados");
}

try {
  main();
} catch (error) {
  if (error instanceof Error) {
    console.error(`✗ Validación de prácticas interactivas falló: ${error.message}`);
  } else {
    console.error("✗ Validación de prácticas interactivas falló con error inesperado:", error);
  }
  process.exit(1);
}
