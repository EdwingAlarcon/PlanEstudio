"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { UI, type LevelId } from "@/lib/i18n";
import { getModulePrerequisiteWarning } from "@/lib/guided-journey";
import { useProgressStore } from "@/lib/progress";
import { useOnboardingStore } from "@/lib/onboarding-store";

const T = UI.modulePrerequisiteGate;

interface ModulePrerequisiteGateProps {
  moduleId: number;
  levelId: LevelId;
  previousModuleHref?: string;
}

export function ModulePrerequisiteGate({ moduleId, levelId, previousModuleHref }: ModulePrerequisiteGateProps) {
  const completedModules = useProgressStore((state) => state.completedModules);
  const navigationMode = useOnboardingStore((state) => state.navigationMode);

  if (navigationMode !== "guided") return null;

  const warning = getModulePrerequisiteWarning(moduleId, levelId, completedModules);
  if (!warning) return null;

  const body =
    warning.kind === "level_incomplete"
      ? T.levelIncompleteBody(UI.levels[warning.previousLevel], warning.completed, warning.total)
      : T.moduleSkippedBody(warning.previousModuleId);

  return (
    <section
      aria-labelledby="module-prerequisite-gate-heading"
      className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-950/20"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="module-prerequisite-gate-heading" className="text-sm font-semibold text-foreground">{T.title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          {warning.kind === "module_skipped" && previousModuleHref && (
            <Link
              href={previousModuleHref}
              className="mt-3 inline-block text-xs font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
            >
              {T.ctaSkipped}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
