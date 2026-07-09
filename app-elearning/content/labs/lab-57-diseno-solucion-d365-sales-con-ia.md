---
id: lab-57
title: "Diseñar una Solución Completa de Dynamics 365 Sales con IA"
level: "N5"
duration: 100
product: ["Dynamics 365 Sales", "GitHub Copilot", "Claude Code"]
certifications: ["Buenas Prácticas"]
role: ["Functional Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 55 estudiado: IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365"
  - "Conocimiento básico de las entidades estándar de Dynamics 365 Sales (cuentas, contactos, oportunidades)"
files: []
---

# Lab 57 — Diseñar una Solución Completa de Dynamics 365 Sales con IA

## Objetivo

Al finalizar este laboratorio habrás diseñado, con apoyo de IA y de punta a punta, una solución funcional completa de Dynamics 365 Sales para un proceso de negocio real — desde el requerimiento inicial hasta un diseño técnico-funcional documentado — aplicando en cada paso la evaluación de alternativas estándar antes de proponer personalización, como se enseñó en el Módulo 55.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Functional Consultant, Solution Architect.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** Un cliente de SIT (una distribuidora regional) quiere adoptar Dynamics 365 Sales para gestionar su proceso comercial completo: desde el primer contacto con un prospecto hasta el cierre de una venta, incluyendo seguimiento de visitas comerciales y aprobación de descuentos especiales.

**Por qué es el cierre natural del nivel IA:** integra consultoría funcional (Módulo 55), diseño de seguridad (Módulo 53/55) y el criterio de evitar sobrepersonalización en un solo diseño de solución completo, de punta a punta.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Levantar el proceso de negocio y convertirlo en requerimientos | 15 min |
| Ejercicio 2 — Mapear el proceso contra entidades estándar de D365 Sales con IA | 25 min |
| Ejercicio 3 — Diseñar las brechas (gaps) que sí requieren personalización | 20 min |
| Ejercicio 4 — Diseñar la matriz de seguridad para los roles del proceso | 20 min |
| Ejercicio 5 — Documentar el diseño funcional-técnico completo | 20 min |
| **Total** | **100 min** |

## Tecnologías utilizadas

- Dynamics 365 Sales (conceptual — no requiere un tenant real para completar el laboratorio)
- GitHub Copilot o Claude Code

## Ejercicio 1 — Levantar el proceso de negocio

Documenta el proceso comercial de la distribuidora en 5-6 pasos (ej.: prospección → calificación → visita comercial → propuesta con posible descuento → aprobación de descuento si supera un umbral → cierre). Identifica los roles involucrados (Vendedor, Gerente de Ventas) y el criterio de éxito de cada etapa.

## Ejercicio 2 — Mapear contra entidades estándar

Para cada paso del proceso, pide a un asistente de IA (dándole el contexto completo del proceso, sin datos reales de ningún cliente) que identifique qué entidad estándar de Dynamics 365 Sales lo cubre: `Lead`, `Opportunity`, `Account`, `Contact`, `Quote`, actividades/citas para las visitas comerciales. Pide explícitamente que evalúe la alternativa estándar ANTES de sugerir cualquier tabla personalizada (Módulo 55).

## Ejercicio 3 — Diseñar las brechas (gaps)

Identifica qué parte del proceso, si alguna, NO está cubierta por entidades estándar (ej. el umbral de aprobación de descuento con una regla de negocio específica del cliente) y diseña la personalización mínima necesaria — un campo calculado, una regla de flujo de aprobación — evitando construir una tabla completa nueva si un campo o una regla de negocio sobre una entidad estándar ya resuelve el caso.

## Ejercicio 4 — Matriz de seguridad

Usando el prompt de matriz de seguridad del recurso de Prompts Reutilizables IA (`/recursos/prompts-ia`), genera una matriz para los roles Vendedor y Gerente de Ventas sobre las entidades identificadas en el Ejercicio 2, verificando que el Vendedor no tenga permisos de aprobación que le correspondan solo al Gerente.

## Ejercicio 5 — Documentar el diseño completo

Redacta un documento de diseño funcional-técnico de una página cubriendo: proceso de negocio, mapeo a entidades estándar, brechas identificadas y su solución mínima, y la matriz de seguridad — listo para presentar a un cliente real.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Diseñar una tabla personalizada para el seguimiento de visitas sin evaluar las actividades/citas estándar | No pedir explícitamente la evaluación de alternativas estándar | Pedir siempre a la IA que evalúe la alternativa estándar antes de proponer algo nuevo (Módulo 55) |
| Resolver el umbral de aprobación de descuento con una tabla nueva completa | Sobre-dimensionar la solución para una regla de negocio simple | Preferir un campo calculado o una regla de flujo sobre la entidad estándar existente |
| Otorgar al rol Vendedor los mismos permisos que al Gerente de Ventas "por simplicidad" | No aplicar el principio de mínimo privilegio al diseñar la matriz de seguridad | Diferenciar explícitamente los permisos de aprobación del Gerente frente al Vendedor |
| Entregar el diseño sin haber verificado ninguna propuesta de la IA contra el conocimiento funcional real de D365 Sales | Confiar el diseño completo a la IA sin revisión de un consultor funcional | Revisar cada mapeo entidad-proceso con criterio funcional antes de documentarlo como definitivo |

## Criterios de Validación

- [ ] Documenté el proceso de negocio completo con roles y criterios de éxito por etapa
- [ ] Mapeé cada paso del proceso contra una entidad estándar de D365 Sales, evaluando alternativas antes de personalizar
- [ ] Diseñé la personalización mínima necesaria solo para las brechas reales identificadas
- [ ] Generé y revisé una matriz de seguridad que respeta el mínimo privilegio entre Vendedor y Gerente
- [ ] Redacté el documento de diseño funcional-técnico completo de una página

## Preguntas de Reflexión

1. ¿Qué parte del proceso fue más tentador resolver con una tabla personalizada, y por qué la alternativa estándar terminó siendo mejor (o peor)?
2. ¿Cómo cambiaría tu diseño si el cliente tuviera 3 líneas de negocio con procesos de aprobación distintos?
3. ¿Qué preguntas le harías a un consultor funcional senior antes de dar este diseño por definitivo?

## Módulos Relacionados

- Módulo 55 — IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365
- Módulo 53 — Dataverse Web API, Dynamics 365 y Autenticación

## Competencias Desarrolladas

- Diseño funcional completo de un proceso de negocio sobre Dynamics 365 Sales
- Evaluación sistemática de alternativas estándar antes de personalizar
- Diseño de matrices de seguridad alineadas al principio de mínimo privilegio
