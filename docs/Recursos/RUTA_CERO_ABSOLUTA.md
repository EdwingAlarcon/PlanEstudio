# Ruta cero absoluta — antes del Módulo 1

Este recurso es el paso anterior al Módulo 1. Si nunca tocaste Power Platform ni Dynamics 365, léelo
primero — resuelve las preguntas que un principiante se hace *antes* de poder seguir cualquier módulo:
qué es cada cosa, dónde vive, y qué tipo de ambiente necesitas para practicar qué.

**Tipo de práctica de este recurso: conceptual.** No requiere ningún ambiente ni cuenta — es lectura y
dos ejercicios de identificación con las capturas/documentación pública de Microsoft, para llegar al
Módulo 1 ya sabiendo distinguir estas piezas cuando las veas en pantalla.

## Objetivo

Al terminar esto vas a poder explicar, con tus propias palabras, qué es Power Platform, qué es
Dataverse, qué es un tenant, qué es un ambiente, y qué diferencia práctica hay entre un ambiente
Trial, uno Developer, uno Sandbox, uno de Production y un trial de Dynamics 365 — incluyendo qué puedes y qué NO
puedes practicar en cada uno.

## 1. Las piezas, de afuera hacia adentro

Imagina cuatro cajas, una dentro de la otra:

```
Microsoft 365 / Power Platform (el "edificio")
└── Tenant (tu organización dentro del edificio — ej. "Instituto Técnico Andino")
    └── Ambiente / Environment (un piso del edificio, aislado de los demás)
        └── Dataverse (el archivo central de ese piso: las tablas con tus datos)
            └── Apps, flujos, tablas, formularios (lo que construyes ADENTRO de ese piso)
```

| Pieza | Qué es, en una frase | Analogía |
|---|---|---|
| **Power Platform** | La familia de herramientas de Microsoft para crear apps, automatizaciones, reportes y chatbots sin (o con poco) código: Power Apps, Power Automate, Power BI, Copilot Studio. | La caja de herramientas completa. |
| **Dynamics 365** | Aplicaciones de negocio ya construidas sobre Power Platform (Sales, Customer Service, Customer Insights…) que puedes personalizar en vez de construir desde cero. | Muebles ya armados que puedes modificar, en vez de madera cruda. |
| **Dataverse** | La base de datos común donde viven las tablas que usan tanto tus apps de Power Platform como Dynamics 365. Una tabla de "Cuenta" en Dataverse es la misma tabla que usa Dynamics 365 Sales. | El archivo central del edificio — todos los pisos consultan el mismo archivo si así se configura. |
| **Tenant** | Tu organización completa dentro de Microsoft 365/Power Platform. Cuando creas una cuenta de trabajo (ej. `tuNombre@tuOrg.onmicrosoft.com`), esa organización es tu tenant. Un tenant puede tener varios ambientes adentro. | El edificio completo que le pertenece a tu empresa. |
| **Ambiente (Environment)** | Un espacio aislado dentro de tu tenant, con su propia Dataverse, sus propias apps y sus propios datos. Nada de lo que hagas en un ambiente afecta a otro, a menos que lo conectes explícitamente. | Un piso del edificio, con su propia puerta con llave. |

