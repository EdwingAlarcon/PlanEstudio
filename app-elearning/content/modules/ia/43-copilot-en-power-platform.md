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
1. En Power Apps Studio, usa "Crear con Copilot" describiendo una app simple de seguimiento de solicitudes (título, estado, fecha) y observa qué estructura de datos propone.
2. Pide a Copilot dentro del editor de fórmulas que genere una fórmula Power Fx para filtrar una galería por el estado "Pendiente" y compárala con cómo la escribirías manualmente.
3. En Power Automate, crea un flujo nuevo usando "Describe it to design it" pidiendo "cuando se cree un registro en una tabla, enviar un correo al responsable" y revisa las acciones que propuso.
4. En el Power Platform Admin Center, ubica la configuración de Copilot a nivel de entorno y documenta qué opciones de gobernanza de datos existen.

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
- [ ] Genero una app Canvas simple usando Copilot y documento qué ajustes manuales necesitó
- [ ] Genero un flujo con "Describe it to design it" y explico cada acción propuesta
- [ ] Ubico y documento la configuración de gobernanza de Copilot en el Admin Center
