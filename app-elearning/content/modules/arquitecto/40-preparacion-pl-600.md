---
moduleId: 40
title: "Arquitectura Power Platform — Casos de Estudio"
level: "arquitecto"
certification: "Arquitectura Power Platform"
estimatedMinutes: 11
slug: "preparacion-pl-600"
---
### 🎯 Objetivo
Desarrollar la mentalidad de Solution Architect en Power Platform mediante casos de estudio de arquitectura, análisis de requerimientos, trade-offs, gobernanza, seguridad, integración y comunicación ejecutiva. El examen PL-600 fue retirado por Microsoft el 30 de junio de 2026; este módulo conserva las competencias profesionales que siguen siendo válidas aunque la credencial ya no esté disponible.

### 📖 Conceptos Clave de Arquitectura Power Platform

**Dominio 1: Realizar análisis de solución (35-40%)**

- **Análisis de requerimientos y soluciones existentes:** el arquitecto revisa soluciones implementadas e identifica debilidades arquitectónicas. La respuesta profesional siempre considera escalabilidad, mantenibilidad y alineación con el Well-Architected Framework. Nunca se refactoriza solo por preferencia técnica; siempre debe haber una razón de negocio documentada.
- **Evaluación de plataforma vs customización:** el principio rector es "configurar primero, customizar si es necesario, integrar si no hay otra opción, construir desde cero como último recurso". Los escenarios profesionales premian usar capacidades nativas (BPF, Calculated Columns, Business Rules) antes de crear un plugin C# innecesario.
- **Análisis de riesgo y viabilidad:** el arquitecto identifica riesgos de una propuesta y cuantifica su impacto. Preguntas típicas: ¿qué pasa si el sistema externo no tiene API? ¿qué pasa si el cliente no puede proveer usuarios para UAT? ¿qué pasa si el volumen de datos es 10x el estimado?
- **Estrategia de migración de datos:** área donde muchos equipos fallan porque la subestiman. Se debe decidir cuándo usar Data Import Wizard, Azure Data Factory, Power Query u otras herramientas; cómo manejar relaciones; cómo validar integridad; y cuántas iteraciones de migración se necesitan.

**Dominio 2: Diseñar una solución (40-45%)**

- **Arquitectura de aplicaciones:** decidir cuándo usar Canvas, Model-Driven, Power Pages o Copilot Studio, y cómo organizarlas en soluciones. Regla de oro: una solución por capa funcional (Foundation, CRM, Integrations, etc.), no una mega-solución.
- **Estrategia de datos y seguridad:** incluye modelo de datos, Business Units, Security Roles, Field Security, Row-Level Security en Power BI y cifrado para datos sensibles. El estudiante debe justificar por qué Dataverse es superior a SharePoint Lists para datos relacionales y transaccionales.
- **Integración con otros sistemas:** decidir cuándo usar Power Automate, Azure Logic Apps, Azure Functions y Azure Service Bus, considerando latencia, SLA, costo, throttling y complejidad operativa.
- **Estrategia de ALM:** usar managed solutions en TEST y PROD, Connection References y Environment Variables, y Solution Checker con 0 errores críticos antes de aprobar despliegues.
- **Estrategia de inteligencia artificial:** cuándo usar AI Builder nativo (sin código, integrado en Power Platform, modelos pre-construidos disponibles), Azure AI Services directamente (necesidades más específicas o control granular), o Azure OpenAI (respuestas generativas, clasificación de texto). El arquitecto debe también considerar el impacto en costos (AI Builder credits) y la privacidad de datos en cada opción.

**Dominio 3: Implementar la solución (15-20%)**

- **Guiar al equipo de desarrollo:** el arquitecto no es el que hace todo el código — es el que toma decisiones técnicas, resuelve bloqueos y asegura que el equipo implementa la solución como fue diseñada. La competencia profesional incluye explicar ADRs, facilitar code reviews y balancear velocidad con calidad técnica.
- **Validar que la implementación sigue la arquitectura:** incluye: revisión de código (Solution Checker + revisión manual de plugins y flujos), revisión de seguridad (¿los Security Roles tienen mínimo privilegio?), y revisión de performance (¿las consultas usan filtros delegables? ¿los plugins son async cuando es posible?). El arquitecto firma que la implementación es conforme a la arquitectura antes de aprobar el despliegue a PROD.
- **Gestión de calidad:** métricas de calidad para Power Platform: Solution Checker score (0 errores críticos), cobertura de unit tests para plugins C# (mínimo 80%), time-to-load de Canvas Apps (< 3 segundos en el happy path), y tasa de flujos fallidos (< 0.5% en 7 días). El examen puede preguntar qué herramienta usar para monitorear la salud del sistema post go-live.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Caso de estudio 1 — Decisión típica de arquitectura
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
Practicar con las siguientes áreas donde los escenarios enterprise tienden a ser más difíciles:

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
## Plan de estudio de arquitectura (8 semanas)

