---
moduleId: 5
title: "Power Automate - Automatización Básica"
level: "basico"
certification: "PL-900"
estimatedMinutes: 25
slug: "power-automate-automatizacion-basica"
lastVerified: "2026-09"
---
*Duración: 2-3 semanas · Lectura: 10-12 min · Con práctica: 75-120 min (núcleo obligatorio); RPA y error handling avanzado pueden quedar para una segunda sesión*

### 🎯 Objetivo
Automatizar procesos de negocio mediante flujos cloud y de escritorio.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Crear un flujo automatizado que reacciona a una nueva Solicitud TI en Dataverse.
- Crear un flujo programado que envía un reporte diario sencillo.
- Leer el historial de ejecución para saber si un flujo corrió bien o dónde falló.

### 🔧 Qué queda para después (Profundización opcional)
- Aprobaciones, patrones Try/Catch con Scopes y Power Automate Desktop. Son muy útiles, pero no necesitas completarlos antes de tener tus primeros flujos funcionando.

### 📖 Conceptos Clave
- **Tipos de flujos**: Cloud (automated, instant, scheduled), Desktop, Business Process
- **Triggers**: When item created/modified, recurrence, manual, HTTP request
- **Actions**: CRUD operations, notifications, approvals, HTTP calls
- **Expresiones**: Funciones de transformación de datos
- **Condiciones**: If/else, switch, loops (Apply to each)
- **Variables**: Initialize, Set, Increment, Append to array
- **Error Handling**: Configure run after, Try-Catch pattern
- **Connections**: Service accounts vs user delegated
- **Concurrency**: Serial vs parallel execution
- **Scopes**: Agrupar acciones para manejo de errores

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

> **Cómo está organizado el Núcleo:** construyes dos flujos en tres bloques (el flujo automatizado, sus condiciones y su historial de ejecución, y el flujo programado). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu propio flujo. Cierras con un reto en el que ya no te digo los pasos. Las microprácticas no necesitan tenant; construir los flujos sí (tu ambiente Developer y la tabla del Módulo 2).

## 🧩 Microlección 1 — Tu primer flujo automatizado: trigger y acciones

**¿Qué vas a aprender?** Cómo un flujo automatizado se dispara solo cuando pasa algo (el trigger) y encadena acciones usando los datos del paso anterior.

**¿Por qué existe esto?** Si eliges mal el trigger, el flujo no corre o corre cuando no debe. Es el error más común del primer día, y todo lo demás (condiciones, correos, mensajes) depende de que el flujo arranque en el momento correcto.

**Ejemplo pequeño:** "When a row is added" arranca el flujo cuando alguien crea una Solicitud TI; "Get a row by ID" trae los datos de quien la creó; "Send an email" le confirma por correo.

**Ahora haz algo — micropráctica (6 min):** **[Elegir el disparador (trigger) correcto](/practica/ip-pa-001-elegir-trigger-correcto)**. Te da una necesidad de automatización y te pide elegir el trigger que la resuelve.

**Práctica real en tu entorno (25 min):** haz los Pasos 1 a 3 de abajo.

##### Práctica 5.1: Flujo Automated - Notificación de Solicitudes

*Trigger: Cuando se crea una Solicitud TI en Dataverse*

**Paso 1: Crear flujo**

1. Power Automate > Create > Automated cloud flow
2. Nombre: `Notificar Nueva Solicitud TI`
3. Trigger: "When a row is added, modified or deleted" (Dataverse)
    - Change type: Added
    - Table name: Solicitudes TI
    - Scope: Organization

**Paso 2: Obtener datos del solicitante**

1. Action: "Get a row by ID" (Dataverse)
    - Table: Contacts
    - Row ID: `Solicitante (Value)` del trigger (Dynamic content)

**Paso 3: Enviar email de confirmación**

1. Action: "Send an email (V2)" (Office 365 Outlook)
    - To: `Email` del Contact (paso anterior)
    - Subject: `Nueva solicitud registrada: {Título}`
    - Body (HTML):
   ```html
   <p>Estimado/a {nombre completo del Contact},</p>
   <p>Tu solicitud ha sido registrada exitosamente:</p>
   <ul>
     <li><strong>Título:</strong> {Título}</li>
     <li><strong>Categoría:</strong> {Categoría}</li>
     <li><strong>Prioridad:</strong> {Prioridad}</li>
     <li><strong>Fecha:</strong> {Fecha Solicitud}</li>
   </ul>
   <p>Te notificaremos cuando sea asignada.</p>
   ```

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| El trigger exacto que usaste: tabla, tipo de cambio (Change type) y alcance (Scope) | ___ |
| La acción que obtiene los datos del solicitante y qué valor del trigger usa como Row ID | ___ |
| El asunto exacto del correo que recibiste | ___ |

