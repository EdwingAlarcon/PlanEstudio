import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ClipboardCheck, FileWarning, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PracticesClient } from "@/components/practices/practices-client";
import { PracticeProgressSummary } from "@/components/practices/practice-progress-summary";
import { getAllLabs, getAllModules } from "@/lib/content";
import { getAllPractices, getPracticeCompetencyMatrix, getPracticeCounts } from "@/lib/practices";

export const metadata: Metadata = {
  title: "Experiencia práctica",
  description: "Framework de práctica profesional: incidentes, challenges y simulaciones laborales para Power Platform y Dynamics 365.",
};

export default function PracticalExperiencePage() {
  const practices = getAllPractices();
  const counts = getPracticeCounts();
  const matrix = getPracticeCompetencyMatrix();
  const practiceSummary = practices.map(({ id, slug, title, practiceType, domain, roles, difficulty, prerequisites }) => ({
    id, slug, title, practiceType, domain, roles, difficulty, prerequisites,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white px-6 py-7 shadow-fluent-1 dark:from-[rgba(0,120,212,0.08)] dark:to-background">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0078D4] shadow-fluent-2">
            <Activity className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-0 bg-[#0078D4] text-white">Piloto profesional</Badge>
              <Badge variant="outline">{counts.incidents} incidentes</Badge>
              <Badge variant="outline">{counts.challenges} challenges</Badge>
              <Badge variant="outline">{counts.simulations} {counts.simulations === 1 ? "simulación" : "simulaciones"}</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Experiencia práctica</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Capa transversal para entrenar análisis, configuración, desarrollo, despliegue, diagnóstico,
                documentación y defensa de decisiones. Complementa los {getAllModules().length} módulos y {getAllLabs().length} labs existentes sin reclasificarlos como experiencia laboral formal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Conteos de experiencia práctica">
        <Metric icon={GraduationCap} label="Módulos existentes" value={getAllModules().length} />
        <Metric icon={ClipboardCheck} label="Labs existentes" value={getAllLabs().length} />
        <Metric icon={FileWarning} label="Prácticas piloto" value={practices.length} />
      </section>

      <PracticeProgressSummary practices={practiceSummary} />

      <PracticesClient practices={practices} />

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="competency-heading">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="competency-heading" className="text-base font-semibold text-foreground">Matriz de competencias prácticas</h2>
            <p className="mt-1 text-xs text-muted-foreground">Cobertura honesta del piloto frente a competencias laborales.</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/recursos/marco-practicas-profesionales">Ver marco</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-3 font-medium">Competencia</th>
                <th className="py-2 pr-3 font-medium">Módulo</th>
                <th className="py-2 pr-3 font-medium">Lab</th>
                <th className="py-2 pr-3 font-medium">Estado</th>
                <th className="py-2 pr-3 font-medium">Brecha</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.competency} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium text-foreground">{row.competency}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.prerequisiteModule}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.relatedLab}</td>
                  <td className="py-2 pr-3">
                    <Badge variant={row.coverageState === "partial" ? "outline" : "secondary"}>{row.coverageState}</Badge>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof GraduationCap; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
