---
moduleId: 26
title: "Performance y Optimización"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 22
practiceMinutes: 150
slug: "performance-y-optimizacion"
lastVerified: "2026-11"
---
*Lectura: 20 min · Con práctica: unos 150 min, mejor en dos sesiones (la primera hasta la Microlección 2; la segunda, de la 3 al final). La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Diagnosticar y resolver problemas de rendimiento en Canvas Apps, Power Automate, Dataverse y reportes Power BI usando herramientas nativas y mejores prácticas de optimización. La regla del módulo es **medir, cambiar una cosa y volver a medir**: cada optimización que hagas en tu tenant tiene que dejar un número antes y otro después.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica en tu ambiente con **evidencia** (el dato exacto que mediste). En la Microlección 4 diagnosticarás, a partir del síntoma, un flujo que se volvió rápido y empezó a dar resultados equivocados; al final harás un reto de construcción sin pasos y un reto de transferencia con otro cliente.
>
> **Antes de empezar, necesitas:**
> - La app canvas del [Lab 03](/labs/lab-03-canvas-primera-app) (`scrInicio` con `txtBusqueda`, `drpEstado` y `galSolicitudes` sobre la tabla `Solicitudes TI`), en tu ambiente DEV.
> - Rol **Environment Maker** o **System Administrator** en ese ambiente: Live monitor lo exige.
> - Para la parte opcional de Power BI, el informe del [Lab 06](/labs/lab-06-power-bi-reporte-solicitudes) en Power BI Desktop.
> - Una advertencia honesta: tu tabla tiene pocas filas, así que muchas diferencias serán de milisegundos. Lo que vas a practicar es **dónde mirar** y **cómo provocar** el problema (por ejemplo, bajando el límite de filas a 1), que es lo mismo que harás en un cliente con millones de filas.

### 📖 Conceptos Clave
Un mapa rápido; cada pieza se practica en su microlección.

