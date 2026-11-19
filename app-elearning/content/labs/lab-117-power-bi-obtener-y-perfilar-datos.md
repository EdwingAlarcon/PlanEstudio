---
id: lab-117
title: "Power BI — Obtener y perfilar datos (Ruta Pro Power BI)"
level: "N2"
duration: 165
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 116 completado — paquete SIT Ventas descomprimido en C:\\PowerBI\\sit-ventas"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 117 — Power BI: obtener y perfilar datos

## Objetivo

Conectar los datos como se hace en un proyecto real: una ruta de carpeta que se cambia en un solo sitio (parámetro), una carpeta entera de archivos mensuales, un archivo exportado con fechas en formato regional y un JSON publicado en la web. Antes de transformar nada, **perfilarás** cada origen para encontrar lo que está mal, incluido un problema que no produce ningún error y por eso pasa desapercibido. Cubre la parte "Get or connect to data" y "Profile and clean the data" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 116.

**Problema a resolver:** el reporte del Lab 116 solo tenía 2025. La gerente comercial quiere ver tres años, pero los datos llegan de tres formas distintas: 2024 lo exportó un sistema antiguo con las fechas en formato día/mes/año; 2026 llega como un archivo por mes en una carpeta compartida; y finanzas publica los tipos de cambio en un JSON. El mes pasado, alguien comentó que "el número de pedidos de marzo no cuadra con el sistema", y nadie sabe por qué.

**Por qué empezar perfilando:** un dato mal leído al conectar contamina todo lo que viene después. En este lab no limpias todavía (eso es el Lab 118): **conectas bien y averiguas qué está mal**.

## Lo que vas a construir

- Un archivo nuevo `ruta-pro-sit-ventas.pbix` que seguirá creciendo en los Labs 118 y 119
- Un parámetro `CarpetaDatos` con la ruta de la carpeta, usado por todas las consultas de archivos
- La consulta `Ventas2026`, que combina los 10 archivos mensuales de la carpeta `ventas-2026`
- La consulta `Ventas2024`, con las fechas leídas en el formato correcto y sin errores
- La consulta `TiposCambio`, conectada por web al JSON del curso
- Un diagnóstico escrito de la fila que hace que "marzo no cuadre"

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Lab 116: conectar un CSV y un Excel, perfilar `Clientes` | Parámetros, carpetas, configuración regional, web, privacidad y modos de almacenamiento | Lab 118 transforma y une estas consultas; Lab 119 modela el resultado |

