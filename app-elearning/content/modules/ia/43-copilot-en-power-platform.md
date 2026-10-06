---
moduleId: 43
title: "Copilot en Power Platform"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 14
slug: "copilot-en-power-platform"
lastVerified: "2026-09"
---
### 🎯 Objetivo
Usar las capacidades de Copilot integradas en Power Apps (Canvas, Model-Driven y páginas generativas), Power Automate y Copilot Studio para acelerar la construcción de soluciones, entendiendo qué gobierna cada una en materia de datos y permisos.

### 📖 Conceptos Clave
- **Copilot en Power Apps:** genera una app Canvas a partir de una descripción en lenguaje natural, y puede generar/editar fórmulas Power Fx a partir de una instrucción dentro del editor.
- **Copilot en Power Automate:** genera un flujo (trigger + acciones) a partir de una descripción, o explica qué hace un flujo existente paso a paso.
- **Generative pages (páginas generativas) en Model-Driven Apps:** GA desde el 30 de octubre de 2025. Desde el diseñador de apps (`Add page > Generative page`) describís en lenguaje natural una página completa — vinculada hasta a 6 tablas de Dataverse o, en preview, a datos de un conector de Power Platform — y el agente genera código React con la UI y la lógica de negocio. Es exclusiva de Model-Driven; **no existe para Canvas Apps**. La experiencia en el navegador (make.powerapps.com) nació limitada a Estados Unidos y se fue ampliando por región (Reino Unido, Australia, Singapur, y luego global); si tu entorno no la muestra, confirma la disponibilidad regional antes de asumir que no existe. No consume créditos de IA adicionales para el maker.
- **Autoría de páginas generativas por CLI (recomendada por Microsoft):** en vez del navegador, se puede invocar desde una herramienta de generación de código por IA (GitHub Copilot CLI o **Claude Code**, el mismo agente de este curso) usando el plugin `model-apps` de `power-platform-skills`. Requiere Node.js LTS, Power Platform CLI (PAC CLI) autenticado contra el entorno destino y, si usa conectores, una conexión ya creada. Funciona en cualquier región de la nube pública y permite generar varias páginas y sus tablas de soporte en una sola ejecución.
- **Model app-builder skill:** capacidad distinta y más amplia que una página generativa — construye o edita una **Model-Driven App completa** a partir de una descripción del proceso de negocio: tablas, relaciones, forms, views, charts, business rules, Business Process Flows, sitemap con íconos, reglas de validación en JavaScript, roles de seguridad y datos de muestra, incluyendo páginas generativas para dashboards o flujos guiados donde un form/view estándar no alcanza. Se invoca con `/app-builder` desde la misma herramienta de codegen; primero presenta un spec de la app y un plan dry-run para aprobar, y solo después escribe artefactos en el entorno.
- **Copilot Studio como IA generativa de agentes:** a diferencia de los anteriores (que asisten al maker), Copilot Studio construye agentes conversacionales que el usuario final interactúa directamente — el generative answers usa fuentes de conocimiento (SharePoint, sitios web, Dataverse) para responder.
- **Gobernanza de datos:** cualquier dato que el maker exponga a Copilot para generar una app, página o flujo puede quedar reflejado en la sugerencia generada (ej. nombres de columnas reales de una tabla). Los tenants con datos sensibles deben revisar la configuración de Copilot en el Power Platform Admin Center (a nivel de entorno) antes de habilitarlo ampliamente.
- **Límites de generación:** Copilot en Power Apps/Automate, las páginas generativas y el model app-builder son un punto de partida, no una solución final — generan un primer boceto funcional que casi siempre requiere ajustes de UX, manejo de errores, accesibilidad y performance antes de publicarse a usuarios reales.

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
6. Abre una Model-Driven App existente (la del Módulo 4) en el diseñador, selecciona **Add page > Generative page > Describe a page**, y vincula la tabla de Solicitudes de Mantenimiento con este prompt:
   ```
   Crea un dashboard con las solicitudes agrupadas por estado en columnas tipo Kanban, mostrando
   título, prioridad y fecha requerida en cada tarjeta. Resalta en rojo las solicitudes con
   prioridad Alta que llevan más de 3 días sin cambiar de estado.
   ```
   Revisa la pestaña **Code** del resultado: ¿qué componentes eligió el agente? ¿el **Accessibility assistant** marcó alguna violación y pudiste corregirla con **Auto fix**? Si tu entorno no muestra la opción, documenta la región de tu entorno — la experiencia en navegador nació limitada a Estados Unidos y se fue ampliando por región.
7. Sin necesidad de tenant propio: lee el flujo de `/app-builder` (model app-builder skill) en la documentación oficial y compara sus 6 etapas (describir → revisar spec → revisar plan dry-run → generar → verificar → iterar) contra cómo construiste manualmente tu Model-Driven App en el Módulo 4. *Evalúa:* ¿en qué etapa manual habrías cometido un error que el spec revisable del skill te habría hecho detectar antes?

