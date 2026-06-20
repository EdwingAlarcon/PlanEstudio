# 📝 Banco de Preguntas por Módulo (Formato Microsoft Learn / Certificación)

> Para experiencia tipo examen (navegación, cronómetro, puntaje), usa el **[Simulador de Evaluaciones](SIMULADOR_EVALUACIONES.md)**.  
> Este banco es para estudio y auto-evaluación con respuestas visibles.

**Leyenda:** ✅ = Respuesta correcta | ❌ = Distractor | Umbral de aprobación: **70%+**

---

## 🟢 Nivel 1 — Básico (Módulos 1–8) — PL-900

### Módulo 1: Introducción al Ecosistema Power Platform

**P1 (Selección única):** Una empresa necesita un almacén de datos relacional con relaciones, auditoría y seguridad por fila nativo de Power Platform. ¿Qué tecnología es la más adecuada?

- A) SharePoint Lists ❌ — No soporta relaciones complejas ni plugins de lógica de servidor
- B) **Microsoft Dataverse ✅** — Almacén nativo con relaciones, seguridad por fila, auditoría y extensibilidad
- C) Azure Blob Storage ❌ — Almacenamiento de archivos no estructurados, sin modelo relacional
- D) Excel en OneDrive ❌ — Sin seguridad por fila, sin lógica de servidor, sin relaciones reales

**P2 (Selección múltiple):** ¿Cuáles DOS acciones son responsabilidades del Power Platform Admin Center?

- A) **Crear y gestionar ambientes (Developer, Sandbox, Production) ✅**
- B) Escribir fórmulas Power Fx en Canvas Apps ❌ — Se hace en el editor de Power Apps Studio
- C) **Configurar Data Loss Prevention (DLP) Policies por ambiente ✅**
- D) Diseñar formularios de tabla en Dataverse ❌ — Se hace en el diseñador de tablas de make.powerapps.com

**P3 (Caso práctico):** Una empresa usa correos manuales para solicitudes internas. ¿Cómo resolverías esto con Power Platform?

> **Respuesta modelo:** Dataverse almacena las solicitudes con tablas y relaciones (Solicitud → Categoría → Usuario). Canvas App permite crear y consultar solicitudes desde el móvil. Power Automate notifica al aprobador, actualiza estados y escala si no hay respuesta en 24h. Power BI genera dashboard de métricas (tiempo de respuesta, volumen por tipo, SLA cumplido). La solución centraliza la información, elimina los correos dispersos y genera trazabilidad completa.

---

### Módulo 2: Dataverse — Fundamentos y Modelado Básico

**P1 (Selección única):** ¿Qué tipo de columna debes usar para relacionar cada Solicitud con su Solicitante en Dataverse?

- A) Texto de una línea ❌ — Solo guarda texto plano, no crea una relación real entre tablas
- B) Elección (Choice) ❌ — Lista de opciones predefinidas, no referencia registros de otra tabla
- C) **Lookup ✅** — Crea una relación 1:N real entre tablas, con navegación y seguridad hereditaria
- D) Moneda ❌ — Almacena valores monetarios, no referencias a registros de otras tablas

**P2 (Selección única):** ¿Por qué es crítico usar el prefijo de publisher (ej. `sit_`) en columnas personalizadas?

- A) Para que los campos aparezcan primero en el formulario ❌ — El orden depende del diseño del formulario
- B) Para mejorar el rendimiento de las consultas FetchXML ❌ — El prefijo no afecta el rendimiento
- C) **Para evitar conflictos de nombres con otras soluciones instaladas y garantizar un ALM limpio ✅**
- D) Para habilitar la auditoría en esa columna ❌ — La auditoría se activa por configuración, no por convención de nombre

**P3 (Caso práctico):** Diseña un modelo mínimo para "Mesa de Ayuda TI" con 2 tablas y 1 regla de negocio.

> **Respuesta modelo:** Tabla `sit_ticket` (sit_titulo texto requerido, sit_estado Elección: Nueva/Asignada/En Progreso/Resuelta/Cerrada, sit_prioridad Elección: Baja/Media/Alta/Crítica, sit_solicitante Lookup→Contact, sit_tecnico Lookup→SystemUser). Tabla `sit_categoria` (sit_nombre texto, sit_sla_horas número entero, sit_tecnico_default Lookup→SystemUser). Relación 1:N Categoría → Ticket. Business Rule: si sit_prioridad = Crítica, campo sit_justificacion_critica se vuelve obligatorio y sit_tecnico se asigna automáticamente al técnico senior definido en la categoría.

---

### Módulo 3: Power Apps Canvas — Primeras Aplicaciones

**P1 (Selección única):** ¿Qué propiedad de la Canvas App ejecuta lógica global de inicialización al abrirla por primera vez?

- A) OnVisible de Screen1 ❌ — Se ejecuta cada vez que esa pantalla es visible, no globalmente al inicio
- B) **App.OnStart ✅** — Se ejecuta una sola vez al iniciar la app, antes de mostrar cualquier pantalla
- C) App.OnLoad ❌ — Esta propiedad no existe en Canvas Apps
- D) Screen1.OnDisplay ❌ — Esta propiedad no existe; la equivalente es OnVisible

**P2 (Selección múltiple):** ¿Cuáles DOS controles son adecuados para listar y buscar registros en Canvas App?

- A) **Gallery ✅** — Muestra colecciones de registros con plantilla de elemento personalizable
- B) **Text Input + Filter() ✅** — Permite buscar registros filtrando la Gallery en tiempo real
- C) Toggle ❌ — Control booleano on/off; no es para listar datos
- D) Timer ❌ — Controla intervalos de tiempo; no muestra datos de registros

**P3 (Caso práctico):** Define el flujo lógico de una Canvas App para registro de solicitudes con validación.

> **Respuesta modelo:** App.OnStart: `ClearCollect(colCategorias, sit_categorias)`. Pantalla "Nueva Solicitud": `txtTitulo` (TextInput), `ddlCategoria` (Dropdown Items=colCategorias), `ddlPrioridad` (Dropdown). Botón Guardar → OnSelect: `If(IsBlank(txtTitulo.Text) || IsBlank(ddlCategoria.Selected), Notify("Completa los campos obligatorios", NotificationType.Error), Patch(sit_solicitudes, Defaults(sit_solicitudes), {sit_titulo: txtTitulo.Text, sit_categoria: ddlCategoria.Selected}); Navigate(scrLista, ScreenTransition.Fade))`. Pantalla Lista: Gallery con `Filter(sit_solicitudes, sit_estado <> "Cerrada")`.

---

### Módulo 4: Power Apps Model-Driven — Apps Basadas en Datos

**P1 (Selección única):** ¿Qué artefacto de una Model-Driven App define cómo se visualizan listas filtradas de registros?

- A) Formulario (Form) ❌ — Define la presentación y edición de un registro individual
- B) **Vista (View) ✅** — Define columnas, filtros y ordenamiento de una lista de registros
- C) Dashboard ❌ — Muestra agregaciones y gráficos; no es para listar registros individuales con filtros
- D) Business Rule ❌ — Define lógica automática; no define presentaciones de lista

**P2 (Selección única):** ¿Qué componente aplica lógica de validación y cambios automáticos sin necesidad de código?

- A) Plugin C# ❌ — Requiere desarrollo en C#; no es "sin código"
- B) Power Automate ❌ — Flujo externo al formulario; no actúa en tiempo real de edición por defecto
- C) JavaScript Web Resource ❌ — Requiere código JavaScript
- D) **Business Rule ✅** — Lógica declarativa visual que se ejecuta en el formulario (cliente) y/o servidor según el alcance configurado

**P3 (Caso práctico):** Diseña una Model-Driven App para seguimiento de casos de soporte TI.

> **Respuesta modelo:** Sitemap: sección Soporte con subáreas Casos (vista Abiertos, En Progreso, Cerrados por SLA), Colas, Knowledge Base. Formulario principal del Caso: sección Info General (título, categoría, prioridad, canal de entrada), sección Asignación (técnico responsable, cola), sección Resolución (descripción solución, fecha cierre). Business Process Flow: Recepción → Diagnóstico → Resolución → Cierre. Business Rule: si Prioridad=Crítica, campo Justificación se vuelve requerido y el campo SLA muestra "4 horas". Security Roles: Agente (ver/editar sus casos), Supervisor (ver todos), Admin (CRUD completo).

---

### Módulo 5: Power Automate — Automatización Básica

**P1 (Selección única):** ¿Qué elemento define el evento que inicia la ejecución de un flujo Cloud en Power Automate?

- A) Acción (Action) ❌ — Las acciones son pasos que ejecuta el flujo, no el evento de inicio
- B) Condición (Condition) ❌ — Lógica de ramificación dentro del flujo, no el inicio
- C) **Trigger (disparador) ✅** — Define cuándo y por qué evento se activa el flujo
- D) Variable ❌ — Almacena valores durante la ejecución; no inicia el flujo

**P2 (Selección única):** ¿Qué acción usarías en Power Automate para enviar un email cuando se crea un registro en Dataverse?

- A) **Send an email (V2) del conector Office 365 Outlook ✅** — Envía correos desde la cuenta del usuario o un shared mailbox
- B) Create a new record ❌ — Crea registros en Dataverse; no envía notificaciones
- C) Get a row by ID ❌ — Recupera un registro existente; no envía comunicaciones
- D) Initialize variable ❌ — Inicializa variables del flujo; no envía emails

**P3 (Caso práctico):** Define un flujo de aprobación para solicitudes internas con manejo de errores.

> **Respuesta modelo:** Trigger: "Cuando se agrega una fila" en sit_solicitud. Scope "Try": Start and wait for an approval (tipo Approve/Reject con comentarios). Si Approved: Update a row → sit_estado="Aprobada" + Send email al solicitante. Si Rejected: Update a row → sit_estado="Rechazada" + Send email con comentarios del aprobador. Scope "Catch" (Run after → Has failed): Create a row en sit_log_errores + Send email al administrador con el error. Timeout: si no hay respuesta en 48h, flujo recuerda al aprobador con un email automático.

---

### Módulo 6: Power BI — Reportes y Dashboards Básicos

**P1 (Selección única):** ¿Qué modelo de datos se recomienda para analítica escalable en Power BI?

- A) Modelo plano (una sola tabla con todos los datos) ❌ — Genera redundancia masiva y DAX complejo e ineficiente
- B) Copo de nieve (dimensiones normalizadas en múltiples niveles) ❌ — Más complejo y con peor rendimiento en DAX que el estrella
- C) **Modelo estrella (tablas de hechos + dimensiones desnormalizadas) ✅** — Óptimo para DAX, rendimiento y mantenibilidad
- D) Relaciones circulares entre tablas ❌ — Power BI no permite relaciones circulares en el modelo

**P2 (Selección múltiple):** ¿Cuáles DOS visuales son más útiles para seguimiento de KPIs operativos?

- A) **Tarjeta (Card) ✅** — Muestra un único valor numérico clave (Total Tickets Abiertos: 47)
- B) **Gráfico de barras agrupadas ✅** — Compara categorías y facilita identificación de anomalías
- C) Mapa de árbol (Treemap) ❌ — Útil para proporciones jerárquicas; difícil de leer para seguimiento de KPIs
- D) Nube de palabras (Word Cloud) ❌ — Para análisis de texto; no sirve para métricas numéricas operativas

**P3 (Caso práctico):** Diseña un dashboard para tickets de TI con métricas de volumen, prioridad y tiempo de resolución.

> **Respuesta modelo:** Row 1 (KPIs): Cards con Total Tickets, Tickets Abiertos, Tiempo Promedio Resolución (horas), % SLA Cumplido. Row 2: Gráfico de barras (tickets por categoría), Gráfico de líneas (tendencia semanal creados vs resueltos). Row 3: Tabla Top 10 tickets más antiguos sin resolver (con semáforo de prioridad). Slicers: Período (semana/mes/trimestre), Técnico, Prioridad. RLS: cada técnico ve solo sus tickets; supervisor ve todos. Actualización programada: cada hora. Alerta: notificación si Tickets Abiertos > 50.

