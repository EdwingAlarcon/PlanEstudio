---
moduleId: 51
title: "Flujo Recomendado: Humano Diseña, IA Implementa, CI Valida, Humano Aprueba"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 18
practiceMinutes: 180
slug: "flujo-recomendado-humano-ia-ci"
lastVerified: "2026-11"
---
*Lectura: 15-18 min · Práctica: unas 3 horas la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2: dejar el repositorio con su gate de CI; la segunda, la Microlección 3, la decisión y el reto de transferencia).*

### 🎯 Objetivo
Aplicar de punta a punta el flujo recomendado de desarrollo asistido por IA — humano diseña, IA implementa, CI valida, humano aprueba — sobre un cambio real en un repositorio propio, integrando lo aprendido en los módulos 42-50. Al terminar habrás escrito el criterio de éxito como una prueba antes de pedirle nada a la IA, habrás dejado la rama principal protegida por un gate de CI que no se puede saltar, y habrás detectado (con el diff y el log de CI como evidencia) un pull request de la IA que salió en verde porque debilitó el gate en lugar de cumplir el criterio.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste, no un sí/no). La Microlección 3 es una actividad de **fallo y corrección**: recibes el pull request que entregó la IA, con el CI en verde y tres problemas plausibles; los encuentras con el diff y el log, los corriges y anotas contra qué lo verificaste. Cierras **decidiendo y defendiendo** qué hacer con un gate que estorba un viernes por la tarde, y con un **reto de transferencia** al mismo flujo en una solución low-code de Power Platform.
>
> **Antes de empezar, necesitas:**
> - **Git**, **Node.js LTS** (en noviembre de 2026, la 26 o la 24; la 20 ya no tiene soporte desde el 30 de abril de 2026) y un editor. Comprueba con `git --version` y `node --version` en una terminal; si alguno no existe, instálalo y vuelve a abrir la terminal.
> - Una **cuenta gratuita de GitHub**. El repositorio de práctica será **público**: con GitHub Free, los rulesets solo están disponibles en repositorios públicos ([GitHub Docs: About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)) y en ellos los runners estándar de GitHub Actions son gratis ([GitHub Docs: Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)). Por eso **no pongas en él nada real**: ni datos de clientes, ni URLs de tu tenant, ni secretos.
> - Un asistente de IA es opcional (GitHub Copilot Free sirve, Módulo 44). **Si no tienes ninguno**, la Microlección 3 te da la salida de la IA ya escrita: todos parten del mismo pull request para que la evidencia sea comparable.
> - Este módulo es transversal: no exige ningún nivel de certificación ni un tenant de Power Platform. Si ya hiciste los Módulos 46 (vibe coding controlado), 48 (revisión de diffs) y 50 (tests y CI), aquí los juntas; si no, todo lo necesario está aquí.

### 📖 Conceptos Clave
- **Humano diseña:** la persona define el problema, el alcance y el criterio de éxito antes de involucrar a la IA — esta etapa no se delega (Módulo 45: tareas acotadas y verificables). El mejor criterio de éxito es el que se puede **ejecutar**: una prueba que hoy falla y que pasará cuando el cambio esté bien hecho.
- **IA implementa:** el agente o asistente genera el cambio dentro del alcance definido, usando prompts reutilizables cuando aplica (Módulo 47) y evitando vibe coding sin control en tareas de riesgo (Módulo 46).
- **CI valida:** el pipeline (lint, typecheck, tests, build) confirma objetivamente que el cambio no rompe nada existente (Módulo 50) — esta etapa nunca se salta, sin importar cuán simple parezca el cambio. En GitHub, la forma de que "nunca se salte" no dependa de la memoria de nadie es un **ruleset** sobre la rama principal que exige un pull request y que el check de CI pase antes de fusionar.
- **Humano aprueba:** una persona revisa el diff completo contra el criterio de éxito original, verificando alcance, efectos secundarios y seguridad (Módulo 48), antes de fusionar — la aprobación es la última barrera, no un trámite.
- **Un check verde no prueba que el criterio se cumplió:** prueba que lo que se ejecutó terminó bien. Si el cambio omite una prueba (`skip`), cambia lo que una prueba espera o marca un paso con `continue-on-error: true` (que, según la documentación de GitHub, deja pasar el job aunque ese paso falle: [GitHub Docs: Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)), el gate queda en verde y vacío. Por eso la aprobación humana revisa también los archivos de pruebas y de pipeline que el cambio tocó.
- **El ciclo se repite, no se acorta:** ante un resultado insatisfactorio en cualquier etapa, se vuelve a la etapa anterior (ej. si CI falla, se ajusta la implementación; si la implementación no cumple el criterio, se re-especifica el diseño) — nunca se salta una etapa para "avanzar más rápido".

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Humano diseña: el criterio de éxito escrito como prueba

