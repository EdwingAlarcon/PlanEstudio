# Certificado Imprimible por Nivel — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que un usuario que completó el 100% de un nivel genere un certificado tipo diploma con su nombre, e imprima/guarde como PDF (Ctrl+P), sin backend ni autenticación.

**Architecture:** Todo el estado vive en el store Zustand ya existente (`useProgressStore`, persistido en `localStorage`). Se agrega un campo `userName`. Un diálogo compartido captura el nombre la primera vez (desde el banner de nivel completado) y permite cambiarlo después (desde la página del certificado). La página `/certificado/[nivel]` es una ruta estática (Next.js `output: 'export'`) que delega toda la lógica de acceso (¿nivel válido? ¿100% completado? ¿hay nombre?) a un componente cliente, siguiendo el mismo patrón server-page + client-component que ya usa `app/nivel/[level]/page.tsx`. La impresión se resuelve con CSS puro (`@media print`), sin tocar el árbol de layouts.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Zustand v5 (persist), Tailwind CSS v3, shadcn/ui (Radix primitives), Vitest.

## Global Constraints

- Ejecutar `npx tsc --noEmit && npm run lint && npm test` antes de cada commit; corregir cualquier fallo antes de continuar.
- Todo el contenido visible en la UI va en español (convención del proyecto).
- No agregar backend, autenticación, ni llamadas de red — todo el estado es local (`localStorage` vía Zustand).
- Seguir el spec aprobado en `docs/superpowers/specs/2026-07-03-certificado-imprimible-design.md`; si una tarea de este plan diverge del spec, el spec manda.
- Reusar componentes/estilos existentes (`Badge` variantes por nivel, `LEVEL_COLORS`/`TROPHY_COLORS` de `level-progress-banner.tsx`, `UI` de `i18n.ts`) en lugar de duplicar valores.

---

### Task 1: Agregar componente `Input` de shadcn/ui

**Files:**
- Create: `app-elearning/src/components/ui/input.tsx`

**Interfaces:**
- Produces: `Input` — `React.ForwardRefExoticComponent<React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>`, exportado como named export `{ Input }`.

No lleva test unitario propio (es un wrapper de estilo, igual que `button.tsx` no tiene test dedicado en este proyecto).

- [ ] **Step 1: Crear el componente siguiendo el patrón de `button.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add app-elearning/src/components/ui/input.tsx
git commit -m "feat: agregar componente Input de shadcn/ui"
```

---

### Task 2: Exportar `DialogTitle` desde `dialog.tsx`

El diálogo de nombre necesita un título accesible (`aria-labelledby` que Radix conecta automáticamente cuando se usa `DialogPrimitive.Title` dentro de `DialogContent`). Ningún componente del proyecto lo exporta todavía.

**Files:**
- Modify: `app-elearning/src/components/ui/dialog.tsx`

**Interfaces:**
- Consumes: `DialogPrimitive` (ya importado en el archivo).
- Produces: `DialogTitle` — `React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>` wrapper, named export.

- [ ] **Step 1: Agregar el export al final del archivo**

```tsx
export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add app-elearning/src/components/ui/dialog.tsx
git commit -m "feat: exportar DialogTitle en el componente Dialog"
```

---

### Task 3: Agregar `userName`/`setUserName` al store de progreso

**Files:**
- Modify: `app-elearning/src/lib/progress.ts`
- Test: `app-elearning/src/lib/__tests__/progress.test.ts`

**Interfaces:**
- Produces:
  - `ProgressState.userName: string | null`
  - `ProgressActions.setUserName: (name: string) => void`
  - `useProgressStore.getState().userName` / `.setUserName(name)`

- [ ] **Step 1: Escribir el test que falla**

Agregar dentro de `describe("useProgressStore", ...)` en `progress.test.ts`, después del bloque `describe("setLastVisited", ...)`:

```ts
  describe("setUserName", () => {
    it("starts as null", () => {
      expect(useProgressStore.getState().userName).toBeNull();
    });

    it("stores the provided name", () => {
      useProgressStore.getState().setUserName("Ada Lovelace");
      expect(useProgressStore.getState().userName).toBe("Ada Lovelace");
    });

    it("overwrites a previously stored name", () => {
      useProgressStore.getState().setUserName("Ada Lovelace");
      useProgressStore.getState().setUserName("Grace Hopper");
      expect(useProgressStore.getState().userName).toBe("Grace Hopper");
    });
  });
```

