---
id: lab-19
title: "ALM y CI/CD — Pipeline de Azure DevOps para Power Platform"
level: "N3"
duration: "120 min"
product: ["Azure DevOps", "Power Platform CLI", "Dataverse"]
certifications: ["PL-400"]
role: ["Developer", "DevOps Engineer"]
prerequisites:
  - "Solución SIT_SolicitudesInternas con al menos Canvas App o MDA creadas"
  - "Cuenta de Azure DevOps (dev.azure.com — gratuita)"
  - "App Registration creada en Microsoft Entra ID con permisos de Dataverse"
  - "Módulo 19 estudiado: ALM y CI/CD"
---

# Lab 19 — ALM y CI/CD: Pipeline de Azure DevOps para Power Platform (SIT)

## Objetivo

Al finalizar este laboratorio podrás configurar un pipeline de CI/CD completo en Azure DevOps que exporta automáticamente la solución `SIT_SolicitudesInternas` desde el ambiente DEV, ejecuta Solution Checker, la empaqueta como Managed y la despliega a un ambiente TEST con aprobación manual.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación

**Problema a resolver:** La solución SIT se ha exportado e importado manualmente decenas de veces entre ambientes. Cada export manual es un riesgo: alguien puede olvidar ejecutar el Solution Checker, importar la versión equivocada o saltarse la aprobación del arquitecto. Un proceso sin errores humanos requiere automatización.

**Por qué CI/CD con Azure DevOps:** El pipeline garantiza que el mismo binario que pasó el Solution Checker en DEV es exactamente el que llega a TEST y PROD. La aprobación humana queda registrada en el historial del pipeline, no en un email.

## Lo que vas a construir

- **App Registration** en Entra ID con permisos de Dataverse (Service Principal)
- **Service Connections** para los ambientes DEV y TEST
- **Pipeline de CI** (`ci-build.yml`): export unmanaged → unpack → Solution Checker → pack managed → artifact
- **Pipeline de CD** (`cd-deploy.yml`): consume el artifact → deploy a TEST → aprobación → disponible para PROD

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Configurar App Registration y Service Connections | 25 min |
| Ejercicio 2 — Pipeline de CI: build y verificación | 35 min |
| Ejercicio 3 — Pipeline de CD: despliegue con aprobación | 30 min |
| Ejercicio 4 — Verificar ejecución end-to-end | 30 min |
| **Total** | **120 min** |

## Nivel

**N3 Avanzado** — Certificación objetivo: **PL-400**

## Tecnologías utilizadas

- Azure DevOps (Pipelines, Environments, Service Connections)
- Power Platform Build Tools (extensión de Azure DevOps)
- Power Platform CLI (`pac`)
- Microsoft Entra ID (App Registration, Service Principal)
- YAML Pipelines

## Prerrequisitos

### Entorno

