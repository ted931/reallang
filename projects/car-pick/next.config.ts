import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/car-pick" : "";

const nextConfig: NextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  serverExternalPackages: ["openai"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
