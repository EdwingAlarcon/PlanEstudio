import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { ReadingProgress } from "@/components/layout/reading-progress";

export const metadata: Metadata = {
  title: {
    default: "Power Platform & D365 — Plan de Estudio",
    template: "%s | PlanEstudio",
  },
  description: "Plan de aprendizaje progresivo: de cero a base laboral guiada en Power Platform y Dynamics 365 Customer Engagement.",
  keywords: ["Power Platform", "Dynamics 365", "PL-900", "PL-400", "arquitectura", "consultor funcional", "e-learning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip to content — accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
          >
            Saltar al contenido
          </a>

          <ServiceWorkerRegister />
          <ReadingProgress />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
