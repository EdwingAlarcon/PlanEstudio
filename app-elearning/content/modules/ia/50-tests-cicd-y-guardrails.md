---
moduleId: 50
title: "Tests, CI/CD y Guardrails para Código Generado por IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 17
practiceMinutes: 180
slug: "tests-cicd-y-guardrails"
lastVerified: "2026-11"
---
*Lectura: 15-17 min · Práctica: unas 3 horas la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3, la decisión y el reto de transferencia).*

### 🎯 Objetivo
Exigir tests automatizados y gates de CI/CD para cualquier código generado con asistencia de IA, usando linters, type-checkers y feature flags como red de seguridad antes de llegar a producción. Al terminar habrás demostrado que unas pruebas generadas por IA con 100 % de cobertura no protegían nada, habrás corregido un workflow de CI generado por IA que dejaba pasar pruebas en rojo y habrás configurado tu repositorio para que nadie pueda fusionar a `main` sin que el CI pase.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste, no un sí/no). Las Microlecciones 1 y 2 son actividades de **fallo y corrección**: primero unas pruebas generadas por IA y después un workflow generado por IA, ambos con errores plausibles que detectas con mutaciones, con `actionlint` y con un PR de prueba. Cierras **decidiendo y defendiendo** cómo sacar a producción un cambio de alto riesgo y con un **reto de transferencia** a una solución de Power Platform.
>
> **Antes de empezar, necesitas:**
> - **Node.js 22 o posterior** (`node --version`) y **Git** (`git --version`). Las pruebas usan el ejecutor integrado `node:test`: no instalas paquetes.
> - Una cuenta de **GitHub Free** y un repositorio **público** de práctica, sin datos reales ni secretos. Según la [página de planes de GitHub](https://docs.github.com/en/get-started/learning-about-github/githubs-plans), GitHub Actions es gratis con los runners estándar en repositorios públicos, y las ramas protegidas en repositorios **privados** forman parte de GitHub Pro o superior; por eso el repositorio es público. **Si no tienes cuenta**, haz las Microlecciones 1 y 2 en local y la 3 en papel.
> - `actionlint`, un linter de workflows de GitHub Actions; lo descargas en la Microlección 2.
> - Este módulo es transversal: no necesitas ningún nivel de certificación ni un tenant de Power Platform. Si hiciste el Módulo 46, vas a reconocer la técnica de "romper a propósito".

### 📖 Conceptos Clave
- **Tests como contrato, no como formalidad:** un test que valida el comportamiento esperado (no solo que el código "compile") es la única forma objetiva de confirmar que un cambio generado por IA hace lo que se pidió, incluso cuando el revisor humano no detectó un problema a simple vista.
- **Gates de CI:** pasos obligatorios (lint, typecheck, tests, build) que deben pasar antes de fusionar un cambio — el mismo pipeline que ya usa este proyecto (`ci.yml`: los jobs **Lint & Type Check**, que corre ESLint, `tsc --noEmit` y la validación de contenido, y **Unit Tests**, con cobertura, se ejecutan primero; después **Playwright Smoke**, y al final **Next.js Build**) es el guardrail que atrapa errores de código generado por IA igual que errores de código escrito a mano. El despliegue no es un job de ese workflow: lo hace Vercel desde la rama `master`.
- **Linters y type-checkers como red de seguridad:** ESLint y `tsc --noEmit` detectan patrones inseguros (variables sin usar, tipos incorrectos) sin necesidad de que un humano los note manualmente — código generado por IA se beneficia igual de esta red. Lo mismo vale para los workflows: `actionlint` detecta referencias a jobs que no existen o expresiones inseguras en un YAML que "se ve bien".
- **Feature flags para cambios asistidos:** desplegar un cambio generado con IA detrás de un flag (o en un entorno de pruebas separado antes de producción) permite revertirlo sin un despliegue de emergencia si se detecta un problema después del release.
- **Cobertura de tests como métrica de confianza:** un cambio que reduce la cobertura de tests existente es una señal de alerta, generado por IA o no — el umbral de cobertura configurado en el proyecto (80% en `vitest.config.ts`) aplica igual a código asistido por IA. Pero la cobertura mide qué líneas **se ejecutaron**, no qué se **comprobó**: en la Microlección 1 vas a ver pruebas con 100 % de cobertura que no detectan ningún error.
- **Mutación manual:** cambiar a propósito la regla (una tasa, un `>=`, una validación) y ejecutar las pruebas. Si siguen en verde, las pruebas no protegen esa regla. Es la forma más barata de saber si un test vale algo.
- **Un gate que no bloquea no es un gate:** un paso con `continue-on-error: true` deja que el job pase aunque ese paso falle ([GitHub Docs: Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)); un workflow que solo corre con `push` a `main` revisa el código **después** de fusionarlo; y un check que no es obligatorio en la rama no impide el merge. El check se vuelve obligatorio con una regla de rama (**Require status checks to pass before merging**).
- **Red de seguridad de la cadena de suministro:** Dependabot propone actualizaciones de las dependencias y de las acciones que usa el workflow, y CodeQL analiza el código en cada PR. Complementan las pruebas; no las sustituyen.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Una prueba que no puede fallar no protege nada

**¿Qué vas a aprender?** A comprobar si unas pruebas generadas por IA protegen de verdad una regla de negocio, rompiendo la regla a propósito, y a reescribirlas para que fallen cuando deben.

**¿Por qué existe esto?** Pedirle a la IA "genera tests para esta función" produce pruebas que pasan, porque se escriben mirando la función. El riesgo no es que fallen: es que **no puedan** fallar. Así llegó a producción la regresión de descuentos del caso de SIT de este módulo.

**La regla de negocio (la especificación):**
- Cliente **Mayorista**: 15 % de descuento sobre el subtotal.
- Cliente **Frecuente**: 10 %, solo si el subtotal es de **1,000 o más** (1,000 incluido).
- Cualquier otro tipo de cliente: sin descuento (0).
- El descuento se redondea a 2 decimales.
- Un subtotal que no es un número finito, o que es negativo, se rechaza con un error.

**Práctica real (40 min):**

1. Crea una carpeta `practica-ci`, ejecuta `git init` dentro y guarda la función, que **ya es correcta**, como `descuentos.mjs`:
   ```js
   // descuentos.mjs: la regla de negocio ya implementada (esta versión es correcta)
   export function calcularDescuento(subtotal, tipoCliente) {
     if (typeof subtotal !== "number" || !Number.isFinite(subtotal) || subtotal < 0) {
       throw new RangeError("El subtotal debe ser un número mayor o igual que 0");
     }
     let tasa = 0;
     if (tipoCliente === "Mayorista") {
       tasa = 0.15;
     } else if (tipoCliente === "Frecuente" && subtotal >= 1000) {
       tasa = 0.1;
     }
     return Math.round(subtotal * tasa * 100) / 100; // redondeo a 2 decimales
   }
   ```
2. **La salida de la IA.** Alguien pidió "genera tests con node:test para calcularDescuento" y obtuvo esto. Guárdalo como `descuentos.test.mjs`:
   ```js
   // descuentos.test.mjs: salida tal como la entregó el asistente de IA (contiene errores a propósito)
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { calcularDescuento } from "./descuentos.mjs";

   test("calcula el descuento de un mayorista", () => {
     const subtotal = 2000;
     const esperado = calcularDescuento(subtotal, "Mayorista");
     assert.equal(calcularDescuento(subtotal, "Mayorista"), esperado);
   });

   test("un cliente frecuente recibe descuento", () => {
     const descuento = calcularDescuento(1500, "Frecuente");
     assert.ok(descuento);
   });

   test("rechaza un subtotal inválido", () => {
     try {
       calcularDescuento("mil", "Frecuente");
     } catch (error) {
       assert.ok(error instanceof Error);
     }
   });

   test("un cliente normal no tiene descuento", () => {
     calcularDescuento(500, "Normal");
   });
   ```
   Ejecuta `node --test` (**qué deberías ver:** `pass 4`, `fail 0`) y después `node --test --experimental-test-coverage` (la medición de cobertura del ejecutor integrado todavía es experimental). **Qué deberías ver:** una tabla con `descuentos.mjs` al **100.00** de líneas y de ramas. Todo verde y todo cubierto.
3. **Ahora haz algo — micropráctica (5 min):** antes de romper nada, decide qué pruebas protegen de verdad → **[¿Qué pruebas de la IA protegen de verdad?](/practica/ip-ia-031-pruebas-de-la-ia-que-no-pueden-fallar)**.
4. **Rompe la regla a propósito, de a una mutación por vez.** Para cada fila de la tabla, haz el cambio en `descuentos.mjs`, ejecuta `node --test`, anota `pass`/`fail` y **deshaz el cambio** antes de la siguiente:

   | Mutación | Cambio en `descuentos.mjs` |
   |---|---|
   | M1 | `tasa = 0.15` → `tasa = 0.05` |
   | M2 | `subtotal >= 1000` → `subtotal > 1000` |
   | M3 | Comenta la línea `throw new RangeError(...)` |
   | M4 | `let tasa = 0;` → `let tasa = 0.1;` (todos los clientes reciben 10 %) |
   | M5 | Quita el redondeo: `return subtotal * tasa;` |

   **Qué deberías ver con las pruebas de la IA:** las cinco mutaciones **sobreviven** (`fail 0` en todas). Las pruebas no detectan ni un 5 % en lugar de un 15 %.
5. **Reescribe las pruebas.** En `descuentos.test.mjs`, reemplaza las de la IA por **una prueba por cada punto de la regla**, con el valor esperado calculado **a mano desde la regla**, nunca llamando a la función. Incluye los bordes: 1,000 exactos y 999.99 para Frecuente, un caso con redondeo (15 % de 123.45 es 18.5175, que se redondea a **18.52**), un cliente normal con un subtotal alto, un texto y un negativo. Un ejemplo para arrancar:
   ```js
   test("mayorista: 15 % de 2000 es 300", () => {
     assert.equal(calcularDescuento(2000, "Mayorista"), 300); // 2000 × 0.15, calculado a mano
   });

   test("rechaza un subtotal en texto", () => {
     assert.throws(() => calcularDescuento("mil", "Frecuente"), RangeError); // falla si NO lanza
   });
   ```
6. Vuelve a aplicar las cinco mutaciones, una por vez. **Criterio de aceptación:** cada mutación hace fallar al menos una prueba. Si alguna sobrevive, te falta una prueba: escríbela y repite. Cuando termines, haz commit: `git add .` y `git commit -m "Pruebas de la regla de descuentos"`.
7. **El prompt que evita estos defectos** (nunca el único paso, siempre revisado). Si tienes un asistente de IA, pídele las pruebas otra vez con este prompt, guárdalas en un archivo aparte (`descuentos.ia2.test.mjs`) y aplícales tus cinco mutaciones ejecutando solo ese archivo (`node --test descuentos.ia2.test.mjs`):
   ```
   Rol: escribes pruebas unitarias con node:test (node:assert/strict) para este proyecto.
   Contexto: la función calcularDescuento de descuentos.mjs implementa esta regla de negocio:
   {{pega aquí la regla de negocio completa}}
   Tarea: escribe una prueba por cada punto de la regla, incluidos los bordes (1000 exactos,
   999.99, un caso con redondeo, un subtotal en texto y uno negativo).
   Restricciones: calcula cada valor esperado a mano a partir de la regla, nunca llamando a
   calcularDescuento; usa assert.equal con el valor exacto y assert.throws para los errores;
   ninguna prueba puede quedar sin aserción.
   Formato de salida: un archivo listo para ejecutar con node --test.
   ```
   *Evalúa:* ¿las pruebas generadas matan las cinco mutaciones? Un test que siempre pasa, pase lo que pase, no vale nada. Si no tienes asistente, salta este paso.

**Evidencia a reportar:**

| Mutación | `fail` con las pruebas de la IA | `fail` con tus pruebas | Prueba tuya que la detectó |
|---|---|---|---|
| M1 | ___ | ___ | ___ |
| M2 | ___ | ___ | ___ |
| M3 | ___ | ___ | ___ |
| M4 | ___ | ___ | ___ |
| M5 | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Cobertura de líneas y ramas de `descuentos.mjs` con las pruebas de la IA | ___ |
| Defecto de cada prueba de la IA, en una línea cada una | ___ |
| Instrucción que añadirías al prompt "genera tests" para evitar estos defectos | ___ |
| Mutaciones que sobrevivieron a las pruebas generadas con el prompt del paso 7 (o "no lo hice") | ___ |

---

## 🧩 Microlección 2 — Fallo y corrección: el workflow de CI que generó la IA

**¿Qué vas a aprender?** A revisar un workflow de GitHub Actions generado por IA con un linter y contra la documentación, y a confirmar con un PR de prueba que el check se pone en rojo cuando una prueba falla.

**¿Por qué existe esto?** Un workflow puede ser YAML válido, ejecutarse sin errores y no proteger nada. `actionlint` encuentra parte de los problemas; los demás solo aparecen si te preguntas "¿esto bloquearía un PR roto?".

**La salida de la IA.** Alguien pidió "un workflow de CI que ejecute las pruebas con node --test" y obtuvo esto:

```yaml
# .github/workflows/ci.yml: salida tal como la entregó el asistente de IA (contiene errores a propósito)
name: CI

on:
  push:
    branches: [main]

jobs:
  pruebas:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
      - name: Mostrar el PR que se revisa
        run: echo "Revisando ${{ github.event.pull_request.title }}"
      - name: Ejecutar pruebas
        run: node --test
        continue-on-error: true

  publicar:
    needs: prueba
    runs-on: ubuntu-latest
    steps:
      - run: echo "Listo para publicar"
```

**Práctica real (45 min):**

1. Guarda el YAML en `practica-ci/.github/workflows/ci.yml`.
2. **Descarga `actionlint`** desde la página oficial de releases, [github.com/rhysd/actionlint/releases](https://github.com/rhysd/actionlint/releases): el `.zip` o `.tar.gz` de tu sistema (por ejemplo `actionlint_<versión>_windows_amd64.zip`) y el archivo `actionlint_<versión>_checksums.txt`. Antes de descomprimir, comprueba la huella: en PowerShell, `Get-FileHash .\actionlint_<versión>_windows_amd64.zip` (en macOS o Linux, `shasum -a 256 <archivo>`) y compara el valor con la línea de ese archivo en `checksums.txt` (PowerShell lo muestra en mayúsculas y el archivo en minúsculas: compara los caracteres, no las mayúsculas). **Si no coinciden, no lo ejecutes.** Descomprímelo en una carpeta propia, fuera de tu repositorio.
3. Desde la raíz de `practica-ci` (tiene que ser un repositorio Git), ejecuta `actionlint` con la ruta al ejecutable que descomprimiste. **Qué deberías ver:** dos errores, más o menos así (en Windows la ruta aparece como `.github\workflows\ci.yml`, y debajo de cada error `actionlint` muestra la línea señalada):
   ```
   .github/workflows/ci.yml:17:34: "github.event.pull_request.title" is potentially untrusted. avoid using it directly in inline scripts. instead, pass it through an environment variable. [...] [expression]
   .github/workflows/ci.yml:22:3: job "publicar" needs job "prueba" which does not exist in this workflow [job-needs]
   ```
   El primero es un riesgo real de seguridad: GitHub explica que lo que va dentro de `${{ }}` se sustituye en el script **antes** de ejecutarlo, así que un título de PR con comillas puede inyectar comandos; la mitigación que documenta es pasar el valor por una variable de entorno intermedia ([GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)).
4. **Lo que `actionlint` no dijo.** Revisa el YAML línea por línea con una sola pregunta: ¿esto haría que un PR con una prueba rota quede en rojo **antes** de fusionarse? Mira el disparador (`on:`), el paso de pruebas y los permisos del `GITHUB_TOKEN` (GitHub recomienda darle los mínimos; con `permissions: contents: read` todos los demás permisos quedan en `none`).
5. **Diagnosticar antes de corregir — micropráctica (6 min):** a un compañero, un PR con dos pruebas en rojo le quedó con el check en verde → **[Diagnosticar: el check queda en verde con pruebas que fallan](/practica/ip-ia-032-diagnosticar-check-verde-con-pruebas-rojas)**.
6. **Escribe tu versión corregida** sin mirar la de referencia. Criterios de aceptación: (1) `actionlint` no muestra nada y termina sin error; (2) el workflow corre en cada `pull_request` hacia `main`; (3) si una prueba falla, el job falla; (4) el `GITHUB_TOKEN` solo puede leer el contenido; (5) ningún valor del evento se inserta directamente en un `run:`.
7. **Pruébalo de verdad.** Crea un repositorio **público** vacío `practica-ci` en GitHub, sube tu carpeta (las instrucciones de `git remote add origin` aparecen en la página del repositorio nuevo) y comprueba en la pestaña **Actions** que el workflow corrió. Después crea una rama `romper-regla`, aplica la mutación M2 de la Microlección 1, haz push y abre un PR hacia `main`. **Qué deberías ver:** el check `pruebas` en **rojo** en el PR. No lo fusiones todavía: lo usas en la Microlección 3.

**Evidencia a reportar (una fila por línea que cambiaste):**

| Línea o paso del YAML de la IA | Qué estaba mal | Lo detectó `actionlint` (sí/no) | Tu corrección | Fuente (GitHub Docs o salida de `actionlint`) |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Versión de `actionlint` (`actionlint -version`) y huella SHA-256 que comprobaste | ___ |
| Salida de `actionlint` con tu versión corregida | ___ |
| Estado del check `pruebas` en el PR de `romper-regla` y línea del log con el `fail` | ___ |

**Contrasta tu versión (solo después de llenar la tabla).** Una corrección posible; `actionlint` la acepta sin errores:

```yaml
name: CI

on:
  pull_request:            # las pruebas corren ANTES de fusionar, en cada PR hacia main
    branches: [main]
  push:                    # y otra vez sobre main después de fusionar
    branches: [main]

permissions:
  contents: read           # el GITHUB_TOKEN solo puede leer el código

jobs:
  pruebas:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
      - name: Mostrar el PR que se revisa
        if: github.event_name == 'pull_request'
        env:
          TITULO: ${{ github.event.pull_request.title }}   # variable intermedia: el título no se inyecta en el script
        run: echo "Revisando $TITULO"
      - name: Ejecutar pruebas
        run: node --test   # sin continue-on-error ni "|| true": si una prueba falla, el job falla
```

Notas para defender tu versión si difiere:
- El job `publicar` se eliminó porque no publicaba nada. Si tu proyecto despliega desde el CI, ese job necesita `needs: pruebas` y, para producción, un environment con aprobación (lo verás en el Módulo 54).
- **Fijar acciones por SHA:** GitHub recomienda, como práctica de seguridad, referenciar las acciones por el SHA completo de un commit en lugar de una etiqueta como `@v7`. Es más seguro y menos cómodo de mantener; Dependabot (Microlección 3) puede proponerte las actualizaciones. La misma guía documenta además un archivo de bloqueo de dependencias de workflows (`.github/workflows/actions.lock`) que fija el commit de cada acción, incluidas las transitivas ([GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)); queda fuera del alcance de este módulo.
- **Ojo con `node --test` sin pruebas:** si las pruebas quedan en una carpeta o con un nombre que el ejecutor no encuentra, `node --test` informa `tests 0` y termina **sin error**: el check queda en verde. Revisa en el log que el número de pruebas sea el que esperas.

---

## 🧩 Microlección 3 — Que el gate bloquee: reglas de rama, Dependabot y CodeQL

**¿Qué vas a aprender?** A hacer obligatorio el check en la rama principal, para que GitHub impida fusionar un PR en rojo, y a añadir dos redes de seguridad gratuitas en repositorios públicos.

**¿Por qué existe esto?** El caso de SIT no falló por falta de pipeline: falló porque se lo saltaron "para ir rápido". Un check que solo informa se puede ignorar; uno obligatorio, no.

**Práctica real (35 min):**

1. **La regla de rama.** En tu repositorio `practica-ci`, abre **Settings** y, en la barra lateral, dentro de **Code, planning, and automation**, entra en **Rulesets**. Pulsa **New ruleset** > **New branch ruleset** ([GitHub Docs: Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)).
   - Ponle un nombre (`proteger-main`) y cambia **Enforcement status** a **Active** (por defecto está desactivada).
   - En **Target branches**, usa **Add a target** e incluye la rama predeterminada.
   - En las reglas, activa **Require a pull request before merging** y **Require status checks to pass before merging**; en la configuración adicional de esta última, escribe el nombre del check, `pruebas`, y pulsa el botón **+** para añadirlo. GitHub solo lo ofrece si ese check se ejecutó hace poco en el repositorio: por eso primero corriste el workflow. GitHub Docs indica que **Restrict deletions** y **Block force pushes** vienen activadas por defecto; déjalas así ([GitHub Docs: Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)).
   - Pulsa **Create** para guardar el ruleset. **Si GitHub no te deja activarlo**, comprueba que el repositorio sea público; como alternativa, **Settings** > **Branches** > **Add classic branch protection rule** con la opción **Require status checks to pass before merging** y también **Do not allow bypassing the above settings** (sin ella, la regla clásica no se aplica a quien administra el repositorio, es decir, a ti) ([GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).
2. **Compruébalo.** Vuelve al PR de `romper-regla`. **Qué deberías ver:** el botón para fusionar bloqueado y un aviso de que falta el check obligatorio. Deshaz la mutación en esa rama, haz push y espera a que `pruebas` quede en verde: ahora sí se puede fusionar. Fusiónalo.
3. **Dependabot para las acciones del workflow.** Crea `.github/dependabot.yml` con este contenido y súbelo con un PR (la regla ya te obliga):
   ```yaml
   version: 2
   updates:
     - package-ecosystem: "github-actions"   # vigila las acciones que usan tus workflows
       directory: "/"
       schedule:
         interval: "weekly"
   ```
   Dependabot abrirá un PR cuando haya una versión nueva de una acción que usas; si todas están al día, no abre ninguno. Si tu proyecto tiene `package.json`, añade otra entrada con `package-ecosystem: "npm"` ([GitHub Docs: Configuring Dependabot version updates](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates)).
4. **CodeQL con la configuración predeterminada.** **Settings** > (sección **Security and quality**) **Advanced Security** > junto a **CodeQL analysis**, **Set up** > **Default** > **Enable CodeQL**. En repositorios públicos no necesitas ningún producto adicional ([GitHub Docs: Configuring default setup for code scanning](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configure-code-scanning)). Anota qué lenguajes detectó.
5. **El mismo razonamiento en un proyecto TypeScript.** Abre el `ci.yml` de este proyecto (descrito en Conceptos Clave) y, para cada job, escribe un error concreto que un cambio generado por IA podría introducir y que ese job atraparía. Si no tienes acceso al repositorio, hazlo con la descripción de Conceptos Clave.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre del ruleset, reglas activadas y check obligatorio | ___ |
| Mensaje exacto que mostró el PR en rojo al intentar fusionar | ___ |
| Lenguajes que detectó CodeQL / ¿Dependabot abrió algún PR? | ___ |
| Un error que atraparía cada job del `ci.yml` de este proyecto | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — cómo sacar a producción el nuevo cálculo de descuentos

> **Situación:** SIT cambia la regla de descuentos de sus facturas (ahora el cliente Frecuente tiene 12 % desde 800). El cambio lo generó un agente de IA, tiene pruebas nuevas que matan todas tus mutaciones y el CI está en verde. Afecta a todas las facturas de la empresa y el cierre de mes es en diez días. El líder técnico te pide decidir **cómo** llega a producción.
> **Entrega:** tu estrategia en tres a cinco líneas (por ejemplo: un feature flag que activa el cálculo nuevo primero para un grupo de clientes; un ambiente de pruebas con facturas reales anonimizadas; o desplegar tal cual), más cómo se revierte si algo sale mal y qué observarías para decidir si sigues.

No hay una única estrategia correcta: la evidencia es tu decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| El CI en verde es la condición de entrada, no la decisión | Tu estrategia empieza **después** del merge con checks obligatorios y dice qué más hace falta por ser de alto riesgo |
| Reversión sin despliegue de emergencia | Dices exactamente cómo se vuelve al cálculo anterior (apagar el flag, volver a la versión anterior) y cuánto tarda |
| Impacto limitado al principio | El cálculo nuevo afecta primero a un grupo acotado o a un ambiente de pruebas, no a todas las facturas a la vez |
| Señal objetiva para seguir o parar | Nombras qué comparas (por ejemplo, el total de descuentos del grupo contra el cálculo anterior) y qué diferencia te hace parar |
| Respeta el calendario | La decisión tiene en cuenta el cierre de mes |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu estrategia | ___ |
| Cómo se revierte y en cuánto tiempo | ___ |
| Criterio de la rúbrica que más te costó cumplir | ___ |

---

## 🔁 Reto de transferencia — Los mismos gates para una solución de Power Platform

Cambia el artefacto y comprueba si entendiste el patrón. En SIT, un agente de IA modificó el plugin C# que calcula los descuentos en Dataverse y un flujo de Power Automate que lo usa. El repositorio guarda la solución desempaquetada y el código del plugin. No hay `node --test`: el compañero propone "compilar y, si compila, importar en Producción", porque "el agente ya ejecutó sus propias pruebas".

1. **Micropráctica (7 min):** **[Transferir: gates para una solución de Power Platform](/practica/ip-ia-033-transferir-gates-a-solucion-power-platform)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** escribe la lista de gates que exigirías, en orden, y para cada uno cómo comprobarías que **de verdad bloquea** (el equivalente de tus mutaciones y de tu PR en rojo).

**Evidencia a reportar:**

| Gate | Qué atrapa | Cómo compruebas que bloquea de verdad |
|---|---|---|
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |

### 💼 Casos Reales de Negocio
Un equipo de SIT fusionó directamente a producción un cambio generado por un agente que "pasaba visualmente bien" en una prueba manual, sin agregar tests ni pasar por el pipeline de CI completo (lo hicieron manualmente fuera del flujo normal, saltándose el pipeline "para ir rápido"). El cambio introdujo una regresión en un cálculo de descuentos que no se detectó hasta que un cliente reportó una factura incorrecta. La política adoptada después: ningún cambio, generado por IA o no, se fusiona sin pasar por el pipeline de CI completo — sin excepciones por "urgencia".

### ✅ Buenas Prácticas
- Exigir al menos un test que valide el comportamiento esperado para todo cambio generado con IA antes de darlo por terminado.
- No saltarse nunca el pipeline de CI (lint, typecheck, tests, build) "para ir más rápido", ni siquiera en cambios generados por IA que parecen simples.
- Considerar feature flags o despliegue progresivo para cambios de alto riesgo asistidos por IA, permitiendo reversión rápida.
- Calcular el valor esperado de cada prueba a mano, desde la regla de negocio; nunca llamando a la función que se prueba.
- Comprobar las pruebas con mutaciones manuales: si una regla rota no hace fallar ninguna prueba, falta una prueba, aunque la cobertura diga 100 %.
- Pasar todo workflow generado o editado por `actionlint`, y después preguntarse si bloquearía un PR roto: el linter no ve un `continue-on-error` ni un disparador equivocado.
- Correr el CI en cada `pull_request` y hacer el check obligatorio con una regla de rama; dar al `GITHUB_TOKEN` solo los permisos que necesita.
- Revisar en el log cuántas pruebas se ejecutaron: `tests 0` también termina en verde.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Fusionar un cambio generado por IA sin pasar por el pipeline de CI completo | Presión de tiempo o confianza excesiva en que "se ve bien" | Ningún cambio se fusiona sin pasar los gates de CI, sin excepciones |
| No agregar tests a un cambio generado por IA porque "ya funcionó en la prueba manual" | Confundir una prueba manual puntual con una validación repetible | Exigir al menos un test automatizado que reproduzca el comportamiento esperado |
| Desplegar directamente a producción un cambio de alto riesgo generado por IA | No usar feature flags ni despliegue progresivo | Usar flags o rollout gradual en cambios de alto riesgo, generados por IA o no |
| Pruebas que pasan con cualquier implementación | El esperado sale de la propia función, `assert.ok` sobre un número, un `try/catch` sin `assert.throws` o una prueba sin aserción | Esperados calculados desde la regla, `assert.equal` con el valor exacto y `assert.throws`; confirmarlo con mutaciones |
| Confiar en el 100 % de cobertura | La cobertura cuenta líneas ejecutadas, no comprobaciones | Usar la cobertura como alarma cuando baja, y las mutaciones para saber si las pruebas protegen |
| El check queda en verde aunque fallan pruebas | `continue-on-error: true` en el paso de pruebas, o un `\|\| true` al final del comando | Quitarlos: el paso de pruebas tiene que poder fallar el job |
| El CI revisa el código después de fusionarlo | El workflow solo se dispara con `push` a `main` | Disparar también con `pull_request` y hacer el check obligatorio con una regla de rama |
| Un valor del evento (título del PR, nombre de rama) dentro de un `run:` | La IA lo escribió con `${{ }}` directamente en el script | Pasarlo por una variable de entorno intermedia; `actionlint` lo detecta |

### 🧪 Criterios de Validación
- [ ] Uso el prompt de generación de tests y verifico que el test realmente falla si rompo la función a propósito
- [ ] Aplico las cinco mutaciones a la regla de descuentos y anoto que las pruebas de la IA, con 100 % de cobertura, no detectan ninguna
- [ ] Reescribo las pruebas con esperados calculados desde la regla y compruebo que cada mutación hace fallar al menos una
- [ ] Paso el workflow generado por IA por `actionlint` (descargado del release oficial y con la huella comprobada) y anoto qué detectó y qué no
- [ ] Corrijo el workflow para que corra en cada PR, falle si falla una prueba y no inyecte valores del evento en el script
- [ ] Abro un PR con una regla rota y veo el check en rojo
- [ ] Hago obligatorio el check con una regla de rama y compruebo que el PR en rojo no se puede fusionar (o lo describo en papel)
- [ ] Explico qué gate del pipeline de CI de este proyecto atraparía un error específico introducido por IA
- [ ] Decido y defiendo cómo sacar a producción un cambio de alto riesgo, con reversión y señal para seguir o parar, contra la rúbrica
- [ ] En el reto de transferencia ordeno los gates para una solución de Power Platform y digo cómo compruebo que cada uno bloquea
- [ ] Relaciono este módulo con cualquier lab donde genere tests o valide un entregable con el pipeline de CI antes de presentarlo

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- Los archivos `descuentos.mjs`, tu `descuentos.test.mjs`, `.github/workflows/ci.yml` (tu versión corregida) y `.github/dependabot.yml`, más la salida de `node --test` con cada mutación y la de `actionlint` antes y después de corregir.
- El enlace al PR que quedó bloqueado por el check obligatorio.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 46 introduce la técnica de romper el código a propósito, el Módulo 49 cubre los secretos dentro de un workflow, el Módulo 54 lleva estos gates al despliegue de soluciones de Power Platform con GitHub Actions y el Lab 51 recorre el flujo completo humano → IA → CI → aprobación.
