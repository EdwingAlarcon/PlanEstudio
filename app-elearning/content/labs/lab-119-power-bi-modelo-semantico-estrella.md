---
id: lab-119
title: "Power BI — Modelo semántico en estrella (Ruta Pro Power BI)"
level: "N2"
duration: 165
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 118 completado — ruta-pro-sit-ventas.pbix con Ventas, Objetivos, Clientes, Productos, Regiones y Vendedores cargadas"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 119 — Power BI: modelo semántico en estrella

## Objetivo

Diseñar y construir el modelo que usarán todos los reportes de la ruta: una tabla de fechas común para tres años, dos tablas de hechos con granos distintos (ventas por línea y objetivos por mes) que comparten dimensiones, la fecha de entrega como dimensión de rol activada con `USERELATIONSHIP`, y las propiedades que hacen que el modelo se use sin errores (claves ocultas, categorías de datos, orden y jerarquías). Cubre "Design and implement a data model" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 118.

**Problema a resolver:** el comité comercial quiere ver, en el mismo reporte, cuánto vendió cada ejecutivo contra su objetivo. Finanzas pregunta además por qué "las ventas de diciembre" de su informe no coinciden con las del comercial: finanzas cuenta lo **entregado** en diciembre y comercial lo **pedido**. Las dos cifras son correctas; el modelo tiene que poder dar ambas sin duplicar la tabla de ventas.

## Lo que vas a construir

- La tabla `Fecha` (2024 a 2026, **1.096** días) marcada como tabla de fechas, con mes ordenado y una jerarquía Año > Trimestre > Mes
- Un modelo con dos tablas de hechos (`Ventas` y `Objetivos`) y cinco dimensiones, todas las relaciones de muchos a uno y con filtro en un solo sentido
- Una relación inactiva `Ventas[FechaEntrega]` → `Fecha[Date]` y la medida `Ventas por Entrega` que la activa
- Las medidas `Ventas Totales`, `Pedidos`, `Objetivo Total` y `% Cumplimiento`
- Claves técnicas ocultas, categorías de datos geográficas, una jerarquía geográfica y una columna calculada bien justificada

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Lab 116: un modelo en estrella mínimo · Lab 118: las 6 tablas limpias | Grano, dimensiones compartidas, dimensión de rol, propiedades | Labs 120 y 121 (DAX) calculan sobre este modelo; Lab 126 le añade seguridad |

