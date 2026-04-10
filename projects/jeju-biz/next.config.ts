import type { NextConfig } from "next";
const basePath = process.env.NODE_ENV === "production" ? "/biz" : "";
const nextConfig: NextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
