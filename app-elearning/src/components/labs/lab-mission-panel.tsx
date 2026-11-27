"use client";

import { CheckCircle2, ExternalLink, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgressStore } from "@/lib/progress";
import {
  isEvidenceComplete,
  isLabVerified,
  MIN_EVIDENCE_NOTE_LENGTH,
  type LabEvidence,
  type LabMission,
} from "@/lib/lab-mission";
import { XP_RULES } from "@/lib/xp";
import { cn } from "@/lib/utils";

// Lab como misión (F3): el alumno marca las comprobaciones del cierre del lab y anota su evidencia (IDs, nombres,
// cifras). Con todo marcado y la evidencia anotada entrega la misión: el lab queda completado y vale 100 XP.
const EMPTY: LabEvidence = { checks: [], note: "" };

export function LabMissionPanel({ slug, mission }: { slug: string; mission: LabMission }) {
  const evidence = useProgressStore((s) => s.labEvidence?.[slug]) ?? EMPTY;
  const setLabEvidence = useProgressStore((s) => s.setLabEvidence);
  const markLabComplete = useProgressStore((s) => s.markLabComplete);
  const verified = isLabVerified(evidence);
  const complete = isEvidenceComplete(evidence, mission.checks);
  const marked = new Set(evidence.checks);
  const done = mission.checks.filter((c) => marked.has(c)).length;
  const missingNote = Math.max(0, MIN_EVIDENCE_NOTE_LENGTH - evidence.note.trim().length);

  const toggle = (check: string) => {
    const next = marked.has(check) ? evidence.checks.filter((c) => c !== check) : [...evidence.checks, check];
    // Desmarcar una comprobación retira la entrega: la evidencia ya no está completa.
    setLabEvidence(slug, { checks: next, verifiedAt: marked.has(check) ? undefined : evidence.verifiedAt });
  };

  const submit = () => {
    if (!complete) return;
    setLabEvidence(slug, { verifiedAt: new Date().toISOString() });
    markLabComplete(slug);
  };

  return (
    <section
      aria-labelledby="lab-mission-heading"
      data-testid="lab-mission"
      className={cn(
        "rounded-xl border bg-card px-6 py-5 shadow-fluent-1",
        verified ? "border-amber-500/50" : "border-[#0078D4]/25",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id="lab-mission-heading" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Target className="h-5 w-5 text-[#0078D4] dark:text-[#4DB8FF]" aria-hidden />
          Tu misión
        </h2>
        <Badge variant="outline" className="text-amber-700 dark:text-amber-400" data-testid="lab-mission-reward">
          {verified ? `${XP_RULES.labVerified} XP ganados` : `${XP_RULES.labVerified} XP con evidencia · ${XP_RULES.lab} solo marcado`}
        </Badge>
      </div>
      {mission.objective && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mission.objective}</p>}

      {mission.checks.length > 0 && (
        <fieldset className="mt-4 space-y-2">
          <legend className="text-sm font-semibold text-foreground">
            Al terminar, comprueba ({done}/{mission.checks.length})
          </legend>
          <ul className="space-y-1.5">
            {mission.checks.map((check, i) => (
              <li key={check}>
                <label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed text-foreground/90">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-[#0078D4]"
                    checked={marked.has(check)}
                    onChange={() => toggle(check)}
                    data-testid={`lab-mission-check-${i}`}
                  />
                  <span>{check}</span>
                </label>
              </li>
            ))}
          </ul>
          {mission.checksSource && (
            <p className="text-xs text-muted-foreground">Sale de «{mission.checksSource}» del lab.</p>
          )}
        </fieldset>
      )}

      <div className="mt-4 space-y-2">
        <label htmlFor={`lab-evidence-${slug}`} className="text-sm font-semibold text-foreground">
          Tu evidencia
        </label>
        {mission.evidence.length > 0 && (
          <ul className="list-disc space-y-0.5 pl-5 text-xs leading-relaxed text-muted-foreground">
            {mission.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <textarea
          id={`lab-evidence-${slug}`}
          data-testid="lab-mission-note"
          rows={4}
          value={evidence.note}
          onChange={(e) => setLabEvidence(slug, { note: e.target.value })}
          placeholder="Anota lo que produjiste: nombres de esquema, IDs de ejecución, cifras que obtuviste, dónde guardaste las capturas."
          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0078D4]/40"
        />
        <p className="text-xs text-muted-foreground">
          Se guarda solo en este navegador (y en tu backup). La app no ve tu ambiente: la evidencia es tu compromiso.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {verified ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400" data-testid="lab-mission-done">
            <Trophy className="h-4 w-4" aria-hidden />
            Misión entregada
          </p>
        ) : (
          <>
            <Button size="sm" onClick={submit} disabled={!complete} className="gap-2" data-testid="lab-mission-submit">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Entregar la misión
            </Button>
            {!complete && (
              <span className="text-xs text-muted-foreground">
                {done < mission.checks.length
                  ? `Te faltan ${mission.checks.length - done} comprobaciones`
                  : `Anota tu evidencia (${missingNote} caracteres más)`}
              </span>
            )}
          </>
        )}
      </div>

      {mission.learnLinks.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">Profundiza en Microsoft Learn</p>
          <ul className="mt-2 space-y-1">
            {mission.learnLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
                >
                  {link.title}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
