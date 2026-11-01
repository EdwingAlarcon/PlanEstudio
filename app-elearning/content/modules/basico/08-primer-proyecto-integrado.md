---
moduleId: 8
title: "Primer Proyecto Integrado"
level: "basico"
certification: "PL-900"
estimatedMinutes: 45
practiceMinutes: 480
slug: "primer-proyecto-integrado"
lastVerified: "2026-11"
---
*Duración: 2-3 semanas · Lectura/planificación: 25-45 min · Construcción (estimación, no medida con alumnos): entrega mínima unas 7-9 horas con Model-Driven o 9-12 horas con Canvas; entrega completa 35-50 horas, siempre en varias sesiones*

### 🎯 Objetivo
Aplicar todos los conocimientos del Nivel 1 en un proyecto end-to-end real.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Diseñar el alcance del proyecto y crear la Solution con el modelo de datos base.
- Dejar al menos una app funcional conectada a Dataverse: Canvas App o Model-Driven App.
- Definir la evidencia mínima que usarás para demostrar que completaste el Nivel Básico.

### 🔧 Qué queda para después (Iteraciones del proyecto)
- Completar los 4 flujos, el dashboard Power BI con RLS, testing multi-role y documentación formal. Este módulo es un capstone: se termina por iteraciones, no en una sola sesión.

### 🆕 Por qué empiezas una Solution nueva (y qué hacer con lo de los Módulos 2 a 7)

En los Módulos 2 a 7 trabajaste con la tabla **Solicitud TI** (prefijo `sit`). Este proyecto es **otro sistema, más grande**: solicitudes de varios tipos (TI, Mantenimiento, RRHH, Compras) con aprobación. Por eso empiezas una Solution nueva con su propio publisher y prefijo (`sse`) y tablas nuevas:

- Practicas el arranque de un proyecto real desde cero: Solution, publisher, tablas y relaciones.
- No rompes lo que ya funciona: tus apps, flujos y reportes de los Módulos 2 a 7 siguen apuntando a `Solicitud TI`. Si cambiaras esa tabla, dejarían de funcionar.

**Qué haces con tu trabajo anterior:** no lo borres ni lo modifiques. Es tu evidencia de los módulos y tu guía: cada paso de este proyecto ya lo hiciste una vez allí, con otra tabla.

**Qué haces con el `.pbix` del Módulo 6:** no lo reutilices tal cual, porque sus consultas leen las tablas `sit_`. Para este proyecto crea un archivo nuevo (`reporte-solicitudes-sse.pbix`) y repite los mismos pasos del Módulo 6 (Práctica 6.1, Pasos 2 a 4) con las tablas `sse_`. Las medidas del Módulo 6 hay que adaptarlas, porque aquí los estados son otros (ver el recuadro "Power BI en versión mínima" en la Fase 5).

### 🧭 Entregable mínimo viable del Nivel Básico

Si tienes poco tiempo o estás estudiando solo, apunta primero a este alcance:

1. Solution `Sistema Solicitudes Empresariales` con publisher `sse`.
2. Tabla `Solicitud` + tabla `Categoría Solicitud` con relación y 10 registros de prueba.
3. Una Model-Driven App para gestionar solicitudes **o** una Canvas App para crearlas y verlas. **Si es tu primer proyecto, elige la Model-Driven:** casi todo se hace con clics y casi no tiene fórmulas, así que tiene menos puntos donde atorarte.
4. Un flujo Power Automate de notificación al crear solicitud.
5. Un reporte Power BI local con KPIs básicos. Si no tienes Power BI listo: con Model-Driven, un dashboard o una vista con gráfico dentro de la app; con Canvas, las etiquetas de métricas de la pantalla de inicio (ver la ruta de abajo).

Cuando esto funcione, ya tienes una historia completa para explicar en entrevista: dato, app, automatización, reporte y una decisión de seguridad documentada en el README (en la entrega mínima no configuras roles; escribes cuál crearías y por qué).

### 🪜 Tres niveles de entrega

| Nivel | Qué incluye | Cuándo usarlo |
|---|---|---|
| **Entrega mínima** | 2 tablas, 1 app, 1 flujo, 1 reporte o dashboard simple, 6 evidencias. | Para cerrar el Nivel Básico sin bloquearte. |
| **Entrega completa** | 5 tablas, Canvas App, Model-Driven App, 4 flujos, Power BI, roles y testing. | Para portafolio sólido de Maker/Functional Consultant junior. |
| **Entrega excelente** | Documentación técnica, matriz de seguridad, solución exportable, demo grabada y mejoras por feedback. | Para entrevista o muestra profesional. |

> No intentes hacer la entrega excelente desde el primer día. Completa primero la entrega mínima; después decides cuánto profundizar.

### 🗺️ Ruta de la entrega mínima: qué hacer y qué saltar

Las Fases 1 a 7 de abajo describen la **entrega completa**. Si vas por la mínima, sigue esta tabla y salta todo lo que no aparece en ella. Los clics de cada paso ya los practicaste: la última columna dice en qué módulo.

| Fase y paso | En la entrega mínima | Dónde aprendiste los clics |
|---|---|---|
| Fase 1 · Paso 1 Requerimientos | Haz solo una línea por punto (tipos, roles y flujo) | — |
| Fase 1 · Paso 2 Solution | **Haz** (Solution nueva con publisher `sse`). Desde aquí, crea **todo** dentro de esta Solution: tablas, app y flujo (la primera evidencia es una captura de la Solution con los tres) | Módulo 2, Paso 0 |
| Fase 1 · Paso 3 Tablas | **Solo la tabla 1 (Solicitud) y la 2 (Categoría Solicitud).** En Solicitud crea solo: Título, Descripción, Tipo, Prioridad, Estado, Fecha Solicitud, Solicitante y Asignado a. En Categoría Solicitud basta con Nombre. Salta las tablas 3, 4 y 5 | Módulo 2, Práctica 2.1 |
| Fase 1 · Paso 4 Relaciones | **Solo Categoría 1:N Solicitudes**: se crea al añadir en Solicitud una columna Lookup `Categoría` → Categoría Solicitud | Módulo 2 (Lookup) |
| Fase 1 · Paso 5 Business Rules | Opcional. La regla 1 usa **Fecha Requerida** y **Fecha Completada**, que no están en la lista mínima: si quieres hacerla, crea antes esas dos columnas (Fecha Requerida: Date only; Fecha Completada: Date and time). Si no, salta este paso | Módulo 2 y Módulo 4, Paso 3.3 |
| Carga de datos | **Haz, en este orden:** (1) en la tabla estándar **Contact**, crea un contacto con tu nombre y **tu correo de trabajo** (el mismo con el que inicias sesión en Power Apps); (2) 3 categorías; (3) 10 solicitudes con tipos, prioridades y estados distintos, con la **Fecha Solicitud** escrita a mano y con **tu contacto como Solicitante en al menos 5 de ellas** (deja esas 5 en un estado distinto de Completada). Sin ese contacto, la pantalla de inicio de la Canvas sale vacía y el correo del flujo no te llega a ti | Módulo 1, Microlección 3 |
| Fase 2 **o** Fase 3 (una sola) | **Recomendado si es tu primer proyecto: Model-Driven** (Fase 3): navegación, formulario Main con las columnas que creaste y 1 vista; salta el BPF y la vista Aprobaciones Pendientes. **Canvas** (Fase 2): solo ScreenInicio (Paso 2) y ScreenNuevaSolicitud, sin la subida de adjuntos; salta ScreenDetalleSolicitud, ScreenMisSolicitudes y el Paso 3 (necesita la tabla Comentario). Sigue los recuadros "En la entrega mínima" de la Fase 2 | Módulo 4 (Model-Driven) o Módulo 3 (Canvas) |
| Fase 4 Flujos | **Solo el Flujo 1, en su versión mínima** (ver el recuadro en la Fase 4) | Módulo 5, Práctica 5.1 |
| Fase 5 Power BI | **Un reporte nuevo con 2 visuales** (solicitudes por Estado y por Prioridad) y la medida Total Solicitudes: sigue el recuadro "Power BI en versión mínima" de la Fase 5. Salta las medidas de SLA, la tabla de calendario y el RLS. **Sin Power BI:** con Model-Driven, el dashboard o una vista con gráfico de la app; con Canvas, tres etiquetas en ScreenInicio con las métricas (`TotalSolicitudes`, `PendientesAprobacion`, `EnProceso`) | Módulo 6, o Módulo 4, Paso 5 |
| Fase 6 Seguridad | Salta. Escribe en el README qué rol crearías y por qué | — |
| Fase 7 Documentación | **Solo el README** con las secciones Arquitectura, Modelo de Datos, Flujos y una decisión de seguridad | — |

