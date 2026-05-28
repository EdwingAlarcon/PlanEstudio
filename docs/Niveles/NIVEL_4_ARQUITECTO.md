# NIVEL 4: ARQUITECTO MASTER — Power Platform & Dynamics 365
**Duración estimada:** 8–12 meses (part-time) | **Prerequisito:** NIVEL_3_AVANZADO.md completado  
**Certificaciones objetivo:** PL-600 (Power Platform Solution Architect Expert)

---

## Resumen del Nivel

En este nivel dejas de ser desarrollador técnico para convertirte en **Solution Architect**. Tomas decisiones de diseño que afectan a toda la organización, líderas equipos técnicos, defines estrategias de gobernanza, diseñas integraciones enterprise con Azure, y puedes hablar con el C-suite sobre ROI y transformación digital. Al completar este nivel estás listo para la certificación PL-600 y para liderar proyectos de transformación digital de gran escala.

**Módulos de este nivel:** 11 módulos (Módulos 30–40)

| Módulo | Tema | Semanas |
|--------|------|---------|
| 30 | Enterprise Architecture y Gobernanza | 4–5 |
| 31 | CoE Starter Kit y Administración a Escala | 3–4 |
| 32 | Multi-tenant, Multi-geo y Estrategia de Ambientes | 3–4 |
| 33 | Azure Integration Services Avanzado | 4–5 |
| 34 | Arquitectura de Datos: Fabric, Synapse y Medallion | 4–5 |
| 35 | Seguridad y Cumplimiento Enterprise | 3–4 |
| 36 | AI Builder y Azure AI integrado en Power Platform | 3–4 |
| 37 | Liderazgo Técnico y Gestión de Proyectos | 3–4 |
| 38 | Casos de Transformación Digital | 3–4 |
| 39 | Preparación PL-600 | 4–5 |
| 40 | Proyecto Capstone — Arquitectura Enterprise | 8–10 |

---

## MÓDULO 30: Enterprise Architecture y Gobernanza

### 🎯 Objetivo
Diseñar y comunicar la arquitectura enterprise de Power Platform para organizaciones de 1,000+ usuarios: estrategia de gobernanza, políticas de adopción, marcos de decisión arquitectónica, y alineación con estándares como TOGAF y el Well-Architected Framework de Microsoft.

### 📖 Conceptos Clave
- **TOGAF (The Open Group Architecture Framework):** marco para arquitectura enterprise — fases ADM (Architecture Development Method)
- **Well-Architected Framework (Power Platform):** 5 pilares: Fiabilidad, Seguridad, Excelencia operacional, Eficiencia de rendimiento, Optimización de costos
- **Governance Framework:** conjunto de políticas, procesos y controles para uso responsable de la plataforma
- **Fusion Teams:** equipos mixtos de desarrolladores ciudadanos + desarrolladores pro + IT + negocio
- **Landing Zone:** ambiente pre-configurado con todas las políticas de seguridad listas para nuevos proyectos
- **Platform Engineering:** tratar la plataforma como un producto interno con SLAs propios
- **FinOps para Power Platform:** gestión de costos de licencias, storage, API limits
- **Risk Register:** inventario de riesgos técnicos y de negocio con mitigaciones
- **Capability Map:** mapa de capacidades de negocio vs cobertura actual de la plataforma
- **Reference Architecture:** plantillas de arquitectura reutilizables para casos de uso comunes

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 30.1: Well-Architected Review para Power Platform
Completar el cuestionario oficial de Microsoft y documentar los hallazgos:

**Pilar 1: Fiabilidad**
```markdown
Preguntas clave:
- ¿Tienes proceso de backup y restore de soluciones?
- ¿Hay ambientes de failover para sistemas críticos?
- ¿Los flujos de Power Automate tienen retry policy?
- ¿Las integraciones tienen circuit breaker?

Hallazgos típicos:
- ❌ No hay backup automatizado de customizaciones
- ❌ Un solo ambiente de producción sin failover
- ✅ Flujos con Scope Try/Catch
- ⚠️ Integraciones sin retry

Plan de remediación:
- Implementar backup con Azure DevOps pipeline semanal
- Documentar RTO/RPO para cada sistema crítico
```

**Pilar 2: Seguridad**
```markdown
Preguntas clave:
- ¿DLP Policies aplicadas en TODOS los ambientes?
- ¿Acceso privilegiado tiene MFA + PIM (Privileged Identity Management)?
- ¿Los datos sensibles están clasificados con Microsoft Purview?
- ¿Customer Lockbox habilitado?

Hallazgos típicos:
- ❌ DLP solo en producción, sandbox sin restricciones
- ❌ Administradores de Power Platform sin MFA
```

**Pilar 3: Excelencia Operacional**
```markdown
Preguntas clave:
- ¿CI/CD automatizado para todos los proyectos?
- ¿Runbook documentado para incidentes?
- ¿Monitoreo de flujos fallidos con alertas?
- ¿Proceso de change management definido?
```

#### Actividad 30.2: Governance Framework Document
Crear `GOVERNANCE_FRAMEWORK.md` para el cliente:
```markdown
# Power Platform Governance Framework — [Empresa]
Versión: 1.0 | Aprobado por: CTO | Fecha: 2026-01

## 1. Principios de Gobernanza
1. **Seguridad primero:** Ningún proyecto se despliega sin pasar DLP review
2. **ALM obligatorio:** DEV → TEST → PROD para todo lo que va a producción
3. **Mínimo privilegio:** Security Roles con los permisos mínimos necesarios
4. **Auditabilidad:** Toda acción crítica debe tener audit trail

## 2. Modelo de Ambientes
| Tipo | Propósito | Quién tiene acceso | DLP |
|------|-----------|-------------------|-----|
| Personal Dev | Exploración individual | Solo el maker | Minimal |
| Project Dev | Desarrollo del equipo | Dev team | Moderate |
| Test/QA | Pruebas formales | Dev + QA | Production-like |
| UAT | Validación del cliente | Dev + Business users | Production |
| Production | Sistema en vivo | Solo ServiceAccounts | Strict |

## 3. Criterios de Entrega (Definition of Done)
- [ ] Solution Checker: 0 errores críticos
- [ ] CI/CD pipeline verde
- [ ] Security review completado
- [ ] Documentación de usuario actualizada
- [ ] Runbook de operaciones creado
- [ ] Aprobación del arquitecto responsable

## 4. Proceso de Excepción
Si un proyecto necesita una excepción a las políticas:
1. Arquitecto documenta el riesgo y la mitigación
2. Aprobación del CISO y CTO
3. Revisión en 90 días para eliminar la excepción

## 5. Métricas de Salud de la Plataforma
- Flujos fallidos en 7 días: < 0.5% del total
- Tiempo de disponibilidad: > 99.5%
- Soluciones sin pipeline: 0 en producción
- Apps sin owner identificado: 0
```

#### Actividad 30.3: Capability Map
Mapear las capacidades de negocio vs la cobertura de Power Platform:
```
Dominio: Ventas y CRM
  Gestión de leads          → D365 Sales (✅ implementado)
  Cotizaciones              → Canvas App (✅)
  Contrato electrónico      → Power Pages + Adobe Sign (🔄 en progreso)
  Comisiones                → ❌ GAP — oportunidad de proyecto

Dominio: Operaciones
  Gestión de proyectos      → D365 Project Operations (❌ no implementado)
  Timesheets                → Canvas App (✅)
  Facturación               → Integración ERP (✅)

Dominio: RRHH
  Onboarding                → Power Apps + Teams (✅)
  Evaluación desempeño      → ❌ GAP
  Solicitudes de vacaciones  → Power Automate (✅)
```

#### Actividad 30.4: Landing Zone como código
```powershell
# Script de aprovisionamiento de Landing Zone para nuevo proyecto
# Crea el ambiente + DLP + grupos + roles base

param(
    [string]$ProjectName,
    [string]$ProjectOwnerEmail,
    [string]$BusinessUnit
)

# 1. Crear ambiente DEV
pac env create `
    --name "$ProjectName-DEV" `
    --type Sandbox `
    --region unitedstates `
    --currency USD

# 2. Aplicar DLP estándar
# (via PowerShell SDK de Power Apps Administration)
Add-PowerAppsAccount
$policy = Get-DlpPolicy -DisplayName "Standard-Policy-Template"
# Copiar y aplicar al nuevo ambiente...

# 3. Crear grupos de seguridad en AAD
# New-AzureADGroup -DisplayName "PP-$ProjectName-Developers" -MailEnabled $false

# 4. Asignar roles
Set-AdminPowerAppEnvironmentRoleAssignment `
    -EnvironmentName $environmentId `
    -PrincipalObjectId $ownerObjectId `
    -RoleName EnvironmentAdmin

Write-Host "Landing Zone creada para proyecto: $ProjectName"
Write-Host "Ambiente DEV: $environmentId"
Write-Host "Siguiente paso: configurar pipeline CI/CD con esta URL"
```

### 💼 Caso Real de Negocio
**Empresa:** Banco con 200 makers de Power Platform sin gobernanza  
**Problema:** 800 apps en el tenant, 60% sin owner identificado, datos financieros de clientes en apps con connectors a servicios externos sin aprobación. Un incident de seguridad expuso datos de 5,000 clientes por un conector no aprobado.  
**Solución:** Well-Architected Review reveló los gaps. Governance Framework implementado. DLP policies en todos los ambientes. CoE Starter Kit para visibilidad. Landing Zones automatizadas para nuevos proyectos. Proceso de excepción formal.  
**Resultado:** De 800 apps sin control a 340 apps auditadas. Incident de seguridad similar: 0 en 18 meses.

### ✅ Buenas Prácticas
- El Governance Framework debe tener aprobación del C-suite — sin sponsor ejecutivo, no se cumple
- Landing Zones como código permiten consistencia y velocidad para nuevos proyectos
- Revisar el Well-Architected Framework cada 6 meses — la plataforma evoluciona
- Medir la salud de gobernanza con métricas concretas (% de apps sin owner, % con CI/CD)

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Governance Framework en papel pero no en práctica | Sin enforcement técnico | DLP hace cumplir las políticas técnicamente; el resto requiere cultura |
| DLP demasiado restrictiva bloquea casos legítimos | Políticas creadas sin consultar a los teams | Proceso de consulta con business antes de definir DLP |
| Makers evaden el proceso creando ambientes personales | Administradores no restringen creación de ambientes | Admin Center → Políticas de ambiente → Restringir creación a admins |

### 🧪 Criterios de Validación
- [ ] Well-Architected Review completado con hallazgos documentados en los 5 pilares
- [ ] Governance Framework document con políticas, modelo de ambientes y Definition of Done
- [ ] Capability Map identificando 3+ gaps como oportunidades de proyecto
- [ ] Script de Landing Zone crea ambiente con DLP y roles automáticamente

---

## MÓDULO 31: CoE Starter Kit y Administración a Escala

### 🎯 Objetivo
Implementar y operar el Center of Excellence Starter Kit de Microsoft para obtener visibilidad completa del tenant, gestionar el inventario de apps y flujos, aplicar políticas de cumplimiento automáticamente, y habilitar al equipo de gobernanza para tomar decisiones basadas en datos.

### 📖 Conceptos Clave
- **CoE Starter Kit:** conjunto de soluciones Power Platform de Microsoft para administrar el tenant
- **Core Components:** inventario de apps, flujos, conectores y makers (el corazón del CoE)
- **Governance Components:** comunicación con makers, proceso de aprobación, quarantine de apps
- **Nurture Components:** onboarding de makers, training tracking, comunidad interna
- **Innovation Backlog:** proceso para que el negocio proponga ideas y priorice proyectos
- **Compliance Process:** flujo automatizado que contacta owners de apps y solicita justificación
- **Power BI CoE Dashboard:** visibilidad ejecutiva del estado del tenant
- **Environment Request Process:** formulario para que makers soliciten nuevos ambientes
- **Maker Assessment:** cuestionario para certificar makers en distintos niveles
- **App Quarantine:** proceso para desactivar apps sin uso o sin owner

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 31.1: Instalar CoE Starter Kit
1. Descargar el CoE Starter Kit desde aka.ms/CoEStarterKit
2. Crear ambiente dedicado para el CoE: `TENANT-COE` (Producción, acceso solo a admins)
3. Importar en orden:
    - Core Components (primero — es dependencia de todos)
    - Governance Components
    - Nurture Components
    - Innovation Backlog (opcional)

4. Configurar el flujo `CLEANUP - Admin | Sync Template v4`:
    - Connectors: Power Apps Admin, Power Automate Admin, Microsoft Dataverse
    - Frecuencia: 1 vez por día (carga inicial puede tardar horas)

5. Esperar la primera sincronización completa (24–48h para tenants grandes)

#### Actividad 31.2: Power BI CoE Dashboard
1. Descargar el archivo .pbit del CoE Starter Kit
2. Conectar a: el ambiente CoE Dataverse + M365 (opcional)
3. Páginas del dashboard y qué muestran:

**Página: Resumen del Tenant**
```
KPIs:
- Total Apps: 342
- Apps activas (usadas en 30 días): 187 (55%)
- Apps sin uso en 90 días: 89 → candidatas a archivado
- Makers únicos: 67
- Ambientes: 23

