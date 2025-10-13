import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during build
  },
  // Add other config options here if needed
};

export default nextConfig;
