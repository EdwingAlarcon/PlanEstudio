---
id: lab-141
title: "Un cliente de IA con el servidor MCP de Dataverse: permitir, conectar, consultar y controlar"
level: "N5"
duration: 210
product: ["Dataverse", "Model Context Protocol (MCP)", "Dataverse CLI", "MCP Inspector"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect", "Administrador"]
prerequisites:
  - "Módulo 53 estudiado, incluida la Microlección 4 (MCP: cuando quien llama a Dataverse es un agente de IA)"
  - "Lab 132 recomendado: las tablas Proveedor y Solicitud de compra con datos (si no, cualquier tabla tuya con filas)"
  - "Un ambiente de práctica con Dataverse en el que seas administrador, y un administrador del inquilino que pueda dar el consentimiento del Ejercicio 2 (o la variante en papel)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 141 — Un cliente de IA con el servidor MCP de Dataverse

## Objetivo

Conectar un cliente al **servidor MCP de Dataverse** de tu ambiente de práctica y comprobar con tus propios datos **qué puede hacer** un agente con él: qué herramientas ve, qué consulta, qué escribe y qué borra. Al terminar sabrás qué tres permisos hacen falta (el del inquilino, el del ambiente y tu rol), habrás llamado a las herramientas sin un modelo de por medio y habrás visto que la "aprobación del usuario" la pone el cliente.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). El área de Compras quiere preguntarle a un asistente de IA cosas como "¿qué proveedor tiene más solicitudes?" sin abrir la app. Seguridad acepta probarlo en el ambiente de práctica con una condición: antes de conectar ningún modelo, alguien tiene que demostrar **qué herramientas expone el servidor** y **qué lo frena**. Ese alguien eres tú.

## Lo que vas a construir

- El ambiente de práctica con el cliente **Dataverse CLI** permitido para MCP
- Un perfil de conexión de la CLI de Dataverse con tu cuenta
- Una lista de las herramientas que ofrece tu servidor, obtenida con **MCP Inspector**
- Dos consultas en Dataverse SQL comparadas con los datos que ya conoces
- Una fila creada y borrada por MCP, con la prueba de cómo se comporta `hasUserApproved`
- (Opcional) Un cliente de IA conectado, con la herramienta que eligió el modelo anotada
- Una recomendación escrita para Seguridad

## Qué es verificado y qué no (léelo antes de empezar)

- **Comprobado en un tenant real (2026-11-25, ambiente Trial de práctica):** los Ejercicios 1 a 5. La pantalla de consentimiento, los mensajes de la CLI (`--validate` con 403 antes de permitir el cliente y "GA endpoint is valid" después), las 16 herramientas, las consultas con `read_query` y el comportamiento de `delete_record` con `hasUserApproved`. Los comandos se ejecutaron en **Git Bash** sobre Windows.
- **Comprobado en Learn (2026-11-25):** la disponibilidad general del servidor (15-12-2025), la ruta del centro de administración, que Copilot Studio está permitido por defecto, los pasos para clientes que no son de Microsoft y que su uso fuera de Copilot Studio se factura ([Learn: Dataverse MCP](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp), [Learn: otros clientes](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp-other-clients), [Learn: preguntas frecuentes](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp-faq)).
- **Sin verificar:** el Ejercicio 6 con un modelo real (qué herramienta elige y cómo escribe la consulta depende del cliente y del modelo), la interfaz gráfica de MCP Inspector (se usó su modo de línea de comandos) y los nombres de las opciones del centro de administración en español. La CLI `@microsoft/dataverse` está en **versión preliminar** (1.0.95 al probarla): sus mensajes pueden cambiar.

## Antes de empezar (para quien nunca ha hecho esto)

Lee esta lista entera. Si te falta algo, haz la **variante en papel** del final de cada ejercicio: es válida.