Gráficos:
- Apps por departamento (donut)
- Crecimiento de makers mensual (línea)
- Apps por tipo (Canvas/Model-Driven/Pages)
```

**Página: Apps sin Owner o Vencidas**
```
Tabla con:
- App Name | Environment | Last Modified | Owner | Last Used
- Filtro: "Owner is empty OR Last Used > 90 days"
→ Esta lista es el input para el Compliance Process
```

**Página: Conectores en uso**
```
Heatmap: Connector × Environment
Identificar: ¿Alguien usa un connector que debería estar bloqueado?
```

#### Actividad 31.3: Compliance Process Automation
El CoE incluye un flujo que contacta automáticamente a los owners:
```
Trigger: Recurrente (cada 30 días)
1. Obtener todas las apps con más de 90 días sin uso
2. Para cada app:
   a. Email al owner: "Tu app [nombre] no ha sido usada en 90 días.
      ¿Sigue siendo necesaria? Tienes 14 días para responder.
      [Sí, mantener] [No, archivar] [Transferir a otro owner]"
   b. Si no responde en 14 días → segunda notificación
   c. Si no responde en 28 días → notificar admin para quarantine manual
3. Si responde "No" → marcar para archivado automático
4. Si responde "Transferir" → formulario para nuevo owner
```

#### Actividad 31.4: Environment Request Process
Crear formulario para que makers soliciten ambientes:

1. Canvas App: `Solicitud de Ambiente`
2. Campos: Nombre del proyecto, Justificación de negocio, Tipo requerido (Dev/Test/Prod), Owner del proyecto, Fecha requerida, Conectores necesarios
3. Flujo de aprobación:
   ```
   Maker llena formulario
     → Aprobación Arquitecto (¿es necesario un nuevo ambiente o puede usar uno existente?)
     → Si aprobado: ejecutar script Landing Zone automáticamente
     → Notificar al maker con URL del nuevo ambiente y documentación de bienvenida
     → Registrar en CoE inventory
   ```

#### Actividad 31.5: Maker Nurture — Comunidad interna
1. Teams Channel: `Power Platform Community`
2. Canal mensual "App of the Month" — destacar el mejor proyecto de un citizen developer
3. Training path en SharePoint con badges (usando Power Apps + Dataverse):
   ```
   Nivel 1: Completó PL-900 → Badge "Power Platform Fundamentals"
   Nivel 2: Publicó su primera app → Badge "First App Published"
   Nivel 3: Completó PL-200 → Badge "Functional Consultant"
   Nivel 4: App con 50+ usuarios → Badge "Power User"
   ```

4. Flujo que registra automáticamente cuando un maker publica su primera app

### 💼 Caso Real de Negocio
**Empresa:** Multinacional con 5,000 empleados y Power Platform sin CoE  
**Problema:** El IT director no sabía cuántas apps existían ni quién las mantenía. Cada mes aparecían nuevas apps en producción que nadie había aprobado, con datos de clientes en SharePoint externo.  
**Solución:** CoE Core Components instalados → primer sync reveló 1,200 apps (el IT esperaba 200). Compliance Process archivó 340 apps sin uso. Environment Request Process formalizó el proceso de nuevos ambientes. CoE Dashboard ahora es el primer dashboard que revisa el CIO en su reunión mensual de IT.  
**Resultado:** Visibilidad 100% del tenant. Número de apps sin owner: de 600 a 12. Requests de nuevos ambientes procesados en < 2 días (antes tardaban semanas).

### ✅ Buenas Prácticas
- El ambiente del CoE debe tener su propio CoE (meta-gobernanza) — backup y pipeline propio
- No personalizar el CoE Starter Kit excesivamente — las actualizaciones de Microsoft serían imposibles de aplicar
- El compliance process debe tener un "nodo de apelación" — los makers pueden disputar el archivado
- Publicar métricas del CoE mensualmente — transparencia genera confianza con el negocio

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Sync inicial nunca termina | Tenant con miles de registros + throttling de API | Ejecutar sync incremental, no full-sync, en tenants grandes |
| Compliance emails generan fricción | Tono demasiado agresivo o automático | Personalizar el email con el nombre del maker y contexto claro |
| CoE Dashboard no muestra datos recientes | Sync deshabilitado o flujo con error | Monitorear el flujo de sync con alerta automática si falla |

### 🧪 Criterios de Validación
- [ ] CoE Core Components instalados y primer sync completado
- [ ] Power BI Dashboard muestra inventario real de apps, flujos y makers del tenant
- [ ] Compliance Process envía email automático a owners de apps sin uso
- [ ] Environment Request Process con aprobación y provisioning automatizado
- [ ] Training path con badges funciona para al menos 1 maker piloto

---

## MÓDULO 32: Multi-tenant, Multi-geo y Estrategia de Ambientes

### 🎯 Objetivo
Diseñar estrategias de implementación para organizaciones multinacionales con múltiples tenants, requisitos de residencia de datos (GDPR, LGPD, Ley 1581), y modelos de gobierno distribuido donde subsidiarias tienen autonomía pero se alinean con políticas corporativas.

### 📖 Conceptos Clave
- **Tenant:** instancia de Azure AD + Power Platform — una empresa puede tener múltiples
- **Multi-tenant architecture:** corporativo + subsidiarias en tenants separados con integración
- **Geo (Geography):** región de Azure donde residen los datos — Europa, Asia, Américas, etc.
- **GDPR (Europa), LGPD (Brasil), Ley 1581 (Colombia):** regulaciones de privacidad de datos
- **Data Residency:** garantizar que datos de ciudadanos europeos residan en Azure Region Europe
- **Cross-tenant connectors:** comunicación entre tenants distintos con Azure AD B2B
- **Hub-and-Spoke environment model:** tenant corporativo (hub) + subsidiarias (spokes)
- **Managed Environments:** ambiente con gobernanza avanzada habilitada (Premium feature)
- **Pipelines for Power Platform:** despliegue nativo de soluciones sin Azure DevOps (nuevo feature)
- **Satellite Makers:** ciudadanos desarrolladores en subsidiarias con autonomía controlada

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 32.1: Modelo Hub-and-Spoke
```
Tenant Corporativo (Hub)
├── Ambiente: CORP-DEV
├── Ambiente: CORP-PROD (apps corporativas — Finance, RRHH)
├── CoE ambiente
├── DLP Policies: Global (aplica a todos los ambientes del corp tenant)
└── Soluciones compartidas: Foundation, Catálogos, Security base

Tenant Colombia (Spoke 1)
├── Azure AD B2B: empleados corporativos pueden acceder
├── Ambiente: COL-DEV
├── Ambiente: COL-PROD (apps locales + replica de corp)
├── DLP Policies: Colombia (más restrictiva que global en datos financieros por Ley 1581)
└── Data residency: Brazil South o US (elegir según acuerdos con SIC)

Tenant México (Spoke 2)
├── Ambiente: MEX-DEV  
├── Ambiente: MEX-PROD
└── DLP: México (restricciones adicionales para datos de RFC según SAT)

Integración Hub ↔ Spoke:
- Azure Service Bus (mensajería cross-tenant)
- Azure API Management (APIs compartidas)
- No se usan conectores directos de Dataverse cross-tenant (limitación de plataforma)
```

#### Actividad 32.2: Estrategia de residencia de datos GDPR
```
Escenario: empresa con clientes europeos y operaciones en Colombia

Tabla de decisión:
| Dato | ¿Ciudadano EU? | Ambiente | Región Azure |
|------|---------------|----------|-------------|
| Datos CRM de cliente EU | SÍ | PROD-EU | West Europe |
| Datos CRM de cliente CO | NO | PROD-CO | Brazil South |
| Datos de empleados EU | SÍ | PROD-HR-EU | West Europe |
| Datos financieros globales | N/A | PROD-FINANCE | East US (consolidado) |

Implementación técnica:
1. Ambiente separado por región → Dataverse en la región correcta
2. Power Automate no procesa datos EU en ambientes US (flujos separados)
3. Power BI: dataset EU en Premium Capacity EU region
4. Logs de auditoría de datos EU almacenados en EU

