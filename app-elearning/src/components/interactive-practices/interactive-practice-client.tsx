"use client";

import { useEffect, useId, useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, Lightbulb, RotateCcw, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  INTERACTIVE_DOMAIN_LABELS,
  INTERACTIVE_LEVEL_LABELS,
  INTERACTIVE_TYPE_LABELS,
  evaluateInteractivePractice,
  getRecommendedInteractivePractice,
  type DebugScenarioPractice,
  type FlowBuilderPractice,
  type InteractiveEvaluationResult,
  type InteractivePractice,
  type MultipleDecisionPractice,
  type QueryPlaygroundPractice,
} from "@/lib/interactive-practices";
import {
  DEFAULT_INTERACTIVE_PRACTICE_FILTERS,
  filterInteractivePractices,
  hasActiveInteractivePracticeFilters,
  syncSelectedInteractivePracticeSlug,
  type InteractivePracticeDomainFilter,
  type InteractivePracticeFilters,
  type InteractivePracticeLevelFilter,
  type InteractivePracticeMasteryFilter,
  type InteractivePracticeTypeFilter,
} from "@/lib/interactive-practice-filters";
import {
  summarizeInteractivePracticeProgress,
  useInteractivePracticeProgressStore,
} from "@/lib/interactive-practice-progress";
import { useProgressStore } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface InteractivePracticeClientProps {
  practices: InteractivePractice[];
  initialSlug?: string;
}

const INTERACTIVE_FILTER_SESSION_KEY = "planestudio.interactive-practice.filters.v1";
const INTERACTIVE_FEEDBACK_STORAGE_KEY = "planestudio.interactive-feedback.v1";

