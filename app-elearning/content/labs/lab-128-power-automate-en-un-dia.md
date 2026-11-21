---
id: lab-128
title: "Power Automate en un día: de la solicitud de compra a la aprobación (Ruta Pro Power Automate)"
level: "N2"
duration: 300
product: ["Power Automate", "Dataverse"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Módulo 5 (Power Automate básico) recomendado"
  - "Ambiente del curso con Dataverse y una prueba o licencia de Power Automate que incluya conectores premium"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 128 — Power Automate en un día: de la solicitud de compra a la aprobación

## Objetivo

Construir de punta a punta, en una sola jornada, la primera versión del proceso de compras de SIT: una tabla de Dataverse dentro de una solución, un **flujo instantáneo** para registrar solicitudes, un **flujo automatizado** que calcula el importe y el nivel de aprobación según la política de la empresa, pide la aprobación y avisa al solicitante, y un **flujo programado** que envía cada mañana el resumen de lo pendiente. Es el lab "en un día" de la Ruta Pro Power Automate: los labs siguientes toman cada pieza y la llevan a nivel profesional.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT), la misma de la Ruta Pro Power BI. Ahora el problema es de **Compras**.

**Problema a resolver:** las áreas piden compras por correo. Nadie sabe quién tiene que aprobar qué, las solicitudes se pierden en bandejas de entrada y Finanzas se entera de una compra de 18.000 USD cuando llega la factura. La política existe (está en `politica-aprobacion.json`): hasta 1.000 USD aprueba el jefe de área; hasta 10.000, además Finanzas; por encima, también la Gerencia general. Lo que falta es que se cumpla sola.

## Lo que vas a construir

- La solución `SIT Compras` con la tabla `Solicitud de compra`
- El flujo instantáneo `SC - Registrar solicitud`, con entradas que limitan los valores permitidos
- El flujo automatizado `SC - Aprobar solicitud`: importe, nivel según la política, aprobación, actualización de la fila y correo al solicitante
- El flujo programado `SC - Resumen diario de pendientes`, con una tabla HTML en el correo
- Cuatro solicitudes de prueba con resultado conocido, y el historial de ejecuciones revisado

## Relación con la Ruta Pro

| En este lab (versión mínima) | Se profundiza en |
|---|---|
| Disparador de Dataverse sin filtros | Lab 129 (filtros de filas, columnas y condiciones de desencadenador) |
| Expresiones `mul` e `if` | Lab 130 (expresiones, arrays, datos sucios de Excel) |
| Una sola aprobación, aunque la política pida dos o tres niveles | Lab 131 (aprobaciones secuenciales, en paralelo, escalado) |
| `List rows` con un filtro | Lab 132 (OData, FetchXML, paginación, upsert) |
| Sin manejo de errores | Lab 133 (Try/Catch, reintentos, idempotencia) |
| Umbrales escritos dentro del flujo | Lab 136 (variables de entorno y ALM, con la tolerancia de conciliación como ejemplo) |

> **Fuente del esqueleto:** los labs 1 a 7 del curso oficial PL-7002 de Microsoft Learning ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-7002-Create-and-Manage-Automated-Processes-by-using-Power-Automate)): flujos, modelo en Dataverse, aprobación, flujo de botón, flujo programado y filtros. El caso, los datos y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Solución y tabla | 45 min |
| Ejercicio 2 — Registrar solicitudes con un flujo instantáneo | 30 min |
| Ejercicio 3 — El flujo de aprobación | 85 min |
| Ejercicio 4 — Probar con cuatro casos | 45 min |
| Ejercicio 5 — El resumen diario | 50 min |
| Ejercicio 6 — Leer el historial y reenviar una ejecución | 15 min |
| Ejercicio 7 (opcional) — El mismo flujo con Copilot | 20 min |
| **Total** | **unas 5 h** (mejor en dos sesiones: Ejercicios 1 a 3 y 4 a 7) |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional; no hay un examen vigente específico de Power Automate)

## Tecnologías utilizadas

- Power Apps (maker): **Solutions**, tablas y columnas de Dataverse
- Power Automate: flujo instantáneo (**Manually trigger a flow**), automatizado (**When a row is added, modified or deleted**), programado (**Recurrence**); **Start and wait for an approval**; **Update a row**, **List rows**; **Select**, **Create HTML table**; **Send an email (V2)**; expresiones `mul` e `if`

