---
moduleId: 1
title: "Introducción al Ecosistema Power Platform"
level: "basico"
certification: "PL-900"
estimatedMinutes: 20
slug: "introduccion-al-ecosistema-power-platform"
lastVerified: "2026-11"
---
*Duración: 1-2 semanas · Lectura: 10-12 min · Con práctica y setup de ambiente: los bloques suman 70 a 110 min con la cuenta lista; la primera vez, cuenta entre el doble y el triple (el tiempo de setup varía y no depende de ti)*

> **🌱 ¿Nunca tocaste Power Platform?** Lee primero [Ruta cero absoluta](/recursos/ruta-cero-absoluta) —
> aclara qué es un tenant, un ambiente y la diferencia entre Developer/Sandbox/Production/trial antes
> de que este módulo te pida crear el tuyo.

> **📌 ¿Primera vez usando una herramienta profesional en la nube?** Si nunca has creado una cuenta de trabajo, entrado a un panel de administración o usado algo parecido a Excel/Access, lee primero la tabla de abajo. Si ya usas software de oficina o herramientas web con soltura, sáltala y ve directo al Objetivo.

### 🌱 Fundamentos digitales antes de empezar (opcional si ya los conoces)

| Término | En una frase |
|---|---|
| **Nube (Cloud)** | Programas y datos que viven en computadoras de Microsoft, no en tu PC — por eso accedes desde cualquier navegador con internet. |
| **Navegador** | El programa donde abres páginas web (Edge, Chrome) — aquí es donde vas a trabajar todo el curso, no instalas nada pesado. |
| **URL** | La dirección de una página, como `make.powerapps.com` — la escribes o pegas en la barra de arriba del navegador. |
| **Cuenta / Login** | Tu usuario y contraseña para identificarte; la cuenta que crearás en este módulo es de trabajo/estudio, distinta a tu correo personal. |
| **Panel de administración (Admin Center)** | Una página donde se configuran cosas a nivel de toda la organización, no de una sola app — normalmente no la tocas hasta niveles más avanzados. |
| **Tabla (como en Excel)** | Filas y columnas de datos. Dataverse (lo verás abajo) es básicamente muchas tablas conectadas entre sí, como varias hojas de Excel que se hablan entre ellas. |
| **Registro (Record)** | Una fila dentro de una tabla — por ejemplo, un cliente específico es un registro en la tabla de clientes. |

> No necesitas memorizar esto. Vuelve aquí si te pierdes en una palabra durante el módulo.

### 🎯 Objetivo
Comprender la arquitectura, componentes y casos de uso de Power Platform.

### ✅ Qué vas a lograr hoy
- Tener tu propio ambiente Developer de Power Platform funcionando.
- Explorar Power Apps, Dataverse y sus conectores por primera vez, sin construir nada complejo todavía.
- Crear 5 registros de prueba en una tabla ya existente — tu primera interacción real con Dataverse.

### 🙅 Qué NO necesitas dominar todavía
- No necesitas entender licenciamiento a fondo, ni CoE, ni ALM en detalle — solo saber que existen y para qué sirven a grandes rasgos.
- No necesitas terminar los Suplementos 1A (AI Builder) y 1B (Power Pages) hoy — son opcionales y puedes volver a ellos después de tu primera práctica.
- No necesitas escribir ninguna fórmula de Power Fx en este módulo.

> **📌 Si aún no tienes tu ambiente listo:** conseguir la cuenta de trabajo y crear el ambiente puede tardar minutos o hasta un día completo si requiere verificación. Esto puede tomar más tiempo que una clase normal — **no significa que hiciste algo mal**. Puedes seguir leyendo el resto del módulo mientras esperas, o volver mañana cuando el ambiente esté activo.

### 📚 Mini-glosario antes de empezar

| Término | En una frase |
|---|---|
| **Dataverse** | La base de datos común de Power Platform — donde viven las tablas que usan tus apps y flujos. |
| **Ambiente (Environment)** | Un espacio separado y aislado para trabajar, como una carpeta propia; nunca mezcles pruebas con producción. |
| **Tenant** | La organización completa en Microsoft 365/Power Platform a la que perteneces — puede tener varios ambientes adentro. |
| **Solución (Solution)** | El contenedor donde empaquetas tablas, apps y flujos para poder moverlos entre ambientes de forma ordenada. |
| **Publisher** | El "sello" con tu prefijo (ej. `sit_`) que identifica que una tabla o columna es tuya, no del sistema. |

