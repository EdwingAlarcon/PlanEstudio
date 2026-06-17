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
- **Tipos de relaciones:** Dataverse soporta cuatro patrones: 1:N (padre-hijo, ej. Proyecto → Tareas), N:N nativa (tabla de intersección gestionada automáticamente por la plataforma), N:N manual (tabla de intersección propia con columnas adicionales, ej. `sit_oportunidad_etiqueta` con campo `sit_relevancia`), y Polimórfica (un Lookup que puede apuntar a múltiples tablas, como el campo `sit_referencia` que acepta Cuenta o Contacto). Las relaciones definen el comportamiento en cascada (Cascade) para operaciones de Asignar, Compartir, Eliminar y Desactivar.

- **Columnas calculadas:** campo de solo lectura en Dataverse cuyo valor se recalcula en el servidor cada vez que se solicita el registro (no se almacena en la base de datos). Utiliza sintaxis clásica de expresiones (no Power Fx). Son filtrables y buscables en FetchXML. Ejemplo: `sit_costo` en tabla Tarea calculado como `sit_horas_reales * sit_tarifa_hora`. Diferencia clave vs Rollup: solo pueden referenciar campos del mismo registro o de registros padre mediante RELATED.

- **Columnas Rollup:** campo de solo lectura en Dataverse que agrega automáticamente valores desde registros hijos relacionados (Sum, Count, Min, Max, Avg). Se recalculan en segundo plano cada 12 horas por un system job, o de forma inmediata al abrir el registro padre. Diferencia clave vs Columnas Calculadas: Rollup atraviesa relaciones 1:N, mientras que Calculadas solo usan campos del mismo registro. Soportan filtros sobre los registros hijos (ej. solo sumar tareas con estado=Completada). Ejemplo: `sit_costoreal` en tabla Proyecto suma el `sit_costo` de todas las Tareas relacionadas con estado=Completada.

- **Reglas de negocio:** lógica declarativa sin código que se configura visualmente en el diseñador de tablas y se ejecuta automáticamente en el formulario (cliente) y/o al guardar (servidor). Soportan acciones como: mostrar/ocultar campos, requerir/no requerir campos, bloquear campos, establecer valores, y mostrar mensajes de error. Tienen dos alcances: "Solo formulario" (solo en la UI) y "Entidad" (también en API y flujos). Ejemplo: regla que bloquea edición de `sit_presupuesto` cuando `sit_estado` = "Cancelado".

- **Business Process Flow (BPF):** flujo visual de etapas que guía al usuario a través de un proceso de negocio multi-paso en un formulario Model-Driven. Cada etapa tiene pasos (campos obligatorios o recomendados) y puede incluir acciones (cambiar estado, llamar flujo). Se almacena como un registro en una tabla específica del BPF. Puede abarcar múltiples tablas (ej. Prospecto → Oportunidad → Pedido). Soporta hasta 30 etapas y puede tener ramas condicionales.

- **Seguridad a nivel de campo (Field Security Profile):** mecanismo que restringe la visibilidad y edición de columnas específicas independientemente del Security Role de la tabla. Se configura en tres niveles: lectura, creación y actualización. Los perfiles son aditivos: si un usuario tiene dos perfiles y uno permite lectura, puede leer. Se asignan a usuarios individuales o a equipos (Teams). Ejemplo: perfil `Perfil Financiero Proyecto` que permite lectura pero prohíbe escritura en `sit_presupuesto` para el rol Jefe de Proyecto.

- **Auditoría de Dataverse:** sistema de registro automático que captura quién cambió qué campo, cuándo y desde qué valor a qué valor. Se activa por ambiente y luego por tabla y columna. Los registros de auditoría se almacenan en la tabla `Audit` del sistema y son accesibles desde el formulario (historial de auditoría) y desde el Admin Center. Indispensable para trazabilidad en tablas financieras, RR.HH. y cumplimiento regulatorio. Considerar el impacto en almacenamiento: los logs de auditoría consumen capacidad.

- **Búsqueda de Dataverse (Relevance Search):** motor de búsqueda full-text basado en Azure Cognitive Search que indexa el contenido de múltiples tablas y permite búsquedas cross-tabla desde la barra de búsqueda global. Diferencia vs búsqueda rápida: Relevance Search busca en todos los campos indexados de múltiples tablas simultáneamente, es más rápida y soporta búsqueda difusa y por relevancia. Requiere configuración de qué columnas indexar por tabla. Puede tardar hasta 15 minutos en indexar nuevos datos.

