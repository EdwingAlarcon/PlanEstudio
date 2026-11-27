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

> **⚠️ Tu ambiente del curso es temporal.** Un ambiente **Trial con Dataverse** dura **30 días** y admite **una sola extensión de 30 días**, que solo puedes pedir en la última semana ([Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)). Desde el 15 de noviembre de 2026 el Power Apps Developer Plan ya no crea un ambiente gratuito. Por eso, **exporta tu solución al terminar cada módulo** ([cómo hacerlo](/recursos/entornos-y-trials)).

**Paso 1 — Una cuenta de trabajo o estudio.** No sirve un correo personal (Gmail, Outlook.com, Hotmail). Si no tienes una, o tu organización te bloquea algo, ve a [Entornos y trials](/recursos/entornos-y-trials): allí están las otras vías y el mensaje para pedir un ambiente a TI.

**Paso 2 — Activa la licencia Power Apps trial.**
1. Abre https://apps.powerapps.com/trial e inicia sesión con esa cuenta.
2. Sigue el asistente hasta la confirmación. La licencia dura 30 días y se puede extender dos veces.

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

**Ejemplo pequeño:** aprobar una solicitud es trabajo de Power Automate; ver cuántas se aprobaron por mes, de Power BI; capturarla desde el celular, de Power Apps. Los datos de las tres viven en Dataverse.

**Ahora haz algo — micropráctica (6 min):** **[Elegir las piezas de Power Platform para un caso](/practica/ip-dv-005-elegir-piezas-para-un-caso)**. Incluye decidir cuáles NO hacen falta.

**Práctica real en tu entorno (10 min):**

1. En make.powerapps.com recorre el menú lateral: **Home**, **Create**, **Apps**, **Tables** y **More** (ahí está lo que no veas).
2. Abre **Connections** (o búscalo en **More**) y selecciona **New connection** para ver la lista de conectores. No crees ninguno.
3. Busca en la [lista oficial de conectores](https://learn.microsoft.com/connectors/connector-reference/) uno Standard y uno Premium (los Premium llevan el ícono **Premium**).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Un conector Standard y uno Premium (nombre exacto) | ___ |
| Una forma de empezar una app que viste en **Create** | ___ |

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

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: ahora los dueños reservan por su cuenta](/practica/ip-dv-006-transferir-reserva-externa)**. Cambia un requisito del caso de la clínica y decides qué cambia.

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
- Usar tu ambiente del curso (Trial, Developer o Sandbox) para pruebas, nunca directamente en Production
- Exportar tu solución al terminar cada módulo o sesión y guardarla fuera del ambiente: tu ambiente del curso caduca
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
- Captura de tu ambiente del curso activo, con su tipo y su fecha de vencimiento (**Day(s) remain**).
- Captura de la tabla Account con 5 registros de prueba.
- Nota breve en tus palabras: "Dataverse sirve para..." en 2-3 líneas.

---

### 📌 Suplemento 1A: AI Builder — Inteligencia Artificial sin código

> **📌 Opcional — puedes volver a esta sección después de completar tu primera práctica.** No es necesario para avanzar al Módulo 2.
>
> **Relevancia PL-900:** la guía de estudio vigente (desde el 24 de julio de 2026) pide describir el valor de la IA generativa en Power Platform y las soluciones con IA en Power Apps. AI Builder no tiene un porcentaje propio en el examen. Lo que aprendes aquí: agregar IA a apps y flujos desde la interfaz, sin entrenar modelos desde cero.

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
- **Créditos para AI Builder:** cada uso de un modelo de IA consume créditos. Microsoft está retirando los *AI Builder credits*: desde el 1 de noviembre de 2026 las licencias premium nuevas ya no los traen (los que ya tienes se respetan hasta que termine tu contrato). Las funciones de AI Builder siguen funcionando: cuando no hay AI Builder credits, consumen **Copilot Credits**. Si no hay ninguno de los dos, la función se bloquea.
- **Componente AI en Canvas Apps:** controles que agregan IA a una app sin código, por ejemplo el **Business card reader** (lector de tarjetas de presentación). Al insertarlo recibe un nombre como `BusinessCardReader1`, y lees lo que extrajo con fórmulas como `BusinessCardReader1.FullName`.
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
- Prueba primero un modelo preconstruido (prebuilt). Entrena un modelo personalizado (custom) solo si el preconstruido no te sirve.
- Para Document Processing custom: sube al menos 5 documentos de muestra por colección (una colección = documentos con el mismo diseño). Si son escaneos de mala calidad, usa más.
- Revisa el consumo de créditos en el Power Platform admin center.

