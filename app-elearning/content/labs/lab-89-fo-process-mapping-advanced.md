---
id: lab-89
title: "F&O Process Mapping Advanced"
level: "N6"
duration: 150
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Dataverse"]
certifications: ["Finance & Operations awareness"]
role: ["Solution Architect", "Consultor Funcional"]
prerequisites:
  - "Módulo 60 estudiado: F&O Awareness"
---

# Lab 89 — F&O Process Mapping Advanced

## Objetivo

Mapear procesos F&O con frontera CE/ERP, datos maestros, transacciones, riesgos y decisiones de
integración. No requiere tenant para completarse como diseño; configuración real requiere F&O.

Este lab es la extensión arquitectónica del Lab 69. No vuelvas a entregar solo los cinco mapas de
proceso básicos; usa esos mapas como entrada y agrega decisiones sobre frontera CE/F&O, ownership,
datos maestros/transaccionales, antipatrones de sobrepersonalización y criterios de integración.

## Escenario de negocio

SIT vende equipos, instala en campo y factura desde ERP.

## Pasos detallados

### Paso 1 — Procesos

Resume O2C, P2P, R2R, I2D y Project-to-Profit con actores y sistema responsable. Si ya completaste
el Lab 69, referencia esos mapas y agrega solo cambios o decisiones nuevas.

### Paso 2 — Frontera CE/F&O

Marca dónde termina Sales/Service/Field Service y dónde empieza F&O.

### Paso 3 — Datos

Clasifica Customer, Product, Inventory, Sales Order e Invoice como master o transactional.

### Paso 4 — Riesgos

Identifica 5 riesgos de sobrepersonalización en Dataverse.

### Paso 5 — Decisiones de frontera

Redacta 5 decisiones tipo Fit-Gap: una por proceso. Cada decisión debe indicar qué se mantiene en
F&O, qué se expone a CE, qué no debe recrearse en Dataverse y qué evento dispara integración o
consulta.

### Paso 6 — Antipatrones a bloquear

Lista 5 antipatrones que el arquitecto debe rechazar, por ejemplo: tabla custom de inventario en
Dataverse, factura editable desde Sales, cálculo contable duplicado en Power Automate, project
costing fuera de Project Operations/F&O o sincronización batch para datos que requieren consulta
casi en tiempo real.

## Validaciones

- [ ] Los 5 procesos tienen pasos y sistema responsable.
- [ ] La frontera CE/F&O está explícita.
- [ ] Datos maestros y transaccionales están clasificados.
- [ ] Hay riesgos con mitigación.
- [ ] Hay decisiones Fit-Gap por proceso y antipatrones bloqueados.

## Evidencia esperada

- Mapas de proceso.
- Matriz CE/F&O.
- Matriz master/transactional.
- Riesgos de sobrepersonalización.
- Decisiones Fit-Gap por proceso.
- Lista de antipatrones bloqueados.

## Competencias desarrolladas

- F&O awareness.
- Process mapping ERP.
- Arquitectura CRM + ERP.
