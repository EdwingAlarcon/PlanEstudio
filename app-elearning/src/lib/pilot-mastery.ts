import type { InteractivePracticeRecord } from "@/lib/interactive-practice-progress";

/**
 * Modelo de mastery del piloto Learning by Doing (Módulo 11), pedido explícitamente con 5 estados
 * distintos al enum genérico `InteractivePracticeMastery` (4 estados) que ya usan las 24 prácticas
 * interactivas (tras sumar Módulo 10 y Módulo 13). No se tocó ese enum para no romper su semántica
 * en el resto de los registros; este módulo deriva un mastery adicional, específico del piloto, a
 * partir de los mismos datos ya persistidos en `planestudio.interactive-practice.v1` — sin store
 * nuevo.
 */
export type PilotMasteryLevel = "no-iniciado" | "aprendiendo" | "practicado" | "autonomo" | "transferido";

export const PILOT_MASTERY_LABELS: Record<PilotMasteryLevel, string> = {
  "no-iniciado": "No iniciado",
  aprendiendo: "Aprendiendo",
  practicado: "Practicado",
  autonomo: "Autónomo",
  transferido: "Transferido",
};

/** Forma común a todo piloto: N microprácticas guiadas + 1 diagnóstico + 1 reto de transferencia. */
export interface PilotMasteryConfig {
  guiadas: readonly string[];
  diagnosticar: string;
  transferir: string;
}

export const MODULE_11_PILOT_PRACTICE_IDS: PilotMasteryConfig = {
  guiadas: ["IP-PA-002", "IP-PA-004"],
  diagnosticar: "IP-PA-005",
  transferir: "IP-PA-006",
};

export const MODULE_10_PILOT_PRACTICE_IDS: PilotMasteryConfig = {
  guiadas: ["IP-APP-003", "IP-APP-004"],
  diagnosticar: "IP-APP-005",
  transferir: "IP-APP-006",
};

export const MODULE_13_PILOT_PRACTICE_IDS: PilotMasteryConfig = {
  guiadas: ["IP-JS-001", "IP-JS-002"],
  diagnosticar: "IP-JS-003",
  transferir: "IP-JS-004",
};

/**
 * Reglas concretas (v1, tras el endurecimiento de Fase A — ver el historial de este archivo para el
 * razonamiento original en Módulo 11):
 *
 * NO INICIADO   — ninguna de las prácticas rastreadas tiene actividad.
 * APRENDIENDO   — hay actividad, pero las microprácticas guiadas y/o el diagnóstico todavía no
 *                 están completos.
 * PRACTICADO    — completó las guiadas + el diagnóstico. Es el piso: llegar aquí no exige haber
 *                 evitado pistas, solo haber terminado las actividades principales.
 * AUTÓNOMO      — alcanzó PRACTICADO y además el diagnóstico (la primera actividad sin solución
 *                 visible desde el inicio) se resolvió con AYUDA LIMITADA: como mucho 1 de las 3
 *                 pistas abiertas, y sin haber revelado la solución completa. Usar 1 pista no
 *                 descalifica — el umbral está en "ayuda máxima" (las 3 pistas) o en pedir la
 *                 solución, no en el número de intentos: con el gating de pistas de Fase A, cada
 *                 pista exige un intento nuevo, así que el número de intentos ya queda reflejado
 *                 en `hintsUsed.length` y no se penaliza aparte.
 * TRANSFERIDO   — alcanzó AUTÓNOMO (o mejor) y además completó el reto de transferencia sin haber
 *                 revelado su solución. A diferencia de AUTÓNOMO, aquí no se exige un tope de
 *                 pistas explícito: lo que separa transferencia real de simple práctica es no haber
 *                 visto la solución de la variante, no cuántas pistas usó para llegar — la variante
 *                 en sí ya es la prueba de que no memorizó el ejercicio original.
 *
 * Generalización (Pilotos 2 y 3, Módulo 10 y Módulo 13): tanto Módulo 10 como Módulo 13 confirmaron
 * que necesitan exactamente la misma forma (guiadas[] + diagnosticar + transferir) que Módulo 11 —
 * mismo cálculo, distintos ids de práctica. En vez de copiar la función, se parametrizó por
 * `PilotMasteryConfig` una sola vez aquí.
 * `calculateModule11PilotMastery`/`calculateModule10PilotMastery`/`calculateModule13PilotMastery`
 * son wrappers finos que fijan su propio config — se conservan como funciones con nombre (en vez de
 * que cada módulo arme su config inline) para no romper las llamadas y tests ya escritos contra
 * `calculateModule11PilotMastery`, y porque nombrar la función por módulo es más legible en los
 * sitios que la invocan que pasar el config cada vez. Esta es la generalización pequeña que se
 * anticipó al aprobar el Piloto 2 — no es una reescritura: sigue siendo un solo archivo, sin store
 * nueva, sin cambiar el enum genérico de 4 estados que usan las otras prácticas.
 *
 * Estas reglas viven en un módulo aparte (no en el enum genérico `InteractivePracticeMastery` de 4
 * estados que usan el resto de las prácticas) para no cambiar su semántica fuera de los pilotos.
 */
export function calculatePilotMastery(
  records: Record<string, InteractivePracticeRecord>,
  config: PilotMasteryConfig
): PilotMasteryLevel {
  const { guiadas, diagnosticar, transferir } = config;
  const trackedIds = [...guiadas, diagnosticar, transferir];
  const diagnosticarRecord = records[diagnosticar];
  const transferirRecord = records[transferir];

  const anyStarted = trackedIds.some((id) => records[id] && records[id]!.status !== "not-started");
  if (!anyStarted) return "no-iniciado";

  const guidedCompleted = guiadas.every((id) => records[id]?.status === "completed");
  const diagnosticarCompleted = diagnosticarRecord?.status === "completed";
  if (!guidedCompleted || !diagnosticarCompleted) return "aprendiendo";

  const isAutonomous =
    diagnosticarRecord !== undefined &&
    !diagnosticarRecord.solutionRevealed &&
    diagnosticarRecord.hintsUsed.length <= 1;
  if (!isAutonomous) return "practicado";

  const transferredWithoutSolution =
    transferirRecord?.status === "completed" && !transferirRecord.solutionRevealed;
  return transferredWithoutSolution ? "transferido" : "autonomo";
}

export function calculateModule11PilotMastery(
  records: Record<string, InteractivePracticeRecord>
): PilotMasteryLevel {
  return calculatePilotMastery(records, MODULE_11_PILOT_PRACTICE_IDS);
}

export function calculateModule10PilotMastery(
  records: Record<string, InteractivePracticeRecord>
): PilotMasteryLevel {
  return calculatePilotMastery(records, MODULE_10_PILOT_PRACTICE_IDS);
}

export function calculateModule13PilotMastery(
  records: Record<string, InteractivePracticeRecord>
): PilotMasteryLevel {
  return calculatePilotMastery(records, MODULE_13_PILOT_PRACTICE_IDS);
}
