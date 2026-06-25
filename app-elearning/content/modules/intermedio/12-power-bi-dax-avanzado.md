---
moduleId: 12
title: "Power BI — DAX Avanzado"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 10
slug: "power-bi-dax-avanzado"
---
### 🎯 Objetivo
Dominar DAX avanzado: CALCULATE con múltiples filtros, contexto de filtro vs fila, funciones de inteligencia de tiempo, Row Level Security, y métricas de negocio complejas como cohortes y métricas móviles.

### 📖 Conceptos Clave
- **Contexto de filtro (Filter Context):** conjunto de todos los filtros activos en un momento dado que determinan qué filas participan en el cálculo de una medida. Proviene de tres fuentes: slicers del reporte, filtros de la página/visual, y filtros definidos en el modelo de datos (relaciones). Comprender el contexto de filtro es la clave para entender por qué una medida DAX retorna un valor específico en una celda particular. Ejemplo: en una tabla con filas por mes y columnas por región, cada celda tiene un contexto de filtro diferente (mes=Enero, región=Norte).

- **Contexto de fila (Row Context):** contexto creado durante la iteración fila por fila sobre una tabla, presente en columnas calculadas y en funciones iteradoras (SUMX, AVERAGEX, MAXX, FILTER). En el contexto de fila puedes referenciar cualquier columna de la tabla iterada directamente. No está presente en medidas simples (solo existe en iteradores). Ejemplo: en `SUMX(Ventas, Ventas[Cantidad] * Ventas[Precio])`, el contexto de fila permite multiplicar Cantidad × Precio de cada fila específica.

- **Transición de contexto:** comportamiento de CALCULATE que convierte automáticamente el contexto de fila actual en un contexto de filtro equivalente. Ocurre cuando CALCULATE se llama dentro de un iterador (SUMX, AVERAGEX, etc.) o en una columna calculada. Es uno de los conceptos más avanzados de DAX: permite que las medidas calculadas dentro de un iterador "filtren" la tabla por la fila actual. Comprenderlo es esencial para patrones como SUMX sobre medidas.

- **CALCULATE:** función central de DAX que evalúa una expresión en un contexto de filtro modificado. Acepta la expresión a calcular y N modificadores de filtro. Es la única función que puede modificar el contexto de filtro. Soporta dos tipos de argumentos: expresiones de tabla (que reemplazan el filtro de esa tabla) y funciones especiales como ALL, ALLEXCEPT, USERELATIONSHIP. Ejemplo: `CALCULATE([Total Ventas], Productos[Categoria] = "Electrónica")` calcula Total Ventas solo para productos de electrónica, independientemente del filtro de categoría actual.

- **ALL / ALLEXCEPT / ALLSELECTED:** modificadores de filtro para CALCULATE que controlan qué filtros se eliminan. `ALL(tabla)` elimina todos los filtros de la tabla (útil para porcentajes del total). `ALLEXCEPT(tabla, col1, col2)` elimina todos los filtros EXCEPTO los de las columnas especificadas (útil para cálculos dentro de grupos). `ALLSELECTED(tabla)` elimina los filtros internos del visual pero mantiene los slicers externos (% del total del subconjunto visible).

- **FILTER:** función DAX que itera una tabla y retorna las filas que cumplen una condición. Retorna una tabla, por lo que se usa dentro de CALCULATE u otras funciones de tabla. A diferencia de los modificadores directos en CALCULATE (más eficientes), FILTER crea un contexto de fila sobre la tabla completa antes de aplicar el filtro, lo que puede ser lento en tablas grandes. Usar modificadores directos cuando sea posible: `CALCULATE([M], Tabla[Col]="X")` es más rápido que `CALCULATE([M], FILTER(Tabla, Tabla[Col]="X"))`.