Documentación requerida:
- Registro de actividades de tratamiento (GDPR Art. 30)
- DPA (Data Processing Agreement) con Microsoft firmado
- Mapa de flujos de datos cross-border documentado
```

#### Actividad 32.3: Managed Environments
1. Admin Center → seleccionar ambiente → habilitar Managed Environments
2. Funcionalidades que se habilitan:
    - **Sharing limits:** limitar a cuántas personas se puede compartir una app (ej: máx 20, o solo dentro del tenant)
    - **Solution checker enforcement:** forzar que todas las importaciones pasen el checker
    - **IP firewall:** restricción de acceso por IP/red corporativa
    - **Customer-managed keys (CMK):** cifrado con claves propias del cliente
    - **Weekly digest:** email semanal al admin con el estado del ambiente

3. Configurar para PROD:
   ```
   Sharing limits: Solo grupos de seguridad de AAD
   Solution Checker: Bloquear si hay errores críticos
   IP Firewall: Rango de IPs corporativas + VPN
   Weekly Digest: Activado para admin y arquitecto
   ```

#### Actividad 32.4: Pipelines for Power Platform (nativo)
Alternativa a Azure DevOps para organizaciones sin DevOps avanzado:

1. Admin Center → Pipelines → Nuevo pipeline
2. Configurar etapas:
    - DEV → TEST → PROD

3. Desde make.powerapps.com → Solución → Pipelines → Deploy
4. El despliegue pasa por las etapas con aprobaciones configuradas
5. Ventaja: no requiere Azure DevOps ni conocimiento de YAML
6. Desventaja: menos control que Azure DevOps (sin Solution Checker integrado, sin scripts personalizados)

### 💼 Caso Real de Negocio
**Empresa:** Grupo empresarial con operaciones en Colombia, México, Perú y España  
**Problema:** Usaban un solo tenant para todo. Los datos de clientes españoles (GDPR) residían en datacenters de US porque el tenant era de esa región. El DPO (Data Protection Officer) recibió una multa de €50,000 de la AEPD (Agencia Española de Protección de Datos).  
**Solución:** Separar en 2 tenants: LATAM (Brazil South) y EU (West Europe). Integración vía Azure Service Bus. Microsoft firmó DPA para ambos tenants. CoE en cada tenant con sincronización de políticas corporativas.  
**Resultado:** Cumplimiento GDPR verificado. LGPD de Brasil: en proceso. Multa no se repitió.

### ✅ Buenas Prácticas
- La residencia de datos es responsabilidad del cliente, no de Microsoft — no asumir que el datacenter correcto se selecciona automáticamente
- Managed Environments son premium pero obligatorios para PROD de sistemas críticos
- Antes de decidir multi-tenant, evaluar si Managed Environments + restricciones dentro de un solo tenant es suficiente

### 🧪 Criterios de Validación
- [ ] Diagrama Hub-and-Spoke documentado con decisiones de región por tipo de dato
- [ ] Tabla de residencia de datos con regulación aplicable por país
- [ ] Managed Environments habilitado en PROD con sharing limits e IP firewall
- [ ] Pipeline nativo de Power Platform despliega de DEV a TEST con aprobación

---

## MÓDULO 33: Azure Integration Services Avanzado

### 🎯 Objetivo
Diseñar e implementar arquitecturas de integración enterprise usando el stack completo de Azure Integration Services: Logic Apps, API Management, Service Bus, Event Grid, Azure Functions y Azure Data Factory, orquestados para crear sistemas de integración robustos con Power Platform en el centro.

### 📖 Conceptos Clave
- **Azure Logic Apps:** orquestación de integraciones enterprise (similar a Power Automate pero para IT)
- **Azure API Management (APIM):** gateway de APIs con portal de desarrolladores, versioning, analytics
- **Azure Service Bus:** mensajería empresarial — colas, topics, subscriptions, sessions
- **Azure Event Grid:** enrutamiento de eventos cloud-native a múltiples suscriptores
- **Azure Data Factory (ADF):** ETL/ELT y movimiento de datos a escala
- **Azure Functions Durable:** orquestación de flujos complejos (Fan-out/Fan-in, Human interaction)
- **Integration Account:** repositorio de schemas XML, mapas XSLT, socios EDI para Logic Apps
- **APIM Developer Portal:** portal self-service para que desarrolladores descubran y usen las APIs
- **Dead Letter Queue (DLQ):** cola de mensajes que no pudieron procesarse después de N reintentos
- **Message Session:** procesamiento ordenado de mensajes relacionados en Service Bus
- **WebSub / WebHooks:** notificaciones push desde sistemas externos sin polling

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 33.1: Arquitectura Integration Hub
```
                    [Power Platform]
                         |
                    [Azure APIM]  ← punto de entrada único para todas las integraciones
                   /     |     \
         [Logic Apps] [Functions] [Service Bus]
              |           |            |
         [SFTP/FTP]  [HTTP Sync]  [Event Grid]
         [EDI/B2B]   [Webhooks]        |
         [ADF ETL]               [Sistemas externos]
                                  SAP, Salesforce, ERP
```

#### Actividad 33.2: Logic App para integración SAP
```json
{
  "definition": {
    "triggers": {
      "WhenSolicitudCreated": {
        "type": "ServiceBusTrigger",
        "inputs": {
          "connection": "@parameters('serviceBusConnection')",
          "queueName": "solicitudes-nuevas"
        }
      }
    },
    "actions": {
      "ParseDataverseMessage": {
        "type": "ParseJson",
        "inputs": {
          "content": "@triggerBody()?['ContentData']",
          "schema": {}
        }
      },
      "CallSAPRFC": {
        "type": "Http",
        "inputs": {
          "method": "POST",
          "uri": "https://sap-gateway.empresa.com/sap/opu/odata/sap/ZMM_SOLICITUD_SRV/SolicitudSet",
          "authentication": {
            "type": "Basic",
            "username": "@parameters('sapUser')",
            "password": "@parameters('sapPassword')"
          },
          "body": {
            "Matnr": "@body('ParseDataverseMessage')?['sit_codigoproducto']",
            "Menge": "@body('ParseDataverseMessage')?['sit_cantidad']",
            "Waers": "COP"
          }
        },
        "retryPolicy": {
          "type": "exponential",
          "count": 3,
          "interval": "PT10S",
          "maximumInterval": "PT1H",
          "minimumInterval": "PT10S"
        }
      },
      "UpdateDataverseWithSAPId": {
        "type": "Http",
        "runAfter": { "CallSAPRFC": ["Succeeded"] },
        "inputs": {
          "method": "PATCH",
          "uri": "https://tuorg.crm.dynamics.com/api/data/v9.2/sit_solicituds(@{body('ParseDataverseMessage')?['sit_solicitudid']})",
          "authentication": { "type": "ManagedServiceIdentity" },
          "body": {
            "sit_sapid": "@body('CallSAPRFC')?['d']?['Aufnr']",
            "sit_estadointegracion": 100000001
          }
        }
      },
      "HandleSAPError": {
        "type": "ServiceBus_SendMessage",
        "runAfter": { "CallSAPRFC": ["Failed", "TimedOut"] },
        "inputs": {
          "connection": "@parameters('serviceBusConnection')",
          "queueName": "solicitudes-dlq-manual",
          "message": {
            "body": "@triggerBody()",
            "properties": {
              "errorDetail": "@{actions('CallSAPRFC')['error']['message']}",
              "originalMessageId": "@triggerBody()?['MessageId']"
            }
          }
        }
      }
    }
  }
}
```

#### Actividad 33.3: APIM — Portal de APIs para integradores
1. Crear API en APIM desde spec OpenAPI de Dataverse
2. Configurar productos:
    - **Producto Interno:** acceso sin límite para apps internas
    - **Producto Partners:** 1,000 req/hora, API Key requerida
    - **Producto Freemium:** 100 req/hora, sin soporte

3. Políticas de transformación:
   ```xml
   <!-- Transformar errores de Dataverse a formato estándar de la empresa -->
   <on-error>
     <set-body>@{
       return JsonConvert.SerializeObject(new {
         error = true,
         code = context.Response.StatusCode,
         message = context.LastError.Message,
         correlationId = context.RequestId
       });
     }</set-body>
     <set-header name="Content-Type" exists-action="override">
       <value>application/json</value>
     </set-header>
   </on-error>
   ```

4. Habilitar Developer Portal:
    - Personalizar con el branding de la empresa
    - Configurar proceso de suscripción (automático vs aprobación manual)
    - Publicar documentación de cada API

#### Actividad 33.4: Azure Durable Functions — Fan-out/Fan-in
```csharp
// Orquestador: procesar 1000 clientes en paralelo (fan-out) y consolidar resultado (fan-in)
[FunctionName("ProcesarClientesBatch")]
public static async Task<List<string>> RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var clientes = await context.CallActivityAsync<List<string>>("ObtenerClientesPendientes", null);
    
    // Fan-out: lanzar todas las tareas en paralelo
    var tareas = clientes.Select(clienteId =>
        context.CallActivityAsync<string>("NotificarCliente", clienteId));
    
    // Fan-in: esperar a que todas completen
    var resultados = await Task.WhenAll(tareas);
    
    return resultados.Where(r => r != null).ToList();
}

[FunctionName("NotificarCliente")]
public static async Task<string> NotificarCliente(
    [ActivityTrigger] string clienteId,
    ILogger log)
{
    try
    {
        // Llamar a la API de notificaciones
        log.LogInformation("Notificando cliente: {0}", clienteId);
        // ... lógica de notificación
        return clienteId;
    }
    catch (Exception ex)
    {
        log.LogError("Error notificando cliente {0}: {1}", clienteId, ex.Message);
        return null; // El orquestador filtra los nulls
    }
}
```

#### Actividad 33.5: Event Grid para eventos de Dataverse
1. Azure Portal → Event Grid → Suscripciones → Nueva
2. Tipo de origen: Microsoft Dataverse
3. Evento: `Microsoft.PowerApps.Dataverse.RecordCreated`
4. Tabla: `sit_solicitud`
5. Endpoints suscriptores:
    - Azure Function (procesamiento inmediato)
    - Service Bus Topic (mensajería async)
    - Logic App (integración con SAP)
    - Azure Event Hubs (streaming hacia Power BI en tiempo real)

### 💼 Caso Real de Negocio
**Empresa:** Grupo industrial con SAP, Salesforce, un WMS propio y Power Platform  
**Problema:** Cada sistema tenía integraciones punto a punto: SAP→Dataverse, Salesforce→Dataverse, WMS→SAP. 9 integraciones distintas, cada una con su propia lógica de retry y monitoreo. Una falla en SAP derribaba 3 integraciones simultáneamente.  
**Solución:** Integration Hub con APIM como puerta de entrada. Service Bus desacopla sistemas. Logic Apps para integraciones complejas (EDI, B2B). Event Grid distribuye eventos a múltiples suscriptores. Reducción de 9 integraciones a 1 hub centralizado.  
**Resultado:** MTTR (Mean Time to Recover) de integraciones: de 4 horas a 20 minutos. Visibilidad completa de mensajes en tránsito desde Azure Monitor.

### ✅ Buenas Prácticas
- Service Bus para async, HTTP directo para sync — nunca al revés en integraciones enterprise
- APIM como único punto de entrada — nunca exponer APIs de Dataverse directamente a internet
- Durable Functions para orquestación de largo plazo con estado persistido
- Monitorear DLQ con alertas — mensajes muertos son errores silenciosos de negocio

### 🧪 Criterios de Validación
- [ ] Logic App procesa mensajes de Service Bus y llama API externa con retry exponencial
- [ ] APIM expone API con 2 productos (interno y partners) con distintos rate limits
- [ ] Durable Function procesa 100+ registros en paralelo con fan-out/fan-in
- [ ] Event Grid distribuye evento de Dataverse a 2 suscriptores distintos

---

## MÓDULO 34: Arquitectura de Datos — Fabric, Synapse y Medallion

### 🎯 Objetivo
Diseñar arquitecturas de datos modernas usando Microsoft Fabric y Azure Synapse Analytics conectados con Dataverse y Power BI, implementando el patrón Medallion (Bronze→Silver→Gold) para crear una fuente única de verdad analítica para la organización.

### 📖 Conceptos Clave
- **Microsoft Fabric:** plataforma analítica unificada — Lakehouse, Warehouse, Pipelines, Notebooks, Real-Time Analytics
- **Lakehouse:** combina el almacenamiento flexible de un Data Lake con las capacidades SQL de un Data Warehouse
- **OneLake:** almacenamiento único subyacente de Fabric — todos los items comparten el mismo lago
- **Medallion Architecture:** Bronze (raw), Silver (curated), Gold (business-ready)
- **Dataverse Link to Fabric:** exportar tablas de Dataverse a Fabric automáticamente (sin pipelines)
- **DirectLake:** modo de Power BI que lee directamente del Lakehouse sin importar ni DirectQuery
- **Azure Synapse Analytics:** alternativa enterprise a Fabric — SQL Pools, Spark Pools, Pipelines
- **Delta Lake format:** formato de tabla con soporte ACID sobre Parquet en el Lakehouse
- **Semantic Model (Power BI):** capa semántica con medidas DAX sobre el Gold layer
- **Data Activator:** alertas automáticas sobre datos en tiempo real (nuevo en Fabric)

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 34.1: Conectar Dataverse con Microsoft Fabric
1. make.powerapps.com → Dataverse → Azure Synapse Link → Agregar enlace
2. Seleccionar tablas: Account, Contact, sit_solicitud, sit_proyecto, sit_tarea
3. Seleccionar: Microsoft Fabric (opción nueva vs Azure Synapse)
4. Workspace de Fabric destino: `SIT-Analytics`
5. Las tablas se exportan como Delta Tables en el Lakehouse automáticamente
6. Verificar en Fabric: Lakehouse → Tables → las tablas de Dataverse aparecen

#### Actividad 34.2: Medallion Architecture en Fabric
```python
# Notebook de PySpark — Bronze to Silver (limpieza y estandarización)
# Bronze: datos crudos de Dataverse (tal como llegaron)
# Silver: datos limpios, validados, estandarizados

