---
moduleId: 7
title: "Fundamentos de Power Fx y Expresiones"
level: "basico"
certification: "PL-900"
estimatedMinutes: 30
practiceMinutes: 105
slug: "fundamentos-de-power-fx-y-expresiones"
lastVerified: "2026-11"
---
*Duración: 1-2 semanas · Lectura: 12-15 min · Con práctica: unos 105 min con la app lista; la primera vez, cuenta entre el doble y el triple (núcleo obligatorio); delegación avanzada y operaciones batch pueden quedar para una segunda sesión*

### 🎯 Objetivo
Dominar el lenguaje de fórmulas Power Fx para lógica avanzada en Canvas Apps.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Leer fórmulas de Power Fx sin sentir que son “código misterioso”.
- Escribir validaciones simples con `If`, `IsBlank`, `Len`, `Notify` y operadores lógicos.
- Usar `Filter`, `LookUp`, formato de texto/fechas y un ejemplo básico de delegación.

### 🔧 Qué queda para después (Profundización opcional)
- `AddColumns`, `ForAll`, batch updates, Collections complejas y optimización fina de delegación. Puedes volver a estos patrones después de practicar más Canvas Apps.
- Están plegados dentro de cada microlección, con el título **Profundización opcional**: `AddColumns` (7.1, Ejercicio 3), `If` anidado para colores (7.2, Ejercicio 3), cálculos de fechas y `Split` (7.3, Ejercicios 2 y 3), la Práctica 7.4 completa (Collections, `ForAll`, `With`) y Collections para lo no delegable (7.5, Ejercicio 3). No hacen falta para la evaluación.

### 🧭 Cómo recorrer este módulo si eres principiante
1. Primero lee las fórmulas y explica en voz alta qué hace cada línea.
2. Practica en una app pequeña con 2 controles y 1 Gallery; no intentes copiar todas las fórmulas en una sola pantalla.
3. Si aparece una advertencia azul de delegación, no la ignores: anótala como hallazgo aunque todavía no sepas resolverla completamente.

### 📚 Power Fx en español simple

| Fórmula | Qué significa en lenguaje normal | Dónde suele ir |
|---|---|---|
| `If(condición, valorSiSí, valorSiNo)` | Si pasa esto, muestra/haz una cosa; si no, otra. | `Text`, `Visible`, `DisplayMode`, `OnSelect` |
| `IsBlank(valor)` | Revisa si un campo está vacío. | Validaciones de formularios |
| `Filter(tabla, condición)` | Muestra solo las filas que cumplen una regla. | `Items` de una Gallery |
| `LookUp(tabla, condición, columna)` | Busca una fila y devuelve un dato específico. | Labels, emails, datos relacionados |
| `Notify("mensaje", tipo)` | Muestra un aviso al usuario. | `OnSelect` de botones |
| `ThisItem.Campo` | El campo del registro actual dentro de una Gallery. | Controles dentro de una Gallery |

> Si una fórmula te abruma, léela de adentro hacia afuera y reemplaza cada nombre técnico por una frase: `Filter('Solicitudes TI', Estado = 'Estado (Solicitudes TI)'.Nueva)` = "muéstrame solo solicitudes nuevas".
>
> **Por qué `'Estado (Solicitudes TI)'.Nueva` y no `"Nueva"`:** en Dataverse, una columna *Choice* guarda un número; la etiqueta ("Nueva") es solo para mostrar y cambia según el idioma, así que no se puede comparar con texto. Se compara con la *enumeración* de la elección, que para una elección local lleva el nombre de la tabla entre paréntesis. Si no estás seguro del nombre exacto, escribe `'Estado (` en la barra de fórmulas y elige la opción que te propone. Para *mostrar* la etiqueta basta con poner la columna en el `Text` de un Label, por ejemplo `ThisItem.Estado`.

### 📖 Conceptos Clave
- **Sintaxis**: Funciones, operadores, referencias
- **Tipos de datos**: Text, Number, Boolean, Date, Table, Record
    - `Text`: un texto, como "Impresora dañada".
    - `Number`: un número, como 48.
    - `Boolean`: un valor que solo puede ser verdadero o falso (*true* / *false*).
    - `Date`: una fecha sin hora, como el 12/03/2026.
    - `Table`: una tabla con varias filas, como una hoja de Excel.
    - `Record`: una sola fila con varios datos, como una fila de esa hoja.
- **Funciones de tablas**: Filter, Sort, Search, LookUp, AddColumns
    - `Filter`: devuelve solo las filas que cumplen una condición.
    - `Sort`: devuelve la tabla ordenada.
    - `Search`: devuelve las filas que contienen un texto en alguna de las columnas que indiques.
    - `LookUp`: busca la primera fila que cumple una condición (o un dato de esa fila).
    - `AddColumns`: devuelve la tabla con columnas calculadas nuevas.
- **Funciones de agregación**: Sum, Average, Count, Max, Min
    - `Sum`: suma los valores de una columna.
    - `Average`: calcula el promedio.
    - `Count`: cuenta cuántas filas tienen un número en la columna indicada.
    - `Max`: devuelve el valor más alto.
    - `Min`: devuelve el valor más bajo.
- **Funciones de contexto**: With, ForAll, Collect
    - `With`: calcula algo una sola vez, le pone un nombre y lo usa dentro de la misma fórmula.
    - `ForAll`: repite un cálculo o una acción para cada fila de una tabla.
    - `Collect`: crea una colección (tabla en memoria) o le agrega filas.
- **Funciones de texto**: Concatenate, Text, Value, Split
    - `Concatenate`: une varios textos en uno solo (igual que el operador `&`).
    - `Text`: convierte un valor en texto y, si es número o fecha, le da formato.
    - `Value`: convierte un texto en número.
    - `Split`: parte un texto por un separador y devuelve una tabla con los pedazos.
