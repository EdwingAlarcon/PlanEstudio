# NIVEL 3: AVANZADO — Power Platform & Dynamics 365
**Duración estimada:** 8–10 meses (part-time) | **Prerequisito:** NIVEL_2_INTERMEDIO.md completado  
**Certificaciones objetivo:** PL-400 (Power Platform Developer)

---

## Resumen del Nivel

En este nivel pasas de desarrollador funcional a **desarrollador técnico especializado**. Dominarás C# Plugins, PCF avanzado, Code Apps con React/TypeScript, integraciones con Azure, Dynamics 365 CE, Power Pages, ALM con CI/CD automatizado, y patrones de arquitectura de soluciones. Al completar este nivel podrás diseñar e implementar soluciones de alta complejidad y prepararte para la certificación PL-400.

**Módulos de este nivel:** 13 módulos (Módulos 18–30)

| Módulo | Tema | Semanas |
|--------|------|---------|
| 18 | Arquitectura de Soluciones Power Platform | 3–4 |
| 19 | ALM y CI/CD con Azure DevOps | 4–5 |
| 20 | Dynamics 365 CE — Sales y Customer Service | 4–5 |
| 21 | Power Pages — Portales Externos | 3–4 |
| 22 | Copilot Studio Avanzado | 3–4 |
| 23 | C# Plugins para Dataverse | 5–6 |
| 24 | Integraciones con Azure Services | 4–5 |
| 25 | Patrones de Diseño Avanzados | 3–4 |
| 26 | Performance y Optimización | 3–4 |
| 27 | PCF Avanzado con TypeScript y React | 4–5 |
| **28** | **Code Apps con React y TypeScript** | **4–5** |
| 29 | Power Pages Avanzado y Azure AD B2C | 3–4 |
| 30 | Proyecto Multicapa Nivel 3 | 6–8 |

---

## MÓDULO 18: Arquitectura de Soluciones Power Platform

### 🎯 Objetivo
Diseñar arquitecturas de soluciones escalables, definir estrategias de datos multi-capa, seleccionar el tipo correcto de aplicación según el escenario, y documentar decisiones arquitectónicas con ADRs (Architecture Decision Records).

