"use client";

import { useState } from "react";
import type { Question } from "@/lib/quiz-engine";
import { createSession, pickSimulatorQuestions, calculateResult } from "@/lib/quiz-engine";
import { Button } from "@/components/ui/button";
import { QuizPanel, QuizResult } from "./quiz-panel";
import { PlayCircle, ArrowLeft } from "lucide-react";
import { UI } from "@/lib/i18n";

const SIMULATOR_QUESTIONS = 40;
const SIMULATOR_TIME_SECONDS = 50 * 60; // 50 minutes

interface SimulatorClientProps {
  allQuestions: Question[];
}

type SimulatorState = "idle" | "running" | "finished";

export function SimulatorClient({ allQuestions }: SimulatorClientProps) {
  const [state, setState] = useState<SimulatorState>("idle");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [session, setSession] = useState(() =>
    createSession([], { timeLimit: SIMULATOR_TIME_SECONDS })
  );
  const [simulatorResult, setSimulatorResult] = useState<ReturnType<typeof calculateResult> | null>(null);

  const startSimulator = () => {
    const filtered = selectedLevel === "all"
      ? allQuestions
      : allQuestions.filter((q) => {
          if (selectedLevel === "basico") return q.moduleId <= 8;
          if (selectedLevel === "intermedio") return q.moduleId >= 9 && q.moduleId <= 17;
          if (selectedLevel === "avanzado") return q.moduleId >= 18 && q.moduleId <= 30;
          return q.moduleId >= 31;
        });

    const picked = pickSimulatorQuestions(filtered, Math.min(SIMULATOR_QUESTIONS, filtered.length));
    const newSession = createSession(picked, {
      timeLimit: SIMULATOR_TIME_SECONDS,
      shuffle: true,
    });
    setSession(newSession);
    setSimulatorResult(null);
    setState("running");
  };

  const handleComplete = (result: ReturnType<typeof calculateResult>) => {
    setSimulatorResult(result);
    setState("finished");
  };

  const resetSimulator = () => {
    setState("idle");
    setSimulatorResult(null);
  };

  if (state === "idle") {
    return (
      <div className="rounded-xl border p-8 space-y-6">
        <div className="grid gap-3 sm:grid-cols-3 text-center">
          <StatCard icon="📋" label="Preguntas" value={String(SIMULATOR_QUESTIONS)} />
          <StatCard icon="⏱️" label="Tiempo límite" value="50 min" />
          <StatCard icon="🎯" label="Para aprobar" value="70%" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="level-filter">
            Filtrar por nivel (opcional)
          </label>
          <select
            id="level-filter"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">Todos los niveles (mixto)</option>
            <option value="basico">Nivel 1 — Básico (PL-900)</option>
            <option value="intermedio">Nivel 2 — Intermedio (PL-200)</option>
            <option value="avanzado">Nivel 3 — Avanzado (PL-400)</option>
            <option value="arquitecto">Nivel 4 — Arquitecto (PL-600)</option>
          </select>
        </div>

        <Button size="lg" className="w-full" onClick={startSimulator}>
          <PlayCircle className="h-5 w-5 mr-2" aria-hidden />
          {UI.quiz.startSimulator}
        </Button>
      </div>
    );
  }

  if (state === "running") {
    return (
      <QuizPanel
        questions={session.questions}
        moduleId="simulator"
        timeLimit={SIMULATOR_TIME_SECONDS}
        onComplete={handleComplete}
        saveScore={false}
      />
    );
  }

  // state === "finished"
  if (simulatorResult) {
    return (
      <QuizResult
        result={simulatorResult}
        questions={session.questions}
        onRetry={startSimulator}
        extraActions={
          <Button variant="ghost" onClick={resetSimulator}>
            <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden />
            Cambiar configuración
          </Button>
        }
      />
    );
  }

  return null;
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4 space-y-1">
      <div className="text-2xl" aria-hidden>{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
