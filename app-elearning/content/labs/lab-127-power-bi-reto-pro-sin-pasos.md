---
id: lab-127
title: "Power BI — Reto Pro sin pasos: el reporte de la Gerencia de Servicios (Ruta Pro Power BI)"
level: "N2"
duration: 420
product: ["Power BI"]
certifications: ["PL-300"]
role: ["Analista de datos"]
prerequisites:
  - "Labs 116 a 126 completados (o dominio equivalente de Power BI Desktop y del servicio)"
  - "El paquete sit-ventas.zip y una cuenta con acceso a My workspace"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 127 — Power BI: reto Pro sin pasos

## Objetivo

Demostrar que puedes hacer un reporte profesional **sin instrucciones paso a paso**: de los archivos de origen a un reporte publicado y protegido, para un cliente interno nuevo, con decisiones que tienes que justificar. Es el proyecto final de la Ruta Pro Power BI y se evalúa con una **rúbrica de criterios comprobables por los cuatro dominios del examen PL-300**: preparar los datos, modelarlos, visualizarlos y analizarlos, y gestionarlos y protegerlos.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT).

**Tu cliente:** la **gerente de Servicios**, que no es la del comité comercial de los labs anteriores. Dirige las cuatro prácticas de la categoría `Servicios`: **Consultoría**, **Desarrollo**, **Proyecto** (implementaciones y migraciones) y **Soporte** (los valores de `Productos[Subcategoria]`). Su problema no es cuánto se vende sino **cuánto se tarda en entregar** y **cuánto trabajo vendido queda pendiente**. En la reunión de arranque te dijo:

> "Necesito un reporte que mire mi mes en dos minutos. Quiero saber cuánto vendimos de servicios, cuánto tardamos en entregar desde que el cliente firma, qué parte entregamos en 30 días o menos (es lo que prometemos en los contratos), y cuánto trabajo vendido tengo pendiente a fin de cada mes para planificar al equipo. Mis cuatro jefes de práctica también lo van a usar, y cada uno debe ver **solo su práctica**; yo, todas. Ah, y no me compares las ventas de 2026 con las de 2025 entero, que ya me pasó con el comité."

## Reglas del reto

- **No hay pasos.** Tienes los labs 116 a 126 como referencia; vuelve a ellos cuando lo necesites.
- **Empieza un archivo nuevo** (`reto-servicios-sit.pbix`) desde [sit-ventas.zip](/practice-assets/powerbi/sit-ventas/sit-ventas.zip). No reutilices `ruta-pro-sit-ventas.pbix`: el reto también evalúa la preparación de datos.
- **Carga las tres categorías** de ventas, no solo `Servicios`: la consulta de control se compara con los totales de la empresa y el contexto (qué peso tienen los servicios) es parte del análisis. El filtro a `Servicios` va en las medidas o en la página.
- **Cada decisión importante va en tu documento de entrega** con una línea de justificación (la rúbrica la pide).
- **Tiempo de referencia:** de 6 a 8 horas, en tres sesiones (preparar y modelar; visualizar y analizar; publicar, proteger y documentar).

## Requisitos

### R1 — Preparar los datos (dominio "Prepare the data")

- Las ventas de los tres años en una sola tabla, sin la fila de total de 2026 y con las fechas bien leídas (Lab 117: cuidado con 2024).
- Un parámetro para la carpeta de origen.
- Solo las tablas y columnas que el reporte usa: justifica qué dejas fuera.
- Una consulta de control con el número de líneas y el importe por año que cuadre con los del Lab 118: **3.995** líneas; 2024 = 17.714.901,00; 2025 = 20.840.961,90; 2026 = 18.936.520,50.

### R2 — Modelar (dominio "Model the data")

