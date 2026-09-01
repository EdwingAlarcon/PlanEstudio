# Tipos de práctica — qué significa cada etiqueta

Cada actividad de PlanEstudio (módulo, lab, práctica interactiva o profesional) es uno de estos 5
tipos. Esta página es la referencia única — si un lab o módulo no dice explícitamente cuál es, usa
esta tabla para deducirlo por sus prerrequisitos.

## Las 5 categorías

| Tipo | Qué significa | Qué necesitas | Ejemplo en el curso |
|---|---|---|---|
| **Conceptual** | Solo lectura y razonamiento — no hay ejecución en ninguna herramienta | Nada, ni siquiera un ambiente Developer | [Ruta cero absoluta](/recursos/ruta-cero-absoluta), [Fundamentos CRM](/recursos/fundamentos-crm) |
| **Simulada** | Ejercicio interactivo dentro de la app de PlanEstudio (decisión múltiple, flow builder, query playground, debug scenario) que imita una situación real sin tocar Power Platform de verdad | Nada externo — corre dentro de `/practica` | Las 15 prácticas interactivas del pilar Interactive Practice |
| **Ejecutable en Developer environment** | Se hace de verdad en Power Platform, dentro de tu ambiente Developer gratuito (Power Apps, Power Automate, Dataverse) | Tu ambiente Developer (gratis, ver [Ruta cero absoluta](/recursos/ruta-cero-absoluta)) | La gran mayoría de los labs de los niveles Básico a Arquitecto (ej. Lab 02, Lab 09) |
| **Ejecutable en trial Dynamics 365** | Se hace de verdad, pero necesita una app completa de Dynamics 365 (Sales, Customer Service, Customer Insights) que no viene en el Developer básico — requiere activar el trial de 30 días | Trial de Dynamics 365 activo en tu tenant (ver Ruta cero absoluta, sección 5) | Labs del nivel D365 sobre Sales, Customer Service, Customer Insights |
| **Requiere tenant/ambiente compatible** | Necesita algo que va más allá de un trial estándar — un ambiente LCS demo de F&O, licenciamiento de voz/canales de Contact Center, o un tenant real de una organización | Ambiente específico no incluido en el flujo estándar del curso — marcado como opcional/awareness | Labs F&O (93-100), labs de Contact Center con canales de voz reales |

## Cómo identificar el tipo de un lab hoy

Los labs de este curso **no traen un campo de frontmatter dedicado** para esto todavía — el tipo de
ambiente que necesitan vive en texto libre dentro de su sección de **prerrequisitos**. Mientras eso
se resuelve con un campo estructurado, usa esta regla práctica al abrir cualquier lab:

1. Si sus prerrequisitos no mencionan ningún ambiente externo → es **ejecutable en Developer
   environment** (el caso por defecto de casi todos los labs de Básico a Arquitecto).
2. Si dice "trial de Dynamics 365", "ambiente Sales/Customer Service activo" o similar → es
   **ejecutable en trial Dynamics 365**.
3. Si dice "ambiente trial/demo de Dynamics 365 Finance & Supply Chain Management (LCS)" o menciona
   F&O explícitamente → es **requiere tenant/ambiente compatible** (F&O), tratado como opcional.
4. Si dice "canales de voz", "licenciamiento de Contact Center" o similar → es **requiere
   tenant/ambiente compatible** (Contact Center), tratado como opcional/introductorio.
5. Si vive dentro de `/practica` (Multiple Decision, Flow Builder, Query Playground, Debug Scenario)
   → es **simulada**.

## Por qué esto importa

Antes de empezar cualquier lab, confirma su tipo con esta lista — evita el peor bloqueo posible:
llegar a un lab marcado "requiere tenant/ambiente compatible" (F&O o Contact Center) esperando poder
hacerlo con tu Developer environment gratuito, y descubrir a mitad de camino que necesitas un ambiente
que no tienes. Los labs F&O y Contact Center son **opcionales** para la ruta laboral principal de este
curso (Power Platform + Dataverse + Dynamics 365 Customer Engagement) — puedes saltarlos sin que
bloqueen tu progreso ni tu portafolio.
