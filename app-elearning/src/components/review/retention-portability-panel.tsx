"use client";

import { useRef, useState } from "react";
import { Download, FileJson, RotateCcw, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  applyRetentionImport,
  createRetentionExport,
  parseRetentionImportText,
  retentionBackupFileName,
  serializeRetentionExport,
  type RetentionImportStrategy,
} from "@/lib/retention-portability";
import { useReviewStore } from "@/lib/review-store";

type Preview = ReturnType<typeof parseRetentionImportText>;

function emptyCorruptPreview(message: string): Preview {
  return {
    status: "corrupt",
    cardCount: 0,
    dayLogCount: 0,
    unknownQuestionIds: [],
    warnings: [],
    errors: [message],
    cards: {},
    dayLogs: [],
  };
}

export function RetentionPortabilityPanel({ questionIds }: { questionIds: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cards = useReviewStore((s) => s.cards);
  const dayLogs = useReviewStore((s) => s.dayLogs);
  const importCards = useReviewStore((s) => s.importCards);
  const resetReviewProgress = useReviewStore((s) => s.resetReviewProgress);
  const [strategy, setStrategy] = useState<RetentionImportStrategy>("merge");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const currentCount = Object.keys(cards).length;

  function downloadFile(content: string, fileName: string) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function handleExport() {
    const payload = createRetentionExport({ cards, dayLogs });
    setMessage(`Backup generado: ${payload.metadata.cardCount} tarjetas de repaso.`);
    downloadFile(serializeRetentionExport(payload), retentionBackupFileName());
  }

  async function handleFile(file: File | undefined) {
    setMessage("");
    setPreview(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setPreview(emptyCorruptPreview("Selecciona un archivo .json exportado desde PlanEstudio."));
      return;
    }
    if (file.size > 1_000_000) {
      setPreview(emptyCorruptPreview("El archivo supera 1 MB; no se importará en el navegador."));
      return;
    }
    const text = await file.text();
    setPreview(parseRetentionImportText(text, questionIds));
  }

  function handleImport() {
    if (!preview || preview.status === "corrupt" || preview.status === "incompatible") return;
    const explanation = strategy === "replace"
      ? `Se reemplazarán ${currentCount} tarjetas de repaso locales por ${preview.cardCount}. El progreso académico y práctico no cambian.`
      : `Se combinarán ${preview.cardCount} tarjetas importadas con ${currentCount} locales, conservando la más reciente por pregunta.`;
    if (!window.confirm(`${explanation}\n\nAntes de continuar, exporta un backup si quieres conservar el estado actual.`)) return;
    importCards(applyRetentionImport(cards, preview.cards, strategy), preview.dayLogs, strategy);
    setMessage(strategy === "replace" ? "Repaso reemplazado. Los demás stores quedaron intactos." : "Repaso combinado. Los demás stores quedaron intactos.");
  }

  function handleReset() {
    if (!window.confirm(`Esto elimina ${currentCount} tarjetas de repaso local. Módulos, quizzes, labs y prácticas no se modifican.\n\nRecomendación: exporta un backup antes de reiniciar.`)) return;
    resetReviewProgress();
    setPreview(null);
    setMessage("Progreso de repaso reiniciado. El resto de tu progreso no se modificó.");
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="retention-portability-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileJson className="h-4 w-4 text-[#0078D4]" aria-hidden />
            <h2 id="retention-portability-heading" className="text-base font-semibold text-foreground">Respaldo del repaso</h2>
          </div>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            El calendario de repaso vive solo en este navegador. Si borras los datos del sitio sin
            exportar antes, se pierde.
          </p>
        </div>
        <Badge variant="outline">{currentCount} tarjetas locales</Badge>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/15 p-4">
          <h3 className="text-sm font-semibold text-foreground">Exportar</h3>
          <p className="mt-1 text-xs text-muted-foreground">JSON versionado con tus tarjetas e historial diario.</p>
          <Button size="sm" className="mt-3" onClick={handleExport}>
            <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
            Exportar progreso de repaso
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-muted/15 p-4">
          <h3 className="text-sm font-semibold text-foreground">Importar</h3>
          <p className="mt-1 text-xs text-muted-foreground">Primero se muestra una vista previa. Nada se aplica al seleccionar el archivo.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-1 h-3.5 w-3.5" aria-hidden />
              Seleccionar JSON
            </Button>
            <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
            <select value={strategy} onChange={(event) => setStrategy(event.target.value as RetentionImportStrategy)} className="h-8 rounded-md border border-border bg-background px-2 text-xs">
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
          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <span>Versión: {preview.schemaVersion ?? "-"}</span>
            <span>Tarjetas: {preview.cardCount}</span>
            <span>Días de historial: {preview.dayLogCount}</span>
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
          Reiniciar progreso de repaso
        </Button>
        <span className="text-xs text-muted-foreground">{message}</span>
      </div>
    </section>
  );
}
