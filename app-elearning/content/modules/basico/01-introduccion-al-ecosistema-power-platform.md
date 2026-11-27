---
moduleId: 1
title: "Introducción al Ecosistema Power Platform"
level: "basico"
certification: "PL-900"
estimatedMinutes: 15
practiceMinutes: 90
slug: "introduccion-al-ecosistema-power-platform"
lastVerified: "2026-11"
---
*Lectura: unos 15 min · Práctica y creación del ambiente: 70 a 110 min con la cuenta lista; la primera vez puede ser el doble*

> **🌱 ¿Nunca tocaste Power Platform?** La [Ruta cero absoluta](/recursos/ruta-cero-absoluta) explica tenant, ambiente y trae un glosario. Vuelve a ella cuando una palabra te frene.

### 🎯 Objetivo
Comprender qué piezas tiene Power Platform, para qué sirve cada una y tener tu propio ambiente para practicar.

Al terminar tendrás:
- Tu ambiente del curso con Dataverse, y sabrás cuándo vence.
- 5 registros de prueba creados en una tabla de Dataverse.
- Un mapa de qué pieza resolvería un problema que tú conoces.

No necesitas escribir fórmulas ni entender licencias o ALM todavía.

### 📖 Conceptos Clave
- **Power Platform:** Power Apps (apps), Power Automate (tareas automáticas), Power BI (reportes), Copilot Studio (agentes de chat) y Power Pages (sitios para personas de fuera).
- **Dataverse:** la base de datos común, donde viven las tablas que usan apps, flujos y reportes.
- **Tenant y ambiente:** el *tenant* es tu organización; un *ambiente* es un espacio aislado dentro de él. Tipos: *Production* (uso real), *Sandbox* (pruebas), *Developer* (espacio personal) y *Trial* (prueba que caduca; el de este curso).
- **Conectores:** unen Power Platform con otros servicios. *Standard* (incluidos en la licencia básica), *Premium* (de pago) y *Custom* (los creas para tu sistema).
- **Power Platform Admin Center:** donde se crean y gestionan los ambientes (https://admin.powerplatform.microsoft.com).

### 👨‍💻 Actividades Prácticas

Cada bloque tiene una idea corta, una práctica y un dato de tu ambiente para guardar. Si tu ambiente aún no está listo, haz las microprácticas y el reto (no lo necesitan) y vuelve después.

## 🧩 Microlección 1 — Tu tenant y tu ambiente: dónde vas a trabajar

**¿Qué vas a aprender?** A crear un ambiente propio y a comprobar cuál tienes activo.

**¿Por qué existe esto?** Todo lo que construyas vive dentro de un ambiente. En el ambiente *default*, que comparte toda la organización, tus pruebas se mezclan con las de todos. En uno propio, lo que rompes no afecta a nadie.

**Práctica real en tu entorno (20-60 min; el tiempo depende de Microsoft, no de ti):**

> **⚠️ Tu ambiente del curso es temporal.** Un ambiente **Trial con Dataverse** dura **30 días** y admite **una sola extensión de 30 días**, que solo puedes pedir en la última semana ([Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)). Desde el 15 de noviembre de 2026 el Power Apps Developer Plan ya no crea un ambiente gratuito. Un Trial no se puede restablecer ni copiar. Tu copia de seguridad será tu **solución** exportada (el paquete donde guardas lo que construyes): la creas en el Módulo 2 y desde ahí la exportas al terminar cada módulo ([cómo hacerlo](/recursos/entornos-y-trials)). En este módulo todavía no hay nada que exportar.

**Paso 1 — Una cuenta de trabajo o estudio.** No sirve un correo personal (Gmail, Outlook.com, Hotmail). Si no tienes una, o tu organización te bloquea algo, ve a [Entornos y trials](/recursos/entornos-y-trials): allí están las otras vías y el mensaje para pedir un ambiente a TI.

**Paso 2 — Activa la licencia Power Apps trial.**
1. Abre https://apps.powerapps.com/trial e inicia sesión con esa cuenta.
2. Sigue el asistente hasta la confirmación.

Son dos cosas distintas: la **licencia** de prueba (tu permiso de uso: 30 días, extensible dos veces) y el **ambiente** Trial del Paso 3 (el espacio donde trabajas: 30 días, extensible una vez).

**Paso 3 — Crea el ambiente.**
1. Abre el Admin Center: https://admin.powerplatform.microsoft.com.
2. **Manage** > **Environments** > **New**.
3. Primera pantalla: **Name** `DEV-TuNombre`; **Type** **Trial**; **Region** la más cercana; **Purpose** una frase; en la opción de añadir Dataverse (**Create a database for this environment?** o **Add a Dataverse data store**), **Yes**. Después, **Next**.
4. Segunda pantalla: **Language** **English (United States)** (el curso usa los nombres de los botones en inglés y el idioma base no se cambia después); **Currency** la de tu país; **Enable Dynamics 365 apps** **No**; **Security group** **None** si está disponible. Después, **Save**.
5. Espera a que aparezca como **Ready**.
6. Selecciona el ambiente y, en **Details** > **See all**, mira **Day(s) remain**. Pon un recordatorio siete días antes del vencimiento para pedir **Extend trial**.

**Paso 4 — Comprueba que estás dentro.** Abre https://make.powerapps.com y elige tu ambiente arriba a la derecha. Abre **Tables** (si no la ves, está en **More**): si hay una lista de tablas (Account, Contact…), tienes Dataverse.

**Si algo no coincide**, la tabla de problemas está en [Entornos y trials](/recursos/entornos-y-trials).

**Ahora haz algo — micropráctica (5 min):** **[Diagnosticar: lo que creaste no aparece para tu compañera](/practica/ip-trb-003-ambiente-equivocado)**. Es el error de ambiente más común del primer día.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y tipo de tu ambiente | ___ |
| **Day(s) remain** y fecha de tu recordatorio | ___ |
| Ambiente activo que ves en make.powerapps.com | ___ |

---

## 🟢 Mini Lab 01 — Primera victoria en 5 minutos

Hazlo cuando termines el Paso 4.

1. En [make.powerapps.com](https://make.powerapps.com), con tu ambiente elegido, abre **Tables**.
2. En la pestaña **All**, abre la tabla estándar **Account**.
3. En la barra de comandos selecciona **Edit** (o **View data**) para abrir el editor de filas.
4. Crea una fila: **Account Name** `Cliente Demo 01`, **Main Phone** `3000000000`, **Address 1: City** `Bogotá`. Si no ves alguna columna, muéstrala con la opción de más columnas (por ejemplo, **+17 more**).
5. Comprueba que la fila aparece en la lista.

**Resultado esperado:** una fila nueva en Account. Guarda una captura donde se vea la fila y el nombre del ambiente. Si todavía no puedes entrar, guarda el mensaje de bloqueo: también es evidencia.

---

## 🧩 Microlección 2 — Qué pieza resuelve qué

**¿Qué vas a aprender?** A reconocer cada pieza del ecosistema y el problema que resuelve.

**¿Por qué existe esto?** El error más caro del principiante es construir con la pieza equivocada.

| Pieza | Úsala cuando necesitas… | Ejemplo |
|---|---|---|
| **Power Apps: Canvas App** | Diseñar pantalla por pantalla una app a la medida de una tarea, a menudo en el celular | Un inspector registra una visita con foto |
| **Power Apps: Model-Driven App** | Gestionar muchos datos relacionados de Dataverse; la app arma listas y formularios a partir de las tablas | Un equipo administra clientes, equipos y órdenes |
| **Power Automate** | Que algo pase solo: avisar, aprobar, copiar datos | Pedir aprobación cuando llega una solicitud |
| **Power BI** | Ver cifras y tendencias para decidir | Solicitudes aprobadas por mes |
| **Copilot Studio** | Un agente de chat que responde preguntas o hace tareas | Contestar dudas sobre la política de compras |
| **Power Pages** | Que personas de fuera de la organización usen un sitio web | Un ciudadano consulta su trámite |
| **Dataverse** | Guardar los datos que usan las demás, con relaciones y permisos | La tabla única de solicitudes |

**Canvas o Model-Driven:** si lo importante es la pantalla (diseño libre, pocos datos a la vez, datos de varias fuentes), Canvas. Si lo importante son los datos y sus relaciones en Dataverse, Model-Driven.

**Ahora haz algo — micropráctica (6 min):** **[Elegir las piezas de Power Platform para un caso](/practica/ip-dv-005-elegir-piezas-para-un-caso)**. Es el caso de una clínica veterinaria e incluye decidir cuáles NO hacen falta.

**Práctica real en tu entorno (10 min):**

1. En make.powerapps.com recorre el menú lateral: **Home**, **Create**, **Apps**, **Tables** y **More** (ahí está lo que no veas).
2. Abre **Connections** (o búscalo en **More**) y selecciona **New connection** para ver la lista de conectores. No crees ninguno.
3. Busca en la [lista oficial de conectores](https://learn.microsoft.com/connectors/connector-reference/) uno Standard y uno Premium (los Premium llevan el ícono **Premium**).
4. Con la misma cuenta, abre https://make.powerautomate.com y https://app.powerbi.com y comprueba que entras. Si alguno te pide registrarte o te niega el acceso, anota el mensaje.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Un conector Standard y uno Premium (nombre exacto) | ___ |
| Una forma de empezar una app que viste en **Create** | ___ |
| ¿Entraste a Power Automate y a Power BI? Si no, el mensaje que viste | ___ |

---

## 🧩 Microlección 3 — Dataverse y tu primera tabla

**¿Qué vas a aprender?** Qué es una tabla, una columna, una relación y un registro, mirando una tabla real.

**¿Por qué existe esto?** Apps, flujos y reportes leen y escriben en las mismas tablas: si los datos empiezan desordenados, arreglarlos cuesta mucho.

**Ejemplo pequeño:** en `Account`, *Account Name* es una columna, cada cliente es un registro y la tabla se relaciona con `Contact`.

**Práctica real en tu entorno (15 min):**

1. Abre la tabla **Account** y revisa **Columns**, **Relationships**, **Business rules** y **Views** (listas guardadas de registros).
2. Crea registros como en el Mini Lab 01 hasta tener **5 en total** (si hiciste el Mini Lab, faltan 4).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tres columnas de Account | ___ |
| Cantidad de registros que tiene ahora | ___ |
| Una relación de **Relationships** y con qué tabla conecta | ___ |

---

## 🔁 Reto de transferencia — Tu mapa personal, sin pasos

> **Requerimiento:** elige un proceso real que conozcas donde hoy se usen Excel, papel o mensajes sueltos. Arma tu mapa: qué datos guardarías y dónde, quién los capturaría y desde qué, qué debería pasar solo y qué reporte necesitaría quien decide.
> **Criterios de aceptación:** (1) nombras al menos 4 piezas del ecosistema y cada una resuelve un dolor concreto; (2) dices de dónde sale cada dato, con una sola tabla como fuente; (3) indicas si alguien de fuera de la organización lo usaría y qué pieza cambiaría.
> **Restricciones:** no necesitas construir nada. Para usuarios externos la pieza es Power Pages, que decide qué ve cada uno con sus **permisos de tabla** (table permissions).
> **Ejemplo resuelto:** una panadería que anota pedidos en un cuaderno. Datos: una tabla Pedidos. Captura: una app en el mostrador. Automatización: un aviso a la cocina. Reporte: pedidos por día. Usuario externo: no; si los clientes pidieran desde casa, sería Power Pages.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: ahora los dueños reservan por su cuenta](/practica/ip-dv-006-transferir-reserva-externa)**. Retoma la clínica veterinaria de la micropráctica de la Microlección 2, cambia un requisito y decides qué cambia.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Proceso que elegiste y qué usa hoy | ___ |
| Piezas elegidas y el dolor que resuelve cada una | ___ |
| ¿Hay usuarios externos? ¿Qué cambiaría? | ___ |

### 💼 Caso Real de Negocio

**Empresa:** Laboratorio Farmacéutico NovaBio — 280 empleados, 2 plantas de producción  
**Problema:** El área de Calidad gestionaba no-conformidades (productos fuera de especificación) por email y hojas Excel. Los formularios llegaban incompletos, las aprobaciones tardaban semanas y era imposible auditar el proceso para la certificación ISO 9001.  
**Consecuencia:** Auditoría externa detectó que el 34% de los registros de no-conformidades estaban incompletos o sin respuesta en los tiempos requeridos.

**Solución con Power Platform:**
- **Dataverse:** tabla central de no-conformidades con estados, responsables, fechas límite y adjuntos de evidencia
- **Power Apps Canvas:** formulario digital que valida campos obligatorios antes de permitir el envío — eliminó registros incompletos desde el primer día
- **Power Automate:** flujo automático notifica al responsable al crear la no-conformidad; escala al supervisor si no hay respuesta en 48h
- **Power BI:** dashboard para el Jefe de Calidad con indicadores de tiempo de cierre por tipo, área y responsable

**Resultados a 6 meses:**
- 100% de registros completos (vs 66% previo)
- Tiempo de cierre promedio reducido de 18 días a 6 días
- Superó la siguiente auditoría ISO 9001 sin observaciones en el proceso de no-conformidades

**Por qué Power Platform:** Ningún componente requirió código. El equipo de Calidad configuró el sistema en 3 semanas sin soporte externo.

### ✅ Buenas Prácticas
- Practicar en tu ambiente del curso, nunca en producción
- Nombrar ambientes con convenciones claras: `DEV-TuNombre`, `TEST-Proyecto`
- Documentar propósito de cada ambiente desde su creación
- No compartir credenciales de trial; crear usuarios de prueba en el tenant

### ⚠️ Errores Comunes
- **Lo que ves:** lo que creaste no aparece para otra persona, o ves cosas de otros mezcladas con las tuyas.
  - **Causa probable:** estás trabajando en el ambiente *default* (compartido) o en uno distinto al suyo.
  - **Qué hacer:** mira el ambiente activo arriba a la derecha, cambia a tu ambiente del curso y trabaja siempre ahí.

- **Lo que ves:** intentas guardar datos estructurados (clientes, solicitudes) en SharePoint y no puedes relacionarlos ni validarlos como esperabas.
  - **Causa probable:** confundir Dataverse con SharePoint.
  - **Qué hacer:** Dataverse es una base de datos relacional; SharePoint es almacenamiento documental. Usa cada uno para lo que fue pensado.

- **Lo que ves:** algo deja de funcionar o te pide licencia sin que hayas cambiado nada.
  - **Causa probable:** no conocías los límites de la licencia trial (usuarios, llamadas a API, almacenamiento).
  - **Qué hacer:** mira **Day(s) remain** y la tabla de problemas de [Entornos y trials](/recursos/entornos-y-trials).

### 🧪 Criterios de Validación
- [ ] Ambiente del curso creado y funcional
- [ ] Acceso a Power Apps, Power Automate, Power BI confirmado (Power BI se abre en https://app.powerbi.com)
- [ ] 5+ registros de prueba en tabla Account de Dataverse
- [ ] Comprensión de diferencia entre conectores Standard y Premium
- [ ] Explicar con palabras propias qué es Dataverse y su propósito
- [ ] Elegir entre Canvas App y Model-Driven App para un caso y justificarlo
- [ ] Decir qué pieza resuelve cada necesidad de un proceso que conoces

> **Si quieres ampliar (opcional):** [AI Builder y Power Pages](/recursos/ai-builder-y-power-pages).
