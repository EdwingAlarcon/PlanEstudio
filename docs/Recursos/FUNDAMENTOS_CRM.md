# Fundamentos funcionales CRM — antes del Módulo 61

Los módulos de Dynamics 365 Sales y Customer Service (57 en adelante) ya asumen que conoces este
vocabulario — están escritos a nivel "avanzado" porque el nivel básico de CRM no tenía, hasta ahora,
un lugar propio. Este recurso lo cubre: si nunca trabajaste con un CRM, léelo antes de entrar al
Módulo 61.

**Tipo de práctica de este recurso: conceptual.** No requiere tenant ni trial — es vocabulario y un
caso guiado en papel/Markdown. La práctica *ejecutable* de estos mismos conceptos ya sucede en el
Módulo 61 (Sales, requiere trial) y en el Módulo 62 (Customer Service, requiere trial).

## Objetivo

Entender, desde cero, qué es un CRM y los 10 conceptos que forman la columna vertebral de cualquier
proceso comercial y de servicio al cliente: cliente, cuenta, contacto, lead, oportunidad, caso, cola,
SLA, actividad y proceso comercial/de servicio — con un caso guiado que los conecta a todos.

## ¿Qué es un CRM, en una frase?

Un sistema que registra **todas las interacciones con tus clientes actuales y futuros** en un solo
lugar, para que cualquier persona del equipo (ventas, servicio, marketing) vea el mismo historial en
vez de depender de la memoria de una sola persona o de una hoja de cálculo suelta.

## Los conceptos, en el orden en que normalmente los usas

### Cliente

La persona u organización con la que tu empresa tiene o busca tener una relación comercial. Es el
concepto general — en el sistema, un cliente se representa como una **cuenta** (si es una empresa) o
un **contacto** (si es una persona individual), o ambos a la vez si vendes a personas dentro de
empresas.

### Cuenta (Account)

Una empresa u organización cliente. Ejemplo: "Instituto Técnico Andino" es una cuenta. Guarda datos
como industria, tamaño, dirección fiscal y a quién pertenece la relación comercial (el vendedor
"dueño" de la cuenta).

### Contacto (Contact)

Una persona individual, esté o no asociada a una cuenta. Ejemplo: "María Torres, Directora Académica
de Instituto Técnico Andino" es un contacto vinculado a esa cuenta. Un contacto también puede existir
solo, sin cuenta — por ejemplo, un cliente particular que compra a título personal.

| | Cuenta | Contacto |
|---|---|---|
| Representa | Una organización | Una persona |
| Ejemplo | "Instituto Técnico Andino" | "María Torres" |
| Puede tener | Varios contactos asociados | Puede o no pertenecer a una cuenta |

### Lead (Prospecto)

Alguien que mostró interés inicial pero **todavía no calificaste** como oportunidad real de venta.
Ejemplo: alguien que llenó un formulario "Quiero más información" en tu sitio web. Un lead vive
*antes* de convertirse en cuenta/contacto/oportunidad — es información sin confirmar todavía (¿es una
empresa real?, ¿tiene presupuesto?, ¿decide ella misma la compra?).

### Oportunidad (Opportunity)

Una venta potencial **ya calificada**: sabes quién es el cliente (cuenta/contacto), qué productos le
interesan, un valor estimado y una fecha probable de cierre. Una oportunidad nace normalmente de
**convertir** un lead calificado, o de un cliente ya existente que quiere comprar algo nuevo.

**El flujo lead → oportunidad, resumido:**

```
Lead (interés sin calificar)
   │  calificación: ¿es real? ¿tiene presupuesto? ¿decide?
   ▼
Conversión → se crean/vinculan Cuenta + Contacto + Oportunidad
   │
   ▼
Oportunidad avanza por etapas (ej. Calificación → Propuesta → Negociación → Cierre)
   │
   ▼
Ganada (se convierte en venta) o Perdida (se cierra con motivo registrado)
```

### Caso (Case)

Un problema, consulta o solicitud de un cliente que el equipo de servicio debe resolver. Ejemplo: "El
cliente reporta que su factura llegó con un monto incorrecto" es un caso. Un caso tiene un ciclo de
vida (creado → en investigación → resuelto → cerrado) y, a diferencia de una oportunidad, no busca
vender algo — busca resolver algo para un cliente que ya existe.

### Cola (Queue)

Una bandeja compartida donde caen los casos (o leads, o actividades) antes de que alguien los tome.
Ejemplo: una cola "Soporte Nivel 1" recibe todos los casos nuevos de baja complejidad; los agentes
"toman" casos de esa cola en vez de que alguien se los asigne uno por uno. Sin colas, cada caso
necesitaría una asignación manual — no escala con volumen.

### SLA (Service Level Agreement / Acuerdo de Nivel de Servicio)

El compromiso medible de **cuánto tiempo** tarda el equipo en responder y resolver un caso. Ejemplo:
"primera respuesta en 30 minutos, resolución en 4 horas" para un caso crítico. Un SLA sin fecha/hora
límite medible no es un SLA, es una intención.