#### ⚠️ Errores Comunes
- **Error**: Usar AI Builder sin revisar qué créditos tiene el ambiente → cuando no quedan AI Builder credits ni Copilot Credits, la función deja de funcionar.
  - **Solución**: Revisa los créditos disponibles en el Admin Center antes de llevar algo a producción.
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
> **Relevancia PL-900:** la guía de estudio vigente (desde el 24 de julio de 2026) solo pide describir el valor de Power Pages para crear sitios web, dentro del dominio "valor de negocio" (5–10% del examen, compartido con las demás piezas). Lo que aprendes aquí: la diferencia entre Power Pages y otras herramientas, y los casos de uso de sitios para usuarios externos.

#### 🎯 Objetivo
Comprender qué es Power Pages, sus capacidades principales y cuándo usarlo en lugar de Canvas Apps o Model-Driven Apps.

#### 📖 Conceptos Clave
- **Power Pages** (antes *Power Apps portals*): plataforma para crear sitios web públicos o con autenticación externa que interactúan con datos de Dataverse
- **Usuarios externos:** personas fuera de la organización (clientes, socios, ciudadanos) que acceden al sitio sin licencia de Microsoft 365
- **Web roles (roles web) y table permissions:** un rol web es un conjunto de permisos del sitio. Los *table permissions* deciden qué tablas de Dataverse puede leer o escribir cada rol web. Hay un rol para los usuarios que iniciaron sesión (**Authenticated Users**) y otro para los visitantes sin sesión (**Anonymous Users**). Cada usuario externo que se registra queda guardado como un registro de **Contact**. Ojo: **Basic User** no es un rol web; es un rol de seguridad de Dataverse.
- **Páginas, formularios y listas:** las piezas del sitio son las páginas, los **basic forms** (formularios básicos: crean o editan un registro), los **multistep forms** (formularios de varios pasos) y las **lists** (listas: muestran registros a partir de una vista de Dataverse).
- **Design studio:** el editor visual de bajo código donde diseñas el sitio, parecido al editor de Canvas Apps pero para una web externa.
- **Proveedores de identidad (cómo inician sesión los usuarios):** Microsoft Entra ID (el nuevo nombre de Azure AD), Microsoft Entra External ID, Azure AD B2C, cuenta Microsoft, LinkedIn, Facebook, Google, Twitter y la cuenta local (no recomendada). Azure AD B2C dejó de venderse a clientes nuevos el 1 de mayo de 2025: si empiezas hoy, Microsoft recomienda Microsoft Entra External ID.
- **Liquid templates:** lenguaje de plantillas basado en Liquid (Open Source) para lógica condicional dentro de páginas del portal
- **Capacidades:** un ambiente puede tener varios sitios (hasta 50 con las plantillas más comunes), cada uno con su propia URL o un dominio personalizado.

#### 💼 Caso Real de Negocio
Un municipio necesita que los ciudadanos puedan registrar solicitudes de permisos de construcción en línea, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. Con Power Pages se crea un portal público donde:
- El ciudadano se registra con su correo (Microsoft Entra External ID)
- Completa un formulario de varios pasos (multistep form) que crea un registro de "Solicitud" en Dataverse
- Visualiza el historial de sus solicitudes en una lista (list) que, con un table permission de tipo **Contact access**, solo le muestra las suyas
- El equipo municipal gestiona las solicitudes desde una Model-Driven App interna

> Fuentes: [Learn: Microsoft Entra External ID con Power Pages](https://learn.microsoft.com/power-pages/security/authentication/entra-external-id), [Learn: multistep forms](https://learn.microsoft.com/power-pages/configure/multistep-form-properties), [Learn: mostrar datos de forma segura (Contact access)](https://learn.microsoft.com/power-pages/getting-started/tutorial-display-data-securely).

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
