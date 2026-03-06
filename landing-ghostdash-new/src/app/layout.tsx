import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";

import { Providers } from "./providers";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { Newsletter } from "./_sections/newsletter";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["monaco", "monospace"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  const { settings } = siteConfig;
  const images = [{ url: settings.ogImage.url }];

  let xAccount: string | undefined = undefined;

  if (settings.xAccount) {
    try {
      const xUrl = new URL(settings.xAccount.url);
      const split = xUrl.pathname.split("/");
      xAccount = split[split.length - 1];
    } catch {
      // invalid url noop
    }
  }

  return {
    title: {
      default: settings.defaultTitle,
      template: settings.titleTemplate,
    },
    applicationName: settings.sitename,
    description: settings.defaultDescription,
    icons: [
      {
        url: settings.favicon.url,
        rel: "icon",
        type: settings.favicon.mimeType,
      },
    ],
    openGraph: { type: "website", images, siteName: settings.sitename },
    twitter: {
      card: "summary_large_image",
      images,
      site: settings.sitename,
      creator: xAccount,
    },
  };
};

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`min-h-svh max-w-[100vw] bg-surface-primary text-text-primary dark:bg-dark-surface-primary dark:text-dark-text-primary ${geistMono.variable} ${geist.variable} font-sans`}
      >
        <Providers>
          <Header />
          <main className="min-h-[calc(100svh-var(--header-height))]">{children}</main>
          <Newsletter />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