### 📖 Conceptos Clave
- **Canvas vs Model-Driven vs Pages:** criterios de selección según el escenario. Canvas App para UX muy personalizada, móvil-first o procesos ad-hoc. Model-Driven App cuando el dato es el centro y se necesitan formularios complejos, BPF, vistas, dashboards y lógica de servidor (plugins). Power Pages cuando los usuarios son externos al tenant (clientes, proveedores, ciudadanos) y necesitan un portal web con autenticación propia.
- **Dataverse vs SharePoint vs Azure SQL:** Dataverse es la opción default dentro de Power Platform — ofrece relaciones, seguridad por fila, plugins, BPF y auditoría sin código adicional; ideal cuando la lógica vive en la plataforma. SharePoint Lists sirve para almacenamiento simple y colaboración de documentos, pero no soporta relaciones complejas ni lógica de servidor. Azure SQL es la opción cuando se requiere flexibilidad máxima, consultas SQL complejas o integración con sistemas legados — pero exige licencias de conector premium y no tiene seguridad nativa de Power Platform.
- **Arquitectura de capas:** modelo de separación de responsabilidades con cuatro capas: Presentación (Canvas Apps, Model-Driven Apps, Power Pages), Lógica de negocio (Plugins C#, Power Automate, Business Rules), Datos (Dataverse, Azure SQL, SharePoint), e Integración (Azure Service Bus, Azure Functions, conectores premium). Cada capa solo depende de la capa inmediatamente inferior — nunca circular.
- **Patrón Strangler Fig:** estrategia de migración incremental de sistemas legacy a Power Platform donde la nueva plataforma reemplaza funcionalidades una por una mientras el sistema antiguo sigue activo. Ejemplo: migrar primero el módulo de clientes de un ERP a Dataverse mientras el resto del ERP sigue operando, y en cada sprint se migra un módulo adicional hasta que el sistema antiguo puede apagarse.
- **Event-driven architecture:** arquitectura donde los componentes reaccionan a eventos en lugar de ser orquestados secuencialmente. En Power Platform, los eventos de Dataverse (Create/Update/Delete en una tabla) actúan como disparadores para plugins, Power Automate, o Service Endpoints que notifican a sistemas externos — permitiendo desacoplar el CRM del ERP sin llamadas directas entre sistemas.
- **Multi-solution architecture:** estrategia de organizar los componentes de una implementación en múltiples soluciones separadas por dominio o capa (Foundation, CRM, Proyectos, Integraciones, Reportes). Evita mega-soluciones con 200+ componentes que son imposibles de mantener; permite que equipos distintos trabajen en paralelo con conflictos mínimos y que las dependencias entre dominios sean explícitas y unidireccionales.
- **ADR (Architecture Decision Record):** documento estructurado que captura el contexto de una decisión arquitectónica, las opciones consideradas, la decisión tomada y sus consecuencias (positivas y negativas). Formato típico: Estado, Contexto, Opciones consideradas, Decisión, Consecuencias. Ejemplo: `ADR-001: Selección de Dataverse sobre SharePoint para el módulo de proyectos` — documenta por qué se descartó SharePoint y qué beneficios y compromisos implica Dataverse.
- **Well-Architected Framework para Power Platform:** marco de cinco pilares para evaluar y mejorar soluciones. Fiabilidad (resiliencia ante fallos, reintentos, circuit breakers). Seguridad (DLP, Conditional Access, principio de mínimo privilegio). Eficiencia de rendimiento (delegación, paginación, FetchXML optimizado). Optimización de costos (licencias correctas, sin sobreaprovisionamiento). Excelencia operacional (CI/CD, monitoreo, ALM).
- **Capacity planning:** proceso de dimensionar la solución antes de comprometerse con la arquitectura: calcular licencias necesarias por tipo de usuario, estimar el consumo de API calls de Dataverse (límite diario por licencia), proyectar el almacenamiento de Dataverse (1GB incluido + 0.5GB por seat), y verificar que los conectores usados estén en el plan de licencias del cliente.
- **Integration patterns:** patrones para conectar sistemas. Push vs Pull: el sistema origen envía datos activamente (Push) vs el destino los solicita periódicamente (Pull). Sync vs Async: la llamada espera la respuesta (Sync, bloquea) vs el sistema envía y continúa sin esperar (Async, Service Bus). Point-to-Point vs Hub-and-Spoke: conexiones directas entre cada par de sistemas (difícil de mantener con N sistemas) vs todos los sistemas hablan con un middleware central (APIM, Service Bus) que enruta los mensajes.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 18.1: Árbol de decisión — Tipo de aplicación
Construir un decision tree para el equipo de proyecto:
```
¿El usuario es externo (cliente/proveedor)?
  → SÍ: Power Pages
  → NO: ¿Requiere formularios complejos con lógica de negocio intensa?
    → SÍ: Model-Driven App
    → NO: ¿Requiere UX muy personalizada o mobile-first?
      → SÍ: Canvas App
      → NO: ¿Es principalmente reportes/dashboards?
        → SÍ: Power BI Embedded o Power BI App
        → NO: Model-Driven App (default)
```

#### Actividad 18.2: Arquitectura multi-solución
Diseñar la estructura de soluciones para un proyecto enterprise:
```
SIT_Foundation (base layer)
  ├── Tabla: Configuración Global
  ├── Tabla: Catálogos (País, Región, Moneda)
  ├── Security Roles base
  └── Environment Variables comunes

SIT_CRM (dominio CRM)
  ├── Dependencia: SIT_Foundation
  ├── Tablas: Cuenta, Contacto, Oportunidad, Propuesta
  ├── Canvas App: Gestión Comercial
  ├── Model-Driven App: CRM Managers
  └── Flujos de aprobación

SIT_Proyectos (dominio proyectos)
  ├── Dependencia: SIT_Foundation
  ├── Tablas: Proyecto, Tarea, Recurso
  └── Canvas App: Gestión de Proyectos

SIT_Reportes (capa de reportes)
  ├── Dependencia: SIT_CRM, SIT_Proyectos
  └── Power BI datasets y reportes

SIT_Integraciones (capa de integración)
  ├── Conectores personalizados
  ├── Flujos de integración con sistemas externos
  └── Azure Functions proxies
```

#### Actividad 18.3: ADR — Registro de decisión arquitectónica
Crear `ADR-001-almacen-de-datos.md`:
```markdown
# ADR-001: Selección de almacén de datos para módulo de proyectos

## Estado: Aceptado

## Contexto
El módulo de gestión de proyectos requiere almacenar datos relacionales 
con lógica de negocio compleja (plugins, reglas, BPF) y necesita integrarse 
con Power Automate, Power BI y Canvas Apps existentes.

## Opciones consideradas
1. **Dataverse** — nativo de Power Platform
2. **SharePoint Lists** — familiar para el equipo
3. **Azure SQL** — flexibilidad máxima, requiere conector premium

## Decisión
**Dataverse**

## Consecuencias
- ✅ Integración nativa con todos los componentes Power Platform
- ✅ Security Roles, Auditoría, BPF disponibles sin código adicional
- ✅ Soporte para plugins C# y lógica de servidor
- ⚠️ Costo de licencias adicional (Dataverse for Teams no suficiente)
- ⚠️ Límite de 4GB storage en plan básico — planificar archivado

## Alternativa rechazada: SharePoint
SharePoint Lists no soporta relaciones complejas ni plugins.
Rechazado por limitaciones técnicas.
```

#### Actividad 18.4: Diagrama de arquitectura
Documentar la arquitectura con un diagrama textual (para Visio o draw.io):
```
[Usuarios Internos]                [Usuarios Externos]
       |                                  |
[Canvas App / Model-Driven]         [Power Pages]
       |                                  |
       +----------[Dataverse]------------+
                      |
            [Power Automate / Plugins]
                      |
          +-----------+-----------+
          |           |           |
    [Office 365]  [Azure SB]  [ERP Externo]
                      |
              [Azure Functions]
                      |
           [Sistemas de terceros]
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa de seguros con 500K pólizas  
**Problema:** Tenían 12 aplicaciones separadas, datos duplicados, y nadie sabía qué sistema era el "sistema de verdad" para el dato de póliza.  
**Solución:** Arquitectura con Dataverse como Master Data hub. Foundation layer con catálogos compartidos. Cada dominio (Pólizas, Siniestros, Agentes) en su propia solución con dependencia hacia Foundation. Power Pages para el portal de agentes. ADRs documentados para cada decisión mayor.  
**Resultado:** Reducción de 12 sistemas a 1 plataforma. Tiempo de onboarding de desarrolladores: de 3 semanas a 3 días.

### ✅ Buenas Prácticas
- Nunca crear mega-soluciones con todo — separar por dominio funcional
- Foundation layer nunca depende de capas superiores (dependencia unidireccional)
- Documentar todas las decisiones con ADR — especialmente las que parecen obvias
- Revisar capacity y licencias antes de comprometer la arquitectura con el cliente
- Definir strategy de branching antes de empezar a desarrollar

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Solución de 200+ componentes | No hubo diseño de multi-solution | Refactorizar a capas — doloroso pero necesario antes de escalar |
| Dependencias circulares entre soluciones | Diseño improvisado | Mapear dependencias en día 1 del proyecto |
| Decisiones sin documentar | "Lo recordamos" | ADR obligatorio para cada decisión que afecte más de 1 componente |

### 🧪 Criterios de Validación
- [ ] Árbol de decisión aplicado a un escenario real — tipo de app justificado
- [ ] Estructura multi-solución diseñada con capas claras y dependencias unidireccionales
- [ ] 2 ADRs documentados para decisiones del proyecto actual
- [ ] Diagrama de arquitectura de alto nivel creado

---

## MÓDULO 19: ALM y CI/CD con Azure DevOps

### 🎯 Objetivo
Implementar pipelines completos de CI/CD para Power Platform usando Azure DevOps y GitHub Actions, automatizando export/import de soluciones, comprobación de calidad con Solution Checker, y despliegue multi-ambiente con aprobaciones.

### 📖 Conceptos Clave
- **pac CLI (Power Platform CLI):** herramienta de línea de comandos multiplataforma para automatizar todas las operaciones de Power Platform: autenticar con entornos, exportar/importar/empaquetar soluciones, gestionar datos con `pac data export/import`, crear PCF con `pac pcf init`, y construir modelos con `pac modelbuilder`. Ejemplo: `pac solution export --name SIT_CRM --path ./output/SIT_CRM.zip --managed false` exporta la solución unmanaged del entorno autenticado actualmente.
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
    --managed false `
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

## MÓDULO 20: Dynamics 365 CE — Sales y Customer Service

### 🎯 Objetivo
Configurar y personalizar Dynamics 365 Sales y Customer Service: sales process con BPF personalizado, email-to-case automation, SLA con KPIs, entitlement management, y enrutamiento inteligente de casos con Unified Routing.

### 📖 Conceptos Clave
- **Sales Accelerator:** herramienta dentro de D365 Sales que crea y ejecuta secuencias de actividades predefinidas para los vendedores — llamadas, emails, tareas — con intervalos y condiciones configurables. Ejemplo: una secuencia "Seguimiento Propuesta" que 1 día después del envío de propuesta crea una tarea de llamada, y si no hay respuesta en 3 días envía un email automático de seguimiento. Se configura en Sales Hub → Sales Accelerator → Sequences.
- **Predictive Lead/Opportunity Scoring:** funcionalidad de IA de D365 Sales que analiza el historial de oportunidades ganadas/perdidas para entrenar un modelo ML y asignar un score del 1 al 99 a cada Lead y Oportunidad activa. Los vendedores ven qué oportunidades tienen mayor probabilidad de cerrar y pueden priorizar su trabajo. Requiere licencia D365 Sales Premium y mínimo 40 oportunidades históricas para entrenar el modelo.
- **Pipeline Intelligence:** análisis de tendencias del pipeline de ventas con IA integrada en D365 Sales. Detecta oportunidades en riesgo (sin actividad reciente), predice el cierre de oportunidades con fechas ajustadas automáticamente, y muestra tendencias del pipeline (crecimiento, pérdidas por etapa) en el módulo de pronóstico. Se activa en Configuración → Sales Insights.
- **Case Management:** módulo central de D365 Customer Service para gestionar incidencias de clientes desde apertura hasta resolución. Cada caso tiene un número único, cliente, descripción, prioridad, estado, SLA asociado, actividades (emails, llamadas, tareas), y puede estar relacionado con un producto, contrato, o entitlement. El ciclo de vida del caso sigue un BPF configurable.
- **SLA (Service Level Agreement):** configuración en D365 Customer Service que define los tiempos máximos de respuesta y resolución para los casos. Los KPIs del SLA incluyen Primera Respuesta (tiempo hasta el primer email/llamada) y Resolución (tiempo hasta el cierre). Cuando se acerca la advertencia o se alcanza el fallo, el SLA dispara acciones automáticas: enviar email, actualizar prioridad, crear tarea de escalamiento. Los tiempos se calculan en horario de atención configurado en el Calendario de Servicio.
- **Entitlement:** registro en D365 Customer Service que define los derechos de soporte de un cliente: número de casos permitidos, horas de soporte, canales disponibles (teléfono, email, chat), y período de vigencia. Ejemplo: un cliente con contrato Premium tiene 50 casos por año via cualquier canal; un cliente estándar tiene soporte solo por email. El sistema descuenta automáticamente del entitlement al crear casos.
- **Queues:** colas de trabajo en D365 Customer Service donde se acumulan los casos, emails y tareas pendientes de atención. Los agentes trabajan desde sus colas asignadas. Pueden ser públicas (cualquier agente del equipo ve los ítems) o privadas. Los casos se enrutan a colas por reglas manuales o por Unified Routing automáticamente.
- **Routing Rules:** reglas de asignación automática de casos a colas o usuarios según condiciones del caso. Ejemplo: si el asunto contiene "factura", enrutar a la cola de Facturación; si el cliente tiene contrato Premium, enrutar a la cola de Soporte VIP. Son el mecanismo legacy previo a Unified Routing — aún funcionales pero Unified Routing es más potente.
- **Unified Routing:** motor de enrutamiento inteligente de D365 Customer Service que soporta skills-based routing (asignar al agente con las habilidades requeridas), capacity-based routing (respetar la carga máxima por agente), y ML-based assignment (aprender patrones de asignación del historial). Requiere configurar Workstreams, Queues con miembros, Skills y Skill levels por agente.
- **Customer Service Hub:** la aplicación Model-Driven de D365 Customer Service diseñada específicamente para agentes de soporte. Incluye timeline de actividades, panel de KB, timer de SLA visible, workspace de agente, y vista de cola. Es la interfaz unificada que reemplaza a la interfaz clásica de Dynamics.
- **Knowledge Base:** repositorio de artículos de soporte dentro de D365 Customer Service. Los artículos tienen ciclo de vida (Draft → In Review → Published) con aprobación opcional. Se vinculan a casos para trackear qué artículos resolvieron qué problemas. El agente puede buscar y enviar artículos directamente desde el formulario del caso. Copilot Studio puede usar la KB como Knowledge Source.
- **Omnichannel for Customer Service:** extensión de D365 Customer Service que agrega soporte para canales de comunicación en tiempo real: chat web, WhatsApp Business, SMS, Facebook Messenger, Apple Messages for Business, y Microsoft Teams. Los agentes atienden múltiples conversaciones simultáneas desde un workspace unificado. Requiere licencia adicional de Omnichannel.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 20.1: Configurar Sales Process personalizado
1. D365 Sales → Configuración → Proceso de ventas → Nuevo BPF
2. Nombre: `Proceso Venta Consultiva`
3. Tabla: Oportunidad
4. Etapas:
    - **Descubrimiento** (Probabilidad: 10%)
     - Paso: Presupuesto del cliente (obligatorio)
     - Paso: Tomador de decisión identificado
     - Paso: Fecha de decisión estimada
    - **Propuesta** (Probabilidad: 30%)
     - Paso: Propuesta enviada (obligatorio)
     - Paso: Demo realizada
    - **Negociación** (Probabilidad: 60%)
     - Paso: Contrato en revisión legal
    - **Cierre** (Probabilidad: 90%)
     - Acción: Generar orden de compra
     - Acción: Notificar a proyectos

5. Activar el BPF y asignarlo al equipo de ventas

#### Actividad 20.2: Email-to-Case automation
1. D365 Customer Service → Configuración → Canales → Email
2. Crear mailbox: `soporte@empresa.com` → sincronizar con Exchange
3. Configurar regla de conversión automática:
    - Configuración → Reglas de creación y actualización de registros
    - Tipo de actividad: Email
    - Condición: Para = `soporte@empresa.com`
    - Acción: Crear caso
    - Mapeos:
     ```
     Caso.Asunto ← Email.Asunto
     Caso.Descripción ← Email.Cuerpo
     Caso.Cliente ← Email.De (buscar en Contactos/Cuentas)
     Caso.Canal de origen ← "Email"
     ```

#### Actividad 20.3: SLA con KPIs y escalamiento
1. Configuración → SLA → Nuevo SLA
2. Nombre: `SLA Soporte Estándar`
3. Tabla: Caso
4. **KPI 1: Primera respuesta**
    - Advertencia: 2 horas
    - Fallo: 4 horas
    - Aplicable cuando: Prioridad = Normal
    - Acción en fallo: Enviar email a supervisor + cambiar prioridad a Alta

5. **KPI 2: Resolución**
    - Advertencia: 20 horas (días hábiles)
    - Fallo: 24 horas (días hábiles)
    - Acción en fallo: Escalar a Nivel 2 + notificar gerente

6. Configurar horario de atención:
    - Configuración → Calendarios de servicio al cliente
    - Lunes–Viernes 8am–6pm, zona horaria Bogotá

7. Asociar el SLA al tipo de caso y activar

#### Actividad 20.4: Enrutamiento con Unified Routing
1. Customer Service Hub → Unified Routing → Configuración
2. Crear Queue: `Cola_Soporte_Técnico`
3. Crear Queue: `Cola_Soporte_Facturación`
4. Definir skills: `SQL_Server`, `SAP`, `Power_BI`, `Hardware`
5. Asignar skills a agentes con nivel de competencia (1-5)
6. Workstream: `WS_Email_Soporte`
    - Canal: Email
    - Modo de distribución: Push (asignación automática)

7. Regla de enrutamiento:
   ```
   Si Asunto contiene "factura" OR "cobro" OR "pago"
     → Enrutar a Cola_Soporte_Facturación
   
   Si Asunto contiene "error" OR "falla" OR "no funciona"
     → Enrutar a Cola_Soporte_Técnico
     → Requerir skill SQL_Server (nivel ≥ 3) si Descripción contiene "base de datos"
   
   Default → Cola_Soporte_Técnico
   ```

#### Actividad 20.5: Knowledge Base integrada
1. Customer Service Hub → Base de conocimientos → Nuevo artículo
2. Crear 5 artículos de soluciones frecuentes con:
    - Título, contenido HTML, palabras clave, categoría
    - Publicar artículos (flujo de aprobación opcional)

3. En formulario de Caso: panel "KB" → buscar artículos relacionados
4. Configurar sugerencia automática de KB en Copilot Studio (Módulo 22)

### 💼 Caso Real de Negocio
**Empresa:** Empresa de software con 5,000 clientes y mesa de ayuda de 30 agentes  
**Problema:** Los casos se asignaban por turno rotativo sin considerar el expertise del agente. Un caso de SAP llegaba a un agente de Power BI.  
**Solución:** Unified Routing con skills-based routing. Agentes califican sus skills. Los casos de SAP van automáticamente a agentes con skill SAP nivel ≥ 3. SLA diferenciado para clientes Premium (4h resolución) vs Estándar (24h).  
**Resultado:** First-contact resolution: de 45% a 72%. Satisfacción del cliente (CSAT): de 3.2 a 4.4/5.

### ✅ Buenas Prácticas
- Siempre usar Calendar de servicio en SLAs — los tiempos deben ser en horas hábiles, no absolutas
- Tener Knowledge Base robusta antes de implementar Copilot Studio para reducir hallucinations
- Unified Routing > Reglas de enrutamiento legacy — migrar si estás en el sistema viejo
- Usar entitlements para clientes con niveles de soporte diferenciados

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SLA no se activa | SLA no está configurado como "default" para el tipo de caso | Marcar SLA como predeterminado en la configuración |
| Email-to-Case duplica casos | Respuestas al email crean casos nuevos | Configurar que el email de respuesta use el ID del caso en el asunto |
| Routing no asigna a agentes | Cola sin miembros o capacidad de agentes = 0 | Verificar membresía de cola y límite de capacidad por agente |

### 🧪 Criterios de Validación
- [ ] BPF de venta consultiva con 4 etapas funciona en formulario de Oportunidad
- [ ] Email a `soporte@empresa.com` crea caso automáticamente con mapeo correcto
- [ ] SLA escalada al supervisor cuando el caso excede 4 horas sin primera respuesta
- [ ] Unified Routing dirige casos de facturación a la cola correcta
- [ ] 5 artículos KB publicados y visibles en el panel del caso

---

## MÓDULO 21: Power Pages — Portales Externos

### 🎯 Objetivo
Construir portales web externos con Power Pages que permiten a clientes y proveedores acceder a datos de Dataverse de forma segura, con autenticación, formularios de autoservicio y búsqueda.

### 📖 Conceptos Clave
- **Power Pages:** plataforma de Microsoft para construir sitios web externos (sucesor de Power Apps Portals). Permite a usuarios sin cuenta en el tenant corporativo registrarse, autenticarse, y acceder a datos de Dataverse de forma controlada. Incluye un Studio de diseño low-code con componentes drag-and-drop, soporte para Liquid templates, Web API JavaScript, y configuración de autenticación contra múltiples identity providers.
- **Table Permissions:** mecanismo de seguridad exclusivo de Power Pages que controla qué operaciones CRUD puede hacer un usuario del portal sobre cada tabla de Dataverse. Los tipos de acceso son: Global (todos los registros), Contact (solo registros del Contact autenticado), Account (registros de la Account del Contact), Parent (registros relacionados vía lookup), y Self (solo el registro del Contact mismo). Sin Table Permission configurado, el usuario no puede leer ni escribir ningún dato aunque esté autenticado.
- **Web Roles:** roles de seguridad dentro del portal que agrupan usuarios y determinan qué Table Permissions y páginas pueden acceder. Son independientes de los Security Roles de Dataverse. Los roles predeterminados son `Authenticated Users` (usuarios con sesión activa) y `Anonymous Users` (visitantes sin autenticar). Se crean roles adicionales para segmentar por tipo de cliente, nivel de contrato, o región.
- **Contact record:** cada usuario registrado en el portal tiene un registro Contact en Dataverse que actúa como su identidad maestra. El email del usuario es la clave de vinculación. Las Table Permissions de tipo "Contact" filtran datos usando el ID de este Contact como criterio. Al crear un registro desde el portal, se puede auto-poblar el campo de relación con el Contact del usuario autenticado.
- **Liquid templates:** lenguaje de plantillas server-side (basado en Liquid de Shopify) para generar HTML dinámico en las páginas del portal. Permite acceder a objetos del contexto como `user` (el Contact autenticado), `entities` (consultar registros de Dataverse), `page` (metadatos de la página), y `request` (parámetros de URL). Ejemplo: `{% assign casos = entities.incident | where: 'customerid', user.contact.id %}` consulta los casos del usuario.
- **Entity Forms / Basic Forms:** componente de Power Pages que renderiza un formulario de Dataverse en el portal para crear, editar, o leer un registro. Se configura especificando la tabla, el formulario de Dataverse a usar (se recomienda un formulario específico para el portal con menos campos), y el modo (Insert, Edit, ReadOnly). Soporta validaciones, redirección post-submit, y pasos de wizard con múltiples formularios.
- **Entity Lists / Basic Lists:** componente de Power Pages que renderiza una vista de Dataverse como lista en el portal, con filtrado, búsqueda y paginación. Se configura a partir de una Vista de Dataverse existente. Puede incluir acciones por fila (Ver detalle, Editar) y se integra con Entity Forms para el flujo completo de gestión de registros.
- **Web API del portal:** API REST JavaScript disponible en las páginas del portal para operaciones CRUD sobre registros de Dataverse sin recargar la página. Usa la ruta `/api/data/v9.1/[entitySetName]` y requiere el header `__RequestVerificationToken` en todas las operaciones de escritura (POST, PATCH, DELETE) como protección CSRF. Respeta los Table Permissions del usuario autenticado.
- **Content Delivery Network (CDN):** red de distribución de contenido que almacena archivos estáticos del portal (imágenes, CSS, JS) en nodos geográficamente distribuidos. Se activa en el portal con un toggle en la configuración. Reduce la latencia de carga para usuarios alejados del datacenter de Power Platform — especialmente importante para portales con usuarios en múltiples países.
- **Progressive Web App (PWA):** capacidad de Power Pages para hacer que el portal sea instalable como app en dispositivos móviles y soporte uso offline básico. Se habilita configurando el manifest del PWA con icono, colores y nombre, y el service worker para caché offline. Los usuarios pueden instalar el portal desde el navegador como si fuera una app nativa.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 21.1: Crear portal base
1. make.powerapps.com → Aplicaciones → Nueva → Portal
2. Nombre: `Portal Clientes SIT`
3. Seleccionar: Blank website (o Customer Self-Service si aplica)
4. Subdominio: `clientes-sit.powerappsportals.com`
5. Abrir Power Pages Studio (nueva interfaz)

#### Actividad 21.2: Configurar autenticación
1. Set up → Identity providers
2. Configurar Azure AD (para empleados del cliente):
    - App Registration en Azure AD con redirect URI: `https://clientes-sit.powerappsportals.com/signin-oidc`
    - En Portal: Identity Provider → Azure AD → Client ID, Client Secret, Authority

3. Configurar Local Authentication (para usuarios externos sin Azure AD):
    - Allow users to register with email
    - Configurar email de confirmación con plantilla personalizada

#### Actividad 21.3: Table Permissions para Oportunidades
1. Security → Table Permissions → New
2. **Permiso: Ver mis oportunidades**
    - Tabla: Oportunidad
    - Tipo de acceso: Contact (el usuario ve solo sus oportunidades)
    - Relación: Oportunidad.sit_contacto → Contact
    - Privilegios: Leer, Crear

3. **Permiso: Ver estados de casos (solo lectura)**
    - Tabla: Caso
    - Tipo de acceso: Contact
    - Relación: Caso.customerid → Contact
    - Privilegios: Leer

4. Asignar permisos al Web Role `Clientes Autenticados`

#### Actividad 21.4: Página con Liquid template personalizado
1. En Power Pages Studio → Nueva página → Contenido personalizado
2. Agregar template Liquid para mostrar saludo personalizado:
   ```liquid
   {% if user %}
     <div class="welcome-banner">
       <h2>Bienvenido, {{ user.fullname }}</h2>
       <p>Tiene {{ user.contact.sit_oportunidades_activas }} oportunidades activas.</p>
     </div>
     
     {% assign mis_casos = entities.incident | 
        where: 'customerid', user.contact.id | 
        order_by: 'createdon', 'desc' | 
        limit: 5 %}
     
     <h3>Mis últimos casos</h3>
     <table class="table">
       <thead>
         <tr><th>Número</th><th>Asunto</th><th>Estado</th></tr>
       </thead>
       <tbody>
         {% for caso in mis_casos %}
         <tr>
           <td>{{ caso.ticketnumber }}</td>
           <td>{{ caso.title }}</td>
           <td><span class="badge badge-{{ caso.statuscode.label | downcase }}">
             {{ caso.statuscode.label }}
           </span></td>
         </tr>
         {% endfor %}
       </tbody>
     </table>
   {% else %}
     <p>Por favor <a href="/SignIn">inicia sesión</a> para ver tu información.</p>
   {% endif %}
   ```

#### Actividad 21.5: Formulario de creación de solicitudes
1. Nueva página → Basic Form
2. Tabla: Solicitud (sit_solicitud)
3. Formulario de Dataverse: `Solicitud Portal` (crear este formulario específico para el portal con menos campos)
4. Modo: Insertar
5. Redirigir a: página de confirmación después de guardar
6. Configurar en la página: entity form component
7. Agregar validación JavaScript en la página:
   ```javascript
   // Validar archivo adjunto requerido antes de enviar
   $(document).ready(function() {
     $('#InsertButton').on('click', function(e) {
       var descripcion = $('#sit_descripcion').val();
       if (descripcion.length < 50) {
         e.preventDefault();
         alert('La descripción debe tener al menos 50 caracteres para procesar su solicitud correctamente.');
         $('#sit_descripcion').focus();
       }
     });
   });
   ```

#### Actividad 21.6: Web API desde JavaScript
```javascript
// Crear un caso directamente desde JavaScript del portal
function crearCasoPortal(asunto, descripcion) {
  var payload = JSON.stringify({
    "title": asunto,
    "description": descripcion,
    "caseorigincode": 3,  // Web
    "customerid_contact@odata.bind": "/contacts(" + _spPageContextInfo.userId + ")"
  });
  
  fetch('/api/data/v9.1/incidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      '__RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
    },
    body: payload
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/mis-casos?creado=true';
    } else {
      return response.json().then(err => { throw err; });
    }
  })
  .catch(error => {
    console.error('Error creando caso:', error);
    alert('Error al crear el caso. Por favor intente nuevamente.');
  });
}
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa de servicios con 2,000 clientes activos  
**Problema:** Los clientes llamaban por teléfono para saber el estado de sus contratos y casos. 60% de las llamadas eran consultas de estado, no problemas reales.  
**Solución:** Portal Power Pages donde el cliente ve sus contratos, crea casos, descarga facturas y ve el estado en tiempo real. Integrado con Dataverse donde vive toda la información del CRM.  
**Resultado:** Llamadas de soporte reducidas en 55%. NPS (Net Promoter Score) subió de 42 a 68.

### ✅ Buenas Prácticas
- Table Permissions en "Contact" > "Global" — nunca exponer todos los registros a usuarios del portal
- Crear formularios de Dataverse específicos para el portal (menos campos, UX simplificada)
- Usar CDN y compresión de imágenes — los portales externos deben cargar en < 3 segundos
- Habilitar WAF (Web Application Firewall) en producción

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Usuario autenticado no ve sus registros | Table Permission no configurado o mal relacionado | Revisar tipo de acceso (Contact vs Account vs Global) y la relación |
| Liquid template devuelve vacío | La relación de la tabla no tiene fetch correcto | Usar fetchxml en Liquid o verificar nombre de relación |
| Web API retorna 403 | Token de verificación no incluido en la llamada | Siempre incluir `__RequestVerificationToken` en headers de fetch |

### 🧪 Criterios de Validación
- [ ] Portal creado con autenticación Azure AD funcional
- [ ] Usuario autenticado ve solo sus propios casos (Table Permission de tipo Contact)
- [ ] Página con Liquid muestra datos dinámicos del usuario logueado
- [ ] Formulario de creación de solicitud guarda en Dataverse correctamente
- [ ] Validación JavaScript previene envío de formulario sin descripción mínima

---

## MÓDULO 22: Copilot Studio Avanzado

### 🎯 Objetivo
Implementar agentes conversacionales de producción con SSO integrado a Azure AD, orquestación multi-agente, respuestas generativas con grounding en documentos corporativos, integración con Knowledge Base de D365, y métricas de calidad.

### 📖 Conceptos Clave
- **Generative Orchestration:** modo avanzado de Copilot Studio donde el LLM decide dinámicamente qué topic activar basado en el contexto completo de la conversación, en lugar de depender exclusivamente de trigger phrases exactas. Permite conversaciones más naturales donde el usuario puede expresarse de múltiples maneras y el agente entiende la intención. Se activa en Configuración → Generative Orchestration y requiere que los topics tengan descripciones claras para que el LLM pueda seleccionarlos correctamente.
- **Knowledge Sources:** fuentes de conocimiento que el agente consulta para generar respuestas con Generative Answers. Tipos soportados: sitios SharePoint (con sus documentos y páginas), URLs de sitios web públicos (el bot las indexa automáticamente), archivos subidos directamente, y la Knowledge Base de D365 Customer Service. Cada fuente puede tener instrucciones de uso específicas y un nivel de confianza mínimo para mostrar la respuesta.
- **Grounding:** proceso de anclar las respuestas generativas del LLM a fuentes de información específicas y verificables en lugar de responder desde el conocimiento general del modelo. Un agente "anclado" cita la fuente de su respuesta y rechaza responder sobre temas no cubiertos en sus Knowledge Sources. Evita alucinaciones — el riesgo de que el modelo invente procedimientos, nombres o datos de contacto inexistentes.
- **SSO (Single Sign-On):** integración de Copilot Studio con Azure AD para que el bot reconozca al usuario autenticado en el canal (Teams, portal) sin pedirle credenciales adicionales. El bot recibe el token del usuario y puede usarlo para llamar APIs en su nombre (On-Behalf-Of). Resultado: el bot saluda al usuario por nombre y consulta sus datos específicos desde el primer mensaje.
- **Azure AD Authentication en Copilot Studio:** configuración de OAuth 2.0 con Azure AD para que el agente pueda hacer llamadas autenticadas a APIs que requieren identidad del usuario. El flujo OBO (On-Behalf-Of) permite que el bot, con el token del usuario, llame a APIs de Dataverse o Microsoft Graph como si fuera el usuario mismo. Se configura en Copilot Studio → Configuración → Seguridad → Autenticación → Azure Active Directory v2.
- **Adaptive Cards:** formato de tarjetas interactivas de Microsoft Teams y otros canales que permite mostrar información estructurada con imágenes, tablas, FactSets y botones accionables. En Copilot Studio se insertan en los nodos de mensaje con el editor visual o importando JSON. Las variables del topic se referencian con la sintaxis `${Topic.NombreVariable}`. Los botones pueden ejecutar acciones (Submit, OpenUrl) que el topic puede manejar.
- **Multi-turn conversations:** capacidad del agente de mantener contexto a lo largo de múltiples intercambios en la misma sesión. Las variables declaradas en un topic persisten durante toda la conversación mientras el topic esté activo. Permite implementar wizards de múltiples preguntas donde cada respuesta del usuario enriquece el contexto para la siguiente acción — por ejemplo, recopilar tipo de solicitud, prioridad y descripción antes de crearla en Dataverse.
- **Escalamiento a Omnichannel:** acción nativa de Copilot Studio que transfiere la conversación activa a un agente humano en D365 Customer Service Omnichannel, incluyendo el historial completo de la conversación como contexto. El agente humano recibe la transcripción y puede continuar desde donde el bot dejó. Se configura en Omnichannel Admin Center → Canales → Bot → seleccionar el agente de Copilot Studio.
- **Analytics de Copilot Studio:** panel de métricas en tiempo real con indicadores clave: tasa de resolución (% de sesiones que el bot resolvió sin escalar — objetivo ≥ 70%), tasa de abandono (% que terminó la conversación sin completar su objetivo — objetivo ≤ 15%), temas más activados (identifica los topics más usados), y sesiones con escalamiento (patrones que revelan gaps en la cobertura del bot). Datos disponibles en Analytics → Summary con ventanas de 7, 30 y 90 días.
- **Custom Prompt Instructions:** texto de instrucciones de sistema enviado al LLM que controla el comportamiento del agente: tono (formal/informal), idioma de respuesta, limitaciones de scope (responder solo sobre temas X), formato de respuesta (máximo N párrafos, usar bullet points), y qué hacer cuando no tiene información. Ejemplo: `"Eres el asistente de RR.HH. de la empresa. Responde solo en español. Si no tienes la información, di exactamente: 'No tengo información sobre ese tema.'"` Se configura en Copilot Studio → Generative AI → Custom Instructions.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 22.1: Configurar SSO con Azure AD
1. En Azure AD → App Registrations → Nueva (para el bot)
2. Configurar:
    - Redirect URI: `https://token.botframework.com/.auth/web/redirect`
    - API permissions: `User.Read`, `Mail.Send`, `offline_access`, `openid`
    - Crear client secret

3. En Copilot Studio → Configuración → Seguridad → Autenticación
4. Seleccionar: Azure Active Directory v2
5. Ingresar: Client ID, Client Secret, Tenant ID
6. Alcances: `profile openid`
7. Guardar y probar: el bot debe salud al usuario por nombre sin pedirle que se loguee

#### Actividad 22.2: Usar identidad del usuario en flujos
1. En un Topic, agregar nodo: "Call an action" → Power Automate
2. El flujo puede recibir: `System.User.PrincipalName` (email del usuario SSO)
3. En el flujo:
   ```
   // Usar el email del usuario para consultar sus registros específicos
   List rows (Dataverse)
   Filter: sit_responsable/internalemailaddress eq '@{triggerBody()?['text']}'
   ```

4. Retornar datos personalizados al bot

#### Actividad 22.3: Adaptive Cards en Teams
1. En un Topic → Nodo de mensaje → Adaptive Card
2. Usar el editor de Adaptive Cards o importar JSON:
   ```json
   {
     "type": "AdaptiveCard",
     "version": "1.4",
     "body": [
       {
         "type": "TextBlock",
         "text": "📋 Resumen de tu solicitud",
         "weight": "Bolder",
         "size": "Medium"
       },
       {
         "type": "FactSet",
         "facts": [
           {"title": "Número:", "value": "${Topic.NumeroSolicitud}"},
           {"title": "Estado:", "value": "${Topic.EstadoSolicitud}"},
           {"title": "Prioridad:", "value": "${Topic.Prioridad}"},
           {"title": "Asignado a:", "value": "${Topic.Asignado}"}
         ]
       }
     ],
     "actions": [
       {
         "type": "Action.Submit",
         "title": "✅ Marcar como revisado",
         "data": {"action": "marcar_revisado", "id": "${Topic.SolicitudId}"}
       },
       {
         "type": "Action.OpenUrl",
         "title": "Ver en el sistema",
         "url": "https://tuorg.crm.dynamics.com/main.aspx?id=${Topic.SolicitudId}"
       }
     ]
   }
   ```

3. El bot renderiza la tarjeta en Teams con los datos y botones accionables

#### Actividad 22.4: Generative Answers con Knowledge Sources
1. Agregar Knowledge Source → SharePoint
2. URL: `https://tuempresa.sharepoint.com/sites/documentacion-it`
3. Instrucciones del sistema:
   ```
   Eres el asistente de soporte IT de SIT Consulting. 
   Responde ÚNICAMENTE basándote en los documentos de la knowledge base.
   Si no encuentras la información, di exactamente: "No tengo información sobre ese tema. Te recomiendo contactar al equipo de soporte en soporte@empresa.com"
   No inventes procedimientos ni datos de contacto.
   Responde siempre en español.
   Sé conciso — máximo 3 párrafos.
   ```

4. Probar con preguntas de los documentos y verificar que cita la fuente
5. Probar con preguntas fuera del scope y verificar que responde apropiadamente

#### Actividad 22.5: Escalamiento a agente humano
1. Crear topic: `Escalar a Agente Humano`
2. Trigger phrases: "hablar con persona", "agente humano", "quiero hablar con alguien"
3. Nodo de mensaje: "Entiendo que deseas hablar con uno de nuestros agentes. Te conectaré en un momento."
4. Nodo: Escalar a agente humano (nodo nativo de Copilot Studio)
    - Contexto de escalamiento: resumen de la conversación

5. Configurar integración con Omnichannel for Customer Service:
    - Admin Center → Canales → Bot → Configurar escalamiento
    - Queue de escalamiento: `Cola_Chat_General`

#### Actividad 22.6: Analytics y mejora continua
1. Copilot Studio → Analytics → Resumen
2. Revisar métricas clave:
    - **Tasa de resolución:** % de conversaciones que el bot resolvió sin escalar (objetivo ≥ 70%)
    - **Tasa de abandono:** % que se fue sin obtener respuesta (objetivo ≤ 15%)
    - **Topics más activos:** identificar cuáles topics necesitan más trigger phrases
    - **Sesiones con escalamiento:** identificar patterns para crear nuevos topics

3. Con base en Analytics → mejorar trigger phrases de los 3 topics con menor tasa de activación

### 💼 Caso Real de Negocio
**Empresa:** Banco con 15,000 empleados  
**Problema:** El chatbot anterior respondía preguntas genéricas sin saber quién era el usuario. Un empleado preguntaba "¿cuántos días de vacaciones tengo?" y el bot respondía el procedimiento genérico, no los días específicos del empleado.  
**Solución:** SSO Azure AD + integración con HRIS vía Power Automate. El bot sabe quién es el usuario y consulta sus datos específicos. Knowledge Sources con política interna de RRHH para preguntas de procedimientos. Adaptive Cards con botones para acciones directas.  
**Resultado:** Resolución en el primer mensaje: 78%. Llamadas a RRHH reducidas 40%.

### ✅ Buenas Prácticas
- SSO es prácticamente obligatorio en bots corporativos — evita fricciones de autenticación
- Probar el bot con usuarios reales (no solo el desarrollador) antes de publicar
- Revisar Analytics semanalmente las primeras 4 semanas post-lanzamiento
- Tener siempre el topic "Escalar a agente" disponible como escape hatch
- Monitorear sesiones con rate de escalamiento alto — indican gaps en la KB

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SSO pide credenciales en Teams | OAuth scope mal configurado | Agregar `openid profile` y verificar redirect URI |
| Generative Answers alucina | Knowledge Source con documentos ambiguos o desactualizados | Depurar documentos fuente y agregar instrucciones de sistema restrictivas |
| Adaptive Card no muestra datos de variable | Sintaxis de binding incorrecta | Usar `${Topic.Variable}` exactamente — sensible a mayúsculas |

### 🧪 Criterios de Validación
- [ ] SSO configurado: bot saluda al usuario por nombre en Teams sin pedir login
- [ ] Flujo PA usa `System.User.PrincipalName` para personalizar respuesta
- [ ] Adaptive Card renderiza con datos dinámicos y botón accionable
- [ ] Generative Answers responde desde KB y rechaza preguntas fuera de scope
- [ ] Topic de escalamiento transfiere la conversación con contexto al agente humano
- [ ] Analytics muestra tasa de resolución y se identificaron 2 topics para mejorar

---

## MÓDULO 23: C# Plugins para Dataverse

!!! tip "Prerequisito de Lenguaje"
    Este módulo requiere conocimientos básicos de **C# y .NET**: clases, interfaces, herencia, NuGet y async/await. Si es tu primer contacto con C#, dedica al menos 2 semanas al [Anexo de Lenguajes de Programación](../Anexos/LENGUAJES_PROGRAMACION.md) — sección C# — antes de continuar.

### 🎯 Objetivo
Desarrollar plugins C# robustos para ejecutar lógica de negocio compleja en el servidor de Dataverse: validaciones, cálculos, integraciones síncronas con APIs externas, y patrones de plugin avanzados como Early-Bound entities y Shared Variables.

### 📖 Conceptos Clave
- **IPlugin:** interfaz de C# que implementa todo plugin de Dataverse. Define un único método `Execute(IServiceProvider serviceProvider)` que es el punto de entrada del plugin. Toda la lógica de negocio se implementa dentro de este método. La clase que implementa `IPlugin` debe ser `public`, no puede ser `abstract`, y debe tener un constructor sin parámetros (o con un parámetro `string` para la configuración insecura).
- **IPluginExecutionContext (contexto de ejecución):** objeto inyectado automáticamente que contiene toda la información de la operación en curso: `MessageName` (Create/Update/Delete/Retrieve), `PrimaryEntityName` (nombre de la tabla), `Stage` (20=PreValidation, 40=PreOperation sincrónico, 50=PostOperation, 60=PostOperation asíncrono), `InputParameters` (el registro Target con los nuevos valores), `PreEntityImages` (estado del registro antes del cambio), `PostEntityImages` (estado después), `InitiatingUserId`, y `OrganizationId`. Ejemplo: en un plugin de validación sobre Update de Cuenta, `context.InputParameters["Target"]` contiene los campos modificados y `context.PreEntityImages["preImage"]` los valores anteriores.
- **IOrganizationService:** interfaz que expone todas las operaciones CRUD de Dataverse accesibles desde el plugin: `Create(Entity)`, `Retrieve(entityName, id, columnSet)`, `RetrieveMultiple(query)`, `Update(Entity)`, `Delete(entityName, id)`, `Execute(OrganizationRequest)`. Se obtiene del `IOrganizationServiceFactory` usando el ID del usuario del contexto: `serviceFactory.CreateOrganizationService(context.UserId)` — así las operaciones se ejecutan como el usuario que disparó la acción, respetando sus permisos.
- **ITracingService:** servicio de logging del plugin que escribe mensajes en el Plugin Trace Log de Dataverse. Se accede con `serviceProvider.GetService(typeof(ITracingService))`. Los mensajes son visibles en la UI de D365 → Configuración → Plugin Trace Log cuando el registro de traces está habilitado. Esencial para diagnosticar errores en producción ya que no se puede usar un debugger. Ejemplo: `tracer.Trace("Procesando solicitud {0}, estado={1}", solicitudId, estado)`.
- **Pre/Post Operation (etapas del pipeline):** el pipeline de ejecución de eventos de Dataverse tiene cuatro etapas. PreValidation (Stage 10): antes de la transacción de base de datos, para validaciones que no requieren los datos guardados. PreOperation (Stage 20): dentro de la transacción, puede modificar el Target antes de guardarse o lanzar excepción para cancelar. PostOperation (Stage 40): después del commit, para lógica que depende de que el dato ya fue guardado. PostOperation Async (Stage 50/60): fuera de la transacción, para operaciones que no deben bloquear al usuario.
- **Pre/Post Entity Images:** snapshots del registro registrados en el step del plugin. PreEntityImage captura los valores del registro antes del evento (útil en Update para saber qué campos cambiaron). PostEntityImage captura los valores después del evento (útil en Create para obtener el ID asignado). Se registran en el Plugin Registration Tool especificando el nombre del image y los atributos a capturar. Se acceden en el plugin con `context.PreEntityImages["nombreImage"]`.
- **Early-Bound vs Late-Bound:** dos estilos de acceso a datos en plugins. Late-Bound usa la clase genérica `Entity` con acceso por nombre de atributo como string: `entity["sit_nombre"]` — flexible pero sin IntelliSense ni validación en tiempo de compilación. Early-Bound usa clases C# generadas por `pac modelbuilder build` que representan exactamente la estructura de cada tabla: `solicitud.sit_nombre`, con autocompletado, tipado fuerte y validación en compilación. Recomendado Early-Bound para proyectos de producción.
- **Plugin Registration Tool (PRT):** herramienta de escritorio incluida en el NuGet `Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool` para registrar assemblies, steps e images de plugins en Dataverse. Permite conectarse a cualquier entorno, subir el DLL compilado del plugin (Assembly Registration), crear Steps que definen en qué evento/tabla/etapa se ejecuta cada plugin, y registrar Pre/Post Images con los atributos requeridos. También se puede usar `pac plugin push` como alternativa CLI.
- **Sandbox (Isolation Mode):** entorno de ejecución restringido donde corren todos los plugins de Dataverse. El sandbox impide el acceso a: sistema de archivos, registro de Windows, llamadas de red directas a IPs privadas, y WMI. Permite llamadas HTTP/HTTPS salientes a internet y acceso a `IOrganizationService`. Los plugins con Isolation Mode "None" (Full Trust) solo se pueden usar en entornos on-premises — en la nube todos son Sandbox obligatoriamente.
- **Shared Variables:** mecanismo para pasar datos entre plugins que corren en el mismo pipeline de ejecución (mismo evento, misma transacción). Se usan `context.SharedVariables` como diccionario: `context.SharedVariables["validacionAprobada"] = true` en el primer plugin, `context.SharedVariables.Contains("validacionAprobada")` en el segundo. Útil para que un plugin de PreValidation le comunique información a un plugin de PreOperation del mismo step.
- **Depth:** número entero que indica el nivel de anidamiento de las llamadas al pipeline de Dataverse. Cuando un plugin hace una operación CRUD que dispara otro plugin, el Depth aumenta en 1. `context.Depth == 1` significa que la operación fue disparada directamente por el usuario o el sistema. Siempre verificar `if (context.Depth > 1) return;` al inicio del plugin para evitar bucles infinitos cuando el plugin modifica el mismo tipo de registro que lo disparó.
- **InvalidPluginExecutionException:** la única excepción de C# que Dataverse maneja de forma especial en plugins. Al lanzarla, cancela toda la transacción (rollback), muestra el mensaje de la excepción al usuario en la UI como un error de negocio comprensible, y escribe el stack trace en el Plugin Trace Log. Cualquier otra excepción no controlada también cancela la transacción pero muestra un mensaje técnico genérico al usuario. Ejemplo: `throw new InvalidPluginExecutionException("El presupuesto es requerido para solicitudes urgentes.");`

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 23.1: Setup del proyecto de plugin
1. Visual Studio → Nuevo proyecto → Class Library (.NET Framework 4.6.2)
   ```
   Nombre: SIT.Plugins
   Framework: .NET Framework 4.6.2 (requerido para sandbox de Dataverse)
   ```

2. NuGet packages:
   ```xml
   <PackageReference Include="Microsoft.CrmSdk.CoreAssemblies" Version="9.0.2.*" />
   <PackageReference Include="Microsoft.CrmSdk.Workflow" Version="9.0.2.*" />
   ```

3. Generar Early-Bound entities con CrmSvcUtil o Power Platform CLI:
   ```bash
   pac modelbuilder build --settingsTemplateFile modelbuilder-settings.json
   ```

#### Actividad 23.2: Plugin Pre-Operation — Validación y enriquecimiento
```csharp
using Microsoft.Xrm.Sdk;
using System;

namespace SIT.Plugins
{
    public class SolicitudPreCreatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtener servicios del contexto
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);

            tracer.Trace("SolicitudPreCreatePlugin iniciado. Depth: {0}", context.Depth);

            // Evitar recursión: si ya estamos en profundidad > 1, salir
            if (context.Depth > 1) return;

            // Verificar que estamos en el evento correcto
            if (context.MessageName != "Create" || context.Stage != 20) return;
            if (!context.InputParameters.Contains("Target") ||
                !(context.InputParameters["Target"] is Entity)) return;

            var solicitud = (Entity)context.InputParameters["Target"];

            // Obtener valor del campo presupuesto
            var presupuesto = solicitud.GetAttributeValue<Money>("sit_presupuesto");

            // Validar que si es urgente, tenga presupuesto
            var prioridad = solicitud.GetAttributeValue<OptionSetValue>("sit_prioridad");
            bool esUrgente = prioridad?.Value == 100000002; // 100000002 = Urgente

            if (esUrgente && (presupuesto == null || presupuesto.Value <= 0))
            {
                throw new InvalidPluginExecutionException(
                    "Las solicitudes urgentes deben tener un presupuesto asignado.");
            }

            // Auto-calcular fecha de vencimiento según prioridad
            DateTime fechaVencimiento;
            switch (prioridad?.Value)
            {
                case 100000002: // Urgente
                    fechaVencimiento = DateTime.UtcNow.AddHours(4);
                    break;
                case 100000001: // Alta
                    fechaVencimiento = DateTime.UtcNow.AddHours(24);
                    break;
                default: // Normal/Baja
                    fechaVencimiento = DateTime.UtcNow.AddDays(5);
                    break;
            }

            solicitud["sit_fechavencimiento"] = fechaVencimiento;
            tracer.Trace("Fecha vencimiento calculada: {0}", fechaVencimiento);

            // Asignar número automático (búsqueda del último número)
            var query = new Microsoft.Xrm.Sdk.Query.QueryExpression("sit_solicitud");
            query.ColumnSet = new Microsoft.Xrm.Sdk.Query.ColumnSet("sit_numero");
            query.AddOrder("createdon", Microsoft.Xrm.Sdk.Query.OrderType.Descending);
            query.TopCount = 1;

            var resultados = service.RetrieveMultiple(query);
            int siguienteNumero = 1;

            if (resultados.Entities.Count > 0)
            {
                var ultimoNumero = resultados.Entities[0].GetAttributeValue<string>("sit_numero");
                if (!string.IsNullOrEmpty(ultimoNumero) && ultimoNumero.StartsWith("SOL-"))
                {
                    if (int.TryParse(ultimoNumero.Substring(4), out int num))
                        siguienteNumero = num + 1;
                }
            }

            solicitud["sit_numero"] = $"SOL-{siguienteNumero:D5}";
            tracer.Trace("Número asignado: SOL-{0:D5}", siguienteNumero);
        }
    }
}
```

#### Actividad 23.3: Plugin Post-Operation — Notificación y auditoría
```csharp
public class SolicitudPostUpdatePlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = serviceFactory.CreateOrganizationService(context.UserId);

        if (context.Depth > 1 || context.MessageName != "Update" || context.Stage != 40) return;

        var target = (Entity)context.InputParameters["Target"];
        
        // Solo procesar si cambió el estado
        if (!target.Attributes.Contains("sit_estado")) return;

        // Obtener imagen pre-operación (estado anterior)
        Entity preImage = null;
        if (context.PreEntityImages.Contains("PreImage"))
            preImage = context.PreEntityImages["PreImage"];

        var estadoAnterior = preImage?.GetAttributeValue<OptionSetValue>("sit_estado")?.Value;
        var estadoNuevo = target.GetAttributeValue<OptionSetValue>("sit_estado")?.Value;

        // Solo actuar en transiciones específicas
        if (estadoAnterior == estadoNuevo) return;

        tracer.Trace("Cambio de estado: {0} → {1}", estadoAnterior, estadoNuevo);

        // Crear registro de auditoría personalizada
        var auditoria = new Entity("sit_auditoriasolicitud");
        auditoria["sit_solicitud"] = new EntityReference("sit_solicitud", context.PrimaryEntityId);
        auditoria["sit_estadoanterior"] = estadoAnterior.HasValue ? estadoAnterior.ToString() : "N/A";
        auditoria["sit_estadonuevo"] = estadoNuevo.ToString();
        auditoria["sit_usuario"] = new EntityReference("systemuser", context.UserId);
        auditoria["sit_fecha"] = DateTime.UtcNow;
        service.Create(auditoria);

        // Si el nuevo estado es "Aprobado" (100000001), disparar lógica de negocio
        if (estadoNuevo == 100000001)
        {
            // Actualizar campos de aprobación
            var update = new Entity("sit_solicitud", context.PrimaryEntityId);
            update["sit_fechaaprobacion"] = DateTime.UtcNow;
            update["sit_aprobadopor"] = new EntityReference("systemuser", context.UserId);
            service.Update(update);

            tracer.Trace("Registro aprobación actualizado exitosamente.");
        }
    }
}
```

#### Actividad 23.4: Registrar el plugin con Plugin Registration Tool
1. Descargar PRT: NuGet → Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool
2. Conectar al entorno DEV
3. Registrar assembly:
    - Register → Register New Assembly
    - Subir el DLL compilado (modo Release)
    - Isolation Mode: Sandbox

4. Registrar Step para SolicitudPreCreatePlugin:
   ```
   Message: Create
   Primary Entity: sit_solicitud
   Stage: Pre-operation (20)
   Execution Mode: Synchronous
   ```

5. Registrar Step para SolicitudPostUpdatePlugin:
   ```
   Message: Update
   Primary Entity: sit_solicitud
   Filtering Attributes: sit_estado (solo dispara si este campo cambió)
   Stage: Post-operation (40)
   Execution Mode: Synchronous
   Pre-Image: Nombre="PreImage", Attributes="sit_estado"
   ```

#### Actividad 23.5: Unit Testing del plugin
```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Moq;

[TestClass]
public class SolicitudPreCreatePluginTests
{
    [TestMethod]
    public void Execute_SolicitudUrgenteSinPresupuesto_DebeThrowException()
    {
        // Arrange
        var target = new Entity("sit_solicitud");
        target["sit_prioridad"] = new OptionSetValue(100000002); // Urgente
        // No se establece sit_presupuesto

        var context = new Mock<IPluginExecutionContext>();
        context.Setup(c => c.MessageName).Returns("Create");
        context.Setup(c => c.Stage).Returns(20);
        context.Setup(c => c.Depth).Returns(1);
        context.Setup(c => c.InputParameters).Returns(
            new ParameterCollection { { "Target", target } });

        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider.Setup(s => s.GetService(typeof(IPluginExecutionContext)))
            .Returns(context.Object);
        serviceProvider.Setup(s => s.GetService(typeof(ITracingService)))
            .Returns(new Mock<ITracingService>().Object);
        
        var orgService = new Mock<IOrganizationService>();
        orgService.Setup(s => s.RetrieveMultiple(It.IsAny<Microsoft.Xrm.Sdk.Query.QueryBase>()))
            .Returns(new EntityCollection());
        
        var serviceFactory = new Mock<IOrganizationServiceFactory>();
        serviceFactory.Setup(f => f.CreateOrganizationService(It.IsAny<Guid?>()))
            .Returns(orgService.Object);
        serviceProvider.Setup(s => s.GetService(typeof(IOrganizationServiceFactory)))
            .Returns(serviceFactory.Object);

        var plugin = new SolicitudPreCreatePlugin();

        // Act & Assert
        Assert.ThrowsException<InvalidPluginExecutionException>(() =>
            plugin.Execute(serviceProvider.Object));
    }

    [TestMethod]
    public void Execute_SolicitudNormal_AsignaFechaVencimiento5Dias()
    {
        // Arrange
        var target = new Entity("sit_solicitud");
        target["sit_prioridad"] = new OptionSetValue(100000000); // Normal
        
        // ... setup similar al anterior ...
        
        // Act
        // plugin.Execute(serviceProvider.Object);
        
        // Assert
        var fechaVencimiento = target.GetAttributeValue<DateTime>("sit_fechavencimiento");
        var diferenciaEsperada = DateTime.UtcNow.AddDays(5);
        Assert.IsTrue(Math.Abs((fechaVencimiento - diferenciaEsperada).TotalMinutes) < 1);
    }
}
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa financiera con requerimiento regulatorio  
**Problema:** Los usuarios podían crear préstamos sin validar que el cliente no tuviera deudas vencidas. La validación en el formulario era fácil de eludir.  
**Solución:** Plugin Pre-Create en la tabla Préstamo que consulta el historial crediticio vía API del buró de crédito. Si el cliente tiene deudas vencidas, lanza `InvalidPluginExecutionException` con mensaje claro. Imposible eludir — se ejecuta en el servidor independientemente de la UI.  
**Resultado:** Cumplimiento regulatorio 100%. Eliminación de préstamos aprobados con deuda vencida.

### ✅ Buenas Prácticas
- Siempre verificar `context.Depth > 1` para evitar recursión infinita
- Usar ITracingService para logging — indispensable para debugging en producción
- Filtrar por `Filtering Attributes` en el step — no ejecutar si no cambiaron los campos relevantes
- Pre-Operation para validaciones que pueden cancelar la operación
- Post-Operation (async) para tareas que no deben bloquear al usuario
- Unit tests con Moq son obligatorios para plugins — no se puede debuggear en producción fácilmente

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Plugin lanza error para todos los usuarios | Lógica sin verificar el evento/stage correcto | Agregar guards: `if (context.MessageName != "Create") return;` |
| "Object reference not set" | Campo no existe en el target — no siempre se envían todos | Usar `GetAttributeValue<T>()` — retorna null/default si no existe |
| Plugin llama a sí mismo infinitamente | Hace Update dentro de un plugin de Update sin check de Depth | Verificar `context.Depth > 1` al inicio |
| Timeout del plugin | Operación lenta (consulta sin límite, API externa lenta) | Agregar TopCount en queries y timeout de 15s en llamadas HTTP |

### 🧪 Criterios de Validación
- [ ] Plugin PreCreate valida y lanza excepción con mensaje al usuario cuando corresponde
- [ ] Plugin asigna número automático SOL-XXXXX sin duplicados
- [ ] Plugin PostUpdate registra auditoría cuando cambia el estado
- [ ] Step registrado con Pre-Image y Filtering Attributes correctos en PRT
- [ ] Al menos 2 unit tests pasan con xUnit/MSTest usando Moq para servicios

---

## MÓDULO 24: Integraciones con Azure Services

### 🎯 Objetivo
Integrar Power Platform con Azure Service Bus, Azure Functions, Azure API Management y Event Grid para construir arquitecturas de integración robustas, escalables y desacopladas entre Dataverse y sistemas externos.

### 📖 Conceptos Clave
- **Service Endpoint (Dataverse):** componente que se registra en Dataverse vía el Plugin Registration Tool para enviar automáticamente el `RemoteExecutionContext` (toda la información del evento: tabla, ID, campos, usuario) a Azure Service Bus Queue, Service Bus Topic, o Azure Event Hub. Se asocia a un Step igual que un plugin. No requiere código C# — Dataverse serializa y envía el contexto automáticamente. Es el mecanismo oficial para integración event-driven entre Dataverse y Azure.
- **Azure Service Bus:** servicio de mensajería asíncrona de Azure con dos patrones. Queue: mensajes de un emisor consumidos por un receptor (one-to-one), garantiza orden FIFO y entrega al menos una vez. Topic + Subscriptions: mensajes de un emisor consumidos por múltiples receptores independientes (one-to-many). Ambos soportan mensajes de hasta 256KB, Dead Letter Queue, lock de mensajes durante procesamiento, y retry automático configurable. En integración con Dataverse se usa Queue para enviar eventos a un sistema específico.
- **Azure Functions:** plataforma serverless de Azure para ejecutar código sin gestionar infraestructura. En integraciones con Power Platform se usan como: receptores de mensajes de Service Bus (trigger `ServiceBusTrigger`), webhooks HTTP que Power Automate puede llamar (`HttpTrigger`), procesadores de eventos de Event Grid, y proxies para APIs externas con lógica de transformación. El plan Consumption solo cobra por ejecución — ideal para cargas variables de integración.
- **Azure API Management (APIM):** gateway de APIs que centraliza la exposición de APIs con autenticación (API Keys, OAuth 2.0, certificados), rate limiting, transformación de requests/responses via políticas XML, caché de respuestas, y documentación con Swagger/OpenAPI. En Power Platform se usa para: exponer Dataverse OData a sistemas externos con un contrato simplificado, o consolidar múltiples APIs internas detrás de un endpoint único para conectores personalizados.
- **Azure Event Grid:** servicio de routing de eventos con un modelo publisher-subscriber. Los publishers envían eventos (Azure Storage, Dataverse via Service Bus Topic, aplicaciones custom) y Event Grid los enruta a los subscribers registrados: Azure Functions, Logic Apps, Event Hubs, o Webhooks. Soporta filtrado por tipo de evento y propiedades. Ideal cuando un evento de Dataverse debe desencadenar múltiples acciones en sistemas distintos.
- **Managed Identity:** identidad de Azure asignada a un servicio (Azure Function, Azure DevOps agent, APIM) que permite autenticarse en otros servicios de Azure (Key Vault, Service Bus, Dataverse) sin almacenar secretos en código o variables de entorno. Existen dos tipos: System-assigned (vida ligada al recurso) y User-assigned (puede compartirse entre recursos). En Azure Functions: `new DefaultAzureCredential()` usa automáticamente la Managed Identity en producción y las credenciales del desarrollador en local.
- **Azure Key Vault:** servicio de Azure para almacenar secretos, claves de cifrado y certificados de forma segura con auditoría de acceso. Los plugins C#, Azure Functions y Power Automate deben obtener los secretos desde Key Vault en tiempo de ejecución en lugar de tenerlos hardcodeados. En Power Platform, las Environment Variables soportan Key Vault como fuente de valores — el valor del secreto nunca se almacena en Dataverse.
- **Dead Letter Queue (DLQ):** cola secundaria en Azure Service Bus donde se mueven automáticamente los mensajes que no pudieron procesarse después del número máximo de reintentos (configurable, default 10). Los mensajes en DLQ no se pierden y quedan disponibles para diagnóstico manual o reprocesamiento. En producción, se debe configurar una alerta de Azure Monitor cuando la DLQ tiene mensajes sin procesar, y tener un proceso periódico de revisión.
- **Retry Policy:** configuración en Azure Service Bus y Azure Functions que define cuántas veces reintentar el procesamiento de un mensaje antes de moverlo a la DLQ, y con qué intervalo entre reintentos. Azure Functions con Service Bus trigger soporta `maxDeliveryCount` en Service Bus y `retryPolicy` en host.json con backoff exponencial. Una estrategia común: 3 reintentos con intervalos de 30s, 2min, 10min antes de enviar a DLQ.
- **Outbox Pattern:** patrón de garantía de entrega en integraciones. En lugar de llamar directamente a la API externa desde el plugin, el plugin crea un registro de "mensaje pendiente" en Dataverse (la "outbox"). Un proceso separado (Power Automate o Azure Function programada) lee y procesa estos mensajes pendientes, marcándolos como enviados o reintentando los fallidos. Garantiza que si el sistema externo está caído, los mensajes no se pierden — están en Dataverse esperando ser enviados.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 24.1: Service Endpoint — Dataverse a Azure Service Bus
1. Plugin Registration Tool → Register → Register New Service Endpoint
2. Configurar:
    - Designación: Queue
    - Solución: SIT_Integraciones
    - Namespace URL: `sb://sit-integration.servicebus.windows.net/`
    - Queue Name: `solicitudes-nuevas`
    - SAS Key Name: `RootManageSharedAccessKey`
    - SAS Key: (de Azure Portal → Service Bus → Shared access policies)

3. Registrar Step que envía a Service Bus:
    - Message: Create
    - Entity: sit_solicitud
    - Stage: Post-operation async
    - Execution Mode: Asynchronous

4. Probar: crear solicitud → verificar mensaje en Service Bus Explorer

#### Actividad 24.2: Azure Function que procesa el Service Bus
```csharp
// Function receptor de Service Bus
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;

public class SolicitudProcessor
{
    private readonly ILogger<SolicitudProcessor> _logger;
    private readonly HttpClient _httpClient;

    public SolicitudProcessor(ILogger<SolicitudProcessor> logger, HttpClient httpClient)
    {
        _logger = logger;
        _httpClient = httpClient;
    }

    [Function("ProcessSolicitudCreated")]
    public async Task Run(
        [ServiceBusTrigger("solicitudes-nuevas", Connection = "ServiceBusConnection")] 
        ServiceBusReceivedMessage message)
    {
        _logger.LogInformation("Procesando mensaje: {MessageId}", message.MessageId);

        try
        {
            // El mensaje de Dataverse Service Bus contiene el RemoteExecutionContext
            var body = message.Body.ToString();
            var executionContext = JsonSerializer.Deserialize<DataverseExecutionContext>(body);

            var solicitudId = executionContext?.PrimaryEntityId;
            var solicitudName = executionContext?.InputParameters?
                .FirstOrDefault(p => p.Key == "Target").Value?
                .Attributes?
                .FirstOrDefault(a => a.Key == "sit_nombre").Value?.ToString();

            _logger.LogInformation("Solicitud recibida: {Id} - {Name}", solicitudId, solicitudName);

            // Llamar al sistema ERP externo
            var erpPayload = new
            {
                externalId = solicitudId,
                name = solicitudName,
                timestamp = DateTime.UtcNow,
                source = "PowerPlatform"
            };

            var response = await _httpClient.PostAsJsonAsync(
                "https://erp.empresa.com/api/solicitudes",
                erpPayload);

            response.EnsureSuccessStatusCode();
            _logger.LogInformation("ERP notificado exitosamente para solicitud {Id}", solicitudId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error procesando mensaje {MessageId}", message.MessageId);
            throw; // Re-throw para que Service Bus reintente (hasta el max retry count)
        }
    }
}
```

#### Actividad 24.3: Exponer Dataverse vía Azure API Management
1. Azure Portal → API Management → APIs → Agregar API
2. Tipo: HTTP
3. Display Name: `Dataverse Proxy API`
4. Base URL: `/dataverse`
5. Agregar operación POST `/solicitudes`:
    - Backend: Forward a `https://tuorg.crm.dynamics.com/api/data/v9.2/sit_solicituds`

6. Política de inbound (transformación y autenticación):
   ```xml
   <policies>
     <inbound>
       <!-- Validar API Key del cliente externo -->
       <check-header name="X-API-Key" failed-check-httpcode="401" 
                     failed-check-error-message="API Key inválida" ignore-case="false">
         <value>{{api-key-valor-secreto}}</value>
       </check-header>
       
       <!-- Obtener token de Dataverse con Managed Identity -->
       <authentication-managed-identity resource="https://tuorg.crm.dynamics.com" />
       
       <!-- Transformar request del cliente externo al formato OData de Dataverse -->
       <set-body>
         @{
           var body = context.Request.Body.As<JObject>();
           return new JObject(
             new JProperty("sit_nombre", body["name"]),
             new JProperty("sit_descripcion", body["description"]),
             new JProperty("sit_origen", "API_Externa")
           ).ToString();
         }
       </set-body>
       
       <!-- Rate limiting: máx 100 llamadas por minuto por cliente -->
       <rate-limit-by-key calls="100" renewal-period="60" 
                          counter-key="@(context.Request.Headers.GetValueOrDefault("X-Client-ID"))" />
     </inbound>
     
     <outbound>
       <!-- Simplificar la respuesta de Dataverse (quitar metadata OData) -->
       <set-body>
         @{
           var body = context.Response.Body.As<JObject>();
           return new JObject(
             new JProperty("id", body["sit_solicitudid"]),
             new JProperty("numero", body["sit_numero"]),
             new JProperty("status", "created")
           ).ToString();
         }
       </set-body>
     </outbound>
   </policies>
   ```

#### Actividad 24.4: Azure Function como webhook para Power Automate
```csharp
[Function("DataverseWebhook")]
public IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    ILogger log)
{
    // Validar que viene de Power Automate (verificar la clave de función en la URL)
    log.LogInformation("Webhook recibido de Power Automate");
    
    var body = new StreamReader(req.Body).ReadToEnd();
    var data = JsonSerializer.Deserialize<WebhookPayload>(body);
    
    // Procesar datos
    // ...
    
    return new OkObjectResult(new { received = true, timestamp = DateTime.UtcNow });
}
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa de logística con 3 sistemas: Dataverse (CRM), SAP (ERP), WMS (almacén)  
**Problema:** Los sistemas se llamaban directamente entre sí. Si SAP estaba caído, las órdenes de Dataverse se perdían. 0 reintentos, 0 audit trail.  
**Solución:** Service Bus como middleware. Dataverse envía evento al Service Bus. Azure Function lo lee y llama a SAP con retry automático. Si SAP falla 3 veces, el mensaje va a Dead Letter Queue para atención manual. APIM expone WMS a Power Automate con rate limiting.  
**Resultado:** Cero pérdida de órdenes. SLA de integración: 99.9%. Dead Letter Queue procesa mensajes fallidos en horario de mantenimiento.

### ✅ Buenas Prácticas
- Async siempre para integraciones externas — nunca bloquear el pipeline de Dataverse
- Idempotencia en las Azure Functions — el mismo mensaje puede llegar 2 veces; debe procesarse 1 vez
- Dead Letter Queue monitoreada con alertas — mensajes fallidos no deben quedarse sin atención
- Managed Identity en lugar de connection strings almacenados en código

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Service Bus no recibe mensajes | Step de Service Endpoint en mode Synchronous | Cambiar a Asynchronous — los endpoints de Azure son async |
| Azure Function no procesa DLQ | Function no tiene trigger a la DLQ | Crear segunda Function con trigger `queue-name/$DeadLetterQueue` |
| APIM retorna 502 | Backend (Dataverse) tardó más del timeout de APIM | Aumentar backend timeout en APIM o implementar async pattern |

### 🧪 Criterios de Validación
- [ ] Crear solicitud en Dataverse → mensaje aparece en Service Bus Queue
- [ ] Azure Function procesa el mensaje y llama al endpoint externo
- [ ] Si el endpoint externo falla, el mensaje va a Dead Letter Queue después de 3 reintentos
- [ ] APIM valida API Key y transforma el request al formato OData
- [ ] Rate limiting de APIM bloquea al cliente que excede 100 llamadas/minuto

---

## MÓDULO 25: Patrones de Diseño Avanzados

### 🎯 Objetivo
Aplicar patrones de diseño reconocidos en implementaciones de Power Platform: Repository Pattern, Command Pattern, Observer Pattern con plugins, Saga Pattern para transacciones distribuidas, y CQRS para separar lecturas de escrituras.

### 📖 Conceptos Clave
- **Repository Pattern:** patrón de diseño que introduce una capa de abstracción entre la lógica de negocio y el acceso a datos. En plugins C#, en lugar de llamar directamente a `IOrganizationService` desde la lógica del negocio, se define una interfaz `ISolicitudRepository` con métodos de dominio (`GetById`, `GetPendientes`, `Save`) y una implementación concreta que usa `IOrganizationService`. La ventaja principal es la testeabilidad: en unit tests se inyecta un mock de `ISolicitudRepository` sin necesitar un entorno de Dataverse real.
- **Command Pattern:** patrón que encapsula una operación de negocio completa (con sus datos, validaciones y efectos secundarios) en un objeto independiente llamado Command. Ejemplo: en lugar de tener lógica dispersa, se crea la clase `AprobarSolicitudCommand` con los datos necesarios y una clase `AprobarSolicitudCommandHandler` que ejecuta toda la lógica. Facilita el logging uniforme de todas las operaciones, la validación previa, y el registro de auditoría sin repetir código.
- **Observer Pattern:** patrón donde los objetos observadores son notificados automáticamente cuando el objeto observado cambia de estado. En Dataverse, el sistema de plugins es una implementación nativa del Observer Pattern: el plugin actúa como observer que reacciona a eventos (Create/Update/Delete) en la tabla observada. El reto es el diseño cuidadoso de qué plugins observan qué eventos y en qué orden se ejecutan cuando hay múltiples plugins en el mismo Step.
- **Saga Pattern:** patrón para gestionar transacciones distribuidas que involucran múltiples sistemas sin soporte de transacciones ACID entre ellos. Una Saga es una secuencia de pasos donde cada paso tiene una operación de compensación (rollback manual). Si el paso N falla, se ejecutan las compensaciones de los pasos N-1, N-2, ..., 1 para deshacer los cambios. En Power Platform se implementa con Power Automate usando Scopes con manejo de errores, o con Azure Durable Functions para mayor robustez.
- **CQRS (Command Query Responsibility Segregation):** patrón arquitectónico que separa el modelo de lectura del modelo de escritura. Las operaciones de escritura (Commands) pasan por plugins C# con toda la lógica de validación y enriquecimiento. Las operaciones de lectura (Queries) usan FetchXML o vistas optimizadas directamente, sin pasar por la lógica de escritura. En Power Platform: los Canvas Apps y reportes leen directamente con FetchXML optimizado, mientras que las escrituras siempre van por el plugin que centraliza las reglas de negocio.
- **Outbox Pattern:** patrón de garantía de entrega at-least-once en integraciones. El plugin, en lugar de llamar directamente al sistema externo (arriesgando perder el mensaje si el sistema está caído), crea un registro en una tabla "Outbox" de Dataverse con el payload del mensaje y estado "Pendiente". Un proceso separado (Power Automate en polling cada 5 minutos, o Azure Function programada) lee los registros Pendientes, los envía al sistema externo, y los marca como "Enviado" o "Fallido" con el detalle del error.
- **Circuit Breaker:** patrón que protege un sistema cuando llama a un servicio externo que falla repetidamente. El Circuit Breaker tiene tres estados: Closed (operación normal), Open (después de N fallos en T segundos, deja de intentar — falla rápido con un mensaje claro al usuario), Half-Open (después de M minutos de recuperación, intenta una llamada de prueba — si tiene éxito, vuelve a Closed). Evita que el plugin agote su timeout de 2 minutos esperando una API caída, lo que bloquearía la interfaz de D365.
- **Retry Pattern:** patrón de reintento con backoff exponencial y jitter (variación aleatoria en el tiempo de espera). En lugar de reintentar inmediatamente al fallar (que causaría una avalancha de requests al sistema externo), se espera un tiempo creciente: intento 1 después de 1s, intento 2 después de 2s, intento 3 después de 4s, con jitter ±20% para evitar que múltiples instancias del plugin reintenten exactamente al mismo tiempo. En Azure Functions se configura con `retryPolicy` en `host.json` o con `[FixedDelayRetry]`/`[ExponentialBackoffRetry]` en el atributo del trigger.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 25.1: Repository Pattern en Plugins C#
```csharp
// Interfaz de repositorio
public interface ISolicitudRepository
{
    Entity GetById(Guid id, string[] columns);
    EntityCollection GetByCriteria(QueryExpression query);
    Guid Create(Entity solicitud);
    void Update(Entity solicitud);
    void Delete(Guid id);
}

// Implementación con IOrganizationService
public class DataverseSolicitudRepository : ISolicitudRepository
{
    private readonly IOrganizationService _service;
    private readonly ITracingService _tracer;

    public DataverseSolicitudRepository(IOrganizationService service, ITracingService tracer)
    {
        _service = service;
        _tracer = tracer;
    }

    public Entity GetById(Guid id, string[] columns)
    {
        _tracer.Trace("GetById: {0}", id);
        return _service.Retrieve("sit_solicitud", id, new ColumnSet(columns));
    }

    public EntityCollection GetByCriteria(QueryExpression query)
    {
        return _service.RetrieveMultiple(query);
    }

    public Guid Create(Entity solicitud)
    {
        _tracer.Trace("Creating solicitud: {0}", solicitud.GetAttributeValue<string>("sit_nombre"));
        return _service.Create(solicitud);
    }

    public void Update(Entity solicitud) => _service.Update(solicitud);
    public void Delete(Guid id) => _service.Delete("sit_solicitud", id);
}

// Plugin usando el repositorio (testeable con mock)
public class MiPlugin : IPlugin
{
    private readonly Func<IOrganizationService, ITracingService, ISolicitudRepository> _repoFactory;

    public MiPlugin() 
        : this((svc, tracer) => new DataverseSolicitudRepository(svc, tracer)) { }

    // Constructor para testing con mock
    public MiPlugin(Func<IOrganizationService, ITracingService, ISolicitudRepository> repoFactory)
    {
        _repoFactory = repoFactory;
    }

    public void Execute(IServiceProvider serviceProvider)
    {
        var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = serviceFactory.CreateOrganizationService(context.UserId);

        var repo = _repoFactory(service, tracer);
        // Usar repo.GetById(), repo.Create(), etc.
    }
}
```

#### Actividad 25.2: Circuit Breaker en llamadas HTTP desde Plugin
```csharp
public class ExternalApiService
{
    private static int _failureCount = 0;
    private static DateTime _lastFailureTime = DateTime.MinValue;
    private const int FailureThreshold = 3;
    private static readonly TimeSpan RecoveryTime = TimeSpan.FromMinutes(5);

    public string CallExternalApi(string url, ITracingService tracer)
    {
        // Circuit Breaker: si hay muchos fallos recientes, no intentar
        if (_failureCount >= FailureThreshold && 
            DateTime.UtcNow - _lastFailureTime < RecoveryTime)
        {
            tracer.Trace("Circuit breaker OPEN. Skipping external call.");
            throw new InvalidPluginExecutionException(
                "El servicio externo está temporalmente no disponible. Intente nuevamente en 5 minutos.");
        }

        try
        {
            using var client = new System.Net.Http.HttpClient();
            client.Timeout = TimeSpan.FromSeconds(10);
            var result = client.GetStringAsync(url).Result;
            
            // Éxito — resetear contador
            _failureCount = 0;
            return result;
        }
        catch (Exception ex)
        {
            _failureCount++;
            _lastFailureTime = DateTime.UtcNow;
            tracer.Trace("External API failure #{0}: {1}", _failureCount, ex.Message);
            throw;
        }
    }
}
```

#### Actividad 25.3: Saga Pattern para proceso multi-paso
Escenario: Crear Orden requiere: 1) Verificar inventario (WMS), 2) Reservar crédito (ERP), 3) Crear en Dataverse
```
Saga: CrearOrden
  Paso 1: VerificarInventario(WMS)
    Compensación: LiberarInventario(WMS)
  
  Paso 2: ReservarCredito(ERP)
    Compensación: LiberarCredito(ERP)
  
  Paso 3: CrearOrdenDataverse
    Compensación: CancelarOrdenDataverse

Si Paso 2 falla:
  → Ejecutar compensación Paso 1 (LiberarInventario)
  → Lanzar error al usuario

Si Paso 3 falla:
  → Ejecutar compensación Paso 2 (LiberarCredito)
  → Ejecutar compensación Paso 1 (LiberarInventario)
  → Lanzar error al usuario
```

Implementar en Power Automate como Child Flows encadenados con manejo de compensaciones en Scope/Catch.

### 💼 Caso Real de Negocio
**Empresa:** Marketplace B2B con órdenes de compra multi-proveedor  
**Problema:** Una orden que involucraba 3 sistemas podía quedar en estado inconsistente si uno de los sistemas fallaba a mitad del proceso. Inventario reservado pero orden no creada.  
**Solución:** Saga Pattern implementado en Azure Durable Functions con compensaciones. Si cualquier paso falla, los pasos anteriores se deshacen automáticamente. Estado de la saga persistido en Azure Storage.  
**Resultado:** Cero órdenes en estado inconsistente. Auditoría completa de cada intento y compensación.

### ✅ Buenas Prácticas
- Repository Pattern hace los plugins 10x más fáciles de testear
- Circuit Breaker previene que un sistema externo caído cause avalanchas de errores
- Saga requiere que todas las operaciones sean compensables — diseñar con esto en mente desde el inicio

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Circuit breaker nunca se recupera | Estado compartido en static no se resetea | Implementar half-open state con timer de recuperación |
| Saga queda incompleta sin compensar | Power Automate no ejecuta el Catch si el Scope no tiene Run After configurado | Siempre verificar "has failed" en el Run After del Scope Catch |

### 🧪 Criterios de Validación
- [ ] Plugin usa Repository Pattern y puede ser testeado con mock de ISolicitudRepository
- [ ] Circuit Breaker deja de llamar a la API externa después de 3 fallos consecutivos
- [ ] Saga compensa correctamente cuando el segundo paso falla

---

## MÓDULO 26: Performance y Optimización

### 🎯 Objetivo
Diagnosticar y resolver problemas de rendimiento en Canvas Apps, Power Automate, Dataverse y reportes Power BI usando herramientas nativas y mejores prácticas de optimización.

### 📖 Conceptos Clave
- **Delegación en Canvas Apps:** la capacidad de una función o fórmula de ejecutarse en el servidor (Dataverse/SharePoint) en lugar del cliente (el navegador del usuario). Las operaciones delegables — `Filter`, `Sort`, `Search` con operadores soportados — se ejecutan en el servidor y solo devuelven los datos necesarios. Las no-delegables — como `Left()`, `Len()`, funciones de texto complejo — se ejecutan en el cliente sobre los registros ya descargados, con el riesgo de trabajar sobre un subconjunto incompleto.
- **Límite de delegación:** número máximo de registros que Power Apps descarga del servidor cuando una fórmula no es delegable. El default es 500, configurable hasta 2000 en Archivo → Configuración → Límite de registros de datos. Si la tabla tiene 50,000 registros y la fórmula no es delegable, el usuario solo verá los primeros 500/2000 — sin ningún aviso en runtime, a menos que el desarrollador haya activado la advertencia en el IDE.
- **Concurrency en Apply to Each:** configuración en Power Automate que procesa los ítems de un bucle en paralelo en lugar de secuencialmente. Se activa en el engranaje del Apply to Each → Concurrency Control → On, con un Degree of Parallelism de 1 a 50. Con 10 ítems que tardan 2s cada uno: secuencial = 20s, concurrente con 10 = 2s. Precaución: puede causar rate-limiting si el sistema destino tiene límites de llamadas por segundo.
- **Batch API de Dataverse:** funcionalidad de la OData API que agrupa múltiples operaciones CRUD en una sola solicitud HTTP usando `$batch`. En lugar de 100 llamadas separadas para crear 100 registros (100 round-trips de red), se envía 1 solicitud con 100 operaciones y se recibe 1 respuesta. Reduce significativamente la latencia en operaciones masivas. En Power Automate se implementa con la acción "Perform a changeset request" en el conector de Dataverse.
- **FetchXML optimizado:** lenguaje de consulta XML de Dataverse que permite hacer joins entre tablas, filtros complejos, agrupaciones y ordenamientos en una sola llamada al servidor. Ejemplo: en lugar de obtener 100 solicitudes y luego 100 llamadas para obtener el nombre del cliente de cada una (N+1 queries), un FetchXML con `<link-entity>` hace el join en el servidor y devuelve solicitud + datos del cliente en 1 llamada. Se genera visualmente con la herramienta FetchXML Builder de XrmToolBox.
- **Indexed columns (columnas con índice):** columnas de tablas de Dataverse marcadas con "Habilitar para búsqueda" en el editor de columnas. Dataverse crea un índice de base de datos para estas columnas, acelerando dramáticamente los filtros y búsquedas sobre ellas. Ejemplo: si la galería de una Canvas App filtra por `sit_numeropedido`, agregar índice a esa columna puede reducir el tiempo de consulta de 8 segundos a 0.3 segundos en tablas con millones de registros.
- **Power BI Import vs DirectQuery:** Import Mode carga los datos en caché comprimida en memoria del modelo de Power BI — las consultas son extremadamente rápidas (milisegundos) pero los datos tienen un lag de hasta la última actualización (mín. 30 min en Power BI Service, o bajo demanda). DirectQuery ejecuta cada interacción del usuario como una consulta en tiempo real al origen de datos — siempre muestra datos actuales pero cada clic puede tardar segundos si la consulta es compleja o el origen es lento.
- **Aggregations en Power BI:** tablas pre-calculadas que contienen sumas, conteos y promedios de las tablas de detalle. Cuando un usuario ve un reporte de totales mensuales, Power BI usa la tabla de Aggregations en lugar de escanear millones de filas de la tabla de detalle — reduciendo el tiempo de respuesta de minutos a fracciones de segundo. Se configuran en el modelo de datos vinculando la tabla de aggregations a la tabla de detalle con la opción "Manage aggregations".
- **Monitor de Canvas App:** herramienta de diagnóstico integrada en Power Apps Studio (Alt+Shift+M o Herramientas → Monitor) que registra en tiempo real todas las llamadas a conectores con sus tiempos de respuesta, códigos HTTP, payloads enviados y recibidos. Permite identificar qué llamada específica causa lentitud: una llamada a Dataverse que tarda 4 segundos en lugar de 0.2 segundos es candidata a optimizar con FetchXML, índice, o delegación.
- **Plugin Trace Log:** registro de todos los mensajes escritos con `ITracingService.Trace()` en los plugins, accesible en D365 → Configuración → Plugin Trace Log. Se puede configurar para registrar solo cuando hay excepción ("Exception Only") o siempre ("All") — en producción se usa "Exception Only" para no impactar rendimiento. Cada entrada muestra la duración del plugin, el stack trace de errores, y todos los mensajes `Trace()` escritos durante la ejecución.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 26.1: Diagnóstico de delegación en Canvas App
1. Habilitar límite de delegación visible: Archivo → Configuración → Próximas características → Mostrar advertencia de delegación
2. Identificar fórmulas con punto amarillo de delegación:
   ```js
   // ❌ No delegable — filtra en cliente (max 2000 registros)
   Filter(Solicitudes, Left(Nombre, 3) = "SOL")
   
   // ✅ Delegable a Dataverse — filtra en servidor
   Filter(Solicitudes, StartsWith(Nombre, "SOL"))
   
   // ❌ No delegable
   Filter(Solicitudes, Len(Nombre) > 10)
   
   // ✅ Delegable
   Filter(Solicitudes, FechaCreacion >= DateAdd(Today(), -30, Days))
   ```

3. Para búsquedas de texto completo sin delegación, usar Search() solo en el campo visible y cargar datos paginados

#### Actividad 26.2: Optimizar App.OnStart con carga paralela
```js
// ❌ Carga secuencial — suman los tiempos
App.OnStart:
    ClearCollect(colClientes, Clients);
    ClearCollect(colProductos, Products);
    ClearCollect(colSolicitudes, Solicitudes);

// ✅ Carga paralela con Concurrent()
App.OnStart:
    Concurrent(
        ClearCollect(colClientes, Filter(Clients, Estado = "Activo")),
        ClearCollect(colProductos, Filter(Products, Disponible = true)),
        Set(varConfig, First(Configuracion))
    )
// Reduce tiempo de carga hasta 70% en apps con múltiples fuentes
```

#### Actividad 26.3: FetchXML optimizado en Power Automate
```xml
<!-- ❌ Múltiples llamadas separadas -->
<!-- Llamada 1: Get solicitud -->
<!-- Llamada 2: Get cliente relacionado -->  
<!-- Llamada 3: Get productos de la solicitud -->

<!-- ✅ Un solo FetchXML con joins -->
<fetch top="50">
  <entity name="sit_solicitud">
    <attribute name="sit_nombre"/>
    <attribute name="sit_estado"/>
    <attribute name="sit_total"/>
    <link-entity name="account" from="accountid" to="sit_clienteid" alias="cliente">
      <attribute name="name"/>
      <attribute name="emailaddress1"/>
    </link-entity>
    <link-entity name="sit_solicitudproducto" from="sit_solicitudid" 
                 to="sit_solicitudid" link-type="outer" alias="prod">
      <attribute name="sit_cantidad"/>
      <attribute name="sit_precio"/>
    </link-entity>
    <filter>
      <condition attribute="sit_estado" operator="eq" value="1"/>
      <condition attribute="createdon" operator="last-x-days" value="30"/>
    </filter>
  </entity>
</fetch>
```

#### Actividad 26.4: Apply to Each con concurrencia
```
// En Power Automate → Apply to Each → Settings (engranaje) → Concurrency Control
// Activar: On
// Degree of Parallelism: 10 (ajustar según API limits del sistema destino)

// Reducción típica: 100 items × 2s cada uno = 200s secuencial → 20s con concurrencia 10
```

#### Actividad 26.5: Power BI — Import vs DirectQuery
```
Criterios de selección:
  Dataset < 1GB y se actualiza máx cada 30 min → Import Mode (más rápido)
  Dataset en tiempo real o > 10GB → DirectQuery
  Dataset grande pero reportes sobre totales → Aggregations sobre Import
  
Optimizaciones Import:
  - Eliminar columnas no usadas antes de cargar
  - Aplicar filtros en Power Query (reduce filas cargadas)
  - Usar tipos de datos correctos (Text vs Int — Int ocupa menos)
  
Power Query M para filtrar en origen (server-side):
```
```m
let
    Origen = Sql.Database("servidor", "BaseDatos"),
    Tabla = Origen{[Schema="dbo",Item="Ventas"]}[Data],
    // Este filtro se ejecuta en SQL Server, no en Power BI
    FiltroFecha = Table.SelectRows(Tabla, each [FechaVenta] >= #date(2024,1,1)),
    QuitarColumnas = Table.RemoveColumns(FiltroFecha, {"ColInterna1", "ColInterna2"})
in
    QuitarColumnas
```

### 💼 Caso Real de Negocio
**Empresa:** Retailer con Canvas App de 15 pantallas para 500 vendedores  
**Problema:** La app tardaba 45 segundos en cargar. Los vendedores la abandonaban antes de que cargara.  
**Solución:** App.OnStart con Concurrent() reducido de 8 tablas a 3 esenciales. Named Formulas lazy-load. Paginación en lugar de ClearCollect de todos los registros. Imágenes de productos optimizadas a WebP.  
**Resultado:** Tiempo de carga: de 45s a 6s. Adopción de la app: de 60% a 92%.

### ✅ Buenas Prácticas
- Usar Monitor (Alt+Shift+M en Canvas App) para medir tiempos de cada llamada
- Paginación > ClearCollect de toda la tabla para datos > 1000 registros
- Nunca hacer ClearCollect dentro de Gallery.Items — se ejecuta en cada render
- En Dataverse: agregar índice de búsqueda a columnas usadas frecuentemente en filtros
- En Power BI: aplicar filtros en Power Query (source-side) antes de cargar al modelo — las filas eliminadas en el origen nunca ocupan memoria
- Usar Named Formulas en Canvas Apps para cálculos derivados — se evalúan una sola vez y se memorizan

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Canvas App muestra solo 500 registros en el gallery | Función `Filter` con operador no delegable (e.g., `Left()`) | Reemplazar con operadores delegables: `StartsWith()`, comparaciones de fecha, campos de lookup |
| `Concurrent()` causa errores de escritura simultánea en colecciones | Dos ramas de `Concurrent()` modifican la misma variable `colDatos` | No compartir colecciones entre ramas de `Concurrent()` — cada rama debe escribir en su propia colección |
| Power Automate tarda horas en procesar 1,000 registros | Apply to Each sin concurrencia — procesa 1 a la vez | Activar Concurrency Control en el Apply to Each con Degree of Parallelism 10–20 |
| Plugin tarda 30+ segundos y causa timeout | `RetrieveMultiple` sin `TopCount` ni índice en la columna de filtro | Agregar `query.TopCount = 1` y habilitar índice en la columna filtrada en Dataverse |
| Power BI DirectQuery lento en reportes de totales | Cada interacción ejecuta una consulta full-scan en la tabla de origen | Cambiar a Import Mode con actualización programada, o crear tabla de Aggregations |
| App.OnStart carga lento aunque usa Concurrent() | `Concurrent()` tiene una rama que espera a otra (dependencia de datos) | Verificar que las ramas son verdaderamente independientes — ninguna usa datos de la otra rama |

### 🧪 Criterios de Validación
- [ ] Al menos 2 fórmulas no-delegables identificadas y corregidas en la app del proyecto
- [ ] App.OnStart usa Concurrent() para cargas independientes
- [ ] FetchXML con join reemplaza 3 llamadas separadas con el mismo resultado
- [ ] Power BI report con > 1M filas usa Import Mode con filtro en Power Query

---

## MÓDULO 27: PCF Avanzado con TypeScript y React

!!! tip "Prerequisito de Lenguaje"
    Este módulo requiere conocimientos sólidos de **TypeScript**: tipos, interfaces, genéricos, clases, módulos ES6, async/await y JSX/TSX básico. Consulta el [Anexo de Lenguajes de Programación](../Anexos/LENGUAJES_PROGRAMACION.md) — sección TypeScript — antes de continuar.

### 🎯 Objetivo
Desarrollar controles PCF avanzados: Dataset controls que reemplazan subgrids, controles con Web API para operaciones CRUD, uso de Fluent UI para consistencia visual, y publicación de PCF en soluciones managed.

### 📖 Conceptos Clave
- **Dataset PCF:** tipo de control PCF que recibe como propiedad de entrada una colección de registros de Dataverse (un Dataset), en lugar de un único valor. Se usa para reemplazar subgrids nativas con tablas totalmente personalizadas: preview inline, columnas calculadas, botones de acción por fila, colores condicionales, y drag-and-drop. Se declara en el manifest con `<data-set name="nombreDataset">` y en tiempo de ejecución el host gestiona automáticamente la carga de páginas y columnas configuradas.
- **`context.webAPI`:** objeto disponible en el contexto del PCF que expone la WebAPI de Dataverse para operaciones CRUD directamente desde el componente. Métodos: `context.webAPI.createRecord(entityName, data)`, `retrieveRecord(entityName, id, options)`, `updateRecord(entityName, id, data)`, `deleteRecord(entityName, id)`. A diferencia de una Canvas App, estas llamadas se autentican automáticamente con la sesión del usuario — no se requiere gestión de tokens.
- **`context.navigation`:** objeto del contexto que permite navegar desde el PCF a registros de Dataverse o URLs externas. `context.navigation.openForm({ entityName, entityId })` abre el formulario del registro en el panel lateral o en una nueva ventana. `context.navigation.openUrl(url)` abre una URL externa. Esencial para que los enlaces en una tabla PCF funcionen igual que los links nativos de D365.
- **`context.utils`:** objeto con utilidades de la plataforma disponibles en el PCF: `context.utils.openConfirmDialog(title, options)` muestra un diálogo de confirmación nativo, `context.utils.openErrorDialog(options)` muestra errores con el estilo de D365, `context.utils.openLookupDialog(options)` abre el selector de registros nativo para campos lookup. Usar estas utilidades en lugar de alerts y dialogs HTML propios mantiene la coherencia visual.
- **Fluent UI React:** librería de componentes de interfaz de Microsoft (`@fluentui/react` o la nueva `@fluentui/react-components`) que implementa el sistema de diseño de Microsoft 365 y Dynamics 365. Componentes clave para PCF: `DetailsList` (tabla con sorting y selección), `CommandBar` (barra de acciones), `Dialog` (diálogos modales), `Spinner` (indicador de carga), `TooltipHost` (tooltips), `Stack` (layout flex). Usar Fluent UI garantiza que el PCF se vea idéntico al resto de D365.
- **Virtual PCF (React):** tipo de PCF que usa el React ya cargado en el host (Model-Driven App, Canvas App) en lugar de empaquetar su propio React dentro del bundle. Se declara con `control-type="virtual"` en el manifest y la clase exporta `ComponentFramework.ReactControl` en lugar de `ComponentFramework.StandardControl`. El bundle resultante es 70-80% más pequeño porque no incluye React (≈40KB comprimido). Recomendado siempre que el control sea para D365/Canvas Apps modernas.
- **Custom hook `useDataverse`:** patrón de React para encapsular las llamadas a `context.webAPI` en un hook reutilizable que maneja el estado de carga, los errores, y la invalidación del caché. Ejemplo: `const { records, loading, error, refresh } = useDataverseQuery(context.webAPI, 'sit_tarea', filter)`. Separa la lógica de datos del componente de UI y facilita el testing unitario de la lógica de acceso a datos.
- **Control Manifest (ControlManifest.Input.xml):** archivo XML que define el contrato del PCF: namespace, nombre, versión, descripción, propiedades de entrada (`<property>`), propiedades de dataset (`<data-set>`), recursos JS/CSS, y los feature-usage requeridos (webAPI, navigation, etc.). Las propiedades declaradas en el manifest se mapean a los parámetros en Power Apps Studio — el desarrollador de la app ve exactamente qué propiedades configurar en el formulario.
- **`pac pcf version`:** comando del pac CLI que actualiza la versión en el ControlManifest.Input.xml. Es necesario incrementar la versión antes de publicar cambios para que Dataverse detecte que el control fue actualizado y lo distribuya a los usuarios — de lo contrario, los navegadores sirven la versión en caché. Convención semántica: incrementar patch para bugfixes (`1.0.1`), minor para features nuevas (`1.1.0`), major para cambios breaking (`2.0.0`).

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 27.1: Dataset PCF — Tabla de tareas personalizada
```bash
pac pcf init --namespace SITControls --name TareasDatasetControl --template dataset --framework react
npm install @fluentui/react @fluentui/react-icons
```

```typescript
// index.tsx — Dataset control con Fluent UI
import * as React from 'react';
import { DetailsList, IColumn, SelectionMode, CommandBar } from '@fluentui/react';
import { IInputs, IOutputs } from './generated/ManifestTypes';

interface TareasControlProps {
    dataset: ComponentFramework.PropertyTypes.DataSet;
    navigate: (entityRef: ComponentFramework.EntityReference) => void;
    webAPI: ComponentFramework.WebApi;
}

const TareasControl: React.FC<TareasControlProps> = ({ dataset, navigate, webAPI }) => {
    const [items, setItems] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!dataset.loading) {
            const rows = dataset.sortedRecordIds.map(id => {
                const record = dataset.records[id];
                return {
                    id: record.getRecordId(),
                    titulo: record.getValue('sit_titulo') as string,
                    estado: record.getFormattedValue('sit_estado'),
                    asignado: record.getFormattedValue('_sit_asignado_value'),
                    fechaVencimiento: record.getFormattedValue('sit_fechavencimiento'),
                    entityRef: record.getNamedReference()
                };
            });
            setItems(rows);
            setIsLoading(false);
        }
    }, [dataset]);

    const columns: IColumn[] = [
        {
            key: 'titulo', name: 'Tarea', fieldName: 'titulo', minWidth: 200,
            onRender: (item) => (
                <span
                    style={{ cursor: 'pointer', color: '#0078d4', textDecoration: 'underline' }}
                    onClick={() => navigate(item.entityRef)}
                >
                    {item.titulo}
                </span>
            )
        },
        { key: 'estado', name: 'Estado', fieldName: 'estado', minWidth: 100 },
        { key: 'asignado', name: 'Asignado a', fieldName: 'asignado', minWidth: 150 },
        { key: 'fechaVencimiento', name: 'Vencimiento', fieldName: 'fechaVencimiento', minWidth: 100 },
        {
            key: 'acciones', name: '', minWidth: 80,
            onRender: (item) => (
                <button
                    style={{ backgroundColor: '#107C10', color: 'white', border: 'none', 
                             padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => completarTarea(item.id)}
                >
                    ✓ Completar
                </button>
            )
        }
    ];

    const completarTarea = async (id: string) => {
        try {
            await webAPI.updateRecord('sit_tarea', id, {
                sit_estado: { Value: 100000003 } // Completada
            });
            dataset.refresh();
        } catch (error) {
            console.error('Error completando tarea:', error);
        }
    };

    return (
        <DetailsList
            items={items}
            columns={columns}
            selectionMode={SelectionMode.none}
            isLoading={isLoading}
        />
    );
};

