---
moduleId: 8
title: "Primer Proyecto Integrado"
level: "basico"
certification: "PL-900"
estimatedMinutes: 19
slug: "primer-proyecto-integrado"
---
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
