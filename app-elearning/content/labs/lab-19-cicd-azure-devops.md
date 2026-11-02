---
id: lab-19
title: "ALM y CI/CD — Pipeline de Azure DevOps para Power Platform"
level: "N3"
duration: 210
product: ["Azure DevOps", "Power Platform CLI", "Dataverse"]
certifications: ["PL-400"]
role: ["Developer", "DevOps Engineer"]
prerequisites:
  - "Solución SIT_SolicitudesInternas con al menos Canvas App o MDA creadas"
  - "Organización de Azure DevOps (dev.azure.com). Para agentes Microsoft-hosted gratis hay que configurar la facturación con una suscripción de Azure de pago por uso del mismo tenant (la Azure Free Trial no sirve); sin ella, usa un agente self-hosted gratuito en tu equipo (pasos en el lab)"
  - "Permiso para crear un App registration en Microsoft Entra ID (lo crearás en el Ejercicio 1)"
  - "Módulo 19 estudiado: ALM y CI/CD"
lastVerified: "2026-11"
---

# Lab 19 — ALM y CI/CD: Pipeline de Azure DevOps para Power Platform (SIT)

## Objetivo

Al finalizar este laboratorio podrás configurar un pipeline de CI/CD completo en Azure DevOps que, desde el ambiente DEV, versiona la solución `SIT_SolicitudesInternas`, la exporta como unmanaged y como managed, ejecuta Solution Checker y publica el artefacto; y un pipeline de CD que despliega **ese mismo** `.zip` managed a TEST detrás de una aprobación manual.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación

**Problema a resolver:** La solución SIT se ha exportado e importado manualmente decenas de veces entre ambientes. Cada export manual es un riesgo: alguien puede olvidar ejecutar el Solution Checker, importar la versión equivocada o saltarse la aprobación del arquitecto. Un proceso sin errores humanos requiere automatización.

**Por qué CI/CD con Azure DevOps:** El pipeline garantiza que el mismo binario que pasó el Solution Checker en DEV es exactamente el que llega a TEST y PROD. La aprobación humana queda registrada en el historial del pipeline, no en un email.

## Lo que vas a construir

- **App registration** en Microsoft Entra ID dado de alta como **usuario de aplicación** en DEV y TEST (service principal)
- **Service connections** de Azure DevOps para los ambientes DEV y TEST
- **Pipeline de CI** (`ci-build.yml`): versionar → exportar unmanaged → exportar managed → Solution Checker → publicar artefacto
- **Pipeline de CD** (`cd-deploy.yml`): descarga el artefacto del CI → espera la aprobación → importa la managed en TEST