---

### Módulo 7: Fundamentos de Power Fx y Expresiones

**P1 (Selección única):** ¿Qué función Power Fx usarías para obtener un único registro que cumpla una condición?

- A) Filter() ❌ — Retorna una tabla (todos los registros que cumplen la condición); no uno solo
- B) **LookUp() ✅** — Retorna el primer registro que cumple la condición como un registro individual (no tabla)
- C) Collect() ❌ — Agrega registros a una colección en memoria; no busca registros
- D) Patch() ❌ — Crea o actualiza registros; no los recupera para lectura

**P2 (Selección única):** ¿Qué función Power Fx crea o actualiza un registro directamente en Dataverse desde Canvas App?

- A) SubmitForm() ❌ — Solo funciona con controles Form asociados a un origen de datos; no es para Dataverse directo
- B) Set() ❌ — Establece variables globales en memoria; no persiste datos en Dataverse
- C) **Patch() ✅** — Crea o actualiza registros directamente en cualquier origen de datos incluyendo Dataverse
- D) Collect() ❌ — Agrega registros a colecciones locales en memoria; no persiste en Dataverse

**P3 (Caso práctico):** ¿Cómo implementas la validación "impedir guardar si Prioridad está vacía" en Canvas App?

> **Respuesta modelo:** En la propiedad `OnSelect` del botón `btnGuardar`: `If(IsBlank(ddlPrioridad.Selected.Value) || IsBlank(txtTitulo.Text), Notify("Completa Título y Prioridad antes de guardar", NotificationType.Error), Patch(sit_solicitudes, Defaults(sit_solicitudes), {sit_titulo: txtTitulo.Text, sit_prioridad: ddlPrioridad.Selected.Value, sit_solicitante: LookUp(sit_solicitantes, sit_email = User().Email)}); Back())`. Alternativamente: `UpdateContext({mostrarErrores: true})` y mostrar un `Label` de error condicionalmente cuando `mostrarErrores = true`.

---

### Módulo 8: Primer Proyecto Integrado

**P1 (Selección única):** En una solución integrada de Power Platform, ¿por qué el modelo de datos debe diseñarse antes de crear apps y flujos?

- A) Porque Power Apps no funciona hasta que existan las tablas de Dataverse ❌ — Técnicamente puede crear una app primero
- B) Porque Power Automate requiere que todas las tablas existan antes de configurar triggers ❌
- C) **Porque un modelo de datos incorrecto es el error más costoso y difícil de corregir — afecta apps, flujos, reportes y plugins ✅**
- D) Porque Microsoft certifica el modelo de datos antes de aprobar el desarrollo ❌ — No existe este proceso

**P2 (Selección única):** ¿Qué tipo de solución debes exportar para desplegar a producción?

- A) Unmanaged ❌ — Permite edición directa en producción y genera deriva entre DEV y PROD
- B) **Managed ✅** — Protege componentes de edición directa en destino; garantiza consistencia con el origen
- C) Clone ❌ — No existe este tipo de exportación de soluciones en Power Platform
- D) Default ❌ — La Default Solution no es un artefacto de despliegue; es el contenedor de elementos sin solución

**P3 (Caso práctico):** Diseña la arquitectura extremo a extremo para un sistema de gestión de incidencias internas.

> **Respuesta modelo:** Dataverse: tablas `sit_incidencia` (Título, Tipo, Prioridad, Estado, Responsable, Adjuntos), `sit_categoria` (SLA, Responsable default), `sit_historial` (comentarios cronológicos). Security Roles: Reportante (crear, ver propias), Técnico (ver asignadas, editar), Supervisor (ver todas, reasignar). Canvas App (móvil): crear y seguir incidencias propias. Model-Driven App (escritorio): gestión completa para técnicos con BPF 4 etapas. Power Automate: notificación al crear, escalación a supervisor si sin respuesta en 4h, notificación al cerrar. Power BI: SLA por categoría, volumen por tipo, tiempo promedio. Todo en solución con prefijo `sse_`, Connection References y Environment Variables.

---

## 🔵 Nivel 2 — Intermedio (Módulos 9–17) — PL-200

### Módulo 9: Dataverse Avanzado

**P1 (Selección única):** ¿Qué tipo de columna de Dataverse agrega automáticamente valores (Sum/Count/Avg) desde registros hijos relacionados?

- A) Columna calculada (Calculated column) ❌ — Calcula valores del mismo registro o del padre con RELATED; no de registros hijos
- B) Formula column (Power Fx) ❌ — Calcula expresiones on-the-fly; no agrega de registros hijos y no es filtrable en OData
- C) **Columna Rollup ✅** — Agrega valores desde registros hijos (Sum, Count, Avg, Min, Max); se recalcula cada hora automáticamente
- D) Columna de búsqueda (Lookup) ❌ — Tipo de relación; no un tipo de columna calculada

**P2 (Selección múltiple):** ¿Cuáles DOS mecanismos de Dataverse restringen acceso a datos específicos?

- A) **Field Security Profile ✅** — Restringe lectura/creación/actualización de columnas específicas a perfiles de usuario
- B) Business Process Flow ❌ — Guía el proceso de negocio; no es un mecanismo de seguridad de datos
- C) **Security Roles con Business Units (Row-Level Security) ✅** — Controla qué registros puede ver cada usuario según su unidad de negocio
- D) Filter() en Canvas App ❌ — El filtro visual NO es seguridad real; el dato sigue accesible por API directa

**P3 (Caso práctico):** ¿Cómo auditarías y restringirías la edición del presupuesto en una tabla de proyectos?

> **Respuesta modelo:** Field Security Profile "Perfil Financiero": lectura permitida para todos, escritura en `sit_presupuesto` solo para el rol "Director de Operaciones". Activar auditoría en ambiente → activar en tabla `sit_proyecto` → seleccionar columnas `sit_presupuesto` y `sit_estado` para auditar. En el formulario del proyecto, el historial de auditoría muestra quién cambió el presupuesto, cuándo, desde qué valor y hacia qué valor. Business Rule complementaria: bloquear edición de `sit_presupuesto` si `sit_estado` = "Cancelado" mediante regla de alcance "Entidad".

---

### Módulo 10: Canvas Apps — Componentes y Reutilización

**P1 (Selección única):** ¿Cuál es la ventaja clave de una Component Library respecto a componentes definidos directamente en la app?

- A) Los componentes de Library cargan más rápido en dispositivos móviles ❌ — El rendimiento es equivalente
- B) Los componentes de Library no requieren publicación para usarse ❌ — Sí requieren publicación de la Library
- C) **Permiten actualizar el componente una sola vez y que todas las apps consumidoras puedan aceptar la actualización sin editar cada app ✅**
- D) Los componentes de Library pueden usar más tipos de propiedades que los in-app ❌ — Ambos tienen las mismas capacidades de propiedades

**P2 (Selección única):** ¿Qué tipo de variable en Canvas App es específica de una pantalla y no persiste en otras?

- A) Variable global (Set) ❌ — Persiste en toda la app mientras está activa
- B) **Variable de contexto (UpdateContext) ✅** — Solo existe en la pantalla que la creó; se destruye al navegar
- C) Colección (Collect) ❌ — Tabla de datos en memoria; persiste en toda la app
- D) Named Formula (App.Formulas) ❌ — Fórmula reactiva global; no es variable de pantalla

**P3 (Caso práctico):** Define un componente de barra de búsqueda reutilizable para múltiples apps.

> **Respuesta modelo:** Componente `cmpBarraBusqueda` en SIT Component Library. Input Property: `TextoInicial` (Texto, default ""). Output Property: `TextoBusqueda` (Texto, expone el valor actual del TextInput interno). Interno: `txtSearch` TextInput + ícono de lupa + botón ✕ que ejecuta `Reset(txtSearch)`. En la app consumidora: `galSolicitudes.Items = Filter(sit_solicitudes, sit_titulo startsWith cmpBarraBusqueda.TextoBusqueda)`. Criterio de adopción: si la búsqueda aparece en 2+ pantallas o en 2+ apps distintas, crear el componente en Library.

---

### Módulo 11: Power Automate Avanzado

**P1 (Selección única):** ¿Qué acción de Power Automate agrupa pasos y permite manejo estructurado de errores con "Run after"?

- A) Apply to each ❌ — Itera sobre colecciones; no es para manejo de errores
- B) Condition ❌ — Lógica condicional simple; no agrupa pasos para manejo de fallos
- C) **Scope ✅** — Agrupa acciones; permite configurar "Run after" (succeeded/failed/skipped/timed out) para Try/Catch/Finally
- D) Do until ❌ — Bucle con condición de salida; no maneja errores de otras acciones

**P2 (Selección múltiple):** ¿Cuáles DOS prácticas mejoran la resiliencia de un flujo de Power Automate en producción?

- A) **Configurar Retry Policy en acciones HTTP (3 reintentos con intervalo fijo o exponencial) ✅**
- B) Eliminar el manejo de errores para simplificar el flujo y que corra más rápido ❌ — Los fallos silenciosos son más peligrosos que los flujos más complejos
- C) **Usar Scope Try/Catch/Finally con logging en Dataverse y notificación al equipo de soporte ✅**
- D) Usar Apply to Each sin configurar concurrencia para procesar más de 1000 registros ❌ — Sin concurrencia es lento; con concurrencia (hasta 50) se procesa en paralelo

**P3 (Caso práctico):** Diseña un flujo con reintentos, registro de errores y notificación al equipo de soporte.

> **Respuesta modelo:** Scope "Try": Action principal (ej. llamada HTTP a API externa con Retry Policy: 3 reintentos, intervalo exponencial). Scope "Catch" configurado con "Run after → Has failed, Is skipped, Has timed out": Compose del mensaje de error (outputs de la acción fallida + timestamp + Flow Run ID). Create a row en tabla `sit_log_errores` (sit_mensaje, sit_flujo, sit_timestamp, sit_payload_json). Send email a equipo-soporte@empresa.com con el detalle del error y el link al Flow Run. Scope "Finally" (siempre ejecuta): Update a row → marcar el registro original como "Error procesando" para revisión manual.

---

### Módulo 12: Power BI — DAX Avanzado

**P1 (Selección única):** ¿Qué función DAX es el único mecanismo para modificar el contexto de filtro en el que se evalúa una expresión?

- A) SUM() ❌ — Agrega valores en el contexto actual; no lo modifica
- B) FILTER() ❌ — Filtra una tabla dentro de una expresión pero no cambia el contexto de filtro externo del visual
- C) **CALCULATE() ✅** — Evalúa una expresión DAX en un nuevo contexto de filtro modificado por sus argumentos adicionales
- D) ALL() ❌ — Elimina filtros de una tabla/columna, pero debe usarse dentro de CALCULATE para modificar el contexto

**P2 (Selección única):** ¿Cuál es la diferencia fundamental entre una columna calculada y una medida DAX?

- A) Las medidas se calculan al importar datos y las columnas calculadas en cada consulta ❌ — Es al revés
- B) Solo las columnas calculadas pueden usar la función CALCULATE() ❌ — Ambas pueden; de hecho CALCULATE es más común en medidas
- C) **Las columnas calculadas se evalúan fila a fila en el contexto de fila y se almacenan en el modelo; las medidas se evalúan en el contexto de filtro del visual en cada consulta ✅**
- D) Las medidas no pueden referenciar otras medidas en su fórmula ❌ — Sí pueden (patrón de medidas compuestas)

**P3 (Caso práctico):** Construye las medidas DAX para "% Cumplimiento SLA" y "Variación Mensual de Tickets".

> **Respuesta modelo:** `% SLA Cumplido = DIVIDE(COUNTROWS(FILTER(Tickets, Tickets[HorasResolucion] <= Tickets[SLAHoras])), COUNTROWS(Tickets), 0)` (formateada como %). `Tickets Mes Anterior = CALCULATE([Total Tickets], DATEADD(DimFecha[Fecha], -1, MONTH))`. `Variación Mensual % = DIVIDE([Total Tickets] - [Tickets Mes Anterior], [Tickets Mes Anterior], BLANK())`. Prerrequisito: tabla DimFecha marcada como "Tabla de fechas" con columna Fecha sin gaps. Las tres medidas requieren relación activa entre Tickets[FechaCreacion] y DimFecha[Fecha].

