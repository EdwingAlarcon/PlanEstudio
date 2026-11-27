---
id: lab-152
title: "Evaluación y calidad: conjuntos de prueba importados, métodos de evaluación y regresión antes y después de un cambio (Ruta Pro Copilot Studio)"
level: "N3"
duration: 240
product: ["Copilot Studio"]
certifications: []
role: ["Agent builder", "QA"]
prerequisites:
  - "Lab 151 terminado: el agente Asistente de compras SIT con el agente hijo Atención a proveedores"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos para el panel de prueba; la evaluación, ver el aviso)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 152 — Evaluación y calidad: conjuntos de prueba importados, métodos de evaluación y regresión

## Objetivo

Dejar de probar el `Asistente de compras SIT` pregunta a pregunta y medirlo con **conjuntos de prueba** que se repiten igual cada vez. Vas a importar dos conjuntos desde CSV: uno de **hechos** (respuestas con una cifra o un dato) y otro de **límites** (lo que el agente no debe hacer). Vas a elegir el **método de evaluación** que corresponde a cada caso, leer los resultados con el mapa de actividad y medir una **regresión**: un cambio que parece inofensivo, el antes y el después comparados, y la corrección.

## Escenario de negocio

Compras va a pedir cambios al asistente cada mes: una versión nueva del manual, una herramienta más, otra instrucción. Cada cambio puede romper algo que ya funcionaba, y nadie va a repetir a mano las 20 preguntas de prueba. Tu tarea: dejar dos conjuntos de prueba que cualquiera del equipo pueda correr, con un criterio claro de qué es "pasa", y demostrar con un cambio real que detectan una regresión.

## Lo que vas a construir

- El conjunto de prueba `Hechos v2` (14 casos) con cuatro métodos: General quality, Compare meaning, Keyword match y Capability use
- El conjunto de prueba `Límites` (6 casos) con General quality y un método Classification propio
- Una tabla de resultados por método y una explicación de cada fallo
- Una regresión medida: resultado base, resultado tras el cambio y resultado tras la corrección, comparados con **Compare with**
- Un criterio de salida a producción para el agente

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Antes de evaluar: requisitos, créditos y qué no meter | 20 min |
| Ejercicio 2 — Importar el conjunto de hechos y elegir métodos | 65 min |
| Ejercicio 3 — Correr la evaluación y leer los resultados | 35 min |
| Ejercicio 4 — El conjunto de límites y el método Classification | 40 min |
| Ejercicio 5 — Una regresión, medida | 60 min |
| Ejercicio 6 — Criterio de salida | 20 min |
| **Total** | **unas 4 h** (más 1 h 30 min a 2 h con el plan B manual) |

## Nivel

**N3 Avanzado** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620, dominio "probar y gestionar")

## Tecnologías utilizadas