- **RELATED / RELATEDTABLE:** funciones para navegar relaciones en DAX. `RELATED(Tabla[Columna])` trae un valor de una tabla relacionada hacia el lado "muchos" (en un contexto de fila de la tabla hijo, obtiene el valor del padre). `RELATEDTABLE(Tabla)` retorna todas las filas de la tabla relacionada (desde el lado "uno" hacia el "muchos"). Ejemplo: en una columna calculada de tabla Ventas, `RELATED(Productos[Categoria])` obtiene la categoría del producto de esa venta.

- **Funciones de tiempo (Time Intelligence):** familia de funciones DAX que manipulan períodos de tiempo basándose en la tabla de calendario. Requieren una tabla de fechas marcada como "Tabla de fechas". Las principales: `DATEADD` (desplaza N períodos: -1 mes, +1 año), `TOTALYTD` / `TOTALMTD` / `TOTALQTD` (acumulados año/mes/trimestre hasta la fecha), `SAMEPERIODLASTYEAR` (mismo período del año anterior), `DATESINPERIOD` (rango de fechas desde un punto por N períodos), `DATESBETWEEN` (rango absoluto entre dos fechas). Ejemplo: `TOTALYTD([Total Ventas], 'Calendar'[Date])` retorna la venta acumulada del año hasta la fecha del filtro actual.

- **RANKX:** función DAX que calcula el ranking dinámico de una expresión sobre una tabla. Sintaxis: `RANKX(tabla, expresión, valor, orden, vínculos)`. El parámetro de vínculos acepta DENSE (sin saltos en el ranking) o SKIP (salta posiciones cuando hay empates). Funciona con el contexto de filtro actual, por lo que si hay un filtro de región, el ranking es dentro de esa región. Ejemplo: `RANKX(ALL(Clientes), [Total Ventas],, DESC, DENSE)` rankea todos los clientes por ventas, ignorando filtros, de mayor a menor.

- **Row Level Security (RLS):** mecanismo de Power BI que filtra los datos que un usuario puede ver basándose en su identidad (USERPRINCIPALNAME()). Se define en Power BI Desktop creando roles con expresiones DAX en tablas del modelo. Al publicar en Power BI Service, se asignan usuarios o grupos de Azure AD a cada rol. Los filtros de RLS se propagan por las relaciones del modelo (si filtras Vendedores, automáticamente se filtran Ventas, Productos vendidos, etc.). Los administradores del workspace ven todos los datos salvo que sean añadidos explícitamente a un rol.

- **Tablas de calendario:** tabla de fechas que contiene una fila por cada día del período de análisis y columnas adicionales para análisis temporal (Año, Mes, Trimestre, Semana, día de semana, etc.). Es requerida para que funcionen las funciones de Time Intelligence. Debe ser marcada como "Tabla de fechas" en el modelo y tener una columna de tipo Date sin huecos. Puede crearse con DAX (`CALENDAR()` + `ADDCOLUMNS()`), con Power Query, o importarse desde una fuente externa. Recomendación: siempre crear una tabla de fechas personalizada y desactivar el AutoDate/Time de Power BI.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 12.1: Tabla de calendario con DAX
1. En Power BI Desktop → Modelado → Nueva tabla:
   ```dax
   Calendar = 
   ADDCOLUMNS(
       CALENDAR(DATE(2020,1,1), DATE(2030,12,31)),
       "Año", YEAR([Date]),
       "Mes Número", MONTH([Date]),
       "Mes Nombre", FORMAT([Date], "MMMM"),
       "Mes Corto", FORMAT([Date], "MMM"),
       "Trimestre", "Q" & QUARTER([Date]),
       "Semana", WEEKNUM([Date]),
       "Día Semana", WEEKDAY([Date], 2),
       "Día Nombre", FORMAT([Date], "dddd"),
       "Es Fin de Semana", IF(WEEKDAY([Date],2) >= 6, TRUE(), FALSE()),
       "Año-Mes", FORMAT([Date], "YYYY-MM"),
       "Año Trimestre", FORMAT([Date], "YYYY") & " Q" & QUARTER([Date])
   )
   ```

2. Marcar tabla como "Tabla de fechas" → columna Date
3. Crear relación: `Calendar[Date]` → `Ventas[FechaVenta]`

