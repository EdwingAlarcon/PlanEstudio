"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, FlaskConical } from "lucide-react";
import FlexSearch from "flexsearch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SearchDocument, SearchDocumentType } from "@/lib/content";

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
}

const LEVEL_LABELS: Record<string, string> = {
  basico: "Nivel 1",
  intermedio: "Nivel 2",
  avanzado: "Nivel 3",
  arquitecto: "Nivel 4",
  N1: "Nivel 1", N2: "Nivel 2", N3: "Nivel 3", N4: "Nivel 4",
};

const TYPE_CONFIG: Record<SearchDocumentType, { label: string; color: string }> = {
  module: { label: "Módulo", color: "bg-[#EFF6FC] text-[#0078D4] dark:bg-[rgba(33,150,243,0.15)] dark:text-[#4DB8FF]" },
  lab:    { label: "Lab",    color: "bg-[#EFF8EE] text-[#107C10] dark:bg-[rgba(16,124,16,0.15)] dark:text-[#2DB52D]" },
};

export function SearchBar({ documents }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
        });
      }
    }
    setResults(hits);
    setActiveIdx(0);
  }, [query]);

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
            const Icon = hit.type === "lab" ? FlaskConical : FileText;
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
                  </div>
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
              Escribe para buscar en 41 módulos y 9 laboratorios
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
