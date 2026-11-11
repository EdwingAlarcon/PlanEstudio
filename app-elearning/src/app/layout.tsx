import type { Metadata } from "next";
import "./globals.css";
import { buildRootMetadata } from "@/lib/seo";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { ReadingProgress } from "@/components/layout/reading-progress";
import { CurriculumProvider } from "@/components/guided/use-next-best-action";
import { getAllLevels } from "@/lib/content";
import type { CurriculumModule } from "@/lib/learning-path";

// Solo los campos que usa el cliente para recomendar el siguiente módulo (76 entradas).
function getCurriculumIndex(): CurriculumModule[] {
  return getAllLevels().flatMap((level) =>
    level.modules.map((mod) => ({
      key: mod.id,
      moduleId: mod.moduleId,
      levelId: level.id,
      title: mod.title,
      href: `/nivel/${level.id}/modulo/${mod.slug}`,
      minutes: mod.estimatedMinutes,
    })),
  );
}

// Valores por defecto (título, descripción, Open Graph, Twitter e imagen /og.png).
// Cada página define los suyos con `buildPageMetadata` (src/lib/seo.ts), que añade canonical y og:url.
export const metadata: Metadata = buildRootMetadata();

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
          <CurriculumProvider curriculum={getCurriculumIndex()}>
            <AppShell>{children}</AppShell>
          </CurriculumProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
