"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/lib/progress";

interface LabCompleteButtonProps {
  slug: string;
}

export function LabCompleteButton({ slug }: LabCompleteButtonProps) {
  const isComplete = useProgressStore((s) => s.isLabComplete(slug));
  const toggle = useProgressStore((s) => s.toggleLabComplete);

  return (
    <Button
      variant={isComplete ? "default" : "outline"}
      size="sm"
      onClick={() => toggle(slug)}
      className="gap-2"
    >
      {isComplete ? (
        <>
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Completado
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" aria-hidden />
          Marcar como completado
        </>
      )}
    </Button>
  );
}