export class TareasDatasetControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(TareasControl, {
            dataset: context.parameters.tareas,
            navigate: context.navigation.openForm,
            webAPI: context.webAPI
        });
    }

    public getOutputs(): IOutputs { return {}; }
    public destroy(): void { }
}
```

#### Actividad 27.2: Actualizar manifest para Dataset PCF
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
  <control namespace="SITControls" constructor="TareasDatasetControl"
           version="1.0.0" display-name-key="Tareas Dataset Control"
           control-type="virtual">
    
    <data-set name="tareas" display-name-key="Tareas">
      <!-- Las columnas que el PCF usará desde el dataset -->
      <property-set name="titulo" display-name-key="Título" 
                    of-type="SingleLine.Text" usage="bound" required="true" />
      <property-set name="estado" display-name-key="Estado" 
                    of-type="OptionSet" usage="bound" required="true" />
    </data-set>
    
    <resources>
      <code path="index.ts" order="1" />
    </resources>
  </control>
</manifest>
```

#### Actividad 27.3: Publicar en solución y agregar a formulario
```bash
npm run build -- --buildMode production
pac pcf push --publisher-prefix sit
```
1. En la solución → Agregar existente → Componente de control personalizado
2. En formulario de Proyecto → Subgrid de Tareas → Agregar componente → `TareasDatasetControl`
3. Configurar propiedad: tareas → columnas: sit_titulo, sit_estado, _sit_asignado_value

