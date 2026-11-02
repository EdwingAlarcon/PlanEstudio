---
moduleId: 43
title: "Copilot en Power Platform"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 25
practiceMinutes: 200
slug: "copilot-en-power-platform"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Usar las capacidades de Copilot integradas en Power Apps (Canvas, Model-Driven y páginas generativas), Power Automate, Dataverse y Power Pages para acelerar la construcción de soluciones, **revisando cada salida generada como un borrador con errores posibles**: detectar el fallo, corregirlo y dejar evidencia de qué verificaste y contra qué fuente. También entender qué controla el administrador en materia de datos, regiones y funciones en preview.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y luego una práctica real, con una tabla de evidencia donde anotas el dato exacto que viste (no un "sí, funcionó"). El centro del módulo es una **actividad de fallo y corrección**: recibes salidas generadas por IA con errores plausibles (una fórmula Power Fx que no delega, un flujo sin manejo de errores), los encuentras, los corriges y anotas la fuente con la que lo comprobaste. Al final de la Microlección 3 vas a **diagnosticar** un síntoma antes de ver la causa, y el módulo cierra con un **reto de transferencia** donde decides y defiendes una política de uso de Copilot para un caso nuevo.
>
> **Antes de empezar (lee esto, ahorra media hora):**
> - **Este módulo es transversal:** no exige ningún módulo de los niveles de certificación. Donde un ejercicio usa Power Fx o flujos te doy una variante mínima; si ya hiciste los Módulos 2 a 7, usa tu tabla **Solicitud TI** (en Power Fx, `'Solicitudes TI'`) y te ahorras la Microlección 1.
> - **Tiempo:** la primera vez, cuenta unas 3 horas y media de práctica (más 25 minutos de lectura). Mejor en dos sesiones: Microlecciones 1 a 3 en la primera; de la 4 al reto en la segunda.
> - **Cuenta y entorno:** una cuenta de trabajo o estudio y un entorno **con Dataverse** donde tengas al menos el rol **System Customizer** (Learn lo pide para crear apps con Copilot). Desde noviembre de 2026 cambió cómo se consigue un entorno de práctica: ver [Entornos y trials](/recursos/entornos-y-trials). Si no tienes permisos en el entorno donde estás, Learn indica que Power Apps te pide crear la app en tu propio entorno y, si no tienes un entorno de desarrollador, crea uno automáticamente ([Learn: crear apps con Copilot](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-conversations-create-app)).
> - **Idioma:** el ambiente del curso está en **English (United States)**, y conviene: Learn indica que Copilot en Power Automate está optimizado para inglés, que **Create a formula** de la barra de fórmulas solo existe en inglés (en-US) y que las páginas generativas en el navegador solo admiten prompts en inglés de EE. UU. Escribe los prompts de este módulo **en inglés** cuando la herramienta lo exija (te doy ambas versiones).
> - **Región:** Copilot puede no estar disponible en todas las regiones y, según dónde esté tu entorno, el administrador puede tener que permitir el movimiento de datos entre regiones ([Learn: Copilot en Power Apps](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-overview), [Learn: movimiento de datos entre regiones](https://learn.microsoft.com/power-platform/admin/geographical-availability-copilot)). Si una opción de Copilot no aparece, anótalo como dato (región del entorno y qué no aparece) y sigue con la parte de revisión, que no depende del tenant.

---

## 🧩 Microlección 1 — Qué Copilot asiste a quién, y una primera app generada

**¿Qué vas a aprender?** A ubicar cada Copilot de Power Platform según a quién ayuda y qué genera, y a revisar el modelo de datos que propone antes de aceptarlo.

**¿Por qué existe esto?** "Copilot" es el nombre de muchas funciones distintas. Confundirlas lleva a pedirle a una algo que solo hace otra, o a gobernar mal los datos. La distinción que más importa es **a quién asiste**:

| Función (nombre vigente) | A quién ayuda | Qué genera | Estado según Learn |
|---|---|---|---|
| **Build apps through conversation** (Power Apps) | Al maker | Tablas de Dataverse y una app Canvas a partir de una descripción | Requiere Dataverse; puede requerir movimiento de datos entre regiones |
| **Copilot en la barra de fórmulas** (Power Apps Studio) | Al maker | **Explain this formula**; fórmulas desde un comentario `//`; **Create a formula** | **Create a formula** está en **preview** y solo en inglés |
| **Copilot en cloud flows** (Power Automate) | Al maker | Un flujo (trigger y acciones) desde una descripción; edita y explica el flujo | Solo en el diseñador nuevo; optimizado para inglés |
| **Describe a new table** / **Excel to table** (Dataverse) | Al maker | Tablas a partir de una descripción o de un archivo | Dependen del movimiento de datos entre regiones |
| **Generative pages** (Model-Driven) | Al maker | Una página completa en React, vinculada a tablas | Navegador: solo EE. UU., Reino Unido, Australia y Singapur; conectores y Custom APIs en preview |
| **Copilot for site creation** (Power Pages) | Al maker | Un sitio con su página de inicio y más páginas | GA en todas las regiones salvo DOD; requiere el *enhanced data model* |
| **Copilot chat** en Model-Driven Apps | Al **usuario final** de la app | Respuestas sobre los datos de la app | Se gobierna aparte (ver Microlección 5) |
| **Copilot Studio** | Al **usuario final** (a través de un agente) | Agentes conversacionales con conocimiento y herramientas | Otro producto: Módulo 15 |

Fuentes: [Learn: Copilot en Power Apps](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-overview), [Learn: Copilot en la barra de fórmulas](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-formulas-formulabar), [Learn: crear un flujo con Copilot](https://learn.microsoft.com/power-automate/create-cloud-flow-using-copilot), [Learn: páginas generativas](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-pages), [Learn: Copilot para crear sitios](https://learn.microsoft.com/power-pages/getting-started/create-site-copilot), [Learn: funciones que dependen del movimiento de datos](https://learn.microsoft.com/power-platform/admin/geographical-availability-copilot).

Una regla que vale para todas: **lo generado es un borrador**. Learn lo repite en cada función ("AI-generated content can be inaccurate, so check it for accuracy"; en las páginas generativas, "you're ultimately responsible for validating the code"). Revisar no es leer por encima: es comprobar cada decisión contra una fuente (la documentación, el comportamiento real en el tenant o una prueba).

**Ejemplo pequeño:** pides "una app para seguir solicitudes de mantenimiento con estado Nueva/En proceso/Cerrada". Si Copilot crea **Estado** como columna de texto, tu app acepta "cerrada", "Cerrada" y "Cerado" como valores distintos. Lo correcto es una columna **Choice**: lo detectas en la revisión, no en producción.

**Ahora haz algo — micropráctica (5 min):** revisa una fórmula generada y elige cuáles de sus "problemas" son reales → **[Revisar una fórmula generada por Copilot](/practica/ip-ia-004-revisar-formula-generada)**. (La retomarás en la Microlección 2; hazla ahora para calibrar qué tan rápido detectas los fallos.)

**Práctica real en tu entorno (30 min):** *(si ya tienes la tabla **Solicitud TI** de los Módulos 2 a 7, haz solo los pasos 1 a 5 como comparación y no guardes nada)*

1. Entra a [make.powerapps.com](https://make.powerapps.com) y comprueba en el selector de entorno (arriba a la derecha) que estás en el entorno del curso.
2. En la página de inicio selecciona **Start with data** y luego **Create new data**. Se abre el espacio **Create new tables** con una tabla en blanco y el panel de Copilot a la derecha.
3. En el cuadro del panel de Copilot escribe este prompt y selecciona **Submit** (o pulsa Enter):
   ```
   Create a table to track maintenance requests for company assets, with a title, a status
   (New, In progress, Closed), a priority (Low, Medium, High), a required date and an
   assigned user.
   ```
   *(En español: "Crea una tabla para seguir solicitudes de mantenimiento de activos, con título, estado (Nueva, En proceso, Cerrada), prioridad (Baja, Media, Alta), fecha requerida y usuario asignado".)*
4. **Revisa antes de aceptar.** Para cada columna que propuso, anota el tipo de dato. Lo que esperas: **Status** y **Priority** como **Choice** con exactamente esas opciones; la fecha como fecha (no texto); el usuario asignado como **Lookup** a la tabla **User** (no texto libre). Si algo no calza, pídeselo a Copilot en el mismo panel, por ejemplo: `Change Status to a choice column with the options New, In progress and Closed`.
5. Con **View data** mira las filas de ejemplo que generó: ¿son coherentes con el tipo de dato (por ejemplo, fechas reales en la columna de fecha)?
6. Selecciona **Save and open app**. Learn indica que crea las tablas y relaciones y abre la app para editarla. Espera a que se abra Power Apps Studio con una app Canvas.
7. En Power Apps Studio, abre la app en vista previa (**Play**, o F5) y crea una solicitud de prueba. Cierra la vista previa.

**Si no lo ves:** si no aparece **Start with data**, o el panel de Copilot no responde, anota la región de tu entorno (en [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) > **Manage** > **Environments** > tu entorno, campo de región): puede faltar el movimiento de datos entre regiones (Microlección 5). Si aparece un aviso de permisos, es el rol: pide **System Customizer** o usa el entorno de desarrollador que te propone.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Entorno y región donde trabajaste | ___ |
| Columnas que propuso Copilot y el tipo de cada una (antes de corregir) | ___ |
| Qué columna tuviste que corregir y el prompt exacto que usaste (o "ninguna", con la razón) | ___ |
| Nombre de la tabla creada y nombre de la app | ___ |

---

## 🧩 Microlección 2 — Fallo y corrección: una fórmula Power Fx que no delega

**¿Qué vas a aprender?** A revisar una fórmula generada por IA contra dos fuentes que no se equivocan: la tabla de delegación de Dataverse en Learn y el propio Power Apps Studio.

**¿Por qué existe esto?** Copilot escribe fórmulas que **funcionan con pocos datos** y fallan en silencio con muchos. La causa típica es la **delegación**: si una función no se puede enviar a Dataverse, Power Apps trae solo las primeras filas (500 por defecto, configurable en **Data row limit**) y filtra en el dispositivo, así que con 3.000 registros "pierdes" los demás sin ningún error. Learn publica qué funciones delega Dataverse para cada tipo de dato ([Learn: delegación con Dataverse](https://learn.microsoft.com/power-apps/maker/canvas-apps/connections/connection-common-data-service)). Tres datos de esa tabla que vas a usar:
- **`StartsWith`** sobre texto **sí** se delega; **`Len`** y **`Trim`** aplicados a una columna **no** (nota 2 de la tabla).
- Una columna **Choice** se compara con `=` y `<>` contra su **enumeración**, no contra un texto: `Prioridad = 'Prioridad (Solicitudes TI)'.Alta`.
- `IsBlank` no se delega sobre Choice, y los operadores `<`, `>` tampoco.

Y tres límites del propio Copilot de la barra de fórmulas, según Learn: trabaja sobre **un control y una propiedad**, **no tiene en cuenta la fórmula que ya había** y no reconoce funciones definidas por el usuario ([Learn](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-formulas-formulabar)).

**Ejemplo pequeño:**
```js
// Generada por IA: no delega (Trim sobre la columna) → con más de 500 filas, resultados incompletos
Filter('Solicitudes TI', StartsWith(Trim('Título de Solicitud'), txtBusqueda.Text))
// Corregida: StartsWith sobre la columna tal cual; Trim solo sobre lo que escribe el usuario
Filter('Solicitudes TI', StartsWith('Título de Solicitud', Trim(txtBusqueda.Text)))
```

**Actividad de fallo y corrección (20 min, sin tenant):** un compañero le pidió a Copilot "mostrar las solicitudes de prioridad Alta cuyo título empiece por lo que el usuario escribe en el buscador, sin importar espacios" y pegó esto en la propiedad **Items** de la galería:

```js
// Salida generada por IA (con errores; no la copies a tu app así)
Filter(
    'Solicitudes TI',
    Prioridad = "Alta" &&
    StartsWith(Trim('Título de Solicitud'), Trim(txtBusqueda.Text)) &&
    Len('Título de Solicitud') > 0
)
```

1. Sin mirar la solución, marca cada condición como **correcta**, **error** o **no delega**, y escribe por qué.
2. Para cada error, anota la **fuente** que lo confirma: la fila o nota concreta de la tabla de delegación de Learn, o lo que muestra Power Apps Studio (si tienes la app).
3. Escribe la fórmula corregida.

**Solución para comparar (léela solo después de escribir la tuya):**

```js
// Corregida (las columnas con los nombres del Módulo 2; usa los tuyos)
Filter(
    'Solicitudes TI',
    Prioridad = 'Prioridad (Solicitudes TI)'.Alta &&          // Choice: se compara con su enumeración, no con "Alta"
    StartsWith('Título de Solicitud', Trim(txtBusqueda.Text))  // StartsWith delega; Trim solo sobre el texto del usuario
)
// La condición Len(...) > 0 sobra: un título que empieza por el texto buscado ya no está vacío,
// y Len sobre una columna no delega (nota 2 de la tabla de Learn).
```

**Práctica real en tu entorno (20 min, opcional si no tienes app):** en la app de la Microlección 1 (o en tu app Canvas del Módulo 3), agrega una **Text input** llamada `txtBusqueda` y una **Vertical gallery** conectada a tu tabla.
1. Pega en **Items** la salida generada de arriba, adaptando los nombres a tu tabla (si tu tabla se llama distinto, cambia `'Solicitudes TI'`, la columna de título y la de prioridad; si tus opciones están en inglés, usa `High`). Anota qué marca Power Apps Studio. Si al principio solo marca el error de tipos de la comparación con texto, corrige solo esa parte y vuelve a mirar: entonces aparece la advertencia de delegación del `Trim` y del `Len`.
2. Prueba **Explain this formula**: selecciona la galería, propiedad **Items**, y en la barra de fórmulas abre el menú desplegable junto a **fx** > **Explain this formula** ([Learn](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-formulas-formulabar)). ¿La explicación menciona el problema de delegación o lo pasa por alto? Anótalo: es la diferencia entre "explicar" y "verificar".
3. Corrige la fórmula y comprueba que desaparecen el error y la advertencia.
4. Si tu entorno está en inglés y ves **Create a formula** en ese mismo menú (preview), pídele la misma fórmula en inglés (`Show only High priority requests whose title starts with the search box text`) y revisa su salida con el mismo método.

**Si no lo ves:** si no aparece el menú de Copilot junto a **fx**, el administrador puede haber apagado las funciones en preview (Microlección 5), o la app tiene desactivado **Copilot for formulas** en **Settings** > **Updates** > **Preview**. Si `'Prioridad (Solicitudes TI)'` no existe, escribe `'Prioridad (` en la barra de fórmulas y elige la opción que te propone (es la enumeración de tu columna Choice).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Errores que encontraste en la salida generada (uno por línea) | ___ |
| Para cada error, la fuente que lo confirma (URL de Learn + nota/fila, o mensaje exacto de Power Apps Studio) | ___ |
| Tu fórmula corregida | ___ |
| ¿**Explain this formula** detectó el problema de delegación? (cita la frase) | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: un flujo generado sin manejo de errores

**¿Qué vas a aprender?** A crear un flujo con Copilot y a revisar lo que **no** generó: qué pasa cuando un dato falta o una acción falla.

**¿Por qué existe esto?** Copilot en Power Automate construye el **camino feliz**: trigger, acciones y conexiones. Learn reconoce sus límites: admite solo una parte de los conectores y "isn't equipped to help with fixing flow errors" ([Learn: FAQ de Copilot en cloud flows](https://learn.microsoft.com/power-automate/faqs-copilot)). Lo que casi nunca agrega por su cuenta es lo que hace a un flujo apto para producción:
- **Validar datos opcionales** antes de usarlos (una Lookup vacía hace fallar la acción que la usa).
- **Manejo de errores** con **Scope** y **Run after**: un Scope "Try" con las acciones y un Scope "Catch" configurado para ejecutarse si el Try falla o agota el tiempo, que registra el error y avisa ([Learn: manejo de errores](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/error-handling)). Es el patrón del Módulo 11; aquí basta con la versión mínima.
- **Terminate** con estado **Failed** cuando hay que detener el flujo dejando claro por qué.

**Ejemplo pequeño:** "Cuando se cree una solicitud, avisa por correo al usuario de **Asignado a**". Si la solicitud se crea sin asignar, la acción que busca al usuario no tiene qué buscar: el flujo falla y **nadie** se entera de la solicitud nueva.

**Práctica real en tu entorno (35 min):**

1. Entra a [make.powerautomate.com](https://make.powerautomate.com) con el entorno del curso seleccionado. En **Home**, selecciona **Create with Copilot** y, en **What will your flow do?**, escribe (en inglés, como recomienda Learn con el formato *When X happens, do Y*):
   ```
   When a row is added to the maintenance requests table in Dataverse, send an email with
   Outlook to the user in the assigned user column, with the request title and priority.
   ```
   Usa el nombre real de tu tabla (la de la Microlección 1, o **Solicitud TI**). Selecciona la flecha de enviar.
2. Copilot propone un trigger y acciones. **Antes de aceptar**, anota exactamente qué propuso. Lo esperado: el trigger de Dataverse **When a row is added, modified or deleted** con **Change type** = **Added** (en Learn ese es el nombre del trigger; "When a row is added" a secas no existe como trigger aparte), una acción que obtenga el correo del usuario asignado (por ejemplo **Get a row by ID** sobre la tabla **Users**) y **Send an email (V2)** de Office 365 Outlook. Si te convence, **Keep it and continue**; si no, agrega detalles en **Add more details for Copilot to work with**.
3. Comprueba las conexiones (marca verde = bien; signo de exclamación rojo = hay que configurarla) y selecciona **Create flow**. Se abre el diseñador con el panel de Copilot a la derecha ([Learn](https://learn.microsoft.com/power-automate/create-cloud-flow-using-copilot)).
4. En el panel de Copilot pregunta `What does my flow do?` y compara la respuesta con lo que ves en el diseñador.
5. Guarda y prueba dos casos: una solicitud **con** usuario asignado y otra **sin** él. Anota el resultado de cada ejecución en el historial de ejecuciones de la página del flujo.

**🔧 Diagnosticar antes de corregir (5 min):** el flujo de un compañero "a veces no avisa a nadie". Encuentra la causa antes de ver la solución → **[Diagnosticar: el flujo generado falla sin avisar](/practica/ip-ia-005-flujo-generado-falla-sin-avisar)**.

**Actividad de fallo y corrección (25 min):** corrige tu flujo con esta versión mínima (si ya hiciste el Módulo 11, aplica allí el patrón completo):
1. Justo después del trigger agrega una **Condition** que compruebe si la columna **Asignado a** (o *assigned user*) está vacía: en el lado izquierdo, la columna desde el contenido dinámico; operador **is equal to**; lado derecho, la expresión `null`. En la rama **True**, envía el correo a un buzón de respaldo (el tuyo, en la práctica) con el asunto `Solicitud sin asignar: ` + el título.
2. En la rama **False**, agrega un **Scope** y cámbiale el nombre a `Try`; arrastra dentro la búsqueda del usuario y el envío del correo. Debajo agrega otro **Scope** llamado `Catch`; en su **Settings** > **Run after**, deja marcados solo los estados de fallo y de tiempo agotado del Scope `Try` (desmarca el de éxito). Dentro de `Catch`, un **Send an email (V2)** a ti con el texto "Falló el aviso de la solicitud" y, al final, **Terminate** con **Status** = **Failed**.
3. Vuelve a probar los dos casos y anota qué cambió.

**Si no lo ves:** si el panel de Copilot no aparece al editar, estás en el diseñador clásico: Learn indica que Copilot solo está en el diseñador nuevo. Si la Condition con `null` no da **True** con la Lookup vacía, revisa en el historial el valor exacto que trajo el trigger para esa columna y compáralo con eso.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Trigger y acciones que propuso Copilot (nombres exactos) | ___ |
| Lo que Copilot **no** generó y debió tener (al menos dos cosas) | ___ |
| Resultado de la prueba **sin** usuario asignado, antes y después de corregir (estado de la ejecución y error exacto) | ___ |
| Fuente con la que verificaste el patrón Try/Catch (URL de Learn) | ___ |

---

## 🧩 Microlección 4 — Páginas generativas y el model app-builder skill (Model-Driven)

**¿Qué vas a aprender?** Qué genera una página generativa, dónde está disponible y en qué se diferencia del *model app-builder skill*, que construye una app completa.

**¿Por qué existe esto?**
- **Generative pages:** en una Model-Driven App describes una página en lenguaje natural, vinculas hasta **6 tablas** de Dataverse (y, en preview, datos de un conector de Power Platform o una Custom API de Dataverse) y el agente genera código **React** con la interfaz y la lógica. Solo existen en Model-Driven Apps, **no en Canvas** ([Learn](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-pages)).
- **Dos formas de crearlas.** En el navegador ([make.powerapps.com](https://make.powerapps.com)): solo con el entorno en **Estados Unidos, Reino Unido, Australia o Singapur**, y solo con prompts en inglés de EE. UU. Con una herramienta de generación de código (GitHub Copilot CLI, **Claude Code** u otra), con el comando `/genpage` del plugin `model-apps` de [power-platform-skills](https://github.com/microsoft/power-platform-skills): es la vía que Learn **recomienda**, funciona en todas las regiones de la nube pública y pide Node.js 18 o superior y Power Platform CLI (PAC CLI) autenticado contra el entorno ([Learn: páginas generativas con herramientas de código](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-page-external-tools)).
- **Model app-builder skill (`/app-builder`):** construye o edita una **Model-Driven App completa** (tablas, relaciones, forms, views, charts, business rules, Business Process Flows, sitemap con íconos, validaciones en JavaScript, roles de seguridad, datos de muestra y páginas generativas). Primero presenta un **app spec** y un **plan dry-run**; **no crea nada hasta que apruebas el plan**. Pide Node.js LTS, PAC CLI y Azure CLI con la misma identidad (`az login`) ([Learn: model app-builder](https://learn.microsoft.com/power-apps/maker/model-driven-apps/model-driven-app-external-tools)).
- En ambos casos Learn insiste: el agente intenta generar código listo para producción, pero **la validación es responsabilidad tuya**. El navegador te ayuda con la pestaña **Code**, **Compare** (diff entre iteraciones) y el **Accessibility assistant**, cuyo botón **Auto fix** le pasa las violaciones al agente.

**Ejemplo pequeño:** un tablero Kanban por estado no se resuelve bien con un view estándar: es candidato a página generativa. Un formulario para capturar solicitudes todos los días, no: ahí el form estándar es más predecible.

**Práctica real (30 min; elige la variante que puedas hacer):**

*Variante A — en el navegador (entorno en EE. UU., Reino Unido, Australia o Singapur, y una Model-Driven App existente, por ejemplo la del Módulo 4):*
1. En [make.powerapps.com](https://make.powerapps.com) abre la app para editarla. En el diseñador, **Add page** > **Generative page** > **Describe a page**.
2. **Add data** > **Add table** y elige tu tabla de solicitudes. Escribe (en inglés):
   ```
   Build a dashboard that groups the requests by status in Kanban-style columns, showing the
   title, priority and required date on each card. Highlight in red the High priority requests
   whose required date is in the past.
   ```
   y selecciona **Generate page**.
3. Revisa la pestaña **Code**: ¿qué columnas leyó y cómo compara la prioridad? (Es el mismo problema de la Microlección 2: ¿usa el valor de la Choice o un texto?) Mira el **Accessibility assistant** y, si marca violaciones, prueba **Auto fix**.
4. Pide una iteración (por ejemplo `Add a filter by priority`) y usa **Compare** para ver qué cambió entre iteraciones.

*Variante B — sin región compatible o sin Model-Driven App (lectura guiada):* lee el flujo del model app-builder skill en Learn y compara sus etapas (describir el escenario → revisar el app spec → revisar el plan dry-run → generar → verificar contra el spec → iterar) con cómo construirías a mano una Model-Driven App. Escribe en qué etapa manual sueles equivocarte y qué parte del spec revisable te lo haría ver antes.

**Si no lo ves:** si **Generative page** no aparece en **Add page**, comprueba la región del entorno: Learn indica que, fuera de las cuatro regiones del navegador, la alternativa es la vía por herramientas de código.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Variante que hiciste (A o B) y por qué | ___ |
| A: cómo compara la prioridad el código generado (copia la línea) / B: la etapa del app-builder que más te protege y por qué | ___ |
| A: violaciones del Accessibility assistant y si **Auto fix** las resolvió / B: una diferencia concreta entre página generativa y app-builder | ___ |

---

## 🧩 Microlección 5 — Gobernanza: qué controla de verdad el administrador

**¿Qué vas a aprender?** Qué interruptores existen para Copilot en Power Platform, a qué nivel (tenant o entorno) y qué **no** se puede apagar desde el Admin Center.

**¿Por qué existe esto?** Un error frecuente es creer que Copilot "se habilita o no" con un solo interruptor por entorno. Según Learn:
- Las funciones de Copilot **generalmente disponibles (GA)** de Power Apps vienen **activadas por defecto** y solo se apagan pidiéndolo a Soporte de Microsoft. Lo mismo indica Learn para Copilot en cloud flows ([Learn: Copilot en Power Apps](https://learn.microsoft.com/power-apps/maker/canvas-apps/ai-overview), [Learn: FAQ de Copilot en flujos](https://learn.microsoft.com/power-automate/faqs-copilot)).
- Las funciones **en preview** de Power Apps sí se apagan: **por entorno**, en el [Power Platform admin center](https://admin.powerplatform.microsoft.com) > **Environments** > el entorno > **Settings** > **Features** > interruptor **Copilot**; o **para todo el tenant**, en **Settings** (**Tenant settings**) > **Copilot in Power Apps (preview)**. Apagarlo en el tenant afecta solo a los makers, no al control Copilot de las apps.
- **Movimiento de datos entre regiones:** en el entorno, tarjeta **Generative AI features** > **Edit** > casilla **Move data across regions** (no aparece en entornos de EE. UU. ni de nube de gobierno). Si se permite, prompts y resultados pueden procesarse fuera de la región; varias funciones (crear apps con conversación, describir tablas, Copilot de Power Pages) dependen de esto según la región ([Learn](https://learn.microsoft.com/power-platform/admin/geographical-availability-copilot)).
- El área **Copilot** del Admin Center (**Copilot** > **Settings**) agrupa los controles por producto y por entorno, por ejemplo quién puede usar las funciones de IA en Model-Driven Apps (preview, solo en entornos administrados) ([Learn: Copilot en el Admin Center](https://learn.microsoft.com/power-platform/admin/copilot/copilot-hub)).
- Las políticas **DLP** siguen gobernando qué conectores puede usar lo que se genere (un flujo generado no se salta la DLP del entorno).

Conclusión práctica: la decisión de gobierno real es **por entorno**: qué datos hay, qué preview se permite, si se permite mover datos de región y qué DLP aplica. No es "Copilot sí o no".

**Práctica real (20 min; no necesitas ser administrador):** Learn indica que los usuarios con acceso a un entorno pueden **ver** la configuración de Copilot.
1. Entra a [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) > **Manage** > **Environments** y abre tu entorno. Anota su región y busca la tarjeta **Generative AI features**.
2. En el mismo entorno, busca **Settings** > **Features** y anota el estado del interruptor **Copilot**.
3. Abre el área **Copilot** > **Settings** y anota dos controles que veas, con su producto.
4. Si no tienes acceso al Admin Center, haz el ejercicio con la documentación: llena la tabla con lo que dice Learn y marca la fila como "según Learn, no observado".

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Región del entorno y si aparece la casilla **Move data across regions** (y su estado) | ___ |
| Estado del interruptor **Copilot** en **Settings** > **Features** | ___ |
| Dos controles del área **Copilot** > **Settings** (producto + nombre) | ___ |
| Una función de Copilot que **no** se puede apagar desde el Admin Center, con la URL de Learn que lo dice | ___ |

---

## 🔁 Reto de transferencia — Decidir y defender una política de Copilot para Recursos Humanos

**Requisito nuevo:** Recursos Humanos quiere usar Copilot para construir rápido una app de solicitudes de vacaciones y un flujo de aprobación. Restricciones:
1. Su entorno está en **Brasil** y contiene datos personales de empleados (salarios, licencias médicas).
2. Los makers de RR.HH. no son desarrolladores y quieren publicar "lo que genere Copilot" en dos semanas.
3. Legal pide que los datos de empleados no se procesen fuera de la región **salvo decisión documentada**.
4. TI tiene un segundo entorno de desarrollo, sin datos reales, en la misma región.

**Lo que entregas (sin pasos, unos 45 minutos):** una decisión escrita de una página que responda: en qué entorno se usa Copilot y con qué datos; qué se hace con **Move data across regions** (y qué funciones dejarían de estar disponibles si no se permite; míralo en la tabla de Learn); qué preview se deja activa; qué revisión mínima debe pasar cada app o flujo generado antes de publicarse (usa lo que hiciste en las Microlecciones 2 y 3); y qué riesgo aceptas y por qué. No hay una única respuesta correcta: se evalúa que la decisión sea coherente con las restricciones y esté verificada contra Learn.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Separa datos reales de generación | Dices en qué entorno se genera y con qué datos (de prueba o reales), y por qué |
| Decisión sobre movimiento de datos fundada | Citas qué funciones dependen de **Move data across regions** para un entorno en Brasil, con la URL de Learn |
| Distingue GA de preview | Explicas qué puedes apagar tú (preview) y qué no (GA, solo vía Soporte) |
| Revisión antes de publicar | Tu lista incluye al menos: tipos de dato, delegación, datos opcionales vacíos y manejo de errores en flujos, DLP |
| Riesgo explícito | Nombras un riesgo que aceptas, quién lo acepta y cómo lo vigilas |

Si te atascas, una pista por vez:
- **Pista 1:** empieza por la restricción 3: lee en Learn la fila de Brasil en la tabla de regiones (¿dónde se procesa Azure OpenAI para ese entorno?).
- **Pista 2:** la restricción 4 te da una salida: generar en el entorno sin datos reales y llevar el resultado por solución al de producción.
- **Pista 3:** "publicar lo que genere Copilot" choca con lo que viste en las Microlecciones 2 y 3: tu lista de revisión es la condición para publicar.

**Micropráctica de transferencia (6 min):** el mismo razonamiento en formato de decisiones → **[Transferir: política de Copilot para RR.HH.](/practica/ip-ia-006-politica-copilot-rrhh)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Entorno elegido para generar y con qué datos | ___ |
| Decisión sobre **Move data across regions**, con la URL de Learn y la fila que la justifica | ___ |
| Tu lista de revisión antes de publicar (ítems) | ___ |
| Riesgo aceptado y quién lo acepta | ___ |

---

### 💼 Casos Reales de Negocio
En SIT, un Power Platform Admin activó Copilot en Power Apps para todo el tenant sin revisar antes qué entornos contenían datos de clientes bajo NDA. Un maker generó una app describiendo el proceso de negocio, y la sugerencia de Copilot incluyó nombres reales de columnas de una tabla confidencial visibles en la fórmula generada, expuestos luego en una captura de pantalla compartida externamente. La corrección: habilitar Copilot entorno por entorno, revisando primero el Data Loss Prevention (DLP) policy y la clasificación de datos de cada entorno.

Un consultor de SIT necesitaba un dashboard de seguimiento de inspecciones para técnicos de campo dentro de una Model-Driven App ya existente, con vista tipo tablero por estado — algo que un view/form estándar no resuelve bien. En vez de construir un custom page en Canvas embebido (más tiempo, otro lenguaje de fórmulas), usó una página generativa describiendo el layout en lenguaje natural, iteró tres veces sobre el mismo prompt ajustando columnas y agregando el resaltado por antigüedad, y publicó tras revisar el código generado y pasar el Accessibility assistant. Tiempo total: menos de una hora, contra los 1-2 días estimados para un custom page equivalente. La lección para el equipo: la página generativa reemplaza una Canvas Custom Page o un dashboard complejo cuando la necesidad es visual/no transaccional — no reemplaza forms/views estándar para captura de datos rutinaria, donde el diseñador clásico sigue siendo más predecible.

### ✅ Buenas Prácticas
- Decidir el uso de Copilot **entorno por entorno**: qué datos contiene, qué funciones en preview se permiten (interruptor **Copilot** en **Settings** > **Features**), si se permite **Move data across regions** y qué política DLP aplica. Las funciones GA vienen activas y no se apagan desde el Admin Center, así que el control real está en qué entorno y con qué datos se trabaja.
- Generar en un entorno de desarrollo con datos de prueba y llevar el resultado por solución; no describir procesos con datos reales de clientes en el prompt.
- Tratar cualquier app, fórmula, flujo o página generada como un borrador: revisar tipos de dato, delegación, datos opcionales vacíos, manejo de errores, seguridad, accesibilidad y rendimiento antes de publicar.
- Verificar cada salida contra una fuente explícita (tabla de delegación de Learn, historial de ejecuciones, pestaña **Code**) y dejar anotado qué se verificó y contra qué. "**Explain this formula**" explica; no verifica.
- Escribir los prompts con el formato *When X happens, do Y* (flujos) y con nombres de columnas y valores de Choice explícitos (apps): Learn indica que los prompts específicos dan mejores resultados.
- Usar Copilot Studio generative answers solo con fuentes de conocimiento ya validadas y con control de acceso correcto.
- Elegir página generativa para experiencias visuales/no transaccionales (dashboards, tableros, resúmenes guiados) y reservar forms/views estándar para captura de datos rutinaria — no forzar todo a lenguaje natural solo porque está disponible.
- Antes de aprobar el plan dry-run del model app-builder skill, verificar que el spec de la app (personas, tablas, roles de seguridad) refleje el proceso real, igual que revisarías un plan de arquitectura antes de construir manualmente.
- Revisar la disponibilidad regional antes de asumir que una función no existe: las páginas generativas en el navegador solo están en EE. UU., Reino Unido, Australia y Singapur; la vía por herramientas de código funciona en todas las regiones de la nube pública.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Habilitar Copilot en un entorno con datos sensibles sin revisar DLP | Activación por defecto sin evaluación previa | Revisar la política DLP y clasificación de datos del entorno; generar en un entorno sin datos reales |
| Creer que Copilot se apaga por completo con un interruptor del entorno | El interruptor **Copilot** de **Settings** > **Features** solo afecta a las funciones en preview | Las funciones GA solo se apagan vía Soporte de Microsoft; gobernar con entornos, datos, DLP y movimiento de datos |
| Publicar en producción una app/flujo/página generada sin revisión | Asumir que el resultado de Copilot ya está listo para producción | Tratar siempre el resultado como borrador: revisar manejo de errores, seguridad y accesibilidad |
| La galería generada muestra resultados incompletos con muchos registros | La fórmula usa `Trim`, `Len` u otra función no delegable sobre una columna | Comparar con la tabla de delegación de Dataverse en Learn y reescribir (`StartsWith` sobre la columna tal cual) |
| Error de tipos al comparar una Choice con `"Alta"` | La IA compara la columna Choice con un texto | Comparar con la enumeración: `'Prioridad (Solicitudes TI)'.Alta` |
| El flujo generado falla cuando un dato opcional viene vacío y nadie se entera | Copilot generó solo el camino feliz | **Condition** para el dato vacío y Scope Try/Catch con **Run after** y **Terminate** (Módulo 11 para el patrón completo) |
| Confundir Copilot Studio (agentes para usuarios finales) con Copilot en Power Apps/Automate (asistente para makers) | Uso indistinto del término "Copilot" en el ecosistema | Distinguir explícitamente el rol: asistente de autor vs agente conversacional |
| Intentar usar una página generativa en una Canvas App | Asumir que la función es transversal a todo Power Apps | Recordar que las páginas generativas son exclusivas de Model-Driven Apps |
| Asumir que "no veo la opción de página generativa" significa que no existe | En el navegador solo está disponible en EE. UU., Reino Unido, Australia y Singapur | Verificar la región del entorno, o usar la vía por herramientas de código (GitHub Copilot CLI/Claude Code con `/genpage`), disponible en todas las regiones de la nube pública |

### 🧪 Criterios de Validación
- [ ] Genero tablas y una app con **Start with data** > **Create new data**, reviso el tipo de cada columna antes de aceptar y documento qué corregí
- [ ] Encuentro los errores de la fórmula generada de la Microlección 2 (comparación de Choice con texto y funciones no delegables), cito la nota de Learn que lo confirma y escribo la fórmula corregida
- [ ] Genero un flujo con **Create with Copilot**, anoto el trigger y las acciones exactas que propuso y lo pruebo con y sin usuario asignado
- [ ] Corrijo el flujo con una **Condition** para el dato vacío y un Scope Try/Catch con **Run after**, y muestro la ejecución antes y después
- [ ] Diagnostico el síntoma de la práctica "el flujo generado falla sin avisar" antes de ver la solución
- [ ] Genero una página generativa y documento cómo compara la prioridad el código y qué marcó el Accessibility assistant, o (sin región compatible) comparo las etapas del model app-builder skill con la construcción manual
- [ ] Explico la diferencia entre una página generativa (una página) y el model app-builder skill (una app completa con su modelo de datos)
- [ ] Documento la configuración de Copilot de mi entorno (región, **Move data across regions**, interruptor de preview) y nombro una función que no se apaga desde el Admin Center, con su fuente
- [ ] Entrego la decisión del reto de RR.HH. con su rúbrica completa y cada afirmación verificada contra Learn
