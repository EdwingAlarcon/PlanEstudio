---
id: lab-125
title: "Power BI — Análisis: explicar cambios, agrupar, clasificar, visuales de IA, pronóstico y anomalías (Ruta Pro Power BI)"
level: "N2"
duration: 200
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Lab 124 completado — ruta-pro-sit-ventas.pbix con Resumen comercial, Mensual y la columna Fecha[Con ventas] del Lab 121"
  - "La copia ruta-pro-sit-ventas-antes-grupo.pbix del Lab 121 (para el Ejercicio 5)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 125 — Power BI: análisis y patrones

## Objetivo

Usar las herramientas de análisis de Power BI **con criterio**: explicar un aumento con **Analyze**, crear grupos y tramos, clasificar con una medida de ranking, recorrer el árbol de descomposición, leer el visual de influenciadores clave y añadir pronóstico y detección de anomalías a una serie temporal. En cada una, la pregunta es la misma: ¿lo que muestra el visual tiene sentido de negocio, o es un patrón que el algoritmo encontró en el ruido? Cubre "Identify patterns and trends" del examen PL-300.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 124.

**Problema a resolver:** la directora financiera prepara el presupuesto de 2027 y hace preguntas que no son de "cuánto": ¿por qué noviembre de 2025 fue tan alto?, ¿qué peso tiene el sector público?, ¿quiénes son los cinco clientes que más compran?, ¿qué hace que una línea de pedido sea grande?, ¿cómo cerraría 2026 si sigue la tendencia? Quiere respuestas con su explicación, no un gráfico más.

> **Un aviso honesto sobre los datos:** SIT Ventas es un conjunto **sintético**: los pedidos se generaron con reglas sencillas (estacionalidad mensual, precios por producto, clientes al azar). Los visuales de IA encontrarán los patrones que esas reglas crean (por ejemplo, que las licencias de CRM hacen líneas grandes), pero no esperes historias de negocio profundas. Es justo la lección: **un visual de IA siempre devuelve algo**; tu trabajo es decidir si significa algo.

## Lo que vas a construir

- La explicación del aumento de noviembre de 2025 con **Analyze** > **Explain the increase**
- Un grupo `Sector público` en las industrias y tramos de 10.000 en el importe por línea
- Una medida `Ranking Cliente` y una tabla con los cinco mayores clientes de 2025
- Un **Decomposition tree** de las ventas de 2025, con un corte de IA
- Un **Key influencers** sobre el importe por línea
- Un gráfico de líneas mensual con **Forecast** y otro con **Anomalies**

## Relación con la Ruta Pro

| Viene de | En este lab | Lo usa |
|---|---|---|
| Labs 119-124: modelo, medidas, `Fecha[Con ventas]`, páginas | Análisis, agrupación, ranking, visuales de IA, pronóstico y anomalías | Lab 126 publica el reporte; Lab 127 (reto Pro) exige justificar un hallazgo |

> **Fuente del esqueleto:** el lab de análisis del curso oficial PL-300 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-300-Microsoft-Power-BI-Data-Analyst)) y las páginas de Learn citadas. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Explicar un aumento | 25 min |
| Ejercicio 2 — Grupos y tramos | 30 min |
| Ejercicio 3 — Los cinco mayores clientes | 25 min |
| Ejercicio 4 — Árbol de descomposición | 35 min |
| Ejercicio 5 — Influenciadores clave | 40 min |
| Ejercicio 6 — Pronóstico y anomalías | 45 min |
| **Total** | **unas 3 h 20 min** (mejor en dos sesiones: Ejercicios 1 a 3 y 4 a 6) |

## Nivel

**N2 Intermedio** — Certificación objetivo de la ruta: **PL-300**

## Tecnologías utilizadas

- Power BI Desktop: **Analyze** (**Explain the increase**), **New group** (lista y **Bin size**), `RANKX`, panel **Filters**, **Decomposition tree**, **Key influencers**, panel **Analytics** (**Forecast**, **Anomalies**)

## Prerrequisitos

### Entorno

- [ ] El archivo `ruta-pro-sit-ventas.pbix` del Lab 124
- [ ] La copia `ruta-pro-sit-ventas-antes-grupo.pbix` que guardaste en el Lab 121, antes de crear el grupo de cálculo. **El Ejercicio 5 la necesita** (ver por qué allí)

### Conocimiento previo

- Lab 121: la columna `Fecha[Con ventas]` y la trampa del año incompleto
- Lab 123: formato de visuales y **Edit interactions**