> **Por qué se exporta dos veces:** SolutionPackager (y por tanto `pac solution pack` y la tarea `PowerPlatformPackSolution@2`) **no convierte** una solución unmanaged en managed. Learn indica que la única forma de obtener la managed es exportarla como managed desde un ambiente donde la solución exista ([Learn: SolutionPackager](https://learn.microsoft.com/power-platform/alm/solution-packager-tool)). Por eso el CI hace dos exportaciones y no un "pack como Managed".

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — App registration, usuarios de aplicación y service connections | 50 min |
| Ejercicio 2 — Pipeline de CI: build y verificación | 60 min |
| Ejercicio 3 — Pipeline de CD: despliegue con aprobación | 50 min |
| Ejercicio 4 — Verificar ejecución end-to-end | 50 min |
| **Total** | **210 min** |

Si usas el plan B (agente self-hosted), suma unos 30 minutos la primera vez para instalarlo. La configuración de Entra ID y Azure DevOps es lo que más se alarga. El Solution Checker suele tardar varios minutos por ejecución. Si haces el lab desde el Módulo 19, allí se reparte en dos sesiones: Ejercicios 1 y 2 con la Microlección 2, y Ejercicios 3 y 4 con la Microlección 3.

## Nivel

**N3 Avanzado** — Certificación objetivo: **PL-400**

## Tecnologías utilizadas

- Azure DevOps (Repos, Pipelines, Environments, Service connections)
- Power Platform Build Tools 2.0 (extensión de Azure DevOps basada en Power Platform CLI)
- Microsoft Entra ID (App registration, service principal)
- YAML pipelines

## Prerrequisitos

### Entorno

- [ ] Una organización en [dev.azure.com](https://dev.azure.com), creada con la misma cuenta de trabajo del curso, con un proyecto creado con el proceso de work items **Agile** (se elige en las opciones avanzadas de **New project**; el Módulo 19 explica cómo cambiarlo si lo creaste con Basic)
- [ ] Dos ambientes de Power Platform con Dataverse: **SIT-DEV** (tu Developer del Módulo 1) y **SIT-TEST** (el Trial del Módulo 16; no crees un segundo Developer: desde el 15-11-2026 solo puedes tener uno). Build Tools solo funciona contra ambientes con base de datos de Dataverse ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools))
- [ ] La solución `SIT_SolicitudesInternas` (unmanaged) en SIT-DEV. Si hiciste el Módulo 16, ya la tienes y en SIT-TEST ya importaste versiones managed con su variable de entorno y sus conexiones
- [ ] Permiso para crear App registrations en Microsoft Entra ID y para agregar usuarios de aplicación en los dos ambientes (en un tenant de práctica personal ya lo tienes)
- [ ] Git instalado en tu equipo

### Agentes de Azure Pipelines (revísalo antes de empezar)

Learn indica que el nivel gratuito de agentes **Microsoft-hosted** (los `vmImage` que usa este lab) **no se activa solo**, mientras que el de agentes **self-hosted** (instalados en tu propia máquina) sí se concede automáticamente ([Learn: parallel jobs](https://learn.microsoft.com/azure/devops/pipelines/licensing/concurrent-jobs)). Elige uno de los dos caminos **antes** del Ejercicio 2:

**A. Microsoft-hosted (los YAML tal cual).** Ve a **Organization settings** > **Billing** > **Set up billing**, elige tu suscripción de Azure y pulsa **Save**. Learn indica que, al configurar la facturación, el nivel gratuito se aplica solo a los proyectos privados de la organización: un job a la vez, de hasta 60 minutos por ejecución y 1.800 minutos al mes; no se pide con un formulario. Condiciones: necesitas ser Project Collection Administrator (si creaste la organización, ya lo eres), la suscripción tiene que estar en el **mismo Microsoft Entra ID** que la organización y **Azure DevOps no admite la Azure Free Trial** ([Learn: facturación](https://learn.microsoft.com/azure/devops/organizations/billing/set-up-billing-for-your-organization-vs)). Si tu cuenta de Azure es la gratuita, tendrías que convertirla antes a pago por uso en el portal de Azure (**Subscriptions** > tu suscripción > **Upgrade subscription**; pide un método de pago, [Learn](https://learn.microsoft.com/azure/cost-management-billing/manage/upgrade-azure-subscription)). Compruébalo después en **Organization settings** > **Pipelines** > **Parallel jobs**.

**B. Plan B — agente self-hosted en tu equipo Windows (gratis, sin suscripción).** Es el camino si no tienes una suscripción de pago en el tenant del curso o no quieres registrar una tarjeta. Pasos según Learn ([Learn: agente en Windows](https://learn.microsoft.com/azure/devops/pipelines/agents/windows-agent)):

1. **Requisitos del equipo:** Windows 10 o 11 de 64 bits en una versión que admita el agente (Learn las lista), PowerShell 3.0 o superior (Windows ya trae 5.1) y acceso a Internet. No hace falta instalar .NET (el agente trae el suyo) ni pac CLI: la tarea `PowerPlatformToolInstaller@2` descarga pac CLI en el agente en cada ejecución. Las tareas de Build Tools 2.0 se basan en pac CLI y son multiplataforma ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools)).
2. **Token para registrar el agente:** en Azure DevOps, **User settings** (icono de tu usuario, arriba a la derecha) > **Personal access tokens** > **New Token**. Pulsa **Show all scopes**, marca solo **Agent Pools (read, manage)**, crea el token y **cópialo ya**. Solo se usa para registrar el agente, no después ([Learn: registrar con PAT](https://learn.microsoft.com/azure/devops/pipelines/agents/personal-access-token-agent-registration)).
3. **Descargar el agente:** **Organization settings** > **Agent pools** > **Default** > pestaña **Agents** > **New agent** > **Windows** > **x64** > **Download**. Descomprime el archivo en `C:\agents` (una ruta sin espacios; Learn advierte que extraerlo en Descargas u otras carpetas de usuario puede dar problemas de permisos).
4. **Configurarlo:** abre **PowerShell como administrador** (no uses PowerShell ISE ni Git Bash) y ejecuta:
   ```powershell
   cd C:\agents
   .\config.cmd
   ```
   Responde: URL del servidor `https://dev.azure.com/<tu-organización>`; tipo de autenticación **PAT** y pega el token del paso 2; pool `Default`; nombre del agente y carpeta de trabajo, los valores que propone; y cuando pregunte si quieres ejecutarlo como servicio, responde **N** (en este lab basta con ejecutarlo a mano).
5. **Arrancarlo:** en la misma ventana, `.\run.cmd`. Deja esa ventana abierta mientras corran tus pipelines; para pararlo, **Ctrl+C**. **Qué deberías ver:** en **Agent pools** > **Default** > **Agents**, tu agente conectado (en línea).
6. **Cambiar el YAML:** en `ci-build.yml` (bloque `pool` de la raíz) y en `cd-deploy.yml` (bloque `pool` del deployment job), sustituye `vmImage: 'windows-latest'` por `name: 'Default'`. Los dos YAML del lab traen esa alternativa en un comentario.
7. **Primera ejecución:** si aparece *This pipeline needs permission to access a resource before this run can continue*, pulsa **View** > **Permit** y confirma con **Permit**: autoriza al pipeline a usar el pool (o la service connection, o el environment) ([Learn: solución de problemas](https://learn.microsoft.com/azure/devops/pipelines/troubleshooting/troubleshooting)).

> **Seguridad del agente propio:** el agente ejecuta en tu equipo el código de los pipelines y guarda credenciales en su carpeta. Úsalo solo para este lab, no lo instales en un equipo compartido y, al terminar, quítalo con `.\config.cmd remove` desde `C:\agents`.

Con un solo parallel job, el CI y el CD no corren a la vez: el segundo espera en cola a que termine el primero. Learn aclara que una ejecución que espera una aprobación no ocupa el parallel job. Si tu primera ejecución se queda en cola sin empezar, la causa casi siempre es esta sección: camino A sin facturación configurada, o camino B con el agente parado.

### Instalar la extensión antes de empezar

Abre la página de [Power Platform Build Tools en Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=microsoft-IsvExpTools.PowerPlatform-BuildTools) (publicada por Microsoft), usa el botón para obtenerla gratis, elige tu organización e instálala. Learn indica que, si no ves la opción de instalar, te faltan permisos de instalación de extensiones en la organización ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools)).

---

## Datos de apoyo

### Valores que reemplazar en los YAMLs

| Placeholder | Tu valor real |
|---|---|
| `https://tu-org-dev.crm.dynamics.com` | URL de tu ambiente DEV |
| `https://tu-org-test.crm.dynamics.com` | URL de tu ambiente TEST |
| `SC-PowerPlatform-DEV` | Nombre que darás a la service connection de DEV |
| `SC-PowerPlatform-TEST` | Nombre que darás a la service connection de TEST |
| `SIT_SolicitudesInternas` | El **Name** de tu solución (no el nombre visible con espacios) |

### Estructura de ramas del lab

```
main        ← rama por defecto del repositorio (código de producción)
  └── develop  ← integración continua: el CI se dispara con cada push aquí
```

---

## Ejercicio 1 — App registration, usuarios de aplicación y service connections

> **Qué vas a hacer:** Crear la identidad de servicio en Microsoft Entra ID, darle acceso a los dos ambientes y registrarla en Azure DevOps para que el pipeline se autentique sin credenciales escritas en el YAML.
> **Duración:** 35 min

> **Sobre el tipo de autenticación:** Learn documenta tres tipos de conexión para Build Tools: **service principal mediante Workload Identity Federation** (la recomendada: credenciales federadas, sin secreto que rotar), **service principal con client secret** y **usuario/contraseña** (sin soporte de MFA) ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools)). Este lab usa client secret porque es el camino más corto en un tenant de práctica; en un cliente, usa Workload Identity Federation. Microsoft Learn indica que los client secrets no deben usarse en producción ([Learn: credenciales de app](https://learn.microsoft.com/entra/identity-platform/how-to-add-credentials)).

> **Atajo opcional con pac CLI:** Learn documenta `pac admin create-service-principal --environment <id del ambiente>`, que registra la aplicación en Entra ID, crea su secreto y la da de alta como usuario de aplicación con System Administrator en **ese** ambiente; muestra el Tenant ID, el Application ID y el Client Secret **una sola vez**. Después la agregas al otro ambiente con `pac admin assign-user --user "<Application ID>" --role "System administrator" --environment <id de SIT-TEST> --application-user` ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools)). Si lo usas, sáltate las Tareas 1.1 y 1.2 (la app no se llamará `SIT-PowerPlatform-Pipeline`: búscala por su Application ID en **App registrations** para ver su nombre y úsalo donde el lab y el Módulo 19 dicen `SIT-PowerPlatform-Pipeline`). El camino manual de abajo enseña qué crea ese comando.

### Tarea 1.1 — Crear el App registration en Entra ID

1. Entra en el [Microsoft Entra admin center](https://entra.microsoft.com) y ve a **Entra ID** > **App registrations** > **New registration** (nuevo registro).

2. Completa:

   | Campo | Valor |
   |---|---|
   | **Name** | `SIT-PowerPlatform-Pipeline` |
   | **Supported account types** | **Single tenant only - <tu tenant>** |

3. Haz clic en **Register**.

4. En la página **Overview** de la aplicación, anota:

   | Valor | Tu valor |
   |---|---|
   | **Application (client) ID** | |
   | **Directory (tenant) ID** | |

5. Ve a **Certificates & secrets** > **Client secrets** > **New client secret**:
   - Descripción: `pipeline-secret`
   - Expiración: menos de 12 meses (por ejemplo, 6 meses; Learn recomienda menos de 12 y el máximo es 24)
   - Haz clic en **Add**

6. **Copia la columna Value del secreto ahora**: Learn advierte que no se vuelve a mostrar cuando sales de la página. Guárdalo en un gestor de contraseñas, nunca en el repositorio.

   **Qué deberías ver:** el secreto en la lista de **Client secrets** con su fecha de expiración.

### Tarea 1.2 — Dar de alta el App registration como usuario de aplicación

El service principal necesita un **usuario de aplicación** con rol **System Administrator** en cada ambiente para exportar, importar y ejecutar el Solution Checker. Learn indica que el Checker necesita el privilegio `prvAppendmsdyn_analysisjob`, que System Administrator ya trae ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools)).

1. Entra en el [Power Platform admin center](https://admin.powerplatform.microsoft.com) > **Manage** > **Environments** y selecciona **SIT-DEV**.

2. Selecciona **Settings** > **Users + permissions** > **Application users** > **+ New app user**.

3. Selecciona **+ Add an app**, busca `SIT-PowerPlatform-Pipeline`, selecciónalo y haz clic en **Add**.

4. Elige el **Business Unit** raíz y escribe un **Email address** (por ejemplo, el tuyo), edita los roles de seguridad, marca **System Administrator**, guarda y confirma, y termina con **Create** ([Learn: usuarios de aplicación](https://learn.microsoft.com/power-platform/admin/manage-application-users)).

5. Repite los pasos 1-4 en **SIT-TEST**.

   **Qué deberías ver:** `SIT-PowerPlatform-Pipeline` en la lista de **Application users** de los dos ambientes. Si no aparece al buscarlo en el paso 3, comprueba que lo registraste en el mismo tenant que los ambientes.

### Tarea 1.3 — Crear las service connections en Azure DevOps

1. En tu proyecto de Azure DevOps, ve a **Project settings** (engranaje, abajo a la izquierda) > **Service connections** > **New service connection**.

2. Elige el tipo **Power Platform** y haz clic en **Next**. Si te pide un método de autenticación, elige el de **service principal con client secret** y haz clic en **Next**.

3. Rellena el formulario de DEV. Pide la URL del ambiente y los tres datos del App registration:

   | Dato | Valor |
   |---|---|
   | URL del ambiente (Server URL) | `https://tu-org-dev.crm.dynamics.com` |
   | Tenant ID | El **Directory (tenant) ID** de la Tarea 1.1 |
   | Application ID | El **Application (client) ID** de la Tarea 1.1 |
   | Client secret | El **Value** del secreto de la Tarea 1.1 |
   | **Service connection name** | `SC-PowerPlatform-DEV` |

4. Marca **Grant access permission to all pipelines** para no tener que autorizar cada pipeline en este tenant de práctica. Learn indica que esta opción **no se recomienda** en un proyecto real: allí se autoriza cada pipeline por separado ([Learn: service connections](https://learn.microsoft.com/azure/devops/pipelines/library/service-endpoints)).

5. Haz clic en **Save** (o **Verify and save** si aparece).

6. Repite para crear `SC-PowerPlatform-TEST` con la URL del ambiente TEST (mismo tenant ID, application ID y secret).

### Validación del Ejercicio 1

- [ ] El App registration existe en Entra ID con un client secret vigente
- [ ] `SIT-PowerPlatform-Pipeline` es usuario de aplicación con System Administrator en SIT-DEV y en SIT-TEST
- [ ] Las service connections `SC-PowerPlatform-DEV` y `SC-PowerPlatform-TEST` aparecen en **Service connections**

---

## Ejercicio 2 — Pipeline de CI: build y verificación

> **Qué vas a hacer:** Crear el YAML del CI, que versiona la solución con el número de build, la exporta como unmanaged y como managed, pasa el Solution Checker y publica los dos `.zip` como artefacto.
> **Duración:** 45 min

### Tarea 2.1 — Crear y clonar el repositorio

1. En Azure DevOps, ve a **Repos**. En el desplegable de repositorios, elige **New repository**; comprueba que el tipo es **Git**, ponle de nombre `sit-alm`, marca la opción de agregar un README y haz clic en **Create** ([Learn: crear un repo](https://learn.microsoft.com/azure/devops/repos/git/create-new-repo)). El README crea la rama `main`.

2. En **Repos** > **Files**, haz clic en **Clone** (arriba a la derecha), copia la URL y clónalo **en una carpeta que no tenga ya una subcarpeta `sit-alm`** (si la tiene, `git clone` falla con *destination path 'sit-alm' already exists*; por eso la Microlección 1 del Módulo 19 usa `sit-alm-local`):
   ```bash
   git clone <URL que copiaste>
   cd sit-alm
   ```

3. Crea la rama `develop` y la carpeta de los pipelines:
   ```bash
   git checkout -b develop
   mkdir azure-pipelines
   ```
   Git no versiona carpetas vacías: la carpeta se sube en la tarea siguiente, junto con el YAML.

   > Si hiciste la Microlección 1 del Módulo 19, puedes copiar a este repositorio la carpeta `solutions/` y el `.gitignore` de tu carpeta local `sit-alm-local`: así la solución desempaquetada y los pipelines quedan en el mismo sitio.

### Tarea 2.2 — Crear el pipeline de CI

1. Crea el archivo `azure-pipelines/ci-build.yml` (es el mismo YAML del Módulo 19, Microlección 2):

```yaml
# Pipeline CI — versionar, exportar, verificar y publicar la solución
# Disparo: push a develop

trigger:
  branches:
    include:
      - develop

variables:
  solution_name: 'SIT_SolicitudesInternas'
  artifact_name: 'solution-drop'

pool:
  vmImage: 'windows-latest'        # camino A (Microsoft-hosted)
  # Plan B (agente self-hosted): sustituye la línea de arriba por
  #   name: 'Default'

stages:
  - stage: Build
    displayName: 'Exportar, verificar y publicar'
    jobs:
      - job: ExportAndCheck
        displayName: 'Version -> Export -> Check -> Publish'
        steps:
          # 1. Siempre la primera tarea de Build Tools
          - task: PowerPlatformToolInstaller@2
            displayName: 'Instalar Power Platform Build Tools'
            inputs:
              DefaultVersion: true

          # 2. Falla rápido si la service connection está mal
          - task: PowerPlatformWhoAmi@2
            displayName: 'Comprobar la conexión con DEV'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'

          # 3. Versión trazable al build (cambia la versión de la solución en DEV)
          - task: PowerPlatformSetSolutionVersion@2
            displayName: 'Versionar la solución con el Build ID'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              SolutionName: '$(solution_name)'
              SolutionVersionNumber: '1.1.$(Build.BuildId).0'

          # 4. Exportar unmanaged (fuente para reconstruir DEV y para desempaquetar con Both)
          - task: PowerPlatformExportSolution@2
            displayName: 'Exportar unmanaged desde DEV'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              SolutionName: '$(solution_name)'   # el Name, no el nombre visible
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              Managed: false
              AsyncOperation: true
              MaxAsyncWaitTime: '60'

          # 5. Exportar managed (lo que se despliega a TEST/PROD)
          #    SolutionPackager no convierte unmanaged en managed: hay que exportarla así
          - task: PowerPlatformExportSolution@2
            displayName: 'Exportar managed desde DEV'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              SolutionName: '$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name)_managed.zip'
              Managed: true
              AsyncOperation: true
              MaxAsyncWaitTime: '60'

          # 6. Solution Checker sobre el mismo .zip managed que se desplegará:
          #    el build falla si hay incidencias High por encima del umbral
          - task: PowerPlatformChecker@2
            displayName: 'Ejecutar Solution Checker'
            inputs:
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              FilesToAnalyze: '$(Build.ArtifactStagingDirectory)/$(solution_name)_managed.zip'
              RuleSet: '0ad12346-e108-40b8-a956-9a8f95ea18c9'   # Solution checker
              ErrorLevel: 'HighIssueCount'
              ErrorThreshold: '0'
              FailOnPowerAppsCheckerAnalysisError: true

          # 7. Publicar los dos .zip para que el CD los consuma
          - task: PublishBuildArtifacts@1
            displayName: 'Publicar artefacto'
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: '$(artifact_name)'
              publishLocation: 'Container'
```

   Notas sobre el YAML (verificadas en [Learn: tareas de Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tool-tasks)):
   - `RuleSet: '0ad12346-e108-40b8-a956-9a8f95ea18c9'` es el conjunto **Solution checker**, el mismo que se ejecuta desde make.powerapps.com. `ErrorLevel` admite `CriticalIssueCount`, `HighIssueCount`, `MediumIssueCount`, `LowIssueCount` e `InformationalIssueCount`.
   - El Checker analiza el `_managed.zip`, el mismo binario que desplegará el CD; Learn indica que la tarea admite archivos managed y unmanaged. Si usas el plan B, recuerda cambiar el bloque `pool` como indica el comentario.
   - La versión empieza en `1.1.` para que siempre sea mayor que las `1.0.x.0` que importaste a mano en el Módulo 16.
   - Este CI no desempaqueta la solución: desempaquetar solo sirve si el resultado se guarda en Git, y eso es el reto avanzado.

2. Haz commit y push de la rama `develop`:
   ```bash
   git add azure-pipelines/ci-build.yml
   git commit -m "ci: agregar pipeline de build para SIT_SolicitudesInternas"
   git push -u origin develop
   ```

### Tarea 2.3 — Registrar el pipeline en Azure DevOps

1. En Azure DevOps, ve a **Pipelines** > **New pipeline** (o **Create pipeline** si es el primero del proyecto).

2. En la pantalla de origen del código (**Where is your code**), elige **Azure Repos Git** y el repositorio `sit-alm`.

3. En la pantalla de configuración, elige la opción de usar un **archivo YAML de Azure Pipelines existente**, selecciona la rama `develop` y la ruta `/azure-pipelines/ci-build.yml`, y continúa.

4. Guarda sin ejecutar todavía: la opción de guardar está en el desplegable junto al botón de ejecutar.

5. Cámbiale el nombre a `SIT-CI-Build` (sin espacios ni rayas largas) desde el menú de más acciones (**...**) del pipeline. Por defecto Azure DevOps nombra los pipelines como el repositorio, y el CD va a buscar este nombre exacto en su `source`: un espacio o una raya distinta bastan para que no lo encuentre ([Learn: pipeline triggers](https://learn.microsoft.com/azure/devops/pipelines/process/pipeline-triggers)).

6. Como el YAML solo existe en `develop` y la rama por defecto del repositorio es `main`, cambia la rama por defecto del pipeline: abre el pipeline > **Edit** > menú **More actions** > **Triggers** > **YAML** > **Get sources** > en **Default branch for manual and scheduled builds** elige `develop` > **Save** ([Learn: rama por defecto del pipeline](https://learn.microsoft.com/azure/devops/pipelines/process/pipeline-default-branch)).

7. Ejecuta el pipeline (**Run pipeline**). La primera vez puede tardar: el Solution Checker suele ser la tarea más larga.

   **Qué deberías ver:** el stage `Build` en verde y las 7 tareas del YAML completadas sin errores (Azure DevOps añade además sus propios pasos, como la inicialización del job y el checkout). En la pestaña de artefactos de la ejecución, `solution-drop` con `SIT_SolicitudesInternas.zip` y `SIT_SolicitudesInternas_managed.zip`. En DEV, la solución muestra ahora la versión `1.1.<BuildId>.0`.

   **Si no lo ves:**
   - Se queda en cola sin empezar: revisa el apartado de agentes de los prerrequisitos (facturación del camino A, o el agente del plan B corriendo con `run.cmd`).
   - Aparece *This pipeline needs permission to access a resource before this run can continue*: **View** > **Permit** > **Permit**.
   - Falla `Comprobar la conexión con DEV`: revisa la service connection y el usuario de aplicación de SIT-DEV.
   - Falla el Checker: el resultado es un archivo `.sarif` con cada incidencia, que la tarea publica como artefacto de la ejecución (por defecto `CodeAnalysisLogs`). Descárgalo y ábrelo en Visual Studio Code con una extensión para archivos SARIF ([Learn: Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools)).

### Validación del Ejercicio 2

- [ ] El archivo `ci-build.yml` está en la rama `develop` del repositorio
- [ ] El pipeline `SIT-CI-Build` está registrado y su rama por defecto es `develop`
- [ ] Al ejecutarlo manualmente, todas las tareas completan sin errores y el artefacto `solution-drop` contiene los dos `.zip`

---

## Ejercicio 3 — Pipeline de CD: despliegue con aprobación

> **Qué vas a hacer:** Crear el pipeline de Continuous Delivery que descarga el artefacto del CI y lo despliega en TEST, con una aprobación manual obligatoria antes de la importación.
> **Duración:** 40 min

### Tarea 3.1 — Crear el environment con aprobación

Un **environment** de Azure Pipelines (no confundir con un ambiente de Power Platform) puede tener **Approvals and checks**: el stage que despliega a ese environment se pausa hasta que alguien apruebe o venza el timeout. Las aprobaciones no se definen en el YAML, así que quien edita el YAML no puede saltárselas ([Learn: approvals](https://learn.microsoft.com/azure/devops/pipelines/process/approvals)).

1. En Azure DevOps, ve a **Pipelines** > **Environments** > **Create environment** ([Learn: environments](https://learn.microsoft.com/azure/devops/pipelines/process/environments)).

2. Crea el environment:
   - Nombre: `SIT-TEST`
   - Descripción: `Ambiente de pruebas — requiere aprobación del arquitecto`
   - Recurso: ninguno (un environment vacío sirve para registrar el historial de despliegues)
   - Haz clic en **Create**.

3. Abre el environment `SIT-TEST` > pestaña **Approvals and checks** > **+** > **Approvals** > **Next**.

4. Configura:
   - **Approvers:** tu usuario (en un proyecto real, el arquitecto o el líder técnico)
   - Instrucciones para los aprobadores: `Verifica que el Solution Checker pasó sin errores críticos antes de aprobar.`
   - **Timeout:** 1 día. Si nadie aprueba antes, el stage se marca como omitido.
   - Deja permitido que el aprobador apruebe sus propias ejecuciones: en este lab eres a la vez quien lanza el pipeline y quien aprueba.

5. Haz clic en **Create**.

### Tarea 3.2 — Crear el pipeline de CD

1. Crea el archivo `azure-pipelines/cd-deploy.yml` (el mismo YAML del Módulo 19, Microlección 3):

```yaml
# Pipeline CD — Desplegar la solución managed a TEST
# Se dispara cuando el CI termina bien en develop

trigger: none                      # el CD no se dispara por push

resources:
  pipelines:
    - pipeline: ci_build           # alias: también es la carpeta de descarga
      source: 'SIT-CI-Build'       # nombre exacto del pipeline de CI
      trigger:
        branches:
          include:
            - develop

variables:
  solution_name: 'SIT_SolicitudesInternas'
  artifact_name: 'solution-drop'

stages:
  - stage: DeployTest
    displayName: 'Deploy a TEST'
    jobs:
      - deployment: DeployTEST
        displayName: 'Importar solución en TEST'
        environment: 'SIT-TEST'    # aquí se aplica la aprobación
        pool:
          vmImage: 'windows-latest'  # Plan B (self-hosted): name: 'Default'
        strategy:
          runOnce:
            deploy:
              steps:
                # En el hook deploy de un deployment job, los artefactos del pipeline resource
                # se descargan solos en $(Pipeline.Workspace)/<alias>/<artefacto>
                - task: PowerPlatformToolInstaller@2
                  displayName: 'Instalar Power Platform Build Tools'
                  inputs:
                    DefaultVersion: true

                - task: PowerPlatformImportSolution@2
                  displayName: 'Importar solución managed en TEST'
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: 'SC-PowerPlatform-TEST'
                    SolutionInputFile: '$(Pipeline.Workspace)/ci_build/$(artifact_name)/$(solution_name)_managed.zip'
                    AsyncOperation: true     # sin esto, la importación agota el tiempo a los 4 minutos
                    MaxAsyncWaitTime: '120'
                    PublishWorkflows: true   # activa los procesos de la solución tras importar
                    # ConvertToManaged no hace falta: Learn lo marca como obsoleto, porque al
                    # importar una solución managed sus componentes ya quedan como managed
```

   Por qué la ruta lleva `ci_build`: Learn indica que los artefactos de un pipeline resource se descargan en `$(Pipeline.Workspace)/<identificador del pipeline>/<identificador del artefacto>`, y que en un deployment job se descargan automáticamente al principio del hook `deploy` ([Learn: resources](https://learn.microsoft.com/azure/devops/pipelines/process/resources), [Learn: deployment jobs](https://learn.microsoft.com/azure/devops/pipelines/process/deployment-jobs)). Aquí el identificador es el alias `ci_build` y el artefacto es `solution-drop`.

   > **Variables de entorno y referencias de conexión:** la solución SIT tiene la variable `Correo Equipo TI` y referencias de conexión. Este CD no les da valores: funciona porque `SIT-TEST` ya los tiene desde el Módulo 16. En un ambiente nuevo, la importación terminaría en verde pero con el flujo apagado y la variable vacía. La solución es un **deployment settings file** (JSON generado con `pac solution create-settings`) pasado a la importación con `UseDeploymentSettingsFile: true` y `DeploymentSettingsFile`; como un deployment job no descarga el repositorio, el job necesita además `- checkout: self` ([Learn: deployment settings](https://learn.microsoft.com/power-platform/alm/conn-ref-env-variables-build-tools)). Es el reto de construcción de la Microlección 3 del Módulo 19. No uses `PowerPlatformSetConnectionVariables@2` para esto: solo define variables `BuildTools.*` para tareas de script posteriores, no configura referencias de conexión.

2. Commit y push:
   ```bash
   git add azure-pipelines/cd-deploy.yml
   git commit -m "cd: agregar pipeline de deploy a TEST"
   git push origin develop
   ```
   Este push dispara también el CI (es normal: el CI se dispara con cualquier push a `develop`).

3. Registra el pipeline como en la Tarea 2.3: **New pipeline** > **Azure Repos Git** > `sit-alm` > archivo YAML existente en la rama `develop`, ruta `/azure-pipelines/cd-deploy.yml` > guarda sin ejecutar > renómbralo a `SIT-CD-Deploy-TEST`.

4. **Cambia también su rama por defecto a `develop`** (**Edit** > **More actions** > **Triggers** > **YAML** > **Get sources** > **Default branch for manual and scheduled builds** > **Save**). Este paso es imprescindible para que el CD se dispare solo: Learn indica que los *pipeline completion triggers* evalúan los filtros de rama del YAML que está en la rama por defecto del pipeline. Si esa rama es `main` y `cd-deploy.yml` solo existe en `develop`, el CD nunca se dispara ([Learn: pipeline triggers](https://learn.microsoft.com/azure/devops/pipelines/process/pipeline-triggers)).

5. **Comparte las conexiones de SIT-TEST con el service principal.** Con `PublishWorkflows: true`, el service principal que importa intenta activar los flujos de la solución, y Learn indica que quien activa un flujo tiene que ser dueño de todas sus conexiones o tenerlas compartidas (si no, la activación falla con `ConnectionAuthorizationFailed`). Las conexiones de SIT-TEST son tuyas, del Módulo 16. En [make.powerapps.com](https://make.powerapps.com), ambiente **SIT-TEST** > **Connections** > cada conexión que usa la solución (Dataverse, Office 365 Outlook) > **Share** > escribe `SIT-PowerPlatform-Pipeline` > permiso **Can use** > **Save** ([Learn: compartir conexiones para activar flujos](https://learn.microsoft.com/power-apps/maker/data-platform/create-connection-reference#share-connections-with-another-user-so-flows-can-be-enabled)).

### Validación del Ejercicio 3

- [ ] El environment `SIT-TEST` existe con una aprobación configurada
- [ ] El archivo `cd-deploy.yml` está en la rama `develop`
- [ ] El pipeline `SIT-CD-Deploy-TEST` está registrado y su rama por defecto es `develop`
- [ ] Las conexiones de SIT-TEST que usa la solución están compartidas con `SIT-PowerPlatform-Pipeline` (**Can use**)

---

## Ejercicio 4 — Verificar la ejecución end-to-end

> **Qué vas a hacer:** Ejecutar el flujo completo: push a `develop` → CI → artefacto → el CD espera la aprobación → apruebas → importación en TEST.
> **Duración:** 40 min

### Tarea 4.1 — Disparar el CI con un cambio en la solución

1. En [make.powerapps.com](https://make.powerapps.com), en SIT-DEV, abre la solución `SIT_SolicitudesInternas` y haz un cambio menor (por ejemplo, la **Description** de la tabla `Solicitud TI`). Guarda.

   > El CI se dispara por push a `develop`, no por cambios en Dataverse: exporta lo que haya en DEV en el momento en que corre. En un equipo real, el disparo sería un push de código (un plugin, un web resource) o de la solución desempaquetada.

2. Para disparar el CI, haz un push a `develop`:
   ```bash
   echo "trigger" > trigger.txt
   git add trigger.txt
   git commit -m "chore: disparar el CI"
   git push origin develop
   ```

### Tarea 4.2 — Monitorear el CI

1. En Azure DevOps > **Pipelines** > `SIT-CI-Build`, verifica que hay una ejecución activa y ábrela.

2. Abre el job para ver las tareas en tiempo real. La más larga suele ser el Solution Checker.

3. Al terminar, abre el artefacto `solution-drop` de la ejecución y comprueba que contiene `SIT_SolicitudesInternas.zip` y `SIT_SolicitudesInternas_managed.zip`.

4. Anota el **Build ID** de la ejecución (aparece en la URL de la ejecución como `buildId=`).

### Tarea 4.3 — Aprobar el despliegue a TEST

1. Cuando el CI termina bien, el CD debería arrancar solo por el trigger del pipeline resource. Si no arranca, revisa el paso 4 de la Tarea 3.2 y, mientras tanto, ejecútalo a mano: **Pipelines** > `SIT-CD-Deploy-TEST` > **Run pipeline** (Learn indica que, en una ejecución manual, en **Resources** puedes elegir qué ejecución del CI usar).

2. En su primera ejecución, Azure DevOps puede pedirte que autorices el uso del environment `SIT-TEST` o de la service connection: revisa qué recurso pide y permítelo.

3. El stage `DeployTest` se **pausa** esperando la aprobación del environment `SIT-TEST`. Recibirás una notificación (correo o aviso en Azure DevOps).

4. En la ejecución, abre la aprobación pendiente, escribe el comentario `Solution Checker OK — aprobado para TEST` y aprueba (**Approve**).

5. El pipeline continúa e importa la solución en TEST.

   **Qué deberías ver:** el stage esperando la aprobación y, tras aprobar, la importación en verde.

### Tarea 4.4 — Verificar la solución en TEST

1. En [make.powerapps.com](https://make.powerapps.com), selecciona el ambiente **SIT-TEST** > **Solutions**.

2. Comprueba que `SIT_SolicitudesInternas` aparece como solución **managed** con la versión `1.1.<BuildId>.0`, donde `<BuildId>` es el que anotaste en la Tarea 4.2.

3. Abre la solución: en una solución managed no se pueden agregar ni quitar componentes. Que algún componente admita personalizaciones depende de sus *managed properties*; no edites nada en TEST, porque crearías una capa unmanaged encima de la managed ([Learn: SolutionPackager, managed y unmanaged](https://learn.microsoft.com/power-platform/alm/solution-packager-tool)).

4. Revisa el flujo de notificación y el valor actual de `Correo Equipo TI`: como `SIT-TEST` ya tenía conexiones y valor del Módulo 16 y las compartiste con el service principal (Tarea 3.2, paso 5), el flujo debería seguir **On**. Si quedó **Off**, falta compartir alguna conexión.

### Validación del Ejercicio 4

- [ ] El CI completó todas sus tareas en verde
- [ ] El artefacto `solution-drop` contiene los dos ZIPs (unmanaged y managed)
- [ ] El CD se disparó solo tras el CI y se pausó esperando la aprobación del environment SIT-TEST
- [ ] Al aprobar, el CD completó la importación en TEST
- [ ] La solución aparece como managed en TEST con la versión `1.1.<BuildId>.0` del CI

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El pipeline se queda en cola sin empezar | Camino A: la organización no tiene el nivel gratuito de agentes Microsoft-hosted (sin facturación configurada, o con una Azure Free Trial, que no se admite). Plan B: el agente self-hosted no está corriendo | Configura la facturación con una suscripción de pago por uso del mismo tenant de Entra ID, o usa el plan B con `pool: name: 'Default'` y `run.cmd` abierto (apartado **Agentes de Azure Pipelines**) |
| *This pipeline needs permission to access a resource before this run can continue* | Primera vez que el pipeline usa el pool, la service connection o el environment | **View** > **Permit** > **Permit** |
| Importación en verde en SIT-TEST, pero el flujo quedó Off o falla con `ConnectionAuthorizationFailed` | El service principal activó los flujos sin ser dueño de sus conexiones ni tenerlas compartidas | **Connections** > la conexión > **Share** > `SIT-PowerPlatform-Pipeline` > **Can use** (Tarea 3.2, paso 5) |
| Error de autenticación o 401 en `PowerPlatformWhoAmi` o en la exportación | El service principal no es usuario de aplicación del ambiente, o el secreto es incorrecto o caducó | Revisa **Application users** en el Power Platform admin center (rol System Administrator) y los datos de la service connection |
| `export` dice que no encuentra la solución | `SolutionName` lleva el nombre visible | Usa el **Name** (`SIT_SolicitudesInternas`), no el nombre visible con espacios |
| El paso "empaquetar como Managed" de una versión anterior del lab no produce una managed válida | Se intentó convertir la unmanaged desempaquetada en managed con `PowerPlatformPackSolution@2`: SolutionPackager no convierte entre tipos | Exporta también la managed con `PowerPlatformExportSolution@2` y `Managed: true`, como en este YAML |
| Solution Checker falla el build | La solución tiene incidencias de severidad High (o superior) por encima del umbral | Corrige lo que indica el informe del Checker; documenta las excepciones aceptadas en vez de subir el umbral para todo |
| El CD no se disparó después del CI | La rama por defecto del pipeline de CD es `main`, donde no está `cd-deploy.yml`; o `source` no coincide con el nombre del CI | Cambia **Default branch for manual and scheduled builds** del CD a `develop` y verifica que `source` es exactamente `SIT-CI-Build` |
| "No se encontró el artifact" o el `.zip` en el CD | La ruta no incluye el alias del pipeline resource: el artefacto se descarga en `$(Pipeline.Workspace)/<alias>/<artefacto>` | Usa `$(Pipeline.Workspace)/ci_build/solution-drop/SIT_SolicitudesInternas_managed.zip` y comprueba que `ArtifactName` del CI y `artifact_name` del CD coinciden |
| La importación agota el tiempo | Sin `AsyncOperation: true`, Learn indica que la tarea de importación se corta a los 4 minutos | Deja `AsyncOperation: true` y un `MaxAsyncWaitTime` suficiente |
| La solución se importa pero no es managed | Se importó el `.zip` unmanaged en vez del `_managed.zip` | Revisa `SolutionInputFile`. `ConvertToManaged` no lo arregla: Learn lo marca como obsoleto |
| Importación en verde, pero en un ambiente nuevo el flujo está apagado y la variable vacía | No se dieron conexiones ni valores para ese ambiente | Deployment settings file del ambiente con `UseDeploymentSettingsFile: true` y `- checkout: self` en el job (reto de la Microlección 3 del Módulo 19) |
| El environment no pide aprobación | La aprobación no se configuró en ese environment, o el YAML apunta a otro nombre | Revisa **Pipelines** > **Environments** > `SIT-TEST` > **Approvals and checks** y el valor de `environment:` en el YAML |

---

## Checklist final

- [ ] App registration en Entra ID con client secret vigente (y la alternativa sin secreto, Workload Identity Federation, identificada para un cliente real)
- [ ] Service principal como usuario de aplicación con System Administrator en SIT-DEV y SIT-TEST
- [ ] Service connections `SC-PowerPlatform-DEV` y `SC-PowerPlatform-TEST` funcionando
- [ ] Pipeline CI `SIT-CI-Build` completa todas sus tareas sin errores
- [ ] El artefacto contiene los dos ZIPs al final del CI
- [ ] Pipeline CD `SIT-CD-Deploy-TEST` se dispara solo y se pausa para aprobación
- [ ] La aprobación del environment SIT-TEST permite continuar el deploy
- [ ] La solución aparece como managed en TEST con la versión del build

## Evidencia esperada

| Campo | Tu valor |
|---|---|
| Build ID de la ejecución del CI del Ejercicio 4 | |
| Versión de la solución en SIT-DEV y en SIT-TEST después del CD | |
| Incidencias que reportó el Checker por severidad (o "0") | |
| Tiempo que el stage `DeployTest` estuvo esperando aprobación | |
| Comentario que escribiste al aprobar | |

- Captura del CI ejecutado con éxito y del artefacto con los dos ZIPs
- Captura del CD pausado esperando aprobación y luego completado
- Captura de la solución managed en TEST con su versión
- Una entrada de **"release notes" de 3-5 líneas en inglés** para este despliegue (formato real de
  equipo: `## [version] - what changed - why - rollback plan`), como las que acompañarían el PR o
  el ticket de release en un equipo que trabaja en inglés.

## Criterios de aprobación

- El pipeline CI corre sin intervención manual y sin errores
- El pipeline CD no despliega a TEST sin la aprobación explícita del environment
- La solución llega a TEST en formato managed, con la versión del build que pasó el Checker
- 100% de los ítems del Checklist final marcados

---

## Reto adicional

**Reto básico:** Agrega un paso de notificación al final del CD que envíe un mensaje a un canal de Teams cuando el despliegue fue exitoso. Usa la tarea `PowerShell` con un HTTP POST al webhook del canal, y guarda la URL del webhook como variable secreta del pipeline, no en el YAML.

**Reto intermedio:** Diseña un tercer stage `DeployProd` contra un environment `SIT-PROD`, que solo se ejecute si el de TEST fue exitoso y que pida **dos firmas**. Learn advierte que, si el aprobador es un **grupo**, basta con que apruebe **una** persona del grupo ([Learn: approvals](https://learn.microsoft.com/azure/devops/pipelines/process/approvals)): poner un grupo de dos personas no exige dos firmas. Este reto es **exploratorio**: la página de Learn sobre aprobaciones no documenta cómo exigir un número mínimo de aprobaciones. Explora las opciones del check **Approvals** (incluidas las avanzadas, si las ves), prueba por ejemplo con dos usuarios individuales en vez de un grupo, y documenta qué configuraste, qué comportamiento observaste y cómo lo comprobaste; si no encuentras una forma fiable, propón una alternativa (por ejemplo, dos checks de aprobación con aprobadores distintos) y di qué riesgo deja abierta. Si tu tenant no tiene capacidad para un tercer ambiente de Power Platform, entrega solo el diseño (YAML del stage y configuración de la aprobación).

**Reto avanzado:** Automatiza la **solución como código**: tras las dos exportaciones, desempaqueta con `PowerPlatformUnpackSolution@2` y `SolutionType: Both` (necesita el `.zip` unmanaged y el `_managed.zip` en la misma carpeta) y haz commit del resultado al repositorio, para ver en los Pull Requests qué cambió en la solución. Investiga y documenta qué permiso necesita la identidad del build para hacer push y cómo evitas que ese commit vuelva a disparar el CI.

---

## Preguntas de repaso

1. ¿Por qué el deploy a TEST usa la solución **managed** exportada por el CI y no la unmanaged? ¿Por qué no sirve "empaquetarla como managed" desde la unmanaged?
2. ¿Qué detecta el **Solution Checker** que no puede detectar una prueba manual?
3. ¿Cuál es la diferencia entre un **trigger por push** (CI) y un **trigger de pipeline resource** (CD)? ¿Por qué importa la rama por defecto del pipeline de CD?
4. ¿Por qué se usa un **service principal** (App registration) en lugar de credenciales personales en el pipeline, y por qué en un cliente real preferirías Workload Identity Federation a un client secret?

---

## Limpieza del laboratorio

> Los archivos YAML del repositorio son permanentes (son código). Puedes eliminar los pipelines de Azure DevOps sin afectar el repositorio.

- Para eliminar las service connections: Azure DevOps > **Project settings** > **Service connections** > selecciona la conexión > elimínala.
- Si no vas a seguir usando el pipeline, elimina el client secret en Entra ID (**Certificates & secrets**) para que no quede una credencial activa.

---

## Siguiente laboratorio recomendado

➡️ **Lab 22 — Copilot Studio: Agente Conversacional con SSO y Knowledge Sources**

**Por qué ir ahí:** Con el ALM automatizado del Lab 19, puedes desplegar el agente de Copilot Studio del Lab 22 (también dentro de la solución SIT) a TEST y PROD con el mismo pipeline — completando el ciclo DevOps.
