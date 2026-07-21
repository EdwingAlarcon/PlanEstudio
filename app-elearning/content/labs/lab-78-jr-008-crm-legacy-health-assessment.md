---
id: lab-78
title: "JR-008 — CRM Legacy Health Assessment"
level: "N4"
duration: 180
product: ["Dynamics CRM On-Premises", "SQL Server", "IIS", "Dataverse"]
certifications: ["CRM Legacy", "Arquitectura Power Platform"]
role: ["Legacy Consultant", "Migration Specialist", "Solution Architect"]
prerequisites:
  - "Módulo 39 estudiado: casos de transformación digital"
  - "Ruta Job-Ready Data Migration + CRM Legacy revisada"
---

# Lab 78 — JR-008: CRM Legacy Health Assessment

## Objetivo

Crear un health assessment conceptual para un Dynamics CRM on-premises antes de una migración a
Dynamics 365 cloud.

## Perfil laboral y skill validado

**Vacante objetivo:** Legacy Consultant / Migration Specialist que debe diagnosticar un sistema
antiguo sin acceso administrativo completo y comunicar riesgos a dirección antes de comprometerse a
una fecha de migración.

**Skill concreto que valida:** capacidad de separar hechos observables, riesgos inferidos y
recomendaciones — y de reconocer explícitamente los límites de un diagnóstico hecho sin acceso
directo al servidor, en vez de presentar suposiciones como certezas.

## Escenario de negocio

**Empresa ficticia:** Seguros Horizonte — Dynamics CRM 2016 on-premises en producción desde 2016,
sin actualización de Rollup en los últimos 3 años, 280 usuarios activos.

Opera Dynamics CRM 2016 on-premises con customizaciones, integraciones y problemas de rendimiento.
La dirección quiere saber si debe actualizar, migrar o rediseñar.

## Rol del estudiante

Actúas como Legacy/Migration Consultant. No necesitas administrar un servidor real; debes saber
qué revisar, qué preguntar y cómo comunicar riesgos.

## Herramientas necesarias

- Plantilla Markdown/Word para assessment.
- Diagrama de arquitectura.
- Inventario simulado de servidores, bases e integraciones (ver abajo).

## Qué puedes hacer en tenant real vs. qué debes simular

Este lab es, por diseño, un ejercicio con acceso limitado — igual que en un caso real donde el
consultor llega antes de tener acceso completo al servidor. Usa el inventario simulado de abajo
como si fuera la información recolectada en una primera reunión con el equipo de TI del cliente, y
documenta explícitamente qué preguntarías después para confirmar cada supuesto.

## Datos de prueba (inventario recolectado en la reunión inicial)

| Componente | Dato reportado por TI del cliente | Lo que falta confirmar |
|---|---|---|
| SQL Server | SQL Server 2014, base de 340 GB, último backup verificado hace "unos meses" | Fecha exacta del último backup restaurado con éxito |
| IIS | 2 app pools, autenticación mixta (Windows + ADFS), certificado vence en 45 días | Si hay monitoreo de expiración de certificados |
| CRM Server | Build 8.2, async service con cola de +12.000 jobs pendientes | Causa raíz de la cola (¿workflow en loop? ¿integración fallando?) |
| Integraciones | 3 integraciones vía SSIS que leen directo la base de datos SQL | Si alguna de esas integraciones es crítica para facturación |
| Red | VPN site-to-site con latencia reportada "alta a veces" | Medición real de latencia y ventana horaria del problema |

## Entregables

- Health assessment.
- Matriz de riesgos.
- Inventario de customizaciones.
- Recomendación de migración.
- Roadmap de mitigación.

## Pasos detallados

### Paso 1 — Inventario técnico

Toma la tabla de datos de prueba de arriba y complétala con las preguntas de seguimiento que harías
en la segunda reunión con TI.

### Paso 2 — Customizaciones

Clasifica:

