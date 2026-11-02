---
moduleId: 27
title: "PCF Avanzado con TypeScript y React"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 18
practiceMinutes: 150
slug: "pcf-avanzado-con-typescript-y-react"
lastVerified: "2026-11"
---
*Lectura: 15-20 min · Con práctica: unos 150 min en tu entorno Developer; la primera vez, cuenta entre el doble y el triple (instalar herramientas y el primer `pac pcf push` son lo más lento).*

### 🚧 Antes de comenzar: requiere TypeScript sólido

> **Requiere conocimientos previos que PlanEstudio todavía no enseña desde cero:** TypeScript
> (tipos, interfaces, genéricos, clases, módulos ES6, async/await) y JSX/TSX básico. Lee primero
> [Fundamentos de TypeScript y React para PCF](/recursos/fundamentos-typescript-react) (30-40 min,
> incluye práctica local con Vite, sin tenant) — cierra la sintaxis básica de tipos, interfaces,
> componentes y `useState`. Ese puente no reemplaza un curso completo: si vienes solo del Módulo 13
> (JavaScript y PCF básico) sin experiencia previa en tipado estático, aun con el puente hecho
> considera estudiar este módulo en modo conceptual (arquitectura del control avanzado, patrones de
> React) antes de intentar construirlo — eso no valida que puedas desarrollarlo de forma independiente.

### 🎯 Objetivo
Desarrollar controles PCF avanzados: Dataset controls que reemplazan subgrids, controles con Web API para operaciones CRUD, uso de Fluent UI para consistencia visual, y publicación de PCF en soluciones managed.

> **Cómo está organizado este módulo (continúa el piloto del [Módulo 13](/nivel/intermedio/modulo/javascript-y-pcf-basico)):**
> en el Módulo 13 hiciste un control de **campo** (`StatusBadge`). Aquí haces un control de **dataset** que
> reemplaza un subgrid. Vas a **decidir** qué va en cada método del ciclo de vida antes de escribir código,
> vas a **construir** la grilla con pasos y después una acción de escritura **sin pasos**, vas a
> **diagnosticar** un síntoma real antes de ver la causa, y vas a cerrar con un **reto de transferencia**
> que lleva el mismo control a otro tipo de app.
>
> Necesitas: tu entorno Developer con la solución `SIT Solicitudes Internas` (Lab 02), la app Model-Driven
> del Lab 04 con el subgrid **Solicitudes de esta categoría** en el formulario de Categoría (Tarea 2.7), el
> Power Platform CLI (`pac`) con un perfil de autenticación (Módulo 13) y Node.js LTS. Herramientas:
> [Guía de Herramientas de Workstation](/recursos/guia-herramientas-workstation).

---

## 📖 Conceptos clave (referencia rápida)

