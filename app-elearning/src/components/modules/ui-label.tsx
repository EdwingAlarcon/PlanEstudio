"use client";

import type { ReactNode } from "react";
import { getSpanishLabel, useUiLanguageStore } from "@/lib/ui-language";

// Negrita del contenido. Si el texto es una etiqueta de interfaz con equivalente oficial en español,
// la muestra según el idioma del ambiente del alumno: "Ambos" → Tables (ES: Tablas),
// "Español" → Tablas (EN: Tables), "Inglés" → Tables.
export function UiLabel({ text, children }: { text: string; children: ReactNode }) {
  const language = useUiLanguageStore((s) => s.environmentLanguage);
  const spanish = getSpanishLabel(text);

  if (!spanish || language === "en") return <strong>{children}</strong>;

  if (language === "es") {
    return (
      <span title={`En inglés: ${text}`}>
        <strong>{spanish}</strong>
        <span className="ml-1 text-[0.85em] font-normal text-muted-foreground">(EN: {text})</span>
      </span>
    );
  }

  return (
    <span title={`En español: ${spanish}`}>
      <strong>{children}</strong>
      <span className="ml-1 text-[0.85em] font-normal text-muted-foreground">(ES: {spanish})</span>
    </span>
  );
}
