import type { Metadata } from "next";
import QPageClient from "./QPageClient";

function decode(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prompt: string }>;
}): Promise<Metadata> {
  const { prompt } = await params;
  const decoded = decode(prompt);
  const trimmed = decoded.length > 80 ? decoded.slice(0, 77) + "…" : decoded;
  return {
    title: trimmed,
    description: decoded,
    openGraph: {
      title: trimmed,
      description: decoded,
    },
    twitter: {
      title: trimmed,
      description: decoded,
    },
    robots: { index: false, follow: false },
  };
}

export default async function QPage({
  params,
}: {
  params: Promise<{ prompt: string }>;
}) {
  const { prompt } = await params;
  return <QPageClient prompt={decode(prompt)} />;
}
