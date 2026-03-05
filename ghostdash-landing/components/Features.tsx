import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Zap, Shield, Clock, Palette, Download, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Create professional dashboard replicas in seconds with our advanced technology.",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Access your dashboards anytime, anywhere, from any device.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Customize every detail to match your exact requirements.",
  },
  {
    icon: Download,
    title: "Export Ready",
    description: "Download high-quality screenshots and exports instantly.",
  },
  {
    icon: Lock,
    title: "Private & Confidential",
    description: "Your dashboards are private and never shared with anyone.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
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
            Why Choose <span className="text-blue-400">GhostDash</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create perfect dashboard replicas, all in one powerful platform.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="p-8 bg-blue-950/50 backdrop-blur-sm border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
