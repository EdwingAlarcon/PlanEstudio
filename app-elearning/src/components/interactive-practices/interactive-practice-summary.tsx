"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  INTERACTIVE_DOMAIN_LABELS,
  getRecommendedInteractivePractice,
  type InteractivePractice,
} from "@/lib/interactive-practices";
import {
  summarizeInteractivePracticeProgress,
  useInteractivePracticeProgressStore,
} from "@/lib/interactive-practice-progress";
import { useProgressStore } from "@/lib/progress";

export function InteractivePracticeSummary({ practices, showReset = false }: { practices: InteractivePractice[]; showReset?: boolean }) {
  const records = useInteractivePracticeProgressStore((s) => s.records);
  const resetAll = useInteractivePracticeProgressStore((s) => s.resetAllInteractivePractices);
  const completedModules = useProgressStore((s) => s.completedModules);
  const summary = summarizeInteractivePracticeProgress(records, practices.map((practice) => practice.id));
  const recommended = getRecommendedInteractivePractice(records, completedModules);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="interactive-summary-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-[#0078D4]" aria-hidden />
            <h2 id="interactive-summary-heading" className="text-lg font-semibold text-foreground">Práctica interactiva</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {practices.length} ejercicios piloto con feedback inmediato, mastery independiente y fixtures locales.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {showReset && (
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={resetAll}>
              <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden />
              Reiniciar
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/practica">
              Abrir banco
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <SummaryMetric label="Completadas" value={`${summary.completed}/${summary.total}`} />
        <SummaryMetric label="Dominadas" value={summary.proficient.toString()} />
        <SummaryMetric label="Para repasar" value={summary.needsReview.toString()} />
        <SummaryMetric label="Intentos" value={summary.attempts.toString()} />
      </div>
      <Progress value={summary.percentage} className="mt-4 h-2" />
      {recommended && (
        <Link
          href={`/practica/${recommended.slug}`}
          className="mt-4 flex flex-col gap-3 rounded-lg border border-[#107C10]/25 bg-[#EFF8EE] p-3 text-sm transition-colors hover:border-[#107C10]/50 dark:bg-[rgba(16,124,16,0.10)] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="mb-1 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#107C10]" aria-hidden />
              <span className="font-semibold text-foreground">Siguiente micro-práctica</span>
              <Badge variant="outline" className="bg-background text-[10px]">{INTERACTIVE_DOMAIN_LABELS[recommended.domain]}</Badge>
            </span>
            <span className="block text-muted-foreground">{recommended.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#107C10]" aria-hidden />
        </Link>
      )}
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
