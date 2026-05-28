# NIVEL 3: AVANZADO — Power Platform & Dynamics 365
**Duración estimada:** 8–10 meses (part-time) | **Prerequisito:** NIVEL_2_INTERMEDIO.md completado  
**Certificaciones objetivo:** PL-400 (Power Platform Developer)

---

## Resumen del Nivel

En este nivel pasas de desarrollador funcional a **desarrollador técnico especializado**. Dominarás C# Plugins, PCF avanzado, integraciones con Azure, Dynamics 365 CE, Power Pages, ALM con CI/CD automatizado, y patrones de arquitectura de soluciones. Al completar este nivel podrás diseñar e implementar soluciones de alta complejidad y prepararte para la certificación PL-400.

**Módulos de este nivel:** 12 módulos (Módulos 18–29)

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
| 28 | Power Pages Avanzado y Azure AD B2C | 3–4 |
| 29 | Proyecto Multicapa Nivel 3 | 6–8 |

---

## MÓDULO 18: Arquitectura de Soluciones Power Platform

### 🎯 Objetivo
Diseñar arquitecturas de soluciones escalables, definir estrategias de datos multi-capa, seleccionar el tipo correcto de aplicación según el escenario, y documentar decisiones arquitectónicas con ADRs (Architecture Decision Records).

### 📖 Conceptos Clave
- **Canvas vs Model-Driven vs Pages:** criterios de selección por escenario
- **Dataverse vs SharePoint vs Azure SQL:** cuándo usar cada almacén de datos
- **Arquitectura de capas:** Presentación / Lógica de negocio / Datos / Integración
- **Patrón Strangler Fig:** migración incremental de sistemas legacy a Power Platform
- **Event-driven architecture:** eventos de Dataverse como disparadores de sistemas externos
- **Multi-solution architecture:** separar soluciones por dominio/capas para evitar conflictos
- **ADR (Architecture Decision Record):** documento que captura el contexto, decisión y consecuencias
- **Well-Architected Framework para Power Platform:** Fiabilidad, Seguridad, Eficiencia de rendimiento, Optimización de costos, Excelencia operacional
- **Capacity planning:** licencias, límites de API, almacenamiento Dataverse
- **Integration patterns:** Push vs Pull, Sync vs Async, Point-to-Point vs Hub-and-Spoke

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
- **pac CLI (Power Platform CLI):** herramienta de línea de comandos para automatizar todo en Power Platform
- **Power Platform Build Tools:** tasks de Azure DevOps para CI/CD
- **microsoft/powerplatform-actions:** GitHub Actions equivalentes
- **Solution Checker (Solution Analysis):** análisis estático de calidad y compatibilidad
- **Managed Identity:** autenticación sin secretos almacenados en pipelines
- **Service Connection:** configuración en Azure DevOps para conectar con el ambiente Power Platform
- **Artifact:** el .zip de la solución exportada, versionada y almacenada en el pipeline
- **Branching strategy:** GitFlow o Trunk-Based para Power Platform
- **Environment Approvals:** requerir aprobación humana antes de desplegar a PROD
- **YAML Pipeline:** definición de pipeline como código (Infrastructure as Code)

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
- **Sales Accelerator:** secuencias de actividades automatizadas para vendedores
- **Predictive Lead/Opportunity Scoring:** ML integrado que puntúa leads y oportunidades
- **Pipeline Intelligence:** análisis de tendencias del pipeline con IA
- **Case Management:** gestión completa de incidencias en Customer Service
- **SLA (Service Level Agreement):** tiempos máximos de respuesta con escalamiento automático
- **Entitlement:** derechos de soporte de un cliente (número de casos, horas, canal)
- **Queues:** colas de trabajo para enrutar casos a los agentes correctos
- **Routing Rules:** reglas para asignar casos automáticamente
- **Unified Routing:** enrutamiento inteligente con skills-based routing y ML
- **Customer Service Hub:** interfaz unificada para agentes
- **Knowledge Base:** artículos de conocimiento enlazados a casos
- **Omnichannel for Customer Service:** soporte multi-canal (chat, WhatsApp, SMS, Teams)

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
- **Power Pages:** sucesor de Power Apps Portals — plataforma para sitios web externos
- **Table Permissions:** control de acceso a datos de Dataverse desde el portal (CRUD por rol/relación)
- **Web Roles:** roles de seguridad específicos del portal (distintos de Security Roles de Dataverse)
- **Contact record:** el usuario del portal se mapea a un registro Contact en Dataverse
- **Liquid templates:** lenguaje de plantillas server-side para personalizar páginas
- **Entity Forms / Basic Forms:** formularios para crear/editar registros de Dataverse
- **Entity Lists / Basic Lists:** listas para mostrar registros con filtrado y paginación
- **Web API del portal:** permite operaciones CRUD desde JavaScript en el cliente
- **Content Delivery Network (CDN):** habilitar CDN para mejorar rendimiento global
- **Progressive Web App (PWA):** habilitar para que el portal funcione offline y como app instalable

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
- **Generative Orchestration:** el agente usa LLM para decidir qué topic activar (vs trigger phrases fijas)
- **Knowledge Sources:** SharePoint, sitios web, Azure Blob, Dataverse Knowledge Base
- **Grounding:** proceso de anclar las respuestas generativas a fuentes de verdad confiables
- **SSO (Single Sign-On):** el usuario se autentica una vez en Teams y el bot usa esa identidad
- **Azure AD Authentication en Copilot Studio:** OBO (On-Behalf-Of) flow para API calls autenticadas
- **Adaptive Cards:** tarjetas ricas con botones, imágenes y formularios en Teams
- **Multi-turn conversations:** conversaciones con memoria de contexto entre turnos
- **Escalamiento a Omnichannel:** transferir el chat a un agente humano con el contexto
- **Analytics de Copilot Studio:** tasas de resolución, abandonos, topics más activos
- **Custom Prompt Instructions:** instrucciones de sistema para controlar el comportamiento del LLM

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