- **Ciclo de vida de un control:** el host llama a cuatro métodos. `init` se ejecuta una vez al crear el control: guarda `notifyOutputChanged` y prepara lo que necesites, pero **los valores del dataset no se pueden leer aquí** (Learn lo indica expresamente). `updateView` se ejecuta cada vez que cambia algo del contexto: datos, página, tamaño del contenedor, modo de solo lectura. `getOutputs` lo llama el host para leer lo que el control quiere escribir de vuelta (solo tiene sentido con propiedades `bound`). `destroy` se ejecuta al quitar el control: libera timers, suscripciones o listeners. Cuando el usuario cambia un valor dentro del control, el control llama a `notifyOutputChanged()` y el host responde llamando a `getOutputs()`.
- **Standard vs React (virtual):** un control *standard* implementa `ComponentFramework.StandardControl`; su `init` recibe un `container` (un `div`) y dibuja el DOM él mismo. Un control *React* implementa `ComponentFramework.ReactControl`; su `init` no recibe `container` y su `updateView` **devuelve** un `React.ReactElement`. Se crea con `pac pcf init ... --framework react`, que deja `control-type="virtual"` en el manifest. Cambiar ese atributo a mano **no** convierte un control de un tipo al otro.
- **Platform libraries:** un control React no empaqueta React ni Fluent: usa los del host. El manifest lo declara dentro de `<resources>` con `<platform-library name="React" version="16.14.0" />` y `<platform-library name="Fluent" version="9.46.2" />`. Por eso el `bundle.js` es más pequeño. Datos de Learn: se declara React 16.14.0; en tiempo de ejecución el host carga 17.0.2 en Model-Driven y 16.14.0 en Canvas, así que tu código debe funcionar con React 16 (hooks sí; APIs de React 18 como `createRoot`, no). Fluent 8 o Fluent 9, **no los dos** en el mismo manifest. Los controles React y platform libraries funcionan en Canvas y Model-Driven, **no en Power Pages**.
- **Fluent UI:** Fluent 9 es `@fluentui/react-components` (Learn admite declarar de 9.4.0 a 9.46.2); Fluent 8 es `@fluentui/react`. Usar Fluent hace que el control se vea como el resto de la app y trae componentes accesibles (teclado, ARIA).
- **Dataset PCF:** recibe una colección de registros (`ComponentFramework.PropertyTypes.DataSet`) declarada con `<data-set>` en el manifest. Lo que más se usa: `loading`, `columns` (las columnas de la **vista** configurada en el subgrid, con `name`, `displayName`, `order` e `isPrimary`), `sortedRecordIds`, `records[id]` con `getFormattedValue(columna)`, `getValue(columna)`, `getRecordId()` y `getNamedReference()`, `paging` (`hasNextPage`, `loadNextPage()`, `setPageSize()`), `refresh()` (vuelve a pedir los datos y regresa a la página 1), `openDatasetItem(referencia)` (abre el registro como lo haría la grilla nativa) y `getTargetEntityType()` (nombre lógico de la tabla). Con `<property-set>` dentro del `<data-set>` puedes exigir al maker que asigne columnas concretas de un tipo.
- **`context.webAPI`:** `createRecord`, `retrieveRecord`, `retrieveMultipleRecords`, `updateRecord` y `deleteRecord`, autenticados con la sesión del usuario. Disponible en **Model-Driven y portales, no en Canvas**. Para usarlo, declara en el manifest `<feature-usage><uses-feature name="WebAPI" required="true" /></feature-usage>`. En el cuerpo de `updateRecord` una columna Choice se escribe como **número** (`{ sit_estado: 100000002 }`), igual que en la Web API de Dataverse; la forma `{ Value: ... }` es del SDK de .NET, no de la Web API.
- **`context.navigation`** (solo Model-Driven): `openForm(opciones)` (recibe `{ entityName, entityId }`, no una `EntityReference`), `openUrl`, `openAlertDialog`, `openConfirmDialog(textos)` (devuelve una promesa con `confirmed`), `openErrorDialog({ message })`, `openFile` y `openWebResource`. Para abrir un registro de un dataset es más simple `dataset.openDatasetItem(...)`.
- **`context.utils`** (solo Model-Driven): `getEntityMetadata`, `hasEntityPrivilege` y `lookupObjects` (abre el selector de registros nativo). Los diálogos **no** están aquí sino en `context.navigation`.
- **Hook propio para datos (patrón, no API):** encapsular las llamadas a `context.webAPI` en un hook de React (por ejemplo, uno tuyo llamado `useSolicitudes`) separa la lógica de datos de la UI y la hace más fácil de probar. El nombre y la forma del hook los decides tú; no es parte del framework.
- **Control Manifest (`ControlManifest.Input.xml`):** el contrato del control: namespace, constructor, `version`, `control-type`, propiedades (`<property>`), datasets (`<data-set>`, `<property-set>`), recursos (`<code>`, `<platform-library>`, CSS, resx) y `feature-usage`. A partir de él se generan `IInputs`/`IOutputs` en `generated/ManifestTypes.d.ts` al compilar.
- **Versión y despliegue:** para que Dataverse detecte una actualización hay que subir **como mínimo el PATCH** de `version` en el manifest (`pac pcf version --strategy manifest` lo sube en 1). Convención semántica: patch para correcciones (`1.0.1`), minor para funciones nuevas (`1.1.0`), major para cambios incompatibles (`2.0.0`). `pac pcf push --publisher-prefix sit --solution-unique-name <solución>` despliega el control en esa solución (sin `--solution-unique-name` lo pone en una solución temporal **PowerAppsTools_sit**). Ojo: `pac pcf push` compila en modo **desarrollo** salvo que el `.pcfproj` tenga `<PcfBuildMode>production</PcfBuildMode>`; un `npm run build -- --buildMode production` previo no cambia lo que sube `push`.
- **Test harness:** `npm start watch` abre el control en el navegador con datos de prueba (para un dataset, cargas un CSV en **Data Inputs** y pulsas **Apply**). En el harness `context.webAPI`, `navigation`, `utils` y el paging **no funcionan** (lanzan excepción): lo que dependa de ellos se prueba ya desplegado.