**Por qué importa esto antes del Módulo 1:** el Módulo 1 te pide entrar con una **cuenta de trabajo o
estudio**. Esa cuenta pertenece a una organización: esa organización es tu **tenant**. Dentro de ese
tenant necesitas tu **ambiente del curso con Dataverse**. Desde el 15 de noviembre de 2026 registrarse en
el Power Apps Developer Plan ya no crea un ambiente Developer gratuito
([Developer Plan](https://learn.microsoft.com/power-platform/developer/plan)), así que el camino principal
del curso es un ambiente **Trial (standard) con Dataverse** que creas tú con una licencia Power Apps trial.
Es **temporal**: dura 30 días y admite una sola extensión de 30 días
([Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)). Por eso, desde
el Módulo 2, todo lo que construyas va dentro de tu solución y la exportas al terminar cada módulo o sesión;
cuando el Trial vence, creas otro ambiente e importas la solución. Si tu organización te da un ambiente
Developer **gestionado** o un Sandbox, es mejor opción. El Módulo 1 te da los pasos y un mensaje listo para
pedirlo; el detalle está en [Entornos y trials](/recursos/entornos-y-trials). Ojo: el sandbox gratuito del Microsoft 365 Developer Program no es para todo el mundo; solo lo
reciben suscriptores de Visual Studio Professional o Enterprise, ciertos partners de Microsoft y
empresas con soporte Premier o Unified. Si entiendes la jerarquía de arriba, estos pasos dejan de
sentirse mágicos.

## 2. Los tipos de ambiente que vas a encontrar en este plan

Esta es la tabla que responde "¿puedo practicar esto aquí o no?" — vuelve a ella cada vez que un lab te
pida un tipo de ambiente que no reconozcas.

| Tipo de ambiente | Para qué existe | Qué SÍ puedes practicar ahí | Qué NO puedes practicar ahí |
|---|---|---|---|
| **Trial (standard)** — tu ambiente del curso | El ambiente que creas tú en el Módulo 1 con una licencia Power Apps trial. Uno por usuario. Dura 30 días + una extensión de 30; después se elimina. Solo se puede crear y eliminar: no se puede restablecer, respaldar, restaurar ni copiar (ver [Entornos y trials](/recursos/entornos-y-trials)). | Crear tablas, apps Canvas y Model-Driven, flujos de Power Automate, Power Fx, Dataverse completo — todo el Nivel Básico e Intermedio de este plan, exportando tu solución para llevarla al ambiente siguiente. | Guardar tu trabajo más allá de su vencimiento (para eso exportas la solución), operaciones de copia/restablecimiento/respaldo, escenarios con varios usuarios reales simultáneos o licencias Dynamics 365 completas. |
| **Developer** | Un ambiente personal de desarrollo. Desde noviembre de 2026 solo existe **gestionado** (Managed Environment): uno por usuario, lo asigna un administrador y para ejecutar apps y flujos en él necesitas licencia premium. Si tu organización te da uno, es la mejor opción para el curso. Los Developer no gestionados creados antes del 15 nov 2026 se suspenden el 15 dic 2026. | Lo mismo que en el Trial, sin la caducidad de 30 días. | Escenarios que requieren varios usuarios reales simultáneos, licencias Dynamics 365 completas (Sales/Customer Service como producto, no solo la tabla), o volumen de datos realista de una empresa. |
| **Sandbox** | Una copia de "casi producción" para probar cambios antes de que lleguen a los usuarios reales — típico en una empresa con un equipo de Power Platform. | Probar soluciones empaquetadas, validar Business Process Flows con datos de prueba, ensayar una migración antes de aplicarla en Production. | Nada que dependa de datos reales de clientes — un Sandbox usa datos de prueba, no datos de producción reales. |
| **Production** | El ambiente que usan de verdad los empleados/clientes de una empresa. | Nada, en este plan — **nunca vas a practicar directamente en Production**, ni el propio equipo del curso lo hace fuera de un contexto laboral real y gobernado. | Cualquier práctica de aprendizaje. Si un lab menciona Production, es para que entiendas el concepto, no para que operes uno. |
| **Trial de Dynamics 365** | Una licencia temporal (normalmente 30 días) que te da acceso a un producto completo de Dynamics 365 (Sales, Customer Service, Customer Insights…) sobre un ambiente nuevo, para poder practicar la app real y no solo sus tablas en Dataverse. | Todo lo que pidan los labs marcados "requiere trial": crear leads/oportunidades en Sales, casos/colas/SLA en Customer Service, segmentos en Customer Insights. | Escenarios de integración con sistemas reales de una empresa (pasarela de pagos real, ERP real) — eso queda como diseño documentado, no ejecución. |

**Regla rápida:** si un módulo o lab no dice nada especial, asume que necesitas tu **ambiente
del curso** (el que creas en el Módulo 1). Si dice explícitamente "requiere trial de Dynamics 365",
necesitas activar el trial del producto correspondiente — el Módulo 1 y los módulos de Dynamics 365
(57 en adelante) te dicen exactamente cuándo y cómo.

## 3. Ejercicio de identificación (antes de seguir al Módulo 1)

No necesitas ningún ambiente para esto — es reconocimiento visual.

1. Abre la página en español [Información general sobre entornos de Power Platform](https://learn.microsoft.com/es-es/power-platform/admin/environments-overview). En la documentación en español, **inquilino** significa tenant y **entorno** significa ambiente.
2. Busca el diagrama de la empresa de ejemplo **Contoso Corporation**. Identifica cuál es el tenant (inquilino) y cuenta cuántos ambientes (entornos) tiene adentro. Después busca la tabla **Tipos de entorno** y anota qué dice de **Prueba** (Trial: cuántos días dura) y de **Desarrollador** (Developer).
3. Escribe, en tus propias palabras (2-3 líneas), qué pasaría si confundieras un ambiente Sandbox con uno de Production al momento de probar algo nuevo.

**Evidencia esperada:** las 2-3 líneas del punto 3, guardadas en tu bitácora de estudio (la misma que usarás para las evidencias de labs más adelante).

## Errores comunes

- **Error:** pensar que "tenant" y "ambiente" son lo mismo. **Por qué pasa:** ambos se sienten como "mi cuenta de trabajo". **Cómo evitarlo:** recuerda la jerarquía — un tenant puede tener varios ambientes; nunca es al revés.
- **Error:** creer que necesitas un trial de Dynamics 365 desde el Módulo 1. **Por qué pasa:** el nombre "Dynamics 365" suena como el destino final del plan. **Cómo evitarlo:** el trial solo hace falta a partir del nivel transversal D365 (Módulo 57 en adelante); todo el Nivel Básico e Intermedio corre en tu ambiente del curso.
- **Error:** practicar sobre un ambiente de Production real (el de tu trabajo, si ya tienes uno) "para no perder tiempo creando uno nuevo". **Por qué pasa:** parece un atajo razonable. **Cómo evitarlo:** nunca — usa siempre tu ambiente del curso personal para este plan, sin excepción.
- **Error:** trabajar semanas en tu Trial sin exportar la solución. **Por qué pasa:** el ambiente parece permanente. **Cómo evitarlo:** exporta tu solución al terminar cada módulo o sesión y pide la extensión en la última semana; ver [Entornos y trials](/recursos/entornos-y-trials).

## Criterio de aprobación

Puedes seguir al Módulo 1 cuando puedas responder, sin mirar la tabla, estas 3 preguntas:

- [ ] ¿Qué diferencia hay entre un tenant y un ambiente?
- [ ] ¿En qué ambiente vas a hacer casi todas las prácticas de este plan?
- [ ] ¿Cuándo vas a necesitar activar un trial de Dynamics 365, y por qué no antes?

Si alguna te cuesta, vuelve a la sección 2 antes de empezar el Módulo 1 — el resto del plan asume que
estos términos ya no te generan dudas.

## Siguiente paso

→ [Módulo 1 — Introducción al Ecosistema Power Platform](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform)
