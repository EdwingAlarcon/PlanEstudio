# ALM y DEVOPS — Estrategias de Gestión del Ciclo de Vida
**Referencia técnica** | Pipelines, ambientes, branching y herramientas

---

## 1. Estrategia de Ambientes

### Modelo de ambientes recomendado

```
Personal Dev (individual)
    ↓ PR hacia develop
Project Dev (equipo)
    ↓ CI automático
Test / QA (verificación técnica)
    ↓ aprobación QA
UAT (validación del cliente)
    ↓ aprobación del cliente + arquitecto
Production (sistema en vivo)
```

### Tipos de ambiente y cuándo usarlos

| Tipo | Propósito | Dataverse | DLP | Quién accede |
|------|-----------|-----------|-----|-------------|
| Developer | Exploración personal | Sí (sandbox) | Minimal | Solo el maker |
| Sandbox | Desarrollo del equipo | Sí (sandbox) | Moderate | Dev team |
| Test | QA formal | Sí (sandbox) | Production-like | Dev + QA |
| UAT | Validación cliente | Sí (sandbox) | Production | Dev + Business |
| Production | Sistema en vivo | Sí (production) | Strict | Service accounts + usuarios |

### Creación de ambiente vía pac CLI
```powershell
# Crear ambiente sandbox
pac env create `
    --name "SIT-GestionProyectos-DEV" `
    --type Sandbox `
    --region unitedstates `
    --currency USD `
    --language 3082  # Español (España) - usar 1034 para Español (México)

# Listar ambientes
pac env list

# Seleccionar ambiente activo
pac auth select --index 1

# Ver detalles del ambiente
pac env who
```

---

## 2. Soluciones — Mejores Prácticas

### Estructura recomendada
```
SIT_[Proyecto]_Foundation     ← tablas, catálogos, security roles base
SIT_[Proyecto]_Core           ← apps, flujos, plugins principales
SIT_[Proyecto]_Integraciones  ← conectores, flujos de integración
SIT_[Proyecto]_Reportes       ← dashboards, Power BI (si se incluye)
```

### Convenciones de naming
```
Publisher:
  Nombre: SIT Consulting
  Prefijo: sit
  (NUNCA usar el prefijo "new_" por defecto)

Solución:
  Nombre: SIT_GestionProyectos_Core
  Versión: 1.0.0.0 (major.minor.build.revision)

Componentes:
  Tablas:           sit_solicitud, sit_proyecto, sit_tarea
  Columnas:         sit_nombre, sit_estado, sit_presupuesto
  Apps Canvas:      sit_GestionSolicitudes (PascalCase sin prefijo en el nombre visible)
  Flujos:           sit_FL_AprobacionSolicitud
  Plugins:          SolicitudPreCreatePlugin (en namespace SIT.Plugins)
```

### Versionamiento semántico
```
1.0.0.0  → Primera versión estable
1.1.0.0  → Nueva feature sin cambios breaking
1.1.1.0  → Bug fix en la feature
2.0.0.0  → Cambio breaking (eliminar tabla, cambiar relaciones fundamentales)

Script para incrementar versión con pac CLI:
pac solution version --strategy minor  # 1.0.0 → 1.1.0
pac solution version --strategy patch  # 1.0.0 → 1.0.1
```

### Importar/Exportar con pac CLI
```powershell
# Exportar solución unmanaged (para source control)
pac solution export `
    --name SIT_GestionProyectos_Core `
    --path ./solutions/SIT_GestionProyectos_Core.zip `
    --managed false `
    --async true

# Desempaquetar para git (XML legible)
pac solution unpack `
    --zipfile ./solutions/SIT_GestionProyectos_Core.zip `
    --folder ./solutions/SIT_GestionProyectos_Core `
    --processCanvasApps true `
    --allowWrite true

# Empaquetar como managed (para despliegue)
pac solution pack `
    --zipfile ./solutions/SIT_GestionProyectos_Core_managed.zip `
    --folder ./solutions/SIT_GestionProyectos_Core `
    --packagetype Managed

# Importar solución
pac solution import `
    --path ./solutions/SIT_GestionProyectos_Core_managed.zip `
    --async true `
    --activate-plugins true `
    --publish-changes true

# Verificar dependencias antes de importar
pac solution check `
    --path ./solutions/SIT_GestionProyectos_Core_managed.zip `
    --outputDirectory ./checker-results
```

