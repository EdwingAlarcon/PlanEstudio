"use client";

import { useRef, useState } from "react";
import { Download, HardDriveDownload, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BACKUP_STORE_LABELS,
  applyBackup,
  createFullBackup,
  fullBackupFileName,
  parseBackupText,
  serializeFullBackup,
  type BackupPreview,
  type BackupStrategy,
} from "@/lib/progress-backup";

function failedPreview(message: string): BackupPreview {
  return { status: "corrupt", stores: {}, storeKeys: [], ignoredKeys: [], errors: [message] };
}

export function FullBackupPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [strategy, setStrategy] = useState<BackupStrategy>("merge");
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [message, setMessage] = useState("");
  const canImport = preview?.status === "valid";

  function handleExport() {
    const backup = createFullBackup(localStorage);
    const blob = new Blob([serializeFullBackup(backup)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fullBackupFileName();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setMessage(`Backup generado con ${Object.keys(backup.stores).length} secciones.`);
  }

  async function handleFile(file: File | undefined) {
    setMessage("");
    setPreview(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setPreview(failedPreview("Selecciona un archivo .json exportado desde PlanEstudio."));
      return;
    }
    setPreview(parseBackupText(await file.text()));
  }

  function handleImport() {
    if (!preview || !canImport) return;
    const detail =
      strategy === "replace"
        ? "Se reemplazarán las secciones incluidas en el archivo por su contenido."
        : "El progreso académico se combinará (unión de módulos y labs, mejor nota). El resto de secciones solo se rellenan si están vacías.";
    if (!window.confirm(`${detail}\n\nLa página se recargará al terminar. Exporta un backup antes si quieres conservar el estado actual.`)) return;
    const written = applyBackup(localStorage, preview, strategy);
    setMessage(`Importadas ${written.length} secciones. Recargando…`);
    window.setTimeout(() => window.location.reload(), 600);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="full-backup-heading">
      <div className="flex items-center gap-2">
        <HardDriveDownload className="h-4 w-4 text-[#0078D4]" aria-hidden />
        <h2 id="full-backup-heading" className="text-base font-semibold text-foreground">Backup completo de mi progreso</h2>
      </div>
      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Todo tu avance vive solo en este navegador, certificados incluidos. Si borras los datos del sitio o cambias de equipo
        sin exportar antes, se pierde. Un solo archivo guarda las {Object.keys(BACKUP_STORE_LABELS).length} secciones.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={handleExport}>
          <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
          Exportar backup completo
        </Button>
        <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload className="mr-1 h-3.5 w-3.5" aria-hidden />
          Seleccionar JSON
        </Button>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
        <select aria-label="Estrategia de importación" value={strategy} onChange={(event) => setStrategy(event.target.value as BackupStrategy)} className="h-8 rounded-md border border-border bg-background px-2 text-xs">
          <option value="merge">Combinar</option>
          <option value="replace">Reemplazar</option>
        </select>
        <Button size="sm" variant="outline" disabled={!canImport} onClick={handleImport}>
          Importar
        </Button>
      </div>

      {preview && (
        <div className="mt-4 rounded-lg border border-border bg-background p-4" role="status" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">Vista previa</h3>
            <Badge variant={canImport ? "default" : "destructive"}>
              {canImport ? "Válido" : preview.status === "incompatible" ? "Incompatible" : "Corrupto"}
            </Badge>
          </div>
          {canImport && (
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {preview.storeKeys.map((key) => <li key={key}>{BACKUP_STORE_LABELS[key]}</li>)}
              {preview.exportedAt && <li>Exportado: {preview.exportedAt.slice(0, 10)}</li>}
              {preview.ignoredKeys.length > 0 && <li>{preview.ignoredKeys.length} sección(es) desconocida(s) ignorada(s).</li>}
            </ul>
          )}
          {preview.errors.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {preview.errors.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </div>
      )}
      {message && <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">{message}</p>}
    </section>
  );
}