- Un esquema en estrella con una tabla de fechas marcada.
- Medidas explícitas (como mínimo), todas sobre la categoría `Servicios`:
  - **Ventas de servicios.**
  - **Días promedio de entrega:** promedio, por **línea**, de `FechaEntrega − FechaPedido` en días naturales (la resta, sin sumar 1), solo de las líneas que tienen fecha de entrega.
  - **% entregado en 30 días o menos:** de esas mismas líneas, las que tienen `FechaEntrega − FechaPedido ≤ 30`.
  - **Cartera pendiente al cierre del periodo** (semiaditiva, Lab 120): importe de las líneas con `FechaPedido ≤ cierre` y que, al cierre, no tienen fecha de entrega o la tienen **posterior** al cierre (`FechaEntrega > cierre`).
- Una comparación de las **ventas de servicios** con el año anterior que no compare un año incompleto con uno completo (Lab 121).
- Ninguna medida implícita en los visuales.

### R3 — Visualizar y analizar (dominio "Visualize and analyze the data")

- **Una** página principal que responda las cuatro preguntas de la gerente (Lab 123), con texto alternativo en cada visual y orden de tabulación.
- Una página de detalle por práctica (`Productos[Subcategoria]`) a la que se llegue con drillthrough desde la página principal (Lab 124).
- Un hallazgo analítico (Lab 125), con tu juicio: ¿es una causa o una descripción?, ¿lo sostienen suficientes líneas?, ¿hay algo en los datos que pueda engañar?

### R4 — Gestionar y proteger (dominio "Manage and secure Power BI")

- El reporte publicado en **My workspace**.
- **Seguridad a nivel de fila** para las cinco personas: cada jefe de práctica ve solo su `Subcategoria` y la gerente ve todas. Puedes hacerlo con roles estáticos (uno por práctica y uno para la gerente, sin regla) o con un rol dinámico y una tabla de correos que tú creas (los datos no traen correos de jefes de práctica: invéntalos con el dominio `sit-demo.example.com`). Justifica la elección.
- Prueba la seguridad con **View as** en Desktop (no hace falta licencia de pago): cada rol (o cada correo) muestra solo su práctica, y **además** una prueba de "sin acceso": con roles estáticos, un rol de práctica no ve las ventas de otra; con rol dinámico, un correo que no está en la tabla no ve nada.
- Un dashboard con una alerta configurada que tenga sentido para la gerente. Con orígenes locales y sin puerta de enlace la alerta no se disparará (Lab 126): basta con que esté bien configurada.

## Cifras de control

Calculadas sobre los archivos del curso, por **fecha de pedido**, con las definiciones de R2. Te sirven para comprobar que vas bien. **No son las respuestas del reto**: cumplir las cifras es necesario, no suficiente.

| Control (categoría `Servicios`) | Valor |
|---|---|
| Ventas de servicios 2025 | **5.941.370,00** |
| Líneas de servicios 2025 / pedidos con al menos una línea de servicios | 483 / 391 |
| Ventas de servicios 2025 por práctica | Consultoría 2.393.690,00 · Soporte 1.360.260,00 · Desarrollo 1.121.370,00 · Proyecto 1.066.050,00 |
| Días promedio de entrega, líneas pedidas en 2025 y entregadas | **25,64** |
| % de esas líneas entregadas en 30 días o menos | **67,49 %** |
| Cartera pendiente de servicios al 31/12/2025 | **507.165,00** |
| Cartera pendiente de servicios al 31/10/2026 | 512.297,50 |
| Ventas de servicios 2024 | 4.465.525,00 |
| Ventas de servicios enero a octubre: 2025 / 2026 | 4.797.322,50 / **5.297.782,50** |

> **Si tus cifras de días difieren:** contar los dos extremos (sumar 1) da 26,64 días y 64,80 %; comparar `< 30` en vez de `≤ 30` también da 64,80 %; medir por fecha de **entrega** en 2025 da otras cifras. Las tres lecturas existen en empresas reales, pero el reto pide la de R2. Si eliges otra para el reporte final, justifícala y demuestra que también reproduces estas.

## Entregables

1. `reto-servicios-sit.pbix`.
2. El enlace al reporte publicado (o capturas, si no puedes compartir).
3. Un documento de **una o dos páginas** con:
   - las decisiones de R1 a R4 y su justificación, una línea cada una;
   - la tabla de cifras de control con tus valores;
   - el hallazgo analítico y tu juicio;
   - qué haría falta para pasar el reporte a producción (puerta de enlace, licencias, asignación de roles en el servicio y si la gerente entra como Viewer).
