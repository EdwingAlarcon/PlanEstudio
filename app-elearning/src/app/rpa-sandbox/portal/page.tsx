import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { RpaPortalSandboxClient } from "./portal-client";

export const metadata: Metadata = buildPageMetadata({
  title: "RPA Sandbox — Portal de solicitudes",
  description: "Portal educativo estático para practicar automatización web con Power Automate Desktop.",
  path: "/rpa-sandbox/portal",
  noIndex: true,
});

export default function RpaPortalSandboxPage() {
  return <RpaPortalSandboxClient />;
}