- **Funciones de fecha**: Today, Now, DateAdd, DateDiff
    - `Today`: la fecha de hoy, sin hora.
    - `Now`: la fecha y la hora de este momento.
    - `DateAdd`: suma (o resta, con número negativo) días, meses u otras unidades a una fecha.
    - `DateDiff`: calcula cuánto hay entre dos fechas, en la unidad que elijas (días, meses...).
- **Funciones de control**: If, Switch, IsBlank, IsEmpty
    - `If`: si se cumple la condición devuelve un valor; si no, otro.
    - `Switch`: compara un valor con una lista de opciones y devuelve el resultado de la que coincide.
    - `IsBlank`: comprueba si un valor está vacío.
    - `IsEmpty`: comprueba si una tabla no tiene ninguna fila.
- **Funciones de navegación**: Navigate, Back, Launch
    - `Navigate`: cambia la pantalla que se ve.
    - `Back`: vuelve a la pantalla anterior.
    - `Launch`: abre una página web u otra app.
- **Delegación**: Limitaciones y operadores delegables
    - *Delegation*: que Dataverse haga el filtro en el servidor; si no se puede, la app solo revisa los primeros 500 registros (se puede subir hasta 10.000).
- **Comportamiento (Behavior)**: OnSelect, OnChange, OnVisible
    - *Behavior formula*: fórmula que se ejecuta cuando pasa algo (un clic, un cambio), no todo el tiempo.
    - `OnSelect`: qué hace la app cuando se toca o se hace clic en un control.
    - `OnChange`: qué hace la app cuando el usuario cambia el valor de un control.
    - `OnVisible`: qué hace la app cada vez que se llega a una pantalla.
- **Patrones**: Context variables, global variables, collections
    - *Context variable*: dato que vive en una sola pantalla (se crea con `UpdateContext`).
    - *Global variable*: dato que se puede usar en toda la app (se crea con `Set`).
    - *Collection*: tabla en memoria que se puede usar en toda la app (se crea con `Collect` o `ClearCollect`).

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

Completa primero los ejercicios 7.1.1, 7.1.2, 7.2.1, 7.3.1 y 7.5.1. Con eso tendrás búsqueda/filtro, búsqueda de un registro, validación de formulario, formato de texto y una primera lectura de delegación. Los ejercicios 7.2.2 (`Switch`) y 7.5.2 (`StartsWith`) son cortos y quedan a la vista porque entran en la evaluación.

> **Cómo está organizado el Núcleo:** aprendes Power Fx en cuatro bloques cortos (leer y filtrar, validar, dar formato, delegación). En cada uno alternas una idea, una práctica de pocos minutos y un dato real de tu propia app. Cierras con un reto en el que ya no te doy las fórmulas. Las microprácticas no necesitan tenant; escribir las fórmulas sí necesita tu app Canvas del Módulo 3. Los ejercicios marcados como profundización quedan para después. En las fórmulas, las columnas se escriben con el nombre que les diste en el Módulo 2, por ejemplo `'Título de Solicitud'`.

> **🛠️ Antes de empezar: prepara tu app del Módulo 3 (15 min)**
>
> Las fórmulas de este módulo usan controles con nombres exactos. Algunos ya los tienes (`galSolicitudes` y `txtBusqueda` en `scrInicio`, `frmNueva` y `btnGuardar` en `scrNueva`, `frmDetalle` en `scrDetalle`). Los demás los preparas ahora. Abre tu app del Módulo 3 en Power Apps Studio (**Apps** > tu app > **Edit**). Para cambiar un nombre: panel **Tree view**, pasa el mouse sobre el control, **⋯** > **Rename**. Igual que en el Módulo 3, usa los controles **clásicos** (si en **Insert** ves una categoría **Classic**, inserta desde ahí).
>
> **En la pantalla `scrInicio` (la de la lista).** Sube un poco la Gallery para dejar espacio arriba, junto a `txtBusqueda`, y agrega tres filtros:
>
> 1. **Filtro de categoría:** **Insert** > `Drop down`. Nómbralo `drpFiltroCategoria`.
>     - `Items`: `Distinct('Solicitudes TI', Categoría)`. `Distinct` devuelve cada categoría **una sola vez**, en una columna llamada `Value`. Ojo: solo lista las categorías que ya aparecen en al menos una solicitud; si una categoría no se ha usado nunca, no sale en la lista. Además `Distinct` no se delega (ver Microlección 4), algo que no importa con tus pocos datos de prueba.
>     - `AllowEmptySelection`: `true`, para poder dejar el filtro vacío ("todas las categorías"). Si la propiedad `Default` tiene algo escrito, bórralo.
> 2. **Filtro de estado:** si hiciste la Práctica 3.2 ya tienes `drpEstado`. Si no, inserta otro `Drop down`, nómbralo `drpEstado`, pon en `Items` `Distinct('Solicitudes TI', Estado)` y en `AllowEmptySelection` `true`.
> 3. **Filtro de fecha:** **Insert** > `Date picker`. Nómbralo `dtpDesde`. En su propiedad `DefaultDate` escribe `Blank()`. **Por qué:** un Date picker nuevo empieza con la fecha de **hoy**; con eso, el filtro "desde esta fecha" escondería todas las solicitudes anteriores a hoy y la lista se vería casi vacía. Con `Blank()` el filtro arranca apagado hasta que elijas una fecha.
>
> Los nombres son distintos a propósito: `drpFiltroCategoria` es el filtro de la lista. La Categoría que se escribe en el formulario es otro control, dentro de `frmNueva`.
>
> **En la pantalla `scrNueva` (la del formulario).** El título y la descripción ya existen, pero dentro del formulario: cada campo de un formulario vive en una *tarjeta* (*card*), y dentro de la tarjeta hay un cuadro de texto con un nombre automático como `DataCardValue1`. Ponles nombres claros:
>
> 1. En **Tree view**, expande `frmNueva` (flecha a la izquierda de su nombre). Verás una tarjeta por campo; su nombre incluye el nombre del campo, por ejemplo `Título de Solicitud_DataCard1`.
> 2. Expande la tarjeta del **Título de Solicitud**, busca dentro el control cuyo nombre empieza por `DataCardValue` y cámbiale el nombre a `txtTitulo`.
> 3. Haz lo mismo en la tarjeta de **Descripción**: renombra su `DataCardValue...` a `txtDescripcion`.
> 4. Pulsa **F5** y comprueba que el formulario sigue funcionando igual. Cambiar el nombre no cambia lo que hace el control.