---

### Módulo 13: JavaScript y PCF Básico

**P1 (Selección única):** ¿En qué método del ciclo de vida de un control PCF debe renderizarse y actualizarse la UI del control?

- A) destroy() ❌ — Libera recursos cuando el control se desmonta; no renderiza UI
- B) getOutputs() ❌ — Retorna valores que el control escribe de vuelta al formulario; no renderiza UI
- C) init() ❌ — Se ejecuta una sola vez en la inicialización; updateView también renderiza en el primer ciclo
- D) **updateView() ✅** — Llamado en la primera carga y cada vez que los datos o propiedades del control cambian; aquí se renderiza/actualiza la UI

**P2 (Selección única):** ¿Qué ventaja fundamental distingue a PCF de los controles estándar de Dataverse/Power Apps?

- A) Los controles PCF eliminan la necesidad de publicar la solución ❌ — Sí requieren despliegue en solución
- B) Los controles PCF pueden acceder a APIs externas sin restricciones de seguridad ❌ — Siguen las mismas restricciones del sandbox
- C) Los controles PCF no consumen capacidad adicional de Dataverse ❌ — Correcto en licencia, pero no es la ventaja diferencial
- D) **Permiten reemplazar campos o subgrids con experiencias visuales completamente personalizadas en TypeScript/React con acceso a Dataverse WebAPI ✅**

**P3 (Caso práctico):** Diseña un control PCF de calificación visual de prioridad (Baja/Media/Alta/Crítica).

> **Respuesta modelo:** Field PCF template. Manifest: property `sit_prioridad` tipo OptionSet, usage="bound". En `updateView()`: leer el valor actual `context.parameters.sit_prioridad.raw`. Renderizar con React 4 botones (Verde=Baja, Amarillo=Media, Naranja=Alta, Rojo=Crítica) usando Fluent UI Badge con la opción activa resaltada. Al hacer clic en una opción: almacenar el nuevo valor internamente y llamar `this._notifyOutputChanged()`. En `getOutputs()`: retornar `{sit_prioridad: this._currentValue}`. El formulario recibe el valor y actualiza el campo. Modo Virtual (ReactControl) para mejor rendimiento al compartir el runtime de React de la plataforma.

---

### Módulo 14: Conectores Personalizados

**P1 (Selección única):** ¿Qué especificación estándar se usa para importar y describir las operaciones REST de un conector personalizado en Power Platform?

- A) WSDL (Web Services Description Language) ❌ — Descripción de servicios SOAP; no es para REST
- B) GraphQL Schema ❌ — Lenguaje de consulta específico de GraphQL; no compatible directamente
- C) **OpenAPI (Swagger) ✅** — Estándar para describir APIs REST; Power Platform importa el JSON/YAML de OpenAPI para generar el conector
- D) gRPC Proto ❌ — Protocolo de Google para RPCs; no compatible con conectores de Power Platform

**P2 (Selección múltiple):** ¿Cuáles DOS mecanismos de autenticación son comunes en conectores personalizados de Power Platform?

- A) **API Key (clave secreta en header o query parameter) ✅**
- B) SSH Certificate ❌ — Autenticación de acceso remoto a servidores; no es un mecanismo de conectores Power Platform
- C) **OAuth 2.0 (flujo de autorización con access tokens) ✅**
- D) NTLM (NT LAN Manager) ❌ — Autenticación Windows on-premises; no compatible directamente con conectores cloud

**P3 (Caso práctico):** Diseña un conector para consultar el estado de órdenes en un sistema externo.

> **Respuesta modelo:** Fuente: OpenAPI JSON del sistema externo. Operación `GetOrderStatus`: GET `/api/v1/orders/{orderId}/status`. Autenticación: API Key en header `X-Api-Key` (valor en la conexión del conector). Parámetro ruta: `orderId` (string, requerido). Respuesta 200: esquema `{orderId: string, status: string, estimatedDelivery: date-time, lastUpdateBy: string}`. Policy: Set Header para agregar el tenant header personalizado. Prueba: GET con orderId "TEST-001". Uso en Power Automate: trigger Dataverse (nueva orden) → conector GetOrderStatus → Update row con el estado obtenido → enviar notificación.

---

### Módulo 15: Copilot Studio — Introducción

**P1 (Selección única):** ¿Qué artefacto de Copilot Studio define el flujo conversacional con trigger phrases, preguntas y respuestas?

- A) Action ❌ — Ejecuta operaciones externas (flujos PA, HTTP); no define el flujo conversacional
- B) Entity ❌ — Define tipos de datos que el bot reconoce en el lenguaje del usuario; no el flujo
- C) **Topic ✅** — Define las frases que activan el flujo y los pasos: preguntas, condiciones, mensajes y acciones
- D) Variable ❌ — Almacena valores durante la conversación; no define el flujo en sí

**P2 (Selección única):** ¿Cuándo es apropiado escalar la conversación a un agente humano?

- A) Cuando el usuario escribe más de 3 mensajes consecutivos ❌ — La longitud no es el criterio
- B) Cuando el bot no puede conectarse a Dataverse por error técnico ❌ — Eso es un error de integración, no de escalamiento
- C) Cuando el bot siempre ha podido responder todas las preguntas ❌ — Si siempre responde correctamente, el escalamiento no aplica
- D) **Cuando el problema requiere criterio humano, acceso privilegiado, o el usuario lo solicita explícitamente ✅**

**P3 (Caso práctico):** Diseña un copilot para FAQ de TI con Generative Answers y escalamiento.

> **Respuesta modelo:** Knowledge Source: sitio de SharePoint con artículos de TI. Topic "Soporte Técnico": trigger phrases ("tengo un problema con", "no funciona", "ayuda"). Pregunta: "¿Qué tipo de problema tienes?" (opciones: VPN, Email, Software, Hardware, Otro). Generative Answers desde KB con límite de 3 resultados. Si el usuario responde "No resolvió mi problema": Transfer to Agent con contexto (tipo de problema, pasos realizados, transcript). Topic fallback con Generative Answers global para preguntas no cubiertas. Analytics semanal: topics sin respuesta → crear artículos nuevos en la KB. Publicado en Microsoft Teams (canal Soporte TI).

---

### Módulo 16: Seguridad y Administración de Soluciones

**P1 (Selección única):** ¿Qué tipo de solución se debe usar para desplegar componentes a ambientes de Test y Producción?

- A) Unmanaged ❌ — Permite edición directa en el ambiente destino, causando deriva entre ambientes
- B) **Managed ✅** — Los componentes quedan protegidos de edición directa; garantiza que lo que hay en PROD coincide con el origen
- C) Clone ❌ — No existe como tipo de exportación en Power Platform
- D) Default Solution ❌ — Contenedor de componentes sin solución; no es exportable como artefacto de despliegue ALM

**P2 (Selección múltiple):** ¿Cuáles DOS elementos deben incluirse en una solución para soportar ALM entre ambientes sin edición manual?

- A) **Connection References ✅** — Abstracción de conexiones que permite configurarlas por ambiente sin editar los flujos
- B) El historial del repositorio Git ❌ — Git es externo a la solución de Power Platform
- C) **Environment Variables ✅** — Valores configurables por ambiente (URLs, IDs, tokens) sin editar el código de la solución
- D) Las cuentas de usuario del ambiente origen ❌ — Los usuarios no viajan en soluciones de Power Platform

**P3 (Caso práctico):** Define la estrategia DEV/TEST/PROD para una solución con controles de seguridad por rol.

> **Respuesta modelo:** DEV: ambiente Sandbox, solución Unmanaged, los developers tienen rol System Customizer. Security Roles se diseñan en DEV con mínimo privilegio. TEST: ambiente Sandbox, solución Managed importada por pipeline CI/CD. Usuarios de prueba con los mismos Security Roles de PROD. PROD: ambiente Production, solución Managed, solo el ServiceAccount del pipeline puede importar (nadie edita directamente). DLP en PROD: solo conectores aprobados. Pipeline: Solution Checker con 0 errores críticos → gate de aprobación manual del arquitecto → importación a PROD. Rollback: mantener el artefacto de la versión anterior lista para reimportar.

---

### Módulo 17: Proyecto Integrador Nivel 2

**P1 (Selección única):** ¿Qué evidencia confirma que una solución está lista para pasar a UAT (User Acceptance Testing)?

- A) El desarrollador ha terminado de codificar todas las funcionalidades ❌ — Sin pruebas técnicas, no es suficiente
- B) El cliente aprobó los mockups de la interfaz ❌ — La aprobación de diseño no valida el funcionamiento
- C) **Solution Checker sin errores críticos, pruebas funcionales internas exitosas, y el ambiente de UAT tiene datos representativos ✅**
- D) El pipeline de CI/CD está configurado y tiene un run exitoso ❌ — Necesario pero no suficiente por sí solo

**P2 (Selección única):** ¿Cuál es el promedio mínimo de dominio (escala 1-5) requerido en todos los temas del Nivel 2 para avanzar al Nivel 3?

- A) 2.0 en promedio ❌ — Nivel de dependencia de documentación; insuficiente para el Nivel 3
- B) 3.0 solo en los temas principales ❌ — Debe ser en TODOS los temas del nivel; no selectivo
- C) **3.5 o superior en todos los temas ✅** — Indica capacidad de aplicación independiente sin documentación constante
- D) 5.0 en todos los temas ❌ — Nivel experto/instructor; no es el umbral de avance entre niveles

**P3 (Caso práctico):** Presenta el plan de entrega para una solución de nivel intermedio completa.

> **Respuesta modelo:** Sprint 1 (2 sem): Dataverse avanzado (relaciones polimórficas, Rollup, Field Security, auditoría). Sprint 2 (2 sem): Component Library + Canvas App con todas las funcionalidades. Sprint 3 (2 sem): Power Automate Avanzado (Child Flows, Try/Catch, reintentos) + Conector Personalizado. Sprint 4 (2 sem): Power BI con DAX avanzado (time intelligence, RANKX, RLS). Sprint 5 (1 sem): Copilot Studio integrado con Action a Dataverse. Sprint 6 (1 sem): UAT con 3+ usuarios reales por rol, correcciones, exportación Managed, documentación de usuario y técnica. Criterios: Solution Checker 0 errores, ningún flujo sin Try/Catch, RLS verificado con cada rol, dashboard con tabla de fechas personalizada.

---


## 🟡 Nivel 3 — Avanzado (Módulos 18–30) — PL-400

### Módulo 18: Plugins y Extensibilidad Avanzada de Dataverse

**P1 (Selección única):** ¿En qué paso del evento es posible modificar los valores de un registro antes de que se persistan en la base de datos?

- A) PostOperation ❌ — El registro ya fue grabado; solo se puede leer o disparar acciones secundarias
- B) PostOperation asíncrono ❌ — Fuera de la transacción; no puede revertir ni modificar el registro original
- C) **PreOperation ✅** — Antes de que Dataverse persista el registro; se puede modificar la solicitud (InputParameters) o lanzar un InvalidPluginExecutionException para cancelar
- D) PreValidation ❌ — Pre-validación ocurre antes de la transacción; el InputParameters está disponible pero los cambios de atributos aquí no siempre se propagan en todos los escenarios como en PreOperation

**P2 (Selección múltiple):** ¿Cuáles DOS patrones deben evitarse al desarrollar plugins en Dataverse?

- A) **Múltiples actualizaciones en bucle (update dentro de apply-each sobre una colección de registros en el mismo pipeline) ✅** — Genera sobrecarga y bloqueos; usar bulk operations o flag para prevenir recursión
- B) Lanzar InvalidPluginExecutionException en PreOperation para cancelar la operación ❌ — Es exactamente el mecanismo correcto para cancelar
- C) **Dependencia de llamadas HTTP síncronas a servicios externos dentro del pipeline de operación ✅** — Aumenta latencia del pipeline de Dataverse y puede causar timeouts (límite 2 min síncrono)
- D) Usar ITracingService para logging diagnóstico ❌ — Es una buena práctica; facilita diagnóstico sin afectar rendimiento

