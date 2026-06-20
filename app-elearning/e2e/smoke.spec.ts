import { test, expect } from "@playwright/test";

test.describe("Smoke test — golden path", () => {
  test("dashboard loads with level cards", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Power Platform|PlanEstudio/i);

    // At least one level card visible
    await expect(page.locator("text=Nivel 1").first()).toBeVisible();
    await expect(page.locator("text=Básico").first()).toBeVisible();
  });

  test("navigate to Nivel 1 and see module list", async ({ page }) => {
    await page.goto("/nivel/basico");

    // Heading visible
    await expect(page.locator("h1")).toContainText("Básico");

    // At least one module card
    await expect(page.locator("text=Módulo 1").first()).toBeVisible();
  });

  test("navigate to first module, mark complete, and verify progress ring updates", async ({
    page,
  }) => {
    await page.goto("/nivel/basico");

    // Click the first module link
    const firstModuleLink = page
      .locator('a[href*="/nivel/basico/modulo/"]')
      .first();
    await firstModuleLink.click();

    // Module page loaded — title visible
    await expect(page.locator("h1")).toBeVisible();

    // Find the "Marcar como completado" button and click it
    const completeBtn = page.locator('button[aria-label*="Marcar"]').first();
    await completeBtn.waitFor({ state: "visible" });
    await completeBtn.click();

    // Button should now say "Completado" (aria-pressed=true)
    await expect(completeBtn).toHaveAttribute("aria-pressed", "true");

    // Go back to level page
    await page.locator('a[href="/nivel/basico"]').first().click();

    // Progress should show at least 1 completed
    await expect(page.locator("text=/1\\s*\\/\\s*\\d+/")).toBeVisible();
  });

  test("simulator page loads and shows start button", async ({ page }) => {
    await page.goto("/simulador");

    await expect(page.locator("h1")).toContainText("Simulador");
    await expect(
      page.locator("button", { hasText: "Iniciar simulador" })
    ).toBeVisible();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    await page.goto("/");

    const toggleBtn = page.locator('button[aria-label="Cambiar tema"]');
    await toggleBtn.click();

    // HTML element should have class "dark"
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("skip to content link is accessible via keyboard", async ({ page }) => {
    await page.goto("/");

    // Tab once to focus skip link
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a", { hasText: "Saltar al contenido" });
    await expect(skipLink).toBeFocused();
  });

  test("404 page renders for unknown route", async ({ page }) => {
    await page.goto("/ruta-que-no-existe");

    await expect(page.locator("text=404")).toBeVisible();
    await expect(
      page.locator("a", { hasText: "Volver al inicio" })
    ).toBeVisible();
  });
});
