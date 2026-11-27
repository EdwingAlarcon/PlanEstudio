"use client";

import { useMemo } from "react";
import { useProgressStore } from "@/lib/progress";
import { useInteractivePracticeProgressStore } from "@/lib/interactive-practice-progress";
import { useReviewStore } from "@/lib/review-store";
import { calculateXp, getRank, type RankInfo, type XpBreakdown } from "@/lib/xp";

// Lee los tres stores sin fusionarlos (cada uno sigue siendo independiente) y deriva la XP.
export function useXp(): { xp: XpBreakdown; rank: RankInfo } {
  const quizScores = useProgressStore((s) => s.quizScores);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const labEvidence = useProgressStore((s) => s.labEvidence);
  const practiceRecords = useInteractivePracticeProgressStore((s) => s.records);
  const reviewCards = useReviewStore((s) => s.cards);

  return useMemo(() => {
    const xp = calculateXp({ quizScores, completedLabs, labEvidence, practiceRecords, reviewCards });
    return { xp, rank: getRank(xp.total) };
  }, [quizScores, completedLabs, labEvidence, practiceRecords, reviewCards]);
}