**Cuándo terminaste la entrega mínima:** tienes las 6 evidencias de la sección "Evidencia mínima de cierre" y puedes contar en 2 minutos el recorrido completo, de punta a punta (*end-to-end*): una solicitud se crea en la app, el flujo avisa por correo y el reporte la cuenta.

### 📚 Mini-glosario del proyecto integrado

| Término | En una frase |
|---|---|
| **Capstone** | Proyecto final que junta lo aprendido en el nivel. |
| **ALM** | Forma ordenada de mover cambios entre ambientes, sin editar producción a mano. |
| **Managed solution** | Paquete cerrado para producción; se instala, no se edita directamente. |
| **Unmanaged solution** | Paquete editable para desarrollo y aprendizaje. |
| **Connection Reference** | Referencia reutilizable a una conexión, para que un flujo no dependa de una cuenta personal. |
| **Environment Variable** | Valor configurable por ambiente, como un correo o URL. |
| **End-to-end** (de punta a punta) | Que el recorrido completo funciona: dato → app → flujo → reporte. |
| **Stakeholder** | Persona interesada en el resultado: quien pide, usa o paga el sistema. |
| **ROI** (retorno de la inversión) | Cuánto valor devuelve el proyecto comparado con lo que costó. |
| **Auditoría** (Dataverse) | Registro automático de quién cambió qué dato y cuándo. |
| **OnVisible** | Propiedad de una pantalla Canvas: lo que pasa cada vez que llegas a ella; sirve para preparar variables y cargar datos. |
| **OnSuccess** y **LastSubmit** | Propiedades de un formulario Canvas: `OnSuccess` es lo que pasa cuando el guardado salió bien; `LastSubmit` es el último registro guardado, con los campos que llenó el servidor (por ejemplo su ID). |
| **UpdateContext** y **RegistroActual** | `UpdateContext` crea variables de contexto, que solo viven en la pantalla actual. `RegistroActual` es una de ellas: se crea en la pantalla de destino con el tercer argumento de `Navigate` y guarda la solicitud que estás viendo. |
| **Sitemap** | El menú de navegación de una Model-Driven App: áreas, grupos y páginas. |
| **Chart view** | Gráfico guardado sobre una vista de Model-Driven (lo hiciste en el Módulo 4). |
| **Timeline** | Control de un formulario Model-Driven que muestra las actividades y notas de un registro. |
| **Run history** | Historial de ejecuciones de un flujo: cuándo corrió y si salió bien o falló. |
| **Row ID** | El identificador único (GUID) de una fila de Dataverse; lo pide la acción *Get a row by ID*. |
| **Recurrence** | Trigger de Power Automate que ejecuta el flujo según un horario (cada hora, cada día). |
| **Switch** | Control de un flujo que elige un camino distinto según el valor de un campo. |
| **Round-robin** | Repartir en turno: a cada persona le toca la siguiente solicitud, en rueda. |
| **Planner** | Microsoft Planner, la app de Microsoft 365 para listas de tareas en equipo. |
| **Niveles de acceso: User, Business Unit, Organization** | En un rol de seguridad: **User** = solo los registros que la persona posee o le compartieron; **Business Unit** = los de su unidad de negocio; **Organization** = todos. |
| **Hecho (fact) y dimensión** | En Power BI, la tabla de hechos guarda eventos (cada solicitud); una dimensión describe cosas (categorías, personas). |
| **Tabla de fechas** (date table) | Tabla con una fila por día, que se necesita para comparar periodos (mes contra mes). Es tema del Módulo 12. |

### 📖 Conceptos Clave

Este módulo es la síntesis aplicada de los conceptos fundamentales del Nivel 1. Asegúrate de dominarlos antes de comenzar:

- **Integración de soluciones Power Platform:** combinar Dataverse, Canvas Apps, Model-Driven Apps, Power Automate y Power BI de forma que cada pieza tenga un papel claro y juntas resuelvan un problema de negocio completo.
- **Solución como unidad de ALM** (*Application Lifecycle Management*, la forma ordenada de mover cambios entre ambientes): todo vive en una sola solución con el mismo prefijo de publisher (`sse_`), y es la solución, no cada pieza, lo que pasa de DEV a TEST a PROD.
- **Diseño data-first** (primero los datos): el modelo de Dataverse es el núcleo; si está mal, las apps y flujos heredan el problema. Valídalo antes de crear la primera pantalla.
- **Separación de capas por audiencia:** Canvas App para quien opera (móvil, simple y rápida); Model-Driven App para gestores y administradores (formularios, vistas, BPF); Power BI para quien decide (análisis, tendencias, KPIs, es decir, indicadores clave).
- **Business Process Flow (BPF)** (flujo de proceso de negocio): barra de etapas que guía al gestor paso a paso por la aprobación y la ejecución.
- **Security Roles** (roles de seguridad) **y Row-Level Security** (seguridad por fila: cada persona ve solo los registros que le tocan): da a cada uno el mínimo permiso necesario desde el inicio; quien crea solicitudes no debe poder aprobarlas.
- **Power Automate como orquestador de procesos:** los flujos se encargan de avisos, escalamientos, cambios de estado y registros de auditoría, para que la app no cargue con esa lógica; un buen flujo maneja sus errores (*Scope Try/Catch*: intentar un bloque y capturar el fallo).
- **RLS en Power BI** (*Row-Level Security*, seguridad por fila): hace que cada área vea solo sus propias métricas en el reporte.
- **Connection References** (referencias de conexión: la conexión que usa un flujo, sin atarla a la cuenta de una persona) **y Environment Variables** (variables de entorno: valores como un correo o una URL que cambian según el ambiente): permiten mover la solución entre ambientes sin editarla a mano.

### 👨‍💻 Actividades Prácticas Paso a Paso

**📋 Descripción del Proyecto**

**Sistema Completo de Gestión de Solicitudes Internas**

Desarrollar una solución empresarial integral que incluya:

- Modelo de datos en Dataverse
- Canvas App para usuarios finales
- Model-Driven App para administradores
- Power Automate para automatizaciones
- Power BI Dashboard para métricas

**🏗️ Arquitectura de la Solución**

**Componentes:**

1. **Dataverse**: 5 tablas personalizadas
2. **Power Apps Canvas**: App móvil para crear solicitudes
3. **Power Apps Model-Driven**: App escritorio para gestión
4. **Power Automate**: 4 flujos
5. **Power BI**: Dashboard ejecutivo

**Plan para la entrega mínima si tienes 1 hora al día** (estimación: unas 8-9 sesiones con Model-Driven; con Canvas suma 2 o 3 sesiones más):

