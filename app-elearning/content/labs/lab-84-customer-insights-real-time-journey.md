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

### Licencia y rol mínimo

Customer Insights - Journeys tiene licenciamiento propio, separado de Customer Insights - Data y
de Dataverse: sin esa licencia asignada al usuario, la app no queda disponible aunque el usuario
tenga acceso al entorno. Dentro de la app, revisa en **Configuración > Seguridad** qué rol tienes
asignado: diseñar y activar journeys requiere un rol de nivel administrador/diseñador del área de
marketing (equivalente a "Marketing Manager"); un rol solo de colaborador o lectura no permite
publicar el journey ni configurar canales.

### Configuración previa

- Dominio de envío verificado (SPF/DKIM) en Configuración > Dominios.
- Al menos un canal de comunicación habilitado (email marketing configurado como mínimo).
- Formulario o fuente de opt-in que registre el consentimiento del contacto.
- Contactos de prueba dados de alta con el campo de consentimiento marcado explícitamente.

### Fallos frecuentes de licencia, región y canal

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| La app Customer Insights - Journeys no aparece disponible o no se puede activar el journey | Usuario sin licencia de Customer Insights - Journeys asignada | Centro de administración de Microsoft 365 > Usuarios activos > Licencias, o Centro de administración de Power Platform > Recursos > Licencias del entorno | Solicitar al administrador del tenant que asigne la licencia correspondiente al usuario |
| El journey queda "publicado" pero nunca envía el mensaje real | Dominio de envío no verificado (SPF/DKIM) o cuota de envío del trial agotada | Configuración > Dominios: revisar estado de verificación DNS | Completar la verificación del dominio o usar el dominio de prueba provisto, y confirmar la cuota de envío disponible |
| El canal SMS/WhatsApp del reto adicional no aparece disponible para configurar | Canal no habilitado en el tenant — algunos canales requieren proveedor externo o alta adicional que un trial estándar no incluye | Configuración > Canales: ver si el canal figura como disponible o pendiente de configuración | Documentar el diseño igual, marcando ese paso como "diseñado, no ejecutable en este tenant" si el canal no está disponible |
| Los contactos de prueba no reciben el mensaje aunque el journey esté activo | El contacto no tiene el consentimiento marcado para ese canal, o la región de envío de marketing no coincide con la región del entorno | Revisar el registro de consentimiento del contacto y la región del entorno en el Centro de administración de Power Platform | Asegurar el consentimiento explícito antes de probar y usar contactos dados de alta en la misma región del entorno |
| No se puede crear el journey porque la app no está instalada en el entorno aunque el usuario tenga licencia | Customer Insights - Journeys debe instalarse explícitamente por entorno de Dataverse | Centro de administración de Power Platform > Entornos > [entorno] > Aplicaciones de Dynamics 365 | Instalar la app desde el catálogo de aplicaciones del entorno antes de diseñar el journey |

## Requisitos no funcionales

- **Cumplimiento:** ninguna comunicación sale sin consentimiento válido para ese canal específico.
- **Medición:** el journey debe tener objetivo medible, no solo actividad enviada.
- **Operación:** debe existir un criterio para pausar o retirar contactos del journey.
- **Trazabilidad:** cada prueba indica si fue simulada o ejecutada en sandbox real.

## Pasos detallados

### Paso 1 — Trigger

Define evento de entrada, datos mínimos y condición de elegibilidad.

### Paso 2 — Consentimiento

Documenta propósito, canal, fuente del consentimiento y regla de exclusión.

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
| Validar consentimiento después de enviar el primer mensaje | Se diseña el journey como flujo lineal sin gate previo | El chequeo de consentimiento debe ser el primer paso ejecutable, antes de cualquier envío |
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
