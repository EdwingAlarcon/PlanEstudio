"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { EmbeddedInteractivePractice } from "@/components/interactive-practices/interactive-practice-client";
import { useProgressStore } from "@/lib/progress";
import { useInteractivePracticeProgressStore } from "@/lib/interactive-practice-progress";
import { stepProgressId, type LessonStep, type LessonStepKind } from "@/lib/lesson-steps";
import type { InteractivePractice } from "@/lib/interactive-practices";
import { cn } from "@/lib/utils";

// Lección por pasos (F2 de "El camino jugable"): una idea por pantalla, la práctica dentro del paso
// y un botón que dice qué pasa al seguir. El paso actual vive en el hash (#paso-3) para poder volver a él.

const KIND_LABEL: Record<LessonStepKind, string> = {
  intro: "Antes de empezar",
  concepto: "Concepto",
  practica: "Micropráctica",
  ambiente: "En tu ambiente",
  reto: "Reto de transferencia",
  comprueba: "Comprueba",
};

interface LessonStepsClientProps {
  moduleKey: string;
  moduleTitle: string;
  moduleHref: string;
  steps: LessonStep[];
  practices: Record<string, InteractivePractice>;
  questionCount: number;
}

function readHashIndex(total: number): number | null {
  if (typeof window === "undefined") return null;
  const match = /^#paso-(\d+)$/.exec(window.location.hash);
  if (!match) return null;
  const n = Number(match[1]);
  return n >= 1 && n <= total ? n - 1 : null;
}

export function LessonStepsClient({ moduleKey, moduleTitle, moduleHref, steps, practices, questionCount }: LessonStepsClientProps) {
  const completedSteps = useProgressStore((s) => s.completedSteps);
  const markStepComplete = useProgressStore((s) => s.markStepComplete);
  const records = useInteractivePracticeProgressStore((s) => s.records);
  const [index, setIndex] = useState(0);
  const initialised = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const done = useMemo(() => new Set(completedSteps ?? []), [completedSteps]);
  const isDone = useCallback((step: LessonStep) => done.has(stepProgressId(moduleKey, step.id)), [done, moduleKey]);

  // Al entrar: el paso del hash o, si no hay, el primero sin hacer. Espera a que el progreso
  // guardado se cargue de localStorage; si no, todos los pasos parecerían pendientes.
  useEffect(() => {
    const decide = () => {
      if (initialised.current) return;
      initialised.current = true;
      const saved = new Set(useProgressStore.getState().completedSteps ?? []);
      const fromHash = readHashIndex(steps.length);
      const firstPending = steps.findIndex((s) => s.kind !== "comprueba" && !saved.has(stepProgressId(moduleKey, s.id)));
      setIndex(fromHash ?? (firstPending >= 0 ? firstPending : steps.length - 1));
    };
    if (useProgressStore.persist.hasHydrated()) decide();
    return useProgressStore.persist.onFinishHydration(decide);
  }, [steps, moduleKey]);

  useEffect(() => {
    const onHash = () => {
      const fromHash = readHashIndex(steps.length);
      if (fromHash !== null) setIndex(fromHash);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [steps.length]);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setIndex(clamped);
    window.history.replaceState(null, "", `#paso-${clamped + 1}`);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => headingRef.current?.focus());
  }, [steps.length]);

  const step = steps[index];
  if (!step) return null;
  const practice = step.practiceSlug ? practices[step.practiceSlug] : undefined;
  const practiceCompleted = practice ? records[practice.id]?.status === "completed" : false;
  const doneCount = steps.filter((s) => s.kind !== "comprueba" && isDone(s)).length;
  const total = steps.filter((s) => s.kind !== "comprueba").length;

  const completeAndNext = () => {
    markStepComplete(stepProgressId(moduleKey, step.id));
    goTo(index + 1);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6" data-testid="lesson-steps">
      <div className="flex items-center gap-3">
        <Link href={moduleHref} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" aria-label="Salir al módulo">
          <X className="h-4 w-4" aria-hidden />
        </Link>
        <ol className="flex flex-1 gap-1" aria-label={`Paso ${index + 1} de ${steps.length}`}>
          {steps.map((s, i) => (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Paso ${i + 1}: ${KIND_LABEL[s.kind]}${isDone(s) ? " (hecho)" : ""}`}
                aria-current={i === index ? "step" : undefined}
                className={cn(
                  "block h-1.5 w-full rounded-full transition-colors",
                  i === index ? "bg-[#0078D4] dark:bg-[#4DB8FF]" : isDone(s) ? "bg-[#107C10]" : "bg-muted hover:bg-muted-foreground/30",
                )}
              />
            </li>
          ))}
        </ol>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {index + 1}/{steps.length}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#0078D4] dark:text-[#4DB8FF]">
          {KIND_LABEL[step.kind]}
          {step.optional ? (
            <span className="ml-2 rounded bg-muted px-1.5 py-0.5 normal-case tracking-normal text-muted-foreground" data-testid="lesson-step-optional">
              Opcional: puedes saltarla
            </span>
          ) : null}
          {isDone(step) && step.kind !== "comprueba" ? (
            <span className="ml-2 inline-flex items-center gap-1 normal-case tracking-normal text-[#107C10]">
              <Check className="h-3 w-3" aria-hidden /> hecho
            </span>
          ) : null}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="text-xl font-bold tracking-tight text-foreground outline-none md:text-2xl" data-testid="lesson-step-title">
          {step.group}
        </h1>
        <p className="text-sm text-muted-foreground">{moduleTitle}</p>
      </div>

      {step.kind === "comprueba" ? (
        <section className="space-y-4 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-foreground">
            Hiciste <span className="font-semibold tabular-nums">{doneCount} de {total}</span> pasos. Ahora comprueba lo que aprendiste
            {questionCount > 0 ? ` con las ${questionCount} preguntas del módulo` : ""}: el quiz aprobado con 80 % o más suma 50 XP.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-[#0078D4] text-white hover:bg-[#106EBE]">
              <Link href={`${moduleHref}#comprueba`}>
                Hacer el quiz <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={moduleHref}>Ver el módulo completo</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            El Caso Real, las buenas prácticas, los errores comunes y los criterios de validación están en la página del módulo.
          </p>
        </section>
      ) : (
        <article className="rounded-xl border border-border bg-card px-6 py-6 md:px-8">
          <MarkdownRenderer content={step.markdown} />
        </article>
      )}

      {practice ? (
        <section aria-label="Micropráctica" className="space-y-2">
          <EmbeddedInteractivePractice practice={practice} />
        </section>
      ) : null}

      {step.kind !== "comprueba" && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={() => goTo(index - 1)} disabled={index === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Anterior
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {step.kind === "practica" && practice && !practiceCompleted ? (
              <>
                <span className="text-xs text-muted-foreground">Resuélvela para marcar el paso</span>
                <Button type="button" variant="outline" onClick={() => goTo(index + 1)}>Saltar por ahora</Button>
              </>
            ) : null}
            {step.optional ? (
              <Button type="button" variant="outline" onClick={() => goTo(index + 1)}>Saltar lo opcional</Button>
            ) : (step.kind === "ambiente" || step.kind === "reto") && (
              <Button type="button" variant="outline" onClick={() => goTo(index + 1)}>Lo haré después</Button>
            )}
            {!(step.kind === "practica" && practice && !practiceCompleted) && (
              <Button type="button" onClick={completeAndNext} className="bg-[#0078D4] text-white hover:bg-[#106EBE]" data-testid="lesson-step-next">
                {step.kind === "ambiente" || step.kind === "reto" ? "Lo hice en mi ambiente" : "Entendido, sigue"}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