---

## Ejercicio 1 — Explicar un aumento

**Objetivo:** que Power BI proponga por qué subieron las ventas de un mes al siguiente ([Learn: insights](https://learn.microsoft.com/power-bi/create-reports/desktop-insights)).

1. Página nueva `Análisis`. Una página nueva no recibe el slicer sola: selecciona el slicer de año de `Resumen comercial`, cinta **View** > **Sync slicers**, y marca **Sync** y **Visible** también para `Análisis`. Déjalo en **2025**. Añade un **Clustered column chart** con `Fecha[Mes]` en el eje y `Ventas Totales` en los valores. (Learn exige que una columna de texto en el eje tenga un orden numérico para poder usar **Analyze**: `Mes` lo tiene, porque se ordena por `MesNum`.)
2. De octubre (**1.970.597,00**) a noviembre (**2.399.347,80**) las ventas suben **428.750,80**. Clic derecho sobre la columna de **noviembre** > **Analyze** > **Explain the increase**.
3. Se abre una ventana con un gráfico de cascada (por defecto) que reparte el aumento entre los valores de alguna columna del modelo. Con los iconos de la parte inferior puedes cambiarlo a dispersión, columnas apiladas o cinta.
4. **Anota** qué columna eligió Power BI para explicar el aumento y qué valor aporta más. Comprobado sobre los datos: por país, **Perú** aporta **+298.659,40** (cerca del 70 % del aumento), y es lo mismo que Lima o que Valeria Quispe, porque en Perú hay una sola región y una sola ejecutiva. Por categoría, el aumento lo lleva **Servicios** (+222.130,00), por delante de Licencias (+192.991,80). Lo más probable es que Power BI elija país, región o vendedor y señale Perú.
5. **Juzga:** ¿la explicación es una causa o una descripción? "El aumento viene de Perú" describe **dónde** subió, no **por qué**. En estos datos no hay un porqué de negocio: la estacionalidad solo explicaría un aumento de un 4-5 % de octubre a noviembre, y el real es de casi un 22 %, así que pesan más unas pocas líneas grandes de un mes concreto. Ninguna columna del modelo lo puede explicar, y un analista no debe inventarlo.

> **Límites que da Learn:** no funciona sobre el primer punto, ni con filtros Top N, filtros de medida, medidas no numéricas, medidas filtradas o modelos con seguridad a nivel de fila. Por eso se usa `Ventas Totales` (una `SUM` sencilla) y no `Ventas Licencias`. Si la opción no aparece o da error en tu archivo, prueba en la copia `ruta-pro-sit-ventas-antes-grupo.pbix`.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Columna que eligió Power BI y valor que más aporta | ___ |
| ¿Causa o descripción? Tu juicio en una frase | ___ |

---

## Ejercicio 2 — Grupos y tramos

**Objetivo:** agrupar valores sin tocar los datos de origen ([Learn: grouping and binning](https://learn.microsoft.com/power-bi/create-reports/desktop-grouping-and-binning)).

### Tarea 2.1 — Un grupo de industrias

1. En el panel **Data**, clic derecho sobre `Clientes[Industria]` > **New group**.
2. En **Name**, escribe `Sector`. En **Ungrouped values**, selecciona con **Ctrl** `Educación`, `Gobierno` y `Salud` y pulsa **Group**. Renombra el grupo (doble clic) a `Sector público`.
3. Selecciona el resto de industrias (menos `Sin dato`) y agrúpalas en `Sector privado`. Luego selecciona `Sin dato` sola y agrúpala como `Sin dato`. **No uses el grupo Other**: metería también `Sin dato` en el sector privado, y no sabes de qué sector es.
4. **OK**. Aparece la columna `Sector`. Un **Table** con `Clientes[Sector]` y `Ventas Totales` (2025).

### Resultado esperado de la Tarea 2.1 (2025)

| Sector | Ventas Totales |
|---|---|
| Sector privado | 13.837.870,80 |
| **Sector público** | **5.745.558,90** |
| `Sin dato` | 1.257.532,20 |
| **Total** | **20.840.961,90** |

El sector público suma Salud (2.635.543,00), Educación (1.853.112,90) y Gobierno (1.256.903,00). Si hubieras usado **Other** con `Sin dato` dentro, Other sumaría 15.095.403,00.

`Sin dato` (los 8 clientes sin industria del Lab 116) vende casi lo mismo que todo Gobierno. **Antes de presentar el peso del sector público, alguien tiene que completar esos datos**: es un hallazgo de calidad de datos, no de negocio.

### Tarea 2.2 — Tramos de importe

1. Crea en `Ventas` la medida `Líneas = COUNTROWS ( Ventas )` (con **discourage implicit measures** activo desde el Lab 121, no puedes arrastrar una columna como valor).
2. Clic derecho sobre `Ventas[Importe]` > **New group**. En el diálogo, elige el tipo de tramos e indica **Bin size** `10000`. **OK**: aparece `Importe (bins)`. Learn indica que los tramos solo se crean en Desktop y sobre columnas numéricas o de fecha, no sobre medidas.
3. Un **Clustered column chart** con `Importe (bins)` en el eje y `Líneas` en los valores (2025).

### Resultado esperado de la Tarea 2.2 (2025, 1.438 líneas)

| Tramo (desde) | Líneas |
|---|---|
| 0 | 750 |
| 10.000 | 416 |
| 20.000 | 121 |
| 30.000 | 32 |
| 40.000 | 41 |
| 50.000 | 22 |
| 60.000 | 31 |
| 70.000 | 15 |
| 80.000 | 8 |
| 90.000 | 2 |

Más de la mitad de las líneas valen menos de 10.000, y la mediana (9.540, Lab 120) cae justo en ese tramo. Las pocas líneas de más de 40.000 son las que suben el promedio. El Ejercicio 5 te dirá cuáles son.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Ventas del `Sector público` en 2025 | ___ |
| Líneas de 2025 por debajo de 10.000 | ___ |

---

## Ejercicio 3 — Los cinco mayores clientes

**Objetivo:** una lista de los cinco mayores clientes que se recalcula con el año y con cualquier filtro.

1. Crea en `Ventas`:

```dax
Ranking Cliente =
RANKX (
    ALLSELECTED ( Clientes[Cliente] ),   // compara con todos los clientes visibles según los filtros externos (slicer, página)
    [Ventas Totales]
)
```

2. Un **Table** con `Clientes[Cliente]`, `Ventas Totales` y `Ranking Cliente` (2025).
3. En el panel **Filters**, sección de filtros de este visual, despliega `Ranking Cliente`: en **Show items when the value**, elige **is less than or equal to** y escribe `5`. **Apply filter** ([Learn: filtros](https://learn.microsoft.com/power-bi/create-reports/power-bi-report-add-filter)).
4. Ordena la tabla por `Ventas Totales` de mayor a menor.
5. Desactiva los totales de la tabla: en la fila de total, `Ranking Cliente` daría 1 y las ventas sumarían los cinco, una fila que no significa nada.

### Resultado esperado del Ejercicio 3 (2025)

| # | Cliente | Ventas Totales |
|---|---|---|
| 1 | Seguros Horizonte S.A.S. | 436.582,20 |
| 2 | Banco Cumbre S.A.C. | 380.104,70 |
| 3 | Farmacéutica Central S.A. | 357.419,50 |
| 4 | Constructora Cumbre S.A. | 331.337,00 |
| 5 | Comercializadora Central S.A. de C.V. | 293.528,70 |

Cambia el slicer a 2024: la lista cambia sola. Y el mayor cliente de los tres años (Energía Puerto Ltda., Lab 121) **no está** entre los cinco de 2025: un ranking siempre es "de qué periodo".

> **Por qué `ALLSELECTED` y no `ALL`:** un filtro de otra tabla (por ejemplo, un slicer de `Regiones[Pais]`) afecta igual a las dos versiones, porque filtra las ventas de cada cliente. La diferencia aparece cuando el filtro está sobre `Clientes[Cliente]` mismo: si alguien elige 20 clientes en un slicer, con `ALL` cada uno conserva su puesto entre los 150 (quizá 7, 12, 30…) y el filtro "menor o igual que 5" puede dejar la tabla vacía; con `ALLSELECTED` los 20 se clasifican entre sí, del 1 al 20.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Cliente número 1 de 2025 y sus ventas | ___ |
| Cliente número 1 de 2024 | ___ |

---

## Ejercicio 4 — Árbol de descomposición

**Objetivo:** recorrer de dónde vienen las ventas, nivel a nivel, y ver qué corte propone la IA ([Learn: decomposition tree](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-decomposition-tree)).

1. En `Análisis`, un **Decomposition tree**. En **Analyze**, `Ventas Totales`. En **Explain By**, `Regiones[Pais]`, `Regiones[Region]`, `Productos[Categoria]` y `Clientes[Industria]`.
2. Con 2025 en el slicer, pulsa el **+** del nodo raíz y elige `Pais`; luego, en **Colombia**, `Region`; en **Antioquia**, `Categoria`.

### Resultado esperado del Ejercicio 4 (2025)

| Nivel | Valor |
|---|---|
| Ventas Totales | 20.840.961,90 |
| Colombia | 9.208.289,00 (México 5.736.172,90 · Chile 3.408.686,70 · Perú 2.487.813,30) |
| Antioquia | 4.303.248,20 |
| Licencias | 2.761.753,20 |

3. **El corte de IA:** inserta un **segundo Decomposition tree** con los mismos campos (o quita los niveles del primero con la **X** de su encabezado: cada nivel admite un solo campo y la raíz ya tiene `Pais`). En la raíz, pulsa **+** y elige **High value** (con una bombilla). Learn explica que la IA busca, entre los campos disponibles, el que lleva al valor más alto de la medida. Con el tipo de análisis absoluto (en el formato, **Analysis type** = **Absolute**) debería elegir **Categoria** y llegar a **Licencias (13.799.948,40)**, porque ninguna región, país o industria suma tanto como una sola categoría. Con **Relative**, que compara cada valor con la media de su campo, ganaría **Servicios Financieros**.
4. **Juzga:** "Licencias es el valor más alto" es cierto y también obvio: es la categoría que más vende en todo el año (Lab 120). Un corte de IA no es un hallazgo hasta que dice algo que no sabías.

> **Límites que da Learn:** hasta 50 niveles y 10 valores por nivel; los cortes de IA no funcionan con medidas complejas ni en algunos entornos (por ejemplo, *Publish to web*).

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Campo y valor que eligió **High value** | ___ |
| ¿Te dijo algo nuevo? | ___ |

---

## Ejercicio 5 — Influenciadores clave

**Objetivo:** preguntar qué hace que una línea de pedido sea grande, y leer la respuesta con cuidado ([Learn: key influencers](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-influencers)).

**Por qué en la copia:** Learn indica que el análisis por categorías de **Key influencers** no está disponible cuando el modelo tiene **discourage implicit measures** activado, y lo activaste al crear el grupo de cálculo (Lab 121). Este ejercicio hace un análisis continuo, que Learn no menciona en esa limitación, pero en la copia tampoco dependes de cómo trate tu versión una columna sin resumir, y puedes probar el análisis por categorías del reto adicional.

1. Abre la copia. Página nueva con un slicer de `Fecha[Año]` en **2025**.
2. Inserta **Key influencers**. En **Analyze**, `Ventas[Importe]` (un número por línea); en el desplegable del campo, comprueba que está como **Don't summarize**: si queda como suma, el visual analiza importes agregados y las medias no cuadran. En **Explain by**, `Productos[Subcategoria]`, `Productos[Categoria]`, `Clientes[Segmento]` (Empresa, Pyme, Gobierno; **no** `Segmento Cliente` del Lab 121, que se calcula con las propias ventas y saldría como influenciador por construcción) y `Regiones[Pais]`.
3. Como `Importe` es numérico, el visual hace un análisis continuo: lista qué valores **aumentan** el importe medio de una línea. Mira la pestaña **Key influencers** y luego **Top segments**.

### Resultado esperado del Ejercicio 5 (2025)

El primer influenciador debería ser **Subcategoria = CRM**. Comprobado sobre los datos: las líneas de licencias de CRM tienen un importe medio de **41.714,82**, frente a **10.146,31** del resto de líneas (y 14.493,02 de todas): el visual debería indicar un aumento del orden de **+31.568,51**. El segundo probable es **Categoria = Licencias** (19.884,65 de media frente a 9.463,73 del resto, unos +10.421); **Proyecto** (19.036,61, con solo 56 líneas) queda por debajo. `Segmento` y `Pais` no deberían aparecer como influenciadores fuertes: en estos datos, los clientes se reparten al azar.

4. **Juzga:** el visual "descubre" que las licencias de CRM (780 y 600 de precio por usuario, con hasta 120 usuarios) hacen líneas grandes. Es verdad, pero es **aritmética del precio**, no un comportamiento de los clientes. Learn señala además que el visual analiza una muestra de hasta 10.000 puntos; aquí hay 1.438, así que analiza todo.

> **Requisitos que da Learn:** no funciona con DirectQuery, conexión en vivo a Analysis Services ni *Publish to web*.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Primer influenciador y cuánto aumenta el importe según el visual | ___ |
| ¿Es un hallazgo de negocio o una consecuencia del precio? | ___ |

---

## Ejercicio 6 — Pronóstico y anomalías

**Objetivo:** añadir a una serie mensual un pronóstico y una detección de anomalías, y saber cuándo creerles ([Learn: panel Analytics](https://learn.microsoft.com/power-bi/transform-model/desktop-analytics-pane), [Learn: anomaly detection](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-anomaly-detection)).

### Tarea 6.1 — Un eje de fechas mensual

El pronóstico y las anomalías necesitan una serie temporal en el eje. `Fecha[Mes]` es texto ("ene", "feb"…) y se repite cada año: no sirve. Crea en `Fecha` (**New column**):

```dax
Inicio Mes = DATE ( Fecha[Año], Fecha[MesNum], 1 )   // el 1 de cada mes: una fecha por mes, ordenable en el tiempo
```

### Tarea 6.2 — Pronóstico

1. En `Análisis`, un **Line chart** con `Fecha[Inicio Mes]` en el eje y `Ventas Totales` en los valores. Con **Edit interactions** (Lab 123), que el slicer de año **no** filtre este visual: quieres los tres años.
2. Añade al visual un filtro `Fecha[Con ventas]` = verdadero (Lab 121). Hoy noviembre y diciembre de 2026 no se dibujan (`Ventas Totales` es vacía, no cero), pero el filtro protege el pronóstico si mañana alguien cambia la medida para que devuelva 0 en los meses sin ventas: el pronóstico partiría de una caída que no existe.
3. Con el visual seleccionado, panel **Visualizations** > icono **Analytics** > **Forecast** > añade un pronóstico. **Forecast length**: 2 (noviembre y diciembre de 2026; si tu versión pide unidades, elige meses o puntos). **Confidence interval**: 95 %.
4. **Anota** el valor pronosticado para noviembre y diciembre de 2026 y el ancho del intervalo.

### Tarea 6.3 — Anomalías

Learn indica que la detección de anomalías no se combina con el pronóstico en el mismo visual. Copia el gráfico (Ctrl + C, Ctrl + V), quita el pronóstico en la copia y **repite en la copia Edit interactions** (el visual pegado puede no conservarlo y el slicer lo filtraría a 2025). En el panel **Analytics**, añade **Anomalies**. Prueba la **Sensitivity** al 70 % y al 90 % y anota qué meses marca como anómalos con cada una.

### Resultado esperado del Ejercicio 6

No hay cifra única: el pronóstico y las anomalías dependen del algoritmo y de tu versión. Lo que sí debes poder explicar:

- **La estacionalidad se ve poco en el importe.** Los datos se generaron con más pedidos a fin de año (diciembre tiene 69 pedidos en 2024 y 78 en 2025, frente a 44 y 46 en enero), pero el importe depende mucho de unas pocas líneas grandes: noviembre de 2024 vende menos que octubre y enero de 2026 (2.021.915,40) más que diciembre de 2025. No esperes que el pronóstico dibuje un fin de año claro; si tu versión permite indicar la estacionalidad, prueba 12 puntos y compara.
- **El total de 2026** estimado (enero a octubre reales, 18.936.520,50, más el pronóstico de noviembre y diciembre) es la cifra que la directora financiera quería. Calcúlalo y compáralo con el objetivo de 2026 (**23.363.000**: `Objetivo Total` con 2026 en el slicer).
- **El mes de más ventas de la serie es marzo de 2026 (2.416.338,70)**, seguido de noviembre de 2025 (2.399.347,80). Si la detección de anomalías marca alguno de los dos, pregúntate si es una anomalía o un buen mes. Con sensibilidad alta, casi cualquier pico es "anómalo".

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Pronóstico de noviembre y diciembre de 2026 | ___ |
| Total estimado de 2026 frente al objetivo de 23.363.000 | ___ |
| Meses anómalos con sensibilidad 70 % y 90 % | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| No aparece **Analyze** al hacer clic derecho | Es el primer punto, el visual no es de barras o líneas, o hay un filtro Top N o de medida | Clic sobre un mes que no sea el primero; quita filtros de medida |
| No puedes arrastrar `Ventas[Importe]` como valor | **Discourage implicit measures** (Lab 121) | Usa la medida `Líneas` o `Ventas Totales` |
| El ranking repite el 1 en todas las filas | `RANKX` sin `ALLSELECTED`/`ALL`: cada fila solo se ve a sí misma | `RANKX ( ALLSELECTED ( Clientes[Cliente] ), … )` |
| **Key influencers** no ofrece el análisis por categorías | **Discourage implicit measures** activo | Usa la copia de antes del grupo de cálculo |
| No aparece **Forecast** en el panel **Analytics** | El eje no es una fecha (por ejemplo `Fecha[Mes]`, texto) o es categórico, o el visual tiene leyenda o varias medidas | Eje `Fecha[Inicio Mes]` como eje continuo, una sola medida, sin leyenda |
| La anomalía o el pronóstico cambian al copiar el visual | La copia no conserva **Edit interactions** y el slicer la filtra a un año | Repite **Edit interactions** en la copia |

## 🔧 Diagnóstico y reparación

### "La IA dice que X influye, ¿lo pongo en la presentación?"

1. **¿Es aritmética?** Si el influenciador es un producto caro y la medida es un importe, el hallazgo es el precio.
2. **¿Cuántas filas lo sostienen?** Un segmento con 5 líneas puede salir como influenciador por azar. Mira el recuento en **Top segments**.
3. **¿Se repite en otro año?** Cambia el slicer a 2024: si desaparece, no lo presentes como regla.

## Checklist final

- [ ] Explicación del aumento de noviembre de 2025 anotada y juzgada
- [ ] `Sector público` 2025: 5.745.558,90; `Sin dato`: 1.257.532,20
- [ ] Tramos de importe: 750 líneas por debajo de 10.000 en 2025
- [ ] Top 5 de 2025 encabezado por Seguros Horizonte S.A.S. (436.582,20)
- [ ] Árbol: Colombia 9.208.289,00 → Antioquia 4.303.248,20 → Licencias 2.761.753,20; **High value** → Licencias
- [ ] **Key influencers**: CRM como primer influenciador, juzgado
- [ ] Pronóstico de noviembre y diciembre de 2026 y anomalías con dos sensibilidades

## Evidencia esperada

- Captura de la explicación del aumento y tu juicio
- Captura del top 5 con el filtro de ranking
- Captura del árbol con el corte de IA
- Captura de **Key influencers** y tu juicio
- Tu estimación del total de 2026 frente al objetivo, en tres líneas

## Criterios de aprobación

- Usa cada herramienta de análisis en el visual y con los datos que admite
- Distingue un patrón real de uno que viene del cálculo o del azar
- Las cifras deterministas (grupo, tramos, top 5, árbol) coinciden con las esperadas
- Comunica el pronóstico con su incertidumbre, no como una cifra exacta

## Competencias desarrolladas

- Explicar cambios con **Analyze**
- Crear grupos y tramos y clasificar con `RANKX`
- Usar el árbol de descomposición y los influenciadores clave con sentido crítico
- Aplicar pronóstico y detección de anomalías a una serie temporal

## Reto adicional

**Reto básico:** cambia `Ranking Cliente` para que clasifique **vendedores** y no clientes. ¿Coincide el orden con la matriz de cumplimiento del Lab 119?

**Reto intermedio:** en el árbol de descomposición, prueba **Low value** desde la raíz. ¿Qué elige y por qué tiene sentido?

**Reto avanzado:** escribe para la directora financiera un párrafo de cinco líneas con tu estimación del cierre de 2026: la cifra, el intervalo del pronóstico, la comparación con el objetivo y una advertencia sobre lo que el modelo no sabe (por ejemplo, un proyecto grande que se firme en diciembre).

## Preguntas de repaso

1. ¿Por qué "el aumento viene de Perú" no explica la causa del aumento?
2. ¿Cuándo da un resultado distinto un ranking con `ALL` frente a uno con `ALLSELECTED`? Pon un ejemplo con un slicer.
3. ¿Por qué el ejercicio de influenciadores se hace en una copia del archivo?
4. ¿Por qué hay que quitar noviembre y diciembre de 2026 antes de pronosticar?

## Limpieza del laboratorio

Conserva la página `Análisis` en `ruta-pro-sit-ventas.pbix`. La copia de antes del grupo ya no se usa en la ruta: puedes borrarla.

## Siguiente laboratorio recomendado

**Lab 126 — Servicio y seguridad** (en construcción): publicar en My workspace, dashboard, alertas, actualización programada y seguridad a nivel de fila.
