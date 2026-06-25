import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft, Award, Users, BookOpen, AlertTriangle, FlaskConical } from "lucide-react";
import { getAllLabs, getLabBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { LabCompleteButton } from "@/components/labs/lab-complete-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const labs = getAllLabs();
  return labs.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) return { title: "Lab no encontrado" };
  return {
    title: lab.title,
    description: `Laboratorio práctico: ${lab.title}. Duración: ${lab.duration} min. Certificación: ${lab.certifications.join(", ")}.`,
  };
}

const LEVEL_BAR: Record<string, string> = {
  N1: "bg-[#107C10]", N2: "bg-[#0078D4]", N3: "bg-orange-500", N4: "bg-[#D13438]",
};

const CERT_VARIANT: Record<string, "basico" | "intermedio" | "avanzado" | "arquitecto" | "default"> = {
  "PL-900": "basico", "PL-200": "intermedio", "PL-400": "avanzado", "PL-600": "arquitecto",
};

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) notFound();

  const bar = LEVEL_BAR[lab.level] ?? "bg-[#0078D4]";

  return (
    <main id="main-content" className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="px-0 -ml-1 text-muted-foreground hover:text-foreground">
        <Link href="/labs">
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden />
          Todos los laboratorios
        </Link>
      </Button>

      {/* ── Lab header card ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-5 shadow-fluent-1">
        <div className="flex items-start gap-4">
          {/* Level accent bar */}
          <div className={`mt-1 h-12 w-1 rounded-full shrink-0 ${bar}`} aria-hidden />

          <div className="space-y-3 flex-1 min-w-0">
            {/* Icon + title */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0078D4]/10">
                <FlaskConical className="h-5 w-5 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-snug text-foreground">{lab.title}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Nivel {lab.level} · Laboratorio práctico</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {lab.certifications.map((cert) => (
                <Badge key={cert} variant={CERT_VARIANT[cert] ?? "default"}>{cert}</Badge>
              ))}
              {lab.products.map((p) => (
                <Badge key={p} variant="outline">{p}</Badge>
              ))}
              {lab.role.map((r) => (
                <Badge key={r} variant="secondary">{r}</Badge>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {lab.duration > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {lab.duration} min
                </span>
              )}
              {lab.certifications.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" aria-hidden />
                  {lab.certifications.join(", ")}
                </span>
              )}
              {lab.role.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {lab.role.join(", ")}
                </span>
              )}
              {lab.prerequisites.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  {lab.prerequisites.length} prerrequisito{lab.prerequisites.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Prerequisites callout */}
        {lab.prerequisites.length > 0 && (
          <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-[#FFB900] bg-[#FFFBE6] dark:bg-[rgba(255,185,0,0.1)] dark:border-[#FFB900] px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B37800] dark:text-[#FFB900]" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-[#B37800] dark:text-[#FFB900] mb-1.5">Prerrequisitos</p>
              <ul className="space-y-1">
                {lab.prerequisites.map((p, i) => (
                  <li key={i} className="text-sm text-foreground/80">{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── Lab markdown content ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-8 md:px-8 shadow-fluent-1">
        <MarkdownRenderer content={lab.rawContent} />
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Separator />
      <div className="flex flex-wrap justify-between items-center gap-3 pb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/labs">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Todos los laboratorios
          </Link>
        </Button>
        <LabCompleteButton slug={lab.slug} />
      </div>
    </main>
  );
}
