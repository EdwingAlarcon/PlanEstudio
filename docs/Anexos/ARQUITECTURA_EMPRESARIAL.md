# ARQUITECTURA EMPRESARIAL — Patrones y Reference Architectures
**Guía de decisiones arquitectónicas** | Patrones, anti-patrones y referencias

---

## 1. Principios de Arquitectura

### Los 10 principios del Solution Architect de Power Platform

1. **Configuración antes que código** — Usar Business Rules, Power Automate y configuración nativa antes de escribir C# o TypeScript. El código tiene costo de mantenimiento.

2. **El modelo de datos primero** — Diseñar las tablas, relaciones y columnas antes de construir cualquier app o flujo. Un modelo de datos incorrecto es el error más caro de corregir.

3. **Soluciones, siempre** — Todo lo que va a producción vive en una solución. Zero excepciones.

4. **Mínimo privilegio** — Los Security Roles otorgan el mínimo acceso necesario. Ampliar si se justifica, nunca dar acceso "por si acaso".

5. **Fallo ruidoso, nunca silencioso** — Los flujos que fallan sin notificación son más peligrosos que los flujos que lanzan errores visibles. Siempre Scope Try/Catch con logging.

6. **Inmutabilidad en producción** — Nadie edita componentes directamente en PROD. Todo va por DEV → solución → pipeline → PROD.

7. **Desacoplar lo que puede cambiar** — URLs, correos, parámetros de negocio en Environment Variables. Conexiones en Connection References. Lo que puede cambiar por ambiente, nunca hardcodeado.

8. **Pensar en el equipo, no en ti** — Código sin comentarios, nombres crípticos y decisiones sin documentar son deuda técnica inmediata. Nombra bien, documenta el "por qué".

9. **Medir antes de optimizar** — No optimizar lo que no has medido. Usar Monitor (Canvas), Plugin Trace Log, Application Insights antes de decidir que algo es lento.

10. **El usuario de negocio tiene la razón sobre el proceso** — El arquitecto tiene la razón sobre la tecnología. Nunca imponer un proceso porque "la plataforma funciona así".

---

## 2. Árbol de Decisiones Arquitectónicas

### ¿Qué tipo de aplicación?
```
¿Los usuarios son externos (clientes, proveedores, público)?
  → SÍ → Power Pages

¿Requiere UI completamente personalizada o experiencia mobile-first?
  → SÍ → Canvas App

¿Los datos son principalmente de Dataverse con relaciones complejas?
¿Los usuarios son internos y necesitan formularios estándar + BPF?
  → SÍ → Model-Driven App

¿Es principalmente consulta de datos y reportes?
  → SÍ → Power BI (+ Embedded si va dentro de otra app)

¿Necesitas combinar varias de las anteriores?
  → Usar la más apropiada para cada módulo dentro de la misma solución
```

### ¿Dónde almacenar los datos?
```
¿Los datos necesitan lógica de negocio (plugins, BPF, reglas)?
¿Se integran con Power Apps, Power Automate, Power BI nativamente?
¿Necesitas seguridad por fila (Security Roles, RLS)?
  → SÍ → Dataverse (opción preferida para Power Platform)

¿Son documentos y archivos, con datos relacionales simples?
¿El equipo ya usa SharePoint extensivamente?
¿Presupuesto muy limitado (licencias)?
  → SÍ → SharePoint Lists (limitaciones: no plugins, max 30M items)

¿Datos de alto volumen (millones de registros)?
¿Requieres SQL completo (stored procedures, triggers, esquemas complejos)?
¿Integración con sistemas de datos empresariales (Azure Synapse, ADF)?
  → SÍ → Azure SQL + conector premium

¿Datos analíticos/históricos para BI?
  → Microsoft Fabric Lakehouse / Azure Synapse Analytics
```

### ¿Automatización con Power Automate o Azure?
```
¿El flujo es simple (< 20 pasos) y no requiere código?
¿El equipo de negocio puede mantenerlo sin IT?
¿Latencia de segundos es aceptable?
  → Power Automate

¿El flujo requiere transformaciones complejas de datos?
¿Necesitas integraciones EDI, B2B, XML/XSLT?
¿SLA estricto de milisegundos o integración de alta frecuencia?
¿Necesitas estado persistido entre pasos durante días o semanas?
  → Azure Logic Apps o Azure Durable Functions

¿Lógica de negocio que DEBE ejecutarse en el servidor (imposible de eludir)?
¿Transformación síncrona del registro durante el save?
  → Plugin C# (no Power Automate — PA es async o requiere paso extra)
```

