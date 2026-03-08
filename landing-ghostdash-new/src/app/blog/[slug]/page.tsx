import { notFound } from "next/navigation";
import { Section } from "@/common/layout";
import { Heading } from "@/common/heading";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const generateStaticParams = async () => {
  // Add blog post slugs here when you have static content
  return [];
};

export const generateMetadata = async ({
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> => {
  return {
    title: "Blog Post | GhostDash",
  };
};

export default async function BlogPostPage({ params: _params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await _params;
  // Add your static blog post lookup here
  return notFound();
}
