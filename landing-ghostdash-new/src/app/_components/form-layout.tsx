import type { ButtonFragment } from "@/lib/basehub/fragments";
import { Pump } from "@/lib/static-pump";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";

export async function FormLayout({
  children,
  title,
  subtitle,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-xl border border-surface-secondary bg-surface-primary p-5 shadow-md dark:border-dark-border dark:bg-dark-surface-secondary dark:shadow-none">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium">{title}</h1>
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
            {subtitle}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

export function RichTextFormWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
