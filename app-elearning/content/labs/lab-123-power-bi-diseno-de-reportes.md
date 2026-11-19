---
id: lab-123
title: "Power BI — Diseño de reportes: temas, formato condicional, visual calculations, accesibilidad y móvil (Ruta Pro Power BI)"
level: "N2"
duration: 180
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 122 completado — ruta-pro-sit-ventas.pbix optimizado, con las medidas de los Labs 119 a 121"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 123 — Power BI: diseño de reportes

## Objetivo

Convertir un modelo correcto en un reporte que se entienda en diez segundos: una página pensada antes de construirla, un tema propio, formato condicional que señala lo que importa, **visual calculations** para cálculos que solo viven en un visual, un reporte accesible (texto alternativo, orden de tabulación, contraste, marcadores) y su versión para móvil. Cubre "Create reports" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 122.

**Problema a resolver:** el comité comercial se reúne el primer lunes de cada mes y tiene diez minutos para el reporte. Hoy recibe páginas con quince visuales del mismo color y tiene que buscar a mano quién está por debajo del objetivo. Además, un miembro del comité usa lector de pantalla y el gerente de México revisa el reporte desde el teléfono, de camino a las visitas.

## Lo que vas a construir

- Un boceto en papel de la página `Resumen comercial`, con la pregunta que responde cada visual
- Un tema de SIT (colores y texto) aplicado a todo el reporte y descargado como archivo
- La página `Resumen comercial` con formato condicional por reglas, barras de datos e iconos
- Dos visual calculations: el acumulado del año y la variación frente al mes anterior
- Texto alternativo, orden de tabulación y marcadores en los gráficos de líneas
- La vista móvil de la página

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Labs 119-122: modelo, medidas, grupo de cálculo y modelo optimizado | Diseño visual, formato condicional, visual calculations, accesibilidad, móvil | Lab 124 añade navegación e historia a estas páginas; Lab 126 las publica |

> **Fuente del esqueleto:** el lab de diseño de reportes del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y las páginas de Learn citadas. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Diseñar la página antes de construirla | 20 min |
| Ejercicio 2 — Un tema para SIT | 25 min |
| Ejercicio 3 — La página `Resumen comercial` y su formato condicional | 45 min |
| Ejercicio 4 — Visual calculations | 35 min |
| Ejercicio 5 — Accesibilidad | 30 min |
| Ejercicio 6 — La vista móvil | 25 min |
| **Total** | **unas 3 h** (mejor en dos sesiones: Ejercicios 1 a 3 y 4 a 6) |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: cinta **Design** (temas), formato condicional, **New visual calculation** (`RUNNINGSUM`, `PREVIOUS`), panel **Selection**, **Mobile layout**

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 122
- [ ] **Guarda una copia** antes de empezar (`ruta-pro-sit-ventas-antes-diseno.pbix`). Hazlo copiando el archivo en el Explorador de Windows, o con **File** > **Save as** y volviendo a abrir `ruta-pro-sit-ventas.pbix`: después de **Save as**, Power BI Desktop sigue trabajando sobre la copia.

### Conocimiento previo

- Labs 119 a 121: las medidas `Ventas Totales`, `Objetivo Total`, `% Cumplimiento`, `Ticket Promedio`, `Clientes Activos`
- Lab 116: visuales básicos de Power BI (tarjetas, matriz, gráficos de barras y líneas)

---

## Ejercicio 1 — Diseñar la página antes de construirla

**Objetivo:** decidir qué pregunta responde cada visual antes de arrastrar nada.

El comité hace siempre las mismas cuatro preguntas. Dibuja en papel (o en una diapositiva) una página de 16:9 con un visual por pregunta:

| # | Pregunta del comité | Visual que propones | Dónde va en la página |
|---|---|---|---|
| 1 | ¿Cuánto vendimos este año y cómo vamos contra el objetivo? | ___ | ___ |
| 2 | ¿Quién está por debajo del objetivo? | ___ | ___ |
| 3 | ¿Cómo evolucionan las ventas mes a mes? | ___ | ___ |
| 4 | ¿Qué pesa cada categoría? | ___ | ___ |