> **Fuente del esqueleto:** labs 3 y 4 del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y la guía de Learn sobre [esquema en estrella](https://learn.microsoft.com/power-bi/guidance/star-schema). El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Diseñar en papel: hechos, dimensiones y grano | 20 min |
| Ejercicio 2 — La tabla de fechas común | 20 min |
| Ejercicio 3 — Relaciones | 25 min |
| Ejercicio 4 — Ventas contra objetivo | 25 min |
| Ejercicio 5 — Fecha de pedido y fecha de entrega | 30 min |
| Ejercicio 6 — Propiedades que evitan errores | 30 min |
| Ejercicio 7 — Columna calculada o medida | 15 min |
| **Total** | **unas 2 h 45 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: Model view, Table view, DAX (`CALENDAR`, `CALCULATE`, `USERELATIONSHIP`, `DIVIDE`)

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 118 con 6 tablas en el panel **Data**

### Conocimiento previo

- Lab 116: crear relaciones, la tabla `Fecha`, **Mark as date table** y **Sort by Column**
- [Módulo 12](/nivel/intermedio/modulo/power-bi-dax-avanzado), Microlecciones 1 y 3: `CALCULATE` y tabla de calendario

### Verificación rápida antes de empezar

- [ ] `Ventas` tiene 3.995 filas y `Objetivos` 288 (lo ves en **Table view**, abajo a la izquierda)

---

## Ejercicio 1 — Diseñar en papel: hechos, dimensiones y grano

**Objetivo:** decidir el modelo antes de tocar Power BI. Un esquema en estrella separa **tablas de hechos** (eventos que se suman: ventas, objetivos) de **tablas de dimensión** (lo que se usa para filtrar y agrupar: productos, clientes, fechas) ([Learn: star schema](https://learn.microsoft.com/power-bi/guidance/star-schema)).

Completa la tabla:

| Tabla | ¿Hecho o dimensión? | Grano (qué representa una fila) | Se relaciona con |
|---|---|---|---|
| `Ventas` | ___ | ___ | ___ |
| `Objetivos` | ___ | ___ | ___ |
| `Productos` | ___ | ___ | ___ |
| `Clientes` | ___ | ___ | ___ |
| `Regiones` | ___ | ___ | ___ |
| `Vendedores` | ___ | ___ | ___ |
| `Fecha` (la crearás) | ___ | ___ | ___ |

**Respuesta orientativa** (léela después de completar): `Ventas` y `Objetivos` son hechos. El grano de `Ventas` es **una línea de pedido**; el de `Objetivos`, **un vendedor en un mes**. Las dimensiones tienen una fila por producto, cliente, región, vendedor y día. `Vendedores` y `Fecha` son **dimensiones compartidas**: filtran las dos tablas de hechos, y eso es lo que permite poner ventas y objetivo en el mismo visual. `Productos`, `Clientes` y `Regiones` solo filtran `Ventas`, porque los objetivos no se fijan por producto, cliente ni región.

> **El grano decide lo que puedes preguntar:** como los objetivos son mensuales, "¿cuánto debía vender Laura el 14 de marzo?" no tiene respuesta en este modelo. Por mes, trimestre o año, sí.

---

## Ejercicio 2 — La tabla de fechas común

**Objetivo:** una sola tabla `Fecha` que cubra todos los años de los dos hechos.

1. **Table view** > cinta **Table tools** > **New table** (según la versión, también está en **Home**) y escribe:

```dax
Fecha =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2024, 1, 1 ), DATE ( 2026, 12, 31 ) ),  // años completos, aunque 2026 tenga datos hasta octubre
    "Año", YEAR ( [Date] ),
    "MesNum", MONTH ( [Date] ),
    "Mes", FORMAT ( [Date], "MMM" ),
    "Trimestre", "T" & QUARTER ( [Date] ),
    "AñoMes", YEAR ( [Date] ) * 100 + MONTH ( [Date] )         // 202503: sirve para ordenar meses de varios años
)
```

2. Debe tener **1.096** filas (2024 es bisiesto).
3. Márcala como tabla de fechas con la columna `Date` (**Mark as date table**, como en el Lab 116). Learn pide que la columna de fechas no tenga repetidos, ni vacíos, ni huecos, y recomienda años completos ([Learn: date tables](https://learn.microsoft.com/power-bi/transform-model/desktop-date-tables), [Learn: date table guidance](https://learn.microsoft.com/power-bi/guidance/model-date-tables)).
4. Ordena `Mes` por `MesNum` con **Sort by Column**: Learn indica que la cinta **Column tools** solo está disponible en **Report view**, así que cambia a esa vista, selecciona `Mes` en el panel **Data** y luego **Column tools** > **Sort by Column** > `MesNum`.
5. El texto de `Mes` depende de la configuración regional del modelo: con Power BI Desktop en inglés verás `Jan`, `Feb`…; en español, `ene`, `feb`… Las dos son correctas.

> **Si la fórmula da error de sintaxis en las comas**, cambia `,` por `;` entre argumentos (separadores de tu configuración regional, Lab 116). **Por qué años completos:** las funciones de inteligencia de tiempo del Lab 121 (acumulado del año, año anterior) necesitan el año entero, aunque 2026 no tenga ventas de noviembre y diciembre.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Filas de `Fecha` | ___ (esperado: 1.096) |

---

## Ejercicio 3 — Relaciones

**Objetivo:** el modelo en estrella completo, con todas las relaciones de muchos a uno y con filtro en un solo sentido.

1. Abre **Model view**. En **Manage relationships**, elimina las que Power BI haya creado y no estén en esta tabla, y crea las que falten con **New** ([Learn: relationships](https://learn.microsoft.com/power-bi/transform-model/desktop-create-and-manage-relationships)):

| # | Desde (muchos) | Hacia (uno) | Activa |
|---|---|---|---|
| 1 | `Ventas[FechaPedido]` | `Fecha[Date]` | ✅ |
| 2 | `Ventas[ProductoID]` | `Productos[ProductoID]` | ✅ |
| 3 | `Ventas[ClienteID]` | `Clientes[ClienteID]` | ✅ |
| 4 | `Ventas[RegionID]` | `Regiones[RegionID]` | ✅ |
| 5 | `Ventas[VendedorID]` | `Vendedores[VendedorID]` | ✅ |
| 6 | `Objetivos[Fecha]` | `Fecha[Date]` | ✅ |
| 7 | `Objetivos[VendedorID]` | `Vendedores[VendedorID]` | ✅ |
| 8 | `Ventas[FechaEntrega]` | `Fecha[Date]` | ❌ (inactiva) |

2. En todas: **Cardinality** = **Many to one (\*:1)** y **Cross filter direction** = **Single**.
3. Al crear la número 8, **desmarca Make this relationship active** antes de guardarla: ya existe un camino activo entre `Ventas` y `Fecha` (la número 1) y Power BI no admite dos. En el diagrama, una relación inactiva se dibuja con línea discontinua. Es lo que quieres: la activarás solo dentro de una medida (Ejercicio 5).

> **Por qué Single y no Both:** con **Both**, un filtro en `Ventas` volvería a `Vendedores` y desde ahí a `Objetivos`, creando caminos ambiguos entre las tablas. **Single** es la dirección por defecto, y Learn usa **Both** en casos concretos, como las tablas puente entre dos dimensiones (las verás en el Lab 126) ([Learn: many-to-many guidance](https://learn.microsoft.com/power-bi/guidance/relationships-many-to-many)). En un modelo en estrella normal, las dimensiones filtran a los hechos y no al revés.

### Resultado esperado del Ejercicio 3

Ocho relaciones, siete activas. En el diagrama, `Ventas` y `Objetivos` abajo, y `Fecha` y `Vendedores` conectadas a las dos.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Relaciones activas / inactivas | ___ (esperado: 7 / 1) |
| Qué tablas filtran a `Objetivos` | ___ |

---

## Ejercicio 4 — Ventas contra objetivo

**Objetivo:** comprobar que dos tablas de hechos con granos distintos se combinan bien a través de sus dimensiones compartidas.

1. Crea estas medidas en `Ventas` (**New measure**):

```dax
Ventas Totales = SUM ( Ventas[Importe] )
```

```dax
Pedidos = DISTINCTCOUNT ( Ventas[PedidoID] )
```

2. Y estas en `Objetivos`:

```dax
Objetivo Total = SUM ( Objetivos[Objetivo] )
```

```dax
% Cumplimiento = DIVIDE ( [Ventas Totales], [Objetivo Total] )   // vacío si no hay objetivo
```

3. En **Report view**, crea una página `Modelo` con un **Slicer** de `Fecha[Año]`. Como `Año` es un número, el slicer aparece como un rango con deslizador: cámbialo a lista en el panel **Format** > **Visual** > **Slicer settings** > **Options** > **Style** > **Vertical list**, y marca **2025**.
4. Añade un visual **Matrix** con `Vendedores[Vendedor]` en **Rows** y `Ventas Totales`, `Objetivo Total` y `% Cumplimiento` en **Values**.
5. Da formato de porcentaje a `% Cumplimiento`: selecciónala en el panel **Data** y, en la cinta **Measure tools**, elige **Percentage** en el formato.

### Resultado esperado del Ejercicio 4 (año 2025)

| Vendedor | Ventas Totales | Objetivo Total | % Cumplimiento |
|---|---|---|---|
| Laura Gómez | 940.798,70 | 1.494.000 | 62,97 % |
| Andrés Rojas | 1.338.936,20 | 1.199.000 | 111,67 % |
| Camila Restrepo | 4.303.248,20 | 3.896.000 | 110,45 % |
| Julián Pérez | 2.625.305,90 | 2.100.000 | 125,01 % |
| Mariana Torres | 3.212.288,10 | 2.933.000 | 109,52 % |
| Diego Hernández | 2.523.884,80 | 2.313.000 | 109,12 % |
| Valeria Quispe | 2.487.813,30 | 2.661.000 | 93,49 % |
| Tomás Fuentes | 3.408.686,70 | 3.288.000 | 103,67 % |
| **Total** | **20.840.961,90** | **19.884.000** | **104,81 %** |

Los dos gerentes (Natalia Vargas y Ricardo Salinas) no aparecen: no tienen ventas ni objetivos propios, y la matriz oculta las filas vacías.

> **Pruébalo al revés:** pon `Productos[Categoria]` como filtro del visual. `Ventas Totales` cambia, pero `Objetivo Total` **no**: `Productos` no tiene relación con `Objetivos`. Es correcto (los objetivos no son por producto), pero el `% Cumplimiento` filtrado por categoría ya no significa nada. Anótalo: es una de las preguntas de repaso.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| % Cumplimiento total de 2025 | ___ |
| Vendedor con menor cumplimiento en 2025 | ___ |

---

## Ejercicio 5 — Fecha de pedido y fecha de entrega

**Objetivo:** responder a finanzas (ventas por fecha de **entrega**) sin duplicar la tabla de ventas, usando la relación inactiva. A una dimensión que cumple varios papeles para el mismo hecho, Learn la llama **dimensión de rol** (*role-playing dimension*) ([Learn: star schema](https://learn.microsoft.com/power-bi/guidance/star-schema), [Learn: active vs. inactive relationships](https://learn.microsoft.com/power-bi/guidance/relationships-active-inactive)).

1. Crea la medida en `Ventas`:

```dax
Ventas por Entrega =
CALCULATE (
    [Ventas Totales],
    USERELATIONSHIP ( Ventas[FechaEntrega], Fecha[Date] )   // activa la relación inactiva solo para este cálculo
)
```

`USERELATIONSHIP` no devuelve nada: solo activa la relación indicada mientras dura el cálculo ([Learn: USERELATIONSHIP](https://learn.microsoft.com/dax/userelationship-function-dax)).

2. En una **Matrix** nueva: `Fecha[Año]` y `Fecha[Mes]` en **Rows**; `Ventas Totales` y `Ventas por Entrega` en **Values**. Deja **2025** elegido en el slicer.
3. La matriz empieza contraída: solo ves los años. Para ver los meses, usa el **+** junto a 2025 o los botones de exploración que aparecen sobre el visual al pasar el puntero.

### Resultado esperado del Ejercicio 5

| Periodo | Ventas Totales (por pedido) | Ventas por Entrega |
|---|---|---|
| Año 2025 | **20.840.961,90** | **20.799.528,90** |
| Diciembre 2025 | **1.873.122,60** | **2.205.201,10** |

Comprobado sobre los archivos: lo pedido en diciembre de 2025 vale 1.873.122,60, pero lo **entregado** en diciembre (que incluye pedidos de octubre y noviembre) vale 2.205.201,10. **Esa es la diferencia que veía finanzas.** Además, **54** líneas de 2026 aún no tienen fecha de entrega: suman **780.903,50** y no aparecen en ningún mes de `Ventas por Entrega`.

> **La otra forma de hacerlo:** Learn describe también la alternativa de **duplicar la dimensión** (una tabla `Fecha Entrega` con su propia relación activa). Así el usuario puede poner fecha de pedido y fecha de entrega a la vez en el mismo visual, a cambio de mantener dos tablas de fechas. Con una sola medida, como aquí, el modelo es más simple. Decidirás entre ambas en el reto avanzado.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| `Ventas por Entrega` de 2025 | ___ |
| Diciembre 2025: por pedido / por entrega | ___ |
| Por qué las 54 líneas sin entrega no aparecen en `Ventas por Entrega` | ___ |

---

## Ejercicio 6 — Propiedades que evitan errores

**Objetivo:** que quien construya reportes sobre este modelo no pueda equivocarse fácilmente.

### Tarea 6.1 — Ocultar las claves técnicas

Las columnas `ClienteID`, `ProductoID`, `RegionID` y `VendedorID` de **`Ventas`** y **`Objetivos`** solo sirven para las relaciones. Si alguien las arrastra a un visual, obtiene códigos en lugar de nombres.

1. En **Model view**, selecciona una de esas columnas. En el **Properties pane** (panel de propiedades de la derecha) activa la opción de ocultar (**Is hidden**). Learn indica que puedes seleccionar varias a la vez con **Ctrl** y cambiar la propiedad para todas ([Learn: Model view](https://learn.microsoft.com/power-bi/transform-model/desktop-modeling-view)). También puedes hacerlo con clic derecho sobre la columna en el panel **Data** y la opción de ocultar del menú.
2. Oculta también `Ventas[FechaPedido]` y `Ventas[FechaEntrega]` (para filtrar por fecha se usa `Fecha`), `Ventas[Mes]`, `Ventas[Tasa]` y `Objetivos[Fecha]`.
3. Deja visibles las claves de las **dimensiones** si quieres buscarlas en una tabla, u ocúltalas también: no hay una sola respuesta correcta.

### Tarea 6.2 — Categorías de datos

1. Selecciona `Regiones[Pais]`. En la cinta **Column tools**, área **Properties**, despliega **Data category** y elige **Country/Region**. Haz lo mismo con `Regiones[Ciudad]` y `Clientes[Ciudad]` → **City** ([Learn: data categorization](https://learn.microsoft.com/power-bi/transform-model/desktop-data-categorization)).
2. La categoría le dice a los mapas cómo interpretar el texto: "Lima" podría ser una ciudad o una provincia.

### Tarea 6.3 — Jerarquías

1. En `Regiones`, crea una jerarquía `Geografía` con `Pais` > `Region`: clic derecho sobre `Pais` en el panel **Data** > **Create hierarchy**, y luego arrastra `Region` dentro de ella (o, clic derecho sobre `Region` > **Add to hierarchy**).
2. En `Fecha`, crea `Calendario` con `Año` > `Trimestre` > `Mes`.
   Power BI les pone un nombre automático (por ejemplo, `Pais Hierarchy`): renómbralas con clic derecho sobre la jerarquía > **Rename**.
3. En la matriz del Ejercicio 5, sustituye `Año` y `Mes` por la jerarquía `Calendario` y prueba a expandir niveles con los botones de exploración del visual.

> Si no ves **Create hierarchy** en el menú contextual, busca la opción de jerarquías en el **Properties pane** de la columna. Es la única etiqueta de esta tarea que no encontramos en Learn.

### Tarea 6.4 — Ordenar meses de varios años

En una tabla con `Fecha[Año]` y `Fecha[Mes]` los meses salen bien ordenados gracias a `MesNum`. Pero si alguna vez necesitas una sola columna "mes y año" (`ene 2025`, `feb 2025`…), debe ordenarse por `AñoMes`, no por `MesNum`. Crea la columna `Mes Año` en `Fecha` con **New column**:

```dax
Mes Año = FORMAT ( Fecha[Date], "MMM yyyy" )
```

y ordénala por `AñoMes` con **Sort by Column**. Learn exige que la columna de orden tenga un único valor por cada valor de la columna ordenada ([Learn: sort by column](https://learn.microsoft.com/power-bi/create-reports/desktop-sort-by-column)), y `AñoMes` lo cumple (cada `Mes Año` tiene un solo `AñoMes`). **Ordenarla por `MesNum` no daría error** (cada `Mes Año` también tiene un solo `MesNum`), pero el orden saldría mal: los eneros de los tres años juntos, luego los febreros… Lo que sí daría error es lo contrario: ordenar `Mes` por `AñoMes`, porque `ene` tendría tres valores de `AñoMes`.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Columnas de `Ventas` que quedaron visibles en el panel **Data** | ___ (esperado: `PedidoID`, `Linea`, `Cantidad`, `PrecioUnitario`, `DescuentoPct`, `Importe`, `Moneda`, `ImporteLocal` y las medidas) |
| Qué cambia en un mapa al poner **Country/Region** en `Pais` | ___ |

---

## Ejercicio 7 — Columna calculada o medida

**Objetivo:** saber cuándo una columna calculada es la herramienta correcta.

Comercial quiere separar las ventas **recurrentes** (licencias) de las de **proyecto o servicio**, y usar esa separación como filtro y como leyenda de los gráficos.

1. En `Productos`, **New column**:

```dax
Tipo de ingreso = IF ( Productos[Categoria] = "Licencias", "Recurrente", "Proyecto o servicio" )
```

2. Úsala como leyenda en un gráfico de columnas con `Ventas Totales` por `Fecha[Año]`.

**Por qué columna y no medida:** una columna calculada se calcula una vez por fila al actualizar y se guarda en el modelo; por eso se puede usar en filtros, slicers, filas y leyendas. Una medida se calcula al momento según los filtros, y no puede ponerse en un eje ni en un slicer. Learn describe las columnas calculadas como columnas que se crean con DAX en **Report**, **Table** o **Model view** ([Learn: calculated columns](https://learn.microsoft.com/power-bi/transform-model/desktop-calculated-columns)).

**Responde:**

| Caso | ¿Columna calculada, medida o Power Query? | Por qué |
|---|---|---|
| `Tipo de ingreso` para usar como leyenda | ___ | ___ |
| El total de ventas recurrentes del periodo filtrado | ___ | ___ |
| `Importe` de cada línea | ___ | ___ |

**Respuesta orientativa** (léela después): `Tipo de ingreso` es columna (un atributo del producto, que se usa para agrupar); también podría hacerse en Power Query, y es preferible si se necesita en varios modelos. El total recurrente del periodo es una **medida** (`CALCULATE([Ventas Totales], Productos[Tipo de ingreso] = "Recurrente")`): depende de los filtros. `Importe` se hizo en Power Query (Lab 118) porque es un dato fijo de cada línea y así no recarga el modelo con una columna DAX.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `Objetivo Total` sale igual para todos los vendedores | Falta la relación `Objetivos[VendedorID]` → `Vendedores[VendedorID]` | Ejercicio 3, relación 7 |
| `Ventas por Entrega` da lo mismo que `Ventas Totales` | La relación 8 está activa y la 1 inactiva (al revés) | **Manage relationships**: activa solo la de `FechaPedido` |
| Power BI no deja crear la relación de `FechaEntrega` | Ya existe un camino activo; es lo esperado | Créala inactiva (sin marcar **Make this relationship active**) |
| `Mark as date table` da error | La tabla tiene huecos o fechas repetidas | Revisa la fórmula de `Fecha`: `CALENDAR` con años completos |
| `Mes Año` sale ordenado `ene 2024`, `ene 2025`, `ene 2026`, `feb 2024`… | Se ordenó por `MesNum` | Ordénala por `AñoMes` |
| **Sort by Column** da error al ordenar `Mes` por `AñoMes` | `Mes` tiene varios valores de `AñoMes` (uno por año) | `Mes` se ordena por `MesNum`; `AñoMes` es para `Mes Año` |

## 🔧 Diagnóstico y reparación

### La matriz de cumplimiento no cuadra con la tabla esperada

1. **Mira el total de `Ventas Totales` sin filtros:** debe ser **57.492.383,40** (los tres años). Si no lo es, el problema está en el Lab 118, no en el modelo.
2. **Mira el slicer de año:** la tabla esperada es solo de 2025.
3. **Mira la relación `Objetivos[Fecha]` → `Fecha[Date]`:** si no existe, el slicer de año no filtra los objetivos y `Objetivo Total` sale con la suma de los tres años.

### Un filtro de `Productos` cambia el objetivo

No debería: `Productos` no está relacionada con `Objetivos`. Si lo hace, hay una relación de más o una relación con **Both**. Revisa **Manage relationships**.

## Checklist final

- [ ] `Fecha` tiene 1.096 filas, está marcada como tabla de fechas y `Mes` se ordena por `MesNum`
- [ ] 8 relaciones (7 activas, 1 inactiva), todas de muchos a uno y **Single**
- [ ] La matriz de 2025 da 20.840.961,90 de ventas contra 19.884.000 de objetivo (104,81 %)
- [ ] `Ventas por Entrega` da 20.799.528,90 en 2025
- [ ] Claves técnicas de los hechos ocultas; `Pais` y `Ciudad` con categoría de datos
- [ ] Jerarquías `Geografía` y `Calendario`
- [ ] Columna `Tipo de ingreso` en `Productos`

## Evidencia esperada

- Captura de **Model view** con las 8 relaciones (la inactiva, discontinua)
- Captura de la matriz de cumplimiento de 2025
- Captura de la matriz de pedido contra entrega con diciembre de 2025
- Tu tabla del Ejercicio 1 y tus respuestas del Ejercicio 7
- El archivo `ruta-pro-sit-ventas.pbix`

## Criterios de aprobación

- El modelo es una estrella con dos hechos, dimensiones compartidas y una tabla de fechas común
- La dimensión de rol se resuelve con una relación inactiva y `USERELATIONSHIP`, sin duplicar ventas
- Las cifras de cumplimiento y de pedido contra entrega coinciden con las esperadas
- Las propiedades del modelo (claves ocultas, categorías, orden, jerarquías) están aplicadas

## Competencias desarrolladas

- Identificar hechos, dimensiones y grano, y diseñar un esquema en estrella
- Crear y marcar una tabla de fechas común para varias tablas de hechos
- Implementar una dimensión de rol con una relación inactiva y `USERELATIONSHIP`
- Configurar propiedades de tablas y columnas para un modelo fácil de usar

## Reto adicional

**Reto básico:** crea `Ticket Promedio` (`DIVIDE([Ventas Totales], [Pedidos])`) y añádela a la matriz de cumplimiento. ¿Quién tiene el ticket más alto en 2025?

**Reto intermedio:** crea `Pedidos por Entrega` con `USERELATIONSHIP`, igual que `Ventas por Entrega`. ¿Cuántos pedidos se entregaron en diciembre de 2025?

**Reto avanzado:** finanzas quiere un único visual con **mes de pedido en las filas y mes de entrega en las columnas**, para ver cuánto tarda cada mes en entregarse. ¿Se puede hacer solo con `USERELATIONSHIP`? Razónalo y, si concluyes que no, implementa la alternativa de Learn: una segunda tabla de fechas (`Fecha Entrega`) con su propia relación activa a `Ventas[FechaEntrega]`. Escribe el trade-off en dos líneas.

## Preguntas de repaso

1. ¿Por qué `Vendedores` y `Fecha` se relacionan con los dos hechos, y `Productos` solo con `Ventas`?
2. ¿Qué significa `% Cumplimiento` cuando filtras por una categoría de producto, y qué harías para que el reporte no lleve a error?
3. ¿Por qué la relación de `FechaEntrega` tiene que ser inactiva?
4. ¿Cuándo crearías una columna calculada en DAX en lugar de hacerlo en Power Query?

## Limpieza del laboratorio

No borres nada: los Labs 120 y 121 escriben DAX sobre este modelo.

## Siguiente laboratorio recomendado

**Lab 120 — DAX esencial** (en construcción): medidas con `CALCULATE`, funciones estadísticas, medidas semiaditivas, medidas rápidas y grupos de cálculo, sobre este modelo.