from pyspark.sql import functions as F
from pyspark.sql.types import *
from delta.tables import DeltaTable

# Leer desde Bronze (tabla de Dataverse exportada)
df_bronze = spark.read.format("delta").load(
    "abfss://sitanalytics@onelake.dfs.fabric.microsoft.com/SIT-Lakehouse.Lakehouse/Tables/sit_solicitud"
)

# Transformaciones Silver: limpiar, estandarizar, enriquecer
df_silver = (df_bronze
    # Eliminar registros borrados lógicamente
    .filter(F.col("statecode") == 0)
    
    # Estandarizar fechas a UTC
    .withColumn("fecha_creacion_utc", 
        F.to_utc_timestamp(F.col("createdon"), "America/Bogota"))
    
    # Clasificar por categoría de negocio (lógica de negocio)
    .withColumn("categoria_analisis", 
        F.when(F.col("sit_categoria").isin([1,2,3]), "Hardware")
         .when(F.col("sit_categoria").isin([4,5]), "Software")
         .otherwise("Otros"))
    
    # Calcular días hasta vencimiento
    .withColumn("dias_hasta_vencimiento",
        F.datediff(F.col("sit_fechavencimiento"), F.current_date()))
    
    # Quitar columnas técnicas de Dataverse que no se necesitan en Analytics
    .drop("versionnumber", "importsequencenumber", "overriddencreatedon",
          "timezoneruleversionnumber", "utcconversiontimezonecode")
)

# Escribir en Silver con merge (upsert para evitar duplicados)
silver_table_path = "abfss://sitanalytics@onelake.dfs.fabric.microsoft.com/SIT-Lakehouse.Lakehouse/Tables/silver_solicitud"

deltaTable = DeltaTable.forPath(spark, silver_table_path)
deltaTable.alias("target").merge(
    df_silver.alias("source"),
    "target.sit_solicitudid = source.sit_solicitudid"
).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()

print(f"Silver layer actualizado: {df_silver.count()} registros")
```

```python
# Gold Layer — Agregaciones de negocio listas para Power BI
# Gold: métricas de negocio pre-calculadas, dimensiones desnormalizadas

df_silver_sol = spark.read.format("delta").load(
    "abfss://sitanalytics@onelake.dfs.fabric.microsoft.com/SIT-Lakehouse.Lakehouse/Tables/silver_solicitud"
)
df_silver_clientes = spark.read.format("delta").load(".../silver_account")

# Dimensión cliente enriquecida
df_gold_clientes = (df_silver_clientes
    .select("accountid", "name", "industrycode", "address1_country", "revenue")
    .withColumnRenamed("name", "nombre_cliente")
)

# Fact de solicitudes con métricas
df_gold_solicitudes = (df_silver_sol
    .join(df_gold_clientes, df_silver_sol.sit_cuentaid == df_gold_clientes.accountid, "left")
    .groupBy("categoria_analisis", "nombre_cliente", "address1_country",
              F.date_format("fecha_creacion_utc", "yyyy-MM").alias("mes_creacion"))
    .agg(
        F.count("sit_solicitudid").alias("total_solicitudes"),
        F.avg("dias_hasta_vencimiento").alias("avg_dias_vencimiento"),
        F.sum("sit_presupuesto").alias("presupuesto_total"),
        F.countDistinct("sit_responsable").alias("responsables_unicos")
    )
)

df_gold_solicitudes.write.format("delta").mode("overwrite").save(".../gold_solicitudes_resumen")
```

#### Actividad 34.3: Power BI con DirectLake
1. En Fabric → Power BI → Nuevo Dataset
2. Seleccionar: DirectLake mode (lee del Gold layer del Lakehouse directamente)
3. Seleccionar tablas Gold: `gold_solicitudes_resumen`, `gold_clientes`, `dim_calendar`
4. Ventaja: rendimiento cercano a Import mode sin los límites de frescura de datos

```dax
// DAX sobre el Gold Layer (ya pre-calculado, las medidas son simples)
Total Solicitudes = SUM(gold_solicitudes_resumen[total_solicitudes])

