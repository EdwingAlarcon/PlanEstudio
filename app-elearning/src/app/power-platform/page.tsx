import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPowerPlatformHub } from "@/lib/domain-hubs";

export const metadata: Metadata = {
  title: "Power Platform",
  description: "Hub de Power Platform: fundamentos, Dataverse, Power Apps, Power Automate, Power Pages, ALM, gobernanza, developer y arquitectura.",
};

export default function PowerPlatformHubPage() {
  const hub = getPowerPlatformHub();

  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <section className="rounded-xl border border-border bg-card px-6 py-6 shadow-fluent-1">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: hub.accent }}>
            <Layers3 className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-0 text-white" style={{ background: hub.accent }}>Dominio</Badge>
              <Badge variant="outline">No agrega módulos</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{hub.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{hub.promise}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pp-flow-heading">
        <div className="mb-4">
          <h2 id="pp-flow-heading" className="text-base font-semibold text-foreground">
            Recorrido recomendado
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {hub.primarySteps.map((step, index) => (
            <div key={step.label} className="rounded-lg border border-border bg-card p-4 shadow-fluent-1">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: hub.accent + "1A" }}>
                  <span className="font-mono text-xs font-semibold" style={{ color: hub.accent }}>{String(index + 1).padStart(2, "0")}</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{step.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="pp-sections-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="pp-sections-heading" className="text-base font-semibold text-foreground">
              Contenido por área
            </h2>
            <p className="text-sm text-muted-foreground">Módulos y labs existentes agrupados por subdominio.</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={hub.roadmap.href}>
              Ver roadmap
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {hub.sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{section.description}</p>
              <div className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group block rounded-lg border border-border bg-muted/20 p-3 transition-colors hover:border-[#0078D4]/40 hover:bg-[#EFF6FC] dark:hover:bg-[rgba(0,120,212,0.14)]"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">{link.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-500/30 bg-amber-50 px-5 py-4 dark:bg-amber-500/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{hub.roadmap.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hub.roadmap.description}</p>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href={hub.roadmap.href}>
              Consultar
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
