---
moduleId: 74
title: "Errores, logging e idempotencia"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 24
practiceMinutes: 240
slug: "errores-logging-idempotencia"
lastVerified: "2026-11"
---
*Lectura: 22-24 min · Práctica: unas 4 horas la primera vez, mejor en tres sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3 con el fallo simulado; la tercera, el diagnóstico, el ejercicio sin pasos y el reto de transferencia).*

## 🎯 Objetivo

Manejar errores esperados e inesperados con scopes, recuperación, retry, backoff, logging, correlation ID, capturas controladas, compensación, checkpoints, reanudación y cierre seguro.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica real en Power Automate for desktop (PAD) con **evidencia** (las líneas de log y los conteos que obtuviste, no un sí/no). La pieza central es la Microlección 3: un flujo que registra solicitudes en una app legacy, un **fallo simulado** a mitad de lote y una reejecución que demuestra que no duplica. Después **diagnosticas síntoma primero** un duplicado causado por un reintento, construyes **sin pasos** la matriz de excepciones y el runbook, y cierras con un **reto de transferencia** donde el efecto no es una pantalla sino archivos.
>
> **Antes de empezar, necesitas:**
> - Windows 10/11 con PAD y la extensión para Microsoft Edge (instalación en el [Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad)).
> - **No necesitas licencia de pago.** Todo se hace con desktop flows ejecutados en tu equipo en modo atendido, y Learn indica que el manejo de excepciones está disponible para todos los tipos de cuenta ([Prerequisites and limitations](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)). Reintentos programados desde un cloud flow o ejecución desatendida exigen licencia y no se usan aquí.
> - El [Portal SIT](/rpa-sandbox/portal) y [SIT Registro Legacy](/rpa-sandbox/legacy-app) (en PAD, con la URL completa: `https://planestudio.vercel.app/rpa-sandbox/portal` y `https://planestudio.vercel.app/rpa-sandbox/legacy-app`).
> - Haber hecho el [Módulo 73](/nivel/rpa/modulo/selectores-sincronizacion-resiliencia): aquí reutilizas la captura de UI elements y la espera acotada con **Loop**.
> - **Importante sobre el sandbox legacy:** guarda los registros en la memoria de la página. Si recargas la pestaña o pulsas **Reset**, vuelve a sus 3 registros iniciales. Para probar una reejecución, **no recargues la página**: el flujo se adjunta a la pestaña abierta.

## 📖 Conceptos Clave

Un bot profesional debe poder fallar sin duplicar, corromper o esconder evidencia. Idempotencia significa que repetir una ejecución controlada no repite efectos ya realizados. "Reintentar todo" puede duplicar pagos, registros o comunicaciones.