### Actividad (Activity)

Cualquier interacción registrada con un cliente: una llamada, un correo, una reunión, una tarea. Las
actividades son lo que convierte una cuenta/contacto/oportunidad/caso de "un registro estático" a "un
historial vivo" — es la evidencia de que alguien realmente habló con el cliente, y cuándo.

## Los dos procesos que conectan todo esto

### Proceso comercial (lead-to-cash, versión simple)

```
Lead → calificar → Oportunidad → etapas de venta → Ganada → (factura/cobro, fuera del CRM de ventas)
```

Cada etapa de la oportunidad debería tener una acción clara (ej. "enviar propuesta") y un criterio de
salida (ej. "propuesta enviada y confirmada por el cliente") — una oportunidad que lleva 3 meses en
"Negociación" sin ninguna actividad reciente es una señal de alerta, no de progreso.

### Proceso de servicio al cliente (case-to-resolution, versión simple)

```
Cliente reporta problema → se crea Caso → cae en una Cola → un agente lo toma → 
investiga (con actividades registradas) → resuelve → el SLA se cumple o se marca incumplido → cierre
```

## Caso guiado — Instituto Técnico Andino (ITA)

Usa este mini-caso para practicar el vocabulario antes del Módulo 61/62 (no requiere ningún ambiente,
solo completar la tabla):

> Instituto Técnico Andino (ITA) recibe, a través de su sitio web, un formulario de "Ana Ruiz"
> interesada en el programa técnico de Sistemas. Dos semanas después, Ana confirma que sí tiene
> presupuesto y decide ella misma matricularse, así que el asesor comercial la convierte en cliente.
> Un mes después de matriculada, Ana escribe un correo diciendo que no puede acceder al campus
> virtual — su mensaje cae en la bandeja general de soporte del área de sistemas.

Completa esta tabla (la respuesta esperada está más abajo, no la mires todavía):

| Momento del caso | ¿Qué concepto es? |
|---|---|
| El formulario inicial de Ana Ruiz | ? |
| Ana confirmada con presupuesto y decisión propia | ? |
| El registro de "Instituto Técnico Andino" no aplica aquí — pero si Ana comprara *para una empresa*, ¿qué sería esa empresa? | ? |
| El correo de Ana sobre el campus virtual | ? |
| La bandeja general de soporte del área de sistemas | ? |
| El compromiso de responder en, por ejemplo, 4 horas | ? |
| El correo mismo, registrado en el historial de Ana | ? |

<details>
<summary>Respuesta esperada (ábrela después de intentarlo)</summary>

| Momento del caso | Concepto |
|---|---|
| El formulario inicial de Ana Ruiz | Lead |
| Ana confirmada con presupuesto y decisión propia | Oportunidad (tras convertir el lead) |
| Si comprara para una empresa | Cuenta |
| El correo de Ana sobre el campus virtual | Caso |
| La bandeja general de soporte | Cola |
| El compromiso de 4 horas | SLA |
| El correo registrado en el historial | Actividad |

</details>

**Evidencia esperada:** tu tabla completada antes de ver la respuesta, guardada en tu bitácora.

## Errores comunes

- **Error:** confundir lead con oportunidad. **Por qué pasa:** ambos "parecen una venta en camino". **Cómo evitarlo:** un lead no está calificado todavía; si no sabes si tiene presupuesto y decisión de compra, es un lead, no una oportunidad.
- **Error:** pensar que un caso siempre es una queja. **Por qué pasa:** el ejemplo típico es "algo salió mal". **Cómo evitarlo:** un caso también puede ser una consulta normal ("¿cómo cambio mi horario de clase?") — el concepto es "algo que el cliente necesita que resuelvas", no necesariamente un problema.
- **Error:** tratar cuenta y contacto como si fueran lo mismo. **Por qué pasa:** en ventas chicas, "el cliente" suele ser una sola persona. **Cómo evitarlo:** pregúntate si lo que describes es una organización (cuenta) o una persona (contacto) — a veces son ambos a la vez, vinculados.

## Criterio de aprobación

Puedes seguir al Módulo 61 (Sales) o al Módulo 62 (Customer Service) cuando puedas, sin mirar este
documento:

- [ ] Explicar la diferencia entre lead y oportunidad con tus propias palabras.
- [ ] Explicar la diferencia entre cuenta y contacto.
- [ ] Explicar qué es una cola y por qué existe.
- [ ] Explicar qué hace que un SLA sea medible y no solo una intención.
- [ ] Completar el caso guiado de ITA sin ver la respuesta.

## Siguiente paso

→ [Módulo 61 — Dynamics 365 Sales Avanzado](/nivel/d365/modulo/dynamics-365-sales-avanzado)
→ [Módulo 62 — Dynamics 365 Customer Service Avanzado](/nivel/d365/modulo/dynamics-365-customer-service-avanzado)
