"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

let renderQueue = Promise.resolve();

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = useId().replace(/:/g, "-");
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    renderQueue = renderQueue
      .then(async () => {
        if (cancelled) return;
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "inherit",
        });

        try {
          const { svg } = await mermaid.render(`mermaid-${diagramId}`, code);
          if (!cancelled && containerRef.current) {
            containerRef.current.innerHTML = svg;
            setError(null);
          }
        } catch {
          if (!cancelled) setError("No se pudo renderizar el diagrama.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo renderizar el diagrama.");
      });

    return () => {
      cancelled = true;
    };
  }, [code, diagramId, resolvedTheme]);

  if (error) {
    return (
      <div className="not-prose my-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "not-prose my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4",
        className
      )}
    />
  );
}
