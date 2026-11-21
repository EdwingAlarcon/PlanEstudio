// Genera el paquete de datos "SIT Compras" de la Ruta Pro Power Automate (labs 128-139).
// Determinista: misma semilla, mismos archivos. Regenera con `npm run generate:powerautomate-assets` desde app-elearning.
import fs from "node:fs";
import path from "node:path";
import { buildXlsx, zipStore } from "./lib/zip-xlsx.mjs";

const ROOT = path.resolve(process.cwd(), "public/practice-assets/powerautomate/sit-compras");
const PUBLIC_URL = "https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras";
const VERSION = "1.0.0";
const BOM = "﻿";

// ---------- PRNG determinista (mulberry32) ----------
let seed = 20261119;
function rand() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (list) => list[Math.floor(rand() * list.length)];
const round2 = (n) => Math.round(n * 100) / 100;

// ---------- Política de aprobación (fuera del flujo: luego será variable de entorno) ----------
const politica = {
  version: "2026-01",
  moneda: "USD",
  descripcion: "Política de aprobación de compras de SIT (ficticia, generada para el curso PlanEstudio).",
  niveles: [
    { nivel: 1, importeHasta: 1000, aprobadores: ["Jefe de área"] },
    { nivel: 2, importeHasta: 10000, aprobadores: ["Jefe de área", "Finanzas"] },
    { nivel: 3, importeHasta: null, aprobadores: ["Jefe de área", "Finanzas", "Gerencia general"] },
  ],
  reglaDeLimites: "El importe se compara con 'importeHasta' incluido: 1000 es nivel 1; 1000,01 es nivel 2.",
  reglasPorCategoria: [{ categoria: "Tecnología", desdeNivel: 2, revisorAdicional: "TI", modo: "en paralelo con Finanzas" }],
  plazoRespuestaDiasHabiles: 2,
  escalarA: "Gerencia general",
};
const nivelDe = (importe) => (importe <= 1000 ? 1 : importe <= 10000 ? 2 : 3);

// ---------- Proveedores ----------
const categorias = ["Tecnología", "Mobiliario", "Servicios profesionales", "Capacitación", "Viajes", "Papelería"];
const areas = ["Comercial", "Finanzas", "TI", "Operaciones", "Talento humano", "Servicios"];
const nombresProveedor = {
  Tecnología: ["Andes Cómputo", "Red Global Tech", "Datacentro Pacífico", "Licencias Andinas"],
  Mobiliario: ["Oficinas Cóndor", "Muebles Horizonte", "Ergonomía Sierra"],
  "Servicios profesionales": ["Consultores Atlas", "Auditoría Delta", "Legal Cumbre"],
  Capacitación: ["Academia Aurora", "Formación Valle"],
  Viajes: ["Viajes Orión", "Hoteles del Puerto"],
  Papelería: ["Papelería Central", "Suministros Norte", "Insumos Andina"],
};
const paises = [["Colombia", "CO"], ["México", "MX"], ["Perú", "PE"], ["Chile", "CL"]];
const proveedores = [];
for (const categoria of categorias) {
  for (const nombre of nombresProveedor[categoria]) {
    const [pais, codigo] = pick(paises);
    const n = proveedores.length + 1;
    proveedores.push({
      id: `PRV-${String(n).padStart(3, "0")}`,
      nombre: `${nombre} ${codigo === "MX" ? "S.A. de C.V." : codigo === "CO" ? "S.A.S." : "S.A."}`,
      nit: `${codigo}-${randInt(800000000, 999999999)}`,
      correo: `facturacion@${nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ /g, "-")}.example.com`,
      pais,
      categoria,
      condicionPagoDias: pick([30, 30, 45, 60]),
      activo: true,
    });
  }
}
proveedores[4].activo = false; // un proveedor de Mobiliario dado de baja
proveedores[13].activo = false; // uno de Viajes

