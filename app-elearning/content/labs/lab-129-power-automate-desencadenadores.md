---
id: lab-129
title: "Desencadenadores que no se disparan de más: columnas, filas y condiciones (Ruta Pro Power Automate)"
level: "N2"
duration: 180
product: ["Power Automate", "Dataverse"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado: solución SIT Compras con la tabla y los tres flujos"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 129 — Desencadenadores que no se disparan de más

## Objetivo

Hacer que cada flujo se ejecute **solo cuando debe**. Partes de un flujo que avisa de las compras grandes y que, mal configurado, se dispara tres veces por cada solicitud; lo corriges en tres pasos (columnas, filas y condiciones de desencadenador), mides cada mejora contando ejecuciones, arreglas el resumen diario del Lab 128 (que escribe correos vacíos y también madruga los fines de semana) y validas las entradas del flujo instantáneo.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). El proceso de compras del Lab 128 lleva una semana en marcha y aparecen tres quejas:

1. Finanzas quiere un aviso inmediato cuando se pida algo de **más de 10.000 USD**, y la primera versión del flujo les llena la bandeja: cada solicitud genera tres correos, sea del importe que sea.
2. TI quiere enterarse de las compras de **Tecnología** de nivel 2 o superior (la política exige su revisión) y de ninguna otra.
3. El resumen diario llega los sábados y domingos, y cuando no hay nada pendiente llega un correo con una tabla vacía.

Además, alguien registró una solicitud con cantidad 0 y el proceso la aceptó.

## Lo que vas a construir

- El flujo `SC - Alertar compra grande`, que evoluciona en cuatro versiones y deja una tabla de ejecuciones medidas
- El flujo `SC - Avisar a TI`, con una condición de desencadenador que usa dos columnas
- El resumen diario corregido: solo de lunes a viernes, sin festivos y sin correo vacío
- La validación de entradas de `SC - Registrar solicitud`

## Relación con la Ruta Pro

| Antes (Lab 128) | En este lab |
|---|---|
| Disparador de Dataverse sin filtros | **Select columns**, **Filter rows** y condiciones de desencadenador |
| Resumen diario todos los días, aunque no haya nada | Días de la semana, festivos y envío solo si hay filas |
| Entradas del flujo instantáneo sin validar | Validación y **Terminate** con mensaje |

