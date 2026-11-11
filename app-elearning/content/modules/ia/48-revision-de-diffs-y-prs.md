---
moduleId: 48
title: "Revisión de Diffs y Pull Requests"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 16
practiceMinutes: 160
slug: "revision-de-diffs-y-prs"
lastVerified: "2026-11"
---
*Lectura: 14-16 min · Práctica: unas 2 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2 en tu equipo; la segunda, la Microlección 3 en GitHub, la decisión y el reto de transferencia).*

### 🎯 Objetivo
Revisar con criterio un diff generado por IA — propio o de un compañero — identificando alcance, efectos secundarios y riesgos de seguridad antes de aprobarlo, con o sin apoyo de un revisor automático. Al terminar habrás aplicado un parche generado por IA que "arregla el bug" con las pruebas en verde, demostrado con git y con pruebas qué más rompía, y dejado tu decisión en una revisión de pull request en GitHub.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (la salida exacta de git o de las pruebas, no un sí/no). La Microlección 2 es una actividad de **fallo y corrección**: el parche de la IA corrige el bug pedido, pero borra una regla de negocio y la prueba que la protegía, así que todo sale en verde; lo demuestras y escribes la corrección mínima. Cierras **decidiendo y defendiendo** qué PR se fusiona y con un **reto de transferencia** sobre otro tipo de archivo: un workflow de CI.
>
> **Antes de empezar, necesitas:**
> - **Git 2.28 o posterior** (`git --version`) y **Node.js 22 o posterior** (`node --version`). Las pruebas usan el ejecutor integrado `node:test` ([documentación de Node.js](https://nodejs.org/api/test.html)): no instalas paquetes.
> - Para la Microlección 3, una cuenta de **GitHub Free**. Usa un repositorio **público** de práctica con datos ficticios: en GitHub Free los repositorios públicos tienen el conjunto completo de funciones, y las ramas protegidas en repositorios privados requieren GitHub Pro o superior ([GitHub: planes](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)).
> - Un asistente de IA es **opcional**: el parche "generado por IA" viene escrito en el módulo para que todos revisen lo mismo.
> - Este módulo es transversal: no necesitas haber hecho ningún nivel de certificación ni tener un tenant.

### 📖 Conceptos Clave
- **Alcance del diff:** lo primero a verificar es si el diff toca solo lo que la tarea pedía — un cambio "para arreglar el formulario X" que también modifica un archivo de configuración no relacionado es una señal de alarma, generado por IA o no.
- **Efectos secundarios:** un cambio generado por IA puede resolver el síntoma pedido introduciendo un problema distinto (ej. quitar una validación para que "funcione" en lugar de corregir la causa) — revisar no solo si el cambio funciona, sino qué más pudo romper.
- **Seguridad en el diff:** prestar atención específica a: credenciales o secretos hardcodeados, nuevas dependencias no revisadas, y cambios en Security Roles o permisos de Dataverse.
- **Pruebas borradas o debilitadas:** si un diff elimina o afloja una prueba, "las pruebas pasan" deja de ser evidencia. Las líneas de prueba eliminadas se revisan con la misma atención que las de código.
- **Revisores automáticos/agentes de revisión:** herramientas que resumen un PR o señalan patrones sospechosos (ej. GitHub Copilot code review, agentes configurados para lint/seguridad) — son un apoyo, no un reemplazo del juicio humano; solo aceleran encontrar dónde mirar con más atención.
- **Checklist de revisión repetible:** tener una lista corta y consistente (alcance, efectos secundarios, seguridad, tests) evita que la revisión dependa del estado de ánimo o el tiempo disponible del revisor ese día.
- **Cómo se lee un diff unificado:** cada archivo empieza con `diff --git a/... b/...`; cada bloque (*hunk*) empieza con `@@ -línea,cantidad +línea,cantidad @@`; las líneas con `-` se quitan, las que llevan `+` se agregan y las que empiezan con un espacio son contexto sin cambios.
- **Revisión de pull request en GitHub:** el revisor comenta líneas en la pestaña **Files changed** y cierra con una de tres decisiones: **Comment** (comentario sin aprobar ni pedir cambios), **Approve** (los cambios están listos para fusionarse) o **Request changes** (hay que atender el comentario antes de fusionar) ([GitHub Docs: about pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews)). El autor de un PR no puede aprobar su propio PR.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Leer el diff antes de ejecutarlo

**¿Qué vas a aprender?** A aplicar un parche con git solo después de comprobar que encaja, y a medir su alcance (qué archivos toca y cuánto) antes de leer línea por línea.

**¿Por qué existe esto?** Un agente de IA entrega su trabajo como un diff. Si lo aplicas y ejecutas sin mirarlo, ya no sabes qué parte del resultado viene de la tarea y qué parte de lo que el agente decidió por su cuenta.

**La tarea que recibió la IA:** "Una solicitud de un solo día (fecha de inicio igual a fecha fin) se rechaza con el error *La fecha fin debe ser posterior a la fecha inicio*. Corrígelo."

**Práctica real (30 min):**

1. Crea una carpeta de práctica, por ejemplo `practica-m48`, y dentro otra llamada `revision-pr`. En `revision-pr` crea estos cuatro archivos con tu editor (respeta las carpetas `src`, `test` y `config`):

   `package.json`
   ```json
   {
     "name": "revision-pr-practica",
     "version": "1.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "test": "node --test"
     }
   }
   ```

   `src/validar-solicitud.mjs`
   ```js
   // Reglas de fechas de una solicitud de SIT
   export const MAX_DIAS_ADELANTO = 180; // Finanzas no reserva presupuesto a más de 6 meses

   const MS_POR_DIA = 24 * 60 * 60 * 1000;

   export function validarSolicitud({ fechaInicio, fechaFin }, hoy = new Date()) {
     const errores = [];
     if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
       errores.push("Las dos fechas son obligatorias");
       return errores;
     }
     if (fechaFin <= fechaInicio) {
       errores.push("La fecha fin debe ser posterior a la fecha inicio");
     }
     const diasAdelanto = (fechaInicio - hoy) / MS_POR_DIA;
     if (diasAdelanto > MAX_DIAS_ADELANTO) {
       errores.push(`La solicitud no puede empezar a más de ${MAX_DIAS_ADELANTO} días`);
     }
     return errores;
   }
   ```

   `test/validar-solicitud.test.mjs`
   ```js
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { validarSolicitud } from "../src/validar-solicitud.mjs";

   const hoy = new Date("2026-11-01");

   test("una solicitud normal no tiene errores", () => {
     const errores = validarSolicitud({ fechaInicio: new Date("2026-11-10"), fechaFin: new Date("2026-11-12") }, hoy);
     assert.deepEqual(errores, []);
   });

   test("la fecha fin anterior a la de inicio es un error", () => {
     const errores = validarSolicitud({ fechaInicio: new Date("2026-11-10"), fechaFin: new Date("2026-11-05") }, hoy);
     assert.equal(errores.length, 1);
   });

   test("no se aceptan solicitudes que empiezan a más de 180 días", () => {
     const errores = validarSolicitud({ fechaInicio: new Date("2027-08-01"), fechaFin: new Date("2027-08-03") }, hoy);
     assert.equal(errores.length, 1);
   });
   ```

   `config/ambiente.json`
   ```json
   {
     "nombre": "practica",
     "urlApi": "https://ejemplo.invalid/api"
   }
   ```
2. Desde `revision-pr`, ejecuta `npm test`. **Qué deberías ver:** `pass 3` y `fail 0`. **Si ves `fail`**, compara tus archivos con los de arriba (la carpeta de las pruebas se llama `test` y los archivos terminan en `.mjs`).
3. Guarda esa versión como punto de partida y crea la rama donde aplicarás el cambio de la IA:
   ```bash
   git init -b main
   git add .
   git commit -m "Base: reglas de fechas de solicitudes"
   git switch -c ia/fix-fecha
   ```
   **Si git te pide nombre y correo**, configúralos con `git config --global user.name "Tu nombre"` y `git config --global user.email "tu@correo"` y repite el `commit`.
4. Este es el diff que entregó el agente de IA. Guárdalo como `ia-fix.patch` en la carpeta **de arriba** (`practica-m48`, no dentro de `revision-pr`, para que no entre en el repositorio):
   ```diff
   diff --git a/config/ambiente.json b/config/ambiente.json
   index 96de0a3..2393793 100644
   --- a/config/ambiente.json
   +++ b/config/ambiente.json
   @@ -1,4 +1,5 @@
    {
      "nombre": "practica",
   -  "urlApi": "https://ejemplo.invalid/api"
   +  "urlApi": "https://ejemplo.invalid/api",
   +  "claveApi": "CLAVE-DE-PRUEBA-NO-REAL-0000"
    }
   diff --git a/src/validar-solicitud.mjs b/src/validar-solicitud.mjs
   index 2ff5135..b5b3627 100644
   --- a/src/validar-solicitud.mjs
   +++ b/src/validar-solicitud.mjs
   @@ -1,20 +1,12 @@
    // Reglas de fechas de una solicitud de SIT
   -export const MAX_DIAS_ADELANTO = 180; // Finanzas no reserva presupuesto a más de 6 meses
   -
   -const MS_POR_DIA = 24 * 60 * 60 * 1000;
   -
   -export function validarSolicitud({ fechaInicio, fechaFin }, hoy = new Date()) {
   +export function validarSolicitud({ fechaInicio, fechaFin }) {
      const errores = [];
      if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
        errores.push("Las dos fechas son obligatorias");
        return errores;
      }
   -  if (fechaFin <= fechaInicio) {
   -    errores.push("La fecha fin debe ser posterior a la fecha inicio");
   -  }
   -  const diasAdelanto = (fechaInicio - hoy) / MS_POR_DIA;
   -  if (diasAdelanto > MAX_DIAS_ADELANTO) {
   -    errores.push(`La solicitud no puede empezar a más de ${MAX_DIAS_ADELANTO} días`);
   +  if (fechaFin < fechaInicio) {
   +    errores.push("La fecha fin no puede ser anterior a la fecha inicio");
      }
      return errores;
    }
   diff --git a/test/validar-solicitud.test.mjs b/test/validar-solicitud.test.mjs
   index 31429eb..95a8f1e 100644
   --- a/test/validar-solicitud.test.mjs
   +++ b/test/validar-solicitud.test.mjs
   @@ -13,8 +13,3 @@ test("la fecha fin anterior a la de inicio es un error", () => {
      const errores = validarSolicitud({ fechaInicio: new Date("2026-11-10"), fechaFin: new Date("2026-11-05") }, hoy);
      assert.equal(errores.length, 1);
    });
   -
   -test("no se aceptan solicitudes que empiezan a más de 180 días", () => {
   -  const errores = validarSolicitud({ fechaInicio: new Date("2027-08-01"), fechaFin: new Date("2027-08-03") }, hoy);
   -  assert.equal(errores.length, 1);
   -});
   ```
   La clave `CLAVE-DE-PRUEBA-NO-REAL-0000` es inventada: representa un secreto que un agente pegó en un archivo de configuración.
5. **Antes de aplicar, comprueba y mide:**
   ```bash
   git apply --check ../ia-fix.patch
   git apply --stat ../ia-fix.patch
   ```
   **Qué deberías ver:** `--check` no imprime nada (el parche encaja) y `--stat` lista **3 archivos** con sus líneas agregadas y quitadas. **Si `--check` responde `patch does not apply`**, casi siempre son los finales de línea: tu editor guardó el parche con un tipo (CRLF) y los archivos con otro (LF), o al revés. Guarda los cinco archivos con el mismo final de línea (en VS Code, la barra de estado muestra `LF` o `CRLF` y permite cambiarlo) o repite con `git apply --check --ignore-whitespace ../ia-fix.patch`.
6. Aplica el parche, guárdalo como el commit "de la IA" y mira el resultado con git:
   ```bash
   git apply ../ia-fix.patch
   git commit -am "Corrige la validación de fechas (propuesto por IA)"
   git diff main --stat
   ```
7. **Clasifica cada bloque del diff** en una de tres columnas: *lo que la tarea pedía*, *fuera de alcance* o *riesgo de seguridad*. Hazlo leyendo el diff, sin ejecutar nada más.

**Micropráctica (5 min):** compara tu clasificación → **[Clasificar los cambios de un diff generado por IA](/practica/ip-ia-025-clasificar-cambios-de-un-diff)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Salida de `git apply --stat ../ia-fix.patch` (archivos y números) | ___ |
| Bloques que corresponden a la tarea | ___ |
| Bloques fuera de alcance | ___ |
| Bloques con riesgo de seguridad | ___ |
| ¿Tuviste que usar `--ignore-whitespace`? (sí/no y por qué) | ___ |

---

## 🧩 Microlección 2 — Fallo y corrección: todo en verde y una regla de negocio menos

**¿Qué vas a aprender?** A no aceptar "las pruebas pasan" como evidencia cuando el mismo diff toca las pruebas, a demostrar un efecto secundario con git y a escribir la corrección mínima que pedía la tarea.

**¿Por qué existe esto?** Es el fallo más caro de la revisión asistida: el síntoma reportado desaparece, el CI sale en verde y la regla que Finanzas necesitaba se fue en el mismo commit, junto con la prueba que la habría delatado.

**Diagnosticar antes de corregir — micropráctica (7 min):** una semana después de fusionar el parche, Finanzas encuentra solicitudes aprobadas que empiezan dentro de diez meses → **[Diagnosticar: el CI en verde que ocultó una regla borrada](/practica/ip-ia-026-diagnosticar-ci-verde-regla-borrada)**. Formula tu hipótesis antes de abrir las pistas.

**Práctica real (45 min):**

1. En la rama `ia/fix-fecha`, ejecuta `npm test`. **Qué deberías ver:** `pass 2`, `fail 0`. Anota por qué ahora hay 2 pruebas y no 3.
2. **Mira solo las pruebas que cambiaron:**
   ```bash
   git diff main -- test/
   ```
   Las líneas con `-` son pruebas que existían en `main` y el parche quitó.
3. **Demuestra el efecto secundario.** Trae la versión de las pruebas de `main` sin tocar el código de la IA y ejecútalas:
   ```bash
   git restore --source main test/validar-solicitud.test.mjs
   npm test
   ```
   **Qué deberías ver:** `fail 1`, en la prueba *no se aceptan solicitudes que empiezan a más de 180 días*. Esa es tu evidencia: el código de la IA ya no aplica la regla. Deja la rama como estaba con `git restore test/validar-solicitud.test.mjs` y comprueba con `git status` que no quedan cambios.
4. **Escribe tú la corrección mínima, en otra rama desde `main`:**
   ```bash
   git switch main
   git switch -c fix/fecha-un-dia
   ```
   Primero la prueba del caso pedido. Añade al final de `test/validar-solicitud.test.mjs`:
   ```js
   test("una solicitud de un solo día (inicio = fin) es válida", () => {
     const errores = validarSolicitud({ fechaInicio: new Date("2026-11-10"), fechaFin: new Date("2026-11-10") }, hoy);
     assert.deepEqual(errores, []);
   });
   ```
   Ejecuta `npm test`. **Qué deberías ver:** `fail 1` en tu prueba nueva: así compruebas que la prueba detecta el bug **antes** de corregirlo.
5. Corrige solo la condición en `src/validar-solicitud.mjs`: cambia `fechaFin <= fechaInicio` por `fechaFin < fechaInicio` y ajusta el mensaje a "La fecha fin no puede ser anterior a la fecha inicio". Ejecuta `npm test` (**qué deberías ver:** `pass 4`, `fail 0`) y guarda:
   ```bash
   git commit -am "Acepta solicitudes de un solo día"
   git diff main --stat
   ```
   **Qué deberías ver:** 2 archivos (`src/` con 2 líneas cambiadas y `test/` con 4 o 5 agregadas, según hayas dejado una línea en blanco antes de la prueba), sin `config/ambiente.json`.
6. Compara las dos ramas: `git diff ia/fix-fecha fix/fecha-un-dia --stat`. Anota en una frase qué quitó la IA que tu corrección conserva.

**Evidencia a reportar (una fila por problema del parche de la IA):**

| Problema del parche | Comando o prueba que lo demuestra | Resultado observado (salida exacta) | Cómo lo resuelve tu rama `fix/fecha-un-dia` |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| `npm test` en `ia/fix-fecha` (pass/fail) | ___ |
| `npm test` en `ia/fix-fecha` con las pruebas de `main` (pass/fail y prueba que falló) | ___ |
| `npm test` en `fix/fecha-un-dia` antes y después de corregir la condición | ___ |
| Salida de `git diff main --stat` en tu rama | ___ |

---

## 🧩 Microlección 3 — La revisión en GitHub: comentar, decidir y proteger la rama

**¿Qué vas a aprender?** A dejar tu revisión donde el equipo la ve (comentarios en líneas, una sugerencia y una decisión explícita) y a configurar una regla para que nada llegue a `main` sin pull request.

**¿Por qué existe esto?** Una revisión que no queda escrita no protege a nadie: el siguiente que mire el PR no sabe qué se comprobó. Y una rama sin regla permite que alguien (o un agente con permisos) empuje directo a `main` sin revisión.

**Práctica real (40 min):**

1. En GitHub, crea un repositorio nuevo, **público**, vacío (sin README ni otros archivos), por ejemplo `revision-pr-practica`. Solo contiene datos ficticios; aun así, la clave inventada del parche representa lo que **nunca** se sube a un repositorio real.
2. Sube las tres ramas (cambia `TU-USUARIO` por tu usuario):
   ```bash
   git remote add origin https://github.com/TU-USUARIO/revision-pr-practica.git
   git push -u origin main
   git push -u origin ia/fix-fecha
   git push -u origin fix/fecha-un-dia
   ```
3. **Abre el PR de la IA.** En la página del repositorio, elige la rama `ia/fix-fecha` en el menú de ramas; si aparece el aviso amarillo, haz clic en **Compare & pull request**. Comprueba que *base* es `main` y *compare* es `ia/fix-fecha`, escribe un título y haz clic en **Create Pull Request** ([GitHub Docs: creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request)).
4. **Revisa línea por línea.** Abre la pestaña **Files changed**. Pasa el ratón sobre la línea de `claveApi` y haz clic en el icono azul de comentario junto al número de línea; escribe por qué es bloqueante y haz clic en **Start a review**. Haz lo mismo en la línea donde desaparece `MAX_DIAS_ADELANTO` y en el bloque de la prueba eliminada (cita tu evidencia de la Microlección 2: el `fail 1`). En la línea de la condición, usa el icono **Suggestion** para proponer el cambio exacto `if (fechaFin < fechaInicio) {` y haz clic en **Add review comment**. Marca cada archivo revisado con **Viewed** ([GitHub Docs: reviewing proposed changes](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request)).
5. **Decide.** Haz clic en **Review changes**, escribe un resumen de una o dos frases y elige la decisión. GitHub no deja que el autor apruebe su propio PR; como tú abriste este PR, usa **Comment**. Si un compañero hace la revisión desde su cuenta, debería elegir **Request changes**. Haz clic en **Submit review**.
6. **Protege `main`.** Ve a **Settings** del repositorio > en la barra lateral, sección **Code, planning, and automation**, **Branches** > **Add classic branch protection rule**. En **Branch name pattern** escribe `main`, marca **Require a pull request before merging** y, debajo, **Require approvals** (1 en **Required number of approvals before merging**). Más abajo marca también **Do not allow bypassing the above settings**: por defecto la regla no se aplica a quien administra el repositorio, es decir, a ti, y GitHub te dejaría fusionar saltándosela. Haz clic en **Create** ([GitHub Docs: managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), [about protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)). Si trabajas solo, la regla exige una aprobación que tú, como autor, no puedes dar: anota qué muestra GitHub en el PR de `fix/fecha-un-dia` al intentar fusionarlo. GitHub ofrece también **rulesets** como alternativa a las reglas clásicas: solo una regla clásica se aplica a la vez sobre una rama, mientras que varios rulesets pueden combinarse, y un ruleset también puede exigir revisiones antes de fusionar ([GitHub Docs: about rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets); consulta ahí su disponibilidad según tu plan).
7. **(Opcional, solo si tu plan de Copilot lo incluye)** Copilot code review **no** está incluido en Copilot Free; sí en planes de pago como Copilot Pro, Pro+, Max, Business y Enterprise, y cada revisión consume créditos de IA ([GitHub Docs: Copilot code review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)). Si lo tienes, en el PR, en **Reviewers** de la barra derecha, haz clic en **Request** junto a **Copilot** ([GitHub Docs: using Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)). Por defecto deja una revisión de tipo **Comment** que no cuenta como aprobación requerida. Compara sus comentarios con los tuyos: ¿encontró la prueba eliminada?

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| URL del PR de `ia/fix-fecha` | ___ |
| Comentarios que dejaste (línea y motivo, uno por fila) | ___ |
| Decisión de revisión que enviaste y por qué esa | ___ |
| Qué muestra GitHub al intentar fusionar con la regla activa | ___ |
| (Opcional) Hallazgos de Copilot que tú no viste, y tuyos que Copilot no vio | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — qué PR se fusiona

> **Situación:** tienes dos PR para el mismo bug: el de la IA (`ia/fix-fecha`) y el tuyo (`fix/fecha-un-dia`). El líder técnico tiene prisa y propone fusionar el de la IA "porque ya pasó las pruebas" y abrir después otro PR para "lo demás".
> **Entrega:** tu decisión (qué se fusiona, qué se cierra y qué se pide) en un comentario del PR o en un documento, más tu checklist de revisión de PRs de cinco a ocho puntos que usarás de aquí en adelante.

No hay una única respuesta correcta: la evidencia es la decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Se apoya en evidencia, no en impresiones | Citas salidas concretas (`git diff main --stat`, el `fail 1` con las pruebas de `main`) |
| Trata el secreto como bloqueante | Explicas por qué una clave en un archivo versionado no se arregla "en otro PR" |
| Separa lo pedido de lo no pedido | Si algo del PR de la IA tiene valor, propones moverlo a un PR propio con su justificación |
| La checklist es repetible | Otra persona puede aplicarla sin preguntarte: alcance, efectos secundarios (incluidas pruebas borradas), seguridad, pruebas del caso pedido |
| Mantiene la decisión humana | El revisor automático o el asistente de IA aparece como primer filtro, nunca como la aprobación |

Si quieres usar la IA como primer filtro de tu checklist, este prompt sirve (nunca como aprobación final):
```
Actúa como revisor senior. Este es el diff de un cambio que debía "corregir la validación de fecha en
el formulario de solicitudes":
{{pega aquí el diff completo}}
Responde: (1) ¿el diff toca solo archivos relacionados con la tarea?, (2) ¿hay líneas eliminadas o
modificadas sin relación aparente con la tarea?, (3) ¿hay algo que parezca un secreto, credencial o
permiso nuevo?, (4) ¿el cambio tiene un test que lo valide?, (5) ¿el diff elimina o debilita alguna prueba?
Formato de salida: lista de hallazgos con severidad (bloqueante/advertencia/ok).
```
*Evalúa:* el resumen de la IA es un punto de partida — confirma tú mismo cada hallazgo "bloqueante" leyendo el diff real antes de decidir.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión (qué se fusiona, qué se cierra, qué se pide) | ___ |
| Tu checklist (los puntos, uno por línea) | ___ |
| Criterio de la rúbrica que más te costó cumplir y cómo lo resolviste | ___ |

---

## 🔁 Reto de transferencia — El agente que "aceleró" el CI

Cambia el tipo de archivo y comprueba si entendiste el patrón. Le pidieron a un agente "haz que el CI sea más rápido y que no falle por tiempo" y entregó un cambio en el workflow de GitHub Actions. Ahora el diff no toca código de negocio: toca la configuración que decide si un PR está en verde.

1. En `revision-pr`, vuelve a `main` (`git switch main`) y crea el archivo `.github/workflows/ci.yml` con este contenido; haz commit (`git add .github` y `git commit -m "CI: ejecutar pruebas en cada PR"`):
   ```yaml
   name: CI

   on:
     pull_request:
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
             node-version: 20
         - name: Ejecutar pruebas
           run: npm test
   ```
2. Guarda el diff del agente como `ia-ci.patch` en `practica-m48`, crea una rama (`git switch -c ia/ci-rapido`) y comprueba que encaja con `git apply --check ../ia-ci.patch`:
   ```diff
   diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
   index a00ecba..6e632dc 100644
   --- a/.github/workflows/ci.yml
   +++ b/.github/workflows/ci.yml
   @@ -4,16 +4,17 @@ on:
      pull_request:
        branches: [main]
    
   -permissions:
   -  contents: read
   +permissions: write-all
    
    jobs:
      pruebas:
        runs-on: ubuntu-latest
   +    timeout-minutes: 5
        steps:
          - uses: actions/checkout@v7
          - uses: actions/setup-node@v7
            with:
   -          node-version: 20
   +          node-version: 22
          - name: Ejecutar pruebas
            run: npm test
   +        continue-on-error: true
   ```
3. **Micropráctica (7 min):** **[Transferir: revisar el diff de un workflow de CI](/practica/ip-ia-027-transferir-diff-de-workflow-ci)**. Las pistas se desbloquean de una en una, después de cada intento.
4. Clasifica cada cambio con tu checklist. Para decidir, consulta la referencia de sintaxis de workflows ([GitHub Docs: workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)): qué hace `continue-on-error` en un paso y qué concede `permissions: write-all` al `GITHUB_TOKEN`.
5. **(Opcional)** Si tu repositorio de práctica tiene GitHub Actions habilitado, aplica el parche, súbelo y abre el PR; después, en la rama, rompe una prueba a propósito y observa el resultado del job. Anota qué viste.

**Evidencia a reportar:**

| Cambio del diff | Tu clasificación (pedido / fuera de alcance / riesgo) | Qué harías (aceptar, pedir justificación, bloquear) y por qué |
|---|---|---|
| `permissions: write-all` | ___ | ___ |
| `timeout-minutes: 5` | ___ | ___ |
| `node-version: 22` | ___ | ___ |
| `continue-on-error: true` | ___ | ___ |

### 💼 Casos Reales de Negocio
Un PR generado con ayuda de un agente en SIT resolvía correctamente el bug reportado (un cálculo incorrecto en un flujo), pero también eliminaba una validación de rango que existía por una razón de negocio no documentada en el código. El revisor humano aprobó el PR porque el bug reportado sí se resolvió y no notó la validación eliminada al no comparar el diff completo contra la intención original de cada línea. La regla adoptada: todo diff se revisa línea por línea contra "¿por qué cambió esto?", no solo contra "¿se resolvió el síntoma reportado?".

### ✅ Buenas Prácticas
- Revisar el diff completo, no solo el resultado final — cada línea eliminada o modificada debe tener una razón clara ligada a la tarea.
- Usar una checklist corta y consistente (alcance, efectos secundarios, seguridad, tests) en cada revisión, generado por IA o no.
- Tratar los revisores automáticos como un apoyo que acelera dónde mirar, nunca como la aprobación final.
- Medir el alcance antes de leer: `git apply --stat` o `git diff main --stat` dicen cuántos archivos toca el cambio; un archivo de configuración en un arreglo de lógica pide explicación.
- Cuando un diff toca pruebas, ejecutar el código nuevo contra las pruebas **anteriores** (`git restore --source main` sobre el archivo de pruebas): si fallan, el diff cambió comportamiento, no solo lo arregló.
- Escribir primero la prueba del caso pedido y verla fallar; después, la corrección mínima.
- Dejar la revisión escrita en el PR (comentarios en líneas y una decisión explícita) y proteger la rama principal para que ningún cambio llegue sin pull request.
- Revisar los cambios de workflows de CI con el mismo rigor que el código: deciden qué significa "en verde".

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aprobar un PR porque "el bug reportado se resolvió" sin revisar el resto del diff | Enfocarse solo en el síntoma, no en el diff completo | Revisar cada línea cambiada contra su propia justificación, no solo el resultado final |
| Confiar en el resumen de un revisor automático sin leer el diff | Delegar por completo el juicio de revisión a la herramienta | Usar el revisor automático como guía de dónde mirar, no como aprobación |
| No tener una checklist consistente de revisión | Revisar "a ojo" según el tiempo disponible ese día | Definir y aplicar siempre la misma checklist corta |
| Aceptar "las pruebas pasan" cuando el diff borró una prueba | Revisar el código y saltarse las líneas `-` de los archivos de prueba | Revisar `git diff main -- test/` y ejecutar el código nuevo con las pruebas de `main` |
| `git apply` responde `patch does not apply` con un parche correcto | Finales de línea distintos (CRLF/LF) entre el parche y los archivos | Guardar todo con el mismo final de línea o usar `--ignore-whitespace`; no editar el parche a mano |
| No poder aprobar el propio PR y desactivar la protección de la rama | GitHub no deja que el autor apruebe su propio PR | Pedir la revisión a otra persona; la regla existe precisamente para eso |
| Aceptar un workflow con `continue-on-error: true` en el paso de pruebas | Parece un cambio de configuración inofensivo | La referencia de GitHub indica que permite que el job pase aunque ese paso falle: bloquear salvo justificación explícita |
| Dejar pasar `permissions: write-all` | Se lee como un detalle técnico, no como un permiso | Conceder al `GITHUB_TOKEN` solo el acceso mínimo necesario; volver a `contents: read` si el job solo lee |

### 🧪 Criterios de Validación
- [ ] Comprobé el parche con `git apply --check` y medí su alcance con `git apply --stat` antes de aplicarlo
- [ ] Clasifiqué cada bloque del diff en "lo pedido", "fuera de alcance" o "riesgo de seguridad" sin ayuda de IA
- [ ] Diagnostiqué la regla borrada formulando una hipótesis antes de ver la causa
- [ ] Demostré con las pruebas de `main` que el parche de la IA elimina la regla de 180 días (salida `fail 1`)
- [ ] Escribí la prueba del caso de un solo día, la vi fallar y la corrección mínima la hace pasar sin tocar `config/`
- [ ] Dejé una revisión en el PR con comentarios en líneas, una sugerencia y una decisión explícita
- [ ] Configuré una regla de protección para `main` y anoté su efecto al intentar fusionar
- [ ] Documento mi propia checklist de revisión de PRs, incluyendo el prompt de apoyo como primer filtro, y defendí qué PR se fusiona contra la rúbrica
- [ ] Explico por qué un revisor automático (IA o herramienta) nunca reemplaza la aprobación humana final
- [ ] En el reto de transferencia clasifiqué los cuatro cambios del workflow y justifiqué cuáles bloquearía
- [ ] Relaciono este módulo con la revisión de cualquier entregable de lab antes de presentarlo como evidencia de portafolio

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- La salida de `git apply --stat`, de `git diff main --stat` en las dos ramas y de `npm test` en cada paso de la Microlección 2.
- La URL del PR con tu revisión y una captura de la regla de protección de `main`.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 49 explica qué hacer cuando un secreto ya llegó a un repositorio, el Módulo 50 convierte estas pruebas en un gate de CI que no se puede saltar, y el Lab 51 aplica esta checklist en el proyecto integrador del nivel.