---

## 3. Reference Architectures

### RA-01: CRM para PYME (< 200 usuarios)
```
Componentes:
  - Dataverse como sistema de registro
  - D365 Sales (si el presupuesto lo permite) o tablas personalizadas
  - Canvas App mobile para vendedores en campo
  - Model-Driven App para managers
  - Power Automate para flujos de aprobación
  - Power BI para dashboard de pipeline
  - Copilot Studio para bot de Teams (KPIs y creación rápida)

Stack de ambientes:
  DEV → TEST → PROD (3 ambientes)
  
ALM:
  Pipeline GitHub Actions (gratuito para repos públicos)
  O Pipelines for Power Platform nativo (sin Azure DevOps)

Licencias mínimas:
  Power Apps per user: $20/usuario/mes (acceso a Canvas + Model-Driven)
  D365 Sales Professional: $65/usuario/mes (si se usa D365 Sales)
```

### RA-02: Portal de Autoservicio B2C (clientes externos)
```
Componentes:
  - Azure AD B2C para identidad de clientes
  - Power Pages para el portal web
  - Dataverse para datos de negocio
  - Azure Blob Storage para documentos (vía SAS tokens)
  - Power Automate para procesar solicitudes del portal
  - Copilot Studio (embebido en el portal)
  - D365 Customer Service para agentes internos
  - Power BI para métricas de autoservicio

Seguridad:
  - Table Permissions tipo "Contact" (cada cliente ve solo sus datos)
  - WAF (Web Application Firewall) en el portal
  - Azure AD B2C con MFA opcional
  
Flujo típico:
  Cliente registra → B2C → llena formulario en portal → 
  Power Automate procesa → Plugin valida → agente D365 atiende si necesario

Costos adicionales:
  Power Pages: $200/mes/ambiente PROD (100,000 usuarios anónimos incluidos)
  Azure AD B2C: gratuito hasta 50,000 MAU (Monthly Active Users)
```

### RA-03: Integración Enterprise (SAP + Dataverse)
```
Componentes:
  - Dataverse como sistema de registro de CRM
  - SAP como sistema de registro de ERP/finanzas
  - Azure Service Bus como middleware (desacoplamiento)
  - Azure Logic Apps para orquestación de integración
  - Azure API Management como gateway
  - Azure Functions para lógica de transformación custom
  - Application Insights para monitoreo

Flujo Dataverse → SAP:
  Plugin Post-Operation (async) → Service Bus Queue →
  Logic App → Transform (XML/JSON) → SAP OData API →
  Actualizar Dataverse con SAP ID

Flujo SAP → Dataverse:
  SAP Event/IDoc → Azure Service Bus Topic →
  Logic App → Dataverse Web API → 
  Actualizar/Crear registro

Garantías:
  - Service Bus garantiza entrega (no pérdida de mensajes)
  - Dead Letter Queue para mensajes fallidos después de 3 reintentos
  - Alertas Azure Monitor si DLQ tiene mensajes
  - Idempotencia en el Logic App (el mismo mensaje procesado 2 veces = mismo resultado)
```

### RA-04: Analytics Platform (Power BI + Fabric)
```
Componentes:
  - Dataverse Link to Fabric (exportación automática)
  - Microsoft Fabric Lakehouse (almacenamiento Delta)
  - Notebooks PySpark para Bronze → Silver → Gold
  - Power BI con DirectLake sobre Gold layer
  - Data Activator para alertas automáticas
  - Azure Data Factory (si hay fuentes adicionales no-Dataverse)

Medallion Layers:
  Bronze: datos tal como vienen de Dataverse (inmutable)
  Silver: limpios, estandarizados, tipos correctos, UTC
  Gold: métricas de negocio pre-calculadas, desnormalizadas para BI

Actualización:
  Dataverse → Fabric: continuo (near real-time)
  Bronze → Silver: cada 4 horas (notebook programado)
  Silver → Gold: una vez por día (noche)
  Power BI: DirectLake, sin importación periódica necesaria

RLS:
  Implementado en el Semantic Model de Power BI
  Roles: Director (all), Gerente Regional (su región), Vendedor (sus datos)
```

