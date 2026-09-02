import { ClipboardCheck } from "lucide-react";
import type { LabReadiness } from "@/lib/lab-metadata";

const STATUS_DOT: Record<LabReadiness["executionStatus"], string> = {
  "tenant-real": "bg-[#107C10]",
  "tenant-opcional": "bg-[#0078D4]",
  simulado: "bg-purple-600",
  "no-verificado-en-tenant": "bg-amber-500",
};

interface LabReadinessPanelProps {
  readiness: LabReadiness;
}

export function LabReadinessPanel({ readiness }: LabReadinessPanelProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Producto / licencia", value: readiness.product },
    { label: "Rol requerido", value: readiness.role },
    { label: "Ambiente requerido", value: readiness.environment },
    { label: "Datos requeridos", value: readiness.data },
    { label: "Evidencia mínima", value: readiness.evidence },
  ];

  return (
    <section
      aria-labelledby="lab-readiness-heading"
      className="rounded-xl border border-border bg-card px-6 py-5 shadow-fluent-1"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0078D4]/10">
          <ClipboardCheck className="h-5 w-5 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="lab-readiness-heading" className="text-base font-semibold text-foreground">
              Antes de empezar
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[readiness.executionStatus]}`} aria-hidden />
              {readiness.executionStatusLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{readiness.executionStatusNote}</p>

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold text-foreground">{row.label}</dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
