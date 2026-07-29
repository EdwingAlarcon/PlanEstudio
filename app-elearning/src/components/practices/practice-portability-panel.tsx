"use client";

import { useRef, useState } from "react";
import { Download, FileJson, RotateCcw, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  applyPracticeImport,
  createPracticeProgressExport,
  parsePracticeImportText,
  practiceBackupFileName,
  serializePracticeProgressExport,
  type ImportStrategy,
} from "@/lib/practice-portability";
import { usePracticeProgressStore } from "@/lib/practice-progress";

type Preview = ReturnType<typeof parsePracticeImportText>;

export function PracticePortabilityPanel({ practiceIds }: { practiceIds: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const records = usePracticeProgressStore((s) => s.records);
  const importRecords = usePracticeProgressStore((s) => s.importPracticeProgress);
  const resetAll = usePracticeProgressStore((s) => s.resetAllPracticeProgress);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [strategy, setStrategy] = useState<ImportStrategy>("merge");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const currentCount = Object.keys(records).length;

  function downloadFile(content: string, fileName: string, type = "application/json") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    const payload = createPracticeProgressExport(records, { includeNotes });
    downloadFile(serializePracticeProgressExport(payload), practiceBackupFileName());
    setMessage(`Backup generado: ${payload.metadata.recordCount} prácticas y ${payload.metadata.attemptCount} intentos.`);
  }

  async function handleFile(file: File | undefined) {
    setMessage("");
    setPreview(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setPreview({
        status: "corrupt",
        recordCount: 0,
        attemptCount: 0,
        noteCount: 0,
        assessmentCount: 0,
        reviewCount: 0,
        validPracticeIds: [],
        unknownPracticeIds: [],
        rejectedPracticeIds: [],
        warnings: [],
        errors: ["Selecciona un archivo .json exportado desde PlanEstudio."],
        records: {},
      });
      return;
    }
    if (file.size > 1_000_000) {
      setPreview({
        status: "corrupt",
        recordCount: 0,
        attemptCount: 0,
        noteCount: 0,
        assessmentCount: 0,
        reviewCount: 0,
        validPracticeIds: [],
        unknownPracticeIds: [],
        rejectedPracticeIds: [],
        warnings: [],
        errors: ["El archivo supera 1 MB; no se importará en el navegador."],
        records: {},
      });
      return;
    }
    const text = await file.text();
    setPreview(parsePracticeImportText(text, practiceIds));
  }

  function handleImport() {
    if (!preview || preview.status === "corrupt" || preview.status === "incompatible") return;
    const explanation = strategy === "replace"
      ? `Se reemplazarán ${currentCount} registros prácticos locales por ${preview.recordCount}. El progreso académico no cambia.`
      : `Se combinarán ${preview.recordCount} registros importados con ${currentCount} locales. Las notas distintas se concatenan.`;
    if (!window.confirm(`${explanation}\n\nAntes de continuar, exporta un backup si quieres conservar el estado actual.`)) return;
    importRecords(applyPracticeImport(records, preview.records, strategy));
    setMessage(strategy === "replace" ? "Progreso práctico reemplazado. El progreso académico quedó intacto." : "Progreso práctico combinado. El progreso académico quedó intacto.");
  }

  function handleReset() {
    if (!window.confirm(`Esto elimina ${currentCount} registros de progreso práctico local. Módulos, quizzes y labs no se modifican.\n\nRecomendación: exporta un backup antes de reiniciar.`)) return;
    resetAll();
    setPreview(null);
    setMessage("Progreso práctico reiniciado. El progreso académico no se modificó.");
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="practice-portability-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileJson className="h-4 w-4 text-[#0078D4]" aria-hidden />
            <h2 id="practice-portability-heading" className="text-base font-semibold text-foreground">Respaldo y portabilidad</h2>
          </div>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Exporta o recupera solo experiencia práctica. Las notas pueden contener texto escrito por ti; revisa secretos, URLs, usuarios o datos de clientes antes de compartir archivos.
          </p>
        </div>
        <Badge variant="outline">{currentCount} registros locales</Badge>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/15 p-4">
          <h3 className="text-sm font-semibold text-foreground">Backup técnico</h3>
          <p className="mt-1 text-xs text-muted-foreground">JSON versionado para restaurar intentos, evidencias, pistas, autoevaluaciones y revisiones.</p>
          <label className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={includeNotes} onChange={(event) => setIncludeNotes(event.target.checked)} className="mt-1" />
            <span>Incluir notas y reflexiones locales</span>
          </label>
          <Button size="sm" className="mt-3" onClick={handleExport}>
            <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
            Exportar progreso práctico
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-muted/15 p-4">
          <h3 className="text-sm font-semibold text-foreground">Importación validada</h3>
          <p className="mt-1 text-xs text-muted-foreground">Primero se muestra una vista previa. Nada se aplica al seleccionar el archivo.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-1 h-3.5 w-3.5" aria-hidden />
              Seleccionar JSON
            </Button>
            <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
            <select value={strategy} onChange={(event) => setStrategy(event.target.value as ImportStrategy)} className="h-8 rounded-md border border-border bg-background px-2 text-xs">
              <option value="merge">Combinar</option>
              <option value="replace">Reemplazar</option>
            </select>
            <Button size="sm" disabled={!preview || preview.status === "corrupt" || preview.status === "incompatible"} onClick={handleImport}>
              Importar con vista previa
            </Button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="mt-4 rounded-lg border border-border bg-background p-4" role="status" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">Vista previa de importación</h3>
            <Badge variant={preview.status === "valid" ? "default" : preview.status === "warning" ? "secondary" : "destructive"}>
              {preview.status === "valid" ? "Válido" : preview.status === "warning" ? "Válido con advertencias" : preview.status === "incompatible" ? "Incompatible" : "Corrupto"}
            </Badge>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3 lg:grid-cols-6">
            <span>Versión: {preview.schemaVersion ?? "-"}</span>
            <span>Prácticas: {preview.recordCount}</span>
            <span>Intentos: {preview.attemptCount}</span>
            <span>Notas: {preview.noteCount}</span>
            <span>Autoevaluaciones: {preview.assessmentCount}</span>
            <span>Revisiones: {preview.reviewCount}</span>
          </div>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            <p className="text-muted-foreground">Válidas: {preview.validPracticeIds.length} · Desconocidas: {preview.unknownPracticeIds.length} · Rechazadas: {preview.rejectedPracticeIds.length}</p>
            <p className="text-muted-foreground">Estrategia: {strategy === "merge" ? "combinar con reglas determinísticas" : "reemplazar solo progreso práctico"}</p>
          </div>
          {[...preview.warnings, ...preview.errors].length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {[...preview.warnings, ...preview.errors].slice(0, 6).map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden />
          Reiniciar progreso práctico
        </Button>
        <span className="text-xs text-muted-foreground">{message}</span>
      </div>
    </section>
  );
}
