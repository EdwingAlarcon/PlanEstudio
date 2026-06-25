---
moduleId: 30
title: "Proyecto Multicapa Nivel 3"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 9
slug: "proyecto-multicapa-nivel-3"
---
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

#### Actividad 30.1: Arquitectura del proyecto
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

#### Actividad 30.2: Plugin — CasoPreCreate
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

#### Actividad 30.3: Pipeline CI/CD completo
1. Azure DevOps con 4 service connections (DEV/TEST/UAT/PROD)
2. Pipeline CI: export → Solution Checker → pack managed → publish artifact
3. Pipeline CD: deploy TEST (auto) → deploy UAT (aprobación) → deploy PROD (2 aprobadores)
4. Branch strategy:
   ```
   main → solo merges desde develop, protegida
   develop → triggers el pipeline CI
   feature/xxx → PRs hacia develop
   ```

#### Actividad 30.4: Test end-to-end
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

*Siguiente nivel: [Nivel 4 — Arquitecto](/nivel/arquitecto) — Enterprise Architecture, CoE, Multi-tenant, Azure AI, Gobernanza*
