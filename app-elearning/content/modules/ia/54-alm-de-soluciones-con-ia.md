---
moduleId: 54
title: "ALM de Soluciones Power Platform con Apoyo de IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 20
practiceMinutes: 210
slug: "alm-de-soluciones-con-ia"
lastVerified: "2026-11"
---
*Lectura: 18-20 min · Práctica: unas 3 a 4 horas la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2 con tu ambiente; la segunda, la Microlección 3, la decisión y el reto de transferencia, que se pueden hacer en papel).*

### 🎯 Objetivo
Aplicar el ciclo de vida de aplicaciones (ALM) de Power Platform — soluciones managed/unmanaged, export/import/pack/unpack, variables de entorno, connection references y pipelines Dev/Test/Prod — usando IA como apoyo para revisar diffs, riesgos y documentación en cada etapa, sin saltarse ninguna validación.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste). La Microlección 3 es una actividad de **fallo y corrección**: recibes un pipeline generado por IA con un paso que no existe y otros peligrosos, los detectas, los corriges y anotas contra qué página de Microsoft Learn lo verificaste. Cierras **decidiendo y defendiendo** si apruebas un cambio que elimina una columna, y con un **reto de transferencia** a pipelines in Power Platform.
>
> **Antes de empezar, necesitas:**
> - Para las Microlecciones 1 y 2: tu ambiente del curso u otro ambiente de práctica (**Trial**, **Developer** o **Sandbox**; nunca producción) y el Power Platform CLI (`pac`) con un perfil de autenticación, tal como lo dejaste en el **Módulo 52** (o el [Lab 52](/labs/lab-52-cli-conexion-tenant)). Una solución unmanaged mínima basta: una tabla y un flujo.
> - **Si no tienes ambiente**, haz la variante en papel que trae cada microlección: la Microlección 3, la decisión y el reto de transferencia no necesitan tenant.
> - Este módulo es transversal: no exige ningún nivel de certificación. Si ya hiciste el Módulo 16 o el Lab 19, vas a reconocer las piezas; si no, todo lo necesario está aquí.