### 💼 Caso Real de Negocio
**Empresa:** Firma de abogados con gestión de expedientes en Dataverse  
**Problema:** La subgrid nativa de documentos del expediente no permitía preview, tags ni acciones masivas. Cada acción requería abrir el registro individualmente.  
**Solución:** PCF Dataset Control con preview inline de PDFs, tags coloridos por categoría, y botón de "Firmar documento" que llama a Azure Functions. Fluent UI para que se vea nativo de D365.  
**Resultado:** Tiempo de revisión de expediente: de 8 minutos a 2 minutos. Satisfacción de abogados: 4.7/5.

### ✅ Buenas Prácticas
- Siempre usar Virtual PCF (React) — menor bundle, mejor rendimiento
- `dataset.refresh()` después de cualquier operación de escritura — mantiene la lista sincronizada
- Limitar llamadas a `webAPI` — no hacer CRUD en cada render, solo en acciones del usuario
- Versionar el PCF semánticamente y actualizar la versión antes de cada push a producción
- Probar el PCF en el test harness local (`npm start`) antes de hacer `pac pcf push` — el ciclo de feedback local es segundos vs minutos en Dataverse
- Mantener el PCF enfocado en una responsabilidad: un control que muestra datos, no uno que también gestiona configuraciones — el Single Responsibility Principle aplica a controles PCF

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| PCF muestra contenido vacío después de `pac pcf push` | La versión en el manifest no fue incrementada — el navegador sirve la versión anterior en caché | Incrementar `version` en ControlManifest.Input.xml, hacer push, y forzar recarga con Ctrl+Shift+R |
| `dataset.records[id]` lanza "Cannot read property of undefined" | Se accede a `dataset.records` antes de que termine la carga asíncrona del dataset | Verificar `!dataset.loading` antes de iterar `dataset.sortedRecordIds` |
| `context.webAPI.updateRecord` no actualiza la UI | Se llama `updateRecord` pero no se llama `dataset.refresh()` después | Siempre llamar `context.parameters.nombreDataset.refresh()` después de cualquier operación de escritura exitosa |
| Fluent UI DetailsList no renderiza en Canvas App | Canvas Apps no incluyen el mismo Fluent UI v8 — conflicto de versiones | Para Canvas Apps usar controles más simples o verificar compatibilidad de versión; en Model-Driven Apps no hay este problema |
| PCF no aparece en la lista de componentes del formulario | El assembly del PCF fue registrado en DEV pero no está en la solución exportada | Agregar el PCF a la solución antes del export: Solución → Agregar existente → Componente de control personalizado |

