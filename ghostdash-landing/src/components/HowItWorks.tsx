import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { MousePointerClick, Settings, Download } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Choose Your Dashboard",
    description: "Select from OnlyFans, MYM, Infloww, Shopify, Stripe, and more platforms.",
    step: "01",
  },
  {
    icon: Settings,
    title: "Customize Details",
    description: "Enter your data and customize every aspect to match your needs perfectly.",
    step: "02",
  },
  {
    icon: Download,
    title: "Generate & Export",
    description: "Get your professional dashboard replica instantly, ready to use or download.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How It <span className="text-blue-400">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to create your perfect dashboard replica
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <Card className="p-8 bg-blue-950/50 backdrop-blur-sm border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 relative">
                  <step.icon className="w-10 h-10 text-white" />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-950 border-2 border-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-400">
                      {step.step}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
