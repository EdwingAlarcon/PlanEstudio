---
moduleId: 12
title: "Power BI — DAX Avanzado"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 22
practiceMinutes: 150
slug: "power-bi-dax-avanzado"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 150 min en Power BI Desktop; la primera vez, cuenta entre el doble y el triple. La Microlección 5 (RLS en el servicio) y la profundización de cohortes pueden quedar para una segunda sesión.*

### 🎯 Objetivo
Dominar DAX avanzado: CALCULATE con múltiples filtros, contexto de filtro vs fila, funciones de inteligencia de tiempo, Row Level Security, y métricas de negocio complejas como cohortes y métricas móviles — practicando cada concepto de inmediato sobre un modelo real en tu Power BI Desktop, con evidencia del valor exacto que viste, antes de pasar al siguiente.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y una práctica en Power BI Desktop. Vas a **construir** una medida sin pasos dados, vas a **diagnosticar** un síntoma real antes de ver la causa, y vas a cerrar con un **reto de transferencia** que cambia la regla de negocio (año fiscal en vez de año calendario).
>
> Necesitas: **Power BI Desktop** instalado (lo usaste en el [Módulo 6](/nivel/basico/modulo/power-bi-reportes-y-dashboards-basicos)) y haber completado ese módulo: ahí aprendiste relaciones, **New measure** (nueva medida), formato de medidas y la idea básica de RLS. Aquí no se repite eso. Para la parte opcional de la Microlección 5 en el servicio necesitas un workspace de Power BI con la misma licencia que usaste en el Módulo 6.

---

## Antes de empezar — el modelo de práctica (15 min)

En este módulo no usas el reporte de solicitudes del Módulo 6 (tiene muy pocas filas para notar diferencias entre medidas). Usas el **Financial sample** que Microsoft incluye en Power BI Desktop: una tabla `financials` con ventas por producto, segmento, país y fecha de 2013 y 2014.

1. Abre Power BI Desktop. En la pantalla **Add data to your report** (agregar datos al reporte) elige **Use sample data** (usar datos de ejemplo); si no ves esa pantalla, en la página de inicio busca **Learn with sample data**. Luego elige **Load sample data**.
2. En el **Navigator** marca la tabla **financials** y pulsa **Load**.
   - **Si no aparece la opción de datos de ejemplo:** descarga el libro de Excel del Financial sample desde <https://go.microsoft.com/fwlink/?LinkID=521962>, y en Desktop usa **Home** > **Excel workbook**, elige el archivo y carga la tabla **financials**.
3. Guarda el archivo como `dax-avanzado-financials.pbix`.
4. Abre la vista de tabla (**Table view**) y comprueba que existen estas columnas: `Segment`, `Country/Region` (en versiones antiguas del libro puede llamarse `Country`), `Product`, `Units Sold`, `Sales`, `Profit`, `Date` y `Month Name`. Si el nombre de alguna es distinto, usa el tuyo en todas las fórmulas.
5. Crea la medida base (clic derecho sobre la tabla `financials` en el panel **Data** > **New measure**):

```dax
Total Ventas = SUM(financials[Sales])
```

> **Separadores:** si tu Windows está en un idioma que usa coma decimal, Power BI Desktop puede pedir `;` en vez de `,` entre argumentos. Si una fórmula de este módulo da error de sintaxis sin motivo aparente, prueba a cambiar las comas por punto y coma.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Cómo cargaste los datos (sample integrado o libro descargado) | ___ |
| Número de filas de `financials` (aparece abajo a la izquierda en **Table view**) | ___ |
| Valor de `Total Ventas` en una tarjeta (**Card**) sin filtros, con todos los decimales que muestre | ___ |

---

## 📖 Conceptos clave (referencia rápida)

Estos conceptos se trabajan uno por uno en las microlecciones. Vuelve aquí cuando necesites la definición corta.

