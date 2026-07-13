---
id: lab-73
title: "JR-003 — Dataverse Plugin C#"
level: "N3"
duration: 300
product: ["Dataverse", "C#", "Plugins"]
certifications: ["PL-400"]
role: ["Dynamics 365 CRM Developer", "Power Platform Developer"]
prerequisites:
  - "Módulo 23 estudiado: C# Plugins para Dataverse"
  - "Conocimiento básico de pipeline, tracing y registro de plugins"
---

# Lab 73 — JR-003: Dataverse Plugin C#

## Objetivo

Diseñar, implementar o documentar un plugin C# de Dataverse con pipeline correcto, tracing,
validacion de negocio, manejo de recursion y evidencia de pruebas.

## Escenario de negocio

**Empresa ficticia:** Litware Field Services.

Cuando se crea una solicitud de mantenimiento critica, Dataverse debe calcular un campo
`sit_requiresmanagerapproval` y registrar una traza clara. La prueba tecnica evalua si entiendes
PreOperation/PostOperation, depth, images y tracing.

## Rol del estudiante

Actúas como CRM Developer responsable de logica de servidor.

## Herramientas necesarias

- Visual Studio o VS Code con .NET.
- Dataverse Plugin Registration Tool o PAC CLI.
- Ambiente Dataverse de practica.
- Si no tienes tenant, entrega codigo, registro esperado y pruebas unitarias conceptuales.

## Entregables

- Clase plugin C#.
- Registro de step.
- Configuracion de filtering attributes.
- Evidencia de Plugin Trace Log.
- Casos de prueba.

## Pasos detallados

### Paso 1 — Diseno del step

| Propiedad | Valor |
|---|---|
| Message | Create |
| Table | `sit_maintenance request` o equivalente |
| Stage | PreOperation |
| Mode | Synchronous |
| Filtering attributes | prioridad, activo, tipo |

### Paso 2 — Codigo base

```csharp
using Microsoft.Xrm.Sdk;
using System;

public class MaintenanceApprovalPlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

        if (context.Depth > 1)
        {
            tracing.Trace("Depth mayor a 1. Se evita recursion.");
            return;
        }

        if (!context.InputParameters.Contains("Target") || context.InputParameters["Target"] is not Entity target)
        {
            tracing.Trace("Target no disponible.");
            return;
        }

        var priority = target.GetAttributeValue<OptionSetValue>("sit_priority")?.Value;
        var requiresApproval = priority == 100000002;

        target["sit_requiresmanagerapproval"] = requiresApproval;
        tracing.Trace("Requires manager approval: {0}", requiresApproval);
    }
}
```

### Paso 3 — Pruebas

Documenta:

- Prioridad critica marca aprobacion.
- Prioridad baja no marca aprobacion.
- Target sin prioridad no falla.
- Depth > 1 no ejecuta logica.

## Criterios de validacion

- [ ] El stage elegido esta justificado.
- [ ] Usa tracing.
- [ ] Controla recursion.
- [ ] Maneja atributos ausentes.
- [ ] Tiene pruebas o matriz de pruebas.

## Rubrica

| Criterio | Peso |
|---|---|
| Pipeline y registro | 25% |
| Codigo C# | 30% |
| Tracing y errores | 20% |
| Pruebas | 15% |
| Explicacion de entrevista | 10% |

## Errores comunes

- Usar PostOperation cuando necesitas modificar Target antes de guardar.
- No validar `Depth`.
- No activar Plugin Trace Log.
- Registrar step sin filtering attributes.
