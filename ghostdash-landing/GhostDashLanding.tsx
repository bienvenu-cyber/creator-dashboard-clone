import { motion } from "framer-motion";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Dashboards } from "./components/Dashboards";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export function GhostDashLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      <Hero />
      <Features />
      <Dashboards />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
