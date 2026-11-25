---
id: lab-143
title: "Un servidor MCP propio: herramientas de negocio, pruebas, seguridad y una versión de IA que corregir"
level: "N5"
duration: 240
product: ["Model Context Protocol (MCP)", "Node.js", "TypeScript SDK de MCP", "MCP Inspector"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect"]
prerequisites:
  - "Módulo 53, Microlección 4 (MCP: host, cliente, servidor y herramientas)"
  - "Módulo 56 recomendado (fundamentos de JavaScript) si nunca has leído código de Node.js"
  - "Node.js 24 LTS o superior en tu equipo. No hace falta ningún tenant"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 143 — Un servidor MCP propio

## Objetivo

Poner en marcha en tu equipo un **servidor MCP** pequeño con dos herramientas de negocio de SIT, **probarlo** sin ningún modelo, comprobar sus **defensas HTTP** y **corregir** una versión del mismo servidor generada por IA que tiene errores de negocio y de seguridad. Al terminar sabrás qué hace falta para que un agente (Copilot Studio, Claude, VS Code) use una regla de tu empresa como herramienta, y qué no debes exponer nunca.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). La **política de aprobación de compras** (niveles por importe y un revisor de TI para Tecnología) vive en un archivo que solo conoce Compras. Cada flujo y cada agente la reimplementa a su manera, y ya hubo un error con el límite de 1.000 USD. La propuesta: **una sola herramienta MCP** que calcule el nivel, para que todos los agentes pregunten lo mismo al mismo sitio.

## Lo que vas a construir

- Una carpeta `sit-compras-mcp` con un servidor MCP de Node.js (SDK oficial de TypeScript, versión 2) y los datos del curso
- Dos herramientas: `nivel_de_aprobacion` y `buscar_proveedor`
- Una batería de pruebas con **MCP Inspector**, con los límites de la política
- Pruebas de las defensas HTTP del servidor con `curl`
- La corrección, con evidencia, de una versión generada por IA con seis errores (cinco se ven con pruebas y uno solo leyendo)
- (Opcional) El servidor expuesto con un túnel HTTPS para el Lab 142

## Qué es verificado y qué no (léelo antes de empezar)

