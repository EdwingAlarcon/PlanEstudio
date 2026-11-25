---
id: lab-138
title: "Rendimiento: bucles, selecciones, concurrencia, paginación y datos que no hacen falta (Ruta Pro Power Automate)"
level: "N3"
duration: 240
product: ["Power Automate", "Dataverse", "Excel"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 130 recomendado (Select, Filter array y variables)"
  - "Lab 132 recomendado (List rows, paginación y claves)"
  - "Lab 133 recomendado (concurrencia en bucles, ya medida con retardos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 138 — Rendimiento

## Objetivo

Hacer que un flujo que funciona con 14 filas **siga funcionando** con 2.000: **medir** antes de cambiar, sustituir bucles por operaciones de datos donde se puede, traer de Dataverse **solo** lo que hace falta, escribir en paralelo sin corromper nada y saber **cuándo el problema no se arregla en el flujo**. La regla de este lab: **sin una medida antes y otra después, no hay mejora, hay una opinión.**

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). El flujo que prepara el cierre mensual de Compras tardaba segundos con las pruebas del curso. Con el volumen real, **2.000 solicitudes** del año, tarda tanto que a veces no termina antes de que alguien lo reinicie. Te piden que lo dejes en un tiempo razonable **sin cambiar el resultado**: las cifras del cierre deben ser **las mismas**.

## Lo que vas a construir

- Un flujo `SC - Medir` con un cronómetro propio (inicio, fin y diferencia) y una **línea base** con un bucle sobre las 2.000 filas
- La misma cuenta **sin bucle**, con **Filter array** y `length`
- Una carga de la tabla `Volumen` en Dataverse, en serie y en paralelo, con su medida
- Lecturas de `Volumen` con distintos **umbrales de paginación**, columnas y filtros en el servidor, con su medida
- Una **tabla antes y después** y una decisión sobre qué se arregla en el flujo y qué no

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| Select, Filter array y variables (Lab 130) | Cuándo **sustituyen** a un bucle | Lab 139 (reto) |
| Concurrencia con retardos (Lab 133) | Concurrencia con **escrituras reales** | Lab 137 (límites) |
| Paginación (Labs 132 y 134) | **Umbral** y tamaño de lo que traes | — |

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Medir (línea base) | 40 min |
| Ejercicio 2 — Sustituir el bucle | 35 min |
| Ejercicio 3 — Cargar 2.000 filas | 50 min |
| Ejercicio 4 — Leer con paginación | 40 min |
| Ejercicio 5 — Traer menos | 30 min |
| Ejercicio 6 — Lotes y límites | 20 min |
| Ejercicio 7 — Tabla antes y después | 25 min |
| **Total** | **unas 4 h** |

## Nivel

