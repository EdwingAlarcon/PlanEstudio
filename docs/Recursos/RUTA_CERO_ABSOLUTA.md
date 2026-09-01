# Ruta cero absoluta — antes del Módulo 1

Esta guía es para alguien que llega sin saber nada de Power Platform ni de Dynamics 365: ni qué son,
ni con qué se practica, ni por qué hace falta una cuenta especial para empezar. Léela **antes** del
Módulo 1. No sustituye ningún módulo — te da el vocabulario y el ambiente de trabajo que todos los
módulos dan por hecho.

Tipo de práctica de esta guía: **conceptual** (no hay ejercicio ejecutable aquí; el primer ejercicio
ejecutable es el Módulo 1 y el [Lab 01](/labs/lab-01), ambos en un ambiente Developer).

## 1. ¿Qué es Power Platform?

**Objetivo**: poder explicar en una frase qué es Power Platform y nombrar sus 4 piezas principales.

**Explicación clara**: Power Platform es un conjunto de herramientas de Microsoft para construir
aplicaciones de negocio, automatizar procesos y analizar datos **sin escribir todo el código a
mano** (aunque se puede extender con código cuando hace falta). Sus 4 piezas:

- **Power Apps** — construir aplicaciones (formularios, pantallas, botones) que leen y escriben datos.
- **Power Automate** — automatizar procesos ("cuando pase X, haz Y automáticamente").
- **Power BI** — analizar y visualizar datos en dashboards.
- **Power Pages / Copilot Studio** — sitios web públicos y chatbots conectados a los mismos datos.

Todas estas piezas, casi siempre, leen y escriben datos en un lugar común: **Dataverse**.

**Pasos**: no hay pasos ejecutables en esta sección — es lectura previa.

**Práctica**: conceptual.

**Evidencia esperada**: ninguna todavía. La primera evidencia real llega en el Módulo 1.

**Errores comunes**:
- Pensar que Power Apps y Power Automate son productos separados sin relación — comparten el mismo
  dato en Dataverse la mayoría de las veces.
- Confundir Power Platform con Microsoft 365 (Word, Excel, Teams) — son familias de producto
  distintas que **sí** se integran entre sí, pero no son lo mismo.

**Criterio de aprobación**: puedes nombrar las 4 piezas de Power Platform y decir cuál sirve para
qué, sin ver esta página.

## 2. ¿Qué es Dataverse?

**Objetivo**: entender qué es Dataverse y por qué casi todo el curso gira alrededor de él.

**Explicación clara**: Dataverse es la base de datos de negocio de Microsoft — guarda información en
**tablas** (como una hoja de cálculo con reglas), pero con seguridad, relaciones entre tablas,
validaciones y lógica de negocio ya integradas. Cuando una Power App muestra un formulario de
"Clientes", casi siempre está leyendo y escribiendo en una tabla de Dataverse. Dynamics 365 (Sales,
Customer Service, etc.) **también corre sobre Dataverse** — son apps ya construidas encima de las
mismas tablas que tú puedes usar en Power Apps.

Ver también la guía completa: [Fundamentos de Dataverse desde cero](/recursos/fundamentos-dataverse).

**Práctica**: conceptual.

**Errores comunes**: pensar que Dataverse es "una base de datos SQL más" — técnicamente corre sobre
SQL, pero se administra distinto (sin escribir SQL a mano en el 90% de los casos) y trae seguridad y
lógica de negocio que una base SQL vacía no trae.

**Criterio de aprobación**: puedes explicar por qué una Power App y una app de Dynamics 365 pueden
compartir el mismo cliente sin duplicar datos.

## 3. ¿Qué es un tenant?

**Objetivo**: entender qué es un tenant y ubicar el tuyo.

**Explicación clara**: un tenant es tu organización completa dentro de Microsoft 365 / Power
Platform — se identifica con un dominio como `tunombreXXXXX.onmicrosoft.com`. Todo lo que crees
(ambientes, apps, usuarios, datos) vive dentro de tu tenant. Cuando el curso dice "necesitas un
tenant", significa que necesitas esta organización de prueba creada — no una cuenta personal de
Outlook o Gmail.