### RA-05: Solución Multinacional (Multi-tenant)
```
Tenant Corporativo (Hub):
  - CoE Starter Kit
  - Políticas DLP estándar corporativas
  - Soluciones Foundation compartidas
  - Azure AD (identidades corporativas)
  - APIM como gateway de APIs corporativas

Tenant Colombia:
  - Ambiente PROD en región "Brazil South"
  - DLP extendida con restricciones adicionales (Ley 1581)
  - Azure AD B2B: empleados corporativos acceden con cuenta corp
  - Integración con Hub vía Service Bus

Tenant México:
  - Ambiente PROD en región "South Central US"  
  - DLP con restricciones de datos fiscales (SAT)
  - Similar a Colombia

Tenant España/UE:
  - Ambiente PROD en región "West Europe" (GDPR obligatorio)
  - CMK (Customer-Managed Keys) en el ambiente PROD
  - Purview para clasificación de datos personales de ciudadanos EU
  - DPA con Microsoft firmado para el tenant

Integración Hub ↔ Tenants:
  No hay conectores directos de Dataverse entre tenants
  Integración: Azure Service Bus + Azure Functions
  O bien: Azure APIM como gateway de APIs entre tenants
```

---

## 4. Anti-Patrones a Evitar

### Anti-patrón 1: Mega-solución
```
❌ Problema:
Una sola solución con 300+ componentes:
  SIT_TODO: apps, flujos, tablas, plugins, PCF, reportes, integraciones...

Síntomas:
  - Importar tarda 45+ minutos
  - Un bug en el módulo de Ventas bloquea el despliegue de Proyectos
  - Nadie sabe qué componentes dependen de cuáles
  - Solution Checker tarda horas

✅ Solución:
Descomponer en soluciones por dominio funcional:
  SIT_Foundation (shared base)
  SIT_CRM (sales, accounts, contacts)
  SIT_Proyectos (project management)
  SIT_Integraciones (external integrations)
  SIT_Reportes (Power BI datasets)
```

### Anti-patrón 2: Flujos sin manejo de errores
```
❌ Problema:
Power Automate con 15 pasos, ningún Scope Try/Catch.
Cuando falla el paso 8, el error se registra en el historial de ejecución
pero nadie lo ve hasta que el cliente llama diciendo que "no llegó la notificación".

Síntomas:
  - Errores silenciosos en producción
  - Los usuarios se enteran de los fallos antes que IT
  - Imposible saber en qué paso falló sin revisar el historial manualmente

✅ Solución:
Scope "Try" → lógica del flujo
Scope "Catch" (Run After: Failed) → 
  Registrar en tabla ErroresFlow (timestamp, mensaje, ID de ejecución)
  Enviar notificación Teams/email al equipo de operaciones
  Crear tarea de seguimiento en Planner
```

### Anti-patrón 3: Datos sensibles en código
```
❌ Problema:
// Plugin C# con URL hardcodeada
var url = "https://api.buro-credito.com/api/consulta?key=sk-live-xxxxx";
// O en un flujo: la URL de producción está en el campo "URI" de una acción HTTP

Problemas:
  - El secreto está en el código y en el historial de git
  - Cambiar el ambiente requiere modificar y redesplegar el código
  - Imposible hacer rotate del secreto sin recompilar

✅ Solución:
  En plugins: Environment Variables → leer desde Dataverse en tiempo de ejecución
  En flujos: Environment Variables → usar en el campo URI de acciones HTTP
  Para secretos reales: Azure Key Vault → pac CLI puede leer KV en pipelines
  En pipelines: Variable Groups de Azure DevOps (secretos encriptados)
```

### Anti-patrón 4: Canvas App que carga toda la tabla
```
❌ Problema:
App.OnStart:
  ClearCollect(colSolicitudes, Solicitudes)  // carga 50,000 registros al cliente

Síntomas:
  - La app tarda 2+ minutos en cargar
  - Los usuarios en móvil no pueden usarla
  - Delegación ignorada → los filtros se aplican en el cliente (solo sobre 2000 registros)

✅ Solución:
// Cargar solo los registros del usuario actual + últimos 30 días
App.OnStart:
  ClearCollect(colSolicitudes, 
    Filter(Solicitudes, 
      Asignado = User().Email &&
      'Fecha Creación' >= DateAdd(Today(), -30, Days)
    )
  )

// Y usar paginación para mostrar de 50 en 50
// O usar Gallery directamente conectada a la fuente con filtros delegables
```

