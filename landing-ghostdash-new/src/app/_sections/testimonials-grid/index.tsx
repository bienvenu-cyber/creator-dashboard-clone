import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import type { HeadingFragment, QuoteFragment } from "@/lib/basehub/fragments";

import { TestimonialsGridClient } from "./testimonials-list";

export type TestimonialsGrid = {
  heading: HeadingFragment;
  quotes: QuoteFragment[];
};

export function TestimonialsGrid({ heading, quotes }: TestimonialsGrid) {
  return (
    <Section>
      <Heading {...heading}>
        <h4>{heading.title}</h4>
      </Heading>
      <TestimonialsGridClient quotes={quotes} />
    </Section>
  );
}
