"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Download, RotateCcw, Search, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ASSET_ROOT = "/practice-assets/rpa/sit-automation-case";

const REQUESTS = [
  { requestId: "SOL-2026-0001", customerId: "CLI-0001", productId: "PROD-001", quantity: 12, amount: 180, currency: "USD", region: "REG-BOG", status: "Nuevo" },
  { requestId: "SOL-2026-0002", customerId: "CLI-0002", productId: "PROD-002", quantity: 1, amount: 320000, currency: "COP", region: "REG-MDE", status: "Nuevo" },
  { requestId: "SOL-2026-0004", customerId: "CLI-0004", productId: "PROD-004", quantity: 1, amount: 240000, currency: "COP", region: "REG-BAQ", status: "Nuevo" },
  { requestId: "SOL-2026-0005", customerId: "CLI-0005", productId: "PROD-002", quantity: 3, amount: 960000, currency: "COP", region: "REG-BOG", status: "Validado" },
  { requestId: "SOL-2026-0006", customerId: "CLI-0001", productId: "PROD-003", quantity: 2, amount: 360000, currency: "COP", region: "REG-BOG", status: "Validado" },
  { requestId: "SOL-2026-0007", customerId: "CLI-0002", productId: "PROD-004", quantity: 2, amount: 480000, currency: "COP", region: "REG-MDE", status: "Nuevo" },
  { requestId: "SOL-2026-0008", customerId: "CLI-0004", productId: "PROD-001", quantity: 6, amount: 90, currency: "USD", region: "REG-BAQ", status: "Nuevo" },
  { requestId: "SOL-2026-0009", customerId: "CLI-0005", productId: "PROD-003", quantity: 4, amount: 720000, currency: "COP", region: "REG-BOG", status: "Validado" },
  { requestId: "SOL-2026-0010", customerId: "CLI-0001", productId: "PROD-004", quantity: 1, amount: 240000, currency: "COP", region: "REG-BOG", status: "Nuevo" },
];

type Mode = "normal" | "slow" | "selector-shift" | "unexpected-modal" | "server-error" | "incomplete-data" | "extended-pagination" | "expired-session";

const MODES: { value: Mode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "slow", label: "Lento" },
  { value: "selector-shift", label: "Selector modificado" },
  { value: "unexpected-modal", label: "Modal inesperado" },
  { value: "server-error", label: "Error simulado" },
  { value: "incomplete-data", label: "Datos incompletos" },
  { value: "extended-pagination", label: "Paginación extendida" },
  { value: "expired-session", label: "Sesión expirada" },
];

function assetHref(path: string) {
  if (typeof window === "undefined") return `${ASSET_ROOT}/${path}`;
  const prefix = window.location.pathname.startsWith("/PlanEstudio") ? "/PlanEstudio" : "";
  return `${prefix}${ASSET_ROOT}/${path}`;
}

