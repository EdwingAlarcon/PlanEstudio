---
id: lab-122
title: "Power BI — Rendimiento: Performance Analyzer, DAX query view y reducción del modelo (Ruta Pro Power BI)"
level: "N2"
duration: 150
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 121 completado — ruta-pro-sit-ventas.pbix con las medidas de los Labs 119 a 121 y el grupo de cálculo"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 122 — Power BI: rendimiento con Performance Analyzer y DAX query view

## Objetivo

Aprender el **método** para encontrar qué hace lento un reporte y comprobar las medidas sin construir visuales: medir cada visual con **Performance Analyzer**, llevar su consulta a **DAX query view**, consultar el modelo con DAX, reescribir una medida que filtra una tabla entera, y reducir el modelo (columnas que sobran, auto date/time). Cubre "Optimize model performance" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 121.

**Problema a resolver:** el reporte comercial crecerá: el año que viene se cargarán también los pedidos de las filiales y el archivo pasará de miles a cientos de miles de líneas. El jefe de analítica pide dejar el modelo preparado **antes** de que sea lento, y que cada cifra de los Labs 120 y 121 pueda comprobarse en segundos con una consulta, sin depender de que alguien arme un visual.

> **Un aviso honesto sobre los tiempos:** con las 3.995 líneas de SIT Ventas, cualquier visual tarda milisegundos y las mejoras de este lab apenas se notan en el cronómetro. Lo que se practica es el **método** (medir, aislar, reescribir, volver a medir) y los patrones que Learn recomienda. Tus tiempos dependen de tu equipo: anótalos, pero no esperes que coincidan con los de nadie.

## Lo que vas a construir

- Una medición con **Performance Analyzer** de la página `Tiempo` y la consulta del visual más lento en **DAX query view**
- Consultas DAX que comprueban las cifras de los Labs 120 y 121 en una sola tabla
- La estadística de columnas del modelo (`COLUMNSTATISTICS`) y una decisión sobre qué columnas sobran
- Una medida reescrita sin `FILTER` sobre la tabla de hechos y otra con variables
- El modelo sin auto date/time y sin una columna innecesaria (comprobando antes qué consultas la usan)

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Labs 119-121: modelo, medidas y grupo de cálculo | Medir, consultar y optimizar | Labs 123-125 (diseño de reportes): menos visuales por página y filtros restrictivos; Lab 126 publica el modelo optimizado |

