# 🧩 Prompts Reutilizables para IA Aplicada a Power Platform y D365

> Colección de 16 prompts prácticos, listos para adaptar, cubriendo las tareas más frecuentes de desarrollo técnico, ALM y consultoría funcional del Nivel IA (módulos 42-55). Cada uno indica su propósito, cuándo usarlo, el texto del prompt (con placeholders, nunca datos reales), advertencias y el resultado esperado.

> ⚠️ **Regla general para todos los prompts de esta página:** reemplaza siempre `{{PLACEHOLDER}}` por datos ficticios equivalentes a los reales (mismo tipo de campo, mismo formato) — nunca pegues nombres de clientes reales, credenciales, tokens, connection strings, ni datos de producción. Ver Módulo 49 (Seguridad, Secretos y Compliance en IA).

---

## 1. Auditar una solución Power Platform

**Propósito:** obtener un resumen rápido de qué componentes contiene una solución exportada y desempaquetada, antes de decidir si está lista para moverse a otro entorno.

**Cuándo usarlo:** después de `pac solution unpack`, antes de aprobar el pipeline hacia Test/Prod (ver Módulo 54, Lab 53).

**Texto del prompt:**
```
Eres un revisor de soluciones de Power Platform. Tengo la carpeta desempaquetada de
una solución con archivos XML/JSON en {{RUTA_CARPETA}}. Analiza el archivo
Solution.xml y resume: (1) qué tablas, flujos, connection references y otros
componentes contiene, (2) qué dependencias existen entre ellos, (3) cualquier
componente que parezca no usado o huérfano. No asumas nada que no esté en el
archivo — si falta información, dilo explícitamente.
```

**Advertencias:** verifica manualmente al menos 2 de los hallazgos contra el archivo real antes de tomar decisiones; la IA puede omitir dependencias indirectas.

**Resultado esperado:** una lista estructurada de componentes y dependencias, con nivel de confianza indicado para cada hallazgo.

---

## 2. Revisar un export de solución (buscar valores hardcodeados)

**Propósito:** detectar URLs, GUIDs o nombres de entorno "quemados" que deberían ser variables de entorno o connection references.

**Cuándo usarlo:** antes de mover una solución de Dev a Test (Módulo 54).

**Texto del prompt:**
```
Revisa estos archivos XML de una solución de Power Platform desempaquetada
({{ARCHIVOS_O_FRAGMENTOS}}) y señala cualquier valor que parezca específico de un
entorno (URLs completas, GUIDs de conexión, nombres de organización) que debería
externalizarse como variable de entorno o connection reference en vez de estar
fijo en el componente. Indica el archivo y la línea aproximada de cada hallazgo.
```

**Advertencias:** no pegues el archivo completo si contiene GUIDs reales de tu tenant productivo; usa un entorno de prueba o sanitiza antes.

**Resultado esperado:** lista de candidatos a variable de entorno/connection reference, con justificación de por qué cada uno debería externalizarse.

---

## 3. Generar documentación funcional

**Propósito:** producir un primer borrador de documentación funcional a partir de una descripción de la solución, para consultoría o entrega al cliente.

**Cuándo usarlo:** durante la etapa de UAT o cierre de proyecto (Módulo 55, Lab 55).

**Texto del prompt:**
```
Actúa como consultor funcional de Dynamics 365. A partir de esta descripción del
proceso de negocio: {{DESCRIPCION_DEL_PROCESO}}, redacta documentación funcional
que incluya: objetivo del proceso, roles involucrados, pasos del flujo end-to-end,
y reglas de negocio aplicadas. Usa lenguaje claro para un usuario de negocio, no
técnico.
```

**Advertencias:** revisa que ningún nombre de cliente o dato real se haya colado en la descripción antes de compartirla.

**Resultado esperado:** documento funcional legible por un usuario de negocio, sin jerga técnica innecesaria.

---

## 4. Generar documentación técnica

**Propósito:** documentar un componente técnico (plugin, flujo, PCF) para que otro desarrollador pueda mantenerlo sin depender de quien lo escribió.

**Cuándo usarlo:** al cerrar un desarrollo, antes del code review final (Módulo 48).

**Texto del prompt:**
```
Genera documentación técnica para este componente: {{CODIGO_O_DESCRIPCION}}.
Incluye: propósito, disparadores/triggers, parámetros de entrada y salida,
dependencias externas, y supuestos o limitaciones conocidas. Formato Markdown.
```

