import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UI } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-xl font-medium">{UI.general.notFound}</p>
      <Button asChild>
        <Link href="/">{UI.general.backHome}</Link>
      </Button>
    </div>
  );
}
