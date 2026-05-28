# NIVEL 2: INTERMEDIO — Power Platform & Dynamics 365
**Duración estimada:** 6–8 meses (part-time) | **Prerequisito:** NIVEL_1_BASICO.md completado  
**Certificaciones objetivo:** PL-200 (Power Platform Functional Consultant)

---

## Resumen del Nivel

En este nivel pasas de usuario avanzado a **desarrollador funcional**. Aprenderás a construir soluciones empresariales completas, automatizaciones complejas, informes DAX avanzados, y tus primeros componentes de código. Al completar este nivel podrás liderar implementaciones de mediana complejidad y prepararte para la certificación PL-200.

**Módulos de este nivel:** 9 módulos (Módulos 9–17)

| Módulo | Tema | Semanas |
|--------|------|---------|
| 9 | Dataverse Avanzado | 3–4 |
| 10 | Canvas Apps — Componentes y Reutilización | 3–4 |
| 11 | Power Automate Avanzado | 3–4 |
| 12 | Power BI — DAX Avanzado | 3–4 |
| 13 | JavaScript y PCF Básico | 4–5 |
| 14 | Conectores Personalizados | 2–3 |
| 15 | Copilot Studio — Introducción | 3–4 |
| 16 | Seguridad y Administración de Soluciones | 3–4 |
| 17 | Proyecto Integrador Nivel 2 | 4–5 |

---

## MÓDULO 9: Dataverse Avanzado

### 🎯 Objetivo
Diseñar modelos de datos empresariales complejos en Dataverse: relaciones polimórficas, columnas calculadas y rollup, reglas de negocio avanzadas, seguridad a nivel de campo, y auditoría completa de datos.

### 📖 Conceptos Clave
- **Tipos de relaciones:** 1:N, N:N nativa, N:N manual (tabla de intersección), Polimórfica (Lookup a múltiples tablas)
- **Columnas calculadas:** valores derivados computados en el servidor (no en cliente)
- **Columnas Rollup:** agregaciones automáticas desde registros hijos (Sum, Count, Min, Max, Avg)
- **Reglas de negocio:** lógica sin código que se ejecuta en cliente y/o servidor
- **Business Process Flow (BPF):** guía visual de procesos de múltiples etapas
- **Seguridad a nivel de campo (Field Security Profile):** restricción de lectura/escritura por columna
- **Auditoría de Dataverse:** registro de quién cambió qué y cuándo
- **Búsqueda de Dataverse (Relevance Search):** índice full-text con Azure Cognitive Search
- **Calculated vs Formula columns:** Formula usa Power Fx, Calculated usa sintaxis clásica
- **Duplicate Detection Rules:** reglas para detectar duplicados antes de guardar

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 9.1: Modelo de datos para sistema de proyectos
1. Crear tabla `Proyecto` con columnas:
   - `sit_nombre` (Texto, requerido)
   - `sit_estado` (Elección: Planificación/En Curso/Completado/Cancelado)
   - `sit_fechainicio` (Fecha y hora)
   - `sit_fechafin` (Fecha y hora)
   - `sit_presupuesto` (Moneda)
   - `sit_costoreal` (Rollup — Sum de `sit_costo` de tabla Tarea)
   - `sit_porcentajeavance` (Decimal, calculada)
   - `sit_responsable` (Lookup a SystemUser)

2. Crear tabla `Tarea`:
   - `sit_titulo` (Texto, requerido)
   - `sit_proyecto` (Lookup a Proyecto — relación 1:N)
   - `sit_asignado` (Lookup a SystemUser)
   - `sit_estado` (Elección: Pendiente/En Progreso/Bloqueada/Completada)
   - `sit_horas_estimadas` (Número entero)
   - `sit_horas_reales` (Número entero)
   - `sit_costo` (Moneda, calculada: `sit_horas_reales * sit_tarifa_hora`)

3. Configurar columna Rollup `sit_costoreal` en Proyecto:
   - Función de agregación: Sum
   - Tabla relacionada: Tarea (vía sit_proyecto)
   - Campo a agregar: sit_costo
   - Filtro: Estado = Completada

4. Crear tabla `Etiqueta` y relación N:N con `Proyecto` (nativa):
   - En diseñador de tablas → Relaciones → Agregar relación → Muchos a muchos
   - Tabla relacionada: Etiqueta
   - Esto crea tabla de intersección automáticamente

#### Actividad 9.2: Reglas de negocio avanzadas
1. Abrir tabla `Proyecto` → Reglas de negocio → Nueva regla

2. **Regla 1: Validar fecha fin > fecha inicio**
   ```
   Condición: sit_fechafin <= sit_fechainicio
   Acción: Mostrar mensaje de error en sit_fechafin
   Mensaje: "La fecha de fin debe ser posterior a la fecha de inicio"
   Alcance: Entidad (se ejecuta en servidor también)
   ```

3. **Regla 2: Bloquear edición si está Cancelado**
   ```
   Condición: sit_estado == "Cancelado"
   Acción: Bloquear campo sit_presupuesto
   Acción: Bloquear campo sit_nombre
   Alcance: Entidad
   ```

4. **Regla 3: Requerir responsable si En Curso**
   ```
   Condición: sit_estado == "En Curso"
   Acción: Establecer campo sit_responsable como obligatorio
   ```

#### Actividad 9.3: Field Security Profile
1. Ir a make.powerapps.com → Configuración → Seguridad → Perfiles de seguridad de campo
2. Crear perfil `Perfil Financiero Proyecto`
3. Agregar la columna `sit_presupuesto` con permiso: Lectura=Permitido, Actualizar=No permitido
4. Agregar la columna `sit_costoreal` con permiso: Lectura=Permitido, Actualizar=No permitido
5. Asignar perfil a rol `Jefe de Proyecto`
6. Probar con usuario del rol: la columna aparece como solo lectura

#### Actividad 9.4: Business Process Flow — Ciclo de vida de Proyecto
1. Power Automate → Business Process Flow → Nuevo
2. Nombre: `Ciclo de Vida del Proyecto`
3. Tabla: Proyecto
4. Etapas:
   - **Etapa 1: Definición**
     - Paso: Nombre del proyecto (obligatorio)
     - Paso: Presupuesto (obligatorio)
     - Paso: Responsable
   - **Etapa 2: Planificación**
     - Paso: Fecha inicio
     - Paso: Fecha fin
   - **Etapa 3: Ejecución**
     - Paso: Estado = En Curso (acción)
   - **Etapa 4: Cierre**
     - Paso: Costo real validado
5. Activar y probar en formulario Model-Driven

#### Actividad 9.5: Auditoría de Dataverse
1. Admin Center → Entorno → Configuración → Auditoría
2. Activar: Habilitar auditoría, Auditar acceso de usuario
3. En la tabla Proyecto → Administrar columnas de auditoría → Seleccionar: sit_estado, sit_presupuesto, sit_responsable
4. Hacer cambios en un registro
5. Ver auditoría: en el formulario → botón "Auditar historial" (panel derecho)
6. También en Admin Center → Registros de auditoría

### 💼 Caso Real de Negocio
**Empresa:** Constructora con 50 proyectos activos simultáneos  
**Problema:** Los Project Managers cambian presupuestos sin aprobación, causando pérdidas.  
**Solución:** Modelo Dataverse con Field Security Profile que bloquea edición de presupuesto salvo a Director de Operaciones. Business Rule valida fechas. Rollup de costos actualizado cada hora para dashboard en tiempo real. Auditoría completa genera reporte mensual para Contraloría.  
**Resultado:** Reducción de incidentes de presupuesto en 80% en primer trimestre.

### ✅ Buenas Prácticas
- Prefijo de publisher consistente en todas las columnas (`sit_`, `sse_`, nunca `new_`)
- Rollup columns se actualizan cada 12h por defecto; forzar actualización con botón en formulario o con workflow recurrente
- Limitar reglas de negocio a menos de 10 por tabla para rendimiento óptimo
- Field Security Profiles son aditivos: el perfil más permisivo gana cuando hay múltiples
- Siempre activar auditoría en tablas financieras y de RR.HH. desde el inicio
- Formula columns (Power Fx) son más expresivas pero solo lectura y no filtrables en FetchXML avanzado

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Rollup no actualiza | Columna tiene dependencia circular | Revisar que la fórmula no referencie la misma tabla padre |
| Regla de negocio no dispara en servidor | Alcance = Solo formulario | Cambiar alcance a "Entidad" para que aplique en API/Flujos |
| N:N nativa no aparece en Power Automate | Limitación del conector | Usar tabla de intersección manual para mayor control |
| Error "Duplicate detected" inesperado | Regla de duplicados muy amplia | Revisar criterios de la regla en Configuración → Detección de duplicados |

