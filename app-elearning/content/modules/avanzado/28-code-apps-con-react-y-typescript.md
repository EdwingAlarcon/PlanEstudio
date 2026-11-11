---
moduleId: 28
title: "Code Apps con React y TypeScript"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 18
practiceMinutes: 210
slug: "code-apps-con-react-y-typescript"
lastVerified: "2026-11"
---
*Lectura: 15-20 min · Con práctica: unos 210 min (3 h 30) en tu ambiente del curso, mejor en dos sesiones (1: Microlecciones 1 y 2; 2: el reto y el cierre); la primera vez, cuenta hasta una vez y media más. Habilitar code apps en el entorno requiere un administrador del entorno o de Power Platform.*

### 🚧 Antes de comenzar: es el módulo con más exigencia de código de la ruta Developer

> **Requiere conocimientos previos que PlanEstudio todavía no enseña desde cero:** TypeScript,
> React (componentes, props, estado, hooks) y el flujo de un proyecto Vite. Lee primero
> [Fundamentos de TypeScript y React para PCF](/recursos/fundamentos-typescript-react) (30-40 min,
> incluye práctica local con Vite, sin tenant) — este módulo asume ese nivel de entrada y no lo
> reintroduce. Si el puente todavía te resulta difícil, estudia este módulo en modo conceptual
> (arquitectura de Code Apps, SDK, ALM) antes de intentar construir la app vos mismo.

### 🎯 Objetivo
Construir aplicaciones web completas (React + TypeScript + Vite) que corren dentro de Power Platform, con acceso nativo y tipado a conectores y Dataverse, control total del UI, y despliegue como soluciones administradas mediante el pipeline de ALM.

> **Cómo está organizado este módulo (continúa el piloto del [Módulo 13](/nivel/intermedio/modulo/javascript-y-pcf-basico) y el [Módulo 27](/nivel/avanzado/modulo/pcf-avanzado-con-typescript-y-react)):**
> en el Módulo 27 extendiste una pantalla con un control; aquí construyes la **app completa** en código.
> Vas a **decidir** cuándo una Code App es la herramienta correcta, vas a **construir** la conexión a Dataverse
> con pasos y el CRUD **sin pasos**, vas a **diagnosticar** un síntoma real antes de ver la causa, y vas a
> cerrar con un **reto de transferencia** que lleva la app a TEST y PROD con un conector distinto.
>
> Necesitas: tu ambiente del curso con la tabla **Solicitud TI** (`sit_solicitud`) del Lab 02 y la solución
> `SIT Solicitudes Internas`; Node.js (versión LTS), Git y Visual Studio Code. Como en el Módulo 14, para abrir la app
> necesitas licencia Premium o la licencia Power Apps trial (la misma con la que creaste tu Trial; dura 30 días
> y se puede extender hasta 90, ver [Entornos y trials](/recursos/entornos-y-trials)), y en un entorno real la necesita cada usuario (ver Conceptos clave).

---

## 📖 Conceptos clave (referencia rápida)

