"use client";

import { useEffect, useState } from "react";
import { useProgressStore } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ModuleCompletionClient({ moduleId }: { moduleId: string }) {
  const isComplete = useProgressStore((s) => s.isModuleComplete(moduleId));
  const toggle = useProgressStore((s) => s.toggleModuleComplete);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (!justCompleted) return;
    const id = window.setTimeout(() => setJustCompleted(false), 5000);
    return () => window.clearTimeout(id);
  }, [justCompleted]);

  function handleToggle() {
    if (!isComplete) setJustCompleted(true);
    toggle(moduleId);
  }

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1.5 shrink-0",
          isComplete ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}
        onClick={handleToggle}
        aria-label={isComplete ? UI.module.markIncomplete : UI.module.markComplete}
        aria-pressed={isComplete}
      >
        {isComplete ? (
          <CheckCircle2 className="h-4 w-4" aria-hidden />
        ) : (
          <Circle className="h-4 w-4" aria-hidden />
        )}
        <span className="hidden sm:inline text-xs">
          {isComplete ? UI.module.completed : UI.module.markComplete}
        </span>
      </Button>
      {justCompleted && (
        <p className="text-[11px] text-muted-foreground max-w-[14rem] text-right" aria-live="polite">
          Sus preguntas volverán a aparecer gradualmente en Repaso inteligente.
        </p>
      )}
    </div>
  );
}
