---
id: lab-124
title: "Power BI — Storytelling: drillthrough, tooltips, marcadores, navegación y personalización (Ruta Pro Power BI)"
level: "N2"
duration: 170
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 123 completado — páginas Resumen comercial y Mensual con el tema de SIT"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 124 — Power BI: storytelling y navegación

## Objetivo

Que el reporte guíe a quien lo usa: del resumen al detalle de un vendedor con **drillthrough**, información extra al pasar el puntero con un **tooltip de página**, dos vistas de la misma página con **marcadores** y el panel **Selection**, un menú con **Page navigator**, un slicer de año que se mantiene entre páginas con **Sync slicers** y visuales que cada lector puede adaptar con **Personalize visuals**. Cubre "Enhance reports for usability and storytelling" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 123.

**Problema a resolver:** en la reunión del comité, cada vez que alguien pregunta "¿y qué vende Camila?" o "¿quién vende en Andina?", el analista abre otra pestaña, filtra a mano y el comité pierde el hilo. El director comercial quiere que el reporte responda esas preguntas con un clic, que el año elegido no se pierda al cambiar de página y que cada gerente pueda cambiar un gráfico sin pedírselo al analista.

## Lo que vas a construir

- La página `Detalle vendedor`, a la que se llega con clic derecho desde cualquier visual con vendedores
- La página `Tip región`, que aparece como tooltip al pasar el puntero sobre una región
- Dos marcadores (`Vista gráfico` y `Vista tabla`) y dos botones para cambiar entre ellos
- Un **Page navigator** en la parte superior de las páginas principales
- El slicer de año sincronizado entre `Resumen comercial` y `Mensual`
- **Personalize visuals** activado en el gráfico de barras

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Lab 123: `Resumen comercial`, `Mensual` y el tema de SIT | Drillthrough, tooltips de página, marcadores, navegación, sincronización, personalización | Lab 125 analiza los datos desde estas páginas; Lab 126 publica el reporte |

> **Fuente del esqueleto:** los labs de diseño avanzado del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y las páginas de Learn citadas. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Drillthrough al detalle del vendedor | 35 min |
| Ejercicio 2 — Un tooltip de página | 30 min |
| Ejercicio 3 — Dos vistas con marcadores | 40 min |
| Ejercicio 4 — Navegación entre páginas | 25 min |
| Ejercicio 5 — Un año para las páginas principales | 25 min |
| Ejercicio 6 — Visuales que el lector adapta | 15 min |
| **Total** | **unas 2 h 50 min** |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: **Drillthrough**, **Canvas settings** > **Tooltip**, **Page information**, **Bookmarks**, **Selection**, **Insert** > **Buttons** (**Blank**, **Navigator** > **Page navigator**), **Sync slicers**, **Personalize visuals**

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 123, con `Resumen comercial` y `Mensual`

### Conocimiento previo

- Lab 123: formato de visuales y panel **Selection** (pestaña **Tab order**)
- Lab 120: medidas `Ticket Promedio` y `Clientes Activos`

