# Fundamentos de Dataverse — desde cero

Guía puente entre la [Ruta cero absoluta](/recursos/ruta-cero-absoluta) y el Módulo 2 (donde ya
construyes tablas de verdad). Si nunca trabajaste con una base de datos de negocio, esto te da el
vocabulario mínimo para no perderte en el primer módulo práctico.

Tipo de práctica de esta guía: **conceptual**. La primera práctica ejecutable sobre estos conceptos
es el Módulo 2 y el Lab 02, en tu ambiente Developer.

## 1. Tablas (Tables)

**Objetivo**: entender qué es una tabla en Dataverse.

**Explicación clara**: una tabla es como una hoja de cálculo con reglas — cada tabla representa un
"tipo de cosa" (Cuenta, Contacto, Producto, tu propia tabla "Solicitud"). Cada **fila** es un
registro individual (una cuenta específica). Dataverse ya trae tablas estándar (Cuenta, Contacto,
Caso...) y te deja crear tablas **personalizadas** para tu propio negocio.

**Pasos**: no ejecutables aún — se practican en el Módulo 2.

**Práctica**: conceptual.

**Errores comunes**: crear una tabla personalizada para algo que ya existe como tabla estándar
(ejemplo: crear "Mi Cliente" cuando ya existe Cuenta/Contacto) — duplica esfuerzo y rompe
integraciones futuras con apps que ya esperan las tablas estándar.

**Criterio de aprobación**: dado un requerimiento de negocio, decides si necesitas una tabla estándar
existente o una tabla personalizada nueva, y justificas por qué.

## 2. Columnas (Columns)

**Objetivo**: entender los tipos de columna más comunes.

**Explicación clara**: cada columna de una tabla tiene un **tipo de dato** que define qué se puede
guardar ahí: texto, número, fecha, sí/no, opción (choice/picklist), o **búsqueda (lookup)** — una
columna que apunta a un registro de otra tabla (esto es lo que crea las relaciones, ver punto 3).

**Práctica**: conceptual + ejecutable en Developer environment desde el Módulo 2.

**Errores comunes**: usar texto libre para algo que debería ser una opción fija (choice) — ejemplo:
guardar "Prioridad" como texto libre permite escribir "Alta", "alta", "ALTA", "Urgente" sin
consistencia; un choice fuerza valores válidos.

