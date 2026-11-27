"use client";

import { useXp } from "@/components/guided/use-xp";
import { formatXp, RANKS, XP_RULES } from "@/lib/xp";

// Desglose transparente de la XP en /progreso: de dónde sale cada punto y cuánto falta.
export function XpRankCard() {
  const { xp, rank } = useXp();
  const rows = [
    { label: "Prácticas interactivas", detail: `${xp.counts.practices} completadas sin ver la solución · ${XP_RULES.practice} XP c/u`, value: xp.practices },
    { label: "Quizzes de módulo", detail: `${xp.counts.quizzes} con ${XP_RULES.quizPassPercentage} % o más · ${XP_RULES.quiz} XP c/u`, value: xp.quizzes },
    { label: "Labs", detail: `${xp.counts.labs} marcados como completados · ${XP_RULES.lab} XP c/u (autodeclarado; con evidencia valdrá más)`, value: xp.labs },
    { label: "Repaso espaciado", detail: `${xp.counts.reviewCorrect} respuestas correctas · ${XP_RULES.reviewCorrect} XP c/u`, value: xp.review },
  ];

  return (
    <section id="xp" aria-labelledby="xp-heading" className="scroll-mt-20 space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 id="xp-heading" className="text-lg font-semibold text-foreground">{rank.label}</h2>
          <p className="text-sm text-muted-foreground">
            {rank.nextLabel
              ? `${formatXp((rank.next ?? 0) - xp.total)} XP para ${rank.nextLabel}.`
              : "Rango máximo alcanzado."}{" "}
            Leer o marcar un módulo como completado no da XP: se gana con evidencia.
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400" data-testid="xp-total">
          {formatXp(xp.total)} XP
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full rounded-full bg-[#0078D4] dark:bg-[#4DB8FF]" style={{ width: `${rank.percentage}%` }} />
      </div>
      <dl className="divide-y divide-border text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="min-w-0">
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="block text-xs text-muted-foreground">{row.detail}</span>
            </dt>
            <dd className="shrink-0 tabular-nums text-foreground">{formatXp(row.value)}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">
        Rangos: {RANKS.map((r) => `${r.name} (${formatXp(r.thresholds[0])})`).join(" → ")}; cada uno con grados I, II y III.
      </p>
    </section>
  );
}
