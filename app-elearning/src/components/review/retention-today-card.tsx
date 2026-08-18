"use client";

import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/lib/review-store";
import { getReviewNow } from "@/lib/review-date";
import { getRetentionSummary } from "@/lib/review-queue";

const MINUTES_PER_QUESTION = 0.4; // ~24s/pregunta — misma orden de magnitud que "~8 min" para 12-20 preguntas

/**
 * Discrete "Repaso de hoy" CTA for Home and Mi ruta. Never competes visually
 * with "Continuar ruta" — jerarquía: Continuar ruta → Repaso → Prácticas (§32-33).
 * Renders nothing once there are no cards at all yet, to avoid manufacturing
 * an empty-state prompt for a student who hasn't answered a single question.
 */
export function RetentionTodayCard() {
  const cards = useReviewStore((s) => s.cards);
  const summary = getRetentionSummary(cards, getReviewNow());

  if (summary.total === 0) return null;

  const minutes = Math.max(1, Math.round(summary.dueToday * MINUTES_PER_QUESTION));

  return (
    <section
      aria-labelledby="retention-today-heading"
      className="rounded-xl border border-border bg-card p-5 shadow-fluent-1"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0078D4]/10">
            <Brain className="h-5 w-5 text-[#0078D4]" aria-hidden />
          </div>
          <div>
            <h2 id="retention-today-heading" className="text-base font-semibold text-foreground">Repaso de hoy</h2>
            {summary.dueToday > 0 ? (
              <p className="text-sm text-muted-foreground">
                {summary.dueToday} pregunta{summary.dueToday === 1 ? "" : "s"} pendiente{summary.dueToday === 1 ? "" : "s"} · ~{minutes} min
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Estás al día con tu repaso.</p>
            )}
          </div>
        </div>
        <Button asChild size="sm" variant={summary.dueToday > 0 ? "default" : "outline"}>
          <Link href="/repaso">
            {summary.dueToday > 0 ? "Repasar ahora" : "Ver repaso"}
            <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