---

## 🧩 Microlección 2 — Condiciones y el historial de ejecución

**¿Qué vas a aprender?** Cómo una condición decide qué rama ejecuta el flujo, y cómo leer el Run history para saber qué pasó de verdad.

**¿Por qué existe esto?** Un flujo que falla en silencio es peor que no tener flujo. El Run history te dice qué acciones corrieron, cuáles fallaron y con qué mensaje; es lo que usas para comprobar lo que realmente pasó, no lo que creías que pasaba.

**Ejemplo pequeño:** si Prioridad = Crítica se envía un mensaje a Teams, y si no, un correo al grupo de TI. En el Run history cada acción aparece con una marca verde o una X roja.

**Ahora diagnostica — micropráctica (6 min):** **[Diagnosticar una condición invertida](/practica/ip-pa-003-corregir-condicion-invertida)**. Parte de un síntoma —el flujo manda a aprobación lo que no debía— y te pide arreglar la condición.

**Práctica real en tu entorno (20 min):** haz los Pasos 4 y 5 de abajo.

**Paso 4: Notificar a equipo TI**

1. Condition: Si Prioridad = "Crítica"
    - **Yes branch**: 
     - Action: "Post message in a chat or channel" (Teams)
     - Team: TI Team
     - Channel: Solicitudes Urgentes
     - Message: `🚨 SOLICITUD CRÍTICA: {Título} - {Descripción}`
    - **No branch**:
     - Action: Send email a grupo TI (listadistribucion@empresa.com)

**Paso 5: Probar flujo**

1. Guardar flujo
2. Crear nueva Solicitud TI desde Power Apps
3. Verificar en "Run history" del flujo
4. Validar emails y notificación Teams recibidos

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Qué rama de la condición se ejecutó cuando creaste una solicitud de prioridad Crítica | ___ |
| El estado que muestra el Run history para esa ejecución (Succeeded, Failed…) y cuánto tardó | ___ |
| Si alguna acción falló: el nombre exacto de la acción y el mensaje de error que viste | ___ |

---

## 🧩 Microlección 3 — El flujo programado: el reloj en vez del evento

**¿Qué vas a aprender?** Cómo un flujo se ejecuta por horario y consulta los datos con un filtro.

**¿Por qué existe esto?** Los reportes y los recordatorios no dependen de que pase algo: dependen del reloj. Y filtrar en el origen (al leer la tabla) trae solo lo necesario, en vez de traer todo y descartar después.

**Ejemplo pequeño:** una recurrencia diaria a las 8:00, "List rows" con un filtro de estado y un único correo con el resumen.

**Práctica real en tu entorno (30 min):** esta microlección no tiene micropráctica propia; la verificación es ejecutar el flujo a mano (Test) y revisar lo que devolvió.

##### Práctica 5.2: Flujo Scheduled - Reporte Diario

*Objetivo: Enviar resumen diario de solicitudes pendientes*

**Paso 1: Trigger recurrente**

1. Create > Scheduled cloud flow
2. Nombre: `Reporte Diario Solicitudes`
3. Trigger: Recurrence
    - Interval: 1
    - Frequency: Day
    - At: 08:00 AM
    - Time zone: (Tu zona horaria)

**Paso 2: Consultar solicitudes pendientes**

1. Action: "List rows" (Dataverse)
    - Table: Solicitudes TI
    - Filter rows: 
   ```
   cr123_estado eq 1 or cr123_estado eq 2
   // Nota: los Choice (OptionSet) se filtran por valor entero, no por label.
   // Para encontrar los valores: Power Apps > Tables > Solicitud TI > Columns > Estado > editar opciones — cada opción tiene un "Value" numérico.
   ```
    - Order by: `cr123_prioridad desc, cr123_fechasolicitud desc`

**Paso 3: Construir tabla HTML con resultados**

1. Action: "Initialize variable"
    - Name: `htmlTable`
    - Type: String
    - Value: 
   ```html
   <table border="1">
     <tr>
       <th>Título</th>
       <th>Categoría</th>
       <th>Prioridad</th>
       <th>Solicitante</th>
       <th>Días Abierta</th>
     </tr>
   ```

2. Action: "Apply to each" (loop)
    - Select output from previous step: `value` de List rows
    - Dentro del loop:
     - Action: "Append to string variable"
     - Name: `htmlTable`
     - Value:
     ```html
     <tr>
       <td>{titulo}</td>
       <td>{categoria}</td>
       <td>{prioridad}</td>
       <td>{solicitante nombre}</td>
       <td>{expression: days since fecha solicitud}</td>
     </tr>
     ```

