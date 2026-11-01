---
id: lab-04
title: "Model-Driven App — Sistema de Gestión de Solicitudes Completo"
level: "N1"
duration: 150
product: ["Power Apps Model-Driven", "Dataverse"]
certifications: ["PL-900"]
role: ["Maker", "Developer"]
prerequisites:
  - "Lab 02 completado — tablas sit_Solicitud y sit_Categoria con datos"
  - "Lab 09 no es necesario: si ya lo hiciste, el lab indica dónde aparecen su BPF y sus columnas"
files: []
lastVerified: "2026-11"
---

# Lab 04 — Model-Driven App: Sistema Completo de Gestión de Solicitudes SIT

## Objetivo

Al finalizar este laboratorio podrás construir una Model-Driven App completa con navegación de dos áreas, formularios Main, Quick Create y Quick View, una subcuadrícula de registros relacionados, vistas orientadas a roles, un dashboard con gráficos y lista, y dos Security Roles (Solicitante y Técnico TI) que definen qué puede hacer cada perfil.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 02

**Problema a resolver:** La Canvas App del Lab 03 es ideal para crear solicitudes desde el móvil, pero el equipo de soporte TI necesita una interfaz de escritorio con vistas de trabajo, dashboard de métricas y acceso directo al BPF. La Model-Driven App es la herramienta correcta para los técnicos — no para los solicitantes.

**Por qué Model-Driven App:** Generada automáticamente desde los metadatos de Dataverse, incluye timeline de actividades, navegación por áreas y grupos, y se actualiza sin rediseño cuando agregas columnas al modelo de datos. Es la interfaz estándar de Dynamics 365.

## Relación con el Módulo 4

Este lab repite las técnicas del Módulo 4 (páginas, áreas, formularios, vistas, gráficos, dashboard y roles) sobre **las tablas del Lab 02**, y añade tres piezas nuevas: el formulario **Quick View** de Categoría, una **subcuadrícula** de solicitudes dentro de la categoría y la prueba real del **Quick Create**.

- **Es una app nueva**, dentro de la solución `SIT Solicitudes Internas` del Lab 02. Si hiciste el Módulo 4, tu app `Gestión Solicitudes TI` (en la solución del Módulo 2) se queda como está.
- **Categoría es una tabla** (un Lookup), no una columna Choice como en el Módulo 4. Por eso aquí sí lleva página propia.
- **Los roles `SIT Solicitante` y `SIT Técnico TI` se llaman igual que en la Práctica 4.3 del Módulo 4.** Si ya los creaste allí, no crees otros: ábrelos y añade las tablas de este lab (Ejercicio 5).

## Lo que vas a construir

- **Navegación** de dos áreas: Operación (solicitudes) y Administración (catálogo y reportes)
- **Formulario Main** con 3 pestañas: General, Resolución y Timeline, más un **Quick View** que muestra el SLA de la categoría
- **Formulario Quick Create** para registrar rápido, y una **subcuadrícula** de solicitudes en la ficha de cada categoría desde la que lo pruebas
- **5 vistas** orientadas a roles: las 3 del Lab 02 (cola del equipo, mis solicitudes, críticas sin asignar) y 2 nuevas (mis asignaciones, pendientes de cierre)
- **2 gráficos** y un **dashboard** con esos gráficos y la lista de críticas sin asignar
- **2 Security Roles**: Solicitante (edita solo lo suyo) y Técnico TI (edita todo)

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Crear la app y su navegación | 20 min |
| Ejercicio 2 — Formularios, Quick View, Quick Create y subcuadrícula | 50 min |
| Ejercicio 3 — Vistas y gráficos | 25 min |
| Ejercicio 4 — Dashboard | 20 min |
| Ejercicio 5 — Security Roles y prueba | 35 min |
| **Total** | **150 min** |

> La primera vez que usas estos diseñadores, cuenta con el doble. Puedes partir el lab en dos sesiones: Ejercicios 1-3 y Ejercicios 4-5.

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power Apps Model-Driven App (diseñador moderno de apps)
- Dataverse (tablas, formularios, vistas, gráficos, dashboards)
- Security Roles (RBAC en Dataverse) y Power Platform Admin Center

## Prerrequisitos

### Entorno

- [ ] Solución `SIT Solicitudes Internas` del Lab 02, con la tabla `Solicitud TI` (`sit_solicitud`) y sus 10 registros
- [ ] Tabla `Categoría` (`sit_categoria`) con sus 5 registros
- [ ] Las 3 vistas del Lab 02: `Solicitudes Abiertas del Equipo`, `Mis Solicitudes Activas` y `Críticas Sin Asignar`
- [ ] Rol **System Administrator** en el ambiente (lo necesitas para crear roles de seguridad)
- [ ] *(Opcional)* BPF y columnas del Lab 09, si ya lo hiciste. El lab funciona sin ellos.

### Conocimiento previo

- Módulo 4 leído (páginas, formularios, vistas, dashboard y roles)

### Verificación rápida antes de empezar

