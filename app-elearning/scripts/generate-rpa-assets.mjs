import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public/practice-assets/rpa/sit-automation-case");
const VERSION = "1.0.0";
const GENERATED_AT = "2026-07-29T00:00:00.000Z";

const customers = [
  ["CLI-0001", "Cliente Alfa S.A.S.", "REG-BOG", "active", "enterprise"],
  ["CLI-0002", "Comercial Beta Ltda.", "REG-MDE", "active", "standard"],
  ["CLI-0003", "Servicios Gamma S.A.", "REG-CLO", "blocked", "standard"],
  ["CLI-0004", "Distribuciones Delta S.A.S.", "REG-BAQ", "active", "standard"],
  ["CLI-0005", "Operaciones Épsilon S.A.", "REG-BOG", "active", "enterprise"],
];

const products = [
  ["PROD-001", "Licencia Power Automate Premium", "USD", 15],
  ["PROD-002", "Servicio consultoría RPA", "COP", 320000],
  ["PROD-003", "Soporte operación mensual", "COP", 180000],
  ["PROD-004", "Paquete validación QA", "COP", 240000],
];

const regions = [
  ["REG-BOG", "Bogotá", "Sucursal Centro", "America/Bogota"],
  ["REG-MDE", "Medellín", "Sucursal Antioquia", "America/Bogota"],
  ["REG-CLO", "Cali", "Sucursal Pacífico", "America/Bogota"],
  ["REG-BAQ", "Barranquilla", "Sucursal Caribe", "America/Bogota"],
];

const requests = [
  ["SOL-2026-0001", "CLI-0001", "PROD-001", 12, 15, "USD", "2026-07-01", "REG-BOG", "new", "ventas_bogota_2026_07.xlsx"],
  ["SOL-2026-0002", "CLI-0002", "PROD-002", 1, 320000, "COP", "2026-07-02", "REG-MDE", "new", "ventas_medellin_2026_07.xlsx"],
  ["SOL-2026-0003", "CLI-0003", "PROD-003", 2, 180000, "COP", "2026-07-03", "REG-CLO", "review", "solicitudes_sucursales.csv"],
  ["SOL-2026-0004", "CLI-0004", "PROD-004", 1, 240000, "COP", "2026-07-04", "REG-BAQ", "new", "ventas_caribe_2026_07.xlsx"],
  ["SOL-2026-0005", "CLI-0005", "PROD-002", 3, 320000, "COP", "2026-07-05", "REG-BOG", "new", "solicitudes_sucursales.csv"],
  ["SOL-2026-0006", "CLI-0001", "PROD-003", 2, 180000, "COP", "2026-07-06", "REG-BOG", "new", "ventas_bogota_2026_07.xlsx"],
  ["SOL-2026-0007", "CLI-0002", "PROD-004", 2, 240000, "COP", "2026-07-07", "REG-MDE", "new", "ventas_medellin_2026_07.xlsx"],
  ["SOL-2026-0008", "CLI-0004", "PROD-001", 6, 15, "USD", "2026-07-08", "REG-BAQ", "new", "ventas_caribe_2026_07.xlsx"],
  ["SOL-2026-0009", "CLI-0005", "PROD-003", 4, 180000, "COP", "2026-07-09", "REG-BOG", "new", "solicitudes_sucursales.csv"],
  ["SOL-2026-0010", "CLI-0001", "PROD-004", 1, 240000, "COP", "2026-07-10", "REG-BOG", "new", "solicitudes_sucursales.csv"],
];

