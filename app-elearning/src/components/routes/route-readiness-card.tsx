"use client";

import { BarChart3 } from "lucide-react";
import { useProgressStore } from "@/lib/progress";
import { computeRouteReadiness, type RouteReadinessTargets } from "@/lib/route-readiness-types";

/**
 * Progreso de ESTA ruta, no un porcentaje global — cada ruta tiene sus propios
 * módulos/labs/capstone y no penaliza por no avanzar en otras rutas.
 *
 * `targets` se resuelve en el Server Component (`getRouteReadinessTargets`, que lee `content.ts`
 * con `fs`) y se pasa ya plano/serializable — este componente no importa `content.ts`.
 */
export function RouteReadinessCard({ targets }: { targets: RouteReadinessTargets }) {
  const isModuleComplete = useProgressStore((s) => s.isModuleComplete);
  const isLabComplete = useProgressStore((s) => s.isLabComplete);
  const readiness = computeRouteReadiness(targets, isModuleComplete, isLabComplete);

  const modulePct = readiness.totalModules > 0 ? Math.round((readiness.completedModules / readiness.totalModules) * 100) : 0;
  const labPct = readiness.totalLabs > 0 ? Math.round((readiness.completedLabs / readiness.totalLabs) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-[#6B4EFF]" aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">Tu progreso en esta ruta</h2>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Módulos</span>
            <span>{readiness.completedModules}/{readiness.totalModules}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[#0078D4]" style={{ width: `${modulePct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Laboratorios</span>
            <span>{readiness.completedLabs}/{readiness.totalLabs}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[#107C10]" style={{ width: `${labPct}%` }} />
          </div>
        </div>
        {readiness.hasCapstone && (
          <p className="text-xs text-muted-foreground">
            Proyecto final: {readiness.capstoneDone ? "✅ completado" : "pendiente"}
          </p>
        )}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Este progreso es solo de esta ruta — no afecta ni depende de tu avance en otras rutas.
      </p>
    </div>
  );
}
