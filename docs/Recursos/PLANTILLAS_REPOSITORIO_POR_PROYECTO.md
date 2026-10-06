# Estructura de repositorio por tipo de proyecto

Guía de referencia: qué carpetas, qué archivos de apoyo y qué excluir del control de versiones en cada
tipo de proyecto de Power Platform / Dynamics 365. **No son repositorios plantilla descargables**: son
estructuras recomendadas para que el portafolio de cada práctica tenga una forma reconocible y
revisable. Complementa a [Guía de herramientas del workstation](/recursos/guia-herramientas-workstation),
[Matriz de entornos y trials](/recursos/entornos-y-trials) y [Tipos de práctica](/recursos/tipos-de-practica).

**Alcance honesto.** Los comandos de `pac` y `pa` se citan solo en su forma básica. Antes de ejecutarlos,
confirma las opciones vigentes con `pac <comando> --help`, porque la CLI cambia de versión en versión.

## Reglas comunes a todos los tipos

1. **Un proyecto, un repositorio (o una carpeta raíz clara).** El nombre dice qué es: `pcf-selector-cliente`,
   `plugin-validacion-pedido`, `solucion-solicitudes`.
2. **`README.md` en la raíz** con cuatro bloques: qué resuelve, requisitos (ambiente, licencia, herramientas),
   cómo compilarlo/desplegarlo y qué evidencia deja (capturas, export de solución).
3. **Nunca se versionan secretos.** Cadenas de conexión, secretos de cliente, tokens y `.env` con valores reales
   quedan fuera. Usa variables de entorno de la solución y referencias de conexión; en el repositorio, solo un
   archivo `.env.example` con nombres y sin valores.
4. **Prefijo de publisher propio** para tablas, columnas y componentes (`cr123_`, `sit_`…), nunca `new_`.
5. **Salida de compilación fuera del repositorio**: `bin/`, `obj/`, `out/`, `node_modules/` y los `.zip`
   generados se ignoran en `.gitignore`.
6. **Evidencia en una carpeta aparte** (`evidencia/`), con capturas nombradas por criterio de validación del lab
   o práctica, para que quien revise no tenga que adivinar qué demuestra cada una.

## 1. Componente PCF (Power Apps Component Framework)

Pensado para el track Developer: componente propio en TypeScript. Bases en
[Fundamentos de TypeScript/React](/recursos/fundamentos-typescript-react).

```text
pcf-selector-cliente/
├── README.md
├── .gitignore
├── package.json
├── tsconfig.json
├── SelectorCliente/              # carpeta del componente
│   ├── ControlManifest.Input.xml # propiedades, recursos y tipo (field o dataset)
│   ├── index.ts                  # ciclo de vida: init, updateView, getOutputs, destroy
│   └── css/                      # estilos del control
├── solucion/                     # proyecto de solución que empaqueta el control
└── evidencia/
```

- Se genera con `pac pcf init` (plantilla `field` o `dataset`) y `npm install`.
- `.gitignore` mínimo: `node_modules/`, `out/`, `obj/`, `bin/`, `*.zip`.
- Se versiona el **manifiesto** y el código fuente, no el paquete compilado.

## 2. Plugin de Dataverse en C#

Pensado para el track Developer: lógica del lado del servidor. Bases en
[Fundamentos de C#/.NET](/recursos/fundamentos-csharp-dotnet).

```text
plugin-validacion-pedido/
├── README.md
├── .gitignore
├── PluginValidacionPedido.sln
├── src/
│   └── PluginValidacionPedido/
│       ├── PluginValidacionPedido.csproj
│       └── ValidarPedido.cs      # clase que implementa IPlugin
├── tests/                        # pruebas unitarias con el contexto simulado
├── registro/                     # notas de registro: mensaje, tabla, etapa, modo
└── evidencia/
```

- Un plugin siempre se **registra** en el ambiente (mensaje, tabla, etapa, síncrono/asíncrono); anotar ese
  registro en `registro/` evita depender de la memoria de quien lo hizo.
- `.gitignore` mínimo: `bin/`, `obj/`, `.vs/`, `*.user`.
- Si el ensamblado se firma con una clave, **la clave privada (`.snk`) no se versiona**.

## 3. Solución ALM (Dataverse)

Pensado para Maker, Consultor Funcional y Developer: la solución como unidad de despliegue entre ambientes.

```text
solucion-solicitudes/
├── README.md
├── .gitignore
├── solucion/                     # solución desempaquetada (pac solution unpack)
│   └── src/
│       ├── Other/                # Solution.xml, Customizations.xml
│       ├── Entities/             # tablas y columnas
│       ├── Workflows/            # flujos de nube
│       └── CanvasApps/           # apps de lienzo
├── config/
│   └── variables.example.json    # variables de entorno y referencias de conexión (sin valores reales)
└── evidencia/
```

- Se versiona la solución **desempaquetada**, porque un `.zip` no se puede revisar ni comparar por diff.
- `.gitignore` mínimo: `*.zip`, `out/`, `.env`.
- Para ALM completo (ambientes DEV/TEST/PROD, gestionadas vs. no gestionadas, pipelines), ver los módulos de
  ALM del nivel Avanzado y Arquitecto.

## 4. Sitio de Power Pages

Pensado para Maker y Developer que trabajan portales.

```text
sitio-portal-clientes/
├── README.md
├── .gitignore
├── sitio/                        # contenido descargado con pac pages download
│   ├── web-pages/
│   ├── web-templates/
│   ├── table-permissions/
│   └── site-settings/
└── evidencia/
```

- Los **permisos de tabla** y los roles web viajan con el sitio; revisarlos en cada cambio, porque un permiso mal
  puesto expone datos.
- No se versiona nada con datos reales de clientes.

## 5. Code App (aplicación de código)

Pensado para Developer avanzado. Se crea y publica con la CLI `pa`, ver el módulo de Code Apps del nivel
Avanzado.

```text
code-app-solicitudes/
├── README.md
├── .gitignore
├── package.json
├── src/                          # código fuente de la app (TypeScript/React)
├── .env.example                  # solo nombres de variables
└── evidencia/
```

- `.gitignore` mínimo: `node_modules/`, `dist/`, `.env`.

## 6. Proyecto RPA (Power Automate for desktop)

Pensado para el track RPA. Los flujos de escritorio viven dentro de una **solución**, no en archivos de código
sueltos.

```text
rpa-facturas-proveedores/
├── README.md
├── .gitignore
├── solucion/                     # solución desempaquetada que contiene los flujos
├── documentacion/
│   ├── diseno-proceso.md         # alcance, entradas, salidas, excepciones
│   └── manejo-errores.md         # reintentos, escalamiento, qué hace el robot al fallar
├── config/
│   └── variables.example.json
└── evidencia/
```

- La **documentación del proceso** pesa tanto como el flujo: sin ella, el robot no es mantenible.
- Credenciales de aplicaciones objetivo: nunca en el flujo ni en el repositorio; usar el mecanismo de secretos
  de la plataforma.

## Qué revisar antes de dar un proyecto por entregado

- [ ] El `README.md` permite a otra persona reproducir el despliegue sin preguntarte nada.
- [ ] `git status` limpio de `bin/`, `obj/`, `node_modules/` y `.zip`.
- [ ] Búsqueda de secretos hecha (cadenas de conexión, tokens, contraseñas) antes del primer `push`.
- [ ] La carpeta `evidencia/` cubre cada criterio de validación del lab o práctica.
- [ ] Los nombres de tablas y columnas llevan el prefijo del publisher propio.