**Respuesta orientativa** (léela después): (1) dos o tres valores grandes arriba a la izquierda, donde empieza la lectura; (2) una matriz por vendedor con el cumplimiento resaltado; (3) un gráfico de líneas o columnas por mes; (4) un gráfico de barras por categoría (los gráficos circulares con más de tres o cuatro porciones se leen mal). Un slicer de año, discreto, arriba a la derecha. **Cuatro preguntas, cuatro visuales y un slicer**: la [guía de optimización de Learn](https://learn.microsoft.com/power-bi/guidance/power-bi-optimization) recomienda además limitar los visuales por página, y el comité solo tiene diez minutos.

> **La regla de este lab:** si no sabes qué pregunta responde un visual, no lo pongas.

---

## Ejercicio 2 — Un tema para SIT

**Objetivo:** que todos los visuales tengan los colores y el texto de la empresa sin formatearlos uno a uno.

1. Cinta **Design** > galería **Themes**. Prueba dos temas integrados (por ejemplo **Innovate** y **Tidal**) y mira cómo cambian todas las páginas a la vez ([Learn: report themes](https://learn.microsoft.com/power-bi/create-reports/desktop-report-themes)).
2. Vuelve al tema por defecto y selecciona **Customize theme**: se abre el panel del tema.
3. En los colores, define la paleta de SIT: color 1 `#0F4C81` (azul SIT), color 2 `#F28C28` (naranja), color 3 `#5B8C5A` (verde) y color 4 `#8E8E8E` (gris). En el texto, una fuente sin serifa (por ejemplo **Segoe UI**) para todo el reporte.
4. Aplica los cambios. En las páginas de los labs anteriores (casi todo matrices) apenas se notará; lo verás en los gráficos del Ejercicio 3.
5. **Download theme**: guarda el archivo `tema-sit.json`. Así otro analista puede aplicar el mismo tema con **Import theme** en su reporte.

> **Por qué un tema y no formato a mano:** un tema es un archivo JSON con colores, fuentes y formato por defecto de los visuales. Formatear cada visual a mano funciona hasta que hay que cambiar un color en treinta visuales. Y el formato que pongas a mano en un visual tiene prioridad sobre el tema: úsalo solo para excepciones.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Tamaño del archivo `tema-sit.json` y las primeras líneas que ves al abrirlo en un editor de texto | ___ |

---

## Ejercicio 3 — La página `Resumen comercial` y su formato condicional

**Objetivo:** construir la página del boceto y hacer que lo importante se vea sin buscarlo.

### Tarea 3.1 — Los visuales

1. Página nueva `Resumen comercial`. Slicer de `Fecha[Año]` (lista vertical, **2025**) arriba a la derecha.
2. Arriba a la izquierda, una **Card** por cada medida: `Ventas Totales`, `Objetivo Total` y `% Cumplimiento`. En esta página las tarjetas pueden abreviar ("20,84M"): es un reporte para leer, no para comprobar decimales.
3. Debajo, una **Matrix** con `Vendedores[Vendedor]` en **Rows** y `Ventas Totales`, `Objetivo Total` y `% Cumplimiento` en **Values** (como en el Lab 119).
4. A la derecha de la matriz, un **Line chart** con `Fecha[Mes]` en el eje y `Ventas Totales` en los valores.
5. Abajo, un **Clustered bar chart** con `Productos[Categoria]` y `Ventas Totales`.

### Tarea 3.2 — Reglas: quién está por debajo del objetivo

1. En la matriz, abre el menú del campo `% Cumplimiento` en **Values** (flecha o clic derecho) > **Conditional formatting** > **Background color** ([Learn: conditional formatting](https://learn.microsoft.com/power-bi/create-reports/desktop-conditional-table-formatting)).
2. **Format style**: **Rules**. Crea dos reglas. Cada regla tiene un desplegable de tipo junto a cada límite y vienen en **Percent**: cámbialos a **Number** (los cuatro), porque la medida devuelve una fracción (0,6297 es 62,97 %):
   - Si el valor es mayor o igual que `0` y menor que `1` → un rojo claro.
   - Si el valor es mayor o igual que `1` y menor o igual que `10` → un verde claro.
3. **OK**.

### Resultado esperado de la Tarea 3.2 (2025)

Dos filas en rojo: **Laura Gómez (62,97 %)** y **Valeria Quispe (93,49 %)**. Las otras seis, en verde. El total (104,81 %) queda sin color salvo que en el diálogo cambies el alcance (**Apply to**) para incluir los totales; para el comité, basta con las filas.

> **Por qué `Number` y no `Percent`:** en las reglas, **Percent** no lee el valor de la medida como porcentaje, sino como posición dentro del rango de valores del visual (0 % el mínimo, 100 % el máximo). Con **Percent**, los límites 0 y 1 no significan lo que crees. Comprueba siempre el resultado contra la tabla del Lab 119.

### Tarea 3.3 — Barras de datos e iconos

1. En la misma matriz, `Ventas Totales` > **Conditional formatting** > **Data bars**. Deja **Show bar only** sin marcar, para ver el número y la barra.
2. `Objetivo Total` no necesita formato: si todo resalta, nada resalta.
3. **Icons** en `% Cumplimiento`, como alternativa al color (lo usarás en el Ejercicio 5). Los iconos traen tramos por defecto en **Percent** (posición en el rango): con ellos, Tomás Fuentes (103,67 %) recibe el mismo icono que Valeria Quispe (93,49 %). Usa **Rules** con **Number** y los mismos límites de la Tarea 3.2 (de 0 a 1 y desde 1).

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Vendedores en rojo en 2025 | ___ |
| Qué cambia en las reglas si eliges **Percent** en lugar de **Number** | ___ (esperado: solo Laura queda en rojo, porque es el mínimo del rango, y las demás filas quedan sin color: sus posiciones no caen en 0-1 ni en 1-10) |
| Vendedores en rojo si cambias el slicer a 2026 | ___ |

**Sobre 2026** (léelo después): salen en rojo **siete de ocho**; solo Mariana Torres (104,71 %) supera el objetivo. No es que el año vaya mal: las ventas llegan hasta octubre y el objetivo es del año completo, la misma trampa del año incompleto del Lab 121. Un título como "Cumplimiento 2026 (enero a octubre, contra objetivo anual)" evita la mala lectura. Otra opción: un filtro de página con `Fecha[Con ventas]` = verdadero (Lab 121) compara las ventas con el objetivo de enero a octubre. **Vuelve a 2025** antes de seguir: el resto del lab usa ese año.

---

## Ejercicio 4 — Visual calculations

**Objetivo:** hacer cálculos que solo existen en un visual (acumulados, comparaciones con la fila anterior) sin crear medidas en el modelo.

**El concepto:** una *visual calculation* es una fórmula DAX que se calcula sobre los datos **que ya están en el visual**, no sobre el modelo. Por eso es más sencilla: no hace falta `CALCULATE` ni inteligencia de tiempo para un acumulado o para "frente a la fila anterior" ([Learn: visual calculations](https://learn.microsoft.com/power-bi/transform-model/desktop-visual-calculations-overview)).

1. Página nueva `Mensual`. Copia el slicer de año de `Resumen comercial` (Ctrl + C, Ctrl + V; si Power BI pregunta si sincronizarlo, cualquiera de las dos respuestas sirve) y deja **2025**. Sin el slicer, cada mes sumaría los tres años. Una **Matrix** con `Fecha[Mes]` en **Rows** y `Ventas Totales` en **Values**.
2. Selecciona la matriz y, en la cinta **Home**, **New visual calculation**. Se abre el modo **Edit**, con una barra de fórmulas, la vista previa del visual y debajo la matriz de datos del visual ([Learn: create visual calculations](https://learn.microsoft.com/power-bi/transform-model/desktop-visual-calculations-create)).
3. Escribe:

```dax
Acumulado = RUNNINGSUM ( [Ventas Totales] )   // suma la fila actual y todas las anteriores del visual
```

4. Sin salir del modo **Edit**, crea otra con el botón de plantillas (fuera del modo **Edit**, es la parte inferior del botón **New visual calculation**): elige **Versus previous**. La plantilla trae marcadores de campo; sustitúyelos por `[Ventas Totales]` para que quede así:

```dax
Vs Mes Anterior = [Ventas Totales] - PREVIOUS ( [Ventas Totales] )   // diferencia con la fila anterior del visual
```

5. **Back to report**.

### Resultado esperado del Ejercicio 4 (2025)

| Mes | Ventas Totales | Acumulado | Vs Mes Anterior |
|---|---|---|---|
| Enero (`Jan` o `ene`, según tu configuración) | 1.113.973,70 | 1.113.973,70 | 1.113.973,70 |
| Marzo | 2.039.623,10 | 4.966.869,20 | 226.350,70 |
| Octubre | 1.970.597,00 | **16.568.491,50** | 303,10 |
| Noviembre | 2.399.347,80 | 18.967.839,30 | 428.750,80 |
| Diciembre | 1.873.122,60 | **20.840.961,90** | **−526.225,20** |

El acumulado de octubre (**16.568.491,50**) es el mismo `Ventas YTD` del Lab 121, calculado sin `TOTALYTD`. En la fila **Total** de la matriz, `Acumulado` y `Vs Mes Anterior` valen las dos 20.840.961,90 (en el total no hay fila anterior): desactiva los totales de la matriz o explícalo en el título. Si las visual calculations salen sin separador de miles, dales formato en el modo **Edit**.

> **¿Por qué enero no sale vacío en `Vs Mes Anterior`?** En la primera fila no hay fila anterior y `PREVIOUS` devuelve vacío; en DAX, restar un vacío es restar cero, así que enero muestra sus propias ventas. Es un dato engañoso: el reto básico te pide corregirlo.

> **¿Qué orden sigue el acumulado?** Learn indica que, si no se da un orden, `RUNNINGSUM` ordena por las columnas del eje en orden ascendente: aquí, por `Mes`, que a su vez se ordena por `MesNum`. Por eso, si ordenas la matriz por `Ventas Totales`, las filas cambian de sitio pero el acumulado **no cambia**. Lo que sí lo rompe es quitar el **Sort by Column** de `Mes` (el orden pasa a ser alfabético: abr, ago, dic…) o poner otro campo en **Rows**. Con `Ventas YTD` (Lab 121) nada de eso importa: depende de las fechas. **Cuándo usar cada uno:** visual calculation para un cálculo de un solo visual que nadie más necesita; medida del modelo para lo que se reutiliza, se compara entre reportes o lo consulta otra herramienta.

6. Si no quieres mostrar `Ventas Totales` y solo el acumulado, Learn permite ocultar un campo del visual con el icono de ocultar que aparece junto a él en el modo **Edit**: sigue disponible para el cálculo.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| `Acumulado` de octubre 2025 | ___ |
| `Vs Mes Anterior` de diciembre 2025 | ___ |
| Qué le pasa a `Acumulado` si ordenas por ventas, y por qué | ___ |

---

## Ejercicio 5 — Accesibilidad

**Objetivo:** que el reporte se pueda usar con lector de pantalla, solo con teclado y sin distinguir colores ([Learn: crear reportes accesibles](https://learn.microsoft.com/power-bi/create-reports/desktop-accessibility-creating-reports)).

### Tarea 5.1 — Texto alternativo

1. Selecciona el gráfico de líneas de `Resumen comercial`. Panel **Visualizations** > **Format** > **General** > al final, **Alt Text**.
2. Escribe lo que el gráfico **dice**, no lo que **es**: no "gráfico de líneas de ventas", sino "Ventas mensuales de 2025: pico en noviembre con 2,4 millones; mínimo en enero con 1,1 millones". Learn limita el texto a 250 caracteres.
3. Haz lo mismo con la matriz y el gráfico de barras.

### Tarea 5.2 — Orden de tabulación

1. Cinta **View** > **Selection**. En el panel **Selection**, pestaña **Tab order**.
2. Ordena los visuales como se leen: slicer, tarjetas, matriz, línea, barras. Quita del orden de tabulación los elementos decorativos (formas, imágenes de fondo): Learn indica que basta con seleccionar el número junto al objeto.
3. Prueba: haz clic en un espacio vacío del lienzo y recorre la página con **Tab**. Si el foco no entra en el lienzo, prueba **Ctrl + F6** para moverte entre las zonas de la ventana.

### Tarea 5.3 — No depender solo del color

1. La matriz marca en rojo a quien está por debajo del objetivo. Alguien que no distingue rojo de verde no lo verá. Los **Icons** de `% Cumplimiento` (Tarea 3.3, con reglas en **Number**) transmiten lo mismo sin color.
2. En el gráfico de líneas, activa los marcadores (Learn lo describe en **Format** > **Shapes** > **Show Markers**; en versiones recientes puede estar en **Format visual** > **Visual** > **Markers**): Learn recomienda los marcadores para no distinguir series solo por color.
3. Comprueba el contraste del texto con el fondo: Learn pide al menos **4,5:1** (WCAG 2.1) y sugiere herramientas como Color Contrast Analyzer o el comprobador de WebAIM. Revisa la paleta de SIT sobre blanco. Calculado: azul `#0F4C81` **8,86:1** (cumple), verde `#5B8C5A` 3,93:1, gris `#8E8E8E` 3,28:1 y naranja `#F28C28` **2,45:1**: los tres últimos no sirven para texto pequeño. Úsalos para barras y líneas, y deja el texto en azul o en negro.

### Tarea 5.4 — Títulos que se entienden

Revisa los títulos de los visuales: sin siglas ni jerga interna ("Vtas YTD x Vend" no; "Ventas acumuladas del año por vendedor" sí).

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Texto alternativo del gráfico de líneas | ___ |
| Orden de tabulación final | ___ |
| Contraste del naranja `#F28C28` sobre blanco y tu decisión | ___ |

---

## Ejercicio 6 — La vista móvil

**Objetivo:** que el gerente de México lea la página en el teléfono.

1. Con `Resumen comercial` abierta, cinta **View** > **Mobile layout** ([Learn: reportes optimizados para móvil](https://learn.microsoft.com/power-bi/create-reports/power-bi-create-mobile-optimized-report-about)).
2. Aparece un lienzo con forma de teléfono y el panel **Page visuals** con los visuales de la página. Arrástralos al lienzo **en orden vertical**: slicer, tarjetas (una debajo de otra o dos por fila), matriz y, si cabe, el gráfico de líneas. El de barras puede quedarse fuera: en el teléfono, menos es más.
3. Los cambios de tamaño y posición en la vista móvil no afectan a la vista normal.
4. Vuelve a la vista normal desde la misma cinta o con el selector de diseño en la parte inferior de la página.

> Learn indica que en el lienzo móvil los tooltips están desactivados. Si un dato importante solo se ve al pasar el puntero, no llegará al teléfono.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Visuales que dejaste fuera de la vista móvil y por qué | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| Todo el reporte cambia de color al aplicar un tema, menos un visual | Ese visual tiene color puesto a mano, que tiene prioridad sobre el tema | Quita el formato manual del visual |
| Solo Laura sale en rojo y las demás filas quedan sin color | La regla usa **Percent** (posición en el rango) en vez de **Number** | Cambia los cuatro desplegables a **Number**, con 0 y 1 como límites |
| No aparece **New visual calculation** | No hay un visual seleccionado | Selecciona la matriz y vuelve a la cinta **Home** |
| `Acumulado` no coincide con el YTD del Lab 121 | Falta el slicer de 2025 en `Mensual`, o `Mes` perdió su **Sort by Column** por `MesNum` | Copia el slicer y revisa el orden de `Mes` (Lab 119) |
| `Vs Mes Anterior` de enero muestra las ventas de enero | En la primera fila `PREVIOUS` devuelve vacío y la resta lo toma como cero | Reto básico: devuelve vacío cuando no hay mes anterior |

## 🔧 Diagnóstico y reparación

### "El reporte se ve bien en mi pantalla pero el comité no encuentra nada"

1. Cuenta los visuales de cada página: si hay más que preguntas, sobran.
2. Mira dónde está lo más importante: arriba a la izquierda se lee primero.
3. Busca colores sin significado: si cada barra tiene un color distinto y no significa nada, usa un solo color y resalta solo la excepción.

## Checklist final

- [ ] Boceto con cuatro preguntas y cuatro visuales
- [ ] Tema de SIT aplicado y `tema-sit.json` descargado
- [ ] Laura Gómez y Valeria Quispe en rojo en 2025; los demás en verde
- [ ] `Acumulado` de octubre 2025 = 16.568.491,50 y `Vs Mes Anterior` de diciembre = −526.225,20
- [ ] Texto alternativo en los tres visuales, orden de tabulación y marcadores
- [ ] Vista móvil de `Resumen comercial`

## Evidencia esperada

- Foto o captura del boceto
- Captura de `Resumen comercial` con el formato condicional
- Captura de la matriz `Mensual` con las dos visual calculations
- Captura de la vista móvil
- El archivo `tema-sit.json`

## Criterios de aprobación

- Cada visual responde una pregunta del comité y la página no tiene visuales de más
- El formato condicional resalta solo la excepción y no depende solo del color
- Distingue cuándo usar una visual calculation y cuándo una medida
- El reporte tiene texto alternativo, orden de tabulación y una vista móvil

## Competencias desarrolladas

- Diseñar el layout de una página a partir de preguntas de negocio
- Aplicar y personalizar un tema de reporte
- Configurar formato condicional por reglas, barras de datos e iconos
- Crear visual calculations con `RUNNINGSUM` y `PREVIOUS`
- Diseñar reportes accesibles y optimizados para móvil

## Reto adicional

**Reto básico:** corrige `Vs Mes Anterior` para que enero quede vacío (pista: `IF ( NOT ISBLANK ( PREVIOUS ( [Ventas Totales] ) ), … )`). Después añade `% del Año` con la plantilla **Percent of grand total**. ¿Qué mes pesa más en 2025?

**Reto intermedio:** cambia la regla de color de `% Cumplimiento` para que use tres tramos (rojo por debajo del 90 %, amarillo entre 90 % y 100 %, verde desde 100 %). ¿Cambia el color de Valeria Quispe?

**Reto avanzado:** abre `tema-sit.json` en un editor de texto, cambia el color 2 y vuelve a importarlo con **Import theme**. Escribe en dos líneas qué ventaja tiene versionar el tema en un repositorio junto al resto de la solución.

## Preguntas de repaso

1. ¿Por qué conviene decidir la pregunta de cada visual antes de construirlo?
2. ¿Qué diferencia hay entre **Number** y **Percent** en las reglas de formato condicional?
3. ¿Cuándo usarías una visual calculation y cuándo una medida del modelo?
4. Nombra tres cosas que hiciste para que el reporte sea accesible.

## Limpieza del laboratorio

Conserva las páginas `Resumen comercial` y `Mensual`: el Lab 124 les añade navegación, tooltips y drillthrough.

## Siguiente laboratorio recomendado

**[Lab 124 — Storytelling](/labs/lab-124-power-bi-storytelling-navegacion)**: drillthrough, tooltips de página, marcadores, navegación y personalización.
