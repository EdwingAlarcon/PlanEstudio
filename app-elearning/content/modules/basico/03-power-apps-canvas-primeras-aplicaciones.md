---
moduleId: 3
title: "Power Apps Canvas - Primeras Aplicaciones"
level: "basico"
certification: "PL-900"
estimatedMinutes: 25
practiceMinutes: 100
slug: "power-apps-canvas-primeras-aplicaciones"
lastVerified: "2026-11"
---
*Duración: 2-3 semanas · Lectura: 8-12 min · Con práctica: unos 100 min con el ambiente listo; la primera vez, cuenta entre el doble y el triple (solo el Núcleo obligatorio; la Profundización opcional suma tiempo aparte)*

### 🎯 Objetivo
Crear aplicaciones Canvas desde cero con controles, navegación y conexión a datos.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Una Canvas App funcional de 3 pantallas conectada a Dataverse, con lista, búsqueda, creación y edición de registros.

### 🔧 Qué queda para después (Profundización opcional)
- Modo oscuro, Collections en memoria, una segunda app (calculadora de presupuestos) y diseño responsive. No son necesarios para tener tu primera app funcionando — puedes volver a esto en otra sesión, incluso después del Módulo 07 de Power Fx.

### 📖 Conceptos Clave
- **Canvas vs Model-Driven**: Diferencias conceptuales y casos de uso
    - *Canvas app*: app que empiezas desde un lienzo en blanco y diseñas pantalla por pantalla, como una presentación de PowerPoint; tú decides dónde va cada cosa.
    - *Model-driven app*: app que se construye a partir de tus tablas de Dataverse; Power Apps genera la interfaz (formularios, vistas) por ti.
- **Controles**: Input, Label, Button, Gallery, Forms, Media
    - *Control*: cada pieza que pones en una pantalla (un cuadro de texto, un botón, una lista).
    - *Input* (por ejemplo, *Text input*): cuadro donde la persona escribe.
    - *Label*: texto que la app muestra, como un título o un dato de la tabla.
    - *Button*: botón que hace algo cuando lo pulsas.
    - *Gallery*: lista que repite el mismo diseño para cada registro de una tabla.
    - *Form* (*Edit form* / *Display form*): formulario para ver, editar o crear un registro.
    - *Media*: imágenes, video o audio que agregas a la app.
- **Propiedades**: Sintaxis de fórmulas, referencias a controles
    - *Property*: cada ajuste de un control (su texto, su color, qué pasa al pulsarlo); se elige en la lista de propiedades y se escribe en la barra de fórmulas.
- **Datasources**: Dataverse, SharePoint, Excel, SQL, Conectores
    - *Data source*: el lugar de donde la app lee y donde guarda los datos (por ejemplo, una tabla de Dataverse).
    - *Connector*: el "enchufe" que deja a la app hablar con un servicio como SharePoint, SQL Server u Outlook.
- **Contexto**: Variables globales vs locales, Collections
    - *Global variable* (se crea con `Set`): un dato que la app recuerda y que puedes usar en cualquier pantalla.
    - *Context variable* (se crea con `UpdateContext`): un dato que solo existe dentro de una pantalla.
    - *Collection*: una tabla temporal que la app guarda en memoria mientras está abierta.
- **Navegación**: Screens, Navigate(), Back()
    - *Screen*: cada pantalla de la app; dentro de ella van los demás controles.
    - *Navigate()*: cambia la pantalla que se ve.
    - *Back()*: vuelve a la pantalla que se vio justo antes.
- **Delegación**: Límite de 500 registros, funciones delegables
    - *Delegation*: que el servidor (Dataverse) haga el filtro; si no se puede, la app solo revisa los primeros 500 registros (se puede subir hasta 10.000 en **Settings**).
- **Responsive Design**: Scaling, orientación
    - *Responsive design*: que la app se acomode al tamaño de la pantalla del equipo donde se abre.
    - *Scale to fit*: opción que agranda o achica la app entera para que quepa en el espacio disponible.
    - *Orientation*: si la app se ve en vertical u horizontal.
- **Temas (Themes)**: Branding corporativo
    - *Theme*: un juego de colores que se aplica a toda la app de una sola vez.

