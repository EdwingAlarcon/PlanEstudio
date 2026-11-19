---
id: lab-121
title: "Power BI — Contexto de filtro, inteligencia de tiempo y grupos de cálculo (Ruta Pro Power BI)"
level: "N2"
duration: 175
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 120 completado — ruta-pro-sit-ventas.pbix con Ventas Totales, Pedidos, % del Total Categorías y Cartera Pendiente"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 121 — Power BI: contexto de filtro, inteligencia de tiempo y grupos de cálculo

## Objetivo

Entender **qué filtra a una medida en cada celda** y usarlo a propósito: `ALL` frente a `ALLSELECTED`, la transición de contexto en una columna calculada, el acumulado del año, el año anterior, la ventana móvil de tres meses y la trampa más común de la inteligencia de tiempo (comparar un año incompleto con uno completo). Al final, un **grupo de cálculo** aplica esos cálculos de tiempo a cualquier medida sin duplicarlas. Cubre "Create model calculations by using DAX" (inteligencia de tiempo, grupos de cálculo) del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 120.

**Problema a resolver:** el gerente general presentó en noviembre de 2026 que "las ventas de 2026 caen un 9 % frente a 2025". El comité comercial no lo cree: los meses de 2026 superan a los de 2025 uno por uno. Los dos tienen razón con sus números, pero solo uno compara lo comparable. Además, el gerente de Colombia quiere ver el peso de cada región **dentro de Colombia**, no dentro de toda la empresa, y marketing pide clasificar a los clientes por lo que han comprado en total.

## Lo que vas a construir

- `% sobre Todas las Regiones` (`ALL`) y `% sobre lo Seleccionado` (`ALLSELECTED`)
- Las columnas calculadas `Ventas Cliente` y `Segmento Cliente` en `Clientes`, con y sin transición de contexto
- `Ventas YTD`, `Ventas Año Anterior`, `% Crecimiento` y `Ventas Últimos 3 Meses`
- La columna `Fecha[Con ventas]` y la medida `Ventas Año Anterior Comparable`
- Un grupo de cálculo `Inteligencia de tiempo` con cuatro elementos que funcionan con cualquier medida

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Lab 119: `Fecha` marcada como tabla de fechas · Lab 120: medidas base y `CALCULATE` | Contexto de filtro, transición de contexto, inteligencia de tiempo, grupos de cálculo | Lab 122 mide el rendimiento de estas medidas; los labs de reportes (123-125) las muestran |

> **Fuente del esqueleto:** el lab de DAX avanzado del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y las páginas de Learn citadas. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — `ALL` frente a `ALLSELECTED` | 25 min |
| Ejercicio 2 — Transición de contexto en una columna calculada | 25 min |
| Ejercicio 3 — Acumulado del año | 20 min |
| Ejercicio 4 — Año anterior y crecimiento | 20 min |
| Ejercicio 5 — La trampa del año incompleto | 30 min |
| Ejercicio 6 — Últimos tres meses | 15 min |
| Ejercicio 7 — Un grupo de cálculo de inteligencia de tiempo | 40 min |
| **Total** | **unas 2 h 55 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: DAX (`ALL`, `ALLSELECTED`, `KEEPFILTERS`, `TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATESINPERIOD`, `DATESYTD`, `SELECTEDMEASURE`), columnas calculadas, **Model view** > **Calculation group**

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 120
- [ ] `Fecha` marcada como tabla de fechas (Lab 119). **Sin esto, las funciones de tiempo de este lab dan resultados vacíos o incorrectos**

### Conocimiento previo

- Lab 120: `CALCULATE`, `REMOVEFILTERS` y por qué las medidas se recalculan en cada celda
- [Módulo 12](/nivel/intermedio/modulo/power-bi-dax-avanzado), Microlecciones 2 y 3: contexto de fila y de filtro, tabla de calendario

### Verificación rápida antes de empezar

- [ ] Con **2025** en el slicer: `Ventas Totales` **20.840.961,90**; sin filtros, **57.492.383,40**

---

## Ejercicio 1 — `ALL` frente a `ALLSELECTED`

