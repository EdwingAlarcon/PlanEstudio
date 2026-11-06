---
moduleId: 47
title: "Prompts Técnicos Reutilizables"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 16
practiceMinutes: 150
slug: "prompts-tecnicos-reutilizables"
lastVerified: "2026-11"
---
*Lectura: 14-16 min · Práctica: unas 2 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3, tu plantilla propia y el reto de transferencia).*

### 🎯 Objetivo
Disponer de una biblioteca de plantillas de prompt completas, copiables y versionadas para las tareas técnicas y funcionales más recurrentes en Power Platform, Dynamics 365 y empleabilidad — y saber adaptarlas a un caso propio en vez de partir de cero cada vez. Al terminar habrás usado una plantilla, encontrado con pruebas y con Microsoft Learn los errores de la salida que produjo, y guardado en git una versión mejorada de la plantilla que evita repetirlos.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que obtuviste, no un sí/no). La Microlección 3 es una actividad de **fallo y corrección**: una plantilla produjo una revisión de código con errores plausibles; los detectas con una prueba y con Learn, corriges el código y, sobre todo, corriges **la plantilla** para que la próxima salida no los repita. Cierras escribiendo **tu propia plantilla sin pasos** y con un **reto de transferencia** sobre una tarea funcional.
>
> **Antes de empezar, necesitas:**
> - **Git** (comprueba con `git --version`) y **Node.js 20 o posterior** (`node --version`); el ejecutor de pruebas integrado `node:test` es estable desde la versión 20 ([documentación de Node.js](https://nodejs.org/api/test.html)), así que no instalas nada más.
> - Un asistente de IA (los de los Módulos 44 y 45 sirven; Copilot Free alcanza). **Si no tienes ninguno**, puedes hacer el módulo igual: la Microlección 3 te da la salida de la IA ya escrita.
> - Datos **ficticios**: en ningún paso pegues datos reales de cliente, credenciales ni URLs de tu ambiente (Módulo 49).
> - Este módulo es transversal: no necesitas haber hecho ningún nivel de certificación ni tener un tenant. Si ya hiciste el Módulo 13 (JavaScript de formulario), reconocerás el código de la Microlección 3; si no, el módulo te explica lo necesario.

### 📖 Conceptos Clave
- **Plantilla de prompt:** una instrucción parametrizable que fija el contexto, el formato de salida y las restricciones esperadas, dejando solo los datos específicos de la tarea como variables (ej. nombre de la entidad, campos, validaciones).
- **Componentes de una buena plantilla:** rol/contexto (qué proyecto, qué convenciones), tarea concreta, restricciones (qué no hacer, qué patrón seguir), y formato de salida esperado (código, diff, lista de pasos, tabla, JSON).
- **Variables:** las partes que cambian en cada uso se marcan, por ejemplo `{{nombre de tabla}}`. Una variable sin rellenar que llega al asistente es un error de uso, no de la IA.
- **Versionado de prompts:** igual que el código, una plantilla de prompt cambia con el tiempo (se ajusta cuando deja de dar buenos resultados); guardarla en el repo (ej. `docs/prompts/` o similar) permite historial de cambios con git, en lugar de perderla en un chat.
- **Reutilización vs. personalización:** una plantilla útil cubre el 80% del caso común y deja el 20% restante para ajuste manual — plantillas demasiado rígidas fallan en casos particulares; demasiado abiertas no ahorran tiempo real.
- **Nunca aceptar la salida sin criterio humano:** cada plantilla de esta biblioteca viene con su propio criterio de evaluación — la plantilla acelera la generación, no reemplaza la revisión.
- **Una salida mala es un dato sobre la plantilla:** cuando la salida trae un error que se repetirá en el próximo uso (una afirmación sin fuente, un caso de borde ignorado), además de corregir esa salida se añade a la plantilla la restricción que lo habría evitado, y se versiona el cambio.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Anatomía de una plantilla: de prompt improvisado a plantilla

**¿Qué vas a aprender?** A reconocer las cinco partes de una plantilla (rol, contexto, tarea, restricciones, formato de salida) y a rellenar sus variables con un caso propio.

**¿Por qué existe esto?** "Revisa este código y dime si está bien" produce una respuesta distinta cada vez y no se puede evaluar. Con rol, restricciones y formato fijos, dos personas obtienen salidas comparables y saben contra qué juzgarlas.

**Ahora haz algo — micropráctica (5 min):** un compañero escribió un prompt improvisado; decide qué cambios lo convierten en plantilla → **[Convertir un prompt improvisado en plantilla](/practica/ip-ia-022-de-prompt-improvisado-a-plantilla)**.

**Práctica real (25 min):**

1. Elige **una** de las 8 plantillas de la biblioteca de abajo que corresponda a una tarea que hagas de verdad (o que harás en un lab). Cópiala a un archivo de texto.
2. Rellena **todas** las variables `{{...}}` con datos **ficticios** equivalentes en estructura a los reales. Antes de enviarla, búscale a tu texto `{{`: si aparece, te falta una variable.
3. Envíala a tu asistente de IA. **Qué deberías ver:** una salida con el formato que pide la plantilla (por ejemplo, una tabla con las columnas indicadas). **Si la salida no respeta el formato**, no la corrijas a mano todavía: anota qué parte de la plantilla ignoró.
4. Aplica el criterio **Evalúa** de esa plantilla, pregunta por pregunta, y anota la respuesta.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Plantilla usada (número y nombre) | ___ |
| Variables que rellenaste y con qué valor ficticio | ___ |
| ¿La salida respetó el formato pedido? (sí/no y qué ignoró) | ___ |
| Respuesta a cada pregunta del criterio **Evalúa** | ___ |
| Herramienta de IA usada (o "sin IA, salida de ejemplo") | ___ |

### 📚 Biblioteca: 8 plantillas copiables

Una plantilla por categoría. Para cada una: úsala tal cual con datos propios, luego evalúa el resultado con el criterio indicado antes de aceptarlo.

**1. Análisis funcional — AS-IS/TO-BE y Fit-Gap**
```
Rol: eres consultor funcional Dynamics 365 con experiencia en Fit-Gap.
Contexto: {{nombre del cliente/proyecto}}. Proceso actual (AS-IS): {{descripción en 3-5 líneas}}.
Tarea: propone el proceso TO-BE usando capacidades estándar de {{Dynamics 365 Sales / Customer Service / Dataverse}}
antes de sugerir personalización. Para cada paso del TO-BE indica: si es estándar o requiere
configuración/personalización, y por qué.
Restricciones: no propongas una tabla personalizada si existe una entidad estándar equivalente.
Formato de salida: tabla con columnas Paso | AS-IS | TO-BE | Estándar/Gap | Justificación.
```
*Resultado esperado:* una tabla Fit-Gap de 5-10 filas. **Evalúa:** ¿evitó proponer personalización donde había alternativa estándar? ¿la justificación de cada gap es específica al proceso, no genérica?

**2. Power Platform — diseño de modelo de datos Dataverse**
```
Rol: eres arquitecto de datos Dataverse.
Contexto: necesito modelar {{proceso de negocio, ej. "solicitudes de mantenimiento de activos"}}.
Tarea: propone las tablas necesarias con sus columnas clave, tipos de dato, relaciones (1:N, N:N) y
choices. Usa el prefijo de publisher {{sit_}}, nunca "new_".
Restricciones: máximo {{4}} tablas nuevas; reutiliza Account/Contact si el proceso los necesita, no los
dupliques.
Formato de salida: tabla Markdown por tabla (columna | tipo | requerido | notas) + lista de relaciones.
```
*Resultado esperado:* una tabla por entidad más una lista de relaciones. **Evalúa:** ¿reutilizó Account/Contact en vez de duplicarlos? ¿respetó el prefijo de publisher? ¿el número de tablas es razonable para el alcance descrito?

**3. Revisión de Power Fx**
```
Rol: eres revisor senior de Power Apps Canvas, enfocado en delegación y performance.
Contexto: la siguiente fórmula corre sobre una tabla de Dataverse con más de 5,000 registros:
{{pega aquí la fórmula completa}}
Tarea: identifica si la fórmula es delegable, señala cada función no delegable y su alternativa, y
reescribe la fórmula optimizada.
Formato de salida: (1) veredicto delegable/no delegable, (2) lista de problemas encontrados, (3) fórmula
corregida con comentarios `//`.
```
*Resultado esperado:* veredicto + fórmula corregida comentada. **Evalúa:** ¿la fórmula corregida sigue produciendo el mismo resultado lógico? ¿usó operadores realmente delegables contra Dataverse (lo verás en el Módulo 7, si ya lo hiciste; si no, contrasta cada función con la lista de delegación de Dataverse en Learn), no solo "más cortos"?

**4. Revisión de JavaScript en model-driven apps**
```
Rol: eres revisor senior de código cliente en Dynamics 365 (model-driven apps).
Contexto: el siguiente script corre en el evento {{OnLoad/OnChange/OnSave}} del formulario de
{{nombre de tabla}}:
{{pega aquí el código completo}}
Tarea: revisa uso correcto de executionContext/formContext, manejo de errores, y si el script bloquea
el guardado sin necesidad. Señala cualquier acceso a `Xrm.Page` (API obsoleta).
Formato de salida: lista de hallazgos con severidad (bloqueante/advertencia/sugerencia) + código corregido.
```
*Resultado esperado:* lista de hallazgos + diff del código corregido. **Evalúa:** ¿marcó correctamente el uso de `Xrm.Page` como obsoleto (*deprecated*: sigue funcionando y soportado hasta que se retire, según [Learn](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/clientapi-form-context)), sin afirmar que ya no funciona? ¿el código corregido usa `executionContext.getFormContext()`? La Microlección 3 trabaja sobre una salida real de esta plantilla.

**5. Revisión de plugin C#**
```
Rol: eres revisor senior de plugins de Dataverse (C#, SDK de Dynamics 365).
Contexto: el siguiente plugin se registra en {{Create/Update}} de {{nombre de tabla}}, paso
{{Pre-operation/Post-operation}}:
{{pega aquí el código completo}}
Tarea: revisa manejo de excepciones (InvalidPluginExecutionException), uso de ITracingService,
llamadas síncronas dentro de loops, y si respeta el principio de responsabilidad única.
Formato de salida: lista de hallazgos con severidad + código corregido con comentarios.
```
*Resultado esperado:* lista de hallazgos + código corregido. **Evalúa:** ¿detectó llamadas al servicio de Dataverse (`IOrganizationService`: `Retrieve`, `Update`...) dentro de un bucle? Es el caso del Módulo 42: un plugin tiene un límite de tiempo estricto para terminar ([Learn: plug-ins](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/plug-ins)) y las llamadas en bucle lo agotan con volúmenes reales. ¿el manejo de errores usa el tipo de excepción correcto del SDK?

**6. Documentación de un flujo de Power Automate**
```
Rol: eres consultor documentando flujos para transferencia de conocimiento.
Contexto: el flujo se llama {{nombre}}, dispara con {{trigger}} y tiene estas acciones en orden:
{{lista de acciones}}.
Tarea: documenta el flujo para alguien que nunca lo vio: propósito de negocio, trigger, cada acción
en una frase, condiciones de error y a quién notifican.
Formato de salida: Markdown con secciones Propósito / Trigger / Pasos / Manejo de errores / Owner.
```
*Resultado esperado:* documento Markdown listo para el repositorio. **Evalúa:** ¿describe el propósito de negocio, no solo la mecánica técnica? ¿identifica qué pasa si una acción falla?

**7. Generación de casos UAT**
```
Rol: eres QA funcional preparando UAT para un proceso Dynamics 365.
Contexto: proceso: {{ej. "aprobación de solicitud de gasto con 2 niveles"}}. Reglas de negocio:
{{lista de reglas}}.
Tarea: genera 6-8 casos de prueba cubriendo el camino feliz, al menos 2 casos negativos y 1 caso límite.
Formato de salida: tabla | ID | Escenario | Pasos | Datos de entrada | Resultado esperado |.
```
*Resultado esperado:* tabla de 6-8 casos UAT. **Evalúa:** ¿incluyó casos negativos reales (no solo variaciones del camino feliz)? ¿los datos de entrada son concretos, no genéricos ("dato válido")?

**8. Análisis de vacante para empleabilidad**
```
Rol: eres coach técnico de Power Platform/Dynamics 365 ayudándome a evaluar una vacante.
Contexto: esta es la descripción de la vacante: {{pega el texto completo de la vacante}}.
Mi portafolio incluye estos labs completados: {{lista de labs, ej. "Lab 66 Sales lead-to-cash, Lab 09
Dataverse avanzado"}}.
Tarea: mapea cada requisito de la vacante contra mi portafolio (cubierto/parcial/no cubierto), y para
cada "parcial" o "no cubierto" sugiere qué lab o módulo de este plan de estudio lo cerraría.
Formato de salida: tabla | Requisito | Cobertura | Evidencia/Lab | Acción sugerida |.
```
*Resultado esperado:* tabla de mapeo requisito↔evidencia. **Evalúa:** ¿la IA infló tu experiencia real, o fue honesta marcando "parcial"/"no cubierto" donde correspondía? Nunca aceptes que reescriba tu experiencia como si hubieras hecho algo que no hiciste.

---

## 🧩 Microlección 2 — Guardar la plantilla como código: versionada en git

**¿Qué vas a aprender?** A guardar una plantilla en un repositorio con un encabezado que diga para qué sirve, y a ver su historial con git.

**¿Por qué existe esto?** Una plantilla que vive en el historial de un chat se pierde, y nadie sabe qué versión produjo qué resultado. En un archivo versionado, cada ajuste queda con fecha, autor y motivo, y se puede comparar con `git diff`.

**Práctica real (20 min):**

1. En una terminal, crea una carpeta de práctica (fuera de cualquier repositorio de trabajo) e inicializa un repositorio:
   ```bash
   mkdir biblioteca-prompts
   cd biblioteca-prompts
   git init -b main
   mkdir -p docs/prompts
   ```
   `git init -b main` crea el repositorio con la rama `main` (requiere Git 2.28 o posterior; si tu versión no reconoce `-b`, usa `git init` y sigue: el nombre de la rama no cambia nada en este módulo). En Windows, `mkdir -p` funciona en Git Bash y en PowerShell.
2. Crea `docs/prompts/revision-js-formulario.md` con este encabezado y, debajo, la **plantilla 4** de la biblioteca copiada tal cual:
   ```markdown
   # Plantilla: revisión de JavaScript de formulario (model-driven)

   - **Para qué sirve:** revisar un script de formulario antes de subirlo como recurso web.
   - **Cuándo usarla:** scripts de OnLoad, OnChange u OnSave de hasta unas 100 líneas.
   - **Criterio de evaluación humana:** ver "Evalúa" en el Módulo 47.
   - **Versión:** 1 · **Última actualización:** AAAA-MM-DD

   ## Plantilla
   ```
   (Escribe la fecha de hoy en vez de `AAAA-MM-DD`.)
3. Guarda la versión 1 en git:
   ```bash
   git add docs/prompts/revision-js-formulario.md
   git commit -m "Plantilla de revisión de JS de formulario, versión 1"
   git log --oneline
   ```
   **Qué deberías ver:** una línea con un identificador corto (7 caracteres) y tu mensaje. **Si git te pide nombre y correo**, configúralos una vez con `git config --global user.name "Tu nombre"` y `git config --global user.email "tu@correo"` y repite el `commit`.
4. Haz lo mismo con la plantilla que usaste en la Microlección 1 (otro archivo en `docs/prompts/`, otro commit).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Salida de `git log --oneline` (las líneas exactas) | ___ |
| Nombres de los archivos que guardaste en `docs/prompts/` | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: la revisión de JavaScript que hizo la IA

**¿Qué vas a aprender?** A revisar una salida generada con una plantilla que **parece** correcta, encontrar sus errores con una prueba y con Microsoft Learn, corregir el código y corregir **la plantilla** para que el próximo uso no repita el error.

**¿Por qué existe esto?** La plantilla te da salidas consistentes, incluidos sus errores consistentes. Si solo arreglas el código, el próximo compañero que use la plantilla recibirá el mismo error.

**El script original.** El formulario de solicitudes de SIT tenía este script en el evento **OnChange** de la columna Fecha fin:

```js
// Script original (versión antigua)
function validarFechas() {
  var inicio = Xrm.Page.getAttribute("sit_fechainicio").getValue();
  var fin = Xrm.Page.getAttribute("sit_fechafin").getValue();
  if (fin < inicio) {
    alert("La fecha fin no puede ser anterior a la fecha inicio");
    Xrm.Page.getAttribute("sit_fechafin").setValue(null);
  }
}
```

**La salida de la IA.** Alguien usó la plantilla 4 (versión 1) con ese script y obtuvo esta revisión:

> **Hallazgo 1 (bloqueante):** `Xrm.Page` fue eliminado en la versión 9 y el script ya no se ejecuta. Hay que usar `executionContext.getFormContext()`.
> **Hallazgo 2 (advertencia):** `alert()` interrumpe al usuario; es mejor mostrar el error junto al campo con `setNotification`.
> **Código corregido:**

```js
// validar-fechas.js: "código corregido" tal como lo entregó la IA (contiene errores a propósito)
function validarFechas(executionContext) {
  var formContext = executionContext.getFormContext();
  var inicio = formContext.getAttribute("sit_fechainicio").getValue();
  var fin = formContext.getAttribute("sit_fechafin").getValue();
  var control = formContext.getControl("sit_fechafin");
  if (fin < inicio) {
    control.setNotification("La fecha fin no puede ser anterior a la fecha inicio");
  }
}

// Solo para poder probarlo con Node; en el formulario esta línea no hace nada
if (typeof module !== "undefined") module.exports = { validarFechas };
```

Lo que dice Microsoft Learn y necesitas para revisar (lee estas tres páginas, son cortas):
- [getValue](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/attributes/getvalue): para una columna de fecha devuelve un objeto `Date`, y **el valor puede ser `null`**.
- [setNotification](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/controls/setnotification): muestra un error junto al control, recibe un `uniqueId` opcional para borrarlo después con [clearNotification](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/controls/clearnotification), y **una notificación de error en un control bloquea el guardado del formulario**.
- [Execution context](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/clientapi-execution-context): un controlador registrado desde el diseñador de formularios solo recibe el contexto si se marca **Pass execution context as first parameter** en el cuadro **Handler Properties**.

**Diagnosticar antes de corregir — micropráctica (7 min):** en el ambiente de pruebas, con el código corregido de la IA, una usuaria corrige la fecha y el formulario sigue sin dejarla guardar → **[Diagnosticar: el aviso que no se va](/practica/ip-ia-023-diagnosticar-aviso-que-no-se-va)**. Formula tu hipótesis antes de abrir las pistas.

**Práctica real (45 min):**

1. **Verifica el hallazgo 1 contra Learn.** Abre [Client API form context](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/clientapi-form-context) y busca qué dice de `Xrm.Page`. Anota la frase exacta. ¿Es verdad que "ya no se ejecuta"? ¿La severidad "bloqueante" está justificada?
2. **Prueba lo que la IA sí probó.** Dentro de `biblioteca-prompts`, crea una carpeta `practica`, guarda ahí el código corregido de la IA como `validar-fechas.js` y crea `validar-fechas.test.js` con esta prueba. El objeto `crearFormulario` simula lo mínimo del formulario (valores de columnas y notificaciones), así que no necesitas un tenant:
   ```js
   const { test } = require("node:test");
   const assert = require("node:assert/strict");
   const { validarFechas } = require("./validar-fechas.js");

   // Simula lo mínimo del formulario: valores de columnas y notificaciones por control
   function crearFormulario(valores) {
     const notificaciones = {};
     const formContext = {
       getAttribute: (nombre) => ({ getValue: () => valores[nombre] ?? null }),
       getControl: (nombre) => ({
         setNotification: (mensaje, id) => { notificaciones[nombre] = mensaje; return true; },
         clearNotification: (id) => { delete notificaciones[nombre]; return true; },
       }),
     };
     return { executionContext: { getFormContext: () => formContext }, valores, notificaciones };
   }

   test("fecha fin anterior a fecha inicio muestra la notificación", () => {
     const f = crearFormulario({ sit_fechainicio: new Date("2026-11-10"), sit_fechafin: new Date("2026-11-05") });
     validarFechas(f.executionContext);
     assert.ok(f.notificaciones.sit_fechafin);
   });
   ```
   Desde la carpeta `practica`, ejecuta `node --test`. **Qué deberías ver:** `pass 1` y `fail 0`. Así llegó la revisión "probada".
3. **Busca los fallos tú.** Escribe una prueba por cada situación real del formulario y ejecuta `node --test`. Sin darte la prueba, estas son las situaciones: (a) el usuario pone una fecha fin anterior, ve el error y **corrige** la fecha (cambia `f.valores.sit_fechafin` y vuelve a llamar a `validarFechas`): ¿desaparece la notificación?; (b) el usuario **borra** la fecha fin (`null`) con la fecha inicio puesta; (c) inicio y fin son **el mismo día**. Anota cuáles fallan y por qué, apoyándote en las páginas de Learn de arriba.
4. **Corrige el código** sin tocar las pruebas. Criterios de aceptación: (1) todas tus pruebas pasan; (2) `setNotification` usa un `uniqueId` y existe un `clearNotification` con el mismo id cuando las fechas son válidas o falta alguna; (3) si `getValue()` devuelve `null` en alguna de las dos fechas, no se muestra el error.
5. **Rompe a propósito para confirmar.** Quita temporalmente la llamada a `clearNotification` de la rama de fechas válidas y ejecuta `node --test`: al menos una prueba tiene que fallar. Deshaz el cambio.
6. **Lo que la salida no dijo.** El código corregido recibe `executionContext`, pero el script original no lo recibía. Según la página de Execution context, ¿qué hay que cambiar en el registro del evento en el formulario para que `executionContext` no llegue vacío? Anota también qué comportamiento del original eliminó la IA sin decirlo (mira la última línea del `if` original) y decide si lo conservarías.
7. **Corrige la plantilla, no solo el código.** Edita `docs/prompts/revision-js-formulario.md`: sube la versión a 2 y añade a **Restricciones** una línea por cada error que encontraste (por ejemplo: "Si afirmas que una API fue retirada, cita la página de Microsoft Learn; distingue *obsoleta* de *eliminada*"; "Considera que `getValue()` puede devolver `null`"; "Toda notificación con `setNotification` debe limpiarse con `clearNotification` y el mismo `uniqueId`"; "Si cambias la firma de la función, indica el cambio necesario en el registro del evento"). Añade al **Formato de salida**: "incluye los casos de prueba que comprobarían el código corregido". Luego:
   ```bash
   git diff docs/prompts/revision-js-formulario.md
   git commit -am "Plantilla de revisión de JS, versión 2: null, clearNotification y fuentes"
   ```
   **Qué deberías ver** en `git diff`: tus líneas nuevas en verde con `+` al inicio. **Si `git commit -am` no incluye tu archivo de práctica**, es normal: `-a` solo incluye archivos que git ya conocía; la carpeta `practica` no se versiona en este ejercicio.
8. **(Opcional, con IA)** Vuelve a usar la plantilla versión 2 con el script original y compara la salida con la de la versión 1: ¿repitió los errores?

> **Ojo con el alcance:** este ejercicio prueba la lógica con un formulario simulado. Si tienes un ambiente con una app model-driven (Módulo 13, si ya lo hiciste), la comprobación final es subir el script como recurso web y repetir las tres situaciones en el formulario real.

**Evidencia a reportar (una fila por error que encontraste):**

| Error de la salida de la IA | Cómo lo demostraste (prueba o frase de Learn) | Resultado antes / después de corregir | Restricción que añadiste a la plantilla |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Frase exacta de Learn sobre `Xrm.Page` | ___ |
| Resultado de `node --test` con el código de la IA y con tu versión corregida | ___ |
| ¿Qué prueba falló al quitar `clearNotification`? | ___ |
| Cambio necesario en el registro del evento | ___ |
| Salida de `git log --oneline` después del commit de la versión 2 | ___ |

---

### 🏗️ Construir sin pasos — tu propia plantilla

> **Situación:** elige una tarea que repitas al menos una vez por semana (o la repetirás en un lab) y que ninguna de las 8 plantillas cubra; por ejemplo, redactar la descripción de un pull request, documentar una tabla de Dataverse o preparar el resumen de una reunión técnica.
> **Entrega:** la plantilla en `docs/prompts/` con su encabezado y su propio criterio **Evalúa**, un commit, y la salida de usarla una vez con datos ficticios.

No hay una plantilla única correcta. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Tiene las cinco partes | Rol, contexto, tarea, restricciones y formato de salida, cada una con contenido propio de la tarea |
| Las variables son las justas | Lo que cambia en cada uso está en `{{...}}`; las convenciones del equipo (prefijo `sit_`, idioma, severidades) están fijas |
| Restringe lo que suele salir mal | Al menos una restricción nace de un error real que viste (en este módulo o en tu trabajo) |
| Se puede evaluar | El criterio **Evalúa** tiene preguntas que se responden mirando la salida, no "¿está bien?" |
| Es segura de compartir | No contiene datos de cliente, credenciales ni URLs internas; está versionada |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tarea que cubre tu plantilla y por qué la elegiste | ___ |
| Restricción que nace de un error real (cuál error) | ___ |
| Criterio de la rúbrica que más te costó cumplir y cómo lo resolviste | ___ |

---

## 🔁 Reto de transferencia — Una plantilla para convertir notas de reunión en historias de usuario

Cambia la tarea y comprueba si entendiste el patrón. Una consultora funcional de SIT quiere una plantilla que convierta las notas de una reunión de levantamiento en historias de usuario con criterios de aceptación. Su primer intento sin plantilla devolvió historias muy bien redactadas... con dos requisitos que nadie mencionó en la reunión.

1. **Micropráctica (7 min):** **[Transferir: plantilla de notas de reunión a historias de usuario](/practica/ip-ia-024-transferir-notas-a-historias)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **Escribe la plantilla** en `docs/prompts/` y pruébala con estas notas ficticias (cópialas tal cual):
   ```
   Reunión con Mantenimiento (ficticia). Los técnicos registran fallas de equipos en una hoja de cálculo.
   Quieren registrar la falla desde el celular con foto. El supervisor asigna el técnico.
   Si la falla es crítica, avisar al jefe de planta. No se habló de cuánto tiempo hay para atenderla.
   ```
3. **Evalúa la salida:** ¿marcó como pregunta abierta el tiempo de atención en vez de inventar un SLA? ¿cada historia remite a una frase de las notas? ¿"crítica" quedó definida o señalada como pregunta?

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobaste que funciona |
|---|---|---|
| Restricción contra requisitos inventados | ___ | ___ |
| Formato que permite rastrear cada historia a las notas | ___ | ___ |
| Qué hizo la salida con el tiempo de atención no mencionado | ___ | ___ |
| Commit de la plantilla (salida de `git log --oneline`) | ___ | ___ |

### 💼 Casos Reales de Negocio
En SIT, cada desarrollador pedía "genera un flujo de aprobación" con una instrucción distinta cada vez, produciendo flujos con estructuras y nomenclatura inconsistentes entre proyectos, difíciles de mantener en equipo. Al introducir una plantilla común (con la convención de nombres `sit_`, el patrón de dos aprobadores y el manejo de rechazo ya especificados), el tiempo de creación de un flujo nuevo bajó y la consistencia entre flujos de distintos desarrolladores mejoró notablemente, facilitando el mantenimiento posterior.

### ✅ Buenas Prácticas
- Guardar las plantillas de prompt en el repositorio, versionadas con git, no solo en el historial de un chat.
- Incluir siempre restricciones explícitas (qué NO hacer, qué convención seguir) en la plantilla, no solo la tarea positiva.
- Revisar y actualizar las plantillas cuando dejen de producir buenos resultados, igual que se refactoriza código.
- Nunca pegar datos reales de cliente, credenciales o código con secretos dentro de una plantilla al probarla (Módulo 49) — usar siempre datos ficticios equivalentes en estructura.
- Ejecutar el criterio de evaluación humana de cada plantilla (indicado junto a cada una) antes de usar el resultado en un entregable real.
- Cuando una salida trae un error que se puede repetir, corregir también la plantilla (una restricción nueva) y versionar el cambio con un mensaje que diga por qué.
- Pedir en el formato de salida las pruebas o las fuentes que respaldan la respuesta: una afirmación sobre una API ("fue eliminada", "es delegable") se contrasta con Microsoft Learn antes de aceptarla.
- Antes de enviar una plantilla, buscar `{{` en el texto: una variable sin rellenar produce una salida genérica.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Repetir instrucciones distintas cada vez para la misma tarea recurrente | No haberlas convertido nunca en plantilla | Extraer una plantilla la primera vez que se detecta la repetición |
| Perder plantillas útiles en el historial de un chat | No versionarlas en el repositorio | Guardarlas como archivos Markdown en el repo, con control de versiones |
| Plantillas tan rígidas que fallan en casos particulares | Sobre-especificar cada detalle sin dejar espacio de ajuste | Cubrir el caso común como plantilla y dejar el resto para ajuste manual explícito |
| Prompt ambiguo sin rol, contexto ni formato de salida | Copiar solo la "tarea" de la plantilla sin el resto de las secciones | Usar siempre las 5 partes completas: rol, contexto, tarea, restricciones y formato |
| Aceptar el resultado de la plantilla de vacante como currículo real | Confundir "mapeo de cobertura" con "reescritura de experiencia" | Usar la salida solo como diagnóstico de brechas, nunca como texto final sin verificar que sea cierto |
| Aceptar "esta API fue eliminada" porque suena técnico | La plantilla no pedía fuentes y nadie lo contrastó | Verificar en Learn; en el caso de `Xrm.Page`, Learn dice que está obsoleta pero sigue soportada |
| El aviso de error no se va y el formulario no guarda | El código generado usa `setNotification` sin `clearNotification`, y Learn indica que una notificación de error en un control bloquea el guardado | Usar un `uniqueId` y limpiar la notificación cuando las fechas son válidas; añadir la regla a la plantilla |
| El código corregido falla con "Cannot read properties of undefined" al cambiar la fecha | La función ahora espera `executionContext`, pero el evento sigue registrado sin pasarlo | Marcar **Pass execution context as first parameter** en **Handler Properties** del evento |
| Corregir la salida pero no la plantilla | Tratar el error como un accidente de ese uso | Añadir la restricción que lo habría evitado y hacer commit de la nueva versión |

### 🧪 Criterios de Validación
- [ ] Convertí un prompt improvisado en plantilla en la micropráctica y rellené todas las variables de una plantilla de la biblioteca con datos ficticios
- [ ] Usé al menos 3 de las 8 plantillas de la biblioteca con datos propios (no los del ejemplo)
- [ ] Apliqué el criterio de evaluación humana de cada plantilla usada antes de aceptar el resultado
- [ ] Guardo al menos una plantilla adaptada como archivo versionado en el repositorio, con encabezado, y muestro su historial con `git log --oneline`
- [ ] Verifiqué contra Learn la afirmación de la IA sobre `Xrm.Page` y anoté la frase exacta
- [ ] Escribí pruebas con `node:test` para las situaciones reales del formulario, encontré los fallos del código generado, lo corregí y todas mis pruebas pasan
- [ ] Rompí mi corrección a propósito y comprobé que al menos una prueba falla
- [ ] Identifiqué un caso donde la IA fue imprecisa u optimista y lo corregí manualmente, y añadí a la plantilla la restricción que lo evita (versión 2 con commit y `git diff`)
- [ ] Escribí una plantilla propia con su criterio **Evalúa** y la contrasté con la rúbrica
- [ ] En el reto de transferencia, mi plantilla de historias de usuario marca como pregunta lo que las notas no dicen en vez de inventarlo
- [ ] Relacioné la plantilla de UAT con el Lab 55 (UAT y auditoría de prompts) y la plantilla de vacantes con el Lab 79 (simulación de entrevista técnica)

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de tu plantilla propia y del reto de transferencia.
- La carpeta `biblioteca-prompts` con `docs/prompts/` y la salida de `git log --oneline`.
- Los archivos `practica/validar-fechas.js` (tu versión corregida) y `practica/validar-fechas.test.js`, más la salida de `node --test` antes y después de corregir.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 48 revisa diffs y pull requests generados por IA con la misma lógica de evidencia, el Módulo 49 cubre qué datos nunca deben entrar en un prompt, y el Lab 80 aplica la plantilla de revisión de JavaScript a un cambio CRM completo.
