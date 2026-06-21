import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { ReadingProgress } from "@/components/layout/reading-progress";
import { getSearchDocuments } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Power Platform & D365 — Plan de Estudio",
    template: "%s | PlanEstudio",
  },
  description: "Plan de aprendizaje progresivo: de fundamentos a Arquitecto Senior en Power Platform y Dynamics 365.",
  keywords: ["Power Platform", "Dynamics 365", "PL-900", "PL-200", "PL-400", "PL-600", "e-learning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchDocuments = getSearchDocuments();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
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

          <ReadingProgress />
          <AppShell searchDocuments={searchDocuments}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