- [ ] Cuenta en [dev.azure.com](https://dev.azure.com) con un proyecto creado
- [ ] Dos ambientes de Power Platform: **SIT-DEV** y **SIT-TEST**
- [ ] Solución `SIT_SolicitudesInternas` (unmanaged) en el ambiente SIT-DEV
- [ ] Acceso de administrador a Microsoft Entra ID del tenant (para crear App Registration)
- [ ] Repositorio Git en Azure DevOps (puede estar vacío al inicio)

### Instalar extensión antes de empezar

En tu organización de Azure DevOps → **Marketplace** → busca **"Power Platform Build Tools"** (publicado por Microsoft) → **Instalar gratis**.

---

## Datos de apoyo

### Valores que reemplazar en los YAMLs

| Placeholder | Tu valor real |
|---|---|
| `tu-org-dev.crm.dynamics.com` | URL de tu ambiente DEV |
| `tu-org-test.crm.dynamics.com` | URL de tu ambiente TEST |
| `SC-PowerPlatform-DEV` | Nombre que darás a la Service Connection de DEV |
| `SC-PowerPlatform-TEST` | Nombre que darás a la Service Connection de TEST |
| `SIT_SolicitudesInternas` | Nombre exacto de tu solución (case-sensitive) |

### Estructura de ramas recomendada

```
main        ← código de producción
  └── develop  ← integración continua (CI se dispara aquí)
       └── feature/lab-19  ← tu trabajo de este lab
```

---

## Ejercicio 1 — App Registration y Service Connections

> **Qué vas a hacer:** Crear la identidad de servicio en Azure AD y registrarla en Azure DevOps para que el pipeline pueda autenticarse contra los ambientes de Power Platform sin contraseñas hardcodeadas.
> **Duración:** 25 min

### Tarea 1.1 — Crear App Registration en Entra ID

1. Ve a [portal.azure.com](https://portal.azure.com) → **Microsoft Entra ID** → **Registros de aplicaciones** → **+ Nuevo registro**.

2. Completa:

   | Campo | Valor |
   |---|---|
   | Nombre | SIT-PowerPlatform-Pipeline |
   | Tipos de cuenta compatibles | Solo esta organización |
   | URI de redireccionamiento | (dejar vacío) |

3. Haz clic en **Registrar**.

4. Anota los valores de la página de resumen:

   | Valor | Dónde copiarlo |
   |---|---|
   | **Application (client) ID** | Panel de resumen |
   | **Directory (tenant) ID** | Panel de resumen |

5. Ve a **Certificados y secretos** → **+ Nuevo secreto de cliente**:
   - Descripción: `pipeline-secret`
   - Expiración: 12 meses
   - Haz clic en **Agregar**

6. **Copia el Valor del secreto inmediatamente** — solo se muestra una vez.

   | Valor | Dónde copiarlo |
   |---|---|
   | **Client Secret** | Columna "Valor" (cópialo ahora) |

### Tarea 1.2 — Agregar la App Registration como usuario de los ambientes

El Service Principal necesita permisos en los ambientes de Power Platform para exportar e importar soluciones.

1. Ve a [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com) → **Entornos** → selecciona **SIT-DEV**.

2. **Configuración** → **Usuarios + permisos** → **Usuarios de aplicación** → **+ Nuevo usuario de aplicación**.

3. Haz clic en **+ Agregar una aplicación**:
   - Busca el nombre `SIT-PowerPlatform-Pipeline` (el App Registration creado)
   - Selecciónalo y haz clic en **Agregar**

4. Asigna el rol de seguridad: **System Administrator**.

5. Repite los pasos 1-4 para el ambiente **SIT-TEST**.

### Tarea 1.3 — Crear Service Connections en Azure DevOps

1. En tu proyecto de Azure DevOps → **Configuración del proyecto** (engranaje inferior izquierdo) → **Service connections** → **+ Nueva conexión de servicio**.

2. Selecciona **Power Platform** → **Siguiente**.

3. Configura la conexión para DEV:

   | Campo | Valor |
   |---|---|
   | Authentication method | Application Id and client secret (manual) |
   | Server URL | `https://tu-org-dev.crm.dynamics.com` |
   | Tenant Id | Tu Tenant ID del paso 1.1 |
   | Application Id | Tu Client ID del paso 1.1 |
   | Client secret | Tu Client Secret del paso 1.1 |
   | Service connection name | `SC-PowerPlatform-DEV` |
   | ✅ Grant access permission to all pipelines | Marcado |

4. Haz clic en **Guardar**.

5. Repite para crear `SC-PowerPlatform-TEST` con la URL del ambiente TEST (mismos Client ID y Secret).

### Validación del Ejercicio 1

- [ ] App Registration existe en Entra ID con Client Secret activo
- [ ] El Service Principal está agregado como usuario de aplicación en SIT-DEV y SIT-TEST
- [ ] Las dos Service Connections aparecen en Azure DevOps sin errores de verificación

---

## Ejercicio 2 — Pipeline de CI: build y verificación

> **Qué vas a hacer:** Crear el archivo YAML del pipeline de CI que exporta la solución, la desempaqueta para control de versiones, ejecuta Solution Checker y la empaqueta como Managed.
> **Duración:** 35 min

### Tarea 2.1 — Inicializar el repositorio

1. En Azure DevOps → **Repos** → si el repositorio está vacío, clónalo localmente:
   ```bash
   git clone https://dev.azure.com/tu-org/tu-proyecto/_git/tu-repo
   cd tu-repo
   ```

2. Crea la estructura de carpetas:
   ```bash
   mkdir azure-pipelines
   mkdir solutions
   ```

3. Haz commit inicial:
   ```bash
   git add .
   git commit -m "init: estructura del repositorio"
   git push
   ```

### Tarea 2.2 — Crear el pipeline de CI

1. Crea el archivo `azure-pipelines/ci-build.yml`:

```yaml
# Pipeline CI — Exportar, verificar y empaquetar solución Power Platform
# Disparo: push a develop o feature/*

trigger:
  branches:
    include:
      - develop
      - feature/*

variables:
  solution_name: 'SIT_SolicitudesInternas'
  artifact_name: 'solution-drop'

pool:
  vmImage: 'windows-latest'

stages:
  - stage: Build
    displayName: 'Exportar y Verificar Solución'
    jobs:
      - job: ExportAndCheck
        displayName: 'Export → Unpack → Check → Pack'

        steps:
          # 1. Instalar Power Platform Build Tools
          - task: PowerPlatformToolInstaller@2
            displayName: '📦 Instalar Power Platform Build Tools'
            inputs:
              DefaultVersion: true

          # 2. Exportar solución unmanaged desde DEV
          - task: PowerPlatformExportSolution@2
            displayName: '⬇️ Exportar solución unmanaged desde DEV'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              SolutionName: '$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              Managed: false
              AsyncOperation: true
              MaxAsyncWaitTime: '60'

          # 3. Desempaquetar para source control (permite ver diffs en PRs)
          - task: PowerPlatformUnpackSolution@2
            displayName: '📂 Desempaquetar solución para source control'
            inputs:
              SolutionInputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              SolutionTargetFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionType: 'Unmanaged'

          # 4. Commit del código desempaquetado (opcional — requiere permisos extra)
          # Descomenta si quieres persistir el código desempaquetado en el repositorio
          # - script: |
          #     git config user.email "pipeline@dev.azure.com"
          #     git config user.name "Azure Pipeline"
          #     git add solutions/
          #     git diff --staged --quiet || git commit -m "ci: actualizar solución desempaquetada"
          #     git push origin HEAD:develop
          #   displayName: '💾 Commit de solución desempaquetada'

          # 5. Solution Checker — análisis de calidad
          - task: PowerPlatformChecker@2
            displayName: '🔍 Ejecutar Solution Checker'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              FilesToAnalyze: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              RuleSet: '0ad12346-e108-40b8-a956-9a373e9d6492'
              ErrorLevel: 'HighIssueCount'
              ErrorThreshold: '0'
              FailOnPowerAppsCheckerAnalysisError: true
            continueOnError: false

          # 6. Empaquetar como Managed (lo que se despliega a TEST/PROD)
          - task: PowerPlatformPackSolution@2
            displayName: '📦 Empaquetar como Managed Solution'
            inputs:
              SolutionSourceFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name)_managed.zip'
              SolutionType: 'Managed'

          # 7. Publicar artifact para que el pipeline de CD lo consuma
          - task: PublishBuildArtifacts@1
            displayName: '🚀 Publicar artifact'
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: '$(artifact_name)'
              publishLocation: 'Container'
```

2. Haz commit y push del archivo:
   ```bash
   git add azure-pipelines/ci-build.yml
   git commit -m "ci: agregar pipeline de build para SIT_SolicitudesInternas"
   git push origin develop
   ```

### Tarea 2.3 — Registrar el pipeline en Azure DevOps

1. En Azure DevOps → **Pipelines** → **+ Nuevo pipeline**.

2. Selecciona dónde está el código: **Azure Repos Git** → tu repositorio.

3. Selecciona **Archivo YAML existente** → `/azure-pipelines/ci-build.yml`.

4. Haz clic en **Continuar** → **Guardar** (no Ejecutar todavía).

5. Renombra el pipeline: `SIT — CI Build`.

### Validación del Ejercicio 2

- [ ] El archivo `ci-build.yml` existe en el repositorio
- [ ] El pipeline `SIT — CI Build` está registrado en Azure DevOps
- [ ] Al ejecutar manualmente el pipeline: los 7 pasos completan sin errores

---

## Ejercicio 3 — Pipeline de CD: despliegue con aprobación

> **Qué vas a hacer:** Crear el pipeline de Continuous Delivery que consume el artifact del CI y lo despliega al ambiente TEST, con una aprobación manual obligatoria antes del deploy.
> **Duración:** 30 min

### Tarea 3.1 — Crear el Environment con aprobación

Los **Environments** en Azure DevOps son el mecanismo para configurar aprobaciones humanas antes de un despliegue.

1. En Azure DevOps → **Pipelines** → **Environments** → **+ Nuevo environment**.

2. Crea el environment `SIT-TEST`:
   - Nombre: `SIT-TEST`
   - Descripción: `Ambiente de pruebas — requiere aprobación del arquitecto`
   - Resource: None

3. Una vez creado, haz clic en el ícono `...` (tres puntos) → **Approvals and checks** → **+ Agregar** → **Approvals**.

4. Configura:
   - **Approvers:** tu usuario (en producción sería el arquitecto o el líder técnico)
   - **Timeout:** 1 día
   - Instrucciones: `Verifica que el Solution Checker pasó sin errores críticos antes de aprobar.`

5. Guarda.

### Tarea 3.2 — Crear el pipeline de CD

1. Crea el archivo `azure-pipelines/cd-deploy.yml`:

```yaml
# Pipeline CD — Desplegar solución Managed a TEST
# Solo se dispara después de que el CI Build genera el artifact

trigger: none  # El CD no se dispara por push — lo activa el CI

resources:
  pipelines:
    - pipeline: ci_build
      source: 'SIT — CI Build'
      trigger:
        branches:
          include:
            - develop

variables:
  solution_name: 'SIT_SolicitudesInternas'
  artifact_name: 'solution-drop'

stages:
  - stage: DeployTest
    displayName: '🚀 Deploy a TEST'
    jobs:
      - deployment: DeployTEST
        displayName: 'Importar solución en TEST'
        environment: 'SIT-TEST'        # ← Aquí se aplica la aprobación configurada
        pool:
          vmImage: 'windows-latest'

        strategy:
          runOnce:
            deploy:
              steps:
                # 1. Instalar herramientas
                - task: PowerPlatformToolInstaller@2
                  displayName: '📦 Instalar Power Platform Build Tools'
                  inputs:
                    DefaultVersion: true

                # 2. Importar solución Managed en TEST
                - task: PowerPlatformImportSolution@2
                  displayName: '⬆️ Importar solución Managed en TEST'
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: 'SC-PowerPlatform-TEST'
                    SolutionInputFile: '$(Pipeline.Workspace)/$(artifact_name)/$(solution_name)_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: '120'
                    SkipProductUpdateDependencies: true
                    ConvertToManaged: true

                # 3. Verificar que la importación fue exitosa
                - task: PowerShell@2
                  displayName: '✅ Verificar importación'
                  inputs:
                    targetType: 'inline'
                    script: |
                      Write-Host "Solución $(solution_name) importada correctamente en TEST."
                      Write-Host "Build: $(Build.BuildNumber)"
                      Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') UTC"
```

2. Commit y push:
   ```bash
   git add azure-pipelines/cd-deploy.yml
   git commit -m "cd: agregar pipeline de deploy a TEST"
   git push origin develop
   ```

3. Registra el pipeline en Azure DevOps:
   - **+ Nuevo pipeline** → Azure Repos Git → mismo repo → archivo `/azure-pipelines/cd-deploy.yml`
   - Guarda como `SIT — CD Deploy TEST`

### Validación del Ejercicio 3

- [ ] El environment `SIT-TEST` existe con una aprobación configurada
- [ ] El archivo `cd-deploy.yml` está en el repositorio
- [ ] El pipeline `SIT — CD Deploy TEST` está registrado

---

## Ejercicio 4 — Verificar la ejecución end-to-end

> **Qué vas a hacer:** Ejecutar el flujo completo: push a develop → CI build → artifact → CD espera aprobación → aproba → deploy en TEST.
> **Duración:** 30 min

### Tarea 4.1 — Disparar el CI con un cambio en la solución

1. En el ambiente DEV, abre la solución `SIT_SolicitudesInternas` y haz un cambio menor (agrega una descripción a cualquier componente).

2. Publica la solución en DEV.

   > El pipeline CI se dispara por push a la rama `develop` en el repositorio — no directamente por cambios en Dataverse. El trigger real sería: un desarrollador hace push de código (un plugin, una web resource) al repositorio.

3. Para simular el trigger, crea un archivo vacío en el repositorio y haz push a `develop`:
   ```bash
   echo "trigger" > trigger.txt
   git add trigger.txt
   git commit -m "chore: trigger manual del CI"
   git push origin develop
   ```

### Tarea 4.2 — Monitorear el CI

1. En Azure DevOps → **Pipelines** → selecciona `SIT — CI Build` → verifica que hay una ejecución activa.

2. Haz clic en la ejecución → ve los pasos en tiempo real.

3. El paso más largo es el **Solution Checker** (puede tardar 5-10 minutos).

4. Al finalizar exitosamente, verifica que el **artifact** fue publicado:
   - En la ejecución del pipeline → pestaña **Artifacts** → debe aparecer `solution-drop`
   - Haz clic en el artifact → verifica que contiene `SIT_SolicitudesInternas.zip` y `SIT_SolicitudesInternas_managed.zip`

### Tarea 4.3 — Aprobar el despliegue a TEST

1. El CD pipeline debería haberse activado automáticamente después del CI (por el trigger de pipeline).

   Si no se activó, ejecútalo manualmente: **Pipelines** → `SIT — CD Deploy TEST` → **Run pipeline**.

2. El pipeline llega al stage `DeployTest` y se **pausa** esperando la aprobación del environment `SIT-TEST`.

3. Recibes un email (o notificación en Azure DevOps) con el enlace para aprobar.

4. Haz clic en **Review** → **Approve** → agrega un comentario: `Solution Checker OK — aprobado para TEST`.

5. El pipeline continúa y ejecuta la importación en TEST.

### Tarea 4.4 — Verificar la solución en TEST

1. Ve a [make.powerapps.com](https://make.powerapps.com) → selecciona el ambiente **SIT-TEST**.

2. En **Soluciones** → verifica que `SIT_SolicitudesInternas` aparece como **Managed** (candado cerrado ☑️).

3. Intenta editar un componente de la solución Managed — debe ser de solo lectura (las Managed Solutions no se pueden editar en el ambiente de destino).

### Validación del Ejercicio 4

- [ ] El CI pipeline completó con 7 pasos en verde
- [ ] El artifact `solution-drop` contiene los dos ZIPs (unmanaged y managed)
- [ ] El CD pipeline se pausó esperando aprobación del environment SIT-TEST
- [ ] Al aprobar, el pipeline completó el import en TEST
- [ ] La solución aparece como Managed en el ambiente TEST

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Error 401 en PowerPlatformExportSolution | El Service Principal no tiene permisos en el ambiente | Verifica que el App Registration fue agregado como "Usuario de aplicación" con rol System Administrator en el Admin Center |
| Solution Checker falla con errores de validación | La solución tiene plugins sin check de Depth o APIs obsoletas | Corrige los errores indicados en el reporte del Solution Checker antes de hacer push |
| El CD pipeline no se disparó después del CI | El trigger de pipeline resource no está configurado correctamente | Verifica que `source` en el YAML del CD coincide exactamente con el nombre del pipeline CI |
| Error "No se encontró el artifact" en el CD | El CI no publicó el artifact o usó un nombre diferente | Verifica que `ArtifactName` en el CI y `artifact_name` en el CD son idénticos |
| La solución se importa pero no es Managed | Falta el flag `ConvertToManaged: true` en el CD | Agrega el flag al task de importación |
| El environment no pide aprobación | La aprobación no fue configurada correctamente | Verifica en Pipelines → Environments → SIT-TEST → Approvals and checks |

---

## Checklist final

- [ ] App Registration en Entra ID con Client Secret activo
- [ ] Service Principal agregado como usuario de aplicación en SIT-DEV y SIT-TEST
- [ ] Service Connections `SC-PowerPlatform-DEV` y `SC-PowerPlatform-TEST` funcionando
- [ ] Pipeline CI `SIT — CI Build` ejecuta los 7 pasos sin errores
- [ ] Artifact contiene los dos ZIPs al final del CI
- [ ] Pipeline CD `SIT — CD Deploy TEST` se pausa para aprobación
- [ ] La aprobación del environment SIT-TEST permite continuar el deploy
- [ ] La solución aparece como Managed en el ambiente TEST

---

## Reto adicional

**Reto básico:** Agrega un paso de notificación al final del CD pipeline que envíe un mensaje a un canal de Teams cuando el despliegue fue exitoso. Usa la task `PowerShell` con un HTTP POST al webhook del canal.

**Reto intermedio:** Agrega un tercer ambiente `SIT-PROD` al CD pipeline con una segunda aprobación más estricta (dos aprobadores requeridos). El stage de PROD solo debe ejecutarse si el de TEST fue exitoso.

**Reto avanzado:** Implementa el pipeline de **extracción de solución vía unpack + commit automático**: cuando el CI exporta y desempaqueta la solución, hace commit del XML desempaquetado al repositorio. Esto permite ver diffs del código de la solución en los Pull Requests (qué Power Fx cambió, qué columnas se agregaron).

---

## Preguntas de repaso

1. ¿Por qué es importante que el deploy a TEST use la solución **Managed** y no la Unmanaged exportada de DEV?
2. ¿Qué detecta el **Solution Checker** que no puede detectar una prueba manual?
3. ¿Cuál es la diferencia entre un **trigger por push** (CI) y un **trigger de pipeline resource** (CD)?
4. ¿Por qué se recomienda usar un **Service Principal** (App Registration) en lugar de credenciales personales en el pipeline?

---

## Limpieza del laboratorio

> Los archivos YAML en el repositorio son permanentes (son código). Puedes eliminar los pipelines de Azure DevOps sin afectar el repositorio.

Para eliminar las Service Connections: Azure DevOps → Configuración del proyecto → Service connections → selecciona → Eliminar.

---

## Siguiente laboratorio recomendado

➡️ **Lab 22 — Copilot Studio: Agente Conversacional con SSO y Knowledge Sources**

**Por qué ir ahí:** Con el ALM automatizado del Lab 19, puedes desplegar el agente de Copilot Studio del Lab 22 (también dentro de la solución SIT) a TEST y PROD con el mismo pipeline — completando el ciclo DevOps.
