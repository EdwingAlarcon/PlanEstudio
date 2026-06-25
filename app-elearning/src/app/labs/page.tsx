import type { Metadata } from "next";
import Link from "next/link";
import { Clock, BookOpen, Award, ChevronRight, FlaskConical } from "lucide-react";
import { getAllLabs } from "@/lib/content";
import { LabCardStatus } from "@/components/labs/lab-card-status";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Laboratorios",
  description: "Laboratorios prácticos tipo Microsoft App in a Day para Power Platform y Dynamics 365.",
};

const LEVEL_CONFIG: Record<string, { label: string; bar: string; accent: string }> = {
  N1: { label: "Nivel 1 — Básico",      bar: "bg-[#107C10]",  accent: "#107C10" },
  N2: { label: "Nivel 2 — Intermedio",  bar: "bg-[#0078D4]",  accent: "#0078D4" },
  N3: { label: "Nivel 3 — Avanzado",    bar: "bg-orange-500", accent: "#EA580C" },
  N4: { label: "Nivel 4 — Arquitecto",  bar: "bg-[#D13438]",  accent: "#D13438" },
};

const CERT_VARIANT: Record<string, "basico" | "intermedio" | "avanzado" | "arquitecto" | "default"> = {
  "PL-900": "basico", "PL-200": "intermedio", "PL-400": "avanzado", "PL-600": "arquitecto",
};

export default function LabsPage() {
  const labs = getAllLabs();

  const byLevel = labs.reduce<Record<string, typeof labs>>((acc, lab) => {
    const key = lab.level || "otros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lab);
    return acc;
  }, {});

  const levelOrder = ["N1", "N2", "N3", "N4"];

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white dark:from-[rgba(0,120,212,0.08)] dark:to-background px-6 py-6 mb-8 shadow-fluent-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0078D4] shadow-fluent-2">
            <FlaskConical className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Laboratorios Prácticos</h1>
            <p className="text-xs text-muted-foreground">{labs.length} labs · Escenario SIT unificado</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          Guías paso a paso con escenario de empresa real (Servicios Integrados Tecnológicos S.A.),
          validaciones por tarea y retos adicionales — al estilo <strong>Microsoft App in a Day</strong>.
        </p>
      </div>

      {labs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No hay laboratorios disponibles todavía.</p>
        </div>
      )}

      {/* ── Labs grouped by level ────────────────────────────────────────── */}
      {levelOrder.map((levelKey) => {
        const levelLabs = byLevel[levelKey];
        if (!levelLabs || levelLabs.length === 0) return null;
        const cfg = LEVEL_CONFIG[levelKey] ?? { label: levelKey, bar: "bg-slate-400", accent: "#64748B" };

        return (
          <section key={levelKey} className="mb-10">
            {/* Section label with accent bar */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`h-5 w-1 rounded-full ${cfg.bar}`} aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">{cfg.label}</h2>
              <span className="text-xs text-muted-foreground">({levelLabs.length})</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {levelLabs.map((lab) => (
                <Link key={lab.slug} href={`/labs/${lab.slug}`} className="group">
                  <div className="relative h-full rounded-xl border border-border bg-card px-4 py-4 shadow-fluent-1 group-hover:shadow-fluent-4 group-hover:border-[#0078D4]/30 dark:group-hover:border-[#4DB8FF]/30 transition-all duration-200">

                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF] transition-colors line-clamp-2">
                        {lab.title}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        <LabCardStatus slug={lab.slug} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF] transition-colors" />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {lab.certifications.map((cert) => (
                        <Badge key={cert} variant={CERT_VARIANT[cert] ?? "default"} className="text-[10px] px-1.5 py-0 h-4">
                          {cert}
                        </Badge>
                      ))}
                      {lab.products.slice(0, 2).map((product) => (
                        <Badge key={product} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                          {product}
                        </Badge>
                      ))}
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {lab.duration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden />
                          {lab.duration} min
                        </span>
                      )}
                      {lab.role.length > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" aria-hidden />
                          {lab.role[0]}
                        </span>
                      )}
                      {lab.certifications.length > 0 && (
                        <span className="flex items-center gap-1 ml-auto">
                          <Award className="h-3 w-3" aria-hidden />
                          {lab.certifications[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
