# Ruta Job-Ready Power Platform Admin / Governance

Esta ruta convierte el contenido actual de administración, seguridad, gobernanza y arquitectura de PlanEstudio en una preparación laboral específica para vacantes de **Power Platform Admin**, **Governance Specialist**, **CoE Lead** o **Platform Owner**.

No garantiza empleo. Tampoco convierte automáticamente los labs en experiencia laboral formal. Su valor está en ayudarte a practicar criterios de administración, reunir evidencia operativa y explicar decisiones de gobierno con el lenguaje que usan equipos de plataforma, seguridad y arquitectura.

## Vacantes objetivo

Esta ruta apunta a roles como:

- Power Platform Administrator.
- Power Platform Governance Specialist.
- Power Platform CoE Lead / CoE Analyst.
- Microsoft Business Applications Platform Owner.
- Power Platform Solution Architect con responsabilidad de gobierno.
- Administrador de ambientes Power Apps / Power Automate / Dataverse.

## Resultado esperado

Al completar la secuencia recomendada, deberías poder explicar y demostrar:

- Cómo evaluar un tenant o conjunto de ambientes desde Power Platform admin center.
- Cómo diseñar una estrategia de ambientes DEV/TEST/PROD, sandbox, personal productivity y producción.
- Cómo aplicar DLP policies, security roles y principio de mínimo privilegio.
- Cómo razonar sobre licensing, capacity, Managed Environments y recomendaciones operativas.
- Cómo usar auditoría, logs y Microsoft Purview como parte de una investigación.
- Cómo presentar un modelo de CoE moderno basado en personas, procesos, políticas y mejora continua.

## Enfoque moderno de gobierno

El gobierno moderno de Power Platform no debe depender únicamente de instalar el CoE Starter Kit. Microsoft ha movido capacidades clave de inventario, uso, monitoreo y acciones hacia experiencias nativas del Power Platform admin center. El CoE Starter Kit puede servir como referencia o acelerador histórico, pero la ruta laboral debe priorizar:

- **PPAC como superficie principal:** ambientes, recursos, inventario, analytics, monitor, capacity, licensing y acciones.
- **Managed Environments:** controles premium para administrar a escala con más visibilidad y restricciones.
- **DLP y seguridad:** políticas por ambiente, separación de conectores, roles y mínimo privilegio.
- **Auditoría y Purview:** trazabilidad para investigar actividad, cambios y riesgos.
- **CoE operativo:** gobierno como capacidad organizacional, no como instalación de una solución.

## Skills laborales y estado actual

| Skill laboral | Estado actual | Contenido actual | Evidencia posible hoy | Brecha |
|---|---|---|---|---|
| Power Platform admin center | Cubierto | Módulos 1, 31, 32; LAB-076 | Inventario, DLP, capacidad y decisiones de gobierno documentadas en JR-006 | Profundizar investigación de incidentes con audit logs/Purview |
| Environment strategy | Cubierto | Módulos 31, 33; LAB-056 | Diagrama DEV/TEST/PROD y política de promoción | Agregar criterios por tipo de workload |
| Environment types y lifecycle | Parcial | Módulos 31, 33 | Matriz de ambientes | Falta runbook de creación/cierre |
| DLP policies | Cubierto | Módulos 31, 33, 36; LAB-032 | Política DLP y prueba de bloqueo | Conectar a excepciones y revisión periódica |
| Security roles | Cubierto | Módulos 9, 16, 36; LAB-009 | Matriz rol-entidad-privilegio | Profundizar troubleshooting de acceso |
| Managed Environments | Parcial | Módulo 33, LAB-056 parcial | Decisión de habilitación | Falta práctica de controles y licenciamiento |
| Licensing | Parcial | Módulos 31, 40 | Análisis por escenario | Falta ejercicio operativo con recomendaciones |
| Capacity planning | Awareness | Módulos 31, 35 | Estimación de capacidad y riesgos | Falta monitoreo y plan de remediación |
| Dataverse auditing | Parcial | Módulo 36 | Diseño de auditoría | Falta consulta/investigación guiada |
| Purview / activity logs | Awareness | Módulo 36 | Awareness de auditoría centralizada | Falta simulación de investigación |
| Inventory / usage / monitor / actions | Parcial | Módulo 32 | Reporte conceptual de CoE | Reorientar hacia PPAC nativo |
| CoE operativo | Parcial | Módulos 31, 32 | Modelo de gobierno y CoE | Falta operating model completo |
| Soporte operativo | Parcial | Módulos 26, 31, 32 | Runbook básico | Falta incidente app/flow en producción |
| Reporte ejecutivo de riesgos | Parcial | Módulos 31, 38, 40 | Recomendaciones y roadmap | Falta formato de assessment laboral |