> **🧭 Antes de continuar: mini-guía Power Fx para este módulo**
>
> Este módulo usa fórmulas de Power Fx (el lenguaje de expresiones de Power Apps) antes de que el
> **Módulo 07 lo explique formalmente**. Con estas cinco ideas puedes seguir las prácticas de hoy;
> el Módulo 07 profundiza en sintaxis, tipos de datos y todas las funciones disponibles.
>
> - **Fórmula**: una expresión que calcula un valor o ejecuta una acción, similar a Excel. Se
>   escribe en la barra de fórmulas de una propiedad del control (ej. `Text`, `Items`, `OnSelect`).
> - **Función**: una palabra reservada que hace algo con datos, como `Filter()` (filtra una tabla) o
>   `Search()` (busca texto dentro de una tabla). Siempre va seguida de paréntesis con sus argumentos.
> - **Propiedad**: un atributo configurable de un control (ej. `Items` define qué datos muestra una
>   Gallery, `OnSelect` define qué pasa al hacer clic). Cada control tiene su propio set de propiedades.
> - **Buscar vs. filtrar**: `Search(tabla, texto, columnas...)` busca coincidencias de texto en una o
>   más columnas; `Filter(tabla, condición)` devuelve solo las filas que cumplen una condición lógica
>   exacta (ej. `Estado = 'Estado (Solicitudes TI)'.Nueva`). Las columnas de tipo *Choice* (como
>   Estado) no se comparan con el texto de la etiqueta (`"Nueva"`), sino con su *enumeración*: el
>   nombre de la opción precedido del nombre de la elección; escribe `'Estado (` en la barra de
>   fórmulas y elige lo que te propone. **Plan B:** si al escribir `'Estado (` no aparece ninguna
>   sugerencia, probablemente creaste Estado como elección *global* (con **Sync with global choice?**
>   en **Yes**). En ese caso la enumeración se llama igual que la elección global: escribe su nombre
>   (por ejemplo `Estado.` o el nombre que le pusiste) y elige la opción en la lista que aparece.
>   `Distinct(tabla, columna)` devuelve los valores únicos de una
>   columna, útil para poblar un Dropdown de opciones sin repetir.
> - **Delegación**: cuando la tabla vive en Dataverse (no en memoria), Power Apps intenta traducir tu
>   fórmula en una consulta que el servidor ejecuta completa. Si la función no es delegable, Power Apps
>   solo trae los primeros 500 registros (límite que se puede subir hasta 10.000) y filtra sobre eso — por eso verás una advertencia (línea
>   azul) en algunas fórmulas de este módulo. El Módulo 07 explica cómo identificar y resolver esto.
>
> Cada bloque de código de este módulo trae comentarios `//` explicando línea por línea qué hace.

> **📒 Palabras que vas a ver en las fórmulas de hoy**
>
> - **`ThisItem`**: dentro de una Gallery o un formulario, es "el registro de esta fila". `ThisItem.'Título de Solicitud'` es el título de la solicitud que se está mostrando en esa fila.
> - **`Selected`**: el registro que el usuario tocó en una Gallery. `galSolicitudes.Selected` es la solicitud elegida.
> - **`AllItems`**: las filas que la Gallery tiene cargadas. Ojo: si hay muchos registros, la Gallery los carga poco a poco, así que puede tener menos filas que el total de la tabla.
> - **`ScreenTransition`**: la animación al cambiar de pantalla. Valores posibles: `Cover`, `CoverRight`, `Fade`, `None`, `UnCover` y `UnCoverRight`. `Back()` vuelve a la pantalla anterior con la animación inversa.
> - **`FormMode`**: el modo de un formulario: `FormMode.New` (registro nuevo, vacío), `FormMode.Edit` (editar uno que existe) y `FormMode.View` (solo lectura).
> - **`NotificationType`**: el tipo de mensaje que muestra `Notify()` arriba de la pantalla: `Error`, `Information`, `Success` o `Warning`.
> - **`Visible`**: propiedad de casi todos los controles; si vale `false`, el control no se ve.
> - **`User()`**: datos de la persona que abrió la app. `User().FullName` es su nombre y `User().Email` su correo de inicio de sesión (el nombre de usuario con el que entra a Microsoft 365).

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

*Completa esto primero. Es tu primera app funcional de principio a fin.*

