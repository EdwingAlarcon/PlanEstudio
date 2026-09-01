---
id: lab-71
title: "JR-001 — Model-Driven App Job Test"
level: "N3"
duration: 240
product: ["Dataverse", "Power Apps", "Model-Driven Apps"]
certifications: ["PL-200 (retirado 31 ago 2026)", "PL-400"]
role: ["Power Platform Developer", "Functional Consultant"]
prerequisites:
  - "Módulo 4 estudiado: Power Apps Model-Driven"
  - "Módulo 9 estudiado: Dataverse avanzado y seguridad"
---

# Lab 71 — JR-001: Model-Driven App Job Test

## Objetivo

Construir y documentar una app model-driven como prueba técnica laboral: tablas, formularios,
vistas, business process flow, security roles y evidencia de validación por rol.

## Perfil laboral y skill validado

**Vacante objetivo:** Power Platform Developer junior / Functional Consultant que debe modelar
Dataverse y configurar UX model-driven sin supervisión constante.

**Skill concreto que valida:** capacidad de traducir un proceso de negocio real (mantenimiento de
activos) en un modelo de datos normalizado, una experiencia de usuario coherente por rol, y una
matriz de seguridad de mínimo privilegio — no solo "saber crear una tabla en Dataverse".

## Escenario de negocio

**Empresa ficticia:** Andina Servicios Industriales — 12 plantas, 340 activos críticos en
mantenimiento preventivo y correctivo.

Necesita una app interna para gestionar solicitudes de mantenimiento de activos. El reclutador
quiere ver si puedes modelar datos, configurar UX model-driven y explicar seguridad sin depender
de una solución enorme.

## Rol del estudiante

Actúas como maker/developer junior responsable de entregar una solución funcional y explicable.

## Herramientas necesarias

- Ambiente Dataverse de práctica.
- Power Apps Maker Portal.
- Documento Markdown o Word para evidencias.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real:** crea las tablas, formularios, vistas y BPF en Dataverse; asigna los 4 roles
  a usuarios de prueba reales y ejecuta los 4 casos del Paso 5 con capturas de pantalla.
- **Sin tenant:** entrega el modelo de datos, wireframes de formularios/vistas, el BPF documentado
  paso a paso y la matriz de roles — pero deja explícito en el README qué parte no fue ejecutada en
  un ambiente real (ver "Qué no debe sobreprometerse").

## Datos de prueba

Usa este set mínimo para poblar el ambiente (real o simulado) antes de ejecutar el Paso 5:

| Activo | Código | Criticidad | Solicitudes de ejemplo |
|---|---|---|---|
| Compresor Línea 3 | ACT-0142 | Alta | 2 solicitudes abiertas, 1 vencida |
| Bomba de agua Planta 2 | ACT-0087 | Media | 1 solicitud en Evaluación |
| Cinta transportadora A | ACT-0203 | Alta | 1 solicitud en Ejecución, 1 cerrada |

## Entregables

- Diagrama de tablas.
- App model-driven con formularios y vistas.
- Business Process Flow de solicitud.
- Matriz de security roles.
- Evidencia de pruebas por rol.
- README de portafolio.

## Pasos detallados

### Paso 1 — Modelo de datos

Define estas tablas:

| Tabla | Campos clave | Relacion |
|---|---|---|
| Activo | codigo, nombre, ubicacion, criticidad | 1:N con Solicitud |
| Solicitud de mantenimiento | titulo, prioridad, estado, fecha requerida | N:1 con Activo |
| Intervencion | descripcion, tecnico, fecha, resultado | N:1 con Solicitud |

Documenta choices para prioridad y estado. Evita prefijos genericos como `new_`; usa el publisher
del ambiente.

### Paso 2 — Formularios y vistas

Crea:

- Formulario principal de Solicitud con secciones: Datos generales, Activo, Priorizacion,
  Seguimiento.
- Vista "Solicitudes abiertas por prioridad".
- Vista "Solicitudes vencidas".
- Vista "Mis solicitudes asignadas".

### Paso 3 — Business Process Flow

Configura etapas:

1. Registro.
2. Evaluacion.
3. Ejecucion.
4. Cierre.

Define que campos deben completarse para avanzar de etapa.

### Paso 4 — Seguridad

Propón roles:

| Rol | Puede crear | Puede editar | Puede cerrar | Puede administrar |
|---|---|---|---|---|
| Solicitante | Solicitud | Sus solicitudes | No | No |
| Tecnico | Intervencion | Solicitudes asignadas | No | No |
| Supervisor | Todas | Todas | Si | No |
| Administrador funcional | Todas | Todas | Si | Si |

### Paso 5 — Evidencia de validación

Con los datos de prueba del Paso anterior, ejecuta y documenta al menos 4 casos:

- Solicitante crea solicitud sobre "Compresor Línea 3".
- Tecnico registra intervencion en la solicitud de "Bomba de agua Planta 2".
- Supervisor cierra la solicitud de "Cinta transportadora A" que está en Ejecución.
- Solicitante intenta cerrar su propia solicitud y el sistema se lo impide.

## Decisiones que debes tomar

- **¿Prioridad como Choice o como tabla de configuración?** Si distintas plantas necesitan SLAs
  distintos por prioridad, una tabla de configuración es más mantenible que un Choice fijo — pero
  agrega una relación más. Justifica tu elección en el README.
- **¿El campo Tecnico va en Intervencion o en Solicitud?** Afecta si un técnico queda fijo desde la
  asignación o puede cambiar por intervención. Explica el trade-off.
- **¿El Supervisor puede editar el campo Tecnico de una intervención ya cerrada?** Define la regla y
  cómo la aplicarías (business rule, seguridad de campo, o ambas).

## Criterios de validación

- [ ] El modelo de datos tiene relaciones correctas.
- [ ] La app tiene navegación limpia.
- [ ] Las vistas responden a necesidades laborales reales.
- [ ] El BPF refleja el proceso.
- [ ] La matriz de roles aplica minimo privilegio.
- [ ] El README explica problema, solucion, seguridad y lecciones.
- [ ] El README declara explícitamente qué se ejecutó en tenant real y qué se simuló.

## Rúbrica

| Criterio | Peso |
|---|---|
| Modelo de datos | 25% |
| UX model-driven | 20% |
| Seguridad | 25% |
| Validación y evidencia | 20% |
| Explicacion de entrevista | 10% |

## Preguntas de entrevista asociadas

- "¿Por qué modelaste Intervención como tabla separada en vez de un campo multilinea en Solicitud?"
  — respuesta esperada: normalización, permite N intervenciones por solicitud, reporting por técnico.
- "¿Cómo evitas que un Solicitante vea solicitudes de otra planta?" — respuesta esperada: seguridad
  a nivel de Business Unit o columna de planta + regla de seguridad de fila, no lógica en la app.
- "¿Qué harías si el cliente pide 15 tipos de solicitud distintos con campos diferentes?" —
  respuesta esperada: evaluar tabla de configuración de tipo + campos condicionales vs. explosión de
  choices, sin sobre-diseñar para el caso actual.

## Qué no debe sobreprometerse

Completar este lab entrena y evidencia habilidades de modelado y seguridad Dataverse; no equivale a
experiencia laboral formal ni garantiza superar una prueba técnica real de una vacante específica,
que puede evaluar además herramientas o contextos no cubiertos aquí.

## Errores comunes

- Crear muchas tablas sin justificar.
- Usar un solo rol para todos.
- No probar seguridad con usuarios/roles distintos.
- Presentar capturas sin README.