**N3 Avanzado** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: **Apply to each**, **Filter array**, **Select**, **Compose**, **Initialize variable**, **Increment variable**, **Settings** > **Concurrency control** y **Pagination**
- Dataverse: **List rows** (**Select columns**, **Filter rows**, **Row count**), **Add a new row**
- Expresiones: `utcNow`, `dateDifference`, `ticks`, `length`, `int`, `float`, `item`, `range`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras` y el paquete [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip) extraído: carpeta `volumen/` (`solicitudes-volumen.csv` y `.xlsx`, 2.000 filas)
- [ ] **Excel en OneDrive for Business o SharePoint** (como en el Lab 130): el flujo lee `solicitudes-volumen.xlsx`. Power Automate no tiene una acción para leer un `.csv` sin pasos adicionales que este lab no cubre. Sin Excel, puedes cargar `Volumen SIT` con la importación de datos de Dataverse (Excel o CSV) y hacer los Ejercicios 1, 2, 4 y 5 leyendo de Dataverse, pero el Ejercicio 3 (carga) necesita el Excel
- [ ] Una tabla de Dataverse `Volumen SIT` (la creas en el Ejercicio 3; no la confundas con la tabla de Excel, que se llama `Volumen`) y el hábito de **apagar** cada flujo de medida al terminar: los bucles largos gastan solicitudes (Lab 137)

### Cifras de partida

Con los archivos del curso, estas son las **cifras del cierre**. Deben salirte iguales **antes y después** de cada mejora:

| Cifra | Valor |
|---|---|
| Filas | **2.000** |
| Aprobadas / Rechazadas / Pendientes | **1.802** / 117 / 81 |
| Importe de las aprobadas | **8.915.581,71** |
| Aprobadas con importe mayor de 5.000 | **893** |
| Con las **primeras 500 filas**: aprobadas / importe / mayores de 5.000 | **451** / 2.221.870,33 / 222 |

### Antes de empezar: tu prueba es perfil Low

**Comprobado en Learn (2026-11-21):** el perfil de rendimiento decide los límites de solicitudes y de elementos; **todas las licencias de prueba son perfil Low** ([Learn: límites y configuración](https://learn.microsoft.com/power-automate/limits-and-config)). Low admite unas **10.000 solicitudes por 24 horas** (cifra aproximada, no una garantía) y **5.000 elementos** por **Apply to each**. Cada acción es una solicitud, y una acción **dentro de un bucle genera una solicitud por elemento** ([Learn: límites de las solicitudes](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/understand-limits)). Con 2.000 filas, el bucle del Ejercicio 1 gasta unas **5.600 acciones** por corrida (2.000 condiciones y 3.604 si se cuentan los dos incrementos de las 1.802 aprobadas): dos corridas suman unas **11.200**, **más** que el límite diario. Por eso, en una prueba: **haz el Ejercicio 1 con las primeras 500 filas** (unas **1.400** acciones por corrida) y reparte los ejercicios en dos días. **Presupuesto orientativo** (acciones): Ej. 1, 2 × 1.400 = 2.800; Ej. 2, unas 20; Ej. 3, 200 + 200 + 1.600 escrituras = 2.000 más lecturas; Ej. 4 y 5, unas 40. Total de un día: unas **5.000**; no repitas cargas.

> **Una aclaración sobre el perfil:** Learn asigna el perfil **Medium** a los flujos **manuales** y el perfil del **propietario** a los demás; las licencias de prueba son Low. Tus flujos de medida son instantáneos, así que pueden caer en Medium. **Trabaja con los límites de Low por prudencia** y comprueba en tu ambiente cuál se aplica.

### Verificación rápida antes de empezar

- [ ] Abre `solicitudes-volumen.xlsx` en Excel: 2.000 filas en la tabla `Volumen` con `SolicitudID`, `Fecha`, `Categoria`, `Importe` y `Estado`
- [ ] Filtra la columna `Estado` por `Aprobada` y mira el recuento: **1.802**

---

## Ejercicio 1 — Medir (línea base)

**Objetivo:** tener un número **antes** de tocar nada.

1. En la solución: flujo instantáneo `SC - Medir`. Primera acción, **Compose** `Inicio` con `utcNow()`.
2. Lee los datos: sube `solicitudes-volumen.xlsx` a OneDrive o SharePoint y usa **List rows present in a table** (tabla `Volumen`) con **Top Count** `500` (una prueba) o con **Pagination** activada y **Threshold** `2000` (las 2.000). **Cuenta siempre lo leído** con una **Compose** `length(...)`: el conector de Excel devuelve por defecto un número limitado de filas (se suele citar 256, *sin verificar en Learn*) y sin paginación **lees solo una parte sin ningún error**. Con 500 filas pide también la paginación (umbral `500`).
3. **Initialize variable** `Aprobadas` (**Integer**, `0`) y `Importe` (**Float**, `0`).
4. **Apply to each** sobre las filas. Dentro, una **Condition**: `Estado` es igual a `Aprobada`. En **True**: **Increment variable** `Aprobadas` en `1` e **Increment variable** `Importe` en el importe de la fila (con **fx**, `float(item()?['<columna importe>'])`).
5. Al final, **Compose** `Fin` con `utcNow()` y **Compose** `Intervalo` con `dateDifference(outputs('Inicio'), outputs('Fin'))` (devuelve un **intervalo de tiempo** del tipo `hh:mm:ss.fffffff`, con días delante si dura más de un día; no son segundos sueltos: léelo y conviértelo tú).
6. Ejecuta y anota: `Aprobadas`, `Importe` y el tiempo, **dos veces** (con 500 filas en una prueba; con las 2.000 solo si tu licencia no es de prueba).

### Resultado esperado del Ejercicio 1

Con 500 filas, `Aprobadas` = **451** e `Importe` = **2.221.870,33**; con 2.000, **1.802** y **8.915.581,71** (puede salirte `8915581.710000003` por la coma flotante: redondea al mostrarlo). El **tiempo** es **tu línea base**: no hay un valor correcto, hay **el tuyo**. Anota también cuántas **acciones** se ejecutaron (el historial las muestra) y la **duración** que registra el historial: no coinciden exactamente con tu cronómetro, y la diferencia ya es un dato.

> **Por qué dos veces:** el tiempo de un flujo cambia con la hora y la carga de la plataforma. Una sola medida no sirve para comparar. Anota la menor y la mayor.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| `Aprobadas` / `Importe` | ___ / ___ (esperado: 451 / 2.221.870,33 con 500 filas; 1.802 / 8.915.581,71 con 2.000) |
| Tiempo medido (corrida 1 y 2) | ___ / ___ |
| Acciones ejecutadas | ___ |

---

## Ejercicio 2 — Sustituir el bucle

**Objetivo:** contar y filtrar sin recorrer fila a fila.

1. Duplica `SC - Medir` como `SC - Medir (sin bucle)`.
2. Quita el **Apply to each**. En su lugar, **Filter array** `Solo aprobadas`: **From** las filas; condición `Estado` es igual a `Aprobada`.
3. **Compose** `Aprobadas` con `length(body('Solo_aprobadas'))`.
4. **Filter array** `Aprobadas grandes` sobre `Solo aprobadas`: `Importe` mayor que `5000` (con **fx**, `float(item()?['<columna importe>'])`). **Compose** `Grandes` con `length(...)`.
5. Mide como en el Ejercicio 1 (dos corridas) y anota el número de acciones.

### Resultado esperado del Ejercicio 2

`Aprobadas` = **1.802** y `Grandes` = **893** (con 500 filas: **451** y **222**). El número de **acciones** baja de miles a unas pocas, y el tiempo **debería** bajar mucho; **mide el tuyo**. Esto es lo que recomienda Learn: usar **Select** y **Filter array** en lugar de bucles cuando solo estás transformando datos y no actuando sobre cada elemento.

> **Lo que no puedes hacer sin bucle:** **sumar**. El lenguaje de expresiones no trae una función de suma de un arreglo (`add` suma dos números). Para el **importe total** tienes cuatro caminos: un bucle como el del Ejercicio 1 (pero solo sobre las filas que importan y sin condiciones por fila), un cálculo en el origen (una columna acumulada o de resumen en Dataverse), una herramienta de datos (Excel, Power BI) o una FetchXML con agregado, que el conector no admite (Lab 132). **Escribe cuál eliges para SIT y por qué.** *Sin verificar en el tenant:* sumar con `xpath` sobre un XML construido de la lista; es un truco conocido en foros, **no** está documentado por Microsoft: pruébalo solo como curiosidad.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| `Aprobadas` / `Grandes` | ___ / ___ (esperado: 1.802 / 893 con 2.000 filas; 451 / 222 con 500) |
| Tiempo y acciones frente al Ejercicio 1 | ___ |
| Cómo calcularías el importe total sin la condición por fila | ___ |

---

## Ejercicio 3 — Cargar 2.000 filas

**Objetivo:** escribir muchas filas en Dataverse y medir qué cambia la concurrencia.

1. Crea la tabla `Volumen SIT`. Usa `ID de solicitud` como **columna principal** (la que Dataverse crea sola; renómbrala). Añade `Fecha` (fecha), `Categoría` (texto), `Importe` (decimal con 2 posiciones) y `Estado de la solicitud` (texto; no lo llames `Estado`, que se confunde con las columnas de sistema). Crea la **clave alternativa** sobre `ID de solicitud` y **espera a que quede Active** (tarda unos minutos, Lab 132) antes de cargar. Anota los **nombres lógicos** de las columnas (en la definición de cada columna, **Schema name** o **Logical name**, con el prefijo de tu publicador): los necesitas en el Ejercicio 5.
2. Flujo `SC - Cargar volumen` con el mismo cronómetro. Lee las filas **1 a 200** del Excel (**Top Count** `200`, o paginación con umbral `200`) y recorre con **Apply to each** (concurrencia **desactivada**): **Add a new row** con los datos de cada fila.
3. Mide. **No borres nada** y no repitas las mismas filas (chocarían con la clave alternativa).
4. Cambia el flujo para leer las filas **201 a 400** (**Skip Count** `200`, **Top Count** `200`). En el **Apply to each**, **Settings** > **Concurrency control** **On**, **Degree of Parallelism** `20` (admite de 1 a 50; por defecto el bucle es secuencial). Mide. (Dos bloques de filas **distintas** con el mismo tamaño: la comparación es justa porque la escritura de cada fila cuesta lo mismo.)
5. Con el grado que mejor te funcionó, carga las filas **401 a 2.000** (**Skip Count** `400`, paginación con umbral `2000`). Cuenta con `length` lo que leíste del Excel antes de escribir.

### Resultado esperado del Ejercicio 3

`Volumen SIT` termina con **2.000** filas (**1.802** `Aprobada`). La carga en paralelo es **claramente más rápida** que en serie; **cuánto** depende de tu ambiente. Anota si apareció algún error de **límite de solicitudes (429)** y qué grado lo provocó.

> **Lo que dice Learn:** un grado alto (por ejemplo, 50) no hace necesariamente más rápido el flujo; su guía lo ilustra con un bucle de 4 elementos que tarda 21 s en serie, 11 s con grado 2 y 6 s con grados 4 y 6 ([Learn: ejecución en paralelo](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/implement-parallel-execution)). La concurrencia solo vale en el bucle de **nivel superior**: en bucles anidados, los internos se ejecutan en serie. Y el conector de Dataverse admite unas **6.000 llamadas por conexión cada 300 segundos** ([Learn: conector de Dataverse](https://learn.microsoft.com/connectors/commondataserviceforapps/)).

> **Aviso:** subir el grado no es gratis. Cada fila escrita es una solicitud más (Lab 137) y puedes toparte con los límites de la plataforma o del conector. Más paralelismo no es siempre mejor: sube **de a poco** y mide.

> **Dos defensas:** con concurrencia, la clave alternativa protege de duplicar si algo se reintenta (Lab 133), pero **no** protege de un acumulador compartido. En esta carga no hay variables compartidas dentro del bucle: no las añadas. (Learn exceptúa explícitamente **Increment variable** y **Decrement variable** del riesgo de los bucles en paralelo; con **Set variable** sí hay riesgo. En una prueba real con 40 elementos, el total salió correcto con y sin concurrencia, como en el Lab 130: no es una garantía.)

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Tiempo de 200 filas en serie / con grado 20 | ___ / ___ |
| Grado con el que cargaste las 2.000 y su tiempo | ___ |
| Filas en `Volumen SIT` | ___ (esperado: 2.000) |
| ¿Hubo errores 429? A qué grado | ___ |

---

## Ejercicio 4 — Leer con paginación

**Objetivo:** entender qué hace la paginación de **List rows** y dónde empieza a importar.

**Comprobado en Learn (2026-11-21):** sin paginación, **List rows** devuelve como máximo **5.000 filas** (el límite de página por defecto). Con **Pagination** activada, el **Threshold** admite hasta **100.000** (hasta 5.000 en perfil Low, según la página de límites) y Learn aclara que el número se **redondea por múltiplos del tamaño de página**: con páginas de 5.000, un umbral de 7.000 devuelve hasta 10.000 filas ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)). **Row count** es el número de filas que le pides a Dataverse.

1. Flujo `SC - Leer volumen` con el cronómetro. **List rows** sobre `Volumen SIT` **sin** paginación y **sin** Row count. **Compose** `length(outputs('List_rows')?['body/value'])`.
2. Añade una **segunda** **List rows** (`List rows 2`) con **Row count** `500` y un `length` que apunte a ella.
3. Añade una **tercera** (`List rows 3`) con **Pagination** activada (**Settings** > **Networking**) y **Threshold** `1000`, sin Row count, y su `length`.
4. Anota filas devueltas y tiempo de cada una (el historial muestra la duración de cada acción).

### Resultado esperado del Ejercicio 4

Con 2.000 filas, el caso 1 devuelve **2.000** (cabe en el límite de 5.000); el caso 2, **500**; el caso 3, **2.000** (el umbral de 1.000 se redondea a una página de 5.000). **Tu tabla de 2.000 filas no deja ver el problema real**: con **más de 5.000** filas, un flujo sin paginación **lee solo las primeras 5.000 sin dar ningún error** (Lab 132, Ejercicio 7). Si quieres verlo, repite la carga del Ejercicio 3 hasta pasar de 5.000 filas (el tope de paginación depende del perfil: según Learn, 5.000 en Low y 100.000 en los demás).

> **Row count y el servidor:** pedir 500 filas es más rápido que pedir 2.000 y descartar 1.500. Si solo necesitas una muestra, pídela así. Si necesitas **todas**, activa la paginación y no pongas Row count.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Filas y tiempo: sin nada / Row count 500 / umbral 1.000 | ___ / ___ / ___ (esperado: 2.000 / 500 / 2.000) |
| Cuántas filas leería tu flujo sin paginación con 12.000 filas en la tabla | ___ (esperado: 5.000, sin error) |
| ¿Qué umbral máximo admite tu perfil? Dónde lo viste | ___ |

---

## Ejercicio 5 — Traer menos

**Objetivo:** que el servidor haga el trabajo antes de que los datos lleguen al flujo.

Compara **dos versiones sobre Dataverse** (`Volumen SIT`):

- **Versión A (cliente):** **List rows** sin **Filter rows** ni **Select columns**, paginación activada con umbral `2000`; después **Filter array** con `Estado` = `Aprobada` y `Importe` > `5000` (con los nombres lógicos de tus columnas).
- **Versión B (servidor):** **List rows** con **Filter rows** `<estado> eq 'Aprobada' and <importe> gt 5000` y **Select columns** solo con el ID y el importe (los **nombres lógicos** de tus columnas, separados por comas; `<estado>` e `<importe>` llevan el prefijo de tu publicador, por ejemplo `sit_estadodelasolicitud`), paginación activada con umbral `2000`.

1. Construye las dos en el mismo flujo `SC - Comparar lecturas`, cada una con su cronómetro y su `length`.
2. Ejecuta y anota las dos duraciones y el tamaño de la salida de cada **List rows** en el historial.

### Resultado esperado del Ejercicio 5

Las dos dan **893**. La versión B (con **Filter rows** y **Select columns** trae menos filas y menos columnas por la red, así que **debería** ser más rápida; **mide** la tuya). Mira en el historial el **tamaño** de la salida de **List rows** de cada versión.

> **Regla:** lo que se puede filtrar en el origen (**Filter rows**, **Select columns**) se filtra **ahí**. **Filter array** es para lo que el origen no puede filtrar.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Filas devueltas por la versión A y la B (tras el filtro) | ___ / ___ (esperado: 893 y 893) |
| Tiempo de cada versión | ___ / ___ |
| Tamaño de la salida de **List rows** (ambas) | ___ / ___ |

---

## Ejercicio 6 — Lotes y límites

**Objetivo:** saber qué existe cuando 2.000 escrituras una por una siguen siendo lentas.

**Comprobado en Learn (2026-11-21):** ([Learn: set de cambios](https://learn.microsoft.com/power-automate/dataverse/change-set))

- **Perform a changeset request** (acción de Dataverse) agrupa operaciones **Add a new row**, **Update a row** y **Delete a row** en una unidad **atómica**: si una falla, se deshacen las completadas.
- **No** admite un **Apply to each** dentro, **no** puedes usar la salida de una acción anterior del propio conjunto, y las acciones se ejecutan **todas a la vez**. Learn no da un límite de operaciones por conjunto.
- Learn no documenta una acción de **"batch"** distinta en el conector de Dataverse.

Responde por escrito:

1. ¿Sirve el conjunto de cambios para cargar 2.000 filas? (Pista: ¿puedes construir 2.000 acciones dinámicas dentro, sin bucle?) ¿Para qué **sí** sirve?
2. ¿Cuántas solicitudes consume tu carga del Ejercicio 3? (Learn: una acción en un bucle genera una solicitud por elemento; los reintentos y la paginación también cuentan.) ¿Cuántas te quedan del límite de 24 horas de tu perfil?
3. ¿Qué otras opciones hay **fuera** del flujo para cargar datos (importar desde Excel o CSV, Dataflows) y cuándo conviene cada una?
4. **Perfiles:** Learn lista cuatro (**Low**, **Medium**, **High** y **Unlimited Extended**). Un flujo **manual** o un flujo **secundario** cae en **Medium**; el perfil de un flujo es el de su **propietario**, y si el propietario se va, el flujo vuelve a **Low** ([Learn: límites y configuración](https://learn.microsoft.com/power-automate/limits-and-config)). Explica qué pasaría con el flujo de cierre si su propietario cambiara de empresa.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Para qué sirve el conjunto de cambios y por qué no para la carga masiva | ___ |
| Solicitudes de tu carga de 2.000 filas y qué fracción del límite diario | ___ |
| Cuándo **no** usarías un flujo para cargar | ___ |
| Qué le pasa al flujo del cierre si su propietario se va | ___ |

---

## Ejercicio 7 — Tabla antes y después

**Objetivo:** convertir tus medidas en una decisión.

Completa con **tus** números:

| Cambio | Antes | Después | ¿Mejora real? | Riesgo |
|---|---|---|---|---|
| Bucle con condición → **Filter array** (Ej. 2) | ___ s / ___ acciones | ___ s / ___ acciones | ___ | Pierde la suma |
| Escritura en serie → grado 20 (Ej. 3) | ___ s | ___ s | ___ | Límites 429 |
| Umbral de paginación (Ej. 4) | ___ filas | ___ filas | ___ | Tiempo y memoria |
| Filtro en servidor (Ej. 5) | ___ s | ___ s | ___ | Nombres de columna |

Después responde:

1. De los cuatro cambios, ¿cuál darías por **obligatorio** y cuál por **opcional**? Justifica con tus números.
2. SIT pasa de 2.000 a **50.000** solicitudes al año. ¿Qué cambio dejaría de bastar primero y qué harías?
3. Escribe la **regla de medición** que dejarías en el equipo (qué se mide, cuántas veces y dónde se anota).

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El total no coincide tras la mejora | Se perdió una fila (paginación) o se sumó con concurrencia | Comparar `length` y cifras con la línea base |
| `Importe` sale con decimales raros | Coma flotante | Redondear al mostrar; `formatNumber(x, '0.00')` |
| **List rows** trae menos filas de las esperadas | Hay más de 5.000 filas y no está activada **Pagination**, o hay un **Row count** | Activar **Pagination** y quitar el **Row count** |
| El grado de paralelismo da 429 | Demasiadas solicitudes a la vez | Bajar el grado y medir |
| `float()` falla con un valor vacío | La columna viene `null` | `coalesce(item()?['importe'], 0)` antes de `float` |
| Mi mejora "no mejora" | No hay línea base o el cambio no estaba en el camino lento | Medir cada paso (duración por acción en el historial) |
| Mejoré lo equivocado | Optimicé el bucle y el tiempo está en la llamada externa | Mirar qué acción tarda más |

## 🔧 Diagnóstico y reparación

### "El flujo del cierre ya no termina"

1. **Mira cuánto tarda** cada acción en el historial: ¿es el bucle, una lectura o una llamada externa?
2. **Cuenta** las filas que procesa: ¿creció el volumen desde la última vez?
3. **Comprueba** si hay paginación y si la tabla supera las 5.000 filas: ¿lee todo o solo una parte?
4. **Aplica** un solo cambio, **mide** y repite. Dos cambios a la vez no te dicen cuál sirvió.
5. **Decide** si el problema se resuelve en el flujo o en el origen (Ejercicio 2, sumas).

## Checklist final

- [ ] Línea base medida dos veces (Ejercicio 1) con cifras del cierre correctas (451 y 2.221.870,33 con 500 filas)
- [ ] El conteo sin bucle da 1.802 y 893 (Ejercicio 2)
- [ ] `Volumen` con 2.000 filas y la carga medida en serie y en paralelo
- [ ] Tres lecturas de `Volumen` medidas (sin nada, con Row count y con umbral)
- [ ] Lectura con filtro en servidor igual a la del cliente (893)
- [ ] Tabla antes y después completa con una decisión

## Evidencia esperada

- Captura del cronómetro y de la duración en el historial de las medidas base
- Captura del conteo de `Volumen` (2.000) y de las tres lecturas del Ejercicio 4
- La tabla del Ejercicio 7 con tus números
- Tus respuestas de validación

## Criterios de aprobación

- Cada mejora tiene su **antes** y su **después** medidos, no estimados
- Las cifras del cierre **no cambian** con ninguna mejora
- Explicas qué no se puede arreglar con un cambio de flujo (las sumas, el origen)
- Distingues filtrar en el servidor de filtrar en el flujo

## Competencias desarrolladas

- Medir el tiempo y el número de acciones de un flujo
- Sustituir bucles por operaciones de datos cuando es posible
- Escribir y leer en volumen con concurrencia y paginación
- Reducir los datos que viajan (columnas y filtros en el origen)
- Decidir con medidas qué optimizar y qué no

## Reto adicional

**Reto básico:** vuelve a medir el Ejercicio 1 a otra hora del día y anota si cambia.

**Reto intermedio:** calcula el importe total **por categoría** de las aprobadas sin Condition por fila (un **Filter array** por categoría y un bucle mínimo para sumar) y compara con `importeAprobadoPorCategoria` del archivo `cifras-esperadas.json`.

**Reto avanzado:** carga **20 filas** con **Perform a changeset request** (las operaciones escritas a mano, sin bucle), provoca que una falle a propósito (un valor repetido en la clave alternativa) y comprueba que las otras **no** se guardan.

## Preguntas de repaso

1. ¿Por qué se mide dos veces y se anota el número de acciones además del tiempo?
2. ¿Qué no se puede hacer con **Filter array** y qué alternativas hay?
3. ¿Qué riesgo tiene subir el grado de paralelismo de un bucle que escribe?
4. ¿Por qué una lectura sin paginación puede dar una cifra incorrecta sin ningún error?
5. ¿Cuándo el cuello de botella no está en el flujo?

## Limpieza del laboratorio

**Apaga** `SC - Medir`, `SC - Medir (sin bucle)`, `SC - Cargar volumen` y `SC - Leer volumen`. Conserva la tabla `Volumen` si quieres repetir las medidas; si no, bórrala (2.000 filas ocupan capacidad del ambiente).

## Siguiente laboratorio recomendado

**Lab 139 — Reto Pro sin pasos**: el alta de proveedores de SIT, de punta a punta, con rúbrica.
