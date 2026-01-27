import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["example.com"],
  },
};

export default nextConfig;
