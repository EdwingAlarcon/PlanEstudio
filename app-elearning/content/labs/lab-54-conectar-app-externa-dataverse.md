---
id: lab-54
title: "Conceptos de Conexión de una App Externa a Dataverse Web API"
level: "N5"
duration: 80
product: ["Microsoft Entra ID", "Dataverse Web API", "OAuth 2.0"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect"]
prerequisites:
  - "Módulo 53 estudiado: Dataverse Web API, Dynamics 365 y Autenticación"
  - "Acceso a tu ambiente del curso u otro entorno de práctica (Trial, Developer o Sandbox) y, si es posible, permisos para ver (no necesariamente crear) app registrations en Microsoft Entra ID"
files: []
lastVerified: "2026-11"
---

# Lab 54 — Conceptos de Conexión de una App Externa a Dataverse Web API

## Objetivo

Al finalizar este laboratorio comprenderás y podrás explicar el flujo completo de autenticación OAuth de una aplicación externa contra Dataverse Web API — app registration, Application User, Security Role y obtención de token — y sabrás diagnosticar los errores 401/403 más comunes. Este laboratorio es conceptual y documental: en ningún momento se pegan credenciales, secrets ni tokens reales.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Developer, Solution Architect.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** SIT necesita conectar un sistema de facturación externo a Dataverse para leer y actualizar el estado de solicitudes de gasto. El equipo debe documentar y diseñar el flujo de autenticación completo antes de que el equipo de Infraestructura cree la app registration real.

**Por qué es una buena tarea para practicar:** obliga a razonar sobre permisos mínimos y seguridad antes de escribir una sola línea de código de integración.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Diseñar la app registration necesaria (documental) | 20 min |
| Ejercicio 2 — Diseñar el Application User y su Security Role mínimo | 20 min |
| Ejercicio 3 — Documentar el flujo de obtención de token con placeholders | 20 min |
| Ejercicio 4 — Diagnosticar 2 escenarios de error simulados | 20 min |
| **Total** | **80 min** |

## Tecnologías utilizadas

- Microsoft Entra ID (conceptual, sin crear recursos reales si no tienes permisos de administrador)
- Dataverse Web API
- OAuth 2.0 (client credentials flow)

## Ejercicio 1 — Diseñar la app registration (documental)

Documenta, sin crear nada en un tenant real si no tienes los permisos adecuados. Como referencia, quien la cree lo hará en el [Microsoft Entra admin center](https://entra.microsoft.com), en **Entra ID** > **App registrations** > **New registration**, con al menos el rol **Application Developer** ([Learn: register an app](https://learn.microsoft.com/entra/identity-platform/quickstart-register-app)):
1. Nombre propuesto para la app registration (ej. `SIT-Integracion-Facturacion`).
2. Tipo de cuenta soportada: la opción de un solo tenant, que Learn muestra como **Single tenant only - <your tenant>** y recomienda para la mayoría de las aplicaciones.
3. Tipo de credencial elegida y por qué, considerando que es una integración de producción de largo plazo. Learn indica que el client secret no debe usarse en producción (solo para desarrollo local y pruebas; dura como máximo 24 meses y se recomienda menos de 12) y que Microsoft recomienda un certificado o una credencial federada ([Learn: add credentials](https://learn.microsoft.com/entra/identity-platform/how-to-add-credentials)). Anota también dónde se guardaría la credencial y quién la renueva antes de que venza.

## Ejercicio 2 — Diseñar el Application User y Security Role

Como referencia: el Application User se crea en el [Power Platform admin center](https://admin.powerplatform.microsoft.com), en **Manage** > **Environments** > el ambiente > **Settings** > **Users + permissions** > **Application users** > **+ New app user**; el panel pide la app (**+ Add an app**), **Business Unit**, un **Email address** y los security roles. Learn indica que no consume una licencia de pago y que en un ambiente solo puede haber un application user por app registration ([Learn: manage application users](https://learn.microsoft.com/power-platform/admin/manage-application-users)).

Documenta:
1. Qué tabla(s) necesita leer/escribir la integración (ej. solo la tabla de solicitudes de gasto).
2. Qué privilegios exactos necesita el Security Role (crear, leer, escribir — probablemente NO eliminar ni acceso a otras tablas). El rol es uno personalizado, creado antes que el usuario ([Learn: create a custom security role](https://learn.microsoft.com/power-platform/admin/database-security#create-or-configure-a-custom-security-role)).
3. Por qué NO se debe usar el rol de System Administrator para este Application User.
4. Business unit y cómo se desactivaría la integración sin borrar nada (Learn: **Deactivate** en la página **Application users**).

## Ejercicio 3 — Documentar el flujo de token (con placeholders)

Escribe la estructura conceptual de la petición de token client-credentials y de la llamada a la Web API, usando SIEMPRE placeholders:

```http
POST https://login.microsoftonline.com/{{TENANT_ID}}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={{CLIENT_ID}}
&client_secret={{CLIENT_SECRET}}
&scope=https://{{ORG}}.crm.dynamics.com/.default
```

```http
GET https://{{ORG}}.crm.dynamics.com/api/data/v9.2/sit_solicitudesgastoes?$select=sit_estado,sit_monto
Authorization: Bearer {{ACCESS_TOKEN}}
OData-MaxVersion: 4.0
OData-Version: 4.0
Accept: application/json
If-None-Match: null
```

`sit_solicitudesgastoes`, `sit_estado` y `sit_monto` son ejemplos: el recurso es el **EntitySet** de tu tabla, que no siempre es el plural que imaginas, y las columnas son nombres lógicos en minúsculas. Confírmalos como en la Microlección 1 del Módulo 53: el EntitySet con **Ctrl+F** en el service document (tu Web API endpoint abierto en el navegador) y las columnas con `?$top=1`. `{{ORG}}` es la parte inicial de tu Web API endpoint, que copias en Power Apps en **Settings** > **Developer resources** (puede verse como `<org>.api.crm.dynamics.com`; usa la misma forma en el `scope` y en la URL).

Pide a un asistente de IA que revise esta estructura y diga si falta algún header obligatorio. No te quedes con su respuesta: contrástala con la lista de [Learn: Compose HTTP requests](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/compose-http-requests-handle-errors) (`Accept`, `OData-MaxVersion`, `OData-Version`, `If-None-Match`, y `Content-Type` solo si hay cuerpo JSON) y verifica que su respuesta tampoco introduzca valores reales de ejemplo.

## Ejercicio 4 — Diagnosticar errores simulados

Para cada uno de estos 2 escenarios, documenta la causa más probable y cómo la verificarías:
1. La integración recibe `401 Unauthorized` en la llamada a la Web API.
2. La integración recibe `403 Forbidden` en la llamada a la Web API, pero el token se generó correctamente.

Apóyate en la tabla de códigos de [Learn: Compose HTTP requests](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/compose-http-requests-handle-errors), que agrupa los errores de token (por ejemplo `ExpiredAuthTicket`, `InvalidAuthTicket`) en 401 y los de privilegios (por ejemplo `PrivilegeDenied`) en 403. Para el 401, revisa primero el `scope` de la petición de token y el tenant ID; para el 403, el Security Role del Application User.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Diseñar el Security Role con acceso a todas las tablas "por si acaso" | No aplicar el principio de mínimo privilegio desde el diseño | Limitar el rol exactamente a las tablas y operaciones que la integración necesita |
| Pegar un ejemplo de client secret real al pedir ayuda a la IA | No sanitizar el prompt antes de compartirlo | Usar siempre placeholders (`{{CLIENT_SECRET}}`) en cualquier ejemplo compartido con IA |
| Confundir un error 401 con uno 403 | No distinguir autenticación (¿quién eres?) de autorización (¿qué puedes hacer?) | Repasar la tabla de errores del Módulo 53 antes de diagnosticar |
| Elegir client secret para la integración de producción | Learn lo reserva para desarrollo local y pruebas | Certificado o credencial federada, con fecha de expiración y proceso de renovación documentados desde el diseño |
| Pedir el token con `scope=https://graph.microsoft.com/.default` | Confundir Microsoft Graph con Dataverse | El scope de un cliente confidencial es `<URL del ambiente>/.default` ([Learn: OAuth con Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/authenticate-oauth)) |
| Diseñar sin pensar en `429 Too Many Requests` | Una corrida nocturna grande supera los límites de protección del servicio | Prever esperar los segundos de `Retry-After` y reintentar ([Learn: service protection API limits](https://learn.microsoft.com/power-apps/developer/data-platform/api-limits)) |

## Criterios de Validación

- [ ] Documenté el diseño de una app registration con tipo de credencial justificado
- [ ] Diseñé un Security Role de mínimo privilegio para el Application User
- [ ] Documenté el flujo de obtención de token y llamada a la Web API usando solo placeholders
- [ ] Diagnostiqué correctamente los escenarios de error 401 y 403

## Evidencia esperada

- Documento de diseño de la app registration con el tipo de credencial justificado (sin secretos reales, solo placeholders)
- Diagrama o descripción del Security Role de mínimo privilegio para el Application User
- Diagnóstico documentado de los escenarios de error 401 y 403

## Criterios de aprobación

- El Security Role diseñado sigue el principio de menor privilegio, no un rol administrativo genérico
- El diagnóstico distingue correctamente cuándo un error es de autenticación (401) vs. de autorización (403)
- 100% de los ítems de Criterios de Validación marcados

## Preguntas de Reflexión

1. ¿Por qué un error 403 no significa necesariamente que el token esté mal generado?
2. ¿Qué cambiaría en tu diseño si la integración necesitara escribir en 5 tablas distintas en vez de 1?
3. ¿Qué información de este laboratorio nunca deberías compartir con un asistente de IA sin sanitizar?

## Módulos Relacionados

- Módulo 53 — Dataverse Web API, Dynamics 365 y Autenticación
- Módulo 49 — Seguridad, Secretos y Compliance en IA

## Competencias Desarrolladas

- Diseño de un flujo de autenticación OAuth para integraciones con Dataverse
- Aplicación del principio de mínimo privilegio en Security Roles
- Diagnóstico de errores de autenticación (401) vs. autorización (403)
