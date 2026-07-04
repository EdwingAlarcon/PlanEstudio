---
moduleId: 42
title: "Fundamentos de IA para Desarrollo"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 7
slug: "fundamentos-ia-desarrollo"
---
### 🎯 Objetivo
Entender qué es un modelo de lenguaje (LLM) aplicado a generación de código, distinguir entre autocompletado, chat y agentes, y reconocer los límites reales de estas herramientas antes de usarlas en proyectos de Power Platform y Dynamics 365.

### 📖 Conceptos Clave
- **LLM aplicado a código:** un modelo entrenado para predecir texto, incluyendo código, a partir del contexto que recibe (el archivo abierto, el historial de chat, el repositorio). No "entiende" el negocio: infiere patrones estadísticamente probables.
- **Autocompletado vs Chat vs Agente:** el autocompletado (GitHub Copilot inline) sugiere la siguiente línea mientras escribes; el chat (Copilot Chat, Claude, ChatGPT) responde preguntas o genera bloques a partir de una instrucción; un agente (Claude Code, Codex, Copilot Agent Mode) puede leer múltiples archivos, ejecutar comandos y editar el repositorio de forma autónoma dentro de los límites que le des.
- **Contexto y ventana de contexto:** cuanto más contexto relevante (archivos, historial, documentación) reciba el modelo, mejor su respuesta — pero hay un límite de tokens; en repos grandes hay que decidir qué mostrarle.
- **Alucinaciones:** el modelo puede generar código sintácticamente válido que referencia una función, tabla o campo de Dataverse que no existe. Esto no es un bug del modelo, es una consecuencia de cómo funciona — siempre hay que verificar contra la fuente real (el esquema, la documentación oficial).
- **Determinismo relativo:** la misma pregunta puede producir respuestas distintas en ejecuciones diferentes. Esto es aceptable para explorar ideas, pero exige revisión humana antes de aceptar cualquier cambio en código de producción.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Abre un editor con Copilot o Claude Code instalado y pide "generar una función de Power Fx que valide un email" — observa que la respuesta es plausible pero puede usar sintaxis de otro lenguaje si no se le da contexto de Power Fx.
2. Repite la misma petición aclarando explícitamente "en Power Fx, para un control de texto en Canvas Apps" — compara la diferencia de precisión.
3. Pide al modelo que genere una función que use un campo de una tabla de Dataverse que no existe en tu entorno (invéntalo) y observa cómo el modelo no te avisa que el campo es inventado — así se ve una alucinación en la práctica.
4. Documenta en un párrafo la diferencia que observaste entre pedirle algo con contexto específico vs. sin contexto.

### 💼 Casos Reales de Negocio
Un equipo de Servicios Integrados Tecnológicos S.A. (SIT) pidió a un desarrollador junior generar un plugin C# completo con Copilot Chat sin revisar el resultado. El código compiló y pasó el Solution Checker, pero llamaba a una API de Dataverse en modo síncrono dentro de un bucle, generando timeouts en producción con volúmenes reales. La causa no fue el modelo — fue no verificar el resultado contra las buenas prácticas de rendimiento ya conocidas por el equipo antes de este módulo.

### ✅ Buenas Prácticas
- Dar siempre contexto explícito (lenguaje, plataforma, versión) antes de pedir código.
- Tratar toda alucinación como un riesgo esperado, no una excepción rara — verificar nombres de campos, tablas y APIs contra la fuente real.
- Usar el modelo para explorar y acelerar, nunca como sustituto de conocimiento del dominio (Power Platform, Dataverse, C#).

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aceptar código generado sin verificar que las tablas/campos referenciados existen | Confiar en que el modelo "sabe" el esquema real del entorno | Siempre contrastar contra el esquema real de Dataverse antes de aceptar |
| Pedir tareas sin contexto de plataforma | Asumir que el modelo infiere correctamente Power Fx vs JavaScript vs C# | Especificar siempre lenguaje, plataforma y versión en el prompt |
| Tratar la primera respuesta como definitiva | Falta de familiaridad con la naturaleza no determinista del modelo | Iterar el prompt y comparar 2-3 respuestas antes de decidir |

### 🧪 Criterios de Validación
- [ ] Explico la diferencia entre autocompletado, chat y agente con un ejemplo de cada uno
- [ ] Identifico una alucinación de código provocada intencionalmente en la actividad práctica
- [ ] Puedo enumerar 2 riesgos de aceptar código generado sin verificación