// ---------- Catálogo ("API" paginada servida como archivos estáticos) ----------
const articulosPorCategoria = {
  Tecnología: [["Portátil de trabajo 14\"", 1400, "unidad"], ["Monitor 27\"", 320, "unidad"], ["Licencia ofimática anual", 150, "usuario"], ["Base de acoplamiento", 210, "unidad"], ["Diadema con micrófono", 85, "unidad"], ["Servidor de archivos", 6800, "unidad"], ["Punto de acceso Wi-Fi", 390, "unidad"], ["Licencia de antivirus anual", 45, "usuario"], ["Disco SSD 1 TB", 120, "unidad"], ["Teclado y ratón inalámbricos", 60, "juego"]],
  Mobiliario: [["Silla ergonómica", 210, "unidad"], ["Escritorio regulable", 540, "unidad"], ["Archivador metálico", 180, "unidad"], ["Mesa de reuniones 8 puestos", 1650, "unidad"], ["Lámpara de escritorio", 40, "unidad"], ["Biblioteca modular", 260, "unidad"], ["Reposapiés", 35, "unidad"]],
  "Servicios profesionales": [["Consultoría de procesos (día)", 900, "día"], ["Auditoría de sistemas (paquete)", 12500, "paquete"], ["Asesoría legal (hora)", 140, "hora"], ["Diseño gráfico (pieza)", 180, "pieza"], ["Traducción técnica (página)", 25, "página"], ["Estudio de mercado", 18500, "paquete"]],
  Capacitación: [["Curso de liderazgo (persona)", 450, "persona"], ["Taller de seguridad digital (grupo)", 2200, "grupo"], ["Certificación en la nube (persona)", 320, "persona"], ["Curso de Excel avanzado (persona)", 150, "persona"], ["Programa de inglés (persona, trimestre)", 380, "persona"]],
  Viajes: [["Tiquete nacional", 240, "tiquete"], ["Tiquete internacional", 980, "tiquete"], ["Noche de hotel", 130, "noche"], ["Viáticos (día)", 60, "día"], ["Alquiler de vehículo (día)", 75, "día"]],
  Papelería: [["Resma de papel", 6, "resma"], ["Caja de bolígrafos", 9, "caja"], ["Cuaderno corporativo", 7, "unidad"], ["Tóner de impresora", 95, "unidad"], ["Carpeta de presentación", 3, "unidad"], ["Caja de grapas", 2, "caja"], ["Marcadores de pizarra", 8, "caja"], ["Etiquetas adhesivas", 12, "paquete"]],
};
const catalogo = [];
for (const categoria of categorias) {
  const provs = proveedores.filter((p) => p.categoria === categoria);
  for (const [nombre, precio, unidad] of articulosPorCategoria[categoria]) {
    const n = catalogo.length + 1;
    catalogo.push({
      CatalogoID: `CAT-${String(n).padStart(3, "0")}`,
      Nombre: nombre,
      Categoria: categoria,
      PrecioUSD: precio,
      Unidad: unidad,
      ProveedorID: pick(provs).id,
      Activo: true,
      ActualizadoEl: `2026-${String(randInt(1, 10)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    });
  }
}
catalogo[17].Activo = false; // un artículo descontinuado (Mobiliario)
const PAGE_SIZE = 20;
const paginas = Math.ceil(catalogo.length / PAGE_SIZE);

// ---------- Solicitudes históricas (enero a octubre de 2026), con suciedad a propósito ----------
const solicitudes = [];
const usuarios = ["ana.mejia", "carlos.ruiz", "diana.pardo", "felipe.osorio", "gloria.santos", "hector.lima", "irene.vega", "jorge.nunez"];
for (let i = 1; i <= 150; i += 1) {
  const categoria = pick(categorias.flatMap((c) => (c === "Papelería" || c === "Tecnología" ? [c, c, c] : [c, c])));
  const item = pick(catalogo.filter((c) => c.Categoria === categoria));
  const cantidad = item.PrecioUSD >= 5000 ? 1 : item.PrecioUSD >= 500 ? randInt(1, 6) : item.PrecioUSD >= 50 ? randInt(1, 25) : randInt(5, 120);
  const month = randInt(1, 10);
  const day = randInt(1, 28);
  const fecha = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const importe = round2(cantidad * item.PrecioUSD);
  const nivel = nivelDe(importe);
  const estado = month === 10 && day > 20 ? "Pendiente" : rand() < (nivel === 3 ? 0.3 : 0.12) ? "Rechazada" : "Aprobada";
  solicitudes.push({
    id: `SC-2026-${String(i).padStart(4, "0")}`,
    fecha,
    area: categoria === "Tecnología" && rand() < 0.5 ? "TI" : pick(areas),
    solicitante: `${pick(usuarios)}@sit-demo.example.com`,
    categoria,
    descripcion: `${item.Nombre} x${cantidad}`,
    catalogoId: item.CatalogoID,
    proveedorId: item.ProveedorID,
    cantidad,
    precio: item.PrecioUSD,
    importe,
    nivel,
    estado,
  });
}
solicitudes.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id.localeCompare(b.id));

// Suciedad: fechas en dd/mm/yyyy, precios como texto con símbolo y separador de miles, cantidades vacías, espacios.
const sucias = { fechaDMY: [], precioTexto: [], cantidadVacia: [], categoriaConEspacios: [] };
const filasExcel = solicitudes.map((s, i) => {
  let fecha = s.fecha;
  let precio = s.precio;
  let cantidad = s.cantidad;
  let categoria = s.categoria;
  if (i % 9 === 4) {
    fecha = `${s.fecha.slice(8, 10)}/${s.fecha.slice(5, 7)}/${s.fecha.slice(0, 4)}`;
    sucias.fechaDMY.push(s.id);
  }
  if (i % 11 === 7) {
    precio = `USD ${s.precio.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    sucias.precioTexto.push(s.id);
  }
  if (i % 37 === 20) {
    cantidad = "";
    sucias.cantidadVacia.push(s.id);
  }
  if (i % 13 === 9) {
    categoria = ` ${s.categoria} `;
    sucias.categoriaConEspacios.push(s.id);
  }
  return [s.id, fecha, s.area, s.solicitante, categoria, s.descripcion, s.proveedorId, cantidad, precio, s.estado];
});

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
const written = new Map();
function write(relative, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
  const file = path.join(ROOT, relative);
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, buffer);
  written.set(relative, buffer);
}

if (fs.existsSync(ROOT)) fs.rmSync(ROOT, { recursive: true });
ensureDir(ROOT);

write("politica-aprobacion.json", JSON.stringify(politica, null, 2) + "\n");

const provHeaders = ["ProveedorID", "Nombre", "NIT", "Correo", "Pais", "Categoria", "CondicionPagoDias", "Activo"];
const provRows = proveedores.map((p) => [p.id, p.nombre, p.nit, p.correo, p.pais, p.categoria, p.condicionPagoDias, p.activo ? "Sí" : "No"]);
write("proveedores.csv", csv(provHeaders, provRows));
write("proveedores.xlsx", buildXlsx([{ name: "Proveedores", table: "Proveedores", rows: [provHeaders, ...provRows] }]));

const solHeaders = ["SolicitudID", "FechaSolicitud", "Area", "Solicitante", "Categoria", "Descripcion", "ProveedorID", "Cantidad", "PrecioUnitario", "Estado"];
write("solicitudes-compra.xlsx", buildXlsx([{ name: "Solicitudes", table: "Solicitudes", rows: [solHeaders, ...filasExcel] }]));

for (let p = 1; p <= paginas; p += 1) {
  const page = {
    "@odata.count": catalogo.length,
    value: catalogo.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE),
  };
  if (p < paginas) page["@odata.nextLink"] = `${PUBLIC_URL}/catalogo/pagina-${p + 1}.json`;
  write(`catalogo/pagina-${p}.json`, JSON.stringify(page, null, 2) + "\n");
}

