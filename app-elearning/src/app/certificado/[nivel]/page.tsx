import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { CertificateClient } from "./certificate-client";

interface PageProps {
  params: Promise<{ nivel: string }>;
}

export async function generateStaticParams() {
  return LEVEL_ORDER.map((nivel) => ({ nivel }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nivel } = await params;
  if (!LEVEL_ORDER.includes(nivel as LevelId)) return {};
  return { title: "Certificado" };
}

export default async function CertificatePage({ params }: PageProps) {
  const { nivel } = await params;
  if (!LEVEL_ORDER.includes(nivel as LevelId)) notFound();

  return <CertificateClient levelId={nivel as LevelId} />;
}