---

## 3. Branching Strategy

### GitFlow para Power Platform
```
main
  ├── develop (rama de integración)
  │     ├── feature/modulo-solicitudes
  │     ├── feature/flujo-aprobacion
  │     ├── feature/pcf-statusbadge
  │     └── fix/bug-calculo-vencimiento
  │
  ├── release/1.1.0 (rama de release candidate)
  │     └── hotfix/fix-critico-en-prod
  │
  └── (merge de release a main y back a develop)
```

### Reglas del branching
- `main` → solo código aprobado y en producción. NUNCA forzar push.
- `develop` → integración continua. CI se ejecuta en cada merge.
- `feature/*` → una feature por rama. Tiempo de vida máximo: 2 semanas.
- `release/*` → se crea cuando develop está listo para UAT. Solo bug fixes.
- `hotfix/*` → se crea desde main para fixes urgentes de producción.

### .gitignore recomendado para Power Platform
```gitignore
# Archivos de configuración local
.env
*.user
*.local.json
appsettings.local.json

# Binarios compilados de PCF
SIT*/node_modules/
SIT*/out/
SIT*/*.js.map
SIT*/dist/

# Binarios de plugins
**/bin/
**/obj/
**/*.user

# Archivos temporales de exportación
*.zip
!solutions/*.zip  # Mantener zips de soluciones si se usa ese approach

# Output de Solution Checker
checker-results/
```

---

## 4. Pipeline CI — Azure DevOps

### Pipeline completo con todas las etapas
```yaml
# azure-pipelines/ci.yml
trigger:
  branches:
    include: [develop]
  paths:
    exclude: ['docs/**', '*.md']

variables:
  - group: 'PowerPlatform-Shared'  # Variable group con credenciales
  - name: solution_name
    value: 'SIT_GestionProyectos_Core'
  - name: build_version
    value: '$(Build.BuildNumber)'

pool:
  vmImage: 'windows-latest'

stages:
  # ─────────────────────────────────────────────
  - stage: Build
    displayName: '🔨 Build & Verify'
    jobs:
      - job: BuildAndCheck
        steps:
          - checkout: self
            fetchDepth: 0

          - task: PowerPlatformToolInstaller@2
            displayName: 'Install PAC CLI'
            inputs:
              DefaultVersion: true

          - task: PowerPlatformExportSolution@2
            displayName: 'Export Unmanaged from DEV'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: '$(ServiceConnectionDEV)'
              SolutionName: '$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              Managed: false
              AsyncOperation: true
              MaxAsyncWaitTime: 120

          - task: PowerPlatformUnpackSolution@2
            displayName: 'Unpack for Source Control'
            inputs:
              SolutionInputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              SolutionTargetFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionType: 'Unmanaged'
              ProcessCanvasApps: true

          - task: PowerPlatformChecker@2
            displayName: '✅ Solution Checker (fail on critical)'
            inputs:
              authenticationType: 'PowerPlatformSPN'
              PowerPlatformSPN: '$(ServiceConnectionDEV)'
              FilesToAnalyze: '$(Build.ArtifactStagingDirectory)/$(solution_name).zip'
              RuleSet: '0ad12346-e108-40b8-a956-9a373e9d6492'
              ErrorLevel: 'CriticalIssueCount'
              FailOnPowerAppsCheckerAnalysisError: true

          - task: PowerPlatformPackSolution@2
            displayName: 'Pack as Managed'
            inputs:
              SolutionSourceFolder: '$(Build.SourcesDirectory)/solutions/$(solution_name)'
              SolutionOutputFile: '$(Build.ArtifactStagingDirectory)/$(solution_name)_managed.zip'
              SolutionType: 'Managed'

          - task: PublishBuildArtifacts@1
            displayName: '📦 Publish Artifact'
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: 'solution-drop'
              publishLocation: 'Container'

  # ─────────────────────────────────────────────
  - stage: DeployTest
    displayName: '🧪 Deploy TEST'
    dependsOn: Build
    condition: succeeded()
    jobs:
      - deployment: DeployTEST
        environment: 'PP-TEST'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs: { DefaultVersion: true }

                - task: PowerPlatformImportSolution@2
                  displayName: 'Import to TEST'
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: '$(ServiceConnectionTEST)'
                    SolutionInputFile: '$(Pipeline.Workspace)/solution-drop/$(solution_name)_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 180
                    PublishWorkflows: true

                - task: PowerPlatformSetConnectionVariables@2
                  displayName: 'Configure Connection References TEST'
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: '$(ServiceConnectionTEST)'
                    ConnectionVariables: |
                      CR_SIT_Dataverse=$(TestDataverseConnectionId)
                      CR_SIT_Office365=$(TestO365ConnectionId)

  # ─────────────────────────────────────────────
  - stage: DeployUAT
    displayName: '👤 Deploy UAT (aprobación requerida)'
    dependsOn: DeployTest
    condition: succeeded()
    jobs:
      - deployment: DeployUAT
        environment: 'PP-UAT'  # Tiene required approvers configurado
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs: { DefaultVersion: true }
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: '$(ServiceConnectionUAT)'
                    SolutionInputFile: '$(Pipeline.Workspace)/solution-drop/$(solution_name)_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 180

  # ─────────────────────────────────────────────
  - stage: DeployPROD
    displayName: '🚀 Deploy PRODUCTION'
    dependsOn: DeployUAT
    condition: succeeded()
    jobs:
      - deployment: DeployPROD
        environment: 'PP-PROD'  # Requiere 2 aprobadores
        strategy:
          runOnce:
            deploy:
              steps:
                - task: PowerPlatformToolInstaller@2
                  inputs: { DefaultVersion: true }
                - task: PowerPlatformImportSolution@2
                  inputs:
                    authenticationType: 'PowerPlatformSPN'
                    PowerPlatformSPN: '$(ServiceConnectionPROD)'
                    SolutionInputFile: '$(Pipeline.Workspace)/solution-drop/$(solution_name)_managed.zip'
                    AsyncOperation: true
                    MaxAsyncWaitTime: 240
                    PublishWorkflows: true
                    OverwriteUnmanagedCustomizations: false

          postRouteHook:
            steps:
              - script: echo "Deployment to PROD completed successfully at $(date)"
```