// ---------- Cifras esperadas ----------
const cuenta = (rows, key) => rows.reduce((acc, r) => ({ ...acc, [key(r)]: (acc[key(r)] ?? 0) + 1 }), {});
const suma = (rows) => round2(rows.reduce((s, r) => s + r.importe, 0));
const casosLab128 = [
  { titulo: "Sillas ergonómicas para Servicios", categoria: "Mobiliario", cantidad: 4, precio: 210 },
  { titulo: "Reposición de tóner", categoria: "Papelería", cantidad: 10, precio: 100 },
  { titulo: "Portátiles para nuevos analistas", categoria: "Tecnología", cantidad: 3, precio: 1400 },
  { titulo: "Estudio de mercado regional", categoria: "Servicios profesionales", cantidad: 1, precio: 18500 },
].map((c) => ({ ...c, importe: round2(c.cantidad * c.precio), nivel: nivelDe(round2(c.cantidad * c.precio)) }));

/** @type {Record<string, any>} */
const expected = {
  politica: { limitesUSD: [1000, 10000], ejemplos: { 1000: nivelDe(1000), 1000.01: nivelDe(1000.01), 10000: nivelDe(10000), 10000.01: nivelDe(10000.01) } },
  filas: {
    proveedores: proveedores.length,
    proveedoresActivos: proveedores.filter((p) => p.activo).length,
    catalogo: catalogo.length,
    catalogoActivos: catalogo.filter((c) => c.Activo).length,
    paginasCatalogo: paginas,
    solicitudes: solicitudes.length,
  },
  lab128: { casos: casosLab128 },
  solicitudes: {
    porEstado: cuenta(solicitudes, (s) => s.estado),
    porNivel: cuenta(solicitudes, (s) => s.nivel),
    porCategoria: cuenta(solicitudes, (s) => s.categoria),
    importeTotal: suma(solicitudes),
    importeAprobado: suma(solicitudes.filter((s) => s.estado === "Aprobada")),
    importePendiente: suma(solicitudes.filter((s) => s.estado === "Pendiente")),
    pendientes: solicitudes.filter((s) => s.estado === "Pendiente").map((s) => s.id),
    tecnologiaNivel2o3: solicitudes.filter((s) => s.categoria === "Tecnología" && s.nivel >= 2).length,
    suciedad: sucias,
  },
};
// ---------- Cifras de los labs 129 a 131 (P2) ----------
// Lab 129: el flujo "Alertar compra grande" dispara solo con un importe mayor que 10.000 (de los casos A-D, solo el D).
expected.lab129 = {
  umbralAlertaUSD: 10000,
  casosQueDisparan: casosLab128.filter((c) => c.importe > 10000).map((c) => c.titulo),
  casosQueNoDisparan: casosLab128.filter((c) => c.importe <= 10000).map((c) => c.titulo),
};

