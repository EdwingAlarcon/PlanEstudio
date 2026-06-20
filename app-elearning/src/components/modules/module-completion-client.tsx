"use client";

import { useProgressStore } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ModuleCompletionClient({ moduleId }: { moduleId: string }) {
  const isComplete = useProgressStore((s) => s.isModuleComplete(moduleId));
  const toggle = useProgressStore((s) => s.toggleModuleComplete);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "gap-1.5 shrink-0",
        isComplete ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
      )}
      onClick={() => toggle(moduleId)}
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
  );
}
