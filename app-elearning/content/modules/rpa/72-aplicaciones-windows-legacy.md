---
moduleId: 72
title: "Aplicaciones Windows y legacy"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 22
practiceMinutes: 180
slug: "aplicaciones-windows-legacy"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Práctica: unas 3 horas la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2 con el Bloc de notas; la segunda, la Microlección 3 y el reto de transferencia con el simulador legacy).*

## 🎯 Objetivo

Automatizar aplicaciones Windows y legacy con UI automation, ventanas, procesos, diálogos, OCR/imágenes como último recurso, Remote Desktop/Citrix como awareness y control de foco, teclado, ratón, resolución y escalado.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica real en Power Automate for desktop (PAD) con **evidencia** (el dato exacto que observaste). Las Microlecciones 1 y 2 usan una aplicación Windows de verdad que ya tienes: el **Bloc de notas** (Notepad), con su diálogo modal de guardar. La Microlección 3 usa el **simulador legacy** del curso para el proceso por registro (confirmación, duplicado, bloqueo). Cierras diagnosticando una confirmación lenta **síntoma primero** y con un **reto de transferencia** que exige registrar sin duplicar.
>
> **Antes de empezar, necesitas:**
> - Windows 10 u 11 con PAD instalado, como lo dejaste en el [Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad). Para la Microlección 3, también la extensión de Edge (Módulo 68) y haber hecho la Microlección 1 del [Módulo 71](/nivel/rpa/modulo/automatizacion-web-pad).
> - **Licencia:** nada de pago. Crear desktop flows y ejecutarlos localmente en modo atendido está disponible en cualquier edición de Windows 10/11; la conectividad con cloud flows y el modo unattended requieren una cuenta de organización con licencia premium (y el add-on de unattended) ([Learn: Prerequisites and limitations](https://learn.microsoft.com/power-automate/desktop-flows/requirements)).
> - El simulador: [SIT Registro Legacy](/rpa-sandbox/legacy-app) (en PAD, `https://planestudio.vercel.app/rpa-sandbox/legacy-app`). Es una página web **con apariencia de aplicación de escritorio**: aquí se automatiza con acciones de navegador, y en cada paso verás qué acción de UI automation usarías contra un ERP Win32 real.
> - Una carpeta de trabajo, por ejemplo `C:\RPA\M72\`. **Cierra todas las ventanas del Bloc de notas** antes de cada ejecución: el robot necesita un estado inicial conocido.

## 📖 Conceptos Clave

Las apps legacy suelen fallar por foco, ventanas modales, resolución, permisos, selectores pobres o cambios de layout. Coordenadas e imágenes sirven como fallback justificado, no como primer diseño.

- **UI elements de escritorio:** las acciones de UI automation reciben UI elements de escritorio, cuyo selector tiene siempre como raíz `:desktop`; si capturas un control dentro de una ventana, PAD crea dos UI elements, la ventana (padre) y el control (hijo) ([Learn: UI automation actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/uiautomation)). Learn explica que los UI elements existen precisamente para no depender de reconocimiento de imagen ni de coordenadas absolutas ([Learn: Automate using UI elements](https://learn.microsoft.com/power-automate/desktop-flows/ui-elements)).
- **UIA, MSAA y UIA3 Raw:** el capturador trabaja por defecto en modo **UIA**, el recomendado para la mayoría de aplicaciones Windows. Para aplicaciones legacy que no exponen UIA (por ejemplo, VB6 o Win32 clásico), Learn indica cambiar a **MSAA** desde el menú de la esquina superior derecha del capturador; **UIA3 Raw** sirve para estructuras no estándar. Un UI element puede tener **varios selectores**: si uno falla, PAD prueba el siguiente en orden (Learn: Automate using UI elements).
- **Ventanas y procesos:** **Run application** abre la aplicación y devuelve `AppProcessId` y `WindowHandle`; con **After application launch** = **Wait for application to load** no sigue hasta que la aplicación cargó. **Wait for window** espera a que una ventana se abra, se cierre, gane o pierda el foco; **If window** pregunta si está abierta o enfocada; **Focus window** la trae al frente; **Close window** la cierra; **Terminate process** detiene un proceso por nombre o por ID ([Learn: System actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/system)).
- **Simulado o físico:** muchas acciones de UI automation pueden ejecutarse de forma **física** (toman el ratón y el teclado) o **simulada** (por programa, sin traer la ventana al frente), con el parámetro **Simulate action**. La simulación no sirve para todos los controles: Learn lista, por ejemplo, que **Populate text field in window** simulado no funciona con elementos de tipo Pane del Bloc de notas (Notepad/MFC).
- **Privilegios:** PAD tiene que correr con los mismos privilegios, o más altos, que la aplicación que automatiza; para una aplicación elevada, ejecuta PAD como administrador (Learn: UI automation actions reference).
- **Fallbacks, en este orden:** primero selectores (UIA, MSAA, texto con **Capture based on text**); después un selector de **imagen como fallback** del mismo UI element (**Image as fallback** en el **Selector Builder**: si los selectores fallan, PAD busca la imagen) ([Learn: Set fallback mechanism for UI elements](https://learn.microsoft.com/power-automate/desktop-flows/ui-elements-fallback-mechanism)); y solo al final teclado (**Send keys**), imagen (**Move mouse to image**), texto por OCR (**Move mouse to text on screen (OCR)**) o coordenadas (**Move mouse**, **Send mouse click**). Cada fallback se documenta y se prueba con la resolución y la escala de pantalla reales del equipo que ejecuta.

## 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Ventana, proceso y selectores de escritorio

**¿Qué vas a aprender?** A abrir una aplicación Windows con un estado conocido, esperar su ventana, escribir en un control por su selector y leer ese selector para comprobar que no depende de coordenadas.

**¿Por qué existe esto?** El fallo más común en escritorio no es un selector malo: es escribir antes de que la ventana exista o escribir en la ventana equivocada.

**Práctica real en PAD (35 min):**

1. Crea el flujo `SIT_M72_Notepad`. Agrega **Run application** con **Application path** = `notepad` (Learn: algunas aplicaciones de Windows se abren escribiendo su nombre, como **notepad**), **Window style** = **Normal** y **After application launch** = **Wait for application to load**. **Qué deberías ver** en el panel de variables al ejecutar: `AppProcessId` y `WindowHandle` con números. **Si `WindowHandle` sale en 0 o la acción falla al obtener la ventana**, anótalo: el Bloc de notas de Windows 11 es una aplicación empaquetada y el proceso que arranca puede no ser el que termina mostrando la ventana. En ese caso, identifica la ventana con el UI element del paso 2 en vez del handle.
2. Agrega **Wait for window** con **Find window** = **By window UI element**. En **Window** elige **Add UI element**, resalta la ventana del Bloc de notas y pulsa **Ctrl + Left click**; después **Done**. **Wait for window to** = **Open** y activa **Focus window after it opens**.
3. Agrega **Populate text field in window**. En **Text box**, captura el área de texto del Bloc de notas. En **Text to fill in** escribe `SOL-2026-0011;CLI-0005;PROD-003;PID=%AppProcessId%` (el PID marca la línea de esta ejecución; lo usarás en la Microlección 2 para confirmar el guardado). Deja **Simulate action** desactivado (la limitación de Learn citada arriba).
4. Abre el panel **UI elements**: verás la ventana como padre y el área de texto como hijo. Clic derecho sobre el hijo > **Edit** abre el selector builder. Anota el selector y, sobre todo, qué atributos usa (tipo de control, nombre, proceso...). **Si el área de texto no se captura**, prueba el modo **UIA3 Raw** o **MSAA** del capturador y anota cuál funcionó.
5. Agrega **Get screen resolution** con **Monitor number** = 1 y escribe `MonitorWidth` y `MonitorHeight` en `C:\RPA\M72\log.csv` con **Write text to file** (**If file exists** = **Append content**). Anota también, a mano, la escala de pantalla de Windows (en la configuración de pantalla), porque un fallback por imagen o coordenadas depende de las dos.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| `AppProcessId` y `WindowHandle` de una ejecución | ___ |
| Selector de la ventana (copiado) y de qué atributos depende | ___ |
| Selector del área de texto y modo de captura (UIA, MSAA o UIA3 Raw) | ___ |
| ¿Algún selector contiene coordenadas o posiciones? | ___ |
| Resolución (del log) y escala de pantalla de Windows | ___ |

---

## 🧩 Microlección 2 — Diálogos modales: guardar y confirmar de verdad

**¿Qué vas a aprender?** A manejar un diálogo modal que aparece a veces sí y a veces no, a confirmar el resultado con un hecho verificable y a cerrar sin afectar otras ventanas del usuario.

**¿Por qué existe esto?** En un ERP legacy, "guardar" abre diálogos: confirmación, advertencia, "el registro ya existe". El robot que asume que no hubo diálogo deja la aplicación en un estado ambiguo, que es justo lo que el Caso Real prohíbe.

**Ahora haz algo — micropráctica (6 min):** elige las decisiones correctas para guardar y cerrar → **[Diálogo modal al guardar](/practica/ip-rpa-016-dialogo-modal-al-guardar)**.

**Práctica real en PAD (45 min):**

1. Continúa `SIT_M72_Notepad`. Agrega **Send keys** con **Send keys to** = **By window instance/handle** (usa la variable `WindowHandle` del paso 1; si te salió en 0, usa **By UI element** con la ventana capturada) y **Text to send** = `{Control}({S})`. Learn: para usar una tecla como modificador, las dos teclas van entre llaves. Esto es un **fallback de teclado justificado**: el atajo de guardar es estable y no depende de la posición del menú; anótalo así en la evidencia.
2. Abre a mano el diálogo de guardar del Bloc de notas (Ctrl+S) para poder capturarlo. Agrega **Wait for window** sobre esa ventana (**Open**, **Focus window after it opens**), **Populate text field in window** sobre la caja del nombre de archivo con `C:\RPA\M72\registro.txt` y **Press button in window** sobre el botón de guardar. Los textos del diálogo dependen del idioma de tu Windows (en inglés, **Save As** y **Save**; en español, "Guardar como" y "Guardar"): anota los que ves.
3. **El modal que aparece solo a veces.** Ejecuta el flujo una vez: guarda sin preguntar. Ejecútalo otra vez: como `registro.txt` ya existe, Windows abre un diálogo que pregunta si quieres reemplazarlo, y tu flujo se queda parado. Captura ese diálogo (ábrelo a mano repitiendo el guardado) y agrega, después de **Press button in window**, un **If window** (**Check if window** = **Is open**) con ese UI element; dentro, **Press button in window** sobre el botón de confirmar y una línea de log `SOBRESCRITO`.
4. **Confirma con un hecho, no con la ausencia de error.** Que el archivo exista no basta: en la segunda ejecución ya existía desde la primera. Agrega **If file exists** (**If file** = **Exists**, **File path** = `C:\RPA\M72\registro.txt`) y, dentro, **Read text from file** sobre esa ruta (produce `FileContents`) y un **If** con **First operand** = `%FileContents%`, **Operator** = **Contains** y **Second operand** = `PID=%AppProcessId%`: si se cumple, log `GUARDADO`; si no (o si el archivo no existe), log `ERROR;no se guardó` y **Stop flow** con **End flow** = **With error message**.
5. **Cierra sin daños colaterales.** Agrega **Close window** sobre la ventana del Bloc de notas. Después, **Terminate process** con **Specify process by** = **Process ID** y la variable `AppProcessId`, con **On error** > **Continue flow run** > **Go to next action**: si el proceso ya terminó al cerrar la ventana, Learn indica que la acción falla con "Process with specified ID not running", y eso no es un problema. No uses **If process** con el nombre `notepad` para decidir: daría "sí" también por los Bloc de notas del usuario. Learn: si terminas **por nombre**, se cierran **todos** los procesos con ese nombre, incluidos los Bloc de notas del usuario.
6. Envuelve los pasos 1 a 4 en un **On block error** (dale **Name** = `Guardar`) y, en su manejo, **Continue flow run** hacia una etiqueta que escriba el error y pase por el cierre del paso 5 ([Learn: Handle errors in desktop flows](https://learn.microsoft.com/power-automate/desktop-flows/errors)). Pruébalo dejando abierto un Bloc de notas con cambios sin guardar antes de ejecutar: ¿qué hace tu flujo?

**Si tu Bloc de notas de Windows 11 abre pestañas** en una ventana que ya tenías abierta, tu `WindowHandle` puede no ser el de la pestaña nueva: por eso la regla de cerrar todos antes. Anota el comportamiento de tu versión.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Líneas del log de la 1.ª y la 2.ª ejecución | ___ |
| Textos exactos del diálogo de guardar y del diálogo de reemplazo en tu Windows | ___ |
| Justificación del único fallback de teclado del flujo | ___ |
| Qué pasó con un Bloc de notas ajeno abierto durante la ejecución | ___ |

---

## 🧩 Microlección 3 — Proceso por registro en el simulador legacy

**¿Qué vas a aprender?** A recorrer un archivo de entrada, validar cada registro antes de tocar la UI, esperar el desenlace real de cada registro y dejar un estado claro por fila.

**¿Por qué existe esto?** El Caso Real pide validar cada registro, esperar la confirmación y guardar evidencia de errores. Eso no se logra con un solo "Registrar" en un bucle: cada fila puede terminar en confirmado, duplicado, bloqueado, rechazado o sin respuesta.

**Práctica real en PAD (60 min):**

1. Crea `C:\RPA\M72\entrada.csv` con este contenido (UTF-8):
   ```text
   requestId,customerId,productId
   SOL-2026-0011,CLI-0005,PROD-003
   SOL-2026-0001,CLI-0001,PROD-001
   SOL-2026-0012,CLI-0002,
   ```
2. Crea `SIT_M72_Legacy`. **Read from CSV file** con **First line contains column names** activado, **Columns separator** = **Predefined** y **Separator** = **Comma**: produce `CSVTable`. Después **Launch new Microsoft Edge** con el simulador: una instancia nueva abre siempre en modo **Normal** con la tabla inicial de 3 registros.
3. **For each** sobre `CSVTable` (la variable de cada vuelta, `CurrentItem`, es una fila: lees sus columnas con `%CurrentItem['productId']%`). Primero **valida sin tocar la UI**: un **If** con **First operand** = `%CurrentItem['productId']%` y **Operator** = **Is empty** que escriba `requestId;RECHAZADO;producto vacío` en el log y pase a la siguiente fila con **Next loop**.
4. Para las filas válidas: tres **Populate text field on web page** (cajas **Solicitud**, **Cliente** y **Producto**) y **Press button on web page** sobre **Registrar**. Las cajas ya traen valores de ejemplo: deja **If field isn't empty** = **Replace text** (el valor por defecto) para que no se sumen al texto anterior. En un ERP Win32 serían **Populate text field in window** y **Press button in window**: el diseño es el mismo.
5. **Espera el desenlace con límite.** Un **Loop** de 1 a 5 con **Wait** (**Duration** = 1) al final de cada vuelta; dentro, en este orden: si la página contiene el diálogo **Registro confirmado** → **Press button on web page** sobre **Cerrar**, log `REGISTRADO` y **Exit loop**; si contiene el texto `Registro duplicado` → log `DUPLICADO` y **Exit loop**; si contiene `Registro bloqueado simulado` → log `BLOQUEADO` y **Exit loop**; si contiene `Faltan campos obligatorios` → log `RECHAZADO_UI` y **Exit loop**. Si el loop termina sin ninguno, log `SIN_CONFIRMACION`. (En un ERP real: **Wait for window content** / **If window contains**).
6. Ejecuta en **Normal**. **Qué deberías ver:** SOL-2026-0011 `REGISTRADO`, SOL-2026-0001 `DUPLICADO` (ya estaba en la tabla como Pendiente) y SOL-2026-0012 `RECHAZADO`; la tabla del simulador pasa de 3 a 4 registros.
7. Repite en **Confirmación lenta** y en **Bloqueo simulado**. El modo vive en la página, no en la URL: abre el simulador a mano, pulsa **Reset**, elige el modo y cambia la acción de lanzamiento a **Launch mode** = **Attach to running instance** (**Attach to Microsoft Edge tab** = **By URL**, con la URL del simulador). Anota qué cambia.

**Diagnosticar antes de seguir — micropráctica (7 min):** otro compañero hizo el paso 5 sin loop y en **Confirmación lenta** todo le sale mal → **[Diagnosticar: confirmación lenta marcada como fallo](/practica/ip-rpa-017-diagnosticar-confirmacion-lenta-marcada-como-fallo)**.

**Evidencia a reportar:**

| Modo | Estado por fila en tu log (0011 / 0001 / 0012) | Registros en la tabla al final |
|---|---|---|
| Normal | ___ | ___ |
| Confirmación lenta | ___ | ___ |
| Bloqueo simulado | ___ | ___ |

| Campo | Tu valor |
|---|---|
| ¿Qué fila no tocó nunca la UI y por qué? | ___ |
| En Confirmación lenta, ¿en qué vuelta del loop llegó la confirmación? | ___ |

---

### 🖥️ Awareness: Remote Desktop y Citrix

Si el ERP corre en un escritorio remoto, el diseño cambia aunque el flujo se vea igual. Lo que dice Learn ([Automate on virtual desktops](https://learn.microsoft.com/power-automate/desktop-flows/virtual-desktops)):

- Se necesita el **Power Automate agent for virtual desktops** instalado en el escritorio remoto y **corriendo** tanto al diseñar como al ejecutar; sus versiones y las de PAD deben coincidir (PAD ofrece **Sync**).
- Solo están soportados Windows RDP, RemoteApp, Citrix Desktop y Citrix Virtual Apps, y el agente **no es compatible con Windows 10/11 Home**.
- Los UI elements capturados en un escritorio virtual aparecen bajo un padre **RDP** o **Citrix** y quedan ligados a esa máquina: en otra máquina hay que recapturarlos.
- Si la ventana del escritorio virtual está minimizada, los elementos no se encuentran: usa **Focus window** antes de interactuar.
- En escritorios virtuales no está soportado identificar una ventana por **Window instance/handle** ni por título y clase: el **Send keys** por `WindowHandle` de la Microlección 2 tendría que ir por UI element.
- **Set screen resolution** no tiene efecto en sesiones remotas (unattended con cliente de escritorio remoto): la resolución hay que controlarla en la configuración de la sesión ([Learn: Workstation actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/workstation)).

Si no tienes un escritorio remoto para probar, deja esta parte como awareness documentada en la evidencia: qué cambiarías de tu flujo de la Microlección 3 para correrlo contra un ERP publicado por RDP.

---

## 🔁 Reto de transferencia — Registrar sin duplicar

Cambia el requisito y comprueba si entendiste el patrón, **sin pasos**. Operación reprocesa el mismo `entrada.csv` varias veces al día (por cortes de red), y el ERP **no** avisa siempre del duplicado. Tu robot debe ser **idempotente**: correrlo dos veces seguidas no puede crear nada nuevo ni marcar errores falsos.

1. **Micropráctica (7 min):** **[Transferir: registro idempotente en el legacy](/practica/ip-rpa-018-transferir-registro-idempotente-en-el-legacy)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En PAD:** cambia `SIT_M72_Legacy` para que, antes de **Registrar**, use **Consultar por ID** y lea el mensaje con **Get details of element on web page** sobre la línea de mensaje que aparece bajo los botones (**Attribute name** = **Own Text**, el valor por defecto; produce `AttributeValue`). No uses **If web page contains** con el texto `Registrado` o `Pendiente`: esas palabras ya están en la tabla de registros y la condición se cumpliría siempre. Según el mensaje: `No encontrado` → registra; `Registrado` → log `YA_EXISTE` y no toca nada; `Pendiente` → log `EXISTE_PENDIENTE` para revisión humana, sin registrar. Prueba siempre adjuntando el flujo a la pestaña del simulador (**Attach to running instance**, como en el paso 7 de la Microlección 3): una instancia nueva vuelve a la tabla inicial de 3 registros y borraría justo lo que quieres comprobar. Criterios de aceptación: (1) en **Normal**, la segunda ejecución seguida no cambia el número de registros de la tabla; (2) en **Duplicado**, donde el simulador responde "Registro duplicado" incluso a IDs nuevos, tu robot registra la contradicción (consulta dijo `No encontrado`, registro dijo duplicado) y **no reintenta**; (3) en **Botón deshabilitado**, tu robot detecta que **Registrar** no está disponible y se detiene con error en vez de esperar (Learn: **Get details of element on web page** acepta cualquier atributo HTML del elemento, así que puedes leer `disabled` del botón y anotar qué devuelve en Normal y en este modo; el simulador además muestra el texto `Botón deshabilitado por modo de prueba.`); (4) cada fila termina con un único estado en el log.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Log de dos ejecuciones seguidas en Normal | ___ |
| Qué registró tu robot en modo Duplicado | ___ |
| Cómo detectaste el botón deshabilitado (acción y atributo) | ___ |
| Qué acción de UI automation usarías para lo mismo en un ERP Win32 | ___ |

## 💼 Casos Reales de Negocio

Una organización mantiene un ERP Win32 sin API. PAD registra solicitudes desde un CSV. El diseño profesional valida cada registro, espera la confirmación de la app y guarda evidencia de errores sin dejar la ventana en estado ambiguo.

## ✅ Buenas Prácticas

- Trae la ventana al frente solo cuando sea necesario.
- Valida título, proceso y estado.
- Controla resolución y escalado.
- Evita coordenadas salvo fallback documentado.
- Cierra o restaura la aplicación al final.
- Arranca desde un estado conocido (sin instancias previas de la aplicación) y espera la ventana con **Wait for window**, no con una pausa fija.
- Confirma cada resultado con un hecho verificable (el archivo contiene la línea de esta ejecución, la consulta por ID devuelve el registro), no con la ausencia de error.
- Valida los datos antes de tocar la UI: una fila inválida no debe llegar al ERP.
- Termina procesos por **Process ID**, nunca por nombre, para no cerrar ventanas del usuario.
- Antes de registrar, consulta si el registro ya existe: un robot que se reprocesa tiene que ser idempotente.

## ⚠️ Errores Comunes

- Depender de `x,y` sin validación.
- Ignorar ventanas modales.
- No distinguir app local, RDP y Citrix.
- No probar con usuario de ejecución real.

| Síntoma | Causa probable | Corrección |
|---|---|---|
| El texto aparece en otra ventana | **Send keys** a **Foreground window** con el foco perdido | **Populate text field in window** sobre el control, o **Send keys** por UI element o por `WindowHandle` |
| El flujo se queda parado en la segunda ejecución | Apareció un diálogo (reemplazar archivo, "ya existe") que el flujo no contemplaba | **If window** con el diálogo después de cada acción que puede abrirlo |
| Registros válidos marcados como fallidos | Se comprobó la confirmación una sola vez, antes de que llegara | Esperar el desenlace con un loop con límite y, si no llega, consultar por ID antes de marcar fallo |
| Se cerraron Bloc de notas del usuario | **Terminate process** por nombre | Por **Process ID** con `AppProcessId` |
| "Failed to write in textbox" o el control no se encuentra | Control que no admite el modo simulado, o aplicación con más privilegios que PAD | Desactiva **Simulate action**; si la app corre elevada, ejecuta PAD como administrador |
| El selector no captura nada en una app antigua | La aplicación no expone UIA | Cambia el capturador a **MSAA** (o **UIA3 Raw**) y documenta el modo |

## 🧪 Criterios de Validación

- [ ] Uso UI automation antes que coordenadas.
- [ ] Manejo ventana modal y confirmación.
- [ ] Registro fallos por registro.
- [ ] Documento limitaciones de RDP/Citrix.
- [ ] Pruebo foco y resolución.
- [ ] Abrí el Bloc de notas con **Run application**, esperé su ventana y escribí por selector, y anoté de qué atributos dependen los selectores.
- [ ] Mi flujo maneja el diálogo de reemplazo que aparece solo en la segunda ejecución y confirma el guardado leyendo el archivo (no solo con **If file exists**).
- [ ] Cierro la aplicación por ventana y, si hace falta, por Process ID, sin afectar otras instancias del usuario.
- [ ] Mi flujo valida cada fila antes de tocar la UI y deja un único estado por fila en el log, también en Confirmación lenta y Bloqueo simulado.
- [ ] Diagnostiqué la confirmación lenta formulando una hipótesis antes de ver la causa.
- [ ] Resolví el reto de transferencia: dos ejecuciones seguidas no crean registros nuevos ni errores falsos.

## Evidencia

Mapa de ventanas, selectores, log de registros, caso modal y justificación de fallback. Lab recomendado: LAB-107.

Además: las tablas de evidencia de las tres microlecciones y del reto de transferencia, `log.csv`, `entrada.csv` y tu nota de awareness de RDP/Citrix.

## Preguntas de verificación

1. ¿Por qué las coordenadas son último recurso?
2. ¿Qué cambia al ejecutar por Remote Desktop?
3. ¿Cómo detectas una ventana modal inesperada?
4. ¿Por qué "no hubo error" no prueba que un registro se guardó?

## Conexión con siguiente módulo

Profundizarás en selectores, sincronización y resiliencia para reducir fragilidad.

## Limitaciones y seguridad

Citrix y Remote Desktop pueden requerir patrones distintos; marca como awareness si no puedes probarlos en tenant real.

El simulador legacy es una página web: practica el diseño del proceso (validación, desenlaces, idempotencia), no los selectores de una aplicación Win32. Los selectores de escritorio los practicas con el Bloc de notas. No automatices el ERP real de tu empresa sin permiso ni con datos reales.

## Referencias oficiales

- [UI automation actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/uiautomation)
- [Set fallback mechanism for UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements-fallback-mechanism)
- [Automate using UI elements](https://learn.microsoft.com/power-automate/desktop-flows/ui-elements)
- [System actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/system)
- [Mouse and keyboard actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/mouseandkeyboard)
- [Automate on virtual desktops](https://learn.microsoft.com/power-automate/desktop-flows/virtual-desktops)
