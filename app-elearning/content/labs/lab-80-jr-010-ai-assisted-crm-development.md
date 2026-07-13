---
id: lab-80
title: "JR-010 — AI-Assisted CRM Development"
level: "N5"
duration: 180
product: ["Dynamics 365", "Dataverse", "AI-Assisted Development"]
certifications: ["PL-400", "IA aplicada"]
role: ["CRM Developer", "Power Platform Developer"]
prerequisites:
  - "Módulos 42-55 revisados: desarrollo asistido por IA"
  - "Módulo 13 o 23 revisado: JavaScript CRM o plugins"
  - "Ruta Job-Ready CRM Developer revisada"
---

# Lab 80 — JR-010: AI-Assisted CRM Development

## Objetivo

Usar IA para asistir una personalización CRM sin delegar criterio: prompt, generación, revisión,
seguridad, pruebas, diff y explicación técnica.

## Escenario de negocio

**Empresa ficticia:** Proyectos Delta.

Necesitas mejorar una personalización CRM existente. Puedes usar IA para acelerar, pero el
equipo exige evidencia de revision humana, seguridad y pruebas.

## Rol del estudiante

Actúas como CRM Developer moderno que usa IA como asistente, no como reemplazo de criterio.

## Herramientas necesarias

- Codex, GitHub Copilot, Copilot Chat u otra IA de desarrollo.
- Repositorio Git.
- Archivo JavaScript o C# de práctica.
- Checklist de revisión.

## Entregables

- Prompt inicial.
- Código antes/después o diseño antes/después.
- Diff revisado.
- Checklist de seguridad.
- Casos de prueba.
- Reflexión: que aceptaste, que rechazaste y por qué.

## Pasos detallados

### Paso 1 — Seleccionar mejora

Elige una:

- Refactor de JavaScript CRM para usar `formContext`.
- Plugin C# con tracing y control de recursion.
- Manejo de errores en flujo/integracion.
- README tecnico de una solucion CRM.

### Paso 2 — Prompt

Escribe un prompt con:

- Contexto del negocio.
- Tecnologia.
- Restricciones.
- Codigo o descripcion actual.
- Criterios de aceptacion.
- Riesgos que la IA debe evitar.

Ejemplo:

```text
Actua como CRM Developer senior. Revisa este JavaScript de formulario Dynamics 365.
Objetivo: reemplazar patrones inseguros, usar formContext, manejar nulos y proponer casos de
prueba. No inventes nombres de campos. Si falta informacion, marca supuestos.
```

### Paso 3 — Revisión humana

Marca:

| Revision | Pregunta |
|---|---|
| Seguridad | ¿Expone secretos o datos sensibles? |
| API correcta | ¿Usa patrones soportados? |
| Mantenibilidad | ¿Tiene namespace, nombres claros y comentarios utiles? |
| Pruebas | ¿Incluye casos positivos, negativos y nulos? |
| Supuestos | ¿La IA invento campos, tablas o permisos? |

### Paso 4 — Diff

Documenta:

- Cambios aceptados.
- Cambios rechazados.
- Riesgos encontrados.
- Pruebas ejecutadas.

### Paso 5 — Entrevista

Prepara respuesta:

"¿Como usas IA para desarrollar sin introducir riesgos?"

Respuesta esperada:

- Doy contexto y restricciones.
- Reviso supuestos.
- Verifico APIs oficiales.
- Pruebo cambios.
- No acepto codigo que no entiendo.
- Documento decisiones.

## Criterios de validacion

- [ ] El prompt tiene contexto y restricciones.
- [ ] La IA no inventa entidades sin ser detectada.
- [ ] Hay revisión humana documentada.
- [ ] Hay pruebas.
- [ ] Puedes explicar el resultado sin leer el prompt.

## Rubrica

| Criterio | Peso |
|---|---|
| Prompt | 30% |
| Revision humana | 30% |
| Seguridad | 25% |
| Resultado | 15% |

## Errores comunes

- Copiar codigo generado sin entenderlo.
- No revisar nombres de tablas/campos.
- No probar escenarios negativos.
- Compartir datos sensibles con la IA.