También actualizar el `beforeEach` que resetea el estado (líneas 20-25 actuales) para incluir `userName: null`:

```ts
  beforeEach(() => {
    useProgressStore.setState({
      completedModules: [],
      quizScores: {},
      completedLabs: [],
      lastVisited: null,
      userName: null,
    });
    localStorageMock.clear();
  });
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- progress.test.ts`
Expected: FAIL — `userName` no existe en el estado / `setUserName` no es una función.

- [ ] **Step 3: Implementar en `progress.ts`**

Modificar `ProgressState` (agregar el campo):

```ts
export interface ProgressState {
  completedModules: string[];
  quizScores: Record<string, number>;
  completedLabs: string[];
  lastVisited: string | null;
  userName: string | null;
}
```

Modificar `ProgressActions` (agregar la acción, después de `setLastVisited`):

```ts
  setLastVisited: (moduleId: string) => void;
  setUserName: (name: string) => void;
```

Modificar `INITIAL_STATE`:

```ts
const INITIAL_STATE: ProgressState = {
  completedModules: [],
  quizScores: {},
  completedLabs: [],
  lastVisited: null,
  userName: null,
};
```

Agregar la implementación dentro del store, junto a `setLastVisited`:

```ts
      setLastVisited: (moduleId) => set({ lastVisited: moduleId }),

      setUserName: (name) => set({ userName: name }),
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- progress.test.ts`
Expected: PASS — todos los tests, incluidos los 3 nuevos de `setUserName`.

- [ ] **Step 5: Verificación completa y commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: sin errores.

```bash
git add app-elearning/src/lib/progress.ts app-elearning/src/lib/__tests__/progress.test.ts
git commit -m "feat: agregar userName al store de progreso para el certificado"
```

---

### Task 4: Componente compartido `CertificateNameDialog`

**Files:**
- Create: `app-elearning/src/components/modules/certificate-name-dialog.tsx`

**Interfaces:**
- Consumes: `Dialog`, `DialogContent`, `DialogTitle` (`@/components/ui/dialog`), `Input` (`@/components/ui/input`), `Button` (`@/components/ui/button`).
- Produces:
  ```ts
  interface CertificateNameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialName?: string;
    onConfirm: (name: string) => void;
  }
  export function CertificateNameDialog(props: CertificateNameDialogProps): JSX.Element;
  ```
  Usado por `LevelProgressBannerClient` (Task 6) y por la página de certificado (Task 7).

- [ ] **Step 1: Crear el componente**

```tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CertificateNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onConfirm: (name: string) => void;
}

export function CertificateNameDialog({
  open,
  onOpenChange,
  initialName = "",
  onConfirm,
}: CertificateNameDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4">
        <DialogTitle>¿Cómo quieres que aparezca tu nombre en el certificado?</DialogTitle>
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre completo"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
          }}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!name.trim()}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Verificar que compila y lint pasa**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add app-elearning/src/components/modules/certificate-name-dialog.tsx
git commit -m "feat: agregar diálogo compartido para capturar nombre del certificado"
```

---

### Task 5: Componente `CertificateDiploma` + CSS de impresión

**Files:**
- Create: `app-elearning/src/components/modules/certificate-diploma.tsx`
- Modify: `app-elearning/src/app/globals.css`

**Interfaces:**
- Consumes: `LevelId`, `UI` (`@/lib/i18n`), `cn` (`@/lib/utils`).
- Produces:
  ```ts
  interface CertificateDiplomaProps {
    levelId: LevelId;
    userName: string;
    date: Date;
  }
  export function CertificateDiploma(props: CertificateDiplomaProps): JSX.Element;
  ```
  Usado por la página `/certificado/[nivel]` (Task 7). No incluye el botón "Imprimir" (vive en la página, junto al botón "Cambiar nombre").

- [ ] **Step 1: Agregar el CSS de impresión al final de `globals.css`**

```css
/* ─── Certificado: impresión limpia ──────────────────────────────────────── */

@media print {
  body * {
    visibility: hidden;
  }
  .certificate-print-area,
  .certificate-print-area * {
    visibility: visible;
  }
  .certificate-print-area {
    position: absolute;
    inset: 0;
  }
}
```