3. Fuera del loop:
    - Action: "Append to string variable"
    - Value: `</table>`

**Paso 4: Enviar email con reporte**

1. Action: "Send an email (V2)"
    - To: gerente-ti@empresa.com
    - Subject: `Reporte Diario Solicitudes - {utcNow()}`
    - Body: 
   ```html
   <h2>Solicitudes Pendientes de Atención</h2>
   <p>Total: {length(outputs('List_rows')?['body/value'])} solicitudes</p>
   {htmlTable}
   ```

**Paso 5: Configurar condición de no envío si está vacío**

1. Antes del email, agregar Condition
    - Expression: `empty(outputs('List_rows')?['body/value'])`
    - Yes: Terminate (Success) con mensaje "No hay solicitudes"
    - No: Enviar email

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La hora y la zona horaria que configuraste en la recurrencia | ___ |
| El filtro exacto de "List rows" | ___ |
| Cuántas filas devolvió la ejecución de prueba y qué hizo el flujo con ese número | ___ |

---

## 🔁 Reto de transferencia — Aviso de solicitudes sin asignar, sin pasos

Esta vez no te digo los pasos: aplica lo que viste a un pedido nuevo.

> **Requerimiento:** el gerente de TI quiere que se le avise solo cuando haya solicitudes **sin técnico asignado desde hace más de 3 días**. Si no hay ninguna, no quiere recibir nada.
> **Criterios de aceptación:** (1) el flujo corre solo, una vez al día; (2) el filtro trae únicamente las solicitudes sin asignar y con más de 3 días, y no todas; (3) si no hay ninguna, el flujo termina sin enviar el correo.
> **Restricciones:** un solo flujo, y sin loops anidados. No uses el trigger "When a row is added": lo que buscas depende del paso del tiempo, no de un evento.
> **Pistas si te atoras:** la recurrencia y "List rows" están en la Práctica 5.2; la condición de "no enviar si está vacío" es el Paso 5 de esa práctica; recuerda que los valores Choice se filtran por su número, no por su nombre.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: avisar solo cuando haga falta](/practica/ip-pa-007-transferir-aviso-sin-asignar)**. Retoma el flujo de reporte diario pero con un pedido nuevo, y te pide decidir qué cambia.

**Si aún no tienes tenant:** escribe el filtro exacto que usarías, en qué punto del flujo evitas enviar el correo vacío y por qué un trigger de evento no sirve aquí.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El filtro exacto de "List rows" de tu flujo | ___ |
| En qué punto del flujo evitas enviar el correo cuando no hay solicitudes | ___ |
| Qué comprobaste en el Run history al probarlo (con y sin solicitudes que cumplan) | ___ |

#### 🔧 Profundización opcional

> Completa esta parte cuando ya tengas al menos un flujo automated y uno scheduled con ejecución exitosa en Run history. Si todavía estás luchando con conexiones o permisos, quédate en el núcleo y guarda evidencia.

##### Práctica 5.3: Flujo Instant - Aprobación de Cambios

*Objetivo: Proceso de aprobación para cambios de prioridad*

**Paso 1: Trigger manual**

1. Create > Instant cloud flow
2. Nombre: `Aprobar Cambio Prioridad`
3. Trigger: "Manually trigger a flow"
4. Agregar inputs:
    - Solicitud ID (text)
    - Nueva Prioridad (text)
    - Justificación (text)

**Paso 2: Obtener registro actual**

1. Action: "Get a row by ID" (Dataverse)
    - Table: Solicitudes TI
    - Row ID: `{Solicitud ID input}`

**Paso 3: Enviar aprobación**

1. Action: "Start and wait for an approval"
    - Approval type: Approve/Reject - First to respond
    - Title: `Cambio de Prioridad Solicitud: {título}`
    - Assigned to: gerente-ti@empresa.com
    - Details:
   ```
   Prioridad actual: {prioridad actual}
   Nueva prioridad: {Nueva Prioridad input}
   Justificación: {Justificación input}
   ```

**Paso 4: Procesar respuesta**

1. Condition: Si `Outcome = Approve`
    - **Yes**:
     - Action: "Update a row" (Dataverse)
       - Table: Solicitudes TI
       - Row ID: `{Solicitud ID}`
       - Prioridad: `{Nueva Prioridad input}`
     - Action: Send email de confirmación al solicitante
    - **No**:
     - Action: Send email de rechazo con comentarios del aprobador

**Paso 5: Integrar con Power Apps**

