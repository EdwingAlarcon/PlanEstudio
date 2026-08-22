"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, ChevronRight, Clock, FlaskConical, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabCardStatus } from "./lab-card-status";
import type { DomainTag, LabPresentationMeta } from "@/lib/lab-metadata";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/progress";
import { LEVEL_ORDER as CONTENT_LEVEL_ORDER, type LevelId } from "@/lib/i18n";

const LEVEL_ID_TO_CODE: Record<LevelId, string> = {
  basico: "N1",
  intermedio: "N2",
  avanzado: "N3",
  arquitecto: "N4",
  ia: "N5",
  d365: "N6",
  rpa: "RPA",
};

// completedModules entries look like "basico-1"; the level id is everything before the last "-".
function getActiveLevelCode(completedModules: string[]): string {
  if (completedModules.length === 0) return "N1";
  const completedLevelIds = new Set(
    completedModules.map((entry) => entry.slice(0, entry.lastIndexOf("-")))
  );
  const furthestLevelId = [...CONTENT_LEVEL_ORDER].reverse().find((levelId) => completedLevelIds.has(levelId));
  return furthestLevelId ? LEVEL_ID_TO_CODE[furthestLevelId] : "N1";
}

export interface LabWithMeta {
  slug: string;
  displayId: string;
  title: string;
  level: string;
  duration: number;
  products: string[];
  role: string[];
  meta: LabPresentationMeta;
}

const LEVEL_CONFIG: Record<string, { label: string; bar: string; accent: string }> = {
  N1: { label: "Nivel 1 — Básico",      bar: "bg-[#107C10]",  accent: "#107C10" },
  N2: { label: "Nivel 2 — Intermedio",  bar: "bg-[#0078D4]",  accent: "#0078D4" },
  N3: { label: "Nivel 3 — Avanzado",    bar: "bg-orange-500", accent: "#EA580C" },
  N4: { label: "Nivel 4 — Arquitecto",  bar: "bg-[#D13438]",  accent: "#D13438" },
  N5: { label: "Nivel IA — Desarrollo Asistido", bar: "bg-purple-600", accent: "#9333EA" },
  N6: { label: "Nivel D365 — Dynamics 365 Especialización", bar: "bg-teal-600", accent: "#0D9488" },
  RPA: { label: "Especialización RPA — Power Automate Desktop", bar: "bg-[#6B4EFF]", accent: "#6B4EFF" },
};

const LEVEL_ORDER = ["N1", "N2", "N3", "N4", "N5", "N6", "RPA"];

const CERT_VARIANT: Record<string, "basico" | "intermedio" | "avanzado" | "arquitecto" | "ia" | "d365" | "rpa" | "default"> = {
  "PL-900": "basico",
  "PL-200": "intermedio",
  "PL-200 (retira 31 ago 2026)": "intermedio",
  "PL-400": "avanzado",
  "Arquitectura Power Platform": "arquitecto",
  "Buenas Prácticas": "ia",
  "Especialista Dynamics 365 CE": "d365",
  "D365 CE avanzado + F&O awareness": "d365",
  "CE avanzado + F&O Awareness": "d365",
  "D365 Especialización": "d365",
  "D365 Especialización Integration": "d365",
  "D365 Especialización Portfolio": "d365",
  "Power Automate Desktop & RPA": "rpa",
  "RPA": "rpa",
};

const DOMAIN_ORDER: DomainTag[] = ["Power Platform", "Dynamics 365", "Integración", "IA", "RPA", "Empleabilidad"];
const DIFFICULTY_ORDER = ["Fundacional", "Intermedia", "Avanzada", "Enterprise", "Especializada", "Especializada D365", "Especializada RPA"];

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function intersects<T>(selected: Set<T>, values: T[]): boolean {
  if (selected.size === 0) return true;
  return values.some((v) => selected.has(v));
}

function orderBy<T>(values: Iterable<T>, order: T[]): T[] {
  const set = new Set(values);
  const ordered = order.filter((v) => set.has(v));
  const rest = [...set].filter((v) => !order.includes(v));
  return [...ordered, ...rest];
}

interface FilterChipsProps<T extends string> {
  label: string;
  options: T[];
  selected: Set<T>;
  onToggle: (value: T) => void;
}

