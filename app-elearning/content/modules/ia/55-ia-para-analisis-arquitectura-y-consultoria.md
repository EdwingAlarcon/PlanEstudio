---
moduleId: 55
title: "IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 12
slug: "ia-para-analisis-arquitectura-y-consultoria"
---
### 🎯 Objetivo
Usar IA como acelerador en tres roles distintos de un proyecto Power Platform/D365 — desarrollo técnico (plugins, PCF, Custom APIs), consultoría funcional (Dynamics 365 Sales/Customer Service) y arquitectura de solución — manteniendo siempre al humano como responsable de la decisión final.

### 📖 Conceptos Clave
- **IA para análisis de soluciones exportadas:** un asistente de IA puede leer `customizations.xml`/`Solution.xml` desempaquetados y resumir componentes, detectar dependencias entre tablas, o señalar referencias hardcodeadas (ver Módulo 54) — pero no reemplaza que un humano confirme el resultado contra el conocimiento real del proyecto.
- **IA para desarrollo técnico:** aplicable a plugins de Dataverse (C#), Custom APIs, controles PCF (TypeScript/React), Power Fx, custom connectors y Azure Functions integradas vía Web API — el mismo principio del Módulo 45 (tarea acotada + revisión humana) aplica sin importar el lenguaje o componente.
- **IA para consultoría funcional D365:** convertir requerimientos de negocio en user stories, proponer configuración de Dynamics 365 Sales/Customer Service (no código), distinguir qué se resuelve con tablas/campos estándar vs. cuándo se justifica una tabla personalizada, y generar artefactos de consultoría (matriz de seguridad, casos UAT, checklist de go-live).
- **Sobrepersonalización (over-customization):** el riesgo de resolver con desarrollo a medida algo que la plataforma ya ofrece de forma estándar, aumentando el costo de mantenimiento y las actualizaciones futuras — un asistente de IA, si no se le pide explícitamente que evalúe alternativas estándar primero, tiende a proponer directamente una solución custom porque es el patrón más común en sus datos de entrenamiento.
- **Arquitectura de solución con IA:** usar IA para explorar decisiones de diseño end-to-end (integración, seguridad, ALM, gobierno), documentarlas como ADRs (Architecture Decision Records), y contrastar propuestas contra los pilares de Well-Architected — sin delegarle la decisión final, que sigue siendo del arquitecto humano responsable ante el cliente.
- **Managed Environments, DLP y CoE:** el marco de gobierno de Power Platform (Data Loss Prevention policies, Managed Environments, Center of Excellence starter kit) que cualquier propuesta de arquitectura generada con IA debe respetar — un asistente de IA no conoce automáticamente las políticas DLP configuradas en tu tenant, hay que dárselas como contexto explícito.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. **Análisis técnico:** toma la carpeta de solución desempaquetada del Módulo 54 y pide a un asistente de IA que identifique todas las dependencias entre tablas (relaciones 1:N, N:N) a partir de los archivos XML — verifica manualmente al menos 2 de esas dependencias contra el modelo real.
2. **Desarrollo técnico:** pide a Copilot o Claude Code que genere el esqueleto de un Custom API de Dataverse (nombre, parámetros de entrada/salida, tipo de plugin asociado) para un caso simple ("calcular el descuento de una cotización"), y revisa el resultado con la checklist del Módulo 48 antes de aceptarlo.
3. **Consultoría funcional:** toma un requerimiento de negocio en una frase (ej. "el equipo de ventas necesita registrar visitas a clientes con ubicación y notas") y pide a un asistente que proponga: (a) si se resuelve con una tabla estándar de D365 Sales o requiere una tabla personalizada, y (b) una user story en formato "Como [rol], quiero [acción], para [beneficio]".
4. **Matriz de seguridad:** pide a la IA que genere una matriz de seguridad básica (tabla × rol × permiso: crear/leer/escribir/eliminar) para 2 roles (Vendedor, Gerente de Ventas) sobre la tabla de Oportunidades — revisa si el resultado respeta el principio de mínimo privilegio del Módulo 53.
5. **Arquitectura:** pide a la IA que redacte un ADR corto (contexto, decisión, alternativas consideradas, consecuencias) sobre una decisión real de tu proyecto (ej. "¿integración vía Power Automate o vía Azure Function?"), dándole como contexto explícito las políticas DLP y restricciones de tu tenant.
6. Para cada uno de los 5 pasos anteriores, anota explícitamente si la IA propuso sobrepersonalización (una solución custom donde existía una alternativa estándar) y corrige la propuesta si es necesario.

### 💼 Casos Reales de Negocio
Un consultor funcional de SIT le pidió a un asistente de IA "diseña cómo registrar las visitas de los vendedores a clientes" sin darle contexto de que Dynamics 365 Sales ya incluye la entidad estándar de citas/actividades. La IA propuso crear una tabla personalizada completa con relaciones, vistas y un formulario custom — una solución funcional, pero que duplicaba capacidades ya existentes y aumentaba el costo de mantenimiento futuro (actualizaciones de la tabla estándar no se heredarían). Al revisar la propuesta con la pregunta explícita "¿existe una alternativa estándar de D365 antes de crear algo custom?", el equipo identificó que las actividades estándar cubrían el 90% del caso, y solo se necesitó un campo personalizado adicional. La lección: **siempre pedirle a la IA que evalúe primero la alternativa estándar antes de proponer desarrollo a medida**.

### ✅ Buenas Prácticas
- Pedir explícitamente a la IA que evalúe alternativas estándar de la plataforma antes de proponer una solución personalizada, para reducir el riesgo de sobrepersonalización.
- Dar como contexto las políticas DLP, Managed Environments y restricciones de gobierno del tenant real antes de pedir una propuesta de arquitectura — la IA no las conoce por defecto.
- Usar IA para acelerar artefactos de consultoría (user stories, matriz de seguridad, casos UAT, ADRs) pero mantener siempre la revisión y aprobación humana antes de entregarlos al cliente.
- Verificar manualmente al menos una muestra de cualquier análisis de dependencias o relaciones que la IA genere sobre una solución real, antes de tomar decisiones basadas en ese análisis.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aceptar una solución personalizada sin evaluar la alternativa estándar de D365 | No pedirle explícitamente a la IA que compare contra capacidades estándar | Preguntar siempre "¿existe una alternativa estándar antes de esto?" antes de aceptar una propuesta custom |
| Pedir una propuesta de arquitectura sin dar contexto de las políticas DLP/gobierno reales del tenant | Asumir que la IA conoce las restricciones del proyecto | Incluir explícitamente las políticas y restricciones relevantes en el prompt |
| Entregar al cliente un artefacto de consultoría (UAT, matriz de seguridad) generado por IA sin revisión | Confiar en que el resultado generado ya está listo para entrega | Revisar y ajustar todo artefacto de consultoría antes de compartirlo con el cliente |
| Confiar en un análisis de dependencias de la IA sin verificación manual | Tratar el resumen generado como fuente de verdad absoluta | Verificar manualmente al menos una muestra representativa del análisis |

### 🧪 Criterios de Validación
- [ ] Uso IA para identificar dependencias entre tablas de una solución y verifico manualmente el resultado
- [ ] Genero el esqueleto de un Custom API con IA y lo reviso con la checklist del Módulo 48
- [ ] Convierto un requerimiento de negocio en una user story y evalúo tabla estándar vs. personalizada
- [ ] Genero una matriz de seguridad básica y verifico que respeta el mínimo privilegio
- [ ] Redacto un ADR con IA dando contexto explícito de las políticas de gobierno del tenant
- [ ] Identifico al menos un caso de sobrepersonalización propuesto por la IA y lo corrijo
