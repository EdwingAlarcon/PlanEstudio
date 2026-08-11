"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, FlaskConical, Activity, BookOpen, BrainCircuit } from "lucide-react";
import FlexSearch from "flexsearch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SearchDocument, SearchDocumentType } from "@/lib/content";
import { PRACTICE_DIFFICULTY_LABELS, PRACTICE_DOMAIN_LABELS, PRACTICE_ROLE_LABELS, PRACTICE_TYPE_LABELS, type PracticeDifficulty, type PracticeDomain, type PracticeRole, type PracticeType } from "@/lib/practice-meta";
import { getPracticeStatusLabel, usePracticeProgressStore } from "@/lib/practice-progress";
import { classifySearchDocument } from "@/lib/guided-journey";
import { useOnboardingStore } from "@/lib/onboarding-store";

interface SearchBarProps {
  documents: SearchDocument[];
}

interface SearchHit {
  id: string;
  title: string;
  levelId: string;
  moduleId: number;
  slug: string;
  href: string;
  type: SearchDocumentType;
  snippet: string;
  content: string;
  practiceId?: string;
  practiceType?: PracticeType;
  practiceDomain?: PracticeDomain;
  practiceDifficulty?: PracticeDifficulty;
  practiceRoles?: PracticeRole[];
}

const LEVEL_LABELS: Record<string, string> = {
  basico: "Nivel 1",
  intermedio: "Nivel 2",
  avanzado: "Nivel 3",
  arquitecto: "Nivel 4",
  ia: "Nivel IA",
  d365: "Nivel D365",
  rpa: "Nivel RPA",
  N1: "Nivel 1", N2: "Nivel 2", N3: "Nivel 3", N4: "Nivel 4", N5: "Nivel IA", N6: "Nivel D365", RPA: "Nivel RPA",
};

const TYPE_CONFIG: Record<SearchDocumentType, { label: string; color: string }> = {
  module: { label: "Módulo", color: "bg-[#EFF6FC] text-[#0078D4] dark:bg-[rgba(33,150,243,0.15)] dark:text-[#4DB8FF]" },
  lab:    { label: "Lab",    color: "bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)] dark:text-[#2DB52D]" },
  resource: { label: "Recurso", color: "bg-[#FFF4CE] text-[#8A6A00] dark:bg-yellow-500/10 dark:text-yellow-300" },
  incident: { label: "Incidente", color: "bg-red-50 text-[#D13438] dark:bg-red-500/10 dark:text-red-300" },
  challenge: { label: "Challenge", color: "bg-orange-50 text-[#EA580C] dark:bg-orange-500/10 dark:text-orange-300" },
  simulation: { label: "Simulación", color: "bg-[#F3F2F1] text-[#5C2D91] dark:bg-purple-500/10 dark:text-purple-300" },
  guided: { label: "Práctica guiada", color: "bg-[#EFF6FC] text-[#0078D4] dark:bg-[rgba(33,150,243,0.15)] dark:text-[#4DB8FF]" },
  "semi-guided": { label: "Semi guiada", color: "bg-[#EFF6FC] text-[#0078D4] dark:bg-[rgba(33,150,243,0.15)] dark:text-[#4DB8FF]" },
  "interactive-practice": { label: "Práctica interactiva", color: "bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)] dark:text-[#2DB52D]" },
};