- **Errores de diseño y de ejecución:** PAD distingue errores de diseño (un campo obligatorio vacío, una variable sin definir; impiden ejecutar) y errores en tiempo de ejecución o excepciones (una ruta inválida; hacen fallar el flujo). Por defecto, un desktop flow se detiene cuando ocurre un error ([Handle errors in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)).
- **On error de una acción:** en las propiedades de la acción, **On error** ofrece **Retry action if an error occurs** (por defecto, 1 reintento cada 2 segundos), **Continue flow run** con **Go to next action**, **Repeat action** o **Go to label**, reglas nuevas (**New rule**) para **Set variable** o **Run subflow**, y **Advanced** para tratar cada tipo de error por separado. Ojo: **Repeat action** repite la acción *hasta que funcione*; sin otro límite, es un retry infinito.
- **On block error:** aplica el mismo manejo a un bloque de acciones. Tiene **Name**, **Retry policy** (**None**, **Fixed** o **Exponential**) y **Handle flow terminating errors** para capturar también errores lógicos ([Flow control actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/flowcontrol)). Dato clave para la idempotencia: **si hay política de reintentos, el reintento empieza desde el principio del bloque**. Un bloque que contiene una acción con efecto externo la repetirá. Además, si una acción dentro del bloque tiene su propio **On error** con reintentos, ese manejo tiene prioridad sobre el del bloque ([Handle errors in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)).
- **Get last error y Throw custom error:** **Get last error** devuelve la variable `%LastError%` con las propiedades `ActionName`, `ActionIndex`, `Location`, `Message`, `ErrorDetails` y `SubflowName` ([Variable data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)); con **Clear error** evitas leer el mismo error dos veces. **Throw custom error** lanza un error con nombre propio (**Error name** y **Error message**) que un **On block error** puede tratar aparte: útil para errores de negocio. Learn exige colocarla dentro de un **On block error** y darle una entrada con **+ Custom error** en el manejo de errores del bloque; si ninguna entrada coincide, el bloque aplica **All errors (default)**.
- **Error de negocio vs. error técnico:** un dato inválido o un registro bloqueado no se arregla reintentando (va a revisión con su motivo); un timeout o una página que no cargó sí puede reintentarse, con límite y espera creciente (backoff).
- **Estado por registro y checkpoint:** cada registro tiene un estado persistente (`Pendiente`, `EnProceso`, `Completado`, `ErrorValidacion`, `ErrorTecnico`) que se escribe *antes* y *después* de la acción con efecto. `Completado` solo se escribe después de **comprobar** el resultado en el sistema destino.
- **Clave idempotente y reconciliación:** antes de repetir un efecto, el bot consulta el sistema destino por la clave de negocio (aquí, el ID de solicitud). Si el registro ya existe, lo marca como `Completado` (reconciliado) sin volver a crearlo.
- **Correlation ID y log sin PII:** un `runId` por ejecución y la clave de cada registro permiten seguir un caso de punta a punta sin escribir nombres, documentos, importes de clientes concretos, tokens ni contraseñas.
- **Rollback vs. compensación:** rollback deshace dentro del mismo sistema y transacción; en RPA casi nunca existe, porque cada pantalla confirma por separado. Compensación es una acción de negocio nueva que contrarresta un efecto ya hecho (anular un registro duplicado, emitir una nota de crédito) y deja rastro.
- **Cierre seguro:** cerrar navegador, Excel y archivos también cuando el flujo falla; si una aplicación queda abierta, la siguiente corrida empieza en un estado desconocido.

## 👨‍💻 Actividades Prácticas Paso a Paso

## 🧩 Microlección 1 — Estados, correlation ID y un log que sirva para diagnosticar

**¿Qué vas a aprender?** A preparar el archivo de estado y el log que usarán las demás microlecciones, y a clasificar un error antes de decidir si se reintenta.

**¿Por qué existe esto?** Cuando un bot falla a medianoche, el log es lo único que queda. Si no dice qué ejecución, qué registro y en qué estado estaba, nadie sabe si es seguro reintentar.

**Ahora haz algo — micropráctica (6 min):** clasifica cinco fallos reales y elige qué se reintenta → **[Clasificar errores antes de reintentar](/practica/ip-rpa-022-clasificar-errores-y-reintentos)**.

**Práctica en PAD (40 min):**

1. Crea la carpeta `C:\RPA-Curso\M74`. Dentro, con el Bloc de notas, crea `pendientes.csv` con este contenido exacto y guárdalo en UTF-8:
   ```text
   requestId,customerId,productId,estado,runId
   SOL-2026-0031,CLI-0005,PROD-003,Pendiente,
   SOL-2026-0032,CLI-0001,PROD-002,Pendiente,
   SOL-2026-0004,CLI-0004,PROD-004,Pendiente,
   ```
   El tercer ID ya existe en el sandbox legacy: es tu caso de reconciliación. Guarda una copia como `pendientes_original.csv` para restaurar el ejercicio.