---

## 🧩 Microlección 1 — El contrato y el ciclo de vida de un Dataset PCF

**¿Qué vas a aprender?** Qué va en cada método del ciclo de vida y qué declara el manifest de un control React de tipo dataset, antes de escribir una línea de la grilla.

**¿Por qué existe esto?** El error más caro en un PCF no es de sintaxis: es poner la lógica en el método equivocado. Leer el dataset en `init` da una lista vacía; olvidar `notifyOutputChanged` deja al formulario sin el valor nuevo; no limpiar en `destroy` deja timers vivos al cambiar de registro. Y el manifest decide qué ve el maker al configurar el control.

**Ahora haz algo — micropráctica (6 min):** antes de crear el proyecto, resuelve esta decisión con feedback inmediato → **[¿Qué va en cada método del ciclo de vida?](/practica/ip-js-005-ciclo-de-vida-del-dataset-pcf)**.

**Práctica real en tu máquina (20 min):**

1. En una carpeta de trabajo nueva, crea el proyecto:

   ```bash
   mkdir SolicitudesGridPCF
   cd SolicitudesGridPCF
   pac pcf init --namespace SITControls --name SolicitudesGrid --template dataset --framework react --run-npm-install
   ```

   `--template dataset` crea un control de colección; `--framework react` lo crea como control React (virtual); `--run-npm-install` ejecuta `npm install` al terminar.

   **Qué deberías ver:** al final, la instalación de paquetes de npm sin errores (los avisos `npm warn` no impiden seguir). Si `pac` no se reconoce, revisa la instalación del Módulo 13.

2. Abre la carpeta en Visual Studio Code. Abre `SolicitudesGrid/ControlManifest.Input.xml` y localiza, **sin cambiar nada todavía**: el atributo `control-type` del elemento `<control>`, el elemento `<data-set>` y las líneas `<platform-library>` dentro de `<resources>`.

3. Cambia solo el nombre del dataset: en `<data-set name="...">` pon `name="solicitudes"` (y, si quieres, `display-name-key="Solicitudes"`). Deja el resto del elemento como lo generó la plantilla. Guarda.

   **No compiles todavía:** el `index.ts` de la plantilla sigue usando el nombre anterior del dataset y la compilación fallaría. En la Microlección 2 lo reemplazas y compilas.

4. Mira la lista de archivos de la carpeta `SolicitudesGrid/`: además de `index.ts` y el manifest, la plantilla React genera un componente de ejemplo (`.tsx`). Anota su nombre y el nombre que tenía el dataset antes de tu cambio.

5. Comprueba que el proyecto tiene Fluent 9: en `package.json` debe aparecer `@fluentui/react-components` y en el manifest la línea `<platform-library name="Fluent" ... />`. Si falta alguna, instala la versión que admite el host y añade la línea dentro de `<resources>`:

   ```bash
   npm install @fluentui/react-components@9.46.2
   ```

   ```xml
   <platform-library name="Fluent" version="9.46.2" />
   ```

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Valor de `control-type` en el manifest generado | ___ |
| Las líneas `<platform-library>` tal como aparecen (nombre y versión) | ___ |
| Nombre del componente `.tsx` de ejemplo que generó la plantilla | ___ |
| Nombre original del `<data-set>` antes de cambiarlo a `solicitudes` | ___ |

---

## 🧩 Microlección 2 — Construir la grilla y ponerla en el subgrid

**¿Qué vas a aprender?** A leer columnas y registros del dataset, abrir un registro con `openDatasetItem` y paginar; a desplegar el control en tu solución y a configurarlo en el subgrid del Lab 04.

**¿Por qué existe esto?** El control tiene que respetar lo que el maker ya configuró: si la grilla lee las columnas de la **vista** del subgrid (y no una lista escrita en el código), el maker puede añadir o quitar columnas sin pedirte un cambio. Y abrir el registro con `openDatasetItem` mantiene el comportamiento de la grilla nativa.

**Práctica real en tu entorno (40 min):**

