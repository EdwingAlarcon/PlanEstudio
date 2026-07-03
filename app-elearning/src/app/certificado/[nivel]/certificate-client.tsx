"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Pencil } from "lucide-react";
import { useProgressStore } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { CertificateDiploma } from "@/components/modules/certificate-diploma";
import { CertificateNameDialog } from "@/components/modules/certificate-name-dialog";
import { type LevelId } from "@/lib/i18n";

export function CertificateClient({ levelId }: { levelId: LevelId }) {
  const router = useRouter();
  const userName = useProgressStore((s) => s.userName);
  const setUserName = useProgressStore((s) => s.setUserName);
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);
  const { percentage } = getLevelProgress(levelId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const shouldRedirect = percentage < 100 || !userName;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/nivel/${levelId}`);
    }
  }, [shouldRedirect, levelId, router]);

  if (shouldRedirect) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/nivel/${levelId}`}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Volver al nivel
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Cambiar nombre
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Imprimir
          </Button>
        </div>
      </div>

      <CertificateDiploma levelId={levelId} userName={userName} date={new Date()} />

      <CertificateNameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialName={userName}
        onConfirm={setUserName}
      />
    </div>
  );
}