### 🎯 Objetivo
Desarrollar plugins C# robustos para ejecutar lógica de negocio compleja en el servidor de Dataverse: validaciones, cálculos, integraciones síncronas con APIs externas, y patrones de plugin avanzados como Early-Bound entities y Shared Variables.

### 📖 Conceptos Clave
- **IPlugin:** interfaz que implementa todo plugin de Dataverse
- **IPluginExecutionContext:** contexto con InputParameters, OutputParameters, PreEntityImages, PostEntityImages
- **IOrganizationService:** servicio para operaciones CRUD en Dataverse desde el plugin
- **ITracingService:** logging para diagnóstico (visible en Plugin Trace Log)
- **Pre/Post Operation:** Pre = antes de guardar (puede cancelar), Post = después de guardar
- **Pre/Post Entity Images:** snapshot del registro antes/después del cambio
- **Early-Bound vs Late-Bound:** Early usa clases generadas (strongly-typed, IntelliSense); Late usa Entity genérica
- **Plugin Registration Tool (PRT):** registrar plugins y steps en Dataverse
- **Sandbox (Isolation Mode):** plugins corren en sandbox — no pueden acceder a archivos o registry del server
- **Shared Variables:** pasar datos entre plugins que corren en el mismo pipeline
- **Depth:** nivel de anidamiento de las operaciones (evitar recursión infinita)
- **InvalidPluginExecutionException:** excepción que cancela la operación y muestra mensaje al usuario

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
- **Service Endpoint (Dataverse):** enviar mensajes de Dataverse a Azure Service Bus o Event Hub
- **Azure Service Bus:** cola/topic de mensajes asíncronos — desacopla sistemas
- **Azure Functions:** funciones serverless para lógica de integración (receptor de Service Bus, webhook)
- **Azure API Management (APIM):** gateway que expone APIs con autenticación, rate limiting y transformación
- **Azure Event Grid:** routing de eventos de Azure y custom events a múltiples suscriptores
- **Managed Identity:** autenticación entre servicios Azure sin secretos
- **Azure Key Vault:** almacén de secretos seguro — plugins y Functions deben usarlo, no hardcodear
- **Dead Letter Queue:** cola de mensajes fallidos para reintento manual
- **Retry Policy:** lógica de reintentos automáticos en caso de falla transitoria
- **Outbox Pattern:** garantizar que el mensaje se envíe exactamente una vez aunque el sistema falle

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
- **Repository Pattern:** abstracción del acceso a datos — los plugins no hablan directamente con `IOrganizationService`
- **Command Pattern:** encapsular operaciones de negocio como objetos — facilita logging y validación
- **Observer Pattern:** plugins que reaccionan a eventos de Dataverse (ya implícito, pero requiere diseño cuidadoso)
- **Saga Pattern:** transacción distribuida coordinada por compensaciones — para operaciones multi-sistema
- **CQRS:** separar CommandService (escrituras) de QueryService (lecturas) para optimizar cada uno
- **Outbox Pattern:** garantía de entrega at-least-once en integraciones
- **Circuit Breaker:** dejar de llamar a un servicio externo si falla repetidamente, con auto-recovery
- **Retry Pattern:** reintentar con backoff exponencial y jitter

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
- **Delegación en Canvas Apps:** operaciones ejecutadas en el servidor vs en el cliente
- **Límite de delegación:** 500 registros por defecto (máx 2000) — más allá, se filtra en cliente
- **Concurrency en Apply to Each:** procesamiento paralelo (máx 50)
- **Batch API de Dataverse:** agrupar múltiples operaciones en 1 llamada HTTP
- **FetchXML optimizado:** consultas con joins y filtros server-side vs múltiples Retrieve
- **Indexed columns:** columnas con índice de búsqueda en Dataverse para mejor rendimiento
- **Power BI Import vs DirectQuery:** Import = caché en memoria (más rápido); DirectQuery = datos en vivo (más lento)
- **Aggregations en Power BI:** pre-calcular sumas/conteos para datasets grandes
- **Monitor de Canvas App:** herramienta de diagnóstico de llamadas y tiempos de respuesta
- **Plugin Trace Log:** diagnosticar performance de plugins en producción

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