- [ ] **Step 2: Crear el componente del diploma**

Colores por nivel (mismos valores que `LEVEL_COLORS`/`TROPHY_COLORS` en `level-progress-banner.tsx`, duplicados aquí porque son solo 4 líneas cada uno y evita crear un módulo compartido para tan poco):

```tsx
import { UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CertificateDiplomaProps {
  levelId: LevelId;
  userName: string;
  date: Date;
}

const BORDER_COLORS: Record<LevelId, string> = {
  basico:     "border-emerald-600 dark:border-emerald-400",
  intermedio: "border-blue-600    dark:border-blue-400",
  avanzado:   "border-orange-600  dark:border-orange-400",
  arquitecto: "border-red-600     dark:border-red-400",
};

const ACCENT_TEXT_COLORS: Record<LevelId, string> = {
  basico:     "text-emerald-700 dark:text-emerald-400",
  intermedio: "text-blue-700    dark:text-blue-400",
  avanzado:   "text-orange-700  dark:text-orange-400",
  arquitecto: "text-red-700     dark:text-red-400",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CertificateDiploma({ levelId, userName, date }: CertificateDiplomaProps) {
  return (
    <div
      className={cn(
        "certificate-print-area mx-auto max-w-3xl aspect-[1.414/1] w-full",
        "border-8 double p-10 flex flex-col items-center justify-center text-center gap-6",
        "bg-background relative",
        BORDER_COLORS[levelId]
      )}
    >
      <div
        className={cn(
          "absolute inset-3 border-2 pointer-events-none",
          BORDER_COLORS[levelId]
        )}
        aria-hidden
      />

      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Plan de Estudio Power Platform &amp; D365
      </p>

      <h1 className="font-serif text-3xl font-bold">Certificado de Finalización</h1>

      <p className="text-sm text-muted-foreground">Se otorga el presente certificado a</p>

      <p className="font-serif text-4xl font-semibold">{userName}</p>

      <p className="text-base leading-relaxed max-w-lg">
        por haber completado exitosamente el{" "}
        <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
          {UI.levels.badge[levelId]}
        </span>
        , quedando preparado para rendir la certificación{" "}
        <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
          {UI.levels.cert[levelId]}
        </span>
        .
      </p>

      <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
    </div>
  );
}
```

- [ ] **Step 3: Verificar que compila y lint pasa**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add app-elearning/src/components/modules/certificate-diploma.tsx app-elearning/src/app/globals.css
git commit -m "feat: agregar componente de diploma imprimible y CSS de impresión"
```

---

### Task 6: Botón "Generar certificado" en `LevelCompleteBanner`

**Files:**
- Modify: `app-elearning/src/components/modules/level-progress-banner.tsx`

**Interfaces:**
- Consumes: `useProgressStore` (`userName`, `setUserName` — Task 3), `CertificateNameDialog` (Task 4), `useRouter` de `next/navigation`.
- Produces: sin cambios en la interfaz pública del componente (`LevelProgressBannerClient({ levelId })` sigue igual).

- [ ] **Step 1: Modificar el archivo**

Cambiar los imports del inicio del archivo:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy, Award } from "lucide-react";
import { UI, LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CertificateNameDialog } from "@/components/modules/certificate-name-dialog";
```

Reemplazar la función `LevelCompleteBanner` completa (líneas 48-103 actuales) por:

```tsx
function LevelCompleteBanner({ levelId, total }: { levelId: LevelId; total: number }) {
  const currentIdx = LEVEL_ORDER.indexOf(levelId);
  const nextLevelId = currentIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIdx + 1] : null;
  const isFinal = nextLevelId === null;

  const router = useRouter();
  const userName = useProgressStore((s) => s.userName);
  const setUserName = useProgressStore((s) => s.setUserName);
  const [dialogOpen, setDialogOpen] = useState(false);

  const goToCertificate = () => router.push(`/certificado/${levelId}`);

  const handleGenerateCertificate = () => {
    if (userName) {
      goToCertificate();
    } else {
      setDialogOpen(true);
    }
  };

  const handleConfirmName = (name: string) => {
    setUserName(name);
    goToCertificate();
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-5 space-y-4",
        LEVEL_COLORS[levelId]
      )}
      role="status"
      aria-live="polite"
    >
      {/* Trophy + title */}
      <div className="flex items-center gap-3">
        <div className={cn("shrink-0", TROPHY_COLORS[levelId])}>
          <Trophy className="h-8 w-8" aria-hidden />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">
            {isFinal ? "¡Plan de Estudio Completado!" : `¡${UI.levels.badge[levelId]} Completado!`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {total} módulos · Certificación objetivo:{" "}
            <span className="font-medium text-foreground">{UI.levels.cert[levelId]}</span>
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed">
        {isFinal
          ? "Has completado los cuatro niveles del plan. Estás preparado para rendir el examen PL-600 y ejercer como Power Platform Solution Architect."
          : `Has dominado los contenidos de este nivel. El siguiente paso es el ${UI.levels.badge[nextLevelId!]}, donde profundizarás hacia la certificación ${UI.levels.cert[nextLevelId!]}: ${UI.levels.description[nextLevelId!]}.`
        }
      </p>

      {/* Action */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={levelId} className="text-xs">
          {UI.levels.cert[levelId]} — Listo para el examen
        </Badge>

        <Button size="sm" variant="outline" onClick={handleGenerateCertificate}>
          <Award className="h-3.5 w-3.5 mr-1.5" aria-hidden />
          Generar certificado
        </Button>

        {nextLevelId && (
          <Button asChild size="sm">
            <Link href={`/nivel/${nextLevelId}`}>
              Comenzar {UI.levels.badge[nextLevelId]}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" aria-hidden />
            </Link>
          </Button>
        )}
      </div>

      <CertificateNameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialName={userName ?? ""}
        onConfirm={handleConfirmName}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verificar que compila y lint pasa**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 3: Verificación completa y commit**

Run: `npm test`
Expected: los 121 tests existentes siguen pasando (no hay tests unitarios de este componente cliente, igual que antes de este cambio).

```bash
git add app-elearning/src/components/modules/level-progress-banner.tsx
git commit -m "feat: agregar botón de generar certificado al banner de nivel completado"
```

---

### Task 7: Ruta `/certificado/[nivel]`

**Files:**
- Create: `app-elearning/src/app/certificado/[nivel]/page.tsx`
- Create: `app-elearning/src/app/certificado/[nivel]/certificate-client.tsx`

**Interfaces:**
- Consumes: `LEVEL_ORDER`, `LevelId`, `UI` (`@/lib/i18n`), `useProgressStore` (`userName`, `setUserName`, `getLevelProgress` — Task 3), `CertificateDiploma` (Task 5), `CertificateNameDialog` (Task 4).
- Produces: ruta estática `/certificado/[nivel]` (con `generateStaticParams` para las 4 rutas), sin exports consumidos por otras tareas de este plan.

Se separa en dos archivos porque `page.tsx` debe ser un Server Component (para poder usar `generateStaticParams`, requerido por `output: 'export'`), y toda la lógica que depende de `useProgressStore` debe ser un Client Component — mismo patrón que `nivel/[level]/page.tsx` + `LevelProgressBannerClient`.

- [ ] **Step 1: Crear el Client Component con la lógica de acceso y el layout de la página**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Pencil } from "lucide-react";
import { useProgressStore } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { CertificateDiploma } from "@/components/modules/certificate-diploma";
import { CertificateNameDialog } from "@/components/modules/certificate-name-dialog";
import { type LevelId } from "@/lib/i18n";

export function CertificateClient({ levelId }: { levelId: LevelId }) {
  const router = useRouter();
  const userName = useProgressStore((s) => s.userName);
  const setUserName = useProgressStore((s) => s.setUserName);
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);
  const { percentage } = getLevelProgress(levelId);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (percentage < 100 || !userName) {
    if (typeof window !== "undefined") {
      router.replace(`/nivel/${levelId}`);
    }
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/nivel/${levelId}`}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Volver al nivel
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Cambiar nombre
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Imprimir
          </Button>
        </div>
      </div>

      <CertificateDiploma levelId={levelId} userName={userName} date={new Date()} />

      <CertificateNameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialName={userName}
        onConfirm={setUserName}
      />
    </div>
  );
}
```

- [ ] **Step 2: Crear el Server Component de la página**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { CertificateClient } from "./certificate-client";

interface PageProps {
  params: Promise<{ nivel: string }>;
}

export async function generateStaticParams() {
  return LEVEL_ORDER.map((nivel) => ({ nivel }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nivel } = await params;
  if (!LEVEL_ORDER.includes(nivel as LevelId)) return {};
  return { title: "Certificado" };
}

export default async function CertificatePage({ params }: PageProps) {
  const { nivel } = await params;
  if (!LEVEL_ORDER.includes(nivel as LevelId)) notFound();

  return <CertificateClient levelId={nivel as LevelId} />;
}
```