### 🧪 Criterios de Validación
- [ ] PCF Dataset Control renderiza la lista de tareas con datos reales de Dataverse
- [ ] Clic en el nombre navega al registro de la tarea
- [ ] Botón "Completar" actualiza el estado en Dataverse y refresca la lista
- [ ] Control usa Fluent UI y se ve coherente con el resto de D365
- [ ] PCF publicado en solución managed e importado en TEST sin errores

---

## MÓDULO 28: Code Apps con React y TypeScript

### 🎯 Objetivo
Construir aplicaciones web completas (React + TypeScript + Vite) que corren dentro de Power Platform, con acceso nativo y tipado a conectores y Dataverse, control total del UI, y despliegue como soluciones administradas mediante el pipeline de ALM.

### 📖 Conceptos Clave
- **Code Apps vs Canvas Apps vs PCF:** tres paradigmas de desarrollo en Power Platform con distintos trade-offs. Code Apps son aplicaciones web standalone completas construidas con React + TypeScript — control total del UI, acceso al ecosistema npm, pero requieren habilidades de desarrollo web. Canvas Apps son aplicaciones low-code con Power Fx — accesibles para desarrolladores ciudadanos, soporte mobile nativo, pero limitadas en patrones de UI complejos. PCF son componentes individuales embebidos en formularios de D365 o Canvas Apps — no son apps completas, sino controles que aumentan las capacidades de una pantalla existente.
- **`@microsoft/power-apps` SDK (Power Apps CLI SDK):** librería cliente generada por el CLI que provee la infraestructura de la Code App: autenticación automática con Entra ID usando el contexto del usuario que abrió la app, gestión del ciclo de vida de la aplicación dentro de la plataforma, y la integración con los servicios generados en `/generated/`. No se instala manualmente — se incluye en el scaffold y se actualiza con `pac code add-data-source`.
- **Vite + React 18 + TypeScript 5:** stack tecnológico base de una Code App — exactamente el mismo que cualquier aplicación web moderna. Vite es el build tool con Hot Module Replacement ultrarrápido en desarrollo. React 18 provee el renderizado con Concurrent Mode y Suspense. TypeScript 5 garantiza tipado estricto de extremo a extremo desde los modelos generados de Dataverse hasta los componentes de la UI. Todo el ecosistema npm es accesible: D3.js, recharts, react-table, tanstack-query, zod, etc.
- **Data sources tipados (pac code add-data-source):** comando del pac CLI que conecta la Code App a una tabla de Dataverse o a un conector de Power Platform y genera automáticamente en `/generated/`: una interfaz TypeScript con todos los campos de la tabla (`SitSolicitudtiModel.ts`), y un servicio de acceso a datos con los métodos CRUD tipados (`SitSolicitudtiService.ts`). Los métodos del servicio — `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` — gestionan internamente la autenticación, el formato OData, y el manejo de errores.
- **Carpeta `/generated/`:** directorio dentro de `src/` que contiene todos los modelos TypeScript e interfaces de servicio generados automáticamente por el CLI. Contiene `services/` (una clase de servicio por tabla/conector) y `models/` (una interfaz TypeScript por tabla). Esta carpeta se sobreescribe completamente con cada `pac code add-data-source` — cualquier modificación manual se perderá. Si se necesita lógica adicional, crear clases wrapper que importen desde `/generated/` sin modificarlos.
- **Connection References:** componente de solución de Power Platform que representa una referencia a una conexión (Dataverse, Office 365, SQL Server, etc.) desacoplada del entorno específico. Cuando la Code App se empaqueta en una solución y se importa en un entorno diferente (TEST, PROD), el asistente de importación solicita mapear cada Connection Reference a una conexión existente en ese entorno. Esto permite que la solución sea portable entre entornos sin hardcodear URLs o credenciales.
- **Managed Platform benefits (beneficios de la plataforma gestionada):** al desplegar una Code App dentro de Power Platform, hereda automáticamente toda la gobernanza de la plataforma sin código adicional: DLP Policies (las políticas de prevención de pérdida de datos del admin bloquean conectores no autorizados), Conditional Access de Entra ID (MFA, acceso desde IPs corporativas), auditoría de acceso (quién abrió la app y cuándo), y Sharing Controls (el admin puede limitar con quién se puede compartir la app). Esto es una ventaja significativa sobre una SPA desplegada externamente.
- **Limitaciones actuales de Code Apps (Preview):** a la fecha de este módulo, las Code Apps no soportan: Power Apps Mobile (para usuarios móviles se debe usar Canvas App con los mismos datos Dataverse), SharePoint Forms integration (no pueden reemplazar formularios de listas de SharePoint), Power Platform Git Integration (el versionado se gestiona con el repositorio de la app, no con el ALM nativo de Power Platform), ni embedded Power BI reports. Estas limitaciones son propias del estado Preview de la funcionalidad y pueden cambiar en futuras versiones.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 28.1: Scaffolding y primera Code App

