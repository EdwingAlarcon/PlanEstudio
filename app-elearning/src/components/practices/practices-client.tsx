"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, BriefcaseBusiness, CheckCircle2, Clock, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PRACTICE_DIFFICULTY_LABELS,
  PRACTICE_DOMAIN_LABELS,
  PRACTICE_ROLE_LABELS,
  PRACTICE_TYPE_LABELS,
  type PracticeDifficulty,
  type PracticeDomain,
  type PracticeRole,
  type PracticeType,
} from "@/lib/practice-meta";
import { getPracticeStatusLabel, usePracticeProgressStore, type PracticeStatus } from "@/lib/practice-progress";

export interface PracticeCard {
  id: string;
  slug: string;
  title: string;
  practiceType: PracticeType;
  domain: PracticeDomain;
  roles: PracticeRole[];
  difficulty: PracticeDifficulty;
  estimatedEffort: "short" | "medium" | "long";
  environment: {
    tenantRequired: "none" | "optional" | "recommended" | "required";
    codeRequired: boolean;
    tools: string[];
  };
  evidence: {
    required: string[];
  };
}

const TYPE_ORDER: PracticeType[] = ["incident", "challenge", "simulation", "semi-guided", "guided"];
const DIFFICULTY_ORDER: PracticeDifficulty[] = ["foundation", "practitioner", "advanced", "expert"];
const STATUS_ORDER: PracticeStatus[] = ["not_started", "in_progress", "attempted", "reviewed", "completed", "needs_reinforcement"];

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function intersects<T>(selected: Set<T>, values: T[]): boolean {
  if (selected.size === 0) return true;
  return values.some((value) => selected.has(value));
}

function FilterChips<T extends string>({
  label,
  options,
  selected,
  onToggle,
  labels,
}: {
  label: string;
  options: T[];
  selected: Set<T>;
  onToggle: (value: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.has(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-[#0078D4] bg-[#0078D4] text-white dark:border-[#4DB8FF] dark:bg-[#4DB8FF] dark:text-[#001B2E]"
                  : "border-border bg-card text-muted-foreground hover:border-[#0078D4]/40 hover:text-foreground"
              )}
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PracticesClient({ practices }: { practices: PracticeCard[] }) {
  const records = usePracticeProgressStore((s) => s.records);
  const [types, setTypes] = useState<Set<PracticeType>>(new Set());
  const [domains, setDomains] = useState<Set<PracticeDomain>>(new Set());
  const [roles, setRoles] = useState<Set<PracticeRole>>(new Set());
  const [difficulties, setDifficulties] = useState<Set<PracticeDifficulty>>(new Set());
  const [statuses, setStatuses] = useState<Set<PracticeStatus>>(new Set());

  const domainOptions = useMemo(
    () => [...new Set(practices.map((practice) => practice.domain))].sort(),
    [practices]
  );
  const roleOptions = useMemo(
    () => [...new Set(practices.flatMap((practice) => practice.roles))].sort(),
    [practices]
  );
  const difficultyOptions = DIFFICULTY_ORDER.filter((difficulty) => practices.some((practice) => practice.difficulty === difficulty));
  const typeOptions = TYPE_ORDER.filter((type) => practices.some((practice) => practice.practiceType === type));

  const filtered = practices.filter(
    (practice) =>
      intersects(types, [practice.practiceType]) &&
      intersects(domains, [practice.domain]) &&
      intersects(roles, practice.roles) &&
      intersects(difficulties, [practice.difficulty]) &&
      intersects(statuses, [records[practice.id]?.status ?? "not_started"])
  );

  const hasFilters = types.size > 0 || domains.size > 0 || roles.size > 0 || difficulties.size > 0 || statuses.size > 0;

  function clearFilters() {
    setTypes(new Set());
    setDomains(new Set());
    setRoles(new Set());
    setDifficulties(new Set());
    setStatuses(new Set());
  }

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-4 shadow-fluent-1" aria-labelledby="practice-filters-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#0078D4]" aria-hidden />
            <h2 id="practice-filters-heading" className="text-sm font-semibold text-foreground">
              Filtrar prácticas
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {filtered.length} de {practices.length}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
              >
                <X className="h-3 w-3" aria-hidden />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <FilterChips label="Tipo" options={typeOptions} selected={types} onToggle={(value) => setTypes((set) => toggle(set, value))} labels={PRACTICE_TYPE_LABELS} />
          <FilterChips label="Dominio" options={domainOptions} selected={domains} onToggle={(value) => setDomains((set) => toggle(set, value))} labels={PRACTICE_DOMAIN_LABELS} />
          <FilterChips label="Rol" options={roleOptions} selected={roles} onToggle={(value) => setRoles((set) => toggle(set, value))} labels={PRACTICE_ROLE_LABELS} />
          <FilterChips label="Dificultad" options={difficultyOptions} selected={difficulties} onToggle={(value) => setDifficulties((set) => toggle(set, value))} labels={PRACTICE_DIFFICULTY_LABELS} />
          <FilterChips
            label="Estado"
            options={STATUS_ORDER}
            selected={statuses}
            onToggle={(value) => setStatuses((set) => toggle(set, value))}
            labels={Object.fromEntries(STATUS_ORDER.map((status) => [status, getPracticeStatusLabel(status)])) as Record<PracticeStatus, string>}
          />
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((practice) => (
          <Link key={practice.id} href={`/experiencia-practica/${practice.slug}`} className="group">
            <article className="h-full rounded-xl border border-border bg-card p-4 shadow-fluent-1 transition-all duration-200 hover:border-[#0078D4]/30 hover:shadow-fluent-4">
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <Badge variant={practice.practiceType === "incident" ? "destructive" : practice.practiceType === "challenge" ? "avanzado" : "arquitecto"} className="font-mono">
                  {practice.id}
                </Badge>
                <Badge variant="outline">{PRACTICE_TYPE_LABELS[practice.practiceType]}</Badge>
                <Badge variant="outline">{PRACTICE_DIFFICULTY_LABELS[practice.difficulty]}</Badge>
                <Badge variant={records[practice.id]?.status === "completed" ? "default" : records[practice.id]?.status === "needs_reinforcement" ? "destructive" : "outline"}>
                  {getPracticeStatusLabel(records[practice.id]?.status ?? "not_started")}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF]">
                {practice.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {PRACTICE_DOMAIN_LABELS[practice.domain]} · {practice.roles.map((role) => PRACTICE_ROLE_LABELS[role]).slice(0, 2).join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden />
                  Esfuerzo {practice.estimatedEffort}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BriefcaseBusiness className="h-3 w-3" aria-hidden />
                  {practice.environment.tenantRequired === "required" ? "Tenant requerido" : "Tenant opcional/recomendado"}
                </span>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-muted/25 p-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Evidencia:</span> {practice.evidence.required.slice(0, 3).join(", ")}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 opacity-30" aria-hidden />
          Ninguna práctica coincide con estos filtros.
        </div>
      )}

      <div className="rounded-xl border border-[#107C10]/25 bg-[#F1FAF1] p-4 text-sm leading-relaxed text-muted-foreground dark:bg-[rgba(16,124,16,0.10)]">
        <div className="mb-1 flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle2 className="h-4 w-4 text-[#107C10]" aria-hidden />
          Protección pedagógica
        </div>
        Las soluciones están en contenido estático y técnicamente son accesibles. La intención no es ocultarlas de forma criptográfica, sino promover intento autónomo, evidencia y defensa antes de consultarlas.
      </div>
    </>
  );
}