### 📖 Conceptos Clave
- **Solución (solution):** el contenedor que empaqueta todos los componentes de una app (tablas, formularios, flujos, plugins, PCF, etc.) para moverlos entre entornos de forma consistente, en vez de recrear cada componente manualmente en cada entorno.
- **Unmanaged vs. managed:** una solución **unmanaged** es editable directamente (se usa en el entorno de desarrollo, donde los makers trabajan); una solución **managed** es de solo lectura una vez importada (se usa en Test y Production) — intentar editar un componente managed directamente en el entorno destino rompe el modelo de ALM y genera "personalizaciones huérfanas" difíciles de rastrear.
- **Export / Import:** exportar saca la solución del entorno de origen (unmanaged en Dev) como archivo `.zip`; importar la lleva a otro entorno, generalmente como managed en Test/Prod. `pac solution export`/`pac solution import` son los comandos correspondientes. En `pac solution export`, `--managed` es un **switch**: si lo pones, exporta managed; si lo omites, unmanaged ([Learn: pac solution](https://learn.microsoft.com/power-platform/developer/cli/reference/solution)).
- **Solution unpack / pack:** `pac solution unpack` descompone el `.zip` de la solución en archivos XML/JSON individuales (uno por componente) aptos para control de versiones en Git, diffs legibles y revisión de código; `pac solution pack` hace el proceso inverso antes de importar. Para empaquetar como **Managed** desde una carpeta, esa carpeta tiene que venir de un unpack con `--packagetype Both` (Learn: al empaquetar, Managed o Unmanaged se elige "from a previous unpack 'Both'").
- **Variables de entorno (environment variables):** valores configurables (URLs, IDs, flags) que cambian entre Dev/Test/Prod sin modificar el componente que los usa — el patrón correcto para evitar hardcodear, por ejemplo, la URL de una API externa distinta por entorno.
- **Connection references:** un componente de solución que representa "una conexión a un conector" (ej. SharePoint, un conector personalizado) sin fijar cuál cuenta o credencial usa — se resuelve por entorno al momento de importar, evitando que un flujo quede atado a la cuenta personal de quien lo desarrolló.
- **Deployment settings:** un archivo JSON que mapea los valores de variables de entorno y connection references específicos de cada entorno destino, usado por `pac solution import` para automatizar ese mapeo sin intervención manual repetitiva. Se genera con `pac solution create-settings` y se pasa con `--settings-file` ([Learn: deployment settings](https://learn.microsoft.com/power-platform/alm/conn-ref-env-variables-build-tools)).
- **Pipelines Dev → Test → Prod:** la automatización que ejecuta export → unpack → commit en Dev, y pack → import en Test/Prod, aplicando siempre el mismo orden y las mismas validaciones, sin pasos manuales que dependan de la memoria de una persona. Hay tres caminos documentados: **GitHub Actions for Power Platform** (acciones `microsoft/powerplatform-actions/...`), **Power Platform Build Tools** para Azure DevOps (tareas `PowerPlatform...@2`) y **pipelines in Power Platform**, integrados en el producto.
- **Pipelines in Power Platform:** despliegan solo soluciones **managed** a los ambientes que no son de desarrollo, exigen que los ambientes del pipeline estén habilitados como **Managed Environments**, salvo los de tipo **Developer** (Learn: no necesitan serlo para el pipeline, aunque desde el 15 de noviembre de 2026 los Developer nuevos solo se crean gestionados; el host tampoco lo necesita), y no permiten saltarse una etapa ([Learn: pipelines](https://learn.microsoft.com/power-platform/alm/pipelines)). Por eso, antes de decidir si un QA debe ser Managed Environment, mira de qué **tipo** es: un QA Sandbox sí; un QA Developer, no. Con **AI deployment notes**, Copilot puede redactar las notas de despliegue con un resumen de la solución, que el maker revisa antes de enviar ([Learn: notas con Copilot](https://learn.microsoft.com/power-platform/alm/copilot-deployment-notes-pipelines)).
- **El papel de la IA aquí:** resumir diffs grandes, señalar valores hardcodeados y redactar documentación o un borrador de pipeline. No decide: cada paso que propone se verifica contra la documentación oficial y cada despliegue lo aprueba una persona.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Exportar y desempaquetar para versionar

**¿Qué vas a aprender?** A sacar una solución unmanaged de tu ambiente de práctica, desempaquetarla para Git y usar la IA para auditarla sin creerle a ciegas.

**¿Por qué existe esto?** El `.zip` es un binario: en Git no se ve qué cambió. Desempaquetado, cada componente es un archivo con su diff, y ese diff es lo que una persona (con apoyo de IA) revisa antes de aprobar un despliegue.

**Práctica real en tu ambiente de práctica (35 min):**

1. Comprueba primero a qué ambiente estás conectado con `pac org who`, como pide la regla del Módulo 52. Si no es tu ambiente de práctica, revisa tus perfiles con `pac auth list` y cambia con `pac auth select`. Después identifica una solución unmanaged existente (o crea una mínima con una tabla y un flujo) y expórtala **sin** `--managed`, para que salga unmanaged. Los comandos de este módulo usan `SITSolicitudesGastos` como ejemplo: **reemplázalo en todos ellos por el Name de tu solución** (por ejemplo, la del Módulo 2 tiene el suyo):
   ```bash
   pac solution export --name "SITSolicitudesGastos" --path ./exports/SITSolicitudesGastos.zip
   ```
   Usa el **Name** de la solución, no su nombre visible. **Qué deberías ver:** el comando termina sin errores y el `.zip` aparece en `./exports/`. **Si falla porque no encuentra la solución**, lista las del ambiente con `pac solution list` y copia el nombre exacto.
2. Desempaqueta la solución exportada para versionarla en Git:
   ```bash
   pac solution unpack --zipfile ./exports/SITSolicitudesGastos.zip --folder ./solutions/SITSolicitudesGastos --packagetype Unmanaged
   ```
3. Inspecciona la carpeta resultante (`Other/Solution.xml`, `Entities/`, `Workflows/`) y usa este prompt para auditar el ALM de la solución:
   ```
   Rol: auditas soluciones Power Platform para revisión de ALM.
   Contexto: este es un fragmento de Solution.xml de mi solución {{nombre}}:
   {{pega aquí solo el fragmento relevante, nunca el archivo completo si es muy extenso}}
   Tarea: identifica (1) qué componentes contiene, (2) si hay algo que parezca un valor hardcodeado de
   entorno específico (URL, GUID de conexión) que debería ser variable de entorno o connection
   reference, (3) qué falta para que esta solución sea segura de importar como managed en Test/Prod.
   Formato de salida: lista de hallazgos con severidad.
   ```
   *Evalúa:* ¿la IA distinguió correctamente un GUID de referencia estructural (normal en Solution.xml) de un valor realmente hardcodeado de un entorno específico? Verifica manualmente cualquier hallazgo "bloqueante" contra el archivo real.

**Variante en papel (sin ambiente):** lee en [Learn: pac solution](https://learn.microsoft.com/power-platform/developer/cli/reference/solution) las secciones de `export` y `unpack` y anota qué hace `--managed`, qué valores admite `--packagetype` y cuál es el valor por defecto. Lo usarás en la Microlección 3.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Ambiente al que apuntaba `pac org who` (nombre o URL; no pegues datos confidenciales) | ___ |
| Name exacto de la solución exportada | ___ |
| Carpetas de primer nivel que creó el unpack | ___ |
| Hallazgo "bloqueante" de la IA y si lo confirmaste en el archivo real (sí/no, con la línea) | ___ |

---

## 🧩 Microlección 2 — Lo que cambia entre ambientes: variables, referencias y deployment settings

**¿Qué vas a aprender?** A encontrar todo lo que cambia entre Dev, Test y Prod y a dejarlo en un archivo de deployment settings en vez de en el componente.

**¿Por qué existe esto?** Un pipeline sin intervención humana no puede detenerse a preguntar qué conexión usar ni qué URL poner. Si no lo resuelves antes, el despliegue automático falla o, peor, sale con los valores de Dev.

**Práctica real en tu ambiente de práctica (30 min):**

1. Identifica en el proyecto todas las **connection references** y **variables de entorno** definidas, y documenta cuáles cambiarían de valor entre Dev, Test y Prod (ej. URL de un conector personalizado).
2. Genera el esqueleto del archivo de deployment settings a partir del `.zip` de la Microlección 1:
   ```bash
   pac solution create-settings --solution-zip ./exports/SITSolicitudesGastos.zip --settings-file ./deployment-settings/test.json
   ```
   **Qué deberías ver:** un JSON con una sección `EnvironmentVariables` (pares `SchemaName` / `Value`) y otra `ConnectionReferences` (`LogicalName`, `ConnectionId`, `ConnectorId`), con los valores vacíos. **Si sale vacío**, tu solución no tiene variables ni referencias: agrega una variable de entorno de tipo texto a la solución, vuelve a exportar y repite.
3. Completa (en texto, sin ejecutarlo contra un entorno real de producción) los valores para un entorno de Test hipotético. Learn indica que el `ConnectionId` de cada referencia es el de una conexión que ya existe **en el ambiente destino**; si no tienes Test, déjalo como `"<ConnectionId de Test>"` y anótalo como pendiente.

**Variante en papel (sin ambiente):** toma el ejemplo de archivo que trae [Learn: deployment settings](https://learn.microsoft.com/power-platform/alm/conn-ref-env-variables-build-tools) y escribe qué valor pondrías en cada campo para Test y para Prod.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Variables de entorno de la solución (`SchemaName`) y su valor en Test | ___ |
| Connection references (`LogicalName` → conector) | ___ |
| Valores que quedaron pendientes y por qué | ___ |
| ¿Hay algún secreto en el archivo? Si lo hay, dónde lo guardarías en su lugar | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: el pipeline que generó la IA

**¿Qué vas a aprender?** A revisar un workflow de GitHub Actions generado por IA paso por paso contra la documentación oficial, corregirlo y dejar constancia de cada verificación.

**¿Por qué existe esto?** Un asistente de IA escribe YAML con aspecto profesional en segundos, y puede inventar una acción con un nombre razonable, dejar un secreto en texto plano o desplegar a producción con cada push. La sintaxis válida no dice nada de si el paso existe ni de si es seguro.

**La salida de la IA.** Alguien pidió "un workflow de GitHub Actions que lleve la solución SITSolicitudesGastos de DEV a PROD" y obtuvo esto (el secreto es inventado):

```yaml
# .github/workflows/desplegar-prod.yml: salida tal como la entregó el asistente de IA (contiene errores a propósito)
name: Desplegar SITSolicitudesGastos a PROD

on:
  push:
    branches: [main]

jobs:
  desplegar:
    runs-on: windows-latest
    steps:
      - name: Instalar Power Platform Tools
        uses: microsoft/powerplatform-actions/actions-install@v1

      - name: Comprobar conexión con DEV
        uses: microsoft/powerplatform-actions/who-am-i@v1
        with:
          environment-url: https://sit-dev.crm.dynamics.com
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: 'Xq8~9fake-secret-value'
          tenant-id: ${{ secrets.PP_TENANT_ID }}

      - name: Exportar desde DEV
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: https://sit-dev.crm.dynamics.com
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: 'Xq8~9fake-secret-value'
          tenant-id: ${{ secrets.PP_TENANT_ID }}
          solution-name: SITSolicitudesGastos
          solution-output-file: out/SITSolicitudesGastos.zip
          managed: false

      - name: Desplegar en PROD
        uses: microsoft/powerplatform-actions/deploy-solution@v1
        with:
          environment-url: https://sit-prod.crm.dynamics.com
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: 'Xq8~9fake-secret-value'
          tenant-id: ${{ secrets.PP_TENANT_ID }}
          solution-file: out/SITSolicitudesGastos.zip
```

**Ahora haz algo — micropráctica (7 min):** antes de corregir, detecta qué está mal → **[Revisar el pipeline que generó la IA](/practica/ip-alm-004-revisar-pipeline-generado-por-ia)**.

**Práctica (45 min, en papel o en un repositorio de prueba):**

1. Abre dos páginas de Learn y anota su fecha de actualización: [Available GitHub Actions for Microsoft Power Platform development](https://learn.microsoft.com/power-platform/alm/devops-github-available-actions) y [Overview of pipelines in Power Platform](https://learn.microsoft.com/power-platform/alm/pipelines). La primera lista las acciones y sus parámetros; la segunda no es de GitHub, pero te sirve en el reto de transferencia.
2. Recorre el YAML **línea por línea** con dos preguntas: ¿esto existe en la documentación? Y, si existe, ¿es seguro hacerlo hacia producción? Para cada `uses:` busca la acción en la lista; para cada parámetro, búscalo en la tabla de esa acción.
3. **Diagnosticar antes de seguir — micropráctica (6 min):** un compañero ya ejecutó este workflow y falla antes del primer paso; la IA "lo arregló" cambiando la versión → **[Diagnosticar: el job falla antes de ejecutar ningún paso](/practica/ip-alm-005-diagnosticar-accion-que-no-existe)**.
4. **Escribe tu versión corregida** sin mirar la de referencia. Criterios de aceptación: (1) todas las acciones existen en la lista de Learn; (2) ningún secreto aparece en el YAML (Learn: "Add the client secret as a GitHub secret"); (3) a PROD llega la solución **managed**; (4) ninguna persona queda fuera del despliegue a PROD: se dispara a mano o espera la aprobación de un revisor; (5) las variables de entorno y connection references del destino salen de un archivo de deployment settings, no de valores escritos en el paso.
5. **Opcional: ejecutarlo de verdad.** Solo si tienes un repositorio de prueba y un **service principal** con acceso a tu ambiente de práctica (no producción), ejecuta tu versión contra Dev → Test. Crear el service principal exige tres cosas que una cuenta de maker no suele poder hacer: registrar una aplicación en Microsoft Entra ID con su secreto de cliente y darla de alta como **Application user** en cada ambiente; los pasos están en [Learn: tutorial de GitHub Actions para Power Platform, sección *Create the service principal account and give it rights to the environments created*](https://learn.microsoft.com/power-platform/alm/tutorials/github-actions-start). Revisa también la nota sobre GitHub Free de abajo antes de configurar el repositorio. **Si no tienes service principal o permisos para crearlo, sáltate este paso:** la evidencia es la tabla, y el paso no cuenta para los criterios de validación.

**Evidencia a reportar (una fila por línea que cambiaste):**

| Línea o paso del YAML de la IA | Qué estaba mal | Tu corrección | Fuente (URL de Learn + fecha de actualización) |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Acción que usaste en lugar de `deploy-solution` y la página donde la encontraste | ___ |
| Cómo se dispara tu despliegue a PROD y quién lo aprueba | ___ |
| Si lo ejecutaste: resultado del job (éxito o primer error exacto) | ___ |

**Contrasta tu versión (solo después de llenar la tabla).** Una corrección posible, con los parámetros tal como aparecen en Learn y en el `action.yml` de cada acción ([import-solution](https://github.com/microsoft/powerplatform-actions/blob/main/import-solution/action.yml)):

```yaml
name: Desplegar SITSolicitudesGastos

on:
  workflow_dispatch:            # nadie despliega con un push: se lanza a mano y se elige el destino
    inputs:
      destino:
        description: "Ambiente destino"
        required: true
        type: choice
        options: [test, prod]

jobs:
  desplegar:
    runs-on: windows-latest
    environment: ${{ inputs.destino }}   # un environment de GitHub por ambiente; "prod" con revisores obligatorios
    steps:
      - uses: actions/checkout@v4        # trae el archivo de deployment settings del repositorio

      - name: Instalar Power Platform Tools
        uses: microsoft/powerplatform-actions/actions-install@v1

      - name: Exportar managed desde DEV
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: ${{ vars.PP_DEV_URL }}
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: ${{ secrets.PP_CLIENT_SECRET }}
          tenant-id: ${{ secrets.PP_TENANT_ID }}
          solution-name: SITSolicitudesGastos
          solution-output-file: out/SITSolicitudesGastos_managed.zip
          managed: true                 # a Test y Prod llega managed

      - name: Importar en el destino
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ vars.PP_TARGET_URL }}   # variable del environment elegido
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: ${{ secrets.PP_CLIENT_SECRET }}
          tenant-id: ${{ secrets.PP_TENANT_ID }}
          solution-file: out/SITSolicitudesGastos_managed.zip
          use-deployment-settings-file: true
          deployment-settings-file: deployment-settings/${{ inputs.destino }}.json
          run-asynchronously: true
```

Notas para defender tu versión si difiere:
- Es **una** corrección posible, no la única. Otra válida: exportar unmanaged para Git (Microlección 1), unpack con `Both` y empaquetar Managed en el pipeline; lo que no vale es empaquetar Managed desde una carpeta que solo se desempaquetó como Unmanaged.
- **Revisores obligatorios** en un environment de GitHub: según la documentación de GitHub, en los planes Free, Pro y Team solo están disponibles para repositorios públicos. En un repositorio privado sin ese plan, el control es el `workflow_dispatch` más una revisión documentada antes de lanzarlo.
- **GitHub Free con repositorio privado** (lo más común en una cuenta personal): GitHub Docs indica que con GitHub Free los environments solo se configuran en repositorios públicos, que los **secretos de environment** solo existen en repositorios públicos y que las **variables de environment** en repositorios privados requieren GitHub Pro o Team ([GitHub Docs: deployments and environments](https://docs.github.com/actions/reference/workflows-and-actions/deployments-and-environments)). Así, `vars.PP_TARGET_URL` como "variable del environment elegido" no existe en tu caso. Dos alternativas: (a) un repositorio **público** de prueba, sin datos reales ni nombres de clientes (los secretos se guardan cifrados en GitHub, no en el código; lo que sí queda a la vista de todos es el YAML y la carpeta de la solución); o (b) en el privado, **secretos y variables de repositorio** (**Settings** > **Secrets and variables** > **Actions**, pestañas **Secrets** y **Variables**, botones **New repository secret** y **New repository variable**), quitar la línea `environment:` del job y elegir la URL con el input:
  ```yaml
          environment-url: ${{ inputs.destino == 'prod' && vars.PP_PROD_URL || vars.PP_TEST_URL }}
  ```
  En la alternativa (b) no hay revisor obligatorio: el control sobre PROD es el disparo manual más tu revisión documentada.
- **Si tu equipo usa Azure DevOps**, el patrón es el mismo con las tareas de Power Platform Build Tools; la de importar es `microsoft-IsvExpTools.PowerPlatform-BuildTools.import-solution.PowerPlatformImportSolution@2`, con `UseDeploymentSettingsFile` y `DeploymentSettingsFile` ([Learn: Build tool tasks](https://learn.microsoft.com/power-platform/alm/devops-build-tool-tasks)). Tampoco existe una tarea "Deploy Solution": la tarea **Deploy Package** despliega paquetes, no soluciones.

---

### 🏗️ Decidir y defender (sin pasos) — ¿apruebas la eliminación de una columna?

> **Situación:** un PR trae el diff de la solución desempaquetada: el `.xml` de una tabla ya no incluye la columna `sit_codigoproveedor`. La IA que revisó el diff con el prompt de la Microlección 1 lo calificó como "limpieza, bajo riesgo". Una vista y un flujo de la solución todavía usaban esa columna en Dev la semana pasada. Tienes que aprobar o rechazar el PR.
> **Entrega:** tu decisión (aprobar, rechazar o aprobar con condiciones), una checklist propia de **3 preguntas** que un revisor humano debe responder siempre antes de aprobar una eliminación de componente (ej.: ¿algún flujo/vista/formulario activo lo referencia? ¿hay datos existentes en esa columna que se perderían? ¿el cambio es reversible sin restaurar un backup?), y cómo respondiste cada una.

Si tienes ambiente, puedes reproducirlo: en una solución de práctica, agrega una columna, úsala en una vista, quítala de la solución desempaquetada y vuelve a pasar el prompt de auditoría. Si no, decide sobre el caso escrito. Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| No delegas el veredicto | Tu decisión cita lo que comprobaste tú, no la etiqueta "bajo riesgo" de la IA |
| Cruzas dependencias | Dices dónde miraste si la vista y el flujo siguen usando la columna (por ejemplo, **Show dependencies** de la columna en Dev o una búsqueda del nombre en la carpeta desempaquetada) |
| Piensas en los datos | Tu checklist pregunta qué pasa con los valores ya guardados en Test y Prod |
| Piensas en la vuelta atrás | Dices cómo se revertiría y cuánto costaría |
| Dejas condiciones verificables | Si apruebas con condiciones, otra persona puede comprobar que se cumplieron |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión | ___ |
| Tus 3 preguntas y la respuesta a cada una | ___ |
| ¿La IA había pasado por alto la dependencia? ¿Qué le faltó en el contexto? | ___ |

---

## 🔁 Reto de transferencia — El mismo criterio con pipelines in Power Platform

Cambia la herramienta y comprueba si entendiste el patrón. Otro equipo no usa GitHub: quiere usar **pipelines in Power Platform** para llevar su solución de DEV (Developer) a QA (Sandbox) y a PROD (Production), con un ambiente Production nuevo como host. Le pidieron a una IA un plan y recibieron siete afirmaciones que suenan razonables.

1. **Micropráctica (8 min):** **[Transferir: el plan de despliegue con pipelines in Power Platform](/practica/ip-alm-006-transferir-plan-con-pipelines-en-power-platform)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** con la página [Overview of pipelines in Power Platform](https://learn.microsoft.com/power-platform/alm/pipelines) abierta, escribe el plan corregido: tipo de cada ambiente, cuáles deben ser Managed Environments, quién aprueba antes de PROD y qué hace el equipo con una corrección urgente en producción (pista: no se edita en PROD).

**Evidencia a reportar:**

| Afirmación de la IA que corregiste | Qué dice Learn (cita corta) | Tu plan corregido |
|---|---|---|
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |

### 💼 Casos Reales de Negocio
El equipo de plataforma de SIT importaba soluciones directamente desde el entorno de desarrollo (unmanaged) hacia producción durante casi un año, porque "era más rápido" que configurar el pipeline completo. Un día, un maker modificó por error un formulario directamente en producción pensando que estaba en Test (ambos entornos se veían casi idénticos visualmente), y esa personalización quedó fuera de cualquier control de versiones, perdida en el siguiente despliegue managed. La causa raíz no fue el error puntual del maker, sino la ausencia de una separación managed/unmanaged real entre entornos. El equipo adoptó como estándar: **Dev siempre unmanaged y editable, Test y Prod siempre managed y de solo lectura**, con el pipeline de GitHub Actions como único camino de despliegue.

### ✅ Buenas Prácticas
- Mantener siempre Dev como unmanaged (editable) y Test/Prod como managed (solo lectura) — nunca editar directamente un componente managed en el entorno destino.
- Versionar la solución desempaquetada (`pac solution unpack`) en Git, no el `.zip` binario, para tener diffs legibles y historial real de cambios.
- Externalizar cualquier valor que cambie entre entornos (URLs, IDs, flags) como variable de entorno o connection reference — nunca hardcodear un valor específico de un entorno dentro de un componente.
- Usar IA para resumir diffs grandes de `Solution.xml` o detectar referencias hardcodeadas antes de importar, pero siempre con revisión humana final antes de aprobar el pipeline hacia Test/Prod.
- Verificar cada acción, tarea o comando que proponga la IA contra la página de Learn correspondiente (y anotar su fecha) antes de ejecutarlo; un nombre que "suena bien" no prueba que exista.
- Guardar los secretos del service principal como secretos del repositorio o del environment, nunca en el YAML ni en el archivo de deployment settings.
- Que el despliegue a producción dependa de una persona (disparo manual o revisor obligatorio), nunca de un push.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Editar un componente managed directamente en Test/Prod | Confundir el entorno o no tener una política clara de solo-lectura en destino | Establecer Dev=unmanaged, Test/Prod=managed como regla no negociable |
| Versionar el `.zip` de la solución en vez de la carpeta desempaquetada | Omitir `pac solution unpack` antes de hacer commit | Siempre desempaquetar antes de versionar; el `.zip` se genera en el pipeline, no se commitea |
| Hardcodear una URL o ID específico de un entorno dentro de un flujo o conector | No usar variables de entorno ni connection references desde el diseño | Externalizar todo valor variable por entorno desde el primer commit |
| Saltarse el pipeline "porque el cambio es pequeño" | Presión de tiempo | Ningún cambio se importa a Test/Prod fuera del pipeline, sin excepciones (ver Módulo 50) |
| El job falla antes del primer paso | La IA usó una acción que no existe (por ejemplo `deploy-solution`); cambiar la versión no lo arregla | Buscar la acción en la lista de Learn; para importar una solución es `import-solution` |
| Dudas sobre si `pac solution export --managed false` exporta unmanaged | Learn define `--managed` como un switch que no lleva valor; pasarle `false` no está documentado | Para unmanaged, omite `--managed`; para managed, ponlo solo. Comprueba el resultado mirando el `.zip` o importándolo en un ambiente de práctica |
| Empaquetar como Managed una carpeta que solo se desempaquetó como Unmanaged | La IA copió `solution-type: Managed` sin mirar cómo se hizo el unpack; Learn indica que, al empaquetar, Managed o Unmanaged se eligen a partir de un unpack `Both` | Desempaqueta con `--packagetype Both` si vas a empaquetar Managed, o exporta managed directamente desde el ambiente |
| Un secreto aparece en el historial de Git | Quedó escrito en el YAML generado | Rótalo de inmediato en Microsoft Entra ID y muévelo a un secreto del repositorio o del environment |

### 🧪 Criterios de Validación
- [ ] Exporté una solución unmanaged (sin `--managed`) y la desempaqueté con `pac solution unpack` para versionarla en Git, o hice la variante en papel
- [ ] Usé el prompt de auditoría de ALM sobre un fragmento de Solution.xml y verifiqué manualmente los hallazgos bloqueantes
- [ ] Identifiqué las connection references y variables de entorno de una solución de práctica
- [ ] Generé con `pac solution create-settings` (o escribí en papel) el `deployment-settings.json` para un entorno de Test
- [ ] Explico por qué Dev debe ser unmanaged y Test/Prod deben ser managed
- [ ] Detecté en el pipeline generado por IA la acción inexistente, el secreto en texto plano, el unmanaged hacia PROD y el despliegue sin aprobación
- [ ] Diagnostiqué el job que falla antes del primer paso formulando una hipótesis antes de ver la causa
- [ ] Escribí mi versión corregida del pipeline cumpliendo los 5 criterios de aceptación y anoté la URL y la fecha de Learn de cada verificación
- [ ] Construí mi propia checklist de revisión de eliminación de componentes, la apliqué al PR y documenté si la IA pasó por alto el cambio breaking
- [ ] En el reto de transferencia corregí el plan de pipelines in Power Platform citando Learn para cada afirmación
- [ ] Relaciono este módulo con el Lab 19 (CI/CD Azure DevOps) y el Lab 53 (exportar y revisar solución con IA)

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- La carpeta desempaquetada (o su lista de carpetas), tu `deployment-settings/test.json` sin secretos y tu versión corregida del workflow.

> **Siguiente paso:** el [Lab 53](/labs/lab-53-exportar-revisar-solucion-con-ia) lleva la Microlección 1 a una revisión completa con IA, y el [Lab 56](/labs/lab-56-cambiar-entornos-dev-test-prod) practica el cambio seguro entre ambientes.