4. Tu puntuación con la rúbrica, criterio por criterio, con la evidencia de cada uno.

## Rúbrica (100 puntos)

Cada dominio vale 25 puntos: cinco criterios de 5 puntos. Cada criterio se cumple (5), se cumple a medias (2) o no se cumple (0), y cada uno dice qué evidencia lo demuestra. Puntúa con honestidad o pide a otra persona que lo haga.

**Preparar (25)**

| Criterio | Evidencia |
|---|---|
| P1. La consulta de control da 3.995 líneas y los tres importes por año de R1 | Captura de la consulta de control |
| P2. Las fechas de 2024 están bien leídas (ventas de servicios 2024 = 4.465.525,00) | Valor en el documento |
| P3. La fila `TOTAL MARZO` no está en el modelo | Recuento de 2026 o paso que la quita |
| P4. La carpeta de origen es un parámetro | Captura del parámetro |
| P5. Cada tabla o columna que no cargas tiene su justificación | Lista en el documento |

**Modelar (25)**

| Criterio | Evidencia |
|---|---|
| M1. Estrella con tabla de fechas marcada y relaciones de muchos a uno en un solo sentido | Captura de **Model view** |
| M2. Ventas de servicios 2025 = 5.941.370,00 y por práctica como en la tabla | Valores en el documento |
| M3. Días promedio 25,64 y % en 30 días 67,49 % (o la lectura alternativa justificada y reproducida) | Valores y DAX de las dos medidas |
| M4. Cartera semiaditiva: 507.165,00 al 31/12/2025 y el total del año igual al cierre de diciembre | Captura de la matriz por mes |
| M5. Comparación interanual comparable: 2026 frente a enero-octubre de 2025 (5.297.782,50 frente a 4.797.322,50), y ninguna medida implícita | Captura y DAX |

**Visualizar y analizar (25)**

| Criterio | Evidencia |
|---|---|
| V1. Una sola página principal con un visual por cada una de las cuatro preguntas de la gerente | Captura de la página con la pregunta de cada visual anotada |
| V2. Texto alternativo en todos los visuales de la página principal y orden de tabulación revisado | Captura del panel **Selection** y de un texto alternativo |
| V3. Drillthrough por práctica que conserva el año elegido | Captura de la página de detalle de una práctica |
| V4. Un hallazgo con cifras, sostenido por un número de líneas que lo justifica | Párrafo en el documento |
| V5. El juicio del hallazgo: causa o descripción, y qué podría engañar en los datos | Párrafo en el documento |

**Gestionar y proteger (25)**

| Criterio | Evidencia |
|---|---|
| G1. Reporte y modelo publicados en **My workspace** | Captura o enlace |
| G2. Seguridad que cubre a las cinco personas (cuatro prácticas y la gerente) | Captura de **Manage roles** |
| G3. **View as** muestra solo su práctica a cada jefe y todas a la gerente | Capturas (al menos dos prácticas y la gerente) |
| G4. Prueba de "sin acceso" (rol de otra práctica o correo desconocido) | Captura |
| G5. Dashboard con una alerta bien configurada y plan de producción en el documento | Captura de la regla y párrafo del plan |

**Aprobado:** 60 puntos o más, con al menos 10 en cada dominio. **Nivel Pro:** 85 o más. Con licencia gratuita se pueden conseguir los 100 puntos: ningún criterio exige compartir ni asignar personas en el servicio.

## Pistas (solo si te atascas)

<details>
<summary>Pista 1 — La comparación interanual de ventas sale negativa y no tiene sentido</summary>

Es la trampa del Lab 121: 2026 tiene datos hasta octubre. Compara 2026 con enero-octubre de 2025 (5.297.782,50 frente a 4.797.322,50).

</details>

<details>
<summary>Pista 2 — La cartera de servicios del año sale enorme</summary>

Estás sumando los saldos de los meses. La cartera es un saldo: el total del año debe ser el saldo al 31 de diciembre (Lab 120, Ejercicio 4).