1. Verificar prerequisitos instalados:

    ```bash
    node -v          # LTS v20+
    pac --version    # PAC CLI actualizado
    ```

2. Habilitar Code Apps en el entorno:
    - Power Platform Admin Center → Manage → Environments → seleccionar entorno
    - Settings → Product → Features → activar toggle **"Enable code apps"** → Save

3. Crear scaffolding con template oficial:

    ```bash
    npx degit github:microsoft/PowerAppsCodeApps/templates/vite mi-primera-code-app
    cd mi-primera-code-app
    npm install
    ```

4. Revisar estructura del proyecto generado:

    ```
    mi-primera-code-app/
    ├── src/
    │   ├── App.tsx          # Componente raíz
    │   ├── main.tsx         # Entry point
    │   └── generated/       # Servicios auto-generados — NO editar
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
    ```

5. Ejecutar en modo desarrollo local:

    ```bash
    npm run dev
    # Abre http://localhost:5173
    ```

#### Actividad 28.2: Conectar a Dataverse

1. Autenticar PAC CLI con el entorno de desarrollo:

    ```bash
    pac auth create --environment https://tuorg.crm.dynamics.com
    ```

2. Agregar tabla Dataverse como data source:

    ```bash
    pac code add-data-source -a dataverse -t sit_solicitudti
    ```

    El CLI genera automáticamente:

    ```
    src/generated/
    ├── services/
    │   └── SitSolicitudtiService.ts   # CRUD tipado completo
    └── models/
        └── SitSolicitudtiModel.ts     # Interfaz TypeScript de la tabla
    ```