> **Cómo está organizado el Núcleo:** construyes la app en tres bloques (lista, creación, detalle). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu propia app para guardar. Cierras con un reto en el que ya no te digo las fórmulas. Las microprácticas no necesitan *tenant* (la cuenta de tu organización en Microsoft 365, con la que entras a Power Apps); construir la app sí (tu ambiente del curso del Módulo 1 y la tabla del Módulo 2). Si aún no tienes tenant, usa la "Variante sin tenant" del Lab 03. **Esta app es la tuya del Módulo 2:** usa la tabla **Solicitud TI** que creaste allí (si hiciste el Lab 02, en ese lab Categoría es una búsqueda a otra tabla; aquí seguimos la versión del Módulo 2, donde Categoría es una columna *Choice*). **Nombres:** en las fórmulas la tabla se escribe por su nombre en plural, `'Solicitudes TI'`, y sus columnas por el nombre que les diste en el Módulo 2 (por ejemplo, `'Título de Solicitud'`, con comillas simples porque tiene espacios). Los controles se nombran con un prefijo de tipo, igual que en el Lab 03: `scr` para pantallas (`scrInicio`), `gal` para galerías (`galSolicitudes`), `txt` para cuadros de texto (`txtBusqueda`), `frm` para formularios (`frmNueva`) y `btn` para botones (`btnGuardar`). Para cambiar el nombre de un control: en el panel **Tree view** (izquierda), pasa el mouse sobre el control, selecciona **⋯** y luego **Rename**.

## 🧩 Microlección 1 — La pantalla de lista: Gallery y búsqueda

**¿Qué vas a aprender?** Cómo una Gallery muestra los registros de una tabla y cómo una fórmula `Search` o `Filter` decide cuáles ver.

**¿Por qué existe esto?** Una lista que muestra todo, sin poder buscar, no sirve en cuanto hay más de unas decenas de registros. La fórmula de la propiedad `Items` es lo que conecta la pantalla con los datos.

**Ejemplo pequeño:** `Search('Solicitudes TI', txtBusqueda.Text, 'Título de Solicitud')` devuelve solo las solicitudes cuyo título contiene lo que escribes; si el cuadro está vacío, devuelve todas.

**Ahora haz algo — micropráctica (6 min):** **[Elegir la fórmula de filtro correcta](/practica/ip-app-001-formula-filtro-productos)**. Te da una necesidad de búsqueda o filtro y te pide elegir la fórmula adecuada, con feedback inmediato.

**Práctica real en tu entorno (30 min):** haz los Pasos 1 y 2 de abajo.

##### Práctica 3.1: Primera Canvas App - Lista de Solicitudes TI

*Objetivo: una app de solicitudes de soporte TI conectada a tu tabla de Dataverse*

> **Cómo leer los pasos:** cuando diga "en la lista de propiedades elige `Items` y escribe...", significa: selecciona el control en la pantalla, abre la lista desplegable de propiedades que está a la izquierda de la barra de fórmulas (arriba), elige esa propiedad y escribe la fórmula en la barra de fórmulas. Para probar la app sin salir del editor, pulsa **F5** (vista previa); para volver, pulsa **Esc**.

> **Idioma de los menús:** los pasos usan los nombres en inglés (**Insert**, **Tree view**, **Add data**...). Si tu Power Apps Studio está en español, busca el equivalente con el mismo significado (por ejemplo, **Insert** = **Insertar**). Los nombres de funciones y propiedades (`Items`, `OnSelect`, `Filter`) **no** se traducen: se escriben siempre igual.

> **Controles clásicos o modernos:** Power Apps tiene dos familias de controles. Este módulo usa los **clásicos**, porque sus propiedades (`.Text`, `HintText`, `AllowEmptySelection`, `DefaultDate`) son las que aparecen en las fórmulas. Si al buscar en **Insert** ves una categoría **Classic**, inserta desde ahí el *Text input*, el *Drop down*, el *Date picker* y el *Button*. Si no ves esa categoría, los controles que te aparecen ya son los clásicos.

**Paso 1: Configuración inicial**

