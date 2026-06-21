# 🟢 NIVEL 1: BÁSICO
## De Cero a Primeras Soluciones Funcionales

**Duración:** 4-6 meses | **Dedicación:** 10-15 hrs/semana | **Total:** 240-360 horas  
**Certificación objetivo:** PL-900 (Microsoft Power Platform Fundamentals)  
**Prerequisitos:** Ninguno (punto de partida)

---

## 🎯 Objetivos del Nivel

Al completar este nivel serás capaz de:

- ✅ Comprender el ecosistema completo de Power Platform
- ✅ Modelar datos en Dataverse (tablas, columnas, relaciones básicas)
- ✅ Crear aplicaciones Canvas Apps funcionales
- ✅ Construir aplicaciones Model-Driven basadas en datos
- ✅ Automatizar procesos básicos con Power Automate
- ✅ Diseñar dashboards y reportes en Power BI
- ✅ Escribir fórmulas Power Fx para lógica de negocio
- ✅ Integrar componentes en una solución completa

---

## ⚡ Pre-Assessment: ¿Por Dónde Empezar?

Responde estas preguntas antes de comenzar. Si cumples el criterio de salto, ve directo al módulo indicado.

| # | Pregunta | Criterio de salto |
|---|----------|-------------------|
| 1 | ¿Puedes explicar qué es Dataverse y diferenciarlo de SharePoint? | Sí → salta Módulo 1 |
| 2 | ¿Has creado tablas con relaciones en una base de datos relacional (SQL, Access, etc.)? | Sí → comprime Módulo 2 a 1 semana |
| 3 | ¿Has usado Power Apps aunque sea con plantillas? | Sí → salta las prácticas 3.1 básicas de Módulo 3 |
| 4 | ¿Sabes qué es un trigger y una action en el contexto de automatización? | Sí → comprime Módulo 5 a 1 semana |
| 5 | ¿Has creado reportes en Power BI con al menos 3 visualizaciones? | Sí → salta práctica 6.1 y 6.2 de Módulo 6 |

**Si respondes Sí a 3 o más:** tu Nivel 1 realista es 2-3 meses, no 4-6.  
**Si respondes No a todas:** sigue el plan completo secuencialmente.

> Para validar si realmente puedes saltarte un módulo: haz el **Criterio de Validación** al final de ese módulo. Si lo cumples sin haberlo estudiado, estás habilitado para avanzar.

---

## 📚 Módulos del Nivel 1

### **Módulo 1: Introducción al Ecosistema Power Platform**
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Comprender la arquitectura, componentes y casos de uso de Power Platform.

#### 📖 Conceptos Clave
- **Arquitectura de Power Platform**: Componentes principales y su interrelación
- **Microsoft Dataverse**: Base de datos común (Common Data Service)
- **Ambientes (Environments)**: Tipos (producción, sandbox, developer)
- **Conectores**: Estándar vs Premium vs Personalizados
- **Soluciones**: Contenedores de componentes para ALM
- **Licenciamiento**: Per-user, per-app, pay-as-you-go
- **Power Platform Admin Center**: Gestión de ambientes y recursos
- **Center of Excellence (CoE)**: Introducción conceptual
- **AI Builder**: servicio de IA integrado en Power Platform que permite agregar inteligencia artificial a apps y flujos sin escribir código de ML. Modelos preconstruidos (clasificación de texto, extracción de datos de documentos, detección de objetos, predicción binaria) accesibles directamente desde Power Apps y Power Automate
- **Power Pages**: plataforma de bajo código para crear sitios web externos con acceso a datos de Dataverse. Antes llamado "Power Apps portals". Permite a usuarios anónimos o con cuenta externa (B2C) ver, crear y editar registros de Dataverse a través de formularios y vistas configurables

#### 👨‍💻 Actividades Prácticas

##### Práctica 1.1: Configurar Entorno de Desarrollo

1. Crear cuenta Microsoft 365 Developer (gratuita)
    - Acceder a https://developer.microsoft.com/microsoft-365/dev-program
    - Suscripción gratuita por 90 días renovables

2. Activar trial de Dynamics 365
    - Desde Power Platform Admin Center
    - Seleccionar Dynamics 365 Customer Service trial

3. Explorar Power Platform Admin Center
    - Crear ambiente tipo "Developer"
    - Configurar región (según ubicación)
    - Habilitar Dynamics 365 apps

##### Práctica 1.2: Exploración de Componentes

1. Acceder a https://make.powerapps.com
2. Navegar cada sección del menú lateral:
    - Home, Create, Learn, Apps, Tables, Flows, Copilots (Copilot Studio), AI Hub

3. Identificar conectores disponibles (Connectors > Premium vs Standard)
4. Revisar plantillas predefinidas (Templates)

##### Práctica 1.3: Primera Exploración de Dataverse

1. Ir a "Tables" en el menú
2. Explorar tablas estándar: Account, Contact, Email, Task
3. Abrir tabla "Account" y revisar:
    - Columns (columnas/campos)
    - Relationships (relaciones)
    - Business rules
    - Views (vistas)

4. Crear datos de prueba manualmente (5 registros de Account)

#### 💼 Caso Real de Negocio

**Empresa:** Laboratorio Farmacéutico NovaBio — 280 empleados, 2 plantas de producción  
**Problema:** El área de Calidad gestionaba no-conformidades (productos fuera de especificación) por email y hojas Excel. Los formularios llegaban incompletos, las aprobaciones tardaban semanas y era imposible auditar el proceso para la certificación ISO 9001.  
**Consecuencia:** Auditoría externa detectó que el 34% de los registros de no-conformidades estaban incompletos o sin respuesta en los tiempos requeridos.

**Solución con Power Platform:**
- **Dataverse:** tabla central de no-conformidades con estados, responsables, fechas límite y adjuntos de evidencia
- **Power Apps Canvas:** formulario digital que valida campos obligatorios antes de permitir el envío — eliminó registros incompletos desde el primer día
- **Power Automate:** flujo automático notifica al responsable al crear la no-conformidad; escala al supervisor si no hay respuesta en 48h
- **Power BI:** dashboard para el Jefe de Calidad con indicadores de tiempo de cierre por tipo, área y responsable

**Resultados a 6 meses:**
- 100% de registros completos (vs 66% previo)
- Tiempo de cierre promedio reducido de 18 días a 6 días
- Superó la siguiente auditoría ISO 9001 sin observaciones en el proceso de no-conformidades

**Por qué Power Platform:** Ningún componente requirió código. El equipo de Calidad configuró el sistema en 3 semanas sin soporte externo.

#### ✅ Buenas Prácticas
- Usar ambientes Developer/Sandbox para pruebas, nunca directamente en Production
- Nombrar ambientes con convenciones claras: `DEV-TuNombre`, `TEST-Proyecto`
- Documentar propósito de cada ambiente desde su creación
- No compartir credenciales de trial; crear usuarios de prueba en el tenant

#### ⚠️ Errores Comunes
- **Error**: Trabajar sin ambiente dedicado, modificar ambiente default
  - **Solución**: Siempre crear ambiente específico para aprendizaje

- **Error**: Confundir Dataverse con SharePoint
  - **Solución**: Dataverse es base de datos relacional, SharePoint es almacenamiento documental

- **Error**: No comprender límites de licencias trial
  - **Solución**: Revisar documentación de límites (usuarios, API calls, almacenamiento)

#### 🧪 Criterios de Validación
- [ ] Ambiente de desarrollo creado y funcional
- [ ] Acceso a Power Apps, Power Automate, Power BI confirmado
- [ ] 5+ registros de prueba en tabla Account de Dataverse
- [ ] Comprensión de diferencia entre conectores Standard y Premium
- [ ] Explicar con palabras propias qué es Dataverse y su propósito
- [ ] Identificar los 4 modelos preconstruidos más usados de AI Builder
- [ ] Describir para qué sirve Power Pages y en qué se diferencia de una Canvas App

---

### 📌 Suplemento 1A: AI Builder — Inteligencia Artificial sin código

> **Relevancia PL-900:** ~15% del examen. Capacidad de agregar IA a apps y flujos desde la interfaz, sin entrenar modelos desde cero.

#### 🎯 Objetivo
Comprender qué es AI Builder, sus modelos preconstruidos y cómo integrar IA en apps y flujos sin código de machine learning.

#### 📖 Conceptos Clave
- **Modelos preconstruidos (Prebuilt models):** listos para usar sin datos de entrenamiento propios:
  - *Business Card Reader:* extrae nombre, empresa, correo, teléfono de tarjetas de presentación
  - *Document Processing (Form Processing):* extrae campos estructurados de documentos PDF/imágenes (facturas, contratos)
  - *Text Classification:* clasifica texto libre en categorías definidas (soporte técnico, ventas, RR.HH.)
  - *Object Detection:* detecta objetos en imágenes (inventario, inspección de calidad)
  - *Sentiment Analysis:* analiza el sentimiento de texto como positivo, negativo o neutral
  - *Language Detection:* identifica el idioma de un texto
- **Modelos personalizados (Custom models):** se entrenan con datos propios del negocio; requieren conjunto de datos etiquetados
- **AI Builder Credits:** moneda de consumo para inferencias de IA. Los créditos se incluyen en licencias Premium de Power Platform o se adquieren por separado
- **Componente AI en Canvas Apps:** control nativo que añade funcionalidad de IA (ej. `AI.BusinessCard.Scanner`) directamente en formularios
- **Acción AI en Power Automate:** paso "AI Builder" que llama un modelo dentro de un flujo automatizado

#### 👨‍💻 Actividad Práctica: Procesar una tarjeta de presentación con AI Builder