### 🧪 Criterios de Validación
- [ ] Modelo de datos Proyecto-Tarea creado con relación 1:N
- [ ] Rollup `sit_costoreal` calcula correctamente la suma de tareas completadas
- [ ] Regla de negocio de validación de fechas bloquea el guardado con mensaje claro
- [ ] Field Security Profile aplicado: usuario sin perfil no puede editar presupuesto
- [ ] Business Process Flow de 4 etapas funciona en el formulario Model-Driven
- [ ] Auditoría registra cambios en sit_estado y sit_presupuesto

---

## MÓDULO 10: Canvas Apps — Componentes y Reutilización

### 🎯 Objetivo
Construir una biblioteca de componentes reutilizables en Canvas Apps que elimine la duplicación de código, garantice consistencia visual y reduzca el tiempo de desarrollo en nuevas aplicaciones del 40% o más.

### 📖 Conceptos Clave
- **Component Library:** colección de componentes publicables y actualizables independientemente
- **Custom Component:** control Canvas con propiedades de entrada/salida definidas por el desarrollador
- **Input Properties:** datos que el componente recibe (equivalente a parámetros de función)
- **Output Properties / Custom Properties:** valores que el componente expone al padre
- **OnReset behavior:** lógica del componente cuando el padre llama `Reset(componente)`
- **Component Lifecycle:** creación, actualización de dependencias, publicación de librería
- **Named Formulas:** variables calculadas globales declaradas en App.OnStart con `=` (Power Fx)
- **With():** función para agrupar lógica compleja y mejorar legibilidad
- **Lazy Loading:** técnica para reducir tiempo de carga inicial de la app

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 10.1: Crear Component Library
1. make.powerapps.com → Aplicaciones → Bibliotecas de componentes → Nueva biblioteca
2. Nombre: `SIT Component Library`
3. Se abre el editor de Canvas con panel de componentes a la izquierda

#### Actividad 10.2: Componente Header Universal
1. En la biblioteca → Nuevo componente → Nombre: `cmpHeader`
2. Dimensiones: Width=App.Width, Height=60
3. Agregar propiedades de entrada:
   - `TituloApp` (Texto, default: "Mi Aplicación")
   - `ColorFondo` (Color, default: RGBA(0,120,212,1))
   - `ColorTexto` (Color, default: RGBA(255,255,255,1))
   - `MostrarBtnVolver` (Boolean, default: false)
4. Insertar Rectangle:
   ```
   Rectangle1.Fill: cmpHeader.ColorFondo
   Rectangle1.Width: Parent.Width
   Rectangle1.Height: Parent.Height
   ```
5. Insertar Label para el título:
   ```
   lblTitulo.Text: cmpHeader.TituloApp
   lblTitulo.Color: cmpHeader.ColorTexto
   lblTitulo.Size: 18
   lblTitulo.FontWeight: FontWeight.Bold
   lblTitulo.X: If(cmpHeader.MostrarBtnVolver, 60, 20)
   ```
6. Insertar Icon chevronLeft (visible condicionalmente):
   ```
   icoVolver.Visible: cmpHeader.MostrarBtnVolver
   icoVolver.Color: cmpHeader.ColorTexto
   icoVolver.OnSelect: Back()
   ```

#### Actividad 10.3: Componente Card de Estadística
1. Nuevo componente → `cmpStatCard`
2. Dimensiones: Width=200, Height=100
3. Propiedades de entrada:
   - `Titulo` (Texto, default: "Métrica")
   - `Valor` (Número, default: 0)
   - `Icono` (Texto, default: "calendar") — nombre del ícono de Fluent
   - `ColorAcento` (Color, default: RGBA(0,120,212,1))
4. Diseño del componente:
   ```
   // Rectangle de fondo con sombra simulada
   rectFondo.Fill: White
   rectFondo.BorderColor: RGBA(200,200,200,1)
   rectFondo.BorderThickness: 1
   
   // Barra de color superior
   rectAccento.Fill: cmpStatCard.ColorAcento
   rectAccento.Height: 4
   rectAccento.Width: Parent.Width
   
   // Número grande
   lblValor.Text: Text(cmpStatCard.Valor, "#,##0")
   lblValor.Size: 28
   lblValor.FontWeight: FontWeight.Bold
   lblValor.Color: RGBA(32,32,32,1)
   
   // Etiqueta debajo
   lblTitulo.Text: cmpStatCard.Titulo
   lblTitulo.Size: 12
   lblTitulo.Color: RGBA(96,96,96,1)
   ```

#### Actividad 10.4: Componente de Búsqueda con Debounce
1. Nuevo componente → `cmpSearchBox`
2. Propiedades de entrada:
   - `Placeholder` (Texto, default: "Buscar...")
3. Propiedades de salida (custom):
   - `TextoBusqueda` (Texto)
4. Agregar Timer para debounce:
   ```
   // Timer que dispara 500ms después de que el usuario deja de escribir
   tmrDebounce.Duration: 500
   tmrDebounce.AutoStart: false
   tmrDebounce.OnTimerEnd: UpdateContext({_textoBusqueda: txtBusqueda.Text})
   
   // TextInput
   txtBusqueda.OnChange: Reset(tmrDebounce); tmrDebounce.Start()
   txtBusqueda.HintText: cmpSearchBox.Placeholder
   
   // Custom Output property
   TextoBusqueda: _textoBusqueda
   ```

#### Actividad 10.5: Publicar y usar la librería
1. En la biblioteca → Guardar → Publicar
2. Abrir una app Canvas existente (del Módulo 5)
3. Insertar → Obtener más componentes → Librería: `SIT Component Library`
4. Importar `cmpHeader`, `cmpStatCard`, `cmpSearchBox`
5. Usar `cmpHeader` en cada pantalla:
   ```
   // En Screen1
   cmpHeader_1.TituloApp: "Panel de Solicitudes"
   cmpHeader_1.MostrarBtnVolver: false
   
   // En Screen2
   cmpHeader_2.TituloApp: "Detalle de Solicitud"
   cmpHeader_2.MostrarBtnVolver: true
   ```
6. Usar `cmpStatCard` para KPIs:
   ```
   // 4 tarjetas en horizontal con Gallery horizontal
   cmpStatCard_Total.Titulo: "Total Solicitudes"
   cmpStatCard_Total.Valor: CountRows(colSolicitudes)
   cmpStatCard_Total.ColorAcento: RGBA(0,120,212,1)
   ```

#### Actividad 10.6: Named Formulas para rendimiento
1. En App.Formulas (Property: Formulas, no OnStart):
   ```js
   // Named formulas — se evalúan lazy, no en OnStart
   TotalSolicitudes = CountRows(colSolicitudes);
   SolicitudesPendientes = CountRows(Filter(colSolicitudes, Estado = "Pendiente"));
   SolicitudesHoy = CountRows(
       Filter(colSolicitudes, DateValue(Text('Fecha Solicitud')) = Today())
   );
   UsuarioActual = User().FullName;
   ```
2. Usar en las tarjetas de estadística:
   ```
   cmpStatCard_Pendientes.Valor: SolicitudesPendientes
   ```

### 💼 Caso Real de Negocio
**Empresa:** Banco regional con 15 aplicaciones Canvas diferentes  
**Problema:** Cada app tiene su propio header, colores y estilos. Un cambio de branding requería actualizar 15 apps manualmente.  
**Solución:** Component Library con tema corporativo centralizado. Al actualizar el componente y publicar, todas las apps pueden aceptar la actualización en 1 clic. Reducción de tiempo de implementación de cambios visuales de 2 semanas a 2 horas.  
**Resultado:** Consistencia de marca 100%, ahorro de ~40 horas/mes en mantenimiento.

### ✅ Buenas Prácticas
- Una biblioteca por dominio/área de negocio, no una mega-librería global
- Las propiedades de salida deben ser simples (texto, número, booleano); evitar colecciones como output
- Documentar cada propiedad de input con el campo "Descripción" del editor de componentes
- Versionar las bibliotecas con comentarios de cambio antes de publicar
- Nunca modificar el componente directamente en la app — hacerlo en la librería y actualizarlo
- Named Formulas son preferibles a variables globales en App.OnStart para mejor rendimiento

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Componente no muestra cambios | Librería publicada pero app no actualizada | En la app: Insertar → Componentes → ícono de actualización |
| Output property siempre vacío | No se asignó `UpdateContext` o falta referencia correcta | Usar variable local dentro del componente y exponerla como property |
| App lenta con Named Formulas | Fórmula con delegación incompleta trae miles de registros | Asegurar que las fórmulas usen operaciones delegables |
| Error "circular dependency" | Named Formula referencia otra Named Formula circular | Romper la dependencia usando variable intermedia |