3. Consumir el servicio en un componente React:

    ```tsx
    import { SitSolicitudtiService } from './generated/services/SitSolicitudtiService';
    import { SitSolicitudti } from './generated/models/SitSolicitudtiModel';

    const App: React.FC = () => {
      const [solicitudes, setSolicitudes] = React.useState<SitSolicitudti[]>([]);

      React.useEffect(() => {
        SitSolicitudtiService.getAll().then(setSolicitudes);
      }, []);

      return (
        <ul>
          {solicitudes.map(s => (
            <li key={s.sit_solicitudtiid}>{s.sit_titulo}</li>
          ))}
        </ul>
      );
    };
    ```

#### Actividad 28.3: CRUD completo con Fluent UI

1. Instalar Fluent UI React Components:

    ```bash
    npm install @fluentui/react-components
    ```

2. Construir un DataGrid con acciones de edición y eliminación:

    ```tsx
    import {
      DataGrid, DataGridBody, DataGridRow, DataGridCell,
      DataGridHeader, DataGridHeaderCell, Button, createTableColumn
    } from '@fluentui/react-components';

    const columns = [
      createTableColumn<SitSolicitudti>({
        columnId: 'titulo',
        renderHeaderCell: () => 'Título',
        renderCell: (item) => item.sit_titulo,
      }),
      createTableColumn<SitSolicitudti>({
        columnId: 'estado',
        renderHeaderCell: () => 'Estado',
        renderCell: (item) => item.sit_estado_label ?? '—',
      }),
      createTableColumn<SitSolicitudti>({
        columnId: 'acciones',
        renderHeaderCell: () => '',
        renderCell: (item) => (
          <Button appearance="subtle"
            onClick={() => SitSolicitudtiService.delete(item.sit_solicitudtiid!)}>
            Eliminar
          </Button>
        ),
      }),
    ];
    ```

3. Implementar formulario de creación con validación:

    ```tsx
    const handleCreate = async (data: Partial<SitSolicitudti>) => {
      await SitSolicitudtiService.create({
        sit_titulo: data.sit_titulo!,
        sit_descripcion: data.sit_descripcion,
        sit_categoria: data.sit_categoria ?? 1,
        sit_prioridad: data.sit_prioridad ?? 2,
      });
      SitSolicitudtiService.getAll().then(setSolicitudes);
    };
    ```

#### Actividad 28.4: Despliegue y ALM

1. Publicar la Code App al entorno DEV:

    ```bash
    pac code push
    ```

    La app aparece en make.powerapps.com → Apps.

2. Agregar a una solución para ALM:

    ```bash
    pac solution add-reference --path .
    pac solution pack --folder SolutionSrc --zipfile SolicitudesTI_v1.0.zip --packagetype Managed
    ```

3. Importar en entorno TEST y validar Connection References:
    - Al importar, el asistente pedirá mapear la conexión de Dataverse al entorno TEST
    - Confirmar que los datos cargados corresponden al entorno correcto

4. Verificar comportamiento de permisos (DLP):
    - En Admin Center, crear una DLP policy que bloquee el conector de Dataverse en el entorno TEST
    - Comprobar que la app lanza el mensaje de DLP sin necesitar código adicional

### 💼 Caso Real de Negocio

**Empresa**: Firma de consultoría con 200 consultores distribuidos

**Problema**: El portal de gestión de proyectos en Canvas App no soporta los patrones de UI requeridos — tablero Kanban con drag-and-drop, gráficos de utilización interactivos y tabla de timesheet con edición masiva inline. Construir cada uno como PCF Component separado tomaría 3 meses; una Code App resuelve todo en 3 semanas.

**Solución implementada**:

- Code App React conectada a Dataverse (tablas: `sit_proyecto`, `sit_consultor`, `sit_timesheet`)
- Kanban de proyectos con `react-beautiful-dnd` — drag-and-drop actualiza el estado en Dataverse
- Gráficos de utilización con `recharts` conectados a datos reales en tiempo real
- Tabla de timesheet con edición inline masiva usando Fluent UI DataGrid
- Autenticación Entra ID gestionada por la plataforma — cero código de auth
- Desplegada como solución Managed en producción con pipeline CI/CD Azure DevOps

**Resultado**:

- 40% menos tiempo de desarrollo vs PCF Components individuales
- Control total de layout y CSS — imposible con Canvas Apps
- Acceso al ecosistema npm completo (D3, recharts, react-table, etc.)
- Misma gobernanza que Canvas Apps: DLP, Conditional Access, auditoría

### ✅ Buenas Prácticas
- Nunca editar archivos en `/generated/` — son regenerados con cada `pac code add-data-source` y los cambios se perderían
- Usar Fluent UI React Components (`@fluentui/react-components`) para mantener coherencia visual con el ecosistema Microsoft 365
- Separar la lógica de negocio en servicios propios que importan desde `/generated/` — no poner lógica directamente en componentes React
- Agregar data sources siempre con `pac code add-data-source` en lugar de llamadas directas a la WebAPI — los servicios generados ya gestionan auth y tipado
- Incluir la Code App en una Solución desde el primer día — facilita el ALM y evita migraciones manuales posteriores
- Probar localmente con `npm run dev` antes de cada `pac code push` para reducir el ciclo de feedback

### ⚠️ Errores Comunes
- **Error**: Editar manualmente `src/generated/` — archivos sobreescritos en el siguiente `pac code add-data-source`
  - **Solución**: Crear wrappers propios que importen desde `/generated/` sin modificarlos
- **Error**: Esperar que la Code App funcione en Power Apps Mobile
  - **Solución**: Code Apps no soportan mobile; para usuarios móviles usar Canvas App con los mismos datos Dataverse
- **Error**: Usar `fetch`/`axios` para llamar a Dataverse WebAPI directamente
  - **Solución**: Usar los servicios generados por el CLI — ya gestionan autenticación, tipado y rate limits
- **Error**: Olvidar habilitar Code Apps en el entorno antes de `pac code push`
  - **Solución**: Verificar Admin Center → Settings → Features → Enable code apps
- **Error**: Importar la app suelta entre ambientes sin empaquetar en solución
  - **Solución**: Siempre usar `pac solution pack` con `--packagetype Managed` para ALM correcto

### 🧪 Criterios de Validación
- [ ] Code App creada con template oficial, ejecuta en local con `npm run dev` sin errores
- [ ] Al menos una tabla Dataverse conectada via `pac code add-data-source` con servicios generados tipados
- [ ] CRUD completo (listar, crear, editar, eliminar) implementado usando los servicios de `/generated/`
- [ ] UI construida con Fluent UI React — al menos DataGrid y formulario de creación funcionales
- [ ] App publicada en entorno DEV con `pac code push` y visible en make.powerapps.com
- [ ] App empaquetada en Solución Managed e importada en entorno TEST con Connection References correctas
- [ ] Puedes explicar con ejemplos concretos cuándo elegir Code App vs Canvas App vs PCF Component

---

## MÓDULO 29: Power Pages Avanzado y Azure AD B2C

### 🎯 Objetivo
Implementar portales externos con autenticación multitenant usando Azure AD B2C para clientes externos, flujos de registro personalizado, integración con APIs externas vía Web API del portal, y optimización de SEO y rendimiento.

### 📖 Conceptos Clave
- **Azure AD B2C:** servicio de identidad de Microsoft Azure para gestionar usuarios externos al tenant corporativo (clientes, proveedores, ciudadanos). Permite que usuarios con cualquier email (no solo cuentas Microsoft corporativas) se registren, inicien sesión, recuperen contraseñas y gestionen su perfil. El tenant de B2C es completamente separado del Azure AD corporativo y tiene su propio portal de administración (`portal.azure.com` → Cambiar directorio → el tenant B2C).
- **User Flows:** flujos de autenticación configurables por interfaz gráfica en B2C para los escenarios más comunes. Tipos disponibles: Sign up and sign in (registro + inicio de sesión combinados), Sign in (solo login para usuarios ya registrados), Password reset (recuperación de contraseña por email), Profile editing (el usuario actualiza su nombre, teléfono, etc.). Cada User Flow configura qué atributos se recopilan en el registro, qué claims se incluyen en el token JWT devuelto, y si se requiere MFA.
- **Custom Policies (IEF — Identity Experience Framework):** sistema de políticas XML avanzadas de B2C para implementar flujos de autenticación que los User Flows no soportan: federar con identity providers externos (SAML 2.0, otros OAuth), lógica condicional (MFA solo para transacciones de alto valor), transformaciones de claims personalizadas (combinar firstName + lastName en displayName), e integración con APIs REST propias para enriquecer el perfil del usuario durante el login. La curva de aprendizaje es alta — el "starter pack" de IEF de Microsoft es el punto de partida.
- **Identity Experience Framework (IEF):** el motor de ejecución de Custom Policies en B2C. Procesa las políticas XML secuencialmente, ejecutando Technical Profiles (unidades de configuración) para: obtener claims de fuentes externas, transformar claims, mostrar páginas de UI al usuario, y emitir tokens. Conceptos clave de IEF: TrustFrameworkBase.xml (base común), TrustFrameworkLocalization.xml (traducciones), TrustFrameworkExtensions.xml (personalizaciones), y SignUpOrSignin.xml (la política raíz que se invoca).
- **Liquid Cache:** mecanismo de caché de Power Pages para objetos consultados con Liquid que se acceden repetidamente en la misma página. La sintaxis `{% cache 'nombre-cache' timeout:3600 %}...{% endcache %}` almacena el resultado de una consulta Liquid durante 3600 segundos (1 hora). Útil para consultas de catálogos o datos que cambian poco: categorías de productos, países, configuraciones del portal — evita consultar Dataverse en cada request.
- **Power Pages Web Templates:** componentes de Liquid reutilizables que se incluyen en múltiples páginas del portal con `{% include 'Nombre Template' %}`. Permiten separar el header, footer, navegación lateral, banners, y layouts comunes en plantillas independientes. Se crean en Portal Management → Web Templates. Equivalente a los componentes de una aplicación web — evita duplicar HTML y Liquid en decenas de páginas.
- **Sitemap (estructura de navegación):** jerarquía de páginas, web links y shortcuts que define la estructura del portal en Power Pages. Cada página del portal tiene una entrada en el sitemap con su URL, título, visibilidad (visible en menú o no), y permisos de acceso por Web Role. La estructura del sitemap determina las URLs del portal (`/inicio`, `/mis-casos`, `/perfil`) y el árbol de navegación que aparece en el menú.
- **Web File:** tipo de componente del portal para almacenar archivos estáticos como CSS personalizados, JavaScript adicional, imágenes, PDFs descargables, y fuentes. Los Web Files se almacenan en Dataverse y son accesibles vía URL pública del portal. Se gestionan en Portal Management → Web Files. Se referencian desde plantillas Liquid con la URL completa o con la función `{{ site.url }}/WebFiles/nombre-archivo.css`.
- **User Flows vs Custom Policies (IEF):** User Flows son el camino preferido cuando el escenario es estándar — registro con email, login con Google/Facebook, reset de contraseña. Son configurables por GUI, sin XML, y Microsoft los mantiene actualizados. Custom Policies son necesarias cuando: se requiere federar con un SAML 2.0 antiguo, enriquecer el perfil consultando una API interna durante el login, implementar MFA condicional según el nivel de riesgo, o combinar múltiples identity providers con lógica de selección.
- **Claims Mapping B2C → Contact:** proceso de vincular el usuario autenticado en B2C con su registro Contact en Dataverse. Al completar el login exitoso en Power Pages, el portal recibe el token JWT de B2C con los claims configurados (email, displayName, objectId). Power Pages busca automáticamente un Contact con el email coincidente. Si existe, lo vincula mediante el registro `externalidentity` con el `objectId` de B2C como clave. Si no existe, crea un Contact nuevo con los claims del token — el mapeo de claims a campos del Contact se configura en la configuración del identity provider del portal.
- **Portal Web API con CSRF:** la Web API JavaScript del portal para operaciones CRUD sobre Dataverse requiere el header `__RequestVerificationToken` en todas las operaciones de escritura (POST, PATCH, DELETE) como protección contra ataques CSRF (Cross-Site Request Forgery). El token se obtiene del input hidden que Power Pages genera en todas las páginas: `$('input[name="__RequestVerificationToken"]').val()`. Sin este token, las peticiones de escritura devuelven HTTP 403.
- **SEO en Power Pages con Liquid:** optimización de motores de búsqueda implementada mediante: meta-tags dinámicos en el `<head>` usando Liquid (`<title>{{ page.title }} — Empresa</title>`, `<meta name="description" content="{{ page.description }}">`), sitemap.xml automático accesible en `/sitemap.xml`, URLs amigables configuradas en el Page slug (sin parámetros de query), y etiquetas Open Graph para compartir en redes sociales (`og:title`, `og:description`, `og:image`). Configurable en la configuración de cada página del portal y mediante Web Templates de layout.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 28.1: Configurar Azure AD B2C
1. Azure Portal → Crear recurso → Azure AD B2C
2. Crear nuevo tenant B2C: `sitconsultingb2c.onmicrosoft.com`
3. User Flows → Nuevo flujo → Sign up and sign in
    - Método: Email
    - Atributos a recopilar: Nombre, Apellido, País
    - Claims a retornar: Email, Nombre completo, ObjectId

