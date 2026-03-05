import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Clock,
  Check,
  Sparkles,
  Lock,
  Download,
  Star
} from "lucide-react";

export function GhostDashLanding() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const dashboards = [
    { name: "OnlyFans", color: "from-blue-500 to-cyan-500" },
    { name: "MYM", color: "from-purple-500 to-pink-500" },
    { name: "Infloww", color: "from-orange-500 to-red-500" },
    { name: "Shopify", color: "from-green-500 to-emerald-500" },
    { name: "Stripe", color: "from-indigo-500 to-blue-500" },
    { name: "Fanvue", color: "from-rose-500 to-pink-500" }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Access",
      description: "Get your custom dashboard in seconds. No waiting, no hassle."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Perfect Replicas",
      description: "Pixel-perfect dashboards that look exactly like the real thing."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Access your dashboards anytime, anywhere, on any device."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Easy Customization",
      description: "Customize every detail to match your exact needs."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Platform",
      description: "Select from OnlyFans, MYM, Infloww, Shopify, Stripe, and more."
    },
    {
      number: "02",
      title: "Customize Details",
      description: "Add your data, adjust numbers, and personalize every element."
    },
    {
      number: "03",
      title: "Download & Use",
      description: "Get instant access to your professional dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-blue-950/80 backdrop-blur-lg border-b border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/welcome" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                GhostDash
              </span>
            </Link>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 px-4 py-1">
                Professional Dashboard Generator
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent"
            >
              Create Professional
              <br />
              Dashboards Instantly
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Simplify everything with GhostDash. Generate perfect replicas of OnlyFans, MYM, Infloww, Shopify, Stripe dashboards and more — effortless control, all in one place.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/10 px-8 py-6 text-lg">
                View Examples
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