- **Code Apps vs Canvas Apps vs PCF:** tres paradigmas de desarrollo en Power Platform con distintos trade-offs. Code Apps son aplicaciones web completas (single-page applications) construidas con un framework como React o Vue en un IDE — control total del UI y acceso al ecosistema npm, pero requieren habilidades de desarrollo web. Canvas Apps son aplicaciones low-code con Power Fx — accesibles para desarrolladores ciudadanos y con app móvil, pero limitadas en patrones de UI complejos. PCF son componentes individuales embebidos en formularios Model-Driven o en Canvas Apps — no son apps completas, sino controles que aumentan las capacidades de una pantalla existente.
- **Estado actual:** la página de Learn de Code Apps (ms.date 2026-09-23) ya **no** la presenta como preview: documenta requisitos, licencias y la tabla de capacidades de plataforma gestionada como una función disponible.
- **Requisitos:** un IDE (por ejemplo Visual Studio Code), Node.js **LTS**, npm, Git y el **Power Apps CLI**. Un administrador habilita la función por entorno: Power Platform admin center > **Manage** > **Environments** > el entorno > **Settings** > **Product** > **Features** > **Power Apps code apps** > interruptor **Enable code apps** > **Save**. Para *ejecutar* la app, cada usuario necesita una de estas opciones: licencia Power Apps Premium, pago por uso (pay-as-you-go), App Pass, o auto-claim habilitado.
- **Power Apps CLI (`pa`) y client library:** se instalan con npm: `@microsoft/power-apps-cli` instala el comando `pa`, y `@microsoft/power-apps` es la *Power Apps client library for code apps* (a veces llamada "Power Apps SDK"), que tu app usa en tiempo de ejecución y que gestiona los modelos y servicios generados. Comandos que usa este módulo: `pa app init` (inicializa la app y crea `power.config.json`), `pa app run` (host local; abre la URL **Local Play**), `pa app add data-source` (conecta una tabla o un conector y genera código tipado), `pa app refresh data-source`, `pa app push` (publica una versión nueva), `pa auth login` / `pa auth status`, `pa solution list` y `pa connection list-references`. Versiones anteriores de la documentación usaban `pac code ...` del Power Platform CLI; la documentación vigente usa solo `pa`.
- **`power.config.json`:** metadatos de la app (entorno, data sources, conexiones) que usan el CLI y la client library para conectar y publicar. Tu código no necesita leerlo ni editarlo a mano.
- **Data sources tipados:** `pa app add data-source --connector dataverse --table <nombre-lógico>` conecta una tabla de Dataverse (si no pasas `--org-url`, te pide la URL de la organización). El CLI genera en `src/generated/` un **modelo** (`<Nombre>Model.ts`, la interfaz con las columnas) y un **servicio** (`<Nombre>Service.ts`). El nombre lo genera el CLI a partir del nombre de la tabla en la Web API (para la tabla `account` son `AccountsModel.ts` y `AccountsService.ts`): para la tuya, míralo en la carpeta. Métodos del servicio de Dataverse: `create(registro)`, `get(id)`, `getAll(opciones)`, `update(id, cambios)` y `delete(id)`.
- **El resultado viene en `.data`, y el error en `.error`:** los métodos devuelven un objeto resultado (`IOperationResult`, con `success`, `data` y `error`), no los registros directamente: `const result = await AccountsService.getAll(); const filas = result.data`. **Ojo:** si Dataverse responde con un error, la client library (comprobado en el código de `@microsoft/power-apps` 1.5.0) **no lanza una excepción**: devuelve `success: false` y el detalle en `result.error`, así que un `try/catch` solo no lo captura. Comprueba siempre `result.success` antes de usar `result.data`. Los ejemplos de Learn solo usan `try/catch`; este comportamiento está en el código de la librería, no en Learn. `getAll` acepta `{ select, filter, orderBy, top, skip, maxPageSize, skipToken }`; Learn pide limitar **siempre** las columnas con `select`. En `update`, envía **solo** las columnas que cambian: enviar el registro completo provoca "actualizaciones falsas" que disparan lógica de negocio y ensucian la auditoría.
- **Carpeta `src/generated/`:** la sobrescribe el CLI con cada `pa app add data-source` o `pa app refresh data-source` — cualquier modificación manual se perderá. Si se necesita lógica adicional, crear módulos propios que importen desde `src/generated/` sin modificarlos.
- **Dataverse en Code Apps — soportado:** CRUD, etiquetas formateadas de opciones (Choice), metadatos de tabla, lookups (con `@odata.bind`), delegación de `Filter`, `Sort` y `Top`, y paginación. **Todavía no soportado:** lookups polimórficos, FetchXML, claves alternativas y CRUD de definiciones de tabla.
- **Connection References:** componente de solución que apunta a una conexión de un conector (Office 365 Users, SharePoint, SQL...) sin atarla a un usuario o entorno. En una Code App se usa al agregar el data source: `pa app add data-source --connector <id> --connection-ref <nombre-lógico> --solution-id <id-solución>`. Así la solución es portable entre DEV, TEST y PROD. **Dataverse nativo no usa** connection ID, connection reference ni dataset: la app accede a la tabla del entorno donde se ejecuta.
- **ALM:** `pa app push` puede poner la app en una solución. Sin `--solution-id`, en la **primera** publicación usa la solución preferida del entorno (o la Common Data Service Default Solution si no hay una fijada); en publicaciones siguientes no cambia la solución. Con `--solution-id <GUID>` (o la variable `PA_CLI_SOLUTION_ID` en CI/CD) la agrega a esa solución; el CLI no acepta nombres, solo el GUID. Una app ya publicada se agrega desde **Solutions** > la solución > **Add existing** > **App** > **Code app**. Para mover entre etapas se usan Power Platform Pipelines.
- **Managed Platform benefits (beneficios de la plataforma gestionada):** al desplegar una Code App dentro de Power Platform, hereda la gobernanza de la plataforma sin código adicional. Learn lista: diálogo de consentimiento de conectores, límites de uso compartido (los de Canvas Apps), App Quarantine, aplicación de las políticas de datos (DLP) al iniciar la app, Conditional Access por app, supresión del consentimiento por el admin, aislamiento de tenant, acceso de invitados con Azure B2B y métricas de estado (health metrics). La autenticación con Microsoft Entra ID la gestiona el host: tu código no maneja tokens.
- **DLP y Dataverse:** las políticas de datos clasifican conectores en Business, Non-Business y Blocked, pero **Dataverse no se puede bloquear** (es uno de los conectores no bloqueables). Por eso, para probar el efecto de una política en una app, se usa un conector bloqueable, no Dataverse.
- **Limitaciones actuales de Code Apps (según Learn):** no funcionan en **Power Apps for Windows** (el cliente de escritorio; sí en navegadores modernos); no soportan la integración con **SharePoint forms**; no soportan **Power Platform Git integration** (source code integration); no soportan todavía la función `PowerBIIntegration` para consumir datos de Power BI — **importante, no es la limitación inversa**: una Code App **sí puede embeberse** en un reporte de Power BI con el control **Power Apps Visual**; no soportan todavía **Secure Implicit Connections**; y no usan la restricción por IP de Storage SAS (para limitar por ubicación, Conditional Access). Los conectores **Excel Online (Business)** y **Excel Online (OneDrive)** todavía no están soportados.