## Secuencia recomendada de estudio

1. **Gobierno enterprise:** Módulo 31 para conceptos de landing zone, DLP, ownership, riesgos y modelo de gobierno.
2. **CoE y administración a escala:** Módulo 32 y LAB-032, leyéndolos con enfoque moderno: CoE como práctica operativa y PPAC como fuente principal.
3. **Estrategia de ambientes:** Módulo 33 y LAB-056 para DEV/TEST/PROD, Managed Environments, multi-tenant y restricciones.
4. **Seguridad y cumplimiento:** Módulo 36 para Zero Trust, auditoría, Purview, DLP y defensa en profundidad.
5. **Decisión arquitectónica:** Módulo 40 para preguntas tipo PL-600 sobre licenciamiento, riesgo, migración y gobierno.
6. **Portafolio:** convertir LAB-032/LAB-056 en un governance assessment demostrable.

## Mapeo a contenido actual

| Contenido | Uso dentro de esta ruta | Qué debes extraer como evidencia |
|---|---|---|
| Módulo 31 - Enterprise Architecture y Gobernanza | Marco de gobierno | Modelo de gobierno, riesgos, DLP y ownership |
| Módulo 32 - CoE Starter Kit y Administración a Escala | CoE y visibilidad | Inventario, operación de CoE y transición hacia PPAC nativo |
| Módulo 33 - Multi-tenant, Multi-geo y Estrategia de Ambientes | Estrategia de ambientes | Matriz de ambientes, Managed Environments, restricciones por región |
| Módulo 36 - Seguridad y Cumplimiento Enterprise | Seguridad y auditoría | Diseño de auditoría, DLP, Purview y controles de datos |
| Módulo 40 - Preparación PL-600 | Decisión de arquitectura | Respuestas de escenario sobre gobierno, licencias y riesgo |
| LAB-032 | Gobernanza a escala | Reporte CoE/gobierno y recomendaciones |
| LAB-056 | Cambio de ambientes DEV/TEST/PROD | Evidencia de promoción controlada y estrategia de ambientes |

## Evidencia de portafolio

Un portafolio Admin/Governance debería incluir al menos:

- Governance assessment de 3-5 páginas para un tenant ficticio o de práctica.
- Matriz de ambientes: propósito, tipo, owners, DLP, datos, usuarios y ciclo de vida.
- Política DLP documentada con conectores Business, Non-business y Blocked.
- Matriz de roles de seguridad y justificación de mínimo privilegio.
- Análisis de Managed Environments: cuándo habilitar, impacto, licenciamiento y controles esperados.
- Análisis de capacity/licensing con riesgos y recomendaciones.
- Runbook operativo: qué revisar ante app crítica caída, flujo fallando o capacity alert.
- Diseño de auditoría: qué eventos investigar, dónde mirar y cuándo escalar a seguridad/Purview.
- Resumen ejecutivo de riesgos con prioridades Alta/Media/Baja.

## Preguntas de entrevista

### PPAC y ambientes

- ¿Qué revisarías primero en Power Platform admin center ante un tenant desordenado?
- ¿Cómo decides cuántos ambientes necesita una organización?
- ¿Qué debería ir en Default environment y qué no?
- ¿Cómo separarías DEV, TEST y PROD para una solución crítica?
- ¿Qué controles aplicarías antes de permitir despliegues a producción?

