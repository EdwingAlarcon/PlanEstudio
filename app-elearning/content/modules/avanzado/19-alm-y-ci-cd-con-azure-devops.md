---
moduleId: 19
title: "ALM y CI/CD con Azure DevOps"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 8
slug: "alm-y-ci-cd-con-azure-devops"
---
### 🎯 Objetivo
Implementar pipelines completos de CI/CD para Power Platform usando Azure DevOps y GitHub Actions, automatizando export/import de soluciones, comprobación de calidad con Solution Checker, y despliegue multi-ambiente con aprobaciones.

### 📖 Conceptos Clave
- **pac CLI (Power Platform CLI):** herramienta de línea de comandos multiplataforma para automatizar todas las operaciones de Power Platform: autenticar con entornos, exportar/importar/empaquetar soluciones, gestionar datos con `pac data export/import`, crear PCF con `pac pcf init`, y construir modelos con `pac modelbuilder`. Ejemplo: `pac solution export --name SIT_CRM --path ./output/SIT_CRM.zip` exporta la solución unmanaged del entorno autenticado actualmente (omitir `--managed` equivale a unmanaged; usar `--managed` sin valor exporta como managed).

- **Power Platform Build Tools:** extensión de Azure DevOps que provee tasks especializadas para CI/CD de Power Platform: `PowerPlatformExportSolution`, `PowerPlatformImportSolution`, `PowerPlatformPackSolution`, `PowerPlatformUnpackSolution`, `PowerPlatformChecker`, `PowerPlatformSetConnectionVariables`. Cada task se conecta al entorno mediante una Service Connection y abstrae las llamadas al pac CLI.

- **microsoft/powerplatform-actions:** equivalente de los Power Platform Build Tools pero para GitHub Actions. Las acciones del repositorio `microsoft/powerplatform-actions` como `export-solution@v1`, `import-solution@v1`, `check-solution@v1` permiten construir pipelines CI/CD completos en GitHub sin instalar el pac CLI manualmente.

- **Solution Checker (Solution Analysis):** herramienta de análisis estático que examina la solución exportada contra un conjunto de reglas de calidad, seguridad y compatibilidad. Detecta patrones problemáticos como plugins sin check de Depth, uso de APIs obsoletas, referencias hardcodeadas a GUIDs, y falta de manejo de errores. En pipelines se configura con `FailOnPowerAppsCheckerAnalysisError: true` para que errores críticos bloqueen el despliegue.

- **Managed Identity:** método de autenticación de Azure que permite que un servicio (Azure DevOps agent, Azure Function) se autentique en otros servicios de Azure sin almacenar secretos. En pipelines de Power Platform, se usa en lugar de service principals con client secrets para eliminar la rotación manual de credenciales. Configurado en Azure DevOps como `authenticationType: ManagedServiceIdentity` en las tasks.

- **Service Connection:** configuración en Azure DevOps que almacena las credenciales para conectarse a un entorno de Power Platform (URL, Client ID, Client Secret, Tenant ID). Se crea una Service Connection por cada entorno del ALM (DEV, TEST, UAT, PROD). Las tasks del pipeline referencian la Service Connection por nombre en lugar de exponer credenciales en el YAML.

- **Artifact:** el archivo `.zip` de la solución empaquetada como Managed, generado por el stage de Build del pipeline CI. Se publica con `PublishBuildArtifacts` y es consumido por los stages de deploy CD — garantizando que todos los ambientes reciben exactamente el mismo binario de solución, no una exportación nueva de cada entorno.

- **Branching strategy:** estrategia de ramas para trabajo en equipo. GitFlow: rama `main` (producción), `develop` (integración), `feature/nombre` (trabajo individual) y `release/version` (preparación de release). Trunk-Based: todos los desarrolladores hacen commits a `main` (o `develop`) frecuentemente con feature flags. Para Power Platform se recomienda GitFlow simplificado: `main` → `develop` → `feature/*`.

- **Environment Approvals:** configuración en Azure DevOps Environments que requiere una o más aprobaciones humanas antes de que el pipeline de deployment pueda continuar. Se configura en el Environment de UAT (aprobación del cliente) y PROD (aprobación del líder técnico y QA). El pipeline queda en pausa hasta recibir la aprobación o que expire el timeout configurado.

- **YAML Pipeline:** definición del pipeline de CI/CD como código YAML versionado en el repositorio de git. Permite que el pipeline mismo esté bajo control de versiones, sea revisado en PRs, y sea idéntico entre ramas. Estructura: `trigger`, `variables`, `stages` → `jobs` → `steps` → `tasks`.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 19.1: Configurar Service Connection en Azure DevOps
1. Azure DevOps → Configuración del proyecto → Service connections → Nueva
2. Tipo: Power Platform
3. Configurar para cada ambiente:
    - URL: `https://tuorg-dev.crm.dynamics.com`
    - Método: Service Principal (App Registration)
    - Tenant ID, Client ID, Client Secret del App Registration