| Necesitas | Cómo lo compruebas | Si no lo tienes |
|---|---|---|
| **La teoría de MCP: Microlección 4 del Módulo 53** (unos 50 min, sin tenant). **Hazla antes de este lab** | Sabes decir qué son host, cliente, servidor y herramienta | Abre el [Módulo 53](/nivel/ia/modulo/dataverse-web-api-y-autenticacion), baja hasta el final de las actividades y despliega la sección plegada **Microlección 4 (opcional) — MCP**. Es "opcional" para el módulo, no para este lab |
| Un **ambiente de práctica** con Dataverse (Trial o Developer), **nunca producción** | En [Power Apps](https://make.powerapps.com), arriba a la derecha, el nombre del ambiente | Crea uno: [Ambientes y trials del curso](/recursos/entornos-y-trials) |
| Ser **administrador de ese ambiente** | En el [centro de administración](https://admin.powerplatform.microsoft.com) ves **Settings** del ambiente | Si lo creaste tú, lo eres |
| Un **administrador del inquilino** que acepte el consentimiento del Ejercicio 2 | Pregunta a quien gestiona Microsoft Entra ID en tu organización | Variante en papel del Ejercicio 2. **No** uses una cuenta de otra persona |
| **Node.js 24 LTS** o superior | En una terminal: 
ode --version` → `v24…` | [nodejs.org](https://nodejs.org), versión LTS. MCP Inspector exige Node 22.23.4+, 24.22.1+ o 26.12.1+ |
| Una terminal **Git Bash** (Windows) o la terminal de macOS/Linux | En Windows viene con [Git for Windows](https://git-scm.com/download/win) | Puedes usar PowerShell para todo menos el Ejercicio 5 (ver la nota allí) |
| La **dirección de tu ambiente** | Power Apps > **Settings** (engranaje) > **Session details** > **Instance url**: `https://<org>.crm<n>.dynamics.com` | Sin ella no puedes seguir |

**Qué no vas a necesitar:** registrar una aplicación, crear secretos ni programar. Todo se hace con dos herramientas de línea de comandos que se descargan solas con 
px`.

**Seguridad:** el servidor MCP actúa **con tu cuenta y tu rol**. Haz el lab en el ambiente de práctica; si tu cuenta es administradora de otros ambientes, comprueba en cada comando que la dirección es la del ambiente de práctica.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — ¿Qué clientes permite tu ambiente? | 15 min |
| Ejercicio 2 — El consentimiento del inquilino | 15 min |
| Ejercicio 3 — La CLI de Dataverse: perfil, validar y permitir | 30 min |
| Ejercicio 4 — Ver las herramientas y consultar sin modelo | 30 min |
| Ejercicio 5 — Escribir, borrar y la bandera de aprobación | 25 min |
| Ejercicio 6 — (Opcional) Un modelo de verdad | 20 min |
| Ejercicio 7 — La recomendación para Seguridad | 15 min |
| **Total** | **unas 2 h 30 min con experiencia en terminal; de 3 h 30 min a 4 h la primera vez** (más la espera del consentimiento si lo da otra persona) |

## Nivel

**Nivel IA — Desarrollo asistido (N5)** — Buenas prácticas (no es una certificación oficial de Microsoft). Lab opcional: no cuenta para ningún certificado.

## Tecnologías utilizadas

- Servidor MCP de Dataverse (`https://<org>/api/mcp`)
- CLI de Dataverse `@microsoft/dataverse` (versión preliminar), como servidor MCP local por **stdio**
- MCP Inspector (`@modelcontextprotocol/inspector`), en modo línea de comandos
- Dataverse SQL (la herramienta `read_query`)

## Prerrequisitos

### Entorno

- [ ] Todo lo de **Antes de empezar**
- [ ] Las tablas del Lab 132 con datos. Anota el **prefijo de tu publicador** (en los ejemplos, `sit_`) y los **nombres lógicos** de las tablas: `sit_proveedor` y `sit_solicituddecompra` en los ejemplos

### Conocimiento previo

- Módulo 53, Microlección 4: host, cliente, servidor y herramientas; quién llama y con qué permisos
- Módulo 53, Microlección 2: la diferencia entre un usuario de aplicación y tu propia cuenta

---

## Ejercicio 1 — ¿Qué clientes permite tu ambiente?

**Objetivo:** ver el interruptor del ambiente antes de tocar nada.

1. Abre el [centro de administración de Power Platform](https://admin.powerplatform.microsoft.com) > **Manage** > **Environments** > tu ambiente de práctica > **Settings** > **Product** > **Features**.
2. Busca la sección **Dataverse Model Context Protocol** y abre **Advanced Settings**. **Qué deberías ver:** la lista de clientes permitidos. Según Learn, **Microsoft Copilot Studio** viene permitido por defecto.
3. **No cambies nada todavía.** Anota qué clientes aparecen y si están activos.

**Por qué importa:** este interruptor es **por ambiente**. Que un cliente funcione en tu ambiente de práctica no lo habilita en producción.

> **Variante en papel:** con [Learn: Dataverse MCP](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp) abierta, escribe dónde se permite un cliente y qué cliente viene permitido por defecto.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Clientes que aparecen en **Advanced Settings** y su estado | ___ |
| ¿El permiso es por ambiente o por inquilino? | ___ |

---

## Ejercicio 2 — El consentimiento del inquilino

**Objetivo:** entender qué aceptas antes de aceptarlo.

Para que un cliente que no es de Microsoft (como la CLI) llegue al servidor, la aplicación **Dataverse CLI** (id `0c412cc3-0dd6-449b-987f-05b053db9457`) necesita el consentimiento de un administrador del inquilino ([Learn: otros clientes](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp-other-clients)).

1. Si **tú** eres administrador del inquilino de práctica, abre en el navegador la dirección de consentimiento de Learn, con el **id de tu inquilino** (lo ves en Microsoft Entra ID > **Overview** > **Tenant ID**):
   ```text
   https://login.microsoftonline.com/<id-de-tu-inquilino>/adminconsent?client_id=0c412cc3-0dd6-449b-987f-05b053db9457
   ```
   Si no eres administrador, envíasela a quien lo sea, junto con este ejercicio. Learn indica que se hace una sola vez por inquilino.
2. **Lee la pantalla antes de aceptar.** En la prueba del curso mostró:
   - La aplicación **Dataverse CLI** con editor **"sin comprobar"** (*unverified*).
   - Dos permisos: acceder a las herramientas MCP de Dataverse como usuario de la organización, e iniciar sesión y leer el perfil.
3. Decide con el administrador si aceptar. En un inquilino de práctica, aceptar es razonable. En el de tu empresa, "editor sin comprobar" es motivo suficiente para pasarlo por el proceso de aprobación de aplicaciones de Seguridad.

> **Variante en papel (sin administrador del inquilino):** escribe el correo que le enviarías al administrador: qué aplicación, qué id, qué permisos pide, por qué la necesitas, en qué ambiente y cómo se revoca. Después sigue con la variante en papel de los demás ejercicios.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Nombre de la aplicación y editor que mostró la pantalla | ___ |
| Permisos que pedía | ___ |
| ¿Quién aceptó y en qué inquilino? (sin nombres reales si es de tu empresa) | ___ |

---

## Ejercicio 3 — La CLI de Dataverse: perfil, validar y permitir

**Objetivo:** dejar la CLI conectada a tu ambiente y ver el 403 antes de arreglarlo.

**Dónde se escriben los comandos:** en una terminal Git Bash (en Windows: menú Inicio > **Git Bash**). Para no cambiar la dirección en cada comando, guárdala **una vez** en una variable; vale para esa ventana mientras no la cierres:

```bash
URL=https://<org>.crm<n>.dynamics.com   # cámbialo por la Instance url de tu ambiente, sin / al final
echo $URL                               # debe mostrar tu dirección
```

En PowerShell sería `$URL = "https://<org>.crm<n>.dynamics.com"`. Si cierras la terminal, vuelve a crear la variable.

1. **Crea un perfil con código de dispositivo** (el modo interactivo no dejó perfil en la prueba del curso):
   ```bash
   npx -y @microsoft/dataverse auth create --environment $URL --deviceCode --name curso
   ```
   **Qué deberías ver:** un mensaje con una dirección (`https://login.microsoft.com/device`) y un código. Abre la dirección, escribe el código, elige **tu** cuenta y, en la pantalla que pregunta si quieres iniciar sesión en la aplicación, pulsa **Continuar**. Si pulsas **Cancelar**, la CLI termina con `AADSTS700171` (no pasa nada: repite el comando).
2. Comprueba con quién estás conectado:
   ```bash
   npx -y @microsoft/dataverse auth who
   ```
   **Qué deberías ver:** tu cuenta (usuario@dominio) y la dirección de tu ambiente de práctica. Si sale otro ambiente, repite el paso 1 con la dirección correcta.
3. **Valida antes de permitir el cliente:**
   ```bash
   npx -y @microsoft/dataverse mcp $URL --validate
   ```
   **Qué deberías ver** si el cliente aún no está permitido: un fallo con código **403 (Forbidden)** y una lista de cosas que revisar. Anota la primera línea del error. Es el mismo 403 del Módulo 53: estás autenticado, pero no autorizado.
4. **Permite el cliente en el ambiente** (necesitas ser administrador del ambiente):
   ```bash
   npx -y @microsoft/dataverse mcp allow 0c412cc3-0dd6-449b-987f-05b053db9457
   ```
   **Qué deberías ver:** "Client exists but is disabled. Enabling…" y "Done… enabled" (o que ya estaba activo). Puede tardar unos segundos en aplicarse. **Alternativa sin la CLI (Learn):** en **Advanced Settings** del Ejercicio 1, busca **Dataverse CLI** (o añade una entrada con cualquier nombre y ese id), pon **Is Enabled** en **Yes** y pulsa **Save & Close**.
5. Repite el paso 3. **Qué deberías ver:** "GA endpoint is valid". Si además dice que el endpoint de versión preliminar no está configurado o devuelve 403, es normal: este lab solo usa el GA (`/api/mcp`).
6. Vuelve a **Advanced Settings** del Ejercicio 1 y comprueba que **Dataverse CLI** aparece ahora como permitido.

> **Variante en papel:** escribe los cuatro comandos con la dirección de un ambiente inventado y, al lado, qué esperas que responda cada uno.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Cuenta que muestra `auth who` (puedes ocultar el dominio) | ___ |
| Primera línea del error de `--validate` antes de permitir el cliente | ___ |
| Mensaje de `--validate` después | ___ |
| ¿Qué cambió en **Advanced Settings**? | ___ |

---

## Ejercicio 4 — Ver las herramientas y consultar sin modelo

**Objetivo:** ver **todo** lo que un agente podría hacer, antes de dejar que un modelo elija.

MCP Inspector actúa como un cliente MCP sin modelo: tú eliges la herramienta y los argumentos. Arranca la CLI de Dataverse como servidor por **stdio**, igual que lo haría un cliente de IA.

1. **Lista las herramientas:**
   ```bash
   npx -y @modelcontextprotocol/inspector --cli npx -y @microsoft/dataverse mcp $URL --method tools/list
   ```
   **Qué deberías ver:** un JSON con una entrada por herramienta (
ame`, `description`, `inputSchema`). En la prueba del curso hubo **16**: `search`, `describe`, `read_query`, `create_record`, `update_record`, `delete_record`, `create_table`, `update_table`, `delete_table`, `invoke_api`, `init_file_upload`, `commit_file_upload`, `file_download`, `upsert_skill`, `delete_skill` y `create_skill_resource`. Si ves `search_data`, tu ambiente tiene activada la búsqueda de Dataverse.
2. Marca en tu tabla de evidencia las herramientas que **escriben, cambian el esquema o borran**.
3. **Busca tu tabla** (la herramienta `search` usa el parámetro `query`):
   ```bash
   npx -y @modelcontextprotocol/inspector --cli npx -y @microsoft/dataverse mcp $URL --method tools/call --tool-name search --tool-arg query=proveedor --tool-arg limit=5
   ```
   **Qué deberías ver:** entre los resultados, la ruta `tables/sit_proveedor` (con tu prefijo).
4. **Cuenta filas con Dataverse SQL** (`read_query`, parámetro `querytext`):
   ```bash
   npx -y @modelcontextprotocol/inspector --cli npx -y @microsoft/dataverse mcp $URL --method tools/call --tool-name read_query --tool-arg "querytext=SELECT COUNT(*) AS total FROM sit_proveedor"
   ```
   Repite con `sit_solicituddecompra`.
5. **Una consulta con relación:** los tres proveedores con más solicitudes.
   ```bash
   npx -y @modelcontextprotocol/inspector --cli npx -y @microsoft/dataverse mcp $URL --method tools/call --tool-name read_query --tool-arg "querytext=SELECT TOP 3 p.sit_iddeproveedor, COUNT(*) AS solicitudes FROM sit_solicituddecompra s JOIN sit_proveedor p ON s.sit_proveedor = p.sit_proveedorid GROUP BY p.sit_iddeproveedor ORDER BY COUNT(*) DESC"
   ```
6. **Contrasta** cada cifra con la app: abre la tabla en Power Apps y cuenta o filtra. Un agente te dará estas cifras en lenguaje natural; tú necesitas saber si son verdad.

### Resultado esperado del Ejercicio 4

- Proveedores: **18** si hiciste el Lab 132 completo (17 si no cargaste el archivo de actualización).
- Solicitudes: **146** del Lab 132, **más** las que hayas creado a mano o con flujos en otros labs. En la prueba del curso salieron 153 por siete filas de prueba: si tu cifra es mayor que 146, busca de dónde salen las demás antes de seguir.
- La consulta con `JOIN` devuelve tres filas con un ID de proveedor y su número de solicitudes. Comprueba al menos una en la app.

> **Variante en papel:** con la lista de las 16 herramientas de arriba, clasifícalas en "solo lee", "escribe filas", "cambia el esquema" y "borra". Escribe la consulta SQL que usarías para contar las solicitudes de un proveedor concreto.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Número de herramientas y cuáles escriben, cambian el esquema o borran | ___ |
| Total de proveedores y de solicitudes según `read_query` | ___ |
| ¿Coinciden con la app? Si no, por qué | ___ |
| Primera fila de la consulta con `JOIN` y cómo la comprobaste | ___ |

---

## Ejercicio 5 — Escribir, borrar y la bandera de aprobación

**Objetivo:** comprobar qué frena un borrado: ¿el servidor, el cliente o tu rol?

> **Terminal:** usa Git Bash (o macOS/Linux). Windows PowerShell 5.1 quita las comillas dobles de dentro de un argumento al pasárselo a un programa, y el JSON del paso 1 llega roto.

1. **Crea una fila de prueba:**
   ```bash
   npx -y @modelcontextprotocol/inspector --cli npx -y @microsoft/dataverse mcp $URL --method tools/call --tool-name create_record --tool-arg tablename=sit_proveedor --tool-arg 'item={"sit_iddeproveedor":"PRV-TEST-141","sit_nombre":"Prueba MCP del curso"}'
   ```
   **Qué deberías ver:** una respuesta con el identificador (GUID) de la fila nueva: un texto de 36 caracteres con guiones, como `3f2a…-…-…`. Búscalo en la salida con Ctrl+F (en Git Bash, selecciónalo con el ratón y copia con clic derecho > **Copy**). Si no lo encuentras, pídelo con `read_query`: `SELECT sit_proveedorid FROM sit_proveedor WHERE sit_iddeproveedor = 'PRV-TEST-141'`. Comprueba en la app que la fila existe.
2. **Intenta borrarla sin aprobación** (cambia `<GUID>` por el que copiaste):
   ```bash
   npx -y @modelcontextprotocol/inspector --cli npx -y @microsoft/dataverse mcp $URL --method tools/call --tool-name delete_record --tool-arg tablename=sit_proveedor --tool-arg recordId=<GUID> --tool-arg hasUserApproved=false
   ```
   **Qué deberías ver:** `isError: true` y "User approval is required to delete the table". Dice *table* aunque pediste una fila: anótalo como dato del mensaje, no como error tuyo.
3. **Ahora con la bandera en `true`:** repite el comando con `hasUserApproved=true`. **Qué deberías ver:** que la fila se borra. Compruébalo en la app.
4. **Piénsalo:** nadie aprobó nada en el paso 3. Escribiste `true` tú. Un cliente de IA bien hecho pregunta a la persona antes de enviar `true`, pero el servidor no puede saber si lo hizo.

> **Variante en papel:** escribe los tres comandos y, para cada uno, qué esperas. Después responde: si un agente mal configurado envía siempre `hasUserApproved=true`, ¿qué lo frenaría?

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| GUID de la fila creada (solo los 4 primeros caracteres) | ___ |
| Mensaje exacto con `hasUserApproved=false` | ___ |
| Qué pasó con `hasUserApproved=true` | ___ |
| ¿Qué control impide de verdad que un agente borre? | ___ |

---

## Ejercicio 6 — (Opcional) Un modelo de verdad

**Objetivo:** ver qué herramienta elige un modelo y comprobar su respuesta con las cifras del Ejercicio 4.

> **Sin verificar en el tenant:** este ejercicio no se probó con un modelo. Los comandos de conexión salen de Learn. Lo que conteste el modelo y la herramienta que elija dependen del cliente y del modelo.

Elige **un** cliente que ya tengas. Learn documenta VS Code con GitHub Copilot ([Learn: Dataverse MCP en VS Code](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp-vscode)) y otros clientes por stdio. Con Claude Code, por ejemplo:

```bash
claude mcp add dataverse -t stdio -- npx -y @microsoft/dataverse mcp $URL
```

1. Pregunta, con tus palabras: "¿Cuántos proveedores hay en la tabla de proveedores?" y "¿Qué tres proveedores tienen más solicitudes de compra?".
2. Anota **qué herramienta** llamó el cliente y **con qué argumentos** (la mayoría de los clientes lo muestran antes o después de ejecutar).
3. Compara las cifras con las del Ejercicio 4.
4. Pide "borra el proveedor PRV-TEST-141" **sin haberlo creado otra vez**. Anota si el cliente te pidió confirmación antes de llamar a `delete_record` y qué respondió el servidor.

**Coste:** Learn indica que las herramientas del servidor usadas por agentes fuera de Copilot Studio se facturan. En un ambiente de práctica de prueba no deberías ver un cargo, pero no lo conviertas en una rutina sin preguntar quién paga.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Cliente y modelo usados | ___ |
| Herramienta y argumentos que eligió para cada pregunta | ___ |
| ¿Coinciden sus cifras con las del Ejercicio 4? | ___ |
| ¿Pidió confirmación antes de borrar? | ___ |

---

## Ejercicio 7 — La recomendación para Seguridad

**Objetivo:** convertir lo que mediste en una decisión.

Escribe media página para Seguridad de SIT con:

1. **Qué hace falta** para conectar un cliente (inquilino, ambiente, cuenta) y quién lo autoriza.
2. **Qué puede hacer** un agente con este servidor, con la lista de herramientas que escriben o borran.
3. **Qué lo frena de verdad:** el rol de la persona. Propón el rol del analista de Compras (tabla y privilegio) para que el agente solo pueda **leer** `Proveedor` y `Solicitud de compra`.
4. **Qué no lo frena:** `hasUserApproved`, con tu evidencia del Ejercicio 5.
5. **Coste y gobierno:** quién paga, en qué ambientes se permite y cómo se revoca.

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Rol que propones para el analista (tabla y privilegio) | ___ |
| Ambientes en los que permitirías el cliente y por qué | ___ |
| Cómo se revoca el acceso (ambiente e inquilino) | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `auth create` termina sin error pero `auth who` no muestra perfil | El modo interactivo no completó el inicio de sesión | Usar `--deviceCode` (Ejercicio 3) |
| `AADSTS700171` | Se pulsó **Cancelar** en la página del código | Repetir `auth create` y pulsar **Continuar** |
| `--validate` da 403 | El cliente no está permitido en el ambiente, o falta el consentimiento del inquilino | `mcp allow` (Ejercicio 3) o consentimiento (Ejercicio 2) |
| El endpoint de versión preliminar da 403 tras permitir el cliente | Las herramientas preliminares no están habilitadas | Normal en este lab: solo se usa `/api/mcp` |
| Inspector no arranca y pide otra versión de Node | Versión de Node antigua | Node 24 LTS o superior |
| `search` responde con error de parámetro | Se usó otro nombre de argumento | El argumento se llama `query` |
| `read_query` falla con un nombre de columna | Se usó el nombre visible o el esquema con mayúsculas | Usar nombres lógicos en minúsculas (`sit_iddeproveedor`) |
| `create_record` falla al leer el JSON | Comillas perdidas en Windows PowerShell 5.1 | Usar Git Bash |
| Las cifras de la IA no cuadran con la app | El modelo escribió otra consulta (otra tabla, otro filtro) | Mirar los argumentos que envió y repetir la consulta con Inspector |

## 🔧 Diagnóstico y reparación

### "Ayer funcionaba y hoy el cliente de IA no ve Dataverse"

1. Ejecuta `mcp <url> --validate`. ¿403? Alguien quitó el cliente de **Advanced Settings** o revocó el consentimiento.
2. ¿Error de inicio de sesión? Ejecuta `auth who`: el perfil puede haber caducado. Créalo de nuevo con `--deviceCode`.
3. ¿El ambiente sigue existiendo? Un Trial vence a los 30 días (más una extensión).
4. Repara con el mínimo cambio y anota qué alerta te habría avisado antes.

## Checklist final

- [ ] Leí **Advanced Settings** del ambiente antes y después de permitir el cliente
- [ ] Sé qué pidió la pantalla de consentimiento y quién la aceptó
- [ ] Perfil de la CLI creado con `--deviceCode` y `--validate` en "GA endpoint is valid"
- [ ] Lista de herramientas con las que escriben, cambian el esquema o borran marcadas
- [ ] Dos consultas `read_query` contrastadas con la app
- [ ] Fila de prueba creada y borrada, con los dos mensajes de `delete_record`
- [ ] Recomendación para Seguridad escrita

## Evidencia esperada

- Salidas de `--validate` antes y después de permitir el cliente
- La lista de herramientas (puede ser solo los nombres)
- Las salidas de las dos consultas y la comprobación en la app
- Las salidas de `delete_record` con `false` y con `true`
- Tus tablas de validación y la recomendación

## Criterios de aprobación

- Explicas los tres permisos que hacen falta (inquilino, ambiente y rol) y quién da cada uno
- Muestras con evidencia qué herramientas puede usar un agente y cuáles son peligrosas
- Compruebas las cifras del servidor contra la app en vez de creerlas
- Demuestras que `hasUserApproved` no es un control de seguridad y propones el que sí lo es

## Competencias desarrolladas

- Permitir y validar un cliente MCP en un ambiente de Dataverse
- Usar un cliente MCP sin modelo para auditar un servidor
- Consultar Dataverse con Dataverse SQL desde MCP
- Separar los controles del cliente de los del servidor y del rol de seguridad
- Recomendar condiciones de uso de agentes con datos de negocio

## Reto adicional

**Reto básico:** llama a `describe` con la ruta que te dio `search` y anota qué información de la tabla devuelve.

**Reto intermedio:** crea un rol de **solo lectura** sobre `Proveedor` y `Solicitud de compra`, asígnaselo a un segundo usuario de práctica (si tu inquilino tiene uno) y repite el Ejercicio 5 con su perfil. Anota qué responde `create_record`.

**Reto avanzado:** quita el cliente de **Advanced Settings** y comprueba que `--validate` vuelve a dar 403. Después vuelve a permitirlo.

## Preguntas de repaso

1. ¿Qué diferencia hay entre permitir un cliente en un ambiente y dar el consentimiento en el inquilino?
2. ¿Con qué identidad consulta el servidor MCP de Dataverse: la tuya o la de una aplicación?
3. ¿Por qué conviene listar las herramientas con un cliente sin modelo antes de conectar uno con modelo?
4. ¿Qué frena de verdad un borrado y qué no?
5. ¿Qué preguntarías antes de permitir este cliente en un ambiente de producción?

## Limpieza del laboratorio

Comprueba que `PRV-TEST-141` no existe. Si no vas a hacer los Labs 142 y 143, quita **Dataverse CLI** de **Advanced Settings** del ambiente y, si lo añadiste en un cliente de IA, quita el servidor (`claude mcp remove dataverse` en Claude Code). 
px -y @microsoft/dataverse auth --help` muestra cómo borrar el perfil `curso`. El consentimiento del inquilino lo revoca su administrador en Microsoft Entra ID (**Enterprise applications**).

## Siguiente laboratorio recomendado

**Lab 142 — Un agente de Copilot Studio con herramientas MCP** (el mismo servidor desde un agente, si tu ambiente tiene créditos) o **Lab 143 — Un servidor MCP propio** (en tu equipo, sin tenant).
