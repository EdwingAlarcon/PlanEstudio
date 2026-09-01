import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test.describe("Interactive Practice Engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test("catalogo, filtros y busqueda global exponen practicas interactivas", async ({ page }) => {
    await page.goto("/practica");
    await expect(page.getByRole("heading", { name: "Práctica interactiva" })).toBeVisible();
    // Scoped to #main-content: the sidebar's Nivel IA progress badge also reads "0/15"
    // now that IA has 15 modules, coincidentally matching the interactive-practices total.
    await expect(page.locator("#main-content").getByText("0/15")).toBeVisible();
    await expect(page.locator("select").nth(0)).toBeEnabled();
    await page.locator("select").nth(1).selectOption("query-playground");
    await expect(page.locator("#exercise-heading")).toContainText("FetchXML básico");

    await page.keyboard.press("Control+k");
    await page.locator('input[aria-label="Buscar en el contenido"]').fill("IP-DV-001");
    await expect(page.getByRole("option").filter({ hasText: "Práctica interactiva" }).first()).toBeVisible();
  });

  test("filtros sincronizan seleccion, dificultad, estado vacio y limpieza", async ({ page }) => {
    await page.goto("/practica");
    await expect(page.locator("select").nth(0)).toBeEnabled();
    await expect(page.locator("#exercise-heading")).toContainText("Relación Cliente/Pedidos");
    await page.locator("select").nth(0).selectOption("power-automate");
    await expect(page.locator("#exercise-heading")).toContainText("Elegir trigger correcto");
    await page.locator("select").nth(1).selectOption("flow-builder");
    await expect(page.locator("#exercise-heading")).toContainText("Construir aprobación por monto");
    await page.locator("select").nth(2).selectOption("advanced");
    await expect(page.getByRole("heading", { name: "No encontramos prácticas con estos filtros" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Limpiar filtros" }).first().click();
    await expect(page.locator("#exercise-heading")).toContainText("Relación Cliente/Pedidos");

    await page.locator("select").nth(3).selectOption("completed");
    await expect(page.getByRole("heading", { name: "No encontramos prácticas con estos filtros" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Cambiar dominio" }).click();
    await expect(page.getByRole("heading", { name: "No encontramos prácticas con estos filtros" }).first()).toBeVisible();
  });

  test("multiple decision permite error, reintento correcto, persistencia y recarga profunda", async ({ page }) => {
    await page.goto("/practica/ip-dv-001-relacion-cliente-pedidos");
    await page.getByText("Cliente N:N Pedido").click();
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Requiere ajuste")).toBeVisible();

    await page.reload();
    await expect(page.locator("#exercise-heading")).toContainText("Relación Cliente/Pedidos");
    await expect(page.getByText("Requiere refuerzo").first()).toBeVisible();
    await expect(page.getByText("1 intentos")).toBeVisible();
    await expect(page.getByLabel("Cliente N:N Pedido")).toBeChecked();

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

  test("flow builder valida drag, teclado, botones, errores y persistencia", async ({ page }) => {
    await page.goto("/practica/ip-pa-002-aprobacion-por-monto");
    await page.evaluate(() => window.localStorage.removeItem("planestudio.interactive-practice.v1"));
    await page.reload();
    await expect(page.getByRole("heading", { name: "Ordena el flujo" })).toBeVisible();
    await page.locator("li").filter({ hasText: "When row added" }).getByRole("button", { name: "Bajar" }).click();
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText(/Parcial|Requiere ajuste/).first()).toBeVisible();

    await page.getByRole("button", { name: /Arrastrar o mover When row added/ }).press("ArrowUp");
    await page.getByRole("button", { name: /Arrastrar o mover Condition/ }).press("ArrowDown");
    await page.getByRole("button", { name: /Arrastrar o mover Condition/ }).press("ArrowUp");
    await page.getByRole("button", { name: /Arrastrar o mover Start approval/ }).click();
    await page.getByRole("button", { name: "Insertar después" }).first().click();
    await page.getByRole("button", { name: "Eliminar" }).last().click();
    await expect(page.getByRole("button", { name: "Restaurar bloques" })).toBeVisible();
    await page.getByRole("button", { name: "Restaurar bloques" }).click();

    await page.locator("li").filter({ hasText: "Send notification" }).dragTo(page.locator("li").filter({ hasText: "Update row: approved" }));
    await expect(page.getByText(/Send notification movido/)).toBeAttached();
    await page.getByRole("button", { name: /Arrastrar o mover Condition/ }).press("ArrowDown");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText(/Requiere ajuste|Parcial/)).toBeVisible();
    await page.getByRole("button", { name: /Arrastrar o mover Condition/ }).press("ArrowUp");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();
    await expect(page.getByText(/Monto: 15.000.000/)).toBeVisible();
    await expect.poll(async () => page.evaluate(() => window.localStorage.getItem("planestudio.interactive-practice.v1") ?? "")).toContain("IP-PA-002");
    await page.reload();
    await expect(page.getByText(/Dominado|En progreso|Requiere refuerzo/).first()).toBeVisible();
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

  test("progreso exporta, importa con merge, reemplaza y reinicia solo practicas interactivas", async ({ page }, testInfo) => {
    await page.goto("/practica/ip-dv-001-relacion-cliente-pedidos");
    await page.getByText("Cliente 1:N Pedido").click();
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Correcto", { exact: true })).toBeVisible();

    await page.goto("/progreso");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportar progreso", exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("planestudio-practicas-interactivas");

    const importPath = path.join(testInfo.outputDir, "interactive-import.json");
    fs.mkdirSync(testInfo.outputDir, { recursive: true });
    fs.writeFileSync(importPath, JSON.stringify({
      schemaVersion: 1,
      source: "planestudio.interactive-practice",
      exportedAt: "2026-08-11T00:00:00.000Z",
      practices: {
        "IP-QRY-001": {
          schemaVersion: 1,
          practiceId: "IP-QRY-001",
          status: "completed",
          mastery: "proficient",
          startedAt: "2026-08-11T00:00:00.000Z",
          lastActivityAt: "2026-08-11T00:01:00.000Z",
          completedAt: "2026-08-11T00:01:00.000Z",
          attemptCount: 1,
          bestScore: 100,
          lastScore: 100,
          hintsUsed: [],
          solutionRevealed: false,
          feedbackSeen: true,
          totalDurationSeconds: 0,
          mode: "practice",
          events: [{ type: "completed", at: "2026-08-11T00:01:00.000Z", score: 100 }],
        },
        "IP-OLD-999": {
          schemaVersion: 1,
          practiceId: "IP-OLD-999",
          status: "completed",
          mastery: "proficient",
          attemptCount: 1,
          bestScore: 100,
          lastScore: 100,
          hintsUsed: [],
          solutionRevealed: false,
          feedbackSeen: true,
          totalDurationSeconds: 0,
          mode: "practice",
          events: [],
        },
      },
    }));
    await page.getByLabel("Importar progreso de prácticas interactivas").setInputFiles(importPath);
    await expect(page.getByText("1 prácticas conocidas")).toBeVisible();
    await page.getByRole("button", { name: "Fusionar" }).click();
    await expect(page.getByText("Importación fusionada")).toBeVisible();
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.interactive-practice.v1"))).resolves.toContain("IP-QRY-001");

    await page.getByLabel("Importar progreso de prácticas interactivas").setInputFiles(importPath);
    await page.getByRole("button", { name: "Reemplazar solo prácticas interactivas" }).click();
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.interactive-practice.v1"))).resolves.not.toContain("IP-DV-001");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Reiniciar solo prácticas interactivas" }).click();
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.interactive-practice.v1"))).resolves.toContain('"records":{}');
  });

  test("query playground cubre OData invalido y storage corrupto sin romper progreso", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("planestudio.interactive-practice.v1", "{bad json"));
    await page.goto("/practica/ip-qry-002-odata-select-top");
    await expect(page.locator("#exercise-heading")).toContainText("OData select/filter/top");
    const editor = page.getByLabel("Editor odata");
    await editor.fill("https://example.com/accounts?$select=name");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Requiere ajuste")).toBeVisible();
    await editor.fill("/contacts?$select=name");
    await page.getByRole("button", { name: /Validar/ }).click();
    await expect(page.getByText("Solo se permite consultar /accounts")).toBeVisible();
  });
});
