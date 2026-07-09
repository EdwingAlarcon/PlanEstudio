import type { Metadata } from "next";
import Link from "next/link";
import { SimulatorClient } from "@/components/quiz/simulator-client";
import { getAllQuestions } from "@/lib/questions-parser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, Clock, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Simulador de Examen",
  description: "Simulador cronometrado con 40 preguntas mixtas de todos los módulos.",
};

export default function SimulatorPage() {
  const allQuestions = getAllQuestions();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white px-6 py-7 shadow-fluent-1 dark:from-[rgba(0,120,212,0.08)] dark:to-background">
        <div className="space-y-3">
          <Badge className="w-fit border-0 bg-[#0078D4] text-white">Práctica cronometrada</Badge>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Simulador de examen
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Úsalo para medir preparación después de estudiar un bloque de módulos. El resultado te ayuda
              a priorizar repaso por tema; no reemplaza los laboratorios ni los criterios de validación.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="px-0 text-[#0078D4] dark:text-[#4DB8FF]">
            <Link href="/como-usar">
              Ver cómo encaja en el plan
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <section aria-label="Contexto del simulador" className="grid gap-3 sm:grid-cols-3">
        <SimulatorContextCard
          icon={<Clock className="h-4 w-4 text-[#0078D4]" />}
          title="Formato"
          description="40 preguntas aleatorias con límite de 50 minutos."
        />
        <SimulatorContextCard
          icon={<Target className="h-4 w-4 text-[#107C10]" />}
          title="Criterio"
          description="70% indica dominio inicial; menos de eso exige repaso dirigido."
        />
        <SimulatorContextCard
          icon={<BookOpenCheck className="h-4 w-4 text-orange-500" />}
          title="Uso recomendado"
          description="Repite después de cerrar módulos débiles, no varias veces seguidas."
        />
      </section>

      <SimulatorClient allQuestions={allQuestions} />
    </div>
  );
}

function SimulatorContextCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
