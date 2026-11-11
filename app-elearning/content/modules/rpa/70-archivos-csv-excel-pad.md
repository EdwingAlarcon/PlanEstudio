---
moduleId: 70
title: "Archivos, CSV y Excel con PAD"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 30
practiceMinutes: 240
slug: "archivos-csv-excel-pad"
lastVerified: "2026-11"
---

## 🎯 Objetivo

Automatizar archivos, carpetas, CSV y Excel con validación, cierre seguro, recuperación, procesamiento por lote y criterios claros para no usar Excel como base de datos.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y luego una práctica real en Power Automate for desktop (PAD), con una tabla de evidencia donde anotas el dato exacto que viste. Vas a construir un flujo de lote, `SIT-M70-Lote`, que procesa los archivos de las sucursales del caso SIT: primero las carpetas como estados, luego la lectura de CSV sin suposiciones, después Excel con cierre garantizado y, al final, la idempotencia (no cargar dos veces lo mismo) y el reporte. En la Microlección 2 **diagnosticas un síntoma** antes de ver la causa, y el módulo cierra con un **reto de transferencia** sin pasos.
>
> **Antes de empezar (lee esto, ahorra media hora):**
> - **Este módulo se apoya en el Módulo 69:** subflows con **Main** como índice, inputs y outputs, log con correlation ID y el patrón **On block error** + cierre después del bloque + **Stop flow** con error. No se repite aquí; si no lo hiciste, hazlo primero.
> - **Modo atendido en tu equipo, sin licencia adicional** (como en el Módulo 69; [Learn: Prerequisites and limitations](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)).
> - **Excel de escritorio** para la Microlección 3: Learn indica que PAD usa objetos COM para trabajar con Excel ([Learn: Excel actions, Known limitations](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/excel)), así que las acciones de Excel necesitan Excel instalado en el equipo. **Variante sin Excel:** haz la Microlección 3 en papel (diseño del subflow y diagnóstico) y en la 4 usa solo los CSV.
> - **Carpeta fuera de OneDrive:** dentro de `C:\Users\<tu usuario>\RPA\SIT\` crea `lote\entrada`, `lote\procesado`, `lote\error` y `lote\salida`. Learn advierte que abrir archivos de Excel en carpetas sincronizadas por OneDrive o SharePoint puede fallar con un error de **file not found**; no uses **Documentos** ni **Escritorio** si OneDrive los sincroniza.
> - **Archivos del caso SIT** (ficticios; centro de recursos: [Recursos de práctica RPA](/recursos/rpa-recursos-practica)). Descárgalos a una carpeta `C:\Users\<tu usuario>\RPA\SIT\originales` (no a `entrada`: los vas a copiar según la microlección): [ventas_bogota_2026_07.xlsx](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/ventas_bogota_2026_07.xlsx), [ventas_medellin_2026_07.xlsx](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/ventas_medellin_2026_07.xlsx), [ventas_caribe_2026_07.xlsx](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/ventas_caribe_2026_07.xlsx), [solicitudes_sucursales.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/input/solicitudes_sucursales.csv), [wrong_delimiter.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/wrong_delimiter.csv), [wrong_headers.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/wrong_headers.csv), [empty_file.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/empty_file.csv) y [bad_encoding.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/bad_encoding.csv). Resultado esperado del lote limpio: [consolidado_esperado.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/expected/consolidado_esperado.csv) y [metricas_esperadas.json](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/expected/metricas_esperadas.json) (10 filas, 9 válidas, 1 rechazada).
> - **Tiempo:** la primera vez, unas 4 horas de práctica (más 30 de lectura). Mejor en dos sesiones: Microlecciones 1 y 2 en la primera; de la 3 al reto en la segunda.

---

## 🧩 Microlección 1 — Las carpetas son estados del lote

**¿Qué vas a aprender?** A tratar la carpeta donde está un archivo como su estado (`entrada` = pendiente, `procesado`, `error`, `salida` = resultados) y a recorrer el lote sin perder ningún archivo.

**¿Por qué existe esto?** Si el bot lee de una carpeta y no mueve lo que terminó, mañana lo vuelve a cargar. Si mueve todo, incluso lo que falló, el error desaparece de la vista. Las acciones que necesitas, según Learn ([Folder actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/folder), [File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file), [data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)):
- **Get files in folder** devuelve `Files`, una lista de archivos. Su **File filter** admite varios filtros separados por punto y coma (`*.csv;*.xlsx`) y **Sort by** ordena (por defecto **No sort**). `%Files.Count%` da cuántos hay; cada archivo tiene `.Name`, `.FullName`, `.Size` y `.LastModified`.
- **If folder exists** + **Create folder** crean la estructura si falta.
- **Move file(s)** mueve a una carpeta destino. Su opción **If file exists** viene en **Do nothing**: si en el destino ya hay un archivo con el mismo nombre, no lo sobrescribe. Anota en la práctica qué le pasa entonces al archivo de origen: ese detalle decide si mañana se reprocesa.

**Práctica real en PAD (35 min):**

1. En la consola, **New flow** → `SIT-M70-Lote` → **Create**. Crea los inputs `in_Raiz` (**Text**, por defecto `C:\Users\<tu usuario>\RPA\SIT\lote`) e `in_CorrelationId` (**Text**, opcional), y los subflows globales `Inicializar`, `ProcesarLote` y `CerrarRecursos`. **Main** los llama en ese orden (todavía sin manejo de errores; lo agregas en la Microlección 3).
2. En `Inicializar`: para cada carpeta (`entrada`, `procesado`, `error`, `salida`), **If folder exists** con **If folder** **Doesn't exist** y **Folder path** `%in_Raiz%\entrada` → dentro, **Create folder** con **Create new folder into** `%in_Raiz%` y **New folder name** `entrada`. **End**. Agrega también el log del Módulo 69 (fecha con **Get current date and time** + **Convert datetime to text** `yyyyMMdd-HHmmss` en `log_TsArchivo`, correlation ID, encabezado `timestamp,correlationId,level,step,message` en `out_LogPath` = `%in_Raiz%\salida\log_%log_TsArchivo%.csv`, **Append content** y **UTF-8**). Todas las líneas de log de este módulo se escriben así, con `%log_TsArchivo%,%in_CorrelationId%,` delante del texto que se indica.
3. En `Inicializar`, además, **Create folder** dentro de `%in_Raiz%\procesado` con **New folder name** `%log_TsArchivo%` y guarda la carpeta producida (`NewFolder`) con **Set variable** `cfg_CarpetaProcesado` = `%NewFolder%`. Cada ejecución mueve a su propia subcarpeta.
4. En `ProcesarLote`: **Get files in folder** con **Folder** `%in_Raiz%\entrada`, **File filter** `*.csv;*.xlsx` y **Sort by** **Name**. Escribe en el log `INFO,listar,%Files.Count% archivos en entrada`.
5. **For each** sobre `%Files%` (variable `CurrentItem`): escribe en el log `INFO,archivo,%CurrentItem.Name% %CurrentItem.Size% bytes` y luego **Move file(s)** con **File(s) to move** `%CurrentItem%` y **Destination folder** `%cfg_CarpetaProcesado%`.
6. Copia de `originales` a `entrada` los tres `.xlsx` y `solicitudes_sucursales.csv`, guarda y ejecuta.
7. **Experimento:** copia otra vez `solicitudes_sucursales.csv` a `entrada` y, en el subflow `Inicializar`, desactiva temporalmente la creación de la subcarpeta por ejecución (clic derecho en la acción > **Disable action**) y cambia el destino del paso 5 a `%in_Raiz%\procesado` a secas. Ejecuta dos veces seguidas con el mismo archivo en `entrada` antes de cada ejecución. Luego deshaz el experimento (**Enable action** y destino `%cfg_CarpetaProcesado%`).

**Qué deberías ver:** en la primera ejecución el log dice `4 archivos en entrada`, los lista en orden alfabético y `entrada` queda vacía; los cuatro quedan en `procesado\<fecha-hora>`. En el experimento, la segunda vez el destino ya tiene un archivo con ese nombre: anota dónde quedó el archivo de origen. Si se quedó en `entrada`, la próxima ejecución lo vuelve a leer: por eso cada ejecución mueve a su propia subcarpeta.

**Si no lo ves:**
- *`Files.Count` es 0:* revisa la ruta de **Folder** y el filtro (sin espacios: `*.csv;*.xlsx`).
- *Error al mover:* si tienes el archivo abierto en Excel u otro programa, ciérralo y repite (en la Microlección 4 lo convertirás en un caso controlado).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor de `%Files.Count%` y nombres en el orden en que los procesó | ___ |
| Nombre de la subcarpeta de `procesado` creada en la ejecución | ___ |
| Experimento: dónde quedó `solicitudes_sucursales.csv` en la segunda ejecución con **Do nothing** | ___ |
| Qué pasaría mañana con ese archivo si el flujo no moviera a una subcarpeta por ejecución | ___ |

---

## 🧩 Microlección 2 — CSV sin suposiciones: separador, encabezado y encoding

**¿Qué vas a aprender?** A leer un CSV sin dar por hecho su separador, su encabezado ni su encoding, y a rechazar con un motivo legible el archivo que no cumple el esquema.

**¿Por qué existe esto?** Tres valores por defecto de **Read from CSV file** ([Learn: File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)) explican la mayoría de los incidentes con CSV:

| Parámetro | Por defecto | Riesgo si no lo cambias |
|---|---|---|
| **First line contains column names** | Apagado | El encabezado entra como una fila de datos y no puedes leer columnas por nombre |
| **Separator** | **System default** | El resultado depende de la configuración del equipo donde corre; un archivo con `;` y otro con `,` no se leen igual |
| **Encoding** | **UTF-8** | Un archivo guardado en otra codificación muestra caracteres raros en tildes y eñes |

Learn no detalla de dónde toma PAD el **System default**: por eso, en un flujo que corre en más de un equipo, elige el separador de forma explícita. El esquema se valida **antes** de procesar filas: `%CSVTable.Columns%` es una lista con los nombres de columnas y `%CSVTable.RowsCount%` el número de filas ([Learn: data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)).

**Ahora haz algo — micropráctica (6 min):** elige qué afirmaciones sobre CSV y Excel en PAD son correctas → **[Leer CSV y Excel sin sorpresas](/practica/ip-rpa-010-leer-csv-excel-sin-sorpresas)**.

**Diagnóstico primero — micropráctica (8 min):** un síntoma real de un CSV de sucursal; di qué miras primero → **[Diagnosticar: el CSV llega con una sola columna](/practica/ip-rpa-011-diagnosticar-csv-una-columna)**.

**Práctica real en PAD (45 min):** crea en `SIT-M70-Lote` un subflow `LeerCsv` que reciba el archivo actual (`CurrentItem` del bucle de `ProcesarLote`) y deje la tabla en `dt_Archivo` y un motivo de rechazo en `cfg_Motivo` (vacío si el archivo es válido).

1. **Set variable** `cfg_Motivo` a vacío (deja **To** en blanco). **If** `%CurrentItem.Size%` **Equal to (=)** `0` → **Set variable** `cfg_Motivo` a `archivo vacio` y **Exit subflow**. **End**. (Un archivo de 0 bytes se rechaza antes de intentar leerlo.)
2. **Read text from file** con **File path** `%CurrentItem%`, **Store content as** **List (each is a list item)** y **Encoding** **UTF-8** → `FileContents`. Solo te interesa la primera línea, `%FileContents[0]%`.
3. **If** `%FileContents[0]%` **Contains** `;` → **Read from CSV file** con **File path** `%CurrentItem%`, **Encoding** **UTF-8**, **First line contains column names** encendido, **Separator** **Semicolon**. **Else** → la misma acción con **Separator** **Comma**. **End**. Renombra la variable producida a `dt_Archivo` en las dos.
4. **Join text** con **Specify the list to join** `%dt_Archivo.Columns%`, **Delimiter to separate list items** **Custom** y **Custom delimiter** `|` → `JoinedText`. **Set variable** `cfg_Columnas` a `|%JoinedText%|`.
5. Valida las columnas obligatorias: para cada una de `requestId`, `customerId`, `productId`, `quantity`, `unitPrice`, `currency`, un **If** `%cfg_Columnas%` **Does not contain** `|requestId|` (etc.) → **Set variable** `cfg_Motivo` a `%cfg_Motivo%falta columna requestId; ` (etc.). Escribe `%cfg_Motivo%` al principio del valor: así cada **If** **agrega** su columna al motivo en vez de reemplazar lo que dejó el anterior (si escribes solo `falta columna requestId`, el último **If** que se cumpla borra a los demás y el log diría `falta columna currency`). *(Más corto: guarda los nombres en una lista con **Create new list** y **Add item to list** y recórrela con **For each**.)*
6. En `ProcesarLote`, dentro del bucle: llama a `LeerCsv` solo si `%CurrentItem.Extension%` es `.csv`. Después, **If** `%cfg_Motivo%` **Is not empty** → log `WARN,validar,%CurrentItem.Name% rechazado: %cfg_Motivo%` y **Move file(s)** a `%in_Raiz%\error`; **Else** → log `INFO,validar,%CurrentItem.Name% %dt_Archivo.RowsCount% filas` y mover a `%cfg_CarpetaProcesado%`.
7. Copia a `entrada` `solicitudes_sucursales.csv`, `wrong_delimiter.csv`, `wrong_headers.csv` y `empty_file.csv`, y ejecuta.
8. **Encoding (5 min):** abre `bad_encoding.csv` con **Read text from file** en **UTF-8** y mira `FileContents` en el visor de variables; repite con **Encoding** **System default** y compara cómo se ve la palabra `inválido`.

**Qué deberías ver:** `solicitudes_sucursales.csv` → 4 filas, a `procesado`; `wrong_delimiter.csv` → 1 fila, a `procesado` (detectaste el `;`); `wrong_headers.csv` → rechazado con un motivo que empieza por `falta columna requestId; ` y sigue con las demás columnas que no trae (sus encabezados son `idSolicitud,cliente,producto,cantidad`, así que faltan las seis), a `error`; `empty_file.csv` → rechazado por `archivo vacio`, a `error`. En `bad_encoding.csv`, con UTF-8 la vocal acentuada sale como un carácter de reemplazo; anota qué pasa con **System default**.

**Si no lo ves:**
- *`wrong_delimiter.csv` sale con una sola columna llamada como toda la línea:* el **If** del paso 3 no encontró el `;`; revisa que comparas `%FileContents[0]%` (la primera línea) y no la lista entera.
- *`empty_file.csv` no sale como `archivo vacio`:* el **If** del paso 1 tiene que ir antes de **Read text from file**; si aun así falla una lectura, anota el error exacto: es un error técnico, y lo tratarás con **On block error** en la Microlección 3.
- *Todas las validaciones fallan:* **First line contains column names** quedó apagado y las columnas no tienen nombre de negocio.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Para cada uno de los 4 archivos: separador detectado, filas leídas y carpeta final | ___ |
| Motivo exacto que registró el log para `wrong_headers.csv` y `empty_file.csv` | ___ |
| Cómo se ve `inválido` en `bad_encoding.csv` con **UTF-8** y con **System default** | ___ |

---

## 🧩 Microlección 3 — Excel: leer y cerrar siempre

**¿Qué vas a aprender?** A leer un libro de Excel a una data table y a garantizar que la instancia de Excel se cierra incluso cuando la lectura falla.

**¿Por qué existe esto?** Cada **Launch Excel** abre un proceso de Excel. Si el flujo falla entre la apertura y el cierre, el proceso queda vivo en segundo plano, el archivo queda bloqueado y la ejecución de mañana falla por otra causa. Lo que dice Learn ([Excel actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/excel)):
- **Launch Excel** con **and open the following document** abre un libro y produce `ExcelInstance`. Tiene **Make instance visible** (por defecto encendido) y **Open as ReadOnly** (por defecto apagado). Para leer entradas, **ábrelas en solo lectura**: el bot no debe poder modificar el archivo de la sucursal.
- **Read from Excel worksheet** lee de la **hoja activa**; con **Retrieve** **All available values from worksheet** y **First line of range contains column names** encendido produce `ExcelData` (data table). **Get cell(s) contents as** ofrece **Typed values** (por defecto), **Plain text** y **Formatted text values**.
- **Set active Excel worksheet** activa una hoja por nombre o por índice; si el nombre no existe, da el error **Can't find worksheet**.
- **Close Excel** tiene **Before closing Excel** con **Do not save document** como valor por defecto.

**Práctica real en PAD (50 min):**

1. Agrega el input `in_HojaExcel` (**Text**, por defecto `Solicitudes`, que es la hoja de los tres libros del caso, con **External name** `HojaExcel`). Si todavía no tienes el subflow `ManejarError` en este flujo, cópialo del flujo del Módulo 69: Learn permite copiar y pegar acciones entre instancias abiertas del diseñador.
2. Crea el subflow `LeerExcel`: **Launch Excel** con **Launch Excel** **and open the following document**, **Document path** `%CurrentItem%`, **Make instance visible** apagado y **Open as ReadOnly** encendido → `ExcelInstance`. Luego **Set active Excel worksheet** por **Name** `%in_HojaExcel%`. Luego **Read from Excel worksheet** con **Retrieve** **All available values from worksheet**, **Get cell(s) contents as** **Plain text** y **First line of range contains column names** encendido. **Set variable** `dt_Archivo` a `%ExcelData%`.
3. Crea el subflow `CerrarExcel` con una sola acción **Close Excel** (`%ExcelInstance%`, **Do not save document**). En su **On error** elige **Continue flow run** > **Go to next action**: si no hay instancia que cerrar, el cierre no debe fallar.
4. En `ProcesarLote`, como **primera acción dentro del bucle**, agrega **Set variable** `cfg_Motivo` a vacío: `LeerCsv` lo limpia, pero un `.xlsx` no pasa por `LeerCsv` y heredaría el motivo del archivo anterior (por ejemplo, `archivo vacio`). Luego, para los `.xlsx`, envuelve `Run subflow LeerExcel` en **On block error** (**Name** `LecturaExcel`); con **New rule**, **Set variable** `cfg_Motivo` a `error leyendo Excel` y **Run subflow** `ManejarError` (el del Módulo 69, que escribe `%LastError.Message%` en el log); continúa al final del bloque. **Después** del **End** del bloque, `Run subflow CerrarExcel`. Aplica a los `.xlsx` la misma validación de columnas del paso 4-5 de la Microlección 2 (mueve esos pasos a un subflow `ValidarColumnas` que usen los dos tipos de archivo).
5. Copia los tres `.xlsx` a `entrada` y ejecuta. Al terminar, abre el **Administrador de tareas** de Windows, pestaña **Detalles**, y busca `EXCEL.EXE`.
6. **Fuerza el error:** vuelve a copiar `ventas_bogota_2026_07.xlsx` a `entrada`, ejecuta desde la consola y en **Flow inputs** cambia **HojaExcel** a `Ventas` (una hoja que no existe, como cuando una sucursal renombra la hoja). Vuelve a revisar el Administrador de tareas.

**Qué deberías ver:** en la ejecución normal, el log registra `2 filas` para cada libro y no queda ningún `EXCEL.EXE` iniciado por el flujo. En la ejecución forzada, el log registra la línea `ERROR` con el mensaje de **Can't find worksheet** (o el texto equivalente que muestre tu versión), el libro va a `error` con el motivo `error leyendo Excel` y **tampoco** queda `EXCEL.EXE`.

**Si no lo ves:**
- *Queda `EXCEL.EXE` tras el error:* `CerrarExcel` está **dentro** del bloque, después de la acción que falló; muévelo después del **End**. Termina a mano los procesos colgados antes de repetir.
- *Se abre un aviso de Excel y el flujo espera:* con **Make instance visible** apagado no ves el aviso; enciéndelo para depurar y anota qué decía.
- *Error **file not found** con un archivo que sí existe:* la carpeta está sincronizada por OneDrive o SharePoint (limitación documentada en Learn); usa la carpeta local.
- *Las columnas `quantity` y `unitPrice` no se pueden sumar:* en estos libros las celdas están guardadas como texto; para calcular, conviértelas con **Convert text to number**, que lanza un error si el texto no es un número ([Learn: Text actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/text)).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Filas leídas de cada libro (`%dt_Archivo.RowsCount%`) | ___ |
| Línea `ERROR` del log en la ejecución forzada (copiada) | ___ |
| Procesos `EXCEL.EXE` en el Administrador de tareas tras la ejecución normal y tras la forzada | ___ |
| Carpeta donde terminó `ventas_bogota_2026_07.xlsx` en la ejecución forzada | ___ |

---

## 🧩 Microlección 4 — Lote idempotente: no cargar dos veces lo mismo

**¿Qué vas a aprender?** A hacer que reprocesar el mismo lote no duplique nada, a convertir un archivo bloqueado en un caso controlado y a cerrar con un reporte que se pueda auditar.

**¿Por qué existe esto?** El bot va a volver a ver archivos que ya cargó: una sucursal reenvía el correo, alguien copia de nuevo la carpeta, o un archivo no se pudo mover porque estaba abierto. **Idempotente** significa que ejecutar dos veces con la misma entrada deja el mismo resultado que ejecutar una. Se logra con dos marcas persistentes:
- **Por archivo:** un manifiesto `salida\manifiesto_lote.csv` con una línea `nombre|tamaño|fecha de modificación` por archivo cargado (`%CurrentItem.Name%|%CurrentItem.Size%|%CurrentItem.LastModified%`). Antes de cargar un archivo, si su clave ya está en el manifiesto, se **omite**.
- **Por registro:** el texto `idx_Claves` con los `requestId` ya escritos (`|SOL-2026-0001|SOL-2026-0002|`…): una fila cuya clave ya está se rechaza como duplicada en vez de escribirse dos veces.

Learn ([File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)): **Write to CSV file** acepta una data table, una fila (datarow) o una lista, y su **Include column names** solo actúa si el archivo de destino no existe o está vacío; por eso puedes anexar fila a fila sin repetir el encabezado. Para el archivo bloqueado, la opción **On error** de una acción permite **Retry action if an error occurs** (por defecto, un reintento a los dos segundos) y luego **Continue flow run** > **Go to next action** ([Learn: Handle errors](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)).

**Práctica real en PAD (55 min):**

1. En `Inicializar`: si `%in_Raiz%\salida\manifiesto_lote.csv` existe, **Read text from file** (**Single text value**) en `cfg_Manifiesto`; si no, `cfg_Manifiesto` vacío. **Set variable** `idx_Claves` a `|`. Contadores `out_Filas`, `out_Validas`, `out_Rechazadas` y `out_Omitidos` a `0` (créalos como outputs **Number**). **Set variable** `cfg_Consolidado` a `%in_Raiz%\salida\consolidado_%log_TsArchivo%.csv` (con fecha: nunca sobrescribas el reporte de otra ejecución). **Set variable** `cfg_ClientesBloqueados` a `|CLI-0003|` (o léelo del catálogo si hiciste el reto del Módulo 69).
2. En el bucle de `ProcesarLote`, antes de leer: **Set variable** `cfg_ClaveArchivo` a `%CurrentItem.Name%|%CurrentItem.Size%|%CurrentItem.LastModified%`; **If** `%cfg_Manifiesto%` **Contains** `%cfg_ClaveArchivo%` → log `INFO,omitir,%CurrentItem.Name% ya cargado`, **Increase variable** `out_Omitidos`, mover a `%cfg_CarpetaProcesado%` y **Next loop** (pasa al siguiente archivo). **End**.
3. Crea el subflow `ProcesarFilas`, que se llama cuando el archivo es válido: **For each** sobre `%dt_Archivo%` (variable `Fila`): **Increase variable** `out_Filas`; **If** `%idx_Claves%` **Contains** `|%Fila['requestId']%|` → log `WARN,procesar,%Fila['requestId']% duplicado` e **Increase variable** `out_Rechazadas`; **Else if** `%cfg_ClientesBloqueados%` **Contains** `|%Fila['customerId']%|` → log `WARN,procesar,%Fila['requestId']% cliente bloqueado` e **Increase variable** `out_Rechazadas`; **Else** → **Write to CSV file** con **Variable to write** `%Fila%`, **File path** `%cfg_Consolidado%`, **If file exists** **Append content**, **Include column names** encendido y **Separator** **Comma**; **Set variable** `idx_Claves` a `%idx_Claves%%Fila['requestId']%|`; **Increase variable** `out_Validas`. **End** del **If** y del bucle.
4. Tras procesar un archivo válido, **Write text to file** en `%in_Raiz%\salida\manifiesto_lote.csv` con `%cfg_ClaveArchivo%`, **Append content**, **UTF-8**.
5. **Archivo bloqueado:** antes de cada **Move file(s)**, **Set variable** `cfg_MovidoOk` a `%True%`. En el **On error** de **Move file(s)**: **Retry action if an error occurs** (2 reintentos), **Continue flow run** > **Go to next action** y, con **New rule**, **Set variable** `cfg_MovidoOk` a `%False%`. Después, **If** `%cfg_MovidoOk%` **Equal to (=)** `%False%` → log `WARN,mover,%CurrentItem.Name% bloqueado; queda en entrada`.
6. En `RegistrarResultado` (créalo si no lo tienes): log `INFO,resultado,Filas %out_Filas% Validas %out_Validas% Rechazadas %out_Rechazadas% Omitidos %out_Omitidos%`.
7. **Primera ejecución:** borra el contenido de `entrada`, `procesado`, `error` y `salida`; copia a `entrada` los tres `.xlsx` y `solicitudes_sucursales.csv`; ejecuta.
8. **Reenvío:** copia otra vez los mismos cuatro archivos de `originales` a `entrada` (copiar con el Explorador de Windows conserva la fecha de modificación) y ejecuta.
9. **Bloqueo:** copia `solicitudes_sucursales.csv` a `entrada`, ábrelo en Excel y, sin cerrarlo, ejecuta. Luego cierra Excel y ejecuta otra vez.

**Qué deberías ver:**
- Paso 7: `Filas 10 Validas 9 Rechazadas 1 Omitidos 0`; el consolidado tiene encabezado y 9 filas, y coincide en `requestId` con [consolidado_esperado.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/expected/consolidado_esperado.csv) (la rechazada es `SOL-2026-0003`, cliente bloqueado, como en [metricas_esperadas.json](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/expected/metricas_esperadas.json)).
- Paso 8: `Omitidos 4`, ninguna fila nueva y el consolidado de la primera ejecución intacto.
- Paso 9: con el archivo abierto, lo esperable es que **Move file(s)** falle tras los reintentos y el log diga `bloqueado; queda en entrada`; anota el mensaje exacto. Al cerrar Excel y ejecutar de nuevo, el archivo se **omite** por el manifiesto (ya estaba cargado) y se mueve: el bloqueo no produjo duplicados.

**Si no lo ves:**
- *En el paso 8 se cargan filas otra vez:* la clave del manifiesto no coincide; compara la línea guardada con `%cfg_ClaveArchivo%` en el visor de variables (¿copiaste los archivos con otra herramienta que cambió la fecha?).
- *El consolidado repite el encabezado:* el **Write to CSV file** apunta a un archivo distinto cada vez o **Include column names** se aplicó a un archivo vacío recreado.
- *En el paso 9 el flujo se detiene en **Move file(s)**:* falta **Continue flow run** > **Go to next action** en su **On error**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Línea `resultado` del log en los pasos 7, 8 y 9 (copiadas) | ___ |
| Número de filas de datos del consolidado y los `requestId` rechazados con su motivo | ___ |
| Una línea del manifiesto (copiada) | ___ |
| Mensaje exacto del error de **Move file(s)** con el archivo abierto, y qué pasó en la ejecución siguiente | ___ |

**Opcional — hash del archivo con PowerShell (10 min).** Nombre, tamaño y fecha identifican bien un archivo reenviado sin cambios, pero no detectan un archivo distinto con los mismos tres valores. PAD no trae una acción de hash; es un buen caso para un script corto (Módulo 69): **Run PowerShell script** con `(Get-FileHash -Path "%CurrentItem.FullName%" -Algorithm SHA256).Hash`. El resultado llega en `PowershellOutput` como texto (pásalo por **Trim text** antes de compararlo) y cualquier error en `ScriptError`, que debes revisar ([Learn: Scripting actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/scripting)).

---

## 🔁 Reto de transferencia — La sucursal reenvía un archivo corregido

**Requisito nuevo:** desde el mes que viene el lote corre dos veces al día. Pasan dos cosas que tu flujo actual no resuelve:
1. Bogotá detecta un error y reenvía **`ventas_bogota_2026_07.xlsx` con el mismo nombre pero contenido corregido**: una fila cambió de cantidad y agregó una fila nueva. Las filas que no cambiaron ya están en el consolidado de la mañana.
2. Llegan archivos que no siguen la convención de nombres, como [wrong_name_ventas_julio.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/wrong_name_ventas_julio.csv) (válidos: `ventas_<sucursal>_AAAA_MM.xlsx` y `solicitudes_sucursales.csv`).
3. Contabilidad necesita poder reconciliar: cada fila del consolidado debe decir de qué archivo vino y en qué ejecución.
4. Restricción: la idempotencia por registro tiene que funcionar **entre ejecuciones**, no solo dentro de una (hoy `idx_Claves` empieza vacío en cada corrida).

**Lo que entregas (sin pasos, unos 60 minutos):** el flujo modificado y una decisión escrita de media página que responda: cómo detectas que el reenvío es un archivo nuevo (y por qué el manifiesto actual sí lo deja pasar); qué haces con una fila cuyo `requestId` ya está pero con otra cantidad (¿la omites, la rechazas o la tratas como corrección?, y quién decide); dónde guardas las claves entre ejecuciones; y **en qué punto este proceso debería dejar de vivir en archivos de Excel y pasar a Dataverse, SQL o una API**. Prueba con [partial_processed.csv](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/corrupted/partial_processed.csv) (su única fila, `SOL-2026-0010`, ya está en el consolidado) y con `wrong_name_ventas_julio.csv`.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Idempotencia entre ejecuciones | Con `partial_processed.csv`, después del lote de la mañana, el log dice "duplicado" y el consolidado no crece |
| El reenvío corregido no se pierde ni se duplica | Explicas por qué cambia la clave del manifiesto y qué pasa con cada fila (nueva, igual, cambiada) |
| Decisión sobre la fila cambiada | Eliges un tratamiento, lo justificas y dices qué evidencia queda en el log |
| Archivos fuera de convención | `wrong_name_ventas_julio.csv` termina en `error` con un motivo legible, sin abrirse |
| Reconciliación | Cada fila del consolidado tiene el archivo de origen y el correlation ID de la ejecución |
| Límite de Excel | Nombras al menos dos señales concretas (volumen, varios escritores a la vez, necesidad de consultas o de historial de cambios) que justifican migrar a Dataverse, SQL o una API |

Si te atascas, una pista por vez:
- **Pista 1:** la clave del manifiesto incluye el tamaño y la fecha de modificación: un archivo corregido cambia al menos la fecha. Entonces el manifiesto no te protege de las filas repetidas: eso le toca a la clave por registro.
- **Pista 2:** para que `idx_Claves` sobreviva entre ejecuciones, guárdala en un archivo de `salida` (como el manifiesto) o cárgala al inicio leyendo la columna `requestId` de los consolidados anteriores (**Retrieve data table column into list** + **Join text**).
- **Pista 3:** para el nombre, **Parse text** con **Is regular expression** sobre `%CurrentItem.Name%` (por ejemplo `^ventas_[a-z]+_\d{4}_\d{2}\.xlsx$`) antes de abrir el archivo; el origen ya viene en la columna `sourceFile` de estos archivos, y el correlation ID lo agregas con **Insert column into data table** o en la línea que escribes.

**Micropráctica de transferencia (6 min):** las mismas decisiones en formato de opciones → **[Transferir: idempotencia con reenvíos corregidos](/practica/ip-rpa-012-transferir-idempotencia-reenvio)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Línea del log con `partial_processed.csv` tras el lote de la mañana | ___ |
| Tratamiento elegido para la fila con el mismo `requestId` y otra cantidad, y su justificación | ___ |
| Motivo registrado para `wrong_name_ventas_julio.csv` y carpeta final | ___ |
| Dos señales que justificarían migrar el proceso a Dataverse, SQL o una API | ___ |

---

## 💼 Casos Reales de Negocio

Una operación carga cada mañana archivos de sucursales. El bot debe procesar lo nuevo sin volver a insertar lo ya cargado, cerrar Excel siempre y producir un reporte defendible para auditoría.

## ✅ Buenas Prácticas

- Usa carpetas `entrada`, `procesado`, `error`, `salida`, y mueve a una subcarpeta por ejecución para que un nombre repetido no deje el archivo en `entrada`.
- Valida estructura antes de escribir: separador, encabezado (**First line contains column names**), columnas obligatorias y archivo vacío.
- Elige el separador y el encoding de forma explícita; no dependas de **System default**.
- Abre las entradas de Excel con **Open as ReadOnly** y cierra la instancia después del **End** del bloque de errores, con un cierre que no puede fallar.
- Usa claves de lote (manifiesto por archivo) y de registro (`requestId`) persistentes entre ejecuciones.
- Reportes y logs con fecha y hora en el nombre; nunca sobrescribas el de otra ejecución.
- Para datos maestros o volumen alto, considera Dataverse, SQL o API.

## ⚠️ Errores Comunes

- Dejar procesos Excel abiertos (el cierre quedó dentro del bloque que falló, o no hay manejo de errores).
- Asumir encoding/delimitador (**System default** y encabezado apagado son los valores por defecto de **Read from CSV file**).
- Sobrescribir reportes sin timestamp.
- Procesar dos veces el mismo archivo (sin manifiesto, o con un **Move file(s)** que no movió porque el destino ya tenía ese nombre).
- Usar Excel como base de datos multiusuario.
- Trabajar en una carpeta sincronizada por OneDrive o SharePoint y recibir **file not found** con archivos que existen.

## 🧪 Criterios de Validación

- [ ] Recorro un lote con **Get files in folder** y muevo cada archivo a `procesado` (subcarpeta por ejecución) o a `error` según el resultado.
- [ ] Leo CSV con separador y encabezado explícitos, detecto un `;` y rechazo con motivo legible un archivo vacío y uno sin las columnas obligatorias.
- [ ] Consolido múltiples archivos (CSV y Excel) con validación: 10 filas leídas, 9 válidas y 1 rechazada en el lote limpio.
- [ ] Cierro Excel aun cuando hay error, y lo demuestro con el Administrador de tareas tras una ejecución forzada con una hoja inexistente.
- [ ] Evito duplicados por archivo (manifiesto) y por registro (`requestId`): reenviar el mismo lote da `Omitidos 4` y ninguna fila nueva.
- [ ] Manejo archivo bloqueado sin perder trazabilidad: reintento, aviso en el log y ninguna fila duplicada en la ejecución siguiente.
- [ ] Produzco reporte y log con fecha en el nombre y una línea de resultado con los contadores.
- [ ] Diagnostiqué el síntoma "el CSV llega con una sola columna" antes de ver la solución.
- [ ] Entregué el reto del reenvío corregido con su decisión escrita y la rúbrica completa, incluido cuándo dejar Excel.

## Evidencia

Las tablas de evidencia de cada microlección y del reto, los logs de las ejecuciones, el consolidado, el manifiesto, la captura del Administrador de tareas tras la ejecución forzada y la estructura final de carpetas. Lab recomendado: LAB-105. Challenge relacionado: CH-RPA-01.

## Preguntas de verificación

1. ¿Cuándo Excel deja de ser una buena base de datos?
2. ¿Cómo evitas reprocesar un archivo, y por qué un manifiesto por nombre, tamaño y fecha no basta cuando la sucursal reenvía un archivo corregido?
3. ¿Qué evidencia prueba que cerraste Excel correctamente, también cuando la lectura falló?

## Conexión con siguiente módulo

Luego aplicarás los mismos principios a automatización web, donde selectores y esperas son el riesgo principal.

## Limitaciones y seguridad

No uses archivos reales de nómina, clientes o finanzas. Enmascara cualquier dato sensible en capturas. Learn indica que las acciones de archivo, carpeta y scripting sobre recursos protegidos de Windows requieren ejecutar PAD con permisos de administrador: trabaja en tu carpeta de usuario y no en carpetas del sistema.

## Referencias oficiales

- [Excel actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/excel)
- [File actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/file)
- [Folder actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/folder)
- [Variables actions (data tables y listas)](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/variables)
- [Variable data type properties](https://learn.microsoft.com/en-us/power-automate/desktop-flows/datatype-properties)
- [Handle errors in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/errors)
- [Text actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/text)
- [Scripting actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/scripting)
