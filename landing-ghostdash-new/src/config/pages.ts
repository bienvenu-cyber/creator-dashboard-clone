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
          text: "Trusted by content creators worldwide",
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
        title: "Create Professional Fake Dashboards Instantly",
        subtitle: "Generate realistic dashboard screenshots for OnlyFans, MYM, Shopify, Stripe and more. Unlimited customization for content creators and agencies.",
        actions: [
          {
            _id: "action-1",
            href: "/subscribe",
            label: "Subscribe Now",
            type: "primary" as const,
          },
          {
            _id: "action-2",
            href: "/login",
            label: "Login",
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
              _title: "Unlimited Dashboard Creation",
              description: "Create as many dashboards as you need with no limits",
              icon: "∞",
            },
            {
              _id: "feature-2",
              _title: "Full Customization",
              description: "Customize all metrics, dates, names and data fields",
              icon: "🎨",
            },
            {
              _id: "feature-3",
              _title: "High-Resolution Exports",
              description: "Download professional quality screenshots instantly",
              icon: "📸",
            },
            {
              _id: "feature-4",
              _title: "Add Your Branding",
              description: "Personalize dashboards with your own branding",
              icon: "🏷️",
            },
            {
              _id: "feature-5",
              _title: "Priority Email Support",
              description: "Get help when you need it with priority support",
              icon: "💬",
            },
            {
              _id: "feature-6",
              _title: "Cancel Anytime",
              description: "No long-term commitment, cancel your subscription anytime",
              icon: "✓",
            },
          ],
        },
      },
      {
        __typename: "PricingComponent" as const,
        _id: "pricing-1",
        _slug: "pricing",
        title: "Simple Pricing",
        subtitle: "Monthly subscription with full access",
        plans: {
          items: [
            {
              _id: "plan-1",
              _title: "Monthly Subscription",
              price: "€79",
              description: "Per month - Cancel anytime",
              features: [
                "Unlimited dashboard creation",
                "Full customization of all metrics",
                "High-resolution exports",
                "Add your own branding",
                "Priority email support",
                "Cancel anytime",
              ],
              cta: {
                _id: "cta-plan-1",
                href: "/subscribe",
                label: "Subscribe Now",
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
                "GhostDash is a tool that allows you to create professional fake dashboard screenshots for various platforms like OnlyFans, MYM, Shopify, and Stripe. Perfect for content creators and agencies.",
            },
            {
              _id: "q-2",
              _title: "How does the payment work?",
              answer:
                "We accept cryptocurrency payments (BTC, ETH, USDT). After payment, upload a screenshot and we'll activate your account within 24 hours.",
            },
            {
              _id: "q-3",
              _title: "Can I customize the data?",
              answer:
                "Absolutely! You have full customization of all metrics, dates, names, amounts, and any data fields displayed on the dashboards.",
            },
            {
              _id: "q-4",
              _title: "Can I cancel my subscription?",
              answer:
                "Yes, you can cancel your subscription at any time. No long-term commitment required.",
            },
            {
              _id: "q-5",
              _title: "What platforms are supported?",
              answer:
                "We support OnlyFans, MYM, Shopify, Stripe, and more platforms. New dashboards are added regularly.",
            },
            {
              _id: "q-6",
              _title: "How do I get support?",
              answer:
                "All subscribers get priority email support. You can also contact us on Telegram for faster assistance.",
            },
          ],
        },
      },
      {
        __typename: "CalloutComponent" as const,
        _id: "callout-1",
        _slug: "cta",
        title: "Ready to get started?",
        subtitle: "Get instant access to professional dashboard mockups",
        actions: [
          {
            _id: "cta-final-1",
            href: "/subscribe",
            label: "Subscribe Now - €79/month",
            type: "primary" as const,
            icon: null,
          },
        ],
      },
    ],
  },
};

export type PagesConfig = typeof pagesConfig;
