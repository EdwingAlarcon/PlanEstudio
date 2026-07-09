# 🔧 Ejemplo Ejecutable: Pipeline GitHub Actions para ALM de Power Platform

> Referenciado desde el Módulo 54 (ALM de Soluciones Power Platform con Apoyo de IA) y el Lab 53
> (Exportar, Desempaquetar y Revisar una Solución con IA) del Nivel IA. Este archivo vive en
> `docs/Anexos/` — **no** en `.github/workflows/` — a propósito: es material de referencia para
> copiar a un repositorio de un proyecto real de Power Platform, no un workflow que deba
> ejecutarse en este repositorio (que es la app Next.js del plan de estudio, sin ningún tenant
> de Power Platform asociado).

## Qué resuelve este ejemplo

El Módulo 54 explica conceptualmente el flujo `export → unpack → commit` en Dev y
`pack → import` hacia Test/Prod. Este archivo es la versión **completa y ejecutable** de ese
flujo, lista para copiar a `.github/workflows/power-platform-alm.yml` de un proyecto real,
adaptando los placeholders marcados con `{{ }}`.

## Prerequisitos para usarlo en un proyecto real

1. Un **service principal** (Módulo 53) con Application User y Security Role de mínimo
   privilegio en cada entorno (Dev, Test, Prod).
2. Los secretos del service principal guardados en **GitHub Secrets** del repositorio
   (`PP_CLIENT_ID`, `PP_CLIENT_SECRET`, `PP_TENANT_ID`, `PP_DEV_URL`, `PP_TEST_URL`), nunca en
   texto plano en el workflow (Módulo 49).
3. Un archivo `deployment-settings.json` versionado en el repo (Módulo 54) para mapear
   variables de entorno y connection references al entorno destino.

## El pipeline

```yaml
name: Power Platform ALM

on:
  push:
    branches: [main]
    paths:
      - "solutions/**"
  workflow_dispatch:
    inputs:
      target_environment:
        description: "Entorno destino para el import (test | prod)"
        required: true
        default: "test"

jobs:
  # ─── Export + unpack: se ejecuta al hacer push a main con cambios en solutions/ ──
  # Requiere que un maker haya hecho los cambios directamente en el entorno Dev
  # (unmanaged) antes de correr este job manualmente o vía un trigger equivalente.
  export-and-unpack:
    name: Export & Unpack (Dev)
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v7

      - name: Instalar Power Platform CLI
        uses: microsoft/powerplatform-actions/actions-install@v1

      - name: Autenticar contra Dev
        uses: microsoft/powerplatform-actions/who-am-i@v1
        with:
          environment-url: ${{ secrets.PP_DEV_URL }}
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: ${{ secrets.PP_CLIENT_SECRET }}
          tenant-id: ${{ secrets.PP_TENANT_ID }}

      - name: Exportar solución (unmanaged, desde Dev)
        uses: microsoft/powerplatform-actions/export-solution@v1
        with:
          environment-url: ${{ secrets.PP_DEV_URL }}
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: ${{ secrets.PP_CLIENT_SECRET }}
          tenant-id: ${{ secrets.PP_TENANT_ID }}
          solution-name: "{{NOMBRE_DE_LA_SOLUCION}}"
          solution-output-file: out/exported/{{NOMBRE_DE_LA_SOLUCION}}.zip
          managed: false

      - name: Desempaquetar solución para control de versiones
        uses: microsoft/powerplatform-actions/unpack-solution@v1
        with:
          solution-file: out/exported/{{NOMBRE_DE_LA_SOLUCION}}.zip
          solution-folder: solutions/{{NOMBRE_DE_LA_SOLUCION}}
          solution-type: Unmanaged

      - name: Commit de la solución desempaquetada
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add solutions/{{NOMBRE_DE_LA_SOLUCION}}
          git diff --staged --quiet || git commit -m "chore: sincronizar solución {{NOMBRE_DE_LA_SOLUCION}} desde Dev"
          git push

  # ─── Pack + import: se dispara manualmente, nunca automáticamente hacia Prod ────
  # El "humano aprueba" del Módulo 51/55 se materializa aquí: el trigger es
  # workflow_dispatch, requiriendo que una persona inicie el despliegue
  # explícitamente después de revisar el diff, nunca un push automático a Prod.
  pack-and-import:
    name: Pack & Import (destino elegido manualmente)
    runs-on: ubuntu-latest
    if: github.event_name == 'workflow_dispatch'
    environment: ${{ github.event.inputs.target_environment }}
    steps:
      - uses: actions/checkout@v7

      - name: Instalar Power Platform CLI
        uses: microsoft/powerplatform-actions/actions-install@v1

      - name: Empaquetar solución (managed, para Test/Prod)
        uses: microsoft/powerplatform-actions/pack-solution@v1
        with:
          solution-folder: solutions/{{NOMBRE_DE_LA_SOLUCION}}
          solution-file: out/packed/{{NOMBRE_DE_LA_SOLUCION}}.zip
          solution-type: Managed

      - name: Importar hacia el entorno destino
        uses: microsoft/powerplatform-actions/import-solution@v1
        with:
          environment-url: ${{ github.event.inputs.target_environment == 'prod' && secrets.PP_PROD_URL || secrets.PP_TEST_URL }}
          app-id: ${{ secrets.PP_CLIENT_ID }}
          client-secret: ${{ secrets.PP_CLIENT_SECRET }}
          tenant-id: ${{ secrets.PP_TENANT_ID }}
          solution-file: out/packed/{{NOMBRE_DE_LA_SOLUCION}}.zip
          settings-file: deployment-settings.{{ENTORNO_DESTINO}}.json
```

## Cómo se relaciona con el flujo de 4 etapas del Módulo 51

- **Humano diseña:** el cambio se hace en Dev (unmanaged) por un maker, con un criterio de éxito claro antes de tocar el pipeline.
- **IA implementa:** el maker puede usar IA (Módulos 43-45) para construir el cambio dentro del entorno Dev.
- **CI valida:** el job `export-and-unpack` deja el cambio versionado y revisable como un PR normal; un pipeline separado de este mismo repo podría correr linters de XML o revisiones automatizadas antes de aprobar el merge.
- **Humano aprueba:** el job `pack-and-import` **solo** se dispara manualmente (`workflow_dispatch`), nunca automáticamente hacia `prod` — la persona que lo dispara ya revisó el diff y aprobó el despliegue, replicando exactamente la etapa de aprobación humana del Módulo 51.

## Seguridad (ver Módulo 49 y 53)

- Ningún secreto está en texto plano — todos viven en GitHub Secrets del repositorio o del `environment` de GitHub (recomendado usar un `environment` de GitHub distinto por cada entorno de Power Platform, con reglas de aprobación manual configuradas para `prod`).
- El service principal usado (`PP_CLIENT_ID`/`PP_CLIENT_SECRET`) debe tener un Security Role de mínimo privilegio, nunca System Administrator (Módulo 53).
- El `deployment-settings.{{ENTORNO_DESTINO}}.json` mapea variables de entorno y connection references sin exponer valores de un entorno en otro.