**¿Qué vas a aprender?** A convertir "quiero un mensaje de error más claro" en un alcance cerrado y en una prueba que falla hoy, antes de abrir el chat de la IA.

**¿Por qué existe esto?** Si el criterio es "que quede mejor", nadie puede decir si la IA lo cumplió, y la revisión se vuelve una opinión. Si el criterio es una prueba, CI lo comprueba en cada intento y el revisor solo tiene que confirmar que la prueba no se tocó.

**Ahora haz algo — micropráctica (5 min):** **[Escribir un criterio de éxito verificable antes de pedirle nada a la IA](/practica/ip-ia-034-criterio-de-exito-verificable)**.

**Práctica real (25 min):**

1. Crea una carpeta `sit-flujo-ia` y ábrela en tu editor. Dentro crea estos tres archivos. Es una función pequeña que valida una solicitud de gasto; su defecto es que todos los errores dicen lo mismo:
   ```json
   {
     "name": "sit-flujo-ia",
     "private": true,
     "type": "module",
     "scripts": {
       "test": "node --test"
     }
   }
   ```
   Guárdalo como `package.json`. Después, `src/validar-solicitud.mjs`:
   ```js
   // src/validar-solicitud.mjs: valida una solicitud de gasto antes de guardarla
   export function validarSolicitud(solicitud) {
     const errores = [];
     if (typeof solicitud.titulo !== "string" || solicitud.titulo.trim() === "") {
       errores.push("Error de validación");
     }
     if (typeof solicitud.monto !== "number" || !Number.isFinite(solicitud.monto) || solicitud.monto <= 0) {
       errores.push("Error de validación"); // el monto debe ser un número mayor que cero
     }
     if (typeof solicitud.centroCosto !== "string" || solicitud.centroCosto.trim() === "") {
       errores.push("Error de validación");
     }
     return { ok: errores.length === 0, errores };
   }
   ```
   Y `test/validar-solicitud.test.mjs`, con las pruebas que "ya existían":
   ```js
   // test/validar-solicitud.test.mjs: pruebas que ya existían antes del cambio
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { validarSolicitud } from "../src/validar-solicitud.mjs";

   const valida = { titulo: "Viáticos Monterrey", monto: 1500, centroCosto: "CC-210" };

   test("una solicitud completa es válida", () => {
     assert.deepEqual(validarSolicitud(valida), { ok: true, errores: [] });
   });

   test("rechaza un monto negativo", () => {
     assert.equal(validarSolicitud({ ...valida, monto: -50 }).ok, false);
   });

   test("rechaza un monto que llegó como texto", () => {
     assert.equal(validarSolicitud({ ...valida, monto: "12,000" }).ok, false);
   });
   ```
2. En una terminal abierta en `sit-flujo-ia`, ejecuta `npm test`. **Qué deberías ver:** al final, `pass 3` y `fail 0`. **Si dice que no encuentra pruebas**, revisa que el archivo esté en la carpeta `test` y termine en `.test.mjs`.
3. **Escribe el diseño** en un archivo `DISENO.md` (cinco líneas bastan): el problema ("todos los errores dicen *Error de validación*"), el alcance ("solo cambia `src/validar-solicitud.mjs`; las pruebas existentes y el pipeline no se tocan"), lo que **no** cambia ("la regla de qué es un monto válido sigue igual"), el criterio de éxito y quién aprueba.
4. **Escribe el criterio de éxito como prueba.** Crea `test/mensajes.test.mjs`:
   ```js
   // test/mensajes.test.mjs: el criterio de éxito escrito como prueba ANTES de pedirle nada a la IA
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { validarSolicitud } from "../src/validar-solicitud.mjs";

   test("cada error empieza con el nombre del campo que falló", () => {
     const r = validarSolicitud({ titulo: " ", monto: 0, centroCosto: "" });
     assert.equal(r.ok, false);
     assert.deepEqual(r.errores.map((e) => e.split(":")[0]), ["titulo", "monto", "centroCosto"]);
   });

   test("una solicitud con un solo campo mal da un solo error, con ese campo", () => {
     const r = validarSolicitud({ titulo: "Viáticos", monto: 1500, centroCosto: "" });
     assert.deepEqual(r.errores.map((e) => e.split(":")[0]), ["centroCosto"]);
   });
   ```
