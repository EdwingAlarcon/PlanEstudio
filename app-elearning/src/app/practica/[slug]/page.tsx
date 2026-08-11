import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InteractivePracticeClient } from "@/components/interactive-practices/interactive-practice-client";
import { getAllInteractivePractices, getInteractivePracticeBySlug } from "@/lib/interactive-practices";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllInteractivePractices().map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const practice = getInteractivePracticeBySlug(slug);
  if (!practice) return { title: "Práctica no encontrada" };
  return {
    title: practice.title,
    description: practice.description,
  };
}

export default async function InteractivePracticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const practice = getInteractivePracticeBySlug(slug);
  if (!practice) notFound();

  return <InteractivePracticeClient practices={getAllInteractivePractices()} initialSlug={practice.slug} />;
}
