import type { InteractivePracticeRecord } from "./interactive-practice-progress";
import type { ReviewCardMap } from "./review-queue";
import { isLabVerified, type LabEvidence } from "./lab-mission";

// XP y rango (F1 de "El camino jugable", 2026-11-27).
// La XP no se guarda: se calcula a partir de los stores que ya existen (progreso académico,
// prácticas interactivas y repaso espaciado), así no hay un contador que se desincronice ni que
// migrar, y el backup completo ya la trae. Regla: la XP se gana con evidencia; leer o marcar un
// módulo como completado no da puntos.

export const XP_RULES = {
  /** Práctica interactiva completada sin ver la solución de referencia. */
  practice: 20,
  /** Quiz del módulo con 80 % o más (una vez por módulo). */
  quiz: 50,
  quizPassPercentage: 80,
  /** Lab marcado como completado sin evidencia. Es autodeclarado (la app no ve el tenant), por eso vale poco. */
  lab: 25,
  /** Lab entregado como misión (F3): todas sus comprobaciones marcadas y la evidencia anotada. */
  labVerified: 100,
  /** Cada respuesta correcta en el repaso espaciado. */
  reviewCorrect: 5,
} as const;

export interface XpInput {
  quizScores: Record<string, number>;
  completedLabs: string[];
  /** Evidencia de los labs (F3); un lab completado con evidencia entregada vale `labVerified`. */
  labEvidence?: Record<string, LabEvidence>;
  practiceRecords: Record<string, InteractivePracticeRecord>;
  reviewCards: ReviewCardMap;
}

export interface XpBreakdown {
  practices: number;
  quizzes: number;
  labs: number;
  review: number;
  total: number;
  counts: { practices: number; quizzes: number; labs: number; verifiedLabs: number; reviewCorrect: number };
}

export function isPracticeEarned(record: InteractivePracticeRecord | undefined): boolean {
  return Boolean(record && record.status === "completed" && !record.solutionRevealed);
}

export function isQuizEarned(score: number | undefined): boolean {
  return typeof score === "number" && score >= XP_RULES.quizPassPercentage;
}

export function calculateXp(input: XpInput): XpBreakdown {
  const practiceCount = Object.values(input.practiceRecords).filter(isPracticeEarned).length;
  const quizCount = Object.values(input.quizScores).filter(isQuizEarned).length;
  const completedLabs = [...new Set(input.completedLabs)];
  const labCount = completedLabs.length;
  const verifiedLabs = completedLabs.filter((slug) => isLabVerified(input.labEvidence?.[slug])).length;
  const reviewCorrect = Object.values(input.reviewCards).reduce(
    (total, card) => total + (Number.isFinite(card?.correctReviews) ? Math.max(0, card.correctReviews) : 0),
    0,
  );

  const practices = practiceCount * XP_RULES.practice;
  const quizzes = quizCount * XP_RULES.quiz;
  const labs = verifiedLabs * XP_RULES.labVerified + (labCount - verifiedLabs) * XP_RULES.lab;
  const review = reviewCorrect * XP_RULES.reviewCorrect;

  return {
    practices,
    quizzes,
    labs,
    review,
    total: practices + quizzes + labs + review,
    counts: { practices: practiceCount, quizzes: quizCount, labs: labCount, verifiedLabs, reviewCorrect },
  };
}

// Rangos: los roles para los que prepara el curso, cada uno con tres grados.
// Cada rol corresponde a un nivel: terminar un nivel **con la evidencia de sus labs entregada** (F3) deja en el grado
// III de su rol. Recalibrado el 2026-11-27 sobre la ruta principal: ≈ 1.460 / 2.660 / 3.410 / 4.810 XP acumulados
// (sin repaso). Con los labs solo marcados (25) se queda por debajo: ≈ 1.085 / 2.135 / 2.735 / 3.910.
// Si cambian las reglas o el contenido, "rank calibration" en xp.test.ts falla hasta recalibrar estos umbrales.
export const RANKS = [
  { name: "Aprendiz", thresholds: [0, 150, 300] },
  { name: "Maker", thresholds: [450, 800, 1200] },
  { name: "Consultor funcional", thresholds: [1600, 2100, 2600] },
  { name: "Consultor senior", thresholds: [2800, 3100, 3300] },
  { name: "Arquitecto", thresholds: [3800, 4200, 4600] },
] as const;

const TIERS = ["I", "II", "III"] as const;

export interface RankInfo {
  name: string;
  tier: (typeof TIERS)[number];
  label: string;
  /** XP con la que empezó este grado. */
  floor: number;
  /** XP del siguiente grado, o null en el último. */
  next: number | null;
  nextLabel: string | null;
  /** 0-100 dentro del grado actual. */
  percentage: number;
}

interface LadderStep {
  name: string;
  tier: (typeof TIERS)[number];
  floor: number;
}

const LADDER: LadderStep[] = RANKS.flatMap((rank) =>
  rank.thresholds.map((floor, index) => ({ name: rank.name, tier: TIERS[index] ?? "I", floor })),
);

export function getRank(xp: number): RankInfo {
  const safeXp = Number.isFinite(xp) ? Math.max(0, xp) : 0;
  let current: LadderStep = { name: "Aprendiz", tier: "I", floor: 0 };
  let following: LadderStep | undefined;
  for (let i = 0; i < LADDER.length; i++) {
    const step = LADDER[i];
    if (step && safeXp >= step.floor) {
      current = step;
      following = LADDER[i + 1];
    }
  }
  const percentage = following
    ? Math.min(100, Math.round(((safeXp - current.floor) / (following.floor - current.floor)) * 100))
    : 100;

  return {
    name: current.name,
    tier: current.tier,
    label: `${current.name} ${current.tier}`,
    floor: current.floor,
    next: following ? following.floor : null,
    nextLabel: following ? `${following.name} ${following.tier}` : null,
    percentage,
  };
}

/** "1840" → "1.840" (Intl con es-ES no agrupa los números de cuatro cifras). */
export function formatXp(xp: number): string {
  return String(Math.max(0, Math.round(xp))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