### 🧪 Criterios de Validación
- [ ] Component Library creada y publicada en el entorno de desarrollo
- [ ] Componente `cmpHeader` funciona con propiedades configurables de título y color
- [ ] Componente `cmpStatCard` muestra valor numérico formateado con acento de color
- [ ] `cmpSearchBox` implementa debounce de 500ms y expone `TextoBusqueda` como output
- [ ] App de prueba importa y usa los 3 componentes correctamente
- [ ] Named Formulas reducen las llamadas a CountRows en App.OnStart

---

## MÓDULO 11: Power Automate Avanzado

### 🎯 Objetivo
Construir flujos empresariales robustos con manejo de errores, ramas paralelas, flujos hijos reutilizables, llamadas HTTP a APIs externas, y procesamiento de alto volumen con batches y paginación.

### 📖 Conceptos Clave
- **Scope:** contenedor de acciones con manejo de errores (try/catch pattern)
- **Run After:** configurar qué estado previo activa la siguiente acción (success/failure/skipped/timeout)
- **Parallel Branch:** ramas que se ejecutan simultáneamente para optimizar tiempo
- **Child Flow:** flujo reutilizable llamado desde otros flujos (solution-aware)
- **HTTP action:** llamar cualquier API REST externa desde Power Automate
- **Pagination:** manejar resultados de más de 256 ítems con `@odata.nextLink`
- **Do Until / Apply to Each:** bucles con control de iteración y timeout
- **Variables de entorno:** separar configuración del flujo (URL, claves) por ambiente
- **Batch Processing:** agrupar operaciones para reducir llamadas a API
- **Compensation pattern:** deshacer acciones si un paso posterior falla

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

## MÓDULO 12: Power BI — DAX Avanzado

### 🎯 Objetivo
Dominar DAX avanzado: CALCULATE con múltiples filtros, contexto de filtro vs fila, funciones de inteligencia de tiempo, Row Level Security, y métricas de negocio complejas como cohortes y métricas móviles.

### 📖 Conceptos Clave
- **Contexto de filtro (Filter Context):** conjunto de filtros activos que afectan el cálculo de una medida
- **Contexto de fila (Row Context):** la fila actual durante iteración (SUMX, AVERAGEX, etc.)
- **Transición de contexto:** CALCULATE convierte contexto de fila en contexto de filtro
- **CALCULATE:** función central de DAX, modifica el contexto de filtro
- **ALL / ALLEXCEPT / ALLSELECTED:** eliminan filtros para cálculos de totales y porcentajes
- **FILTER:** itera tabla y retorna subconjunto — usar con cuidado (no siempre delegable)
- **RELATED / RELATEDTABLE:** navegar relaciones en contextos de fila y filtro
- **Funciones de tiempo:** DATEADD, TOTALYTD, SAMEPERIODLASTYEAR, DATESBETWEEN
- **RANKX:** ranking dinámico de elementos
- **Row Level Security (RLS):** filtrar datos según el usuario que visualiza el reporte
- **Tablas de calendario:** tabla de fechas requerida para inteligencia de tiempo

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 12.1: Tabla de calendario con DAX
1. En Power BI Desktop → Modelado → Nueva tabla:
   ```dax
   Calendar = 
   ADDCOLUMNS(
       CALENDAR(DATE(2020,1,1), DATE(2030,12,31)),
       "Año", YEAR([Date]),
       "Mes Número", MONTH([Date]),
       "Mes Nombre", FORMAT([Date], "MMMM"),
       "Mes Corto", FORMAT([Date], "MMM"),
       "Trimestre", "Q" & QUARTER([Date]),
       "Semana", WEEKNUM([Date]),
       "Día Semana", WEEKDAY([Date], 2),
       "Día Nombre", FORMAT([Date], "dddd"),
       "Es Fin de Semana", IF(WEEKDAY([Date],2) >= 6, TRUE(), FALSE()),
       "Año-Mes", FORMAT([Date], "YYYY-MM"),
       "Año Trimestre", FORMAT([Date], "YYYY") & " Q" & QUARTER([Date])
   )
   ```
2. Marcar tabla como "Tabla de fechas" → columna Date
3. Crear relación: `Calendar[Date]` → `Ventas[FechaVenta]`

#### Actividad 12.2: Medidas con CALCULATE
```dax
// Medida base
Total Ventas = SUM(Ventas[Monto])

// Con CALCULATE modificando filtro de categoría
Ventas Electrónica = 
CALCULATE(
    [Total Ventas],
    Productos[Categoria] = "Electrónica"
)

// Porcentaje del total (ignorar filtro de categoría)
% del Total = 
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALL(Productos[Categoria])),
    0
)

// % del total de la categoría padre (contexto de tabla visual)
% del Total Categoría = 
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALLSELECTED(Productos[Subcategoria])),
    0
)
```

#### Actividad 12.3: Inteligencia de tiempo
```dax
// Año hasta la fecha
Ventas YTD = TOTALYTD([Total Ventas], 'Calendar'[Date])

// Año anterior (mismo período)
Ventas Año Anterior = 
CALCULATE(
    [Total Ventas],
    SAMEPERIODLASTYEAR('Calendar'[Date])
)

// Crecimiento vs año anterior
YoY % = 
VAR VentasActual = [Total Ventas]
VAR VentasAnterior = [Ventas Año Anterior]
RETURN
DIVIDE(VentasActual - VentasAnterior, VentasAnterior, BLANK())

// Media móvil 3 meses
Media Movil 3M = 
CALCULATE(
    AVERAGE(Ventas[Monto]),
    DATESINPERIOD(
        'Calendar'[Date],
        LASTDATE('Calendar'[Date]),
        -3,
        MONTH
    )
)

// Acumulado mes a mes
Ventas MTD = TOTALMTD([Total Ventas], 'Calendar'[Date])

// Ventas últimos 12 meses rodantes
Ventas R12M = 
CALCULATE(
    [Total Ventas],
    DATESINPERIOD(
        'Calendar'[Date],
        LASTDATE('Calendar'[Date]),
        -12,
        MONTH
    )
)

// MoM (Month over Month) — crecimiento mes a mes
MoM % = 
VAR MesActual = [Total Ventas]
VAR MesAnterior = CALCULATE([Total Ventas], DATEADD('Calendar'[Date], -1, MONTH))
RETURN DIVIDE(MesActual - MesAnterior, MesAnterior, BLANK())
```

#### Actividad 12.4: Iteradores (AVERAGEX, SUMX)
```dax
// Tiempo promedio de resolución (en días) — solo registros con fecha de cierre
Tiempo Medio Resolución Días = 
AVERAGEX(
    FILTER(Solicitudes, NOT(ISBLANK(Solicitudes[Fecha Resolución]))),
    DATEDIFF(Solicitudes[Fecha Solicitud], Solicitudes[Fecha Resolución], DAY)
)

// Ingreso promedio ponderado por unidades vendidas
Precio Promedio Ponderado = 
SUMX(Ventas, Ventas[Cantidad] * Ventas[PrecioUnit]) / SUM(Ventas[Cantidad])
```
> **Nota:** AVERAGEX y SUMX iteran fila por fila (contexto de fila). Son más flexibles que AVERAGE/SUM pero más costosos en performance con tablas grandes. Úsalos cuando necesites calcular algo por fila antes de agregar.

#### Actividad 12.4: RANKX y Top N dinámico
```dax
// Ranking de clientes por ventas
Ranking Cliente = 
RANKX(
    ALL(Clientes[NombreCliente]),
    [Total Ventas],
    ,
    DESC,
    DENSE
)

// Solo mostrar Top N (usar con slicer de parámetro)
Top N Clientes = 
VAR TopN = SELECTEDVALUE(Parametro[N], 10)
RETURN
IF([Ranking Cliente] <= TopN, [Total Ventas], BLANK())

// Ventas de Top 10 clientes como % del total
% Top 10 Clientes = 
VAR Top10 = 
    TOPN(10, ALL(Clientes[NombreCliente]), [Total Ventas], DESC)
RETURN
DIVIDE(
    CALCULATE([Total Ventas], Top10),
    CALCULATE([Total Ventas], ALL(Clientes)),
    0
)
```

#### Actividad 12.5: Row Level Security (RLS)
1. Power BI Desktop → Modelado → Administrar roles
2. Crear rol `Vendedor`:
   ```dax
   // En tabla Vendedores, filtrar por email del usuario actual
   [Email] = USERPRINCIPALNAME()
   ```
3. Crear rol `Gerente Regional`:
   ```dax
   // En tabla Regiones, filtrar por regiones que gestiona el gerente
   [GerencEmail] = USERPRINCIPALNAME()
   ```
4. Verificar: Modelado → Ver como → seleccionar rol → ingresar email de prueba
5. Al publicar en Power BI Service → Dataset → Seguridad → Asignar usuarios a roles