### Anti-patrón 5: Plugin que hace demasiado
```
❌ Problema:
Plugin síncrono Post-operation que:
  1. Llama a API externa (puede tardar 5-10 segundos)
  2. Envía email via Exchange
  3. Actualiza 50 registros relacionados
  4. Llama a un segundo servicio externo
  → Timeout del plugin (máx 2 min) o el usuario espera 30 segundos para guardar

✅ Solución:
Plugin Pre-operation síncrono: SOLO validaciones (< 1 segundo)
Plugin Post-operation ASÍNCRONO: todo lo demás
  O mejor: Plugin Post-operation async → pone mensaje en Service Bus → 
  Azure Function procesa el trabajo pesado sin límite de tiempo
```

### Anti-patrón 6: DLP solo en producción
```
❌ Problema:
DLP estricta en PROD pero sandbox de DEV sin DLP.
Un developer crea un flujo con Gmail + Dataverse en DEV.
Funciona perfecto en DEV. Al mover a PROD, el conector Gmail está bloqueado.
El flujo falla silenciosamente.

✅ Solución:
La DLP de DEV debe ser igual o más estricta que PROD.
O al menos: todos los conectores usados en DEV deben estar en la misma
clasificación (Business/Non-Business) que en PROD.
Ejecutar el pipeline a TEST/UAT antes de llegar a PROD detecta estos issues.
```

---

## 5. Framework de Toma de Decisiones

### Template de ADR (Architecture Decision Record)
```markdown
# ADR-XXX: [Título corto y descriptivo]

## Estado
[Propuesto / En revisión / Aceptado / Rechazado / Deprecado]

## Fecha
2026-05-27

## Participantes
- Tomó la decisión: [Nombre del arquitecto]
- Consultados: [Lista de personas consultadas]

## Contexto
[Describe la situación, el problema a resolver, y las restricciones conocidas.
¿Por qué se tuvo que tomar esta decisión? ¿Qué limitaciones existen?]

## Opciones Consideradas
### Opción 1: [Nombre]
- Pro: ...
- Con: ...
- Costo estimado: ...

### Opción 2: [Nombre]
- Pro: ...
- Con: ...
- Costo estimado: ...

## Decisión
**[Opción elegida]**

## Justificación
[¿Por qué se eligió esta opción sobre las demás? Ser específico con los criterios
de decisión: costo, capacidad del equipo, requisitos técnicos, timeline.]

## Consecuencias
- ✅ [Consecuencia positiva 1]
- ✅ [Consecuencia positiva 2]
- ⚠️ [Implicación o costo a monitorear]
- ❌ [Lo que NO haremos como resultado de esta decisión]

## Revisión
[Fecha de revisión de esta decisión, o condición que trigger una revisión]
```

### ADRs mínimos para cualquier proyecto
1. `ADR-001-almacen-de-datos.md` — Dataverse vs SharePoint vs Azure SQL
2. `ADR-002-tipo-de-aplicacion.md` — Canvas vs Model-Driven vs Pages
3. `ADR-003-estrategia-alm.md` — Azure DevOps vs GitHub Actions vs Pipelines nativo
4. `ADR-004-estrategia-integracion.md` — Power Automate vs Logic Apps vs Azure Functions
5. `ADR-005-modelo-seguridad.md` — Autenticación, autorización, DLP

---

## 6. Capacity Planning

### Cálculo de almacenamiento Dataverse
```
Capacidad base incluida con licencias:
  Por tenant: 10 GB
  Por usuario con D365 Enterprise: + 250 MB/usuario
  Por usuario con Power Apps per user: + 50 MB/usuario

Ejemplo: 100 usuarios Power Apps per user
  Total: 10 GB + (100 × 50 MB) = 10 GB + 5 GB = 15 GB

Estimación de uso:
  Por registro estándar (sin adjuntos): ~4 KB
  100,000 registros → 400 MB
  Con archivos adjuntos: calcular promedio por documento × número de documentos

Comprar storage adicional:
  1 GB adicional: ~$40/mes
  Estrategia de archivado: mover datos históricos (> 2 años) a Azure Blob Storage
```

### Límites de API (throttling)
```
Power Platform request limits:
  Power Apps / Power Automate per user: 40,000 requests/día por usuario
  Power Apps per app: 6,000 requests/día por usuario
  D365 Enterprise: 40,000 requests/día por usuario

  Si una sola app/flujo consume demasiados requests → riesgo de throttling

Dataverse Web API:
  Máx 6,000 requests per 5 minutos por usuario (API calls)
  
Estrategias para evitar throttling:
  - Batch API: agrupar múltiples operaciones en una llamada
  - Reducir el número de llamadas en flujos (usar FetchXML con joins en lugar de múltiples Get)
  - Caching en Canvas Apps (Named Formulas, colecciones en memoria)
  - Retry with exponential backoff cuando se recibe 429
```