2. Crea un desktop flow `M74 Idempotencia`. En **Main**: **Get current date and time** (**Retrieve** = **Current date and time**) → **Convert datetime to text** (**Format to use** = **Custom**, **Custom Format** = `yyyyMMdd-HHmmss`) → **Set variable** `%RunId%` = `RUN-%FormattedDateTime%`.
3. Crea un subflow `Log`. Dentro: **Get current date and time** → **Convert datetime to text** (**Custom**, `yyyy-MM-dd HH:mm:ss`) → **Write text to file** con **File path** = `C:\RPA-Curso\M74\log.csv`, **Text to write** = `%FormattedDateTime%;%RunId%;%LogClave%;%LogEvento%;%LogDetalle%`, **If file exists** = **Append content** y **Encoding** = **UTF-8**. **Run subflow** solo pide el nombre del subflow (no recibe argumentos), así que `Log` trabaja con las variables `%LogClave%`, `%LogEvento%` y `%LogDetalle%` que asignes justo antes de llamarlo. En la primera corrida comprueba en `log.csv` que la línea sale con tus valores, no vacía.
4. En **Main**, asigna `%LogClave%` = `-`, `%LogEvento%` = `inicio`, `%LogDetalle%` = `-` y agrega **Run subflow** `Log`. Después, **Read from CSV file** con **File path** = `C:\RPA-Curso\M74\pendientes.csv`, **Encoding** = **UTF-8**, **First line contains column names** activado y **Separator** = **Comma**. Produce `%CSVTable%`.
5. Ejecuta el flujo y abre `log.csv`. Debe tener una línea con tu `runId`. Vuelve a ejecutar: debe aparecer una segunda línea con **otro** `runId`.
6. Revisa la línea con ojo de auditor: ¿hay algo que no debería estar en un log? Aquí no debería haber nada más que fecha, `runId`, clave, evento y detalle técnico.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Las dos líneas de `log.csv` (copiadas) | ___ |
| Filas que leyó `%CSVTable%` (en el panel de variables, `RowsCount`) | ___ |
| Un dato que **no** escribirías en el log aunque te ayudara a depurar, y por qué | ___ |

---

## 🧩 Microlección 2 — Manejo de errores en PAD: acción, bloque y cierre seguro

**¿Qué vas a aprender?** A configurar **On error** en una acción y **On block error** en un bloque, a ver un retry infinito con tus propios ojos y a cerrar el navegador aunque el flujo falle.

**¿Por qué existe esto?** El manejo de errores por defecto es "detenerse". Eso no rompe nada, pero tampoco deja evidencia. Y el primer reflejo de muchos desarrolladores, "repetir hasta que funcione", puede convertir un fallo en un bot que nunca termina.

**Práctica en PAD (50 min):**

1. Abre el Portal SIT en Edge, pulsa **Reset** y elige **Error simulado**: la tabla desaparece y aparece un aviso de error de servidor.
2. Crea un desktop flow `M74 Errores`: **Launch new Microsoft Edge** con **Launch mode** = **Attach to running instance**, **Attach to Microsoft Edge tab** = **By URL**, **Tab URL** = `rpa-sandbox/portal`. Agrega **Get details of element on web page** sobre la celda de la primera solicitud (captúrala con el portal en **Normal** y vuelve a **Error simulado**), con **Attribute name** = **Own Text**.
3. **Retry infinito, a propósito:** en esa acción abre **On error** → **Continue flow run** → **Repeat action**. Ejecuta. El flujo no avanza ni falla. Cuenta los segundos y detenlo con el botón de parar de PAD. Quita esa configuración.
4. **Reintento acotado:** en la misma acción marca **Retry action if an error occurs** con 2 reintentos y deja el intervalo por defecto. Ejecuta: ahora falla tras los reintentos. Anota cuánto tardó en fallar.
5. **Bloque con manejo:** quita el reintento de la acción. Envuélvela en **On block error** con **Name** = `Leer tabla` y **Retry policy** = **None**. En su manejo de errores configura **Set variable** `%Estado%` = `ErrorTecnico` y que el flujo continúe desde el final del bloque. Después del bloque agrega **Get last error** con **Clear error** activado y llama a un `Log` como el de la Microlección 1 con `%LogEvento%` = `%Estado%` y `%LogDetalle%` = `%LastError.ActionName% - %LastError.Message%`.
6. **Cierre seguro:** crea un subflow `Cierre` con **Close web browser** (`%Browser%`) y llámalo al final de **Main**, por los dos caminos (éxito y error). Ejecuta en **Error simulado** y en **Normal** (**Close web browser** cierra la ventana a la que te adjuntaste: vuelve a abrir el portal antes de cada corrida). En **Normal**, `%Estado%` no debe cambiar a `ErrorTecnico`; asígnale `Completado` dentro del bloque después de leer la celda.
7. Abre el log y compara las dos corridas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Segundos que dejaste correr **Repeat action** antes de pararlo | ___ |
| Segundos hasta fallar con 2 reintentos | ___ |
| Línea de log de la corrida en **Error simulado** (con `ActionName` y `Message`) | ___ |
| Línea de log de la corrida en **Normal** | ___ |
| ¿Se cerró el navegador en las dos corridas? | ___ |

