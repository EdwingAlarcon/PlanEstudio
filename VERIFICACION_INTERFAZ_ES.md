# Verificación de etiquetas de interfaz en español (20 minutos con un tenant)

Lista para confirmar en un tenant real las etiquetas que Microsoft Learn en español no permitió verificar. Al confirmar
una, edita `app-elearning/src/data/ui-terms.ts`: pon el texto exacto en `es` y `verified: true` (si no existe, añade la
entrada). Solo las verificadas se muestran a los alumnos.

## Preparación (3 min)

1. Abre una ventana privada con el navegador en español (Configuración del navegador > Idiomas > Español primero).
2. Entra en <https://make.powerapps.com> con tu cuenta del curso. Si el portal sigue en inglés: **Settings** (engranaje) >
   idioma, o el idioma del perfil de Microsoft 365 (<https://myaccount.microsoft.com> > Configuración e idioma).
3. Power Automate tiene su propio ajuste: **Settings > Choose display language**. Puede tardar unos minutos en aplicarse.

Anota el texto **exacto** que ves (mayúsculas, tildes, "Agregar" frente a "Añadir").

## 1. Power Apps y Dataverse (5 min) — make.powerapps.com

| Inglés | Propuesta | Dónde mirarlo | Texto real |
|---|---|---|---|
| Layout | Diseño | Crear app canvas desde datos, panel de pantallas | |
| Enable quick create forms | Habilitar formularios de creación rápida | Tablas > (tabla) > Propiedades > Opciones avanzadas | |
| Currency | Moneda / Divisa | Nueva columna > Tipo de datos | |
| Many-to-one | Varios a uno / Muchos a uno | Tabla > Relaciones > Nueva relación | |
| Card | Formulario de tarjeta | Tabla > Formularios > Nuevo formulario | |
| Table (advanced properties) | Editar propiedades de la tabla | Tablas > (tabla) > Propiedades | |
| Download | Descargar | Soluciones > Exportar | |
| Label | — | Panel de propiedades de un control | |
| View as (Power Apps) | — | Formulario de app model-driven | |
| Preview | Vista previa | Barra de Power Apps Studio | |

## 2. Power Platform admin center (3 min) — admin.powerplatform.microsoft.com

| Inglés | Propuesta | Dónde mirarlo | Texto real |
|---|---|---|---|
| Trial | Prueba | Entornos > Nuevo > Tipo | |
| Start Auditing | Activar auditoría | Entorno > Configuración > Auditoría | |

## 3. Power Automate de nube (4 min) — make.powerautomate.com

| Inglés | Propuesta | Dónde mirarlo | Texto real |
|---|---|---|---|
| Cloud flow | Flujo de nube | Crear | |
| Run history | Historial de ejecuciones | Detalle de un flujo | |
| Send an email (V2) | Enviar un correo electrónico (V2) | Acción de Office 365 Outlook | |
| Scope | Ámbito | Acción de control | |
| Change type | Cambiar tipo | Desencadenador de Dataverse | |
| Asynchronous response | Respuesta asincrónica | Configuración de la acción Responder | |

## 4. Copilot Studio (4 min) — copilotstudio.microsoft.com

| Inglés | Propuesta | Dónde mirarlo | Texto real |
|---|---|---|---|
| Ask a question | Hacer una pregunta | Tema > + Agregar nodo | |
| Send a message | Enviar un mensaje | Tema > + Agregar nodo | |
| All other conditions | Todas las demás condiciones | Nodo de condición | |
| Trigger phrases | Frases desencadenadoras | Desencadenador de un tema | |
| Redirect | Redirigir | + Agregar nodo > Administración de temas | |
| Escalate | Escalar / Elevar | Temas del sistema | |
| When an agent calls the flow | Cuando un agente llama al flujo | Agregar flujo de agente | |
| Respond to the agent | Responder al agente | Flujo de agente | |
| Add a tool | Agregar herramienta | Herramientas | |
| Knowledge | Conocimiento | Menú superior del agente | |
| Channels | Canales | Menú superior del agente | |
| Test your agent | Probar el agente | Panel de prueba | |

## 5. Dynamics 365 (solo si tienes una prueba de Sales o Customer Service)

La documentación en español de Microsoft deja esta interfaz en inglés, así que aquí no hay propuesta fiable.
Anota el texto real de: **Close as Won**, **Qualify**, **Opportunities**, **Quotes**, **Cases**, **Queues**,
**Resolve Case**, **Knowledge articles**, **Entitlements**, **SLAs**.

## 6. Power Automate Desktop (opcional)

**Get credential**, **First line contains column names** (acción Read from CSV file).
