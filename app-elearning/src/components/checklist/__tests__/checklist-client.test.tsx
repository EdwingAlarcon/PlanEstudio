import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChecklistData } from "@/lib/checklist";
import { ChecklistClient } from "../checklist-client";

const checklist: ChecklistData = {
  totalModules: 55,
  totalItems: 2,
  levels: [
    {
      levelId: "basico",
      title: "Nivel 1: Básico",
      modules: [
        {
          moduleId: 1,
          title: "Introducción",
          items: [
            { id: "module-1-1", category: "Conocimiento", text: "Explico la plataforma" },
            { id: "module-1-2", category: "Práctica", text: "Creo un ambiente" },
          ],
        },
      ],
    },
  ],
};

describe("ChecklistClient", () => {
  it("renders module and lab totals from content-derived props", () => {
    render(<ChecklistClient checklist={checklist} totalLabs={25} />);

    expect(screen.getByText("0/55")).toBeInTheDocument();
    expect(screen.getByText("0/25")).toBeInTheDocument();
  });
});