> **En Power BI Desktop, los botones se prueban con Ctrl + clic.** Mientras editas, un clic normal selecciona el botón para formatearlo; **Ctrl** + clic ejecuta su acción ([Learn: botones](https://learn.microsoft.com/power-bi/create-reports/desktop-buttons)).

---

## Ejercicio 1 — Drillthrough al detalle del vendedor

**Objetivo:** que desde cualquier visual con vendedores se llegue, con clic derecho, a una página dedicada a ese vendedor ([Learn: drillthrough](https://learn.microsoft.com/power-bi/create-reports/desktop-drillthrough)).

1. Crea una página nueva y renómbrala `Detalle vendedor` (clic derecho en su pestaña > **Rename Page**).
2. Con la página vacía y **ningún visual seleccionado**, en el panel **Visualizations** (vista de construcción del visual), sección **Drillthrough**, arrastra `Vendedores[Vendedor]` al pozo **Drillthrough filters**. Power BI añade automáticamente un botón **Back** arriba a la izquierda. En esa misma sección suele aparecer un interruptor para conservar todos los filtros (en inglés, *Keep all filters*; Learn no lo documenta, así que su nombre puede variar). Activado, el drillthrough lleva **todos** los filtros del visual de origen (también el año del slicer), no solo el vendedor. Comprueba que está activado.
3. Añade a la página:
   - un **Table** con `Ventas Totales`, `Ticket Promedio` y `Clientes Activos` (los valores exactos, para comprobarlos);
   - una **Matrix** con `Productos[Categoria]` en **Rows** y `Ventas Totales` en **Values**;
   - un **Text box** con el título "Detalle del vendedor" y, si quieres, una tarjeta con la medida `Vendedor Elegido = SELECTEDVALUE ( Vendedores[Vendedor] )` para ver a quién estás mirando (con **discourage implicit measures**, activo desde el Lab 121, no puedes poner la columna directamente).
4. Ve a `Resumen comercial` (año **2025** en el slicer). En la matriz de vendedores, clic derecho sobre **Camila Restrepo** > **Drillthrough** > **Detalle vendedor**.

### Resultado esperado del Ejercicio 1 (Camila Restrepo, 2025)

| Medida o categoría | Valor |
|---|---|
| `Ventas Totales` | **4.303.248,20** |
| `Ticket Promedio` | 27.409,22 |
| `Clientes Activos` | 27 |
| Licencias | 2.761.753,20 |
| Servicios | 1.323.722,50 |
| Capacitación | 217.772,50 |

> **Si sale el total de los tres años** (10.874.772,50 para Camila): el año no llegó con el drillthrough. Revisa que el interruptor de conservar todos los filtros esté activado y mira en el panel **Filters** de `Detalle vendedor` qué filtros llegaron.

5. Vuelve con el botón **Back** (Ctrl + clic). Prueba también desde la matriz de cumplimiento del Lab 119 (página `Modelo`): el drillthrough funciona desde **cualquier** visual que tenga `Vendedores[Vendedor]`. Learn lo exige: el campo debe estar en el visual de origen y en el pozo de drillthrough.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| `Ventas Totales` de Camila Restrepo en 2025 | ___ |
| Desde qué otro visual llegaste a la página | ___ |

---

## Ejercicio 2 — Un tooltip de página

**Objetivo:** mostrar, al pasar el puntero sobre una región, qué vendedores la forman ([Learn: tooltips de página](https://learn.microsoft.com/power-bi/create-reports/desktop-tooltips)).

1. Crea una página nueva. En el panel **Format** (con la página seleccionada, sin ningún visual):
   - tarjeta **Page information**: **Name** `Tip región` y activa el control **Tooltip** (en algunas versiones se llama de otra forma, por ejemplo "Allow use as tooltip");
   - tarjeta **Canvas settings**: en el tipo de página, **Tooltip** (una página pequeña).
2. Para ver la página a su tamaño real: cinta **View** > **Page view** > **Actual size**.
3. Añade un **Table** con `Vendedores[Vendedor]` y `Ventas Totales`. (El pozo **Tooltip fields** de la página sirve para que Power BI use el tooltip **automáticamente** en los visuales con esos campos; aquí lo asignarás a mano, así que no es necesario.)
4. Ve a `Mensual` y añade un **Clustered bar chart** con `Regiones[Region]` y `Ventas Totales` (no sustituyas el de categorías de `Resumen comercial`: lo usarás en el Ejercicio 6). Selecciónalo y en **Format** > tarjeta **Tooltips**, elige en **Page** la página `Tip región`.
5. Pasa el puntero sobre la barra **Andina** (año 2025).

### Resultado esperado del Ejercicio 2 (Andina, 2025)

| Vendedor | Ventas Totales |
|---|---|
| Andrés Rojas | 1.338.936,20 |
| Laura Gómez | 940.798,70 |
| **Total** | **2.279.734,90** |

Las demás regiones tienen un solo ejecutivo cada una: Andina es la única con dos, por eso es la que vale la pena mirar.

> Learn indica que en la vista móvil los tooltips están desactivados (Lab 123). Si el dato del tooltip es imprescindible, ponlo también en una página o en la página de detalle.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Vendedores y ventas que muestra el tooltip de Andina | ___ |

---

## Ejercicio 3 — Dos vistas con marcadores

**Objetivo:** que el comité pueda ver la evolución mensual como gráfico o como tabla en el mismo espacio, con dos botones ([Learn: marcadores](https://learn.microsoft.com/power-bi/create-reports/desktop-bookmarks)).

### Tarea 3.1 — Dos visuales en el mismo sitio

1. En `Mensual`, junto a la matriz del Lab 123, añade un **Line chart** con `Fecha[Mes]` y `Ventas Totales`. Ponlo encima de la matriz, con el mismo tamaño y posición: copia los valores de **Format** > **General** > **Properties** (tamaño y posición) de la matriz al gráfico.
2. Cinta **View** > **Selection**. En el panel **Selection** (la vista de capas, no la de **Tab order**), renombra los dos visuales con doble clic: `Gráfico mensual` y `Tabla mensual`.

### Tarea 3.2 — Dos marcadores

1. Cinta **View** > **Bookmarks**.
2. En el panel **Selection**, oculta `Tabla mensual` (icono del ojo) y deja visible `Gráfico mensual`. En **Bookmarks**, **Add** y renombra el marcador a `Vista gráfico` (**…** > **Rename**).
3. Ahora muestra `Tabla mensual` y oculta `Gráfico mensual`. **Add** → `Vista tabla`.
4. En cada marcador, abre **…** y **desmarca Data**; deja **Display** y **Current page** marcados. Así el marcador cambia **qué se ve**, pero no el año del slicer: si el comité elige 2024 y pulsa "Vista tabla", sigue viendo 2024.
5. Además, en cada marcador elige **Selected visuals** en lugar de **All visuals**, con los dos visuales seleccionados al crearlo (o al actualizarlo): así el marcador solo controla esos dos y no los visuales que añadirás después en `Mensual` (navegador, slicer). Si ya lo creaste con **All visuals**, selecciona los dos visuales, ajusta la opción y usa **Update**.
6. Learn advierte que si cambias la visibilidad después de crear un marcador, el cambio se pierde salvo que lo guardes con **…** > **Update**.

### Tarea 3.3 — Dos botones

1. Cinta **Insert** > **Buttons** > **Blank**. Un botón en blanco no trae texto: en su formato, activa el texto del botón (sección de estilo) y escribe `Gráfico`.
2. En el panel de formato del botón, activa **Action**, expándelo y elige **Type** > **Bookmark**, y en **Bookmark**, `Vista gráfico`.
3. Repite con otro botón `Tabla` → `Vista tabla`.
4. Prueba con **Ctrl** + clic en cada botón y cambia el año del slicer entre clics.

> **Alternativa sin botones sueltos:** **Insert** > **Buttons** > **Navigator** > **Bookmark navigator** crea un botón por marcador automáticamente. Con dos marcadores, los dos botones a mano te enseñan cómo funciona; con diez, el navegador ahorra trabajo.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| ¿Cambia el año al pulsar un botón? (debe ser que no) | ___ |
| Qué casilla del marcador lo controla | ___ |

---

## Ejercicio 4 — Navegación entre páginas

**Objetivo:** un menú que lleve a las páginas principales sin buscar las pestañas.

1. En `Resumen comercial`, cinta **Insert** > **Buttons** > **Navigator** > **Page navigator** ([Learn: navegadores](https://learn.microsoft.com/power-bi/create-reports/button-navigators)). Aparece un botón por página.
2. El menú debe mostrar **solo `Resumen comercial` y `Mensual`**:
   - `Detalle vendedor` y `Tip región` no se visitan navegando, sino con drillthrough o al pasar el puntero. Ocúltalas desde el menú contextual de su pestaña (la opción de ocultar la página). En Desktop siguen viéndose como pestañas, con un icono; en el servicio no aparecen. El navegador no muestra por defecto las páginas ocultas ni las de tooltip.
   - Las páginas de trabajo de los labs anteriores (`Modelo`, `DAX`, `Contexto`, `Tiempo`) sí aparecerían. En el formato del navegador, pestaña **Pages**, desactiva cada una.
3. Ajusta el diseño en **Grid layout** (**Horizontal**) y el aspecto de la página actual en el estado **Selected** (en el formato del estilo, aplicando los ajustes a ese estado; Learn lo llama **Selected state**), con el color 1 del tema.
4. Copia el navegador (Ctrl + C) y pégalo en `Mensual` (Ctrl + V): queda en la misma posición.
5. Prueba con **Ctrl** + clic.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Páginas que muestra el navegador | ___ (esperado: `Resumen comercial` y `Mensual`) |

---

## Ejercicio 5 — Un año para las páginas principales

**Objetivo:** que al elegir 2024 en `Resumen comercial`, `Mensual` también muestre 2024. (`Detalle vendedor` ya recibe el año con el drillthrough, Ejercicio 1, y `Tip región` toma el contexto del punto sobre el que pasas el puntero.)

1. **Primero**, borra el slicer de año de `Mensual` (el que copiaste en el Lab 123): al marcar **Visible**, Power BI pondrá ahí una copia del sincronizado y quedarían dos encimados.
2. Selecciona el slicer de año de `Resumen comercial`. Cinta **View** > **Sync slicers**: el panel aparece junto a **Filters** y **Visualizations** ([Learn: slicers](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-slicers)).
3. El panel tiene una fila por página y dos columnas: **Sync** (el filtro se aplica en esa página) y **Visible** (el slicer se ve en esa página). Marca **Sync** y **Visible** solo en `Resumen comercial` y `Mensual`; deja sin marcar el resto (`Modelo`, `DAX`, `Contexto`, `Tiempo`, `Detalle vendedor`, `Tip región`).
4. Elige **2024** en `Resumen comercial`, ve a `Mensual` (con el navegador) y comprueba que muestra 2024. Vuelve a `Resumen comercial` y haz drillthrough de Camila Restrepo: el año llega con el drillthrough.

> **Por qué no sincronizar `Detalle vendedor`:** si lo hicieras, el slicer oculto de esa página se combinaría con el año que llega por el drillthrough. Desde `Modelo` (que tiene su propio slicer, en 2025) con 2024 elegido en el resumen, los dos filtros chocarían y la página podría quedar vacía. El año de la página de detalle es el del visual de origen: avísalo en el título ("Detalle del vendedor — año del visual de origen").

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| `Ventas Totales` y `Ticket Promedio` de Camila en 2024 en `Detalle vendedor` | ___ (esperado: **3.477.516,50** y 27.382,02; `Clientes Activos` sigue en 27, así que no sirve para ver que cambió el año) |

---

## Ejercicio 6 — Visuales que el lector adapta

**Objetivo:** que un gerente pueda cambiar el tipo de gráfico o el campo de un visual sin editar el reporte ([Learn: personalize visuals](https://learn.microsoft.com/power-bi/create-reports/power-bi-personalize-visuals)).

1. **File** > **Options and settings** > **Options** > **Current file** > **Report settings** > marca **Personalize visuals**.
2. Learn permite activarlo o desactivarlo por página (con la página seleccionada, **Format** > **Personalize visual**) y por visual (**Format** > **General** > **Header icons** > **Icons** > **Personalize visual**). Desactívalo en `Detalle vendedor` y déjalo en el gráfico de barras de categorías de `Resumen comercial`. (Las páginas de tooltip no muestran encabezado de visual, así que ahí no hace falta.)
3. La personalización es una experiencia de **lectura**: el icono para personalizar aparece al pasar el puntero sobre el visual en el reporte publicado. Si en la vista de edición de Desktop no lo ves, déjalo configurado y pruébalo en el Lab 126, tras publicar: cambia el tipo de visual a columnas o el eje a `Regiones[Pais]`, y guarda tu versión como marcador personal sin tocar el reporte original.

> **Límites que da Learn:** no funciona con *Publish to web*, y al exportar a PowerPoint o PDF no se incluyen los visuales personalizados.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| No aparece **Drillthrough** al hacer clic derecho | El visual de origen no tiene `Vendedores[Vendedor]` | El campo debe estar en el visual y en el pozo de drillthrough |
| `Detalle vendedor` muestra el total de los tres años | El interruptor de conservar todos los filtros está desactivado y solo llega el vendedor | Actívalo en la sección **Drillthrough** de la página |
| `Detalle vendedor` sale vacía | Se sincronizó el slicer de año en esa página y choca con el año que llega por el drillthrough | Quita **Sync** en `Detalle vendedor` |
| El tooltip muestra el visual estándar, no la página | El visual no tiene la página asignada | **Format** > **Tooltips** > **Page** > `Tip región` |
| El marcador cambia también el año | El marcador guarda **Data** | Desmarca **Data** en el marcador |
| Al pulsar un botón se selecciona en vez de ejecutarse | En Desktop hace falta **Ctrl** | **Ctrl** + clic |
| Un visual oculto vuelve a aparecer al usar un marcador | Se cambió la visibilidad sin actualizar el marcador | **…** > **Update** en el marcador |
| Un marcador oculta el navegador o el slicer de `Mensual` | El marcador usa **All visuals** y se creó antes de añadirlos | **Selected visuals** con los dos visuales, y **Update** |

## 🔧 Diagnóstico y reparación

### "Hice clic en Camila y veo los números de otro vendedor"

1. Mira el panel **Filters** de `Detalle vendedor`: ¿qué filtro de `Vendedor` llegó?
2. ¿Hay otro filtro en la página (por ejemplo, uno que pusiste al construirla)? Quítalo: la página de detalle solo debe filtrarse por el drillthrough y el slicer sincronizado.

## Checklist final

- [ ] Drillthrough de Camila Restrepo en 2025: 4.303.248,20 y Licencias 2.761.753,20
- [ ] Tooltip de Andina con Andrés Rojas (1.338.936,20) y Laura Gómez (940.798,70)
- [ ] Marcadores `Vista gráfico` y `Vista tabla` sin **Data**, con sus dos botones
- [ ] **Page navigator** sin las páginas de detalle y tooltip
- [ ] Slicer de año sincronizado entre `Resumen comercial` y `Mensual`; Camila en 2024 = 3.477.516,50 por drillthrough
- [ ] **Personalize visuals** activo en el gráfico de barras de categorías (se prueba al publicar, Lab 126)

## Evidencia esperada

- Captura de `Detalle vendedor` de Camila Restrepo en 2025
- Captura del tooltip de Andina
- Captura del panel **Sync slicers** con tu configuración
- Una explicación de dos líneas de por qué desmarcaste **Data** en los marcadores

## Criterios de aprobación

- El lector llega al detalle y vuelve sin perder el contexto (año, filtros)
- Los marcadores cambian la vista sin cambiar los datos
- La navegación muestra solo las páginas a las que se llega navegando
- El reporte se puede recorrer sin abrir el panel de filtros

## Competencias desarrolladas

- Configurar drillthrough y tooltips de página
- Usar marcadores, el panel Selection y botones para contar una historia
- Crear navegación con page navigator y sincronizar slicers
- Habilitar la personalización de visuales para los lectores

## Reto adicional

**Reto básico:** añade a `Detalle vendedor` un gráfico de líneas con las ventas mensuales del vendedor elegido. ¿En qué mes de 2025 vendió más Camila Restrepo?

**Reto intermedio:** crea un drillthrough por `Productos[Categoria]` a una página `Detalle categoría` con los productos y sus ventas. ¿Funciona también desde el gráfico de barras de `Resumen comercial`?

**Reto avanzado:** crea un tercer marcador `Foco en el objetivo` que, además de mostrar la tabla, filtre la matriz de vendedores a quienes están por debajo del 100 % (este sí con **Data** marcado). Explica en dos líneas por qué este marcador sí debe guardar los datos y los otros no.

## Preguntas de repaso

1. ¿Qué condición debe cumplir un visual para que aparezca la opción de drillthrough a una página?
2. ¿Qué diferencia hay entre las columnas **Sync** y **Visible** del panel de sincronización?
3. ¿Qué pasa si un marcador guarda **Data** y el usuario ya había elegido otro año?
4. ¿Por qué no deben aparecer en el navegador las páginas de detalle y de tooltip?

## Limpieza del laboratorio

Conserva todas las páginas: el Lab 125 analiza los datos desde ellas.

## Siguiente laboratorio recomendado

**[Lab 125 — Análisis](/labs/lab-125-power-bi-analisis-patrones-ia)**: explicar un aumento, agrupar, clasificar, árbol de descomposición, influenciadores clave, pronóstico y anomalías.
