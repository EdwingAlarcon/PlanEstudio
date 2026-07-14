---
moduleId: 65
title: "Capstone Enterprise D365 — Arquitectura CE, Contact Center, Field Service e Integración F&O"
level: "d365"
certification: "D365 Enterprise Apps Portfolio"
estimatedMinutes: 14
slug: "capstone-enterprise-d365"
---
### 🎯 Objetivo
Integrar Sales, Customer Service, Contact Center, Customer Insights, Field Service y Finance & Operations en una propuesta enterprise defendible, con alcance, arquitectura, matriz de datos, roadmap, riesgos, licencias y evidencias de portafolio.

### 📖 Conceptos Clave
- **Capstone enterprise:** evidencia final que demuestra criterio de consultoría, no solo uso de pantallas.
- **Proceso end-to-end:** campaña/segmento → lead → oportunidad → venta → caso → conversación → work order → factura/ERP → fidelización.
- **Fit-Gap:** decide qué se configura estándar, qué se personaliza, qué se integra y qué queda fuera.
- **Arquitectura de datos:** Account/Contact como base CE, perfiles unificados en Customer Insights - Data, journeys para activación, F&O como dueño de procesos ERP.
- **Licenciamiento:** Sales, Customer Service, Contact Center, Customer Insights, Field Service y F&O tienen licencias/capacidades distintas. Un capstone serio marca supuestos y dependencias.
- **Ambientes y ALM:** DEV/TEST/PROD, soluciones, variables de entorno, pipelines, ownership y estrategia de datos de prueba.
- **Operación:** SLA, routing, Schedule Board, mobile offline, monitoreo de integración, soporte y adopción.
- **Evidencia de portafolio:** diagramas, matrices, backlog, UAT, dashboards y demo narrada.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Elige un caso: empresa de servicios técnicos B2B con venta consultiva, soporte premium y mantenimiento preventivo.
2. Diseña el flujo end-to-end en 10 pasos desde campaña hasta renovación. Nombra producto D365 responsable por cada paso.
3. Crea una matriz Fit-Gap con 12 filas: proceso, estándar, gap, decisión, riesgo, owner y evidencia.
4. Crea matriz de datos con Account, Contact, Opportunity, Case, Conversation, Work Order, Product, Sales Order, Invoice e Inventory.
5. Define roadmap por fases: piloto CE, Contact Center, Field Service, Customer Insights, integración F&O y hardening ALM.
6. Lista qué requiere tenant real: licencias por producto, ambientes, canales, usuarios, datos, integraciones y permisos.

### 💼 Casos Reales de Negocio
Una organización quiso implementar Sales, Service, Field Service e integración ERP en una sola salida a producción. El alcance parecía "integrado", pero no había ownership de datos, pruebas por canal ni plan de adopción para técnicos. El proyecto se rescató dividiéndolo en fases con valor incremental: pipeline comercial, SLA y casos, Field Service operativo, Customer Insights, y finalmente integración ERP gobernada. El capstone replica esa disciplina: arquitectura completa, implementación por fases.

### ✅ Buenas Prácticas
- Defender una arquitectura end-to-end, pero proponer despliegue por fases.
- Incluir licencias y dependencias reales; no esconderlas detrás de "se configura después".
- Usar matrices de ownership y Fit-Gap como entregables centrales.
- Diseñar UAT por proceso, no por producto aislado.
- Preparar evidencias que sirvan para entrevista laboral y revisión ejecutiva.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Capstone como demo de pantallas | Falta arquitectura y evidencia | Entregar diagramas, matrices, UAT y decisiones |
| Alcance de big bang | Se confunde visión integral con despliegue simultáneo | Roadmap por fases y criterios de salida |
| Licencias omitidas | Se evita conversación comercial | Supuestos de licencia por producto desde el diseño |
| Integración ERP tardía | Se diseña CE sin ownership de datos | Matriz CE + F&O desde fase 0 |

### 🧪 Criterios de Validación
- [ ] Diseñé un flujo end-to-end con producto responsable por paso
- [ ] Construí matrices Fit-Gap y ownership de datos
- [ ] Definí roadmap por fases con dependencias de licencia/tenant
- [ ] Preparé evidencias de portafolio defendibles en entrevista