### DLP, seguridad y acceso

- ¿Cómo diseñarías una DLP policy para bloquear conectores personales en producción?
- ¿Cómo manejarías una excepción temporal a una política DLP?
- ¿Cómo diagnosticarías que un usuario ve registros que no debería?
- ¿Cómo aplicarías mínimo privilegio en Dataverse?
- ¿Qué diferencia hay entre security roles, business units y field security?

### Licensing, capacity y Managed Environments

- ¿Cómo explicarías standard vs premium licensing a un stakeholder no técnico?
- ¿Qué revisarías si Dataverse está cerca del límite de storage?
- ¿Cuándo justificarías Managed Environments?
- ¿Qué riesgos trae habilitar Managed Environments sin revisar licencias?
- ¿Cómo presentarías una recomendación de reducción de costos sin romper cumplimiento?

### Auditoría, Purview y soporte operativo

- ¿Cómo investigarías quién modificó o exportó datos sensibles?
- ¿Qué diferencia hay entre auditoría Dataverse y actividad centralizada en Purview?
- ¿Qué debe contener un runbook de incidente para Power Platform?
- ¿Qué harías si un flujo crítico falla cada hora?
- ¿Cómo comunicarías un incidente de plataforma a negocio y seguridad?

### CoE moderno

- ¿Qué diferencia hay entre instalar CoE Starter Kit y operar un CoE?
- ¿Qué roles mínimos necesita un CoE efectivo?
- ¿Cómo equilibras innovación ciudadana y control central?
- ¿Qué métricas usarías para medir salud de la plataforma?
- ¿Cómo harías onboarding y offboarding de makers?

## Lab Job-Ready disponible

| Lab disponible | Vacante que valida | Skills que valida | Evidencia esperada | Dificultad | Duración | Relación con portafolio |
|---|---|---|---|---|---|---|
| LAB-076 (JR-006) - PPAC Governance Assessment | Power Platform Admin / Governance Specialist | PPAC, DLP, ambientes, capacidad, licensing, operación | Informe de tenant, matriz de ambientes, DLP, runbook y riesgos | Avanzada | 4 h | Demuestra gobierno operativo y criterio de plataforma |

## Brechas críticas

1. Falta práctica dedicada con audit logs/Purview en una simulación de investigación de incidente de seguridad (JR-006 cubre inventario, DLP, capacidad/licencias y operación, no investigación forense).
2. Falta profundizar Managed Environments como ejercicio propio con impacto de licenciamiento.
3. CoE Starter Kit existe en contenido, pero la ruta debe seguir reforzando PPAC nativo y CoE operativo moderno sobre la instalación del kit.
4. Falta un runbook de soporte operativo detallado para apps/flujos en producción más allá del que produce JR-006.

## Checklist antes de aplicar

- [ ] Puedo explicar qué revisar en PPAC durante los primeros 30 minutos de un assessment.
- [ ] Tengo una matriz de ambientes DEV/TEST/PROD con owners, DLP y propósito.
- [ ] Puedo diseñar una DLP policy y defender sus excepciones.
- [ ] Puedo explicar cuándo usar Managed Environments y qué impacto tiene en licenciamiento.
- [ ] Puedo estimar riesgos de capacity y proponer remediación.
- [ ] Puedo explicar cómo investigaría actividad sospechosa usando auditoría/Purview.
- [ ] Tengo un runbook operativo para incidentes de apps/flujos.
- [ ] Puedo explicar CoE como operación continua, no solo como instalación de un kit.
- [ ] Puedo presentar riesgos y recomendaciones a un stakeholder no técnico.

## Relación con recursos existentes

- Usa la [Matriz de Skills Laborales](MATRIZ_SKILLS_LABORALES.md) para ver cómo esta ruta encaja con otras vacantes.
- Usa la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) para criterios de evidencia demostrable.
- Usa [Cómo Convertir tus Labs en Portafolio Profesional](PORTAFOLIO_PROFESIONAL.md) para empaquetar assessment, runbooks, capturas y decisiones.