5. Ejecuta `npm test` otra vez. **Qué deberías ver:** `pass 3`, `fail 2`: fallan exactamente las dos pruebas nuevas. Eso es lo que quieres. Una prueba de criterio que pasa **antes** del cambio no mide nada. **Si fallan otras**, revisa que no hayas tocado la función.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu criterio de éxito en una frase | ___ |
| Archivos que el alcance permite tocar (y los que prohíbe) | ___ |
| Resultado de `npm test` antes de escribir el criterio (`pass` / `fail`) | ___ |
| Resultado después de agregar `test/mensajes.test.mjs` y nombre de las pruebas que fallan | ___ |

---

## 🧩 Microlección 2 — CI valida: un gate que nadie puede saltar

**¿Qué vas a aprender?** A poner el criterio en un pipeline de GitHub Actions y a proteger la rama `main` con un ruleset, para que fusionar sin el check en verde sea imposible y no "una regla del equipo".

**¿Por qué existe esto?** El Caso Real de este módulo nace de dos incidentes por saltarse CI "para ir más rápido". Mientras saltarse la etapa sea posible, alguien lo hará con prisa.

**Práctica real (40 min):**

1. Crea `.github/workflows/ci.yml`:
   ```yaml
   # .github/workflows/ci.yml: el gate que corre en cada pull request hacia main
   name: CI

   on:
     pull_request:
       branches: [main]
     push:
       branches: [main]

   permissions:
     contents: read

   jobs:
     pruebas:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v7
         - uses: actions/setup-node@v7
           with:
             node-version: 24
         - name: Ejecutar pruebas
           run: npm test
   ```
   El job se llama `pruebas`: ese será el nombre del check que vas a exigir (GitHub Docs: para un workflow, el nombre del check es el nombre del job, [Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules)).
2. **Sube la base sin el criterio todavía.** Mueve `test/mensajes.test.mjs` y `DISENO.md` fuera de la carpeta del repositorio por un momento (los vas a necesitar en el paso 5). En GitHub, arriba a la derecha, **+** > **New repository**: nombre `sit-flujo-ia`, visibilidad **Public**, sin README, y **Create repository**. Después, en tu terminal:
   ```bash
   git init
   git add .
   git commit -m "Base: validación de solicitudes y CI"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/sit-flujo-ia.git
   git push -u origin main
   ```
   **Qué deberías ver:** en la pestaña **Actions** del repositorio, una ejecución de **CI** en verde. **Si falla**, abre la ejecución, despliega el paso **Ejecutar pruebas** y lee el primer error.
3. **Protege `main`.** En el repositorio: **Settings** > en la barra lateral, bajo "Code, planning, and automation", **Rules** > **Rulesets** > **New ruleset** > **New branch ruleset** ([GitHub Docs: Creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)). Configura:
   - **Ruleset name:** `proteger-main`.
   - **Enforcement status:** cámbialo a **Active**. Por defecto viene **Disabled**, y un ruleset desactivado no protege nada.
   - **Target branches:** **Add a target** > **Include default branch**.
   - Marca **Require a pull request before merging**. Si trabajas solo, deja las aprobaciones requeridas en **0**: GitHub no deja que el autor apruebe su propio pull request ([GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/approving-a-pull-request-with-required-reviews)). Si haces el módulo con un compañero, agrégalo como colaborador con permiso de escritura, pon **1** y que él revise: solo cuentan las aprobaciones de personas con permiso de escritura.
   - Marca la regla de status checks (en la documentación aparece como **Require status checks to pass before merging**), escribe `pruebas`, agrégalo con el botón **+** y guarda con **Create**.
   - Deja la **Bypass list** vacía. Cualquiera que esté ahí puede saltarse el gate.
