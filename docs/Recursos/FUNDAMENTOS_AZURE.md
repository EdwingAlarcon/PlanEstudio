# Fundamentos de Azure para integraciones de Power Platform

Los Módulos 24 (Integraciones con Azure Services) y 36 (Seguridad y Cumplimiento Enterprise) usan
Azure Portal, suscripciones, resource groups y Key Vault sin explicarlos — el Módulo 34 (Azure
Integration Services Avanzado) sí se autodenuncia y pide este puente explícitamente. Leelo antes de
cualquiera de los tres si nunca usaste Azure.

**Tipo de práctica de este recurso: conceptual + 🟡 ejecutable con cuenta gratuita de Azure (sin
tenant de Power Platform involucrado todavía).** Azure tiene un nivel gratuito con crédito inicial —
no es lo mismo que tu ambiente Developer de Power Platform, es una cuenta separada.

## Objetivo

Entender qué es una suscripción de Azure, un resource group, el Azure Portal, identidad/RBAC básico,
y cómo se relaciona el costo con lo que creás — lo suficiente para no perderte en los Módulos 24, 34 y
36 ni dejar recursos facturando sin darte cuenta.

## 1. Las piezas, de afuera hacia adentro

```
Cuenta de Azure (tu login — puede ser la misma cuenta Microsoft del Módulo 1 o una distinta)
└── Suscripción (la unidad de facturación — "a esto se le cobra")
    └── Resource Group (una carpeta lógica para agrupar recursos relacionados)
        └── Recursos (Key Vault, Function App, Service Bus, Storage Account...)
```

| Término | En una frase |
|---|---|
| **Suscripción (Subscription)** | La unidad de facturación de Azure — todo lo que creés cuelga de una suscripción. |
| **Resource Group** | Una carpeta lógica para agrupar recursos que se crean/borran/administran juntos (ej. todos los recursos de un proyecto). |
| **Azure Portal** | La interfaz web (portal.azure.com) donde creás y administrás recursos — el equivalente de `make.powerapps.com`, pero para Azure. |
| **RBAC (Role-Based Access Control)** | Quién puede hacer qué sobre qué recurso — igual que los roles de seguridad de Dataverse, pero a nivel de Azure. |
| **Región (Region)** | El datacenter físico donde vive tu recurso (ej. "East US", "Brazil South") — afecta latencia y a veces cumplimiento de datos. |

## 2. El costo, antes de crear nada

Azure **no es gratis por defecto** — algunos servicios tienen un nivel gratuito generoso (Functions,
Key Vault en bajo volumen), otros cobran desde el primer minuto (algunos tiers de Service Bus,
máquinas virtuales). Antes de crear cualquier recurso:

1. Revisá el [nivel gratuito de Azure](https://azure.microsoft.com/free/) y qué límites tiene el
   servicio específico que vas a usar.
2. Configurá una **alerta de presupuesto** (Azure Portal → Cost Management → Budgets) apenas actives
   la suscripción — te avisa antes de que un recurso mal configurado te sorprenda con un cargo.
3. Al terminar una práctica, **borrá el Resource Group completo** (no cada recurso suelto) — es la
   forma más segura de no dejar nada facturando.

## 3. Práctica — crear y limpiar un Resource Group

1. Creá una cuenta gratuita de Azure si no tenés una, o usá una existente con precaución (no
   practiques sobre una suscripción de producción de una empresa).
2. En el Azure Portal, creá un Resource Group llamado `rg-practica-power-platform` en la región más
   cercana a vos.
3. Dentro de ese grupo, creá un **Key Vault** (nivel gratuito/estándar) — es el recurso que más van a
   usar los Módulos 24/34/36 para guardar secretos de forma segura en vez de hardcodearlos en el código.
4. Revisá la pestaña **Access control (IAM)** del Key Vault — identificá qué rol tenés vos ahí (ej.
   "Owner" o "Key Vault Administrator").
5. Configurá la alerta de presupuesto mencionada arriba (aunque sea con un límite bajo, ej. $5).
6. **Borrá el Resource Group completo** al terminar (Resource Group → Delete resource group) y
   confirmá escribiendo su nombre — practicá el hábito de limpieza desde el principio.

**Evidencia esperada:** captura del Key Vault creado, captura de la alerta de presupuesto configurada,
y captura de la confirmación de borrado del Resource Group, guardadas en tu bitácora.

## Errores comunes

- **Error:** crear recursos "para probar" y olvidarlos activos. **Por qué pasa:** a diferencia de un
  ambiente Developer de Power Platform (gratuito, sin límite de tiempo mientras lo uses), Azure cobra
  por recurso activo. **Cómo evitarlo:** siempre borrá el Resource Group completo al terminar una
  práctica, no dejes "para después".
- **Error:** confundir tu suscripción personal de Azure con la de una empresa/cliente real. **Cómo
  evitarlo:** para este plan, usá siempre una suscripción personal de práctica — nunca la de un
  entorno productivo real.
- **Error:** pensar que RBAC de Azure y los roles de seguridad de Dataverse son lo mismo. **Cómo
  evitarlo:** son sistemas de permisos independientes — tener acceso de administrador en Dataverse no
  te da ningún permiso en Azure, y viceversa.

## Criterio de aprobación

Podés seguir a los Módulos 24, 34 o 36 cuando puedas, sin mirar este documento:

- [ ] Explicar la diferencia entre suscripción y resource group.
- [ ] Crear y borrar un resource group completo.
- [ ] Explicar por qué configurar una alerta de presupuesto es buena práctica antes de experimentar.
- [ ] Ubicar la pestaña de control de acceso (IAM) de un recurso.

## Qué este puente NO cubre (y por qué no bloquea los Módulos 24/34/36)

Azure Functions, Service Bus, Event Grid, Logic Apps y Azure AD PIM en profundidad — esos se aprenden
*en* cada módulo con su propio andamiaje. Este puente solo cierra la brecha de "nunca usé el Azure
Portal ni entendí cómo se factura", no reemplaza una certificación de Azure.

## Siguiente paso

→ [Módulo 24 — Integraciones con Azure Services](/nivel/avanzado/modulo/integraciones-con-azure-services)
→ [Módulo 34 — Azure Integration Services Avanzado](/nivel/arquitecto/modulo/azure-integration-services-avanzado)
→ [Módulo 36 — Seguridad y Cumplimiento Enterprise](/nivel/arquitecto/modulo/seguridad-y-cumplimiento-enterprise)