> **Fuente del esqueleto:** labs 1 y 2 del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y la sección "Prepare the data" de su [guía de estudio](https://learn.microsoft.com/credentials/certifications/resources/study-guides/pl-300). El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Parámetro con la ruta de los datos | 15 min |
| Ejercicio 2 — Combinar la carpeta de 2026 | 30 min |
| Ejercicio 3 — Perfilar 2026: por qué marzo no cuadra | 30 min |
| Ejercicio 4 — 2024 y las fechas en formato regional | 30 min |
| Ejercicio 5 — Tipos de cambio por web y niveles de privacidad | 25 min |
| Ejercicio 6 — Modos de almacenamiento | 15 min |
| Ejercicio 7 — Mover la carpeta sin romper nada | 10 min |
| **Total** | **unas 2 h 45 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: Power Query (parámetros, conector **Folder**, **Text/CSV**, **Web**), herramientas de perfilado
- Conexión a internet (solo para el Ejercicio 5)

## Prerrequisitos

### Entorno

- [ ] Power BI Desktop en Windows, como en el Lab 116 (si lo usas en español, mira [Idioma de Power BI Desktop](/labs/lab-116-power-bi-en-un-dia#idioma-de-power-bi-desktop) en el Lab 116)
- [ ] La carpeta `C:\PowerBI\sit-ventas\` del Lab 116 con todos los archivos (si no la tienes, descarga [sit-ventas.zip](/practice-assets/powerbi/sit-ventas/sit-ventas.zip) y extráelo en `C:\PowerBI`)

### Conocimiento previo

- Lab 116: conectar un CSV, ver los tipos de dato y activar **Column quality**, **Column distribution** y **Column profile**

### Verificación rápida antes de empezar

- [ ] Existen `C:\PowerBI\sit-ventas\ventas-2024.csv` y la carpeta `C:\PowerBI\sit-ventas\ventas-2026\` con 10 archivos

## Datos de apoyo

| Origen | Qué trae |
|---|---|
| `ventas-2026\` | 10 CSV, enero a octubre de 2026 |
| `ventas-2024.csv` | Líneas de pedido de 2024, exportadas por un sistema antiguo |
| `tipos-cambio.json` | Tipo de cambio mensual USD → COP, MXN, PEN, CLP |

Cada origen tiene algo raro. No te lo contamos aquí: descubrirlo es el ejercicio.

El JSON también está publicado por la app del curso en `https://planestudio.vercel.app/practice-assets/powerbi/sit-ventas/tipos-cambio.json`, que es la dirección que usarás en el Ejercicio 5.

---

## Ejercicio 1 — Parámetro con la ruta de los datos

**Objetivo:** escribir la ruta de la carpeta en un solo sitio. Si mañana la carpeta se mueve (o pasa a SharePoint), cambias el parámetro y no cada consulta.

### Tarea 1.1 — Crear el parámetro

1. Abre Power BI Desktop, crea un reporte en blanco y guárdalo como `C:\PowerBI\ruta-pro-sit-ventas.pbix`.
2. Abre Power Query: en la pestaña **Home**, **Transform data**.
3. En la pestaña **Home** de Power Query, despliega **Manage Parameters** y elige **New Parameter** ([Learn: parameters](https://learn.microsoft.com/power-query/power-query-query-parameters)).
4. Completa:

| Campo | Valor |
|---|---|
| **Name** | `CarpetaDatos` |
| **Description** | `Carpeta con los archivos de SIT Ventas, terminada en \` |
| **Required** | marcado |
| **Type** | **Text** |
| **Suggested Values** | **Any value** |
| **Current Value** | `C:\PowerBI\sit-ventas\` (con la barra final) |

5. Pulsa **OK**. El parámetro aparece en el panel **Queries** con un ícono propio.

> **La barra final importa:** las consultas construirán rutas como `CarpetaDatos & "ventas-2024.csv"`. Sin la `\` final quedaría `...sit-ventasventas-2024.csv`.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Valor actual de `CarpetaDatos` | ___ |

---

## Ejercicio 2 — Combinar la carpeta de 2026

**Objetivo:** convertir 10 archivos con la misma estructura en una sola tabla, de forma que el mes 11 entre solo cuando lo copien a la carpeta.

### Tarea 2.1 — Conectar la carpeta

1. En Power Query, pestaña **Home**, **New Source** > **More...** > **Folder** > **Connect** (o, desde Power BI Desktop, **Get data** > **More...** > **Folder** > **Connect**) ([Learn: Folder connector](https://learn.microsoft.com/power-query/connectors/folder)).
2. En **Folder path** escribe `C:\PowerBI\sit-ventas\ventas-2026` y pulsa **OK**.
3. Verás la lista de los 10 archivos (nombre, extensión, fechas, ruta). Selecciona **Combine & Transform Data** (si ves un botón **Combine** con menú, despliégalo).
4. Se abre el diálogo **Combine files**. En **Example file** deja el primer archivo y comprueba en la vista previa que la coma es el delimitador y que las tildes se ven bien. Pulsa **OK** ([Learn: combine files](https://learn.microsoft.com/power-query/combine-files-overview)).

### Tarea 2.2 — Entender lo que creó Power Query

En el panel **Queries** aparecen consultas nuevas:

- Un grupo **Helper queries** ([Learn: combine files](https://learn.microsoft.com/power-query/combine-files-overview)). Dentro verás cuatro elementos: un parámetro (`Parameter1`), **Sample File** (el archivo de ejemplo, que **tiene la ruta de la carpeta escrita**), **Transform Sample file** (los pasos que se aplican a cada archivo) y una función **Transform File**. Los pasos que añadas a **Transform Sample file** se aplican **a cada archivo** antes de combinarlos.
- La consulta final, con el nombre de la carpeta (`ventas-2026`). Renómbrala a `Ventas2026`.

En `Ventas2026` mira la primera columna, `Source.Name`: dice de qué archivo vino cada fila. **Déjala**: en el Ejercicio 3 te dirá en qué archivo está el problema.

### Tarea 2.3 — Usar el parámetro en la ruta

1. Con `Ventas2026` seleccionada, en la pestaña **Home** abre **Advanced Editor**.
2. En la primera línea verás algo como `Source = Folder.Files("C:\PowerBI\sit-ventas\ventas-2026"),`. Cámbiala por:

```m
Source = Folder.Files(CarpetaDatos & "ventas-2026"),   // la ruta sale del parámetro
```

3. Pulsa **Done**.
4. **Haz lo mismo en Sample File** (grupo **Helper queries**): abre su **Advanced Editor** y cambia también su `Folder.Files("C:\PowerBI\sit-ventas\ventas-2026")` por `Folder.Files(CarpetaDatos & "ventas-2026")`. Si te lo saltas, `Ventas2026` seguirá dependiendo de la ruta escrita a mano (lo comprobarás en el Ejercicio 7).
5. Si no aparece ningún error, la consulta sigue leyendo los mismos 10 archivos.

### Resultado esperado del Ejercicio 2

`Ventas2026` con las columnas `Source.Name`, `PedidoID`, `Linea`, `FechaPedido`, `FechaEntrega`, `ClienteID`, `ProductoID`, `VendedorID`, `RegionID`, `Cantidad`, `PrecioUnitario` y `DescuentoPct`, y la ruta tomada del parámetro.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Consultas que creó **Combine files** (nombres) | ___ |
| Consultas en las que cambiaste la ruta por `CarpetaDatos` | ___ (esperado: 2, `Ventas2026` y **Sample File**) |
| Valores distintos de `Source.Name` | ___ (esperado: 10) |

---

## Ejercicio 3 — Perfilar 2026: por qué marzo no cuadra

**Objetivo:** usar el perfilado para encontrar un problema que **no da ningún error**.

### Tarea 3.1 — Activar el perfilado sobre todas las filas

1. En la pestaña **View**, grupo **Data preview**, activa **Column quality**, **Column distribution** y **Column profile** ([Learn: data profiling tools](https://learn.microsoft.com/power-query/data-profiling-tools)).
2. Abajo a la izquierda, cambia **Column profiling based on top 1000 rows** a **Column profiling based on entire data set**. Con solo 1.000 filas, el perfilado diría **Count** = 1.000 (no 1.359) y contaría menos `PedidoID` distintos: cifras que parecen reales y no lo son. Un perfilado parcial es útil para mirar formatos, pero no para contar.

### Tarea 3.2 — Mirar columna por columna

Selecciona cada columna y anota lo que dice **Column profile** (estadísticas de la izquierda) y **Column quality** (la barra de arriba de cada columna):

| Columna | Qué mirar | Tu valor |
|---|---|---|
| (cualquiera) | **Count** = filas totales | ___ |
| `PedidoID` | **Distinct**. Luego abre el filtro del encabezado: la lista de valores está en orden alfabético; baja hasta el final y mira si hay alguno que no empiece por `PED-` (no apliques el filtro) | ___ |
| `Linea` | ¿Hay valores vacíos (**Empty**) o nulos? ¿Cuántos? | ___ |
| `FechaEntrega` | ¿Cuántos vacíos o nulos? | ___ |
| `DescuentoPct` | **Max**. ¿Tiene sentido para un porcentaje? | ___ |

### Tarea 3.3 — Encontrar la fila

1. En `DescuentoPct`, abre el filtro (flecha del encabezado) y ordena de mayor a menor (**Sort descending**). La primera fila es la sospechosa.
2. Mira esa fila entera y su `Source.Name`.
3. **No la borres todavía:** quita el paso de orden en **Applied Steps** (la **X**) para dejar la consulta como estaba. La limpieza va en el Lab 118.

### Resultado esperado del Ejercicio 3

| Hallazgo | Valor |
|---|---|
| Filas de `Ventas2026` | **1.359** (1.358 líneas de pedido + 1 fila extra) |
| `PedidoID` distintos | **706** (705 pedidos reales + `TOTAL MARZO`) |
| La fila extra | `PedidoID` = `TOTAL MARZO`, en `ventas-2026-03.csv` (la fila 403 de la tabla combinada), con todo vacío salvo `DescuentoPct`, donde alguien escribió el total de marzo, `2416338.7` |
| `DescuentoPct` de esa fila, ya convertido | **2416339** si tu Power BI está en inglés (redondeado a número entero) o **24163387** si está en español (el punto se lee como separador de miles). Comprobado con el motor de Power Query. En los dos casos, sin error |
| `FechaEntrega` vacías | **55**: 54 pedidos aún sin entregar + la fila de total |

> **Por qué no da error:** al convertir los tipos, los campos vacíos de esa fila pasan a `null`, y `2416338.7` se puede leer como número (bien o mal, según el idioma). Power Query no tiene motivo para quejarse. El daño aparece después: la medida `Pedidos` contaría 706 en vez de 705, y el máximo de `DescuentoPct` sería absurdo. Comprobado con el motor de Power Query sobre estos mismos archivos. **Esto es lo que no cuadraba en marzo.**

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Filas de `Ventas2026` | ___ |
| `PedidoID` de la fila extra y archivo de origen | ___ |
| En una frase: qué le dirías a la gerente sobre "marzo no cuadra" | ___ |

---

## Ejercicio 4 — 2024 y las fechas en formato regional

**Objetivo:** leer bien un archivo cuyas fechas dependen del idioma, sin depender de cómo está configurado tu Windows. Cubre "resolve data import errors" de PL-300.

### Tarea 4.1 — Conectar y quitar la detección automática

1. **New Source** > **Text/CSV** > `C:\PowerBI\sit-ventas\ventas-2024.csv` > **OK**. Renombra la consulta a `Ventas2024`.
2. Abre **Advanced Editor**. La línea del paso `Source` se parece a esta (los parámetros entre corchetes pueden variar):

   ```m
   Source = Csv.Document(File.Contents("C:\PowerBI\sit-ventas\ventas-2024.csv"),[Delimiter=",", Columns=11, Encoding=65001, QuoteStyle=QuoteStyle.None]),
   ```

   Cambia **solo** lo que está dentro de `File.Contents(...)`, sin tocar el resto:

   ```m
   Source = Csv.Document(File.Contents(CarpetaDatos & "ventas-2024.csv"),[Delimiter=",", Columns=11, Encoding=65001, QuoteStyle=QuoteStyle.None]),
   ```
3. En **Applied Steps**, el último paso es **Changed Type**: Power BI adivinó los tipos usando la configuración regional de tu archivo, que por defecto sale de tu Windows. **Bórralo** con la **X**. Así todas las columnas vuelven a texto y el resultado ya no depende del equipo de cada persona.

### Tarea 4.2 — Ver el error a propósito

1. Haz clic derecho sobre el encabezado de `FechaPedido` > **Change type** > **Using locale** ([Learn: data types](https://learn.microsoft.com/power-query/data-types)).
2. En el diálogo **Change column type with locale** elige el tipo **Date** y el idioma **English (United States)**. Pulsa **OK**.
3. Mira **Column quality** de `FechaPedido`. Verás errores en rojo; el número exacto está en **Column profile** (estadística **Error**), con el perfilado sobre todas las filas. Selecciona la columna y, en la pestaña **Home**, grupo **Reduce rows**, **Keep rows** > **Keep errors**: quedan solo las filas con error ([Learn: dealing with errors](https://learn.microsoft.com/power-query/dealing-with-errors)). Haz clic en una celda `Error` para leer el mensaje.

**Anota:**

| Campo | Tu valor |
|---|---|
| Filas con error | ___ (esperado: **719**) |
| Mensaje de error de una celda | ___ |

4. Ahora lo importante: de las filas **sin** error (1.199 − 719 = **480**), **438 están mal**. Son las fechas cuyo día es 12 o menos, como `03/01/2024`: en inglés de EE. UU. se leen como mes/día, así que el 3 de enero quedó como el 1 de marzo. Solo 42 aciertan, y por casualidad: las que tienen el mismo día y mes, como `05/05/2024`. **Un error que no se ve es peor que uno que se ve.**
5. Borra los dos últimos pasos (**Kept Errors** y el cambio de tipo) con la **X**.

### Tarea 4.3 — Leerlo bien

1. Clic derecho en `FechaPedido` > **Change type** > **Using locale** > tipo **Date**, idioma **Spanish (Colombia)** (o cualquier español: todos usan día/mes/año). Repite con `FechaEntrega`.
2. Pon a las demás columnas los tipos del Lab 116 (Tarea 3.2) con el ícono de cada encabezado. Si te pregunta si reemplazar el paso, elige **Replace current**.
3. Comprueba en **Column quality** que `FechaPedido` y `FechaEntrega` tienen 0 % de errores, y que la primera fila es el **13 de enero de 2024** (se verá como `13/01/2024` o `1/13/2024` según el formato de fecha de tu Windows).

> **Regla práctica:** cuando un archivo trae fechas como texto, conviértelas con **Using locale** indicando el idioma **del archivo**, no el de tu equipo. Así el informe funciona igual en el portátil de la gerente en Madrid que en el servidor de la oficina de Monterrey.

### Resultado esperado del Ejercicio 4

`Ventas2024` con **1.199** filas, fechas sin errores y la primera fecha de pedido = **2024-01-13**.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Errores con English (United States) | ___ |
| Errores con español | ___ (esperado: 0) |
| Por qué casi todas las 480 filas "sin error" en inglés estaban mal, y cuáles se salvan | ___ |

---

## Ejercicio 5 — Tipos de cambio por web y niveles de privacidad

**Objetivo:** conectar un origen web, convertir un JSON anidado en tabla y entender los niveles de privacidad, que deciden qué orígenes pueden combinarse.

### Tarea 5.1 — Conectar el JSON

1. **New Source** > **Web**. Con la opción **Basic**, pega la dirección `https://planestudio.vercel.app/practice-assets/powerbi/sit-ventas/tipos-cambio.json` y pulsa **OK** ([Learn: Web connector](https://learn.microsoft.com/power-query/connectors/web/web)). Si te pide credenciales, elige **Anonymous** (es un archivo público).
2. Este JSON es un objeto con tres campos (`base`, `fuente` y `meses`), así que lo más probable es que veas **un registro** con esos tres campos. En ese caso:
   - Haz clic en el valor **List** del campo `meses`. Verás una lista de registros.
   - Conviértela en tabla con **To Table** (pestaña **Transform** de las herramientas de lista) y acepta las opciones por defecto.
   - Expande la columna resultante (`Column1`) con el botón de expandir de su encabezado (dos flechas), marca `mes` y `tasas` y **desmarca Use original column name as prefix**. Si no lo desmarcas, las columnas se llamarán `Column1.mes` y `Column1.tasas`.

   Learn indica que Power Query detecta tablas dentro de un JSON y puede aplanarlo automáticamente ([Learn: JSON](https://learn.microsoft.com/power-query/connectors/json)). Si en vez del registro ves directamente **una tabla** con una fila por mes, sáltate este paso.
3. Si la columna `tasas` sigue mostrando **Record**, expándela con el botón de su encabezado y marca `COP`, `MXN`, `PEN` y `CLP`. Desmarca **Use original column name as prefix**.
4. Renombra la consulta a `TiposCambio`. Pon tipo **Text** a `mes` y **Decimal number** a las cuatro tasas.

**Resultado:** una tabla de **34** filas (enero de 2024 a octubre de 2026) con las columnas `mes`, `COP`, `MXN`, `PEN` y `CLP`. Comprobación: en `2025-01`, `COP` = **4158.78**.

> Este JSON es una copia fija del curso: los tipos de cambio son **inventados**, no los uses para nada real.

### Tarea 5.2 — Niveles de privacidad

Cuando una consulta combina datos de dos orígenes, Power Query necesita saber si puede mandar los datos de uno hacia el otro. Para eso cada origen tiene un nivel de privacidad: **None**, **Private**, **Organizational** o **Public** ([Learn: privacy levels](https://learn.microsoft.com/power-bi/enterprise/desktop-privacy-levels)).

1. Cierra Power Query con **Close & Apply** (en la pestaña **Home**). Se cargan las tablas.
2. En Power BI Desktop, pestaña **Home**, **Transform data** > **Data source settings** (también está en la pestaña **Home** de Power Query). Verás tres orígenes: la carpeta `ventas-2026`, el archivo `ventas-2024.csv` y la web.
3. Selecciona el origen web > **Edit Permissions** > nivel de privacidad **Public** (son datos publicados para cualquiera). A cada uno de los dos orígenes de archivo: **Edit Permissions** > **Organizational**.
4. Cierra el diálogo.

| Nivel | Cuándo usarlo | En este lab |
|---|---|---|
| **Private** | Datos sensibles que no deben combinarse con nada (nóminas, salud) | — |
| **Organizational** | Datos internos que pueden combinarse con otros orígenes de la organización | Archivos de SIT |
| **Public** | Datos que cualquiera puede ver | El JSON de tipos de cambio |

> **El error que verás algún día:** si una misma consulta lee de un origen **y** usa otra consulta que lee de otro origen, Power Query la detiene con un mensaje del tipo *"Query 'X' (step 'Y') references other queries or steps, so it may not directly access a data source. Please rebuild this data combination."* (lo vimos al probar este lab). Este error depende de **cómo está construida la consulta**, no del nivel de privacidad que elijas. La solución sana es la de este lab: **cada consulta lee de un solo origen** (`Ventas2026`, `Ventas2024`, `TiposCambio`) y las combinaciones se hacen en consultas que solo **referencian** otras (Lab 118). Existe la opción de ignorar los niveles de privacidad (**Ignore the Privacy Levels and potentially improve performance**), pero Learn advierte que configurar mal la privacidad puede filtrar datos sensibles fuera de un entorno de confianza: no la uses como atajo.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Filas de `TiposCambio` | ___ (esperado: 34) |
| `COP` de `2025-01` | ___ |
| Nivel de privacidad de cada origen | ___ |

---

## Ejercicio 6 — Modos de almacenamiento

**Objetivo:** saber elegir entre Import, DirectQuery y Direct Lake, que PL-300 pregunta aunque en este lab solo uses archivos.

Lee y completa la última columna:

| Modo | Qué hace (Learn) | ¿Lo puedes usar con archivos CSV? |
|---|---|---|
| **Import** | Guarda una copia de los datos en el modelo; los visuales cargan rápido ([Learn: storage mode](https://learn.microsoft.com/power-bi/transform-model/desktop-storage-mode)) | ___ |
| **DirectQuery** | Consulta el origen cada vez que un visual carga; los datos no se guardan en el modelo | ___ |
| **Direct Lake** | Modo de almacenamiento de tablas de un semantic model disponible en Microsoft Fabric, que lee las tablas del lago ([Learn: Direct Lake](https://learn.microsoft.com/fabric/fundamentals/direct-lake-overview)) | ___ |

**Decide** para cada caso y escribe por qué:

| Caso | Tu modo | Por qué |
|---|---|---|
| Los archivos de SIT que llegan una vez al mes | ___ | ___ |
| Una base SQL de pedidos con 200 millones de filas que debe verse al minuto | ___ | ___ |
| Tablas de un lakehouse de Fabric que ya usa toda la empresa | ___ | ___ |

**Respuesta orientativa** (léela después de decidir): Archivos mensuales: **Import**; los archivos no admiten DirectQuery y el volumen es pequeño. SQL enorme y casi en tiempo real: **DirectQuery**, aceptando visuales más lentos (o un modelo compuesto, que verás en el Módulo 35). Lakehouse de Fabric: **Direct Lake**, que evita copiar los datos y no consulta el origen por cada visual.

**Opcional, si publicaste el Lab 116:** en un archivo nuevo, **Get data** > **Power BI semantic models** y elige el modelo del Lab 116 ([Learn: connect to semantic models](https://learn.microsoft.com/power-bi/connect-data/desktop-report-lifecycle-datasets)). Es una conexión en vivo: puedes crear visuales y medidas de informe, pero Learn indica que no puedes modificar el modelo (añadir columnas o tablas), salvo que lo conviertas en un modelo compuesto (Módulo 35). Anota qué vistas de la barra izquierda desaparecen.

---

## Ejercicio 7 — Mover la carpeta sin romper nada

**Objetivo:** comprobar que el parámetro sirve.

1. Cierra Power BI Desktop guardando. En el Explorador de Windows, cambia el nombre de `C:\PowerBI\sit-ventas` a `C:\PowerBI\datos-sit`.
2. Abre `ruta-pro-sit-ventas.pbix` y pulsa **Refresh** (pestaña **Home**). Fallará: la carpeta ya no existe. Anota el mensaje.
3. Abre Power Query con **Transform data** y, en su pestaña **Home**, **Manage Parameters**. Cambia **Current Value** de `CarpetaDatos` a `C:\PowerBI\datos-sit\` y pulsa **OK**. **Close & Apply**. (También puedes usar el desplegable de **Transform data** > **Edit parameters** sin abrir Power Query.)
4. Todo vuelve a cargar con un solo cambio. La ruta nueva aparece en **Data source settings** como un origen nuevo, sin nivel de privacidad: asígnale **Organizational** como en la Tarea 5.2. Si quieres, deja la carpeta con el nombre nuevo y el parámetro apuntando a ella; si prefieres, revierte ambos.

> **¿Y el JSON?** No depende de la carpeta: viene de la web. Por eso no se rompió.

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Mensaje de error al actualizar con la carpeta renombrada | ___ |
| Cuántas consultas tuviste que tocar para arreglarlo | ___ (esperado: ninguna, solo el parámetro, si en la Tarea 2.3 parametrizaste también **Sample File**) |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `DataSource.NotFound` o "could not find a part of the path" | Falta la `\` final en `CarpetaDatos`, la carpeta cambió de sitio, o **Sample File** conserva la ruta antigua | Revisa **Current Value** del parámetro y el `Folder.Files` de **Sample File** (Tarea 2.3, paso 4) |
| `Ventas2026` tiene 12 columnas pero una se llama `Column1` | El archivo de ejemplo no tenía encabezados detectados | En **Transform Sample file**, comprueba el paso de promover encabezados |
| Todas las fechas de 2024 dan error o salen raras | Quedó el paso **Changed Type** automático o elegiste otro idioma | Tarea 4.1, paso 3, y Tarea 4.3 |
| "Information is required about data privacy" | Aún no definiste niveles de privacidad | Tarea 5.2 |
| El conector **Web** pide iniciar sesión | Elegiste otro método de autenticación | **Anonymous** |

## 🔧 Diagnóstico y reparación

### Mis números del Ejercicio 3 no coinciden

1. **¿Cambiaste el perfilado a "entire data set"?** Con 1.000 filas, **Count** dirá 1.000 y **Distinct** contará menos pedidos. La fila de total sí aparece (es la 403), pero las cifras no.
2. **¿Combinaste otra carpeta?** `Source.Name` debe tener exactamente los 10 archivos `ventas-2026-01.csv` a `ventas-2026-10.csv`.

### Con español sigo teniendo errores en las fechas de 2024

1. **Revisa Applied Steps.** Si quedó un paso de cambio de tipo anterior (el **Changed Type** automático u otro tuyo), ese paso ya convirtió las fechas con otra configuración regional antes que el tuyo.
2. **Revisa que convertiste con Using locale y no con el ícono.** El ícono usa la configuración regional del archivo; **Using locale** usa la que tú eliges.

## Checklist final

- [ ] `CarpetaDatos` existe y las consultas de archivos lo usan
- [ ] `Ventas2026` combina los 10 archivos y sé qué fila sobra y por qué no da error
- [ ] `Ventas2024` tiene 1.199 filas y fechas sin errores, leídas como día/mes/año
- [ ] `TiposCambio` tiene 34 filas, conectada por web
- [ ] Los dos orígenes tienen nivel de privacidad definido
- [ ] Completé la tabla de decisión de modos de almacenamiento
- [ ] Moví la carpeta y lo arreglé cambiando solo el parámetro

## Evidencia esperada

- Captura del **Column profile** de `PedidoID` en `Ventas2026` con el perfilado sobre todas las filas
- Captura de **Keep errors** en `Ventas2024` con English (United States), y otra de la columna sin errores con español
- Captura de **Data source settings** con los dos niveles de privacidad
- Tu frase para la gerente sobre "marzo no cuadra" y la tabla de modos de almacenamiento
- El archivo `ruta-pro-sit-ventas.pbix`

## Criterios de aprobación

- Las consultas de archivos usan el parámetro y sobreviven a un cambio de carpeta
- Identificas la fila `TOTAL MARZO` con el perfilado y explicas por qué no produce error
- `Ventas2024` lee las fechas con el idioma del archivo, no con el del equipo
- Defines los niveles de privacidad y explicas cuándo usar cada uno

## Competencias desarrolladas

- Conectar carpetas, CSV y orígenes web, y parametrizar rutas
- Perfilar datos sobre todas las filas para encontrar valores inesperados
- Resolver errores de importación causados por la configuración regional
- Elegir modo de almacenamiento y nivel de privacidad según el origen

## Reto adicional

**Reto básico:** en **Transform Sample file**, añade un filtro que deje solo las filas cuyo `PedidoID` empiece por `PED-` y comprueba que `Ventas2026` pasa a 1.358 filas. (Lo harás formalmente en el Lab 118; aquí solo pruebas que un paso en el archivo de ejemplo se aplica a los 10 archivos.) Después borra el paso.

**Reto intermedio:** cambia el **Type** de `CarpetaDatos` para que ofrezca una **List of values** con dos rutas (`C:\PowerBI\sit-ventas\` y `C:\PowerBI\datos-sit\`). ¿Qué ventaja tiene para alguien que no sabe Power Query?

**Reto avanzado:** escribe en una línea por qué el conector **Web** no necesita una puerta de enlace (gateway) para actualizarse en el servicio y la carpeta local sí. Lo comprobarás en el Lab 126.

## Preguntas de repaso

1. ¿Qué cifras del perfilado serían falsas si lo dejaras sobre las primeras 1.000 filas, y por qué eso es peligroso aunque veas la fila `TOTAL MARZO`?
2. ¿Por qué es peor el resultado sin errores de 2024 en inglés que el que sí da errores?
3. ¿Qué ventaja tiene que cada consulta lea de un solo origen?
4. ¿Qué modo de almacenamiento elegirías para datos que llegan una vez al mes en archivos, y por qué?

## Limpieza del laboratorio

No borres nada: el Lab 118 sigue con este mismo archivo `ruta-pro-sit-ventas.pbix`.

## Siguiente laboratorio recomendado

**Lab 118 — Transformar y cargar:** quitar la fila de total, unir los tres años en una sola tabla de ventas, despivotar los objetivos, cruzar con los tipos de cambio y decidir qué consultas se cargan al modelo.
