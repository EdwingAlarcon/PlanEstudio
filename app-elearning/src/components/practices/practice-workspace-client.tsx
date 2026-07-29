"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Eye, EyeOff, FileText, Lightbulb, RotateCcw, Save } from "lucide-react";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PRACTICE_HINT_LEVEL_LABELS,
  type PracticeHint,
} from "@/lib/practice-meta";
import {
  CRITICAL_FAILURE_OPTIONS,
  buildSelfAssessment,
  canCompletePractice,
  createPracticeRecord,
  compareLatestAttempts,
  getPracticeStatusLabel,
  getPracticeValidationStatusLabel,
  usePracticeProgressStore,
  type AssessmentLevel,
  type PracticeProgressRecord,
} from "@/lib/practice-progress";
import {
  createEvidencePackage,
  createReviewTemplate,
  evidencePackageBaseName,
  evidencePackageMarkdown,
} from "@/lib/practice-portability";
import type { PracticeDifficulty, PracticeDomain, PracticeEvidence, PracticeRole, PracticeType, PracticeRubricItem } from "@/lib/practices";

export interface PracticeWorkspaceData {
  id: string;
  slug: string;
  title: string;
  practiceType: PracticeType;
  difficulty: PracticeDifficulty;
  domain: PracticeDomain;
  roles: PracticeRole[];
  hints: PracticeHint[];
  evidence: PracticeEvidence;
  rubric: PracticeRubricItem[];
  solutionMarkdown: string;
}

const ASSESSMENT_OPTIONS: { value: AssessmentLevel; label: string }[] = [
  { value: "none", label: "No demostrado" },
  { value: "partial", label: "Parcial" },
  { value: "adequate", label: "Adecuado" },
  { value: "solid", label: "Sólido" },
  { value: "excellent", label: "Excelente" },
];