- **Contexto de filtro:** el conjunto de filtros activos que deciden qué filas participan en el cálculo de una medida en una celda concreta. Viene de slicers, filtros de visual/página/reporte, de las filas y columnas del propio visual, y se propaga por las relaciones del modelo.
- **Contexto de fila:** existe cuando DAX recorre una tabla fila por fila: en una **columna calculada** y dentro de los **iteradores** (`SUMX`, `AVERAGEX`, `MAXX`, `FILTER`, `RANKX`...). Permite leer columnas de "la fila actual", pero **por sí solo no filtra nada**.
- **Transición de contexto:** cuando `CALCULATE` se evalúa dentro de un contexto de fila, convierte esa fila en un filtro. Toda referencia a una medida (`[Total Ventas]`) lleva un `CALCULATE` implícito, por eso una medida dentro de un iterador sí "ve" la fila actual y un `SUM` suelto no.
- **CALCULATE / CALCULATETABLE:** son las funciones que modifican el contexto de filtro (`CALCULATETABLE` hace lo mismo pero devuelve una tabla). Un filtro de `CALCULATE` sobre una columna **reemplaza** el filtro que ya existía sobre esa misma columna, salvo que lo envuelvas en `KEEPFILTERS`, que lo **intersecta**.
- **REMOVEFILTERS / ALL / ALLEXCEPT / ALLSELECTED:** quitan filtros dentro de `CALCULATE`. `REMOVEFILTERS` es el nombre explícito recomendado cuando solo quieres quitar filtros; `ALL` hace lo mismo como modificador y además puede devolver una tabla. `ALLEXCEPT(tabla, columna)` quita todos los filtros de la tabla excepto los de las columnas indicadas. `ALLSELECTED` conserva los filtros externos al visual (slicers) y quita los del propio visual.
- **FILTER:** devuelve una tabla iterando fila por fila. Úsalo cuando la condición no se puede expresar como filtro simple de columna (por ejemplo, comparar contra una medida). `CALCULATE([M], Tabla[Col] = "X")` es preferible a `CALCULATE([M], FILTER(Tabla, Tabla[Col] = "X"))`, que itera la tabla completa.
- **RELATED / RELATEDTABLE:** `RELATED` trae, en contexto de fila del lado "muchos", un valor del lado "uno"; `RELATEDTABLE` devuelve, desde el lado "uno", las filas relacionadas del lado "muchos".
- **Inteligencia de tiempo (time intelligence):** funciones como `TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`, `DATESINPERIOD` y `DATESBETWEEN`. Las funciones clásicas necesitan una tabla de fechas con una fila por día, sin huecos, y lo recomendable es marcarla como tabla de fechas. Power BI también ofrece una inteligencia de tiempo basada en calendarios (en versión preliminar); este módulo usa la clásica, que es la que encontrarás en la mayoría de modelos existentes.
- **RANKX:** `RANKX(tabla, expresión, [valor], [orden], [empates])`. El orden por defecto es descendente y los empates por defecto son `SKIP` (salta posiciones: 1, 1, 3); `DENSE` no salta (1, 1, 2).
- **Row Level Security (RLS):** roles con filtros DAX definidos en Desktop. Al publicar, se asignan usuarios o grupos de Microsoft Entra ID a cada rol en el modelo semántico (semantic model) del servicio. Los filtros se propagan por las relaciones. **Importante:** RLS solo restringe a quienes tienen rol **Viewer** en el workspace; los roles **Admin**, **Member** y **Contributor** ven todos los datos aunque estén asignados a un rol de RLS.

---

## 🧩 Microlección 1 — Contexto de filtro y CALCULATE

**¿Qué vas a aprender?** A predecir qué valor da una medida en cada celda y a cambiar ese contexto a propósito con `CALCULATE`.

**¿Por qué existe esto?** Casi todas las métricas de negocio necesitan comparar "lo que estoy viendo" contra "otra cosa": el total de la empresa, otro segmento, el año anterior. Una medida simple como `SUM` solo responde con lo que el contexto de filtro deja pasar. `CALCULATE` es la forma de decir "calcula esto, pero con estos filtros cambiados".

**Ejemplo pequeño:**

```dax
// Siempre devuelve las ventas del segmento Government,
// aunque el slicer tenga seleccionado otro segmento:
Ventas Government = CALCULATE([Total Ventas], financials[Segment] = "Government")

// Participación de cada producto dentro de lo que el slicer deja ver:
% del Total Productos =
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], REMOVEFILTERS(financials[Product])),  // quita solo el filtro de producto
    0
)

// Participación sobre el total de la empresa (quita TODOS los filtros de la tabla):
% del Total General =
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], REMOVEFILTERS(financials)),
    0
)
```

