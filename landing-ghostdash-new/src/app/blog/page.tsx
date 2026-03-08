import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

// Static blog data - add your blog posts here
const blogPosts: any[] = [];

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Blog | GhostDash",
    description: "Latest updates and articles from GhostDash",
  };
};

export default async function BlogPage() {
  if (blogPosts.length === 0) {
    return (
      <Section className="gap-16">
        <Heading align="left">
          <h2>Blog</h2>
        </Heading>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          No blog posts yet. Check back soon!
        </p>
      </Section>
    );
  }

  return (
    <Section className="gap-16">
      <Heading align="left">
        <h2>Blog</h2>
      </Heading>
    </Section>
  );
}