Presupuesto Promedio por Cliente = 
DIVIDE(
    SUM(gold_solicitudes_resumen[presupuesto_total]),
    DISTINCTCOUNT(gold_solicitudes_resumen[nombre_cliente]),
    0
)
```

#### Actividad 34.4: Data Activator — alertas automáticas
1. En Fabric → Real-Time Analytics → Data Activator
2. Conectar al stream de Dataverse (vía Event Hubs)
3. Crear regla de alerta:
   ```
   CUANDO: solicitud.sit_prioridad = "Urgente" 
   Y solicitud.sit_estado = "Nuevo"
   Y tiempo_sin_asignar > 30 minutos
   
   ENTONCES:
     - Enviar Teams notification a queue de Urgentes
     - Crear registro de escalamiento en Dataverse
     - Cambiar sit_estado a "Escalado"
   ```

### 💼 Caso Real de Negocio
**Empresa:** Retailer con 50 tiendas, datos en D365, SAP, y WMS  
**Problema:** El equipo de BI tardaba 3 días en producir el reporte mensual de ventas porque debían extraer de 3 sistemas, limpiar en Excel y consolidar manualmente. Decisiones tomadas con datos desactualizados.  
**Solución:** Fabric Lakehouse como single source of truth. Dataverse Link exporta CRM en tiempo real. ADF sincroniza SAP y WMS al Bronze layer. Notebooks Silver/Gold automatizan la transformación. DirectLake permite que Power BI lea datos del día anterior sin importación.  
**Resultado:** Reporte mensual: de 3 días a disponible el día 1 del mes. Decisiones de reabastecimiento basadas en datos del día anterior (antes eran de hace 1 semana).

### ✅ Buenas Prácticas
- Dataverse Link a Fabric es la integración preferida — sin código, sin pipelines adicionales
- Bronze = inmutable (datos crudos), Silver = curado, Gold = orientado al negocio
- DirectLake sobre Gold es el sweet spot: velocidad de Import + frescura de DirectQuery
- Diseñar el Gold layer pensando en Power BI — desnormalizar para evitar joins complejos en DAX

### 🧪 Criterios de Validación
- [ ] Dataverse Link configurado exporta 5+ tablas al Lakehouse de Fabric
- [ ] Notebook Bronze→Silver limpia y estandariza datos correctamente
- [ ] Gold layer tiene métricas de negocio pre-calculadas
- [ ] Power BI en DirectLake muestra datos del Gold layer sin errores
- [ ] Data Activator genera alerta cuando se cumple la condición de negocio configurada

---

## MÓDULO 35: Seguridad y Cumplimiento Enterprise

### 🎯 Objetivo
Implementar una postura de seguridad Zero Trust para Power Platform: clasificación de datos con Microsoft Purview, Customer-Managed Keys, Privileged Identity Management para administradores, auditoría avanzada con Microsoft Sentinel, y cumplimiento regulatorio documentado.

### 📖 Conceptos Clave
- **Zero Trust:** "Nunca confiar, siempre verificar" — verificar identidad, validar dispositivo, mínimo privilegio
- **Microsoft Purview:** plataforma de gobernanza de datos — clasificación, etiquetado, DLP avanzado
- **Sensitivity Labels:** etiquetas que siguen al dato donde va (email, SharePoint, Power BI)
- **Customer-Managed Keys (CMK):** cifrar datos de Dataverse con claves en Azure Key Vault propias del cliente
- **PIM (Privileged Identity Management):** acceso JIT (just-in-time) a roles privilegiados
- **Microsoft Sentinel:** SIEM/SOAR cloud-native — detecta y responde a amenazas automáticamente
- **Conditional Access:** políticas de Azure AD que controlan el acceso según condiciones (dispositivo, ubicación, riesgo)
- **CASB (Cloud Access Security Broker):** Microsoft Defender for Cloud Apps — visibilidad de shadow IT
- **Power Platform Admin Activity logs:** exportar a Azure Monitor/Sentinel para análisis
- **Data Exfiltration prevention:** prevenir que datos de Dataverse salgan por canales no autorizados

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 35.1: Clasificación de datos con Purview
1. Microsoft Purview → Data Catalog → Register source → Dynamics 365
2. Scan: escanear automáticamente tablas de Dataverse y clasificar datos sensibles
3. Clasificaciones detectadas:
    - `Credit Card Number` en columna sit_tarjetacredito
    - `Personal Email` en emailaddress1 de Contact
    - `National ID Number` en sit_numerodocumento

4. Crear Sensitivity Labels:
    - `Confidencial - Datos Personales`: aplica cifrado + protección de copia
    - `Interno - Solo empleados`: previene compartir externamente
    - `Público`: sin restricciones

5. Política de auto-etiquetado: cuando Purview detecta dato personal → aplicar label `Confidencial - Datos Personales`

#### Actividad 35.2: Customer-Managed Keys
1. Azure Key Vault → Crear clave RSA-2048: `DataverseCMK`
2. Configurar Key Rotation automática cada 12 meses
3. Admin Center → Ambientes → Configuración → Encryption → Customer-managed key
4. Seleccionar el Key Vault y la clave
5. La activación puede tardar horas — todos los datos del ambiente se re-cifran
6. Implicación: si se revoca la clave, el ambiente queda completamente inaccesible

#### Actividad 35.3: PIM para administradores de Power Platform
1. Azure AD → Privileged Identity Management → Roles de Azure AD
2. Configurar rol `Power Platform Administrator` como "Elegible" (no permanente)
3. Configuración del rol:
    - Duración máxima de activación: 8 horas
    - Requiere: justificación de negocio + aprobación de manager
    - MFA obligatorio para activar
    - Notificación al Security team

4. Proceso cuando admin necesita acceder:
    - PIM → Activar rol → ingresar justificación
    - Manager recibe email de aprobación → aprueba
    - Admin tiene acceso por máx 8 horas
    - Todas las acciones quedan en el log de auditoría

#### Actividad 35.4: Exportar logs a Microsoft Sentinel
1. Admin Center → Diagnostic settings → Add diagnostic setting
2. Logs a exportar:
    - PowerApps Activity
    - Power Automate Activity  
    - Dataverse Audit Logs

3. Destino: Azure Log Analytics Workspace (conectado a Sentinel)
4. En Sentinel → KQL queries para detectar anomalías:
   ```kql
   // Detectar descargas masivas de datos (posible exfiltración)
   PowerAppsActivity
   | where ActivityDateTime > ago(1h)
   | where Operation == "DataExport" or Operation == "RetrieveMultiple"
   | summarize count_ops = count(), 
               total_records = sum(toint(parse_json(AdditionalInfo).RecordCount))
               by UserId, bin(ActivityDateTime, 5m)
   | where total_records > 10000
   | project ActivityDateTime, UserId, count_ops, total_records
   | order by total_records desc
   
   // Detectar acceso fuera de horario laboral
   PowerAppsActivity
   | where ActivityDateTime > ago(24h)
   | extend hora = hourofday(ActivityDateTime)
   | where hora < 6 or hora > 22  // fuera de 6am-10pm
   | where IpAddress !startswith "10." // no es red interna
   | summarize count() by UserId, IpAddress, AppName
   | where count_ > 5
   ```

5. Crear Alert Rules en Sentinel:
    - "Descarga masiva de datos > 10,000 registros en 5 min" → Severidad Alta
    - "Acceso a PROD fuera de horario desde IP externa" → Severidad Media

#### Actividad 35.5: Conditional Access para Power Platform
1. Azure AD → Conditional Access → Nueva política
2. Nombre: `PP-Producción-MFA-Dispositivo-Cumplimiento`
3. Usuarios: todos, excepto cuentas de break-glass
4. Apps de nube: `Power Apps`, `Power Automate`, `Microsoft Flow`
5. Condiciones:
    - Plataformas de dispositivos: Any (para capturar todos)
    - Ubicaciones: fuera de IPs corporativas

6. Controles de acceso:
    - Requerir MFA
    - Requerir dispositivo marcado como cumplimiento (Intune)
    - Requerir app cliente aprobada

7. Modo: Reporte (audit first) → cambiar a Enforced después de 2 semanas

### 💼 Caso Real de Negocio
**Empresa:** Empresa de salud con datos de pacientes en Dataverse  
**Problema:** Auditoría de HIPAA/HITECH reveló que los logs de acceso a datos de pacientes no se estaban conservando. Un ex-empleado descargó datos de 50,000 pacientes en su último día de trabajo y nadie lo detectó hasta 3 meses después.  
**Solución:** Sentinel con regla de detección de descarga masiva hubiera alertado en tiempo real. CMK para que los datos sean inaccesibles sin la clave corporativa. PIM para acceso a datos de producción con aprobación. Purview clasifica automáticamente datos de pacientes.  
**Resultado:** Brecha similar detectada en 4 minutos en el simulacro post-implementación. Cumplimiento HIPAA certificado en auditoría siguiente.

### ✅ Buenas Prácticas
- CMK es irreversible en muchos casos — probar en ambiente sandbox primero
- PIM con duración máxima de 8h para administración rutinaria; proceso de emergencia separado (break-glass accounts)
- Los logs de Power Platform en Sentinel deben retener mínimo 90 días (GDPR) o 1 año (regulaciones financieras)

### 🧪 Criterios de Validación
- [ ] Purview escanea el ambiente Dataverse y clasifica datos sensibles correctamente
- [ ] PIM configurado para rol Power Platform Admin — activación requiere justificación y MFA
- [ ] Logs exportados a Log Analytics y query KQL detecta descarga masiva simulada
- [ ] Conditional Access bloquea acceso a Power Platform desde dispositivo no cumpliente

---

## MÓDULO 36: AI Builder y Azure AI integrado

### 🎯 Objetivo
Integrar capacidades de Inteligencia Artificial en soluciones Power Platform usando AI Builder nativo y Azure AI Services: modelos de clasificación de documentos, extracción de información de facturas, análisis de sentimiento, y orquestación de agentes con Azure OpenAI y Semantic Kernel.

### 📖 Conceptos Clave
- **AI Builder:** IA sin código integrada en Power Platform — modelos pre-construidos y personalizados
- **Document Processing (Form Recognizer):** extrae campos de formularios y documentos
- **Object Detection:** detecta y clasifica objetos en imágenes
- **Text Classification:** clasifica texto en categorías (positivo/negativo, urgente/normal)
- **Prediction Model:** predice resultados basado en datos históricos de Dataverse
- **Azure OpenAI Service:** modelos GPT-4 en infraestructura Azure (con contratos de privacidad enterprise)
- **Semantic Kernel:** SDK de Microsoft para orquestar LLMs con plugins y memoria
- **Prompt Engineering:** diseñar prompts efectivos para modelos de lenguaje
- **Grounding:** anclar respuestas del LLM a documentos corporativos específicos
- **Azure AI Document Intelligence:** versión enterprise de Form Recognizer con modelos pre-trained

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 36.1: AI Builder — Document Processing para facturas
1. make.powerapps.com → AI Builder → Construir → Procesamiento de documentos
2. Tipo: Documentos estructurados (facturas tienen formato consistente)
3. Cargar 5+ facturas de ejemplo como training data
4. Definir campos a extraer:
    - Número de factura
    - Fecha
    - NIT/RFC del proveedor
    - Total
    - Lista de líneas (producto, cantidad, precio)

5. Entrenar el modelo (puede tomar 30–60 minutos)
6. Probar con una factura nueva → verificar exactitud de extracción
7. Publicar el modelo

#### Actividad 36.2: Usar AI Builder en Power Automate
```
Flujo: Procesar facturas de email automáticamente

Trigger: When email arrives (Outlook)
  Filter: Subject contains "Factura" or From: @proveedores.com

Acción: Get Attachment (obtener el PDF adjunto)

Acción: AI Builder — Process and save information from documents
  Document type: Facturas (el modelo entrenado)
  Document: Body adjunto del email

Condición: Confidence score >= 0.85 (alta confianza)
  TRUE:
    Acción: Create row (Dataverse - Factura)
      sit_numero: outputs('AI_Builder')?['fields']?['NumeroFactura']?['value']
      sit_fecha: outputs('AI_Builder')?['fields']?['Fecha']?['value']
      sit_total: outputs('AI_Builder')?['fields']?['Total']?['value']
      sit_proveedor: outputs('AI_Builder')?['fields']?['NIT']?['value']
    Acción: Reply to email "Factura procesada automáticamente: [número]"
  FALSE:
    Acción: Create task para revisión manual
    Acción: Reply "Factura requiere revisión manual. Un agente la procesará."
```

#### Actividad 36.3: Azure OpenAI en Power Automate
1. Crear recurso Azure OpenAI en Azure Portal
2. Deploy model: `gpt-4` (para análisis complejo) o `gpt-4o-mini` (para respuestas rápidas)
3. En Power Automate → Acción HTTP para llamar a Azure OpenAI:
```
Acción: HTTP
Method: POST
URI: https://tu-recurso.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-01
Headers:
  api-key: @{parameters('AzureOpenAIKey')}
  Content-Type: application/json
Body:
{
  "messages": [
    {
      "role": "system",
      "content": "Eres un analista de soporte técnico de SIT Consulting. Clasifica el siguiente caso de soporte en una de estas categorías: Hardware, Software, Red, Accesos, Otro. Responde ÚNICAMENTE con la categoría, sin explicación."
    },
    {
      "role": "user", 
      "content": "Descripción del caso: @{triggerOutputs()?['body/sit_descripcion']}"
    }
  ],
  "max_tokens": 20,
  "temperature": 0
}
```
4. Parsear respuesta y actualizar el caso:
```
Set column sit_categoriaai = first(body('HTTP_OpenAI')?['choices'])?['message']?['content']
```

#### Actividad 36.4: Prediction Model con AI Builder
1. AI Builder → Predicción → Nuevo modelo
2. Tabla: Oportunidades de Dataverse
3. Columna a predecir: `sit_ganada` (SI/NO — si la oportunidad se cerró ganada)
4. Columnas de entrada (features):
    - sit_monto_estimado, sit_probabilidad, sit_etapa
    - sit_origen, sit_sector_cliente, sit_tipo_contacto
    - Días desde creación hasta el momento actual

5. Entrenar con historial de 2+ años de oportunidades
6. Publicar y usar en Canvas App:
   ```js
   // En Canvas App — predicción en tiempo real mientras el vendedor llena la oportunidad
   Set(varPrediccionGana,
       'PredictOpportunityWin'.Predict({
           sit_monto_estimado: numMonto.Value,
           sit_probabilidad: slProbabilidad.Value,
           sit_origen: ddOrigen.Selected.Value
       })
   );
   // varPrediccionGana.Probability → muestra "85% probabilidad de ganar"
   ```

#### Actividad 36.5: Copilot Studio con Azure OpenAI Generative Answers
1. Copilot Studio → Configuración → Generative AI → Azure OpenAI
2. Conectar con el recurso Azure OpenAI propio (no el servicio compartido de Microsoft)
3. Ventaja: los datos de conversación NO se usan para entrenar el modelo de Microsoft
4. System prompt avanzado:
   ```
   Eres el asistente virtual de SIT Consulting especializado en soporte de Power Platform.
   
   REGLAS ESTRICTAS:
   1. Solo responde sobre temas de Power Platform, Dynamics 365 y Microsoft 365
   2. Si no encuentras la respuesta en los documentos de la Knowledge Base, di: "No tengo información verificada sobre eso. Te recomiendo consultar con el equipo técnico."
   3. Nunca generes código que no hayas visto en la Knowledge Base
   4. Cita siempre el documento fuente cuando respondas una pregunta técnica
   5. Si el usuario pregunta sobre precios, redirige a "contacta ventas en ventas@sitconsulting.com"
   
   TONO: Profesional pero amigable. Usa ejemplos concretos. Respuestas de máx 3 párrafos.
   ```

### 💼 Caso Real de Negocio
**Empresa:** Firma de contabilidad que procesa 2,000 facturas mensuales  
**Problema:** 5 personas dedicadas exclusivamente a tipear datos de facturas físicas al sistema. Error rate: 3% (60 facturas con errores que causaban diferencias en pagos).  
**Solución:** AI Builder Document Processing con 95% de exactitud promedio. Las facturas con confianza < 85% van a revisión humana (solo 8% del total). Para las que pasan, el flujo de Power Automate crea el registro automáticamente en D365.  
**Resultado:** 5 personas reubicadas a trabajo de mayor valor. Error rate: 0.3% (solo en facturas revisadas manualmente mal procesadas). ROI: 18 meses.

### ✅ Buenas Prácticas
- AI Builder Prediction requiere mínimo 50 registros de entrenamiento (idealmente 500+)
- Azure OpenAI en producción SIEMPRE con tu propio recurso — no el endpoint compartido
- Temperature=0 para clasificación (respuesta determinista); temperature>0 para generación creativa
- Monitorear el accuracy del modelo AI Builder mensualmente — los datos cambian con el tiempo

### 🧪 Criterios de Validación
- [ ] Modelo Document Processing extrae campos de facturas con > 85% de confianza
- [ ] Flujo procesa email con factura adjunta y crea registro en Dataverse automáticamente
- [ ] Azure OpenAI clasifica casos de soporte con temperatura 0 (resultado determinista)
- [ ] Prediction Model entrenado y disponible como acción en Canvas App

---

## MÓDULO 37: Liderazgo Técnico y Gestión de Proyectos

### 🎯 Objetivo
Desarrollar las competencias de liderazgo técnico necesarias para el rol de Solution Architect: conducir workshops de descubrimiento, estimar proyectos con precisión, gestionar riesgos, comunicar decisiones técnicas al C-suite, y liderar equipos de Fusion Development.

### 📖 Conceptos Clave
- **Discovery Workshop:** sesión estructurada para entender los requerimientos de negocio antes de proponer tecnología
- **Fit-Gap Analysis:** mapear requerimientos del cliente contra capacidades de Power Platform
- **Solution Blueprint:** documento de arquitectura de alto nivel que antecede al desarrollo
- **Statement of Work (SoW):** contrato técnico que define alcance, entregables, y exclusiones
- **Risk Register:** identificar, clasificar y mitigar riesgos desde el inicio del proyecto
- **WBS (Work Breakdown Structure):** descomposición del proyecto en tareas estimables
- **RACI Matrix:** Responsible, Accountable, Consulted, Informed — claridad de roles
- **Velocity (Agile):** capacidad del equipo medida en story points por sprint
- **Technical Debt:** decisiones de implementación subóptimas que deberán pagarse después
- **Change Request Process:** proceso formal para manejar cambios al scope aprobado

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 37.1: Plantilla de Discovery Workshop
```markdown
# Discovery Workshop Agenda — [Cliente] / [Proyecto]
**Duración:** 2 días (8h c/u) | **Asistentes:** C-suite + IT + usuarios clave

