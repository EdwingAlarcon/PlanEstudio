---
moduleId: 6
title: "Power BI - Reportes y Dashboards Básicos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 8
slug: "power-bi-reportes-y-dashboards-basicos"
---
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
