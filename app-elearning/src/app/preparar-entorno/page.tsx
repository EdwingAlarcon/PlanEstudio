import type { Metadata } from "next";
import { PrepararEntornoClient } from "./preparar-entorno-client";

export const metadata: Metadata = {
  title: "Preparar mi entorno",
  description: "Prepara tu estacion de trabajo, entorno y acceso antes de avanzar con modulos y labs tecnicos.",
};

export default function PrepararEntornoPage() {
  return <PrepararEntornoClient />;
}
