"use client";

import { useEffect, useState } from "react";
import { StickyNote } from "lucide-react";
import { useProgressStore } from "@/lib/progress";

const MAX_NOTE_LENGTH = 4000;

export function ModuleNotes({ moduleId }: { moduleId: string }) {
  const saved = useProgressStore((s) => s.moduleNotes?.[moduleId] ?? "");
  const setModuleNote = useProgressStore((s) => s.setModuleNote);
  const [draft, setDraft] = useState(saved);

  // Adopt the persisted value once hydration delivers it or a backup is imported.
  useEffect(() => setDraft(saved), [saved]);

  useEffect(() => {
    if (draft === saved) return;
    const id = window.setTimeout(() => setModuleNote(moduleId, draft), 500);
    return () => window.clearTimeout(id);
  }, [draft, saved, moduleId, setModuleNote]);

  return (
    <section aria-labelledby="module-notes-heading" className="rounded-xl border border-border bg-card px-6 py-5 shadow-fluent-1">
      <h2 id="module-notes-heading" className="flex items-center gap-2 text-base font-semibold text-foreground">
        <StickyNote className="h-4 w-4 text-[#0078D4]" aria-hidden />
        Mis notas
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">Privadas: se guardan solo en este navegador y entran en tu backup.</p>
      <textarea
        aria-label="Notas personales del módulo"
        value={draft}
        maxLength={MAX_NOTE_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        rows={4}
        className="mt-3 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground"
        placeholder="Dudas, atajos, comandos que quieres recordar…"
      />
    </section>
  );
}