#### Actividad 12.6: Análisis de cohortes
```dax
// Fecha de primera compra por cliente
Primera Compra = 
CALCULATE(
    MIN(Ventas[FechaVenta]),
    ALLEXCEPT(Ventas, Ventas[ClienteID])
)

// Cohorte = mes de primera compra
Cohorte = 
FORMAT(
    CALCULATE(
        MIN(Ventas[FechaVenta]),
        ALLEXCEPT(Clientes, Clientes[ClienteID])
    ),
    "YYYY-MM"
)

// Retención: clientes que compraron en X meses después de su primera compra
Clientes Retenidos = 
COUNTROWS(
    FILTER(
        VALUES(Ventas[ClienteID]),
        NOT ISBLANK([Total Ventas])
    )
)
```

### 💼 Caso Real de Negocio
**Empresa:** Cadena de retail con 200 tiendas y 50 vendedores  
**Problema:** Gerentes veían ventas de todas las regiones; vendedores necesitaban ver solo sus clientes.  
**Solución:** RLS con 3 roles (Director ve todo, Gerente Regional ve su región, Vendedor ve solo sus clientes). DAX time intelligence para comparativos YoY. Media móvil 3 meses para suavizar estacionalidad en el dashboard ejecutivo.  
**Resultado:** Adopción de Power BI aumentó de 20% a 85% porque los vendedores confían en que los datos son "solo de ellos".

### ✅ Buenas Prácticas
- Siempre crear tabla de fechas manualmente (no usar AutoDate/Time de Power BI)
- Usar VAR para cálculos intermedios — mejora legibilidad y rendimiento
- DIVIDE() en lugar de `/` para manejar divisiones por cero
- Documentar medidas complejas con descripción en el panel de propiedades
- Centralizar medidas en tabla de medidas dedicada (sin datos)
- RLS se aplica al Dataset en Service, no en Desktop — recordar publicar y asignar

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| TOTALYTD retorna BLANK | No hay relación activa con tabla Calendar | Verificar y activar la relación |
| RLS no filtra correctamente | Rol aplicado a tabla incorrecta | RLS filtra en cascada vía relaciones — aplicar en la tabla que tiene la columna de usuario |
| CALCULATE con FILTER muy lento | FILTER itera la tabla completa | Usar modificadores de filtro directos en CALCULATE (ej: Tabla[Col]="valor") |
| SUM y SUMX dan resultados distintos | Confusión de contexto de fila | SUMX itera fila a fila; SUM agrega directamente la columna |

### 🧪 Criterios de Validación
- [ ] Tabla de calendario creada con DAX y marcada correctamente
- [ ] Medida YoY% calcula crecimiento correcto con períodos comparables
- [ ] Media móvil 3 meses se actualiza dinámicamente con el filtro de fecha
- [ ] RLS funciona: vendedor ve solo sus datos, gerente ve su región
- [ ] RANKX muestra Top 10 clientes dinámicamente con slicer de parámetro
- [ ] % del total usa ALL/ALLSELECTED correctamente según el nivel de jerarquía

---

## MÓDULO 13: JavaScript y PCF Básico

### 🎯 Objetivo
Implementar lógica de cliente con JavaScript en formularios Model-Driven y crear tu primer Power Apps Component Framework (PCF) control con TypeScript que extiende las capacidades nativas de Dataverse.

### 📖 Conceptos Clave
- **Web Resources JavaScript:** scripts cargados en formularios Model-Driven, ejecutados en el cliente
- **Xrm.Page (legacy) vs formContext:** API moderna para manipular formularios (formContext obligatorio)
- **Execution Context:** parámetro que se pasa a los event handlers, da acceso a formContext
- **PCF (Power Apps Component Framework):** framework para crear controles personalizados con TypeScript/React
- **IInputs / IOutputs:** interfaces TypeScript que definen los campos de entrada y salida del PCF
- **ComponentFramework.WebApi:** acceso a Dataverse desde el PCF
- **pac pcf init / pac pcf push:** comandos CLI para inicializar y desplegar PCF
- **Virtual vs Standard PCF:** Virtual usa React del sistema (recomendado); Standard renderiza su propio DOM
- **Field vs Dataset PCF:** Field reemplaza un control de columna; Dataset reemplaza una subgrid/gallery
- **Manifest.xml:** describe el PCF, sus propiedades y tipo de control

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 13.1: JavaScript en formulario Model-Driven

1. Crear archivo `SolicitudFormHandler.js`:
```javascript
// Namespace pattern para evitar conflictos globales
var SolicitudFormHandler = SolicitudFormHandler || {};

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
    var presupuesto = formContext.getAttribute("sit_presupuesto").getValue();
    
    if (estado === 100000001 && (presupuesto === null || presupuesto <= 0)) {
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
    var esAprobado = estado === 100000001; // valor del option: Aprobado
    
    // Mostrar sección de implementación solo si está aprobado
    formContext.ui.tabs.get("tab_implementacion").setVisible(esAprobado);
    
    // Campo responsable requerido si está aprobado
    formContext.getAttribute("sit_responsable").setRequiredLevel(
        esAprobado ? "required" : "none"
    );
};
```

2. Subir Web Resource:
   - make.powerapps.com → Solución → Nuevo → Web Resource
   - Tipo: Script (JScript)
   - Nombre: `sit_/js/SolicitudFormHandler.js`
   - Subir el archivo JS
   
3. Registrar en formulario:
   - Formulario de Solicitud → Propiedades → Eventos
   - OnLoad → Agregar librería → seleccionar el Web Resource
   - Función: `SolicitudFormHandler.onLoad`
   - Pasar contexto de ejecución: ✅
   - OnSave → Misma librería → Función: `SolicitudFormHandler.onSave`

#### Actividad 13.2: Leer datos relacionados con WebApi desde JS
```javascript
SolicitudFormHandler.cargarHistorialCliente = function(executionContext) {
    var formContext = executionContext.getFormContext();
    var clienteRef = formContext.getAttribute("sit_cliente").getValue();
    
    if (!clienteRef || clienteRef.length === 0) return;
    
    var clienteId = clienteRef[0].id.replace(/[{}]/g, "");
    
    // Llamar Dataverse Web API desde JavaScript del formulario
    Xrm.WebApi.retrieveMultipleRecords(
        "sit_solicitud",
        "?$filter=_sit_cliente_value eq " + clienteId + 
        "&$select=sit_nombre,sit_estado,createdon" +
        "&$orderby=createdon desc&$top=5"
    ).then(function(result) {
        var historial = result.entities;
        var mensaje = "Últimas solicitudes del cliente: ";
        
        historial.forEach(function(s) {
            mensaje += "\n- " + s.sit_nombre + " (" + s["sit_estado@OData.Community.Display.V1.FormattedValue"] + ")";
        });
        
        formContext.ui.setFormNotification(mensaje, "INFO", "historial_cliente");
        
    }, function(error) {
        console.error("Error cargando historial:", error.message);
    });
};
```

#### Actividad 13.3: Crear primer PCF con TypeScript

1. Instalar herramientas:
   ```bash
   npm install -g microsoft-powerapps-cli
   # Verificar
   pac --version
   ```

2. Crear proyecto PCF:
   ```bash
   mkdir StatusBadgePCF && cd StatusBadgePCF
   pac pcf init --namespace SITControls --name StatusBadge --template field --framework react
   npm install
   ```

3. Editar `StatusBadge/index.tsx` (componente React que renderiza el control):
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

4. Editar `ControlManifest.Input.xml`:
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

5. Compilar y hacer push al entorno:
   ```bash
   npm run build
   pac auth create --url https://tuorg.crm.dynamics.com
   pac pcf push --publisher-prefix sit
   ```

6. Agregar el control al formulario:
   - Formulario → campo `sit_estado` → Componentes → Agregar componente → `StatusBadge`
   - Configurar propiedad: statusValue → Campo: sit_estado

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
- [ ] JavaScript muestra/oculta la pestaña de implementación según estado
- [ ] OnSave previene guardar y muestra notificación si falta presupuesto en estado Aprobado
- [ ] WebApi carga las últimas 5 solicitudes del cliente seleccionado
- [ ] PCF StatusBadge compila sin errores con `npm run build`
- [ ] PCF desplegado en el entorno y visible en el formulario Model-Driven
- [ ] Badge muestra colores correctos para cada estado de la opción

---

## MÓDULO 14: Conectores Personalizados

### 🎯 Objetivo
Crear y certificar conectores personalizados para APIs REST, integrar autenticación OAuth2 y API Key, y hacer que los conectores estén disponibles para Power Apps y Power Automate en toda la organización.

