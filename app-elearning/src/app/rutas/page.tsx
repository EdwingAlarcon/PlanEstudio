import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllProfessionalRoutes } from "@/lib/professional-routes";

export const metadata: Metadata = {
  title: "Rutas profesionales",
  description: "Rutas por rol profesional para estudiar Power Platform y Dynamics 365 sin duplicar contenido.",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Disponible: "default",
  Parcial: "secondary",
  "Especialización en construcción": "outline",
  "Avanzado — especializaciones en expansión": "secondary",
  "Awareness avanzado — práctica en roadmap": "outline",
};

// Badge real estate is tight at narrow viewports (single-column cards from 360px).
// The full status string carries the honest detail and stays in gapNote/docs;
// the badge only needs a short label that won't wrap awkwardly next to the title.
const STATUS_SHORT_LABEL: Record<string, string> = {
  "Especialización en construcción": "En construcción",
  "Avanzado — especializaciones en expansión": "Avanzado — en expansión",
  "Awareness avanzado — práctica en roadmap": "Awareness avanzado",
};

export default function ProfessionalRoutesPage() {
  const routes = getAllProfessionalRoutes();

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white dark:from-[rgba(0,120,212,0.08)] dark:to-background px-6 py-6 shadow-fluent-1">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0078D4] shadow-fluent-2">
            <Route className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Rutas profesionales</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Elige una ruta según el rol que quieres desempeñar. Cada ruta reutiliza módulos y laboratorios existentes,
              muestra la cobertura disponible y evita repetir contenido solo para inflar el plan.
            </p>
          </div>
        </div>
      </div>

      <section aria-labelledby="routes-heading">
        <h2 id="routes-heading" className="sr-only">Listado de rutas profesionales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.slug}
              href={`/rutas/${route.slug}`}
              className="group rounded-xl border border-border bg-card p-5 shadow-fluent-1 transition-all duration-200 hover:border-[#0078D4]/30 hover:shadow-fluent-4 dark:hover:border-[#4DB8FF]/30"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-10 w-1.5 rounded-full"
                    style={{ backgroundColor: route.accent }}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">
                      {route.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{route.level}</p>
                  </div>
                </div>
                <Badge
                  variant={STATUS_VARIANT[route.status] ?? "default"}
                  className="shrink-0 whitespace-nowrap text-[10px]"
                  title={route.status}
                >
                  {STATUS_SHORT_LABEL[route.status] ?? route.status}
                </Badge>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{route.summary}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  {route.modules.length} módulos
                </span>
                <span className="flex items-center gap-1">
                  <FlaskConical className="h-3.5 w-3.5" aria-hidden />
                  {route.labs.length} labs
                </span>
                <span className="ml-auto flex items-center gap-1 font-medium text-[#0078D4] dark:text-[#4DB8FF]">
                  Ver ruta
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
