import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FlaskConical, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllLabs, getAllModules } from "@/lib/content";
import { getAllProfessionalRoutes, getProfessionalRouteBySlug } from "@/lib/professional-routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProfessionalRoutes().map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getProfessionalRouteBySlug(slug);
  if (!route) return {};
  return {
    title: route.title,
    description: route.summary,
  };
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Disponible: "default",
  Parcial: "secondary",
  "Cobertura en expansión": "outline",
};

export default async function ProfessionalRouteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getProfessionalRouteBySlug(slug);
  if (!route) notFound();

  const modulesById = new Map(getAllModules().map((module) => [module.moduleId, module]));
  const labsBySlug = new Map(getAllLabs().map((lab) => [lab.slug, lab]));
  const modules = route.modules.map((moduleId) => modulesById.get(moduleId)).filter(Boolean);
  const labs = route.labs.map((labSlug) => labsBySlug.get(labSlug)).filter(Boolean);
  const nextRoute = route.nextRouteSlug ? getProfessionalRouteBySlug(route.nextRouteSlug) : undefined;

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <Button asChild variant="ghost" size="sm" className="px-0 -ml-1 text-muted-foreground hover:text-foreground">
        <Link href="/rutas">
          <ArrowLeft className="h-4 w-4 mr-1" aria-hidden />
          Todas las rutas
        </Link>
      </Button>

      <div className="rounded-xl border border-border bg-card px-6 py-6 shadow-fluent-1">
        <div className="flex items-start gap-4">
          <span className="mt-1 h-14 w-1.5 rounded-full" style={{ backgroundColor: route.accent }} aria-hidden />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={STATUS_VARIANT[route.status] ?? "default"}>{route.status}</Badge>
              <Badge variant="outline">{route.level}</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{route.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{route.role}</p>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{route.summary}</p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-[1fr_1.2fr]" aria-label="Resultado y competencias">
        <div className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-[#0078D4]" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Resultado esperado</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{route.outcome}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#107C10]" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Competencias</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {route.competencies.map((competency) => (
              <Badge key={competency} variant="outline" className="text-xs">
                {competency}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="route-modules-heading">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#0078D4]" aria-hidden />
          <h2 id="route-modules-heading" className="text-base font-semibold text-foreground">
            Módulos recomendados
          </h2>
          <span className="text-xs text-muted-foreground">({modules.length})</span>
        </div>

        <div className="space-y-2">
          {modules.map((module) => module && (
            <Link
              key={module.id}
              href={`/nivel/${module.levelId}/modulo/${module.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 shadow-fluent-1 transition-all duration-150 hover:border-[#0078D4]/30 hover:shadow-fluent-2 dark:hover:border-[#4DB8FF]/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-xs font-bold text-muted-foreground">
                {String(module.moduleId).padStart(2, "0")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">
                  {module.title}
                </p>
                <p className="text-xs text-muted-foreground">Nivel {module.levelId}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {labs.length > 0 && (
        <section aria-labelledby="route-labs-heading">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-[#107C10]" aria-hidden />
            <h2 id="route-labs-heading" className="text-base font-semibold text-foreground">
              Laboratorios vinculados
            </h2>
            <span className="text-xs text-muted-foreground">({labs.length})</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {labs.map((lab) => lab && (
              <Link
                key={lab.slug}
                href={`/labs/${lab.slug}`}
                className="group rounded-xl border border-border bg-card p-4 shadow-fluent-1 transition-all duration-150 hover:border-[#107C10]/30 hover:shadow-fluent-2"
              >
                <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-[#107C10]">
                  {lab.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {lab.level} · {lab.duration} min
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {nextRoute && (
        <section aria-labelledby="next-route-heading" className="rounded-xl border border-[#0078D4]/20 bg-[#EFF6FC] p-5 shadow-fluent-1 dark:border-[#4DB8FF]/20 dark:bg-[rgba(0,120,212,0.10)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0078D4] dark:text-[#4DB8FF]">
                Siguiente ruta recomendada
              </p>
              <h2 id="next-route-heading" className="text-base font-semibold text-foreground">
                {nextRoute.title}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Continúa con esta ruta para ampliar el rol sin repetir contenidos que ya cubriste.
              </p>
            </div>
            <Button asChild className="w-full shrink-0 bg-[#0078D4] text-white hover:bg-[#106EBE] sm:w-auto">
              <Link href={`/rutas/${nextRoute.slug}`}>
                Ver siguiente ruta
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