## 🧩 Microlección 1 — Leer una fórmula: Filter y LookUp

**¿Qué vas a aprender?** A traducir una fórmula de Power Fx a una frase normal, y cómo `Filter` (varias filas) y `LookUp` (una fila) traen los datos que una pantalla necesita.

**¿Por qué existe esto?** Power Fx no es código misterioso: cada fórmula se puede decir con palabras. Saber leerla bien es la mitad de saber escribirla, y te permite detectar errores sin ejecutar nada.

**Ejemplo pequeño:** `Filter('Solicitudes TI', Estado = 'Estado (Solicitudes TI)'.Nueva)` quiere decir "muéstrame solo las solicitudes nuevas".

**Ahora haz algo — micropráctica (6 min):** **[Leer una fórmula y decir qué hace](/practica/ip-app-011-leer-una-formula)**. Te da una fórmula con dos condiciones y te pide elegir las lecturas correctas, incluyendo lo que la fórmula NO hace.

**Práctica real en tu app (25 min):** haz los Ejercicios 1 y 2 de la Práctica 7.1 de abajo.

##### Práctica 7.1: Funciones de Tablas y Filtrado

> **🔣 Operadores que vas a ver en este módulo**
>
> - `!` (también se escribe `Not`) se lee "no": `!IsBlank(txtTitulo.Text)` = "el título **no** está vacío".
> - `&&` (también `And`) se lee "y": `a && b` = se cumplen **las dos** condiciones.
> - `||` (también `Or`) se lee "o": `a || b` = basta con que se cumpla **una**.
> - `in` se lee "está dentro de": `"tóner" in 'Título de Solicitud'` = el texto aparece en alguna parte del título, sin importar mayúsculas.
> - `&` se lee "unido a": `"Hola " & User().FullName` une dos textos en uno.
> - `=` y `<>` se leen "igual" y "distinto": `Estado <> 'Estado (Solicitudes TI)'.Cerrada` = el estado no es Cerrada.

**Ejercicio 1: Multi-Filter Gallery**

> **Separadores según el idioma:** con un idioma de coma decimal en el navegador, Power Fx usa `;` entre argumentos y `;;`
> para encadenar fórmulas (por ejemplo, `Remove(ColCarrito; galCarrito.Selected);; Notify("Listo")`). Este módulo escribe
> la notación en inglés (`,` y `;`). Ver [Interfaz en español e inglés](/recursos/interfaz-espanol-ingles).

**Dónde va:** pantalla `scrInicio` > selecciona `galSolicitudes` (en **Tree view**, la Gallery completa, no una etiqueta de dentro) > propiedad `Items`. Reemplaza la fórmula `Search` del Módulo 3 por esta:

```javascript
// Gallery Items con filtros múltiples
// drpFiltroCategoria y drpEstado tienen como Items Distinct(...) (ver "Antes de empezar"):
// su Selected.Value ya es la opción Choice, no su texto, por eso se compara directo con la columna
Filter(
    'Solicitudes TI',
    (IsBlank(drpFiltroCategoria.Selected) || Categoría = drpFiltroCategoria.Selected.Value) &&
    (IsBlank(drpEstado.Selected) || Estado = drpEstado.Selected.Value) &&
    (IsBlank(dtpDesde.SelectedDate) || 'Fecha Solicitud' >= dtpDesde.SelectedDate) &&
    (txtBusqueda.Text = "" || txtBusqueda.Text in 'Título de Solicitud' || txtBusqueda.Text in Descripción)
)
```

Léela por partes: cada línea entre paréntesis dice "si el filtro está vacío, deja pasar la fila; si no, la fila debe coincidir". Las cuatro partes se unen con `&&`, así que una fila aparece solo si pasa los cuatro filtros. Prueba con **F5**: elige una categoría, luego un estado, luego una fecha, y mira cómo cambia la lista.

**Ejercicio 2: Lookup con Fallback**

> **Lookup (columna) no es lo mismo que `LookUp` (función).** *Lookup* es un **tipo de columna** de Dataverse: `Solicitante` es una columna Lookup que apunta a un contacto. `LookUp()` es una **función** de Power Fx que busca **una** fila en una tabla. Se escriben casi igual, pero son cosas distintas.

**Dónde va:** pantalla `scrInicio` > **Insert** > `Label`. Colócala debajo de los filtros y nómbrala `lblCorreo`. En su propiedad `Text` escribe:

```javascript
// Obtener el email del solicitante de la solicitud cuyo título es exactamente lo escrito, con valor por defecto
// LookUp(tabla, condición, dato) busca la primera fila que cumple la condición y devuelve ese dato
// Coalesce(valor, alternativa) devuelve la alternativa si el valor está vacío (LookUp no encontró nada)
Coalesce(
    LookUp(
        'Solicitudes TI',
        'Título de Solicitud' = txtBusqueda.Text,  // la primera fila que cumple la condición
        Solicitante.Email                          // de esa fila, el correo del contacto relacionado
    ),
    "correo@desconocido.com"
)
```

Prueba con **F5**: escribe en `txtBusqueda` el título **completo y exacto** de una solicitud (la etiqueta muestra el correo del solicitante); luego escribe un título que no existe (muestra `correo@desconocido.com`). Si la solicitud no tiene Solicitante, también verás el valor por defecto.