1. Crea `SolicitudesGrid/SolicitudesTabla.tsx` con este componente (Fluent UI 9, que la plantilla ya declaró como platform library):

   ```typescript
   import * as React from "react";
   import {
       Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell,
       Link, Spinner, Button, Text
   } from "@fluentui/react-components";

   export interface ISolicitudesTablaProps {
       dataset: ComponentFramework.PropertyTypes.DataSet;
   }

   export const SolicitudesTabla: React.FC<ISolicitudesTablaProps> = ({ dataset }) => {
       // Mientras el host carga la página de registros, records todavía no es fiable
       if (dataset.loading) {
           return <Spinner label="Cargando solicitudes..." />;
       }
       // Las columnas vienen de la vista configurada en el subgrid, no del código
       const columnas = dataset.columns.slice().sort((a, b) => a.order - b.order);

       if (dataset.sortedRecordIds.length === 0) {
           return <Text>No hay solicitudes en esta vista.</Text>;
       }

       return (
           <div>
               <Table aria-label="Solicitudes" size="small">
                   <TableHeader>
                       <TableRow>
                           {columnas.map((c) => (
                               <TableHeaderCell key={c.name}>{c.displayName}</TableHeaderCell>
                           ))}
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {dataset.sortedRecordIds.map((id) => {
                           const registro = dataset.records[id];
                           return (
                               <TableRow key={id}>
                                   {columnas.map((c) => (
                                       <TableCell key={c.name}>
                                           {c.isPrimary ? (
                                               // openDatasetItem abre el registro como lo haría la grilla nativa
                                               <Link onClick={() => dataset.openDatasetItem(registro.getNamedReference())}>
                                                   {registro.getFormattedValue(c.name)}
                                               </Link>
                                           ) : (
                                               registro.getFormattedValue(c.name)
                                           )}
                                       </TableCell>
                                   ))}
                               </TableRow>
                           );
                       })}
                   </TableBody>
               </Table>
               {dataset.paging.hasNextPage && (
                   <Button onClick={() => dataset.paging.loadNextPage()}>Cargar más</Button>
               )}
           </div>
       );
   };
   ```

2. Reemplaza el contenido de `SolicitudesGrid/index.ts`. Fíjate en que `index.ts` no usa JSX: crea el elemento con `React.createElement`, igual que la plantilla.

   ```typescript
   import { IInputs, IOutputs } from "./generated/ManifestTypes";
   import { SolicitudesTabla, ISolicitudesTablaProps } from "./SolicitudesTabla";
   import * as React from "react";

   export class SolicitudesGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
       private notifyOutputChanged!: () => void;

       // init: una sola vez. Aquí NO se leen datos del dataset (todavía no llegaron)
       public init(
           context: ComponentFramework.Context<IInputs>,
           notifyOutputChanged: () => void,
           state: ComponentFramework.Dictionary
       ): void {
           this.notifyOutputChanged = notifyOutputChanged;
       }

       // updateView: cada vez que cambia algo del contexto (datos, página, tamaño...)
       public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
           const props: ISolicitudesTablaProps = { dataset: context.parameters.solicitudes };
           return React.createElement(SolicitudesTabla, props);
       }

       // Este control no escribe valores de vuelta al formulario
       public getOutputs(): IOutputs {
           return {};
       }

       public destroy(): void {
           // Nada que liberar: no hay timers ni suscripciones propias
       }
   }
   ```

   Puedes borrar el componente `.tsx` de ejemplo que anotaste en la Microlección 1 (ya no se importa).

3. Compila con `npm run build`. **Qué deberías ver:** la compilación termina sin errores y `SolicitudesGrid/generated/ManifestTypes.d.ts` tiene en `IInputs` una propiedad `solicitudes` de tipo `ComponentFramework.PropertyTypes.DataSet`. Si TypeScript marca `context.parameters.solicitudes` como inexistente, el nombre del `<data-set>` del manifest no es `solicitudes`.

4. *(Opcional, 10 min)* Prueba local con `npm start watch`: en **Data Inputs** carga un CSV pequeño con dos o tres columnas (por ejemplo, exportado desde la vista de solicitudes) y pulsa **Apply**. Verás la tabla con esos datos. El enlace del título no abre nada aquí: `openDatasetItem` necesita el host real.

5. Para que `pac pcf push` suba una compilación de producción, abre `SolicitudesGridPCF.pcfproj` y, dentro del `<PropertyGroup>` que contiene `<OutputPath>`, añade `<PcfBuildMode>production</PcfBuildMode>`. Guarda.

