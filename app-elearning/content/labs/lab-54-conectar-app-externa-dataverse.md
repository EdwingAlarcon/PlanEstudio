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
  - "Acceso a un entorno Developer/Sandbox y, si es posible, permisos para ver (no necesariamente crear) app registrations en Microsoft Entra ID"
files: []
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

Documenta, sin crear nada en un tenant real si no tienes los permisos adecuados:
1. Nombre propuesto para la app registration (ej. `SIT-Integracion-Facturacion`).
2. Tipo de cuenta soportada (solo tu directorio organizacional).
3. Tipo de credencial elegida (client secret o certificado) y por qué, considerando que es una integración de producción de largo plazo.

## Ejercicio 2 — Diseñar el Application User y Security Role

Documenta:
1. Qué tabla(s) necesita leer/escribir la integración (ej. solo la tabla de solicitudes de gasto).
2. Qué privilegios exactos necesita el Security Role (crear, leer, escribir — probablemente NO eliminar ni acceso a otras tablas).
3. Por qué NO se debe usar el rol de System Administrator para este Application User.

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
Accept: application/json
```

Pide a un asistente de IA que revise esta estructura y confirme que no falta ningún header obligatorio — verifica que su respuesta tampoco introduzca valores reales de ejemplo.

## Ejercicio 4 — Diagnosticar errores simulados

Para cada uno de estos 2 escenarios, documenta la causa más probable y cómo la verificarías:
1. La integración recibe `401 Unauthorized` en la llamada a la Web API.
2. La integración recibe `403 Forbidden` en la llamada a la Web API, pero el token se generó correctamente.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Diseñar el Security Role con acceso a todas las tablas "por si acaso" | No aplicar el principio de mínimo privilegio desde el diseño | Limitar el rol exactamente a las tablas y operaciones que la integración necesita |
| Pegar un ejemplo de client secret real al pedir ayuda a la IA | No sanitizar el prompt antes de compartirlo | Usar siempre placeholders (`{{CLIENT_SECRET}}`) en cualquier ejemplo compartido con IA |
| Confundir un error 401 con uno 403 | No distinguir autenticación (¿quién eres?) de autorización (¿qué puedes hacer?) | Repasar la tabla de errores del Módulo 53 antes de diagnosticar |
| Elegir client secret sin fecha de rotación planificada | No considerar el mantenimiento a largo plazo de la credencial | Documentar la fecha de expiración y el proceso de rotación desde el diseño |

## Criterios de Validación

- [ ] Documenté el diseño de una app registration con tipo de credencial justificado
- [ ] Diseñé un Security Role de mínimo privilegio para el Application User
- [ ] Documenté el flujo de obtención de token y llamada a la Web API usando solo placeholders
- [ ] Diagnostiqué correctamente los escenarios de error 401 y 403

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