1. En Canvas App, agregar Button "Cambiar Prioridad"
2. OnSelect:
   ```javascript
   'Aprobar Cambio Prioridad'.Run(
       GallerySolicitudes.Selected.ID,
       DropdownNuevaPrioridad.Selected.Value,
       TextInputJustificacion.Text
   );
   Notify("Solicitud de cambio enviada", NotificationType.Success)
   ```

##### Práctica 5.4: Error Handling y Reintentos

*Mejorar flujo con manejo robusto de errores*

**Paso 1: Agregar Scope para acciones críticas**

1. En flujo existente, insertar "Scope" action
2. Mover acciones principales dentro del scope
3. Nombrar scope: `Main Process`

**Paso 2: Configurar reintentos**

1. Settings de cada acción HTTP o externa:
    - Retry Policy: Fixed interval
    - Count: 3
    - Interval: PT10S (10 segundos)

**Paso 3: Agregar Scope de error handling**

1. Nuevo Scope fuera del anterior: `Error Handler`
2. Configure run after del anterior: `has failed`, `has timed out`
3. Dentro:
    - Action: "Compose" con detalles del error:
   ```json
   {
     "errorMessage": "@{result('Main_Process')?['error']?['message']}",
     "timestamp": "@{utcNow()}",
     "flowRunId": "@{workflow()['run']['name']}"
   }
   ```
    - Action: "Send an email" a admin con detalles del error
    - Action: "Create a row" (Dataverse) en tabla de logs de errores

**Paso 4: Agregar notificación de éxito**

1. Nuevo Scope: `Success Handler`
2. Configure run after Main Process: `is successful`
3. Action: Log de éxito o métricas

##### Práctica 5.5: Power Automate Desktop (RPA)

*Automatizar tarea repetitiva en aplicación legacy*

**Escenario**: Extraer datos de Excel y cargar a Dataverse

**Paso 1: Instalar Power Automate Desktop**

1. Descargar desde power automate portal
2. Instalar y conectar con cuenta corporativa

**Paso 2: Crear flujo desktop**

1. New Desktop flow
2. Nombre: `Importar Solicitudes desde Excel`

**Paso 3: Acciones**

1. Action: "Launch Excel"
    - Excel instance: ExcelInstance
    - Document path: `C:\Datos\Solicitudes.xlsx`

2. Action: "Read from Excel worksheet"
    - Retrieve: All values from worksheet
    - Store to: ExcelData (datatable)

3. Action: "For each" (loop)
    - Iterate through: %ExcelData%
    - Current item: CurrentRow

4. Dentro del loop:
    - Action: "HTTP request" (POST a Dataverse API)
     - URL: `https://org.api.crm.dynamics.com/api/data/v9.2/cr123_solicitudesti`
     - Method: POST
     - Headers: 
       - Authorization: Bearer {token}
       - Content-Type: application/json
     - Body:
     ```json
     {
       "cr123_titulo": "%CurrentRow[0]%",
       "cr123_descripcion": "%CurrentRow[1]%",
       "cr123_categoria": "%CurrentRow[2]%"
     }
     ```

5. Action: "Close Excel"

**Paso 4: Integrar con Cloud Flow**

1. Crear Scheduled Cloud Flow
2. Action: "Run a flow built with Power Automate for desktop"
    - Desktop flow: Importar Solicitudes desde Excel
    - Run mode: Attended / Unattended (con VM)

### 💼 Caso Real de Negocio

**Escenario Completo**: Automatización de Onboarding de Empleados

**Flujos implementados**:

1. **Flujo: Nuevo Empleado Registrado**
    - Trigger: Crear registro en tabla "Empleado" (Dataverse)
    - Acciones:
     - Crear cuenta Azure AD (HTTP a Graph API)
     - Asignar licencias Microsoft 365
     - Crear buzón Exchange
     - Agregar a grupos de seguridad según departamento
     - Crear ticket en ServiceNow para equipo IT (laptop, accesos)
     - Enviar email bienvenida con credenciales temporales

2. **Flujo: Proceso de Aprobación de Equipamiento**
    - Trigger: Instant (llamado desde Model-Driven App)
    - Aprobar solicitud de laptop según presupuesto
    - Si aprobado: Crear orden de compra en ERP (SAP)
    - Notificar a compras y manager

3. **Flujo: Checklist de Onboarding**
    - Trigger: Scheduled (diario)
    - Consultar empleados con onboarding incompleto
    - Enviar recordatorios a RRHH y managers
    - Escalar si > 7 días sin completar

**Beneficios medibles**:

- Reducción 80% tiempo onboarding (de 5 días a 1 día)
- Eliminación errores manuales en creación cuentas
- Visibilidad completa del proceso para RRHH

### ✅ Buenas Prácticas

**Diseño de flujos**:

- Un flujo = una responsabilidad clara (no mega-flujos)
- Usar nombres descriptivos de acciones (no "Get a row", sino "Obtener Solicitante")
- Documentar con comments acciones complejas
- Usar Scopes para agrupar lógica relacionada

**Performance**:

- Evitar loops anidados (complejidad exponencial)
- Usar "Select" para transformar arrays en lugar de loops con Append
- Batch operations en Dataverse (bulk create/update)
- Paralelizar acciones independientes con "Scope" + "Configure run after"

**Seguridad**:

- Usar Service Accounts para conexiones de flujos críticos (no cuentas personales)
- Secretos en Azure Key Vault, no hardcoded
- Auditar flujos con acceso a datos sensibles
- Deshabilitar flujos no utilizados

**Mantenibilidad**:

- Versionar flujos antes de cambios mayores (Save As)
- Probar en ambiente DEV antes de producción
- Monitorear Run History y Analytics
- Documentar dependencias (flujos que llaman a otros)

**Error Handling**:

- Siempre configurar "Configure run after" en acciones críticas
- Logs de errores a tabla Dataverse o Application Insights
- Notificaciones proactivas de fallos
- Timeout adecuados (no dejar defaults de 1 hora)

### ⚠️ Errores Comunes

1. **Lo que ves:** el flujo falla con "Item not found".
    - **Causa**: Race condition o registro eliminado entre trigger y acción
    - **Solución**: Agregar verificación de existencia + error handling

2. **Lo que ves:** el mensaje "Dynamic content not available" al buscar un valor.
    - **Causa**: Referencia a acción dentro de scope/loop diferente
    - **Solución**: Usar outputs() expression o reestructurar

3. **Lo que ves:** el flujo se ejecuta una y otra vez, o hay muchas más ejecuciones de las esperadas.
    - **Causa**: Trigger "When modified" que actualiza el mismo registro
    - **Solución**: Agregar condición para evitar auto-trigger o usar columnas de control

4. **Lo que ves:** el error "Connection not valid" en ejecuciones automáticas.
    - **Causa**: Conexión con credenciales de usuario que cambió contraseña
    - **Solución**: Usar Service Account o renovar conexión

5. **Lo que ves:** el flujo se agota (timeout) dentro de un "Apply to each" con muchos registros.
    - **Causa**: Procesamiento serial de miles de items
    - **Solución**: Pagination + múltiples flujos o usar Concurrency control

6. **Lo que ves:** una expresión que no valida o devuelve un error de sintaxis.
    - **Causa**: Quotes incorrectas o funciones no existentes
    - **Solución**: Validar en Expression editor, consultar documentación

### 🧪 Criterios de Validación
- [ ] 3+ flujos cloud funcionales (automated, scheduled, instant)
- [ ] 1 flujo con aprobaciones implementado y probado
- [ ] Uso correcto de Apply to each con transformación de datos
- [ ] Error handling con Scopes configurado en flujo crítico
- [ ] Integración Power Apps ↔ Power Automate (llamar flujo desde app)
- [ ] Run history revisado e identificación de fallos/optimizaciones
- [ ] 1 flujo Desktop creado (opcional según infraestructura)
- [ ] Explicar diferencia entre triggers y cuándo usar cada uno
- [ ] Calcular costo estimado de ejecuciones de flujo

> Para avanzar como principiante, mínimo valida 2 flujos cloud: uno automated y uno scheduled. El flujo instant de aprobación, el flujo Desktop y el cálculo de costo son profundización.

### 📸 Evidencia para guardar
- Captura del diseñador del flujo automated con trigger de Dataverse.
- Captura del Run history con al menos una ejecución exitosa.
- Captura del email o mensaje enviado por el flujo.
- Si haces aprobaciones: captura del email de aprobación y del cambio aplicado en Dataverse.

### ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 05 · Power Automate — Notificación y Aprobación de Solicitudes](/labs/lab-05-automate-aprobacion)**

**Por qué:** el Lab 05 aterriza este módulo en tres flujos concretos sobre la solución SIT: notificación, reporte diario y aprobación de prioridad crítica. Además evita la ambigüedad más común en Dataverse: filtros OData y valores numéricos de columnas Choice.

**Qué evidencia guardar del lab:** historial exitoso de los 3 flujos, email de confirmación, mensaje de Teams para solicitud crítica y resultado de aprobar/rechazar una prioridad crítica.

---
