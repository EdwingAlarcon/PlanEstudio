"use client";

import { useState, useCallback } from "react";
import type { Question } from "@/lib/quiz-engine";
import {
  createSession,
  recordAttempt,
  finishSession,
  calculateResult,
  getCurrentQuestion,
  getAnsweredCount,
  isSessionComplete,
} from "@/lib/quiz-engine";
import { useProgressStore } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface QuizPanelProps {
  questions: Question[];
  moduleId: number;
}

type PanelState = "idle" | "question" | "feedback" | "result";

export function QuizPanel({ questions, moduleId }: QuizPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [session, setSession] = useState(() =>
    createSession(questions, { moduleId, shuffle: false })
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [lastAttempt, setLastAttempt] = useState<{
    question: Question;
    selected: number[];
    isCorrect: boolean;
  } | null>(null);

  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  const currentQuestion = getCurrentQuestion(session);
  const answeredCount = getAnsweredCount(session);
  const progressPct = Math.round((answeredCount / session.questions.length) * 100);

  const startQuiz = () => {
    setSession(createSession(questions, { moduleId, shuffle: true }));
    setSelected([]);
    setLastAttempt(null);
    setPanelState("question");
  };

  const toggleOption = useCallback((idx: number, isMulti: boolean) => {
    setSelected((prev) => {
      if (isMulti) {
        return prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx];
      }
      return [idx];
    });
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || selected.length === 0) return;

    const newSession = recordAttempt(session, currentQuestion.id, selected);
    const attempt = newSession.attempts.find((a) => a.questionId === currentQuestion.id);
    setLastAttempt({
      question: currentQuestion,
      selected,
      isCorrect: attempt?.isCorrect ?? false,
    });
    setSession(newSession);
    setPanelState("feedback");
  }, [session, currentQuestion, selected]);

  const continueQuiz = useCallback(() => {
    if (isSessionComplete(session)) {
      const finished = finishSession(session);
      setSession(finished);
      const result = calculateResult(finished);
      saveQuizScore(String(moduleId), result.percentage);
      setPanelState("result");
    } else {
      setSelected([]);
      setLastAttempt(null);
      setPanelState("question");
    }
  }, [session, moduleId, saveQuizScore]);

  if (panelState === "idle") {
    return (
      <div className="rounded-lg border p-6 text-center space-y-3">
        <p className="text-muted-foreground text-sm">
          {questions.length} preguntas de práctica para este módulo.
        </p>
        <Button onClick={startQuiz}>{UI.quiz.start}</Button>
      </div>
    );
  }

  if (panelState === "result") {
    const result = calculateResult(session);
    return (
      <QuizResult
        result={result}
        onRetry={startQuiz}
      />
    );
  }

  if (!currentQuestion) return null;

  const isMulti = currentQuestion.type === "multi";

  return (
    <div className="rounded-lg border space-y-0 overflow-hidden">
      {/* Progress header */}
      <div className="p-4 border-b bg-muted/30 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{UI.quiz.questionOf(answeredCount + 1, session.questions.length)}</span>
          {isMulti && (
            <Badge variant="secondary" className="text-[10px]">
              {UI.quiz.selectMultiple}
            </Badge>
          )}
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      {/* Question */}
      <div className="p-5 space-y-4">
        <p className="font-medium leading-relaxed">{currentQuestion.prompt}</p>

        {isMulti && (
          <p className="text-xs text-muted-foreground">{UI.quiz.selectMultipleHint}</p>
        )}

        <div className="space-y-2" role="group" aria-label="Opciones de respuesta">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selected.includes(idx);

            let optionClass =
              "w-full text-left px-4 py-3 rounded-md border text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring";

            if (panelState === "feedback") {
              const isCorrect = currentQuestion.answer.includes(idx);
              if (isCorrect) optionClass += " border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100";
              else if (isSelected && !isCorrect) optionClass += " border-red-500 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100";
              else optionClass += " border-border opacity-60";
            } else {
              optionClass += isSelected
                ? " border-primary bg-primary/10"
                : " border-border hover:bg-accent hover:border-primary/40";
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => panelState === "question" && toggleOption(idx, isMulti)}
                disabled={panelState === "feedback"}
                aria-pressed={isSelected}
              >
                <span className="font-mono text-xs font-bold mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {panelState === "feedback" && lastAttempt && (
          <div
            className={cn(
              "rounded-md p-3 text-sm space-y-1",
              lastAttempt.isCorrect
                ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
            )}
          >
            <div className="flex items-center gap-1.5 font-medium">
              {lastAttempt.isCorrect ? (
                <><CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden />{UI.quiz.correct}</>
              ) : (
                <><XCircle className="h-4 w-4 text-red-600" aria-hidden />{UI.quiz.incorrect}</>
              )}
            </div>
            <p className="text-muted-foreground">
              <span className="font-medium">{UI.quiz.explanation}</span>{" "}
              {lastAttempt.question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
        {panelState === "question" ? (
          <Button
            onClick={submitAnswer}
            disabled={selected.length === 0}
          >
            {UI.quiz.submit}
          </Button>
        ) : (
          <Button onClick={continueQuiz}>
            {isSessionComplete(session) ? UI.quiz.finish : UI.quiz.next}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────

function QuizResult({
  result,
  onRetry,
}: {
  result: ReturnType<typeof calculateResult>;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-lg border p-6 text-center space-y-4">
      <div className="text-5xl font-bold tabular-nums">
        {result.percentage}%
      </div>
      <div>
        <p className="font-medium">
          {UI.quiz.score(result.correct, result.total)}
        </p>
        <p className={cn("text-sm", result.passed ? "text-green-600" : "text-red-600")}>
          {result.passed ? UI.quiz.passed : UI.quiz.failed}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">{UI.quiz.passingScore}</p>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw className="h-4 w-4 mr-1.5" aria-hidden />
        {UI.quiz.retry}
      </Button>
    </div>
  );
}
