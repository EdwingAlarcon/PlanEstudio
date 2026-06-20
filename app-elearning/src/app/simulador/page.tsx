import type { Metadata } from "next";
import { SimulatorClient } from "@/components/quiz/simulator-client";
import { getAllQuestions } from "@/lib/questions-parser";

export const metadata: Metadata = {
  title: "Simulador de Examen",
  description: "Simulador cronometrado con 40 preguntas mixtas de todos los módulos.",
};

export default function SimulatorPage() {
  const allQuestions = getAllQuestions();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">🎯 Simulador de Examen</h1>
        <p className="text-muted-foreground">
          Examen cronometrado · 40 preguntas aleatorias · Umbral de aprobación: 70%
        </p>
      </div>
      <SimulatorClient allQuestions={allQuestions} />
    </div>
  );
}
