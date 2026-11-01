---
moduleId: 4
title: "Power Apps Model-Driven - Apps Basadas en Datos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 20
practiceMinutes: 120
slug: "power-apps-model-driven-apps-basadas-en-datos"
lastVerified: "2026-11"
---
*Duración: 1-2 semanas · Lectura: 8-10 min · Con práctica: unos 120 min con el ambiente listo; la primera vez, cuenta entre el doble y el triple (núcleo obligatorio); seguridad y BPF pueden completarse en una segunda sesión*

### 🎯 Objetivo
Construir aplicaciones Model-Driven aprovechando metadatos de Dataverse.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Publicar una Model-Driven App conectada a las tablas que ya creaste en Dataverse.
- Configurar navegación básica, formulario principal, vista de trabajo y dashboard simple.
- Entender por qué esta app sirve mejor para gestores/técnicos que para usuarios móviles.

### 🔧 Qué queda para después (Profundización opcional)
- Business Process Flow completo y Security Roles probados con usuarios diferentes. Son importantes, pero no bloquean tu primer logro visible del módulo.

### 📖 Conceptos Clave
- **Arquitectura Model-Driven**: *metadata-driven* (la app se arma a partir de la definición de tus tablas, no la dibujas) y se genera casi sola.
- **Componentes**: *Forms* (formularios), *Views* (vistas: listas filtradas), *Charts* (gráficos), *Dashboards* (tableros que juntan gráficos y listas) y *Business Process Flows* (**BPF**: una barra de etapas, arriba del formulario, que guía a la persona paso a paso por un proceso).
- **Tenant**: el "espacio" de tu organización en Microsoft 365, con sus usuarios y licencias. Dentro de él están tus ambientes (como tu ambiente Developer).
- **Play**: el botón del diseñador que abre la app tal como la verán los usuarios.
- **Site Map** (mapa del sitio): el menú de navegación de la app, organizado en áreas, grupos y páginas.
- **Security Roles** (roles de seguridad): conjuntos de permisos que dicen qué puede hacer cada persona con cada tabla (crear, leer, editar, borrar).
- **Forms** (formularios): *Main* (el completo), *Quick Create* (uno corto para crear rápido) y *Quick View* (muestra datos de otro registro relacionado).
- **Quick View Forms**: mostrar datos de registros relacionados directamente en el formulario principal sin cambiar de pantalla.
- **Subgrids** (subcuadrículas): una lista de registros relacionados metida dentro de un formulario; por ejemplo, en la ficha de un contacto, la lista de sus solicitudes. Sirve para relaciones 1:N (uno a muchos: un contacto tiene muchas solicitudes) o N:N (muchos a muchos).
- **UCI (Unified Client Interface)**: la interfaz moderna y común de las apps model-driven, la misma en navegador, tableta y móvil.
- **Modern App Designer** (diseñador moderno de apps): el editor visual donde configuras páginas, tablas, formularios, vistas y navegación desde una sola pantalla. Es el que se abre por defecto; algunos pasos avanzados todavía te llevan al diseñador clásico.

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

> **Cómo está organizado el Núcleo:** construyes la app en tres bloques (la app y su navegación, formularios y vistas, dashboard y publicación). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu propia app. Cierras con un reto en el que ya no te digo los pasos. Las microprácticas no necesitan tenant; construir la app sí (tu ambiente Developer y las tablas de los Módulos 1 y 2).

## 🧩 Microlección 1 — Qué es una Model-Driven y cuándo elegirla

**¿Qué vas a aprender?** Qué es una Model-Driven App (se genera a partir de tu modelo de datos), qué piezas tiene (navegación, formularios, vistas, dashboards) y cuándo conviene frente a una Canvas App.

**¿Por qué existe esto?** En una Canvas App dibujas cada pantalla. En una Model-Driven defines el modelo de datos y la app se arma casi sola: lista, formulario, relaciones y navegación. Para personas que trabajan todo el día sobre muchos registros relacionados, eso es más rápido de construir y más consistente.

**Ejemplo pequeño:** con la tabla Solicitud TI y sus columnas ya creadas, la app genera la lista, el formulario y el menú sin que dibujes una sola pantalla.

**Ahora haz algo — micropráctica (6 min):** **[Elegir Model-Driven o Canvas según el caso](/practica/ip-app-009-model-driven-o-canvas)**. Te da dos necesidades distintas de una empresa y te pide decidir qué tipo de app encaja con cada una.