---

## 🧩 Microlección 1 — Decidir la herramienta y crear la primera Code App

**¿Qué vas a aprender?** Cuándo una Code App es la elección correcta frente a una Canvas App o un PCF, y a crear, inicializar y ejecutar en local tu primera Code App.

**¿Por qué existe esto?** Una Code App da libertad total, pero cuesta más mantenerla y exige desarrolladores. Elegirla para un formulario que una Canvas App resuelve en una tarde es tan caro como intentar un tablero Kanban con drag-and-drop en Power Fx.

**Ahora haz algo — micropráctica (6 min):** antes de crear el proyecto, resuelve esta decisión → **[¿Code App, Canvas App o PCF?](/practica/ip-js-008-code-app-canvas-o-pcf)**.

**Práctica real en tu entorno (45 min, con las instalaciones y el inicio de sesión):**

1. **Habilitar code apps** (si no eres administrador, pídeselo a quien lo sea): en <https://admin.powerplatform.microsoft.com> > **Manage** > **Environments** > tu ambiente del curso > **Settings** > despliega **Product** > **Features** > busca **Power Apps code apps** y activa **Enable code apps** > **Save**.

2. Comprueba las herramientas en una terminal:

    ```bash
    node -v          # debe ser una versión LTS
    git --version
    ```