**P3 (Caso práctico):** Diseña un plugin que valide y calcule campos al crear una oportunidad de ventas.

> **Respuesta modelo:** Evento: Create de `opportunity`, PreOperation, síncrono, Paso 40. En Execute(): `Entity opportunity = (Entity)context.InputParameters["Target"]`. Validar que `estimatedvalue >= 1000`; si no, throw `new InvalidPluginExecutionException("El valor mínimo de oportunidad es $1,000")`. Calcular `sit_margen_estimado`: obtener el porcentaje de margen de la cuenta relacionada usando `IOrganizationService.Retrieve("account", accountRef.Id, columnSet)`. `opportunity["sit_margen_estimado"] = estimatedvalue * porcentajeMargen`. No llamar `service.Update()` — la modificación de InputParameters["Target"] es suficiente para PreOperation. Registrar en solution `sse_ventas`, firma del assembly con clave fuerte, despliegue en sandbox aislado.

---

### Módulo 19: Power Apps Avanzado — PCF y ALM

**P1 (Selección única):** ¿Cómo un control PCF comunica un cambio de valor de vuelta al formulario de Dataverse?

- A) Llamando a `context.parameters.propertyName.setValue(value)` ❌ — Esta API no existe en el ciclo de vida PCF
- B) Modificando directamente el DOM del formulario ❌ — Viola el sandbox del control; el formulario y el control corren en iframes separados
- C) **Llamando a `this._notifyOutputChanged()` y retornando el nuevo valor en `getOutputs()` ✅** — El contrato PCF: notifyOutputChanged señala que hay nuevos outputs; el framework llama getOutputs() para obtenerlos
- D) Disparando un evento CustomEvent en el window global ❌ — No es parte del contrato PCF; puede no funcionar en todos los contextos

**P2 (Selección única):** ¿Qué modo de control PCF es recomendado para controles React que se benefician del runtime compartido de la plataforma?

- A) Standard (field) PCF con TypeScript sin framework ❌ — Funciona pero cada control tiene su propio bundle; no comparte el runtime de React
- B) Dataset PCF (subgrid) ❌ — Para reemplazar subgrids; no tiene relación con el tipo de framework
- C) **Virtual Control (ReactControl) ✅** — Comparte el runtime de React de la plataforma; menor overhead de bundle; recomendado para controles React modernos
- D) Hybrid PCF ❌ — No existe como categoría oficial en la SDK de PCF

**P3 (Caso práctico):** Documenta el proceso de despliegue de un PCF desde desarrollo hasta producción.

> **Respuesta modelo:** DEV: `pac pcf init --namespace SitControls --name PrioridadVisual --template field`. `npm install && npm start` para desarrollo local con el test harness. `npm run build` para producción. `pac solution add-reference --path .` y `dotnet build` para generar el zip de la solución. Solution Checker en CLI: `pac solution check`. Source Control: el código PCF (TypeScript + manifest) se versiona en Git como parte de la solución. TEST: importar solución Unmanaged en ambiente de prueba; verificar en formularios de prueba. PROD: exportar Managed → importar via pipeline. Post-deploy: verificar en formularios de PROD que el control renderiza correctamente y los valores se guardan. Rollback: reimportar la versión Managed anterior del PCF.

---

### Módulo 20: Integraciones Avanzadas con Azure

**P1 (Selección única):** ¿Qué tecnología de Azure permite que Dataverse publique eventos en tiempo real hacia otros sistemas sin polling?

- A) Azure Data Factory ❌ — ETL/ELT para movimiento de datos en batch; no es eventing en tiempo real
- B) Azure Logic Apps ❌ — Puede suscribirse a eventos, pero no es el mecanismo de publicación de Dataverse hacia Azure
- C) **Azure Service Bus + Dataverse Service Endpoint ✅** — El Service Endpoint de Dataverse publica mensajes en tiempo real al Service Bus; otros sistemas suscriben y consumen eventos
- D) Azure API Management ❌ — Proxy/gateway para APIs; no maneja eventos de Dataverse

**P2 (Selección múltiple):** ¿Cuáles DOS patrones son válidos para integrar una API externa de forma segura con Power Platform?

- A) **Custom Connector con OAuth 2.0 y Client Credentials almacenadas en Key Vault (referenciadas por Environment Variable) ✅**
- B) Hardcodear el API Key directamente en el código del plugin C# ❌ — Secreto expuesto en el assembly; violación de seguridad
- C) **Azure Function como proxy: valida y enriquece la solicitud antes de llamar a la API externa; el Custom Connector llama a la Azure Function ✅**
- D) Usar el nombre de usuario y contraseña del administrador del sistema como credenciales del conector ❌ — Viola principio de mínimo privilegio y crea dependencia de una persona

**P3 (Caso práctico):** Diseña la integración entre Dataverse y un ERP externo usando Azure para sincronización bidireccional.

> **Respuesta modelo:** Dataverse → ERP: Service Endpoint de Dataverse → Azure Service Bus (cola `dataverse-to-erp`). Azure Function (Service Bus trigger): deserializa el mensaje, mapea campos Dataverse → ERP, llama API del ERP con el Client Credential del registrado en Azure AD. ERP → Dataverse: ERP webhook → Azure API Management (validación de origen + throttling) → Azure Function → Dataverse Web API (upsert con `@odata.bind`). Idempotencia: campo `sit_erp_external_id` único en Dataverse; si existe, actualizar; si no, crear. Manejo de errores: DLQ del Service Bus captura mensajes que fallan 5 veces; Azure Monitor alerta. Environment Variables en Power Platform almacenan las URLs del Service Bus y del ERP (sin secrets hardcodeados).

---

### Módulo 21: Power Pages Avanzado

**P1 (Selección única):** ¿Qué mecanismo de seguridad controla qué registros de Dataverse puede leer o modificar un usuario autenticado en un portal Power Pages?

- A) Security Roles de Dataverse (asignados directamente al usuario) ❌ — Los usuarios del portal son Contact records, no SystemUsers; no se les asignan Security Roles directamente
- B) Web Roles sin Table Permissions ❌ — Los Web Roles por sí solos sin Table Permissions no otorgan acceso a datos
- C) **Web Roles + Table Permissions configurados con el alcance (Global/Account/Self/Parent-Child) apropiado ✅** — La combinación Web Role → Table Permission → Scope define exactamente qué datos puede ver/editar
- D) Field Security Profiles ❌ — Aplican a usuarios Dataverse (SystemUser), no a usuarios de portal

**P2 (Selección única):** ¿Qué tipo de autenticación permite que usuarios de Azure AD B2C accedan al portal con identidades externas?

- A) Windows Integrated Authentication ❌ — Autenticación intranet Windows; no para usuarios externos de internet
- B) SharePoint Claims ❌ — Autenticación de SharePoint on-premises; no es aplicable a Power Pages
- C) **OAuth 2.0 / OpenID Connect con Azure AD B2C como Identity Provider ✅** — Estándar para portales web con usuarios externos; Power Pages soporta múltiples IDPs simultáneamente
- D) API Key en el header de la solicitud ❌ — Para autenticación de servicios/APIs; no para usuarios humanos en un portal web

**P3 (Caso práctico):** Diseña la seguridad de un portal de partners con acceso a sus propias órdenes.

> **Respuesta modelo:** Registro del partner como Contact con Account padre. Web Role: "Partner Autenticado" (asignado al contacto al registrarse en el portal). Table Permissions sobre tabla `sit_orden`: Access Type = "Account", Read = permitido, Write = solo si `sit_estado` ≠ "Enviada" (combinado con Business Rule en Dataverse). Table Permission sobre `sit_linea_orden`: Access Type = "Parent" (la línea pertenece a la orden del mismo Account), Read = permitido. API Web del portal: exponer endpoint de `sit_orden` solo para las columnas necesarias (nunca `sit_costo_interno`). Anonymous users: solo pueden ver catálogo público; sin acceso a Table Permissions de órdenes. MFA via Azure AD B2C para todos los partners.

---

### Módulo 22: Copilot Studio Avanzado

**P1 (Selección única):** ¿Cómo se conecta Copilot Studio a una API externa o a Dataverse para ejecutar operaciones de negocio?

- A) Directamente mediante código JavaScript en el topic ❌ — Los topics no ejecutan JS directamente
- B) Mediante un webhook interno del bot ❌ — No existe un mecanismo de webhook interno en Copilot Studio para llamadas salientes
- C) **Mediante una Action que llama a un Power Automate Cloud Flow o a una HTTP Connection ✅** — Las Actions son el mecanismo de extensibilidad de Copilot Studio para operaciones externas
- D) Insertando código C# en el manifest del bot ❌ — No existe esta capacidad en Copilot Studio

**P2 (Selección única):** ¿Qué capacidad avanzada de Copilot Studio permite responder preguntas con documentos internos sin entrenar un modelo personalizado?

- A) Custom Entities ❌ — Definen tipos de datos reconocibles en el texto del usuario; no buscan en documentos
- B) LUIS (Language Understanding) ❌ — Modelo de intenciones/entidades externo; no busca en documentos automáticamente
- C) **Generative Answers con Knowledge Sources (SharePoint, sitios públicos, archivos) ✅** — Busca en las fuentes configuradas y genera respuestas basadas en el contenido real de los documentos
- D) Fallback topic ❌ — Manejador de cuando el bot no reconoce el intent; por sí solo no busca en documentos

**P3 (Caso práctico):** Diseña un agente de IA para autoservicio de RRHH con acceso a políticas y Dataverse.

> **Respuesta modelo:** Knowledge Sources: SharePoint "Políticas RRHH" (vacaciones, permisos, beneficios). Topics: "Consultar Mis Vacaciones" (Action → Flow → Dataverse `sit_vacacion` donde `sit_empleado_email = User().Email`; respuesta con días disponibles y próximas fechas). "Solicitar Permiso" (preguntas: tipo, fecha inicio, fecha fin → Action → crea `sit_solicitud_permiso` → notifica al manager). "Calcular Beneficios" (Generative Answers desde KB). Escalamiento: "Hablar con RRHH" → Transfer to Omnichannel Agent con transcript completo. Analytics: topics frecuentes → retroalimentar KB semanalmente. Publicado en Teams canal RRHH. DLP: conector Dataverse RRHH en grupo "Business" (bloqueado con conectores no aprobados).

---

### Módulo 23: Administración Avanzada de Power Platform

**P1 (Selección única):** ¿Qué capacidad de las DLP Policies impide que Power Automate combinen Salesforce con Dataverse en un mismo flujo?

- A) Mandatory Connectors ❌ — No existe esta categoría de DLP
- B) **Separar Salesforce en el grupo "Non-Business" mientras Dataverse está en "Business" — los conectores de grupos diferentes no pueden usarse en el mismo flujo ✅**
- C) Bloquear el conector de Salesforce completamente en el ambiente ❌ — Bloquear es una opción, pero la separación de grupos es el mecanismo de prevención de combinación
- D) Crear una Custom Connector Policy que restrinja el endpoint de Salesforce ❌ — Esta granularidad no existe en DLP Policies estándar

**P2 (Selección múltiple):** ¿Cuáles DOS métricas de CoE Starter Kit son indicadores de riesgo de gobernanza?

- A) **Apps activas sin dueño identificado ✅** — Generan riesgo de continuidad; nadie mantiene la app si el creador abandona la empresa
- B) Número total de apps en el tenant ❌ — La cantidad por sí sola no indica riesgo; apps gestionadas con dueños son saludables
- C) **Flujos de Power Automate que usan conexiones personales (no Service Account) en ambientes productivos ✅** — Si el usuario dueño de la conexión se va, el flujo se rompe en producción
- D) Número de ambientes Developer en el tenant ❌ — Los ambientes Developer son gratuitos para makers; su número no es un riesgo directo

