---
moduleId: 11
title: "Power Automate Avanzado"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 9
slug: "power-automate-avanzado"
---
### 🎯 Objetivo
Construir flujos empresariales robustos con manejo de errores, ramas paralelas, flujos hijos reutilizables, llamadas HTTP a APIs externas, y procesamiento de alto volumen con batches y paginación.

### 📖 Conceptos Clave
- **Scope:** contenedor de acciones en Power Automate que agrupa un conjunto de pasos lógicamente relacionados y permite aplicar manejo de errores colectivo (patrón try/catch). Si cualquier acción dentro del Scope falla, el Scope completo se marca como fallido, lo que permite al siguiente Scope (Catch) detectar el error. También mejora la legibilidad al organizar flujos complejos. Ejemplo: Scope `Try` contiene el proceso de negocio; Scope `Catch` contiene el registro del error y la notificación al admin.

- **Run After:** configuración por acción que define en qué estado(s) de la acción previa debe ejecutarse la acción actual. Los cuatro estados posibles son: `succeeded`, `failed`, `skipped` y `timedOut`. Por defecto todas las acciones tienen Run After = succeeded. Para implementar un Catch, configurar el Scope de Catch con Run After = failed + timedOut (desmarcando succeeded). Esto es lo que convierte un Scope en un bloque catch.

- **Parallel Branch:** rama de ejecución simultánea en Power Automate que permite que múltiples acciones se ejecuten al mismo tiempo en lugar de secuencialmente. Se agrega desde el botón "+" en el diseñador. El flujo espera a que TODAS las ramas terminen antes de continuar. Útil cuando acciones son independientes entre sí (ej. enviar Teams + enviar email + actualizar Dataverse). Reducción típica de tiempo: si cada acción toma 10s, 3 acciones secuenciales = 30s vs paralelas = ~12s.

- **Child Flow:** flujo de Power Automate diseñado para ser invocado desde otros flujos como una función reutilizable. Usa el disparador "When called from a Power Automate flow" y puede recibir parámetros de entrada y retornar valores de salida. Debe estar en la misma solución que el flujo padre. Ventajas: encapsula lógica de negocio reutilizable, facilita el mantenimiento (un solo punto de cambio), y reduce duplicación. Ejemplo: `DeterminarNivelAprobacion` llamado desde flujos de órdenes de compra, contratos y viáticos.

- **HTTP action:** acción de Power Automate que permite llamar cualquier API REST externa mediante los métodos GET, POST, PUT, PATCH, DELETE. Soporta configuración de headers, body, y autenticación (básica, OAuth, certificado). Es un conector Premium. La respuesta se parsea con la acción Parse JSON. Fundamental para integrar con sistemas externos que no tienen conector nativo en Power Platform. Ejemplo: llamar a `api.exchangerate-api.com` para obtener tasas de cambio en tiempo real.

- **Pagination (Paginación):** mecanismo para obtener más de 256 registros (límite por defecto de las acciones de lista) desde una fuente de datos. En acciones de Dataverse/SharePoint se activa en la configuración de la acción (Settings → Pagination → On, límite personalizado). Para APIs externas vía HTTP, se implementa manualmente siguiendo el token `@odata.nextLink` en la respuesta mientras exista. Ignorar la paginación lleva a pérdida silenciosa de datos en flujos que procesan listas grandes.

- **Do Until / Apply to Each:** dos patrones de iteración en Power Automate. `Do Until` repite un bloque de acciones hasta que una condición se cumpla (máx 60 iteraciones o 60 minutos por defecto, configurable). `Apply to Each` itera sobre cada elemento de un array/colección ejecutando el bloque interno. Apply to Each es secuencial por defecto pero soporta concurrencia (hasta 50 elementos en paralelo). Usar `Apply to Each` con Concurrency activado para grandes volúmenes reduce tiempos dramáticamente.

