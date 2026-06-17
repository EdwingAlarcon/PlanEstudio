# NIVEL 4: ARQUITECTO MASTER — Power Platform & Dynamics 365
**Duración estimada:** 8–12 meses (part-time) | **Prerequisito:** NIVEL_3_AVANZADO.md completado  
**Certificaciones objetivo:** PL-600 (Power Platform Solution Architect Expert)

---

## Resumen del Nivel

En este nivel dejas de ser desarrollador técnico para convertirte en **Solution Architect**. Tomas decisiones de diseño que afectan a toda la organización, líderas equipos técnicos, defines estrategias de gobernanza, diseñas integraciones enterprise con Azure, y puedes hablar con el C-suite sobre ROI y transformación digital. Al completar este nivel estás listo para la certificación PL-600 y para liderar proyectos de transformación digital de gran escala.

**Módulos de este nivel:** 11 módulos (Módulos 31–41)

| Módulo | Tema | Semanas |
|--------|------|---------|
| 31 | Enterprise Architecture y Gobernanza | 4–5 |
| 32 | CoE Starter Kit y Administración a Escala | 3–4 |
| 33 | Multi-tenant, Multi-geo y Estrategia de Ambientes | 3–4 |
| 34 | Azure Integration Services Avanzado | 4–5 |
| 35 | Arquitectura de Datos: Fabric, Synapse y Medallion | 4–5 |
| 36 | Seguridad y Cumplimiento Enterprise | 3–4 |
| 37 | AI Builder y Azure AI integrado en Power Platform | 3–4 |
| 38 | Liderazgo Técnico y Gestión de Proyectos | 3–4 |
| 39 | Casos de Transformación Digital | 3–4 |
| 40 | Preparación PL-600 | 4–5 |
| 41 | Proyecto Capstone — Arquitectura Enterprise | 8–10 |

---

## MÓDULO 31: Enterprise Architecture y Gobernanza

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

## MÓDULO 32: CoE Starter Kit y Administración a Escala

### 🎯 Objetivo
Implementar y operar el Center of Excellence Starter Kit de Microsoft para obtener visibilidad completa del tenant, gestionar el inventario de apps y flujos, aplicar políticas de cumplimiento automáticamente, y habilitar al equipo de gobernanza para tomar decisiones basadas en datos.

### 📖 Conceptos Clave
- **CoE Starter Kit:** colección de soluciones de Power Platform mantenida por Microsoft (disponible en aka.ms/CoEStarterKit) que otorga visibilidad total sobre el tenant: inventario de apps, flujos, conectores, makers y ambientes. Se compone de cuatro paquetes principales: Core Components (inventario y sincronización), Governance Components (compliance y aprobaciones), Nurture Components (comunidad y training) e Innovation Backlog (gestión de ideas). Se instala en un ambiente dedicado (no en Default) y sincroniza datos nocturnamente mediante flujos programados. Ejemplo: tras instalarlo en un tenant con 3,000 usuarios, el primer sync puede revelar más de 800 apps de las cuales el 60% están inactivas o sin owner identificado.
- **Core Components:** paquete base del CoE Starter Kit que crea el inventario de todos los recursos del tenant. Contiene el flujo "Admin | Sync Template v4" que se conecta a las APIs de administración de Power Apps y Power Automate para registrar cada app, flujo, conector y maker en tablas de Dataverse del ambiente CoE. Es dependencia obligatoria de los demás paquetes; debe instalarse y ejecutarse primero. Un sync completo en un tenant mediano (500-2,000 usuarios) puede tardar entre 2 y 8 horas en la primera ejecución.
- **Governance Components:** paquete del CoE que habilita procesos de cumplimiento automatizados: el "Compliance Process" contacta a makers de apps sin uso o sin owner, el "Developer Compliance Center" permite a los makers auto-gestionar el estado de sus apps, y el proceso de "App Quarantine" desactiva apps que no superan el proceso de compliance después de múltiples notificaciones. Reduce el trabajo manual del administrador al convertir tareas reactivas en procesos automáticos.
- **Nurture Components:** paquete del CoE orientado a desarrollar la comunidad de makers. Incluye: portal de onboarding para nuevos makers, seguimiento de badges y logros de aprendizaje, plantilla de newsletter mensual "Power Platform Newsetter", y el "App Catalog" donde los makers pueden publicar sus apps para que otros las descubran. Una comunidad activa reduce el shadow IT porque los makers consultan el catálogo antes de construir algo que ya existe.
- **Innovation Backlog:** componente opcional del CoE que proporciona un proceso formal para que cualquier empleado proponga ideas de automatización o apps, y el equipo de Platform Engineering las evalúe, priorice y asigne. Sustituye el proceso informal de "el jefe pide una app por Teams" por un pipeline transparente con scoring de impacto vs esfuerzo.
- **Compliance Process:** flujo automatizado del CoE Governance que se ejecuta periódicamente (configurable, típicamente cada 30 días) y envía emails personalizados a los owners de apps que llevan más de N días sin uso. El owner puede responder: mantener la app, archivarla, o transferirla a otro owner. Si no responde en 14 días, el proceso escala. Este proceso convirtió la tarea de revisar 800 apps manualmente en un flujo que el administrador solo toca cuando hay una excepción.
- **Power BI CoE Dashboard:** conjunto de reportes Power BI distribuidos con el CoE Starter Kit (archivo .pbit) que muestran el estado del tenant en tiempo real: total de apps, makers activos, ambientes, conectores en uso, tendencias de crecimiento, y apps en riesgo de compliance. Es el primer dashboard que muchos CIOs revisan para entender la "salud" de la adopción de Power Platform en su organización.
- **Environment Request Process:** formulario Canvas App + flujo de aprobación que formaliza cómo los makers solicitan nuevos ambientes. El maker llena el formulario con justificación de negocio y conectores necesarios; el arquitecto revisa si es necesario un nuevo ambiente o puede usar uno existente; si se aprueba, el script de Landing Zone se ejecuta automáticamente. Reemplaza el proceso informal de "abrir un ticket al equipo de IT y esperar semanas".
- **Maker Assessment:** cuestionario incluido en los Nurture Components que evalúa el nivel de conocimiento de un maker en distintas áreas de Power Platform (Power Apps, Power Automate, Dataverse) y le asigna un nivel (Beginner, Intermediate, Advanced). El resultado se usa para dirigir al maker a los recursos de training correctos y para que el CoE sepa qué capacitación necesita la organización.
- **App Quarantine:** proceso del CoE que desactiva (pone en cuarentena) apps que han fallado el Compliance Process después de múltiples notificaciones sin respuesta del owner. La app sigue existiendo pero sus usuarios no pueden acceder a ella; el owner puede sacarla de cuarentena respondiendo al proceso. Evita el acúmulo indefinido de apps abandonadas que representan riesgo de seguridad.

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

## MÓDULO 33: Multi-tenant, Multi-geo y Estrategia de Ambientes

### 🎯 Objetivo
Diseñar estrategias de implementación para organizaciones multinacionales con múltiples tenants, requisitos de residencia de datos (GDPR, LGPD, Ley 1581), y modelos de gobierno distribuido donde subsidiarias tienen autonomía pero se alinean con políticas corporativas.

