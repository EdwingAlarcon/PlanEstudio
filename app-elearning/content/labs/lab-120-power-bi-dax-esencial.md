---
id: lab-120
title: "Power BI — DAX esencial: medidas, CALCULATE, estadísticas y semiaditivas (Ruta Pro Power BI)"
level: "N2"
duration: 160
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 119 completado — ruta-pro-sit-ventas.pbix con el modelo en estrella, la tabla Fecha y las medidas Ventas Totales, Pedidos, Objetivo Total y % Cumplimiento"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 120 — Power BI: DAX esencial

## Objetivo

Escribir las medidas que un comité comercial pide de verdad y entender por qué dan lo que dan: medidas simples y derivadas, funciones estadísticas (promedio, mediana, máximo), `CALCULATE` para cambiar el filtro, porcentajes del total, una medida **semiaditiva** (la cartera pendiente de entrega, que se suma entre productos pero no entre meses) y medidas rápidas, leyendo el DAX que generan. Cubre "Create model calculations by using DAX" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 119.

**Problema a resolver:** el comité comercial recibe cada mes una tabla con ventas y pedidos, pero hace tres preguntas que esa tabla no responde: cuánto vale un pedido típico (y si el promedio engaña), qué parte de lo vendido son licencias, y cuánto dinero está **vendido pero no entregado** al cierre de cada mes. Esa última cifra la usa finanzas para planificar la facturación, y hoy la calcula alguien a mano sumando mal los meses.

## Lo que vas a construir

- Las medidas `Ticket Promedio`, `Clientes Activos` y `Unidades`
- Tres medidas estadísticas sobre el importe por línea: `Promedio por Línea`, `Mediana por Línea` y `Máximo por Línea`
- `Ventas Licencias` y `% del Total` con `CALCULATE` y `REMOVEFILTERS`
- La medida semiaditiva `Cartera Pendiente`, con el total del año igual al cierre de diciembre
- Una medida rápida (*quick measure*) y la lectura del DAX que genera

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Lab 119: modelo en estrella, tabla `Fecha` marcada, `Ventas Totales` y `Pedidos` | Medidas derivadas, estadísticas, `CALCULATE`, semiaditivas, medidas rápidas | Lab 121 (contexto de filtro, inteligencia de tiempo y grupos de cálculo) y Lab 122 (rendimiento) |

> **Fuente del esqueleto:** el lab de DAX del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y las páginas de Learn citadas en cada ejercicio. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Medidas derivadas | 20 min |
| Ejercicio 2 — Estadísticas: cuando el promedio engaña | 20 min |
| Ejercicio 3 — `CALCULATE` y el porcentaje del total | 30 min |
| Ejercicio 4 — Una medida semiaditiva: la cartera pendiente | 45 min |
| Ejercicio 5 — Medidas rápidas y el DAX que generan | 20 min |
| Ejercicio 6 — Formato y orden de las medidas | 15 min |
| **Total** | **unas 2 h 40 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: Report view, Table view, DAX (`DIVIDE`, `DISTINCTCOUNT`, `AVERAGE`, `MEDIAN`, `MAX`, `CALCULATE`, `REMOVEFILTERS`, `ISBLANK`, variables `VAR`/`RETURN`), **Quick measures**

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 119, con la tabla `Fecha` marcada como tabla de fechas y las ocho relaciones

### Conocimiento previo

- Lab 119: medidas `Ventas Totales` y `Pedidos`, relaciones activas e inactivas
- [Módulo 12](/nivel/intermedio/modulo/power-bi-dax-avanzado), Microlección 1: qué es una medida y qué hace `CALCULATE`

### Verificación rápida antes de empezar

- [ ] Una tarjeta con `Ventas Totales` sin ningún filtro muestra **57.492.383,40** (los tres años)
- [ ] Con el slicer de la página `Modelo` en **2025**, `Ventas Totales` vale **20.840.961,90** y `Pedidos` **748**