- **Variables de entorno (en flujos):** diferente a las Environment Variables de soluciones (que son de plataforma), las variables en flujos son de tipo Initialize Variable + Set Variable + Append. Tipos disponibles: String, Integer, Float, Boolean, Array, Object. El alcance es el flujo completo (no son locales a un Scope o Apply to Each). Para valores de configuración que cambian por ambiente, usar las Environment Variables de la solución, no variables de flujo.

- **Batch Processing:** técnica para agrupar múltiples operaciones en una sola llamada API en lugar de llamar N veces en un loop. La API de Dataverse soporta `$batch` que procesa hasta 1000 operaciones en una sola solicitud HTTP. En Power Automate se implementa con la acción HTTP hacia el endpoint `$batch` de la OData API. Reduce drásticamente el consumo de API calls (importantes para límites de licencia) y mejora el rendimiento en cargas masivas.

- **Compensation pattern:** patrón de diseño para deshacer operaciones ya completadas cuando un paso posterior falla, dado que Power Automate no tiene transacciones nativas. Se implementa con Scope + Run After (failed): si el flujo falla después de crear un registro, el Scope Catch ejecuta las acciones de compensación (eliminar el registro creado, notificar al usuario, registrar el error). Ejemplo: si falla la creación de la factura después de descontar el inventario, la compensación restaura el stock.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 11.1: Patrón Try-Catch con Scope
1. Nuevo flujo → Disparado desde Power Apps (instantáneo)
2. Agregar acción: **Scope** → Renombrar: `Try`
3. Dentro del Scope Try, agregar acciones de negocio:
    - Get Item de SharePoint (puede fallar)
    - Parsear JSON
    - Crear registro en Dataverse

4. Agregar segundo **Scope** → Renombrar: `Catch`
5. Configurar Run After del Scope Catch:
    - Clic en "..." del Scope Catch → "Configure run after"
    - Desmarcar "succeeded" → Marcar "failed" y "timed out"

6. Dentro del Scope Catch:
   ```
   Acción: Compose
   Inputs: {
     "error": @{actions('Scope_Try')['error']['message']},
     "timestamp": @{utcNow()},
     "flowRunId": @{workflow()['run']['name']}
   }
   
   Acción: Create item (SharePoint — tabla Errores)
   Descripcion: outputs('Compose_Error')
   
   Acción: Send email (Outlook)
   To: admin@empresa.com
   Subject: "Error en flujo: @{workflow()['tags']['flowDisplayName']}"
   Body: "Error: @{actions('Scope_Try')['error']['message']}"
   ```

#### Actividad 11.2: Flujo Hijo Reutilizable
1. Crear nuevo flujo → disparador: **"When a Power Automate flow is run"** (Child flow)
2. Definir inputs:
    - `solicitudId` (String)
    - `aprobadorEmail` (String)
    - `presupuesto` (Float)

3. Lógica del flujo hijo: calcular nivel de aprobación:
   ```
   Condition: presupuesto < 5000
     True → Response: nivel = "Supervisor"
   
   Condition: presupuesto < 50000
     True → Response: nivel = "Gerente"
   
   Default → Response: nivel = "Director"
   ```

4. Acción final: **Respond to a Power Automate flow** con output `nivel`
5. Guardar y agregar a la solución (importante para Child Flow)
6. En el flujo padre, agregar: **Run a Child Flow** → seleccionar el flujo creado
7. Pasar parámetros y usar la respuesta:
   ```
   // En flujo padre
   nivelAprobacion: outputs('Run_a_Child_Flow')?['nivel']
   ```

#### Actividad 11.3: Llamada HTTP a API externa
1. Flujo con trigger de recurrencia (cada hora)
2. Agregar acción **HTTP**:
   ```
   Method: GET
   URI: https://api.exchangerate-api.com/v4/latest/USD
   Headers:
     Accept: application/json
   ```

3. Agregar **Parse JSON** con el schema de respuesta:
   ```json
   {
     "type": "object",
     "properties": {
       "base": {"type": "string"},
       "rates": {
         "type": "object",
         "properties": {
           "EUR": {"type": "number"},
           "COP": {"type": "number"},
           "MXN": {"type": "number"}
         }
       }
     }
   }
   ```

