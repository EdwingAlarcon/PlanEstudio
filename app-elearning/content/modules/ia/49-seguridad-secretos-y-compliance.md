---
moduleId: 49
title: "Seguridad, Secretos y Compliance en IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "seguridad-secretos-y-compliance"
---
### 🎯 Objetivo
Prevenir la fuga de secretos y datos sensibles hacia prompts o logs de herramientas de IA, y aplicar la política de datos del tenant (residencia, GDPR) al usar estas herramientas sobre datos de Dataverse.

### 📖 Conceptos Clave
- **Fuga de secretos a prompts:** pegar una cadena de conexión, una API key o un connection reference completo dentro de un prompt puede quedar almacenado en el historial de la herramienta o en logs del proveedor, según su política de retención — nunca se debe pegar un secreto real en un prompt, ni siquiera "para que el modelo entienda el contexto".
- **Datos sensibles en el contexto:** igual que con secretos, incluir registros reales de clientes (nombres, historiales médicos, datos financieros) como ejemplo en un prompt expone esos datos a un tercero (el proveedor del modelo) — se debe usar siempre datos ficticios o anonimizados equivalentes en estructura.
- **Residencia de datos y GDPR:** algunos modelos procesan el prompt en regiones específicas; si el tenant tiene requisitos de residencia (ej. datos que no pueden salir de la UE), hay que verificar dónde procesa el proveedor de IA antes de usarlo con datos reales, no asumirlo.
- **Políticas de tenant:** el Power Platform Admin Center permite restringir qué conectores y qué IA generativa están disponibles por entorno (DLP policies) — la misma lógica de gobernanza de datos aplicada a conectores aplica a las herramientas de IA.
- **Logs y auditoría:** algunas herramientas registran qué se les pidió y qué devolvieron; esto puede ser deseable para auditoría interna, pero significa que un secreto pegado en un prompt persiste en esos logs también.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. **Prompt inseguro (nunca lo uses así):**
   ```
   Genera el código de conexión a Dataverse usando esta cadena:
   Server=orgabc123.crm.dynamics.com;User ID=admin@sit.onmicrosoft.com;Password=Contraseña Real123!
   ```
   *Problema:* la credencial real queda en el historial de la herramienta y potencialmente en logs del proveedor.
2. **Prompt seguro equivalente (con placeholders):**
   ```
   Genera el código de conexión a Dataverse usando client-credentials OAuth. Usa los placeholders
   {{TENANT_ID}}, {{CLIENT_ID}} y {{CLIENT_SECRET}} — los valores reales viven en Environment
   Variables/Key Vault, nunca en este prompt ni en el código generado.
   ```
   *Resultado esperado:* código con placeholders explícitos, sin ningún valor real. **Evalúa:** ¿el código generado deja claro dónde deben vivir los valores reales (no hardcodeados)?
3. Revisa un prompt real que hayas usado en un módulo anterior de este nivel y verifica si incluye algún dato que en un proyecto real sería sensible (nombre de tabla real con datos de clientes, credencial, URL interna) — reescríbelo con placeholders equivalentes en estructura.
4. Ubica en la documentación de la herramienta de IA que usas (Copilot, Claude, etc.) su política de retención de datos y de qué región procesa las solicitudes.
5. En el Power Platform Admin Center, revisa qué conectores/IA generativa están permitidos en un entorno de ejemplo vía DLP policy y documenta cómo restringirías uno adicional.

### 💼 Casos Reales de Negocio
Un desarrollador de SIT pegó una cadena de conexión completa a una base de datos de staging en un prompt para "que el modelo generara el código de conexión correcto", incluyendo usuario y contraseña reales. La credencial quedó en el historial de la herramienta usada. El incidente se resolvió rotando la credencial de inmediato y estableciendo la regla de equipo: ningún secreto real se pega en un prompt, siempre se usan placeholders (`{{CONNECTION_STRING}}`) y los valores reales viven únicamente en Environment Variables/Key Vault, nunca en texto plano en una conversación con IA.

### ✅ Buenas Prácticas
- Nunca pegar secretos reales (credenciales, connection strings, API keys) en un prompt — usar siempre placeholders.
- Anonimizar o ficcionalizar cualquier dato de ejemplo que se comparta con una herramienta de IA, preservando la estructura pero no el contenido real.
- Verificar la política de residencia y retención de datos del proveedor de IA antes de usarlo con datos reales de un tenant con requisitos de compliance.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Pegar una credencial o connection string real en un prompt | Buscar que el modelo "entienda mejor" el contexto | Usar siempre un placeholder; los valores reales nunca entran a un prompt |
| Compartir datos reales de clientes como ejemplo | No considerar el prompt como un canal de exposición de datos | Anonimizar/ficcionalizar cualquier dato de ejemplo antes de compartirlo |
| Asumir que todos los proveedores de IA cumplen automáticamente la política de residencia del tenant | No verificar la documentación del proveedor | Confirmar explícitamente dónde procesa datos el proveedor antes de usarlo con datos sensibles |

### 🧪 Criterios de Validación
- [ ] Comparo un prompt inseguro (con credencial real) y su versión segura equivalente con placeholders
- [ ] Identifico y corrijo un dato sensible en un prompt propio de un módulo anterior
- [ ] Documento la política de retención/residencia de datos de al menos una herramienta de IA que uso
- [ ] Reviso la configuración DLP de un entorno respecto a conectores/IA generativa
- [ ] Relaciono este módulo con el Lab 91 o cualquier lab de integración/desarrollo donde use placeholders al pedir ayuda de IA sobre credenciales
