"use client";

import { useInteractivePracticeProgressStore } from "@/lib/interactive-practice-progress";
import { isPracticeEarned } from "@/lib/xp";

// Dominio por área (perfil de "El camino jugable"): qué parte de las prácticas interactivas de cada área completaste
// sin ver la solución, con el mismo criterio que la XP. Recibe solo ids agrupados por área, nunca el catálogo.
export interface DomainMasteryArea {
  key: string;
  label: string;
  ids: string[];
}

export function DomainMasteryCard({ areas }: { areas: DomainMasteryArea[] }) {
  const records = useInteractivePracticeProgressStore((s) => s.records);
  const rows = areas
    .map((area) => {
      const earned = area.ids.filter((id) => isPracticeEarned(records[id])).length;
      return { ...area, earned, percentage: area.ids.length ? Math.round((earned / area.ids.length) * 100) : 0 };
    })
    .sort((a, b) => b.percentage - a.percentage || b.ids.length - a.ids.length);

  return (
    <div className="space-y-2" data-testid="domain-mastery">
      <h3 className="text-sm font-semibold text-foreground">Dominio por área</h3>
      <p className="text-xs text-muted-foreground">Prácticas interactivas completadas sin ver la solución, por área.</p>
      <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.key} className="text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {row.earned}/{row.ids.length}
              </span>
            </div>
            <div
              className="mt-1 h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${row.label}: ${row.percentage} %`}
              aria-valuenow={row.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-[#0078D4] dark:bg-[#4DB8FF]" style={{ width: `${row.percentage}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
