---
id: lab-133
title: "Errores, reintentos e idempotencia: flujos que no fallan en silencio ni duplican (Ruta Pro Power Automate)"
level: "N2"
duration: 270
product: ["Power Automate", "Dataverse"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 131 recomendado: el flujo SC - Aprobar solicitud (cadena) y el patrón Scope + Configure run after"
  - "Lab 132 recomendado: la clave alternativa ID de origen y el upsert"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 133 — Errores, reintentos e idempotencia

## Objetivo

Hacer que un flujo se comporte bien **cuando algo sale mal**: capturar el error y decidir qué hacer con él (**Try / Catch / Finally**), no esconder los fallos, reintentar lo que se puede reintentar y **solo** eso, limitar cuántas ejecuciones corren a la vez y, sobre todo, diseñar para que repetir una ejecución (por un reintento, un **Resubmit** o un disparo duplicado) **no duplique** correos, filas ni aprobaciones. Esa última propiedad se llama **idempotencia**.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). El proceso de compras lleva semanas en marcha y aparecen tres problemas:

1. Un martes se cayó la conexión de Outlook durante una hora y **ninguna solicitud recibió su correo de resultado**. Nadie lo supo hasta que un jefe llamó a Compras.
2. Alguien usó **Resubmit** sobre una ejecución antigua y el solicitante recibió el correo de aprobación **dos veces**.
3. Al registrar cinco solicitudes seguidas, dos aprobaciones llegaron mezcladas con la información de otra solicitud.

## Lo que vas a construir

- Un flujo de pruebas `SC - Laboratorio de errores` con cuatro fuentes de fallo distintas
- Un patrón **Try / Catch / Finally** reutilizable que avisa por correo y **no oculta** el fallo
- Una tabla medida de **políticas de reintento** (por defecto, ninguna, intervalo fijo)
- El flujo `SC - Aprobar solicitud (cadena)` **idempotente**: reenviarlo no repite el correo
- Una comparación medida de **concurrencia** (1 frente a 5)

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| **Scope** y **Configure run after** para el escalado (Lab 131) | **Try / Catch / Finally** completo con el detalle del error | Lab 137 (alertas y operación) |
| **Resubmit** "no es gratis" (Lab 128) | Diseño idempotente | Labs 135 y 139 (altas y facturas sin duplicados) |
| Upsert con clave alternativa (Lab 132) | La clave como defensa contra duplicados | — |

