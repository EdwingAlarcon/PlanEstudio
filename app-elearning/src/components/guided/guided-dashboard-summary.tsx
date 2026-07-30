"use client";

import Link from "next/link";
import { ArrowRight, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FOUNDATION_ROUTE, buildWeeklyPlan, getFoundationProgress, getNextBestAction } from "@/lib/guided-journey";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useProgressStore } from "@/lib/progress";

export function GuidedDashboardSummary() {
  const onboarding = useOnboardingStore();
  const completedModules = useProgressStore((s) => s.completedModules);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const progress = getFoundationProgress(completedModules, completedLabs, onboarding);
  const nextAction = getNextBestAction(completedModules, completedLabs, onboarding);
  const weeklyPlan = buildWeeklyPlan(onboarding.answers.availability, nextAction);

  return (
    <section className="rounded-xl border border-[#0078D4]/20 bg-[#EFF6FC] p-5 shadow-fluent-1 dark:border-[#4DB8FF]/20 dark:bg-[rgba(0,120,212,0.10)]" aria-labelledby="next-dashboard-heading">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
            <h2 id="next-dashboard-heading" className="text-xl font-semibold text-foreground">¿Que debo hacer ahora?</h2>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0078D4] dark:text-[#4DB8FF]">
              {FOUNDATION_ROUTE.title}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">{nextAction.activity.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{nextAction.reason}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {nextAction.time}
            </span>
            <span>{progress.completed}/{progress.total} actividades de fundamentos</span>
          </div>
          <Button asChild className="bg-[#0078D4] text-white hover:bg-[#106EBE]">
            <Link href={nextAction.activity.href} onClick={() => onboarding.setCurrentActivity(nextAction.activity.id)}>
              {nextAction.cta}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="w-full rounded-lg border border-border bg-card p-4 md:w-72">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Ruta activa</span>
            <span className="text-[#0078D4] dark:text-[#4DB8FF]">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            {weeklyPlan.slice(0, 3).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
