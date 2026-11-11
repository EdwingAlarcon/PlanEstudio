"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UI_TERMS } from "@/data/ui-terms";

// Idioma de la interfaz del ambiente del alumno (no el idioma del curso, que siempre es español).
// El contenido cita las etiquetas en inglés en negrita; con esta preferencia la app añade (o antepone)
// la etiqueta oficial en español para que nadie se bloquee por tener el tenant en otro idioma.
// Es una preferencia de presentación, como el tema: no forma parte del backup de progreso.
export type EnvironmentLanguage = "en" | "es" | "both";

export const ENVIRONMENT_LANGUAGE_LABELS: Record<EnvironmentLanguage, string> = {
  en: "Inglés",
  es: "Español",
  both: "Ambos",
};

interface UiLanguageState {
  environmentLanguage: EnvironmentLanguage;
  setEnvironmentLanguage: (language: EnvironmentLanguage) => void;
}

export const useUiLanguageStore = create<UiLanguageState>()(
  persist(
    (set) => ({
      environmentLanguage: "both",
      setEnvironmentLanguage: (environmentLanguage) => set({ environmentLanguage }),
    }),
    {
      name: "planestudio.ui-language.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // El HTML estático se genera con "both"; la preferencia guardada se aplica tras montar
      // (EnvironmentLanguageSwitch llama a rehydrate) para no provocar errores de hidratación.
      skipHydration: true,
    },
  ),
);

// Solo se usan términos verificados en una fuente oficial.
const TERM_MAP: ReadonlyMap<string, string> = new Map(
  UI_TERMS.filter((term) => term.verified && term.es && term.es !== term.en).map((term) => [term.en, term.es]),
);

/** Etiqueta oficial en español para una etiqueta en inglés citada en el contenido, si está verificada. */
export function getSpanishLabel(englishLabel: string): string | undefined {
  return TERM_MAP.get(englishLabel.trim());
}

export function getVerifiedTermCount(): number {
  return TERM_MAP.size;
}