1. Sesiones 1-2: Solution, publisher y las 2 tablas mínimas con sus columnas y la relación.
2. Sesión 3: carga de datos (tu contacto, 3 categorías y 10 solicitudes) y revisa que la relación funciona.
3. Sesiones 4-5: la app que elegiste (solo una).
4. Sesiones 6-7: el flujo de notificación, hasta ver una ejecución correcta en el Run history y el correo en tu bandeja.
5. Sesión 8: el reporte simple (o el dashboard de la app).
6. Sesión 9: README y capturas de evidencia.

> Si una sesión se alarga, no pasa nada: es una estimación, no un examen. Los días que verás en los títulos de cada Fase (Días 1-21) son de la **entrega completa**, pensados para 2-3 horas al día; no aplican a la mínima.

> **Cómo está organizado este capstone:** lo construyes por capas, en tres bloques (planear, construir dato y app, automatizar y cerrar). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu proyecto. Cierras con un reto en el que ya no te digo las tablas ni los pasos: el mismo proyecto aplicado a otro negocio. Las microprácticas no necesitan tenant; construir el proyecto sí.

## 🧩 Microlección 1 — Planear: decidir qué entra y qué no

**¿Qué vas a aprender?** A decidir qué entra y qué NO entra en tu primera entrega, para llegar a algo que funcione de punta a punta antes de pulirlo.

**¿Por qué existe esto?** Un capstone fracasa más por querer hacerlo todo a la vez que por falta de habilidad: tablas sin terminar, dos apps a medias y un reporte que nadie ve. Una entrega completa y pequeña vale más que una ambiciosa a medias.

**Ejemplo pequeño:** dos tablas con relación y diez registros, una sola app, un flujo de notificación y un reporte simple ya cuentan una historia completa: dato, app, automatización y reporte.

**Ahora haz algo — micropráctica (6 min):** **[Decidir qué entra en la entrega mínima](/practica/ip-dv-011-alcance-entrega-minima)**. Te da un tiempo limitado y varias ideas de alcance, y te pide elegir las que sí caben y las que conviene dejar para después.

