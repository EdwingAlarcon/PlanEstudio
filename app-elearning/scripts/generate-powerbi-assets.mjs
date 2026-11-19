// Genera el paquete de datos "SIT Ventas" de la Ruta Pro Power BI (labs 116-127).
// Determinista: misma semilla, mismos archivos. Regenera con `npm run generate:powerbi-assets` desde app-elearning.
import fs from "node:fs";
import path from "node:path";
import { buildXlsx, zipStore } from "./lib/zip-xlsx.mjs";

const ROOT = path.resolve(process.cwd(), "public/practice-assets/powerbi/sit-ventas");
const VERSION = "1.0.0";
const BOM = "﻿";

// ---------- PRNG determinista (mulberry32) ----------
let seed = 20261118;
function rand() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (list) => list[Math.floor(rand() * list.length)];
function weighted(entries) {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, w] of entries) {
    r -= w;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

// ---------- Dimensiones ----------
const regiones = [
  { id: "R01", region: "Andina", pais: "Colombia", ciudad: "Bogotá", moneda: "COP" },
  { id: "R02", region: "Antioquia", pais: "Colombia", ciudad: "Medellín", moneda: "COP" },
  { id: "R03", region: "Caribe", pais: "Colombia", ciudad: "Barranquilla", moneda: "COP" },
  { id: "R04", region: "Centro", pais: "México", ciudad: "Ciudad de México", moneda: "MXN" },
  { id: "R05", region: "Norte", pais: "México", ciudad: "Monterrey", moneda: "MXN" },
  { id: "R06", region: "Lima", pais: "Perú", ciudad: "Lima", moneda: "PEN" },
  { id: "R07", region: "Santiago", pais: "Chile", ciudad: "Santiago", moneda: "CLP" },
];

// Correos con el dominio reservado example.com (RFC 2606): no existen.
const vendedores = [
  { id: "V01", nombre: "Laura Gómez", cargo: "Ejecutiva de cuenta", ingreso: "2021-03-01", regiones: ["R01"] },
  { id: "V02", nombre: "Andrés Rojas", cargo: "Ejecutivo de cuenta", ingreso: "2022-08-16", regiones: ["R01"] },
  { id: "V03", nombre: "Camila Restrepo", cargo: "Ejecutiva de cuenta", ingreso: "2020-01-13", regiones: ["R02"] },
  { id: "V04", nombre: "Julián Pérez", cargo: "Ejecutivo de cuenta", ingreso: "2023-02-06", regiones: ["R03"] },
  { id: "V05", nombre: "Mariana Torres", cargo: "Ejecutiva de cuenta", ingreso: "2021-10-04", regiones: ["R04"] },
  { id: "V06", nombre: "Diego Hernández", cargo: "Ejecutivo de cuenta", ingreso: "2022-05-09", regiones: ["R05"] },
  { id: "V07", nombre: "Valeria Quispe", cargo: "Ejecutiva de cuenta", ingreso: "2023-07-03", regiones: ["R06"] },
  { id: "V08", nombre: "Tomás Fuentes", cargo: "Ejecutivo de cuenta", ingreso: "2020-11-02", regiones: ["R07"] },
  { id: "V09", nombre: "Natalia Vargas", cargo: "Gerente comercial Colombia", ingreso: "2019-04-01", regiones: ["R01", "R02", "R03"] },
  { id: "V10", nombre: "Ricardo Salinas", cargo: "Gerente comercial México", ingreso: "2019-09-16", regiones: ["R04", "R05"] },
].map((v) => ({
  ...v,
  correo: `${v.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ /g, ".")}@sit-demo.example.com`,
}));
const ejecutivos = vendedores.filter((v) => v.cargo.startsWith("Ejecutiv"));

const productos = [
  ["P001", "Licencia app de negocio — anual por usuario", "Licencias", "Plataforma", 240, "Activo", "usuarios"],
  ["P002", "Licencia automatización — anual por usuario", "Licencias", "Plataforma", 180, "Activo", "usuarios"],
  ["P003", "Licencia portal externo — paquete anual", "Licencias", "Plataforma", 2400, "Activo", "paquete"],
  ["P004", "Licencia CRM ventas — anual por usuario", "Licencias", "CRM", 780, "Activo", "usuarios"],
  ["P005", "Licencia CRM servicio — anual por usuario", "Licencias", "CRM", 600, "Activo", "usuarios"],
  ["P006", "Licencia BI — anual por usuario", "Licencias", "BI", 168, "Activo", "usuarios"],
  ["P007", "Consultoría funcional — día", "Servicios", "Consultoría", 650, "Activo", "dias"],
  ["P008", "Arquitectura de soluciones — día", "Servicios", "Consultoría", 900, "Activo", "dias"],
  ["P009", "Desarrollo — día", "Servicios", "Desarrollo", 600, "Activo", "dias"],
  ["P010", "Migración de datos — paquete", "Servicios", "Proyecto", 8500, "Activo", "paquete"],
  ["P011", "Implementación CRM — paquete", "Servicios", "Proyecto", 45000, "Activo", "proyecto"],
  ["P012", "Soporte mensual básico", "Servicios", "Soporte", 1200, "Activo", "meses"],
  ["P013", "Soporte mensual premium", "Servicios", "Soporte", 3500, "Activo", "meses"],
  ["P014", "Curso maker — por persona", "Capacitación", "Cursos", 350, "Activo", "personas"],
  ["P015", "Curso administrador — por persona", "Capacitación", "Cursos", 450, "Activo", "personas"],
  ["P016", "Taller en un día — grupo", "Capacitación", "Talleres", 2800, "Activo", "paquete"],
  ["P017", "Mentoría — hora", "Capacitación", "Talleres", 120, "Activo", "horas"],
  ["P018", "Curso formularios legacy — por persona", "Capacitación", "Cursos", 300, "Descontinuado", "personas"],
].map(([id, producto, categoria, subcategoria, precio, estado, unidad]) => ({ id, producto, categoria, subcategoria, precio, estado, unidad }));

const productWeights = {
  P001: 14, P002: 10, P003: 3, P004: 8, P005: 6, P006: 9, P007: 10, P008: 4, P009: 8,
  P010: 3, P011: 1, P012: 6, P013: 3, P014: 6, P015: 4, P016: 3, P017: 5, P018: 2,
};
function quantityFor(p) {
  switch (p.unidad) {
    case "usuarios": return randInt(5, 120);
    case "dias": return randInt(2, 30);
    case "meses": return randInt(1, 12);
    case "personas": return randInt(3, 25);
    case "horas": return randInt(4, 40);
    default: return 1;
  }
}
function deliveryDays(p) {
  if (p.categoria === "Licencias") return randInt(1, 3);
  if (p.unidad === "proyecto") return randInt(60, 120);
  if (p.unidad === "paquete" && p.categoria === "Servicios") return randInt(20, 45);
  if (p.categoria === "Servicios") return randInt(5, 40);
  return randInt(7, 30);
}

// Clientes: 150 únicos, sucios a propósito.
const prefijos = [
  ["Grupo", "Servicios financieros"], ["Comercializadora", "Retail"], ["Industrias", "Manufactura"],
  ["Distribuidora", "Retail"], ["Constructora", "Construcción"], ["Clínica", "Salud"], ["Universidad", "Educación"],
  ["Banco", "Servicios financieros"], ["Seguros", "Servicios financieros"], ["Transportes", "Logística"],
  ["Alimentos", "Manufactura"], ["Energía", "Energía"], ["Logística", "Logística"], ["Farmacéutica", "Salud"],
  ["Secretaría de Gobierno", "Gobierno"],
];
const nucleos = ["Andina", "del Pacífico", "Norte", "Central", "Global", "Horizonte", "Aurora", "Cóndor", "Sierra", "Valle", "Puerto", "Cumbre", "Delta", "Atlas", "Orión"];
const sufijosPorPais = { Colombia: ["S.A.", "S.A.S.", "Ltda."], "México": ["S.A. de C.V."], "Perú": ["S.A.C.", "S.A."], Chile: ["SpA", "Ltda."] };
const segmentos = [["Empresa", 5], ["Pyme", 4], ["Gobierno", 1]];

const clientes = [];
const usados = new Set();
while (clientes.length < 150) {
  const [prefijo, industria] = pick(prefijos);
  const nombreBase = `${prefijo} ${pick(nucleos)}`;
  if (usados.has(nombreBase)) continue;
  usados.add(nombreBase);
  const region = pick(regiones);
  const segmento = industria === "Gobierno" ? "Gobierno" : weighted(segmentos.filter(([s]) => s !== "Gobierno"));
  const n = clientes.length + 1;
  clientes.push({
    id: `C${String(n).padStart(4, "0")}`,
    nombre: `${nombreBase} ${pick(sufijosPorPais[region.pais])}`,
    industria,
    segmento,
    regionId: region.id,
    ciudad: region.ciudad,
    pais: region.pais,
    alta: `20${pick(["18", "19", "20", "21", "22", "23"])}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
  });
}

// ---------- Hechos: ventas ----------
const seasonality = [0.8, 0.85, 1.0, 0.95, 1.0, 1.05, 0.9, 0.95, 1.05, 1.1, 1.15, 1.3];
const baseOrders = { 2024: 52, 2025: 62, 2026: 71 };
const lastMonth = { 2024: 12, 2025: 12, 2026: 10 };
const ventas = []; // { pedido, linea, fechaPedido, fechaEntrega, clienteId, productoId, vendedorId, regionId, cantidad, precio, descuentoPct, year, month }

function iso(d) {
  return d.toISOString().slice(0, 10);
}
for (const year of [2024, 2025, 2026]) {
  let orderSeq = 0;
  for (let month = 1; month <= lastMonth[year]; month += 1) {
    const orders = Math.round(baseOrders[year] * seasonality[month - 1] * (0.92 + rand() * 0.16));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    for (let o = 0; o < orders; o += 1) {
      orderSeq += 1;
      const pedido = `PED-${year}-${String(orderSeq).padStart(5, "0")}`;
      const cliente = pick(clientes);
      const vendedor = pick(ejecutivos.filter((v) => v.regiones.includes(cliente.regionId)));
      const fecha = new Date(Date.UTC(year, month - 1, randInt(1, daysInMonth)));
      const lines = weighted([[1, 5], [2, 3], [3, 2], [4, 1]]);
      const chosen = new Set();
      for (let l = 1; l <= lines; l += 1) {
        let producto;
        do {
          const productoId = weighted(Object.entries(productWeights));
          producto = productos.find((p) => p.id === productoId);
        } while (chosen.has(producto.id) || (producto.estado === "Descontinuado" && year > 2024));
        chosen.add(producto.id);
        const entrega = new Date(fecha.getTime() + deliveryDays(producto) * 86400000);
        const pendiente = iso(entrega) > "2026-10-31";
        ventas.push({
          pedido,
          linea: l,
          fechaPedido: iso(fecha),
          fechaEntrega: pendiente ? "" : iso(entrega),
          clienteId: cliente.id,
          productoId: producto.id,
          vendedorId: vendedor.id,
          regionId: cliente.regionId,
          cantidad: quantityFor(producto),
          precio: producto.precio,
          descuentoPct: weighted([[0, 6], [5, 3], [10, 2], [15, 1]]),
          year,
          month,
        });
      }
    }
  }
}

const importe = (v) => Math.round(v.cantidad * v.precio * (1 - v.descuentoPct / 100) * 100) / 100;

// ---------- Escritura ----------
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function cell(value) {
  const text = String(value ?? "");
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
function csv(headers, rows) {
  return BOM + [headers.join(","), ...rows.map((r) => r.map(cell).join(","))].join("\r\n") + "\r\n";
}
const written = new Map(); // ruta relativa → Buffer
function write(relative, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
  const file = path.join(ROOT, relative);
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, buffer);
  written.set(relative, buffer);
}

const ventasHeaders = ["PedidoID", "Linea", "FechaPedido", "FechaEntrega", "ClienteID", "ProductoID", "VendedorID", "RegionID", "Cantidad", "PrecioUnitario", "DescuentoPct"];
const dmy = (isoDate) => (isoDate ? `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}/${isoDate.slice(0, 4)}` : "");
const ventaRow = (v, dateFormat) => [
  v.pedido, v.linea, dateFormat(v.fechaPedido), dateFormat(v.fechaEntrega), v.clienteId, v.productoId,
  v.vendedorId, v.regionId, v.cantidad, v.precio, v.descuentoPct,
];
const identity = (x) => x;

if (fs.existsSync(ROOT)) fs.rmSync(ROOT, { recursive: true });
ensureDir(ROOT);

// 2024: fechas en formato dd/MM/yyyy (exportado desde un sistema regional) — para practicar "Using locale".
write("ventas-2024.csv", csv(ventasHeaders, ventas.filter((v) => v.year === 2024).map((v) => ventaRow(v, dmy))));
write("ventas-2025.csv", csv(ventasHeaders, ventas.filter((v) => v.year === 2025).map((v) => ventaRow(v, identity))));
// 2026: un archivo por mes. El de marzo trae una fila de total al final, como los reportes exportados a mano.
const FOOTER_MONTH = 3;
for (let month = 1; month <= lastMonth[2026]; month += 1) {
  const rows = ventas.filter((v) => v.year === 2026 && v.month === month).map((v) => ventaRow(v, identity));
  if (month === FOOTER_MONTH) {
    const total = ventas.filter((v) => v.year === 2026 && v.month === month).reduce((s, v) => s + importe(v), 0);
    rows.push(["TOTAL MARZO", "", "", "", "", "", "", "", "", "", Math.round(total * 100) / 100]);
  }
  write(`ventas-2026/ventas-2026-${String(month).padStart(2, "0")}.csv`, csv(ventasHeaders, rows));
}

// Clientes sucios: espacios, mayúsculas, industria inconsistente o vacía, ciudad vacía y 3 filas duplicadas exactas.
const messyClientes = clientes.map((c, i) => {
  let nombre = c.nombre;
  let industria = c.industria;
  let ciudad = c.ciudad;
  if (i % 11 === 3) nombre = `  ${nombre.toLowerCase()} `;
  else if (i % 13 === 5) nombre = nombre.toUpperCase();
  if (i % 9 === 2) industria = industria.toLowerCase();
  else if (i % 9 === 6) industria = `${industria} `;
  else if (i % 17 === 8) industria = industria.toUpperCase();
  if (i % 20 === 7) industria = "";
  if (i % 25 === 12) ciudad = "";
  return [c.id, nombre, industria, c.segmento, ciudad, c.pais, c.regionId, c.alta];
});
const duplicates = [messyClientes[10], messyClientes[47], messyClientes[98]];
write(
  "clientes.csv",
  csv(["ClienteID", "Cliente", "Industria", "Segmento", "Ciudad", "Pais", "RegionID", "FechaAlta"], [...messyClientes, ...duplicates]),
);

write("regiones.csv", csv(["RegionID", "Region", "Pais", "Ciudad", "Moneda"], regiones.map((r) => [r.id, r.region, r.pais, r.ciudad, r.moneda])));
write("vendedores.csv", csv(["VendedorID", "Vendedor", "Cargo", "Correo", "FechaIngreso"], vendedores.map((v) => [v.id, v.nombre, v.cargo, v.correo, v.ingreso])));
write(
  "vendedor-region.csv",
  csv(["VendedorID", "RegionID"], vendedores.flatMap((v) => v.regiones.map((r) => [v.id, r]))),
);

write(
  "productos.xlsx",
  buildXlsx([
    {
      name: "Productos",
      rows: [
        ["ProductoID", "Producto", "Categoria", "Subcategoria", "PrecioLista", "Estado", "Unidad"],
        ...productos.map((p) => [p.id, p.producto, p.categoria, p.subcategoria, p.precio, p.estado, p.unidad]),
      ],
    },
  ]),
);

// Objetivos en formato ancho (un mes por columna) por ejecutivo y año: para practicar Unpivot.
const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const objetivos = [];
for (const year of [2024, 2025, 2026]) {
  const prev = year === 2024 ? 2024 : year - 1;
  for (const v of ejecutivos) {
    const row = [v.id, year];
    for (let m = 1; m <= 12; m += 1) {
      const ref = ventas.filter((x) => x.vendedorId === v.id && x.year === prev && x.month === m).reduce((s, x) => s + importe(x), 0);
      const base = ref > 0 ? ref : 20000;
      row.push(Math.round((base * (year === 2024 ? 1.0 : 1.12)) / 1000) * 1000);
    }
    objetivos.push(row);
  }
}
write("objetivos.xlsx", buildXlsx([{ name: "Objetivos", rows: [["VendedorID", "Anio", ...meses], ...objetivos] }]));

// Tipos de cambio (ficticios) en JSON anidado: para practicar datos semiestructurados.
const tasaBase = { COP: 3950, MXN: 17.2, PEN: 3.72, CLP: 905 };
const tasas = [];
for (const year of [2024, 2025, 2026]) {
  for (let m = 1; m <= lastMonth[year]; m += 1) {
    const t = (year - 2024) * 12 + m;
    tasas.push({
      mes: `${year}-${String(m).padStart(2, "0")}`,
      tasas: Object.fromEntries(
        Object.entries(tasaBase).map(([k, v]) => [k, Math.round(v * (1 + 0.004 * t + (rand() - 0.5) * 0.02) * 100) / 100]),
      ),
    });
  }
}
write(
  "tipos-cambio.json",
  JSON.stringify({ base: "USD", fuente: "Ficticio — generado para el curso PlanEstudio", meses: tasas }, null, 2) + "\n",
);

// ---------- Cifras esperadas (para validar los labs) ----------
const round2 = (n) => Math.round(n * 100) / 100;
const sumBy = (rows) => round2(rows.reduce((s, v) => s + importe(v), 0));
const byYear = Object.fromEntries([2024, 2025, 2026].map((y) => [y, ventas.filter((v) => v.year === y)]));
const v2025 = byYear[2025];
const catTotals = {};
for (const v of v2025) {
  const cat = productos.find((p) => p.id === v.productoId).categoria;
  catTotals[cat] = round2((catTotals[cat] ?? 0) + importe(v));
}
const regionTotals2025 = {};
for (const v of v2025) {
  const reg = regiones.find((r) => r.id === v.regionId).region;
  regionTotals2025[reg] = round2((regionTotals2025[reg] ?? 0) + importe(v));
}
const expected = {
  importeDefinicion: "Importe = Cantidad * PrecioUnitario * (1 - DescuentoPct / 100), redondeado a 2 decimales por línea",
  filas: {
    "ventas-2024.csv": byYear[2024].length,
    "ventas-2025.csv": byYear[2025].length,
    "ventas-2026 (10 archivos, sin la fila TOTAL)": byYear[2026].length,
    "ventas-2026 (filas de datos tal como vienen, con la fila TOTAL)": byYear[2026].length + 1,
    "clientes.csv (con duplicados)": messyClientes.length + duplicates.length,
    "clientes únicos": clientes.length,
    productos: productos.length,
    vendedores: vendedores.length,
    "vendedor-region": vendedores.reduce((s, v) => s + v.regiones.length, 0),
  },
  pedidos: Object.fromEntries([2024, 2025, 2026].map((y) => [y, new Set(byYear[y].map((v) => v.pedido)).size])),
  importePorAnio: { 2024: sumBy(byYear[2024]), 2025: sumBy(byYear[2025]), 2026: sumBy(byYear[2026]) },
  importeTotal: sumBy(ventas),
  importe2025PorCategoria: catTotals,
  importe2025PorRegion: regionTotals2025,
  unidades2025: v2025.reduce((s, v) => s + v.cantidad, 0),
  lineasSinFechaEntrega: ventas.filter((v) => !v.fechaEntrega).length,
  clientesConIndustriaVacia: messyClientes.filter((c) => c[2] === "").length,
  // Lab 117
  erroresFecha2024ConIngles: byYear[2024].filter((v) => Number(v.fechaPedido.slice(8, 10)) > 12).length,
  // Lab 118
  lineasTotales: ventas.length,
  pedidosTotales: new Set(ventas.map((v) => v.pedido)).size,
  filasObjetivosLargo: objetivos.length * 12,
  objetivosPorAnio: Object.fromEntries(
    [2024, 2025, 2026].map((y) => [y, objetivos.filter((o) => o[1] === y).reduce((s, o) => s + o.slice(2).reduce((a, b) => a + b, 0), 0)]),
  ),
  filasTiposCambioLargo: tasas.length * 4,
  // Lab 119
  importe2025PorEntrega: sumBy(ventas.filter((v) => v.fechaEntrega.startsWith("2025"))),
  importeDic2025PorPedido: sumBy(ventas.filter((v) => v.fechaPedido.startsWith("2025-12"))),
  importeDic2025PorEntrega: sumBy(ventas.filter((v) => v.fechaEntrega.startsWith("2025-12"))),
  importeSinFechaEntrega: sumBy(ventas.filter((v) => !v.fechaEntrega)),
  // Labs 120-122 (DAX). Todo por fecha de pedido salvo que se diga otra cosa.
  lab120: lab120Metrics(),
  lab121: lab121Metrics(),
};

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : round2((s[mid - 1] + s[mid]) / 2);
}
// Cartera pendiente de entrega al cierre de un día: pedida hasta ese día y entregada después (o aún sin entregar).
function cartera(fin) {
  return sumBy(ventas.filter((v) => v.fechaPedido <= fin && (!v.fechaEntrega || v.fechaEntrega > fin)));
}
function lab120Metrics() {
  const total = sumBy(v2025);
  const pedidos = new Set(v2025.map((v) => v.pedido)).size;
  const porVendedor = {};
  for (const v of v2025) {
    const nombre = vendedores.find((x) => x.id === v.vendedorId).nombre;
    porVendedor[nombre] = porVendedor[nombre] ?? { ventas: 0, pedidos: new Set(), clientes: new Set() };
    porVendedor[nombre].ventas += importe(v);
    porVendedor[nombre].pedidos.add(v.pedido);
    porVendedor[nombre].clientes.add(v.clienteId);
  }
  return {
    ticketPromedio2025: round2(total / pedidos),
    clientesActivos2025: new Set(v2025.map((v) => v.clienteId)).size,
    lineas2025: v2025.length,
    promedioImporteLinea2025: round2(total / v2025.length),
    medianaImporteLinea2025: median(v2025.map(importe)),
    maxImporteLinea2025: Math.max(...v2025.map(importe)),
    pctLicencias2025: Math.round((catTotals.Licencias / total) * 10000) / 100,
    ticketPorVendedor2025: Object.fromEntries(
      Object.entries(porVendedor).map(([k, x]) => [k, round2(round2(x.ventas) / x.pedidos.size)]),
    ),
    clientesPorVendedor2025: Object.fromEntries(Object.entries(porVendedor).map(([k, x]) => [k, x.clientes.size])),
    carteraPendiente: Object.fromEntries(
      ["2024-12-31", "2025-06-30", "2025-11-30", "2025-12-31", "2026-06-30", "2026-10-31", "2026-12-31"].map((d) => [d, cartera(d)]),
    ),
    // Suma (incorrecta) de las 12 carteras de fin de mes de 2025: lo que daría un SUM en vez de una semiaditiva.
    sumaCarterasFinDeMes2025: round2(
      Array.from({ length: 12 }, (_, i) => cartera(iso(new Date(Date.UTC(2025, i + 1, 0))))).reduce((a, b) => a + b, 0),
    ),
  };
}
function lab121Metrics() {
  const mes = (y, m) => sumBy(ventas.filter((v) => v.year === y && v.month === m));
  const hasta = (y, m) => sumBy(ventas.filter((v) => v.year === y && v.month <= m));
  const pedidosHasta = (y, m) => new Set(ventas.filter((v) => v.year === y && v.month <= m).map((v) => v.pedido)).size;
  const colombia = ["Andina", "Antioquia", "Caribe"];
  const totalColombia2025 = round2(colombia.reduce((s, r) => s + regionTotals2025[r], 0));
  const porCliente = {};
  for (const v of ventas) porCliente[v.clienteId] = (porCliente[v.clienteId] ?? 0) + importe(v);
  const clientesConVentas = Object.keys(porCliente).length;
  return {
    ventasMar2025: mes(2025, 3),
    ventasMar2026: mes(2026, 3),
    ytdMar2025: hasta(2025, 3),
    ytdOct2025: hasta(2025, 10),
    ytdOct2026: hasta(2026, 10),
    pedidosYtdOct2025: pedidosHasta(2025, 10),
    pedidosYtdOct2026: pedidosHasta(2026, 10),
    // Grupo de cálculo: un recuento distinto acumulado no es la suma de los recuentos mensuales.
    clientesYtdOct2025: new Set(ventas.filter((v) => v.year === 2025 && v.month <= 10).map((v) => v.clienteId)).size,
    sumaClientesMensualesEneOct2025: Array.from({ length: 10 }, (_, i) =>
      new Set(ventas.filter((v) => v.year === 2025 && v.month === i + 1).map((v) => v.clienteId)).size,
    ).reduce((a, b) => a + b, 0),
    clientesYtdOct2026: new Set(ventas.filter((v) => v.year === 2026 && v.month <= 10).map((v) => v.clienteId)).size,
    ventasOct2025: mes(2025, 10),
    ventasOctNovDic2025: round2(mes(2025, 10) + mes(2025, 11) + mes(2025, 12)),
    ventasDic2025: mes(2025, 12),
    crecimientoIngenuo2026: Math.round((sumBy(byYear[2026]) / sumBy(byYear[2025]) - 1) * 10000) / 100,
    crecimientoComparable2026: Math.round((hasta(2026, 10) / hasta(2025, 10) - 1) * 10000) / 100,
    crecimiento2025: Math.round((sumBy(byYear[2025]) / sumBy(byYear[2024]) - 1) * 10000) / 100,
    pctAntioquiaSobreTodo2025: Math.round((regionTotals2025.Antioquia / sumBy(v2025)) * 10000) / 100,
    pctAntioquiaSobreColombia2025: Math.round((regionTotals2025.Antioquia / totalColombia2025) * 10000) / 100,
    totalColombia2025,
    clientesConVentas,
    clientesSinVentas: clientes.length - clientesConVentas,
    // Columna calculada en Clientes con transición de contexto: segmentos A (>= 500.000), B (>= 200.000) y C.
    clientesSegmentoA: Object.values(porCliente).filter((x) => round2(x) >= 500000).length,
    clientesSegmentoB: Object.values(porCliente).filter((x) => round2(x) >= 200000 && round2(x) < 500000).length,
    clientesSegmentoC: Object.values(porCliente).filter((x) => round2(x) < 200000).length,
    maxVentasCliente: round2(Math.max(...Object.values(porCliente))),
    mejorCliente: clientes.find((c) => round2(porCliente[c.id]) === round2(Math.max(...Object.values(porCliente)))).nombre,
  };
}
write("expected/metricas-esperadas.json", JSON.stringify(expected, null, 2) + "\n");

write(
  "README.md",
  `# SIT Ventas — datos de práctica de la Ruta Pro Power BI

Versión ${VERSION}. Datos **ficticios** generados para el curso PlanEstudio: empresas, personas, correos
(\`@sit-demo.example.com\`, dominio reservado que no existe), precios y tipos de cambio son inventados.

Empresa del caso: Servicios Integrados Tecnológicos S.A. (SIT), que vende licencias, servicios y capacitación en
Colombia, México, Perú y Chile. Moneda de los importes: USD.

| Archivo | Qué contiene | Lo que trae "sucio" a propósito |
|---|---|---|
| \`ventas-2024.csv\` | Líneas de pedido de 2024 | Fechas en formato día/mes/año |
| \`ventas-2025.csv\` | Líneas de pedido de 2025 | — |
| \`ventas-2026/\` | Un CSV por mes (enero a octubre de 2026) | El de marzo trae una fila "TOTAL MARZO" al final |
| \`clientes.csv\` | Clientes | Espacios, mayúsculas mezcladas, industria escrita de varias formas o vacía, ciudad vacía y 3 filas duplicadas |
| \`productos.xlsx\` | Catálogo con categoría, subcategoría y precio de lista | Un producto descontinuado |
| \`regiones.csv\` | País, región, ciudad y moneda | — |
| \`vendedores.csv\` | Vendedores, cargo y correo | — |
| \`vendedor-region.csv\` | Qué regiones cubre cada vendedor (los gerentes cubren varias) | — |
| \`objetivos.xlsx\` | Objetivo mensual por ejecutivo, un mes por columna | Formato ancho (hay que hacer Unpivot) |
| \`tipos-cambio.json\` | Tipo de cambio mensual USD → COP, MXN, PEN, CLP | JSON anidado |
| \`expected/metricas-esperadas.json\` | Cifras para comprobar tu trabajo | — |

**Importe de una línea** = Cantidad × PrecioUnitario × (1 − DescuentoPct / 100). El descuento viene como porcentaje
entero (0, 5, 10 o 15) para que no dependa del separador decimal de tu Windows.

Regenera con \`npm run generate:powerbi-assets\` desde \`app-elearning\`.
`,
);

const manifestFiles = [...written.keys()].sort();
write(
  "manifest.json",
  JSON.stringify(
    {
      format: "planestudio-powerbi-practice-assets",
      assetPackId: "sit-ventas",
      version: VERSION,
      company: "Servicios Integrados Tecnológicos S.A.",
      files: manifestFiles,
      bundle: "sit-ventas.zip",
    },
    null,
    2,
  ) + "\n",
);

// Paquete único para descargar todo de una vez (carpeta raíz "sit-ventas/").
const bundleFiles = [...written.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, content]) => ({ name: `sit-ventas/${name}`, content }));
fs.writeFileSync(path.join(ROOT, "sit-ventas.zip"), zipStore(bundleFiles));

console.log(`SIT Ventas ${VERSION}: ${manifestFiles.length} archivos + sit-ventas.zip en ${path.relative(process.cwd(), ROOT)}`);
console.log(JSON.stringify(expected.filas), expected.importePorAnio);