**Criterio de aprobación**: dado un campo de negocio ("estado de una solicitud: Nueva, En proceso,
Cerrada"), eliges el tipo de columna correcto (choice, no texto libre).

## 3. Relaciones (Relationships)

**Objetivo**: entender cómo se conectan las tablas entre sí.

**Explicación clara**: una relación conecta dos tablas mediante una columna de búsqueda. La más común
es **1 a muchos**: una Cuenta puede tener muchos Contactos, pero cada Contacto pertenece (usualmente)
a una sola Cuenta. También existe **muchos a muchos** (ejemplo: un Producto puede estar en muchas
Cotizaciones, y una Cotización puede tener muchos Productos).

**Práctica**: ejecutable en Developer environment (Módulo 2 / Lab 02).

**Errores comunes**: crear una relación muchos-a-muchos cuando en realidad el negocio es 1 a muchos
— complica el modelo sin necesidad real.

**Criterio de aprobación**: dado un escenario de negocio, identificas si la relación entre dos tablas
es 1 a muchos o muchos a muchos.

## 4. Formularios (Forms)

**Objetivo**: entender qué es un formulario y por qué puede haber varios por tabla.

**Explicación clara**: el formulario es la pantalla donde se ve y edita **un registro** de una tabla.
Una misma tabla puede tener **varios formularios distintos** (ejemplo: un formulario simplificado
para agentes de soporte de primer nivel, y uno completo para supervisores) — se muestran según el rol
del usuario o la app.

**Práctica**: ejecutable en Developer environment (Módulo 2-9).

**Errores comunes**: poner todos los campos posibles en un solo formulario "por si acaso" — satura la
pantalla y confunde al usuario que solo necesita 5 campos para su tarea diaria.

**Criterio de aprobación**: explicas cuándo conviene crear un segundo formulario para la misma tabla.

## 5. Vistas (Views)

**Objetivo**: entender qué es una vista y cómo se diferencia de un formulario.

**Explicación clara**: mientras el formulario muestra **un** registro, la vista muestra una **lista**
de registros en formato tabla (como una grilla de Excel), con columnas y filtros elegidos. Ejemplo:
"Mis casos activos" es una vista que filtra Casos por dueño=yo y estado=Activo.

**Práctica**: ejecutable en Developer environment.

**Errores comunes**: crear una vista con demasiadas columnas — hace la lista lenta de leer; una vista
de trabajo diario normalmente necesita 5-7 columnas, no 20.

**Criterio de aprobación**: dado un caso de uso ("un agente necesita ver solo sus casos vencidos"),
describes qué filtro y columnas pondrías en esa vista.

## 6. Reglas de negocio (Business Rules)

**Objetivo**: entender qué resuelven las reglas de negocio sin escribir código.

**Explicación clara**: una regla de negocio aplica lógica simple directamente en el formulario sin
programar: mostrar/ocultar un campo según otro valor, marcar un campo obligatorio condicionalmente,
mostrar un mensaje de validación. Ejemplo: "si Prioridad = Urgente, entonces Descripción es
obligatoria".

**Práctica**: ejecutable en Developer environment (se practica a fondo en el Módulo 9).

**Errores comunes**: usar una regla de negocio para lógica compleja con muchas condiciones anidadas
— ahí conviene un flujo de Power Automate o, en casos avanzados, JavaScript/PCF (Módulo 13); las
reglas de negocio son para casos simples de un formulario.

**Criterio de aprobación**: dado un requerimiento, decides si resolverlo con regla de negocio o si ya
es momento de escalar a Power Automate.

## 7. Seguridad básica

**Objetivo**: entender el concepto de rol de seguridad y por qué no todos ven todo.

**Explicación clara**: cada usuario tiene uno o más **roles de seguridad** que definen qué tablas
puede ver, crear, editar o borrar, y sobre qué alcance (solo lo suyo, su equipo, toda la
organización). Esto evita, por ejemplo, que un vendedor de una región vea o edite las oportunidades de
otra región sin permiso.

**Práctica**: ejecutable en Developer environment (se profundiza en el Módulo 16).

**Errores comunes**: dar el rol de Administrador del Sistema a todos "para que no se traben" — anula
toda la seguridad y es la causa más común de incidentes de datos borrados por error en entornos
reales.

**Criterio de aprobación**: explicas la diferencia entre alcance "Usuario", "Equipo de negocio" y
"Organización" en un rol de seguridad.

## 8. Soluciones (Solutions)

**Objetivo**: entender qué es una solución y para qué sirve.

**Explicación clara**: una solución es un **contenedor** que agrupa tablas, formularios, vistas,
flujos y apps para poder moverlos juntos entre ambientes (de Developer a otro ambiente, por ejemplo).
Es la unidad de despliegue de Power Platform — sin solución, cada cambio queda atrapado en un solo
ambiente.

**Práctica**: ejecutable en Developer environment (se profundiza en ALM, Módulo 16 y nivel
Arquitecto).

**Errores comunes**: trabajar directamente en la solución "Default" en vez de crear una solución
propia — dificulta después exportar solo tus cambios sin arrastrar todo lo del ambiente.

**Criterio de aprobación**: explicas por qué se recomienda crear una solución propia desde el primer
día de un proyecto, no al final.

## 9. Datos de prueba

**Objetivo**: entender cómo poblar tablas con datos realistas para practicar.

**Explicación clara**: para que un formulario, una vista o un reporte tengan sentido, necesitas datos
de ejemplo — no solo 1 registro, sino varios con variación real (distintos estados, distintas
fechas, distintos dueños). Se pueden crear a mano (pocos registros) o importar desde Excel/CSV
(volumen mayor). Dynamics 365 trial trae datos de ejemplo (Contoso) precargados para practicar sin
crear todo desde cero.

**Práctica**: ejecutable en Developer environment (crear a mano) y ejecutable en trial Dynamics 365
(datos Contoso ya precargados).

**Errores comunes**: practicar con 1-2 registros — no revela problemas reales de vistas, reportes ni
reglas de negocio que solo aparecen con volumen y variación de datos.

**Criterio de aprobación**: para cualquier tabla nueva que crees, generas al menos 5-10 registros con
variación realista antes de dar por probada una vista o regla de negocio.

## Siguiente paso

Continúa con el [Módulo 1](/nivel/basico/modulo/introduccion-al-ecosistema-power-platform) y
[Módulo 2](/nivel/basico) — ahí estos conceptos se vuelven ejercicios reales en tu ambiente Developer.
