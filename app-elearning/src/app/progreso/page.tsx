import type { Metadata } from "next";
import { LEVEL_ORDER } from "@/lib/i18n";
import { getLevelById, getLabsForLevel } from "@/lib/content";
import { ProgressDashboardClient, type LevelReadinessData } from "./progress-dashboard-client";

export const metadata: Metadata = {
  title: "Mi progreso",
  description: "Módulos, quizzes, laboratorios y estado real de certificación en un solo lugar.",
};

export default function ProgressDashboardPage() {
  const levels: LevelReadinessData[] = LEVEL_ORDER.map((levelId) => {
    const level = getLevelById(levelId);
    const modules = (level?.modules ?? []).map((m) => ({ moduleId: m.moduleId, title: m.title }));
    const labs = getLabsForLevel(levelId).map((lab) => ({ slug: lab.slug, title: lab.title }));

    return { levelId, modules, labs };
  });

  return <ProgressDashboardClient levels={levels} />;
}
