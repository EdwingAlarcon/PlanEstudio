import type { Metadata } from "next";
import { getAllModules } from "@/lib/content";
import { getAllReviewableQuestions } from "@/lib/questions-parser";
import { ReviewSessionClient } from "@/components/review/review-session-client";

export const metadata: Metadata = {
  title: "Repaso inteligente",
  description: "Recupera conceptos que ya estudiaste antes de que se vuelvan difíciles de recordar.",
};

export default function ReviewPage() {
  const questions = getAllReviewableQuestions();
  const moduleLinks = Object.fromEntries(
    getAllModules().map((mod) => [mod.moduleId, { href: `/nivel/${mod.levelId}/modulo/${mod.slug}`, title: mod.title }])
  );

  return <ReviewSessionClient questions={questions} moduleLinks={moduleLinks} />;
}