### 📖 Conceptos Clave
- **Custom Connector:** wrapper que permite usar cualquier API REST en Power Platform sin código
- **OpenAPI (Swagger) spec:** estándar para describir APIs REST que los conectores usan como base
- **Authentication types:** No auth, API Key, Basic, OAuth 2.0, Windows Auth
- **Triggers vs Actions:** los conectores pueden tener ambos (triggers basados en webhooks o polling)
- **Policy Templates:** transformaciones de request/response sin código (Set Header, Route Request, etc.)
- **Connector Certification:** proceso para publicar en el marketplace de Microsoft
- **Connection Reference:** referencia abstracta a una conexión en soluciones ALM
- **Throttling:** límites de llamadas por minuto/hora que el conector debe respetar
- **Dynamic Schema / Dynamic Values:** acciones que cargan opciones dinámicamente de la API

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 14.1: Connector desde definición OpenAPI
1. Escenario: conectar con API de facturación electrónica (ej: DIAN Colombia / SAT México)
2. Preparar el spec OpenAPI YAML:
   ```yaml
   openapi: "3.0.0"
   info:
     title: "API Facturación Electrónica"
     description: "Conector para envío y consulta de facturas electrónicas"
     version: "1.0.0"
   servers:
     - url: "https://api.facturacion.ejemplo.com/v1"
   paths:
     /facturas:
       post:
         operationId: EmitirFactura
         summary: "Emitir una nueva factura electrónica"
         requestBody:
           required: true
           content:
             application/json:
               schema:
                 $ref: '#/components/schemas/FacturaRequest'
         responses:
           '200':
             description: "Factura emitida exitosamente"
             content:
               application/json:
                 schema:
                   $ref: '#/components/schemas/FacturaResponse'
     /facturas/{id}:
       get:
         operationId: ConsultarFactura
         summary: "Consultar estado de una factura"
         parameters:
           - name: id
             in: path
             required: true
             schema:
               type: string
   components:
     schemas:
       FacturaRequest:
         type: object
         required: [numero, nit_emisor, total]
         properties:
           numero: {type: string}
           nit_emisor: {type: string}
           total: {type: number, format: float}
           items:
             type: array
             items:
               $ref: '#/components/schemas/ItemFactura'
       FacturaResponse:
         type: object
         properties:
           id: {type: string}
           cufe: {type: string}
           estado: {type: string}
           pdf_url: {type: string}
       ItemFactura:
         type: object
         properties:
           descripcion: {type: string}
           cantidad: {type: number}
           precio_unitario: {type: number}
   ```

3. Importar en Power Platform:
   - make.powerapps.com → Conectores personalizados → Nuevo → Importar desde archivo OpenAPI
   - Subir el YAML

#### Actividad 14.2: Configurar autenticación OAuth 2.0
1. En la sección "Seguridad" del conector:
   - Tipo de autenticación: OAuth 2.0
   - Proveedor de identidad: Azure Active Directory
   - ID de cliente: (App Registration ID en Azure AD)
   - Secreto de cliente: (secreto de la App Registration)
   - URL de autorización: `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize`
   - URL de token: `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`
   - Actualizar URL: (igual que URL de token)
   - Ámbito: `https://api.facturacion.ejemplo.com/.default`

2. Para API Key simple:
   - Tipo: Clave de API
   - Nombre del parámetro: `X-API-Key`
   - Ubicación: Header

#### Actividad 14.3: Policy Templates
1. En la acción `EmitirFactura` → "..." → Editar
2. Agregar política: "Set Header"
   - Header: `X-Tenant-ID`
   - Valor: `@connectionParameters('tenant_id')`
3. Agregar política: "Set Query Parameter"
   - Nombre: `version`
   - Valor: `v1`
4. Política "Route Request": redirigir llamadas de TEST a sandbox:
   ```
   Backend service URL: 
   @if(equals(connectionParameters('environment'), 'test'), 
       'https://sandbox.api.facturacion.com',
       'https://api.facturacion.com')
   ```

#### Actividad 14.4: Usar el conector en Power Automate
1. Nuevo flujo → Trigger: When a row is added (tabla Pedido en Dataverse)
2. Agregar acción → buscar "Facturación Electrónica" → EmitirFactura
3. Mapear campos:
   ```
   numero: @{triggerOutputs()?['body/sit_numeropedido']}
   nit_emisor: @{parameters('nit_empresa')}
   total: @{triggerOutputs()?['body/sit_total']}
   ```
4. Parsear respuesta y actualizar registro Dataverse con el CUFE generado

### 💼 Caso Real de Negocio
**Empresa:** Distribuidora con 500 facturas diarias  
**Problema:** El proceso de facturación electrónica requería exportar a Excel, subir al portal del gobierno, y copiar manualmente el código CUFE de vuelta al ERP.  
**Solución:** Custom Connector + Power Automate automatiza el envío en tiempo real. Trigger en Dataverse cuando pedido pasa a "Facturado". Respuesta CUFE guardada automáticamente. Proceso de 8 pasos manuales eliminado.  
**Resultado:** Cero errores de CUFE copiado incorrectamente. 4 horas de trabajo manual diario eliminadas.

### ✅ Buenas Prácticas
- Validar el spec OpenAPI en editor.swagger.io antes de importar
- Guardar el conector en una solución para portabilidad entre ambientes
- Usar Connection References (no conexiones directas) en flujos de soluciones
- Documentar cada acción y parámetro — el campo "Descripción" aparece en la UI de PA/Canvas
- Implementar retry logic en el flujo, no en el conector (separación de responsabilidades)
- Nunca hardcodear URLs de API en el conector — usar parámetros de conexión

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| 401 Unauthorized en producción | Secreto de cliente expirado | Rotar secreto en Azure AD y actualizar en el conector |
| Conector no aparece en solución importada | No se agregó como componente de la solución | Editar solución → Agregar existente → Conector personalizado |
| "Invalid connection" después de importar solución | Connection Reference no configurada en destino | Configurar Connection Reference en el ambiente destino |

### 🧪 Criterios de Validación
- [ ] Spec OpenAPI importado sin errores de validación
- [ ] Autenticación OAuth2 o API Key configurada y probada
- [ ] Acción principal ejecuta correctamente desde el probador del conector
- [ ] Conector disponible en Power Automate y Power Apps del entorno
- [ ] Flujo de automatización usa el conector y procesa la respuesta correctamente

---

## MÓDULO 15: Copilot Studio — Introducción

### 🎯 Objetivo
Crear un agente conversacional funcional en Copilot Studio que resuelve consultas de usuarios, escala a Power Automate para acciones sobre datos, y se integra en Teams y páginas web como canal de soporte automatizado.

### 📖 Conceptos Clave
- **Topic:** unidad de conversación — define cuándo se activa y qué responde el agente
- **Trigger Phrases:** frases de ejemplo que activan un topic (mínimo 5 variaciones)
- **Entities:** tipos de datos que el agente extrae de la conversación (Sistema: Fecha, Número, Email; Custom)
- **Slot Filling:** el agente pregunta automáticamente por variables de una entidad no proporcionadas
- **Variables:** datos almacenados durante la conversación (Global, Topic, System)
- **Condición (Condition):** bifurcación del flujo según el valor de una variable
- **Acción (Action):** llamada a Power Automate, conector, o Knowledge Source desde el topic
- **Respuestas Generativas (Generative Answers):** responde preguntas desde documentos/URLs sin topics explícitos
- **Escalamiento a Agente Humano:** transferir la conversación a un agente live (Omnichannel)
- **Canal:** donde se despliega el agente (Teams, Web, WhatsApp, etc.)
- **Knowledge Sources:** SharePoint, sitios web, o documentos que el agente consulta para respuestas

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 15.1: Crear el agente base
1. copilotstudio.microsoft.com → Crear → Nuevo agente
2. Configuración inicial:
   - Nombre: `Asistente IT SIT`
   - Descripción: "Ayudo con solicitudes de soporte técnico, consultas de estado y escalamiento"
   - Instrucciones: "Eres un asistente amigable de soporte IT. Respondes en español. Si no puedes resolver la consulta, ofreces escalar a un humano. No inventes información."
3. Conectar Knowledge Source:
   - Agregar → SharePoint → URL del sitio de documentación técnica
   - Esto habilita Respuestas Generativas automáticas

#### Actividad 15.2: Topic — Consultar estado de solicitud
1. Topics → Nuevo topic → En blanco
2. Nombre: `Consultar Estado Solicitud`
3. Trigger phrases (mínimo 8):
   ```
   - ¿Cuál es el estado de mi solicitud?
   - quiero saber mi solicitud
   - cómo va mi ticket
   - estado de mi caso
   - revisar mi solicitud número
   - buscar mi ticket
   - mi solicitud está lista
   - ¿ya resolvieron mi caso?
   ```

4. Nodo: **Mensaje**
   ```
   "Claro, voy a consultar el estado de tu solicitud. ¿Podrías proporcionarme el número de tu solicitud?"
   ```

5. Nodo: **Pregunta** — Variable: `varNumeroSolicitud`
   - Tipo de entidad: Número (o crear entidad personalizada con patrón regex `SOL-\d{5}`)
   - Texto: "¿Cuál es el número de tu solicitud? (Ejemplo: SOL-00123)"
   - Variable se guardará como: `Topic.NumeroSolicitud`

