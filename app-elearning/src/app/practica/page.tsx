import type { Metadata } from "next";
import { InteractivePracticeClient } from "@/components/interactive-practices/interactive-practice-client";
import { getAllInteractivePractices } from "@/lib/interactive-practices";

export const metadata: Metadata = {
  title: "Práctica interactiva",
  description: "Motor piloto de micro-prácticas interactivas para decisiones, flujos, consultas y depuración.",
};

export default function InteractivePracticePage() {
  return <InteractivePracticeClient practices={getAllInteractivePractices()} />;
}
