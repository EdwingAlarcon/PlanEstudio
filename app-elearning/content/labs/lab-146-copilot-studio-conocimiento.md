---
id: lab-146
title: "Conocimiento que responde bien: versiones, fuentes web y Dataverse, moderación y medición (Ruta Pro Copilot Studio)"
level: "N2"
duration: 240
product: ["Copilot Studio", "Dataverse"]
certifications: []
role: ["Agent builder", "Maker"]
prerequisites:
  - "Lab 144 terminado (el agente con el manual como conocimiento); Lab 145 recomendado"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos) y Dataverse search activada"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 146 — Conocimiento que responde bien: versiones, fuentes web y Dataverse, moderación y medición

## Objetivo

Hacer que el conocimiento del `Asistente de compras SIT` responda bien y poder **demostrarlo con cifras**. Vas a medir una línea base y a descubrir qué pasa cuando el manual cambia de versión. También vas a añadir una fuente web y la tabla de Dataverse, con sus requisitos, y a revisar la moderación. Al final decides, con datos, qué fuentes dejas.

## Escenario de negocio

Compras publica la **versión 2** del manual: la caja menor sube de 50 a 100 USD, el plazo de los aprobadores pasa de 2 a 3 días hábiles y aparece una sección de **compras urgentes**. Al día siguiente, un jefe de área se queja: el asistente le dijo que el plazo era de 2 días. Además, los empleados preguntan cómo responder una aprobación desde Teams (no está en el manual) y qué solicitudes hay registradas (está en Dataverse, no en un documento).

## Lo que vas a construir

- Una **tabla de medición** con 6 preguntas nuevas y las 14 del Lab 144, en cuatro momentos
- El manual reemplazado por la versión 2, después de ver qué pasa con las dos a la vez
- Una fuente **sitio web público** (una página de Microsoft Learn)
- La tabla `Solicitud de compra` como fuente de **Dataverse**, con sinónimos y glosario
- Una decisión escrita: qué fuentes se quedan y por qué

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Línea base | 55 min |
| Ejercicio 2 — Una versión nueva del manual | 45 min |
| Ejercicio 3 — Una fuente web | 30 min |
| Ejercicio 4 — Dataverse como conocimiento | 60 min (incluye la espera del glosario) |
| Ejercicio 5 — Moderación y respuestas sin fuentes | 20 min |
| Ejercicio 6 — Medir y decidir | 70 min |
| **Total** | **unas 4 h 30 min a 5 h** |

## Nivel

**N2 Intermedio** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620)

## Tecnologías utilizadas

