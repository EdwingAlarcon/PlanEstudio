import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitBranch, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";
import { FOUNDATION_ACTIVITIES } from "@/lib/guided-journey";

export const metadata: Metadata = {
  title: "Mapa curricular",
  description: "Visualizacion consultiva del curriculo completo con fundamentos, roles y especializaciones.",
};

const LEGEND = [
  ["Comun", "bg-[#107C10]"],
  ["Rol", "bg-[#0078D4]"],
  ["Especializacion", "bg-[#0D9488]"],
  ["Practica", "bg-orange-500"],
  ["Opcional", "bg-muted-foreground"],
];

export default function CurriculumMapPage() {
  const routes = getAllProfessionalRoutes();

  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <section className="rounded-xl border border-border bg-card p-6 shadow-fluent-1">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0078D4]">
            <GitBranch className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div className="space-y-2">
            <Badge className="border-0 bg-[#0078D4] text-white">Mapa consultivo</Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Mapa curricular completo</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Fundamentos son comunes. Luego se separan rutas por rol y especializaciones transversales.
              No necesitas completar todo para avanzar con una ruta.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="legend-heading">
        <h2 id="legend-heading" className="mb-3 text-base font-semibold text-foreground">Leyenda</h2>
        <div className="flex flex-wrap gap-3">
          {LEGEND.map(([label, color]) => (
            <span key={label} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]" aria-label="Mapa de progresion">
        <div className="rounded-xl border-2 border-[#107C10]/30 bg-card p-5 shadow-fluent-1">
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-[#107C10]" aria-hidden />
            <h2 className="text-base font-semibold text-foreground">Fundamentos comunes</h2>
          </div>
          <ol className="space-y-2">
            {FOUNDATION_ACTIVITIES.map((activity) => (
              <li key={activity.id} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Paso {activity.step}.</span> {activity.title}
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {routes.map((route) => (
              <Link key={route.slug} href={`/rutas/${route.slug}`} className="group rounded-xl border border-border bg-card p-4 shadow-fluent-1 transition-colors hover:border-[#0078D4]/40">
                <span className="mb-3 block h-1.5 w-10 rounded-full" style={{ backgroundColor: route.accent }} aria-hidden />
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">{route.title}</h3>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{route.level} · {route.modules.length} modulos · {route.labs.length} labs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
        <h2 className="text-base font-semibold text-foreground">Lectura recomendada del mapa</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Guided Lab precede Semi-Guided Lab, luego Challenge, Incident y Work Simulation.
          Los incidentes complejos son vista previa para despues de los fundamentos asociados.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/mi-ruta">Volver a Mi ruta</Link>
        </Button>
      </section>
    </main>
  );
}
