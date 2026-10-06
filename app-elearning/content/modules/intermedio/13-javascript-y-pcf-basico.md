---
moduleId: 13
title: "JavaScript y PCF Básico"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 10
slug: "javascript-y-pcf-basico"
lastVerified: "2026-09"
---
### 🚧 Antes de comenzar: requiere JavaScript, TypeScript y React básicos

> Este módulo usa JavaScript puro (Web Resources de formulario) y un subconjunto pequeño de
> TypeScript + React (tu primer control PCF). Repasa
> [Fundamentos de JavaScript, TypeScript y React para PCF](/recursos/fundamentos-js-ts-react-para-pcf)
> antes de empezar — cubre exactamente lo que este módulo exige (sin necesitar `useState` ni
> genéricos propios) y, si nunca escribiste código, te dirige primero al Módulo 56 para las bases
> de JavaScript. El [Anexo de Lenguajes de Programación](/recursos/lenguajes-programacion) sigue
> disponible como referencia de sintaxis para quien ya programa.

> **Cómo está organizado este módulo (Piloto 3 — mismo patrón de los Módulos 11 y 10, aplicado a
> código de cliente en vez de un editor visual o de lógica):** vas a **decidir** el evento y la API
> correctos antes de escribir el handler, vas a **construir** una llamada a la Web API sin que te
> demos la secuencia exacta, vas a **diagnosticar** un síntoma de PCF con evidencia real antes de
> ver la causa, y vas a cerrar con un **reto de transferencia** que cambia el tipo de la propiedad
> que tu control recibe.
>
> Necesitas: una app Model-Driven con el formulario de Solicitud del Lab 04/05, y el Power Platform
> CLI (`pac`) instalado para la parte de PCF — ver
> [Guía de Herramientas de Workstation](/recursos/guia-herramientas-workstation) si todavía no lo
> tienes.

### 🎯 Objetivo
Implementar lógica de cliente con JavaScript en formularios Model-Driven y crear tu primer Power Apps Component Framework (PCF) control con TypeScript que extiende las capacidades nativas de Dataverse.

### 📖 Conceptos Clave
- **Web Resources JavaScript:** archivos JavaScript (.js) subidos a Dataverse como recursos web y registrados en eventos de formularios Model-Driven (OnLoad, OnSave, OnChange de campo). Se ejecutan en el navegador del cliente cuando el usuario interactúa con el formulario. Son el mecanismo principal para agregar comportamiento dinámico en formularios: mostrar/ocultar secciones, validaciones complejas, notificaciones, y llamadas a la Web API de Dataverse. Se nombran con ruta jerárquica: `sit_/js/NombreHandler.js`.

- **Xrm.Page (legacy) vs formContext:** `Xrm.Page` es la API antigua (deprecated desde 2019) para acceder al formulario desde JavaScript. `formContext` es la API moderna y obligatoria que se obtiene desde el parámetro `executionContext.getFormContext()`. Diferencias clave: formContext es el contexto del formulario específico (soporta múltiples formularios abiertos), Xrm.Page era global y causaba problemas en el unificado (UCI). Nunca usar `Xrm.Page` en código nuevo — Microsoft puede eliminarlo sin aviso.

- **Execution Context:** objeto que se pasa automáticamente a los event handlers de formulario cuando se marca "Pasar contexto de ejecución como primer parámetro" al registrar el handler. Provee acceso a `formContext` (el formulario), `getEventSource()` (el control que disparó el evento) y `getEventArgs()` (para eventos cancelables como OnSave). Sin este objeto no se puede acceder al formulario de forma moderna. La ausencia de este parámetro es la causa más común de `formContext is null`.

- **PCF (Power Apps Component Framework):** framework oficial de Microsoft para crear controles personalizados en formularios Model-Driven Apps y Canvas Apps usando TypeScript (y opcionalmente React). Un control PCF reemplaza o extiende la visualización de un campo (Field PCF) o una subgrid (Dataset PCF). Los controles se empaquetan como soluciones y se despliegan en Dataverse. La herramienta `pac` (Power Platform CLI) es el punto de entrada para inicializar, probar localmente (harness), y desplegar los controles.