---

## 5. Pipeline CD — GitHub Actions

```yaml
# .github/workflows/power-platform-cd.yml
name: Power Platform Deployment

on:
  workflow_dispatch:
    inputs:
      target_environment:
        description: 'Target environment'
        required: true
        type: choice
        options: [TEST, UAT, PROD]
  push:
    branches: [develop]

env:
  SOLUTION_NAME: SIT_GestionProyectos_Core

jobs:
  build:
    name: 🔨 Build
    runs-on: windows-latest
    outputs:
      artifact-name: solution-drop

    steps:
      - uses: actions/checkout@v4

      - name: Export from DEV
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: ${{ secrets.DEV_URL }}
          app-id: ${{ secrets.APP_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-name: ${{ env.SOLUTION_NAME }}
          solution-output-file: ./drop/${{ env.SOLUTION_NAME }}.zip
          managed: false

      - name: Solution Checker
        uses: microsoft/powerplatform-actions/check-solution@v1
        with:
          environment-url: ${{ secrets.DEV_URL }}
          app-id: ${{ secrets.APP_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          path: ./drop/${{ env.SOLUTION_NAME }}.zip

      - name: Pack Managed
        uses: microsoft/powerplatform-actions/pack-solution@v1
        with:
          solution-folder: ./solutions/${{ env.SOLUTION_NAME }}
          solution-file: ./drop/${{ env.SOLUTION_NAME }}_managed.zip
          solution-type: Managed

      - uses: actions/upload-artifact@v4
        with:
          name: solution-drop
          path: ./drop/${{ env.SOLUTION_NAME }}_managed.zip
          retention-days: 30

  deploy-test:
    name: 🧪 Deploy TEST
    needs: build
    runs-on: windows-latest
    environment: TEST
    if: github.ref == 'refs/heads/develop'

    steps:
      - uses: actions/download-artifact@v4
        with:
          name: solution-drop
          path: ./artifacts

      - name: Deploy to TEST
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.TEST_URL }}
          app-id: ${{ secrets.APP_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-file: ./artifacts/${{ env.SOLUTION_NAME }}_managed.zip
          run-asynchronously: true
          max-async-wait-time: 180

  deploy-prod:
    name: 🚀 Deploy PROD
    needs: deploy-test
    runs-on: windows-latest
    environment: PROD  # Configura required reviewers en GitHub Settings

    steps:
      - uses: actions/download-artifact@v4
        with:
          name: solution-drop
          path: ./artifacts

      - name: Deploy to PROD
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ secrets.PROD_URL }}
          app-id: ${{ secrets.APP_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          tenant-id: ${{ secrets.TENANT_ID }}
          solution-file: ./artifacts/${{ env.SOLUTION_NAME }}_managed.zip
          run-asynchronously: true
          max-async-wait-time: 300
```

