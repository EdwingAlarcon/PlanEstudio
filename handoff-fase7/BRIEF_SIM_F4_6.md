# Prueba simulada como alumno — Fases 4, 5 y 6 (2026-11-01)

Eres un evaluador independiente. **No leas** `CLAUDE.md`, `SPRINT_HANDOFF.md`, `PROPUESTA_*`, `HISTORIAL_*` ni otros
documentos de estado del proyecto: si el entorno te los carga solos, dilo en el informe y no los uses. Solo lees los archivos
que te indica tu tarea (en `C:\Users\EdwingAlarcon\Documents\Repos\PlanEstudio\app-elearning\content\`) y, cuando un módulo
enlace a una práctica `/practica/<slug>`, puedes buscarla por su slug en
`C:\Users\EdwingAlarcon\Documents\Repos\PlanEstudio\app-elearning\src\lib\interactive-practices.ts` para ver si es coherente
con el módulo y si se puede resolver con lo enseñado. **No edites ningún archivo del repo.** Es una simulación hecha por un
modelo, no una persona real: dilo en el informe.

## Personas (usa la que indica tu tarea)
- **Valeria (Avanzado, Fase 4):** desarrolladora junior, 26 años. Terminó Básico e Intermedio de este curso (incluido el
  Módulo 13: JavaScript de formulario y un PCF sencillo). Sabe JavaScript básico; nunca escribió C# ni usó Azure DevOps.
  Tiene VS Code, puede instalar herramientas (Node, .NET SDK, PAC CLI, Plugin Registration Tool), un ambiente Developer en
  English (United States) del que es System Administrator, una cuenta gratuita de Azure y una de Azure DevOps. Si se pierde
  más de 20 minutos en un paso, abandona.
- **Martín (Arquitecto, Fase 5):** consultor de 34 años con 3 años en Power Platform; terminó Básico, Intermedio y
  Avanzado de este curso. Tiene un ambiente Developer, Azure de pago por uso con presupuesto pequeño, **sin** licencias E5,
  Entra ID P2, Copilot Credits ni un segundo tenant. Tiene que poder completar cada microlección (o su variante en papel) y
  saber cuándo su decisión "está bien" con la rúbrica. Abandona si una tarea no tiene criterio claro de terminado.
- **Sofía (IA, Fase 6):** maker de 29 años que terminó el Nivel Básico. Sabe poco de Git, tiene GitHub Free, VS Code y
  GitHub Copilot Free, y un ambiente Developer. Los módulos de IA son transversales: no debe necesitar los niveles
  Intermedio/Avanzado. Abandona tras 15 minutos perdida.

## Protocolo
1. Recorre cada paso numerado como si lo hicieras de verdad. Marca cada sitio donde la persona tendría que **adivinar**
   (qué botón, dónde, qué escribir, qué debería ver), cada término usado antes de explicarse, cada salto de nivel y cada
   requisito (licencia, rol, herramienta, coste) que aparece sin aviso previo.
2. Código: todo fragmento que el alumno deba copiar y ejecutar, revísalo como lo haría un compilador (nombres, firmas,
   `using`, tipos, rutas). Si puedes, compruébalo: TypeScript con `npx tsc --noEmit` en una carpeta de tu scratch; C# con el
   .NET SDK 8 instalado (`C:\Program Files\dotnet\dotnet.exe`) en un proyecto de scratch (net48 con el paquete
   `Microsoft.NETFramework.ReferenceAssemblies` y `Microsoft.CrmSdk.CoreAssemblies` para plugins; net8 para Azure
   Functions). Trabaja solo dentro de tu carpeta de scratch.
3. Compara el tiempo del frontmatter (`estimatedMinutes` lectura + `practiceMinutes`, o `duration` en labs) con el que estimas.
4. Revisa las microprácticas enlazadas: ¿se resuelven con lo enseñado hasta ese punto? ¿La respuesta correcta es
   defendible y las incorrectas tienen consecuencia clara?
5. Revisión técnica aparte: afirmaciones falsas o dudosas (etiquetas de interfaz, límites, licencias, funciones, código).
   Compruébalas en Microsoft Learn con WebFetch (en inglés) y cita URL y `ms.date`; si no puedes, márcalas "dudosa, sin verificar".
6. Veredicto por módulo/lab: **sí** (lo termina solo), **con dificultad** (atasco recuperable) o **no** (se bloquea sin salida).

## Informe
Escríbelo en el archivo de scratch que te indica tu tarea y resúmelo en tu respuesta final. Por módulo/lab: veredicto;
tabla "Paso | Problema | Gravedad (bloquea / atasca / menor) | Propuesta concreta" citando el texto exacto; tiempos;
resultado de compilar el código (comando y salida resumida); hallazgos técnicos con URL de Learn.
