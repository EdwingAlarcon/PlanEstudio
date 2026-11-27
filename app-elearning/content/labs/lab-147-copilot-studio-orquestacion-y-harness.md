---
id: lab-147
title: "Orquestación generativa y elección de harness: descripciones, varias intenciones y decisiones de diseño (Ruta Pro Copilot Studio)"
level: "N3"
duration: 225
product: ["Copilot Studio"]
certifications: []
role: ["Agent builder", "Solution Architect"]
prerequisites:
  - "Labs 144 y 145 terminados (el agente con el topic de nivel, la herramienta de registro y el topic Revisar compra); Lab 146 recomendado"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 147 — Orquestación generativa y elección de harness

## Objetivo

Entender, y poder explicar con evidencia, **por qué** el `Asistente de compras SIT` elige una pieza y no otra. Vas a leer el **mapa de actividad** paso a paso y a estropear las descripciones a propósito para medir el efecto. También vas a probar mensajes con **varias intenciones**, a enfrentar una instrucción con una herramienta y a decidir, con la comparación de Learn, qué **harness** conviene en seis escenarios. Al final escribes el registro de decisión del harness de tu propio agente.

## Escenario de negocio

El asistente ya tiene conocimiento, dos topics y una herramienta. A veces responde con el manual cuando debería registrar, y otras registra cuando solo le preguntaban. La gerencia pregunta además si no conviene "pasarlo al Copilot nuevo", el Microsoft Copilot harness. Necesitas una respuesta que se sostenga en una reunión: qué decide la orquestación, cómo se corrige y por qué el harness elegido es el correcto, o cuándo dejaría de serlo.

## Lo que vas a construir

- Un registro de seis mensajes con lo que eligió el agente, con descripciones buenas y con descripciones malas
- La prueba de un mensaje con dos intenciones y de uno ambiguo
- Una instrucción que restringe una herramienta, medida antes y después
- La decisión de harness para seis escenarios y el registro de decisión del `Asistente de compras SIT`

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Leer el mapa de actividad | 35 min |
| Ejercicio 2 — Estropear las descripciones | 65 min |
| Ejercicio 3 — Varias intenciones, ambigüedad y una trampa | 45 min |
| Ejercicio 4 — Instrucciones contra herramientas | 30 min |
| Ejercicio 5 — Elegir harness | 55 min |
| Ejercicio 6 — El registro de decisión | 30 min |
| **Total** | **unas 4 h 15 min** |

## Nivel

**N3 Avanzado** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620: planificar y configurar, probar y gestionar)

## Tecnologías utilizadas