> **Por qué no `LookUp(Contacts, ID = ...)`:** `Solicitante` es una columna Lookup hacia **Contacts**, así que ya trae la fila del contacto y puedes leer sus columnas con un punto (`Solicitante.Email`, `Solicitante.'Full Name'`). Además, en Dataverse un contacto no tiene una columna numérica `ID`: su clave es un GUID.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| La fórmula exacta de `Items` de tu Gallery con filtros, copiada de la barra de fórmulas | ___ |
| Con qué combinación de filtros aparece cada solicitud y con cuál desaparece | ___ |
| El valor que devolvió tu `LookUp` y qué mostró cuando no encontró el registro | ___ |

#### 🔧 Profundización opcional — AddColumns para enriquecer datos (Práctica 7.1, Ejercicio 3)

**Ejercicio 3: AddColumns para Enriquecer Datos**

> Profundización opcional: este patrón ya combina tabla, columna calculada y búsqueda relacionada. Si todavía estás entendiendo `Filter` y `LookUp`, vuelve a este ejercicio después.

```javascript
// Agregar columnas calculadas en una Collection (por ejemplo, en el OnVisible de scrInicio)
// Los nombres de las columnas nuevas se escriben sin comillas (DiasTranscurridos), como cualquier nombre
ClearCollect(
    ColSolicitudesEnriquecidas,
    AddColumns(
        'Solicitudes TI',
        DiasTranscurridos, DateDiff('Fecha Solicitud', Today(), TimeUnit.Days),
        VencidoSLA, DateDiff('Fecha Solicitud', Now(), TimeUnit.Hours) > 'SLA Horas',
        NombreSolicitante, Solicitante.'Full Name'  // el Lookup ya trae el contacto relacionado
    )
)
```

> Si en otros materiales ves los nombres nuevos entre comillas dobles (`"Días Transcurridos"`), es la forma antigua de `AddColumns` (antes de la versión 3.24042 de Power Apps).

---

## 🧩 Microlección 2 — Validar con If, IsBlank y Len

**¿Qué vas a aprender?** Cómo un botón decide si se habilita según lo que hay en los campos del formulario.

**¿Por qué existe esto?** Una validación evita guardar datos incompletos antes de que lleguen a la base de datos. El error típico es combinar las condiciones con el operador equivocado, y entonces el botón se habilita cuando no debería.

**Ejemplo pequeño:** `!IsBlank(txtTitulo.Text) && Len(txtDescripcion.Text) >= 20` se cumple solo si hay título Y la descripción tiene al menos 20 caracteres.

**Práctica real en tu app (20 min):** haz el Ejercicio 1 de la Práctica 7.2 de abajo; el Ejercicio 2 (`Switch`) es corto y entra en la evaluación; el Ejercicio 3 está plegado al final de la microlección.

##### Práctica 7.2: Lógica Condicional y Validaciones

**Ejercicio 1: Validación de Form Completo**

**Dónde va:** pantalla `scrNueva` > selecciona `btnGuardar` > propiedad `DisplayMode`. Un botón no tiene una propiedad "habilitado sí/no": se habilita o deshabilita con `DisplayMode`, que puede valer `DisplayMode.Edit` (se puede pulsar) o `DisplayMode.Disabled` (se ve gris y no responde). Si en otros materiales, o en la micropráctica de abajo, ves la palabra *Enabled*, en tu app corresponde a esta propiedad.

```javascript
// DisplayMode de btnGuardar: solo se puede pulsar si el título no está vacío,
// la descripción tiene al menos 20 caracteres y el título no pasa de 100
If(
    !IsBlank(txtTitulo.Text) &&
    Len(txtDescripcion.Text) >= 20 &&
    Len(txtTitulo.Text) <= 100,
    DisplayMode.Edit,      // condición cumplida: botón activo
    DisplayMode.Disabled   // si no: botón gris
)
```

`Len(texto)` cuenta los caracteres de un texto. No hace falta revisar aquí la Categoría: es una columna requerida, así que si falta, `SubmitForm` no guarda y se ejecuta el `OnFailure` del formulario que configuraste en el Módulo 3.

**Ejercicio 2: Switch para Iconos Dinámicos**

**Dónde va:** pantalla `scrInicio` > selecciona la primera fila de `galSolicitudes` (ícono de lápiz) > **Insert** > `Icons` > elige cualquier ícono. Nómbralo `icoEstado` y, en su propiedad `Icon`, escribe:

```javascript
// Icon de icoEstado (dentro de la Gallery), según el Estado de la fila
// Se compara la columna Choice con su enumeración, no con el texto de la etiqueta;
// las opciones con espacios o tildes van entre comillas simples
Switch(
    ThisItem.Estado,
    'Estado (Solicitudes TI)'.Nueva, Icon.Add,
    'Estado (Solicitudes TI)'.'En Proceso', Icon.Clock,
    'Estado (Solicitudes TI)'.Resuelta, Icon.Check,
    'Estado (Solicitudes TI)'.Cerrada, Icon.Cancel,
    Icon.Warning  // Default: cualquier otro estado
)
```

Cada `Icon.Nombre` es uno de los íconos que trae Power Apps. Si uno de estos nombres sale subrayado en rojo, borra lo que va después de `Icon.` y elige otro de la lista que te propone la barra de fórmulas.

**Ahora diagnostica — micropráctica (5 min):** **[Diagnosticar: el botón Guardar se habilita con el título vacío](/practica/ip-app-012-boton-habilitado-de-mas)**. Parte de un síntoma exacto y te pide la causa y la corrección, antes de ver la solución.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula exacta de `DisplayMode` de tu botón Guardar | ___ |
| Qué hace el botón con el título vacío y la descripción de 25 caracteres | ___ |
| Qué hace el botón con el título lleno y la descripción de 5 caracteres | ___ |

#### 🔧 Profundización opcional — If anidado para colores (Práctica 7.2, Ejercicio 3)

**Ejercicio 3: If Anidado para Colores**

**Dónde va:** dentro de la plantilla de `galSolicitudes`, agrega un `Label` con `Text` = `ThisItem.Prioridad` y, en su propiedad `Color`, escribe la fórmula. `RGBA(rojo, verde, azul, opacidad)` arma un color: los tres primeros números van de 0 a 255 y la opacidad de 0 (transparente) a 1 (sólido).

