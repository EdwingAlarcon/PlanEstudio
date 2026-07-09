import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FlaskConical, HelpCircle, Route, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cómo usar esta plataforma",
  description: "Guía práctica para estudiar con niveles, rutas profesionales, laboratorios, simulador y recursos.",
};

const STEPS = [
  {
    icon: BookOpen,
    title: "Empieza por el nivel correcto",
    description: "Si estás comenzando, sigue los niveles en orden. Si ya tienes experiencia, revisa el nivel anterior como diagnóstico rápido antes de saltar.",
    href: "/nivel/basico",
    action: "Ver niveles",
  },
  {
    icon: Route,
    title: "Usa rutas cuando tengas un rol objetivo",
    description: "Las rutas agrupan módulos y labs por rol profesional para evitar estudiar contenido repetido o poco relevante para tu meta inmediata.",
    href: "/rutas",
    action: "Elegir ruta",
  },
  {
    icon: FlaskConical,
    title: "Haz laboratorios con evidencia",
    description: "Cada lab debe dejar una salida verificable: configuración, checklist, documento, solución exportada o decisión arquitectónica.",
    href: "/labs",
    action: "Abrir labs",
  },
  {
    icon: Trophy,
    title: "Cierra ciclos con el simulador",
    description: "Usa el simulador después de estudiar un bloque. El resultado sirve para detectar temas débiles, no como sustituto de los labs.",
    href: "/simulador",
    action: "Practicar",
  },
  {
    icon: ClipboardList,
    title: "Verifica tu progreso real antes de pedir el certificado",
    description: "El certificado exige módulos, quizzes aprobados (≥70%) y labs del nivel — no solo lectura. Revisa qué te falta en un solo lugar antes de intentarlo.",
    href: "/progreso",
    action: "Ver mi progreso",
  },
];

export default function HowToUsePage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-8 px-4 py-8 animate-fade-in">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-[#EFF6FC] to-white px-6 py-7 shadow-fluent-1 dark:from-[rgba(0,120,212,0.08)] dark:to-background">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0078D4] shadow-fluent-2">
            <HelpCircle className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div className="space-y-3">
            <Badge className="w-fit border-0 bg-[#0078D4] text-white">Guía de uso</Badge>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Cómo usar esta plataforma
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Esta plataforma combina aprendizaje progresivo, rutas por rol, laboratorios y simulador.
                La mejor estrategia es estudiar en ciclos cortos: aprender, practicar, validar y ajustar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="use-flow-heading">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#107C10]" aria-hidden />
          <h2 id="use-flow-heading" className="text-lg font-semibold text-foreground">
            Flujo recomendado
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FC] dark:bg-[rgba(0,120,212,0.12)]">
                      <Icon className="h-5 w-5 text-[#0078D4]" aria-hidden />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Paso {index + 1}
                      </p>
                      <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                <Button asChild variant="ghost" size="sm" className="mt-4 px-0 text-[#0078D4] dark:text-[#4DB8FF]">
                  <Link href={step.href}>
                    {step.action}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" aria-labelledby="study-cycle-heading">
        <h2 id="study-cycle-heading" className="text-base font-semibold text-foreground">
          Regla simple para avanzar
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No marques un módulo como dominado solo por leerlo. Primero completa sus criterios de validación,
          después resuelve el quiz, y finalmente ejecuta al menos un laboratorio relacionado cuando exista.
          El simulador queda para cerrar ciclos y priorizar el repaso. Esta regla no es solo una
          recomendación: <Link href="/progreso" className="text-[#0078D4] hover:underline dark:text-[#4DB8FF]">Mi Progreso</Link>{" "}
          y el certificado de cada nivel la aplican de forma real, verificando quizzes y labs, no solo módulos marcados como leídos.
        </p>
      </section>
    </main>
  );
}
