---
moduleId: 48
title: "Revisión de Diffs y Pull Requests"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "revision-de-diffs-y-prs"
---
### 🎯 Objetivo
Revisar con criterio un diff generado por IA — propio o de un compañero — identificando alcance, efectos secundarios y riesgos de seguridad antes de aprobarlo, con o sin apoyo de un revisor automático.

### 📖 Conceptos Clave
- **Alcance del diff:** lo primero a verificar es si el diff toca solo lo que la tarea pedía — un cambio "para arreglar el formulario X" que también modifica un archivo de configuración no relacionado es una señal de alarma, generado por IA o no.
- **Efectos secundarios:** un cambio generado por IA puede resolver el síntoma pedido introduciendo un problema distinto (ej. quitar una validación para que "funcione" en lugar de corregir la causa) — revisar no solo si el cambio funciona, sino qué más pudo romper.
- **Seguridad en el diff:** prestar atención específica a: credenciales o secretos hardcodeados, nuevas dependencias no revisadas, y cambios en Security Roles o permisos de Dataverse.
- **Revisores automáticos/agentes de revisión:** herramientas que resumen un PR o señalan patrones sospechosos (ej. GitHub Copilot code review, agentes configurados para lint/seguridad) — son un apoyo, no un reemplazo del juicio humano; solo aceleran encontrar dónde mirar con más atención.
- **Checklist de revisión repetible:** tener una lista corta y consistente (alcance, efectos secundarios, seguridad, tests) evita que la revisión dependa del estado de ánimo o el tiempo disponible del revisor ese día.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Toma un diff generado por un agente de código en una tarea anterior de este nivel (Módulo 44 o 45) y revísalo con esta checklist: ¿toca solo lo pedido?, ¿tiene efectos secundarios?, ¿introduce algún secreto o permiso nuevo?, ¿tiene test que lo valide?
2. Genera intencionalmente un diff con un cambio fuera de alcance (pide a un agente "arregla el bug X" sin acotar el archivo) y practica identificar qué parte del diff no correspondía a la tarea.
3. Si tienes acceso a un revisor automático de PRs (ej. Copilot code review en GitHub), actívalo en un PR de prueba y compara sus observaciones contra tu propia revisión manual.
4. Escribe la checklist de revisión que usarás de forma consistente en tus propios PRs de aquí en adelante.

### 💼 Casos Reales de Negocio
Un PR generado con ayuda de un agente en SIT resolvía correctamente el bug reportado (un cálculo incorrecto en un flujo), pero también eliminaba una validación de rango que existía por una razón de negocio no documentada en el código. El revisor humano aprobó el PR porque el bug reportado sí se resolvió y no notó la validación eliminada al no comparar el diff completo contra la intención original de cada línea. La regla adoptada: todo diff se revisa línea por línea contra "¿por qué cambió esto?", no solo contra "¿se resolvió el síntoma reportado?".

### ✅ Buenas Prácticas
- Revisar el diff completo, no solo el resultado final — cada línea eliminada o modificada debe tener una razón clara ligada a la tarea.
- Usar una checklist corta y consistente (alcance, efectos secundarios, seguridad, tests) en cada revisión, generado por IA o no.
- Tratar los revisores automáticos como un apoyo que acelera dónde mirar, nunca como la aprobación final.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aprobar un PR porque "el bug reportado se resolvió" sin revisar el resto del diff | Enfocarse solo en el síntoma, no en el diff completo | Revisar cada línea cambiada contra su propia justificación, no solo el resultado final |
| Confiar en el resumen de un revisor automático sin leer el diff | Delegar por completo el juicio de revisión a la herramienta | Usar el revisor automático como guía de dónde mirar, no como aprobación |
| No tener una checklist consistente de revisión | Revisar "a ojo" según el tiempo disponible ese día | Definir y aplicar siempre la misma checklist corta |

### 🧪 Criterios de Validación
- [ ] Reviso un diff real usando la checklist de alcance/efectos secundarios/seguridad/tests
- [ ] Identifico un cambio fuera de alcance en un diff generado intencionalmente con ese defecto
- [ ] Documento mi propia checklist de revisión de PRs
