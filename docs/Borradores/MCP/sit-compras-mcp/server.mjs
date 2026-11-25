// Servidor MCP del curso PlanEstudio (SIT Compras). Datos ficticios.
// Transporte: Streamable HTTP en http://127.0.0.1:3000/mcp (sin estado).
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { hostHeaderValidation, originValidation, toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

// --- Datos: los mismos archivos del paquete sit-compras ---
const politica = JSON.parse(readFileSync(new URL('./datos/politica-aprobacion.json', import.meta.url), 'utf8'));
const csv = readFileSync(new URL('./datos/proveedores.csv', import.meta.url), 'utf8').replace(/^﻿/, '');
const [cabecera, ...filas] = csv.trim().split(/\r?\n/);
const columnas = cabecera.split(',');
const proveedores = filas.map((fila) => Object.fromEntries(fila.split(',').map((v, i) => [columnas[i], v])));

// --- Reglas de negocio ---
function calcularNivel(importe, categoria) {
  // El límite se incluye: 1000 es nivel 1; 1000,01 es nivel 2 (reglaDeLimites).
  const nivel = politica.niveles.find((n) => n.importeHasta === null || importe <= n.importeHasta);
  const regla = politica.reglasPorCategoria.find((r) => r.categoria === categoria && nivel.nivel >= r.desdeNivel);
  return {
    importe,
    categoria: categoria ?? null,
    nivel: nivel.nivel,
    aprobadores: nivel.aprobadores,
    revisorAdicional: regla ? `${regla.revisorAdicional} (${regla.modo})` : null,
    moneda: politica.moneda,
  };
}

// --- Servidor: una instancia nueva por petición (sin estado) ---
const handler = createMcpHandler(() => {
  const server = new McpServer({ name: 'sit-compras-mcp', version: '1.0.0' });

  server.registerTool(
    'nivel_de_aprobacion',
    {
      description:
        'Calcula el nivel de aprobación (1, 2 o 3) y los aprobadores de una solicitud de compra de SIT según la política de compras, a partir del importe en USD y, opcionalmente, la categoría.',
      inputSchema: z.object({
        importe: z.number().describe('Importe total de la solicitud en USD, mayor que 0'),
        categoria: z.string().optional().describe('Categoría de la compra, por ejemplo Tecnología o Mobiliario'),
      }),
    },
    async ({ importe, categoria }) => {
      if (!(importe > 0)) {
        return { isError: true, content: [{ type: 'text', text: 'El importe debe ser mayor que 0.' }] };
      }
      const resultado = calcularNivel(importe, categoria);
      return { content: [{ type: 'text', text: JSON.stringify(resultado) }] };
    },
  );

  server.registerTool(
    'buscar_proveedor',
    {
      description:
        'Busca proveedores de SIT por su ID (por ejemplo PRV-002) o por una parte del nombre, y devuelve país, categoría, condición de pago y si está activo.',
      inputSchema: z.object({
        texto: z.string().min(2).describe('ID del proveedor o parte de su nombre'),
      }),
    },
    async ({ texto }) => {
      const t = texto.toLowerCase();
      const encontrados = proveedores
        .filter((p) => p.ProveedorID.toLowerCase() === t || p.Nombre.toLowerCase().includes(t))
        .map(({ ProveedorID, Nombre, Pais, Categoria, CondicionPagoDias, Activo }) => ({ ProveedorID, Nombre, Pais, Categoria, CondicionPagoDias: Number(CondicionPagoDias), Activo: Activo === 'Sí' }));
      return { content: [{ type: 'text', text: JSON.stringify({ total: encontrados.length, proveedores: encontrados }) }] };
    },
  );

  return server;
});

// --- Arranque: solo localhost, más el nombre del túnel si lo indicas ---
const puerto = Number(process.env.PORT ?? 3000);
const hostPublico = process.env.MCP_PUBLIC_HOST; // por ejemplo abc123-3000.use.devtunnels.ms
const hostsPermitidos = ['localhost', '127.0.0.1', '[::1]', ...(hostPublico ? [hostPublico] : [])];
const validarHost = hostHeaderValidation(hostsPermitidos);
const validarOrigen = originValidation(hostsPermitidos);
const nodeHandler = toNodeHandler(handler);

createServer((req, res) => {
  if (!validarHost(req, res) || !validarOrigen(req, res)) return;
  void nodeHandler(req, res);
}).listen(puerto, '127.0.0.1', () => {
  console.error(`sit-compras-mcp escuchando en http://127.0.0.1:${puerto}/mcp (hosts: ${hostsPermitidos.join(', ')})`);
});
