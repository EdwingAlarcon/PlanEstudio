import type { Metadata } from "next";
import { buildPageMetadata, PATHS } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, BrainCircuit, ArrowRight } from "lucide-react";
import { getAllLabs, getLabBySlug } from "@/lib/content";
import { getInteractivePracticesForLab, INTERACTIVE_TYPE_LABELS } from "@/lib/interactive-practices";
import { getLabPresentationMeta, getLabReadiness } from "@/lib/lab-metadata";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { LabCompleteButton } from "@/components/labs/lab-complete-button";
import { LabMissionPanel } from "@/components/labs/lab-mission-panel";
import { buildLabMission } from "@/lib/lab-mission";
import { roleFamilies } from "@/lib/role-family";
import { XP_RULES } from "@/lib/xp";
import { LabWorkstationGate } from "@/components/labs/lab-workstation-gate";
import { LabPrerequisiteGate } from "@/components/labs/lab-prerequisite-gate";
import { LabReadinessPanel } from "@/components/labs/lab-readiness-panel";
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
  return buildPageMetadata({
    title: `${lab.displayId} · ${lab.title}`,
    description: `${lab.displayId}. Laboratorio práctico: ${lab.title}. Duración: ${lab.duration} min.`,
    path: PATHS.lab(lab.slug),
  });
}

const LEVEL_BAR: Record<string, string> = {
  N1: "bg-[#107C10]", N2: "bg-[#0078D4]", N3: "bg-orange-500", N4: "bg-[#D13438]",
  N5: "bg-purple-600", N6: "bg-teal-600", RPA: "bg-[#6B4EFF]",
};

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) notFound();

  const bar = LEVEL_BAR[lab.level] ?? "bg-[#0078D4]";
  const meta = getLabPresentationMeta(lab);
  const readiness = getLabReadiness(lab);
  const interactivePractices = getInteractivePracticesForLab(lab.displayId).slice(0, 2);
  const mission = buildLabMission(lab.rawContent);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="px-0 -ml-1 text-muted-foreground hover:text-foreground">
        <Link href="/labs">
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden />
          Todos los laboratorios
        </Link>
      </Button>

      {/* ── Lab header card ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-5">
        <div className="flex items-start gap-4">
          {/* Level accent bar */}
          <div className={`mt-1 h-12 w-1 rounded-full shrink-0 ${bar}`} aria-hidden />

          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <p className="text-xs text-muted-foreground">
                {[lab.displayId, meta.kindLabel, lab.duration > 0 ? `${lab.duration} min` : null, meta.recommendedLevel]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h1 className="mt-1 text-xl font-bold leading-snug text-foreground">{lab.title}</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {[lab.products.join(", "), roleFamilies(lab.role).join(", "), meta.certificationBadges.join(", ")]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            {meta.historicalCertifications.length > 0 && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Referencia histórica: {meta.historicalCertifications.join(", ")} retirada. Este lab se presenta como competencia,
                no como certificación vigente.
              </p>
            )}

            <div className="text-sm">
              <p className="font-semibold text-foreground">Lo que vas a entregar</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">{meta.evidenceSummary.replace(/`/g, "")}</p>
              <a href="#lab-mission-heading" className="mt-1 inline-block text-xs font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]">
                Entrega tu misión al final: {XP_RULES.labVerified} XP con evidencia
              </a>
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

      {interactivePractices.length > 0 && (
        <section aria-labelledby="lab-interactive-practice-heading" className="rounded-xl border border-[#107C10]/25 bg-card px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="lab-interactive-practice-heading" className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <BrainCircuit className="h-5 w-5 text-[#107C10]" aria-hidden />
                Antes de ejecutar el lab
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ensaya el razonamiento en un entorno simulado. No reemplaza la evidencia del laboratorio.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="border-[#107C10]/30 text-[#107C10] hover:bg-[#EFF8EE]">
              <Link href={`/practica/${interactivePractices[0]?.slug}`}>
                Abrir práctica
                <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {interactivePractices.map((practice) => (
              <Link key={practice.id} href={`/practica/${practice.slug}`} className="rounded-lg border border-border bg-background p-3 transition-colors hover:border-[#107C10]/45">
                <Badge variant="outline" className="mb-2 text-[10px]">{INTERACTIVE_TYPE_LABELS[practice.type]}</Badge>
                <h3 className="text-sm font-semibold text-foreground">{practice.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{practice.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <LabReadinessPanel readiness={readiness} />

      <LabWorkstationGate products={lab.products} />

      <LabPrerequisiteGate prerequisites={lab.prerequisites} />

      {/* ── Lab markdown content ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card px-6 py-8 md:px-8">
        <MarkdownRenderer content={lab.rawContent} />
      </div>

      <LabMissionPanel slug={lab.slug} mission={mission} />

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
    </div>
  );
}