3. Crea el proyecto con la plantilla oficial de Vite e instala el CLI y las dependencias:

    ```bash
    npx degit github:microsoft/PowerAppsCodeApps/templates/vite solicitudes-code-app
    cd solicitudes-code-app

    npm install --global @microsoft/power-apps-cli
    npm install --global @microsoft/power-apps
    npm install
    pa --version
    ```

    Las dos instalaciones globales son las que pide el quickstart de Learn; la app, al compilar y ejecutarse, usa la copia de `@microsoft/power-apps` que la plantilla ya trae en su `package.json` (la instala `npm install`).

    **Qué deberías ver:** `pa --version` muestra una versión. Si la terminal no reconoce `pa`, ciérrala y abre una nueva (el instalador global modifica el PATH).

4. Revisa la estructura: `src/App.tsx` (componente raíz), `src/main.tsx` (punto de entrada), `index.html`, `vite.config.ts`, `tsconfig.json` y `package.json`. La carpeta `src/generated/` aparece cuando agregues el primer data source.

5. Copia el **ID de tu entorno**: en <https://make.powerapps.com>, con tu entorno seleccionado, la URL tiene la forma `.../environments/<environment-id>/...`. Inicializa la app:

    ```bash
    pa app init --display-name "SIT Solicitudes Code App" --environment-id <environment-id>
    ```

    Si no hay una sesión activa, el CLI te pide iniciar sesión con tu cuenta de Power Platform. Al terminar, en la raíz del proyecto debe existir `power.config.json`.

6. Ejecuta en local:

    ```bash
    pa app run
    ```

    Abre la URL etiquetada **Local Play** en el **mismo perfil de navegador** que usas para tu tenant.

**Qué deberías ver:** la app de la plantilla abierta en el navegador. Si no carga y el navegador pide permiso de **acceso a la red local** (local network access), concédelo: Chrome y Microsoft Edge bloquean por defecto las peticiones de orígenes públicos a `localhost`, y en desarrollo la app se conecta a tu máquina.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Salida de `pa --version` | ___ |
| Cuenta activa según `pa auth status` | ___ |
| Primeras claves (nombres de propiedad) que ves en `power.config.json` | ___ |
| URL (host y puerto) que mostró **Local Play** | ___ |
| ¿Tuviste que conceder acceso a la red local? ¿En qué navegador? | ___ |

---

## 🧩 Microlección 2 — Conectar Dataverse y leer con el servicio generado

**¿Qué vas a aprender?** A conectar la tabla **Solicitud TI** como data source, leer el código que genera el CLI y listar registros con `getAll` usando `select`, `orderBy` y `top`.

**¿Por qué existe esto?** Los servicios generados ya resuelven autenticación, formato OData y tipado: no escribes `fetch` contra la Web API. Pero el contrato es suyo (nombres, forma del resultado) y hay que leerlo antes de usarlo.

**Práctica real en tu entorno (40 min):**

1. Desde la raíz del proyecto, agrega la tabla (la URL de tu organización la ves en Power Apps > **Settings** (engranaje) > **Session details** > **Instance url**):

    ```bash
    pa app add data-source --connector dataverse --table sit_solicitud --org-url https://<tu-org>.crm.dynamics.com
    ```

    **Qué deberías ver:** el comando termina sin error y aparece la carpeta `src/generated/` con `models/` y `services/`. Si dice que no encuentra la tabla, revisa el nombre lógico (`sit_solicitud`, del Lab 02) y que estás en el entorno correcto (`pa auth status`).

2. Abre los dos archivos generados y anota su nombre exacto. En el **Model**, localiza: la clave primaria (`sit_solicitudid`), la columna principal (el nombre interno que anotaste en el Lab 02; los labs usan como ejemplo `sit_titulo`), `sit_estado`, y cómo aparece la etiqueta formateada de una Choice. En el **Service**, localiza la firma de `getAll`.

