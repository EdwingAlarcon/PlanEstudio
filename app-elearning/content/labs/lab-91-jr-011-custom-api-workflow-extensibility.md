---
id: lab-91
title: "JR-011 — Custom API & Workflow Extensibility Job Test"
level: "N4"
duration: 240
product: ["Dataverse", "C#", "Custom API", "Workflow"]
certifications: ["PL-400"]
role: ["Dynamics 365 CRM Developer", "Power Platform Developer"]
prerequisites:
  - "Módulo 23 estudiado: C# Plugins para Dataverse"
  - "Lab 73 completado (recomendado): Dataverse Plugin C#"
  - "Conocimiento básico de pipeline, tracing y registro de plugins"
---

# Lab 91 — JR-011: Custom API & Workflow Extensibility Job Test

## Objetivo

Diseñar e implementar (o documentar con evidencia conceptual) una Custom API de Dataverse con
parámetros de entrada/salida y un Custom Workflow Activity equivalente para un escenario legacy,
como prueba técnica de extensibilidad avanzada más allá del plugin tradicional.

## Escenario de negocio

**Empresa ficticia:** Contoso Manufacturing.

El equipo de operaciones necesita recalcular el descuento de una orden bajo demanda, desde varios
puntos: un botón en la app model-driven, un flujo clásico heredado que todavía no se migró a Power
Automate, y una futura integración externa. El entrevistador quiere ver si sabes elegir la
extensión correcta para cada punto de entrada en lugar de duplicar lógica en tres lugares.

## Rol del estudiante

Actúas como CRM Developer responsable de exponer lógica de negocio reutilizable en Dataverse.

## Herramientas necesarias

- Visual Studio o VS Code con .NET.
- Dataverse Plugin Registration Tool o PAC CLI.
- Ambiente Dataverse de práctica.
- Si no tienes tenant, entrega el diseño de la Custom API, el código y las pruebas conceptuales.

## Entregables

- Definición de la Custom API (nombre, parámetros de entrada/salida, tipo de retorno).
- Clase plugin C# que respalda la Custom API.
- Clase `CodeActivity` C# para el Custom Workflow Activity equivalente.
- Tabla comparativa: Custom API vs. Custom Workflow Activity vs. plugin tradicional vs. Power Automate.
- Casos de prueba para ambos componentes.

## Pasos detallados

### Paso 1 — Diseño del contrato de la Custom API

| Propiedad | Valor |
|---|---|
| Unique Name | `sit_RecalculateOrderDiscount` |
| Binding type | Entity (bound a `salesorder`/tabla de orden) |
| Input parameter | `ReasonCode` (String, opcional) |
| Output parameter | `NewDiscountAmount` (Decimal) |
| Plugin type | Registrado como el plugin que ejecuta la Custom API |

Define por qué este cálculo se expone como Custom API y no queda solo dentro del formulario:
reutilización desde múltiples puntos de entrada (UI, integración externa, workflow clásico) con un
único contrato versionable.

### Paso 2 — Plugin que respalda la Custom API

```csharp
using Microsoft.Xrm.Sdk;
using System;

public class RecalculateOrderDiscountApi : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

        if (!context.InputParameters.Contains("Target") || context.InputParameters["Target"] is not EntityReference target)
        {
            tracing.Trace("Target no disponible o tipo incorrecto para Custom API.");
            throw new InvalidPluginExecutionException("Se requiere una orden válida.");
        }

        var reasonCode = context.InputParameters.Contains("ReasonCode")
            ? context.InputParameters["ReasonCode"] as string
            : null;

        // Regla de negocio simplificada: descuento base + ajuste por motivo.
        decimal newDiscount = reasonCode == "VOLUME" ? 0.15m : 0.05m;

        tracing.Trace("Recalculando descuento para orden {0} con motivo {1}: {2}", target.Id, reasonCode, newDiscount);

        context.OutputParameters["NewDiscountAmount"] = newDiscount;
    }
}
```

### Paso 3 — Custom Workflow Activity equivalente (escenario legacy)

Un flujo clásico (classic workflow/dialog) todavía en producción necesita el mismo cálculo, pero no
puede invocar una Custom API directamente desde ese motor legacy. Documenta el `CodeActivity`:

```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;

public class RecalculateOrderDiscountActivity : CodeActivity
{
    [Input("Reason Code")]
    public InArgument<string> ReasonCode { get; set; }

    [Output("New Discount Amount")]
    public OutArgument<decimal> NewDiscountAmount { get; set; }

    protected override void Execute(CodeActivityContext executionContext)
    {
        var tracing = executionContext.GetExtension<ITracingService>();
        var reasonCode = ReasonCode.Get(executionContext);

        decimal newDiscount = reasonCode == "VOLUME" ? 0.15m : 0.05m;
        tracing.Trace("Custom Workflow Activity: descuento calculado {0}", newDiscount);

        NewDiscountAmount.Set(executionContext, newDiscount);
    }
}
```

Nota de diseño: la lógica de negocio (regla del descuento) debería vivir en un único lugar
compartido por ambas clases para no duplicar la regla — documenta cómo la extraerías a una clase
de dominio común si el escenario creciera.

### Paso 4 — Comparación y decisión

| Mecanismo | Cuándo usarlo | Limitación |
|---|---|---|
| Custom API | Lógica reutilizable invocable desde UI, código, Power Automate o integraciones externas | Requiere registro y versión de contrato |
| Custom Workflow Activity | Flujos clásicos/dialogs legacy que aún no se migraron a Power Automate | Tecnología en mantenimiento, no recomendada para nuevo desarrollo |
| Plugin tradicional | Reacciona a un evento (create/update) sin necesidad de invocación explícita | No reutilizable como acción bajo demanda |
| Power Automate | Automatización sin código para la mayoría de los casos | Menor control fino y testing unitario más difícil |

## Criterios de validación

- [ ] El contrato de la Custom API define parámetros de entrada y salida con tipos correctos.
- [ ] El plugin que respalda la Custom API valida el `Target` y maneja parámetros ausentes.
- [ ] El Custom Workflow Activity usa `InArgument`/`OutArgument` correctamente.
- [ ] La tabla comparativa justifica cuándo usar cada mecanismo.
- [ ] Hay casos de prueba para ambos componentes (motivo presente, motivo ausente, entrada inválida).

## Rúbrica

| Criterio | Peso |
|---|---|
| Diseño del contrato de la Custom API | 25% |
| Código del plugin de la Custom API | 25% |
| Código del Custom Workflow Activity | 20% |
| Comparación y justificación de mecanismo | 20% |
| Pruebas | 10% |

## Errores comunes

- Duplicar la regla de negocio en el plugin y en el Custom Workflow Activity sin extraerla a un lugar común.
- Usar Custom Workflow Activity para desarrollo nuevo cuando Power Automate o una Custom API resuelven el caso mejor.
- No versionar el contrato de la Custom API al cambiar parámetros, rompiendo consumidores existentes.
- Omitir el manejo de parámetros de entrada ausentes u opcionales.