**Evidencia a reportar (el dato exacto, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| La entrega que elegiste (mínima, completa o excelente) y por qué | ___ |
| Las 6 evidencias que vas a guardar para demostrarla | ___ |
| Qué dejas explícitamente para una iteración posterior | ___ |

---

**FASE 1: Diseño y Modelado de Datos (Días 1-3)**

> **Meta de la primera sesión:** termina esta fase antes de construir pantallas. Si el modelo queda claro, el resto del proyecto avanza con menos retrabajo.

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
      > **Dos columnas "Estado":** si tu entorno está en español, la columna del sistema `statecode` (Activo/Inactivo) también se muestra como **Estado** (así se llama, por ejemplo, en la tabla Contact: [Learn](https://learn.microsoft.com/es-es/power-apps/developer/data-platform/reference/entities/contact)). En fórmulas, vistas y Power BI te van a aparecer dos "Estado": la tuya es la que tiene el prefijo `sse_` (`sse_estado`) y las opciones Nueva, Pendiente Aprobación, etc.
    - Fecha Solicitud (DateTime). En la Canvas App se llena sola con un valor por defecto en el formulario (ver la Fase 2); en la Model-Driven, escríbela a mano al crear cada solicitud. Para reportes también puedes usar la columna del sistema **Created On** (fecha de creación)
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
    - Fecha (DateTime; rellénala desde la app con `Now()` o usa **Created On**)
    - Usuario (Lookup → User; rellénalo desde la app o usa la columna del sistema **Created By**)
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
- Solicitud 1:N Métrica Solicitud. Dataverse solo tiene relaciones 1:N (vistas desde el otro lado, N:1) y N:N, no 1:1: se crea como 1:N (Lookup Solicitud en Métrica Solicitud) y el flujo que la llena debe crear una sola métrica por solicitud
- Categoría 1:N Solicitudes

**Paso 5: Business Rules**

1. **Validación de fechas** (usa Fecha Requerida y Fecha Completada; en la entrega mínima solo si creaste esas dos columnas):
    - Si Estado = "Completada", Fecha Completada is required
    - Fecha Requerida >= Fecha Solicitud

2. **Auto-población (no es una Business Rule):**
    - "Si se elige una Categoría, poner como Aprobador el Aprobador Default de esa Categoría" **no lo plantees como Business Rule**: las condiciones y acciones de una regla se configuran sobre las columnas de su propia tabla, y la documentación de Microsoft no ofrece una forma de leer una columna de la Categoría relacionada. Hazlo en un flujo (Dataverse *When a row is added* → *Get a row by ID* de la Categoría → *Update a row* de la Solicitud) o, en la Canvas App, con un `LookUp` al guardar.

3. **Visibilidad condicional**:
    - Show "Comentarios Aprobador" only if Estado = Aprobada OR Rechazada (Set Visibility sobre la columna, Scope All Forms y rama ✕ con Hide, como en el Módulo 4, Paso 3.3)

## 🧩 Microlección 2 — Construir por capas: dato, app y lo que sale vacío

**¿Qué vas a aprender?** A construir primero el modelo de datos y después una sola app que lo consuma, y a leer una pantalla vacía como un síntoma de la condición que busca el dato, no del dato.

**¿Por qué existe esto?** Las capas de arriba heredan los problemas de las de abajo. Cuando una pantalla sale vacía, casi nunca falta el dato: lo que falla suele ser la condición que lo busca.

**Ejemplo pequeño:** comparar el correo del contacto con el correo del usuario actual trae sus solicitudes; compararlo con un identificador de otro tipo no trae nada y no da ningún error.

**Práctica real en tu entorno:** haz las Fases 1 a 3 de abajo, eligiendo **una sola** app como tu primera app funcional.

**FASE 2: Canvas App para Solicitantes (Días 4-7)**

> Puedes escoger esta fase como tu primera app funcional si quieres demostrar experiencia de usuario móvil y formularios rápidos.

> **Antes de abrir Power Apps Studio:** crea la app desde tu Solution para que quede dentro de ella: **Solutions** > tu Solution > **New** > **App** > **Canvas app**, y elige el formato (teléfono o tableta) ([Learn](https://learn.microsoft.com/power-apps/maker/canvas-apps/add-app-solution)).

**Paso 1: Estructura de pantallas**
```
1. ScreenInicio (Home)                      ← entrega mínima
   - Mis solicitudes activas (Gallery galMisSolicitudes)
   - Botón "Nueva Solicitud"
   - Métricas personales (etiquetas)

2. ScreenNuevaSolicitud                     ← entrega mínima
   - Form frmNueva para crear la solicitud
   - Upload de archivos adjuntos (opcional, versión completa)

3. ScreenDetalleSolicitud                   ← versión completa (opcional)
   - Información completa de solicitud
   - Línea de tiempo de comentarios
   - Agregar nuevo comentario

4. ScreenMisSolicitudes                     ← versión completa (opcional)
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
        Solicitante.Email = User().Email && Estado <> 'Estado (Solicitudes)'.Completada
        // Compara la columna Email del Contact (Solicitante) con el correo del usuario actual;
        // no uses la clave del contacto: es un GUID, nunca coincide con un correo
    )
);

// Calcular métricas
UpdateContext({
    TotalSolicitudes: CountRows(ColMisSolicitudes),
    PendientesAprobacion: CountRows(Filter(ColMisSolicitudes, Estado = 'Estado (Solicitudes)'.'Pendiente Aprobación')),
    EnProceso: CountRows(Filter(ColMisSolicitudes, Estado = 'Estado (Solicitudes)'.'En Proceso'))
})
```

> **Choices en Power Fx:** `Estado` es una columna *Choice*; su etiqueta ("Completada") es solo para mostrar, así que se compara con la enumeración de la elección, `'Estado (Solicitudes)'.Completada`, no con el texto. Las opciones con espacios o tildes van entre comillas simples. Si el nombre de tu tabla es otro, escribe `'Estado (` en la barra de fórmulas y elige la opción que te propone. Si te propone dos "Estado", elige el de tus opciones (Nueva, Completada...), no el del sistema.

> **En la entrega mínima, en ScreenInicio:**
> 1. Pon la fórmula de arriba en la propiedad **OnVisible** de la pantalla ScreenInicio (selecciona la pantalla en el árbol de la izquierda y elige `OnVisible` en la lista de propiedades). `OnVisible` se ejecuta cada vez que llegas a la pantalla, así que la lista se recarga al volver del formulario.
> 2. Agrega una galería vertical, llámala `galMisSolicitudes` y en su propiedad **Items** escribe `ColMisSolicitudes`. Dentro de la galería muestra al menos el Título y el Estado.
> 3. Si la galería sale vacía sin ningún error: el filtro solo trae filas cuyo **Solicitante** es un contacto con **tu mismo correo** y cuyo Estado no es Completada. Revisa la "Carga de datos" de la ruta mínima (tu contacto y tus 5 solicitudes).
> 4. Métricas (también tu plan B si no tienes Power BI): agrega tres etiquetas (**Label**) y en su propiedad **Text** escribe `"Total: " & TotalSolicitudes`, `"Pendientes de aprobación: " & PendientesAprobacion` y `"En proceso: " & EnProceso`.
> 5. Agrega un botón "Nueva Solicitud" con **OnSelect**: `NewForm(frmNueva); Navigate(ScreenNuevaSolicitud, ScreenTransition.Cover)`. `NewForm` deja el formulario listo para una solicitud nueva; hace falta porque, después de guardar, el formulario pasa a modo edición ([Learn](https://learn.microsoft.com/power-platform/power-fx/reference/function-form)).

> **En la entrega mínima, en ScreenNuevaSolicitud:**
> 1. Agrega un formulario de edición (**Edit form**), llámalo `frmNueva`, conéctalo a la tabla Solicitudes y deja visibles las columnas que creaste. En **Solicitante** elige tu propio contacto cuando pruebes.
> 2. **Fecha Solicitud automática:** selecciona la tarjeta (*card*) de Fecha Solicitud, desbloquéala (panel de propiedades, pestaña **Advanced** > **Unlock to change properties**) y cambia su propiedad **Default** a `Coalesce(ThisItem.'Fecha Solicitud', Now())`. Así, en una solicitud nueva propone la fecha y hora actuales (`Coalesce` devuelve el primer valor que no está vacío). Lo que se guarda es la propiedad **Update** de la tarjeta, que lee el control de fecha, así que no la toques ([Learn: tarjetas](https://learn.microsoft.com/power-apps/maker/canvas-apps/working-with-cards), [Learn: Coalesce](https://learn.microsoft.com/power-platform/power-fx/reference/function-isblank-isempty)).
> 3. Agrega un botón "Guardar" con **OnSelect**: `SubmitForm(frmNueva)`.
> 4. En la propiedad **OnSuccess** del formulario pon la fórmula de abajo, **con la versión mínima de la navegación**.

*Gallery con búsqueda* (versión completa, en **ScreenMisSolicitudes**): en esa pantalla agrega un cuadro de texto (**Text input**) llamado `txtBusqueda` y una galería vertical; en la propiedad **Items** de la galería escribe:
```javascript
// ColMisSolicitudes es una Collection local (la cargó ScreenInicio): 'in' es válido aquí, no hay límite de delegación
Sort(
    Filter(
        ColMisSolicitudes,
        txtBusqueda.Text in Título || txtBusqueda.Text in Descripción
    ),
    'Fecha Solicitud',
    SortOrder.Descending
)
```

*Form Nueva Solicitud - OnSuccess:*
```javascript
// Notificar éxito
Notify("Solicitud creada exitosamente", NotificationType.Success);

// Ejecutar flujo de Power Automate
// En Dataverse no hay una columna "ID" numérica: la clave de la fila es un GUID cuyo nombre lógico
// es el de la tabla + "id" (aquí sse_solicitudid; confírmalo en Columns de tu tabla). El flujo recibe texto.
'Flujo Notificar Nueva Solicitud'.Run(Text(frmNueva.LastSubmit.sse_solicitudid));

// Entrega mínima: volver a la pantalla de inicio (su OnVisible recarga la lista)
Navigate(ScreenInicio, ScreenTransition.Cover)

// Versión completa (cuando exista ScreenDetalleSolicitud), en lugar de la línea anterior:
// Navigate(ScreenDetalleSolicitud, ScreenTransition.Cover, {RegistroActual: frmNueva.LastSubmit})
```

> **El nombre del flujo en la fórmula:** `'Flujo Notificar Nueva Solicitud'` solo existe después de agregar el flujo a la app (ver el recuadro del Flujo 1 en la Fase 4). Hasta entonces la línea sale en rojo; puedes escribir primero el resto y añadirla al final. Al escribirla, teclea las primeras letras del nombre del flujo y **elige el nombre que te propone la barra de fórmulas** (IntelliSense): si tu flujo se llama distinto, usa ese nombre. El tercer argumento de `Navigate` (`{RegistroActual: ...}`) crea la variable de contexto `RegistroActual` en la pantalla de destino ([Learn](https://learn.microsoft.com/power-platform/power-fx/reference/function-updatecontext)).

**Ahora diagnostica — micropráctica (5 min):** **[Diagnosticar: mi pantalla de inicio sale vacía](/practica/ip-trb-006-pantalla-de-inicio-vacia)**. Parte de un síntoma exacto —la lista vacía sin ningún error aunque hay datos— y te pide la causa y la corrección, antes de ver la solución.

**Paso 3: Agregar componentes avanzados** (versión completa: necesita la tabla Comentario y la pantalla ScreenDetalleSolicitud)

*Component: Timeline de Comentarios* (en ScreenDetalleSolicitud)
```javascript
// Items de una Gallery vertical de comentarios
// La columna Lookup Solicitud se compara con el registro completo, no con un "ID"
// (Power Fx permite comparar una referencia de registro con un registro completo)
Sort(
    Filter(Comentarios, Solicitud = RegistroActual),
    Fecha,
    SortOrder.Descending
)

// Form agregar comentario
Button OnSelect:
Patch(
    Comentarios,
    Defaults(Comentarios),
    {
        Solicitud: RegistroActual,  // un Lookup se asigna con el registro relacionado
        Comentario: txtComentario.Text,
        Tipo: 'Tipo (Comentarios)'.Información,  // Choice: se asigna su enumeración, no {Value: "..."}
        Usuario: LookUp(Users, 'Primary Email' = User().Email)
        // LookUp a la tabla Users de Dataverse — {ID: User().Email} es incorrecto porque ID debe ser GUID, no email
    }
);
Reset(txtComentario);
Refresh(Comentarios)
```

**FASE 3: Model-Driven App para Gestión (Días 8-10)**

> Puedes escoger esta fase como tu primera app funcional si quieres demostrar gestión operativa, vistas, formularios y proceso guiado.

> **Antes de empezar:** crea la app desde dentro de tu Solution (**Solutions** > tu Solution > **New** > **App** y el tipo Model-driven), para que quede incluida en ella.
>
> **En la entrega mínima:** en el sitemap basta un área con la página **Solicitudes** (y, si quieres, Categorías); en el formulario, una sola pestaña con las columnas que creaste; y una vista. **Fecha Solicitud** se escribe a mano en el formulario: la documentación de Business Rules no ofrece una acción para poner "la fecha de hoy" ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)).

**Paso 1: Configurar sitemap** (el menú de navegación de la app: áreas, grupos y páginas; [Learn](https://learn.microsoft.com/power-apps/maker/model-driven-apps/app-navigation))
```
Área: Solicitudes
  Group: Gestión
    - Solicitudes (vista)
    - Aprobaciones Pendientes (vista filtrada)
    - Mis Asignaciones (vista personal)
  Group: Configuración
    - Categorías
    - Métricas (versión completa: solo si creaste la tabla Métrica Solicitud)

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
   Columnas: Título, Prioridad, Estado, Fecha Requerida
   Orden: Fecha Requerida ASC (la que vence antes, primero)
   ```
   > Una vista solo muestra columnas que existen en la tabla; no calcula "días restantes". Ordenar por Fecha Requerida ya pone arriba lo que vence antes.
   > No ordenes esta vista por Prioridad: las vistas ordenan las columnas Choice por el texto de la opción (alfabético), así que "Alta" saldría antes que "Crítica" ([Learn](https://learn.microsoft.com/power-apps/developer/data-platform/fetchxml/order-rows#choice-columns)). Si quieres ver primero lo urgente, filtra por Prioridad o añade una columna numérica que la represente, como el SLA Horas del Módulo 2.

3. **Chart View: Solicitudes por Tipo**
   ```
   Chart Type: Donut
   Agregación: Count: All (sobre una columna que siempre tenga valor)
   Grouping: Tipo
   ```

**Paso 4: Business Process Flow** (versión completa; todas las columnas son de la tabla Solicitud)
```
Stage 1: Creación
  - Título, Tipo, Categoría, Descripción
  
Stage 2: Aprobación (if required)
  - Aprobador
  - Fecha Aprobación
  - Comentarios Aprobador
  
Stage 3: Ejecución
  - Asignado a
  - Estado → En Proceso
  
Stage 4: Cierre
  - Comentarios Cierre
  - Estado → Completada
```

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El nombre de tu Solution, su publisher y su prefijo | ___ |
| Las tablas que creaste y la relación principal entre ellas | ___ |
| La app que elegiste como primera app funcional y cuántos registros reales muestra | ___ |

---

## 🧩 Microlección 3 — Automatizar, probar y cerrar con evidencia

**¿Qué vas a aprender?** A conectar un flujo a tu app, a comprobar con el historial de ejecución que realmente corrió, y a cerrar el proyecto con la evidencia mínima.

**¿Por qué existe esto?** Un proyecto "terminado" que nadie puede demostrar no cuenta. Las capturas, el historial de ejecución y un README breve son lo que lo convierte en una historia que puedes contar en una entrevista.

**Ejemplo pequeño:** el Flujo 1 notifica al crear una solicitud; el Run history muestra la ejecución exitosa y el correo llegó a quien correspondía.

**Práctica real en tu entorno:** haz las Fases 4 a 7 según la entrega que elegiste; para la mínima basta el Flujo 1, un reporte simple y la evidencia de cierre. Esta microlección no tiene micropráctica propia; la verificación es el Run history de tu flujo y tu README.

**FASE 4: Power Automate Flujos (Días 11-13)**

> Para el entregable mínimo, implementa primero solo el Flujo 1. Los demás flujos completan la madurez del proyecto, pero no son necesarios para demostrar integración básica.

> **Flujo 1 en versión mínima.** La versión de abajo usa aprobaciones y llama al Flujo 3, que la entrega mínima no tiene. Para la mínima, construye esto:
> - **Dónde se crea:** dentro de tu Solution, para que aparezca en la evidencia: **Solutions** > tu Solution > **New** > **Automation** > **Cloud flow** ([Learn](https://learn.microsoft.com/power-automate/create-flow-solution)). Ponle exactamente el nombre `Flujo Notificar Nueva Solicitud`. Si lo creaste fuera, agrégalo después con **Add existing** > **Automation** > **Cloud flow**.
> - **Trigger:** si elegiste Canvas, el trigger de Power Apps (V2) del conector **Power Apps** con una entrada de texto `SolicitudID`; si elegiste Model-Driven, el trigger de Dataverse **When a row is added, modified or deleted** (Change type: Added, Table: Solicitudes), igual que en la Práctica 5.1.
> - **Get a row by ID** (Dataverse), Table name: Solicitudes. En **Row ID** pon el identificador de la solicitud: con el trigger de Power Apps, la entrada `SolicitudID`; con el de Dataverse, el identificador de la fila que trae el trigger.
> - **Get a row by ID**, Table name: Contacts. En **Row ID** necesitas el identificador (GUID) del contacto que es Solicitante, no su nombre: abre el contenido dinámico, busca "Solicitante" dentro de los resultados del paso anterior y elige el que corresponde al **valor o ID** del lookup, no el que trae el nombre (si eliges el del nombre, la acción falla con un error de ID no válido) ([Learn](https://learn.microsoft.com/power-automate/dataverse/get-row-id)).
> - **Send an email (V2)**: en **To** pon el **Email** del contacto (del paso anterior) y en el cuerpo el título, el tipo y la prioridad. Para que el correo te llegue a ti, ese contacto debe tener un correo real que puedas abrir: el tuyo de trabajo (ver la "Carga de datos"). Para mostrar Tipo y Prioridad, usa su etiqueta (la versión del campo con el texto, no el número).
> - Sin condición ni aprobación. El Estado queda en "Nueva".
>
> La llamada desde la Canvas App es la del `OnSuccess` de la Fase 2: primero agrega el flujo a la app (en Power Apps Studio, menú de la app **Power Automate** > **Add a flow** y elige tu flujo) para que `'Flujo Notificar Nueva Solicitud'.Run(...)` exista ([Learn](https://learn.microsoft.com/power-apps/maker/canvas-apps/working-with-flows)). Al escribir la fórmula, usa el nombre que te propone IntelliSense.
>
> **Comprueba:** crea una solicitud desde la app y abre el flujo > **Run history** (historial de ejecuciones): debe aparecer una ejecución correcta con su hora, y el correo debe estar en tu bandeja.

**Flujo 1: Notificar Nueva Solicitud**
```
Trigger: Manual (llamado desde Canvas App)
Input: Solicitud ID

Actions:
1. Get Solicitud by ID
2. Get Solicitante (Contact)
3. Get Categoría de la solicitud
4. Condition: Si la Categoría tiene Requiere Aprobación = Sí
   YES:
     - Update Solicitud: Estado = "Pendiente Aprobación"
       (eso dispara el Flujo 2, que pide la aprobación)
   NO:
     - Update Solicitud: Estado = "Aprobada"
       (eso dispara el Flujo 3, que la asigna)
5. Send email a Solicitante con confirmación
```

**Flujo 2: Procesar Aprobación**

> El conector **Approvals** no tiene triggers propios del tipo "cuando se responde una aprobación": el patrón documentado es la acción **Start and wait for an approval**, que envía la aprobación y espera la respuesta dentro del mismo flujo ([Learn](https://learn.microsoft.com/connectors/approvals/)).

```
Trigger: Dataverse - When a row is added, modified or deleted
  (Change type: Modified, Table: Solicitudes)
Condition inicial: sigue solo si Estado = "Pendiente Aprobación"

Actions:
1. Get Aprobador (el Aprobador Default de la Categoría)
2. Start and wait for an approval
   (de tipo Aprobar/Rechazar, asignada al correo del Aprobador)
3. Create registro en Aprobación table (Decisión, Fecha Decisión, Comentarios)
4. Condition: Si Outcome = "Approve"
   YES:
     - Update Solicitud: Estado = "Aprobada"  (dispara el Flujo 3)
     - Send email a Solicitante (aprobada)
   NO:
     - Update Solicitud: Estado = "Rechazada"
     - Send email a Solicitante (rechazada) con comentarios
```

**Flujo 3: Asignar Solicitud Automáticamente**
```
Trigger: Dataverse - When a row is modified (Solicitudes)
Condition inicial: sigue solo si Estado = "Aprobada"

Actions:
1. Get Categoría de la solicitud
2. Switch por Tipo (un camino por cada valor):
   TI: Asignar a un usuario fijo (o, más adelante, en round-robin: por turnos)
   Mantenimiento: Asignar a un usuario fijo del equipo de mantenimiento
   RRHH: Asignar a responsable área
   Compras: Asignar a comprador
3. Update Solicitud: Asignado a = {Usuario}
4. Send Teams notification a asignado
5. Create task en Planner (opcional)
```

> **Versión completa (opcional):** si quieres elegir al técnico según disponibilidad, crea antes una tabla **Técnico** (Nombre; Usuario: Lookup → User; Tipo Solicitud: Choice; Disponible: Yes/No) y en la rama Mantenimiento usa **List rows** de Técnicos con Disponible = Sí y toma el primero.

**Flujo 4: Alertas de SLA y Recordatorios**
```
Trigger: Recurrence (cada hora)

Actions:
1. List rows Solicitudes
   Filter rows (OData; Estado se filtra por el número de la opción, que ves en la columna Choice):
   (sse_estado eq <número de Aprobada> or sse_estado eq <número de En Proceso>)
     and sse_fecharequerida le @{addDays(utcNow(), 2)}
2. Apply to each:
   - Condition: Si Fecha Requerida < utcNow() (vencida)
     YES: Send escalation email a manager
     NO: Send reminder email a Asignado
   - Add comment to Solicitud timeline
```

> `DateAdd(Today(), ...)` es Power Fx y no funciona en Power Automate. En un flujo, el filtro **Filter rows** de **List rows** es una expresión OData (`eq`, `le`, `and`, `or`) y las fechas se calculan con expresiones de flujo: `utcNow()` devuelve la fecha y hora actuales y `addDays(fecha, 2)` le suma 2 días ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows), [Learn: operadores de filtro](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows), [Learn: funciones de expresión](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference)).

**FASE 5: Power BI Dashboard (Días 14-16)**

> Si no tienes permisos de Power BI Service, crea el reporte en Power BI Desktop y guarda capturas. RLS y publicación pueden quedar documentados como siguiente iteración.

> **Power BI en versión mínima** (archivo nuevo, no el `.pbix` del Módulo 6):
> 1. Abre Power BI Desktop, crea un reporte en blanco y guárdalo enseguida como `reporte-solicitudes-sse.pbix` en tu carpeta Documentos. Vuelve a guardar (**File > Save**) al terminar cada paso.
> 2. Conecta a Dataverse como en el Módulo 6 (Práctica 6.1, Paso 2) y en el **Navigator** marca tu tabla de solicitudes (por su nombre interno; por ejemplo `sse_solicitud`, según cómo la hayas creado) y, si quieres el filtro por categoría, `sse_categoriasolicitud`. Selecciona **Transform Data**.
> 3. En Power Query renombra la consulta de solicitudes como `Solicitudes` (y la de categorías como `Categorías`). Con **Home > Choose columns** deja solo las columnas que vas a usar y renómbralas (doble clic en el encabezado):
>
>     | Columna original (aprox.) | Nombre nuevo |
>     |---|---|
>     | `sse_titulo` | Título |
>     | `sse_estadoname` | Estado |
>     | `sse_prioridadname` | Prioridad |
>     | `sse_tiponame` | Tipo |
>     | `sse_fechasolicitud` | Fecha Solicitud |
>     | `sse_categoria` | Categoría ID |
>
>     Igual que en el Módulo 6, cada Choice llega en dos columnas: el número (`sse_estado`) y la etiqueta (`sse_estadoname`); usa la que termina en `name`. Los nombres exactos dependen de cómo creaste las columnas: confírmalos en Power Apps (Tables > tu tabla > Columns). Cuidado con el **Estado** del sistema (`statecode` / `statecodename`): no es el tuyo.
> 4. **Close & Apply**. Crea la medida `Total Solicitudes = COUNTROWS(Solicitudes)` y dos visuales: un **Clustered column chart** con `Estado` en **X-axis** y `Total Solicitudes` en **Y-axis**, y otro igual con `Prioridad`.
> 5. **Los estados de este proyecto son otros.** Las medidas del Módulo 6 buscan "Resuelta" y "Cerrada", que aquí no existen. Si quieres más medidas, usa estas versiones adaptadas (y revisa que las etiquetas coincidan letra por letra con las tuyas):
>
>     ```dax
>     Solicitudes Abiertas =
>     COUNTROWS(
>         FILTER(
>             Solicitudes,
>             Solicitudes[Estado] IN {"Nueva", "Pendiente Aprobación", "Aprobada", "En Proceso"}
>         )
>     )
>
>     % Completadas =
>     DIVIDE(
>         COUNTROWS(FILTER(Solicitudes, Solicitudes[Estado] = "Completada")),
>         COUNTROWS(Solicitudes),
>         0
>     )
>     ```
>
>     "Rechazada" no es abierta ni completada: por eso Abiertas + Completadas puede dar menos que el total. Las medidas de días de resolución del Módulo 6 necesitan una fecha de cierre (aquí, Fecha Completada), que la entrega mínima no tiene.

**Paso 1: Conectar y modelar datos** (versión completa)
```
Tables (en Power BI renombra las consultas así):
- Solicitudes  ← tabla Solicitud (fact: cada fila es una solicitud)
- Categorías   ← tabla Categoría Solicitud (dimension)
- Métricas     ← tabla Métrica Solicitud (una fila por solicitud, con Cumplió SLA)
- Contacts     ← tabla Contact (dimension: el Solicitante, con su Email y Departamento)
- Users        ← tabla User / systemuser de Dataverse (dimension: los usuarios del
                 entorno, que vienen de Microsoft Entra ID, antes llamado Azure AD).
                 Deja su ID (systemuserid), el nombre y Primary Email
- Calendario   ← opcional: tabla de fechas creada con DAX: Calendario = CALENDARAUTO()
                 (tema del Módulo 12)
```

> Relaciones: Categorías, Contacts y Users filtran a Solicitudes (de muchos a uno, como en el Módulo 6; Users se une por la columna del Aprobador, que en Solicitudes puedes renombrar `Aprobador ID`), y Solicitudes filtra a Métricas (cada métrica tiene el Lookup a su Solicitud). Con dirección **Single**, el filtro viaja del lado "uno" al lado "muchos": por eso los cálculos sobre `Cumplió SLA` se hacen contando filas de **Métricas**, que es donde está la columna. Sobre las tablas de hechos y dimensiones: [Learn](https://learn.microsoft.com/power-bi/guidance/star-schema); sobre la tabla de fechas: [Learn](https://learn.microsoft.com/power-bi/guidance/model-date-tables).

**Paso 2: DAX Measures** (versión completa; mismo estilo `COUNTROWS(FILTER(...))` del Módulo 6)
```dax
Total Solicitudes = COUNTROWS(Solicitudes)

Solicitudes Abiertas =
COUNTROWS(
    FILTER(
        Solicitudes,
        Solicitudes[Estado] IN {"Nueva", "Pendiente Aprobación", "Aprobada", "En Proceso"}
    )
)

% Cumplieron SLA =
DIVIDE(
    COUNTROWS(FILTER(Métricas, Métricas[Cumplió SLA] = TRUE())),
    COUNTROWS(Métricas),
    0
)
// Se cuentan filas de Métricas: allí está la columna Cumplió SLA.
// En Power Query, deja Cumplió SLA con tipo True/False.

Tiempo Promedio Resolución Días =
AVERAGE(Métricas[Tiempo Resolución Horas]) / 24

Backlog Vencido =
COUNTROWS(
    FILTER(
        Solicitudes,
        Solicitudes[Estado] = "En Proceso"
            && NOT ISBLANK(Solicitudes[Fecha Requerida])
            && Solicitudes[Fecha Requerida] < TODAY()
    )
)
```

**Paso 3: Visualizaciones clave** (versión completa)

*Página 1: Executive Dashboard*
```
1. KPI Cards (top row):
   - Total Solicitudes
   - % Cumplieron SLA
   - Tiempo Promedio Resolución Días
   - Backlog Vencido
   (Opcional, Módulo 12: Total del mes actual vs mes anterior; necesita la
    tabla Calendario y funciones de inteligencia de tiempo)

2. Stacked column chart: Solicitudes por Tipo y Estado
3. Line Chart: Trend por mes (Fecha Solicitud en el eje X)
4. Funnel: Solicitudes por Estado
5. Table: Top 10 Categorías más solicitadas
```

*Página 2: Análisis Operativo*
```
1. Matrix con formato condicional (efecto "mapa de calor"): Tipo en filas,
   Prioridad en columnas y Total Solicitudes en valores, con
   Conditional formatting > Background color
2. Clustered column chart: Tiempo Promedio Resolución Días por Tipo
3. Scatter: Costo Estimado vs Costo Real (identificar desviaciones)
4. Matrix: Solicitantes vs Tipos (pivot)
```

> Power BI no trae de fábrica un visual "Heatmap" ni "Box Plot": existen como visuales personalizados de AppSource. El efecto de mapa de calor se logra con formato condicional en una tabla o matriz ([Learn: visuales](https://learn.microsoft.com/power-bi/visuals/power-bi-visualizations-overview), [Learn: formato condicional](https://learn.microsoft.com/power-bi/create-reports/desktop-conditional-table-formatting)).

**Paso 4: Configurar Row-Level Security** (versión completa; mismo patrón que el Módulo 6, Práctica 6.5, Paso 5)
```dax
Role: Solicitante        (tabla Contacts)
[Email] = USERPRINCIPALNAME()
// Cada persona ve solo las solicitudes donde ella es el Solicitante:
// el filtro baja de Contacts a Solicitudes por la relación.

Role: Aprobador          (tabla Users)
[Primary Email] = USERPRINCIPALNAME()
// Usa la relación Users (Aprobador ID) → Solicitudes.

Role: Departamento Finanzas   (tabla Contacts)
[Departamento] = "Finanzas"
// Filtro fijo: un departamento se compara con un texto, nunca con un correo.
```

> `USERPRINCIPALNAME()` devuelve el nombre de inicio de sesión (UPN), que no siempre es igual al correo; confírmalo antes de usar estas reglas. RLS solo se aplica a quienes tienen rol **Viewer** en el workspace ([Learn](https://learn.microsoft.com/fabric/security/service-admin-row-level-security)).

**FASE 6: Seguridad y Testing (Días 17-19)**

> No necesitas muchos usuarios reales para aprender el patrón. Con 2-3 usuarios de prueba, o una matriz documentada si tu tenant no permite crearlos, ya puedes demostrar criterio de seguridad.

**Paso 1: Configurar Security Roles**

> **Cómo leer los roles de abajo:** cada línea es tabla: privilegio (nivel de acceso). Los privilegios son Create, Read, Write, Delete, Append, Append to, Assign y Share; los niveles son **User** (los registros que la persona posee o le compartieron), **Business Unit** (los de su unidad de negocio) y **Organization** (todos) ([Learn](https://learn.microsoft.com/power-platform/admin/security-roles-privileges)). Un rol da permisos **por tabla, no por columna**: para que alguien pueda editar solo algunas columnas se usan **perfiles de seguridad de columna** (*column security profiles*), como se explica después del rol Ejecutor.

*Role: Solicitante*
```
Solicitud: Create (User), Read (User), Write (User)
Comentario: Create (User), Read (User)
Categoría: Read (Organization)
Aprobación: Read (User)
```

*Role: Aprobador*
```
Solicitud: Read (Business Unit), Write (Business Unit)
Aprobación: Create, Read, Write, Delete (Business Unit)
Todos los roles de Solicitante
```

*Role: Ejecutor*
```
Solicitud: Read (Organization), Write (Organization)
Comentario: Create, Read (Organization)
Métrica: Create, Read, Write (Organization)
Todos los roles de Solicitante
```

> **Limitar columnas (versión completa, opcional):** si quieres que el Aprobador solo pueda cambiar **Comentarios Aprobador** y el Ejecutor solo **Comentarios Cierre** o **Costo Real**, activa **Enable column security** en esas columnas (Advanced options de la columna) y crea **column security profiles** en el Power Platform admin center (entorno > **Settings** > **Users + permissions** > **Column security profiles**), dando Read/Update a cada perfil. Ojo: las columnas Lookup (como **Asignado a**), la columna principal y las del sistema no se pueden proteger así, y la protección no aplica a quien tiene el rol System Administrator ([Learn](https://learn.microsoft.com/power-platform/admin/field-level-security)).

*Role: Administrador*
```
Full access a todas las tablas
Configuración de solución
```

**Paso 2: Plan de Testing**

| Escenario | Pasos | Resultado Esperado |
|-----------|-------|-------------------|
| Crear solicitud simple | Usuario crea solicitud de una Categoría con Requiere Aprobación = No | Solicitud en estado "Aprobada", asignada automáticamente |
| Crear solicitud con aprobación | Usuario crea solicitud de una Categoría con Requiere Aprobación = Sí (por ejemplo, Compras) | Solicitud en "Pendiente Aprobación", aprobador recibe la aprobación |
| Aprobar solicitud | Aprobador aprueba desde el correo o desde Approvals | Solicitud pasa a "Aprobada", ejecutor asignado y notificado |
| Rechazar solicitud | Aprobador rechaza con comentarios | Estado "Rechazada", solicitante notificado con razones |
| Agregar comentarios | Solicitante y ejecutor intercambian comentarios | Timeline actualizado en tiempo real en ambas apps |
| Completar solicitud | Ejecutor marca como completada | Estado "Completada", métrica calculada, dashboard actualizado |
| SLA vencido | Solicitud no completada antes de fecha requerida | Email escalación a manager, alerta en dashboard |
| Ver dashboard | Usuario con el rol RLS Departamento Finanzas abre el reporte | Solo ve solicitudes de solicitantes de Finanzas (RLS) |

**Paso 3: Testing multi-role**

- Crear 3 usuarios de prueba: Solicitante, Aprobador, Ejecutor
- Ejecutar cada escenario completo
- Validar permisos (usuario no debe ver datos fuera de su scope)
- Probar en móvil (Canvas App responsive)

**FASE 7: Documentación y Despliegue (Días 20-21)**

> En un ambiente de aprendizaje, "despliegue" puede significar exportar la solution y documentar los pasos. No prometas producción real si no tienes ambiente TEST/PROD.

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

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El flujo que automatizaste y la hora de su ejecución exitosa en el Run history | ___ |
| La lista de componentes que contiene tu Solution | ___ |
| Una decisión de seguridad que tomaste o, si no llegaste a la Fase 6, el rol que crearías y por qué | ___ |

---

## 🔁 Reto de transferencia — El mismo proyecto, otro negocio, sin pasos

Esta vez no te digo las tablas ni los pasos: aplica lo que construiste a un negocio distinto.

> **Requerimiento:** una universidad quiere gestionar las reservas de sus salas de estudio. Quien reserva es un estudiante; el responsable de espacios las aprueba y quiere ver cuántas horas se ocupa cada sala. Diseña la entrega mínima de este proyecto para ese negocio.
> **Criterios de aceptación:** (1) defines al menos 2 tablas relacionadas, con las columnas y el tipo correcto de cada una; (2) eliges UNA app y justificas por qué, según quién la usa; (3) describes un flujo de notificación y cómo evitarías reservar la misma sala en horarios que se cruzan (qué columnas guardas, por ejemplo hora de inicio y hora de fin, y en qué punto compruebas si ya hay una reserva que se cruza); (4) dices qué reporte le sirve al responsable.
> **Restricciones:** no copies las tablas de Solicitudes. No necesitas tenant: es un documento de una página que puedes convertir después en el README de tu proyecto.
> **Pistas si te atoras:** el orden de trabajo es el de la entrega mínima (dato, app, flujo, reporte); la comprobación de reservas que se cruzan se hace en un flujo antes de confirmar la reserva (una Business Rule solo ve el registro que se está guardando, no los demás); el reporte responde a una sola pregunta del responsable.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: el mismo proyecto para reservas de salas](/practica/ip-dv-012-transferir-proyecto-reservas)**. Retoma el mismo caso y te pide decidir qué se conserva del método y qué cambia.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus tablas con sus columnas y la relación entre ellas | ___ |
| La app que elegiste y por qué, según quién la usa | ___ |
| Cómo evitas reservar la misma sala en horarios que se cruzan, y el flujo de notificación | ___ |

### 💼 Caso Real de Negocio

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

### ✅ Buenas Prácticas

- **Diseñar el modelo de datos primero, nunca al revés.** El tiempo invertido en revisar el modelo antes de crear la primera pantalla siempre se recupera. Un cambio de relación a mitad del proyecto puede requerir recrear flujos y formularios completos.
- **Usar un único publisher prefix en todos los componentes.** `sse_` en todos los campos, `sse_` en nombres de solución. Nunca mezclar prefijos dentro del mismo proyecto.
- **Nombrar controles en Canvas App desde el inicio.** `btnEnviar`, `galSolicitudes`, `txtBusqueda`. Cambiar nombres a mitad del proyecto rompe las fórmulas Power Fx que los referencian.
- **Crear el security model en paralelo con el data model.** Los Security Roles deben crearse antes de asignar a usuarios de prueba — no al final del proyecto.
- **Parametrizar todo lo configurable.** Usar Environment Variables para URLs, correos de notificación, y flags de configuración. Nunca hardcodear valores que puedan cambiar entre ambientes.
- **Versionar la solución en cada entregable.** `1.0.0.0` para la primera versión funcional, `1.1.0.0` para mejoras menores. El número de versión en la solución es el historial de cambios.
- **Probar con datos reales desde el sprint 1.** Cargar datos representativos temprano revela problemas de performance y delegación antes de que sean costosos de resolver.
- **Documentar decisiones arquitectónicas mientras las tomas.** Al final del proyecto, nadie recuerda por qué se eligió un tipo de relación específico o por qué un flujo tiene cierta estructura.

### ⚠️ Errores Comunes

- **Crear tablas sin prefijo o con `new_`.** Genera conflictos al importar la solución en ambientes con otras soluciones instaladas. **Fix:** eliminar columnas `new_` y recrearlas con el prefijo correcto antes de comenzar a poblar datos.
- **Olvidar activar auditoría antes de los primeros datos.** La auditoría de Dataverse no aplica retroactivamente — los registros creados antes de activarla no tienen historial. **Fix:** activar auditoría como paso 2, inmediatamente después de crear las tablas.
- **Canvas App con 200+ fórmulas en OnStart.** Carga lenta, difícil de mantener, errores de delegación silenciosos. **Fix:** distribuir inicialización en OnVisible de cada pantalla y usar variables de colección solo cuando sean necesarias.
- **Flujos de Power Automate sin manejo de errores.** Un flujo que falla silenciosamente es peor que uno que no existe. **Fix:** envolver toda la lógica principal en un Scope y agregar Scope de catch con registro del error y notificación al administrador.
- **Security Roles demasiado permisivos ("por ahora").** "Por ahora" se convierte en permanente. **Fix:** comenzar con el mínimo privilegio y agregar permisos según se identifican necesidades, no al revés.
- **Dashboard Power BI sin RLS desde el inicio.** Agregar RLS después de que el informe está en producción requiere rediseñar el modelo. **Fix:** configurar los roles de RLS antes de publicar el informe por primera vez.
- **No usar Connection References en los flujos.** La solución queda atada a conexiones del ambiente de desarrollo y falla al importar. **Fix:** siempre crear Connection References para cada conector usado en flujos y configurarlas como parte del despliegue.
- **Exportar como Unmanaged a producción.** Permite edición directa en PROD, generando desvíos entre ambientes. **Fix:** exportar siempre como Managed para producción — las personalizaciones solo van por el pipeline.

### 🧪 Criterios de Validación Final

> Estos criterios son de la **entrega completa**. Si vas por la mínima, tu criterio de cierre es la sección "Evidencia mínima de cierre" de abajo (6 evidencias).

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

**Rúbrica de cierre:** evalúa este proyecto con la rúbrica *Low-code / Maker* de
[Rúbricas y Plantillas de Evaluación](/recursos/rubricas-plantillas). Aprobación: ≥65/100 sin
ningún criterio en 0. Nivel profesional/excelencia: ≥85/100.

### 📸 Evidencia mínima de cierre
- Captura de la Solution con tablas, apps y flujo incluidos.
- Captura del modelo de datos con relaciones principales.
- Captura de la app elegida funcionando con registros reales.
- Captura del flujo con una ejecución exitosa en Run history.
- Captura del reporte/dashboard o, si no se pudo publicar, del `.pbix` abierto en Power BI Desktop (sin Power BI: el dashboard o la vista con gráfico de la Model-Driven, o las etiquetas de métricas de la Canvas).
- Breve README del proyecto: problema, alcance, arquitectura, decisiones de seguridad y próximos pasos.

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

- **Tiempo invertido en todo el Nivel 1** (los 8 módulos con su práctica, no solo este proyecto): 240-360 horas, estimación del plan, no medida con alumnos. Solo la construcción de este proyecto: unas 7-12 horas la entrega mínima y 35-50 horas la completa (también estimación)
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

- [Power Platform Documentation](https://learn.microsoft.com/power-platform/)
- [Power Fx Formula Reference](https://learn.microsoft.com/power-platform/power-fx/formula-reference-overview)
- [DAX Function Reference](https://learn.microsoft.com/dax/dax-function-reference)

**Referencias de la comunidad (no oficiales de Microsoft)**:

- [DAX Guide](https://dax.guide/): referencia de DAX mantenida por la comunidad; útil, pero la fuente oficial es Microsoft Learn.

**Comunidades**:

- Power Platform Community: los foros de la comunidad de Power Apps, Power Automate y Power BI (búscalos por ese nombre).
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

**Próximo hito**: [Nivel 2: Intermedio](/nivel/intermedio)

---

*Última verificación contra Microsoft Learn: noviembre 2026*  
*Versión: 1.0.0*  
*Autor: Plan Maestro Power Platform*