3. Crea `src/ListaSolicitudes.tsx`. Los nombres `Sit_solicitudsService`, `Sit_solicitudsModel` y `Sit_solicituds` son **un ejemplo**: cámbialos por los que generó tu CLI, y `sit_titulo` por tu columna principal.

    ```typescript
    import * as React from "react";
    // Ejemplo: usa los nombres reales de los archivos que generó el CLI en src/generated/
    import { Sit_solicitudsService } from "./generated/services/Sit_solicitudsService";
    import type { Sit_solicituds } from "./generated/models/Sit_solicitudsModel";

    export function ListaSolicitudes() {
      const [solicitudes, setSolicitudes] = React.useState<Sit_solicituds[]>([]);
      const [error, setError] = React.useState<string | null>(null);

      React.useEffect(() => {
        const cargar = async () => {
          try {
            const result = await Sit_solicitudsService.getAll({
              select: ["sit_solicitudid", "sit_titulo", "sit_estado"], // limitar columnas siempre
              orderBy: ["createdon desc"],
              top: 20,
            });
            // Un error de Dataverse NO llega como excepción: viene en el resultado, con success = false
            if (!result.success) {
              console.error("No se pudieron leer las solicitudes:", result.error);
              setError(result.error?.message ?? "No se pudieron leer las solicitudes.");
              return;
            }
            setSolicitudes(result.data ?? []); // los registros vienen en .data, no en result
          } catch (err) {
            // Red de seguridad para un fallo inesperado que sí se lance como excepción
            console.error("Error inesperado al leer las solicitudes:", err);
            setError("No se pudieron leer las solicitudes.");
          }
        };
        void cargar();
      }, []);

      if (error) return <p role="alert">{error}</p>;

      return (
        <ul>
          {solicitudes.map((s) => (
            <li key={s.sit_solicitudid}>{s.sit_titulo}</li> // ejemplo: tu columna principal
          ))}
        </ul>
      );
    }
    ```

4. En `src/App.tsx`, importa `ListaSolicitudes` y muéstralo dentro del componente que devuelve la app (puedes dejar o quitar el contenido de la plantilla). Guarda y vuelve a la pestaña de **Local Play** (con `pa app run` en marcha).

**Qué deberías ver:** las 20 solicitudes más recientes por su título. Si TypeScript marca error en `s.sit_titulo`, tu columna principal tiene otro nombre: búscalo en el Model. Si ves un mensaje de error, es el texto de `result.error`: léelo (suele nombrar la columna o el permiso que falla). Si la lista sale vacía sin error, abre la consola del navegador (Ctrl+Shift+I) y revisa la sección de diagnóstico de abajo.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombres exactos de los dos archivos generados | ___ |
| Nombre de la propiedad del Model con la etiqueta formateada de `sit_estado` | ___ |
| Firma de `getAll` tal como aparece en el Service (cópiala) | ___ |
| Número de solicitudes que mostró la lista | ___ |
| Título de la primera solicitud de la lista | ___ |

---

## 🧩 Microlección 3 — CRUD y publicación en una solución (sin pasos)

**¿Qué vas a aprender?** A crear y actualizar registros con el servicio generado sin una guía paso a paso, y a publicar la app dentro de tu solución.

**¿Por qué existe esto?** El caso de negocio de este módulo es justo una app con edición directa sobre Dataverse que llega a producción como solución. La lectura ya la tienes; ahora la escritura, con las dos reglas de Learn que más se olvidan: no enviar columnas del sistema al crear y no enviar columnas sin cambios al actualizar.

**🏗️ Reto de construcción (sin pasos, tenant real):**

