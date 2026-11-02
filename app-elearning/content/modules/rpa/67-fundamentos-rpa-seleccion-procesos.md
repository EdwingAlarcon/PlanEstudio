---
moduleId: 67
title: "Fundamentos de RPA y selección de procesos"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 20
practiceMinutes: 150
slug: "fundamentos-rpa-seleccion-procesos"
lastVerified: "2026-11"
---
*Lectura: 18-20 min · Práctica: unas 2 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3, la decisión defendida y el reto de transferencia).*

## 🎯 Objetivo

Evaluar si un proceso debe automatizarse con Power Automate for desktop, con cloud flow, con API/conector, con desarrollo tradicional o si conviene mejorar primero el proceso manual.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste, no un sí/no). Aquí todavía no construyes ningún robot: haces el trabajo que va **antes**, que es observar el proceso, partirlo en tramos y decidir qué tramo merece RPA. Cierras **decidiendo y defendiendo** una recomendación con rúbrica y con un **reto de transferencia** sobre otro proceso.
>
> **Antes de empezar, necesitas:**
> - Un navegador. Las prácticas usan dos sandboxes del curso que no guardan nada ni piden credenciales: el [portal de solicitudes](/rpa-sandbox/portal) y la [aplicación legacy simulada](/rpa-sandbox/legacy-app).
> - **No necesitas Power Automate for desktop ni un tenant** en este módulo. La instalación está en el [Módulo 68](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad).
> - Este nivel es transversal: no exige ningún nivel de certificación. Si ya hiciste el Módulo 5 (cloud flows), vas a reconocer los conectores; si no, basta con saber que un cloud flow automatiza servicios en la nube a través de conectores.

## 📖 Conceptos Clave

RPA automatiza interacción de interfaz cuando un sistema no expone API, conector o integración viable. Es útil como puente operativo, no como excusa para ignorar arquitectura, deuda, seguridad o mantenimiento.

