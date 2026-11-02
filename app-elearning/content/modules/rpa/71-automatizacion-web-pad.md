---
moduleId: 71
title: "Automatización web con PAD"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 22
practiceMinutes: 180
slug: "automatizacion-web-pad"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Práctica: unas 3 horas la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3 y el reto de transferencia).*

## 🎯 Objetivo

Automatizar portales web con UI elements, selectores, extracción, formularios, tablas, paginación, descargas, uploads, iframes, pop-ups, sesiones, autenticación, esperas y comparación honesta frente a HTTP/API.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica real en Power Automate for desktop (PAD) con **evidencia** (el dato exacto que observaste, no un "sí, funcionó"). Practicas contra el **portal sandbox** del curso, una página local sin backend que trae escenarios de fallo a propósito. Cierras diagnosticando un selector roto **síntoma primero** y con un **reto de transferencia** con un requisito distinto.
>
> **Antes de empezar, necesitas:**
> - Windows 10 u 11 con PAD instalado y la **extensión de Power Automate para Microsoft Edge** activa. La instalación de las dos está en el [Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad): no la repetimos aquí. Si te saltaste la extensión, Learn indica que se instala después desde **Tools** > **Browser extensions** en el diseñador de flujos, y recomienda apagar en Edge **Settings** > **System** > **Continue running background apps when Microsoft Edge is closed** ([Learn: Install Power Automate browser extensions](https://learn.microsoft.com/power-automate/desktop-flows/install-browser-extensions)).
> - **Licencia:** nada de pago. Learn indica que en cualquier edición de Windows 10/11 puedes crear desktop flows y ejecutarlos **localmente en modo atendido**; lo que necesita una cuenta de organización con licencia premium es la conectividad con cloud flows (disparar o programar el desktop flow desde la nube) y el modo **unattended**, que además requiere el add-on correspondiente ([Learn: Prerequisites and limitations](https://learn.microsoft.com/power-automate/desktop-flows/requirements)). Todo este módulo se hace en local y atendido.
> - El **portal sandbox**: [Portal SIT de solicitudes comerciales](/rpa-sandbox/portal). En PAD usa la URL completa `https://planestudio.vercel.app/rpa-sandbox/portal` (o `http://localhost:3000/rpa-sandbox/portal` si corres la app en tu equipo). Es local, sin login real: **no guardes credenciales en PAD** para este entorno.
> - Una carpeta de trabajo, por ejemplo `C:\RPA\M71\`, para el log y los archivos descargados.

## 📖 Conceptos Clave

La automatización web debe sincronizarse con el estado real de la página. Antes de capturar pantallas, revisa si hay API, conector, exportación soportada o endpoint documentado. Si usas UI, diseña selectores mantenibles y validaciones después de cada acción crítica.

- **Instancia de navegador:** toda automatización web empieza con una acción **Launch new Microsoft Edge** (o Chrome/Firefox), que produce la variable `Browser`. Las demás acciones de navegador reciben esa variable. Por defecto se comunican con el navegador por la **extensión** (**Browser interaction method** = **Browser extension**); la alternativa es WebDriver ([Learn: Browser automation actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/webautomation)).
- **UI element y selector web:** un UI element es la descripción guardada de un elemento de la página; por dentro, uno o más **selectores CSS** con la notación `>` (cada elemento dentro del de su izquierda). Se capturan resaltando el elemento y pulsando **Ctrl + Left click**. Para hacerlos más estables puedes cambiar el operador **Equals to** por otros operadores o expresiones regulares, y usar variables en vez de valores fijos ([Learn: Automate webpages](https://learn.microsoft.com/power-automate/desktop-flows/automation-web)).
- **Las acciones web no mueven el ratón:** por defecto funcionan aunque el navegador esté minimizado o la pestaña no tenga el foco. Algunas (**Click link on web page**, **Populate text field on web page**) admiten interacción física para páginas donde los eventos de JavaScript no bastan; entonces el navegador no puede estar minimizado (Learn: Automate webpages).
- **Esperar por estado, no por reloj:** **Wait for web page content** suspende el flujo hasta que la página contiene (o deja de contener) un elemento o un texto; **If web page contains** pregunta lo mismo sin esperar. Una pausa fija (**Wait**, en segundos) solo sirve como intervalo entre comprobaciones, nunca como sincronización principal.
- **Extracción estructurada:** **Extract data from web page** saca valores, listas o tablas. Con el **live web helper** abierto, clic derecho sobre una tabla HTML > **Extract entire HTML table**; para varias páginas, clic derecho sobre el paginador > **Set element as pager**, y en la acción eliges procesar todas las páginas o un número concreto (Learn: Automate webpages).
- **Descargas:** la acción **Click download link on web page** solo funciona en Internet Explorer, que ya terminó su ciclo de vida; Learn remite a las acciones HTTP (**Download from web**). En Edge, un enlace de descarga normal se pulsa con **Click link on web page** y se confirma el archivo con **Wait for file** ([Learn: HTTP actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/web)).
- **HTTP antes que UI:** **Download from web** e **Invoke web service** hablan con el servidor sin navegador. Si el proveedor publica un archivo o una API, esa vía no depende del DOM y suele ser más estable.

## 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Abrir el portal, capturar UI elements y filtrar

**¿Qué vas a aprender?** A crear la instancia de Edge, capturar los UI elements del filtro y leer en la propia página si el filtro dio el resultado esperado.

**¿Por qué existe esto?** Un bot web que no comprueba lo que la página muestra después de cada acción "funciona" hasta el día en que el filtro no se aplica y descarga datos de todas las regiones.

**Práctica real en PAD (40 min):**

1. Abre el portal en Edge y anota cómo se ve en modo **Normal** (selector **Escenario** a la izquierda): la línea bajo la tabla debe decir **Página 1 de 2 · 9 registros**. Pulsa **Reset** si ya lo habías tocado.
2. En la consola de PAD crea un flujo nuevo llamado `SIT_M71_Portal`. Agrega **Launch new Microsoft Edge** con **Launch mode** = **Launch new Instance**, **Initial URL** = la URL del portal y **Window state** = **Normal**. Deja **Browser interaction method** en **Browser extension**. **Qué deberías ver** al ejecutar: Edge se abre en el portal. **Si falla con "Failed to launch Microsoft Edge"**, revisa que la extensión esté activa (Módulo 68) y que no quede un Edge en segundo plano (el ajuste de **Settings** > **System** de arriba).
3. Agrega **Populate text field on web page**. En **UI element**, elige **Add UI element**, ve al portal, resalta la caja **Buscar por solicitud, cliente o producto** y pulsa **Ctrl + Left click**; después **Done**. En **Text** escribe `CLI-0001`. Deja **Emulate typing** activado (Learn: es más lento, pero necesario en algunas páginas complejas; este portal reacciona a cada tecla).
4. Agrega **Set drop-down list value on web page** sobre el selector de región, con **Operation** = **Select options by name** y **Option names** = `Bogotá`.
5. Comprueba el resultado **en la página**: agrega **If web page contains** con **Check if web page** = **Contains text** y **Text** = `3 registros`. Dentro del **If**, una acción **Write text to file** a `C:\RPA\M71\log.csv` con **If file exists** = **Append content** y texto `M71;filtro;OK;3 registros`; en el **Else**, lo mismo con `ERROR;filtro no aplicado`. (CLI-0001 tiene 3 solicitudes, y las 3 son de Bogotá).
6. Abre el panel **UI elements** del diseñador, selecciona el UI element de la caja de búsqueda y mira su selector. **Qué deberías ver:** una cadena con `>` que describe la ruta hasta un `input`. Anótala tal cual.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Texto de la línea de estado después del filtro (exacto) | ___ |
| Selector que PAD generó para la caja de búsqueda (copiado del panel) | ___ |
| ¿El selector depende de una posición (`:nth-child`, `eq(...)`) o de un atributo estable? | ___ |
| Línea que escribió el flujo en `log.csv` | ___ |

---

## 🧩 Microlección 2 — Esperar por estado y extraer con paginación

**¿Qué vas a aprender?** A esperar con límite a que la tabla esté lista, extraerla página por página y detectar con evidencia los escenarios en que el portal no es confiable.

**¿Por qué existe esto?** "Lento", "error", "sesión expirada" y "modal inesperado" no son excepciones raras: en producción pasan cada semana. Un flujo sin límite de espera se queda colgado; uno que no mira el estado escribe datos incompletos como si fueran buenos.

**Ahora haz algo — micropráctica (6 min):** elige el patrón de espera correcto para cada escenario del portal → **[Esperar por estado en el portal](/practica/ip-rpa-013-esperar-por-estado-en-el-portal)**.

**Práctica real en PAD (60 min):**

1. Copia el flujo de la Microlección 1 o crea `SIT_M71_Extraccion` con solo el **Launch new Microsoft Edge**. Pon el portal en **Normal** y **Reset**.
2. **Espera con límite (polling).** Learn no lista un parámetro de tiempo máximo en la tabla de **Wait for web page content**, así que construye el límite tú: un **Loop** con **Start from** = 1, **End to** = 10, **Increment by** = 1; dentro, un **If web page contains** (**Contains element**, UI element = la tabla, capturada con **Ctrl + Left click** sobre el encabezado de la tabla) que haga **Exit loop**, y después del **If** un **Wait** con **Duration** = 1. Tras el loop, otro **If web page contains** sobre la tabla: si no está, escribe el error en el log y termina con **Stop flow** (**End flow** = **With error message**). Si tu versión de PAD muestra en **Wait for web page content** una opción de tiempo máximo, puedes usarla en lugar del loop; anota cuál usaste.
3. **Extrae.** Agrega **Extract data from web page**. Con la acción abierta, ve al portal: aparece el **live web helper**. Clic derecho sobre la tabla > **Extract entire HTML table**. Clic derecho sobre el botón **Siguiente** > **Set element as pager**. Cierra el helper y, en la acción, deja la paginación activa (**Use paging**), pon **Max web pages to process** = **2** y guarda en una variable (**Store data mode** = **Variable**). La acción trae su propio **Timeout** (60 segundos por defecto) para la extracción. **Qué deberías ver** al ejecutar: `DataFromWebPage` con **9 filas** (5 + 4) y 6 columnas. Escribe la tabla con **Write to CSV file** a `C:\RPA\M71\solicitudes.csv` con **Include column names** activado.
4. Prueba "todas las páginas": activa **Get all web pages** en la acción y vuelve a ejecutar. Anota cuántas filas obtienes. **Si salen más de 9 (filas repetidas)**, el paginador del portal no desaparece en la última página (solo se deshabilita): limita el número de páginas al que dice la línea **Página 1 de N** y anótalo como hallazgo.
5. **Escenarios de fallo.** El escenario vive en la página, no en la URL: una instancia nueva de Edge abre siempre el portal en **Normal**. Para cada escenario, abre el portal a mano, elige el escenario en el selector **Escenario** y cambia la acción de lanzamiento a **Launch mode** = **Attach to running instance**, con **Attach to Microsoft Edge tab** = **By URL** y **Tab URL** = la URL del portal (Learn: primero busca la URL exacta y después una coincidencia parcial). Al terminar cada prueba, pulsa **Reset** para volver a Normal.
   - **Paginación extendida:** 3 filas por página, 3 páginas. ¿Tu extracción de 2 páginas pierde 3 filas? Corrígela leyendo N de la línea de estado.
   - **Lento:** el portal muestra el aviso **Cargando tabla lenta simulada...** y **no lo quita nunca** (es a propósito), aunque la tabla sí aparece debajo con sus 9 filas. Si tu espera fuera "hasta que desaparezca el aviso" (**Wait for web page content** con **Not contain text**), el flujo no terminaría nunca. Tu loop espera a que **aparezca** la tabla: anota en qué vuelta sale. Para comprobar que el límite funciona, prueba el loop en **Error simulado** antes de agregar la detección del aviso del punto siguiente: sin tabla, debe agotar las 10 vueltas y terminar con **Stop flow**.
   - **Error simulado** y **Sesión expirada:** no hay tabla, aparece un aviso rojo. Agrega antes de extraer un **If web page contains** con **Contains text** `Error de servidor simulado` (y otro con `Sesión expirada simulada`) que escriba el error en el log y detenga el flujo **sin escribir** `solicitudes.csv`.
   - **Modal inesperado:** aparece un diálogo encima. Agrega un **If web page contains** (**Contains element** = el diálogo) que pulse **Cerrar modal** con **Press button on web page** antes de extraer.
   - **Datos incompletos:** SOL-2026-0002 sale con producto **faltante** y monto 0. La extracción "funciona": tu flujo debe contar esa fila como rechazada en el log, no pasarla al CSV de buenos.
6. Configura en la acción de extracción **On error** > **Retry action if an error occurs** (por ejemplo, 2 reintentos) y, si aun así falla, **Continue flow run** > **Go to label** hacia una etiqueta de cierre que escriba el error y cierre el navegador con **Close web browser** ([Learn: Handle errors in desktop flows](https://learn.microsoft.com/power-automate/desktop-flows/errors)).

**Evidencia a reportar:**

| Escenario | Filas extraídas | Qué escribió tu log (línea exacta) | ¿Se escribió `solicitudes.csv`? |
|---|---|---|---|
| Normal | ___ | ___ | ___ |
| Paginación extendida | ___ | ___ | ___ |
| Lento | ___ | ___ | ___ |
| Error simulado | ___ | ___ | ___ |
| Sesión expirada | ___ | ___ | ___ |
| Modal inesperado | ___ | ___ | ___ |
| Datos incompletos | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Filas con "todas las páginas" en Normal, y cómo lo corregiste si hubo repetidas | ___ |
| Cómo limitaste la espera (loop o parámetro de la acción) | ___ |
| En qué vuelta salió el loop en Lento, y cuánto tardó en rendirse sin tabla (Error simulado, sin la detección del aviso) | ___ |

---

## 🧩 Microlección 3 — Descargar, comparar con HTTP y decidir API vs RPA

**¿Qué vas a aprender?** A descargar un archivo desde la UI con confirmación real del archivo, a obtener lo mismo por HTTP sin navegador y a escribir la decisión con datos.

**¿Por qué existe esto?** El Caso Real dice que el proveedor no tiene API. Esa afirmación hay que comprobarla y dejarla escrita: si existe un archivo o un endpoint, el bot de UI es deuda técnica desde el primer día.

**Práctica real en PAD (40 min):**

1. **Descarga por la UI.** En el portal, el botón **Descargar esperados** es un enlace de descarga. Antes de pulsarlo, borra la descarga anterior: **If file exists** sobre `C:\Users\<tu usuario>\Downloads\registros_validos.csv` y, dentro, **Delete file(s)** (si el archivo ya existe, Edge guarda la copia con otro nombre y la espera de abajo se daría por cumplida con el archivo viejo). Después agrega **Click link on web page** sobre ese botón y **Wait for file** con **Wait for file to be** = **Created** y **File path** = esa misma ruta. Learn no lista un tiempo máximo en **Wait for file**: si tu versión de PAD lo ofrece, actívalo; si no, haz el mismo polling de la Microlección 2 con **If file exists** + **Wait**. **Si Edge te pregunta dónde guardar**, el archivo no aparece hasta que alguien responde: es un diálogo del navegador, no del portal; anótalo como riesgo.
2. **La misma descarga por HTTP.** Agrega **Download from web** con **URL** = `https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/expected/registros_validos.csv`, **Method** = **GET**, **Save response** = **Save to disk (for files)** y **Destination folder** = `C:\RPA\M71\`. La variable `DownloadedFile` apunta al archivo.
3. **Los datos por HTTP.** Agrega otro **Download from web** a `https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/portal/portal-data.json` con **Save response** = **Get text into variable (for web pages)**. **Qué deberías ver:** `WebPageText` con un JSON que trae `requestId`, `correlationId`, `sourceFile` y otros campos que la tabla del portal **no muestra**.
4. Compara: abre `solicitudes.csv` (Microlección 2), el `registros_validos.csv` descargado y el JSON. ¿Coinciden los 9 `requestId`? ¿Qué columnas solo están en el archivo o en el JSON? Fíjate también en el estado: el portal muestra **Validado** en 3 solicitudes que el archivo y el JSON traen como `new`, y la columna **Monto** del portal es el total de la fila, mientras que el archivo trae `unitPrice`. Anota qué fuente tomarías como verdad y por qué.
5. Escribe la decisión API vs RPA en 5 líneas: qué vía elegirías para este portal, por qué, qué riesgo queda y qué harías si el proveedor publica la API mañana.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Ruta y tamaño del archivo descargado por la UI | ___ |
| Ruta del archivo descargado por HTTP | ___ |
| Columnas que trae el JSON y no la tabla del portal | ___ |
| ¿Coinciden los 9 `requestId`? (sí/no, y cuál falta si no) | ___ |
| Tu decisión API vs RPA (5 líneas) | ___ |

---

### 🔧 Diagnosticar antes de seguir — el selector que dejó de encontrar la tabla

El flujo de la Microlección 2 funcionó una semana; hoy falla en el primer **If web page contains** y el log dice "tabla no disponible". Nadie tocó el flujo. Antes de recapturar a ciegas, lee la evidencia → **[Diagnosticar: el selector que dejó de encontrar la tabla](/practica/ip-rpa-014-diagnosticar-selector-que-dejo-de-encontrar-la-tabla)**.

Después, reprodúcelo: pon el portal en **Selector modificado**, ejecuta tu flujo adjuntándolo a esa pestaña (**Attach to running instance**, como en la Microlección 2) y anota si falla. En este escenario el portal agrega una clase al contenedor de la tabla y cambia su atributo `data-rpa-table`. Si tu selector no falla, mira por qué (probablemente no depende del atributo que cambia). Si falla, abre el UI element en el **Selector Builder**, quita o generaliza el atributo que cambió (por ejemplo, cambiando **Equals to** por **Starts with** o una expresión regular) y vuelve a probar en **Normal** y en **Selector modificado**.

| Campo | Tu valor |
|---|---|
| ¿Falló tu flujo en "Selector modificado"? Error exacto | ___ |
| Atributo del selector que cambió (antes → después) | ___ |
| Tu corrección y la prueba en los dos escenarios | ___ |

---

## 🔁 Reto de transferencia — Solicitudes validadas, con modal y sesión que caduca

Cambia el requisito y comprueba si entendiste el patrón, **sin pasos**. Operación ya no quiere el consolidado completo: quiere **solo las solicitudes en estado Validado y en COP**, con su total, y el portal del proveedor ahora pagina de 3 en 3 (**Paginación extendida**), a veces abre un modal y a veces caduca la sesión a mitad de la corrida.

1. **Micropráctica (7 min):** **[Transferir: solicitudes validadas con modal y sesión expirada](/practica/ip-rpa-015-transferir-solicitudes-validadas-con-sesion-expirada)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En PAD:** construye `SIT_M71_Validadas` reutilizando tus piezas (cada escenario se prueba adjuntando el flujo a la pestaña donde lo elegiste, como en la Microlección 2; para simular que la sesión caduca a mitad de la corrida, recorre las páginas con tu propio loop y cambia el escenario a mano entre una página y otra). Criterios de aceptación: (1) en **Paginación extendida** recorre las 3 páginas sin repetir filas; (2) el resultado tiene solo filas Validado en COP y el total coincide con el que calculas a mano en el portal; (3) con **Modal inesperado** cierra el modal y sigue; (4) con **Sesión expirada** no escribe un archivo parcial: registra el error y se detiene; (5) el log no contiene ninguna credencial.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| `requestId` de las filas Validado en COP | ___ |
| Total en COP que calculó tu flujo | ___ |
| Qué hizo tu flujo en Sesión expirada (línea de log) | ___ |
| Cómo filtraste: ¿en la extracción, después con la tabla, o en el portal? Y por qué | ___ |

## 💼 Casos Reales de Negocio

Un proveedor entrega un portal sin API. El bot consulta solicitudes, descarga reportes y genera archivo consolidado. La operación acepta RPA porque el volumen justifica el costo, pero el runbook declara que un cambio del DOM requiere revisión de selectores.

## ✅ Buenas Prácticas

- Prefiere API cuando sea viable.
- Usa selectores semánticos y alternativos.
- Valida estado después de submit.
- Controla sesión y expiración.
- No registres contraseñas ni tokens.
- Toda espera tiene límite: un loop con **If web page contains** y **Wait** como intervalo, o el límite que traiga la acción; nunca "esperar hasta que desaparezca" algo que podría no desaparecer.
- Comprueba en la página el resultado de cada acción crítica (filtro aplicado, número de registros, mensaje de confirmación) antes de seguir.
- Detecta los avisos de error y de sesión expirada **antes** de extraer, y no escribas archivos parciales.
- Para descargar en Edge usa **Click link on web page** + **Wait for file**, o mejor **Download from web** si el archivo tiene URL directa; **Click download link on web page** es solo para Internet Explorer.
- Si un selector depende de un atributo que cambia entre versiones, generalízalo en el **Selector Builder** (otro operador o expresión regular) en vez de recapturar a ciegas.

## ⚠️ Errores Comunes

- Usar sleep fijo para todo.
- Capturar selectores demasiado específicos.
- Ignorar iframes, pop-ups o descargas incompletas.
- Romper términos de uso del portal.

| Síntoma | Causa probable | Corrección |
|---|---|---|
| El flujo se queda esperando para siempre | Espera sin límite, o espera a que desaparezca un aviso que no desaparece | Polling con **Loop** + **If web page contains** + **Wait**, y **Stop flow** con error al agotar los intentos |
| Filas repetidas al extraer "todas las páginas" | El botón **Siguiente** se deshabilita pero sigue existiendo en la última página | Limita las páginas al N que muestra el portal, o recorre con un loop propio |
| "Failed to launch Microsoft Edge" | Extensión inactiva o Edge corriendo en segundo plano | Activa la extensión y apaga **Continue running background apps when Microsoft Edge is closed** |
| El filtro no se aplica aunque el texto aparece en la caja | La página no recibió los eventos de teclado | Deja **Emulate typing** activado o prueba **Populate text using physical keystrokes** (con el navegador visible) |
| La descarga nunca aparece | Se usó **Click download link on web page** (solo Internet Explorer) o Edge abrió un diálogo de guardado | **Click link on web page** + **Wait for file**, o **Download from web** con la URL |
| El CSV de salida trae una fila con producto vacío y monto 0 | Se confió en la extracción sin validar los datos | Valida cada fila y manda las incompletas al log de rechazos |

## 🧪 Criterios de Validación

- [ ] Automatizo búsqueda, paginación y descarga.
- [ ] Manejo elemento lento o dinámico.
- [ ] Documento por qué no usé API.
- [ ] Capturo evidencia sin exponer credenciales.
- [ ] Registro errores de portal con correlation ID.
- [ ] Mi flujo comprueba en la página que el filtro se aplicó (número de registros) y lo deja en el log.
- [ ] Toda espera de mi flujo tiene límite: sin tabla se rinde con un error controlado, y en Lento no se queda esperando a que desaparezca el aviso.
- [ ] Mi flujo se detiene sin escribir archivos parciales con Error simulado y Sesión expirada, y cierra el modal inesperado.
- [ ] Descargué el mismo archivo por la UI (con **Wait for file**) y por HTTP (**Download from web**) y comparé los datos.
- [ ] Diagnostiqué el selector roto formulando una hipótesis antes de recapturar, y lo probé en Normal y en Selector modificado.
- [ ] Resolví el reto de transferencia (Validado en COP) con paginación extendida, modal y sesión expirada.

## Evidencia

Diagrama web, captura anonimizada, archivo descargado, log de espera/timeout y decisión API vs RPA. Lab recomendado: LAB-106. Incidente relacionado: INC-RPA-007.

Además: las tablas de evidencia de las tres microlecciones, del diagnóstico y del reto de transferencia, `log.csv` y `solicitudes.csv`.

## Preguntas de verificación

1. ¿Qué harías si una tabla tarda más de lo habitual?
2. ¿Por qué un selector con texto exacto puede ser frágil?
3. ¿Cuándo abandonarías RPA web por API?
4. ¿Por qué esperar "a que desaparezca el aviso de carga" es más peligroso que esperar a que aparezca la tabla?

## Conexión con siguiente módulo

Las aplicaciones Windows y legacy agregan foco, ventanas, diálogos, coordenadas, OCR e imágenes.

## Limitaciones y seguridad

No automatices portales reales sin permiso. Usa login simulado o cuenta de prueba.

Learn advierte que la automatización web no puede abrir ni adjuntarse a un navegador abierto con otro usuario de Windows distinto del que abrió PAD (Learn: Automate webpages). Si en tu trabajo el portal exige login, las credenciales van en un almacén seguro (por ejemplo, el campo de entrada cifrada que admiten acciones como **Populate text field on web page**), nunca en el log ni en una variable de texto visible.

## Referencias oficiales

- [Browser automation actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/webautomation)
- [Automate using UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements)
- [Automate webpages](https://learn.microsoft.com/power-automate/desktop-flows/automation-web)
- [HTTP actions reference](https://learn.microsoft.com/power-automate/desktop-flows/actions-reference/web)
- [Handle errors in desktop flows](https://learn.microsoft.com/power-automate/desktop-flows/errors)
- [Install Power Automate browser extensions](https://learn.microsoft.com/power-automate/desktop-flows/install-browser-extensions)