6. Nodo: **Acción** → Power Automate → seleccionar flujo `ObtenerEstadoSolicitud`
   - Input al flujo: `numeroSolicitud` = `Topic.NumeroSolicitud`
   - Output del flujo: `Topic.EstadoSolicitud`, `Topic.FechaUltimaActualizacion`

7. Nodo: **Condición**
   - Si `Topic.EstadoSolicitud` está vacío:
     - **Mensaje:** "No encontré una solicitud con ese número. ¿Podrías verificar el número?"
     - → Redireccionar a este mismo topic (nodo de pregunta)
   - De lo contrario:
     - **Mensaje con variables:**
       ```
       Tu solicitud **{Topic.NumeroSolicitud}** está en estado: **{Topic.EstadoSolicitud}**
       Última actualización: {Topic.FechaUltimaActualizacion}
       
       ¿Necesitas hacer algo más con esta solicitud?
       ```

8. Nodo: **Opciones rápidas:**
   - "Escalar al equipo" → redirigir a topic `Escalar Solicitud`
   - "Cancelar solicitud" → redirigir a topic `Cancelar Solicitud`
   - "No, gracias" → nodo fin de conversación

#### Actividad 15.3: Entidad personalizada — Categorías IT
1. Entidades → Nueva entidad → Lista cerrada
2. Nombre: `CategoríaIT`
3. Valores:
   ```
   Hardware       (sinónimos: computadora, equipo, impresora, mouse, teclado)
   Software       (sinónimos: aplicación, programa, instalación, licencia)
   Red            (sinónimos: internet, wifi, conectividad, vpn)
   Accesos        (sinónimos: contraseña, password, usuario, cuenta, login)
   Telefonía      (sinónimos: celular, teléfono, extensión)
   ```
4. Usar la entidad en topic `Crear Nueva Solicitud`:
   ```
   Pregunta: "¿Cuál es la categoría del problema?"
   Tipo: CategoríaIT (Slot Filling habilitado)
   ```

#### Actividad 15.4: Flujo de Power Automate para el agente
1. Nuevo flujo → Trigger: "When called from Copilot Studio"
2. Input: `numeroSolicitud` (Text)
3. Acción: List rows (Dataverse)
   ```
   Table: Solicitudes
   Filter: sit_numero eq '@{triggerBody()?['text']}'
   Select: sit_estado,sit_nombre,modifiedon
   Top: 1
   ```
4. Condition: `length(outputs('List_rows')?['body/value'])` mayor que 0
   - True: Set variable con datos del primer resultado
   - False: Set variable estado = "" (vacío)
5. Return values: 
   ```
   estado: if(empty(variables('varRegistro')), '', variables('varRegistro')?['sit_estado@OData.Community.Display.V1.FormattedValue'])
   fechaActualizacion: if(empty(variables('varRegistro')), '', formatDateTime(variables('varRegistro')?['modifiedon'], 'dd/MM/yyyy HH:mm'))
   ```

#### Actividad 15.5: Publicar en Teams
1. En Copilot Studio → Canales → Microsoft Teams → Publicar
2. Seguir wizard: nombre en Teams, icono, descripción
3. Desplegar para: solo yo (prueba) → luego toda la organización
4. En Teams: buscar el bot por nombre y probarlo
5. Probar con frases del trigger y verificar que el bot:
   - Responde a variaciones de las trigger phrases
   - Pide el número de solicitud si no se proporcionó
   - Consulta Dataverse vía Power Automate
   - Muestra el estado correctamente

### 💼 Caso Real de Negocio
**Empresa:** Empresa de 800 empleados con mesa de ayuda IT sobrecargada  
**Problema:** 70% de tickets eran consultas de estado que podía responder un bot. Los analistas perdían 4 horas diarias en responder "¿cómo va mi solicitud?".  
**Solución:** Copilot Studio con integración a Dataverse vía Power Automate. Knowledge Source con manual de usuario para preguntas frecuentes. Canal Teams para acceso desde donde trabajan los empleados.  
**Resultado:** 65% de consultas resueltas por el bot. Tiempo de respuesta: de 2 horas a instantáneo. Satisfacción usuarios: 4.2/5.

### ✅ Buenas Prácticas
- Mínimo 8 trigger phrases por topic, con variaciones naturales y con errores tipográficos comunes
- Variables Topic.X son locales al topic; usar Global.X para compartir entre topics
- Siempre agregar nodo de "no entendí" en el Fallback topic personalizado
- Probar con "Try it out" después de cada cambio antes de publicar
- Los flujos de Power Automate para Copilot Studio deben estar en soluciones
- Habilitar Generative Answers solo con Knowledge Sources confiables — verificar que no alucine

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Bot no activa el topic correcto | Trigger phrases muy similares a otro topic | Revisar frases solapadas en Topics → Analytics |
| Variable del flujo llega vacía | Output del flujo no mapeado correctamente | Verificar nombres de output en el flujo y en el nodo de acción |
| Slot filling pregunta dos veces | Entidad detectada pero variable no asignada | Verificar que la variable del slot filling apunta a la variable del nodo pregunta |
| Generative Answers inventa datos | Knowledge Source desactualizado o ambiguo | Actualizar KB y agregar instrucción "no inventes datos" en el prompt del sistema |

### 🧪 Criterios de Validación
- [ ] Agente creado con instrucciones de sistema en español
- [ ] Topic `Consultar Estado` activado con 8+ trigger phrases
- [ ] Slot filling solicita el número si no fue proporcionado en el mensaje inicial
- [ ] Flujo Power Automate consulta Dataverse y retorna estado correctamente
- [ ] Condición maneja el caso de solicitud no encontrada con mensaje de error amigable
- [ ] Agente publicado en Teams y probado con 5 escenarios distintos

---

## MÓDULO 16: Seguridad y Administración de Soluciones

### 🎯 Objetivo
Implementar una estrategia de ambientes múltiples (DEV → TEST → UAT → PROD), empaquetar soluciones correctamente con Connection References y Environment Variables, y establecer controles de seguridad de acceso basados en roles a nivel de la plataforma.

### 📖 Conceptos Clave
- **Solución administrada (Managed):** solución de solo lectura en destino — los usuarios no pueden modificarla directamente
- **Solución no administrada (Unmanaged):** solución editable — usada en DEV
- **Connection Reference:** abstracción de conexión en soluciones ALM (evita hardcodear conexiones)
- **Environment Variables:** pares clave-valor que varían entre ambientes (URL, email, configuraciones)
- **Solution Layers:** superposición de soluciones — la que se importó después puede sobreescribir
- **Managed Properties:** control de qué puede modificar el cliente en componentes de tu solución
- **Dependency tracking:** Dataverse rastrea qué componentes dependen de otros
- **Seguridad de ambiente:** Admin Center → políticas DLP, acceso de ambiente, restricciones
- **DLP Policy (Data Loss Prevention):** clasifica conectores en Business/Non-Business/Blocked
- **Security Roles:** conjuntos de permisos CRUD sobre tablas/entidades de Dataverse
- **Teams (Dataverse):** grupos de usuarios que comparten Security Roles
- **Principio de mínimo privilegio:** dar solo los permisos estrictamente necesarios

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 16.1: Estrategia de ambientes
1. Admin Center → Ambientes → Nuevo ambiente por cada capa:
   - `SIT-DEV`: Sandbox, región US o Latam, 1GB
   - `SIT-TEST`: Sandbox, misma región
   - `SIT-UAT`: Sandbox
   - `SIT-PROD`: Producción

2. Configurar cada ambiente:
   - Nombre de publisher: `SIT Consulting`
   - Prefijo: `sit`
   - Versión inicial de la solución: `1.0.0.0`

3. Crear la solución base en DEV:
   - make.powerapps.com (en entorno DEV) → Soluciones → Nueva
   - Nombre: `SIT Gestión de Proyectos`
   - Publisher: SIT Consulting (prefijo: sit)
   - Versión: `1.0.0.0`

#### Actividad 16.2: Connection References y Environment Variables
1. **Connection Reference** para Dataverse:
   - En la solución → Agregar existente → Referencia de conexión
   - Nombre: `CR_SIT_Dataverse_Principal`
   - Conector: Microsoft Dataverse
   
2. **Environment Variables:**
   - En la solución → Nuevo → Variable de entorno
   - `sit_EmailNotificaciones`: tipo Texto, valor DEV: `dev-notif@empresa.com`
   - `sit_UrlPortalEmpleados`: tipo Texto, valor: `https://dev-portal.empresa.com`
   - `sit_MaximoAprobacionAutomatica`: tipo Número decimal, valor: `5000`
   - `sit_ModoDebug`: tipo Boolean, valor: `true`