**Ahora haz algo — micropráctica (3 min):** antes de construir, decide qué filtro hay que quitar → **[¿Qué filtro quitar para el % del total?](/practica/ip-dv-017-porcentaje-del-total-que-filtro-quitar)**. Te muestra varias versiones del denominador y tienes que elegir las que respetan el slicer de segmento.

**Práctica real en tu entorno (20 min):**

1. Crea las tres medidas del ejemplo. A las dos de porcentaje dales formato de porcentaje en la cinta **Measure tools** (como en el Módulo 6).
2. En la vista de reporte inserta una **Matrix**: en **Rows** pon `financials[Product]`; en **Values** pon `Total Ventas`, `Ventas Government`, `% del Total Productos` y `% del Total General`.
3. Inserta un **Slicer** con `financials[Segment]` y selecciona **Small Business**.
4. Observa: `Ventas Government` **no cambió** al elegir Small Business. Eso es `CALCULATE` reemplazando el filtro de la columna `Segment`.
5. Crea una cuarta medida y agrégala a la matriz:

```dax
Ventas Government KF = CALCULATE([Total Ventas], KEEPFILTERS(financials[Segment] = "Government"))
```

Con Small Business seleccionado debe quedar **en blanco**: `KEEPFILTERS` intersecta (Small Business y Government a la vez no tiene filas). Si no queda en blanco, revisa que el slicer tenga solo Small Business marcado.