### 📖 Conceptos Clave
- **Tenant:** instancia única de Azure Active Directory (Entra ID) asociada a Power Platform que funciona como el límite de seguridad y administración principal. Una empresa puede tener múltiples tenants (por adquisición, separación legal o requisitos regulatorios), lo que crea complejidad de identidad y gobernanza. El tenant tiene un `tenantId` único en formato GUID; todas las apps, flujos y datos de Dataverse residen dentro de él.
- **Multi-tenant architecture:** modelo donde una organización opera con dos o más tenants de Azure AD + Power Platform, típicamente un tenant corporativo central y tenants por subsidiaria, región o filial. La integración entre tenants requiere Azure AD B2B para identidades y Azure Service Bus o APIM para datos, ya que los conectores nativos de Dataverse no cruzan límites de tenant. La decisión de multi-tenant vs single-tenant con Managed Environments es una de las más críticas en arquitectura enterprise y debe evaluarse con criterios regulatorios, no solo técnicos.
- **Geo (Geography):** agrupación de regiones de Azure que define la jurisdicción legal y física donde residen los datos de Power Platform y Dataverse. Las geos principales son: United States, Europe, Asia Pacific, United Kingdom, Canada, Brazil, India, entre otras. Al crear un ambiente, se selecciona la región de Azure; esta elección determina dónde físicamente se almacenan los datos y bajo qué legislación operan. No se puede cambiar la región de un ambiente después de crearlo.
- **GDPR (Europa), LGPD (Brasil), Ley 1581 (Colombia):** regulaciones de protección de datos personales. El GDPR (General Data Protection Regulation) entró en vigor en 2018 y aplica a datos de ciudadanos de la UE, con multas de hasta el 4% del ingreso global anual. La LGPD brasileña (2020) sigue un modelo similar al GDPR. La Ley 1581 colombiana de 2012 requiere consentimiento para tratamiento de datos personales y registro ante la SIC. Para Power Platform, estas regulaciones implican: residencia de datos en la región correcta, capacidad de eliminar datos de un usuario específico (right to be forgotten), y auditoría de acceso a datos personales.
- **Data Residency:** garantía de que los datos de ciudadanos de una jurisdicción se almacenan y procesan únicamente en la región de Azure correspondiente. En Power Platform se logra creando ambientes en la región correcta (ej: West Europe para datos de ciudadanos de la UE). Microsoft documenta qué servicios tienen geo-residencia garantizada en su Trust Center. Importante: los logs de diagnóstico y metadatos pueden replicarse globalmente incluso si los datos están geo-localizados; esto debe revisarse con el DPO.
- **Cross-tenant connectors:** mecanismo para que apps y flujos de un tenant A accedan a recursos de un tenant B usando Azure AD B2B (invitación de identidades externas). Requiere configuración explícita en ambos tenants y está sujeto a las DLP Policies del tenant donde corre el flujo. Ejemplo de uso: un tenant corporativo expone una API vía APIM que tenants de subsidiarias consumen con una service account B2B.
- **Hub-and-Spoke environment model:** patrón donde el tenant corporativo (hub) centraliza los componentes compartidos — soluciones base, CoE, pipelines, DLP Policies corporativas — y los tenants o ambientes de subsidiarias (spokes) heredan esas políticas pero tienen autonomía para sus apps locales. El hub no controla directamente los spokes; la alineación se logra mediante políticas en AAD y procesos de governance documentados.
- **Managed Environments:** funcionalidad premium de Power Platform (requiere licencias Premium o add-on) que habilita controles de gobernanza avanzados en un ambiente: límites de sharing (cuántas personas pueden ver una app), enforcement del Solution Checker en importaciones, IP Firewall para restringir acceso por red, Customer-Managed Keys, y el Weekly Digest email al administrador. Para ambientes de producción con datos sensibles, Managed Environments debe considerarse obligatorio.
- **Pipelines for Power Platform:** funcionalidad nativa de despliegue de soluciones entre ambientes (DEV→TEST→PROD) sin requerir Azure DevOps ni conocimiento de YAML. Se configura desde el Admin Center, soporta aprobaciones en cada etapa, y es accesible directamente desde make.powerapps.com. Es la opción recomendada para organizaciones con poco o nulo equipo DevOps; para organizaciones con DevOps maduro, Azure DevOps + pac CLI ofrece más control y personalización.
- **Satellite Makers:** ciudadanos desarrolladores ubicados en subsidiarias o regiones que tienen autonomía para crear soluciones locales bajo el marco de gobernanza corporativo. Se les otorga acceso a ambientes dedicados (no al Default Environment), reciben training del CoE Nurture Components, y sus apps siguen el Compliance Process. El modelo Satellite Maker escala la adopción de Power Platform sin necesidad de que el equipo central construya todas las soluciones.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Crear el tenant en la región equivocada y descubrir el problema 6 meses después | No se consideró la residencia de datos al inicio del proyecto | Definir la región como requisito no funcional en el Discovery Workshop; la región no se puede cambiar post-creación |
| Multi-tenant innecesario que duplica costos y complejidad operacional | Se asumió que subsidiarias necesitan tenants separados sin analizar requisitos reales | Evaluar primero si Managed Environments + Business Units + security roles dentro de un solo tenant cubren los requisitos regulatorios |
| Connector en un flujo del tenant corporativo accede a datos del tenant subsidiaria sin B2B configurado correctamente | Los conectores de Dataverse no cruzan tenants de forma nativa | Usar APIM como intermediario; el flujo en tenant A llama una API en APIM que a su vez accede al tenant B con sus propias credenciales |
| DLP policy corporativa bloquea casos de uso legítimos en subsidiarias con necesidades distintas | Una sola DLP policy aplicada a todos los ambientes sin tener en cuenta las diferencias regionales | Crear DLP Policies por nivel: política base corporativa + políticas de excepción por región aprobadas por el arquitecto |

### 🧪 Criterios de Validación
- [ ] Diagrama Hub-and-Spoke documentado con decisiones de región por tipo de dato
- [ ] Tabla de residencia de datos con regulación aplicable por país
- [ ] Managed Environments habilitado en PROD con sharing limits e IP firewall
- [ ] Pipeline nativo de Power Platform despliega de DEV a TEST con aprobación

---

## MÓDULO 34: Azure Integration Services Avanzado

### 🎯 Objetivo
Diseñar e implementar arquitecturas de integración enterprise usando el stack completo de Azure Integration Services: Logic Apps, API Management, Service Bus, Event Grid, Azure Functions y Azure Data Factory, orquestados para crear sistemas de integración robustos con Power Platform en el centro.

### 📖 Conceptos Clave
- **Azure Logic Apps:** servicio de orquestación de integraciones enterprise hospedado en Azure, análogo a Power Automate pero diseñado para escenarios IT con requisitos de SLA estrictos, transformaciones complejas y protocolos B2B (EDI, AS2, HL7). Existen dos planes: Consumption (pago por ejecución, multi-tenant) y Standard (plan dedicado, puede correr en contenedores). Logic Apps Standard soporta desarrollo local con VS Code y despliegue via Azure DevOps. Ejemplo de uso: integración con SAP usando el conector SAP nativo de Logic Apps que habla BAPI/RFC directamente sin middleware adicional.
- **Azure API Management (APIM):** gateway de APIs con funciones de portal de desarrolladores, versioning semántico (v1, v2), rate limiting, analytics, y transformación de políticas en XML (inbound/backend/outbound/on-error). Actúa como el único punto de entrada para todas las APIs de la organización, ocultando la complejidad de los backends. APIM puede exponer APIs de Dataverse, Logic Apps, Azure Functions y servicios externos bajo un dominio único (api.empresa.com). Los "Productos" en APIM agrupan APIs y definen los términos de acceso para distintos grupos de consumidores.
- **Azure Service Bus:** servicio de mensajería empresarial PaaS para desacoplar productores de consumidores en integraciones asíncronas. Soporta Queues (un consumidor por mensaje), Topics con Subscriptions (múltiples consumidores reciben cada mensaje), Sessions (procesamiento ordenado de mensajes relacionados por una clave de sesión), y Dead Letter Queue (DLQ) para mensajes no procesables. Garantiza entrega at-least-once con duplicado detection. El nivel Premium soporta inyección en VNET y aislamiento de red; obligatorio para integraciones con datos sensibles.
- **Azure Event Grid:** servicio de enrutamiento de eventos cloud-native con modelo pub/sub que distribuye eventos desde fuentes de Azure (Dataverse, Blob Storage, IoT Hub) a múltiples suscriptores (Azure Functions, Logic Apps, Service Bus, WebHooks) con latencia de milisegundos. Soporta filtrado de eventos por tipo y atributos, reintentos con backoff exponencial, y dead-lettering. Dataverse puede publicar eventos de creación, actualización y eliminación de registros a Event Grid, habilitando arquitecturas EDA (Event-Driven Architecture) en Power Platform.
- **Azure Data Factory (ADF):** servicio ETL/ELT de Azure para orquestación de pipelines de datos a gran escala con más de 90 conectores nativos (SAP, Oracle, Salesforce, databases). Útil para cargas batch de alto volumen y migraciones de datos históricos. Para proyectos nuevos, evaluar Microsoft Fabric Pipelines como alternativa moderna con interfaz unificada; ADF sigue siendo relevante en entornos enterprise con inversión existente. ADF tiene un concepto de Integration Runtime que permite ejecutar actividades en redes privadas (Self-hosted IR) o en ambientes de nube (Azure IR).
- **Azure Functions Durable:** extensión de Azure Functions que habilita orquestaciones stateful de larga duración con patrones como Fan-out/Fan-in (paralelizar trabajo y consolidar resultados), Function Chaining (secuencia de pasos), Human Interaction (esperar aprobación humana hasta X días), y Monitor (polling hasta que se cumpla una condición). El estado de la orquestación se persiste en Azure Storage, lo que permite suspender y reanudar sin perder contexto. Ideal para procesos batch complejos que duran horas o días.
- **Integration Account:** recurso de Azure vinculable a Logic Apps que actúa como repositorio de artefactos B2B: schemas XML (para validar mensajes), mapas XSLT (para transformar formatos), certificados, socios de negocio (partners) y acuerdos EDI (AS2, X12, EDIFACT). Obligatorio para integraciones con industrias como retail (EDI X12 850/856/810), salud (HL7 FHIR), o finanzas que requieren intercambio electrónico de documentos estructurados.
- **APIM Developer Portal:** portal web auto-hospedado incluido en Azure API Management donde los desarrolladores internos y externos pueden descubrir APIs, leer documentación OpenAPI interactiva, probar endpoints en el navegador, y suscribirse a productos para obtener API Keys. Totalmente personalizable con el branding de la empresa. En entornos enterprise, el Developer Portal reduce el tiempo de onboarding de nuevos integradores de días a horas.
- **Dead Letter Queue (DLQ):** cola secundaria en Azure Service Bus donde los mensajes son enviados automáticamente cuando no pueden procesarse después de N reintentos (configurable), cuando expiran (TTL), o cuando el consumidor los rechaza explícitamente. Los mensajes en la DLQ incluyen metadatos sobre la razón del fallo. Un proceso de monitoreo con alertas sobre el tamaño de la DLQ es fundamental; mensajes abandonados en la DLQ representan errores silenciosos de negocio (transacciones no procesadas).
- **Message Session:** funcionalidad de Azure Service Bus que garantiza el procesamiento ordenado (FIFO) de un grupo de mensajes relacionados identificados por una clave de sesión (`SessionId`). Útil cuando el orden importa, por ejemplo: eventos de un mismo pedido (creado, actualizado, cancelado) deben procesarse en secuencia por el mismo consumidor. Sin sessions, Service Bus distribuye mensajes a consumidores concurrentes sin garantía de orden.
- **WebSub / WebHooks:** mecanismo donde un sistema externo notifica proactivamente a Power Platform (o a un endpoint de Logic Apps / Azure Functions) cuando ocurre un evento, eliminando la necesidad de polling periódico. El receptor registra una URL de callback; cuando el evento ocurre, el emisor hace un HTTP POST a esa URL. Ejemplo: un sistema de pagos notifica a Logic Apps cuando se procesa un pago, en lugar de Power Automate consultar el sistema cada N minutos.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Logic App llama directamente al API del sistema externo sin retry ni DLQ | Se asumió que el API externo siempre está disponible | Configurar retry policy exponencial en todas las acciones HTTP; mensajes fallidos van a Service Bus DLQ |
| APIM expuesto sin rate limiting ni autenticación en el producto de partners | Se prioriza la velocidad sobre la seguridad en la fase inicial | Desde el primer día: productos APIM con API Key obligatoria y rate limit conservador; escalar después |
| Power Automate usado para integración con SLA de 1 segundo de respuesta | Power Automate tiene latencias variables (2–30 segundos), no es adecuado para respuesta síncrona estricta | Usar Azure Functions (< 100ms en tiempo frío después del primer warm-up) o Logic Apps Standard para SLAs estrictos |
| Mensajes duplicados en Service Bus procesados dos veces por el consumidor | Fallo del consumidor después de procesar pero antes de hacer complete del mensaje — Service Bus lo reencola | Implementar idempotencia en el consumidor: verificar si el registro ya existe antes de crearlo; usar el `MessageId` como clave de deduplicación |

