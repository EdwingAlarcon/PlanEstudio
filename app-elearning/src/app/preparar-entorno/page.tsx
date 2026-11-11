import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { PrepararEntornoClient } from "./preparar-entorno-client";

export const metadata: Metadata = buildPageMetadata({
  title: "Preparar mi entorno",
  description: "Prepara tu estación de trabajo, entorno y acceso antes de avanzar con módulos y labs técnicos.",
  path: "/preparar-entorno",
});

export default function PrepararEntornoPage() {
  return <PrepararEntornoClient />;
}