### 📖 Conceptos Clave (esenciales para hoy)
- **Arquitectura de Power Platform**: Componentes principales y su interrelación
- **Microsoft Dataverse**: la base de datos de Power Platform, donde viven las tablas que usan tus apps y flujos (antes se llamaba *Common Data Service*).
- **Ambientes (Environments)**: espacios separados para trabajar. Tipos: *Production* (producción, lo que usa la gente de verdad), *Sandbox* (pruebas), *Developer* (tu espacio personal de desarrollo) y *Trial* (prueba que caduca).
- **Conectores**: piezas que conectan Power Platform con otros servicios. *Standard* (estándar, incluidos en la licencia básica), *Premium* (requieren licencia de pago) y *Custom* (personalizados, los creas tú para tu propio sistema).
- **Power Platform Admin Center**: el panel de administración donde se crean y gestionan los ambientes y sus recursos.

> **Verás esto más adelante, no hace falta dominarlo hoy:** Soluciones y ALM (se practica a fondo desde el Módulo 2), Licenciamiento per-user/per-app/pay-as-you-go (retomado en niveles posteriores), Center of Excellence — introducción conceptual únicamente por ahora.

### 👨‍💻 Actividades Prácticas

> **Cómo está organizado este módulo:** en vez de leer todo y practicar al final, alternas. Cada bloque tiene una idea corta, una práctica de pocos minutos y un dato real de tu propio ambiente para guardar. Cierras con un reto en el que ya no te digo los pasos. Si tu ambiente aún no está listo, haz las microprácticas y el reto de transferencia (no necesitan tenant) y vuelve a las partes con ambiente cuando esté activo.

## 🟢 Mini Lab 01 — Primera victoria en 5 minutos