Semana 1-2: Revisar fundamentos de arquitectura
  - Leer Power Platform Well-Architected y guías de ALM, seguridad e integración
  - Identificar los dominios con menor puntaje en el self-assessment interno

Semana 3-4: Escenarios guiados
  - Resolver casos internos del banco de preguntas y del Módulo 41
  - Si el score < 70%: repasar el dominio con menor puntaje

Semana 5-6: Casos de estudio
  - Leer 3 casos de estudio del blog de Microsoft Power Platform
  - Para cada uno: diseñar la arquitectura antes de ver la solución

Semana 7: Repaso intensivo
  - Revisar todos los ADRs y decisiones arquitectónicas del Nivel 3 y 4
  - Repasar: cuándo usar cada componente de Power Platform

Semana 8: Simulacro profesional
  - Día 1-5: simulacro de arquitectura completo con 3 casos de negocio
  - Día 6-7: revisión de decisiones, riesgos y ADRs

## Recursos gratuitos
- Microsoft Learn: Power Platform Solution Architect learning path
- Microsoft Learn: Power Platform Well-Architected, ALM, seguridad e integración
- YouTube: John Savill's Technical Training (arquitectura de referencia)
```

### 💼 Caso Real de Negocio
**Candidato:** Desarrollador senior de Power Platform con 4 años de experiencia, excelentes habilidades técnicas pero sin experiencia en decisiones arquitectónicas de alto nivel.  
**Problema al crecer hacia Solution Architect:** Aprobó certificaciones técnicas con altas notas memorizando preguntas de práctica, pero al enfrentar escenarios enterprise le costaba razonar sobre negocio, restricciones, riesgos y trade-offs.  
**Approach de preparación correcto:** En el tercer intento, cambió de estrategia: en lugar de practicar preguntas de opción múltiple, analizó 5 casos de estudio reales de Microsoft (Customer Stories), diseñó la arquitectura él mismo antes de ver la solución, y documentó las diferencias entre su propuesta y la solución real. Adicionalmente completó el proyecto capstone (análogo al Módulo 41) que lo forzó a tomar y justificar 10+ decisiones arquitectónicas con ADRs.  
**Resultado:** Mejoró su capacidad para defender decisiones frente a stakeholders técnicos y ejecutivos. La diferencia fue aprender a pensar como arquitecto, no como alguien que recuerda respuestas.

### ✅ Buenas Prácticas
- La arquitectura profesional evalúa pensamiento sistémico, no memorización — practicar con casos reales
- En cada escenario: preguntar "¿qué haría un arquitecto senior en esta situación?" no "¿cuál opción es técnicamente correcta?"
- Completar el proyecto capstone (Módulo 41) antes de declararse listo para un rol de arquitectura — la experiencia práctica es irremplazable

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Estudiar memorizando respuestas de dumps de examen | Intentar atajo que no desarrolla el pensamiento arquitectónico | Los escenarios reales son únicos y detallados; la preparación efectiva es resolver casos reales y justificar decisiones arquitectónicas |
| No repasar el Dominio 1 (35-40%) por considerarlo "blando" | El análisis de solución parece menos técnico que el diseño | Este dominio tiene el mayor peso; practicar explícitamente la lectura crítica de soluciones existentes y la identificación de anti-patrones |
| Elegir la opción más técnicamente sofisticada en preguntas del examen | El developer instinto es resolver con código lo que Power Platform puede resolver con configuración | Aplicar siempre el principio "configurar primero": si hay una capacidad nativa, esa es la respuesta correcta aunque no sea la más impresionante técnicamente |
| Fallar por no saber cuándo usar Logic Apps vs Power Automate | Es una de las preguntas más frecuentes del examen y muchos candidatos no tienen claridad | Regla mnemónica: Power Automate para makers + latencia tolerada + costos bajos; Logic Apps para IT + SLA estricto + EDI/B2B + estado persistido |

### 🧪 Criterios de Validación
- [ ] Self-assessment de análisis, diseño e implementación con puntaje por dominio
- [ ] 3 casos de estudio resueltos con justificación de decisiones arquitectónicas
- [ ] Simulacro profesional: score ≥ 70% antes de presentar el portafolio
- [ ] Portafolio de casos de arquitectura revisado por un mentor o par senior

---
