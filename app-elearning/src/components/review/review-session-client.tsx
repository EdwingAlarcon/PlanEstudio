"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Brain, CheckCircle2, XCircle, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { evaluateAnswer, type Question } from "@/lib/quiz-engine";
import { useReviewStore } from "@/lib/review-store";
import { getReviewNow } from "@/lib/review-date";
import {
  getDueReviewItems,
  getIncorrectReviewItems,
  getRetentionSummary,
  groupReinforcementByModule,
  SESSION_SIZE_LIMITS,
  type ReviewSessionSize,
} from "@/lib/review-queue";
import type { ReviewCardState, ReviewConfidence } from "@/lib/review-scheduler";
import { RetentionPortabilityPanel } from "./retention-portability-panel";

interface ModuleLink {
  href: string;
  title: string;
}

interface ReviewSessionClientProps {
  questions: Question[];
  moduleLinks: Record<number, ModuleLink>;
}

type PanelView = "home" | "session" | "summary";

const CONFIDENCE_LABELS: Record<ReviewConfidence, string> = {
  again: "Otra vez",
  hard: "Difícil",
  good: "Bien",
  easy: "Fácil",
};

export function ReviewSessionClient({ questions, moduleLinks }: ReviewSessionClientProps) {
  const questionMap = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const knownQuestionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  const cards = useReviewStore((s) => s.cards);
  const sessionSize = useReviewStore((s) => s.sessionSize);
  const setSessionSize = useReviewStore((s) => s.setSessionSize);
  const reviewCard = useReviewStore((s) => s.reviewCard);

  const [view, setView] = useState<PanelView>("home");
  const [queue, setQueue] = useState<ReviewCardState[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [phase, setPhase] = useState<"question" | "feedback">("question");
  const [lastCorrect, setLastCorrect] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [sessionStartedAt, setSessionStartedAt] = useState<number>(0);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);

  // §63: move focus to the question heading on every advance — never leave it
  // on a button that just unmounted.
  useEffect(() => {
    if (view === "session") questionHeadingRef.current?.focus();
  }, [view, index]);

  const now = getReviewNow();
  const summary = getRetentionSummary(cards, now);
  const reinforcement = groupReinforcementByModule(cards);
  const dayLogs = useReviewStore((s) => s.dayLogs);

  function startSession(mode: "due" | "free") {
    const limit = SESSION_SIZE_LIMITS[sessionSize];
    const items = mode === "due"
      ? getDueReviewItems(cards, now, limit)
      : getIncorrectReviewItems(cards).slice(0, limit);
    if (items.length === 0) return;
    setQueue(items);
    setIndex(0);
    setSelected([]);
    setPhase("question");
    setStats({ correct: 0, incorrect: 0 });
    setSessionStartedAt(Date.now());
    setView("session");
  }

  const currentCard = queue[index];
  const currentQuestion = currentCard ? questionMap.get(currentCard.questionId) : undefined;

  function submitAnswer() {
    if (!currentQuestion || selected.length === 0) return;
    const isCorrect = evaluateAnswer(currentQuestion, selected);
    setLastCorrect(isCorrect);
    setPhase("feedback");
  }

  function chooseConfidence(confidence: ReviewConfidence) {
    if (!currentCard) return;
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - sessionStartedAt) / 1000));
    reviewCard(currentCard.questionId, lastCorrect, confidence, getReviewNow(), elapsedSeconds);
    setStats((s) => ({
      correct: s.correct + (lastCorrect ? 1 : 0),
      incorrect: s.incorrect + (lastCorrect ? 0 : 1),
    }));
    if (index + 1 >= queue.length) {
      setView("summary");
    } else {
      setIndex((i) => i + 1);
      setSelected([]);
      setPhase("question");
    }
  }

  // ── Session view ─────────────────────────────────────────────────────────
  if (view === "session" && currentCard && currentQuestion) {
    const isMulti = currentQuestion.type === "multi";
    const moduleLink = moduleLinks[currentCard.moduleId];
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        <div className="rounded-lg border space-y-0 overflow-hidden">
          <div className="p-4 border-b bg-muted/30 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pregunta {index + 1} de {queue.length}</span>
              {currentCard.itemType === "case-diagnosis" && (
                <Badge variant="secondary" className="text-[10px]">Diagnóstico de caso</Badge>
              )}
            </div>
            <Progress value={Math.round((index / queue.length) * 100)} className="h-1.5" />
          </div>

          <div className="p-5 space-y-4">
            <h2 ref={questionHeadingRef} id="review-question-heading" className="font-medium leading-relaxed outline-none" tabIndex={-1}>
              {currentQuestion.prompt}
            </h2>

            {isMulti && phase === "question" && (
              <p className="text-xs text-muted-foreground">Selecciona todas las opciones correctas.</p>
            )}

            <div className="space-y-2" role="group" aria-label="Opciones de respuesta">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selected.includes(idx);
                let optionClass =
                  "w-full text-left px-4 py-3 rounded-md border text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring";

                if (phase === "feedback") {
                  const isCorrectOption = currentQuestion.answer.includes(idx);
                  if (isCorrectOption) optionClass += " border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100";
                  else if (isSelected) optionClass += " border-red-500 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100";
                  else optionClass += " border-border opacity-60";
                } else {
                  optionClass += isSelected ? " border-primary bg-primary/10" : " border-border hover:bg-accent hover:border-primary/40";
                }

                return (
                  <button
                    key={idx}
                    role={isMulti ? "checkbox" : "radio"}
                    aria-checked={isSelected}
                    className={optionClass}
                    disabled={phase === "feedback"}
                    onClick={() => {
                      if (phase !== "question") return;
                      setSelected((prev) => {
                        if (isMulti) return prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx];
                        return [idx];
                      });
                    }}
                  >
                    <span className="font-mono text-xs font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {phase === "feedback" && (
              <div aria-live="polite" className="space-y-3">
                <div className={cn(
                  "rounded-md p-3 text-sm space-y-1",
                  lastCorrect ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                )}>
                  <div className="flex items-center gap-1.5 font-medium">
                    {lastCorrect ? (
                      <><CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden />Correcto</>
                    ) : (
                      <><XCircle className="h-4 w-4 text-red-600" aria-hidden />Incorrecto</>
                    )}
                  </div>
                  <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                </div>

                {moduleLink && (
                  <Link
                    href={moduleLink.href}
                    className="inline-flex items-center gap-1 text-xs text-[#0078D4] dark:text-[#4DB8FF] hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden />
                    Revisar concepto: {moduleLink.title}
                  </Link>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">¿Qué tan fácil fue recordarlo?</p>
                  {lastCorrect ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Confianza al recordar">
                      {(["again", "hard", "good", "easy"] as ReviewConfidence[]).map((confidence) => (
                        <Button key={confidence} variant="outline" size="sm" onClick={() => chooseConfidence(confidence)}>
                          {CONFIDENCE_LABELS[confidence]}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => chooseConfidence("again")}>
                      {CONFIDENCE_LABELS.again}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-muted/20 flex justify-end">
            {phase === "question" && (
              <Button onClick={submitAnswer} disabled={selected.length === 0}>Responder</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Summary view ─────────────────────────────────────────────────────────
  if (view === "summary") {
    const total = stats.correct + stats.incorrect;
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="rounded-lg border p-6 text-center space-y-4">
          <h1 className="text-lg font-semibold">Repaso completado</h1>
          <p className="text-sm text-muted-foreground">
            {total} pregunta{total === 1 ? "" : "s"} · {stats.correct} correcta{stats.correct === 1 ? "" : "s"} · {stats.incorrect} necesita{stats.incorrect === 1 ? "" : "n"} refuerzo
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => setView("home")}>Volver a repaso</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Home view ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0078D4]/10">
          <Brain className="h-5 w-5 text-[#0078D4]" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Repaso inteligente</h1>
          <p className="text-sm text-muted-foreground">
            Recupera conceptos que ya estudiaste antes de que se vuelvan difíciles de recordar.
          </p>
        </div>
      </div>

      {summary.total === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Completa tu primer quiz para empezar a construir tu calendario de repaso.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 shadow-fluent-1 space-y-4">
          {summary.dueToday > 0 ? (
            <>
              <div>
                <p className="text-lg font-semibold">
                  Repaso de hoy · {summary.dueToday} pregunta{summary.dueToday === 1 ? "" : "s"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ~{Math.max(1, Math.round(summary.dueToday * 0.4))} min
                </p>
              </div>
              <Button onClick={() => startSession("due")}>Empezar repaso</Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Al día. No tienes repasos pendientes hoy.</p>
              {summary.needsReinforcement > 0 && (
                <Button variant="outline" onClick={() => startSession("free")}>Repasar más</Button>
              )}
            </>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2 border-t text-center text-xs text-muted-foreground">
            <div><span className="block text-base font-semibold text-foreground">{summary.dueToday}</span>Hoy</div>
            <div><span className="block text-base font-semibold text-foreground">{summary.dueTomorrow}</span>Mañana</div>
            <div><span className="block text-base font-semibold text-foreground">{summary.dueNext7Days}</span>Próximos 7 d</div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">Duración de sesión:</span>
            {(["corta", "normal", "larga"] as ReviewSessionSize[]).map((size) => (
              <Button
                key={size}
                size="sm"
                variant={sessionSize === size ? "default" : "outline"}
                onClick={() => setSessionSize(size)}
                className="h-7 px-2 text-xs"
              >
                {size} ({SESSION_SIZE_LIMITS[size]})
              </Button>
            ))}
          </div>
        </div>
      )}

      {reinforcement.length > 0 && (
        <section aria-labelledby="reinforcement-heading" className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
          <h2 id="reinforcement-heading" className="text-base font-semibold text-foreground">Necesita refuerzo</h2>
          <p className="mt-1 text-xs text-muted-foreground">Preguntas que has fallado más de una vez, agrupadas por módulo.</p>
          <ul className="mt-3 space-y-1">
            {reinforcement.map(({ moduleId, count }) => (
              <li key={moduleId} className="flex items-center justify-between text-sm">
                <Link href={moduleLinks[moduleId]?.href ?? "#"} className="flex items-center gap-1 text-[#0078D4] dark:text-[#4DB8FF] hover:underline">
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  {moduleLinks[moduleId]?.title ?? `Módulo ${moduleId}`}
                </Link>
                <span className="text-xs text-muted-foreground">{count} pendiente{count === 1 ? "" : "s"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dayLogs.length > 0 && (
        <section aria-labelledby="history-heading" className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
          <h2 id="history-heading" className="text-base font-semibold text-foreground">Historial de repaso</h2>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {[...dayLogs].reverse().slice(0, 14).map((log) => (
              <li key={log.day} className="flex justify-between">
                <span>{log.day}</span>
                <span>{log.reviewed} repasadas · {log.correct} correctas · {log.incorrect} incorrectas</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RetentionPortabilityPanel questionIds={knownQuestionIds} />
    </div>
  );
}