## Día 1: Contexto y Estado Actual (AS-IS)

### Bloque 1: Contexto estratégico (90 min)
- ¿Cuáles son los 3 objetivos estratégicos de la empresa para los próximos 2 años?
- ¿Qué problemas de negocio le quitan el sueño al CEO?
- ¿Cómo se mide el éxito de este proyecto? (KPIs concretos)

### Bloque 2: Proceso actual (2h)
- Mapeo del proceso AS-IS (whiteboard)
- ¿Qué sistemas usan actualmente?
- ¿Cuáles son los puntos de dolor más grandes?
- ¿Qué workarounds manuales tienen?

### Bloque 3: Usuarios y volúmenes (90 min)
- ¿Quiénes son los usuarios? (roles, cantidad, ubicación, idioma)
- ¿Cuál es el volumen de transacciones? (registros/día, pico)
- ¿Dispositivos? (desktop, mobile, offline requirements?)

## Día 2: Estado Futuro (TO-BE) y Priorización

### Bloque 4: Visión TO-BE (2h)
- Diseñar el proceso ideal (sin restricciones tecnológicas primero)
- ¿Qué decisiones automatizarías si pudieras?
- ¿Qué información necesitas en tiempo real que hoy no tienes?

### Bloque 5: Fit-Gap Analysis (2h)
- Por cada requerimiento: ¿está cubierto en la plataforma? (Fit / Gap / Workaround)
- Priorización MoSCoW: Must Have / Should Have / Could Have / Won't Have

### Bloque 6: Riesgos y siguiente paso (1h)
- Top 5 riesgos identificados
- Definir: MVP del proyecto
- Fecha de kick-off y entregables de la siguiente fase
```

#### Actividad 37.2: Fit-Gap Analysis Document
```markdown
# Fit-Gap Analysis — Sistema CRM

| # | Requerimiento | Prioridad | Fit / Gap | Observación |
|---|--------------|-----------|-----------|-------------|
| 1 | Gestión de oportunidades comerciales | Must Have | ✅ Fit | D365 Sales cubre 100% |
| 2 | Propuestas con firma digital | Must Have | ⚠️ Partial | Requiere integración con DocuSign o Adobe Sign |
| 3 | Integración en tiempo real con SAP MM | Must Have | ⚠️ Gap | Requiere desarrollo: Custom Connector + Logic App |
| 4 | Análisis predictivo de churn | Should Have | ⚠️ Gap | AI Builder Prediction — requiere 6 meses de datos históricos |
| 5 | App móvil offline para vendedores en campo | Must Have | ✅ Fit | Canvas App con modo offline |
| 6 | Chatbot para consultas de clientes | Could Have | ✅ Fit | Copilot Studio — post-MVP |
| 7 | Integración con sistema de nómina local | Won't Have | ❌ Excluido | Fuera del alcance de este proyecto |

**Resumen:** 
- Fits: 3 (43%) — sin desarrollo adicional
- Partial/Gaps: 3 (43%) — requieren desarrollo
- Won't Have: 1 (14%) — excluidos del scope
```

#### Actividad 37.3: Plantilla de estimación
```markdown
# Estimación — Proyecto CRM SIT (v1.2)

## Supuestos clave
- Team: 1 Arquitecto + 2 Developers + 1 QA (50% tiempo cada uno)
- Sprint: 2 semanas, 8 story points de capacidad por developer por sprint
- Incluye: development, testing, documentación básica
- No incluye: infraestructura Azure (billing separado), licencias, migración de datos legacy

## WBS y Estimaciones

| Módulo | Tarea | Story Points | Semanas |
|--------|-------|-------------|---------|
| Setup | Configurar ambientes DEV/TEST/PROD | 5 | 1 |
| Setup | Pipeline CI/CD Azure DevOps | 8 | 1.5 |
| Data Model | Tablas Dataverse + relaciones | 13 | 2 |
| Data Model | Security Roles + Field Security | 8 | 1.5 |
| Canvas App | 5 pantallas principales | 20 | 3.5 |
| Canvas App | Component Library (3 componentes) | 8 | 1.5 |
| Power Automate | Flujo aprobación propuestas | 13 | 2 |
| Power Automate | Integración SAP | 20 | 3.5 |
| Model-Driven | Formularios y vistas | 8 | 1.5 |
| Power BI | Dashboard ejecutivo + RLS | 13 | 2 |
| Testing | QA end-to-end + UAT support | 20 | 3.5 |
| Deployment | Deploy a PROD + documentación | 8 | 1.5 |
| **TOTAL** | | **144 SP** | **25 sem** |

## Contingencia
Buffer del 20% para imprevistos: +5 semanas
**Total estimado: 30 semanas (~7 meses)**

## Nota de riesgo
El item de integración SAP tiene la mayor incertidumbre (±50%). 
Si el API de SAP no tiene documentación actualizada, podría requerir +2 semanas adicionales.
```

#### Actividad 37.4: Comunicar arquitectura al C-suite
Regla de oro: **La audiencia ejecutiva no quiere detalles técnicos — quiere resultados de negocio**

Mal ejemplo: "Implementaremos Dataverse con 12 tablas personalizadas, un plugin C# pre-operation para validación de SLA, PCF controls basados en React, y pipelines CI/CD en Azure DevOps con YAML."

Buen ejemplo: "En 7 meses tendrán un sistema donde los vendedores ven en tiempo real si hay stock disponible en SAP antes de comprometer una fecha al cliente — eliminando el 90% de las entregas tardías. El sistema aprende de su historial de ventas para predecir qué clientes están en riesgo de cancelar, dando a los gerentes la información necesaria para actuar antes de perder la cuenta."

### 💼 Caso Real de Negocio
**Situación:** Un arquitecto presentó la propuesta técnica al CFO con 40 slides de diagramas de arquitectura. El CFO interrumpió en el slide 5: "Todo eso está muy bien, pero ¿cuánto me cuesta y en cuánto tiempo lo veo funcionando?"  
**Lección:** Slides 1-3 = problema de negocio y ROI esperado. Slides 4-6 = solución en lenguaje de negocio. Apéndice = detalles técnicos para quien los pida.  
**Resultado del arquitecto que aprendió esto:** tasa de cierre de propuestas subió de 30% a 65%.

### ✅ Buenas Prácticas
- El Discovery Workshop debe generar el SoW, no el SoW debe generar el Discovery
- Nunca comprometer fechas en el Discovery — primero estimar, luego comprometer
- Risk Register: revisar semanalmente con el cliente — no solo al inicio
- Las estimaciones con ±30% de incertidumbre son válidas; sé honesto sobre la incertidumbre

### 🧪 Criterios de Validación
- [ ] Discovery Workshop agenda diseñada para un cliente real o simulado
- [ ] Fit-Gap Analysis con 10+ requerimientos clasificados MoSCoW
- [ ] Estimación por módulo con story points y semanas, incluyendo buffer de contingencia
- [ ] Presentación de 10 slides del proyecto: las primeras 3 en lenguaje de negocio, sin jerga técnica

---

## MÓDULO 38: Casos de Transformación Digital

### 🎯 Objetivo
Analizar y diseñar soluciones para los patrones más comunes de transformación digital con Power Platform: modernización de sistemas legacy, digitalización de procesos manuales, portales de autoservicio, y automatización de operaciones.

### 📖 Conceptos Clave
- **Transformación digital:** no es solo tecnología — es rediseñar procesos, cultura y modelo de negocio habilitados por tecnología
- **Legacy Modernization:** migrar aplicaciones antiguas (Access, Excel, sistemas custom) a Power Platform
- **Process Mining:** analizar logs de sistemas para descubrir cómo realmente se ejecutan los procesos (vs cómo se supone que deben ejecutarse)
- **Hyperautomation:** combinar RPA (Robotic Process Automation), AI y Power Automate para automatizar todo lo automatizable
- **Digital Twin:** réplica digital de un proceso físico para simulación y optimización
- **Change Management:** el 70% de las transformaciones fallidas se deben a resistencia al cambio, no a tecnología

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 38.1: Caso — Modernización de sistema Access/Excel
```markdown
## Escenario: Gestión de inventario en Excel con 15 años de historia

Situación actual (AS-IS):
- 5 archivos Excel con macros VBA que solo una persona sabe mantener
- Datos duplicados entre archivos
- No hay historial de cambios
- 3 personas actualizando manualmente el mismo "sistema"

Análisis de dolor:
- 2 horas/día perdidas en conciliar los archivos entre sí
- 1 vez al mes hay pérdida de datos por sobreescritura
- El único experto del Excel está a punto de jubilarse