### 🧪 Criterios de Validación
- [ ] Logic App procesa mensajes de Service Bus y llama API externa con retry exponencial
- [ ] APIM expone API con 2 productos (interno y partners) con distintos rate limits
- [ ] Durable Function procesa 100+ registros en paralelo con fan-out/fan-in
- [ ] Event Grid distribuye evento de Dataverse a 2 suscriptores distintos

---

## MÓDULO 35: Arquitectura de Datos — Fabric, Synapse y Medallion

### 🎯 Objetivo
Diseñar arquitecturas de datos modernas usando Microsoft Fabric y Azure Synapse Analytics conectados con Dataverse y Power BI, implementando el patrón Medallion (Bronze→Silver→Gold) para crear una fuente única de verdad analítica para la organización.

### 📖 Conceptos Clave
- **Microsoft Fabric:** plataforma analítica unificada de Microsoft (GA noviembre 2023) que integra en un solo entorno: Lakehouse (almacenamiento y procesamiento), Data Warehouse (SQL analítico), Pipelines (orquestación ETL), Notebooks (PySpark/Python/Scala), Real-Time Analytics (KQL para streaming), Data Science (ML con MLflow), y Power BI. Todos los workloads comparten el mismo almacenamiento (OneLake) y el mismo modelo de seguridad. Se adquiere como capacidad F-SKU (F2, F4, F8… F2048) o P-SKU Premium; las capacidades más pequeñas (F2) permiten adopción gradual sin comprometerse con licencias grandes desde el inicio.
- **Lakehouse:** arquitectura que combina el almacenamiento flexible y económico de un Data Lake (archivos en Azure Data Lake Storage) con las capacidades de consulta SQL de un Data Warehouse, usando el formato Delta Lake para proveer transacciones ACID sobre los archivos. En Fabric, el Lakehouse tiene dos áreas: "Files" (archivos sin esquema, zona de landing del Bronze layer) y "Tables" (tablas Delta registradas en el metastore, accesibles vía SQL). Una organización con 10 años de datos históricos en formatos dispares puede cargarlos en el área Files del Lakehouse y transformarlos gradualmente a Tables estructuradas.
- **OneLake:** capa de almacenamiento subyacente unificada de Microsoft Fabric — análoga a OneDrive pero para datos analíticos. Todos los items de Fabric (Lakehouses, Warehouses, semantic models) almacenan sus datos en OneLake bajo una estructura de namespaces por workspace. La ventaja es que distintos items pueden leer los mismos datos sin copiarlos: un Notebook en PySpark y un Warehouse en T-SQL pueden consultar la misma tabla Delta simultáneamente. OneLake usa Azure Data Lake Storage Gen2 bajo el capó, con el protocolo ADLS para compatibilidad con herramientas externas.
- **Medallion Architecture:** patrón de organización de datos en tres capas de calidad creciente. Bronze: datos crudos tal como llegan del sistema fuente, inmutables, con todos sus defectos; se usan para reprocesar en caso de error aguas arriba. Silver: datos limpios, validados, estandarizados (fechas en UTC, tipos corregidos, duplicados eliminados, registros borrados filtrados); son el input de todas las transformaciones de negocio. Gold: métricas y dimensiones orientadas al negocio, pre-calculadas y desnormalizadas para máximo rendimiento en Power BI; cada tabla Gold responde a una pregunta de negocio específica.
- **Dataverse Link to Fabric (Azure Synapse Link):** funcionalidad nativa que exporta tablas de Dataverse a Microsoft Fabric como Delta Tables de forma continua y sin necesidad de pipelines ETL adicionales. Se configura desde make.powerapps.com → Azure Synapse Link y seleccionando el workspace de Fabric como destino. La sincronización es near-real-time (latencia típica de 5-15 minutos). Es la integración preferida para analytics sobre datos de Dynamics 365 o Power Apps porque elimina carga sobre el ambiente de producción de Dataverse.
- **DirectLake:** modo de conexión de Power BI (exclusivo de Microsoft Fabric) que lee datos directamente desde las tablas Delta del Lakehouse sin importarlos al modelo en memoria ni usar DirectQuery sobre el Lakehouse. Combina la velocidad de respuesta del modo Import con la frescura de datos del modo DirectQuery. Tiene limitaciones: no soporta todas las funciones DAX disponibles en Import mode, y el rendimiento depende del tamaño y optimización de las tablas Delta. Recomendado sobre el Gold layer bien diseñado; no recomendado sobre el Bronze layer sin transformar.
- **Azure Synapse Analytics → Microsoft Fabric:** Synapse Analytics es la plataforma enterprise de análisis de Azure (lanzada 2020) con Synapse Spark, Synapse SQL, y Synapse Pipelines. Microsoft Fabric (2023) es su evolución unificada con experiencia mejorada y modelo de capacidad simplificado. Para proyectos nuevos: usar Fabric directamente. Para entornos con Synapse existente: los conectores de compatibilidad permiten que Fabric acceda a los datos de Synapse, y Fabric Pipelines puede reemplazar Synapse Pipelines gradualmente. Microsoft no ha anunciado una fecha de deprecación de Synapse, pero la inversión de producto está concentrada en Fabric.
- **Delta Lake format:** formato de tabla open-source (creado por Databricks, adoptado por Microsoft) que agrega transacciones ACID, control de versiones (time travel), y operaciones de upsert/merge/delete sobre archivos Parquet en el Data Lake. En Fabric Lakehouse, todas las tablas usan Delta automáticamente. El "transaction log" de Delta (archivos JSON en `_delta_log/`) registra cada operación permitiendo consultar el estado de la tabla en cualquier punto del pasado: `SELECT * FROM table TIMESTAMP AS OF '2025-01-01'`.
- **Semantic Model (Power BI):** capa semántica centralizada que define medidas DAX, jerarquías, relaciones y descripciones de negocio sobre las tablas del Gold layer, reutilizable por múltiples reportes. Con DirectLake, el Semantic Model lee directamente del Lakehouse. Un Semantic Model bien diseñado encapsula la lógica de negocio (¿qué significa "cliente activo"? ¿cómo se calcula la morosidad?) para que los reporteros no tengan que replicarla en cada reporte. La certificación del Semantic Model en Power BI Service indica a los usuarios que es la fuente oficial de verdad.
- **Data Activator:** servicio de Fabric (anteriormente llamado Reflex) que permite definir reglas de alerta sobre datos en tiempo real y disparar acciones automáticas sin escribir código. Se conecta a streams de Event Hubs, datos de Power BI, o tablas de Lakehouse; cuando una condición se cumple, puede enviar Teams/email notification, ejecutar un Power Automate flow, o llamar un webhook. Ejemplo: alertar al gerente de operaciones cuando el tiempo de resolución promedio de tickets supera las 4 horas, con el detalle de cuáles tickets están pendientes.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| DirectLake falla con errores de "fallback to DirectQuery" en producción | Las tablas Delta del Lakehouse no están optimizadas (demasiados archivos pequeños, sin V-Order) | Ejecutar `OPTIMIZE` y habilitar V-Order en las tablas Delta del Gold layer; el Semantic Model en DirectLake requiere tablas bien mantenidas |
| Dataverse Link sincroniza datos incorrectos o con retraso excesivo | El ambiente de Dataverse tiene alta carga o el flujo de sincronización fue pausado sin alertas | Monitorear el estado del Dataverse Link desde la vista "Azure Synapse Link" en make.powerapps.com; configurar alerta si el último sync tiene más de 30 minutos de antigüedad |
| Notebooks Silver fallan en producción aunque funcionaron en desarrollo | Los datos de producción tienen valores nulos, tipos inesperados o volúmenes que no existían en DEV | Agregar validaciones de datos al inicio de cada notebook (contar nulos, verificar tipos); usar `try/except` con logging para no silenciar errores |
| Gold layer rediseñado múltiples veces porque Power BI pide cambios | El Gold se diseña desde la perspectiva técnica de Spark, no desde las preguntas de negocio | Diseñar el Gold layer empezando por los reportes: ¿qué preguntas debe responder? → esas preguntas definen las columnas y agregaciones del Gold |

