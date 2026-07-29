"use client";

import Link from "next/link";
import { ArrowRight, Download, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/lib/progress";
import {
  calculatePracticeCounts,
  getRecommendedPractice,
  usePracticeProgressStore,
  type PracticeProgressRecord,
} from "@/lib/practice-progress";
import {
  PRACTICE_DOMAIN_LABELS,
  type PracticeDomain,
  type PracticeDifficulty,
  type PracticeRole,
  type PracticeType,
} from "@/lib/practice-meta";

export interface PracticeSummaryItem {
  id: string;
  slug: string;
  title: string;
  practiceType: PracticeType;
  domain: PracticeDomain;
  roles: PracticeRole[];
  difficulty: PracticeDifficulty;
  prerequisites: { modules: number[]; labs: string[] };
}

export function PracticeProgressSummary({
  practices,
  showReset = false,
}: {
  practices: PracticeSummaryItem[];
  showReset?: boolean;
}) {
  const records = usePracticeProgressStore((s) => s.records);
  const resetAll = usePracticeProgressStore((s) => s.resetAllPracticeProgress);
  const exportProgress = usePracticeProgressStore((s) => s.exportPracticeProgress);
  const completedModules = useProgressStore((s) => s.completedModules);
  const counts = calculatePracticeCounts(records);
  const recommendation = getRecommendedPractice(practices, records, completedModules);
  const last = getLastPractice(practices, records);

  function handleExport() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "planestudio-practice-progress.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    if (window.confirm("Esto reinicia solo el progreso práctico local. El progreso académico no se modifica.")) {
      resetAll();
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="practice-progress-heading">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="practice-progress-heading" className="text-base font-semibold text-foreground">Experiencia práctica</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Progreso local separado de módulos, quizzes y labs. No representa validación laboral externa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/experiencia-practica">Ver prácticas</Link>
          </Button>
          {showReset && (
            <>
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
                Exportar JSON
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden />
                Reiniciar prácticas
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Disponibles" value={practices.length} />
        <Metric label="Iniciadas" value={counts.started} />
        <Metric label="Intentadas" value={counts.attempted} />
        <Metric label="Revisadas" value={counts.reviewed} />
        <Metric label="Completadas" value={counts.completed} />
        <Metric label="Refuerzo" value={counts.needsReinforcement} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Última actividad</p>
          {last ? (
            <Link href={`/experiencia-practica/${last.slug}`} className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
              {last.title}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Sin prácticas iniciadas todavía.</p>
          )}
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Próxima recomendada</p>
          {recommendation ? (
            <>
              <Link href={`/experiencia-practica/${recommendation.slug}`} className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
                {recommendation.title}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">{recommendation.reason}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No hay prácticas disponibles.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function PracticeDomainProgress({ practices }: { practices: PracticeSummaryItem[] }) {
  const records = usePracticeProgressStore((s) => s.records);
  const domains = Object.entries(PRACTICE_DOMAIN_LABELS).map(([domain, label]) => {
    const domainPractices = practices.filter((practice) => practice.domain === domain);
    const domainRecords = domainPractices
      .map((practice) => records[practice.id])
      .filter((record): record is PracticeProgressRecord => Boolean(record));
    return {
      domain: domain as PracticeDomain,
      label,
      total: domainPractices.length,
      started: domainRecords.filter((record) => record.status !== "not_started").length,
      completed: domainRecords.filter((record) => record.status === "completed").length,
    };
  }).filter((row) => row.total > 0);

  const assessed = Object.values(records).filter((record) => record.selfAssessment);
  const average = assessed.length >= 2
    ? Math.round(assessed.reduce((sum, record) => sum + (record.selfAssessment?.score ?? 0), 0) / assessed.length)
    : null;
  const counts = calculatePracticeCounts(records);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="practice-domain-heading">
      <h2 id="practice-domain-heading" className="text-base font-semibold text-foreground">Experiencia práctica por dominio</h2>
      <div className="mt-3 grid gap-2">
        {domains.map((row) => (
          <div key={row.domain} className="rounded-lg border border-border bg-muted/15 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="text-xs text-muted-foreground">{row.started}/{row.total} iniciadas · {row.completed} completadas</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">Completadas sin pistas: {counts.completedWithoutHints}</Badge>
        <Badge variant="outline">Completadas con pistas: {counts.completedWithHints}</Badge>
        <Badge variant="outline">Autoevaluación media: {average === null ? "insuficiente" : `${average}%`}</Badge>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function getLastPractice(practices: PracticeSummaryItem[], records: Record<string, PracticeProgressRecord>) {
  const byId = new Map(practices.map((practice) => [practice.id, practice]));
  const record = Object.values(records)
    .filter((item) => item.lastActivityAt)
    .sort((a, b) => (b.lastActivityAt ?? "").localeCompare(a.lastActivityAt ?? ""))[0];
  return record ? byId.get(record.practiceId) : null;
}
