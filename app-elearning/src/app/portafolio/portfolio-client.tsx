"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, Circle, Route } from "lucide-react";
import { useProgressStore } from "@/lib/progress";
import type { ProfessionalRouteSlug } from "@/lib/professional-routes";
import { cn } from "@/lib/utils";

export interface PortfolioRouteData {
  slug: ProfessionalRouteSlug;
  title: string;
  accent: string;
  capstoneTitle: string;
  capstoneDisplayId?: string;
  capstoneHref: string;
  capstoneLabSlug?: string;
  capstoneModuleFullId?: string;
  portfolioEvidence: string[];
}

export function PortfolioClient({ routes }: { routes: PortfolioRouteData[] }) {
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const completedModules = useProgressStore((s) => s.completedModules);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-5 w-5 text-[#0078D4]" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Portafolio profesional</h1>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Un capstone completado dentro de la plataforma no es lo mismo que un portafolio
          mostrable. Esta página resume, por ruta, qué evidencia reunir a partir de tu capstone.
          Lee la{" "}
          <Link href="/recursos/portafolio-profesional" className="text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
            guía completa
          </Link>{" "}
          para la estructura sugerida de repositorio y las preguntas de retrospectiva.
        </p>
      </div>

      <div className="space-y-4">
        {routes.map((route) => {
          const capstoneDone = route.capstoneLabSlug
            ? completedLabs.includes(route.capstoneLabSlug)
            : route.capstoneModuleFullId
            ? completedModules.includes(route.capstoneModuleFullId)
            : false;

          return (
            <section
              key={route.slug}
              className="rounded-xl border border-border bg-card p-5 shadow-fluent-1"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: route.accent }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-foreground">{route.title}</h2>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        capstoneDone
                          ? "bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)] dark:text-[#2DB52D]"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {capstoneDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <Circle className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {capstoneDone ? "Capstone completado" : "Capstone pendiente"}
                    </span>
                  </div>

                  <Link
                    href={route.capstoneHref}
                    className="group flex items-center gap-2 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
                  >
                    {route.capstoneDisplayId ? `${route.capstoneDisplayId} · ` : ""}{route.capstoneTitle}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>

                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Reúne para tu portafolio
                    </p>
                    <ul className="space-y-1">
                      {route.portfolioEvidence.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-5">
        <div className="flex items-start gap-3">
          <Route className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-foreground">
              ¿Buscas Contact Center, Sales Operations o F&amp;O real?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Esas especializaciones todavía no tienen capstone ni evidencia aquí — están
              declaradas como plan, no como brecha oculta.
            </p>
            <Link
              href="/recursos/roadmap-especializacion-avanzada"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
            >
              Ver Roadmap de Especialización Avanzada
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
