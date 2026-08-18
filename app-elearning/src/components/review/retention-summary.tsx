"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/lib/review-store";
import { getReviewNow } from "@/lib/review-date";
import { getRetentionSummary } from "@/lib/review-queue";

/**
 * Embeddable retention block for /progreso — mirrors interactive-practice-summary.tsx.
 * Reads its own store; never touches academic progress, practice progress or
 * interactive-practice progress. No "% de conocimiento" — only observable counts.
 */
export function RetentionSummary() {
  const cards = useReviewStore((s) => s.cards);
  const summary = getRetentionSummary(cards, getReviewNow());
  const alDia = summary.total - summary.dueToday;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="retention-summary-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0078D4]/10">
            <Brain className="h-5 w-5 text-[#0078D4]" aria-hidden />
          </div>
          <div>
            <h2 id="retention-summary-heading" className="text-base font-semibold text-foreground">Retención</h2>
            <p className="text-xs text-muted-foreground">
              Lo que ya respondiste vuelve a aparecer para que compruebes si todavía lo recuerdas.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/repaso">Ir a repaso</Link>
        </Button>
      </div>

      {summary.total === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Completa tu primer quiz de módulo para empezar a construir tu calendario de repaso.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryMetric label="Tarjetas en repaso" value={summary.total} />
          <SummaryMetric label="Al día" value={alDia} />
          <SummaryMetric label="Pendientes hoy" value={summary.dueToday} />
          <SummaryMetric label="Necesitan refuerzo" value={summary.needsReinforcement} />
        </div>
      )}
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-center">
      <div className="text-xl font-bold tabular-nums text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
