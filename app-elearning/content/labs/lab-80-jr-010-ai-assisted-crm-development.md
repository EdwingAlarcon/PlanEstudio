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

## Perfil laboral y skill validado

**Vacante objetivo:** CRM Developer que usa herramientas de IA en su flujo diario, en un contexto
donde el equipo exige evidencia de revisión humana antes de aceptar código generado.

**Skill concreto que valida:** capacidad de dar contexto y restricciones precisas a una IA, detectar
cuándo inventó nombres de campos o tablas que no existen, y rechazar o corregir código que no
puedes explicar — no la habilidad de escribir prompts en abstracto.

## Escenario de negocio

**Empresa ficticia:** Proyectos Delta.

Necesitas mejorar una personalización CRM existente. Puedes usar IA para acelerar, pero el
equipo exige evidencia de revision humana, seguridad y pruebas.

## Rol del estudiante

Actúas como CRM Developer moderno que usa IA como asistente, no como reemplazo de criterio.

## Herramientas necesarias

- Codex, GitHub Copilot, Copilot Chat u otra IA de desarrollo.
- Repositorio Git.
- Archivo JavaScript o C# de práctica (puedes reusar el `sit_opportunity_risk.js` del lab-72).
- Checklist de revisión.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con acceso a una IA de desarrollo real:** ejecuta el prompt del Paso 2 contra una IA real y
  documenta la respuesta literal obtenida, no una respuesta hipotética.
- **Sin acceso a herramientas de IA:** no simules una respuesta de IA inventada — en su lugar, escribe
  tú mismo el "antes/después" del código y documenta explícitamente que el ejercicio de revisión se
  hizo sobre un cambio propio, no generado por IA. Esto sigue validando el criterio de revisión, que
  es lo que este lab realmente evalúa.

## Código de partida (dato de prueba)

Usa como código "antes" este fragmento con 3 problemas deliberados, y aplica el prompt del Paso 2
para mejorarlo (con IA real o revisión manual):

```js
// ANTES — código con problemas para detectar en la revisión
function onLoad(context) {
  var revenue = Xrm.Page.getAttribute("estimatedvalue").getValue(); // usa Xrm.Page (deprecado)
  if (revenue < 0) {
    alert("Valor inválido"); // alert() bloquea el hilo de UI, no es el patrón de Dataverse
  }
  var risk = revenue > 100000 ? "Alto" : "Normal";
  Xrm.Page.getControl("sit_riskfield").setValue(risk); // campo inventado, no existe en el formulario
}
```

Problemas esperados a detectar: uso de `Xrm.Page` en vez de `formContext`, uso de `alert()` en vez
de `formContext.ui.setFormNotification()`, y un campo `sit_riskfield` que no fue confirmado como
existente — exactamente el tipo de alucinación que este lab entrena a detectar.

## Entregables

- Prompt inicial.
- Código antes/después (usa el fragmento de arriba como "antes").
- Diff revisado.
- Checklist de seguridad.
- Casos de prueba.
- Reflexión: que aceptaste, que rechazaste y por qué.

## Pasos detallados

### Paso 1 — Seleccionar mejora

Usa el código de partida de arriba, o elige una alternativa propia:

- Refactor de JavaScript CRM para usar `formContext`.
- Plugin C# con tracing y control de recursión.
- Manejo de errores en flujo/integracion.
- README tecnico de una solucion CRM.

### Paso 2 — Prompt

Escribe un prompt con:

- Contexto del negocio.
- Tecnologia.
- Restricciones.
- Codigo o descripcion actual (el fragmento "ANTES" de arriba).
- Criterios de aceptacion.
- Riesgos que la IA debe evitar.

Ejemplo:

```text
Actua como CRM Developer senior. Revisa este JavaScript de formulario Dynamics 365.
Objetivo: reemplazar patrones inseguros, usar formContext, manejar nulos y proponer casos de
prueba. No inventes nombres de campos que no te haya confirmado. Si falta informacion, marca
supuestos explícitamente en vez de asumir un nombre de campo o tabla.
```

### Paso 3 — Revisión humana

Marca, contrastando contra el código "ANTES":

| Revision | Pregunta | Aplicado al código de partida |
|---|---|---|
| Seguridad | ¿Expone secretos o datos sensibles? | No aplica en este fragmento |
| API correcta | ¿Usa patrones soportados? | Debe corregir `Xrm.Page` → `formContext` |
| Mantenibilidad | ¿Tiene namespace, nombres claros y comentarios utiles? | Falta namespace |
| Pruebas | ¿Incluye casos positivos, negativos y nulos? | El original no valida `revenue` nulo |
| Supuestos | ¿La IA invento campos, tablas o permisos? | Verificar si `sit_riskfield` fue confirmado o inventado |

### Paso 4 — Diff

Documenta:

- Cambios aceptados.
- Cambios rechazados (ej. si la IA propone un nombre de campo distinto sin confirmarlo).
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

## Decisiones que debes tomar

- **La IA propone usar el campo `sit_riskfield` — ¿lo aceptas o lo verificas primero?** Documenta
  qué harías en un formulario real antes de aceptar ese cambio.
- **¿Aceptas un cambio que funciona pero no entiendes completamente por qué?** Define tu propio
  criterio y por qué.
- **¿Le pides a la IA que genere las pruebas también, o las escribes tú?** Explica el riesgo de que
  la IA genere pruebas que solo confirman su propio código, sin cuestionar la lógica de negocio.

## Criterios de validación

- [ ] El prompt tiene contexto y restricciones.
- [ ] La IA (o tu propia revisión) no deja pasar el campo inventado sin ser detectado.
- [ ] Hay revisión humana documentada contra el código "antes".
- [ ] Hay pruebas.
- [ ] Puedes explicar el resultado sin leer el prompt.

## Rúbrica

| Criterio | Peso |
|---|---|
| Prompt | 30% |
| Revision humana | 30% |
| Seguridad | 25% |
| Resultado | 15% |

## Preguntas de entrevista asociadas

- "¿Cómo detectas que una IA inventó un nombre de campo?" — respuesta esperada: verificar contra el
  esquema real del formulario/tabla antes de aceptar, nunca confiar en que el nombre "suena bien".
- "¿Qué haces si el código generado funciona en tus pruebas pero no entiendes por qué?" — respuesta
  esperada: no aceptarlo hasta entenderlo, incluso si "funciona" — riesgo de mantenimiento futuro.
- "¿La IA reemplaza el code review de un compañero?" — respuesta esperada: no; complementa pero no
  sustituye una segunda revisión humana, especialmente para lógica de negocio crítica.

## Qué no debe sobreprometerse

Usar IA en este lab acelera la escritura de código, pero la validación real de calidad y seguridad
sigue siendo responsabilidad humana — completar este lab no certifica un flujo de trabajo con IA
como seguro para producción sin revisión adicional de un equipo.

## Errores comunes

- Copiar codigo generado sin entenderlo.
- No revisar nombres de tablas/campos.
- No probar escenarios negativos.
- Compartir datos sensibles con la IA.