**P3 (Caso práctico):** Define la estrategia de gobernanza para un tenant de 500 makers.

> **Respuesta modelo:** Center of Excellence: equipo de 3 personas (Arquitecto Platform, CoE Admin, Governance Analyst). Ambientes: DEV (por equipo/proyecto), Sandbox compartido para PoCs, TEST y PROD (solo para apps aprobadas). DLP por ambiente: PROD tiene solo conectores aprobados (Dataverse, Office 365, SharePoint). Makers requieren aprobación para acceso a PROD. CoE Starter Kit: dashboard de apps sin dueño, alertas semanales de flujos rotos, inventory de conectores usados. Proceso de onboarding: nuevos makers hacen módulo PL-900 + taller interno antes de acceder al tenant productivo. Proceso de offboarding: cuando un empleado se va, sus apps/flujos se reasignan a su manager con 5 días de margen. Review trimestral: eliminar apps inactivas 90+ días.

---

### Módulo 24: Arquitectura Básica de Soluciones

**P1 (Selección única):** ¿Cuál es la diferencia entre una solución Managed y una Unmanaged en Power Platform?

- A) Las soluciones Managed son más grandes en tamaño que las Unmanaged ❌ — El tamaño no es el criterio diferenciador
- B) Las soluciones Unmanaged no pueden contener plugins ni PCF ❌ — Sí pueden contener ambos
- C) **Las soluciones Managed protegen los componentes de edición directa en el ambiente destino y permiten actualizaciones y desinstalación controladas; las Unmanaged permiten edición libre ✅**
- D) Solo las soluciones Unmanaged pueden incluir Security Roles ❌ — Ambos tipos pueden incluir Security Roles

**P2 (Selección única):** ¿Por qué nunca se deben crear componentes directamente en la Default Solution en ambientes de desarrollo?

- A) La Default Solution tiene un límite de 100 componentes ❌ — No existe tal límite
- B) Los componentes en la Default Solution no se pueden usar en Canvas Apps ❌ — Sí se pueden usar, pero no es la razón para evitar la Default Solution
- C) **Los componentes en la Default Solution no se pueden exportar fácilmente a otras soluciones y dificultan el ALM; generan "solution sprawl" y deuda técnica ✅**
- D) La Default Solution no permite configurar Connection References ❌ — Sí permite, pero es una mala práctica de ALM

**P3 (Caso práctico):** Diseña la estrategia de soluciones para una implementación empresarial con 15 módulos funcionales.

> **Respuesta modelo:** Solución Base: tablas Dataverse compartidas, Security Roles globales, conexiones base. Soluciones Funcionales (una por módulo): `sse_ventas`, `sse_soporte`, `sse_proyectos`, etc. — cada una depende de la solución base. Soluciones de Integración: `sse_azure_integration`, `sse_erp_sync`. Solución UI: Component Library PCF compartida por todas las apps. Dependencias: declaradas explícitamente entre soluciones. Versionado: major.minor.patch — major para cambios de esquema, minor para nuevas funcionalidades, patch para correcciones. ALM: pipeline en Azure DevOps exporta cada solución independientemente y las importa en orden (Base → Shared → Funcionales → UI → Integraciones). Solution Checker en cada export; 0 errores críticos para avanzar.

---

### Módulo 25: Diseño de Procesos Avanzados en Power Automate

**P1 (Selección única):** ¿Qué tipo de flujo de Power Automate puede ser invocado por otro flujo para reutilizar lógica común?

- A) Scheduled Flow ❌ — Flujo programado por tiempo; no invocable por otro flujo
- B) Button Flow ❌ — Activado manualmente; no invocable por otro flujo directamente
- C) **Child Flow (invocado con "Run a Child Flow" desde un flujo padre) ✅** — Permite encapsular y reutilizar lógica; el padre pasa parámetros y recibe resultados del child
- D) Instant Cloud Flow ❌ — Flujo de activación manual o desde una app; no es el nombre del patrón de reutilización

**P2 (Selección múltiple):** ¿Cuáles DOS prácticas garantizan trazabilidad completa en flujos de Power Automate productivos?

- A) **Logging de cada operación crítica en tabla Dataverse `sit_log_flujo` con timestamp, resultado y payload ✅**
- B) No incluir manejo de errores para que los flows sean más cortos y legibles ❌ — Sin manejo de errores, los fallos son silenciosos y difíciles de diagnosticar
- C) **Incluir el Flow Run ID y el nombre del flujo en todos los registros de log para correlación de ejecuciones ✅**
- D) Hardcodear los valores de configuración directamente en las acciones del flujo ❌ — Usar Environment Variables para valores que cambian entre ambientes

**P3 (Caso práctico):** Diseña un flujo de aprobación multinivel para contratos con valor mayor a $100,000.

> **Respuesta modelo:** Trigger: Dataverse "Cuando se modifica una fila" de `sit_contrato` donde `sit_estado` cambia a "En Revisión". Condición: si `sit_monto > 100000` → aprobación multinivel; si ≤ 100000 → aprobación simple (1 nivel). Nivel 1: Start approval → Gerente del área (timeout 48h → escalación a Director). Si aprueba → Nivel 2: Director Financiero (timeout 24h). Si ambos aprueban → Estado "Aprobado" + notificación legal. Si cualquiera rechaza → Estado "Rechazado" + notificación al creador con comentarios. Child Flow reutilizable: "Enviar Notificación de Contrato" (recibe: destinatario, tipo, contrato ID). Log de cada decisión en `sit_historial_aprobacion` (quién, cuándo, decisión, comentarios).

---

### Módulo 26: Power BI Empresarial

**P1 (Selección única):** ¿Qué función DAX permite calcular una medida en el contexto de todas las filas de la tabla ignorando los filtros del visual?

- A) FILTER(ALL(tabla)) ❌ — FILTER con ALL puede eliminar filtros pero dentro de CALCULATE; no por sí sola ignora el contexto del visual
- B) SUMX(tabla, expresión) ❌ — SUMX es iteración; no ignora el contexto del visual automáticamente
- C) **CALCULATE(medida, ALL(tabla)) ✅** — ALL() dentro de CALCULATE elimina todos los filtros de la tabla especificada, evaluando la medida sin filtros del visual
- D) RELATED(tabla[columna]) ❌ — Navega relaciones; no modifica el contexto de filtro

**P2 (Selección múltiple):** ¿Cuáles DOS configuraciones son necesarias para que Power BI actualice automáticamente datos de Dataverse en un reporte productivo?

- A) **Publicar el dataset en Power BI Service (Workspace) con el servicio premium o PPU ✅**
- B) Dejar el archivo .pbix abierto en Power BI Desktop en el servidor ❌ — El Desktop no mantiene actualizaciones automáticas; se usa el Service
- C) **Configurar un Gateway On-Premises si la fuente de datos es local, O usar el conector nativo de Dataverse (cloud, sin gateway) ✅**
- D) Duplicar el dataset para cada reporte que lo consuma ❌ — Se comparte el dataset; los reportes se conectan al dataset compartido

**P3 (Caso práctico):** Diseña el modelo de datos y medidas para un reporte ejecutivo de ventas con análisis YTD y comparativo año anterior.

> **Respuesta modelo:** Modelo estrella: Hechos = `fact_oportunidades` (monto, fecha, FK a dimensiones). Dimensiones: `dim_fecha` (tabla de fechas, marcada como "tabla de fechas", con columnas Año, Trimestre, Mes, Semana, Nombre del Mes), `dim_producto`, `dim_cliente`, `dim_vendedor`. Medidas: `Ventas Total = SUM(fact_oportunidades[sit_monto])`, `Ventas YTD = CALCULATE([Ventas Total], DATESYTD(dim_fecha[Fecha]))`, `Ventas YTD AñoAnterior = CALCULATE([Ventas YTD], DATEADD(dim_fecha[Fecha], -1, YEAR))`, `Crecimiento YoY% = DIVIDE([Ventas YTD] - [Ventas YTD AñoAnterior], [Ventas YTD AñoAnterior], BLANK())`. RLS: cada vendedor ve solo sus oportunidades; gerentes ven su equipo; director ve todo. Actualización: 4 veces al día via Dataverse connector.

---

### Módulo 27: Gestión del Cambio y Adopción

**P1 (Selección única):** ¿Qué métrica indica que la adopción de una solución Power Platform está fracasando a los 30 días del go-live?

- A) Algunos usuarios tardaron más de lo esperado en aprender la nueva interfaz ❌ — Curva de aprendizaje normal; no indica fracaso
- B) El número de tickets de soporte técnico aumentó los primeros 3 días ❌ — Esperado en el lanzamiento; no indica fracaso
- C) **Más del 40% de los usuarios activos del proceso anterior no han iniciado sesión en la nueva app después de 30 días ✅**
- D) El gerente del área solicita un reporte adicional al planeado ❌ — Solicitud de mejora; no es indicador de fracaso de adopción

**P2 (Selección única):** ¿Cuál es la acción más efectiva cuando usuarios clave resisten el cambio a una nueva solución?

- A) Ignorar la resistencia y esperar a que los usuarios se adapten solos con el tiempo ❌ — La resistencia no resuelta causa abandono y proyectos fallidos
- B) Escalar inmediatamente al C-Suite para forzar la adopción ❌ — La imposición sin comprensión aumenta el resentimiento
- C) Eliminar el sistema anterior y forzar el uso del nuevo sin período de transición ❌ — Genera caos y pérdida de confianza
- D) **Involucrar a los usuarios resistentes como "champions" del proceso — hacerlos parte de la solución identifica sus preocupaciones reales y los convierte en promotores ✅**

**P3 (Caso práctico):** Diseña el plan de gestión del cambio para migrar de un sistema legacy a Power Platform.

> **Respuesta modelo:** Fase 1 - Análisis de impacto (semana 1-2): mapear todos los usuarios afectados por rol (50 agentes, 8 supervisores, 3 directores). Identificar Champions por departamento (1 por cada 10 usuarios). Encuesta de disposición al cambio. Fase 2 - Comunicación (semana 3): correo del CEO apoyando el cambio + demo del nuevo sistema en town hall. Intranet con FAQ, videos de 2 minutos por funcionalidad, hoja de comparación "antes/después". Fase 3 - Capacitación (semana 4-6): Champions entrenados primero (2 días). Capacitación por rol (agentes: 4h, supervisores: 6h, directores: 2h de dashboards). Entorno sandbox para práctica libre. Fase 4 - Go-Live con soporte (semana 7-8): ambos sistemas corriendo en paralelo 2 semanas. Champions en sala para ayuda inmediata. Hotline de soporte. KPI: 90% de usuarios activos a las 4 semanas del go-live.

---

### Módulo 28: ALM con Azure DevOps

**P1 (Selección única):** ¿Qué herramienta de CLI de Microsoft automatiza la exportación de soluciones de Power Platform desde un pipeline de Azure DevOps?

- A) Azure CLI (`az`) ❌ — CLI general de Azure; no tiene comandos nativos de Power Platform/Dataverse
- B) PnP PowerShell ❌ — Herramienta para SharePoint; no para Power Platform
- C) **Power Platform CLI (`pac`) ✅** — CLI oficial de Microsoft para Power Platform: export, import, solution check, auth, package deploy
- D) Dynamics 365 SDK (`crmsvcutil`) ❌ — Generador de clases de entidad; no es la herramienta de automatización ALM

**P2 (Selección múltiple):** ¿Cuáles DOS prácticas son esenciales para un pipeline de CI/CD de Power Platform?

- A) **Ejecutar Solution Checker y fallar el pipeline si hay errores críticos ✅** — Gate de calidad automatizado; previene despliegues de código con problemas conocidos
- B) Exportar siempre como solución Unmanaged hacia producción para poder editar directamente ❌ — El estándar es Managed a producción
- C) **Usar Connection References y Environment Variables para que el mismo artefacto funcione en todos los ambientes ✅**
- D) Crear un nuevo pipeline para cada hotfix menor sin branches ❌ — Los hotfixes deben seguir el mismo proceso que los releases normales con branch de hotfix

