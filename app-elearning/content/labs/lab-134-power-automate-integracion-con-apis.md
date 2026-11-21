---
id: lab-134
title: "Integración con APIs: HTTP, paginación, esquemas que cambian y desencadenador HTTP (Ruta Pro Power Automate)"
level: "N2"
duration: 240
product: ["Power Automate", "HTTP"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 130 recomendado (Select, variables y expresiones sobre listas)"
  - "Lab 133 recomendado (manejo de errores): aquí lo usas con un caso real"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 134 — Integración con APIs

## Objetivo

Consumir una API de otro sistema con la acción **HTTP**: leer **varias páginas** de resultados, **tolerar** que el proveedor cambie el formato sin avisar, **reaccionar** al error cuando la dirección ya no existe y **exponer** tu propio flujo como un punto de entrada HTTP para que otro sistema le envíe datos. Es el lab donde dejas de depender de conectores listos y trabajas con el contrato real de una API.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Compras quiere validar los precios de las solicitudes contra el **catálogo del proveedor**, que publica su lista por una API. La API de este lab es una versión estática del catálogo (la sirve la propia aplicación del curso), con el comportamiento que importa: devuelve **20 artículos por página**, indica con `@odata.nextLink` dónde está la siguiente y, un buen día, **cambia de formato** (versión 2) sin avisar. Además, el sistema de facturación del proveedor quiere **avisar** a SIT cada vez que emite una factura: necesita una dirección a la que enviar un `POST`.

## Lo que vas a construir

- Un flujo `SC - Sincronizar catálogo` que lee **las tres páginas** del catálogo (41 artículos), de dos maneras: bucle manual y paginación automática
- Un **esquema tolerante** que acepta la versión 1 y la versión 2 de la API y normaliza los dos a un formato común
- El tratamiento de un error HTTP 404 con **Configure run after**
- Un flujo `SC - Recibir factura (webhook)` con desencadenador HTTP y una respuesta
- Una tabla de límites que debes conocer antes de poner esto en producción

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| Conectores listos (Dataverse, Outlook, Excel) | **HTTP** a una API sin conector | Módulo 14 (conectores personalizados) |
| Un **Scope** de manejo de errores (Lab 131) | Errores HTTP con código de estado | Como en el Lab 133 |
| Datos de Excel sucios (Lab 130) | Datos de una API que cambia de formato | Lab 135 (facturas) |

> **Aviso de licencia:** la acción **HTTP** y el desencadenador **When an HTTP request is received** son acciones **premium** (comprueba la etiqueta **Premium** en el diseñador; las páginas de Learn consultadas no lo detallan) ([Learn: conector HTTP](https://learn.microsoft.com/connectors/webcontents/)). Sirven la prueba de 90 días de Power Automate o una licencia con conectores premium, como en el Lab 128.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — La primera llamada | 25 min |
| Ejercicio 2 — Parse JSON | 30 min |
| Ejercicio 3 — Todas las páginas con un bucle | 40 min |
| Ejercicio 4 — Paginación automática | 20 min |
| Ejercicio 5 — La API cambia de formato | 45 min |
| Ejercicio 6 — Cuando la dirección no existe | 25 min |
| Ejercicio 7 — Tu propio punto de entrada HTTP | 40 min |
| Ejercicio 8 — Límites | 15 min |
| **Total** | **unas 4 h** |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: **HTTP**, **Parse JSON**, **Do until**, **Initialize variable**, **Set variable**, **Compose**, **Select**, **Filter array**, **Configure run after**, **When an HTTP request is received**, **Response**, **Settings** > **Pagination**
- Expresiones: `body`, `outputs`, `union`, `coalesce`, `empty`, `equals`, `length`, `variables`, `triggerBody`
- Herramienta del equipo para llamar a tu flujo: PowerShell (`Invoke-RestMethod`) o cualquier cliente HTTP

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso y una licencia o prueba de Power Automate con conectores premium (Lab 128)
- [ ] Acceso a internet desde Power Automate a `https://planestudio.vercel.app` (el catálogo está publicado ahí). Si la organización restringe los destinos, usa la variante en papel del Ejercicio 3
- [ ] El paquete [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip) extraído (para ver el catálogo y el cuerpo de ejemplo de la factura)

### Conocimiento previo

- Lab 130: **Select**, **Filter array**, variables y probar expresiones en una **Compose**
- Lab 131: **Scope** y **Configure run after**

### Verificación rápida antes de empezar

- [ ] Abre en el navegador `https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/pagina-1.json`: es la respuesta que vas a leer. Cuenta los artículos (20) y localiza `@odata.count` (41) y `@odata.nextLink`
- [ ] Abre `.../catalogo/pagina-3.json`: tiene **un** artículo y **ningún** `@odata.nextLink`. Así termina la paginación

---

## Ejercicio 1 — La primera llamada

**Objetivo:** ver exactamente lo que devuelve la API, antes de procesarlo.

1. En la solución `SIT Compras`: **New** > **Automation** > **Cloud flow** > **Instant**, nombre `SC - Sincronizar catálogo`, disparador **Manually trigger a flow** (sin entradas).
2. Añade la acción **HTTP** ([Learn: conector HTTP](https://learn.microsoft.com/connectors/webcontents/)). **Method** `GET`. **URI**:

```text
https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/pagina-1.json
```

3. Añade una **Compose** `Cuántos artículos` con `length(body('HTTP')?['value'])`.
4. **Save** y **Test** > **Manually**. Abre la ejecución y mira las salidas de **HTTP**: `statusCode`, `headers` y `body`.

### Resultado esperado del Ejercicio 1

`statusCode` 200, un `body` con `@odata.count` = 41, un arreglo `value` con **20** objetos y un `@odata.nextLink`. `Cuántos artículos` = **20**.

> **Qué es una API paginada:** el servidor no te da los 41 artículos de golpe; te da 20 y te dice dónde pedir los siguientes. Un flujo que lee solo la primera página **cree** que el catálogo tiene 20 artículos y no avisa de nada. Es el error de integración más común.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| `statusCode` | ___ (esperado: 200) |
| Artículos en la primera página | ___ (esperado: 20) |
| Valor de `@odata.nextLink` | ___ |

---

## Ejercicio 2 — Parse JSON

**Objetivo:** que el resto del flujo vea cada propiedad como un campo con nombre y tipo (en **Dynamic content**), en vez de navegar el texto con expresiones.

1. Después de **HTTP**, añade **Data Operation** > **Parse JSON**. **Content** = `body` de **HTTP**. Pulsa **Generate from sample** y pega el contenido de `pagina-1.json` (o solo el comienzo con dos artículos) ([Learn: Parse JSON](https://learn.microsoft.com/power-automate/data-operations#use-the-parse-json-action)).
2. **Save**. Prueba otra vez y observa **Dynamic content**: ahora aparecen `CatalogoID`, `Nombre`, `PrecioUSD`… dentro de `value`.
3. Observa dos cosas del esquema generado:
   - Las propiedades de `value` aparecen en una lista `required` (el generador las marca **todas** como obligatorias).
   - `@odata.nextLink` y `@odata.count` llevan el signo `@`: en las expresiones se escriben `body('Parse_JSON')?['@odata.nextLink']`.
   - **El generador también pone `@odata.nextLink` en la lista `required` de la raíz del esquema.** (Si editas el esquema en la **Vista de código**, el signo `@` de esos nombres se escribe doble, `@@odata.nextLink`: un texto que empieza por `@` se interpreta como una expresión.) La última página no la trae, así que **quítala de esa lista ahora**; si no, el bucle del Ejercicio 3 falla en la tercera página. Cambia además el tipo de `PrecioUSD` de `integer` a `number`: hoy todos los precios son enteros, pero un precio con decimales haría fallar la validación.

### Qué cambia

| | Sin Parse JSON | Con Parse JSON |
|---|---|---|
| Acceso a un campo | `item()?['PrecioUSD']`: si el nombre cambia, da `null` sin avisar | **Dynamic content**, con tipo |
| Datos que no cumplen el esquema | Pasan | **La acción falla** (error de validación) |

> *Sin verificar en Learn:* el mensaje exacto de la validación de **Parse JSON** y cómo volver tolerante un esquema (quitar `required`, aceptar `null`) salen de la práctica, no de la documentación oficial: compruébalo en tu ambiente.
>
> **Esa segunda fila es una virtud y un problema.** Un esquema estricto protege de datos raros y también tumba el flujo cuando la API cambia de forma legítima. El Ejercicio 5 lo demuestra.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Tipo que el esquema generado asigna a `PrecioUSD` (y por qué lo cambiaste a `number`) | ___ |
| ¿Está `Activo` en la lista `required`? | ___ |

---

## Ejercicio 3 — Todas las páginas con un bucle

**Objetivo:** leer las tres páginas siguiendo `@odata.nextLink` hasta que no haya más.

1. Al principio del flujo (antes de **HTTP**), **Initialize variable** dos veces, al nivel principal:
   - `UrlSiguiente`, **String**, valor la URL de la página 1.
   - `Articulos`, **Array**, valor `[]`.
2. Mueve **HTTP** y **Parse JSON** dentro de **Control** > **Do until**, con la condición en modo avanzado `@empty(variables('UrlSiguiente'))` (si usas el editor visual, el `true` de la derecha se escribe con **fx** para que sea booleano y no texto), y estos límites en **Change limits**: **Count** `10`, **Timeout** `PT10M` ([Learn: Do until](https://learn.microsoft.com/power-automate/loops-do-until)). En **HTTP**, **URI** = `variables('UrlSiguiente')` (con **fx**).
3. Dentro del bucle, después de **Parse JSON**:
   - **Compose** `Acumulado` = `union(variables('Articulos'), body('Parse_JSON')?['value'])`.
   - **Set variable** `Articulos` = **Outputs** de `Acumulado`.
   - **Set variable** `UrlSiguiente` = `coalesce(body('Parse_JSON')?['@odata.nextLink'], '')`.
4. Fuera del bucle, **Compose** `Total de artículos` = `length(variables('Articulos'))`.
5. **Test**.

> **`union` quita duplicados exactos:** aquí no afecta porque cada `CatalogoID` es único. Si una API pudiera repetir un objeto idéntico, usa **Append to array variable** dentro de un **For each**.
>
> **Por qué una Compose y dos variables:** una acción **Set variable** **no puede usar la propia variable** en su expresión. Se calcula el resultado en una **Compose** y luego se asigna. `coalesce(..., '')` pone una cadena vacía cuando la última página no trae `@odata.nextLink`, que es lo que detiene el bucle.
>
> **Por qué `Count` 10:** si un error de la API hiciera que `nextLink` apuntara siempre a la misma página, el bucle sería infinito. Un límite razonable convierte un bucle infinito en un fallo visible.

### Resultado esperado del Ejercicio 3

`Total de artículos` = **41**. El historial muestra **tres** iteraciones: 20, 20 y 1 artículos.

### Variante en papel (si Power Automate no puede salir a internet)

Descarga las tres páginas, pega su contenido en tres **Compose** y aplica `union` sobre sus `value`. Pierdes la llamada HTTP real, no la lógica de paginación.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| `Total de artículos` | ___ (esperado: 41) |
| Número de iteraciones del bucle | ___ (esperado: 3) |
| Artículos de la última iteración | ___ (esperado: 1) |

---

## Ejercicio 4 — Paginación automática

**Objetivo:** que la acción siga los enlaces por ti.

1. Duplica el flujo (**Save as**) y llámalo `SC - Sincronizar catálogo (paginación)`. Quita el **Do until**, las variables y las acciones asociadas; deja una sola acción **HTTP** con la URL de la página 1.
2. En **HTTP** > **Settings** > **Networking**, activa **Pagination** y fija **Threshold** en `100` (debe ser **mayor que el total esperado**: el umbral cuenta elementos, no páginas, y con `10` la acción se detiene tras la primera página de 20; Learn: sigue `nextLink` o `@odata.nextLink`; si la API usa otro nombre, hay que hacer el bucle; el umbral admite hasta 5.000 en el perfil Low y 100.000 en los demás). **Comprobado en un tenant real (2026-11-21):** con **Threshold** `100`, la acción sigue `@odata.nextLink` y devuelve las **41** filas en un solo `value` (la llamada tardó unos 4 s) ([Learn: paginación en acciones](https://learn.microsoft.com/azure/logic-apps/logic-apps-exceed-default-page-size-with-pagination)). Añade una **Compose** `Total` = `length(body('HTTP')?['value'])`.
3. **Test**.

### Resultado esperado del Ejercicio 4

`Total` = **41**: la acción sigue `@odata.nextLink` y **fusiona** las páginas en un solo `value`. Si tu versión no fusiona las páginas, usa el bucle del Ejercicio 3.

> **Cuándo usar cada forma:** la paginación automática es menos código; el bucle manual te da control (cabeceras distintas por página, esperar entre páginas, decidir cuándo parar, procesar cada página al llegar en lugar de acumular). Con APIs que limitan las llamadas por minuto, el bucle manual permite insertar una espera.

---

## Ejercicio 5 — La API cambia de formato

**Objetivo:** sobrevivir a un cambio de contrato.

### Tarea 5.1 — Ver el cambio

1. Abre en el navegador `.../catalogo-v2/pagina-1.json`. Compara con la versión 1: `PrecioUSD` (número) ahora es `Precio` (objeto con `valor` y `moneda`) y `Activo` (booleano) ahora es `Estado` (texto `activo` o `descontinuado`). Los artículos y las tres páginas son los mismos.

### Tarea 5.2 — Romper a propósito

2. En el flujo del Ejercicio 3, cambia la URL inicial de `UrlSiguiente` a `.../catalogo-v2/pagina-1.json` y ejecuta **Test**.

**Resultado esperado:** **Parse JSON** falla con `ValidationFailed` ("The schema validation failed.") y, en el detalle, un error del tipo "Required properties are missing from object" con las propiedades que faltan (`PrecioUSD` y `Activo`, las que el esquema generado marca como `required`). Comprobado en un tenant real con la página 3 y `@odata.nextLink`: "Required properties are missing from object: @odata.nextLink." Lee el mensaje y anótalo.

### Tarea 5.3 — Un esquema tolerante

3. En **Parse JSON**, edita el esquema: **quita** de la lista `required` de los artículos las propiedades que cambian (`PrecioUSD`, `Activo`) y **añade** las propiedades nuevas como opcionales:

```json
"Precio": {
  "type": ["object", "null"],
  "properties": {
    "valor": { "type": "number" },
    "moneda": { "type": "string" }
  }
},
"Estado": { "type": ["string", "null"] }
```

   y deja `PrecioUSD` como `{"type": ["number", "null"]}` y `Activo` como `{"type": ["boolean", "null"]}`. Si el esquema se vuelve tedioso, una alternativa extrema es `{}` (acepta todo): pierdes los campos con nombre en **Dynamic content**, no la protección que ya no tenías.

### Tarea 5.4 — Normalizar a un formato común

4. Después del bucle, **Select** `Articulos normalizados`, **From** = `variables('Articulos')`, **Map** en modo de texto (valores sin llaves, para conservar números y booleanos):

```text
{
  "Id": "@item()?['CatalogoID']",
  "Nombre": "@item()?['Nombre']",
  "Categoria": "@item()?['Categoria']",
  "PrecioUSD": "@coalesce(item()?['PrecioUSD'], item()?['Precio']?['valor'])",
  "Activo": "@coalesce(item()?['Activo'], equals(item()?['Estado'], 'activo'))",
  "ProveedorID": "@item()?['ProveedorID']"
}
```

   `coalesce` toma el primer valor **no nulo**: en la versión 1 existe `PrecioUSD`; en la versión 2, no (es `null`) y se usa `Precio.valor`. Con `Activo`, el valor `false` **no es nulo**, así que `coalesce` lo respeta (un artículo descontinuado de la versión 1 sigue descontinuado).
5. Añade dos **Filter array** para comprobar: `Activos` con `@equals(item()?['Activo'], true)` y `Tecnologia` con `@equals(item()?['Categoria'], 'Tecnología')`, y una **Compose** `Resumen` con `concat(length(body('Activos')), ' activos; ', length(body('Tecnologia')), ' de Tecnología')`.
6. Para sumar los precios, añade una variable `SumaActivos` (**Float**, valor `0`, al nivel principal) y, sobre `body('Activos')`, un **For each** con **Increment variable**. Ejecuta con la URL de la **v1** y luego con la de la **v2** (cambiando el valor inicial de `UrlSiguiente` entre las dos).

### Resultado esperado del Ejercicio 5

| Versión | Artículos | Activos | De Tecnología |
|---|---|---|---|
| v1 | 41 | **40** | **10** |
| v2 | 41 | **40** | **10** |

Las dos versiones producen el **mismo** resultado normalizado. Anota también la suma de `PrecioUSD` de los artículos activos con las dos versiones (con un **For each** y **Increment variable**, como en el Lab 130): **48.967** en ambas.

> **La regla de diseño:** **no dejes que el formato de otro sistema se extienda por tu flujo.** Normaliza en un solo punto, justo después de leer, y el resto del flujo trabaja con **tu** formato. Cuando el proveedor cambie otra vez, tocas una acción, no veinte.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Mensaje de error de **Parse JSON** con la v2 y el esquema original | ___ |
| Activos y de Tecnología con v1 y con v2 | ___ , ___ , ___ , ___ (esperado: 40, 10, 40, 10) |

---

## Ejercicio 6 — Cuando la dirección no existe

**Objetivo:** que un 404 no sea una sorpresa.

1. Crea un flujo instantáneo nuevo, `SC - Catálogo con error`, con una sola acción **HTTP** (**GET**) a `.../catalogo/no-existe.json`.
2. **Test**. Observa: la acción **HTTP** termina en **Failed** y el flujo se detiene allí. Abre la ejecución: el `statusCode` es 404.
3. Rodea **HTTP** con un **Scope** `Intentar` y, después, otro **Scope** `Capturar` con **Configure run after** = **has failed**. Dentro de `Capturar`, una **Compose** `Detalle del error` con:

```text
concat('La llamada falló con el código ', string(outputs('HTTP')?['statusCode']), '. Respuesta: ', string(body('HTTP')))
```

   (Para tomar la información del ámbito entero, el Lab 133 usa `result('Try')`.)
4. **Test**.

### Resultado esperado del Ejercicio 6

La ejecución **no** termina en rojo (comprobado: el estado final es **Correcto**): `Intentar` falla, `Capturar` corre y deja el detalle del error. Ojo: `body('HTTP')` es la página de error completa (en el catálogo, un documento HTML largo), así que el detalle es largo; si solo te interesa avisar, quita el cuerpo del mensaje. Es **tu** decisión qué hacer después (avisar, reintentar más tarde, seguir con datos de la última lectura buena).

> **Aquí terminar en Succeeded es una decisión:** a diferencia del Lab 133, donde un `Catch` sin **Terminate** esconde un fallo, el catálogo es una consulta y puedes seguir con la última lectura buena. Escríbelo en la descripción del flujo.
>
> **Qué se reintenta y qué no:** por defecto, las acciones reintentan los errores **transitorios** (408, 429 y 5xx), no los 404. Un 404 no se arregla esperando, y reintentarlo solo gasta tiempo. Como viste en el **Lab 133**, se ajusta el número de reintentos y el intervalo, y se distingue entre errores que se reintentan y los que no.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| `statusCode` de la llamada fallida | ___ (esperado: 404) |
| Estado final de la ejecución | ___ (esperado: Succeeded, con `Intentar` fallida y `Capturar` correcta) |

---

## Ejercicio 7 — Tu propio punto de entrada HTTP

**Objetivo:** que un sistema externo pueda mandarte datos. Es el contrario de los ejercicios anteriores: ahora tú eres la API.

1. En la solución, **New** > **Automation** > **Cloud flow** > **Automated**... pero **sin** desencadenador de la lista: elige **Skip** y, ya en el diseñador, el desencadenador **When an HTTP request is received** (**Request**). Nombre `SC - Recibir factura (webhook)` ([Learn: desencadenador de solicitud HTTP](https://learn.microsoft.com/power-automate/flow-with-external-http)).
2. En **Request Body JSON Schema**, usa **Use sample payload to generate schema** con el contenido de `webhook/ejemplo-factura.json`:

```json
{ "facturaId": "FAC-2026-0001", "proveedorId": "PRV-002", "solicitudId": "SC-2026-0114", "importe": 6800, "moneda": "USD", "fecha": "2026-10-30" }
```

3. En **Who can trigger the flow** hay tres opciones ([Learn: autenticación OAuth en desencadenadores HTTP](https://learn.microsoft.com/power-automate/oauth-authentication)): **Any user in my tenant**, **Specific users in my tenant** (ambas exigen que quien llama presente un token de Microsoft Entra ID) y **Anyone** (marcada como heredada). Para probar con `Invoke-RestMethod` sin token, usa **Anyone** **solo durante la prueba**: **cualquiera con la URL** puede llamar, y la URL lleva una firma (`sig=`) que es, en la práctica, una contraseña. Cuando termines, cambia a una opción de tenant. Learn también avisa de que las URL antiguas de `logic.azure.com` dejaron de funcionar el 30 de noviembre de 2025 y de que las URL nuevas pueden superar los 255 caracteres: no copies la URL de un ejemplo antiguo.
4. Añade una **Condition** que compruebe la moneda: `triggerBody()?['moneda']` **is equal to** `USD`. En **True**, **Response**: **Status Code** `200`, **Headers** `Content-Type` = `application/json`, **Body**:

```json
{ "recibido": true, "facturaId": "@{triggerBody()?['facturaId']}" }
```

   En **False**, **Response** con **Status Code** `400` y **Body** `{ "recibido": false, "motivo": "Solo se aceptan facturas en USD" }`.
5. **Save**. Al guardar, el desencadenador muestra la **HTTP POST URL**: cópiala (es secreta; no la compartas ni la dejes en una captura).
6. Llama a tu flujo desde PowerShell. Windows PowerShell 5.1 **lanza una excepción** con un 400 y no enseña la respuesta, así que el script captura el error y muestra el código y el cuerpo:

```powershell
$url = "<la URL que copiaste>"
$obj = Get-Content .\sit-compras\webhook\ejemplo-factura.json -Raw | ConvertFrom-Json
# Caso 2: descomenta la línea siguiente
# $obj.moneda = "EUR"
# Caso 3: descomenta la línea siguiente
# $obj.PSObject.Properties.Remove("importe")
try {
  Invoke-RestMethod -Method Post -Uri $url -ContentType "application/json" -Body ($obj | ConvertTo-Json)
} catch {
  $_.Exception.Response.StatusCode.value__
  $_.ErrorDetails.Message
}
```

   (En PowerShell 7 puedes usar `Invoke-WebRequest ... -SkipHttpErrorCheck`.)

7. Ejecuta el caso 1 (sin cambios), el caso 2 (`moneda` = `EUR`) y el caso 3 (sin la propiedad `importe`).

### Resultado esperado del Ejercicio 7

| Llamada | Respuesta |
|---|---|
| Cuerpo de ejemplo (USD) | **200** con `{ "recibido": true, "facturaId": "FAC-2026-0001" }` |
| `moneda` = `EUR` | **400** con el motivo |
| Sin la propiedad `importe` | Lo normal es **200**: el esquema solo genera los campos de **Dynamic content** y no valida. Si tu diseñador ofrece **Schema Validation** en los **Settings** del desencadenador y la activas, la llamada se rechaza con 400 antes de que corra el flujo (*sin verificar en Learn*). Anota lo que observas |

El historial del flujo muestra una ejecución por cada llamada aceptada. La respuesta **la da tu flujo**: el sistema que llama espera hasta que **Response** se ejecuta.

> **Cómo responde el desencadenador (Learn):** sin una acción **Response**, el punto de entrada contesta **202** de inmediato; con **Response**, el flujo tiene **120 segundos** para contestar y, si se pasa, quien llama recibe un **408**. **Response** admite códigos 2xx, 4xx y 5xx (no 3xx).
>
> **Dos reglas de un webhook que respondes:**
> 1. **Responde rápido.** El que llama suele tener un tiempo máximo de espera corto. Si tu proceso es largo, guarda el trabajo (en una cola o una fila de Dataverse), responde `202 Accepted` y sigue en otro flujo.
> 2. **Valida lo que llega.** El cuerpo viene de fuera: no confíes en su forma ni en sus valores (el Lab 135 vuelve sobre esto con las facturas).
>
> **`facturaId` es la clave de idempotencia:** si el proveedor reenvía la misma factura, tu flujo no debe registrarla dos veces (upsert con clave alternativa, como en el Lab 132; lo implementa el Lab 135).

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Código y cuerpo de la respuesta con la factura en USD | ___ |
| Código con la moneda EUR | ___ (esperado: 400) |
| Qué pasó sin la propiedad `importe` | ___ |

---

## Ejercicio 8 — Límites

**Objetivo:** saber qué límites existen antes de que te los encuentres en producción ([Learn: límites y configuración de Power Automate](https://learn.microsoft.com/power-automate/limits-and-config)). Completa la tabla leyendo la página de Learn (no de memoria). Verificado el 2026-11-21 (puede cambiar): llamada HTTP síncrona **120 s**; ejecución **30 días**; mensaje **100 MB** (1 GB con *chunking*); reintentos de Power Automate: **hasta 2** en el perfil Low y **hasta 12** en Medium y High (el diseñador cita 8 y 12); solicitudes de Power Platform por 24 h: **10.000** (Low), **200.000** (Medium), **500.000** (High), además de **100.000 cada 5 minutos**:

| Límite | Valor según Learn | Qué haría en SIT |
|---|---|---|
| Tiempo máximo de una llamada HTTP síncrona | ___ | ___ |
| Duración máxima de una ejecución | ___ | ___ |
| Tamaño máximo de una respuesta | ___ | ___ |
| Reintentos por defecto de una acción HTTP | ___ | ___ |
| Llamadas por usuario y por día (solicitudes de Power Platform según la licencia) | ___ | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El flujo lee 20 artículos en lugar de 41 | Solo se leyó la primera página | Bucle sobre `@odata.nextLink` o **Pagination** |
| `Set variable` falla "no puede referenciarse a sí misma" | La expresión usa la variable que se está asignando | **Compose** intermedia (Ejercicio 3) |
| El bucle **Do until** no termina | `UrlSiguiente` nunca queda vacía | `coalesce(..., '')` y un límite **Count** |
| **Parse JSON** falla tras un cambio de la API | Esquema con propiedades obligatorias que ya no llegan | Quitar `required`, aceptar `null`, normalizar (Ejercicio 5) |
| `?['@odata.nextLink']` da error de sintaxis | Falta el corchete o la comilla | `body('Parse_JSON')?['@odata.nextLink']` |
| El webhook devuelve 401 o 403 | Quién puede llamarlo, o la URL sin su firma | Revisa **Who can trigger the flow** y copia la URL completa |
| El flujo del webhook responde tarde | **Response** está después de pasos largos | Responde primero y procesa después |

## 🔧 Diagnóstico y reparación

### "El catálogo se sincronizó, pero faltan artículos"

1. **¿Cuántas iteraciones hizo el bucle?** Si fue una, `nextLink` llegó vacío: abre la salida de **Parse JSON** y mira si la propiedad se llama como crees.
2. **¿Cuántos artículos trae `@odata.count` frente a los que tienes?** Compáralos al final del flujo: si no coinciden, falla con **Terminate** (una comprobación barata evita datos incompletos en silencio).
3. **¿Se rompió el esquema?** Mira si **Parse JSON** falló o si pasó algo menos visible (un campo `null`).

## Checklist final

- [ ] `SC - Sincronizar catálogo` lee las tres páginas (41 artículos) con el bucle, y con la paginación automática si tu versión la admite
- [ ] Esquema tolerante y normalización: v1 y v2 dan 40 activos y 10 de Tecnología
- [ ] Error 404 capturado sin que la ejecución falle
- [ ] `SC - Recibir factura (webhook)` responde 200 y 400 según la moneda
- [ ] Tabla de límites completada con datos de Learn

## Evidencia esperada

- Captura del historial del bucle con las tres iteraciones
- Captura del mensaje de error de **Parse JSON** con el esquema original y la v2
- Captura de la respuesta del webhook en PowerShell (200 y 400), **sin** mostrar la URL completa
- Tu tabla de límites

## Criterios de aprobación

- Lees todas las páginas, no solo la primera, y comprobaste el total con `@odata.count`
- El flujo produce los mismos resultados con la v1 y con la v2 de la API
- Un 404 no deja la ejecución en rojo y el detalle del error queda registrado
- Tu webhook responde según el contenido y no expones su URL

## Competencias desarrolladas

- Consumir APIs REST con **HTTP** y **Parse JSON**
- Leer APIs paginadas con un bucle y con paginación automática
- Diseñar esquemas tolerantes y normalizar datos de terceros
- Capturar errores HTTP con **Scope** y **Configure run after**
- Exponer un flujo como punto de entrada HTTP y protegerlo

## Reto adicional

**Reto básico:** añade a `Articulos normalizados` el campo `Unidad` y comprueba que las dos versiones lo traen.

**Reto intermedio:** que el flujo falle con **Terminate** si el total leído no coincide con `@odata.count`.

**Reto avanzado:** guarda el catálogo normalizado en una tabla de Dataverse con el identificador del artículo como **clave alternativa** (como en el Lab 132) y comprueba que ejecutar el flujo dos veces no duplica filas.

## Preguntas de repaso

1. ¿Por qué un flujo que lee solo la primera página "funciona" y está mal?
2. ¿Por qué una **Set variable** no puede usar su propia variable, y cómo se resuelve?
3. ¿Qué diferencia hay entre `coalesce` y comprobar si un valor es `false`?
4. ¿Por qué se normaliza justo después de leer?
5. ¿Qué dos reglas aplicas a un webhook que respondes?

## Limpieza del laboratorio

Conserva `SC - Sincronizar catálogo` y `SC - Recibir factura (webhook)`. **Apaga el flujo del webhook cuando no lo uses**: una URL activa es una puerta abierta. No dejes la URL en documentos ni capturas.

## Siguiente laboratorio recomendado

**Lab 135 — Documentos y conciliación** (en construcción): facturas en JSON y PDF, conciliación contra la orden con tolerancias y AI Builder como variante opcional.
