import { notFound } from "next/navigation";
import { Section } from "@/common/layout";
import { Heading } from "@/common/heading";
import type { Metadata } from "next";

export const dynamic = "force-static";

interface ChangelogPageParams {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  return [];
};

export const generateMetadata = async ({
  params: _params,
}: ChangelogPageParams): Promise<Metadata | undefined> => {
  return {
    title: "Changelog | GhostDash",
  };
};

export default async function ChangelogPostPage({ params: _params }: ChangelogPageParams) {
  const params = await _params;
  return notFound();
}
