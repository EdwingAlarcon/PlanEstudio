---
id: lab-72
title: "JR-002 — CRM JavaScript Customization"
level: "N3"
duration: 240
product: ["Dynamics 365 Customer Engagement", "Dataverse", "JavaScript"]
certifications: ["PL-400"]
role: ["Dynamics 365 CRM Developer", "Power Platform Developer"]
prerequisites:
  - "Módulo 13 estudiado: JavaScript y Web Resources"
  - "Módulo 20 revisado: Dynamics 365 CE"
---

# Lab 72 — JR-002: CRM JavaScript Customization

## Objetivo

Crear una web resource JavaScript para formularios CRM usando `formContext`, eventos OnLoad,
OnChange y OnSave, con evidencia de pruebas y manejo de errores.

## Perfil laboral y skill validado

**Vacante objetivo:** Dynamics 365 CRM Developer / Power Platform Developer junior que personaliza
formularios client-side.

**Skill concreto que valida:** dominio del API moderno de formulario (`formContext`, no `Xrm.Page`),
diseño de validaciones que bloquean el guardado con `preventDefault()`, y manejo seguro de valores
nulos — el error más común de developers junior en este tipo de prueba técnica.

## Escenario de negocio

**Empresa ficticia:** Contoso Servicios B2B — equipo comercial de 18 ejecutivos, ~120 oportunidades
abiertas por mes.

El equipo comercial quiere validar automaticamente campos de oportunidad y calcular una
clasificacion de riesgo antes de guardar. La prueba tecnica busca confirmar que no usas `Xrm.Page`
y que puedes explicar eventos del formulario.

## Rol del estudiante

Actúas como CRM Developer junior responsable de una personalizacion client-side mantenible.

## Herramientas necesarias

- Ambiente Dynamics 365 Sales o tabla Opportunity en Dataverse.
- Web resource JavaScript.
- Formulario de oportunidad o tabla equivalente.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real:** sube el web resource, regístralo en los 3 eventos del formulario de
  Opportunity, y ejecuta los 4 casos de prueba del Paso 3 capturando el comportamiento real.
- **Sin tenant:** entrega el archivo `.js` completo, la tabla de eventos y una tabla de pruebas
  donde documentas para cada caso qué esperarías ver en consola/formulario si lo ejecutaras — sin
  presentarlo como si hubiera sido probado en un ambiente real.

## Datos de prueba

Usa estos 4 registros de Opportunity para ejecutar (o simular) los casos de prueba del Paso 3:

| Oportunidad | estimatedvalue | closeprobability | Riesgo esperado |
|---|---|---|---|
| Contoso — Renovación anual | 150000 | 30 | Alto |
| Contoso — Upsell módulo Service | 45000 | 70 | Normal |
| Contoso — Piloto nuevo cliente | -500 (inválido) | 20 | Bloqueado al guardar |
| Contoso — Oportunidad sin probabilidad | 80000 | (vacío) | Normal (probability tratado como 0) |

## Entregables

- Archivo `sit_opportunity_risk.js`.
- Tabla de eventos registrados.
- Casos de prueba ejecutados contra los datos de prueba anteriores.
- Capturas o descripcion de comportamiento.
- README tecnico.

## Pasos detallados

### Paso 1 — Namespace

Define un namespace:

```js
var SIT = SIT || {};
SIT.OpportunityRisk = (function () {
  function onLoad(executionContext) {
    var formContext = executionContext.getFormContext();
    evaluateRisk(formContext);
  }

  function onChangeEstimatedRevenue(executionContext) {
    var formContext = executionContext.getFormContext();
    evaluateRisk(formContext);
  }

  function onSave(executionContext) {
    var formContext = executionContext.getFormContext();
    var revenue = formContext.getAttribute("estimatedvalue")?.getValue();
    if (revenue !== null && revenue < 0) {
      executionContext.getEventArgs().preventDefault();
      formContext.ui.setFormNotification("El valor estimado no puede ser negativo.", "ERROR", "sit_revenue_negative");
    }
  }

  function evaluateRisk(formContext) {
    var revenue = formContext.getAttribute("estimatedvalue")?.getValue() || 0;
    var probability = formContext.getAttribute("closeprobability")?.getValue() || 0;
    var risk = revenue > 100000 && probability < 40 ? "Alto" : "Normal";
    formContext.ui.setFormNotification("Riesgo comercial: " + risk, "INFO", "sit_risk");
  }

  return {
    onLoad: onLoad,
    onChangeEstimatedRevenue: onChangeEstimatedRevenue,
    onSave: onSave
  };
})();
```

### Paso 2 — Eventos

Documenta:

| Evento | Funcion | Campo |
|---|---|---|
| OnLoad | `SIT.OpportunityRisk.onLoad` | Formulario |
| OnChange | `SIT.OpportunityRisk.onChangeEstimatedRevenue` | `estimatedvalue` |
| OnSave | `SIT.OpportunityRisk.onSave` | Formulario |

### Paso 3 — Casos de prueba

Ejecuta (o simula, ver arriba) contra los 4 registros de la tabla de datos de prueba:

- Valor estimado negativo bloquea guardado ("Piloto nuevo cliente").
- Valor alto + probabilidad baja muestra riesgo alto ("Renovación anual").
- Valor bajo/probabilidad alta muestra riesgo normal ("Upsell módulo Service").
- Campo de probabilidad vacio no genera error de script ("Oportunidad sin probabilidad").

## Decisiones que debes tomar

- **¿La validación de negativo debe ser client-side (JS) o también server-side (business rule o
  plugin)?** JS se puede saltar via API directa; documenta si recomendarías una segunda capa de
  validación en servidor y por qué la prueba técnica solo pide la capa client-side.
- **¿Qué pasa si `estimatedvalue` no existe en el formulario (campo removido)?** Decide si
  `getAttribute` devolviendo `null` debe silenciarse o mostrar una advertencia al desarrollador.

## Criterios de validación

- [ ] Usa `executionContext.getFormContext()`.
- [ ] No usa `Xrm.Page`.
- [ ] Tiene namespace.
- [ ] Maneja valores nulos.
- [ ] Documenta eventos y pruebas contra los 4 datos de prueba.

## Rúbrica

| Criterio | Peso |
|---|---|
| Eventos correctos | 30% |
| Codigo mantenible | 25% |
| Manejo de errores | 20% |
| Pruebas documentadas | 15% |
| Explicacion tecnica | 10% |

## Preguntas de entrevista asociadas

- "¿Por qué `Xrm.Page` está deprecado y qué problema evita `formContext`?" — respuesta esperada:
  `Xrm.Page` es un singleton global que rompe en formularios con múltiples contextos (ej. quick
  create); `formContext` se pasa explícitamente por `executionContext`.
- "¿Cómo evitas que tu validación de OnSave se salte si alguien crea el registro por API?" —
  respuesta esperada: reconocer que JS solo protege la UI, y que una regla de negocio real necesita
  reforzarse también en servidor (business rule o plugin).
- "¿Qué pasa si registras el evento sin marcar 'Pass execution context as first parameter'?" —
  respuesta esperada: la función recibe `undefined` y falla al llamar `.getFormContext()`.

## Qué no debe sobreprometerse

Este lab valida personalización client-side aislada; no sustituye pruebas de un formulario
productivo con reglas de negocio, seguridad de campo y otros scripts interactuando al mismo tiempo.

## Errores comunes

- Registrar la funcion sin namespace.
- No publicar la web resource.
- Olvidar pasar execution context.
- Usar nombres de campos incorrectos sin validar.
