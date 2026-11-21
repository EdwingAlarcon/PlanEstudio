---
id: lab-130
title: "Expresiones y datos: limpiar un Excel sucio con Select, Filter array y variables (Ruta Pro Power Automate)"
level: "N2"
duration: 240
product: ["Power Automate", "Dataverse", "Excel"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado: solución SIT Compras y tabla Solicitud de compra"
  - "Lab 129 recomendado (aquí vuelves a usar la idea de apagar flujos y de probar expresiones en una Compose)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 130 — Expresiones y datos

## Objetivo

Leer un Excel real, **sucio**, y convertirlo en datos fiables con las herramientas de datos de Power Automate: **Compose**, **Select**, **Filter array**, variables y el lenguaje de expresiones (`if`, `contains`, `substring`, `trim`, `replace`, `float`, `int`, `coalesce`, `formatDateTime`, `length`). Terminas con un informe de calidad por correo y con las solicitudes pendientes cargadas en Dataverse.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Antes del flujo de compras, las solicitudes vivían en un libro de Excel que llenaban las áreas a mano: `solicitudes-compra.xlsx`, 150 filas de enero a octubre de 2026. Finanzas necesita dos cosas:

1. Un **informe de calidad**: cuántas filas sirven, cuáles hay que devolver y por qué.
2. Las solicitudes que siguen **pendientes** dentro de Dataverse, para que el proceso nuevo las tome.

Los datos tienen los defectos de cualquier hoja de cálculo compartida: fechas escritas de dos maneras, precios con texto, cantidades vacías y categorías con espacios. Un flujo que da por buenos los datos falla a la primera fila rara.

## Lo que vas a construir

- Un flujo instantáneo `SC - Importar y limpiar histórico` con tres etapas: leer, limpiar y cargar
- Un informe de calidad con contadores y la tabla de filas rechazadas
- Las cinco solicitudes pendientes en Dataverse, con su fecha original y su identificador de origen

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| `Select` y `Create HTML table` con datos limpios (Lab 128) | `Select` con expresiones sobre datos sucios, encadenados | Lab 138 (rendimiento: `Select` frente a **Apply to each**) |
| Expresiones `mul` e `if` | Texto, fechas, números, nulos y objetos | — |
| Una fila creada a mano | Carga de varias filas desde un archivo | Lab 132 (upsert con clave alternativa: no duplicar) |

> **Fuente del esqueleto:** la unidad de operaciones de datos de Learn ([Learn: operaciones de datos](https://learn.microsoft.com/power-automate/data-operations)). Los datos, el caso y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Leer el Excel y mirar la primera fila | 35 min |
| Ejercicio 2 — Medir la suciedad con **Filter array** | 40 min |
| Ejercicio 3 — Limpiar con **Select** | 55 min |
| Ejercicio 4 — Separar válidas y rechazadas, y el informe | 40 min |
| Ejercicio 5 — Totales con variables | 25 min |
| Ejercicio 6 — Cargar los pendientes a Dataverse | 45 min |
| **Total** | **unas 4 h** (mejor en dos sesiones: Ejercicios 1 a 4 y 5 a 6) |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: **Excel Online (Business)** (**List rows present in a table**), **Compose**, **Select**, **Filter array**, **Create HTML table**, **Initialize variable**, **Increment variable**, **For each** (**Apply to each** en el clásico), **Add a new row** (Dataverse), **Send an email (V2)**
- Expresiones: `item`, `if`, `contains`, `substring`, `concat`, `trim`, `replace`, `string`, `empty`, `float`, `int`, `mul`, `equals`, `not`, `coalesce`, `formatDateTime`, `length`, `outputs`, `body`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con Dataverse, la solución `SIT Compras` y la tabla `Solicitudes de compra` (Lab 128)
- [ ] **OneDrive for Business o SharePoint** con espacio para un archivo: el conector **Excel Online (Business)** solo lee libros guardados ahí, y los datos deben estar en una **tabla de Excel** ([Learn: conector de Excel Online (Business)](https://learn.microsoft.com/connectors/excelonlinebusiness/)). Con una cuenta personal de OneDrive existe otro conector (**Excel Online (OneDrive)**), pero no sirve con cuentas de trabajo ni si tu organización lo bloquea con directivas DLP
- [ ] El paquete [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip) extraído. Sube `solicitudes-compra.xlsx` a OneDrive (por ejemplo a una carpeta `SIT Compras`). La tabla de Excel se llama `Solicitudes`
- [ ] Un buzón de Outlook en la cuenta del curso

### Conocimiento previo

- [Módulo 5](/nivel/basico/modulo/power-automate-automatizacion-basica): acciones y condiciones
- Lab 129: probar una expresión en una **Compose** con valores fijos y, si tu diseñador no ofrece **Edit in advanced mode**, la alternativa de la nota del Lab 129, Ejercicio 5, Tarea 5.3 (expresión con **fx** a la izquierda, **is equal to** y `true` a la derecha)

### Verificación rápida antes de empezar

- [ ] Abre `solicitudes-compra.xlsx` en Excel Online: ves una tabla de 150 filas con encabezados `SolicitudID`, `FechaSolicitud`, `Area`, `Solicitante`, `Categoria`, `Descripcion`, `ProveedorID`, `Cantidad`, `PrecioUnitario` y `Estado`
- [ ] Recorre las columnas con el ojo y anota **tres defectos** que ya ves (los medirás en el Ejercicio 2)

---

## Ejercicio 1 — Leer el Excel y mirar la primera fila

**Objetivo:** saber exactamente qué entrega el conector, porque las expresiones del resto del lab dependen de ello.

1. En la solución `SIT Compras`: **New** > **Automation** > **Cloud flow** > **Instant**, nombre `SC - Importar y limpiar histórico`, disparador **Manually trigger a flow** (sin entradas).
2. **+** > **Excel Online (Business)** > **List rows present in a table**. Elige **Location** (OneDrive for Business), **Document Library**, **File** (`solicitudes-compra.xlsx`) y **Table** (`Solicitudes`). Renombra la acción `Leer Excel`.
3. Añade una **Compose** `Primera fila` con la expresión `first(outputs('Leer_Excel')?['body/value'])` y otra, `Cuántas filas`, con `length(outputs('Leer_Excel')?['body/value'])`.
4. **Save** y ejecuta con **Test** > **Manually**. Abre la ejecución y mira las salidas de `Leer Excel`, `Primera fila` y `Cuántas filas`.

### Resultado esperado del Ejercicio 1

- `Cuántas filas` = **150**.
- Cada fila es un objeto con una propiedad por columna (`SolicitudID`, `FechaSolicitud`…), además de propiedades propias del conector (como `@odata.etag` y `ItemInternalId`) que no usarás.
- Busca ahora en la salida de `Leer Excel` la solicitud **SC-2026-0026** (la cantidad está vacía) y la **SC-2026-0147** (precio como texto). **Anota cómo llega cada celda**: un número como `240` (o como el texto `"240"`: el conector puede entregarlo todo como texto), un precio sucio como `"USD 2.00"` y una celda vacía como `""` o `null`. Por eso el lab convierte siempre con `int` y `float` antes de calcular.

> **Paginación:** la acción devuelve por defecto un número limitado de filas. Con 150 sobra; con una tabla de miles habría que activar **Pagination** en los **Settings** de la acción y fijar su **Threshold** (Lab 138).

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Filas leídas | ___ (esperado: 150) |
| Cómo llega la `Cantidad` vacía de SC-2026-0026 (`""` o `null`) | ___ |
| Tipo con el que llega `PrecioUnitario` en SC-2026-0147 | ___ |

---

## Ejercicio 2 — Medir la suciedad con **Filter array**

**Objetivo:** no corregir a ciegas. Contar cuántas filas tienen cada defecto, con una acción de filtro por defecto.

### Tarea 2.1 — Cuatro filtros

1. Añade cuatro acciones **Data Operation** > **Filter array**, todas con **From** = `value` de `Leer Excel`. En cada una, cambia a **Edit in advanced mode** y escribe la condición. Renómbralas como se indica ([Learn: Filter array](https://learn.microsoft.com/power-automate/data-operations#use-the-filter-array-action)):

| Nombre | Condición |
|---|---|
| `Fechas con barra` | `@contains(item()?['FechaSolicitud'], '/')` |
| `Precios con texto` | `@contains(string(item()?['PrecioUnitario']), 'USD')` |
| `Cantidades vacias` | `@empty(string(item()?['Cantidad']))` |
| `Categorias con espacios` | `@not(equals(item()?['Categoria'], trim(item()?['Categoria'])))` |

   `string()` convierte antes de preguntar: `empty` y `contains` esperan texto, y una celda numérica no lo es. `string(null)` da cadena vacía, así que la misma condición cubre la celda vacía y la que llega como `null`.
2. Añade una **Compose** `Suciedad medida` con las cuatro cuentas:

```text
concat('fechas=', length(body('Fechas_con_barra')), ' precios=', length(body('Precios_con_texto')), ' cantidades=', length(body('Cantidades_vacias')), ' categorías=', length(body('Categorias_con_espacios')))
```

   En las expresiones, los espacios del nombre de una acción se escriben con guiones bajos. Por eso las acciones de este lab llevan nombres sin barras ni tildes.
3. Ejecuta **Test**.

### Resultado esperado de la Tarea 2.1

`fechas=17 precios=13 cantidades=4 categorías=11`. Si alguna cuenta no coincide, **para y averigua por qué** antes de seguir: limpiar sin entender es la forma de perder datos.

### Tarea 2.2 — Romper a propósito

4. Añade una **Select** provisional, **From** = `value` de `Leer Excel`, con una sola columna `Precio` = `float(item()?['PrecioUnitario'])`. Ejecuta.

**Resultado esperado:** la acción **falla** en la primera fila que trae "USD 25.00" (SC-2026-0019, la primera de la tabla con texto en el precio) y **ninguna fila** sale convertida: un `Select` no devuelve resultados parciales. Lee el mensaje de error y anótalo. Borra la **Select** provisional.

> **La lección:** una sola celda rara tumba todo el flujo. Hay dos defensas: limpiar **antes** de convertir (Ejercicio 3) y decidir qué hacer con lo que no se puede limpiar (Ejercicio 4).

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Fechas dd/mm, precios con texto, cantidades vacías, categorías con espacios | ___ , ___ , ___ , ___ (esperado: 17, 13, 4, 11) |
| Mensaje de error de la `Select` que falló | ___ |

---

## Ejercicio 3 — Limpiar con **Select**

**Objetivo:** producir una lista de objetos **limpios**, con los tipos correctos, en dos pasos encadenados.

### Tarea 3.1 — Probar cada expresión con un valor fijo

Antes de aplicarlas a 150 filas, pruébalas con **Compose** y valores escritos a mano, como hiciste con los festivos en el Lab 129. Crea una **Compose** por prueba y mira la salida:

| Qué pruebas | Expresión en la **Compose** | Salida esperada |
|---|---|---|
| Fecha `dd/mm/yyyy` a ISO | `concat(substring('25/03/2026', 6, 4), '-', substring('25/03/2026', 3, 2), '-', substring('25/03/2026', 0, 2))` | `2026-03-25` (comprobado) |
| Precio con texto | `float(replace(replace('USD 1,400.00', 'USD ', ''), ',', ''))` | `1400` |
| Categoría con espacios | `trim(' Viajes ')` | `Viajes` |
| Cantidad vacía | `empty(string(''))` | `true` |

Borra estas **Compose** cuando funcionen.

> **Por qué `substring` y no `parseDateTime`:** `parseDateTime(texto, 'es-CO', 'dd/MM/yyyy')` también sirve, pero depende de que el nombre de la cultura exista y de cómo interprete el formato. Con `substring` el resultado no depende de ninguna configuración regional. Cuando un dato "se ve bien" en el Excel pero llega mal al flujo, casi siempre es la cultura.

### Tarea 3.2 — Primera `Select`: columnas limpias

1. Añade **Data Operation** > **Select**, nombre `Limpiar filas`. **From** = `value` de `Leer Excel`. En **Map**, pulsa el icono de **modo de texto** (a la derecha de **Map**, para escribir pares clave-valor con expresiones) y escribe:

```text
{
  "Id": "@{item()?['SolicitudID']}",
  "Fecha": "@{if(contains(item()?['FechaSolicitud'], '/'), concat(substring(item()?['FechaSolicitud'], 6, 4), '-', substring(item()?['FechaSolicitud'], 3, 2), '-', substring(item()?['FechaSolicitud'], 0, 2)), item()?['FechaSolicitud'])}",
  "Area": "@{item()?['Area']}",
  "Solicitante": "@{item()?['Solicitante']}",
  "Categoria": "@{trim(item()?['Categoria'])}",
  "Descripcion": "@{item()?['Descripcion']}",
  "Cantidad": "@if(empty(string(item()?['Cantidad'])), null, int(item()?['Cantidad']))",
  "Precio": "@float(replace(replace(string(item()?['PrecioUnitario']), 'USD ', ''), ',', ''))",
  "Estado": "@{item()?['Estado']}"
}
```

   > **`@{...}` frente a `@...`:** con llaves (`@{expresión}`) el resultado se convierte en **texto** y un `null` pasa a ser una cadena vacía. Por eso los valores que deben ser números o nulos (`Cantidad`, `Precio`, `Importe`) se escriben **sin llaves** (`@expresión`); los textos pueden ir con llaves. Si insertas la expresión con **fx**, el diseñador la guarda en la forma correcta. **Comprobado en un tenant real (2026-11-21, con la definición del flujo):** una **Select** con `"txt": "@{float(replace(item(),'USD ',''))}"` y `"num": "@float(replace(item(),'USD ',''))"` devuelve `{"txt":"2","num":2.0}`, y con `null` devuelve `""` para la forma con llaves y `null` para la otra. *Sin verificar:* cómo guarda el diseñador un valor tecleado a mano en el modo de texto; si en la salida ves `Cantidad` entre comillas (`"102"`), vuelve a insertarlo con **fx**.

   Si el modo de texto no está disponible en tu diseñador, crea cada par con **Enter key** / **Enter value** y pega la expresión en cada valor con **fx**.
2. Añade otra **Select**, `Calcular importes`, con **From** = **Outputs** de `Limpiar filas`. **Map** en modo de texto:

```text
{
  "Id": "@{item()?['Id']}",
  "Fecha": "@{item()?['Fecha']}",
  "Area": "@{item()?['Area']}",
  "Solicitante": "@{item()?['Solicitante']}",
  "Categoria": "@{item()?['Categoria']}",
  "Descripcion": "@{item()?['Descripcion']}",
  "Cantidad": "@item()?['Cantidad']",
  "Precio": "@item()?['Precio']",
  "Estado": "@{item()?['Estado']}",
  "Importe": "@if(equals(item()?['Cantidad'], null), null, mul(item()?['Cantidad'], item()?['Precio']))"
}
```

   Se hace en dos pasos porque el importe depende de la cantidad **ya convertida**: repetir `int(...)` y `float(...)` en una sola expresión sería largo y fácil de equivocar. Encadenar `Select` es más legible, no más lento.
3. **Save** y **Test**. Abre la salida de `Calcular importes`.

### Resultado esperado del Ejercicio 3

- 150 objetos. En SC-2026-0147: `Fecha` = `2026-03-25`, `Precio` = `2`, `Cantidad` = `102`, `Importe` = `204`.
- En SC-2026-0026, `Cantidad` e `Importe` son `null` (no se inventó un valor).
- En SC-2026-0122, `Categoria` = `Viajes`, sin espacios.

> **Cuidado con el formato de los números:** `float('1400.00')` funciona porque el texto usa el punto como decimal. Un Excel de otro país con `1.400,00` daría un número equivocado **sin error**. Mira siempre cómo escribe los números la fuente.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| `Fecha`, `Cantidad` e `Importe` de SC-2026-0147 | ___ , ___ , ___ (esperado: 2026-03-25, 102, 204) |
| `Cantidad` e `Importe` de SC-2026-0026 | ___ , ___ (esperado: ambos nulos) |

---

## Ejercicio 4 — Separar válidas y rechazadas, y el informe

**Objetivo:** decidir qué se hace con lo que no se puede limpiar, y dejar constancia.

1. **Filter array** `Filas validas`: **From** = **Outputs** de `Calcular importes`, condición avanzada `@not(equals(item()?['Importe'], null))`.
2. **Filter array** `Filas rechazadas`: misma fuente, `@equals(item()?['Importe'], null)`.
3. **Select** `Rechazadas para el informe`: **From** = **Outputs** de `Filas rechazadas`; **Map** con dos columnas, `Solicitud` = `item()?['Id']` y `Motivo` = el texto fijo `Sin cantidad`.
4. **Create HTML table** `Tabla de rechazadas`: **From** = **Outputs** de `Rechazadas para el informe`.
5. Añade dos filtros de comprobación sobre `Filas validas`, con `formatDateTime` para agrupar por mes:
   - `Validas de marzo`: `@equals(formatDateTime(item()?['Fecha'], 'yyyy-MM'), '2026-03')`
   - `Validas de octubre`: `@equals(formatDateTime(item()?['Fecha'], 'yyyy-MM'), '2026-10')`

   Si una fecha `dd/mm/yyyy` se hubiera convertido mal (mes y día invertidos), estas cuentas no coincidirían.
6. **Send an email (V2)** a tu correo, **Subject** `Informe de calidad: histórico de compras`, **Body**: escribe cada etiqueta en el editor normal (una por párrafo, con Enter) e inserta cada cuenta con **fx**; si usas el modo código `</>`, el cuerpo es HTML y debes separar las líneas con `<br>`. El contenido:

```text
Filas leídas: @{length(outputs('Leer_Excel')?['body/value'])}
Filas válidas: @{length(body('Filas_validas'))}
Filas rechazadas (sin cantidad): @{length(body('Filas_rechazadas'))}
Válidas de marzo de 2026: @{length(body('Validas_de_marzo'))}
Válidas de octubre de 2026: @{length(body('Validas_de_octubre'))}
```

   y, debajo, la salida de `Tabla de rechazadas`.
7. **Save** y **Test**.

### Resultado esperado del Ejercicio 4

| Concepto | Valor |
|---|---|
| Filas válidas | **146** |
| Filas rechazadas | **4**: SC-2026-0026, SC-2026-0074, SC-2026-0108 y SC-2026-0133 |
| Válidas de marzo de 2026 | **16** |
| Válidas de octubre de 2026 | **21** |

> **Por qué se rechaza en lugar de inventar un 1:** una cantidad inventada produce un importe y un nivel de aprobación falsos. Un dato faltante se devuelve a quien lo conoce. La decisión de rechazar (y la de **informar** qué se rechazó) es de negocio, no de técnica.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Filas válidas y rechazadas | ___ y ___ (esperado: 146 y 4) |
| Marzo y octubre | ___ y ___ (esperado: 16 y 21) |

---

## Ejercicio 5 — Totales con variables

**Objetivo:** acumular un total. **Power Automate no tiene una función `sum`**: se acumula en una variable.

1. Al principio del flujo (antes de `Leer Excel`), **Variable** > **Initialize variable**: **Name** `TotalImporte`, **Type** **Float**, **Value** `0`.
2. Después de `Filas validas`, **Control** > **For each** (en el diseñador clásico, **Apply to each**) sobre **Outputs** de `Filas validas`. Dentro, **Variable** > **Increment variable**: **Name** `TotalImporte`, **Value** = `item()?['Importe']` (con **fx** (el nombre del bucle es el que ves en el diseñador, con guiones bajos): `items('For_each')?['Importe']`).
3. Antes del correo, añade a `Body` la línea `Importe total de las filas válidas: @{variables('TotalImporte')}`.
4. En los **Settings** de **Apply to each**, comprueba que **Concurrency control** está **desactivado**. Con concurrencia, dos iteraciones podrían leer el mismo valor antes de sumar y el total saldría menor (en una prueba real con 40 elementos, el total salió correcto con y sin la concurrencia desactivada: no es un error que siempre se vea, pero tampoco hay garantía) ([Learn: variables en bucles](https://learn.microsoft.com/power-automate/create-variables-store-values)).
5. **Test**.

### Resultado esperado del Ejercicio 5

`TotalImporte` = **458365**. (Si hubieras inventado una cantidad de 1 para las cuatro filas rechazadas, el total sería 465.600: un dato falso. Con sus cantidades reales, que solo conoce quien las pidió, sería 472.320.)

> **Compose frente a variable:** una **Compose** guarda un resultado **que no cambia** (un valor intermedio, una prueba). Una **variable** guarda algo que **cambia durante la ejecución** (un acumulador, una bandera). Si no vas a modificarlo, no necesitas variable.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| `TotalImporte` | ___ (esperado: 458365) |
| ¿Por qué `Increment variable` exige concurrencia desactivada? | ___ |

---

## Ejercicio 6 — Cargar los pendientes a Dataverse

**Objetivo:** llevar a la tabla real las solicitudes que siguen pendientes, sin disparar los flujos de negocio.

### Tarea 6.1 — Preparar

1. **Apaga** `SC - Aprobar solicitud`, `SC - Alertar compra grande` y `SC - Avisar a TI` (desde la lista de flujos de la solución). Una importación masiva no debe lanzar aprobaciones ni avisos (se apaga y enciende desde la lista de flujos de la solución): crear filas dispara el flujo de **Added** (`SC - Aprobar solicitud`). Los de **Modified** no se disparan al crear, pero los apagas también por si la carga, o un ajuste posterior, escribe el importe. Los vuelves a encender al terminar.
2. En la tabla `Solicitud de compra` añade dos columnas: `Fecha de solicitud` (**Date Only**) e `ID de origen` (**Text**). La segunda guarda el identificador del Excel (`SC-2026-0008`…): el Lab 132 la convertirá en clave alternativa para evitar duplicados. Anota sus logical names.
3. Anota los **valores numéricos** de las tres opciones de `Estado solicitud` (**Pendiente**, **Aprobada**, **Rechazada**) al editar la columna.

### Tarea 6.2 — El mapa de estados

4. Añade una **Compose** `Mapa de estados` al principio del flujo, con un objeto cuyos números son **los tuyos**:

```text
{
  "Pendiente": 123450000,
  "Aprobada": 123450001,
  "Rechazada": 123450002
}
```

5. Después de `Filas validas`, **Filter array** `Pendientes`: **From** = **Outputs** de `Filas validas`, condición `@equals(item()?['Estado'], 'Pendiente')`.

### Tarea 6.3 — Crear las filas

6. **For each** (o **Apply to each**) sobre **Outputs** de `Pendientes`. Dentro, **Microsoft Dataverse** > **Add a new row**, **Table name** `Solicitudes de compra`:

| Columna | Valor |
|---|---|
| `Título` | `concat(items('For_each_1')?['Id'], ' — ', items('For_each_1')?['Descripcion'])` |
| `Área` | `Area` del elemento |
| `Categoría` | `Categoria` del elemento |
| `Cantidad` | `Cantidad` del elemento |
| `Precio unitario` | `Precio` del elemento |
| `Importe` | `Importe` del elemento |
| `Nivel de aprobación` | `if(lessOrEquals(items('For_each_1')?['Importe'], 1000), 1, if(lessOrEquals(items('For_each_1')?['Importe'], 10000), 2, 3))` |
| `Estado solicitud` | `coalesce(outputs('Mapa_de_estados')?[items('For_each_1')?['Estado']], outputs('Mapa_de_estados')?['Pendiente'])` |
| `Correo del solicitante` | `Solicitante` del elemento |
| `Fecha de solicitud` | `Fecha` del elemento |
| `ID de origen` | `Id` del elemento |

   (`Pendientes` es un **Filter array** sobre la salida de una **Select**: no tiene esquema y **Dynamic content** solo ofrece el elemento entero, así que escribe cada valor con **fx**, por ejemplo `items('For_each_1')?['Area']`. El nombre del bucle es el que ves en el diseñador, con guiones bajos.) `outputs('Mapa_de_estados')?[ ... ]` busca en el objeto con una clave que viene de los datos. `coalesce` pone **Pendiente** si llegara un estado desconocido en lugar de fallar.
7. **Save** y **Test**. **No lo ejecutes dos veces**: lo que pasaría es parte de las preguntas de repaso.

### Resultado esperado del Ejercicio 6

Cinco filas nuevas en la tabla, todas en **Pendiente**:

| ID de origen | Categoría | Importe | Nivel | Fecha |
|---|---|---|---|---|
| SC-2026-0008 | Viajes | 960 | 1 | 2026-10-22 |
| SC-2026-0100 | Papelería | 279 | 1 | 2026-10-23 |
| SC-2026-0035 | Viajes | 2160 | 2 | 2026-10-24 |
| SC-2026-0114 | Tecnología | 6800 | 2 | 2026-10-27 (en el Excel era `27/10/2026`) |
| SC-2026-0048 | Papelería | 798 | 1 | 2026-10-28 |

Suma de importes: **10.997**. Sin aprobaciones ni correos: los tres flujos estaban apagados.

### Tarea 6.4 — Volver a encender

8. Enciende de nuevo `SC - Aprobar solicitud`, `SC - Alertar compra grande` y `SC - Avisar a TI`.

> **Qué no resolvimos:** esas cinco filas están en Pendiente, pero **nadie les pidió aprobación** (los flujos estaban apagados cuando se crearon). En una importación real habría que decidir si se les lanza el proceso o se cargan con el estado final del sistema anterior. Es una decisión del Lab 133 y del Lab 139.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Filas nuevas y suma de sus importes | ___ y ___ (esperado: 5 y 10997) |
| Fecha guardada de SC-2026-0114 | ___ (esperado: 2026-10-27) |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `float` o `int` falla con "cannot be converted" | Una celda con texto (`USD 2.00`) o vacía llegó al convertir | Limpia antes (Ejercicio 3); prueba cada expresión en una **Compose** |
| La acción **Select** "no tiene Map de texto" | El diseñador tiene otro modo | Usa los pares **Enter key** / **Enter value** |
| Las fechas dd/mm salen con el mes y el día cambiados | Se usó `parseDateTime` sin la cultura o `formatDateTime` sobre un texto ambiguo | Construye el texto ISO con `substring` (Ejercicio 3) |
| El total de `TotalImporte` es menor que el esperado | **Concurrency control** activado en el **Apply to each** | Desactívalo |
| El flujo lee solo 256 filas (o menos) de una tabla grande | **Pagination** desactivada | Actívala en **Settings** de la acción (Lab 138) |
| La importación lanza decenas de aprobaciones | Los flujos de negocio estaban encendidos | Apágalos durante la carga (Ejercicio 6) |
| `outputs('Mapa_de_estados')?[...]` da `null` | La clave no coincide (mayúsculas, espacios) | Compara con `trim` y revisa las claves del objeto |

## 🔧 Diagnóstico y reparación

### "El flujo falla en `Calcular importes` y no sé en qué fila"

1. **Abre la ejecución** y la acción en rojo: el mensaje nombra la función y el valor.
2. **Busca la fila** en la salida de `Limpiar filas` (la que sí terminó): el valor raro suele estar ahí.
3. **Reproduce con una Compose** y ese valor escrito a mano.
4. **Arregla la expresión** o rechaza la fila antes de convertirla, y vuelve a probar.

## Checklist final

- [ ] `SC - Importar y limpiar histórico` con las etapas leer, limpiar y cargar
- [ ] Las cuatro cuentas de suciedad (17, 13, 4, 11) coinciden
- [ ] 146 filas válidas, 4 rechazadas con su motivo, 16 en marzo y 21 en octubre
- [ ] `TotalImporte` = 458365
- [ ] Cinco filas pendientes en Dataverse con su fecha original y su ID de origen
- [ ] Los tres flujos de negocio vueltos a encender

## Evidencia esperada

- Captura de la ejecución con las salidas de las cuatro cuentas de suciedad
- Captura del correo del informe de calidad (cuentas y tabla de rechazadas)
- Captura de la tabla `Solicitudes de compra` con las cinco filas importadas
- Tus respuestas de validación

## Criterios de aprobación

- Mediste la suciedad **antes** de limpiarla y las cuentas coinciden con las esperadas
- Cada expresión de limpieza se probó con un valor fijo
- Las filas sin cantidad se rechazan y se informan, no se inventan
- El total y la carga a Dataverse coinciden con las cifras esperadas, sin dejar aprobaciones pendientes por la importación

## Competencias desarrolladas

- Leer archivos de Excel desde un flujo y entender los tipos que devuelve el conector
- Limpiar textos, fechas, números y nulos con expresiones
- Usar **Select**, **Filter array**, **Compose** y variables y elegir entre ellas
- Cargar datos a Dataverse sin disparar los procesos de negocio
- Informar la calidad de los datos, no solo limpiarlos

## Reto adicional

**Reto básico:** en el informe de calidad, añade cuántas filas tenían la fecha en formato `dd/mm/yyyy` y cuántas el precio con texto, usando las cuentas del Ejercicio 2.

**Reto intermedio:** calcula el importe total **por categoría** de las filas válidas (la expresión `union` sobre las categorías devuelve los valores únicos; para cada una, un **Filter array** y una variable). Compara con: Capacitación 92.100, Mobiliario 57.805, Papelería 19.740, Servicios profesionales 128.625, Tecnología 97.210, Viajes 62.885.

**Reto avanzado:** en vez de rechazar las cuatro filas sin cantidad, haz que el flujo **envíe un correo a cada solicitante** pidiéndole el dato. Anota en dos líneas qué problema nuevo aparece (¿y si pasa el mismo día mañana? ¿se envía otro correo?).

## Preguntas de repaso

1. ¿Por qué una sola celda con texto hace fallar toda una acción **Select** y qué haces para evitarlo?
2. ¿Cuándo usarías **Compose** y cuándo una variable?
3. ¿Por qué se encadenaron dos **Select** en lugar de calcular el importe en la primera?
4. ¿Qué pasaría si ejecutaras la carga del Ejercicio 6 dos veces? ¿Cómo lo evitarías? (pista: el campo `ID de origen`)

## Limpieza del laboratorio

Conserva el flujo `SC - Importar y limpiar histórico` y las cinco filas: el Lab 132 trabaja con ellas. Comprueba que los tres flujos de negocio están **encendidos** otra vez. Si ejecutaste la carga dos veces, borra las filas duplicadas desde la tabla.

## Siguiente laboratorio recomendado

**Lab 131 — Aprobaciones de verdad** (siguiente): aprobaciones secuenciales y en paralelo, "todos deben aprobar", respuestas personalizadas, reasignación, vencimiento y escalado.
