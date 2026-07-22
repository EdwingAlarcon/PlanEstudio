"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, Circle, MessageSquare, Route } from "lucide-react";
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

export interface PortfolioProfileData {
  slug: string;
  title: string;
  accent: string;
  summary: string;
  routeLinks: { title: string; href: string }[];
  jobReadyLabs: { slug: string; displayId: string; title: string; href: string }[];
  minimumEvidence: string[];
  jobReadyGuideHref: string;
  interviewHref: string;
}

type ViewMode = "ruta" | "perfil";

export function PortfolioClient({ routes, profiles }: { routes: PortfolioRouteData[]; profiles: PortfolioProfileData[] }) {
  const [view, setView] = useState<ViewMode>("ruta");
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
          mostrable. Esta página resume qué evidencia reunir a partir de tu capstone, por ruta o
          por perfil laboral. Lee la{" "}
          <Link href="/recursos/portafolio-profesional" className="text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
            guía completa
          </Link>{" "}
          para la estructura sugerida de repositorio y las preguntas de retrospectiva.
        </p>
      </div>

      <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1" role="tablist" aria-label="Vista de portafolio">
        <button
          type="button"
          role="tab"
          aria-selected={view === "ruta"}
          onClick={() => setView("ruta")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "ruta" ? "bg-card text-foreground shadow-fluent-1" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Por ruta
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "perfil"}
          onClick={() => setView("perfil")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "perfil" ? "bg-card text-foreground shadow-fluent-1" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Por perfil laboral
        </button>
      </div>

      {view === "ruta" ? (
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
                      {capstoneDone ? "Capstone completado" : "Pendiente en tu progreso"}
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
      ) : (
      <div className="space-y-4">
        {profiles.map((profile) => (
          <section key={profile.slug} className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
            <div className="flex items-start gap-3">
              <span
                className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: profile.accent }}
                aria-hidden
              />
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">{profile.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{profile.summary}</p>
                </div>

                {profile.routeLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.routeLinks.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-foreground hover:border-[#0078D4]/40 hover:text-[#0078D4] dark:hover:text-[#4DB8FF]"
                      >
                        <Route className="h-3 w-3" aria-hidden />
                        {route.title}
                      </Link>
                    ))}
                  </div>
                )}

                {profile.jobReadyLabs.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Labs Job-Ready
                    </p>
                    <ul className="space-y-1.5">
                      {profile.jobReadyLabs.map((lab) => {
                        const done = completedLabs.includes(lab.slug);
                        return (
                          <li key={lab.slug}>
                            <Link
                              href={lab.href}
                              className="group flex items-center gap-2 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
                            >
                              {done ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#107C10] dark:text-[#2DB52D]" aria-hidden />
                              ) : (
                                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                              )}
                              {lab.displayId} · {lab.title}
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Evidencia mínima para una vacante
                  </p>
                  <ul className="space-y-1">
                    {profile.minimumEvidence.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={profile.jobReadyGuideHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
                  >
                    Guía Job-Ready completa
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  <Link
                    href={profile.interviewHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
                  >
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                    Preparar entrevista
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      )}

      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-5">
        <div className="flex items-start gap-3">
          <Route className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-foreground">
              ¿Buscas Contact Center, Sales Operations o F&amp;O en producción real?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ya existe evidencia como simulación, walkthrough o sandbox de trial para estas tres
              áreas (Contact Center Chat, forecasting/pipeline review y hands-on F&amp;O). Lo que
              todavía no cubre esta plataforma es la operación enterprise real: tenant productivo,
              licencias, datos de producción y usuarios reales. Esa capa queda declarada como
              roadmap, no como brecha oculta.
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
