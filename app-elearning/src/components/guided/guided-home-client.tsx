"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FOUNDATION_ROUTE, getFoundationProgress } from "@/lib/guided-journey";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useProgressStore } from "@/lib/progress";
import { useCurriculum, useNextBestAction } from "@/components/guided/use-next-best-action";

// Bloque principal del inicio: responde "¿por dónde empiezo?" y "¿qué sigue?" con UNA acción.
// Rediseñado el 2026-11-11: antes competían tres "continuar" (tarjeta de último módulo, siguiente
// acción y botón de la barra), cuatro entradas, un plan semanal genérico y dos textos explicativos.
export function GuidedHomeClient() {
  const onboarding = useOnboardingStore();
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const lastVisited = useProgressStore((s) => s.lastVisited);
  const curriculum = useCurriculum();
  const nextAction = useNextBestAction();
  const foundations = getFoundationProgress(completedModules, completedLabs, onboarding);
  const hasStarted = Boolean(onboarding.startedAt) || completedModules.length > 0 || completedLabs.length > 0;

  const lastModule = lastVisited ? curriculum.find((mod) => mod.key === lastVisited) : undefined;
  const showLastVisited = lastModule && lastModule.href !== nextAction.activity.href;
  const certificationTotal = curriculum.filter((mod) => ["basico", "intermedio", "avanzado", "arquitecto"].includes(mod.levelId)).length;
  const certificationDone = curriculum.filter((mod) =>
    ["basico", "intermedio", "avanzado", "arquitecto"].includes(mod.levelId) && completedModules.includes(mod.key)
  ).length;
  const inFoundations = foundations.completed < foundations.total;

  return (
    <section aria-labelledby="guided-heading" className="space-y-5">
      <div className="space-y-2">
        <h1 id="guided-heading" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {hasStarted ? "Tu siguiente paso" : "Empieza aquí"}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {hasStarted
            ? "Calculado con tu progreso guardado en este navegador. Termina este paso y la plataforma te propone el siguiente."
            : "Aprenderás Power Platform y Dynamics 365 haciendo, en tu propio ambiente de Microsoft. No necesitas elegir especialización: empieza por los fundamentos."}
        </p>
      </div>

      <div className="rounded-xl border border-[#0078D4]/25 bg-card p-5 shadow-fluent-1 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0078D4] dark:text-[#4DB8FF]">
              {nextAction.route} · {nextAction.time}
            </p>
            <h2 className="text-xl font-semibold text-foreground">{nextAction.activity.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{nextAction.reason}</p>
          </div>
          <Button asChild size="lg" className="w-full shrink-0 bg-[#0078D4] text-white hover:bg-[#106EBE] md:w-auto">
            <Link
              href={nextAction.activity.href}
              onClick={() => {
                if (!onboarding.startedAt) onboarding.startOnboarding("desde-cero");
                onboarding.setCurrentActivity(nextAction.activity.id);
              }}
            >
              {hasStarted ? nextAction.cta : "Comenzar desde cero"}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>{inFoundations ? FOUNDATION_ROUTE.title : "Cadena de certificación (Niveles 1 a 4)"}</span>
              <span className="tabular-nums">
                {inFoundations ? `${foundations.completed}/${foundations.total}` : `${certificationDone}/${certificationTotal} módulos`}
              </span>
            </div>
            <Progress
              value={inFoundations ? foundations.percentage : certificationTotal ? Math.round((certificationDone / certificationTotal) * 100) : 0}
              className="h-1.5"
            />
          </div>
          {showLastVisited ? (
            <Link href={lastModule.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0 truncate">
                Continuar donde lo dejaste: <span className="font-medium text-foreground">{lastModule.title}</span>
              </span>
            </Link>
          ) : !hasStarted ? (
            <Link
              href="/mi-ruta"
              onClick={() => onboarding.startOnboarding("basico")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Compass className="h-4 w-4 shrink-0" aria-hidden />
              <span>¿Ya tienes experiencia? <span className="font-medium text-foreground">Ajusta tu ruta en 2 minutos</span></span>
            </Link>
          ) : null}
        </div>
      </div>

      {!hasStarted && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          ¿Nunca tocaste Power Platform? Antes del Módulo 1 lee la{" "}
          <Link href="/recursos/ruta-cero-absoluta" className="font-medium text-[#0078D4] underline-offset-2 hover:underline dark:text-[#4DB8FF]">
            Ruta cero absoluta
          </Link>{" "}
          (solo lectura, sin cuenta). Si tu tenant está en español, elige <strong>Interfaz de tu ambiente: Español</strong> arriba
          y los módulos te mostrarán los menús con su nombre en español.{" "}
          <Link href="/mi-ruta" onClick={() => onboarding.startOnboarding("desde-cero")} className="font-medium text-[#0078D4] underline-offset-2 hover:underline dark:text-[#4DB8FF]">
            Empiezo desde cero: ver el plan de fundamentos
          </Link>
        </p>
      )}
    </section>
  );
}