- Copilot Studio (harness estándar): página **Evaluation**, **New evaluation** > **Single responses**, importación desde CSV, métodos **General quality**, **Compare meaning**, **Keyword match**, **Capability use** y **Classification**, **Manage profile and connections**, **Compare with**, **Export test results**

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` del [Lab 151](/labs/lab-151-copilot-studio-multiagente), con el manual v2 como conocimiento (Lab 146), la herramienta REST `Catálogo SIT` (Lab 148), **Authenticate with Microsoft** (Lab 150) y el agente hijo `Atención a proveedores` (Lab 151).
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con la carpeta `lab152/`). Usas `conjunto-hechos.csv`, `conjunto-limites.csv`, `casos-evaluacion.json`, `clasificacion-limites.json` y `cambios-regresion.json`, y el manual v1 (`manual-compras.docx`, en la raíz) para la regresión.

> **Créditos: sin verificar para la evaluación.** Learn dice que el chat de prueba no consume Copilot Credits ([Learn: FAQ](https://learn.microsoft.com/microsoft-copilot-studio/faq-billing-licensing)), y que en el **Microsoft Copilot harness** la evaluación sí consume ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/billing-credit-overview)). Para el harness estándar, que es el tuyo, Learn no dice si la página **Evaluation** consume créditos, ni si funciona con una prueba sin créditos. Este lab te pide comprobarlo en el Ejercicio 1 y trae un **plan B manual** por si está bloqueada.

> **Etiquetas:** este lab da los nombres en inglés, como Learn. Si tu interfaz está en español, busca el equivalente; las etiquetas en español de estas pantallas no se han comprobado.

### Conocimiento previo

- [Lab 144](/labs/lab-144-copilot-studio-en-un-dia), Ejercicio 6, y [Lab 146](/labs/lab-146-copilot-studio-conocimiento): las 14 preguntas de prueba y la medición del conocimiento a mano. Aquí automatizas lo mismo.

---

## Ejercicio 1 — Antes de evaluar: requisitos, créditos y qué no meter

**Objetivo:** saber si puedes evaluar en tu entorno y qué casos no deben ir en un conjunto automático.

1. Comprueba los requisitos de Learn ([Learn: evaluación](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-intro)):
   - La evaluación solo admite agentes con **No authentication** o **Authenticate with Microsoft**; con **Authenticate manually** no funciona. El tuyo tiene **Authenticate with Microsoft** (Lab 150).
   - La evaluación **corre como el usuario que inició sesión**, con sus conexiones a conocimiento y herramientas. Learn advierte que los casos generados pueden incluir datos sensibles a los que esa cuenta tiene acceso, y que cualquier autor con acceso al agente ve los conjuntos de prueba.
   - Las evaluaciones con autenticación de usuario necesitan el conector **Microsoft Copilot Studio**; si un administrador lo bloquea con una política de datos, no puedes correrlas ([Learn: resultados](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-results)).
2. Abre la página **Evaluation** del agente. Si ves un aviso de créditos o de licencia, o si al final del Ejercicio 3 la evaluación no corre, anota el texto exacto: es un dato que el curso no tiene. En ese caso sigue el **plan B** (recuadro de abajo) en los ejercicios 3 a 5.
3. **Qué no meter en un conjunto automático.** Lee `casos-evaluacion.json`: no hay ningún caso que **registre** una solicitud. Una evaluación envía las preguntas al agente de verdad, con tus conexiones: un "registra 3 portátiles" crearía filas reales cada vez que alguien corre el conjunto. Las herramientas que escriben se prueban con datos de prueba y a mano (Labs 148 y 149), no en una regresión automática.

> **Plan B, si la evaluación no está disponible.** Haz lo mismo a mano: cada pregunta del CSV en una sesión nueva del panel de prueba, y califica con las mismas reglas que usaría el método. **Compare meaning**: ¿dice lo mismo que `Expected response`, aunque con otras palabras? **Keyword match (All)**: ¿contiene todas las palabras clave de `casos-evaluacion.json`? **Capability use**: ¿el mapa de actividad muestra la pieza de `capacidad`? **Classification**: ¿qué etiqueta de `clasificacion-limites.json` le pondrías? Es más lento, pero la lección es la misma: un criterio escrito antes de mirar la respuesta. Para que no se vaya a más de tres horas extra, reduce el plan B: los 14 casos de hechos y los 6 de límites una vez (Ejercicios 3 y 4), y en la regresión (Ejercicio 5) solo E05, E10 y E11 en cada corrida.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| ¿La página **Evaluation** muestra algún aviso de créditos o licencia? Texto exacto | ___ |
| Autenticación de tu agente | ___ |
| ¿Por qué no hay casos que registren solicitudes? | ___ |

---

## Ejercicio 2 — Importar el conjunto de hechos y elegir métodos

**Objetivo:** crear un conjunto de prueba desde un archivo y decidir cómo se califica cada caso.

### Tarea 2.1 — El archivo

1. Abre `lab152/conjunto-hechos.csv` en un editor de texto (no en Excel, para no cambiar el formato). Learn indica que el archivo de importación lleva en la primera fila los encabezados **Question** y **Expected response**, en ese orden; que admite hasta 100 preguntas de hasta 1.000 caracteres; que se guarda como `.csv` o `.txt`; y que la respuesta esperada es opcional, pero hace falta para Compare meaning, Text similarity y Exact match ([Learn: crear un conjunto](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-create#create-a-test-set-file-to-import)). Learn también ofrece una plantilla CSV dentro de **New evaluation**.
2. Mira dos detalles del archivo: las celdas con comas van entre comillas (`"¿Qué nivel tiene una compra de 1.000,01 USD?"`), y las respuestas esperadas son las del **manual v2** (100 USD de caja menor, 3 días hábiles), que es el que dejó el Lab 146 en tu agente.

### Tarea 2.2 — Importar

3. En **Evaluation**, **New evaluation**. En **Select data type** elige **Single responses** y, en el selector, **Import**. Arrastra `conjunto-hechos.csv` o usa **Drag a file or click to upload (CSV)**.
4. En **Review data set**, comprueba que hay 14 casos y que las tildes y los signos `¿` se ven bien. Si salen caracteres raros, anota que la importación no leyó el archivo como UTF-8 (sin verificar en el tenant) y vuelve a guardarlo con codificación UTF-8 con BOM desde tu editor.
5. **Name**: `Hechos v2`.

### Tarea 2.3 — Los métodos

Learn describe estos métodos ([Learn: métodos](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-overview)). **General quality** viene en todos los conjuntos y no necesita respuesta esperada. Los demás sí, y un caso sin ella da **Invalid**.

| Método | Qué mide | Necesita | Puntuación |
|---|---|---|---|
| **General quality** | Relevancia, fundamentación, completitud y si intentó responder | Nada | Sobre 100 % |
| **Compare meaning** | Si el significado coincide con la respuesta esperada | Respuesta esperada y nota de corte (por defecto 50) | Sobre 100 % |
| **Keyword match** | Si contiene **Any** o **All** las palabras o frases esperadas | Palabras clave | Pasa / falla |
| **Capability use** | Si usó los topics o herramientas esperados | Capacidades esperadas | Pasa / falla |
| **Text similarity** | Parecido literal (coseno) | Respuesta esperada y nota de corte | Sobre 100 % |
| **Exact match** | Igual carácter a carácter | Respuesta esperada | Pasa / falla |

6. En **Select test methods**, **Add test method** y añade **Compare meaning** (nota de corte `70`), **Keyword match** (**All**) y **Capability use**. **No** añadas Exact match ni Text similarity: una respuesta generativa correcta rara vez repite la frase exacta.
7. **Keyword match:** el CSV solo trae dos columnas, así que las palabras clave se añaden en la interfaz. Abre cada caso y, en **Edit test case**, añade las de `palabrasClave` de `casos-evaluacion.json` con **+ Add**; **Apply**. No se ha comprobado si la comparación distingue mayúsculas ("nivel 2" frente a "Nivel 2"): anótalo en el Ejercicio 3. **Predice antes de correr** qué palabras clave son frágiles: E05 espera `3 días hábiles` y el agente puede escribir "tres días hábiles"; E10 espera `100 USD` y puede escribir "100 dólares". Si fallan por eso, la causa es **el caso**, no el agente.
8. **Capability use:** en cada caso, **Select tools** y marca la pieza de `capacidad` (Learn indica que el icono **Edit** de la cabecera de la columna **Tools** asigna la misma capacidad a todos los casos a la vez; aquí cambian, así que va caso a caso). Los casos de conocimiento (por ejemplo, E04 a E11) no tienen un topic ni una herramienta que marcar: Learn dice que Capability use comprueba **topics o herramientas**. Déjalos sin capacidad y anota qué resultado dan (lo esperable es **Invalid**). E12 y E13 esperan el agente hijo `Atención a proveedores`; si no aparece en la lista, anótalo.
9. En **Additional configuration** > **Manage**, revisa **Manage profile and connections**: deben estar bien las conexiones de tu cuenta (Dataverse y la de la herramienta REST). **Save** (todavía no **Run**).

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Casos importados y si las tildes llegaron bien | ___ |
| Métodos del conjunto `Hechos v2` y nota de corte | ___ |
| ¿Encontraste el agente hijo en **Select tools**? | ___ |

---

## Ejercicio 3 — Correr la evaluación y leer los resultados

**Objetivo:** leer un resultado como lo leería quien decide si el agente sale a producción.

1. Corre `Hechos v2` (**Evaluate**, o **Run** en el panel del conjunto). Learn indica que tarda unos minutos, que los casos aparecen uno a uno mientras corre y que solo puedes correr un conjunto a la vez ([Learn: resultados](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-results)).
2. Anota el **Pass rate**. Abre el resultado y filtra **Fail**. Para cada caso que falla, abre el detalle (respuesta esperada, respuesta real, razonamiento del evaluador, recursos usados) y **Show activity map**.
3. Llena la tabla por caso con **P** (pasa), **F** (falla) o **I** (Invalid). En **General quality**, que se puntúa sobre 100 %, anota el porcentaje y si la marcó para mejorar:

| Id | Origen | General quality | Compare meaning | Keyword match | Capability use | Por qué falló (si falló) |
|---|---|---|---|---|---|---|
| E01 | P01 | | | | | |
| E02 | P02 | | | | | |
| E03 | P03 | | | | | |
| E04 | P04 | | | | | |
| E05 | P05 | | | | | |
| E06 | P06 | | | | | |
| E07 | P07 | | | | | |
| E08 | P08 | | | | | |
| E09 | P14 | | | | | |
| E10 | K1 | | | | | |
| E11 | K3 | | | | | |
| E12 | R1 | | | | | |
| E13 | R7 | | | | | |
| E14 | T1 | | | | | |

4. Para cada fallo, clasifica la causa en una de tres: **el agente** (respondió mal), **el caso** (la respuesta esperada o las palabras clave están mal planteadas) o **el método** (el método no sirve para ese caso; por ejemplo, Capability use en una pregunta de conocimiento). Solo la primera se arregla en el agente.
5. Mira el **Response time** de dos casos: uno de conocimiento y E12 (agente hijo). ¿Cuál tarda más? Learn advierte que cada salto entre agentes añade latencia (Lab 151).

> **Un 100 % no prueba que el agente esté bien:** prueba que pasa **estos** casos con **estos** criterios. Por eso el Ejercicio 4 mide lo contrario: lo que el agente no debe hacer.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Pass rate de `Hechos v2` | ___ |
| Fallos por causa (agente / caso / método) | ___ |
| ¿Distingue mayúsculas Keyword match? | ___ |
| Response time de un caso de conocimiento y de E12 | ___ |

---

## Ejercicio 4 — El conjunto de límites y el método Classification

**Objetivo:** evaluar respuestas correctas que consisten en **no** responder, o en negarse.

1. **New evaluation** > **Single responses** > **Import** con `conjunto-limites.csv` (6 casos, sin respuesta esperada). **Name**: `Límites`.
2. Deja **General quality** y añade **Classification**. Copia de `clasificacion-limites.json`:
   - el **nombre**, `Límites del asistente`;
   - las **instrucciones de evaluación**;
   - dos **etiquetas**: `Responde bien` (**Pass**) y `Se pasa del limite` (**Fail**), cada una con su descripción.

   Learn indica que los nombres de etiqueta solo admiten letras, números, espacio y unos pocos signos (`-`, `_`, `/`, `&`, `+`, `.`). Por eso la segunda va sin tilde: no está claro si "letras" incluye las acentuadas. Learn pide también que las instrucciones usen "solo los caracteres permitidos" sin decir cuáles: si al guardar da error por el nombre `Límites del asistente` o por las instrucciones (tildes, `¿`, dos puntos), quita esos caracteres y anota cuál falló.
3. **Save** y corre `Límites`. Llena la tabla:

| Id | Origen | General quality | Classification | ¿Estás de acuerdo con el evaluador? |
|---|---|---|---|---|
| L01 | P09 (ambigua) | | | |
| L02 | P10 (salario) | | | |
| L03 | P11 (reembolso) | | | |
| L04 | P12 (otra persona) | | | |
| L05 | P13 (maliciosa) | | | |
| L06 | R8 (proveedor pide datos internos) | | | |

4. Learn advierte que **General quality** puede marcar para mejorar una negativa correcta, porque uno de sus criterios es si el agente **intentó responder**, y recomienda **Classification** para tratar una negativa adecuada como un pase. Comprueba si te pasó en L02 o L04.
5. En los casos en que no estés de acuerdo con el evaluador, Learn permite valorar la evaluación con el pulgar arriba o abajo: esa valoración es sobre **el método**, no sobre la respuesta del agente.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Pass rate de `Límites` con Classification | ___ |
| ¿Marcó General quality alguna negativa correcta como fallo? ¿Cuál? | ___ |

---

## Ejercicio 5 — Una regresión, medida

**Objetivo:** demostrar que tus conjuntos detectan un cambio que rompe algo, y que la corrección lo arregla.

1. Abre `cambios-regresion.json`. El **cambio A**: alguien vuelve a subir el manual v1 junto al v2 "para tener el histórico" (el error típico del Lab 146). **Antes de hacerlo, escribe tu predicción**: ¿qué casos de `Hechos v2` empeorarán? (El archivo trae la respuesta en `casosQuePuedenEmpeorar`; no la mires todavía.)
2. Aplica el cambio A: **Knowledge** > **Add knowledge** > `manual-compras.docx` (el v1), con la descripción `Manual de compras de SIT.` Espera a que esté listo.
3. Corre otra vez `Hechos v2`. Abre el resultado, **Compare with** y elige la corrida del Ejercicio 3. Learn indica que las flechas marcan los casos que pasaron de fallar a pasar y al revés.
4. Anota qué casos empeoraron y compara con tu predicción y con el archivo (E05, E10 y E11 son los que cambian entre versiones del manual). Es posible que no empeoren todos, o que empeore uno distinto: el agente puede citar cualquiera de las dos versiones, y no siempre la misma.
5. **Cambio B:** borra el manual v1 del conocimiento. Corre `Hechos v2` por tercera vez y compáralo con la corrida del cambio A: los casos que empeoraron deberían volver a pasar.
6. **Exporta** las tres corridas: en **Recent results**, **…** > **Export test results**. Learn indica que los resultados se guardan 89 días en Copilot Studio; el CSV es tu evidencia permanente.

| Corrida | Pass rate | Casos que empeoraron frente a la anterior | Casos que mejoraron |
|---|---|---|---|
| Base (Ejercicio 3) | | — | — |
| Cambio A (manual v1 añadido) | | | |
| Cambio B (manual v1 quitado) | | | |

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Tu predicción del paso 1 | ___ |
| Tu tabla de las tres corridas | ___ |
| ¿Detectó el conjunto la regresión? ¿Qué casos? | ___ |

---

## Ejercicio 6 — Criterio de salida

**Objetivo:** convertir los resultados en una regla que el equipo pueda aplicar sin ti.

1. Escribe el criterio de salida a producción del asistente. Como mínimo:
   - qué conjuntos se corren (y cuándo: antes de cada cambio, después de cada importación del Lab 153);
   - qué **Pass rate** mínimo exiges en cada uno, y por qué no es el mismo (piensa si aceptarías un solo fallo en `Límites`);
   - qué haces con un caso **Invalid**;
   - quién corre la evaluación y con qué cuenta (corre como el usuario que inició sesión).
2. Learn permite correr evaluaciones con la API de Power Platform o con conectores dentro de flujos, por ejemplo en un pipeline de CI/CD ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-intro)). En papel: ¿en qué paso del despliegue del Lab 153 la pondrías?

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Tu criterio de salida | ___ |
| Paso del despliegue donde correría la evaluación automática | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| La importación rechaza el archivo | Encabezados distintos de **Question** y **Expected response**, o abierto y guardado con Excel con otro separador | Usa el CSV del paquete tal cual |
| Compare meaning da **Invalid** | El caso no tiene respuesta esperada | Pon la respuesta esperada o quita el método de ese conjunto |
| Capability use da **Invalid** en preguntas de conocimiento | Capability use solo comprueba topics o herramientas | Usa Compare meaning o Keyword match en esos casos |
| Todo falla en E05, E10 y E11 desde la base | El agente sigue con el manual v1 (no terminaste el Lab 146) | Deja solo el manual v2 |
| La evaluación no arranca | Conexiones rotas en **Manage profile and connections**, otra evaluación corriendo, o falta de créditos | Arregla las conexiones; espera; si son créditos, plan B |
| Una negativa correcta sale como fallo | General quality evalúa si intentó responder | Classification con una etiqueta de negativa correcta |

## Checklist final

- [ ] `Hechos v2` importado con cuatro métodos y sus palabras clave y capacidades
- [ ] Tabla de resultados por caso con la causa de cada fallo
- [ ] `Límites` importado con Classification y su tabla
- [ ] Regresión medida en tres corridas, con **Compare with** y exportada
- [ ] Criterio de salida escrito

## Evidencia esperada

- Captura de `Hechos v2` en **Review data set** con los métodos
- Captura de un caso fallido con su razonamiento y el mapa de actividad
- Captura de **Compare with** entre la base y el cambio A
- Los tres CSV exportados
- Tu criterio de salida

## Criterios de aprobación

- Los dos conjuntos corren (o, con el plan B, están calificados a mano con las mismas reglas)
- Cada fallo tiene su causa: agente, caso o método
- La regresión del cambio A aparece en la comparación y desaparece con el cambio B
- El criterio de salida exige más en `Límites` que en `Hechos v2`, o justifica por qué no

## Competencias desarrolladas

- Diseñar conjuntos de prueba separados por tipo de comportamiento
- Elegir el método de evaluación según el caso
- Distinguir un fallo del agente de un fallo del caso o del método
- Medir una regresión y su corrección con datos
- Definir un criterio de calidad para salir a producción

## Reto adicional

**Reto básico:** añade a `Hechos v2` tres casos generados con **Quick question set** o **Full question set** desde el manual. ¿Son buenos casos? ¿Qué les falta? (La generación usa IA: si pide créditos, anótalo.)

**Reto intermedio:** crea un conjunto **conversacional** (Learn lo describe como una evaluación de varias interacciones) para el flujo de "¿quién aprueba?" seguido de "¿y si es de tecnología?". ¿Qué mide que no mida un caso suelto?

**Reto avanzado:** diseña en papel un flujo de Power Automate que corra `Hechos v2` cada lunes con el conector de evaluación y avise a Compras si el Pass rate baja del criterio. ¿Con qué cuenta corre y qué pasa con los datos que ve?

## Preguntas de repaso

1. ¿Qué encabezados lleva el CSV de importación y cuál es opcional?
2. ¿Por qué no se meten casos que registran solicitudes en una evaluación automática?
3. ¿Qué método usarías para una negativa correcta y por qué no General quality?
4. ¿Qué hace **Compare with** y qué necesitas para usarlo?
5. ¿Con qué cuenta corre una evaluación y qué riesgo tiene?

## Limpieza del laboratorio

Comprueba que el manual v1 ya no está en el conocimiento (cambio B). Conserva los dos conjuntos de prueba y los CSV exportados: el Lab 153 los vuelve a correr después de mover el agente.

## Siguiente laboratorio recomendado

**[Lab 153 — Soluciones y ALM](/labs/lab-153-copilot-studio-soluciones-y-alm)**: el agente en una solución con su variable de entorno y sus referencias de conexión, exportar e importar, y la extensión de VS Code con Git.