- **Live monitor (Canvas Apps):** registra cada evento de la app mientras la usas: llamadas a datos, fórmulas, errores. Columnas útiles: **Time**, **Category**, **Operation**, **Result**, **Status**, **Duration**, **Data Source**, **Control**, **Property** y **Response size**; al seleccionar una fila, las pestañas **Details**, **Formula**, **Request** y **Response** muestran el detalle. Se abre desde Power Apps Studio con **Advanced tools** > **Open live monitor**, o para la app publicada desde **Apps** > la app > el menú junto a **Details** > **Live monitor** > **Play published app** ([Learn: Live monitor en canvas apps](https://learn.microsoft.com/power-apps/maker/monitor-canvasapps)).
- **Delegación en Canvas Apps:** una fórmula delegable se ejecuta en el origen (Dataverse, SharePoint) y solo baja las filas necesarias. Para Dataverse son delegables, entre otras, `Filter`, `Search`, `LookUp`, `First`, `Sort`, `StartsWith` y `EndsWith`; **no** lo son `Len`, `Left`, `Mid`, `Distinct`, `FirstN`, `Last`, ni `Collect`/`ClearCollect` ([Learn: delegación](https://learn.microsoft.com/power-apps/maker/canvas-apps/delegation-overview)).
- **Límite de delegación:** número máximo de registros que Power Apps descarga del servidor cuando una fórmula no es delegable. El default es 500, configurable hasta 10.000 en **Settings** → **General** → **Data row limit** ([Microsoft Learn: delegación en canvas apps](https://learn.microsoft.com/power-apps/maker/canvas-apps/delegation-overview#changing-the-limit)). Si la tabla tiene 50,000 registros y la fórmula no es delegable, el usuario solo verá los primeros 500 (o los que permita el límite configurado, como máximo 10.000) — y la app no le muestra ningún aviso. La advertencia de delegación (triángulo amarillo y subrayado azul) solo la ve el desarrollador en Power Apps Studio, junto a la fórmula, mientras la escribe; viene activada por defecto. Learn sugiere bajar el límite a 1 para probar qué fórmulas no delegan.
- **Carga inicial: `Concurrent()`, `App.Formulas` y `App.OnStart`:** `Concurrent()` lanza varias fórmulas a la vez (solo en fórmulas de comportamiento) y las fórmulas que contiene no pueden depender unas de otras: Power Apps muestra un error si lo intentas ([Learn: Concurrent](https://learn.microsoft.com/power-platform/power-fx/reference/function-concurrent)). Las **named formulas** de `App.Formulas` siempre están al día, se calculan cuando hacen falta (cálculo diferido) y no admiten funciones de comportamiento. Learn advierte que `App.OnStart` puede causar problemas de rendimiento y recomienda preferir `App.Formulas` y `App.StartScreen` ([Learn: objeto App](https://learn.microsoft.com/power-platform/power-fx/reference/object-app)).
- **`ClearCollect` y colecciones:** `Collect`, `Clear` y `ClearCollect` solo se pueden usar en fórmulas de comportamiento (como `OnSelect`), y no son delegables: sobre una tabla grande solo traen la primera porción ([Learn: ClearCollect](https://learn.microsoft.com/power-platform/power-fx/reference/function-clear-collect-clearcollect)). Por eso "cargar todo en una colección al inicio" es una optimización falsa con muchos datos.
- **Concurrency en Apply to each:** **Apply to each** corre secuencial por defecto; con el control de concurrencia, el grado de paralelismo va de 1 a 50. Learn advierte que un número alto no siempre es más rápido (hay sobrecarga y límites del destino) y que en bucles anidados el interno siempre es secuencial ([Learn: paralelismo y concurrencia](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/implement-parallel-execution)). Con concurrencia, las variables dentro del bucle dejan de ser fiables: Learn indica que el bucle debe ser secuencial si usas variables y que `Set variable` en bucles paralelos puede dar resultados inesperados ([Learn: variables](https://learn.microsoft.com/power-automate/create-variable-store-values)).
- **Menos llamadas a Dataverse:** en **List rows**, **Select columns** limita las columnas devueltas, **Filter rows** filtra en el servidor, **Expand Query** trae datos de tablas relacionadas, y **Fetch Xml Query** admite una consulta FetchXML con `<link-entity>` (sin consultas de agregación); sin paginación, el límite es de 5.000 filas ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)). Un `<link-entity>` hace en una llamada lo que el patrón N+1 hace en 1 + N llamadas.
- **Changeset de Dataverse:** la acción **Perform a changeset request** agrupa acciones **Add a new row**, **Update a row** y **Delete a row** en una transacción: si una falla, se deshacen todas. Dentro no se puede poner un **Apply to each** ni usar la salida de una acción del mismo changeset ([Learn: changeset](https://learn.microsoft.com/power-automate/dataverse/change-set)). Es una herramienta de **consistencia**, no un "acelerador" de cargas masivas.
- **Columnas "Searchable" ≠ índices:** la propiedad **Searchable** de una columna decide si aparece en la búsqueda avanzada y si se puede usar en vistas ([Learn: columnas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal)); no crea un índice de base de datos. Para consultas lentas, empieza por filtrar en el servidor, pedir solo las columnas necesarias y evitar el N+1.
- **Plugin Trace Log:** guarda lo que los plugins escriben con `ITracingService.Trace()` (Módulo 23). Se activa en **Settings** > **Administration** > **System Settings** > pestaña **Customization** > **Enable logging to plug-in trace log** (**Off**, **Exception** o **All**) y se consulta en **Settings** > **Plug-in Trace Log**. Learn recomienda activarlo **solo mientras depuras**; los registros se borran a las 24 horas ([Learn: tracing](https://learn.microsoft.com/power-apps/developer/data-platform/logging-tracing)).
- **Power BI Import vs DirectQuery:** Import carga los datos en el modelo: consultas muy rápidas, pero los datos son los de la última actualización. DirectQuery consulta el origen en cada interacción: datos actuales, pero cada clic puede tardar si la consulta es compleja o el origen es lento.
- **Aggregations en Power BI:** una tabla resumida (recomendado en Import) que Power BI usa en lugar de la tabla de detalle, que debe estar en **DirectQuery**. Se configuran en el panel **Data**, con clic derecho sobre la tabla de agregación > **Manage aggregations** ([Learn: aggregations](https://learn.microsoft.com/power-bi/transform-model/aggregations-advanced)). **Performance analyzer** (cinta **Optimize**) mide cuánto tarda cada visual, separado en **DAX query**, **Direct query**, **Visual display** y **Other** ([Learn: Performance analyzer](https://learn.microsoft.com/power-bi/create-reports/desktop-performance-analyzer)).

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Medir antes de optimizar (Live monitor)

**¿Qué vas a aprender?** A encontrar qué llamada concreta hace lenta una pantalla, en vez de adivinar.

**¿Por qué existe esto?** "La app va lenta" no se arregla: se arregla "la llamada `getRows` a `Solicitudes TI` desde `galSolicitudes.Items` tarda 4 segundos y devuelve 2 MB". Sin ese dato acabas optimizando lo que no era.

**Ahora haz algo — micropráctica (6 min):** → **[Decidir: qué optimizar leyendo el Live monitor](/practica/ip-trb-013-leer-live-monitor)**

**Práctica real en tu tenant (25 min):**
1. Abre la app del Lab 03 en Power Apps Studio. Selecciona **Advanced tools** > **Open live monitor**. Se abre una pestaña nueva del navegador conectada a tu sesión de Studio.
2. Vuelve a Studio y juega la app (**Preview**, o mantén **Alt** mientras haces clic): escribe un texto en `txtBusqueda`, elige un estado en `drpEstado` y entra en el detalle de una solicitud.
3. En Live monitor, ordena por **Duration** de mayor a menor. Selecciona la fila más lenta que tenga **Data Source** `Solicitudes TI` y mira **Control**, **Property** y **Response size**; en la pestaña **Request** verás la consulta que se envió.

   **Qué deberías ver:** filas de categoría de red con operaciones como `getRows` asociadas a `galSolicitudes` (propiedad `Items`) y a `drpEstado`. **Si no ves filas nuevas:** comprueba que Live monitor dice que está conectado a tu sesión y repite el paso 2.
4. Busca si la consulta de `drpEstado` (`Distinct('Solicitudes TI', Estado)`) aparece con una advertencia o trae más datos de los que muestra. Haz una captura de la tabla ordenada por **Duration**: la necesitarás para comparar.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Operación más lenta (Operation + Control + Property) | |
| Su **Duration** y su **Response size** | |
| Número de llamadas a `Solicitudes TI` al escribir una sola palabra en `txtBusqueda` | |
| Qué cambiarías primero y por qué (una frase) | |

## 🧩 Microlección 2 — Delegación: el límite que el usuario no ve

**¿Qué vas a aprender?** A provocar a propósito el problema de delegación para ver qué fórmulas de tu app devolverían datos incompletos con una tabla grande.

**¿Por qué existe esto?** Con pocos registros, una fórmula no delegable "funciona". El día que la tabla supera el límite, el usuario ve datos incompletos sin ningún aviso. La única defensa es encontrarlo en Studio.

**Ahora haz algo — micropráctica (5 min):** → **[Conciencia de delegación](/practica/ip-app-003-delegation-awareness)**

**Práctica real en tu tenant (25 min):**
1. En Studio, **Settings** > **General** > **Data row limit**: anota el valor actual (por defecto 500) y cámbialo a **1**.
2. Agrega en `scrInicio`, de forma temporal, una galería `galPrueba` y una etiqueta `lblPrueba` con `Text`: `"Filas: " & CountRows(galPrueba.AllItems)`. Pon en `galPrueba.Items` la versión no delegable:

```js
// ❌ No delegable: Len se evalúa en el dispositivo sobre las filas ya descargadas (como máximo, el Data row limit)
Filter('Solicitudes TI', Len('Título de Solicitud') > 5)
```

   **Qué deberías ver:** la advertencia de delegación junto a la fórmula y, con el límite en 1, `Filas: 1` como mucho, aunque tengas más solicitudes con títulos largos.
3. Cámbiala por una versión delegable (usa como texto la primera letra de algunos de tus títulos):

```js
// ✅ Delegable a Dataverse: StartsWith se resuelve en el servidor
Filter('Solicitudes TI', StartsWith('Título de Solicitud', "S"))
```

   **Qué deberías ver:** sin advertencia, y todas las solicitudes que empiezan por esa letra aunque el límite siga en 1.
4. Abre `drpEstado`: con el límite en 1, ¿cuántos estados ofrece? `Distinct` no es delegable, así que solo ve los estados de las filas descargadas.
5. Revisa `galSolicitudes.Items` (el `Search` dentro de `Filter` del Lab 03): ¿muestra advertencia? Anótalo.
6. **Vuelve a poner el Data row limit en el valor que anotaste** y borra `galPrueba` y `lblPrueba` (o déjalos para la Microlección 3).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Filas con `Len` y con `StartsWith`, ambas con el límite en 1 | |
| Estados que ofrecía `drpEstado` con el límite en 1 y con el valor normal | |
| ¿`galSolicitudes.Items` mostró advertencia? | |
| Cómo resolverías el problema de `drpEstado` con miles de solicitudes (tu propuesta) | |

## 🧩 Microlección 3 — La carga inicial: secuencial, concurrente o diferida

**¿Qué vas a aprender?** A medir la diferencia entre cargar datos uno detrás de otro, a la vez con `Concurrent()`, o solo cuando hacen falta con una named formula.

**¿Por qué existe esto?** Es el caso real de este módulo: una app que tarda 45 segundos en abrir porque al arrancar carga todo, en serie. Learn usa exactamente esta prueba para enseñar `Concurrent()`.

**Práctica real en tu tenant (30 min):**
1. Agrega dos botones a `scrInicio`. En `btnSecuencial.OnSelect`:

```js
// Una petición detrás de otra
ClearCollect(colSolicitudes, 'Solicitudes TI');
ClearCollect(colCategorias, Categorías)
```

   y en `btnConcurrente.OnSelect`:

```js
// Las dos peticiones a la vez; ninguna usa el resultado de la otra
Concurrent(
    ClearCollect(colSolicitudes, 'Solicitudes TI'),
    ClearCollect(colCategorias, Categorías)
)
```

   (La advertencia de delegación de `ClearCollect` es esperable: aquí solo comparamos tiempos.)
2. Con Live monitor abierto, pulsa `btnSecuencial` (con **Alt** en Studio). Después **cierra y vuelve a abrir la app** (Learn lo indica para que la caché no falsee la segunda medición) y pulsa `btnConcurrente`.

   **Qué deberías ver:** en la columna **Time**, con `btnSecuencial` la segunda petición empieza cuando acaba la primera; con `btnConcurrente`, las dos empiezan casi a la vez. Con pocas filas, la diferencia total puede ser pequeña: anota la que veas.
3. Prueba la regla de dependencia: dentro de `Concurrent`, cambia la segunda fórmula por `Set(varTotal, CountRows(colSolicitudes))`. **Qué deberías ver:** un error en la fórmula, porque usa lo que carga la otra rama. Deshaz el cambio.
4. Carga diferida: en **Tree view**, selecciona **App** y en su propiedad **Formulas** escribe:

```js
// Named formula: se calcula cuando algo la usa y se mantiene al día
nfSolicitudesNuevas = Filter('Solicitudes TI', Estado = 'Estado (Solicitudes TI)'.Nueva);
```

   Pon `nfSolicitudesNuevas` en `galPrueba.Items` (si la borraste, créala de nuevo). Con Live monitor abierto, abre la app y fíjate en **cuándo** aparece la consulta de esa fórmula. Si tu app tiene algo en `App.OnStart`, mira si podría pasar a `App.Formulas`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Inicio (**Time**) de las dos peticiones con `btnSecuencial` | |
| Inicio de las dos peticiones con `btnConcurrente` | |
| Mensaje de error al hacer depender una rama de otra | |
| Cuándo apareció la consulta de `nfSolicitudesNuevas` | |

### 🏗️ Reto de construcción (sin pasos, tenant real)

> **Requerimiento:** el equipo de TI quiere que `scrInicio` abra lo más rápido posible y que ninguna fórmula de la pantalla deje de mostrar solicitudes cuando la tabla pase de 10.000 filas.
>
> **Criterios de aceptación:**
> - Con el **Data row limit** en 1, ninguna fórmula de `scrInicio` muestra advertencia de delegación ni devuelve datos incompletos (incluido `drpEstado`).
> - `scrInicio` no carga colecciones completas al arrancar: lo que necesite, lo lee con fórmulas delegables o con named formulas.
> - Tienes una medición de Live monitor **antes** y otra **después** (capturas) con el número de llamadas y la duración de la más lenta.
>
> **Restricciones:** no subas el Data row limit para "arreglarlo"; no cambies el modelo de datos del Lab 02. Al terminar, deja el Data row limit en su valor original.

**Evidencia del reto:**

| Campo | Antes | Después |
|---|---|---|
| Llamadas a datos al abrir `scrInicio` | | |
| Duración de la llamada más lenta | | |
| Fórmulas con advertencia de delegación | | |
| Cambio que hiciste en `drpEstado` | | |

## 🧩 Microlección 4 — El servidor también es lento: flujos y consultas

**¿Qué vas a aprender?** A acelerar un flujo con concurrencia sin romper su resultado, y a cambiar N+1 llamadas por una consulta.

**¿Por qué existe esto?** Muchos "la app va lenta" son en realidad un flujo que procesa 1.000 filas de una en una, o 1 consulta + 1.000 consultas más para traer un dato relacionado. Y la optimización más típica de un flujo, la concurrencia, tiene una trampa que no da error: da datos equivocados.

### 🔧 Diagnosticar — más rápido, pero con resultados mezclados

**Antes de tocar tu flujo, diagnostica (7 min):** → **[Diagnosticar: el flujo concurrente mezcla los datos](/practica/ip-trb-014-concurrencia-con-variables)**

**Práctica real en tu tenant (30 min):**
1. Crea un flujo instantáneo `SIT — Prueba concurrencia` (**Manually trigger a flow**) en tu solución.
2. Agrega **List rows** sobre `Solicitudes TI` con **Row count** `10`.
3. Agrega **Apply to each** sobre la lista de filas y, dentro, una acción **Delay** de 2 segundos (simula una llamada lenta a otro sistema).
4. Guarda, ejecuta y anota la duración en el historial de ejecuciones.
5. En la pestaña **Settings** de **Apply to each**, activa el control de concurrencia y pon el grado de paralelismo en `10`. Ejecuta de nuevo y anota la duración.

   **Qué deberías ver:** con 10 filas, unos 20 segundos o más en secuencial y muy poco más de 2 segundos en concurrente. **Si no baja:** comprueba que activaste la concurrencia en el **Apply to each** de primer nivel (en bucles anidados, el interno siempre es secuencial).
6. N+1 contra `<link-entity>`: la consulta de Learn para **Fetch Xml Query** trae cuentas con el nombre de su contacto principal en **una** llamada; el patrón N+1 sería **List rows** de cuentas y, dentro de un bucle, **Get a row by ID** del contacto de cada una. Si tu ambiente tiene cuentas con contacto principal (o creas dos), prueba esta consulta en una acción **List rows** de **Accounts** y cuenta las llamadas en el historial:

```xml
<fetch count="10">
  <entity name="account">
    <attribute name="name" />
    <link-entity name="contact" to="primarycontactid" from="contactid">
      <attribute name="fullname" />
    </link-entity>
  </entity>
</fetch>
```

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Duración del bucle en secuencial | |
| Duración con concurrencia 10 | |
| Qué pasaría si dentro del bucle usaras **Set variable** (tu respuesta tras el diagnóstico) | |
| Número de acciones ejecutadas con FetchXML frente a las que harías con N+1 (para 10 cuentas) | |

**Opcional — Power BI (20 min, si hiciste el Lab 06):** abre el informe en Power BI Desktop, ve a la cinta **Optimize** > **Performance analyzer** > **Start recording** > **Refresh visuals** y después **Stop**. Anota el visual más lento y en qué categoría se le va el tiempo (**DAX query**, **Visual display**, **Other**). Si fuera **DAX query**, revisa la medida; si fuera **Visual display**, el número de puntos o de visuales de la página.

## 🔁 Reto de transferencia — otro cliente, otro cuello de botella

**El nuevo caso:** una empresa de mantenimiento tiene una app canvas para 300 técnicos sobre una tabla de órdenes de trabajo con 80.000 filas, un flujo nocturno que actualiza 5.000 órdenes contra una API externa que admite pocas llamadas por segundo, y un dashboard de Power BI en DirectQuery de "órdenes por mes" que tarda 20 segundos en cada clic. Te dan una semana.

**Micropráctica (8 min):** → **[Transferir: priorizar optimizaciones en otro cliente](/practica/ip-trb-015-priorizar-optimizaciones)**

**Tu entrega (25 min, por escrito, sin tenant):** una tabla "Síntoma | Cómo lo mides | Hipótesis | Cambio | Cómo sabrás que funcionó" con una fila para la app, otra para el flujo y otra para el dashboard. Para el flujo, justifica el grado de paralelismo con el límite de la API (no con "más es más rápido"). Para el dashboard, decide entre Import, DirectQuery o una tabla de agregación, sabiendo que en Power BI las aggregations exigen la tabla de detalle en DirectQuery.

**Evidencia del reto:**

| Campo | Tu valor |
|---|---|
| Qué mides primero en la app y con qué herramienta | |
| Grado de paralelismo del flujo y de dónde sale ese número | |
| Decisión para el dashboard y su coste (frescura de datos, tamaño, mantenimiento) | |
| Qué **no** harías aunque parezca una optimización | |

### 💼 Caso Real de Negocio
**Empresa:** Retailer con Canvas App de 15 pantallas para 500 vendedores  
**Problema:** La app tardaba 45 segundos en cargar. Los vendedores la abandonaban antes de que cargara.  
**Solución:** App.OnStart con Concurrent() reducido de 8 tablas a 3 esenciales. Named Formulas lazy-load. Paginación en lugar de ClearCollect de todos los registros. Imágenes de productos optimizadas a WebP.  
**Resultado:** Tiempo de carga: de 45s a 6s. Adopción de la app: de 60% a 92%.

### ✅ Buenas Prácticas
- Usar Live monitor (**Advanced tools** > **Open live monitor** en Power Apps Studio) para medir tiempos de cada llamada, y conservar la medición de antes y la de después
- Paginación > ClearCollect de toda la tabla para datos > 1000 registros
- Nunca intentar ClearCollect dentro de Gallery.Items — `ClearCollect` solo se admite en fórmulas de comportamiento (como `OnSelect`); en `Items`, usa directamente una fórmula delegable sobre el origen o una named formula
- Probar la delegación con el **Data row limit** en 1 antes de publicar, y devolverlo después a su valor
- Preferir `App.Formulas` (named formulas) y `App.StartScreen` a cargar todo en `App.OnStart`; si algo tiene que cargarse al inicio, en `Concurrent()` y solo lo esencial
- En Dataverse: filtrar en el servidor, pedir solo las columnas necesarias (**Select columns**, `ColumnSet` en plugins) y evitar el patrón N+1 con `<link-entity>` o **Expand Query**. "Searchable" no es un índice
- En Power Automate: concurrencia solo en bucles sin variables y con un grado de paralelismo acorde al límite del sistema destino
- En Power BI: aplicar filtros en Power Query (source-side) antes de cargar al modelo — las filas eliminadas en el origen nunca ocupan memoria
- Plugin Trace Log en **All** solo mientras depuras; después, vuelve a **Off** o **Exception**

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Canvas App muestra solo 500 registros en el gallery | Función `Filter` con operador no delegable (e.g., `Left()`) | Reemplazar con operadores delegables: `StartsWith()`, comparaciones de fecha, campos de lookup |
| Un dropdown no ofrece todas las opciones con muchos datos | `Distinct()` no es delegable: solo ve las filas descargadas | Sacar las opciones de una fuente delegable (la propia columna de opciones o una tabla de catálogo) |
| Error en una fórmula dentro de `Concurrent()` | Una rama usa la variable o colección que carga otra rama | Las fórmulas de `Concurrent()` no pueden depender entre sí: mueve la dependiente después del `Concurrent()` |
| La app sigue lenta al abrir aunque usa `Concurrent()` | Carga en paralelo demasiadas tablas completas que la primera pantalla no necesita | Cargar solo lo esencial; el resto, con named formulas o al entrar en la pantalla que lo usa |
| Power Automate tarda horas en procesar 1,000 registros | Apply to Each sin concurrencia — procesa 1 a la vez | Activar la concurrencia del Apply to each con un grado de paralelismo acorde al límite del destino (Learn: más no siempre es más rápido) |
| Tras activar la concurrencia, el flujo da resultados mezclados | **Set variable** dentro de un bucle concurrente: todas las iteraciones comparten la variable | Usar `items('Apply_to_each')` directamente en cada acción (o una **Compose** por iteración) o volver a secuencial |
| Plugin tarda 30+ segundos y causa timeout | `RetrieveMultiple` que trae todas las columnas y todas las filas, o consultas dentro de un bucle | `ColumnSet` con las columnas necesarias, `TopCount` si basta con una fila (`query.TopCount = 1`) y una sola consulta con `LinkEntity` en lugar de N |
| Power BI DirectQuery lento en reportes de totales | Cada interacción ejecuta una consulta full-scan en la tabla de origen | Cambiar a Import Mode con actualización programada, o crear una tabla de aggregations (detalle en DirectQuery, agregación en Import) |

### 🧪 Criterios de Validación
- [ ] Medí la app del Lab 03 con Live monitor y anoté la operación más lenta con su **Duration** y su **Response size**
- [ ] Con el Data row limit en 1 comprobé la diferencia entre una fórmula no delegable (`Len`) y una delegable (`StartsWith`), y devolví el límite a su valor
- [ ] Al menos 2 fórmulas no-delegables identificadas y corregidas en la app del proyecto
- [ ] Comparé carga secuencial y `Concurrent()` en Live monitor y comprobé que las ramas de `Concurrent()` no pueden depender entre sí
- [ ] Usé una named formula en `App.Formulas` en lugar de cargar datos al inicio
- [ ] Medí un **Apply to each** en secuencial y con concurrencia, y diagnostiqué por qué la concurrencia rompe un flujo con variables
- [ ] Puedo explicar con un FetchXML con `<link-entity>` cuántas llamadas ahorra frente al patrón N+1
- [ ] Completé el reto de transferencia con una tabla síntoma → medida → cambio → verificación

### 📸 Evidencia para guardar
- Tus tablas de evidencia de las cuatro microlecciones, el reto de construcción y el reto de transferencia.
- Las capturas de Live monitor de antes y después del reto de construcción.
- Captura del historial de ejecuciones del flujo en secuencial y en concurrente.

---
