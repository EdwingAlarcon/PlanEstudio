---
id: lab-84
title: "Customer Insights Real-Time Journey"
level: "N6"
duration: 120
product: ["Dynamics 365 Customer Insights - Journeys", "Dataverse"]
certifications: ["Dynamics 365 Customer Insights"]
role: ["Consultor Funcional D365 CE", "Marketing Automation Specialist"]
prerequisites:
  - "Módulo 64 estudiado: Customer Insights - Journeys"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
lastVerified: "2026-11"
---

# Lab 84 — Customer Insights Real-Time Journey

## Objetivo

Diseñar un real-time journey con trigger, consentimiento, ramas, objetivo y pruebas negativas.
La ejecución real requiere Customer Insights - Journeys, canal configurado, dominio/cuenta y
contactos con consentimiento.

## Escenario de negocio

SIT quiere renovar contratos 45 días antes del vencimiento y notificar al vendedor si el cliente
interactúa con la comunicación.

## Gate de ambiente real

Antes de presentar este lab como ejecución real, completa el gate **Customer Insights - Journeys**
del recurso `/recursos/d365-tenant-readiness`. Sin canal/dominio, consentimiento y contactos de
prueba, la entrega es **Simulado**.

## 🔧 Requisitos de tenant y fallos frecuentes

### Sin licencia: cómo se entrega

