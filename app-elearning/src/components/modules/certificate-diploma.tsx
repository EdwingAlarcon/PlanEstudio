import { UI, type LevelId } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CertificateDiplomaProps {
  levelId: LevelId;
  userName: string;
  date: Date;
}

const BORDER_COLORS: Record<LevelId, string> = {
  basico:     "border-emerald-600 dark:border-emerald-400",
  intermedio: "border-blue-600    dark:border-blue-400",
  avanzado:   "border-orange-600  dark:border-orange-400",
  arquitecto: "border-red-600     dark:border-red-400",
  ia:         "border-purple-600  dark:border-purple-400",
  d365:       "border-teal-600    dark:border-teal-400",
  rpa:        "border-[#6B4EFF]   dark:border-[#A99BFF]",
};

const ACCENT_TEXT_COLORS: Record<LevelId, string> = {
  basico:     "text-emerald-700 dark:text-emerald-400",
  intermedio: "text-blue-700    dark:text-blue-400",
  avanzado:   "text-orange-700  dark:text-orange-400",
  arquitecto: "text-red-700     dark:text-red-400",
  ia:         "text-purple-700  dark:text-purple-400",
  d365:       "text-teal-700    dark:text-teal-400",
  rpa:        "text-[#6B4EFF]   dark:text-[#A99BFF]",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CertificateDiploma({ levelId, userName, date }: CertificateDiplomaProps) {
  return (
    <div
      className={cn(
        "certificate-print-area mx-auto max-w-3xl aspect-[1.414/1] w-full",
        "border-8 double p-10 flex flex-col items-center justify-center text-center gap-6",
        "bg-background relative",
        BORDER_COLORS[levelId]
      )}
    >
      <div
        className={cn(
          "absolute inset-3 border-2 pointer-events-none",
          BORDER_COLORS[levelId]
        )}
        aria-hidden
      />

      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Plan de Estudio Power Platform &amp; D365
      </p>

      <h1 className="font-serif text-3xl font-bold">Certificado de Finalización</h1>

      <p className="text-sm text-muted-foreground">Se otorga el presente certificado a</p>

      <p className="font-serif text-4xl font-semibold">{userName}</p>

      <p className="text-base leading-relaxed max-w-lg">
        {levelId === "ia" ? (
          <>
            por haber completado exitosamente el{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , aplicando de forma consistente las buenas prácticas de desarrollo asistido
            por IA en proyectos de Power Platform y Dynamics 365.
          </>
        ) : levelId === "d365" ? (
          <>
            por haber completado exitosamente el{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , demostrando profundidad funcional en Dynamics 365 Sales, Customer Service,
            Customer Insights y Field Service, con visión de arquitectura Customer
            Engagement end-to-end.
          </>
        ) : levelId === "rpa" ? (
          <>
            por haber completado exitosamente la especialización{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , demostrando diseño, construcción, operación y diagnóstico de automatizaciones
            Power Automate Desktop en alcance controlado.
          </>
        ) : levelId === "arquitecto" ? (
          <>
            por haber completado exitosamente el{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , demostrando competencias de arquitectura de soluciones Power Platform,
            gobernanza, seguridad, ALM e integración empresarial.
          </>
        ) : (
          <>
            por haber completado exitosamente el{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.badge[levelId]}
            </span>
            , quedando preparado para rendir la certificación{" "}
            <span className={cn("font-semibold", ACCENT_TEXT_COLORS[levelId])}>
              {UI.levels.cert[levelId]}
            </span>
            .
          </>
        )}
      </p>

      <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
    </div>
  );
}