**Advertencias:** verifica que la documentación generada coincida con el comportamiento real del código, no solo con la intención original.

**Resultado esperado:** un archivo Markdown listo para incluir en el repositorio junto al componente.

---

## 5. Crear user stories desde requerimientos

**Propósito:** convertir un requerimiento de negocio informal en historias de usuario accionables para el equipo de desarrollo.

**Cuándo usarlo:** al iniciar la etapa de diseño funcional (Módulo 55).

**Texto del prompt:**
```
A partir de este requerimiento de negocio: "{{REQUERIMIENTO}}", genera de 3 a 5
user stories en formato "Como [rol], quiero [acción], para [beneficio]", cada una
con 2-3 criterios de aceptación verificables. Antes de proponer una tabla o
componente personalizado, evalúa explícitamente si una capacidad estándar de
Dynamics 365/Power Platform ya cubre el caso.
```

**Advertencias:** exige siempre que la IA evalúe la alternativa estándar primero (Módulo 55) — si no se lo pides, tiende a proponer desarrollo a medida directamente.

**Resultado esperado:** user stories con criterios de aceptación y una nota explícita sobre estándar vs. personalizado.

---

## 6. Diseñar matriz de seguridad

**Propósito:** generar un primer borrador de matriz de seguridad (tabla × rol × permisos) para validar el principio de mínimo privilegio.

**Cuándo usarlo:** al definir Security Roles de una solución nueva (Módulo 53, Módulo 55).

**Texto del prompt:**
```
Genera una matriz de seguridad para estos roles: {{ROLES}} sobre estas tablas:
{{TABLAS}}. Para cada combinación rol-tabla, indica los permisos (crear, leer,
escribir, eliminar, anexar) que consideras mínimos necesarios según la
descripción de cada rol: {{DESCRIPCION_DE_ROLES}}. Señala cualquier permiso que
parezca excesivo para el rol descrito.
```

**Advertencias:** revisa siempre que ningún rol reciba permisos de más "por si acaso" — el principio de mínimo privilegio se valida con juicio humano, no solo con la tabla generada.

**Resultado esperado:** tabla rol × tabla × permisos, con advertencias explícitas de sobre-otorgamiento si las detecta.

---

## 7. Preparar UAT (casos de prueba de usuario)

**Propósito:** generar un conjunto de casos de prueba UAT que cubran el caso feliz, casos de error y casos límite.

**Cuándo usarlo:** antes de la etapa de pruebas de usuario, previo al go-live (Módulo 55, Lab 55).

**Texto del prompt:**
```
A partir de este flujo de negocio: {{DESCRIPCION_DEL_FLUJO}}, genera al menos 6
casos de prueba UAT: 1 caso feliz, 1 caso de rechazo/error esperado, y al menos
4 casos límite (valores en cero, duplicados, datos faltantes, permisos
insuficientes). Cada caso debe incluir: pasos, datos de entrada (ficticios),
resultado esperado.
```

**Advertencias:** usa siempre datos de entrada ficticios equivalentes, nunca datos reales de producción o de un cliente real.

**Resultado esperado:** lista de casos UAT ejecutables por un usuario de negocio, con cobertura de casos límite explícita.

---

## 8. Revisar un plugin Dataverse

**Propósito:** obtener una revisión técnica de un plugin C# antes de aprobarlo, enfocada en patrones conocidos de riesgo.

**Cuándo usarlo:** durante code review de un plugin (Módulo 48).

**Texto del prompt:**
```
Revisa este plugin de Dataverse en C#: {{CODIGO_DEL_PLUGIN}}. Evalúa
específicamente: (1) manejo de excepciones y uso correcto de
InvalidPluginExecutionException, (2) llamadas síncronas dentro de bucles que
puedan causar timeouts, (3) uso correcto de ITracingService para logging,
(4) registro de triggers (pre/post, síncrono/asíncrono) apropiado para la lógica.
Señala cualquier violación con la línea aproximada.
```

**Advertencias:** la revisión de IA es un apoyo, no reemplaza el code review humano final ni las pruebas en un entorno real (Módulo 48).

**Resultado esperado:** lista de hallazgos técnicos específicos con ubicación aproximada en el código.

