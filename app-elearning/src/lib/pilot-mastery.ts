import type { InteractivePracticeRecord } from "@/lib/interactive-practice-progress";

/**
 * Modelo de mastery del piloto Learning by Doing (Módulo 11), pedido explícitamente con 5 estados
 * distintos al enum genérico `InteractivePracticeMastery` (4 estados) que ya usan las 17 prácticas
 * interactivas. No se tocó ese enum para no romper su semántica en los otros 16 registros; este
 * módulo deriva un mastery adicional, específico del piloto, a partir de los mismos datos ya
 * persistidos en `planestudio.interactive-practice.v1` — sin store nuevo.
 */
export type PilotMasteryLevel = "no-iniciado" | "aprendiendo" | "practicado" | "autonomo" | "transferido";

export const PILOT_MASTERY_LABELS: Record<PilotMasteryLevel, string> = {
  "no-iniciado": "No iniciado",
  aprendiendo: "Aprendiendo",
  practicado: "Practicado",
  autonomo: "Autónomo",
  transferido: "Transferido",
};

export const MODULE_11_PILOT_PRACTICE_IDS = {
  guiadas: ["IP-PA-002", "IP-PA-004"] as const,
  diagnosticar: "IP-PA-005",
  transferir: "IP-PA-006",
} as const;

/**
 * PRACTICADO requiere las microprácticas guiadas + el diagnóstico completos.
 * AUTÓNOMO exige además que el diagnóstico se haya resuelto sin ver la solución y con a lo sumo
 * una pista (evidencia de que no dependió de la ayuda máxima ni de intentos indefinidos).
 * TRANSFERIDO exige que el reto de transferencia esté completo y tampoco haya revelado su solución
 * — completar la transferencia solo viendo la solución no cuenta como transferencia real.
 */
export function calculateModule11PilotMastery(
  records: Record<string, InteractivePracticeRecord>
): PilotMasteryLevel {
  const { guiadas, diagnosticar, transferir } = MODULE_11_PILOT_PRACTICE_IDS;
  const trackedIds = [...guiadas, diagnosticar, transferir];
  const diagnosticarRecord = records[diagnosticar];
  const transferirRecord = records[transferir];

  const anyStarted = trackedIds.some((id) => records[id] && records[id]!.status !== "not-started");
  if (!anyStarted) return "no-iniciado";

  const guidedCompleted = guiadas.every((id) => records[id]?.status === "completed");
  const diagnosticarCompleted = diagnosticarRecord?.status === "completed";
  if (!guidedCompleted || !diagnosticarCompleted) return "aprendiendo";

  const transferCompleted = transferirRecord?.status === "completed";
  if (!transferCompleted) {
    const autonomous =
      diagnosticarRecord !== undefined &&
      !diagnosticarRecord.solutionRevealed &&
      diagnosticarRecord.hintsUsed.length <= 1 &&
      diagnosticarRecord.attemptCount <= 2;
    return autonomous ? "autonomo" : "practicado";
  }

  if (transferirRecord && !transferirRecord.solutionRevealed) return "transferido";
  return "practicado";
}