**P3 (Caso práctico):** Diseña el pipeline completo de CI/CD para una solución Power Platform con 5 ambientes.

> **Respuesta modelo:** Branch Strategy: `main` (PROD), `release/x.y` (TEST), `develop` (DEV). Azure DevOps Pipeline Build: trigger en PR a `develop` → pac auth con Service Principal → pac solution export (Unmanaged) → pac solution check (0 errores críticos) → pac solution pack → publish artifact. Release Pipeline (1): DEV → import Unmanaged (para edición continua). Release Pipeline (2): develop → release branch → Solution Checker gate → Approver (Tech Lead) → import en Sandbox. Release Pipeline (3): release → main → import Managed en TEST → Regression Tests automáticos → Approver (Arquitecto + PM) → import en PROD. Post-PROD: smoke test automatizado (verificar 5 operaciones clave). Rollback: button "Roll back to previous" que reimporta el artifact anterior de PROD.

---

### Módulo 29: Performance y Escalabilidad

**P1 (Selección única):** ¿Qué tipo de índice de Dataverse se debe crear para optimizar consultas que filtran frecuentemente por el campo `sit_estado` en tablas con millones de registros?

- A) Primary Key automático ❌ — El ID ya está indexado; no se puede "crear" uno nuevo
- B) Lookup column index ❌ — Las columnas Lookup tienen índices automáticos para las relaciones
- C) **Managed Property "Can Be Used in Search" activado + Quick Find View con el campo + índice personalizado en la columna via Dataverse settings ✅** — Para columnas de elección/texto con alto filtrado, activar en Quick Find optimiza el índice subyacente
- D) Foreign key constraint en la base de datos SQL subyacente ❌ — No tienes acceso directo al SQL de Dataverse

**P2 (Selección múltiple):** ¿Cuáles DOS estrategias mejoran el rendimiento de Canvas Apps con grandes volúmenes de datos?

- A) **Delegación (delegation) a Dataverse: usar Filter/Sort operaciones que se ejecuten en el servidor, no en el cliente ✅** — La delegación evita traer todos los registros al cliente para filtrar localmente
- B) Cargar todos los datos en OnStart con una sola llamada Collect() ❌ — Cargar todo en OnStart hace la app lenta al iniciar y puede exceder límites de delegación
- C) **Habilitar la opción "Delayed Load" y "Concurrent Connections" en configuración avanzada de Canvas App ✅**
- D) Usar tablas de SharePoint en lugar de Dataverse para datos de alta velocidad ❌ — Dataverse escala mejor que SharePoint para datos relacionales de alta concurrencia

**P3 (Caso práctico):** Diagnostica y resuelve un problema de rendimiento en una Canvas App que tarda 8 segundos en cargar.

> **Respuesta modelo:** Diagnóstico con Monitor (herramienta de depuración de Canvas App): identificar las llamadas más lentas al conector. Hallazgo típico: ClearCollect en OnStart cargando 5,000 registros de Dataverse sin delegación. Solución 1: reemplazar ClearCollect global con Filter delegable en cada Gallery: `galSolicitudes.Items = Filter(sit_solicitudes, sit_estado = ddlFiltro.Selected.Value)`. Solución 2: usar Concurrent() en App.OnStart para cargar múltiples colecciones en paralelo en lugar de secuencial. Solución 3: activar "Delayed Load" para que las pantallas no usadas no carguen sus datos al inicio. Solución 4: usar Named Formulas (App.Formulas) para cálculos reactivos en lugar de variables globales recalculadas. Resultado esperado: carga < 2 segundos. Validar con Monitor post-fix.

---

### Módulo 30: Proyecto Integrador Nivel 3

**P1 (Selección única):** ¿Qué criterio distingue una arquitectura de solución de nivel 3 (avanzado) de una de nivel 2 (intermedio)?

- A) Las soluciones de nivel 3 tienen más pantallas y formularios ❌ — La cantidad de UI no es el criterio de complejidad arquitectónica
- B) Las soluciones de nivel 3 cuestan más en licencias de Power Platform ❌ — El costo de licencia no define la complejidad de arquitectura
- C) **Las soluciones de nivel 3 integran múltiples sistemas externos, implementan patrones de extensibilidad (Plugins, PCF, Azure Integration), y tienen una estrategia de ALM completamente automatizada ✅**
- D) Las soluciones de nivel 3 solo pueden construirse con código C# ❌ — Combinan código con configuración; no son exclusivamente código

**P2 (Selección única):** ¿Cuántos módulos del Nivel 3 deben tener calificación 3.5+ para avanzar al Nivel 4?

- A) Los 5 módulos de integración técnica ❌ — El criterio es todos los módulos, no una selección
- B) Al menos la mitad de los 13 módulos del nivel ❌ — El umbral es todos los módulos
- C) **Todos los módulos (18-30) con 3.5/5 o superior ✅**
- D) Solo el módulo 30 (Proyecto Integrador) como examen final ❌ — El proyecto integra pero no reemplaza la evaluación de cada módulo

**P3 (Caso práctico):** Diseña la arquitectura completa de una solución empresarial de CRM personalizado sobre Power Platform.

> **Respuesta modelo:** Dataverse: tablas `sit_cuenta`, `sit_contacto`, `sit_oportunidad`, `sit_actividad`, `sit_cotizacion`, `sit_contrato`. Plugin PreOperation: valida descuento máximo por oportunidad según el Security Role del vendedor. Plugin PostOperation: crea actividad de seguimiento automática al ganar una oportunidad. PCF: control de mapa de calor de actividad por cuenta. Azure Integration: sincronización bidireccional con SAP para cuentas y contratos vía Service Bus. Power Automate: Approval flow de contratos, Child Flow de notificaciones, Try/Catch en todos los flujos. Canvas App (móvil): visita de campo con registro de contactos y oportunidades offline. Model-Driven App: gestión completa en escritorio con BPF 5 etapas. Power Pages: portal de autoservicio de clientes. Copilot Studio: asistente de consulta de estado de cotización. Power BI: pipeline de ventas, forecast, win/loss ratio. ALM: Azure DevOps, 3 ambientes, 0 errores Solution Checker, Managed a PROD.

---

## 🔴 Nivel 4 — Arquitecto (Módulos 31–41) — PL-600

### Módulo 31: Fundamentos de Arquitectura Empresarial

**P1 (Selección única):** ¿Cuál es el propósito principal del Microsoft Power Platform Well-Architected Framework?

- A) Proporcionar plantillas de código reutilizables para developers de Power Platform ❌ — Las plantillas son artefactos; el WAF es un framework de evaluación y guía arquitectónica
- B) Definir los precios y licencias de Power Platform por capacidad ❌ — El WAF no trata sobre precios
- C) **Proveer un conjunto de principios y mejores prácticas para evaluar y mejorar la calidad arquitectónica de soluciones Power Platform en 5 dimensiones ✅** — Fiabilidad, Seguridad, Eficiencia de Rendimiento, Excelencia Operacional y Optimización de Costos
- D) Automatizar el despliegue de soluciones Power Platform en Azure ❌ — El WAF es una guía; no es una herramienta de automatización

**P2 (Selección múltiple):** ¿Cuáles DOS pilares del Well-Architected Framework son más críticos en entornos regulados como finanzas o salud?

- A) **Seguridad ✅** — Protección de datos, identidad, acceso con mínimo privilegio; auditoría y cumplimiento normativo
- B) Optimización de Costos ❌ — Importante siempre, pero en regulados la seguridad y fiabilidad son prioritarias
- C) **Fiabilidad ✅** — RTO/RPO definidos, redundancia, recuperación ante desastres; crítico cuando el sistema falla pueden afectarse vidas o transacciones financieras
- D) Rapidez de Desarrollo ❌ — No es un pilar del Well-Architected Framework de Microsoft

**P3 (Caso práctico):** Evalúa con el Well-Architected Framework una solución de nómina construida en Power Platform.

> **Respuesta modelo:** Seguridad: ✅ Field Security Profiles en sit_salario, ✅ MFA habilitado, ⚠️ Falta DLP específico para Nómina — recomendación: crear ambiente dedicado con DLP más restrictivo. Fiabilidad: ✅ Backups automáticos Dataverse (28 días), ⚠️ No existe Disaster Recovery plan documentado — definir RTO <4h, RPO <1h. Eficiencia de Rendimiento: ⚠️ Plugin síncrono de cálculo salarial tarda 3.2s promedio — refactorizar a PreOperation con batch processing. Excelencia Operacional: ✅ Azure DevOps pipeline con Solution Checker, ⚠️ Sin monitoreo de flujos en producción — implementar alertas Azure Monitor. Optimización de Costos: ⚠️ 200 licencias Premium asignadas; 40 usuarios solo ven reportes — migrar a licencia de Power BI Pro para reducir costo $8k/año.

---

### Módulo 32: Diseño de Soluciones Empresariales

**P1 (Selección única):** ¿Qué artefacto documenta formalmente las decisiones arquitectónicas y sus justificaciones en un proyecto empresarial?

- A) User Story Map ❌ — Documenta funcionalidades desde perspectiva del usuario; no las decisiones técnicas de arquitectura
- B) Diagrama de flujo de proceso ❌ — Documenta el flujo de un proceso; no las decisiones y trade-offs arquitectónicos
- C) **Architecture Decision Record (ADR) ✅** — Documenta: contexto, decisión tomada, alternativas consideradas, consecuencias y trade-offs de cada decisión arquitectónica importante
- D) Sprint Backlog ❌ — Lista de trabajo pendiente del sprint; no decisiones arquitectónicas

**P2 (Selección única):** ¿Por qué el patrón "God Table" (una sola tabla que sirve para todo) es un anti-patrón en Dataverse?

- A) Porque Dataverse tiene un límite de 500 columnas por tabla y una God Table lo excede ❌ — Si bien hay límites, el problema fundamental no es el límite numérico
- B) **Porque genera columnas irrelevantes para la mayoría de los registros (desperdicio y confusión), impide reutilización con relaciones limpias, dificulta el mantenimiento, y viola el principio de responsabilidad única ✅**
- C) Porque las vistas de una God Table no se pueden publicar en Model-Driven Apps ❌ — Las vistas funcionan independientemente de la complejidad del modelo
- D) Porque los Security Roles no pueden aplicarse a tablas con más de 100 columnas ❌ — No existe ese límite en Security Roles

**P3 (Caso práctico):** Diseña la estrategia de datos para una suite ERP en Power Platform con módulos independientes pero integrados.

> **Respuesta modelo:** Solución Core (shared): tablas maestras (sit_empresa, sit_moneda, sit_usuario_externo, sit_configuracion_global). Módulo Ventas: sit_oportunidad, sit_cotizacion, sit_orden_venta — depende de Core. Módulo Inventario: sit_producto, sit_categoria, sit_movimiento_stock — depende de Core. Módulo Finanzas: sit_factura, sit_pago, sit_cuenta_contable — depende de Ventas e Inventario. Integración entre módulos: via Dataverse Virtual Tables (lectura cross-solution sin duplicar datos) + Events (Service Bus) para cambios críticos. Cada módulo en su propia solución (`sse_core`, `sse_ventas`, `sse_inventario`, `sse_finanzas`) con dependencias declaradas. Equipos independientes desarrollan cada módulo sin conflictos de solución. Versionado independiente por módulo.

---

### Módulo 33: Seguridad Avanzada y Compliance

**P1 (Selección única):** ¿Qué modelo de seguridad de Dataverse permite que un usuario solo vea los registros de su equipo o jerarquía organizacional?

- A) Security Role únicamente (sin Business Unit) ❌ — Sin hierarchy security, un rol puede dar acceso global o individual pero no jerarquía
- B) Field Security Profile con columna de equipo ❌ — Field Security controla acceso a columnas específicas; no a conjuntos de registros por jerarquía
- C) **Hierarchy Security Model activado en Dataverse con el modelo "Manager" o "Position" ✅** — Permite que managers vean registros de sus subordinados directos e indirectos automáticamente
- D) Sharing rules entre usuarios individuales ❌ — El sharing manual no escala para jerarquías organizacionales

