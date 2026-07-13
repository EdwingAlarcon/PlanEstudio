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

## Escenario de negocio

**Empresa ficticia:** Contoso Servicios B2B.

El equipo comercial quiere validar automaticamente campos de oportunidad y calcular una
clasificacion de riesgo antes de guardar. La prueba tecnica busca confirmar que no usas `Xrm.Page`
y que puedes explicar eventos del formulario.

## Rol del estudiante

Actúas como CRM Developer junior responsable de una personalizacion client-side mantenible.

## Herramientas necesarias

- Ambiente Dynamics 365 Sales o tabla Opportunity en Dataverse.
- Web resource JavaScript.
- Formulario de oportunidad o tabla equivalente.
- Si no tienes tenant, entrega archivo JS, pseudoregistro de eventos y casos de prueba.

## Entregables

- Archivo `sit_opportunity_risk.js`.
- Tabla de eventos registrados.
- Casos de prueba.
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

- Valor estimado negativo bloquea guardado.
- Valor alto + probabilidad baja muestra riesgo alto.
- Valor bajo muestra riesgo normal.
- Campo vacio no genera error de script.

## Criterios de validacion

- [ ] Usa `executionContext.getFormContext()`.
- [ ] No usa `Xrm.Page`.
- [ ] Tiene namespace.
- [ ] Maneja valores nulos.
- [ ] Documenta eventos y pruebas.

## Rubrica

| Criterio | Peso |
|---|---|
| Eventos correctos | 30% |
| Codigo mantenible | 25% |
| Manejo de errores | 20% |
| Pruebas documentadas | 15% |
| Explicacion tecnica | 10% |

## Errores comunes

- Registrar la funcion sin namespace.
- No publicar la web resource.
- Olvidar pasar execution context.
- Usar nombres de campos incorrectos sin validar.