- **Calculated vs Formula columns:** ambas producen valores derivados de solo lectura, pero difieren en la sintaxis y capacidades. Las Columnas Calculadas usan la sintaxis clásica de Dataverse (campo de fórmula en el diseñador) y son filtrables en FetchXML avanzado. Las Columnas de Fórmula (Formula columns) usan Power Fx (la misma sintaxis de Canvas Apps) y son más expresivas (soportan lógica condicional compleja, funciones de texto avanzadas), pero no son filtrables en consultas OData directas. Elegir Formula columns para lógica compleja; Calculated para columnas que necesitan ser criterio de filtro en vistas y flujos.

- **Duplicate Detection Rules:** reglas configurables que comparan campos de un registro nuevo o editado contra registros existentes para detectar posibles duplicados antes de guardar. Se definen mediante criterios de coincidencia (exacta, primeros N caracteres, mismos valores) sobre campos seleccionados. Se pueden activar en creación, actualización o importación masiva. El usuario recibe una advertencia y puede ignorarla o cancelar la operación. Ejemplo: regla que detecta duplicados de Cuenta cuando `sit_nit` es igual o cuando `sit_nombre` coincide en los primeros 10 caracteres.

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
- **Component Library:** contenedor especial en Power Apps que almacena componentes Canvas reutilizables de forma independiente de cualquier aplicación. Se publica por separado y puede ser importada por múltiples apps. Cuando se actualiza la librería y se publica, todas las apps que la usan pueden aceptar la actualización con un solo clic (sin necesidad de editar cada app). Una librería puede contener N componentes. Permite estandarizar UI a nivel organizacional. Ejemplo: librería `SIT Component Library` con componentes `cmpHeader`, `cmpStatCard`, `cmpSearchBox` usados en 15 aplicaciones del banco.

- **Custom Component:** control Canvas que encapsula un conjunto de controles, lógica y propiedades en una unidad reutilizable con una interfaz definida (inputs/outputs). Se comporta como una caja negra: el desarrollador de la app solo interactúa con sus propiedades, sin ver la implementación interna. Soportan propiedades de Behavior (funciones que el padre puede llamar). Ejemplo: `cmpHeader` que expone `TituloApp`, `ColorFondo`, `MostrarBtnVolver` como propiedades de entrada.

- **Input Properties:** propiedades de entrada del componente que actúan como parámetros de configuración que recibe desde la app padre. Se definen con un tipo (Texto, Número, Color, Boolean, Registro, Tabla) y un valor por defecto. El componente las lee pero no las puede modificar directamente (son de solo lectura dentro del componente). Ejemplo: `cmpStatCard.Titulo = "Total Solicitudes"` configura el texto visible de la tarjeta desde la app padre.

- **Output Properties / Custom Properties:** propiedades que el componente expone hacia afuera para que la app padre pueda leer valores calculados o resultados del componente. Son de tipo solo salida (el componente las establece, el padre las lee). Cruciales para componentes de entrada de usuario como buscadores o formularios embebidos. Ejemplo: `cmpSearchBox.TextoBusqueda` expone el texto actual del buscador para que la gallery en la app padre filtre sus items.

- **OnReset behavior:** propiedad de comportamiento especial de los componentes que define qué ocurre cuando el padre ejecuta `Reset(nombreComponente)`. Permite que el componente reinicie su estado interno (variables locales, TextInputs) sin necesidad de que el padre conozca los detalles internos. Útil para formularios reutilizables que deben limpiarse después de guardar.

- **Component Lifecycle:** ciclo que va desde la creación del componente en la librería, la publicación de la librería, la importación en las apps consumidoras, y la gestión de actualizaciones. Al publicar una nueva versión de la librería, las apps no se actualizan automáticamente — el desarrollador de cada app debe aceptar la actualización manualmente. Esto previene cambios disruptivos no deseados en apps en producción. Importante: siempre documentar breaking changes antes de publicar.

- **Named Formulas:** expresiones Power Fx declaradas en la propiedad `App.Formulas` (no en `App.OnStart`) que se evalúan de forma lazy (solo cuando se usan) y se recalculan automáticamente cuando sus dependencias cambian. A diferencia de variables en `OnStart` que se calculan una vez al inicio, las Named Formulas son reactivas. Permiten definir cálculos globales sin código imperativo. Ejemplo: `TotalSolicitudes = CountRows(colSolicitudes)` se recalcula automáticamente cada vez que `colSolicitudes` cambia.