---

## 6. Scripts pac CLI de referencia

### Autenticación
```powershell
# Crear perfil con Service Principal (recomendado para CI/CD)
pac auth create `
    --url https://tuorg.crm.dynamics.com `
    --kind SPN `
    --tenant $env:TENANT_ID `
    --applicationId $env:CLIENT_ID `
    --clientSecret $env:CLIENT_SECRET

# Crear perfil con usuario interactivo (para desarrollo)
pac auth create --url https://tuorg.crm.dynamics.com

# Listar perfiles
pac auth list

# Seleccionar perfil
pac auth select --index 1

# Eliminar perfil
pac auth clear --index 1
```

### Soluciones
```powershell
# Ver soluciones en el ambiente
pac solution list

# Crear solución nueva
pac solution init `
    --publisher-name "SITConsulting" `
    --publisher-prefix "sit"

# Clonar solución (para patch)
pac solution clone --name SIT_GestionProyectos_Core

# Verificar solución localmente
pac solution check --path ./solutions/SIT_GestionProyectos.zip

# Publicar todas las customizaciones
pac solution publish
```

### Ambientes
```powershell
# Listar ambientes a los que tienes acceso
pac env list

# Copiar ambiente (para crear TEST desde PROD)
pac env copy `
    --source-env https://prod.crm.dynamics.com `
    --display-name "SIT-TEST-$(Get-Date -Format 'yyyyMMdd')" `
    --target-env https://test.crm.dynamics.com

# Resetear ambiente sandbox a estado limpio
pac env reset --environment https://test.crm.dynamics.com

# Backup manual
pac env backup `
    --environment https://prod.crm.dynamics.com `
    --label "Pre-deployment backup $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
```

### PCF
```powershell
# Inicializar proyecto PCF
pac pcf init `
    --namespace SITControls `
    --name StatusBadge `
    --template field `
    --framework react

# Hacer push al ambiente (modo desarrollo)
pac pcf push --publisher-prefix sit

# Incrementar versión del PCF
pac pcf version --patchversion

# Construir para producción
npm run build -- --buildMode production
```

---

## 7. Connection References — Setup en nuevo ambiente

Cuando se importa una solución en un nuevo ambiente, las Connection References deben configurarse.

### PowerShell para automatizar la configuración
```powershell
# Script: configure-connection-references.ps1
param(
    [string]$EnvironmentUrl,
    [string]$DataverseConnectionId,
    [string]$Office365ConnectionId
)

pac auth create --url $EnvironmentUrl --kind SPN `
    --tenant $env:TENANT_ID `
    --applicationId $env:CLIENT_ID `
    --clientSecret $env:CLIENT_SECRET

# Actualizar Connection Reference via API
$headers = @{
    "Authorization" = "Bearer $(pac auth token)"
    "Content-Type" = "application/json"
}

$body = @{
    "connectionid" = $DataverseConnectionId
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "$EnvironmentUrl/api/data/v9.2/connectionreferences(CR_SIT_Dataverse_Principal)" `
    -Method PATCH `
    -Headers $headers `
    -Body $body

Write-Host "Connection References configuradas exitosamente"
```

---

## 8. Environment Variables — Gestión por ambiente

### Estructura recomendada de variables
```
Grupo: Configuración General
  sit_EmailAdmin           → admin@empresa.com
  sit_UrlPortal            → https://portal.empresa.com
  sit_ModoDebug            → false (true en DEV)