6. Despliega el control en tu solución (usa el perfil de autenticación del Módulo 13; `pac auth list` muestra cuál está activo):

   ```bash
   pac pcf push --publisher-prefix sit --solution-unique-name SIT_SolicitudesInternas
   ```

   **Qué deberías ver:** el comando termina indicando que importó la solución. En <https://make.powerapps.com> > **Solutions** > `SIT Solicitudes Internas`, debe aparecer un componente de control personalizado `sit_SITControls.SolicitudesGrid` (o similar: anota el nombre exacto). Si el nombre único de tu solución no es `SIT_SolicitudesInternas`, míralo en la lista de soluciones (columna **Name**) y úsalo.

7. Configura el control en el subgrid del Lab 04 (Learn documenta esta configuración para subgrids en el editor clásico):
   - Solución > **Tables** > **Categoría** > **Forms** > abre el formulario **Information** (Main).
   - En la barra de comandos del diseñador, selecciona **...** > **Switch to classic**. Se abre el editor clásico en otra pestaña.
   - Selecciona el subgrid **Solicitudes de esta categoría** y pulsa **Change Properties** en la cinta.
   - Pestaña **Controls** > **Add Control** > elige **SolicitudesGrid** > **Add**.
   - En la fila del control nuevo marca **Web**. Pulsa **OK**.
   - **Save** y después **Publish**.

8. En la app del Lab 04, área **Administración** > **Categorías** > abre **Hardware** y recarga el navegador.

**Qué deberías ver:** en lugar de la grilla nativa, tu tabla con las columnas de la vista `Solicitudes Abiertas del Equipo`, con el título como enlace. Al pulsar un título se abre esa solicitud. Si sigues viendo la grilla nativa, revisa que marcaste **Web** en la fila del control y que publicaste.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Cómo quedó la propiedad del dataset en `IInputs` (cópiala de `ManifestTypes.d.ts`) | ___ |
| Nombre exacto del componente de control en la solución | ___ |
| Encabezados de columna que mostró tu tabla, en orden (salen de la vista, no del código) | ___ |
| Número de filas que viste en la categoría Hardware | ___ |
| Qué se abrió al pulsar el título de una solicitud | ___ |
| *(Opcional)* Columnas del CSV que cargaste en el harness | ___ |

---

## 🧩 Microlección 3 — Escribir con la Web API desde el control (sin pasos)

**¿Qué vas a aprender?** A añadir una acción de escritura al control: confirmar con un diálogo nativo, actualizar el registro con `context.webAPI` y mantener la grilla sincronizada.

**¿Por qué existe esto?** El caso de negocio de este módulo es justo eso: acciones sobre cada fila sin abrir el registro. Una escritura bien hecha confirma antes, informa el error con el estilo de la plataforma (no con `alert`) y deja la lista en el estado real.

**🏗️ Reto de construcción (sin pasos, tenant real):** no te damos el código esta vez, solo el requerimiento.

> **Requerimiento:** cada fila de la tabla debe tener un botón **Resolver** que cambie el Estado de la solicitud (`sit_estado`) a **Resuelta**.
> **Criterios de aceptación:** (1) antes de escribir, el usuario confirma en un diálogo nativo de la plataforma; si cancela, no se escribe nada; (2) la escritura usa `context.webAPI.updateRecord` sobre la tabla del dataset y el id de la fila; (3) después de escribir, la grilla muestra el estado real **sin recargar la página**; (4) si la escritura falla, el usuario ve un diálogo de error nativo con el mensaje, y el botón no queda bloqueado; (5) el botón se desactiva mientras la escritura está en curso.
> **Restricciones:** no escribas el nombre de la tabla en el código (el dataset lo sabe); no uses `alert`/`confirm` del navegador; el valor numérico de **Resuelta** no es universal: búscalo en tu ambiente (columna **Estado** de **Solicitud TI** > opciones) y guárdalo en una constante.

Si te atascas, en orden:
1. El componente necesita más que el dataset: pásale también `context.webAPI` y `context.navigation` desde `updateView` como props.
2. El manifest tiene que declarar que el control usa la Web API (`feature-usage`). La tabla sale de `dataset.getTargetEntityType()`; el diálogo de confirmación es `navigation.openConfirmDialog({ title, text })` y su resultado trae `confirmed`; el de error, `navigation.openErrorDialog({ message })`.
3. El cuerpo de `updateRecord` lleva la Choice como número: `{ sit_estado: TU_VALOR }`. Después de que la promesa se resuelva, pide los datos de nuevo con el método del dataset que vuelve a consultar. Recuerda subir la `version` del manifest antes del siguiente `pac pcf push`.