Solución Power Platform:
1. Migrar datos a Dataverse (migración con Power Query desde Excel)
2. Model-Driven App para gestión de inventario (formularios, vistas, flujos)
3. Canvas App mobile para el almacenero (escaneo de código de barras)
4. Power Automate para alertas de stock mínimo
5. Power BI para dashboard de rotación de inventario

Estrategia de migración:
  Semana 1-2: Migrar datos históricos con Power Query (limpieza incluida)
  Semana 3-4: Correr en paralelo (Excel + Dataverse) — validar consistencia
  Semana 5: Apagar Excel, solo Dataverse
  
ROI:
- 2h/día × 5 días × 48 semanas × $25/hora = $12,000/año solo en tiempo ahorrado
- Costo del proyecto: $25,000
- Payback: ~2 años
```

#### Actividad 38.2: Caso — RPA + Power Automate Hyperautomation
```markdown
## Escenario: Procesamiento de solicitudes de crédito

Situación actual:
- Analista recibe solicitud por email
- Abre el portal del buró de crédito manualmente
- Copia el score a Excel
- Llena el formulario del sistema interno manualmente
- Aprueba o rechaza basándose en tabla de reglas en papel

Tiempo: 45 minutos por solicitud × 50 solicitudes/día = 37.5 horas/día

Hyperautomation con Power Platform:
1. Power Automate cloud: recibe email → crea registro en Dataverse
2. Power Automate Desktop (RPA): 
   - Abre portal del buró (sistema legado sin API)
   - Ingresa número de documento del solicitante
   - Extrae el score crediticio con scraping de la página
   - Retorna el score al flujo cloud
3. AI Builder: 
   - Analiza los documentos adjuntos (comprobante de ingresos, cedula)
   - Extrae ingresos declarados y valida con score del buró
4. Plugin C#:
   - Ejecuta las reglas de aprobación automática
   - Si califica → aprueba automáticamente con flag "auto-aprobado"
   - Si no califica → asigna a analista humano con toda la info preparada
5. Power BI: dashboard de tiempo de procesamiento y tasa de auto-aprobación

Resultado esperado:
- 70% de solicitudes auto-aprobadas en < 5 minutos
- 30% que requieren revisión humana: analista recibe toda la info lista (no desde cero)
- Tiempo analista por caso revisado: de 45 min a 10 min
```

#### Actividad 38.3: Arquitectura de referencia — Portal de Autoservicio B2C
```
[Cliente externo]
    → Registro con Azure AD B2C
    → Power Pages portal
        → Crear solicitudes (Entity Form → Dataverse)
        → Ver estado de sus casos (Table Permission = Contact)
        → Descargar documentos (Azure Blob Storage vía SAS token)
        → Chat con bot (Copilot Studio embebido en el portal)
    
[Backend automático]
    → Power Automate procesa la solicitud
    → Plugin C# valida reglas de negocio
    → Notificaciones automáticas al cliente (email + push notification)
    
[Agentes internos]
    → D365 Customer Service (ven todos los casos)
    → Escalamiento desde el bot al agente humano (Omnichannel)
    
[Analytics]
    → Fabric Lakehouse: datos de Dataverse + interacciones del portal
    → Power BI: KPIs de autoservicio (% resueltos por bot vs humano)
```

### 💼 Caso Real de Negocio
**Empresa:** Aseguradora con proceso de renovación de pólizas 100% manual  
**Problema:** 3 empleados dedicados solo a enviar emails de recordatorio de renovación y procesar los formularios en papel que llegaban por correo físico.  
**Solución:** Power Pages para que el asegurado renueve en línea. Power Automate envía recordatorios 60/30/15 días antes. AI Builder extrae datos del formulario si llega en PDF. D365 actualiza la póliza automáticamente. Solo los casos con excepciones llegan a los empleados.  
**Resultado:** Proceso 85% automatizado. Los 3 empleados fueron reubicados a ventas (mayor valor). Tasa de renovación mejoró de 68% a 79% porque los recordatorios ahora son personalizados y oportunos.

### ✅ Buenas Prácticas
- Empezar la transformación por el proceso de mayor dolor — genera credibilidad rápida
- Ejecutar siempre en paralelo (legacy + nueva solución) antes de apagar el sistema antiguo
- Change Management es la mitad del proyecto — no es un anexo
- Medir el impacto con KPIs concretos desde el inicio — no después

### 🧪 Criterios de Validación
- [ ] Análisis AS-IS documentado para un proceso real con métricas de dolor cuantificadas
- [ ] Diseño TO-BE con Power Platform que ataca cada punto de dolor identificado
- [ ] Cálculo de ROI con supuestos documentados (costo/hora, tiempo ahorrado, etc.)
- [ ] Plan de migración de sistema legacy con semanas de ejecución paralela antes del cutover

---

## MÓDULO 39: Preparación PL-600

### 🎯 Objetivo
Dominar los dominios del examen PL-600 (Power Platform Solution Architect Expert), practicar con casos de estudio de arquitectura, y desarrollar la mentalidad del arquitecto que el examen evalúa.

### 📖 Conceptos Clave del Examen PL-600

**Dominio 1: Realizar análisis de solución (35-40%)**

- Análisis de requerimientos y soluciones existentes
- Evaluación de plataforma vs customización
- Análisis de riesgo y viabilidad
- Estrategia de migración de datos

**Dominio 2: Diseñar una solución (40-45%)**

- Arquitectura de aplicaciones
- Estrategia de datos y seguridad
- Integración con otros sistemas
- Estrategia de ALM
- Estrategia de inteligencia artificial

**Dominio 3: Implementar la solución (15-20%)**

- Guiar al equipo de desarrollo
- Validar que la implementación sigue la arquitectura
- Gestión de calidad

### 👨‍💻 Práctica con Casos de Estudio

#### Caso de estudio 1 — Pregunta típica PL-600
```
Escenario:
Una empresa farmacéutica con 5,000 empleados en 12 países necesita implementar 
un sistema de gestión de ensayos clínicos. Los datos de pacientes son extremadamente 
sensibles (HIPAA, GDPR). El sistema debe integrarse con 3 laboratorios externos que 
usan sistemas distintos. Los reguladores necesitan acceso de solo lectura a ciertos datos.
El CTO quiere que todo esté funcionando en 8 meses.

Pregunta: ¿Qué componentes de Power Platform usarías y cuáles son los 3 riesgos principales?

Respuesta esperada de un arquitecto:
Componentes:
- Dataverse como sistema de registro (modelo de datos central)
- Customer-Managed Keys (CMK) para cumplimiento HIPAA/GDPR
- Power Pages para portal de acceso de reguladores (con Azure AD B2C)
- Model-Driven App para gestión interna
- Azure APIM para integrar los 3 laboratorios externos sin exponerlos directamente
- Azure Logic Apps para integraciones complejas (EDI/HL7 con laboratorios)
- Power BI con RLS para que cada país vea solo sus datos

Riesgos principales:
1. Dato de pacientes → GDPR requiere residencia en EU, HIPAA en US → solución: ambientes separados por región
2. Integración con sistemas HL7 de laboratorios → posiblemente requiere Integration Account en Logic Apps → impacto en estimación
3. 8 meses es agresivo para un sistema HIPAA con 3 integraciones → negociar MVP con 2 laboratorios primero

Lo que NO haría un arquitecto (respuestas incorrectas):
- "Pondría todo en una sola solución" (sin multi-solution architecture)
- "Usaría SharePoint Lists para los datos de pacientes" (no escala, no HIPAA compliant)
- "El equipo de desarrollo resolverá la integración, yo solo diseño" (un arquitecto guía la implementación)
```

#### Caso de estudio 2 — Preguntas de selección
```
Pregunta: Una empresa quiere que sus 500 vendedores móviles puedan ver y actualizar datos 
de clientes desde zonas sin internet. ¿Qué tecnología usarías?

A) SharePoint + Power Automate
B) Canvas App con modo offline habilitado y Dataverse local cache
C) Power Pages
D) Model-Driven App

Respuesta correcta: B
Por qué: Canvas App soporta modo offline con SaveData/LoadData y la nueva 
Offline Profile feature. SharePoint no tiene modo offline robusto. Power Pages 
es para usuarios externos. Model-Driven tiene soporte offline pero es más limitado.
```

#### Actividad 39.1: Banco de preguntas por dominio
Practicar con las siguientes áreas donde el examen tiende a ser más difícil:

**Área 1: Elegir entre Canvas y Model-Driven**

- Canvas: UX personalizada, mobile-first, offline, múltiples fuentes de datos
- Model-Driven: datos relacionales complejos, BPF, vistas y formularios rápidos de configurar

**Área 2: Cuándo escalar a código vs configuración**

- Configuración: Business Rules, Power Automate, reglas de Dataverse
- Código C#: validaciones que deben ser imposibles de eludir, lógica de integración síncrona compleja, performance crítica

**Área 3: Strategy de ALM**

- Siempre managed solution a PROD
- Connection References + Environment Variables obligatorias
- Solution Checker antes de cualquier importación

**Área 4: Integración**

- Power Automate para integraciones simples sin requisitos de SLA estrictos
- Logic Apps para integraciones enterprise con EDI, B2B, transformaciones complejas
- Azure Functions para lógica de integración custom que requiere código

#### Actividad 39.2: Recursos de preparación
```markdown
## Plan de estudio PL-600 (8 semanas antes del examen)

Semana 1-2: Revisar learn.microsoft.com/certifications/exams/pl-600
  - Leer todo el "Study Guide" oficial
  - Identificar los domains con menor puntaje en el self-assessment

Semana 3-4: Practice tests
  - MeasureUp PL-600 practice test (oficial de Microsoft)
  - Si score < 70%: repasar el domain con menor puntaje

Semana 5-6: Casos de estudio
  - Leer 3 casos de estudio del blog de Microsoft Power Platform
  - Para cada uno: diseñar la arquitectura antes de ver la solución

Semana 7: Repaso intensivo
  - Revisar todos los ADRs y decisiones arquitectónicas del Nivel 3 y 4
  - Repasar: cuándo usar cada componente de Power Platform

Semana 8: Simulacro y descanso
  - Día 1-5: simulacro de examen completo (90 minutos, 60 preguntas)
  - Día 6-7: descanso — no estudiar el día antes del examen

