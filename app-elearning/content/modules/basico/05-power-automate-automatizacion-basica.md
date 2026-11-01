---
moduleId: 5
title: "Power Automate - Automatización Básica"
level: "basico"
certification: "PL-900"
estimatedMinutes: 25
practiceMinutes: 105
slug: "power-automate-automatizacion-basica"
lastVerified: "2026-11"
---
*Duración: 2-3 semanas · Lectura: 10-12 min · Con práctica: unos 105 min con el ambiente listo; la primera vez, cuenta entre el doble y el triple (núcleo obligatorio); RPA y error handling avanzado pueden quedar para una segunda sesión*

### 🎯 Objetivo
Automatizar procesos de negocio mediante flujos cloud y de escritorio.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Crear un flujo automatizado que reacciona a una nueva Solicitud TI en Dataverse.
- Crear un flujo programado que envía un reporte diario sencillo.
- Leer el historial de ejecución para saber si un flujo corrió bien o dónde falló.

### 🔧 Qué queda para después (Profundización opcional)
- Aprobaciones, patrones Try/Catch con Scopes y Power Automate Desktop. Son muy útiles, pero no necesitas completarlos antes de tener tus primeros flujos funcionando.

### 📖 Conceptos Clave
- **Tipos de flujos**: *Cloud* (en la nube): *automated* (arranca solo con un evento), *instant* (lo lanzas tú con un botón) y *scheduled* (corre a una hora fija); *Desktop* (automatiza clics en tu PC); *Business Process* (guía paso a paso dentro de una app).
- **Triggers** (disparadores): el evento que arranca el flujo; por ejemplo, *when item created/modified* (se crea o cambia un registro), *recurrence* (un horario), *manual* (un botón) o *HTTP request* (una llamada desde otro sistema).
- **Actions** (acciones): cada paso que hace el flujo: *CRUD* (crear, leer, actualizar y borrar datos), enviar avisos, pedir aprobaciones o llamar a otro servicio por *HTTP*.
- **Expresiones**: fórmulas pequeñas para transformar datos (fechas, textos, números).
- **Condiciones**: *If/else* (si pasa esto, haz A; si no, B), *switch* (elige entre varios casos) y *loops* (repetir para cada elemento, con *Apply to each*).
- **Variables**: valores que guardas y cambias durante el flujo: *Initialize* (crearla), *Set* (darle un valor), *Increment* (sumarle) y *Append to array* (añadirle un elemento a una lista).
- **Error Handling** (manejo de errores): qué hacer cuando algo falla; *Configure run after* (ejecutar un paso solo si el anterior falló) y el patrón *Try-Catch* (intentar y, si falla, capturar el error).
- **Connections** (conexiones): con qué cuenta se conecta el flujo a cada servicio: una *service account* (cuenta de servicio: una cuenta de trabajo creada solo para los flujos, que no es de ninguna persona) o la del propio usuario (*user delegated*).
- **Concurrency** (concurrencia): si los pasos o ejecuciones van uno tras otro (*serial*) o a la vez (*parallel*).
- **Scope** (ámbito): ojo, esta palabra significa **tres cosas distintas** en el curso: (1) el **Scope del trigger** de Dataverse dice de quién son las filas que el flujo vigila (por ejemplo, *Organization* = las de cualquier persona del ambiente); (2) la **acción Scope** es una caja que agrupa acciones, útil para manejar los errores de todo un bloque (Práctica 5.4); (3) el **Scope de una Business Rule** (Módulo 4) dice dónde se aplica la regla.

**Palabras que vas a ver en las prácticas (glosario rápido):**
- **Dynamic content** (contenido dinámico): los datos que dejan los pasos anteriores (el título de la solicitud, el correo del contacto…) y que puedes insertar en un campo sin escribirlos.
- **Nombre interno o lógico**: el nombre "técnico" de una tabla o columna, sin espacios y con el prefijo de tu Publisher (por ejemplo `sit_prioridad`). Es distinto del nombre que ves en pantalla ("Prioridad"). Las expresiones usan siempre el nombre interno.
- **OData**: el "idioma" de filtros y orden que entiende Dataverse, por ejemplo `sit_estado eq 723500000` (*eq* = "es igual a"; *ne* = "no es igual a"; *lt* = "menor que"). `null` significa "vacío, sin valor".
- **Row ID** y **GUID**: cada fila de Dataverse tiene un identificador único, un código largo con letras, números y guiones (eso es un *GUID*). *Get a row by ID* necesita ese código para saber qué fila traer.
- **Raw outputs** (salidas en bruto): el detalle completo, en texto técnico (formato JSON), de lo que devolvió una acción en una ejecución. Ahí ves los nombres internos y los valores reales.
- **HTML**: etiquetas como `<p>` (párrafo) o `<table>` (tabla) que le dicen al correo cómo mostrar el texto.
- **Formato ISO** (de fechas): año-mes-día y hora, por ejemplo `2026-10-05T00:00:00Z` (la `Z` significa hora UTC).
- **Compose**: una acción que solo guarda un valor o el resultado de una expresión para usarlo después o verlo en el historial.

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

> **Cómo está organizado el Núcleo:** construyes dos flujos en tres bloques (el flujo automatizado, sus condiciones y su historial de ejecución, y el flujo programado). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu propio flujo. Cierras con un reto en el que ya no te digo los pasos. Las microprácticas no necesitan tenant; construir los flujos sí (tu ambiente Developer y la tabla del Módulo 2).

## 🧩 Microlección 1 — Tu primer flujo automatizado: trigger y acciones

**¿Qué vas a aprender?** Cómo un flujo automatizado se dispara solo cuando pasa algo (el trigger) y encadena acciones usando los datos del paso anterior.

**¿Por qué existe esto?** Si eliges mal el trigger, el flujo no corre o corre cuando no debe. Es el error más común del primer día, y todo lo demás (condiciones, correos, mensajes) depende de que el flujo arranque en el momento correcto.

**Ejemplo pequeño:** "When a row is added" arranca el flujo cuando alguien crea una Solicitud TI; "Get a row by ID" trae los datos del **Solicitante** (el Contact elegido en la solicitud, que no tiene por qué ser quien la creó); "Send an email" le confirma por correo.

**Ahora haz algo — micropráctica (6 min):** **[Elegir el disparador (trigger) correcto](/practica/ip-pa-001-elegir-trigger-correcto)**. Te da una necesidad de automatización y te pide elegir el trigger que la resuelve.

**Práctica real en tu entorno (25 min):** haz los Pasos 1 a 3 de abajo.

