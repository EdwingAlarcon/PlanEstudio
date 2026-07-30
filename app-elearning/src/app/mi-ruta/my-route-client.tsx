"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Clock, Compass, HelpCircle, RotateCcw, Route, ShieldAlert, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FOUNDATION_ACTIVITIES, FOUNDATION_ROUTE, ROLE_EXPERIENCES, buildWeeklyPlan, getFoundationProgress, getNextBestAction, getRecommendationReason, isFoundationActivityComplete, recommendRouteSlug, type OnboardingAnswers, type WeeklyAvailability } from "@/lib/guided-journey";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useProgressStore } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { ProfessionalRouteSlug } from "@/lib/professional-routes";
import { UI } from "@/lib/i18n";
import { getNextWorkstationRequirement, getToolsForProfile, recommendWorkstationProfile } from "@/lib/workstation";
import { useWorkstationStore } from "@/lib/workstation-store";

interface RouteSummary {
  slug: ProfessionalRouteSlug;
  title: string;
  role: string;
  summary: string;
  accent: string;
  competencies: string[];
}

export function MyRouteClient({
  routes,
}: {
  routes: RouteSummary[];
}) {
  const onboarding = useOnboardingStore();
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const progress = getFoundationProgress(completedModules, completedLabs, onboarding);
  const nextAction = getNextBestAction(completedModules, completedLabs, onboarding);
  const weeklyPlan = buildWeeklyPlan(onboarding.answers.availability, nextAction);
  const recommendedSlug = recommendRouteSlug(onboarding.answers);
  const recommendedRoutes = useMemo(() => pickRecommendedRoutes(routes, recommendedSlug), [routes, recommendedSlug]);
  const started = onboarding.stage !== "new" || Boolean(onboarding.startedAt);

  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-0 bg-[#0078D4] text-white">Mi ruta</Badge>
              <Badge variant="outline">{onboarding.navigationMode === "guided" ? "Modo guiado" : "Explorar libremente"}</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{FOUNDATION_ROUTE.title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {FOUNDATION_ROUTE.summary} No tienes que estudiar todo ahora; las especializaciones son opcionales y puedes cambiar despues.
              </p>
            </div>
          </div>
          <div className="w-full rounded-lg border border-border bg-background p-4 lg:w-72">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Avance de fundamentos</span>
              <span className="text-[#0078D4] dark:text-[#4DB8FF]">{progress.completed}/{progress.total}</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">Progreso de la ruta activa, no del catalogo completo.</p>
          </div>
        </div>
      </section>

      {!started && <DiagnosticPanel />}

      <WorkstationPreviewSection />

      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-xl border border-[#0078D4]/20 bg-[#EFF6FC] p-5 shadow-fluent-1 dark:border-[#4DB8FF]/20 dark:bg-[rgba(0,120,212,0.10)]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0078D4] dark:text-[#4DB8FF]">Proxima mejor accion</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{nextAction.activity.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{nextAction.reason}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden />{nextAction.time}</span>
            <span>{nextAction.route}</span>
          </div>
          <Button asChild className="mt-5 bg-[#0078D4] text-white hover:bg-[#106EBE]">
            <Link href={nextAction.activity.href} onClick={() => onboarding.setCurrentActivity(nextAction.activity.id)}>
              {nextAction.cta}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
          <div className="mb-3 flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#107C10]" aria-hidden />
            <h2 className="text-base font-semibold text-foreground">Mi plan de esta semana</h2>
          </div>
          <AvailabilitySelector value={onboarding.answers.availability} />
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {weeklyPlan.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#107C10]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="activities-heading" className="space-y-4">
        <div>
          <h2 id="activities-heading" className="text-lg font-semibold text-foreground">Actividades de fundamentos</h2>
          <p className="text-sm text-muted-foreground">Obligatorio, recomendado y opcional estan separados para reducir ruido.</p>
        </div>
        <div className="space-y-3">
          {FOUNDATION_ACTIVITIES.map((activity) => {
            const complete = isFoundationActivityComplete(activity, completedModules, completedLabs, onboarding);
            return (
              <article key={activity.id} className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {complete ? <CheckCircle2 className="h-5 w-5 text-[#107C10]" aria-hidden /> : <Circle className="h-5 w-5 text-muted-foreground" aria-hidden />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={activity.requirement === "required" ? "default" : activity.requirement === "recommended" ? "secondary" : "outline"}>
                        {labelRequirement(activity.requirement)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Paso {activity.step} · {activity.minutes} min</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-foreground">{activity.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{activity.outcome}</p>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                      <p><span className="font-medium text-foreground">Prerequisitos:</span> {activity.prerequisites.join(", ")}</p>
                      <p><span className="font-medium text-foreground">Acceso:</span> {activity.access}</p>
                      <p><span className="font-medium text-foreground">Evidencia:</span> {activity.evidence}</p>
                    </div>
                    {activity.access.toLowerCase().includes("tenant") && (
                      <div className="mt-3 flex gap-2 rounded-lg border border-amber-500/25 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                        <span>{activity.tenantAlternative}</span>
                      </div>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <Link href={activity.href} onClick={() => onboarding.setCurrentActivity(activity.id)}>
                      Abrir
                      <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="roles" aria-labelledby="roles-heading" className="space-y-4">
        <div>
          <h2 id="roles-heading" className="text-lg font-semibold text-foreground">¿Que tipo de trabajo te gustaria aprender?</h2>
          <p className="text-sm text-muted-foreground">
            Recomendado antes de elegir especializacion: completa fundamentos, una practica y una reflexion breve. Puedes omitirlo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {ROLE_EXPERIENCES.map((experience) => (
            <article key={experience.id} className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
              <Badge variant="outline">{experience.minutes} min</Badge>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{experience.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{experience.activity}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3 px-0 text-[#0078D4] dark:text-[#4DB8FF]"
                onClick={() => onboarding.changeRoute(experience.route)}
              >
                Me interesa esta familia
                <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="recommendations-heading" className="space-y-4">
        <div>
          <h2 id="recommendations-heading" className="text-lg font-semibold text-foreground">Rutas recomendadas despues de fundamentos</h2>
          <p className="text-sm text-muted-foreground">
            Esta recomendacion se basa en tus respuestas iniciales, actividades realizadas e intereses declarados. No es diagnostico vocacional.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {recommendedRoutes.map((route, index) => (
            <article key={route.slug} className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
              <span className="mb-3 block h-1.5 w-12 rounded-full" style={{ backgroundColor: route.accent }} aria-hidden />
              <Badge variant={index === 0 ? "default" : "outline"}>{index === 0 ? "Mejor coincidencia" : index === 1 ? "Alternativa" : "Explorar otra opcion"}</Badge>
              <h3 className="mt-3 text-base font-semibold text-foreground">{route.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{route.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{route.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {route.competencies.slice(0, 3).map((competency) => (
                  <Badge key={competency} variant="secondary" className="text-[10px]">{competency}</Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/rutas/${route.slug}`}>Ver ruta</Link>
                </Button>
                <Button type="button" size="sm" onClick={() => onboarding.chooseRoute(route.slug)}>
                  Elegir
                </Button>
              </div>
            </article>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{getRecommendationReason(onboarding.answers)}</p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="exit-heading">
        <div className="mb-3 flex items-center gap-2">
          <Route className="h-4 w-4 text-[#0078D4]" aria-hidden />
          <h2 id="exit-heading" className="text-base font-semibold text-foreground">Criterios de salida</h2>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {FOUNDATION_ROUTE.exitCriteria.map((criterion) => (
            <p key={criterion} className="flex gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#107C10]" aria-hidden />
              <span>{criterion}</span>
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => onboarding.setNavigationMode(onboarding.navigationMode === "guided" ? "explore" : "guided")}>
            {onboarding.navigationMode === "guided" ? "Activar explorar libremente" : "Volver a modo guiado"}
          </Button>
          <Button type="button" variant="ghost" className="text-muted-foreground" onClick={onboarding.resetOnboarding}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Reiniciar solo onboarding
          </Button>
        </div>
      </section>
    </main>
  );
}

function WorkstationPreviewSection() {
  const onboarding = useOnboardingStore();
  const workstation = useWorkstationStore();
  const profile = workstation.profileOverride ?? recommendWorkstationProfile(onboarding.answers);
  const os = workstation.os ?? "windows";
  const nextRequirement = getNextWorkstationRequirement(profile, os, workstation.toolStates);
  const toolCount = getToolsForProfile(profile, os).length;

  return (
    <section
      aria-labelledby="workstation-preview-heading"
      className="rounded-xl border border-border bg-card p-5 shadow-fluent-1"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Wrench className="h-4 w-4 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
          </div>
          <div>
            <h2 id="workstation-preview-heading" className="text-base font-semibold text-foreground">
              {UI.workstation.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {nextRequirement
                ? `Siguiente requisito: ${nextRequirement.name}.`
                : `Requisitos obligatorios de tu perfil (${toolCount} herramientas en la matriz) verificados.`}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/preparar-entorno">
            {UI.nav.prepareEnvironment}
            <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function DiagnosticPanel() {
  const onboarding = useOnboardingStore();
  const [answers, setAnswers] = useState(onboarding.answers);

  function patch(patchAnswers: Partial<OnboardingAnswers>) {
    setAnswers((current) => ({ ...current, ...patchAnswers }));
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="diagnostic-heading">
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-[#0078D4]" aria-hidden />
        <h2 id="diagnostic-heading" className="text-lg font-semibold text-foreground">Diagnostico ligero</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChoiceGroup label="¿Has creado una app o automatizacion?" options={[["none", "No"], ["basic", "Algo basico"], ["unknown", "No se todavia"]]} value={answers.experience} onSelect={(v) => patch({ experience: v as OnboardingAnswers["experience"] })} />
        <ChoiceGroup label="¿Tienes tenant o entorno de practica?" options={[["yes", "Si"], ["no", "No"], ["unknown", "No se"]]} value={answers.tenant} onSelect={(v) => patch({ tenant: v as OnboardingAnswers["tenant"] })} />
        <ChoiceGroup label="¿Que prefieres por ahora?" options={[["build", "Construir"], ["configure", "Configurar"], ["unknown", "No se"]]} value={answers.preference} onSelect={(v) => patch({ preference: v as OnboardingAnswers["preference"] })} />
        <ChoiceGroup label="¿Para que estudias?" options={[["job", "Empleo"], ["work", "Trabajo actual"], ["explore", "Explorar"]]} value={answers.purpose} onSelect={(v) => patch({ purpose: v as OnboardingAnswers["purpose"] })} />
      </div>
      <Button
        className="mt-5 bg-[#0078D4] text-white hover:bg-[#106EBE]"
        onClick={() => {
          onboarding.completeDiagnostic(answers);
          onboarding.startOnboarding("desde-cero");
        }}
      >
        Recibir ruta recomendada
      </Button>
    </section>
  );
}

function ChoiceGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: [string, string][];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([optionValue, optionLabel]) => (
          <button
            key={optionValue}
            type="button"
            aria-pressed={value === optionValue}
            className={cn(
              "rounded-md border px-3 py-2 text-sm transition-colors",
              value === optionValue
                ? "border-[#0078D4] bg-[#EFF6FC] text-[#005A9E] dark:bg-[rgba(0,120,212,0.12)] dark:text-[#4DB8FF]"
                : "border-border bg-background text-muted-foreground hover:border-[#0078D4]/40"
            )}
            onClick={() => onSelect(optionValue)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function AvailabilitySelector({ value }: { value: WeeklyAvailability }) {
  const onboarding = useOnboardingStore();
  const options: WeeklyAvailability[] = ["2h", "5h", "8h"];
  return (
    <div className="flex flex-wrap gap-2" aria-label="Disponibilidad semanal">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onboarding.completeDiagnostic({ availability: option })}
          className={cn(
            "rounded-md border px-2.5 py-1.5 text-xs font-medium",
            value === option ? "border-[#107C10] bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)]" : "border-border text-muted-foreground"
          )}
        >
          {option}/semana
        </button>
      ))}
    </div>
  );
}

function labelRequirement(value: string): string {
  if (value === "required") return "Obligatorio";
  if (value === "recommended") return "Recomendado";
  if (value === "advanced") return "Avanzado";
  return "Opcional";
}

function pickRecommendedRoutes(routes: RouteSummary[], recommendedSlug: ProfessionalRouteSlug | "foundations"): RouteSummary[] {
  const primarySlug = recommendedSlug === "foundations" ? "maker" : recommendedSlug;
  const primary = routes.find((route) => route.slug === primarySlug);
  const fallback = ["consultor-funcional", "developer", "maker"]
    .flatMap((slug) => {
      const route = routes.find((candidate) => candidate.slug === slug);
      return route && route.slug !== primarySlug ? [route] : [];
    });
  return [primary, ...fallback].filter((route): route is RouteSummary => Boolean(route)).slice(0, 3);
}
