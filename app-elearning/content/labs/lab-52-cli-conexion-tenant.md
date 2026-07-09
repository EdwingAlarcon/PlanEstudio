---
id: lab-52
title: "Configurar Power Platform CLI y Conectarse de Forma Segura al Tenant"
level: "N5"
duration: 70
product: ["Power Platform CLI", "Microsoft Entra ID", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Maker", "Solution Architect"]
prerequisites:
  - "Cuenta con acceso a un entorno Developer o Sandbox (nunca producción)"
  - "Node.js LTS y Git instalados"
  - "Módulo 52 estudiado: Power Platform CLI y Conexión Segura al Tenant"
files: []
---

# Lab 52 — Power Platform CLI: Configuración y Conexión Segura al Tenant

## Objetivo

Al finalizar este laboratorio habrás instalado Power Platform CLI, configurado un perfil de autenticación contra un entorno de práctica, y aprendido a cambiar entre múltiples entornos (Dev/Test/Prod) sin riesgo de operar por error contra el entorno equivocado.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Developer, Maker, Solution Architect — cualquier rol que vaya a interactuar con Power Platform CLI en su máquina local.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** SIT atiende varios clientes y proyectos en paralelo. Un consultor nuevo necesita configurar su máquina para trabajar con Power Platform CLI de forma que nunca confunda un entorno de un cliente con el de otro, ni arriesgue ejecutar un comando destructivo contra producción por error.

**Por qué es una buena tarea para practicar:** es la base de cualquier trabajo técnico posterior en el nivel IA (labs 53, 54, módulos de ALM) — sin esta configuración correcta, cualquier comando de `pac` es un riesgo.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Instalar Power Platform CLI y verificar la instalación | 15 min |
| Ejercicio 2 — Crear un perfil de autenticación contra un entorno de práctica | 20 min |
| Ejercicio 3 — Simular múltiples clientes: crear un segundo perfil y practicar el cambio seguro entre ellos | 25 min |
| Ejercicio 4 — Documentar tu checklist personal de verificación previa | 10 min |
| **Total** | **70 min** |

## Tecnologías utilizadas

- Power Platform CLI (`pac`)
- Un entorno Developer (gratuito, ligado a tu cuenta) o Sandbox de práctica
- Terminal (PowerShell, bash o equivalente)

## Ejercicio 1 — Instalar y verificar

Instala Power Platform CLI según tu sistema operativo:

```bash
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
# o
npm install -g @microsoft/powerplatform-cli
```

Verifica la instalación:

```bash
pac --version
pac help
```

**Validación esperada:** el comando `pac --version` muestra un número de versión sin errores.

## Ejercicio 2 — Conectar a un entorno de práctica

Crea un perfil de autenticación contra tu entorno Developer o Sandbox (nunca contra producción):

```bash
pac auth create --environment "https://orgXXXXXXXX.crm.dynamics.com" --name "sit-practica-dev"
```

Confirma la organización activa:

```bash
pac org who
```

**Validación esperada:** `pac org who` muestra la URL, el ID de organización y tu usuario, coincidiendo con el entorno esperado.

## Ejercicio 3 — Simular múltiples clientes/entornos

Si tienes acceso a un segundo entorno (o puedes crear un segundo entorno Developer gratuito), crea un segundo perfil con un nombre igualmente explícito:

```bash
pac auth create --environment "https://orgYYYYYYYY.crm.dynamics.com" --name "sit-cliente-b-dev"
pac auth list
```

Practica el cambio seguro entre perfiles, verificando SIEMPRE con `pac org who` después de cada cambio:

```bash
pac auth select --index 0
pac org who
pac auth select --index 1
pac org who
```

**Validación esperada:** después de cada `pac auth select`, `pac org who` confirma la organización correcta antes de continuar con cualquier otro comando.

## Ejercicio 4 — Documentar tu checklist personal

Escribe (en un archivo local, no en el repo del proyecto real) tu checklist personal de verificación antes de ejecutar cualquier comando de `pac` que modifique algo:
1. ¿Ejecuté `pac org who` en los últimos minutos?
2. ¿El nombre del perfil coincide con el cliente/entorno que espero?
3. ¿Es un entorno Developer/Sandbox/Test, o es Production?

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `pac` no reconocido como comando | La instalación no agregó la herramienta al PATH, o se requiere reiniciar la terminal | Reiniciar la terminal o verificar la variable PATH tras instalar |
| Ejecutar un comando contra el perfil equivocado | No verificar `pac org who` tras un `pac auth select` | Verificar siempre la organización activa antes de cualquier operación |
| Perfiles con nombres genéricos (`profile1`, `profile2`) | No nombrar explícitamente el perfil al crearlo | Usar siempre `--name` con una convención clara cliente-entorno |

## Criterios de Validación

- [ ] Instalé Power Platform CLI y confirmé la versión
- [ ] Creé un perfil de autenticación contra un entorno Developer/Sandbox con nombre explícito
- [ ] Verifiqué la organización activa con `pac org who` antes y después de cambiar de perfil
- [ ] Documenté mi checklist personal de verificación previa a comandos destructivos

## Preguntas de Reflexión

1. ¿Qué habría pasado si hubieras ejecutado un `pac solution import` sin verificar el perfil activo?
2. ¿Cómo cambiaría tu checklist si trabajaras con 5 clientes distintos en la misma semana?
3. ¿Qué información NUNCA deberías incluir en el nombre de un perfil de autenticación versionado o compartido?

## Módulos Relacionados

- Módulo 52 — Power Platform CLI y Conexión Segura al Tenant
- Módulo 54 — ALM de Soluciones Power Platform con Apoyo de IA

## Competencias Desarrolladas

- Configuración de un entorno de desarrollo local para Power Platform
- Gestión segura de múltiples perfiles de autenticación
- Prevención de errores operativos contra entornos productivos
