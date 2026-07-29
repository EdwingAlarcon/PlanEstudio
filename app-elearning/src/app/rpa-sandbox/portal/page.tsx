import type { Metadata } from "next";
import { RpaPortalSandboxClient } from "./portal-client";

export const metadata: Metadata = {
  title: "RPA Sandbox — Portal de solicitudes",
  description: "Portal educativo estático para practicar automatización web con Power Automate Desktop.",
};

export default function RpaPortalSandboxPage() {
  return <RpaPortalSandboxClient />;
}
