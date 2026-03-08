import { Section } from "@/common/layout";
import { Heading } from "@/common/heading";
import type { HeadingFragment, QuoteFragment } from "@/lib/basehub/fragments";

import { Slider } from "./slider";

export type TestimonialsSlider = {
  heading: HeadingFragment;
  quotes: QuoteFragment[];
};

export function Testimonials({ heading, quotes }: TestimonialsSlider) {
  return (
    <div className="relative overflow-clip">
      <Section>
        <Slider quotes={quotes}>
          {heading.align === "none" ? (
            <div />
          ) : (
            <Heading className="self-stretch" {...heading}>
              <h4>{heading.title}</h4>
            </Heading>
          )}
        </Slider>
      </Section>
    </div>
  );
}