---

## 🧩 Microlección 3 — Checkpoint, fallo parcial y reejecución sin duplicar

**¿Qué vas a aprender?** A escribir el estado antes y después del efecto, a consultar el sistema destino por la clave antes de repetir y a demostrar con conteos que una reejecución no duplica.

**¿Por qué existe esto?** Es exactamente el Caso Real de este módulo, en pequeño: un efecto confirmado, un fallo justo después y un operador que reintenta.

**Práctica en PAD (75 min):**

1. Abre SIT Registro Legacy en Edge, pulsa **Reset** y deja el modo **Normal**. En la tabla **Registros** debe verse el contador `3`. Escribe `SOL-2026-0099` en **Solicitud** y pulsa **Consultar por ID**: aparece `No encontrado` debajo de los botones. Déjalo visible: lo vas a capturar.
2. En el flujo `M74 Idempotencia`, después de leer el CSV, agrega **Launch new Microsoft Edge** adjunto por URL a `rpa-sandbox/legacy-app`. Captura como UI elements: los campos **Solicitud**, **Cliente** y **Producto**, los botones **Registrar** y **Consultar por ID**, el texto `No encontrado` (el mensaje de estado) y, registrando una vez a mano para que aparezca, el botón **Cerrar** del diálogo **Registro confirmado**. Pulsa **Reset** en el sandbox después de capturar.
3. Crea un subflow `Guardar_checkpoint`. Learn indica que en **Write to CSV file** la opción **Include column names** solo se aplica si el archivo no existe o está vacío, así que no sobrescribas `pendientes.csv` directamente: **If file exists** (`C:\RPA-Curso\M74\pendientes.tmp.csv`) → **Delete file(s)** sobre ese archivo → **End** → **Write to CSV file** de `%CSVTable%` a `pendientes.tmp.csv` con **Include column names** activado y **Separator** = **Comma** → **Rename file(s)** de `pendientes.tmp.csv` con **Rename scheme** = **Set new name**, **New file name** = `pendientes`, **Keep extension** activado e **If file exists** = **Overwrite**. Así el archivo de estado nunca queda a medio escribir.
4. En **Main**, **Set variable** `%Fila%` = `-1` y `%SimularFallo%` = `SOL-2026-0032`. Agrega **For each** sobre `%CSVTable%` (variable `%CurrentItem%`). Primera acción dentro: **Increase variable** `%Fila%` en 1. Asigna `%LogClave%` = `%CurrentItem['requestId']%`.
5. **Saltar lo ya hecho:** **If** `%CurrentItem['estado']%` **Equal to (=)** `Completado` → log `omitido-completado` → **Next loop**.
6. **Consultar antes de actuar:** **Populate text field on web page** (Solicitud = `%CurrentItem['requestId']%`) → **Press button on web page** (**Consultar por ID**) → **Get details of element on web page** sobre el mensaje de estado, **Own Text**. Si el resultado es `Registrado`: **Update data table item** (**Column** `estado`, **Row** `%Fila%`, **New value** `Completado`) → **Run subflow** `Guardar_checkpoint` → log `reconciliado` → **Next loop**.
7. **Checkpoint antes del efecto:** **Update data table item** a `EnProceso` y la columna `runId` a `%RunId%` → `Guardar_checkpoint` → log `en-proceso`.
8. **Efecto:** llena **Cliente** y **Producto** con las columnas del registro → **Press button on web page** (**Registrar**). Ahora el fallo simulado: **If** `%CurrentItem['requestId']%` **Equal to (=)** `%SimularFallo%` → **Stop flow** con **End flow** = **With error message** y el mensaje `Fallo simulado después de registrar`.
9. **Validar y marcar:** reutiliza el loop acotado del Módulo 73 para esperar `Registro confirmado`; si llegó, pulsa **Cerrar**. Vuelve a **Consultar por ID** y lee el mensaje. Solo si dice `Registrado`: `Completado` → `Guardar_checkpoint` → log `completado`. Si no: `ErrorTecnico` → `Guardar_checkpoint` → log con el texto leído.
10. **Corrida 1:** ejecuta. El flujo se detiene con tu error en `SOL-2026-0032`. Anota el contador de **Registros** y el contenido de `pendientes.csv`.
11. **Corrida 2:** sin recargar la página, cierra a mano el diálogo **Registro confirmado** que dejó abierto la corrida 1 (botón **Cerrar**), cambia `%SimularFallo%` a un valor vacío y ejecuta otra vez. Anota de nuevo el contador, el CSV y las líneas nuevas del log.
12. **Contraprueba (opcional, 10 min):** desactiva temporalmente las acciones del paso 6 (selecciónalas, clic derecho → **Disable action**), restaura `pendientes.csv` dejando `SOL-2026-0032` en `EnProceso` y ejecuta. El sandbox responde `Registro duplicado. No se insertó una segunda vez.` porque se protege solo; una app legacy real, como la del Caso Real, no lo haría. Esa protección no es tuya: tu evidencia de idempotencia es la corrida 2. Vuelve a activar las acciones (clic derecho → **Enable action**).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Contador de **Registros**: al empezar / tras la corrida 1 / tras la corrida 2 | ___ / ___ / ___ |
| Estado de cada fila en `pendientes.csv` tras la corrida 1 | ___ |
| Estado de cada fila tras la corrida 2 | ___ |
| Líneas del log de la corrida 2 (eventos por registro) | ___ |
| ¿Algún registro se envió dos veces con **Registrar**? Cómo lo sabes | ___ |