> **Fuente del esqueleto:** el laboratorio sobre filtros de desencadenador del curso oficial PL-7002 ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-7002-Create-and-Manage-Automated-Processes-by-using-Power-Automate)). El caso, las pruebas y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — El flujo que se dispara de más | 30 min |
| Ejercicio 2 — Solo cuando cambia el importe (Select columns) | 20 min |
| Ejercicio 3 — Solo las compras grandes (Filter rows) | 25 min |
| Ejercicio 4 — Condiciones de desencadenador | 35 min |
| Ejercicio 5 — Un resumen diario con criterio | 40 min |
| Ejercicio 6 — Validar las entradas del flujo instantáneo | 20 min |
| **Total** | **unas 3 h** |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: desencadenador de Dataverse (**Change type**, **Select columns**, **Filter rows**), **Settings** > **Trigger conditions**, **Recurrence** (**On these days**, **At these hours**, **Time zone**), **Manually trigger a flow**, **Condition**, **Terminate**, **Compose**
- Expresiones: `coalesce`, `greater`, `and`, `equals`, `length`, `contains`, `createArray`, `formatDateTime`, `convertTimeZone`, `utcNow`, `mod`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras` del [Lab 128](/labs/lab-128-power-automate-en-un-dia) y sus tres flujos **activos**
- [ ] La licencia o prueba de Power Automate con conectores premium (la del Lab 128)
- [ ] Los logical names en minúsculas que anotaste en el Lab 128 (`sit_importe`, `sit_categoria`, `sit_estadosolicitud`…). **Los tuyos pueden diferir** (la tilde y el prefijo): úsalos siempre

### Conocimiento previo

- [Módulo 5](/nivel/basico/modulo/power-automate-automatizacion-basica): disparadores y condiciones
- Lab 128: el flujo `SC - Aprobar solicitud` actualiza la fila **dos veces** (al calcular importe, nivel y estado, y al registrar el resultado de la aprobación). Esa es la clave de este lab

### Verificación rápida antes de empezar

- [ ] En la tabla `Solicitudes de compra` hay al menos las cuatro solicitudes del Lab 128
- [ ] `SC - Aprobar solicitud` está activo y responderás las aprobaciones que lleguen (cada prueba de este lab crea una)

---

## Ejercicio 1 — El flujo que se dispara de más

**Objetivo:** ver el problema antes de arreglarlo. Un flujo "razonable" a primera vista que se ejecuta tres veces por solicitud.

### Tarea 1.1 — La versión ingenua

1. En la solución `SIT Compras`: **New** > **Automation** > **Cloud flow** > **Automated**. Nombre `SC - Alertar compra grande`. Disparador **When a row is added, modified or deleted** ([Learn: disparador de Dataverse](https://learn.microsoft.com/power-automate/dataverse/create-update-delete-trigger)).
2. Configúralo así: **Change type** = **Added or Modified**, **Table name** = `Solicitudes de compra`, **Scope** = **Organization**. Deja vacíos los parámetros avanzados.
3. Añade **Office 365 Outlook** > **Send an email (V2)** a tu correo. **Subject** `Compra modificada: ` + `Título` del disparador. **Body** `Importe: ` + `Importe`. **Save**.

### Tarea 1.2 — Medir

4. Abre `SC - Registrar solicitud` y ejecútalo con la **prueba P1**:

| Prueba | Título | Área | Categoría | Cantidad | Precio unitario |
|---|---|---|---|---|---|
| P1 | Prueba de disparo P1 | Servicios | Papelería | 2 | 50 |
| P2 | Prueba de disparo P2 | Comercial | Servicios profesionales | 1 | 12000 |

5. Responde **Aprobar** a la aprobación que llegue. Espera un par de minutos y abre el historial (**28-day run history**) de `SC - Alertar compra grande`.

### Resultado esperado del Ejercicio 1

**Tres ejecuciones** por la prueba P1 (un importe de 100 USD):

| # | Qué la disparó |
|---|---|
| 1 | La **creación** de la fila (**Added**), con `Importe` todavía vacío |
| 2 | La primera actualización de `SC - Aprobar solicitud` (importe, nivel y estado **Pendiente**) |
| 3 | La segunda actualización, tras responder la aprobación (estado y comentario) |

Tres correos para una compra de 100 USD. Si ves más, alguien (tú, desde la tabla) modificó la fila a mano: cada edición también dispara.

> **Por qué ocurre:** **Modified** se dispara con **cualquier** actualización de la fila, también las que hacen otros flujos. Un flujo que actualiza la misma tabla que lo dispara es la fuente clásica de ejecuciones de más (y, si el disparador reacciona a lo que el propio flujo escribe, de bucles infinitos).

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Ejecuciones de `SC - Alertar compra grande` tras la prueba P1 | ___ (esperado: 3) |
| Cuál de las tres vio el `Importe` vacío en el correo | ___ |

---

## Ejercicio 2 — Solo cuando cambia el importe (**Select columns**)

**Objetivo:** que el flujo reaccione a **una columna**, no a toda la fila.

1. Edita `SC - Alertar compra grande`. En el disparador: **Change type** = **Modified** (ya no te interesa la creación, porque el importe nace vacío) y en los parámetros avanzados (**Show all**), **Select columns** = tu logical name del importe, por ejemplo `sit_importe` ([Learn: columnas de filtro](https://learn.microsoft.com/power-automate/dataverse/create-update-delete-trigger)). **Save**.
2. Crea otra solicitud con la **prueba P1** (con otro título, `Prueba de disparo P1b`) y responde la aprobación.
3. Cuenta las ejecuciones nuevas del historial.

### Resultado esperado del Ejercicio 2

**Una ejecución**: la de la primera actualización, la que **escribe** el importe. La segunda actualización (estado y comentario) no incluye la columna del importe, así que no dispara el flujo, y la creación ya no cuenta porque el **Change type** es **Modified**.

> **Qué hace realmente "Select columns":** el flujo solo se dispara si la actualización **incluye** alguna de esas columnas (Learn: solo aplica a las actualizaciones; con crear o eliminar se consideran todas las columnas, y las columnas de búsqueda no se admiten). No compara valores: si algo vuelve a escribir el importe con el mismo valor, el flujo se dispara de nuevo (por ejemplo, al usar **Resubmit** sobre el Lab 128). La idempotencia es el tema del Lab 133.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Ejecuciones tras la prueba P1b | ___ (esperado: 1) |
| ¿Se dispararía si un usuario editara solo el `Comentario del aprobador`? | ___ |

---

## Ejercicio 3 — Solo las compras grandes (**Filter rows**)

**Objetivo:** que el flujo ni siquiera arranque para compras pequeñas.

1. Edita el disparador y, en **Filter rows**, escribe una condición OData con tu logical name:

```text
sit_importe gt 10000
```

   `gt` es "mayor que" ([Learn: filtros OData en Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows)). Mantén **Select columns** del ejercicio anterior. **Save**.

2. Ejecuta la **prueba P1** (importe 100) con el título `Prueba de disparo P1c` y la **prueba P2** (importe 12.000). Responde las dos aprobaciones.

### Resultado esperado del Ejercicio 3

| Prueba | Importe | Ejecuciones de `SC - Alertar compra grande` |
|---|---|---|
| P1c | 100 | **0** |
| P2 | 12.000 | **1** |

> **Cuándo usar **Filter rows**:** cuando la regla es una comparación sencilla de columnas de la misma tabla. La evalúa Dataverse **antes** de avisar al flujo. Tiene límites: es sintaxis OData (nombres internos, valores de elección **numéricos**, sin funciones de Power Automate).

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Ejecuciones tras P1c y P2 | ___ y ___ |
| El importe que llegó en el correo de P2 | ___ (esperado: 12000) |

---

## Ejercicio 4 — Condiciones de desencadenador

**Objetivo:** reglas que **Filter rows** no puede expresar: dos columnas a la vez, textos, funciones, valores nulos.

### Tarea 4.1 — Reescribir la regla del Ejercicio 3 como condición

1. En `SC - Alertar compra grande`, borra el contenido de **Filter rows**. Abre los ajustes del disparador (**Settings**) y, en **Trigger conditions**, añade ([Learn: condiciones de desencadenador](https://learn.microsoft.com/power-automate/customize-triggers)):

```text
@greater(coalesce(triggerOutputs()?['body/sit_importe'], 0), 10000)
```

   Las condiciones de desencadenador son expresiones que empiezan por `@` y deben dar `true` para que el flujo se ejecute; si dan `false`, el flujo no se dispara y **no se registra ninguna ejecución** en el historial. `coalesce(x, 0)` evita el error cuando la columna llega vacía: una comparación con un valor nulo falla.
2. **Save** y repite las pruebas **P1** (título `P1d`) y **P2** (título `P2d`).

**Resultado esperado:** 0 ejecuciones para P1d y 1 para P2d. Sin **Filter rows**, el flujo llega al mismo resultado con una regla escrita en el lenguaje de expresiones.

### Tarea 4.2 — Una regla con dos columnas: `SC - Avisar a TI`

3. Crea un flujo automatizado nuevo, `SC - Avisar a TI`, con el mismo disparador (**Modified**, `Solicitudes de compra`, **Organization**, **Select columns** = `sit_importe`).
4. En **Trigger conditions**, la regla de la política: Tecnología desde el nivel 2, es decir, importe mayor que 1.000:

```text
@and(equals(triggerOutputs()?['body/sit_categoria'], 'Tecnología'), greater(coalesce(triggerOutputs()?['body/sit_importe'], 0), 1000))
```

5. Acción **Send an email (V2)** a tu correo: **Subject** `Revisión de TI: ` + `Título`.
6. Prueba con los casos del Lab 128 (puedes crearlos de nuevo con otros títulos; **responde las tres aprobaciones**, o el resumen del Ejercicio 5 las contará como pendientes): **Portátiles** (Tecnología, 3 × 1400 = 4.200) y **Sillas** (Mobiliario, 4 × 210 = 840), más una tercera, **Monitores** (Tecnología, 2 × 320 = 640).

### Resultado esperado de la Tarea 4.2

| Solicitud | Categoría | Importe | ¿Se dispara? | Por qué |
|---|---|---|---|---|
| Portátiles | Tecnología | 4200 | **Sí** | Tecnología y mayor que 1000 |
| Sillas | Mobiliario | 840 | No | No es Tecnología |
| Monitores | Tecnología | 640 | No | Tecnología, pero no supera 1000 |

> **Ojo con el texto:** la comparación `equals` distingue mayúsculas y tildes. Si la columna `Categoría` llegara como ` Tecnología ` (con espacios, como en las solicitudes sucias del Lab 130) o `Tecnologia`, la condición dará `false` **sin avisar**: el flujo simplemente no corre. Por eso, antes de confiar en una condición de texto, mira de dónde vienen los datos.

### Qué regla va en cada sitio

| Necesito… | Uso | Razón |
|---|---|---|
| Que reaccione a una columna concreta | **Select columns** | Evita disparos por columnas irrelevantes |
| Comparar una columna con un valor fijo | **Filter rows** | Lo evalúa Dataverse y es lo más simple |
| Combinar columnas, texto o funciones, o tolerar nulos | **Trigger conditions** | Lenguaje de expresiones completo |
| Mirar otras filas o llamar a otros servicios | **Condition** dentro del flujo | Un disparador no puede consultar nada más |

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Ejecuciones de `SC - Avisar a TI` para Portátiles, Sillas y Monitores | ___ , ___ , ___ (esperado: 1, 0, 0) |
| ¿Qué pasaría con `greater(triggerOutputs()?['body/sit_importe'], 1000)` si `Importe` llegara vacío? | ___ |

---

## Ejercicio 5 — Un resumen diario con criterio

**Objetivo:** que `SC - Resumen diario de pendientes` solo envíe correo cuando tiene algo que decir y solo en días laborables.

### Tarea 5.1 — De lunes a viernes

1. Abre `SC - Resumen diario de pendientes`. En **Recurrence**: **Frequency** = **Week**, **Interval** = `1`. En los parámetros avanzados: **On these days** = lunes a viernes, **At these hours** = `7`, **At these minutes** = `0`, **Time zone** la tuya ([Learn: flujos programados](https://learn.microsoft.com/power-automate/run-scheduled-tasks)).

> **Por qué **Week** y no **Day**:** **On these days** solo aparece con la frecuencia semanal. Con **Day** no hay forma declarativa de excluir fines de semana.

### Tarea 5.2 — Sin festivos

2. Los festivos no los conoce **Recurrence**. En **Settings** > **Trigger conditions**, escribe la lista de festivos del período como texto de fecha, comparada con la fecha **local** (la hora de ejecución llega en UTC; conviértela primero):

```text
@not(contains(createArray('2026-12-08', '2026-12-25'), formatDateTime(convertTimeZone(utcNow(), 'UTC', 'SA Pacific Standard Time'), 'yyyy-MM-dd')))
```

   `SA Pacific Standard Time` es el nombre de zona horaria de Windows para Bogotá, Lima y Quito ([Learn: `convertTimeZone`](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference#convertTimeZone)). (8 de diciembre y 25 de diciembre son festivos en Colombia; usa los de tu país.)
3. **No esperes a diciembre para probar la expresión**: añade una acción **Compose** provisional con esta variante, que fija la fecha en lugar de usar `utcNow()`:

```text
formatDateTime(convertTimeZone('2026-12-25T13:00:00Z', 'UTC', 'SA Pacific Standard Time'), 'yyyy-MM-dd')
```

   Ejecuta el flujo con **Test** > **Manually** (la prueba manual **envía el resumen**: hazla después de la Tarea 5.3 si no quieres un correo extra) y anota la salida de la **Compose**: `2026-12-25`. (13:00 UTC son las 08:00 de Bogotá, el mismo día.) Ahora cambia la fecha a `2026-12-26T03:00:00Z` y ejecuta otra vez: obtienes también `2026-12-25`: a las 03:00 UTC **aún es el día anterior** en Bogotá. Es la razón de convertir antes de formatear: sin `convertTimeZone` los festivos se correrían cinco horas. Borra la **Compose** provisional.

### Tarea 5.3 — Sin correo vacío

4. Después de **List rows**, añade **Control** > **Condition**. (Si tu diseñador no ofrece **Edit in advanced mode** en **Condition** ni en **Filter array**, no puedes pegar una expresión completa: pon a la izquierda la expresión **sin** `@`, con **fx**, el operador **is equal to** y a la derecha `true`, también con **fx**. Vale para las condiciones avanzadas de los Labs 129 a 131.) A la izquierda, la expresión:

```text
length(outputs('List_rows')?['body/value'])
```

   operador **is greater than**, a la derecha `0`. Mueve **Select**, **Create HTML table** y **Send an email (V2)** a la rama **True**. Deja **False** vacía.
5. Prueba dos veces: con la solicitud D del Lab 128 pendiente (correo con tabla) y después de responderla y las demás pendientes (sin correo).

### Resultado esperado del Ejercicio 5

- Con pendientes, un correo con una fila por pendiente.
- Sin pendientes, **ningún** correo y la ejecución termina correctamente: el historial muestra la condición en **False**, no un error.

> **Si cambia el nombre de la acción:** `outputs('List_rows')` usa el nombre de la acción con **guiones bajos**. Si la renombraste, usa ese nombre.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Salida de la **Compose** con `2026-12-26T03:00:00Z` | ___ (esperado: `2026-12-25`) |
| Correos recibidos cuando no hay pendientes | ___ (esperado: 0) |

---

## Ejercicio 6 — Validar las entradas del flujo instantáneo

**Objetivo:** que `SC - Registrar solicitud` rechace valores imposibles antes de escribir en Dataverse.

1. Abre `SC - Registrar solicitud`. Entre el disparador y **Add a new row**, añade **Control** > **Condition**. Cambia a modo avanzado (o usa la alternativa de la nota del Ejercicio 5) y escribe (las claves `number` y `number_1` las genera el disparador a partir de tus entradas `Cantidad` y `Precio unitario`: elígelas desde **Dynamic content** y no las escribas de memoria):

```text
@or(less(triggerBody()?['number'], 1), not(equals(mod(triggerBody()?['number'], 1), 0)), lessOrEquals(triggerBody()?['number_1'], 0))
```

   Lee: "la cantidad es menor que 1, o no es un entero, o el precio no es positivo".
2. En **True**: **Control** > **Terminate**, **Status** = **Failed**, **Code** `ENTRADA_INVALIDA`, **Message** `La cantidad debe ser un entero mayor que 0 y el precio mayor que 0` ([Learn: Terminate](https://learn.microsoft.com/power-automate/error-handling)). En **False**: mueve **Add a new row**.
3. Prueba tres veces (responde la aprobación del caso válido): cantidad `0`; cantidad `4.5` (con punto: con la configuración en inglés la coma no es decimal); y cantidad `2` con precio `50`.

### Resultado esperado del Ejercicio 6

| Cantidad | Precio | Resultado |
|---|---|---|
| 0 | 50 | **Failed** con el mensaje; no se crea ninguna fila |
| 4.5 | 50 | **Failed**; no se crea ninguna fila |
| 2 | 50 | Se crea la fila y el flujo termina bien |

> **Por qué mejor rechazar que corregir:** sin esta condición, el 4.5 fallaría más tarde (**Add a new row** no puede guardar decimales en una columna de enteros) con un mensaje técnico. Aquí el mensaje habla el idioma del negocio.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| Sigues viendo tres ejecuciones tras poner **Select columns** | **Change type** sigue en **Added or Modified**: la creación también dispara | **Change type** = **Modified** |
| El flujo no se dispara nunca con **Filter rows** | Nombre visible en vez de logical name, o valor de elección entre comillas | Logical name en minúsculas; elecciones por su valor numérico |
| La condición de desencadenador da error al guardar | Falta el `@` inicial o las comillas | Empieza por `@`; los textos van entre comillas simples |
| El flujo "no hace nada" y no hay ejecuciones | La condición da `false` (texto con espacios o tildes distintas, valor nulo) | Prueba la expresión en una **Compose**; usa `coalesce` |
| El resumen llega a las 02:00 en vez de a las 07:00 | **Time zone** sin configurar (UTC) | Configura **Time zone** en **Recurrence** |
| **Terminate** deja el flujo en **Failed** y alguien lo ve como un fallo del sistema | Se usó **Failed** para algo previsto | Para rechazos de negocio, usa un mensaje claro; en el Lab 133 verás cuándo usar **Cancelled** |

## 🔧 Diagnóstico y reparación

### "El flujo de TI no se disparó con una compra de Tecnología de 4.200"

1. **¿El flujo está activo?** Mira su estado.
2. **¿La actualización incluyó la columna de **Select columns**?** Abre la ejecución de `SC - Aprobar solicitud` y comprueba que **Update a row** escribió el importe.
3. **¿La condición da `true`?** Copia la expresión a una **Compose** con valores fijos (`equals('Tecnología', 'Tecnología')`) y compáralos letra por letra: tildes, espacios, mayúsculas.
4. **¿El disparador tardó?** Tras guardar, espera un par de minutos antes de probar.

## Checklist final

- [ ] Tabla de ejecuciones medidas: 3 → 1 → 0/1 → 0/1
- [ ] `SC - Alertar compra grande` con **Select columns** y una condición de desencadenador (sin **Filter rows**)
- [ ] `SC - Avisar a TI` con la condición de dos columnas y las tres pruebas
- [ ] Resumen diario de lunes a viernes, con la condición de festivos probada en una **Compose** y sin correo vacío
- [ ] Validación de entradas con **Terminate** probada con 0, 4.5 y un caso válido

## Evidencia esperada

- Captura de la tabla de ejecuciones por versión (historial de `SC - Alertar compra grande`)
- Captura de las condiciones de desencadenador de los dos flujos
- Captura de la ejecución **Failed** con el mensaje de **Terminate**
- Tus respuestas de validación y la tabla "Qué regla va en cada sitio" con un ejemplo propio

## Criterios de aprobación

- Mides, no supones: cada versión del flujo tiene su conteo de ejecuciones
- Las ejecuciones coinciden con las esperadas (3, 1, 0/1 y 0/1; y 1, 0 y 0 para TI)
- La condición de festivos está probada con fechas fijas y convierte la zona horaria antes de formatear
- Explicas cuándo usar **Select columns**, **Filter rows** y las condiciones de desencadenador

## Competencias desarrolladas

- Diagnosticar ejecuciones de más en desencadenadores de Dataverse
- Elegir entre columnas, filas y condiciones para limitar un desencadenador
- Escribir condiciones tolerantes a nulos con `coalesce`
- Programar recurrencias con días, zona horaria y festivos
- Validar entradas de un flujo instantáneo con **Terminate**

## Reto adicional

**Reto básico:** añade a `SC - Avisar a TI` el nivel de aprobación en el asunto del correo.

**Reto intermedio:** el flujo de TI avisa una vez por cada escritura del importe. Escribe en dos líneas cómo evitarías el aviso duplicado si el importe se reescribe (pista: ¿qué dato de la fila podrías guardar para recordar que ya avisaste? El Lab 133 lo resuelve).

**Reto avanzado:** haz que la lista de festivos no esté escrita en el disparador: guárdala en una tabla de Dataverse, léela en el flujo y decide qué cambia (¿una condición de desencadenador puede leer una tabla?).

## Preguntas de repaso

1. ¿Por qué **Added or Modified** produjo tres ejecuciones para una sola solicitud?
2. ¿Qué diferencia hay entre **Select columns** y **Filter rows**?
3. ¿Por qué se usa `coalesce` en una condición de desencadenador?
4. ¿Por qué se convierte la zona horaria **antes** de formatear la fecha?

## Limpieza del laboratorio

Deja activos `SC - Alertar compra grande`, `SC - Avisar a TI` y el resumen diario: los usarás en los labs siguientes. Apaga cualquier flujo de prueba que hayas creado de más. Si dejaste el correo de **Alertar compra grande** a tu propia cuenta, no pasa nada: es de práctica.

## Siguiente laboratorio recomendado

**Lab 130 — Expresiones y datos** (siguiente): `Select`, `Filter array`, `formatDateTime`, `coalesce` y los datos sucios del Excel de solicitudes históricas.
