"use client";

import { useEffect } from "react";
import { Languages } from "lucide-react";
import {
  ENVIRONMENT_LANGUAGE_LABELS,
  useUiLanguageStore,
  type EnvironmentLanguage,
} from "@/lib/ui-language";

const OPTIONS: EnvironmentLanguage[] = ["both", "es", "en"];

// Selector "Interfaz de tu ambiente": decide cómo se muestran las etiquetas de menús y botones
// de Microsoft en el contenido. El curso siempre está en español; esto es el idioma del tenant.
export function EnvironmentLanguageSwitch({ className = "hidden md:flex" }: { className?: string }) {
  const language = useUiLanguageStore((s) => s.environmentLanguage);
  const setLanguage = useUiLanguageStore((s) => s.setEnvironmentLanguage);

  useEffect(() => {
    void useUiLanguageStore.persist.rehydrate();
  }, []);

  return (
    <label className={`${className} items-center gap-1.5 text-xs text-muted-foreground`} title="Idioma de la interfaz de tu ambiente de Microsoft. Cambia cómo se citan menús y botones en los módulos.">
      <Languages className="h-4 w-4" aria-hidden />
      <span>Interfaz de tu ambiente</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as EnvironmentLanguage)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
        data-testid="environment-language"
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>{ENVIRONMENT_LANGUAGE_LABELS[option]}</option>
        ))}
      </select>
    </label>
  );
}