**Paso 1 — Explorar el catálogo de modelos:**
1. Ir a [make.powerapps.com](https://make.powerapps.com) → menú lateral → **AI hub**
2. Explorar la galería de modelos preconstruidos; seleccionar **Business Card Reader**
3. Clic en **Try it out** y cargar una imagen de tarjeta de presentación
4. Observar los campos extraídos (nombre, empresa, email, teléfono)

**Paso 2 — Usar AI Builder en Power Automate:**
1. Crear un nuevo Flow: **Instant cloud flow** → disparador manual
2. Agregar paso: buscar **AI Builder** → seleccionar **Extract information from business cards**
3. Conectar con una imagen de ejemplo (archivo adjunto o URL)
4. Agregar paso: **Create a row** en Dataverse para guardar el resultado en una tabla de contactos

**Paso 3 — Explorar el modelo de Document Processing:**
1. En AI hub → **Document processing** → **Explore prebuilt model**
2. Cargar una factura o recibo de ejemplo en PDF
3. Revisar los campos extraídos: número de factura, fecha, total, proveedor

#### 💼 Caso Real de Negocio
Una empresa de logística recibe cientos de albaranes en papel diariamente. Con AI Builder + Power Automate: el proceso manual de transcripción se reemplaza por un flujo que digitaliza el documento al adjuntarlo en Teams, extrae número de guía, proveedor, cantidad y estado, y crea automáticamente el registro en Dataverse — reduciendo el tiempo de registro de 5 minutos a 15 segundos por documento.

#### ✅ Buenas Prácticas
- Usar modelos prebuilt antes de entrenar modelos custom — 70% de casos de negocio se resuelven sin entrenamiento propio
- Para Document Processing custom: recolectar mínimo 5 documentos de muestra por variante de formulario
- Monitorear el consumo de AI Builder Credits desde Power Platform Admin Center

#### ⚠️ Errores Comunes
- **Error**: Usar AI Builder en ambientes sin licencias Premium asignadas → los créditos de prueba se agotan sin aviso
  - **Solución**: Verificar créditos disponibles en Admin Center antes de producción
- **Error**: Esperar que Document Processing funcione en documentos no estructurados (cartas libres)
  - **Solución**: Document Processing es para formularios estructurados repetibles; para texto libre usar Text Classification o Azure AI Services

#### 🧪 Criterios de Validación
- [ ] Explorar el catálogo AI hub y probar Business Card Reader con una imagen real
- [ ] Crear un flujo que use al menos un modelo AI Builder prebuilt
- [ ] Explicar qué son los AI Builder Credits y cómo se consumen

---

### 📌 Suplemento 1B: Power Pages — Sitios web externos con Dataverse

> **Relevancia PL-900:** ~10% del examen. Diferencia entre Power Pages y otras herramientas; casos de uso de portales externos.

#### 🎯 Objetivo
Comprender qué es Power Pages, sus capacidades principales y cuándo usarlo en lugar de Canvas Apps o Model-Driven Apps.

#### 📖 Conceptos Clave
- **Power Pages** (antes *Power Apps portals*): plataforma para crear sitios web públicos o con autenticación externa que interactúan con datos de Dataverse
- **Usuarios externos:** personas fuera de la organización (clientes, socios, ciudadanos) que acceden al sitio sin licencia de Microsoft 365
- **Table permissions:** controlan qué tablas de Dataverse puede leer/escribir cada rol de portal (Contact, Basic User, Anonymous User)
- **Webpages, Webforms, Webviews:** componentes de diseño del portal — páginas, formularios y vistas de tabla accesibles desde el sitio
- **Portal Studio / Pages Studio:** editor visual de bajo código para diseñar el sitio, similar al editor de Canvas Apps pero orientado a web externa
- **Authentication providers:** Power Pages soporta Azure AD, Azure AD B2C, LinkedIn, Google, Facebook y proveedor local
- **Liquid templates:** lenguaje de plantillas basado en Liquid (Open Source) para lógica condicional dentro de páginas del portal
- **Capacidades:** 1 sitio por ambiente, con su propia URL (`*.powerappsportals.com` o dominio custom)

#### 💼 Caso Real de Negocio
Un municipio necesita que los ciudadanos puedan registrar solicitudes de permisos de construcción en línea, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. Con Power Pages se crea un portal público donde:
- El ciudadano se registra con su correo (Azure AD B2C)
- Completa un formulario Webform que crea un registro de "Solicitud" en Dataverse
- Visualiza el historial de sus solicitudes mediante una Webview filtrada por su identidad
- El equipo municipal gestiona las solicitudes desde una Model-Driven App interna

#### ✅ Buenas Prácticas
- Configurar Table Permissions **antes** de abrir el portal a usuarios externos — por defecto todo está bloqueado
- Usar HTTPS y dominio personalizado en producción (`portal.municipio.gob`)
- Mantener Liquid templates simples; la lógica compleja debe ir en flujos de Power Automate

#### ⚠️ Errores Comunes
- **Error**: Creer que Power Pages reemplaza a Canvas Apps para usuarios internos
  - **Solución**: Power Pages es para usuarios **externos**; Canvas Apps y Model-Driven Apps son para usuarios **internos** con licencia
- **Error**: No configurar Table Permissions después de crear el portal
  - **Solución**: Sin Table Permissions, todos los datos son inaccesibles desde el portal (error 403)

#### 🧪 Criterios de Validación
- [ ] Explicar la diferencia entre Power Pages, Canvas Apps y Model-Driven Apps
- [ ] Describir un escenario donde Power Pages es la herramienta correcta vs Canvas App
- [ ] Identificar qué son Table Permissions y por qué son necesarias

---

### **Módulo 2: Dataverse - Fundamentos y Modelado Básico**
*Duración: 2-3 semanas*

#### 🎯 Objetivo
Dominar el modelado de datos en Dataverse para soportar aplicaciones de negocio.

#### 📖 Conceptos Clave
- **Tablas (Tables)**: Estándar vs Personalizadas, Virtual Tables
- **Columnas (Columns)**: Tipos de datos (Text, Number, Choice, Lookup, DateTime)
- **Relaciones (Relationships)**: One-to-Many, Many-to-One, Many-to-Many
- **Primary Name Column**: Campo principal de identificación
- **Ownership**: User/Team owned vs Organization owned
- **Publisher**: Prefijos de personalización
- **Soluciones**: Administradas vs No Administradas (introducción básica)
- **Auditoria**: Tracking de cambios en datos
- **Business Rules**: Lógica sin código

#### 👨‍💻 Actividades Prácticas

##### Práctica 2.1: Crear Tablas Personalizadas

*Caso: Sistema de Gestión de Solicitudes de TI*

1. **Crear tabla "Solicitud TI"**
    - Navegar a Tables > New table
    - Display name: `Solicitud TI`
    - Plural name: `Solicitudes TI`
    - Primary column: `Título de Solicitud` (Text)
    - Enable attachments: Sí
    - Ownership: User or team

2. **Agregar columnas personalizadas**:
   ```
    - Descripción (Multiline text)
    - Categoría (Choice): Hardware, Software, Red, Accesos, Otro
    - Prioridad (Choice): Baja, Media, Alta, Crítica
    - Estado (Choice): Nueva, En Proceso, Resuelta, Cerrada
    - Fecha Solicitud (Date and Time)
    - Fecha Resolución (Date Only)
    - Solicitante (Lookup → Contact)
    - Asignado a (Lookup → User)
   ```

3. **Configurar columnas**:
    - Marcar "Categoría" y "Estado" como Required (requeridas)
    - Configurar valor por defecto Estado = "Nueva"
    - Configurar valor por defecto Prioridad = "Media"

##### Práctica 2.2: Establecer Relaciones

1. **Relación One-to-Many**: Contact → Solicitudes TI
    - Una persona puede tener múltiples solicitudes
    - Ya creada al definir columna Lookup "Solicitante"
    - Revisar en tabla Contact > Relationships

2. **Crear tabla "Categoría Detallada"**
    - Columnas: Nombre, Descripción, SLA (Choice: 24h, 48h, 72h)
    - Relación: Categoría Detallada → Solicitudes TI (One-to-Many)

##### Práctica 2.3: Implementar Business Rules

*Regla 1: Auto-asignación de SLA según prioridad*

1. Abrir tabla "Solicitud TI" > Business rules > New
2. Condición: Si Prioridad = "Crítica"
3. Acción: Set Field Value → Campo personalizado "SLA Horas" = 4
4. Agregar condiciones para otras prioridades (Alta=8, Media=24, Baja=48)
5. Scope: All Forms

*Regla 2: Validación de fechas*

1. Nueva Business Rule
2. Condición: Si Estado = "Resuelta" y Fecha Resolución está vacía
3. Acción: Show Error Message → "Debe ingresar fecha de resolución"
4. Scope: All Forms

##### Práctica 2.4: Crear Vistas Personalizadas

1. **Vista: "Mis Solicitudes Abiertas"**
    - Filtro: Estado ≠ Cerrada AND Solicitante = Current User
    - Columnas: Título, Categoría, Prioridad, Estado, Fecha Solicitud
    - Orden: Prioridad DESC, Fecha Solicitud DESC

2. **Vista: "Solicitudes Pendientes Atención"**
    - Filtro: Estado = Nueva OR Estado = En Proceso
    - Columnas: Título, Solicitante, Categoría, Prioridad, Asignado a
    - Orden: Prioridad DESC

##### Práctica 2.5: Insertar Datos de Prueba

Crear manualmente 10 registros de Solicitudes con variedad de:

- Categorías diferentes
- Prioridades mixtas
- Estados variados
- Fechas distribuidas en últimos 30 días

#### 💼 Caso Real de Negocio

**Empresa:** Empresa de Logística TransCargo — 120 vehículos, flota propia  
**Problema:** Los activos de la empresa (vehículos, equipos de bodega, herramientas especializadas) se registraban en Excel. Asignaciones duplicadas, equipos prestados sin registro de devolución, sin historial de mantenimiento por activo. Al momento de una auditoría interna no podían demostrar quién tenía qué equipo ni en qué estado.  
**Consecuencia:** 3 camiones con seguros vencidos operando activos, costos de mantenimiento no atribuibles por unidad de negocio.

**Solución con Dataverse:**
- Tabla `sit_activo` con tipo, serial, estado (Disponible/Asignado/En Mantenimiento/Dado de Baja), fecha vencimiento seguro, valor
- Tabla `sit_asignacion` con Lookup a Activo y a Empleado, fechas de inicio y devolución, estado
- Tabla `sit_mantenimiento` con historial de intervenciones por activo
- Business Rule: bloquea asignación si el activo está en estado "En Mantenimiento" o "Dado de Baja"
- Vista "Seguros próximos a vencer" filtra activos con vencimiento en los próximos 30 días

**Resultados:**
- Control total de 120 vehículos y 340 equipos adicionales — trazabilidad completa en tiempo real
- Costo de mantenimiento atribuible por unidad: ahorro del 22% al identificar equipos con mantenimiento excesivo
- Cero activos en operación con documentación vencida desde la implementación

#### ✅ Buenas Prácticas

**Nomenclatura**:

- Nombres en español/inglés consistentes (elegir uno)
- Evitar espacios; usar guiones bajos: `Solicitud_TI`
- Publisher prefix: usar personalizado, no default `new_`

**Modelado**:

- Mantener tablas normalizadas (evitar redundancia)
- Usar Choices en lugar de strings para valores fijos
- Definir Required solo en campos críticos (mejor UX)
- Siempre establecer ownership correcta (impacta seguridad)

**Performance**:

- Limitar columnas en vistas (máx 8-10 visibles)
- Usar índices en columnas de filtrado frecuente
- Evitar Multiline text en primary column

**Documentación**:

- Agregar Description a cada tabla y columna personalizada
- Documentar propósito de Business Rules en Comments

#### ⚠️ Errores Comunes

1. **Error**: Crear columnas redundantes (ej: Full Name cuando existe First + Last Name)
    - **Solución**: Usar Calculated Columns o concatenar en Power Apps

2. **Error**: No definir Publisher antes de crear tablas
    - **Solución**: Crear Solution con Publisher personalizado primero

3. **Error**: Usar Text simple para listas desplegables
    - **Solución**: Siempre usar Choice (mejora integridad datos)

4. **Error**: Eliminar tablas estándar o modificar columnas del sistema
    - **Solución**: Extender con nuevas columnas, nunca modificar standard

5. **Error**: Relaciones circulares o mal diseñadas
    - **Solución**: Diagramar modelo antes de implementar, validar cardinalidad

#### 🧪 Criterios de Validación
- [ ] Tabla "Solicitud TI" con mínimo 7 columnas personalizadas creada
- [ ] 3+ relaciones establecidas y funcionales
- [ ] 2+ Business Rules implementadas y probadas
- [ ] 2+ vistas personalizadas configuradas
- [ ] 10+ registros de prueba con datos variados
- [ ] Explicar diferencia entre tabla Standard y Custom
- [ ] Describir cuándo usar One-to-Many vs Many-to-Many

---

### **Módulo 3: Power Apps Canvas - Primeras Aplicaciones**
*Duración: 2-3 semanas*

#### 🎯 Objetivo
Crear aplicaciones Canvas desde cero con controles, navegación y conexión a datos.

#### 📖 Conceptos Clave
- **Canvas vs Model-Driven**: Diferencias conceptuales y casos de uso
- **Controles**: Input, Label, Button, Gallery, Forms, Media
- **Propiedades**: Sintaxis de fórmulas, referencias a controles
- **Datasources**: Dataverse, SharePoint, Excel, SQL, Conectores
- **Contexto**: Variables globales vs locales, Collections
- **Navegación**: Screens, Navigate(), Back()
- **Delegación**: Límite de 500 registros, funciones delegables
- **Responsive Design**: Scaling, orientación
- **Temas (Themes)**: Branding corporativo

#### 👨‍💻 Actividades Prácticas

##### Práctica 3.1: Primera Canvas App - Lista de Tareas

*Objetivo: App de To-Do List con Dataverse*

**Paso 1: Configuración inicial**

1. Power Apps > Create > Canvas app from blank
2. Nombre: `Mi Lista Tareas`
3. Formato: Tablet (landscape)
4. Conectar a Dataverse (agregar tabla "Solicitud TI" del Módulo 2)

**Paso 2: Pantalla de Listado**

1. Insertar Gallery (Vertical)
    - Datasource: Solicitudes TI
    - Template: Title, Subtitle, Body
    - Title: `ThisItem.Título`
    - Subtitle: `ThisItem.Categoría`
    - Body: `Text(ThisItem.'Fecha Solicitud', "dd/MM/yyyy")`

2. Agregar Search Box arriba de Gallery
    - Fórmula Items del Gallery:
   ```javascript
   Search(
       'Solicitudes TI',
       SearchBox.Text,
       "cr123_título", "cr123_descripción"
   )
   ```

3. Agregar Button "Nueva Solicitud"
    - OnSelect: `Navigate(ScreenNueva, ScreenTransition.Cover)`

**Paso 3: Pantalla de Creación**

1. New Screen > Form
2. Insertar Edit Form control
    - DataSource: Solicitudes TI
    - Item: `Defaults('Solicitudes TI')`
    - Fields: Seleccionar Título, Descripción, Categoría, Prioridad

3. Configurar botones:
    - **Guardar Button**:
   ```javascript
   SubmitForm(Form1);
   Navigate(ScreenInicio, ScreenTransition.UnCover)
   ```
    - **Cancelar Button**:
   ```javascript
   ResetForm(Form1);
   Navigate(ScreenInicio, ScreenTransition.UnCover)
   ```

**Paso 4: Pantalla de Detalles**

1. Duplicate Screen de creación
2. Modificar Form:
    - Mode: `FormMode.View`
    - Item: `GallerySolicitudes.Selected`

3. Agregar Button "Editar"
    - OnSelect: `EditForm(Form2)`

4. Agregar navegación desde Gallery:
    - OnSelect de Gallery: `Navigate(ScreenDetalle, ScreenTransition.Cover)`

##### Práctica 3.2: Interactividad y Variables

*Agregar filtros dinámicos*

1. **Insertar Dropdown para filtrar por Estado**
   ```javascript
   // Items del Dropdown
   Distinct('Solicitudes TI', Estado)
   
   // Actualizar Items del Gallery
   Filter(
       'Solicitudes TI',
       Estado.Value = DropdownEstado.Selected.Value || IsBlank(DropdownEstado.Selected)
   )
   ```

2. **Contador de solicitudes**
    - Insertar Label
    - Text: `"Total: " & CountRows(GallerySolicitudes.AllItems)`

3. **Variable para modo oscuro**
   ```javascript
   // Button Toggle Dark Mode
   OnSelect: UpdateContext({IsDarkMode: !IsDarkMode})
   
   // Fill de Screen
   If(IsDarkMode, Color.Black, Color.White)
   
   // Color de Labels
   If(IsDarkMode, Color.White, Color.Black)
   ```

##### Práctica 3.3: Collections y Datos Locales

*Crear app de calculadora de presupuestos*

1. **Inicializar Collection en App.OnStart**
   ```javascript
   ClearCollect(
       ColPresupuestoItems,
       {Item: "Laptops", Cantidad: 0, PrecioUnit: 1200, Total: 0},
       {Item: "Monitores", Cantidad: 0, PrecioUnit: 300, Total: 0},
       {Item: "Mouses", Cantidad: 0, PrecioUnit: 25, Total: 0}
   )
   ```

2. **Gallery editable con input boxes**
    - Text Input para Cantidad
    - OnChange de Input:
   ```javascript
   UpdateIf(
       ColPresupuestoItems,
       Item = ThisItem.Item,
       {
           Cantidad: Value(TextInputCantidad.Text),
           Total: Value(TextInputCantidad.Text) * ThisItem.PrecioUnit
       }
   )
   ```

3. **Label Total General**
   ```javascript
   "Total: $" & Text(Sum(ColPresupuestoItems, Total), "$#,##0.00")
   ```

##### Práctica 3.4: Responsive Design

1. Usar contenedores (Insert > Container)
2. Configurar propiedades de layout:
    - LayoutDirection: Vertical / Horizontal
    - LayoutAlignItems: Start, Center, End
    - LayoutGap: 10

3. Usar formulas con Screen.Width:
   ```javascript
   // Gallery Width responsive
   If(Screen.Width < 768, Screen.Width - 20, Screen.Width * 0.6)
   ```

#### 💼 Caso Real de Negocio

**Empresa:** Hotel Boutique Terramar — 5 sedes en Colombia, 90 empleados operativos  
**Problema:** El control de visitas a oficinas administrativas era un cuaderno manual. Sin trazabilidad de quién ingresó, a qué hora salió, ni a quién visitó. En una auditoría de seguridad, detectaron que personas no autorizadas habían accedido a zonas restringidas sin registro.  
**Consecuencia:** Brecha de seguridad física, riesgo para datos confidenciales de huéspedes, no cumplían política de seguridad corporativa.

**Solución con Canvas App:**
- App en tablet en recepción: el visitante ingresa nombre, empresa, persona a visitar y foto (cámara integrada)
- Al registrar entrada: notificación automática al empleado visitado (Teams/email) para confirmar autorización
- Registro en Dataverse con timestamp de entrada y salida
- Galería de visitas activas visible para el recepcionista
- Botón de "marcar salida" que calcula duración de visita
- Restricción: si el empleado no confirma en 5 minutos, el flujo escala al jefe de seguridad

**Resultados:**
- Control de acceso en tiempo real desde el primer día de implementación
- Registro digital de 100% de las visitas con foto y hora exacta
- Tiempo de implementación: 2 semanas (1 desarrollador junior Power Platform)
- Costo: $0 adicional — incluido en licencias Microsoft 365 ya existentes

#### ✅ Buenas Prácticas

**Desarrollo**:

- Nombrar controles descriptivamente: `btnGuardar`, `galSolicitudes`, `txtBusqueda`
- Usar variables contextuales (UpdateContext) para estados locales de screen
- Usar variables globales (Set) para configuraciones transversales
- Documentar fórmulas complejas con comentarios `//`

**Performance**:

- Entender delegación: usar Filter(), Sort(), Search() delegables
- Evitar Addcolumns(), ForAll() en datasources grandes (> 500 registros)
- Usar Collections para datos pequeños o temporales
- Cargar datos una vez, reutilizar (no llamar Dataverse en cada control)

**UX**:

- Mostrar indicadores de carga (Spinner) en operaciones largas
- Validar inputs antes de SubmitForm
- Mensajes de error claros con Notify()
- Confirmar acciones destructivas (Pop-up modal)

**Seguridad**:

- No exponer datos sensibles en variables globales
- Filtrar datos según User() actual
- Usar roles de Dataverse, no lógica en app

#### ⚠️ Errores Comunes

1. **Error**: Gallery no muestra datos o solo 500 registros
    - **Causa**: Función no delegable o limit implícito
    - **Solución**: Usar Filter() con operadores delegables (=, <>, >, <, And, Or)
    - **Check**: Línea azul de delegación warning en formula bar

2. **Error**: "Name conflict" al referenciar columnas
    - **Causa**: Columna tiene nombre reservado (ej: Name, Value)
    - **Solución**: Usar comillas simples: `ThisItem.'Name'`

3. **Error**: Form no guarda cambios
    - **Causa**: SubmitForm() sin capturar resultado
    - **Solución**: 
   ```javascript
   SubmitForm(Form1);
   If(Form1.Error = Blank(), Navigate(Screen2), Notify("Error: " & Form1.Error))
   ```

4. **Error**: Pérdida de datos en variables al cambiar screen
    - **Causa**: Usar UpdateContext (local) en lugar de Set (global)
    - **Solución**: Evaluar scope necesario, usar Set para datos persistentes

5. **Error**: App lenta en carga inicial
    - **Causa**: Queries pesadas en OnStart o OnVisible sin caché
    - **Solución**: Cargar datos críticos en OnStart, lazy load el resto

#### 🧪 Criterios de Validación
- [ ] App con mínimo 3 screens conectadas con navegación funcional
- [ ] Gallery mostrando datos de Dataverse con búsqueda/filtros
- [ ] Form para crear y editar registros operativo
- [ ] Uso de mínimo 2 variables (global y contextual)
- [ ] Collection implementada con operaciones CRUD
- [ ] App publicada y compartida con otro usuario de prueba
- [ ] Explicar diferencia entre Canvas y Model-Driven
- [ ] Identificar 3 funciones no delegables y alternativas

---

### **Módulo 4: Power Apps Model-Driven - Apps Basadas en Datos**
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Construir aplicaciones Model-Driven aprovechando metadatos de Dataverse.

#### 📖 Conceptos Clave
- **Arquitectura Model-Driven**: Metadata-driven, auto-generada
- **Componentes**: Forms, Views, Charts, Dashboards, Business Process Flows
- **Site Map**: Navegación y estructura de áreas
- **Security Roles**: Permisos granulares por tabla/operación
- **Forms**: Main, Quick Create, Quick View
- **Quick View Forms**: mostrar datos de registros relacionados directamente en el formulario principal sin cambiar de pantalla
- **Subgrids**: mostrar y gestionar registros relacionados (1:N o N:N) embebidos dentro de un formulario Model-Driven
- **UCI (Unified Client Interface)**: Experiencia moderna
- **Modern App Designer** (2023+): nuevo diseñador visual unificado que reemplaza al editor clásico. Permite configurar páginas, tablas, formularios, vistas y navegación desde una sola interfaz. Es el editor predeterminado en todos los ambientes actuales — si las instrucciones mencionan el "diseñador clásico", selecciona **Switch to classic** en la barra superior si necesitas reproducir pasos del tutorial

#### 👨‍💻 Actividades Prácticas

##### Práctica 4.1: Crear Primera Model-Driven App

> **Nota de versión:** Las capturas y pasos a continuación describen el flujo general; la apariencia exacta puede variar según si tu ambiente usa el **Modern App Designer** (predeterminado desde 2023) o el diseñador clásico. La funcionalidad es equivalente en ambos.

**Paso 1: Crear app desde solución**

1. Power Apps > Solutions > New solution
    - Name: `Sistema Solicitudes TI`
    - Publisher: Crear nuevo con prefix `sit`

2. Dentro de solución > New > App > Model-driven app
3. Name: `Gestión Solicitudes TI`

**Paso 2: Configurar Site Map**

1. Click en "Edit site map" (diseñador clásico) o "Navigation" (Modern App Designer)
2. Estructura:
   ```
   Área: Solicitudes
      Group: Operación
         Subarea: Solicitudes TI (tabla)
         Subarea: Categorías
      Group: Configuración
         Subarea: Contactos
   
   Área: Reportes
      Group: Análisis
         Subarea: Dashboard Solicitudes
   ```

3. Guardar y publicar

**Paso 3: Personalizar Forms**

1. **Main Form de Solicitud TI**
    - Abrir tabla > Forms > Information (Main)
    - Estructura en tabs:
     ```
     Tab: General
        Section: Información Básica
           - Título
           - Categoría
           - Prioridad
           - Estado
        Section: Detalles
           - Descripción
           - Solicitante
           - Asignado a
     
     Tab: Resolución
        Section: Solución
           - Fecha Resolución
           - Notas de Resolución (multiline)
     
     Tab: Timeline
        - Timeline control (automático)
     ```

2. **Configurar Business Rules en el form**
    - Mostrar Tab "Resolución" solo si Estado = Resuelta o Cerrada
    - Hacer Required "Fecha Resolución" cuando Estado = Resuelta

3. **Quick Create Form**
    - Crear nuevo form tipo Quick Create
    - Solo campos esenciales: Título, Categoría, Prioridad, Descripción
    - Esto permite crear registros rápidos desde cualquier vista

**Paso 4: Personalizar Views**

1. **Vista "Solicitudes Activas"** (personal)
    - Filtro: Estado ≠ Cerrada
    - Columnas: Título, Solicitante, Prioridad, Estado, Fecha Solicitud
    - Orden: Prioridad (mayor a menor), Fecha Solicitud (más reciente)

2. **Vista "Mis Asignaciones"**
    - Filtro: Asignado a = Current User AND Estado ≠ Cerrada
    - Columnas: Título, Categoría, Prioridad, Fecha Solicitud
    - Orden: Fecha Solicitud (más antiguo primero)

3. **Vista Chart**: Solicitudes por Categoría
    - Insertar chart en vista
    - Tipo: Bar chart
    - Eje Y: Count of records
    - Eje X: Categoría

**Paso 5: Crear Dashboard**

1. New > Dashboard > 2-Column Regular Dashboard
2. Nombre: `Dashboard Solicitudes TI`
3. Componentes:
    - **Panel superior izquierda**: Chart "Solicitudes por Estado" (Donut)
    - **Panel superior derecha**: Chart "Solicitudes por Prioridad" (Column)
    - **Panel inferior**: List de "Solicitudes Pendientes" (View)

##### Práctica 4.2: Business Process Flow

*Crear flujo para ciclo de vida de solicitud*

1. Solutions > New > Other > Business Process Flow
2. Nombre: `Proceso Solicitud TI`
3. Table: Solicitud TI

4. **Stages (Etapas)**:
   ```
   Stage 1: Registro
      - Título (existing)
      - Categoría (existing)
      - Descripción (existing)
      Action: Validar información completa
   
   Stage 2: Asignación
      - Asignado a (existing)
      - Prioridad (existing)
      Action: Notificar asignado
   
   Stage 3: Resolución
      - Notas Resolución (existing)
      - Fecha Resolución (existing)
      Action: Cerrar solicitud
   
   Stage 4: Cierre
      - Feedback (new field: Choice - Satisfecho, Neutral, Insatisfecho)
      Action: Archivar
   ```

5. Configurar transiciones automáticas:
    - Al cambiar Estado a "En Proceso" → avanzar a Stage 2
    - Al cambiar Estado a "Resuelta" → avanzar a Stage 3

6. Guardar, activar y asignar a Security Role

##### Práctica 4.3: Configurar Seguridad

1. **Crear Security Roles**:

   **Role: Solicitante**
    - Solicitud TI: Create (Own), Read (Business Unit), Write (Own)
    - Contact: Read (Organization)
    - Categorías: Read (Organization)

   **Role: Técnico TI**
    - Solicitud TI: Create, Read, Write, Delete (Organization)
    - Contact: Read (Organization)
    - Todas las tablas del sistema: Read

   **Role: Administrador TI**
    - Solicitud TI: Todos los permisos (Organization)
    - Todas las tablas: Admin completo

2. **Asignar roles a usuarios de prueba**:
    - Settings > Security > Users
    - Seleccionar usuario > Manage Roles
    - Asignar role creado

3. **Probar con cada role**:
    - Login como cada usuario
    - Validar que solo ven datos según permisos
    - Verificar botones habilitados/deshabilitados

#### 💼 Caso Real de Negocio

**Escenario**: Sistema CRM de Gestión de Clientes para PyME

**Modelo de datos**:

- Account (Clientes)
- Contact (Personas de contacto)
- Opportunity (Oportunidades de venta)
- Quote (Cotizaciones)
- Lead (Prospectos)

**Business Process Flow**: Lead → Opportunity → Quote → Won/Lost

**Dashboards**:

- Embudo de ventas por etapa
- Top 10 clientes por revenue
- Actividades pendientes por vendedor

**Security**:

- Vendedores: Solo su cartera (Business Unit)
- Gerentes: Toda la región (Organization, read-only others)
- Dirección: Full access

**Automatización** (Power Automate):

- Lead asignado → Email bienvenida
- Opportunity en "Proposal" > 30 días → Alerta gerente
- Quote aceptada → Crear Deal en sistema ERP externo

#### ✅ Buenas Prácticas

**Diseño de Forms**:

- Máximo 3 tabs por form (evitar sobrecarga)
- Agrupar campos relacionados en sections
- Ocultar tabs/sections innecesarias según contexto con Business Rules
- Usar Quick View Forms para mostrar datos relacionados inline

**Performance**:

- Limitar columnas en vistas (8-10 máximo)
- No cargar todos los campos en forms (lazy load tabs)
- Usar vistas personales para filtros frecuentes
- Deshabilitar auto-save si no es necesario

**Usabilidad**:

- Nombres de vistas descriptivos y orientados a acción: "Revisar Hoy", no "Vista 1"
- Site map organizado por flujo de trabajo, no por entidades
- Dashboards con máximo 6 componentes (evitar saturación)
- Business Process Flow solo para procesos realmente estructurados

**Gobernanza**:

- Trabajar siempre dentro de Solutions (nunca en default)
- Publisher con prefix único por organización
- Documentar cada componente (description field)
- Versionar solutions antes de cambios mayores

#### ⚠️ Errores Comunes

1. **Error**: Usuarios no ven la app o datos
    - **Causa**: Falta Security Role asignado
    - **Solución**: Settings > Security > Users > Manage Roles + compartir app

2. **Error**: Business Process Flow no aparece en form
    - **Causa**: No está activado o no asignado a Security Role
    - **Solución**: Process > Activate + Security Roles tab en BPF

3. **Error**: Cambios en form no se reflejan
    - **Causa**: No se publicó customizations
    - **Solución**: Siempre Publish All Customizations después de cambios

4. **Error**: Dashboard no muestra datos actualizados
    - **Causa**: Cache del navegador o permisos en vistas subyacentes
    - **Solución**: Refresh browser, verificar security role en charts/views

5. **Error**: Site map no guarda o no aparece en app
    - **Causa**: Estructura inválida (subarea sin group, etc.)
    - **Solución**: Validar jerarquía: Area > Group > Subarea

#### 🧪 Criterios de Validación
- [ ] Model-Driven App publicada con site map de 2+ áreas
- [ ] 2+ forms personalizados (Main + Quick Create)
- [ ] 3+ vistas con filtros y columnas optimizadas
- [ ] 1 Dashboard con mínimo 3 componentes
- [ ] 1 Business Process Flow con 3+ stages funcional
- [ ] 2+ Security Roles configurados y asignados
- [ ] Probar app con distintos roles y verificar permisos
- [ ] Explicar cuándo usar Model-Driven vs Canvas

---

### **Módulo 5: Power Automate - Automatización Básica**
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

### **Módulo 6: Power BI - Reportes y Dashboards Básicos**
*Duración: 2 semanas*

#### 🎯 Objetivo
Crear reportes interactivos y dashboards conectados a Dataverse y otras fuentes.

#### 📖 Conceptos Clave
- **Componentes**: Power BI Desktop, Service, Mobile
- **Fuentes de datos**: Dataverse, Excel, SQL, APIs, Web
- **Modelo de datos**: Star schema, relaciones, cardinalidad
- **Transformaciones**: Power Query (M language)
- **Visualizaciones**: Charts, tables, maps, custom visuals
- **DAX básico**: Measures, calculated columns, funciones comunes
- **Filtros**: Page, visual, report level; slicers
- **Interactividad**: Cross-filtering, drill-down, tooltips
- **Publicación**: Workspaces, apps, compartir
- **Row-Level Security (RLS)**: Filtros de datos por usuario

#### 👨‍💻 Actividades Prácticas

##### Práctica 6.1: Conectar a Dataverse y Modelar

**Paso 1: Descargar e instalar Power BI Desktop**

1. Desde Microsoft Store o https://powerbi.microsoft.com

**Paso 2: Conectar a Dataverse**

1. Get Data > Power Platform > Dataverse
2. Environment URL: https://tuorg.crm.dynamics.com
3. Autenticar con cuenta organizacional
4. Seleccionar tablas:
    - Solicitudes TI
    - Contacts
    - Categorías

5. Transform Data

**Paso 3: Transformaciones en Power Query**

1. Tabla Solicitudes TI:
    - Remover columnas innecesarias (audit fields, metadata)
    - Renombrar columnas: `cr123_titulo` → `Título`
    - Cambiar tipos de datos si es necesario
    - Crear columna calculada: `Días Abierta`:
   ```m
   = Duration.Days(DateTime.LocalNow() - [Fecha Solicitud])
   ```

2. Tabla Contacts:
    - Mantener solo ID, Nombre Completo, Email, Departamento
   
3. Close & Apply

**Paso 4: Configurar relaciones**

1. Model view (ícono lateral)
2. Validar relación auto-creada: Solicitudes[Solicitante] → Contacts[ID]
3. Configurar cardinalidad: Many to One (*)
4. Cross filter direction: Single (desde Solicitudes hacia Contacts)

##### Práctica 6.2: Crear Visualizaciones Básicas

**Página 1: Overview General**

1. **KPI Cards**:
    - Card: Total Solicitudes
     - Visual: Card
     - Field: Count of Solicitudes[ID]
   
    - Card: Solicitudes Abiertas
     - Visual: Card
     - Field: Count of Solicitudes[ID]
     - Filter: Estado ≠ "Cerrada"
   
    - Card: Tiempo Promedio Resolución
     - Visual: Card
     - Measure (crear con DAX):
     ```dax
     Promedio Días Resolución = 
     AVERAGE(Solicitudes[Días Abierta])
     ```

2. **Chart: Solicitudes por Estado**
    - Visual: Donut chart
    - Legend: Estado
    - Values: Count of ID
    - Data colors: personalizar (Verde=Resuelta, Rojo=Nueva, etc.)

3. **Chart: Solicitudes por Categoría**
    - Visual: Bar chart (horizontal)
    - Axis: Categoría
    - Values: Count of ID
    - Sort: Descendente por valores

4. **Trend: Solicitudes por Mes**
    - Visual: Line chart
    - Axis: Fecha Solicitud (jerarquía Month)
    - Values: Count of ID
    - Habilitar drill-down a día

5. **Tabla: Top Solicitantes**
    - Visual: Table
    - Columns: 
     - Contacts[Nombre Completo]
     - Count of Solicitudes
    - Top N filter: Top 10

**Página 2: Análisis por Prioridad**

1. **Slicer: Filtro de Fecha**
    - Visual: Slicer
    - Field: Fecha Solicitud
    - Style: Between (range)

2. **Matrix: Prioridad vs Categoría**
    - Visual: Matrix
    - Rows: Prioridad
    - Columns: Categoría
    - Values: Count of Solicitudes
    - Conditional formatting: Data bars en celdas

3. **Chart: Distribución Días Abierta por Prioridad**
    - Visual: Box plot (custom visual - importar)
    - Category: Prioridad
    - Values: Días Abierta

##### Práctica 6.3: DAX Measures Básicas

Crear measures en tabla "Medidas" (nueva tabla calculada vacía):

1. **% Solicitudes Resueltas**
```dax
% Resueltas = 
DIVIDE(
    COUNTROWS(FILTER(Solicitudes, Solicitudes[Estado] = "Resuelta")),
    COUNTROWS(Solicitudes),
    0
)
```

2. **Solicitudes Vencidas SLA**
```dax
Vencidas SLA = 
CALCULATE(
    COUNTROWS(Solicitudes),
    FILTER(
        Solicitudes,
        Solicitudes[Días Abierta] > Solicitudes[SLA Horas] / 24 &&
        Solicitudes[Estado] <> "Cerrada"
    )
)
// FILTER es necesario cuando se comparan dos columnas de la misma tabla dentro de CALCULATE
```

3. **Promedio Días Resolución**
```dax
Promedio Días Resolución = 
AVERAGE(Solicitudes[Días Abierta])
```

4. **Solicitudes Este Mes**
```dax
Solicitudes Este Mes = 
CALCULATE(
    COUNTROWS(Solicitudes),
    DATESMTD(Solicitudes[Fecha Solicitud])
)
```

> **Nota:** Las funciones AVERAGEX con FILTER y el cálculo MoM con DATEADD son DAX avanzado — las verás en detalle en el **Módulo 12 (Nivel 2)** con el contexto correcto de inteligencia de tiempo.

##### Práctica 6.4: Interactividad y Drill-Through

1. **Configurar Cross-Filtering**
    - Seleccionar visual de Donut (Estado)
    - Format > Edit interactions
    - Configurar otros visuals: Highlight (no filter)

2. **Crear Drill-Through Page**
    - Nueva página: "Detalle Solicitud"
    - Drag field ID a Drill-through well
    - Visualizaciones:
     - Card con Título, Categoría, Prioridad
     - Multiline text con Descripción
     - Timeline de cambios (si hay auditoria)
    - Botón "Back" automático creado

3. **Tooltips Personalizados**
    - Nueva página: "Tooltip Solicitante"
    - Configurar como Tooltip page (Page settings)
    - Reducir tamaño de página
    - Agregar Card con email, departamento del contact
    - En página principal, configurar visual para usar este tooltip

##### Práctica 6.5: Publicar y Compartir

**Paso 1: Publicar a Power BI Service**

1. File > Publish > Select workspace
2. Elegir workspace (crear nuevo "Reportes TI" si no existe)
3. Esperar carga

**Paso 2: Configurar actualización de datos**

1. En Power BI Service, ir a workspace
2. Dataset settings (ícono configuración)
3. Scheduled refresh:
    - Frequency: Daily, 8:00 AM
    - Credentials: Configurar OAuth para Dataverse

**Paso 3: Crear Dashboard**

1. Desde el reporte publicado, pin visuales clave a nuevo Dashboard
2. Dashboard: "Gestión Solicitudes TI - Executive"
3. Organizar tiles, redimensionar

**Paso 4: Compartir con usuarios**

1. Opción A: Compartir dashboard directamente
    - Share button > agregar emails
    - Permisos: Can view / Can reshare
   
2. Opción B: Crear App
    - Workspace > Create app
    - Incluir dashboard y reporte
    - Configurar navegación
    - Publish app
    - Compartir link de app

**Paso 5: Configurar Row-Level Security (RLS)**

1. En Power BI Desktop, Modeling > Manage roles
2. Crear role "Solicitante":
   ```dax
   [Solicitante Email] = USERPRINCIPALNAME()
   ```

3. Crear role "Departamento":
   ```dax
   [Solicitante Departamento] = USERPRINCIPALNAME()
   ```

4. Publicar
5. En Service, Dataset security > agregar usuarios a roles

#### 💼 Caso Real de Negocio

**Escenario**: Dashboard Ejecutivo de Ventas para Gerencia

**Fuentes de datos**:

- Dynamics 365 Sales (Opportunities, Accounts)
- SQL Server (histórico transaccional)
- Excel (targets mensuales)

**KPIs principales**:

- Revenue actual vs target (con semáforo)
- Win rate por vendedor y producto
- Pipeline value por etapa
- Customer acquisition cost (CAC)
- Average deal size

**Visualizaciones clave**:

- Mapa de calor geográfico de ventas
- Waterfall chart de evolución revenue mensual
- Funnel chart de pipeline por stage
- Scatter plot: deal size vs días en pipeline (identificar outliers)

**Interactividad**:

- Slicers: Año, Trimestre, Vendedor, Región
- Drill-down: Región > País > Ciudad > Cliente
- Tooltips: Detalle de oportunidad al hover
- Drill-through: Página de análisis por vendedor individual

**Actualización**:

- Incremental refresh (últimos 3 meses diarios, histórico mensual)
- Alerts en Service si revenue < 80% target

#### ✅ Buenas Prácticas

**Modelado de datos**:

- Star schema: Tablas de hechos (Solicitudes) y dimensiones (Contacts, Categorías)
- Relaciones claras y unidireccionales cuando sea posible
- Columnas calculadas para atributos; measures para agregaciones
- Tablas de fechas (Calendar table) para time intelligence

**Performance**:

- Limitar registros importados (filtrar en Power Query)
- Usar Import mode para datasets pequeños, DirectQuery para grandes
- Indexar columnas de filtro en origen de datos
- Evitar columnas calculadas complejas; preferir measures

**Diseño visual**:

- Máximo 6-8 visuales por página (evitar saturación)
- Paleta de colores corporativa consistente
- Títulos descriptivos y contextuales
- Mostrar solo datos accionables

**DAX**:

- Formatear measures: usar Blank() en lugar de 0 cuando no hay datos
- Variables (VAR) para legibilidad y performance
- Comentarios en measures complejas
- Probar con diferentes filtros/slicers

**Gobernanza**:

- Workspaces por departamento/proyecto
- Naming conventions: [Área]-[Tema]-[Versión]
- Documentación de sources y transformaciones
- RLS siempre que datos sean sensibles

#### ⚠️ Errores Comunes

1. **Error**: Relaciones no funcionan (visuals no filtran)
    - **Causa**: Cardinalidad incorrecta o ambigüedad
    - **Solución**: Verificar Model view, eliminar relaciones inactivas

2. **Error**: Measures devuelven valores incorrectos con filtros
    - **Causa**: Contexto de filtro no manejado (no usar CALCULATE)
    - **Solución**: Usar CALCULATE con filtros explícitos o ALL/REMOVEFILTERS

3. **Error**: "Cannot display visual" por exceso de datos
    - **Causa**: Visual tiene >30k puntos de datos
    - **Solución**: Agregar filtros, usar Top N, o cambiar visual type

4. **Error**: Refresh falla en Service con "Credentials not configured"
    - **Causa**: No se configuró OAuth o gateway para on-premise
    - **Solución**: Dataset settings > Credentials > Update

5. **Error**: Columnas de fecha no permiten time intelligence
    - **Causa**: Columna es text, no date type
    - **Solución**: Power Query > Transform > Data type > Date

6. **Error**: Usuarios no ven datos tras aplicar RLS
    - **Causa**: Rol mal configurado o usuario no asignado
    - **Solución**: Validar con "View as role" en Desktop antes de publicar

#### 🧪 Criterios de Validación
- [ ] Reporte con 2+ páginas y mínimo 8 visualizaciones
- [ ] Conexión a Dataverse funcional con refresh configurado
- [ ] Modelo de datos con 3+ tablas relacionadas
- [ ] 4+ measures DAX creadas y funcionales
- [ ] Interactividad: cross-filtering, drill-through implementado
- [ ] Reporte publicado en Power BI Service y compartido
- [ ] Row-Level Security configurado y probado
- [ ] Dashboard con tiles pinneados creado
- [ ] Explicar diferencia entre Import y DirectQuery
- [ ] Calcular tamaño de dataset y estimar refresh time

---

### **Módulo 7: Fundamentos de Power Fx y Expresiones**
*Duración: 1-2 semanas*

#### 🎯 Objetivo
Dominar el lenguaje de fórmulas Power Fx para lógica avanzada en Canvas Apps.

#### 📖 Conceptos Clave
- **Sintaxis**: Funciones, operadores, referencias
- **Tipos de datos**: Text, Number, Boolean, Date, Table, Record
- **Funciones de tablas**: Filter, Sort, Search, Lookup, AddColumns
- **Funciones de agregación**: Sum, Average, Count, Max, Min
- **Funciones de contexto**: With, ForAll, Collect
- **Funciones de texto**: Concatenate, Text, Value, Split
- **Funciones de fecha**: Today, Now, DateAdd, DateDiff
- **Funciones de control**: If, Switch, IsBlank, IsEmpty
- **Funciones de navegación**: Navigate, Back, Launch
- **Delegación**: Limitaciones y operadores delegables
- **Comportamiento (Behavior)**: OnSelect, OnChange, OnVisible
- **Patrones**: Context variables, global variables, collections

#### 👨‍💻 Actividades Prácticas

##### Práctica 7.1: Funciones de Tablas y Filtrado

**Ejercicio 1: Multi-Filter Gallery**
```javascript
// Gallery Items con filtros múltiples
Filter(
    'Solicitudes TI',
    (IsBlank(DropdownCategoria.Selected) || Categoría = DropdownCategoria.Selected.Value) &&
    (IsBlank(DropdownEstado.Selected) || Estado = DropdownEstado.Selected.Value) &&
    (IsBlank(DatePickerDesde.SelectedDate) || 'Fecha Solicitud' >= DatePickerDesde.SelectedDate) &&
    (SearchBox.Text = "" || SearchBox.Text in Título || SearchBox.Text in Descripción)
)
```

**Ejercicio 2: Lookup con Fallback**
```javascript
// Obtener email del solicitante con valor por defecto
LookUp(
    Contacts,
    ID = GallerySolicitudes.Selected.Solicitante.ID,
    Email
) ?? "correo@desconocido.com"
```

**Ejercicio 3: AddColumns para Enriquecer Datos**
```javascript
// Agregar columna calculada "Días Transcurridos" en Collection
ClearCollect(
    ColSolicitudesEnriquecidas,
    AddColumns(
        'Solicitudes TI',
        "Días Transcurridos", DateDiff('Fecha Solicitud', Today(), Days),
        "Vencido SLA", DateDiff('Fecha Solicitud', Today(), Hours) > 'SLA Horas',
        "Nombre Solicitante", LookUp(Contacts, ID = Solicitante.ID, 'Full Name')
    )
)
```

##### Práctica 7.2: Lógica Condicional y Validaciones

**Ejercicio 1: Validación de Form Completo**
```javascript
// Button Guardar - Enabled property
!IsBlank(TextInputTitulo.Text) &&
!IsBlank(TextInputDescripcion.Text) &&
!IsBlank(DropdownCategoria.Selected) &&
Len(TextInputDescripcion.Text) >= 20 &&
Len(TextInputTitulo.Text) <= 100
```

**Ejercicio 2: Switch para Iconos Dinámicos**
```javascript
// Image Icon en Gallery según Estado
Switch(
    ThisItem.Estado.Value,
    "Nueva", Icon.AddDocument,
    "En Proceso", Icon.Clock,
    "Resuelta", Icon.CompletedSolid,
    "Cerrada", Icon.Cancel,
    Icon.Warning  // Default
)
```

**Ejercicio 3: If Anidado para Colores**
```javascript
// Color de Label Prioridad
If(
    ThisItem.Prioridad.Value = "Crítica", 
    RGBA(178, 0, 0, 1),  // Rojo oscuro
    If(
        ThisItem.Prioridad.Value = "Alta",
        RGBA(255, 140, 0, 1),  // Naranja
        If(
            ThisItem.Prioridad.Value = "Media",
            RGBA(255, 215, 0, 1),  // Amarillo
            RGBA(0, 128, 0, 1)  // Verde (Baja)
        )
    )
)
```

##### Práctica 7.3: Manipulación de Texto y Fechas

**Ejercicio 1: Formateo de Texto**
```javascript
// Construir mensaje de notificación
Concatenate(
    "Solicitud #", Text(GallerySolicitudes.Selected.ID, "000000"),
    " - ", Upper(Left(GallerySolicitudes.Selected.Categoría.Value, 1)),
    Lower(Mid(GallerySolicitudes.Selected.Categoría.Value, 2)),
    " (", Text(GallerySolicitudes.Selected.'Fecha Solicitud', "dd/MM/yyyy"), ")"
)
```

**Ejercicio 2: Cálculos de Fechas**
```javascript
// Calcular fecha estimada de resolución
DateAdd(
    GallerySolicitudes.Selected.'Fecha Solicitud',
    GallerySolicitudes.Selected.'SLA Horas',
    Hours
)

// Días hábiles hasta vencimiento (excluye fines de semana)
With(
    {DiasSLA: GallerySolicitudes.Selected.'SLA Horas' / 24},
    DiasSLA + Round(DiasSLA / 5 * 2, 0)  // Aproximación días hábiles
)
```

**Ejercicio 3: Split y Parse**
```javascript
// Extraer dominio de email
Last(Split(LookUp(Contacts, ID = Solicitante.ID, Email), "@")).Result

// Convertir string separado por comas a tabla
Split("Hardware,Software,Red,Accesos", ",")
```

##### Práctica 7.4: Collections y Contexto

**Ejercicio 1: Carrito de Compras (Pattern)**
```javascript
// Button Agregar al Carrito - OnSelect
Collect(
    ColCarrito,
    {
        Item: GalleryProductos.Selected.Nombre,
        Precio: GalleryProductos.Selected.Precio,
        Cantidad: Value(TextInputCantidad.Text),
        Subtotal: GalleryProductos.Selected.Precio * Value(TextInputCantidad.Text)
    }
);
Notify("Item agregado", NotificationType.Success)

// Button Remover del Carrito
Remove(ColCarrito, GalleryCarrito.Selected);
Notify("Item removido", NotificationType.Information)

// Label Total
"Total: $" & Text(Sum(ColCarrito, Subtotal), "$#,##0.00")
```

**Ejercicio 2: ForAll para Operaciones Batch**
```javascript
// Aprobar múltiples solicitudes seleccionadas
ForAll(
    GallerySolicitudes.AllItems,
    If(
        CheckboxSelect.Value,  // Si está seleccionado
        Patch(
            'Solicitudes TI',
            LookUp('Solicitudes TI', ID = ThisRecord.ID),
            {Estado: {Value: "Aprobada"}, 'Fecha Aprobación': Now()}
        )
    )
);
Notify(CountIf(GallerySolicitudes.AllItems, CheckboxSelect.Value) & " solicitudes aprobadas", NotificationType.Success)
```

**Ejercicio 3: With para Contexto Local**
```javascript
// Evitar repetir cálculos - With pattern
With(
    {
        RegistroActual: GallerySolicitudes.Selected,
        TiempoTranscurrido: DateDiff(GallerySolicitudes.Selected.'Fecha Solicitud', Now(), Days)
    },
    Concatenate(
        "Solicitud: ", RegistroActual.Título,
        " | Días abierta: ", Text(TiempoTranscurrido),
        " | Estado: ", If(TiempoTranscurrido > 7, "VENCIDA", "En plazo")
    )
)
```

##### Práctica 7.5: Delegación y Performance

**Ejercicio 1: Identificar Fórmulas No Delegables**

❌ **No delegable** (warning línea azul):
```javascript
Filter('Solicitudes TI', DateDiff('Fecha Solicitud', Today(), Days) > 7)
// DateDiff no es delegable
```

✅ **Solución delegable**:
```javascript
Filter('Solicitudes TI', 'Fecha Solicitud' < DateAdd(Today(), -7, Days))
// Operador < es delegable
```

**Ejercicio 2: Optimizar Queries con Delegación**

❌ **Mal rendimiento** (carga 500, luego filtra en cliente):
```javascript
SortByColumns(
    Filter('Solicitudes TI', StartsWith(Título, TextInputBuscar.Text)),
    "Fecha Solicitud",
    Descending
)
```

✅ **Optimizado** (filtra en servidor):
```javascript
SortByColumns(
    Filter(
        'Solicitudes TI',
        'Fecha Solicitud' >= DateAdd(Today(), -90, Days)  // Delegable
    ),
    "Fecha Solicitud",
    Descending
)
// Luego aplicar filtro de texto con Search (también delegable con Dataverse)
```

**Ejercicio 3: Uso de Collections para No Delegable**
```javascript
// Cargar data una vez (máx 500 o 2000 con config)
OnVisible de Screen:
ClearCollect(
    ColSolicitudesRecientes,
    Filter('Solicitudes TI', 'Fecha Solicitud' >= DateAdd(Today(), -30, Days))
);

// Luego operar localmente sin límite de delegación
Gallery Items:
Filter(
    ColSolicitudesRecientes,
    DateDiff('Fecha Solicitud', Today(), Days) > 7  // Ahora funciona porque es Collection local
)
```

#### 💼 Caso Real de Negocio

**Empresa:** Distribuidora Farmacéutica MediSupply — 8,000 SKUs, 3 bodegas  
**Problema:** Los analistas de inventario calculaban manualmente en Excel cuándo pedir cada producto: promedio de consumo, días de stock restante, cantidad mínima de pedido. El proceso tomaba 4 horas diarias para 8,000 SKUs. Errores frecuentes generaban quiebres de stock en productos críticos y sobrestock en productos de baja rotación.

**Solución con Power Fx:**
- Canvas App conectada a Dataverse con tabla de productos, movimientos y parámetros
- Fórmulas Power Fx calculan en tiempo real: consumo promedio diario (últimos 30 días), días de stock restante, cantidad sugerida de pedido
- Gallery filtrada automáticamente muestra solo productos que requieren acción hoy (stock < 15 días o stock crítico < 20% del ideal)
- Botón "Generar Orden" crea automáticamente la solicitud de compra en Dataverse y notifica al proveedor via Power Automate
- Colores semáforo (verde/amarillo/rojo) según nivel de urgencia calculado por Power Fx

**Resultados:**
- 4 horas de análisis manual reemplazadas por revisión de 20 minutos sobre la app
- Quiebres de stock en productos críticos: reducción del 71% en el primer trimestre
- Sobrestock: reducción del 38% (mejor planificación de cantidades de pedido)
- Impacto económico: ahorro estimado de $180,000 USD anuales en costos de urgencia y pérdidas por vencimiento

#### ✅ Buenas Prácticas

**Sintaxis y Legibilidad**:

- Indentar fórmulas complejas con Alt+Shift+F
- Usar With para evitar repetir subcálculos
- Comentarios con `//` en fórmulas de >3 líneas
- Nombres descriptivos de variables: `colCarrito` no `col1`

**Performance**:

- Entender y respetar delegación (límite 500/2000)
- Cargar datos una vez, operar local con Collections
- Evitar Addcolumns dentro de loops (ForAll)
- Usar Concurrent para operaciones independientes paralelas

**Mantenibilidad**:

- Centralizar cálculos complejos en una Collection
- Usar Component + Output properties para reutilizar lógica
- Documentar fórmulas no obvias
- Named Formulas (declaradas en `App.Formulas`, **no** en `App.OnStart`): son reactivas, lazy y se recalculan automáticamente — a diferencia de variables globales con `Set()` en `OnStart` que son imperativas y se calculan una sola vez al iniciar

**Debugging**:

- Usar Label temporal para ver valores: `Text(Variable, JSON)`
- Monitor para ver network calls y performance
- App formulas > Variables para inspeccionar contexto

#### ⚠️ Errores Comunes

1. **Error**: Fórmula devuelve Blank inesperadamente
    - **Causa**: Lookup no encuentra registro o división por 0
    - **Solución**: Usar `??` (null coalescing) o If(IsBlank(...))

2. **Error**: "Incompatible type" en Patch
    - **Causa**: Tipo de dato no coincide (text vs number, Choice vs string)
    - **Solución**: Convertir con Value(), Text(), o usar {Value: "..."} para Choices

3. **Error**: Collection no actualiza Gallery
    - **Causa**: Usar Set en lugar de Collect/Patch/Remove
    - **Solución**: Collections son observables, variables no. Usar ClearCollect o UpdateIf

4. **Error**: ForAll no guarda cambios
    - **Causa**: ForAll es funcional, no ejecuta side-effects en orden
    - **Solución**: Validar con Patch individual o usar Concurrent para operaciones independientes

5. **Error**: Filter devuelve registros incorrectos
    - **Causa**: Operador lógico mal usado (And vs &&, Or vs ||)
    - **Solución**: Power Fx usa And/Or, no &&/|| (aunque también soportados)

6. **Error**: "Delegation warning" ignorado
    - **Causa**: Asumir que funciona con >500 registros
    - **Solución**: NUNCA ignorar warnings de delegación; refactorizar o usar Collections

#### 🧪 Criterios de Validación
- [ ] 10+ fórmulas complejas implementadas en Canvas App
- [ ] Uso correcto de Filter, LookUp, AddColumns, ForAll
- [ ] Collection con operaciones CRUD funcional
- [ ] Validaciones de form con If/IsBlank
- [ ] Formateo de texto y fechas aplicado
- [ ] With pattern para optimizar cálculos repetidos
- [ ] Identificar y resolver 3+ warnings de delegación
- [ ] Explicar diferencia entre variables globales y contextuales
- [ ] Debugging de fórmula compleja con Labels temporales

---

### **Módulo 8: Primer Proyecto Integrado**
*Duración: 2-3 semanas*

#### 🎯 Objetivo
Aplicar todos los conocimientos del Nivel 1 en un proyecto end-to-end real.

#### 📋 Descripción del Proyecto

**Sistema Completo de Gestión de Solicitudes Internas**

Desarrollar una solución empresarial integral que incluya:

- Modelo de datos en Dataverse
- Canvas App para usuarios finales
- Model-Driven App para administradores
- Power Automate para automatizaciones
- Power BI Dashboard para métricas

#### 🏗️ Arquitectura de la Solución

**Componentes:**

1. **Dataverse**: 5 tablas personalizadas
2. **Power Apps Canvas**: App móvil para crear solicitudes
3. **Power Apps Model-Driven**: App escritorio para gestión
4. **Power Automate**: 4 flujos
5. **Power BI**: Dashboard ejecutivo

#### 👨‍💻 Desarrollo Paso a Paso

**FASE 1: Diseño y Modelado de Datos (Días 1-3)**

**Paso 1: Documentar requerimientos**

- Tipos de solicitudes: TI, Mantenimiento, RRHH, Compras
- Roles: Solicitante, Aprobador, Ejecutor, Administrador
- Flujo: Creación → Aprobación → Asignación → Ejecución → Cierre

**Paso 2: Crear Solution**
```
Name: Sistema Solicitudes Empresariales
Publisher: TuEmpresa (prefix: 'sse')
Version: 1.0.0.0
```

**Paso 3: Crear tablas en Dataverse**

1. **Tabla: Solicitud** (principal)
    - Título (text, 100 chars, required)
    - Descripción (multiline, 2000 chars)
    - Tipo (Choice): TI, Mantenimiento, RRHH, Compras
    - Prioridad (Choice): Baja, Media, Alta, Crítica
    - Estado (Choice): Nueva, Pendiente Aprobación, Aprobada, En Proceso, Completada, Rechazada
    - Fecha Solicitud (DateTime, default Now())
    - Fecha Requerida (Date Only)
    - Solicitante (Lookup → Contact, required)
    - Aprobador (Lookup → User)
    - Asignado a (Lookup → User)
    - Fecha Aprobación (DateTime)
    - Fecha Completada (DateTime)
    - Costo Estimado (Currency)
    - Costo Real (Currency)
    - Comentarios Aprobador (multiline)
    - Comentarios Cierre (multiline)
    - Adjuntos (enable notes & attachments)

2. **Tabla: Categoría Solicitud**
    - Nombre (text, 50 chars, required)
    - Tipo Solicitud (Choice): TI, Mantenimiento, RRHH, Compras
    - Descripción (multiline)
    - SLA Horas (Whole number)
    - Requiere Aprobación (Yes/No)
    - Aprobador Default (Lookup → User)
    - Activo (Yes/No, default Yes)

3. **Tabla: Comentario**
    - Solicitud (Lookup → Solicitud, required)
    - Comentario (multiline, 1000 chars, required)
    - Fecha (DateTime, default Now())
    - Usuario (Lookup → User, default Current User)
    - Tipo (Choice): Información, Pregunta, Actualización, Resolución
    - Interno (Yes/No) // Solo visible para equipo ejecutor

4. **Tabla: Aprobación**
    - Solicitud (Lookup → Solicitud, required)
    - Aprobador (Lookup → User, required)
    - Decisión (Choice): Pendiente, Aprobada, Rechazada
    - Fecha Decisión (DateTime)
    - Comentarios (multiline)
    - Nivel (Whole number) // Para aprobaciones multi-nivel

5. **Tabla: Métrica Solicitud** (para reporting)
    - Solicitud (Lookup → Solicitud)
    - Tiempo Respuesta Horas (Decimal) // Hasta asignación
    - Tiempo Resolución Horas (Decimal) // Hasta completada
    - Cumplió SLA (Yes/No)
    - Fecha Cálculo (DateTime)
    - Rating Solicitante (Choice): 1-5 estrellas

**Paso 4: Configurar relaciones**

- Solicitud 1:N Comentarios
- Solicitud 1:N Aprobaciones
- Solicitud 1:1 Métrica Solicitud
- Categoría 1:N Solicitudes

**Paso 5: Business Rules**

1. **Validación de fechas**:
    - Si Estado = "Completada", Fecha Completada is required
    - Fecha Requerida >= Fecha Solicitud

2. **Auto-población**:
    - Si Categoría selected, set Aprobador = Categoría.Aprobador Default

3. **Visibilidad condicional**:
    - Show "Comentarios Aprobador" only if Estado = Aprobada OR Rechazada

**FASE 2: Canvas App para Solicitantes (Días 4-7)**

**Paso 1: Estructura de pantallas**
```
1. ScreenInicio (Home)
   - Mis solicitudes activas (Gallery)
   - Botón "Nueva Solicitud"
   - Métricas personales (Cards)

2. ScreenNuevaSolicitud
   - Form crear solicitud
   - Upload de archivos adjuntos

3. ScreenDetalleSolicitud
   - Información completa de solicitud
   - Línea de tiempo de comentarios
   - Agregar nuevo comentario

4. ScreenMisSolicitudes
   - Gallery con filtros y búsqueda
   - Exportar a Excel
```

**Paso 2: Implementar navegación y lógica**

*ScreenInicio OnVisible:*
```javascript
// Cargar solicitudes del usuario actual
ClearCollect(
    ColMisSolicitudes,
    Filter(
        Solicitudes,
        Solicitante.'Email Address' = User().Email && Estado.Value <> "Completada"
        // Compara el email del Contact (Solicitante) con el usuario actual; no usar Solicitante.ID (es GUID, no email)
    )
);

// Calcular métricas
UpdateContext({
    TotalSolicitudes: CountRows(ColMisSolicitudes),
    PendientesAprobacion: CountRows(Filter(ColMisSolicitudes, Estado.Value = "Pendiente Aprobación")),
    EnProceso: CountRows(Filter(ColMisSolicitudes, Estado.Value = "En Proceso"))
})
```

*Gallery con búsqueda:*
```javascript
// ColMisSolicitudes es una Collection local — 'in' es válido aquí, no hay límite de delegación
SortByColumns(
    Filter(
        ColMisSolicitudes,
        SearchBox.Text in Título || SearchBox.Text in Descripción
    ),
    "Fecha Solicitud",
    Descending
)
```

*Form Nueva Solicitud - OnSuccess:*
```javascript
// Notificar éxito
Notify("Solicitud creada exitosamente", NotificationType.Success);

// Ejecutar flujo de Power Automate
'Flujo Notificar Nueva Solicitud'.Run(FormNueva.LastSubmit.ID);

// Navegar a detalle
Navigate(ScreenDetalle, ScreenTransition.Cover, {RegistroActual: FormNueva.LastSubmit})
```

**Paso 3: Agregar componentes avanzados**

*Component: Timeline de Comentarios*
```javascript
// Gallery vertical de comentarios
SortByColumns(
    Filter(Comentarios, Solicitud.ID = RegistroActual.ID),
    "Fecha",
    Descending
)

// Form agregar comentario
Button OnSelect:
Patch(
    Comentarios,
    Defaults(Comentarios),
    {
        Solicitud: {ID: RegistroActual.ID},
        Comentario: TextInputComentario.Text,
        Tipo: {Value: "Información"},
        Usuario: LookUp(Users, 'Primary Email' = User().Email)
        // LookUp a la tabla Users de Dataverse — {ID: User().Email} es incorrecto porque ID debe ser GUID, no email
    }
);
Reset(TextInputComentario);
Refresh(Comentarios)
```

**FASE 3: Model-Driven App para Gestión (Días 8-10)**

**Paso 1: Configurar sitemap**
```
Área: Solicitudes
  Group: Gestión
    - Solicitudes (vista)
    - Aprobaciones Pendientes (vista filtrada)
    - Mis Asignaciones (vista personal)
  Group: Configuración
    - Categorías
    - Métricas

Área: Reportes
  Group: Dashboards
    - Dashboard Operativo
    - Dashboard Ejecutivo
```

**Paso 2: Forms personalizados**

*Main Form Solicitud - 4 Tabs:*
```
Tab 1: General
  Section: Información
    - Título, Tipo, Categoría, Prioridad, Estado
    - Solicitante, Fecha Solicitud, Fecha Requerida
  Section: Asignación
    - Aprobador, Asignado a

Tab 2: Detalles
  Section: Descripción
    - Descripción (multiline)
  Section: Costos
    - Costo Estimado, Costo Real

Tab 3: Aprobación y Cierre
  Section: Aprobación
    - Fecha Aprobación, Comentarios Aprobador
  Section: Cierre
    - Fecha Completada, Comentarios Cierre

Tab 4: Timeline
  - Control Timeline (comentarios, actividades)
```

**Paso 3: Vistas especializadas**

1. **Vista: Aprobaciones Pendientes**
   ```
   Filtro: Estado = "Pendiente Aprobación" AND Aprobador = Current User
   Columnas: Título, Solicitante, Categoría, Fecha Solicitud, Costo Estimado
   Orden: Fecha Solicitud ASC (más antiguas primero)
   ```

2. **Vista: Mis Asignaciones**
   ```
   Filtro: Asignado a = Current User AND Estado IN (Aprobada, En Proceso)
   Columnas: Título, Prioridad, Estado, Fecha Requerida, Días Restantes
   Orden: Prioridad DESC, Fecha Requerida ASC
   ```

3. **Chart View: Solicitudes por Tipo**
   ```
   Chart Type: Donut
   Agregación: Count of Solicitudes
   Grouping: Tipo
   ```

**Paso 4: Business Process Flow**
```
Stage 1: Creación
  - Título, Tipo, Categoría, Descripción
  
Stage 2: Aprobación (if required)
  - Aprobador
  - Decisión
  
Stage 3: Ejecución
  - Asignado a
  - Estado → En Proceso
  
Stage 4: Cierre
  - Comentarios Cierre
  - Estado → Completada
```

**FASE 4: Power Automate Flujos (Días 11-13)**

**Flujo 1: Notificar Nueva Solicitud**
```
Trigger: Manual (llamado desde Canvas App)
Input: Solicitud ID

Actions:
1. Get Solicitud by ID
2. Get Solicitante (Contact)
3. Condition: Si requiere aprobación
   YES:
     - Update Solicitud: Estado = "Pendiente Aprobación"
     - Get Aprobador
     - Send approval request
   NO:
     - Update Solicitud: Estado = "Aprobada"
     - Llamar Flujo Asignar Solicitud
4. Send email a Solicitante con confirmación
```

**Flujo 2: Procesar Aprobación**
```
Trigger: Approvals - When an approval is responded
Filter: Approval type = "Solicitud"

Actions:
1. Get Solicitud relacionada
2. Create registro en Aprobación table
3. Condition: Si Outcome = "Approve"
   YES:
     - Update Solicitud: Estado = "Aprobada"
     - Llamar Flujo Asignar Solicitud
     - Send email a Solicitante (aprobada)
   NO:
     - Update Solicitud: Estado = "Rechazada"
     - Send email a Solicitante (rechazada) con comentarios
```

**Flujo 3: Asignar Solicitud Automáticamente**
```
Trigger: When Solicitud Estado = "Aprobada"

Actions:
1. Get Categoría de la solicitud
2. Switch por Tipo:
   TI: Asignar a Usuario específico o Round-robin
   Mantenimiento: Lookup en tabla Técnicos disponibles
   RRHH: Asignar a responsable área
   Compras: Asignar a comprador
3. Update Solicitud: Asignado a = {Usuario}
4. Send Teams notification a asignado
5. Create task en Planner (opcional)
```

**Flujo 4: Alertas de SLA y Recordatorios**
```
Trigger: Recurrence (cada hora)

Actions:
1. List rows Solicitudes
   Filter: Estado IN (Aprobada, En Proceso) AND Fecha Requerida <= DateAdd(Today(), 2, Days)
2. Apply to each:
   - Condition: Si Fecha Requerida < Today() (vencida)
     YES: Send escalation email a manager
     NO: Send reminder email a Asignado
   - Add comment to Solicitud timeline
```

**FASE 5: Power BI Dashboard (Días 14-16)**

**Paso 1: Conectar y modelar datos**
```
Tables:
- Solicitudes (fact)
- Categorías (dimension)
- Users (dimension - from Azure AD)
- Calendar (date dimension - crear con DAX)
```

**Paso 2: DAX Measures**
```dax
Total Solicitudes = COUNTROWS(Solicitudes)

Solicitudes Abiertas = 
CALCULATE(
    [Total Solicitudes],
    Solicitudes[Estado] IN {"Nueva", "Pendiente Aprobación", "Aprobada", "En Proceso"}
)

% Completadas a Tiempo = 
DIVIDE(
    CALCULATE([Total Solicitudes], Solicitudes[Cumplió SLA] = TRUE),
    [Total Solicitudes],
    0
)

Tiempo Promedio Resolución = 
AVERAGE(Métricas[Tiempo Resolución Horas]) / 24

Backlog = 
CALCULATE(
    [Total Solicitudes],
    Solicitudes[Estado] = "En Proceso",
    Solicitudes[Fecha Requerida] < TODAY()
)
```

**Paso 3: Visualizaciones clave**

*Página 1: Executive Dashboard*
```
1. KPI Cards (top row):
   - Total Solicitudes (mes actual vs mes anterior)
   - Tasa de Completadas a Tiempo
   - Tiempo Promedio Resolución
   - Backlog Crítico

2. Column Chart: Solicitudes por Tipo y Estado (stacked)
3. Line Chart: Trend últimos 6 meses
4. Funnel: Solicitudes por Stage del BPF
5. Table: Top 10 Categorías más solicitadas
```

*Página 2: Análisis Operativo*
```
1. Heatmap: Solicitudes por Día de Semana y Hora
2. Box Plot: Distribución tiempo resolución por Tipo
3. Scatter: Costo Estimado vs Costo Real (identificar desviaciones)
4. Matrix: Solicitantes vs Tipos (pivot)
```

**Paso 4: Configurar Row-Level Security**
```dax
Role: Departamento
Filter: Solicitudes[Solicitante Departamento] = USERNAME()

Role: Managers
Filter: Solicitudes[Aprobador Email] = USERPRINCIPALNAME()
```

**FASE 6: Seguridad y Testing (Días 17-19)**

**Paso 1: Configurar Security Roles**

*Role: Solicitante*
```
Solicitud: Create (User), Read (User), Write (User)
Comentario: Create (User), Read (User)
Categoría: Read (Organization)
Aprobación: Read (User)
```

*Role: Aprobador*
```
Solicitud: Read (Business Unit), Write (Business Unit - solo Estado, Comentarios Aprobador)
Aprobación: Create, Read, Write, Delete (Business Unit)
Todos los roles de Solicitante
```

*Role: Ejecutor*
```
Solicitud: Read (Organization), Write (Organization - solo Estado, Asignado a, Comentarios)
Comentario: Create, Read (Organization)
Métrica: Create, Read, Write (Organization)
Todos los roles de Solicitante
```

*Role: Administrador*
```
Full access a todas las tablas
Configuración de solución
```

**Paso 2: Plan de Testing**

| Escenario | Pasos | Resultado Esperado |
|-----------|-------|-------------------|
| Crear solicitud simple | Usuario crea solicitud tipo TI que no requiere aprobación | Solicitud en estado "Aprobada", asignada automáticamente |
| Crear solicitud con aprobación | Usuario crea solicitud tipo Compras > $1000 | Solicitud en "Pendiente Aprobación", aprobador recibe email |
| Aprobar solicitud | Aprobador aprueba desde email | Solicitud pasa a "Aprobada", ejecutor asignado y notificado |
| Rechazar solicitud | Aprobador rechaza con comentarios | Estado "Rechazada", solicitante notificado con razones |
| Agregar comentarios | Solicitante y ejecutor intercambian comentarios | Timeline actualizado en tiempo real en ambas apps |
| Completar solicitud | Ejecutor marca como completada | Estado "Completada", métrica calculada, dashboard actualizado |
| SLA vencido | Solicitud no completada antes de fecha requerida | Email escalación a manager, alerta en dashboard |
| Ver dashboard | Manager accede a Power BI | Solo ve solicitudes de su departamento (RLS) |

**Paso 3: Testing multi-role**

- Crear 3 usuarios de prueba: Solicitante, Aprobador, Ejecutor
- Ejecutar cada escenario completo
- Validar permisos (usuario no debe ver datos fuera de su scope)
- Probar en móvil (Canvas App responsive)

**FASE 7: Documentación y Despliegue (Días 20-21)**

**Paso 1: Documentación técnica**
```markdown
# Sistema Solicitudes Empresariales - Documentación

## Arquitectura
[Diagrama de componentes]

## Modelo de Datos
[Diagrama ER con relaciones]

## Flujos Automatizados
[Diagramas de flujo de cada Power Automate]

## Seguridad
[Matriz de permisos por rol]

## Configuración
[Pasos para setup inicial]

## Troubleshooting
[Problemas comunes y soluciones]
```

**Paso 2: Manual de usuario**

- Guía Canvas App (con screenshots)
- Guía Model-Driven App
- Interpretación del Dashboard
- FAQs

**Paso 3: Despliegue a producción**

1. Exportar solution como Managed
2. Importar en ambiente Production
3. Configurar conexiones de flujos
4. Asignar security roles a usuarios reales
5. Compartir Canvas App con usuarios
6. Compartir Model-Driven App con gestores
7. Publicar Dashboard Power BI y compartir

#### 📖 Conceptos Clave

Este módulo es la síntesis aplicada de los conceptos fundamentales del Nivel 1. Asegúrate de dominarlos antes de comenzar:

- **Integración de soluciones Power Platform:** capacidad de combinar Dataverse, Canvas Apps, Model-Driven Apps, Power Automate y Power BI en una arquitectura cohesionada donde cada componente tiene un rol claro. La integración no es solo conectar herramientas — es diseñar la interacción entre ellas para resolver un problema de negocio completo.
- **Solución como unidad de ALM:** todos los componentes (tablas, apps, flujos, reportes) deben vivir dentro de una única solución con prefijo de publisher consistente (`sse_`). La solución es el artefacto que se mueve entre ambientes (DEV→TEST→PROD), no los componentes individuales.
- **Diseño data-first:** el modelo de datos en Dataverse es el núcleo. Las aplicaciones y flujos son consumidores del dato — si el modelo es incorrecto, las capas superiores heredan sus problemas. Antes de crear la primera pantalla, el modelo debe estar validado.
- **Separación de capas por audiencia:** Canvas App para usuarios operativos (móvil, simplicidad, velocidad); Model-Driven App para gestores y administradores (formularios complejos, vistas, BPF, auditoría); Power BI para tomadores de decisiones (analítica, tendencias, KPIs).
- **Business Process Flow (BPF):** orquestador visual de etapas que guía al gestor a través del proceso de aprobación y ejecución. El BPF es la fuente de verdad del estado del proceso — no un campo de elección aislado.
- **Security Roles y Row-Level Security:** el principio de mínimo privilegio aplica desde el inicio. Un usuario que crea solicitudes no debe poder aprobarlas. El modelo de seguridad debe diseñarse en paralelo con el modelo de datos, no al final.
- **Power Automate como orquestador de procesos:** los flujos automatizan notificaciones, escalaciones, actualizaciones de estado y registros de auditoría — liberando a las apps de lógica que no pertenece a la UI. Un flujo bien diseñado tiene manejo de errores explícito (Scope Try/Catch).
- **RLS en Power BI:** Row-Level Security garantiza que cada área solo vea sus propias métricas. En un dashboard empresarial, los KPIs sin RLS son un riesgo de confidencialidad.
- **Connection References y Environment Variables:** los componentes configurables (conexiones a servicios, URLs, parámetros de ambiente) deben parametrizarse desde el inicio para que la solución sea desplegable en múltiples ambientes sin edición manual.

#### 💼 Caso Real de Negocio

**Empresa:** Constructora Andina S.A. — 450 empleados, 3 sedes (Bogotá, Medellín, Cali)  
**Problema:** El proceso de solicitudes internas (materiales, soporte TI, mantenimiento, RRHH) se gestionaba por WhatsApp y correos. Sin trazabilidad, sin métricas de tiempo de respuesta, sin control de costos por área.  
**Resultado sin sistema:** pérdida de solicitudes, retrasos en aprobaciones (promedio 5 días), imposible auditar gastos por proyecto.

**Solución implementada con este proyecto:**
- **Dataverse:** modelo centralizado con trazabilidad completa (quién solicitó, quién aprobó, tiempos, costos)
- **Canvas App:** empleados crean solicitudes desde el celular en < 2 minutos
- **Model-Driven App:** gestores aprueban, asignan y cierran solicitudes con visibilidad completa del proceso
- **Power Automate:** notificaciones automáticas, escalación si no hay respuesta en 24h, actualización de estado en tiempo real
- **Power BI:** dashboard ejecutivo con tiempo promedio de respuesta por tipo, costo real vs estimado por área, volumen por sede

**Resultados a 3 meses:**
- Tiempo de aprobación reducido de 5 días a 4 horas promedio
- 100% de solicitudes trazables (0 perdidas vs 8% previo)
- Ahorro del 18% en costos de mantenimiento por mejor planificación

**Lección clave:** Una solución integrada de Power Platform puede reemplazar herramientas desconectadas y generar ROI medible en el primer trimestre de operación.

#### ✅ Buenas Prácticas

- **Diseñar el modelo de datos primero, nunca al revés.** El tiempo invertido en revisar el modelo antes de crear la primera pantalla siempre se recupera. Un cambio de relación a mitad del proyecto puede requerir recrear flujos y formularios completos.
- **Usar un único publisher prefix en todos los componentes.** `sse_` en todos los campos, `sse_` en nombres de solución. Nunca mezclar prefijos dentro del mismo proyecto.
- **Nombrar controles en Canvas App desde el inicio.** `btnEnviar`, `galSolicitudes`, `txtBusqueda`. Cambiar nombres a mitad del proyecto rompe las fórmulas Power Fx que los referencian.
- **Crear el security model en paralelo con el data model.** Los Security Roles deben crearse antes de asignar a usuarios de prueba — no al final del proyecto.
- **Parametrizar todo lo configurable.** Usar Environment Variables para URLs, correos de notificación, y flags de configuración. Nunca hardcodear valores que puedan cambiar entre ambientes.
- **Versionar la solución en cada entregable.** `1.0.0.0` para la primera versión funcional, `1.1.0.0` para mejoras menores. El número de versión en la solución es el historial de cambios.
- **Probar con datos reales desde el sprint 1.** Cargar datos representativos temprano revela problemas de performance y delegación antes de que sean costosos de resolver.
- **Documentar decisiones arquitectónicas mientras las tomas.** Al final del proyecto, nadie recuerda por qué se eligió un tipo de relación específico o por qué un flujo tiene cierta estructura.

#### ⚠️ Errores Comunes

- **Crear tablas sin prefijo o con `new_`.** Genera conflictos al importar la solución en ambientes con otras soluciones instaladas. **Fix:** eliminar columnas `new_` y recrearlas con el prefijo correcto antes de comenzar a poblar datos.
- **Olvidar activar auditoría antes de los primeros datos.** La auditoría de Dataverse no aplica retroactivamente — los registros creados antes de activarla no tienen historial. **Fix:** activar auditoría como paso 2, inmediatamente después de crear las tablas.
- **Canvas App con 200+ fórmulas en OnStart.** Carga lenta, difícil de mantener, errores de delegación silenciosos. **Fix:** distribuir inicialización en OnVisible de cada pantalla y usar variables de colección solo cuando sean necesarias.
- **Flujos de Power Automate sin manejo de errores.** Un flujo que falla silenciosamente es peor que uno que no existe. **Fix:** envolver toda la lógica principal en un Scope y agregar Scope de catch con registro del error y notificación al administrador.
- **Security Roles demasiado permisivos ("por ahora").** "Por ahora" se convierte en permanente. **Fix:** comenzar con el mínimo privilegio y agregar permisos según se identifican necesidades, no al revés.
- **Dashboard Power BI sin RLS desde el inicio.** Agregar RLS después de que el informe está en producción requiere rediseñar el modelo. **Fix:** configurar los roles de RLS antes de publicar el informe por primera vez.
- **No usar Connection References en los flujos.** La solución queda atada a conexiones del ambiente de desarrollo y falla al importar. **Fix:** siempre crear Connection References para cada conector usado en flujos y configurarlas como parte del despliegue.
- **Exportar como Unmanaged a producción.** Permite edición directa en PROD, generando desvíos entre ambientes. **Fix:** exportar siempre como Managed para producción — las personalizaciones solo van por el pipeline.

#### ✅ Criterios de Validación Final

**Funcional:**

- [ ] 5 tablas en Dataverse con relaciones correctas
- [ ] Canvas App con 4+ pantallas funcionales
- [ ] Model-Driven App con sitemap, forms, vistas configurados
- [ ] 4 flujos Power Automate operativos
- [ ] Dashboard Power BI con 8+ visualizaciones y RLS
- [ ] Business Process Flow funcional con 4 stages
- [ ] Seguridad: 4 roles configurados y probados

**Técnico:**

- [ ] Solution versionada y exportable
- [ ] Código Power Fx sin warnings de delegación críticos
- [ ] Flujos con error handling completo
- [ ] Performance: App carga < 3 segundos
- [ ] Dashboard refresh automático configurado

**Calidad:**

- [ ] Testeado con 3+ roles diferentes
- [ ] 10+ registros de prueba de cada tipo
- [ ] Documentación técnica completa
- [ ] Manual de usuario con screenshots
- [ ] Sin errores en consola o logs

**Negocio:**

- [ ] Demostración exitosa a stakeholder simulado
- [ ] Casos de uso reales validados
- [ ] Métricas del dashboard útiles y accionables
- [ ] Feedback de usuarios incorporado

---

## 🎓 Resumen del Nivel 1

### 🏆 Logros Alcanzados

Has completado el **Nivel 1: Básico** del Plan Maestro. Ahora puedes:

✅ **Dataverse**:

- Modelar datos empresariales con tablas, relaciones y business rules
- Implementar lógica sin código
- Gestionar seguridad granular

✅ **Power Apps Canvas**:

- Crear aplicaciones móviles y web desde cero
- Implementar navegación multi-screen
- Escribir fórmulas Power Fx complejas
- Manejar collections y contexto

✅ **Power Apps Model-Driven**:

- Construir apps metadata-driven
- Configurar forms, views, dashboards
- Implementar Business Process Flows
- Configurar security roles

✅ **Power Automate**:

- Automatizar procesos cloud y escritorio
- Implementar aprobaciones
- Manejar errores robustamente
- Integrar con múltiples sistemas

✅ **Power BI**:

- Conectar a múltiples fuentes de datos
- Crear modelos de datos relacionales
- Escribir measures DAX
- Diseñar dashboards interactivos
- Implementar Row-Level Security

✅ **Power Fx**:

- Dominar sintaxis y funciones clave
- Optimizar para delegación
- Debuggear fórmulas complejas

✅ **Integración**:

- Arquitectar soluciones multi-componente
- Implementar proyecto end-to-end
- Documentar y desplegar soluciones

### 📊 Estadísticas del Nivel

- **Tiempo invertido**: 240-360 horas
- **Módulos completados**: 8
- **Ejercicios prácticos**: 30+
- **Proyecto integrado**: 1 completo
- **Líneas de código Power Fx**: 500+
- **Flujos creados**: 5+
- **Reportes Power BI**: 2+

### 🎯 Próximos Pasos

**Opción A: Certificarte**

- Preparar y rendir **PL-900: Microsoft Power Platform Fundamentals**
- Recursos: Microsoft Learn, Practice tests

**Opción B: Profundizar con Proyectos**

- Implementar 2-3 proyectos adicionales similares
- Explorar conectores específicos de tu industria
- Participar en comunidad (Power Platform Community, Forums)

**Opción C: Avanzar al Nivel 2**

- Prerrequisitos: Sentirte confortable con todos los módulos del Nivel 1
- Auto-evaluación: ¿Puedo explicar cada concepto sin consultar documentación?
- Si aún tienes dudas en algún módulo, repítelo antes de avanzar

### 📚 Recursos Complementarios

**Documentación Oficial**:

- [Power Platform Documentation](https://docs.microsoft.com/power-platform/)
- [Power Apps Formula Reference](https://docs.microsoft.com/powerapps/maker/canvas-apps/formula-reference)
- [DAX Function Reference](https://dax.guide/)

**Comunidades**:

- [Power Platform Community](https://powerusers.microsoft.com/)
- [Power Apps Community Forums](https://powerusers.microsoft.com/t5/Power-Apps-Community/ct-p/PowerApps1)
- Reddit: r/PowerApps, r/PowerBI

**Canales YouTube**:

- Microsoft Power Platform (oficial)
- Shane Young (PowerApps911)
- Reza Dorrani
- Guy in a Cube (Power BI)

**Blogs**:

- Power Apps Blog (oficial)
- Matthew Devaney
- Sancho Harker

---

## 🎉 ¡Felicitaciones!

Has completado exitosamente el **Nivel 1: Básico** del Plan Maestro.

Estás listo para construir soluciones funcionales de Power Platform que aporten valor real a organizaciones.

**Próximo hito**: [Nivel 2: Intermedio](NIVEL_2_INTERMEDIO.md)

---

*Última actualización: Mayo 2026*  
*Versión: 1.0.0*  
*Autor: Plan Maestro Power Platform*
