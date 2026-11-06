---
moduleId: 75
title: "Integración cloud flow + desktop flow"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 27
practiceMinutes: 300
slug: "integracion-cloud-desktop-flow"
lastVerified: "2026-11"
---
*Lectura: 25-30 min · Práctica: unas 5 horas la primera vez, mejor en tres sesiones (la primera, Microlecciones 1 y 2, que se hacen sin licencia; la segunda, la Microlección 3 y el diagnóstico; la tercera, el diseño sin pasos y el reto de transferencia).*

## 🎯 Objetivo

Diseñar un patrón end-to-end donde Power Automate cloud recibe trabajo, llama un desktop flow con inputs, usa máquina o machine group, recibe outputs, almacena estado, notifica resultado y monitorea errores.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (los valores que obtuviste, no un sí/no). La pieza central es el **contrato** entre las dos capas: lo que viaja de ida, lo que vuelve y lo que nunca debe viajar. Lo construyes primero en tu equipo, **sin licencia**, simulando el disparador del cloud flow, y después diseñas (y, si tienes licencia, construyes) el lado cloud. Cierras **diagnosticando síntoma primero** un estado atascado, **diseñando sin pasos** un lote nocturno y con un **reto de transferencia** de una solicitud a dos mil.
>
> **Antes de empezar, necesitas:**
> - Windows 10/11 con Power Automate for desktop (PAD) y la extensión para Microsoft Edge (instalación en el [Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad)).
> - **Haber hecho el [Módulo 74](/nivel/rpa/modulo/errores-logging-idempotencia):** reutilizas el flujo `M74 Idempotencia`, sus UI elements de SIT Registro Legacy y la idea de estado por solicitud. El sandbox es [SIT Registro Legacy](/rpa-sandbox/legacy-app) (en PAD, con la URL completa: `https://planestudio.vercel.app/rpa-sandbox/legacy-app`).
> - **Qué requiere licencia y qué no (Learn):** crear y probar el desktop flow en tu equipo **no** la requiere. Disparar un desktop flow **desde un cloud flow** sí: Learn indica que hace falta un plan premium por usuario con RPA atendido (*attended RPA*) para el modo atendido, y el plan Process (o el complemento de RPA desatendido) para el modo desatendido ([Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines), [Run unattended desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)). En la tabla de [requisitos](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements), la conexión con cloud flows figura como "No" para una cuenta Microsoft personal o una cuenta de trabajo o escuela sin licencia, y como "Yes" solo para una *Organization premium account*. Y con Windows Home no se pueden disparar desktop flows desde la nube. El Developer Plan no incluye derechos de RPA ([Developer Plan](https://learn.microsoft.com/en-us/power-platform/developer/plan)); para la variante con licencia necesitas una prueba (*trial*) de Power Automate o un plan que lo incluya. **Por eso la Microlección 3 tiene una variante sin licencia, que es la que declaras como simulación en tu evidencia.**

## 📖 Conceptos Clave

Cloud flow orquesta eventos, conectores, aprobaciones, programación y almacenamiento; desktop flow ejecuta acciones de interfaz local. El contrato entre ambos debe incluir parámetros, outputs, errores y estado, no solo "ejecutar bot".

- **La acción que los une:** en el cloud flow, el conector **Power Automate for desktop** ofrece la acción **Run a flow built with Power Automate for desktop**. Eliges el **Desktop flow**, el **Run mode** (atendido o desatendido) y la máquina o el machine group; si no tienes una conexión de desktop flows, la acción te pide crearla. Las variables de entrada del desktop flow aparecen como campos de esa acción ([Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)).
- **Inputs y outputs en PAD:** se crean con el botón **+** del panel de variables (**Input** u **Output**). Los campos obligatorios de una variable de entrada son **Variable name**, **Data type** y **External name**; el **External name** es el nombre que se ve en el diseñador del cloud flow. También existen **Default value** (el valor que se usa al ejecutar desde el diseñador o la consola), **Description**, **Mark as sensitive** y **Mark as optional**. Los tipos admitidos son texto, número, booleano, objeto personalizado, lista, tabla de datos, *instance* y *session* ([Manage variables](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables)). Las variables de salida son las que pasan datos del desktop flow al cloud flow.
- **Límites que debes conocer:** el tamaño de entrada de un desktop flow es de 2 MB; hay un máximo de 70 ejecuciones de desktop flow por minuto por conexión ([Trigger desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)). Una ejecución puede estar en cola hasta 12 horas; un machine group admite hasta 500 desktop flows en cola ([Manage machine groups](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machine-groups)).
- **Máquina, máquina ocupada y grupo:** cada unattended bot de una máquina ejecuta un desktop flow a la vez; para ejecutar varios a la vez en la misma máquina hacen falta tantos bots como ejecuciones ([Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)). En un machine group, cuando una máquina está disponible Power Automate le asigna el siguiente desktop flow. Si no queda ninguna máquina elegible, la ejecución falla; si hay máquinas elegibles que están sin conexión, la ejecución espera a que vuelvan antes de marcarse como fallida ([Monitor desktop flow queues](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-desktop-flow-queues)). Una ejecución desatendida exige una máquina con todos los usuarios con la sesión cerrada: una sesión de Windows bloqueada impide que corra.
- **Dónde se ve qué pasó:** **Monitor > Desktop flow runs** lista las ejecuciones (columnas **Requested**, **Desktop flow**, **Status**, **Run mode**, **Duration** y **Parent flow**) y **Monitor > Machines** muestra por máquina cuántos flujos corren y cuántos están en cola ([Monitor desktop flow runs](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-desktop-flow-runs)).
- **Estado fuera de la VM y manejo del fallo en el cloud flow:** el estado de cada solicitud vive en Dataverse o SharePoint, no en la máquina. En el cloud flow, un paso posterior solo se ejecuta si el anterior tuvo éxito; para actuar ante un fallo configuras **Run after** (la acción puede ejecutarse cuando la anterior *is successful*, *has failed*, *is skipped* o *has timed out*) y agrupas pasos con **Scope** para armar un patrón Try/Catch ([Employ robust error handling](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling), [Use scopes](https://learn.microsoft.com/en-us/power-automate/scopes)).
- **Secretos:** Learn recomienda no pasar valores sensibles como input variables y usar la acción **Get credential** dentro del desktop flow, que los marca como sensibles y evita que se guarden en los logs de ejecución ([Secure your data](https://learn.microsoft.com/en-us/power-automate/guidance/desktop-flow-coding-guidelines/secure-your-data)). En el cloud flow, **Secure Inputs** y **Secure Outputs** en la configuración de la acción ocultan los valores del historial.

## 👨‍💻 Actividades Prácticas Paso a Paso

## 🧩 Microlección 1 — El contrato: inputs, outputs y qué nunca viaja

**¿Qué vas a aprender?** A escribir el contrato entre las dos capas antes de construir nada, para que el cloud flow pueda decidir y soporte pueda diagnosticar sin abrir la máquina.

**¿Por qué existe esto?** Cuando el contrato es "ejecuta el bot y ya", un fallo se convierte en un misterio: no se sabe qué solicitud, en qué estado ni si es seguro reintentar. Un contrato de cinco líneas lo evita.

**Ahora haz algo — micropráctica (7 min):** decide qué viaja de ida, qué vuelve y qué no debe viajar como parámetro → **[Diseñar el contrato entre cloud flow y desktop flow](/practica/ip-rpa-025-contrato-entre-cloud-flow-y-desktop-flow)**.

**Práctica en papel (25 min):**

1. Abre un documento nuevo y escribe el proceso en una frase: «El cloud flow toma las solicitudes `Pendiente` de una tabla y, por cada una, el desktop flow la registra en SIT Registro Legacy».
2. Completa esta tabla con **tus** decisiones (los nombres son sugerencias; puedes cambiarlos si los justificas):

   | Dirección | Nombre | Tipo | Para qué sirve | ¿Sensitive? |
   |---|---|---|---|---|
   | Entrada | `requestId` | Texto | Clave de negocio: base de la idempotencia del Módulo 74 | No |
   | Entrada | `correlationId` | Texto | Un valor por ejecución del cloud flow, para seguir el caso en ambas capas | No |
   | Entrada | `modo` | Texto | `registrar` o `consultar` | No |
   | Salida | `estado` | Texto | `Completado`, `ErrorNegocio` o `ErrorTecnico` | No |
   | Salida | `mensaje` | Texto | Motivo en una frase, sin datos personales | No |
   | Salida | `evidenciaRef` | Texto | Ruta o identificador del log de la ejecución | No |

3. Añade dos filas más que **tú** consideres necesarias (por ejemplo, `intentos` como número, o `clienteId` si el desktop flow lo necesita) y escribe, para cada fila nueva, qué decisión del cloud flow habilita.
4. Escribe en una frase por qué la contraseña de la cuenta de servicio **no** aparece en la tabla y cómo la obtiene el desktop flow (solo nombras la acción **Get credential**: crear una credencial exige Azure Key Vault o CyberArk, así que no la creas en este módulo).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu tabla de contrato final (con las dos filas que añadiste) | ___ |
| Qué decisión del cloud flow habilita cada salida | ___ |
| Por qué la contraseña no viaja y qué acción la entrega | ___ |
| Qué ocurriría con un lote de 5.000 filas enviado en un único input (cita el límite de Learn) | ___ |

---

## 🧩 Microlección 2 — El lado desktop: variables de entrada y salida con el disparador simulado

**¿Qué vas a aprender?** A construir en PAD un desktop flow que cumpla el contrato: recibe `requestId`, `correlationId` y `modo`, consulta o registra en SIT Registro Legacy y devuelve `estado`, `mensaje` y `evidenciaRef`. Lo pruebas **sin licencia**, dando valores por defecto en lugar de un cloud flow.

**¿Por qué existe esto?** Si el desktop flow no cumple el contrato, el cloud flow más perfecto del mundo no puede orquestarlo. Aquí detectas, con tus propios ojos, qué devuelve realmente en cada situación.

**Práctica en PAD (60 min):**

1. Abre SIT Registro Legacy en Edge, pulsa **Reset** y deja el modo **Normal**. Necesitas los UI elements que capturaste en el Módulo 74: los campos **Solicitud**, **Cliente** y **Producto**, los botones **Registrar** y **Consultar por ID**, el mensaje de estado y el botón **Cerrar** del diálogo **Registro confirmado**. Son de otro flujo: copia desde `M74 Idempotencia` las acciones web que los usan y pégalas en `M75 Registrar solicitud` (los UI elements viajan con ellas). Si no los tienes, captúralos primero (Módulo 73).
2. Crea un desktop flow `M75 Registrar solicitud`. En el panel de variables pulsa **+** y elige **Input**. Crea tres, con **Variable name**, **Data type** (texto) y **External name** iguales al nombre de tu contrato (`requestId`, `correlationId`, `modo`). Dales un **Default value** para probar: `SOL-2026-0051`, `CORR-0001` y `registrar`.
3. Con **+** > **Output**, crea tres variables de salida de tipo texto con **External name** `estado`, `mensaje` y `evidenciaRef`. Asigna a `%estado%` el valor inicial `ErrorTecnico` y a `%mensaje%` el valor `No se ejecutó`: si el flujo se interrumpe antes de terminar, el cloud flow recibirá un resultado seguro, no vacío.
4. En **Main**, agrega **Launch new Microsoft Edge** con **Launch mode** = **Attach to running instance** y la pestaña por URL `rpa-sandbox/legacy-app` (como en el Módulo 74).
5. **Consultar antes de actuar:** **Populate text field on web page** (**Solicitud** = `%requestId%`) → **Press button on web page** (**Consultar por ID**) → **Get details of element on web page** sobre el mensaje de estado, **Own Text**, en `%Respuesta%`. Si `%Respuesta%` es igual a `Registrado`: `%estado%` = `Completado`, `%mensaje%` = `Ya estaba registrada (reconciliada)` y termina.
6. **Registrar:** si no, llena **Cliente** (`CLI-0005`) y **Producto** (`PROD-003`) → **Press button on web page** (**Registrar**) → espera con el loop acotado del Módulo 73 el diálogo **Registro confirmado** → **Cerrar**. Vuelve a consultar por ID y, solo si dice `Registrado`: `%estado%` = `Completado` y `%mensaje%` = `Registrada`.
7. **Error de negocio:** cambia el sandbox a **Bloqueo simulado** y repite con `SOL-2026-0052`. La app responde con un mensaje de bloqueo y no inserta nada; el diálogo **Registro confirmado** no aparece, así que tu espera del paso 6 se agotaría. Además, en modo **Normal** la app no escribe ningún mensaje de estado tras **Registrar** (el elemento solo existe cuando hay un mensaje), así que **no** intentes leer su texto: eso fallaría y marcaría `ErrorTecnico` aunque la solicitud sí se registró. Por eso, justo después de pulsar **Registrar** y antes de esa espera, usa **If web page contains** con **Contains text** = `bloqueado`; si es verdadero, asigna `%estado%` = `ErrorNegocio` y `%mensaje%` = `Registro bloqueado por la aplicación`, **sin** reintentar.
8. **Error técnico:** con el sandbox en **Normal**, cierra la pestaña del sandbox antes de ejecutar. Envuelve toda la parte web, incluido **Launch new Microsoft Edge** (es la primera acción que falla si no hay pestaña), en un **On block error** con **Name** = `Interactuar con la app` y, en su manejo, **Set variable** `%estado%` = `ErrorTecnico` y `%mensaje%` = `No se pudo operar la aplicación`, y que el flujo continúe al final del bloque (como en el Módulo 74).
9. **Evidencia de salida:** al final de **Main** (por todos los caminos), llama al subflow `Log`: cópialo desde `M74 Idempotencia` (la carpeta `C:\RPA-Curso\M74` ya existe) y, como su línea usa `%RunId%`, asigna al inicio de **Main** `%RunId%` = `%correlationId%`. Antes de llamarlo asigna `%LogClave%` = `%requestId%`, `%LogEvento%` = `%estado%` y `%LogDetalle%` = `%correlationId% - %mensaje%`, y asigna `%evidenciaRef%` = `C:\RPA-Curso\M74\log.csv`. Ejecuta con **Run** (los valores por defecto se usan al correr desde el diseñador) y, después de cada corrida, mira los valores de las tres variables de salida en el panel de variables.
10. Repite las cuatro situaciones cambiando entre corridas el **Default value** de `requestId`: `SOL-2026-0051` (nueva), `SOL-2026-0004` (ya registrada), `SOL-2026-0052` con el sandbox en **Bloqueo simulado** (bloqueo) y `SOL-2026-0053` con la pestaña cerrada (error técnico). Con la pestaña cerrada, **Launch new Microsoft Edge** en modo adjuntar puede tardar hasta un minuto en fallar: espera antes de pensar que se colgó. Pulsa **Reset** en el sandbox al empezar las corridas nuevas.

**Evidencia a reportar:**

| Situación | `estado` | `mensaje` | Línea nueva en el log |
|---|---|---|---|
| Solicitud nueva (`SOL-2026-0051`) | ___ | ___ | ___ |
| Ya registrada (`SOL-2026-0004`) | ___ | ___ | ___ |
| **Bloqueo simulado** (`SOL-2026-0052`) | ___ | ___ | ___ |
| Pestaña cerrada (error técnico) | ___ | ___ | ___ |

Y una línea con **qué valor devolvería el desktop flow si lo interrumpes a mitad y por qué lo inicializaste así en el paso 3**.

Opcional: tras las cuatro corridas, abre **Registro de actividad (para tu evidencia)** al final del sandbox y copia su texto. Ninguna solicitud debería tener más de un intento de **Registrar**.

> **Reset del ejercicio:** pulsa **Reset** en el sandbox entre corridas que registren datos: los registros viven en la memoria de la página.

---

## 🧩 Microlección 3 — El lado cloud: estado, notificación y el fallo de la máquina

**¿Qué vas a aprender?** A diseñar el cloud flow que toma el trabajo, llama al desktop flow y cierra el estado de la solicitud **en todos los caminos**: éxito, error de negocio y error de máquina.

**¿Por qué existe esto?** El 90 % de los problemas de integración no están en el bot: están en lo que el cloud flow hace (o no hace) cuando el desktop flow no responde.

**Elige tu variante antes de empezar:**

- **Variante A, con licencia** (plan premium con RPA atendido, o trial, y la máquina registrada en tu ambiente): construyes el cloud flow de verdad.
- **Variante B, sin licencia (la que hará la mayoría):** diseñas el cloud flow en papel y completas una tabla de configuración. Es una **simulación**: así debes declararla en tu evidencia. En el tenant no hay nada que ejecutar, pero el diseño debe ser tan preciso que otra persona pueda construirlo sin preguntarte nada.

**Práctica (60 min):**

1. **Estados.** Define en tu tabla (Dataverse o lista de SharePoint) la columna de estado con los valores `Pendiente`, `EnEjecucion`, `Completado`, `ErrorNegocio` y `ErrorTecnico`, y las columnas `correlationId`, `mensaje` y `evidenciaRef`. En la variante A, créala; en la B, descríbela.
2. **Disparo.** Un trigger manual o programado y una acción que lee las filas `Pendiente` (en Dataverse, **List rows** con un filtro por estado).
3. **Marcar antes de llamar.** Por cada fila: actualiza el estado a `EnEjecucion` y guarda un `correlationId` nuevo.
4. **La llamada.** Agrega **Run a flow built with Power Automate for desktop** con **Run mode**, el **Desktop flow** `M75 Registrar solicitud` y la máquina o el machine group. Rellena los campos de entrada con `requestId` y `correlationId` de la fila y `modo` = `registrar`. Si no hay una conexión de desktop flows, la acción te pide crearla.
5. **Camino de éxito.** Después de la llamada, usa los outputs para actualizar la fila: `estado` = salida `estado`, `mensaje` y `evidenciaRef` con las salidas correspondientes. Si el estado es `Completado`, no notifiques; si es `ErrorNegocio`, notifica al responsable del negocio con el mensaje; si es `ErrorTecnico` (el desktop flow terminó pero informa un fallo técnico), notifica a operaciones con el mensaje y deja la fila lista para revisión.
6. **Camino de fallo (el que casi todos olvidan).** Agrupa la llamada en un **Scope** `Intentar` y agrega otro `Capturar` con **Configure run after** marcando solo **has failed**, **is skipped** y **has timed out** del scope anterior. En `Capturar`: actualiza la fila a `ErrorTecnico` con el mensaje `Falló la ejecución del desktop flow o no hay máquina disponible` y notifica a operaciones.
7. **Secretos.** En la configuración de las acciones que reciban o devuelvan datos sensibles, activa **Secure Inputs** y **Secure Outputs**.
8. **Prueba de la máquina caída.** Ojo con lo que dice Learn: si no queda ninguna máquina elegible, la ejecución falla; pero si hay máquinas elegibles que están sin conexión, la ejecución **espera** a que vuelvan (hasta 12 horas en cola) antes de marcarse como fallida. Es decir, una máquina apagada puede no fallar al instante. En la variante A, apaga el runtime o la máquina antes de ejecutar y anota qué pasó y cuánto tardó. En la B, escribe qué verías en **Monitor > Desktop flow runs** y **Monitor > Machines** (Learn no lista los valores de **Status**, así que descríbelo con tus palabras y márcalo como suposición) y qué haría tu rama `Capturar`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Variante elegida (A o B) y, si es B, la frase «simulación sin licencia» | ___ |
| Tabla de configuración de la acción **Run a flow built with Power Automate for desktop** (campo → valor) | ___ |
| Configuración de `Capturar`: casillas de **Configure run after** marcadas | ___ |
| Estado final de la fila en cada camino (éxito, `ErrorNegocio`, máquina caída) | ___ |
| Qué verías en **Monitor > Desktop flow runs** con la máquina caída | ___ |

---

### 🔎 Diagnosticar síntoma primero — 40 solicitudes que «siguen en proceso»

Un equipo copió tu diseño pero **omitió** el camino de fallo. Anoche la máquina estaba apagada, el cloud flow terminó en error y esta mañana hay 40 solicitudes en `EnEjecucion`. Operaciones cree que el bot las está procesando.

1. **Micropráctica (8 min):** **[Diagnosticar: solicitudes atascadas en EnEjecucion](/practica/ip-rpa-026-diagnosticar-estado-atascado-en-ejecucion)**. Escribe tu hipótesis antes de abrir las pistas.
2. **Después de resolverla:** compara con tu Microlección 3. ¿Tu diseño habría caído en el mismo punto?

| Campo | Tu valor |
|---|---|
| Qué hace un cloud flow con los pasos posteriores cuando una acción falla | ___ |
| Qué camino faltaba y qué debe hacer | ___ |
| Qué diferencia hay entre una ejecución que espera a una máquina sin conexión y una que falla porque no hay máquina elegible | ___ |

---

### 🏗️ Construir sin pasos — el lote nocturno (40 min)

> **Requisito:** diseña la solución de un lote nocturno de solicitudes con **distribución por machine group**, sin que nadie te dicte los pasos. Debe poder operarla alguien que no la construyó.
> - Llegan 300 solicitudes entre las 22:00 y las 23:00 y deben quedar registradas antes de las 6:00.
> - Hay un machine group con dos máquinas y un unattended bot por máquina (o, si no tienes licencia, trabaja como si lo tuvieras y márcalo como simulación).
> - Una máquina puede estar caída al empezar el lote.
> - Soporte debe poder ver, sin abrir ninguna VM, qué solicitudes terminaron, cuáles fallaron y por qué.

Entregables: un diagrama (Mermaid o a mano) con las dos capas, la tabla de contrato actualizada, la tabla de estados con sus transiciones y un párrafo de «qué pasa si una máquina cae a mitad del lote».

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Contrato claro | Inputs, outputs y el dato que nunca viaja (credencial) están definidos y justificados |
| Estado fuera de la VM | Cada solicitud tiene un estado en Dataverse o SharePoint y una transición definida para cada camino |
| Error de máquina vs. error de negocio | El diseño los separa y solo reintenta lo técnico, nunca un registro bloqueado |
| Capacidad y límites | Citas al menos un límite de Learn (ejecuciones simultáneas por bot, cola o ejecuciones por minuto) y explicas cómo lo respetas |
| Operabilidad | Soporte puede responder «¿qué pasó con la solicitud X?» solo con la tabla y el run history |

---

## 🔁 Reto de transferencia — De una solicitud a dos mil

Cambia la escala: ya no son 300 sino unas 2.000 solicitudes por noche, repartidas entre las dos máquinas del grupo. Lo que aprendiste con una solicitud sigue valiendo, pero ahora importan los límites de la plataforma y el reintento por tandas.

1. **Micropráctica (9 min):** **[Transferir: de una solicitud a un lote nocturno](/practica/ip-rpa-027-transferir-del-registro-al-lote-nocturno)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **Por escrito (25 min):** supón **45 segundos por solicitud** (lo que más o menos mediste en la Microlección 2) y una ventana de **22:00 a 06:00 (8 horas)** con dos bots. Calcula si caben (2.000 × 45 s ÷ 2 bots ≈ 12,5 h) y reescribe la sección «capacidad y límites» de tu diseño: qué decides (más bots o máquinas, que cada ejecución procese una tanda de varias solicitudes, reducir el tiempo por solicitud o ampliar la ventana), cuántas tandas, de qué tamaño y cómo sabes cuáles faltan después de una caída.

| Campo | Tu valor |
|---|---|
| Tu cálculo de la ventana (con los 45 s), tu decisión y el tamaño de tus tandas, y qué límites de Learn respetan | ___ |
| Cómo te aseguras de que una solicitud que cae en otra máquina no se registre dos veces | ___ |
| Qué cambiarías si cada máquina tuviera un segundo unattended bot | ___ |

## 💼 Casos Reales de Negocio

Operaciones programa un lote nocturno. Cloud flow distribuye trabajo por máquina, PAD registra en portal sin API y Dataverse conserva estado por solicitud. El soporte consulta qué falló sin abrir la VM.

## ✅ Buenas Prácticas

- Define contrato de inputs/outputs.
- Usa colas o estados para distribución.
- No hagas que el desktop flow decida todo el proceso.
- Maneja errores de máquina y errores de negocio por separado.
- Protege conexiones y credenciales.
- Inicializa las variables de salida con un valor seguro (`ErrorTecnico`), para que una interrupción devuelva un resultado explícito y no uno vacío.
- Usa **Get credential** dentro del desktop flow y marca las variables sensibles; no pases contraseñas como input variables.
- Cierra el estado en **todos** los caminos del cloud flow con **Configure run after** (o un patrón Try/Catch con **Scope**).
- Respeta los límites documentados: 2 MB de entrada, 70 ejecuciones por minuto por conexión, 500 en la cola de un grupo.

## ⚠️ Errores Comunes

- Ejecutar desktop flow sin estado persistente.
- No capturar salida estructurada.
- Mezclar credenciales en variables.
- Ignorar capacidad de máquina o grupo.
- No notificar fallos operativos.
- Dejar un cloud flow sin camino de fallo: los pasos posteriores a una acción con error no se ejecutan y el estado queda en `EnEjecucion`.
- Esperar que una máquina con un solo unattended bot ejecute varias solicitudes a la vez.
- Dar por hecho que un cloud flow puede disparar un desktop flow desde una cuenta sin licencia: sin plan premium con RPA atendido (o Process para desatendido) la acción no está disponible.

## 🧪 Criterios de Validación

- [ ] Diseño cloud + desktop con contrato claro.
- [ ] Uso inputs y outputs.
- [ ] Registro estado por trabajo.
- [ ] Manejo error cruzado.
- [ ] Distingo cola, lote y ejecución programada.
- [ ] Escribí el contrato (inputs, outputs y dato que no viaja) antes de construir.
- [ ] Construí el desktop flow con variables de entrada y salida y comprobé sus valores en las cuatro situaciones.
- [ ] Diseñé (o construí) el cloud flow con un camino de fallo que cierra el estado, y declaré si fue simulación.
- [ ] Diagnostiqué el estado atascado antes de ver la solución.
- [ ] Diseñé sin pasos el lote nocturno con machine group y lo contrasté con la rúbrica.
- [ ] En el reto de transferencia escalé el diseño a 2.000 solicitudes respetando los límites de Learn.

## Evidencia

Diagrama, cloud flow, desktop flow, tabla/lista de estado, run history y evidencia de error controlado. Lab recomendado: LAB-110. Challenge relacionado: CH-RPA-03.

Guarda también las tablas de evidencia de las tres microlecciones, del diagnóstico y del reto de transferencia, y la captura de los valores de las variables de salida en las cuatro situaciones de la Microlección 2. Si hiciste la variante B de la Microlección 3, escribe «simulación sin licencia» en tu entrega.

## Preguntas de verificación

1. ¿Qué debe devolver un desktop flow al cloud flow?
2. ¿Por qué necesitas estado fuera de la VM?
3. ¿Qué revisarías si la máquina no está disponible?

## Conexión con siguiente módulo

La solución debe moverse entre ambientes, operarse, gobernarse y mantenerse.

## Limitaciones y seguridad

Las capacidades attended/unattended dependen de licencia, permisos y tenant. Declara variante simulada cuando aplique.

No pases contraseñas, tokens ni datos personales como input variables ni los escribas en el log o en las salidas; usa **Get credential**, variables marcadas como sensibles y **Secure Inputs/Outputs**. Learn aclara que las variables sensibles no sustituyen la protección de datos escritos a mano en el flujo: no escribas secretos en texto plano en las acciones.

Antes de usar tu conexión de desktop flows en un flow compartido, confía en los co-owners: Learn advierte que ellos podrían usarla.

## Referencias oficiales

- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)
- [Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)
- [Manage machine groups](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machine-groups)
- [Monitor desktop flow queues](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-desktop-flow-queues)
- [Monitor desktop flow runs](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-desktop-flow-runs)
- [Manage variables in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-variables)
- [Run unattended desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)
- [Prerequisites and limitations](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)
- [Secure your data (desktop flow coding guidelines)](https://learn.microsoft.com/en-us/power-automate/guidance/desktop-flow-coding-guidelines/secure-your-data)
- [Employ robust error handling](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling)
- [Use scopes to organize actions in cloud flows](https://learn.microsoft.com/en-us/power-automate/scopes)