- Formularios y vistas.
- JavaScript legacy.
- Plugins.
- Workflows clásicos.
- Reportes SSRS.
- Integraciones directas a SQL (las 3 vía SSIS del inventario).

### Paso 3 — Riesgos

Con el dato de la cola async de +12.000 jobs pendientes y las 3 integraciones SSIS, construye:

| Riesgo | Impacto | Probabilidad | Mitigacion |
|---|---|---|---|
| Cola async con +12.000 jobs pendientes | Alto | Alta (ya está ocurriendo) | Identificar workflow o plugin causante antes de cualquier migración |
| Integracion SSIS lee SQL directo | Alto | Media | Reemplazar por API/Dataverse antes del cutover |
| Certificado IIS vence en 45 días | Alto | Alta (fecha conocida) | Renovar independientemente de la decisión de migración |
| Workflows sin dueño | Medio | Alta | Inventario y racionalizacion |

### Paso 4 — Recomendación

Con la cola async saturada y el certificado por vencer, propón una de estas rutas y justifica por
qué esos dos hallazgos la condicionan:

- Upgrade previo y luego migración.
- Migración incremental por módulo.
- Rediseño funcional sobre Dataverse.
- Mantener legacy temporal con integración controlada (mientras se resuelve la cola async).

## Decisiones que debes tomar

- **¿La cola async de 12.000 jobs bloquea cualquier plan de migración hasta resolverse, o se puede
  migrar en paralelo?** Argumenta con el riesgo de arrastrar el mismo problema al nuevo ambiente.
- **¿El certificado que vence en 45 días es responsabilidad de este assessment o un tema aparte de
  operación?** Decide si lo incluyes en el roadmap de mitigación igual, y por qué.
- **¿Recomendarías empezar por las integraciones SSIS o por la cola async?** No hay presupuesto para
  atacar ambas al mismo tiempo — argumenta el orden.

## Criterios de validación

- [ ] El assessment separa hechos, riesgos y recomendaciones.
- [ ] Incluye SQL, IIS, CRM, red e integraciones usando el inventario de datos de prueba.
- [ ] Identifica customizaciones problemáticas (las 3 integraciones SSIS, la cola async).
- [ ] Propone roadmap realista que prioriza entre los hallazgos.
- [ ] Explica qué queda por confirmar por no tener acceso real al servidor.

## Rúbrica

| Criterio | Peso |
|---|---|
| Diagnóstico | 40% |
| Riesgos | 25% |
| Roadmap | 20% |
| Comunicación ejecutiva | 15% |

## Preguntas de entrevista asociadas

- "El cliente dice que todo funciona bien pero la cola async tiene 12.000 jobs pendientes — ¿le
  crees?" — respuesta esperada: no tomar la percepción del cliente como hecho técnico; validar con
  datos (ej. antigüedad de los jobs, tasa de crecimiento de la cola).
- "¿Por qué es un riesgo que una integración lea SQL directamente en vez de usar la API de CRM?" —
  respuesta esperada: rompe el pipeline de plugins/business rules, y no funcionará contra Dataverse
  en la nube tras la migración.
- "¿Cómo comunicarías a dirección que necesitas más acceso para confirmar el diagnóstico?" —
  respuesta esperada: separar explícitamente "hallazgos confirmados" de "hipótesis pendientes de
  validar", sin sonar inseguro ni sobre-prometer certeza que no tienes.

## Qué no debe sobreprometerse

Este assessment se basa en información reportada de segunda mano, no en acceso directo al servidor;
un diagnóstico real requeriría validar cada dato con logs, métricas de SQL Server y una revisión de
código de las integraciones antes de comprometerse con fechas o presupuesto de migración.

## Errores comunes

- Recomendar migración sin inventario.
- Ignorar integraciones directas a SQL.
- No revisar workflows/plugins legacy.
- No comunicar incertidumbre por falta de acceso real.
