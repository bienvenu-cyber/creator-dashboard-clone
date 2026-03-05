import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const dashboards = [
  {
    name: "OnlyFans",
    description: "Complete OnlyFans dashboard replica with all features",
    features: ["Earnings", "Subscribers", "Messages", "Statistics"],
    popular: true,
  },
  {
    name: "MYM",
    description: "Professional MYM dashboard with full customization",
    features: ["Revenue", "Fans", "Content", "Analytics"],
    popular: true,
  },
  {
    name: "Infloww",
    description: "Infloww agency dashboard for creators",
    features: ["Multi-account", "Team", "Reports", "Automation"],
    popular: false,
  },
  {
    name: "Shopify",
    description: "E-commerce dashboard for online stores",
    features: ["Sales", "Orders", "Products", "Customers"],
    popular: false,
  },
  {
    name: "Stripe",
    description: "Payment processing dashboard replica",
    features: ["Payments", "Balance", "Customers", "Reports"],
    popular: false,
  },
  {
    name: "Fanvue",
    description: "Fanvue creator dashboard with analytics",
    features: ["Earnings", "Fans", "Content", "Insights"],
    popular: false,
  },
];

export function Dashboards() {
  return (
    <section className="py-32 relative bg-gradient-to-b from-black to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Available <span className="text-blue-400">Dashboards</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose from our collection of professional dashboard replicas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboards.map((dashboard, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 bg-blue-950/30 backdrop-blur-sm border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    {dashboard.name}
                  </h3>
                  {dashboard.popular && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                      Popular
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-400 mb-6 flex-grow">
                  {dashboard.description}
                </p>

                <div className="space-y-3">
                  {dashboard.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