> **Reset del ejercicio:** pulsa **Reset** en el sandbox y copia `pendientes_original.csv` sobre `pendientes.csv`. Si solo haces una de las dos cosas, el estado del bot y el del sistema dejan de coincidir: es una buena forma de practicar la reconciliación, pero hazlo a propósito.

---

### 🔎 Diagnosticar síntoma primero — el duplicado que apareció "solo"

Otro equipo copió tu flujo pero, para "hacerlo más robusto", metió **Registrar** y la espera de la confirmación en un **On block error** con **Retry policy** = **Fixed** y 3 reintentos, y quitó la consulta previa. En días de carga, la confirmación tarda más que su espera; desde entonces aparecen solicitudes registradas dos y tres veces, y el log solo dice `completado`.

1. **Reprodúcelo (15 min, opcional):** en SIT Registro Legacy elige **Confirmación lenta**, dentro de un **On block error** con **Retry policy** = **Fixed** pon **Registrar**, una sola comprobación inmediata de `Registro confirmado` con **If web page contains** y, si no está, **Throw custom error** (con su entrada en **+ Custom error**; si no la creas, el bloque la trata con **All errors (default)**). Observa qué mensaje devuelve el sandbox en el segundo intento y cuántas filas nuevas hay en **Registros**.
2. **Micropráctica (8 min):** **[Diagnosticar: el duplicado causado por un reintento](/practica/ip-rpa-023-diagnosticar-duplicado-por-reintento-de-bloque)**. Escribe tu hipótesis antes de abrir las pistas.

