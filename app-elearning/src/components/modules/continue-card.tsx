"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/lib/progress";

export interface ContinueModuleRef {
  id: string;
  title: string;
  href: string;
}

// Shows the last module the student opened. Renders nothing until one exists
// (or if that module no longer exists), so first-time visitors see no change.
export function ContinueCard({ modules }: { modules: ContinueModuleRef[] }) {
  const lastVisited = useProgressStore((s) => s.lastVisited);
  const completed = useProgressStore((s) => (lastVisited ? s.completedModules.includes(lastVisited) : false));
  const target = lastVisited ? modules.find((m) => m.id === lastVisited) : undefined;
  if (!target) return null;

  return (
    <section aria-label="Continuar" className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-fluent-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <BookOpen className="h-5 w-5 shrink-0 text-[#0078D4]" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{completed ? "Último módulo visto (completado)" : "Continuar donde lo dejaste"}</p>
          <p className="truncate text-sm font-semibold text-foreground">{target.title}</p>
        </div>
      </div>
      <Button asChild size="sm" className="self-start sm:self-auto">
        <Link href={target.href}>
          {completed ? "Repasar" : "Continuar"}
          <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