**Evidencia a reportar (el dato exacto, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Producto con mayor `Total Ventas` con Small Business seleccionado | ___ |
| Valor de `Ventas Government` en la fila Total con Small Business seleccionado | ___ |
| Valor de `Ventas Government` en la fila Total con **Government** seleccionado (¿coincide con el anterior? ¿por qué?) | ___ |
| Valor de `% del Total Productos` en la fila Total | ___ |
| Valor de `% del Total General` en la fila Total con Small Business seleccionado (qué representa ese número) | ___ |
| Valor de `Ventas Government KF` con Small Business y con Government seleccionado | ___ |

---

## 🧩 Microlección 2 — Contexto de fila, iteradores y transición de contexto

**¿Qué vas a aprender?** Por qué un promedio "fila por fila" no es lo mismo que un promedio ponderado, y por qué una medida dentro de un iterador se comporta distinto que un `SUM` suelto.

**¿Por qué existe esto?** Muchos errores silenciosos de DAX vienen de aquí: la fórmula no da error, da un número plausible pero equivocado.

**Ejemplo pequeño:**

```dax
// Columna calculada (clic derecho sobre financials > New column).
// Se evalúa en contexto de fila: una vez por cada fila de financials.
Precio Unitario Fila = DIVIDE(financials[Sales], financials[Units Sold])
```

```dax
// Medidas:
Precio Promedio Simple = AVERAGE(financials[Precio Unitario Fila])   // promedio de las filas, todas pesan igual
Precio Promedio Simple X = AVERAGEX(financials, DIVIDE(financials[Sales], financials[Units Sold]))  // lo mismo con un iterador, sin columna
Precio Promedio Ponderado = DIVIDE([Total Ventas], SUM(financials[Units Sold]))  // cada unidad pesa igual

// Transición de contexto:
Ventas Mejor Producto = MAXX(VALUES(financials[Product]), [Total Ventas])  // [Total Ventas] lleva CALCULATE implícito: filtra por cada producto
Ventas Mejor Producto Sin Transicion = MAXX(VALUES(financials[Product]), SUM(financials[Sales]))  // SUM no filtra por la fila: devuelve el total en cada iteración
```

**Práctica real en tu entorno (20 min):**

1. Crea la columna calculada y las cinco medidas del ejemplo.
2. Pon cada medida en una **Card** (o todas en una **Table** de una sola fila) sin slicer seleccionado.
3. Compara `Ventas Mejor Producto Sin Transicion` con `Total Ventas`: deben ser **iguales**. Ese es el síntoma típico de olvidar la transición de contexto.
4. Corrige la versión sin transición envolviendo el `SUM` en `CALCULATE(SUM(financials[Sales]))` y comprueba que ahora coincide con `Ventas Mejor Producto`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| `Precio Promedio Simple` y `Precio Promedio Simple X` (¿son iguales?) | ___ |
| `Precio Promedio Ponderado` | ___ |
| Cuál usarías para informar "precio promedio por unidad vendida" y por qué (una frase) | ___ |
| `Ventas Mejor Producto` y `Ventas Mejor Producto Sin Transicion` antes de corregir | ___ |
| Valor de la versión corregida con `CALCULATE` | ___ |

---

## 🧩 Microlección 3 — Tabla de calendario e inteligencia de tiempo

**¿Qué vas a aprender?** A crear tu propia tabla de fechas, marcarla y usarla para acumulados, comparativos contra el año anterior y una media móvil correcta.

**¿Por qué existe esto?** Las funciones de inteligencia de tiempo trabajan sobre una columna de fechas continua (una fila por día, sin huecos). La columna `financials[Date]` no lo es: tiene una fecha por mes. Por eso se crea una tabla `Calendar` y se relaciona con los datos.

**Práctica real en tu entorno (35 min):**

1. Desactiva la fecha/hora automática solo para este archivo: **File** > **Options and settings** > **Options** > en **Current File** abre **Data Load** y desmarca **Auto date/time** en la sección **Time intelligence**. Pulsa **OK**.
2. En **Table view** > **Home** > **New table** escribe:

```dax
Calendar =
ADDCOLUMNS(
    CALENDAR(DATE(2013, 1, 1), DATE(2014, 12, 31)),  // cubre todo el rango de la muestra
    "Año", YEAR([Date]),
    "Mes Número", MONTH([Date]),
    "Año-Mes", FORMAT([Date], "YYYY-MM"),            // texto que se ordena bien alfabéticamente
    "Trimestre", "T" & QUARTER([Date])
)
```

3. Comprueba en **Table view** que `Calendar` tiene **730 filas** (365 × 2 años).
4. Clic derecho sobre la tabla `Calendar` en el panel **Data** > **Mark as date table** y elige la columna `Date`. Power BI valida que no haya duplicados, ni vacíos, ni huecos. Si da error, revisa que la fórmula sea exactamente la de arriba.
5. En **Model view** arrastra `Calendar[Date]` sobre `financials[Date]`. En el cuadro **New relationship** comprueba que la cardinalidad es uno a muchos (`Calendar` en el lado "uno") y la dirección **Single**, y guarda.
6. Crea las medidas:

```dax
Ventas YTD = TOTALYTD([Total Ventas], 'Calendar'[Date])

Ventas Año Anterior = CALCULATE([Total Ventas], SAMEPERIODLASTYEAR('Calendar'[Date]))

Variación YoY % =
VAR Actual = [Total Ventas]
VAR Anterior = [Ventas Año Anterior]
RETURN
    DIVIDE(Actual - Anterior, Anterior)   // en blanco si no hay año anterior

Ventas Mes Anterior = CALCULATE([Total Ventas], DATEADD('Calendar'[Date], -1, MONTH))

Media Movil 3M =
VAR FinPeriodo = EOMONTH(MAX('Calendar'[Date]), 0)        // último día del mes de la fila
VAR InicioPeriodo = EOMONTH(FinPeriodo, -3) + 1           // primer día de dos meses antes
RETURN
    DIVIDE(
        CALCULATE([Total Ventas], DATESBETWEEN('Calendar'[Date], InicioPeriodo, FinPeriodo)),
        3                                                  // promedio de 3 MESES, no de transacciones
    )
```

7. Inserta una **Matrix** con `'Calendar'[Año-Mes]` en **Rows** (de la tabla `Calendar`, **no** de `financials`) y las cinco medidas en **Values**.

> **Por qué la media móvil se calcula así:** promediar con `AVERAGE(financials[Sales])` dentro de un rango de fechas da el promedio de las **filas** de esos meses, no de los meses. Aquí se suma la venta de los tres meses y se divide entre 3. Los primeros meses de la serie salen bajos porque no tienen tres meses anteriores con datos: es esperado, anótalo.

**🔧 Diagnosticar antes de seguir — troubleshooting challenge (5 min):** un compañero armó la misma matriz y su `Ventas YTD` "no acumula". Antes de ver la causa, resuélvelo → **[Diagnosticar: el YTD no acumula](/practica/ip-trb-009-ytd-no-acumula)**. Después reprodúcelo en tu archivo: cambia las filas de la matriz por `financials[Month Name]` y anota qué pasa.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Número de filas de `Calendar` | ___ |
| Primer mes (`Año-Mes`) en el que `Total Ventas` tiene valor | ___ |
| `Ventas YTD` en 2014-12 (¿coincide con `Total Ventas` del año 2014 completo?) | ___ |
| Primer mes en que `Ventas Año Anterior` deja de estar en blanco | ___ |
| `Variación YoY %` en 2014-12 | ___ |
| `Media Movil 3M` en 2014-12 y el cálculo manual que hiciste para comprobarla (ventas de 2014-10 + 2014-11 + 2014-12, entre 3) | ___ |
| Qué viste en `Ventas YTD` al usar `financials[Month Name]` en las filas | ___ |

---

## 🧩 Microlección 4 — Ranking dinámico y Top N con parámetro

**¿Qué vas a aprender?** A combinar `RANKX` con un parámetro que elige el usuario.

**¿Por qué existe esto?** "Muéstrame los 3 mejores productos" cambia según el segmento, el país o el periodo que el usuario filtra. Un ranking fijo (calculado en una columna) no responde a los filtros; una medida con `RANKX` sí.

**Ejemplo pequeño:**

```dax
Ranking Producto = RANKX(ALL(financials[Product]), [Total Ventas], , DESC, DENSE)
// ALL(financials[Product]): compara contra todos los productos, no solo el de la fila.
// El segmento seleccionado en el slicer sigue aplicando, así que el ranking es "dentro del segmento".
```

**🏗️ Reto de construcción (sin pasos, en tu Desktop):**

> **Requerimiento:** un visual donde el usuario elija con un slicer cuántos productos ver (de 1 a 6) y solo aparezcan esos productos, ordenados por ventas, respetando el slicer de segmento de la Microlección 1.
> **Criterios de aceptación:** (1) el número N lo elige el usuario en un slicer; (2) al cambiar el segmento, el Top N se recalcula; (3) en caso de empate, ningún puesto queda vacío.
> **Restricciones:** no uses el filtro **Top N** del panel **Filters**; resuélvelo con DAX.

Si te atascas, pistas en orden: (1) **Modeling** > **New parameter** > **Numeric range** crea una tabla con su slicer (**Add slicer to this page**) y una medida `<Nombre> Value` que devuelve el número elegido; (2) una medida que devuelva `[Total Ventas]` solo si `[Ranking Producto]` es menor o igual que ese valor, y blanco en otro caso; (3) las filas con medida en blanco desaparecen de la matriz.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre del parámetro y de la medida que creó Power BI automáticamente | ___ |
| Fórmula final de tu medida Top N (cópiala) | ___ |
| Productos que aparecen con N = 3 y segmento **Government** | ___ |
| Productos que aparecen con N = 3 y segmento **Small Business** (¿cambió alguno?) | ___ |
| Qué muestra la fila Total de tu medida y si es lo que esperabas | ___ |

---

## 🧩 Microlección 5 — Row Level Security estática y dinámica

**¿Qué vas a aprender?** A definir un rol con filtro fijo, un rol dinámico con `USERPRINCIPALNAME()` y a probarlos antes de publicar.

**¿Por qué existe esto?** El mismo reporte debe mostrar datos distintos según quién lo abre, sin mantener un reporte por persona. El Módulo 6 te presentó la idea; aquí la construyes con una tabla de responsables, que es el patrón real (la seguridad la mantiene una tabla, no la fórmula).

**Práctica real en tu entorno (25 min):**

1. **Home** > **Enter data**. Crea la tabla `Responsables` con dos columnas, `Email` y `Segment`, y una fila por segmento: `gobierno@contoso.com` / `Government`, `pymes@contoso.com` / `Small Business`, `enterprise@contoso.com` / `Enterprise`, `midmarket@contoso.com` / `Midmarket`, `canales@contoso.com` / `Channel Partners`. Comprueba que los textos de `Segment` coinciden exactamente con los de `financials` (mira los valores del slicer).
2. En **Model view** relaciona `Responsables[Segment]` (lado "uno") con `financials[Segment]` (lado "muchos"), dirección **Single**.
3. **Modeling** > **Manage roles** > **New**. Rol `Solo Government`: selecciona la tabla `financials` y escribe el filtro DAX (usa **Switch to DAX editor** si ves el editor por defecto):

```dax
[Segment] = "Government"
```

4. Crea otro rol `Responsable de segmento` sobre la tabla `Responsables`:

```dax
[Email] = USERPRINCIPALNAME()
```

   Pulsa **Save**. El filtro sobre `Responsables` llega a `financials` por la relación.
5. Prueba: **Modeling** > **View as** > marca `Solo Government` > **OK**. Luego **Stop viewing**. Después **View as** > marca **Other user**, escribe `pymes@contoso.com`, marca `Responsable de segmento` > **OK**.

> En Desktop, `USERPRINCIPALNAME()` devuelve tu usuario (o el que escribas en **Other user**). Si con **Other user** ves todo vacío, el correo no coincide con ninguna fila de `Responsables`: revisa mayúsculas, espacios y el dominio.

6. *(Opcional, en el servicio):* publica el archivo. En el workspace abre **More options** (⋯) del modelo semántico > **Security**, agrega miembros a cada rol y usa **Test as role**. Recuerda: solo se restringe a quienes tengan rol **Viewer** en el workspace; si tú eres Admin del workspace, verás todo y eso no es un error.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| `Total Ventas` sin rol | ___ |
| `Total Ventas` viendo como `Solo Government` | ___ |
| `Total Ventas` viendo como `pymes@contoso.com` con `Responsable de segmento` | ___ |
| Qué pasó al probar con un correo que no está en `Responsables` | ___ |
| *(Opcional)* Rol de workspace del usuario con quien probaste en el servicio y qué vio | ___ |

---

## 🔁 Reto de transferencia

Ya practicaste acumulados y comparativos sobre el año calendario (Microlección 3). Ahora la regla de negocio **cambia**: la empresa cierra su año fiscal el **30 de junio**. El año fiscal 2014 va del 1 de julio de 2013 al 30 de junio de 2014, y finanzas quiere el acumulado fiscal y el comparativo contra el mismo periodo del año fiscal anterior.

**[Transferir: acumulado en año fiscal](/practica/ip-dv-018-transferir-ano-fiscal)** — tienes que decidir qué cambia y qué **no** cambia. No es "rehacer el calendario": si solo memorizaste la fórmula de la Microlección 3, este reto te lo va a mostrar.

Si tienes tiempo, constrúyelo en tu archivo y reporta la evidencia:

| Campo | Tu valor |
|---|---|
| Fórmula de tu columna de año fiscal en `Calendar` | ___ |
| Fórmula de tu medida de acumulado fiscal | ___ |
| Acumulado fiscal en 2014-06 y en 2014-07 (¿por qué baja en julio?) | ___ |
| ¿Tuviste que cambiar `Ventas Año Anterior`? ¿Por qué? | ___ |

---

## Profundización opcional — retención por cohortes

Este patrón no se puede practicar con la muestra Financials (no tiene clientes). Úsalo como referencia cuando tengas un modelo con una tabla `Clientes` (lado "uno") relacionada con una tabla `Ventas` (lado "muchos") por `ClienteID`, y la tabla `Calendar` relacionada con `Ventas[FechaVenta]`.

```dax
// Columnas calculadas en Clientes:
Primera Compra = CALCULATE(MIN(Ventas[FechaVenta]))   // transición de contexto: filtra Ventas por el cliente de la fila
Cohorte = FORMAT(Clientes[Primera Compra], "YYYY-MM")
```

```dax
// Medidas:
Clientes Activos = DISTINCTCOUNT(Ventas[ClienteID])
Tamaño Cohorte = COUNTROWS(Clientes)                  // Calendar no filtra Clientes (relación Single), así que no depende del mes
% Retención = DIVIDE([Clientes Activos], [Tamaño Cohorte])
```

En una matriz con `Clientes[Cohorte]` en filas y `'Calendar'[Año-Mes]` en columnas, `% Retención` muestra qué parte de cada cohorte volvió a comprar en cada mes.

---

### 💼 Caso Real de Negocio
**Empresa:** Cadena de retail con 200 tiendas y 50 vendedores  
**Problema:** Gerentes veían ventas de todas las regiones; vendedores necesitaban ver solo sus clientes.  
**Solución:** RLS con 3 roles (Director ve todo, Gerente Regional ve su región, Vendedor ve solo sus clientes). DAX time intelligence para comparativos YoY. Media móvil 3 meses para suavizar estacionalidad en el dashboard ejecutivo.  
**Resultado:** Adopción de Power BI aumentó de 20% a 85% porque los vendedores confían en que los datos son "solo de ellos".

### ✅ Buenas Prácticas
- Siempre crear tabla de fechas manualmente (no usar AutoDate/Time de Power BI) y marcarla como tabla de fechas
- Usar VAR para almacenar cálculos intermedios — mejora legibilidad y evita evaluar dos veces la misma expresión
- DIVIDE() en lugar de `/` para evitar errores de división por cero
- Documentar medidas complejas con comentarios `//` en el código DAX y con la descripción de la medida
- Centralizar medidas en tabla de medidas dedicada
- Preferir filtros de columna simples en CALCULATE y reservar FILTER para condiciones que comparan contra medidas
- En visuales con inteligencia de tiempo, usar siempre las columnas de la tabla de calendario en filas, ejes y slicers, no la fecha de la tabla de hechos
- RLS se define en Desktop pero se aplica al Dataset (modelo semántico) en Service — recordar publicar y asignar; mantener la seguridad dinámica en una tabla de responsables, no en fórmulas con correos escritos a mano

### ⚠️ Errores Comunes
| Síntoma | Causa | Solución |
|-------|-------|----------|
| El YTD no acumula: cada mes muestra lo mismo que su venta del mes, y el año anterior sale raro | Las filas del visual usan la fecha o el mes de la tabla de hechos, no de `Calendar` | Usar `'Calendar'[Año-Mes]` (u otras columnas de `Calendar`) en filas y slicers (Microlección 3) |
| Las funciones de tiempo dan error o resultados incompletos | La tabla de fechas tiene huecos, o no cubre todo el rango de los datos | Crear `Calendar` con `CALENDAR` sobre un rango completo y marcarla como tabla de fechas |
| Una medida "ignora" el slicer y siempre da el mismo valor | `CALCULATE` reemplaza el filtro de esa columna | Si el filtro debe combinarse con el slicer, usar `KEEPFILTERS` (Microlección 1) |
| El % del total suma 100% en cada fila | El denominador no quita ningún filtro (`DIVIDE([M], [M])`) | Quitar el filtro de la columna de las filas con `REMOVEFILTERS(Tabla[Columna])` |
| El % del total no respeta el slicer de segmento | El denominador quita todos los filtros de la tabla (`REMOVEFILTERS(Tabla)` o `ALL(Tabla)`) | Quitar solo la columna de las filas |
| Un iterador devuelve el total en cada fila (`MAXX` = total) | `SUM` dentro del iterador sin transición de contexto | Usar una medida o envolver en `CALCULATE` (Microlección 2) |
| La media móvil sale demasiado baja | Se promediaron filas de transacciones, no meses | Sumar el periodo y dividir entre el número de meses (Microlección 3) |
| RANKX da todos 1 | La tabla del primer argumento solo contiene la fila actual | Usar `ALL(Tabla[Columna])` en el primer argumento |
| RLS no filtra nada en el servicio | El usuario es Admin, Member o Contributor del workspace, o no está asignado al rol | Probar con un usuario con rol Viewer asignado al rol; usar **Test as role** |
| RLS dinámico deja todo vacío con **Other user** | El correo no coincide con la tabla de responsables | Revisar el valor exacto (dominio, espacios) en la tabla |

### 🧪 Criterios de Validación
- [ ] Cargué el Financial sample y creé la medida base `Total Ventas`
- [ ] Resolví la micropráctica del % del total y construí en mi Desktop las medidas con `CALCULATE`, `REMOVEFILTERS` y `KEEPFILTERS`, anotando qué hace cada una con el slicer
- [ ] Comparé promedio simple contra ponderado y reproduje y corregí el error de transición de contexto en `MAXX`
- [ ] Creé la tabla `Calendar` con DAX, la marqué como tabla de fechas y la relacioné con `financials`
- [ ] Construí YTD, año anterior, variación YoY, mes anterior y una media móvil de 3 meses que verifiqué con un cálculo manual
- [ ] Diagnostiqué el "YTD que no acumula" formulando una hipótesis antes de ver la causa, y lo reproduje en mi archivo
- [ ] Construí el Top N con parámetro y `RANKX` sin ver los pasos completos de antemano
- [ ] Creé y probé con **View as** un rol estático y un rol dinámico con tabla de responsables y `USERPRINCIPALNAME()`
- [ ] Completé el reto de transferencia (año fiscal) explicando qué cambió y qué no cambió respecto al año calendario