| Campo | Tu valor |
|---|---|
| Qué parte del bloque se repite en cada reintento (con la frase de Learn que lo dice) | ___ |
| Por qué el log no lo delató | ___ |
| Tu rediseño en 3 líneas | ___ |

---

### 🏗️ Construir sin pasos — matriz de excepciones, RCA y runbook

> **Requisito:** extiende `M74 Idempotencia` para que distinga errores de negocio y técnicos en los modos del sandbox legacy y deja los documentos que soporte necesitaría a las 3 de la mañana.
> - **Bloqueo simulado** y un registro con campos vacíos (prueba dejando vacío **Producto** en una fila del CSV) son errores de **negocio**: `ErrorValidacion`, con motivo, sin reintento.
> - **Confirmación lenta** con espera insuficiente es **técnico**: `ErrorTecnico`, reintentable solo desde la consulta, nunca desde **Registrar**.
> - El navegador se cierra en todos los caminos.

Entregables: la matriz con plantilla [matriz de excepciones](/practice-assets/rpa/sit-automation-case/templates/matriz-excepciones.md), un RCA del fallo de la Microlección 3 con la plantilla [RCA](/practice-assets/rpa/sit-automation-case/templates/rca.md) y un runbook de recuperación de media página.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Clasificación correcta | Cada fila de la matriz dice negocio o técnico, y solo las técnicas tienen reintento |
| Reintento seguro | Ningún reintento vuelve a pulsar **Registrar** sin consultar antes por la clave |
| Log útil y sin PII | Con `runId` y clave puedes reconstruir qué pasó con cada registro; no hay nombres ni datos personales |
| Runbook ejecutable | Alguien que no hizo el flujo puede decidir, con el log y el CSV, si reejecutar, reconciliar o compensar |
| RCA defendible | Causa raíz (no "falló PAD"), corrección y prevención, con la evidencia de las corridas 1 y 2 |

---

## 🔁 Reto de transferencia — Idempotencia cuando el efecto son archivos

Cambia el tipo de efecto: ya no hay una pantalla que consultar. Un bot consolida cada noche los archivos `ventas_*.csv` de una carpeta de entrada en un único `consolidado.csv` y mueve cada archivo procesado a `procesados`. Una noche falla después de agregar las filas de un archivo pero antes de moverlo; al reejecutar, el consolidado queda con esas filas dos veces.

1. **Micropráctica (9 min):** **[Transferir: idempotencia con archivos](/practica/ip-rpa-024-transferir-idempotencia-a-archivos)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En PAD (40 min):** construye una versión pequeña con dos CSV de prueba (usa [`solicitudes_sucursales.csv`](/practice-assets/rpa/sit-automation-case/input/solicitudes_sucursales.csv) y una copia con otro nombre). Acciones útiles, verificadas en Learn: **Get files in folder**, **If file exists**, **Read from CSV file**, **Write to CSV file** (**If file exists** = **Append content**), **Move file(s)** (**If file exists** = **Do nothing** u **Overwrite**) y **Write text to file**. Simula el fallo con **Stop flow** entre el append y el move, y demuestra que la segunda corrida no duplica filas.

| Campo | Tu valor |
|---|---|
| Qué usas como clave idempotente en este caso y dónde la guardas | ___ |
| Filas de `consolidado.csv` tras la corrida con fallo / tras la reejecución | ___ / ___ |
| Qué cambiarías si el destino fuera una API que sí permite consultar por clave | ___ |