#### Actividad 12.2: Medidas con CALCULATE
```dax
// Medida base
Total Ventas = SUM(Ventas[Monto])

// Con CALCULATE modificando filtro de categoría
Ventas Electrónica = 
CALCULATE(
    [Total Ventas],
    Productos[Categoria] = "Electrónica"
)

// Porcentaje del total (ignorar filtro de categoría)
% del Total = 
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALL(Productos[Categoria])),
    0
)

// % del total de la categoría padre (contexto de tabla visual)
% del Total Categoría = 
DIVIDE(
    [Total Ventas],
    CALCULATE([Total Ventas], ALLSELECTED(Productos[Subcategoria])),
    0
)
```

#### Actividad 12.3: Inteligencia de tiempo
```dax
// Año hasta la fecha
Ventas YTD = TOTALYTD([Total Ventas], 'Calendar'[Date])

// Año anterior (mismo período)
Ventas Año Anterior = 
CALCULATE(
    [Total Ventas],
    SAMEPERIODLASTYEAR('Calendar'[Date])
)

// Crecimiento vs año anterior
YoY % = 
VAR VentasActual = [Total Ventas]
VAR VentasAnterior = [Ventas Año Anterior]
RETURN
DIVIDE(VentasActual - VentasAnterior, VentasAnterior, BLANK())

// Media móvil 3 meses
Media Movil 3M = 
CALCULATE(
    AVERAGE(Ventas[Monto]),
    DATESINPERIOD(
        'Calendar'[Date],
        LASTDATE('Calendar'[Date]),
        -3,
        MONTH
    )
)

// Acumulado mes a mes
Ventas MTD = TOTALMTD([Total Ventas], 'Calendar'[Date])

// Ventas últimos 12 meses rodantes
Ventas R12M = 
CALCULATE(
    [Total Ventas],
    DATESINPERIOD(
        'Calendar'[Date],
        LASTDATE('Calendar'[Date]),
        -12,
        MONTH
    )
)

// MoM (Month over Month) — crecimiento mes a mes
MoM % = 
VAR MesActual = [Total Ventas]
VAR MesAnterior = CALCULATE([Total Ventas], DATEADD('Calendar'[Date], -1, MONTH))
RETURN DIVIDE(MesActual - MesAnterior, MesAnterior, BLANK())
```

#### Actividad 12.4: Iteradores (AVERAGEX, SUMX)
```dax
// Ticket promedio por venta (patrón AVERAGEX sobre una tabla)
Ticket Promedio = 
AVERAGEX(
    Ventas,
    Ventas[Monto]
)

// Días promedio transcurridos desde inicio del año hasta cada venta
Antigüedad Promedio Días = 
AVERAGEX(
    Ventas,
    DATEDIFF(DATE(YEAR(Ventas[FechaVenta]), 1, 1), Ventas[FechaVenta], DAY)
)

// Total recalculado fila a fila (patrón SUMX — útil cuando el total depende de cálculo por fila)
Total Ventas SUMX = 
SUMX(Ventas, Ventas[Monto])
```
> **Nota:** AVERAGEX y SUMX iteran fila por fila (contexto de fila). Son más flexibles que AVERAGE/SUM pero más costosos en performance con tablas grandes. Úsalos cuando el cálculo por fila es distinto al valor almacenado (ej: precio × cantidad cuando el total no está pre-calculado en la tabla).

#### Actividad 12.5: RANKX y Top N dinámico
```dax
// Ranking de clientes por ventas
Ranking Cliente = 
RANKX(
    ALL(Clientes[NombreCliente]),
    [Total Ventas],
    ,
    DESC,
    DENSE
)

// Solo mostrar Top N (usar con slicer de parámetro)
Top N Clientes = 
VAR TopN = SELECTEDVALUE(Parametro[N], 10)
RETURN
IF([Ranking Cliente] <= TopN, [Total Ventas], BLANK())

// Ventas de Top 10 clientes como % del total
% Top 10 Clientes = 
VAR Top10 = 
    TOPN(10, ALL(Clientes[NombreCliente]), [Total Ventas], DESC)
RETURN
DIVIDE(
    CALCULATE([Total Ventas], Top10),
    CALCULATE([Total Ventas], ALL(Clientes)),
    0
)
```