### 🧪 Criterios de Validación
- [ ] Dataverse Link configurado exporta 5+ tablas al Lakehouse de Fabric
- [ ] Notebook Bronze→Silver limpia y estandariza datos correctamente
- [ ] Gold layer tiene métricas de negocio pre-calculadas
- [ ] Power BI en DirectLake muestra datos del Gold layer sin errores
- [ ] Data Activator genera alerta cuando se cumple la condición de negocio configurada

---

## MÓDULO 36: Seguridad y Cumplimiento Enterprise

### 🎯 Objetivo
Implementar una postura de seguridad Zero Trust para Power Platform: clasificación de datos con Microsoft Purview, Customer-Managed Keys, Privileged Identity Management para administradores, auditoría avanzada con Microsoft Sentinel, y cumplimiento regulatorio documentado.

### 📖 Conceptos Clave
- **Zero Trust:** modelo de seguridad basado en el principio "Nunca confiar, siempre verificar" — a diferencia del modelo perimetral tradicional (confiar en todo dentro de la red corporativa), Zero Trust requiere verificar explícitamente la identidad del usuario, validar el estado del dispositivo y aplicar mínimo privilegio en cada acceso, independientemente de la ubicación de red. Microsoft implementa Zero Trust sobre tres pilares: identidad (Azure AD + MFA + Conditional Access), dispositivos (Intune compliance), y datos (Purview + DLP). Para Power Platform significa que ningún usuario, ni siquiera un admin, tiene acceso permanente a producción sin justificación verificada.
- **Microsoft Purview:** plataforma unificada de gobernanza y cumplimiento de datos de Microsoft que incluye: Data Catalog (inventario y clasificación de datos en Azure, M365, Dataverse), Information Protection (Sensitivity Labels), Data Loss Prevention (DLP avanzado que va más allá de las DLP Policies de Power Platform), Compliance Manager (evaluación de cumplimiento contra ISO 27001, GDPR, SOC2), y eDiscovery. En el contexto de Power Platform, Purview puede escanear tablas de Dataverse para detectar automáticamente datos personales y aplicar etiquetas de sensibilidad.
- **Sensitivity Labels:** clasificaciones de confidencialidad de datos definidas en Microsoft Purview que se aplican a documentos, emails, datasets de Power BI y elementos de SharePoint, y "siguen" al dato donde va (si se exporta a Excel, el Excel hereda la etiqueta). Los niveles típicos son: Público, Interno, Confidencial, Altamente Confidencial. Para Power BI, las Sensitivity Labels controlan quién puede exportar datos y a dónde; por ejemplo, un reporte con label "Confidencial" puede configurarse para que no permita exportar a Excel desde redes externas.
- **Customer-Managed Keys (CMK):** opción de cifrado donde el cliente gestiona sus propias claves de cifrado en Azure Key Vault en lugar de usar las claves manejadas por Microsoft. Con CMK activado en un ambiente Dataverse, Microsoft no puede acceder a los datos del cliente incluso en respuesta a solicitudes legales (el cliente retiene el control total de la clave). La activación requiere un ambiente Managed y puede tardar horas mientras todos los datos se re-cifran. Revocación inmediata de la clave deja el ambiente completamente inaccesible — requiere un proceso de break-glass bien documentado.
- **PIM (Privileged Identity Management):** funcionalidad de Azure AD P2 que convierte los roles privilegiados (Global Admin, Power Platform Admin) de permanentes a "elegibles" — el administrador debe activar el rol explícitamente, proporcionar justificación de negocio, obtener aprobación del manager, y el acceso expira automáticamente después de N horas. Todas las activaciones quedan en el log de auditoría. Reduce drásticamente la superficie de ataque: si una cuenta de admin es comprometida pero el rol no está activo, el atacante no tiene permisos elevados.
- **Microsoft Sentinel:** servicio SIEM (Security Information and Event Management) y SOAR (Security Orchestration and Automated Response) cloud-native de Azure. Ingiere logs de cientos de fuentes (Microsoft 365, Azure, Power Platform, sistemas externos), aplica reglas de correlación y machine learning para detectar amenazas, y puede ejecutar playbooks (Logic Apps) automáticamente como respuesta. Para Power Platform, los logs de actividad de Power Apps y Power Automate se exportan a Log Analytics Workspace y desde ahí a Sentinel, donde reglas KQL detectan patrones anómalos.
- **Conditional Access:** motor de políticas de Azure AD que evalúa cada solicitud de acceso en tiempo real y decide si otorgarlo, requerir MFA, bloquear, o restringir sesión, basándose en condiciones: ¿quién es el usuario? ¿desde qué dispositivo? ¿desde qué red? ¿qué aplicación quiere acceder? ¿cuál es el riesgo de la sesión (calculado por Azure AD Identity Protection)? Para Power Platform en producción: dispositivo debe ser Intune-compliant + MFA siempre + red fuera de oficina = sesión de solo lectura.
- **CASB (Cloud Access Security Broker):** Microsoft Defender for Cloud Apps actúa como intermediario entre usuarios y aplicaciones cloud, dando visibilidad de shadow IT (qué apps cloud usan los empleados fuera del control IT) y aplicando políticas de acceso en tiempo real. Puede detectar cuando un usuario de Power Platform descarga un volumen inusual de datos o accede desde una ubicación geográfica anómala y bloquear la sesión automáticamente. Se integra con Conditional Access para aplicar controles granulares por aplicación.
- **Power Platform Admin Activity logs:** registros de todas las acciones administrativas y de usuario en Power Platform (quién creó qué app, quién ejecutó qué flujo, quién exportó qué datos) exportables a Azure Monitor / Log Analytics Workspace via "Diagnostic settings" en el Admin Center. Son la fuente de datos para las reglas de detección en Sentinel y para auditorías de cumplimiento (GDPR Art. 30, SOX, HIPAA). Por defecto se retienen 28 días en el portal; para retención larga, exportar a Log Analytics (retención configurable hasta 2 años).
- **Data Exfiltration prevention:** conjunto de controles para prevenir que datos sensibles de Dataverse salgan por canales no autorizados. Incluye: DLP Policies (bloquear conectores que puedan enviar datos a servicios externos), Sensitivity Labels en Power BI (bloquear exportación a Excel), Managed Environments con sharing limits (prevenir que apps sean compartidas fuera del tenant), Conditional Access (bloquear descarga de datos desde dispositivos no gestionados), y reglas de Sentinel (alertar sobre descargas masivas). Ningún control individual es suficiente; la defensa en profundidad requiere todos los niveles activos.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| CMK activado en PROD sin probar el proceso de rotación de clave | Se activa CMK para cumplimiento pero nunca se simula una rotación | Probar la rotación de clave en el ambiente de staging antes de activar en PROD; documentar el procedimiento paso a paso con tiempos esperados |
| PIM configurado pero nadie lo usa porque el proceso es "muy lento" | Falta de adopción cultural — los admins prefieren mantener roles permanentes | El sponsor ejecutivo (CISO o CTO) debe exigir el uso de PIM con un plazo concreto; configurar alertas si hay roles privilegiados permanentes activos |
| Reglas de Sentinel generan demasiadas alertas falsas positivas | Umbrales demasiado sensibles configurados sin línea base del comportamiento normal | Pasar las primeras 2 semanas en modo "Observation" (alertas sin incidentes) para establecer la línea base antes de activar respuestas automáticas |
| Conditional Access bloquea acceso legítimo en el go-live | La política se activó en modo "Enforced" sin período de prueba en modo "Report-only" | Siempre activar Conditional Access en modo "Report-only" primero (2 semanas mínimo) para identificar usuarios legítimos que serían bloqueados |

### 🧪 Criterios de Validación
- [ ] Purview escanea el ambiente Dataverse y clasifica datos sensibles correctamente
- [ ] PIM configurado para rol Power Platform Admin — activación requiere justificación y MFA
- [ ] Logs exportados a Log Analytics y query KQL detecta descarga masiva simulada
- [ ] Conditional Access bloquea acceso a Power Platform desde dispositivo no cumpliente

---

## MÓDULO 37: AI Builder y Azure AI integrado

### 🎯 Objetivo
Integrar capacidades de Inteligencia Artificial en soluciones Power Platform usando AI Builder nativo y Azure AI Services: modelos de clasificación de documentos, extracción de información de facturas, análisis de sentimiento, y orquestación de agentes con Azure OpenAI y Semantic Kernel.

