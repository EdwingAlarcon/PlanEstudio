import { test, expect } from "@playwright/test";

// Cierra huecos de cobertura E2E detectados al auditar rutas y funciones de la app contra los
// specs existentes: /rutas, /rutas/[slug], /mapa, panel de readiness y gate de prerrequisitos de
// labs, recursos de soluciones de referencia, insignia de vigencia y manifest PWA.

const ACADEMIC_KEY = "plan-estudio-progress";

test.describe("Rutas profesionales", () => {
  test("el listado enlaza al detalle de una ruta con su tarjeta de progreso propia", async ({ page }) => {
    await page.goto("/rutas");
    await expect(page.getByRole("heading", { level: 1, name: "Rutas profesionales" })).toBeVisible();

    await page.locator('a[href$="/rutas/maker"]').first().click();
    await expect(page).toHaveURL(/\/rutas\/maker$/);
    await expect(page.getByRole("heading", { name: "Tu progreso en esta ruta" })).toBeVisible();
  });

  test("una ruta inexistente muestra la página 404", async ({ page }) => {
    const response = await page.goto("/rutas/ruta-que-no-existe-xyz");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Mapa curricular", () => {
  test("carga con su leyenda y el bloque de fundamentos comunes", async ({ page }) => {
    await page.goto("/mapa");
    await expect(page.getByRole("heading", { level: 1, name: "Mapa curricular completo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Leyenda" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fundamentos comunes" })).toBeVisible();
  });
});

test.describe("Labs — readiness y prerrequisitos", () => {
  test("el detalle de un lab muestra el panel 'Antes de empezar'", async ({ page }) => {
    await page.goto("/labs/lab-02-dataverse-modelo-datos");
    await expect(page.getByRole("heading", { name: "Antes de empezar", exact: true })).toBeVisible();
  });

  test("en modo guiado, LAB-111 advierte de los módulos 68 y 75 y deja de hacerlo al completarlos", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Empiezo desde cero").click();
    await expect(page).toHaveURL(/\/mi-ruta$/);

    await page.goto("/labs/lab-111-rpa-despliegue-operacion-unattended");
    const gate = page.getByRole("heading", { name: "Antes de este lab puede convenirte revisar" });
    await expect(gate).toBeVisible();
    await expect(
      page.getByLabel("Antes de este lab puede convenirte revisar").getByText("Módulos 68 y 75 completados"),
    ).toBeVisible();

    // La advertencia no bloquea: el contenido del lab sigue disponible.
    await expect(page.locator("h1").first()).toBeVisible();

    await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : { state: {}, version: 0 };
      stored.state = { ...stored.state, completedModules: ["rpa-68", "rpa-75"] };
      window.localStorage.setItem(key, JSON.stringify(stored));
    }, ACADEMIC_KEY);
    await page.reload();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(gate).toHaveCount(0);
  });

  test("en modo libre no se muestra la advertencia de prerrequisitos", async ({ page }) => {
    await page.goto("/mi-ruta#roles");
    await page.getByRole("button", { name: /Activar explorar libremente/i }).click();
    await expect(page.getByText("Explorar libremente").first()).toBeVisible();

    await page.goto("/labs/lab-111-rpa-despliegue-operacion-unattended");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Antes de este lab puede convenirte revisar" })).toHaveCount(0);
  });
});

test.describe("Recursos de capstones", () => {
  test("las soluciones de referencia cargan y LAB-077 enlaza a ellas", async ({ page }) => {
    await page.goto("/recursos/soluciones-referencia-capstones");
    await expect(page.locator("h1").first()).toContainText(/Soluciones de Referencia/i);

    await page.goto("/labs/lab-77-jr-007-customer-service-specialist-simulation");
    await expect(page.locator('a[href*="soluciones-referencia-capstones"]').first()).toBeVisible();
  });
});

test.describe("Vigencia de contenido y PWA", () => {
  test("el módulo muestra la insignia 'Verificado AAAA-MM'", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    await expect(page.getByText(/Verificado \d{4}-\d{2}/).first()).toBeVisible();
  });

  test("el manifest PWA es válido y el service worker se sirve", async ({ request }) => {
    const manifestResponse = await request.get("/manifest.webmanifest");
    expect(manifestResponse.status()).toBe(200);
    const manifest = await manifestResponse.json();
    expect(manifest.short_name).toBe("PlanEstudio");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThan(0);

    const worker = await request.get("/sw.js");
    expect(worker.status()).toBe(200);
  });
});