function FilterChips<T extends string>({ label, options, selected, onToggle }: FilterChipsProps<T>) {
  if (options.length === 0) return null;

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
              onClick={() => onToggle(option)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-[#0078D4] bg-[#0078D4] text-white dark:border-[#4DB8FF] dark:bg-[#4DB8FF] dark:text-[#001B2E]"
                  : "border-border bg-card text-muted-foreground hover:border-[#0078D4]/40 hover:text-foreground"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LabsClient({ labs }: { labs: LabWithMeta[] }) {
  const [selectedDomains, setSelectedDomains] = useState<Set<DomainTag>>(new Set());
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set());
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});
  const completedModules = useProgressStore((s) => s.completedModules);
  const activeLevelCode = useMemo(() => getActiveLevelCode(completedModules), [completedModules]);

  const roleOptions = useMemo(
    () => [...new Set(labs.flatMap((l) => l.role))].sort((a, b) => a.localeCompare(b)),
    [labs]
  );
  const difficultyOptions = useMemo(
    () => orderBy(labs.map((l) => l.meta.difficulty), DIFFICULTY_ORDER),
    [labs]
  );

  const hasActiveFilters =
    selectedDomains.size > 0 || selectedRoles.size > 0 || selectedLevels.size > 0 || selectedDifficulties.size > 0;

  const filteredLabs = useMemo(
    () =>
      labs.filter(
        (lab) =>
          intersects(selectedDomains, lab.meta.domains) &&
          intersects(selectedRoles, lab.role) &&
          intersects(selectedLevels, [lab.level]) &&
          intersects(selectedDifficulties, [lab.meta.difficulty])
      ),
    [labs, selectedDomains, selectedRoles, selectedLevels, selectedDifficulties]
  );

  const byLevel = filteredLabs.reduce<Record<string, LabWithMeta[]>>((acc, lab) => {
    const key = lab.level || "otros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lab);
    return acc;
  }, {});

  function clearFilters() {
    setSelectedDomains(new Set());
    setSelectedRoles(new Set());
    setSelectedLevels(new Set());
    setSelectedDifficulties(new Set());
  }

  return (
    <>
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="filters-heading" className="mb-8 rounded-xl border border-border bg-card p-4 shadow-fluent-1">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="filters-heading" className="text-sm font-semibold text-foreground">
            Filtrar laboratorios
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {filteredLabs.length} de {labs.length} labs
            </span>
            {hasActiveFilters && (
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
          <FilterChips
            label="Dominio"
            options={DOMAIN_ORDER}
            selected={selectedDomains}
            onToggle={(v) => setSelectedDomains((s) => toggle(s, v))}
          />
          <FilterChips
            label="Rol"
            options={roleOptions}
            selected={selectedRoles}
            onToggle={(v) => setSelectedRoles((s) => toggle(s, v))}
          />
          <FilterChips
            label="Nivel"
            options={LEVEL_ORDER}
            selected={selectedLevels}
            onToggle={(v) => setSelectedLevels((s) => toggle(s, v))}
          />
          <FilterChips
            label="Dificultad"
            options={difficultyOptions}
            selected={selectedDifficulties}
            onToggle={(v) => setSelectedDifficulties((s) => toggle(s, v))}
          />
        </div>
      </section>

      {filteredLabs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Ningún laboratorio coincide con estos filtros.</p>
        </div>
      )}

      {/* ── Labs grouped by level ────────────────────────────────────────── */}
      {LEVEL_ORDER.map((levelKey) => {
        const levelLabs = byLevel[levelKey];
        if (!levelLabs || levelLabs.length === 0) return null;
        const cfg = LEVEL_CONFIG[levelKey] ?? { label: levelKey, bar: "bg-slate-400", accent: "#64748B" };
        const isOpen = manualOpen[levelKey] ?? (hasActiveFilters || levelKey === activeLevelCode);

        return (
          <details
            key={levelKey}
            className="group/level mb-10"
            open={isOpen}
            onToggle={(event) => {
              const nextOpen = (event.currentTarget as HTMLDetailsElement).open;
              setManualOpen((prev) => ({ ...prev, [levelKey]: nextOpen }));
            }}
          >
            {/* Section label with accent bar */}
            <summary className="mb-4 flex cursor-pointer list-none items-center gap-2.5">
              <div className={`h-5 w-1 rounded-full ${cfg.bar}`} aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">{cfg.label}</h2>
              <span className="text-xs text-muted-foreground">({levelLabs.length})</span>
              {levelKey === activeLevelCode && (
                <Badge variant="outline" className="text-[10px]">tu nivel actual</Badge>
              )}
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-open/level:rotate-90" aria-hidden />
            </summary>

            <div className="grid gap-3 sm:grid-cols-2">
              {levelLabs.map((lab) => {
                const meta = lab.meta;
                const primaryRoute = meta.routes[0] ?? "Ruta general";

                return (
                  <Link key={lab.slug} href={`/labs/${lab.slug}`} className="group">
                    <div className="relative h-full rounded-xl border border-border bg-card px-4 py-4 shadow-fluent-1 group-hover:shadow-fluent-4 group-hover:border-[#0078D4]/30 dark:group-hover:border-[#4DB8FF]/30 transition-all duration-200">
                      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs">
                        <Badge
                          variant={meta.kind === "Capstone" ? "default" : "secondary"}
                          className="h-6 px-2 font-mono text-xs font-semibold tracking-wide"
                        >
                          {lab.displayId}
                        </Badge>
                        <span className="font-medium text-muted-foreground">· {meta.kindLabel} · {lab.level}</span>
                      </div>

                      <div className="mb-3 grid gap-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3 w-3 shrink-0" aria-hidden />
                          <span className="truncate">{primaryRoute}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award className="h-3 w-3 shrink-0" aria-hidden />
                          <span>{meta.recommendedLevel}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FlaskConical className="h-3 w-3 shrink-0" aria-hidden />
                          <span>{meta.difficulty}</span>
                        </div>
                      </div>

                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF] transition-colors line-clamp-2">
                          {lab.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          <LabCardStatus slug={lab.slug} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#0078D4] dark:group-hover:text-[#4DB8FF] transition-colors" />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {meta.certificationBadges.map((cert) => (
                          <Badge key={cert} variant={CERT_VARIANT[cert] ?? "default"} className="text-[10px] px-1.5 py-0 h-4">
                            {cert}
                          </Badge>
                        ))}
                        {lab.products.slice(0, 2).map((product) => (
                          <Badge key={product} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {product}
                          </Badge>
                        ))}
                      </div>

                      {meta.competencies.length > 0 && (
                        <p className="mb-1.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">Competencias:</span> {meta.competencies.join(", ")}
                        </p>
                      )}

                      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">Evidencia:</span> {meta.evidenceSummary}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {lab.duration > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden />
                            {lab.duration} min
                          </span>
                        )}
                        {lab.role.length > 0 && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" aria-hidden />
                            {lab.role[0]}
                          </span>
                        )}
                        {meta.certificationBadges.length > 0 && (
                          <span className="flex items-center gap-1 ml-auto">
                            <Award className="h-3 w-3" aria-hidden />
                            {meta.certificationBadges[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </details>
        );
      })}
    </>
  );
}