**Práctica real en tu entorno (30 min):** haz los Pasos 1 y 2 de abajo.

##### Práctica 4.1: Crear Primera Model-Driven App

> **Nota de versión:** Las capturas y pasos a continuación describen el flujo general; la apariencia exacta puede variar según si tu ambiente usa el **Modern App Designer** (predeterminado desde 2023) o el diseñador clásico. La funcionalidad es equivalente en ambos.

**Paso 1: Crear la app dentro de tu solución del Módulo 2**

> **No crees otra solución ni otro Publisher.** Usa la solución con prefijo `sit` que creaste en el Paso 0 del Módulo 2: ahí ya están tu tabla Solicitud TI y sus columnas.

1. En [make.powerapps.com](https://make.powerapps.com), comprueba arriba a la derecha que estás en tu ambiente.
2. Menú lateral → **Solutions** → abre tu solución del Módulo 2.
3. En la barra superior: **+ New** → **App** → **Model-driven app**.
4. **Name:** `Gestión Solicitudes TI` → **Create**. Se abre el diseñador de apps (Modern App Designer).
5. Agrega las tablas como páginas:
   - En la barra superior haz clic en **+ Add page** → **Dataverse table**.
   - Marca **Solicitud TI** y **Contact** → **Add**.
6. Haz clic en **Save**.

**Paso 2: Organizar la navegación (el antiguo "site map")**

En el diseñador nuevo, las antiguas "subáreas" se llaman **páginas**. Se ordenan así: un **área** contiene **grupos**, y cada grupo contiene **páginas** ([Learn: navegación de la app](https://learn.microsoft.com/power-apps/maker/model-driven-apps/app-navigation)).

> **Ojo, hay dos "Navigation" distintos:** (1) dentro de la ventana **Settings**, la sección **Navigation** solo sirve para encender las áreas; (2) en el panel **Pages**, la palabra **Navigation** es el título del árbol de menús, y junto a ella está el botón **...** para crear grupos.

1. **Activa las áreas** (vienen apagadas): en la barra de comandos de arriba, **Settings** → en el panel izquierdo de esa ventana, **Navigation** → activa **Enable Areas** → cierra la ventana **Settings**. Si la app ya tiene varias áreas, la opción viene activada.
2. En el panel izquierdo del diseñador, haz clic en **Pages**. Debajo de **Pages** aparece el **selector de área** (un menú desplegable con el nombre del área actual; si no lo ves, repite el punto 1). Selecciona el área que ya existe y, en el panel de propiedades de la derecha, cambia su **Title** por `Solicitudes`.
3. Con el área `Solicitudes` elegida en el selector, crea los grupos: haz clic en **...** junto a **Navigation** → **New group** → en el panel de propiedades, **Title** `Operación`. Repite para `Configuración`. Cada grupo nuevo se crea dentro del área que tienes elegida en el selector.
4. Arrastra la página **Solicitud TI** al grupo `Operación` y la página **Contact** al grupo `Configuración`.
5. Crea la segunda área: abre el selector de área → **New area** → **Title** `Reportes`. Con `Reportes` elegida en el selector, crea su grupo igual que en el punto 3: **...** junto a **Navigation** → **New group** → **Title** `Análisis`. Lo dejas vacío por ahora; en el Paso 5 le pondrás el dashboard.
6. Haz clic en **Save** y luego en **Publish**.

Así queda:
   ```
   Área: Solicitudes
      Grupo: Operación
         Página: Solicitud TI
      Grupo: Configuración
         Página: Contact
   Área: Reportes
      Grupo: Análisis
         Página: Dashboard Solicitudes TI   (se añade en el Paso 5)
   ```

> "Categoría" no lleva página propia: es una columna de tipo Choice dentro de Solicitud TI, no una tabla.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre de la solución y prefijo del Publisher que usaste | ___ |
| Las áreas, grupos y páginas de tu navegación (site map) tal como quedaron | ___ |
| ¿La app aparece como "Publicada" o "Borrador" en la lista de apps de la solución? | ___ |

---

## 🧩 Microlección 2 — Formularios y vistas: lo que ve quien captura y quien revisa

**¿Qué vas a aprender?** Para qué sirve un formulario Main y uno Quick Create, y cómo una vista combina filtro, columnas y orden.

**¿Por qué existe esto?** El formulario organiza lo que ve quien captura el dato; la vista es lo que ve quien revisa muchos registros. Si están mal pensados (demasiadas pestañas, vistas sin filtro) la gente no los usa aunque funcionen.

**Ejemplo pequeño:** la vista "Mis Asignaciones" filtra por Asignado a = usuario actual y Estado distinto de Cerrada, muestra pocas columnas y ordena por fecha.

**Práctica real en tu entorno (50 min):** esta microlección no tiene micropráctica propia; la verificación es abrir tu vista y comprobar que muestra los registros que esperas.

**Paso 3: Personalizar los formularios**

**3.1 Crear la columna que falta.** El formulario usa `Notas de Resolución`, que el Módulo 2 no creó. En tu solución → **Tables** → **Solicitud TI** → **Columns** → **+ New column** → **Display name:** `Notas de Resolución`, **Data type:** **Multiple lines of text** → **Save**.

**3.2 Formulario Main.**

1. En la tabla **Solicitud TI** → **Forms** → abre el formulario **Information** (tipo *Main*).
2. Mira lo que ya trae: una pestaña (normalmente **General**) con una sección y algunas columnas, como **Título de Solicitud** (la columna principal) y quizá **Owner** (propietario). **No borres Título de Solicitud**: es la columna principal de la tabla. Owner puedes dejarlo donde está o moverlo a la sección Detalles.
3. Así se hace cada cosa en el diseñador de formularios ([Learn: secciones del formulario](https://learn.microsoft.com/power-apps/maker/model-driven-apps/add-move-or-delete-sections-on-form)):
    - **Cambiar el nombre de una pestaña o sección:** haz clic en ella y, en el panel de propiedades de la derecha, cambia su **Label**.
    - **Agregar una sección:** haz clic en una sección que ya exista (la nueva se crea justo después) → panel izquierdo **Components** → grupo **Layout** → elige un tipo de sección (por ejemplo, de 1 columna). Luego cambia su **Label**.
    - **Agregar una pestaña:** panel izquierdo **Components** → **Layout** → **1-column tab**, y cámbiale el **Label**. Una pestaña nueva ya trae una sección vacía.
    - **Agregar una columna:** panel izquierdo **Table columns** → arrástrala a la sección. Para moverla, arrástrala a otra sección.
4. Organízalo así:
     ```
     Pestaña: General
        Sección: Información Básica   (la sección que ya existía, con otro Label)
           - Título de Solicitud
           - Categoría
           - Prioridad
           - Estado
        Sección: Detalles             (sección nueva)
           - Descripción
           - Solicitante
           - Asignado a

     Pestaña: Resolución              (pestaña nueva)
        Sección: Solución
           - Fecha Resolución
           - Notas de Resolución

     Pestaña: Timeline                (pestaña nueva)
        - Control Timeline: Components → baja en la lista hasta Timeline → arrástralo a la sección de esta pestaña.
          El Timeline muestra las notas y los archivos adjuntos de cada solicitud. En el Módulo 2 (Práctica 2.1, Paso 1)
          marcaste "Enable Attachments" en la tabla, que es lo que permite añadirle notas y archivos.
     ```
5. Haz clic en **Save and publish** (arriba a la derecha) ([Learn: control Timeline](https://learn.microsoft.com/power-apps/maker/model-driven-apps/set-up-timeline-control)).

**3.3 Business Rule: mostrar la resolución solo cuando corresponde.**

> **Una Business Rule no puede ocultar una pestaña ni una sección, solo columnas.** Por eso esta regla oculta las dos columnas de resolución, no la pestaña. Ocultar la pestaña completa exige JavaScript; lo harás en el Módulo 13.

1. En la tabla **Solicitud TI** → **Business rules** → **Add business rule**. Se abre el diseñador en otra pestaña del navegador.
2. Arriba a la derecha, pon **Scope** en **All Forms**. Mostrar/ocultar columnas y hacerlas obligatorias son acciones de formulario, así que la regla debe aplicarse a los formularios.
3. Haz clic en la caja **Condition** y, en el panel derecho:
   - **Field:** Estado · operador de igualdad ("es igual a") · **Type:** Value · **Value:** Resuelta.
   - Haz clic en **+ New** para añadir otra regla, elige **OR** en **Rule Logic** y configura: Estado · igual a · Value · Cerrada.
   - Haz clic en **Apply**.
4. Desde la pestaña **Components** (derecha), arrastra **Set Visibility** al **+** junto al ✓ (condición verdadera): **Field:** Fecha Resolución y elige la opción que **muestra** la columna → **Apply**. Repite con Notas de Resolución.
5. Arrastra otra **Set Visibility** al **+** junto a la ✕ (condición falsa) para cada una de las dos columnas, eligiendo la opción que la **oculta**. La regla no se invierte sola: si no pones la rama ✕, las columnas se quedan visibles.
6. En la barra de comandos, en **Business rule name** (viene como *New business rule*), escribe `Mostrar resolución según estado` → **Save**. Para activarla, cierra el diseñador, selecciona la regla en la lista de **Business rules** de la tabla y elige **Activate** (Microsoft indica que no se activa desde la ventana del diseñador).
7. *(Opcional, misma técnica)* Otra regla con la condición Estado = Resuelta y la acción **Set Business Required** sobre Fecha Resolución (✓ Business Required, ✕ Not Business Required).

**3.4 Formulario Quick Create.**

1. Activa la opción en la tabla: abre la tabla **Solicitud TI**, haz clic en **Properties** (barra de comandos), despliega **Advanced options** si hace falta, marca **Enable quick create forms** → **Save**. Sin esta opción, el formulario Quick Create no se usa ([Learn: formularios Quick Create](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-quick-create-forms)).
2. En **Forms** → **New form** → **Quick create form** → escribe un **Form name** → **Create**.
3. Desde **Table columns** arrastra solo cuatro columnas: Título de Solicitud, Categoría, Prioridad y Descripción → **Save and publish**.
4. Para probarlo, abre la app con **Play** y haz clic en el botón **Create** (o **+ New**) de la barra de navegación de arriba; elige Solicitud TI: se abre un panel lateral corto en vez del formulario completo.
5. Si no ves ese botón: Learn documenta otro lugar donde aparece el Quick Create, el **+ New** de un campo Lookup o de una subcuadrícula que apunten a Solicitud TI. Tu app todavía no tiene ninguno, así que, si el botón no aparece, anota en la evidencia que el formulario existe y pruébalo en el Lab 04.

**Paso 4: Crear las vistas y los gráficos**

**Para crear una vista:** **Tables** → **Solicitud TI** → **Views** → añade una vista nueva (**+ New view**) → escribe el nombre → **Create**. En el diseñador:
- **Columnas:** selecciona **+ View column**, o arrastra la columna desde **Table columns** en el panel izquierdo.
- **Filtro:** en el panel de propiedades de la vista (derecha) → **Edit filters** → **Add** → **Add row** → elige columna, operador y valor → **OK**. Las filas del mismo grupo se combinan con **And**.
- **Orden:** selecciona el encabezado de la columna y elige el orden ascendente o descendente (según el tipo de columna verás **Sort A to Z** / **Sort Z to A** o **Sort ascending** / **Sort descending**). Para un segundo criterio, usa **Then sort by** en el panel de propiedades de la vista.
- Termina con **Save and publish**.

> **Ojo con ordenar por Prioridad:** las vistas guardan su consulta en **FetchXML** (el formato interno, en XML, con el que Dataverse guarda las consultas de vistas y gráficos), y FetchXML ordena las columnas Choice por el **texto** de la opción (alfabéticamente), no por el orden en que las creaste ([Learn: ordenar columnas Choice en FetchXML](https://learn.microsoft.com/power-apps/developer/data-platform/fetchxml/order-rows#choice-columns)). Por eso aquí se ordena por **SLA Horas**, que ya refleja la prioridad (Crítica = 4, Alta = 8, Media = 24, Baja = 48, por la regla del Módulo 2).

1. **Vista "Solicitudes Activas"**
    - Filtro: Estado · operador **Does not equal** ("no es igual a") · Cerrada
    - Columnas: Título de Solicitud, Solicitante, Prioridad, SLA Horas, Estado, Fecha Solicitud
    - Orden: SLA Horas **ascendente** (Crítica primero), luego Fecha Solicitud **descendente** (más reciente primero)

2. **Vista "Mis Asignaciones"**
    - Filtro: Asignado a · operador **Equals current user** ("es igual al usuario actual", es decir, a quien tenga la app abierta; si en tu lista tiene un nombre algo distinto, elige el que diga *current user*), **y además** Estado · **Does not equal** ("no es igual a") · Cerrada (dos filas en el mismo grupo, con **And**)
    - Columnas: Título de Solicitud, Categoría, Prioridad, Fecha Solicitud
    - Orden: Fecha Solicitud **ascendente** (más antigua primero)

3. **Dos gráficos** (los usarás en el dashboard del Paso 5). En tu solución → **Tables** → **Solicitud TI** → zona **Data experiences** (la parte del hub de la tabla donde están Forms, Views y Charts) → **Charts** → **New chart**. Se abre el diseñador de gráficos ([Learn: crear un gráfico del sistema](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-system-chart)):
    - **Gráfico "Solicitudes por Estado":** en **Column** elige Título de Solicitud; en **Aggregate** (cómo se resume la columna) elige **Count: All** (contar todas las filas); en **Chart type** elige **Pie** → **Next**. Como categoría (eje horizontal) elige **Estado** → **Apply** → **Save** → **Publish**.
    - **Gráfico "Solicitudes por Prioridad":** igual, pero **Chart type** **Column** y categoría **Prioridad**.
    - **El nombre:** el diseñador nombra el gráfico automáticamente a partir de las columnas que elegiste. Anota el nombre que le puso, porque en el Paso 5 lo buscarás en una lista. Si en el diseñador ves un campo **Name**, puedes cambiarlo por los nombres de arriba.
    - Si después el gráfico no aparece en tu app, abre la app en el diseñador, selecciona la tabla Solicitud TI y marca el gráfico nuevo en su lista de gráficos (pasa cuando la app no está configurada para mostrar **All** los gráficos).

    > Un gráfico que "cuenta" siempre se arma así: en la serie, cualquier columna que siempre tenga valor con **Count: All**; en el eje horizontal, la columna por la que agrupas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de las pestañas (tabs) de tu formulario Main | ___ |
| El filtro exacto de tu vista "Mis Asignaciones" | ___ |
| Cuántas vistas personalizadas creaste y cuántas columnas muestra la que más tiene | ___ |

---

## 🧩 Microlección 3 — Dashboard y publicación: que otros lo vean

**¿Qué vas a aprender?** Cómo un dashboard junta gráficos y listas en una sola pantalla, y qué hace falta para que otra persona vea tu app.

**¿Por qué existe esto?** Un dashboard le ahorra al gestor abrir vista por vista. Pero nada de lo que construyes se ve hasta que lo publicas, y una persona solo puede usar la app si tiene un rol de seguridad y la app está compartida con ella.

**Ejemplo pequeño:** cambias un formulario, no publicas las personalizaciones, y la app sigue mostrando la versión anterior. O publicas bien, pero tu compañero no tiene rol y no ve la app.

**Lo mínimo sobre roles y publicación:** un rol de seguridad es el conjunto de permisos que dice qué tablas puede ver y modificar una persona. Se asigna en el [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Users** → elige al usuario → **Manage security roles**. Además, la app se comparte desde la lista de apps con **Share** (el detalle está en la Práctica 4.3, que es Profundización). Para que tus cambios se vean, en tu solución haz clic en **Publish all customizations** y después abre la app con **Play**.

**Práctica real en tu entorno (20 min):** haz el Paso 5 de abajo.

**Paso 5: Crear el dashboard y añadirlo a la app**

1. En tu solución: **+ New** → **Dashboard** → elige el diseño **2-column overview**. Se abre el editor (**Dashboard: New**).
2. **Name:** `Dashboard Solicitudes TI`.
3. En un recuadro vacío, haz clic en su icono de gráfico → en el diálogo **Add Component**: **Record Type** (la tabla de la que salen los datos): Solicitud TI · **View:** Solicitudes Activas · **Chart:** Solicitudes por Estado (o el nombre automático que anotaste en el Paso 4) → **Add** ([Learn: dashboards](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-dashboards)).
4. En otro recuadro, icono de gráfico → igual, con el gráfico **Solicitudes por Prioridad** → **Add**.
5. En un tercer recuadro, haz clic en su icono de lista → **Record Type:** Solicitud TI · **View:** Solicitudes Activas → **Add**.
6. **Save** → **Close** → **Publish** (en tu solución).
7. Vuelve al diseñador de tu app → panel **Pages** → en el selector de área elige **Reportes** y haz clic en el grupo **Análisis** para seleccionarlo. Luego, en la barra de comandos, **Add page** → **Dashboard** → marca `Dashboard Solicitudes TI` → **Add**. Si la página queda en otro grupo, arrástrala a **Análisis**.
8. **Save** → **Publish** → **Play**. Revisa que el dashboard muestre datos (necesitas algunas solicitudes con estados y prioridades distintos).

**Ahora diagnostica — micropráctica (5 min):** **[Diagnosticar: la app está publicada pero mi compañero no la ve](/practica/ip-trb-004-app-no-visible-para-companero)**. Parte de un síntoma exacto —a ti te funciona y a otra persona no— y te pide qué falta y dónde se configura, antes de ver la solución.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de tu dashboard y cuántos componentes tiene | ___ |
| Qué hiciste para confirmar que los cambios se veían en la app publicada | ___ |
| Qué necesita otra persona para usar tu app (di las dos cosas y dónde se configuran) | ___ |

---

## 🔁 Reto de transferencia — Una vista y un gráfico para el jefe de TI, sin pasos

Esta vez no te digo los pasos: aplica lo que viste a un pedido nuevo.

> **Requerimiento:** el jefe de TI quiere ver cada mañana las solicitudes de prioridad Crítica que todavía no tienen técnico asignado, y un gráfico que diga cuántas son.
> **Criterios de aceptación:** (1) una vista nueva con el filtro correcto y un nombre que diga para qué sirve; (2) un gráfico en tu dashboard que cuente esas solicitudes; (3) comprobar en la app publicada que la vista y el gráfico aparecen.
> **Restricciones:** no modifiques las vistas que ya existen y no pases de 6 componentes en el dashboard.
> **Pistas si te atoras:** en el editor de la vista, la condición "sin técnico asignado" se escribe con la columna Asignado a y el operador "Does not contain data" (sin datos); un gráfico que cuenta usa el agregado "Count: All".

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: una vista de críticas sin asignar](/practica/ip-app-010-transferir-vista-criticas)**. Retoma la app de este módulo pero con un pedido nuevo, y te pide decidir qué hacer y qué evitar.

**Si aún no tienes tenant:** escribe el filtro exacto que usarías, el nombre de la vista y qué pasos seguirías para publicarla.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El filtro exacto de tu vista nueva y su nombre | ___ |
| El tipo de gráfico que elegiste y el número que mostró | ___ |
| Cómo comprobaste que aparecía en la app publicada | ___ |

#### 🔧 Profundización opcional

> Si estás empezando desde cero, completa primero la app, el formulario, una vista y un dashboard. Vuelve a esta sección cuando ya puedas abrir la Model-Driven App publicada y navegar por registros reales.

##### Práctica 4.2: Business Process Flow

*Crear la barra de etapas para el ciclo de vida de una solicitud*

Un **Business Process Flow (BPF)** muestra arriba del formulario una barra con **etapas** (*stages*); cada etapa tiene **pasos** (*steps*), y cada paso es una columna que la persona rellena. La persona avanza con el botón **Next Stage**. Un BPF **no cambia de etapa solo** cuando cambia el valor de una columna (por ejemplo, Estado): Learn indica que no añade lógica condicional ni automatización más allá de guiar la captura de datos y controlar la entrada a cada etapa ([Learn: introducción a los BPF](https://learn.microsoft.com/power-automate/business-process-flows-overview)).

> **Licencia:** para crear un BPF, Learn pide una licencia *per user* de Power Apps o Power Automate, o una de Dynamics 365 que lo incluya. Si tu ambiente no te deja crearlo, lee esta práctica sin hacerla.

0. **Antes:** crea en la tabla Solicitud TI la columna `Feedback` (**Data type:** Choice, opciones Satisfecho, Neutral, Insatisfecho), igual que creaste las Choice en el Módulo 2.
1. En tu solución: **New** → **Automation** → **Process** → **Business process flow**.
2. **Display name:** `Proceso Solicitud TI` (el **Name** se rellena solo). **Table:** Solicitud TI → **Create**. Se abre el diseñador con una primera etapa ya creada ([Learn: crear un BPF](https://learn.microsoft.com/power-automate/create-business-process-flow)).
3. **Etapas y pasos.** Para agregar una etapa, arrastra **Stage** desde la pestaña **Components** hasta un signo **+** del diseñador; escribe su nombre en **Properties** → **Apply**. Para ver los pasos de una etapa, haz clic en **Details** (abajo a la derecha de la etapa); para agregar uno, arrastra el componente de paso (**Data Step**; Learn lo llama *Step*) a la etapa, elige la columna en **Properties** y marca **Required** si debe rellenarse antes de pasar a la siguiente etapa → **Apply**.
   ```
   Etapa 1: Registro
      - Título de Solicitud
      - Categoría
      - Descripción

   Etapa 2: Asignación
      - Asignado a   (Required)
      - Prioridad

   Etapa 3: Resolución
      - Notas de Resolución
      - Fecha Resolución   (Required)

   Etapa 4: Cierre
      - Feedback
   ```
4. **Validate** → **Save** (mientras sea un borrador nadie puede usarlo) → **Activate**.
5. **Edit Security Roles** (barra de comandos del diseñador): por defecto solo **System Administrator** y **System Customizer** ven un BPF nuevo; da acceso a los roles de la Práctica 4.3.
6. Prueba: abre una solicitud en la app, rellena los pasos de la etapa y pulsa **Next Stage**.

> **Solo lectura (conceptos avanzados):** el diseñador también permite (a) una **Condition** entre dos etapas para ramificar el proceso según los pasos de la etapa anterior, (b) un componente **Workflow** que lanza un proceso automático al entrar o salir de una etapa, y (c) un **Action Step**, un botón dentro de la etapa que ejecuta una acción o un workflow cuando la persona lo pulsa. Mover la etapa automáticamente según el Estado exigiría automatizaciones fuera de este nivel.

##### Práctica 4.3: Configurar Seguridad

**Niveles de acceso** (para cada permiso eliges hasta dónde llega) ([Learn: roles y privilegios](https://learn.microsoft.com/power-platform/admin/security-roles-privileges)):
- **None**: ningún acceso.
- **User**: solo los registros que son tuyos (o que te compartieron). En algunos textos aparece como nivel *Basic*.
- **Business Unit**: los registros de tu unidad de negocio (tu "departamento" dentro de Dataverse).
- **Parent: Child Business Unit**: los de tu unidad y los de las unidades que dependen de ella.
- **Organization**: todos los registros del ambiente.

Además de Create, Read, Write y Delete, hay dos permisos que se olvidan a menudo: **Append** (vincular este registro con otro, por ejemplo elegir un Solicitante en la solicitud) y **Append To** (que otros registros se vinculen a este; lo necesita Contact para poder ser elegido como Solicitante).

1. **Crear los roles** (nombres con prefijo `SIT`, los mismos que usa el Lab 04): [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Security roles** → **+ New role**. Escribe el nombre, deja la unidad de negocio que viene y **deja activada** la opción **Include App Opener privileges for running Model-Driven apps**: sin los permisos mínimos de *App Opener*, un rol que solo tiene permisos sobre Solicitud TI **no puede abrir la app** ([Learn: crear un rol y privilegios mínimos](https://learn.microsoft.com/power-platform/admin/create-edit-security-role)) → **Save**. Después, en la pestaña de tablas, busca cada tabla y asigna sus permisos → **Save**.

   **Rol: SIT Solicitante**
    - Solicitud TI: Create (User), Read (Business Unit), Write (User), Append (User)
    - Contact: Read (Organization), Append To (Organization)
    - Si hiciste la tabla **Categoría Detallada** del Módulo 2 (Práctica 2.2): Read (Organization). La columna **Categoría** es una Choice, no una tabla, así que no lleva permisos propios.

   **Rol: SIT Técnico TI**
    - Solicitud TI: Create, Read, Write, Delete, Append, Append To (Organization)
    - Contact: Read, Append To (Organization)

   **Rol: SIT Administrador TI**
    - Solicitud TI: todos los permisos (Organization)
    - Contact: Read, Write, Append, Append To (Organization)
    - Da solo los permisos de las tablas que usa la app, no "todas las tablas".

2. **Asignar un rol a una persona y compartir la app:**
    - Power Platform Admin Center → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Users** → elige a la persona → **Manage security roles** → marca el rol → **Save**.
    - En Power Apps → **Apps** → **...** junto a tu app → **Share** → elige el rol o la persona → **Share** ([Learn: compartir una model-driven app](https://learn.microsoft.com/power-apps/maker/model-driven-apps/share-model-driven-app)).

3. **Probar los roles:**
    - Para probar de verdad necesitas **otra persona usuaria** en tu ambiente, con su licencia. Normalmente no puedes crearla tú: pídesela a un administrador de tu tenant. Si no tienes, deja esta prueba como lectura y guarda como evidencia la captura de los permisos de cada rol.
    - **No te quites a ti misma el rol System Administrator** para probar: podrías perder el acceso a tu propio ambiente. Mientras lo tengas, verás todo, aunque además te asignes un rol más limitado (los permisos de varios roles se suman).
    - Con otra persona usuaria: entra con su cuenta, comprueba qué solicitudes ve y qué botones (New, Delete) tiene activos.

### 💼 Caso Real de Negocio

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

### ✅ Buenas Prácticas

**Diseño de Forms**:

- Máximo 3 tabs por form (evitar sobrecarga)
- Agrupar campos relacionados en sections
- Ocultar columnas innecesarias según contexto con Business Rules (las pestañas y secciones completas solo se ocultan con JavaScript)
- Usar Quick View Forms para mostrar datos relacionados inline

**Performance**:

- Limitar columnas en vistas (8-10 máximo)
- No cargar todos los campos en forms: reparte las columnas en pestañas para que cada una se cargue cuando se abre (*lazy load*, "carga diferida")
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

### ⚠️ Errores Comunes

1. **Lo que ves:** otras personas no ven la app o no ven los datos.
    - **Causa**: Falta Security Role asignado
    - **Solución**: Power Platform Admin Center > Manage > Environments > tu ambiente > Settings > Users + permissions > Users > Manage security roles + compartir app

2. **Lo que ves:** el Business Process Flow no aparece en el formulario.
    - **Causa**: No está activado o no asignado a Security Role
    - **Solución**: en el diseñador del BPF, **Activate** y luego **Edit Security Roles** para dar acceso a los roles que lo usan

3. **Lo que ves:** cambiaste el formulario y la app sigue mostrando la versión anterior.
    - **Causa**: No se publicó customizations
    - **Solución**: Siempre Publish All Customizations después de cambios

4. **Lo que ves:** el dashboard no muestra datos actualizados.
    - **Causa**: Cache del navegador o permisos en vistas subyacentes
    - **Solución**: Refresh browser, verificar security role en charts/views

5. **Lo que ves:** el site map no se guarda o no aparece en la app.
    - **Causa**: Estructura inválida (una página sin grupo, etc.)
    - **Solución**: Validar jerarquía: Área > Grupo > Página (en el diseñador clásico, *Subarea*)

### 🧪 Criterios de Validación
- [ ] Model-Driven App publicada con site map de 2+ áreas
- [ ] 2+ forms personalizados (Main + Quick Create)
- [ ] 2+ vistas con filtros y columnas optimizadas (las del Paso 4; 3 si hiciste el reto)
- [ ] 1 Dashboard con mínimo 3 componentes
- [ ] 1 Business Process Flow con 3+ stages funcional
- [ ] 2+ Security Roles configurados y asignados
- [ ] Probar app con distintos roles y verificar permisos
- [ ] Explicar cuándo usar Model-Driven vs Canvas

> Los primeros 4 criterios son el Núcleo obligatorio. BPF y Security Roles pertenecen a la Profundización opcional si no tienes todavía usuarios de prueba o tiempo para validar permisos.

### 📸 Evidencia para guardar
- Captura de la app publicada con el site map visible.
- Captura del formulario Main con secciones organizadas.
- Captura de una vista filtrada y del dashboard con datos de prueba.
- Si haces la profundización: captura del BPF activo y de la prueba con roles.

### ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 04 · Model-Driven App — Sistema de Gestión de Solicitudes Completo](/labs/lab-04-model-driven-app)**

**Por qué:** el Lab 04 convierte este módulo en un recorrido clic-por-clic sobre la solución SIT creada en los labs anteriores. Es la mejor forma de practicar formularios, vistas, dashboard y roles sin inventar estructura nueva.

**Qué evidencia guardar del lab:** site map publicado, formulario Main, Quick Create, dashboard y prueba de permisos con los roles `SIT Solicitante` y `SIT Técnico TI`.

---