export function PracticeWorkspaceClient({ practice }: { practice: PracticeWorkspaceData }) {
  const evidenceKeys = practice.evidence.required;
  const records = usePracticeProgressStore((s) => s.records);
  const startPractice = usePracticeProgressStore((s) => s.startPractice);
  const registerAttempt = usePracticeProgressStore((s) => s.registerAttempt);
  const revealHint = usePracticeProgressStore((s) => s.revealHint);
  const viewSolution = usePracticeProgressStore((s) => s.viewSolution);
  const setEvidenceProduced = usePracticeProgressStore((s) => s.setEvidenceProduced);
  const saveNotes = usePracticeProgressStore((s) => s.saveNotes);
  const clearNotes = usePracticeProgressStore((s) => s.clearNotes);
  const saveSelfAssessment = usePracticeProgressStore((s) => s.saveSelfAssessment);
  const completePractice = usePracticeProgressStore((s) => s.completePractice);
  const markNeedsReinforcement = usePracticeProgressStore((s) => s.markNeedsReinforcement);
  const resetPractice = usePracticeProgressStore((s) => s.resetPractice);
  const record = useMemo(() => {
    const base = records[practice.id] ?? createPracticeRecord(practice.id, evidenceKeys);
    return {
      ...base,
      evidenceChecklist: {
        ...Object.fromEntries(evidenceKeys.map((key) => [key, false])),
        ...base.evidenceChecklist,
      },
    };
  }, [records, practice.id, evidenceKeys]);
  const [notesDraft, setNotesDraft] = useState(record.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [levels, setLevels] = useState<Record<string, AssessmentLevel>>(() =>
    Object.fromEntries(practice.rubric.map((item) => [item.criterion, record.selfAssessment?.criteria.find((c) => c.criterion === item.criterion)?.level ?? "none"]))
  );
  const [comments, setComments] = useState<Record<string, string>>(() =>
    Object.fromEntries(practice.rubric.map((item) => [item.criterion, record.selfAssessment?.criteria.find((c) => c.criterion === item.criterion)?.comment ?? ""]))
  );
  const [criticalFailures, setCriticalFailures] = useState<string[]>(record.selfAssessment?.criticalFailures ?? []);
  const completion = canCompletePractice(record, evidenceKeys);
  const assessmentPreview = useMemo(
    () => buildSelfAssessment(practice.rubric, levels, comments, criticalFailures),
    [practice.rubric, levels, comments, criticalFailures]
  );

  function handleAttempt() {
    if (window.confirm("Registrar un nuevo intento incrementa el contador. ¿Confirmas que realizaste un intento autónomo?")) {
      registerAttempt(practice.id, evidenceKeys);
    }
  }

  function handleSolution(attempted: boolean) {
    if (attempted && record.attemptCount === 0) registerAttempt(practice.id, evidenceKeys);
    viewSolution(practice.id, evidenceKeys);
    setSolutionOpen(true);
  }

  function handleSaveAssessment() {
    saveSelfAssessment(practice.id, assessmentPreview, evidenceKeys);
  }

  function handleComplete() {
    completePractice(practice.id, evidenceKeys);
  }

  const persistedRecord = records[practice.id] ?? record;

  return (
    <section className="space-y-4" aria-label="Área de trabajo de práctica">
      <div className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Seguimiento local</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Se guarda solo en este navegador. Borrar datos del sitio elimina notas, intentos, evidencias y autoevaluación práctica.
            </p>
          </div>
          <Badge variant={persistedRecord.status === "completed" ? "default" : persistedRecord.status === "needs_reinforcement" ? "destructive" : "outline"}>
            {getPracticeStatusLabel(persistedRecord.status)} · {getPracticeValidationStatusLabel(persistedRecord.validationStatus)}
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => startPractice(practice.id, evidenceKeys)}>
            Iniciar práctica
          </Button>
          <Button size="sm" variant="outline" onClick={handleAttempt}>
            Registrar intento
          </Button>
          <Button size="sm" variant="outline" onClick={() => markNeedsReinforcement(practice.id, evidenceKeys)}>
            Marcar requiere refuerzo
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.confirm("Esto reinicia solo esta práctica. ¿Continuar?") && resetPractice(practice.id)}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden />
            Reiniciar práctica
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Intentos: {persistedRecord.attemptCount}</span>
          <span>Pistas usadas: {persistedRecord.revealedHints.length}/{practice.hints.length}</span>
          <span>Solución consultada: {persistedRecord.solutionViewed ? "sí" : "no"}</span>
        </div>
      </div>

      <PracticeAttemptHistory practice={practice} record={persistedRecord} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="text-base font-semibold text-foreground">Notas personales</h2>
          <p className="mt-1 text-xs text-muted-foreground">Texto plano local; no pegues secretos, correos reales ni datos sensibles.</p>
          <textarea
            value={notesDraft}
            onChange={(event) => {
              setNotesDraft(event.target.value);
              setNotesSaved(false);
            }}
            rows={8}
            className="mt-3 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/20"
            aria-label="Notas personales de la práctica"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => { saveNotes(practice.id, notesDraft, evidenceKeys); setNotesSaved(true); }}>
              <Save className="mr-1 h-3.5 w-3.5" aria-hidden />
              Guardar notas
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setNotesDraft(""); clearNotes(practice.id, evidenceKeys); }}>
              Limpiar notas
            </Button>
            <span role="status" className="text-xs text-muted-foreground">{notesSaved ? "Notas guardadas localmente." : ""}</span>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="evidence-checklist-heading">
          <h2 id="evidence-checklist-heading" className="text-base font-semibold text-foreground">Evidencias producidas</h2>
          <p className="mt-1 text-xs text-muted-foreground">Marcar una evidencia no implica revisión externa.</p>
          <div className="mt-3 space-y-2">
            {evidenceKeys.map((item) => (
              <label key={item} className="flex items-start gap-2 rounded-lg border border-border bg-muted/15 p-2 text-sm">
                <input
                  type="checkbox"
                  checked={persistedRecord.evidenceChecklist[item] === true}
                  onChange={(event) => setEvidenceProduced(practice.id, item, event.target.checked, evidenceKeys)}
                  className="mt-1"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-50 p-2 text-xs text-muted-foreground dark:bg-amber-500/10">
            {practice.evidence.sensitiveDataWarning}
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="hints-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="hints-heading" className="text-base font-semibold text-foreground">Pistas escalonadas</h2>
          <Badge variant="outline">{persistedRecord.revealedHints.length}/{practice.hints.length} usadas</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Cada pista queda registrada para reflexión, sin penalización automática.</p>
        <div className="mt-3 grid gap-2">
          {practice.hints.map((hint) => {
            const revealed = persistedRecord.revealedHints.includes(hint.id);
            return (
              <div key={hint.id} className="rounded-lg border border-border bg-muted/15 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-[#B37800]" aria-hidden />
                    <span className="text-sm font-medium text-foreground">{hint.title}</span>
                    <Badge variant="outline">{PRACTICE_HINT_LEVEL_LABELS[hint.level]}</Badge>
                  </div>
                  {!revealed && (
                    <Button
                      size="sm"
                      variant="outline"
                      aria-expanded={revealed}
                      onClick={() => window.confirm("Revelar esta pista registrará su uso. ¿Continuar?") && revealHint(practice.id, hint.id, evidenceKeys)}
                    >
                      Revelar pista
                    </Button>
                  )}
                </div>
                {revealed && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{hint.content}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="solution-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="solution-heading" className="text-base font-semibold text-foreground">Solución de referencia</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Consultarla no marca la práctica como completada. Las soluciones forman parte de un sitio estático. El control de visualización busca fomentar el intento autónomo, pero no constituye una protección técnica del contenido.
            </p>
          </div>
          {solutionOpen ? (
            <Button size="sm" variant="outline" onClick={() => setSolutionOpen(false)}>
              <EyeOff className="mr-1 h-3.5 w-3.5" aria-hidden />
              Ocultar
            </Button>
          ) : null}
        </div>
        {!solutionOpen ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleSolution(true)}>
              <Eye className="mr-1 h-3.5 w-3.5" aria-hidden />
              Sí, ya intenté
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleSolution(false)}>
              Abrir de todos modos
            </Button>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-border bg-muted/15 p-4">
            <MarkdownRenderer content={practice.solutionMarkdown} />
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="assessment-heading">
        <h2 id="assessment-heading" className="text-base font-semibold text-foreground">Autoevaluación por rúbrica</h2>
        <p className="mt-1 text-xs text-muted-foreground">Estimación personal; no reemplaza revisión de mentor, tenant real ni validación profesional.</p>
        <div className="mt-4 grid gap-3">
          {practice.rubric.map((item) => (
            <div key={item.criterion} className="rounded-lg border border-border bg-muted/15 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={`criterion-${item.criterion}`} className="text-sm font-medium text-foreground">
                  {item.criterion}
                </label>
                <Badge variant="secondary">{item.weight}%</Badge>
              </div>
              <select
                id={`criterion-${item.criterion}`}
                value={levels[item.criterion] ?? "none"}
                onChange={(event) => setLevels((current) => ({ ...current, [item.criterion]: event.target.value as AssessmentLevel }))}
                className="mt-2 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
              >
                {ASSESSMENT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <input
                value={comments[item.criterion] ?? ""}
                onChange={(event) => setComments((current) => ({ ...current, [item.criterion]: event.target.value }))}
                placeholder="Comentario opcional"
                className="mt-2 w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                aria-label={`Comentario para ${item.criterion}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-border bg-muted/15 p-3">
          <p className="mb-2 text-sm font-medium text-foreground">Fallos críticos</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CRITICAL_FAILURE_OPTIONS.map((failure) => (
              <label key={failure} className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={criticalFailures.includes(failure)}
                  onChange={(event) => setCriticalFailures((current) => event.target.checked ? [...current, failure] : current.filter((item) => item !== failure))}
                  className="mt-1"
                />
                <span>{failure}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={cn("mt-4 rounded-lg border p-3 text-sm", assessmentPreview.satisfactory ? "border-[#107C10]/25 bg-[#F1FAF1] dark:bg-[rgba(16,124,16,0.10)]" : "border-amber-500/30 bg-amber-50 dark:bg-amber-500/10")}>
          <div className="flex items-center gap-2 font-semibold text-foreground">
            {assessmentPreview.satisfactory ? <CheckCircle2 className="h-4 w-4 text-[#107C10]" aria-hidden /> : <AlertTriangle className="h-4 w-4 text-[#B37800]" aria-hidden />}
            Resultado estimado: {assessmentPreview.score}%
          </div>
          <p className="mt-1 text-muted-foreground">{assessmentPreview.recommendation}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleSaveAssessment}>Guardar autoevaluación</Button>
          <Button size="sm" disabled={!completion.ok} onClick={handleComplete}>
            Marcar completada
          </Button>
          {!completion.ok && <span className="text-xs text-muted-foreground">Falta: {completion.missing.join(", ")}.</span>}
        </div>
      </section>
    </section>
  );
}

function PracticeAttemptHistory({ practice, record }: { practice: PracticeWorkspaceData; record: PracticeProgressRecord }) {
  const [selectedAttemptId, setSelectedAttemptId] = useState(record.activeAttemptId ?? record.attempts.at(-1)?.id ?? "");
  const selectedAttempt = record.attempts.find((attempt) => attempt.id === selectedAttemptId) ?? record.attempts.at(-1) ?? null;
  const comparison = compareLatestAttempts(record);

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

  function handleEvidencePackage() {
    const packageData = createEvidencePackage({
      id: practice.id,
      slug: practice.slug,
      title: practice.title,
      practiceType: practice.practiceType,
      difficulty: practice.difficulty,
      domain: practice.domain,
      roles: practice.roles,
      rubric: practice.rubric,
      evidence: practice.evidence,
    }, record, selectedAttempt?.id);
    const baseName = evidencePackageBaseName(practice.id, selectedAttempt?.attemptNumber);
    downloadFile(JSON.stringify(packageData, null, 2), `${baseName}.json`);
    downloadFile(evidencePackageMarkdown(packageData), `${baseName}.md`, "text/markdown");
  }

  function handleReviewTemplate() {
    downloadFile(createReviewTemplate({
      id: practice.id,
      slug: practice.slug,
      title: practice.title,
      practiceType: practice.practiceType,
      difficulty: practice.difficulty,
      domain: practice.domain,
      roles: practice.roles,
      rubric: practice.rubric,
      evidence: practice.evidence,
    }, selectedAttempt), `${evidencePackageBaseName(practice.id, selectedAttempt?.attemptNumber)}-revision.json`);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="attempt-history-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="attempt-history-heading" className="text-base font-semibold text-foreground">Historial y evidencia</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Los intentos anteriores se conservan para comparar evolución. Una revisión externa solo significa que una persona revisó este paquete con la rúbrica.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleEvidencePackage} disabled={!selectedAttempt}>
            <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
            Paquete de evidencia
          </Button>
          <Button size="sm" variant="outline" onClick={handleReviewTemplate} disabled={!selectedAttempt}>
            <FileText className="mr-1 h-3.5 w-3.5" aria-hidden />
            Plantilla de revisión
          </Button>
        </div>
      </div>

      {record.attempts.length === 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-muted/15 p-3 text-sm text-muted-foreground">
          Inicia la práctica o registra un intento para crear historial. Visitar esta página no crea intentos.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-2">
            {record.attempts.map((attempt) => (
              <button
                key={attempt.id}
                type="button"
                onClick={() => setSelectedAttemptId(attempt.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0078D4]",
                  selectedAttempt?.id === attempt.id ? "border-[#0078D4] bg-[#F3F9FD] dark:bg-[#0078D4]/10" : "border-border bg-muted/15 hover:bg-muted/30"
                )}
              >
                <span className="font-medium text-foreground">Intento {attempt.attemptNumber}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{attempt.status} · {attempt.selfAssessment?.score ?? "sin puntaje"}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/15 p-4">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <span>Inicio: {selectedAttempt?.startedAt ? new Date(selectedAttempt.startedAt).toLocaleString("es-CO") : "-"}</span>
              <span>Última actividad: {selectedAttempt?.updatedAt ? new Date(selectedAttempt.updatedAt).toLocaleString("es-CO") : "-"}</span>
              <span>Pistas: {selectedAttempt?.revealedHintIds.length ?? 0}/{practice.hints.length}</span>
              <span>Solución consultada: {selectedAttempt?.solutionViewed ? "sí" : "no"}</span>
              <span>Evidencias: {Object.values(selectedAttempt?.evidenceChecklist ?? {}).filter(Boolean).length}</span>
              <span>Fallos críticos: {selectedAttempt?.criticalFailures.length ?? 0}</span>
            </div>
            {selectedAttempt?.reflection && <p className="mt-3 text-sm text-muted-foreground">{selectedAttempt.reflection}</p>}
            {comparison.current && comparison.previous && (
              <div className="mt-4 rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-semibold text-foreground">
                  Comparación: {comparison.previous.selfAssessment?.score}% → {comparison.current.selfAssessment?.score}% ({comparison.scoreDelta >= 0 ? "+" : ""}{comparison.scoreDelta})
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {comparison.improved.length > 0
                    ? `Mejoraste en ${comparison.improved.slice(0, 3).join(", ")}.`
                    : comparison.worsened.length > 0
                      ? `Revisa ${comparison.worsened.slice(0, 3).join(", ")} antes del siguiente intento.`
                      : "La rúbrica se mantuvo estable entre intentos."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
