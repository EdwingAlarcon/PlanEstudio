---
moduleId: 53
title: "Dataverse Web API, Dynamics 365 y Autenticación"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 10
slug: "dataverse-web-api-y-autenticacion"
---
### 🎯 Objetivo
Entender cómo se conecta una aplicación o script externo a Dataverse/Dynamics 365 mediante la Web API, qué mecanismo de autenticación usa (OAuth vía Microsoft Entra ID), y cómo diagnosticar los errores de permisos más comunes — todo esto como contexto indispensable antes de pedirle a un asistente de IA que genere código de integración.

### 📖 Conceptos Clave
- **Dynamics 365 sobre Dataverse:** las aplicaciones de primera parte (Sales, Customer Service, Field Service, Project Operations) son, técnicamente, soluciones de Power Platform construidas sobre las mismas tablas de Dataverse a las que accede cualquier Canvas App, plugin o integración externa — no hay una "API distinta" para D365 y otra para Power Apps.
- **Dataverse Web API:** una API REST estándar (OData v4) expuesta en `https://<organización>.crm.dynamics.com/api/data/v9.2/` que permite crear, leer, actualizar y eliminar registros de cualquier tabla mediante peticiones HTTP normales (GET, POST, PATCH, DELETE).
- **Microsoft Entra ID (antes Azure AD):** el proveedor de identidad que emite los tokens de acceso (OAuth 2.0) que la Web API exige en cada petición mediante el header `Authorization: Bearer <token>`. Sin un token válido emitido por el tenant correcto, cualquier llamada devuelve error.
- **App registration:** el "registro" de una aplicación dentro de Microsoft Entra ID que le da una identidad propia (`Application (client) ID`) para poder solicitar tokens, independiente de cualquier usuario humano. Es el primer paso obligatorio para cualquier integración o script que no use un login interactivo de usuario.
- **Application user:** un usuario especial dentro de Dataverse (no un empleado real) que se vincula a una app registration y le da permisos concretos sobre las tablas, mediante un Security Role, igual que a un usuario humano. Sin este vínculo, la app registration puede autenticarse contra Entra ID pero Dataverse la rechazará por no tener un usuario asociado.
- **Service principal:** el término genérico para "una identidad no humana" (la combinación de app registration + credencial) que se autentica para actuar en nombre de una aplicación, no de una persona — es el mecanismo recomendado para integraciones automatizadas, pipelines de ALM y scripts.
- **Client secret vs. certificado:** dos formas de que un service principal demuestre su identidad. Un **client secret** es una contraseña generada por Entra ID con fecha de expiración; un **certificado** es un par de llaves criptográficas más seguro y sin necesidad de rotación frecuente de un valor en texto plano. Para integraciones de producción de largo plazo, un certificado es preferible; para scripts de corta duración o pruebas, un client secret bien gestionado es aceptable.
- **Permisos mínimos:** el Security Role asignado al Application User debe otorgar solo el acceso estrictamente necesario (ej. lectura/escritura sobre 2-3 tablas específicas), nunca el rol de System Administrator "para que funcione más rápido".

