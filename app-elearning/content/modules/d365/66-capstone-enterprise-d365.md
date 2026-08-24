---
moduleId: 66
title: "Capstone Enterprise D365 — Arquitectura CE, Contact Center, Field Service e Integración F&O"
level: "d365"
certification: "D365 Especialización Portfolio"
estimatedMinutes: 14
slug: "capstone-enterprise-d365"
---
### 🎯 Objetivo
Integrar Sales, Customer Service, Contact Center, Customer Insights, Field Service y Finance & Operations en una propuesta enterprise defendible, con alcance, arquitectura, matriz de datos, roadmap, riesgos, licencias y evidencias de portafolio que puedas presentar tanto en una entrevista de Solution Architect como en una revisión ejecutiva real.

### 📖 Conceptos Clave
- **Capstone enterprise:** evidencia final que demuestra criterio de consultoría (decisiones, trade-offs, secuenciación) — no solo la capacidad de navegar pantallas de cada producto.
- **Proceso end-to-end — con producto responsable por tramo:** campaña/segmento (Customer Insights - Journeys, Módulo 64) → lead (Sales) → oportunidad (Sales, Módulo 61) → venta/orden (Sales → F&O, Módulo 60/64) → caso (Customer Service, Módulo 62) → conversación (Contact Center, Módulo 63) → work order (Field Service, Módulo 59) → factura/ERP (F&O) → fidelización (Customer Insights - Data, Módulo 58, que retroalimenta el ciclo). Ningún tramo de este flujo pertenece a un solo producto — es la integración completa la que se defiende en el capstone.
- **Fit-Gap:** documento que decide, proceso por proceso, qué se configura estándar (sin personalizar), qué se personaliza dentro de la plataforma, qué se resuelve con integración a otro sistema, y qué explícitamente queda fuera de alcance en esta fase.
- **Arquitectura de datos:** Account/Contact como base compartida de CE (Módulo 57), perfiles unificados y medidas en Customer Insights - Data, journeys para activación de esos perfiles, y F&O como dueño de los procesos ERP (order-to-cash, procure-to-pay) con ownership definido vía la matriz del Módulo 65.
- **Licenciamiento:** Sales, Customer Service, Contact Center, Customer Insights, Field Service y F&O tienen licencias/capacidades distintas, con pools de licenciamiento separados entre CE y F&O (Módulo 60). Un capstone serio marca explícitamente qué licencias asume por rol/usuario, no las omite "para simplificar".
- **Ambientes y ALM:** DEV/TEST/PROD, soluciones versionadas, variables de entorno, pipelines de despliegue, ownership de componentes y estrategia de datos de prueba — la misma disciplina de ALM del Módulo 19, aplicada a un alcance multi-producto.
- **Operación:** SLA (Módulo 62), unified routing (Módulo 63), Schedule Board (Módulo 59), mobile offline (Módulo 59), monitoreo de integración CE+F&O (Módulo 65), soporte post-go-live y plan de adopción por rol de usuario.
- **Evidencia de portafolio:** diagramas de arquitectura y de proceso, matrices (Fit-Gap, ownership de datos), backlog priorizado, plan de UAT por proceso (no por producto aislado), dashboards ejecutivos y una demo narrada que conecte los 6 productos en una sola historia de negocio.
- **Requisitos reales de práctica:** el Fit-Gap, las matrices, el roadmap y los diagramas de arquitectura pueden construirse sin tenant, como el entregable central de este capstone. Ejecutar el flujo end-to-end en vivo (crear la Opportunity, generar el caso, ver el Work Order, confirmar la factura en F&O) requiere ambientes reales conectados de CE y F&O, licencias de cada producto y datos maestros consistentes entre sistemas.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Elige un caso: empresa de servicios técnicos B2B con venta consultiva, soporte premium y mantenimiento preventivo (puedes reutilizar Andina Servicios Industriales del Lab 71 o SIT de los Labs 66/81).
2. Diseña el flujo end-to-end en 10 pasos desde campaña hasta renovación. Nombra el producto D365 responsable por cada paso, usando la cadena de la sección de Conceptos Clave como plantilla.
3. Crea una matriz Fit-Gap con 12 filas: proceso, estándar, gap, decisión, riesgo, owner y evidencia. Incluye al menos un gap por cada uno de los 6 productos (Sales, Customer Service, Contact Center, Customer Insights, Field Service, F&O).
4. Crea una matriz de datos con Account, Contact, Opportunity, Case, Conversation, Work Order, Product, Sales Order, Invoice e Inventory, indicando sistema dueño (reutiliza el criterio del Módulo 65).
5. Define un roadmap por fases: piloto CE (Sales + Customer Service), Contact Center, Field Service, Customer Insights, integración F&O, y hardening ALM — con al menos un criterio de salida (exit criteria) medible por fase.
6. Responde esta pregunta de entrevista/consultoría de Solution Architect: "El cliente quiere lanzar Sales, Service, Field Service e integración F&O en una sola salida a producción — ¿qué le responderías?" (respuesta esperada: recomendar despliegue por fases con valor incremental, citando el riesgo de ownership de datos sin probar y adopción sin plan, como en el caso de negocio de este módulo).
7. Lista qué requiere tenant real: licencias por producto, ambientes conectados, canales configurados, usuarios, datos maestros, integraciones activas y permisos administrativos.