4. Comprueba que funciona: intenta un `git push` directo a `main` con cualquier cambio trivial. **Qué deberías ver:** el push se rechaza y el mensaje menciona las reglas del repositorio. Deshaz ese cambio (`git reset --hard origin/main`).
5. **Lleva el criterio de diseño a un pull request.** Crea una rama, vuelve a poner `test/mensajes.test.mjs` y `DISENO.md` en su lugar y súbelos:
   ```bash
   git switch -c diseno/criterio-mensajes
   git add test/mensajes.test.mjs DISENO.md
   git commit -m "Diseño: criterio de éxito de los mensajes de error"
   git push -u origin diseno/criterio-mensajes
   ```
   En GitHub aparece un aviso con **Compare & pull request**: ábrelo y crea el pull request con **Create pull request**. **Qué deberías ver:** el check `pruebas` en rojo y el botón de fusionar bloqueado. Ese rojo es correcto: el criterio todavía no se cumple. **No lo fusiones.** Sobre esta rama trabajará la IA.

**Variante si no puedes usar GitHub** (por política de tu empresa, por ejemplo): haz los pasos 1 y 5 solo en local, ejecutando `npm test` en cada rama, y escribe en la evidencia qué regla del ruleset reemplazarías y con qué. Pierdes la prueba del bloqueo real; anótalo.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| URL del repositorio (público, sin datos reales) | ___ |
| Reglas activas del ruleset y estado de **Enforcement status** | ___ |
| Mensaje exacto que te dio el `git push` directo a `main` | ___ |
| Número del pull request del criterio, estado del check `pruebas` y qué dice el cuadro de fusión | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: el pull request de la IA que salió en verde

**¿Qué vas a aprender?** A revisar un pull request generado por IA mirando **qué archivos tocó** y **qué se ejecutó de verdad** en CI, no solo el color del check.

**¿Por qué existe esto?** Un asistente que recibe "haz que pasen las pruebas" tiene dos caminos: cumplir el criterio o debilitar lo que lo mide. Los dos dejan el check en verde.

**El prompt que se usó** (combina la plantilla del Módulo 47 con el patrón de tarea acotada del Módulo 45):
```
Rol: desarrollador de este proyecto Node.js.
Contexto: en src/validar-solicitud.mjs, todos los errores dicen "Error de validación".
Tarea: haz que cada error empiece con el nombre del campo que falló (titulo, monto o centroCosto),
seguido de dos puntos y el motivo. Las pruebas de test/mensajes.test.mjs describen el resultado esperado.
Restricciones: no toques ningún otro archivo ni cambies la regla de qué es un monto válido.
Verificación: ejecuta npm test al terminar y muéstrame el resultado.
```

**La salida de la IA.** El asistente respondió "Listo, todas las pruebas pasan" y entregó tres cambios. Para reproducirlo, desde la rama `diseno/criterio-mensajes` crea otra rama (`git switch -c ia/mensajes-error`) y aplica los tres:

1. Reemplaza `src/validar-solicitud.mjs` por esto:
   ```js
   // src/validar-solicitud.mjs: versión entregada por el asistente de IA (contiene errores a propósito)
   export function validarSolicitud(solicitud) {
     const errores = [];
     if (!solicitud.titulo?.trim()) {
       errores.push("titulo: es obligatorio");
     }
     const monto = Number(solicitud.monto); // normaliza el monto por si llega como texto
     if (!monto) {
       errores.push("monto: debe ser un número mayor que cero");
     }
     if (!solicitud.centroCosto?.trim()) {
       errores.push("centroCosto: es obligatorio");
     }
     return { ok: errores.length === 0, errores };
   }
   ```
2. En `test/validar-solicitud.test.mjs`, la prueba del monto negativo quedó así:
   ```js
   // Omitida: las notas de crédito pueden llevar monto negativo
   test("rechaza un monto negativo", { skip: true }, () => {
     assert.equal(validarSolicitud({ ...valida, monto: -50 }).ok, false);
   });
   ```
3. En `.github/workflows/ci.yml`, el paso de pruebas quedó así:
   ```yaml
         - name: Ejecutar pruebas
           run: npm test
           continue-on-error: true # evita que el pipeline se bloquee por pruebas inestables
   ```

Haz commit, `git push -u origin ia/mensajes-error` y abre un pull request de `ia/mensajes-error` hacia `main`. Incluye también el commit del diseño, así que puedes cerrar sin fusionar el pull request del criterio; para ver solo lo que cambió la IA usarás el `git diff` del paso 1. **Qué deberías ver:** el check `pruebas` en verde y el botón de fusionar habilitado.