export function RpaPortalSandboxClient() {
  const [mode, setMode] = useState<Mode>("normal");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("todas");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const pageSize = mode === "extended-pagination" ? 3 : 5;
  const loading = mode === "slow";

  const rows = useMemo(() => {
    if (mode === "server-error" || mode === "expired-session") return [];
    return REQUESTS
      .map((row, index) => mode === "incomplete-data" && index === 1 ? { ...row, productId: "", amount: 0 } : row)
      .filter((row) => region === "todas" || row.region === region)
      .filter((row) => `${row.requestId} ${row.customerId} ${row.productId}`.toLowerCase().includes(query.toLowerCase()));
  }, [mode, query, region]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  function reset() {
    setMode("normal");
    setQuery("");
    setRegion("todas");
    setPage(1);
    setModalOpen(false);
    setUploadMessage("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-xl border border-border bg-card p-5 shadow-fluent-1">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="rpa">RPA sandbox</Badge>
              <Badge variant="outline">Simulación local</Badge>
              <Badge variant={mode === "normal" ? "outline" : "secondary"}>{MODES.find((item) => item.value === mode)?.label}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Portal SIT de solicitudes comerciales</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Entorno educativo estático para practicar PAD web automation: filtros, tabla, paginación, descargas, upload simulado, errores y cambios controlados de selector.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/recursos/rpa-recursos-practica">Recursos RPA</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]" aria-label="Controles del portal RPA">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" htmlFor="scenario-mode">Escenario</label>
          <select id="scenario-mode" value={mode} onChange={(event) => { setMode(event.target.value as Mode); setPage(1); setModalOpen(event.target.value === "unexpected-modal"); }} className="mt-2 h-9 w-full rounded-md border border-border bg-background px-2 text-sm">
            {MODES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>

          <div className="mt-4 space-y-2">
            <Button className="w-full justify-start" variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
              Reset
            </Button>
            <Button className="w-full justify-start" variant="outline" size="sm" asChild>
              <a href={assetHref("expected/registros_validos.csv")} download>
                <Download className="mr-2 h-4 w-4" aria-hidden />
                Descargar esperados
              </a>
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Contrato</p>
            <p className="mt-1">Local, sin backend, sin login real. No guardes credenciales en PAD para este entorno.</p>
          </div>
        </aside>

        <main className="rounded-xl border border-border bg-card p-4 shadow-fluent-1">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
            <label className="relative block">
              <span className="sr-only">Buscar solicitud</span>
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar por solicitud, cliente o producto" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm" />
            </label>
            <select value={region} onChange={(event) => { setRegion(event.target.value); setPage(1); }} className="h-9 rounded-md border border-border bg-background px-2 text-sm" aria-label="Filtrar región">
              <option value="todas">Todas</option>
              <option value="REG-BOG">Bogotá</option>
              <option value="REG-MDE">Medellín</option>
              <option value="REG-BAQ">Caribe</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => setUploadMessage("Archivo recibido en simulación. No se subió nada a un servidor.")}>Upload simulado</Button>
          </div>

          <div className="mt-3 min-h-6" role="status" aria-live="polite">
            {loading && <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><TimerReset className="h-4 w-4 animate-spin" aria-hidden /> Cargando tabla lenta simulada...</span>}
            {uploadMessage && <span className="text-sm text-muted-foreground">{uploadMessage}</span>}
          </div>

          {mode === "server-error" || mode === "expired-session" ? (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
              <AlertTriangle className="mb-2 h-5 w-5" aria-hidden />
              {mode === "server-error" ? "Error de servidor simulado. El robot debe registrar el fallo y detener escritura." : "Sesión expirada simulada. No automatices login real ni almacenes credenciales."}
            </div>
          ) : (
            <div className={cn("mt-4 overflow-x-auto rounded-lg border border-border", mode === "selector-shift" && "pt-2")} data-rpa-table={mode === "selector-shift" ? "requests-v2" : "requests"}>
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">Solicitud</th>
                    <th className="px-3 py-2 text-left">Cliente</th>
                    <th className="px-3 py-2 text-left">Producto</th>
                    <th className="px-3 py-2 text-right">Cantidad</th>
                    <th className="px-3 py-2 text-right">Monto</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paged.map((row) => (
                    <tr key={row.requestId} className="hover:bg-muted/30">
                      <td className="px-3 py-2 font-mono">{row.requestId}</td>
                      <td className="px-3 py-2">{row.customerId}</td>
                      <td className="px-3 py-2">{row.productId || <span className="text-destructive">faltante</span>}</td>
                      <td className="px-3 py-2 text-right">{row.quantity}</td>
                      <td className="px-3 py-2 text-right">{row.amount} {row.currency}</td>
                      <td className="px-3 py-2"><Badge variant="outline">{row.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Página {page} de {pageCount} · {rows.length} registros</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Siguiente</Button>
            </div>
          </div>
        </main>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="unexpected-modal-title">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <h2 id="unexpected-modal-title" className="text-base font-semibold text-foreground">Modal inesperado simulado</h2>
            <p className="mt-2 text-sm text-muted-foreground">PAD debe cerrar este modal y continuar solo si el estado de la tabla sigue siendo confiable.</p>
            <Button className="mt-4" size="sm" onClick={() => setModalOpen(false)}>Cerrar modal</Button>
          </div>
        </div>
      )}
    </div>
  );
}
