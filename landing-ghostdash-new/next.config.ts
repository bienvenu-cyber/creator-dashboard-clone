import { NextConfig } from "next";

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    // Add your image domains here if you use external images
    remotePatterns: [
      // Example: { hostname: "example.com" }
    ],
  },
} satisfies NextConfig;

export default nextConfig;