3. Usar Environment Variables en flujos:
   - En Power Automate → Acción → Obtener valor de variable de entorno
   - Seleccionar `sit_EmailNotificaciones`
   - Usar el valor en el campo "To" del correo

4. Al importar en TEST/PROD: las variables de entorno deben tener valores propios:
   - Importar solución → paso de "Connection References" → configurar cada conexión
   - Paso de "Environment Variables" → ingresar valores de TEST/PROD

#### Actividad 16.3: Security Roles personalizados
1. make.powerapps.com → Configuración → Seguridad → Roles de seguridad → Nuevo

2. **Rol: Jefe de Proyecto**
   ```
   Tabla Proyecto:
     Crear: SÍ (nivel Usuario)
     Leer: SÍ (nivel Organización)
     Escribir: SÍ (nivel Usuario — solo los propios)
     Eliminar: SÍ (nivel Usuario)
     Compartir: NO
   
   Tabla Tarea:
     Crear: SÍ (nivel Usuario)
     Leer: SÍ (nivel Organización)
     Escribir: SÍ (nivel Organización — puede editar tareas de su equipo)
     Eliminar: SÍ (nivel Usuario)
   
   Tabla Configuración Global:
     Leer: SÍ (nivel Organización)
     Crear/Escribir/Eliminar: NO
   ```

3. **Rol: Consultor (solo lectura)**
   ```
   Tabla Proyecto: Leer SÍ (Organización), resto NO
   Tabla Tarea: Leer SÍ (Organización), resto NO
   ```

4. Asignar rol a usuario:
   - Configuración → Seguridad → Usuarios → seleccionar usuario → Administrar roles

#### Actividad 16.4: DLP Policy
1. Admin Center → Políticas → Directivas de datos → Nueva directiva
2. Nombre: `Política Producción SIT`
3. Ambientes: seleccionar `SIT-PROD` (y UAT)
4. Clasificar conectores:
   - **Business (Negocio):** Microsoft Dataverse, SharePoint, Office 365, Teams, Outlook
   - **Non-Business:** Twitter, Facebook, Gmail, Dropbox
   - **Blocked:** HTTP (genérico), RSS, todos los conectores de redes sociales externas
5. Guardar → la política se aplica en minutos
6. Verificar: intentar crear flujo con conector de Gmail en PROD → debe ser bloqueado

#### Actividad 16.5: Exportar e importar solución
1. En DEV → Solución → Exportar:
   - Versión: `1.0.1.0`
   - Tipo: **Administrada** (para TEST/PROD)
   - Descargar el .zip

2. En TEST → Importar:
   - Importar archivo .zip
   - Seguir wizard: configurar Connection References, Environment Variables
   - Elegir: "Actualizar" si ya existe, "Crear" si es primera vez

3. Verificar en TEST:
   - La app aparece como Managed (ícono de candado — no editable)
   - Los flujos usan las Connection References del ambiente TEST
   - Las Environment Variables tienen los valores de TEST

### 💼 Caso Real de Negocio
**Empresa:** Firma de consultoría que vende soluciones Power Platform a clientes  
**Problema:** Cuando exportaban soluciones, los flujos fallaban en el cliente porque tenían la URL y credenciales del entorno de desarrollo hardcodeadas.  
**Solución:** Todas las URLs y emails movidos a Environment Variables. Todas las conexiones convertidas a Connection References. El wizard de importación guía al cliente para configurar sus propias credenciales. DLP policy estándar entregada como parte de la implementación.  
**Resultado:** Tiempo de implementación en nuevo cliente de 3 días a 4 horas. Cero tickets de "el flujo falla" por credenciales incorrectas.

### ✅ Buenas Prácticas
- Exportar siempre en modo Managed para TEST/UAT/PROD; nunca exportar Unmanaged a producción
- Versionar semánticamente: breaking changes = mayor, features = menor, fixes = patch
- Nunca editar componentes directamente en PROD — siempre DEV → solución → importar
- Connection References: una por tipo de servicio, no una por flujo
- DLP Policy: siempre bloquear HTTP genérico en producción si no es necesario
- Documentar los valores de Environment Variables de cada ambiente en un archivo seguro (no en el repo)

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| "Missing dependency" al importar | Un componente referenciado no está en la solución de destino | Agregar las dependencias a la solución o importarlas primero |
| Flujo falla en PROD con "Invalid connection" | Connection Reference no configurada | En el ambiente destino: Soluciones → Connection References → configurar |
| Environment Variable sin valor en PROD | No se configuró durante la importación | Ir a Variables de entorno → editar → agregar valor actual del ambiente |
| Solución managed no deja editar | Es el comportamiento correcto | Modificar en DEV y volver a importar como nueva versión |

### 🧪 Criterios de Validación
- [ ] 4 ambientes creados en Admin Center (DEV/TEST/UAT/PROD)
- [ ] Connection References configuradas para Dataverse y Office 365
- [ ] 4 Environment Variables creadas y usadas en al menos un flujo
- [ ] Security Role "Jefe de Proyecto" con permisos correctos asignado a usuario de prueba
- [ ] DLP Policy bloquea el conector HTTP en el ambiente de producción
- [ ] Solución exportada como Managed e importada exitosamente en TEST con wizard de configuración

---

## MÓDULO 17: Proyecto Integrador Nivel 2

### 🎯 Objetivo
Construir un sistema CRM-lite completo para gestión de clientes y oportunidades comerciales, integrando todos los conceptos del Nivel 2: modelo de datos avanzado en Dataverse, Canvas App con Component Library, Model-Driven App, Power Automate con Child Flows, Power BI con DAX avanzado, Copilot Studio, y ALM con 3 ambientes.

### 📖 Conceptos Clave
Este módulo no introduce conceptos nuevos — aplica y consolida todos los del Nivel 2 en un proyecto cohesivo.

**Stack del proyecto:**
- Dataverse: modelo de datos con 6 tablas relacionadas
- Canvas App: gestión de oportunidades con Component Library
- Model-Driven App: vista 360° del cliente para el equipo comercial
- Power Automate: flujo de aprobación con Child Flow + notificaciones paralelas
- Power BI: dashboard de pipeline comercial con RLS por vendedor
- Copilot Studio: bot para consultas de oportunidades desde Teams
- ALM: solución exportada de DEV e importada en TEST

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 17.1: Modelo de datos CRM-lite
Tablas a crear con prefijo `sit_`:

1. **`Cuenta` (Account):** usar tabla nativa Account de Dataverse
2. **`Oportunidad`:**
   ```
   sit_nombre (Texto, requerido)
   sit_cuenta (Lookup a Account)
   sit_monto_estimado (Moneda)
   sit_probabilidad (Número, 0-100)
   sit_monto_ponderado (Calculada: sit_monto_estimado * sit_probabilidad / 100)
   sit_etapa (Elección: Prospección/Calificación/Propuesta/Negociación/Cierre)
   sit_fechacierre (Fecha)
   sit_responsable (Lookup a SystemUser)
   sit_origen (Elección: Web/Referido/Campaña/Outbound)
   ```
3. **`Actividad Comercial`:** (extiende la tabla nativa Task o crea personalizada)
4. **`Propuesta`:**
   ```
   sit_oportunidad (Lookup a Oportunidad)
   sit_version (Número entero, auto-calculado)
   sit_monto (Moneda)
   sit_estado (Elección: Borrador/En Revisión/Aprobada/Rechazada)
   sit_archivo_url (URL — enlace al documento en SharePoint)
   ```
5. **`Contacto`:** usar tabla nativa Contact, con relación a Account
6. **`Competidor`:**
   ```
   sit_nombre (Texto)
   sit_oportunidad (Lookup a Oportunidad)  
   sit_ventaja (Texto multilínea)
   sit_desventaja (Texto multilínea)
   ```

Business Rules para Oportunidad:
- Si etapa = "Cierre" → sit_fechacierre es obligatoria
- Si probabilidad > 80 → mostrar alerta "Oportunidad caliente"
- Rollup: contar número de propuestas por oportunidad

#### Actividad 17.2: Canvas App — Gestión de Oportunidades
1. Importar componentes de la SIT Component Library (Módulo 10)
2. Pantallas de la app:
   - **Home:** KPIs con `cmpStatCard` (Total pipeline, Oportunidades esta semana, Tasa de cierre)
   - **Lista Oportunidades:** Gallery con `cmpSearchBox` para filtrado, filtro por etapa
   - **Detalle Oportunidad:** formulario de edición con secciones colapsables
   - **Nueva Oportunidad:** wizard de 3 pasos
   - **Pipeline Kanban:** Gallery horizontal con columnas por etapa

3. Implementar Kanban simple:
   ```js
   // Gallery con filtro por etapa para columna "Propuesta"
   galProposal.Items: Filter(
       colOportunidades,
       Etapa = "Propuesta"
   )
   
   // Drag-to-change-stage simulado con botones
   btnMoverSiguiente.OnSelect:
       Patch(
           'sit_oportunidades',
           galProposal.Selected,
           {sit_etapa: 'sit_etapa (Oportunidades)'.Negociación}
       );
       Refresh(colOportunidades)
   ```