1. Entra a [make.powerapps.com](https://make.powerapps.com) y comprueba que estás en tu ambiente del curso del Módulo 1 (el ambiente se cambia desde la página de inicio de Power Apps, antes de abrir la app).
2. En el panel de navegación de la izquierda, selecciona **Create** y luego **Create from blank**.
3. En el cuadro **Start with a blank canvas**, elige **Tablet size**.
4. Si te pide un nombre, escribe `Mi App Solicitudes` y selecciona **Create**. Se abre Power Apps Studio con una pantalla vacía llamada **Screen1**.
5. Cambia el nombre de la pantalla: en el panel **Tree view**, pasa el mouse sobre **Screen1**, selecciona **⋯** > **Rename** y escribe `scrInicio`.
6. Conecta la tabla del Módulo 2:
    1. En el menú de la izquierda, selecciona **Data**.
    2. Arriba del panel **Data**, selecciona **Add data**.
    3. En el cuadro de búsqueda escribe `Solicitud`. Si aparece tu tabla **Solicitud TI**, selecciónala.
    4. Si no aparece, escribe `Dataverse` en el cuadro de búsqueda, selecciona el conector **Microsoft Dataverse** y elige tu tabla en la lista.
7. Comprueba que la tabla quedó en el panel **Data**. Si no la encuentras, casi siempre es porque estás en otro ambiente: vuelve al punto 1.

**Paso 2: Pantalla de Listado**

1. **Cuadro de búsqueda**
    1. Con `scrInicio` seleccionada, selecciona **Insert** (en la barra de comandos de arriba o en el menú de la izquierda).
    2. En el cuadro de búsqueda del panel **Insert**, escribe `Text input` y selecciónalo. Aparece un cuadro de texto en la pantalla.
    3. Arrástralo a la parte de arriba de la pantalla.
    4. Cámbiale el nombre a `txtBusqueda` (**Tree view** > **⋯** > **Rename**).

2. **Gallery (la lista)**
    1. Selecciona **Insert**, escribe `Vertical gallery` en el cuadro de búsqueda y selecciónala.
    2. Arrástrala debajo del cuadro de búsqueda y agrándala desde las esquinas para que ocupe el resto de la pantalla.
    3. Cámbiale el nombre a `galSolicitudes`.
    4. En la pestaña **Properties** del panel de la derecha, abre la lista **Items** y elige tu tabla **Solicitudes TI** ([Learn: agregar una galería](https://learn.microsoft.com/power-apps/maker/canvas-apps/add-gallery)). Si tu panel muestra esa lista con el nombre **Data source**, es la misma. La lista se llena con tus registros.
    5. En la lista **Layout** del mismo panel, elige un diseño que tenga **tres textos por fila** (título, subtítulo y cuerpo). Lo necesitas para el punto 3. Si no encuentras uno así, en el punto 3 te digo cómo agregar la etiqueta que falte.

3. **Qué muestra cada fila.** La primera fila de la Gallery es la *plantilla*: lo que cambies en ella se repite en todas las filas.
    - Para encontrar las etiquetas: en **Tree view**, expande `galSolicitudes` (flecha a la izquierda de su nombre). Verás las etiquetas de la plantilla, con nombres como `Title1`, `Subtitle1` y `Body1` (el número puede cambiar). Haz clic en cada una para seleccionarla.
    - Si te falta una etiqueta: selecciona la primera fila de la Gallery (aparece un ícono de lápiz arriba a la izquierda; haz clic en él), luego **Insert** > `Label`. La etiqueta queda dentro de la plantilla.
    - Con cada etiqueta seleccionada, en la lista de propiedades elige `Text` y escribe:
        - Etiqueta del título (`Title1`): `ThisItem.'Título de Solicitud'`
        - Etiqueta del subtítulo (`Subtitle1`): `ThisItem.Categoría`
        - Etiqueta del cuerpo (`Body1`): `Text(ThisItem.'Fecha Solicitud', "dd/mm/yyyy")` (en `Text`, `mm` junto a `dd` y `yyyy` es el mes)

4. **Fórmula de búsqueda.** Selecciona la Gallery completa (en **Tree view**, haz clic en `galSolicitudes`, no en una etiqueta de dentro). En la lista de propiedades elige `Items` y reemplaza lo que haya por:
   ```javascript
   // Search(tabla, texto a buscar, columnas donde buscar...)
   // Busca lo escrito en txtBusqueda dentro del título y la descripción; si el cuadro está vacío, devuelve todo
   Search(
       'Solicitudes TI',
       txtBusqueda.Text,
       'Título de Solicitud', Descripción
   )
   ```
   > **Comillas: regla para todo el curso.** Las comillas **simples** (`'Título de Solicitud'`) encierran *nombres* (de tablas, columnas o controles) que tienen espacios o tildes. Las comillas **dobles** (`"Nueva"`) encierran *texto*. Si en otros materiales ves columnas de `Search` entre comillas dobles, como `"sit_titulo"`, es la forma antigua (antes de la versión 3.24042 de Power Apps). Hoy las columnas se escriben por su nombre, sin comillas dobles.

5. **Botón "Nueva Solicitud"**
    1. Selecciona **Insert**, escribe `Button` y selecciónalo. Colócalo arriba, junto al cuadro de búsqueda.
    2. Cámbiale el nombre a `btnNueva`.
    3. En el panel de propiedades de la derecha, cambia su texto a `Nueva Solicitud`.
    4. Su `OnSelect` lo configuras al final del Paso 3, cuando ya exista la pantalla a la que lleva.

6. **Prueba:** pulsa **F5**, escribe en el cuadro de búsqueda una palabra que sepas que está en un título y mira cómo cambia la lista. Pulsa **Esc** para volver al editor.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| La fórmula exacta de `Items` de tu Gallery | ___ |
| Cuántas filas muestra la Gallery con el buscador vacío y cuántas al escribir una palabra que sabes que existe (di la palabra) | ___ |
| ¿Apareció la línea azul de delegación en alguna fórmula? ¿En cuál? | ___ |

---

## 🧩 Microlección 2 — Crear un registro: formulario y navegación

**¿Qué vas a aprender?** Cómo un Form guarda un registro nuevo en Dataverse y cómo se pasa de una pantalla a otra con `Navigate`.

**¿Por qué existe esto?** Crear datos es la mitad de una app. El punto delicado es *cuándo* navegar: si la app cambia de pantalla antes de saber que el guardado funcionó, el usuario cree que guardó algo que no se guardó.

**Ejemplo pequeño:** `SubmitForm(frmNueva)` envía los valores a Dataverse; `Navigate(scrInicio, ScreenTransition.UnCover)` vuelve a la pantalla de lista. Para cambiar de pantalla solo cuando el guardado salió bien, ese `Navigate` va en la propiedad `OnSuccess` del formulario.

**Ahora haz algo — micropráctica (6 min):** **[Navegación y formulario](/practica/ip-app-002-navegacion-formulario)**. Te pide decidir cómo conectar el formulario, el botón y la navegación entre pantallas.

**Práctica real en tu entorno (20 min):** haz el Paso 3 de abajo.

**Paso 3: Pantalla de Creación**

1. **Pantalla nueva**
    1. En la barra de comandos de arriba, selecciona **New screen** y elige **Blank**. Aparece una pantalla vacía en **Tree view**.
    2. Cámbiale el nombre a `scrNueva`.

2. **Formulario**
    1. Con `scrNueva` seleccionada, selecciona **Insert**, escribe `Edit form` en el cuadro de búsqueda y selecciónalo.
    2. Agrándalo para que ocupe casi toda la pantalla (deja espacio abajo para dos botones).
    3. Cámbiale el nombre a `frmNueva`.
    4. En el panel de propiedades de la derecha, abre **Data source** y elige **Solicitudes TI**.
    5. En el mismo panel, selecciona **Edit fields**. En el panel **Fields**, selecciona **Add field**, marca **Título de Solicitud**, **Descripción**, **Categoría** y **Prioridad**, y selecciona **Add**. Si ya aparecían otros campos, puedes dejarlos.
    6. En la lista de propiedades elige `DefaultMode` y escribe `FormMode.New`. Así el formulario arranca vacío, listo para un registro nuevo (en modo *New* no hace falta configurar `Item`: el formulario usa los valores por defecto de la tabla).

3. **Botones Guardar y Cancelar.** Inserta dos botones (**Insert** > `Button`), colócalos debajo del formulario, cámbiales el nombre a `btnGuardar` y `btnCancelar`, y su texto a `Guardar` y `Cancelar`.
    - `OnSelect` de **btnGuardar**:
   ```javascript
   // SubmitForm() revisa los campos requeridos y envía el registro a Dataverse.
   // Aquí NO navegamos: todavía no sabemos si se guardó.
   SubmitForm(frmNueva)
   ```
    - Selecciona el formulario `frmNueva`, en la lista de propiedades elige `OnSuccess` y escribe:
   ```javascript
   // OnSuccess solo se ejecuta cuando Dataverse confirmó que guardó el registro
   Navigate(scrInicio, ScreenTransition.UnCover)
   ```
    - Con `frmNueva` seleccionado, elige `OnFailure` y escribe:
   ```javascript
   // OnFailure se ejecuta si no se pudo guardar (por ejemplo, un campo requerido vacío):
   // muestra el motivo y deja al usuario en esta pantalla para que lo corrija
   Notify("No se pudo guardar: " & frmNueva.Error, NotificationType.Error)
   ```
    - `OnSelect` de **btnCancelar**:
   ```javascript
   // ResetForm() descarta lo que se escribió y deja el formulario como estaba
   ResetForm(frmNueva);
   // Vuelve a la pantalla de inicio con transición inversa a como se navegó aquí
   Navigate(scrInicio, ScreenTransition.UnCover)
   ```

4. **Conecta el botón de la lista.** Vuelve a `scrInicio` (haz clic en ella en **Tree view**), selecciona `btnNueva` y, en la lista de propiedades, elige `OnSelect`:
   ```javascript
   // NewForm() deja el formulario vacío otra vez: después de guardar, el formulario
   // pasa solo a modo Edit, así que hay que volver a ponerlo en modo New cada vez
   NewForm(frmNueva);
   Navigate(scrNueva, ScreenTransition.Cover)
   ```

5. **Prueba:** pulsa **F5**, crea una solicitud y comprueba que aparece en la lista. Después intenta guardar otra dejando vacía la **Categoría** (requerida desde el Módulo 2). Pulsa **Esc** para volver.

**Ahora diagnostica — micropráctica (6 min):** **[Diagnosticar: el formulario "guardó" pero el registro no aparece](/practica/ip-app-007-formulario-no-guarda)**. Parte de un síntoma exacto —el usuario ve la lista sin su registro y ningún error— y te pide la causa antes de ver la solución. Es el error del Paso 3 más común.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El `OnSelect` exacto de tu botón Guardar | ___ |
| Qué pasó al guardar con un campo requerido vacío (¿cambió de pantalla? ¿viste un error?) | ___ |
| Nombre del registro nuevo que aparece en Dataverse después de guardar bien | ___ |

---

## 🧩 Microlección 3 — Detalle y edición de un registro

**¿Qué vas a aprender?** Cómo una pantalla de detalle muestra el registro que elegiste en la lista y cómo se pasa a modo edición.

**¿Por qué existe esto?** Casi toda app de datos sigue el mismo trío: lista, crear y ver/editar. Si entiendes cómo la pantalla de detalle sabe *qué* registro mostrar, puedes armar la mayoría de las apps sencillas.

**Ejemplo pequeño:** el Form de detalle usa `galSolicitudes.Selected` como `Item`: lo que seleccionaste en la lista es lo que ves en el detalle.

**Práctica real en tu entorno (20 min):** haz el Paso 4 de abajo.

**Paso 4: Pantalla de Detalles**

1. **Pantalla nueva:** en la barra de comandos, selecciona **New screen** > **Blank** y cambia el nombre de la pantalla a `scrDetalle`.

2. **Formulario de detalle**
    1. Selecciona **Insert**, escribe `Edit form` y selecciónalo. Agrándalo y cámbiale el nombre a `frmDetalle`.
    2. En el panel de propiedades, abre **Data source** y elige **Solicitudes TI**.
    3. Selecciona **Edit fields** > **Add field**, marca los mismos campos del Paso 3 y además **Estado**, y selecciona **Add**.
    4. En la lista de propiedades elige `Item` y escribe `galSolicitudes.Selected` (el registro que se tocó en la lista).
    5. Elige `DefaultMode` y escribe `FormMode.View` (modo lectura: se ve, pero no se puede escribir).

3. **Botones.** Inserta tres botones debajo del formulario, con estos nombres, textos y `OnSelect`:
    - `btnEditar` (texto `Editar`): `EditForm(frmDetalle)` — pasa el formulario a modo edición.
    - `btnGuardarDetalle` (texto `Guardar`): `SubmitForm(frmDetalle)` — guarda los cambios.
    - `btnVolver` (texto `Volver`): `Back()` — regresa a la pantalla anterior.

    Después selecciona `frmDetalle`, elige `OnSuccess` y escribe `ViewForm(frmDetalle)`, para que vuelva a modo lectura cuando el guardado salga bien.

4. **Navegación desde la lista.** Vuelve a `scrInicio`, selecciona la Gallery completa (`galSolicitudes` en **Tree view**, no una etiqueta de dentro) y, en la lista de propiedades, elige `OnSelect`:
   ```javascript
   // Al tocar una fila, la Gallery recuerda ese registro (galSolicitudes.Selected) y vamos al detalle
   Navigate(scrDetalle, ScreenTransition.Cover)
   ```

5. **Prueba:** pulsa **F5**, toca una solicitud, pulsa **Editar**, cambia la descripción, pulsa **Guardar** y luego **Volver**. Abre otra solicitud y comprueba que el detalle cambia.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El `Item` exacto que usaste en el Form de detalle | ___ |
| Qué ves en el detalle si abres un registro distinto al anterior | ___ |
| Las pantallas que tiene tu app y cómo navegas de una a otra | ___ |

---

## 🔁 Reto de transferencia — La app del técnico, sin pasos

Esta vez no te digo las fórmulas: aplica lo que viste a un cambio de requisito.

> **Requerimiento:** los técnicos de soporte usarán tu app desde su equipo y cada uno debe ver **solo las solicitudes asignadas a él**, con un contador arriba que diga "Mis pendientes: N".
> **Criterios de aceptación:** (1) la Gallery muestra únicamente las solicitudes asignadas a quien abre la app; (2) el contador cuenta lo que la Gallery muestra, no toda la tabla; (3) el buscador sigue funcionando sobre esa lista ya filtrada.
> **Restricciones:** no crees una app distinta por técnico, y no ocultes filas con `Visible = false` (los datos de los demás seguirían cargados).
> **Pistas si te atoras:**
> 1. **Prepara datos de prueba primero.** Si ninguna solicitud está asignada a ti, la lista filtrada saldrá vacía y no sabrás si la fórmula funciona. Abre 2 o 3 solicitudes en Dataverse (o en tu formulario de detalle, si agregaste el campo) y pon tu propio usuario en **Asignado a**.
> 2. `'Asignado a'` es una columna *Lookup* a la tabla de usuarios (**User**). No guarda texto, guarda un usuario; por eso no se compara directo con un correo. Se compara una columna de ese usuario: su correo, que en la tabla de usuarios se llama **Primary Email**. Se escribe `'Asignado a'.'Primary Email'`.
> 3. `User().Email` devuelve el correo con el que la persona inició sesión. Compáralos así: `'Asignado a'.'Primary Email' = User().Email`. Si la lista sale vacía aunque tengas solicitudes asignadas, pon una etiqueta temporal con `User().Email` en su `Text` y compárala con el **Primary Email** de tu usuario: en algunas organizaciones el nombre de inicio de sesión y el correo no son iguales.
> 4. Para que el buscador siga funcionando, pon el filtro **dentro** del `Search`: primero filtras, y sobre ese resultado buscas. La estructura es `Search(Filter('Solicitudes TI', condición), txtBusqueda.Text, 'Título de Solicitud', Descripción)`.
> 5. Para contar las filas de una Gallery se usa `CountRows(galSolicitudes.AllItems)` (aparece completo en la Práctica 3.2, que es opcional). Si `Asignado a` no aparece en tu formulario, no importa: el filtro se aplica a la tabla, no al formulario.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: cada técnico ve solo lo suyo](/practica/ip-app-008-transferir-solo-lo-asignado)**. Retoma la app de este módulo pero cambia un requisito, y te pide decidir qué cambia.

**Si aún no tienes tenant:** escribe las dos fórmulas que usarías (la de `Items` y la del contador) y explica con tus palabras por qué ocultar filas no es lo mismo que filtrarlas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula exacta de `Items` de la Gallery filtrada | ___ |
| La fórmula del contador y el número que mostró | ___ |
| Qué hiciste para que el buscador siguiera funcionando sobre la lista filtrada | ___ |

#### 🔧 Profundización opcional

> Si estás empezando desde cero, completa primero el Núcleo obligatorio de arriba y guarda tu evidencia. Esta sección — filtros avanzados, modo oscuro, Collections, una segunda app y diseño responsive — puedes hacerla después, incluso después del Módulo 07 de Power Fx. No es requisito para avanzar al Módulo 4.

##### Práctica 3.2: Interactividad y Variables

*Agregar filtros dinámicos*

1. **Insertar Dropdown para filtrar por Estado** (nómbralo `drpEstado`)
   ```javascript
   // Items del Dropdown: Distinct devuelve una tabla de una columna llamada Value
   // con cada opción de Estado una sola vez (pon AllowEmptySelection en true para poder dejarlo vacío)
   Distinct('Solicitudes TI', Estado)
   
   // Actualizar Items del Gallery
   // drpEstado.Selected.Value ya es la opción de Estado (no su texto), así que se compara directo con la columna
   Filter(
       'Solicitudes TI',
       IsBlank(drpEstado.Selected) || Estado = drpEstado.Selected.Value
   )
   ```

2. **Contador de solicitudes**
    - Insertar Label
    - Text: `"Total: " & CountRows(galSolicitudes.AllItems)`

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
   // ClearCollect(nombreColeccion, registro1, registro2, ...) vacía y llena una tabla en memoria (Collection)
   // Cada { } es un registro con sus columnas; a diferencia de Dataverse, vive solo en el dispositivo
   ClearCollect(
       ColPresupuestoItems,
       {Item: "Laptops", Cantidad: 0, PrecioUnit: 1200, Total: 0},
       {Item: "Monitores", Cantidad: 0, PrecioUnit: 300, Total: 0},
       {Item: "Mouses", Cantidad: 0, PrecioUnit: 25, Total: 0}
   )
   ```

2. **Gallery editable con input boxes**
    - Text Input para Cantidad (nómbralo `txtCantidad`)
    - OnChange de Input:
   ```javascript
   // UpdateIf(coleccion, condición, cambios) actualiza solo las filas que cumplen la condición
   // Value() convierte el texto del input a número para poder multiplicar
   UpdateIf(
       ColPresupuestoItems,
       Item = ThisItem.Item,
       {
           Cantidad: Value(txtCantidad.Text),
           Total: Value(txtCantidad.Text) * ThisItem.PrecioUnit
       }
   )
   ```

3. **Label Total General**
   ```javascript
   // Sum(coleccion, columna) suma una columna numérica de todas las filas; Text() la formatea como moneda
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

### 💼 Caso Real de Negocio

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

### ✅ Buenas Prácticas

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

### ⚠️ Errores Comunes

1. **Lo que ves:** la Gallery no muestra todos los datos, o parece cortarse en 500 registros.
    - **Causa**: Función no delegable o limit implícito
    - **Solución**: Usar Filter() con operadores delegables (=, <>, >, <, And, Or)
    - **Check**: Línea azul de delegación warning en formula bar

2. **Lo que ves:** un error de "Name conflict" al referenciar una columna.
    - **Causa**: Columna tiene nombre reservado (ej: Name, Value)
    - **Solución**: Usar comillas simples: `ThisItem.'Name'`

3. **Lo que ves:** el formulario vuelve a la lista como si hubiera guardado, pero el registro no aparece y no hay ningún error visible.
    - **Causa**: `Navigate` va justo después de `SubmitForm` en el botón, así que la app cambia de pantalla sin esperar a saber si el guardado funcionó
    - **Solución**: deja solo `SubmitForm` en el botón y mueve la navegación a las propiedades del formulario:
   ```javascript
   // OnSelect de btnGuardar
   SubmitForm(frmNueva)

   // OnSuccess de frmNueva (solo se ejecuta si se guardó)
   Navigate(scrInicio, ScreenTransition.UnCover)

   // OnFailure de frmNueva (se ejecuta si no se pudo guardar)
   Notify("Error: " & frmNueva.Error, NotificationType.Error)
   ```

4. **Lo que ves:** un valor que guardaste en una variable desaparece al cambiar de pantalla.
    - **Causa**: Usar UpdateContext (local) en lugar de Set (global)
    - **Solución**: Evaluar scope necesario, usar Set para datos persistentes

5. **Lo que ves:** la app tarda mucho en abrir, con la pantalla en blanco o cargando.
    - **Causa**: Queries pesadas en OnStart o OnVisible sin caché
    - **Solución**: Cargar datos críticos en OnStart, lazy load el resto

### 🧪 Criterios de Validación
- [ ] App con mínimo 3 screens conectadas con navegación funcional
- [ ] Gallery mostrando datos de Dataverse con búsqueda/filtros
- [ ] Form para crear y editar registros operativo
- [ ] Uso de mínimo 2 variables (global y contextual)
- [ ] Collection implementada con operaciones CRUD
- [ ] App publicada y compartida con otro usuario de prueba
- [ ] Explicar diferencia entre Canvas y Model-Driven
- [ ] Identificar 3 funciones no delegables y alternativas

> Los primeros 3 criterios (screens, Gallery, Form) corresponden al Núcleo obligatorio. Los demás pertenecen a la Profundización opcional — márcalos cuando vuelvas a esa sección.

### 📸 Evidencia para guardar
- Captura de las 3 pantallas de la app con navegación funcionando.
- Captura del Form guardando un registro nuevo en Dataverse.
- (Opcional, cuando completes la Profundización) captura de la app de calculadora con Collections.

### ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 03 · Primera Canvas App](/labs/lab-03-canvas-primera-app)**

**Por qué:** el Lab 03 es parte del camino de laboratorios. Allí construyes **una app nueva, distinta de la de este módulo**, sobre las tablas que creaste en el Lab 02 (**Solicitudes TI** y **Categorías**; en el Lab 02 la Categoría es una búsqueda a su propia tabla, no una columna *Choice*). Repites las mismas ideas (lista, creación y detalle) con pasos exactos de principio a fin. La app de este módulo no se modifica: puedes conservarla como práctica.

**Qué evidencia guardar del lab:** capturas de la app publicada, de la navegación entre pantallas, y del formulario guardando un registro real.

---
