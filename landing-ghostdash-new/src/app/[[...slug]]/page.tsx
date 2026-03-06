import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Pump } from "@/lib/static-pump";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";

import { AccordionFaq } from "../_sections/accordion-faq";
import { BigFeature } from "../_sections/features/big-feature";
import { Callout } from "../_sections/callout-1";
import { Callout2 } from "../_sections/callout-2";
import { Companies } from "../_sections/companies";
import { Faq } from "../_sections/faq";
import { FeaturesGrid } from "../_sections/features/features-grid";
import { FeaturesList } from "../_sections/features/features-list";
import { Hero } from "../_sections/hero";
import { Pricing } from "../_sections/pricing";
import { SideFeatures } from "../_sections/features/side-features";
import { Testimonials } from "../_sections/testimonials";
import { TestimonialsGrid } from "../_sections/testimonials-grid";
import { PricingTable } from "../_sections/pricing-comparation";
import FeatureHero from "../_sections/features/hero";
import { PageView } from "../_components/page-view";
import { FreeformText } from "../_sections/freeform-text";
import { Form } from "../_sections/form";

export const dynamic = "force-static";

export const generateStaticParams = async () => {
  return Object.keys(pagesConfig).map((pathname) => ({
    slug: pathname === "/" ? undefined : pathname.split("/").filter(Boolean),
  }));
};

export const generateMetadata = async ({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata | undefined> => {
  const params = await _params;
  const pathname = params.slug ? `/${params.slug.join("/")}` : "/";
  const page = pagesConfig[pathname as keyof typeof pagesConfig];

  if (!page) {
    return notFound();
  }

  return {
    title: page.metadataOverrides.title ?? siteConfig.settings.defaultTitle,
    description: page.metadataOverrides.description ?? siteConfig.settings.defaultDescription,
  };
};

function SectionsUnion({
  comp,
  eventsKey,
}: {
  comp: any;
  eventsKey: string;
}): React.ReactNode {
  switch (comp.__typename) {
    case "HeroComponent":
      return <Hero {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "FeaturesCardsComponent":
      return <FeaturesList {...comp} key={comp._id} />;
    case "FeaturesGridComponent":
      return <FeaturesGrid {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "CompaniesComponent":
      return <Companies {...comp} key={comp._id} />;
    case "FeaturesBigImageComponent":
      return <BigFeature {...comp} key={comp._id} />;
    case "FeaturesSideBySideComponent":
      return <SideFeatures {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "CalloutComponent":
      return <Callout {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "CalloutV2Component":
      return <Callout2 {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "TestimonialSliderComponent":
      return <Testimonials {...comp} key={comp._id} />;
    case "TestimonialsGridComponent":
      return <TestimonialsGrid {...comp} key={comp._id} />;
    case "PricingComponent":
      return <Pricing {...comp} key={comp._id} />;
    case "FaqComponent":
      return <Faq {...comp} key={comp._id} />;
    case "PricingTableComponent":
      return <PricingTable {...comp} key={comp._id} />;
    case "FeatureHeroComponent":
      return <FeatureHero {...comp} key={comp._id} eventsKey={eventsKey} />;
    case "FreeformTextComponent":
      return <FreeformText {...comp} key={comp._id} />;
    case "FormComponent":
      return <Form {...comp} key={comp._id} />;
    default:
      return null;
  }
}

export default async function DynamicPage({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await _params;
  const pathname = params.slug ? `/${params.slug.join("/")}` : "/";
  const page = pagesConfig[pathname as keyof typeof pagesConfig];

  if (!page) notFound();

  return (
    <Pump
      queries={[
        {
          site: {
            pages: {
              items: [page],
            },
            generalEvents: siteConfig.generalEvents,
          },
        },
      ]}
    >
      {async ([
        {
          site: { pages, generalEvents },
        },
      ]) => {
        "use server";

        const currentPage = pages.items[0];
        const sections = currentPage.sections;

        return (
          <>
            <PageView ingestKey={generalEvents.ingestKey} />
            {sections?.map((section) => {
              return (
                <div key={section._id} id={section._slug}>
                  <SectionsUnion comp={section} eventsKey={generalEvents.ingestKey} />
                </div>
              );
            })}
          </>
        );
      }}
    </Pump>
  );
}