4. Crear 4 service connections: DEV, TEST, UAT, PROD

#### Actividad 19.2: Pipeline de CI — Export y Verificación
```yaml
# azure-pipelines/ci-build.yml
trigger:
  branches:
    include:
      - develop
      - feature/*

variables:
  solution_name: 'SIT_GestionProyectos'
  build_version: '$(Build.BuildNumber)'

stages:
  - stage: Build
    displayName: 'Build & Verify Solution'
    jobs:
      - job: ExportAndCheck
        displayName: 'Export Solution and Run Checks'
        pool:
          vmImage: 'windows-latest'
        
        steps:
          - task: PowerPlatformToolInstaller@2
            displayName: 'Install Power Platform Build Tools'
            inputs:
              DefaultVersion: true

          - task: PowerPlatformExportSolution@2
            displayName: 'Export Unmanaged Solution from DEV'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              SolutionName: '$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              Managed: false

          - task: PowerPlatformUnpackSolution@2
            displayName: 'Unpack Solution for Source Control'
            inputs:
              SolutionInputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              SolutionTargetFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionType: 'Unmanaged'

          - task: PowerPlatformChecker@2
            displayName: 'Run Solution Checker'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: 'SC-PowerPlatform-DEV'
              FilesToAnalyze: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              RuleSet: '0ad12346-e108-40b8-a956-9a373e9d6492'  # Solution Checker ruleset
              ErrorLevel: 'HighIssueCount'
              FailOnPowerAppsCheckerAnalysisError: true

          - task: PowerPlatformPackSolution@2
            displayName: 'Pack as Managed Solution'
            inputs:
              SolutionSourceFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name)_managed.zip'
              SolutionType: 'Managed'

          - task: PublishBuildArtifacts@1
            displayName: 'Publish Artifacts'
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: 'solution-drop'
```

#### Actividad 19.3: Pipeline de CD — Deploy a TEST y UAT
```yaml
# azure-pipelines/cd-deploy.yml
trigger: none  # Solo se activa desde el CI pipeline

resources:
  pipelines:
    - pipeline: ci_build
      source: 'CI-PowerPlatform-Build'
      trigger:
        branches:
          include:
            - develop

stages:
  - stage: DeployTest
    displayName: 'Deploy to TEST'
    jobs:
      - deployment: DeployTEST
        displayName: 'Import Solution to TEST'
        environment: 'PowerPlatform-TEST'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs:
                    DefaultVersion: true

                - task: PowerPlatformImportSolution@2
                  displayName: 'Import Managed Solution to TEST'
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: 'SC-PowerPlatform-TEST'
                    SolutionInputFile: '$(Pipeline.Workspace)/solution-drop/SIT_GestionProyectos_managed.zip'
                    PublishWorkflows: true
                    OverwriteUnmanagedCustomizations: false
                    SkipProductUpdateDependencies: false
                    AsyncOperation: true
                    MaxAsyncWaitTime: 120

                - task: PowerPlatformSetConnectionVariables@2
                  displayName: 'Configure Connection References TEST'
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: 'SC-PowerPlatform-TEST'
                    Environment: '$(TEST_ENVIRONMENT_URL)'
                    ConnectionVariables: |
                      CR_SIT_Dataverse_Principal=$(TEST_DATAVERSE_CONNECTION_ID)
                      CR_SIT_Office365=$(TEST_O365_CONNECTION_ID)

  - stage: DeployUAT
    displayName: 'Deploy to UAT'
    dependsOn: DeployTest
    condition: succeeded()
    jobs:
      - deployment: DeployUAT
        environment: 'PowerPlatform-UAT'  # Tiene aprobación manual configurada
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs:
                    DefaultVersion: true
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: 'SC-PowerPlatform-UAT'
                    SolutionInputFile: '$(Pipeline.Workspace)/solution-drop/SIT_GestionProyectos_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 120

  - stage: DeployProd
    displayName: 'Deploy to PRODUCTION'
    dependsOn: DeployUAT
    condition: succeeded()
    jobs:
      - deployment: DeployPROD
        environment: 'PowerPlatform-PROD'  # Requiere aprobación de 2 personas
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs:
                    DefaultVersion: true
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: 'SC-PowerPlatform-PROD'
                    SolutionInputFile: '$(Pipeline.Workspace)/solution-drop/SIT_GestionProyectos_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 180
```