> **Cómo escribir una medida (recordatorio):** selecciona la tabla en el panel **Data**, **New measure** (en la cinta **Home** o **Table tools**) y escribe la fórmula en la barra. Si tu Power BI Desktop usa separador `;`, cámbialo en las fórmulas (Lab 116). **Shift+Enter** hace un salto de línea sin confirmar la medida.

---

## Ejercicio 1 — Medidas derivadas

**Objetivo:** construir medidas nuevas a partir de las que ya existen, en lugar de repetir la lógica.

1. Crea en `Ventas`:

```dax
Ticket Promedio = DIVIDE ( [Ventas Totales], [Pedidos] )   // importe medio por pedido; vacío si no hay pedidos
```

```dax
Clientes Activos = DISTINCTCOUNT ( Ventas[ClienteID] )   // clientes con al menos una línea en el filtro actual
```

```dax
Unidades = SUM ( Ventas[Cantidad] )
```

2. Crea una página nueva `DAX` con el mismo **Slicer** de `Fecha[Año]` que en el Lab 119 (lista vertical, **2025** marcado) y tres tarjetas con las medidas nuevas.

> **Por qué `DIVIDE` y no `/`:** `DIVIDE` devuelve vacío (o el valor alternativo que le indiques) cuando el divisor es cero o vacío, en lugar de un error o un infinito. Learn recomienda usarlo cuando el divisor puede ser cero ([Learn: DIVIDE vs. operador de división](https://learn.microsoft.com/power-bi/guidance/dax-divide-function-operator)).

> **Medida derivada:** `Ticket Promedio` reutiliza `[Ventas Totales]` y `[Pedidos]`. Si mañana `Ventas Totales` cambia (por ejemplo, para excluir devoluciones), el ticket cambia solo. Repetir `SUM ( Ventas[Importe] )` dentro de cada medida es la forma más rápida de que dos reportes den cifras distintas.

### Resultado esperado del Ejercicio 1 (año 2025)

| Medida | Valor |
|---|---|
| `Ticket Promedio` | **27.862,25** |
| `Clientes Activos` | **149** |
| `Unidades` | **50.481** |

3. Añade `Ticket Promedio` y `Clientes Activos` a una **Matrix** con `Vendedores[Vendedor]` en **Rows** (2025):

| Vendedor | Ticket Promedio | Clientes Activos |
|---|---|---|
| Diego Hernández | 32.357,50 | 16 |
| Julián Pérez | 30.175,93 | 19 |
| Valeria Quispe | 29.973,65 | 18 |
| Camila Restrepo | 27.409,22 | 27 |
| Tomás Fuentes | 26.840,05 | 26 |
| Andrés Rojas | 26.778,72 | 18 |
| Mariana Torres | 26.116,16 | 25 |
| Laura Gómez | 21.879,04 | 17 |
| **Total** | **27.862,25** | **149** |

> **Fíjate en el total de `Clientes Activos`:** la suma de la columna da 166, pero el total dice **149**. No es un error: un mismo cliente puede comprar a dos vendedores (pasa en Bogotá, donde trabajan Laura y Andrés), y en el total cada cliente cuenta una vez. Las medidas **no se suman**: se recalculan en cada celda, también en la del total. Es la idea más importante de este lab.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| `Ticket Promedio` 2025 | ___ |
| Suma de la columna `Clientes Activos` frente al total | ___ |
| Por qué no coinciden | ___ |

---

## Ejercicio 2 — Estadísticas: cuando el promedio engaña

**Objetivo:** usar las funciones estadísticas básicas y decidir cuál comunicar.

1. Crea en `Ventas`:

```dax
Promedio por Línea = AVERAGE ( Ventas[Importe] )
```

```dax
Mediana por Línea = MEDIAN ( Ventas[Importe] )   // la mitad de las líneas vale menos que esto
```

```dax
Máximo por Línea = MAX ( Ventas[Importe] )
```

2. Ponlas en tarjetas, con **2025** en el slicer ([Learn: funciones estadísticas](https://learn.microsoft.com/dax/statistical-functions-dax)).

### Resultado esperado del Ejercicio 2 (año 2025, 1.438 líneas)

| Medida | Valor |
|---|---|
| `Promedio por Línea` | **14.493,02** |
| `Mediana por Línea` | **9.540,00** |
| `Máximo por Línea` | **93.600,00** |

3. **Interpreta:** el promedio es un 52 % más alto que la mediana. Pocas líneas muy grandes (implementaciones, licencias de muchos usuarios) tiran del promedio hacia arriba. Si el comité pregunta "¿cuánto vale una línea típica?", la respuesta honesta es la mediana; si pregunta "¿cuánto facturamos en promedio por línea?", es el promedio. Las dos son correctas para preguntas distintas.

> **`AVERAGE` frente a `Ticket Promedio`:** `AVERAGE ( Ventas[Importe] )` promedia **líneas** (1.438); `Ticket Promedio` divide entre **pedidos** (748). Un pedido puede tener hasta 4 líneas, por eso el ticket (27.862,25) es casi el doble del promedio por línea. Antes de escribir "promedio" en un reporte, di de qué.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Promedio y mediana por línea 2025 | ___ |
| Cuál comunicarías como "línea típica" y por qué | ___ |

---

## Ejercicio 3 — `CALCULATE` y el porcentaje del total

**Objetivo:** cambiar el contexto de filtro de una medida: añadir un filtro y quitar otro.

### Tarea 3.1 — Añadir un filtro

```dax
Ventas Licencias =
CALCULATE (
    [Ventas Totales],
    Productos[Categoria] = "Licencias"   // filtro que se añade (y reemplaza cualquier filtro sobre Categoria)
)
```

```dax
% Licencias = DIVIDE ( [Ventas Licencias], [Ventas Totales] )
```

`CALCULATE` evalúa la expresión en un contexto de filtro modificado por los argumentos que le das ([Learn: CALCULATE](https://learn.microsoft.com/dax/calculate-function-dax)).

**Resultado esperado (2025):** `Ventas Licencias` = **13.799.948,40** y `% Licencias` = **66,22 %** (formato de porcentaje, como en el Lab 119).

### Tarea 3.2 — Quitar un filtro: el porcentaje del total

```dax
% del Total Categorías =
DIVIDE (
    [Ventas Totales],
    CALCULATE ( [Ventas Totales], REMOVEFILTERS ( Productos ) )   // denominador: todas las categorías
)
```

`REMOVEFILTERS` quita los filtros de la tabla o columna que le indiques y solo sirve para eso: no devuelve una tabla que puedas usar en otra función ([Learn: REMOVEFILTERS](https://learn.microsoft.com/dax/removefilters-function-dax)).

1. **Matrix** con `Productos[Categoria]` en **Rows** y `Ventas Totales`, `% del Total Categorías` en **Values** (2025).

### Resultado esperado de la Tarea 3.2 (2025)

| Categoría | Ventas Totales | % del Total Categorías |
|---|---|---|
| Licencias | 13.799.948,40 | 66,22 % |
| Servicios | 5.941.370,00 | 28,51 % |
| Capacitación | 1.099.643,50 | 5,28 % |
| **Total** | **20.840.961,90** | **100,00 %** |

2. **Experimento:** cambia el slicer a **2024**. Los porcentajes cambian, pero el total sigue siendo 100 %: `REMOVEFILTERS ( Productos )` quita el filtro de categoría, **no** el de año, que viene de otra tabla (`Fecha`).

> **`Ventas Licencias` dentro de la matriz:** en la fila **Servicios**, `Ventas Licencias` daría 13.799.948,40, no vacío: el filtro `Productos[Categoria] = "Licencias"` **reemplaza** el filtro de la fila. Si quisieras que respetara la fila (y diera vacío en Servicios), usarías `KEEPFILTERS`. Lo verás en el Lab 121.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| `% Licencias` 2025 | ___ |
| `% del Total Categorías` de Servicios en 2024 | ___ |
| Qué filtro quita `REMOVEFILTERS ( Productos )` y cuál no | ___ |

---

## Ejercicio 4 — Una medida semiaditiva: la cartera pendiente

**Objetivo:** calcular un **saldo** (cuánto está pedido y aún no entregado en una fecha) y que el total de un periodo muestre el saldo de cierre, no la suma de los saldos.

**El concepto:** las ventas son **aditivas**: las de enero más las de febrero son las del bimestre. Un saldo no: si a fin de enero había 500.000 pendientes y a fin de febrero 600.000, el bimestre no tiene 1.100.000 pendientes, tiene 600.000 (el saldo al cierre). Un saldo se suma entre productos, clientes o regiones, pero **no a lo largo del tiempo**: es una medida **semiaditiva**. DAX ofrece funciones como `CLOSINGBALANCEMONTH` para cuando el saldo ya está guardado en una tabla (un inventario o un extracto bancario por día) ([Learn: CLOSINGBALANCEMONTH](https://learn.microsoft.com/dax/closingbalancemonth-function-dax)). Aquí el saldo no está guardado: lo calculas a partir de las fechas de pedido y de entrega.

1. Crea en `Ventas`:

```dax
Cartera Pendiente =
VAR FinPeriodo = MAX ( Fecha[Date] )   // último día del periodo de la celda (mes, trimestre o año)
RETURN
    CALCULATE (
        [Ventas Totales],
        REMOVEFILTERS ( Fecha ),   // las líneas pendientes pueden venir de pedidos de meses anteriores
        Ventas[FechaPedido] <= FinPeriodo,   // ya estaban pedidas al cierre...
        ISBLANK ( Ventas[FechaEntrega] ) || Ventas[FechaEntrega] > FinPeriodo   // ...y no entregadas a esa fecha
    )
```

Las columnas `FechaPedido` y `FechaEntrega` están ocultas desde el Lab 119, pero las fórmulas DAX pueden usarlas: ocultar solo las quita del panel **Data** del reporte.

2. **Matrix** con `Fecha[Año]` y `Fecha[Mes]` en **Rows** y `Cartera Pendiente` en **Values**. Quita la selección del slicer de año (o desactiva su efecto sobre este visual) para ver los tres años y expande 2025.

### Resultado esperado del Ejercicio 4

| Periodo | Cartera Pendiente |
|---|---|
| Diciembre 2024 (y total 2024) | **570.467,00** |
| Junio 2025 | **535.108,50** |
| Noviembre 2025 | **943.978,50** |
| Diciembre 2025 (y **total 2025**) | **611.900,00** |
| Junio 2026 | **577.544,40** |
| Octubre 2026, diciembre 2026 y **total 2026** | **780.903,50** |

Comprobado con un motor DAX (el modelo de datos de Excel) sobre los archivos del curso. Fíjate en tres cosas:

- **El total de 2025 es el de diciembre (611.900,00)**, no la suma de los doce meses (que daría **7.508.388,40**, una cifra sin sentido). Lo hace solo: `MAX ( Fecha[Date] )` en la fila del año es el 31 de diciembre.
- **Noviembre 2025 es el pico** (943.978,50): diciembre es el mes de más pedidos (estacionalidad) y los proyectos pedidos en octubre y noviembre aún no se habían entregado.
- **2026 cierra en 780.903,50**, exactamente las 54 líneas sin fecha de entrega del Lab 119. Noviembre y diciembre de 2026 no tienen pedidos todavía, así que su saldo es el de octubre.

> **Si tu total del año sale como la suma de los meses**, escribiste la medida con `SUMX` sobre los meses o usaste `MIN ( Fecha[Date] )`. Revisa la variable `FinPeriodo`.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| `Cartera Pendiente` de noviembre y diciembre de 2025 | ___ |
| Total del año 2025 | ___ |
| En una frase: por qué el total del año no es la suma de los meses | ___ |

---

## Ejercicio 5 — Medidas rápidas y el DAX que generan

**Objetivo:** usar una medida rápida para un cálculo común y leer (y entender) el DAX que escribe por ti.

1. En el panel **Data**, clic derecho (o **…**) sobre la tabla `Ventas` > **New quick measure** ([Learn: quick measures](https://learn.microsoft.com/power-bi/transform-model/desktop-quick-measures)).
2. En la ventana **Quick measures**, en **Select a calculation**, elige **Average per category** (grupo *Aggregate per category*).
3. Arrastra `Ventas Totales` a **Base value** y `Vendedores[Vendedor]` a **Category**. Confirma.
4. Power BI crea una medida con un nombre largo. Selecciónala en el panel **Data**: el DAX aparece en la barra de fórmulas y puedes editarlo como cualquier otra medida. Renómbala `Venta Media por Vendedor`.
5. Ponla en una tarjeta con **2025** en el slicer.

**Resultado esperado (2025):** **2.605.120,24**: las ventas del año entre los **8** ejecutivos con ventas.

6. **Lee el DAX generado** y responde: ¿qué función recorre los vendedores? ¿Por qué el resultado divide entre 8 y no entre los 10 vendedores de la tabla? (Pista: los dos gerentes no tienen ventas, y el promedio de un iterador ignora los resultados vacíos.)

> **Cuándo usar medidas rápidas:** para cálculos estándar (promedio por categoría, total acumulado, acumulado del año, variación interanual) son rápidas y correctas. Pero su DAX usa nombres genéricos y no conoce tus reglas de negocio. Úsalas para **aprender el patrón** y luego decide si dejas la medida tal cual o la reescribes con tu convención.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| `Venta Media por Vendedor` 2025 | ___ |
| Función iteradora que usa el DAX generado | ___ |

---

## Ejercicio 6 — Formato y orden de las medidas

**Objetivo:** que quien use el modelo encuentre las medidas y las lea bien sin tocar cada visual.

1. Selecciona cada medida en el panel **Data** y, en la cinta **Measure tools**, fija el formato: `Ventas Totales`, `Ventas Licencias`, `Cartera Pendiente`, `Ticket Promedio`, `Venta Media por Vendedor` y las estadísticas con separador de miles y 2 decimales; `% Licencias` y `% del Total Categorías` como **Percentage**; `Pedidos`, `Clientes Activos` y `Unidades` como número entero.
2. El formato de la medida se aplica en todos los visuales. Si lo cambias en un visual, solo cambia ahí.
3. Mira el panel **Data**: las medidas de `Ventas` se mezclan con las columnas. En el Lab 122 verás cómo ayuda reducir el modelo; por ahora, verifica que no queda ninguna medida con el nombre por defecto (`Measure`, `Measure 2`).

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `Ticket Promedio` da error o infinito en un mes sin pedidos | Se usó `/` en lugar de `DIVIDE` | `DIVIDE ( [Ventas Totales], [Pedidos] )` |
| El total de `Clientes Activos` "no cuadra" con la suma | Es lo esperado: un cliente cuenta una vez en el total | Explícalo en el reporte; no lo "corrijas" con `SUMX` |
| `% del Total Categorías` da 100 % en todas las filas | El denominador no quita el filtro de categoría | `REMOVEFILTERS ( Productos )` dentro del `CALCULATE` del denominador |
| `Cartera Pendiente` sale vacía en todas las celdas | Falta `REMOVEFILTERS ( Fecha )`: el filtro del mes deja fuera los pedidos de meses anteriores | Revisa los filtros del `CALCULATE` |
| El total del año de `Cartera Pendiente` es enorme | Se sumaron los meses | La medida debe tomar `MAX ( Fecha[Date] )` del periodo |
| Error de sintaxis en las comas | Configuración regional con `;` | Cambia `,` por `;` (Lab 116) |

## 🔧 Diagnóstico y reparación

### Las cifras de 2025 no coinciden con las esperadas

1. **`Ventas Totales` sin filtros** debe ser 57.492.383,40. Si no, el problema está en el Lab 118.
2. **El slicer de año:** ¿filtra este visual? Selecciona el slicer, cinta **Format** > **Edit interactions**, y mira el icono sobre cada visual.
3. **La relación activa** entre `Ventas` y `Fecha` debe ser la de `FechaPedido` (Lab 119). Si activaste la de `FechaEntrega`, todas las cifras por año cambian (2025 daría 20.799.528,90).

### La cartera de un mes es mayor que las ventas del año

Es posible y no es error si hay proyectos grandes pendientes, pero en estos datos no pasa. Revisa el signo de las comparaciones: debe ser `FechaPedido <= FinPeriodo` y `FechaEntrega > FinPeriodo`.

## Checklist final

- [ ] `Ticket Promedio` 27.862,25, `Clientes Activos` 149 y `Unidades` 50.481 en 2025
- [ ] Promedio 14.493,02, mediana 9.540,00 y máximo 93.600,00 por línea en 2025
- [ ] `% Licencias` 66,22 % y `% del Total Categorías` suma 100 %
- [ ] `Cartera Pendiente` da 611.900,00 en el total de 2025 y 780.903,50 en 2026
- [ ] Medida rápida renombrada y su DAX leído
- [ ] Formatos aplicados a todas las medidas

## Evidencia esperada

- Captura de la matriz por vendedor con `Ticket Promedio` y `Clientes Activos`
- Captura de la matriz de `Cartera Pendiente` con 2025 expandido
- El DAX de la medida rápida pegado en tu documento, con una frase que explique qué hace
- Tus respuestas de validación

## Criterios de aprobación

- Las medidas reutilizan medidas base en lugar de repetir la lógica
- Distingue cuándo comunicar promedio y cuándo mediana
- `CALCULATE` añade y quita filtros de forma intencionada
- La medida semiaditiva da el saldo de cierre en los totales

## Competencias desarrolladas

- Crear medidas simples, derivadas y estadísticas con DAX
- Modificar el contexto de filtro con `CALCULATE` y `REMOVEFILTERS`
- Implementar una medida semiaditiva
- Crear medidas rápidas y revisar el DAX que generan

## Reto adicional

**Reto básico:** crea `Ventas Servicios` y `% Servicios` sin copiar y pegar: reutiliza el patrón de `Ventas Licencias`.

**Reto intermedio:** crea `Cartera Pendiente Licencias` usando `CALCULATE ( [Cartera Pendiente], Productos[Categoria] = "Licencias" )`. ¿Por qué es mucho menor que la cartera total? (Pista: en estos datos las licencias se entregan entre 1 y 3 días después del pedido; casi nunca quedan pendientes a fin de mes.)

**Reto avanzado:** finanzas quiere `Días Promedio de Entrega` (de pedido a entrega, solo líneas entregadas). Escríbela con `AVERAGEX` y una diferencia de fechas, y decide qué hacer con las 54 líneas sin entrega. Escribe el criterio en una línea.

## Preguntas de repaso

1. ¿Por qué el total de `Clientes Activos` no es la suma de las filas?
2. ¿Qué diferencia hay entre añadir un filtro con `CALCULATE` y quitarlo con `REMOVEFILTERS`?
3. ¿Qué hace que una medida sea semiaditiva? Da un ejemplo distinto a la cartera.
4. ¿Qué revisarías antes de dejar en el modelo una medida creada con **Quick measures**?

## Limpieza del laboratorio

No borres nada: el Lab 121 usa estas medidas.

## Siguiente laboratorio recomendado

**[Lab 121 — Contexto de filtro e inteligencia de tiempo](/labs/lab-121-power-bi-contexto-filtro-inteligencia-tiempo)**: `ALL` frente a `ALLSELECTED`, transición de contexto, acumulado del año, año anterior comparable y grupos de cálculo.