4. Guardar tasas en Dataverse:
   ```
   // Apply to each - iterar sobre monedas de interés
   Crear/actualizar registro en tabla TasaCambio:
     sit_moneda: items('Apply_to_each')
     sit_tasa: body('Parse_JSON')?['rates'][items('Apply_to_each')]
     sit_fechaactualizacion: utcNow()
   ```

#### Actividad 11.4: Paginación para listas grandes
1. Trigger: Manual
2. Inicializar variable: `nextLink` = (vacío)
3. Inicializar variable: `totalRegistros` = 0
4. **Do Until:** `nextLink` = "DONE"
    - Acción HTTP con OData:
     ```
     URI: if(empty(variables('nextLink')), 
              'https://org.crm.dynamics.com/api/data/v9.2/sit_solicituds?$top=250',
              variables('nextLink'))
     ```
    - Parse JSON de la respuesta
    - Apply to each sobre `value` → procesar cada registro
    - Increment variable `totalRegistros`
    - Set Variable `nextLink`:
     ```
     if(contains(body('Parse_JSON'), '@odata.nextLink'),
        body('Parse_JSON')?['@odata.nextLink'],
        'DONE')
     ```

5. Compose resultado final: `Total procesados: @{variables('totalRegistros')}`

#### Actividad 11.5: Ramas paralelas para notificaciones
1. Flujo disparado cuando una solicitud es aprobada
2. Agregar acción → buscar "Parallel Branch"
3. **Rama 1:** Enviar Teams notification al solicitante
4. **Rama 2:** Enviar email al supervisor con reporte PDF
5. **Rama 3:** Actualizar registro en Dataverse con fecha aprobación
6. Las 3 ramas se ejecutan simultáneamente → reducción de tiempo de ~30s a ~10s

### 💼 Caso Real de Negocio
**Empresa:** Empresa importadora con flujos de aprobación de órdenes de compra  
**Problema:** El flujo de aprobación tardaba 4 minutos por orden, con frecuentes errores silenciosos cuando la API de proveedores fallaba.  
**Solución:** Patrón Try-Catch con registro de errores en SharePoint + notificación al admin. Flujo hijo reutilizable calcula nivel de aprobación (el mismo para órdenes de compra y contratos). Ramas paralelas reducen notificaciones de 3 steps secuenciales a 1 paso paralelo.  
**Resultado:** Tiempo de flujo reducido de 4 min a 45 seg. Tasa de errores silenciosos: 0%.

### ✅ Buenas Prácticas
- Siempre usar Scope + Run After para manejar errores en flujos de producción
- Child Flows deben estar en la misma solución que los flujos padre
- Limitar Apply to Each a máx 5000 iteraciones; usar Dataverse Batch API para volúmenes mayores
- Activar paginación en todas las acciones de lista que puedan retornar >256 registros
- Variables de entorno para URLs y configuraciones que cambian entre ambientes
- Usar nombres descriptivos en todas las acciones (evitar "HTTP 2", "Condition 3")

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Child Flow no aparece en la lista | No está en solución o no tiene el trigger correcto | Agregar a solución y verificar disparador "Child Flow" |
| HTTP 429 Too Many Requests | El flujo llama API sin throttling | Agregar Delay entre iteraciones en Apply to Each |
| Apply to Each toma horas | Procesamiento secuencial de miles de registros | Activar Concurrency en Apply to Each (máx 50 parallel) |
| Variables no persisten entre bucles | Se reinician en cada iteración | Usar Compose + Set Variable, no Initialize |

### 🧪 Criterios de Validación
- [ ] Flujo con Scope Try/Catch registra errores en SharePoint y envía alerta
- [ ] Child Flow de niveles de aprobación reutilizable funciona correctamente
- [ ] Flujo HTTP consume API externa y parsea JSON correctamente
- [ ] Paginación OData procesa listas de más de 250 registros sin perderse items
- [ ] Ramas paralelas ejecutan 3 notificaciones simultáneamente

---