**Qué deberías ver:** al resolver una solicitud de Hardware, la fila **desaparece** de la tabla, porque la vista `Solicitudes Abiertas del Equipo` excluye las resueltas. Si la abres desde **Operación** > solicitudes, su Estado es **Resuelta**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor numérico de **Resuelta** en tu ambiente | ___ |
| Línea `<uses-feature ...>` que añadiste al manifest | ___ |
| Versión del manifest antes y después de este cambio | ___ |
| Qué pasó con la fila en la tabla después de resolver (y por qué) | ___ |
| Texto del diálogo de error que viste al provocar un fallo (por ejemplo, con un valor de Choice inexistente) | ___ |

---

## 🔧 Diagnosticar — troubleshooting challenge

Antes de mirar la tabla de errores, resuelve este caso con evidencia:

**[Diagnosticar: la grilla no refleja el cambio](/practica/ip-js-006-diagnosticar-grilla-no-se-actualiza)**

Síntoma: un compañero hizo su propio botón **Resolver**. Al pulsarlo no hay ningún error, el diálogo de confirmación funciona y, si abres la solicitud, su Estado ya es **Resuelta**. Pero en la tabla la fila sigue ahí, con el estado anterior, hasta que alguien recarga la página. Formula tu hipótesis antes de ver la causa: ¿el problema está en la escritura, en la vista, o en el control?

---

## 🔁 Reto de transferencia

Tu `SolicitudesGrid` funciona en una app Model-Driven. El requisito **cambia**: el equipo de soporte en campo usa una **Canvas App** y quiere la misma tabla con el mismo botón **Resolver**. Lo que hiciste se apoya en tres piezas (`context.webAPI`, `context.navigation` y `openDatasetItem`), y no todas existen en Canvas.

**[Transferir: la grilla ahora va en una Canvas App](/practica/ip-js-007-transferir-grilla-a-canvas-app)** — decide qué piezas siguen sirviendo, cuáles hay que cambiar y quién hace la escritura en Canvas. Si solo memorizaste "el botón llama a `updateRecord`" sin mirar dónde está disponible cada API, este reto te lo va a mostrar.

Si tienes tiempo, prueba la parte de solo lectura en tu tenant: activa **Power Apps component framework for canvas apps** en el entorno (Power Platform admin center > **Environments** > tu entorno > **Settings** > **Product** > **Features**; requiere administrador), crea una Canvas App en la solución, en el panel izquierdo **+** > **Get more components** > pestaña **Code** > importa `SolicitudesGrid`, y añádelo desde **Code components** con la tabla Solicitudes TI como datos.

| Campo | Tu valor |
|---|---|
| Qué pieza del control falla o no aparece en Canvas (y el mensaje, si lo hubo) | ___ |
| Cómo resolverías la escritura en Canvas (quién llama a Dataverse) | ___ |
| Qué cambiarías en el manifest para que el control avise a la app | ___ |

---

### 💼 Caso Real de Negocio
**Empresa:** Firma de abogados con gestión de expedientes en Dataverse  
**Problema:** La subgrid nativa de documentos del expediente no permitía preview, tags ni acciones masivas. Cada acción requería abrir el registro individualmente.  
**Solución:** PCF Dataset Control con preview inline de PDFs, tags coloridos por categoría, y botón de "Firmar documento" que llama a Azure Functions. Fluent UI para que se vea nativo de D365.  
**Resultado:** Tiempo de revisión de expediente: de 8 minutos a 2 minutos. Satisfacción de abogados: 4.7/5.

