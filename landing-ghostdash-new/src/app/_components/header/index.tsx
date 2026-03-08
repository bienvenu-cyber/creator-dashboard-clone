import { ButtonLink } from "@/common/button";
import { Pump } from "@/lib/static-pump";
import { siteConfig } from "@/config/site";

import { DesktopMenu, MobileMenu } from "./navigation-menu";
import { DarkLightImageAutoscale } from "@/common/dark-light-image";

export type HeaderLiksFragment = {
  _id: string;
  _title: string;
  href: string;
  sublinks: {
    items: Array<{
      _id: string;
      _title: string;
      link:
        | { __typename: "PageReferenceComponent"; page: { pathname: string; _title: string } }
        | { __typename: "ExternalLinkComponent"; text: string };
    }>;
  };
};

export type HeaderFragment = {
  navbar: { items: HeaderLiksFragment[] };
  rightCtas: {
    items: Array<{
      _id: string;
      href: string;
      label: string;
      type: "primary" | "secondary";
      icon: any;
    }>;
  };
};

export async function Header() {
  return (
    <Pump
      queries={[
        {
          site: siteConfig,
        },
      ]}
    >
      {async (data) => {
        "use server";
        const site = data?.[0]?.site;
        if (!site) {
          return null;
        }

        const { header, settings } = site;

        return (
          <header className="sticky left-0 top-0 z-100 flex w-full flex-col border-b border-border bg-surface-primary dark:border-dark-border dark:bg-dark-surface-primary">
            <div className="flex h-(--header-height) bg-surface-primary dark:bg-dark-surface-primary">
              <div className="container mx-auto grid w-full grid-cols-header place-items-center content-center items-center px-6 *:first:justify-self-start">
                <ButtonLink unstyled className="flex items-center ring-offset-2" href="/">
                  <DarkLightImageAutoscale priority {...settings.logo} />
                </ButtonLink>
                <DesktopMenu {...header} />
                <MobileMenu {...header} />
              </div>
            </div>
          </header>
        );
      }}
    </Pump>
  );
}