### 📖 Conceptos Clave
- **AI Builder:** servicio de inteligencia artificial integrado nativamente en Power Platform que permite a makers sin experiencia en ML crear, entrenar y usar modelos de IA directamente desde Power Apps y Power Automate. Ofrece dos tipos de modelos: pre-construidos (listos para usar sin entrenamiento, como extracción de texto de recibos o análisis de sentimiento) y personalizados (entrenados con datos propios, como clasificación de documentos de la empresa o predicción de resultados de negocio). Se factura en "AI Builder credits" que se incluyen en ciertas licencias Premium o se adquieren como add-on.
- **Document Processing (Form Recognizer):** tipo de modelo de AI Builder que extrae campos estructurados de documentos como facturas, contratos, formularios o identificaciones. Se entrena cargando mínimo 5 documentos de ejemplo y marcando los campos a extraer; el modelo aprende el layout del documento. Basado en Azure AI Document Intelligence (antes llamado Form Recognizer) bajo el capó. Un modelo bien entrenado con 50+ ejemplos puede alcanzar más del 95% de exactitud en campos numéricos y fechas; los campos de texto libre (nombres, direcciones) suelen tener menor exactitud y conviene enviarlos a revisión humana.
- **Object Detection:** modelo de AI Builder que detecta y localiza objetos específicos dentro de imágenes, devolviendo las coordenadas del bounding box y la confianza de detección. Casos de uso en Power Platform: control de calidad en manufactura (detectar productos defectuosos en línea de producción con una Canvas App + cámara del teléfono), verificación de instalaciones (detectar equipos de protección personal en fotos de obra), o conteo de inventario físico por imagen.
- **Text Classification:** modelo personalizable de AI Builder que clasifica texto libre en categorías predefinidas por el usuario. A diferencia de los modelos de análisis de sentimiento (pre-construido, solo positivo/negativo/neutro), Text Classification puede entrenarse para categorías de negocio específicas: tipo de solicitud (Técnica/Administrativa/Comercial), nivel de urgencia (Crítico/Alto/Medio/Bajo), departamento destino. Requiere mínimo 10 ejemplos por categoría; con 200+ ejemplos balanceados supera el 85% de exactitud en la mayoría de casos.
- **Prediction Model:** modelo de AI Builder que usa datos históricos de tablas de Dataverse para predecir un resultado binario (SI/NO) o numérico. El proceso es: seleccionar la tabla y columna a predecir, seleccionar columnas de entrada (features), entrenar, evaluar (el sistema muestra AUC, accuracy, curva ROC), y publicar. La predicción se puede ejecutar en Canvas App en tiempo real o en batch via Power Automate. Ejemplo real: predecir si una oportunidad de venta se ganará o perderá, entrenando con 2 años de historial de oportunidades cerradas.
- **Azure OpenAI Service:** acceso a modelos de lenguaje de OpenAI (GPT-4o, GPT-4, GPT-3.5-turbo) hospedados en infraestructura de Azure, con acuerdos de privacidad enterprise que garantizan que los datos de conversación no se usan para entrenar modelos de OpenAI/Microsoft. A diferencia del acceso público a ChatGPT, Azure OpenAI incluye: filtros de contenido configurables, registro de conversaciones en el propio Log Analytics, aislamiento de red (acceso solo desde VNET corporativa), y SLA de disponibilidad del 99.9%. Para Power Platform, se accede vía HTTP action de Power Automate o mediante el conector nativo "Azure OpenAI" disponible en ambientes con licencias correctas.
- **Semantic Kernel** *(referencia avanzada):* SDK open-source de Microsoft (C# y Python) para construir agentes y aplicaciones de IA orquestando llamadas a LLMs con plugins (funciones que el LLM puede invocar), memoria persistente (para recordar contexto entre conversaciones), y planners (que permiten al LLM descomponer un objetivo en pasos y ejecutarlos). Es el framework recomendado para agentes de IA enterprise en 2025+ cuando se necesita lógica compleja que va más allá de lo que Copilot Studio puede manejar nativamente. Requiere conocimiento de C# o Python y Azure OpenAI.
- **Prompt Engineering:** disciplina de diseñar instrucciones (prompts) efectivas para modelos de lenguaje que maximicen la calidad, consistencia y seguridad de las respuestas. Técnicas clave: system prompt con rol y reglas, few-shot examples (mostrar al modelo ejemplos de input→output esperado), chain-of-thought (pedir al modelo que razone paso a paso antes de responder), y output format constraints (pedir JSON, categoría exacta, o un número). En Power Platform, el prompt engineering define la diferencia entre un clasificador de tickets con 60% de exactitud y uno con 92%.
- **Grounding:** técnica para anclar las respuestas de un LLM a documentos corporativos específicos en lugar de depender del conocimiento general del modelo preentrenado. Se implementa típicamente con RAG (Retrieval-Augmented Generation): cuando el usuario hace una pregunta, se buscan los fragmentos más relevantes en la knowledge base (usando búsqueda vectorial), se incluyen en el contexto del prompt, y el LLM genera la respuesta citando esas fuentes. En Copilot Studio se configura vía "Knowledge Sources" (SharePoint, sitios web, documentos). Sin grounding, el LLM puede inventar información (alucinación); con grounding, las respuestas están verificadas contra documentos conocidos.
- **Azure AI Document Intelligence:** versión enterprise de Form Recognizer con modelos pre-entrenados para tipos de documentos comunes (facturas/invoices en múltiples idiomas, recibos, tarjetas de identificación, W-2 americanos, contratos) que no requieren entrenamiento propio. Los modelos pre-entrenados de facturas en varios idiomas incluyendo español tienen exactitud superior al 90% en campos estándar (número de factura, fecha, total, líneas de ítem). Se accede desde AI Builder seleccionando "Documentos precompilados" o directamente desde la API REST de Azure AI Services.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Modelo de Document Processing entrenado con muestras insuficientes o poco diversas | Se usan las primeras 5 facturas disponibles sin considerar la variedad de layouts del proveedor | Recolectar muestras de todos los layouts posibles del documento (distintos proveedores, distintos años, distintos formatos); 20+ muestras por variante de layout |
| Azure OpenAI retorna resultados inconsistentes en clasificación | Temperature > 0 para una tarea que requiere respuesta determinista | Para clasificación, prediction o extracción estructurada usar temperature=0 siempre; solo usar temperature > 0 para generación creativa o respuestas conversacionales |
| Prediction Model con alta accuracy en training pero falla en producción | El modelo fue entrenado con datos históricos que no representan el comportamiento actual | Separar el dataset en train (70%) / validation (15%) / test (15%); verificar que el test set incluye datos recientes; reentrenar el modelo cada 6 meses con datos frescos |
| Copilot Studio responde preguntas fuera del scope del negocio | System prompt demasiado permisivo sin restricciones explícitas | El system prompt debe listar explícitamente los temas fuera de scope: "Si el usuario pregunta sobre [X], responde que no puedes ayudar y redirige a [Y]" |

### 🧪 Criterios de Validación
- [ ] Modelo Document Processing extrae campos de facturas con > 85% de confianza
- [ ] Flujo procesa email con factura adjunta y crea registro en Dataverse automáticamente
- [ ] Azure OpenAI clasifica casos de soporte con temperatura 0 (resultado determinista)
- [ ] Prediction Model entrenado y disponible como acción en Canvas App

---

## MÓDULO 38: Liderazgo Técnico y Gestión de Proyectos

### 🎯 Objetivo
Desarrollar las competencias de liderazgo técnico necesarias para el rol de Solution Architect: conducir workshops de descubrimiento, estimar proyectos con precisión, gestionar riesgos, comunicar decisiones técnicas al C-suite, y liderar equipos de Fusion Development.

### 📖 Conceptos Clave
- **Discovery Workshop:** sesión estructurada de 1-3 días con stakeholders de negocio y técnicos cuyo objetivo es entender profundamente el contexto, procesos actuales, puntos de dolor y visión futura ANTES de proponer ninguna tecnología. Un Discovery bien ejecutado produce: mapa del proceso AS-IS, lista de requerimientos priorizada (MoSCoW), Risk Register inicial, y consenso sobre el MVP. Un arquitecto que propone tecnología antes del Discovery está vendiendo, no diseñando. Herramientas típicas: Miro/Whiteboard para mapear procesos, Confluence/SharePoint para documentar, y una agenda estructurada con facilitación activa.
- **Fit-Gap Analysis:** análisis sistemático que mapea cada requerimiento del cliente contra las capacidades nativas de Power Platform, clasificando cada uno en: Fit (cubierto nativamente sin desarrollo), Partial Fit (cubierto con configuración adicional o customización menor), Gap (no existe en la plataforma y requiere desarrollo custom o integración externa), o Exclusión (fuera del alcance del proyecto). El Fit-Gap es el documento que justifica por qué se necesita desarrollo custom y cuánto costará; sin él, los clientes asumen que "todo es configuración".
- **Solution Blueprint:** documento de arquitectura de alto nivel (10-20 páginas) que precede al desarrollo y describe: el diagrama de componentes del sistema, las decisiones arquitectónicas clave con sus justificaciones (ADRs), la estrategia de integración, el modelo de seguridad, y el plan de ambientes. Es el contrato técnico entre el arquitecto y el equipo de desarrollo; sin Blueprint, cada desarrollador toma decisiones de arquitectura de forma independiente y el resultado es incoherente.
- **Statement of Work (SoW):** documento legal-técnico que define con precisión el alcance del proyecto: qué se construirá (incluyendo criterios de aceptación por entregable), qué explícitamente está excluido del scope, el calendario de entrega, los roles y responsabilidades de cada parte, los precios y condiciones de pago, y el proceso de cambios de alcance. Un SoW bien redactado previene el 80% de las disputas de proyecto. La sección de exclusiones es tan importante como la de inclusiones; lo que no está en el SoW, el cliente asumirá que está incluido.
- **Risk Register:** registro estructurado de todos los riesgos identificados del proyecto con: descripción del riesgo, probabilidad (1-5), impacto en costo/tiempo/calidad (1-5), score (P×I), categoría (técnico/negocio/regulatorio/equipo), plan de mitigación específico, plan de contingencia si el riesgo se materializa, dueño del riesgo, y estado actual. Se revisa semanalmente en la reunión de steering. En proyectos de Power Platform, los riesgos más comunes son: integración con sistemas legacy sin API documentada, cambios en el modelo de licenciamiento, y disponibilidad de usuarios para UAT.
- **WBS (Work Breakdown Structure):** descomposición jerárquica del proyecto en entregables, módulos y tareas estimables de forma independiente, hasta el nivel donde cada tarea tenga una duración de 1-5 días. La WBS es la base para la estimación y el plan de proyecto; sin ella, la estimación es una conjetura. Herramienta: Microsoft Project, Azure DevOps Boards (con Epics → Features → User Stories → Tasks), o una hoja Excel estructurada. El nivel de detalle apropiado depende de la fase: en propuesta comercial, nivel módulo es suficiente; en planificación de sprint, nivel tarea.
- **RACI Matrix:** tabla que asigna para cada entrega o decisión del proyecto quién es: Responsible (quien hace el trabajo), Accountable (quien aprueba y tiene la responsabilidad final — solo 1 persona), Consulted (quien debe ser consultado antes de decidir — su input importa), e Informed (quien debe ser notificado del resultado). En proyectos de Power Platform, las confusiones más comunes son entre Accountable y Responsible (el cliente suele querer ser R y A en todo) y sobre quién aprueba los cambios de scope.
- **Velocity (Agile):** métrica que mide la capacidad real del equipo de desarrollo medida en story points completados por sprint (tipicamente 2 semanas). Los primeros 2-3 sprints se usan para calibrar la velocidad real del equipo; no se compromete con fechas hasta tener al menos 2 sprints de historial. Una velocidad de 20 story points/sprint con un backlog de 200 story points significa aproximadamente 10 sprints (20 semanas) para completar el backlog. La velocidad es una propiedad del equipo específico, no una constante universal.
- **Technical Debt:** acumulación de decisiones de implementación subóptimas tomadas para ganar velocidad a corto plazo que generan costo mayor a largo plazo (más tiempo de mantenimiento, más bugs, más dificultad para agregar features). En Power Platform: hardcodear valores que deberían ser Environment Variables, usar flujos de Power Automate sin error handling, o crear tablas de Dataverse sin pensar en el modelo relacional. El Technical Debt debe ser visible y cuantificado (como una lista en Azure DevOps) para que el equipo pueda pagarlo en sprints dedicados antes de que se vuelva impagable.
- **Change Request Process:** proceso formal documentado en el SoW para gestionar solicitudes de cambio al scope aprobado. Cuando el cliente pide algo nuevo, el proceso es: documentar el cambio, estimar el impacto en tiempo y costo, obtener aprobación escrita del cliente antes de iniciar, y actualizar el contrato. Sin este proceso, el proyecto sufre scope creep — el scope crece sin presupuesto adicional y el proyecto se retrasa. La frase "es un pequeño cambio" es la más peligrosa en gestión de proyectos.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Estimación comprometida antes de tener el Fit-Gap Analysis completo | Presión comercial para dar un precio "ahora mismo" antes del Discovery | Dar rangos indicativos en la fase de pre-venta (±50%); comprometer la estimación real solo después del Discovery con el Fit-Gap documentado |
| Discovery Workshop donde solo habla el sponsor ejecutivo | El facilitador no gestiona la dinámica grupal y los usuarios clave no participan | Técnica "1 voto por persona": en la priorización MoSCoW, cada participante vota independientemente; el sponsor no puede votar por todos |
| Risk Register creado al inicio y nunca actualizado | Se ve como un formalismo de documentación, no como herramienta de gestión | El Risk Register es el primer item de revisión en la reunión semanal de steering; si un riesgo no fue revisado esta semana, no existe en la práctica |
| Presentación técnica confundida con presentación ejecutiva | El arquitecto prepara una sola presentación para todas las audiencias | Tener siempre 2 versiones: "Ejecutiva" (problema + resultado + costo + ROI, sin jerga técnica) y "Técnica" (arquitectura, componentes, decisiones) — presentar según la audiencia |

### 🧪 Criterios de Validación
- [ ] Discovery Workshop agenda diseñada para un cliente real o simulado
- [ ] Fit-Gap Analysis con 10+ requerimientos clasificados MoSCoW
- [ ] Estimación por módulo con story points y semanas, incluyendo buffer de contingencia
- [ ] Presentación de 10 slides del proyecto: las primeras 3 en lenguaje de negocio, sin jerga técnica

---

## MÓDULO 39: Casos de Transformación Digital

### 🎯 Objetivo
Analizar y diseñar soluciones para los patrones más comunes de transformación digital con Power Platform: modernización de sistemas legacy, digitalización de procesos manuales, portales de autoservicio, y automatización de operaciones.

### 📖 Conceptos Clave
- **Transformación digital:** cambio organizacional profundo que va mucho más allá de implementar tecnología: implica rediseñar procesos de negocio (eliminando pasos manuales que tecnología puede ejecutar), transformar la cultura (empoderar a empleados para proponer mejoras, experimentar y fallar rápido), y en algunos casos, revisar el modelo de negocio completo (habilitar canales digitales que antes no existían). Según McKinsey, el 70% de las iniciativas de transformación digital no alcanzan sus objetivos, principalmente por resistencia al cambio y falta de liderazgo ejecutivo, no por limitaciones tecnológicas.
- **Legacy Modernization:** proceso de migrar aplicaciones o procesos basados en tecnología obsoleta (Excel con macros VBA, Access databases, sistemas AS/400, aplicaciones Visual Basic 6) a plataformas modernas como Power Platform. La estrategia más exitosa es incremental: mantener el sistema legacy en paralelo durante 4-8 semanas mientras el nuevo sistema se valida, luego hacer el cutover. La migración de datos históricos es típicamente el 30-40% del esfuerzo total y el mayor riesgo; requiere limpieza de datos (deduplicación, estandarización) antes de cargar en Dataverse.
- **Process Mining:** disciplina analítica que reconstruye y visualiza cómo se ejecutan realmente los procesos de negocio a partir de los registros de eventos (event logs) de los sistemas de información, en lugar de depender de documentación o entrevistas que describen cómo "deberían" ejecutarse. El resultado es un "Process Map" con variantes del proceso, cuellos de botella cuantificados (tiempo promedio por paso), y oportunidades de automatización priorizadas por impacto. Las herramientas líderes son Celonis (enterprise), Minit (adquirida por Microsoft), y Process Advisor (nativo en Power Automate).
- **Process Mining con Process Advisor:** implementación nativa de Process Mining en Power Platform. Soporta dos modos: Task Mining (grabación de acciones del usuario en el escritorio para descubrir oportunidades de RPA) y Process Mining (análisis de event logs de sistemas como Dataverse, SharePoint, o CSVs externos para mapear el proceso). Se accede desde Power Automate → Process Advisor. Genera mapas de proceso visuales con métricas de tiempo y frecuencia por variante, y recomienda automáticamente qué parte del proceso tiene mayor potencial de automatización.
- **Hyperautomation:** concepto de Gartner que describe la combinación de múltiples tecnologías de automatización para automatizar el mayor número posible de procesos de negocio: Power Automate (flujos de nube), Power Automate Desktop (RPA para sistemas sin API), AI Builder (extracción de datos de documentos no estructurados), y Azure OpenAI (clasificación y toma de decisiones sobre texto). El objetivo no es automatizar todo, sino identificar los procesos con mayor ROI de automatización y atacarlos con la herramienta adecuada para cada tipo de tarea.
- **Process Advisor (Power Automate):** herramienta de Process Mining integrada en Power Automate que permite grabar la ejecución de un proceso (Task Mining) o importar un event log de Dataverse/CSV/SharePoint (Process Mining) para generar automáticamente un mapa de proceso con variantes, tiempos y cuellos de botella. No requiere conocimiento de herramientas especializadas de process mining. Genera un reporte exportable en PDF con el análisis y las recomendaciones de automatización. Limitación: para procesos complejos con millones de eventos, las herramientas enterprise como Celonis ofrecen mayor capacidad analítica.
- **Change Management:** disciplina de gestión que se ocupa de preparar, apoyar y guiar a las personas a través de los cambios organizacionales que implica la transformación digital. Incluye: comunicación temprana y transparente sobre el cambio (¿por qué? ¿qué cambia para mí?), capacitación en las nuevas herramientas, identificación de "Change Champions" (líderes informales que adoptan el cambio y ayudan a sus colegas), y gestión de la resistencia (algunas personas pierden poder o habilidades valiosas en el proceso). Un plan de Change Management documenta los stakeholders, su nivel de resistencia actual y las acciones para moverlos hacia la adopción.

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

##### Práctica 39.X: Process Advisor — Mapear el proceso real de solicitudes

**Objetivo:** Usar Process Advisor para descubrir cómo se ejecuta realmente el proceso de solicitudes del proyecto capstone y compararlo con el diseño original.

**Pasos:**
1. En Power Automate, abre **Process Advisor** (menú lateral izquierdo)
2. Crea un nuevo proceso: "Análisis de Solicitudes — [tu nombre]"
3. Configura la grabación del proceso: selecciona el flujo de aprobación del proyecto capstone como fuente de eventos
4. Ejecuta al menos 5 instancias con variaciones (aprobación directa, rechazo, reasignación)
5. En Process Advisor, visualiza el **Process Map** generado automáticamente
6. Identifica las variantes: happy path vs variantes con rework
7. Revisa las métricas: duración promedio, frecuencia por variante, cuellos de botella
8. Exporta el análisis como PDF y documenta 3 oportunidades de automatización identificadas

**Criterio de validación:** El Process Map muestra al menos 2 variantes del proceso y el reporte identifica al menos un cuello de botella con tiempo promedio cuantificado.

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

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Apagar el sistema legacy demasiado rápido sin período de ejecución paralela | Presión por reducir costos de licencias del sistema antiguo o apuro del cliente | Establecer en el SoW un mínimo de 4 semanas de ejecución paralela para validar consistencia de datos antes del cutover definitivo |
| No involucrar a los usuarios finales en el diseño del TO-BE | El arquitecto diseña la solución en aislamiento con solo el sponsor ejecutivo | Incluir a al menos 2-3 usuarios de cada rol en el Discovery Workshop; si no usan la solución, no hay transformación |
| Transformación fallida por resistencia del "experto del Excel" | La persona que mantenía el sistema legacy percibe la transformación como una amenaza a su rol | Involucrar a ese experto como "Subject Matter Expert" del proyecto — su conocimiento es invaluable para documentar las reglas de negocio; reorientarle hacia el nuevo sistema |
| KPIs de éxito definidos solo en términos tecnológicos (uptime, velocidad) | El arquitecto no tradujo el impacto a métricas de negocio | Definir KPIs de negocio desde el Discovery: tiempo de proceso reducido X%, costo por transacción reducido Y%, tasa de error reducida Z% — son los únicos KPIs que importan al sponsor |

### 🧪 Criterios de Validación
- [ ] Análisis AS-IS documentado para un proceso real con métricas de dolor cuantificadas
- [ ] Diseño TO-BE con Power Platform que ataca cada punto de dolor identificado
- [ ] Cálculo de ROI con supuestos documentados (costo/hora, tiempo ahorrado, etc.)
- [ ] Plan de migración de sistema legacy con semanas de ejecución paralela antes del cutover

---

## MÓDULO 40: Preparación PL-600

### 🎯 Objetivo
Dominar los dominios del examen PL-600 (Power Platform Solution Architect Expert), practicar con casos de estudio de arquitectura, y desarrollar la mentalidad del arquitecto que el examen evalúa.

### 📖 Conceptos Clave del Examen PL-600

**Dominio 1: Realizar análisis de solución (35-40%)**

- **Análisis de requerimientos y soluciones existentes:** el examen evalúa la capacidad de revisar una solución ya implementada e identificar sus debilidades arquitectónicas. Preguntas típicas presentan un escenario con una solución existente y preguntan qué cambiarías. La respuesta correcta siempre considera: escalabilidad (¿aguanta 10x el volumen actual?), mantenibilidad (¿puede el equipo actual mantenerlo?), y alineación con el Well-Architected Framework. Nunca se refactoriza solo por preferencia técnica; siempre debe haber una razón de negocio documentada.
- **Evaluación de plataforma vs customización:** el principio rector del PL-600 es "configurar primero, customizar si es necesario, integrar si no hay otra opción, construir desde cero como último recurso". El examen presenta escenarios donde la respuesta correcta es usar una capacidad nativa que el estudiante podría no conocer (BPF, Calculated Columns, Business Rules) en lugar de crear un plugin C# innecesario. Conocer profundamente las capacidades nativas de Dataverse, Power Automate y Model-Driven Apps es más valioso que saber escribir código.
- **Análisis de riesgo y viabilidad:** el examen evalúa si el candidato puede identificar los riesgos arquitectónicos de una propuesta y cuantificar su impacto. Preguntas frecuentes: ¿qué pasa si el sistema externo no tiene API? ¿qué pasa si el cliente no puede proveer usuarios para UAT? ¿qué pasa si el volumen de datos es 10x el estimado? Un arquitecto siempre debe tener un plan B documentado para los top 5 riesgos del proyecto.
- **Estrategia de migración de datos:** área donde muchos candidatos fallan porque la subestiman. El examen evalúa: cuándo usar Data Import Wizard vs SSIS vs Azure Data Factory vs Power Query para migrar datos, cómo manejar relaciones (los registros padre deben migrarse antes que los hijos), cómo validar la integridad de los datos después de la migración, y cuántas iteraciones de migración se necesitan (siempre al menos 2: una migración de prueba + la migración final del cutover).

**Dominio 2: Diseñar una solución (40-45%)**

- **Arquitectura de aplicaciones:** el examen evalúa cuándo usar Canvas vs Model-Driven vs Power Pages vs Copilot Studio, y cómo organizarlas en soluciones. Regla de oro: una solución por capa funcional (Foundation, CRM, Integrations, etc.), no una mega-solución. Canvas para UX personalizada y mobile; Model-Driven para procesos relacionales con BPF y formularios complejos; Power Pages para usuarios externos autenticados; Copilot Studio para interacciones conversacionales.
- **Estrategia de datos y seguridad:** incluye decisiones sobre el modelo de datos (Dataverse vs SharePoint vs Azure SQL), el modelo de seguridad (Business Units, Security Roles, Field Security, Row-Level Security en Power BI), y el cifrado (CMK para datos sensibles). El examen suele presentar escenarios donde el estudiante debe justificar por qué Dataverse es superior a SharePoint Lists para datos relacionales y transaccionales.
- **Integración con otros sistemas:** cuándo usar Power Automate (integraciones simples, latencia aceptable), Azure Logic Apps (integraciones enterprise con EDI/B2B, SLA estricto), Azure Functions (código personalizado de alta performance), y Azure Service Bus (desacoplamiento async). El examen evaluará si el candidato conoce las limitaciones de cada servicio: Power Automate tiene throttling, Logic Apps tiene costo por ejecución, Functions necesitan gestión de infraestructura.
- **Estrategia de ALM:** siempre managed solutions en TEST y PROD, Connection References y Environment Variables obligatorias (nunca hardcodear URLs o credenciales), Solution Checker con 0 errores críticos antes de aprobar cualquier despliegue. El examen presenta escenarios de anti-patrones ALM y pregunta cómo remediarlos.
- **Estrategia de inteligencia artificial:** cuándo usar AI Builder nativo (sin código, integrado en Power Platform, modelos pre-construidos disponibles), Azure AI Services directamente (necesidades más específicas o control granular), o Azure OpenAI (respuestas generativas, clasificación de texto). El arquitecto debe también considerar el impacto en costos (AI Builder credits) y la privacidad de datos en cada opción.

**Dominio 3: Implementar la solución (15-20%)**

- **Guiar al equipo de desarrollo:** el arquitecto PL-600 no es el que hace todo el código — es el que toma decisiones técnicas, resuelve bloqueos y asegura que el equipo implementa la solución como fue diseñada. El examen evalúa habilidades de comunicación técnica: cómo explicar un ADR a un developer junior, cómo facilitar una code review, y cómo balancear velocidad con calidad técnica en los sprints.
- **Validar que la implementación sigue la arquitectura:** incluye: revisión de código (Solution Checker + revisión manual de plugins y flujos), revisión de seguridad (¿los Security Roles tienen mínimo privilegio?), y revisión de performance (¿las consultas usan filtros delegables? ¿los plugins son async cuando es posible?). El arquitecto firma que la implementación es conforme a la arquitectura antes de aprobar el despliegue a PROD.
- **Gestión de calidad:** métricas de calidad para Power Platform: Solution Checker score (0 errores críticos), cobertura de unit tests para plugins C# (mínimo 80%), time-to-load de Canvas Apps (< 3 segundos en el happy path), y tasa de flujos fallidos (< 0.5% en 7 días). El examen puede preguntar qué herramienta usar para monitorear la salud del sistema post go-live.

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

### 💼 Caso Real de Negocio
**Candidato:** Desarrollador senior de Power Platform con 4 años de experiencia, excelentes habilidades técnicas pero sin experiencia en decisiones arquitectónicas de alto nivel.  
**Problema al prepararse para el PL-600:** Aprobó los exámenes PL-900, PL-200 y PL-400 con altas notas memorizando preguntas de práctica. Intentó el PL-600 dos veces y reprobó en el Dominio 1 (Análisis de solución) porque las preguntas requerían razonar sobre escenarios completos de negocio, no recordar configuraciones técnicas.  
**Approach de preparación correcto:** En el tercer intento, cambió de estrategia: en lugar de practicar preguntas de opción múltiple, analizó 5 casos de estudio reales de Microsoft (Customer Stories), diseñó la arquitectura él mismo antes de ver la solución, y documentó las diferencias entre su propuesta y la solución real. Adicionalmente completó el proyecto capstone (análogo al Módulo 41) que lo forzó a tomar y justificar 10+ decisiones arquitectónicas con ADRs.  
**Resultado:** Aprobó el PL-600 con 815/1000 en el tercer intento. Comentó: "La diferencia fue que aprendí a pensar como arquitecto, no como alguien que recuerda respuestas."

### ✅ Buenas Prácticas
- El PL-600 evalúa pensamiento arquitectónico, no memorización — practicar con casos reales
- En el examen: preguntar "¿qué haría un arquitecto senior en esta situación?" no "¿cuál opción es técnicamente correcta?"
- Programar el examen DESPUÉS de completar el proyecto capstone (Módulo 41) — la experiencia práctica es irremplazable

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Estudiar memorizando respuestas de dumps de examen | Intentar atajo que no desarrolla el pensamiento arquitectónico | El PL-600 usa escenarios únicos y detallados; la única preparación efectiva es resolver casos reales y justificar decisiones arquitectónicas |
| No repasar el Dominio 1 (35-40%) por considerarlo "blando" | El análisis de solución parece menos técnico que el diseño | Este dominio tiene el mayor peso; practicar explícitamente la lectura crítica de soluciones existentes y la identificación de anti-patrones |
| Elegir la opción más técnicamente sofisticada en preguntas del examen | El developer instinto es resolver con código lo que Power Platform puede resolver con configuración | Aplicar siempre el principio "configurar primero": si hay una capacidad nativa, esa es la respuesta correcta aunque no sea la más impresionante técnicamente |
| Fallar por no saber cuándo usar Logic Apps vs Power Automate | Es una de las preguntas más frecuentes del examen y muchos candidatos no tienen claridad | Regla mnemónica: Power Automate para makers + latencia tolerada + costos bajos; Logic Apps para IT + SLA estricto + EDI/B2B + estado persistido |

### 🧪 Criterios de Validación
- [ ] Self-assessment de los 3 dominios PL-600 con puntaje por dominio
- [ ] 3 casos de estudio resueltos con justificación de decisiones arquitectónicas
- [ ] Practice test: score ≥ 70% en simulacro antes de agendar el examen real
- [ ] Examen PL-600 agendado (fecha concreta)

---

## MÓDULO 41: Proyecto Capstone — Arquitectura Enterprise

### 🎯 Objetivo
Diseñar e implementar una solución enterprise completa de inicio a fin, aplicando todos los conceptos del Nivel 4: gobernanza, multi-ambiente, integraciones Azure, AI, datos con Fabric, seguridad Zero Trust, y comunicando la arquitectura a stakeholders ejecutivos como lo haría un Solution Architect certificado.

### 📖 Conceptos Clave
Este módulo es puramente aplicado — no introduce conceptos nuevos. Demuestra dominio completo del Nivel 4.

- **Architecture Decision Record (ADR):** documento ligero (1-2 páginas) que registra una decisión arquitectónica importante con su contexto, las opciones consideradas, la decisión tomada y las consecuencias. Un ADR no se borra cuando la decisión cambia — se marca como "superseded" y se crea uno nuevo. Ejemplo: "ADR-003: Elegimos Power Pages sobre una aplicación React personalizada porque el equipo del cliente no tiene capacidad para mantener código custom en el largo plazo y Power Pages cubre el 95% de los requerimientos del portal sin desarrollo adicional."
- **MVP (Minimum Viable Product):** versión mínima del sistema que entrega valor real al usuario final y permite validar las hipótesis de negocio más importantes antes de invertir en las funcionalidades completas. En proyectos de Power Platform, el MVP típicamente incluye: el flujo principal de negocio funcionando end-to-end (aunque sin optimizaciones de UX), integraciones críticas sin las cuales el sistema no tiene valor, y seguridad básica. Lo que queda fuera del MVP son: reportes avanzados, integraciones secundarias, configuración de notificaciones personalizadas, y funcionalidades "nice to have".
- **Go-Live Checklist:** lista de verificación que confirma que el sistema está listo para ser usado en producción por usuarios reales. Para Power Platform incluye: Solution Checker con 0 errores críticos, pipeline CI/CD verde en todas las etapas, UAT completado y firmado por el cliente, CMK y PIM configurados en PROD, plan de rollback documentado y probado, runbook de operaciones creado, y training de usuarios completado. Ningún item es opcional; si alguno falla, el go-live se pospone.
- **Runbook de Operaciones:** documento que describe cómo operar y mantener el sistema en producción: cómo monitorear el estado del sistema (qué dashboards mirar, qué alertas existen), cómo responder a las alertas más comunes (procedimiento paso a paso), cómo hacer un rollback si hay un problema post-despliegue, contactos de escalamiento (quién llama a quién cuando hay un problema crítico a las 2am), y cuándo y cómo aplicar actualizaciones. Sin runbook, el equipo de operaciones improvisa ante cada incidente.
- **Stakeholder Communication Plan:** plan que define para cada stakeholder del proyecto: qué información necesita, con qué frecuencia, en qué formato, y a través de qué canal. El CFO necesita el estado financiero mensual en un email ejecutivo de 1 página; el equipo de desarrollo necesita las decisiones técnicas inmediatamente vía Teams; el usuario final necesita avisos de mantenimiento con 48h de antelación vía email. Sin este plan, la comunicación es reactiva y genera fricción.

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

### 💼 Caso Real de Negocio
**Empresa:** Cooperativa financiera regional con 800 empleados, operaciones en 3 países (Colombia, Ecuador, Perú), datos de socios en Excel y sistema legacy AS/400 de los años 90.
**Problema:** El proceso de aprobación de créditos tardaba en promedio 5 días hábiles (la competencia fintech lo hace en 10 minutos). Cada oficina regional usaba su propia versión de un Excel para trackear solicitudes, con datos inconsistentes e inaccesibles desde la sede central. No había visibilidad ejecutiva en tiempo real. El cumplimiento de la Ley 1581 en Colombia y las regulaciones de la Superintendencia de Bancos en Ecuador y Perú no estaba documentado.
**Solución implementada (análoga al proyecto capstone):** Arquitectura multi-tenant (Colombia en Brazil South, Ecuador+Perú en East US), Power Pages para solicitudes de socios, Canvas App mobile para asesores, Model-Driven + BPF para analistas, Logic Apps para integración con 2 burós de crédito, AI Builder para extracción de documentos de ingresos, Fabric Lakehouse con DirectLake para reporting consolidado multi-país, Zero Trust con PIM y Sentinel, CoE con compliance process para 3 tenants sincronizados.
**Resultado:** Tiempo de aprobación reducido de 5 días a 4 horas para el 70% de solicitudes. 30% restante sigue en revisión humana pero con toda la información preparada automáticamente. Cumplimiento regulatorio documentado y auditado. Costo del sistema 60% menor que la solución legacy que cotizaban antes de conocer Power Platform.

### ✅ Buenas Prácticas
- Empezar el capstone con el Architecture Blueprint antes de escribir una sola línea de código — las decisiones arquitectónicas tempranas son las más baratas de cambiar
- Versionar todos los ADRs en git; cuando una decisión cambia, el historial del ADR explica por qué — invaluable para nuevos miembros del equipo
- El proyecto capstone no es un proyecto "de estudio" — tratarlo como si fuera un cliente real: SoW, Risk Register actualizado semanalmente, presentación ejecutiva final
- Documentar cada decisión no obvia con el patrón "decidimos X porque Y, aunque consideramos Z que rechazamos por W" — esto es lo que diferencia a un arquitecto de un developer senior
- Usar el proyecto capstone activamente en entrevistas y conversaciones con clientes — es el portfolio que demuestra capacidad real

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Saltarse el Architecture Blueprint y empezar a construir directo | Impaciencia por "ver algo funcionando" — el instinto de developer | Sin Blueprint, cada decisión técnica se toma en el momento sin visión global; el costo de refactorizar después es 5-10x mayor que diseñar bien primero |
| Capstone con scope demasiado pequeño que no demuestra capacidades de Nivel 4 | Subestimación del proyecto o intento de terminarlo rápido | El capstone debe incluir obligatoriamente: multi-ambiente, al menos 1 integración Azure, AI Builder, Fabric con Medallion, y Zero Trust — omitir cualquiera deja gaps en el portfolio |
| No involucrar a un mentor o par para revisar el Architecture Blueprint | Trabajo en aislamiento sin validación externa | Buscar al menos 1 persona con experiencia para revisar el Blueprint antes de empezar a construir; los errores arquitectónicos son invisibles para quien los diseñó |
| Presentación ejecutiva final llena de jerga técnica | El arquitecto está más cómodo hablando de tecnología que de negocio | Practicar la presentación con alguien no técnico (familiar, colega de otra área); si no entienden, reescribir hasta que entiendan |

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