- **IInputs / IOutputs:** interfaces TypeScript generadas automáticamente por el toolchain de PCF a partir del `ControlManifest.Input.xml`. `IInputs` define las propiedades que el formulario entrega al control (valores de campos, metadata). `IOutputs` define los valores que el control puede escribir de vuelta al formulario (para controles de campo editable). El método `updateView(context: Context<IInputs>)` recibe el contexto con los valores actuales. El método `getOutputs(): IOutputs` retorna los valores que el control quiere escribir.

- **ComponentFramework.WebApi:** API disponible dentro de un PCF para interactuar con Dataverse (leer, crear, actualizar, eliminar registros) sin depender de Xrm. Se accede via `context.webAPI` en el método `updateView` o `init`. Soporta `retrieveRecord`, `retrieveMultipleRecords`, `createRecord`, `updateRecord`, `deleteRecord`. Ejecuta llamadas asíncronas con promesas. El control no necesita gestionar autenticación — la hereda del contexto de la plataforma.

- **pac pcf init / pac pcf push:** comandos del Power Platform CLI para trabajar con PCF. `pac pcf init --namespace X --name Y --template field --framework react` crea la estructura del proyecto. `npm start` levanta el test harness local para probar el control en el navegador sin desplegarlo. `npm run build` compila TypeScript a JavaScript optimizado. `pac pcf push --publisher-prefix sit` empaqueta el control en una solución temporal y la importa directamente al entorno de desarrollo. Para producción, usar `pac solution build` + importar manualmente.

- **Virtual vs Standard PCF:** dos modos de renderizado para controles PCF. `Standard` renderiza su propio árbol DOM de forma independiente (control total sobre el HTML/CSS). `Virtual` (recomendado cuando se usa React) comparte el runtime de React que ya tiene la plataforma, reduciendo el tamaño del bundle. Con `--framework react` y `control-type="virtual"` en el manifest, el control retorna un `React.ReactElement` desde `updateView()` en lugar de manipular el DOM directamente. Elegir Virtual siempre que sea posible para mejor rendimiento.

- **Field vs Dataset PCF:** dos tipos de controles según lo que reemplazan. `Field` (template: field) reemplaza la visualización de una sola columna/campo en el formulario o vista. Recibe el valor del campo como input y puede modificarlo como output. `Dataset` (template: dataset) reemplaza una subgrid o galería, recibiendo colecciones de registros con sus columnas. Dataset PCF es más complejo pero permite crear visualizaciones completamente personalizadas de listas (ej. calendar view, kanban view, timeline).

- **Manifest.xml (`ControlManifest.Input.xml`):** archivo XML que es el "contrato" del control PCF — describe su identidad (namespace, name, versión), las propiedades de entrada/salida (`<property>`), los recursos incluidos (`<resources>`), y si usa servicios externos. La herramienta de build genera las interfaces TypeScript `IInputs`/`IOutputs` automáticamente a partir de este archivo. Cada `<property>` tiene un `of-type` (SingleLine.Text, OptionSet, Whole.Number, etc.) y un `usage` (bound para lectura/escritura, input para solo lectura).

## 🧩 Microlección 1 — JavaScript en formulario Model-Driven

**¿Qué vas a aprender?** Cómo registrar lógica de cliente en los eventos de un formulario
Model-Driven (OnLoad, OnChange, OnSave) usando `formContext`, y cuándo corresponde cada evento.

**¿Por qué existe esto?** Cada evento sirve para un momento distinto: OnLoad configura el estado
inicial del formulario, OnChange reacciona a lo que el usuario modifica en vivo, y OnSave es el
único punto donde puedes **bloquear** el guardado si algo no es válido. Elegir el evento
equivocado no produce un error visible — produce un formulario que "casi" funciona.

**Ahora haz algo — micropráctica (6 min):** antes de escribir el handler, resuelve esta decisión
con feedback inmediato → **[Elegir el evento y la API correctos](/practica/ip-js-001-evento-y-api-correctos)**.
Te da dos sub-escenarios del formulario de Solicitud (mostrar/ocultar una pestaña según el estado,
y bloquear el guardado si falta presupuesto) y te pide decidir el evento y el patrón de acceso al
formulario para cada uno.

