---
moduleId: 43
title: "Copilot en Power Platform"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "copilot-en-power-platform"
---
### 🎯 Objetivo
Usar las capacidades de Copilot integradas en Power Apps, Power Automate y Copilot Studio para acelerar la construcción de soluciones, entendiendo qué gobierna cada una en materia de datos y permisos.

### 📖 Conceptos Clave
- **Copilot en Power Apps:** genera una app Canvas a partir de una descripción en lenguaje natural, y puede generar/editar fórmulas Power Fx a partir de una instrucción dentro del editor.
- **Copilot en Power Automate:** genera un flujo (trigger + acciones) a partir de una descripción, o explica qué hace un flujo existente paso a paso.
- **Copilot Studio como IA generativa de agentes:** a diferencia de los dos anteriores (que asisten al maker), Copilot Studio construye agentes conversacionales que el usuario final interactúa directamente — el generative answers usa fuentes de conocimiento (SharePoint, sitios web, Dataverse) para responder.
- **Gobernanza de datos:** cualquier dato que el maker exponga a Copilot para generar una app o flujo puede quedar reflejado en la sugerencia generada (ej. nombres de columnas reales de una tabla). Los tenants con datos sensibles deben revisar la configuración de Copilot en el Power Platform Admin Center (a nivel de entorno) antes de habilitarlo ampliamente.
- **Límites de generación:** Copilot en Power Apps/Automate es un punto de partida, no una solución final — genera un primer boceto funcional que casi siempre requiere ajustes de UX, manejo de errores y performance.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. En Power Apps Studio, usa "Crear con Copilot" con este prompt completo y observa qué estructura de datos propone:
   ```
   Crea una app para dar seguimiento a solicitudes de mantenimiento de activos, con título, estado
   (Nueva/En proceso/Cerrada), prioridad y fecha requerida.
   ```
   *Evalúa:* ¿las columnas propuestas tienen el tipo de dato correcto (Choice para estado/prioridad, no texto libre)? ¿la app generada delega correctamente sobre Dataverse (Módulo 7) o solo "se ve bien" con pocos registros?
2. Pide a Copilot dentro del editor de fórmulas: `Filtra esta galería para mostrar solo los registros donde Estado sea "Pendiente"` y compara la fórmula generada con cómo la escribirías manualmente usando `Filter()`.
3. En Power Automate, crea un flujo nuevo usando "Describe it to design it" con este prompt:
   ```
   Cuando se cree un registro en la tabla Solicitudes de Mantenimiento, envía un correo al usuario del
   campo "Asignado a" con el título y la prioridad de la solicitud.
   ```
   Revisa las acciones que propuso: ¿usó el trigger correcto (`When a row is added`)? ¿el correo generado incluye manejo de error si "Asignado a" está vacío?
4. En el Power Platform Admin Center, ubica la configuración de Copilot a nivel de entorno y documenta qué opciones de gobernanza de datos existen.
5. **Ejemplo de mejora iterativa:** prompt inicial débil `"hazme una app de solicitudes"` (sin campos, sin estados) → problema: Copilot inventa una estructura genérica que no calza con tu proceso real → prompt mejorado: el del paso 1, con campos y valores de choice explícitos → resultado mejorado: estructura de datos alineada al proceso real desde el primer intento.

### 💼 Casos Reales de Negocio
En SIT, un Power Platform Admin activó Copilot en Power Apps para todo el tenant sin revisar antes qué entornos contenían datos de clientes bajo NDA. Un maker generó una app describiendo el proceso de negocio, y la sugerencia de Copilot incluyó nombres reales de columnas de una tabla confidencial visibles en la fórmula generada, expuestos luego en una captura de pantalla compartida externamente. La corrección: habilitar Copilot entorno por entorno, revisando primero el Data Loss Prevention (DLP) policy y la clasificación de datos de cada entorno.

### ✅ Buenas Prácticas
- Habilitar Copilot por entorno, no por defecto en todo el tenant, revisando la política DLP de cada uno primero.
- Tratar cualquier app/flujo generado por Copilot como un primer borrador: siempre revisar manejo de errores, seguridad y rendimiento antes de publicar.
- Usar Copilot Studio generative answers solo con fuentes de conocimiento ya validadas y con control de acceso correcto.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Habilitar Copilot en un entorno con datos sensibles sin revisar DLP | Activación por defecto sin evaluación previa | Revisar la política DLP y clasificación de datos del entorno antes de habilitar |
| Publicar en producción una app/flujo generado sin revisión | Asumir que el resultado de Copilot ya está listo para producción | Tratar siempre el resultado como borrador: revisar manejo de errores y seguridad |
| Confundir Copilot Studio (agentes para usuarios finales) con Copilot en Power Apps/Automate (asistente para makers) | Uso indistinto del término "Copilot" en el ecosistema | Distinguir explícitamente el rol: asistente de autor vs agente conversacional |

### 🧪 Criterios de Validación
- [ ] Genero una app Canvas simple usando el prompt completo del paso 1 y documento qué ajustes manuales necesitó
- [ ] Genero un flujo con "Describe it to design it" y explico cada acción propuesta, incluyendo si maneja el caso de campo vacío
- [ ] Ubico y documento la configuración de gobernanza de Copilot en el Admin Center
- [ ] Comparé un prompt vago ("hazme una app de solicitudes") contra uno específico y documenté la diferencia de calidad del resultado
- [ ] Relaciono este módulo con cualquier lab de Nivel Básico donde pueda usar Copilot para acelerar el primer boceto de una Canvas App, revisando siempre delegación y UX antes de aceptarlo
