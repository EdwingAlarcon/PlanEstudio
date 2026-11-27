# AI Builder y Power Pages (opcional)

Material de ampliación del [Módulo 1](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform). No hace falta para
avanzar. La guía de estudio de PL-900 pide describir su valor, así que léelo antes de presentar el examen. El
[Módulo 37](/nivel/arquitecto/modulo/ai-builder-y-azure-ai-integrado) retoma AI Builder para decidir entre opciones.

## AI Builder — Inteligencia Artificial sin código

> **Relevancia PL-900:** la guía de estudio vigente (desde el 24 de julio de 2026) pide describir el valor de la IA generativa en Power Platform y las soluciones con IA en Power Apps. AI Builder no tiene un porcentaje propio en el examen. Lo que aprendes aquí: agregar IA a apps y flujos desde la interfaz, sin entrenar modelos desde cero.

### 🎯 Objetivo
Comprender qué es AI Builder, sus modelos preconstruidos y cómo integrar IA en apps y flujos sin código de machine learning.

### 📖 Conceptos Clave
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

### 👨‍💻 Actividad Práctica: Procesar una tarjeta de presentación con AI Builder

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

### 💼 Caso Real de Negocio
Una empresa de logística recibe cientos de albaranes en papel diariamente. Con AI Builder + Power Automate: el proceso manual de transcripción se reemplaza por un flujo que digitaliza el documento al adjuntarlo en Teams, extrae número de guía, proveedor, cantidad y estado, y crea automáticamente el registro en Dataverse — reduciendo el tiempo de registro de 5 minutos a 15 segundos por documento.

### ✅ Buenas Prácticas
- Prueba primero un modelo preconstruido (prebuilt). Entrena un modelo personalizado (custom) solo si el preconstruido no te sirve.
- Para Document Processing custom: sube al menos 5 documentos de muestra por colección (una colección = documentos con el mismo diseño). Si son escaneos de mala calidad, usa más.
- Revisa el consumo de créditos en el Power Platform admin center.

### ⚠️ Errores Comunes
- **Error**: Usar AI Builder sin revisar qué créditos tiene el ambiente → cuando no quedan AI Builder credits ni Copilot Credits, la función deja de funcionar.
  - **Solución**: Revisa los créditos disponibles en el Admin Center antes de llevar algo a producción.
- **Error**: Esperar que Document Processing funcione en documentos no estructurados (cartas libres)
  - **Solución**: Document Processing es para formularios estructurados repetibles; para texto libre usar Category classification o Azure AI Services

### 🧪 Criterios de Validación
- [ ] Explorar el catálogo AI hub y probar Business Card Reader con una imagen real
- [ ] Crear un flujo que use al menos un modelo AI Builder prebuilt
- [ ] Explicar qué son los AI Builder Credits y cómo se consumen

---

## Power Pages — Sitios web externos con Dataverse

> **Relevancia PL-900:** la guía de estudio vigente (desde el 24 de julio de 2026) solo pide describir el valor de Power Pages para crear sitios web, dentro del dominio "valor de negocio" (5–10% del examen, compartido con las demás piezas). Lo que aprendes aquí: la diferencia entre Power Pages y otras herramientas, y los casos de uso de sitios para usuarios externos.

### 🎯 Objetivo
Comprender qué es Power Pages, sus capacidades principales y cuándo usarlo en lugar de Canvas Apps o Model-Driven Apps.

### 📖 Conceptos Clave
- **Power Pages** (antes *Power Apps portals*): plataforma para crear sitios web públicos o con autenticación externa que interactúan con datos de Dataverse
- **Usuarios externos:** personas fuera de la organización (clientes, socios, ciudadanos) que acceden al sitio sin licencia de Microsoft 365
- **Web roles (roles web) y table permissions:** un rol web es un conjunto de permisos del sitio. Los *table permissions* deciden qué tablas de Dataverse puede leer o escribir cada rol web. Hay un rol para los usuarios que iniciaron sesión (**Authenticated Users**) y otro para los visitantes sin sesión (**Anonymous Users**). Cada usuario externo que se registra queda guardado como un registro de **Contact**. Ojo: **Basic User** no es un rol web; es un rol de seguridad de Dataverse.
- **Páginas, formularios y listas:** las piezas del sitio son las páginas, los **basic forms** (formularios básicos: crean o editan un registro), los **multistep forms** (formularios de varios pasos) y las **lists** (listas: muestran registros a partir de una vista de Dataverse).
- **Design studio:** el editor visual de bajo código donde diseñas el sitio, parecido al editor de Canvas Apps pero para una web externa.
- **Proveedores de identidad (cómo inician sesión los usuarios):** Microsoft Entra ID (el nuevo nombre de Azure AD), Microsoft Entra External ID, Azure AD B2C, cuenta Microsoft, LinkedIn, Facebook, Google, Twitter y la cuenta local (no recomendada). Azure AD B2C dejó de venderse a clientes nuevos el 1 de mayo de 2025: si empiezas hoy, Microsoft recomienda Microsoft Entra External ID.
- **Liquid templates:** lenguaje de plantillas basado en Liquid (Open Source) para lógica condicional dentro de páginas del portal
- **Capacidades:** un ambiente puede tener varios sitios (hasta 50 con las plantillas más comunes), cada uno con su propia URL o un dominio personalizado.

### 💼 Caso Real de Negocio
Un municipio necesita que los ciudadanos puedan registrar solicitudes de permisos de construcción en línea, consultar el estado de su trámite y adjuntar documentos, sin tener que ir en persona. Con Power Pages se crea un portal público donde:
- El ciudadano se registra con su correo (Microsoft Entra External ID)
- Completa un formulario de varios pasos (multistep form) que crea un registro de "Solicitud" en Dataverse
- Visualiza el historial de sus solicitudes en una lista (list) que, con un table permission de tipo **Contact access**, solo le muestra las suyas
- El equipo municipal gestiona las solicitudes desde una Model-Driven App interna

> Fuentes: [Learn: Microsoft Entra External ID con Power Pages](https://learn.microsoft.com/power-pages/security/authentication/entra-external-id), [Learn: multistep forms](https://learn.microsoft.com/power-pages/configure/multistep-form-properties), [Learn: mostrar datos de forma segura (Contact access)](https://learn.microsoft.com/power-pages/getting-started/tutorial-display-data-securely).

### ✅ Buenas Prácticas
- Configurar Table Permissions **antes** de abrir el portal a usuarios externos — por defecto todo está bloqueado
- Usar HTTPS y dominio personalizado en producción (`portal.municipio.gob`)
- Mantener Liquid templates simples; la lógica compleja debe ir en flujos de Power Automate

### ⚠️ Errores Comunes
- **Error**: Creer que Power Pages reemplaza a Canvas Apps para usuarios internos
  - **Solución**: Power Pages es para usuarios **externos**; Canvas Apps y Model-Driven Apps son para usuarios **internos** con licencia
- **Error**: No configurar Table Permissions después de crear el portal
  - **Solución**: Sin Table Permissions, todos los datos son inaccesibles desde el portal (error 403)

### 🧪 Criterios de Validación
- [ ] Explicar la diferencia entre Power Pages, Canvas Apps y Model-Driven Apps
- [ ] Describir un escenario donde Power Pages es la herramienta correcta vs Canvas App
- [ ] Identificar qué son Table Permissions y por qué son necesarias