> **Fuente del esqueleto:** la guía oficial de manejo de errores de Power Automate ([Learn: errores en flujos](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/error-handling)). El caso, las pruebas y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Cuatro formas de fallar | 35 min |
| Ejercicio 2 — Try / Catch / Finally | 50 min |
| Ejercicio 3 — Reintentos medidos | 35 min |
| Ejercicio 4 — Plazos | 20 min |
| Ejercicio 5 — Concurrencia | 35 min |
| Ejercicio 6 — Idempotencia: que repetir no duplique | 70 min |
| Ejercicio 7 — Avisos de fallo | 15 min |
| **Total** | **unas 4,5 h** (mejor en dos sesiones: Ejercicios 1 a 4 y 5 a 7) |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: **Scope**, **Configure run after**, **Terminate**, **Settings** > **Retry policy**, **Timeout**, **Concurrency control**, **Filter array**, **Send an email (V2)**, **Microsoft Dataverse** (**Get a row by ID**, **Update a row**), **HTTP** (premium), **Delay**, **For each**
- Expresiones: `result`, `actions`, `outputs`, `first`, `join`, `range`, `utcNow`, `equals`, `not`, `coalesce`, `div`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras` y el flujo `SC - Aprobar solicitud (cadena)` del Lab 131 **encendido**
- [ ] La licencia o prueba con conectores premium (la acción **HTTP** lo es)
- [ ] Una tabla `Solicitud de compra` con al menos las cinco filas del Lab 130 y las pruebas de los Labs 128 y 131

### Conocimiento previo

- [Módulo 11](/nivel/intermedio/modulo/power-automate-avanzado): **Scope** y manejo de errores
- Lab 131: **Configure run after** y el patrón de escalado

### Verificación rápida antes de empezar

- [ ] Abre el historial de `SC - Aprobar solicitud (cadena)`: debes ver ejecuciones **terminadas** (verde) y alguna **en curso**
- [ ] Anota **cuántas ejecuciones fallidas** hay en los últimos 28 días en tus flujos de la solución (probablemente ninguna): al final del lab la cuenta será distinta, a propósito

---

## Ejercicio 1 — Cuatro formas de fallar

**Objetivo:** distinguir tipos de fallo, porque se tratan distinto.

1. En la solución, **New** > **Automation** > **Cloud flow** > **Instant**: `SC - Laboratorio de errores`, **Manually trigger a flow**, con una entrada de tipo **Text** llamada `Fallo` (lista desplegable con `ninguno`, `expresion`, `dataverse`, `http` y `conexion`; si no encuentras la lista desplegable, escribirás el valor a mano).
2. Antes de añadir acciones, **copia el identificador de una fila real** de `Solicitudes de compra` (en Power Apps, abre una fila: el identificador es el valor de `id=` en la dirección). Lo necesitas para la segunda acción.
3. Añade estas **cuatro acciones, una detrás de otra y todas al nivel principal** (no dentro de un **Switch** ni de una **Condition**: el Ejercicio 2 explica por qué). Cada una **solo falla** con su valor de `Fallo`; con otro valor, funciona. Las expresiones usan la entrada `Fallo` del disparador (elígela desde **Dynamic content**; en el diseñador suele llamarse `text`: `triggerBody()?['text']`):

| Acción | Parámetro con **fx** | Falla cuando `Fallo` es… | Tipo de fallo |
|---|---|---|---|
| **Compose** `Division` | `div(1, if(equals(triggerBody()?['text'], 'expresion'), 0, 1))` | `expresion` | **Expresión**: el flujo no puede calcularla |
| **Dataverse** > **Get a row by ID** `Leer fila`, **Table name** `Solicitudes de compra` | **Row ID** = `if(equals(triggerBody()?['text'], 'dataverse'), '00000000-0000-0000-0000-000000000001', '<el identificador que copiaste>')` | `dataverse` | **Servicio**: la fila no existe |
| **HTTP** `Leer catalogo`, **GET** | **URI** = `if(equals(triggerBody()?['text'], 'http'), 'https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/no-existe.json', 'https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/pagina-3.json')` | `http` | **HTTP**: la dirección existe pero no hay recurso (404) |
| **HTTP** `Llamar a la red`, **GET** | **URI** = `if(equals(triggerBody()?['text'], 'conexion'), 'https://no-existe.invalid/catalogo.json', 'https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/pagina-3.json')` | `conexion` | **Conexión**: el nombre no se resuelve (el dominio `.invalid` está reservado y nunca existe) |

4. **Save**. Ejecuta tres veces (`expresion`, `dataverse` y `http`; deja `conexion` para el Ejercicio 3) y abre cada ejecución.

### Resultado esperado del Ejercicio 1

Cada ejecución termina en **Failed**, con **una** acción roja y las siguientes **omitidas** (no se ejecutan porque la anterior falló):

| Origen | Qué dice el error (anota el texto) |
|---|---|
| Expresión | `InvalidTemplate. Unable to process template language expressions in action 'Division' inputs at line '0' and column '0': 'Attempt to divide an integral or decimal value by zero in function 'div'.'` (comprobado en un tenant real) |
| Dataverse | ___ |
| HTTP | ___ (con el código 404) |

> **Por qué importa distinguirlos:** un error de **expresión** es un defecto del flujo (se arregla editando); uno de **servicio** puede ser un dato que no existe o un servicio caído; uno de **HTTP** trae un código de estado que dice si vale la pena **reintentar**: 5xx y 429 sí, 404 no, 401 solo después de arreglar las credenciales.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Textos de los tres errores | ___ |
| ¿Cuál de los tres reintentarías? ¿Por qué? | ___ |

---

## Ejercicio 2 — Try / Catch / Finally

**Objetivo:** capturar el fallo, avisar con el detalle y **no ocultar** que falló, y que la limpieza corra siempre.

### Tarea 2.1 — La estructura

1. Al principio del flujo (nivel principal), **Initialize variable** `HuboFallo`, **Boolean**, valor `false`.
2. Mete las cuatro acciones del Ejercicio 1 dentro de un **Scope** llamado `Try`.
3. Añade un segundo **Scope**, `Catch`, con **Configure run after** = **has failed** y **has timed out** (desmarca **is successful**) respecto de `Try`.
4. Añade un tercer **Scope**, `Finally`, con **Configure run after** respecto de `Catch` marcando las **cuatro** opciones (**is successful**, **has failed**, **is skipped**, **has timed out**): `Finally` corre pase lo que pase ([Learn: Configure run after](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/error-handling)).

### Tarea 2.2 — El detalle del error

5. Dentro de `Catch`, **Filter array** `Acciones fallidas`: **From** = `result('Try')`, condición avanzada:

```text
@equals(item()?['status'], 'Failed')
```

   `result('Try')` devuelve el resultado de las acciones **de primer nivel** del ámbito, con su estado y su error ([Learn: función `result`](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference#result)).

   > **Por qué las cuatro acciones están al nivel principal de `Try`:** si estuvieran dentro de un **Switch** o una **Condition**, `result('Try')` solo vería el **Switch** (con un error genérico, "an action failed") y tu correo no diría qué falló. **Comprobado en un tenant real (2026-11-21):** con un **Switch** dentro de `Try`, `result('Try')` devuelve la acción `Sw` con el mensaje genérico "An action failed. No dependent actions succeeded." y `status` = `Failed`; el correo diría "Falló la acción Sw" y no `Division`. **Regla:** si necesitas el detalle, no escondas las acciones importantes dentro de otra estructura.
6. **Compose** `Detalle del fallo`, con:

```text
concat('Falló la acción ', first(body('Acciones_fallidas'))?['name'], ': ', first(body('Acciones_fallidas'))?['error']?['message'])
```

7. **Set variable** `HuboFallo` = `true` (con **fx**: `true` sin comillas, para que sea booleano).
8. **Send an email (V2)** a tu correo: **Subject** `Fallo en SC - Laboratorio de errores`; **Body** con el detalle y el identificador de la ejecución (`workflow()?['run']?['name']`).

### Tarea 2.3 — Que `Finally` corra y que el fallo no se oculte

9. Dentro de `Finally`, una **Compose** `Fin` con `utcNow()`: aquí iría la limpieza (cerrar conexiones, liberar un bloqueo, registrar la duración).
10. **Después de `Finally`** (fuera de los tres ámbitos), **Control** > **Condition** `¿Hubo fallo?`: `variables('HuboFallo')` **is equal to** `true` (el `true` con **fx**, como booleano; si lo tecleas, puede guardarse como el texto `"true"` y la condición nunca se cumpliría). En **True**, **Control** > **Terminate**: **Status** **Failed**, **Code** `FALLO_CAPTURADO`, **Message** el `Detalle del fallo`. (**Terminate** no se puede usar dentro de un **For each** ni de un **Do until**.)
11. Ejecuta de nuevo `expresion`, `dataverse` y `http`.

### Resultado esperado del Ejercicio 2

- El correo llega **con el nombre de la acción** (`Division`, `Leer fila` o `Leer catalogo`) **y el mensaje**.
- `Finally` corre en los tres casos.
- La ejecución termina en **Failed** (por el **Terminate**), no en **Succeeded**.
- Con `Fallo` = `ninguno`, `Try` termina bien, `Catch` se **omite**, `Finally` corre y la ejecución termina **Succeeded**.

> **Comprobado en un tenant real:** con `Catch` que solo marca `HuboFallo`, `Finally` corre (`finally corrió True`) y el **Terminate** posterior deja la ejecución en **Failed**.
>
> **Por qué el Terminate va después de `Finally` y no dentro de `Catch`:** **Terminate** acaba la ejecución **en el acto**: si estuviera dentro de `Catch`, `Finally` nunca correría y perderías la limpieza. Por eso `Catch` solo **anota** el fallo (`HuboFallo`) y la decisión de terminar se toma al final.
>
> **El error más común de este patrón:** poner `Catch` y no poner el **Terminate**. El flujo avisa, pero termina **Succeeded**: en el historial, en las alertas y en los informes parece que todo fue bien. Si el negocio necesita saber que algo falló, el estado del flujo tiene que decirlo. Si el fallo es **esperado** y **resuelto** (por ejemplo, "esta solicitud ya no existe, la omito"), entonces sí terminar bien es lo correcto: es una decisión, no un olvido (y se escribe en la descripción del flujo).

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Estado final de la ejecución con el **Terminate** | ___ (esperado: Failed) |
| Estado de `Try`, `Catch` y `Finally` con `expresion` | ___ , ___ , ___ |
| ¿Qué estado tendría la ejecución **sin** el **Terminate**? | ___ |
| Nombre de la acción que dice el correo para `http` | ___ (esperado: `Leer catalogo`) |

---

## Ejercicio 3 — Reintentos medidos

**Objetivo:** reintentar lo que se arregla solo, con control, y ver cuánto cuesta.

### Tarea 3.1 — Un error que **no** se reintenta

1. Usa el valor `conexion` de `Fallo`: falla la acción `Llamar a la red`, una llamada a un nombre que no se puede resolver (`no-existe.invalid`).
2. Abre la ejecución. **Comprobado en un tenant real (2026-11-21):** el error es `UnresolvableHostName. The provided host name 'no-existe.invalid' could not be resolved.`, la acción falla **al instante** (0 s) y **no se reintenta**, ni con la directiva por defecto ni con **Fixed interval** de 2 reintentos cada 10 segundos: toda la ejecución dura menos de un segundo. Un error de resolución de nombre no se considera transitorio.

### Tarea 3.2 — Un error que **sí** se reintenta

3. Cambia el **URI** de `Llamar a la red` por un servicio que devuelva un **503** (por ejemplo, el servicio público `https://httpbin.org/status/503`, ajeno al curso: no envíes datos reales; es una prueba con una URL, sin cuerpo).
4. Abre **HTTP** > **Settings** > **Networking** > **Retry policy**. Hay cuatro tipos: **Default**, **None**, **Exponential interval** y **Fixed interval** (el **Count** va de 1 a 90 y el **Interval**, en ISO 8601, de `PT5S` a `P1D`) ([Learn: directivas de reintento](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/error-handling)). Prueba tres configuraciones y mide el tiempo total de la acción y los intentos (la acción muestra el historial de reintentos):

