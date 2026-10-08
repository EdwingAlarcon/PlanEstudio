/**
 * Imprime la línea base "Aprender haciendo" de los módulos (Fase 1 del rediseño).
 * Uso: npm run audit:lbd
 * Solo lectura: no modifica contenido ni falla el build.
 */
import { getAllModules } from "../src/lib/content";
import { getInteractivePracticesForModule } from "../src/lib/interactive-practices";
import { auditModules, formatAuditTable, summarizeAudit } from "../src/lib/learning-by-doing-audit";

const rows = auditModules(
  getAllModules().map((mod) => ({
    moduleId: mod.moduleId,
    levelId: mod.levelId,
    title: mod.title,
    rawContent: mod.rawContent,
    interactivePractices: getInteractivePracticesForModule(mod.moduleId).length,
  })),
);
const summary = summarizeAudit(rows);

console.log(formatAuditTable(rows));
console.log("");
console.log(
  `Resumen: ${summary.total} módulos — ${summary.piloto} piloto, ${summary.parcial} parcial, ${summary.ninguno} ninguno. ` +
    `Con reto de transferencia: ${summary.withTransferChallenge}/${summary.total} (${summary.withTransferChallengePercent}%).`,
);