---

## 9. Revisar un PCF Control

**Propósito:** revisar un control PCF (TypeScript/React) por patrones de rendimiento, accesibilidad y manejo de ciclo de vida.

**Cuándo usarlo:** durante code review de un componente PCF (Módulo 44, Módulo 48).

**Texto del prompt:**
```
Revisa este control PCF en TypeScript/React: {{CODIGO_DEL_PCF}}. Evalúa:
(1) uso correcto del ciclo de vida (init, updateView, destroy), (2) manejo
apropiado del contexto (context.parameters) sin mutaciones directas,
(3) accesibilidad básica (atributos ARIA, foco de teclado), (4) posibles
renders innecesarios o fugas de memoria en destroy. Señala cada hallazgo con
ubicación aproximada.
```

**Advertencias:** verifica el comportamiento real en el harness de prueba de PCF antes de aceptar cualquier cambio sugerido.

**Resultado esperado:** hallazgos técnicos priorizados por severidad, con ubicación en el código.

---

## 10. Revisar pipeline ALM

**Propósito:** validar que un pipeline de CI/CD para Power Platform cubra los pasos mínimos recomendados de ALM.

**Cuándo usarlo:** al diseñar o auditar un pipeline de GitHub Actions/Azure DevOps (Módulo 54).

**Texto del prompt:**
```
Revisa este pipeline de CI/CD para Power Platform: {{YAML_DEL_PIPELINE}}.
Confirma si cubre: (1) export/unpack solo desde el entorno Dev, (2) pack/import
como managed hacia Test/Prod, (3) mapeo de variables de entorno y connection
references vía deployment settings, (4) algún paso de validación (lint,
Solution Checker) antes de importar. Señala qué falta si algo no está cubierto.
```

**Advertencias:** un pipeline "completo" en apariencia puede seguir sin gates reales de aprobación humana — verifica que exista ese paso.

**Resultado esperado:** lista de pasos ALM cubiertos vs. faltantes en el pipeline analizado.

---

## 11. Crear checklist de go-live

**Propósito:** generar un checklist de salida a producción que cubra los aspectos técnicos y funcionales mínimos.

**Cuándo usarlo:** antes del despliegue final a producción (Módulo 55, Lab 55).

**Texto del prompt:**
```
Genera un checklist de go-live para este proyecto: {{DESCRIPCION_DEL_PROYECTO}}.
Cubre como mínimo: migración/validación de datos, verificación de Security
Roles asignados, plan de rollback documentado, comunicación a usuarios finales,
y monitoreo post-lanzamiento. Compáralo contra un pipeline de CI/CD estándar y
señala si falta algún gate técnico.
```

**Advertencias:** contrasta siempre el resultado contra los gates técnicos reales ya definidos en tu proyecto (Módulo 50) — un checklist genérico puede omitir controles específicos de tu contexto.

**Resultado esperado:** checklist accionable de go-live, con nota explícita de gates técnicos ausentes si los hay.

---

## 12. Detectar riesgos de sobrepersonalización

**Propósito:** identificar cuándo una propuesta de desarrollo a medida podría resolverse con una capacidad estándar de la plataforma.

**Cuándo usarlo:** en cualquier etapa de diseño funcional o técnico (Módulo 55).

**Texto del prompt:**
```
Evalúa esta propuesta de solución: {{PROPUESTA}}. Antes de aceptarla, responde
explícitamente: ¿existe una tabla, campo o funcionalidad estándar de Dynamics
365/Power Platform que ya resuelva este caso, total o parcialmente? Si existe,
describe la alternativa estándar y compárala en esfuerzo de mantenimiento
contra la propuesta personalizada.
```

**Advertencias:** pide esta evaluación ANTES de que la IA proponga una solución nueva, no después — es más fácil que compare alternativas si se le pide desde el inicio.

**Resultado esperado:** comparación explícita estándar vs. personalizado, con recomendación justificada.

---

## 13. Revisar prompts antes de usarlos con datos reales

**Propósito:** auditar un prompt propio por contenido sensible antes de compartirlo con cualquier asistente de IA.

**Cuándo usarlo:** como paso obligatorio antes de usar datos de un proyecto real en cualquier prompt (Módulo 49).

