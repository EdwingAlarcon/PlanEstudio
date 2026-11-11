import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { RpaLegacySimulatorClient } from "./legacy-client";

export const metadata: Metadata = buildPageMetadata({
  title: "RPA Sandbox — Legacy simulator",
  description: "Aplicación legacy web simulada para practicar UI automation con PAD.",
  path: "/rpa-sandbox/legacy-app",
  noIndex: true,
});

export default function RpaLegacySimulatorPage() {
  return <RpaLegacySimulatorClient />;
}