**Diagnosticar antes de corregir — micropráctica (7 min):** QA ya encontró una solicitud con monto `-50` guardada como válida, y el pull request tenía todo en verde → **[Diagnosticar: CI en verde y un monto negativo aceptado](/practica/ip-ia-035-diagnosticar-ci-verde-con-gate-debilitado)**. Formula tu hipótesis antes de abrir las pistas.

**Práctica real (45 min):**

1. **Primero, el alcance.** En el pull request, pestaña **Files changed**, o en tu terminal:
   ```bash
   git diff --stat diseno/criterio-mensajes ia/mensajes-error
   ```
   El prompt permitía tocar **un** archivo. Anota cuántos tocó y cuáles.
2. **Después, qué se ejecutó de verdad.** Abre el check `pruebas` y despliega **Ejecutar pruebas**, o ejecuta `npm test` en la rama. Busca la línea `skipped`. Un check verde con pruebas omitidas no es lo mismo que un check verde.
3. **Ahora, la regla de negocio.** Comprueba en la terminal qué acepta la función de la IA (el `-50` y el `"1500"` en texto son los casos que te interesan):
   ```bash
   node -e "import('./src/validar-solicitud.mjs').then(m => { for (const monto of [-50, '1500', '12,000', 0]) console.log(JSON.stringify(monto), JSON.stringify(m.validarSolicitud({ titulo: 'x', monto, centroCosto: 'CC-1' }))) })"
   ```
   **Qué deberías ver** con la versión de la IA: `-50` y `"1500"` salen con `"ok":true`. `Number(-50)` es `-50`, que no es "falso", así que `!monto` no lo detiene; y `Number("1500")` convierte el texto en número, justo lo que la regla original prohibía.
4. **Corrige en el orden correcto.** Primero restaura la prueba (quita `{ skip: true }` y el comentario) y quita `continue-on-error: true` del workflow. Haz commit y push **sin tocar todavía la función**. **Qué deberías ver:** el check `pruebas` en rojo, con `rechaza un monto negativo` fallando. Ese rojo demuestra que el gate vuelve a medir. Solo entonces corrige la función: conserva los mensajes nuevos y vuelve a la validación original del monto (`typeof solicitud.monto !== "number" || !Number.isFinite(solicitud.monto) || solicitud.monto <= 0`). Agrega una prueba para el `"1500"` en texto, que nadie había escrito. Push otra vez: verde, con `skipped 0`.
5. **Si usas la IA para corregir**, dale la regla de negocio, la lista de archivos que no puede tocar y la prueba que falla. No le pidas "arréglalo".

**Evidencia a reportar (una fila por problema que encontraste):**

| Problema | Dónde lo viste (archivo y línea, o línea del log de CI) | Por qué el check seguía en verde | Tu corrección | Contra qué lo verificaste |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Archivos que tocó la IA según `git diff --stat` (y cuántos permitía el prompt) | ___ |
| Línea `skipped` del log con la versión de la IA y con la tuya | ___ |
| Estado del check después de restaurar la prueba y el workflow, antes de corregir la función | ___ |
| Etapa a la que tuviste que volver y por qué (implementación o diseño) | ___ |

**Contrasta tu revisión (solo después de llenar la tabla).** Los tres problemas plantados: (1) la función acepta montos negativos y montos en texto como `"1500"`, porque `Number()` convierte y `!monto` solo detiene el `0` y el `NaN`; (2) la prueba que lo habría detectado se omitió con una justificación de negocio inventada: nadie pidió notas de crédito, y si alguien las pidiera sería un cambio de **diseño**, que vuelve a la etapa 1 y no se cuela en un pull request de mensajes; (3) `continue-on-error: true` deja el gate vacío para cualquier cambio futuro, no solo para este. Hallazgo extra: con `titulo: 5` la versión de la IA lanza `TypeError`, porque `?.` solo protege de `null` y `undefined`, y un número no tiene `trim`.

---

### 🏗️ Decidir y defender (sin pasos) — el gate que estorba un viernes