### 🧪 Criterios de Validación
- [ ] Al menos 2 fórmulas no-delegables identificadas y corregidas en la app del proyecto
- [ ] App.OnStart usa Concurrent() para cargas independientes
- [ ] FetchXML con join reemplaza 3 llamadas separadas con el mismo resultado
- [ ] Power BI report con > 1M filas usa Import Mode con filtro en Power Query

---

## MÓDULO 27: PCF Avanzado con TypeScript y React

### 🎯 Objetivo
Desarrollar controles PCF avanzados: Dataset controls que reemplazan subgrids, controles con Web API para operaciones CRUD, uso de Fluent UI para consistencia visual, y publicación de PCF en soluciones managed.

### 📖 Conceptos Clave
- **Dataset PCF:** control que reemplaza una subgrid — recibe colección de registros
- **`context.webAPI`:** API de Dataverse disponible dentro de PCF para CRUD
- **`context.navigation`:** navegar a registros o URLs desde el PCF
- **`context.utils`:** diálogos de confirmación, notificaciones, lookup dialog
- **Fluent UI React:** librería de componentes Microsoft para consistencia visual con la plataforma
- **Virtual PCF (React):** usa el React del host — no empaqueta React propio (bundle más pequeño)
- **`useDataverse` hook (custom):** encapsular las llamadas de webAPI en un hook React reutilizable
- **Control Manifest TypeScript:** tipado estricto de propiedades de entrada y salida
- **pac pcf version:** actualizar la versión del PCF para forzar refresh en Dataverse

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

### 🧪 Criterios de Validación
- [ ] PCF Dataset Control renderiza la lista de tareas con datos reales de Dataverse
- [ ] Clic en el nombre navega al registro de la tarea
- [ ] Botón "Completar" actualiza el estado en Dataverse y refresca la lista
- [ ] Control usa Fluent UI y se ve coherente con el resto de D365
- [ ] PCF publicado en solución managed e importado en TEST sin errores

---

## MÓDULO 28: Power Pages Avanzado y Azure AD B2C

### 🎯 Objetivo
Implementar portales externos con autenticación multitenant usando Azure AD B2C para clientes externos, flujos de registro personalizado, integración con APIs externas vía Web API del portal, y optimización de SEO y rendimiento.

### 📖 Conceptos Clave
- **Azure AD B2C:** identity provider para usuarios externos (no del tenant corporativo)
- **User Flows:** flujos de registro/login configurables en B2C (sign-up/sign-in, password reset)
- **Custom Policies (IEF):** políticas XML avanzadas en B2C para flujos complejos
- **Identity Experience Framework (IEF):** motor de políticas de B2C para personalización total
- **Liquid Cache:** caché de objetos Liquid para mejorar rendimiento
- **Power Pages Web Templates:** layouts reutilizables con Liquid
- **Sitemap:** estructura de navegación del portal (Páginas, Web Links, Shortcuts)
- **Web File:** archivos estáticos (JS, CSS, imágenes) del portal

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

### 🧪 Criterios de Validación
- [ ] Usuario externo puede registrarse con email via B2C sin cuenta Azure AD corporativa
- [ ] After login, usuario ve solo sus registros (Table Permissions tipo Contact)
- [ ] Web Template base aplicado en todas las páginas del portal
- [ ] Portal carga en < 3 segundos (medir con Lighthouse)

---

## MÓDULO 29: Proyecto Multicapa Nivel 3

### 🎯 Objetivo
Construir una solución enterprise completa integrando todos los conceptos del Nivel 3: arquitectura multi-solución, CI/CD automatizado, D365 Customer Service, Portal para clientes, Copilot Studio con SSO, Plugin C# para lógica de negocio, integración con Azure Service Bus, y PCF Dataset avanzado.

### 📖 Conceptos Clave
Este módulo aplica y consolida todo el Nivel 3 en un proyecto cohesivo.

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
