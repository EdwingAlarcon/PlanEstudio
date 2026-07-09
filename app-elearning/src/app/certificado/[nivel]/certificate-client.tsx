"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Pencil } from "lucide-react";
import {
  useProgressStore,
  calculateLevelProgress,
  calculateLevelQuizReadiness,
} from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { CertificateDiploma } from "@/components/modules/certificate-diploma";
import { CertificateNameDialog } from "@/components/modules/certificate-name-dialog";
import { type LevelId } from "@/lib/i18n";

interface CertificateClientProps {
  levelId: LevelId;
  modules?: { moduleId: number; title: string }[];
  labs?: { slug: string; displayId?: string; title: string }[];
}

export function CertificateClient({ levelId, modules = [], labs = [] }: CertificateClientProps) {
  const router = useRouter();
  const userName = useProgressStore((s) => s.userName);
  const setUserName = useProgressStore((s) => s.setUserName);
  const completedModules = useProgressStore((s) => s.completedModules);
  const quizScores = useProgressStore((s) => s.quizScores);
  const completedLabs = useProgressStore((s) => s.completedLabs);
  const { percentage } = calculateLevelProgress(levelId, completedModules);
  const quizReadiness = calculateLevelQuizReadiness(levelId, quizScores);
  const [dialogOpen, setDialogOpen] = useState(false);

  const shouldRedirect = percentage < 100 || !userName;
  const pendingModules = modules.filter((m) => (quizScores[String(m.moduleId)] ?? 0) < 70);
  const pendingLabs = labs.filter((lab) => !completedLabs.includes(lab.slug));
  const competencyReady = quizReadiness.ready && pendingLabs.length === 0;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/nivel/${levelId}`);
    }
  }, [shouldRedirect, levelId, router]);

  if (shouldRedirect) {
    return null;
  }

  if (!competencyReady) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/nivel/${levelId}`}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Volver al nivel
          </Link>
        </Button>

        <Callout variant="warning" title="Aún no puedes generar el certificado de este nivel">
          Completar los módulos es solo el primer paso. El certificado exige además aprobar el
          quiz de cada módulo (≥70%) y completar los laboratorios del nivel — así el diploma
          respalda competencia demostrada, no solo lectura.
        </Callout>

        {pendingModules.length > 0 && (
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-sm font-medium">
              Quizzes pendientes de aprobar ({pendingModules.length}/{modules.length})
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {pendingModules.map((m) => {
                const score = quizScores[String(m.moduleId)];
                return (
                  <li key={m.moduleId}>
                    Módulo {m.moduleId}: {m.title} —{" "}
                    {typeof score === "number" ? `${score}% (necesitas 70%)` : "sin realizar"}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {pendingLabs.length > 0 && (
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-sm font-medium">
              Laboratorios pendientes ({pendingLabs.length}/{labs.length})
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {pendingLabs.map((lab) => (
                <li key={lab.slug}>
                  {lab.displayId ? `${lab.displayId} · ` : ""}{lab.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/nivel/${levelId}`}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Volver al nivel
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Cambiar nombre
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Imprimir
          </Button>
        </div>
      </div>

      <CertificateDiploma levelId={levelId} userName={userName} date={new Date()} />

      <CertificateNameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialName={userName}
        onConfirm={setUserName}
      />
    </div>
  );
}
