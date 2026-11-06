import { getSearchDocuments } from "@/lib/content";
import { getPracticeSearchDocuments } from "@/lib/practices";
import { getInteractivePracticeSearchDocuments } from "@/lib/interactive-practices";

// Índice de búsqueda como archivo estático (/search-index.json). Antes viajaba
// serializado dentro de cada página vía layout.tsx (~1,7 MB por página); ahora el
// buscador lo descarga una sola vez al abrirse y el service worker lo cachea.
// En `output: "export"` solo se admiten Route Handlers GET con force-static.
export const dynamic = "force-static";

export function GET() {
  return Response.json([
    ...getSearchDocuments(),
    ...getPracticeSearchDocuments(),
    ...getInteractivePracticeSearchDocuments(),
  ]);
}