4. App Registrations en B2C:
    - Nombre: `Power Pages Portal`
    - Redirect URI: `https://clientes-sit.powerappsportals.com/signin-oidc`
    - Permisos: `openid`, `offline_access`

#### Actividad 28.2: Conectar B2C con Power Pages
1. Power Pages Studio → Set up → Identity providers → Azure AD B2C
2. Configurar:
    - Authority: `https://sitconsultingb2c.b2clogin.com/sitconsultingb2c.onmicrosoft.com/B2C_1_SignUpSignIn`
    - Client ID: (de App Registration en B2C)
    - Client Secret
    - Redirect URI: confirmar que coincide

3. Personalizar la experiencia de registro con Liquid en la página de perfil:
   ```liquid
   {% if user %}
     {% assign contact = entities.contact[user.contact.id] %}
     
     {% if contact.sit_onboarding_completo != true %}
       <!-- Mostrar formulario de bienvenida para usuarios nuevos -->
       <div class="onboarding-wizard">
         <h2>Bienvenido {{ user.fullname }}, completa tu perfil</h2>
         <!-- Entity Form de onboarding -->
       </div>
     {% else %}
       <!-- Dashboard normal -->
     {% endif %}
   {% endif %}
   ```

#### Actividad 28.3: Web Template reutilizable
1. Portal Management → Web Templates → Nuevo
2. Nombre: `Layout Base Portal`
3. Contenido:
   ```liquid
   <!DOCTYPE html>
   <html lang="es">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>{{ page.title }} — Portal Clientes SIT</title>
     <meta name="description" content="{{ page.description }}">
     {% include 'Estilos Corporativos' %}
   </head>
   <body>
     {% include 'Header Portal' %}
     
     <main class="container-fluid py-4">
       <div class="row">
         {% if user %}
         <div class="col-md-3">
           {% include 'Navegación Lateral' %}
         </div>
         <div class="col-md-9">
           {{ content }}
         </div>
         {% else %}
         <div class="col-12">
           {{ content }}
         </div>
         {% endif %}
       </div>
     </main>
     
     {% include 'Footer Portal' %}
     {% include 'Scripts Base' %}
   </body>
   </html>
   ```

### 💼 Caso Real de Negocio
**Empresa:** SaaS con clientes de 50 países distintos  
**Problema:** Necesitaban portal de autoservicio para clientes externos sin que esos usuarios tuviesen cuentas en el Azure AD corporativo.  
**Solución:** Azure AD B2C para registro/login de clientes externos. Cada cliente solo ve sus propios datos (Table Permissions). Language switcher con Liquid para soporte de ES/EN/PT.  
**Resultado:** Portal con 3,500 usuarios registrados en primer mes. 0 llamadas de soporte para "cómo inicio sesión".

### ✅ Buenas Prácticas
- B2C para usuarios externos, Azure AD para usuarios internos — nunca mezclar en el mismo portal sin MFA diferenciado
- Web Templates reducen la duplicación de Liquid entre páginas
- Habilitar CDN en portales con usuarios globales — mejora latencia significativamente
- Probar el flujo de registro y login completo con un usuario nuevo en cada despliegue — los Identity Providers son los componentes más frágiles tras una actualización del portal
- Usar User Flows de B2C para escenarios estándar (90% de los casos) y reservar Custom Policies solo para requisitos que el User Flow no puede satisfacer — las Custom Policies tienen una curva de mantenimiento significativamente mayor

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Login con B2C redirige a página de error del portal | Redirect URI en la App Registration de B2C no coincide exactamente con la URL del portal | Verificar que el Redirect URI en B2C es `https://[dominio-portal]/signin-oidc` sin barra final |
| Usuario autenticado con B2C no tiene registros en Contact | El email en el token B2C no coincide con ningún Contact existente | Configurar el claim `email` en el User Flow y activar la creación automática de Contact en el portal (Site Setting: `Authentication/Registration/Enabled = true`) |
| Liquid template `{% assign x = entities.sit_caso %}` retorna vacío después de login con B2C | Table Permission para la tabla no está asignado al Web Role del usuario B2C | Verificar que el Web Role `Authenticated Users` (o un rol personalizado) tiene el Table Permission para `sit_caso` |
| Portal con B2C lanza "AADB2C90273" en el login | La URL de respuesta configurada en el portal no coincide con lo registrado en B2C — diferencia de mayúsculas o barra final | Copiar la URL exacta del portal en el campo Redirect URI del App Registration de B2C |
| Custom Policy falla con "UserJourneyNotFound" | El archivo TrustFrameworkBase.xml no fue subido o tiene errores de validación | Subir los archivos en orden: Base → Localization → Extensions → SignUpOrSignin y usar la herramienta de validación del portal B2C |

### 🧪 Criterios de Validación
- [ ] Usuario externo puede registrarse con email via B2C sin cuenta Azure AD corporativa
- [ ] After login, usuario ve solo sus registros (Table Permissions tipo Contact)
- [ ] Web Template base aplicado en todas las páginas del portal
- [ ] Portal carga en < 3 segundos (medir con Lighthouse)

---

## MÓDULO 30: Proyecto Multicapa Nivel 3

### 🎯 Objetivo
Construir una solución enterprise completa integrando todos los conceptos del Nivel 3: arquitectura multi-solución, CI/CD automatizado, D365 Customer Service, Portal para clientes, Copilot Studio con SSO, Plugin C# para lógica de negocio, integración con Azure Service Bus, y PCF Dataset avanzado.

### 📖 Conceptos Clave
Este módulo aplica y consolida todo el Nivel 3 en un proyecto cohesivo. Los conceptos clave son los patrones de integración y de ejecución de proyecto que conectan todos los módulos anteriores:

- **Integration testing de extremo a extremo:** verificación de que todos los componentes del sistema funcionan juntos correctamente en el entorno de prueba. Va más allá de testear cada componente aislado — valida que el evento creado en Power Pages llega al Plugin C#, desencadena el Service Bus, la Azure Function lo procesa, y el Copilot Studio refleja el nuevo estado. Debe ejecutarse con datos reales en un entorno de TEST/UAT antes de cada despliegue a PROD.
- **Dependency management en multi-solution deployments:** gestión del orden de despliegue de soluciones con dependencias entre sí. Si `SIT_CustomerService` depende de `SIT_Foundation`, primero se despliega Foundation y luego CustomerService. El pipeline CD debe definir explícitamente el orden de importación de soluciones y verificar que cada solución importó correctamente antes de continuar con la siguiente. Un error en SIT_Foundation debe bloquear todos los despliegues dependientes.
- **Environment Variable management entre ambientes:** estrategia para gestionar los valores de las Environment Variables que cambian entre entornos (URLs de APIs externas, IDs de configuración, strings de conexión). En DEV apuntan a sistemas de prueba; en PROD apuntan a sistemas reales. Los pipelines CD actualizan estos valores después de importar la solución usando la tarea `PowerPlatformSetEnvironmentVariables` o scripts pac CLI.
- **Blue-Green deployment en Power Platform:** estrategia de despliegue sin downtime donde se mantienen dos entornos de PROD idénticos (Blue y Green). Los usuarios trabajan en Blue mientras se despliega en Green. Una vez verificado Green, se cambia el load balancer para que los usuarios pasen a Green. En Power Platform se aproxima con entornos de PROD primario y PROD failover, aunque la implementación completa requiere gestión de URLs de portal y configuración de DNS.
- **Rollback plan:** plan documentado y probado para revertir un despliegue fallido en PROD. Para soluciones de Power Platform: mantener el artifact de la versión anterior en el pipeline, documentar los pasos manuales adicionales (restaurar datos modificados por plugins, revertir configuraciones de D365), y tener un checklist de verificación post-rollback. El rollback debe poder ejecutarse en menos de 30 minutos para minimizar el impacto en usuarios.
- **Monitoreo y observabilidad en producción:** instrumentación del sistema para detectar problemas antes de que los usuarios los reporten. Incluye: alertas en Azure Monitor sobre Dead Letter Queue de Service Bus con mensajes no procesados, alertas sobre fallos de la Azure Function (tasa de error > 1%), Plugin Trace Log con "Exception Only" habilitado y revisión periódica, Analytics de Copilot Studio con revisión semanal de tasa de resolución, y Power BI con métricas de SLA para el equipo de management.

**Escenario:** Sistema de soporte técnico enterprise con autoservicio

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 29.1: Arquitectura del proyecto
```
SIT_Foundation (base)
  ├── Catálogos comunes
  ├── Security Roles base
  └── Environment Variables

SIT_CustomerService (D365 CE)
  ├── Configuración D365 Customer Service
  ├── SLA, Queues, Routing Rules
  ├── Knowledge Base
  └── Omnichannel básico

SIT_Portal (Power Pages)
  ├── Azure AD B2C configuration
  ├── Web Templates
  ├── Table Permissions
  └── Web APIs

SIT_Bot (Copilot Studio)
  ├── SSO Azure AD
  ├── Topics y Knowledge Sources
  └── Integración con Omnichannel

SIT_Dev (Plugins + PCF)
  ├── C# Plugin: CasoPreCreate (validaciones + auto-número)
  ├── C# Plugin: CasoPostUpdate (escalamiento automático)
  └── PCF: TimelineEnhanced (timeline de casos mejorado)

SIT_Integration (Azure)
  ├── Service Bus: nuevos casos → sistema externo
  └── Azure Function: receptor + notificación

SIT_Reports (Power BI)
  └── Dashboard KPIs soporte con RLS por región
```

#### Actividad 29.2: Plugin — CasoPreCreate
```csharp
// Valida que casos urgentes tengan descripción detallada (> 100 chars)
// Auto-asigna número: TKT-YYYY-XXXXX
// Determina SLA según tier del cliente
// Si cliente tiene contrato Premium → SLA diferente
public class CasoPreCreatePlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        // Implementar lógica completa:
        // 1. Obtener tier del cliente relacionado
        // 2. Asignar SLA correspondiente al tier
        // 3. Generar número TKT-{año}-{secuencia}
        // 4. Validar descripción mínima para urgentes
        // 5. Pre-asignar a queue según categoría detectada en el asunto
    }
}
```

#### Actividad 29.3: Pipeline CI/CD completo
1. Azure DevOps con 4 service connections (DEV/TEST/UAT/PROD)
2. Pipeline CI: export → Solution Checker → pack managed → publish artifact
3. Pipeline CD: deploy TEST (auto) → deploy UAT (aprobación) → deploy PROD (2 aprobadores)
4. Branch strategy:
   ```
   main → solo merges desde develop, protegida
   develop → triggers el pipeline CI
   feature/xxx → PRs hacia develop
   ```

#### Actividad 29.4: Test end-to-end
1. Cliente se registra en Power Pages (B2C)
2. Crea caso desde el portal → Plugin asigna TKT-2026-00001
3. Caso entra a queue correcta por Unified Routing
4. Agente responde → email automático al cliente
5. Cliente consulta estado en el bot de Teams → SSO lo identifica, responde con estado real
6. Si SLA vencido → escalamiento automático + notificación en Teams
7. Caso cerrado → registro en Service Bus → Azure Function notifica sistema externo
8. Power BI muestra KPIs del día con RLS

### 💼 Caso Real de Negocio
**Este módulo ES el caso real** — implementar el sistema completo para una empresa de servicios de 1,000 empleados con 10,000 clientes externos. El proyecto integra todos los componentes del Nivel 3 en un sistema de producción real.

### ✅ Buenas Prácticas
- Empezar por el modelo de datos y la arquitectura antes de escribir código
- CI/CD desde el día 1 — no después
- Probar la integración de extremo a extremo semanalmente durante el desarrollo
- Documentar el orden de despliegue de las soluciones en el README del repositorio — cuando haya urgencia o un desarrollador nuevo, el orden correcto no debería ser recordado, debe estar escrito
- Definir los criterios de aceptación del test E2E en el sprint de arquitectura — qué flujos exactos se deben probar y cuáles son las condiciones de aprobación

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Importación falla porque SIT_CustomerService no encuentra componentes de SIT_Foundation | Se importó CustomerService antes que Foundation en el pipeline | Ordenar explícitamente los stages de despliegue en el YAML: Foundation → CustomerService → Portal → Bot |
| Plugin funciona en DEV pero falla en TEST con "Object reference" | Una Environment Variable usada en el plugin tiene valor vacío en TEST | Configurar todas las Environment Variables en TEST antes de ejecutar el pipeline CD |
| Bot Copilot Studio no responde con datos del usuario en TEST | El Service Connection del bot apunta al entorno DEV, no TEST | Reconfigurar la integración del bot con el entorno TEST al importar la solución |
| Power Pages no crea casos desde el portal en PROD | Table Permission fue configurado en DEV pero no exportado en la solución SIT_Portal | Agregar Table Permissions a la solución antes del export — son componentes exportables |
| Azure Function no procesa mensajes de Service Bus en PROD | El Connection String del Service Bus en la Function App apunta a DEV | Actualizar la variable de entorno `ServiceBusConnection` en la Azure Function de PROD con el string de PROD |

### 🧪 Criterios de Validación del Proyecto Final
- [ ] 6 soluciones desplegadas con dependencias correctas
- [ ] Pipeline CI/CD funciona de DEV a PROD con aprobaciones
- [ ] Plugin C# valida y enriquece casos con número automático y SLA correcto
- [ ] Portal Power Pages con B2C permite registro y gestión de casos
- [ ] Bot Copilot Studio con SSO responde consultas con datos personalizados
- [ ] Service Bus recibe eventos de nuevos casos y Azure Function los procesa
- [ ] PCF Dataset control reemplaza la subgrid nativa con funcionalidad adicional
- [ ] Power BI con RLS muestra datos correctos por región

---

## Criterios de Graduación — Nivel 3

Para avanzar al Nivel 4, debes cumplir **todos** los siguientes criterios:

### Criterios Técnicos
- [ ] Pipeline CI/CD completo con Solution Checker, approvals y deploy a 3 ambientes
- [ ] Plugin C# Pre y Post operation con unit tests que pasan
- [ ] PCF Dataset control desplegado y funcional en formulario de D365
- [ ] Integración Dataverse → Service Bus → Azure Function funcionando
- [ ] Portal Power Pages con Azure AD B2C para usuarios externos
- [ ] Copilot Studio con SSO y Generative Answers desde KB corporativa
- [ ] D365 Customer Service con SLA, Unified Routing, y Knowledge Base
- [ ] Dashboard Power BI con RLS, DAX avanzado, y calendario personalizado

### Criterios de Calidad
- [ ] Ningún plugin sin manejo de `context.Depth > 1` (anti-recursión)
- [ ] Pipeline falla automáticamente si Solution Checker detecta errores críticos
- [ ] PCF usa Fluent UI y tiene consistencia visual con D365
- [ ] Portal carga en < 3 segundos (verificado con Lighthouse)

### Auto-evaluación de Dominio
Califica cada tema del 1 al 5:

- Arquitectura multi-solución: ___/5
- ALM y CI/CD: ___/5
- D365 CE (Customer Service): ___/5
- Power Pages con B2C: ___/5
- Copilot Studio avanzado: ___/5
- C# Plugins con unit tests: ___/5
- Integraciones Azure (Service Bus, Functions): ___/5
- PCF Dataset avanzado: ___/5
- Patrones de diseño (Repository, Circuit Breaker): ___/5
- Performance y optimización: ___/5

**Promedio ≥ 3.5 en todos → Puedes avanzar al Nivel 4**

---

*Siguiente nivel: [NIVEL_4_ARQUITECTO.md](NIVEL_4_ARQUITECTO.md) — Enterprise Architecture, CoE, Multi-tenant, Azure AI, Gobernanza*
