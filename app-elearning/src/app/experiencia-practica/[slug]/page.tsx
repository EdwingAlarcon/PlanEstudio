import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, ShieldCheck, Wrench } from "lucide-react";
import { getAllPractices, getPracticeBySlug, PRACTICE_DIFFICULTY_LABELS, PRACTICE_DOMAIN_LABELS, PRACTICE_ROLE_LABELS, PRACTICE_TYPE_LABELS } from "@/lib/practices";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { PracticeWorkspaceClient } from "@/components/practices/practice-workspace-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPractices().map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) return { title: "Práctica no encontrada" };
  return {
    title: `${practice.id} · ${practice.title}`,
    description: `${PRACTICE_TYPE_LABELS[practice.practiceType]} para entrenamiento profesional: ${practice.title}.`,
  };
}

export default async function PracticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) notFound();
  const { bodyContent, solutionContent } = splitSolution(practice.rawContent);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <Button asChild variant="ghost" size="sm" className="-ml-1 px-0 text-muted-foreground hover:text-foreground">
        <Link href="/experiencia-practica">
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
          Experiencia práctica
        </Link>
      </Button>

      <header className="rounded-xl border border-border bg-card px-6 py-5 shadow-fluent-1">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge variant={practice.practiceType === "incident" ? "destructive" : practice.practiceType === "challenge" ? "avanzado" : "arquitecto"} className="font-mono">
            {practice.id}
          </Badge>
          <Badge variant="outline">{PRACTICE_TYPE_LABELS[practice.practiceType]}</Badge>
          <Badge variant="outline">{PRACTICE_DIFFICULTY_LABELS[practice.difficulty]}</Badge>
          <Badge variant="outline">{PRACTICE_DOMAIN_LABELS[practice.domain]}</Badge>
        </div>
        <h1 className="text-2xl font-bold leading-snug text-foreground">{practice.title}</h1>
        <div className="mt-4 grid gap-3 rounded-lg border border-border bg-muted/25 p-3 text-xs text-muted-foreground sm:grid-cols-3">
          <div>
            <p className="mb-1 font-semibold text-foreground">Roles</p>
            <p>{practice.roles.map((role) => PRACTICE_ROLE_LABELS[role]).join(", ")}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-foreground">Entorno</p>
            <p>{practice.environment.tenantRequired} · {practice.environment.codeRequired ? "requiere código" : "sin código obligatorio"}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-foreground">Prerrequisitos</p>
            <p>Módulos {practice.prerequisites.modules.join(", ")} · {practice.prerequisites.labs.join(", ")}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen de evidencia">
        <Info icon={Clock} title="Esfuerzo" text={practice.estimatedEffort} />
        <Info icon={Wrench} title="Herramientas" text={practice.environment.tools.slice(0, 2).join(", ")} />
        <Info icon={ShieldCheck} title="Solución" text={practice.solutionAvailability} />
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="mb-3 text-base font-semibold text-foreground">Evidencia profesional requerida</h2>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Obligatoria</p>
            <div className="flex flex-wrap gap-1.5">
              {practice.evidence.required.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Criterios</p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {practice.evidence.qualityCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
            </ul>
          </div>
        </div>
        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-50 p-3 text-xs leading-relaxed text-muted-foreground dark:bg-amber-500/10">
          {practice.evidence.sensitiveDataWarning}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card px-6 py-8 shadow-fluent-1">
        <MarkdownRenderer content={bodyContent} />
      </section>

      <PracticeWorkspaceClient
        practice={{
          id: practice.id,
          title: practice.title,
          hints: practice.hints,
          evidence: practice.evidence,
          rubric: practice.rubric,
          solutionMarkdown: solutionContent,
        }}
      />

      <Separator />
      <Button asChild variant="ghost" size="sm" className="px-0 text-muted-foreground hover:text-foreground">
        <Link href="/experiencia-practica">
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
          Volver a experiencia práctica
        </Link>
      </Button>
    </div>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </div>
      <p className="text-sm font-semibold text-foreground">{text}</p>
    </div>
  );
}

function splitSolution(content: string): { bodyContent: string; solutionContent: string } {
  const marker = /^## Solución de referencia\s*$/im;
  const match = marker.exec(content);
  if (!match) return { bodyContent: content, solutionContent: "## Solución de referencia\n\nSolución no disponible." };
  return {
    bodyContent: content.slice(0, match.index).trim(),
    solutionContent: content.slice(match.index).trim(),
  };
}
