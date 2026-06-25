---
moduleId: 31
title: "Enterprise Architecture y Gobernanza"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 9
slug: "enterprise-architecture-y-gobernanza"
---
### 🎯 Objetivo
Diseñar y comunicar la arquitectura enterprise de Power Platform para organizaciones de 1,000+ usuarios: estrategia de gobernanza, políticas de adopción, marcos de decisión arquitectónica, y alineación con estándares como TOGAF y el Well-Architected Framework de Microsoft.

### 📖 Conceptos Clave
- **TOGAF (referencia contextual):** framework de arquitectura empresarial de The Open Group compuesto por el ADM (Architecture Development Method) de 9 fases. En Power Platform se aplica principalmente la fase *Architecture Vision* para definir el alcance y los principios, y la fase *Technology Architecture* para seleccionar componentes. Para el día a día usar el **Microsoft Well-Architected Framework** que tiene aplicación directa al examen PL-600 y está diseñado específicamente para workloads en la nube de Microsoft.
- **Well-Architected Framework (Power Platform):** marco de revisión de Microsoft compuesto por 5 pilares: Fiabilidad (disponibilidad, RTO/RPO, retry policies), Seguridad (identidad, DLP, CMK), Excelencia Operacional (CI/CD, monitoreo, runbooks), Eficiencia de Rendimiento (caché, delegación, paginación), y Optimización de Costos (licencias correctas, eliminar ambientes ociosos). Microsoft publica un cuestionario oficial en aka.ms/ppswa que genera un scorecard con recomendaciones priorizadas; un tenant típico sin revisión previa obtiene entre 40-55 sobre 100.
- **Governance Framework:** conjunto documentado de políticas, procesos y controles técnicos que definen cómo se usa Power Platform en la organización. Debe cubrir: quién puede crear ambientes, qué conectores están permitidos por tipo de ambiente, el ciclo de vida de una aplicación (DEV→TEST→PROD), y el proceso de excepción cuando una regla no puede cumplirse. Sin sponsor ejecutivo (CTO o CIO), el framework queda en papel y no se cumple.
- **Fusion Teams:** modelo de trabajo donde equipos mixtos colaboran en el mismo proyecto: desarrolladores ciudadanos (makers) aportan conocimiento del proceso de negocio, desarrolladores pro aportan capacidades técnicas avanzadas (plugins, PCF, integraciones), e IT aporta gobernanza y operaciones. Microsoft documenta este modelo como la clave para escalar Power Platform sin bloquear a IT ni crear shadow IT.
- **Landing Zone:** ambiente de Power Platform pre-configurado con todas las políticas de seguridad (DLP, grupos de seguridad de AAD, roles base), pipelines CI/CD y documentación de bienvenida listos antes de que el primer desarrollador escriba una línea de código. Análogo al concepto de Azure Landing Zone del Cloud Adoption Framework. Provisionar una Landing Zone como código con pac CLI reduce el tiempo de setup de semanas a minutos y garantiza consistencia entre proyectos.
- **Platform Engineering:** disciplina de tratar la plataforma tecnológica (Power Platform, Azure) como un producto interno con SLAs propios, roadmap, equipo dedicado y métricas de satisfacción de los equipos que la consumen. El Platform Engineering team publica "golden paths" — guías y plantillas para que los equipos de producto puedan adoptar la plataforma rápidamente sin reinventar la rueda.
- **FinOps para Power Platform:** práctica de gestión de costos que incluye: mapeo de licencias por usuario (Per App vs Per User vs Pay-as-you-go), monitoreo de consumo de storage de Dataverse (cada GB adicional tiene costo), control de API calls (límites diarios de conectores premium), y eliminación periódica de ambientes sandbox ociosos. Un tenant de 2,000 usuarios sin FinOps puede tener un 20-30% de exceso de gasto en licencias asignadas a usuarios inactivos.
- **Risk Register:** inventario estructurado de riesgos del proyecto con columnas: ID, descripción del riesgo, probabilidad (1-5), impacto (1-5), score (probabilidad × impacto), estado (activo/mitigado/aceptado), plan de mitigación y dueño. En Power Platform los riesgos más frecuentes son: integración con sistemas legacy sin API documentada, timelines agresivos para cumplimiento regulatorio, y cambios en el modelo de licenciamiento de Microsoft a mitad del proyecto.
- **Capability Map:** mapa visual que cruza capacidades de negocio (filas) contra el nivel de cobertura actual de la plataforma (columnas: no implementado / en progreso / implementado). Permite identificar gaps de alto impacto que se convierten en propuestas de proyectos. Ejemplo: una empresa de logística puede tener "Seguimiento de carga en tiempo real" como capacidad no cubierta, lo que se traduce en un proyecto de Canvas App + Azure IoT Hub.
- **Reference Architecture:** plantilla de arquitectura validada y documentada para un caso de uso recurrente, que incluye decisiones de diseño justificadas (ADRs), configuraciones de seguridad mínimas, y código de ejemplo reutilizable. Microsoft publica Reference Architectures en aka.ms/powerplatformguidance; las organizaciones maduras crean las suyas propias para sus patrones específicos (portal de clientes, gestión de aprobaciones, integración con ERP).

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 31.1: Well-Architected Review para Power Platform
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

#### Actividad 31.2: Governance Framework Document
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

#### Actividad 31.3: Capability Map
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

#### Actividad 31.4: Landing Zone como código
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