- Copilot Studio (harness estándar con orquestación generativa): conocimiento a partir de archivos, sitio web público y tablas de Dataverse (sinónimos y glosario), **Allow ungrounded responses**, **Use information from the web**, moderación, citas, mapa de actividad
- Dataverse: la tabla `Solicitud de compra` con las filas de los Labs 128 y 144

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` del [Lab 144](/labs/lab-144-copilot-studio-en-un-dia) con `manual-compras.docx` como conocimiento y **Allow ungrounded responses** apagado
- [ ] **Sin verificar:** la P0 comprobó que el panel de prueba no consume créditos con archivos, un sitio web y un agent flow. Con Dataverse como conocimiento no se ha probado; si aparece un aviso de créditos, anótalo y haz ese ejercicio en papel
- [ ] **Dataverse search** activada en el ambiente: Learn la exige para subir archivos y para usar tablas de Dataverse como conocimiento ([Learn: Dataverse como conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-dataverse))
- [ ] Al menos tres filas en `Solicitudes de compra`, con alguna de Mobiliario: las del Lab 144 sirven. Si las borraste, vuelve a registrar los casos A a C con el agente (Lab 144, Ejercicio 5). Si hiciste la Ruta Pro Power Automate, tendrás muchas más filas y con estados distintos de **Pendiente**: no pasa nada, solo compara con lo que tengas
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con `lab146/`). Usas `lab146/manual-compras-v2.docx`, `lab146/preguntas-conocimiento.json` y `preguntas-prueba.json`

---

## Ejercicio 1 — Línea base

**Objetivo:** antes de cambiar nada, saber cómo responde hoy. Sin línea base no hay mejora demostrable.

1. Abre `lab146/preguntas-conocimiento.json`. Tiene seis preguntas (K1 a K6), cada una con la respuesta correcta según la versión del manual que tenga el agente (`respuestaV1` y `respuestaV2`).
2. **Antes de medir, comprueba que el agente no busca en internet por su cuenta.** Learn sitúa ese ajuste en dos sitios: **Settings** > **Generative AI** (**Use information from the web**) y, en **Overview**, la sección **Knowledge** (**Web Search**) ([Learn: conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio)). Déjalo **apagado**. Si estaba encendido, tu línea base del Lab 144 no valía para K4 ni para K6.
3. Prepara tu **tabla de medición**: una fila por pregunta (K1 a K6, y P01 a P14 de `preguntas-prueba.json`) y cuatro columnas de resultado: **Base**, **Dos versiones**, **Solo v2** y **Final**. En cada celda irá C (correcta), P (parcial) o I (incorrecta), más la fuente que citó.
4. Haz las 20 preguntas en sesiones nuevas y llena la columna **Base**. Para K1 a K6, compara con `respuestaV1`. Ojo: K6 es la misma pregunta que P10, y K2 casi la misma que P05. Cuéntalas, pero que no te sorprenda ver el mismo resultado dos veces.

> **Si ya hiciste el Lab 145**, algunas preguntas con importe irán al topic y no al conocimiento: anótalo en la celda (por ejemplo, "C, topic"). Lo que mides es el agente entero, no solo el documento.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Correctas en la línea base (de 20) | ___ |
| Qué respondió a K4 y K5 (no están en el manual) | ___ |

---

## Ejercicio 2 — Una versión nueva del manual

**Objetivo:** ver qué pasa cuando un documento cambia y aprender a reemplazarlo bien.

1. **Primero, el error típico.** En **Knowledge** > **Add knowledge**, sube `lab146/manual-compras-v2.docx` **sin borrar** el manual anterior. Descripción: `Manual de compras de SIT, versión 2026-07.` Espera a que esté listo.
2. Haz K1, K2 y K3 en sesiones nuevas y llena la columna **Dos versiones**. Abre las citas: ¿de qué archivo sale cada respuesta?
3. **Ahora, bien.** Borra el manual antiguo de la lista de conocimiento y deja solo la versión 2. Repite K1, K2 y K3 y llena la columna **Solo v2**. Compara con `respuestaV2`. **K3 lleva un importe concreto**, así que puede contestarlo tu topic `Calcular nivel de aprobación` y no el manual: mira en el mapa de actividad quién respondió y anótalo. Si fue el topic, dirá "nivel 2" aunque el manual esté bien cargado, y eso es justo lo que analiza la nota de abajo.

> **Por qué pasa esto:** un archivo subido se guarda como una copia en Dataverse ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-file-upload)). Learn no dice que el agente vea solo los cambios del original: si corriges tu Word, el agente sigue con la copia. Y con dos versiones a la vez, cada respuesta puede salir de una distinta. En producción, para documentos que cambian a menudo, una fuente como SharePoint, que el agente consulta en el momento, evita la copia (el Módulo 15 lo explica). En el curso no la usamos porque no todos los alumnos tienen SharePoint.

> **Fíjate en K3.** La sección de urgentes dice que una compra urgente de hasta 5.000 USD la aprueba solo el jefe de área, y que Finanzas y, si es de Tecnología, TI la revisan después. Pero tu topic `Calcular nivel de aprobación` sigue diciendo nivel 2 para 4.000 USD. El conocimiento y el topic ya no dicen lo mismo. Anota cómo lo resolverías: cambiar el topic, cambiar la descripción o pedir que pregunte si es urgente. No hay una única respuesta correcta, pero sí una incorrecta: no darte cuenta.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Con las dos versiones, ¿de qué archivo salió la respuesta a K2? | ___ |
| Respuesta a K3 con solo la versión 2 | ___ |
| Cómo resolverías la contradicción entre K3 y el topic | ___ |

---

## Ejercicio 3 — Una fuente web

**Objetivo:** responder lo que no está en el manual con una fuente pública y saber cuándo se puede usar.

1. **Add knowledge** (**Agregar conocimiento**). En el buscador, escribe "sitio" (en la prueba del 2026-11-26, el buscador no aceptaba una URL) y elige **Public websites** (**Sitios web públicos**). Agrega:

```text
https://learn.microsoft.com/es-es/power-automate
```

   Descripción: `Documentación oficial de Microsoft sobre Power Automate en español, incluidas las aprobaciones y cómo responderlas desde Teams.` **Add** > **Add to agent** (**Agregar** > **Agregar al agente**). Si la interfaz te pide confirmar qué sitios son de tu organización, **no marques** este: Learn no es tuyo. Anota qué pasó.

   **Por qué esta URL y no la página concreta de aprobaciones:** las páginas de Learn sin idioma redirigen a `/en-us/…` o `/es-es/…`, y con el idioma la página de aprobaciones tendría tres niveles, uno más de los que admite la fuente. `es-es/power-automate` tiene dos y abarca toda la documentación de Power Automate en español. Es un alcance más amplio de lo ideal; anótalo en tu decisión de fuentes. (En la prueba del 2026-11-26, una fuente con páginas de Learn sí respondió, pero esta URL concreta no se ha comprobado en el tenant.)
2. Haz K4 en una sesión nueva. ¿Cita una página de Learn sobre aprobaciones en Teams?

> **Las condiciones de un sitio web público** ([Learn: sitio web público](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-public-website)):
> - La fuente usa la búsqueda de Bing (**Grounding with Bing Search**). Learn indica que no se admiten las URL que exigen autenticación ni las que Bing no tiene indexadas.
> - La URL puede tener hasta **dos niveles** de profundidad (`es-es/power-automate` tiene dos). Una URL que redirige a otro sitio de primer nivel queda excluida.
> - Con orquestación generativa se admiten hasta **25** sitios web.
>
> Por eso no puedes publicar tu manual en una web interna y usarla como "sitio público". Para la intranet existen otras fuentes, como SharePoint.

3. **No confundas esta fuente con "buscar en la web".** En **Settings** > **Generative AI** hay un ajuste aparte, **Use information from the web**, que deja al agente buscar en toda la web con Bing ([Learn: conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio)). Déjalo **apagado**: un asistente de compras no debe responder con lo que encuentre en cualquier página.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Respuesta a K4 y página citada | ___ |
| Estado de **Use information from the web** | ___ |

---

## Ejercicio 4 — Dataverse como conocimiento

**Objetivo:** responder preguntas sobre datos registrados y conocer el precio de hacerlo así.

1. **Requisito: la autenticación.** Learn indica que las tablas de Dataverse como conocimiento exigen que la autenticación del agente sea **Authenticate with Microsoft** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-dataverse)). Compruébalo en **Settings** > **Security** > **Authentication**: debería venir así (el LAB-22 lo describe como la opción que trae el agente por defecto). **Si no viene así, no la cambies todavía**: Learn advierte que los cambios de autenticación solo surten efecto al **publicar**, y la prueba de Copilot Studio no permite publicar. Anota lo que ves, intenta el paso 2 y, si la opción **Dataverse** no aparece o no se habilita, haz el resto del ejercicio en papel (por verificar en el tenant).
2. **Add knowledge** > **Dataverse**. Elige la tabla **Solicitudes de compra** (Learn admite hasta 15 tablas por fuente). Descripción: `Solicitudes de compra registradas en SIT: título, área, categoría, importe, nivel y estado.`
3. **Sinónimos y glosario, antes de agregar la fuente.** Learn los sitúa en el alta: con la tabla elegida, **Edit**, y después **Back**, antes de **Add to agent** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-dataverse)). Agrega sinónimos para las columnas, por ejemplo `Estado solicitud` = "situación", "cómo va", y un término de glosario que relacione una expresión con un valor: `nivel 3` = "el valor 3 de la columna Nivel de aprobación de la tabla Solicitud de compra". Learn indica que los términos de glosario pueden tardar hasta **15 minutos** en estar disponibles: espera antes del paso 4.
4. Haz K5 (`¿Qué solicitudes de la categoría Mobiliario hay registradas?`) y luego `¿Cuántas solicitudes pendientes hay?`. Compara con lo que ves en la tabla en Power Apps.

> **Dos límites que tienes que conocer:**
> - **No es una base de datos con preguntas.** El conocimiento busca filas relevantes y redacta una respuesta. Para contar, sumar o filtrar con exactitud ("¿cuántas hay?"), una herramienta con una consulta (Lab 148) es más fiable. Anota si la cuenta coincidió.
> - **Datos de otras personas.** Learn indica que, con Dataverse, el agente usa la autenticación de Microsoft Entra ID del usuario y solo muestra el contenido al que ese usuario tiene acceso ([Learn: conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio)). Es decir, depende de que sus roles de seguridad restrinjan de verdad la lectura. Tú eres administrador y ves todo, así que esta prueba no lo demuestra. La regla del manual (cada empleado ve solo sus solicitudes) se diseña en el Lab 150 con roles y con la identidad del usuario, y se prueba con un segundo usuario: no se confía a la redacción.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Respuesta a K5 y filas reales de Mobiliario en la tabla | ___ |
| ¿Acertó el número de pendientes? | ___ |

---

## Ejercicio 5 — Moderación y respuestas sin fuentes

**Objetivo:** conocer los dos ajustes que más cambian lo que el agente se atreve a decir.

1. En **Settings** > **Generative AI**, localiza la **moderación**. Learn indica que va de **Low** a **High**, que por defecto es **High**, y que se puede fijar en tres sitios: en el agente, en un nodo de respuestas generativas dentro de un topic y en una herramienta de prompt. Si hay conflicto, gana el del topic ([Learn: conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio)). Según Learn, el nivel más bajo genera más respuestas, pero pueden contener contenido dañino. Anota el nivel que tiene tu agente. **No lo cambies**: para un asistente interno, el valor por defecto es el razonable.
2. **Allow ungrounded responses** sigue apagado desde el Lab 144. Haz K6 (el salario) y anota qué pasó: Learn indica que, con el ajuste apagado, si nada responde salta el topic **Fallback**.
3. **Experimento controlado (opcional, 10 min):** enciende **Allow ungrounded responses**, repite K6 y P11 (el reembolso del taxi) y vuelve a apagarlo. ¿Inventó un procedimiento? Es el mejor argumento para dejarlo apagado.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Nivel de moderación del agente | ___ |
| Respuesta a K6 con el ajuste apagado (y encendido, si hiciste el paso 3) | ___ |

---

## Ejercicio 6 — Medir y decidir

**Objetivo:** cerrar con datos: qué mejoró, qué empeoró y qué fuentes se quedan.

1. Con todas las fuentes puestas (manual v2, sitio web, Dataverse), haz las 20 preguntas en sesiones nuevas y llena la columna **Final**. **Califica contra la versión 2:** P05 tiene `debeContenerV2` (3 días hábiles), y K1 a K3, `respuestaV2`.

   **Ojo con P12** ("¿En qué estado está la solicitud de Laura Gómez?"): con la fuente de Dataverse y tu cuenta de administrador, el agente puede listar solicitudes de otras personas. Si pasa, anótalo como **hallazgo de seguridad**, no como fallo de medición: es exactamente lo que resuelve el Lab 150.
2. Calcula los totales de cada columna (C, P, I) y anota las preguntas que **empeoraron** respecto de la línea base: añadir fuentes también puede meter ruido.
3. Escribe una **decisión de fuentes** de cinco líneas: qué fuentes dejas, cuál quitarías y por qué, y qué harías con la contradicción de K3. Es la evidencia principal del lab.

> **Learn también lo hace a escala:** cuando un agente con orquestación generativa tiene más de 25 fuentes de conocimiento, las filtra con un modelo interno antes de buscar ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio)). Los archivos subidos no cuentan para ese límite. Cuantas más fuentes, más importa que cada una tenga una descripción precisa.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Correctas: Base / Final (de 20) | ___ |
| Preguntas que empeoraron | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| Responde con datos del manual antiguo | La versión 1 sigue en la lista de conocimiento | Ejercicio 2, paso 3: quítala |
| El sitio web no aporta respuestas | La URL tiene más de dos niveles (cuenta el idioma, `/es-es/`), exige autenticación, redirige o Bing no la indexa | Usa una URL pública e indexada de hasta dos niveles, contando el idioma |
| No deja agregar la tabla de Dataverse | Autenticación distinta de **Authenticate with Microsoft** (y la prueba no permite publicar el cambio), o Dataverse search apagada | Ejercicio 4, paso 1, y los prerrequisitos |
| Cuenta mal las solicitudes | El conocimiento no está hecho para agregados | Una herramienta con consulta (Lab 148) |
| Responde cosas de internet que nadie configuró | **Use information from the web** está encendido | Apágalo (Ejercicio 3, paso 3) |

## Checklist final

- [ ] Tabla de medición con 20 preguntas en cuatro momentos
- [ ] Solo la versión 2 del manual como conocimiento
- [ ] Una página de Learn como sitio web público, con **Use information from the web** apagado
- [ ] La tabla `Solicitudes de compra` como conocimiento, con sinónimos y un término de glosario
- [ ] La decisión de fuentes escrita

## Evidencia esperada

- La tabla de medición completa
- Captura de la lista de conocimiento final
- Captura de una respuesta con cita a la página de Learn y otra con datos de Dataverse
- La decisión de fuentes

## Criterios de aprobación

- Con solo la versión 2, K1 y K2 dan 100 USD y 3 días hábiles
- K4 cita una página de Learn y K6 no recibe un dato inventado
- Detectas y explicas la contradicción entre la sección de urgentes y el topic
- La decisión de fuentes se apoya en tus cifras

## Competencias desarrolladas

- Medir la calidad de un agente con un juego de preguntas fijo
- Gestionar versiones de documentos como conocimiento
- Usar fuentes web y de Dataverse conociendo sus requisitos y límites
- Elegir entre conocimiento y herramienta según el tipo de pregunta

## Reto adicional

**Reto básico:** cambia la descripción de la fuente de Dataverse para que el agente no la use en preguntas de política ("¿quién aprueba…?"). Mide si cambió algo.

**Reto intermedio:** agrega `faq-proveedores.docx` y escribe en las instrucciones a quién va dirigido cada documento. Mide P01 a P14 de nuevo: ¿alguna respuesta mezcló las dos audiencias?

**Reto avanzado:** resuelve la contradicción de K3. Haz que `Calcular nivel de aprobación` pregunte si la compra es urgente cuando el importe esté entre 1.000,01 y 5.000 USD, y mide K3 otra vez.

## Preguntas de repaso

1. ¿Por qué un archivo corregido no cambia las respuestas del agente?
2. ¿Qué condiciones tiene que cumplir un sitio web público para servir como conocimiento?
3. ¿Por qué Dataverse como conocimiento no es la mejor forma de contar solicitudes?
4. ¿Qué diferencia hay entre una fuente de sitio web y **Use information from the web**?

## Limpieza del laboratorio

Deja el agente como quedó en el Ejercicio 6: el Lab 147 parte de él.

## Siguiente laboratorio recomendado

**Lab 147 — Orquestación generativa y elección de harness**: descripciones, mensajes con varias intenciones, instrucciones contra herramientas y la decisión del harness.