**Objetivo:** decidir contra qué total se calcula un porcentaje.

1. Crea en `Ventas`:

```dax
% sobre Todas las Regiones =
DIVIDE ( [Ventas Totales], CALCULATE ( [Ventas Totales], ALL ( Regiones ) ) )   // ignora cualquier filtro de Regiones
```

```dax
% sobre lo Seleccionado =
DIVIDE ( [Ventas Totales], CALCULATE ( [Ventas Totales], ALLSELECTED ( Regiones ) ) )   // respeta los slicers y filtros externos
```

2. Página nueva `Contexto`: un slicer de `Fecha[Año]` con **2025**, un slicer de `Regiones[Pais]` con **Colombia** y una **Matrix** con `Regiones[Region]` en **Rows** y `Ventas Totales` y las dos medidas en **Values**.

`ALLSELECTED` quita los filtros de filas y columnas del visual, pero **conserva los filtros que vienen de fuera** (slicers, filtros de página); por eso se usa para totales "visibles" ([Learn: ALLSELECTED](https://learn.microsoft.com/dax/allselected-function-dax)). `ALL` los quita todos sobre la tabla indicada.

### Resultado esperado del Ejercicio 1 (2025, Colombia)

| Región | Ventas Totales | % sobre Todas las Regiones | % sobre lo Seleccionado |
|---|---|---|---|
| Andina | 2.279.734,90 | 10,94 % | 24,76 % |
| Antioquia | 4.303.248,20 | **20,65 %** | **46,73 %** |
| Caribe | 2.625.305,90 | 12,60 % | 28,51 % |
| **Total** | **9.208.289,00** | **44,18 %** | **100,00 %** |

Comprobado con un motor DAX sobre los archivos del curso. El gerente de Colombia quiere la última columna: "Antioquia es casi la mitad de **mi** país". La dirección general quiere la del medio: "Antioquia es una quinta parte de **la empresa**". Ninguna es "la buena": el título del visual debe decir cuál es.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Antioquia: % sobre todas / % sobre lo seleccionado | ___ |
| Qué filtro conserva `ALLSELECTED` y `ALL` no | ___ |

---

## Ejercicio 2 — Transición de contexto en una columna calculada

**Objetivo:** ver qué pasa cuando una fórmula de columna (que tiene **contexto de fila**) usa una medida.

1. En **Table view**, tabla `Clientes`, **New column**:

```dax
Ventas Cliente Sin Contexto = SUM ( Ventas[Importe] )   // en una columna no hay filtro: suma toda la tabla Ventas
```

Todas las filas muestran **57.492.383,40**. En una columna calculada hay una fila "actual" (contexto de fila), pero ese contexto **no filtra** otras tablas: `SUM` ve todas las ventas.

2. Ahora:

```dax
Ventas Cliente = [Ventas Totales]   // una medida dentro de una columna: CALCULATE implícito
```

Cada cliente muestra sus propias ventas. Al llamar a una medida, DAX la envuelve en un `CALCULATE` implícito que **convierte el contexto de fila en un filtro** (la fila de `Clientes` filtra `Ventas` a través de la relación). Eso es la **transición de contexto** ([Learn: contexto en DAX](https://learn.microsoft.com/dax/dax-overview)). `CALCULATE ( SUM ( Ventas[Importe] ) )` daría lo mismo.

3. Borra `Ventas Cliente Sin Contexto` (ya cumplió su función) y crea:

```dax
Segmento Cliente =
SWITCH (
    TRUE (),
    Clientes[Ventas Cliente] >= 500000, "A",
    Clientes[Ventas Cliente] >= 200000, "B",
    "C"
)
```

4. Una tabla con `Clientes[Segmento Cliente]` y un recuento de `Clientes[ClienteID]`.

### Resultado esperado del Ejercicio 2

| Segmento | Clientes |
|---|---|
| A (500.000 o más) | **32** |
| B (de 200.000 a 499.999) | **111** |
| C (menos de 200.000) | **7** |
| **Total** | **150** |

El cliente con más compras en los tres años es **Energía Puerto Ltda.**, con **783.075,00**.

> **Una columna calculada no responde a los slicers:** `Ventas Cliente` se calcula al actualizar con **todas** las ventas (los tres años) y queda guardada. Si eliges 2025 en el slicer, el segmento de cada cliente **no cambia**. Para un segmento "del periodo elegido" haría falta una medida, no una columna. Decide cuál quiere marketing antes de construirlo.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Valor de `Ventas Cliente Sin Contexto` en cualquier fila | ___ |
| Clientes A / B / C | ___ |
| Por qué el segmento no cambia con el slicer de año | ___ |

---

## Ejercicio 3 — Acumulado del año

**Objetivo:** el acumulado del año hasta la fecha (*year-to-date*, YTD).

```dax
Ventas YTD = TOTALYTD ( [Ventas Totales], Fecha[Date] )   // desde el 1 de enero hasta el último día del periodo de la celda
```

`TOTALYTD` acepta un cuarto argumento con el fin del año fiscal (por ejemplo `"6/30"`); sin él, el año termina el 31 de diciembre ([Learn: TOTALYTD](https://learn.microsoft.com/dax/totalytd-function-dax)).

1. Página nueva `Tiempo` con una **Matrix**: `Fecha[Año]` y `Fecha[Mes]` en **Rows**; `Ventas Totales` y `Ventas YTD` en **Values**. Expande 2025.

### Resultado esperado del Ejercicio 3

| Periodo | Ventas Totales | Ventas YTD |
|---|---|---|
| Marzo 2025 | 2.039.623,10 | **4.966.869,20** |
| Octubre 2025 | — | **16.568.491,50** |
| Total 2025 | 20.840.961,90 | **20.840.961,90** |

En la fila del año, el YTD es el año completo: el último día del periodo es el 31 de diciembre.

---

## Ejercicio 4 — Año anterior y crecimiento

**Objetivo:** comparar cada periodo con el mismo periodo del año anterior.

```dax
Ventas Año Anterior = CALCULATE ( [Ventas Totales], SAMEPERIODLASTYEAR ( Fecha[Date] ) )   // mismas fechas, un año atrás
```

```dax
% Crecimiento =
VAR Actual = [Ventas Totales]
VAR Anterior = [Ventas Año Anterior]
RETURN
    DIVIDE ( Actual - Anterior, Anterior )   // vacío si no hay año anterior (2024)
```

`SAMEPERIODLASTYEAR` devuelve las fechas del contexto desplazadas un año; equivale a `DATEADD ( Fecha[Date], -1, YEAR )` ([Learn: SAMEPERIODLASTYEAR](https://learn.microsoft.com/dax/sameperiodlastyear-function-dax)).

1. Añade las dos medidas a la matriz del Ejercicio 3 (formato **Percentage** para el crecimiento).

### Resultado esperado del Ejercicio 4

| Periodo | Ventas Totales | Ventas Año Anterior | % Crecimiento |
|---|---|---|---|
| Año 2025 | 20.840.961,90 | 17.714.901,00 | **17,65 %** |
| Marzo 2026 | 2.416.338,70 | 2.039.623,10 | **18,47 %** |
| Año 2024 | 17.714.901,00 | (vacío) | (vacío) |

---

## Ejercicio 5 — La trampa del año incompleto

**Objetivo:** encontrar y corregir el error del gerente general.

1. Mira la fila **2026** de la matriz:

| Año | Ventas Totales | Ventas Año Anterior | % Crecimiento |
|---|---|---|---|
| 2026 | 18.936.520,50 | **20.840.961,90** | **−9,14 %** |

**Diagnóstico (escríbelo antes de seguir):** ¿qué fechas de 2025 está sumando `Ventas Año Anterior` en la fila 2026? ¿Hasta qué mes hay ventas en 2026?

2. **La causa:** la tabla `Fecha` llega hasta el 31 de diciembre de 2026 (años completos, como pide Learn). En la fila 2026, `SAMEPERIODLASTYEAR` desplaza **todo** el año 2026 y suma 2025 entero, pero 2026 solo tiene ventas hasta el **31 de octubre**. Comparas diez meses contra doce.

3. **La corrección:** marca en `Fecha` qué días tienen ventas. En **Table view**, tabla `Fecha`, **New column**:

```dax
Con ventas = Fecha[Date] <= MAX ( Ventas[FechaPedido] )   // VERDADERO hasta el último día con pedidos (31/10/2026)
```

(Aquí `MAX` no tiene `CALCULATE`, así que no hay transición de contexto: devuelve la última fecha de pedido de toda la tabla, como viste en el Ejercicio 2.)

4. Y la medida:

```dax
Ventas Año Anterior Comparable =
CALCULATE ( [Ventas Año Anterior], Fecha[Con ventas] = TRUE () )   // solo desplaza los días que tienen ventas en el periodo actual
```

```dax
% Crecimiento Comparable =
DIVIDE ( [Ventas Totales] - [Ventas Año Anterior Comparable], [Ventas Año Anterior Comparable] )
```

### Resultado esperado del Ejercicio 5 (fila 2026)

| Medida | Valor |
|---|---|
| `Ventas Año Anterior Comparable` | **16.568.491,50** (enero a octubre de 2025) |
| `% Crecimiento Comparable` | **+14,29 %** |

Comprobado con un motor DAX (con una formulación equivalente del filtro de días con ventas): 16.568.491,50 es exactamente el `Ventas YTD` de octubre de 2025 del Ejercicio 3. **Las ventas de 2026 no caen un 9 %: crecen un 14 %.** En 2025 y en los meses, las dos versiones dan lo mismo, porque todos sus días tienen ventas.

> **Alternativa:** también puedes limitar `Fecha` a los días con datos. Learn recomienda años completos para las funciones de tiempo, así que la columna `Con ventas` es la opción más segura; además sirve como filtro de página para ocultar noviembre y diciembre de 2026 en los gráficos.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| % Crecimiento de 2026: ingenuo / comparable | ___ |
| Una frase para el gerente general | ___ |

---

## Ejercicio 6 — Últimos tres meses

**Objetivo:** una ventana móvil, útil para suavizar la estacionalidad.

```dax
Ventas Últimos 3 Meses =
CALCULATE (
    [Ventas Totales],
    DATESINPERIOD ( Fecha[Date], MAX ( Fecha[Date] ), -3, MONTH )   // 3 meses hacia atrás desde el último día del periodo
)
```

```dax
Promedio Mensual 3 Meses = DIVIDE ( [Ventas Últimos 3 Meses], 3 )
```

`DATESINPERIOD` devuelve las fechas desde la fecha de inicio y durante el número de intervalos indicado; con un número negativo, va hacia atrás ([Learn: DATESINPERIOD](https://learn.microsoft.com/dax/datesinperiod-function-dax)). El intervalo (`DAY`, `MONTH`, `QUARTER`, `YEAR`) se escribe sin comillas.

**Resultado esperado (diciembre 2025):** `Ventas Últimos 3 Meses` = **6.243.067,40** (octubre + noviembre + diciembre); `Promedio Mensual 3 Meses` = **2.081.022,47**, frente a las ventas de diciembre solo (1.873.122,60).

---

## Ejercicio 7 — Un grupo de cálculo de inteligencia de tiempo

**Objetivo:** aplicar YTD, año anterior y crecimiento a **cualquier** medida (ventas, pedidos, unidades) sin escribir tres medidas por cada una.

**El concepto:** un grupo de cálculo es una tabla especial cuyos elementos (*calculation items*) son fórmulas que reciben "la medida que esté en el visual" mediante `SELECTEDMEASURE()` ([Learn: calculation groups](https://learn.microsoft.com/power-bi/transform-model/calculation-groups)). `SELECTEDMEASURE` solo puede usarse dentro de un elemento de cálculo o de su cadena de formato ([Learn: SELECTEDMEASURE](https://learn.microsoft.com/dax/selectedmeasure-function-dax)).

1. **Guarda una copia** del archivo (`ruta-pro-sit-ventas-antes-grupo.pbix`): el paso siguiente cambia una propiedad del modelo.
2. Abre **Model view** y selecciona el botón **Calculation group** de la cinta.
3. Si el modelo permite medidas implícitas, Power BI te pide activar **discourage implicit measures**. Acepta. Learn explica la consecuencia: las columnas dejan de mostrar el símbolo de suma y ya no se pueden arrastrar a un visual como valores (las medidas implícitas existentes siguen funcionando). Desde ahora, todo valor de un visual es una medida explícita. Por eso este lab va después del 120: ya tienes las medidas que necesitas.
4. En el panel **Data** (con **Model** seleccionado arriba, es el **Model explorer**) aparece el grupo nuevo. Renombra la tabla a `Inteligencia de tiempo` y su columna a `Cálculo`.
5. Crea cuatro elementos (clic derecho sobre **Calculation items** > **New calculation item**), cada uno con su fórmula:

```dax
Actual = SELECTEDMEASURE ()
```

```dax
YTD = CALCULATE ( SELECTEDMEASURE (), DATESYTD ( Fecha[Date] ) )
```

```dax
Año anterior = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( Fecha[Date] ) )
```

```dax
Var % =
VAR Actual = SELECTEDMEASURE ()
VAR Anterior = CALCULATE ( SELECTEDMEASURE (), SAMEPERIODLASTYEAR ( Fecha[Date] ) )
RETURN
    DIVIDE ( Actual - Anterior, Anterior )
```

6. En `Var %`, activa **Dynamic format string** en el **Properties pane** y escribe `"0.00%"`: así ese elemento se muestra como porcentaje aunque la medida original tenga formato de moneda.
7. Ordena los elementos (Actual, YTD, Año anterior, Var %) en el **Properties pane** del grupo, sección **Calculation items**, o con clic derecho > mover arriba o abajo.
8. **Matrix** nueva: `Fecha[Año]` y `Fecha[Mes]` en **Rows**, `Inteligencia de tiempo[Cálculo]` en **Columns**, y `Ventas Totales` y `Pedidos` en **Values**.

### Resultado esperado del Ejercicio 7 (octubre)

| Periodo | Ventas — YTD | Pedidos — YTD |
|---|---|---|
| Octubre 2025 | **16.568.491,50** | **596** |
| Octubre 2026 | **18.936.520,50** | **705** |

Comprobado con un motor DAX. Fíjate en `Pedidos — YTD`: es un **recuento distinto** de pedidos de enero a octubre, no la suma de los recuentos mensuales. El grupo de cálculo no suma resultados: **reevalúa la medida** con otro filtro de fechas. Por eso funciona igual con `Ventas Totales`, `Pedidos`, `Unidades` o `Cartera Pendiente`.

> **Dos cuidados que señala Learn:** con un grupo de cálculo, todas las medidas pasan a tipo *variant*; si una medida devuelve texto, `Var %` daría un error de conversión (se protege con `ISNUMERIC ( SELECTEDMEASURE () )`). Y `Var %` del año 2026 tiene la misma trampa del Ejercicio 5: el reto avanzado te pide resolverla dentro del grupo.

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| `Pedidos — YTD` de octubre 2025 y 2026 | ___ |
| Qué propiedad del modelo cambió al crear el grupo | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `Ventas YTD` o `Ventas Año Anterior` salen vacías | `Fecha` no está marcada como tabla de fechas o la relación activa no llega a `Fecha[Date]` | Lab 119, Ejercicio 2 y Ejercicio 3 |
| `% sobre lo Seleccionado` da 100 % en cada fila | El argumento de `ALLSELECTED` es otra tabla (por ejemplo `Fecha`), así que no quita el filtro de la fila de región | `ALLSELECTED ( Regiones )` |
| Todas las filas de `Ventas Cliente` iguales | Se usó `SUM` sin `CALCULATE` ni medida | `[Ventas Totales]` o `CALCULATE ( SUM ( … ) )` |
| `Con ventas` es VERDADERO en todo 2026 | Se usó `TODAY()` o `MAX ( Fecha[Date] )` | `MAX ( Ventas[FechaPedido] )` |
| No se puede arrastrar `Ventas[Cantidad]` como valor | Es lo esperado tras crear el grupo de cálculo (**discourage implicit measures**) | Usa la medida `Unidades` |
| `Var %` muestra 0,18 en lugar de 18,47 % | Falta la cadena de formato dinámica | Paso 6 del Ejercicio 7 |

## 🔧 Diagnóstico y reparación

### "El crecimiento de este año está mal"

1. **¿El año actual está completo?** Mira el último mes con ventas. Si no es diciembre, compara con `Ventas Año Anterior Comparable`.
2. **¿Qué fechas suma el año anterior?** Ponlo en una matriz por mes: si los meses sin ventas del año actual tienen "año anterior", la comparación anual está inflada.
3. **¿Hay filtros de fecha de otra columna?** Un filtro sobre `Ventas[FechaPedido]` (oculta) no lo desplaza `SAMEPERIODLASTYEAR`; filtra siempre por `Fecha`.

## Checklist final

- [ ] Antioquia: 20,65 % de la empresa y 46,73 % de Colombia en 2025
- [ ] `Segmento Cliente`: 32 A, 111 B y 7 C
- [ ] `Ventas YTD` de octubre 2025: 16.568.491,50
- [ ] Crecimiento 2025: 17,65 %; 2026 comparable: +14,29 % (ingenuo: −9,14 %)
- [ ] `Ventas Últimos 3 Meses` de diciembre 2025: 6.243.067,40
- [ ] Grupo de cálculo con cuatro elementos y `Pedidos — YTD` de octubre 2025 = 596

## Evidencia esperada

- Captura de la matriz de Colombia con las dos columnas de porcentaje
- Captura de la matriz de 2026 con el crecimiento ingenuo y el comparable
- Captura de la matriz con el grupo de cálculo en columnas
- Tu frase para el gerente general (Ejercicio 5)

## Criterios de aprobación

- Elige `ALL` o `ALLSELECTED` según la pregunta de negocio y lo dice en el título del visual
- Explica la transición de contexto con el ejemplo de `Ventas Cliente`
- Detecta y corrige la comparación de un año incompleto
- El grupo de cálculo reevalúa cualquier medida y muestra `Var %` como porcentaje

## Competencias desarrolladas

- Controlar el contexto de filtro con `ALL`, `ALLSELECTED` y `KEEPFILTERS`
- Aplicar la transición de contexto en columnas calculadas
- Implementar inteligencia de tiempo: YTD, año anterior, crecimiento y ventanas móviles
- Crear un grupo de cálculo con elementos y cadena de formato dinámica

## Reto adicional

**Reto básico:** crea `Ventas MTD` con `TOTALMTD` y comprueba que en la fila de un mes coincide con `Ventas Totales`.

**Reto intermedio:** en el Lab 120, `Ventas Licencias` daba 13.799.948,40 también en la fila Servicios. Escribe `Ventas Licencias en Contexto` con `KEEPFILTERS ( Productos[Categoria] = "Licencias" )` y comprueba que en la fila Servicios queda vacía y en Licencias no cambia.

**Reto avanzado:** haz que `Var %` del grupo de cálculo use solo los días con ventas (como en el Ejercicio 5), de modo que 2026 muestre +14,29 %. Pista: el filtro `Fecha[Con ventas] = TRUE ()` puede ir dentro del `CALCULATE` del año anterior.

## Preguntas de repaso

1. ¿Qué conserva `ALLSELECTED` que `ALL` elimina?
2. ¿Por qué `SUM ( Ventas[Importe] )` en una columna de `Clientes` da el total de la empresa, y `[Ventas Totales]` no?
3. ¿Por qué el crecimiento de 2026 salía negativo, y qué cambió para corregirlo?
4. ¿Qué ventaja tiene un grupo de cálculo frente a escribir `Ventas YTD`, `Pedidos YTD`, `Unidades YTD`…?

## Limpieza del laboratorio

Conserva las dos versiones del archivo (con y sin grupo de cálculo): el Lab 122 mide el rendimiento sobre la versión con grupo.

## Siguiente laboratorio recomendado

**[Lab 122 — Rendimiento: Performance Analyzer y DAX query view](/labs/lab-122-power-bi-rendimiento-performance-analyzer-dax-query-view)**: medir qué tarda, leer la consulta que genera un visual y reducir el modelo.