### 💼 Casos Reales de Negocio
En SIT, un Power Platform Admin activó Copilot en Power Apps para todo el tenant sin revisar antes qué entornos contenían datos de clientes bajo NDA. Un maker generó una app describiendo el proceso de negocio, y la sugerencia de Copilot incluyó nombres reales de columnas de una tabla confidencial visibles en la fórmula generada, expuestos luego en una captura de pantalla compartida externamente. La corrección: habilitar Copilot entorno por entorno, revisando primero el Data Loss Prevention (DLP) policy y la clasificación de datos de cada entorno.

Un consultor de SIT necesitaba un dashboard de seguimiento de inspecciones para técnicos de campo dentro de una Model-Driven App ya existente, con vista tipo tablero por estado — algo que un view/form estándar no resuelve bien. En vez de construir un custom page en Canvas embebido (más tiempo, otro lenguaje de fórmulas), usó una página generativa describiendo el layout en lenguaje natural, iteró tres veces sobre el mismo prompt ajustando columnas y agregando el resaltado por antigüedad, y publicó tras revisar el código generado y pasar el Accessibility assistant. Tiempo total: menos de una hora, contra los 1-2 días estimados para un custom page equivalente. La lección para el equipo: la página generativa reemplaza una Canvas Custom Page o un dashboard complejo cuando la necesidad es visual/no transaccional — no reemplaza forms/views estándar para captura de datos rutinaria, donde el diseñador clásico sigue siendo más predecible.

### ✅ Buenas Prácticas
- Habilitar Copilot por entorno, no por defecto en todo el tenant, revisando la política DLP de cada uno primero.
- Tratar cualquier app/flujo/página generado por Copilot como un primer borrador: siempre revisar manejo de errores, seguridad, accesibilidad y rendimiento antes de publicar.
- Usar Copilot Studio generative answers solo con fuentes de conocimiento ya validadas y con control de acceso correcto.
- Elegir página generativa para experiencias visuales/no transaccionales (dashboards, tableros, resúmenes guiados) y reservar forms/views estándar para captura de datos rutinaria — no forzar todo a lenguaje natural solo porque está disponible.
- Antes de aprobar el plan dry-run del model app-builder skill, verificar que el spec de la app (personas, tablas, roles de seguridad) refleje el proceso real, igual que revisarías un plan de arquitectura antes de construir manualmente.
- Revisar la disponibilidad regional y de conectores (preview) de páginas generativas en tu propio tenant antes de asumir que la función no existe si no aparece en el navegador — la alternativa por CLI funciona worldwide.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Habilitar Copilot en un entorno con datos sensibles sin revisar DLP | Activación por defecto sin evaluación previa | Revisar la política DLP y clasificación de datos del entorno antes de habilitar |
| Publicar en producción una app/flujo/página generada sin revisión | Asumir que el resultado de Copilot ya está listo para producción | Tratar siempre el resultado como borrador: revisar manejo de errores, seguridad y accesibilidad |
| Confundir Copilot Studio (agentes para usuarios finales) con Copilot en Power Apps/Automate (asistente para makers) | Uso indistinto del término "Copilot" en el ecosistema | Distinguir explícitamente el rol: asistente de autor vs agente conversacional |
| Intentar usar una página generativa en una Canvas App | Asumir que la función es transversal a todo Power Apps | Recordar que las páginas generativas son exclusivas de Model-Driven Apps |
| Asumir que "no veo la opción de página generativa" significa que no existe | La experiencia en navegador nació limitada por región (EE.UU. primero, luego ampliada) | Verificar disponibilidad regional del entorno, o usar la ruta por CLI (GitHub Copilot CLI/Claude Code), disponible worldwide |

### 🧪 Criterios de Validación
- [ ] Genero una app Canvas simple usando el prompt completo del paso 1 y documento qué ajustes manuales necesitó
- [ ] Genero un flujo con "Describe it to design it" y explico cada acción propuesta, incluyendo si maneja el caso de campo vacío
- [ ] Ubico y documento la configuración de gobernanza de Copilot en el Admin Center
- [ ] Comparé un prompt vago ("hazme una app de solicitudes") contra uno específico y documenté la diferencia de calidad del resultado
- [ ] Genero una página generativa en una Model-Driven App existente y documento si el Accessibility assistant marcó alguna violación
- [ ] Explico la diferencia entre una página generativa (una página) y el model app-builder skill (una app completa con su modelo de datos)
- [ ] Relaciono este módulo con cualquier lab de Nivel Básico donde pueda usar Copilot para acelerar el primer boceto de una Canvas App, revisando siempre delegación y UX antes de aceptarlo