**Texto del prompt (para auto-revisión, no se envía "a" una IA sobre datos reales — es la checklist que aplicas tú mismo):**
```
Antes de enviar este prompt, verifico:
1. ¿Contiene nombres reales de clientes, empleados o empresas? → Reemplazar por ficticios equivalentes.
2. ¿Contiene credenciales, tokens, connection strings o secretos? → Nunca incluir, usar placeholders.
3. ¿Contiene datos reales de producción (montos, historiales, IDs de registros reales)? → Sustituir por datos de prueba con la misma estructura.
4. ¿Contiene información confidencial no pública del negocio? → Generalizar o eliminar antes de enviar.
```

**Advertencias:** esta auditoría debe hacerse SIEMPRE, no solo cuando "se ve sospechoso" — es fácil que un dato sensible se cuele sin intención.

**Resultado esperado:** un prompt sanitizado, listo para compartir con cualquier herramienta de IA sin riesgo de fuga de datos.

---

## 14. Pedir a Codex/GitHub Copilot Agent Mode cambios controlados en un repo

**Propósito:** delegar una tarea acotada a un agente de código con herramientas, minimizando el riesgo de cambios fuera de alcance.

**Cuándo usarlo:** al usar Codex o Copilot Agent Mode para una tarea concreta (Módulo 45).

**Texto del prompt:**
```
Tarea acotada: {{DESCRIPCION_DE_LA_TAREA}}.
Alcance permitido: modifica únicamente {{ARCHIVOS_O_CARPETA}}. No toques ningún
otro archivo del repositorio.
Criterio de éxito verificable: {{CRITERIO_DE_EXITO}}.
Al terminar, ejecuta {{COMANDO_DE_VERIFICACION, ej. npm run lint && npx tsc --noEmit}}
y muéstrame el resultado antes de considerar la tarea completa.
```

**Advertencias:** revisa siempre el diff completo generado, incluso si el agente reporta que la verificación pasó (Módulo 48).

**Resultado esperado:** un cambio acotado al alcance definido, con la verificación ejecutada y su resultado mostrado explícitamente.

---

## 15. Pedir a Claude auditoría de arquitectura

**Propósito:** obtener una revisión crítica de una decisión o propuesta de arquitectura antes de comprometerse con ella.

**Cuándo usarlo:** al evaluar una decisión de arquitectura significativa (Módulo 55).

**Texto del prompt:**
```
Actúa como arquitecto revisor. Evalúa esta propuesta de arquitectura:
{{PROPUESTA_DE_ARQUITECTURA}}. Contexto del tenant: políticas DLP relevantes son
{{POLITICAS_DLP}}, y el entorno {{ES_O_NO_ES}} un Managed Environment.
Identifica: (1) riesgos de seguridad o gobierno no considerados, (2) alternativas
de integración no evaluadas, (3) impacto en mantenibilidad a largo plazo.
Redacta el resultado como un ADR (contexto, decisión, alternativas, consecuencias).
```

**Advertencias:** la IA no conoce automáticamente las políticas DLP ni la configuración de gobierno de tu tenant — debes proporcionarlas explícitamente (Módulo 55).

**Resultado esperado:** un ADR con riesgos y alternativas identificados, listo para revisión humana final antes de aprobarse.

---

## 16. Pedir a GitHub Copilot ayuda dentro de VS Code

**Propósito:** obtener ayuda contextual y precisa de Copilot dentro del editor, aprovechando el contexto del workspace.

**Cuándo usarlo:** durante desarrollo activo en VS Code sobre componentes del proyecto (Módulo 44).

**Texto del prompt (Copilot Chat, con el archivo relevante abierto):**
```
Contexto: estoy trabajando en {{TIPO_DE_COMPONENTE, ej. un componente PCF /
un plugin C# / un flujo}} de este proyecto. Convención del repo:
{{CONVENCION_RELEVANTE, ej. prefijo de columnas sit_, patrón de logging con
ITracingService}}. Tarea: {{TAREA_CONCRETA}}. Muéstrame el cambio como diff
antes de aplicarlo.
```

**Advertencias:** mantén abierto el archivo de referencia del patrón esperado (o documenta la convención en `.github/copilot-instructions.md`, Módulo 44) para mejorar la precisión del contexto.

**Resultado esperado:** una sugerencia de Copilot alineada con las convenciones del proyecto, presentada como diff revisable antes de aplicarse.
