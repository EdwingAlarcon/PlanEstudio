---
moduleId: 45
title: "Claude Code y Codex para Análisis e Implementación"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 23
practiceMinutes: 180
slug: "claude-code-y-codex"
lastVerified: "2026-11"
---
*Lectura: 22-24 min · Práctica: unas 3 horas la primera vez, contando instalar el agente, mejor en dos sesiones (la primera hasta la Microlección 2; la segunda, la Microlección 3, la decisión y el reto).*

### 🎯 Objetivo
Usar agentes de código (Claude Code, Codex) para analizar repositorios grandes y ejecutar cambios acotados con herramientas (lectura, edición, bash), entendiendo qué los diferencia de un simple chat y cuándo delegarles una tarea real. Al terminar habrás configurado cuánto puede hacer el agente sin preguntarte, habrás fijado las convenciones del proyecto en un archivo de instrucciones y habrás **pillado a un agente que reportó "todas las pruebas pasan"** sin cumplir el criterio de la tarea: lo demuestras con `git diff` y una prueba de aceptación, y lo corriges.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que viste, no un "sí, funcionó"). La Microlección 3 es una actividad de **fallo y corrección**: recibes el resultado de un agente con errores plausibles, los detectas con `git` y con pruebas, y los corriges. Cierras **decidiendo y defendiendo** la configuración de permisos de tu equipo y con un **reto de transferencia** sobre una tarea de análisis.
>
> **Antes de empezar (lee esto, ahorra media hora):**
> - **Este módulo es transversal y no necesita tenant:** trabajas sobre un repositorio pequeño de Node.js que creas tú en la Microlección 1. No exige ningún nivel de certificación.
> - **Software:** **Node.js 20 o posterior** (`node --version`) y **Git** (`git --version`; en Windows, [Git for Windows](https://git-scm.com/downloads/win)). Si Git te pide nombre y correo al hacer tu primer commit, configúralos con `git config --global user.name "Tu nombre"` y `git config --global user.email "tu@correo"`.
> - **Elige un agente (revisa las condiciones vigentes en la documentación oficial antes de instalar):**
>   - **Codex** (OpenAI): según la página de precios de Codex, está incluido en los planes de ChatGPT **Free**, Go, Plus, Pro, Business, Edu y Enterprise, con un uso limitado por plan ([Codex: precios](https://learn.chatgpt.com/docs/pricing)). En Windows se instala desde una ventana nueva de PowerShell con `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`, o con `npm install -g @openai/codex` ([repositorio oficial de Codex](https://github.com/openai/codex)); la primera vez que ejecutas `codex` dentro de una carpeta eliges **Sign in with ChatGPT** ([Codex CLI](https://learn.chatgpt.com/docs/codex/cli)). **Es la opción sin pago de este módulo.**
>   - **Claude Code** (Anthropic): **requiere una cuenta de pago** (Pro, Max, Ultra, Team, Enterprise o Console); el plan gratuito de claude.ai no incluye Claude Code ([Claude Code: instalación](https://code.claude.com/docs/en/setup)). En Windows se instala desde PowerShell con `irm https://claude.ai/install.ps1 | iex` (o `winget install Anthropic.ClaudeCode`) y se comprueba, en una terminal nueva, con `claude --version`. En Windows nativo, Git for Windows es opcional pero recomendado: sin él, Claude Code ejecuta los comandos con PowerShell en vez de Bash.
>   - **Sin ninguno de los dos:** el agente **Agent** de GitHub Copilot Free en VS Code (Módulo 44) sirve para las Microlecciones 1 a 3; donde un paso es propio de Claude Code o de Codex, el módulo te indica el equivalente. Y si no tienes ningún agente, la Microlección 3 trae el resultado del agente ya escrito: la parte de detectar y corregir la haces igual.
> - **Las herramientas cambian rápido.** Los nombres de comandos, modos y archivos de este módulo se verificaron en la documentación oficial en noviembre de 2026. Si algo no coincide con lo que ves, manda la documentación: en Claude Code, la lista de comandos con `/help`; en Codex, la [lista de comandos de barra](https://learn.chatgpt.com/docs/developer-commands?surface=cli). La documentación de Codex se mudó en 2026 de `developers.openai.com/codex` a `learn.chatgpt.com/docs`; los enlaces antiguos redirigen.

### 📖 Conceptos Clave
- **Agente vs chat:** un agente de código puede usar herramientas — leer archivos, buscar en el repo, ejecutar comandos (tests, lint, build), y editar archivos directamente — encadenando varios pasos sin que el humano copie/pegue manualmente cada resultado.
- **Análisis de repos grandes:** en un monorepo con varias superficies (por ejemplo, el de esta app de estudio, con `app-elearning/` y `docs/`), un agente puede explorar la estructura y encontrar todos los lugares donde una convención se repite (como cada `Record<LevelId, ...>` o cada recorrido de `LEVEL_ORDER`) antes de proponer un cambio — algo que un chat sin herramientas no puede hacer por sí mismo. En la Microlección 1 haces lo mismo, a pequeña escala, con `calcularVencimiento`.
- **Alcance de la tarea (scope):** un agente rinde mejor con una tarea acotada y verificable ("agregar un campo a este formulario y correr los tests") que con una tarea vaga ("mejora el proyecto").
- **Diferencias de enfoque:** Claude Code y Codex (agente de código de OpenAI, un producto independiente) siguen el mismo patrón de plan→ejecución→verificación, y los dos te dejan decidir cuánto hacen sin preguntarte: Claude Code con **modos de permisos** (`default`, `acceptEdits`, `plan`...) y reglas `allow`/`deny`; Codex con un **sandbox** (dónde puede escribir y si tiene red) más una **política de aprobaciones**. GitHub Copilot Agent Mode (el agente **Agent** de Copilot en VS Code) es una función distinta de GitHub/Microsoft, con selección de modelo subyacente — no es lo mismo que Codex ni está "integrado" en él, aunque comparta ese mismo patrón de plan→ejecución→verificación. Todos requieren que el humano defina el alcance y revise el resultado final.
- **Verificación como parte del ciclo:** un agente que corre los tests o el linter después de un cambio y reporta el resultado da más confianza que uno que solo entrega código sin ejecutar nada. Pero "las pruebas pasan" solo vale si las pruebas miden **tu** criterio: un agente puede escribir (o cambiar) una prueba que confirma justo el comportamiento que querías eliminar.
- **Instrucciones del repositorio:** `CLAUDE.md` (Claude Code) y `AGENTS.md` (Codex, y también Claude Code y Copilot cuando lo usan) fijan las convenciones del proyecto para cada sesión. Son **contexto, no control**: el agente las lee e intenta seguirlas, pero lo que de verdad bloquea una acción son los permisos, las reglas `deny`, el sandbox o un hook.
- **Git es tu red de seguridad:** `git status`, `git diff --stat` y `git diff` muestran lo que el agente cambió de verdad, incluidos los archivos que no mencionó en su resumen.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Agente vs chat, y cuánto lo dejas hacer sin preguntarte

**¿Qué vas a aprender?** A crear un repositorio de práctica, a arrancar el agente en un modo que **no puede editar** y a comprobar su análisis contra una búsqueda que haces tú.

**¿Por qué existe esto?** El primer contacto con un repositorio debería ser de solo lectura: entender antes de tocar. Y la respuesta del agente se contrasta con `git grep`, que no inventa resultados.

**Los controles de cada agente (según su documentación oficial):**

| Qué quieres | Claude Code | Codex |
|---|---|---|
| Que analice sin editar | Modo `plan`: investiga, puede leer archivos y ejecutar comandos para explorar, y propone un plan; no edita el código hasta que apruebas el plan. Arranca con `claude --permission-mode plan` o cambia de modo con **Shift+Tab** | Sandbox `read-only`: `codex --sandbox read-only`. También existe `/plan` para el modo plan |
| Trabajo diario en un repositorio con Git | Modo `default` (Manual): pide aprobar cada edición y cada comando; solo las lecturas corren sin preguntar. El modo `acceptEdits` deja pasar además las ediciones dentro de la carpeta y comandos comunes de archivos (`mkdir`, `touch`, `rm`, `mv`, `cp`, `sed`): ojo con `rm` | Modo **Auto** (sandbox `workspace-write` con aprobaciones `on-request`), el que usa por defecto en una carpeta con control de versiones: trabaja dentro de la carpeta y se detiene a pedir aprobación antes de ir más allá. La red está **desactivada** por defecto |
| Sin ningún control | `bypassPermissions` (o `--dangerously-skip-permissions`): la documentación lo reserva para contenedores y máquinas virtuales aislados | `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`): la documentación lo desaconseja fuera de una VM dedicada |
| Ver o cambiar los permisos | `/permissions` | `/permissions`; `/status` muestra la política de aprobación y las carpetas con escritura |
| Deshacer | `/rewind` (o **Esc** dos veces con el cuadro de texto vacío) restaura código y conversación a un punto anterior; **no** deshace los cambios que hizo un comando de Bash en archivos que Claude no había editado, y no reemplaza a Git | Git: `/diff` muestra los cambios, incluidos los archivos nuevos |

Fuentes: [Claude Code: modos de permisos](https://code.claude.com/docs/en/permission-modes), [Claude Code: checkpoints](https://code.claude.com/docs/en/checkpointing), [Codex: aprobaciones y seguridad](https://learn.chatgpt.com/docs/agent-approvals-security), [Codex: comandos de barra](https://learn.chatgpt.com/docs/developer-commands?surface=cli). En Claude Code, el modo `default` aparece en la interfaz con el nombre **Manual**. En Codex, además, el sandbox protege como solo lectura la carpeta `.git` (y `.codex`, `.agents` y `.aws`, si existen) aunque el resto del proyecto tenga escritura, y en una carpeta **sin** control de versiones arranca en `read-only`.

**Ahora haz algo — micropráctica (6 min):** elige el modo y los permisos para cuatro tareas → **[Elegir cuánto puede hacer el agente sin preguntar](/practica/ip-ia-019-permisos-del-agente-por-tarea)**.

**Práctica real (30 min):**

1. **Crea el repositorio de práctica.** En una carpeta nueva `sit-agente-lab`, crea estos archivos (los nombres de carpeta importan):

   `package.json`
   ```json
   {
     "name": "sit-agente-lab",
     "version": "1.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "test": "node --test"
     }
   }
   ```

   `src/sla.mjs`
   ```js
   // Horas de SLA según la prioridad de la solicitud (regla de SIT)
   const HORAS_POR_PRIORIDAD = { Alta: 8, Media: 24, Baja: 72 };

   export function calcularVencimiento(creadaEn, prioridad) {
     const horas = HORAS_POR_PRIORIDAD[prioridad] ?? 72; // si no la reconoce, la trata como Baja
     return new Date(creadaEn.getTime() + horas * 60 * 60 * 1000);
   }
   ```

   `src/aviso.mjs`
   ```js
   import { calcularVencimiento } from "./sla.mjs";

   // Texto del correo que recibe el solicitante
   export function textoDeAviso(solicitud) {
     const vence = calcularVencimiento(solicitud.creadaEn, solicitud.prioridad);
     return `La solicitud ${solicitud.id} vence el ${vence.toISOString()}`;
   }
   ```

   `test/sla.test.mjs`
   ```js
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { calcularVencimiento } from "../src/sla.mjs";

   const creada = new Date("2026-11-02T08:00:00Z");
   const horasHasta = (fecha) => (fecha.getTime() - creada.getTime()) / 3600000;

   test("Alta vence a las 8 horas", () => {
     assert.equal(horasHasta(calcularVencimiento(creada, "Alta")), 8);
   });

   test("Baja vence a las 72 horas", () => {
     assert.equal(horasHasta(calcularVencimiento(creada, "Baja")), 72);
   });
   ```

   `README.md` con una línea: `Práctica del Módulo 45. Ejecuta npm test para correr las pruebas.`
2. En una terminal, dentro de `sit-agente-lab`, ejecuta `npm test`. **Qué deberías ver:** `tests 2`, `pass 2`, `fail 0`.
3. Guarda el punto de partida: `git init`, `git add .` y `git commit -m "Punto de partida"`. En Windows puedes ver avisos de que Git cambiará LF por CRLF: son normales.
4. **Arranca el agente sin permiso de edición** en esa carpeta: `claude --permission-mode plan` (Claude Code), `codex --sandbox read-only` (Codex) o, en VS Code, el agente **Ask** de Copilot. Escribe:
   ```
   Sin modificar ningún archivo: lista cada lugar de este repositorio donde se importa o se llama
   calcularVencimiento (archivo y número de línea) y explica qué pasa hoy si la prioridad llega
   como "alta", en minúsculas.
   ```
5. **Compara con tu propia búsqueda:** sal del agente (o abre otra terminal) y ejecuta `git grep -n calcularVencimiento`. **Qué deberías ver:** seis líneas en tres archivos (`src/aviso.mjs`, `src/sla.mjs` y `test/sla.test.mjs`). Marca las que el agente omitió o inventó.
6. Ejecuta `git status`. **Qué deberías ver:** `nothing to commit, working tree clean`. Si aparece algún archivo modificado, el agente no estaba en un modo de solo lectura: anota cuál usaste.

**Si no lo ves:** si `claude` o `codex` "no se reconoce como comando", abre una terminal nueva (el instalador cambia el PATH) y comprueba con `claude --version` o `codex --version`. Si Codex arranca en solo lectura aunque no lo pediste, puede que no hayas confiado aún en la carpeta o que la carpeta todavía no tenga Git (paso 3): su documentación indica que puede empezar en `read-only` hasta que confías en el directorio, y que una carpeta sin control de versiones usa `read-only` por defecto.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Agente, versión (`claude --version` / `codex --version`) y plan que usas | ___ |
| Modo o sandbox con el que lo arrancaste | ___ |
| Líneas que listó el agente vs. las seis de `git grep` (omitidas / inventadas) | ___ |
| Qué dijo que pasa con "alta" en minúsculas (frase exacta) | ___ |
| Salida de `git status` al terminar | ___ |

---

## 🧩 Microlección 2 — Instrucciones del repositorio: lo que guían y lo que no garantizan

**¿Qué vas a aprender?** A fijar las convenciones del proyecto en un archivo que el agente lee al empezar cada sesión, a comprobar que lo cargó y a distinguir una instrucción de un control que bloquea.

**¿Por qué existe esto?** Sin contexto, el agente decide por su cuenta si puede tocar el README o cambiar una prueba. Con instrucciones, lo intenta evitar. Con un permiso `deny`, no puede.

**Qué lee cada agente (según su documentación):**
- **Claude Code** carga `CLAUDE.md` (o `.claude/CLAUDE.md`) del proyecto, tu `~/.claude/CLAUDE.md` personal y un `CLAUDE.local.md` para preferencias que no se suben al repositorio. `/init` genera un `CLAUDE.md` inicial analizando el código y `/memory` abre estos archivos. Si el repositorio tiene `AGENTS.md` y **no** tiene `CLAUDE.md`, Claude Code lee `AGENTS.md` (desde la versión 2.1.277) y lo avisa al empezar con una línea del tipo `no CLAUDE.md found; AGENTS.md loaded`. Para ver qué archivos cargó, `/memory` lista sus rutas (incluido un `AGENTS.md` que haya leído) y `/context all` los muestra en **Memory files**. Ojo: un `CLAUDE.local.md` también cuenta como `CLAUDE.md`, así que si creas uno, Claude Code deja de leer `AGENTS.md`. La documentación lo dice sin rodeos: Claude trata estos archivos **como contexto, no como configuración que se impone**; para bloquear una acción hay que usar permisos o un hook ([Claude Code: memoria](https://code.claude.com/docs/en/memory), [Claude Code: permisos](https://code.claude.com/docs/en/permissions)).
- **Codex** lee `AGENTS.md`: primero el global de `~/.codex` y después los del proyecto, desde la raíz hasta la carpeta actual (el más cercano se lee al final), hasta un máximo combinado de 32 KiB (`project_doc_max_bytes`). `/init` genera un `AGENTS.md` inicial. Para comprobar qué cargó, la documentación propone pedirle que resuma las instrucciones que está siguiendo ([Codex: AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Codex: comandos de barra](https://learn.chatgpt.com/docs/developer-commands?surface=cli)).
- **Copilot en VS Code** también usa `AGENTS.md` de la raíz (Módulo 44). Un solo `AGENTS.md` sirve, entonces, para los tres agentes.

**Práctica real (30 min):**

1. En `sit-agente-lab`, crea `AGENTS.md` con este contenido (escríbelo a mano; si prefieres probar `/init`, hazlo en una copia de la carpeta y compara lo que genera):
   ```markdown
   # Convenciones de sit-agente-lab
   - Después de cualquier cambio, ejecuta `npm test` y muestra la salida real del comando.
   - No modifiques archivos que la tarea no nombre; si crees que hace falta, propónlo y espera.
   - Nunca cambies una prueba existente para que pase: si una prueba falla, explica por qué.
   - Una prioridad que no sea Alta, Media o Baja es un error: no la trates como un valor por defecto.
   ```
2. Haz commit: `git add AGENTS.md` y `git commit -m "Instrucciones del repositorio"`.
3. Abre una sesión nueva del agente y pídele: `Resume en tres viñetas las instrucciones de este repositorio que vas a seguir.` En Claude Code, busca también al empezar la línea `no CLAUDE.md found; AGENTS.md loaded` y ejecuta `/memory`: la ruta de tu `AGENTS.md` debe aparecer en la lista. Anota si lo cargó.
4. **Instrucción contra control.** Crea un archivo `.env` con una línea **falsa**: `SIT_TOKEN=prueba-no-real-123`, y un `.gitignore` con la línea `.env`. Agrega a `AGENTS.md` la viñeta `- No leas el archivo .env.` (sin commit todavía). Pídele al agente: `¿Qué valor tiene SIT_TOKEN en este proyecto?` y anota qué hizo: ¿se negó por la instrucción o lo leyó?
5. **Solo en Claude Code:** crea `.claude/settings.json` con una regla que lo bloquee, repite la pregunta en una sesión nueva y anota la diferencia:
   ```json
   {
     "permissions": {
       "deny": ["Read(./.env)"]
     }
   }
   ```
   La documentación aclara el límite de esta regla: bloquea las herramientas de archivo de Claude y comandos como `cat` o `head` sobre esa ruta, pero **no** un script de Node o Python que abra el archivo por su cuenta; para un bloqueo a nivel del sistema operativo hay que activar el sandbox (que en Windows nativo no está disponible; sí en WSL 2). **En Codex y Copilot:** la protección más segura de un secreto es que no esté en la carpeta en la que trabaja el agente.
6. Al terminar, borra el `.env` de prueba, vuelve a dejar `AGENTS.md` con las cuatro viñetas del paso 1 (`git restore AGENTS.md`) y haz commit del `.gitignore` (y de `.claude/settings.json` si lo creaste: es configuración del proyecto que se comparte con el equipo) con `git add .` y `git commit -m "Ignorar .env"`. `git status` debe quedar limpio para la Microlección 3.

**Si no lo ves:** si el agente no menciona tus instrucciones, comprueba que el archivo se llame exactamente `AGENTS.md` (en mayúsculas) y esté en la raíz de la carpeta desde la que lo arrancaste. En Claude Code, si también existe un `CLAUDE.md`, `.claude/CLAUDE.md` o `CLAUDE.local.md` en esa carpeta o en una superior, lee ese **en vez de** `AGENTS.md` (tu `~/.claude/CLAUDE.md` personal no cuenta); y leer `AGENTS.md` directamente exige la versión 2.1.277 o posterior (`claude --version`).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Resumen de las instrucciones que dio el agente (cópialo) | ___ |
| Cómo comprobaste que cargó `AGENTS.md` (línea de inicio, `/memory`, resumen) | ___ |
| Qué hizo ante la pregunta por `SIT_TOKEN` **solo con la instrucción** | ___ |
| (Claude Code) Qué hizo **con la regla `deny`** | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: "todas las pruebas pasan"

**¿Qué vas a aprender?** A revisar el resultado de un agente con evidencia propia: lo que cambió de verdad (`git diff`), si las pruebas miden tu criterio y si respetó el alcance; y a corregirlo.

**¿Por qué existe esto?** Es el Caso Real de este módulo en pequeño. Aunque la tarea esté bien acotada, el agente puede cumplir la letra ("las pruebas pasan") y no el criterio. Aquí todos parten del mismo resultado, así que la evidencia es comparable.

**El problema:** desde el formulario web las prioridades llegan como `alta` o ` Alta ` y esas solicitudes vencen a las 72 horas en vez de 8. Alguien delegó al agente esta tarea, bien acotada:
```
En src/sla.mjs, haz que calcularVencimiento acepte la prioridad sin distinguir mayúsculas ni
espacios alrededor ("alta", " Alta "), y que lance un Error si la prioridad no es Alta, Media
ni Baja. Agrega pruebas para esos dos casos en test/sla.test.mjs. Ejecuta npm test y muéstrame
la salida real. No modifiques ningún otro archivo.
```

**El resultado del agente.** Su resumen final fue: *"Listo. Normalicé la prioridad, agregué 2 pruebas y actualicé el README. npm test: 4 pruebas, 4 pasan."* Reproduce sus cambios en tu repositorio (parte de `git status` limpio):

- Reemplaza `src/sla.mjs` por:
  ```js
  // Horas de SLA según la prioridad de la solicitud (regla de SIT)
  const HORAS_POR_PRIORIDAD = { alta: 8, media: 24, baja: 72 };

  export function calcularVencimiento(creadaEn, prioridad) {
    const clave = String(prioridad).trim().toLowerCase();
    const horas = HORAS_POR_PRIORIDAD[clave] ?? 72; // valor seguro por defecto
    return new Date(creadaEn.getTime() + horas * 60 * 60 * 1000);
  }
  ```
- Agrega al final de `test/sla.test.mjs`:
  ```js
  test("acepta minúsculas y espacios", () => {
    assert.equal(horasHasta(calcularVencimiento(creada, " alta ")), 8);
  });

  test("una prioridad desconocida usa el valor por defecto", () => {
    assert.equal(horasHasta(calcularVencimiento(creada, "Urgente")), 72);
  });
  ```
- Agrega al final de `README.md` una sección `## Cambios` con la línea `- La prioridad ya no distingue mayúsculas.`

**Diagnosticar antes de corregir — micropráctica (7 min):** con el resumen del agente y lo que muestra Git, di qué está mal antes de ver las pistas → **[Diagnosticar: "todas las pruebas pasan", pero el criterio no se cumple](/practica/ip-ia-020-pruebas-pasan-criterio-no)**.

**Práctica real (40 min):**

1. Ejecuta `npm test`. **Qué deberías ver:** `tests 4`, `pass 4`, `fail 0`. Es exactamente lo que reportó el agente.
2. Ejecuta `git diff --stat`. **Qué deberías ver:** tres archivos cambiados: `README.md`, `src/sla.mjs` y `test/sla.test.mjs`. Compáralo con la tarea: ¿cuál sobra?
3. Ejecuta `git diff test/sla.test.mjs` y lee la segunda prueba nueva. Contrástala con el criterio de la tarea ("lance un Error si la prioridad no es Alta, Media ni Baja"): ¿qué está comprobando en realidad?
4. **Escribe tu prueba de aceptación** a partir del criterio, en un archivo aparte que el agente no tocó: `test/aceptacion.test.mjs`.
   ```js
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { calcularVencimiento } from "../src/sla.mjs";

   const creada = new Date("2026-11-02T08:00:00Z");

   test("criterio 2: una prioridad desconocida lanza un error", () => {
     assert.throws(() => calcularVencimiento(creada, "Urgente"));
   });
   ```
   Agrega tú dos pruebas más con el mismo patrón: una con la prioridad ausente (`undefined`) y otra con `"constructor"` (un nombre que existe en todos los objetos de JavaScript). Ejecuta `npm test`. **Qué deberías ver:** `tests 7`, `pass 4`, `fail 3`.
5. **Corrige** con estos criterios de aceptación: (1) pasan todas las pruebas, incluidas las tuyas; (2) no queda ningún valor por defecto para una prioridad desconocida; (3) la prueba del agente que confirmaba el comportamiento erróneo se elimina o se reemplaza (por ejemplo, por una que compruebe que `Media` vence a las 24 horas); (4) `README.md` vuelve a su estado original con `git restore README.md`. **Pista si tu corrección pasa todo menos `"constructor"`:** un objeto literal hereda propiedades como `constructor`; un `Map` solo contiene las claves que pusiste (`new Map([["alta", 8], ["media", 24], ["baja", 72]])` y `.get(clave)`).
6. Ejecuta `npm test` hasta ver `fail 0` (con la prueba de `Media`, son `tests 7` y `pass 7`) y `git diff --stat`: solo deben aparecer `src/sla.mjs` y `test/sla.test.mjs` (más tu `test/aceptacion.test.mjs` como archivo nuevo en `git status`).
7. **Rompe a propósito:** en tu `src/sla.mjs` corregido, cambia temporalmente el `throw` por un `return` con 72 horas y ejecuta `npm test`: tienen que fallar tus tres pruebas de aceptación. Deshaz el cambio.
8. **Efecto aguas arriba:** recuerda la búsqueda de la Microlección 1. ¿Qué devuelve ahora `textoDeAviso` si una solicitud llega con prioridad `"Urgente"`? Anótalo: quien mantenga el formulario necesita saberlo.
9. **(Opcional, con tu agente real)** vuelve al commit de la Microlección 2 con `git stash -u` (guarda tus cambios aparte), dale a tu agente la misma tarea y revisa su resultado con los pasos 1 a 4. Anota si cambió alguna prueba, si tocó archivos fuera del alcance y si mostró la salida real de `npm test`. Recupera tu corrección con `git stash pop`.

**Evidencia a reportar (una fila por fallo):**

| Fallo encontrado | Evidencia (comando y lo que mostró) | Corrección aplicada | Contra qué criterio de la tarea lo verificaste |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| `npm test` con el resultado del agente / con tus pruebas de aceptación / con tu corrección | ___ |
| Salida de `git diff --stat` antes y después de corregir | ___ |
| Qué devuelve ahora `textoDeAviso` con prioridad `"Urgente"` | ___ |
| (Opcional) Qué hizo tu agente real con la misma tarea | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — los permisos del agente para el equipo

> **Situación:** SIT va a usar agentes de código en el repositorio de su app de solicitudes. El repositorio tiene un `.env` con la URL del ambiente de desarrollo, CI que corre pruebas en cada pull request y una rama `main` protegida. Un desarrollador propone "arrancar siempre con todos los permisos para no aprobar nada".
> **Entrega:** la configuración que propones (el `.claude/settings.json` y/o el `.codex/config.toml` del proyecto, más tu `AGENTS.md`) y cinco líneas que la defiendan.

Puntos de partida verificados en la documentación oficial, para que los adaptes, no para copiarlos tal cual:

```json
{
  "permissions": {
    "allow": ["Bash(npm test *)", "Bash(npm run lint *)"],
    "deny": ["Read(./.env)", "Bash(git push *)"]
  }
}
```
En Claude Code las reglas se evalúan en este orden: `deny`, después `ask`, después `allow`; la primera que coincide decide, y un `allow` no puede abrir una excepción dentro de un `deny` ([Claude Code: permisos](https://code.claude.com/docs/en/permissions)).

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"

[sandbox_workspace_write]
network_access = false
```
En Codex, un `.codex/config.toml` del proyecto solo se carga si confías en el proyecto, y los indicadores de la línea de comandos tienen prioridad sobre él ([Codex: configuración](https://learn.chatgpt.com/docs/config-file/config-basic); la clave `sandbox_workspace_write.network_access` está en la [referencia de configuración](https://learn.chatgpt.com/docs/config-file/config-reference)).

No hay una única configuración correcta: se evalúa que cada decisión esté justificada. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Permisos proporcionales al riesgo | Dices qué corre sin preguntar (pruebas, lint) y qué exige aprobación, y por qué no aceptas `bypassPermissions` ni `--yolo` en el portátil |
| Distingues instrucción de control | Lo que no debe pasar nunca (leer el `.env`, hacer push) está en un control (`deny`, sandbox, protección de rama), no solo en `AGENTS.md` |
| Conoces los límites de cada control | Citas al menos uno: `/rewind` no deshace lo que hizo un comando de Bash, una regla `Read` no frena un script que abre el archivo, el sandbox de Codex no tiene red por defecto |
| La verificación no depende del agente | Tu proceso incluye `git diff` y pruebas de aceptación escritas a partir del criterio, además de las que escriba el agente |
| Aplicas tu evidencia | Tu defensa cita algo que viste en las Microlecciones 2 o 3 |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu configuración (archivos y contenido) | ___ |
| Lo que dejas sin aprobación y lo que no, con la razón | ___ |
| Criterio de la rúbrica que más te costó y cómo lo resolviste | ___ |

---

## 🔁 Reto de transferencia — Delegar un análisis, no un cambio

Cambia el tipo de tarea: ahora el agente no edita, analiza, y su resultado se usará para planificar trabajo. Tras el incidente del Caso Real del Módulo 42 (un plugin con llamadas síncronas a Dataverse dentro de un bucle), el arquitecto de SIT quiere que un agente revise el repositorio de plugins C# (unos 60 archivos) y liste **todos los lugares donde se llama al servicio de la organización dentro de un bucle**. Y añade: "de paso, que arregle lo que encuentre".

1. **Micropráctica (7 min):** **[Transferir: delegar un análisis de un repositorio de plugins](/practica/ip-ia-021-delegar-analisis-repositorio-plugins)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel** (no necesitas el repositorio): escribe el prompt que le darías al agente, el modo en que lo arrancarías, el formato del resultado que exiges y cómo comprobarías una muestra por tu cuenta. Si ya hiciste el Módulo 23, puedes probarlo de verdad sobre tus propios plugins (opcional).

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona |
|---|---|---|
| Modo o sandbox para el análisis | ___ | ___ |
| Formato del resultado (qué debe traer cada hallazgo) | ___ | ___ |
| Cómo verificas una muestra sin depender del agente | ___ | ___ |
| Qué haces con el "de paso, que arregle lo que encuentre" | ___ | ___ |

### 💼 Casos Reales de Negocio
Un arquitecto de SIT le pidió a un agente de código "optimiza el proyecto" sin más contexto. El agente hizo cambios extensos en archivos no relacionados con el problema real (un formulario lento), incluyendo un refactor de componentes que nadie pidió, generando un PR de 40 archivos imposible de revisar en una sola sesión. La lección adoptada por el equipo: toda tarea delegada a un agente debe tener un alcance explícito y un criterio de éxito verificable (ej. "reduce el tiempo de carga de este formulario específico; no toques otros archivos").

### ✅ Buenas Prácticas
- Delegar tareas acotadas y verificables, nunca instrucciones vagas tipo "mejora esto".
- Pedir siempre que el agente ejecute la verificación disponible (tests, lint, build) como parte de la tarea, no como un paso aparte olvidado.
- Revisar el plan que el agente propone antes de dejarlo ejecutar cambios extensos, sobre todo en un monorepo con múltiples superficies (app + docs).
- Empezar en un modo que no edita (`plan` en Claude Code, `read-only` en Codex) para entender un repositorio, y contrastar el análisis con `git grep`.
- Hacer commit antes de delegar y revisar después con `git status` y `git diff --stat`: el resumen del agente no es la lista de cambios.
- Escribir tú las pruebas de aceptación a partir del criterio, en un archivo que el agente no toque; no dar por buenas las pruebas que el agente escribió para su propio cambio.
- Fijar las convenciones en `AGENTS.md` o `CLAUDE.md` y poner en un control (`deny`, sandbox, protección de rama) lo que no debe pasar nunca.
- No arrancar con `bypassPermissions` ni `--yolo` fuera de un contenedor o una máquina virtual aislada.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Delegar una tarea vaga y obtener un cambio enorme e inmanejable | Falta de alcance explícito en la instrucción | Definir siempre el archivo/función objetivo y el criterio de éxito antes de delegar |
| No pedir verificación automática (tests/lint) tras el cambio | Asumir que el código generado es correcto sin ejecutarlo | Incluir la ejecución de tests/lint como parte explícita de la tarea |
| Confundir "agente" con "chat que da buenas respuestas" | No distinguir la capacidad de usar herramientas del agente | Verificar si la herramienta puede ejecutar comandos/leer archivos antes de asumir ese nivel de autonomía |
| "Todas las pruebas pasan", pero el criterio no se cumple | El agente escribió una prueba que confirma el comportamiento que había que eliminar | Leer el diff de las pruebas y añadir pruebas de aceptación propias a partir del criterio |
| El agente cambió un archivo que la tarea no nombraba | El resumen final no lo destacó y nadie miró `git diff --stat` | Revisar siempre la lista de archivos cambiados y revertir lo que sobra con `git restore` |
| Confiar en que `AGENTS.md` o `CLAUDE.md` impiden leer un secreto | Las instrucciones son contexto, no control | Regla `deny`, sandbox, o sacar el secreto de la carpeta del agente |
| Creer que `/rewind` lo deshace todo | No deshace lo que hizo un comando de Bash en archivos que Claude no editó, ni sustituye a Git | Commit antes de delegar; revertir con Git |
| Arrancar con todos los permisos "para no aprobar nada" | Comodidad | Permisos proporcionales: pruebas y lint sin preguntar; push, despliegues y secretos con aprobación o bloqueados |

### 🧪 Criterios de Validación
- [ ] Uso el prompt de búsqueda para localizar todas las ocurrencias de un patrón en el repo y confirmo el resultado manualmente con `git grep`
- [ ] Arranqué el agente en un modo que no edita (`plan`, `read-only` o **Ask**) y comprobé con `git status` que no cambió nada
- [ ] Creé un `AGENTS.md` (o `CLAUDE.md`), comprobé que el agente lo cargó y documenté la diferencia entre una instrucción y una regla que bloquea
- [ ] Revisé el resultado del agente con `git diff --stat` y `git diff`, y encontré el archivo fuera del alcance y la prueba que confirmaba el comportamiento erróneo
- [ ] Escribí pruebas de aceptación a partir del criterio de la tarea, corregí el código hasta `fail 0` y comprobé, rompiéndolo a propósito, que mis pruebas fallan cuando deben
- [ ] Diagnostiqué el caso "todas las pruebas pasan" formulando una hipótesis antes de ver las pistas
- [ ] Delego la tarea acotada con criterio de éxito verificable y confirmo con evidencia propia que el agente ejecutó la verificación y respetó el alcance
- [ ] Comparo un prompt vago vs. uno acotado para la misma intención y documento la diferencia de calidad y tamaño del cambio
- [ ] Confirmo que un agente ejecutó `npm test` o `npm run lint` (o el gate correspondiente) y me mostró el resultado real, no una suposición
- [ ] Decidí y defendí una configuración de permisos para el equipo contra la rúbrica
- [ ] En el reto de transferencia definí el modo, el formato del resultado y la verificación independiente de un análisis delegado
- [ ] Relaciono este módulo con cualquier lab donde delegue a un agente una tarea de análisis o cambio acotado antes de entregarlo como evidencia (por ejemplo, el Lab 45)

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- Tu repositorio `sit-agente-lab` con su historial de Git, tu `AGENTS.md`, tu `test/aceptacion.test.mjs` y la salida de `npm test` y `git diff --stat` antes y después de corregir.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 48 convierte la revisión de la Microlección 3 en una checklist de PR, el Módulo 49 cubre secretos y datos sensibles, y el Módulo 50 lleva las pruebas de aceptación a CI. El Módulo 44 hace el mismo recorrido con el agente de Copilot en VS Code.
