// Site configuration - replaces BaseHub queries
export const siteConfig = {
  settings: {
    sitename: "GhostDash",
    titleTemplate: "%s | GhostDash",
    defaultTitle: "GhostDash - Professional Dashboard Replicas",
    defaultDescription: "Create professional dashboard replicas for OnlyFans, MYM, Shopify, Stripe and more. Perfect for content creators and agencies.",
    logo: {
      light: {
        url: "/logo-light.svg",
        alt: "GhostDash Logo",
        width: 150,
        height: 40,
        aspectRatio: "3.75",
        blurDataURL: "",
      },
      dark: {
        url: "/logo-dark.svg",
        alt: "GhostDash Logo",
        width: 150,
        height: 40,
        aspectRatio: "3.75",
        blurDataURL: "",
      },
    },
    favicon: {
      url: "/favicon.ico",
      mimeType: "image/x-icon",
    },
    ogImage: {
      url: "/og-image.jpg",
    },
    xAccount: {
      url: "https://x.com/ghostdash",
    },
    showUseTemplate: false,
  },
  header: {
    navbar: {
      items: [
        {
          _id: "nav-1",
          _title: "Features",
          href: "/#features",
          sublinks: { items: [] },
        },
        {
          _id: "nav-2",
          _title: "Dashboards",
          href: "/#dashboards",
          sublinks: { items: [] },
        },
        {
          _id: "nav-3",
          _title: "Pricing",
          href: "/#pricing",
          sublinks: { items: [] },
        },
        {
          _id: "nav-4",
          _title: "FAQ",
          href: "/#faq",
          sublinks: { items: [] },
        },
      ],
    },
    rightCtas: {
      items: [
        {
          _id: "cta-1",
          href: "/dashboard",
          label: "Get Started",
          type: "primary" as const,
          icon: null,
        },
      ],
    },
  },
  footer: {
    copyright: "© 2026 GhostDash. All rights reserved.",
    navbar: {
      items: [
        { _title: "Features", url: "/#features" },
        { _title: "Pricing", url: "/#pricing" },
        { _title: "FAQ", url: "/#faq" },
        { _title: "Contact", url: "/contact" },
      ],
    },
    socialLinks: [
      {
        _title: "Twitter",
        url: "https://twitter.com/ghostdash",
        icon: { url: "/icons/twitter.svg" },
      },
      {
        _title: "GitHub",
        url: "https://github.com/ghostdash",
        icon: { url: "/icons/github.svg" },
      },
    ],
    newsletter: {
      title: "Stay updated",
      description: "Get the latest updates on new dashboards and features.",
      submissions: {
        ingestKey: "newsletter",
        schema: [
          {
            id: "email",
            label: "Email",
            name: "email",
            type: "email" as const,
            required: true,
            placeholder: "Enter your email",
            defaultValue: "",
            helpText: "",
          },
        ],
      },
    },
  },
  generalEvents: {
    ingestKey: "general",
  },
};

export type SiteConfig = typeof siteConfig;
