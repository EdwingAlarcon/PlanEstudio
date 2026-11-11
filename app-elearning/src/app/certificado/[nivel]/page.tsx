import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildPageMetadata, PATHS } from "@/lib/seo";
import { LEVEL_ORDER, type LevelId } from "@/lib/i18n";
import { getLabsForLevel, getLevelById } from "@/lib/content";
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
  const level = getLevelById(nivel as LevelId);
  return buildPageMetadata({
    title: "Certificado",
    description: level ? `Certificado de finalización: ${level.title}.` : undefined,
    path: PATHS.certificate(nivel),
    noIndex: true,
  });
}

export default async function CertificatePage({ params }: PageProps) {
  const { nivel } = await params;
  if (!LEVEL_ORDER.includes(nivel as LevelId)) notFound();

  const levelId = nivel as LevelId;
  const modules = (getLevelById(levelId)?.modules ?? []).map((m) => ({
    moduleId: m.moduleId,
    title: m.title,
  }));
  const labs = getLabsForLevel(levelId).map((lab) => ({
    slug: lab.slug,
    displayId: lab.displayId,
    title: lab.title,
  }));

  return <CertificateClient levelId={levelId} modules={modules} labs={labs} />;
}
