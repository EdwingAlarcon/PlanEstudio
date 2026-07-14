import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, FileCheck2, FlaskConical } from "lucide-react";
import { getAllLabs } from "@/lib/content";
import { getLabPresentationMeta } from "@/lib/lab-metadata";
import { LabsClient, type LabWithMeta } from "@/components/labs/labs-client";

export const metadata: Metadata = {
  title: "Laboratorios",
  description: "Laboratorios prácticos tipo Microsoft App in a Day para Power Platform y Dynamics 365.",
};

const FEATURED_ARTIFACTS = [
  {
    href: "/recursos/rubricas-plantillas",
    title: "Rúbricas y plantillas",
    description: "Matriz de trazabilidad, caso UAT y sign-off copiables.",
    icon: ClipboardCheck,
  },
  {
    href: "/labs/lab-55-uat-gonolive-y-auditoria-prompts",
    title: "UAT y go-live",
    description: "Genera casos UAT, checklist y matriz de trazabilidad.",
    icon: FileCheck2,
  },
  {
    href: "/labs/lab-60-proyecto-integrador-servicio-postventa",
    title: "Proyecto integrador",
    description: "Capstone evaluable de servicio postventa D365.",
    icon: FlaskConical,
  },
];

export default function LabsPage() {
  const labs: LabWithMeta[] = getAllLabs().map((lab) => ({
    slug: lab.slug,
    displayId: lab.displayId,
    title: lab.title,
    level: lab.level,
    duration: lab.duration,
    products: lab.products,
    role: lab.role,
    meta: getLabPresentationMeta(lab),
  }));

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white dark:from-[rgba(0,120,212,0.08)] dark:to-background px-6 py-6 mb-8 shadow-fluent-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0078D4] shadow-fluent-2">
            <FlaskConical className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Laboratorios Prácticos</h1>
            <p className="text-xs text-muted-foreground">{labs.length} labs · Códigos LAB-### buscables</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          Guías paso a paso con escenario de empresa real (Servicios Integrados Tecnológicos S.A.),
          validaciones por tarea y retos adicionales — al estilo <strong>Microsoft App in a Day</strong>.
        </p>
      </div>

      <section aria-labelledby="artifact-heading" className="mb-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="artifact-heading" className="text-sm font-semibold text-foreground">
              Artefactos evaluables
            </h2>
            <p className="text-xs text-muted-foreground">
              Accesos directos a plantillas, UAT y proyecto integrador.
            </p>
          </div>
          <Link
            href="/recursos/rubricas-plantillas"
            className="hidden text-xs font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF] sm:inline"
          >
            Ver recurso
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURED_ARTIFACTS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-border bg-card p-4 shadow-fluent-1 transition-all duration-200 hover:border-[#0078D4]/30 hover:shadow-fluent-4"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0078D4]/10">
                  <Icon className="h-4.5 w-4.5 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <LabsClient labs={labs} />
    </main>
  );
}
