import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getAllResourcePages } from "@/lib/content";
import { RESOURCE_GROUPS } from "@/lib/resource-catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "Recursos",
  description: "Guías de apoyo agrupadas por lo que necesitas: empezar, estudiar, puentes técnicos, especializaciones y empleo.",
  path: "/recursos",
});

export default function ResourcesIndexPage() {
  const titles = new Map(getAllResourcePages().map((page) => [page.slug, page.title]));

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Recursos</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Material de consulta. No hace falta leerlo en orden: cada módulo enlaza el recurso que necesita en el momento
          en que lo necesita.
        </p>
      </header>

      {RESOURCE_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`grupo-${group.id}`} className="space-y-3">
          <div>
            <h2 id={`grupo-${group.id}`} className="text-base font-semibold">{group.title}</h2>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {group.slugs.filter((slug) => titles.has(slug)).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/recursos/${slug}`}
                  className="block px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  {titles.get(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