- **With():** función Power Fx que crea un scope local con variables nombradas para evitar repetir expresiones complejas y mejorar la legibilidad. Funciona como un "let" local: `With({precioConIVA: precio * 1.19, descuento: precio * 0.05}, precioConIVA - descuento)`. Diferencia vs variables de contexto: With es una expresión (retorna un valor), no una instrucción imperativa. Ideal para cálculos intermedios dentro de una fórmula.

- **Delegation (Delegación):** mecanismo por el cual Power Apps transfiere el procesamiento de una consulta al origen de datos (Dataverse, SharePoint) en lugar de traer todos los registros al cliente. Una operación es "delegable" cuando el conector soporta ejecutarla en el servidor. Si no es delegable, Power Apps trae hasta 500 (o 2000) registros y aplica el filtro localmente, perdiendo datos. Ejemplo delegable: `Filter(Proyectos, sit_estado = "En Curso")` en Dataverse. No delegable en Sharepoint: `Filter(lista, StartsWith(Nombre, txtBusqueda.Text))`. Siempre revisar las advertencias de delegación (triángulo amarillo) en el editor de fórmulas.

- **Lazy Loading:** técnica de arquitectura en Canvas Apps para reducir el tiempo de carga inicial cargando datos solo cuando la pantalla que los necesita es navegada. Se implementa cargando colecciones en el evento `OnVisible` de cada pantalla en lugar de todas en `App.OnStart`. Combinar con Named Formulas para cálculos derivados. Impacto típico: reducción del tiempo de carga inicial de 8-15 segundos a 2-3 segundos en apps con múltiples fuentes de datos.

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

## MÓDULO 12: Power BI — DAX Avanzado

### 🎯 Objetivo
Dominar DAX avanzado: CALCULATE con múltiples filtros, contexto de filtro vs fila, funciones de inteligencia de tiempo, Row Level Security, y métricas de negocio complejas como cohortes y métricas móviles.

### 📖 Conceptos Clave
- **Contexto de filtro (Filter Context):** conjunto de todos los filtros activos en un momento dado que determinan qué filas participan en el cálculo de una medida. Proviene de tres fuentes: slicers del reporte, filtros de la página/visual, y filtros definidos en el modelo de datos (relaciones). Comprender el contexto de filtro es la clave para entender por qué una medida DAX retorna un valor específico en una celda particular. Ejemplo: en una tabla con filas por mes y columnas por región, cada celda tiene un contexto de filtro diferente (mes=Enero, región=Norte).

- **Contexto de fila (Row Context):** contexto creado durante la iteración fila por fila sobre una tabla, presente en columnas calculadas y en funciones iteradoras (SUMX, AVERAGEX, MAXX, FILTER). En el contexto de fila puedes referenciar cualquier columna de la tabla iterada directamente. No está presente en medidas simples (solo existe en iteradores). Ejemplo: en `SUMX(Ventas, Ventas[Cantidad] * Ventas[Precio])`, el contexto de fila permite multiplicar Cantidad × Precio de cada fila específica.

- **Transición de contexto:** comportamiento de CALCULATE que convierte automáticamente el contexto de fila actual en un contexto de filtro equivalente. Ocurre cuando CALCULATE se llama dentro de un iterador (SUMX, AVERAGEX, etc.) o en una columna calculada. Es uno de los conceptos más avanzados de DAX: permite que las medidas calculadas dentro de un iterador "filtren" la tabla por la fila actual. Comprenderlo es esencial para patrones como SUMX sobre medidas.

- **CALCULATE:** función central de DAX que evalúa una expresión en un contexto de filtro modificado. Acepta la expresión a calcular y N modificadores de filtro. Es la única función que puede modificar el contexto de filtro. Soporta dos tipos de argumentos: expresiones de tabla (que reemplazan el filtro de esa tabla) y funciones especiales como ALL, ALLEXCEPT, USERELATIONSHIP. Ejemplo: `CALCULATE([Total Ventas], Productos[Categoria] = "Electrónica")` calcula Total Ventas solo para productos de electrónica, independientemente del filtro de categoría actual.

- **ALL / ALLEXCEPT / ALLSELECTED:** modificadores de filtro para CALCULATE que controlan qué filtros se eliminan. `ALL(tabla)` elimina todos los filtros de la tabla (útil para porcentajes del total). `ALLEXCEPT(tabla, col1, col2)` elimina todos los filtros EXCEPTO los de las columnas especificadas (útil para cálculos dentro de grupos). `ALLSELECTED(tabla)` elimina los filtros internos del visual pero mantiene los slicers externos (% del total del subconjunto visible).

