# Marco de Prácticas Profesionales

Este marco agrega una capa de **Experiencia práctica** a PlanEstudio. No reemplaza módulos, labs, quizzes ni checklist; los complementa con ejercicios transversales orientados a desempeño laboral simulado.

Completar estas prácticas no equivale a experiencia laboral formal ni garantiza empleo. El objetivo es entrenar autonomía, diagnóstico, evidencia, comunicación y defensa técnica.

## Propósito

El resultado buscado no es solo "completé módulos y laboratorios", sino:

> Puedo analizar, configurar, desarrollar, desplegar, probar, diagnosticar, documentar y defender una solución de Power Platform o Dynamics 365.

## Taxonomía

| Tipo | Propósito | Nivel de ayuda |
|---|---|---|
| Guided Lab | Aprender una capacidad nueva | Instrucciones amplias y verificaciones intermedias |
| Semi-Guided Lab | Aplicar con apoyo limitado | Requerimientos, restricciones y orientaciones |
| Challenge Lab | Resolver autónomamente | Problema, criterios, entregables y rúbrica |
| Incident Lab | Diagnosticar y corregir | Síntoma, impacto, evidencia, hipótesis, RCA |
| Work Simulation | Simular una secuencia profesional | Eventos, cambios, UAT, despliegue, soporte |

## Dificultad

| Nivel | Criterio |
|---|---|
| Foundation | Problema acotado, pocas variables, herramientas básicas |
| Practitioner | Varias decisiones, integración entre capacidades, validación funcional |
| Advanced | Ambigüedad, hipótesis, restricciones de ALM/arquitectura, análisis de riesgos |
| Expert | Múltiples dominios, información incompleta, cambios durante ejecución e impacto operativo |

Un ejercicio no es Expert por ser largo; debe exigir trade-offs reales.

## Método profesional de resolución de incidentes

1. Comprender el síntoma.
2. Determinar impacto y severidad.
3. Reproducir.
4. Delimitar alcance.
5. Capturar evidencia.
6. Revisar cambios recientes.
7. Formular hipótesis.
8. Priorizar hipótesis.
9. Probar sin introducir riesgo innecesario.
10. Identificar causa raíz.
11. Aplicar corrección mínima segura.
12. Validar funcional y técnicamente.
13. Verificar regresiones.
14. Documentar.
15. Comunicar cierre.
16. Definir prevención o monitoreo.

## Evidencias profesionales

Las prácticas pueden solicitar capturas, export de solución, Solution Checker, código, commits, pull request, diagrama, modelo de datos, matriz de seguridad, historias de usuario, criterios de aceptación, backlog, plan y resultados de prueba, UAT, RCA, ADR, runbook, plan de despliegue, rollback, informe de reconciliación, log de ejecución, demo, presentación o retrospectiva.

Cada práctica debe declarar evidencia obligatoria, opcional, formato, criterios de calidad e información sensible que no debe incluirse.

Evitar depender solo de capturas: muestran estado visual, pero no siempre comprensión.

## Estados de dominio conceptual

El progreso actual se conserva. Para una evolución futura, las prácticas preparan un modelo más fino:

- Estudiado.
- Comprendido.
- Ejecutado con guía.
- Ejecutado sin guía.
- Diagnosticado.
- Explicado.
- Aplicado en proyecto.
- Validado.

Este sprint no migra el store de progreso para evitar riesgo. La metadata deja lista una evolución compatible.

## Rúbricas reutilizables

### Incident Labs

| Criterio | Peso |
|---|---:|
| Reproducción y delimitación | 10% |
| Diagnóstico estructurado | 15% |
| Uso de evidencia | 15% |
| Calidad de hipótesis | 10% |
| Identificación de causa raíz | 15% |
| Corrección técnica | 15% |
| Validación y regresión | 10% |
| Documentación y comunicación | 10% |

### Challenge Labs

| Criterio | Peso |
|---|---:|
| Cumplimiento funcional | 20% |
| Diseño y mantenibilidad | 15% |
| Seguridad | 10% |
| Calidad técnica | 15% |
| ALM y configuración | 10% |
| Testing | 10% |
| Evidencia | 10% |
| Justificación | 10% |

### Work Simulations

| Criterio | Peso |
|---|---:|
| Descubrimiento y análisis | 15% |
| Priorización | 10% |
| Diseño | 15% |
| Ejecución | 15% |
| Gestión de cambios | 10% |
| Calidad y pruebas | 10% |
| Comunicación | 10% |
| Operabilidad y soporte | 10% |
| Retrospectiva | 5% |

Puntaje mínimo recomendado: 70%. Fallos críticos: permisos excesivos, cambios directos en producción sin rollback, ausencia de validación, exposición de secretos, o resolver desactivando seguridad.

## Guía para crear Incident Labs

Un Incident Lab debe incluir ID, severidad, dominio, rol afectado, entorno, síntoma, impacto, evidencia inicial, cambios recientes, datos/configuración parcial, pistas relevantes, pistas falsas, restricciones, criterios de resolución, evidencias y rúbrica.

La solución debe entrenar reproducción, delimitación, evidencia, hipótesis, descarte, causa raíz, corrección mínima, validación, prevención y comunicación. Las trazas simuladas deben estar marcadas como simuladas.

## Guía para crear Challenge Labs

Un Challenge Lab debe evitar el paso a paso en la vista principal. Debe presentar contexto, problema, requerimientos, restricciones, criterios de aceptación, entregables, rúbrica y límites de ayuda.

Debe permitir rutas alternativas justificadas y penalizar soluciones funcionales pero inseguras.

## Guía para Work Simulations

Una Work Simulation debe desarrollarse como secuencia con eventos y cambios. Debe incluir descubrimiento, diseño, construcción, cambio de alcance, UAT, defectos, despliegue, incidente postdeploy y retrospectiva.

La evaluación debe observar decisiones, comunicación y operabilidad, no solo el resultado final.

## Relación con módulos y labs

Cada práctica declara módulos y labs relacionados. Esto evita duplicar teoría y permite que el estudiante regrese al contenido académico cuando detecta una brecha.

## Límites pedagógicos

- No afirmar experiencia laboral formal.
- No prometer seniority.
- No copiar teoría de Microsoft Learn.
- No usar secretos reales.
- No recomendar cambios directos en producción.
- No usar System Administrator como solución.
- No ocultar que las soluciones estáticas son técnicamente accesibles.

## Roadmap de expansión

Preparado, no implementado todavía:

- Biblioteca de 30-40 incidentes prioritarios.
- Proyectos por especialización.
- Primer mes de trabajo.
- Simulación de operaciones.
- Assessment experto.
- Revisión externa por profesionales.