**Práctica real en tu entorno (12 min):** crea el archivo `SolicitudFormHandler.js` con los tres
handlers (`onLoad`, `onSave`, `_configurarVisibilidad`):

```javascript
// Namespace pattern para evitar conflictos globales
var SolicitudFormHandler = SolicitudFormHandler || {};

// Valor NO universal: Dataverse lo asigna según el orden de creación de las opciones
// de sit_estado (Lab 02). Verifica el valor real en tu ambiente antes de usar este código.
SolicitudFormHandler.ESTADO_APROBADA = /* TU VALOR REAL AQUÍ */ 100000004;

// Handler: se llama al cargar el formulario
SolicitudFormHandler.onLoad = function(executionContext) {
    var formContext = executionContext.getFormContext();

    // Configurar visibilidad inicial
    SolicitudFormHandler._configurarVisibilidad(formContext);

    // Registrar handler en cambio de estado
    formContext.getAttribute("sit_estado").addOnChange(function(ctx) {
        SolicitudFormHandler._configurarVisibilidad(ctx.getFormContext());
    });
};

// Handler: validación antes de guardar
SolicitudFormHandler.onSave = function(executionContext) {
    var formContext = executionContext.getFormContext();
    var estado = formContext.getAttribute("sit_estado").getValue();
    var presupuesto = formContext.getAttribute("sit_costoestimado").getValue();

    if (estado === SolicitudFormHandler.ESTADO_APROBADA && (presupuesto === null || presupuesto <= 0)) {
        // Cancelar el guardado y mostrar error
        executionContext.getEventArgs().preventDefault();
        formContext.ui.setFormNotification(
            "Se requiere presupuesto mayor a 0 para aprobar la solicitud",
            "ERROR",
            "validacion_presupuesto"
        );
        return;
    }

    // Limpiar notificaciones si todo es válido
    formContext.ui.clearFormNotification("validacion_presupuesto");
};

// Función privada de visibilidad (convención: _ prefijo)
SolicitudFormHandler._configurarVisibilidad = function(formContext) {
    var estado = formContext.getAttribute("sit_estado").getValue();
    var esAprobado = estado === SolicitudFormHandler.ESTADO_APROBADA;

    // Mostrar sección de implementación solo si está aprobado
    // En el Lab 04 la pestaña se llama "Resolución"; asigna el nombre lógico tab_resolucion.
    formContext.ui.tabs.get("tab_resolucion").setVisible(esAprobado);

    // Campo responsable requerido si está aprobado
    formContext.getAttribute("sit_responsable").setRequiredLevel(
        esAprobado ? "required" : "none"
    );
};
```

Sube el archivo como Web Resource (`sit_/js/SolicitudFormHandler.js`, tipo Script JScript) y
regístralo en el formulario de Solicitud: OnLoad → función `SolicitudFormHandler.onLoad` (con
"Pasar contexto de ejecución" ✅); OnSave → función `SolicitudFormHandler.onSave`.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Valor real de `ESTADO_APROBADA` en tu ambiente (revisado en la opción de `sit_estado`) | ___ |
| ¿La pestaña de implementación se ocultó/mostró correctamente al cambiar el estado? | ___ |
| Mensaje de error exacto que viste al intentar guardar en Aprobada sin presupuesto | ___ |

---

## 🧩 Microlección 2 — Leer datos relacionados con la Web API (sin pasos)

**¿Qué vas a aprender?** Cómo llamar `Xrm.WebApi.retrieveMultipleRecords` desde JavaScript de
formulario para traer registros relacionados, sin bloquear la interfaz mientras se espera la
respuesta.

**¿Por qué existe esto?** Un formulario a menudo necesita mostrar contexto que no vive en sus
propios campos — por ejemplo, el historial reciente del cliente. La Web API es asíncrona
(devuelve una promesa): si no manejas el `.then()/.catch()` correctamente, el formulario puede
quedar esperando una respuesta que nunca procesa, o fallar en silencio.