> **Requerimiento:** la app debe permitir (a) crear una solicitud nueva con título y prioridad, y (b) cambiar el Estado de una solicitud de la lista a **En Proceso**.
> **Criterios de aceptación:** (1) crear y actualizar usan los métodos del servicio generado, no `fetch` ni `axios`; (2) al crear, el registro **no** incluye la clave primaria ni columnas de propietario; (3) al actualizar, el objeto de cambios lleva **solo** `sit_estado`; (4) tras crear o actualizar, la lista muestra el dato nuevo sin recargar la página; (5) un error de Dataverse se muestra en la UI y se registra en consola, no se pierde: tu código comprueba `result.success` en cada llamada y muestra `result.error`, porque la librería no lanza excepción; (6) la app queda publicada **dentro** de la solución `SIT Solicitudes Internas`.
> **Restricciones:** no edites nada en `src/generated/`; los valores numéricos de Prioridad y Estado no son universales: tómalos de tu ambiente (o del Model generado, si los trae) y guárdalos en constantes. El Model tipa cada Choice con sus valores exactos, así que declara cada valor como `const ESTADO_EN_PROCESO = 100000001;` o, si los agrupas en un objeto, con `as const` (`const ESTADOS = { EnProceso: 100000001 } as const;`): sin `as const`, TypeScript lo trata como `number` y marca el error TS2322 al pasarlo a `create` o `update`.

Si te atascas, en orden:
1. Los métodos son `create(registro)` y `update(id, cambios)`; el id de la fila es `sit_solicitudid`. Mueve la carga de la lista a una función que puedas volver a llamar, por ejemplo `const cargar = React.useCallback(async () => { /* getAll, comprobar result.success, setSolicitudes */ }, []);` con `React.useEffect(() => { void cargar(); }, [cargar]);`, y llama a `await cargar()` después de crear o actualizar. Revisa `result.success` y `result.error` también en `create` y `update`: la librería no lanza excepción cuando Dataverse rechaza la operación.
2. El tipo de `create` en el Service te dice qué acepta; Learn construye el objeto solo con las columnas a rellenar (en su ejemplo, `Omit<Accounts, 'accountid'>`). En `update` pasa un objeto nuevo con una sola propiedad, no el registro que leíste.
3. Publicar: `npm run build`, después `pa solution list` para ver el **Id** (GUID) de `SIT Solicitudes Internas`, y `pa app push --solution-id <GUID>`. El CLI no acepta el nombre de la solución.

*(Opcional)* Sustituye la lista por un `DataGrid` de Fluent UI 9 (`npm install @fluentui/react-components`) con una columna de acciones.

**Qué deberías ver:** al terminar `pa app push`, el CLI devuelve una URL de Power Apps donde se ejecuta la app. En <https://make.powerapps.com> > **Solutions** > `SIT Solicitudes Internas`, la app aparece como objeto de la solución. Si publicaste antes sin `--solution-id`, agrégala desde la solución con **Add existing** > **App** > **Code app**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Objeto exacto que pasaste a `create` (claves) | ___ |
| Objeto exacto que pasaste a `update` | ___ |
| GUID de la solución que usaste en `--solution-id` | ___ |
| Mensaje del CLI al terminar `pa app push` (la parte que indica la solución) | ___ |
| Mensaje de error que mostró tu UI al provocar un fallo (por ejemplo, un valor de Choice inexistente) y valor de `result.success` en ese caso | ___ |

---

## 🔧 Diagnosticar — troubleshooting challenge

Antes de mirar la tabla de errores, resuelve este caso con evidencia:

**[Diagnosticar: la lista no muestra nada](/practica/ip-js-009-diagnosticar-lista-vacia-en-code-app)**

Síntoma: un compañero escribió su lista con una sola línea, `Sit_solicitudsService.getAll().then(setSolicitudes)`. La app compila (desactivó el chequeo estricto de TypeScript "para avanzar"), `pa app run` abre la app y en la pestaña de red del navegador la petición a Dataverse responde con datos. Pero la pantalla se queda en blanco y la consola muestra `solicitudes.map is not a function`. Formula tu hipótesis antes de ver la causa: ¿es un problema de permisos, de la conexión, o del código?

---

## 🔁 Reto de transferencia

Tu app lee y escribe Dataverse en tu ambiente del curso. El requisito **cambia**: la app tiene que mostrar, junto a cada solicitud, el nombre y el cargo del solicitante usando el conector **Office 365 Users**, y tiene que llegar a TEST y PROD con Power Platform Pipelines, sin editar nada a mano en cada entorno y con la publicación automatizada en CI/CD.

