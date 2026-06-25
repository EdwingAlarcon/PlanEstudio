"use client";

import { CheckCircle2 } from "lucide-react";
import { useProgressStore } from "@/lib/progress";

interface LabCardStatusProps {
  slug: string;
}

export function LabCardStatus({ slug }: LabCardStatusProps) {
  const isComplete = useProgressStore((s) => s.isLabComplete(slug));

  if (!isComplete) return null;

  return (
    <CheckCircle2
      className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
      aria-label="Completado"
    />
  );
}
