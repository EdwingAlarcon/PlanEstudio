import { ImageResponse } from "next/og";

// Imagen de vista previa al compartir el enlace (LinkedIn, WhatsApp, Slack, X).
// Next la genera una vez en build y la exporta como `out/og.png`; no depende de runtime.
// Es un Route Handler con extensión y no `opengraph-image.tsx` porque esa convención se
// exporta sin extensión y Vercel la servía como `application/octet-stream` (la regla de
// cabeceras de `public/vercel.json` no se aplicaba); con `.png` cualquier hosting acierta el tipo.
// Sin cifras a propósito: así no se desactualiza cuando cambian los conteos del curso.
export const dynamic = "force-static"; // obligatorio con `output: "export"`
const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #005A9E 0%, #0078D4 60%, #4DB8FF 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "white",
              color: "#0078D4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 40, fontWeight: 600 }}>PlanEstudio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            Power Platform y Dynamics 365
          </div>
          <div style={{ fontSize: 38, lineHeight: 1.3, opacity: 0.95 }}>
            Aprende haciendo: de cero a una base laboral guiada, con módulos, laboratorios y práctica interactiva.
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.85 }}>planestudio.vercel.app</div>
      </div>
    ),
    { ...size },
  );
}
