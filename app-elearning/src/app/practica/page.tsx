import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { InteractivePracticeClient } from "@/components/interactive-practices/interactive-practice-client";
import { getAllInteractivePractices } from "@/lib/interactive-practices";

export const metadata: Metadata = buildPageMetadata({
  title: "Práctica interactiva",
  description: "Motor piloto de micro-prácticas interactivas para decisiones, flujos, consultas y depuración.",
  path: "/practica",
});

export default function InteractivePracticePage() {
  return <InteractivePracticeClient practices={getAllInteractivePractices()} />;
}