#### Actividad 19.4: GitHub Actions equivalente
```yaml
# .github/workflows/power-platform-ci-cd.yml
name: Power Platform CI/CD

on:
  push:
    branches: [develop]
  pull_request:
    branches: [main]

env:
  SOLUTION_NAME: SIT_GestionProyectos
  DEV_URL: ${{ secrets.DEV_ENVIRONMENT_URL }}

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Export Solution from DEV
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: ${{ env.DEV_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-name: ${{ env.SOLUTION_NAME }}
          solution-output-file: ./solutions/${{ env.SOLUTION_NAME }}.zip
          managed: false

      - name: Check Solution Quality
        uses: microsoft/powerplatform-actions/check-solution@v1
        with:
          environment-url: ${{ env.DEV_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          path: ./solutions/${{ env.SOLUTION_NAME }}.zip

      - name: Pack as Managed
        uses: microsoft/powerplatform-actions/pack-solution@v1
        with:
          solution-folder: ./solutions/${{ env.SOLUTION_NAME }}
          solution-file: ./solutions/${{ env.SOLUTION_NAME }}_managed.zip
          solution-type: Managed

      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: solution-drop
          path: ./solutions/${{ env.SOLUTION_NAME }}_managed.zip

  deploy-test:
    needs: build
    runs-on: windows-latest
    environment: TEST
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: solution-drop

      - name: Deploy to TEST
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.TEST_ENVIRONMENT_URL }}
          app-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-file: ./${{ env.SOLUTION_NAME }}_managed.zip
          run-asynchronously: true
```

#### Actividad 19.5: pac CLI en scripts de automatización
```powershell
# scripts/export-and-commit.ps1
# Script para exportar solución y commitear al repositorio

param(
    [string]$SolutionName = "SIT_GestionProyectos",
    [string]$DevEnvironmentUrl = $env:DEV_ENVIRONMENT_URL,
    [string]$OutputPath = "./solutions"
)

# Autenticar
pac auth create --url $DevEnvironmentUrl --kind SPN `
    --tenant $env:TENANT_ID `
    --applicationId $env:CLIENT_ID `
    --clientSecret $env:CLIENT_SECRET

# Exportar solución unmanaged
pac solution export `
    --name $SolutionName `
    --path "$OutputPath/$SolutionName.zip" `
    --async

# Desempaquetar para source control (XML legible por git)
pac solution unpack `
    --zipfile "$OutputPath/$SolutionName.zip" `
    --folder "$OutputPath/$SolutionName" `
    --processCanvasApps `
    --allowWrite

# Committing changes
git add "$OutputPath/$SolutionName"
git commit -m "chore: export solution $SolutionName $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
```

### 💼 Caso Real de Negocio
**Empresa:** Partner de Microsoft con 8 proyectos Power Platform simultáneos  
**Problema:** Los despliegues a producción eran manuales, tardaban 3 horas, y 1 de cada 4 tenía errores. No había audit trail de qué se desplegó cuándo.  
**Solución:** Pipeline completo CI/CD en Azure DevOps. Build automático en cada PR. Solution Checker falla el build si hay errores críticos. Deploy a TEST automático, UAT requiere aprobación del cliente, PROD requiere 2 aprobadores.  
**Resultado:** Tiempo de despliegue: de 3 horas a 25 minutos. Errores en PROD: 0 en 6 meses. Auditoría completa en Azure DevOps de cada cambio.

### ✅ Buenas Prácticas
- El pipeline debe fallar rápido — Solution Checker en el primer stage
- Usar Managed Identity en producción, nunca secretos de usuario
- Versionar la solución con el número de build del pipeline: `1.$(Build.BuildId).0`
- Separar pipelines de CI y CD — el CD consume artifacts del CI
- Configurar "Required approvers" en el Environment de UAT y PROD en Azure DevOps

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Pipeline falla con "Solution not found" | Nombre de solución con espacio o mayúsculas incorrectas | Verificar nombre exacto en la UI vs el YAML |
| Import tarda más de 2 minutos y timeout | Solución grande sin async mode | Agregar `AsyncOperation: true` y aumentar `MaxAsyncWaitTime` |
| Solution Checker da falsos positivos | Reglas muy estrictas para componentes de terceros | Excluir componentes de managed solutions del análisis |

### 🧪 Criterios de Validación
- [ ] Service connections configuradas para DEV y TEST en Azure DevOps
- [ ] Pipeline CI exporta, verifica con Solution Checker, y publica artifact
- [ ] Pipeline CD importa en TEST automáticamente al merge en develop
- [ ] Environment UAT requiere aprobación manual antes de desplegar
- [ ] Script pac CLI exporta y desempaqueta la solución en formato legible por git

---