**P2 (Selección múltiple):** ¿Cuáles DOS controles técnicos son esenciales para cumplimiento GDPR en una solución Power Platform?

- A) **Activar auditoría en tablas con datos personales y retener los logs según política de retención ✅** — GDPR requiere trazabilidad de quién accedió o modificó datos personales
- B) Deshabilitar los logs de Power Automate para proteger la privacidad de los datos en tránsito ❌ — Deshabilitar logs viola el principio de responsabilidad y dificulta auditorías
- C) **Implementar el derecho al olvido: proceso documentado para eliminar o anonimizar datos personales por solicitud del titular ✅** — Artículo 17 GDPR; debe ser posible técnicamente y estar documentado
- D) Usar columnas de tipo "Texto" para datos de identificación personal en lugar de tipos especializados ❌ — El tipo de columna no determina el cumplimiento GDPR; las políticas de acceso sí

**P3 (Caso práctico):** Diseña la arquitectura de seguridad para un sistema de salud con datos de pacientes.

> **Respuesta modelo:** Ambient: Production environment dedicado para salud con DLP específico (solo conectores aprobados por IT). Identity: MFA obligatorio para todos los usuarios clínicos + Conditional Access (solo desde dispositivos corporativos). Dataverse: tablas de pacientes (sit_paciente, sit_historia_clinica) con auditoría habilitada en todas las columnas sensibles. Field Security Profiles: campo sit_diagnostico_detallado solo visible para médico tratante y director médico. Hierarchy Security: médicos ven sus pacientes, jefes de servicio ven su servicio, dirección médica ve todos. GDPR: proceso de Right to Access (exportar datos de un paciente en JSON) y Right to Erasure (anonimizar nombre, email, teléfono — mantener historial clínico por obligación legal de 15 años). DLP: deshabilitados conectores de redes sociales y almacenamiento personal. Auditoría: retenida 5 años. Customer Lockbox activado.

---

### Módulo 34: Estrategias de Integración Empresarial

**P1 (Selección única):** ¿Cuándo es más apropiado usar el patrón de integración "Event-Driven" sobre el patrón "Request-Response"?

- A) Cuando el sistema que inicia la operación necesita la respuesta inmediatamente para continuar su proceso ❌ — Eso describe mejor Request-Response
- B) Cuando la integración involucra exactamente 2 sistemas y la latencia es <100ms ❌ — La latencia no es el criterio principal para elegir Event-Driven
- C) **Cuando el productor no debe esperar al consumidor, hay múltiples consumidores del mismo evento, o la resiliencia ante fallos del consumidor es crítica ✅**
- D) Cuando ambos sistemas están en la misma red interna y no hay restricciones de firewall ❌ — La topología de red no determina el patrón de integración

**P2 (Selección múltiple):** ¿Cuáles DOS tecnologías de Azure son más apropiadas para integrar Power Platform con sistemas on-premises detrás de un firewall?

- A) **Azure API Management con VNet Integration ✅** — Permite exponer APIs internas de forma segura; Power Platform llama a APIM que proxy hacia on-premises
- B) Azure Blob Storage ❌ — Almacenamiento de archivos; no es una tecnología de integración de red
- C) **On-Premises Data Gateway ✅** — Túnel seguro entre la nube de Power Platform y sistemas locales sin abrir puertos de firewall
- D) Azure CDN ❌ — Red de distribución de contenido; no es para integración de sistemas

**P3 (Caso práctico):** Diseña la arquitectura de integración entre Power Platform y 3 sistemas legacy simultáneamente.

> **Respuesta modelo:** Hub de integración: Azure Integration Services (APIM + Service Bus + Azure Functions). Sistema Legacy A (ERP SAP on-premises): On-Premises Data Gateway → Custom Connector SAP → Power Automate. Eventos de cambio de SAP: Azure Function (SAP BTP Event Mesh → Service Bus → Azure Function → Dataverse Web API). Sistema Legacy B (Base de datos SQL Server on-premises): On-Premises Data Gateway → SQL Server connector → Power Automate para sincronización nocturna. Sistema Legacy C (API REST legacy con auth básica): Azure API Management actúa como proxy, convierte auth básica a OAuth 2.0, agrega throttling y logging. Custom Connector Power Platform → APIM (OAuth). Idempotencia: todos los upserts usan campos de ID externo. Monitoreo: Azure Monitor + Alerts en todos los Service Bus queues (DLQ > 0 = alert).

---

### Módulo 35: Gobierno del Dato y Master Data Management

**P1 (Selección única):** ¿Qué herramienta de Microsoft Purview se integra con Power Platform para catalogar y clasificar automáticamente datos en Dataverse?

- A) Microsoft Defender for Cloud Apps ❌ — Security broker para visibilidad de apps; no clasifica datos de Dataverse
- B) Azure Policy ❌ — Políticas de conformidad en recursos Azure; no cataloga datos de Dataverse
- C) **Microsoft Purview Data Catalog con el conector de Dataverse ✅** — Escanea tablas y columnas de Dataverse, aplica clasificaciones automáticas (PII, datos sensibles) y construye el linaje de datos
- D) Azure Synapse Analytics ❌ — Analítica a gran escala; puede consumir datos de Dataverse pero no es la herramienta de catálogo/clasificación

**P2 (Selección única):** ¿Cuál es el principio fundamental del Master Data Management (MDM) en una arquitectura empresarial con múltiples sistemas?

- A) Cada sistema mantiene su propia copia independiente de los datos maestros para mayor resiliencia ❌ — Genera inconsistencia y conflictos de versión entre sistemas
- B) Los datos maestros solo existen en un sistema y todos los demás solo pueden leerlos, nunca modificarlos ❌ — Muy restrictivo; hay escenarios de actualización distribuida con reconciliación
- C) **Existe una única fuente de verdad (Golden Record) para cada entidad maestra; todos los sistemas sincronan desde o hacia esta fuente con reglas de reconciliación definidas ✅**
- D) Los datos maestros se replican en tiempo real a todos los sistemas simultáneamente sin lógica de resolución de conflictos ❌ — Sin resolución de conflictos, las actualizaciones simultáneas causan inconsistencia

**P3 (Caso práctico):** Diseña la estrategia MDM para una empresa con datos de Clientes en 4 sistemas diferentes.

> **Respuesta modelo:** Golden Record en Dataverse (`sit_cliente_maestro`): fuente de verdad para nombre legal, NIF/CIF, domicilio fiscal, segmento, estado. Matching Rules: identificar el mismo cliente en los 4 sistemas por NIF, luego por nombre + CP (fuzzy matching con un umbral del 85%). Survivorship Rules: en caso de conflicto → ganadora: campo actualizado más recientemente por el ERP (sistema más confiable para datos fiscales); para dirección → ganadora: el CRM (actualizado por el equipo comercial). Sincronización: Azure Data Factory o Dataverse Integration (Service Bus) propaga el Golden Record a los 4 sistemas. Stewardship: Data Steward en RRHH (datos de empleados) y en Finanzas (datos fiscales) revisa y aprueba merges de duplicados semanalmente en una Model-Driven App de MDM. Microsoft Purview: clasifica automáticamente las columnas con PII en todos los sistemas conectados.

---

### Módulo 36: Diseño para Alta Disponibilidad y Recuperación de Desastres

**P1 (Selección única):** ¿Qué determina el Recovery Point Objective (RPO) en el contexto de una solución Power Platform crítica?

- A) Cuántas horas tarda en restaurar la solución después de una catástrofe ❌ — Eso describe el RTO (Recovery Time Objective)
- B) **Cuánta pérdida de datos (en tiempo) es aceptable en el peor escenario de fallo — por ejemplo, RPO = 1h significa que podemos perder hasta 1h de transacciones ✅**
- C) El número máximo de usuarios concurrentes que puede soportar Dataverse ❌ — Eso es capacidad, no recuperación ante desastres
- D) La frecuencia mínima de actualización de los dashboards de Power BI ❌ — La frecuencia de actualización es una configuración de reporting; no tiene relación con RPO

**P2 (Selección múltiple):** ¿Cuáles DOS prácticas soportan un plan de recuperación ante desastres efectivo en Power Platform?

- A) **Configurar backups automáticos de Dataverse (retención hasta 28 días) y documentar el procedimiento de restauración con tiempo estimado ✅**
- B) Usar la Default Solution para todos los componentes para simplificar la restauración ❌ — La Default Solution dificulta el ALM y la recuperación selectiva
- C) **Mantener el artefacto de solución Managed de la última versión estable en Azure Artifacts o repositorio Git LFS para reimportación rápida ✅**
- D) Desactivar las funciones de auditoría en producción para mejorar el rendimiento durante una recuperación ❌ — La auditoría debe mantenerse siempre activa; especialmente durante y después de un incidente

**P3 (Caso práctico):** Define el plan de DR para una solución crítica de gestión de turnos hospitalarios en Power Platform.

> **Respuesta modelo:** RTO: 2 horas (sistema debe estar operativo dentro de 2h de un fallo mayor). RPO: 15 minutos (perder máximo 15 minutos de turnos registrados). Estrategias: Backup Dataverse configurado con retención de 28 días + backup export diario a Azure Blob Storage. Near-real-time: Dataverse Event Subscription → Azure Service Bus → Azure Function → backup incremental en Cosmos DB (RPO real ~5 min). Power Automate Flows exportados como solución Managed en Azure Artifacts con tag de versión. Runbook de DR: 1) Validar alcance del fallo. 2) Si fallo de ambiente: crear nuevo ambiente + importar solución Managed (15 min) + restaurar backup Dataverse desde Azure Blob (60-90 min). 3) Si fallo parcial: rollback de solución (reimportar versión anterior, 20 min). 4) Comunicar estado cada 30 min. Test de DR: simulacro trimestral documentado con tiempo real de recuperación vs RTO objetivo.

---

### Módulo 37: Estrategias de Migración Empresarial

**P1 (Selección única):** ¿Qué enfoque de migración reduce el riesgo al máximo al migrar un sistema crítico a Power Platform?

- A) Big Bang: migrar todo en un solo fin de semana y apagar el sistema legacy ❌ — Máximo riesgo; si falla, no hay sistema operativo el lunes
- B) **Strangler Fig Pattern: migrar funcionalidades por módulos, manteniendo el sistema legacy activo hasta que Power Platform reemplace el 100% ✅** — Mínimo riesgo; el legacy es el fallback en cada etapa
- C) Migración spaghetti: migrar los datos pero mantener la lógica de negocio en el sistema legacy ❌ — Crea dependencia permanente y no resuelve el problema
- D) Migración paralela indefinida: correr ambos sistemas para siempre con sincronización ❌ — Doble mantenimiento insostenible; debe ser temporal con fecha de corte definida

**P2 (Selección única):** ¿Qué tipo de migración de datos es más seguro para un sistema con 10 millones de registros históricos?

- A) Importar todos los registros en un solo batch via Import de Power Platform ❌ — Los imports masivos en un solo lote generan timeouts y bloqueos
- B) Usar Excel como formato intermedio para importar los 10M registros ❌ — Excel tiene límite de 1M filas y no es el mecanismo para volúmenes de migración masiva
- C) **Migración incremental por lotes (Azure Data Factory o Dataverse Bulk API) con validación de integridad referencial por lote y posibilidad de reanudar desde el último lote exitoso ✅**
- D) Copiar directamente la base de datos SQL subyacente de Dataverse ❌ — No tienes acceso directo al SQL de Dataverse; y una copia directa corrupta el modelo semántico

**P3 (Caso práctico):** Diseña la hoja de ruta de migración de un CRM legacy a Dynamics 365 / Power Platform.