**Pasos**:
1. Si todavía no tienes tenant, sigue la sección "Antes de instalar nada: tu cuenta y tu tenant" en
   la [Guía de herramientas de estación de trabajo](/recursos/guia-herramientas-workstation) — crea
   una cuenta Microsoft 365 Developer gratuita.
2. Confirma tu tenant: entra a [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
   y mira la esquina superior derecha — ahí aparece tu dominio de tenant.

**Práctica**: **ejecutable en Developer environment** (crear el tenant es el primer paso ejecutable
real del curso).

**Evidencia esperada**: captura de pantalla del Admin Center mostrando tu dominio de tenant.

**Errores comunes**: crear dos tenants sin darse cuenta (probando dos veces el registro) y no saber
en cuál está el trabajo — si esto pasa, revisa el correo de bienvenida de cada registro para ver cuál
dominio corresponde a cuál intento.

**Criterio de aprobación**: sabes tu dominio de tenant de memoria o sabes exactamente dónde
consultarlo en 10 segundos.

## 4. ¿Qué es un ambiente (environment)?

**Objetivo**: entender qué es un ambiente y por qué Power Platform los separa.

**Explicación clara**: un tenant puede tener **varios ambientes** — cada ambiente es un espacio
aislado con sus propias tablas, apps y datos. Es como tener varias "salas" dentro del mismo edificio
(tenant): lo que pasa en una sala no afecta a las otras. Esto existe para que puedas experimentar,
romper cosas y aprender sin arriesgar datos reales de una empresa.

**Práctica**: conceptual.

**Errores comunes**: pensar que "ambiente" y "tenant" son sinónimos — un tenant casi siempre tiene
más de un ambiente.

**Criterio de aprobación**: puedes dibujar (en papel o mentalmente) un tenant con 2-3 ambientes
dentro y explicar por qué están separados.

## 5. Developer, Sandbox, Production y trial — diferencias reales

**Objetivo**: distinguir los 4 tipos de ambiente que el curso menciona y saber cuál usar en cada
práctica.

| Tipo de ambiente | Para qué sirve | Cómo se consigue | Qué puedes practicar ahí | Qué NO puedes practicar todavía |
|---|---|---|---|---|
| **Developer** | Tu espacio personal de aprendizaje y desarrollo | Automático al crear tu cuenta Microsoft 365 Developer (gratis, ilimitado en el tiempo) | Todo Power Apps, Power Automate, Dataverse: tablas, formularios, vistas, flujos, seguridad básica, soluciones. La gran mayoría de los labs de este curso. | Escenarios con múltiples usuarios reales simultáneos, cargas de datos masivas, integraciones con sistemas productivos de una empresa real. |
| **Trial de Dynamics 365** | Probar apps completas de Dynamics 365 (Sales, Customer Service, Customer Insights) con datos de ejemplo (Contoso) | Se activa dentro de tu mismo tenant, desde el Power Platform Admin Center, por tiempo limitado (usualmente 30 días, renovable) | Configuración inicial de Sales/Customer Service, procesos lead-to-opportunity, casos y colas, Customer Insights con datos de ejemplo | Escenarios de licenciamiento real de producción, volúmenes de datos de una operación real, ciertos conectores premium que requieren licencia pagada |
| **Sandbox** | Ambiente de pre-producción de una organización real, para probar cambios antes de llevarlos a Production | Lo crea un administrador de una organización con licencia real; normalmente no lo tendrás como estudiante independiente | (fuera del alcance de este curso salvo mención conceptual) | No confundir con Developer — Sandbox es de una organización real, no tuyo |
| **Production** | Donde vive el trabajo real de una empresa, con usuarios y datos reales | Solo existe en una organización real con licencias compradas | (fuera del alcance de este curso salvo mención conceptual) | Nunca practiques cambios sin probar aquí — es la razón de ser de Sandbox/Developer |

**Explicación clara**: el 95% del curso ocurre en tu ambiente **Developer** (gratis, tuyo, permanente).
Un puñado de labs de Dynamics 365 (Sales, Customer Service, Customer Insights, y todos los labs
marcados **F&O**) necesitan el **trial de Dynamics 365** porque esas apps completas no vienen
preinstaladas en el Developer básico. **Sandbox** y **Production** son términos que vas a escuchar en
el mundo laboral real (y se explican en el Módulo de ALM/gobernanza), pero no son ambientes que tú
crees como estudiante — no son parte de la práctica ejecutable de este curso.

**Práctica**: conceptual (esta tabla) + ejecutable en Developer environment (crear tu ambiente,
Módulo 1) + ejecutable en trial Dynamics 365 (cuando un lab lo indique explícitamente en sus
prerrequisitos).

**Cómo saber qué necesita cada lab**: cada lab dice en su sección de prerrequisitos si necesita
"ambiente Developer" (ya lo tienes) o "ambiente trial/demo de Dynamics 365" (actívalo cuando llegues
ahí, no antes — así no vence antes de usarlo). Ver [Taxonomía de tipos de práctica](/recursos/tipos-de-practica)
para el criterio completo por tipo de lab.

**Errores comunes**:
- Activar el trial de Dynamics 365 muy pronto — tiene fecha de vencimiento; actívalo justo antes del
  lab que lo requiere, no en la semana 1.
- Creer que necesitas Sandbox o Production para aprender — no las necesitas para ningún lab de este
  curso.

**Criterio de aprobación**: dado el nombre de cualquier lab del curso, puedes predecir si necesita
solo tu ambiente Developer o si necesita activar el trial de Dynamics 365, revisando sus
prerrequisitos.

## 6. Qué puedes practicar ya, y qué no

**Con solo tu ambiente Developer (disponible desde el día 1):**
- Todo Power Apps (Canvas y Model-driven), todo Power Automate, todo Dataverse básico y avanzado
  (tablas, formularios, vistas, reglas de negocio, seguridad, soluciones).
- La ruta de fundamentos CRM conceptuales (cliente, cuenta, contacto, lead, oportunidad, caso).

**Con el trial de Dynamics 365 (actívalo cuando el lab lo pida):**
- Configuración real de Sales, Customer Service y Customer Insights con datos de ejemplo.
- Procesos completos lead-to-opportunity y de atención al cliente con la app real, no solo su modelo
  de datos.

**Fuera del alcance de este curso como práctica ejecutable (solo awareness conceptual):**
- Finance & Operations (F&O) — requiere un ambiente distinto (LCS demo) que no es parte del flujo
  estándar de este curso; los labs 93-100 lo marcan explícitamente como opcional y requieren ese
  ambiente aparte.
- Contact Center (voz, canales, routing) — requiere licenciamiento y configuración de telefonía que
  no está disponible en un trial estándar; se cubre como introducción conceptual, no como práctica de
  producción.
- Cualquier escenario de tenant real de una empresa — eso se practica en el trabajo, no en este curso.

**Práctica**: conceptual (esta tabla resumen).

**Criterio de aprobación**: antes de empezar el Módulo 1, puedes decir de memoria qué SÍ vas a poder
practicar de forma ejecutable en las próximas semanas, y qué queda fuera del alcance realista del
curso.

## Siguiente paso

Con esto ya tienes el vocabulario mínimo. Continúa con:
1. [Fundamentos funcionales CRM](/recursos/fundamentos-crm) — para entender qué significan cliente,
   cuenta, contacto, lead, oportunidad, caso, cola, SLA.
2. [Fundamentos de Dataverse desde cero](/recursos/fundamentos-dataverse) — para entender tablas,
   columnas, relaciones, formularios, vistas.
3. [Módulo 1 — Introducción al ecosistema Power Platform](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform)
   — tu primer módulo real, con tu primera práctica ejecutable.
