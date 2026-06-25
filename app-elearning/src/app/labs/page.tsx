import type { Metadata } from "next";
import Link from "next/link";
import { Clock, BookOpen, Award, ChevronRight, FlaskConical } from "lucide-react";
import { getAllLabs } from "@/lib/content";
import { LabCardStatus } from "@/components/labs/lab-card-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Laboratorios",
  description: "Laboratorios prácticos tipo Microsoft App in a Day para Power Platform y Dynamics 365.",
};

const LEVEL_COLOR: Record<string, string> = {
  N1: "text-green-600 dark:text-green-400",
  N2: "text-blue-600 dark:text-blue-400",
  N3: "text-orange-600 dark:text-orange-400",
  N4: "text-red-600 dark:text-red-400",
};

const LEVEL_LABEL: Record<string, string> = {
  N1: "Nivel 1 — Básico",
  N2: "Nivel 2 — Intermedio",
  N3: "Nivel 3 — Avanzado",
  N4: "Nivel 4 — Arquitecto",
};

const CERT_VARIANT: Record<string, "basico" | "intermedio" | "avanzado" | "arquitecto" | "default"> = {
  "PL-900": "basico",
  "PL-200": "intermedio",
  "PL-400": "avanzado",
  "PL-600": "arquitecto",
};

export default function LabsPage() {
  const labs = getAllLabs();

  // Group by level
  const byLevel = labs.reduce<Record<string, typeof labs>>((acc, lab) => {
    const key = lab.level || "otros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lab);
    return acc;
  }, {});

  const levelOrder = ["N1", "N2", "N3", "N4"];

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="h-7 w-7 text-primary" aria-hidden />
          <h1 className="text-2xl font-bold">Laboratorios</h1>
        </div>
        <p className="text-muted-foreground">
          Prácticas estructuradas con escenario unificado (Empresa SIT), ejercicios paso a paso,
          validaciones por tarea y retos adicionales — al estilo Microsoft App in a Day.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {labs.length} laboratorio{labs.length !== 1 ? "s" : ""} disponible{labs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {labs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No hay laboratorios disponibles todavía.</p>
        </div>
      )}

      {/* Labs grouped by level */}
      {levelOrder.map((levelKey) => {
        const levelLabs = byLevel[levelKey];
        if (!levelLabs || levelLabs.length === 0) return null;

        return (
          <section key={levelKey} className="mb-10">
            <h2 className={`text-lg font-semibold mb-4 ${LEVEL_COLOR[levelKey] ?? ""}`}>
              {LEVEL_LABEL[levelKey] ?? levelKey}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {levelLabs.map((lab) => (
                <Link key={lab.slug} href={`/labs/${lab.slug}`} className="group">
                  <Card className="h-full transition-shadow hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                          {lab.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-0.5">
                          <LabCardStatus slug={lab.slug} />
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Certs and products */}
                      <div className="flex flex-wrap gap-1.5">
                        {lab.certifications.map((cert) => (
                          <Badge
                            key={cert}
                            variant={CERT_VARIANT[cert] ?? "default"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {cert}
                          </Badge>
                        ))}
                        {lab.products.slice(0, 2).map((product) => (
                          <Badge key={product} variant="outline" className="text-[10px] px-1.5 py-0">
                            {product}
                          </Badge>
                        ))}
                      </div>

                      {/* Duration and role */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {lab.duration > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden />
                            {lab.duration} min
                          </span>
                        )}
                        {lab.role.length > 0 && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" aria-hidden />
                            {lab.role[0]}
                          </span>
                        )}
                        {lab.certifications.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" aria-hidden />
                            {lab.certifications[0]}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
