"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Compass, FlaskConical, Map, PlayCircle, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FOUNDATION_ACTIVITIES, FOUNDATION_ROUTE, buildWeeklyPlan, getFoundationProgress, getNextBestAction, getRecommendationReason } from "@/lib/guided-journey";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useProgressStore } from "@/lib/progress";

export function GuidedHomeClient() {
  const onboarding = useOnboardingStore();
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const progress = getFoundationProgress(completedModules, completedLabs, onboarding);
  const nextAction = getNextBestAction(completedModules, completedLabs, onboarding);
  const hasStarted = Boolean(onboarding.startedAt) || completedModules.length > 0 || completedLabs.length > 0;
  const weeklyPlan = buildWeeklyPlan(onboarding.answers.availability, nextAction);

  return (
    <section aria-labelledby="guided-heading" className="rounded-xl border border-border bg-card p-5 shadow-fluent-1 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-[#0078D4] text-white">
              {onboarding.navigationMode === "guided" ? "Modo guiado" : "Explorar libremente"}
            </Badge>
            <Badge variant="outline">Recomendacion determinista</Badge>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {onboarding.navigationMode === "guided"
              ? "Modo guiado: te sugerimos siempre la siguiente actividad, pero puedes cambiar de ruta cuando quieras."
              : "Explorar libremente: eliges tú qué módulo o lab abrir a continuación, sin una sugerencia fija."}
            {" "}
            Recomendación determinista: la misma respuesta te lleva siempre a la misma ruta recomendada — no depende del azar ni de un algoritmo que cambie con el tiempo.
          </p>

          <div className="space-y-2">
            <h1 id="guided-heading" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {hasStarted ? "Continua donde quedaste" : "Empieza aqui"}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {hasStarted
                ? "Tu siguiente accion esta calculada sobre tu ruta activa y tu progreso local. Tu progreso no se pierde si cambias de objetivo."
                : "No necesitas elegir una especializacion todavia. Completa los fundamentos y despues te ayudaremos a escoger una ruta."}
            </p>
          </div>

          <div className="rounded-lg border border-[#0078D4]/20 bg-[#EFF6FC] p-4 dark:border-[#4DB8FF]/20 dark:bg-[rgba(0,120,212,0.10)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0078D4] dark:text-[#4DB8FF]">
                  Siguiente accion
                </p>
                <h2 className="text-lg font-semibold text-foreground">{nextAction.activity.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{nextAction.reason}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{nextAction.time}</span>
                  <span aria-hidden>·</span>
                  <span>{nextAction.activity.type === "lab" ? "Practica guiada" : "Actividad guiada"}</span>
                </div>
              </div>
              <Button asChild className="w-full shrink-0 bg-[#0078D4] text-white hover:bg-[#106EBE] sm:w-auto">
                <Link href={nextAction.activity.href} onClick={() => onboarding.setCurrentActivity(nextAction.activity.id)}>
                  {hasStarted ? nextAction.cta : "Comenzar desde cero"}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4" aria-label="Entradas iniciales">
            <EntryButton title="Empiezo desde cero" href="/mi-ruta" active icon={<Sparkles className="h-4 w-4" />} onClick={() => onboarding.startOnboarding("desde-cero")} />
            <EntryButton title="Ya conozco lo basico" href="/mi-ruta" icon={<Compass className="h-4 w-4" />} onClick={() => onboarding.startOnboarding("basico")} />
            <EntryButton title="Quiero aprender para un rol" href="/mi-ruta#roles" icon={<Map className="h-4 w-4" />} onClick={() => onboarding.startOnboarding("rol")} />
            <EntryButton title="Practicar o entrevistas" href="/simulador" icon={<PlayCircle className="h-4 w-4" />} onClick={() => onboarding.startOnboarding("practica")} />
          </div>
        </div>

        <aside className="space-y-4" aria-label="Resumen de ruta inicial">
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ruta activa</p>
                <h2 className="text-base font-semibold text-foreground">{FOUNDATION_ROUTE.title}</h2>
              </div>
              <span className="text-sm font-medium text-[#0078D4] dark:text-[#4DB8FF]">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {FOUNDATION_ROUTE.duration} · {FOUNDATION_ROUTE.sessionLength}. Primera practica: {FOUNDATION_ACTIVITIES[2]?.title}.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-[#107C10]" aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">Mi plan de esta semana</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {weeklyPlan.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#107C10]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Ajustado a {onboarding.answers.availability}. Puedes cambiarlo en Mi ruta.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-2 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">Puedes ignorar por ahora</h2>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Rutas avanzadas, incident labs, capstones y especializaciones D365/IA. Siguen accesibles en Explorar todo.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Esta recomendacion se basa en tus respuestas y progreso local; {getRecommendationReason(onboarding.answers)}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function EntryButton({
  title,
  href,
  icon,
  active = false,
  onClick,
}: {
  title: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        active
          ? "flex min-h-24 flex-col justify-between rounded-lg border-2 border-[#0078D4] bg-[#EFF6FC] p-3 text-sm font-semibold text-[#005A9E] shadow-fluent-1 dark:bg-[rgba(0,120,212,0.12)] dark:text-[#4DB8FF]"
          : "flex min-h-24 flex-col justify-between rounded-lg border border-border bg-background p-3 text-sm font-medium text-foreground transition-colors hover:border-[#0078D4]/40"
      }
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-card text-[#0078D4] dark:text-[#4DB8FF]">
        {icon}
      </span>
      <span>{title}</span>
    </Link>
  );
}