### 👨‍💻 Actividades Prácticas Paso a Paso
1. En el [Azure Portal](https://portal.azure.com) (o Microsoft Entra admin center), registra conceptualmente una nueva app registration: anota qué nombre le darías y qué tipo de cuenta soportada elegirías ("solo este directorio organizacional" para integraciones internas).
2. Documenta, sin crear nada real todavía, los 3 datos que necesitarás después: **Application (client) ID**, **Directory (tenant) ID**, y el tipo de credencial elegida (client secret o certificado).
3. En un entorno Dataverse de prueba (Developer/Sandbox), ubica dónde se crea un **Application User** (Configuración avanzada → Seguridad → Usuarios de la aplicación) y qué Security Role le asignarías para un escenario de "leer y actualizar solicitudes de gasto" (no System Administrator).
4. Escribe (sin ejecutar contra un tenant real todavía) la estructura conceptual de una petición HTTP a la Web API para leer registros, identificando sus 3 partes: URL del endpoint, header de autorización, y header `OData-MaxVersion`/`Accept`:
   ```http
   GET https://<organización>.crm.dynamics.com/api/data/v9.2/accounts?$select=name,revenue&$top=5
   Authorization: Bearer <token>
   OData-MaxVersion: 4.0
   Accept: application/json
   ```
5. Prompt completo para pedir el flujo de autenticación con placeholders (nunca con valores reales):
   ```
   Rol: explicas autenticación OAuth 2.0 client-credentials para Dataverse Web API.
   Contexto: tengo una app registration con Application (client) ID {{CLIENT_ID}}, Directory (tenant) ID
   {{TENANT_ID}} y un client secret {{CLIENT_SECRET}} (todos placeholders, no valores reales).
   Tarea: muéstrame la petición HTTP completa para obtener un token, y luego cómo usarlo en el header
   Authorization de una llamada GET a la Web API.
   Restricción: usa siempre los placeholders tal cual, nunca inventes un ID o secret de ejemplo que
   parezca real.
   ```
   *Resultado esperado:* una petición POST al endpoint de token de Entra ID con los placeholders, seguida de un GET de ejemplo con `Authorization: Bearer {{TOKEN}}`. **Evalúa:** ¿la explicación usó siempre los placeholders literales o inventó valores que parecen reales (un riesgo si luego los copias sin darte cuenta)?
6. Documenta en una tabla los 2 errores de autenticación más comunes que vas a encontrar (`401` y `403`) y su causa típica, usando la tabla de Errores Comunes de este módulo como referencia.

### 💼 Casos Reales de Negocio
Un desarrollador de SIT integró un sistema de facturación externo con Dataverse usando un Application User al que, por rapidez, le asignaron el Security Role de System Administrator "para no tener que depurar permisos". Meses después, un bug en el sistema externo generó una actualización masiva accidental sobre tablas que no debía tocar (contactos y oportunidades, no solo facturas), porque el service principal tenía acceso a todo el entorno. La corrección fue crear un Security Role específico con acceso de lectura/escritura únicamente a las 2 tablas que la integración realmente necesitaba, aplicando el principio de permisos mínimos que debió aplicarse desde el diseño inicial.

### ✅ Buenas Prácticas
- Usar siempre un service principal (app registration + Application User) para integraciones automatizadas, nunca las credenciales de un usuario humano real.
- Asignar al Application User el Security Role más restrictivo posible que cumpla el caso de uso — nunca System Administrator por defecto.
- Preferir certificados sobre client secrets para integraciones de producción de largo plazo; si se usa client secret, rotarlo periódicamente y nunca hardcodearlo en el código.
- Documentar siempre con placeholders (`{{CLIENT_ID}}`, `{{TENANT_ID}}`) al pedir ayuda a un asistente de IA sobre autenticación — nunca pegar IDs, secrets ni tokens reales en un prompt.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| `401 Unauthorized` | El token no se generó, expiró, o se solicitó contra el tenant/audience incorrecto | Verificar que el token se solicite contra el `Directory (tenant) ID` correcto y no haya expirado |
| `403 Forbidden` | El token es válido pero el Application User no tiene Security Role o no tiene permiso sobre la tabla/operación solicitada | Revisar el Security Role asignado al Application User y sus privilegios sobre la tabla específica |
| Conectar al tenant incorrecto | Copiar/pegar un `tenant ID` de otro cliente o entorno por error | Validar siempre `tenant ID` y URL del entorno antes de generar el token, igual que con `pac org who` |
| Asignar System Administrator "para que funcione" | Evitar depurar permisos específicos | Definir el Security Role mínimo necesario desde el diseño, antes de la primera prueba |

### 🧪 Criterios de Validación
- [ ] Explico la diferencia entre app registration, service principal y Application User
- [ ] Identifico qué Security Role asignaría a una integración de solo lectura/escritura sobre 2 tablas específicas
- [ ] Distingo cuándo usar client secret vs. certificado para una integración
- [ ] Diagnostico correctamente si un error 401 o 403 es de autenticación o de autorización
- [ ] Uso el prompt de autenticación con placeholders y confirmo que la IA no inventó valores que parezcan reales
- [ ] Relaciono este módulo con el Lab 54 (conectar app externa a Dataverse) y el Lab 91 (Custom API)