## Recursos gratuitos
- Microsoft Learn: Power Platform Solution Architect learning path
- GitHub: PL-600 study guide community notes
- YouTube: John Savill's Technical Training (arquitectura de referencia)
```

### ✅ Buenas Prácticas
- El PL-600 evalúa pensamiento arquitectónico, no memorización — practicar con casos reales
- En el examen: preguntar "¿qué haría un arquitecto senior en esta situación?" no "¿cuál opción es técnicamente correcta?"
- Programar el examen DESPUÉS de completar el proyecto capstone (Módulo 40) — la experiencia práctica es irremplazable

### 🧪 Criterios de Validación
- [ ] Self-assessment de los 3 dominios PL-600 con puntaje por dominio
- [ ] 3 casos de estudio resueltos con justificación de decisiones arquitectónicas
- [ ] Practice test: score ≥ 70% en simulacro antes de agendar el examen real
- [ ] Examen PL-600 agendado (fecha concreta)

---

## MÓDULO 40: Proyecto Capstone — Arquitectura Enterprise

### 🎯 Objetivo
Diseñar e implementar una solución enterprise completa de inicio a fin, aplicando todos los conceptos del Nivel 4: gobernanza, multi-ambiente, integraciones Azure, AI, datos con Fabric, seguridad Zero Trust, y comunicando la arquitectura a stakeholders ejecutivos como lo haría un Solution Architect certificado.

### 📖 Conceptos Clave
Este módulo es puramente aplicado — no introduce conceptos nuevos. Demuestra dominio completo del Nivel 4.

**Escenario del proyecto:**
Empresa de servicios financieros con 1,500 empleados en Colombia y España. Necesita modernizar su sistema de gestión de créditos: desde la solicitud del cliente hasta el desembolso y seguimiento del crédito, con cumplimiento GDPR (España) y Ley 1581 (Colombia).

### 👨‍💻 Plan de Entregables

#### Entregable 1: Architecture Blueprint (Semanas 1-2)
```markdown
Documentos a producir:
1. Governance Framework del proyecto
2. Diagrama de arquitectura de alto nivel (draw.io)
3. ADRs (mínimo 5):
   - ADR-001: Multi-tenant vs single tenant (Colombia vs España)
   - ADR-002: Dataverse vs Azure SQL para core de créditos
   - ADR-003: Power Pages vs D365 Portal para clientes
   - ADR-004: Logic Apps vs Power Automate para integración con buró
   - ADR-005: Fabric vs Azure Synapse para Analytics
4. Risk Register con top 10 riesgos y mitigaciones
5. Estrategia de Ambientes (DEV/TEST/UAT/PROD por tenant)
6. Fit-Gap Analysis contra los requerimientos del cliente
```

#### Entregable 2: MVP Data Model + Core (Semanas 3-6)
```
Tablas Dataverse (prefijo: sit_):
- Solicitante (datos del cliente — enlazado a Contact)
- SolicitudCredito (el proceso principal)
- Evaluacion (resultado del análisis crediticio)
- Credito (el crédito aprobado y desembolsado)
- Cuota (plan de pagos)
- PagoRegistrado (pagos recibidos)

Security:
- Roles: Asesor Comercial, Analista de Crédito, Gerente de Crédito, Auditor
- Field Security: número de cuenta bancaria visible solo a Gerente
- Row-level: Asesor solo ve sus propios clientes
- CMK habilitado en ambiente PROD

Plugins C#:
- SolicitudPreCreate: validar datos mínimos + auto-número SOL-CO-2026-XXXXX / SOL-ES-2026-XXXXX
- EvaluacionPostCreate: disparar integración con buró de crédito (async)
- CreditoPostUpdate: si estado cambia a "Desembolsado" → generar plan de cuotas automáticamente
```

#### Entregable 3: Aplicaciones (Semanas 7-12)
```
Power Pages (portal externo):
  - Registro con Azure AD B2C (colombianos y españoles)
  - Formulario de solicitud de crédito
  - Subir documentos (comprobante de ingresos, ID)
  - Seguimiento del estado de su solicitud
  - Descarga del contrato firmado (PDF)

Canvas App (asesores en campo):
  - Mobile-first, funciona offline
  - Crear solicitud nueva con el cliente
  - Ver pipeline de solicitudes propias
  - Notificaciones push cuando cambia el estado

Model-Driven App (analistas y gerentes):
  - Vista completa 360° del cliente
  - Formulario de evaluación crediticia
  - BPF: Recepción → Análisis → Aprobación → Desembolso
  - Panel de riesgo con scoring del buró

Copilot Studio (bot interno para asesores en Teams):
  - SSO con identidad del asesor
  - "¿Cuántas solicitudes tengo pendientes de respuesta?"
  - "Crear nueva solicitud para el cliente [nombre]"
  - Generative Answers desde KB de políticas de crédito
```

#### Entregable 4: Integraciones (Semanas 13-18)
```
Azure Integration Hub:
  APIM: expone APIs de Dataverse a sistemas externos
  Service Bus: queue "solicitudes-para-buro" (async)
  Logic App: 
    - Recibe mensaje del Service Bus
    - Llama API del buró de crédito (con retry policy)
    - Actualiza Dataverse con el score recibido
    - Si API del buró falla 3 veces → DLQ + alerta al equipo
  
  Integración con sistema de pagos (para registrar cuotas pagadas):
  Event Grid: cuando llega pago del sistema externo → Event Grid distribuye a:
    - Azure Function: actualiza cuota en Dataverse
    - Logic App: genera recibo PDF y lo envía al cliente

AI Builder:
  - Document Processing: extrae ingresos de los documentos cargados en el portal
  - Prediction: modelo predictivo de probabilidad de mora (entrenado con historial)
```

#### Entregable 5: Analytics y Gobernanza (Semanas 19-22)
```
Microsoft Fabric:
  - Dataverse Link → Fabric (todas las tablas del crédito)
  - Bronze: datos crudos de Dataverse
  - Silver: limpios, estandarizados (fechas UTC, tipos correctos)
  - Gold: métricas de negocio (morosidad por segmento, tiempo promedio de aprobación)
  - DirectLake Power BI con RLS por región (Colombia vs España)

Seguridad (Zero Trust):
  - Purview: clasificar datos de crédito como "Confidencial"
  - PIM: acceso de admin requiere aprobación JIT
  - Sentinel: alertas de descarga masiva y acceso fuera de horario
  - Conditional Access: MFA + dispositivo cumpliente para acceder a PROD

CoE:
  - CoE Starter Kit instalado en ambiente dedicado
  - Compliance Process automatizado para apps sin owner
  - Dashboard Power BI del tenant para el CIO

CI/CD:
  - Pipeline Azure DevOps para 6 soluciones
  - Solution Checker obligatorio
  - Deploy a PROD requiere aprobación del arquitecto + CTO
```

#### Entregable 6: Presentación Ejecutiva (Semana 23)
```
Presentación al "Board" (10 slides, 20 minutos):
1. El problema que resolvemos (en euros/pesos perdidos, no en términos técnicos)
2. La solución en 1 imagen (arquitectura de alto nivel)
3. ¿Qué cambió para el cliente de crédito? (journey map antes vs después)
4. ¿Qué cambió para el analista de crédito? (jour map antes vs después)
5. Números del MVP (KPIs de las primeras 4 semanas en producción)
6. Cumplimiento regulatorio: GDPR + Ley 1581 (lo que el abogado necesita ver)
7. Costos (licencias + Azure + desarrollo + mantenimiento anual)
8. ROI proyectado a 3 años
9. Riesgos y cómo los estamos gestionando
10. Hoja de ruta: qué viene después del MVP

Práctica: presentar ante colegas/mentores y recibir feedback de un "CFO simulado"
```

### Métricas de éxito del Capstone
Al completar el proyecto, debería poder demostrar:

- Tiempo promedio de aprobación de crédito: de X horas a Y horas (mejora medible)
- % de solicitudes procesadas automáticamente (sin intervención humana): objetivo ≥ 60%
- Score del Solution Checker: 0 errores críticos
- Uptime del sistema en UAT: ≥ 99%

### 🧪 Criterios de Validación del Capstone
- [ ] Architecture Blueprint con 5 ADRs, Risk Register, y diagrama aprobado por mentor
- [ ] 6 soluciones desplegadas en ambientes DEV/TEST (multi-tenant Colombia + España)
- [ ] CI/CD pipeline verde de extremo a extremo
- [ ] Plugin C# con unit tests que valida y enriquece solicitudes
- [ ] Portal Power Pages funcional con autenticación B2C para Colombia y España
- [ ] Logic App integra con buró de crédito (real o mock) con retry y DLQ
- [ ] AI Builder extrae ingresos de documentos con > 80% de precisión
- [ ] Fabric Lakehouse con los 3 layers (Bronze/Silver/Gold) y Power BI DirectLake
- [ ] Sentinel tiene al menos 1 regla de alerta funcionando
- [ ] Presentación ejecutiva de 10 slides presentada y aprobada por mentor/par

---

## Criterios de Graduación — Nivel 4 (Solution Architect)

Para considerarse Solution Architect Master de Power Platform, debes cumplir:

### Criterios Técnicos
- [ ] Proyecto Capstone completo y funcionando en ambientes de staging
- [ ] Well-Architected Review completado con plan de remediación
- [ ] CoE Starter Kit implementado con compliance process activo
- [ ] Pipeline CI/CD multi-solución con aprobaciones por ambiente
- [ ] Integración enterprise con Azure (Service Bus + Logic Apps + APIM)
- [ ] Arquitectura de datos Medallion en Fabric con DirectLake Power BI
- [ ] Zero Trust implementado (PIM + Purview + Sentinel + Conditional Access)
- [ ] AI Builder con modelo personalizado entrenado y en producción

### Criterios de Liderazgo
- [ ] Discovery Workshop facilitado con un cliente real o simulado
- [ ] Fit-Gap Analysis y estimación de proyecto completados
- [ ] Presentación ejecutiva de arquitectura sin jerga técnica
- [ ] Al menos 1 colega del Nivel 1-2 mentorado por ti durante tu Nivel 4

### Certificaciones
- [ ] PL-900 obtenida (debería estar completada desde Nivel 1)
- [ ] PL-200 obtenida (Nivel 2)
- [ ] PL-400 obtenida (Nivel 3)
- [ ] **PL-600 agendada y aprobada** ← meta final

### Auto-evaluación Final
Califica cada área del 1 al 5:

- Enterprise Architecture y Gobernanza: ___/5
- CoE y Administración a escala: ___/5
- Multi-tenant y cumplimiento regulatorio: ___/5
- Azure Integration Services: ___/5
- Arquitectura de datos (Fabric/Medallion): ___/5
- Seguridad Zero Trust: ___/5
- AI Builder y Azure OpenAI: ___/5
- Liderazgo técnico y comunicación ejecutiva: ___/5
- Casos de transformación digital: ___/5

**Promedio ≥ 4.0 en todos → Eres Solution Architect de Power Platform & D365**

---

## Mensaje Final

Has llegado al final de un recorrido de 20-32 meses que te convierte en uno de los perfiles más demandados del ecosistema Microsoft. El Solution Architect de Power Platform es el puente entre los problemas de negocio y la tecnología — habla el idioma del CFO y del desarrollador al mismo tiempo.

**Lo que te diferenció:**

- No solo aprendiste herramientas — aprendiste a tomar decisiones arquitectónicas justificadas
- No solo codificaste — aprendiste a liderar equipos y comunicar con el C-suite
- No solo configuraste — aprendiste a gobernar una plataforma a escala

**El camino continúa:**

- Mantener las certificaciones actualizadas (Microsoft renueva los exámenes anualmente)
- Participar en la comunidad (Power Platform Community, eventos MVP)
- Considerar la certificación Azure Solutions Architect Expert (AZ-305) como complemento
- Contribuir: publicar casos de estudio, hablar en eventos, mentorear a otros

*El mejor arquitecto es el que sigue aprendiendo.*

---

*[← NIVEL_3_AVANZADO.md](NIVEL_3_AVANZADO.md) | [Plan Maestro →](../index.md)*