- **FILTER:** función DAX que itera una tabla y retorna las filas que cumplen una condición. Retorna una tabla, por lo que se usa dentro de CALCULATE u otras funciones de tabla. A diferencia de los modificadores directos en CALCULATE (más eficientes), FILTER crea un contexto de fila sobre la tabla completa antes de aplicar el filtro, lo que puede ser lento en tablas grandes. Usar modificadores directos cuando sea posible: `CALCULATE([M], Tabla[Col]="X")` es más rápido que `CALCULATE([M], FILTER(Tabla, Tabla[Col]="X"))`.

- **RELATED / RELATEDTABLE:** funciones para navegar relaciones en DAX. `RELATED(Tabla[Columna])` trae un valor de una tabla relacionada hacia el lado "muchos" (en un contexto de fila de la tabla hijo, obtiene el valor del padre). `RELATEDTABLE(Tabla)` retorna todas las filas de la tabla relacionada (desde el lado "uno" hacia el "muchos"). Ejemplo: en una columna calculada de tabla Ventas, `RELATED(Productos[Categoria])` obtiene la categoría del producto de esa venta.

- **Funciones de tiempo (Time Intelligence):** familia de funciones DAX que manipulan períodos de tiempo basándose en la tabla de calendario. Requieren una tabla de fechas marcada como "Tabla de fechas". Las principales: `DATEADD` (desplaza N períodos: -1 mes, +1 año), `TOTALYTD` / `TOTALMTD` / `TOTALQTD` (acumulados año/mes/trimestre hasta la fecha), `SAMEPERIODLASTYEAR` (mismo período del año anterior), `DATESINPERIOD` (rango de fechas desde un punto por N períodos), `DATESBETWEEN` (rango absoluto entre dos fechas). Ejemplo: `TOTALYTD([Total Ventas], 'Calendar'[Date])` retorna la venta acumulada del año hasta la fecha del filtro actual.

- **RANKX:** función DAX que calcula el ranking dinámico de una expresión sobre una tabla. Sintaxis: `RANKX(tabla, expresión, valor, orden, vínculos)`. El parámetro de vínculos acepta DENSE (sin saltos en el ranking) o SKIP (salta posiciones cuando hay empates). Funciona con el contexto de filtro actual, por lo que si hay un filtro de región, el ranking es dentro de esa región. Ejemplo: `RANKX(ALL(Clientes), [Total Ventas],, DESC, DENSE)` rankea todos los clientes por ventas, ignorando filtros, de mayor a menor.

- **Row Level Security (RLS):** mecanismo de Power BI que filtra los datos que un usuario puede ver basándose en su identidad (USERPRINCIPALNAME()). Se define en Power BI Desktop creando roles con expresiones DAX en tablas del modelo. Al publicar en Power BI Service, se asignan usuarios o grupos de Azure AD a cada rol. Los filtros de RLS se propagan por las relaciones del modelo (si filtras Vendedores, automáticamente se filtran Ventas, Productos vendidos, etc.). Los administradores del workspace ven todos los datos salvo que sean añadidos explícitamente a un rol.

- **Tablas de calendario:** tabla de fechas que contiene una fila por cada día del período de análisis y columnas adicionales para análisis temporal (Año, Mes, Trimestre, Semana, día de semana, etc.). Es requerida para que funcionen las funciones de Time Intelligence. Debe ser marcada como "Tabla de fechas" en el modelo y tener una columna de tipo Date sin huecos. Puede crearse con DAX (`CALENDAR()` + `ADDCOLUMNS()`), con Power Query, o importarse desde una fuente externa. Recomendación: siempre crear una tabla de fechas personalizada y desactivar el AutoDate/Time de Power BI.

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
// Ticket promedio por venta (patrón AVERAGEX sobre una tabla)
Ticket Promedio = 
AVERAGEX(
    Ventas,
    Ventas[Monto]
)

// Días promedio transcurridos desde inicio del año hasta cada venta
Antigüedad Promedio Días = 
AVERAGEX(
    Ventas,
    DATEDIFF(DATE(YEAR(Ventas[FechaVenta]), 1, 1), Ventas[FechaVenta], DAY)
)

