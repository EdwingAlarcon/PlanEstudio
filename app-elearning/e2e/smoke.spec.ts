import { test, expect } from "@playwright/test";

test.describe("Smoke — rutas principales", () => {
  test("dashboard carga con level cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Power Platform|PlanEstudio/i);
    await expect(page.locator("text=Nivel 1").first()).toBeVisible();
    await expect(page.locator("text=Básico").first()).toBeVisible();
  });

  test("Nivel 1 muestra lista de módulos", async ({ page }) => {
    await page.goto("/nivel/basico");
    await expect(page.locator("h1")).toContainText("Básico");
    await expect(page.locator("text=01").first()).toBeVisible();
  });

  test("detalle de módulo carga contenido", async ({ page }) => {
    await page.goto("/nivel/basico");
    const firstLink = page.locator('a[href*="/nivel/basico/modulo/"]').first();
    await firstLink.click();
    await expect(page.locator("h1")).toBeVisible();
    // El contenido Markdown renderizado debe tener al menos un h2/h3
    await expect(page.locator("article h2, article h3").first()).toBeVisible();
  });

  test("simulador carga con botón de inicio", async ({ page }) => {
    await page.goto("/simulador");
    await expect(page.locator("h1")).toContainText("Simulador");
    await expect(page.locator("button", { hasText: "Iniciar simulador" })).toBeVisible();
  });

  test("página de laboratorios carga con cards", async ({ page }) => {
    await page.goto("/labs");
    await expect(page.locator("h1")).toContainText("Laboratorios");
    // Al menos un lab card visible
    await expect(page.locator("a[href*='/labs/lab-']").first()).toBeVisible();
  });

  test("detalle de laboratorio carga contenido", async ({ page }) => {
    await page.goto("/labs");
    const firstLab = page.locator("a[href*='/labs/lab-']").first();
    await firstLab.click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Laboratorio")).toBeVisible();
  });

  test("recurso lenguajes-programacion carga", async ({ page }) => {
    await page.goto("/recursos/lenguajes-programacion");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("modo oscuro alterna correctamente", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('button[aria-label="Cambiar tema"]');
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    // Volver a claro
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("búsqueda encuentra módulos y labs", async ({ page }) => {
    await page.goto("/");
    // Abrir búsqueda con Ctrl+K
    await page.keyboard.press("Control+k");
    const input = page.locator('input[aria-label="Buscar en el contenido"]');
    await input.waitFor({ state: "visible" });
    await input.fill("Dataverse");
    // Debe haber resultados
    await expect(page.locator('[role="option"]').first()).toBeVisible();
    // Al menos un resultado con badge Módulo o Lab
    await expect(page.locator("text=Módulo").or(page.locator("text=Lab")).first()).toBeVisible();
  });

  test("skip-to-content es accesible por teclado", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator("a", { hasText: "Saltar al contenido" })).toBeFocused();
  });

  test("ruta desconocida muestra página 404", async ({ page }) => {
    await page.goto("/ruta-que-no-existe-xyz");
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("a", { hasText: "Volver al inicio" })).toBeVisible();
  });
});
