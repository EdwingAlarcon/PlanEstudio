import { test, expect } from "@playwright/test";

test.describe("Smoke — rutas principales", () => {
  test("sidebar mantiene D365 consistente en rutas transversales", async ({ page }) => {
    test.setTimeout(60_000);

    const routes = [
      "/",
      "/nivel/ia",
      "/nivel/d365",
      "/labs",
      "/recursos/checklist",
      "/power-platform",
      "/dynamics-365",
      "/integracion",
      "/empleabilidad",
      "/recursos/prompts-ia",
    ];

    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const sidebar = page.getByRole("complementary", { name: "Navegación principal" });

      await expect(sidebar.getByRole("link", { name: /Dynamics 365 Especialización\s+D365/ })).toBeVisible();
      await expect(sidebar.getByText("0/10")).toBeVisible();
      await expect(sidebar.getByText("PL-900 · PL-200 · PL-400 · Arquitectura · IA · D365")).toBeVisible();
      await expect(sidebar.getByText("Dynamics 365 Avanzado")).toHaveCount(0);
      await expect(sidebar.getByText("0/4")).toHaveCount(0);
    }
  });

  test("dashboard carga con level cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Power Platform|PlanEstudio/i);
    await expect(page.locator("text=Nivel 1").first()).toBeVisible();
    await expect(page.locator("text=Básico").first()).toBeVisible();
  });

  test("Nivel 1 muestra lista de módulos", async ({ page }) => {
    await page.goto("/nivel/basico");
    await expect(page.locator("h1")).toContainText("Básico");
    await expect(page.locator('a[href*="/nivel/basico/modulo/"]').first()).toBeVisible();
  });

  test("detalle de módulo carga contenido", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    await expect(page).toHaveURL(/\/nivel\/basico\/modulo\//);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
  });

  test("onboarding principiante mantiene sus bloques de inicio", async ({ page }) => {
    await page.goto("/como-usar");
    await expect(page.getByRole("heading", { name: "Primeras 2 horas si empiezas desde cero" })).toBeVisible();
    await expect(page.getByText("60-90 min")).toBeVisible();
    await expect(page.getByText("Completa el Mini Lab 01 dentro del Módulo 1")).toBeVisible();

    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    await expect(page.getByRole("heading", { name: /Mini Lab 01/i })).toBeVisible();
    await expect(page.getByText("Primera victoria en 5 minutos")).toBeVisible();

    await page.goto("/nivel/basico/modulo/fundamentos-de-power-fx-y-expresiones");
    await expect(page.getByRole("heading", { name: "Power Fx en español simple" })).toBeVisible();
    await expect(page.getByText("léela de adentro hacia afuera")).toBeVisible();

    await page.goto("/nivel/basico/modulo/primer-proyecto-integrado");
    await expect(page.getByRole("heading", { name: "Entregable mínimo viable del Nivel Básico" })).toBeVisible();
    await expect(page.getByText("No intentes hacer la entrega excelente desde el primer día")).toBeVisible();
  });

  test("marcar módulo como completado actualiza el progreso", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/introduccion-al-ecosistema-power-platform");
    const completeBtn = page.locator('button[aria-label*="Marcar"]').first();
    await completeBtn.waitFor({ state: "visible" });
    await completeBtn.click();
    await expect(completeBtn).toHaveAttribute("aria-pressed", "true");
    await page.goto("/nivel/basico");
    await expect(page.getByText(/1\s*\/\s*8 módulos/)).toBeVisible();
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
    await page.goto("/labs/lab-02-dataverse-modelo-datos");
    await expect(page).toHaveURL(/\/labs\/lab-/);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
  });

  test("recurso lenguajes-programacion carga", async ({ page }) => {
    await page.goto("/recursos/lenguajes-programacion");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("checklist permite marcar criterios y conserva estado local", async ({ page }) => {
    await page.goto("/recursos/checklist");
    await expect(page.getByRole("heading", { name: "Checklist de Progreso" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Checklist mínimo para principiantes" })).toBeVisible();
    await expect(page.getByText("Entré a Power Platform y reconozco el ambiente donde trabajo.")).toBeVisible();

    const firstCriterion = page.locator('input[type="checkbox"]').first();
    await firstCriterion.check();
    await page.locator("select").first().selectOption("4");
    await page.getByRole("button", { name: "Completados" }).click();
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
    await page.getByRole("button", { name: "Pendientes" }).click();
    await expect(page.locator('input[type="checkbox"]').first()).not.toBeChecked();
    await page.getByRole("button", { name: "Siguiente pendiente" }).click();
    await expect(page.getByRole("button", { name: "Pendientes" })).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Completados" }).click();
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
    await expect(page.locator("select").first()).toHaveValue("4");

    await page.getByRole("button", { name: "Limpiar checklist" }).click();
    await page.getByRole("button", { name: "Todos" }).click();
    await expect(page.locator('input[type="checkbox"]').first()).not.toBeChecked();
    await expect(page.locator("select").first()).toHaveValue("");
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

  test("nivel IA carga desde el sidebar y muestra sus 14 módulos", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/nivel/ia"]').first().click();
    await expect(page).toHaveURL(/\/nivel\/ia$/);
    await expect(page.locator("h1")).toContainText(/IA/i);
    await expect(page.locator('a[href*="/nivel/ia/modulo/"]').first()).toBeVisible();
  });

  test("filtro de laboratorios por dominio reduce los resultados", async ({ page }) => {
    await page.goto("/labs");
    await expect(page.locator("h1")).toContainText("Laboratorios");
    const counter = page.getByText(/de \d+ labs/);
    await expect(counter).toBeVisible();

    await page.getByRole("button", { name: "Dynamics 365", exact: true }).click();
    await expect(page.locator("a[href*='/labs/lab-90']")).toBeVisible();
    await expect(page.locator("a[href*='/labs/lab-02']")).toHaveCount(0);

    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page.locator("a[href*='/labs/lab-02']").first()).toBeVisible();
  });

  test("portafolio cambia a la vista por perfil laboral", async ({ page }) => {
    await page.goto("/portafolio");
    await expect(page.locator("h1")).toContainText("Portafolio profesional");

    await page.getByRole("tab", { name: "Por perfil laboral" }).click();
    await expect(page.getByRole("heading", { name: "CRM Functional Specialist" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "CRM Developer" })).toBeVisible();
    await expect(page.locator("text=Labs Job-Ready").first()).toBeVisible();

    await page.getByRole("tab", { name: "Por ruta" }).click();
    await expect(page.getByText("Reúne para tu portafolio").first()).toBeVisible();
  });

  test("detalle de módulo del nivel IA carga contenido", async ({ page }) => {
    await page.goto("/nivel/ia/modulo/fundamentos-ia-desarrollo");
    await expect(page).toHaveURL(/\/nivel\/ia\/modulo\//);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
  });

  test("certificado del nivel IA se genera sin lenguaje de examen PL-xxx", async ({ page }) => {
    await page.goto("/");
    // Sembrar el store de progreso directamente en localStorage: los 14 módulos
    // de IA completados con quiz aprobado (>=70%), los 10 labs del nivel IA
    // completados, y nombre de usuario — el certificado exige las tres cosas,
    // no solo módulos marcados como leídos.
    await page.evaluate(() => {
      const completedModules = Array.from({ length: 14 }, (_, i) => `ia-${i + 42}`);
      const quizScores = Object.fromEntries(
        Array.from({ length: 14 }, (_, i) => [String(i + 42), 90])
      );
      const completedLabs = [
        "lab-45-copilot-implementacion-guiada",
        "lab-51-flujo-completo-humano-ia-ci",
        "lab-52-cli-conexion-tenant",
        "lab-53-exportar-revisar-solucion-con-ia",
        "lab-54-conectar-app-externa-dataverse",
        "lab-55-uat-gonolive-y-auditoria-prompts",
        "lab-56-cambiar-entornos-dev-test-prod",
        "lab-57-diseno-solucion-d365-sales-con-ia",
        "lab-65-capstone-ai-copilot-agente-gobernado",
        "lab-80-jr-010-ai-assisted-crm-development",
      ];
      const state = {
        state: {
          completedModules,
          quizScores,
          completedLabs,
          checklistItems: {},
          lastVisited: null,
          userName: "Ada Lovelace",
        },
        version: 0,
      };
      window.localStorage.setItem("plan-estudio-progress", JSON.stringify(state));
    });
    await page.goto("/nivel/ia");
    await page.reload();
    await expect(page.getByText(/Nivel de Desarrollo Asistido por IA Completado/i)).toBeVisible();
    await expect(page.locator('button:has-text("Generar certificado")')).toBeVisible();

    await page.goto("/certificado/ia");
    await expect(page).toHaveURL(/\/certificado\/ia$/);
    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText(/buenas prácticas de desarrollo asistido por IA/i)).toBeVisible();
    await expect(page.getByText(/rendir la certificación/i)).toHaveCount(0);
  });
});