**[Transferir: la Code App ahora va a TEST y PROD con otro conector](/practica/ip-js-010-transferir-code-app-a-test-y-prod)** — decide cómo se conecta Office 365 Users, qué pasa con Dataverse, y cómo apunta a la solución el pipeline. Si solo memorizaste "agrego el data source y hago push", este reto te lo va a mostrar.

Si tienes tiempo, prueba la mitad del diseño en tu entorno: crea en `SIT Solicitudes Internas` una **connection reference** para Office 365 Users (**New** > **More** > **Connection reference**), comprueba que el CLI la ve con `pa connection list-references --solution-id <GUID>` y agrégala con `pa app add data-source --connector shared_office365users --connection-ref <nombre-lógico> --solution-id <GUID>`.

| Campo | Tu valor |
|---|---|
| Nombre lógico de la connection reference (de `pa connection list-references`) | ___ |
| Archivos nuevos que aparecieron en `src/generated/` | ___ |
| ¿Por qué Dataverse no necesita connection reference y Office 365 Users sí? | ___ |
| Cómo pasarías la solución al CLI en el pipeline (sin escribir el GUID en el código) | ___ |

---

### 💼 Caso Real de Negocio

**Empresa**: Firma de consultoría con 200 consultores distribuidos

**Problema**: El portal de gestión de proyectos en Canvas App no soporta los patrones de UI requeridos — tablero Kanban con drag-and-drop, gráficos de utilización interactivos y tabla de timesheet con edición masiva inline. Construir cada uno como PCF Component separado tomaría 3 meses; una Code App resuelve todo en 3 semanas.

**Solución implementada**:

- Code App React conectada a Dataverse (tablas: `sit_proyecto`, `sit_consultor`, `sit_timesheet`)
- Kanban de proyectos con `react-beautiful-dnd` — drag-and-drop actualiza el estado en Dataverse
- Gráficos de utilización con `recharts` conectados a datos reales en tiempo real
- Tabla de timesheet con edición inline masiva usando Fluent UI DataGrid
- Autenticación Entra ID gestionada por la plataforma — cero código de auth
- Desplegada como solución Managed en producción con pipeline CI/CD Azure DevOps

**Resultado**:

- 40% menos tiempo de desarrollo vs PCF Components individuales
- Control total de layout y CSS — imposible con Canvas Apps
- Acceso al ecosistema npm completo (D3, recharts, react-table, etc.)
- Misma gobernanza que Canvas Apps: DLP, Conditional Access, auditoría

### ✅ Buenas Prácticas
- Nunca editar archivos en `src/generated/` — son regenerados con cada `pa app add data-source` o `pa app refresh data-source` y los cambios se perderían
- Leer siempre el resultado en `.data` y, antes, comprobar `result.success`: si es `false`, mostrar `result.error` en la UI y registrarlo en consola (un `try/catch` solo no captura los errores de Dataverse)
- Limitar columnas con `select` en cada `getAll` y usar `filter`/`orderBy`/`top` en lugar de traer todo y filtrar en el navegador
- En `update`, enviar solo las columnas que cambian (evita actualizaciones falsas que disparan lógica y ensucian la auditoría)
- Usar Fluent UI React Components (`@fluentui/react-components`) para mantener coherencia visual con el ecosistema Microsoft 365
- Separar la lógica de negocio en servicios propios que importan desde `src/generated/` — no poner lógica directamente en componentes React
- Agregar data sources siempre con `pa app add data-source` en lugar de llamadas directas a la WebAPI — los servicios generados ya gestionan auth y tipado
- Para conectores distintos de Dataverse en apps que van a otros entornos, agregar el data source con `--connection-ref` (connection reference de la solución), no con un connection ID personal
- Configurar una solución preferida en el entorno (o pasar `--solution-id` explícito en `pa app push`, o `PA_CLI_SOLUTION_ID` en CI/CD) desde el primer día — facilita el ALM y evita migraciones manuales posteriores
- Probar localmente con `pa app run` antes de cada `npm run build` + `pa app push` para reducir el ciclo de feedback