### 💼 Casos Reales de Negocio
Una organización quiso implementar Sales, Service, Field Service e integración ERP en una sola salida a producción. El alcance parecía "integrado", pero no había ownership de datos definido, ni pruebas por canal, ni plan de adopción para los técnicos que usarían la app móvil de Field Service en campo. El primer intento de UAT reveló decenas de vacíos simultáneos en 4 productos distintos, y el proyecto estuvo a punto de cancelarse por falta de confianza del comité ejecutivo. Se rescató dividiéndolo en fases con valor incremental: pipeline comercial primero, luego SLA y casos, después Field Service operativo, Customer Insights después, y finalmente integración ERP gobernada con su propia matriz de ownership. El capstone replica esa disciplina: arquitectura completa diseñada de una vez, implementación entregada por fases con valor demostrable en cada una.

### ✅ Buenas Prácticas
- Defender una arquitectura end-to-end completa, pero proponer siempre un despliegue por fases con valor incremental.
- Incluir licencias y dependencias reales en el diseño; no esconderlas detrás de "se configura después".
- Usar matrices de ownership y Fit-Gap como entregables centrales del capstone, no como anexos opcionales.
- Diseñar UAT por proceso de negocio completo, no por producto aislado — un proceso end-to-end que cruza 3 productos necesita una prueba que cruce los 3.
- Preparar evidencias que sirvan tanto para una entrevista laboral de Solution Architect como para una revisión ejecutiva real.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Capstone como demo de pantallas | Falta arquitectura, matrices y evidencia de decisión | Entregar diagramas, matrices, UAT y justificación de cada decisión |
| Alcance de big bang | Se confunde visión integral de arquitectura con despliegue simultáneo | Proponer roadmap por fases con criterios de salida medibles |
| Licencias omitidas del diseño | Se evita la conversación comercial de licenciamiento | Declarar supuestos de licencia por producto desde el primer diagrama |
| Integración ERP diseñada tardíamente | Se diseña CE completo sin definir ownership de datos con F&O | Incluir la matriz CE + F&O desde la fase 0 del roadmap |

### 🧪 Criterios de Validación
- [ ] Diseñé un flujo end-to-end con producto responsable por cada paso
- [ ] Construí matrices Fit-Gap y de ownership de datos con al menos un gap por producto
- [ ] Definí roadmap por fases con criterios de salida y dependencias de licencia/tenant
- [ ] Respondí la pregunta de entrevista sobre despliegue big-bang vs. por fases
- [ ] Preparé evidencias de portafolio defendibles en entrevista y en revisión ejecutiva
- [ ] Relacioné este módulo con el Lab 90 (Capstone Enterprise D365) y los labs 81-89 que lo preceden
