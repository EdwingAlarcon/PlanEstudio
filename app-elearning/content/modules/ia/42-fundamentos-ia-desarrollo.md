---
moduleId: 42
title: "Fundamentos de IA para Desarrollo"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 18
practiceMinutes: 110
slug: "fundamentos-ia-desarrollo"
lastVerified: "2026-11"
---
*Lectura: 17-19 min · Práctica: unas 2 horas la primera vez, mejor en dos sesiones (la primera hasta la Microlección 2; la segunda, la Microlección 3, la decisión y el reto).*

### 🎯 Objetivo
Entender qué es un modelo de lenguaje (LLM) aplicado a generación de código, distinguir entre autocompletado, chat y agentes, y reconocer los límites reales de estas herramientas antes de usarlas en proyectos de Power Platform y Dynamics 365. Al terminar habrás **pillado a una IA inventando** columnas y escribiendo un validador que rechaza correos válidos, lo habrás demostrado con un script que contrasta su salida con el esquema y con casos de prueba, y lo habrás corregido.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que viste, no un "sí, funcionó"). La Microlección 3 es una actividad de **fallo y corrección**: recibes una salida generada por IA con errores plausibles, los detectas con evidencia y los corriges. Cierras **decidiendo y defendiendo** si un prompt es confiable para un proceso repetible y con un **reto de transferencia** sobre un modelo de predicción.
>
> **Antes de empezar, necesitas:**
> - **Node.js 20 o posterior** (comprueba con `node --version` en una terminal). Lo usas en la Microlección 3 para ejecutar un script; no instalas paquetes.
> - **Un asistente de IA gratuito, si lo tienes.** El más completo para este módulo es **GitHub Copilot Free** en Visual Studio Code, porque trae las tres formas de uso (sugerencias inline, chat y agente): al iniciar sesión con una cuenta de GitHub sin suscripción quedas en Copilot Free ([VS Code: configurar Copilot](https://code.visualstudio.com/docs/copilot/setup)). El Módulo 44 lo configura paso a paso. Cualquier chat de IA gratuito sirve para la Microlección 2. **Si no tienes ninguno**, puedes hacer el módulo igual: la Microlección 3 te da la salida de la IA ya escrita.
> - **No necesitas tenant de Power Platform.** El módulo es transversal: no exige ningún nivel de certificación. Si ya tienes un ambiente con Power Apps, la Microlección 2 trae una comprobación opcional en Power Apps Studio.

### 📖 Conceptos Clave
- **LLM aplicado a código:** un modelo entrenado para predecir texto, incluyendo código, a partir del contexto que recibe (el archivo abierto, el historial de chat, el repositorio). No "entiende" el negocio: infiere patrones estadísticamente probables.
- **Autocompletado vs Chat vs Agente:** el autocompletado (las sugerencias inline de GitHub Copilot) sugiere la siguiente línea mientras escribes; el chat (Copilot Chat en modo **Ask**, Claude, ChatGPT) responde preguntas o genera bloques a partir de una instrucción; un agente (Claude Code, Codex, el agente **Agent** de Copilot en VS Code) puede leer múltiples archivos, ejecutar comandos y editar el repositorio de forma autónoma dentro de los límites que le des.
- **Contexto y ventana de contexto:** cuanto más contexto relevante (archivos, historial, documentación) reciba el modelo, mejor su respuesta — pero hay un límite de tokens; en repos grandes hay que decidir qué mostrarle.
- **Alucinaciones:** el modelo puede generar código sintácticamente válido que referencia una función, tabla o campo de Dataverse que no existe. Esto no es un bug del modelo, es una consecuencia de cómo funciona — siempre hay que verificar contra la fuente real (el esquema, la documentación oficial).
- **Determinismo relativo:** la misma pregunta puede producir respuestas distintas en ejecuciones diferentes. Esto es aceptable para explorar ideas, pero exige revisión humana antes de aceptar cualquier cambio en código de producción.
- **Evaluar el prompt/agente, no solo su output:** revisar el código que un modelo genera es necesario pero no basta — un prompt o un agente también se evalúa en sí mismo: ¿el prompt tiene criterios de aceptación explícitos (igual que una user story)? ¿el agente, cuando se usa de forma repetida para la misma tarea, produce resultados consistentes o varía tanto que no es confiable para ese caso de uso? Esta disciplina (a veces llamada "AI evaluation" o "prompt evaluation") es una competencia distinta de revisar un diff — se evalúa antes de confiar en el prompt como parte de un proceso repetible, no después de cada ejecución individual.
- **Responsible AI en términos prácticos (no solo un principio abstracto):** para un desarrollador de Power Platform esto se traduce en dos obligaciones concretas: (1) **explicabilidad** — si una automatización toma una decisión que afecta a una persona (ej. un flujo que prioriza o rechaza una solicitud usando un modelo de IA Builder), el usuario de negocio debe poder preguntar "¿por qué se decidió esto?" y recibir una respuesta distinta de "el modelo lo dijo"; (2) **sesgo** — un modelo de predicción de AI Builder (ej. predecir si una oportunidad se ganará) se entrena con datos históricos que pueden reflejar sesgos previos del proceso de negocio (por ejemplo, favorecer sistemáticamente ciertos segmentos de clientes por cómo se registró el historial) — entrenar y publicar un modelo sin revisar esto no es solo un riesgo ético abstracto, es un riesgo funcional real de reproducir un problema de negocio existente a escala.
- **Evidencia, no confianza:** la pregunta útil ante cualquier salida de IA no es "¿parece correcta?", sino "¿contra qué la comprobé?": el esquema real de la tabla, la referencia oficial de la función, una prueba que se ejecuta o el compilador. Preguntarle al mismo modelo si su respuesta es correcta no cuenta como verificación.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Autocompletado, chat y agente: qué puede hacer cada uno

**¿Qué vas a aprender?** A reconocer qué forma de asistencia estás usando y, por tanto, qué puede y qué no puede haber comprobado por su cuenta.

**¿Por qué existe esto?** Un chat sin herramientas que te dice "las pruebas pasan" no ejecutó ninguna prueba: solo predijo una frase plausible. Un agente sí puede ejecutarlas, y por eso mismo puede cambiar más cosas de las que pediste. Saber cuál tienes delante decide cuánto revisas.

| Forma de uso | Qué recibe como contexto | Qué puede hacer | Qué **no** hace |
|---|---|---|---|
| **Autocompletado** (sugerencias inline) | El código alrededor del cursor y los archivos abiertos | Proponer la continuación de lo que escribes | Leer tu esquema de Dataverse ni ejecutar nada |
| **Chat** (por ejemplo, Copilot en modo **Ask**) | Tu pregunta, el historial y lo que le muestres | Explicar, proponer bloques de código | Aplicar cambios ni ejecutar pruebas por sí mismo |
| **Agente** (por ejemplo, Copilot en modo **Agent**, Claude Code, Codex) | Lo anterior más los archivos que decide leer | Leer y editar varios archivos y ejecutar comandos, pidiéndote aprobación según cómo lo configures | Saber si el resultado cumple tu regla de negocio si no se la diste |

En VS Code, Copilot ofrece las tres: las sugerencias inline se aceptan con **Tab** y se descartan con **Escape**; el agente **Ask** solo usa herramientas de lectura y no cambia nada; el agente **Agent** implementa cambios y pide aprobar los comandos de terminal antes de ejecutarlos ([VS Code: agentes integrados](https://code.visualstudio.com/docs/copilot/agents/local-agents), [VS Code: sugerencias inline](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions)).

**Ahora haz algo — micropráctica (5 min):** decide qué forma de uso corresponde a cada tarea y qué puede haber comprobado cada una → **[Autocompletado, chat o agente](/practica/ip-ia-016-autocompletado-chat-o-agente)**.

**Práctica real (25 min, con Copilot Free en VS Code):**

1. Crea una carpeta `sit-ia-m42` y ábrela en VS Code con **File** > **Open Folder** (si pregunta si confías en los autores, responde que sí: es tu carpeta). Si Copilot no tiene la sesión iniciada, pasa el puntero sobre su icono en la barra de estado (abajo) y selecciona **Use AI Features** ([VS Code: configurar Copilot](https://code.visualstudio.com/docs/copilot/setup)).
2. Crea `precios.mjs` con este contenido:
   ```js
   // Total con IVA del 19 % (tasa de ejemplo)
   export function totalConIva(subtotal) {
     return subtotal * 1.19;
   }
   ```
3. **Autocompletado:** en una línea nueva escribe `export function totalSinIva(` y espera la sugerencia en texto atenuado. Anota qué propuso y descártala con **Escape**.
4. **Chat:** abre el Chat con **Chat** > **Open Chat** en la barra de título (o **Ctrl+Alt+I**), elige **Ask** en el selector de agente del cuadro de chat y escribe: `¿Qué tasa de IVA usa este archivo y de dónde sale ese valor?`. Anota si la respuesta dice que la tasa es de ejemplo o la presenta como un dato oficial.
5. **Agente:** en el mismo selector elige **Agent** y escribe: `Crea precios.test.mjs con una prueba de node:test para totalConIva(100) y ejecútala con node --test`. Cuando pida ejecutar el comando en la terminal, **lee el comando antes de aprobarlo**. Después de que termine, revisa los archivos que creó o cambió y decide con **Keep** (conservar) o **Undo** (deshacer).

**Qué deberías ver:** el autocompletado propone código sin preguntar nada; Ask responde texto sin tocar archivos; Agent crea un archivo nuevo y te pide aprobación antes de ejecutar `node --test`. **Si no lo ves:** si el selector no muestra **Agent**, revisa que la carpeta no esté en **Restricted Mode** (aviso en la parte superior). Si no tienes Copilot, haz los pasos 4 y 5 con el chat de IA que tengas y anota qué no pudo hacer (por ejemplo, ejecutar el comando).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Herramienta y plan que usaste (por ejemplo, Copilot Free en VS Code) | ___ |
| Sugerencia inline del paso 3 (cópiala) | ___ |
| ¿La respuesta de Ask presentó el 19 % como dato de ejemplo o como dato oficial? (frase exacta) | ___ |
| Comando que el agente pidió aprobar y resultado de `node --test` (`pass`/`fail`) | ___ |
| Archivos que el agente creó o cambió | ___ |

---

## 🧩 Microlección 2 — El contexto cambia la respuesta (y la respuesta cambia sola)

**¿Qué vas a aprender?** A escribir un prompt con contexto suficiente, a comprobar que la salida usa funciones reales y a observar que el mismo prompt no devuelve siempre lo mismo.

**¿Por qué existe esto?** Sin contexto, el modelo elige por ti el lenguaje, la plataforma y el estilo. Y aunque des buen contexto, dos ejecuciones pueden diferir: por eso la verificación se hace contra la fuente oficial, no contra "la respuesta que me gustó".

**La referencia contra la que vas a comprobar:** en Power Fx, `IsMatch( Texto, Patrón [, Opciones] )` comprueba si un texto cumple un patrón; el patrón puede ser una expresión regular o uno de los patrones predefinidos del enum **Match**, como `Match.Email`, y **debe ser una constante** (no una variable). En Power Apps, `IsMatch` compara el texto completo por defecto (**MatchOptions.Complete**), y Learn advierte que Power Apps usa una definición propia de `Match.Email`: para ver la expresión que usa tu host, evalúa `Text( Match.Email )` ([Learn: IsMatch, Match y MatchAll](https://learn.microsoft.com/power-platform/power-fx/reference/function-ismatch)). El texto que el usuario escribió en un control **Text input** clásico está en su propiedad **Text** ([Learn: control Text input](https://learn.microsoft.com/power-apps/maker/canvas-apps/controls/control-text-input)).

**Práctica real (30 min, con cualquier chat de IA):**

1. **Prompt débil (sin contexto).** Escríbelo tal cual y anota en qué lenguaje respondió:
   ```
   Genera una función que valide un email.
   ```
   *Problema esperado:* puede responder en JavaScript, Python o cualquier lenguaje: no sabe que necesitas Power Fx.
2. **Prompt mejorado.** En un chat nuevo:
   ```
   Rol: desarrollador Power Apps Canvas.
   Contexto: tengo un control Text input llamado TextInputEmail y una etiqueta lblErrorEmail
   que muestra "Correo no válido".
   Tarea: escribe la fórmula Power Fx de la propiedad Visible de lblErrorEmail para que la
   etiqueta aparezca solo cuando TextInputEmail.Text no está vacío y no tiene formato de correo.
   Usa IsMatch.
   Formato de salida: solo la fórmula, con un comentario // que explique el patrón usado.
   ```
   *Resultado razonable:* `!IsBlank(TextInputEmail.Text) && !IsMatch(TextInputEmail.Text, Match.Email)` o una variante con una expresión regular constante. **Evalúa:** ¿usa sintaxis real de Power Fx (no `.test()` ni `re.match` de otro lenguaje)? ¿cada función que aparece existe en la referencia de Power Fx? ¿el patrón es una constante?
3. **Repite el prompt mejorado dos veces más**, cada una en un chat nuevo, y compara las tres fórmulas. Anota si cambia el patrón (predefinido o expresión regular) o la lógica de "vacío".
4. **Comprobación opcional en Power Apps** (solo si ya tienes un ambiente): en una app Canvas en blanco agrega un **Text input** y una **Label**, renómbralos `TextInputEmail` y `lblErrorEmail`, pega la fórmula en la propiedad **Visible** de la etiqueta y prueba con `ana@sit.com`, `ana@sit` y el campo vacío. Si la barra de fórmulas marca un error, anota el mensaje exacto: es tu evidencia de que algo no existe o no está bien escrito.

**Si la IA te da una fórmula con una función que no reconoces** (por ejemplo, `IsEmail(...)`), búscala en la [referencia de fórmulas para Canvas apps](https://learn.microsoft.com/power-platform/power-fx/formula-reference-canvas-apps), que lista todas las funciones por orden alfabético (ahí están **IsBlank** e **IsMatch**, y también los operadores `!` y `&&` como alternativa a **Not** y **And**). Si no aparece, es una alucinación: anótala.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Lenguaje en que respondió el prompt débil | ___ |
| Las tres fórmulas del prompt mejorado (cópialas) | ___ |
| ¿En qué se diferencian las tres? (patrón, manejo del vacío, comentarios) | ___ |
| Funciones que comprobaste en Learn y si existen (función → sí/no) | ___ |
| (Opcional) Resultado en Power Apps para `ana@sit.com`, `ana@sit` y vacío | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: la IA inventa columnas y rechaza correos válidos

**¿Qué vas a aprender?** A detectar una alucinación con evidencia: contrastar la salida de la IA con el esquema real y con casos de prueba que se ejecutan, corregirla y volver a comprobar.

**¿Por qué existe esto?** Es el Caso Real de este módulo en pequeño: el código se ve bien, compila y está mal. Aquí todos parten de la misma salida, así que la evidencia es comparable.

**El pedido:** un compañero le pidió a una IA "las opciones de consulta de la Web API de Dataverse para las solicitudes de prioridad alta, con el correo de contacto, el nivel de fidelidad del cliente y la fecha límite, y una función que valide el correo". Esto obtuvo.

Crea una carpeta nueva `sit-ia-m42-revision` con estos tres archivos. El **esquema es de ejemplo** (así lo verías si lo copiaras de la tabla: en tu ambiente los nombres y valores pueden ser otros):

`esquema.json`
```json
{
  "tabla": "sit_solicitud",
  "nota": "Esquema de EJEMPLO para esta práctica: en tu ambiente los nombres y valores pueden ser otros.",
  "columnas": [
    { "nombreLogico": "sit_correocontacto", "tipo": "Email" },
    { "nombreLogico": "sit_fechavencimiento", "tipo": "DateTime" },
    {
      "nombreLogico": "sit_prioridad",
      "tipo": "Choice",
      "opciones": [
        { "valor": 100000000, "etiqueta": "Baja" },
        { "valor": 100000001, "etiqueta": "Media" },
        { "valor": 100000002, "etiqueta": "Alta" }
      ]
    }
  ]
}
```

`salida-ia.mjs` (la salida tal como la entregó la IA)
```js
// salida-ia.mjs: lo que entregó el asistente de IA (contiene errores a propósito)
// Opciones de consulta de la Web API para las solicitudes de prioridad alta
export const consultaUrgentes =
  "$select=sit_correocontacto,sit_nivelfidelidad,sit_fechalimite&$filter=sit_prioridad eq 'Alta'";

// Valida el formato de un correo
export function esCorreoValido(correo) {
  return /^\w+@\w+\.\w{2,3}$/.test(correo);
}
```

`revisar.mjs` (el script que contrasta la salida con el esquema y con casos de prueba)
```js
// revisar.mjs: contrasta la salida de la IA con el esquema y con casos de prueba
import { readFileSync } from "node:fs";
import { consultaUrgentes, esCorreoValido } from "./salida-ia.mjs";

const esquema = JSON.parse(readFileSync(new URL("./esquema.json", import.meta.url), "utf8"));
const columnas = new Map(esquema.columnas.map((c) => [c.nombreLogico, c]));
let problemas = 0;

// 1) ¿Existen todas las columnas que usa la consulta?
for (const nombre of new Set(consultaUrgentes.match(/\bsit_[a-z0-9]+\b/g) ?? [])) {
  if (!columnas.has(nombre)) {
    console.log(`FALLA  la columna ${nombre} no existe en ${esquema.tabla}`);
    problemas++;
  }
}

// 2) ¿Se compara una columna Choice con su etiqueta en vez de con su valor?
for (const [, nombre, texto] of consultaUrgentes.matchAll(/(sit_[a-z0-9]+) eq '([^']*)'/g)) {
  const columna = columnas.get(nombre);
  if (columna?.tipo === "Choice") {
    const opcion = columna.opciones.find((o) => o.etiqueta === texto);
    console.log(`FALLA  ${nombre} es Choice: compara con '${texto}' (etiqueta); usa el valor ${opcion?.valor ?? "?"}`);
    problemas++;
  }
}

// 3) ¿El validador de correo acepta y rechaza lo que debe?
const casos = [
  ["ana@sit.com", true],
  ["ana.perez@sit.com.co", true],
  ["luis_r@correo.info", true],
  ["sin-arroba.com", false],
  ["ana@sit", false],
  ["ana @sit.com", false],
];
for (const [correo, esperado] of casos) {
  const obtenido = esCorreoValido(correo);
  if (obtenido !== esperado) {
    console.log(`FALLA  esCorreoValido("${correo}") devolvió ${obtenido}; se esperaba ${esperado}`);
    problemas++;
  }
}

console.log(`Problemas encontrados: ${problemas}`);
process.exitCode = problemas === 0 ? 0 : 1;
```

**Diagnosticar antes de corregir — micropráctica (7 min):** el compañero ejecutó la consulta en su ambiente de desarrollo y la Web API respondió con un error. Formula tu hipótesis antes de abrir las pistas → **[Diagnosticar: la consulta generada usa columnas que no existen](/practica/ip-ia-017-consulta-generada-con-columnas-inventadas)**.

**Práctica real (35 min):**

1. **Antes de ejecutar nada, lee `salida-ia.mjs`** y escribe en tu tabla de evidencia qué crees que está mal. Así podrás comparar tu lectura con lo que el script demuestra.
2. En una terminal, dentro de la carpeta, ejecuta `node revisar.mjs`. **Qué deberías ver:** cinco líneas que empiezan por `FALLA` y al final `Problemas encontrados: 5`. **Si ves un error de importación**, revisa que los tres archivos estén en la misma carpeta y que `salida-ia.mjs` termine en `.mjs`.
3. **Corrige `salida-ia.mjs`** sin tocar `revisar.mjs` ni `esquema.json`. Criterios de aceptación:
   - Cada columna de la consulta existe en el esquema. Si un dato que pidió el compañero **no existe** (pregúntate cuál), no lo inventes ni lo cambies por otro parecido: quítalo y anota a quién le preguntarías de dónde sale.
   - La columna Choice se compara con su **valor numérico**, no con la etiqueta. En la Web API las columnas de estado y de opción se filtran por número, como `statecode eq 0` en los ejemplos de [Learn: filtrar filas con OData](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows).
   - El validador acepta los tres correos válidos de la lista y rechaza los tres inválidos.
4. Ejecuta otra vez `node revisar.mjs` hasta ver `Problemas encontrados: 0`.
5. **Rompe a propósito para confirmar que el script sirve:** vuelve a escribir `'Alta'` en el filtro y ejecuta el script. Debe volver a fallar. Deshaz el cambio.

> **De vuelta a Power Apps:** en una app Canvas no hace falta escribir tu propia expresión regular para un correo: `IsMatch(TextInputEmail.Text, Match.Email)` usa el patrón predefinido. La lección del script es la misma en cualquier herramienta: un validador generado por IA se prueba con correos reales que deben pasar y que deben fallar, no con uno solo.

**Evidencia a reportar (una fila por fallo):**

| Fallo encontrado | Línea de `revisar.mjs` que lo demuestra | Corrección aplicada | Contra qué lo verificaste (esquema, Learn o caso de prueba) |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Fallos que viste leyendo, **antes** de ejecutar el script | ___ |
| Salida final de `node revisar.mjs` con tu corrección | ___ |
| Dato que pidió el compañero y no existe, y a quién le preguntarías por él | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — ¿es confiable este prompt para un proceso repetible?

> **Situación:** el equipo de SIT quiere guardar el prompt mejorado de la Microlección 2 en su librería de prompts y usarlo cada vez que alguien necesite validar un correo en una app Canvas. El líder técnico te pregunta: **¿lo aprobamos como prompt de equipo, y con qué condiciones?**
> **Entrega:** tu decisión (aprobar, aprobar con cambios o rechazar) en una frase, más tres a cinco líneas que la defiendan con tu evidencia de las Microlecciones 2 y 3.

No hay una única respuesta correcta: se evalúa que la decisión esté justificada. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| El prompt tiene criterios de aceptación | Tu versión dice qué debe cumplir la salida (Power Fx, `IsMatch`, patrón constante, qué pasa con el vacío), como una user story |
| Evaluaste la consistencia | Citas qué cambió entre tus tres ejecuciones y si esa variación es aceptable para un uso repetido |
| La verificación no depende del modelo | Dices contra qué se comprueba cada salida (la referencia de Power Fx en Learn, la prueba en Power Apps o casos de prueba) |
| Nombras el riesgo de alucinación | Explicas qué haría quien use el prompt si aparece una función o columna que no reconoce |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión en una frase | ___ |
| Cambios que harías al prompt antes de guardarlo | ___ |
| Criterio de la rúbrica que más te costó y cómo lo resolviste | ___ |

---

## 🔁 Reto de transferencia — Un modelo de predicción para priorizar solicitudes

Cambia el artefacto: ya no revisas código, sino un modelo de IA que va a decidir algo sobre personas. SIT quiere entrenar un modelo de predicción de AI Builder con tres años de historial para predecir si una solicitud "se escalará" y priorizarla. Tras el entrenamiento, el modelo muestra una calificación **D** con una precisión del 99,6 %, y en la lista de columnas más influyentes aparecen **Escalado por** (70 %) y **Región del cliente** (20 %). Un analista recuerda que, durante años, las solicitudes de una región las cerraba directamente un gerente sin escalarlas.

Lo que dice Learn sobre este caso ([Learn: rendimiento del modelo de predicción](https://learn.microsoft.com/ai-builder/prediction-performance)):
- Una calificación **D** significa que algo va mal: el modelo es peor que una suposición al azar, **o** es tan bueno (cerca del 100 %) que probablemente una columna está directamente correlacionada con el resultado.
- Tras cada entrenamiento, la página de detalles del modelo muestra los **top influencers** (columnas más influyentes): si no son las que esperabas, el entrenamiento no fue el esperado. Puedes quitar columnas irrelevantes o engañosas y reentrenar.
- Elegir columnas que introducen un sesgo no deseado es una causa de mal rendimiento: todas las columnas deben ser relevantes para lo que quieres predecir.

1. **Micropráctica (7 min):** **[Transferir: un modelo que predice demasiado bien](/practica/ip-ia-018-modelo-que-predice-demasiado-bien)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel** (no necesitas AI Builder): decide qué haces antes de publicar el modelo y defiéndelo.

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona |
|---|---|---|
| Qué haces con **Escalado por** | ___ | ___ |
| Qué haces con **Región del cliente** y por qué | ___ | ___ |
| Qué responde el equipo cuando alguien pregunta "¿por qué se priorizó esta solicitud?" | ___ | ___ |
| Quién puede cambiar una prioridad sugerida por el modelo | ___ | ___ |

### 💼 Casos Reales de Negocio
Un equipo de Servicios Integrados Tecnológicos S.A. (SIT) pidió a un desarrollador junior generar un plugin C# completo con Copilot Chat sin revisar el resultado. El código compiló y pasó el Solution Checker, pero llamaba a una API de Dataverse en modo síncrono dentro de un bucle, generando timeouts en producción con volúmenes reales. La causa no fue el modelo — fue no verificar el resultado contra las buenas prácticas de rendimiento ya conocidas por el equipo antes de este módulo.

### ✅ Buenas Prácticas
- Dar siempre contexto explícito (lenguaje, plataforma, versión) antes de pedir código.
- Tratar toda alucinación como un riesgo esperado, no una excepción rara — verificar nombres de campos, tablas y APIs contra la fuente real.
- Usar el modelo para explorar y acelerar, nunca como sustituto de conocimiento del dominio (Power Platform, Dataverse, C#).
- Saber qué forma de asistencia usas: un chat sin herramientas no ejecutó pruebas aunque lo diga; un agente sí puede, y por eso hay que revisar qué cambió.
- Probar todo validador o regla generada con casos que **deben pasar** y casos que **deben fallar**; uno solo no prueba nada.
- Si un dato pedido no existe en el esquema, no aceptar un nombre "parecido": preguntar a negocio de dónde sale.
- Antes de guardar un prompt para uso repetido, escribirle criterios de aceptación y ejecutarlo varias veces para ver cuánto varía.
- Desconfiar de un modelo de predicción "casi perfecto" y revisar sus columnas más influyentes antes de publicarlo.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aceptar código generado sin verificar que las tablas/campos referenciados existen | Confiar en que el modelo "sabe" el esquema real del entorno | Siempre contrastar contra el esquema real de Dataverse antes de aceptar |
| Pedir tareas sin contexto de plataforma | Asumir que el modelo infiere correctamente Power Fx vs JavaScript vs C# | Especificar siempre lenguaje, plataforma y versión en el prompt |
| Tratar la primera respuesta como definitiva | Falta de familiaridad con la naturaleza no determinista del modelo | Iterar el prompt y comparar 2-3 respuestas antes de decidir |
| Filtrar una columna Choice por su etiqueta (`eq 'Alta'`) en la Web API | La IA usa el texto que ve en la pantalla | Filtrar por el valor numérico de la opción, tomado del esquema real |
| Un validador de correo generado rechaza correos válidos (`ana.perez@sit.com.co`) | El patrón se probó con un solo ejemplo | Probar con varios correos que deben pasar y que deben fallar; en Power Apps, usar `Match.Email` |
| Creer que el chat "ya probó" el código porque lo afirma | Confundir chat con agente | Ejecutar tú la prueba o usar un agente y leer la salida real del comando |
| Publicar un modelo de predicción con precisión cercana al 100 % | Una columna que se llena después del resultado lo delata | Revisar los top influencers, quitar esa columna y reentrenar |

### 🧪 Criterios de Validación
- [ ] Explico la diferencia entre autocompletado, chat y agente con un ejemplo de cada uno, y anoté qué hizo cada uno en mi práctica (o qué no pudo hacer mi herramienta)
- [ ] Comparé un prompt débil y uno mejorado para la misma tarea y documenté la diferencia de precisión
- [ ] Ejecuté el prompt mejorado tres veces, comparé las salidas y comprobé en Learn que cada función usada existe
- [ ] Identifico una alucinación de código: ejecuté `revisar.mjs`, encontré las columnas inventadas, el filtro por etiqueta y los fallos del validador, y llegué a `Problemas encontrados: 0` con mi corrección
- [ ] Diagnostiqué el error de la consulta generada formulando una hipótesis antes de ver las pistas
- [ ] Puedo enumerar 2 riesgos de aceptar código generado sin verificación
- [ ] Decidí y defendí si el prompt mejorado sirve como prompt de equipo, contra la rúbrica
- [ ] En el reto de transferencia decidí qué hacer con las columnas sospechosas del modelo de predicción y cómo se explica una prioridad a quien la pregunte
- [ ] Relaciono este módulo con cualquier lab de Nivel Básico/Intermedio donde pueda usar IA para acelerar una fórmula Power Fx, revisando siempre el resultado contra el esquema real

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- Los archivos `salida-ia.mjs` (tu versión corregida), `revisar.mjs` y `esquema.json`, con la salida de `node revisar.mjs` antes y después de corregir.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 44 configura Copilot en VS Code y aplica esta revisión a un plugin; el Módulo 45 delega tareas a agentes de código (Claude Code y Codex); el Módulo 46 trata cuándo vale generar código casi sin especificación y qué controles exige.
