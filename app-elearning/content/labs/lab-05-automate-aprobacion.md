---
id: lab-05
title: "Power Automate — Notificación y Aprobación de Solicitudes"
level: "N1"
duration: 80
product: ["Power Automate Cloud", "Dataverse", "Outlook", "Teams"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites:
  - "Lab 02 completado — tabla sit_Solicitud con datos"
  - "Lab 03 completado — Canvas App publicada (opcional pero recomendado)"
  - "Buzón de Outlook activo en el tenant"
files: []
---

# Lab 05 — Power Automate: Notificación y Aprobación de Solicitudes (SIT)

## Objetivo

Al finalizar este laboratorio podrás crear tres flujos de nube: uno automatizado que notifica por email al crear solicitudes, uno programado que envía un resumen diario al responsable, y uno de aprobación para cambios de prioridad crítica, integrando Dataverse, Outlook y Teams.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación de Labs 02 y 03

**Problema a resolver:** Las solicitudes se crean en la app pero nadie se entera hasta que alguien recuerda revisar. Las solicitudes críticas llegan a la cola general sin escalamiento. No existe ningún reporte periódico del estado del backlog.

**Por qué Power Automate:** Los disparadores nativos de Dataverse permiten reaccionar a cambios de datos en tiempo real sin polling ni código. La acción de aprobación integrada elimina la necesidad de un sistema externo de workflow.

## Lo que vas a construir

- **Flujo 1 — Notificación automática:** al crear una solicitud, envía email de confirmación al solicitante y alerta en Teams si es Crítica
- **Flujo 2 — Reporte diario:** cada mañana envía por email la lista de solicitudes pendientes con tabla HTML
- **Flujo 3 — Aprobación de prioridad:** proceso de aprobación cuando se cambia una solicitud a Crítica, con actualización de Dataverse según resultado

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Flujo de notificación automática | 25 min |
| Ejercicio 2 — Reporte diario programado | 25 min |
| Ejercicio 3 — Flujo de aprobación de prioridad crítica | 30 min |
| **Total** | **80 min** |

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power Automate Cloud Flows (Automated, Scheduled, Instant)
- Conector Dataverse (When a row is added / List rows / Update a row)
- Conector Office 365 Outlook (Send email V2)
- Conector Microsoft Teams (Post message)
- Conector Approvals (Start and wait for an approval)

## Prerrequisitos

### Entorno

- [ ] Ambiente Developer con tabla `sit_Solicitud` conteniendo 10+ registros
- [ ] Cuenta Microsoft 365 con buzón de Outlook activo
- [ ] Acceso al canal de Teams "General" (o cualquier canal accesible)
- [ ] La solución `SIT_SolicitudesInternas` abierta (los flujos se crearán dentro de ella)

### Conocimiento previo

- Módulo 5 estudiado: conceptos de triggers, acciones, condiciones y variables
- Comprender qué es un trigger vs una acción en un flujo

---

## Datos de apoyo

### Emails para las pruebas

| Rol | Email sugerido |
|---|---|
| Solicitante de prueba | Tu propio email del tenant |
| Responsable de TI | Tu propio email (usarás el mismo para ver ambos mensajes en pruebas) |
| Canal de Teams | Canal "General" de cualquier equipo al que tengas acceso |

### Valores de OptionSet (Choice) para filtros OData

Los filtros de Dataverse en Power Automate usan el valor numérico de las opciones, no la etiqueta. Anota estos valores después de crear la tabla (los encuentras en make.powerapps.com → Tabla → Columna → Opciones de elección):

| Estado | Valor numérico (ejemplo) |
|---|---|
| Nueva | Anótalo aquí: ___ |
| En Proceso | Anótalo aquí: ___ |
| Resuelta | Anótalo aquí: ___ |
| Cerrada | Anótalo aquí: ___ |

| Prioridad | Valor numérico (ejemplo) |
|---|---|
| Baja | Anótalo aquí: ___ |
| Media | Anótalo aquí: ___ |
| Alta | Anótalo aquí: ___ |
| Crítica | Anótalo aquí: ___ |

> **Cómo encontrar los valores:** En make.powerapps.com → Tablas → Solicitud → Columnas → `sit_prioridad` → editar → cada opción tiene un campo "Valor" con el número entero.

---

## Ejercicio 1 — Flujo de notificación automática

> **Qué vas a hacer:** Crear un flujo que se dispara cuando se crea una nueva solicitud en Dataverse y envía email al solicitante + alerta en Teams si es Crítica.
> **Duración:** 25 min

### Tarea 1.1 — Crear el flujo dentro de la solución

1. En [make.powerapps.com](https://make.powerapps.com), abre la solución `SIT_SolicitudesInternas`.

2. Haz clic en **+ Nuevo** → **Automatización** → **Flujo de nube** → **Automatizado**.

3. Completa el diálogo:
   - **Nombre del flujo:** `SIT — Notificar Nueva Solicitud`
   - **Elegir el desencadenador:** busca "When a row is added" → selecciona **"When a row is added, modified or deleted"** del conector **Microsoft Dataverse**

4. Haz clic en **Crear**.

### Tarea 1.2 — Configurar el disparador

1. En el disparador **When a row is added, modified or deleted**, configura:

   | Campo | Valor |
   |---|---|
   | Change type | Added |
   | Table name | Solicitudes (sit_Solicitud) |
   | Scope | Organization |

   > **Scope Organization** significa que el flujo se dispara cuando cualquier usuario del tenant crea una solicitud, no solo tú. En ambientes de desarrollo esto es lo esperado.

### Tarea 1.3 — Enviar email de confirmación al solicitante

1. Haz clic en **+ Nuevo paso**.

2. Busca y selecciona **"Send an email (V2)"** del conector **Office 365 Outlook**.

3. Configura los campos:

   | Campo | Valor |
   |---|---|
   | Para (To) | Usa tu email por ahora. En producción sería la columna `sit_solicitante Email` del trigger |
   | Asunto | Selecciona el campo dinámico: `sit_titulo` del trigger, precedido de texto: `Solicitud registrada: ` |
   | Cuerpo (HTML) | Ver abajo |

4. Para el cuerpo del email, activa el modo HTML y usa:
   ```html
   <p>Tu solicitud ha sido registrada en el sistema de soporte SIT.</p>
   <table border="1" cellpadding="6" style="border-collapse:collapse">
     <tr><th>Campo</th><th>Valor</th></tr>
     <tr><td><strong>Título</strong></td><td>@{triggerOutputs()?['body/sit_titulo']}</td></tr>
     <tr><td><strong>Prioridad</strong></td><td>@{triggerOutputs()?['body/_sit_prioridad_label']}</td></tr>
     <tr><td><strong>Estado</strong></td><td>@{triggerOutputs()?['body/_sit_estado_label']}</td></tr>
     <tr><td><strong>Fecha</strong></td><td>@{triggerOutputs()?['body/sit_fechasolicitud']}</td></tr>
   </table>
   <p>El equipo de soporte revisará tu solicitud y te contactará pronto.</p>
   ```

   > **¿Por qué `_sit_prioridad_label`?** Las columnas Choice en Dataverse exponen dos salidas: el valor numérico (`sit_prioridad`) y la etiqueta en texto (`_sit_prioridad_label` con guión bajo y `_label` al final). Usa siempre `_label` en los emails.

### Tarea 1.4 — Condición y alerta en Teams para solicitudes Críticas

1. Agrega un **+ Nuevo paso** → selecciona la acción **Control → Condición**.

2. Configura la condición:
   - **Valor izquierdo:** selecciona el campo dinámico `sit_prioridad` del trigger (el valor numérico)
   - **Operador:** es igual a
   - **Valor derecho:** escribe el número entero que corresponde a "Crítica" (el que anotaste en los datos de apoyo)

3. En la rama **SÍ** (condición verdadera — es Crítica):
   - Agrega acción **"Post message in a chat or channel"** del conector **Microsoft Teams**
   - **Post as:** Flow bot
   - **Post in:** Channel
   - **Team:** selecciona tu equipo
   - **Channel:** General
   - **Message:**
     ```
     🚨 SOLICITUD CRÍTICA REGISTRADA
     Título: @{triggerOutputs()?['body/sit_titulo']}
     Descripción: @{triggerOutputs()?['body/sit_descripcion']}
     Registrada el: @{triggerOutputs()?['body/sit_fechasolicitud']}
     Requiere atención inmediata.
     ```

4. La rama **NO** puede quedar vacía (sin acciones adicionales).

### Tarea 1.5 — Guardar y probar

1. Haz clic en **Guardar** (botón superior derecho).

2. Para probar, crea una nueva solicitud desde la Canvas App del Lab 03 o directamente en Dataverse.

3. En el portal de Power Automate, ve a **Mis flujos** → selecciona el flujo → **Historial de ejecuciones** → verifica que la ejecución fue exitosa (estado: Correcto ✅).

4. Revisa tu bandeja de Outlook — el email de confirmación debe haber llegado.

### Resultado esperado del Ejercicio 1

Al crear cualquier solicitud en `sit_Solicitud`, llega un email de confirmación al destinatario configurado. Si la prioridad es Crítica, también aparece un mensaje en el canal de Teams.

### Validación del Ejercicio 1

- [ ] El flujo aparece en la solución `SIT_SolicitudesInternas` como componente
- [ ] El historial muestra al menos una ejecución exitosa
- [ ] El email de confirmación llegó correctamente con los datos de la solicitud
- [ ] Al crear una solicitud Crítica, el mensaje en Teams aparece en el canal configurado

---

## Ejercicio 2 — Reporte diario programado

> **Qué vas a hacer:** Crear un flujo que cada día a las 08:00 consulta las solicitudes pendientes y envía un reporte HTML por email.
> **Duración:** 25 min

### Tarea 2.1 — Crear el flujo programado

1. En la solución, **+ Nuevo** → **Automatización** → **Flujo de nube** → **Programado**.

2. Configura:
   - **Nombre:** `SIT — Reporte Diario Solicitudes`
   - **Iniciar:** fecha de hoy
   - **Repetir cada:** 1 Día
   - **En este momento:** 08:00 AM (ajusta a tu zona horaria)

3. Haz clic en **Crear**.

### Tarea 2.2 — Consultar solicitudes pendientes

1. **+ Nuevo paso** → **"List rows"** (Dataverse).

2. Configura:

   | Campo | Valor |
   |---|---|
   | Table name | Solicitudes (sit_Solicitud) |
   | Filter rows | `sit_estado ne 3 and sit_estado ne 4` (reemplaza 3 y 4 con los valores de Resuelta y Cerrada de tus datos de apoyo) |
   | Select columns | `sit_titulo,sit_prioridad,sit_estado,sit_fechasolicitud,sit_asignado` |
   | Order by | `sit_prioridad desc` |

   > **¿Por qué `ne` y no `!=`?** Los filtros de Dataverse en Power Automate usan sintaxis **OData**: `eq` (igual), `ne` (no igual), `gt` (mayor que), `lt` (menor que), `and`, `or`. Usa siempre esta sintaxis en el campo "Filter rows".

### Tarea 2.3 — Construir la tabla HTML

1. **+ Nuevo paso** → busca **"Create HTML table"** (Data Operations).

2. Configura:
   - **From:** selecciona `value` del paso "List rows" (contenido dinámico)
   - **Columns:** selecciona **Custom** y agrega:

   | Header | Value |
   |---|---|
   | Título | `item()?['sit_titulo']` |
   | Prioridad | `item()?['_sit_prioridad_label']` |
   | Estado | `item()?['_sit_estado_label']` |
   | Fecha Solicitud | `item()?['sit_fechasolicitud']` |

3. Esta acción genera automáticamente una tabla HTML con las filas de solicitudes.

### Tarea 2.4 — Condición: enviar solo si hay solicitudes

1. Agrega **Control → Condición**:
   - **Valor izquierdo:** expresión: `empty(outputs('List_rows')?['body/value'])`
   - **Operador:** es igual a
   - **Valor derecho:** `true`

2. **Rama SÍ** (lista vacía — no enviar):
   - Agrega acción **"Terminate"** → Status: Succeeded → mensaje: `Sin solicitudes pendientes`

3. **Rama NO** (hay solicitudes — enviar email):
   - Agrega **"Send an email (V2)"**:

   | Campo | Valor |
   |---|---|
   | Para | Tu email de soporte |
   | Asunto | expresión: `concat('Reporte Diario SIT — ', string(length(outputs('List_rows')?['body/value'])), ' solicitudes pendientes')` |
   | Cuerpo (HTML) | Ver abajo |

4. Cuerpo del email (HTML):
   ```html
   <h2>Reporte Diario — Solicitudes Pendientes</h2>
   <p>Total de solicitudes abiertas: <strong>@{length(outputs('List_rows')?['body/value'])}</strong></p>
   @{outputs('Create_HTML_table')?['body']}
   <hr/>
   <p style="color:#666;font-size:12px">Generado automáticamente por Power Automate · SIT</p>
   ```

   > Agrega estilos CSS inline al `<table>` si quieres mejorar la presentación. Power Automate soporta estilos inline pero no hojas de estilo externas.

### Tarea 2.5 — Guardar y probar manualmente

1. Guarda el flujo.

2. Para probar sin esperar a las 08:00 del día siguiente:
   - En el editor del flujo, haz clic en **Probar** (botón superior)
   - Selecciona **Manualmente** → **Ejecutar flujo**

3. Verifica el historial y el email recibido.

### Validación del Ejercicio 2

- [ ] El flujo se ejecutó manualmente sin errores
- [ ] El email de reporte llegó con la tabla HTML de solicitudes
- [ ] Si no hay solicitudes pendientes, el flujo termina sin enviar email (prueba filtrando todas como Cerradas)

---

## Ejercicio 3 — Flujo de aprobación de prioridad crítica

> **Qué vas a hacer:** Crear un flujo que se dispara cuando alguien modifica el campo prioridad de una solicitud a "Crítica", solicita aprobación al responsable y actualiza el registro en Dataverse según la respuesta.
> **Duración:** 30 min

### Tarea 3.1 — Crear el flujo automatizado con trigger de modificación

1. En la solución, **+ Nuevo** → **Flujo de nube** → **Automatizado**.

2. Configura:
   - **Nombre:** `SIT — Aprobación Prioridad Crítica`
   - **Disparador:** "When a row is added, modified or deleted" (Dataverse)

3. Configura el disparador:

   | Campo | Valor |
   |---|---|
   | Change type | Modified |
   | Table name | Solicitudes (sit_Solicitud) |
   | Scope | Organization |
   | Select columns | `sit_prioridad` |

   > **¿Por qué `Select columns`?** Este campo hace que el flujo solo se dispare cuando específicamente cambia `sit_prioridad`. Sin esto, se dispararía en cualquier cambio del registro (incluso al actualizar el estado), generando aprobaciones innecesarias.

### Tarea 3.2 — Verificar que la prioridad es Crítica

1. Agrega **Control → Condición**:
   - **Valor izquierdo:** `sit_prioridad` del trigger (valor numérico)
   - **Operador:** es igual a
   - **Valor derecho:** el número entero de "Crítica"

2. En la **rama NO** (no es Crítica):
   - Agrega **Terminate** → Succeeded → mensaje: `Prioridad no es Crítica — sin acción`

3. En la **rama SÍ** (es Crítica) continúa con los pasos siguientes.

### Tarea 3.3 — Iniciar el proceso de aprobación

1. En la rama SÍ, agrega **"Start and wait for an approval"** (Approvals):

   | Campo | Valor |
   |---|---|
   | Approval type | Approve/Reject - First to respond |
   | Title | expresión: `concat('Solicitud Crítica: ', triggerOutputs()?['body/sit_titulo'])` |
   | Assigned to | Tu email (en producción sería el email del supervisor) |
   | Details | Ver abajo |
   | Item link | (opcional — URL al registro en Dataverse) |

2. Para el campo **Details**:
   ```
   Se ha marcado como Crítica la siguiente solicitud:

   Título: @{triggerOutputs()?['body/sit_titulo']}
   Descripción: @{triggerOutputs()?['body/sit_descripcion']}
   Fecha de solicitud: @{triggerOutputs()?['body/sit_fechasolicitud']}

   ¿Aprueba que esta solicitud tenga prioridad Crítica con SLA de 4 horas?
   ```

   > Esta acción **pausa el flujo** hasta que el aprobador responde. El flujo permanece en estado "Esperando aprobación" en el historial.

### Tarea 3.4 — Procesar la respuesta de aprobación

1. Después de la acción de aprobación, agrega **Control → Condición**:
   - **Valor izquierdo:** `Outcome` de la acción "Start and wait for an approval"
   - **Operador:** es igual a
   - **Valor derecho:** `Approve`

2. **Rama SÍ (Aprobado):**
   - Agrega acción **"Update a row"** (Dataverse):
     - **Table name:** Solicitudes
     - **Row ID:** `sit_solicitudid` del trigger
     - **sit_estado:** valor numérico de "En Proceso" (la solicitud aprobada pasa directamente a proceso)
   - Agrega **"Send an email (V2)"**:
     - **Para:** Tu email
     - **Asunto:** `Prioridad Crítica aprobada: ` + `sit_titulo`
     - **Cuerpo:** `La prioridad Crítica fue aprobada. La solicitud está en proceso.`

3. **Rama NO (Rechazado):**
   - Agrega **"Update a row"** (Dataverse):
     - **Row ID:** `sit_solicitudid` del trigger
     - **sit_prioridad:** valor numérico de "Alta" (revertir a Alta si se rechaza Crítica)
   - Agrega **"Send an email (V2)"**:
     - **Asunto:** `Prioridad revertida: ` + `sit_titulo`
     - **Cuerpo:**
       ```
       La solicitud @{triggerOutputs()?['body/sit_titulo']} fue revisada.
       Comentarios del aprobador: @{outputs('Start_and_wait_for_an_approval')?['body/responses'][0]['comments']}
       La prioridad fue revertida a Alta.
       ```

### Tarea 3.5 — Guardar y probar el flujo completo

1. Guarda el flujo.

2. En la Canvas App del Lab 03 o directamente en Dataverse, abre cualquier solicitud y cambia su prioridad a **Crítica** → guarda.

3. Revisa tu email — deberías recibir la solicitud de aprobación con los botones **Aprobar / Rechazar**.

4. Haz clic en **Aprobar** o **Rechazar** desde el email.

5. Verifica en Dataverse que el estado o prioridad cambió según tu respuesta.

6. Revisa el historial del flujo para ver el camino completo de ejecución.

### Validación del Ejercicio 3

- [ ] El flujo solo se dispara cuando cambia `sit_prioridad` (no en otros cambios)
- [ ] Solo actúa cuando la nueva prioridad es Crítica (las demás terminan sin acción)
- [ ] El email de aprobación llegó con los detalles de la solicitud
- [ ] Al aprobar, el estado de la solicitud cambia a "En Proceso" en Dataverse
- [ ] Al rechazar, la prioridad vuelve a "Alta" y llega email con los comentarios del aprobador

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flujo no se dispara al crear solicitudes | La conexión del trigger usa un usuario sin permisos en la tabla | Ve a **Conexiones** en Power Automate y verifica que la conexión Dataverse tiene permisos de lectura y escritura |
| Error 401 en la acción de email | La conexión de Outlook expiró | En el flujo, haz clic en la conexión y selecciona **Actualizar conexión** |
| La tabla HTML llega vacía en el reporte diario | El filtro OData tiene un error de sintaxis o valores numéricos incorrectos | Prueba el flujo manualmente y revisa el paso "List rows" — muestra cuántos registros retornó |
| La aprobación no llega al email | El campo "Assigned to" tiene un email inválido o fuera del tenant | Usa siempre un email del mismo tenant Microsoft 365 |
| El flujo de aprobación se dispara en bucle | Al actualizar el registro en Dataverse (paso de aprobación), se vuelve a disparar el trigger | Agrega una condición al inicio: si `sit_estado eq [valor de En Proceso]`, termina sin acción |
| `_sit_prioridad_label` está vacío en el email | El campo label no siempre se expone en el trigger directo | Usa `triggerOutputs()?['body/_sit_prioridad_label']` con el prefijo correcto |

---

## Checklist final

- [ ] Flujo 1 ("Notificar Nueva Solicitud") activo y dentro de la solución SIT
- [ ] Al crear una solicitud, el email de confirmación llega al destinatario
- [ ] Al crear una solicitud Crítica, el mensaje en Teams aparece en el canal configurado
- [ ] Flujo 2 ("Reporte Diario") se ejecuta manualmente sin errores y envía la tabla HTML
- [ ] El flujo 2 termina sin enviar email cuando no hay solicitudes pendientes
- [ ] Flujo 3 ("Aprobación Prioridad Crítica") solo actúa cuando `sit_prioridad` cambia a Crítica
- [ ] Al aprobar: estado cambia a "En Proceso" en Dataverse
- [ ] Al rechazar: prioridad vuelve a "Alta" con email de notificación

---

## Reto adicional

**Reto básico:** Modifica el Flujo 2 para que incluya en el reporte un conteo separado por prioridad: cuántas son Críticas, cuántas Altas, cuántas Medias. Usa la acción **"Filter array"** (Data Operations) para hacer subconjuntos.

**Reto intermedio:** Agrega al Flujo 1 un paso que, cuando la solicitud es de categoría "Accesos y Seguridad", agregue automáticamente el registro de solicitud a una tabla `sit_alerta_seguridad` en Dataverse para seguimiento especial.

**Reto avanzado:** Implementa un flujo de **recordatorio de escalamiento**: cada día, busca solicitudes con prioridad Alta o Crítica que llevan más de 2 días en estado "Nueva" sin asignar y envía un email de escalamiento al supervisor. Usa la expresión `addDays(utcNow(), -2)` para calcular la fecha de corte.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre un flujo **Automated**, **Instant** y **Scheduled**?
2. ¿Por qué se recomienda poner las acciones críticas dentro de un **Scope** con manejo de errores?
3. ¿Qué significa que la acción "Start and wait for an approval" **pausa** el flujo?
4. ¿Por qué los filtros OData en Dataverse usan valores numéricos para columnas Choice en lugar de texto?

---

## Limpieza del laboratorio

> Los flujos están vinculados a la solución. Para eliminarlos: Soluciones → SIT_SolicitudesInternas → selecciona los flujos → Quitar de la solución (o Eliminar para borrarlos definitivamente).

> ⚠️ Si eliminas los flujos, el Lab 09 seguirá funcionando — no depende de ellos. Consérvelos si quieres ver el sistema completo en acción.

---

## Siguiente laboratorio recomendado

➡️ **Lab 09 — Dataverse Avanzado: BPF, Rollups y Field Security**

**Por qué ir ahí:** Extiende el modelo de datos del Lab 02 con funcionalidades de nivel PL-200: columnas Rollup para métricas agregadas, Field Security Profiles para proteger datos financieros, y Business Process Flows para guiar el ciclo de vida de la solicitud.
