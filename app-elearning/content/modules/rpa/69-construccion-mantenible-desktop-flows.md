---
moduleId: 69
title: "Construcción mantenible de desktop flows"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 30
practiceMinutes: 220
slug: "construccion-mantenible-desktop-flows"
lastVerified: "2026-11"
---

## 🎯 Objetivo

Construir desktop flows modulares con acciones, variables, listas, data tables, condiciones, bucles, subflows, inputs, outputs, logging y manejo básico de errores.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y luego una práctica real en Power Automate for desktop (PAD), con una tabla de evidencia donde anotas el dato exacto que viste (no un "sí, funcionó"). Vas a construir **un solo desktop flow** de principio a fin: primero el esqueleto de subflows, luego su contrato de inputs y outputs, después el procesamiento con log y, al final, el manejo de errores con cierre garantizado. En la Microlección 4 **diagnosticas un síntoma** antes de ver la causa, y el módulo cierra con un **reto de transferencia** sin pasos.
>
> **Antes de empezar (lee esto, ahorra media hora):**
> - **PAD instalado y abierto.** La instalación está en el Módulo 68; no se repite aquí. Todo este módulo corre en **modo atendido** (attended) en tu propio equipo: Learn indica que crear desktop flows y ejecutarlos con el runtime local funciona también en Windows Home, y que la conexión con cloud flows, el almacenamiento en Dataverse y la ejecución desatendida (unattended) son de la cuenta *organization premium*. Nada de este módulo los necesita ([Learn: Prerequisites and limitations](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)).
> - **Cuenta.** Con una cuenta Microsoft personal los flujos se guardan en OneDrive; con una cuenta de trabajo o estudio, Learn exige que el ambiente predeterminado tenga Dataverse (si no lo tiene, PAD te pide crear la base). Anota cuál usas: lo pide la evidencia.
> - **Carpeta de práctica fuera de OneDrive.** Crea `C:\Users\<tu usuario>\RPA\SIT\` con dos subcarpetas, `entrada` y `salida`. No uses **Documentos** ni **Escritorio** si OneDrive los sincroniza: Learn documenta fallos de las acciones de Excel con carpetas sincronizadas por OneDrive o SharePoint, y en el Módulo 70 vas a usar Excel con esta misma carpeta.
> - **Archivo de entrada:** descarga [solicitudes_sucursales.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/solicitudes_sucursales.csv) del caso ficticio SIT (centro de recursos: [Recursos de práctica RPA](/recursos/rpa-recursos-practica)) y guárdalo en `entrada`. Tiene 4 solicitudes; una es del cliente `CLI-0003`, que en el catálogo del caso está bloqueado.
> - **Idioma de PAD:** PAD usa el idioma de visualización de Windows ([Learn](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)). Los nombres de acciones y opciones van aquí **en inglés**, como en Learn; si tu Windows está en español, busca la acción por su función.
> - **Tiempo:** la primera vez, unas 3 h 40 min de práctica (más 30 de lectura). Mejor en dos sesiones: Microlecciones 1 a 3 en la primera; la 4 y el reto en la segunda.

---

## 🧩 Microlección 1 — Un flujo organizado por intención: Main como índice

**¿Qué vas a aprender?** A partir el flujo en subflows con una responsabilidad cada uno y a dejar **Main** como un índice que se lee de un vistazo.

**¿Por qué existe esto?** Un desktop flow de 180 acciones lineales funciona, pero nadie sabe dónde empieza la validación ni desde dónde se puede reiniciar. Learn define los subflows como grupos de acciones que se invocan como unidad: todo flujo tiene el subflow **Main**, que es el que corre al iniciar, y los demás solo corren cuando una acción **Run subflow** los llama ([Learn: designer workspace](https://learn.microsoft.com/en-us/power-automate/desktop-flows/designer-workspace)). Al terminar el subflow llamado, la ejecución vuelve al que lo llamó ([Learn: Flow control actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/flowcontrol)).

Un flujo profesional se organiza por intención, siempre en el mismo orden:

| Subflow | Responsabilidad | Qué NO hace |
|---|---|---|
| `Inicializar` | Fecha de ejecución, correlation ID, ruta del log, configuración, marca de "en ejecución" | No lee datos de negocio |
| `ValidarEntrada` | Comprueba que el archivo existe y tiene la forma esperada | No procesa filas |
| `ProcesarRegistros` | Recorre las filas, aplica la regla de negocio y escribe una línea de log por fila | No decide cómo terminar el flujo |
| `RegistrarResultado` | Calcula los outputs y escribe el resumen | No toca los datos de entrada |
| `CerrarRecursos` | Libera lo que se abrió (archivos, aplicaciones, la marca de ejecución) | Nunca falla por sí mismo |

Dos reglas de Learn que conviene saber desde ya:
- **Alcance (scope) de los subflows.** Al crear un subflow eliges si es **Global** o **Local**. Las variables de un subflow global se ven en todo el flujo; las de uno local solo dentro de ese subflow, y se le pasan valores con sus propios inputs y outputs. El alcance **no se puede cambiar** después de crear el subflow, y **Main** siempre es global ([Learn: scoped variables](https://learn.microsoft.com/en-us/power-automate/desktop-flows/scoped-variables)). En este módulo usa **Global** en todos: el contrato del flujo lo vas a definir con los inputs y outputs del flujo (Microlección 2).
- **Palabras reservadas.** No puedes usar como nombre de variable, subflow o etiqueta palabras como `main`, `error`, `input`, `output`, `end` o `label` ([Learn: Debugging a desktop flow, reserved keywords](https://learn.microsoft.com/en-us/power-automate/desktop-flows/debugging-flow)). Por eso el subflow de cierre no se llama `End` ni el de errores `Error`.

**Ahora haz algo — micropráctica (6 min):** decide qué afirmaciones sobre estructura y nombres son correctas → **[Estructurar un desktop flow mantenible](/practica/ip-rpa-007-estructurar-desktop-flow-mantenible)**.

**Práctica real en PAD (25 min):**

1. Abre Power Automate for desktop. En la consola selecciona **New flow**, escribe el nombre `SIT-M69-Solicitudes` y selecciona **Create** ([Learn: Create desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/create-flow)). Se abre el diseñador en otra ventana, con la pestaña **Main** vacía.
2. Crea los cinco subflows. Sobre el área de trabajo están las pestañas de subflows: selecciona la de subflows, luego **+**, escribe `Inicializar` y, si aparece el campo de alcance, deja **Global**. Repite con `ValidarEntrada`, `ProcesarRegistros`, `RegistrarResultado` y `CerrarRecursos`.
3. Vuelve a la pestaña **Main**. En el panel **Actions**, busca **Comment** y arrástrala al área de trabajo; escribe: `Índice del flujo: inicializar, validar, procesar, registrar, cerrar`.
4. Busca **Run subflow** y arrástrala debajo del comentario; en **Subflow name** elige `Inicializar` y guarda la acción. Repite hasta tener cinco acciones **Run subflow**, en el orden de la tabla.
5. Dentro de cada subflow (cada pestaña) agrega por ahora una sola acción **Comment** que diga su responsabilidad (copia la columna "Responsabilidad" de la tabla).
6. Guarda con **File** > **Save** (Ctrl+S) y ejecuta con **Run** (F5) ([Learn: debugging](https://learn.microsoft.com/en-us/power-automate/desktop-flows/debugging-flow)).

**Qué deberías ver:** la ejecución termina sin errores en un segundo. La barra de estado, abajo, muestra el número total de acciones y de subflows del flujo: anótalos.

**Si no lo ves:**
- *El subflow no aparece en la lista de **Run subflow**:* comprueba que lo guardaste con nombre; si el nombre es una palabra reservada, el diseñador lo rechaza.
- *Un subflow "no se ejecuta":* solo corre si una acción **Run subflow** lo llama; crear la pestaña no basta. Para ver el recorrido, ejecuta con **Run next action** (F10), que avanza acción por acción.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tipo de cuenta con la que firmaste en PAD (Microsoft personal / trabajo o estudio) | ___ |
| Nombres de los subflows creados, en el orden en que los llama Main | ___ |
| Total de acciones y de subflows que muestra la barra de estado | ___ |
| Alcance elegido para los subflows (o "el diálogo no mostró el campo de alcance") | ___ |

---

## 🧩 Microlección 2 — El contrato del flujo: inputs, outputs y nombres

**¿Qué vas a aprender?** A declarar qué recibe y qué devuelve el flujo, con nombres que digan su propósito.

**¿Por qué existe esto?** Un flujo que lee una ruta "quemada" en una acción solo funciona en el equipo de quien lo hizo. Los **input variables** permiten pasar valores desde un cloud flow, desde otro desktop flow con la acción **Run desktop flow** o, al ejecutar desde la consola, desde el diálogo **Flow inputs**; los **output variables** devuelven el resultado ([Learn: Manage variables](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables)). Aunque hoy lo ejecutes a mano, el contrato es lo que soporte va a leer mañana.

Reglas de nombres que Learn fija ([Learn: Variables actions, Set variable](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/variables)):
- Empiezan por letra o guion bajo; después, letras, guiones bajos y dígitos.
- **No distinguen mayúsculas:** `out_Total`, `out_total` y `OUT_TOTAL` son la **misma** variable. Un **Set variable** con un nombre que ya existe (en cualquier combinación de mayúsculas) no crea otra: **sobrescribe** la existente. Y si **renombras** una variable, o creas un input o un output, con el nombre de una variable de flujo que ya existe, PAD te pide confirmar que las **fusiona**: si no lo esperabas, cancela ([Learn: Manage variables](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables)).
- Convención del curso: `in_` (input), `out_` (output), `cfg_` (configuración), `dt_` (data table), `idx_` (índice o contador), `log_` (log). Nada de `Variable1`.

**Práctica real en PAD (25 min):**

1. En el panel de variables (a la derecha) selecciona **+** > **Input**. En **New input variable** completa **Variable name**, **Data type**, **Default value**, **External name** y **Description** (Learn marca como obligatorios **Variable name**, **Data type** y **External name**; un input que no es opcional necesita además un **Default value** para poder ejecutarlo desde la consola sin escribir el valor):

   | Variable name | Data type | Default value | External name |
   |---|---|---|---|
   | `in_InputPath` | **Text** | `C:\Users\<tu usuario>\RPA\SIT\entrada\solicitudes_sucursales.csv` | `InputPath` |
   | `in_OutputFolder` | **Text** | `C:\Users\<tu usuario>\RPA\SIT\salida` | `OutputFolder` |
   | `in_DryRun` | **Boolean** | `False` | `DryRun` |
   | `in_CorrelationId` | **Text** | *(vacío)* y activa **Mark as optional** | `CorrelationId` |

   En **Description** escribe para qué sirve cada una (por ejemplo, para `in_DryRun`: "True = no escribe el archivo de procesados; el log sí se escribe").
2. Selecciona **+** > **Output** y crea `out_Total`, `out_Procesados` y `out_Errores` (**Number**) y `out_LogPath` (**Text**), cada una con su **External name** (`Total`, `Procesados`, `Errores`, `LogPath`).
3. Guarda, cierra el diseñador y, en la consola, ejecuta el flujo desde **My flows** con el botón de ejecutar de su fila.

**Qué deberías ver:** al ejecutar desde la consola aparece el diálogo **Flow inputs**, que te pide los valores de los inputs con sus nombres externos (Learn: "When you trigger desktop flows directly through the console... the Flow inputs dialog prompts you to set values"). Acepta los valores por defecto.

**Si no lo ves:** si el diálogo no aparece, no creaste las variables como **Input** sino con **Set variable** (que crea variables de flujo comunes). Si PAD avisa de una fusión al crear un input o un output, ya existía una variable de flujo con ese nombre (quizá en otra combinación de mayúsculas): cancela y elige otro nombre.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombres externos que muestra el diálogo **Flow inputs**, en el orden en que aparecen | ___ |
| Qué pasa si dejas `CorrelationId` vacío (¿te deja continuar?) | ___ |
| Una variable cuyo nombre cambiaste para cumplir la convención o evitar una fusión (o "ninguna") | ___ |

---

## 🧩 Microlección 3 — Procesar una data table con log y correlation ID

**¿Qué vas a aprender?** A leer el archivo a una data table, recorrerla con **For each**, aplicar una regla con **If**, contar resultados y dejar un log que otra persona pueda leer sin abrir el diseñador.

**¿Por qué existe esto?** El log es la única evidencia de lo que hizo el bot cuando nadie lo miraba. Un buen log tiene una línea por registro, el mismo **correlation ID** en todas las líneas de la ejecución y un estado con nombre: `Procesado`, `ErrorValidacion` (el dato no cumple la regla; el bot sigue) o `ErrorTecnico` (algo falló al ejecutar; Microlección 4). El formato de este módulo es el del log esperado del caso: `timestamp,correlationId,level,step,message` ([log_esperado.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/expected/log_esperado.csv)).

Lo que necesitas de Learn para esta práctica:
- **Read from CSV file** produce una data table `CSVTable`. Su opción **First line contains column names** viene **apagada** por defecto, y el separador por defecto es **System default** ([Learn: File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)). En el Módulo 70 verás qué pasa si no los cambias; aquí, enciéndela y elige **Comma**.
- Con **For each** sobre una data table, la variable de cada vuelta es una fila (datarow) y lees una columna con `%CurrentItem['customerId']%`. Las filas y columnas se numeran desde 0. `%CSVTable.RowsCount%` da el número de filas ([Learn: Variable data types](https://learn.microsoft.com/en-us/power-automate/desktop-flows/variable-data-types), [Learn: data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)).
- **Write text to file** crea el archivo si no existe; su opción **If file exists** viene en **Overwrite existing content** y su **Encoding** por defecto es **Unicode**. Para un log que se anexa, cambia a **Append content** y **UTF-8** ([Learn: File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)).

**Práctica real en PAD (60 min).** Construye cada subflow en su pestaña. Escribe los nombres de variables tal cual; los valores entre `%` son expresiones.

*Subflow `Inicializar`:*
1. **Get current date and time** (deja **Current date and time**) → produce `CurrentDateTime`.
2. **Convert datetime to text**: **Datetime to convert** `%CurrentDateTime%`, **Format to use** **Custom**, **Custom format** `yyyyMMdd-HHmmss`. Renombra la variable producida a `log_TsArchivo`.
3. **If** `%in_CorrelationId%` **Is empty** → dentro, **Set variable** `in_CorrelationId` a `RUN-SIT-RPA-%log_TsArchivo%` (el prefijo `RUN-SIT-RPA` es el `runIdPrefix` de [parametros_proceso.json](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/parametros_proceso.json)). Cierra con **End**.
4. **Set variable** `out_LogPath` a `%in_OutputFolder%\log_%log_TsArchivo%.csv`.
5. **Set variable** `cfg_ClientesBloqueados` a `|CLI-0003|` (configuración centralizada en un solo lugar; las barras evitan que `CLI-00031` "contenga" a `CLI-0003`).
6. Tres **Set variable**: `out_Total`, `out_Procesados` y `out_Errores` a `0`.
7. **Write text to file**: **File path** `%out_LogPath%`, **Text to write** `timestamp,correlationId,level,step,message`, **If file exists** **Overwrite existing content**, **Encoding** **UTF-8**.
8. **Write text to file**: misma ruta, **Text to write** `%log_TsArchivo%,%in_CorrelationId%,INFO,inicializar,Inicio de ejecucion`, **If file exists** **Append content**, **Encoding** **UTF-8**.
9. **If file exists** con **If file** **Exists** y **File path** `%in_OutputFolder%\en_ejecucion.lock` → dentro, **Stop flow** **With error message** `Ya existe en_ejecucion.lock: hay otra ejecucion en curso o la anterior no cerro`. **End**. Después del **End**, **Write text to file**: **File path** `%in_OutputFolder%\en_ejecucion.lock`, **Text to write** `%in_CorrelationId%`. Es la marca de "hay una ejecución en curso": evita dos ejecuciones a la vez sobre la misma carpeta, y `CerrarRecursos` la borrará.

*Subflow `ValidarEntrada`:*
10. **If file exists** con **If file** **Doesn't exist** y **File path** `%in_InputPath%` → dentro, **Write text to file** (append, UTF-8) con `%log_TsArchivo%,%in_CorrelationId%,ERROR,validar,No existe el archivo de entrada` y luego **Stop flow** con **End flow** **With error message** y el mensaje `No existe %in_InputPath%`. Cierra con **End**. *(En la Microlección 4 verás por qué este **Stop flow** deja un problema.)*
11. **Read from CSV file**: **File path** `%in_InputPath%`, **Encoding** **UTF-8**, **First line contains column names** encendido, **Columns separator** **Predefined** y **Separator** **Comma** → produce `CSVTable`.

*Subflow `ProcesarRegistros`:*
12. **For each** con **Value to iterate** `%CSVTable%` → variable `CurrentItem`.
13. Dentro del bucle: **Increase variable** `out_Total` en `1`.
14. **If** `%cfg_ClientesBloqueados%` **Contains** `|%CurrentItem['customerId']%|`:
    - **Increase variable** `out_Errores` en `1`.
    - **Write text to file** (append, UTF-8): `%log_TsArchivo%,%in_CorrelationId%,WARN,procesar,%CurrentItem['requestId']% ErrorValidacion cliente bloqueado`.
15. **Else**:
    - **Increase variable** `out_Procesados` en `1`.
    - **Write text to file** (append, UTF-8): `%log_TsArchivo%,%in_CorrelationId%,INFO,procesar,%CurrentItem['requestId']% Procesado`.
    - **If** `%in_DryRun%` **Equal to (=)** `%False%` → **Write to CSV file**: **Variable to write** `%CurrentItem%`, **File path** `%in_OutputFolder%\procesados_%log_TsArchivo%.csv`, **If file exists** **Append content**, **Include column names** encendido, **Separator** **Comma**. **End**.
16. Cierra el **If** principal con **End** y el bucle con su **End**.

*Subflow `RegistrarResultado`:*
17. **Write text to file** (append, UTF-8): `%log_TsArchivo%,%in_CorrelationId%,INFO,resultado,Total %out_Total% Procesados %out_Procesados% Errores %out_Errores%`.

*Subflow `CerrarRecursos`:*
18. **Delete file(s)** con `%in_OutputFolder%\en_ejecucion.lock`.

Guarda y ejecuta desde la consola dos veces: una con **DryRun** en `False` y otra en `True`, dejando **CorrelationId** vacío las dos veces.

**Qué deberías ver:** en `salida` hay dos logs (uno por ejecución) de **7 líneas** cada uno: encabezado, inicio, 4 filas (`SOL-2026-0003` como `ErrorValidacion`, las otras tres como `Procesado`) y el resumen `Total 4 Procesados 3 Errores 1`. Solo la ejecución con **DryRun** `False` dejó un `procesados_*.csv` (con encabezado y 3 filas). El correlation ID es distinto en cada log e igual en todas las líneas del mismo log. No queda `en_ejecucion.lock`.

**Si no lo ves:**
- *El log tiene solo la última línea:* esa acción **Write text to file** quedó en **Overwrite existing content** (el valor por defecto). Solo la del encabezado debe sobrescribir.
- *Error de columna inexistente al evaluar `%CurrentItem['customerId']%` (el texto exacto depende de tu versión):* **First line contains column names** está apagado o el separador no es **Comma**: la tabla no tiene esa columna. Abre `CSVTable` en el visor de variables (doble clic en el panel de variables) para ver qué columnas leyó.
- *`out_Total` vale 0 aunque el log tiene filas:* lo inicializaste en un subflow **Local**; con subflows globales comparten la variable.
- *El archivo de procesados no tiene encabezado:* Learn indica que **Include column names** solo actúa si el archivo no existe o está vacío; con anexar, el encabezado sale en la primera fila escrita.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Correlation ID de cada una de las dos ejecuciones | ___ |
| Las 7 líneas del log de la ejecución con **DryRun** `False` (copiadas) | ___ |
| Valores de `out_Total`, `out_Procesados` y `out_Errores` que muestra el panel de variables al terminar | ___ |
| Archivos que quedaron en `salida` tras las dos ejecuciones (nombres) | ___ |

---

## 🧩 Microlección 4 — Errores técnicos y cierre garantizado

**¿Qué vas a aprender?** A atrapar un error técnico de un grupo de acciones, registrarlo con su contexto y cerrar los recursos aunque el flujo falle.

**¿Por qué existe esto?** Learn: por defecto, un desktop flow **se detiene** cuando una acción da error ([Learn: Handle errors](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)). Si se detiene a mitad de `ProcesarRegistros`, nunca llega a `CerrarRecursos`: la marca `en_ejecucion.lock` se queda, el log termina sin decir qué pasó y el próximo operador no sabe por dónde empezar. Lo mismo pasa con el **Stop flow** de la validación del paso 10: termina el flujo **sin pasar por el cierre**.

Las herramientas, según Learn ([Handle errors](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors), [Flow control actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/flowcontrol)):
- **On error** de una acción: **Retry action if an error occurs** y **Continue flow run** (**Go to next action**, **Repeat action**, **Go to label**). Con **New rule** agregas **Set variable** o **Run subflow**.
- **On block error**: las mismas opciones para todas las acciones que quedan entre él y su **End**, y además puede continuar desde el principio o el final del bloque. Su opción **Handle flow terminating errors** también atrapa errores de lógica (por ejemplo, un índice fuera de rango). Si el bloque tiene **Retry policy**, reintenta desde el principio del bloque.
- **Get last error** produce `LastError` (tipo Error) con `%LastError.Message%`, `%LastError.SubflowName%` y `%LastError.ActionName%`, entre otras propiedades ([Learn: data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)).
- **Stop flow** con **With error message** devuelve el error a quien llamó al flujo. Úsalo **después** del cierre, no antes.

Distingue los dos tipos de error del log: un cliente bloqueado es `ErrorValidacion` (dato; el bot sigue con la siguiente fila); un archivo que no existe o que no se puede leer es `ErrorTecnico` (ejecución; el bot registra, cierra y termina con error).

**Diagnóstico primero — micropráctica (8 min):** antes de construir, lee un síntoma real de soporte y di qué miras primero y qué cambias → **[Diagnosticar: el bot no arranca porque la ejecución anterior no limpió](/practica/ip-rpa-008-diagnosticar-error-sin-cierre)**.

**Práctica real en PAD (40 min):**

1. Crea un sexto subflow, `ManejarError` (Global), con: **Get last error** (activa **Clear error**) → **Write text to file** (append, UTF-8) con `%log_TsArchivo%,%in_CorrelationId%,ERROR,%LastError.SubflowName%,ErrorTecnico %LastError.Message%`.
2. En `ValidarEntrada`, cambia el **Stop flow** del paso 10 por **Set variable** `cfg_HayError` a `%True%` y **Exit subflow**: la validación registra y sale, pero ya no corta el flujo antes del cierre.
3. En **Main**, primero agrega **Set variable** `cfg_HayError` a `%False%`. Luego, después de `Run subflow Inicializar`, agrega **On block error** con **Name** `Proceso` y deja **dentro** del bloque (antes de su **End**): `Run subflow ValidarEntrada` y, debajo, **If** `%cfg_HayError%` **Equal to (=)** `%False%` con `Run subflow ProcesarRegistros` y `Run subflow RegistrarResultado` dentro (**End**). Así, si la validación falla, no se procesa nada.
4. Abre la configuración de errores del bloque: activa **Handle flow terminating errors** (para atrapar también errores de lógica, como leer una columna que no existe); con **New rule** agrega **Set variable** `cfg_HayError` a `%True%` y **Run subflow** `ManejarError`; en **Continue flow run** elige continuar al **final del bloque**.
5. Después del **End** del bloque deja `Run subflow CerrarRecursos` y, al final, **If** `%cfg_HayError%` **Equal to (=)** `%True%` → **Stop flow** **With error message** `Ejecucion %in_CorrelationId% con error; ver %out_LogPath%`. **End**.
6. **Fuerza dos errores.** Descarga [wrong_headers.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/wrong_headers.csv) (columnas `idSolicitud,cliente,producto,cantidad`, sin `customerId`) en `entrada`. Ejecuta desde la consola y en **Flow inputs** cambia **InputPath**: primero a una ruta que no existe (`...\entrada\no_existe.csv`), y en una segunda ejecución a `...\entrada\wrong_headers.csv`.

**Qué deberías ver:** en las dos ejecuciones la consola informa que el flujo terminó con error y muestra tu mensaje, y **no queda** `en_ejecucion.lock` en `salida`. El log de la primera termina en la línea `ERROR` de la validación (es un error que tu flujo detectó). El de la segunda termina en la línea `ERROR` que escribe `ManejarError`, con el subflow `ProcesarRegistros` y el mensaje de la columna que no existe (es un error que atrapó el bloque). Si vuelves a ejecutar con la ruta correcta, arranca sin problema.

**Si no lo ves:**
- *Queda el `.lock`:* `CerrarRecursos` quedó **dentro** del bloque o después de un **Stop flow**; tiene que ir después del **End** del bloque y antes del **Stop flow** final. Bórralo a mano antes de reintentar (es justo lo que soporte tendría que hacer si el diseño falla).
- *Con `wrong_headers.csv` el flujo se detiene sin línea `ERROR`:* leer una columna que no existe puede tratarse como un error de lógica del flujo, que el bloque solo atrapa con la opción correspondiente; comprueba que activaste **Handle flow terminating errors** en el bloque.
- *El flujo termina "bien" aunque falló:* falta el **If** final con **Stop flow** **With error message**: el bloque atrapó el error y quien llamó nunca se entera.
- *La línea `ERROR` del log está vacía:* **Get last error** se ejecutó dos veces con **Clear error** o fuera del manejo; déjalo solo en `ManejarError`.
- *No puedes usar **Run from here** dentro del bloque:* Learn indica que esa opción no está disponible para acciones dentro de **On block error**; ejecuta el flujo entero.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Mensaje exacto con el que terminó cada ejecución forzada (consola) | ___ |
| Última línea del log de cada ejecución forzada | ___ |
| ¿Quedó `en_ejecucion.lock` después de cada una? (sí/no) | ___ |
| Valor de `%LastError.SubflowName%` y `%LastError.ActionName%` en la segunda ejecución (míralo con un punto de interrupción en `ManejarError`) | ___ |

**Scripting complementario (lectura, 5 min).** Cuando un paso excede lo que las acciones nativas resuelven razonablemente, PAD tiene acciones de scripting como **Run PowerShell script** y **Run Python script** ([Learn: Scripting actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/scripting)). Lo que Learn precisa y conviene saber antes de usarlas: las variables del flujo se insertan en el texto del script con la notación `%variable%` y se evalúan **antes** de ejecutarlo (no son parámetros tipados); el resultado vuelve como texto en `PowershellOutput` (lo que el script escribe con `Write-Output`) o `PythonScriptOutput` (con `print`), y los errores en `ScriptError`; **Run Python script** solo ofrece **Python 2.7** y **Python 3.4**. Regla de decisión: primero lo nativo (por ejemplo, **Parse text** ya admite expresiones regulares con **Is regular expression**), y un script corto solo cuando no hay acción equivalente; en el Módulo 70 hay un ejemplo con PowerShell para calcular el hash de un archivo. Revisa siempre `ScriptError`: un script que falla no detiene el flujo por sí solo si nadie mira esa variable.

---

## 🔁 Reto de transferencia — El mismo contrato, una regla que cambia sin tocar el código

**Requisito nuevo:** el equipo comercial actualiza cada semana la lista de clientes bloqueados y no quiere pedirle a RPA que edite el flujo para eso. Además, Finanzas exige rechazar las solicitudes en monedas no aceptadas (hoy solo `COP` y `USD`, según `acceptedCurrencies` de [parametros_proceso.json](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/parametros_proceso.json)). Restricciones:
1. Los clientes bloqueados salen de [catalogo_clientes.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/catalogo_clientes.csv) (columna `status` = `blocked`), no de un valor escrito en el flujo.
2. Los outputs (`Total`, `Procesados`, `Errores`, `LogPath`) no cambian: hay un consumidor que ya los usa.
3. El log distingue el motivo de cada `ErrorValidacion` (cliente bloqueado o moneda no aceptada).
4. Si el catálogo no existe o no se puede leer, es un `ErrorTecnico`: se registra, se cierra y el flujo termina con error.

**Lo que entregas (sin pasos, unos 45 minutos):** el flujo modificado y una nota de media página con qué subflow cambiaste y por qué ahí. Pruébalo con tres entradas: `solicitudes_sucursales.csv` (espera 1 error), [blocked_customer.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/blocked_customer.csv) e [invalid_currency.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/invalid_currency.csv) (1 fila rechazada cada uno, con motivos distintos).

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Configuración fuera del código | El flujo ya no tiene `CLI-0003` escrito en ninguna acción; la lista se arma leyendo el catálogo |
| El cambio cae en el subflow correcto | Lo nuevo está en `Inicializar` (cargar configuración) y `ProcesarRegistros` (regla); `Main` sigue siendo un índice |
| Contrato intacto | Los cuatro outputs siguen existiendo con el mismo nombre externo y tipo |
| Motivo legible | El log de `invalid_currency.csv` dice "moneda no aceptada" y el de `blocked_customer.csv` "cliente bloqueado" |
| Error técnico con cierre | Con una ruta de catálogo inexistente, el log termina en `ERROR`, no queda `.lock` y la consola muestra tu mensaje |

Si te atascas, una pista por vez:
- **Pista 1:** agrega un input `in_CatalogoPath`; lo demás es repetir lo que ya hiciste con el archivo de solicitudes.
- **Pista 2:** recorre el catálogo con **For each** y, si `%CurrentItem['status']%` es `blocked`, agrega `|%CurrentItem['customerId']%|` al texto `cfg_ClientesBloqueados` (con **Set variable** `%cfg_ClientesBloqueados%|%CurrentItem['customerId']%|`). La moneda se valida igual: `cfg_Monedas` = `|COP|USD|`.
- **Pista 3:** si la lectura del catálogo va en `Inicializar`, queda **fuera** del bloque **On block error**: muévela a un subflow que se llame dentro del bloque, o envuelve esa lectura en su propio manejo.

**Micropráctica de transferencia (6 min):** el mismo criterio de contrato con otro consumidor → **[Transferir: reutilizar el flujo sin romper su contrato](/practica/ip-rpa-009-transferir-contrato-reutilizable)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Subflows que modificaste y qué hace cada cambio | ___ |
| Línea del log que rechaza la fila de `invalid_currency.csv` (copiada) | ___ |
| Línea del log que rechaza la fila de `blocked_customer.csv` (copiada) | ___ |
| Mensaje de la consola con un catálogo inexistente y si quedó el `.lock` | ___ |

---

## 💼 Casos Reales de Negocio

Soporte recibe un desktop flow de 180 acciones lineales. Nadie sabe dónde empieza la validación ni cómo reiniciar después de error. Refactorizar a subflows reduce tiempo de soporte y evita cambios accidentales.

## ✅ Buenas Prácticas

- Convenciones: `in_`, `out_`, `cfg_`, `dt_`, `idx_`, `log_`. Recuerda que los nombres no distinguen mayúsculas: dos variables que solo difieren en mayúsculas son la misma.
- No dupliques acciones repetidas: extrae subflows. **Main** queda como índice de llamadas **Run subflow**.
- Centraliza configuración (en `Inicializar`, o mejor, leída de un archivo o de un input), no repartida por las acciones.
- Documenta supuestos en comentarios breves (acción **Comment**).
- Cierra aplicaciones y libera recursos aunque falle el proceso: **On block error** alrededor del trabajo, el cierre después de su **End** y el **Stop flow** con error al final.
- Un log con correlation ID, una línea por registro y estado con nombre (`Procesado`, `ErrorValidacion`, `ErrorTecnico`); en **Write text to file**, **Append content** y **UTF-8** explícitos.
- Separa errores de dato (el bot sigue) de errores técnicos (el bot registra, cierra y termina con error).

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|---|---|---|
| Flujo monolítico sin subflows | Todo se construyó en **Main** | Mover cada etapa a su subflow; **Main** solo llama |
| Mezclar validación, escritura y notificación en la misma sección | No hay responsabilidades separadas | Un subflow por intención (tabla de la Microlección 1) |
| Nombres como `Variable1`, o dos variables "distintas" que en realidad son la misma (una sobrescribe a la otra) | Sin convención; los nombres no distinguen mayúsculas | Prefijos `in_`/`out_`/`cfg_`… y nombres únicos sin depender de mayúsculas |
| El log solo tiene la última línea | **Write text to file** quedó en **Overwrite existing content** (valor por defecto) | **Append content** en todas las escrituras salvo el encabezado |
| El bot no arranca al día siguiente: la marca de ejecución anterior sigue ahí | El error detuvo el flujo antes de `CerrarRecursos`, o un **Stop flow** cortó antes del cierre | **On block error** con **Run subflow** de manejo, cierre después del bloque y **Stop flow** con error al final |
| El flujo "termina bien" aunque falló | El bloque atrapó el error y nadie lo propagó | **If** final sobre la variable de error con **Stop flow** **With error message** |
| No devolver outputs útiles a quien llama (cloud flow, otro desktop flow o soporte) | Los resultados quedan en variables de flujo comunes | Declarar outputs (**+** > **Output**) con nombre externo y asignarlos antes de terminar |

## 🧪 Criterios de Validación

- [ ] Construí un desktop flow con inputs y outputs declarados en el panel de variables, y el diálogo **Flow inputs** los muestra con su nombre externo.
- [ ] Separé inicialización, validación, procesamiento, resultado y cierre en subflows, y **Main** solo los llama.
- [ ] Usé variables, una data table y un **For each** con nombres mantenibles, y sé por qué `out_Total` y `OUT_TOTAL` serían la misma variable.
- [ ] Generé un log de 7 líneas con el mismo correlation ID en todas, una línea por registro y el estado `Procesado` o `ErrorValidacion`.
- [ ] Probé el modo **DryRun**: con `True` no se escribe el archivo de procesados y el log sí.
- [ ] Forcé dos errores técnicos y en ambos el log terminó en `ERROR`, no quedó la marca `en_ejecucion.lock` y la consola mostró mi mensaje de error.
- [ ] Diagnostiqué el síntoma "el bot no arranca porque la ejecución anterior no limpió" antes de ver la solución.
- [ ] Entregué el reto de transferencia (bloqueados desde el catálogo y moneda no aceptada) con el contrato de outputs intacto y la rúbrica completa.
- [ ] Expliqué cómo otro soporte diagnosticaría una falla solo con el log y los outputs.

## Evidencia

Las tablas de evidencia de cada microlección y del reto, el export o capturas del flujo (pestañas de subflows y panel de variables), los dos logs de la Microlección 3 y los dos de la Microlección 4. Lab recomendado: LAB-104.

## Preguntas de verificación

1. ¿Qué ventaja tiene un subflow de cleanup, y dónde tiene que quedar respecto del bloque **On block error** para que corra también cuando hay error?
2. ¿Por qué un output estructurado (`Total`, `Procesados`, `Errores`, `LogPath`) mejora la operación frente a "revisar la pantalla"?
3. ¿Qué hace que una convención de nombres sea útil en PAD, sabiendo que los nombres no distinguen mayúsculas?

## Conexión con siguiente módulo

El primer dominio operativo fuerte es archivos, CSV y Excel, donde cleanup e idempotencia aparecen rápidamente.

## Limitaciones y seguridad

No registres datos personales ni secretos en logs: registra el identificador del registro y el motivo, no la fila completa. Una variable marcada como sensible (**Mark as sensitive**) se enmascara en el diseñador, pero Learn advierte que su valor se ve si lo escribes fuera del flujo (por ejemplo, en un archivo) y que no protege datos escritos a mano en las acciones ([Learn: sensitive variables](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables#sensitive-variables)). Los ejemplos deben usar archivos ficticios.

## Referencias oficiales

- [Create desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/create-flow)
- [Manage variables and the variables pane (input/output y variables sensibles)](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables)
- [The flow designer workspace (subflows)](https://learn.microsoft.com/en-us/power-automate/desktop-flows/designer-workspace)
- [Work with scoped variables](https://learn.microsoft.com/en-us/power-automate/desktop-flows/scoped-variables)
- [Variable data types](https://learn.microsoft.com/en-us/power-automate/desktop-flows/variable-data-types)
- [Handle errors in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)
- [Flow control actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/flowcontrol)
- [File actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)
- [Debugging a desktop flow](https://learn.microsoft.com/en-us/power-automate/desktop-flows/debugging-flow)