- **Comprobado en local (2026-11-25, Windows, Node 26.12.1, Git Bash):** la instalación desde cero, las dos herramientas con todas las cifras del Ejercicio 3, los códigos HTTP del Ejercicio 4 (403, 403, 406, 200 y 405) y los síntomas de la versión de IA del Ejercicio 5. Paquetes: `@modelcontextprotocol/server` 2.4.0, `@modelcontextprotocol/node` 2.1.2 y `zod` 4.6.7.
- **Comprobado en la especificación y la documentación del SDK:** la especificación vigente de MCP es la **2026-07-28**; el transporte **Streamable HTTP** usa un único punto `/mcp` que responde a `POST`; el cliente debe aceptar `application/json` y `text/event-stream`; y los servidores deben validar el encabezado `Origin` para evitar ataques de *DNS rebinding* ([especificación: transportes](https://modelcontextprotocol.io/specification/latest/basic/transports)).
- **Sin verificar:** el Ejercicio 6 (túnel HTTPS con Dev Tunnels: requiere iniciar sesión con tu cuenta) y la conexión desde Copilot Studio (requiere créditos; ver Lab 142).

## Antes de empezar (para quien nunca ha hecho esto)

| Necesitas | Cómo lo compruebas | Si no lo tienes |
|---|---|---|
| **La teoría de MCP: Microlección 4 del Módulo 53** (unos 50 min, sin tenant). **Hazla antes de este lab** | Sabes decir qué son host, cliente, servidor y herramienta | Abre el [Módulo 53](/nivel/ia/modulo/dataverse-web-api-y-autenticacion), baja hasta el final de las actividades y despliega la sección plegada **Microlección 4 (opcional) — MCP**. Es "opcional" para el módulo, no para este lab |
| **Node.js 24 LTS** o superior | `node --version` → `v24…` o más | [nodejs.org](https://nodejs.org), versión LTS. MCP Inspector exige Node 22.23.4+, 24.22.1+ o 26.12.1+ |
| Una terminal | Git Bash, PowerShell 7, o la terminal de macOS/Linux | En Windows, Git Bash viene con [Git for Windows](https://git-scm.com/download/win) |
| `curl` | `curl --version` | Viene con Windows 10/11, macOS y Git Bash |
| Un editor de texto | VS Code o el que uses | Cualquiera sirve |
| **Saber leer** JavaScript, no escribirlo | Si `const`, `function` y `=>` te suenan, basta | Lee el [Módulo 56](/nivel/ia/modulo/fundamentos-javascript-para-power-platform) antes |

**Qué no vas a necesitar:** un tenant, una licencia ni una cuenta. Todo corre en tu equipo.

**Dos terminales:** en este lab el servidor ocupa una terminal mientras está en marcha. Las pruebas van en **otra**, abierta en la misma carpeta. En VS Code: **File** > **Open Folder** con la carpeta del lab y después **Terminal** > **New Terminal** dos veces (en el desplegable **+** puedes elegir **Git Bash**). Sin VS Code: en el Explorador de archivos, clic derecho en la carpeta > **Open Git Bash here**, dos veces.

**Crear los archivos:** créalos en VS Code (**File** > **New File** y guarda con el nombre exacto). Si usas el Bloc de notas, en **Guardar como** elige **Todos los archivos (*.*)**: si no, guarda `server.mjs.txt` y Node no lo encuentra.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Preparar la carpeta | 20 min |
| Ejercicio 2 — Leer el servidor antes de arrancarlo | 25 min |
| Ejercicio 3 — Arrancar y probar sin modelo | 30 min |
| Ejercicio 4 — Las defensas HTTP | 20 min |
| Ejercicio 5 — Fallo y corrección: la versión de la IA | 50 a 90 min |
| Ejercicio 6 — (Opcional) Exponerlo con un túnel | 20 min |
| Ejercicio 7 — ¿Lo pondrías en producción? | 15 min |
| **Total** | **de 3 h a 4 h 30 min** (lo que más varía es corregir el código del Ejercicio 5) |

## Nivel

**Nivel IA — Desarrollo asistido (N5)** — Buenas prácticas (no es una certificación oficial de Microsoft). Lab opcional: no cuenta para ningún certificado.

## Tecnologías utilizadas

- Node.js con módulos ES (`.mjs`)
- SDK de MCP para TypeScript, versión 2: `@modelcontextprotocol/server` y `@modelcontextprotocol/node`
- `zod` para describir y validar las entradas de cada herramienta
- MCP Inspector en modo línea de comandos y `curl`

## Prerrequisitos

### Entorno

- [ ] Todo lo de **Antes de empezar**
- [ ] El puerto **3000** libre en tu equipo (si no, ver **Errores frecuentes**)

### Conocimiento previo

- Módulo 53, Microlección 4: el modelo elige una herramienta por su **descripción**; las entradas se describen con un esquema
- La política de aprobación de SIT (la usaste en los Labs 131 y 136): nivel 1 hasta 1.000 USD **incluidos**, nivel 2 hasta 10.000, nivel 3 por encima; Tecnología suma a TI desde el nivel 2

---

## Ejercicio 1 — Preparar la carpeta

**Objetivo:** tener el servidor y sus datos listos para arrancar.

1. Crea una carpeta de práctica **fuera de cualquier repositorio de trabajo**, por ejemplo `sit-compras-mcp`, y dentro una subcarpeta `datos`.
2. Descarga los dos archivos de datos del curso en `datos/`:
   - [politica-aprobacion.json](/practice-assets/powerautomate/sit-compras/politica-aprobacion.json)
   - [proveedores.csv](/practice-assets/powerautomate/sit-compras/proveedores.csv)
3. Crea `package.json` con este contenido (las versiones fijas son las probadas):
   ```json
   {
     "name": "sit-compras-mcp",
     "version": "1.0.0",
     "private": true,
     "type": "module",
     "scripts": { "start": "node server.mjs" },
     "dependencies": {
       "@modelcontextprotocol/node": "2.1.2",
       "@modelcontextprotocol/server": "2.4.0",
       "zod": "4.6.7"
     }
   }
   ```
4. Crea `server.mjs` con el código del Ejercicio 2 (cópialo entero).
5. En una terminal, dentro de la carpeta:
   ```bash
   npm install
   ```
   **Qué deberías ver:** `added 6 packages` (el número puede variar si cambian las dependencias internas). Se crea la carpeta `node_modules`.

**Comprobación:** tu carpeta tiene `package.json`, `server.mjs`, `datos/politica-aprobacion.json`, `datos/proveedores.csv` y `node_modules/`.

---

## Ejercicio 2 — Leer el servidor antes de arrancarlo

**Objetivo:** saber qué hace cada parte **antes** de ejecutarlo. Nunca arranques un servidor que no has leído.

```js
// server.mjs: servidor MCP del curso (SIT Compras). Datos ficticios.
// Transporte: Streamable HTTP en http://127.0.0.1:3000/mcp (sin estado).
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { hostHeaderValidation, originValidation, toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

// --- Datos: los mismos archivos del paquete sit-compras ---
const politica = JSON.parse(readFileSync(new URL('./datos/politica-aprobacion.json', import.meta.url), 'utf8'));
const csv = readFileSync(new URL('./datos/proveedores.csv', import.meta.url), 'utf8').replace(/^\uFEFF/, '');
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
```

**Para leerlo sin haber programado en Node:**

| Lo que ves | Qué significa |
|---|---|
| `readFileSync(...)` y `JSON.parse(...)` | Lee el archivo de la política y lo convierte en un objeto |
| `.replace(/^\uFEFF/, '')` | Quita la marca invisible (BOM) con la que empieza el CSV del curso |
| `politica.niveles.find(...)` | Busca el primer nivel cuyo límite cubre el importe. `<=` incluye el límite |
| `server.registerTool('nombre', { description, inputSchema }, función)` | Declara una herramienta: su nombre, lo que el modelo lee para decidir usarla, qué entradas acepta y qué hace |
| `z.number()`, `z.string().min(2)`, `.optional()` | El esquema de las entradas. El SDK rechaza lo que no cumple **antes** de ejecutar la función |
| `{ isError: true, content: [...] }` | Un error **de la herramienta**: el modelo lo recibe como texto y puede explicarlo o corregir su llamada |
| `hostHeaderValidation`, `originValidation` | Rechazan peticiones con un `Host` u `Origin` que no estén en la lista |
| `.listen(puerto, '127.0.0.1')` | Solo acepta conexiones **de tu propio equipo** |

**Responde antes de seguir** (en la tabla de validación): ¿qué nivel esperas para 1.000 USD, para 1.000,01 y para 15.000 de Tecnología? ¿Qué pasará con un importe de 0? ¿Y si buscas un proveedor con una sola letra?

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Nivel esperado para 1.000, 1.000,01 y 15.000 Tecnología | ___ |
| Qué esperas con importe 0 y con `texto` de una letra | ___ |
| ¿Por qué la descripción de una herramienta afecta a qué hace un agente? | ___ |

---

## Ejercicio 3 — Arrancar y probar sin modelo

**Objetivo:** comprobar cada regla con entradas elegidas por ti, no por un modelo.

1. **Terminal 1:** arranca el servidor.
   ```bash
   npm start
   ```
   **Qué deberías ver:** `sit-compras-mcp escuchando en http://127.0.0.1:3000/mcp (hosts: localhost, 127.0.0.1, [::1])`. Deja esta terminal abierta.
2. **Terminal 2:** lista las herramientas.
   ```bash
   npx -y @modelcontextprotocol/inspector --cli http://127.0.0.1:3000/mcp --transport http --method tools/list
   ```
   **Qué deberías ver:** dos herramientas, `nivel_de_aprobacion` y `buscar_proveedor`, con su descripción y su esquema de entrada.
3. **Prueba los límites.** Ejecuta una vez por fila de la tabla, cambiando los argumentos:
   ```bash
   npx -y @modelcontextprotocol/inspector --cli http://127.0.0.1:3000/mcp --transport http --method tools/call --tool-name nivel_de_aprobacion --tool-arg importe=1000
   ```
   Para la categoría, añade `--tool-arg categoria=Tecnología`.
   **Los decimales van con punto:** `importe=1000.01`. Con coma (`1000,01`) el esquema lo rechaza ("expected number").
4. **Prueba la búsqueda** con `--tool-name buscar_proveedor --tool-arg texto=PRV-002`, luego con `texto=andes` y luego con `texto=a`.

### Resultado esperado del Ejercicio 3

| Llamada | Resultado (medido) |
|---|---|
| `importe=1000` | `nivel` 1, `aprobadores` `["Jefe de área"]` |
| `importe=1000.01` | `nivel` 2, `["Jefe de área","Finanzas"]` |
| `importe=5000 categoria=Tecnología` | `nivel` 2, `revisorAdicional` `"TI (en paralelo con Finanzas)"` |
| `importe=15000 categoria=Tecnología` | `nivel` 3, `["Jefe de área","Finanzas","Gerencia general"]`, más TI |
| `importe=0` | `"El importe debe ser mayor que 0."` con `isError: true` |
| `texto=PRV-002` | `total` 1: Red Global Tech S.A., Chile, Tecnología, 45 días, activo |
| `texto=andes` | `total` 1: PRV-001, Andes Cómputo S.A. (no distingue mayúsculas) |
| `texto=a` | `isError: true`: "Input validation error… texto: Too small: expected string to have >=2 characters" |

Fíjate en la última: tu función **ni siquiera se ejecutó**. La rechazó el esquema. Inspector también imprime una línea `tool_is_error` después de cada `isError`: es su forma de avisar, no un fallo del servidor.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| ¿Coinciden tus resultados con la tabla? Si no, cuál y por qué | ___ |
| ¿Acertaste tus predicciones del Ejercicio 2? | ___ |
| Diferencia entre el error de `importe=0` y el de `texto=a` (quién lo genera) | ___ |

---

## Ejercicio 4 — Las defensas HTTP

**Objetivo:** ver qué rechaza el servidor y por qué, antes de pensar en exponerlo.

Con el servidor en marcha, en la terminal 2 (**Git Bash**, macOS o Linux: este bloque no funciona tal cual en PowerShell):

```bash
B='{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
H='-H Content-Type:application/json -H MCP-Protocol-Version:2025-06-18'
# 1. Petición correcta
curl -s -w " %{http_code}\n" -X POST http://127.0.0.1:3000/mcp $H -H "Accept: application/json, text/event-stream" -d "$B"
# 2. Un Host que no está en la lista
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3000/mcp $H -H "Accept: application/json, text/event-stream" -H "Host: evil.example.com" -d "$B"
# 3. Un Origin ajeno (lo que mandaría una página web maliciosa abierta en tu navegador)
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3000/mcp $H -H "Accept: application/json, text/event-stream" -H "Origin: https://evil.example.com" -d "$B"
# 4. Sin el Accept que exige Streamable HTTP
curl -s -w " %{http_code}\n" -X POST http://127.0.0.1:3000/mcp $H -d "$B"
# 5. Lo que hace un navegador al abrir la URL
curl -s -w " %{http_code}\n" http://127.0.0.1:3000/mcp
```

### Resultado esperado del Ejercicio 4

| Prueba | Código (medido) | Por qué |
|---|---|---|
| 1. Correcta | **200**, con `event: message` y la lista de herramientas | Cumple todo |
| 2. Host ajeno | **403** | `hostHeaderValidation`: protege contra *DNS rebinding* |
| 3. Origin ajeno | **403** | `originValidation`: la especificación pide validar `Origin` |
| 4. Sin `Accept` | **406** "Not Acceptable: Client must accept both application/json and text/event-stream" | Lo exige el transporte Streamable HTTP |
| 5. GET del navegador | **405** "Method not allowed." | Este servidor sin estado solo atiende `POST` |

**Por qué importa:** un servidor MCP en tu equipo que escuche en todas las interfaces y sin estas comprobaciones lo puede llamar cualquier equipo de tu red, o una página web a través de tu navegador.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Los cinco códigos que obtuviste | ___ |
| ¿Qué ataque evitaría la prueba 3 si el servidor tocara datos reales? | ___ |

---

## Ejercicio 5 — Fallo y corrección: la versión de la IA

**Objetivo:** encontrar con **pruebas** los errores de un servidor que parece correcto.

Alguien pidió a un asistente de IA "un servidor MCP en Node que calcule el nivel de aprobación de SIT con la política de `datos/politica-aprobacion.json`". Esto es lo que entregó. Guárdalo como `server-ia.mjs` en la misma carpeta:

```js
// server-ia.mjs: salida tal como la entregó el asistente de IA (contiene errores a propósito)
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const politica = JSON.parse(readFileSync(new URL('./datos/politica-aprobacion.json', import.meta.url), 'utf8'));

function calcularNivel(importe, categoria) {
  const nivel = politica.niveles.find((n) => n.importeHasta === null || importe < n.importeHasta);
  const regla = politica.reglasPorCategoria.find((r) => r.categoria === categoria && nivel.nivel > r.desdeNivel);
  return {
    importe,
    nivel: nivel.nivel,
    aprobadores: nivel.aprobadores,
    revisorAdicional: regla ? regla.revisorAdicional : null,
  };
}

const handler = createMcpHandler(() => {
  const server = new McpServer({ name: 'sit-compras-mcp', version: '1.0.0' });
  server.registerTool(
    'nivel_de_aprobacion',
    {
      description: 'Herramienta de compras.',
      inputSchema: z.object({ importe: z.number(), categoria: z.string().optional() }),
    },
    async ({ importe, categoria }) => ({ content: [{ type: 'text', text: JSON.stringify(calcularNivel(importe, categoria)) }] }),
  );
  return server;
});

createServer(toNodeHandler(handler)).listen(3001, () => console.error('Servidor MCP listo en el puerto 3001'));
```

1. **Terminal 3:** `node server-ia.mjs`. Escucha en el puerto **3001**, así que puede convivir con el bueno.
2. **Repite las pruebas** de `nivel_de_aprobacion` del Ejercicio 3 y las del Ejercicio 4 contra `http://127.0.0.1:3001/mcp`. Añade `importe=-50`. (Esta versión no tiene `buscar_proveedor`: si la llamas, Inspector responde `tool_not_found`.)
3. **Mira dónde escucha:** en Windows, `netstat -ano | findstr :3001`; en macOS/Linux, `lsof -i :3001`. Compáralo con el puerto 3000.
4. **Anota cada diferencia** en la tabla con la prueba que la demuestra.
5. **Corrige `server-ia.mjs`**. Intenta primero sin mirar; si te bloqueas, las pistas de abajo comparan cada criterio con el Ejercicio 2. Criterios de aceptación: (1) 1.000 es nivel 1; (2) Tecnología suma a TI desde el nivel 2; (3) un importe de 0 o negativo da `isError`; (4) un `Host` ajeno da 403; (5) solo escucha en `127.0.0.1`; (6) la descripción dice qué calcula, con qué entradas y cuándo usarla.
6. Repite las pruebas hasta que la versión corregida dé los mismos resultados que el servidor del Ejercicio 2.

<details>
<summary>Pistas, de una en una (ábrelas solo si te bloqueas)</summary>

- **Criterio 1:** compara el operador dentro de `politica.niveles.find(...)` en los dos archivos. ¿Qué cambia entre `<` y `<=` con 1000?
- **Criterio 2:** compara `nivel.nivel > r.desdeNivel` con la línea equivalente del Ejercicio 2. Con nivel 2 y `desdeNivel` 2, ¿cuál da verdadero?
- **Criterio 3:** el Ejercicio 2 comprueba el importe **dentro** de la función de la herramienta, antes de calcular, y devuelve `{ isError: true, ... }`. Copia ese `if` y cambia la función de flecha corta por una con llaves.
- **Criterios 4 y 5:** el bloque "Arranque" del Ejercicio 2 importa `hostHeaderValidation` y `originValidation`, crea la lista de hosts y llama a `.listen(puerto, '127.0.0.1')`. Adáptalo con el puerto 3001.
- **Criterio 6:** escribe la descripción como si se la explicaras a alguien nuevo en Compras: qué devuelve, qué significa el importe y la categoría, y cuándo usarla.

Si ni con las pistas consigues que funcione, es válido entregar la tabla de errores con sus pruebas y señalar en el código del Ejercicio 2 qué líneas corrigen cada uno.
</details>

### Resultado esperado del Ejercicio 5 (versión de la IA, medido)

| Prueba | Servidor bueno (3000) | Versión de la IA (3001) |
|---|---|---|
| `importe=1000` | nivel 1 | **nivel 2** |
| `importe=5000 categoria=Tecnología` | nivel 2 con TI | **nivel 2 sin TI** |
| `importe=0` | `isError` | **nivel 1** |
| `importe=-50` | `isError` | **nivel 1** |
| `Host: evil.example.com` | 403 | **200** |
| `Origin: https://evil.example.com` | 403 | **200** |
| Dónde escucha | `127.0.0.1:3000` | **`0.0.0.0:3001` y `[::]:3001`** (todas las interfaces) |

El sexto error no lo detecta ninguna prueba automática: la descripción **"Herramienta de compras."** no le dice al modelo cuándo usarla ni qué significa el importe. Un agente con varias herramientas de compras la elegirá mal o no la elegirá.

**Detenla al terminar:** `Ctrl+C` en la terminal 3.

### Validación del Ejercicio 5

| Línea o parte de `server-ia.mjs` | Qué estaba mal | Prueba que lo demuestra | Tu corrección |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

---

## Ejercicio 6 — (Opcional) Exponerlo con un túnel

> **Sin verificar:** este ejercicio no se ejecutó en la prueba del curso porque requiere iniciar sesión con tu cuenta en el servicio del túnel. Solo lo necesitas si vas a hacer el Ejercicio 5 del Lab 142.

**Objetivo:** dar al servidor una dirección HTTPS pública **temporal** y que siga rechazando lo que no debe.

Copilot Studio no puede llegar a `127.0.0.1`: necesita una URL HTTPS. Para una práctica basta un túnel, como [Dev Tunnels](https://learn.microsoft.com/azure/developer/dev-tunnels/overview) de Microsoft.

1. Instala la CLI `devtunnel` siguiendo Learn e inicia sesión **tú** (`devtunnel user login`).
2. Crea el túnel al puerto 3000 y copia el nombre del host que te da (algo como `abc123-3000.use.devtunnels.ms`).
3. **Antes de reiniciar el servidor, prueba sin cambiar nada:** llama por la URL del túnel. **Qué esperas:** 403, porque el host del túnel no está en la lista.
4. Reinicia el servidor con ese host permitido. En Git Bash: `MCP_PUBLIC_HOST=abc123-3000.use.devtunnels.ms npm start`. En PowerShell: `$env:MCP_PUBLIC_HOST = "abc123-3000.use.devtunnels.ms"; npm start`.
5. Repite el paso 3: ahora debería responder 200.
6. **Apaga el túnel en cuanto termines.** El servidor no tiene autenticación: mientras el túnel esté abierto, cualquiera que sepa la URL puede usar tus herramientas.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Código por el túnel antes y después de `MCP_PUBLIC_HOST` | ___ |
| ¿Cuánto tiempo estuvo abierto el túnel? | ___ |

---

## Ejercicio 7 — ¿Lo pondrías en producción?

**Objetivo:** separar una práctica de un servicio de empresa.

Escribe una lista de lo que le falta a este servidor para que Compras lo use de verdad, y para cada punto, por qué. Como mínimo:

- **Autenticación:** quién puede llamarlo (Copilot Studio admite clave de API u OAuth 2.0).
- **Dónde corre:** no en el portátil de nadie, ni detrás de un túnel personal.
- **La fuente de la política:** un archivo en la carpeta frente a una tabla de Dataverse con dueño y versiones.
- **Pruebas automáticas:** las de los Ejercicios 3 a 5 en un script que se ejecute en cada cambio.
- **Registro:** qué se pidió, quién y cuándo.
- **Versiones de MCP:** la especificación cambia; anota qué versión usa tu SDK y cuándo la revisarás.

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Las tres carencias más graves, en orden | ___ |
| Dónde lo pondrías a correr y con qué autenticación | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `Cannot find module '@modelcontextprotocol/server'` | No se ejecutó `npm install`, o se ejecutó en otra carpeta | `npm install` dentro de `sit-compras-mcp` |
| `ENOENT … politica-aprobacion.json` | Los datos no están en `datos/` o tienen otro nombre | Descargarlos otra vez (Ejercicio 1) |
| `EADDRINUSE … 3000` | Otro programa usa el puerto | Arrancar con otro puerto (`PORT=3010 npm start` en Git Bash) y usarlo en las pruebas |
| Inspector no arranca y pide otra versión de Node | Node antiguo | Node 24 LTS o superior |
| `curl` responde 406 | Falta `Accept: application/json, text/event-stream` | Añadir el encabezado (Ejercicio 4) |
| `curl` responde 403 desde tu propio equipo | El `Host` no está en la lista (por ejemplo, usaste el nombre del equipo) | Usar `127.0.0.1` o `localhost` |
| En PowerShell, `curl` hace otra cosa | En Windows PowerShell 5.1, `curl` es un alias de `Invoke-WebRequest` | Escribir `curl.exe` |
| La versión corregida sigue dando nivel 2 con 1.000 | Cambiaste otra comparación | La que cuenta es la del `find` de `niveles` |

## 🔧 Diagnóstico y reparación

### "El agente dice que la herramienta falló, pero en Inspector funciona"

1. ¿Qué argumentos envió el agente? Míralos en su rastro de actividad. A menudo manda el importe como texto (`"15000"`) o con separador de miles.
2. Repite **esa** llamada exacta con Inspector. Si falla, el esquema la rechazó: decide si el servidor debe aceptar ese formato o si la descripción debe aclararlo.
3. ¿El agente llega al servidor? Con túnel, mira si el túnel sigue abierto y si `MCP_PUBLIC_HOST` coincide.
4. Corrige una cosa cada vez y repite la prueba.

## Checklist final

- [ ] Servidor instalado desde cero y leído antes de arrancarlo
- [ ] Las ocho llamadas del Ejercicio 3 coinciden con la tabla
- [ ] Los cinco códigos del Ejercicio 4
- [ ] Seis errores de `server-ia.mjs` encontrados con su prueba y corregidos
- [ ] (Opcional) Túnel probado con 403 y 200, y apagado
- [ ] Lista de carencias para producción

## Evidencia esperada

- La salida de `tools/list` y de las ocho llamadas del Ejercicio 3
- Los cinco códigos del Ejercicio 4
- La tabla del Ejercicio 5 y tu `server-ia.mjs` corregido
- Tus respuestas de validación

## Criterios de aprobación

- Predijiste los resultados antes de ejecutar y explicaste las diferencias
- Distingues un error del esquema, un error de la herramienta y un rechazo HTTP
- Cada error de la versión de la IA tiene una prueba que lo demuestra
- Explicas por qué la descripción de una herramienta es parte de su diseño y de su seguridad
- Sabes qué falta para producción y no expones el servidor sin autenticación

## Competencias desarrolladas

- Crear un servidor MCP con el SDK oficial y herramientas con esquema
- Probar un servidor MCP sin modelo, con casos límite
- Proteger un servidor HTTP local (interfaz, `Host`, `Origin`)
- Revisar con evidencia código de IA que parece correcto
- Valorar qué hace falta para llevar un servidor MCP a producción

## Reto adicional

**Reto básico:** añade una herramienta `condicion_de_pago` que reciba un ID de proveedor y devuelva solo sus días de pago. Pruébala con PRV-002 (45) y con un ID que no exista.

**Reto intermedio:** convierte las pruebas del Ejercicio 3 en un script que llame a Inspector y compare cada salida con la esperada, y que termine con error si alguna no coincide.

**Reto avanzado:** exige una clave de API en un encabezado (por ejemplo `X-Api-Key`) leída de una variable de entorno, devuelve 401 si falta y comprueba que Inspector necesita el encabezado para llamar.

## Preguntas de repaso

1. ¿Por qué el servidor crea una instancia de `McpServer` por petición?
2. ¿Qué diferencia hay entre `isError: true` y un código HTTP 403?
3. ¿Qué protege escuchar en `127.0.0.1` y qué protege validar `Origin`?
4. ¿Por qué "Herramienta de compras." es una mala descripción?
5. ¿Qué tendría que cambiar para que la política viniera de Dataverse?

## Limpieza del laboratorio

Detén los servidores con `Ctrl+C` en sus terminales. **Apaga y borra el túnel** si lo creaste (`devtunnel delete`, según Learn). Puedes borrar la carpeta `sit-compras-mcp` entera: no guarda nada fuera de ella.

## Siguiente laboratorio recomendado

**Lab 142 — Un agente de Copilot Studio con herramientas MCP**, Ejercicio 5, para que un agente use tu herramienta, o el **Lab 141** si aún no has auditado el servidor MCP de Dataverse.