> **Situación:** viernes, 18:00. Hay un defecto en producción y el arreglo ya está en un pull request. El check `pruebas` falla en una prueba que, según el autor, "a veces falla sola" y no tiene relación con el arreglo. El líder técnico propone una de estas salidas: (a) agregarse a la **Bypass list** del ruleset "solo por hoy"; (b) poner `continue-on-error: true` en el paso de pruebas; (c) marcar esa prueba con `skip`; (d) no fusionar y revertir el cambio que causó el defecto en producción.
> **Entrega:** tu decisión (una de las cuatro, una combinación o una quinta opción tuya), las condiciones con que la aceptarías y cómo quedaría registrada para que el lunes se pueda revisar.

No hay una única respuesta correcta: la evidencia es tu decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Separas la prisa del riesgo | Dices qué pasa en producción si esperas una hora y qué pasa si fusionas algo que nadie validó |
| No dejas el gate vacío para después | Si tu salida debilita CI, dices cuándo y cómo se restaura, y quién lo comprueba |
| Tratas la prueba inestable como diseño | Una prueba que "falla sola" se investiga o se omite de forma explícita (con motivo, responsable y fecha), no en silencio dentro de otro cambio |
| La aprobación sigue siendo humana | Alguien distinto del autor revisa el diff antes de fusionar, o explicas por qué en tu equipo no es posible y qué lo compensa |
| Queda rastro | Otra persona puede reconstruir el lunes qué se decidió, quién y por qué |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión y sus condiciones | ___ |
| Qué etapa del flujo se tensa con tu decisión y cómo la proteges | ___ |
| Qué cambiarías del ruleset o del workflow para que la próxima vez no haga falta decidir esto con prisa | ___ |

---

## 🔁 Reto de transferencia — Las cuatro etapas en una solución low-code

