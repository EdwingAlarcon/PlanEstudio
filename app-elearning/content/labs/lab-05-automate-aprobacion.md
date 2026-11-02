---
id: lab-05
title: "Power Automate — Notificación y Aprobación de Solicitudes"
level: "N1"
duration: 130
product: ["Power Automate Cloud", "Dataverse", "Outlook", "Teams"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites:
  - "Lab 02 completado — tabla sit_Solicitud con datos"
  - "Lab 03 completado — Canvas App publicada (opcional pero recomendado)"
  - "Lab 04 completado (recomendado) — Model-Driven App para crear y editar solicitudes en las pruebas"
  - "Buzón de Outlook activo en el tenant"
files: []
lastVerified: "2026-11"
---

# Lab 05 — Power Automate: Notificación y Aprobación de Solicitudes (SIT)

## Objetivo

Al finalizar este laboratorio podrás crear tres flujos de nube: uno automatizado que notifica por email al crear solicitudes, uno programado que envía un resumen diario al responsable, y uno de aprobación para cambios de prioridad crítica, integrando Dataverse, Outlook y Teams.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación de Labs 02 y 03

**Problema a resolver:** Las solicitudes se crean en la app pero nadie se entera hasta que alguien recuerda revisar. Las solicitudes críticas llegan a la cola general sin escalamiento. No existe ningún reporte periódico del estado del backlog.

**Por qué Power Automate:** Los disparadores nativos de Dataverse permiten reaccionar a cambios de datos en tiempo real sin polling ni código. La acción de aprobación integrada elimina la necesidad de un sistema externo de workflow.

## Relación con el Módulo 5

Este lab usa las técnicas del Módulo 5 (trigger de Dataverse, condiciones, contenido dinámico, expresiones con **fx**, List rows y Run history) sobre **las tablas del Lab 02**, y añade dos piezas nuevas: la acción **Create HTML table** y una **aprobación** que modifica la solicitud según la respuesta.

- **Son flujos nuevos**, dentro de la solución `SIT Solicitudes Internas` del Lab 02. Los flujos del Módulo 5 (en la solución del Módulo 2) se quedan como están. Si los tienes encendidos y usan la otra tabla `Solicitud TI (M2)`, no se dispararán con las solicitudes de este lab.
- **Los nombres internos son los del Lab 02** (`sit_prioridad`, `sit_estado`, `sit_fechasolicitud`, `sit_asignado`…), que fijaste a mano. La única excepción es la columna principal **Título de Solicitud**, cuyo nombre interno no eliges tú: el Lab 02 te pidió anotarlo. Aquí casi siempre la insertas como **contenido dinámico** por su nombre visible, sin escribir su nombre interno.

## Lo que vas a construir

- **Flujo 1 — Notificación automática:** al crear una solicitud, envía email de confirmación y alerta en Teams si es Crítica
- **Flujo 2 — Reporte diario:** cada mañana envía por email la lista de solicitudes pendientes con tabla HTML, y no envía nada si no hay
- **Flujo 3 — Aprobación de prioridad:** proceso de aprobación cuando se cambia una solicitud a Crítica, con actualización de Dataverse según resultado

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Preparación — valores de Estado y nombre de la columna principal | 10 min |
| Ejercicio 1 — Flujo de notificación automática | 35 min |
| Ejercicio 2 — Reporte diario programado | 40 min |
| Ejercicio 3 — Flujo de aprobación de prioridad crítica | 45 min |
| **Total** | **130 min** |

> La primera vez que configuras conexiones y aprobaciones, cuenta con más tiempo. Puedes partir el lab en dos sesiones: Ejercicios 1-2 y Ejercicio 3.

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power Automate Cloud Flows (Automated y Scheduled)
- Conector Microsoft Dataverse (When a row is added, modified or deleted / List rows / Update a row)
- Conector Office 365 Outlook (Send an email (V2))
- Conector Microsoft Teams (Post message in a chat or channel)
- Conector Approvals (Start and wait for an approval)
- Data Operations (Create HTML table)

## Prerrequisitos

### Entorno

- [ ] Ambiente Developer con la solución `SIT Solicitudes Internas` y la tabla `Solicitud TI` del Lab 02 con sus 10 registros
- [ ] Cuenta Microsoft 365 con buzón de Outlook activo
- [ ] *(Opcional)* Acceso a un equipo de Teams con un canal estándar (no privado). Si no tienes Teams, el lab te da una alternativa por email
- [ ] Rol **System Administrator** en el ambiente: la primera aprobación de un ambiente prepara las tablas de aprobaciones, y Learn pide que quien la ejecute tenga un rol de administrador del ambiente
- [ ] La app del Lab 04 (o el editor de filas de la tabla) para crear y editar solicitudes de prueba

### Conocimiento previo

- Módulo 5 estudiado: triggers, acciones, condiciones, contenido dinámico y expresiones con **fx**
- Comprender qué es un trigger vs una acción en un flujo

> **Nombres de los botones:** los pasos usan la interfaz en inglés y el diseñador nuevo de Power Automate, igual que el Módulo 5. Si un botón cambió de nombre, busca el más parecido en la misma zona de la pantalla.

---

## Datos de apoyo

### Cómo se usa el diseñador (el mismo del Módulo 5)

- **Agregar una acción:** debajo de la última tarjeta, **+** → **Add an action**, busca la acción y elígela debajo del conector correcto. Su configuración se abre a la izquierda, en la pestaña **Parameters**; los campos opcionales están en **Advanced parameters** (o **Show all**).
- **Contenido dinámico:** haz clic dentro del campo y luego en el **rayo azul** (o escribe `/`). Busca el dato por su nombre visible, por ejemplo **Título de Solicitud**, y haz clic en él: queda como una "pastilla" de color.
- **Expresión:** haz clic dentro del campo → botón **fx** → pega la expresión en el cuadro de arriba → **Add**. Una expresión pegada como texto normal no se calcula: se envía tal cual.
- **Guardar y probar:** dentro de una solución, la barra muestra **Save draft** y **Publish**. Un borrador no se puede probar: antes de cada prueba, **Publish** y luego **Test** → **Manually** → **Test** ([Learn: borradores y versiones](https://learn.microsoft.com/power-automate/drafts-versioning)).
- **No le cambies el nombre a las acciones:** las expresiones de este lab llaman a las acciones por su nombre (`List_rows`, por ejemplo).

### Emails para las pruebas

| Rol | Email |
|---|---|
| Solicitante de prueba | Tu propio email del tenant |
| Responsable de TI | Tu propio email (así ves todos los mensajes) |
| Aprobador | Tu propio email |

### Las etiquetas de una columna Choice

El valor de una columna Choice que llega a un flujo es el **número** de la opción (como `723500003`), no el texto. Para mostrar o comparar el texto ("Crítica") se usa la versión "formateada" que Dataverse devuelve junto al valor ([Learn: valores con formato](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/select-columns)):

```
triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']
```

En un loop o en una tabla de **List rows**, la misma idea se escribe con `item()?['sit_prioridad@OData.Community.Display.V1.FormattedValue']`.

> En una versión anterior de este lab aparecía `_sit_prioridad_label`. Ese nombre no existe en las salidas de Dataverse: usa siempre `@OData.Community.Display.V1.FormattedValue`.

---

## Preparación — Valores de Estado y nombre de la columna principal

> **Qué vas a hacer:** Anotar los dos números de Estado que usa el filtro del Flujo 2 y confirmar el nombre interno de la columna principal.
> **Duración:** 10 min

1. En [make.powerapps.com](https://make.powerapps.com) → **Solutions** → `SIT Solicitudes Internas` → **Tables** → **Solicitud TI** → **Columns** → abre la columna **Estado**.

2. En el panel de la columna, en la lista de opciones, verás cada opción con su **Label** (el texto) y su **Value** (el número que generó Dataverse a partir de tu Publisher; Learn recomienda no cambiarlo) ([Learn: Create a choice column](https://learn.microsoft.com/power-apps/maker/data-platform/custom-picklists#configure-properties-for-a-local-choice)). Anota:

   | Estado | Value en tu ambiente |
   |---|---|
   | Nueva | ___ |
   | En Proceso | ___ |
   | Resuelta | ___ |
   | Cerrada | ___ |
   | Aprobada | ___ |
   | Rechazada | ___ |

   **Si no ves los números**, no pasa nada: en la Tarea 2.2 los lees de la primera ejecución del flujo, como en el Módulo 5.

3. Cierra el panel sin guardar cambios.

4. Busca el nombre interno de la columna principal **Título de Solicitud** que anotaste en el Lab 02 (Tarea 2.2, paso 7). En este lab se escribe como `sit_titulo` **a modo de ejemplo**: donde lo veas en una expresión, pon el tuyo, en minúsculas. Solo lo necesitas en la Tarea 2.3.

---

## Ejercicio 1 — Flujo de notificación automática

> **Qué vas a hacer:** Crear un flujo que se dispara cuando se crea una solicitud en Dataverse, envía un email de confirmación y, si es Crítica, una alerta en Teams.
> **Duración:** 35 min

### Tarea 1.1 — Crear el flujo dentro de la solución

1. En [make.powerautomate.com](https://make.powerautomate.com), comprueba arriba a la derecha que estás en tu ambiente Developer.

2. En el menú lateral elige **Solutions** y abre `SIT Solicitudes Internas`.

3. **New** → **Automation** → **Cloud flow** → **Automated** ([Learn: crear un flujo en una solución](https://learn.microsoft.com/power-automate/create-flow-solution)).

4. **Flow name:** `SIT — Notificar Nueva Solicitud`. En el buscador de triggers escribe `When a row is added`, elige **When a row is added, modified or deleted** (Microsoft Dataverse) y selecciona **Create**.

   **Qué deberías ver:** el diseñador con una sola tarjeta, la del trigger. Si es la primera vez que usas Dataverse en un flujo, quizá te pida iniciar sesión para crear la conexión: usa tu cuenta de trabajo.

### Tarea 1.2 — Configurar el disparador

1. Haz clic en la tarjeta del trigger y, en **Parameters**, completa ([Learn: el trigger de Dataverse](https://learn.microsoft.com/power-automate/dataverse/create-update-delete-trigger)):

   | Campo | Valor |
   |---|---|
   | Change type | Added |
   | Table name | Solicitudes TI (la del Lab 02, no la que lleva "(M2)") |
   | Scope | Organization |

   > **Scope Organization** significa que el flujo se dispara cuando cualquier persona del ambiente crea una solicitud, no solo tú.

### Tarea 1.3 — Enviar email de confirmación

1. **+** → **Add an action** → busca `Send an email (V2)` y elige la de **Office 365 Outlook**.

2. Completa:

   | Campo | Valor |
   |---|---|
   | To | Tu propio email |
   | Subject | Escribe `Solicitud registrada: ` (con un espacio al final) e inserta con el rayo azul **Título de Solicitud** (sección del trigger) |
   | Body | El texto de abajo |

3. **Body:** escríbelo como texto normal. Donde dice *(…)*, inserta el dato indicado:

   ```
   Tu solicitud se registró en el sistema de soporte SIT.
   Título: (Título de Solicitud, rayo azul)
   Prioridad: (expresión de Prioridad, con fx)
   Estado: (expresión de Estado, con fx)
   Fecha: (Fecha Solicitud, rayo azul)
   El equipo de soporte revisará tu solicitud y te contactará pronto.
   ```

   - Prioridad: `triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']`
   - Estado: `triggerOutputs()?['body/sit_estado@OData.Community.Display.V1.FormattedValue']`

   > **¿Y el correo del solicitante de verdad?** **Solicitante** es un Lookup a **Contact**: el trigger solo trae el identificador del contacto, no su correo. En producción añadirías antes un **Get a row by ID** sobre **Contacts**, como en el Paso 2 de la Práctica 5.1 del Módulo 5, y usarías su **Email** en **To**. Las solicitudes del Lab 02 no tienen Solicitante, por eso aquí el correo te llega a ti.

### Tarea 1.4 — Condición y alerta en Teams para solicitudes Críticas

1. **+** → **Add an action** → busca **Condition** (en *Control*).

2. En el primer cuadro inserta con **fx** la etiqueta de Prioridad: `triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']`. Operador: **is equal to**. En el segundo cuadro escribe `Crítica` (con tilde, igual que la opción).

   > No uses el dato **Prioridad** del rayo azul: es el número de la opción y nunca será igual al texto `Crítica`.

3. En la rama **True**:
   1. **+** → **Add an action** → busca `Post message in a chat or channel` y elige la de **Microsoft Teams** (Learn también la llama *Post a message in a chat or channel*) ([Learn: enviar un mensaje en Teams](https://learn.microsoft.com/power-automate/teams/send-a-message-in-teams)).
   2. **Post as:** Flow bot · **Post in:** Channel · **Team:** tu equipo · **Channel:** un canal estándar (Learn indica que no se puede publicar en canales privados).
   3. **Message:** escribe `SOLICITUD CRÍTICA REGISTRADA: ` e inserta con el rayo azul **Título de Solicitud**; en otra línea, `Descripción: ` + **Descripción**; en otra, `Requiere atención inmediata.`
   4. **Si no tienes un equipo de Teams:** usa **Post in:** Chat with Flow bot y en **Recipient** tu correo, como en el Módulo 5. **Si no tienes Teams o la acción falla** porque tu organización no permite la app Workflows, cambia la acción por un **Send an email (V2)** a tu correo con el asunto `SOLICITUD CRÍTICA: ` + **Título de Solicitud**.

4. La rama **False** se queda vacía: si no es Crítica, el flujo termina después del email.

### Tarea 1.5 — Publicar y probar

1. Selecciona **Publish** y después **Test** → **Manually** → **Test**. El diseñador queda esperando a que ocurra el evento.

2. En otra pestaña, abre la app del Lab 04 (o el editor de filas de **Solicitud TI**) y crea una solicitud: **Título de Solicitud** `Servidor de archivos sin espacio`, **Categoría** Hardware, **Prioridad** **Crítica**, **Fecha Solicitud** hoy. Guárdala.

3. Vuelve a la pestaña del flujo. En uno o dos minutos aparece la ejecución, con una marca verde o una X roja en cada acción.

   **Qué deberías ver:** marca verde en el trigger, el email y la condición; dentro de la condición se ejecutó la rama **True**. Te llegó el email con la Prioridad escrita como **Crítica** (texto, no número) y el mensaje en el canal de Teams (o el email que lo sustituye).

4. Crea otra solicitud con **Prioridad** **Media**. Ve a la página de detalles del flujo (en la solución, selecciona el flujo) y abre la ejecución nueva en **Run history**: esta vez se ejecutó la rama **False** y solo llegó el email.

   **Si no aparece ninguna ejecución:** revisa que pulsaste **Publish** antes de **Test**, que creaste la solicitud en la tabla correcta (no la "(M2)") y la sección "El flujo no se dispara" de Diagnóstico.

### Resultado esperado del Ejercicio 1

Al crear cualquier solicitud en `Solicitud TI`, llega un email de confirmación al destinatario configurado. Si la prioridad es Crítica, también aparece un mensaje en el canal de Teams.

### Validación del Ejercicio 1

- [ ] El flujo aparece en la solución `SIT_SolicitudesInternas` como componente
- [ ] El historial muestra una ejecución por la rama True (Crítica) y otra por la rama False (Media)
- [ ] El email muestra Prioridad y Estado como texto ("Crítica", "Nueva"), no como números
- [ ] Al crear una solicitud Crítica, el mensaje en Teams aparece en el canal configurado (o llega el email alternativo)

---

## Ejercicio 2 — Reporte diario programado

> **Qué vas a hacer:** Crear un flujo que cada día a las 08:00 consulta las solicitudes pendientes y envía un reporte HTML por email, y que no envía nada si no hay pendientes.
> **Duración:** 40 min

**El flujo terminado queda en este orden:** Recurrence → List rows → Create HTML table → Condition (¿no hay filas?) → True: Terminate / False: Send an email (V2).

### Tarea 2.1 — Crear el flujo programado

1. En la solución, **New** → **Automation** → **Cloud flow** → **Scheduled**.

2. En la ventana que se abre:
   - **Flow name:** `SIT — Reporte Diario Solicitudes`
   - **Starting:** la fecha de mañana
   - **Repeat every:** `1` y **Day**
   - Selecciona **Create**.

3. Haz clic en el trigger **Recurrence**. Comprueba que **Frequency** dice **Day** (los campos de hora solo aparecen con esa frecuencia; si no los ves, despliega **Advanced parameters**) y configura ([Learn: flujos programados](https://learn.microsoft.com/power-automate/run-scheduled-tasks)):
   - **Time zone:** tu zona horaria
   - **At these hours:** `8`
   - **At these minutes:** `0`

4. **Save draft**.

### Tarea 2.2 — Consultar las solicitudes y ver los valores reales

1. **+** → **Add an action** → busca `List rows` y elige la de **Microsoft Dataverse** ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)).

2. **Table name:** `Solicitudes TI`. Deja los demás campos vacíos por ahora.

3. **Publish** → **Test** → **Manually** → **Test** → **Run flow** → **Done**.

4. Cuando termine, haz clic en la acción **List rows** dentro de la ejecución y luego en **Show raw outputs** ([Learn: Test cloud flows](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/test-cloud-flows#capture-the-actions-outcome)). Con **Ctrl+F** del navegador busca el título de una de tus solicitudes y comprueba:
   - el nombre interno de la columna principal (el que anotaste en el Lab 02);
   - los números de `sit_estado`: al lado de cada uno verás `sit_estado@OData.Community.Display.V1.FormattedValue` con su texto ("Nueva", "Resuelta"…). Completa con ellos la tabla de la Preparación si te faltaba algún número.

5. Vuelve a **Edit**, abre **List rows**, despliega **Advanced parameters** y completa:

   | Campo | Valor |
   |---|---|
   | Filter rows | `sit_estado ne 723500002 and sit_estado ne 723500003` (cambia los dos números por los tuyos de **Resuelta** y **Cerrada**) |
   | Sort By | `sit_prioridad desc, sit_fechasolicitud asc` |

   > **¿Por qué `ne` y no `!=`?** **Filter rows** usa sintaxis **OData**: `eq` (igual), `ne` (no igual), `gt` (mayor que), `lt` (menor que), `and`, `or`. Es el mismo filtro que la vista `Solicitudes Abiertas del Equipo` del Lab 02.
   >
   > **¿Por qué aquí sí se ordena por Prioridad?** Con OData, una columna Choice se ordena por el **número** de la opción, no por su texto ([Learn: ordenar filas con OData](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/order-rows)). En el Lab 02 creaste las opciones en el orden Baja → Media → Alta → Crítica y Dataverse les dio números crecientes, así que `desc` pone primero las Críticas (compruébalo con tus números). Las vistas de una app model-driven, en cambio, usan FetchXML y ordenan las Choice por su texto: por eso allí se ordena por SLA Horas.

### Tarea 2.3 — Construir la tabla HTML

1. Debajo de **List rows**, **+** → **Add an action** → busca **Create HTML table** (en *Data Operation*) ([Learn: operaciones de datos](https://learn.microsoft.com/power-automate/data-operations)).

2. **From:** con el rayo azul, elige **value** de la sección *List rows* (la lista de filas).

3. **Columns:** si el campo no aparece, abre la lista **Advanced parameters** y marca **Columns**. Abre la lista **Columns** y elige **Custom** (por defecto, **Automatic** crea las columnas solo). Aparecen parejas de cuadros **Header** / **Value** ([Learn: Customize HTML table columns and headers](https://learn.microsoft.com/azure/logic-apps/logic-apps-perform-data-operations#customize-html-table-columns-and-headers), del mismo diseñador que usa Power Automate). Escribe cada encabezado y, en **Value**, inserta con **fx** su expresión:

   | Header | Value (expresión con fx) |
   |---|---|
   | Título | `item()?['sit_titulo']` (**ejemplo**: pon el nombre interno de tu columna principal) |
   | Categoría | `item()?['_sit_categoria_value@OData.Community.Display.V1.FormattedValue']` |
   | Prioridad | `item()?['sit_prioridad@OData.Community.Display.V1.FormattedValue']` |
   | Estado | `item()?['sit_estado@OData.Community.Display.V1.FormattedValue']` |
   | Fecha Solicitud | `formatDateTime(coalesce(item()?['sit_fechasolicitud'], item()?['createdon']), 'yyyy-MM-dd')` |

   > `item()` es cada fila de la lista. **Categoría** es un Lookup: Dataverse lo devuelve como `_sit_categoria_value` (el identificador), y su versión formateada es el **Nombre** de la categoría (la columna principal del registro relacionado, según [Learn: Select columns, formatted values](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/select-columns)), igual que el Solicitante en la Práctica 5.2 del Módulo 5. En la fecha, `coalesce` usa la fecha de creación si una solicitud no tiene Fecha Solicitud, para que `formatDateTime` no falle con un valor vacío ([Learn: funciones de expresión](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference)). Si en los raw outputs de la Tarea 2.2 un nombre es distinto, usa el que viste allí.

### Tarea 2.4 — Condición: enviar solo si hay solicitudes

1. Debajo de **Create HTML table**, **+** → **Add an action** → **Condition**.

2. En el primer cuadro inserta con **fx**:
   ```
   empty(outputs('List_rows')?['body/value'])
   ```
   Operador: **is equal to**. En el segundo cuadro inserta con **fx** la expresión `true` (para que sea un valor lógico y no la palabra "true").

3. **Rama True** (lista vacía, no enviar): agrega **Terminate** y elige **Status: Succeeded**. Con *Succeeded* no se escribe mensaje: el flujo simplemente termina sin enviar el correo (el código y el mensaje de error solo existen con *Failed*).

4. **Rama False** (hay solicitudes): agrega **Send an email (V2)**:
   - **To:** tu propio email.
   - **Subject:** inserta con **fx** `concat('Reporte Diario SIT — ', string(length(outputs('List_rows')?['body/value'])), ' solicitudes pendientes')`.
   - **Body:** cambia el editor a **vista de código** con el botón **</>** de su barra de herramientas y escribe:
     ```html
     <h2>Reporte Diario — Solicitudes Pendientes</h2>
     <p>Total de solicitudes abiertas: <strong>(expresión)</strong></p>
     (Output de Create HTML table)
     <hr/>
     <p style="color:#666;font-size:12px">Generado automáticamente por Power Automate · SIT</p>
     ```
     En *(expresión)* inserta con **fx** `length(outputs('List_rows')?['body/value'])`. En *(Output de Create HTML table)* inserta con el rayo azul **Output** de la sección *Create HTML table*.

   > El cuerpo de **Send an email (V2)** acepta HTML ([Learn: conector Office 365 Outlook](https://learn.microsoft.com/connectors/office365/)). Si escribes las etiquetas en el modo de texto enriquecido, llegarán como texto visible: usa la vista de código.

### Tarea 2.5 — Publicar y probar manualmente

1. **Publish** → **Test** → **Manually** → **Run flow** → **Done**. No hace falta esperar a las 08:00.

   **Qué deberías ver:** marca verde en todas las acciones y la rama **False** ejecutada. En tu correo, el asunto dice cuántas solicitudes hay pendientes, y el cuerpo trae una tabla con columnas Título, Categoría, Prioridad, Estado y Fecha Solicitud, empezando por las Críticas.

2. **Prueba la rama vacía:** cambia temporalmente **Filter rows** por `sit_estado eq 1` (un número que no existe), **Publish** y vuelve a probar. El flujo debe terminar en **Terminate** sin enviar correo. Después **vuelve a poner tu filtro** y publica.

| Lo que ves | Causa probable | Qué hacer |
|---|---|---|
| El correo muestra literalmente `empty(...)` o `length(...)` | Pegaste la expresión como texto | Bórrala e insértala con **fx** |
| La tabla muestra números como `723500003` | Usaste el valor y no la etiqueta | Usa la expresión con `@OData.Community.Display.V1.FormattedValue` |
| La columna Título sale vacía | El nombre interno de `item()?['...']` no es el tuyo | Cópialo de los raw outputs de la Tarea 2.2 |
| El correo trae las etiquetas `<h2>`, `<p>` como texto | Escribiste el HTML en el modo de texto enriquecido | Pégalo en la vista de código (**</>**) |
| **Test** corre la versión anterior o no te deja probar | Solo guardaste un borrador | **Publish** antes de **Test** |

### Validación del Ejercicio 2

- [ ] El flujo se ejecutó manualmente sin errores
- [ ] El email de reporte llegó con la tabla HTML y las etiquetas en texto (no números)
- [ ] Con un filtro que no devuelve filas, el flujo termina en **Terminate** sin enviar email

---

## Ejercicio 3 — Flujo de aprobación de prioridad crítica

> **Qué vas a hacer:** Crear un flujo que se dispara cuando alguien cambia la prioridad de una solicitud, pide aprobación si la nueva prioridad es Crítica, y actualiza el registro en Dataverse según la respuesta.
> **Duración:** 45 min

### Tarea 3.1 — Crear el flujo con trigger de modificación

1. En la solución, **New** → **Automation** → **Cloud flow** → **Automated**.

2. **Flow name:** `SIT — Aprobación Prioridad Crítica`. Trigger: **When a row is added, modified or deleted** (Microsoft Dataverse) → **Create**.

3. Configura el trigger:

   | Campo | Valor |
   |---|---|
   | Change type | Modified |
   | Table name | Solicitudes TI |
   | Scope | Organization |
   | Select columns (en **Advanced parameters** → **Show all**) | `sit_prioridad` |

   > **¿Para qué sirve Select columns?** Hace que el flujo solo se dispare cuando la actualización incluye `sit_prioridad`; sin él, se dispararía con cualquier cambio de la solicitud (por ejemplo, al cambiar el Estado). Learn advierte dos cosas: el flujo se dispara aunque el valor enviado sea el mismo que ya tenía, y no funciona con columnas Lookup. Por eso prueba este flujo desde el formulario de la app del Lab 04, que solo envía las columnas que cambiaste: un formulario de Canvas App puede enviar todas sus columnas al guardar y disparar el flujo sin que la prioridad haya cambiado.

### Tarea 3.2 — Verificar que la prioridad es Crítica

1. **+** → **Add an action** → **Condition**:
   - Primer cuadro, con **fx**: `triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']`
   - Operador: **is equal to**
   - Segundo cuadro: `Crítica`

2. En la rama **False** (no es Crítica): agrega **Terminate** → **Status: Succeeded**.

3. En la rama **True** continúa con las tareas siguientes.

### Tarea 3.3 — Iniciar el proceso de aprobación

1. En la rama **True**, **+** → **Add an action** → busca `Start and wait for an approval` (conector **Approvals**) ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/get-started-approvals)):

   | Campo | Valor |
   |---|---|
   | Approval type | Approve/Reject - First to respond |
   | Title | Escribe `Solicitud Crítica: ` e inserta con el rayo azul **Título de Solicitud** (del trigger) |
   | Assigned to | Tu email (en producción sería el supervisor) |
   | Details | El texto de abajo |
   | Item link | *(opcional)* |

2. **Details:** escribe las líneas e inserta los datos con el rayo azul:
   ```
   Se ha marcado como Crítica la siguiente solicitud:
   Título: (Título de Solicitud)
   Descripción: (Descripción)
   Fecha de solicitud: (Fecha Solicitud)
   ¿Apruebas que esta solicitud tenga prioridad Crítica con SLA de 4 horas?
   ```

   > Esta acción **pausa el flujo** hasta que el aprobador responde. Mientras tanto, la ejecución aparece en curso en el Run history. La respuesta puede darse desde el email de Outlook, desde Teams o desde el centro de aprobaciones de Power Automate.

### Tarea 3.4 — Procesar la respuesta

1. Debajo de la aprobación (todavía dentro de la rama True), agrega otra **Condition**:
   - Primer cuadro: con el rayo azul, **Outcome** de la sección *Start and wait for an approval*
   - Operador: **is equal to**
   - Segundo cuadro: `Approve`

   > Learn indica que las respuestas válidas de este tipo de aprobación son "Approve" y "Reject", y que distinguen mayúsculas ([Learn: conector Approvals](https://learn.microsoft.com/connectors/approvals/)). Escribe `Approve` exactamente así.

2. **Rama True (aprobado):**
   - **Update a row** (Microsoft Dataverse) ([Learn: actualizar una fila](https://learn.microsoft.com/power-automate/dataverse/update)):
     - **Table name:** Solicitudes TI
     - **Row ID:** con el rayo azul, el identificador de la solicitud del trigger. Su valor es un GUID y en los raw outputs se llama `sit_solicitudid`; en la lista de contenido dinámico suele aparecer con el nombre de la tabla en singular (algo como **Solicitud TI**), pero el nombre exacto puede variar. Si no lo identificas, usa **fx** y escribe `triggerOutputs()?['body/sit_solicitudid']`. No elijas **Título de Solicitud**: el Row ID es el GUID.
     - **Estado:** las columnas de la tabla aparecen bajo **Advanced parameters**; despliega esa zona (si hay un botón **Show all**, úsalo para verlas todas, o marca solo la columna **Estado**) y elige **En Proceso** en la lista. Las columnas que dejas vacías no se modifican.
   - **Send an email (V2)** → **To:** tu email · **Subject:** `Prioridad Crítica aprobada: ` + **Título de Solicitud** · **Body:** `La prioridad Crítica fue aprobada. La solicitud está en proceso.`

3. **Rama False (rechazado):**
   - **Update a row:** **Table name** Solicitudes TI, el mismo **Row ID**, y en **Prioridad** elige **Alta**.
   - **Send an email (V2)** → **To:** tu email · **Subject:** `Prioridad revertida: ` + **Título de Solicitud** · **Body:** `La prioridad fue revertida a Alta. Comentarios del aprobador: ` e inserta con el rayo azul **Responses comments** de la sección *Start and wait for an approval* ([Learn: aprobaciones modernas](https://learn.microsoft.com/power-automate/modern-approvals)).

   > Como una aprobación puede tener varias respuestas, al insertar **Responses comments** el diseñador envuelve el email automáticamente en un bucle **Apply to each** (en el diseñador nuevo puede llamarse **For each**) ([Learn: ejemplo con aprobación](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/business-events/how-to/how-to-workflow)). Es normal: con "First to respond" solo hay una respuesta y llega un solo email.

   > **Lo que pasa después de rechazar:** el **Update a row** cambia `sit_prioridad`, así que el trigger se dispara otra vez. Esa segunda ejecución ve Prioridad = Alta y termina en el **Terminate** de la Tarea 3.2: es lo esperado, no un bucle. Además, la Regla 1 del Lab 02 actualiza SLA Horas a 8. Al aprobar, el flujo solo cambia `sit_estado`, que no está en **Select columns**, así que no hay segunda ejecución.

### Tarea 3.5 — Publicar y probar el flujo completo

1. **Publish**.

2. En la app del Lab 04, abre `Sin acceso a sistema contable` (Prioridad Alta), cambia **Prioridad** a **Crítica** y guarda.

3. Revisa tu correo. La **primera** aprobación del ambiente puede tardar unos minutos: Power Automate prepara las tablas de aprobaciones la primera vez.

   **Qué deberías ver:** un email de aprobación con los botones **Approve** y **Reject** y los detalles de la solicitud.

4. Selecciona **Approve**. En la app, recarga la solicitud: **Estado** ahora es **En Proceso**. Llega el email de confirmación.

5. Repite con `Acceso a carpeta de proyectos` (Prioridad Alta → Crítica) y esta vez **Reject**, escribiendo un comentario (por ejemplo, `No afecta a producción`). Recarga: **Prioridad** volvió a **Alta** y SLA Horas a 8. Llega el email con tu comentario.

6. En la página de detalles del flujo, abre **Run history**: verás las dos ejecuciones con aprobación y la ejecución corta que produjo el rechazo (la que termina en Terminate).

### Validación del Ejercicio 3

- [ ] Cambiar el Estado de una solicitud no dispara el flujo (solo cambiar la Prioridad)
- [ ] Un cambio a una prioridad que no es Crítica termina en **Terminate** sin pedir aprobación
- [ ] El email de aprobación llegó con los detalles de la solicitud
- [ ] Al aprobar, el Estado de la solicitud cambia a "En Proceso" en Dataverse
- [ ] Al rechazar, la Prioridad vuelve a "Alta" y llega email con los comentarios del aprobador

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flujo no se dispara al crear solicitudes | Sigue en borrador, el trigger apunta a la tabla "(M2)" o la conexión no tiene acceso | **Publish**; revisa **Table name**; revisa la conexión en **Data** → **Connections** |
| Error 401 o "credenciales no válidas" en una acción | La conexión expiró o cambió la contraseña de la cuenta | **Data** → **Connections** → **Fix connection** en esa conexión |
| La tabla HTML llega vacía o el flujo termina en Terminate con datos | El filtro OData tiene un error o los números de Estado no son los tuyos | Revisa la salida de **List rows** en el Run history y compara los números |
| La aprobación no llega | Es la primera aprobación del ambiente, o **Assigned to** tiene un email fuera del tenant | Espera unos minutos; usa un email de tu tenant; revisa el centro de aprobaciones |
| El flujo de aprobación se ejecuta dos veces tras un rechazo | El rechazo cambia la Prioridad y vuelve a disparar el trigger | Es lo esperado: la segunda ejecución termina en Terminate |
| El email muestra la Prioridad como número | Se insertó el dato **Prioridad** del rayo azul | Usa la expresión con `@OData.Community.Display.V1.FormattedValue` |

---

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### El flujo no se dispara al crear solicitudes

- **Causa probable:** el flujo quedó como borrador (no se publicó) o está apagado, el trigger apunta a otra tabla (la "Solicitud TI (M2)"), o la conexión de Dataverse pertenece a una cuenta sin acceso a la tabla.
- **Cómo comprobar:** en la solución, selecciona el flujo y abre su página de detalles: revisa si está encendido y mira el **Run history**. Si no hay ninguna ejecución, ni siquiera fallida, el trigger no se está evaluando: abre el flujo y revisa **Table name** y **Change type**. Si hay ejecuciones fallidas, ábrelas y lee el error del trigger.
- **Cómo corregir:** **Publish** y comprueba que esté encendido. Si el problema es la conexión, ve a **Data** → **Connections**, selecciona la de Dataverse y, si muestra **Fix connection**, úsalo; si la cuenta no tiene acceso al ambiente, crea la conexión con una cuenta que tenga System Customizer o System Administrator.
- **Reiniciar vs. reparar:** repara la conexión, la tabla o la publicación; no hace falta recrear el flujo.
- **Evidencia posterior a la corrección:** al crear una solicitud de prueba, aparece una ejecución nueva en **Run history** con estado **Succeeded** en uno o dos minutos.

### Error 401 en la acción de email

- **Causa probable:** la conexión de Office 365 Outlook dejó de ser válida, por ejemplo porque cambió la contraseña de la cuenta.
- **Cómo comprobar:** abre la ejecución fallida en **Run history** → expande **Send an email (V2)**: el error menciona 401 o credenciales no válidas.
- **Cómo corregir:** en [make.powerautomate.com](https://make.powerautomate.com) → **Data** → **Connections** → en la conexión de Office 365 Outlook, **Fix connection** e inicia sesión de nuevo con tu cuenta del tenant ([Learn: administrar conexiones](https://learn.microsoft.com/power-automate/add-manage-connections)). Vuelve a probar el flujo.
- **Reiniciar vs. reparar:** siempre reparar la conexión; nunca hace falta eliminar la acción ni el flujo.
- **Evidencia posterior a la corrección:** la acción de email muestra marca verde y el correo llega.

### La tabla HTML llega vacía en el reporte diario

- **Causa probable:** el filtro OData de **List rows** tiene un error de sintaxis (por ejemplo, `!=` en vez de `ne`), o los números de `sit_estado` no son los de tu ambiente.
- **Cómo comprobar:** prueba el flujo (**Test** → **Manually**) y, en la ejecución, abre **List rows** → **Show raw outputs**: si `value` es una lista vacía `[]`, el filtro excluye todo. Compara los números del filtro con los de la tabla de la Preparación.
- **Cómo corregir:** usa solo `eq`/`ne`/`gt`/`lt`/`and`/`or` y los números reales de Resuelta y Cerrada.
- **Reiniciar vs. reparar:** repara el texto de **Filter rows**; no hace falta recrear la acción.
- **Evidencia posterior a la corrección:** **List rows** devuelve las solicitudes abiertas y la tabla del correo tiene filas.

### La aprobación no llega al email

- **Causa probable:** es la primera aprobación del ambiente y las tablas de aprobaciones todavía se están preparando, o **Assigned to** tiene un email fuera del tenant o mal escrito.
- **Cómo comprobar:** abre la ejecución en **Run history**: si **Start and wait for an approval** está en curso (esperando), la aprobación se creó. Revisa el valor exacto de **Assigned to** y compáralo con tu email del tenant.
- **Cómo corregir:** espera unos minutos y revisa también el centro de aprobaciones de Power Automate y Teams. Si el email estaba mal, corrígelo, publica y vuelve a probar.
- **Reiniciar vs. reparar:** repara el valor del campo; no hace falta recrear la acción.
- **Evidencia posterior a la corrección:** llega la solicitud de aprobación con los botones **Approve** y **Reject**.

### El flujo de aprobación se ejecuta más veces de lo esperado

- **Causa probable:** (1) tras un **Reject**, el **Update a row** cambia la Prioridad y el trigger vuelve a dispararse: esa segunda ejecución es esperada y termina en Terminate; (2) **Select columns** está vacío, así que cualquier cambio de la solicitud dispara el flujo; (3) la solicitud se editó desde un formulario que envía todas las columnas al guardar, y Learn indica que el trigger se dispara aunque el valor enviado sea el mismo.
- **Cómo comprobar:** en **Run history**, abre las ejecuciones repetidas. Las que terminan en el **Terminate** de la Tarea 3.2 no piden aprobación. Si alguna pidió una segunda aprobación para la misma solicitud, abre el trigger y comprueba que **Select columns** contiene exactamente `sit_prioridad`.
- **Cómo corregir:** escribe `sit_prioridad` en **Select columns** y publica. Prueba los cambios de prioridad desde la app del Lab 04.
- **Reiniciar vs. reparar:** repara el trigger; no hace falta recrear el flujo.
- **Evidencia posterior a la corrección:** cambiar el Estado de una solicitud no crea ejecuciones, y cada cambio a Crítica genera una sola aprobación.

### La Prioridad sale como número en el email

- **Causa probable:** se insertó el dato **Prioridad** del rayo azul (el número de la opción) en lugar de la expresión de la etiqueta, o la expresión se pegó como texto sin **fx**.
- **Cómo comprobar:** en el campo del email, la expresión debe verse como una pastilla de color; si ves el texto `triggerOutputs()...` sin pastilla, no se está calculando.
- **Cómo corregir:** borra ese dato e inserta con **fx** `triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']`.
- **Reiniciar vs. reparar:** repara solo ese campo.
- **Evidencia posterior a la corrección:** el email muestra "Crítica", "Alta", etc.

---

## Checklist final

- [ ] Flujo 1 (`SIT — Notificar Nueva Solicitud`) publicado dentro de la solución SIT
- [ ] Al crear una solicitud, el email de confirmación llega con Prioridad y Estado en texto
- [ ] Al crear una solicitud Crítica, el mensaje en Teams aparece en el canal configurado (o el email alternativo)
- [ ] Flujo 2 (`SIT — Reporte Diario Solicitudes`) se ejecuta manualmente sin errores y envía la tabla HTML
- [ ] El Flujo 2 termina sin enviar email cuando no hay solicitudes pendientes
- [ ] Flujo 3 (`SIT — Aprobación Prioridad Crítica`) solo pide aprobación cuando la Prioridad cambia a Crítica
- [ ] Al aprobar: el Estado cambia a "En Proceso" en Dataverse
- [ ] Al rechazar: la Prioridad vuelve a "Alta" con email de notificación y comentario

---

## Evidencia esperada

- Captura del **Run history** de los 3 flujos con al menos una ejecución **Succeeded** de cada uno
- Captura del email de confirmación de una solicitud Crítica y del mensaje de Teams (o del email alternativo)
- Captura del email del reporte diario con la tabla HTML, y de la ejecución que terminó en **Terminate** con el filtro vacío
- Captura de las ejecuciones del flujo de aprobación: la aprobada, la rechazada y la corta que generó el rechazo
- Los números de Estado de tu ambiente (tabla de la Preparación) y el filtro exacto de **List rows**

## Criterios de aprobación

- Los 3 flujos corren sin intervención manual en 3 ejecuciones de prueba consecutivas (el Flujo 2 con **Test** → **Manually**)
- El flujo de aprobación solo pide aprobación cuando `sit_prioridad` cambia a Crítica, no en otros cambios
- Aprobar y rechazar producen el efecto correcto en Dataverse (estado / prioridad + notificación)
- Los emails muestran las etiquetas de las Choice, no sus números
- 100% de los ítems del Checklist final marcados

## Reto adicional

**Reto básico:** Modifica el Flujo 2 para que el reporte incluya cuántas solicitudes pendientes hay de cada prioridad (Críticas, Altas, Medias, Bajas). Usa la acción **Filter array** (Data Operation) sobre **value** de *List rows* con la condición `item()?['sit_prioridad@OData.Community.Display.V1.FormattedValue']` **is equal to** `Crítica` (y una por prioridad), y cuenta el resultado con `length(body('Filter_array'))`.

**Reto intermedio:** Crea una tabla `Alerta de Seguridad` (Schema name `sit_alertaseguridad`) con un Lookup a `Solicitud TI`, y agrega al Flujo 1 un paso que, cuando la categoría de la solicitud es "Accesos y Seguridad", cree una fila en esa tabla con **Add a new row**. *Para pensar:* Categoría es un Lookup; ¿el trigger trae su nombre o solo su identificador? Revísalo en los raw outputs del trigger y, si solo trae el identificador, usa **Get a row by ID** sobre **Categorías** antes de la condición.

**Reto avanzado:** Implementa un flujo de **recordatorio de escalamiento**: cada día, busca solicitudes con Prioridad Alta o Crítica que llevan más de 2 días en estado "Nueva" sin asignar y envía un email de escalamiento al supervisor. En **Filter rows**, "sin asignar" se escribe `_sit_asignado_value eq null`, y la fecha de corte se calcula con la expresión `addDays(utcNow(), -2)` insertada con **fx** detrás del texto `sit_fechasolicitud lt `, como en el reto de transferencia del Módulo 5.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre un flujo **Automated**, **Instant** y **Scheduled**?
2. ¿Por qué se recomienda poner las acciones críticas dentro de un **Scope** con manejo de errores? (Práctica 5.4 del Módulo 5)
3. ¿Qué significa que la acción "Start and wait for an approval" **pausa** el flujo?
4. ¿Por qué los filtros OData en Dataverse usan valores numéricos para columnas Choice en lugar de texto, y cómo obtienes el texto para un email?
5. ¿Por qué el Flujo 3 se ejecuta dos veces después de un rechazo y no después de una aprobación?

---

## Limpieza del laboratorio

> Los flujos están dentro de la solución. Si quieres que dejen de enviar correos sin borrarlos, apágalos desde su página de detalles. Para eliminarlos, en la solución `SIT Solicitudes Internas` selecciona el flujo, abre **...** → **Remove** y elige **Remove from this solution** (sale de la solución pero sigue en el ambiente) o **Delete from this environment** (lo borra del todo) ([Learn: Remove a solution-aware flow](https://learn.microsoft.com/power-automate/remove-solution-aware-flow)).

> ⚠️ Si eliminas los flujos, el Lab 09 seguirá funcionando — no depende de ellos. Consérvalos si quieres ver el sistema completo en acción.

---

## Siguiente laboratorio recomendado

➡️ **Lab 09 — Dataverse Avanzado: BPF, Rollups y Field Security**

**Por qué ir ahí:** Extiende el modelo de datos del Lab 02 con funcionalidades de nivel PL-200: columnas Rollup para métricas agregadas, Field Security Profiles para proteger datos financieros, y Business Process Flows para guiar el ciclo de vida de la solicitud.
