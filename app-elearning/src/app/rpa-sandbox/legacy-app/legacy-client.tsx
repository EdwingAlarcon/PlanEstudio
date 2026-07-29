"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const initialRecords = [
  { requestId: "SOL-2026-0001", customerId: "CLI-0001", productId: "PROD-001", status: "Pendiente" },
  { requestId: "SOL-2026-0002", customerId: "CLI-0002", productId: "PROD-002", status: "Pendiente" },
  { requestId: "SOL-2026-0004", customerId: "CLI-0004", productId: "PROD-004", status: "Registrado" },
];

type LegacyMode = "normal" | "duplicate" | "blocked" | "layout-shift" | "slow-confirmation" | "disabled-submit";

export function RpaLegacySimulatorClient() {
  const [records, setRecords] = useState(initialRecords);
  const [mode, setMode] = useState<LegacyMode>("normal");
  const [requestId, setRequestId] = useState("SOL-2026-0011");
  const [customerId, setCustomerId] = useState("CLI-0005");
  const [productId, setProductId] = useState("PROD-003");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  function reset() {
    setRecords(initialRecords);
    setMode("normal");
    setRequestId("SOL-2026-0011");
    setCustomerId("CLI-0005");
    setProductId("PROD-003");
    setMessage("");
    setConfirmOpen(false);
  }

  function register() {
    setMessage("");
    if (mode === "blocked") {
      setMessage("Registro bloqueado simulado. El robot debe registrar error y continuar.");
      return;
    }
    if (mode === "duplicate" || records.some((row) => row.requestId === requestId)) {
      setMessage("Registro duplicado. No se insertó una segunda vez.");
      return;
    }
    if (!requestId || !customerId || !productId) {
      setMessage("Faltan campos obligatorios.");
      return;
    }
    const next = { requestId, customerId, productId, status: "Registrado" };
    if (mode === "slow-confirmation") {
      setMessage("Procesando confirmación lenta simulada...");
      window.setTimeout(() => {
        setRecords((current) => [...current, next]);
        setConfirmOpen(true);
        setMessage("");
      }, 900);
      return;
    }
    setRecords((current) => [...current, next]);
    setConfirmOpen(true);
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
        <Button size="sm" variant="outline" onClick={() => setMessage(records.find((row) => row.requestId === requestId)?.status ?? "No encontrado")}>Consultar por ID</Button>
      </div>
      <div className="mt-3 min-h-6" role="status" aria-live="polite">
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        {mode === "disabled-submit" && <p className="text-sm text-destructive">Botón deshabilitado por modo de prueba.</p>}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
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

      <section className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" htmlFor="legacy-mode">Modo</label>
          <select id="legacy-mode" value={mode} onChange={(event) => setMode(event.target.value as LegacyMode)} className="mt-2 h-9 w-full rounded-md border border-border bg-background px-2 text-sm">
            <option value="normal">Normal</option>
            <option value="duplicate">Duplicado</option>
            <option value="blocked">Bloqueo simulado</option>
            <option value="layout-shift">Layout cambiado</option>
            <option value="slow-confirmation">Confirmación lenta</option>
            <option value="disabled-submit">Botón deshabilitado</option>
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
