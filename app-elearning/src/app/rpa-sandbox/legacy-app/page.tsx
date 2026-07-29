import type { Metadata } from "next";
import { RpaLegacySimulatorClient } from "./legacy-client";

export const metadata: Metadata = {
  title: "RPA Sandbox — Legacy simulator",
  description: "Aplicación legacy web simulada para practicar UI automation con PAD.",
};

export default function RpaLegacySimulatorPage() {
  return <RpaLegacySimulatorClient />;
}
