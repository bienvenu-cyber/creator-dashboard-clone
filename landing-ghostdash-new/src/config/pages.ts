// Pages configuration - replaces BaseHub page queries
export const pagesConfig = {
  "/": {
    _id: "home",
    _analyticsKey: "home",
    pathname: "/",
    metadataOverrides: {
      title: null,
      description: null,
    },
    sections: [
      {
        __typename: "HeroComponent" as const,
        _id: "hero-1",
        _slug: "hero",
        _analyticsKey: "hero",
        customerSatisfactionBanner: {
          text: "Trusted by 1000+ creators",
          avatars: {
            items: [
              {
                _id: "avatar-1",
                avatar: {
                  _title: "User 1",
                  image: {
                    url: "/avatars/avatar-1.jpg",
                    alt: "User 1",
                    width: 40,
                    height: 40,
                    aspectRatio: "1",
                    blurDataURL: "",
                  },
                },
              },
              {
                _id: "avatar-2",
                avatar: {
                  _title: "User 2",
                  image: {
                    url: "/avatars/avatar-2.jpg",
                    alt: "User 2",
                    width: 40,
                    height: 40,
                    aspectRatio: "1",
                    blurDataURL: "",
                  },
                },
              },
            ],
          },
        },
        title: "Professional Dashboard Replicas for Content Creators",
        subtitle: "Create convincing dashboard screenshots for OnlyFans, MYM, Shopify, Stripe and more. Perfect for agencies and content creators.",
        actions: [
          {
            _id: "action-1",
            href: "/dashboard",
            label: "Get Started Free",
            type: "primary" as const,
          },
          {
            _id: "action-2",
            href: "/#dashboards",
            label: "View Dashboards",
            type: "secondary" as const,
          },
        ],
      },
      {
        __typename: "CompaniesComponent" as const,
        _id: "companies-1",
        _slug: "platforms",
        subtitle: "Compatible with all major platforms",
        companies: [
          {
            _id: "company-1",
            _title: "OnlyFans",
            image: { url: "/platforms/onlyfans.svg", alt: "OnlyFans" },
            url: null,
          },
          {
            _id: "company-2",
            _title: "MYM",
            image: { url: "/platforms/mym.svg", alt: "MYM" },
            url: null,
          },
          {
            _id: "company-3",
            _title: "Shopify",
            image: { url: "/platforms/shopify.svg", alt: "Shopify" },
            url: null,
          },
          {
            _id: "company-4",
            _title: "Stripe",
            image: { url: "/platforms/stripe.svg", alt: "Stripe" },
            url: null,
          },
        ],
      },
      {
        __typename: "FeaturesGridComponent" as const,
        _id: "features-1",
        _slug: "features",
        _analyticsKey: "features",
        title: "Everything you need",
        subtitle: "Powerful features for professional results",
        features: {
          items: [
            {
              _id: "feature-1",
              _title: "Realistic Design",
              description: "Pixel-perfect replicas of real dashboards",
              icon: "✨",
            },
            {
              _id: "feature-2",
              _title: "Easy to Use",
              description: "Simple interface, no technical skills required",
              icon: "🎯",
            },
            {
              _id: "feature-3",
              _title: "Fast Export",
              description: "Download your screenshots instantly",
              icon: "⚡",
            },
            {
              _id: "feature-4",
              _title: "Multiple Platforms",
              description: "OnlyFans, MYM, Shopify, Stripe and more",
              icon: "🚀",
            },
          ],
        },
      },
      {
        __typename: "PricingComponent" as const,
        _id: "pricing-1",
        _slug: "pricing",
        title: "Simple Pricing",
        subtitle: "Choose the plan that fits your needs",
        plans: {
          items: [
            {
              _id: "plan-1",
              _title: "Free",
              price: "$0",
              description: "Perfect for trying out",
              features: ["1 dashboard", "Basic features", "Watermark"],
              cta: {
                _id: "cta-plan-1",
                href: "/dashboard",
                label: "Get Started",
                type: "secondary" as const,
              },
            },
            {
              _id: "plan-2",
              _title: "Pro",
              price: "$29",
              description: "For professionals",
              features: [
                "All dashboards",
                "No watermark",
                "Priority support",
                "Custom branding",
              ],
              cta: {
                _id: "cta-plan-2",
                href: "/dashboard",
                label: "Start Free Trial",
                type: "primary" as const,
              },
            },
          ],
        },
      },
      {
        __typename: "FaqComponent" as const,
        _id: "faq-1",
        _slug: "faq",
        layout: "accordion" as const,
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know",
        questions: {
          items: [
            {
              _id: "q-1",
              _title: "What is GhostDash?",
              answer:
                "GhostDash is a tool that allows you to create professional dashboard replicas for various platforms like OnlyFans, MYM, Shopify, and Stripe.",
            },
            {
              _id: "q-2",
              _title: "Is it legal to use?",
              answer:
                "Yes, GhostDash is designed for legitimate purposes such as portfolio showcases, presentations, and educational content.",
            },
            {
              _id: "q-3",
              _title: "Can I customize the data?",
              answer:
                "Absolutely! You can customize all data fields including numbers, dates, names, and more.",
            },
            {
              _id: "q-4",
              _title: "Do you offer refunds?",
              answer:
                "Yes, we offer a 30-day money-back guarantee if you're not satisfied with the service.",
            },
          ],
        },
      },
      {
        __typename: "CalloutComponent" as const,
        _id: "callout-1",
        _slug: "cta",
        title: "Ready to get started?",
        subtitle: "Join thousands of creators using GhostDash",
        actions: [
          {
            _id: "cta-final-1",
            href: "/dashboard",
            label: "Start Free Trial",
            type: "primary" as const,
            icon: null,
          },
        ],
      },
    ],
  },
};

export type PagesConfig = typeof pagesConfig;