## Prerrequisitos

### Entorno

- [ ] El **ambiente del curso** con Dataverse ([Entornos y trials](/recursos/entornos-y-trials)), en inglés (United States), y el rol **System Administrator** (lo tienes si el ambiente es un Trial tuyo). Learn indica que, en un ambiente que no es el predeterminado, quien ejecuta el **primer** flujo de aprobación debe tener un rol de administrador del ambiente: con **System Customizer** la primera aprobación puede fallar ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/get-started-approvals))
- [ ] **Licencia:** Dataverse es un conector **premium**. Si tu cuenta no tiene Power Automate Premium, inicia la prueba de Power Automate desde el portal: Learn indica que dura **90 días**, que la puede iniciar el propio usuario y que da las capacidades de Premium (incluidos los conectores premium), salvo créditos de AI Builder y capacidad de almacenamiento ([Learn: tipos de licencia](https://learn.microsoft.com/power-platform/admin/power-automate-licensing/types)). Tu organización puede tener desactivadas las pruebas: en ese caso, pide la licencia a tu administrador
- [ ] Un buzón de Outlook en esa cuenta (para **Send an email (V2)**) y acceso a Microsoft Teams o al correo para responder aprobaciones
- [ ] El paquete [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip) descargado y extraído. En este lab solo usas `politica-aprobacion.json`

### Conocimiento previo

- [Módulo 5](/nivel/basico/modulo/power-automate-automatizacion-basica): disparadores, acciones, condiciones y flujo programado
- [Módulo 2](/nivel/basico/modulo/dataverse-fundamentos-y-modelado-basico): tablas, columnas y soluciones (el publicador `SIT`)

### Verificación rápida antes de empezar

- [ ] En [make.powerautomate.com](https://make.powerautomate.com), arriba a la derecha, estás en el ambiente del curso
- [ ] Abre `politica-aprobacion.json` y localiza los dos umbrales: **1000** y **10000** USD

---

## Ejercicio 1 — Solución y tabla

**Objetivo:** todo lo que construyas en la ruta vive en una solución, desde el primer día ([Learn: crear una solución](https://learn.microsoft.com/power-apps/maker/data-platform/create-solution)).

### Tarea 1.1 — La solución

1. En [make.powerapps.com](https://make.powerapps.com), menú izquierdo **Solutions** > **New solution**.
2. **Display Name** `SIT Compras`. En **Publisher**, elige `SIT` si ya lo creaste en el Módulo 2 o el Lab 02 (prefijo `sit`). Si no, **New publisher**: **Display Name** `SIT`, **Prefix** `sit`, y **Save**.
3. **Create** (o **Save**, según la versión del panel).

### Tarea 1.2 — La tabla `Solicitud de compra`

1. Dentro de la solución, **New** > **Table** > **Table (advanced properties)**, como en el Módulo 2. **Display name** `Solicitud de compra`, **Plural display name** `Solicitudes de compra`. En la pestaña **Primary column**, cambia el nombre a `Título` ([Learn: crear tablas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal)).
2. **Save**. Luego, con **New column**, añade estas columnas ([Learn: columnas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal)):

| Display Name | Data type | Required | Para qué |
|---|---|---|---|
| `Área` | Text | Business required | Quién pide |
| `Categoría` | Text | Business required | Qué se compra |
| `Cantidad` | Whole Number | Business required | |
| `Precio unitario` | Decimal Number | Business required | En USD |
| `Importe` | Decimal Number | No | Lo calcula el flujo |
| `Nivel de aprobación` | Whole Number | No | Lo calcula el flujo: 1, 2 o 3 |
| `Estado solicitud` | Choice: elección local nueva (**Sync with global choice?** = **No**) con **Pendiente**, **Aprobada** y **Rechazada**, y **Default choice** = **Pendiente** | No | Lo escribe el flujo |
| `Correo del solicitante` | Email | Business required | A quién se avisa |
| `Comentario del aprobador` | Multiline Text | No | Lo escribe el flujo |

> **Por qué `Área` y `Categoría` son texto y no una elección:** en este lab las solicitudes entran por un flujo instantáneo cuyas entradas son texto. Escribir texto en una columna de elección exige traducirlo al valor numérico de la opción, y eso es tema del Lab 130. Aquí la lista desplegable del disparador (Ejercicio 2) es la que impide valores inventados.

> **Por qué `Estado solicitud` y no `Estado`:** toda tabla de Dataverse trae ya una columna de sistema llamada **Status** (y **Status Reason**), que indica si la fila está activa. Usar otro nombre evita confundirlas en los flujos.

3. **Anota los nombres internos en minúsculas.** Abre cada columna y, en **Advanced options**, mira el **Schema name**: verás algo como `sit_PrecioUnitario`. Las expresiones y los filtros de los flujos usan el **logical name**, que es ese mismo nombre **en minúsculas** (`sit_preciounitario`), como en el Módulo 2, y distinguen mayúsculas. Dataverse quita los espacios y puede quitar las letras con tilde ("Título" puede quedar como `sit_ttulo`): **anota el tuyo**, no el de este lab. Para la tabla, en **Properties** > **Advanced options** verás su **Schema name**; el nombre en plural para la API (**entity set name**) lo copias desde **Tools** > **Copy set name**.
4. Anota el **valor numérico** de la opción **Pendiente** (un número largo que empieza por el prefijo de valores de tu publicador): lo necesitarás en el Ejercicio 5. Puedes verlo al editar la elección de la columna `Estado solicitud`, junto a cada opción. Si no lo encuentras, hay un camino seguro: después del Ejercicio 4, abre una ejecución del flujo de aprobación y mira las salidas de **Update a row**; ahí aparece el número de la opción que se guardó (como en el Módulo 5).

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Logical names (minúsculas) de `Título`, `Precio unitario`, `Importe`, `Nivel de aprobación` y `Estado solicitud` | ___ |
| Valor numérico de **Pendiente** | ___ |

---

## Ejercicio 2 — Registrar solicitudes con un flujo instantáneo

**Objetivo:** una forma fiable de crear solicitudes con valores válidos, sin construir todavía una app.

1. En la solución, **New** > **Automation** > **Cloud flow** > **Instant**. Nombre `SC - Registrar solicitud`, disparador **Manually trigger a flow**. **Create** ([Learn: flujos en soluciones](https://learn.microsoft.com/power-automate/create-flow-solution)).
2. En el disparador, añade estas entradas (**Add an input**):

| Tipo | Nombre | Detalle |
|---|---|---|
| Text | `Título` | |
| Text | `Área` | Lista desplegable con las opciones `Comercial`, `Finanzas`, `TI`, `Operaciones`, `Talento humano`, `Servicios` |
| Text | `Categoría` | Lista desplegable con `Tecnología`, `Mobiliario`, `Servicios profesionales`, `Capacitación`, `Viajes`, `Papelería` |
| Number | `Cantidad` | |
| Number | `Precio unitario` | |
| Email | `Correo del solicitante` | |

   Para la lista desplegable, en el menú **…** de la entrada de texto elige **Add a drop-down list of options** y escribe una opción por línea. En `Cantidad`, escribe enteros: un 4.5 falla al guardarse en una columna **Whole Number**.
3. **+** > **Add an action** > **Microsoft Dataverse** > **Add a new row**. **Table name** `Solicitudes de compra`. Rellena cada columna con la entrada del mismo nombre desde **Dynamic content** (el rayo). Deja `Importe`, `Nivel de aprobación`, `Estado solicitud` y `Comentario del aprobador` vacíos: los calcula el otro flujo.
4. **Save**. La primera vez que lo ejecutes, Power Automate te pedirá confirmar las conexiones (**Continue**).

> **Learn llama a esto "flujo de botón"** en el curso PL-7002: se ejecuta cuando alguien lo lanza, desde el portal, la app móvil o Teams. Es la entrada provisional del proceso; en un proyecto real sería una app o un formulario.

---

## Ejercicio 3 — El flujo de aprobación

**Objetivo:** el corazón del proceso. Cuando se crea una solicitud, calcular su importe y su nivel, pedir la aprobación y dejar constancia del resultado.

1. En la solución, **New** > **Automation** > **Cloud flow** > **Automated**. Nombre `SC - Aprobar solicitud`. Disparador **When a row is added, modified or deleted** (Microsoft Dataverse). **Create**.
2. Configura el disparador ([Learn: disparador de Dataverse](https://learn.microsoft.com/power-automate/dataverse/create-update-delete-trigger)):
   - **Change type**: **Added**.
   - **Table name**: `Solicitudes de compra`.
   - **Scope**: **Organization** (cualquier fila de la organización, no solo las tuyas).

   > **¿No se vuelve a disparar cuando el propio flujo actualice la fila?** No: con **Change type** = **Added**, solo lo dispara la creación de una fila. Las actualizaciones que hace el flujo (importe, nivel, estado) no lo vuelven a lanzar. Si eligieras **Added or Modified**, sí habría un bucle.

### Tarea 3.1 — Importe y nivel

3. **+** > **Data Operation** > **Compose**. Renómbrala `Calcular importe` (en el diseñador nuevo, haz clic en el título de la acción en su panel; en el clásico, menú **…** > **Rename**). Usa un nombre distinto del de la columna `Importe`: si no, verás dos "Importe" en **Dynamic content** y es fácil elegir el equivocado. En **Inputs**, abre el editor de expresiones (**fx**) y escribe `mul(`; luego, en la pestaña **Dynamic content**, elige `Cantidad` y `Precio unitario` del disparador, separados por una coma:

```text
mul(triggerBody()?['sit_cantidad'], triggerBody()?['sit_preciounitario'])
```

   Al elegir los campos desde **Dynamic content**, el editor puede escribirlos como `triggerOutputs()?['body/sit_cantidad']`: es lo mismo. Y si tus logical names son distintos, los escribe bien por ti.

4. Otra **Compose**, renombrada `Calcular nivel` (en las expresiones, los espacios del nombre de una acción se escriben con guion bajo):

```text
if(lessOrEquals(outputs('Calcular_importe'), 1000), 1, if(lessOrEquals(outputs('Calcular_importe'), 10000), 2, 3))
```

   `lessOrEquals` es "menor o igual": 1000 exactos es nivel 1, como dice la política (`reglaDeLimites`). Usar `less` haría que 1000 fuera nivel 2.

5. **Update a row** (Microsoft Dataverse) ([Learn: actualizar una fila](https://learn.microsoft.com/power-automate/dataverse/update)): **Table name** `Solicitudes de compra`, **Row ID** = el identificador de la fila del disparador (en **Dynamic content**, el que lleva el nombre de la tabla). En los parámetros avanzados (**Show all**), `Importe` = **Outputs** de `Calcular importe`, `Nivel de aprobación` = **Outputs** de `Calcular nivel`, `Estado solicitud` = **Pendiente**.

### Tarea 3.2 — La aprobación

6. **Approvals** > **Start and wait for an approval** ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/get-started-approvals)):
   - **Approval type**: **Approve/Reject - First to respond**.
   - **Title**: `Compra: ` + `Título` + ` (nivel ` + **Outputs** de `Calcular nivel` + `)`.
   - **Assigned to**: **tu propio correo** (haces de jefe de área para probar).
   - **Details**: el área, la categoría, la cantidad, el precio unitario y el importe, como una lista con guiones (`- Área: …`), uno por línea. **Details** admite Markdown: un salto de línea simple se pierde y todo sale en una línea; la lista con `-` o una línea en blanco entre campos lo evita. Learn advierte además que la app de aprobaciones de Teams no muestra el Markdown ([Learn: Markdown en aprobaciones](https://learn.microsoft.com/power-automate/approvals-markdown-support)).

> **Una sola aprobación, aunque la política pida tres niveles.** Este lab registra el nivel y lo muestra en el título, pero pide una sola aprobación. Las cadenas de dos y tres niveles, con Finanzas y Gerencia, son el Lab 131. Escríbelo en la descripción del flujo para que nadie crea que ya cumple la política.

### Tarea 3.3 — El resultado

7. **Control** > **Condition**. A la izquierda, el resultado de la aprobación (en **Dynamic content** de la aprobación: **Outcome**; según la versión del diseñador puede aparecer como la respuesta del aprobador). Operador **is equal to**, a la derecha `Approve`.
8. En **True**: **Update a row** de la misma fila con `Estado solicitud` = **Aprobada** y `Comentario del aprobador` = el comentario de la respuesta. En **False**: lo mismo con **Rechazada**.

   > **Cuidado con el bucle que aparece solo:** **Responses comments** pertenece a la lista de respuestas de la aprobación. Si lo eliges desde **Dynamic content**, el diseñador mete la acción dentro de un **For each** automáticamente. Con **First to respond** hay una sola respuesta, así que es mejor tomarla directamente con una expresión (**fx**): `first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']`. (Si renombraste la acción de aprobación, usa su nombre con guiones bajos.)
9. Después de la condición (fuera de las dos ramas), **Office 365 Outlook** > **Send an email (V2)**: **To** = `Correo del solicitante` del disparador; **Subject** = `Tu solicitud "` + `Título` + `" fue ` + la expresión `if(equals(outputs('Start_and_wait_for_an_approval')?['body/outcome'], 'Approve'), 'aprobada', 'rechazada')` (el resultado de la aprobación viene en inglés: `Approve` o `Reject`); **Body** con el importe, el nivel y el comentario (la misma expresión con `first(...)` del paso 8).
10. **Save**. Usa el **Flow checker** del diseñador para ver si hay avisos. Tras guardar, espera un par de minutos antes de probar: el disparador tarda en registrarse.

> **Por qué el correo va después de la condición y no dentro de cada rama:** así hay un solo correo que mantener. Si mañana cambia el texto, lo cambias en un sitio.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Expresión de `Nivel` (como la dejaste) | ___ |
| Avisos del **Flow checker** | ___ |

---

## Ejercicio 4 — Probar con cuatro casos

**Objetivo:** comprobar el flujo con casos elegidos para tocar los límites de la política.

1. Abre `SC - Registrar solicitud` y ejecútalo (**Run** o **Test** > **Manually**) cuatro veces, con tu propio correo como solicitante:

| Caso | Título | Área | Categoría | Cantidad | Precio unitario |
|---|---|---|---|---|---|
| A | Sillas ergonómicas para Servicios | Servicios | Mobiliario | 4 | 210 |
| B | Reposición de tóner | Operaciones | Papelería | 10 | 100 |
| C | Portátiles para nuevos analistas | TI | Tecnología | 3 | 1400 |
| D | Estudio de mercado regional | Comercial | Servicios profesionales | 1 | 18500 |

2. Cada ejecución crea una fila y dispara `SC - Aprobar solicitud`. Recibirás cuatro solicitudes de aprobación (en Teams, en el correo o en **Approvals** del portal de Power Automate). La primera vez que se usan las aprobaciones en un ambiente puede tardar unos minutos.
3. **Aprueba A y C, rechaza B** con el comentario "Usar el contrato marco de papelería", y **deja D sin responder** (la usarás en el Ejercicio 5).

### Resultado esperado del Ejercicio 4

| Caso | Importe | Nivel | Estado solicitud tras responder |
|---|---|---|---|
| A | 840 | **1** | Aprobada |
| B | 1000 | **1** (el límite está incluido) | Rechazada, con el comentario |
| C | 4200 | **2** | Aprobada |
| D | 18500 | **3** | Pendiente (la ejecución sigue esperando) |

Y tres correos al solicitante (A, B y C). D no recibe correo: su flujo sigue esperando la aprobación.

> **Si B sale con nivel 2**, usaste `less` en lugar de `lessOrEquals`. Es el error más común con los umbrales: la política dice "hasta 1.000", y "hasta" incluye el 1.000.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Nivel de los casos A, B, C y D | ___ |
| Estado de la ejecución del caso D en el historial | ___ |

---

## Ejercicio 5 — El resumen diario

**Objetivo:** que Finanzas reciba cada mañana la lista de solicitudes que siguen pendientes ([Learn: flujos programados](https://learn.microsoft.com/power-automate/run-scheduled-tasks)).

1. En la solución, **New** > **Automation** > **Cloud flow** > **Scheduled**. Nombre `SC - Resumen diario de pendientes`. En el disparador **Recurrence**: **Interval** `1` y **Frequency** **Day**; en los parámetros avanzados, la **Time zone** de tu ciudad (por ejemplo "(UTC-05:00) Bogota, Lima, Quito") y **At these hours** = `7` y **At these minutes** = `0`. Si prefieres **Start time**, es un texto con formato `2026-11-20T07:00:00` (sin `Z` al final si eliges zona horaria: la `Z` significa UTC).
2. **List rows** (Microsoft Dataverse) ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)): **Table name** `Solicitudes de compra`. En **Filter rows**, con tu nombre interno y el valor que anotaste en el Ejercicio 1:

```text
sit_estadosolicitud eq 123456789
```

   (Cambia `sit_estadosolicitud` por tu logical name y `123456789` por el valor numérico de **Pendiente**. Filtrar por el texto "Pendiente" no funciona: una columna de elección guarda un número.) En **Select columns**, escribe solo las columnas que usarás, con los logical names que anotaste en el Ejercicio 1, separados por comas y sin espacios (`<título>,<importe>,<nivel>`): el flujo trae menos datos y es más rápido.
3. **Data Operation** > **Select**. **From** = `value` de **List rows**. En **Map**, tres columnas: `Solicitud` = `Título`, `Importe USD` = `Importe`, `Nivel` = `Nivel de aprobación`.
4. **Data Operation** > **Create HTML table**. **From** = salida de **Select**, **Columns** automáticas ([Learn: operaciones de datos](https://learn.microsoft.com/power-automate/data-operations)).
5. **Send an email (V2)** a tu correo, **Subject** `Compras pendientes de aprobación`, **Body** con una frase y la salida de **Create HTML table**.
6. **Save** y pruébalo ahora con **Test** > **Manually** (no esperes a mañana).

### Resultado esperado del Ejercicio 5

Un correo con una tabla de **una fila**: `Estudio de mercado regional`, `18500`, `3` (si haces este ejercicio después del 6 y dejaste sin responder la aprobación reenviada de B, B también saldrá). Si respondes la aprobación de D y vuelves a probar, observa qué llega en el correo cuando no hay pendientes, y decide si en ese caso debería enviarse (el Lab 129 enseña a no enviarlo).

> **Por qué `Select` antes de la tabla HTML:** sin él, la tabla HTML incluiría todas las columnas que devuelve Dataverse, con nombres internos y metadatos. `Select` elige qué columnas y con qué encabezado.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Filas de la tabla del correo | ___ (esperado: 1) |
| Tu decisión sobre el correo vacío | ___ |

---

## Ejercicio 6 — Leer el historial y reenviar una ejecución

**Objetivo:** saber qué pasó en cada ejecución y repetir una sin volver a crear la fila ([Learn: corregir errores de flujos](https://learn.microsoft.com/power-automate/fix-flow-failures)).

1. Abre `SC - Aprobar solicitud`. En **28-day run history** verás al menos cuatro ejecuciones (más, si hiciste pruebas antes): tres terminadas y una en curso, la del caso D. Identifica cada caso por el `Título` en las entradas del disparador.
2. Abre la ejecución del caso C y revisa cada acción: las entradas y salidas de `Importe` y `Nivel`, y el resultado de la aprobación.
3. En la ejecución del caso B, usa **Resubmit**: el flujo vuelve a ejecutarse con los mismos datos del disparador. Responde la nueva aprobación aprobándola esta vez y mira qué pasa con la fila.

### Resultado esperado del Ejercicio 6

La fila de B pasa a **Aprobada** y el solicitante recibe un segundo correo. **Reenviar no es gratis:** repite todas las acciones, incluidas las que ya se habían hecho (la aprobación, el correo). En el Lab 133 aprenderás a que un flujo pueda repetirse sin duplicar efectos (idempotencia).

---

## Ejercicio 7 (opcional) — El mismo flujo con Copilot

**Objetivo:** comparar lo construido a mano con lo que propone Copilot.

1. En [make.powerautomate.com](https://make.powerautomate.com), **Create** > la opción para describir el flujo con lenguaje natural (**Describe it to design it**) y escribe, en inglés: *"When a row is added to the Solicitudes de compra table in Dataverse, start an approval assigned to me, and update the row status to Aprobada or Rechazada depending on the outcome, then email the requester."*
2. No lo guardes en la solución. Compara: ¿calculó el importe y el nivel? ¿Usó **Scope** **Organization**? ¿Puso el correo después de la condición? Anota tres diferencias.

> Copilot puede no estar disponible en todas las regiones; si no aparece, salta este ejercicio. Lo generado es un borrador: revísalo como revisarías el trabajo de otra persona ([Módulo 43](/nivel/ia/modulo/copilot-en-power-platform)).

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| No puedes usar el conector de Dataverse ("premium") | La cuenta no tiene licencia premium ni prueba | Inicia la prueba de Power Automate o pide licencia |
| El flujo no se dispara al crear una fila | **Scope** en **User** y la fila la creó otro usuario, o el flujo está apagado | **Scope** = **Organization** y comprueba que el flujo está activo |
| `mul` da error "expects its parameter to be a number" | El campo llegó vacío o con otro nombre interno | Elige los campos desde **Dynamic content** y revisa que las entradas son obligatorias |
| B sale con nivel 2 | `less` en vez de `lessOrEquals` | Ejercicio 3, paso 4 |
| La condición siempre va por **False** | Se comparó con `Approved`, `aprobar` o con otro campo | El resultado es `Approve` o `Reject` |
| **List rows** devuelve todas las filas o un error de filtro | Se filtró por el texto "Pendiente" o con el nombre visible de la columna | Nombre interno y valor numérico (Ejercicio 1) |
| La tabla del correo trae decenas de columnas raras | Falta el **Select** | Ejercicio 5, paso 3 |

## 🔧 Diagnóstico y reparación

### "Creé la solicitud y no me llegó ninguna aprobación"

1. **¿Se creó la fila?** Abre la tabla en Power Apps y búscala.
2. **¿Se disparó el flujo?** En el historial de `SC - Aprobar solicitud`: si no hay ejecución, revisa **Change type**, **Table name** y **Scope**.
3. **¿Falló una acción?** Abre la ejecución: la acción en rojo dice por qué.
4. **¿La aprobación está esperando?** Mira **Approvals** en el portal de Power Automate; quizá llegó, pero no a la bandeja que esperabas.

## Checklist final

- [ ] Solución `SIT Compras` con la tabla `Solicitud de compra` y sus 10 columnas
- [ ] Flujo instantáneo con listas desplegables en `Área` y `Categoría`
- [ ] Flujo de aprobación con importe, nivel, aprobación, actualización y correo
- [ ] Casos A, B, C y D con niveles 1, 1, 2 y 3
- [ ] Resumen diario con una fila (D) mientras está pendiente
- [ ] Una ejecución reenviada y su efecto anotado

## Evidencia esperada

- Captura de la tabla con las cuatro solicitudes y sus estados
- Captura del flujo de aprobación completo en el diseñador
- Captura del correo del resumen diario
- Tus respuestas de validación, incluida la decisión sobre el correo vacío

## Criterios de aprobación

- Los tres flujos están en la solución `SIT Compras`
- Los niveles de los cuatro casos coinciden con la política, incluido el límite de 1.000
- El resumen diario filtra por el valor de la elección, no por el texto
- Sabes leer el historial y explicas qué hace **Resubmit** y por qué no es inocuo

## Competencias desarrolladas

- Crear tablas de Dataverse en una solución para un proceso
- Crear flujos instantáneos, automatizados y programados
- Calcular con expresiones y aplicar reglas de negocio con umbrales
- Pedir aprobaciones y actuar según su resultado
- Leer el historial de ejecuciones y reenviar una ejecución

## Reto adicional

**Reto básico:** añade al correo del solicitante el nombre de quien respondió la aprobación (está en las respuestas de la aprobación).

**Reto intermedio:** haz que el resumen diario no envíe el correo si no hay pendientes (pista: una condición sobre el número de elementos de `value`, con la función `length`).

**Reto avanzado:** guarda la política en una tabla de Dataverse (`Nivel`, `Importe hasta`) y haz que el flujo lea los umbrales de ahí en lugar de tenerlos escritos en la expresión. Anota en dos líneas qué ganas y qué complicas. (El Lab 136 resuelve lo mismo con variables de entorno.)

## Preguntas de repaso

1. ¿Por qué el disparador usa **Scope** **Organization**?
2. ¿Por qué `lessOrEquals` y no `less` en la expresión del nivel?
3. ¿Por qué se filtra por el valor numérico de la elección y no por su texto?
4. ¿Qué riesgo tiene reenviar una ejecución de un flujo que manda correos?

## Limpieza del laboratorio

No borres nada: los labs siguientes trabajan sobre la solución `SIT Compras`. Si la ejecución del caso D sigue esperando, puedes responderla o cancelarla desde el historial: una ejecución no espera para siempre (caduca a los 28 días según la página de problemas conocidos de Learn, 30 según la de límites) y el Lab 131 enseña a decidir qué pasa cuando nadie responde.

## Siguiente laboratorio recomendado

**Lab 129 — Desencadenadores que no se disparan de más**: filtros de filas y columnas, condiciones de desencadenador, recurrencias y flujos instantáneos con entradas.