**🏗️ Reto de construcción (sin pasos, tenant real):** construye una función
`cargarHistorialCliente` completa. No te damos la secuencia exacta de la consulta OData esta vez —
solo el requerimiento.

> **Requerimiento:** al cambiar el campo `sit_solicitante` del formulario, consulta las últimas 5
> solicitudes de ese mismo cliente (tabla `sit_solicitud`, filtrando por el cliente seleccionado,
> ordenadas por fecha de creación descendente) y muestra el nombre y estado de cada una en una
> notificación del formulario.
> **Criterios de aceptación:** (1) la consulta debe filtrar por el `id` del cliente seleccionado,
> no traer todas las solicitudes; (2) debe traer como máximo 5 registros, ordenados del más
> reciente al más antiguo; (3) si el campo `sit_solicitante` está vacío, la función no debe
> intentar ninguna consulta; (4) un error de la Web API debe quedar registrado (por ejemplo en
> consola), no silenciado.
> **Restricciones:** no uses `Xrm.Page` en ningún punto; el `id` del cliente llega con llaves
> `{}` que la consulta OData no acepta — tendrás que limpiarlo antes de usarlo en el filtro.

Si te atoras con la sintaxis de `$filter`/`$orderby`/`$top`, revisa el
[Anexo de Lenguajes de Programación](/recursos/lenguajes-programacion) antes de buscar la solución
completa.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre del evento donde registraste `cargarHistorialCliente` | ___ |
| Número de solicitudes que trajo la consulta para un cliente con más de 5 solicitudes | ___ |
| Texto exacto de la notificación que viste en el formulario | ___ |

---

## 🧩 Microlección 3 — Decidir el contrato del PCF y construirlo

**¿Qué vas a aprender?** Qué tipo de propiedad declarar en el manifest de un PCF (`of-type`,
`usage`) y cuándo corresponde un Field PCF frente a un Dataset PCF.

**¿Por qué existe esto?** El manifest es el contrato del control: define qué datos recibe
(`IInputs`) y qué puede escribir de vuelta (`IOutputs`). Elegir mal el tipo de la propiedad, o
elegir Field cuando el requerimiento es mostrar una colección completa, obliga a rehacer el
control desde el manifest hacia arriba.

**Ahora haz algo — micropráctica (6 min):** antes de crear el proyecto, resuelve esta decisión →
**[Decidir el contrato del control PCF](/practica/ip-js-002-contrato-del-control-pcf)**. Te da el
requerimiento de `StatusBadge` (mostrar un semáforo de color según el estado de una Solicitud) y un
segundo requerimiento (una vista tipo calendario de todas las solicitudes pendientes) y te pide
elegir el tipo de propiedad y el tipo de control correctos para cada uno.

**Práctica real en tu entorno (18 min):** crea el control `StatusBadge` completo.

1. Instalar herramientas y crear el proyecto:
   ```bash
   npm install -g @microsoft/powerplatform-cli
   pac --version

   mkdir StatusBadgePCF && cd StatusBadgePCF
   pac pcf init --namespace SITControls --name StatusBadge --template field --framework react
   npm install
   ```

2. Editar `StatusBadge/index.tsx`:
   ```typescript
   import * as React from 'react';
   import { IInputs, IOutputs } from "./generated/ManifestTypes";

   interface StatusBadgeProps {
       statusValue: number;
       statusLabel: string;
   }

   const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ statusValue, statusLabel }) => {
       const getColor = (value: number): string => {
           switch(value) {
               case 1: return "#107C10"; // Verde - Activo
               case 2: return "#D83B01"; // Rojo - Inactivo
               case 3: return "#FFB900"; // Amarillo - Pendiente
               default: return "#605E5C"; // Gris - Desconocido
           }
       };

       const styles: React.CSSProperties = {
           backgroundColor: getColor(statusValue),
           color: "white",
           padding: "4px 12px",
           borderRadius: "12px",
           fontSize: "12px",
           fontWeight: 600,
           display: "inline-block",
           fontFamily: "Segoe UI, sans-serif"
       };

       return <span style={styles}>{statusLabel || "Sin estado"}</span>;
   };

   export class StatusBadge implements ComponentFramework.ReactControl<IInputs, IOutputs> {
       private notifyOutputChanged: () => void;

       public init(
           context: ComponentFramework.Context<IInputs>,
           notifyOutputChanged: () => void
       ): void {
           this.notifyOutputChanged = notifyOutputChanged;
       }

       public updateView(
           context: ComponentFramework.Context<IInputs>
       ): React.ReactElement {
           const statusValue = context.parameters.statusValue.raw ?? 0;
           const statusLabel = context.parameters.statusValue.formatted ?? "";

           return React.createElement(StatusBadgeComponent, {
               statusValue: statusValue,
               statusLabel: statusLabel
           });
       }

       public getOutputs(): IOutputs {
           return {};
       }

       public destroy(): void { }
   }
   ```