> Haz esto apenas puedas entrar a [make.powerapps.com](https://make.powerapps.com). No necesitas crear una app todavía.

**Qué vas a construir:** no vas a construir una solución completa; vas a crear tu primera evidencia real dentro del ambiente.

1. Entra a [make.powerapps.com](https://make.powerapps.com).
2. En el menú lateral, abre **Tables**.
3. Busca y abre la tabla estándar **Account**.
4. En la pestaña de datos, crea 1 registro de prueba:
   - Account Name: `Cliente Demo 01`
   - Phone: `3000000000`
   - City: `Bogotá`
5. Guarda el registro y confirma que aparece en la lista.

**Resultado esperado:** ves una fila nueva en la tabla Account. Esa fila es tu primera interacción real con Dataverse.

**Evidencia para guardar:** captura de la tabla Account mostrando `Cliente Demo 01` y el nombre del ambiente en la parte superior.

**Si no puedes entrar todavía:** guarda una nota con el mensaje de bloqueo del tenant/trial. Eso también sirve como evidencia de avance; el setup depende de Microsoft, no solo de ti.

## 🧩 Microlección 1 — Tu tenant y tu ambiente: dónde vas a trabajar

**¿Qué vas a aprender?** Qué es un ambiente, por qué trabajas en uno propio y no en el que ya existe, y cómo ver cuál tienes activo.

**¿Por qué existe esto?** Todo lo que construyas vive dentro de un ambiente. Si trabajas en el ambiente *default* (el que comparte toda la organización), tus pruebas se mezclan con las de todos y no puedes controlarlas. Un ambiente Developer propio es tu espacio aislado: lo que rompes ahí no afecta a nadie.

**Ejemplo pequeño:** la misma organización tiene el ambiente `Contoso (default)` y el tuyo, `DEV-TuNombre`. Una tabla creada en uno no aparece en el otro.

> **Lo mínimo para este módulo:** una cuenta de trabajo o estudio y un ambiente de tipo Developer (o Trial) con Dataverse. El trial de Dynamics 365 es opcional: puedes saltarte ese paso y volver cuando llegues a los módulos de Dynamics 365. El Power Platform Admin Center está en https://admin.powerplatform.microsoft.com.

**Práctica real en tu entorno (20-60 min; el tiempo depende de Microsoft, no de ti):**

> **⚠️ Cambio de Microsoft en curso (verificado en Microsoft Learn, octubre de 2026):** desde el **15 de noviembre de 2026** registrarse en el Power Apps Developer Plan ya no crea un ambiente y ya no se pueden crear ambientes Developer "no administrados" por ninguna vía (tampoco desde el Admin Center); solo quedan los Developer *administrados*. Los ambientes Developer no administrados que ya existan se suspenden desde el **15 de diciembre de 2026** y se borran desde el **15 de enero de 2027**. Si haces este setup antes del 15 de noviembre, sirve para este módulo, pero exporta tus soluciones antes del 15 de diciembre si quieres conservarlas. Detalle: [Cambios importantes en Power Platform](https://learn.microsoft.com/power-platform/important-changes-coming).

**Paso 1 — Consigue una cuenta de trabajo o estudio (no sirve tu correo personal).**

Microsoft no permite registrarse con una cuenta personal como Gmail, Outlook.com o Hotmail. Elige el caso que se parezca al tuyo:

- **Tienes correo de empresa o universidad:** pruébalo en el Paso 2. Si ves un mensaje de que el registro de ambientes de desarrollo está bloqueado, tu organización bloqueó el registro y debes ir al caso siguiente.
- **No tienes ninguna cuenta de trabajo:** crea tu propio tenant de prueba:
  1. Abre https://www.microsoft.com/microsoft-365/try.
  2. Elige un plan de empresa con prueba gratuita de un mes.
  3. Sigue el asistente. Al terminar tendrás una cuenta del tipo `tunombre@tuorganizacion.onmicrosoft.com` y serás el **administrador** de ese tenant.
  4. Anota el usuario, la contraseña (en un lugar seguro, no en la evidencia) y la **fecha en que termina la prueba**.
- **Tienes una suscripción de Visual Studio Professional o Enterprise:** puedes pedir el sandbox del [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program). Hoy solo califican esos suscriptores, algunos partners y clientes de soporte Premier o Unified. La mayoría de los principiantes no califica, así que no lo uses como primera opción.

**Paso 2 — Crea tu ambiente Developer.**

*Opción A, si eres administrador de tu tenant (el caso del tenant de prueba propio):*

1. Abre https://admin.powerplatform.microsoft.com e inicia sesión con tu cuenta de trabajo.
2. En el panel de la izquierda haz clic en **Manage** y luego en **Environments**.
3. En la barra superior haz clic en **New**.
4. Completa la primera pantalla:
   - **Name:** `DEV-TuNombre`.
   - **Region:** la más cercana a ti.
   - **Type:** **Developer**. Si esa opción no aparece, elige **Trial** (ver "Si algo sale distinto" abajo).
   - **Add a Dataverse data store:** **Yes**. Sin esto no hay tablas, y no se puede deshacer después.
   - Deja el resto como viene y haz clic en **Next**.
5. Completa la segunda pantalla:
   - **Language:** Spanish.
   - **URL:** una corta y única, por ejemplo `dev-tunombre`.
   - **Currency:** la de tu país.
   - **Enable Dynamics 365 apps:** **No**. Exige una licencia de Dynamics 365, y en un ambiente Developer no se pueden instalar apps de Dynamics 365.
   - **Security group:** es obligatorio. Para dejar el acceso abierto (lo normal en tu tenant de prueba personal) elige **None**.
   - Haz clic en **Save**.
6. Espera a que tu ambiente aparezca en la lista como **Ready**. Suele tardar unos minutos y a veces más.

*Opción B, si no eres administrador (correo de empresa o universidad), solo antes del 15 de noviembre de 2026:*

1. Abre https://aka.ms/PowerAppsDevPlan e inicia sesión con tu cuenta de trabajo.
2. Completa el registro. Al terminar te lleva a make.powerapps.com.
3. Espera unos minutos: tu ambiente se llamará **"Tu Nombre's environment"**. Puedes ver el avance en el Admin Center.

**Paso 3 — Confirma que estás dentro de tu ambiente.**

1. Abre https://make.powerapps.com.
2. Arriba a la derecha está el selector de ambiente. Haz clic en él y elige el ambiente que creaste.
3. Comprueba que en el menú de la izquierda aparece **Tables**. Si aparece, tu ambiente tiene Dataverse y ya puedes hacer el Mini Lab 01.

**Paso 4 (opcional, solo cuando llegues a los módulos de Dynamics 365) — Trial de Dynamics 365.**

El trial de Dynamics 365 Customer Service **no se añade a tu ambiente Developer**: crea un ambiente aparte con las apps de Dynamics 365 instaladas. Sáltalo por ahora.

**Si algo sale distinto:**

| Lo que ves | Qué significa | Qué hacer |
|---|---|---|
| En **Type** no aparece **Developer** | Desde el 15 de noviembre de 2026 Microsoft solo permite ambientes Developer *administrados*, y tu tenant puede no tener esa opción | Elige **Trial**. Para crear un ambiente Trial tu usuario (aunque seas administrador) necesita una licencia de prueba por usuario, por ejemplo la de Power Apps: si el Admin Center te la pide, actívala primero en https://apps.powerapps.com/trial. Funciona igual para este módulo, pero dura 30 días: puedes ampliarlo una sola vez otros 30 días en su última semana, y después se deshabilita y se borra. Anota la fecha de fin y exporta tus soluciones antes |
| Un mensaje de que el registro de ambientes de desarrollo está bloqueado | Tu organización bloqueó el registro | Pide un ambiente de desarrollo a tu administrador o crea tu tenant de prueba propio (Paso 1) |
| El portal del Microsoft 365 Developer Program te dice que no calificas | No tienes una suscripción que califique | Usa el tenant de prueba de Microsoft 365 del Paso 1 |
| Tu ambiente desaparece o queda deshabilitado tras semanas sin usarlo | Los ambientes Developer sin actividad se deshabilitan solos (30 días sin actividad en los no administrados, 60 en los administrados) y se borran 15 días después | Solo abrirlo no cuenta como actividad: abre una app, ejecuta un flujo o crea/edita algo al menos una vez cada pocas semanas, y exporta tus soluciones |

**Ahora haz algo — micropráctica (5 min):** **[Diagnosticar: lo que creaste no aparece para tu compañera](/practica/ip-trb-003-ambiente-equivocado)**. Parte de un síntoma real —lo que construiste "desaparece"— y te pide decir qué pasó antes de ver la solución. Es el error de ambiente más común del primer día.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre exacto de tu ambiente | ___ |
| Tipo del ambiente (Developer, Sandbox, Production o Trial) | ___ |
| Ambiente activo que ves arriba a la derecha en make.powerapps.com | ___ |

---

## 🧩 Microlección 2 — Qué pieza resuelve qué

**¿Qué vas a aprender?** Reconocer las piezas del ecosistema (Power Apps, Power Automate, Power BI, Copilot Studio y Dataverse) y qué dolor resuelve cada una.

**¿Por qué existe esto?** El error más caro del principiante es construir con la pieza equivocada: hacer una app cuando lo que hacía falta era un flujo que actúe solo. Saber qué hace cada pieza te ahorra rehacer.

**Ejemplo pequeño:** aprobar una solicitud por correo es trabajo de Power Automate; ver cuántas se aprobaron por mes es de Power BI; capturarla desde el celular es de Power Apps; y los datos de las tres viven en Dataverse.

**Ahora haz algo — micropráctica (6 min):** **[Elegir las piezas de Power Platform para un caso](/practica/ip-dv-005-elegir-piezas-para-un-caso)**. Te da el caso de una clínica veterinaria y te pide decidir qué pieza cubre cada necesidad, incluyendo cuáles NO hacen falta.

**Práctica real en tu entorno (10 min):**

1. Acceder a https://make.powerapps.com
2. Navegar cada sección del menú lateral:
    - Home, Create, Learn, Apps, Tables, Flows, Copilots (Copilot Studio), AI Hub

3. Identificar conectores disponibles (Connectors > Premium vs Standard)
4. Revisar plantillas predefinidas (Templates)

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tres secciones del menú lateral que reconociste y, con tus palabras, para qué sirve cada una | ___ |
| Un conector Standard y uno Premium que encontraste (nombre exacto de cada uno) | ___ |
| Una plantilla (Template) que podría servir para un caso de tu vida real | ___ |

---

## 🧩 Microlección 3 — Dataverse y tu primera tabla

**¿Qué vas a aprender?** Qué es una tabla, una columna, una relación y un registro en Dataverse, mirando una tabla real en vez de leer la definición.

**¿Por qué existe esto?** Las apps, los flujos y los reportes leen y escriben en las mismas tablas. Si entiendes una tabla desde el primer día, no construyes sobre datos desordenados que luego cuesta arreglar.

**Ejemplo pequeño:** la tabla `Account` tiene columnas (Account Name, Phone, City), cada fila es un registro (un cliente concreto) y se relaciona con otras tablas, como `Contact`.

**Práctica real en tu entorno (15 min):**

1. Ir a "Tables" en el menú
2. Explorar tablas estándar: Account, Contact, Email, Task
3. Abrir tabla "Account" y revisar:
    - Columns (columnas/campos)
    - Relationships (relaciones)
    - Business rules
    - Views (vistas)

4. Crear datos de prueba manualmente (5 registros de Account)

> Si ya completaste el Mini Lab 01, aquí solo agrega 4 registros más. Tu objetivo total del módulo son 5 registros de prueba, no 5 registros adicionales.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de tres columnas de la tabla Account que viste | ___ |
| Cantidad de registros que tiene tu tabla Account ahora | ___ |
| Una relación que viste en la pestaña Relationships (con qué tabla se relaciona) | ___ |

---

## 🔁 Reto de transferencia — Tu mapa personal, sin pasos

Esta vez no te digo qué hacer paso a paso: aplica lo que viste a un caso que conozcas.

> **Requerimiento:** elige un proceso real que conozcas (tu trabajo, tu estudio, un negocio familiar) donde hoy se usen Excel, papel o mensajes sueltos. Arma tu mapa: qué datos guardarías y dónde, quién los capturaría y desde qué, qué debería pasar solo y qué reporte necesitaría quien decide.
> **Criterios de aceptación:** (1) nombras al menos 4 piezas del ecosistema y cada una resuelve un dolor concreto de tu proceso, no las listas por listar; (2) dices de dónde sale cada dato, con una sola tabla como fuente; (3) indicas si alguien de fuera de la organización necesitaría usarlo y, si es así, qué pieza cambiaría.
> **Restricciones:** no necesitas tenant ni construir nada; es un mapa en papel o en una nota. Power Pages es la pieza para usuarios externos (el detalle está en el Suplemento 1B, opcional).
> **Ejemplo resuelto (otro negocio, solo para que veas la forma):** una panadería que anota los pedidos en un cuaderno. Datos: una tabla Pedidos, que es la única fuente. Captura: una app en el mostrador para tomar pedidos. Automatización: un flujo que avisa al obrador cuando entra un pedido. Reporte: pedidos por día. Usuario externo: no; si los clientes pidieran desde su casa, la pieza sería Power Pages. Tu mapa debe tener esa forma, con tu propio proceso.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: ahora los dueños reservan por su cuenta](/practica/ip-dv-006-transferir-reserva-externa)**. Retoma el caso de la clínica de la micropráctica anterior pero cambia un requisito, y te pide decidir qué cambia y qué se conserva.

**Evidencia a reportar (tu mapa personal de productos y un caso de negocio simple):**

| Campo | Tu valor |
|---|---|
| Proceso que elegiste y qué usa hoy | ___ |
| Las piezas que elegiste y el dolor concreto que resuelve cada una | ___ |
| ¿Algún usuario externo lo usaría? ¿Qué pieza cambiaría por eso? | ___ |

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
- Usar ambientes Developer/Sandbox para pruebas, nunca directamente en Production
- Nombrar ambientes con convenciones claras: `DEV-TuNombre`, `TEST-Proyecto`
- Documentar propósito de cada ambiente desde su creación
- No compartir credenciales de trial; crear usuarios de prueba en el tenant

### ⚠️ Errores Comunes
- **Lo que ves:** lo que creaste no aparece para otra persona, o ves cosas de otros mezcladas con las tuyas.
  - **Causa probable:** estás trabajando en el ambiente *default* (compartido) o en uno distinto al suyo.
  - **Qué hacer:** mira el ambiente activo arriba a la derecha, cambia a un ambiente Developer propio y trabaja siempre ahí.

- **Lo que ves:** intentas guardar datos estructurados (clientes, solicitudes) en SharePoint y no puedes relacionarlos ni validarlos como esperabas.
  - **Causa probable:** confundir Dataverse con SharePoint.
  - **Qué hacer:** Dataverse es una base de datos relacional; SharePoint es almacenamiento documental. Usa cada uno para lo que fue pensado.

- **Lo que ves:** algo deja de funcionar o te pide licencia sin que hayas cambiado nada.
  - **Causa probable:** no conocías los límites de la licencia trial (usuarios, llamadas a API, almacenamiento).
  - **Qué hacer:** revisa la documentación de límites del trial antes de planear más práctica sobre él.

### 🧪 Criterios de Validación
- [ ] Ambiente de desarrollo creado y funcional
- [ ] Acceso a Power Apps, Power Automate, Power BI confirmado (Power BI se abre en https://app.powerbi.com)
- [ ] 5+ registros de prueba en tabla Account de Dataverse
- [ ] Comprensión de diferencia entre conectores Standard y Premium
- [ ] Explicar con palabras propias qué es Dataverse y su propósito
- [ ] Identificar los 4 modelos preconstruidos más usados de AI Builder
- [ ] Describir para qué sirve Power Pages y en qué se diferencia de una Canvas App

> Para avanzar al Módulo 2 como principiante, los primeros 5 criterios son suficientes. AI Builder y Power Pages son suplementos opcionales: no los uses como excusa para frenar tu primera práctica.

### 📸 Evidencia para guardar
- Captura del ambiente Developer activo.
- Captura de la tabla Account con 5 registros de prueba.
- Nota breve en tus palabras: "Dataverse sirve para..." en 2-3 líneas.

---

### 📌 Suplemento 1A: AI Builder — Inteligencia Artificial sin código

> **📌 Opcional — puedes volver a esta sección después de completar tu primera práctica.** No es necesario para avanzar al Módulo 2.
>
> **Relevancia PL-900:** ~15% del examen. Capacidad de agregar IA a apps y flujos desde la interfaz, sin entrenar modelos desde cero.

#### 🎯 Objetivo
Comprender qué es AI Builder, sus modelos preconstruidos y cómo integrar IA en apps y flujos sin código de machine learning.

#### 📖 Conceptos Clave
- **Modelos preconstruidos (Prebuilt models):** listos para usar sin datos de entrenamiento propios:
  - *Business Card Reader:* extrae nombre, empresa, correo, teléfono de tarjetas de presentación
  - *Document Processing (Form Processing):* extrae campos estructurados de documentos PDF/imágenes (facturas, contratos)
  - *Category classification:* clasifica texto libre en categorías definidas (soporte técnico, ventas, RR.HH.)
  - *Sentiment Analysis:* analiza el sentimiento de texto como positivo, negativo o neutral
  - *Language Detection:* identifica el idioma de un texto
- **Modelos personalizados (Custom models):** se entrenan con datos propios del negocio; requieren conjunto de datos etiquetados. Incluyen *Object Detection* (detecta objetos en imágenes, ej. inventario, inspección de calidad), que requiere entrenamiento propio y no viene listo para usar sin datos.
- **AI Builder Credits:** moneda de consumo para inferencias de IA. Los créditos se incluyen en licencias Premium de Power Platform o se adquieren por separado
- **Componente AI en Canvas Apps:** control nativo que añade funcionalidad de IA (ej. `AI.BusinessCard.Scanner`) directamente en formularios
- **Acción AI en Power Automate:** paso "AI Builder" que llama un modelo dentro de un flujo automatizado

#### 👨‍💻 Actividad Práctica: Procesar una tarjeta de presentación con AI Builder

**Paso 1 — Explorar el catálogo de modelos:**
1. Ir a [make.powerapps.com](https://make.powerapps.com) → menú lateral → **AI hub**
2. Explorar la galería de modelos preconstruidos; seleccionar **Business Card Reader**
3. Clic en **Try it out** y cargar una imagen de tarjeta de presentación
4. Observar los campos extraídos (nombre, empresa, email, teléfono)

**Paso 2 — Usar AI Builder en Power Automate:**
1. Crear un nuevo Flow: **Instant cloud flow** → disparador manual
2. Agregar paso: buscar **AI Builder** → seleccionar **Extract information from business cards**
3. Conectar con una imagen de ejemplo (archivo adjunto o URL)
4. Agregar paso: **Create a row** en Dataverse para guardar el resultado en una tabla de contactos

**Paso 3 — Explorar el modelo de Document Processing:**
1. En AI hub → **Document processing** → **Explore prebuilt model**
2. Cargar una factura o recibo de ejemplo en PDF
3. Revisar los campos extraídos: número de factura, fecha, total, proveedor

#### 💼 Caso Real de Negocio
Una empresa de logística recibe cientos de albaranes en papel diariamente. Con AI Builder + Power Automate: el proceso manual de transcripción se reemplaza por un flujo que digitaliza el documento al adjuntarlo en Teams, extrae número de guía, proveedor, cantidad y estado, y crea automáticamente el registro en Dataverse — reduciendo el tiempo de registro de 5 minutos a 15 segundos por documento.

#### ✅ Buenas Prácticas
- Usar modelos prebuilt antes de entrenar modelos custom — 70% de casos de negocio se resuelven sin entrenamiento propio
- Para Document Processing custom: recolectar mínimo 5 documentos de muestra por variante de formulario
- Monitorear el consumo de AI Builder Credits desde Power Platform Admin Center

#### ⚠️ Errores Comunes
- **Error**: Usar AI Builder en ambientes sin licencias Premium asignadas → los créditos de prueba se agotan sin aviso
  - **Solución**: Verificar créditos disponibles en Admin Center antes de producción
- **Error**: Esperar que Document Processing funcione en documentos no estructurados (cartas libres)
  - **Solución**: Document Processing es para formularios estructurados repetibles; para texto libre usar Category classification o Azure AI Services

#### 🧪 Criterios de Validación
- [ ] Explorar el catálogo AI hub y probar Business Card Reader con una imagen real
- [ ] Crear un flujo que use al menos un modelo AI Builder prebuilt
- [ ] Explicar qué son los AI Builder Credits y cómo se consumen

---

### 📌 Suplemento 1B: Power Pages — Sitios web externos con Dataverse

> **📌 Opcional — puedes volver a esta sección después de completar tu primera práctica.** No es necesario para avanzar al Módulo 2.
>
> **Relevancia PL-900:** ~10% del examen. Diferencia entre Power Pages y otras herramientas; casos de uso de portales externos.

#### 🎯 Objetivo
Comprender qué es Power Pages, sus capacidades principales y cuándo usarlo en lugar de Canvas Apps o Model-Driven Apps.

#### 📖 Conceptos Clave
- **Power Pages** (antes *Power Apps portals*): plataforma para crear sitios web públicos o con autenticación externa que interactúan con datos de Dataverse
- **Usuarios externos:** personas fuera de la organización (clientes, socios, ciudadanos) que acceden al sitio sin licencia de Microsoft 365
- **Table permissions:** controlan qué tablas de Dataverse puede leer/escribir cada rol de portal (Contact, Basic User, Anonymous User)
- **Webpages, Webforms, Webviews:** componentes de diseño del portal — páginas, formularios y vistas de tabla accesibles desde el sitio
- **Portal Studio / Pages Studio:** editor visual de bajo código para diseñar el sitio, similar al editor de Canvas Apps pero orientado a web externa
- **Authentication providers:** Power Pages soporta Azure AD, Azure AD B2C, LinkedIn, Google, Facebook y proveedor local
- **Liquid templates:** lenguaje de plantillas basado en Liquid (Open Source) para lógica condicional dentro de páginas del portal
- **Capacidades:** 1 sitio por ambiente, con su propia URL (`*.powerappsportals.com` o dominio custom)

#### 💼 Caso Real de Negocio
Un municipio necesita que los ciudadanos puedan registrar solicitudes de permisos de construcción en línea, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. Con Power Pages se crea un portal público donde:
- El ciudadano se registra con su correo (Azure AD B2C)
- Completa un formulario Webform que crea un registro de "Solicitud" en Dataverse
- Visualiza el historial de sus solicitudes mediante una Webview filtrada por su identidad
- El equipo municipal gestiona las solicitudes desde una Model-Driven App interna

#### ✅ Buenas Prácticas
- Configurar Table Permissions **antes** de abrir el portal a usuarios externos — por defecto todo está bloqueado
- Usar HTTPS y dominio personalizado en producción (`portal.municipio.gob`)
- Mantener Liquid templates simples; la lógica compleja debe ir en flujos de Power Automate

#### ⚠️ Errores Comunes
- **Error**: Creer que Power Pages reemplaza a Canvas Apps para usuarios internos
  - **Solución**: Power Pages es para usuarios **externos**; Canvas Apps y Model-Driven Apps son para usuarios **internos** con licencia
- **Error**: No configurar Table Permissions después de crear el portal
  - **Solución**: Sin Table Permissions, todos los datos son inaccesibles desde el portal (error 403)

#### 🧪 Criterios de Validación
- [ ] Explicar la diferencia entre Power Pages, Canvas Apps y Model-Driven Apps
- [ ] Describir un escenario donde Power Pages es la herramienta correcta vs Canvas App
- [ ] Identificar qué son Table Permissions y por qué son necesarias

---
