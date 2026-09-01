# Fundamentos funcionales CRM — desde cero

Esta guía explica el vocabulario de negocio que usan Dynamics 365 Sales y Customer Service, **antes**
de tocar la herramienta. Si vienes de programación pero nunca trabajaste en un área comercial o de
atención al cliente, esto es tu puente. Léela antes del Módulo 20 (Dynamics 365 CE — Sales y Customer
Service) y antes de la [Ruta Dynamics 365 Sales](/recursos/ruta-cero-absoluta).

Tipo de práctica de esta guía: **conceptual**. La primera práctica ejecutable sobre estos conceptos
llega en el Módulo 20 (ambiente Developer, modelo de datos genérico) y se profundiza en el nivel D365
con trial de Dynamics 365 Sales/Customer Service.

## 1. Cliente, cuenta y contacto

**Objetivo**: distinguir cuenta de contacto y saber cuándo usar cada uno.

**Explicación clara**:
- **Cliente** es el término genérico: cualquier persona u organización a la que le vendes o das
  servicio.
- **Cuenta (Account)** es una **organización** — una empresa. Ejemplo: "Contoso S.A.".
- **Contacto (Contact)** es una **persona** — puede o no estar ligada a una cuenta. Ejemplo: "María
  Gómez, Gerente de Compras de Contoso S.A.".

Una cuenta puede tener varios contactos (los empleados con los que hablas). Un contacto puede existir
sin cuenta (venta a una persona particular, no a una empresa).

**Pasos** (mentales, sin herramienta todavía):
1. Piensa en una compra reciente que hiciste. ¿Compraste a una empresa (cuenta) o le compraste
   directamente a una persona (contacto sin cuenta)?
2. Si compraste a una empresa, ¿con qué persona específica hablaste? Esa persona es el contacto
   ligado a esa cuenta.

**Práctica**: conceptual.

**Evidencia esperada**: ninguna aún — la evidencia ejecutable llega en el Módulo 20 y en el
[Fundamentos de Dataverse](/recursos/fundamentos-dataverse) cuando crees estas tablas.

**Errores comunes**: tratar "cliente" como si fuera un tipo de dato en el sistema — no lo es; en el
sistema existen Cuentas y Contactos, "cliente" es solo el término de negocio que los engloba.

