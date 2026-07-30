"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { UI } from "@/lib/i18n";
import { getRecommendedToolsForProducts } from "@/lib/workstation";
import { useWorkstationStore } from "@/lib/workstation-store";

const T = UI.labWorkstationGate;

interface LabWorkstationGateProps {
  products: string[];
}

export function LabWorkstationGate({ products }: LabWorkstationGateProps) {
  const toolStates = useWorkstationStore((state) => state.toolStates);

  const recommended = getRecommendedToolsForProducts(products);
  const pending = recommended.filter((tool) => {
    const status = toolStates[tool.id]?.status ?? "unknown";
    return status !== "installed" && status !== "verified";
  });

  if (pending.length === 0) return null;

  return (
    <section
      aria-labelledby="lab-workstation-gate-heading"
      className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-950/20"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="lab-workstation-gate-heading" className="text-sm font-semibold text-foreground">{T.title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{T.body}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {pending.map((tool) => (
              <li
                key={tool.id}
                className="rounded-full border border-amber-500/30 bg-background px-2.5 py-1 text-xs text-foreground/90"
              >
                {tool.name}
              </li>
            ))}
          </ul>
          <Link
            href="/preparar-entorno"
            className="mt-3 inline-block text-xs font-medium text-[#0078D4] hover:underline dark:text-[#4DB8FF]"
          >
            {T.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
