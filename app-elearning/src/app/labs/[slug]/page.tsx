import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft, Award, Users, BookOpen, AlertCircle } from "lucide-react";
import { getAllLabs, getLabBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { LabCompleteButton } from "@/components/labs/lab-complete-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

const LEVEL_COLOR: Record<string, string> = {
  N1: "text-green-600 dark:text-green-400",
  N2: "text-blue-600 dark:text-blue-400",
  N3: "text-orange-600 dark:text-orange-400",
  N4: "text-red-600 dark:text-red-400",
};

const CERT_VARIANT: Record<string, "basico" | "intermedio" | "avanzado" | "arquitecto" | "default"> = {
  "PL-900": "basico",
  "PL-200": "intermedio",
  "PL-400": "avanzado",
  "PL-600": "arquitecto",
};

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) notFound();

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      {/* Back navigation */}
      <Link
        href="/labs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Todos los laboratorios
      </Link>

      {/* Lab header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold leading-tight mb-3">{lab.title}</h1>

        {/* Metadata chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {lab.certifications.map((cert) => (
            <Badge key={cert} variant={CERT_VARIANT[cert] ?? "default"}>
              {cert}
            </Badge>
          ))}
          {lab.products.map((p) => (
            <Badge key={p} variant="outline">
              {p}
            </Badge>
          ))}
          {lab.role.map((r) => (
            <Badge key={r} variant="secondary">
              {r}
            </Badge>
          ))}
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {lab.duration > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {lab.duration} min
            </span>
          )}
          {lab.level && (
            <span className={`flex items-center gap-1.5 font-medium ${LEVEL_COLOR[lab.level] ?? ""}`}>
              <Award className="h-4 w-4" />
              {lab.level}
            </span>
          )}
          {lab.certifications.length > 0 && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {lab.certifications.join(", ")}
            </span>
          )}
        </div>

        {/* Prerequisites */}
        {lab.prerequisites.length > 0 && (
          <div className="mt-4 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 mb-1.5">
              <AlertCircle className="h-4 w-4" />
              Prerrequisitos
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {lab.prerequisites.map((p, i) => (
                <li key={i} className="text-sm text-amber-800 dark:text-amber-300">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <Separator className="mb-6" />

      {/* Lab content */}
      <MarkdownRenderer content={lab.rawContent} />

      {/* Footer navigation */}
      <Separator className="mt-10 mb-6" />
      <div className="flex flex-wrap justify-between items-center gap-3">
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Todos los laboratorios
        </Link>
        <div className="flex items-center gap-3">
          {lab.role.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {lab.role.join(", ")}
            </span>
          )}
          <LabCompleteButton slug={lab.slug} />
        </div>
      </div>
    </main>
  );
}
