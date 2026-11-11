---
id: lab-03
title: "Canvas App — Primera Aplicación de Gestión de Solicitudes"
level: "N1"
duration: 90
product: ["Power Apps Canvas", "Dataverse"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites:
  - "Lab 02 completado — tablas sit_Solicitud y sit_Categoria existentes con datos de prueba"
  - "Ambiente del curso activo en make.powerapps.com"
files: []
lastVerified: "2026-11"
---

# Lab 03 — Canvas App: Gestión de Solicitudes Internas (SIT)

## Objetivo

Al finalizar este laboratorio podrás construir una Canvas App de tres pantallas conectada a Dataverse, con galería de registros, búsqueda, filtros por estado, formulario de creación y pantalla de detalle/edición, usando Power Fx y navegación entre pantallas.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 02

**Problema a resolver:** El modelo de datos ya existe en Dataverse, pero los empleados no tienen una interfaz para crear ni consultar solicitudes — siguen usando el Excel. Se necesita una app simple que funcione en tablet en recepción y en móvil para empleados en campo.

**Por qué Canvas App:** El diseño libre de Canvas permite crear exactamente la experiencia que el equipo necesita: pantalla de lista con búsqueda, formulario de nueva solicitud y vista de detalle, sin depender de la interfaz estándar de las Model-Driven Apps.

## Lo que vas a construir

- **Pantalla Inicio (scrInicio):** galería de solicitudes con buscador y filtro por estado
- **Pantalla Nueva Solicitud (scrNueva):** formulario de creación con validación antes de guardar
- **Pantalla Detalle (scrDetalle):** vista completa del registro con opción de edición inline

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Configuración inicial y pantalla de listado | 30 min |
| Ejercicio 2 — Pantalla de nueva solicitud | 25 min |
| Ejercicio 3 — Pantalla de detalle y edición | 20 min |
| Ejercicio 4 — Pulir UX y publicar | 15 min |
| **Total** | **90 min** |

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power Apps Canvas App
- Power Fx (fórmulas)
- Dataverse (datasource)
- Controles: Gallery, Form, TextInput, Dropdown, Button, Label, Rectangle

## Prerrequisitos

### Entorno

- [ ] Lab 02 completado: tablas `sit_Solicitud` y `sit_Categoria` creadas, con los 10 registros de prueba del Lab 02
- [ ] Acceso a [make.powerapps.com](https://make.powerapps.com)
- [ ] Tu ambiente del curso seleccionado

### Conocimiento previo

- Módulo 3 estudiado: conceptos de controles, propiedades y fórmulas básicas
- Comprender la diferencia entre `Navigate()` y `Back()`

> **Esta es una app nueva.** Si hiciste la Práctica 3.1 del Módulo 3, aquella app se queda como está. En este lab creas otra desde cero sobre las tablas del Lab 02. La diferencia principal: aquí **Categoría** es una búsqueda (*Lookup*) a la tabla **Categorías**, no una columna *Choice*, y **Estado** también tiene las opciones Aprobada y Rechazada.

---

## Variante sin tenant

**¿Todavía no tienes Lab 02 completado ni tu ambiente del curso activo?** No te saltes este lab —
completa esta variante en su lugar. Es la misma referenciada desde "Mi ruta" en el paso de práctica
guiada de la primera app.

**Qué SÍ valida esta variante:** tu capacidad de diseñar la solución — modelar datos, pensar la
navegación entre pantallas y escribir las fórmulas de Power Fx correctas antes de tocar el editor.

**Qué NO valida:** que sepas operar el editor de Power Apps ni que la app corra realmente contra
Dataverse. Esa parte queda pendiente hasta que completes el Lab 02 y este Lab 03 en su forma
original, con tenant.

Produce, en un documento o carpeta local (Word, Markdown o incluso papel fotografiado — lo que ya
uses), estos 6 entregables:

1. **Modelo de datos conceptual**: la tabla **Solicitudes TI** con sus columnas (`'Título de Solicitud'`,
   `Descripción`, `Categoría`, `Prioridad`, `Estado`, `'Fecha Solicitud'`, `'Fecha Resolución'`,
   `'Asignado a'`) y sus tipos de dato, igual que las usa este lab.
2. **Wireframes de las 3 pantallas**: dibuja (a mano, en una herramienta de diseño o incluso en una
   hoja de cálculo con celdas como cuadrícula) `scrInicio`, `scrNueva` y `scrDetalle` con los
   controles que llevarían — mismos nombres de la [convención de controles](#convención-de-nombres-de-controles)
   de abajo, para que sea directamente reutilizable cuando tengas tenant.
3. **Fórmulas Power Fx propuestas**: escribe (sin poder probarlas todavía) la fórmula de `Items` de
   `galSolicitudes` con `Filter`/`Search`, y el `OnSelect` de `btnGuardar` con `SubmitForm` — puedes
   basarte en las del Ejercicio 1 y 2 de este mismo lab como referencia de qué se espera, pero
   escribe primero tu propia versión antes de mirarlas.
4. **Flujo de navegación**: un diagrama simple (cajas y flechas) mostrando qué pantalla lleva a cuál
   y con qué acción del usuario.
5. **Casos de prueba**: lista de al menos 5 casos ("si el usuario busca X, debería ver Y", "si
   guarda sin título, debería ver Z") que usarías para validar la app una vez construida.
6. **Reflexión de limitaciones** (3-5 líneas): qué de todo esto no puedes confirmar sin ejecutar la
   app de verdad — por ejemplo, si la fórmula de filtrado es delegable, o si el Lookup de Categoría
   se resuelve como esperas.

**Evidencia para guardar**: los 6 documentos anteriores, agrupados en una sola carpeta o archivo.
Regístralo igual que cualquier evidencia de "Mi progreso" — marca explícitamente que fue la
**variante sin tenant**, no la ejecución real, para no confundir tu propio historial de aprendizaje
ni tu portafolio más adelante.

**Cómo completar la práctica real después**: cuando consigas tu ambiente del curso (ver la
[Guía de herramientas de estación](/recursos/guia-herramientas-workstation#antes-de-instalar-nada-tu-cuenta-y-tu-tenant)
y [Entornos y trials](/recursos/entornos-y-trials)),
vuelve a este mismo lab y sigue los Ejercicios 1 a 4 con tus wireframes y fórmulas ya listos — vas a
construir mucho más rápido porque el diseño ya está hecho.

---

## Datos de apoyo

### Convención de nombres de controles

Sigue esta convención durante todo el lab — los Labs posteriores referenciarán estos nombres.

| Prefijo | Tipo de control | Ejemplo |
|---|---|---|
| `scr` | Screen | `scrInicio` |
| `gal` | Gallery | `galSolicitudes` |
| `frm` | Form | `frmNueva` |
| `btn` | Button | `btnGuardar` |
| `txt` | Text Input | `txtBusqueda` |
| `drp` | Dropdown | `drpEstado` |
| `lbl` | Label | `lblContador` |
| `rect` | Rectangle | `rectHeader` |

### Colores de la aplicación

| Uso | Color Power Fx |
|---|---|
| Color primario (botones, encabezado) | `ColorValue("#0078D4")` (azul Microsoft) |
| Color de fondo de pantalla | `ColorValue("#F5F5F5")` |
| Color de texto principal | `ColorValue("#1A1A1A")` |
| Color de error | `ColorValue("#D13438")` |
| Color de éxito | `ColorValue("#107C10")` |

---

## Ejercicio 1 — Configuración inicial y pantalla de listado

> **Qué vas a hacer:** Crear la app en blanco, conectar el datasource de Dataverse y construir la pantalla principal con galería de solicitudes, buscador y filtro por estado.
> **Duración:** 30 min

> **Idioma de los menús:** igual que en el Módulo 3, los pasos usan los nombres en inglés (**Create**, **Insert**, **Tree view**...) y entre paréntesis lo que significan. Si tu Power Apps está en español, busca la opción equivalente (por ejemplo, **Insert** = **Insertar**). Los nombres de propiedades y funciones (`Items`, `OnSelect`, `Filter`) se escriben siempre en inglés.
>
> **Controles clásicos:** este lab usa los controles **clásicos** (sus propiedades son `HintText`, `AllowEmptySelection`, `DefaultDate`...). Si en el panel **Insert** ves una categoría **Classic**, inserta desde ahí el *Text input*, el *Drop down* y el *Button*. Si no ves esa categoría, los que aparecen ya son los clásicos.
>
> **Cómo cambiar el nombre de un control (lo harás muchas veces):** en el panel **Tree view** (izquierda), pasa el mouse sobre el control, selecciona **⋯** y luego **Rename**.

### Tarea 1.1 — Crear la Canvas App

1. En [make.powerapps.com](https://make.powerapps.com), selecciona tu ambiente del curso.

2. En el panel de la izquierda, selecciona **Create** (crear) y luego **Create from blank** (crear desde cero).

3. En el cuadro **Start with a blank canvas** (empezar con un lienzo en blanco), elige **Phone size** (tamaño teléfono).

   > Elegimos formato teléfono para que funcione bien en móvil y tablet.

4. Escribe el nombre `SIT Solicitudes Internas` y selecciona **Create**. Se abre Power Apps Studio con una pantalla en blanco llamada `Screen1`.

5. Cambia el nombre de `Screen1` a `scrInicio` (**Tree view** > **⋯** > **Rename**).

6. Conectar el datasource:
   - En el menú de la izquierda, selecciona **Data** (datos)
   - Selecciona **Add data** (agregar datos) y escribe `Solicitud` en el cuadro de búsqueda. Si no aparece tu tabla, escribe `Dataverse`, selecciona el conector **Microsoft Dataverse** y búscala en la lista
   - Selecciona tu tabla de solicitudes (**Solicitud TI**)
   - Repite **Add data** y agrega también la tabla **Categoría** que creaste en el Lab 02

   > Si no ves tus tablas, verifica que el ambiente correcto está seleccionado. El datasource de Dataverse siempre se conecta al ambiente activo.

   > **Nombres en las fórmulas (igual que en los Módulos 2, 3 y 7):** la tabla se escribe por su nombre en plural, `'Solicitudes TI'`, y las columnas por su nombre visible: `'Título de Solicitud'`, `Descripción`, `Categoría`, `Prioridad`, `Estado`, `'Fecha Solicitud'`, `'Fecha Resolución'`, `'Asignado a'` (comillas simples cuando el nombre tiene espacios). Si en tu ambiente la tabla o una columna tiene otro nombre visible, usa el que te propone la barra de fórmulas al empezar a escribirlo.

### Tarea 1.2 — Construir el encabezado

1. En `scrInicio`, haz clic en la pantalla para seleccionarla y cambia su propiedad `Fill`:
   ```js
   ColorValue("#F5F5F5")
   ```

2. Inserta un **Rectangle** (**Insert** > escribe `Rectangle` en el cuadro de búsqueda):
   - Renómbralo `rectHeader`
   - `X`: `0`, `Y`: `0`, `Width`: `App.Width`, `Height`: `70`
   - `Fill`: `ColorValue("#0078D4")`

3. Inserta un **Label** para el título (**Insert** > `Label`):
   - Renómbralo `lblTitulo`
   - `Text`: `"📋 Solicitudes"`
   - `X`: `16`, `Y`: `15`, `Width`: `App.Width - 80`, `Height`: `40`
   - `Color`: `Color.White`, `Size`: `18`, `FontWeight`: `FontWeight.Bold`

4. Inserta un **Button** para nueva solicitud, renómbralo `btnNueva`:
   - `Text`: `"+"`
   - `X`: `App.Width - 56`, `Y`: `15`, `Width`: `40`, `Height`: `40`
   - `Fill`: `Color.White`, `Color`: `ColorValue("#0078D4")`
   - `OnSelect`:
     ```js
     // NewForm deja el formulario vacío y en modo New: después de guardar, el formulario
     // pasa solo a modo Edit, así que hay que volver a ponerlo en modo New cada vez
     NewForm(frmNueva);
     Navigate(scrNueva, ScreenTransition.Cover)
     ```

   > La pantalla `scrNueva` y el formulario `frmNueva` no existen aún — verás un error en rojo. Es normal; desaparece cuando los crees en el Ejercicio 2.

### Tarea 1.3 — Agregar buscador y filtro

1. Inserta un control **Text input** (clásico), renómbralo `txtBusqueda`:
   - `HintText` (el texto gris que se ve cuando el cuadro está vacío): `"Buscar solicitudes..."`
   - Borra lo que tenga la propiedad `Default`, para que el cuadro empiece vacío
   - `X`: `12`, `Y`: `80`, `Width`: `App.Width - 24`, `Height`: `44`
   - `BorderColor`: `ColorValue("#CCCCCC")`
   - `RadiusTopLeft` / `RadiusTopRight` / etc.: `8`

2. Inserta un **Drop down** (clásico), renómbralo `drpEstado`:
   - `X`: `12`, `Y`: `134`, `Width`: `App.Width - 24`, `Height`: `40`
   - `Items`:
     ```js
     // Distinct devuelve una tabla de una columna llamada Value con cada opción de Estado una sola vez
     Distinct('Solicitudes TI', Estado)
     ```
   - `AllowEmptySelection`: `true` — sin selección, la galería muestra todas las solicitudes (hace el papel de "Todos")

### Tarea 1.4 — Galería de solicitudes

1. Inserta una **Gallery** (**Insert** > `Vertical gallery`), renómbrala `galSolicitudes`. Si te pide un origen de datos, elige **Solicitudes TI**:
   - `X`: `0`, `Y`: `210`, `Width`: `App.Width`, `Height`: `App.Height - 210`
   - `TemplateSize`: `90`

2. Configura la propiedad `Items` de la galería con la fórmula de filtrado:
   ```js
   Filter(
       // Search(tabla, texto, columnas...): las columnas se escriben por su nombre visible, sin comillas dobles
       Search(
           'Solicitudes TI',
           txtBusqueda.Text,
           'Título de Solicitud',
           Descripción
       ),
       // Sin estado elegido se muestran todas; si hay uno, solo las de ese estado
       IsBlank(drpEstado.Selected) || Estado = drpEstado.Selected.Value
   )
   ```

   > **¿Por qué no se compara con el texto del estado?** En Dataverse, una columna Choice guarda un número y su etiqueta ("Nueva") es solo para mostrar, porque cambia según el idioma: no se puede comparar con texto. Aquí `drpEstado.Selected.Value` ya es la opción de Estado, así que se compara directo con la columna. Si escribes la condición a mano, usa la *enumeración*: `Estado = 'Estado (Solicitudes TI)'.Nueva` (escribe `'Estado (` en la barra de fórmulas y elige la opción que te propone). Para *mostrar* la etiqueta, basta con poner la columna en el `Text` de un Label.

3. Dentro de la plantilla de la galería (la primera fila: lo que pongas ahí se repite en todas), agrega estos controles. Para agregar un control **dentro** de la plantilla: selecciona la primera fila de la galería, haz clic en el ícono de lápiz que aparece arriba a la izquierda y luego **Insert** > `Label`. Si la galería ya trae etiquetas (`Title1`, `Subtitle1`...; las ves al expandir `galSolicitudes` en **Tree view**), puedes reutilizarlas cambiando su `Text`:
   - **Label** para título: `Text`: `ThisItem.'Título de Solicitud'`, tamaño `16`, negrita
   - **Label** para estado: `Text`: `ThisItem.Estado`
   - **Label** para prioridad: `Text`: `ThisItem.Prioridad`
   - **Label** para fecha: `Text`: `Text(ThisItem.'Fecha Solicitud', "dd/mm/yyyy")` (en `Text`, `mm` entre el día y el año es el mes)

4. Configura el `OnSelect` de la **galería** (no de los controles internos):
   ```js
   Navigate(scrDetalle, ScreenTransition.Cover)
   ```

   > La pantalla `scrDetalle` tampoco existe aún. El error desaparece cuando la crees en el Ejercicio 3.

5. Agrega un **Label** fuera de la galería, entre el dropdown y la galería, para mostrar el contador. Renómbralo `lblContador`:
   - `Text`:
     ```js
     // AllItems son las filas que la galería tiene cargadas
     "Mostrando " & CountRows(galSolicitudes.AllItems) & " solicitudes"
     ```
   - `X`: `12`, `Y`: `180`, `Width`: `App.Width - 24`, `Height`: `24`, `Size`: `12`, `Color`: `ColorValue("#666666")` (gris)

   > Con estas posiciones nada se encima: el buscador ocupa de `Y` 80 a 124, el dropdown de 134 a 174, el contador de 180 a 204 y la galería empieza en 210.

### Resultado esperado del Ejercicio 1

La pantalla `scrInicio` muestra el encabezado azul, el buscador, el dropdown de estado, el contador y la galería con los 10 registros de prueba del Lab 02. Al escribir en el buscador se filtran los resultados. Al cambiar el dropdown también se filtran.

### Validación del Ejercicio 1

- [ ] La galería muestra los 10 registros de prueba del Lab 02
- [ ] El buscador filtra por título y descripción en tiempo real
- [ ] El dropdown de estado filtra correctamente (prueba seleccionando "Nueva" — solo deben verse las nuevas)
- [ ] El contador actualiza el número al filtrar

---

## Ejercicio 2 — Pantalla de nueva solicitud

> **Qué vas a hacer:** Crear la pantalla con formulario para que el usuario complete y envíe una nueva solicitud, con validación antes de guardar.
> **Duración:** 25 min

### Tarea 2.1 — Crear la pantalla scrNueva

1. En la barra de comandos de arriba, selecciona **New screen** (nueva pantalla) y elige **Blank** (en blanco).

2. Renómbrala `scrNueva`.

3. Arma el encabezado de esta pantalla. Cada control de la app necesita un nombre **único**, así que estos llevan nombres nuevos:
   - **Rectangle** `rectHeaderNueva`: mismas propiedades que `rectHeader` (`X` `0`, `Y` `0`, `Width` `App.Width`, `Height` `70`, `Fill` `ColorValue("#0078D4")`)
   - **Label** `lblTituloNueva`: `Text` `"Nueva Solicitud"`, mismas posiciones y colores que `lblTitulo`
   - **Button** `btnCancelar` (en el lugar del botón "+"): mismas posiciones y colores que `btnNueva`, y:
     - `Text`: `"✕"`
     - `OnSelect`:
       ```js
       // Descarta lo escrito y vuelve a la lista con la animación inversa a la de llegada
       ResetForm(frmNueva);
       Navigate(scrInicio, ScreenTransition.UnCover)
       ```

   > **Atajo:** puedes copiar los tres controles del encabezado de `scrInicio` (selecciónalos y pulsa `Ctrl+C`) y pegarlos aquí (`Ctrl+V`). Los controles pegados reciben **otro nombre** automáticamente (porque los originales ya existen): cámbialos por los nombres de arriba y ajusta su `Text` y `OnSelect`.

### Tarea 2.2 — Formulario de creación

1. Inserta un control **Edit form** (**Insert** > `Edit form`), renómbralo `frmNueva`:
   - `DataSource`: `'Solicitudes TI'`
   - `DefaultMode`: `FormMode.New`
   - No hace falta configurar `Item`: en modo New el formulario usa los valores por defecto de la tabla
   - `X`: `0`, `Y`: `80`, `Width`: `App.Width`, `Height`: `App.Height - 160`

2. En el panel de propiedades del formulario, selecciona **Edit fields** (editar campos) y agrega exactamente estos campos en este orden:
   1. **Título de Solicitud**
   2. **Descripción**
   3. **Categoría**
   4. **Prioridad**
   5. **Fecha Solicitud**

   > Elimina cualquier campo que no esté en esta lista si el formulario los agrega automáticamente (como Estado — queremos que sea siempre "Nueva" al crear).

3. Configura el campo **Fecha Solicitud** para que tenga como valor por defecto la fecha y hora de hoy. Cada campo del formulario vive en una *tarjeta* (*card*) y, al principio, la tarjeta está **bloqueada** (ícono de candado): no deja cambiar sus fórmulas. Primero la desbloqueas:
   1. En **Tree view**, expande `frmNueva` y selecciona la tarjeta de **Fecha Solicitud** (su nombre incluye el del campo, por ejemplo `Fecha Solicitud_DataCard1`).
   2. En el panel de propiedades de la derecha, abre la pestaña **Advanced** (avanzado) y selecciona **Unlock to change properties** (desbloquear para cambiar propiedades). Una tarjeta desbloqueada ya no se puede volver a bloquear; no pasa nada, solo significa que sus fórmulas ahora son tuyas.
   3. Con la **tarjeta** seleccionada (no el selector de fecha de dentro), elige la propiedad `Default` y escribe:
      ```js
      // Default de la tarjeta Fecha Solicitud: si el registro aún no tiene fecha (registro nuevo),
      // propone la fecha y hora de este momento
      Coalesce(ThisItem.'Fecha Solicitud', Now())
      ```
      El selector de fecha de dentro de la tarjeta toma su valor de la tarjeta (`Parent.Default`), por eso basta con cambiarlo aquí.

### Tarea 2.3 — Botón Guardar con validación

1. Inserta un **Button** fuera del formulario en la parte inferior, renómbralo `btnGuardar`:
   - `Text`: `"Guardar Solicitud"`
   - `X`: `12`, `Y`: `App.Height - 70`, `Width`: `App.Width - 24`, `Height`: `50`
   - `Fill`: `ColorValue("#0078D4")`, `Color`: `Color.White`

2. Configura la propiedad `OnSelect`:
   ```js
   // SubmitForm revisa los campos requeridos y envía el registro a Dataverse.
   // Aquí NO navegamos: todavía no sabemos si se guardó (eso lo deciden OnSuccess y OnFailure)
   SubmitForm(frmNueva)
   ```

3. Selecciona el formulario `frmNueva` y configura su propiedad `OnSuccess` (se ejecuta solo si Dataverse confirmó que guardó):
   ```js
   Notify("Solicitud creada exitosamente.", NotificationType.Success);
   Navigate(scrInicio, ScreenTransition.UnCover)
   ```

4. Configura la propiedad `OnFailure` de `frmNueva` (se ejecuta si no se pudo guardar, por ejemplo porque falta un campo requerido):
   ```js
   // Muestra el motivo y deja al usuario en esta pantalla para que lo corrija
   Notify("Error al guardar: " & frmNueva.Error, NotificationType.Error)
   ```

### Resultado esperado del Ejercicio 2

La pantalla `scrNueva` muestra el formulario con los 5 campos. Al hacer clic en "Guardar Solicitud" con campos válidos, el registro se crea en Dataverse y la app vuelve a `scrInicio`. Si falta un campo requerido (por ejemplo, la Categoría), aparece el mensaje de error y la app se queda en `scrNueva`.

### Validación del Ejercicio 2

- [ ] El formulario muestra los 5 campos en el orden correcto
- [ ] La fecha se pre-llena con la fecha de hoy
- [ ] Al guardar con datos válidos, aparece el mensaje de éxito y se navega a scrInicio
- [ ] El nuevo registro aparece en la galería de scrInicio
- [ ] Al intentar guardar sin Categoría (requerida desde el Lab 02), aparece el mensaje de error y la app no cambia de pantalla
- [ ] Al pulsar "+" otra vez después de guardar, el formulario aparece vacío (gracias a `NewForm`)

---

## Ejercicio 3 — Pantalla de detalle y edición

> **Qué vas a hacer:** Crear la pantalla que muestra todos los campos de la solicitud seleccionada, con botón de edición inline.
> **Duración:** 20 min

### Tarea 3.1 — Crear scrDetalle

1. Agrega una nueva pantalla (**New screen** > **Blank**) y renómbrala `scrDetalle`.

2. Arma el encabezado igual que en `scrNueva`, con nombres nuevos (puedes copiar y pegar los tres controles; recuerda que los pegados reciben otro nombre y debes cambiarlo):
   - **Rectangle** `rectHeaderDetalle`: mismas propiedades que `rectHeader`
   - **Label** `lblTituloDetalle`: mismas posiciones y colores que `lblTitulo`, y `Text`: `galSolicitudes.Selected.'Título de Solicitud'`
   - **Button** `btnAtras` (en el lugar del botón "+"): mismas posiciones y colores que `btnNueva`, y:
     - `Text`: `"←"`
     - `OnSelect`:
       ```js
       // Back() vuelve a la pantalla anterior (scrInicio) con la animación inversa a la de llegada
       Back()
       ```

   > `galSolicitudes.Selected` es el registro que el usuario tocó en la galería. Se puede usar desde cualquier pantalla de la app.

### Tarea 3.2 — Formulario de detalle

1. Inserta un control **Edit form**, renómbralo `frmDetalle`:
   - `DataSource`: `'Solicitudes TI'`
   - `DefaultMode`: `FormMode.View`
   - `Item`: `galSolicitudes.Selected`
   - `X`: `0`, `Y`: `80`, `Width`: `App.Width`, `Height`: `App.Height - 160`

2. Agrega los mismos campos del formulario anterior más estos adicionales:
   - **Estado**
   - **Fecha Resolución**
   - **Asignado a**

### Tarea 3.3 — Botón de edición y guardado

1. Inserta **tres botones** debajo del formulario. Cada uno se muestra u oculta según el modo del formulario (`frmDetalle.Mode`), así no hace falta ninguna variable:

   - `btnEditar` — visible en modo View:
     - `Text`: `"Editar"`
     - `OnSelect`: `EditForm(frmDetalle)`
     - `Visible`: `frmDetalle.Mode = FormMode.View`

   - `btnGuardarDetalle` — visible en modo Edit:
     - `Text`: `"Guardar cambios"`
     - `OnSelect`: `SubmitForm(frmDetalle)`
     - `Visible`: `frmDetalle.Mode = FormMode.Edit`

   - `btnCancelarEdicion` — visible en modo Edit:
     - `Text`: `"Cancelar"`
     - `OnSelect`:
       ```js
       // ResetForm descarta los cambios sin guardar; ViewForm vuelve el formulario a solo lectura
       ResetForm(frmDetalle);
       ViewForm(frmDetalle)
       ```
     - `Visible`: `frmDetalle.Mode = FormMode.Edit`

   > Los botones visibles en modo Edit pueden ir en la misma posición que `btnEditar`: como nunca se ven a la vez, no se estorban.

2. Configura el `OnSuccess` de `frmDetalle`:
   ```js
   // Solo se ejecuta si Dataverse guardó los cambios: avisa y vuelve a modo lectura
   Notify("Solicitud actualizada.", NotificationType.Success);
   ViewForm(frmDetalle)
   ```

3. Configura el `OnFailure` de `frmDetalle`:
   ```js
   Notify("Error al guardar: " & frmDetalle.Error, NotificationType.Error)
   ```

### Resultado esperado del Ejercicio 3

Al tocar una solicitud en la galería, se abre `scrDetalle` mostrando todos los campos en modo lectura. Al tocar "Editar", los campos se vuelven editables. Al guardar, los cambios se reflejan en Dataverse y el formulario vuelve al modo vista.

### Validación del Ejercicio 3

- [ ] `scrDetalle` muestra los datos de la solicitud seleccionada en galSolicitudes
- [ ] El formulario inicia en modo View (solo lectura)
- [ ] Al presionar Editar, el formulario cambia a modo Edit
- [ ] Los cambios guardados se reflejan en la galería de scrInicio al volver

---

## Ejercicio 4 — Pulir UX y publicar

> **Qué vas a hacer:** Agregar los toques finales de experiencia de usuario y publicar la app.
> **Duración:** 15 min

### Tarea 4.1 — Indicador de prioridad con color

En la galería `galSolicitudes`, agrega un rectángulo de color en el borde izquierdo de cada ítem para indicar visualmente la prioridad:

1. Dentro de la plantilla de `galSolicitudes`, inserta un **Rectangle**, renómbralo `rectPrioridad`:
   - `X`: `0`, `Y`: `0`, `Width`: `6`, `Height`: `Parent.TemplateSize` (dentro de la plantilla, `Parent` es la galería y `TemplateSize` es la altura de cada fila)
   - `Fill`:
     ```js
     // Prioridad es una columna Choice: se compara con su enumeración, no con el texto de la etiqueta
     Switch(
         ThisItem.Prioridad,
         'Prioridad (Solicitudes TI)'.'Crítica', ColorValue("#D13438"),
         'Prioridad (Solicitudes TI)'.Alta,      ColorValue("#FF8C00"),
         'Prioridad (Solicitudes TI)'.Media,     ColorValue("#0078D4"),
         'Prioridad (Solicitudes TI)'.Baja,      ColorValue("#107C10"),
         ColorValue("#CCCCCC")
     )
     ```

### Tarea 4.2 — Separador entre filas de la galería

1. Power Apps no tiene un control de "línea", así que la línea se hace con un rectángulo muy delgado. Dentro de la plantilla de la galería (ícono de lápiz), inserta un **Rectangle** y renómbralo `rectSeparador`:
   - `X`: `0`, `Y`: `Parent.TemplateSize - 1`, `Width`: `Parent.Width`, `Height`: `1`
   - `Fill`: `ColorValue("#E0E0E0")` (gris claro)

### Tarea 4.3 — Publicar la aplicación

1. Guarda la app: selecciona el ícono **Save** (guardar) arriba a la derecha.

2. Selecciona el ícono **Publish** (publicar), al lado de **Save**.

3. Selecciona **Publish this version** (publicar esta versión).

4. Para compartir la app con otros usuarios:
   - En [make.powerapps.com](https://make.powerapps.com), selecciona **Apps**, luego tu app `SIT Solicitudes Internas`, y **Share** (compartir)
   - Escribe el nombre o correo de los usuarios de tu organización
   - Asegúrate de que tengan también permisos sobre tus tablas de Dataverse (la de solicitudes y la de categorías) a través de Security Roles

### Resultado esperado del Ejercicio 4

La app está publicada. Los ítems de la galería muestran la barra de color lateral según prioridad. La app es funcional y reproducible en móvil.

### Validación del Ejercicio 4

- [ ] Las solicitudes Críticas muestran barra roja, Altas naranja, Medias azul, Bajas verde
- [ ] La app está publicada y accesible desde [make.powerapps.com](https://make.powerapps.com) → **Apps**
- [ ] La app funciona en modo Preview (F5) sin errores en la barra de fórmulas

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| La galería muestra "Error de delegación" (línea azul) | La fórmula `Filter` usa una función no delegable | Usa solo operadores delegables (`=`, `<>`, `And`, `Or`). Evita `Len()`, `Trim()` o `Text()` aplicadas a la columna en Filter |
| `galSolicitudes.Selected` está vacío en scrDetalle | El usuario fue a scrDetalle sin seleccionar nada en la galería | Agrega un guard: verifica que `galSolicitudes.Selected` no sea vacío antes de navegar |
| El formulario no guarda (OnSuccess no se dispara) | Campos Required del formulario están vacíos | Revisa en la barra de errores del formulario qué campos faltan |
| La tarjeta de Categoría (columna Lookup) no muestra el nombre de la categoría, o muestra un código largo | El cuadro de selección (*Combo box*) de la tarjeta no está mostrando la columna correcta de la tabla **Categorías** | Selecciona la tarjeta de Categoría y, dentro de ella, el *Combo box*. En el panel de propiedades, en **Fields**, selecciona **Edit** y en **Primary text** elige la columna **Nombre** (la columna principal de Categorías en el Lab 02). Si no te deja cambiarlo, desbloquea antes la tarjeta (**Advanced** > **Unlock to change properties**) |
| La app no carga datos después de publicar | El usuario no tiene permisos sobre las tablas de Dataverse | El administrador debe agregar el Security Role apropiado al usuario |
| `ColorValue()` muestra error en versiones antiguas | La función requiere el formato `#RRGGBB` exacto | Usa `RGBA(0, 120, 212, 1)` como alternativa si `ColorValue()` falla |

---

## Checklist final

- [ ] La app tiene 3 pantallas: `scrInicio`, `scrNueva`, `scrDetalle`
- [ ] `scrInicio` muestra la galería con buscador y filtro por estado funcionando
- [ ] El contador de registros se actualiza al filtrar
- [ ] `scrNueva` permite crear registros y vuelve a `scrInicio` tras guardar
- [ ] `scrDetalle` muestra el registro seleccionado en modo View y permite editar
- [ ] Las solicitudes críticas tienen barra roja lateral en la galería
- [ ] La app está publicada correctamente
- [ ] No hay errores (triángulo rojo) en la barra de fórmulas

---

## Evidencia esperada

- Captura de las 3 pantallas (`scrInicio`, `scrNueva`, `scrDetalle`) en funcionamiento
- Captura del buscador/filtro de `scrInicio` con el contador de registros actualizado
- Captura de una solicitud crítica mostrando la barra roja lateral
- Captura de la barra de fórmulas sin triángulo rojo (0 errores) antes de publicar

## Criterios de aprobación

- Las 3 pantallas navegan correctamente entre sí (crear → volver a inicio, ver → editar)
- El filtro y buscador de `scrInicio` devuelven resultados correctos con datos reales
- La app está publicada sin errores de fórmula
- 100% de los ítems del Checklist final marcados

## Reto adicional

**Reto básico:** Agrega un **badge de conteo** en el botón "+" del encabezado de `scrInicio` que muestre cuántas solicitudes tienen prioridad **Crítica** y estado **Nueva**. Usa `CountIf()` y compara cada columna Choice con su enumeración (por ejemplo `'Estado (Solicitudes TI)'.Nueva`), no con texto.

**Reto intermedio:** Agrega una cuarta pantalla `scrFiltros` accesible desde `scrInicio` que permita filtrar por Categoría además del estado. Para el Dropdown de categorías usa `Items`: `Categorías` (la tabla del Lab 02) y en su propiedad `Value` elige `Nombre`, para que muestre el nombre de cada categoría. Guarda la categoría elegida con `Set()` (una variable global), no con `UpdateContext()`: una variable de contexto solo existe en la pantalla donde se creó, y aquí la eliges en `scrFiltros` pero la usas en `galSolicitudes`, que está en `scrInicio`.

**Reto avanzado:** Implementa **modo oscuro** con un toggle en el encabezado. Usa una variable global `gblModoOscuro` (tipo booleano) y condiciones en los colores de fondo y texto de todos los controles. El modo se debe persistir mientras la app está abierta.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre `Navigate(scrX, ScreenTransition.Cover)` y `Navigate(scrX, ScreenTransition.UnCover)`?
2. ¿Cuándo usarías `UpdateContext()` vs `Set()` para almacenar una variable?
3. ¿Por qué se recomienda usar `Filter()` en lugar de recorrer todos los registros con `ForAll()` para grandes volúmenes de datos?
4. ¿Qué significa la advertencia de delegación (línea azul bajo una fórmula) y cuál es su impacto en producción?

---

## Limpieza del laboratorio

> Conserva la app si vas a continuar con el Lab 05 — la integrarás con Power Automate.

Para eliminar la app si es necesario: [make.powerapps.com](https://make.powerapps.com) → **Apps** → selecciona `SIT Solicitudes Internas` → **Delete** (eliminar).

---

## Siguiente laboratorio recomendado

➡️ **Lab 05 — Power Automate: Notificación y Aprobación de Solicitudes**

**Por qué ir ahí:** Automatizarás lo que ahora es manual: cuando se crea una solicitud desde la app del Lab 03, el solicitante recibirá confirmación automática por email y las solicitudes críticas dispararán un proceso de aprobación.
