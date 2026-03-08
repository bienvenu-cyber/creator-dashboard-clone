import { BaseHubImage } from "@/lib/static-image";

import { Heading } from "@/common/heading";
import { Section } from "@/common/layout";
import type { HeadingFragment, DarkLightImageFragment } from "@/lib/basehub/fragments";
import { Pump } from "@/lib/static-pump";
import clsx from "clsx";
import { DarkLightImage } from "@/common/dark-light-image";
import { TrackedButtonLink } from "@/app/_components/tracked_button";

import s from "./hero.module.scss";
import type { GeneralEvents } from "@/../basehub-types";

export type FeatureHero = {
  _analyticsKey?: string;
  heroLayout: string;
  heading: HeadingFragment;
  image: DarkLightImageFragment;
  actions?: {
    _id: string;
    href: string;
    label: string;
    type: "primary" | "secondary" | "tertiary";
  }[];
};

export default function FeatureHero({
  heading,
  heroLayout,
  image,
  actions,
  eventsKey,
}: FeatureHero & { eventsKey: GeneralEvents["ingestKey"] }) {
  switch (heroLayout) {
    case "Image bottom": {
      return (
        <Section>
          <div className="flex flex-col gap-6">
            <Heading {...heading}>
              <h4>{heading.title}</h4>
            </Heading>
            <div className="flex justify-center gap-3">
              {actions?.map((action) => (
                <TrackedButtonLink
                  key={action._id}
                  analyticsKey={eventsKey}
                  href={action.href}
                  intent={action.type}
                  name="cta_click"
                  size="lg"
                >
                  {action.label}
                </TrackedButtonLink>
              ))}
            </div>
          </div>
          <DarkLightImage
            priority
            className="border-border dark:border-dark-border block rounded-lg border"
            {...image}
          />
        </Section>
      );
    }
    case "Image Right": {
      return (
        <Section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-6 lg:pr-16">
              <Heading {...heading} align="left">
                <h4>{heading.title}</h4>
              </Heading>
              <div className="flex justify-start gap-3">
                {actions?.map((action) => (
                  <TrackedButtonLink
                    key={action._id}
                    analyticsKey={eventsKey}
                    href={action.href}
                    intent={action.type}
                    name="cta_click"
                    size="lg"
                  >
                    {action.label}
                  </TrackedButtonLink>
                ))}
              </div>
            </div>
            <DarkLightImage
              priority
              className="border-border dark:border-dark-border block flex-1 rounded-lg border lg:w-1/2"
              {...image}
            />
          </div>
        </Section>
      );
    }
    case "full image": {
      return (
        <>
          <DarkLightImage
            {...image}
            priority
            className="border-border dark:border-dark-border block max-h-[720px] w-full border-y border-t-0 object-cover"
          />
          <Section>
            <div className="flex items-center justify-between self-stretch">
              <Heading {...heading} align="left">
                <h4>{heading.title}</h4>
              </Heading>
              {actions && actions.length > 0 ? (
                <div className="flex gap-3">
                  {actions.map((action) => (
                    <TrackedButtonLink
                      key={action._id}
                      analyticsKey={eventsKey}
                      href={action.href}
                      intent={action.type}
                      name="cta_click"
                      size="lg"
                    >
                      {action.label}
                    </TrackedButtonLink>
                  ))}
                </div>
              ) : null}
            </div>
          </Section>
        </>
      );
    }
    case "gradient": {
      return (
        <Section>
          <div className="z-10 flex flex-col items-center gap-8">
            <Heading {...heading}>
              <h4>{heading.title}</h4>
            </Heading>
            <div className="flex gap-3">
              {actions
                ? actions.map((action) => (
                    <TrackedButtonLink
                      key={action._id}
                      analyticsKey={eventsKey}
                      href={action.href}
                      intent={action.type}
                      name="cta_click"
                      size="lg"
                    >
                      {action.label}
                    </TrackedButtonLink>
                  ))
                : null}
            </div>
          </div>
          <div
            className={clsx(
              "absolute -top-1/2 left-1/2 z-0 h-[400px] w-[60vw] -translate-x-1/2 scale-150 rounded-[50%]",
              s.gradient,
            )}
          />
        </Section>
      );
    }
    default: {
      return null;
    }
  }
}
