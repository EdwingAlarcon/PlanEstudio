---
id: lab-71
title: "JR-001 — Model-Driven App Job Test"
level: "N3"
duration: 240
product: ["Dataverse", "Power Apps", "Model-Driven Apps"]
certifications: ["PL-200", "PL-400"]
role: ["Power Platform Developer", "Functional Consultant"]
prerequisites:
  - "Módulo 4 estudiado: Power Apps Model-Driven"
  - "Módulo 9 estudiado: Dataverse avanzado y seguridad"
---

# Lab 71 — JR-001: Model-Driven App Job Test

## Objetivo

Construir y documentar una app model-driven como prueba técnica laboral: tablas, formularios,
vistas, business process flow, security roles y evidencia de validación por rol.

## Escenario de negocio

**Empresa ficticia:** Andina Servicios Industriales.

Necesita una app interna para gestionar solicitudes de mantenimiento de activos. El reclutador
quiere ver si puedes modelar datos, configurar UX model-driven y explicar seguridad sin depender
de una solución enorme.

## Rol del estudiante

Actúas como maker/developer junior responsable de entregar una solución funcional y explicable.

## Herramientas necesarias

- Ambiente Dataverse de práctica.
- Power Apps Maker Portal.
- Documento Markdown o Word para evidencias.
- Si no tienes tenant, entrega diseño funcional, modelo de datos, formularios y matriz de roles.

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

Crea al menos 4 casos de prueba:

- Solicitante crea solicitud.
- Tecnico registra intervencion.
- Supervisor cierra solicitud.
- Solicitante intenta cerrar solicitud y no puede.

## Criterios de validación

- [ ] El modelo de datos tiene relaciones correctas.
- [ ] La app tiene navegación limpia.
- [ ] Las vistas responden a necesidades laborales reales.
- [ ] El BPF refleja el proceso.
- [ ] La matriz de roles aplica minimo privilegio.
- [ ] El README explica problema, solucion, seguridad y lecciones.

## Rúbrica

| Criterio | Peso |
|---|---|
| Modelo de datos | 25% |
| UX model-driven | 20% |
| Seguridad | 25% |
| Validación y evidencia | 20% |
| Explicacion de entrevista | 10% |

## Errores comunes

- Crear muchas tablas sin justificar.
- Usar un solo rol para todos.
- No probar seguridad con usuarios/roles distintos.
- Presentar capturas sin README.