export function SearchBar({ documents }: SearchBarProps) {
  const moduleCount = documents.filter((doc) => doc.type === "module").length;
  const labCount = documents.filter((doc) => doc.type === "lab").length;
  const practiceCount = documents.filter((doc) => !["module", "lab", "resource"].includes(doc.type)).length;
  const practiceRecords = usePracticeProgressStore((s) => s.records);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const onboarding = useOnboardingStore();

  // Build FlexSearch index once
  const indexRef = useRef<FlexSearch.Document<SearchDocument, true> | null>(null);
  useEffect(() => {
    const idx = new FlexSearch.Document<SearchDocument, true>({
      tokenize: "forward",
      document: {
        id: "id",
        index: ["title", "content"],
        store: true,
      },
    });
    documents.forEach((doc) => idx.add(doc));
    indexRef.current = idx;
  }, [documents]);

  // Run search
  useEffect(() => {
    if (!query.trim() || !indexRef.current) {
      setResults([]);
      setActiveIdx(0);
      return;
    }
    type EnrichedResult = { id: string; doc: SearchDocument };
    type EnrichedField = { field: string; result: EnrichedResult[] };
    const raw = indexRef.current.search(query, { limit: 8, enrich: true }) as unknown as EnrichedField[];
    const seen = new Set<string>();
    const hits: SearchHit[] = [];

    for (const field of raw) {
      for (const result of field.result) {
        if (seen.has(result.id)) continue;
        seen.add(result.id);
        const doc = result.doc;
        const matchIdx = doc.content.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(doc.content.length, matchIdx + 120);
        const snippet = (start > 0 ? "…" : "") + doc.content.slice(start, end).trim() + (end < doc.content.length ? "…" : "");
        hits.push({
          id: doc.id,
          title: doc.title,
          levelId: doc.levelId,
          moduleId: doc.moduleId,
          slug: doc.slug,
          href: doc.href,
          type: doc.type,
          snippet,
          content: doc.content,
          practiceId: doc.practiceId,
          practiceType: doc.practiceType as PracticeType | undefined,
          practiceDomain: doc.practiceDomain as PracticeDomain | undefined,
          practiceDifficulty: doc.practiceDifficulty as PracticeDifficulty | undefined,
          practiceRoles: doc.practiceRoles as PracticeRole[] | undefined,
        });
      }
    }
    const order = { "en-tu-ruta": 0, opcional: 1, avanzado: 2, "otra-especializacion": 3 };
    setResults(
      hits.sort(
        (a, b) =>
          order[classifySearchDocument(a, onboarding)] - order[classifySearchDocument(b, onboarding)]
      )
    );
    setActiveIdx(0);
  }, [query, onboarding]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = useCallback(
    (hit: SearchHit) => {
      setOpen(false);
      router.push(hit.href);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      navigate(results[activeIdx]!);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 text-muted-foreground w-48 justify-start px-3"
          aria-label="Abrir búsqueda"
        >
          <Search className="h-3.5 w-3.5" aria-hidden />
          <span className="flex-1 text-left text-xs">{UI.nav.search}</span>
          <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono opacity-60">
            Ctrl K
          </kbd>
        </Button>
      </DialogTrigger>

      {/* Mobile icon-only trigger */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={UI.nav.searchPlaceholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Buscar en el contenido"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-listbox"
            aria-activedescendant={results[activeIdx] ? `search-hit-${activeIdx}` : undefined}
          />
          {query && (
            <span className="text-xs text-muted-foreground">
              {UI.search.results(results.length)}
            </span>
          )}
        </div>

        {/* Results */}
        <div
          id="search-listbox"
          role="listbox"
          aria-label="Resultados de búsqueda"
          className="max-h-[380px] overflow-y-auto"
        >
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {UI.search.noResults} &ldquo;{query}&rdquo;
            </div>
          )}

          {results.map((hit, i) => {
            const typeCfg = TYPE_CONFIG[hit.type] ?? TYPE_CONFIG.module;
            const isProfessionalPractice = ["incident", "challenge", "simulation", "guided", "semi-guided"].includes(hit.type);
            const isInteractivePractice = hit.type === "interactive-practice";
            const Icon = hit.type === "lab" ? FlaskConical : hit.type === "resource" ? BookOpen : isInteractivePractice ? BrainCircuit : isProfessionalPractice ? Activity : FileText;
            const status = isProfessionalPractice && hit.practiceId ? getPracticeStatusLabel(practiceRecords[hit.practiceId]?.status ?? "not_started") : null;
            const context = classifySearchDocument(hit, onboarding);
            return (
              <button
                key={hit.id}
                id={`search-hit-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                className={cn(
                  "w-full text-left px-4 py-3 flex gap-3 border-b last:border-0 transition-colors",
                  i === activeIdx ? "bg-accent" : "hover:bg-accent/50"
                )}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => navigate(hit)}
              >
                <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-medium truncate">{hit.title}</span>
                    <span className={cn("shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded", typeCfg.color)}>
                      {typeCfg.label}
                    </span>
                    {hit.levelId && (
                      <span className="shrink-0 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {LEVEL_LABELS[hit.levelId] ?? hit.levelId}
                      </span>
                    )}
                    {status && (
                      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {status}
                      </span>
                    )}
                    <span className={cn("shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded", contextClassName(context))}>
                      {contextLabel(context)}
                    </span>
                  </div>
                  {isProfessionalPractice && hit.practiceType && (
                    <p className="mb-1 text-[11px] text-muted-foreground">
                      {PRACTICE_TYPE_LABELS[hit.practiceType]} · {hit.practiceDifficulty ? PRACTICE_DIFFICULTY_LABELS[hit.practiceDifficulty] : ""} · {hit.practiceDomain ? PRACTICE_DOMAIN_LABELS[hit.practiceDomain] : ""}
                      {hit.practiceRoles?.length ? ` · ${hit.practiceRoles.map((role) => PRACTICE_ROLE_LABELS[role]).slice(0, 2).join(", ")}` : ""}
                    </p>
                  )}
                  {hit.snippet && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {hit.snippet}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {!query && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Escribe para buscar en {moduleCount} módulos, {labCount} laboratorios y {practiceCount} prácticas
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function contextLabel(context: "en-tu-ruta" | "opcional" | "avanzado" | "otra-especializacion"): string {
  if (context === "en-tu-ruta") return "En tu ruta";
  if (context === "avanzado") return "Avanzado";
  if (context === "otra-especializacion") return "Otra especializacion";
  return "Opcional";
}

function contextClassName(context: "en-tu-ruta" | "opcional" | "avanzado" | "otra-especializacion"): string {
  if (context === "en-tu-ruta") return "bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)] dark:text-[#2DB52D]";
  if (context === "avanzado") return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300";
  if (context === "otra-especializacion") return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300";
  return "bg-muted text-muted-foreground";
}
