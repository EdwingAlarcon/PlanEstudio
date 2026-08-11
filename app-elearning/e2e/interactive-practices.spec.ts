import { test, expect } from "@playwright/test";

test.describe("Interactive Practice Engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("catalogo, filtros y busqueda global exponen practicas interactivas", async ({ page }) => {
    await page.goto("/practica");
    await expect(page.getByRole("heading", { name: "Práctica interactiva" })).toBeVisible();
    await expect(page.getByText("0/15")).toBeVisible();
    await page.getByLabel("Engine").selectOption("query-playground");
    await expect(page.getByText("FetchXML básico")).toBeVisible();

    await page.keyboard.press("Control+k");
    await page.locator('input[aria-label="Buscar en el contenido"]').fill("IP-DV-001");
    await expect(page.getByRole("option").filter({ hasText: "Práctica interactiva" }).first()).toBeVisible();
  });

  test("multiple decision permite error, reintento correcto, persistencia y recarga profunda", async ({ page }) => {
    await page.goto("/practica/ip-dv-001-relacion-cliente-pedidos");
    await page.getByText("Cliente N:N Pedido").click();
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Requiere ajuste")).toBeVisible();

    await page.getByRole("button", { name: /Reintentar/ }).click();
    await page.getByText("Cliente 1:N Pedido").click();
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    await expect(page.getByText("100%").first()).toBeVisible();
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.interactive-practice.v1"))).resolves.toContain("IP-DV-001");

    await page.reload();
    await expect(page.locator("#exercise-heading")).toContainText("Relación Cliente/Pedidos");
    await expect(page.getByText("Dominado").first()).toBeVisible();
  });

  test("flow builder valida orden accesible con botones", async ({ page }) => {
    await page.goto("/practica/ip-pa-002-aprobacion-por-monto");
    await expect(page.getByRole("heading", { name: "Ordena el flujo" })).toBeVisible();
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    await expect(page.getByText(/Monto: 15.000.000/)).toBeVisible();
  });

  test("query playground acepta FetchXML limitado y rechaza entrada insegura", async ({ page }) => {
    await page.goto("/practica/ip-qry-001-fetchxml-basico");
    const editor = page.getByLabel("Editor fetchxml");
    await editor.fill("<script>fetch('https://example.com')</script>");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Requiere ajuste")).toBeVisible();

    await editor.fill('<fetch top="2"><entity name="account"><attribute name="name" /><attribute name="city" /><filter><condition attribute="city" operator="eq" value="Bogotá" /></filter></entity></fetch>');
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    await expect(page.getByText("Contoso Norte")).toBeVisible();
  });

  test("debug scenario registra pistas, solucion y requiere refuerzo", async ({ page }) => {
    await page.goto("/practica/ip-trb-001-flow-falla-null");
    await page.getByText("Pista 1").click();
    await page.getByRole("button", { name: "Ver solución" }).click();
    await expect(page.getByText("Solución de referencia")).toBeVisible();
    await page.getByLabel("Escribe la corrección.").fill("Usar coalesce, validar null y condition previa para amount empty.");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.interactive-practice.v1"))).resolves.toContain("solutionRevealed");
  });

  test("modulos, labs, mi ruta y progreso enlazan el nuevo motor", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/dataverse-fundamentos-y-modelado-basico");
    await expect(page.getByRole("heading", { name: "Prueba lo aprendido" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Relación Cliente\/Pedidos/ })).toBeVisible();

    await page.goto("/labs/lab-02-dataverse-modelo-datos");
    await expect(page.getByRole("heading", { name: "Antes de ejecutar el lab" })).toBeVisible();

    await page.goto("/mi-ruta");
    await expect(page.getByRole("heading", { name: "Práctica interactiva" }).first()).toBeVisible();

    await page.goto("/progreso");
    await expect(page.getByRole("heading", { name: "Práctica interactiva" }).first()).toBeVisible();
  });

  test("responsive movil mantiene controles y feedback visibles", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/practica/ip-qry-002-odata-select-top");
    await expect(page.locator("#exercise-heading")).toContainText("OData select/filter/top");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    await expect(page.getByText("Litware Capital")).toBeVisible();
  });
});