- **Qué dice Microsoft:** RPA se necesita para interactuar con aplicaciones que no tienen un conector prediseñado ni APIs con las que construir un conector personalizado; el robot imita el ratón y el teclado de una persona ([Learn: tipos de licencias de Power Automate, pestaña Robotic Process Automation](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)). En Power Automate, esa automatización de interfaz son los **desktop flows**, que se diseñan en Power Automate for desktop ([Learn: introducción a los desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/introduction)).
- **API antes que interfaz:** la guía de adopción de Microsoft (HEAT) incluye entre sus principios de diseño elegir entre API e interfaz de usuario para cada automatización, y en la etapa *Discover & plan* elegir qué procesos automatizar según el retorno esperado ([Learn: HEAT](https://learn.microsoft.com/en-us/power-automate/guidance/automation-coe/heat)). Un clic grabado es más frágil que una llamada a una API documentada: si cambia la pantalla, el robot falla.
- **Attended y unattended:** *attended* es una ejecución con supervisión humana en la sesión que la persona ya está usando; *unattended* es una ejecución sin supervisión, en la que Power Automate inicia sesión en la máquina, ejecuta y cierra sesión. Cada modo tiene su licencia ([Learn: tipos de licencias](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)); el Módulo 68 lo detalla. En este módulo basta con no prometer *unattended* sin haberlo validado.
- **Deuda operativa:** todo robot de interfaz trae costos que no aparecen en la demo: cambios de pantalla, sesiones de Windows, credenciales, licencias, monitoreo y soporte. Una decisión de RPA que no los estima está incompleta.
- **Tramo de proceso:** casi ningún proceso es "RPA sí" o "RPA no" entero. Se parte en tramos (recibir, validar, registrar, notificar) y cada tramo se resuelve con la herramienta más estable que lo cubra.
- **Criterio de no automatizar:** una regla escrita de antemano que dice cuándo se rechaza o se pospone una automatización (por ejemplo, pantalla que cambia cada semana, volumen muy bajo, decisión que exige criterio humano). Sin ella, cualquier proceso termina pareciendo candidato.

### Matriz de decisión profesional

| Opción | Úsala cuando | Evítala cuando | Evidencia |
|---|---|---|---|
| RPA | Sistema legacy sin API estable, proceso repetible, UI relativamente estable | La pantalla cambia a diario, hay datos críticos sin control o existen APIs maduras | Matriz de viabilidad, riesgos, prueba de selector |
| API | Existe endpoint soportado, autenticación y contrato documentado | El proveedor no soporta el uso o no hay permisos | Prueba HTTP, contrato y control de errores |
| Conector | Hay conector oficial que cubre la operación | El conector no expone el dato requerido | Diseño de flujo y límites |
| Cloud flow | Evento, aprobación o integración SaaS | Se necesita interactuar con UI local | Run history y trazabilidad |
| Desarrollo | Reglas complejas, volumen alto o operación crítica | El costo excede el beneficio | ADR y estimación |
| Proceso manual mejorado | Volumen bajo o alta variabilidad | El costo humano es alto y repetitivo | Nuevo procedimiento y medición |

## 👨‍💻 Actividades Prácticas Paso a Paso

## 🧩 Microlección 1 — Observar el proceso antes de decidir (AS-IS)

**¿Qué vas a aprender?** A documentar un proceso tal como se hace hoy, con datos que observaste tú, antes de opinar sobre cómo automatizarlo.

**¿Por qué existe esto?** La mayoría de las malas decisiones de RPA nacen de automatizar lo que alguien *cree* que pasa. Los pasos que nadie menciona (un dato que falta, un registro que ya existe, una ventana que aparece a veces) son los que rompen el robot.

**El proceso de SIT.** Cada día, un analista abre el portal de solicitudes, busca las solicitudes en estado **Nuevo**, comprueba que tengan producto y monto, y las registra a mano en una aplicación interna antigua que no tiene API. Tú vas a hacer ese proceso a mano con los sandboxes y medirlo.

**Práctica (30 min):**

1. Abre el [portal de solicitudes](/rpa-sandbox/portal). En el panel izquierdo, el selector **Escenario** debe estar en **Normal**. **Deberías ver** debajo de la tabla el texto `Página 1 de 2 · 9 registros`. Si ves otra cifra, pulsa **Reset**.
2. Recorre las dos páginas con **Siguiente** y **Anterior** y anota cuántas solicitudes están en estado **Nuevo**.
3. Filtra por región con el desplegable que dice **Todas** y elige **Bogotá**. Anota el texto de paginación que aparece y cuántas de esas solicitudes están en **Nuevo**.
4. Cambia el **Escenario** a **Datos incompletos** y vuelve a **Todas**. Busca la fila a la que le falta el producto (aparece la palabra *faltante*) y anota su número de solicitud y su monto.
5. Abre la [aplicación legacy simulada](/rpa-sandbox/legacy-app) con el **Modo** en **Normal**. Mira la tabla **Registros**: ya tiene 3 filas. Con los valores que trae el formulario (Solicitud `SOL-2026-0011`), pulsa **Registrar**. **Deberías ver** el cuadro **Registro confirmado**; ciérralo con **Cerrar**. Pulsa **Registrar** otra vez con el mismo número y anota el mensaje que aparece.
6. Cronometra cuánto te lleva registrar a mano **una** solicitud de punta a punta: buscarla en el portal, copiar Solicitud, Cliente y Producto al formulario legacy y confirmar. Hazlo con dos solicitudes distintas y anota el promedio.
7. Escribe el AS-IS en la plantilla [as-is.md](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/templates/as-is.md) o en una hoja: actores, aplicaciones, entradas, salidas, pasos, excepciones observadas y tiempos.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Solicitudes en estado **Nuevo** con el escenario Normal y región Todas | ___ |
| Texto de paginación con la región **Bogotá** | ___ |
| Solicitud con producto *faltante* en **Datos incompletos** (número y monto que muestra) | ___ |
| Mensaje al registrar dos veces `SOL-2026-0011` | ___ |
| Tiempo promedio por solicitud registrada a mano | ___ |
| Excepciones que viste y que nadie te había mencionado en el enunciado | ___ |

> **Si no ves lo que dice un paso:** los sandboxes no guardan estado; al recargar la página vuelven a su valor inicial. Si un número no coincide, pulsa **Reset** (o recarga) y repite desde el paso 1.

---

## 🧩 Microlección 2 — Elegir la herramienta por tramo

**¿Qué vas a aprender?** A partir el proceso en tramos y elegir, para cada uno, la herramienta más estable que lo cubre, dejando el RPA solo para donde no hay otra salida.

**¿Por qué existe esto?** El RPA "de punta a punta" es tentador porque un solo robot parece más simple. En la práctica, cada clic de interfaz es un punto de fallo más que alguien tendrá que mantener.

**Ahora haz algo — micropráctica (6 min):** elige la herramienta de cada tramo del proceso de SIT → **[Elegir la tecnología para cada tramo del proceso](/practica/ip-rpa-001-elegir-tecnologia-por-tramo)**.

**Práctica (25 min):**

1. Toma tu AS-IS de la Microlección 1 y clasifica cada paso en una de cuatro categorías: **regla estable** (siempre se hace igual), **decisión humana** (exige criterio), **integración posible** (hay API, conector o archivo que lo resuelve) o **acción de interfaz** (solo se puede hacer en pantalla).
2. Para cada paso, elige una opción de la matriz de decisión (RPA, API, conector, cloud flow, desarrollo o proceso manual mejorado) y escribe por qué.
3. Revisa la [comparativa tecnológica del caso](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/reference/comparativa_tecnologica.csv) y comprueba que tu elección no cae en la columna *evitar_cuando* de esa herramienta.
4. Marca al menos un paso que **no** deba automatizarse y explica por qué.

**Evidencia a reportar:**

| Paso del AS-IS | Categoría | Herramienta elegida | Por qué (una línea) |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Pasos que dejaste en RPA (cuántos de cuántos) | ___ |
| Paso que decidiste **no** automatizar y tu razón | ___ |

---

## 🧩 Microlección 3 — Puntuar la viabilidad y la deuda operativa

**¿Qué vas a aprender?** A puntuar un tramo candidato con una matriz ponderada y a leer las señales de que un robot va a costar más de lo que ahorra.

**¿Por qué existe esto?** "Nos ahorra tiempo" no es una evaluación. Una matriz con pesos obliga a mirar estabilidad de pantalla, excepciones y alternativas antes de comprometerse.

**La matriz del caso.** El paquete del curso trae una [matriz de viabilidad](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/reference/matriz_viabilidad_rpa.csv) con siete criterios y su peso: volumen (10), frecuencia (8), reglas definidas (10), estabilidad de la interfaz (10), API disponible (12), excepciones (8) y mantenimiento (10). Cada criterio se puntúa de 1 a 5; el archivo describe qué significa 1 y qué significa 5 en cada uno (por ejemplo, en *API disponible*, 1 es "API madura" y 5 es "sin API viable"). El puntaje es la suma de peso × puntuación; el máximo es 340.

> **Convención de este curso (no es una regla de Microsoft):** por encima del 70% (238 o más) el tramo es candidato; entre 50% y 70% (170 a 237), piloto con condiciones escritas; por debajo del 50%, no se automatiza con RPA. El umbral exacto importa menos que escribirlo **antes** de puntuar.

**Práctica (35 min):**

1. Puntúa el tramo "registrar en la aplicación legacy" del proceso de SIT con la matriz. Para *volumen* y *frecuencia*, supón 400 solicitudes al mes, todos los días hábiles. Para el resto, usa lo que observaste en la Microlección 1.
2. Calcula el puntaje y compáralo con el umbral.
3. Lista la deuda operativa del tramo: ¿qué tendría que mantener alguien si mañana cambia la pantalla, la sesión o la credencial?
4. **Diagnosticar — micropráctica (7 min):** otro equipo de SIT ya tiene un robot que se rompe cada semana → **[Diagnosticar: el bot que se rompe todos los lunes](/practica/ip-rpa-002-bot-que-se-rompe-cada-semana)**. Formula tu hipótesis antes de abrir las pistas.

**Evidencia a reportar:**

| Criterio | Peso | Tu puntuación (1-5) | Peso × puntuación | Dato que lo justifica |
|---|---|---|---|---|
| Volumen | 10 | ___ | ___ | ___ |
| Frecuencia | 8 | ___ | ___ | ___ |
| Reglas definidas | 10 | ___ | ___ | ___ |
| Estabilidad de la interfaz | 10 | ___ | ___ | ___ |
| API disponible | 12 | ___ | ___ | ___ |
| Excepciones | 8 | ___ | ___ | ___ |
| Mantenimiento | 10 | ___ | ___ | ___ |
| **Total (de 340) y porcentaje** | | | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Tres elementos de deuda operativa del tramo | ___ |
| Tu hipótesis del bot que se rompe, antes de ver las pistas | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — la recomendación para SIT

> **Situación:** el gerente de operaciones de SIT quiere "un robot que haga todo el proceso" y te pide una recomendación por escrito para el comité. Tienes tu AS-IS, la clasificación por tramos y la matriz puntuada.
> **Entrega:** un ADR corto (Contexto, Decisión, Alternativas consideradas —mínimo 2—, Consecuencias positivas y negativas) y el TO-BE **solo** de la alternativa elegida, con la plantilla [to-be.md](https://planestudio.vercel.app/practice-assets/rpa/sit-automation-case/templates/to-be.md) o en una hoja.

No hay una sola respuesta correcta: la evidencia es la decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Partiste de datos observados | El ADR cita al menos dos datos de tu AS-IS (tiempos, excepciones, duplicados), no supuestos |
| Cada tramo tiene su herramienta | El TO-BE dice qué hace RPA, qué hace un cloud flow o conector y qué queda en manos de una persona |
| El RPA es la última milla | Ningún tramo que tenga API, conector o archivo estructurado quedó en RPA sin una razón escrita |
| Las excepciones tienen dueño | La fila con producto faltante y el registro duplicado tienen un tratamiento explícito (rechazo, cola de revisión, aviso) |
| Las consecuencias incluyen lo negativo | Dices qué deuda operativa asume SIT y quién la mantiene |
| Rechazaste algo | Al menos una propuesta (por ejemplo, "un robot para todo") queda rechazada con su razón |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión en una frase | ___ |
| La alternativa que descartaste y por qué | ___ |
| El dato observado que más pesó en tu decisión | ___ |

---

## 🔁 Reto de transferencia — Altas de empleados en Recursos Humanos

Cambia el proceso y el área: ya no son solicitudes comerciales, son altas de empleados. Cada mes entran unas 25 personas; RR. HH. recibe un formulario, crea la cuenta de trabajo del empleado, lo da de alta en un sistema de nómina antiguo de escritorio sin API y le envía un correo de bienvenida. Uno de cada tres ingresos tiene un contrato especial que hoy revisa una persona. Alguien propone "un robot nocturno que lo haga todo".

1. **Micropráctica (8 min):** **[Transferir: altas de empleados con RPA](/practica/ip-rpa-003-transferir-altas-empleados)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** escribe la recomendación en cinco líneas: qué tramo va por API, qué tramo va por RPA y en qué modo, qué queda en manos de una persona y qué medirías antes de comprometerte.

**Evidencia a reportar:**

| Tramo | Herramienta | Por qué | Qué medirías antes |
|---|---|---|---|
| Cuenta de trabajo | ___ | ___ | ___ |
| Alta en nómina | ___ | ___ | ___ |
| Contratos especiales | ___ | ___ | ___ |
| Correo de bienvenida | ___ | ___ | ___ |

## 💼 Casos Reales de Negocio

Un equipo financiero quiere que PAD lea correos con adjuntos y cargue datos en un portal bancario. El análisis descubre que la descarga del archivo puede hacerse con cloud flow, la validación con Excel/Dataverse y solo la carga final requiere RPA porque el portal no expone API. El diseño reduce superficie frágil.

## ✅ Buenas Prácticas

- Trata RPA como última milla de interfaz, no como integración universal.
- Calcula deuda operativa: cambios de UI, sesiones, credenciales, licencias, monitoreo y soporte.
- Separa decisión técnica de deseo del negocio.
- Declara criterios de no automatizar.
- Usa datos ficticios y evidencia anonimizada.
- Observa y cronometra el proceso real antes de puntuarlo; los pasos que nadie menciona son los que rompen el robot.
- Escribe el umbral de la matriz de viabilidad antes de puntuar, no después.
- Valida los datos antes de que lleguen al robot: un dato faltante debe detenerse antes de tocar la pantalla.

## ⚠️ Errores Comunes

- Automatizar un proceso inestable sin rediseñarlo.
- Elegir RPA porque parece rápido aunque exista API.
- Ignorar excepciones de negocio.
- Prometer operación unattended sin validar licencia, sesión y máquina.
- Presentar un lab como experiencia productiva.

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El robot se rompe cada vez que el proveedor publica una versión de su portal | Se eligió RPA sobre una interfaz inestable, a veces habiendo una API disponible | Vuelve a la matriz: si hay API o conector, migra ese tramo; si no, pospón el RPA hasta que la interfaz se estabilice |
| El robot registra dos veces la misma solicitud | El AS-IS no documentó que la aplicación destino ya podía tener el registro | Añade al TO-BE una comprobación previa (consultar por ID) y una regla para el duplicado |
| El robot "funciona" pero el ahorro no aparece | Volumen bajo o muchas excepciones que siguen yendo a una persona | Mide volumen y porcentaje de excepciones antes de decidir; un proceso manual mejorado puede ser la respuesta |
| La demo funcionó y en operación nadie sabe quién arregla el robot | La decisión no incluyó la deuda operativa ni un dueño | Escribe en el ADR quién mantiene el robot, con qué monitoreo y qué pasa si falla |

## 🧪 Criterios de Validación

- [ ] Puedo explicar qué es RPA y cuándo no usarlo.
- [ ] Diferencio desktop flows, cloud flows, APIs, conectores y scripts.
- [ ] Documenté el AS-IS del proceso de SIT con datos que observé en los sandboxes (paginación, excepciones, duplicado y tiempo por solicitud).
- [ ] Clasifiqué cada paso del AS-IS por tramo y elegí la herramienta de cada uno.
- [ ] Construí una matriz de viabilidad con riesgo, beneficio y deuda.
- [ ] Diagnostiqué el bot que se rompe cada semana formulando una hipótesis antes de ver la causa.
- [ ] Documenté AS-IS y TO-BE de un proceso.
- [ ] Defendí una decisión de rechazo o selección tecnológica.
- [ ] En el reto de transferencia separé qué tramo va por API, cuál por RPA y cuál queda en manos de una persona.

## Evidencia

Matriz de viabilidad RPA, AS-IS, TO-BE, ADR breve y lista de riesgos: las tablas de las tres microlecciones, la decisión defendida y el reto de transferencia. Lab recomendado: LAB-104. Práctica relacionada: CH-RPA-01.

## Preguntas de verificación

1. ¿Qué revisarías antes de automatizar una pantalla legacy?
2. ¿Por qué una API soportada suele ser preferible a RPA?
3. ¿Qué señales indican que el proceso necesita rediseño antes de automatización?

## Conexión con siguiente módulo

Después de decidir que RPA es viable, necesitas entender arquitectura, máquina, runtime, sesión, conexiones y licencias.

## Limitaciones y seguridad

No uses credenciales en texto plano ni datos reales. No marques validación en tenant si solo hiciste una simulación.

## Referencias oficiales

- [Introduction to desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/introduction)
- [Holistic enterprise automation techniques (HEAT)](https://learn.microsoft.com/en-us/power-automate/guidance/automation-coe/heat)
- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)
- [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)