#### Actividad 12.5: Row Level Security (RLS)
1. Power BI Desktop → Modelado → Administrar roles
2. Crear rol `Vendedor`:
   ```dax
   // En tabla Vendedores, filtrar por email del usuario actual
   [Email] = USERPRINCIPALNAME()
   ```

3. Crear rol `Gerente Regional`:
   ```dax
   // En tabla Regiones, filtrar por regiones que gestiona el gerente
   [GerencEmail] = USERPRINCIPALNAME()
   ```

4. Verificar: Modelado → Ver como → seleccionar rol → ingresar email de prueba
5. Al publicar en Power BI Service → Dataset → Seguridad → Asignar usuarios a roles

#### Actividad 12.6: Análisis de cohortes
```dax
// Fecha de primera compra por cliente
Primera Compra = 
CALCULATE(
    MIN(Ventas[FechaVenta]),
    ALLEXCEPT(Ventas, Ventas[ClienteID])
)

// Cohorte = mes de primera compra
Cohorte = 
FORMAT(
    CALCULATE(
        MIN(Ventas[FechaVenta]),
        ALLEXCEPT(Clientes, Clientes[ClienteID])
    ),
    "YYYY-MM"
)

// Retención: clientes que compraron en X meses después de su primera compra
Clientes Retenidos = 
COUNTROWS(
    FILTER(
        VALUES(Ventas[ClienteID]),
        NOT ISBLANK([Total Ventas])
    )
)
```

### 💼 Caso Real de Negocio
**Empresa:** Cadena de retail con 200 tiendas y 50 vendedores  
**Problema:** Gerentes veían ventas de todas las regiones; vendedores necesitaban ver solo sus clientes.  
**Solución:** RLS con 3 roles (Director ve todo, Gerente Regional ve su región, Vendedor ve solo sus clientes). DAX time intelligence para comparativos YoY. Media móvil 3 meses para suavizar estacionalidad en el dashboard ejecutivo.  
**Resultado:** Adopción de Power BI aumentó de 20% a 85% porque los vendedores confían en que los datos son "solo de ellos".

### ✅ Buenas Prácticas
- Siempre crear tabla de fechas manualmente (no usar AutoDate/Time de Power BI)
- Usar VAR para cálculos intermedios — mejora legibilidad y rendimiento
- DIVIDE() en lugar de `/` para manejar divisiones por cero
- Documentar medidas complejas con descripción en el panel de propiedades
- Centralizar medidas en tabla de medidas dedicada (sin datos)
- RLS se aplica al Dataset en Service, no en Desktop — recordar publicar y asignar

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| TOTALYTD retorna BLANK | No hay relación activa con tabla Calendar | Verificar y activar la relación |
| RLS no filtra correctamente | Rol aplicado a tabla incorrecta | RLS filtra en cascada vía relaciones — aplicar en la tabla que tiene la columna de usuario |
| CALCULATE con FILTER muy lento | FILTER itera la tabla completa | Usar modificadores de filtro directos en CALCULATE (ej: Tabla[Col]="valor") |
| SUM y SUMX dan resultados distintos | Confusión de contexto de fila | SUMX itera fila a fila; SUM agrega directamente la columna |

### 🧪 Criterios de Validación
- [ ] Tabla de calendario creada con DAX y marcada correctamente
- [ ] Medida YoY% calcula crecimiento correcto con períodos comparables
- [ ] Media móvil 3 meses se actualiza dinámicamente con el filtro de fecha
- [ ] RLS funciona: vendedor ve solo sus datos, gerente ve su región
- [ ] RANKX muestra Top 10 clientes dinámicamente con slicer de parámetro
- [ ] % del total usa ALL/ALLSELECTED correctamente según el nivel de jerarquía

---