// Total recalculado fila a fila (patrón SUMX — útil cuando el total depende de cálculo por fila)
Total Ventas SUMX = 
SUMX(Ventas, Ventas[Monto])
```
> **Nota:** AVERAGEX y SUMX iteran fila por fila (contexto de fila). Son más flexibles que AVERAGE/SUM pero más costosos en performance con tablas grandes. Úsalos cuando el cálculo por fila es distinto al valor almacenado (ej: precio × cantidad cuando el total no está pre-calculado en la tabla).

#### Actividad 12.5: RANKX y Top N dinámico
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

!!! tip "Prerequisito de Lenguaje"
    Este módulo requiere conocimientos básicos de **JavaScript**: funciones, callbacks, promesas, módulos ES6 y manipulación del DOM. Si es tu primer contacto con JavaScript, consulta el [Anexo de Lenguajes de Programación](../Anexos/LENGUAJES_PROGRAMACION.md) — sección JavaScript — antes de continuar.

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
- **Custom Connector:** componente de Power Platform que actúa como wrapper sobre una API REST externa, exponiendo sus operaciones como acciones y triggers consumibles en Power Automate, Power Apps y Copilot Studio sin escribir código de integración. Se basa en una definición OpenAPI, agrega configuración de autenticación, y transforma la API en una interfaz visual con campos descriptivos. Una vez creado, se puede compartir con toda la organización o certificar para el marketplace de Microsoft. Ejemplo: conector `Facturación Electrónica` que expone las operaciones `EmitirFactura` y `ConsultarEstado`.

- **OpenAPI (Swagger) spec:** estándar JSON/YAML para describir APIs REST de forma legible por máquinas. Especifica endpoints, métodos HTTP, parámetros, bodies de request/response, y esquemas de datos. Power Platform importa specs OpenAPI 2.0 (Swagger) y 3.0 para crear la base del conector. Herramienta recomendada para validar: `editor.swagger.io`. Consideraciones al crear specs para Power Platform: los `operationId` deben ser únicos y descriptivos (son los nombres de las acciones), los schemas deben estar completamente definidos (evitar `additionalProperties: true`).

- **Authentication types:** los conectores soportan cinco tipos de autenticación. `No auth`: API pública sin credenciales. `API Key`: clave estática en header o query parameter (ej. `X-API-Key`). `Basic`: usuario + contraseña en Base64. `OAuth 2.0`: flujo de autorización delegada con Azure AD u otro proveedor de identidad (más seguro, recomendado para APIs corporativas). `Windows Auth`: para APIs en redes internas con autenticación integrada de Windows. La autenticación se configura una vez en el conector y cada usuario crea su propia conexión.

- **Triggers vs Actions:** los conectores pueden exponer ambos tipos de operaciones. Las `Actions` son operaciones imperativas iniciadas por el flujo (GET, POST, PUT, DELETE). Los `Triggers` son operaciones que inician el flujo cuando ocurre algo en la API externa. Existen dos tipos de triggers: `Polling` (el conector llama periódicamente a la API para detectar cambios nuevos) y `Webhook` (la API llama al conector cuando ocurre un evento, más eficiente). Los triggers de webhook requieren que la API externa soporte registro y desregistro de webhooks.

- **Policy Templates:** transformaciones configurables que se aplican al request antes de enviarlo a la API o al response antes de entregarlo al flujo, sin escribir código. Templates disponibles: `Set Header` (agregar headers de autenticación o configuración), `Set Query Parameter` (agregar parámetros fijos), `Route Request` (redirigir a URL diferente según condición), `Convert Array to Object`, `Set Property`. Se configuran por acción en el editor del conector. Ejemplo: agregar automáticamente el header `X-Tenant-ID` con el valor del parámetro de conexión `tenant_id` a cada llamada.

- **Connector Certification:** proceso oficial de Microsoft para publicar un conector personalizado en el marketplace público de Power Platform, haciéndolo disponible para todos los usuarios de Power Platform globalmente. Requiere: spec OpenAPI válida, autenticación robusta, documentación completa, código de contribuidor registrado, y revisión de Microsoft. Existen dos niveles: `Independent Publisher` (cualquier desarrollador puede publicar) y `Certified Connector` (requiere asociación con el ISV o vendor de la API). Proceso completo tarda 4-8 semanas.

- **Connection Reference:** componente de soluciones ALM que actúa como abstracción de una conexión específica. En lugar de hardcodear la conexión directamente en un flujo o app, el componente referencia una Connection Reference nombrada (ej. `CR_SIT_Dataverse_Principal`). Al importar la solución en otro ambiente, el usuario debe configurar qué conexión real apunta esa referencia en el nuevo ambiente. Esto desacopla el componente de las credenciales del ambiente de desarrollo. Crítico para flujos en soluciones — sin Connection References, el flujo falla al importar.

- **Throttling:** límites de llamadas por minuto/hora/día que una API impone para protegerse de sobrecarga. Los conectores de Power Platform tienen throttling definido en sus propias políticas y heredan los límites de la API destino. Al exceder el límite, la API retorna HTTP 429 (Too Many Requests). Estrategias para manejar throttling: agregar `Delay` entre llamadas en loops, activar el retry automático del conector (configurable en Settings), diseñar flujos con batch operations en lugar de N llamadas individuales, y escalonar ejecuciones en tiempo.

- **Dynamic Schema / Dynamic Values:** capacidades avanzadas de conectores que permiten que las opciones o esquemas de una acción se carguen dinámicamente desde la API en tiempo de diseño. `Dynamic Values` (x-ms-dynamic-values): el campo muestra un dropdown con opciones obtenidas de la API (ej. lista de proyectos). `Dynamic Schema` (x-ms-dynamic-schema): el schema de los campos de respuesta se determina llamando a la API (útil cuando la API retorna estructuras variables según parámetros). Se configuran con extensiones OpenAPI específicas de Microsoft.

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
- **Topic:** unidad básica de conversación en Copilot Studio que define cuándo se activa (trigger phrases), qué preguntas hace, qué lógica ejecuta, y qué responde el agente. Es similar a una función en programación: tiene un punto de entrada (triggers), lógica interna (nodos), y puede llamar a otras funciones (redirigir a otros topics). Los topics del sistema (Fallback, Welcome, End of Conversation) son predefinidos y personalizables. Una buena práctica es tener topics pequeños y enfocados en una sola intención del usuario.

- **Trigger Phrases:** frases de ejemplo que el motor de NLU (Natural Language Understanding) del agente usa para aprender a reconocer la intención del usuario y activar el topic correcto. No son coincidencias exactas — el modelo NLU detecta variaciones semánticas. Mínimo 5-8 frases por topic, con variaciones en vocabulario, longitud y estilo (formal/informal, con/sin acentos, con errores tipográficos comunes). Cuantas más y más variadas sean las frases, mejor es la precisión. Ejemplo: para el topic "Consultar Estado": "¿cómo va mi solicitud?", "quiero ver mi ticket", "estado de mi caso", "revisar SOL-00123".

- **Entities:** tipos de datos estructurados que el agente identifica y extrae automáticamente del texto del usuario. Entidades del sistema: Fecha, Hora, Número, Email, URL, Porcentaje, Moneda, Nombre de Persona, Ciudad. Entidades personalizadas: listas cerradas (ej. categorías de IT con sinónimos) o expresiones regulares (ej. patrón `SOL-\d{5}` para números de solicitud). El agente usa las entidades detectadas para poblar variables sin necesidad de preguntar explícitamente al usuario.

- **Slot Filling:** comportamiento automático del agente por el cual, si una variable requerida (asociada a una entidad) no fue proporcionada en el mensaje del usuario, el agente pregunta por ella de forma inteligente. Si el usuario proporciona el valor antes de que se le pregunte (en el mismo mensaje del trigger), el slot filling lo detecta y no hace la pregunta. Ejemplo: si el topic necesita el número de solicitud y el usuario dice "quiero ver el estado de SOL-00123", el agente extrae el número automáticamente; si dice solo "quiero ver el estado de mi solicitud", el agente pregunta por el número.

- **Variables:** mecanismo de almacenamiento de datos durante una conversación. Tres alcances: `Topic.X` (local al topic, se pierde al salir), `Global.X` (persiste durante toda la conversación entre todos los topics), `System.X` (variables del sistema como `System.User.PrincipalName`, `System.Activity.Text`). Las variables de topic se crean automáticamente cuando se configura una pregunta. Las variables globales se crean en la sección de Variables del editor. Ejemplo: `Topic.NumeroSolicitud` guarda el número ingresado por el usuario en el topic de consulta.

- **Condición (Condition):** nodo de bifurcación en el flujo del topic que evalúa una expresión sobre el valor de una variable y redirige a diferentes ramas según el resultado. Soporta operadores: es igual a, no es igual a, contiene, está en blanco, es mayor/menor que. Las condiciones se encadenan con AND/OR. Se usa para personalizar respuestas según el estado obtenido, manejar casos de "no encontrado", o implementar lógica de escalamiento diferenciada.

- **Acción (Action):** nodo en un topic que ejecuta una operación externa: llamar a un flujo de Power Automate (el método más común para acceder a datos), llamar a un conector, ejecutar código (para escenarios avanzados), o usar un Knowledge Source para respuesta generativa. Al llamar un flujo de Power Automate, se mapean las variables del topic como inputs y los outputs del flujo se almacenan en variables del topic. Los flujos para Copilot Studio deben usar el trigger "When called from a Copilot Studio agent".

- **Respuestas Generativas (Generative Answers):** capacidad que permite al agente responder preguntas abiertas consultando automáticamente Knowledge Sources (documentos SharePoint, sitios web, archivos PDF) usando IA generativa, sin necesidad de crear topics específicos para cada pregunta posible. Cuando ningún topic coincide con la consulta del usuario, el Fallback topic puede invocar Generative Answers. La calidad depende de la calidad del contenido de los Knowledge Sources. Incluir instrucciones claras en el System Prompt para evitar alucinaciones ("no inventes información, responde solo con lo que encuentres en los documentos").

- **Escalamiento a Agente Humano:** nodo especial en Copilot Studio que transfiere la conversación y su historial a un agente humano live a través de Dynamics 365 Omnichannel for Customer Service u otras plataformas de contact center compatibles. Se activa cuando el bot no puede resolver la consulta o cuando el usuario lo solicita explícitamente. El agente humano recibe el transcript de la conversación para contexto. Configurar siempre un fallback de escalamiento — nunca dejar al usuario atascado en un loop sin salida.

- **Canal:** plataforma donde se despliega y accede el agente conversacional. Canales nativos disponibles: Microsoft Teams (el más común en entornos corporativos), sitio web personalizado (Web Chat con iframe embeddable), Power Pages, SharePoint. Canales externos via Azure Bot Service: WhatsApp, Facebook Messenger, Telegram, Slack, Twilio. Cada canal tiene sus propias capacidades de formato de mensaje (Teams soporta Adaptive Cards y formato rico; Web básico soporta markdown; WhatsApp solo texto e imágenes).

- **Knowledge Sources:** fuentes de contenido que el agente puede consultar para generar respuestas generativas. Tipos soportados: sitios de SharePoint (OneDrive incluido), URLs de sitios web públicos (el motor indexa las páginas), archivos subidos directamente (PDF, Word, PowerPoint), y Dataverse (en versiones avanzadas). El contenido se indexa y vectoriza para búsqueda semántica. Actualizar los Knowledge Sources cuando el contenido cambia — el agente no detecta cambios automáticamente.

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
- **Solución administrada (Managed):** paquete de solución importado en modo de solo lectura en el ambiente destino — los usuarios no pueden modificar directamente sus componentes (tablas, flujos, apps). Cualquier cambio debe realizarse en el ambiente fuente (DEV), re-exportar como Managed, y volver a importar. Esto protege la integridad del trabajo del implementador y facilita las actualizaciones controladas. Para personalizar componentes de una solución managed de un tercero, se usan "unmanaged layers" encima. Siempre exportar como Managed para TEST/UAT/PROD.

- **Solución no administrada (Unmanaged):** solución editable donde los componentes pueden modificarse directamente en el ambiente donde está importada. Es el formato de trabajo en el ambiente de desarrollo (DEV). Al exportar en modo Unmanaged, se puede compartir el trabajo entre desarrolladores. Peligro: si se importa Unmanaged en PROD, los usuarios pueden modificar componentes, creando divergencia entre ambientes. Nunca importar soluciones Unmanaged en ambientes de producción.

- **Connection Reference:** componente de solución que actúa como abstracción de una conexión específica en Power Platform. En lugar de vincular un flujo directamente a una conexión (que depende del usuario y ambiente), el flujo referencia una Connection Reference nombrada. Al importar la solución en otro ambiente, el administrador configura qué conexión real mapea cada Connection Reference. Esto desacopla el componente de las credenciales del desarrollador y habilita un verdadero ALM. Ejemplo: `CR_SIT_Dataverse_Principal` apunta a la conexión de Dataverse del ambiente destino.

- **Environment Variables:** pares nombre-valor definidos en la solución que permiten que la misma solución funcione en múltiples ambientes con configuraciones diferentes. Cada variable tiene un valor "por defecto" (definido en la solución) y un valor "actual" (configurado por ambiente, fuera de la solución). Tipos: Texto, Número decimal, Boolean, JSON, Secreto (almacenado en Azure Key Vault). Se acceden en flujos y código. Ejemplo: `sit_EmailNotificaciones` tiene valor `dev-notif@empresa.com` en DEV y `prod-notif@empresa.com` en PROD, sin cambiar el flujo.

- **Solution Layers:** sistema de superposición de soluciones en Dataverse que permite que múltiples soluciones modifiquen el mismo componente (tabla, formulario, flujo) en diferentes capas. La solución importada más recientemente prevalece sobre las anteriores. Visible en: Soluciones → seleccionar componente → "Ver capas de solución". Importantísimo al personalizar soluciones de terceros (como Dynamics 365): las personalizaciones van en una solución propia encima, no modificando la solución base.

- **Managed Properties:** configuraciones en los componentes de una solución managed que controlan qué puede modificar el importador. Se configuran antes de exportar. Opciones por componente: ¿puede personalizarse? (sí/no), ¿puede eliminarse?, ¿puede renombrarse?. Útil para ISVs que quieren proteger su IP intelectual: marcar formularios como no personalizables impide que el cliente los modifique directamente. Para soluciones internas, generalmente se deja todo personalizable para dar flexibilidad al implementador de campo.

- **Dependency tracking:** Dataverse registra automáticamente las dependencias entre componentes de una solución (qué flujos usan qué tablas, qué apps usan qué componentes, etc.). Si intentas eliminar un componente del que depende otro, Dataverse bloquea la operación y muestra las dependencias. Al construir soluciones, la herramienta "Solution Checker" detecta dependencias faltantes que causarían fallos al importar. Importante verificar dependencias antes de exportar: Solución → botón "Comprobación de solución".

- **Seguridad de ambiente (Power Platform Admin Center):** conjunto de controles administrativos para cada ambiente en el Admin Center. Incluye: quién puede crear aplicaciones y flujos (Configuración → Funciones de entorno), qué conectores están permitidos (DLP Policies), gestión de capacidad y almacenamiento, habilitación de características de Managed Environments, y auditoría de actividad. El administrador del ambiente puede ver todos los flujos y apps (incluso los no compartidos), lo que facilita la gobernanza.

- **DLP Policy (Data Loss Prevention):** política configurada en el Power Platform Admin Center que clasifica los conectores disponibles en tres grupos: `Business` (datos corporativos, pueden combinarse entre sí), `Non-Business` (datos personales/externos, pueden combinarse entre sí pero no con Business), y `Blocked` (no pueden usarse en ningún flujo en los ambientes cubiertos). La política previene que datos corporativos (Dataverse, SharePoint) se combinen con conectores externos no controlados (Twitter, Gmail). Se aplica por ambiente o a nivel de tenant. Ejemplo: política que pone HTTP genérico en Blocked en PROD para prevenir exfiltración de datos.

- **Security Roles:** conjuntos de permisos granulares sobre tablas de Dataverse que controlan qué operaciones puede realizar un usuario (Crear, Leer, Escribir, Eliminar, Agregar, Adjuntar, Asignar, Compartir) y en qué scope (Usuario, Unidad de Negocio, Organización, Padre:Hijo). Los roles se asignan a usuarios o equipos (Teams). Un usuario puede tener múltiples roles y los permisos son aditivos (el más permisivo gana). Los roles también controlan acceso a características de la plataforma (ver Analytics, exportar a Excel, personalizar el sistema).

- **Teams (Dataverse):** grupos de usuarios en Dataverse que permiten asignar Security Roles a un conjunto de personas en lugar de individualmente. Tipos: Owner Teams (tienen propietario, pueden poseer registros), Access Teams (no poseen registros, acceso puntual compartido), Azure AD Group Teams (sincronizados con grupos de Microsoft Entra ID, el más recomendado para entornos grandes). Usar AD Group Teams permite gestionar miembros desde Microsoft Entra sin tocar Power Platform.

- **Principio de mínimo privilegio:** práctica de diseño de seguridad que establece que cada usuario, rol o proceso debe tener solo los permisos estrictamente necesarios para realizar su función, nada más. En Dataverse implica: no asignar el rol "System Administrator" a usuarios finales, crear roles específicos por función (Jefe de Proyecto, Consultor, Auditor), usar Field Security Profiles para columnas sensibles, y revisar periódicamente los permisos asignados. Una violación de datos causada por exceso de permisos es un riesgo regulatorio y reputacional.

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
