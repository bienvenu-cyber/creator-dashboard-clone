import { BaseHubImage } from "@/lib/static-image";
import Link from "next/link";

import { Pump } from "@/lib/static-pump";
import { siteConfig } from "@/config/site";

interface ChangelogLayoutProps {
  className?: string;
  contentClassName?: string;
  socialLinksClassName?: string;
  children?: React.ReactNode;
}

export function ChangelogLayout({
  className = "",
  contentClassName = "",
  children,
}: ChangelogLayoutProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-border dark:border-dark-border ${className}`}
    >
      <div
        className={`mx-auto flex w-full max-w-(--breakpoint-md) flex-col items-start justify-between gap-4 border-r border-border px-8 py-24 dark:border-dark-border md:flex-row md:items-center ${contentClassName}`}
      >
        {children}

        <div className="flex items-center gap-2 md:flex-col">
          <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary">
            Follow us
          </p>
          <div className="flex gap-2">
            {siteConfig.footer.socialLinks.map((link) => (
              <Link
                key={link._title}
                className="aspect-square hover:brightness-90"
                href={link.url}
                target="_blank"
              >
                <BaseHubImage
                  priority
                  alt={link._title}
                  height={18}
                  src={link.icon?.url ?? ""}
                  width={18}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
