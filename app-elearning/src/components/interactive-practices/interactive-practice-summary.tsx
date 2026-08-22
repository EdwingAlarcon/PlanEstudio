"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Download, RotateCcw, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  INTERACTIVE_DOMAIN_LABELS,
  getRecommendedInteractivePractice,
  type InteractivePractice,
} from "@/lib/interactive-practices";
import {
  createInteractivePracticeProgressExport,
  mergeInteractivePracticeRecords,
  parseInteractivePracticeImport,
  replaceInteractivePracticeRecords,
  summarizeInteractivePracticeProgress,
  useInteractivePracticeProgressStore,
  type InteractivePracticeImportResult,
} from "@/lib/interactive-practice-progress";
import { useProgressStore } from "@/lib/progress";

export function InteractivePracticeSummary({ practices, showReset = false }: { practices: InteractivePractice[]; showReset?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<InteractivePracticeImportResult | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const records = useInteractivePracticeProgressStore((s) => s.records);
  const resetAll = useInteractivePracticeProgressStore((s) => s.resetAllInteractivePractices);
  const setRecords = useInteractivePracticeProgressStore((s) => s.setInteractivePracticeRecords);
  const completedModules = useProgressStore((s) => s.completedModules);
  const summary = summarizeInteractivePracticeProgress(records, practices.map((practice) => practice.id));
  const recommended = getRecommendedInteractivePractice(records, completedModules);
  const practiceIds = practices.map((practice) => practice.id);

  const exportProgress = () => {
    const payload = createInteractivePracticeProgressExport(records, practiceIds);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `planestudio-practicas-interactivas-${payload.exportedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setImportMessage("Progreso interactivo exportado en JSON versionado.");
  };

  const readImportFile = async (file: File | undefined) => {
    setImportMessage("");
    setImportResult(null);
    if (!file) return;
    const text = await file.text();
    setImportResult(parseInteractivePracticeImport(text, practiceIds, records));
  };

  const applyMerge = () => {
    if (!importResult?.ok) return;
    setRecords(mergeInteractivePracticeRecords(records, importResult.data.practices, practiceIds));
    setImportMessage("Importación fusionada: se conservó el mejor estado disponible por práctica.");
    setImportResult(null);
  };

  const applyReplace = () => {
    if (!importResult?.ok) return;
    setRecords(replaceInteractivePracticeRecords(importResult.data.practices, practiceIds));
    setImportMessage("Progreso interactivo reemplazado de forma aislada. El progreso académico no se modificó.");
    setImportResult(null);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="interactive-summary-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-[#0078D4]" aria-hidden />
            <h2 id="interactive-summary-heading" className="text-lg font-semibold text-foreground">Práctica interactiva</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {practices.length} ejercicios piloto con feedback inmediato, mastery independiente y fixtures locales.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {showReset && (
            <>
              <Button type="button" variant="outline" size="sm" onClick={exportProgress}>
                <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
                Exportar progreso
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-1 h-3.5 w-3.5" aria-hidden />
                Importar progreso
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                aria-label="Importar progreso de prácticas interactivas"
                onChange={(event) => {
                  void readImportFile(event.target.files?.[0]);
                  event.currentTarget.value = "";
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {
                  if (window.confirm("Esto reinicia solo las prácticas interactivas. ¿Continuar?")) resetAll();
                }}
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden />
                Reiniciar solo prácticas interactivas
              </Button>
            </>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/practica">
              Abrir banco
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <SummaryMetric label="Completadas" value={`${summary.completed}/${summary.total}`} />
        <SummaryMetric label="Dominadas" value={summary.proficient.toString()} />
        <SummaryMetric label="Para repasar" value={summary.needsReview.toString()} />
        <SummaryMetric label="Intentos" value={summary.attempts.toString()} />
      </div>
      <Progress value={summary.percentage} className="mt-4 h-2" />
      {showReset && (
        <div className="mt-4 space-y-3" aria-live="polite">
          {importMessage && <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">{importMessage}</p>}
          {importResult && !importResult.ok && (
            <p className="rounded-lg border border-[#D13438]/25 bg-red-50 p-3 text-sm text-[#B42318] dark:bg-red-500/10 dark:text-red-200">
              {importResult.error}
            </p>
          )}
          {importResult?.ok && (
            <section className="rounded-lg border border-border bg-background p-3">
              <h3 className="text-sm font-semibold text-foreground">Preview de importación</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {importResult.preview.known} prácticas conocidas, {importResult.preview.willAdd} nuevas, {importResult.preview.willUpdate} con progreso existente y {importResult.preview.unknown} IDs desconocidos ignorados.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={applyMerge}>Fusionar</Button>
                <Button type="button" variant="outline" size="sm" onClick={applyReplace}>Reemplazar solo prácticas interactivas</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setImportResult(null)}>Cancelar</Button>
              </div>
            </section>
          )}
        </div>
      )}
      {recommended && (
        <Link
          href={`/practica/${recommended.slug}`}
          className="mt-4 flex flex-col gap-3 rounded-lg border border-[#107C10]/25 bg-[#EFF8EE] p-3 text-sm transition-colors hover:border-[#107C10]/50 dark:bg-[rgba(16,124,16,0.10)] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="mb-1 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#107C10]" aria-hidden />
              <span className="font-semibold text-foreground">Siguiente micro-práctica</span>
              <Badge variant="outline" className="bg-background text-[10px]">{INTERACTIVE_DOMAIN_LABELS[recommended.domain]}</Badge>
            </span>
            <span className="block text-muted-foreground">{recommended.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#107C10]" aria-hidden />
        </Link>
      )}
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