4. Named Formulas para el dashboard:
   ```js
   TotalPipeline = Sum(colOportunidades, sit_monto_ponderado);
   OportunidadesCalientes = CountRows(Filter(colOportunidades, sit_probabilidad >= 80));
   TasaCierre = Divide(
       CountRows(Filter(colOportunidades, sit_etapa = "Cierre Ganado")),
       CountRows(colOportunidades),
       0
   )
   ```

#### Actividad 17.3: Power Automate — Flujo de aprobación de propuesta

**Child Flow: Determinar Aprobador**
```
Input: monto (Float), tipoCliente (String)
Logic:
  Si monto < 10000 → aprobador = "supervisor@empresa.com"
  Si monto < 100000 → aprobador = "gerente@empresa.com"
  Sino → aprobador = "director@empresa.com"
  Si tipoCliente = "Estratégico" → siempre director
Output: emailAprobador (String)
```

**Flujo Principal:**
1. Trigger: When a row is added/modified (Propuesta, sit_estado = "En Revisión")
2. Llamar Child Flow con monto y tipo de cliente
3. Scope Try:
   - Enviar Approval (Start and wait)
   - Parallel: notificar Teams al vendedor que "está en revisión"
4. If Approved:
   - Patch Propuesta: sit_estado = "Aprobada"
   - Parallel Branch 1: Email al cliente con resumen
   - Parallel Branch 2: Crear tarea de seguimiento en Dataverse
   - Parallel Branch 3: Notificación Teams al vendedor
5. If Rejected:
   - Patch: sit_estado = "Rechazada", guardar comments
   - Email al vendedor con retroalimentación
6. Scope Catch: log de error en SharePoint

#### Actividad 17.4: Power BI — Dashboard Pipeline Comercial
```dax
// Medidas principales
Pipeline Total = SUM(Oportunidades[sit_monto_ponderado])

Pipeline por Etapa = 
CALCULATE(
    [Pipeline Total],
    ALLEXCEPT(Oportunidades, Oportunidades[sit_etapa])
)

Tasa de Conversion = 
DIVIDE(
    COUNTROWS(FILTER(Oportunidades, Oportunidades[sit_etapa] = "Cierre Ganado")),
    COUNTROWS(FILTER(Oportunidades, Oportunidades[sit_etapa] <> "Prospección")),
    0
)

Pipeline 90 Días = 
CALCULATE(
    [Pipeline Total],
    DATESINPERIOD('Calendar'[Date], TODAY(), 90, DAY)
)

Tiempo Promedio Cierre = 
AVERAGEX(
    FILTER(Oportunidades, Oportunidades[sit_etapa] = "Cierre Ganado"),
    DATEDIFF(Oportunidades[sit_fechacreacion], Oportunidades[sit_fechacierre], DAY)
)
```

RLS: Vendedor solo ve sus oportunidades, Gerente ve su región, Director todo.

Visualizaciones:
- Funnel chart por etapa (pipeline waterfall)
- Scatter plot: probabilidad vs monto (bubble = tamaño del deal)
- Heatmap de actividad por día de la semana
- KPI cards con YoY comparativo

#### Actividad 17.5: Copilot Studio — Bot de Pipeline
Topic: `Consultar Mi Pipeline`
```
Trigger: "cuánto tengo en pipeline", "mis oportunidades", "cómo va mi mes"

Acción: Power Automate → ConsultarPipelineVendedor
  Input: email = System.User.PrincipalName
  Output: totalPipeline, cantidadOpor, mejorOpor

Mensaje:
"📊 Tu pipeline actual:
- Total ponderado: {Topic.totalPipeline}
- Oportunidades activas: {Topic.cantidadOpor}
- Mayor oportunidad: {Topic.mejorOpor}

¿Quieres ver el detalle de alguna oportunidad específica?"
```

#### Actividad 17.6: ALM — Empaquetar y desplegar
1. Agregar todos los componentes a la solución `SIT CRM Lite`:
   - Tablas Dataverse (Oportunidad, Propuesta, Competidor)
   - Canvas App
   - Model-Driven App
   - Flujos (principal + child flow)
   - Connection References
   - Environment Variables
   - Custom Connector (si aplica)
2. Verificar dependencias: Solución → Comprobación de solución
3. Exportar versión `1.0.0.0` como Managed
4. Importar en TEST → configurar Connection References y Environment Variables
5. Documentar en el README del proyecto: lista de componentes, ambientes, variables

### 💼 Caso Real de Negocio
**Empresa:** Empresa de servicios profesionales con 20 vendedores  
**Problema:** Pipeline en Excel, actualizaciones manuales, cero visibilidad para gerentes, propuestas aprobadas por WhatsApp.  
**Solución completa:** Este proyecto. Canvas App para vendedores en campo (mobile-friendly). Model-Driven App para gerentes. Power Automate formaliza las aprobaciones con audit trail. Power BI da visibilidad en tiempo real. Bot en Teams para consultas rápidas desde el celular.  
**Resultado:** Pipeline visible en tiempo real. Tiempo de aprobación de propuestas: de 3 días a 4 horas. Adopción del sistema: 90% en primer mes.

### ✅ Buenas Prácticas
- En proyectos integrados, diseñar el modelo de datos PRIMERO antes de construir cualquier app
- Usar la misma solución para todos los componentes — facilita el ALM
- Probar el flujo completo (end-to-end) en TEST antes de presentar al cliente
- El Copilot Studio bot debe tener un fallback topic siempre configurado
- Documentar las decisiones de diseño importantes (por qué tabla personalizada vs nativa)

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| App de Canvas pierde conexión al importar solución | Connection no agregada como Connection Reference | Reemplazar todas las conexiones directas por Connection References |
| Power BI no conecta a Dataverse en TEST | Las credenciales del gateway no tienen acceso al ambiente TEST | Configurar el dataset en Power BI Service con las credenciales correctas |
| Bot de Teams no refleja cambios publicados | Caché de Teams | Esperar 24h o usar cliente web de Teams |

### 🧪 Criterios de Validación del Proyecto Final
- [ ] Modelo de datos completo con 4+ tablas, relaciones 1:N y calculadas/rollup
- [ ] Canvas App con Component Library tiene las 5 pantallas funcionando (Home, Lista, Detalle, Nuevo, Kanban)
- [ ] Flujo de aprobación con Child Flow y 3 ramas paralelas funciona en TEST
- [ ] Dashboard Power BI con RLS: vendedor solo ve sus datos en Power BI Service
- [ ] Bot en Teams responde consultas de pipeline con datos reales de Dataverse
- [ ] Solución importada como Managed en TEST sin errores de dependencias
- [ ] End-to-end: crear oportunidad → aprobar propuesta → ver en Power BI → consultar en bot

---

## Criterios de Graduación — Nivel 2

Para avanzar al Nivel 3, debes cumplir **todos** los siguientes criterios:

### Criterios Técnicos
- [ ] Modelo de datos Dataverse con relaciones complejas, rollup y field security
- [ ] Component Library publicada con al menos 3 componentes reutilizables
- [ ] Flujo de Power Automate con Try/Catch, Child Flow y ramas paralelas
- [ ] Dashboard Power BI con DAX avanzado (time intelligence, RLS, RANKX)
- [ ] PCF básico desplegado y funcional en formulario Model-Driven
- [ ] Conector personalizado importado desde OpenAPI y usado en flujo
- [ ] Copilot Studio con 5+ topics, entidades personalizadas e integración PA
- [ ] Solución con Connection References y Environment Variables desplegada en 3 ambientes

### Criterios de Calidad
- [ ] Ningún componente usa el prefijo `new_` — todos usan el prefijo del publisher
- [ ] Todos los flujos tienen manejo de errores (ningún flujo puede fallar silenciosamente)
- [ ] La solución exportada como Managed se importa en TEST sin errores en primera vez
- [ ] El dashboard Power BI tiene tabla de fechas personalizada (no AutoDate/Time)

### Auto-evaluación de Dominio
Califica cada tema del 1 al 5:
- Dataverse relaciones y seguridad: ___/5
- Canvas Component Library: ___/5  
- Power Automate avanzado: ___/5
- DAX time intelligence: ___/5
- JavaScript en formularios Model-Driven: ___/5
- Conectores personalizados: ___/5
- Copilot Studio: ___/5
- ALM y soluciones: ___/5

**Promedio ≥ 3.5 en todos → Puedes avanzar al Nivel 3**

---

*Siguiente nivel: [NIVEL_3_AVANZADO.md](NIVEL_3_AVANZADO.md) — Arquitectura, Plugins C#, PCF avanzado, D365 CE, Integraciones Azure*
