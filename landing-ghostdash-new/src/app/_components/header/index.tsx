import { ButtonLink } from "@/common/button";
import { Pump } from "@/lib/static-pump";
import { siteConfig } from "@/config/site";

import { DesktopMenu, MobileMenu } from "./navigation-menu";
import { DarkLightImageAutoscale } from "@/common/dark-light-image";

export async function Header() {
  return (
    <Pump
      queries={[
        {
          site: siteConfig,
        },
      ]}
    >
      {async ([{ site }]) => {
        const { header, settings } = site;
        "use server";

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