```javascript
// Color de Label Prioridad
If(
    ThisItem.Prioridad = 'Prioridad (Solicitudes TI)'.'Crítica', 
    RGBA(178, 0, 0, 1),  // Rojo oscuro
    If(
        ThisItem.Prioridad = 'Prioridad (Solicitudes TI)'.Alta,
        RGBA(255, 140, 0, 1),  // Naranja
        If(
            ThisItem.Prioridad = 'Prioridad (Solicitudes TI)'.Media,
            RGBA(255, 215, 0, 1),  // Amarillo
            RGBA(0, 128, 0, 1)  // Verde (Baja)
        )
    )
)
```

---

## 🧩 Microlección 3 — Dar formato a texto y fechas

**¿Qué vas a aprender?** A presentar un número o una fecha como lo espera quien usa la app, con `Text()` y un formato.

**¿Por qué existe esto?** Un dato crudo (una fecha en formato de máquina) confunde. Darle formato es la diferencia entre un dato correcto y un dato que la persona entiende de un vistazo.

**Ejemplo pequeño:** `Text(ThisItem.'Fecha Solicitud', "dd/mm/yyyy")` muestra una fecha como 12/03/2026 (en `Text`, `mm` entre el día y el año es el mes; solo significa minutos si va junto a la hora o a los segundos).

**Práctica real en tu app (20 min):** haz el Ejercicio 1 de la Práctica 7.3 de abajo (incluye crear una columna nueva en tu tabla).

##### Práctica 7.3: Manipulación de Texto y Fechas

**Ejercicio 1: Formateo de Texto**

> **Por qué no usamos el ID de la fila:** en Dataverse, el identificador de cada fila no es un número 1, 2, 3…, sino un GUID: un código largo de letras y números como `f8b10550-0f12-4f08-9aa3-bb10958bc3ff`. `Text(..., "000000")` solo sirve para números, así que con el ID no funciona. Para tener un número de solicitud legible, Dataverse ofrece las columnas **Autonumber**, que generan el número solas cada vez que se crea una fila.

**Antes del ejercicio — crea la columna "Número de Solicitud" (5 min):**