Tu ambiente Developer de Power Platform no puede instalar Customer Insights - Journeys. Sin trial ni
licencia, haz los cuatro pasos en papel y marca la entrega como **Simulado**: es una entrega válida.
La única vía sin pagar para ver la interfaz es la
[trial de 30 días de Customer Insights](https://learn.microsoft.com/dynamics365/customer-insights/journeys/trial-signup),
que crea su propio ambiente con Journeys y Data (requisitos de email y límites en el Módulo 64,
"Antes de empezar"). Con trial, la entrega es **Sandbox real** solo para lo que hayas configurado;
los envíos reales no entran (dominio de prueba y sin proveedor de SMS).

### Licencia y rol mínimo

Customer Insights - Journeys se licencia **por capacidad a nivel de tenant**, no por usuario: quien ya
tiene licencia de cualquier app model-driven de Dynamics 365 puede usarlo con el rol adecuado, y a quien
no la tiene se le asigna una licencia gratuita *Dynamics 365 Customer Insights - Journeys User License*.
Sin al menos un rol de seguridad nadie entra en la app. Los roles se asignan en el Power Platform admin
center: **Environments** > el ambiente > **Settings** > **Users + permissions** > **Users** > **Manage
security roles**. Para diseñar y publicar journeys: **Marketing Professional - Business**; para además
configurar el área **Settings** (dominios, canales, consentimiento): **Marketing Manager - Business**. Los
roles "Marketing Professional" y "Marketing Manager" **sin** el sufijo "- Business" son de otra función y
no sirven aquí ([Learn: usuarios, licencias y roles](https://learn.microsoft.com/dynamics365/customer-insights/journeys/admin-users-licenses-roles)).

### Configuración previa

- Dominio de envío propio autenticado (registro de propiedad, DKIM y SPF) en **Settings** > **Email
  marketing** > **Domain authentication**. El dominio preautenticado que termina en `dyn365mktg.com`
  sirve solo para pruebas ([Learn: autenticar dominios](https://learn.microsoft.com/dynamics365/customer-insights/journeys/domain-authentication)).
- Al menos un canal habilitado (email como mínimo). El SMS exige contratar y configurar un proveedor
  (Azure Communication Services, Infobip, LINK Mobility, Telesign, Twilio o Vibes).
- Un compliance profile con los propósitos del journey (**Settings** > **Customer engagement** >
  **Compliance profiles**) y una fuente de opt-in (formulario o preference center).
- Contactos de prueba con un registro de *contact point consent* para su email y el propósito del
  journey, no solo con los campos `DoNotEmail`/`DoNotBulkEmail` del contacto, que el journey no lee por
  defecto ([Learn: consentimiento](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-compliance-settings)).

### Fallos frecuentes de licencia, región y canal

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No puedes entrar en la app o no ves el área de journeys | Usuario sin rol de seguridad de Customer Insights - Journeys (o, sin ninguna licencia de Dynamics 365, sin la licencia gratuita de usuario) | Power Platform admin center > **Environments** > el ambiente > **Settings** > **Users + permissions** > **Users**: roles del usuario | Pedir al administrador el rol **Marketing Professional - Business** (o **Marketing Manager - Business**) y, si hace falta, la licencia gratuita de usuario |
| El email no pasa la revisión de errores al ponerlo en vivo | El remitente usa un dominio no autenticado | **Settings** > **Email marketing** > **Domain authentication**: estado de cada registro DNS | Autenticar el dominio propio; para pruebas, usar el dominio preautenticado `dyn365mktg.com` (no para producción) |
| El canal SMS del reto adicional no se puede usar | El SMS exige un proveedor contratado y configurado (ACS, Infobip, LINK Mobility, Telesign, Twilio o Vibes) | Revisar en **Settings** si hay un proveedor de SMS configurado (anota la ruta tal como aparece) | Documentar el diseño igual, marcando ese paso como "diseñado, no ejecutable en este tenant" |
| Un contacto de prueba no recibe el email aunque el journey esté en vivo | Con un propósito **Restrictive**, el email del contacto no tiene registro de opt-in en *contact point consent* para ese propósito (o topic) | Abrir el contacto y revisar su consentimiento por punto de contacto para el propósito del email | Registrar el opt-in de prueba (por ejemplo, desde el preference center) antes de volver a probar |
| No se puede crear el journey porque la app no está instalada en el ambiente | Customer Insights - Journeys se instala por ambiente de Dataverse | Power Platform admin center > **Manage** > **Dynamics 365 Apps** > Customer Insights > **Manage** | Instalar la app en ese ambiente (en una trial de administrador, en un ambiente **Subscription-based Trial** con **Allow D365 Apps**) antes de diseñar el journey |

## Requisitos no funcionales

- **Cumplimiento:** ninguna comunicación sale sin consentimiento válido para ese canal específico.
- **Medición:** el journey debe tener objetivo medible, no solo actividad enviada.
- **Operación:** debe existir un criterio para pausar o retirar contactos del journey.
- **Trazabilidad:** cada prueba indica si fue simulada o ejecutada en sandbox real.

## Pasos detallados

### Paso 1 — Trigger

Define evento de entrada, datos mínimos y condición de elegibilidad.

Si el evento es de negocio y masivo (por ejemplo, contratos que vencen), la entrada es por segmento (segment-based journey); usa un trigger solo para acciones individuales del cliente (ver Módulo 64).

### Paso 2 — Consentimiento

Documenta propósito (y su tipo: Commercial o Transactional communication, decidido con Legal),
modelo de cumplimiento (**Restrictive**, **Non-restrictive** o **Disabled**), canal, fuente del
consentimiento y regla de exclusión, como en la Microlección 3 del Módulo 64.

### Paso 3 — Journey

Diseña mensaje inicial, espera, condición de interacción, tarea para vendedor y objetivo.

### Paso 4 — Pruebas

Diseña pruebas para consentimiento válido, sin consentimiento, email inválido y cliente ya renovado.

## Validaciones

- [ ] El journey es real-time y tiene objetivo.
- [ ] Consentimiento se valida antes del envío.
- [ ] Hay pruebas negativas.
- [ ] Se separa Data de Journeys.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado.

## Evidencia esperada

- Diagrama del journey.
- Matriz de consentimiento.
- Casos de prueba.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Trigger | 15% | Trigger real-time con condición de entrada clara |
| Consentimiento | 30% | Se valida ANTES del envío, no después; incluye caso "sin consentimiento" probado |
| Diseño del journey | 25% | Mensaje, espera, condición de interacción, tarea y objetivo, todos justificados |
| Pruebas | 20% | Cubre consentimiento válido, sin consentimiento, email inválido y cliente ya renovado |
| Separación Data/Journeys | 10% | El journey no rehace unificación — consume perfiles/segmentos ya resueltos en Data |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. El caso "sin consentimiento" en 0 es
descalificante sin importar el resto del puntaje — es el criterio de cumplimiento no negociable.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Validar consentimiento después de enviar el primer mensaje | Se diseña el journey como flujo lineal sin gate previo | El journey no tiene un "nodo de consentimiento": el control es el **propósito** de cada mensaje y su modelo de cumplimiento, que se evalúa en cada envío. Decide propósito y modelo antes de redactar el primer email |
| Confiar en `DoNotBulkEmail` del contacto | Por defecto los real-time journeys no evalúan `DoNotEmail`/`DoNotBulkEmail` | Llevar ese "no" a *contact point consent* o activar **Check contact consent in real-time journeys** en **Settings** > **Overview** > **Feature switches** (Módulo 64) |
| Journey que re-unifica datos en vez de consumir Data | Se mezcla lógica de CDP dentro del journey | El journey consume segmentos/perfiles ya resueltos por Customer Insights - Data, no recalcula matching |
| Sin caso de prueba negativo | Solo se prueba el camino feliz (cliente califica, todo bien) | Los 4 casos de prueba (válido, sin consentimiento, email inválido, ya renovado) son obligatorios, no opcionales |
| Objetivo del journey ambiguo | "Enviar comunicación" no es un objetivo medible | El objetivo debe ser observable (ej. "tasa de renovación del segmento sube X%"), no solo "enviar" |

## Reto adicional

Agregá un segundo canal (ej. SMS como fallback si el email no se abre en 48 horas) y documentá cómo
el journey decide entre canales sin violar el consentimiento específico de cada uno — el consentimiento
de email no habilita automáticamente SMS.

## Solución de referencia

Después de completar tu intento, revisa
[Soluciones de Referencia para Capstones](/recursos/soluciones-referencia-capstones#lab-084--customer-insights-journeys)
para comparar consentimiento, pruebas negativas, objetivo y límites de ejecución real.

## Competencias desarrolladas

- Real-time journeys.
- Consentimiento y compliance.
- Marketing automation D365.