- [ ] **Step 3: Verificar que compila, lint pasa y el build estático funciona**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: sin errores; el build genera `out/certificado/basico/index.html`, `out/certificado/intermedio/index.html`, `out/certificado/avanzado/index.html`, `out/certificado/arquitecto/index.html`.

- [ ] **Step 4: Escribir el test de redirección que falla**

Create: `app-elearning/src/app/certificado/[nivel]/__tests__/certificate-client.test.tsx`

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

import { useProgressStore } from "@/lib/progress";
import { CertificateClient } from "../certificate-client";

describe("CertificateClient", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    useProgressStore.setState({
      completedModules: [],
      quizScores: {},
      completedLabs: [],
      lastVisited: null,
      userName: null,
    });
    localStorageMock.clear();
  });

  it("redirects to the level page when the level is not 100% complete", () => {
    render(<CertificateClient levelId="basico" />);
    expect(replaceMock).toHaveBeenCalledWith("/nivel/basico");
  });

  it("redirects to the level page when there is no userName, even at 100%", () => {
    for (let i = 1; i <= 8; i++) {
      useProgressStore.getState().markModuleComplete(`basico-${i}`);
    }
    render(<CertificateClient levelId="basico" />);
    expect(replaceMock).toHaveBeenCalledWith("/nivel/basico");
  });

  it("renders the certificate when the level is complete and userName is set", () => {
    for (let i = 1; i <= 8; i++) {
      useProgressStore.getState().markModuleComplete(`basico-${i}`);
    }
    useProgressStore.getState().setUserName("Ada Lovelace");
    const { getByText } = render(<CertificateClient levelId="basico" />);
    expect(replaceMock).not.toHaveBeenCalled();
    expect(getByText("Ada Lovelace")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Ejecutar y verificar que falla**

Run: `npm test -- certificate-client.test.tsx`
Expected: FAIL (el archivo `certificate-client.tsx` del Step 1 ya existe, así que en realidad esto debería compilar; si el Step 1 ya se implementó correctamente los tests deberían pasar directamente — en ese caso, saltar al Step 6 y confirmar que efectivamente PASS. Si algo fallara aquí, es una señal de un bug en Step 1 a corregir antes de continuar).

- [ ] **Step 6: Ejecutar y verificar que pasa**

Run: `npm test -- certificate-client.test.tsx`
Expected: PASS — los 3 tests.

- [ ] **Step 7: Verificación completa final y commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: sin errores, todos los tests pasando (121 previos + los 3 nuevos de `setUserName` de Task 3 + los 3 nuevos de `CertificateClient`).

```bash
git add app-elearning/src/app/certificado
git commit -m "feat: agregar página de certificado por nivel en /certificado/[nivel]"
```

---

## Verificación manual final (no automatizable con Vitest)

Después de completar las 7 tareas, probar en el navegador (`npm run dev`):

1. Marcar todos los módulos de un nivel (ej. Básico) como completos desde `/nivel/basico`.
2. Confirmar que aparece el banner de "¡Nivel Completado!" con el botón "Generar certificado".
3. Hacer clic en "Generar certificado" → debe abrir el diálogo de nombre (primera vez).
4. Ingresar un nombre y confirmar → debe navegar a `/certificado/basico` mostrando el diploma con ese nombre.
5. Usar Ctrl+P (o el botón "Imprimir") → la vista previa de impresión debe mostrar solo el diploma, sin sidebar/topbar/botones.
6. Volver al nivel, hacer clic de nuevo en "Generar certificado" → debe ir directo a `/certificado/basico` sin pedir el nombre otra vez.
7. En la página del certificado, usar "Cambiar nombre" → debe actualizar el nombre mostrado.
8. Navegar manualmente a `/certificado/intermedio` sin haber completado ese nivel → debe redirigir a `/nivel/intermedio`.
