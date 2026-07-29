import { test, expect } from "@playwright/test";

test.describe("Smoke — rutas principales", () => {
  test("sidebar mantiene D365 consistente en rutas transversales", async ({ page }) => {
    test.setTimeout(60_000);

    const routes = [
      "/",
      "/nivel/ia",
      "/nivel/d365",
      "/labs",
      "/experiencia-practica",
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
      await expect(sidebar.getByRole("link", { name: /Power Automate Desktop & RPA\s+RPA/ })).toBeVisible();
      await expect(sidebar.getByRole("link", { name: "Experiencia práctica" })).toBeVisible();
      await expect(sidebar.getByText("0/10")).toHaveCount(2);
      await expect(sidebar.getByText("PL-900 · PL-200 · PL-400 · Arquitectura · IA · D365 · RPA")).toBeVisible();
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
    await expect(page.locator("#main-content")).toHaveCount(1);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
  });

  test("barra de progreso sigue el scroll del contenedor principal", async ({ page }) => {
    await page.goto("/nivel/basico/modulo/power-apps-canvas-primeras-aplicaciones");
    await expect(page.locator("#main-content")).toHaveCount(1);

    const progressBar = page.getByRole("progressbar", { name: "Progreso de lectura" });
    await expect(progressBar).toBeAttached();
    await expect(progressBar).toHaveAttribute("aria-valuenow", "0");

    const mainContent = page.locator("#main-content");
    const mainBox = await mainContent.boundingBox();
    if (!mainBox) throw new Error("main-content no tiene caja visible");

    await page.mouse.move(mainBox.x + mainBox.width / 2, mainBox.y + mainBox.height / 2);
    await page.mouse.wheel(0, 1400);
    await mainContent.evaluate((el) => {
      el.scrollTop = Math.max(el.scrollTop, 1400);
      el.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    await expect
      .poll(async () => mainContent.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(0);

    await expect
      .poll(async () => Number(await progressBar.getAttribute("aria-valuenow")))
      .toBeGreaterThan(0);
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

  test("experiencia práctica lista y filtra el piloto profesional", async ({ page }) => {
    await page.goto("/experiencia-practica");
    await expect(page.locator("h1")).toContainText("Experiencia práctica");
    await expect(page.getByText("13 incidentes")).toBeVisible();
    await expect(page.getByText("5 challenges")).toBeVisible();
    await expect(page.getByText("2 simulaciones")).toBeVisible();

    await page.getByRole("button", { name: "Incident Lab" }).click();
    await expect(page.getByText("13 de 20")).toBeVisible();
    await expect(page.getByText("INC-001")).toBeVisible();
    await expect(page.getByText("CH-001")).toHaveCount(0);

    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await page.getByRole("button", { name: "Challenge Lab" }).click();
    await expect(page.getByText("5 de 20")).toBeVisible();
    await expect(page.getByText("CH-001")).toBeVisible();
  });

  test("detalle de incident lab muestra evidencias, método y solución de referencia", async ({ page }) => {
    await page.goto("/experiencia-practica/inc-001-seguridad-dataverse-oportunidades");
    await expect(page).toHaveURL(/\/experiencia-practica\/inc-001/);
    await expect(page.locator("h1")).toContainText("Seguridad Dataverse");
    await expect(page.getByText("Evidencia profesional requerida")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Solución de referencia" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sí, ya intenté" })).toBeVisible();
    await expect(page.getByText(/Las soluciones forman parte de un sitio estático/i)).toBeVisible();
    await expect(page.getByText(/Corrige el nivel de Write/i)).toHaveCount(0);
  });

  test("flujo práctico persiste sin alterar progreso académico y permite reset separado", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.clear();
      window.localStorage.setItem("plan-estudio-progress", JSON.stringify({
        state: {
          completedModules: ["basico-1"],
          quizScores: {},
          completedLabs: [],
          checklistItems: {},
          lastVisited: null,
          userName: null,
        },
        version: 0,
      }));
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Experiencia práctica" }).first()).toBeVisible();
    await expect(page.getByText("Iniciadas").first()).toBeVisible();

    await page.keyboard.press("Control+k");
    const input = page.locator('input[aria-label="Buscar en el contenido"]');
    await input.waitFor({ state: "visible" });
    await input.fill("INC-001 seguridad");
    await expect(page.getByRole("option").filter({ hasText: "Incidente" }).first()).toBeVisible();
    await page.getByRole("option").first().click();
    await expect(page).toHaveURL(/\/experiencia-practica\/inc-001-seguridad/);

    await page.getByRole("button", { name: "Iniciar práctica", exact: true }).click();
    await expect(page.getByText("En progreso").first()).toBeVisible();
    await expect(page.getByText("Intentos: 1")).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Registrar intento" }).click();
    await expect(page.getByText("Intentos: 2")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Revelar pista" }).first().click();
    await expect(page.getByText(/Empieza por el alcance del registro/i)).toBeVisible();
    await page.getByRole("button", { name: "Abrir de todos modos" }).click();
    await expect(page.getByText(/mínimo privilegio/i).first()).toBeVisible();
    await expect(page.evaluate(() => {
      const stored = window.localStorage.getItem("planestudio.practice-progress.v1");
      return stored ? JSON.parse(stored).state.records["INC-001"].status : null;
    })).resolves.not.toBe("completed");

    const evidence = page.locator('section[aria-labelledby="evidence-checklist-heading"] input[type="checkbox"]');
    const evidenceCount = await evidence.count();
    for (let i = 0; i < evidenceCount; i += 1) await evidence.nth(i).check();
    const selects = page.locator('select[id^="criterion-"]');
    const selectCount = await selects.count();
    for (let i = 0; i < selectCount; i += 1) await selects.nth(i).selectOption("solid");
    await page.getByRole("button", { name: "Guardar autoevaluación" }).click();
    await page.getByRole("button", { name: "Marcar completada" }).click();
    await expect(page.getByText("Completada").first()).toBeVisible();

    await page.reload();
    await expect(page.getByText("Completada").first()).toBeVisible();
    await expect(page.getByText("Intentos: 2")).toBeVisible();

    await page.goto("/progreso");
    await expect(page.getByRole("heading", { name: "Progreso académico" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Experiencia práctica" }).first()).toBeVisible();
    await expect(page.getByText("Completadas").first()).toBeVisible();
    const academic = await page.evaluate(() => window.localStorage.getItem("plan-estudio-progress"));
    expect(academic).toContain("basico-1");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Reiniciar prácticas" }).click();
    await expect(page.evaluate(() => window.localStorage.getItem("plan-estudio-progress"))).resolves.toContain("basico-1");
  });

  test("portabilidad práctica exporta, reinicia e importa sin tocar progreso académico", async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.clear();
      window.localStorage.setItem("plan-estudio-progress", JSON.stringify({
        state: {
          completedModules: ["basico-1"],
          quizScores: {},
          completedLabs: [],
          checklistItems: {},
          lastVisited: null,
          userName: null,
        },
        version: 0,
      }));
    });

    await page.goto("/experiencia-practica/inc-001-seguridad-dataverse-oportunidades");
    await page.getByRole("button", { name: "Iniciar práctica", exact: true }).click();
    await page.locator('textarea[aria-label="Notas personales de la práctica"]').fill("Nota portable sin datos reales");
    await page.getByRole("button", { name: "Guardar notas" }).click();
    await page.goto("/progreso");
    await page.evaluate(() => {
      (window as typeof window & { __practiceDownload?: { download: string; href: string } | null }).__practiceDownload = null;
      HTMLAnchorElement.prototype.click = function click() {
        (window as typeof window & { __practiceDownload?: { download: string; href: string } | null }).__practiceDownload = {
          download: this.download,
          href: this.href,
        };
      };
    });

    const exportButton = page.getByRole("region", { name: "Respaldo y portabilidad" }).getByRole("button", { name: "Exportar progreso práctico" });
    await expect(exportButton).toBeEnabled();
    await exportButton.evaluate((button) => (button as HTMLButtonElement).click());
    await expect.poll(async () => page.evaluate(() => {
      return (window as typeof window & { __practiceDownload?: { download: string; href: string } | null }).__practiceDownload?.download ?? "";
    })).toMatch(/^planestudio-practicas-.*\.json$/);
    await expect(page.getByText(/Backup generado: 1 prácticas/)).toBeVisible();
    const backupText = await page.evaluate(async () => {
      const stored = window.localStorage.getItem("planestudio.practice-progress.v1");
      return stored;
    });
    expect(backupText).toContain("Nota portable sin datos reales");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Reiniciar progreso práctico" }).click();
    await expect(page.getByText("0 registros locales")).toBeVisible();

    const backup = JSON.parse(backupText ?? "{}");
    const rawRecords = backup.state?.records ?? {};
    const portable = {
      format: "planestudio-practice-progress",
      schemaVersion: 2,
      exportedAt: "2026-07-29T00:00:00.000Z",
      product: "PlanEstudio",
      storageKey: "planestudio.practice-progress.v1",
      metadata: { recordCount: 1, attemptCount: 1, notesIncluded: true },
      records: rawRecords,
    };
    await page.setInputFiles('input[type="file"]', {
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(portable)),
    });
    await expect(page.getByText("Vista previa de importación")).toBeVisible();
    await expect(page.getByText("Válido")).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Importar con vista previa" }).click();
    await expect(page.getByText(/Progreso práctico combinado/)).toBeVisible();
    await expect(page.evaluate(() => window.localStorage.getItem("plan-estudio-progress"))).resolves.toContain("basico-1");
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.practice-progress.v1"))).resolves.toContain("Nota portable");
  });

  test("importa revisión humana externa con vista previa, duplicado y reentrega", async ({ page }) => {
    await page.goto("/experiencia-practica/inc-001-seguridad-dataverse-oportunidades");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.getByRole("button", { name: "Iniciar práctica", exact: true }).click();

    const attemptId = await page.evaluate(() => {
      const stored = window.localStorage.getItem("planestudio.practice-progress.v1");
      const record = stored ? JSON.parse(stored).state.records["INC-001"] : null;
      return record?.attempts?.[0]?.id;
    });
    const weights = [10, 15, 15, 10, 15, 15, 10, 10];
    const criteria = await page.locator('select[id^="criterion-"]').evaluateAll((selects, itemWeights) => selects.map((select, index) => {
      const id = select.getAttribute("id") ?? "";
      const label = document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent?.trim() ?? "";
      return { criterion: label, weight: itemWeights[index] ?? 0, level: "solid", comment: "Validado por revisión externa." };
    }), weights);
    const review = {
      format: "planestudio-external-review",
      schemaVersion: 1,
      reviewId: "REV-E2E-INC-001",
      practiceId: "INC-001",
      attemptId,
      reviewedAt: "2026-07-29T00:00:00.000Z",
      reviewer: { displayName: "Mentora E2E", alias: "mentora-e2e" },
      result: "requires_changes",
      criteria,
      score: 85,
      criticalFindings: [],
      strengths: ["Buen diagnóstico inicial."],
      improvements: ["Agregar evidencia de regresión."],
      summary: "Revisión humana externa de prueba.",
      resubmissionRequired: true,
    };

    await page.getByTestId("external-review-file-input").setInputFiles({
      name: "revision-externa.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(review)),
    });
    await expect(page.getByText("Lista para importar")).toBeVisible();
    await expect(page.getByText("Mentora E2E")).toBeVisible();
    await page.getByRole("button", { name: "Confirmar importación" }).click();
    await expect(page.getByText("Requiere ajustes").first()).toBeVisible();
    await expect(page.getByText(/Agregar evidencia de regresión/)).toBeVisible();

    await page.getByTestId("external-review-file-input").setInputFiles({
      name: "revision-externa-duplicada.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(review)),
    });
    await expect(page.getByText("Duplicado idéntico")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Crear reentrega" }).click();
    await expect(page.getByText("Intentos: 2")).toBeVisible();
    await expect(page.evaluate(() => window.localStorage.getItem("planestudio.practice-progress.v1"))).resolves.toContain("REV-E2E-INC-001");
  });

  test("detalle de challenge y simulación cargan como prácticas autónomas", async ({ page }) => {
    await page.goto("/experiencia-practica/ch-001-solucion-solicitudes-empresariales");
    await expect(page.locator("h1")).toContainText("Solución de solicitudes empresariales");
    await expect(page.getByText("Límites de ayuda")).toBeVisible();
    await expect(page.getByText("Cumplimiento funcional")).toBeVisible();

    await page.goto("/experiencia-practica/sim-001-primeros-cinco-dias-proyecto");
    await expect(page.locator("h1")).toContainText("Primeros cinco días");
    await expect(page.getByRole("heading", { name: /Día 5/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Autoevaluación por rúbrica" })).toBeVisible();
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
    await input.fill("Primeros cinco días");
    await expect(page.getByRole("option").filter({ hasText: "Simulación" }).first()).toBeVisible();
    await input.fill("Power Automate Desktop");
    await expect(page.getByRole("option").filter({ hasText: "RPA" }).first()).toBeVisible();
    await input.fill("unattended");
    await expect(page.getByRole("option").filter({ hasText: /RPA|Módulo|Lab/i }).first()).toBeVisible();
  });

  test("nivel RPA integra módulos, labs, práctica y checklist", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Power Automate Desktop & RPA/i }).first()).toBeVisible();

    await page.goto("/nivel/rpa");
    await expect(page.locator("h1")).toContainText("Power Automate Desktop & RPA");
    await expect(page.locator('a[href="/nivel/rpa/modulo/fundamentos-rpa-seleccion-procesos"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: /Ruta práctica recomendada/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Recursos RPA/i })).toBeVisible();

    await page.goto("/nivel/rpa/modulo/fundamentos-rpa-seleccion-procesos");
    await expect(page.getByRole("heading", { name: /Objetivo/i }).first()).toBeVisible();
    await expect(page.getByText(/API, conector o integración viable/i).first()).toBeVisible();

    await page.goto("/labs");
    await page.getByRole("button", { name: "RPA", exact: true }).first().click();
    await expect(page.locator('a[href="/labs/lab-104-rpa-primer-desktop-flow-mantenible"]')).toBeVisible();

    await page.goto("/experiencia-practica/inc-rpa-001-selector-roto-actualizacion");
    await expect(page.locator("h1")).toContainText("Selector roto");
    await expect(page.getByRole("heading", { name: /Sandbox y paquete SIT Automation Case/i })).toBeVisible();
    await page.goto("/experiencia-practica/ch-rpa-01-consolidacion-financiera-automatizada");
    await expect(page.locator("h1")).toContainText("Consolidación financiera");
    await page.goto("/experiencia-practica/sim-rpa-001-primeras-dos-semanas-rpa-developer");
    await expect(page.locator("h1")).toContainText("Primeras dos semanas");

    await page.goto("/recursos/checklist");
    await page.getByRole("button", { name: /Power Automate Desktop & RPA 0%/ }).click();
    await expect(page.getByRole("heading", { name: /Fundamentos de RPA y Selección de Procesos/i })).toBeVisible();
    await page.goto("/progreso");
    await expect(page.getByRole("heading", { name: /RPA · RPA/i })).toBeVisible();
  });

  test("recursos y sandbox RPA funcionan en desktop, móvil y modo oscuro", async ({ page }) => {
    await page.goto("/recursos/rpa-recursos-practica");
    await expect(page.locator("h1, h2").first()).toContainText(/Recursos de práctica RPA/i);
    await expect(page.getByRole("link", { name: /SIT Automation Case/i }).first()).toHaveAttribute("href", /practice-assets\/rpa\/sit-automation-case\/README.md/);
    await expect(page.getByRole("link", { name: /PDD ligero/i })).toBeVisible();

    await page.goto("/rpa-sandbox/portal");
    await expect(page.getByRole("heading", { name: "Portal SIT de solicitudes comerciales" })).toBeVisible();
    await expect(page.locator('[data-rpa-table="requests"]')).toBeVisible();
    await page.locator("#scenario-mode").selectOption("slow");
    await expect(page.getByRole("status")).toContainText(/Cargando tabla lenta simulada/i);
    await page.locator("#scenario-mode").selectOption("unexpected-modal");
    await expect(page.getByRole("dialog", { name: /Modal inesperado simulado/i })).toBeVisible();
    await page.getByRole("button", { name: "Cerrar modal" }).click();
    await page.locator("#scenario-mode").selectOption("selector-shift");
    await expect(page.locator('[data-rpa-table="requests-v2"]')).toBeVisible();
    await page.getByRole("button", { name: /Upload simulado/i }).click();
    await expect(page.getByRole("status")).toContainText(/Archivo recibido en simulación/i);

    await page.goto("/rpa-sandbox/legacy-app");
    await expect(page.getByRole("heading", { name: "SIT Registro Legacy" })).toBeVisible();
    await page.getByRole("button", { name: "Registrar" }).click();
    await expect(page.getByRole("dialog", { name: /Registro confirmado/i })).toBeVisible();
    await page.getByRole("button", { name: "Cerrar" }).click();
    await page.locator("#legacy-mode").selectOption("duplicate");
    await page.getByRole("button", { name: "Registrar" }).click();
    await expect(page.getByRole("status")).toContainText(/Registro duplicado/i);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/rpa-sandbox/portal");
    await expect(page.getByRole("heading", { name: "Portal SIT de solicitudes comerciales" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/rpa-sandbox/legacy-app");
    await page.locator('button[aria-label="Cambiar tema"]').click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("heading", { name: "SIT Registro Legacy" })).toBeVisible();
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
