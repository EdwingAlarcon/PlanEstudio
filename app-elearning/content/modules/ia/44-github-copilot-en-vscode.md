---
moduleId: 44
title: "GitHub Copilot en VS Code"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "github-copilot-en-vscode"
---
### 🎯 Objetivo
Usar GitHub Copilot en VS Code (autocompletado, Copilot Chat y Copilot Edits) de forma productiva en proyectos reales del plan de estudio: componentes PCF, Code Apps y plugins C#.

### 📖 Conceptos Clave
- **Autocompletado inline:** sugiere la continuación del código mientras escribes, basado en el archivo actual y archivos abiertos relacionados; se acepta con Tab.
- **Copilot Chat:** panel de conversación dentro del editor para hacer preguntas sobre el código abierto, pedir explicaciones o generar bloques específicos sin tocar directamente el archivo.
- **Copilot Edits / Agent Mode:** modo que puede proponer y aplicar cambios a través de múltiples archivos del proyecto a partir de una instrucción, mostrando el diff antes de aceptarlo.
- **Contexto del workspace:** Copilot usa como contexto los archivos abiertos, el árbol del proyecto y (según configuración) el repositorio completo — mientras más específico el contexto abierto, más preciso el resultado en un componente PCF o plugin C# concreto.
- **`.github/copilot-instructions.md`:** archivo de convenciones de proyecto que Copilot lee automáticamente, útil para fijar patrones propios del repo (ej. convención de prefijos `sit_` de Dataverse, estilo de manejo de errores en plugins).

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Abre un componente PCF existente del proyecto SIT y usa el autocompletado para escribir una función `updateView` — observa qué tan bien predice la firma del método al tener el archivo real como contexto.
2. Abre Copilot Chat y pregunta "¿qué hace este componente PCF?" con el archivo abierto — evalúa si la explicación es correcta contra lo que tú ya sabes que hace.
3. Usa Copilot Edits para pedir "agregar manejo de errores try/catch a este plugin C#" sobre un plugin ya existente, revisa el diff propuesto antes de aceptarlo.
4. Crea un archivo `.github/copilot-instructions.md` con al menos 2 convenciones del proyecto (ej. prefijo de columnas, patrón de logging) y repite el paso 1 para comparar la mejora en la sugerencia.

### 💼 Casos Reales de Negocio
Un desarrollador de SIT usó Copilot Chat para generar un plugin C# de validación de un campo de Dataverse sin tener abierto el archivo del plugin base del proyecto (que ya tenía un patrón establecido de logging con `ITracingService`). El código generado usó `Console.WriteLine`, que no funciona dentro de un plugin de Dataverse y no genera ningún log visible. El equipo perdió tiempo depurando en producción hasta notar que el patrón de logging del proyecto no se había seguido — la causa raíz fue no dar a Copilot el contexto del patrón ya establecido.

### ✅ Buenas Prácticas
- Mantener abiertos los archivos relevantes (o un archivo de referencia con el patrón esperado) antes de pedir generación de código.
- Usar `.github/copilot-instructions.md` para fijar convenciones del proyecto una sola vez, en lugar de repetirlas en cada prompt.
- Revisar siempre el diff propuesto por Copilot Edits antes de aplicarlo — nunca aceptar cambios multi-archivo a ciegas.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Código generado no sigue el patrón de logging/errores del proyecto | Copilot no tenía contexto del patrón ya establecido | Abrir un archivo de referencia o documentarlo en `.github/copilot-instructions.md` |
| Aceptar cambios de Copilot Edits sin revisar el diff | Confiar en el resultado por ser multi-archivo y "coherente" | Revisar cada archivo modificado en el diff antes de aplicar |
| Repetir las mismas convenciones de proyecto en cada prompt | No usar el archivo de instrucciones del repositorio | Centralizar convenciones en `.github/copilot-instructions.md` |

### 🧪 Criterios de Validación
- [ ] Genero un fragmento de código en un componente PCF real usando autocompletado y explico qué contexto ayudó a la precisión
- [ ] Uso Copilot Chat para explicar un archivo existente y verifico la explicación contra mi propio conocimiento
- [ ] Aplico un cambio con Copilot Edits revisando el diff antes de aceptarlo
- [ ] Creo un `.github/copilot-instructions.md` con al menos 2 convenciones del proyecto
