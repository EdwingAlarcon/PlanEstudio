import { test, expect } from "@playwright/test";

test.describe("Continuidad para principiantes — sprint de brechas honestas", () => {
  test("la guia de herramientas explica como abrir una terminal antes del primer comando", async ({ page }) => {
    await page.goto("/recursos/guia-herramientas-workstation");
    const heading = page.getByRole("heading", { name: "Cómo abrir una terminal por primera vez" });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    await expect(page.getByText(/presiona la tecla/).first()).toBeVisible();
  });

  test("el ancla de terminal en preparar mi entorno resuelve al heading real", async ({ page }) => {
    await page.goto("/preparar-entorno");
    const link = page.getByRole("link", { name: /Aprende a abrir una terminal/i });
    await expect(link).toHaveAttribute(
      "href",
      "/recursos/guia-herramientas-workstation#cómo-abrir-una-terminal-por-primera-vez"
    );
    await link.click();
    await expect(
      page.getByRole("heading", { name: "Cómo abrir una terminal por primera vez" })
    ).toBeVisible();
  });

  test("Lab 03 muestra la variante sin tenant prometida desde Mi ruta", async ({ page }) => {
    await page.goto("/labs/lab-03-canvas-primera-app");
    const heading = page.getByRole("heading", { name: "Variante sin tenant" });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    await expect(page.getByText(/Qué SÍ valida esta variante/)).toBeVisible();
  });

  test("Modulo 23 y Modulo 34 declaran prerrequisitos externos antes del objetivo", async ({ page }) => {
    await page.goto("/nivel/avanzado/modulo/c-plugins-para-dataverse");
    await expect(
      page.getByRole("heading", { name: /no es autosuficiente en programación/ })
    ).toBeVisible();

    await page.goto("/nivel/arquitecto/modulo/azure-integration-services-avanzado");
    await expect(
      page.getByRole("heading", { name: /no es autosuficiente en Azure/ })
    ).toBeVisible();
    await expect(page.getByText(/Aviso de costos/)).toBeVisible();
  });

  test("un capstone enlaza a empleabilidad y el banner de nivel completo ofrece convertirlo en evidencia", async ({ page }) => {
    await page.goto("/labs/lab-61-capstone-maker-sistema-solicitudes");
    await expect(page.getByRole("heading", { name: "Convierte esto en evidencia laboral" })).toBeVisible();

    await page.goto("/");
    await page.evaluate(() => {
      const modules = Array.from({ length: 8 }, (_, i) => `basico-${i + 1}`);
      localStorage.setItem(
        "plan-estudio-progress",
        JSON.stringify({ state: { completedModules: modules, quizScores: {}, completedLabs: [], checklistItems: {}, lastVisited: null, userName: null }, version: 0 })
      );
    });
    await page.goto("/nivel/basico");
    await expect(page.getByRole("link", { name: "Convierte este nivel en evidencia laboral" })).toBeVisible();
  });
});