### ✅ Buenas Prácticas
- Preferir controles React (virtual) con platform libraries para controles nuevos de Model-Driven y Canvas: bundle más pequeño y la misma versión de React y Fluent que el host. No sirven para Power Pages
- Leer los datos del dataset en `updateView`, nunca en `init`; usar `init` solo para guardar referencias y preparar
- Leer las columnas de `dataset.columns` (la vista del maker) en lugar de escribirlas en el código; si el control **exige** columnas concretas, declararlas con `<property-set>`
- `dataset.refresh()` después de cualquier escritura exitosa — mantiene la lista sincronizada con Dataverse
- Limitar llamadas a `webAPI` — no hacer CRUD en cada render, solo en acciones del usuario
- Declarar en `feature-usage` cada servicio que usa el control (por ejemplo `WebAPI`) y comprobar en qué hosts existe cada API antes de prometer el control para Canvas o Power Pages
- Usar los diálogos de `context.navigation` (`openConfirmDialog`, `openErrorDialog`) en vez de `alert`/`confirm` del navegador
- Versionar el PCF semánticamente y subir al menos el PATCH antes de cada push (`pac pcf version --strategy manifest`)
- Fijar `<PcfBuildMode>production</PcfBuildMode>` en el `.pcfproj` para no desplegar compilaciones de desarrollo
- Probar el PCF en el test harness local (`npm start watch`) antes de hacer `pac pcf push` — el ciclo de feedback local es de segundos frente a minutos en Dataverse; lo que depende de Web API, navegación o paging se prueba ya desplegado
- Mantener el PCF enfocado en una responsabilidad: un control que muestra datos, no uno que también gestiona configuraciones — el Single Responsibility Principle aplica a controles PCF

### ⚠️ Errores Comunes
| Síntoma | Causa | Solución |
|-------|-------|----------|
| Tras `pac pcf push` los usuarios siguen viendo el comportamiento anterior | La `version` del manifest no subió: el host no detecta el cambio y sirve la versión en caché | Subir al menos el PATCH (`pac pcf version --strategy manifest`), volver a hacer push y recargar con Ctrl+Shift+R |
| La grilla sale vacía o lanza "Cannot read properties of undefined" al iterar | Se leen `dataset.records` en `init` o antes de que termine la carga | Leer en `updateView` y comprobar `dataset.loading` antes de iterar `sortedRecordIds` |
| `updateRecord` funciona pero la fila no cambia hasta recargar | Falta `dataset.refresh()` después de la escritura | Llamar a `context.parameters.<dataset>.refresh()` cuando la promesa de `updateRecord` se resuelve |
| `context.webAPI` es `undefined` o lanza error | Falta `<uses-feature name="WebAPI" required="true" />`, se está probando en el test harness, o el control está en una Canvas App (la Web API del PCF es de Model-Driven y portales) | Declarar el feature, probar desplegado en Model-Driven y, en Canvas, dejar la escritura a la app (salida + `notifyOutputChanged`) |
| `updateRecord` devuelve error al escribir una Choice | Se envió `{ sit_estado: { Value: n } }` (forma del SDK de .NET) o un valor que no existe en tu ambiente | Enviar el número: `{ sit_estado: n }`, con el valor real de la opción |
| `context.utils.openConfirmDialog is not a function` | Los diálogos están en `context.navigation`, no en `context.utils` | Usar `context.navigation.openConfirmDialog` / `openErrorDialog` |
| El control no aparece en **Add Control** del subgrid | Se desplegó en otra solución o con un publisher de otro prefijo, o no se publicó | Desplegar con `--publisher-prefix sit --solution-unique-name <tu solución>` y publicar; si vino de otro ambiente, agregarlo a la solución: **Add existing** > componente de control personalizado |
| El componente pesa demasiado o tarda en cargar | Se desplegó una compilación de desarrollo (por defecto en `pac pcf push`) | `<PcfBuildMode>production</PcfBuildMode>` en el `.pcfproj` |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica del ciclo de vida antes de crear el proyecto y anoté el `control-type` y las `platform-library` que generó `pac pcf init`
- [ ] PCF Dataset Control renderiza la lista de solicitudes con datos reales de Dataverse, con las columnas de la vista del subgrid
- [ ] Clic en el título abre el registro de la solicitud
- [ ] Construí sin pasos el botón "Resolver": confirma con un diálogo nativo, actualiza el estado en Dataverse y refresca la lista sin recargar la página
- [ ] Control usa Fluent UI y se ve coherente con el resto de la app
- [ ] Diagnostiqué la grilla que no refleja el cambio formulando una hipótesis antes de ver la causa
- [ ] Completé el reto de transferencia a Canvas App explicando qué APIs no existen allí y quién hace la escritura
- [ ] PCF desplegado en mi solución con `pac pcf push --solution-unique-name`, con compilación de producción y la versión del manifest incrementada
- [ ] *(Opcional, conecta con los Módulos 16 y 19)* PCF publicado en solución managed e importado en TEST sin errores

---
