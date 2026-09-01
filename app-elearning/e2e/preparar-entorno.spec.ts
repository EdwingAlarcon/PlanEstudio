import { test, expect } from "@playwright/test";

test.describe("Preparar mi entorno", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("perfil Developer en Windows recibe el navegador como primer requisito y avanza al marcarlo", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await expect(page.getByRole("heading", { name: "Preparar mi entorno" })).toBeVisible();

    await page.getByRole("button", { name: "Windows" }).click();
    await page.getByRole("button", { name: "Developer", exact: true }).click();

    await expect(page.getByText("Siguiente requisito", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Navegador moderno" })).toBeVisible();

    await page.getByRole("button", { name: "Continuar con el siguiente requisito" }).click();
    await expect(page.getByRole("heading", { name: "Power Apps Maker Portal" })).toBeVisible();
  });

  test("el estado de herramientas persiste tras recargar", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await page.getByRole("button", { name: "Windows" }).click();
    await page.getByRole("button", { name: "Developer", exact: true }).click();

    const gitRow = page.locator("tr", { hasText: "Git" });
    await gitRow.getByRole("button", { name: "Marcar instalada" }).click();
    await expect(gitRow.getByText("Instalada", { exact: true })).toBeVisible();

    await page.reload();
    await expect(page.locator("tr", { hasText: "Git" }).getByText("Instalada", { exact: true })).toBeVisible();
  });

  test("perfil funcional no recibe Visual Studio como requisito", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await page.getByRole("button", { name: "Consultor funcional" }).click();
    await expect(page.getByText("Visual Studio Community")).toHaveCount(0);
  });

  test("perfil RPA en macOS advierte que Power Automate Desktop requiere Windows", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await page.getByRole("button", { name: "RPA", exact: true }).click();
    await page.getByRole("button", { name: "macOS" }).click();
    await expect(page.getByText(/Power Automate Desktop solo corre en Windows/)).toBeVisible();

    await page.getByRole("button", { name: "Windows" }).click();
    await expect(page.getByText(/Power Automate Desktop solo corre en Windows/)).toHaveCount(0);
  });

  test("sin tenant muestra la alternativa conceptual del setup esencial", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await page.getByRole("button", { name: "No", exact: true }).click();
    await expect(page.getByText("Sin tenant todavia")).toBeVisible();
  });

  test("en móvil (375px) la matriz se muestra como tarjetas, no como tabla", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/preparar-entorno");
    await expect(page.locator("table:visible")).toHaveCount(0);
    const matrixSection = page.locator("section", { has: page.getByRole("heading", { name: "Matriz de herramientas por perfil" }) });
    await expect(matrixSection.getByRole("heading", { name: "Navegador moderno" })).toBeVisible();
  });

  test("funciona en modo oscuro", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await page.locator('button[aria-label="Cambiar tema"]').click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("heading", { name: "Preparar mi entorno" })).toBeVisible();
  });

  test("importar un reporte del verificador actualiza la matriz con la versión detectada", async ({ page }) => {
    await page.goto("/preparar-entorno");
    await page.getByRole("button", { name: "Windows" }).click();

    const report = JSON.stringify({
      format: "planestudio-workstation-report",
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      os: "windows",
      tools: [
        { id: "git", command: "git --version", detected: true, rawVersion: "git version 2.45.1", status: "installed" },
      ],
    });

    await page.getByRole("textbox", { name: "Importar reporte del verificador" }).fill(report);
    await page.getByRole("button", { name: "Analizar reporte" }).click();
    await expect(page.getByText("Herramientas detectadas")).toBeVisible();

    await page.getByRole("button", { name: "Aplicar al estado" }).click();
    await expect(page.getByText("Estado actualizado con el reporte.")).toBeVisible();

    const gitRow = page.locator("tr", { hasText: "Git" });
    await expect(gitRow.getByText(/Instalada/)).toBeVisible();
    await expect(gitRow.getByText(/git version 2\.45\.1/)).toBeVisible();
  });

  test("el gate técnico de un lab aparece sin la herramienta instalada y desaparece al marcarla", async ({ page }) => {
    await page.goto("/labs/lab-52-cli-conexion-tenant");
    const gateHeading = page.getByRole("heading", { name: "Antes de este lab puede convenirte verificar" });
    await expect(gateHeading).toBeVisible();
    const gateSection = page.locator("section", { has: gateHeading });
    await expect(gateSection.getByText("Power Platform CLI", { exact: true })).toBeVisible();

    await gateSection.getByRole("link", { name: "Preparar mi entorno" }).click();
    await expect(page).toHaveURL(/\/preparar-entorno$/);

    const pacRow = page.locator("tr", { hasText: "Power Platform CLI" });
    await pacRow.getByRole("button", { name: "Marcar instalada" }).click();
    await expect(pacRow.getByText("Instalada", { exact: true })).toBeVisible();

    await page.goto("/labs/lab-52-cli-conexion-tenant");
    await expect(page.getByRole("heading", { name: "Antes de este lab puede convenirte verificar" })).toHaveCount(0);
  });

  test("el gate técnico reconoce GitHub Copilot/Claude Code como señal de VS Code", async ({ page }) => {
    await page.goto("/labs/lab-45-copilot-implementacion-guiada");
    const gateHeading = page.getByRole("heading", { name: "Antes de este lab puede convenirte verificar" });
    await expect(gateHeading).toBeVisible();
    const gateSection = page.locator("section", { has: gateHeading });
    await expect(gateSection.getByText("Visual Studio Code", { exact: true })).toBeVisible();
  });

  test("marcar herramientas no altera el progreso académico", async ({ page }) => {
    await page.goto("/preparar-entorno");
    const gitRow = page.locator("tr", { hasText: "Git" });
    await gitRow.getByRole("button", { name: "Marcar instalada" }).click();

    await page.goto("/progreso");
    await expect(page.getByRole("heading", { name: "Progreso académico" })).toBeVisible();
    await expect(page.getByText("0/8").first()).toBeVisible();
  });
});