Grupo: Integración
  sit_UrlERP               → https://erp.empresa.com/api/v1
  sit_UrlBuroCreditoPP     → https://buro.com/sandbox (DEV) / https://buro.com/api (PROD)
  sit_TimeoutIntegracion   → 30

Grupo: Negocio
  sit_PresupuestoMaxAuto   → 5000 (aprobación automática hasta este monto)
  sit_DiasVencimientoNormal → 5
  sit_DiasVencimientoUrgente → 0.17 (4 horas en fracción de día)
```

### Usar Environment Variables en flujos
```
Acción: Get environment variable value
Variable: sit_EmailAdmin
Usar la salida en el campo "To" del correo de notificación
```

### Usar Environment Variables en plugins C#
```csharp
// Obtener valor de una Environment Variable desde un plugin
private string ObtenerVariableEntorno(IOrganizationService service, string nombre)
{
    var query = new QueryExpression("environmentvariabledefinition")
    {
        ColumnSet = new ColumnSet("schemaname"),
        TopCount = 1
    };
    query.Criteria.AddCondition("schemaname", ConditionOperator.Equal, nombre);
    
    var linkValue = query.AddLink(
        "environmentvariablevalue",
        "environmentvariabledefinitionid",
        "environmentvariabledefinitionid"
    );
    linkValue.Columns = new ColumnSet("value");
    linkValue.EntityAlias = "val";
    
    var resultados = service.RetrieveMultiple(query);
    if (resultados.Entities.Count > 0)
    {
        return resultados.Entities[0]
            .GetAttributeValue<AliasedValue>("val.value")?.Value as string;
    }
    return null;
}
```

---

## 9. Checklist de Deploy a Producción

Antes de cada despliegue a PROD, verificar:

### Checklist técnico
- [ ] Solution Checker: 0 errores críticos, 0 errores altos
- [ ] Todos los unit tests de plugins pasan en el CI
- [ ] La solución se importó exitosamente en UAT sin errores
- [ ] Connection References configuradas en el ambiente destino
- [ ] Environment Variables con valores correctos para PROD
- [ ] Flujos activos en UAT verificados (no solo importados)
- [ ] PCF controls con versión actualizada (para evitar caché)

### Checklist de negocio
- [ ] UAT sign-off firmado por el responsable del negocio
- [ ] Plan de rollback documentado y probado
- [ ] Ventana de mantenimiento comunicada a usuarios
- [ ] Soporte on-call disponible durante las primeras 2 horas post-deploy

### Checklist post-deploy
- [ ] Verificar que los flujos están activos en PROD
- [ ] Ejecutar smoke test (prueba rápida del flujo principal)
- [ ] Verificar que los reportes de Power BI conectan correctamente
- [ ] Confirmar que las alertas de monitoreo están activas
- [ ] Actualizar el registro de cambios con la versión desplegada

---

## 10. Monitoreo de Flujos en Producción

### Power Automate — Alertas de fallo
1. Admin Center → Flujos → seleccionar flujo → Detalles
2. Configurar "Notificaciones de fallo" → email o Teams
3. Retención de historial de ejecución: 28 días (estándar), 90 días (Premium)

### Azure Monitor para flujos críticos
```powershell
# Consultar ejecuciones fallidas en el último día via Power Automate Management API
$token = # obtener token
$response = Invoke-RestMethod `
    -Uri "https://management.azure.com/providers/Microsoft.ProcessSimple/environments/$envId/flows/$flowId/runs?api-version=2016-11-01&`$filter=status eq 'Failed'" `
    -Headers @{ Authorization = "Bearer $token" }

$response.value | ForEach-Object {
    Write-Host "Fallo: $($_.properties.startTime) - Error: $($_.properties.code)"
}
```

### Dashboard de salud en Power BI
Métricas clave a monitorear:
- Flujos fallidos en las últimas 24h / 7 días
- Tiempo promedio de ejecución por flujo
- Flujos con tasa de error > 1%
- Solicitudes de API de Dataverse vs límites de throttling
- Storage usado vs límite del ambiente