| Configuración | Intentos | Tiempo total | Qué observas |
|---|---|---|---|
| **None** | ___ | ___ | ___ |
| **Fixed interval**, **Count** `2`, **Interval** `PT10S` | ___ | ___ | ___ |
| **Default** | ___ | ___ | ___ |

   (El tiempo de **Default** es de **varios minutos**: en una prueba real, un 503 con la directiva por defecto tardó **unos 11 minutos** en rendirse (y la ejecución completa, con las otras dos directivas, 11 min 46 s). Lanza esta prueba y sigue con otra cosa.)

### Resultado esperado del Ejercicio 3

- **None**: 1 intento y un fallo inmediato.
- **Fixed interval** de 2 reintentos cada 10 segundos: 3 intentos (el original y dos reintentos) y unos **20 segundos** de espera acumulada.
- **Default**: varios reintentos con intervalos crecientes, durante **unos 11 minutos** (medido). **Anota cuántos** hizo: Learn da cifras distintas según la página y el perfil de licencia (hasta 2 en el perfil Low y hasta 12 en Medium y High; el diseñador cita 8 sin conectores premium y 12 con ellos), así que **tu medida es el dato**. Se reintentan 408, 429 y los errores 5xx.

### Qué reintentar y qué no

| Fallo | ¿Reintentar? | Por qué |
|---|---|---|
| 408, 429, 5xx | **Sí**, con espera | Suelen ser transitorios |
| Nombre que no se resuelve (DNS) | **No** (comprobado) | La plataforma no lo trata como transitorio: arréglalo en la URL |
| 400, 401, 403, 404 | **No** | No se arreglan esperando |
| Cualquier error al **crear** algo sin protección de duplicados | **Con cuidado** | El primer intento puede haber funcionado aunque devolviera error: el Ejercicio 6 trata esto |