## 💼 Casos Reales de Negocio

Un flujo registra pagos en una app legacy. Falla al enviar confirmación y el operador reintenta. Sin checkpoint, el pago se registra dos veces. Con clave idempotente y validación previa, el bot reanuda desde el punto correcto.

## ✅ Buenas Prácticas

- Clasifica errores de negocio y técnicos.
- Limita retries y usa backoff.
- Registra correlation ID sin PII.
- Diseña compensación para efectos parciales.
- Cierra apps/archivos en bloque de cleanup.
- No metas una acción con efecto externo dentro de un **On block error** con **Retry policy**: el reintento empieza desde el principio del bloque.
- Escribe `EnProceso` antes del efecto y `Completado` solo después de comprobar el resultado en el sistema destino.
- Antes de repetir un efecto, consulta el destino por la clave de negocio.
- Usa **Get last error** con **Clear error** para no registrar dos veces el mismo error.

## ⚠️ Errores Comunes

- Retry infinito.
- Capturar pantallas con datos sensibles.
- No distinguir fallo recuperable de fallo crítico.
- Marcar éxito sin validar resultado final.
- No cerrar Excel o navegador.
- Usar **Repeat action** en **On error** sin otro límite: repite la acción hasta que funcione.
- Confiar en que el sistema destino rechazará duplicados: el sandbox lo hace; la mayoría de apps legacy, no.
- Sobrescribir el archivo de estado con **Write to CSV file** esperando que conserve los encabezados: **Include column names** solo se aplica si el archivo no existe o está vacío.

## 🧪 Criterios de Validación

- [ ] Diseño estados y checkpoints.
- [ ] Evito duplicados después de fallo parcial.
- [ ] Genero logs útiles sin PII.
- [ ] Cierro aplicaciones aunque falle.
- [ ] Escribo RCA defendible.
- [ ] Generé un `runId` por ejecución y un log con clave y evento por registro.
- [ ] Vi un retry infinito con **Repeat action**, lo reemplacé por un reintento acotado y registré el error con **Get last error**.
- [ ] Simulé un fallo después de **Registrar** y demostré con el contador de **Registros** que la reejecución no duplicó.
- [ ] Diagnostiqué el duplicado causado por la política de reintentos del bloque antes de ver la solución.
- [ ] Construí sin pasos la matriz de excepciones, el RCA y el runbook, y los contrasté con la rúbrica.
- [ ] En el reto de transferencia apliqué idempotencia a un efecto sobre archivos.

## Evidencia

Log con correlation ID, prueba de reejecución, matriz de excepciones, RCA y runbook de recuperación. Lab recomendado: LAB-109. Incidentes relacionados: INC-RPA-004 e INC-RPA-008.

Guarda también las tablas de evidencia de las tres microlecciones, del diagnóstico y del reto de transferencia, junto con `log.csv` y las dos versiones de `pendientes.csv` (tras la corrida 1 y tras la corrida 2).

## Preguntas de verificación

1. ¿Por qué "reintentar todo" puede ser peligroso?
2. ¿Qué diferencia hay entre rollback y compensación?
3. ¿Qué dato nunca debe aparecer en logs?

## Conexión con siguiente módulo

Ahora integrarás desktop flows con cloud flows, donde errores cruzan capas.

## Limitaciones y seguridad

Los logs deben anonimizar PII, rutas internas sensibles, tokens y credenciales.

**Take screenshot of web page** guarda lo que haya en pantalla: en un sistema real, una captura "de evidencia" puede contener datos personales. Úsala solo en pantallas sin datos de clientes, o no la uses.

## Referencias oficiales

- [Troubleshoot desktop flows runtime](https://learn.microsoft.com/en-us/power-automate/desktop-flows/troubleshoot)
- [Monitor run details](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-run-details)
- [Handle errors in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)
- [Flow control actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/flowcontrol)
- [File actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)
- [Variables actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/variables)
- [Variable data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)
