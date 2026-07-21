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
validación de negocio, manejo de recursión y evidencia de pruebas.

## Perfil laboral y skill validado

**Vacante objetivo:** Dynamics 365 CRM Developer que escribe lógica de servidor (plugins) para
reglas de negocio que no pueden vivir solo en el cliente.

**Skill concreto que valida:** elección correcta de stage (Pre/PostOperation), control de
recursión con `Depth`, tracing consistente, y manejo defensivo de atributos ausentes — a diferencia
del lab-92 (JR-012), que evalúa troubleshooting de un incidente ya ocurrido, este lab evalúa la
construcción original del plugin.

## Escenario de negocio

**Empresa ficticia:** Litware Field Services — 60 técnicos de campo, ~200 solicitudes de
mantenimiento activas por semana.

Cuando se crea una solicitud de mantenimiento critica, Dataverse debe calcular un campo
`sit_requiresmanagerapproval` y registrar una traza clara. La prueba tecnica evalua si entiendes
PreOperation/PostOperation, depth, images y tracing.

## Rol del estudiante

Actúas como CRM Developer responsable de logica de servidor.

## Herramientas necesarias

- Visual Studio o VS Code con .NET.
- Dataverse Plugin Registration Tool o PAC CLI.
- Ambiente Dataverse de practica.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real:** registra el plugin, crea los 4 registros de datos de prueba y adjunta el
  Plugin Trace Log real de cada ejecución.
- **Sin tenant:** entrega el código compilable, el registro de step documentado y, para cada dato
  de prueba, el texto de traza que el plugin *debería* producir según tu propia lógica — dejando
  explícito que no fue verificado contra un ambiente real.

## Datos de prueba

Ejecuta (o simula) el plugin contra estos 4 registros de `sit_maintenance request`:

| Registro | sit_priority | Resultado esperado en `sit_requiresmanagerapproval` |
|---|---|---|
| Solicitud A | Crítica (100000002) | `true` |
| Solicitud B | Baja (100000000) | `false` |
| Solicitud C | *(sin valor)* | `false` (atributo ausente no debe lanzar excepción) |
| Solicitud D | Crítica, creada por un plugin previo con Depth 2 | El plugin no ejecuta lógica (corta por recursión) |

## Entregables

- Clase plugin C#.
- Registro de step.
- Configuracion de filtering attributes.
- Evidencia de Plugin Trace Log (real o simulada, ver arriba).
- Casos de prueba contra los 4 datos anteriores.

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
            tracing.Trace("Depth mayor a 1. Se evita recursión.");
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

Ejecuta o simula, documentando entrada y salida para cada uno de los 4 datos de prueba:

- Prioridad critica marca aprobacion (Solicitud A).
- Prioridad baja no marca aprobacion (Solicitud B).
- Target sin prioridad no falla (Solicitud C).
- Depth > 1 no ejecuta logica (Solicitud D).

## Decisiones que debes tomar

- **¿Por qué PreOperation y no PostOperation?** Debes justificar que PreOperation permite modificar
  `target` antes de que se persista, evitando una segunda escritura a la base de datos.
- **¿Qué pasa si `sit_priority` tiene un valor de OptionSet que no está en el mapa de negocio (ej. un
  valor nuevo agregado después)?** Decide si el plugin debe fallar, ignorar, o loguear una
  advertencia — y documenta el trade-off.
- **¿Este plugin necesita una imagen (pre-image) del registro?** Como es `Create`, no existe estado
  previo — explica por qué una pre-image no aplica aquí pero sí aplicaría en un `Update`.

## Criterios de validación

- [ ] El stage elegido esta justificado.
- [ ] Usa tracing.
- [ ] Controla recursión.
- [ ] Maneja atributos ausentes.
- [ ] Tiene pruebas contra los 4 datos de prueba definidos arriba.

## Rúbrica

| Criterio | Peso |
|---|---|
| Pipeline y registro | 25% |
| Codigo C# | 30% |
| Tracing y errores | 20% |
| Pruebas | 15% |
| Explicacion de entrevista | 10% |

## Preguntas de entrevista asociadas

- "¿Qué pasa si dos plugins síncronos en el mismo stage modifican el mismo campo?" — respuesta
  esperada: orden de ejecución configurable (rank), y riesgo de que uno sobrescriba al otro si no se
  coordina.
- "¿Cómo evitarías un loop infinito si este plugin dispara un Update que vuelve a activar el mismo
  step?" — respuesta esperada: control de `Depth`, y diseño para no reactivar el mismo mensaje sobre
  la misma tabla sin necesidad.
- "¿Por qué usar `GetAttributeValue<T>` en vez de indexar directamente `target["sit_priority"]`?" —
  respuesta esperada: `GetAttributeValue<T>` devuelve `null`/default en vez de lanzar `KeyNotFoundException`
  si el atributo no viene en el mensaje.

## Qué no debe sobreprometerse

Este plugin cubre un solo mensaje (`Create`) y una sola tabla; no demuestra por sí solo manejo de
transacciones distribuidas, bulk operations, ni plugins asíncronos — esos quedan fuera de alcance de
este lab.

## Errores comunes

- Usar PostOperation cuando necesitas modificar Target antes de guardar.
- No validar `Depth`.
- No activar Plugin Trace Log.
- Registrar step sin filtering attributes.
