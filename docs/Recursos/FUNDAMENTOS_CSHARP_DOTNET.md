# Fundamentos de C#/.NET para Power Platform — antes del Módulo 23

El Módulo 23 (Plugins C# para Dataverse) se declara a sí mismo no autosuficiente: exige C# (clases,
interfaces, herencia, excepciones, `async`/`await`) que el plan no enseñaba antes de este puente. Si
nunca programaste en C#, leé esto primero.

**Tipo de práctica de este recurso: conceptual + ejecutable en tu máquina (sin Dataverse todavía).**
Todo corre en un proyecto de consola .NET local — no necesitás ambiente Developer ni tenant para esta
parte. La ejecución contra Dataverse real sigue siendo del Módulo 23.

## Objetivo

Poder leer y escribir el C# mínimo que exige un plugin de Dataverse: clases, métodos, tipos básicos,
excepciones y el patrón `try/catch` que todo plugin usa para reportar errores al usuario.

## 1. ¿Qué es C# y qué es .NET?

| Término | En una frase |
|---|---|
| **C#** | El lenguaje de programación — la sintaxis que escribís. |
| **.NET** | La plataforma/runtime que ejecuta ese código — como el motor debajo del lenguaje. |
| **NuGet** | El gestor de paquetes de .NET (equivalente a npm en JavaScript) — así instalás el SDK de Dataverse. |
| **Assembly (.dll)** | El archivo compilado que subís a Dataverse — tu código C# empaquetado. |

## 2. Lo mínimo de sintaxis que un plugin usa

### Clases y métodos

```csharp
public class SolicitudPlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        // el código del plugin vive acá
    }
}
```

- `public class NombrePlugin : IPlugin` — declarás una clase que **implementa** la interfaz `IPlugin`
  (el "contrato" que Dataverse exige para poder ejecutar tu código).
- `public void Execute(...)` — el único método que Dataverse llama. Todo tu plugin vive adentro.

### Tipos y variables

```csharp
string titulo = "Solicitud nueva";
int prioridad = 2;
bool esUrgente = true;
DateTime fecha = DateTime.UtcNow;
```

A diferencia de JavaScript (Módulo 56), C# es **fuertemente tipado**: declarás el tipo de cada
variable, y el compilador te avisa si mezclás tipos incompatibles — eso pasa *antes* de ejecutar, no
en producción.

### Excepciones (`try`/`catch`)

```csharp
try
{
    service.Create(entidad);
}
catch (Exception ex)
{
    tracer.Trace("Error al crear: {0}", ex.Message);
    throw new InvalidPluginExecutionException("No se pudo crear el registro.");
}
```

- `try { ... }` — el código que puede fallar.
- `catch (Exception ex) { ... }` — qué hacer si falla. `ex.Message` tiene el detalle del error.
- `throw new InvalidPluginExecutionException(...)` — la única excepción que Dataverse le muestra al
  usuario como mensaje de negocio legible; cualquier otra excepción no controlada muestra un error
  técnico genérico.

### `async`/`await` (lo vas a ver, no lo vas a escribir en plugins síncronos)

Los plugins clásicos de Dataverse son **síncronos** (no usan `async`/`await`) — lo vas a encontrar
recién si tocás Azure Functions o integraciones externas (Módulo 24). Por ahora, si lo ves en código
de ejemplo de terceros, solo necesitás saber que `await` "espera" una operación que toma tiempo (como
una llamada de red) sin bloquear el hilo completo.

## 3. Práctica — proyecto de consola local (sin Dataverse)

1. Instalá el [.NET SDK](https://dotnet.microsoft.com/download) si no lo tenés (verificá con `dotnet --version` en tu terminal).
2. Creá un proyecto de consola: `dotnet new console -o MiPrimerPluginConceptual` y entrá a esa carpeta.
3. Reemplazá el contenido de `Program.cs` por una clase `Solicitud` con propiedades `Titulo` (string),
   `Prioridad` (int) y un método `EsUrgente()` que devuelva `true` si `Prioridad >= 3`.
4. En el `Main`, creá 3 solicitudes con distintas prioridades, recorrelas con un `foreach`, y usá
   `try/catch` para capturar el caso de una prioridad inválida (ej. negativa) y lanzar una excepción
   con un mensaje claro.
5. Corré con `dotnet run` y confirmá que el `catch` se ejecuta cuando corresponde.

**Evidencia esperada:** captura de la consola mostrando las 3 solicitudes procesadas y el mensaje de
error capturado por el `catch`, guardada en tu bitácora.

## Errores comunes

- **Error:** confundir `=` (asignación) con `==` (comparación). **Por qué pasa:** en JavaScript a veces
  es más flexible; en C# el compilador te lo marca como error de tipos casi siempre, así que si
  compila y el resultado es raro, revisá esto primero.
- **Error:** olvidar que C# es sensible a mayúsculas (`String` no es lo mismo que `string` en todos los
  contextos, y `Titulo` no es lo mismo que `titulo`). **Cómo evitarlo:** copiá los nombres exactos del
  ejemplo, no los reescribas de memoria.
- **Error:** intentar usar `throw new Exception(...)` genérico dentro de un plugin real y esperar que
  el usuario vea el mensaje. **Cómo evitarlo:** en Dataverse, siempre `InvalidPluginExecutionException`
  para mensajes que debe ver el usuario — lo vas a practicar en el Módulo 23.

## Criterio de aprobación

Podés seguir al Módulo 23 cuando puedas, sin mirar este documento:

- [ ] Escribir una clase simple con una propiedad y un método.
- [ ] Explicar la diferencia entre C# y .NET.
- [ ] Escribir un bloque `try/catch` y explicar qué hace cada parte.
- [ ] Correr un proyecto de consola con `dotnet run`.

## Qué este puente NO cubre (y por qué no bloquea el Módulo 23)

Programación orientada a objetos avanzada (herencia múltiple vía interfaces, genéricos, LINQ),
testing con Moq (el Módulo 23 lo introduce ahí mismo), y el SDK de Dataverse en sí (`IOrganizationService`,
`IPluginExecutionContext`) — esos se aprenden *en* el Módulo 23 con el andamiaje del propio lab. Este
puente solo cierra la brecha de sintaxis básica de C#, no reemplaza un curso completo de programación.

## Siguiente paso

→ [Módulo 23 — Plugins C# para Dataverse](/nivel/avanzado/modulo/c-plugins-para-dataverse)