### Licencias — resumen de costos (referencia 2025-2026)
```
Power Apps:
  Per User: $20/usuario/mes (acceso ilimitado a todas las apps del tenant)
  Per App: $5/usuario/mes × número de apps (hasta 2 apps)
  
Power Automate:
  Per User: $15/usuario/mes (flujos en la nube ilimitados)
  Per Flow: $100/flujo/mes (sin límite de usuarios que lo ejecutan)

Dynamics 365:
  Sales Professional: $65/usuario/mes
  Sales Enterprise: $95/usuario/mes
  Customer Service Professional: $50/usuario/mes
  Customer Service Enterprise: $95/usuario/mes

Power Pages:
  $200/mes/ambiente (incluye 100,000 usuarios anónimos)
  $500/mes/ambiente para autenticados

Power BI:
  Pro: $10/usuario/mes
  Premium per User: $20/usuario/mes (AI features, larger models)
  Premium Capacity: desde $4,995/mes (para sharing a usuarios sin licencia)

Microsoft Fabric:
  Incluido en M365 E3/E5 (capacidad básica)
  Fabric Capacity: desde $0.18/CU/hora
```

---

## 7. Non-Functional Requirements (NFRs)

### Template de NFRs para Power Platform
```markdown
# Non-Functional Requirements — [Proyecto]

## Disponibilidad
- SLA objetivo: 99.5% (downtime máx: 3.6 horas/mes)
- Ventana de mantenimiento: domingos 2:00-4:00 AM
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 24 horas (backup diario)

## Rendimiento
- Canvas App carga inicial: < 5 segundos en conexión 4G
- Model-Driven App formulario: < 3 segundos
- Power Automate flujo de aprobación: < 2 minutos end-to-end
- Power BI dashboard: < 10 segundos para cargar
- Plugin síncrono: < 2 segundos (máx 8 segundos antes de timeout de UI)

## Escalabilidad
- Usuarios concurrentes en Canvas App: máx 200
- Volumen de registros en Dataverse: hasta 1M registros por tabla principal
- Flujos disparados simultáneamente: hasta 500 (considerar throttling)
- Crecimiento esperado de datos: 20% anual

## Seguridad
- Autenticación: Azure AD con MFA obligatorio
- Datos sensibles: cifrados en reposo y en tránsito
- Acceso a producción: solo vía PIM (JIT) para administradores
- Auditoría: habilitada en tablas financieras y de RRHH
- DLP: conector HTTP bloqueado en PROD

## Mantenibilidad
- Cobertura de unit tests (plugins): ≥ 80%
- Tiempo de onboarding de nuevo developer: < 1 semana
- Documentación: ADRs para decisiones, README por módulo
- CI/CD: todo cambio debe pasar el pipeline antes de llegar a PROD

## Cumplimiento
- GDPR: datos de ciudadanos EU en región West Europe
- Ley 1581 (Colombia): datos tratados con políticas de privacidad vigentes
- Auditoría HIPAA: [si aplica] logs retenidos por 7 años
```

---

## 8. Mapa de Madurez de Power Platform

Evalúar la organización en estos niveles para definir el roadmap:

| Dimensión | Nivel 1 (Inicial) | Nivel 2 (Gestionado) | Nivel 3 (Definido) | Nivel 4 (Optimizado) |
|-----------|-------------------|---------------------|-------------------|---------------------|
| **Gobernanza** | Sin políticas | DLP básico | CoE activo, políticas documentadas | Governance as Code, métricas de cumplimiento |
| **ALM** | Export manual | Soluciones con CI básico | CI/CD completo con aprobaciones | Deploy automatizado con rollback automático |
| **Seguridad** | Permisos por defecto | Security Roles básicos | Zero Trust, PIM, Purview | Sentinel con detección automática de amenazas |
| **Desarrolladores** | Solo citizen devs | Mix de citizen + pro devs | Fusion Teams estructurados | CoE con programa de training y certificaciones |
| **Datos** | SharePoint + Excel | Dataverse + Power BI básico | Fabric Medallion + DirectLake | Fabric + AI/ML + Data Activator |
| **Integraciones** | Manuales o point-to-point | Custom Connectors + PA | Azure Integration Hub | Event-driven, real-time, self-healing |

**Objetivo para un Solution Architect:** llevar a la organización del nivel donde está al nivel 3 o 4 en 18-24 meses.
