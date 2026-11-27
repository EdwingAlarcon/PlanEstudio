import type { InteractivePracticeRecord } from "./interactive-practice-progress";
import type { ReviewCardMap } from "./review-queue";

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
  /** Lab marcado como completado. Es autodeclarado (la app no ve el tenant), por eso vale poco:
   *  la F3 pedirá evidencia (IDs de ejecución, respuestas) y con ella el lab pasará a 100. */
  lab: 25,
  /** Cada respuesta correcta en el repaso espaciado. */
  reviewCorrect: 5,
} as const;

export interface XpInput {
  quizScores: Record<string, number>;
  completedLabs: string[];
  practiceRecords: Record<string, InteractivePracticeRecord>;
  reviewCards: ReviewCardMap;
}

export interface XpBreakdown {
  practices: number;
  quizzes: number;
  labs: number;
  review: number;
  total: number;
  counts: { practices: number; quizzes: number; labs: number; reviewCorrect: number };
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
  const labCount = new Set(input.completedLabs).size;
  const reviewCorrect = Object.values(input.reviewCards).reduce(
    (total, card) => total + (Number.isFinite(card?.correctReviews) ? Math.max(0, card.correctReviews) : 0),
    0,
  );

  const practices = practiceCount * XP_RULES.practice;
  const quizzes = quizCount * XP_RULES.quiz;
  const labs = labCount * XP_RULES.lab;
  const review = reviewCorrect * XP_RULES.reviewCorrect;

  return {
    practices,
    quizzes,
    labs,
    review,
    total: practices + quizzes + labs + review,
    counts: { practices: practiceCount, quizzes: quizCount, labs: labCount, reviewCorrect },
  };
}

// Rangos: los roles para los que prepara el curso, cada uno con tres grados.
// Escala calibrada para el sistema completo (labs con evidencia a 100 XP, F3), con el contenido de 2026-11-27
// (prácticas + quizzes + labs obligatorios, sin repaso): Nivel 1 ≈ 1.460 XP (Maker II-III), +Nivel 2 ≈ 2.790
// (Consultor funcional I), +Nivel 3 ≈ 5.620 (Desarrollador I) y +Nivel 4 ≈ 9.030 (Arquitecto I). Mientras los labs
// valgan 25 (autodeclarados) se sube más despacio; no se recalibra para no mover los rangos dos veces.
export const RANKS = [
  { name: "Aprendiz", thresholds: [0, 150, 300] },
  { name: "Maker", thresholds: [500, 1000, 1500] },
  { name: "Consultor funcional", thresholds: [2000, 3000, 4000] },
  { name: "Desarrollador", thresholds: [5000, 6300, 7600] },
  { name: "Arquitecto", thresholds: [9000, 11500, 14000] },
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
