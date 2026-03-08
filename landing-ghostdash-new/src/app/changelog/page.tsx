import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Changelog | GhostDash",
    description: "Latest updates and changes to GhostDash",
  };
};

export default async function ChangelogPage() {
  return (
    <Section className="gap-16">
      <Heading align="left">
        <h2>Changelog</h2>
      </Heading>
      <p className="text-text-secondary dark:text-dark-text-secondary">
        No changelog entries yet. Check back soon!
      </p>
    </Section>
  );
}
