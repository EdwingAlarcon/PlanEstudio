---
moduleId: 41
title: "Proyecto Capstone — Arquitectura Enterprise"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 13
slug: "proyecto-capstone-arquitectura-enterprise"
---
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

### 👨‍💻 Actividades Prácticas Paso a Paso

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

*[← Nivel 3 Avanzado](/nivel/avanzado) | [Inicio →](/)*