### ⚠️ Errores Comunes
| Síntoma | Causa | Solución |
|-------|-------|----------|
| Cambios en `src/generated/` desaparecen | El CLI regenera la carpeta en cada `pa app add data-source` / `pa app refresh data-source` | Crear módulos propios que importen desde `src/generated/` sin modificarlos |
| `solicitudes.map is not a function` o lista vacía aunque la petición devuelve datos | Se guardó el objeto resultado en vez de `result.data` | `const result = await Servicio.getAll(...); setX(result.data ?? [])` |
| La lista sale vacía o un `create` no hace nada, sin mensaje, y el `catch` nunca se ejecuta | La librería devuelve el error de Dataverse en el resultado (`success: false` y `error`) en lugar de lanzarlo, y el código solo tenía `try/catch` | Comprobar `if (!result.success)` tras cada llamada y mostrar `result.error?.message`; revisar en la pestaña de red la respuesta de la petición |
| `getById is not a function` | El método del servicio de Dataverse es `get(id)` | Usar `get(id)`; revisar las firmas en el Service generado |
| Una actualización dispara flujos o plugins que no deberían correr | Se envió a `update` el registro completo leído antes | Enviar solo las columnas cambiadas |
| La app no abre en Power Apps for Windows | Code Apps no son compatibles con el cliente de escritorio | Usar un navegador moderno; para escenarios móviles u offline, evaluar una Canvas App con los mismos datos de Dataverse |
| `pa app push` falla o la app no se puede publicar | Code apps no habilitadas en el entorno | Power Platform admin center > **Environments** > el entorno > **Settings** > **Product** > **Features** > **Enable code apps** |
| `pa app push --solution-id` se detiene diciendo que el ID no es válido | Se pasó el nombre de la solución en vez del GUID | Copiar el **Id** de `pa solution list` o de la URL de la solución |
| La app quedó en la solución Default y no en la del proyecto | Primera publicación sin `--solution-id` y sin solución preferida | Fijar solución preferida o pasar `--solution-id`; para una app ya publicada: **Add existing** > **App** > **Code app** |
| Local Play no carga y el navegador bloquea la petición a `localhost` | Restricción de acceso a la red local de Chrome/Edge | Conceder el permiso en el navegador (o configurar la directiva empresarial) |
| Usar `fetch`/`axios` para llamar a la Web API de Dataverse | Se salta los servicios generados | Usar los servicios generados por el CLI — ya gestionan autenticación y tipado |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de Code App vs Canvas App vs PCF antes de crear el proyecto
- [ ] Code App creada con template oficial, se inicializa con `pa app init` y ejecuta en local con `pa app run` sin errores, con la evidencia de `power.config.json` y Local Play
- [ ] Al menos una tabla Dataverse conectada via `pa app add data-source` con servicios generados tipados, y anoté los nombres reales de los archivos generados
- [ ] Construí sin pasos la creación y el cambio de estado con los servicios de `src/generated/`, enviando en `update` solo la columna cambiada y mostrando en la UI el `result.error` de una llamada fallida
- [ ] *(Opcional)* UI construida con Fluent UI React — al menos DataGrid y formulario de creación funcionales
- [ ] App publicada con `pa app push --solution-id` dentro de la solución y visible en make.powerapps.com
- [ ] Diagnostiqué la lista vacía formulando una hipótesis antes de ver la causa
- [ ] Completé el reto de transferencia explicando cuándo hace falta connection reference, por qué Dataverse no la necesita y cómo apunta el pipeline a la solución
- [ ] Puedes explicar con ejemplos concretos cuándo elegir Code App vs Canvas App vs PCF Component
- [ ] *(Opcional, conecta con los Módulos 16 y 19)* Solución exportada como Managed e importada en entorno TEST, con la app funcionando contra los datos de TEST

---
