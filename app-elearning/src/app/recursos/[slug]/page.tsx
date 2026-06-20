import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllResourcePages, getResourceBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/modules/markdown-renderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = getAllResourcePages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getResourceBySlug(slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getResourceBySlug(slug);
  if (!page) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <MarkdownRenderer
        content={page.rawContent}
        className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-mt-16
          prose-code:font-mono
          prose-pre:bg-muted
          prose-a:text-primary hover:prose-a:underline
          prose-table:text-sm"
      />
    </div>
  );
}