3. Editar `ControlManifest.Input.xml`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <manifest>
     <control namespace="SITControls" constructor="StatusBadge"
              version="1.0.0" display-name-key="StatusBadge"
              description-key="Status Badge Control" control-type="virtual">
       <external-service-usage enabled="false" />
       <property name="statusValue" display-name-key="Status"
                 description-key="Status option set value"
                 of-type="OptionSet" usage="bound" required="true" />
       <resources>
         <code path="index.ts" order="1" />
       </resources>
     </control>
   </manifest>
   ```

4. Compilar y hacer push al entorno:
   ```bash
   npm run build
   pac auth create --url https://tuorg.crm.dynamics.com
   pac pcf push --publisher-prefix sit
   ```

5. Agregar el control al formulario: campo `sit_estado` → Componentes → Agregar componente →
   `StatusBadge` → configurar la propiedad `statusValue` enlazándola al campo `sit_estado`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Resultado de `pac pcf push` (éxito/error, y el mensaje si hubo error) | ___ |
| Color exacto que mostró el badge para el estado actual de tu Solicitud de prueba | ___ |
| ¿Tuviste que repetir el paso de enlazar la propiedad en el formulario? ¿Por qué? | ___ |

---

## 🔧 Diagnosticar — troubleshooting challenge

Antes de construir nada más, resuelve este caso con evidencia real, no con la tabla de errores:

**[Diagnosticar: el badge siempre muestra "Sin estado"](/practica/ip-js-003-diagnosticar-badge-sin-estado)**

Síntoma: el control compiló sin errores, `pac pcf push` terminó en éxito, y el badge aparece en el
formulario — pero siempre muestra "Sin estado" en gris, sin importar qué valor tenga el campo
`sit_estado` en ese registro. Formula tu hipótesis antes de ver la causa: ¿el problema está en el
componente React, en el manifest, o en otro lugar?

---

## 🔁 Reto de transferencia

`StatusBadge` hoy tiene una propiedad `statusValue` de tipo **OptionSet** — muestra un color fijo
por cada opción exacta (1, 2, 3). El requerimiento cambia: ahora debe mostrar el **porcentaje de
avance** de la Solicitud (`sit_porcentajeavance`, un número de 0 a 100), con el color determinado
por rangos (rojo si es menor a 30, amarillo si está entre 30 y 70, verde si es mayor a 70) en vez
de por un valor exacto.

Esto no es un cambio de valor — es un cambio de **tipo de contrato**. `Whole.Number` ya es uno de
los `of-type` que viste en el manifest de este módulo, y comparar un número contra rangos (`< 30`,
`>= 30 && <= 70`, `> 70`) ya lo hiciste con operadores de comparación en JavaScript — no es un
concepto nuevo, es aplicar en PCF algo que ya usaste en el handler de la Microlección 1.

**[Transferir: el control ahora recibe un número, no un OptionSet](/practica/ip-js-004-transferir-propiedad-numerica)**
— decide qué cambia en el manifest, en la lectura del valor (`.raw`/`.formatted`) y en la lógica de
color. Si solo memorizaste "el switch decide el color por cada opción" sin entender que la
*lógica de decisión* cambia junto con el tipo de dato, este reto te lo va a mostrar.

Si tienes tiempo, constrúyelo también en tu tenant real: cambia el `of-type` a `Whole.Number`,
ajusta `getColor` a comparación por rangos, y reporta qué color mostró para una Solicitud con 45%
de avance.

---

### 💼 Caso Real de Negocio
**Empresa:** Aseguradora con formularios complejos de siniestros  
**Problema:** Los ajustadores validaban datos manualmente y cometían errores al aprobar siniestros sin documentación completa.  
**Solución:** JS OnSave verifica que todos los documentos requeridos estén adjuntos antes de permitir cambio de estado. PCF StatusBadge muestra visualmente el estado del siniestro con colores semáforo. Reducción de errores de proceso en 60%.  
**Resultado:** Tiempo de auditoría de calidad reducido de 2 días a 4 horas por semana.

### ✅ Buenas Prácticas
- Siempre usar `executionContext.getFormContext()`, nunca `Xrm.Page` (deprecated)
- Namespace pattern en JS para evitar colisiones con otros scripts del formulario
- PCF Virtual (React) es preferible a Standard — comparte el runtime de React del sistema
- Compilar PCF en modo `Release` para producción: `npm run build -- --buildMode production`
- Manejar errores en `Xrm.WebApi` con `.then(success, error)` — nunca dejar promises sin manejar
- PCF con muchas dependencias npm impacta el tiempo de carga — evaluar el bundle size

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| `formContext is null` | Handler registrado sin pasar execution context | Marcar "Pasar contexto de ejecución como primer parámetro" en el formulario |
| PCF no aparece en lista de componentes | Publisher prefix no coincide con el del entorno | Usar `pac pcf push --publisher-prefix` con el prefix correcto del publisher |
| `pac pcf push` falla con 401 | No hay perfil de autenticación activo | Ejecutar `pac auth create --url https://tuorg.crm.dynamics.com` |
| JS funciona en DEV pero no en PROD | Script cacheado | Forzar versión en URL del Web Resource o usar `?v=2` |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de evento/API antes de escribir el handler de JavaScript
- [ ] JavaScript muestra/oculta la pestaña de implementación según estado, con el valor real de `ESTADO_APROBADA` documentado
- [ ] OnSave previene guardar y muestra notificación si falta presupuesto en estado Aprobado
- [ ] Construí `cargarHistorialCliente` sin ver los pasos completos de antemano, cumpliendo los 4 criterios de aceptación (filtro por id, top 5, guard de solicitante vacío, error no silenciado)
- [ ] Resolví la micropráctica de contrato del PCF (tipo de propiedad y Field vs Dataset) antes de crear el proyecto
- [ ] PCF StatusBadge compila sin errores con `npm run build` y queda desplegado y visible en el formulario
- [ ] Diagnostiqué el badge "Sin estado" formulando una hipótesis antes de ver la causa
- [ ] Completé el reto de transferencia (OptionSet → Whole.Number) explicando qué cambia en el manifest, en la lectura del valor y en la lógica de color, no solo en uno de los tres

---

## Notas de esta iteración piloto

Tercer piloto de la arquitectura Learning-by-Doing, después de Módulo 11 (Power Automate) y Módulo
10 (Canvas Apps). Reutiliza el mismo motor de prácticas interactivas, el mismo sistema de pistas
escalonadas y la función de mastery ya generalizada (`calculatePilotMastery`) — sin infraestructura
nueva salvo un dominio nuevo (`javascript`) en el catálogo de prácticas interactivas, necesario
porque ninguno de los dominios existentes (Dataverse, Power Apps, Power Automate, FetchXML, OData,
Troubleshooting) describe código de cliente JS/TS/PCF. Valida si el patrón funciona igual de bien
cuando la actividad principal es escribir y desplegar código (JavaScript de formulario + un control
PCF en TypeScript/React) en vez de configurar una interfaz visual o un flujo. Resuelve además la
inconsistencia curricular que bloqueaba este piloto: el prerrequisito de JavaScript ya no enlaza
directamente al Módulo 56 (Nivel IA, transversal, no alcanzable en la ruta de certificación pura)
sino al recurso puente `/recursos/fundamentos-js-ts-react-para-pcf`, que remite a él solo como
profundización opcional.
