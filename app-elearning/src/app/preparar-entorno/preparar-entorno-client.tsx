"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Circle, ExternalLink, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UI } from "@/lib/i18n";
import { useOnboardingStore } from "@/lib/onboarding-store";
import {
  ESSENTIAL_SETUP_STEPS,
  OPERATING_SYSTEMS,
  WORKSTATION_PROFILES,
  getEssentialSetupProgress,
  getNextWorkstationRequirement,
  getToolsForProfile,
  recommendWorkstationProfile,
  type OperatingSystem,
  type ToolStatus,
  type WorkstationProfile,
  type WorkstationTool,
} from "@/lib/workstation";
import { useWorkstationStore } from "@/lib/workstation-store";
import { cn } from "@/lib/utils";

const T = UI.workstation;

const DEFAULT_OS: OperatingSystem = "windows";

export function PrepararEntornoClient() {
  const onboarding = useOnboardingStore();
  const workstation = useWorkstationStore();

  const recommendedProfile = useMemo(() => recommendWorkstationProfile(onboarding.answers), [onboarding.answers]);
  const profile: WorkstationProfile = workstation.profileOverride ?? recommendedProfile;
  const os: OperatingSystem = workstation.os ?? DEFAULT_OS;

  const tools = useMemo(() => getToolsForProfile(profile, os), [profile, os]);
  const nextRequirement = useMemo(
    () => getNextWorkstationRequirement(profile, os, workstation.toolStates),
    [profile, os, workstation.toolStates]
  );
  const essentialProgress = getEssentialSetupProgress(workstation.essentialSteps);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{T.title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{T.subtitle}</p>
      </header>

      <section aria-labelledby="profile-heading" className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
        <h2 id="profile-heading" className="mb-3 text-sm font-semibold text-foreground">{T.profileLabel}</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label={T.profileLabel}>
          {WORKSTATION_PROFILES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => workstation.setProfileOverride(option === recommendedProfile ? null : option)}
              aria-pressed={profile === option}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                profile === option
                  ? "border-[#0078D4] bg-[#EFF6FC] text-[#005A9E] dark:bg-[rgba(0,120,212,0.12)] dark:text-[#4DB8FF]"
                  : "border-border bg-background text-foreground/80 hover:border-[#0078D4]/40"
              )}
            >
              {T.profile[option]}
              {option === recommendedProfile && <span className="ml-1 text-muted-foreground">·recomendado</span>}
            </button>
          ))}
        </div>

        <h2 className="mb-3 mt-5 text-sm font-semibold text-foreground">{T.osLabel}</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label={T.osLabel}>
          {OPERATING_SYSTEMS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => workstation.setOs(option)}
              aria-pressed={os === option}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                os === option
                  ? "border-[#0078D4] bg-[#EFF6FC] text-[#005A9E] dark:bg-[rgba(0,120,212,0.12)] dark:text-[#4DB8FF]"
                  : "border-border bg-background text-foreground/80 hover:border-[#0078D4]/40"
              )}
            >
              {T.os[option]}
            </button>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="next-requirement-heading"
        className="rounded-xl border border-[#0078D4]/20 bg-[#EFF6FC] p-5 dark:border-[#4DB8FF]/20 dark:bg-[rgba(0,120,212,0.10)]"
      >
        <p id="next-requirement-heading" className="text-xs font-semibold uppercase tracking-widest text-[#0078D4] dark:text-[#4DB8FF]">
          {nextRequirement ? T.nextRequirementTitle : T.allRequiredDoneTitle}
        </p>
        {nextRequirement ? (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{nextRequirement.name}</h2>
              {nextRequirement.verification && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">{nextRequirement.verification.command}</p>
              )}
            </div>
            <Button
              className="w-full shrink-0 bg-[#0078D4] text-white hover:bg-[#106EBE] sm:w-auto"
              onClick={() => workstation.markTool(nextRequirement.id, "installed")}
            >
              {T.nextRequirementCta}
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{T.allRequiredDoneBody}</p>
        )}
      </section>

      <section aria-labelledby="essential-heading" className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 id="essential-heading" className="text-sm font-semibold text-foreground">{T.essentialSetupTitle}</h2>
          <span className="text-xs text-muted-foreground">{essentialProgress.completed}/{essentialProgress.total}</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">{T.essentialSetupSubtitle}</p>
        <Progress value={essentialProgress.percentage} className="mb-4 h-1.5" />

        <ul className="space-y-2">
          {ESSENTIAL_SETUP_STEPS.map((step) => {
            const done = Boolean(workstation.essentialSteps[step.id]);
            return (
              <li key={step.id} className="rounded-lg border border-border bg-background p-3">
                <button
                  type="button"
                  onClick={() => workstation.toggleEssentialStep(step.id, !done)}
                  aria-pressed={done}
                  className="flex w-full items-start gap-3 text-left"
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#107C10]" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-medium", done ? "text-foreground" : "text-foreground/90")}>
                      {step.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{step.outcome}</span>
                    {workstation.hasTenant === false && (
                      <span className="mt-1 block text-xs text-[#0078D4] dark:text-[#4DB8FF]">{step.tenantAlternative}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">¿Tienes tenant?</span>
          <button
            type="button"
            onClick={() => workstation.setTenant(true)}
            className={cn("rounded-full border px-2.5 py-1", workstation.hasTenant === true ? "border-[#0078D4] bg-[#EFF6FC] text-[#005A9E] dark:bg-[rgba(0,120,212,0.12)] dark:text-[#4DB8FF]" : "border-border")}
          >
            Si
          </button>
          <button
            type="button"
            onClick={() => workstation.setTenant(false)}
            className={cn("rounded-full border px-2.5 py-1", workstation.hasTenant === false ? "border-[#0078D4] bg-[#EFF6FC] text-[#005A9E] dark:bg-[rgba(0,120,212,0.12)] dark:text-[#4DB8FF]" : "border-border")}
          >
            No
          </button>
        </div>

        {workstation.hasTenant === false && (
          <p className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">{T.noTenantAlternativeTitle}: </strong>
            {T.noTenantAlternativeBody}
          </p>
        )}
      </section>

      <section
        aria-labelledby="non-production-heading"
        className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-950/20"
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <div>
            <h2 id="non-production-heading" className="text-sm font-semibold text-foreground">{T.nonProductionWarningTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{T.nonProductionWarningBody}</p>
          </div>
        </div>
      </section>

      <Separator />

      <section aria-labelledby="matrix-heading">
        <h2 id="matrix-heading" className="text-sm font-semibold text-foreground">{T.matrixTitle}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{T.matrixSubtitle}</p>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">Herramienta</th>
                <th scope="col" className="px-4 py-2 font-medium">Requisito</th>
                <th scope="col" className="px-4 py-2 font-medium">Estado</th>
                <th scope="col" className="px-4 py-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <ToolRow key={tool.id} tool={tool} profile={profile} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one card per tool */}
        <ul className="space-y-3 md:hidden">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} profile={profile} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function requirementBadge(tool: WorkstationTool, profile: WorkstationProfile) {
  const requirement = tool.requiredBy[profile];
  const variant = requirement === "required" ? "destructive" : requirement === "recommended" ? "default" : "outline";
  return <Badge variant={variant}>{T.requirement[requirement]}</Badge>;
}

function StatusIndicator({ status }: { status: ToolStatus }) {
  const isDone = status === "installed" || status === "verified";
  const Icon = isDone ? CheckCircle2 : status === "blocked" || status === "outdated" ? AlertTriangle : Circle;
  const color = isDone
    ? "text-[#107C10]"
    : status === "blocked" || status === "outdated"
      ? "text-amber-600 dark:text-amber-400"
      : "text-muted-foreground";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <Icon className={cn("h-3.5 w-3.5", color)} aria-hidden />
      {T.status[status]}
    </span>
  );
}

function ToolActions({ tool }: { tool: WorkstationTool }) {
  const workstation = useWorkstationStore();
  const status = workstation.toolStates[tool.id]?.status ?? "unknown";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => workstation.markTool(tool.id, "installed")} disabled={status === "installed" || status === "verified"}>
        {T.markInstalled}
      </Button>
      {tool.verification && (
        <Button size="sm" variant="outline" onClick={() => workstation.markTool(tool.id, "verified")} disabled={status === "verified"}>
          {T.markVerified}
        </Button>
      )}
      <a
        href={tool.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
      >
        {T.officialDocs}
        <ExternalLink className="h-3 w-3" aria-hidden />
      </a>
    </div>
  );
}

function ToolRow({ tool, profile }: { tool: WorkstationTool; profile: WorkstationProfile }) {
  const workstation = useWorkstationStore();
  const status = workstation.toolStates[tool.id]?.status ?? "unknown";
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 font-medium text-foreground">{tool.name}</td>
      <td className="px-4 py-3">{requirementBadge(tool, profile)}</td>
      <td className="px-4 py-3"><StatusIndicator status={status} /></td>
      <td className="px-4 py-3"><ToolActions tool={tool} /></td>
    </tr>
  );
}

function ToolCard({ tool, profile }: { tool: WorkstationTool; profile: WorkstationProfile }) {
  const workstation = useWorkstationStore();
  const status = workstation.toolStates[tool.id]?.status ?? "unknown";
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-medium text-foreground">{tool.name}</h3>
        {requirementBadge(tool, profile)}
      </div>
      <div className="mb-3"><StatusIndicator status={status} /></div>
      <ToolActions tool={tool} />
    </li>
  );
}