1. En [make.powerapps.com](https://make.powerapps.com), el selector de ambiente (arriba a la derecha) muestra tu ambiente Developer.
2. Abre **Solutions** → `SIT Solicitudes Internas`. Debes ver las tablas `Solicitud TI` y `Categoría`.
3. Ten a mano el nombre interno que anotaste en el Lab 02 para la columna principal `Título de Solicitud`. En este lab casi no lo necesitas: los diseñadores muestran las columnas por su **nombre visible**, y así se nombran en todos los pasos.

> **Nombres de los botones:** los pasos usan la interfaz en inglés, igual que el Módulo 4 y el Lab 02. Si un botón cambió de nombre, busca el más parecido en la misma zona de la pantalla.

> **Si hiciste el Módulo 2 en este ambiente**, verás dos tablas "Solicitud TI": la de este lab y `Solicitud TI (M2)` (la renombraste al empezar el Lab 02). Elige siempre la que **no** lleva "(M2)".

---

## Datos de apoyo

### Navegación de la app

```
Área: Operación
  Grupo: Mi Trabajo
    Página: Solicitudes TI     (tabla Solicitud TI; el técnico cambia de vista con el selector de vistas)
Área: Administración
  Grupo: Catálogos
    Página: Categorías         (tabla Categoría)
  Grupo: Reportes
    Página: Dashboard SIT Soporte TI   (se añade en el Ejercicio 4)
```

> **Por qué una sola página de solicitudes:** una página de tabla abre la lista de esa tabla, y arriba de la lista está el **selector de vistas** (el nombre de la vista actual, con una flecha). "Mis Solicitudes", "Cola del Equipo" y "Críticas" no son páginas distintas: son vistas de la misma tabla que el técnico elige en ese selector.

### Pestañas del formulario Main de Solicitud TI

| Pestaña (Label / Name) | Secciones y columnas |
|---|---|
| General / (el que trae) | **Información Básica:** Título de Solicitud, Categoría, Prioridad, Estado, SLA Horas, y el Quick View "Resumen Categoría" · **Personas:** Solicitante, Asignado a, Descripción |
| Resolución / `tab_resolucion` | **Fechas:** Fecha Solicitud, Fecha Resolución · *(si hiciste el Lab 09)* **Detalle de Solución:** Descripción de Solución, Costo Estimado |
| Timeline / (el que se genere) | Control **Timeline** (notas y archivos de la solicitud) |

### Las 5 vistas de Solicitud TI

| Vista | Quién la usa | Filtro | Orden | Origen |
|---|---|---|---|---|
| Solicitudes Abiertas del Equipo | Supervisor | Estado ≠ Cerrada y Estado ≠ Resuelta | SLA Horas ↑, Fecha Solicitud ↑ | Lab 02 |
| Mis Solicitudes Activas | Empleado | Estado ≠ Cerrada y Owner = usuario actual | Fecha Solicitud ↓ | Lab 02 |
| Críticas Sin Asignar | Jefe de soporte | Prioridad = Crítica, Estado = Nueva y Asignado a vacío | Fecha Solicitud ↑ | Lab 02 |
| Mis Asignaciones | Técnico | Asignado a = usuario actual, Estado ≠ Cerrada y Estado ≠ Resuelta | SLA Horas ↑, Fecha Solicitud ↑ | Este lab |
| Solicitudes Pendientes de Cierre | Supervisor | Estado = Resuelta | Fecha Resolución ↑ | Este lab |

---

## Ejercicio 1 — Crear la app y su navegación

> **Qué vas a hacer:** Crear la app dentro de la solución del Lab 02 y organizar su menú en dos áreas.
> **Duración:** 20 min

### Tarea 1.1 — Crear la Model-Driven App

1. En [make.powerapps.com](https://make.powerapps.com) → **Solutions** (si no lo ves, está en **…More**) → abre `SIT Solicitudes Internas`.

2. En la barra de comandos selecciona **New** → **App** → **Model-driven app**. Si te ofrece elegir entre el diseñador moderno y el clásico, elige el **moderno** ([Learn: crear una model-driven app](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-app)).

3. Completa:

   | Campo | Valor |
   |---|---|
   | Name | `SIT Gestión Solicitudes` |
   | Description | `App de escritorio para el equipo de soporte TI` |

4. Selecciona **Create**.

   **Qué deberías ver:** se abre el diseñador de apps. A la izquierda está el panel **Pages**, con la sección **Navigation** casi vacía; en el centro, una vista previa de la app. **Si no se abre**, revisa que estés dentro de la solución (no en **Apps** del menú principal) y que tu rol sea System Customizer o System Administrator.

### Tarea 1.2 — Añadir la página de solicitudes

1. En la barra de comandos del diseñador selecciona **Add page** → **Dataverse table** ([Learn: navegación de la app](https://learn.microsoft.com/power-apps/maker/model-driven-apps/app-navigation)).

2. Marca **Solicitud TI** (la que no lleva "(M2)") → **Add**.

3. Selecciona **Save**.

   **Qué deberías ver:** en **Navigation** aparece una página de Solicitud TI dentro de un grupo y un área que el diseñador creó solo; la vista previa muestra la lista de tus 10 solicitudes. **Si la lista sale vacía**, la página apunta a la otra tabla "Solicitud TI": quítala (**...** junto a la página → **Remove from navigation**) y añade la correcta.

### Tarea 1.3 — Organizar las áreas y los grupos

1. **Activa las áreas** (vienen apagadas): en la barra de comandos, **Settings** → panel izquierdo de la ventana, **Navigation** → activa **Enable Areas** → cierra la ventana **Settings**.

2. En el panel izquierdo selecciona **Pages**. Debajo de **Pages** aparece el **selector de área** (un menú desplegable con el nombre del área actual). Selecciona el área que ya existe y, en el panel de propiedades de la derecha, cambia su **Title** por `Operación`.

3. Selecciona el grupo donde quedó la página de Solicitud TI y cambia su **Title** por `Mi Trabajo`.

4. Crea la segunda área: abre el selector de área → **New area** → **Title** `Administración`.

5. Con `Administración` elegida en el selector, crea sus dos grupos: **...** junto a **Navigation** → **New group** → **Title** `Catálogos`. Repite para `Reportes`. Cada grupo nuevo se crea dentro del área que tienes elegida en el selector.

6. Selecciona el grupo `Catálogos` y, en la barra de comandos, **Add page** → **Dataverse table** → marca **Categoría** → **Add**. Si la página queda en otro grupo, arrástrala a `Catálogos`; si quedó en otra área, quítala con **Remove from navigation**, vuelve a seleccionar `Catálogos` y añádela otra vez.

7. **Save** → **Publish**.

   **Qué deberías ver:** el selector de área tiene `Operación` y `Administración`; `Operación` muestra el grupo `Mi Trabajo` con la página de solicitudes, y `Administración` muestra `Catálogos` (con Categorías) y `Reportes` (vacío hasta el Ejercicio 4).

### Tarea 1.4 — Comprobar la app y sus vistas

1. Selecciona **Play** (está disponible después de publicar). La app se abre en otra pestaña.

2. En la página de solicitudes, haz clic en el **selector de vistas** (el nombre de la vista, arriba de la lista) y comprueba que aparecen las 3 vistas del Lab 02.

   > La app incluye por defecto todas las vistas de la tabla. Si falta alguna, vuelve al diseñador → panel **Pages** → sección **All other pages** → tabla Solicitud TI, y añade la vista desde ahí ([Learn: diseñador de apps](https://learn.microsoft.com/power-apps/maker/model-driven-apps/app-designer-overview)). Luego **Save** → **Publish**.

3. Elige `Solicitudes Abiertas del Equipo` y cuenta las filas: debe coincidir con el número que anotaste en la Tarea 5.3 del Lab 02.

4. Cambia de área con el selector de área (abajo a la izquierda en la app) y abre **Categorías**: deben salir los 5 registros.

### Validación del Ejercicio 1

- [ ] La app `SIT Gestión Solicitudes` aparece entre los objetos de la solución `SIT Solicitudes Internas`
- [ ] La navegación tiene las áreas `Operación` y `Administración` con sus grupos
- [ ] En **Play**, el selector de vistas muestra las 3 vistas del Lab 02 y la vista del equipo cuenta las filas esperadas

---

## Ejercicio 2 — Formularios, Quick View, Quick Create y subcuadrícula

> **Qué vas a hacer:** Organizar el formulario Main en 3 pestañas, mostrar el SLA de la categoría dentro de la solicitud con un Quick View, crear el Quick Create y probarlo desde una subcuadrícula de la categoría.
> **Duración:** 50 min

**Cómo se usa el diseñador de formularios (léelo una vez; es el mismo del Módulo 4)** ([Learn: pestañas del formulario](https://learn.microsoft.com/power-apps/maker/model-driven-apps/add-move-or-delete-tabs-on-form), [Learn: secciones](https://learn.microsoft.com/power-apps/maker/model-driven-apps/add-move-or-delete-sections-on-form)):
- **Cambiar el nombre de una pestaña o sección:** selecciónala y cambia su **Label** en el panel de propiedades de la derecha.
- **Agregar una pestaña:** panel izquierdo **Components** → **Layout** → **1-column tab**. Una pestaña nueva ya trae una sección vacía.
- **Agregar una sección:** selecciona una sección que ya exista (la nueva se crea justo después) → **Components** → **Layout** → **1-column section**.
- **Agregar una columna:** panel izquierdo **Table columns** → arrástrala a la sección.
- **Quitar algo:** selecciónalo y elige **Delete** en la barra de comandos. Si te equivocas, **Undo**.

### Tarea 2.1 — Abrir el formulario Main

1. En la solución → **Tables** → **Solicitud TI** → zona **Forms** → abre el formulario **Information** (columna **Type** = **Main**).

   **Qué deberías ver:** el diseñador de formularios con una pestaña (normalmente **General**) y una sección con algunas columnas, entre ellas **Título de Solicitud**. **No borres Título de Solicitud**: es la columna principal.

### Tarea 2.2 — Pestaña General

1. Selecciona la sección que ya existe y cambia su **Label** por `Información Básica`.

2. Deja en ella, en este orden: **Título de Solicitud**, **Categoría**, **Prioridad**, **Estado** y **SLA Horas** (arrastra desde **Table columns** las que falten). Si la sección trae otras columnas (por ejemplo **Owner**), puedes dejarlas o moverlas a la sección siguiente.

3. Agrega una sección nueva después de `Información Básica`, con **Label** `Personas`, y pon en ella **Solicitante**, **Asignado a** y **Descripción**.

### Tarea 2.3 — Pestaña Resolución (con nombre fijo)

1. Agrega una **1-column tab**. En sus propiedades:
   - **Label:** `Resolución`
   - **Name:** borra el que trae y escribe `tab_resolucion`. Solo admite letras, números y guiones bajos. El Módulo 13 oculta esta pestaña con JavaScript y la busca por ese nombre exacto.

2. Selecciona la sección que trae la pestaña, cambia su **Label** por `Fechas` y pon en ella **Fecha Solicitud** y **Fecha Resolución**.

3. *(Solo si hiciste el Lab 09)* Agrega una sección `Detalle de Solución` con **Descripción de Solución** y **Costo Estimado**. Si no hiciste el Lab 09, esas columnas todavía no existen: sáltate este punto.

   > **Una Business Rule no puede ocultar una pestaña ni una sección, solo columnas.** Si quieres que las fechas de resolución no se vean mientras la solicitud está Nueva o En Proceso, usa una Business Rule con Scope **All Forms** y **Set Visibility** sobre esas columnas, como en el Paso 3.3 del Módulo 4. Ocultar la pestaña `tab_resolucion` completa exige JavaScript (Módulo 13).

### Tarea 2.4 — Pestaña Timeline

1. Agrega otra **1-column tab** con **Label** `Timeline`.

2. Selecciona su sección → **Components** → baja en la lista hasta **Timeline** → arrástralo a la sección ([Learn: control Timeline](https://learn.microsoft.com/power-apps/maker/model-driven-apps/set-up-timeline-control)).

   > El Timeline muestra las notas y los archivos de la solicitud. Funciona porque en el Lab 02 marcaste **Enable Attachments** en la tabla.

3. Selecciona **Save and publish** (arriba a la derecha).

   **Qué deberías ver:** tres pestañas en la parte superior del formulario: General, Resolución y Timeline. **Si Save and publish da error**, lee el mensaje: lo habitual es una pestaña sin **Label** o un **Name** con espacios o tildes.

### Tarea 2.5 — Quick View "Resumen Categoría"

Un Quick View muestra, dentro del formulario de la solicitud, datos de solo lectura del registro relacionado. Aquí, el **SLA Horas de referencia de la categoría**, para que el técnico no tenga que abrir la categoría en otra pantalla ([Learn: formularios Quick View](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-quick-view-forms)).

1. En la solución → **Tables** → **Categoría** → **Forms** → **New form** → **Quick view form**.

2. **Form name:** `Resumen Categoría`. Si ves la casilla **Get AI-generated column suggestions**, desmárcala (vas a elegir tú las columnas). Selecciona **Create**.

3. Desde **Table columns** arrastra **Nombre**, **Descripción** y **SLA Horas** → **Save and publish**.

4. Vuelve al formulario **Information** de **Solicitud TI** y selecciona la sección `Información Básica`.

5. Panel **Components** → **Quick view**. En el diálogo **Select quick view forms**: **Lookup** = **Categoría**, y en la lista de formularios elige `Resumen Categoría` → **Done**.

   > El diálogo solo ofrece columnas Lookup que ya están en el formulario. Si no aparece **Categoría**, arrástrala antes a la sección.

6. **Save and publish**.

   **Qué deberías ver:** debajo de Categoría, un bloque de solo lectura con Nombre, Descripción y SLA Horas de la categoría. **Si el bloque no aparece al abrir una solicitud**, es que esa solicitud no tiene Categoría: el Quick View se oculta cuando el Lookup está vacío.

### Tarea 2.6 — Formulario Quick Create

El Quick Create es un formulario corto que se abre en un panel lateral. Learn indica que aparece al usar el botón **Create** de la barra de navegación o **+ New** al crear un registro desde un Lookup o una **subcuadrícula** ([Learn: formularios Quick Create](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-quick-create-forms)). El botón **+ New** de la lista de una vista abre el formulario Main, no el Quick Create.

1. Activa la opción en la tabla: **Tables** → **Solicitud TI** → **Properties** (barra de comandos) → despliega **Advanced options** → marca **Enable quick create forms** → **Save**.

2. **Forms** → **New form** → **Quick create form** → **Form name** `Registro Rápido` → **Create**.

3. Desde **Table columns** arrastra solo cuatro columnas: **Título de Solicitud**, **Categoría**, **Prioridad** y **Descripción** → **Save and publish**.

   > Un Quick Create tiene una única sección y no admite subcuadrículas ni Quick Views.

### Tarea 2.7 — Subcuadrícula de solicitudes en la ficha de la categoría

Con esto el técnico ve, en cada categoría, sus solicitudes abiertas. Y te da un sitio seguro para probar el Quick Create ([Learn: subcuadrículas](https://learn.microsoft.com/power-apps/maker/model-driven-apps/form-designer-add-configure-subgrid)).

1. **Tables** → **Categoría** → **Forms** → abre el formulario **Information** (Main).

2. Agrega una **1-column section** debajo de la que ya existe y cambia su **Label** por `Solicitudes de esta categoría`.

3. Con esa sección seleccionada, panel **Components** → **Subgrid**. En el panel **Select subgrid views**:
   - Marca **Show related records** (solo verás tablas relacionadas con Categoría).
   - **Table:** **Solicitudes TI (Categoría)** (entre paréntesis va el Lookup que las une).
   - **Default view:** `Solicitudes Abiertas del Equipo`.
   - Selecciona **Done**.

4. **Save** → **Publish**.

### Tarea 2.8 — Probar los tres formularios en la app

1. Vuelve a la pestaña de la app (o ábrela con **Play**) y recarga la página del navegador para ver los formularios publicados.

2. **Quick View:** en **Operación** → solicitudes, abre `VPN caída para equipo remoto`. En la pestaña General debe verse el bloque de la categoría Red y Conectividad con **SLA Horas = 8** (el de la categoría). Más arriba, el SLA Horas de la propia solicitud vale 4 (lo puso la Regla 1 del Lab 02 por ser Crítica).

3. **Quick Create:** cambia al área **Administración** → **Categorías** → abre **Hardware**. En la subcuadrícula `Solicitudes de esta categoría` selecciona el botón **+ New** de la subcuadrícula.

   **Qué deberías ver:** se abre a la derecha un panel corto con solo 4 columnas (el Quick Create), no el formulario completo. Fíjate si Categoría ya viene rellena con Hardware. Escribe `Teclado no responde`, Prioridad **Baja**, y guarda con el botón del panel. La nueva solicitud aparece en la subcuadrícula.

   **Si se abre el formulario completo**, falta algo de la Tarea 2.6: la opción **Enable quick create forms** sin guardar o el formulario sin publicar.

4. **Pestañas:** abre cualquier solicitud y recorre General, Resolución y Timeline. En Timeline, añade una nota de prueba: debe quedar registrada en la línea de tiempo.

### Validación del Ejercicio 2

- [ ] El formulario Main tiene 3 pestañas (General, Resolución y Timeline) y la pestaña Resolución se llama `tab_resolucion`
- [ ] El Quick View de Categoría muestra el SLA de referencia al abrir una solicitud con categoría
- [ ] El Quick Create con 4 columnas se abre desde la subcuadrícula de una categoría
- [ ] La subcuadrícula de Hardware muestra sus solicitudes abiertas

---

## Ejercicio 3 — Vistas y gráficos

> **Qué vas a hacer:** Crear las 2 vistas nuevas y 2 gráficos que usará el dashboard.
> **Duración:** 25 min

**Las vistas se crean como en el Lab 02:** **Tables** → **Solicitud TI** → zona **Views** → **New view** → nombre → **Create**. Columnas con **+ View column**; filtros en el panel de propiedades con **Edit filters** → **Add** → **Add row** → **OK** (las filas se unen con **And**); orden seleccionando el encabezado de una columna → **Sort ascending** / **Sort descending** (con **Shift** pulsado añades un segundo criterio). Termina con **Save and publish**.

> **No ordenes por Prioridad:** en las vistas, una columna Choice se ordena por el texto de la opción (Alta, Baja, Crítica, Media), no por el orden en que la creaste. **SLA Horas** ya refleja la prioridad gracias a la Regla 1 del Lab 02, así que se ordena por SLA Horas de menor a mayor ([Learn: ordenar columnas Choice en FetchXML](https://learn.microsoft.com/power-apps/developer/data-platform/fetchxml/order-rows#choice-columns)).

### Tarea 3.1 — Vista "Mis Asignaciones" (técnico)

1. Nombre: `Mis Asignaciones`.
2. Columnas: `Título de Solicitud` | `Categoría` | `Prioridad` | `SLA Horas` | `Estado` | `Fecha Solicitud`.
3. Filtros: **Asignado a** **Equals current user**, **Estado** **Does not equal** **Cerrada** y **Estado** **Does not equal** **Resuelta**.
4. Orden: **SLA Horas** ascendente y luego **Fecha Solicitud** ascendente.
5. **Save and publish**.

   > *(Si hiciste el Lab 09)* añade también la columna **Días Abierta**.

### Tarea 3.2 — Vista "Solicitudes Pendientes de Cierre" (supervisor)

1. Nombre: `Solicitudes Pendientes de Cierre`.
2. Columnas: `Título de Solicitud` | `Asignado a` | `Estado` | `Fecha Resolución` (y `Costo Estimado`, si hiciste el Lab 09).
3. Filtro: **Estado** **Equals** **Resuelta** (resueltas, pero todavía no cerradas).
4. Orden: **Fecha Resolución** ascendente (la que lleva más tiempo resuelta, primero).
5. **Save and publish**.

### Tarea 3.3 — Datos para que las vistas muestren algo

1. En la app, abre 2 solicitudes que no estén Resueltas ni Cerradas y pon en **Asignado a** tu propio usuario. Guarda.
2. Abre la solicitud que resolviste en el Lab 02 (`Error al abrir Excel con macros`) y comprueba que tiene Estado **Resuelta** y Fecha Resolución.

   **Qué deberías ver:** recarga la app; en el selector de vistas, `Mis Asignaciones` muestra tus 2 solicitudes y `Solicitudes Pendientes de Cierre` muestra 1.

### Tarea 3.4 — Dos gráficos

En la solución → **Tables** → **Solicitud TI** → zona **Data experiences** → **Charts** → **New chart**. Se abre el diseñador de gráficos ([Learn: crear un gráfico del sistema](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-system-chart)).

1. **Gráfico de solicitudes por categoría:** en **Column** elige **Título de Solicitud**; en **Aggregate**, **Count: All** (contar todas las filas); en **Chart type**, **Column** → **Next**. Como categoría (eje horizontal) elige **Categoría** → **Apply** → **Save** → **Publish**.

2. **Gráfico de distribución por estado:** igual, pero **Chart type** **Doughnut** y categoría **Estado**.

3. **El nombre:** el diseñador nombra cada gráfico automáticamente a partir de las columnas elegidas. Anota los dos nombres: en el Ejercicio 4 los buscarás en una lista. Si ves un campo de nombre, cámbialos por `Solicitudes por Categoría` y `Distribución por Estado`.

   > **Un gráfico no lleva vista propia.** Learn indica que la vista con la que lo previsualizas no queda asociada al gráfico: la vista se elige donde se muestra, por ejemplo en el componente del dashboard. Por eso el filtro "solo abiertas" se pone en el Ejercicio 4, no aquí.

4. Comprueba en la app: abre la lista de solicitudes y selecciona **Show Chart** en la barra de comandos; en el selector del gráfico deben salir los dos nuevos. Si no salen, la app no muestra **All** los gráficos: en el diseñador de la app, en **All other pages**, añade los gráficos a la tabla Solicitud TI → **Save** → **Publish**.

### Validación del Ejercicio 3

- [ ] `Mis Asignaciones` muestra solo las solicitudes asignadas a ti y abiertas, ordenadas por SLA Horas
- [ ] `Solicitudes Pendientes de Cierre` muestra solo solicitudes en estado Resuelta
- [ ] Los 2 gráficos se ven en la lista de solicitudes de la app

---

## Ejercicio 4 — Dashboard

> **Qué vas a hacer:** Crear un dashboard de 3 componentes para el gerente de soporte TI y añadirlo al área Administración.
> **Duración:** 20 min

### Tarea 4.1 — Crear el dashboard

1. En la solución: **New** → **Dashboard** → diseño **2-column overview**. Se abre el editor **Dashboard: New** ([Learn: dashboards](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-dashboards)).

2. **Name:** `Dashboard SIT Soporte TI`.

3. Configura los componentes. En cada recuadro haz clic en el icono de gráfico o de lista y completa el diálogo **Add Component** → **Add**:

   | Recuadro | Icono | Record Type | View | Chart |
   |---|---|---|---|---|
   | Primero | Gráfico | Solicitud TI | Solicitudes Abiertas del Equipo | El de distribución por estado |
   | Segundo | Gráfico | Solicitud TI | Solicitudes Abiertas del Equipo | El de solicitudes por categoría |
   | Tercero | Lista | Solicitud TI | Críticas Sin Asignar | — |

   > Si un recuadro queda vacío, no pasa nada. Un dashboard admite hasta 6 componentes. La lista no muestra datos en el editor: los verás en la app.

4. **Save** → **Close** → en la barra de la solución, **Publish**.

   **Si una de tus vistas no sale en la lista View del diálogo**, guarda y publica la vista otra vez desde **Views**, y vuelve a abrir el diálogo.

### Tarea 4.2 — Añadir el dashboard a la app

1. Abre el diseñador de la app (en la solución, selecciona la app → **Edit**).

2. Panel **Pages** → en el selector de área elige `Administración` → selecciona el grupo `Reportes`.

3. **Add page** → **Dashboard** → marca `Dashboard SIT Soporte TI` → **Add**. Si la página queda en otro grupo, arrástrala a `Reportes`.

4. **Save** → **Publish** → **Play**.

   **Qué deberías ver:** en **Administración** → **Reportes**, el dashboard con los dos gráficos (con datos de las solicitudes abiertas) y la lista con las 2 solicitudes Críticas en estado Nueva y sin asignar del Lab 02 (`VPN caída para equipo remoto` y `Licencia de Adobe vencida`), salvo que les hayas puesto técnico en la Tarea 3.3.

### Validación del Ejercicio 4

- [ ] El dashboard tiene 3 componentes: 2 gráficos y la lista de críticas sin asignar
- [ ] Los gráficos muestran datos de las solicitudes de prueba
- [ ] El dashboard aparece en **Administración** → **Reportes**

---

## Ejercicio 5 — Security Roles y prueba de permisos

> **Qué vas a hacer:** Crear dos roles con permisos distintos, asignarlos, compartir la app y comprobar qué puede hacer cada perfil.
> **Duración:** 35 min

**Niveles de acceso** (para cada permiso eliges hasta dónde llega) ([Learn: roles y privilegios](https://learn.microsoft.com/power-platform/admin/security-roles-privileges)): **None** (nada), **User** (solo los registros propios o compartidos contigo), **Business Unit** (los de tu unidad de negocio), **Parent: Child Business Unit** (tu unidad y las que dependen de ella) y **Organization** (todo el ambiente). Además de Create, Read, Write y Delete están **Append** (vincular este registro con otro, por ejemplo elegir una Categoría en la solicitud) y **Append To** (que otros registros se vinculen a este: lo necesita Categoría para poder ser elegida).

**Cómo se crea o edita un rol** ([Learn: crear un rol](https://learn.microsoft.com/power-platform/admin/create-edit-security-role)): [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Security roles**.
- **Crear:** **+ New role** → escribe el nombre, deja la unidad de negocio que viene y **deja activada** **Include App Opener privileges for running Model-Driven apps** (sin esos permisos mínimos, el rol no puede abrir la app) → **Save**.
- **Dar permisos:** en la lista de tablas del rol, escribe el nombre de la tabla en **Search**, selecciónala y elige el nivel de cada permiso → **Save**.
- **Si el rol ya existe** (lo creaste en la Práctica 4.3 del Módulo 4), ábrelo desde la lista y añade solo las tablas de este lab.

### Tarea 5.1 — Rol "SIT Solicitante"

1. Crea (o abre) el rol `SIT Solicitante`.

2. Permisos:

   | Tabla | Create | Read | Write | Delete | Append | Append To |
   |---|---|---|---|---|---|---|
   | Solicitud TI | User | Business Unit | User | None | User | None |
   | Categoría | None | Organization | None | None | None | Organization |
   | Contact | None | Organization | None | None | None | Organization |

   > **Read "Business Unit" con Write "User"** significa que el solicitante ve las solicitudes de su unidad de negocio pero solo puede editar las suyas. En un ambiente Developer todos los usuarios suelen estar en la misma unidad (la raíz), así que verá todas las solicitudes y podrá editar solo las que creó.

3. **Save**.

### Tarea 5.2 — Rol "SIT Técnico TI"

1. Crea (o abre) el rol `SIT Técnico TI`.

2. Permisos:

   | Tabla | Create | Read | Write | Delete | Append | Append To |
   |---|---|---|---|---|---|---|
   | Solicitud TI | Organization | Organization | Organization | Business Unit | Organization | Organization |
   | Categoría | Organization | Organization | Organization | Organization | Organization | Organization |
   | Contact | None | Organization | None | None | None | Organization |
   | User | None | Organization | None | None | None | Organization |

   > Append To sobre **User** es lo que permite elegir a un técnico en **Asignado a**.

3. **Save**.

   > **📌 Pendiente para más adelante:** cuando completes el Módulo 23 (Plugins C# para Dataverse) vas a
   > crear la tabla `sit_auditoriasolicitud`. En ese momento, vuelve a este rol y agrega esa tabla con
   > permiso Read = Organization (sin Create/Write/Delete, porque esa tabla la escribe el plugin,
   > no el usuario). No la agregues ahora — la tabla todavía no existe.

### Tarea 5.3 — Asignar los roles y compartir la app

1. **Asignar un rol a una persona:** Power Platform Admin Center → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Users** → elige a la persona → **Manage security roles** → marca el rol → **Save**.

2. **Compartir la app:** en [make.powerapps.com](https://make.powerapps.com) → **Apps** → **...** junto a `SIT Gestión Solicitudes` → **Share** → elige a la persona o el rol → **Share** ([Learn: compartir una model-driven app](https://learn.microsoft.com/power-apps/maker/model-driven-apps/share-model-driven-app)).

   > **Para probar de verdad necesitas otra persona usuaria** en tu ambiente, con su licencia; normalmente se la pides al administrador de tu tenant. **No te quites a ti el rol System Administrator** para probar: podrías perder el acceso a tu ambiente. Mientras lo tengas verás y podrás hacer todo, aunque te asignes además un rol más limitado, porque los permisos de varios roles se suman.
   >
   > **Si no tienes otra persona usuaria:** guarda como evidencia las capturas de los permisos de cada rol y escribe qué esperarías ver en cada prueba de la Tarea 5.4.

### Tarea 5.4 — Probar los permisos (con otra persona usuaria)

**Con el rol `SIT Técnico TI`** (entrando con la cuenta de prueba, en una ventana privada del navegador):

1. Abre la app → `Solicitudes Abiertas del Equipo` muestra todas las solicitudes abiertas.
2. Abre una de las solicitudes del Lab 02 (creadas con tu cuenta de administrador): puede editarla y elegir un técnico en **Asignado a**.
3. El dashboard muestra los gráficos con datos.

**Con el rol `SIT Solicitante`** (cambia el rol de la cuenta de prueba y recarga la app):

1. Crea una solicitud con el Quick Create (desde la subcuadrícula de una categoría): se guarda.
2. Abre esa solicitud: puede editarla.
3. Abre una de las 10 solicitudes del Lab 02 (su Owner es tu cuenta de administrador, no la de prueba): la ve, pero no puede guardar cambios (el formulario aparece en solo lectura o avisa de que no tiene permiso).

**Qué deberías ver:** la diferencia entre los dos perfiles está en **qué puede editar**, no en qué ve: ambos ven las solicitudes de la unidad de negocio.

### Validación del Ejercicio 5

- [ ] Rol `SIT Solicitante` con Read Business Unit y Write User sobre Solicitud TI
- [ ] Rol `SIT Técnico TI` con permisos Organization sobre Solicitud TI y Categoría
- [ ] La app está compartida y cada persona de prueba tiene su rol
- [ ] Con rol Técnico: todas las solicitudes son editables; con rol Solicitante: solo las propias (o, sin segunda persona usuaria, las capturas de permisos y lo que esperarías ver)

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| La lista de la página de solicitudes sale vacía | La página apunta a la tabla `Solicitud TI (M2)` | Quítala con **Remove from navigation** y añade la tabla del Lab 02 |
| El BPF del Lab 09 no aparece en el formulario | El BPF no está activo o tu rol no tiene acceso | En el diseñador del BPF: **Activate** y luego **Edit Security Roles** |
| Una vista o un cambio de formulario no aparece en la app | No se publicó | **Save and publish** en el diseñador o **Publish all customizations** en la solución; recarga la app |
| Al hacer clic en **+ New** se abre el formulario completo | Se usó el **+ New** de la lista de una vista, o falta la opción de tabla | Usa el **+ New** de la subcuadrícula o el botón **Create**; activa **Enable quick create forms** y publica el Quick Create |
| El Quick View no se ve | La solicitud no tiene Categoría, o el Quick View no está publicado | Elige una Categoría; **Save and publish** el formulario Main |
| El gráfico del dashboard aparece vacío | La vista elegida en el componente excluye todos los registros | Abre esa vista en la app y cuenta sus filas; cambia la vista del componente |
| Otra persona no puede abrir la app | Le falta un rol o la app no está compartida con ella | Asigna el rol en el Admin Center y comparte la app con **Share** |
| El Timeline no muestra nada | La solicitud no tiene notas ni archivos | Añade una nota desde la pestaña Timeline |

---

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### El BPF no aparece en el formulario

- **Causa probable:** el Business Process Flow del Lab 09 (si lo hiciste) sigue en borrador, o tu rol de seguridad no tiene acceso a él. Por defecto solo **System Administrator** y **System Customizer** ven un BPF nuevo.
- **Cómo comprobar:** en la solución, abre el proceso BPF del Lab 09. En el diseñador mira si está activado o en borrador, y en **Edit Security Roles** qué roles tienen acceso.
- **Cómo corregir:** si está en borrador, **Activate**. Si ya está activo, en **Edit Security Roles** da acceso a los roles que usan la app (por ejemplo, `SIT Técnico TI`) y guarda.
- **Reiniciar vs. reparar:** nunca elimines el BPF por este motivo: basta con activarlo o darle el rol correcto. Recrear el proceso solo tiene sentido si sus etapas están mal configuradas.
- **Evidencia posterior a la corrección:** al abrir una solicitud en la app, la barra del BPF aparece arriba del formulario con sus etapas.

### Las vistas personalizadas no aparecen en la app

- **Causa probable:** la vista se guardó pero no se publicó, o la app se configuró con una lista de vistas concreta y la nueva no está en ella.
- **Cómo comprobar:** en **Tables** → **Solicitud TI** → **Views**, confirma que la vista existe. En el diseñador de la app, mira en **All other pages** qué vistas tiene la tabla.
- **Cómo corregir:** abre la vista y usa **Save and publish**. Si la app tiene una lista de vistas, añade la nueva desde **All other pages** → **Save** → **Publish**. Recarga la app.
- **Reiniciar vs. reparar:** solo republicar; no hace falta recrear la vista.
- **Evidencia posterior a la corrección:** en **Play**, el selector de vistas muestra la vista con sus columnas y su filtro.

### El Quick Create no se abre

- **Causa probable:** usaste el **+ New** de la lista de una vista (abre el formulario Main), la tabla no tiene activada **Enable quick create forms**, o el Quick Create no se publicó.
- **Cómo comprobar:** en **Tables** → **Solicitud TI** → **Properties** → **Advanced options**, mira la casilla **Enable quick create forms**. En **Forms**, comprueba que existe un formulario de tipo **Quick create**.
- **Cómo corregir:** marca la casilla → **Save**; abre el Quick Create → **Save and publish**. Prueba desde la subcuadrícula de una categoría (Tarea 2.8).
- **Reiniciar vs. reparar:** repara (opción de tabla y publicar). Recrear el formulario solo si tiene columnas rotas.
- **Evidencia posterior a la corrección:** el **+ New** de la subcuadrícula abre un panel lateral con las 4 columnas.

### El gráfico aparece vacío

- **Causa probable:** la vista elegida en el componente del dashboard excluye todos los registros de prueba (por ejemplo, filtra por "usuario actual" y ninguna solicitud es tuya), o el gráfico agrupa por una columna sin datos.
- **Cómo comprobar:** abre en la app esa misma vista y cuenta sus filas. Si cuenta 0, el problema está en la vista, no en el gráfico.
- **Cómo corregir:** en el editor del dashboard, selecciona el componente → **Edit Component** → elige otra vista (por ejemplo, `Solicitudes Abiertas del Equipo`) → **OK** → **Save** → **Close** → **Publish**.
- **Reiniciar vs. reparar:** repara la vista del componente; el gráfico no hace falta recrearlo.
- **Evidencia posterior a la corrección:** el gráfico muestra barras o segmentos con las solicitudes abiertas.

### Otra persona no puede abrir la app

- **Causa probable:** el rol (`SIT Solicitante` o `SIT Técnico TI`) existe pero no está asignado a esa persona, se creó sin **Include App Opener privileges for running Model-Driven apps**, o la app no está compartida con ella.
- **Cómo comprobar:** Admin Center → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Users** → la persona → **Manage security roles**: ¿tiene el rol marcado? En make.powerapps.com → **Apps** → **...** → **Share**: ¿aparece la persona?
- **Cómo corregir:** marca el rol y guarda; comparte la app. Si el rol se creó sin App Opener, el camino más simple es crear otro con esa opción activada y volver a dar los permisos de tablas.
- **Reiniciar vs. reparar:** casi siempre es un problema de asignación: no recrees la app.
- **Evidencia posterior a la corrección:** la persona abre la app y lo que puede editar coincide con su rol.

---

## Checklist final

- [ ] App `SIT Gestión Solicitudes` publicada dentro de la solución `SIT Solicitudes Internas`
- [ ] Navegación con las áreas Operación (Mi Trabajo) y Administración (Catálogos y Reportes)
- [ ] Formulario Main con 3 pestañas (General, Resolución con Name `tab_resolucion`, Timeline)
- [ ] Quick View de Categoría que muestra el SLA de referencia
- [ ] Quick Create con 4 columnas, probado desde la subcuadrícula de una categoría
- [ ] Vistas `Mis Asignaciones` y `Solicitudes Pendientes de Cierre` creadas y comprobadas
- [ ] 2 gráficos y dashboard publicado con 3 componentes
- [ ] Roles `SIT Solicitante` y `SIT Técnico TI` con los permisos indicados
- [ ] Prueba con ambos roles (o capturas de permisos si no tienes otra persona usuaria)

## Evidencia esperada

- Captura de la app en **Play** con el área Administración abierta (grupos Catálogos y Reportes) y el selector de vistas de solicitudes desplegado
- Captura del formulario de `VPN caída para equipo remoto` con sus 3 pestañas y el Quick View de la categoría mostrando SLA Horas = 8
- Captura del panel Quick Create abierto desde la subcuadrícula de Hardware
- Captura del dashboard con los 2 gráficos y la lista de críticas sin asignar
- Captura de los permisos de cada rol sobre Solicitud TI y, si tuviste otra persona usuaria, de la prueba con cada rol

## Criterios de aprobación

- La navegación organiza las áreas Operación y Administración como en "Datos de apoyo"
- La vista `Solicitudes Pendientes de Cierre` filtra únicamente solicitudes en estado Resuelta
- El Quick Create se abre desde la subcuadrícula y el Quick View muestra el SLA de la categoría
- Un usuario con rol `SIT Solicitante` no puede editar lo que solo permite `SIT Técnico TI` (comprobado o justificado con los permisos del rol)
- 100% de los ítems del Checklist final marcados

---

## Reto adicional

**Reto básico:** Agrega al dashboard un cuarto componente con el **promedio de días abiertas** de las solicitudes abiertas. Necesitas una columna numérica (la columna calculada **Días Abierta** del Lab 09 o del reto intermedio del Lab 02) y un gráfico con **Aggregate** = **Average** sobre ella.

**Reto intermedio:** Crea un formulario **Quick View** de la tabla **User** (nombre completo y correo) y muéstralo en la pestaña General vinculado al Lookup **Asignado a**, para que el supervisor vea a quién está asignada la solicitud sin salir de ella. *Para pensar:* ¿por qué un Quick View no puede mostrar "cuántas solicitudes tiene ese técnico"? (Pista: muestra columnas del registro relacionado; un conteo necesitaría una columna Rollup en User, la técnica del Lab 09.)

**Reto avanzado:** Combina el **Field Security Profile** del Lab 09 (que protege **Costo Estimado**) con la pestaña `tab_resolucion`: con JavaScript de formulario (Módulo 13), oculta la pestaña completa mientras la solicitud no esté Resuelta o Cerrada. Comprueba con un usuario sin el perfil de seguridad de campo que, aunque la pestaña se vea, el valor de Costo Estimado sigue protegido. Una Business Rule no sirve para este reto: no puede ocultar pestañas ni saber si el usuario tiene un perfil de seguridad de campo.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre un formulario **Main**, **Quick Create** y **Quick View**, y desde dónde se abre un Quick Create?
2. ¿En qué escenario usarías una **Model-Driven App** en lugar de una **Canvas App**?
3. ¿Qué significa el nivel de acceso **Business Unit** en un Security Role, y por qué en este lab el Solicitante ve todas las solicitudes pero solo edita las suyas?
4. ¿Por qué se recomienda crear la app dentro de una **Solución** en lugar de desde la lista de apps?

---

## Limpieza del laboratorio

> Conserva la app — el Lab 19 (CI/CD) empaqueta la solución `SIT_SolicitudesInternas` completa incluyendo esta app. Si diste roles a una cuenta de prueba solo para este lab, puedes quitárselos desde **Manage security roles**.

---

## Siguiente laboratorio recomendado

➡️ **Lab 05 — Power Automate: Notificación y Aprobación de Solicitudes**

**Por qué ir ahí:** los tres flujos del Lab 05 reaccionan a solicitudes que crearás y editarás desde esta app.

Después de terminar el Nivel Básico:

➡️ **Lab 09 — Dataverse Avanzado: BPF y Field Security**, que añade a esta app el BPF y las columnas de resolución.

➡️ **Lab 19 — ALM y CI/CD: Pipeline de Azure DevOps para Power Platform**: la solución `SIT_SolicitudesInternas` que has construido en Labs 02, 03, 04 y 05 está lista para automatizar su ciclo de despliegue con Azure DevOps — de DEV a TEST a PROD, con Solution Checker y aprobaciones.
