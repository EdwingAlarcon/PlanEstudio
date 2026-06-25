---
moduleId: 40
title: "Preparación PL-600"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 11
slug: "preparacion-pl-600"
---
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

### 👨‍💻 Actividades Prácticas Paso a Paso

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

#### Actividad 40.1: Banco de preguntas por dominio
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

#### Actividad 40.2: Recursos de preparación
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