export function InteractivePracticeClient({ practices, initialSlug }: InteractivePracticeClientProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? practices[0]?.slug ?? "");
  const [mounted, setMounted] = useState(false);
  const [progressHydrated, setProgressHydrated] = useState(false);
  const [filters, setFilters] = useState<InteractivePracticeFilters>(() => {
    if (typeof window === "undefined") return DEFAULT_INTERACTIVE_PRACTICE_FILTERS;
    const stored = window.sessionStorage.getItem(INTERACTIVE_FILTER_SESSION_KEY);
    if (!stored) return DEFAULT_INTERACTIVE_PRACTICE_FILTERS;
    try {
      return { ...DEFAULT_INTERACTIVE_PRACTICE_FILTERS, ...JSON.parse(stored) };
    } catch {
      window.sessionStorage.removeItem(INTERACTIVE_FILTER_SESSION_KEY);
      return DEFAULT_INTERACTIVE_PRACTICE_FILTERS;
    }
  });
  const records = useInteractivePracticeProgressStore((s) => s.records);
  const completedModules = useProgressStore((s) => s.completedModules);

  const summary = summarizeInteractivePracticeProgress(records, practices.map((practice) => practice.id));
  const recommended = getRecommendedInteractivePractice(records, completedModules);

  const filtered = useMemo(() => {
    return filterInteractivePractices(practices, records, filters);
  }, [filters, practices, records]);
  const selected = filtered.find((practice) => practice.slug === selectedSlug) ?? filtered[0];
  const hasActiveFilters = hasActiveInteractivePracticeFilters(filters);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setProgressHydrated(useInteractivePracticeProgressStore.persist.hasHydrated());
    const unsubscribe = useInteractivePracticeProgressStore.persist.onFinishHydration(() => {
      setProgressHydrated(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(INTERACTIVE_FILTER_SESSION_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const nextSlug = syncSelectedInteractivePracticeSlug(selectedSlug, filtered);
    if (nextSlug !== selectedSlug) setSelectedSlug(nextSlug);
  }, [filtered, selectedSlug]);

  const clearFilters = () => setFilters(DEFAULT_INTERACTIVE_PRACTICE_FILTERS);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 animate-fade-in">
      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit border-0 bg-[#0078D4] text-white">Piloto interactivo</Badge>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Práctica interactiva</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Micro-ejercicios simulados para tomar decisiones, ordenar flujos, consultar fixtures locales y depurar escenarios sin ejecutar código arbitrario.
              </p>
            </div>
          </div>
          <div className="grid w-full gap-3 text-sm sm:grid-cols-4 lg:w-[34rem]">
            <Metric label="Completadas" value={`${summary.completed}/${summary.total}`} />
            <Metric label="Dominio" value={summary.proficient.toString()} />
            <Metric label="Repasar" value={summary.needsReview.toString()} />
            <Metric label="Promedio" value={`${summary.bestScoreAverage}%`} />
          </div>
        </div>
        <div className="mt-4">
          <Progress value={summary.percentage} className="h-2" />
        </div>
      </section>

      {recommended && (
        <section className="rounded-xl border border-[#107C10]/25 bg-[#EFF8EE] p-4 shadow-fluent-1 dark:bg-[rgba(16,124,16,0.10)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#107C10] dark:text-[#2DB52D]">Recomendación determinística</p>
              <h2 className="mt-1 text-base font-semibold text-foreground">{recommended.title}</h2>
              <p className="text-sm text-muted-foreground">{recommended.description}</p>
            </div>
            <Button asChild size="sm" className="bg-[#107C10] text-white hover:bg-[#0B6A0B]">
              <Link href={`/practica/${recommended.slug}`} onClick={() => setSelectedSlug(recommended.slug)}>
                Abrir
                <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-4 shadow-fluent-1" aria-labelledby="practice-filter-heading">
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#0078D4]" aria-hidden />
              <h2 id="practice-filter-heading" className="text-sm font-semibold text-foreground">Filtros</h2>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">
                Buscar
                <span className="mt-1 flex items-center gap-2 rounded-md border border-input bg-background px-2">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  <input
                    value={filters.query}
                    onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                    disabled={!mounted}
                    className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
                    placeholder="Dataverse, OData, flujo..."
                  />
                </span>
              </label>
              <FilterSelect label="Dominio" value={filters.domain} disabled={!mounted} onChange={(value) => setFilters((current) => ({ ...current, domain: value as InteractivePracticeDomainFilter }))}>
                <option value="all">Todos</option>
                {Array.from(new Set(practices.map((practice) => practice.domain))).map((item) => (
                  <option key={item} value={item}>{INTERACTIVE_DOMAIN_LABELS[item]}</option>
                ))}
              </FilterSelect>
              <FilterSelect label="Engine" value={filters.type} disabled={!mounted} onChange={(value) => setFilters((current) => ({ ...current, type: value as InteractivePracticeTypeFilter }))}>
                <option value="all">Todos</option>
                {Array.from(new Set(practices.map((practice) => practice.type))).map((item) => (
                  <option key={item} value={item}>{INTERACTIVE_TYPE_LABELS[item]}</option>
                ))}
              </FilterSelect>
              <FilterSelect label="Dificultad" value={filters.level} disabled={!mounted} onChange={(value) => setFilters((current) => ({ ...current, level: value as InteractivePracticeLevelFilter }))}>
                <option value="all">Todas</option>
                {Array.from(new Set(practices.map((practice) => practice.level))).map((item) => (
                  <option key={item} value={item}>{INTERACTIVE_LEVEL_LABELS[item]}</option>
                ))}
              </FilterSelect>
              <FilterSelect label="Estado" value={filters.mastery} disabled={!mounted} onChange={(value) => setFilters((current) => ({ ...current, mastery: value as InteractivePracticeMasteryFilter }))}>
                <option value="all">Todos</option>
                <option value="not-started">No iniciado</option>
                <option value="completed">Completado</option>
                <option value="needs-review">Para repasar</option>
              </FilterSelect>
              {hasActiveFilters && (
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </section>

          <section className="space-y-2" aria-label="Banco de prácticas interactivas">
            {filtered.map((practice) => (
              <PracticeListButton
                key={practice.id}
                practice={practice}
                active={practice.slug === selected?.slug}
                record={records[practice.id]}
                onSelect={() => setSelectedSlug(practice.slug)}
              />
            ))}
            {filtered.length === 0 && (
              <section className="rounded-xl border border-dashed border-border p-4" aria-live="polite">
                <h3 className="text-sm font-semibold text-foreground">No encontramos prácticas con estos filtros</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Ajusta dominio, engine, dificultad, estado o búsqueda para volver al banco.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={clearFilters}>Limpiar filtros</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>Ver todas</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFilters((current) => ({ ...current, domain: "all" }))}>Cambiar dominio</Button>
                </div>
              </section>
            )}
          </section>
        </aside>

        {selected ? <InteractiveExercise practice={selected} progressHydrated={progressHydrated} /> : (
          <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-live="polite">
            <h2 className="text-lg font-semibold text-foreground">No encontramos prácticas con estos filtros</h2>
            <p className="mt-2 text-sm text-muted-foreground">El panel se actualizará cuando exista al menos una práctica visible.</p>
          </section>
        )}
      </div>
    </div>
  );
}

function InteractiveExercise({ practice, progressHydrated }: { practice: InteractivePractice; progressHydrated: boolean }) {
  const [answer, setAnswer] = useState<unknown>(initialAnswer(practice));
  const [result, setResult] = useState<InteractiveEvaluationResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [feedbackChoice, setFeedbackChoice] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const record = useInteractivePracticeProgressStore((s) => s.records[practice.id]);
  const openPractice = useInteractivePracticeProgressStore((s) => s.openPractice);
  const recordAttempt = useInteractivePracticeProgressStore((s) => s.recordAttempt);
  const revealHint = useInteractivePracticeProgressStore((s) => s.revealHint);
  const revealSolution = useInteractivePracticeProgressStore((s) => s.revealSolution);

  useEffect(() => {
    if (!progressHydrated) return;
    openPractice(practice.id);
  }, [openPractice, practice.id, progressHydrated]);

  const previousPracticeIdRef = useRef<string>(practice.id);

  useEffect(() => {
    if (!progressHydrated) return;
    const practiceChanged = previousPracticeIdRef.current !== practice.id;
    previousPracticeIdRef.current = practice.id;
    // Solo pisar `answer` si cambiamos de práctica o hay una respuesta persistida real que restaurar.
    // Si es la misma práctica y no hay `lastAnswer`, el usuario puede haber empezado a interactuar
    // ANTES de que terminara la hidratación de localStorage — no lo revertamos a initialAnswer().
    if (practiceChanged || record?.lastAnswer !== undefined) {
      setAnswer(record?.lastAnswer ?? initialAnswer(practice));
    }
    setResult(null);
    setShowSolution(record?.solutionRevealed ?? false);
    setFeedbackChoice(null);
    setFeedbackNote("");
  }, [practice.id, progressHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const attemptNumber = (record?.attemptCount ?? 0) + 1;
  const statusLabel = progressHydrated
    ? record?.mastery ? masteryLabel(record.mastery) : "No iniciado"
    : "Cargando progreso";

  const submit = () => {
    const nextResult = evaluateInteractivePractice(practice, answer, attemptNumber);
    setResult(nextResult);
    recordAttempt(practice.id, nextResult, answer);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="exercise-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="outline">{practice.id}</Badge>
            <Badge variant="secondary">{INTERACTIVE_TYPE_LABELS[practice.type]}</Badge>
            <Badge variant="outline">{INTERACTIVE_DOMAIN_LABELS[practice.domain]}</Badge>
            <Badge variant="outline">{INTERACTIVE_LEVEL_LABELS[practice.level]}</Badge>
            <Badge className={cn("border-0", masteryClass(record?.mastery))}>{statusLabel}</Badge>
          </div>
          <h2 id="exercise-heading" className="text-xl font-semibold text-foreground">{practice.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{practice.description}</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>{practice.estimatedMinutes} min</p>
          <p>{progressHydrated ? record?.attemptCount ?? 0 : 0} intentos</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_16rem]">
        <div className="space-y-4">
          <ScenarioPanel practice={practice} />
          {practice.type === "multiple-decision" && (
            <DecisionEngine practice={practice} answer={answer as string[]} setAnswer={setAnswer} />
          )}
          {practice.type === "flow-builder" && (
            <FlowEngine practice={practice} answer={answer as string[]} setAnswer={setAnswer} />
          )}
          {practice.type === "query-playground" && (
            <QueryEngine practice={practice} answer={answer as string} setAnswer={setAnswer} />
          )}
          {practice.type === "debug-scenario" && (
            <DebugEngine practice={practice} answer={answer as string} setAnswer={setAnswer} />
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={submit}>
              Validar
              <CheckCircle2 className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAnswer(initialAnswer(practice));
                setResult(null);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
              Reintentar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowSolution(true);
                revealSolution(practice.id);
              }}
            >
              Ver solución
            </Button>
          </div>

          <div aria-live="polite">
            {result && <FeedbackPanel result={result} />}
          </div>
          {showSolution && <SolutionPanel practice={practice} />}
          {result?.status === "correct" && (
            <PracticeFeedbackPanel
              practiceId={practice.id}
              choice={feedbackChoice}
              note={feedbackNote}
              setChoice={setFeedbackChoice}
              setNote={setFeedbackNote}
            />
          )}
        </div>

        <aside className="space-y-3">
          <section className="rounded-lg border border-border bg-background p-3">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#B37800]" aria-hidden />
              <h3 className="text-sm font-semibold text-foreground">Pistas escalonadas</h3>
            </div>
            <div className="space-y-2">
              {practice.hints.map((hint, index) => (
                <details
                  key={hint.id}
                  className="rounded-md border border-border p-2 text-xs"
                  onToggle={(event) => {
                    if ((event.currentTarget as HTMLDetailsElement).open) revealHint(practice.id, hint.id);
                  }}
                >
                  <summary className="cursor-pointer font-medium text-foreground">Pista {index + 1}</summary>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{hint.content}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-background p-3">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Conexiones</h3>
            <div className="space-y-2 text-xs">
              {practice.relatedModuleIds.slice(0, 3).map((moduleId) => (
                <span key={moduleId} className="block text-muted-foreground">
                  Módulo {moduleId}
                </span>
              ))}
              {practice.relatedLabIds.slice(0, 3).map((labId) => (
                <span key={labId} className="block text-muted-foreground">{labId}</span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function DecisionEngine({ practice, answer, setAnswer }: { practice: MultipleDecisionPractice; answer: string[]; setAnswer: (value: string[]) => void }) {
  const toggle = (id: string) => {
    if (practice.multiple) {
      setAnswer(answer.includes(id) ? answer.filter((item) => item !== id) : [...answer, id]);
      return;
    }
    setAnswer([id]);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-foreground">Elige la mejor decisión</legend>
      {practice.options.map((option) => (
        <label key={option.id} className="flex cursor-pointer gap-3 rounded-lg border border-border bg-background p-3 text-sm hover:border-[#0078D4]/40">
          <input
            type={practice.multiple ? "checkbox" : "radio"}
            checked={answer.includes(option.id)}
            onChange={() => toggle(option.id)}
            className="mt-1"
          />
          <span>
            <span className="font-medium text-foreground">{option.label}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.consequence}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function FlowEngine({ practice, answer, setAnswer }: { practice: FlowBuilderPractice; answer: string[]; setAnswer: (value: string[]) => void }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(answer[0] ?? null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (selectedBlockId && answer.includes(selectedBlockId)) return;
    setSelectedBlockId(answer[0] ?? null);
  }, [answer, selectedBlockId]);

  const announce = (id: string, next: string[]) => {
    const block = practice.blocks.find((item) => item.id === id);
    const position = next.indexOf(id) + 1;
    setAnnouncement(`${block?.label ?? id} movido a posición ${position} de ${next.length}.`);
  };

  const move = (id: string, direction: -1 | 1) => {
    const index = answer.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= answer.length) return;
    const next = [...answer];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setAnswer(next);
    setSelectedBlockId(id);
    announce(id, next);
  };

  const moveToIndex = (id: string, targetIndex: number) => {
    const index = answer.indexOf(id);
    if (index < 0 || targetIndex < 0 || targetIndex >= answer.length || index === targetIndex) return;
    const next = [...answer];
    next.splice(index, 1);
    next.splice(targetIndex, 0, id);
    setAnswer(next);
    setSelectedBlockId(id);
    announce(id, next);
  };

  const remove = (id: string) => {
    const next = answer.filter((item) => item !== id);
    setAnswer(next);
    setSelectedBlockId(next[0] ?? null);
    const block = practice.blocks.find((item) => item.id === id);
    setAnnouncement(`${block?.label ?? id} eliminado del flujo. Usa Restaurar bloques para recuperarlo.`);
  };

  const restoreBlocks = () => {
    const next = practice.blocks.map((block) => block.id);
    setAnswer(next);
    setSelectedBlockId(next[0] ?? null);
    setAnnouncement("Bloques restaurados al orden inicial.");
  };

  const insertRelative = (targetId: string, offset: 0 | 1) => {
    if (!selectedBlockId) return;
    const targetIndex = answer.indexOf(targetId);
    const currentIndex = answer.indexOf(selectedBlockId);
    if (targetIndex < 0 || currentIndex < 0 || selectedBlockId === targetId) return;
    const next = [...answer];
    next.splice(currentIndex, 1);
    const adjustedTarget = next.indexOf(targetId);
    next.splice(adjustedTarget + offset, 0, selectedBlockId);
    setAnswer(next);
    announce(selectedBlockId, next);
  };

  const onDragStart = (event: DragEvent<HTMLLIElement>, id: string) => {
    setDraggedId(id);
    setSelectedBlockId(id);
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (event: DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    const id = draggedId ?? event.dataTransfer.getData("text/plain");
    moveToIndex(id, index);
    setDraggedId(null);
    setDropIndex(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      move(id, -1);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(id, 1);
    }
  };

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Ordena el flujo</h3>
        <p className="text-xs text-muted-foreground">Arrastra bloques o usa teclado y botones. En móvil, los botones son el método recomendado. El validador ejecuta casos locales con umbral de {practice.threshold}.</p>
      </div>
      <p className="sr-only" id="flow-builder-instructions">Selecciona un bloque. Usa flecha arriba o abajo para moverlo, o los botones Subir, Bajar, Insertar antes, Insertar después y Eliminar.</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <ol className="space-y-2">
        {answer.map((blockId, index) => {
          const block = practice.blocks.find((item) => item.id === blockId);
          if (!block) return null;
          return (
            <li
              key={block.id}
              draggable
              onDragStart={(event) => onDragStart(event, block.id)}
              onDragOver={(event) => {
                event.preventDefault();
                setDropIndex(index);
              }}
              onDragLeave={() => setDropIndex(null)}
              onDrop={(event) => onDrop(event, index)}
              onDragEnd={() => {
                setDraggedId(null);
                setDropIndex(null);
              }}
              className={cn(
                "flex flex-col gap-3 rounded-lg border bg-background p-3 transition-colors sm:flex-row sm:items-center",
                selectedBlockId === block.id ? "border-[#0078D4]" : "border-border",
                dropIndex === index ? "ring-2 ring-[#0078D4]" : ""
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{block.label}</p>
                <p className="text-xs text-muted-foreground">{block.kind}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={selectedBlockId === block.id ? "default" : "outline"}
                  size="sm"
                  aria-describedby="flow-builder-instructions"
                  aria-label={`Arrastrar o mover ${block.label}`}
                  onClick={() => setSelectedBlockId(block.id)}
                  onKeyDown={(event) => onKeyDown(event, block.id)}
                >
                  Arrastrar
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => move(block.id, -1)} disabled={index === 0}>Subir</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => move(block.id, 1)} disabled={index === answer.length - 1}>Bajar</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => insertRelative(block.id, 0)} disabled={!selectedBlockId || selectedBlockId === block.id}>Insertar antes</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => insertRelative(block.id, 1)} disabled={!selectedBlockId || selectedBlockId === block.id}>Insertar después</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(block.id)}>Eliminar</Button>
              </div>
            </li>
          );
        })}
      </ol>
      {answer.length !== practice.blocks.length && (
        <Button type="button" variant="outline" size="sm" onClick={restoreBlocks}>Restaurar bloques</Button>
      )}
      {practice.branchPreview && <FlowBranchPreviewPanel practice={practice} />}
    </section>
  );
}

function FlowBranchPreviewPanel({ practice }: { practice: FlowBuilderPractice }) {
  const preview = practice.branchPreview;
  if (!preview) return null;
  const labelFor = (id: string) => practice.blocks.find((block) => block.id === id)?.label ?? id;
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Así se ve en Power Automate real (solo lectura)
      </p>
      <p className="mb-3 text-xs text-muted-foreground">{preview.conditionLabel} evalúa cada ejecución y la divide en dos ramas:</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-[#107C10]/30 bg-[#107C10]/5 p-3">
          <p className="mb-2 text-xs font-semibold text-[#107C10]">{preview.yes.label}</p>
          <div className="space-y-1 text-xs text-foreground">
            {preview.yes.blockIds.map((id) => <p key={id}>→ {labelFor(id)}</p>)}
          </div>
        </div>
        <div className="rounded-md border border-[#D13438]/30 bg-[#D13438]/5 p-3">
          <p className="mb-2 text-xs font-semibold text-[#D13438]">{preview.no.label}</p>
          <div className="space-y-1 text-xs text-foreground">
            {preview.no.blockIds.map((id) => <p key={id}>→ {labelFor(id)}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function QueryEngine({ practice, answer, setAnswer }: { practice: QueryPlaygroundPractice; answer: string; setAnswer: (value: string) => void }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Code2 className="h-4 w-4 text-[#0078D4]" aria-hidden />
          Query Playground
        </h3>
        <p className="text-xs text-muted-foreground">Parser limitado para {practice.dialect}. Solo acepta consultas declarativas contra fixtures locales.</p>
      </div>
      <div className="rounded-lg border border-[#0078D4]/25 bg-[#0078D4]/5 p-3 text-xs text-foreground dark:bg-[#0078D4]/10">
        <p className="mb-1 font-semibold uppercase tracking-wide text-muted-foreground">Sintaxis de {practice.dialect === "fetchxml" ? "FetchXML" : "OData"}</p>
        <p className="leading-relaxed">{practice.syntaxRef}</p>
      </div>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        className="min-h-40 w-full rounded-lg border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
        spellCheck={false}
        aria-label={`Editor ${practice.dialect}`}
      />
    </section>
  );
}

function DebugEngine({ practice, answer, setAnswer }: { practice: DebugScenarioPractice; answer: string; setAnswer: (value: string) => void }) {
  return (
    <section className="space-y-3">
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Implementación actual</p>
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-foreground">{practice.implementation}</pre>
      </div>
      <div className="rounded-lg border border-[#D13438]/20 bg-red-50 p-3 text-sm dark:bg-red-500/10">
        <p className="font-medium text-foreground">Síntoma</p>
        <p className="mt-1 text-muted-foreground">{practice.symptom}</p>
      </div>
      <label className="block text-sm font-semibold text-foreground">
        {practice.fixPrompt}
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="mt-2 min-h-32 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </section>
  );
}

function FeedbackPanel({ result }: { result: InteractiveEvaluationResult }) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge className={cn("border-0", result.status === "correct" ? "bg-[#107C10] text-white" : result.status === "partial" ? "bg-[#FFB900] text-black" : "bg-[#D13438] text-white")}>
          {result.status === "correct" ? "Correcto" : result.status === "partial" ? "Parcial" : "Requiere ajuste"}
        </Badge>
        <span className="text-sm font-semibold text-foreground">{result.score}%</span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{result.feedback}</p>
      {result.consequences.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {result.consequences.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0078D4]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {result.testResults && (
        <div className="mt-3 space-y-2">
          {result.testResults.map((test) => (
            <p key={test.label} className="rounded-md border border-border p-2 text-xs text-muted-foreground">
              <span className={cn("mr-2 font-semibold", test.pass ? "text-[#107C10]" : "text-[#D13438]")}>{test.pass ? "PASS" : "FAIL"}</span>
              {test.label}: esperado {test.expected}, actual {test.actual}
            </p>
          ))}
        </div>
      )}
      {result.rows && result.rows.length > 0 && (
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground">
              <tr>{Object.keys(result.rows[0]!).map((key) => <th key={key} className="px-2 py-1">{key}</th>)}</tr>
            </thead>
            <tbody>
              {result.rows.map((row, index) => (
                <tr key={index} className="border-t border-border">
                  {Object.values(row).map((value, cell) => <td key={cell} className="px-2 py-1">{String(value)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SolutionPanel({ practice }: { practice: InteractivePractice }) {
  let content = "";
  if (practice.type === "multiple-decision") content = practice.correctOptionIds.join(", ");
  if (practice.type === "flow-builder") content = practice.expectedBlockIds.join(" -> ");
  if (practice.type === "query-playground") content = `Columnas esperadas: ${practice.expectedColumns.join(", ")}. Registros esperados: ${practice.expectedNames.join(", ")}.`;
  if (practice.type === "debug-scenario") content = practice.acceptableFixes.join("; ");

  return (
    <section className="rounded-lg border border-[#FFB900]/30 bg-[#FFFBE6] p-4 text-sm dark:bg-yellow-500/10">
      <h3 className="mb-2 font-semibold text-foreground">Solución de referencia</h3>
      <p className="leading-relaxed text-muted-foreground">{content}</p>
      {practice.type === "query-playground" && (
        <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground">{practice.solutionQuery}</pre>
      )}
    </section>
  );
}

function PracticeFeedbackPanel({
  practiceId,
  choice,
  note,
  setChoice,
  setNote,
}: {
  practiceId: string;
  choice: string | null;
  note: string;
  setChoice: (value: string) => void;
  setNote: (value: string) => void;
}) {
  const save = (nextChoice: string, nextNote = note) => {
    setChoice(nextChoice);
    const raw = window.localStorage.getItem(INTERACTIVE_FEEDBACK_STORAGE_KEY);
    const current = raw ? safeParseFeedback(raw) : {};
    window.localStorage.setItem(
      INTERACTIVE_FEEDBACK_STORAGE_KEY,
      JSON.stringify({ ...current, [practiceId]: { choice: nextChoice, note: nextNote, updatedAt: new Date().toISOString() } })
    );
  };

  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <h3 className="text-sm font-semibold text-foreground">¿Esta práctica te ayudó a entender el concepto?</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Sí", "Más o menos", "No"].map((option) => (
          <Button key={option} type="button" variant={choice === option ? "default" : "outline"} size="sm" onClick={() => save(option)}>
            {option}
          </Button>
        ))}
      </div>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        ¿Qué fue confuso?
        <textarea
          value={note}
          onChange={(event) => {
            const next = event.target.value;
            setNote(next);
            if (choice) save(choice, next);
          }}
          className="mt-1 min-h-20 w-full rounded-md border border-input bg-background p-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </section>
  );
}

function safeParseFeedback(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function ScenarioPanel({ practice }: { practice: InteractivePractice }) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#0078D4]" aria-hidden />
        <h3 className="text-sm font-semibold text-foreground">Escenario</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{practice.scenario.context}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{practice.scenario.objective}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {practice.learningObjectives.slice(0, 4).map((objective) => (
          <Badge key={objective} variant="outline" className="text-[10px]">{objective}</Badge>
        ))}
      </div>
    </section>
  );
}

function PracticeListButton({ practice, active, record, onSelect }: { practice: InteractivePractice; active: boolean; record?: { status: string; mastery: string; bestScore: number }; onSelect: () => void }) {
  return (
    <Link
      href={`/practica/${practice.slug}`}
      onClick={onSelect}
      className={cn(
        "block rounded-xl border bg-card p-4 shadow-fluent-1 transition-all hover:border-[#0078D4]/40 hover:shadow-fluent-2",
        active ? "border-[#0078D4]" : "border-border"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge variant="outline">{INTERACTIVE_TYPE_LABELS[practice.type]}</Badge>
        <span className="text-xs text-muted-foreground">{record?.bestScore ?? 0}%</span>
      </div>
      <h3 className="text-sm font-semibold leading-snug text-foreground">{practice.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{practice.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-[10px]">{INTERACTIVE_DOMAIN_LABELS[practice.domain]}</Badge>
        <Badge className={cn("border-0 text-[10px]", masteryClass(record?.mastery as never))}>{masteryLabel(record?.mastery as never)}</Badge>
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, disabled = false, onChange, children }: { label: string; value: string; disabled?: boolean; onChange: (value: string) => void; children: ReactNode }) {
  const id = useId();
  return (
    <div className="block text-xs font-medium text-muted-foreground">
      <label htmlFor={id}>
      {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        {children}
      </select>
    </div>
  );
}

function initialAnswer(practice: InteractivePractice): unknown {
  if (practice.type === "multiple-decision") return [];
  if (practice.type === "flow-builder") return practice.blocks.map((block) => block.id);
  if (practice.type === "query-playground") return practice.starter;
  return "";
}

function masteryLabel(mastery?: string): string {
  if (mastery === "proficient") return "Dominado";
  if (mastery === "needs-review") return "Requiere refuerzo";
  if (mastery === "learning") return "En progreso";
  return "No iniciado";
}

function masteryClass(mastery?: string): string {
  if (mastery === "proficient") return "bg-[#107C10] text-white";
  if (mastery === "needs-review") return "bg-[#FFB900] text-black";
  if (mastery === "learning") return "bg-[#EFF6FC] text-[#0078D4] dark:bg-[rgba(33,150,243,0.15)] dark:text-[#4DB8FF]";
  return "bg-muted text-muted-foreground";
}