> **Respuesta modelo:** Fase 0 - Análisis (4 semanas): inventario del CRM legacy (módulos, integraciones, volumen de datos). Identificar registros "activos" (últimos 3 años) vs históricos. Mapear usuarios y roles. Fase 1 - Fundamentos (6 semanas): configurar Dataverse, tablas, Security Roles, soluciones, ALM. Fase 2 - Migración de datos históricos (3 semanas): Azure Data Factory exporta desde legacy → transforma → carga en Dataverse con Bulk API en lotes de 5,000 registros. Fase 3 - Módulos funcionales (12 semanas): migrar módulo a módulo (Cuentas → Contactos → Oportunidades → Actividades) con el Strangler Fig. Período de paralelo por módulo: 2 semanas. Fase 4 - Corte (1 semana): migración delta de datos creados durante el período de paralelo → cutover definitivo del módulo. Fase 5 - Retiro del legacy: apagar módulo por módulo tras 30 días sin incidentes críticos.

---

### Módulo 38: IA y Copilot en la Empresa

**P1 (Selección única):** ¿Qué mecanismo de Copilot Studio garantiza que las respuestas generadas por IA solo provengan de fuentes aprobadas por la empresa?

- A) Deshabilitar completamente las Generative Answers ❌ — Deshabilita la capacidad; no la controla
- B) Limitar los Topics a respuestas estáticas sin IA ❌ — Elimina el valor de la IA generativa
- C) **Configurar Knowledge Sources específicas (SharePoint interno, sitios aprobados) y desactivar Bing Search; el bot solo responde desde esas fuentes ✅**
- D) Agregar un Topic de "validación de respuesta" antes de cada respuesta ❌ — No existe este mecanismo en el ciclo de vida de respuesta de Copilot Studio

**P2 (Selección múltiple):** ¿Cuáles DOS consideraciones de gobernanza son críticas al desplegar Copilot en toda la empresa?

- A) **Definir políticas de uso aceptable de IA y comunicarlas a todos los usuarios antes del despliegue ✅**
- B) Deshabilitar el logging de conversaciones del Copilot para proteger la privacidad de los usuarios ❌ — El logging es necesario para auditoría y mejora continua del bot
- C) **Implementar Content Moderation y Topic Management: revisar mensajes fallidos semanalmente y crear nuevos topics para patrones frecuentes ✅**
- D) Usar una sola instancia del Copilot para toda la empresa sin personalización por departamento ❌ — Los copilots deben especializarse por audiencia y fuente de conocimiento para ser más efectivos

**P3 (Caso práctico):** Diseña la estrategia de adopción de IA con Copilot para una empresa de 2,000 empleados.

> **Respuesta modelo:** Gobernanza primero: AI Council (CISO, CTO, Legal, HR) → política de uso de IA aprobada. Casos de uso prioritarios: IT Helpdesk (FAQ y creación de tickets), RRHH (consulta de políticas y vacaciones), Ventas (consulta de estado de oportunidades). Piloto (mes 1-2): 50 usuarios por caso de uso. KPIs: tasa de resolución sin escalamiento, satisfacción del usuario (CSAT), reducción de tickets de soporte. Roll-out por olas: mes 3 (200 usuarios), mes 4-5 (800 usuarios), mes 6 (todos). Copilots por departamento con Knowledge Sources específicas: no un copilot genérico. Monitoreo continuo: dashboard semanal de topics sin respuesta → retroalimentar KB. Formación: módulo de 2h "Cómo usar el Copilot de IT" para todos. Centro de Excelencia IA: equipo de 2 personas que mantiene y mejora los copilots.

---

### Módulo 39: Arquitectura Multicloud y Híbrida

**P1 (Selección única):** ¿Qué servicio de Azure actúa como capa de abstracción y seguridad entre Power Platform y múltiples APIs backend?

- A) Azure Service Bus ❌ — Mensajería asíncrona; no es una capa de proxy/gateway para APIs REST
- B) Azure Logic Apps ❌ — Flujos de integración; no es un API gateway
- C) **Azure API Management (APIM) ✅** — Gateway de APIs: autenticación unificada, throttling, versioning, logging, transformación de mensajes y política de seguridad centralizada
- D) Azure Front Door ❌ — CDN y balanceador global de aplicaciones web; no es un API gateway de integración para Power Platform

**P2 (Selección múltiple):** ¿Cuáles DOS beneficios aporta Azure API Management en una arquitectura Power Platform multicloud?

- A) **Política de throttling centralizada: previene que Power Platform sature el backend con demasiadas llamadas simultáneas ✅**
- B) **Cache de respuestas API: mejora el rendimiento de Power Platform cuando llama a APIs que retornan datos que no cambian frecuentemente ✅**
- C) Eliminación de la necesidad de Custom Connectors en Power Platform ❌ — APIM no reemplaza a los Custom Connectors; los Custom Connectors apuntan a APIM
- D) Almacenamiento de datos estructurados en lugar de Dataverse ❌ — APIM no almacena datos de negocio; es un proxy de APIs

**P3 (Caso práctico):** Diseña una arquitectura Power Platform + Azure para una empresa con sistemas en AWS y on-premises simultáneamente.

> **Respuesta modelo:** Conectividad: Azure ExpressRoute a on-premises (baja latencia, alta seguridad) + Azure VPN Gateway como backup. AWS: Azure API Management consume APIs de AWS vía internet con TLS mutual + IP whitelisting. Hub de integración: APIM centraliza todas las APIs externas (AWS, on-premises, terceros). Custom Connectors de Power Platform apuntan siempre a APIM; nunca directamente a los backends. Identity: Azure AD B2B para partners externos + Azure AD federated con AWS IAM para operaciones cross-cloud. Dataverse como fuente de verdad de datos transaccionales. Azure Synapse Analytics consolida datos de los 3 clouds para reporting en Power BI (DirectQuery a Synapse). Monitoreo: Azure Monitor + Application Insights cubre toda la capa Azure; CloudWatch para AWS; dashboards consolidados en Azure Monitor Workbooks. Costs: Azure Cost Management + alertas de presupuesto por servicio.

---

### Módulo 40: Consultoría y Liderazgo Técnico

**P1 (Selección única):** ¿Cuál es la responsabilidad principal de un Arquitecto de Soluciones Power Platform en una implementación empresarial?

- A) Escribir la mayoría del código del proyecto para garantizar calidad técnica ❌ — El Arquitecto guía, revisa y decide; no es el principal desarrollador
- B) Gestionar el presupuesto del proyecto y los recursos humanos ❌ — Eso es responsabilidad del Project Manager/PMO
- C) **Tomar y documentar las decisiones técnicas clave, garantizar la alineación con los objetivos de negocio, y asegurar que la solución sea sostenible, segura y escalable a largo plazo ✅**
- D) Realizar todas las demos técnicas con el cliente para cerrar la venta ❌ — Las demos son responsabilidad de ventas/preventa; el Arquitecto puede apoyar pero no es su rol principal

**P2 (Selección múltiple):** ¿Cuáles DOS habilidades no técnicas son críticas para un Arquitecto de Soluciones Senior?

- A) **Facilitar workshops de descubrimiento con stakeholders de negocio para extraer requisitos no obvios y validar asunciones ✅**
- B) Conocer todos los detalles de implementación de cada componente de Power Platform de memoria ❌ — Importante saber buscar; el conocimiento profundo de todo en detalle no es posible ni necesario
- C) **Comunicar trade-offs técnicos complejos en lenguaje de negocio comprensible para ejecutivos que toman decisiones de inversión ✅**
- D) Programar el 100% del tiempo sin participar en reuniones de cliente ❌ — El Arquitecto debe tener alta presencia con el cliente

**P3 (Caso práctico):** Facilita el diseño de una solución para un cliente que no tiene claros sus requisitos.

> **Respuesta modelo:** Técnica: Design Thinking Workshop (2 días). Día 1 - Empatizar y Definir: entrevistas a 3 roles: usuarios finales (¿qué es doloroso hoy?), managers (¿qué métricas les importan?), IT (¿qué restricciones técnicas hay?). Diagrama de flujo del proceso actual con post-its (físicos o FigJam). Identificar los 3 dolores principales por votación del equipo. Día 2 - Idear y Prototipar: brainstorm de soluciones sin restricciones (crazy 8s). Votación del equipo en las ideas. Diseñar wireframes de baja fidelidad de la solución ganadora con papel o Figma en 2h. Validar wireframes con 2 usuarios finales el mismo día. Resultado: Problem Statement documentado, Solution Sketch aprobada, criterios de éxito (KPIs) acordados con el cliente, y ADR de las 3 decisiones arquitectónicas más importantes. El cliente firma el workshop output antes de comenzar el desarrollo.

---

### Módulo 41: Proyecto Capstone — Arquitectura Enterprise

**P1 (Selección única):** ¿Qué artefacto de documentación es más crítico para la sostenibilidad a largo plazo de una solución empresarial Power Platform?

- A) Manual de usuario con capturas de pantalla ❌ — Valioso para usuarios finales; no es el más crítico para sostenibilidad técnica
- B) Diagrama de flujo de cada proceso automatizado ❌ — Útil, pero si el código está bien estructurado, es secundario
- C) **Architecture Decision Records (ADRs) + diagrama de arquitectura técnica actualizado + runbook operacional ✅** — Estos tres permiten que cualquier arquitecto nuevo entienda por qué se tomó cada decisión, cómo está construido todo, y cómo operar la solución
- D) Historial de commits de Git ❌ — El historial es evidencia; no documentación arquitectónica explicativa

**P2 (Selección única):** ¿Cuál es la diferencia entre un "Solution Assessment" y un "Architecture Review" en el contexto Power Platform?

- A) No hay diferencia; ambos términos se usan indistintamente ❌ — Tienen focos diferentes aunque se solapan
- B) El Solution Assessment es más caro y solo lo hace Microsoft directamente ❌ — Ambos pueden realizarlos consultores certificados
- C) **El Solution Assessment evalúa la salud general de una implementación existente (técnica, negocio, adopción, costos); el Architecture Review se enfoca en decisiones técnicas y calidad del código ✅**
- D) El Architecture Review solo aplica a soluciones con más de 50 usuarios ❌ — Aplica independientemente del número de usuarios; depende de la criticidad y complejidad

**P3 (Caso práctico Capstone):** Entrega la arquitectura completa de una plataforma empresarial de gestión de proyectos para una empresa de consultoría de 500 personas.

> **Respuesta modelo completo (síntesis):** Dataverse: tablas `sit_proyecto`, `sit_fase`, `sit_tarea`, `sit_recurso`, `sit_timesheet`, `sit_cliente`, `sit_entregable`. Security: 5 Security Roles (Consultor, PM, Director, Cliente-Externo, Admin). Hierarchy Security: Directores ven todos los proyectos de su práctica. Field Security: columnas de costo y margen solo para Finanzas y Directores. Apps: Model-Driven (PMs y Directores, gestión completa), Canvas App móvil (Consultores, registro diario de timesheets y avance de tareas), Power Pages (clientes, seguimiento de sus proyectos — solo lectura de entregables aprobados). Copilot Studio: consulta de estado de proyectos por voz/texto, integrado en Teams. Power Automate: pipeline de aprobación de timesheets, alertas de riesgo (tarea >80% del tiempo sin completar), generación automática de informes semanales. Power BI: dashboard ejecutivo (margen por proyecto, utilización de recursos, forecast de revenue). Plugins: PreOperation en Timesheet (valida que horas no excedan 12/día y que el recurso esté asignado al proyecto). PCF: control de Gantt personalizado en formulario de Proyecto. ALM: Azure DevOps con 3 pipelines (DEV→UAT→PROD), Solution Checker gate, aprobación del Arquitecto para PROD. Azure Integration: Service Bus para eventos críticos, APIM para ERP de RRHH y Facturación. Microsoft Purview: clasificación de datos de clientes y contratos. DR: RPO 1h, RTO 4h, backups en Azure Blob. Licenciamento: Power Apps Premium para todos los 500 consultores (acceso completo); Power Pages para clientes (no requieren licencia interna). Costo estimado optimizado: implementar RLS granular para evitar que consultores vean datos de proyectos de otras prácticas (reducción de riesgo de confidencialidad más que de costo).

---

*Banco de preguntas generado según el estándar Master Prompt de PlanEstudio. Umbrales: 70%+ aprobación. Revisión recomendada: trimestral.*
