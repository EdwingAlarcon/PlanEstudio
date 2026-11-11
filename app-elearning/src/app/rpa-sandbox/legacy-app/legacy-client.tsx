"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatActivityReport, summarizeActivity, type ActivityEvent } from "@/lib/rpa-sandbox-activity";
import { LEGACY_MODES, shouldInterruptRegister, type LegacyMode } from "@/lib/rpa-legacy-modes";

const initialRecords = [
  { requestId: "SOL-2026-0001", customerId: "CLI-0001", productId: "PROD-001", status: "Pendiente" },
  { requestId: "SOL-2026-0002", customerId: "CLI-0002", productId: "PROD-002", status: "Pendiente" },
  { requestId: "SOL-2026-0004", customerId: "CLI-0004", productId: "PROD-004", status: "Registrado" },
];

export function RpaLegacySimulatorClient() {
  const [records, setRecords] = useState(initialRecords);
  const [mode, setMode] = useState<LegacyMode>("normal");
  const [requestId, setRequestId] = useState("SOL-2026-0011");
  const [customerId, setCustomerId] = useState("CLI-0005");
  const [productId, setProductId] = useState("PROD-003");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [activityOpen, setActivityOpen] = useState(false);
  // Modo "Modal inesperado": el aviso sale una sola vez por cada vez que se elige el modo (ver shouldInterruptRegister).
  const [interruptOpen, setInterruptOpen] = useState(false);
  const [interruptShown, setInterruptShown] = useState(false);

  function log(event: ActivityEvent) {
    setEvents((current) => [...current, event]);
  }

  function changeMode(next: LegacyMode) {
    setMode(next);
    setInterruptShown(false);
  }

  function reset() {
    setRecords(initialRecords);
    setMode("normal");
    setRequestId("SOL-2026-0011");
    setCustomerId("CLI-0005");
    setProductId("PROD-003");
    setMessage("");
    setConfirmOpen(false);
    setInterruptOpen(false);
    setInterruptShown(false);
    setEvents([]);
  }

  function consult() {
    if (interruptOpen) return; // el aviso bloquea la página: ni siquiera un clic por script la atraviesa
    const result = records.find((row) => row.requestId === requestId)?.status ?? "No encontrado";
    setMessage(result);
    log({ kind: "consulta", requestId, result });
  }

  function register() {
    if (interruptOpen) return;
    if (shouldInterruptRegister(mode, interruptShown)) {
      // El registro queda en espera detrás del aviso; se procesa al pulsar Continuar.
      setMessage("");
      setInterruptShown(true);
      setInterruptOpen(true);
      return;
    }
    processRegister();
  }

  function closeInterrupt() {
    setInterruptOpen(false);
    log({ kind: "aviso-cerrado" });
    processRegister();
  }

  function processRegister() {
    setMessage("");
    if (mode === "blocked") {
      setMessage("Registro bloqueado simulado. El robot debe registrar error y continuar.");
      log({ kind: "registrar", requestId, outcome: "bloqueado" });
      return;
    }
    if (mode === "duplicate" || records.some((row) => row.requestId === requestId)) {
      setMessage("Registro duplicado. No se insertó una segunda vez.");
      log({ kind: "registrar", requestId, outcome: "duplicado" });
      return;
    }
    if (!requestId || !customerId || !productId) {
      setMessage("Faltan campos obligatorios.");
      log({ kind: "registrar", requestId, outcome: "incompleto" });
      return;
    }
    const next = { requestId, customerId, productId, status: "Registrado" };
    if (mode === "slow-confirmation") {
      setMessage("Procesando confirmación lenta simulada...");
      window.setTimeout(() => {
        setRecords((current) => [...current, next]);
        setConfirmOpen(true);
        setMessage("");
        log({ kind: "registrar", requestId: next.requestId, outcome: "insertado" });
      }, 900);
      return;
    }
    setRecords((current) => [...current, next]);
    setConfirmOpen(true);
    log({ kind: "registrar", requestId, outcome: "insertado" });
  }

  const form = (
    <section className="rounded-xl border border-border bg-card p-4 shadow-fluent-1" aria-labelledby="legacy-form-title">
      <h2 id="legacy-form-title" className="text-base font-semibold text-foreground">Registro simulado</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="text-muted-foreground">Solicitud</span>
          <input value={requestId} onChange={(event) => setRequestId(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 font-mono text-sm" />
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Cliente</span>
          <input value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 font-mono text-sm" />
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Producto</span>
          <input value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 font-mono text-sm" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={register} disabled={mode === "disabled-submit"}>Registrar</Button>
        <Button size="sm" variant="outline" onClick={consult}>Consultar por ID</Button>
      </div>
      <div className="mt-3 min-h-6" role="status" aria-live="polite">
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        {mode === "disabled-submit" && <p className="text-sm text-destructive">Botón deshabilitado por modo de prueba.</p>}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-xl border border-border bg-card p-5 shadow-fluent-1" inert={interruptOpen}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="rpa">Legacy simulator</Badge>
              <Badge variant="outline">Web con apariencia desktop</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">SIT Registro Legacy</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Simulador educativo para practicar ventanas, campos, tabla, confirmación, duplicados, bloqueo, layout cambiante y recuperación sin distribuir ejecutables.
            </p>
          </div>
          <Button asChild size="sm" variant="outline"><Link href="/rpa-sandbox/portal">Abrir portal</Link></Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]" inert={interruptOpen}>
        <aside className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" htmlFor="legacy-mode">Modo</label>
          <select id="legacy-mode" value={mode} onChange={(event) => changeMode(event.target.value as LegacyMode)} className="mt-2 h-9 w-full rounded-md border border-border bg-background px-2 text-sm">
            {LEGACY_MODES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <Button className="mt-4 w-full justify-start" size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Reset
          </Button>
          <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Contrato</p>
            <p className="mt-1">Simulación local. No requiere Windows ni credenciales; PAD real solo para practicar automatización de UI.</p>
          </div>
        </aside>

        <main className="space-y-4">
          {mode === "layout-shift" ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <RecordsTable records={records} />
              {form}
            </div>
          ) : (
            <>
              {form}
              <RecordsTable records={records} />
            </>
          )}
        </main>
      </section>

      <details
        className="rounded-xl border border-border bg-card p-4 shadow-fluent-1"
        data-testid="legacy-activity"
        inert={interruptOpen}
        onToggle={(event) => setActivityOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer text-sm font-semibold text-foreground">Registro de actividad (para tu evidencia)</summary>
        {/* El contenido solo se monta con el panel abierto: cerrado, no añade texto a la página que PAD automatiza. */}
        {activityOpen && <ActivityPanel events={events} records={records} />}
      </details>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="legacy-confirm-title">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <CheckCircle2 className="mb-2 h-5 w-5 text-[#107C10]" aria-hidden />
            <h2 id="legacy-confirm-title" className="text-base font-semibold text-foreground">Registro confirmado</h2>
            <p className="mt-2 text-sm text-muted-foreground">El registro quedó en la tabla simulada. Captura esta confirmación como evidencia si el lab lo pide.</p>
            <Button className="mt-4" size="sm" onClick={() => setConfirmOpen(false)}>Cerrar</Button>
          </div>
        </div>
      )}

      {interruptOpen && (
        // Solo existe en el modo Modal inesperado: en los demás modos no añade nada a la página.
        <div
          id="legacy-interrupt-dialog"
          data-legacy-dialog="aviso-sesion"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legacy-interrupt-title"
          aria-describedby="legacy-interrupt-text"
          onKeyDown={(event) => {
            if (event.key === "Escape") closeInterrupt();
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <Info className="mb-2 h-5 w-5 text-[#0F6CBD]" aria-hidden />
            <h2 id="legacy-interrupt-title" className="text-base font-semibold text-foreground">Aviso de sesión</h2>
            <p id="legacy-interrupt-text" className="mt-2 text-sm text-muted-foreground">
              Tu sesión en SIT Registro Legacy se renovó. El registro queda en espera hasta que pulses Continuar.
            </p>
            {/* autoFocus: el foco entra en el diálogo al abrirse, como en un modal de escritorio. */}
            <Button id="legacy-interrupt-continue" className="mt-4" size="sm" onClick={closeInterrupt} autoFocus>Continuar</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityPanel({ events, records }: { events: ActivityEvent[]; records: typeof initialRecords }) {
  const summary = summarizeActivity(events, records);
  return (
    <div className="mt-3 space-y-3 text-xs" data-activity="panel">
      <div className="text-muted-foreground">
        Lo que hizo tu robot en esta página desde el último <strong>Reset</strong>. Si recargas la pestaña, se borra. Copia el texto de abajo en tu tabla de evidencia.
      </div>
      <ul className="space-y-1" aria-label="Comprobaciones del registro de actividad">
        {summary.hasActivity ? (
          summary.checks.map((check) => (
            <li key={check.id} data-activity-check={check.id} data-ok={check.ok ? "true" : "false"}>
              <span className={check.ok ? "font-semibold text-[#107C10]" : "font-semibold text-[#B37800]"}>{check.ok ? "OK" : "Revisar"}</span>{" "}
              {check.label}: {check.detail}
            </li>
          ))
        ) : (
          <li>Sin actividad todavía.</li>
        )}
      </ul>
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 font-mono" data-activity="report" aria-label="Informe de actividad">
        {formatActivityReport(summary)}
      </pre>
    </div>
  );
}

function RecordsTable({ records }: { records: typeof initialRecords }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-fluent-1" aria-labelledby="legacy-table-title">
      <div className="flex items-center gap-2">
        <h2 id="legacy-table-title" className="text-base font-semibold text-foreground">Registros</h2>
        <Badge variant="outline">{records.length}</Badge>
      </div>
      <div className="mt-3 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[620px] text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-3 py-2 text-left">Solicitud</th><th className="px-3 py-2 text-left">Cliente</th><th className="px-3 py-2 text-left">Producto</th><th className="px-3 py-2 text-left">Estado</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((row) => (
              <tr key={row.requestId} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-mono">{row.requestId}</td>
                <td className="px-3 py-2">{row.customerId}</td>
                <td className="px-3 py-2">{row.productId}</td>
                <td className="px-3 py-2">{row.status === "Pendiente" ? <span className="inline-flex items-center gap-1 text-[#B37800]"><AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {row.status}</span> : row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