##### Práctica 5.1: Flujo Automated - Notificación de Solicitudes

*Trigger: Cuando se crea una Solicitud TI en Dataverse*

> **Antes de empezar: cómo se usa el diseñador (léelo una vez, te sirve para todo el módulo)**
> - **Agregar una acción:** debajo de la última tarjeta del flujo haz clic en el signo **+** y luego en **Add an action**. Escribe el nombre de la acción en el buscador y elígela debajo del conector correcto (por ejemplo, *Microsoft Dataverse*). Al elegirla se abre a la izquierda su **panel de configuración**, con la pestaña **Parameters**. Los campos opcionales se eligen en la lista desplegable **Advanced parameters** de esa pestaña ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)).
> - **Insertar contenido dinámico** (*Dynamic content*: datos de pasos anteriores): haz clic dentro del campo y luego en el **rayo azul** que aparece a su lado (o escribe `/` dentro del campo). Busca el dato por su nombre, por ejemplo **Título de Solicitud**, y haz clic en él: queda insertado como una "pastilla" de color.
> - **Insertar una expresión** (una fórmula, por ejemplo para obtener el texto de una Choice): haz clic dentro del campo y luego en el botón **fx** (*Insert expression*). En la ventana que se abre, pega la expresión en el cuadro de arriba y haz clic en **Add**. Una expresión pegada como texto normal, sin **fx**, no se calcula: se envía tal cual.
> - **Guardar y probar:** como creas el flujo dentro de tu solución, la barra de arriba muestra **Save draft** (guardar borrador) y **Publish** (publicar). Un borrador **no se puede probar**: antes de cada prueba haz clic en **Publish**, y luego en **Test** → **Manually** → **Test**, y sigue las instrucciones que aparecen ([Learn: borradores y versiones](https://learn.microsoft.com/power-automate/drafts-versioning)).
> - **La primera vez** que agregues una acción de un conector (Dataverse, Outlook, Teams), quizá te pida iniciar sesión para crear la **conexión**: usa tu cuenta de trabajo del ambiente Developer.
>
> Fuente: [Learn: el diseñador de cloud flows](https://learn.microsoft.com/power-automate/flows-designer).

> **Prepara tus datos de prueba (5 min):** el correo de este flujo se envía al **Solicitante**, que es un **Contact**. En tu app del Módulo 4 (página **Contact**) crea un contacto con **tu nombre y tu propio correo de trabajo** en la columna **Email**. Cada vez que crees una Solicitud TI para probar este flujo, elige ese contacto en **Solicitante**. Si una solicitud no tiene Solicitante, el Paso 2 fallará porque no tiene ningún Row ID que buscar.

**Paso 1: Crear el flujo dentro de tu solución**

1. En [make.powerautomate.com](https://make.powerautomate.com), comprueba arriba a la derecha que estás en tu ambiente.
2. En el menú lateral elige **Solutions** y abre tu solución **Solicitudes TI** (la del Módulo 2).
3. Haz clic en **New** → **Automation** → **Cloud flow** → **Automated**. Crear el flujo dentro de la solución hace que viaje junto con tu tabla y tu app ([Learn: crear un flujo en una solución](https://learn.microsoft.com/power-automate/create-flow-solution)).
4. **Flow name:** `Notificar Nueva Solicitud TI`. En el buscador de triggers escribe `When a row is added`, elige **When a row is added, modified or deleted** (Microsoft Dataverse) y haz clic en **Create**.
5. Haz clic en la tarjeta del trigger y, en su panel de configuración, completa:
    - **Change type:** Added (solo cuando se crea una fila nueva)
    - **Table name:** Solicitudes TI
    - **Scope:** Organization (que el flujo vigile las solicitudes de cualquier persona del ambiente, no solo las tuyas) ([Learn: el trigger de Dataverse](https://learn.microsoft.com/power-automate/dataverse/create-update-delete-trigger))

**Paso 2: Obtener datos del solicitante**

1. **+** → **Add an action** → busca `Get a row by ID` y elige la de **Microsoft Dataverse**. No le cambies el nombre a la acción.
    - **Table name:** Contacts
    - **Row ID:** con el rayo azul, busca `Solicitante` y elige, de la sección del trigger, el dato de la columna **Solicitante** que trae su identificador (no su nombre). Ese valor es el GUID del contacto, es decir, su Row ID. Si aparece más de un dato con ese nombre, elige el que no es el nombre del contacto (el identificador); si después la acción falla con un error de ID no válido, es que elegiste el otro.

**Paso 3: Enviar email de confirmación**

1. **+** → **Add an action** → busca `Send an email (V2)` y elige la de **Office 365 Outlook**.
    - **To:** con el rayo azul, elige **Email** de la sección *Get a row by ID* (el correo del contacto: en tus pruebas, el tuyo).
    - **Subject:** escribe `Nueva solicitud registrada: ` (con un espacio al final) y, a continuación, inserta con el rayo azul **Título de Solicitud** (de la sección del trigger).
    - **Body:** escríbelo como **texto normal**, sin etiquetas HTML. Escribe cada línea y, donde dice *(…)*, inserta el dato indicado:
   ```
   Hola (Full Name, de Get a row by ID):
   Tu solicitud se registró correctamente.
   Título: (Título de Solicitud, del trigger)
   Categoría: (expresión de Categoría, ver abajo)
   Prioridad: (expresión de Prioridad, ver abajo)
   Fecha: (Fecha Solicitud, del trigger)
   Te avisaremos cuando sea asignada.
   ```

   > **Categoría y Prioridad son columnas Choice:** el valor que llega del trigger es el número de la opción (como `723500002`), no el texto. Para mostrar el texto ("Alta"), inserta con **fx** estas expresiones:
   > - Categoría: `triggerOutputs()?['body/sit_categoria@OData.Community.Display.V1.FormattedValue']`
   > - Prioridad: `triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']`
   >
   > `sit_categoria` y `sit_prioridad` son los **nombres internos** que se generaron en el Módulo 2. Compruébalos en tu solución → **Tables** → **Solicitud TI** → **Columns** (columna *Name* o *Schema name*). Si Dataverse quitó o cambió alguna letra (por ejemplo, las tildes), usa el tuyo. `@OData.Community.Display.V1.FormattedValue` le pide a Dataverse la versión en texto ("formateada") del valor ([Learn: valores con formato](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/select-columns)). Lo verás con más detalle en la Práctica 5.2.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| El trigger exacto que usaste: tabla, tipo de cambio (Change type) y alcance (Scope) | ___ |
| La acción que obtiene los datos del solicitante y qué valor del trigger usa como Row ID | ___ |
| El asunto exacto del correo que recibiste | ___ |

---

## 🧩 Microlección 2 — Condiciones y el historial de ejecución

**¿Qué vas a aprender?** Cómo una condición decide qué rama ejecuta el flujo, y cómo leer el Run history para saber qué pasó de verdad.

**¿Por qué existe esto?** Un flujo que falla en silencio es peor que no tener flujo. El Run history te dice qué acciones corrieron, cuáles fallaron y con qué mensaje; es lo que usas para comprobar lo que realmente pasó, no lo que creías que pasaba.

**Ejemplo pequeño:** si Prioridad = Crítica se envía un mensaje de Teams, y si no, un correo. En el Run history cada acción aparece con una marca verde o una X roja.

**Ahora diagnostica — micropráctica (6 min):** **[Diagnosticar una condición invertida](/practica/ip-pa-003-corregir-condicion-invertida)**. Parte de un síntoma —el flujo manda a aprobación lo que no debía— y te pide arreglar la condición.

**Práctica real en tu entorno (20 min):** haz los Pasos 4 y 5 de abajo.

**Paso 4: Notificar a equipo TI**

> En tu ambiente de práctica no existe un equipo de TI, ni un canal, ni una lista de distribución, y quizá no puedas crearlos. Por eso los dos avisos de este paso **te llegan a ti**: así puedes comprobar cuál de las dos ramas se ejecutó.

1. Debajo de **Send an email (V2)**, **+** → **Add an action** → busca **Condition** (en *Control*).
2. En el primer cuadro de la condición inserta con **fx** la expresión de la **etiqueta** de Prioridad (no el dato `Prioridad` del rayo azul, que es un número): `triggerOutputs()?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']`. Operador: **is equal to**. En el segundo cuadro escribe `Crítica` (con tilde, igual que la opción).
    - **Rama True (Yes)** — mensaje de Teams para ti:
        1. **+** → **Add an action** → busca `Post message in a chat or channel` y elige la de **Microsoft Teams** (en algunas páginas de Learn aparece como *Post a message in a chat or channel*).
        2. **Post as:** Flow bot · **Post in:** Chat with Flow bot · **Recipient:** tu propio correo de trabajo.
        3. **Message:** escribe `SOLICITUD CRÍTICA: ` e inserta con el rayo azul **Título de Solicitud** y **Descripción** (del trigger).
        4. Si tu cuenta no tiene Teams, o la acción falla porque tu organización no permite la app **Workflows** en Teams, cambia esta acción por un **Send an email (V2)** a tu correo con el asunto `SOLICITUD CRÍTICA: ` + **Título de Solicitud** ([Learn: enviar un mensaje en Teams](https://learn.microsoft.com/power-automate/teams/send-a-message-in-teams), [Learn: conector de Teams](https://learn.microsoft.com/connectors/teams/)).
    - **Rama False (No)** — correo para ti:
        1. **+** → **Add an action** → **Send an email (V2)**.
        2. **To:** tu propio correo · **Subject:** `Solicitud no crítica: ` + **Título de Solicitud** · **Body:** `Prioridad: ` + la misma expresión de Prioridad (con **fx**).

**Paso 5: Probar flujo**

1. Haz clic en **Publish** y después en **Test** → **Manually** → **Test**. El diseñador queda esperando a que pase el evento del trigger.
2. En otra pestaña, abre tu app del Módulo 4 y crea una Solicitud TI con **Prioridad = Crítica** y, en **Solicitante**, tu contacto de prueba. Guárdala.
3. Vuelve a la pestaña del flujo: en un minuto o dos verás la ejecución, con una marca verde o una X roja en cada acción. Más tarde puedes volver a verla en la página de detalles del flujo, en el **Run history** (historial de ejecuciones).
4. Comprueba que te llegaron el correo de confirmación (Paso 3) y el mensaje de Teams (o el correo que lo sustituye).
5. Repite con una solicitud de **Prioridad = Media**: esta vez debe ejecutarse la rama False y llegarte el correo "Solicitud no crítica".

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Qué rama de la condición se ejecutó cuando creaste una solicitud de prioridad Crítica | ___ |
| El estado que muestra el Run history para esa ejecución (Succeeded, Failed…) y cuánto tardó | ___ |
| Si alguna acción falló: el nombre exacto de la acción y el mensaje de error que viste | ___ |

---

## 🧩 Microlección 3 — El flujo programado: el reloj en vez del evento

**¿Qué vas a aprender?** Cómo un flujo se ejecuta por horario y consulta los datos con un filtro.

**¿Por qué existe esto?** Los reportes y los recordatorios no dependen de que pase algo: dependen del reloj. Y filtrar en el origen (al leer la tabla) trae solo lo necesario, en vez de traer todo y descartar después.

**Ejemplo pequeño:** una recurrencia diaria a las 8:00, "List rows" con un filtro de estado y un único correo con el resumen.

**Práctica real en tu entorno (40 min):** esta microlección no tiene micropráctica propia; la verificación es ejecutar el flujo a mano (Test) y revisar lo que devolvió.

##### Práctica 5.2: Flujo Scheduled - Reporte Diario

*Objetivo: Enviar resumen diario de solicitudes pendientes*

> **Antes de empezar, tres cosas que usarás en varios pasos:**
> - **Cómo insertar una expresión:** igual que en la Práctica 5.1: haz clic dentro del campo, luego en **fx** (*Insert expression*), pega la expresión y haz clic en **Add**. En el diseñador clásico se hace desde la sección de expresiones del panel de contenido dinámico. Una expresión pegada como texto normal no se calcula: se envía tal cual.
> - **Nombres lógicos (internos):** los ejemplos usan el prefijo `sit_` del Módulo 2 (`sit_estado`, `sit_fechasolicitud`…). Dataverse los generó solo y pudo quitar tildes o espacios, así que en el Paso 2 verás los nombres reales de tus columnas: si alguno es distinto, cámbialo en todas las expresiones.
> - **Datos de prueba:** para leer los números de Estado en el Paso 2 necesitas, en tu app del Módulo 4, **al menos una Solicitud TI en estado Nueva y otra En Proceso**, las dos con **Fecha Solicitud** rellena. Si no las tienes, créalas ahora (o cambia el Estado de una que ya exista).
>
> **El flujo terminado queda en este orden:** Recurrence → List rows → Initialize variable → Condition (¿no hay filas?) → Sí: Terminate / No: Apply to each + Append + Send an email.

**Paso 1: Crear el flujo con su horario**

1. En [make.powerautomate.com](https://make.powerautomate.com), comprueba arriba a la derecha que estás en tu ambiente.
2. En el menú lateral elige **Solutions**, abre **Solicitudes TI** y haz clic en **New** → **Automation** → **Cloud flow** → **Scheduled** (igual que en la Práctica 5.1, pero eligiendo el tipo programado).
3. En la ventana que se abre:
   - **Flow name:** `Reporte Diario Solicitudes`.
   - **Starting:** la fecha de mañana.
   - **Repeat every:** `1` y **Day**.
   - Haz clic en **Create**.
4. Se abre el diseñador con el trigger **Recurrence**. Haz clic sobre él: en el diseñador nuevo se abre su panel de configuración a la izquierda (en el clásico, selecciona **Show advanced options** en la tarjeta) ([Learn](https://learn.microsoft.com/power-automate/run-scheduled-tasks)). Comprueba que **Frequency** dice **Day**: los campos de hora solo aparecen con esa frecuencia. Si no los ves en el panel, ábrelos desde la lista desplegable de parámetros opcionales que está debajo de **Interval** y **Frequency**. Configura ([Learn: flujos programados](https://learn.microsoft.com/power-automate/run-scheduled-tasks)):
   - **Time zone:** elige tu zona horaria en la lista.
   - **At these hours:** `8`.
   - **At these minutes:** `0`.
5. Haz clic en **Save draft** para guardar (lo publicarás antes de probarlo, en el Paso 2).

**Paso 2: Consultar las solicitudes pendientes y ver los valores reales**

1. Debajo del trigger haz clic en **+** → **Add an action**, busca `List rows` y elige la de **Microsoft Dataverse**.
2. **Table name:** `Solicitudes TI`. **No le cambies el nombre a la acción:** las expresiones de abajo la llaman `List_rows`.
3. Deja **Filter rows** vacío por ahora y haz clic en **Publish** y luego en **Test** → **Manually** → **Test** → **Run flow** → **Done**.
4. Cuando termine, haz clic en la acción **List rows** dentro de la ejecución y luego en **Show raw outputs** (el detalle técnico de lo que devolvió la acción). Usa **Ctrl+F** del navegador para buscar el título de una de tus solicitudes y anota:
   - el nombre exacto de cada columna (por ejemplo `sit_estado`, `sit_fechasolicitud`, y las Lookup, que aparecen como `_sit_solicitante_value` y `_sit_asignadoa_value`);
   - el número que tiene `sit_estado` en tu solicitud **Nueva** y en la **En Proceso**. Al lado verás `sit_estado@OData.Community.Display.V1.FormattedValue` con el texto ("Nueva"): así sabes qué número corresponde a cada estado.

   > Los Choice se filtran por su número, no por su texto, y Dataverse asigna esos números según tu Publisher (suelen ser de 9 dígitos, como `723500000`). Por eso no hay un número que sirva para todos: lo lees de tu propia ejecución.
5. Vuelve a **Edit**, abre **List rows**, despliega **Advanced parameters** (en el diseñador clásico, **Show advanced options**) y completa:
   - **Filter rows** (cambia los dos números por los que anotaste):
   ```
   sit_estado eq 723500000 or sit_estado eq 723500001
   ```
   - **Sort By:** `sit_prioridad desc, sit_fechasolicitud desc`

   > **Sort By** usa el mismo idioma OData que **Filter rows**. Learn indica que, con OData, una columna Choice se ordena por el **valor entero** (el número) de la opción, no por su texto ([Learn: ordenar filas con OData](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/order-rows)). Como en el Módulo 2 creaste las opciones en el orden Baja → Media → Alta → Crítica y Dataverse les dio números crecientes, `desc` pone primero las Críticas (compruébalo con los números que viste en el paso 4). Ojo: la misma página explica que FetchXML, que es lo que usan las vistas de una app model-driven (Módulo 4), ordena las Choice por su **texto**.

**Paso 3: Preparar la tabla HTML**

1. Debajo de **List rows**, **+** → **Add an action** → busca **Initialize variable**.
   > Va aquí, en el nivel principal del flujo: Power Automate no permite inicializar una variable dentro de una condición ni de un loop.
2. Complétala:
   - **Name:** `htmlTable`
   - **Type:** String
   - **Value:** pega el encabezado de la tabla:
   ```html
   <table border="1">
     <tr>
       <th>Título</th>
       <th>Categoría</th>
       <th>Prioridad</th>
       <th>Solicitante</th>
       <th>Días Abierta</th>
     </tr>
   ```

**Paso 4: No enviar nada si no hay solicitudes**

1. Debajo de **Initialize variable**, **+** → **Add an action** → busca **Condition** (en *Control*).
2. En el primer cuadro de la condición inserta esta **expresión** (con **fx**):
   ```
   empty(outputs('List_rows')?['body/value'])
   ```
3. Operador: **is equal to**. En el segundo cuadro inserta la expresión `true` (también con **fx**, para que sea un valor lógico y no la palabra "true").
4. En la rama **True** agrega la acción **Terminate** y elige **Status: Succeeded**. Con *Succeeded* no se escribe mensaje; el flujo simplemente termina sin enviar el correo.

**Paso 5: Llenar la tabla y enviar el correo (todo dentro de la rama False)**

1. En la rama **False**, **+** → **Add an action** → **Apply to each** (en *Control*).
   - En **Select an output from previous steps** elige, del contenido dinámico de *List rows*, el valor **value** (la lista de filas).
2. Dentro del loop, **+** → **Add an action** → **Append to string variable**:
   - **Name:** `htmlTable`
   - **Value:** escribe las etiquetas y, donde dice *(expresión N)*, inserta con **fx** la expresión correspondiente:
   ```html
   <tr>
     <td>(expresión 1)</td>
     <td>(expresión 2)</td>
     <td>(expresión 3)</td>
     <td>(expresión 4)</td>
     <td>(expresión 5)</td>
   </tr>
   ```
   | # | Columna | Expresión |
   |---|---|---|
   | 1 | Título | `item()?['sit_titulodesolicitud']` — **ejemplo**: cambia `sit_titulodesolicitud` por el nombre interno, en minúsculas, de la columna principal "Título de Solicitud" que anotaste en el Módulo 2 (Práctica 2.1, Paso 1, punto 7). En los *raw outputs* del Paso 2 lo ves junto al título de tu solicitud |
   | 2 | Categoría (texto, no número) | `item()?['sit_categoria@OData.Community.Display.V1.FormattedValue']` |
   | 3 | Prioridad (texto, no número) | `item()?['sit_prioridad@OData.Community.Display.V1.FormattedValue']` |
   | 4 | Solicitante (nombre del Contact) | `item()?['_sit_solicitante_value@OData.Community.Display.V1.FormattedValue']` |
   | 5 | Días abierta | `div(sub(ticks(utcNow()), ticks(item()?['sit_fechasolicitud'])), 864000000000)` |

   > Las columnas `...@OData.Community.Display.V1.FormattedValue` son el texto "formateado" que Dataverse devuelve junto al valor: la etiqueta de una Choice o el nombre principal del registro de un Lookup ([Learn: valores con formato](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/select-columns)). Si no ves alguna en los *raw outputs* del Paso 2, usa el nombre que sí aparezca allí.
   >
   > `item()` es la fila que el loop está recorriendo. La expresión 5 resta dos fechas en *ticks* (unidades de 100 nanosegundos) y divide por los ticks de un día (864000000000), así que da días enteros. Si alguna solicitud no tiene **Fecha Solicitud**, esa acción falla: rellena la fecha o usa `createdon` en su lugar.
3. Debajo del loop, **todavía dentro de la rama False**, agrega otra **Append to string variable** con **Name:** `htmlTable` y **Value:** `</table>`.
4. Debajo, **+** → **Add an action** → **Send an email (V2)** (Office 365 Outlook):
   - **To:** tu propio correo de trabajo.
   - **Subject:** inserta con **fx** `concat('Reporte Diario Solicitudes - ', formatDateTime(utcNow(), 'yyyy-MM-dd'))`.
   - **Body:** este campo acepta HTML ([Learn: conector Office 365 Outlook, acción Send an email (V2)](https://learn.microsoft.com/connectors/office365/)), pero para pegar etiquetas tienes que cambiar el editor a **vista de código**: busca en la barra de herramientas del campo el botón de código (**</>**). Si no lo encuentras, sigue igual: la prueba te mostrará si el correo llega con la tabla o con las etiquetas visibles (ver la tabla de problemas de abajo). Escribe:
   ```html
   <h2>Solicitudes Pendientes de Atención</h2>
   <p>Total: (expresión) solicitudes</p>
   (variable htmlTable)
   ```
   En *(expresión)* inserta con **fx** `length(outputs('List_rows')?['body/value'])`. En *(variable htmlTable)* elige **htmlTable** desde el contenido dinámico (sección *Variables*).
5. **Publish** → **Test** → **Manually** → **Run flow**. Revisa el correo y el Run history. Para probar la otra rama, cambia temporalmente el filtro a un número que no exista (por ejemplo `sit_estado eq 1`): el flujo debe terminar en **Terminate** sin enviar correo. Después vuelve a poner tu filtro.

| Lo que ves | Causa probable | Qué hacer |
|---|---|---|
| El correo muestra literalmente `empty(...)` o `length(...)` | Pegaste la expresión como texto | Bórrala e insértala con **fx** |
| La columna Prioridad muestra un número como `723500002` | Usaste el valor y no la etiqueta | Usa la expresión con `@OData.Community.Display.V1.FormattedValue` |
| La acción de Append falla con un error que menciona la función `ticks` | Alguna fila no tiene Fecha Solicitud (`ticks` necesita una fecha) | Rellena la fecha o usa `createdon` |
| Un error dice que la variable `htmlTable` no existe o no está inicializada, o no te deja añadir Initialize variable | La pusiste dentro de la condición o del loop | Muévela al nivel principal, justo debajo de List rows |
| El correo llega con la tabla como texto con etiquetas `<td>` | Escribiste el HTML en el modo de texto enriquecido | Pégalo en la vista de código del editor (botón **</>**) |
| Pulsaste **Test** y el flujo corre con la versión anterior, o no te deja probar | Solo guardaste un borrador (**Save draft**) | Haz clic en **Publish** antes de **Test** |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La hora y la zona horaria que configuraste en la recurrencia | ___ |
| El filtro exacto de "List rows" | ___ |
| Cuántas filas devolvió la ejecución de prueba y qué hizo el flujo con ese número | ___ |

---

## 🔁 Reto de transferencia — Aviso de solicitudes sin asignar, sin pasos

Esta vez no te digo los pasos: aplica lo que viste a un pedido nuevo.

> **Requerimiento:** el gerente de TI quiere que se le avise solo cuando haya solicitudes **sin técnico asignado desde hace más de 3 días**. Si no hay ninguna, no quiere recibir nada.
> **Criterios de aceptación:** (1) el flujo corre solo, una vez al día; (2) el filtro trae únicamente las solicitudes sin asignar y con más de 3 días, y no todas; (3) si no hay ninguna, el flujo termina sin enviar el correo.
> **Restricciones:** un solo flujo, y sin loops anidados. No uses el trigger "When a row is added": lo que buscas depende del paso del tiempo, no de un evento.
> **Pistas si te atoras:** la recurrencia y "List rows" están en la Práctica 5.2; la condición de "no enviar si está vacío" es el **Paso 4** de esa práctica; recuerda que los valores Choice se filtran por su número, no por su nombre. Para el filtro de este reto: una columna Lookup (como el técnico asignado) se escribe con su nombre lógico entre guiones bajos, por ejemplo `_sit_asignadoa_value` (el nombre exacto lo viste en los *raw outputs* del Paso 2 de la Práctica 5.2), y "vacía" se escribe `eq null`; "más de 3 días" significa que la Fecha Solicitud es **menor que** (`lt`) la fecha de hace 3 días, que calculas con la expresión `addDays(utcNow(), -3)` (da una fecha en formato ISO, como `2026-10-05T00:00:00.0000000Z`). **Cómo mezclar texto y expresión en Filter rows:** escribe el texto `_sit_asignadoa_value eq null and sit_fechasolicitud lt ` (con un espacio al final) y, justo después, inserta con **fx** la expresión `addDays(utcNow(), -3)`; queda como texto + una pastilla de expresión. Si miras la acción en **Code View**, verás la expresión escrita como `@{addDays(utcNow(), -3)}`: esa es la forma de meter una expresión dentro de un texto ([Learn: funciones de expresión, addDays e interpolación](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference), [Learn: filtrar filas con OData](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows)). Un "loop anidado" es un "Apply to each" dentro de otro.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: avisar solo cuando haga falta](/practica/ip-pa-007-transferir-aviso-sin-asignar)**. Retoma el flujo de reporte diario pero con un pedido nuevo, y te pide decidir qué cambia.

**Si aún no tienes tenant:** escribe el filtro exacto que usarías, en qué punto del flujo evitas enviar el correo vacío y por qué un trigger de evento no sirve aquí.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El filtro exacto de "List rows" de tu flujo | ___ |
| En qué punto del flujo evitas enviar el correo cuando no hay solicitudes | ___ |
| Qué comprobaste en el Run history al probarlo (con y sin solicitudes que cumplan) | ___ |

#### 🔧 Profundización opcional

> Completa esta parte cuando ya tengas al menos un flujo automated y uno scheduled con ejecución exitosa en Run history. Si todavía estás luchando con conexiones o permisos, quédate en el núcleo y guarda evidencia.

##### Práctica 5.3: Flujo Instant - Aprobación de Cambios

*Objetivo: Proceso de aprobación para cambios de prioridad*

**Paso 1: Trigger manual**

1. En tu solución **Solicitudes TI**: **New** → **Automation** → **Cloud flow** → **Instant**.
2. Nombre: `Aprobar Cambio Prioridad`
3. Trigger: **PowerApps (V2)** (búscalo escribiendo "Power Apps" y elige el que termina en **V2**; Learn lo llama también *Power Apps V2 trigger*). No uses "Manually trigger a flow": ese trigger es para lanzar el flujo a mano, y la Canvas App del Paso 5 necesita un trigger de Power Apps para poder llamarlo. Tampoco el de V1: el diseñador nuevo pide usar el V2 ([Learn: limitaciones del diseñador nuevo](https://learn.microsoft.com/power-automate/flows-designer#limitations-and-known-issues-in-the-new-designer))
4. En el trigger, agrega tres inputs de tipo **Text**:
    - Solicitud ID
    - Nueva Prioridad
    - Justificación

> Fuente: [Create a canvas app that can trigger a Power Automate flow](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/how-to/trigger-flow) (trigger PowerApps (V2) e inputs) y [Use Power Automate pane](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-flows) (el flujo debe tener un trigger de Power Apps).

**Paso 2: Obtener registro actual**

1. Action: "Get a row by ID" (Dataverse). No le cambies el nombre: la expresión del Paso 3 la llama `Get_a_row_by_ID`.
    - Table name: Solicitudes TI
    - Row ID: con el rayo azul, el input **Solicitud ID** del trigger

**Paso 3: Enviar aprobación**

1. Action: "Start and wait for an approval" (Approvals)
    - Approval type: Approve/Reject - First to respond ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/get-started-approvals))
    - Title: `Cambio de Prioridad Solicitud: ` + **Título de Solicitud** (rayo azul, sección *Get a row by ID*)
    - Assigned to: **tu propio correo de trabajo** (para probar, la aprobadora eres tú; en un caso real sería el gerente de TI)
    - Details: escribe las tres líneas e inserta en cada una el dato indicado:
   ```
   Prioridad actual: (expresión con fx, ver abajo)
   Nueva prioridad: (input Nueva Prioridad, rayo azul)
   Justificación: (input Justificación, rayo azul)
   ```
   Para la **prioridad actual** (el texto de la opción que tiene ahora la solicitud) inserta con **fx**: `outputs('Get_a_row_by_ID')?['body/sit_prioridad@OData.Community.Display.V1.FormattedValue']` (confirma el nombre interno `sit_prioridad`, como en la Práctica 5.1).

**Paso 4: Procesar respuesta**

1. Condition: Si `Outcome = Approve`
    - **Yes**:
     - Action: **Switch** sobre `{Nueva Prioridad input}`, con un caso por prioridad (`Crítica`, `Alta`, `Media`, `Baja`). Dentro de cada caso:
       - Action: "Update a row" (Dataverse)
       - Table: Solicitudes TI
       - Row ID: `{Solicitud ID input}`
       - Prioridad: elige en la lista la opción de ese caso. Una columna Choice guarda el número de la opción, no el texto, así que no puedes pegar el input de texto directamente
     - Action: Send an email (V2) de confirmación (en la prueba, a tu propio correo)
    - **No**:
     - Action: Send an email (V2) de rechazo a tu propio correo, con los comentarios de la respuesta de la aprobación (búscalos con el rayo azul en la sección *Start and wait for an approval*)

**Paso 5: Integrar con Power Apps**

1. En Power Apps Studio, abre **Power Automate** en el menú de creación de la app, selecciona **Add a flow** y elige `Aprobar Cambio Prioridad`
2. Agrega un Drop down `drpNuevaPrioridad` con Items `["Crítica", "Alta", "Media", "Baja"]`, un Text input `txtJustificacion` y un Button "Cambiar Prioridad"
3. OnSelect del botón:
   ```javascript
   AprobarCambioPrioridad.Run(                       // usa el nombre que te proponga IntelliSense al escribir "Aprobar"
       Text(galSolicitudes.Selected.'Solicitud TI'), // la columna de clave (GUID) lleva el nombre de la tabla; confírmalo con IntelliSense
       drpNuevaPrioridad.Selected.Value,             // texto de la lista: coincide con los casos del Switch
       txtJustificacion.Text
   );
   Notify("Solicitud de cambio enviada", NotificationType.Success)
   ```
   > En los ejemplos de Learn el flujo se llama desde Power Fx con su nombre **sin espacios** (por ejemplo `PowerAppsbutton.Run()`), por eso aquí aparece `AprobarCambioPrioridad`. No lo escribas de memoria: empieza a escribir y elige el nombre que te sugiere la barra de fórmulas. Si cambias el flujo desde Power Automate, vuelve al panel **Power Automate** de la app, haz clic en **...** junto al flujo y elige **Refresh** ([Learn: panel Power Automate](https://learn.microsoft.com/power-apps/maker/canvas-apps/working-with-flows)).

##### Práctica 5.4: Error Handling y Reintentos

*Mejorar flujo con manejo robusto de errores*

> Lo harás sobre el flujo **Notificar Nueva Solicitud TI** de la Práctica 5.1, que no usa variables (una variable no se puede inicializar dentro de un Scope, así que el reporte diario no sirve para esto). Patrón *Try-Catch*: el Scope `Main Process` es el "intento" y el Scope `Error Handler` es el que "captura" el error ([Learn: manejo de errores](https://learn.microsoft.com/azure/logic-apps/error-exception-handling)).

**Paso 1: Agregar un Scope para las acciones principales**

1. Abre el flujo. Justo debajo del trigger, **+** → **Add an action** → busca **Scope** (en *Control*).
2. Arrastra dentro del Scope, una por una, las acciones **Get a row by ID**, **Send an email (V2)** y **Condition** (al arrastrar verás líneas azules punteadas donde puedes soltarlas).
3. Selecciona el Scope y cámbiale el nombre a `Main Process`. Por dentro, las expresiones lo llaman `Main_Process` (los espacios se convierten en guiones bajos).

**Paso 2: Configurar reintentos**

1. Selecciona **Get a row by ID** → pestaña **Settings** → **Networking** → **Retry Policy**:
    - Tipo: **Fixed interval** (intervalo fijo)
    - **Count:** 3 (número de reintentos)
    - **Interval:** `PT10S` (10 segundos, en formato de duración ISO 8601; el mínimo es 5 segundos)
2. Ten en cuenta que los reintentos solo se hacen cuando el servicio responde con un error temporal (como "tiempo agotado" o "demasiadas peticiones"), no cuando la fila no existe ([Learn: políticas de reintento](https://learn.microsoft.com/azure/logic-apps/error-exception-handling#retry-policies)).

**Paso 3: Agregar el Scope que captura el error**

1. Debajo de `Main Process` (fuera de él, no dentro), **+** → **Add an action** → **Scope**. Nombre: `Error Handler`.
2. Con `Error Handler` seleccionado → **Settings** → **Run after**: despliega **Main Process**, marca **Has failed** y **Has timed out**, y después desmarca **Is successful** (primero marca otro estado: siempre debe quedar al menos uno marcado).
3. Dentro de `Error Handler`:
    - Action **Compose** (en *Data operations*). En **Inputs** inserta con **fx**: `result('Main_Process')`. Esta función devuelve una **lista** (no un solo mensaje) con el resultado de cada acción del primer nivel del Scope: su nombre, su estado (`Succeeded`, `Failed`…) y sus salidas, donde está el mensaje de error ([Learn: función result](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference#result)).
    - Action **Send an email (V2)** a **tu propio correo**: **Subject** `Falló Notificar Nueva Solicitud TI`; **Body**: escribe `Ejecución: ` e inserta con **fx** `workflow()['run']['name']` (el identificador de la ejecución, para buscarla en el Run history); en otra línea escribe `Detalle: ` e inserta con el rayo azul **Outputs** de *Compose*.
4. *(Opcional, para ir más lejos)* Para quedarte solo con las acciones que fallaron, en lugar de Compose usa **Filter array** con **From** = `result('Main_Process')` y la condición "el campo `status` es igual a `Failed`". Learn la escribe así: `@equals(item()['status'], 'Failed')`.
5. En un proyecto real, además del correo, guardarías el error en una tabla de registro (log) con **Add a new row** (Dataverse). Aquí no la creas: tu modelo no tiene esa tabla.

**Paso 4: Probarlo**

1. **Publish**. Crea una Solicitud TI **sin Solicitante**: *Get a row by ID* fallará porque no tiene Row ID, el Scope `Main Process` quedará en **Failed** y se ejecutará `Error Handler`.
2. En el Run history comprueba qué Scope tiene X roja y cuál marca verde, y revisa el correo que te llegó.
3. Crea otra solicitud **con** Solicitante: esta vez `Main Process` termina bien y `Error Handler` aparece como omitido (**Skipped**).
4. *(Opcional)* Si quieres un aviso de éxito, añade un último **Send an email (V2)** al final, **dentro** de `Main Process`.

##### Práctica 5.5: Power Automate Desktop (RPA)

*Automatizar tarea repetitiva en aplicación legacy*

**Escenario**: Extraer datos de Excel y cargar a Dataverse

**Paso 1: Instalar Power Automate Desktop**

1. Instálalo y conéctalo con tu cuenta de trabajo siguiendo el **[Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad)** (instalación paso a paso, requisitos de Windows y licencias). Para lanzarlo desde un cloud flow necesitas además registrar la máquina y crear una conexión de desktop flow ([Learn: lanzar desktop flows desde cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/link-pad-flow-portal)).

**Paso 2: Crear flujo desktop**

1. New Desktop flow
2. Nombre: `Importar Solicitudes desde Excel`

**Paso 3: Acciones (la parte "robot": leer el Excel)**

1. Action: **Launch Excel**
    - Abre el documento `C:\Datos\Solicitudes.xlsx`. La acción guarda la instancia en la variable `ExcelInstance`.

2. Action: **Read from Excel worksheet**
    - Retrieve: todos los valores disponibles de la hoja
    - Marca la opción para que la primera fila se lea como nombres de columna (Título, Descripción)
    - El resultado queda en una variable de tipo **datatable** (por ejemplo, `ExcelData`). Un *datatable* es una tabla guardada en memoria, con filas y columnas, como una hoja de Excel.

3. Action: **Close Excel**

4. Crea una **variable de salida** (output variable) de tipo **datatable** y asígnale `%ExcelData%`. Las variables de salida pasan datos del desktop flow al cloud flow ([Learn: variables de entrada y salida](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables)).

> **Por qué no se llama a la Web API desde el desktop flow:** una petición HTTP a Dataverse necesita un token OAuth (una "llave" temporal que demuestra quién eres ante el servicio), y conseguirlo exige registrar una aplicación en Microsoft Entra ID, algo que no se ve en este nivel. Es más simple y seguro que el desktop flow solo lea y que el cloud flow escriba con el conector de Dataverse.

**Paso 4: Integrar con Cloud Flow (la parte "nube": crear las filas)**

1. Crea un **Scheduled cloud flow** dentro de tu solución (**New** → **Automation** → **Cloud flow** → **Scheduled**).
2. Action: **Run a flow built with Power Automate for desktop** (grupo Power Automate for desktop)
    - Desktop flow: `Importar Solicitudes desde Excel`
    - Run mode: **attended** (atendido: el flujo corre mientras tú tienes la sesión de Windows abierta y desbloqueada en ese equipo) o **unattended** (desatendido: Power Automate inicia sesión solo en el equipo, sin nadie delante; exige una licencia adicional, Power Automate Process) ([Learn: escenarios attended y unattended](https://learn.microsoft.com/power-automate/guidance/planning/attended-unattended), [Learn: ejecutar desktop flows unattended](https://learn.microsoft.com/power-automate/desktop-flows/run-unattended-desktop-flows))
3. Action: **Apply to each** sobre la variable de salida del paso anterior.
4. Dentro, Action: **Add a new row** (Dataverse), Table: **Solicitudes TI**: `Título de Solicitud` y `Descripción` con los valores de cada fila. La **Categoría** es Choice: elígela en la lista o usa un **Switch** como en la Práctica 5.3; no pegues el texto del Excel.
5. Prueba el flujo y revisa en el **Run history** cómo llega la variable de salida: Learn no documenta el formato exacto de un datatable al llegar al cloud flow, así que ajusta las expresiones a lo que veas allí.

### 💼 Caso Real de Negocio

**Escenario Completo**: Automatización de Onboarding de Empleados

**Flujos implementados**:

1. **Flujo: Nuevo Empleado Registrado**
    - Trigger: Crear registro en tabla "Empleado" (Dataverse)
    - Acciones:
     - Crear la cuenta del usuario en Microsoft Entra ID (HTTP a Microsoft Graph API, `POST /users`)
     - Asignar licencias Microsoft 365
     - Crear buzón Exchange
     - Agregar a grupos de seguridad según departamento
     - Crear ticket en ServiceNow para equipo IT (laptop, accesos)
     - Enviar email bienvenida con credenciales temporales

2. **Flujo: Proceso de Aprobación de Equipamiento**
    - Trigger: Instant (llamado desde Model-Driven App)
    - Aprobar solicitud de laptop según presupuesto
    - Si aprobado: Crear orden de compra en ERP (SAP)
    - Notificar a compras y manager

3. **Flujo: Checklist de Onboarding**
    - Trigger: Scheduled (diario)
    - Consultar empleados con onboarding incompleto
    - Enviar recordatorios a RRHH y managers
    - Escalar si > 7 días sin completar

**Beneficios medibles**:

- Reducción 80% tiempo onboarding (de 5 días a 1 día)
- Eliminación errores manuales en creación cuentas
- Visibilidad completa del proceso para RRHH

### ✅ Buenas Prácticas

**Diseño de flujos**:

- Un flujo = una responsabilidad clara (no mega-flujos)
- Usar nombres descriptivos de acciones (no "Get a row", sino "Obtener Solicitante")
- Documentar las acciones complejas con una nota (menú **⋮** de la tarjeta → **Add a note**; el diseñador nuevo usa notas en lugar de comentarios)
- Usar Scopes para agrupar lógica relacionada

**Performance**:

- Evitar loops anidados (complejidad exponencial)
- Optimización avanzada (cuando ya domines "Apply to each"): la acción "Select" (*Data operations*) transforma una lista entera sin loop. En la Práctica 5.2 usamos "Apply to each" + Append a propósito, porque es más fácil de seguir paso a paso
- Batch operations en Dataverse (bulk create/update)
- Ejecutar a la vez acciones que no dependen entre sí con ramas paralelas (**Add a parallel branch** en el menú del **+**), no con Scopes

**Seguridad**:

- Usar Service Accounts para conexiones de flujos críticos (no cuentas personales)
- Secretos en Azure Key Vault, no hardcoded
- Auditar flujos con acceso a datos sensibles
- Deshabilitar flujos no utilizados

**Mantenibilidad**:

- Versionar flujos antes de cambios mayores (en los flujos creados dentro de una solución, **Version history** muestra las versiones anteriores y permite restaurar una como nuevo borrador)
- Probar en ambiente DEV antes de producción
- Monitorear Run History y Analytics
- Documentar dependencias (flujos que llaman a otros)

**Error Handling**:

- Siempre configurar "Configure run after" en acciones críticas
- Logs de errores a tabla Dataverse o Application Insights
- Notificaciones proactivas de fallos
- Revisar el **Action Timeout** (pestaña **Settings** de la acción) en acciones que pueden esperar mucho, como las aprobaciones, para decidir cuánto tiempo esperar

### ⚠️ Errores Comunes

1. **Lo que ves:** el flujo falla con "Item not found".
    - **Causa**: Race condition o registro eliminado entre trigger y acción
    - **Solución**: Agregar verificación de existencia + error handling

2. **Lo que ves:** el mensaje "Dynamic content not available" al buscar un valor.
    - **Causa**: Referencia a acción dentro de scope/loop diferente
    - **Solución**: Usar outputs() expression o reestructurar

3. **Lo que ves:** el flujo se ejecuta una y otra vez, o hay muchas más ejecuciones de las esperadas.
    - **Causa**: Trigger "When modified" que actualiza el mismo registro
    - **Solución**: Agregar condición para evitar auto-trigger o usar columnas de control

4. **Lo que ves:** el error "Connection not valid" en ejecuciones automáticas.
    - **Causa**: Conexión con credenciales de usuario que cambió contraseña
    - **Solución**: Usar Service Account o renovar conexión

5. **Lo que ves:** el flujo se agota (timeout) dentro de un "Apply to each" con muchos registros.
    - **Causa**: Procesamiento serial de miles de items
    - **Solución**: Pagination + múltiples flujos o usar Concurrency control

6. **Lo que ves:** una expresión que no valida o devuelve un error de sintaxis.
    - **Causa**: Quotes incorrectas o funciones no existentes
    - **Solución**: Validar en Expression editor, consultar documentación

### 🧪 Criterios de Validación
- [ ] 3+ flujos cloud funcionales (automated, scheduled, instant)
- [ ] 1 flujo con aprobaciones implementado y probado
- [ ] Uso correcto de Apply to each con transformación de datos
- [ ] Error handling con Scopes configurado en flujo crítico
- [ ] Integración Power Apps ↔ Power Automate (llamar flujo desde app)
- [ ] Run history revisado e identificación de fallos/optimizaciones
- [ ] 1 flujo Desktop creado (opcional según infraestructura)
- [ ] Explicar diferencia entre triggers y cuándo usar cada uno
- [ ] Calcular costo estimado de ejecuciones de flujo

> Para avanzar como principiante, mínimo valida 2 flujos cloud: uno automated y uno scheduled. El flujo instant de aprobación, el flujo Desktop y el cálculo de costo son profundización.

### 📸 Evidencia para guardar
- Captura del diseñador del flujo automated con trigger de Dataverse.
- Captura del Run history con al menos una ejecución exitosa.
- Captura del email o mensaje enviado por el flujo.
- Si haces aprobaciones: captura del email de aprobación y del cambio aplicado en Dataverse.

### ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 05 · Power Automate — Notificación y Aprobación de Solicitudes](/labs/lab-05-automate-aprobacion)**

**Por qué:** el Lab 05 aterriza este módulo en tres flujos concretos sobre la solución SIT: notificación, reporte diario y aprobación de prioridad crítica. Además evita la ambigüedad más común en Dataverse: filtros OData y valores numéricos de columnas Choice.

**Qué evidencia guardar del lab:** historial exitoso de los 3 flujos, email de confirmación, mensaje de Teams (o el correo que lo sustituye) para solicitud crítica y resultado de aprobar/rechazar una prioridad crítica.

---
