---
moduleId: 5
title: "Power Automate - Automatización Básica"
level: "basico"
certification: "PL-900"
estimatedMinutes: 9
slug: "power-automate-automatizacion-basica"
---
*Duración: 2-3 semanas*

#### 🎯 Objetivo
Automatizar procesos de negocio mediante flujos cloud y de escritorio.

#### 📖 Conceptos Clave
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

#### 👨‍💻 Actividades Prácticas

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

#### 💼 Caso Real de Negocio

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

#### ✅ Buenas Prácticas

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

#### ⚠️ Errores Comunes

1. **Error**: Flujo falla con "Item not found"
    - **Causa**: Race condition o registro eliminado entre trigger y acción
    - **Solución**: Agregar verificación de existencia + error handling

2. **Error**: "Dynamic content not available"
    - **Causa**: Referencia a acción dentro de scope/loop diferente
    - **Solución**: Usar outputs() expression o reestructurar

3. **Error**: Loops infinitos o exceso de ejecuciones
    - **Causa**: Trigger "When modified" que actualiza el mismo registro
    - **Solución**: Agregar condición para evitar auto-trigger o usar columnas de control

4. **Error**: "Connection not valid" en ejecuciones automáticas
    - **Causa**: Conexión con credenciales de usuario que cambió contraseña
    - **Solución**: Usar Service Account o renovar conexión

5. **Error**: Timeout en "Apply to each" con muchos registros
    - **Causa**: Procesamiento serial de miles de items
    - **Solución**: Pagination + múltiples flujos o usar Concurrency control

6. **Error**: Expresiones con sintaxis incorrecta
    - **Causa**: Quotes incorrectas o funciones no existentes
    - **Solución**: Validar en Expression editor, consultar documentación

#### 🧪 Criterios de Validación
- [ ] 3+ flujos cloud funcionales (automated, scheduled, instant)
- [ ] 1 flujo con aprobaciones implementado y probado
- [ ] Uso correcto de Apply to each con transformación de datos
- [ ] Error handling con Scopes configurado en flujo crítico
- [ ] Integración Power Apps ↔ Power Automate (llamar flujo desde app)
- [ ] Run history revisado e identificación de fallos/optimizaciones
- [ ] 1 flujo Desktop creado (opcional según infraestructura)
- [ ] Explicar diferencia entre triggers y cuándo usar cada uno
- [ ] Calcular costo estimado de ejecuciones de flujo

---