> **Un reintento sin idempotencia es una duplicación esperando a ocurrir.** Un `POST` que **sí** creó el recurso pero perdió la respuesta por un corte, se reintenta y crea el segundo.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Intentos con **None**, **Fixed** y **Default** (con el 503) | ___ , ___ , ___ |
| ¿Se reintentó el error de DNS? | ___ (esperado: no) |
| Tiempo con **Fixed** | ___ (esperado: unos 20 s) |

---

## Ejercicio 4 — Plazos

**Objetivo:** que ninguna acción espere para siempre.

1. Guarda una copia del flujo (**Save as**, `SC - Laboratorio de errores (plazo)`) y deja dentro de `Try` **solo** una acción **Approvals** > **Start and wait for an approval** (**Approve/Reject - First to respond**, **Assigned to** tu correo, **Title** `Prueba de plazo`). Quita las cuatro acciones de fallo de la copia.
2. En esa acción, **Settings** > **General** > **Action Timeout** = `PT1M`. (Learn describe este valor como la duración máxima **entre reintentos y respuestas asíncronas**: no limita una solicitud HTTP individual, que tiene su propio límite de 120 segundos. Por eso el plazo se prueba con una acción que **espera una respuesta**.)
3. Ejecuta la copia y **no respondas** la aprobación. Mira el estado de la acción pasado un minuto.