**Criterio de aprobación**: dado un caso real ("una empresa te compra 50 licencias, negociado por su
Director de TI"), identificas correctamente cuál es la cuenta y cuál el contacto.

## 2. Lead (prospecto)

**Objetivo**: entender qué es un lead y en qué momento del proceso comercial aparece.

**Explicación clara**: un **lead** es un contacto potencial que **todavía no está calificado** como
oportunidad real de negocio — alguien que mostró interés (llenó un formulario, pidió información,
vino de una feria) pero que aún no sabes si tiene presupuesto, autoridad para decidir, necesidad real
y tiempo definido (esto se conoce como calificación **BANT**: Budget, Authority, Need, Timeline).

**Pasos**:
1. Un lead entra al sistema (manual, o automático vía formulario web con Power Automate).
2. Un vendedor lo califica: ¿tiene presupuesto? ¿decide él o necesita aprobación? ¿necesita realmente
   el producto? ¿tiene fecha estimada de compra?
3. Si califica, el lead se **convierte** en Cuenta + Contacto + Oportunidad. Si no califica, se
   descarta (pero queda registrado, no se borra).

**Práctica**: conceptual.

**Errores comunes**: confundir lead con oportunidad — un lead es "posible interés sin calificar", una
oportunidad es "negocio real en proceso de cierre". Convertir cada lead automáticamente sin calificar
genera un embudo de ventas lleno de ruido.

**Criterio de aprobación**: explicas la diferencia entre lead y oportunidad usando el criterio BANT.

## 3. Oportunidad

**Objetivo**: entender qué es una oportunidad y su ciclo de vida básico.

**Explicación clara**: una **oportunidad (Opportunity)** es un negocio calificado, en proceso, con
una cuenta, un valor estimado, una fecha estimada de cierre y una probabilidad de ganarla. Avanza por
**etapas** (ejemplo típico: Calificar → Desarrollar → Proponer → Cerrar) hasta que se marca como
**Ganada** o **Perdida**.

**Práctica**: conceptual.

**Errores comunes**: dejar oportunidades "flotando" sin fecha de cierre estimada — rompe cualquier
reporte de forecast (pronóstico de ventas).

**Criterio de aprobación**: puedes nombrar las etapas típicas de una oportunidad y explicar qué pasa
cuando se marca Ganada vs. Perdida.

## 4. Caso (Case)

**Objetivo**: entender qué es un caso y por qué existe separado de la oportunidad.

**Explicación clara**: un **caso** es un problema o solicitud de un cliente **después** de la venta —
soporte técnico, una queja, una pregunta de uso. Vive en Customer Service, no en Sales. Tiene un
**estado** (Activo, En espera, Resuelto, Cancelado), un **origen** (teléfono, email, portal, chat) y,
normalmente, un **SLA** asociado (ver más abajo).

**Práctica**: conceptual.

**Errores comunes**: mezclar casos con oportunidades — un cliente que ya compró y ahora tiene un
problema técnico no es una "nueva oportunidad", es un caso. Confundir esto rompe los reportes de
ambas áreas.

**Criterio de aprobación**: dado un escenario ("un cliente que ya compró llama porque el producto no
funciona"), identificas que es un Caso y no una Oportunidad.

## 5. Cola (Queue)

**Objetivo**: entender para qué sirve una cola de trabajo.

**Explicación clara**: una **cola** es una bandeja compartida de trabajo pendiente (casos, leads,
actividades) que no está asignado a una persona específica todavía. Ejemplo: "Cola de Soporte Nivel
1" recibe todos los casos nuevos; un agente disponible los toma de ahí. Sirve para repartir carga de
trabajo sin que alguien tenga que asignar caso por caso a mano.

**Práctica**: conceptual (el enrutamiento automático hacia colas se practica en el nivel D365 con
Customer Service).

**Errores comunes**: pensar que una cola es lo mismo que "un usuario más" — una cola no es una
persona, es un contenedor de trabajo sin dueño todavía.

**Criterio de aprobación**: explicas por qué un equipo de soporte usa colas en vez de asignar cada
caso manualmente desde el primer minuto.

## 6. SLA (Service Level Agreement)

**Objetivo**: entender qué mide un SLA y por qué importa.

**Explicación clara**: un **SLA** es un compromiso de tiempo de respuesta o resolución para un caso —
ejemplo: "primera respuesta en 4 horas, resolución en 24 horas" para clientes Premium, distinto para
clientes estándar. El sistema mide el tiempo transcurrido contra ese compromiso y avisa (o escala)
cuando está por incumplirse.

**Práctica**: conceptual.

**Errores comunes**: pensar que el SLA es solo un campo de fecha — en realidad implica reglas de
pausa (fuera de horario laboral, esperando respuesta del cliente) que cambian el cálculo real del
tiempo.

**Criterio de aprobación**: explicas la diferencia entre "tiempo de primera respuesta" y "tiempo de
resolución" dentro de un SLA.

## 7. Actividades (Activities)

**Objetivo**: entender qué son las actividades y cómo conectan todo lo anterior.

**Explicación clara**: las **actividades** son las interacciones registradas — llamadas, correos,
tareas, citas — ligadas a una cuenta, contacto, lead, oportunidad o caso. Son el historial real de
"qué se hizo y cuándo". Un vendedor o agente sin actividades registradas no tiene manera de demostrar
seguimiento ni de que otro compañero retome el caso si él no está.

**Práctica**: conceptual.

**Errores comunes**: registrar actividades después de días de retraso — pierde valor como evidencia
de seguimiento y rompe cualquier reporte de tiempos de respuesta.

**Criterio de aprobación**: dado un caso de soporte con 3 interacciones, puedes listar qué actividad
correspondería a cada una (llamada, correo, tarea de seguimiento).

## 8. Proceso comercial (lead-to-opportunity-to-cash)

**Objetivo**: ver el flujo comercial completo de punta a punta.

**Explicación clara**: el flujo típico es **Lead → Calificación → Oportunidad → Cotización → Pedido →
Factura ("lead to cash")**. Cada etapa tiene datos y responsables distintos, pero todos apuntan a la
misma Cuenta y Contacto. Este es el flujo que practicarás en la
[Ruta Dynamics 365 Sales](#) del nivel D365 y en el Lab 66 (Sales Lead to Cash).

**Práctica**: conceptual (el flujo completo ejecutable vive en el trial de Dynamics 365 Sales).

**Errores comunes**: pensar que el proceso termina en "oportunidad ganada" — comercialmente sigue
hasta la factura; los pasos de cotización y pedido son parte real del ciclo, no un detalle aparte.

**Criterio de aprobación**: dibujas de memoria el flujo lead-to-cash con sus 5 etapas en orden.

## 9. Proceso de servicio al cliente

**Objetivo**: ver el flujo de atención al cliente de punta a punta.

**Explicación clara**: el flujo típico es **Caso creado → Clasificado y priorizado → Asignado (vía
cola o directo) → Trabajado con SLA corriendo → Resuelto → Encuesta/cierre**. La base de conocimiento
(knowledge base) se consulta durante el trabajo del caso para resolver más rápido sin reinventar la
respuesta cada vez.

**Práctica**: conceptual (el flujo ejecutable vive en el trial de Dynamics 365 Customer Service, ver
[Ruta Dynamics 365 Customer Service](/nivel/d365)).

**Errores comunes**: saltarse la clasificación/priorización — sin ella, un caso urgente puede quedar
detrás de casos triviales en la cola.

**Criterio de aprobación**: dibujas de memoria el flujo de atención con sus 6 pasos en orden.

## Siguiente paso

Con este vocabulario, continúa con:
- [Fundamentos de Dataverse desde cero](/recursos/fundamentos-dataverse) — para ver cómo estos
  conceptos se convierten en tablas reales.
- [Módulo 20 — Dynamics 365 CE: Sales y Customer Service](/nivel/avanzado/modulo/dynamics-365-ce-sales-y-customer-service)
  — tu primera práctica ejecutable sobre estos conceptos.
