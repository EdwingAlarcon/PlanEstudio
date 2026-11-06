---
moduleId: 73
title: "Selectores, sincronización y resiliencia"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 22
practiceMinutes: 210
slug: "selectores-sincronizacion-resiliencia"
lastVerified: "2026-11"
---
*Lectura: 20-22 min · Práctica: unas 3 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3, el ejercicio sin pasos y el reto de transferencia).*

## 🎯 Objetivo

Diseñar selectores estáticos/dinámicos, alternativos y mantenibles; sincronizar interfaces asincrónicas con waits, timeouts, polling, reintentos acotados y validación de estado.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica real en Power Automate for desktop (PAD) con **evidencia** (el resultado exacto que viste, no un sí/no). Después construyes un flujo **sin pasos**, **diagnosticas síntoma primero** una espera que nunca termina y cierras con un **reto de transferencia** sobre otra pantalla.
>
> **Antes de empezar, necesitas:**
> - Windows 10/11 con Power Automate for desktop instalado y la extensión de PAD para Microsoft Edge activa. Si todavía no lo tienes, la instalación paso a paso está en el [Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad); no la repetimos aquí.
> - **No necesitas licencia de pago.** Todo el módulo se hace creando y ejecutando desktop flows en tu equipo, en modo atendido: Learn indica que crear flujos con PAD y ejecutarlos con el runtime local atendido está disponible incluso en Windows Home, y que el manejo de excepciones está disponible para todos los tipos de cuenta ([Prerequisites and limitations](https://learn.microsoft.com/en-us/power-automate/desktop-flows/requirements)). Lo que sí exige licencia (lanzar desktop flows desde un cloud flow, ejecución desatendida, máquinas registradas) no se usa aquí.
> - Los dos sandboxes del curso, que no guardan nada en un servidor: el [Portal SIT](/rpa-sandbox/portal) y [SIT Registro Legacy](/rpa-sandbox/legacy-app). PAD necesita la URL completa: `https://planestudio.vercel.app/rpa-sandbox/portal` y `https://planestudio.vercel.app/rpa-sandbox/legacy-app`. Ambos tienen un selector **Escenario** o **Modo** a la izquierda que cambia la página a propósito (selector modificado, lento, layout cambiado...) y un botón **Reset**.
> - Los Módulos 71 (automatización web) y 72 (aplicaciones Windows) te dan contexto, pero este módulo explica lo que usa.

## 📖 Conceptos Clave

Un UI element puede tener múltiples selectores evaluados en orden. Los atributos dinámicos deben generalizarse con criterio; los waits deben esperar condición real, no cubrir incertidumbre con pausas largas.

- **Selector:** una ruta jerárquica que PAD usa para encontrar un elemento. Cada nivel va separado por `>` y describe un elemento contenido en el de su izquierda, con atributos entre corchetes, por ejemplo `:desktop > window[Name="Notes.txt - Notepad"][Process="Notepad"]` ([Build a custom selector](https://learn.microsoft.com/en-us/power-automate/desktop-flows/build-custom-selectors)). Los selectores web usan atributos HTML; los de escritorio, atributos de accesibilidad de Windows.
- **Selectores alternativos:** un UI element puede tener varios selectores; si uno falla, PAD usa el siguiente en el orden definido ([Automate using UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements)). El orden importa: el primero debe ser el más preciso, no el más permisivo.
- **Operadores de atributo:** **Equal to**, **Not equal to**, **Contains**, **Starts with**, **Ends with** y **Regular expression match** (motor de expresiones regulares de .NET). Un valor fijo con **Equal to** es lo más frágil ante cambios de texto; **Contains** sin criterio es lo más peligroso, porque puede encontrar otro elemento.
- **Variables en selectores:** un atributo puede tomar el valor de una variable con la notación `%Variable%`. En el editor visual las variables solo funcionan con **Equal to**; con otros operadores PAD muestra el editor de texto.
- **Test selector:** en el selector builder, **Test selector** comprueba si el selector encuentra el elemento en pantalla y da tres resultados posibles: **Success**, **Failed** (resalta en la lista **Elements** el nivel que no se encontró) o **Multiple UI elements found** (en tiempo de ejecución PAD interactúa con el primero desde la esquina superior izquierda) ([Test a selector](https://learn.microsoft.com/en-us/power-automate/desktop-flows/test-selectors)). Un selector que encuentra varios elementos no "funciona": acierta por casualidad.
- **Selector basado en texto:** al capturar puedes elegir **Capture based on text**; usa el atributo **Text** en web y **Name** en escritorio, y solo existe para elementos que tienen texto propio.
- **Esperar la condición real:** **Wait** pausa un número fijo de segundos y no sabe nada de la pantalla. **Wait for web page content** (web) y **Wait for window content** (escritorio) suspenden el flujo hasta que un texto o un elemento aparece o desaparece ([Browser automation actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/webautomation), [UI automation actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/uiautomation)). **Wait for window content** además puede comprobar si el elemento está **Enabled** o **Disabled**.
- **Polling acotado:** comprobar una condición varias veces con un máximo (por ejemplo, **Loop** de 1 a 20 con **If web page contains** y **Exit loop**), y registrar "tiempo agotado" como un fallo distinto de "elemento no encontrado".
- **Selector roto vs. pantalla lenta:** si **Test selector** da **Success** con la pantalla ya cargada, el selector no es el problema; si da **Failed** con la pantalla visible, sí lo es. Ese es el primer diagnóstico, antes de tocar tiempos.

## 👨‍💻 Actividades Prácticas Paso a Paso

## 🧩 Microlección 1 — Leer un selector y probarlo antes de confiar en él

**¿Qué vas a aprender?** A capturar un elemento web, leer su selector nivel por nivel y probarlo con **Test selector**.

**¿Por qué existe esto?** Casi todas las roturas de un bot de interfaz empiezan con un selector que nadie leyó: se capturó, funcionó una vez y se publicó.

**Ahora haz algo — micropráctica (6 min):** decide cómo endurecer el selector del botón `Enviar v3.14` → **[Un selector que sobreviva a la próxima versión](/practica/ip-rpa-019-selector-resistente-a-versiones)**.

**Práctica en PAD (40 min):**

1. Abre Microsoft Edge en `https://planestudio.vercel.app/rpa-sandbox/portal`. En **Escenario** deja **Normal** y pulsa **Reset**. Deberías ver la tabla con la solicitud `SOL-2026-0001` en la primera fila.
2. En la consola de PAD crea un desktop flow nuevo llamado `M73 Selectores`. En el diseñador, abre la pestaña **UI elements** del lado derecho y pulsa **Add UI element**.
3. Pasa a Edge, coloca el puntero sobre la celda `SOL-2026-0001` hasta que se marque con un recuadro y pulsa **Ctrl + Left click**. Vuelve al picker y selecciona **Done**. El elemento aparece en el panel **UI elements** con el icono de elemento web. **Si el picker no marca nada dentro de la página**, la extensión de Edge no está activa: vuelve al Módulo 68.
4. Haz clic derecho sobre el elemento → **Edit**. Se abre el selector builder. Recorre la lista **Elements** de arriba abajo y anota cada nivel y qué atributos están activados.
5. En la lista desplegable **Web browser tab** elige la pestaña del portal y pulsa **Test selector**. Anota el resultado.
6. Activa la vista **Text editor** y copia el selector en texto a tu evidencia. Vuelve a la vista visual sin guardar cambios.
7. Repite la captura sobre la misma celda, pero esta vez en el picker haz clic derecho sobre la celda y elige **Capture based on text**: deja **Text value** = `SOL-2026-0001`, operador **Equal to**, y pulsa **Capture**. Prueba también este selector.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Niveles del selector capturado (en orden) | ___ |
| Atributos activados en el último nivel | ___ |
| Resultado de **Test selector** (selector por defecto) | ___ |
| Selector basado en texto, copiado del **Text editor** | ___ |
| Un atributo que crees que cambiaría con una versión nueva del portal, y por qué | ___ |

---

## 🧩 Microlección 2 — Romper el selector a propósito y repararlo sin volverlo ambiguo

**¿Qué vas a aprender?** A reproducir una rotura de selector, ver qué nivel falla y repararla con un operador o un selector alternativo, comprobando que no encuentra elementos de más.

**¿Por qué existe esto?** El Caso Real de este módulo se resolvió "a mano" en producción. Si lo practicas en un entorno controlado, la próxima vez sabrás qué nivel mirar primero.

**Práctica en PAD (50 min):**

1. Abre el selector builder del elemento por defecto de la Microlección 1. Haz clic derecho sobre el selector → **Create a copy**, y renombra la copia (clic derecho → **Rename**) como `por-clase`.
2. En la copia, busca en **Elements** el nivel `div` que envuelve a la tabla. Actívalo si está desactivado y, en sus atributos, activa **Class** con operador **Equal to**. El valor que verás en modo Normal es `mt-4 overflow-x-auto rounded-lg border border-border`. Pulsa **Test selector**: debería dar **Success**. **Si ese nivel o ese atributo no aparecen en tu captura**, no inventes otro: anota qué niveles te ofrece PAD y usa el atributo del nivel más cercano a la tabla cuyo valor cambie entre los dos modos del paso siguiente.
3. Selecciona **Save**. En Edge, cambia **Escenario** a **Selector modificado**. En ese modo, el contenedor de la tabla recibe una clase extra (`pt-2`) y su atributo `data-rpa-table` pasa de `requests` a `requests-v2`, como haría una actualización menor del proveedor.
4. Vuelve a abrir el selector builder y pulsa la flecha junto a **Test selector** → **Test all selectors**. Anota qué selector da **Failed** y qué nivel resalta PAD en **Elements**. El selector por defecto puede seguir dando **Success** si no dependía de esos atributos: anótalo también, es un resultado válido.
5. Repara la copia `por-clase`: cambia el operador de **Class** a **Contains** con el valor `overflow-x-auto`. Prueba en **Selector modificado** y en **Normal**. Ambos deben dar **Success**.
6. Ahora comprueba el riesgo contrario. Crea otra copia, `demasiado-amplia`, y desactiva en el nivel de la fila (`tr`) el atributo que fija qué fila es. Pulsa **Test selector**: deberías ver **Multiple UI elements found**, porque ahora coincide con la primera celda de todas las filas. **Si no lo ves**, anota qué atributos siguen activos en los niveles `tr` y `td` (también en el **Text editor**): algo sigue fijando la fila, y encontrarlo es justo el ejercicio. Desactiva esta copia (clic derecho → **Disable**) y anota por qué no la dejarías activa en producción.
7. Ordena los selectores para que el primero sea el más preciso que funciona en ambos modos. Selecciona **Save** y deja el escenario en **Normal**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Selector que falló en **Selector modificado** y nivel resaltado | ___ |
| Valor de **Class** antes y después del cambio de modo | ___ |
| Reparación aplicada (operador y valor) y resultado en ambos modos | ___ |
| Resultado de la copia `demasiado-amplia` | ___ |
| Orden final de los selectores y por qué ese orden | ___ |

---

## 🧩 Microlección 3 — Esperar la condición real, con un tiempo máximo

**¿Qué vas a aprender?** A reemplazar una pausa fija por una espera basada en la pantalla, a acotarla y a medir cuánto esperó de verdad.

**¿Por qué existe esto?** Un `Wait` de 5 segundos falla el día que el sistema tarda 6 y desperdicia tiempo los días que tarda 1. Peor: cuando falla, el error dice "elemento no encontrado" y todo el mundo culpa al selector.

**Práctica en PAD (55 min):**

1. Abre Edge en `https://planestudio.vercel.app/rpa-sandbox/legacy-app`, pulsa **Reset** y elige el modo **Confirmación lenta**. En ese modo, al pulsar **Registrar**, la confirmación tarda casi un segundo en aparecer.
2. Crea un desktop flow `M73 Espera`. Primera acción: **Launch new Microsoft Edge** con **Launch mode** = **Attach to running instance**, **Attach to Microsoft Edge tab** = **By URL** y **Tab URL** = `rpa-sandbox/legacy-app` (acepta parte de la URL). Produce la variable `%Browser%`.
3. Agrega **Populate text field on web page**: captura como UI element el campo **Solicitud** y en **Text** escribe `SOL-2026-0021`. Agrega **Press button on web page** con el botón **Registrar**.
4. **Versión frágil:** agrega **If web page contains**, **Check if web page** = **Contains text**, **Text** = `Registro confirmado`. Dentro, **Set variable** `%Resultado%` = `confirmado`; agrega **Else** con `%Resultado%` = `NO confirmado`. Ejecuta el flujo y anota el resultado. Cierra el diálogo a mano si apareció y cambia el número de solicitud (`SOL-2026-0022`, `0023`...) antes de cada corrida, porque el sandbox rechaza IDs repetidos.
5. **Versión con polling acotado:** borra el **If** del paso 4. Antes de **Press button on web page** agrega **Get current date and time** (variable `%Inicio%`). Después agrega **Set variable** `%Confirmado%` = `%False%` y un **Loop** con **Start from** 1, **End to** 20, **Increment by** 1. Dentro del loop: **If web page contains** (**Contains text** `Registro confirmado`) → **Set variable** `%Confirmado%` = `%True%` → **Exit loop**; cierra el **If** y agrega **Wait** con **Duration** = 1. Después del loop: **Get current date and time** (`%Fin%`) y **Subtract dates** (**From date** `%Fin%`, **Subtract date** `%Inicio%`, **Get difference in** = **Seconds**).
6. Tras el loop agrega **If** `%Confirmado%` **Equal to (=)** `%True%`: **Press button on web page** sobre el botón **Cerrar** del diálogo. En el **Else**, **Set variable** `%Resultado%` = `timeout esperando confirmación`: un mensaje distinto del de "no encontré el botón".
7. Ejecuta tres veces en **Confirmación lenta** y una en **Normal**. Anota la espera real de cada corrida.
8. Compara con la acción directa: reemplaza el loop por **Wait for web page content** con **Wait for web page to** = **Contain text** y el mismo texto. La referencia de Learn de esta acción no documenta un parámetro de tiempo máximo; si tu versión de PAD muestra en ella una opción para fallar tras un tiempo, actívala y anota cómo se llama. Si no la muestra, la acción puede esperar indefinidamente: por eso el loop acotado del paso 5 es el patrón de este módulo cuando necesitas un máximo explícito.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Resultado de la versión frágil (paso 4) en **Confirmación lenta** | ___ |
| Segundos medidos con **Subtract dates** en las 3 corridas lentas | ___ |
| Segundos medidos en modo **Normal** | ___ |
| ¿**Wait for web page content** mostró opción de tiempo máximo en tu versión? Nombre exacto | ___ |
| Mensaje que registra tu flujo cuando se agota el tiempo | ___ |

---

### 🔎 Diagnosticar síntoma primero — la espera que nunca termina

En el portal, un compañero escribió un flujo que, antes de leer la tabla, espera a que desaparezca el texto "Cargando". En modo **Lento** el flujo se queda detenido en esa espera, aunque la tabla se ve en pantalla.

1. **Reprodúcelo (15 min):** en el Portal SIT elige **Lento**. Crea un flujo con **Launch new Microsoft Edge** (adjunto por URL a `rpa-sandbox/portal`) y **Wait for web page content** con **Not contain text** = `Cargando`. Ejecútalo, observa que no avanza y detenlo con el botón de parar de PAD. En este sandbox el indicador de carga se queda visible en modo **Lento**; en aplicaciones reales pasa lo mismo con barras de estado o avisos que nunca se van.
2. **Antes de abrir las pistas**, abre el selector builder de la celda `SOL-2026-0001` y pulsa **Test selector** con el portal en **Lento**. Ese resultado decide si el problema es el selector o la espera.
3. **Micropráctica (8 min):** **[Diagnosticar: la espera que nunca termina](/practica/ip-rpa-020-diagnosticar-espera-que-nunca-termina)**. Escribe tu hipótesis primero.

| Campo | Tu valor |
|---|---|
| Resultado de **Test selector** con el portal en **Lento** | ___ |
| ¿Selector roto o condición de espera equivocada? Tu evidencia | ___ |
| Condición de espera corregida | ___ |

---

### 🏗️ Construir sin pasos — leer la primera página del portal en cualquier escenario

> **Requisito:** un desktop flow que, con el Portal SIT en **Normal**, **Lento**, **Selector modificado** o **Modal inesperado**, lea el ID de la primera fila de la tabla y lo escriba en un archivo de texto. Si aparece el modal, lo cierra y continúa. Si el escenario es **Error simulado** o **Sesión expirada**, no inventa datos: registra que no hay tabla y termina.
> **Criterios de aceptación:** (1) ningún **Wait** fijo mayor de 1 segundo fuera de un loop acotado; (2) todos los selectores pasan **Test all selectors** en al menos dos escenarios; (3) ningún selector activo da **Multiple UI elements found**; (4) el archivo distingue "leído", "sin tabla" y "tiempo agotado".

Pistas de acciones (sin orden): **If web page contains**, **Wait for web page content**, **Press button on web page**, **Get details of element on web page** (atributo **Own Text**), **Write text to file**.

| Escenario | Resultado en el archivo | ¿Pasó sin tocar el flujo? |
|---|---|---|
| Normal | ___ | ___ |
| Lento | ___ | ___ |
| Selector modificado | ___ | ___ |
| Modal inesperado | ___ | ___ |
| Error simulado | ___ | ___ |

---

## 🔁 Reto de transferencia — Otra pantalla, otro tipo de elemento

Cambia la pantalla y el tipo de selector. Primero, en **SIT Registro Legacy**, captura en modo **Normal** el campo **Solicitud** y el botón **Registrar**, y pasa a **Layout cambiado** (el formulario se mueve a la derecha de la tabla). El campo no tiene identificador propio: tienes que decidir qué ancla estable usar. Segundo, haz lo mismo en una aplicación de escritorio: el Bloc de notas de Windows con dos archivos distintos abiertos, donde el título de la ventana cambia con el nombre del archivo. Si tu Bloc de notas abre los archivos como pestañas de la misma ventana, abre el segundo en una ventana nueva: el ejercicio necesita dos ventanas.

1. **Micropráctica (9 min):** **[Transferir: el selector del botón Guardar en una app de escritorio](/practica/ip-rpa-021-transferir-selector-a-otra-pantalla)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En PAD:** deja ambos UI elements con selectores que pasen **Test all selectors** en los dos layouts. Para el Bloc de notas, haz que el selector de la ventana funcione con cualquier archivo (operador o variable en el atributo **Name**) y comprueba que, con dos ventanas abiertas, no da **Multiple UI elements found** cuando quieres una concreta.

| Campo | Tu valor |
|---|---|
| Ancla elegida para el campo **Solicitud** y por qué es estable | ___ |
| Resultado de **Test all selectors** en **Normal** y en **Layout cambiado** | ___ |
| Selector de la ventana del Bloc de notas (texto) | ___ |
| Cómo eliges una ventana concreta cuando hay dos abiertas | ___ |

## 💼 Casos Reales de Negocio

Después de una actualización del proveedor, el botón `Enviar v3.14` cambia a `Enviar v3.15`. El bot falla porque el selector dependía del texto completo. La corrección usa atributos estables y prueba de regresión.

## ✅ Buenas Prácticas

- Usa selector builder y prueba antes de publicar.
- Mantén selectores alternativos ordenados.
- Valida ventana padre.
- Evita reintentos infinitos.
- Documenta señales de cambio de UI.
- Usa **Test all selectors** después de cada edición: PAD quita el resultado de la prueba cuando cambias un selector, y hay que volver a probarlo.
- Prefiere un atributo estable y un operador acotado (**Starts with**, **Regular expression match**) antes que **Contains** sobre un texto corto.
- Espera el elemento que vas a usar, no un indicador indirecto.
- Registra por separado "elemento no encontrado" y "tiempo agotado".

## ⚠️ Errores Comunes

- Cambiar todos los selectores sin aislar causa.
- Usar wildcard demasiado amplio.
- Confundir timeout con causa raíz.
- No probar regresión en pantallas relacionadas.
- Dar por bueno un selector que en la prueba dice **Multiple UI elements found**: en tiempo de ejecución PAD usará el primero desde la esquina superior izquierda, que puede no ser el que querías.
- Esperar a que desaparezca un aviso que en algunos estados nunca desaparece: el flujo se queda detenido sin error.
- Usar variables con un operador distinto de **Equal to** y no encontrar el selector en el editor visual: PAD lo muestra en el editor de texto.

## 🧪 Criterios de Validación

- [ ] Puedo leer la anatomía de un selector.
- [ ] Creo selector alternativo mantenible.
- [ ] Uso waits/polling con timeout razonable.
- [ ] Diagnostico race conditions y foco.
- [ ] Documento prevención de ruptura.
- [ ] Capturé un elemento web y probé su selector con **Test selector**, y anoté el resultado.
- [ ] Reproduje la rotura del modo **Selector modificado**, identifiqué el nivel que falla y la reparé sin dejar selectores con varias coincidencias.
- [ ] Medí con **Subtract dates** la espera real de una confirmación lenta usando un loop acotado.
- [ ] Diagnostiqué la espera que nunca termina con **Test selector** antes de cambiar tiempos.
- [ ] Construí sin pasos el flujo que lee la primera página del portal en cinco escenarios.
- [ ] En el reto de transferencia dejé selectores que pasan en dos layouts y en una aplicación de escritorio.

## Evidencia

Selector antes/después, prueba de selector, log de wait, RCA breve y plan de mantenimiento. Lab recomendado: LAB-108. Incidente relacionado: INC-RPA-001.

Guarda también las tablas de evidencia de las tres microlecciones, del diagnóstico, del ejercicio sin pasos y del reto de transferencia.

## Preguntas de verificación

1. ¿Qué atributo eliminarías si cambia por versión?
2. ¿Por qué un wildcard excesivo puede ser peligroso?
3. ¿Cómo diferencias selector roto de pantalla lenta?

## Conexión con siguiente módulo

Selectores resilientes no bastan: necesitas errores, logging, idempotencia y recuperación.

## Limitaciones y seguridad

Las capturas de selectores pueden incluir nombres internos de aplicaciones; anonimiza evidencia.

Los sandboxes del curso son locales y no tienen login real: no guardes credenciales en PAD para practicar con ellos.

## Referencias oficiales

- [Build a custom selector](https://learn.microsoft.com/en-us/power-automate/desktop-flows/build-custom-selectors)
- [Test selectors](https://learn.microsoft.com/en-us/power-automate/desktop-flows/test-selectors)
- [Automate using UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements)
- [Browser automation actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/webautomation)
- [UI automation actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/uiautomation)
- [Loops actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/loops)
- [Date time actions reference](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/datetime)
