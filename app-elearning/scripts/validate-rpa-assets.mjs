import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public/practice-assets/rpa/sit-automation-case");

const REQUIRED_DIRS = ["input", "expected", "corrupted", "reference", "logs", "portal", "legacy-app", "templates", "validation"];
const REQUIRED_FILES = [
  "README.md",
  "manifest.json",
  "input/ventas_bogota_2026_07.xlsx",
  "input/ventas_medellin_2026_07.xlsx",
  "input/ventas_caribe_2026_07.xlsx",
  "input/solicitudes_sucursales.csv",
  "input/catalogo_clientes.csv",
  "input/catalogo_productos.csv",
  "input/regiones.csv",
  "input/parametros_proceso.json",
  "input/rutas_config.json",
  "expected/consolidado_esperado.csv",
  "expected/registros_validos.csv",
  "expected/registros_rechazados.csv",
  "expected/resumen_ejecutivo.md",
  "expected/log_esperado.csv",
  "expected/metricas_esperadas.json",
  "corrupted/manifest.json",
  "reference/lab_asset_map.csv",
  "reference/matriz_viabilidad_rpa.csv",
  "reference/comparativa_tecnologica.csv",
  "portal/portal-data.json",
  "portal/scenarios.json",
  "legacy-app/legacy-records.json",
  "logs/run_history_sample.csv",
  "validation/matriz_operacional.csv",
  "validation/protocolo_tenant.md",
];

const REQUIRED_TEMPLATES = [
  "matriz-viabilidad-rpa",
  "checklist-descubrimiento",
  "as-is",
  "to-be",
  "inventario-aplicaciones",
  "matriz-excepciones",
  "pdd-ligero",
  "diseno-solucion",
  "test-plan",
  "casos-uat",
  "deployment-checklist",
  "rollback-plan",
  "runbook",
  "reporte-incidente",
  "rca",
  "machine-readiness-checklist",
  "selector-troubleshooting-checklist",
  "security-checklist",
  "registro-automatizaciones",
  "maintenance-checklist",
];

function fail(message) {
  throw new Error(`RPA assets: ${message}`);
}

function exists(relative) {
  return fs.existsSync(path.join(ROOT, relative));
}

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}

function parseCsv(relative) {
  const text = read(relative).trim();
  if (!text) return [];
  return text.split(/\r?\n/).map((line) => line.split(","));
}

function assertNoCsvInjection(relative) {
  const rows = parseCsv(relative);
  for (const row of rows) {
    for (const cell of row) {
      const unquoted = cell.replace(/^"|"$/g, "");
      if (/^[=+\-@]/.test(unquoted)) fail(`${relative} contiene celda riesgosa para CSV injection: ${unquoted}`);
    }
  }
}

function validate() {
  if (!exists("")) fail(`directorio no encontrado: ${ROOT}`);
  for (const dir of REQUIRED_DIRS) {
    if (!fs.statSync(path.join(ROOT, dir)).isDirectory()) fail(`falta carpeta ${dir}`);
  }
  for (const file of REQUIRED_FILES) {
    if (!exists(file)) fail(`falta archivo ${file}`);
  }
  for (const template of REQUIRED_TEMPLATES) {
    const file = `templates/${template}.md`;
    if (!exists(file)) fail(`falta plantilla ${file}`);
    const text = read(file);
    for (const marker of ["## Propósito", "## Instrucciones", "## Campos", "## Control", "Advertencia"]) {
      if (!text.includes(marker)) fail(`${file} no contiene ${marker}`);
    }
  }

  const manifest = JSON.parse(read("manifest.json"));
  if (manifest.format !== "planestudio-rpa-practice-assets") fail("manifest format inválido");
  if (manifest.assetPackId !== "sit-automation-case") fail("manifest assetPackId inválido");
  if (manifest.version !== "1.0.0") fail("versión esperada 1.0.0");
  if (manifest.totals?.inputRecords !== 10 || manifest.totals?.expectedValid !== 9 || manifest.totals?.expectedRejected !== 1) {
    fail("manifest totals no coinciden");
  }
  for (const mode of ["normal", "slow", "selector-shift", "unexpected-modal", "server-error", "incomplete-data", "extended-pagination", "expired-session"]) {
    if (!manifest.scenarios?.includes(mode)) fail(`manifest no declara escenario: ${mode}`);
  }

  const metrics = JSON.parse(read("expected/metricas_esperadas.json"));
  if (metrics.total !== 10 || metrics.valid !== 9 || metrics.rejected !== 1) fail("métricas esperadas no coinciden");

  const corrupted = JSON.parse(read("corrupted/manifest.json"));
  if (corrupted.length < 14) fail("faltan escenarios corruptos");
  for (const item of corrupted) {
    if (!item.file || !item.reproduces) fail("manifest de corruptos incompleto");
    if (!exists(item.file)) fail(`corrupto referenciado no existe: ${item.file}`);
  }

  const map = read("reference/lab_asset_map.csv");
  for (const lab of ["LAB-104", "LAB-105", "LAB-106", "LAB-107", "LAB-108", "LAB-109", "LAB-110", "LAB-111", "LAB-112"]) {
    if (!map.includes(lab)) fail(`lab sin mapeo de assets: ${lab}`);
  }

  const scenarios = JSON.parse(read("portal/scenarios.json"));
  for (const mode of ["normal", "slow", "selector-shift", "unexpected-modal", "server-error", "incomplete-data", "extended-pagination", "expired-session"]) {
    if (!scenarios.includes(mode)) fail(`escenario del portal faltante: ${mode}`);
  }

  for (const file of fs.readdirSync(path.join(ROOT, "input")).filter((name) => name.endsWith(".csv"))) {
    assertNoCsvInjection(`input/${file}`);
  }
  for (const file of fs.readdirSync(path.join(ROOT, "expected")).filter((name) => name.endsWith(".csv"))) {
    assertNoCsvInjection(`expected/${file}`);
  }

  for (const file of fs.readdirSync(path.join(ROOT, "input")).filter((name) => name.endsWith(".xlsx"))) {
    const signature = fs.readFileSync(path.join(ROOT, "input", file)).subarray(0, 2).toString("utf8");
    if (signature !== "PK") fail(`${file} no parece XLSX zip`);
  }

  console.log("✓ RPA assets válidos (dataset, corruptos, plantillas, sandbox y validación)");
}

validate();