// Lab 130: limpieza de la tabla de Excel. Una fila se rechaza si no tiene cantidad; las demás se limpian
// (fecha dd/mm/yyyy a ISO, precio con "USD " y comas a número, categoría sin espacios).
const sinCantidad = new Set(sucias.cantidadVacia);
const limpias = solicitudes.filter((s) => !sinCantidad.has(s.id));
const sumaPor = (rows, key) =>
  Object.fromEntries(
    Object.entries(
      rows.reduce((acc, r) => {
        const k = key(r);
        acc[k] = round2((acc[k] ?? 0) + r.importe);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b)),
  );
expected.lab130 = {
  filasExcel: solicitudes.length,
  filasLimpias: limpias.length,
  filasRechazadas: [...sucias.cantidadVacia].sort(),
  fechasConvertidas: sucias.fechaDMY.length,
  preciosConvertidos: sucias.precioTexto.length,
  categoriasConEspacios: sucias.categoriaConEspacios.length,
  importeTotalLimpio: suma(limpias),
  importePorCategoriaLimpio: sumaPor(limpias, (s) => s.categoria),
  filasPorMesLimpio: Object.fromEntries(Object.entries(cuenta(limpias, (s) => s.fecha.slice(0, 7))).sort(([a], [b]) => a.localeCompare(b))),
  importePorMesLimpio: sumaPor(limpias, (s) => s.fecha.slice(0, 7)),
  pendientesLimpias: limpias.filter((s) => s.estado === "Pendiente").map((s) => ({ id: s.id, importe: s.importe, nivel: s.nivel, categoria: s.categoria })),
  importePendientesLimpias: suma(limpias.filter((s) => s.estado === "Pendiente")),
  filasConNivel3: limpias.filter((s) => s.nivel === 3).length,
};

// Lab 131: aprobaciones según la política. Una solicitud de Tecnología con nivel 2 o 3 suma al revisor de TI.
const casosLab131 = [
  { caso: "A", titulo: "Sillas ergonómicas para Servicios", categoria: "Mobiliario", importe: 840 },
  { caso: "E", titulo: "Portátiles para nuevos analistas", categoria: "Tecnología", importe: 4200 },
  { caso: "F", titulo: "Mesas de reuniones para Comercial", categoria: "Mobiliario", importe: 3300 },
  { caso: "D", titulo: "Estudio de mercado regional", categoria: "Servicios profesionales", importe: 18500 },
].map((c) => {
  const nivel = nivelDe(c.importe);
  const etapas = ["Jefe de área"];
  if (nivel >= 2) etapas.push(c.categoria === "Tecnología" ? "Finanzas + TI (todos deben aprobar)" : "Finanzas");
  if (nivel === 3) etapas.push("Gerencia general");
  return { ...c, nivel, etapas };
});
expected.lab131 = { casos: casosLab131 };

write("expected/cifras-esperadas.json", JSON.stringify(expected, null, 2) + "\n");

write(
  "README.md",
  `# SIT Compras — datos de práctica de la Ruta Pro Power Automate

Datos **ficticios** de Servicios Integrados Tecnológicos S.A. (SIT), generados para el curso PlanEstudio
(\`npm run generate:powerautomate-assets\`, versión ${VERSION}). Los correos usan el dominio reservado \`example.com\`: no existen.

| Archivo | Contenido | Lo usa |
|---|---|---|
| \`politica-aprobacion.json\` | Niveles de aprobación por importe (USD) y regla para Tecnología | Lab 128 en adelante |
| \`proveedores.xlsx\` / \`proveedores.csv\` | ${proveedores.length} proveedores (tabla de Excel \`Proveedores\`), dos inactivos | Lab 128 (importar a Dataverse) |
| \`solicitudes-compra.xlsx\` | ${solicitudes.length} solicitudes de 2026 en la tabla de Excel \`Solicitudes\`, con fechas, precios y cantidades sucios a propósito | Labs 130 y siguientes |
| \`catalogo/pagina-N.json\` | Catálogo de ${catalogo.length} artículos en ${paginas} páginas, con \`@odata.nextLink\` | Labs de HTTP y paginación |
| \`expected/cifras-esperadas.json\` | Cifras para comprobar tu trabajo | — |

El catálogo también está publicado por la app del curso en \`${PUBLIC_URL}/catalogo/pagina-1.json\`.
`,
);

const manifestFiles = [...written.keys()].sort();
write(
  "manifest.json",
  JSON.stringify(
    {
      format: "planestudio-powerautomate-practice-assets",
      assetPackId: "sit-compras",
      version: VERSION,
      company: "Servicios Integrados Tecnológicos S.A.",
      files: manifestFiles,
      bundle: "sit-compras.zip",
    },
    null,
    2,
  ) + "\n",
);
const bundleFiles = [...written.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, content]) => ({ name: `sit-compras/${name}`, content }));
fs.writeFileSync(path.join(ROOT, "sit-compras.zip"), zipStore(bundleFiles));

console.log(`SIT Compras ${VERSION}: ${manifestFiles.length} archivos + sit-compras.zip en ${path.relative(process.cwd(), ROOT)}`);
console.log(JSON.stringify(expected.filas), JSON.stringify(expected.solicitudes.porEstado), JSON.stringify(expected.solicitudes.porNivel));
