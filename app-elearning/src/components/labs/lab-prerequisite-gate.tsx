"use client";

import { ShieldAlert } from "lucide-react";
import { UI } from "@/lib/i18n";
import { getLabPrerequisiteWarning } from "@/lib/guided-journey";
import { useProgressStore } from "@/lib/progress";
import { useOnboardingStore } from "@/lib/onboarding-store";

const T = UI.labPrerequisiteGate;

interface LabPrerequisiteGateProps {
  prerequisites: string[];
}

export function LabPrerequisiteGate({ prerequisites }: LabPrerequisiteGateProps) {
  const completedModules = useProgressStore((state) => state.completedModules);
  const navigationMode = useOnboardingStore((state) => state.navigationMode);

  if (navigationMode !== "guided") return null;

  const warning = getLabPrerequisiteWarning(prerequisites, completedModules);
  if (!warning) return null;

  return (
    <section
      aria-labelledby="lab-prerequisite-gate-heading"
      className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-950/20"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="lab-prerequisite-gate-heading" className="text-sm font-semibold text-foreground">{T.title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{T.body}</p>
          <ul className="mt-2 space-y-1">
            {warning.unmet.map((prereq) => (
              <li key={prereq} className="text-xs text-foreground/90">{prereq}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
