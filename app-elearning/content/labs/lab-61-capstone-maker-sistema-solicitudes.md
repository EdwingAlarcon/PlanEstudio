---
id: lab-61
title: "Capstone Maker — Sistema Interno de Gestión de Solicitudes"
level: "N1"
duration: 420
product: ["Power Apps", "Power Automate", "Dataverse"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites:
  - "Lab 02 completado: Dataverse — Modelo de Datos"
  - "Lab 03 completado: Canvas App — Primera App"
  - "Lab 04 completado: Model-Driven App"
  - "Lab 05 completado: Power Automate — Aprobación"
---

# Lab 61 — Capstone Maker: Sistema Interno de Gestión de Solicitudes

## Objetivo

Demostrar, sin ayuda guiada paso a paso, que puedes construir y entregar una solución
departamental completa: modelo de datos, app, flujo de aprobación, seguridad básica y
documentación para el usuario final. Este es el proyecto que cierra la ruta Maker antes de
avanzar a Consultor Funcional.

## Escenario de negocio

Un área interna de tu organización (Recursos Humanos o Compras — elige una) gestiona hoy sus
solicitudes por correo electrónico y una hoja de Excel compartida. No hay trazabilidad de quién
aprobó qué, ni visibilidad de cuánto tiempo tarda cada solicitud en resolverse. Te piden
reemplazar ese proceso con una solución de Power Platform que cualquier empleado pueda usar
desde el celular.

## Alcance del proyecto

Construir una solución funcional real, no solo un mockup. El entregable debe poder mostrarse
funcionando de principio a fin ante un usuario de prueba.

Incluye:

- Modelo de datos en Dataverse con al menos 2 tablas relacionadas.
- Canvas App para que el empleado cree y consulte sus solicitudes.
- Flujo de aprobación en Power Automate.
- Dos roles de seguridad probados con un segundo usuario.
- Manual de usuario corto.

Fuera de alcance:

- Integraciones con sistemas externos.
- Power BI o reporting avanzado (opcional como reto adicional).
- Automatización de asignación por reglas complejas.

## Prerrequisitos

- Haber completado los labs 02, 03, 04 y 05.
- Tener acceso a un ambiente de Power Platform (developer environment o trial).

## Herramientas necesarias

- Power Apps (Canvas y Dataverse).
- Power Automate.
- Un segundo usuario de prueba (puede ser otra cuenta del mismo tenant) para probar seguridad.
- Recurso `/recursos/rubricas-plantillas` (rúbrica Low-code / Maker).

## Entregables

### 1. Modelo de datos

- Tabla principal `Solicitud` con: título, descripción, tipo (choice), estado (choice), fecha de
  solicitud, solicitante (lookup a Contact o Usuario), aprobador (lookup a Usuario).
- Tabla relacionada `Comentario` o `Historial` (1:N desde Solicitud).
- Sin columnas con prefijo `new_` — usa el prefijo de tu publisher.

### 2. Canvas App

- Pantalla de inicio con las solicitudes del usuario actual.
- Pantalla para crear una nueva solicitud, con validación (campos obligatorios, formato).
- Pantalla de detalle con historial/comentarios.
- Mensajes de error visibles cuando falta un campo obligatorio o la operación falla.

### 3. Flujo de aprobación

- Se dispara al crear una solicitud.
- Notifica al aprobador (email o Teams).
- Actualiza el estado de la solicitud según la decisión.
- Corre sin intervención manual en al menos 3 ejecuciones de prueba distintas.

### 4. Seguridad

- Al menos 2 roles de seguridad (por ejemplo, "Solicitante" y "Aprobador").
- Probado con un segundo usuario real: el solicitante no debe poder aprobar sus propias
  solicitudes ni ver las de otro departamento si el escenario lo requiere.

### 5. Manual de usuario

- 1-2 páginas, sin jerga técnica.
- Explica cómo crear una solicitud y cómo consultar su estado.

### 6. Checklist de entrega

- [ ] App publicada y compartida con el usuario de prueba.
- [ ] Flujo probado con datos reales, no solo en el editor.
- [ ] Roles de seguridad verificados con el segundo usuario.
- [ ] Manual de usuario entregado.

## Resultado esperado

Una solución que un usuario de prueba pueda operar de principio a fin (crear solicitud → recibir
notificación de aprobación → ver estado actualizado) sin que tú intervengas durante la
demostración.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Modelo de datos | 20% | Tablas relacionadas correctamente, sin `new_`, choices para valores fijos |
| Canvas App / UX | 25% | 3+ pantallas, navegación sin errores, validaciones visibles |
| Flujo de aprobación | 20% | Corre sin intervención manual en 3 ejecuciones de prueba |
| Seguridad | 20% | 2 roles probados con un segundo usuario real |
| Documentación | 15% | Manual de 1-2 páginas comprensible sin jerga técnica |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100.

## Evidencia esperada

- Captura de la app funcionando (pantallas principales).
- Captura o log de una ejecución exitosa del flujo.
- Captura de acceso restringido probado con el segundo usuario.
- El manual de usuario.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| App sin manejo de estado vacío | No se probó con una colección/tabla sin registros | Agregar mensaje "No tienes solicitudes" en la galería |
| Flujo falla en silencio | Sin acciones de manejo de error | Agregar un Scope con Try/Catch y notificación al administrador |
| Roles de seguridad no probados | Se asume que "debería funcionar" | Iniciar sesión con el segundo usuario y verificar en la práctica |
| Validaciones solo en el frontend | Confiar solo en `Required` del formulario | Agregar también una Business Rule o columna requerida en Dataverse |

## Reto adicional

Agrega un dashboard simple (galería con conteo por estado, o un modelo básico de Power BI) que
muestre cuántas solicitudes están pendientes, aprobadas y rechazadas.

## Módulos relacionados

- Módulo 02 — Dataverse: Fundamentos y Modelado Básico
- Módulo 03 — Power Apps Canvas: Primeras Aplicaciones
- Módulo 05 — Power Automate: Automatización de Procesos
- Lab 02, Lab 03, Lab 04, Lab 05
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño de modelo de datos básico en Dataverse.
- Construcción de una Canvas App funcional de principio a fin.
- Automatización de un proceso de aprobación real.
- Aplicación de seguridad de mínimo privilegio.
- Documentación orientada al usuario final.

## Convierte esto en evidencia laboral

Este capstone es tu primer proyecto completo — vale la pena documentarlo bien antes de pasar al
siguiente nivel.

- Aprende a documentar tu primer proyecto: estructura de README, qué capturas guardar y cómo
  describir en 3 líneas qué problema resolviste — ver [Guía de Portafolio](/recursos/portafolio-profesional).
- Cuando tengas 2-3 proyectos así, prepara tu CV y tu perfil de LinkedIn con la
  [guía Job-Ready de entrevistas y portafolio](/recursos/job-ready-interview-readiness).
- Recuerda el principio central: presenta esto como proyecto de práctica, no como experiencia
  laboral si no lo fue.