1. En [make.powerapps.com](https://make.powerapps.com), selecciona **Tables** en el panel izquierdo (si no aparece, búscala en **More**) y abre tu tabla **Solicitud TI**. Si trabajas dentro de tu solución del Módulo 2, ábrela desde ahí para que la columna lleve tu prefijo `sit_`.
2. Entra al área **Columns** y, en la barra de comandos, selecciona **New column**.
3. En **Display name** escribe `Número de Solicitud` y en **Data type** elige **Autonumber**.
4. Como tipo de autonumeración elige **Custom** y escribe el formato `SOL-{SEQNUM:6}`: `SOL-` es un texto fijo y `{SEQNUM:6}` es un contador que siempre muestra al menos 6 dígitos, rellenando con ceros. Como el contador empieza por defecto en 1000, la primera solicitud será `SOL-001000`, la siguiente `SOL-001001`, y así.
5. Selecciona **Done** y luego **Save Table**.
6. Crea una solicitud nueva desde tu app del Módulo 3 y comprueba que trae su número. Si la app no muestra la columna nueva, en Power Apps Studio abre el panel **Data**, selecciona **⋯** junto a la tabla y elige **Refresh**.

> **Ojo con las solicitudes viejas:** las solicitudes que ya existían antes de crear la columna pueden quedar **sin número** (la columna aparece vacía). Para este ejercicio, selecciona en la lista una solicitud que hayas creado **después** de agregar la columna.

**Funciones de texto que usa la fórmula:** `Upper(texto)` lo pasa a MAYÚSCULAS; `Lower(texto)` a minúsculas; `Left(texto, n)` toma los primeros `n` caracteres; `Mid(texto, inicio)` toma desde la posición `inicio` hasta el final; `Concatenate(a, b, c...)` une todos los textos en uno (hace lo mismo que `&`).

**Dónde va:** pantalla `scrDetalle` > **Insert** > `Label`. Colócala debajo del formulario, nómbrala `lblResumen` y, en su propiedad `Text`, escribe:

```javascript
// Text de lblResumen: un resumen legible de la solicitud elegida en la lista
Concatenate(
    "Solicitud ", galSolicitudes.Selected.'Número de Solicitud',          // columna Autonumber: ya es texto, ej. "SOL-001000"
    " - ", Upper(Left(galSolicitudes.Selected.'Título de Solicitud', 1)), // primera letra del título en mayúscula
    Lower(Mid(galSolicitudes.Selected.'Título de Solicitud', 2)),         // el resto del título en minúsculas
    " (", Text(galSolicitudes.Selected.'Fecha Solicitud', "dd/mm/yyyy"), ")",
    " · SLA ", Text(galSolicitudes.Selected.'SLA Horas', "000"), " h"     // "000" rellena con ceros a la izquierda: 8 → "008"
)
```

Resultado de ejemplo: `Solicitud SOL-001000 - Impresora del piso 3 sin tóner (12/03/2026) · SLA 008 h`. Fíjate en las dos formas de "rellenar con ceros": en el número de solicitud lo hace Dataverse (con `{SEQNUM:6}`), y en el SLA lo hace Power Fx con el formato `"000"` de `Text`, que solo funciona sobre números.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula exacta que usaste para dar formato y el texto que produjo | ___ |
| Qué muestra el mismo dato sin el formato | ___ |
| Un formato de fecha distinto que probaste y su resultado | ___ |

#### 🔧 Profundización opcional — Cálculos de fechas y Split (Práctica 7.3, Ejercicios 2 y 3)

**Ejercicio 2: Cálculos de Fechas**

**Dónde va:** pantalla `scrDetalle` > inserta dos `Label` debajo de `lblResumen`, nómbralos `lblVence` y `lblDiasRestantes`, y escribe una fórmula en el `Text` de cada uno. `DateAdd(fecha, cantidad, unidad)` suma tiempo a una fecha; `DateDiff(inicio, fin, unidad)` cuenta cuánto hay entre dos fechas. La unidad se escribe con `TimeUnit.` (`TimeUnit.Days`, `TimeUnit.Hours`...).

```javascript
// Text de lblVence: fecha y hora estimada de resolución (fecha de la solicitud + horas de SLA)
Text(
    DateAdd(
        galSolicitudes.Selected.'Fecha Solicitud',
        galSolicitudes.Selected.'SLA Horas',
        TimeUnit.Hours
    ),
    "dd/mm/yyyy hh:mm"   // aquí "mm" va junto a la hora, así que son minutos
)

// Text de lblDiasRestantes: días de CALENDARIO que faltan para el vencimiento
// (cuenta sábados y domingos; si sale negativo, el SLA ya venció)
DateDiff(
    Today(),
    DateAdd(
        galSolicitudes.Selected.'Fecha Solicitud',
        galSolicitudes.Selected.'SLA Horas',
        TimeUnit.Hours
    ),
    TimeUnit.Days
)
```

> **¿Y los días hábiles?** `DateDiff` no tiene una unidad de "días hábiles": cuenta todos los días del calendario. Calcular días hábiles exactos (sin fines de semana ni festivos) necesita una fórmula más avanzada o una tabla de festivos; queda fuera de este módulo.

**Ejercicio 3: Split y Parse**
```javascript
// Extraer dominio de email (dentro de una Gallery; Solicitante es el Lookup a Contacts)
// Split devuelve una tabla de una columna llamada Value
Last(Split(ThisItem.Solicitante.Email, "@")).Value

// Convertir string separado por comas a tabla
Split("Hardware,Software,Red,Accesos", ",")
```

#### 🔧 Profundización opcional — Collections, ForAll y With (Práctica 7.4)

##### Práctica 7.4: Collections y Contexto

> Profundización opcional: Collections, `ForAll` y patrones batch son útiles para apps reales, pero no son requisito para entender Power Fx básico. Trabaja esta práctica cuando ya puedas crear y explicar fórmulas simples sin copiar/pegar a ciegas.

**Ejercicio 1: Carrito de Compras (Pattern)**
```javascript
// Button Agregar al Carrito - OnSelect
Collect(
    ColCarrito,
    {
        Item: galProductos.Selected.Nombre,
        Precio: galProductos.Selected.Precio,
        Cantidad: Value(txtCantidad.Text),
        Subtotal: galProductos.Selected.Precio * Value(txtCantidad.Text)
    }
);
Notify("Item agregado", NotificationType.Success)

// Button Remover del Carrito
Remove(ColCarrito, galCarrito.Selected);
Notify("Item removido", NotificationType.Information)

// Label Total
"Total: $" & Text(Sum(ColCarrito, Subtotal), "$#,##0.00")
```

**Ejercicio 2: ForAll para Operaciones Batch**
```javascript
// Marcar como resueltas varias solicitudes seleccionadas
ForAll(
    galSolicitudes.AllItems,
    If(
        chkSeleccion.Value,  // Si está seleccionado
        Patch(
            'Solicitudes TI',
            ThisRecord,  // la fila viene de la Gallery, que a su vez viene de 'Solicitudes TI': Patch sabe cuál modificar
            // Una columna Choice se asigna con su enumeración, no con {Value: "..."}
            {Estado: 'Estado (Solicitudes TI)'.Resuelta, 'Fecha Resolución': Today()}
        )
    )
);
Notify(CountIf(galSolicitudes.AllItems, chkSeleccion.Value) & " solicitudes resueltas", NotificationType.Success)
```

**Ejercicio 3: With para Contexto Local**
```javascript
// Evitar repetir cálculos - With pattern
With(
    {
        RegistroActual: galSolicitudes.Selected,
        TiempoTranscurrido: DateDiff(galSolicitudes.Selected.'Fecha Solicitud', Now(), TimeUnit.Days)
    },
    Concatenate(
        "Solicitud: ", RegistroActual.'Título de Solicitud',
        " | Días abierta: ", Text(TiempoTranscurrido),
        " | Estado: ", If(TiempoTranscurrido > 7, "VENCIDA", "En plazo")
    )
)
```

---

## 🧩 Microlección 4 — Delegación: que tu app no pierda registros

**¿Qué vas a aprender?** Qué es delegar (que el servidor haga el filtro), qué significa la línea azul de advertencia y cómo reescribir una condición para que sí se delegue.

**¿Por qué existe esto?** Si una fórmula no se puede delegar, la app solo revisa los primeros 500 registros (hasta 10.000 si cambias el límite en **Settings** > **General** > **Data row limit**) y puede mostrar resultados incompletos sin avisarte. Con pocos datos no lo notas; con muchos, falta información.

**Ejemplo pequeño:** poner `DateDiff(...)` sobre la columna dentro de `Filter` no se delega. Comparar la columna con una fecha calculada fuera de la fila, como `'Fecha Solicitud' < DateAdd(Today(), -7, TimeUnit.Days)`, sí se delega.

**Práctica real en tu app (20 min):** haz el Ejercicio 1 de la Práctica 7.5 de abajo; el Ejercicio 2 (`StartsWith`) entra en la evaluación; el Ejercicio 3 está plegado al final de la microlección.

##### Práctica 7.5: Delegación y Performance

**Ejercicio 1: Identificar Fórmulas No Delegables**

❌ **No delegable** (warning línea azul):
```javascript
Filter('Solicitudes TI', DateDiff('Fecha Solicitud', Today(), TimeUnit.Days) > 7)
// DateDiff no es delegable
```

✅ **Solución delegable**:
```javascript
Filter('Solicitudes TI', 'Fecha Solicitud' < DateAdd(Today(), -7, TimeUnit.Days))
// Operador < es delegable
```

**Ejercicio 2: Optimizar Queries con Delegación**

Las dos fórmulas de abajo **piden lo mismo**: las solicitudes cuyo título empieza con lo que escribiste en `txtBusqueda`, de la más reciente a la más antigua. Cambia solo **cómo** se pide.

- `Sort(tabla, columna, SortOrder.Descending)` ordena la tabla por esa columna, de mayor a menor (`SortOrder.Ascending` es de menor a mayor). La columna se escribe por su nombre, entre comillas simples si tiene espacios, igual que en `Filter`.
- `Trim(texto)` quita los espacios del principio y del final.
- `StartsWith(texto, inicio)` dice si `texto` empieza con `inicio`.

❌ **Mal rendimiento** (trae como máximo 500 filas y filtra en la app):
```javascript
Sort(
    Filter(
        'Solicitudes TI',
        StartsWith(Trim('Título de Solicitud'), txtBusqueda.Text)
    ),
    'Fecha Solicitud',
    SortOrder.Descending
)
// Trim() aplicada a la columna no se puede delegar a Dataverse: línea azul
```

✅ **Optimizado** (filtra en el servidor):
```javascript
Sort(
    Filter(
        'Solicitudes TI',
        StartsWith('Título de Solicitud', txtBusqueda.Text)  // StartsWith sí es delegable
    ),
    'Fecha Solicitud',
    SortOrder.Descending
)
// Search también es delegable con columnas de texto de Dataverse
```

> **¿Y `SortByColumns`?** Es otra función para ordenar que verás en otros materiales: recibe el nombre de la columna como **texto**, entre comillas dobles. Para no mezclar estilos de comillas, en este curso usamos `Sort` con el nombre de la columna como en cualquier otra fórmula.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula no delegable que escribiste y el texto de la advertencia azul | ___ |
| La versión corregida y si la advertencia desapareció | ___ |
| Cuántas filas devuelve cada versión con tus datos de prueba | ___ |

#### 🔧 Profundización opcional — Collections para lo no delegable (Práctica 7.5, Ejercicio 3)

**Ejercicio 3: Uso de Collections para No Delegable**
```javascript
// Cargar data una vez (ClearCollect no es delegable: trae como máximo el Data row limit,
// 500 por defecto y hasta 10.000 si lo cambias en Settings)
// OnVisible de la pantalla:
ClearCollect(
    ColSolicitudesRecientes,
    Filter('Solicitudes TI', 'Fecha Solicitud' >= DateAdd(Today(), -30, TimeUnit.Days))
);

// Luego operar localmente sin límite de delegación
// Items de la Gallery:
Filter(
    ColSolicitudesRecientes,
    DateDiff('Fecha Solicitud', Today(), TimeUnit.Days) > 7  // Ahora funciona porque es Collection local
)
```

---

## 🔁 Reto de transferencia — Tu app, más robusta, sin pasos

Esta vez no te doy las fórmulas: aplica lo que viste a un cambio de requisito.

> **Requerimiento:** vuelve a tu app del Módulo 3 y mejora tres cosas. (1) El botón Guardar solo se habilita si hay título y la descripción tiene al menos 20 caracteres. (2) La Gallery de la lista muestra únicamente las solicitudes con más de 14 días abiertas. (3) Un Label muestra la solicitud como "Abierta desde 12/03/2026 - Hardware", con la fecha formateada y la categoría.
> **Criterios de aceptación:** (1) el botón cambia de estado según el contenido de los campos; (2) el filtro de fecha no muestra la advertencia azul de delegación; (3) cada fórmula tiene un comentario `//` que explica su intención.
> **Restricciones:** no uses `DateDiff` dentro del `Filter`, y no cambies el modelo de datos.
> **Pistas si te atoras:** la validación combina `IsBlank` y `Len` (Práctica 7.2); el formato de la fecha está en la Práctica 7.3; la forma delegable de comparar fechas está en la Práctica 7.5, Ejercicio 1. Un comentario se escribe dentro de la fórmula, empezando con `//`; la advertencia de delegación es una línea azul que subraya la parte de la fórmula que no se delega.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: la condición de fecha con 25.000 registros](/practica/ip-app-013-transferir-condicion-de-fecha)**. Retoma el patrón de delegación del módulo con un caso nuevo y te pide decidir qué cambiar y qué evitar.