> **Fuente del esqueleto:** el lab de rendimiento del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y la [guía de optimización de Power BI](https://learn.microsoft.com/power-bi/guidance/power-bi-optimization) de Learn. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Medir con Performance Analyzer | 25 min |
| Ejercicio 2 — La consulta de un visual en DAX query view | 20 min |
| Ejercicio 3 — Comprobar el modelo con consultas DAX | 30 min |
| Ejercicio 4 — Reescribir una medida que filtra la tabla entera | 25 min |
| Ejercicio 5 — Reducir el modelo | 35 min |
| Ejercicio 6 — Volver a medir | 15 min |
| **Total** | **unas 2 h 30 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: **Performance Analyzer**, **DAX query view**, DAX (`EVALUATE`, `SUMMARIZECOLUMNS`, `COLUMNSTATISTICS`, `DEFINE MEASURE`), Power Query (quitar columnas), **Options** > **Time intelligence**

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 121, con las páginas `Modelo`, `DAX`, `Contexto` y `Tiempo`
- [ ] **Guarda una copia** antes de empezar (`ruta-pro-sit-ventas-antes-optimizar.pbix`): en el Ejercicio 5 quitarás cosas del modelo

### Conocimiento previo

- Labs 120 y 121: las medidas y sus cifras esperadas
- [Módulo 12](/nivel/intermedio/modulo/power-bi-dax-avanzado): `CALCULATE` y filtros

---

## Ejercicio 1 — Medir con Performance Analyzer

**Objetivo:** saber cuánto tarda cada visual de una página y en qué se va ese tiempo.

1. Abre la página `Tiempo` (Lab 121). En la cinta **Optimize**, selecciona **Performance Analyzer**: se abre su panel ([Learn: Performance Analyzer](https://learn.microsoft.com/power-bi/create-reports/desktop-performance-analyzer)).
2. Selecciona **Start recording** y luego **Refresh visuals**: Power BI vuelve a dibujar todos los visuales de la página y registra cada uno.
3. Selecciona **Stop**. En la lista, expande el visual de la matriz con el grupo de cálculo.
4. Cada visual muestra su duración total en milisegundos y la descompone en categorías. Las que vas a ver:

| Categoría | Qué mide |
|---|---|
| **DAX query** | El tiempo desde que el visual envía la consulta hasta que el motor devuelve el resultado: el tiempo de tus medidas |
| **Visual display** | Lo que tarda el visual en dibujarse en pantalla (incluye imágenes o mapas) |
| **Other** | Esperas: preparar la consulta, esperar a que terminen otros visuales, procesar en segundo plano |

(Learn lista también **Direct query**, que solo aparece con modelos DirectQuery, y **Evaluated parameters (preview)**.)

5. **Anota** los tres visuales más lentos y, para cada uno, qué categoría pesa más.

> **Cómo leerlo:** si manda **DAX query**, el problema está en las medidas o en el modelo (Ejercicios 2 a 5). Si manda **Visual display**, en el visual (demasiados puntos, un visual personalizado). Si manda **Other**, a menudo en **cuántos** visuales hay en la página: la guía de Learn recomienda limitar los visuales por página.

### Validación del Ejercicio 1

| Visual | Duración total (ms) | Categoría que más pesa |
|---|---|---|
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |

---

## Ejercicio 2 — La consulta de un visual en DAX query view

**Objetivo:** ver la consulta DAX que Power BI genera para un visual y ejecutarla aparte.

1. En el panel **Performance Analyzer**, bajo el visual de la matriz con el grupo de cálculo, selecciona **Run in DAX query view**. (Alternativa: **Copy query**, abrir **DAX query view** con su icono a la izquierda y pegar.)
2. Se abre **DAX query view** con la consulta. Selecciona **Run**: el resultado aparece en la cuadrícula de abajo ([Learn: DAX query view](https://learn.microsoft.com/power-bi/transform-model/dax-query-view)).
3. **Lee la consulta** sin intentar entenderla entera. Busca y anota:
   - la función principal (`SUMMARIZECOLUMNS`), que agrupa por las columnas de filas y columnas del visual;
   - dónde aparece el filtro del slicer;
   - dónde aparecen tus medidas (`'Ventas'[Ventas Totales]`, `'Ventas'[Pedidos]`);
   - las variables y funciones que añade el visual por su cuenta (por ejemplo, para limitar el número de filas).

> **Para qué sirve:** cuando un visual es lento, esta es la consulta exacta que tarda. Puedes ejecutarla de nuevo después de cambiar una medida y comparar, sin tocar el reporte. **Shift+Alt+F** le da formato a la consulta para leerla mejor.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Función principal de la consulta | ___ |
| Cómo aparece el filtro del año en la consulta | ___ |

---

## Ejercicio 3 — Comprobar el modelo con consultas DAX

**Objetivo:** consultar el modelo directamente para verificar cifras, sin construir visuales.

1. En **DAX query view**, abre una pestaña de consulta nueva y escribe:

```dax
EVALUATE
SUMMARIZECOLUMNS (
    Fecha[Año],                       // una fila por año
    "Ventas", [Ventas Totales],
    "Pedidos", [Pedidos],
    "Ticket", [Ticket Promedio],
    "Cartera al cierre", [Cartera Pendiente]
)
ORDER BY Fecha[Año]
```

2. **Run**.

### Resultado esperado del Ejercicio 3, consulta 1

| Año | Ventas | Pedidos | Cartera al cierre |
|---|---|---|---|
| 2024 | 17.714.901,00 | 635 | 570.467,00 |
| 2025 | 20.840.961,90 | 748 | 611.900,00 |
| 2026 | 18.936.520,50 | 705 | 780.903,50 |

(Ticket 2025: 27.862,25. La cuadrícula muestra los números sin formato, con o sin separadores según tu configuración.)

3. **Medidas de prueba sin tocar el modelo.** Escribe una medida solo para la consulta con `DEFINE`:

```dax
DEFINE
    MEASURE Ventas[Crecimiento Ingenuo] =
        DIVIDE ( [Ventas Totales] - [Ventas Año Anterior], [Ventas Año Anterior] )   // solo existe mientras corre esta consulta
EVALUATE
SUMMARIZECOLUMNS (
    Fecha[Año],
    "Ingenuo", [Crecimiento Ingenuo],
    "Comparable", [% Crecimiento Comparable]
)
```

**Resultado esperado:** 2025: 17,65 % en las dos; 2026: **−9,14 %** ingenuo y **+14,29 %** comparable (como fracción: −0,0914 y 0,1429). Es la comprobación del Lab 121 en una sola consulta.

4. **Quick queries.** En el panel **Data** de **DAX query view**, clic derecho sobre la medida `Cartera Pendiente` > **Quick queries** > **Evaluate**: Power BI escribe la consulta por ti. Prueba también, sobre el modelo, **Define all measures in the model**: genera un `DEFINE` con el DAX de todas tus medidas, útil para revisarlas o documentarlas de una vez.
5. **Llevar una medida de la consulta al modelo:** si una medida definida con `DEFINE` te sirve, sobre ella aparece **Update model: Add new measure** (o el botón **Update model with changes**). No lo hagas con `Crecimiento Ingenuo`: es la medida que lleva a error.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Pedidos y cartera al cierre de 2026 | ___ |
| Crecimiento de 2026: ingenuo / comparable | ___ |

---

## Ejercicio 4 — Reescribir una medida que filtra la tabla entera

**Objetivo:** reconocer un patrón lento y reescribirlo como recomienda Learn.

1. Crea esta medida (es la forma "intuitiva" en que mucha gente escribe un filtro):

```dax
Ventas Licencias Lenta =
SUMX (
    FILTER ( Ventas, RELATED ( Productos[Categoria] ) = "Licencias" ),   // recorre TODAS las líneas de ventas, una por una
    Ventas[Importe]
)
```

2. Compárala en **DAX query view** con la del Lab 120:

```dax
EVALUATE
SUMMARIZECOLUMNS (
    Fecha[Año],
    "Lenta", [Ventas Licencias Lenta],
    "Correcta", [Ventas Licencias]
)
```

**Resultado esperado:** las dos dan lo mismo (2025: **13.799.948,40**). La diferencia no está en el resultado sino en **cómo** lo calcula el motor: `FILTER ( Ventas, … )` recorre la tabla de hechos fila a fila y busca la categoría de cada línea; el filtro booleano `Productos[Categoria] = "Licencias"` dentro de `CALCULATE` filtra una columna de una dimensión de 18 filas y deja que la relación haga el resto.

Learn lo resume así: pasa los filtros como expresiones booleanas siempre que puedas, y usa `FILTER` solo cuando haga falta (por ejemplo, para comparar dos medidas fila a fila) ([Learn: evitar FILTER como argumento de filtro](https://learn.microsoft.com/dax/best-practices/dax-avoid-avoid-filter-as-filter-argument)).

3. **Variables.** Mira `% Crecimiento` del Lab 121: guarda `[Ventas Año Anterior]` en una variable y la usa dos veces. Sin variable, la medida se calcularía dos veces. Learn cita como beneficios de las variables el rendimiento, la legibilidad, la depuración y reducir la complejidad ([Learn: variables en DAX](https://learn.microsoft.com/dax/best-practices/dax-variables)). Reescribe `% Crecimiento Comparable` (Lab 121) con dos variables, igual que `% Crecimiento`, y comprueba en **DAX query view** que da lo mismo.
4. Borra `Ventas Licencias Lenta`: ya cumplió su función.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| `Ventas Licencias Lenta` y `Ventas Licencias` en 2025 | ___ |
| Por qué el filtro booleano es preferible | ___ |
| Tu `% Crecimiento Comparable` con variables | ___ |

---

## Ejercicio 5 — Reducir el modelo

**Objetivo:** quitar lo que el modelo carga sin usar. En modelos de importación, un modelo más pequeño se actualiza antes y responde antes ([Learn: técnicas de reducción de datos](https://learn.microsoft.com/power-bi/guidance/import-modeling-data-reduction)).

### Tarea 5.1 — Mirar antes de cortar: estadísticas de columnas

1. En **DAX query view**, clic derecho sobre la tabla `Ventas` > **Quick queries** > **Show column statistics** (o escribe `EVALUATE COLUMNSTATISTICS ()` para todo el modelo).
2. La función devuelve una fila por columna con **Table Name**, **Column Name**, **Min**, **Max**, **Cardinality** y **Max Length** ([Learn: COLUMNSTATISTICS](https://learn.microsoft.com/dax/columnstatistics-function-dax)).
3. Anota la **Cardinality** (número de valores distintos) de `PedidoID` (esperado: **2.088**), `ClienteID` (**150**), `ProductoID` (**18**), `Mes` (**34**: un valor por mes con ventas), `Tasa` e `ImporteLocal`.

> **Por qué importa la cardinalidad:** el motor comprime cada columna por separado, y una columna con muchos valores distintos (como `ImporteLocal`, un decimal casi único por línea) ocupa mucho más que una con pocos (como `ProductoID`). Las columnas de alta cardinalidad que nadie usa son las primeras candidatas a salir.

### Tarea 5.2 — Quitar una columna que sobra, sin romper nada

Hay dos candidatas: `Ventas[Mes]` (texto `2025-03`) y `Ventas[Tasa]`. Las dos existían para el cruce con los tipos de cambio del Lab 118, las ocultaste en el Lab 119 y ninguna medida ni visual las usa. Pero "ningún visual la usa" no basta: hay que mirar también las **consultas**.

1. **Home** > **Transform data**. Selecciona la consulta `ControlSinTasa` y mira su paso de merge (el engranaje junto al paso, o el **Advanced Editor**): cruza `Ventas` con `TiposCambio` por `Mes` y `Moneda`. **Si quitas `Mes` de `Ventas`, el control deja de funcionar**: al abrirlo verás un error de columna no encontrada y ya no te avisará si un mes se queda sin tasa. Como `ControlSinTasa` no se carga al modelo, el error puede pasar inadvertido, que es lo peor de todo. `Mes` se queda.
2. `Tasa`, en cambio, solo sirvió para calcular `ImporteLocal`, y ninguna consulta posterior la usa. En la consulta `Ventas`, **al final de los pasos**, clic derecho en el encabezado de `Tasa` > **Remove**.
3. Antes de cerrar, selecciona `ControlSinTasa` en el editor y comprueba que sigue sin errores y con 0 filas. **Close & Apply**. Comprueba que la actualización termina sin errores y que `Ventas Totales` sigue dando 57.492.383,40.

> **Decide tú sobre `ImporteLocal`:** es la columna de más cardinalidad de `Ventas` (un decimal casi distinto por línea) y ninguna medida la usa todavía. Si nadie va a reportar en moneda local, sobra; si finanzas la quiere, se queda (y entonces conviene una medida que la use). Anota tu decisión y el motivo: en un proyecto real, esa conversación es la que evita quitar algo que alguien necesitaba.

### Tarea 5.3 — Desactivar auto date/time

Por cada columna de fecha, Power BI crea una tabla de fechas **oculta** (incluso para ti) si la opción auto date/time está activa. Son tablas calculadas que aumentan el tamaño del modelo ([Learn: auto date/time](https://learn.microsoft.com/power-bi/transform-model/desktop-auto-date-time)). Este modelo ya tiene su propia tabla `Fecha`, así que no las necesita.

1. Guarda el archivo y anota su tamaño en el Explorador de archivos.
2. **File** > **Options and settings** > **Options**. En la página **Current File**, sección **Time intelligence**, desmarca la opción auto date/time. **OK**.
3. Learn advierte que, al desactivarla en el archivo actual, se eliminan las tablas automáticas existentes: si algún visual usaba la jerarquía automática de una columna de fecha (por ejemplo, `FechaPedido` > **Date Hierarchy**), deja de funcionar y hay que rehacerlo con `Fecha`. Revisa las páginas.
4. Guarda y anota el tamaño de nuevo.
5. Para que no vuelva a pasar en archivos nuevos: en la página **Global** de las mismas opciones, desmarca **Auto date/time for new files**.

### Resultado esperado del Ejercicio 5

| Campo | Esperado |
|---|---|
| Cardinalidad de `PedidoID` / `ClienteID` / `ProductoID` | 2.088 / 150 / 18 |
| `Ventas Totales` tras quitar `Tasa` | 57.492.383,40 |
| Tamaño del archivo antes y después | Depende de tu versión; debe bajar o quedarse igual, nunca subir |

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Tamaño del `.pbix` antes / después | ___ |
| Por qué `Mes` se queda y `Tasa` no | ___ |
| Tu decisión sobre `ImporteLocal`, con el motivo | ___ |
| Visuales que tuviste que rehacer al quitar auto date/time | ___ |

---

## Ejercicio 6 — Volver a medir

**Objetivo:** cerrar el ciclo: medir otra vez con la misma prueba.

1. Página `Tiempo` > **Performance Analyzer** > **Clear** > **Start recording** > **Refresh visuals** > **Stop**.
2. Compara con tu tabla del Ejercicio 1. Repite la medición dos o tres veces: el primer refresco suele ser más lento (cachés vacías).
3. Escribe una conclusión de tres líneas para el jefe de analítica: qué cambiaste, qué mediste y qué harías cuando lleguen las líneas de las filiales.

> **Lo que harías con más datos** (para tu conclusión): la guía de Learn recomienda, además de lo hecho aquí, quitar filas innecesarias (por ejemplo, filtrar años que nadie consulta), agrupar y resumir cuando el detalle por línea no se usa, optimizar los tipos de datos, limitar los visuales por página y aplicar los filtros más restrictivos posibles ([Learn: optimization guide](https://learn.microsoft.com/power-bi/guidance/power-bi-optimization)).

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| No aparece **Performance Analyzer** | Buscas en otra cinta | Cinta **Optimize** > **Performance Analyzer** |
| El panel no registra nada | No se pulsó **Start recording** antes de **Refresh visuals** | Repite en ese orden |
| La consulta de `DEFINE MEASURE` da error de tabla | El nombre de tabla de la medida no existe | `MEASURE Ventas[Nombre] = …` con una tabla real del modelo |
| Tras quitar una columna, falla la actualización | Otra consulta la usaba (por ejemplo, `ControlSinTasa` usa `Mes`), o el paso **Remove** quedó antes de un paso que la necesita | Mira las consultas que dependen de `Ventas` y deja el **Remove** al final de los pasos |
| Un visual muestra un error de campos tras desactivar auto date/time | Usaba la jerarquía automática de una columna de fecha | Rehazlo con `Fecha[Año]`, `Fecha[Mes]` o la jerarquía `Calendario` |

## 🔧 Diagnóstico y reparación

### "La página tarda": por dónde empezar

1. **Performance Analyzer** en la página: ¿un visual o todos?
2. **Un visual:** mira la categoría. **DAX query** → lleva la consulta a **DAX query view** y prueba las medidas una a una con `EVALUATE`. **Visual display** → simplifica el visual.
3. **Todos un poco:** cuenta los visuales de la página; la guía de Learn recomienda limitarlos.
4. **Antes de reescribir DAX**, revisa el modelo: relaciones **Both** innecesarias (Lab 119), columnas de alta cardinalidad sin uso, auto date/time.

## Checklist final

- [ ] Medición de la página `Tiempo` antes y después, con los tres visuales más lentos
- [ ] Consulta de un visual ejecutada en **DAX query view**
- [ ] Consulta por año con ventas, pedidos y cartera: 2026 = 18.936.520,50 / 705 / 780.903,50
- [ ] `Ventas Licencias Lenta` comparada y eliminada; `% Crecimiento Comparable` con variables
- [ ] `Ventas[Tasa]` eliminada sin romper `ControlSinTasa`, y auto date/time desactivado

## Evidencia esperada

- Captura del panel **Performance Analyzer** antes y después
- Captura de **DAX query view** con la consulta de comprobación por año
- Tu tabla de cardinalidades y tu decisión sobre `ImporteLocal`
- Tu conclusión de tres líneas para el jefe de analítica

## Criterios de aprobación

- Usa Performance Analyzer para localizar el visual y la categoría de tiempo que pesa
- Comprueba cifras del modelo con consultas DAX y medidas definidas en la consulta
- Reescribe un `FILTER` sobre la tabla de hechos como filtro booleano y usa variables
- Reduce el modelo con criterio (estadísticas de columnas, auto date/time) sin romper el reporte

## Competencias desarrolladas

- Identificar visuales y medidas lentos con Performance Analyzer y DAX query view
- Escribir consultas DAX de verificación con `EVALUATE`, `SUMMARIZECOLUMNS` y `DEFINE MEASURE`
- Aplicar las recomendaciones de Learn sobre `FILTER` y variables
- Reducir el tamaño de un modelo de importación

## Reto adicional

**Reto básico:** con **Quick queries** > **Define all measures in the model**, copia el `DEFINE` resultante a un archivo de texto: es la documentación de tus medidas. Comprueba que ninguna conserva un nombre por defecto.

**Reto intermedio:** escribe una consulta que devuelva, para 2025, los 5 clientes con más ventas (`TOPN` sobre `Clientes` con `[Ventas Totales]`). ¿Coincide el primero con el del Lab 121 (Energía Puerto Ltda.)? Ojo: en el Lab 121 el ranking era de los tres años.

**Reto avanzado:** la tabla `Ventas` tiene `FechaPedido` y `FechaEntrega` como fecha. Si mañana se cargaran con hora (fecha y hora), ¿qué pasaría con su cardinalidad y con las relaciones con `Fecha[Date]`? Propón la transformación en Power Query que lo evita y justifícala con la sección "Optimize column data types" de la guía de reducción de datos.

## Preguntas de repaso

1. ¿Qué te dice que la categoría **DAX query** sea la mayor parte del tiempo de un visual? ¿Y **Visual display**?
2. ¿Para qué sirve definir una medida con `DEFINE MEASURE` en **DAX query view** en lugar de crearla en el modelo?
3. ¿Por qué `CALCULATE ( [Ventas Totales], Productos[Categoria] = "Licencias" )` es preferible a `SUMX ( FILTER ( Ventas, … ) )`?
4. ¿Qué crea auto date/time y por qué este modelo no lo necesita?

## Limpieza del laboratorio

Conserva `ruta-pro-sit-ventas.pbix` optimizado: los labs de reportes (123 a 125) trabajan sobre él. Puedes borrar las copias intermedias cuando hayas comprobado que todo funciona.

## Siguiente laboratorio recomendado

**Lab 123 — Diseño de reportes** (en construcción): temas, formato condicional, visual calculations, accesibilidad y diseño móvil sobre este modelo.