### Resultado esperado del Ejercicio 4

Pasado el minuto la acción termina por **tiempo agotado** (`ActionTimedOut`) en lugar de esperar días, y la ejecución entra por `Catch` (**has timed out** está marcado en **Configure run after**). La aprobación **sigue pendiente** en el centro de aprobaciones: el flujo dejó de esperarla, pero no la cancela (Lab 131).

> **Por qué poner plazos:** una acción que espera sin plazo mantiene la ejecución viva hasta el límite de duración del flujo (28 días para las aprobaciones según la página de problemas conocidos de Learn; 30 según la de límites) y los problemas se descubren tarde. Los plazos se eligen por **lo que el negocio tolera**, no por lo que la acción tarda normalmente. Las aprobaciones (Lab 131) tienen su propio plazo.

---

## Ejercicio 5 — Concurrencia

**Objetivo:** decidir **cuántas** ejecuciones o iteraciones corren a la vez.

### Tarea 5.1 — Un bucle en paralelo y en serie

1. Crea el flujo `SC - Concurrencia`, instantáneo. Añade una **Compose** `Lista` con `range(1, 10)` (diez números, del 1 al 10).
2. **For each** sobre `Lista`. Dentro: **Delay** de `5` segundos.
3. En los **Settings** del **For each**, **Concurrency control**: primero **Off** (se ejecuta en serie) y mide el tiempo total; después **On** con **Degree of Parallelism** `5` (el grado va de 1 a 50) y mide otra vez ([Learn: límites y configuración](https://learn.microsoft.com/power-automate/limits-and-config)).

**Resultado esperado:**

| Concurrencia | Tiempo total aproximado |
|---|---|
| Desactivada (serie) | **50 s** (10 × 5 s) |
| Grado 5 | **10 s** (dos tandas de 5) |

### Tarea 5.2 — El peligro del paralelismo

4. En el mismo bucle, añade una variable `Contador` (**Integer**, al nivel principal) y un **Increment variable** dentro. Con concurrencia en grado 5, observa el valor final.

**Resultado esperado:** puede que **no** sea 10 (o que lo sea hoy y no mañana). Learn desaconseja tocar variables compartidas dentro de bucles concurrentes: el resultado depende de qué iteración llega primero. **Anótalo como regla:** en paralelo, cada iteración trabaja con **sus** datos, no con un acumulador común. (Matiz: Learn exceptúa **Increment variable** y **Decrement variable** de este riesgo, no **Set variable**; en una prueba real con 40 elementos el total salió correcto aun así. Es un riesgo que no siempre se ve, y por eso se evita.)

### Tarea 5.3 — Concurrencia en el desencadenador

5. **No pruebes esto en el flujo de aprobaciones:** Learn advierte de que el control de concurrencia de un desencadenador está **apagado por defecto** y, una vez activado, **no se puede deshacer sin borrar el desencadenador y volver a añadirlo**. Crea un flujo de pruebas `SC - Concurrencia (disparador)`: desencadenador **When a row is added, modified or deleted** (**Added**, `Solicitudes de compra`, **Organization**), con **Settings** > **Concurrency control** **On** y **Degree of Parallelism** `1` (admite de 1 a 100; por defecto 25), una acción **Delay** de `20` segundos y una **Compose** con `utcNow()`. **Apaga** `SC - Aprobar solicitud (cadena)` mientras pruebas. Registra **cinco** solicitudes seguidas con `SC - Registrar solicitud` (quedarán en **Pendiente**, sin importe ni aprobación, y saldrían en el resumen diario: **bórralas** al terminar) y mira el historial: las ejecuciones **esperan** unas a otras (estado **Waiting**) y empiezan con unos 20 segundos de diferencia. Después **borra** el flujo de pruebas y vuelve a encender el de aprobaciones.

> **Para qué sirve el grado 1 en un desencadenador:** cuando el orden o la exclusión importan (una numeración, un saldo que se actualiza). El precio: si cada ejecución espera una **aprobación** (días), las siguientes se **quedan en cola**; y la cola es finita (Learn: 10 ejecuciones en espera más el grado de paralelismo; las que lleguen con la cola llena pueden **perderse** si el conector no las reintenta). Para un flujo con aprobaciones, el grado 1 **bloquea el proceso entero**: no lo apliques aquí.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Tiempo del **For each** en serie y con grado 5 | ___ y ___ (esperado: unos 50 s y unos 10 s) |
| Valor final de `Contador` con grado 5 | ___ |
| ¿Por qué no se limita a 1 el desencadenador del flujo de aprobaciones? | ___ |

---

## Ejercicio 6 — Idempotencia: que repetir no duplique

**Objetivo:** el problema 2 del escenario. Reenviar una ejecución no debe enviar el correo dos veces.

### Tarea 6.1 — Provocar el problema

1. Abre `SC - Aprobar solicitud (cadena)`. Toma una ejecución **terminada** de una solicitud de nivel 1 y pulsa **Resubmit**. Responde la aprobación nueva.
2. Cuenta los correos que recibió el solicitante.

**Resultado esperado:** **dos** correos para la misma solicitud, y la fila volvió a actualizarse. El flujo no sabe que ya hizo su trabajo.

### Tarea 6.2 — La marca de "ya notificado"

3. En la tabla `Solicitud de compra`, añade la columna `Resultado notificado` (**Yes/No**, por defecto **No**). Anota su logical name.
4. En el flujo, **justo antes** del correo final, añade **Dataverse** > **Get a row by ID** (`Releer solicitud`): misma tabla, **Row ID** = el identificador de la fila del disparador.
5. Envuelve el **Send an email (V2)** y una nueva **Update a row** en una **Condition** en modo avanzado: `@not(equals(outputs('Releer_solicitud')?['body/sit_resultadonotificado'], true))` (si usas el editor visual, el `true` de la derecha se escribe con **fx** para que sea booleano y no texto). En **True**: el correo y **Update a row** que pone `Resultado notificado` = **Yes**. En **False**: nada.
6. Haz **Resubmit** sobre la misma ejecución del paso 1 (aprueba la aprobación nueva). **Esta vez sí llega un correo** (el tercero), porque la marca estaba en **No**; la fila queda con `Resultado notificado` = **Yes**. *Sin verificar en Learn:* que **Resubmit** use la definición **actual** del flujo y no la de la ejecución original; si el correo no llega a cambiar nada, comprueba que reenviaste desde la versión nueva.
7. Haz **Resubmit** **otra vez**: ahora la condición va por **False** y no llega nada.

### Resultado esperado de la Tarea 6.2

En el **segundo** reenvío, **ningún** correo nuevo: el flujo **relee** la fila, ve que `Resultado notificado` ya es **Yes** y omite el envío. El historial muestra la condición en **False**.

> **Por qué importa:** Power Automate ejecuta las acciones con semántica de **al menos una vez**, así que una acción puede repetirse; Learn recomienda diseñar flujos **idempotentes**, por ejemplo con restricciones de clave en Dataverse para evitar filas duplicadas, y advierte de que reenviar una ejecución puede duplicar efectos ([Learn: guía de pruebas de flujos](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/test-cloud-flows)).

> **Por qué hay que releer la fila:** **Resubmit** reutiliza los **datos del disparador de la ejecución original**, con los valores de **entonces**. Si la condición mirara `triggerOutputs()` (donde `Resultado notificado` valía **No** cuando se disparó la ejecución antigua), seguiría enviando. La verdad está en la tabla, **ahora**, no en lo que el disparador recordaba. Es el fallo que más veces se repite con **Resubmit**.

### Tarea 6.3 — La condición de carrera

7. Piensa (y escribe en dos líneas): si **dos** ejecuciones llegaran **a la vez** a la condición, ambas leerían **No** antes de que cualquiera escribiera **Yes**, y las dos enviarían. "Mirar y después actuar" **no es atómico**. Anota qué lo resolvería: **(a)** un límite de concurrencia, **(b)** una **clave alternativa** que haga fallar el segundo intento, o **(c)** una **actualización condicionada** (solo cambiar a **Yes** si sigue en **No**, lo que Dataverse puede hacer con control de concurrencia optimista).

### Patrones de idempotencia

| Patrón | Cómo | Cuándo |
|---|---|---|
| **Clave natural + upsert** (Lab 132) | La clave alternativa hace que repetir **actualice**, no cree | Crear o sincronizar filas |
| **Marca de proceso hecho** (este ejercicio) | Una columna dice "ya hecho"; se **relee** antes de actuar | Acciones con efecto externo (correo, aviso) |
| **Clave de idempotencia** | El que llama manda un identificador único y tú lo registras | APIs y webhooks (Lab 134) |
| **Hacer que el efecto sea seguro de repetir** | "Poner el estado en X" en vez de "sumar 1" | Siempre que se pueda |

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Correos tras **Resubmit** sin marca, al activarla y en el reenvío siguiente | ___ , ___ , ___ (esperado: 2 en total; 1 más al activar la marca; 0 en el siguiente) |
| ¿Por qué la condición lee `Releer solicitud` y no el disparador? | ___ |

---

## Ejercicio 7 — Avisos de fallo

**Objetivo:** enterarse de los fallos **antes** de que llame un jefe.

1. Lee [Learn: avisos de fallo de flujos](https://learn.microsoft.com/power-automate/understand-flow-failure-notifications). Power Automate envía **dos** correos: un aviso **por ejecución fallida**, solo para causas conocidas (conexión rota, límites, AI Builder, desktop flow, error conocido de un conector), con pasos para solucionarlo, y un **resumen semanal** con todos los fallos. Los reciben el **propietario y los copropietarios**, nunca quienes solo ejecutan el flujo ni los administradores; hay un enfriamiento de 28 días por flujo y el aviso no está activado en todos los flujos. Un `Catch` tuyo cubre lo que ese aviso **no** cubre (los fallos de negocio y los errores no clasificados).
2. Decide, por escrito, para **tres** de tus flujos: quién debería enterarse de un fallo, por qué canal (correo, Teams, una tabla de registro) y cuánto tarda en enterarse. Un aviso que nadie lee es lo mismo que ninguno.
3. Comprueba el recuento de ejecuciones **fallidas** de la solución y compáralo con el que anotaste al principio.

> El **Lab 137** (operación y gobierno) desarrolla estos avisos: propietarios, cuentas de servicio y el análisis de ejecuciones.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El flujo avisa del fallo pero aparece **Succeeded** | `Catch` sin **Terminate** al final | Terminar con **Failed** después de `Finally` (Ejercicio 2) |
| `Finally` no se ejecuta | El **Terminate** está dentro de `Catch` | Móvelo después de `Finally`, detrás de una condición |
| El correo dice "Switch" en vez de la acción real | Las acciones están dentro de un **Switch** o **Condition** dentro de `Try` | Acciones al nivel principal de `Try` |
| `Catch` no se ejecuta | **Configure run after** de `Catch` con solo **is successful** | Marca **has failed** y **has timed out** |
| `Finally` no se ejecuta cuando `Catch` se omite | Solo tiene marcado **is successful** | Marca las cuatro opciones |
| `result('Try')` da error o vacío | Nombre del ámbito mal escrito (distingue mayúsculas) | `result('Try')` con el nombre exacto |
| El reintento duplicó una fila | El primer intento sí había creado la fila | Idempotencia: clave alternativa y upsert (Lab 132) |
| Reenviar vuelve a mandar el correo | La condición lee el disparador, no la fila actual | **Get a row by ID** antes de decidir |
| Con concurrencia 1 el flujo de aprobaciones "se atasca" y no se puede deshacer | Cada ejecución espera días una aprobación y las demás hacen cola | No limitar el disparador en flujos con esperas largas |

## 🔧 Diagnóstico y reparación

### "Ayer cayó Outlook una hora y no sabemos a quién no se le notificó"

1. **Filtra el historial** por fallidas de ese tramo.
2. **Abre una** y mira qué acción falló y con qué error (probablemente un 5xx o una conexión).
3. **Reenvía** solo las que sean seguras de repetir (por eso la idempotencia importa: sin ella, reenviar es duplicar).
4. **Decide** cómo lo evitarías (reintento con espera, cola de correos pendientes, aviso al propietario).

## Checklist final

- [ ] `SC - Laboratorio de errores` con las cuatro formas de fallar y el patrón **Try / Catch / Finally** con el **Terminate** al final
- [ ] Tabla de reintentos medida (None, Fixed, Default)
- [ ] Un plazo probado con `ActionTimedOut`
- [ ] Concurrencia medida (50 s frente a 10 s) y el flujo de pruebas del desencadenador borrado
- [ ] `SC - Aprobar solicitud (cadena)` idempotente: **Resubmit** no repite el correo
- [ ] Decisión escrita de avisos de fallo para tres flujos

## Evidencia esperada

- Captura de un correo del `Catch` con el nombre de la acción y el mensaje del error
- Captura del historial de reintentos de la acción **HTTP**
- Captura de la condición del Ejercicio 6 en **False** tras el **Resubmit**
- Tus respuestas de validación y los patrones de idempotencia anotados

## Criterios de aprobación

- Ninguno de tus flujos de la solución puede terminar **Succeeded** si falló una acción importante
- Distingues los fallos que se reintentan de los que no, y lo demuestras con medidas
- **Resubmit** sobre una solicitud ya notificada no envía un segundo correo
- Explicas por qué la condición relee la fila y por qué "mirar y después actuar" tiene una condición de carrera

## Competencias desarrolladas

- Implementar **Try / Catch / Finally** y obtener el detalle del error con `result`
- Elegir y medir directivas de reintento y plazos
- Controlar la concurrencia en bucles y desencadenadores y conocer sus riesgos
- Diseñar flujos idempotentes con marcas, claves y relectura
- Decidir qué avisos de fallo necesita cada flujo

## Reto adicional

**Reto básico:** añade al correo de `Catch` el nombre del flujo y un enlace al historial de la ejecución.

**Reto intermedio:** registra cada fallo capturado en una tabla de Dataverse `Registro de errores` (flujo, acción, mensaje, fecha). Anota qué te falta para convertirlo en un informe.

**Reto avanzado:** reduce la condición de carrera del Ejercicio 6 con una clave alternativa o con una actualización condicionada, y demuestra con dos ejecuciones simultáneas que solo sale **un** correo.

## Preguntas de repaso

1. ¿Por qué `Catch` sin **Terminate** puede ser peor que no tener `Catch`?
2. ¿Qué fallos se reintentan por defecto y cuáles no deberían reintentarse nunca?
3. ¿Por qué **Resubmit** puede duplicar efectos aunque el flujo "esté bien hecho"?
4. ¿Por qué la condición del Ejercicio 6 usa **Get a row by ID**?
5. ¿Cuándo es mala idea limitar a 1 la concurrencia de un desencadenador?

## Limpieza del laboratorio

Conserva `SC - Laboratorio de errores` (el Lab 137 lo usa para practicar alertas), pero **apágalo**. Comprueba que borraste `SC - Concurrencia (disparador)` y que `SC - Aprobar solicitud (cadena)` está **encendido** y **sin límite de concurrencia**. Deja la columna `Resultado notificado`: te sirve de ejemplo de marca de idempotencia.

## Siguiente laboratorio recomendado

**Lab 134 — Integración con APIs**: HTTP, paginación, esquemas que cambian y un desencadenador HTTP propio.