**Si aún no tienes tenant:** escribe las tres fórmulas que usarías, cada una con su comentario `//`, y explica con tus palabras por qué no usas `DateDiff` en el filtro.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La fórmula de `DisplayMode` del botón Guardar, con su comentario | ___ |
| La fórmula de `Items` de la Gallery filtrada por fecha y si hay advertencia azul | ___ |
| La fórmula del Label con el texto que produjo | ___ |

### 💼 Caso Real de Negocio

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

### ✅ Buenas Prácticas

**Sintaxis y Legibilidad**:

- Indentar fórmulas complejas: una condición por línea y los paréntesis de cierre alineados, como en los ejemplos de este módulo
- Usar With para evitar repetir subcálculos
- Comentarios con `//` en fórmulas de >3 líneas
- Nombres descriptivos de variables: `colCarrito` no `col1`

**Performance**:

- Entender y respetar delegación (límite de 500 registros por defecto, ampliable hasta 10.000)
- Cargar datos una vez, operar local con Collections
- Evitar Addcolumns dentro de loops (ForAll)
- Usar `Concurrent(fórmula1, fórmula2, ...)` para ejecutar **a la vez** varias acciones que no dependen unas de otras (por ejemplo, cargar dos colecciones al abrir la app). Solo funciona en fórmulas de comportamiento, como `OnSelect` u `OnStart`, y ninguna fórmula de dentro debe usar el resultado de otra, porque no se sabe cuál termina primero

**Mantenibilidad**:

- Centralizar cálculos complejos en una Collection
- Usar componentes con *output properties* para reutilizar lógica. Un *componente* es un grupo de controles que armas una vez y reutilizas en varias pantallas; una *output property* es un valor que el componente le entrega a la pantalla que lo usa (por ejemplo, el registro elegido en una Gallery que está dentro del componente)
- Documentar fórmulas no obvias
- *Named formulas* (fórmulas con nombre): se declaran en la propiedad `Formulas` del objeto **App** (en **Tree view**, selecciona **App** y elige `Formulas`), con la forma `Nombre = expresión;`, por ejemplo `HoyMasSiete = DateAdd(Today(), 7, TimeUnit.Days);`. A diferencia de una variable creada con `Set()` en `App.OnStart`, que tú debes actualizar a mano, una fórmula con nombre siempre está al día: se recalcula sola cuando cambian los datos de los que depende, Power Apps puede calcularla solo cuando se necesita, y no se puede cambiar con `Set`

**Debugging**:

- Usar un Label temporal para ver el contenido de una variable con un registro o una tabla: en su `Text` escribe `JSON(NombreVariable, JSONFormat.IndentFour)`. `JSON()` convierte el valor en texto legible, con sangría de cuatro espacios
- *Live monitor*: herramienta que registra lo que hace la app mientras la usas (llamadas a los datos, errores, tiempos). Se abre desde Power Apps Studio en **Advanced tools** > **Open live monitor**
- El panel **Variables** de Power Apps Studio (en el menú de la izquierda) muestra las variables globales, las variables de contexto y las colecciones de la app, con su valor actual

### ⚠️ Errores Comunes

1. **Lo que ves:** una fórmula devuelve vacío (Blank) cuando no lo esperabas.
    - **Causa**: Lookup no encuentra registro o división por 0
    - **Solución**: Usar `Coalesce(valor, alternativa)`, que devuelve la alternativa cuando el valor está vacío, o If(IsBlank(...))

2. **Lo que ves:** el error "Incompatible type" al usar Patch.
    - **Causa**: Tipo de dato no coincide (text vs number, Choice vs string)
    - **Solución**: Convertir con Value() o Text(); para una columna Choice de Dataverse, asignar su enumeración, por ejemplo `{Estado: 'Estado (Solicitudes TI)'.Resuelta}` ([Learn: Patch con columnas de Dataverse](https://learn.microsoft.com/power-platform/power-fx/reference/function-patch#patch-with-dataverse-column-types))

3. **Lo que ves:** la Gallery no cambia aunque modificaste la colección.
    - **Causa**: ni las variables ni las colecciones se recalculan solas: cambian solo cuando una fórmula de comportamiento las actualiza (`Set`, `UpdateContext`, `Collect`, `ClearCollect`, `Patch`, `Remove`, `UpdateIf`...). Un caso típico: la Gallery muestra una **variable** a la que le asignaste la colección con `Set(varLista, ColSolicitudes)`; después cambiaste `ColSolicitudes`, pero `varLista` sigue con el valor que tenía cuando se ejecutó el `Set`.
    - **Solución**: pon la colección directamente en el `Items` de la Gallery (`Items` = `ColSolicitudes`) y modifícala con `Collect`, `Patch`, `Remove` o `UpdateIf`; o vuelve a ejecutar el `Set` después de cada cambio

4. **Lo que ves:** ForAll parece no guardar los cambios, o los guarda "desordenados".
    - **Causa**: `ForAll` puede procesar las filas **en cualquier orden** y, cuando puede, varias a la vez; una fórmula que depende de lo que pasó en la fila anterior da resultados inesperados. Además, dentro de `ForAll` no puedes modificar la misma tabla que estás recorriendo, ni usar `UpdateContext`, `Clear` o `ClearCollect`
    - **Solución**: recorre una tabla distinta de la que modificas (por ejemplo, las filas marcadas de la Gallery) y usa `Patch` sobre la tabla de Dataverse, como en la Práctica 7.4, Ejercicio 2; no dependas del orden en que se procesan las filas

5. **Lo que ves:** Filter devuelve registros que no esperabas, o deja fuera algunos.
    - **Causa**: Se confundió And con Or (o && con ||), o faltan paréntesis al combinar condiciones
    - **Solución**: And (&&) exige que se cumplan todas las condiciones y Or (||) basta con una; ambas formas son válidas en Power Fx. Agrupa con paréntesis cuando mezcles las dos

6. **Lo que ves:** una línea azul de delegación que decidiste ignorar, y resultados incompletos con muchos registros.
    - **Causa**: Asumir que funciona con >500 registros
    - **Solución**: NUNCA ignorar warnings de delegación; refactorizar o usar Collections

### 🧪 Criterios de Validación
- [ ] 10+ fórmulas complejas implementadas en Canvas App
- [ ] Uso correcto de Filter, LookUp, AddColumns, ForAll
- [ ] Collection con operaciones CRUD funcional
- [ ] Validaciones de form con If/IsBlank
- [ ] Formateo de texto y fechas aplicado
- [ ] With pattern para optimizar cálculos repetidos
- [ ] Identificar y resolver 3+ warnings de delegación
- [ ] Explicar diferencia entre variables globales y contextuales
- [ ] Debugging de fórmula compleja con Labels temporales

> Para avanzar como principiante, valida al menos 5 fórmulas: una de filtro, una de búsqueda, una de validación, una de formato y una corrección de delegación. Los 10+ ejemplos y operaciones batch son profundización.

### 📸 Evidencia para guardar
- Captura de una Gallery filtrada por texto o estado.
- Captura de un botón o formulario con validación funcionando.
- Captura de una fórmula con comentario `//` explicando su intención.
- Captura de una advertencia de delegación identificada y su versión corregida.

### ➡️ Siguiente práctica recomendada

Vuelve a tu Canvas App del **Módulo 03 / Lab 03** y reemplaza una fórmula simple por una versión más robusta de este módulo.

**Por qué:** Power Fx se aprende mejor mejorando una app existente que copiando muchas fórmulas aisladas. Tu objetivo no es memorizar funciones, sino reconocer patrones: filtrar, validar, formatear, navegar y evitar delegación peligrosa.

---