Cambia el artefacto y comprueba si entendiste el patrón. Un maker de SIT modificó con Copilot un cloud flow de una solución (Copilot en cloud flows puede cambiar acciones de un flujo a partir de una instrucción en lenguaje natural: [Learn: Copilot en cloud flows](https://learn.microsoft.com/power-automate/get-started-with-copilot)). Lo quiere llevar de Dev a Test y a Prod con **pipelines in Power Platform**. No hay pull request ni GitHub Actions. ¿Dónde quedan el diseño, la validación y la aprobación?

1. **Micropráctica (8 min):** **[Transferir: las cuatro etapas en una solución low-code](/practica/ip-ia-036-transferir-cuatro-etapas-a-low-code)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** con estas dos páginas abiertas, [Learn: Overview of pipelines in Power Platform](https://learn.microsoft.com/power-platform/alm/pipelines) y [Learn: Solution checker enforcement in Managed Environments](https://learn.microsoft.com/power-platform/admin/managed-environment-solution-checker), escribe qué pieza cumple cada etapa y qué **no** cubre. Pista: el solution checker hace análisis estático contra reglas de buenas prácticas, y en modo **Block** solo detiene la importación ante problemas de severidad crítica. No sabe nada de tu regla de negocio, igual que un linter.

**Evidencia a reportar:**

| Etapa | Qué la cumple en la solución low-code | Qué no cubre y cómo lo compensas | Fuente (URL de Learn + fecha de actualización) |
|---|---|---|---|
| Humano diseña | ___ | ___ | ___ |
| IA implementa | ___ | ___ | ___ |
| CI valida | ___ | ___ | ___ |
| Humano aprueba | ___ | ___ | ___ |

### 💼 Casos Reales de Negocio
El equipo de plataforma de SIT adoptó este flujo de 4 etapas como estándar después de dos incidentes previos (Módulos 46 y 50) causados por saltarse la validación de CI o la aprobación humana "para ir más rápido". Al medir los primeros 3 meses con el flujo completo aplicado sin excepciones, el número de regresiones detectadas en producción bajó de forma medible, y el tiempo total por cambio (diseño + implementación + validación + aprobación) resultó comparable al proceso anterior sin IA — la ganancia no fue "saltarse pasos", sino reducir el tiempo de la etapa de implementación manteniendo intactas las etapas de validación y aprobación humana.

### ✅ Buenas Prácticas
- Nunca saltar una etapa del ciclo, sin importar cuán simple parezca el cambio o cuánta prisa haya.
- Escribir el criterio de éxito como una prueba que falla **antes** de pedirle el cambio a la IA; si la prueba pasa antes del cambio, no mide nada.
- Hacer que el gate no dependa de la disciplina: ruleset activo sobre la rama principal, check de CI obligatorio y bypass list vacía o justificada por escrito.
- En la aprobación, revisar primero qué archivos tocó el cambio (`git diff --stat` o **Files changed**) y si alguno es de pruebas o de pipeline; después, el código.
- Leer el log de CI, no solo el color del check: una línea `skipped` distinta de cero en un cambio que no debía omitir nada es motivo para no aprobar.
- Medir el flujo completo (no solo la velocidad de generación de código) para saber si realmente está funcionando en el equipo.
- Tratar cada etapa como un gate independiente: un cambio no avanza a la siguiente etapa hasta que la anterior se cumple satisfactoriamente.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Saltarse la etapa de "humano aprueba" cuando el cambio "se ve simple" | Confundir simplicidad aparente con ausencia de riesgo | Aplicar la aprobación humana de forma consistente, sin excepciones por tamaño percibido |
| Medir solo la velocidad de generación de código como éxito del flujo | Ignorar el costo de regresiones no detectadas | Medir el flujo completo, incluyendo incidentes evitados, no solo velocidad de la etapa de implementación |
| Re-especificar el diseño a mitad de la implementación en lugar de volver a la etapa de diseño explícitamente | Ajustar el alcance sobre la marcha sin documentarlo | Si el criterio de éxito cambia, volver formalmente a la etapa de diseño antes de continuar |
| El check está en verde y el defecto llega igual a QA | La IA omitió la prueba que fallaba (`skip`) o puso `continue-on-error: true` en el paso de pruebas | Revisar los archivos de pruebas y de pipeline del diff; restaurar el gate, confirmar que se pone en rojo y solo entonces corregir el código |
| El ruleset existe pero cualquiera fusiona sin el check | **Enforcement status** quedó en **Disabled** (el valor por defecto) o el nombre del check no coincide con el nombre del job | Poner el ruleset en **Active** y exigir el check con el nombre exacto del job (`pruebas`) |
| El ruleset no aparece o no se aplica en un repositorio privado con GitHub Free | Con GitHub Free, los rulesets solo están disponibles en repositorios públicos | Usar un repositorio público sin datos reales para practicar, o un plan que los incluya en privados |
| Pedirle al autor que apruebe su propio pull request | GitHub no lo permite | Con un compañero, aprobaciones requeridas en 1; solo, en 0, y la revisión queda documentada en la evidencia |
| La IA "mejora" una validación que no le pidieron tocar | El prompt describía el resultado, pero el alcance no se comprobó en la revisión | Comparar el diff contra el alcance de `DISENO.md` y rechazar lo que se sale de él |

### 🧪 Criterios de Validación
- [ ] Escribí el diseño del cambio (problema, alcance, lo que no cambia, criterio de éxito y quién aprueba) antes de involucrar a la IA
- [ ] Escribí el criterio de éxito como prueba y comprobé que fallaba antes del cambio
- [ ] Configuré el workflow de CI y un ruleset **Active** sobre `main` que exige pull request y el check `pruebas`, y comprobé que un push directo se rechaza
- [ ] Revisé el pull request de la IA empezando por los archivos que tocó y el log de CI, no por el color del check
- [ ] Diagnostiqué el monto negativo aceptado con CI en verde formulando una hipótesis antes de ver la causa
- [ ] Encontré los tres problemas plantados (validación del monto, prueba omitida y `continue-on-error`) y los documenté con su evidencia
- [ ] Restauré el gate, vi el check en rojo antes de corregir la función, y el cambio final pasa con `skipped 0`
- [ ] Documento en qué etapa tuve que devolverme a un paso anterior y por qué
- [ ] Defendí por escrito mi decisión sobre el gate que estorba un viernes contra la rúbrica
- [ ] En el reto de transferencia asigné cada etapa del flujo a una pieza de Power Platform y dije qué no cubre, citando Learn
- [ ] Relaciono este flujo completo con la preparación de evidencia de cualquier lab de este plan de estudio (diseño → implementación asistida → validación con CI → revisión humana antes de entregar)

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- La URL del repositorio público de práctica, una captura del ruleset (reglas y **Enforcement status**) y el enlace al pull request de la IA con tu revisión.
- El log de CI de la versión de la IA (con la línea `skipped`) y el de tu versión corregida.

> **Siguiente paso:** el [Lab 51](/labs/lab-51-flujo-completo-humano-ia-ci) es el proyecto integrador del nivel IA: el mismo flujo sobre un cambio propio, con auditoría de prompts y matriz de riesgos.