- Copilot Studio (harness estándar con orquestación generativa): descripciones de topics, herramientas y conocimiento, instrucciones, mapa de actividad, mensajes con varias intenciones
- Comparación de harnesses de Learn: harness estándar, Microsoft Copilot harness y Customer Conversation harness

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` de los [Labs 144](/labs/lab-144-copilot-studio-en-un-dia) y [145](/labs/lab-145-copilot-studio-topics-a-fondo): los topics `Calcular nivel de aprobación` y `Revisar compra`, la herramienta `Registrar solicitud de compra` y el manual como conocimiento
- [ ] **Si hiciste el Lab 146**, el agente tiene tres fuentes: `manual-compras-v2.docx`, la documentación de Learn y la tabla de Dataverse. En el Ejercicio 2 solo tocas el manual (la versión 2). Las otras dos déjalas, pero anota si aparecen en O2, O4 y O6
- [ ] **Este lab crea filas reales.** O2 y O4 registran solicitudes, y los repites varias veces. Si el flujo `SC - Aprobar solicitud` del Lab 128 sigue activo, apágalo mientras dure el lab; al final borra las filas de prueba (Limpieza)
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) con la carpeta `lab147/`: `descripciones.json`, `mensajes-orquestacion.json` y `escenarios-harness.json`

### Conocimiento previo

- [Módulo 22](/nivel/avanzado/modulo/copilot-studio-avanzado): el Microsoft Copilot harness, sus piezas y su tabla de diferencias con el harness estándar

---

## Ejercicio 1 — Leer el mapa de actividad

**Objetivo:** saber qué muestra el mapa y qué no, antes de usarlo como prueba.

1. En sesiones nuevas, haz O1, O2 y O3 de `lab147/mensajes-orquestacion.json`.
2. En cada una, abre el **mapa de actividad**. Learn indica que el mapa marca errores, como parámetros de entrada o de salida que faltan o no son válidos, y muestra cuánto tarda cada paso. Al seleccionar un nodo se ven sus entradas, las decisiones y las salidas ([Learn: revisar la actividad](https://learn.microsoft.com/microsoft-copilot-studio/authoring-review-activity)).
3. Para O2 (registrar dos monitores), anota qué entradas recibió la herramienta y cuánto tardó.

> **Lo que el mapa enseña y lo que no:** activa **Track between topics** en el panel de prueba. Learn indica que, con el seguimiento activado, el mapa muestra los nodos de dentro del topic a medida que se ejecutan; así ves `Calcular nivel de aprobación` dentro de `Revisar compra`. Lo que **no** aparece son las actividades de orquestación generativa dentro de un topic, como las preguntas que genera el agente para rellenar una entrada. Para eso, usa el panel **Variables**. Learn también describe una opción **Show rationale**, que explica por qué se llamó a una herramienta, y advierte que esa explicación puede no ser exacta: úsala como pista, no como prueba ([Learn: revisar la actividad](https://learn.microsoft.com/microsoft-copilot-studio/authoring-review-activity)).

### Validación del Ejercicio 1

| Id | Pieza que eligió | Entradas que recibió (si es herramienta o topic) | Tiempo del paso |
|---|---|---|---|
| O1 | ___ | ___ | ___ |
| O2 | ___ | ___ | ___ |
| O3 | ___ | ___ | ___ |

---

## Ejercicio 2 — Estropear las descripciones

**Objetivo:** medir cuánto pesan las descripciones en la elección. Learn las señala como el factor más importante.

1. **Antes de tocar nada**, copia en tu evidencia las descripciones actuales: están también en `descripciones.json`, en el bloque `buenas`.
2. **Aísla el experimento.** Tus instrucciones del Lab 144 nombran el topic y la herramienta en texto ("usa el tema Calcular nivel de aprobación", "usa la herramienta de registro"). Si renombras las piezas, esas líneas seguirían guiando por el nombre viejo. Copia las instrucciones y **quita esas dos líneas** durante la ronda mala.
3. Cambia los nombres y las descripciones por los del bloque `malas`:
   - el topic `Calcular nivel de aprobación` pasa a llamarse `Nivel`, con la descripción `Tema de niveles.`;
   - la herramienta, `Flujo 1`: `Hace cosas con solicitudes.`;
   - el manual (la versión 2, si hiciste el Lab 146): descripción `Documento.` y, si la interfaz deja cambiar el nombre de la fuente, `Documento` (no lo hemos comprobado).

   **Save** en cada uno.
4. Haz los seis mensajes (O1 a O6) en sesiones nuevas y anota qué eligió el agente en cada uno.
5. **Restaura** los nombres, las descripciones buenas y las dos líneas de las instrucciones. Comprueba que el Redirect de `Revisar compra` sigue apuntando a `Calcular nivel de aprobación` (Learn indica que cada topic tiene un identificador interno, así que lo esperable es que el renombrado no lo rompa, pero no está comprobado). Repite los seis.
6. Compara las dos rondas. Learn recomienda, entre otras cosas ([Learn: orquestación generativa](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)):
   - resumir en una o dos frases;
   - usar voz activa y presente;
   - poner un nombre descriptivo y único, en una frase corta;
   - usar un lenguaje específico que evite la ambigüedad entre topics y herramientas parecidos.

   Escribe qué regla incumplía cada descripción mala. **Ojo:** la descripción "buena" de la herramienta tiene tres frases, así que también incumple la primera regla. Reescríbela en dos y mide si cambia algo.

   **Lo que no debería cambiar:** la descripción del manual. Learn indica que la orquestación filtra las fuentes de conocimiento con un modelo cuando hay más de 25, y que los archivos subidos no cuentan para ese límite. Con una a tres fuentes, `Documento.` apenas debería notarse en O3 y O6. Si lo notas, anótalo: sería un hallazgo.

> **Si el topic `Revisar compra` del Lab 145 interfiere** (O1 se va a él), es otra prueba de lo mismo: dos descripciones parecidas compiten. Anota qué palabra de la descripción lo atrajo.

### Validación del Ejercicio 2

| Id | Con descripciones malas | Con descripciones buenas |
|---|---|---|
| O1 a O6 | ___ | ___ |
| Aciertos (de 6) | ___ | ___ |

---

## Ejercicio 3 — Varias intenciones, ambigüedad y una trampa

**Objetivo:** probar los casos en los que la orquestación se gana el sueldo o se equivoca.

1. **Varias intenciones (O4):** "¿Quién aprueba una compra de 4200 USD? Y regístramela: 3 portátiles para TI, categoría Tecnología, a 1400 USD cada uno". Learn indica que la orquestación generativa puede elegir **una o más** herramientas, topics, agentes o fuentes para una consulta, incluidas las de varias intenciones, y llamarlas en secuencia ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)). Learn añade que las llama después de generar las preguntas para la información que falta, así que el correo te lo debería pedir **antes** de la primera pieza. En el mapa, ¿se llamaron las dos piezas? ¿En qué orden? **Si el mensaje lo atrapa `Revisar compra`** (pide categoría, código PRV y área, y O4 no trae proveedor), abre una sesión nueva para salir y anótalo como resultado: es otra prueba de descripciones que compiten.
2. **Ambigüedad (O5):** escribe solo `1500`. ¿Pidió aclaración, lo tomó como importe o hizo otra cosa? Learn indica que, con orquestación generativa, el topic de sistema **Multiple Topics Matched** no se llama, y advierte que el agente puede no distinguir bien entre topics parecidos: cuando las descripciones se solapan, la elección es impredecible.
3. **La trampa (O6):** "¿Cómo se registra una compra en SIT?". Pregunta por el procedimiento (lo responde el manual), pero contiene la palabra "registra". Si llamó a la herramienta, revisa su descripción: dice "Úsala solo cuando el usuario pida crear o registrar una solicitud". ¿Cómo la harías más precisa?

> **Si O4 creó la fila sin pedirte confirmación,** ya lo sabías desde el Lab 144: el Lab 149 añade la confirmación. Aquí lo que mides es si la orquestación encadena las dos piezas.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Piezas que llamó en O4 y en qué orden | ___ |
| Qué hizo con O5 | ___ |
| ¿O6 llamó a la herramienta? Descripción corregida, si hizo falta | ___ |

---

## Ejercicio 4 — Instrucciones contra herramientas

**Objetivo:** comprobar si una instrucción puede limitar el uso de una herramienta, y hasta dónde llega.

1. En **Instructions**, agrega: `Nunca registres solicitudes de la categoría Viajes: responde que los viajes se piden a la agencia de viajes de SIT.` **Save**.
2. En una sesión nueva: `Registra una solicitud: 2 tiquetes nacionales para Comercial, categoría Viajes, a 240 USD cada uno; mi correo es` + tu correo. ¿Llamó a la herramienta? Mira el mapa.
3. Repite tres veces, con otras palabras (por ejemplo, "es un viaje de trabajo" sin decir la categoría). Anota cuántas veces respetó la instrucción.
4. **Quita la instrucción** al terminar.

> **La conclusión que se espera:** una instrucción orienta al orquestador, pero no es un control. Si una regla de negocio tiene que cumplirse siempre, va donde no depende del modelo: una validación dentro del flujo (Lab 148) o un permiso. Learn también recuerda que las instrucciones no deben alterar el formato ni el comportamiento de las citas del sistema. Pedir que el agente cite (como hace tu instrucción del Lab 144) no es lo mismo: Learn recomienda incluir siempre una cita en el texto. Lo prohibido es intentar cambiar cómo se muestran.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Veces que respetó la instrucción (de 4 intentos) | ___ |
| Dónde pondrías la regla para que se cumpla siempre | ___ |

---

## Ejercicio 5 — Elegir harness

**Objetivo:** decidir el harness con la comparación de Learn, no por moda. El harness se elige al crear el agente. Un agente del Microsoft Copilot harness no puede pasar al estándar. Lo contrario existe en versión preliminar: Learn describe una actualización que **crea una copia** en el Microsoft Copilot harness y lleva las instrucciones, las herramientas y las indicaciones sugeridas. No migra el conocimiento, Power Fx ni los agentes hijos, y consume créditos ([Learn: actualizar al Microsoft Copilot harness](https://learn.microsoft.com/microsoft-copilot-studio/upgrade-to-microsoft-copilot-from-standard-harness)).

1. Learn documenta tres harnesses ([Learn: harnesses](https://learn.microsoft.com/microsoft-copilot-studio/harnesses-overview)):
   - el **harness estándar**, el de esta ruta;
   - el **Microsoft Copilot harness**, el del Módulo 22, que algunas páginas de Learn todavía llaman "GitHub Copilot harness";
   - el **Customer Conversation harness**, para atender a clientes por chat o voz.

   La tabla que los compara fila a fila ([Learn: Microsoft Copilot harness](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/overview)) dice, entre otras cosas:

| Capacidad | Harness estándar | Microsoft Copilot harness |
|---|---|---|
| Topics | Admitidos | Sustituidos por Hooks (Learn lo marca como admitido, con esa nota) |
| Entidades personalizadas | Admitidas | No admitidas |
| Autenticación manual | Admitida | No admitida |
| Canales SharePoint y WhatsApp | Admitidos | No admitidos |
| Canal Dynamics 365 Contact Center | Admitido | No admitido |
| Azure AI Search | Admitido | No admitido |
| Skills | No admitidos | Admitidos |
| Memory | No admitida | Admitida |

   Y sobre el coste: según Learn, el Microsoft Copilot harness puede consumir créditos al usar, construir, probar y evaluar el agente, y el Customer Conversation harness también usa créditos. En el estándar, el panel de prueba no consume créditos (Lab 144). Skills y Memory no existen en el estándar; el Customer Conversation harness también los admite, aunque no es su foco.

   **WhatsApp hoy:** Learn indica que, desde el 23 de octubre de 2026, ya no se pueden crear conexiones nuevas de WhatsApp por la vía de Azure Communication Services, sin importar cuándo se creó el agente. Una conexión nueva pasa por Dynamics 365 Contact Center o por un partner ([Learn: WhatsApp](https://learn.microsoft.com/microsoft-copilot-studio/publication-add-bot-to-whatsapp)). Tenlo en cuenta en H4.

2. Abre `lab147/escenarios-harness.json` y **tapa** los campos `harness` y `razon`. Para cada uno de los seis escenarios (H1 a H6), escribe tu decisión y la fila de la tabla, o la característica, que la justifica.
3. Compara con el archivo. En H2 y H6, la razón del archivo dice qué otra respuesta es defendible y con qué argumento: si elegiste esa y la justificaste, cuenta como acierto. Si fallaste alguno, anota qué te confundió.

### Validación del Ejercicio 5

| Id | Tu harness | Tu razón | ¿Coincide? |
|---|---|---|---|
| H1 a H6 | ___ | ___ | ___ |

---

## Ejercicio 6 — El registro de decisión

**Objetivo:** dejar por escrito, para otra persona, por qué el `Asistente de compras SIT` usa el harness estándar.

Escribe un registro de decisión (una página como máximo) con:

1. **Contexto:** qué hace el agente y para quién.
2. **Decisión:** harness estándar con orquestación generativa.
3. **Razones, con evidencia de esta ruta:** entidades propias (Lab 145), coste de prueba sin créditos (Lab 144), lo que la orquestación hace bien y mal (Ejercicios 2 a 4).
4. **Qué perdemos:** Skills, Memory y lo demás que la tabla da a otros harnesses y no al estándar.
5. **Cuándo revisaríamos la decisión:** por ejemplo, si el agente tuviera que razonar sobre correos y archivos de Microsoft 365, o si la empresa comprara créditos y quisiera Memory. Si algún día se decide cambiar, recuerda que la actualización crea una copia y no migra el conocimiento ni Power Fx. Escribe al menos dos condiciones concretas.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Dos condiciones que te harían revisar la decisión | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El agente elige el conocimiento cuando debía registrar | Descripción de la herramienta vaga o genérica | Ejercicio 2 y las recomendaciones de Learn |
| Registra cuando solo le preguntaban por el procedimiento | La descripción de la herramienta reacciona a la palabra "registrar" | Ejercicio 3, paso 3 |
| Dos topics se pisan | Descripciones parecidas ("revisar compra" y "calcular nivel") | Lenguaje específico que los distinga |
| No ves qué pasó dentro de un topic | El mapa no muestra la orquestación dentro de los topics | Panel **Variables** y mensajes de prueba |
| Una regla de las instrucciones no se cumple siempre | Las instrucciones orientan, no obligan | Validación en el flujo o permisos (Lab 148) |

## Checklist final

- [ ] Registro de O1 a O6 con descripciones malas y buenas, y las descripciones buenas restauradas
- [ ] O4, O5 y O6 analizados con el mapa de actividad
- [ ] Prueba de la instrucción de Viajes y la instrucción retirada
- [ ] Decisión de harness para H1 a H6
- [ ] Registro de decisión del harness del agente

## Evidencia esperada

- Tus tablas de los Ejercicios 1 a 5
- Captura del mapa de actividad de O4
- El registro de decisión

## Criterios de aprobación

- Las descripciones buenas aciertan más que las malas, y explicas por qué con las reglas de Learn
- Sabes qué muestra y qué no muestra el mapa de actividad
- Justificas al menos cinco de los seis escenarios con una fila de la comparación de Learn
- El registro de decisión incluye qué se pierde y cuándo se revisaría

## Competencias desarrolladas

- Diagnosticar por qué un agente elige una pieza, con el mapa de actividad
- Escribir descripciones que guían la orquestación generativa
- Distinguir lo que orienta (instrucciones) de lo que obliga (validaciones y permisos)
- Elegir y defender el harness de un agente

## Reto adicional

**Reto básico:** cambia la descripción de `Revisar compra` para que no compita con `Calcular nivel de aprobación` y mide O1 otra vez.

**Reto intermedio:** escribe un mensaje con tres intenciones (una pregunta de política, un cálculo de nivel y un registro) y anota cuántas piezas encadenó el agente.

**Reto avanzado:** si tu organización tiene créditos de Copilot Studio, crea un agente de prueba en el Microsoft Copilot harness con las mismas instrucciones y el mismo manual, hazle P01 a P14 y compara. Sin créditos, haz la variante en papel: indica qué piezas del Asistente no podrías llevar a ese harness según la tabla de Learn.

## Preguntas de repaso

1. Según Learn, ¿cuál es el factor más importante para que el orquestador elija una pieza?
2. ¿Qué no aparece en el mapa de actividad?
3. ¿Por qué una instrucción no basta para hacer cumplir una regla de negocio?
4. Nombra tres capacidades que decidirían usar el harness estándar y dos que decidirían usar el Microsoft Copilot harness.

## Limpieza del laboratorio

Comprueba que dejaste las descripciones buenas, que restauraste las dos líneas de las instrucciones y que quitaste la instrucción de Viajes. Borra las filas de prueba que crearon O2, O4 y el caso de Viajes en `Solicitudes de compra`, y vuelve a encender `SC - Aprobar solicitud` si lo apagaste. El Lab 148 parte de este agente.

## Siguiente laboratorio recomendado

**Lab 148 — Tools** (en preparación): agent flow con validación que crea la solicitud, conectores y una API REST/OpenAPI sobre el catálogo de SIT.
