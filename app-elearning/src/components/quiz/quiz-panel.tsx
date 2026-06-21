"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import { CheckCircle2, XCircle, RotateCcw, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface QuizPanelProps {
  questions: Question[];
  moduleId: string | number;
  /** Seconds for timed mode (simulator). Omit for untimed module quizzes. */
  timeLimit?: number;
  /** Called when the session ends (time up or last question answered). */
  onComplete?: (result: ReturnType<typeof calculateResult>) => void;
  /** Whether to persist the score to ProgressStore. Default: true. */
  saveScore?: boolean;
}

type PanelState = "idle" | "question" | "feedback" | "result";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function QuizPanel({
  questions,
  moduleId,
  timeLimit,
  onComplete,
  saveScore = true,
}: QuizPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [session, setSession] = useState(() =>
    createSession(questions, { moduleId: String(moduleId), shuffle: false })
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [lastAttempt, setLastAttempt] = useState<{
    question: Question;
    selected: number[];
    isCorrect: boolean;
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    timeLimit != null ? timeLimit : null
  );

  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  // Refs so the timer effect always sees the current session/callbacks without
  // needing them in the dep array (avoids stale closure issues).
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const currentQuestion = getCurrentQuestion(session);
  const answeredCount = getAnsweredCount(session);
  const progressPct = Math.round((answeredCount / session.questions.length) * 100);

  // ── Countdown timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft === null) return;
    if (panelState === "result" || panelState === "idle") return;

    if (secondsLeft <= 0) {
      // Time's up — finish the session immediately
      const finished = finishSession(sessionRef.current);
      setSession(finished);
      const result = calculateResult(finished);
      if (saveScore) saveQuizScore(String(moduleId), result.percentage);
      onCompleteRef.current?.(result);
      setPanelState("result");
      return;
    }

    const id = setTimeout(
      () => setSecondsLeft((s) => (s !== null ? s - 1 : s)),
      1000
    );
    return () => clearTimeout(id);
  }, [secondsLeft, panelState]); // eslint-disable-line react-hooks/exhaustive-deps

  const startQuiz = () => {
    setSession(createSession(questions, { moduleId: String(moduleId), shuffle: true }));
    setSelected([]);
    setLastAttempt(null);
    setSecondsLeft(timeLimit != null ? timeLimit : null);
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
      if (saveScore) saveQuizScore(String(moduleId), result.percentage);
      onCompleteRef.current?.(result);
      // Only show built-in result screen when there's no external handler
      if (!onCompleteRef.current) {
        setPanelState("result");
      }
    } else {
      setSelected([]);
      setLastAttempt(null);
      setPanelState("question");
    }
  }, [session, moduleId, saveScore, saveQuizScore]);

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
        questions={session.questions}
        onRetry={startQuiz}
      />
    );
  }

  if (!currentQuestion) return null;

  const isMulti = currentQuestion.type === "multi";
  const timeIsLow = secondsLeft !== null && secondsLeft < 300; // < 5 min

  return (
    <div className="rounded-lg border space-y-0 overflow-hidden">
      {/* Progress + timer header */}
      <div className="p-4 border-b bg-muted/30 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{UI.quiz.questionOf(answeredCount + 1, session.questions.length)}</span>
          <div className="flex items-center gap-2">
            {isMulti && (
              <Badge variant="secondary" className="text-[10px]">
                {UI.quiz.selectMultiple}
              </Badge>
            )}
            {secondsLeft !== null && (
              <span
                className={cn(
                  "flex items-center gap-1 font-mono font-medium tabular-nums",
                  timeIsLow ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                )}
                aria-live="polite"
                aria-label={`Tiempo restante: ${formatTime(secondsLeft)}`}
              >
                <Clock className="h-3 w-3" aria-hidden />
                {formatTime(secondsLeft)}
              </span>
            )}
          </div>
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

export function QuizResult({
  result,
  questions,
  onRetry,
  extraActions,
}: {
  result: ReturnType<typeof calculateResult>;
  questions?: Question[];
  onRetry: () => void;
  extraActions?: React.ReactNode;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const wrongAttempts = result.attempts.filter((a) => !a.isCorrect);
  const wrongWithQuestion = wrongAttempts
    .map((a) => ({
      attempt: a,
      question: questions?.find((q) => q.id === a.questionId),
    }))
    .filter((x): x is { attempt: typeof x.attempt; question: Question } => x.question != null);

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Score header */}
      <div className="p-6 text-center space-y-4">
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
        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="outline" onClick={onRetry}>
            <RotateCcw className="h-4 w-4 mr-1.5" aria-hidden />
            {UI.quiz.retry}
          </Button>
          {extraActions}
        </div>
      </div>

      {/* Error breakdown — only when there are wrong answers and question data */}
      {wrongWithQuestion.length > 0 && (
        <div className="border-t">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-accent transition-colors"
            onClick={() => setShowBreakdown((v) => !v)}
            aria-expanded={showBreakdown}
          >
            <span className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" aria-hidden />
              {UI.quiz.reviewErrors(wrongWithQuestion.length)}
            </span>
            {showBreakdown ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            )}
          </button>

          {showBreakdown && (
            <div className="divide-y">
              {wrongWithQuestion.map(({ attempt, question }, i) => (
                <div key={attempt.questionId} className="p-4 space-y-2 text-sm">
                  <p className="font-medium">
                    <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                    {question.prompt}
                  </p>

                  {/* Options with highlighting */}
                  <div className="space-y-1 pl-4">
                    {question.options.map((opt, idx) => {
                      const isCorrect = question.answer.includes(idx);
                      const wasSelected = attempt.selected.includes(idx);
                      if (!isCorrect && !wasSelected) return null;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-start gap-2 rounded px-2 py-1",
                            isCorrect
                              ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200"
                              : "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200"
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-600" aria-hidden />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-red-600" aria-hidden />
                          )}
                          <span>
                            <span className="font-mono font-bold text-xs mr-1">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {opt}
                            {isCorrect && wasSelected === false && (
                              <span className="ml-1 text-xs opacity-70">(correcta)</span>
                            )}
                            {wasSelected && !isCorrect && (
                              <span className="ml-1 text-xs opacity-70">(tu respuesta)</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <p className="text-muted-foreground pl-4">
                    <span className="font-medium text-foreground">{UI.quiz.explanation}</span>{" "}
                    {question.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