</details>

<details>
<summary>Pista 3 — La RLS por práctica no filtra nada</summary>

La regla tiene que ir en la tabla que contiene `Subcategoria` (`Productos`), que filtra `Ventas` por la relación, y debe comparar con el texto exacto del dato (`Consultoría`, con tilde).

</details>

<details>
<summary>Pista 4 — "En 2026 entregamos más rápido"</summary>

Antes de presentarlo, cuenta cuántas líneas de 2026 siguen **sin entregar** y piensa cuánto habrían tardado. El promedio de días solo incluye lo ya entregado: los trabajos más lentos de los últimos meses todavía no están en él. Un hallazgo que desaparece cuando se entregan las líneas pendientes no es un hallazgo.

</details>

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| Ventas de servicios 2024 no da 4.465.525,00 | Fechas de 2024 mal leídas (`dd/mm` como `mm/dd`): dan error o caen en otro mes | Lab 117 |
| Ventas de servicios 2025 no da 5.941.370,00 | El cruce con `Productos` no encuentra la categoría (nombre de columna o texto distinto), o el descuento se aplicó como fracción y no como porcentaje | Revisa la relación y la fórmula de `Importe` (Lab 118) |
| Días promedio distinto de 25,64 | Promedio por pedido, se sumó 1 a la resta o las líneas sin entrega cuentan como 0 | Definición de R2 |
| % en 30 días distinto de 67,49 % | `< 30` en lugar de `≤ 30`, o se sumó 1 a la resta | Definición de R2 |
| Cartera al 31/12/2025 distinta de 507.165,00 | Falta quitar el filtro de fecha, se usó `≥` en la fecha de entrega o no se filtró la categoría | Definición de R2 y Lab 120, Ejercicio 4 |
| La gerente no ve nada en el servicio | Con RLS, un Viewer que no está en ningún rol no ve datos | Rol de la gerente sin regla (R4) |

## Checklist final

- [ ] La consulta de control cuadra y las cifras de control coinciden
- [ ] Ninguna medida implícita y la cartera es semiaditiva
- [ ] La comparación interanual de ventas compara periodos comparables
- [ ] Una página principal accesible, un drillthrough por práctica y un hallazgo juzgado
- [ ] Publicado, con seguridad para las cinco personas probada con **View as** (incluida la prueba de "sin acceso") y un dashboard con alerta
- [ ] Documento de entrega con decisiones justificadas y la rúbrica puntuada criterio por criterio

## Evidencia esperada

- El archivo `.pbix`, el enlace o las capturas del reporte publicado
- El documento de entrega con la rúbrica puntuada

## Criterios de aprobación

- 60 puntos o más en la rúbrica, con al menos 10 en cada dominio
- Las cifras de control cuadran, o la diferencia está justificada y es reproducible
- Cada decisión de R1 a R4 tiene una justificación

## Competencias desarrolladas

- Llevar un requerimiento de negocio a un reporte de Power BI sin guía paso a paso
- Preparar, modelar, visualizar, analizar, publicar y proteger un reporte completo
- Justificar decisiones técnicas ante un cliente interno
- Evaluar el propio trabajo con una rúbrica alineada con el examen PL-300

## Reto adicional

**Para el portafolio:** prepara una presentación de cinco minutos del reporte para la gerente de Servicios: qué pregunta responde cada visual, el hallazgo y qué necesitarías para ponerlo en producción.

## Preguntas de repaso

1. ¿Qué decisión de este reto te costó más justificar y por qué?
2. ¿Qué harías distinto si los datos llegaran cada día desde una base de datos en lugar de archivos?
3. ¿Cómo explicarías a la gerente por qué el total de la cartera del año no es la suma de los meses?

## Limpieza del laboratorio

Conserva el archivo y el documento de entrega: son la evidencia de portafolio de la ruta.

## Siguiente laboratorio recomendado

Has terminado la Ruta Pro Power BI. Para la certificación, revisa el estado del examen **PL-300** y sus recursos en [Certificaciones](/recursos/certificaciones).