const requestHeaders = ["requestId", "customerId", "productId", "quantity", "unitPrice", "currency", "requestedDate", "region", "status", "sourceFile", "processedAt", "correlationId"];
const validRows = requests.filter((row) => row[1] !== "CLI-0003").map((row, index) => [...row, `2026-07-29T08:${String(index).padStart(2, "0")}:00.000Z`, `COR-SIT-2026-${String(index + 1).padStart(4, "0")}`]);
const rejectedRows = requests.filter((row) => row[1] === "CLI-0003").map((row) => [...row, "", "COR-SIT-2026-REJ-0001", "Cliente bloqueado"]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeCell(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function csv(headers, rows, delimiter = ",") {
  const escape = (value) => {
    const text = safeCell(value);
    return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(delimiter), ...rows.map((row) => row.map(escape).join(delimiter))].join("\n") + "\n";
}

function writeText(relative, content) {
  const file = path.join(ROOT, relative);
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

function writeJson(relative, data) {
  writeText(relative, JSON.stringify(data, null, 2) + "\n");
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function dosDateTime() {
  return { time: 0, date: ((2026 - 1980) << 9) | (7 << 5) | 29 };
}

function zipStore(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  const { time, date } = dosDateTime();
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const data = Buffer.from(file.content, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    name.copy(local, 30);
    locals.push(local, data);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);
    centrals.push(central);
    offset += local.length + data.length;
  }
  const centralSize = centrals.reduce((sum, item) => sum + item.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

function sheetXml(headers, rows) {
  const allRows = [headers, ...rows];
  const col = (index) => String.fromCharCode(65 + index);
  const cell = (value, rowIndex, colIndex) => `<c r="${col(colIndex)}${rowIndex}" t="inlineStr"><is><t>${String(safeCell(value)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</t></is></c>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>
${allRows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, colIndex) => cell(value, rowIndex + 1, colIndex)).join("")}</row>`).join("\n")}
</sheetData></worksheet>`;
}

function writeXlsx(relative, headers, rows) {
  const files = [
    { name: "[Content_Types].xml", content: `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>` },
    { name: "_rels/.rels", content: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", content: `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Solicitudes" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", content: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>` },
    { name: "xl/worksheets/sheet1.xml", content: sheetXml(headers, rows) },
  ];
  const file = path.join(ROOT, relative);
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, zipStore(files));
}

function template(name, title, fields) {
  writeText(`templates/${name}.md`, `# ${title}

Versión: ${VERSION}

## Propósito

Usa esta plantilla para documentar evidencia RPA sin datos reales ni credenciales.

## Instrucciones

1. Completa solo los campos aplicables.
2. Reemplaza cualquier usuario, URL, tenant o cliente por valores ficticios.
3. Adjunta evidencia anonimizada.
4. Marca si el resultado fue simulación, sandbox o tenant real.

## Campos

${fields.map((field) => `- ${field}: ___`).join("\n")}

## Ejemplo mínimo

- Responsable: Analista RPA
- Fecha: 2026-07-29
- Estado: preparado
- Evidencia: captura anonimizada o archivo de salida

## Control

- Responsable: ___
- Fecha: ___
- Estado: borrador / preparado / validado / bloqueado
- Evidencias: ___
- Advertencia: no incluir secretos, correos reales, URLs internas ni datos de clientes.
`);
}

function build() {
  fs.rmSync(ROOT, { recursive: true, force: true });
  ensureDir(ROOT);

  writeText("README.md", `# SIT Automation Case — Assets RPA

Versión: ${VERSION}

Empresa ficticia: Servicios Integrados Tecnológicos S.A.

Escenario: consolidación, validación y registro de solicitudes comerciales recibidas desde sucursales.

Este paquete es educativo. No contiene datos reales, credenciales, macros ni ejecutables. Los archivos Excel son libros \`.xlsx\` mínimos sin macros generados de forma determinista.

## Carpetas

- input: archivos válidos de entrada.
- expected: resultados esperados.
- corrupted: archivos defectuosos para incidentes.
- reference: matrices y contratos de decisión.
- logs: logs de ejemplo.
- portal: datos del portal sandbox.
- legacy-app: datos del simulador legacy.
- templates: plantillas profesionales.
- validation: protocolo y matriz operacional.

Regenera con \`npm run generate:rpa-assets\` desde \`app-elearning\`.
Valida con \`npm run validate:assets\`.
`);

  writeJson("manifest.json", {
    format: "planestudio-rpa-practice-assets",
    assetPackId: "sit-automation-case",
    version: VERSION,
    generatedAt: GENERATED_AT,
    company: "Servicios Integrados Tecnológicos S.A.",
    scenario: "Consolidación, validación y registro de solicitudes comerciales recibidas desde sucursales.",
    totals: {
      inputRecords: requests.length,
      expectedValid: validRows.length,
      expectedRejected: rejectedRows.length,
    },
    scenarios: ["normal", "slow", "selector-shift", "unexpected-modal", "server-error", "incomplete-data", "extended-pagination", "expired-session"],
    paths: {
      portal: "/rpa-sandbox/portal",
      legacyApp: "/rpa-sandbox/legacy-app",
    },
  });

  writeText("input/catalogo_clientes.csv", csv(["customerId", "customerName", "region", "status", "segment"], customers));
  writeText("input/catalogo_productos.csv", csv(["productId", "productName", "currency", "unitPrice"], products));
  writeText("input/regiones.csv", csv(["region", "city", "branch", "timezone"], regions));
  writeText("input/solicitudes_sucursales.csv", csv(requestHeaders.slice(0, 10), requests.filter((row) => row[9] === "solicitudes_sucursales.csv")));
  writeJson("input/parametros_proceso.json", { version: VERSION, maxRetries: 2, timeoutMs: 7000, slowModeMs: 1800, acceptedCurrencies: ["COP", "USD"], runIdPrefix: "RUN-SIT-RPA" });
  writeJson("input/rutas_config.json", { input: "input", processed: "processed", errors: "errors", output: "output", screenshots: "evidence/screenshots", logs: "logs" });

  writeXlsx("input/ventas_bogota_2026_07.xlsx", requestHeaders.slice(0, 10), requests.filter((row) => row[9].includes("bogota")));
  writeXlsx("input/ventas_medellin_2026_07.xlsx", requestHeaders.slice(0, 10), requests.filter((row) => row[9].includes("medellin")));
  writeXlsx("input/ventas_caribe_2026_07.xlsx", requestHeaders.slice(0, 10), requests.filter((row) => row[9].includes("caribe")));

  writeText("expected/registros_validos.csv", csv(requestHeaders, validRows));
  writeText("expected/registros_rechazados.csv", csv([...requestHeaders, "rejectionReason"], rejectedRows));
  writeText("expected/consolidado_esperado.csv", csv(requestHeaders, validRows));
  writeJson("expected/metricas_esperadas.json", { total: 10, valid: 9, rejected: 1, duplicate: 0, blockedCustomers: 1, currencies: ["COP", "USD"] });
  writeText("expected/log_esperado.csv", csv(["timestamp", "correlationId", "level", "step", "message"], [
    ["2026-07-29T08:00:00.000Z", "COR-SIT-2026-0001", "INFO", "read", "Archivo leído"],
    ["2026-07-29T08:01:00.000Z", "COR-SIT-2026-REJ-0001", "WARN", "validate", "Cliente bloqueado"],
    ["2026-07-29T08:09:00.000Z", "COR-SIT-2026-0009", "INFO", "write", "Consolidado generado"],
  ]));
  writeText("expected/resumen_ejecutivo.md", `# Resumen ejecutivo esperado

- Solicitudes recibidas: 10
- Válidas: 9
- Rechazadas: 1
- Motivo principal de rechazo: cliente bloqueado
- Resultado esperado: consolidado generado y log con correlationId por registro.
`);

  const corrupted = [
    ["missing_columns.csv", ["requestId", "customerId", "quantity"], [["SOL-2026-9001", "CLI-0001", 2]], "INC-RPA-DATA-001"],
    ["wrong_headers.csv", ["idSolicitud", "cliente", "producto", "cantidad"], [["SOL-2026-9002", "CLI-0001", "PROD-001", 1]], "INC-RPA-DATA-002"],
    ["duplicates.csv", requestHeaders.slice(0, 10), [requests[0], requests[0]], "INC-RPA-004"],
    ["invalid_dates.csv", requestHeaders.slice(0, 10), [[...requests[1].slice(0, 6), "31/31/2026", ...requests[1].slice(7)]], "INC-RPA-DATA-003"],
    ["non_numeric_amounts.csv", requestHeaders.slice(0, 10), [[...requests[2].slice(0, 4), "ABC", ...requests[2].slice(5)]], "INC-RPA-DATA-004"],
    ["wrong_delimiter.csv", requestHeaders.slice(0, 10), [requests[3]], "INC-RPA-DATA-005"],
    ["empty_file.csv", [], [], "INC-RPA-DATA-006"],
    ["wrong_name_ventas_julio.csv", requestHeaders.slice(0, 10), [requests[4]], "INC-RPA-DATA-007"],
    ["repeated_id.csv", requestHeaders.slice(0, 10), [[...requests[5]], ["SOL-2026-0006", ...requests[6].slice(1)]], "INC-RPA-DATA-008"],
    ["unknown_product.csv", requestHeaders.slice(0, 10), [[...requests[7].slice(0, 2), "PROD-999", ...requests[7].slice(3)]], "INC-RPA-DATA-009"],
    ["blocked_customer.csv", requestHeaders.slice(0, 10), [requests[2]], "INC-RPA-DATA-010"],
    ["invalid_currency.csv", requestHeaders.slice(0, 10), [[...requests[8].slice(0, 5), "EUR", ...requests[8].slice(6)]], "INC-RPA-DATA-011"],
    ["partial_processed.csv", [...requestHeaders.slice(0, 10), "processedAt"], [[...requests[9], "2026-07-29T08:10:00.000Z"]], "INC-RPA-008"],
  ];
  const corruptManifest = [];
  for (const [name, headers, rows, incident] of corrupted) {
    writeText(`corrupted/${name}`, headers.length ? csv(headers, rows, name === "wrong_delimiter.csv" ? ";" : ",") : "");
    corruptManifest.push({ file: `corrupted/${name}`, reproduces: incident });
  }
  fs.writeFileSync(path.join(ROOT, "corrupted/bad_encoding.csv"), Buffer.from("requestId,customerId,comment\nSOL-2026-9003,CLI-0001,Caracter inv\xe1lido\n", "latin1"));
  corruptManifest.push({ file: "corrupted/bad_encoding.csv", reproduces: "INC-RPA-DATA-012" });
  writeJson("corrupted/manifest.json", corruptManifest);

  writeText("reference/lab_asset_map.csv", csv(["lab", "assets", "reset", "expected"], [
    ["LAB-104", "input/solicitudes_sucursales.csv,templates/pdd-ligero.md,expected/log_esperado.csv", "Borrar output local y volver a copiar input", "expected/log_esperado.csv"],
    ["LAB-105", "input/*.xlsx,input/solicitudes_sucursales.csv,expected/consolidado_esperado.csv", "Borrar output local y volver a copiar input", "expected/metricas_esperadas.json"],
    ["LAB-106", "portal/portal-data.json,/rpa-sandbox/portal", "Botón Reset del portal", "expected/registros_validos.csv"],
    ["LAB-107", "legacy-app/legacy-records.json,/rpa-sandbox/legacy-app", "Botón Reset del simulador", "expected/log_esperado.csv"],
    ["LAB-108", "/rpa-sandbox/portal,/rpa-sandbox/legacy-app,templates/selector-troubleshooting-checklist.md", "Volver ambos simuladores a modo normal", "validation/matriz_operacional.csv"],
    ["LAB-109", "corrupted/duplicates.csv,corrupted/partial_processed.csv", "Limpiar checkpoint", "expected/registros_rechazados.csv"],
    ["LAB-110", "manifest.json,input/parametros_proceso.json,expected/metricas_esperadas.json", "Usar nuevo correlationId", "expected/metricas_esperadas.json"],
    ["LAB-111", "validation/matriz_operacional.csv,templates/runbook.md", "Nuevo registro de validación", "Estado bloqueado si no hay licencia"],
    ["LAB-112", "README.md,reference/lab_asset_map.csv,templates/as-is.md,templates/to-be.md,templates/test-plan.md,templates/casos-uat.md", "Restaurar input y reiniciar simuladores", "expected/resumen_ejecutivo.md"],
  ]));
  writeText("reference/matriz_viabilidad_rpa.csv", csv(["criterio", "peso", "score_1", "score_5"], [
    ["volumen", 10, "menos de 20 casos/mes", "más de 1000 casos/mes"],
    ["frecuencia", 8, "ocasional", "diaria"],
    ["reglas definidas", 10, "criterio humano variable", "reglas claras"],
    ["estabilidad UI", 10, "cambia semanalmente", "estable"],
    ["API disponible", 12, "API madura", "sin API viable"],
    ["excepciones", 8, "muchas variantes", "pocas excepciones"],
    ["mantenimiento", 10, "alto", "controlado"],
  ]));
  writeText("reference/comparativa_tecnologica.csv", csv(["opcion", "usar_cuando", "evitar_cuando"], [
    ["Power Automate cloud", "hay conector/evento/API", "solo existe interfaz de escritorio"],
    ["Power Automate Desktop", "UI es la frontera accesible", "hay API soportada y estable"],
    ["Logic Apps", "integración enterprise y monitoreo Azure", "proceso depende de sesión Windows"],
    ["Custom connector", "API reusable con gobierno", "API no existe o viola soporte"],
    ["Python/.NET", "requiere lógica compleja y ciclo DevOps", "equipo no puede operar código"],
    ["Proceso manual rediseñado", "la automatización aumenta riesgo", "volumen y reglas justifican robot"],
  ]));
  writeJson("portal/portal-data.json", { version: VERSION, requests: validRows.map((row) => Object.fromEntries(requestHeaders.map((header, index) => [header, row[index]]))) });
  writeJson("portal/scenarios.json", ["normal", "slow", "selector-shift", "unexpected-modal", "server-error", "incomplete-data", "extended-pagination", "expired-session"]);
  writeJson("legacy-app/legacy-records.json", { version: VERSION, records: validRows.slice(0, 5).map((row) => ({ requestId: row[0], customerId: row[1], productId: row[2], status: "pending" })) });
  writeText("logs/run_history_sample.csv", csv(["runId", "mode", "startedAt", "endedAt", "status", "records", "errors"], [["RUN-SIT-RPA-0001", "simulation", "2026-07-29T08:00:00.000Z", "2026-07-29T08:10:00.000Z", "completed-with-rejections", 10, 1]]));

  const templates = [
    ["matriz-viabilidad-rpa", "Matriz de viabilidad RPA", ["Proceso", "Volumen", "Frecuencia", "API disponible", "Resultado recomendado"]],
    ["checklist-descubrimiento", "Checklist de descubrimiento", ["Proceso", "Dueño", "Sistemas", "Excepciones", "Datos sensibles"]],
    ["as-is", "Documento AS-IS", ["Proceso actual", "Pasos", "Sistemas", "Dolores", "Métricas"]],
    ["to-be", "Documento TO-BE", ["Proceso futuro", "Automatizado por", "Controles", "Excepciones"]],
    ["inventario-aplicaciones", "Inventario de aplicaciones", ["Aplicación", "Tipo", "API", "Owner", "Riesgos"]],
    ["matriz-excepciones", "Matriz de excepciones", ["Código", "Descripción", "Recuperación", "Responsable"]],
    ["pdd-ligero", "PDD ligero", ["Objetivo", "Alcance", "Inputs", "Outputs", "Exclusiones"]],
    ["diseno-solucion", "Diseño de solución", ["Arquitectura", "Componentes", "Seguridad", "Operación"]],
    ["test-plan", "Test Plan", ["Caso", "Datos", "Resultado esperado", "Estado"]],
    ["casos-uat", "Casos UAT", ["Escenario", "Usuario", "Pasos", "Aceptación"]],
    ["deployment-checklist", "Deployment Checklist", ["Ambiente", "Solución", "Variables", "Rollback"]],
    ["rollback-plan", "Rollback Plan", ["Disparador", "Pasos", "Owner", "Validación"]],
    ["runbook", "Runbook", ["Inicio", "Monitoreo", "Errores", "Escalamiento"]],
    ["reporte-incidente", "Reporte de incidente", ["Síntoma", "Impacto", "Evidencia", "Severidad"]],
    ["rca", "RCA", ["Causa raíz", "Corrección", "Prevención", "Validación"]],
    ["machine-readiness-checklist", "Machine Readiness Checklist", ["Máquina", "Runtime", "Sesión", "Licencia"]],
    ["selector-troubleshooting-checklist", "Selector Troubleshooting Checklist", ["Elemento", "Selector", "Fallback", "Regresión"]],
    ["security-checklist", "Security Checklist", ["Cuenta", "Secretos", "DLP", "Datos sensibles"]],
    ["registro-automatizaciones", "Registro de automatizaciones", ["Nombre", "Owner", "SLA", "Estado"]],
    ["maintenance-checklist", "Maintenance Checklist", ["Cambio", "Prueba", "Evidencia", "Fecha"]],
  ];
  templates.forEach(([name, title, fields]) => template(name, title, fields));

  writeText("validation/matriz_operacional.csv", csv(["caso", "ambiente", "licencia", "maquina", "usuario", "fecha", "version", "pasos", "resultadoEsperado", "resultadoObservado", "evidencia", "runId", "error", "recuperacion", "diferencias", "estado", "responsable"], [
    ["attended manual", "tenant", "Power Automate Premium", "laboratorio", "anonimizado", "", VERSION, "Ejecutar desktop flow manual", "Ejecución completada", "", "", "", "", "", "", "preparado", ""],
    ["cloud llama desktop", "tenant", "requiere licencia válida", "machine group", "cuenta servicio", "", VERSION, "Cloud flow con inputs", "Outputs registrados", "", "", "", "", "", "", "no ejecutado", ""],
    ["unattended", "tenant", "unattended requerido", "máquina disponible", "cuenta autorizada", "", VERSION, "Ejecución sin sesión interactiva", "Run history completo", "", "", "", "", "", "", "bloqueado", ""],
  ]));
  writeText("validation/protocolo_tenant.md", `# Protocolo tenant RPA

No marques validado si solo ejecutaste simulación local.

Casos: attended, desktop flow manual, cloud llamando desktop, máquina registrada, machine group, credenciales, parámetros input/output, run history, error controlado, retry, recuperación, solución, variables por ambiente e indisponibilidad de máquina.

Unattended solo se ejecuta con licencia, máquina, cuenta, permisos y autorización. Sin eso queda bloqueado por licencia y se usa simulación.
`);
}

build();
console.log(`RPA assets generated at ${ROOT}`);
