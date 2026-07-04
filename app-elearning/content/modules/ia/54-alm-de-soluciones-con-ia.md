---
moduleId: 54
title: "ALM de Soluciones Power Platform con Apoyo de IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 11
slug: "alm-de-soluciones-con-ia"
---
### 🎯 Objetivo
Aplicar el ciclo de vida de aplicaciones (ALM) de Power Platform — soluciones managed/unmanaged, export/import/pack/unpack, variables de entorno, connection references y pipelines Dev/Test/Prod — usando IA como apoyo para revisar diffs, riesgos y documentación en cada etapa, sin saltarse ninguna validación.

### 📖 Conceptos Clave
- **Solución (solution):** el contenedor que empaqueta todos los componentes de una app (tablas, formularios, flujos, plugins, PCF, etc.) para moverlos entre entornos de forma consistente, en vez de recrear cada componente manualmente en cada entorno.
- **Unmanaged vs. managed:** una solución **unmanaged** es editable directamente (se usa en el entorno de desarrollo, donde los makers trabajan); una solución **managed** es de solo lectura una vez importada (se usa en Test y Production) — intentar editar un componente managed directamente en el entorno destino rompe el modelo de ALM y genera "personalizaciones huérfanas" difíciles de rastrear.
- **Export / Import:** exportar saca la solución del entorno de origen (unmanaged en Dev) como archivo `.zip`; importar la lleva a otro entorno, generalmente como managed en Test/Prod. `pac solution export`/`pac solution import` son los comandos correspondientes.
- **Solution unpack / pack:** `pac solution unpack` descompone el `.zip` de la solución en archivos XML/JSON individuales (uno por componente) aptos para control de versiones en Git, diffs legibles y revisión de código; `pac solution pack` hace el proceso inverso antes de importar.
- **Variables de entorno (environment variables):** valores configurables (URLs, IDs, flags) que cambian entre Dev/Test/Prod sin modificar el componente que los usa — el patrón correcto para evitar hardcodear, por ejemplo, la URL de una API externa distinta por entorno.
- **Connection references:** un componente de solución que representa "una conexión a un conector" (ej. SharePoint, un conector personalizado) sin fijar cuál cuenta o credencial usa — se resuelve por entorno al momento de importar, evitando que un flujo quede atado a la cuenta personal de quien lo desarrolló.
- **Deployment settings:** un archivo JSON que mapea los valores de variables de entorno y connection references específicos de cada entorno destino, usado por `pac solution import` para automatizar ese mapeo sin intervención manual repetitiva.
- **Pipelines Dev → Test → Prod:** la automatización (GitHub Actions o Azure DevOps Build Tools) que ejecuta export → unpack → commit en Dev, y pack → import en Test/Prod, aplicando siempre el mismo orden y las mismas validaciones, sin pasos manuales que dependan de la memoria de una persona.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Sobre un entorno Developer/Sandbox de práctica, identifica una solución unmanaged existente (o crea una mínima con una tabla y un flujo) y expórtala:
   ```bash
   pac solution export --name "SITSolicitudesGastos" --path ./exports/SITSolicitudesGastos.zip --managed false
   ```
2. Desempaqueta la solución exportada para versionarla en Git:
   ```bash
   pac solution unpack --zipfile ./exports/SITSolicitudesGastos.zip --folder ./solutions/SITSolicitudesGastos --packagetype Unmanaged
   ```
3. Inspecciona la carpeta resultante (`Other/Solution.xml`, `Entities/`, `Workflows/`) y pide a un asistente de IA que te resuma qué componentes contiene la solución a partir de `Solution.xml`, sin pegar el archivo completo si es muy extenso — usa fragmentos relevantes.
4. Identifica en el proyecto todas las **connection references** y **variables de entorno** definidas, y documenta cuáles cambiarían de valor entre Dev, Test y Prod (ej. URL de un conector personalizado).
5. Crea (en texto, sin ejecutarlo contra un entorno real de producción) el esqueleto de un archivo `deployment-settings.json` mapeando esas variables para un entorno de Test hipotético.
6. Diseña conceptualmente los 3 pasos mínimos de un pipeline de GitHub Actions para este flujo: `pac solution unpack` (en push a Dev), `pac solution pack` + `pac solution import` (en un job manual o disparado por PR aprobado hacia Test).

### 💼 Casos Reales de Negocio
El equipo de plataforma de SIT importaba soluciones directamente desde el entorno de desarrollo (unmanaged) hacia producción durante casi un año, porque "era más rápido" que configurar el pipeline completo. Un día, un maker modificó por error un formulario directamente en producción pensando que estaba en Test (ambos entornos se veían casi idénticos visualmente), y esa personalización quedó fuera de cualquier control de versiones, perdida en el siguiente despliegue managed. La causa raíz no fue el error puntual del maker, sino la ausencia de una separación managed/unmanaged real entre entornos. El equipo adoptó como estándar: **Dev siempre unmanaged y editable, Test y Prod siempre managed y de solo lectura**, con el pipeline de GitHub Actions como único camino de despliegue.

### ✅ Buenas Prácticas
- Mantener siempre Dev como unmanaged (editable) y Test/Prod como managed (solo lectura) — nunca editar directamente un componente managed en el entorno destino.
- Versionar la solución desempaquetada (`pac solution unpack`) en Git, no el `.zip` binario, para tener diffs legibles y historial real de cambios.
- Externalizar cualquier valor que cambie entre entornos (URLs, IDs, flags) como variable de entorno o connection reference — nunca hardcodear un valor específico de un entorno dentro de un componente.
- Usar IA para resumir diffs grandes de `Solution.xml` o detectar referencias hardcodeadas antes de importar, pero siempre con revisión humana final antes de aprobar el pipeline hacia Test/Prod.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Editar un componente managed directamente en Test/Prod | Confundir el entorno o no tener una política clara de solo-lectura en destino | Establecer Dev=unmanaged, Test/Prod=managed como regla no negociable |
| Versionar el `.zip` de la solución en vez de la carpeta desempaquetada | Omitir `pac solution unpack` antes de hacer commit | Siempre desempaquetar antes de versionar; el `.zip` se genera en el pipeline, no se commitea |
| Hardcodear una URL o ID específico de un entorno dentro de un flujo o conector | No usar variables de entorno ni connection references desde el diseño | Externalizar todo valor variable por entorno desde el primer commit |
| Saltarse el pipeline "porque el cambio es pequeño" | Presión de tiempo | Ningún cambio se importa a Test/Prod fuera del pipeline, sin excepciones (ver Módulo 50) |

### 🧪 Criterios de Validación
- [ ] Exporté una solución unmanaged y la desempaqueté con `pac solution unpack` para versionarla en Git
- [ ] Identifiqué las connection references y variables de entorno de una solución de práctica
- [ ] Diseñé el esqueleto de un `deployment-settings.json` para un entorno de Test
- [ ] Explico por qué Dev debe ser unmanaged y Test/Prod deben ser managed
- [ ] Diseñé los pasos mínimos de un pipeline de GitHub Actions para export/unpack/pack/import
