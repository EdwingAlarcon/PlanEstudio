---
moduleId: 18
title: "Arquitectura de Soluciones Power Platform"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 7
slug: "arquitectura-de-soluciones-power-platform"
---
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
